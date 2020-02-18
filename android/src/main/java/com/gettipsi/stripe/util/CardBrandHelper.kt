package com.gettipsi.stripe.util

import com.stripe.android.model.CardBrand

class CardBrandHelper {
    fun getCardBrandFromCode(code: String): CardBrand {
        return CardBrand.fromCode(code)
    }
}


