package com.gettipsi.stripe.util;

import android.os.Parcel;
import android.os.Parcelable;

public class PlainAddress implements Parcelable {
  public String name;
  public String address; //line1
  public String apartment; //line2
  public String zip; //postalCode
  public String city;
  public String state;
  public String country;
  public String phone;
  public String email;

  public static final String NAME = "name";
  public static final String ADDRESS = "line1";
  public static final String APARTMENT = "line2";
  public static final String ZIP = "postalCode";
  public static final String CITY = "city";
  public static final String STATE = "state";
  public static final String COUNTRY = "country";
  public static final String PHONE = "phone";
  public static final String EMAIL = "email";

  @Override
  public int describeContents() {
    return 0;
  }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeString(this.name);
    dest.writeString(this.address);
    dest.writeString(this.apartment);
    dest.writeString(this.zip);
    dest.writeString(this.city);
    dest.writeString(this.state);
    dest.writeString(this.country);
    dest.writeString(this.phone);
    dest.writeString(this.email);
  }

  public PlainAddress() {
  }

  protected PlainAddress(Parcel in) {
    this.name = in.readString();
    this.address = in.readString();
    this.apartment = in.readString();
    this.zip = in.readString();
    this.city = in.readString();
    this.state = in.readString();
    this.country = in.readString();
    this.phone = in.readString();
    this.email = in.readString();
  }

  public static final Parcelable.Creator<PlainAddress> CREATOR = new Parcelable.Creator<PlainAddress>() {
    @Override
    public PlainAddress createFromParcel(Parcel source) {
      return new PlainAddress(source);
    }

    @Override
    public PlainAddress[] newArray(int size) {
      return new PlainAddress[size];
    }
  };
}
