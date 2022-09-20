import axios from "axios";
const state = {
    campaigns:[],
    campaigns_total:0
};
const getters = {};

const actions = {
    getCampaigns({commit}, values){
        return new Promise((resolve, reject) => {
            var sort = ''
            if(values.sortBy.length === 1){
                if(values.sortDesc[0]){
                    sort = sort + "&sort=-" + values.sortBy[0]
                }else{
                    sort = sort + "&sort=" + values.sortBy[0]
                }
            }
            var filters = ''
            if(localStorage.getItem('filtersCampaigns')!=undefined){
                filters = '&' + JSON.parse(localStorage.getItem('filtersCampaigns'))
            }
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ad_campaigns?page=" + values.page + "&itemsPerPage=" + values.itemsPerPage + sort + filters).then(response => {
                commit('setCampaigns', response.data.data);
                resolve(false)
                commit('setCampaignsTotal', response.data.meta.total);
            })
        })
    }
};

const mutations = {
    setCampaigns(state, data){
        state.campaigns = data;
    },
    setCampaignsTotal(state, data){
        state.campaigns_total = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}