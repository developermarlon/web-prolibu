export const state = () => ({
    auth: false,
    fullname: null,
    email: null,
    photo: null,
    permissions: null,
    token: null
})

export const getters = {
    auth: state => {
        return state.auth
    },
    user: state => {
        return state
    },
    token: state => {
        return state.token
    },
    permissions: state => {
        return state.permissions
    }
}

export const actions = {
    openSession({ commit, state }, data) {
        commit('openSession', data)
    },
    closeSession({ commit, state }) {
        commit('closeSession')
    },
}

export const mutations = {
    openSession(state, data) {
        state.auth = true
        state.fullname = data.fullname
        state.email = data.email
        state.permissions = data.permissions
        state.token = data.token
    },
    closeSession(state) {
        this.$router.push({ path: '/' })
        state.auth = false
        state.fullname = null
        state.email = null
        state.permissions = null
        state.token = null
    }
}