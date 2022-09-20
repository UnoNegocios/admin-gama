import axios from "axios";
const state = {
    ads:[],
    ads_total:0
};
const getters = {};

const actions = {
    getAds({commit}, values){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/adCampaigns/"+values.campaign_id+"/displayAds").then(response => {//?page=" + values.page + values.filters).then(response => {
            commit('setAds', response.data);
            commit('setAdsTotal', response.data.length);
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