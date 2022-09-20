import axios from "axios";
const state = {
    users:[],
    users_total:0
};
const getters = {};

const actions = {
    getUsers({commit}, values){
        var sort = ''
        if(values.sortBy.length === 1){
            if(values.sortDesc[0]){
                sort = sort + "&sort=-" + values.sortBy[0]
            }else{
                sort = sort + "&sort=" + values.sortBy[0]
            }
        }
        var filters = ''
        if(localStorage.getItem('filtersUsers')!=undefined){
            filters = '&' + JSON.parse(localStorage.getItem('filtersUsers'))
        }
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users?page=" + values.page + "&itemsPerPage=" + values.itemsPerPage + sort + filters).then(response => {
            commit('setUsers', response.data.data);
            commit('setUsersTotal', response.data.meta.total);
        });
    }
};

const mutations = {
    setUsers(state, data){
        state.users = data;
    },
    setUsersTotal(state, data){
        state.users_total = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}