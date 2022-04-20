<template lang="pug">
v-app(:dark="false")
    div
        NavigationAppbar
    
    v-main
        v-slide-y-transition(mode="out-in")
            Nuxt
</template>

<script>

export default {
    name: "Default",
    data() {
        return {
            goDark: false
        };
    },
    methods: {},
    watch: {
        $route() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }
    }
}
</script>
