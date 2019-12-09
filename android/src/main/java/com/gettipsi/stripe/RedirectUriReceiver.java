package com.gettipsi.stripe;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;

/**
 * Created by remer on 11/8/17.
 */

public class RedirectUriReceiver extends Activity {
  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (StripeModule.getInstance() == null) {
      sendResult(RESULT_CANCELED);
    }

    try {
      Uri redirectData = getIntent().getData();

      StripeModule.getInstance().processRedirect(redirectData);
      sendResult(RESULT_OK);
    } catch (NullPointerException error) {
      sendResult(RESULT_CANCELED);
    }
  }

  private void sendResult(int resultCode) {
    setResult(resultCode);
    finish();
  }
}
