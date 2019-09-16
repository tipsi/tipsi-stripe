package com.gettipsi.stripe;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.gettipsi.stripe.util.ArgCheck;
import com.stripe.android.exception.APIException;
import com.stripe.android.exception.CardException;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ngoriachev on 30/07/2018.
 */

public final class Errors {

  private static final Map<String, String> exceptionNameToErrorCode = new HashMap<>();

  public static final String CANCELLED = "cancelled";
  public static final String FAILED = "failed";
  public static final String AUTHENTICATION_FAILED = "authenticationFailed";
  public static final String UNEXPECTED = "unexpected";

  static {
    exceptionNameToErrorCode.put("APIConnectionException", "apiConnection");
    exceptionNameToErrorCode.put("StripeException", "stripe");
    exceptionNameToErrorCode.put("CardException", "card");
    exceptionNameToErrorCode.put("AuthenticationException", "authentication");
    exceptionNameToErrorCode.put("PermissionException", "permission");
    exceptionNameToErrorCode.put("InvalidRequestException", "invalidRequest");
    exceptionNameToErrorCode.put("RateLimitException", "rateLimit");
    exceptionNameToErrorCode.put("APIException", "api");
  }

  public static String toErrorCode(@NonNull Exception exception) {
    ArgCheck.nonNull(exception);
    String simpleName = exception.getClass().getSimpleName();
    String errorCode = exceptionNameToErrorCode.get(simpleName);

    if (errorCode == null) {
      errorCode = simpleName;
    }
//    ArgCheck.nonNull(errorCode, simpleName);

    return errorCode;
  }

  static String getErrorCode(@NonNull ReadableMap errorCodes, @NonNull String errorKey) {
    return errorCodes.getMap(errorKey).getString("errorCode");
  }

  static String getDescription(@NonNull ReadableMap errorCodes, @NonNull String errorKey) {
    return errorCodes.getMap(errorKey).getString("description");
  }

  static WritableMap toUserInfo(@NonNull Exception exception) {
    return toUserInfo(exception, new WritableNativeMap());
  }

  private static WritableMap toUserInfo(@Nullable Throwable throwable, @NonNull WritableMap userInfo) {
    if (throwable == null) return userInfo;

    if (throwable instanceof APIException) {
      return toUserInfo(throwable.getCause(), userInfo);
    }

    if (throwable instanceof CardException) {
      final CardException cardException = (CardException) throwable;
      userInfo.putString("com.stripe.lib:ErrorMessageKey", cardException.getMessage());
      userInfo.putString("com.stripe.lib:ErrorParameterKey", cardException.getParam());
      userInfo.putString("com.stripe.lib:StripeErrorCodeKey", cardException.getCode());
      userInfo.putString("com.stripe.lib:StripeErrorTypeKey", cardException.getStripeError() != null ? cardException.getStripeError().type : null);
    }

    if (throwable instanceof InvalidRequestException) {
      final InvalidRequestException invalidRequestException = (InvalidRequestException) throwable;
      userInfo.putString("com.stripe.lib:ErrorMessageKey", invalidRequestException.getMessage());
      userInfo.putString("com.stripe.lib:ErrorParameterKey", invalidRequestException.getParam());
      userInfo.putString("com.stripe.lib:StripeErrorCodeKey", invalidRequestException.getErrorCode());
      userInfo.putString("com.stripe.lib:StripeErrorTypeKey", invalidRequestException.getStripeError() != null ? invalidRequestException.getStripeError().type : null);
    }

    return userInfo;
  }
}
