package com.gettipsi.stripe;

import android.app.Activity;
import android.content.Intent;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.gettipsi.stripe.util.ArgCheck;
import com.gettipsi.stripe.util.Converters;
import com.gettipsi.stripe.util.Fun0;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.wallet.AutoResolveHelper;
import com.google.android.gms.wallet.CardRequirements;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.PaymentData;
import com.google.android.gms.wallet.PaymentDataRequest;
import com.google.android.gms.wallet.PaymentMethodTokenizationParameters;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.ShippingAddressRequirements;
import com.google.android.gms.wallet.TransactionInfo;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;
import com.stripe.android.BuildConfig;
import com.stripe.android.GooglePayConfig;
import com.stripe.android.model.PaymentMethod;
import com.stripe.android.model.PaymentMethodCreateParams;
import com.stripe.android.model.Token;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.Collection;

import static com.gettipsi.stripe.Errors.toErrorCode;
import static com.gettipsi.stripe.util.Converters.convertTokenToWritableMap;
import static com.gettipsi.stripe.util.Converters.getAllowedShippingCountryCodes;
import static com.gettipsi.stripe.util.Converters.getBillingAddress;
import static com.gettipsi.stripe.util.Converters.putExtraToTokenMap;
import static com.gettipsi.stripe.util.PayParams.COUNTRY_CODE;
import static com.gettipsi.stripe.util.PayParams.CURRENCY_CODE;
import static com.gettipsi.stripe.util.PayParams.BILLING_ADDRESS_REQUIRED;
import static com.gettipsi.stripe.util.PayParams.SHIPPING_ADDRESS_REQUIRED;
import static com.gettipsi.stripe.util.PayParams.PHONE_NUMBER_REQUIRED;
import static com.gettipsi.stripe.util.PayParams.EMAIL_REQUIRED;
import static com.gettipsi.stripe.util.PayParams.TOTAL_PRICE;

/**
 * Created by ngoriachev on 13/03/2018.
 * see https://developers.google.com/pay/api/tutorial
 */
public final class GoogleApiPayFlowImpl extends PayFlow {

  private static final String TAG = GoogleApiPayFlowImpl.class.getSimpleName();
  private static final int LOAD_PAYMENT_DATA_REQUEST_CODE = 65534;

  private PaymentsClient mPaymentsClient;
  private Promise payPromise;

  public GoogleApiPayFlowImpl(@NonNull Fun0<Activity> activityProvider) {
    super(activityProvider);
  }

  private PaymentsClient createPaymentsClient(@NonNull Activity activity) {
    return Wallet.getPaymentsClient(
      activity,
      new Wallet.WalletOptions.Builder().setEnvironment(getEnvironment()).build());
  }

  private void isReadyToPay(@NonNull Activity activity, boolean isExistingPaymentMethodRequired, @NonNull final Promise promise) {
    ArgCheck.nonNull(activity);
    ArgCheck.nonNull(promise);

    IsReadyToPayRequest request =
      IsReadyToPayRequest.newBuilder()
        .addAllowedPaymentMethod(WalletConstants.PAYMENT_METHOD_CARD)
        .addAllowedPaymentMethod(WalletConstants.PAYMENT_METHOD_TOKENIZED_CARD)
        .setExistingPaymentMethodRequired(isExistingPaymentMethodRequired)
        .build();
    mPaymentsClient = createPaymentsClient(activity);
    Task<Boolean> task = mPaymentsClient.isReadyToPay(request);
    task.addOnCompleteListener(
      new OnCompleteListener<Boolean>() {
        public void onComplete(Task<Boolean> task) {
          try {
            boolean result = task.getResult(ApiException.class);
            promise.resolve(result);
          } catch (ApiException exception) {
            promise.reject(toErrorCode(exception), exception.getMessage());
          }
        }
      });
  }

  private JSONObject createPaymentMethodTokenizationParameters() throws JSONException {
    return new JSONObject()
            .put("type", "PAYMENT_GATEWAY")
            .put("parameters", new JSONObject()
                    .put("gateway", "stripe")
                    .put("stripe:publishableKey", getPublishableKey())
                    .put("stripe:version", BuildConfig.VERSION_NAME)
            );
  }

  private PaymentDataRequest createPaymentDataRequest(ReadableMap payParams) {
    final String estimatedTotalPrice = payParams.getString(TOTAL_PRICE);
    final String currencyCode = payParams.getString(CURRENCY_CODE);
    final String countryCode = payParams.getString(COUNTRY_CODE);
    final boolean billingAddressRequired = Converters.getValue(payParams, BILLING_ADDRESS_REQUIRED, false);
    final boolean shippingAddressRequired = Converters.getValue(payParams, SHIPPING_ADDRESS_REQUIRED, false);
    final boolean emailRequired = Converters.getValue(payParams, EMAIL_REQUIRED, false);

    try {
      return createPaymentDataRequest(
        estimatedTotalPrice,
        currencyCode,
        countryCode,
        billingAddressRequired,
        shippingAddressRequired,
        emailRequired
      );
    } catch (JSONException e) {
      e.printStackTrace();
    }
    return null;
  }

  @NonNull
  private PaymentDataRequest createPaymentDataRequest(@NonNull final String totalPrice,
                                                      @NonNull final String currencyCode,
                                                      @NonNull final String countryCode,
                                                      final boolean billingAddressRequired,
                                                      final boolean shippingAddressRequired,
                                                      final boolean emailRequired
  ) throws JSONException {

    ArgCheck.isDouble(totalPrice);
    ArgCheck.notEmptyString(currencyCode);
    final JSONObject tokenizationSpec = this.createPaymentMethodTokenizationParameters();

    final JSONObject cardPaymentMethod = new JSONObject()
            .put("type", "CARD")
            .put(
                    "parameters",
                    new JSONObject()
                            .put("allowedAuthMethods", new JSONArray()
                                    .put("PAN_ONLY")
                                    .put("CRYPTOGRAM_3DS"))
                            .put("allowedCardNetworks",
                                    new JSONArray()
                                            .put("AMEX")
                                            .put("DISCOVER")
                                            .put("MASTERCARD")
                                            .put("VISA"))
                            .put("billingAddressRequired", billingAddressRequired)
            )
            .put("tokenizationSpecification", tokenizationSpec);

    // create PaymentDataRequest
    final String paymentDataRequestString = new JSONObject()
            .put("apiVersion", 2)
            .put("apiVersionMinor", 0)
            .put("allowedPaymentMethods",
                    new JSONArray().put(cardPaymentMethod))
            .put("transactionInfo", new JSONObject()
                    .put("totalPrice", totalPrice)
                    .put("totalPriceStatus", "ESTIMATED")
                    .put("currencyCode", currencyCode.toUpperCase())
                    .put("countryCode", countryCode.toUpperCase())
            )
            .put("emailRequired", emailRequired)
            .put("shippingAddressRequired", shippingAddressRequired)
            .toString();

    return PaymentDataRequest.fromJson(paymentDataRequestString);
  }

  private void startPaymentRequest(@NonNull Activity activity, @NonNull PaymentDataRequest request) {
    ArgCheck.nonNull(activity);
    ArgCheck.nonNull(request);

    mPaymentsClient = createPaymentsClient(activity);

    AutoResolveHelper.resolveTask(
      mPaymentsClient.loadPaymentData(request),
      activity,
      LOAD_PAYMENT_DATA_REQUEST_CODE);
  }

  @Override
  public void paymentRequestWithAndroidPay(@NonNull ReadableMap payParams, @NonNull Promise promise) {
    ArgCheck.nonNull(payParams);
    ArgCheck.nonNull(promise);

    Activity activity = activityProvider.call();
    if (activity == null) {
      promise.reject(
        getErrorCode("activityUnavailable"),
        getErrorDescription("activityUnavailable")
      );
      return;
    }

    PaymentDataRequest dataRequest = createPaymentDataRequest(payParams);
    if (dataRequest == null) {
      promise.reject(
              getErrorCode("googlePayDataRequest"),
              getErrorDescription("googlePayDataRequest")
      );
      return;
    }

    this.payPromise = promise;
    startPaymentRequest(activity, dataRequest);
  }

  @Override
  public void deviceSupportsAndroidPay(boolean isExistingPaymentMethodRequired, @NonNull Promise promise) {
    Activity activity = activityProvider.call();
    if (activity == null) {
      promise.reject(
        getErrorCode("activityUnavailable"),
        getErrorDescription("activityUnavailable")
      );
      return;
    }

    if (!isPlayServicesAvailable(activity)) {
      promise.reject(
        getErrorCode("playServicesUnavailable"),
        getErrorDescription("playServicesUnavailable")
      );
      return;
    }

    isReadyToPay(activity, isExistingPaymentMethodRequired, promise);
  }

  private PaymentMethodCreateParams createPaymentMethodParams(@NonNull PaymentData paymentData) {
    try {
      return PaymentMethodCreateParams.createFromGooglePay(
              new JSONObject(paymentData.toJson()));
    } catch (JSONException e) {
      e.printStackTrace();
    }
    return null;
  }

    public boolean onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (payPromise == null) {
      return false;
    }

    switch (requestCode) {
      case LOAD_PAYMENT_DATA_REQUEST_CODE:
        switch (resultCode) {
          case Activity.RESULT_OK:
            PaymentData paymentData = PaymentData.getFromIntent(data);
            ArgCheck.nonNull(paymentData);

            PaymentMethodCreateParams paymentMethodCreateParams = this.createPaymentMethodParams(paymentData);
            if (paymentMethodCreateParams == null) {
              payPromise.reject(
                getErrorCode("parseResponse"),
                getErrorDescription("parseResponse")
              );
            } else {
              payPromise.resolve(paymentMethodCreateParams);
            }
            break;
          case Activity.RESULT_CANCELED:
            payPromise.reject(
              getErrorCode("purchaseCancelled"),
              getErrorDescription("purchaseCancelled")
            );
            break;
          case AutoResolveHelper.RESULT_ERROR:
            Status status = AutoResolveHelper.getStatusFromIntent(data);
            // Log the status for debugging.
            // Generally, there is no need to show an error to
            // the user as the Google Pay API will do that.
            payPromise.reject(
              getErrorCode("stripe"),
              status.getStatusMessage()
            );
            break;

          default:
            // Do nothing.
        }
        payPromise = null;
        return true;
    }

    return false;
  }

}
