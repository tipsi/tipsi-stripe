package com.gettipsi.stripe.dialog;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.devmarvel.creditcardentry.fields.SecurityCodeText;
import com.devmarvel.creditcardentry.library.CreditCard;
import com.devmarvel.creditcardentry.library.CreditCardForm;
import com.facebook.react.bridge.Promise;
import com.gettipsi.stripe.R;
import com.gettipsi.stripe.StripeModule;
import com.gettipsi.stripe.util.CardFlipAnimator;
import com.gettipsi.stripe.util.Converters;
import com.gettipsi.stripe.util.Utils;
import com.stripe.android.ApiResultCallback;
import com.stripe.android.model.Card;
import com.stripe.android.model.PaymentMethod;
import com.stripe.android.model.PaymentMethodCreateParams;

/**
 * Created by dmitriy on 11/13/16
 */

public class AddCardDialogFragment extends DialogFragment {

  public static final String ERROR_CODE = "errorCode";
  public static final String ERROR_DESCRIPTION = "errorDescription";
  private static final String CCV_INPUT_CLASS_NAME = SecurityCodeText.class.getSimpleName();

  private String errorCode;
  private String errorDescription;

  private ProgressBar progressBar;
  private CreditCardForm from;
  private ImageView imageFlipedCard;
  private ImageView imageFlipedCardBack;

  private volatile Promise promise;
  private boolean successful;
  private CardFlipAnimator cardFlipAnimator;
  private Button doneButton;

  public static AddCardDialogFragment newInstance(
    final String errorCode,
    final String errorDescription
  ) {
    Bundle args = new Bundle();
    args.putString(ERROR_CODE, errorCode);
    args.putString(ERROR_DESCRIPTION, errorDescription);

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
    Bundle arguments = getArguments();
    if (arguments != null) {
      errorCode = arguments.getString(ERROR_CODE);
      errorDescription = arguments.getString(ERROR_DESCRIPTION);
    }
  }

  @Override
  public Dialog onCreateDialog(Bundle savedInstanceState) {
    final View view = View.inflate(getActivity(), R.layout.payment_form_fragment_two, null);
    final AlertDialog dialog = new AlertDialog.Builder(getActivity())
      .setView(view)
      .setTitle(R.string.gettipsi_card_enter_dialog_title)
      .setPositiveButton(R.string.gettipsi_card_enter_dialog_positive_button, new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface dialogInterface, int i) {
          onSaveCLick();
        }
      })
      .setNegativeButton(R.string.gettipsi_card_enter_dialog_negative_button, null).create();
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

    bindViews(view);
    init();

    return dialog;
  }

  @Override
  public void onDismiss(DialogInterface dialog) {
    if (!successful && promise != null) {
      promise.reject(errorCode, errorDescription);
      promise = null;
    }
    super.onDismiss(dialog);
  }

  private void bindViews(final View view) {
    progressBar = (ProgressBar) view.findViewById(R.id.buttonProgress);
    from = (CreditCardForm) view.findViewById(R.id.credit_card_form);
    imageFlipedCard = (ImageView) view.findViewById(R.id.imageFlippedCard);
    imageFlipedCardBack = (ImageView) view.findViewById(R.id.imageFlippedCardBack);
  }


  private void init() {
    from.setOnFocusChangeListener(new View.OnFocusChangeListener() {
      @Override
      public void onFocusChange(final View view, boolean b) {
        if (CCV_INPUT_CLASS_NAME.equals(view.getClass().getSimpleName())) {
          if (b) {
            cardFlipAnimator.showBack();
            if (view.getTag() == null) {
              view.setTag("TAG");
              ((SecurityCodeText) view).addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                  //unused
                }

                @Override
                public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                  doneButton.setEnabled(charSequence.length() >= 3);
                }

                @Override
                public void afterTextChanged(Editable editable) {
                  //unused
                }
              });
            }
          } else {
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
    final Card card = new Card.Builder(
      fromCard.getCardNumber(),
      fromCard.getExpMonth(),
      fromCard.getExpYear(),
      fromCard.getSecurityCode()).build();

    String errorMessage = Utils.validateCard(card);
    if (errorMessage == null) {

        PaymentMethodCreateParams pmcp = PaymentMethodCreateParams.create(
          new PaymentMethodCreateParams.Card.Builder().
            setCvc(fromCard.getSecurityCode()).
            setExpiryMonth(fromCard.getExpMonth()).
            setExpiryYear(fromCard.getExpYear()).
            setNumber(fromCard.getCardNumber()).
            build(),
          null);

        StripeModule.getInstance().getStripe().createPaymentMethod(
          pmcp,
          new ApiResultCallback<PaymentMethod>() {

            @Override
            public void onError(Exception error) {
              doneButton.setEnabled(true);
              progressBar.setVisibility(View.GONE);
              showToast(error.getLocalizedMessage());
            }

            @Override
            public void onSuccess(PaymentMethod paymentMethod) {
              if (promise != null) {
                promise.resolve(Converters.convertPaymentMethodToWritableMap(paymentMethod));
                promise = null;
                successful = true;
                dismiss();
              }
            }
        });

    } else {
      doneButton.setEnabled(true);
      progressBar.setVisibility(View.GONE);
      showToast(errorMessage);
    }
  }

  public void showToast(String message) {
    Context context = getActivity();
    if (context != null && !TextUtils.isEmpty(message)) {
      Toast.makeText(context, message, Toast.LENGTH_LONG).show();
    }
  }
}
