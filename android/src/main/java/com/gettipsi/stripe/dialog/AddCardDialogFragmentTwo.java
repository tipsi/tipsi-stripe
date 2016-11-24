package com.gettipsi.stripe.dialog;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.devmarvel.creditcardentry.fields.SecurityCodeText;
import com.devmarvel.creditcardentry.library.CreditCard;
import com.devmarvel.creditcardentry.library.CreditCardForm;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.gettipsi.stripe.R;
import com.gettipsi.stripe.R2;
import com.gettipsi.stripe.util.CardFlipAnimator;
import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.model.Card;
import com.stripe.android.model.Token;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * Created by dmitriy on 11/13/16
 */

public class AddCardDialogFragmentTwo extends DialogFragment {

  private static final String CURRENCY_UNSPECIFIED = "Unspecified";
  private static final String KEY = "KEY";
  private static final String TAG = AddCardDialogFragmentTwo.class.getSimpleName();
  private static final String CCV_INPUT_CLASS_NAME = SecurityCodeText.class.getSimpleName();
  private String PUBLISHABLE_KEY;

  @BindView(R2.id.buttonProgress)
  ProgressBar progressBar;
  @BindView(R2.id.credit_card_form)
  CreditCardForm from;
  @BindView(R2.id.imageFlippedCard)
  ImageView imageFlipedCard;
  @BindView(R2.id.imageFlippedCardBack)
  ImageView imageFlipedCardBack;

  //    private volatile Promise promise;
  private boolean succesful;
  private CardFlipAnimator cardFlipAnimator;
  private Button doneButton;
  private StripeListener listener;

  public static AddCardDialogFragmentTwo newInstance(final String PUBLISHABLE_KEY) {
    Bundle args = new Bundle();
    args.putString(KEY, PUBLISHABLE_KEY);
    AddCardDialogFragmentTwo fragment = new AddCardDialogFragmentTwo();
    fragment.setArguments(args);
    return fragment;
  }

  public static AddCardDialogFragmentTwo newInstance() {
    return new AddCardDialogFragmentTwo();
  }

//    public void setPromise(Promise promise) {
//        this.promise = promise;
//    }

  public void setListener(StripeListener listener) {
    this.listener = listener;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (getArguments() != null)
      PUBLISHABLE_KEY = getArguments().getString(KEY);
  }

  @Override
  public Dialog onCreateDialog(Bundle savedInstanceState) {
    final View view = View.inflate(getActivity(), R.layout.payment_form_fragment_two, null);
    final AlertDialog dialog = new AlertDialog.Builder(getActivity())
      .setView(view)
      .setTitle("Enter your card")
      .setPositiveButton("Done", new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialogInterface, int i) {
          onSaveCLick();
        }
      })
      .setNegativeButton(android.R.string.cancel, null).create();
    dialog.show();

    doneButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
    doneButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        onSaveCLick();
      }
    });
    doneButton.setTextColor(getResources().getColor(R.color.colorAccent));
    dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setTextColor(getResources().getColor(R.color.colorAccent));
    doneButton.setEnabled(false);

    ButterKnife.bind(this, view);
    init();
    Log.d(TAG, "onCreateDialog: ");
    return dialog;
  }

//    @Override
//    public void onDismiss(DialogInterface dialog) {
//        if (!succesful && promise != null) {
//            promise.reject("User cancel dialog. No card added!");
//            promise = null;
//        }
//        super.onDismiss(dialog);
//    }

  @Override
  public void onDismiss(DialogInterface dialog) {
    if (!succesful && listener != null) {
      listener.reject("User cancel dialog. No card added!");
      listener = null;
    }
    super.onDismiss(dialog);
  }


  private void init() {
    from.setOnFocusChangeListener(new View.OnFocusChangeListener() {
      @Override
      public void onFocusChange(final View view, boolean b) {
        if (CCV_INPUT_CLASS_NAME.equals(view.getClass().getSimpleName())) {
          if (b) {
            Log.d(TAG, "ANIMATE: SHOW_CCV");
            cardFlipAnimator.showBack();
            Log.d(TAG, "onFocusChange: " + view.getTag());
            if (view.getTag() == null) {
              view.setTag("TAG");
              ((SecurityCodeText) view).addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                  Log.d(TAG, "beforeTextChanged: " + charSequence + " i = " + i + " i1 = " + i1 + " i2 = " + i2);
                }

                @Override
                public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                  Log.d(TAG, "onTextChanged: " + charSequence + " i = " + i + " i1 = " + i1 + " i2 = " + i2);
                  doneButton.setEnabled(charSequence.length() == 3);
                }

                @Override
                public void afterTextChanged(Editable editable) {
                  Log.d(TAG, "afterTextChanged: " + editable.toString());
                }
              });
            }
          } else {
            Log.d(TAG, "ANIMATE: HIDE_CCV");
            cardFlipAnimator.showFront();
          }
        }

      }
    });

    cardFlipAnimator = new CardFlipAnimator(getActivity(), imageFlipedCard, imageFlipedCardBack);
    succesful = false;
  }

  public void onSaveCLick() {
    doneButton.setEnabled(false);
    progressBar.setVisibility(View.VISIBLE);
    final CreditCard fromCard = from.getCreditCard();
    final Card card = new Card(
      fromCard.getCardNumber(),
      fromCard.getExpMonth(),
      fromCard.getExpYear(),
      fromCard.getSecurityCode());

    String errorMessage = validateCard(card);
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
//                            if (promise != null) {
//                                promise.resolve(newToken);
//                                promise = null;
//                            }
            if (listener != null) {
              listener.resolve(newToken);
              listener = null;
            }
            succesful = true;
            dismiss();
          }

          public void onError(Exception error) {
            doneButton.setEnabled(true);
            progressBar.setVisibility(View.GONE);
            Toast.makeText(getActivity(), error.getLocalizedMessage(), Toast.LENGTH_LONG).show();
          }
        });
    } else {
      doneButton.setEnabled(true);
      progressBar.setVisibility(View.GONE);
      Toast.makeText(getActivity(), errorMessage, Toast.LENGTH_LONG).show();
    }
  }

  private String validateCard(Card card) {
    if (!card.validateNumber()) {
      return "The card number that you entered is invalid";
    } else if (!card.validateExpiryDate()) {
      return "The expiration date that you entered is invalid";
    } else if (!card.validateCVC()) {
      return "The CVC code that you entered is invalid";
    }
    return null;
  }

  public interface StripeListener {
    void resolve(final WritableMap newToken);
    void reject(final String error);
  }
}
