package com.gettipsi.stripe.util;

import android.app.Activity;
import android.util.Pair;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.wallet.CardRequirements;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.PaymentDataRequest;
import com.google.android.gms.wallet.PaymentMethodTokenizationParameters;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.ShippingAddressRequirements;
import com.google.android.gms.wallet.TransactionInfo;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

/**
 * Contains helper static methods for dealing with the Payments API.
 */
public class GooglePaymentsUtil {
  private static final BigDecimal MICROS = new BigDecimal(1000000d);

  private GooglePaymentsUtil() {
  }

  public static PaymentsClient createPaymentsClient(Activity activity) {
    Wallet.WalletOptions walletOptions = new Wallet.WalletOptions.Builder()
      .setEnvironment(Constants.PAYMENTS_ENVIRONMENT)
      .build();
    return Wallet.getPaymentsClient(activity, walletOptions);
  }

  public static PaymentDataRequest createPaymentDataRequest(GooglePayment googlePayment) {
    PaymentDataRequest.Builder builder =
      PaymentDataRequest.newBuilder()
        .setPhoneNumberRequired(googlePayment.isPhoneNumberRequired())
        .setEmailRequired(googlePayment.isEmailRequired())
        .setShippingAddressRequired(googlePayment.isShippingAddressRequired())
        .setTransactionInfo(googlePayment.getTransactionInfo())
        .addAllowedPaymentMethods(Constants.SUPPORTED_METHODS)
        .setCardRequirements(googlePayment.getCardRequirements())
        .setPaymentMethodTokenizationParameters(googlePayment.getParams())
        .setUiRequired(true); // default

    // Omitting ShippingAddressRequirements all together means all countries are
    // supported.
    if (!googlePayment.getShippingCountries().isEmpty()) {
      builder.setShippingAddressRequirements(
        ShippingAddressRequirements.newBuilder()
          .addAllowedCountryCodes(googlePayment.getShippingCountries()).build());
    }

    return builder.build();
  }

  public static CardRequirements createCardRequirements() {
    return CardRequirements.newBuilder()
      .addAllowedCardNetworks(Constants.SUPPORTED_NETWORKS)
      .setAllowPrepaidCards(true)
      .setBillingAddressRequired(true)
      // Omitting this parameter will result in the API returning
      // only a "minimal" billing address (post code only).
      .setBillingAddressFormat(WalletConstants.BILLING_ADDRESS_FORMAT_FULL)
      .build();
  }

  public static PaymentMethodTokenizationParameters createTokenizationParameters(String publicKey) {
    return PaymentMethodTokenizationParameters.newBuilder()
      .setPaymentMethodTokenizationType(WalletConstants.PAYMENT_METHOD_TOKENIZATION_TYPE_PAYMENT_GATEWAY)
      .addParameter("gateway", "stripe")
      .addParameter("stripe:publishableKey", publicKey)
      .addParameter("stripe:version", "6.0.0")
      .build();
  }

  public static TransactionInfo createTransaction(String price) {
    return TransactionInfo.newBuilder()
      .setTotalPriceStatus(WalletConstants.TOTAL_PRICE_STATUS_FINAL)
      .setTotalPrice(price)
      .setCurrencyCode(Constants.CURRENCY_CODE)
      .build();
  }

  public static Task<Boolean> isReadyToPay(PaymentsClient client) {
    IsReadyToPayRequest.Builder request = IsReadyToPayRequest.newBuilder();
    for (Integer allowedMethod : Constants.SUPPORTED_METHODS) {
      request.addAllowedPaymentMethod(allowedMethod);
    }
    return client.isReadyToPay(request.build());
  }
}
