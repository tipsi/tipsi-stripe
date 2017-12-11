package com.gettipsi.stripe;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.text.TextUtils;

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
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.BooleanResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
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
import com.google.android.gms.identity.intents.model.UserAddress;
import com.google.android.gms.identity.intents.model.CountrySpecification;
import com.google.android.gms.identity.intents.model.CountrySpecification;

import com.stripe.android.BuildConfig;
import com.stripe.android.SourceCallback;
import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.exception.APIConnectionException;
import com.stripe.android.exception.APIException;
import com.stripe.android.exception.AuthenticationException;
import com.stripe.android.exception.CardException;
import com.stripe.android.exception.InvalidRequestException;
import com.stripe.android.model.Address;
import com.stripe.android.model.BankAccount;
import com.stripe.android.model.Card;
import com.stripe.android.model.Source;
import com.stripe.android.model.SourceCodeVerification;
import com.stripe.android.model.SourceOwner;
import com.stripe.android.model.SourceParams;
import com.stripe.android.model.SourceReceiver;
import com.stripe.android.model.SourceRedirect;
import com.stripe.android.model.Token;

import com.gettipsi.stripe.dialog.AddCardDialogFragment;
import com.gettipsi.stripe.dialog.EnterAddressDialogFragment;
import com.gettipsi.stripe.util.DataUtil;
import com.gettipsi.stripe.util.PlainAddress;

import java.util.Map;

import java.util.List;
import java.util.ArrayList;

public class StripeModule extends ReactContextBaseJavaModule {


  private static final String TAG = StripeModule.class.getSimpleName();
  private static final String MODULE_NAME = "StripeModule";

  private static final int LOAD_MASKED_WALLET_REQUEST_CODE = 100502;
  private static final int LOAD_FULL_WALLET_REQUEST_CODE = 100503;

  private static final String PURCHASE_CANCELLED = "PURCHASE_CANCELLED";

  //androidPayParams keys:
  private static final String ANDROID_PAY_MODE = "androidPayMode";
  private static final String PRODUCTION = "production";
  private static final String CURRENCY_CODE = "currency_code";
  private static final String SHIPPING_ADDRESS_REQUIRED = "shipping_address_required";
  private static final String TOTAL_PRICE = "total_price";
  private static final String UNIT_PRICE = "unit_price";
  private static final String LINE_ITEMS = "line_items";
  private static final String QUANTITY = "quantity";
  private static final String DESCRIPTION = "description";

  private int mEnvironment = WalletConstants.ENVIRONMENT_PRODUCTION;

  private static StripeModule instance = null;

  public static StripeModule getInstance() {
    return instance;
  }

  public Stripe getStripe() {
    return stripe;
  }

  @Nullable
  private Promise createSourcePromise;
  private Promise payPromise;

  @Nullable
  private Source createdSource;

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
            Token token = Token.fromString(tokenJSON);
            if (token == null) {
              // Log the error and notify Stripe help
              Log.e(TAG, "onActivityResult: failed to create token from JSON string.");
              payPromise.reject("JsonParsingError", "Failed to create token from JSON string.");
            } else {
              payPromise.resolve(DataUtil.convertTokenToWritableMap(token));
            }
          }
        } else {
          super.onActivityResult(activity, requestCode, resultCode, data);
        }
      }
    }
  };


  public StripeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // Add the listener for `onActivityResult`
    reactContext.addActivityEventListener(mActivityEventListener);

    instance = this;
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void init(ReadableMap options) {
    if (DataUtil.exist(options, ANDROID_PAY_MODE, PRODUCTION).toLowerCase().equals("test")) {
      mEnvironment = WalletConstants.ENVIRONMENT_TEST;
      Log.d(TAG, "Environment: test mode");
    }

    publicKey = options.getString("publishableKey");

    stripe = new Stripe(getReactApplicationContext(), publicKey);
  }

  @ReactMethod
  public void deviceSupportsAndroidPay(final Promise promise) {
    if (!isPlayServicesAvailable()) {
      promise.reject(TAG, "Play services are not available!");
      return;
    }
    if (googleApiClient != null && googleApiClient.isConnected()) {
      checkAndroidPayAvaliable(googleApiClient, promise);
    } else if (googleApiClient != null && !googleApiClient.isConnected()) {
      googleApiClient.registerConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
        @Override
        public void onConnected(@Nullable Bundle bundle) {
          checkAndroidPayAvaliable(googleApiClient, promise);
        }

        @Override
        public void onConnectionSuspended(int i) {
          promise.reject(TAG, "onConnectionSuspended i = " + i);
        }
      });
      googleApiClient.connect();
    } else if (googleApiClient == null && getCurrentActivity() != null) {
      googleApiClient = new GoogleApiClient.Builder(getCurrentActivity())
        .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
          @Override
          public void onConnected(@Nullable Bundle bundle) {
            Log.d(TAG, "onConnected: ");
            checkAndroidPayAvaliable(googleApiClient, promise);
          }

          @Override
          public void onConnectionSuspended(int i) {
            Log.d(TAG, "onConnectionSuspended: ");
            promise.reject(TAG, "onConnectionSuspended i = " + i);
          }
        })
        .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
          @Override
          public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
            Log.d(TAG, "onConnectionFailed: ");
            promise.reject(TAG, "onConnectionFailed: " + connectionResult.getErrorMessage());
          }
        })
        .addApi(Wallet.API, new Wallet.WalletOptions.Builder()
          .setEnvironment(mEnvironment)
          .setTheme(WalletConstants.THEME_LIGHT)
          .build())
        .build();
      googleApiClient.connect();
    } else {
      promise.reject(TAG, "Unknown error");
    }
  }

  @ReactMethod
  public void createTokenWithCard(final ReadableMap cardData, final Promise promise) {
    try {

      stripe.createToken(DataUtil.createCard(cardData),
        publicKey,
        new TokenCallback() {
          public void onSuccess(Token token) {
            promise.resolve(DataUtil.convertTokenToWritableMap(token));
          }

          public void onError(Exception error) {
            error.printStackTrace();
            promise.reject(TAG, error.getMessage());
          }
        });
    } catch (Exception e) {
      promise.reject(TAG, e.getMessage());
    }
  }

  @ReactMethod
  public void createTokenWithBankAccount(final ReadableMap accountData, final Promise promise) {
    try {
      stripe.createBankAccountToken(DataUtil.createBankAccount(accountData),
        publicKey,
        null,
        new TokenCallback() {
          public void onSuccess(Token token) {
            promise.resolve(DataUtil.convertTokenToWritableMap(token));
          }

          public void onError(Exception error) {
            error.printStackTrace();
            promise.reject(TAG, error.getMessage());
          }
        });
    } catch (Exception e) {
      promise.reject(TAG, e.getMessage());
    }
  }

  @ReactMethod
  public void paymentRequestWithCardForm(ReadableMap options, final Promise promise) {
    final AddCardDialogFragment cardDialog = AddCardDialogFragment.newInstance(publicKey);
    if (getCurrentActivity() != null) {
      cardDialog.setPromise(promise);
    } else {
      promise.reject(TAG, "Error get activity!");
    }

    String requiredBillingAddressFields = DataUtil.exist(options, "requiredBillingAddressFields");
    if (requiredBillingAddressFields == null) {
      cardDialog.show(getCurrentActivity().getFragmentManager(), "AddNewCard");
    } else {
      if (requiredBillingAddressFields.equals("full")) {
        ReadableMap prefilledInformation = DataUtil.exist(options, "prefilledInformation", (ReadableMap) null);
        PlainAddress data = null;
        if (prefilledInformation != null) {
          String email = DataUtil.exist(prefilledInformation, "email");
          String phone = DataUtil.exist(prefilledInformation, "phone");
          ReadableMap billingAddress = DataUtil.exist(prefilledInformation, "billingAddress", (ReadableMap) null);
          data = DataUtil.createAddress(billingAddress);
          data.email = email;
          data.phone = phone;
        }
        final EnterAddressDialogFragment addressDialog = EnterAddressDialogFragment.newInstance(data);
        addressDialog.next = cardDialog;
        addressDialog.show(getCurrentActivity().getFragmentManager(), "Address");

      } else if(requiredBillingAddressFields.equals("zip")) { //zip only
        cardDialog.setZipEnabled(true);
        cardDialog.show(getCurrentActivity().getFragmentManager(), "AddNewCard");
      }
    }
  }

  @ReactMethod
  public void paymentRequestWithAndroidPay(final ReadableMap map, final Promise promise) {
    Log.d(TAG, "startAndroidPay: ");
    if (getCurrentActivity() != null) {
      payPromise = promise;
      Log.d(TAG, "startAndroidPay: getCurrentActivity() != null");
      startApiClientAndAndroidPay(getCurrentActivity(), map);
    }
  }

  @ReactMethod
  public void createSourceWithParams(final ReadableMap options, final Promise promise) {
    String sourceType = options.getString("type");
    SourceParams sourceParams = null;
    switch (sourceType) {
      case "alipay":
        sourceParams = SourceParams.createAlipaySingleUseParams(
          options.getInt("amount"),
          options.getString("currency"),
          getStringOrNull(options, "name"),
          getStringOrNull(options, "email"),
          options.getString("returnURL"));
        break;
      case "bancontact":
        sourceParams = SourceParams.createBancontactParams(
          options.getInt("amount"),
          options.getString("name"),
          options.getString("returnURL"),
          getStringOrNull(options, "statementDescriptor"));
        break;
      case "bitcoin":
        sourceParams = SourceParams.createBitcoinParams(
          options.getInt("amount"), options.getString("currency"), options.getString("email"));
        break;
      case "giropay":
        sourceParams = SourceParams.createGiropayParams(
          options.getInt("amount"),
          options.getString("name"),
          options.getString("returnURL"),
          getStringOrNull(options, "statementDescriptor"));
        break;
      case "ideal":
        sourceParams = SourceParams.createIdealParams(
          options.getInt("amount"),
          options.getString("name"),
          options.getString("returnURL"),
          getStringOrNull(options, "statementDescriptor"),
          getStringOrNull(options, "bank"));
        break;
      case "sepaDebit":
        sourceParams = SourceParams.createSepaDebitParams(
          options.getString("name"),
          options.getString("iban"),
          getStringOrNull(options, "addressLine1"),
          options.getString("city"),
          options.getString("postalCode"),
          options.getString("country"));
        break;
      case "sofort":
        sourceParams = SourceParams.createSofortParams(
          options.getInt("amount"),
          options.getString("returnURL"),
          options.getString("country"),
          getStringOrNull(options, "statementDescriptor"));
        break;
      case "threeDSecure":
        sourceParams = SourceParams.createThreeDSecureParams(
          options.getInt("amount"),
          options.getString("currency"),
          options.getString("returnURL"),
          options.getString("card"));
        break;

    }

    stripe.createSource(sourceParams, new SourceCallback() {
      @Override
      public void onError(Exception error) {
        promise.reject(error);
      }

      @Override
      public void onSuccess(Source source) {
        if (Source.REDIRECT.equals(source.getFlow())) {
          if (getCurrentActivity() == null) {
            promise.reject(TAG, "Cannot start payment process with no current activity");
          } else {
            createSourcePromise = promise;
            createdSource = source;
            String redirectUrl = source.getRedirect().getUrl();
            Intent browserIntent = new Intent(getCurrentActivity(), OpenBrowserActivity.class)
              .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP)
              .putExtra(OpenBrowserActivity.EXTRA_URL, redirectUrl);
            getCurrentActivity().startActivity(browserIntent);
          }
        } else {
          promise.resolve(DataUtil.convertSourceToWritableMap(source));
        }
      }
    });
  }

  private String getStringOrNull(@NonNull ReadableMap map, @NonNull String key) {
    return map.hasKey(key) ? map.getString(key) : null;
  }

  void processRedirect(@Nullable Uri redirectData) {
    if (createdSource == null || createSourcePromise == null) {
      Log.d(TAG, "Received redirect uri but there is no source to process");
      return;
    }

    if (redirectData == null) {
      Log.d(TAG, "Received null `redirectData`");
      createSourcePromise.reject(TAG, "Cancelled");
      createdSource = null;
      createSourcePromise = null;
      return;
    }

    final String clientSecret = redirectData.getQueryParameter("client_secret");
    if (!createdSource.getClientSecret().equals(clientSecret)) {
      createSourcePromise.reject(TAG, "Received redirect uri but there is no source to process");
      createdSource = null;
      createSourcePromise = null;
      return;
    }

    final String sourceId = redirectData.getQueryParameter("source");
    if (!createdSource.getId().equals(sourceId)) {
      createSourcePromise.reject(TAG, "Received wrong source id in redirect uri");
      createdSource = null;
      createSourcePromise = null;
      return;
    }

    final Promise promise = createSourcePromise;

    // Nulls those properties to avoid processing them twice
    createdSource = null;
    createSourcePromise = null;

    new AsyncTask<Void, Void, Void>() {
      @Override
      protected Void doInBackground(Void... voids) {
        Source source = null;
        try {
          source = stripe.retrieveSourceSynchronous(sourceId, clientSecret);
        } catch (Exception e) {
          Log.w(TAG, "Failed to retrieve source", e);
          return null;
        }

        switch (source.getStatus()) {
          case Source.CHARGEABLE:
          case Source.CONSUMED:
            promise.resolve(DataUtil.convertSourceToWritableMap(source));
            break;
          case Source.CANCELED:
            promise.reject(TAG, "User cancelled source redirect");
            break;
          case Source.PENDING:
          case Source.FAILED:
          case Source.UNKNOWN:
            promise.reject(TAG, "Source redirect failed");
        }
        return null;
      }
    }.execute();
  }

  private void startApiClientAndAndroidPay(final Activity activity, final ReadableMap map) {
    if (googleApiClient != null && googleApiClient.isConnected()) {
      startAndroidPay(map);
    } else {
      googleApiClient = new GoogleApiClient.Builder(activity)
        .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
          @Override
          public void onConnected(@Nullable Bundle bundle) {
            Log.d(TAG, "onConnected: ");
            startAndroidPay(map);
          }

          @Override
          public void onConnectionSuspended(int i) {
            Log.d(TAG, "onConnectionSuspended: ");
            payPromise.reject(TAG, "onConnectionSuspended i = " + i);
          }
        })
        .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
          @Override
          public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
            Log.d(TAG, "onConnectionFailed: ");
            payPromise.reject(TAG, "onConnectionFailed: " + connectionResult.getErrorMessage());
          }
        })
        .addApi(Wallet.API, new Wallet.WalletOptions.Builder()
          .setEnvironment(mEnvironment)
          .setTheme(WalletConstants.THEME_LIGHT)
          .build())
        .build();
      googleApiClient.connect();
    }
  }

  private void showAndroidPay(final ReadableMap map) {
    androidPayParams = map;
    final String estimatedTotalPrice = map.getString(TOTAL_PRICE);
    final String currencyCode = map.getString(CURRENCY_CODE);
    final Boolean shippingAddressRequired = DataUtil.exist(map, SHIPPING_ADDRESS_REQUIRED, true);
    final ArrayList<CountrySpecification> allowedCountries = getAllowedShippingCountries(map);
    final MaskedWalletRequest maskedWalletRequest = createWalletRequest(estimatedTotalPrice, currencyCode, shippingAddressRequired, allowedCountries);
    Wallet.Payments.loadMaskedWallet(googleApiClient, maskedWalletRequest, LOAD_MASKED_WALLET_REQUEST_CODE);
  }

  private MaskedWalletRequest createWalletRequest(final String estimatedTotalPrice, final String currencyCode, final Boolean shippingAddressRequired, final ArrayList<CountrySpecification> countries) {

    final MaskedWalletRequest maskedWalletRequest = MaskedWalletRequest.newBuilder()

      // Request credit card tokenization with Stripe by specifying tokenization parameters:
      .setPaymentMethodTokenizationParameters(PaymentMethodTokenizationParameters.newBuilder()
        .setPaymentMethodTokenizationType(PaymentMethodTokenizationType.PAYMENT_GATEWAY)
        .addParameter("gateway", "stripe")
        .addParameter("stripe:publishableKey", publicKey)
        .addParameter("stripe:version", BuildConfig.VERSION_NAME)
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

  private ArrayList<CountrySpecification> getAllowedShippingCountries(final ReadableMap map) {
    ArrayList<CountrySpecification> allowedCountriesForShipping = new ArrayList<>();
    ReadableArray countries = DataUtil.exist(map, "shipping_countries", (ReadableArray) null);

    if (countries != null) {
      for (int i = 0; i < countries.size(); i++) {
        String code = countries.getString(i);
        allowedCountriesForShipping.add(new CountrySpecification(code));
      }
    }

    return allowedCountriesForShipping;
  }

  private boolean isPlayServicesAvailable() {
    GoogleApiAvailability googleAPI = GoogleApiAvailability.getInstance();
    int result = googleAPI.isGooglePlayServicesAvailable(getCurrentActivity());
    if (result != ConnectionResult.SUCCESS) {
      return false;
    }
    return true;
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

  private IsReadyToPayRequest doIsReadyToPayRequest() {
    return IsReadyToPayRequest.newBuilder().build();
  }

  private void checkAndroidPayAvaliable(final GoogleApiClient client, final Promise promise) {
    Wallet.Payments.isReadyToPay(client, doIsReadyToPayRequest()).setResultCallback(
      new ResultCallback<BooleanResult>() {
        @Override
        public void onResult(@NonNull BooleanResult booleanResult) {
          if (booleanResult.getStatus().isSuccess()) {
            promise.resolve(booleanResult.getValue());
          } else {
            // Error making isReadyToPay call
            Log.e(TAG, "isReadyToPay:" + booleanResult.getStatus());
            promise.reject(TAG, booleanResult.getStatus().getStatusMessage());
          }
        }
      });
  }

  private void startAndroidPay(final ReadableMap map) {
    Wallet.Payments.isReadyToPay(googleApiClient, doIsReadyToPayRequest()).setResultCallback(
      new ResultCallback<BooleanResult>() {
        @Override
        public void onResult(@NonNull BooleanResult booleanResult) {
          Log.d(TAG, "onResult: ");
          if (booleanResult.getStatus().isSuccess()) {
            Log.d(TAG, "onResult: booleanResult.getStatus().isSuccess()");
            if (booleanResult.getValue()) {
              // TODO Work only in few countries. I don't now how test it in our countries.
              Log.d(TAG, "onResult: booleanResult.getValue()");
              showAndroidPay(map);
            } else {
              Log.d(TAG, "onResult: !booleanResult.getValue()");
              // Hide Android Pay buttons, show a message that Android Pay
              // cannot be used yet, and display a traditional checkout button
              androidPayUnavaliableDialog();
              payPromise.reject(TAG, "Android Pay unavaliable");
            }
          } else {
            // Error making isReadyToPay call
            Log.e(TAG, "isReadyToPay:" + booleanResult.getStatus());
            androidPayUnavaliableDialog();
            payPromise.reject(TAG, "Error making isReadyToPay call");
          }
        }
      }
    );
  }
}
