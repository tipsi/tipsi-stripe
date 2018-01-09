package com.example;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import android.os.Build;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  public static int OVERLAY_PERMISSION_REQ_CODE = 1234;

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
      return "example";
  }

  @Override
  public void onCreate (Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Checking permissions on init
    askPermission();
  }

  public void askPermission() {
    if (Build.VERSION.SDK_INT>Build.VERSION_CODES.LOLLIPOP_MR1 && !Settings.canDrawOverlays(this)) {
      Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
      startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
    }
  }
}
