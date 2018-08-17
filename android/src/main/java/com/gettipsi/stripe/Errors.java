package com.gettipsi.stripe;

import android.support.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.gettipsi.stripe.util.ArgCheck;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ngoriachev on 30/07/2018.
 */

public final class Errors {

  private static final Map<String, String> exceptionNameToErrorCode = new HashMap<>();

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

  static String toErrorCode(@NonNull Exception exception) {
    ArgCheck.nonNull(exception);
    String simpleName = exception.getClass().getSimpleName();
    String errorCode = exceptionNameToErrorCode.get(simpleName);
    ArgCheck.nonNull(errorCode, simpleName);

    return errorCode;
  }

  static String getErrorCode(@NonNull ReadableMap errorCodes, @NonNull String errorKey) {
    return errorCodes.getMap(errorKey).getString("errorCode");
  }

  static String getDescription(@NonNull ReadableMap errorCodes, @NonNull String errorKey) {
    return errorCodes.getMap(errorKey).getString("description");
  }

}
