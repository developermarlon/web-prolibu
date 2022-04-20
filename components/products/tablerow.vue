<template lang="pug">
    tr
        td 
            p.darken1--text {{formatProduct.sku}}
        td 
            v-img(:src="formatProduct.image" max-width="50")
        td 
            p.darken1--text {{formatProduct.name}}
        td 
            p.darken1--text {{formatProduct.convertText}}
        td 
            p.darken1--text {{formatProduct.textRate}}
        td 
            v-text-field(v-model="amount" placeholder="Digite cantidad" dense hide-details).mt-0.font-family-raleway-regular.mr-2.elevation-5

        td 
            v-slider(v-model="discount" :rules="rules.discount" color="orange" hint="Between 0 and 100" min="0" step="10" max="100" thumb-label)

        td 
            p.darken1--text {{getTotal}}
        
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "tableRow",
  data() {
    return {
      updateAmount: 1,
      updateDiscount: 0,
      rules: {
        discount: [(v) => v <= 99 || `can't be free`],
      },
    };
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      selectedCurrency: "product/selectedCurrency",
      selectedProducts: "product/selectedProducts",
      currencys: "product/currencys",
    }),
    getProduct() {
      return this.selectedProducts.find(
        (product) => product._id === this.product._id
      );
    },
    getTotal() {
      let _product = this.getProduct;
      let totalPrice =
        (_product.price - (this.updateDiscount * _product.price) / 100) *
        this.updateAmount;

      return this.formatCurrency({
        price: this.convertCurrency({
          price: totalPrice,
          currencyOrigin: this.product.currency,
          currencyDestination: this.selectedCurrency,
        }),
        currency: this.selectedCurrency
          ? this.selectedCurrency
          : this.product.currency,
      });
    },
    amount: {
      get() {
        let amounts = this.selectedProducts.find(
          (i) => i._id === this.product._id
        )["amount"];
        return amounts ? amounts : 1;
      },
      set(v) {
        this.updateAmount = v;
        return this.$store.dispatch("product/changeMountSelected", {
          value: v,
          id: this.product._id,
        });
      },
    },
    discount: {
      get() {
        let discounts = this.selectedProducts.find(
          (i) => i._id === this.product._id
        )["discount"];
        return discounts ? discounts : 0;
      },
      set(v) {
        this.updateDiscount = v;
        return this.$store.dispatch("product/changeDiscountSelected", {
          value: v,
          id: this.product._id,
        });
      },
    },
    formatProduct() {
      let _product = this.getProduct;

      _product["convertPrice"] = this.convertCurrency({
        price: _product.price,
        currencyOrigin: _product.currency,
        currencyDestination: this.selectedCurrency,
      });
      _product["selectedCurrency"] = this.selectedCurrency;
      _product["convertText"] = this.formatCurrency({
        price: _product["convertPrice"],
        currency: this.selectedCurrency
          ? this.selectedCurrency
          : product.currency,
      });

      return _product;
    },
  },
  methods: {
    ...mapActions({
      closeSession: "user/closeSession",
    }),
    formatCurrency({ price, currency }) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(price);
    },
    convertCurrency({ price, currencyOrigin, currencyDestination }) {
      const priceCurrencyDestination = this.currencys.filter(
        (i) => i.code === currencyDestination
      )[0].value;
      const priceCurrencyOrigin = this.currencys.filter(
        (i) => i.code === currencyOrigin
      )[0].value;
      return (priceCurrencyDestination * price) / priceCurrencyOrigin;
    },
  },
};
</script>

<style lang="scss" scoped>
tr {
  td p,
  th p {
    @include multiline(1);
  }
}
</style>
