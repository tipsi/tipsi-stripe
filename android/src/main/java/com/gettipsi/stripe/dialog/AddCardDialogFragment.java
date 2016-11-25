package com.gettipsi.stripe.dialog;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
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
import com.gettipsi.stripe.util.Utils;
import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.model.Card;
import com.stripe.android.model.Token;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * Created by dmitriy on 11/13/16
 */

public class AddCardDialogFragment extends DialogFragment {

  private static final String KEY = "KEY";
  private static final String TAG = AddCardDialogFragment.class.getSimpleName();
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

  private volatile Promise promise;
  private boolean successful;
  private CardFlipAnimator cardFlipAnimator;
  private Button doneButton;

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
    doneButton.setTextColor(ContextCompat.getColor(getActivity(), R.color.colorAccent));
    dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setTextColor(ContextCompat.getColor(getActivity(), R.color.colorAccent));
    doneButton.setEnabled(false);

    ButterKnife.bind(this, view);
    init();
    Log.d(TAG, "onCreateDialog: ");
    return dialog;
  }

  @Override
  public void onDismiss(DialogInterface dialog) {
    if (!successful && promise != null) {
      promise.reject(TAG, getString(R.string.user_cancel_dialog));
      promise = null;
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
                  //unused
                }

                @Override
                public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                  doneButton.setEnabled(charSequence.length() == 3);
                }

                @Override
                public void afterTextChanged(Editable editable) {
                  //unused
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
    successful = false;
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

    String errorMessage = Utils.validateCard(card);
    if (errorMessage == null) {
      new Stripe().createToken(
        card,
        PUBLISHABLE_KEY,
        new TokenCallback() {
          public void onSuccess(Token token) {
            final WritableMap newToken = Arguments.createMap();
            newToken.putString("tokenId", token.getId());
            newToken.putBoolean("livemode", token.getLivemode());
            newToken.putDouble("created",token.getCreated().getTime());
            newToken.putBoolean("user", token.getUsed());
            final WritableMap cardMap = Arguments.createMap();
            final Card card = token.getCard();
            cardMap.putString("cardId", card.getFingerprint());
            cardMap.putString("brand", card.getType());
            cardMap.putString("last4", card.getLast4());
            cardMap.putInt("expMonth", card.getExpMonth());
            cardMap.putInt("expYear", card.getExpYear());
            cardMap.putString("country", card.getCountry());
            cardMap.putString("currency", card.getCurrency());
            cardMap.putString("name", card.getName());
            cardMap.putString("addressLine1", card.getAddressLine1());
            cardMap.putString("addressLine2", card.getAddressLine2());
            cardMap.putString("addressCity", card.getAddressCity());
            cardMap.putString("addressState", card.getAddressState());
            cardMap.putString("addressCountry", card.getAddressCountry());
            cardMap.putString("addressZip", card.getAddressZip());
            newToken.putMap("card", cardMap);
            if (promise != null) {
              promise.resolve(newToken);
              promise = null;
            }
            successful = true;
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
}
