package com.gettipsi.stripe;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;

/**
 * Created by remer on 16/11/17.
 */
public class OpenBrowserActivity extends Activity {
  final static String EXTRA_URL = "url";

  private String url;
  private boolean shouldFinish = true;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    shouldFinish = false;

    url = getIntent().getStringExtra(EXTRA_URL);
    Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url))
        .addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY | Intent.FLAG_ACTIVITY_CLEAR_TOP | 
          Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(browserIntent);
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (shouldFinish) {
      StripeModule.getInstance().processRedirect(null);
      finish();
    }
    shouldFinish = true;
  }
}
