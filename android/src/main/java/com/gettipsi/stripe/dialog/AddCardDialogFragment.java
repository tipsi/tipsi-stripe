package com.gettipsi.stripe.dialog;

import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.gettipsi.stripe.R;
import com.gettipsi.stripe.R2;
import com.gettipsi.stripe.util.Utils;
import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.model.Card;
import com.stripe.android.model.Token;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class AddCardDialogFragment extends DialogFragment {

  private static final String TAG = AddCardDialogFragment.class.getSimpleName();
  private static final String CURRENCY_UNSPECIFIED = "Unspecified";
  private static final String KEY = "KEY";
  private String PUBLISHABLE_KEY;

  @BindView(R2.id.number)
  EditText number;
  @BindView(R2.id.cvc)
  EditText cvc;
  @BindView(R2.id.expMonth)
  Spinner monthSpinner;
  @BindView(R2.id.expYear)
  Spinner yearSpinner;
  @BindView(R2.id.currency)
  Spinner currencySpinner;
  @BindView(R2.id.save)
  Button saveButton;
  @BindView(R2.id.buttonProgress)
  ProgressBar progressBar;

  private Promise promise;
  private boolean succesful;

  public static AddCardDialogFragment newInstance(final String PUBLISHABLE_KEY) {
    Bundle args = new Bundle();
    args.putString(KEY, PUBLISHABLE_KEY);
    AddCardDialogFragment fragment = new AddCardDialogFragment();
    fragment.setArguments(args);
    return fragment;
  }


  public void setPromise(Promise promise) {
    this.promise = promise;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (getArguments() != null)
      PUBLISHABLE_KEY = getArguments().getString(KEY);
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.payment_form_fragment, container, false);
    ButterKnife.bind(this, view);
    return view;
  }

  @OnClick(R2.id.save)
  public void onSaveCLick() {
    saveButton.setEnabled(false);
    progressBar.setVisibility(View.VISIBLE);
    final Card card = new Card(
      number.getText().toString(),
      getInteger(this.monthSpinner),
      getInteger(this.yearSpinner),
      cvc.getText().toString());

    String errorMessage = Utils.validateCard(card);
    if (errorMessage == null) {
      new Stripe().createToken(
        card,
        PUBLISHABLE_KEY,
        new TokenCallback() {
          public void onSuccess(Token token) {
            final WritableMap newToken = Arguments.createMap();
            newToken.putString("token", token.getId());
            newToken.putBoolean("live_mode", token.getLivemode());
            newToken.putBoolean("user", token.getUsed());
            if (promise != null) {
              promise.resolve(newToken);
              promise = null;
            }
            succesful = true;
            dismiss();
          }

          public void onError(Exception error) {
            saveButton.setEnabled(true);
            progressBar.setVisibility(View.GONE);
            Toast.makeText(getActivity(), error.getLocalizedMessage(), Toast.LENGTH_LONG).show();
          }
        });
    } else {
      saveButton.setEnabled(true);
      progressBar.setVisibility(View.GONE);
      Toast.makeText(getActivity(), errorMessage, Toast.LENGTH_LONG).show();
    }
  }

  @Override
  public Dialog onCreateDialog(Bundle savedInstanceState) {
    succesful = false;
    return super.onCreateDialog(savedInstanceState);
  }


  @Override
  public void onDismiss(DialogInterface dialog) {
    if (!succesful && promise != null) {
      promise.reject(TAG, getString(R.string.user_cancel_dialog));
      promise = null;
    }
    super.onDismiss(dialog);
  }


  public String getCurrency() {
    String selected = currencySpinner.getSelectedItem().toString();
    return selected.equals(CURRENCY_UNSPECIFIED) || currencySpinner.getSelectedItemPosition() == 0
      ? null : selected.toLowerCase();
  }

  private Integer getInteger(Spinner spinner) {
    try {
      return Integer.parseInt(spinner.getSelectedItem().toString());
    } catch (NumberFormatException e) {
      return 0;
    }
  }
}
