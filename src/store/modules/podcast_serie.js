import axios from "axios";
const state = {
    series:[],
    series_page:0
};
const getters = {};

const actions = {
    getSeries({commit}, values){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/podcast_serie?page=" + values.page + values.filters).then(response => {
            commit('setSeries', response.data.data);
            commit('setSeriesPage', response.data.meta.last_page);
        });
    }
};

const mutations = {
    setSeries(state, data){
        state.series = data;
    },
    setSeriesPage(state, data){
        state.series_page = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}