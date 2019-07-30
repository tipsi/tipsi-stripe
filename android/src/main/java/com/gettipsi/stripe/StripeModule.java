package com.gettipsi.stripe;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.gettipsi.stripe.dialog.AddCardDialogFragment;
import com.gettipsi.stripe.util.ArgCheck;
import com.gettipsi.stripe.util.Converters;
import com.gettipsi.stripe.util.Fun0;
import com.google.android.gms.wallet.WalletConstants;
import com.stripe.android.AppInfo;
import com.stripe.android.SourceCallback;
import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.model.Source;
import com.stripe.android.model.SourceParams;
import com.stripe.android.model.Token;

import static com.gettipsi.stripe.Errors.*;
import static com.gettipsi.stripe.util.Converters.convertSourceToWritableMap;
import static com.gettipsi.stripe.util.Converters.convertTokenToWritableMap;
import static com.gettipsi.stripe.util.Converters.createBankAccount;
import static com.gettipsi.stripe.util.Converters.createCard;
import static com.gettipsi.stripe.util.Converters.getStringOrNull;
import static com.gettipsi.stripe.util.InitializationOptions.ANDROID_PAY_MODE_KEY;
import static com.gettipsi.stripe.util.InitializationOptions.ANDROID_PAY_MODE_PRODUCTION;
import static com.gettipsi.stripe.util.InitializationOptions.ANDROID_PAY_MODE_TEST;
import static com.gettipsi.stripe.util.InitializationOptions.PUBLISHABLE_KEY;

public class StripeModule extends ReactContextBaseJavaModule {

  private static final String MODULE_NAME = StripeModule.class.getSimpleName();

  // If you change these, make sure to also change:
  //  ios/TPSStripe/TPSStripeManager
  // Relevant Docs:
  // - https://stripe.dev/stripe-ios/docs/Classes/STPAppInfo.html https://stripe.dev/stripe-android/com/stripe/android/AppInfo.html
  // - https://stripe.com/docs/building-plugins#setappinfo
  private static final String APP_INFO_NAME    = "tipsi-stripe";
  private static final String APP_INFO_URL     = "https://github.com/tipsi/tipsi-stripe";
  private static final String APP_INFO_VERSION = "7.x";

  private static StripeModule sInstance = null;

  public static StripeModule getInstance() {
    return sInstance;
  }

  public Stripe getStripe() {
    return mStripe;
  }

  @Nullable
  private Promise mCreateSourcePromise;

  @Nullable
  private Source mCreatedSource;

  private String mPublicKey;
  private Stripe mStripe;
  private PayFlow mPayFlow;
  private ReadableMap mErrorCodes;

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
      boolean handled = getPayFlow().onActivityResult(activity, requestCode, resultCode, data);
      if (!handled) {
        super.onActivityResult(activity, requestCode, resultCode, data);
      }
    }
  };


  public StripeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // Add the listener for `onActivityResult`
    reactContext.addActivityEventListener(mActivityEventListener);

    sInstance = this;
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void init(@NonNull ReadableMap options, @NonNull ReadableMap errorCodes) {
    ArgCheck.nonNull(options);

    String newPubKey = Converters.getStringOrNull(options, PUBLISHABLE_KEY);
    String newAndroidPayMode = Converters.getStringOrNull(options, ANDROID_PAY_MODE_KEY);

    if (newPubKey != null && !TextUtils.equals(newPubKey, mPublicKey)) {
      ArgCheck.notEmptyString(newPubKey);

      mPublicKey = newPubKey;
      Stripe.setAppInfo(AppInfo.create(APP_INFO_NAME, APP_INFO_VERSION, APP_INFO_URL));
      mStripe = new Stripe(getReactApplicationContext(), mPublicKey);
      getPayFlow().setPublishableKey(mPublicKey);
    }

    if (newAndroidPayMode != null) {
      ArgCheck.isTrue(ANDROID_PAY_MODE_TEST.equals(newAndroidPayMode) || ANDROID_PAY_MODE_PRODUCTION.equals(newAndroidPayMode));

      getPayFlow().setEnvironment(androidPayModeToEnvironment(newAndroidPayMode));
    }

    if (mErrorCodes == null) {
      mErrorCodes = errorCodes;
      getPayFlow().setErrorCodes(errorCodes);
    }
  }

  private PayFlow getPayFlow() {
    if (mPayFlow == null) {
      mPayFlow = PayFlow.create(
        new Fun0<Activity>() { public Activity call() {
          return getCurrentActivity();
        }}
      );
    }

    return mPayFlow;
  }

  private static int androidPayModeToEnvironment(@NonNull String androidPayMode) {
    ArgCheck.notEmptyString(androidPayMode);
    return ANDROID_PAY_MODE_TEST.equals(androidPayMode.toLowerCase()) ? WalletConstants.ENVIRONMENT_TEST : WalletConstants.ENVIRONMENT_PRODUCTION;
  }

  @ReactMethod
  public void deviceSupportsAndroidPay(final Promise promise) {
    getPayFlow().deviceSupportsAndroidPay(false, promise);
  }

  @ReactMethod
  public void canMakeAndroidPayPayments(final Promise promise) {
    getPayFlow().deviceSupportsAndroidPay(true, promise);
  }

  @ReactMethod
  public void createTokenWithCard(final ReadableMap cardData, final Promise promise) {
    try {
      ArgCheck.nonNull(mStripe);
      ArgCheck.notEmptyString(mPublicKey);

      mStripe.createToken(
        createCard(cardData),
        mPublicKey,
        new TokenCallback() {
          public void onSuccess(Token token) {
            promise.resolve(convertTokenToWritableMap(token));
          }
          public void onError(Exception error) {
            error.printStackTrace();
            promise.reject(toErrorCode(error), error.getMessage());
          }
        });
    } catch (Exception e) {
      promise.reject(toErrorCode(e), e.getMessage());
    }
  }

  @ReactMethod
  public void createTokenWithBankAccount(final ReadableMap accountData, final Promise promise) {
    try {
      ArgCheck.nonNull(mStripe);
      ArgCheck.notEmptyString(mPublicKey);

      mStripe.createBankAccountToken(
        createBankAccount(accountData),
        mPublicKey,
        null,
        new TokenCallback() {
          public void onSuccess(Token token) {
            promise.resolve(convertTokenToWritableMap(token));
          }
          public void onError(Exception error) {
            error.printStackTrace();
            promise.reject(toErrorCode(error), error.getMessage());
          }
        });
    } catch (Exception e) {
      promise.reject(toErrorCode(e), e.getMessage());
    }
  }

  @ReactMethod
  public void paymentRequestWithCardForm(ReadableMap params, final Promise promise) {
    Activity currentActivity = getCurrentActivity();
    try {
      ArgCheck.nonNull(currentActivity);
      ArgCheck.notEmptyString(mPublicKey);

      final AddCardDialogFragment cardDialog = AddCardDialogFragment.newInstance(
        mPublicKey,
        getErrorCode(mErrorCodes, "cancelled"),
        getDescription(mErrorCodes, "cancelled"),
        params.hasKey("createCardSource") && params.getBoolean("createCardSource")
      );
      cardDialog.setPromise(promise);
      cardDialog.show(currentActivity.getFragmentManager(), "AddNewCard");
    } catch (Exception e) {
      promise.reject(toErrorCode(e), e.getMessage());
    }
  }

  @ReactMethod
  public void paymentRequestWithAndroidPay(final ReadableMap payParams, final Promise promise) {
    getPayFlow().paymentRequestWithAndroidPay(payParams, promise);
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
            getStringOrNull(options, "statementDescriptor"),
            options.getString("preferredLanguage"));
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
			case "card":
				sourceParams = SourceParams.createCardParams(Converters.createCard(options));
		  	break;
    }

    ArgCheck.nonNull(sourceParams);

    mStripe.createSource(sourceParams, new SourceCallback() {
      @Override
      public void onError(Exception error) {
        promise.reject(toErrorCode(error));
      }

      @Override
      public void onSuccess(Source source) {
        if (Source.REDIRECT.equals(source.getFlow())) {
          Activity currentActivity = getCurrentActivity();
          if (currentActivity == null) {
            promise.reject(
              getErrorCode(mErrorCodes, "activityUnavailable"),
              getDescription(mErrorCodes, "activityUnavailable")
            );
          } else {
            mCreateSourcePromise = promise;
            mCreatedSource = source;
            String redirectUrl = source.getRedirect().getUrl();
            Intent browserIntent = new Intent(currentActivity, OpenBrowserActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP)
                .putExtra(OpenBrowserActivity.EXTRA_URL, redirectUrl);
            currentActivity.startActivity(browserIntent);
          }
        } else {
          promise.resolve(convertSourceToWritableMap(source));
        }
      }
    });
  }

  void processRedirect(@Nullable Uri redirectData) {
    if (mCreatedSource == null || mCreateSourcePromise == null) {

      return;
    }

    if (redirectData == null) {

      mCreateSourcePromise.reject(
        getErrorCode(mErrorCodes, "redirectCancelled"),
        getDescription(mErrorCodes, "redirectCancelled")
      );
      mCreatedSource = null;
      mCreateSourcePromise = null;
      return;
    }

    final String clientSecret = redirectData.getQueryParameter("client_secret");
    if (!mCreatedSource.getClientSecret().equals(clientSecret)) {
      mCreateSourcePromise.reject(
        getErrorCode(mErrorCodes, "redirectNoSource"),
        getDescription(mErrorCodes, "redirectNoSource")
      );
      mCreatedSource = null;
      mCreateSourcePromise = null;
      return;
    }

    final String sourceId = redirectData.getQueryParameter("source");
    if (!mCreatedSource.getId().equals(sourceId)) {
      mCreateSourcePromise.reject(
        getErrorCode(mErrorCodes, "redirectWrongSourceId"),
        getDescription(mErrorCodes, "redirectWrongSourceId")
      );
      mCreatedSource = null;
      mCreateSourcePromise = null;
      return;
    }

    final Promise promise = mCreateSourcePromise;

    // Nulls those properties to avoid processing them twice
    mCreatedSource = null;
    mCreateSourcePromise = null;

    new AsyncTask<Void, Void, Void>() {
      @Override
      protected Void doInBackground(Void... voids) {
        Source source = null;
        try {
          source = mStripe.retrieveSourceSynchronous(sourceId, clientSecret);
        } catch (Exception e) {

          return null;
        }

        switch (source.getStatus()) {
          case Source.CHARGEABLE:
          case Source.CONSUMED:
            promise.resolve(convertSourceToWritableMap(source));
            break;
          case Source.CANCELED:
            promise.reject(
              getErrorCode(mErrorCodes, "redirectCancelled"),
              getDescription(mErrorCodes, "redirectCancelled")
            );
            break;
          case Source.PENDING:
          case Source.FAILED:
          case Source.UNKNOWN:
            promise.reject(
              getErrorCode(mErrorCodes, "redirectFailed"),
              getDescription(mErrorCodes, "redirectFailed")
            );
        }
        return null;
      }
    }.execute();
  }

}
