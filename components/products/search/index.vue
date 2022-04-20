<template lang="pug">
  div
    v-layout#container-filters
        v-flex
          v-text-field(v-model="search.text" v-on:keyup="doSearch" label="Search products" placeholder="Search products" solo rounded hide-details class="font-family-raleway-regular").mr-2.elevation-5
              v-icon(slot="append" color="important") fas fa-search
        v-flex
          v-select(v-model="selectedCurrency" :items="currencysName" solo rounded hide-details label="Currencys")
    v-slide-group(mandatory class="px-4" center-active show-arrows).mt-1
      v-slide-item(v-for="product in formatProducts" :key="product._id" v-slot="{ active, toggle }")
          v-card(:color="'#ffffff'" class="flexcard ma-4 elevation-8" height="auto" :width="$vuetify.breakpoint.smAndUp ? 200 : 150" @click="toggle").rounded-xl
              v-img(:src="`${product.image}`" :alt="product.name" width="100%" height="auto" )
                  template(v-slot:placeholder)
                      v-row(class="fill-height ma-0" align="center" justify="center")
                          v-progress-circular( indeterminate color="important")
              v-layout.flex-column.pa-3
                h4.text-body-1.darken3--text.font-family-raleway-bold {{product.name}}
                p.description-product.darken1--text.text-caption Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum repellat nesciunt doloremque, exercitationem laborum optio accusantium autem aspernatur! Fugit totam esse sed. Aspernatur libero reiciendis harum atque voluptatum, adipisci animi.
                h5.price-product.darken1--text {{`${product.convertText}`}}
              v-btn(v-if="!selectedProduct(product)" color="important" @click="selectProduct(product)" block dark).rounded-t-0.rounded-b-xl.font-family-raleway-bold.text-capitalize Seleccionar
              v-btn(v-else color="error" @click="cancelProduct(product)" block dark).rounded-t-0.rounded-b-xl.font-family-raleway-bold.text-capitalize Cancelar
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Z_ASCII } from "zlib";
export default {
  name: "Search",
  data() {
    return {
      search: {
        text: null,
        timeout: null,
        searching: false,
        currencys: [],
        products: [],
      },
      timeout: null,
    };
  },
  computed: {
    ...mapGetters({
      auth: "user/auth",
      token: "user/token",
      currencys: "product/currencys",
      selectedProducts: "product/selectedProducts",
    }),
    formatProducts() {
      const _products = [...this.search.products];
      return _products.map((product) => {
        product["convertPrice"] = this.convertCurrency({
          price: product.price,
          currencyOrigin: product.currency,
          currencyDestination: this.selectedCurrency,
        });
        product["selectedCurrency"] = this.selectedCurrency;
        product["convertText"] = this.formatCurrency({
          price: product["convertPrice"],
          currency: this.selectedCurrency
            ? this.selectedCurrency
            : product.currency,
        });
        return product;
      });
    },
    currencysName() {
      return this.currencys.map((item) => item.code);
    },
    selectedCurrency: {
      get() {
        return this.$store.getters["product/selectedCurrency"];
      },
      set(v) {
        return this.$store.commit("product/setSelectedCurrency", v);
      },
    },
  },
  methods: {
    ...mapActions({
      openSession: "user/openSession",
      updateCurrencies: "product/updateCurrencies",
      addProductSelected: "product/addProduct",
      removeProductSelected: "product/removeProduct",
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
    selectedProduct(product) {
      return this.selectedProducts.filter((i) => i._id === product._id).length >
        0
        ? true
        : false;
    },
    selectProduct(product) {
      this.addProductSelected(product);
    },
    cancelProduct(product) {
      this.removeProductSelected(product);
    },
    doSearch() {
      if (this.search.timeout) clearTimeout(this.search.timeout);

      this.search.timeout = setTimeout(() => {
        this.$nextTick().then(async () => {
          this.search.searching = true;

          let result = await this.$axios.post(
            `/products/filterProducts`,
            { text: this.search.text },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: this.token,
              },
            }
          );
          this.search.searching = false;
          result = result.data;
          result = result.map((i) => {
            return {
              ...i,
              image: i.image ? i.image : "https://picsum.photos/200/100",
            };
          });
          this.search.products = result;
        });
        clearTimeout(this.search.timeout);
      }, 500);
    },
    async fetchCurrencys() {
      try {
        if (this.currencys.length > 0) return;

        const result = await this.$axios.post(
          `/currencys/getAllCurrencys`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: this.token,
            },
          }
        );

        this.updateCurrencies(result.data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.$nextTick().then(() => {
      this.fetchCurrencys();
    });
  },
};
</script>

<style lang="scss" scoped>
#container-filters {
  & > div {
    &:nth-of-type(2) {
      max-width: 120px;
    }
  }
}
.description-product {
  @include multiline(3);
}

.price-product {
  font-family: "Oswald";
  text-align: center;
}
</style>
