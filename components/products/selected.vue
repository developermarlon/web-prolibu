<template lang="pug">
    
    v-container(fluid)#container-selected.mt-2.mx-0.pa-0
        table
            thead
                tr
                    th.text-left Sku
                    th.text-left Imagen
                    th.text-left Name
                    th.text-left Price
                    th.text-left textRate
                    th.text-left Amount
                    th(style="min-width: 200px !important").text-left % Discount
                    th.text-left Total
                    
            tbody
                ProductsTablerow(v-for="product in selectedProducts" :product="product" :key="product._id")
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "selectedProducts",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      selectedProducts: "product/selectedProducts",
    }),
  },
  methods: {
    ...mapActions({
      closeSession: "user/closeSession",
    }),
  },
};
</script>

<style lang="scss" scoped>
.container-appbar {
  min-height: 50px;
  background: #ffffff;
  z-index: 100;

  #fullname {
    font-size: 1.5rem;
    font-family: "Lobster";
    font-weight: bold;
  }
}

#container-selected {
  overflow-x: scroll;
  margin-bottom: 100px;

  table {
    width: 100%;
    max-width: 100%;
    background: #ffffff;
    padding: 5px 30px 5px 30px;
    border-radius: 0px;

    thead {
      border-bottom: 2px solid var(--v-darken1-base);
    }

    th {
      padding: 10px 10px 10px 0px;
      margin-bottom: 10px;
    }
  }
}
</style>
