package com.gettipsi.stripe;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.gettipsi.stripe.dialog.AddCardDialogFragment;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.BooleanResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.wallet.Cart;
import com.google.android.gms.wallet.FullWallet;
import com.google.android.gms.wallet.FullWalletRequest;
import com.google.android.gms.wallet.LineItem;
import com.google.android.gms.wallet.MaskedWallet;
import com.google.android.gms.wallet.MaskedWalletRequest;
import com.google.android.gms.wallet.PaymentMethodTokenizationParameters;
import com.google.android.gms.wallet.PaymentMethodTokenizationType;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;
import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.model.Card;
import com.stripe.android.model.Token;
import com.stripe.exception.AuthenticationException;

public class StripeModule extends ReactContextBaseJavaModule {

  private static final String TAG = StripeModule.class.getSimpleName();
  private static final String MODULE_NAME = "StripeModule";

  private static final int LOAD_MASKED_WALLET_REQUEST_CODE = 100502;
  private static final int LOAD_FULL_WALLET_REQUEST_CODE = 100503;

  public static final int mEnvironment = WalletConstants.ENVIRONMENT_TEST;
  private static final String PURCHASE_CANCELLED = "PURCHASE_CANCELLED";

  //androidPayParams keys:
  private static final String CURRENCY_CODE = "currency_code";
  private static final String TOTAL_PRICE = "total_price";
  private static final String UNIT_PRICE = "unit_price";
  private static final String LINE_ITEMS = "line_items";
  private static final String QUANTITY = "quantity";
  private static final String DESCRIPTION = "description";


  private Promise payPromise;

  private String publicKey;
  private Stripe stripe;
  private GoogleApiClient googleApiClient;

  private ReadableMap androidPayParams;

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

      if (payPromise != null) {
        if (requestCode == LOAD_MASKED_WALLET_REQUEST_CODE) { // Unique, identifying constant

          handleLoadMascedWaletRequest(resultCode, data);

        } else if (requestCode == LOAD_FULL_WALLET_REQUEST_CODE) {
          if (resultCode == Activity.RESULT_OK) {
            FullWallet fullWallet = data.getParcelableExtra(WalletConstants.EXTRA_FULL_WALLET);
            String tokenJSON = fullWallet.getPaymentMethodToken().getToken();

            //A token will only be returned in production mode,
            //i.e. WalletConstants.ENVIRONMENT_PRODUCTION
            if (mEnvironment == WalletConstants.ENVIRONMENT_PRODUCTION) {
              com.stripe.model.Token token = com.stripe.model.Token.GSON.fromJson(
                tokenJSON, com.stripe.model.Token.class);

              Log.d(TAG, "onActivityResult: Stripe Token: " + token.toString());

              // TODO: send token to your server
              payPromise.resolve(token.toString());
            }
          }
        } else {
          super.onActivityResult(requestCode, resultCode, data);
        }
      }
    }
  };


  public StripeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // Add the listener for `onActivityResult`
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void init(ReadableMap options) {
    publicKey = options.getString("publishableKey");
    try {
      stripe = new Stripe(publicKey);
    } catch (AuthenticationException e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void createTokenWithCard(ReadableMap cardData, final Promise promise) {
    Card card = new Card(
      cardData.getString("number"),
      cardData.getInt("expMonth"),
      cardData.getInt("expYear"),
      cardData.getString("cvc"));

    stripe.createToken(card,
      publicKey,
      new TokenCallback() {
        public void onSuccess(Token token) {
          WritableMap newToken = Arguments.createMap();
          newToken.putString("tokenId", token.getId());
          newToken.putBoolean("livemode", token.getLivemode());
          newToken.putBoolean("user", token.getUsed());
          promise.resolve(newToken);
        }

        public void onError(Exception error) {
          error.printStackTrace();
          promise.reject(error.getMessage());
        }
      });
  }


  @ReactMethod
  public void paymentRequestWithCardForm(ReadableMap unused, final Promise promise) {
    if (getCurrentActivity() != null) {
      final AddCardDialogFragment cardDialog = AddCardDialogFragment.newInstance(publicKey);
      cardDialog.setPromise(promise);
      cardDialog.show(getCurrentActivity().getFragmentManager(), "AddNewCard");
    }
  }

  @ReactMethod
  public void paymentRequestWithAndroidPay(final ReadableMap map, final Promise promise) {
    Log.d(TAG, "startAndroidPay: ");
    if (getCurrentActivity() != null) {
      payPromise = promise;
      Log.d(TAG, "startAndroidPay: getCurrentActivity() != null");
      startAndroidPayNew(getCurrentActivity(), map);
    }
  }

  private void startAndroidPayNew(final Activity activity, final ReadableMap map) {
    googleApiClient = new GoogleApiClient.Builder(activity)
      .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
        @Override
        public void onConnected(@Nullable Bundle bundle) {
          Log.d(TAG, "onConnected: ");
          Wallet.Payments.isReadyToPay(googleApiClient).setResultCallback(
            new ResultCallback<BooleanResult>() {
              @Override
              public void onResult(@NonNull BooleanResult booleanResult) {
                Log.d(TAG, "onResult: ");
                if (booleanResult.getStatus().isSuccess()) {
                  Log.d(TAG, "onResult: booleanResult.getStatus().isSuccess()");
                  if (booleanResult.getValue()) {
                    //TODO Work only in few countries. I don't now how test it in our coutries.
                    Log.d(TAG, "onResult: booleanResult.getValue()");
                    showAndroidPay(map);
                  } else {
                    Log.d(TAG, "onResult: !booleanResult.getValue()");
                    // Hide Android Pay buttons, show a message that Android Pay
                    // cannot be used yet, and display a traditional checkout button
                    androidPayUnavaliableDialog();
                    payPromise.reject("Android Pay unavaliable");
                  }
                } else {
                  // Error making isReadyToPay call
                  Log.e(TAG, "isReadyToPay:" + booleanResult.getStatus());
                  androidPayUnavaliableDialog();
                  payPromise.reject("Error making isReadyToPay call");
                }
              }
            }
          );
        }

        @Override
        public void onConnectionSuspended(int i) {
          Log.d(TAG, "onConnectionSuspended: ");
        }
      })
      .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
        @Override
        public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
          Log.d(TAG, "onConnectionFailed: ");
        }
      })
      .addApi(Wallet.API, new Wallet.WalletOptions.Builder()
        .setEnvironment(WalletConstants.ENVIRONMENT_TEST)
        .setTheme(WalletConstants.THEME_LIGHT)
        .build())
      .build();
    googleApiClient.connect();
  }

  private void showAndroidPay(final ReadableMap map) {
    androidPayParams = map;
    final String estimatedTotalPrice = map.getString(TOTAL_PRICE);
    final String currencyCode = map.getString(CURRENCY_CODE);
    final MaskedWalletRequest maskedWalletRequest = createWalletRequest(estimatedTotalPrice, currencyCode);
    Wallet.Payments.loadMaskedWallet(googleApiClient, maskedWalletRequest, LOAD_MASKED_WALLET_REQUEST_CODE);
  }

  private MaskedWalletRequest createWalletRequest(final String estimatedTotalPrice, final String currencyCode) {

    final MaskedWalletRequest maskedWalletRequest = MaskedWalletRequest.newBuilder()

      // Request credit card tokenization with Stripe by specifying tokenization parameters:
      .setPaymentMethodTokenizationParameters(PaymentMethodTokenizationParameters.newBuilder()
        .setPaymentMethodTokenizationType(PaymentMethodTokenizationType.PAYMENT_GATEWAY)
        .addParameter("gateway", "stripe")
        .addParameter("stripe:publishableKey", publicKey)
        .addParameter("stripe:version", com.stripe.Stripe.VERSION)
        .build())
      // You want the shipping address:
      .setShippingAddressRequired(true)

      // Price set as a decimal:
      .setEstimatedTotalPrice(estimatedTotalPrice)
      .setCurrencyCode(currencyCode)
      .build();
    return maskedWalletRequest;
  }

  private void androidPayUnavaliableDialog() {
    new AlertDialog.Builder(getCurrentActivity())
      .setMessage(R.string.android_pay_unavaliable)
      .setPositiveButton(android.R.string.ok, null)
      .show();
  }

  private void handleLoadMascedWaletRequest(int resultCode, Intent data) {
    if (resultCode == Activity.RESULT_OK) {
      MaskedWallet maskedWallet = data.getParcelableExtra(WalletConstants.EXTRA_MASKED_WALLET);

      final Cart.Builder cartBuilder = Cart.newBuilder()
        .setCurrencyCode(androidPayParams.getString(CURRENCY_CODE))
        .setTotalPrice(androidPayParams.getString(TOTAL_PRICE));

      final ReadableArray lineItems = androidPayParams.getArray(LINE_ITEMS);
      if (lineItems != null) {
        for (int i = 0; i < lineItems.size(); i++) {
          final ReadableMap lineItem = lineItems.getMap(i);
          cartBuilder.addLineItem(LineItem.newBuilder() // Identify item being purchased
            .setCurrencyCode(lineItem.getString(CURRENCY_CODE))
            .setQuantity(lineItem.getString(QUANTITY))
            .setDescription(DESCRIPTION)
            .setTotalPrice(TOTAL_PRICE)
            .setUnitPrice(UNIT_PRICE)
            .build());
        }
      }

      final FullWalletRequest fullWalletRequest = FullWalletRequest.newBuilder()
        .setCart(cartBuilder.build())
        .setGoogleTransactionId(maskedWallet.getGoogleTransactionId())
        .build();

      Wallet.Payments.loadFullWallet(googleApiClient, fullWalletRequest, LOAD_FULL_WALLET_REQUEST_CODE);
    } else {
      payPromise.reject(PURCHASE_CANCELLED, "Purchase was cancelled");
    }
  }
}
