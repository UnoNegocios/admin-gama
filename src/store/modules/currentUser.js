import axios from "axios";
const state = {
  user: {},
};
const getters = {};
const actions = {
  getUser({ commit }) {
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").then(response => {
      commit("setUser", response.data.data);
    });
  },
  logoutUser() {
    localStorage.removeItem("token");
    window.location.replace("#/");
    location.reload();
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
