package com.gettipsi.stripe.util;

public interface Action<T> {
  void call(T t);
}
