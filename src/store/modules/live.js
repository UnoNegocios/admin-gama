import axios from "axios";
const state = {
    lives:[],
    lives_page:[]
};
const getters = {};

const actions = {
    getLives({commit}, values){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/live?page=" + values.page + values.filters).then(response => {
            console.log(response)
            commit('setLives', response.data.data);
            commit('setLivesPage', response.data.meta.last_page);
        });
    }
};

const mutations = {
    setLives(state, data){
        state.lives = data;
    },
    setLivesPage(state, data){
        state.lives_page = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}