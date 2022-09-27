
import axios from "axios";
const state = {
    posts:[],
    show:false,
    posts_total:0,
    loader:true,
};
const getters = {};

const actions = {
    getPosts( {commit, state}, props ){
        state.loader = true
        var items_per_page = props.itemsPerPage
        var sort_by = props.sort
        var page = props.page
        var category = props.category
        return new Promise((resolve, reject) => {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/posts?page=' + page + "&sort=" + sort_by + "&itemsPerPage=" + items_per_page + category).then(response => {
                commit('setPosts', response.data.data);
                state.posts_total = response.data.meta.total
                state.loader = false;
            }).finally(() => (resolve(false)))
        })
    },
};

const mutations = {
    setPosts(state, data){
        state.posts = data;
    },
    setShow(){
        state.show = true;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}