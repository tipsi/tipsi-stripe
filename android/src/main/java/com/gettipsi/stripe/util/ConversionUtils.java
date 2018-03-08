package com.gettipsi.stripe.util;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.identity.intents.model.UserAddress;
import com.stripe.android.model.Address;
import com.stripe.android.model.BankAccount;
import com.stripe.android.model.Card;
import com.stripe.android.model.Source;
import com.stripe.android.model.SourceCodeVerification;
import com.stripe.android.model.SourceOwner;
import com.stripe.android.model.SourceReceiver;
import com.stripe.android.model.SourceRedirect;
import com.stripe.android.model.Token;

import java.util.Map;

public class ConversionUtils {
  public static WritableMap convertAddressToWritableMap(final UserAddress address) {
    WritableMap result = Arguments.createMap();

    if (address == null) return result;

    BridgeUtils.putIfExist(result, "address1", address.getAddress1());
    BridgeUtils.putIfExist(result, "address2", address.getAddress2());
    BridgeUtils.putIfExist(result, "address3", address.getAddress3());
    BridgeUtils.putIfExist(result, "address4", address.getAddress4());
    BridgeUtils.putIfExist(result, "address5", address.getAddress5());
    BridgeUtils.putIfExist(result, "administrativeArea", address.getAdministrativeArea());
    BridgeUtils.putIfExist(result, "companyName", address.getCompanyName());
    BridgeUtils.putIfExist(result, "countryCode", address.getCountryCode());
    BridgeUtils.putIfExist(result, "locality", address.getLocality());
    BridgeUtils.putIfExist(result, "name", address.getName());
    BridgeUtils.putIfExist(result, "phoneNumber", address.getPhoneNumber());
    BridgeUtils.putIfExist(result, "postalCode", address.getPostalCode());
    BridgeUtils.putIfExist(result, "sortingCode", address.getSortingCode());

    return result;
  }

  public static WritableMap convertBankAccountToWritableMap(BankAccount account) {
    WritableMap result = Arguments.createMap();

    if (account == null) return result;

    result.putString("routingNumber", account.getRoutingNumber());
    result.putString("accountNumber", account.getAccountNumber());
    result.putString("countryCode", account.getCountryCode());
    result.putString("currency", account.getCurrency());
    result.putString("accountHolderName", account.getAccountHolderName());
    result.putString("accountHolderType", account.getAccountHolderType());
    result.putString("fingerprint", account.getFingerprint());
    result.putString("bankName", account.getBankName());
    result.putString("last4", account.getLast4());

    return result;
  }

  public static WritableMap convertCardToWritableMap(final Card card) {
    WritableMap result = Arguments.createMap();

    if (card == null) return result;

    result.putString("cardId", card.getId());
    result.putString("number", card.getNumber());
    result.putString("cvc", card.getCVC());
    result.putInt("expMonth", card.getExpMonth());
    result.putInt("expYear", card.getExpYear());
    result.putString("name", card.getName());
    result.putString("addressLine1", card.getAddressLine1());
    result.putString("addressLine2", card.getAddressLine2());
    result.putString("addressCity", card.getAddressCity());
    result.putString("addressState", card.getAddressState());
    result.putString("addressZip", card.getAddressZip());
    result.putString("addressCountry", card.getAddressCountry());
    result.putString("last4", card.getLast4());
    result.putString("brand", card.getBrand());
    result.putString("funding", card.getFunding());
    result.putString("fingerprint", card.getFingerprint());
    result.putString("country", card.getCountry());
    result.putString("currency", card.getCurrency());

    return result;
  }

  @NonNull
  public static WritableMap mapToWritableMap(@Nullable Map<String, Object> map) {
    WritableMap writableMap = Arguments.createMap();
    if (map == null) {
      return writableMap;
    }

    for (String key : map.keySet()) {
      BridgeUtils.pushRightTypeToMap(writableMap, key, map.get(key));
    }
    return writableMap;
  }


  @NonNull
  public static WritableMap stringMapToWritableMap(@Nullable Map<String, String> map) {
    WritableMap writableMap = Arguments.createMap();

    if (map == null) {
      return writableMap;
    }

    for (Map.Entry<String, String> entry : map.entrySet()) {
      writableMap.putString(entry.getKey(), entry.getValue());
    }

    return writableMap;
  }

  @NonNull
  public static WritableMap convertOwnerToWritableMap(@Nullable final SourceOwner owner) {
    WritableMap map = Arguments.createMap();

    if (owner == null) {
      return map;
    }

    map.putMap("address", convertAddressToWritableMap(owner.getAddress()));
    map.putString("email", owner.getEmail());
    map.putString("name", owner.getName());
    map.putString("phone", owner.getPhone());
    map.putString("verifiedEmail", owner.getVerifiedEmail());
    map.putString("verifiedPhone", owner.getVerifiedPhone());
    map.putString("verifiedName", owner.getVerifiedName());
    map.putMap("verifiedAddress", convertAddressToWritableMap(owner.getVerifiedAddress()));

    return map;
  }

  @NonNull
  public static WritableMap convertAddressToWritableMap(@Nullable final Address address) {
    WritableMap map = Arguments.createMap();

    if (address == null) {
      return map;
    }

    map.putString("city", address.getCity());
    map.putString("country", address.getCountry());
    map.putString("line1", address.getLine1());
    map.putString("line2", address.getLine2());
    map.putString("postalCode", address.getPostalCode());
    map.putString("state", address.getState());

    return map;
  }

  @NonNull
  public static WritableMap convertReceiverToWritableMap(@Nullable final SourceReceiver receiver) {
    WritableMap map = Arguments.createMap();

    if (receiver == null) {
      return map;
    }

    map.putInt("amountCharged", (int) receiver.getAmountCharged());
    map.putInt("amountReceived", (int) receiver.getAmountReceived());
    map.putInt("amountReturned", (int) receiver.getAmountReturned());
    map.putString("address", receiver.getAddress());

    return map;
  }

  @NonNull
  public static WritableMap convertRedirectToWritableMap(@Nullable SourceRedirect redirect) {
    WritableMap map = Arguments.createMap();

    if (redirect == null) {
      return map;
    }

    map.putString("returnUrl", redirect.getReturnUrl());
    map.putString("status", redirect.getStatus());
    map.putString("url", redirect.getUrl());

    return map;
  }

  @NonNull
  public static WritableMap convertCodeVerificationToWritableMap(@Nullable SourceCodeVerification codeVerification) {
    WritableMap map = Arguments.createMap();

    if (codeVerification == null) {
      return map;
    }

    map.putInt("attemptsRemaining", codeVerification.getAttemptsRemaining());
    map.putString("status", codeVerification.getStatus());

    return map;
  }


  public static WritableMap convertTokenToWritableMap(Token token) {
    WritableMap newToken = Arguments.createMap();

    if (token == null) return newToken;

    newToken.putString("tokenId", token.getId());
    newToken.putBoolean("livemode", token.getLivemode());
    newToken.putBoolean("used", token.getUsed());
    newToken.putDouble("created", token.getCreated().getTime());

    if (token.getCard() != null) {
      newToken.putMap("card", convertCardToWritableMap(token.getCard()));
    }
    if (token.getBankAccount() != null) {
      newToken.putMap("bankAccount", convertBankAccountToWritableMap(token.getBankAccount()));
    }

    return newToken;
  }

  @NonNull
  public static WritableMap convertSourceToWritableMap(@Nullable Source source) {
    WritableMap newSource = Arguments.createMap();

    if (source == null) {
      return newSource;
    }

    newSource.putString("sourceId", source.getId());
    newSource.putInt("amount", source.getAmount().intValue());
    newSource.putInt("created", source.getCreated().intValue());
    newSource.putMap("codeVerification", convertCodeVerificationToWritableMap(source.getCodeVerification()));
    newSource.putString("currency", source.getCurrency());
    newSource.putString("flow", source.getFlow());
    newSource.putBoolean("livemode", source.isLiveMode());
    newSource.putMap("metadata", stringMapToWritableMap(source.getMetaData()));
    newSource.putMap("owner", convertOwnerToWritableMap(source.getOwner()));
    newSource.putMap("receiver", convertReceiverToWritableMap(source.getReceiver()));
    newSource.putMap("redirect", convertRedirectToWritableMap(source.getRedirect()));
    newSource.putMap("sourceTypeData", mapToWritableMap(source.getSourceTypeData()));
    newSource.putString("status", source.getStatus());
    newSource.putString("type", source.getType());
    newSource.putString("typeRaw", source.getTypeRaw());
    newSource.putString("usage", source.getUsage());

    return newSource;
  }

}
