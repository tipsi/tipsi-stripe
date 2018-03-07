package com.gettipsi.stripe.util;

import com.facebook.react.bridge.ReadableMap;
import com.stripe.android.model.BankAccount;
import com.stripe.android.model.Card;

public class DataUtil {
  public static Card createCard(final ReadableMap cardData) {
    return new Card(
      // required fields
      cardData.getString("number"),
      cardData.getInt("expMonth"),
      cardData.getInt("expYear"),
      // additional fields
      BridgeUtils.exist(cardData, "cvc"),
      BridgeUtils.exist(cardData, "name"),
      BridgeUtils.exist(cardData, "addressLine1"),
      BridgeUtils.exist(cardData, "addressLine2"),
      BridgeUtils.exist(cardData, "addressCity"),
      BridgeUtils.exist(cardData, "addressState"),
      BridgeUtils.exist(cardData, "addressZip"),
      BridgeUtils.exist(cardData, "addressCountry"),
      BridgeUtils.exist(cardData, "brand"),
      BridgeUtils.exist(cardData, "last4"),
      BridgeUtils.exist(cardData, "fingerprint"),
      BridgeUtils.exist(cardData, "funding"),
      BridgeUtils.exist(cardData, "country"),
      BridgeUtils.exist(cardData, "currency"),
      BridgeUtils.exist(cardData, "id")
    );
  }

  public static BankAccount createBankAccount(ReadableMap accountData) {
    BankAccount account = new BankAccount(
      // required fields only
      accountData.getString("accountNumber"),
      accountData.getString("countryCode"),
      accountData.getString("currency"),
      BridgeUtils.exist(accountData, "routingNumber", "")
    );
    account.setAccountHolderName(BridgeUtils.exist(accountData, "accountHolderName"));
    account.setAccountHolderType(BridgeUtils.exist(accountData, "accountHolderType"));

    return account;
  }

}
