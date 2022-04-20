<template lang="pug">
    div#general-container-login
        form(v-on:submit.prevent="login").pa-5.mx-4
            h1.text-center.mb-4.font-family-raleway-black Login

            v-text-field(v-model="form.email" type="email" label="Email" :required="true" placeholder="Email" filled rounded dense hide-details class="font-family-raleway-regular").mb-4
                v-icon(slot="append" color="blue-grey lighten-2") fas fa-envelope

            v-text-field(v-model="form.password" type="password" label="Password" :required="true" placeholder="Password" filled rounded dense hide-details class="font-family-raleway-regular")
                v-icon(slot="append" color="blue-grey lighten-2") fas fa-key

            v-btn(@click="login" :loading="loadingRequest" :disabled="loadingRequest" type="submit" color="important" x-large rounded block dark).mb-0.elevation-0.text-capitalize.font-family-raleway-black.mt-10 Ingresar

</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Login",
  layout: "default",
  middleware: ["unauthenticated"],
  head() {
    return {
      title: "Search products",
      meta: [
        { hid: "description", name: "description", content: "Search products" },
      ],
    };
  },
  data() {
    return {
      form: {
        email: "admin@localhost",
        password: "admin",
      },
      loadingRequest: false,
    };
  },
  methods: {
    ...mapActions({
      openSession: "user/openSession",
    }),
    async login() {
      try {
        this.loadingRequest = true;

        const result = await this.$axios.post(`/users/login`, this.form, {
          headers: {
            "Content-Type": "application/json",
            Authorization: null,
          },
        });

        this.$swal.fire({
          title: "Welcome",
          text: "Successful login",
          type: "success",
          timer: 1500,
        });

        this.form = {
          email: null,
          password: null,
        };

        this.openSession(result.data);
        this.$router.push({ path: "/admin/products" });
      } catch (error) {
        console.log(error);
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: "Incorrect data",
        });
      } finally {
        this.loadingRequest = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      auth: "user/auth",
    }),
  },
  created() {
    this.$nextTick().then(() => {
      if (this.auth) this.$router.push({ path: "/admin/products" });
    });
  },
};
</script>

<style lang="scss" scoped>
#general-container-login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  & > form {
    width: 100%;
    max-width: 500px;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0px 20px 15px -10px rgba(0, 0, 0, 0.2);
  }
}

@media screen and (min-width: 960px) {
  #general-container-login {
  }
}
</style>
