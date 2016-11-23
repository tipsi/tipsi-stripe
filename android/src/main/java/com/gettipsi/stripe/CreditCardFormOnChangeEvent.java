package com.gettipsi.stripe;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by dmitriy on 11/17/16
 */
public class CreditCardFormOnChangeEvent extends Event<CreditCardFormOnChangeEvent> {

    private static final String EVENT_NAME = "topChange";
    private final WritableMap params;
    private final boolean isValid;

    public CreditCardFormOnChangeEvent(int id, WritableMap params, boolean isValid) {
        super(id);
        this.params = params;
        this.isValid = isValid;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putBoolean("valid", isValid);
        eventData.putMap("params", params);
        return eventData;
    }
}
