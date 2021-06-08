package com.seatmonger.stripe.util;

public interface Action<T> {
  void call(T t);
}
