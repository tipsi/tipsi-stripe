package com.gettipsi.stripe.util;

import android.util.Pair;

import com.google.android.gms.wallet.WalletConstants;

import java.io.UncheckedIOException;
import java.util.Arrays;
import java.util.List;

public class Constants {
  public static final int PAYMENTS_ENVIRONMENT = WalletConstants.ENVIRONMENT_TEST;

  // The allowed networks to be requested from the API. If the user has cards from networks not
  // specified here in their account, these will not be offered for them to choose in the popup.
  public static final List<Integer> SUPPORTED_NETWORKS = Arrays.asList(
    WalletConstants.CARD_NETWORK_AMEX,
    WalletConstants.CARD_NETWORK_DISCOVER,
    WalletConstants.CARD_NETWORK_VISA,
    WalletConstants.CARD_NETWORK_MASTERCARD
  );

  public static final List<Integer> SUPPORTED_METHODS = Arrays.asList(
    // PAYMENT_METHOD_CARD returns to any card the user has stored in their Google Account.
    WalletConstants.PAYMENT_METHOD_CARD,

    // PAYMENT_METHOD_TOKENIZED_CARD refers to cards added to Android Pay, assuming Android
    // Pay is installed.
    // Please keep in mind cards may exist in Android Pay without being added to the Google
    // Account.
    WalletConstants.PAYMENT_METHOD_TOKENIZED_CARD
  );

  // Required by the API, but not visible to the user.
  public static final String CURRENCY_CODE = "USD";

  // Supported countries for shipping (use ISO 3166-1 alpha-2 country codes).
  // Relevant only when requesting a shipping address.
  public static final List<String> SHIPPING_SUPPORTED_COUNTRIES = Arrays.asList(
    "US",
    "GB"
  );

  private Constants() {
  }

}
