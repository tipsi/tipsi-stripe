package com.gettipsi.stripe;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
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
import com.stripe.android.BuildConfig;
import com.stripe.android.SourceCallback;
import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.model.Source;
import com.stripe.android.model.SourceParams;
import com.stripe.android.model.Token;

import java.util.ArrayList;

import com.gettipsi.stripe.dialog.AddCardDialogFragment;

import static com.gettipsi.stripe.util.BridgeUtils.exist;
import static com.gettipsi.stripe.util.BridgeUtils.getStringOrNull;
import static com.gettipsi.stripe.util.ConversionUtils.convertSourceToWritableMap;
import static com.gettipsi.stripe.util.ConversionUtils.convertTokenToWritableMap;
import static com.gettipsi.stripe.util.DataUtil.createBankAccount;
import static com.gettipsi.stripe.util.DataUtil.createCard;
import static com.gettipsi.stripe.util.Logger.log;

public class StripeModule extends ReactContextBaseJavaModule {

  private static final String TAG = "### StripeModule: ";
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
      log("(1.0) onActivityResult()");

      if (payPromise != null) {
        log("(1.1) payPromise != null");
        if (requestCode == LOAD_MASKED_WALLET_REQUEST_CODE) { // Unique, identifying constant
          log("(1.2) requestCode == LOAD_MASKED_WALLET_REQUEST_CODE");
          handleLoadMascedWaletRequest(resultCode, data);

        } else if (requestCode == LOAD_FULL_WALLET_REQUEST_CODE) {
          log("(1.3) requestCode == LOAD_FULL_WALLET_REQUEST_CODE");
          if (resultCode == Activity.RESULT_OK) {
            log("(1.4) onActivityResult: LOAD_FULL_WALLET -> RESULT_OK");
            FullWallet fullWallet = data.getParcelableExtra(WalletConstants.EXTRA_FULL_WALLET);
            String tokenJSON = fullWallet.getPaymentMethodToken().getToken();
            Token token = Token.fromString(tokenJSON);
            if (token == null) {
              // Log the error and notify Stripe help
              log("(1.5) onActivityResult: failed to create token from JSON string.");
              payPromise.reject("JsonParsingError", "Failed to create token from JSON string.");
            } else {
              log("(1.6) onActivityResult: token != null, resolving promise!");
              payPromise.resolve(convertTokenToWritableMap(token));
            }
          } else if (resultCode == Activity.RESULT_CANCELED) {
            log("(1.8) onActivityResult: resultCode == Activity.RESULT_CANCELED");
          } else {
            log("(1.9) onActivityResult: resultCode == " + resultCode);
          }
        } else {
          log("(1.7) payPromise != null || requestCode != LOAD_FULL_WALLET_REQUEST_CODE");
          super.onActivityResult(activity, requestCode, resultCode, data);
        }
      } else {
        log("(1.8) payPromise == null");
      }
    }
  };


  public StripeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    log("(2.0) StripeModule()");

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
    log("(3.0) init()");

    if (exist(options, ANDROID_PAY_MODE, PRODUCTION).toLowerCase().equals("test")) {
      log("(3.1) exist(options, ANDROID_PAY_MODE, PRODUCTION).toLowerCase().equals(test)");
      mEnvironment = WalletConstants.ENVIRONMENT_TEST;
    }

    publicKey = options.getString("publishableKey");
    stripe = new Stripe(getReactApplicationContext(), publicKey);
  }

  @ReactMethod
  public void deviceSupportsAndroidPay(final Promise promise) {
    log("(4.0) deviceSupportsAndroidPay()");

    if (!isPlayServicesAvailable()) {
      log("(4.1) !isPlayServicesAvailable()");
      promise.reject(TAG, "Play services are not available!");
      return;
    }
    if (googleApiClient != null && googleApiClient.isConnected()) {
      log("(4.2) googleApiClient != null && googleApiClient.isConnected()");
      checkAndroidPayAvaliable(googleApiClient, promise);
    } else if (googleApiClient != null && !googleApiClient.isConnected()) {
      log("(4.3) googleApiClient != null && !googleApiClient.isConnected()");
      googleApiClient.registerConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
        @Override
        public void onConnected(@Nullable Bundle bundle) {
          log("(4.4) onConnected()");
          checkAndroidPayAvaliable(googleApiClient, promise);
        }

        @Override
        public void onConnectionSuspended(int i) {
          log("(4.5) onConnectionSuspended()");
          promise.reject(TAG, "onConnectionSuspended i = " + i);
        }
      });
      googleApiClient.connect();
    } else if (googleApiClient == null && getCurrentActivity() != null) {
      log("(4.6) googleApiClient == null && getCurrentActivity() != null");
      googleApiClient = new GoogleApiClient.Builder(getCurrentActivity())
        .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
          @Override
          public void onConnected(@Nullable Bundle bundle) {
            log("(4.7) onConnected()");
            checkAndroidPayAvaliable(googleApiClient, promise);
          }

          @Override
          public void onConnectionSuspended(int i) {
            log("(4.8) onConnectionSuspended()");
            promise.reject(TAG, "onConnectionSuspended i = " + i);
          }
        })
        .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
          @Override
          public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
            log("(4.9) onConnectionFailed()");
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
      log("(4.10) googleApiClient == null && getCurrentActivity() == null");
      promise.reject(TAG, "Unknown error");
    }
  }

  @ReactMethod
  public void createTokenWithCard(final ReadableMap cardData, final Promise promise) {
    log("(5.0) createTokenWithCard()");

    try {

      stripe.createToken(createCard(cardData),
        publicKey,
        new TokenCallback() {
          public void onSuccess(Token token) {
            promise.resolve(convertTokenToWritableMap(token));
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
    log("(6.0) createTokenWithBankAccount()");

    try {
      stripe.createBankAccountToken(createBankAccount(accountData),
        publicKey,
        null,
        new TokenCallback() {
          public void onSuccess(Token token) {
            promise.resolve(convertTokenToWritableMap(token));
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
  public void paymentRequestWithCardForm(ReadableMap unused, final Promise promise) {
    log("(7.0) paymentRequestWithCardForm()");

    if (getCurrentActivity() != null) {
      final AddCardDialogFragment cardDialog = AddCardDialogFragment.newInstance(publicKey);
      cardDialog.setPromise(promise);
      cardDialog.show(getCurrentActivity().getFragmentManager(), "AddNewCard");
    }
  }

  @ReactMethod
  public void paymentRequestWithAndroidPay(final ReadableMap map, final Promise promise) {
    log("(8.0) paymentRequestWithAndroidPay()");

    if (getCurrentActivity() != null) {
      log("(8.1) paymentRequestWithAndroidPay(): getCurrentActivity() != null");
      payPromise = promise;
      startApiClientAndAndroidPay(getCurrentActivity(), map);
    } else {
      log("(8.2) paymentRequestWithAndroidPay(): getCurrentActivity() == null");
    }
  }

  @ReactMethod
  public void createSourceWithParams(final ReadableMap options, final Promise promise) {
    log("(9.0) createSourceWithParams()");

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
          promise.resolve(convertSourceToWritableMap(source));
        }
      }
    });
  }

  void processRedirect(@Nullable Uri redirectData) {
    log("(10.0) processRedirect()");

    if (createdSource == null || createSourcePromise == null) {
      log("(10.1) Received redirect uri but there is no source to process");
      return;
    }

    if (redirectData == null) {
      log("(10.2) Received null `redirectData`");
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
          log("(10.3) Failed to retrieve source");
          return null;
        }

        switch (source.getStatus()) {
          case Source.CHARGEABLE:
          case Source.CONSUMED:
            promise.resolve(convertSourceToWritableMap(source));
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
    log("(11.0) startApiClientAndAndroidPay()");

    if (googleApiClient != null && googleApiClient.isConnected()) {
      log("(11.1) googleApiClient != null && googleApiClient.isConnected()");
      startAndroidPay(map);
    } else {
      log("(11.2) !(googleApiClient != null && googleApiClient.isConnected())");
      googleApiClient = new GoogleApiClient.Builder(activity)
        .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
          @Override
          public void onConnected(@Nullable Bundle bundle) {
            log("(11.3) onConnected()");
            startAndroidPay(map);
          }

          @Override
          public void onConnectionSuspended(int i) {
            log("(11.4) onConnectionSuspended()");
            payPromise.reject(TAG, "onConnectionSuspended i = " + i);
          }
        })
        .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
          @Override
          public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
            log("(11.5) onConnectionFailed()");
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
    log("(12)  showAndroidPay()");

    androidPayParams = map;
    final String estimatedTotalPrice = map.getString(TOTAL_PRICE);
    final String currencyCode = map.getString(CURRENCY_CODE);
    final Boolean shippingAddressRequired = exist(map, SHIPPING_ADDRESS_REQUIRED, true);
    final ArrayList<CountrySpecification> allowedCountries = getAllowedShippingCountries(map);
    final MaskedWalletRequest maskedWalletRequest = createWalletRequest(estimatedTotalPrice, currencyCode, shippingAddressRequired, allowedCountries);
    Wallet.Payments.loadMaskedWallet(googleApiClient, maskedWalletRequest, LOAD_MASKED_WALLET_REQUEST_CODE);
  }

  private MaskedWalletRequest createWalletRequest(final String estimatedTotalPrice, final String currencyCode, final Boolean shippingAddressRequired, final ArrayList<CountrySpecification> countries) {
    log("(13) createWalletRequest(), publicKey:" + publicKey);

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
    ReadableArray countries = exist(map, "shipping_countries", (ReadableArray) null);

    if (countries != null) {
      for (int i = 0; i < countries.size(); i++) {
        String code = countries.getString(i);
        allowedCountriesForShipping.add(new CountrySpecification(code));
      }
    }

    return allowedCountriesForShipping;
  }

  private boolean isPlayServicesAvailable() {
    log("(14) isPlayServicesAvailable()");

    GoogleApiAvailability googleAPI = GoogleApiAvailability.getInstance();
    int result = googleAPI.isGooglePlayServicesAvailable(getCurrentActivity());
    if (result != ConnectionResult.SUCCESS) {
      return false;
    }
    return true;
  }

  private void androidPayUnavaliableDialog() {
    log("(15) androidPayUnavaliableDialog()");

    new AlertDialog.Builder(getCurrentActivity())
      .setMessage(R.string.gettipsi_android_pay_unavaliable)
      .setPositiveButton(android.R.string.ok, null)
      .show();
  }

  private void handleLoadMascedWaletRequest(int resultCode, Intent data) {
    log("(16) handleLoadMascedWaletRequest()");

    if (resultCode == Activity.RESULT_OK) {
      log("(16.1) resultCode == Activity.RESULT_OK");
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
      log("(16.2) resultCode != Activity.RESULT_OK");
      payPromise.reject(PURCHASE_CANCELLED, "Purchase was cancelled");
    }
  }

  private IsReadyToPayRequest doIsReadyToPayRequest() {
    log("(17) doIsReadyToPayRequest()");

    return IsReadyToPayRequest.newBuilder().build();
  }

  private void checkAndroidPayAvaliable(final GoogleApiClient client, final Promise promise) {
    log("(18) checkAndroidPayAvaliable");

    Wallet.Payments.isReadyToPay(client, doIsReadyToPayRequest()).setResultCallback(
      new ResultCallback<BooleanResult>() {
        @Override
        public void onResult(@NonNull BooleanResult booleanResult) {
          log("(18.1) Wallet.Payments.isReadyToPay: onResult()");
          if (booleanResult.getStatus().isSuccess()) {
            log("(18.2) booleanResult.getStatus().isSuccess()");
            promise.resolve(booleanResult.getValue());
          } else {
            log("(18.3) !(booleanResult.getStatus().isSuccess())");
            // Error making isReadyToPay call
            promise.reject(TAG, booleanResult.getStatus().getStatusMessage());
          }
        }
      });
  }

  private void startAndroidPay(final ReadableMap map) {
    log("(19) startAndroidPay()");

    Wallet.Payments.isReadyToPay(googleApiClient, doIsReadyToPayRequest()).setResultCallback(
      new ResultCallback<BooleanResult>() {
        @Override
        public void onResult(@NonNull BooleanResult booleanResult) {
          log("(19.1) Wallet.Payments.isReadyToPay: onResult()");
          if (booleanResult.getStatus().isSuccess()) {
            log("(19.2) booleanResult.getStatus().isSuccess()");
            if (booleanResult.getValue()) {
              log("(19.3) booleanResult.getValue()");
              // TODO Work only in few countries. I don't now how test it in our countries.
              showAndroidPay(map);
            } else {
              log("(19.4) !(booleanResult.getStatus().isSuccess())");
              // Hide Android Pay buttons, show a message that Android Pay
              // cannot be used yet, and display a traditional checkout button
              androidPayUnavaliableDialog();
              payPromise.reject(TAG, "Android Pay unavaliable");
            }
          } else {
            // Error making isReadyToPay call
            log("(19.5) !(booleanResult.getStatus().isSuccess())");
            androidPayUnavaliableDialog();
            payPromise.reject(TAG, "Error making isReadyToPay call");
          }
        }
      }
    );
  }
}
