import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import user from "./modules/user"
import podcast from "./modules/podcast"
import podcast_serie from "./modules/podcast_serie"
import live from "./modules/live"
import campaign from "./modules/campaign"
import ads from "./modules/ads"
import post from "./modules/post"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    post,
    currentUser,
    podcast,
    user,
    podcast_serie,
    live,
    campaign,
    ads
  }
})
