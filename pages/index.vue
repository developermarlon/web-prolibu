<template lang="pug">
    div(container="general")
        
</template>

<script>
export default {
    name: "Home",
    layout: "default", 
    head() {
        return {
            title: "Test prolibu",
            meta: [
              { hid: 'description', name: 'description', content: 'Test prolibu' }
            ]
        }
    }
}
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
