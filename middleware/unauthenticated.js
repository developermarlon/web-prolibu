export default function ({ store, app, redirect }) {
    if (process.client) {
        if (store.getters['user/auth']) {
            (async () => {
                try {
                    const res = await app.$axios.post(`/users/verifyToken/`, {}, { headers: { "Authorization": store.getters['user/token'] } })
                } catch (error) {
                    redirect(`/auth/login`)
                    store.commit('user/closeSession')
                }
            })()
        }
    }
}