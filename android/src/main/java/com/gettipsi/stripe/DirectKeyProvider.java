package com.gettipsi.stripe;

import com.stripe.android.EphemeralKeyProvider;
import com.stripe.android.EphemeralKeyUpdateListener;

import com.gettipsi.stripe.StripeModule;
import com.facebook.react.bridge.ReadableMap;


public class DirectKeyProvider implements EphemeralKeyProvider {

    private String mRawKey;
    
    public DirectKeyProvider(String rawKey) {
        mRawKey = rawKey;
    }

    @Override
    public void createEphemeralKey(String apiVersion,
                                    final EphemeralKeyUpdateListener keyUpdateListener) {
        if(mRawKey == null) {
            StripeModule.getInstance().delayEphermalKeyResolution(apiVersion, keyUpdateListener);
        }
        else {
            keyUpdateListener.onKeyUpdate(mRawKey);
        }
    }
}
