export const state = () => ({
    currencys: [],
    selectedCurrency: "COP",
    selectedProducts: []
})

export const getters = {
    currencys: state => state.currencys,
    selectedCurrency: state => state.selectedCurrency,
    selectedProducts: state => state.selectedProducts
}

export const actions = {
    addProduct({ commit, state }, data) {
        commit('addProduct', data)
    },
    removeProduct({ commit, state }, data) {
        commit('removeProduct', data)
    },
    setSelectedCurrency({ commit, state }, data) {
        commit('setSelectedCurrency', data)
    },
    updateCurrencies({ commit, state }, data) {
        commit('updateCurrencies', data)
    },
    changeMountSelected({ commit, state }, data) {
        commit('changeMountSelected', data)
    },
    changeDiscountSelected({ commit, state }, data) {
        commit('changeDiscountSelected', data)
    },
}

export const mutations = {
    updateCurrencies(state, data) {
        state.currencys = data
    },
    addProduct(state, data) {
        if (state.selectedProducts.filter(i => (i._id === data._id)).length > 0) return
        state.selectedProducts.push(data)
    },
    removeProduct(state, data) {
        const index = state.selectedProducts.findIndex(item => item._id === data._id);
        state.selectedProducts.splice(index, 1)
    },
    setSelectedCurrency(state, data) {
        state.selectedCurrency = data
    },
    changeMountSelected(state, { value, id }) {
        const index = state.selectedProducts.findIndex(item => item._id === id);
        state.selectedProducts[index]['amount'] = value
    },
    changeDiscountSelected(state, { value, id }) {
        const index = state.selectedProducts.findIndex(item => item._id === id);
        state.selectedProducts[index]['discount'] = value
    }
}