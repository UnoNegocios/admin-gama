import axios from "axios";
const state = {
    ads:[],
    ads_total:0
};
const getters = {};

const actions = {
    getAds({commit}, values){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ads").then(response => {//?page=" + values.page + values.filters).then(response => {
            commit('setAds', response.data.data);
            commit('setAdsTotal', response.meta.total);
        });
    }
};

const mutations = {
    setAds(state, data){
        state.ads = data;
    },
    setAdsTotal(state, data){
        state.ads_total = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}