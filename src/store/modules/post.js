
import axios from "axios";
const state = {
    posts:[],
    show:false,
    posts_total:15,
    loader:true,
};
const getters = {};

const actions = {
    getPosts( {commit, state}, props ){
        state.loader = true
        var items_per_page = '&per_page=' + props.itemsPerPage
        var category = props.category
        return new Promise((resolve, reject) => {
            axios.get('https://wp-backend.gamavision.com/wp-json/wp/v2/posts?_fields=id,date,title,categories'+category + items_per_page).then(response => {
                commit('setPosts', response.data);
                state.loader = false;
            }).finally(() => (resolve(false)))
        })
    },
};

const mutations = {
    setPosts(state, data){
        console.log(data)
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