package com.gettipsi.stripe;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.gettipsi.stripe.util.Action;
import com.gettipsi.stripe.util.Converters;
import com.gettipsi.stripe.util.Fun0;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.BooleanResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.identity.intents.model.CountrySpecification;
import com.google.android.gms.wallet.Cart;
import com.google.android.gms.wallet.FullWallet;
import com.google.android.gms.wallet.FullWalletRequest;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.LineItem;
import com.google.android.gms.wallet.MaskedWallet;
import com.google.android.gms.wallet.MaskedWalletRequest;
import com.google.android.gms.wallet.PaymentMethodTokenizationParameters;
import com.google.android.gms.wallet.PaymentMethodTokenizationType;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;
import com.stripe.android.model.Token;

import java.util.ArrayList;

import static com.gettipsi.stripe.util.Converters.convertTokenToWritableMap;
import static com.gettipsi.stripe.util.Converters.getAllowedShippingCountries;
import static com.gettipsi.stripe.util.Converters.putExtraToTokenMap;
import static com.gettipsi.stripe.util.PayParams.CURRENCY_CODE;
import static com.gettipsi.stripe.util.PayParams.DESCRIPTION;
import static com.gettipsi.stripe.util.PayParams.LINE_ITEMS;
import static com.gettipsi.stripe.util.PayParams.QUANTITY;
import static com.gettipsi.stripe.util.PayParams.SHIPPING_ADDRESS_REQUIRED;
import static com.gettipsi.stripe.util.PayParams.TOTAL_PRICE;
import static com.gettipsi.stripe.util.PayParams.UNIT_PRICE;

/**
 * Created by ngoriachev on 13/03/2018
 */

public class ObsoleteApiPayFlowImpl extends PayFlow {

  public static final String TAG = ObsoleteApiPayFlowImpl.class.getSimpleName();

  private static final int LOAD_MASKED_WALLET_REQUEST_CODE = 100502;
  private static final int LOAD_FULL_WALLET_REQUEST_CODE = 100503;

  private Promise mPayPromise;
  private GoogleApiClient mGoogleApiClient;
  private ReadableMap mAndroidPayParams;

  public ObsoleteApiPayFlowImpl(@NonNull Fun0<Activity> activityProvider) {
    super(activityProvider);
  }

  @Override
  public void deviceSupportsAndroidPay(boolean isExistingPaymentMethodRequired, // unsupported
                                       final Promise promise) {
    Activity activity = activityProvider.call();
    if (activity == null) {
      promise.reject(TAG, NO_CURRENT_ACTIVITY_MSG);
      return;
    }

    if (!isPlayServicesAvailable(activity)) {
      promise.reject(TAG, PLAY_SERVICES_ARE_NOT_AVAILABLE_MSG);
      return;
    }

    connectAndCheckIsWalletReadyToPay(promise);
  }

  @Override
  public boolean onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (mPayPromise == null) {
      return false;
    }

    switch (requestCode) {
      case LOAD_MASKED_WALLET_REQUEST_CODE:
        handleLoadMascedWaletRequest(resultCode, data);
        return true;
      case LOAD_FULL_WALLET_REQUEST_CODE:
        handleLoadFullWalletRequest(resultCode, data);
        return true;
      default:
        return false;
    }

  }

  @Override
  public void paymentRequestWithAndroidPay(final ReadableMap payParams, final Promise promise) {
    mPayPromise = promise;
    connectAndCheckIsWalletReadyToPayAndLoadMaskedWallet(payParams);
  }

  private void handleLoadFullWalletRequest(int resultCode, Intent data) {
    if (resultCode == Activity.RESULT_OK) {
      FullWallet fullWallet = data.getParcelableExtra(WalletConstants.EXTRA_FULL_WALLET);
      String tokenJSON = fullWallet.getPaymentMethodToken().getToken();
      Token token = Token.fromString(tokenJSON);
      if (token == null) {
        // Log the error and notify Stripe help
        mPayPromise.reject(TAG, JSON_PARSING_ERROR_MSG);
      } else {
        mPayPromise.resolve(putExtraToTokenMap(
          convertTokenToWritableMap(token),
          fullWallet.getBuyerBillingAddress(),
          fullWallet.getBuyerShippingAddress(),
          fullWallet.getEmail()));
      }
    } else if (resultCode == Activity.RESULT_CANCELED) {
      mPayPromise.reject(TAG, PURCHASE_CANCELLED_MSG);
    } else {
      mPayPromise.reject(TAG, PURCHASE_LOAD_FULL_WALLET_ERROR_MSG);
    }
    disconnect(mGoogleApiClient);
  }

  private void connectAndCheckIsWalletReadyToPay(final Promise promise) {
    Activity activity = activityProvider.call();
    if (activity == null) {
      promise.reject(TAG, NO_CURRENT_ACTIVITY_MSG);
      return;
    }

    mGoogleApiClient = buildGoogleApiClientWithConnectedCallback(
      activity,
      getEnvironment(),
      new Action<String>() { public void call(String errorMsg) {
        promise.reject(TAG, errorMsg);
        disconnect(mGoogleApiClient);
      }},
      new Action<Bundle>() { public void call(Bundle bundle) {
        isWalletReadyToPay(mGoogleApiClient, promise);
      }});
    mGoogleApiClient.connect();
  }

  private void connectAndCheckIsWalletReadyToPayAndLoadMaskedWallet(final ReadableMap payParams) {
    final Activity activity = activityProvider.call();
    if (activity == null) {
      mPayPromise.reject(TAG, NO_CURRENT_ACTIVITY_MSG);
      return;
    }

    mGoogleApiClient = buildGoogleApiClientWithConnectedCallback(
      activity,
      getEnvironment(),
      new Action<String>() { public void call(String errorMsg) {
        mPayPromise.reject(TAG, errorMsg);
        disconnect(mGoogleApiClient);
      }},
      new Action<Bundle>() { public void call(Bundle bundle) {
        checkIsWalletReadyToPayAndLoadMaskedWallet(mGoogleApiClient, mPayPromise, payParams, activity);
      }});
    mGoogleApiClient.connect();
  }

  private static void disconnect(GoogleApiClient googleApiClient) {
    if (googleApiClient != null) {
      googleApiClient.disconnect();
    }
  }

  private void handleLoadMascedWaletRequest(int resultCode, Intent data) {
    if (resultCode == Activity.RESULT_OK) {

      MaskedWallet maskedWallet = data.getParcelableExtra(WalletConstants.EXTRA_MASKED_WALLET);

      final Cart.Builder cartBuilder = Cart.newBuilder()
        .setCurrencyCode(mAndroidPayParams.getString(CURRENCY_CODE))
        .setTotalPrice(mAndroidPayParams.getString(TOTAL_PRICE));

      final ReadableArray lineItems = mAndroidPayParams.getArray(LINE_ITEMS);
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

      Wallet.Payments.loadFullWallet(mGoogleApiClient, fullWalletRequest, LOAD_FULL_WALLET_REQUEST_CODE);
    } else {
      mPayPromise.reject(TAG, PURCHASE_LOAD_MASKED_WALLET_ERROR_MSG);
      disconnect(mGoogleApiClient);
    }
  }

  private static void isWalletReadyToPay(final GoogleApiClient googleApiClient, final Promise promise) {
    isWalletReadyToPay(
      googleApiClient,
      new ResultCallback<BooleanResult>() { public void onResult(@NonNull BooleanResult result) {
        if (result.getStatus().isSuccess()) {
          promise.resolve(result.getValue());
        } else {
          promise.reject(TAG, result.getStatus().getStatusMessage());
        }
        disconnect(googleApiClient);
      }});
  }

  private static void isWalletReadyToPay(GoogleApiClient gac, ResultCallback<BooleanResult> callback) {
    Wallet.Payments.isReadyToPay(gac, IsReadyToPayRequest.newBuilder().build()).setResultCallback(callback);
  }

  private void checkIsWalletReadyToPayAndLoadMaskedWallet(final GoogleApiClient googleApiClient,
                                                          final Promise promise,
                                                          final ReadableMap payParams,
                                                          final Activity activity
  ) {
    isWalletReadyToPay(
      googleApiClient,
      new ResultCallback<BooleanResult>() {
        @Override
        public void onResult(@NonNull BooleanResult result) {
          if (result.getStatus().isSuccess()) {
            if (result.getValue()) {
              mAndroidPayParams = payParams;
              final String estimatedTotalPrice = payParams.getString(TOTAL_PRICE);
              final String currencyCode = payParams.getString(CURRENCY_CODE);
              final Boolean shippingAddressRequired = Converters.getValue(payParams, SHIPPING_ADDRESS_REQUIRED, true);
              final ArrayList<CountrySpecification> allowedCountries = getAllowedShippingCountries(payParams);
              final MaskedWalletRequest maskedWalletRequest = createWalletRequest(estimatedTotalPrice, currencyCode, shippingAddressRequired, allowedCountries);
              Wallet.Payments.loadMaskedWallet(googleApiClient, maskedWalletRequest, LOAD_MASKED_WALLET_REQUEST_CODE);
            } else {
              androidPayUnavailableDialog(activity);
              promise.reject(TAG, ANDROID_PAY_UNAVAILABLE_ERROR_MSG);
              disconnect(googleApiClient);
            }
          } else {
            androidPayUnavailableDialog(activity);
            promise.reject(TAG, MAKING_IS_READY_TO_PAY_CALL_ERROR_MSG);
            disconnect(googleApiClient);
          }
        }
      });
  }

  private static GoogleApiClient buildGoogleApiClientWithConnectedCallback(Activity activity,
                                                                           int env,
                                                                           final Action<String> onError,
                                                                           final Action<Bundle> onConnected) {
    GoogleApiClient googleApiClient = new GoogleApiClient.Builder(activity)
      .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
        @Override
        public void onConnected(@Nullable Bundle bundle) {
          onConnected.call(bundle);
        }

        @Override
        public void onConnectionSuspended(int i) {
          onError.call("onConnectionSuspended i = " + i);
        }
      })
      .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
        @Override
        public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
          onError.call("onConnectionFailed: " + connectionResult.getErrorMessage());
        }
      })
      .addApi(Wallet.API, new Wallet.WalletOptions.Builder()
        .setEnvironment(env)
        .setTheme(WalletConstants.THEME_LIGHT)
        .build())
      .build();
    return googleApiClient;
  }

  private MaskedWalletRequest createWalletRequest(final String estimatedTotalPrice,
                                                  final String currencyCode,
                                                  final Boolean shippingAddressRequired,
                                                  final ArrayList<CountrySpecification> countries) {
    final MaskedWalletRequest maskedWalletRequest = MaskedWalletRequest.newBuilder()

      // Request credit card tokenization with Stripe by specifying tokenization parameters:
      .setPaymentMethodTokenizationParameters(PaymentMethodTokenizationParameters.newBuilder()
        .setPaymentMethodTokenizationType(PaymentMethodTokenizationType.PAYMENT_GATEWAY)
        .addParameter("gateway", "stripe")
        .addParameter("stripe:publishableKey", getPublishableKey())
        .addParameter("stripe:version", com.stripe.android.BuildConfig.VERSION_NAME)
        .build())
      // You want the shipping address:
      .setShippingAddressRequired(shippingAddressRequired)
      .addAllowedCountrySpecificationsForShipping(countries)
      // Price set as a decimal:
      .setEstimatedTotalPrice(estimatedTotalPrice)
      .setCurrencyCode(currencyCode)
      .build();
    return maskedWalletRequest;
  }

  private void androidPayUnavailableDialog(@NonNull Activity activity) {
    new AlertDialog.Builder(activity)
      .setMessage(R.string.gettipsi_android_pay_unavaliable)
      .setPositiveButton(android.R.string.ok, null)
      .show();
  }
}
