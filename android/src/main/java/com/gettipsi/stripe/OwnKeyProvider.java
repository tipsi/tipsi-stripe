package com.gettipsi.stripe;

import androidx.annotation.NonNull;

import com.stripe.android.EphemeralKeyProvider;
import com.stripe.android.EphemeralKeyUpdateListener;

public class OwnKeyProvider implements EphemeralKeyProvider {

    private String jsonData = "";

    public OwnKeyProvider(String jsonData) {
        this.jsonData = jsonData;
    }

    @Override
    public void createEphemeralKey(@NonNull String apiVersion, @NonNull EphemeralKeyUpdateListener keyUpdateListener) {
        keyUpdateListener.onKeyUpdate(jsonData);
    }
}
