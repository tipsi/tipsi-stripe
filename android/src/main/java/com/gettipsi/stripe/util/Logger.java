package com.gettipsi.stripe.util;

import android.util.Log;

import com.gettipsi.stripe.BuildConfig;

import static android.util.Log.DEBUG;
import static android.util.Log.ERROR;
import static android.util.Log.INFO;
import static android.util.Log.WARN;

public class Logger {
  private static String TAG = "### Tipsi-Stripe";

  public static void log(String msg, int level) {
    if (BuildConfig.DEBUG) {
      switch (level) {
        case DEBUG:
          Log.d(TAG, msg);
          break;
        case INFO:
          Log.i(TAG, msg);
          break;
        case WARN:
          Log.w(TAG, msg);
          break;
        case ERROR:
          Log.e(TAG, msg);
          break;
        default:
          Log.v(TAG, msg);
      }
    }
  }

  public static void log(String msg) {
    Logger.log(msg, DEBUG);
  }
}
