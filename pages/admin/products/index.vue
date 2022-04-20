<template lang="pug">
    v-container.mt-2
        ProductsSearch
        h4.text-body2.text-sm-h6.mt-5.darken1--text.font-family-raleway-medium Selected products
        ProductsSelected
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  layout: "default",
  middleware: ["authenticated"],
  head() {
    return {
      title: "Search products",
      meta: [
        { hid: "description", name: "description", content: "Search products" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      selectedProducts: "product/selectedProducts",
    }),
  },
};
</script>

<style lang="scss" scoped>
div[container="general"] {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (min-width: 960px) {
  div[container="general"] {
  }
}
</style>
