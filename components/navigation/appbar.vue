<template lang="pug">
v-layout.pa-0.container-appbar.elevation-10.align-center
    v-container.py-2.px-2
        v-layout.justify-space-between.align-center

            v-img(src="https://prolibu.com/wp-content/themes/prolibu/assets/img/logo-prolibu.svg" class="grey@lighten-2" max-width="200")
                template(v-slot:placeholder)
                    v-row(class="fill-height ma-0" align="center" justify="center")
                        v-progress-circular( indeterminate color="important")

            v-flex 
                v-layout.align-center.justify-end
                    v-flex.xs12.d-flex.justify-center.align-center

                    v-btn(v-if="auth" to="/admin/products" color="important" aria-label="menu" name="menu" text small dark).d-none.d-sm-flex.text-capitalize.font-family-raleway-medium.elevation-0.mr-2 Products

                    v-btn(v-if="!auth" to="/auth/login" color="important" aria-label="menu" name="menu" small dark).text-capitalize.font-family-raleway-bold.elevation-0 
                        v-icon(size="15" color="#ffffff").mr-2 fas fa-user
                        | Login

                    client-only

                        v-dialog(v-if="auth" v-model="dialogLogout" transition="dialog-top-transition" max-width="400")
                            
                            template(v-slot:activator="{ on, attrs }")
                                v-btn(v-bind="attrs" v-on="on" color="important" aria-label="menu" name="menu" fab small dark).elevation-0
                                    v-icon(style="font-size: 15px" color="#ffffff") fas fa-power-off

                            template(v-slot:default="dialog")
                                v-card
                                    v-toolbar(color="important" dark)
                                        h6.text-h5.font-family-raleway-bold.mr-2 ¿ Are you sure ?
                                    v-card-text
                                        p.mt-3 Do you want to close session ?
                                    
                                    v-card-actions(class="justify-end flex-wrap")
                                        v-btn(color="important" dark @click="confirmLogout" block).elevation-0.text-capitalize.font-family-raleway-bold Confirm
                                        v-btn(color="primary" dark @click="dialogLogout = false" block).elevation-0.text-capitalize.font-family-raleway-bold.mt-2 Cancel

</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Appbar",
  data() {
    return {
      dialogLogout: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "user/user",
      auth: "user/auth",
    }),
  },
  methods: {
    ...mapActions({
      closeSession: "user/closeSession",
    }),
    confirmLogout() {
      this.dialogLogout = false;
      this.closeSession();
    },
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
</style>
