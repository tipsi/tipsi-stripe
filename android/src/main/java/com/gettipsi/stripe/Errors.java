package com.gettipsi.stripe;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.gettipsi.stripe.util.ArgCheck;

import java.util.HashMap;
import java.util.Map;

import com.stripe.android.exception.*;

/**
 * Created by ngoriachev on 30/07/2018.
 */

public final class Errors {

  private static final Map<Class, String> exceptionClassToErrorCode = new HashMap<>();

  static {
    exceptionClassToErrorCode.put(APIConnectionException.class, "apiConnection");
    exceptionClassToErrorCode.put(StripeException.class, "stripe");
    exceptionClassToErrorCode.put(CardException.class, "card");
    exceptionClassToErrorCode.put(AuthenticationException.class, "authentication");
    exceptionClassToErrorCode.put(PermissionException.class, "permission");
    exceptionClassToErrorCode.put(InvalidRequestException.class, "invalidRequest");
    exceptionClassToErrorCode.put(RateLimitException.class, "rateLimit");
    exceptionClassToErrorCode.put(APIException.class, "api");
  }

  static String toErrorCode(@NonNull Exception exception) {
    ArgCheck.nonNull(exception);
    Class exceptionClass = exception.getClass();
    String errorCode = exceptionClassToErrorCode.get(exceptionClass);

    if (errorCode == null) {
      throw new UnknownErrorCodeException("Unknown error code", exception);
    }

    return errorCode;
  }

  static String getErrorCode(@NonNull ReadableMap errorCodes, @NonNull String errorKey) {
    return errorCodes.getMap(errorKey).getString("errorCode");
  }

  static String getDescription(@NonNull ReadableMap errorCodes, @NonNull String errorKey) {
    return errorCodes.getMap(errorKey).getString("description");
  }
}

class UnknownErrorCodeException extends RuntimeException {
  public UnknownErrorCodeException(String message, Throwable cause) {
    super(message, cause);
  }
}
