import axios from "axios";
const state = {
    podcasts:[],
    podcasts_total:[]
};
const getters = {};

const actions = {
    getPodcasts({commit}, values){
        var sort = ''
        if(values.sortBy.length === 1){
            if(values.sortDesc[0]){
                sort = sort + "&sort=-" + values.sortBy[0]
            }else{
                sort = sort + "&sort=" + values.sortBy[0]
            }
        }
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/podcasts?page=" + values.page + "&itemsPerPage=" + values.itemsPerPage + sort + values.filters).then(response => {
            console.log(response)
            commit('setPodcasts', response.data.data);
            commit('setPodcastsTotal', response.data.meta.total);
        });
    }
};

const mutations = {
    setPodcasts(state, data){
        state.podcasts = data;
    },
    setPodcastsTotal(state, data){
        state.podcasts_total = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}