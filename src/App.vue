<template>
  <v-app :dark="true">
    <v-main>
      <app v-if="token!=null"></app>
      <login v-else></login>
    </v-main>
    <v-snackbar top :value="updateExists" color="primary" timeout="999999999" style="margin-top:-72px;" content-class="py-1"><!--updateExists-->
      <span style="font-size:16px;">Actualización disponible</span>
      <v-btn class="ml-4 elevation-0" small style="margin-top:-4px;" color="white" light @click="refreshApp">
        Actualizar
      </v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
import update from './mixins/update'
import App from "../src/views/App"
import Login from "../src/views/Login"
import axios from "axios"
export default {
  mixins: [update],
  name: 'App',
  data: () => ({
    token:localStorage.getItem("token"),
  }),
  components:{ 
    'app':App, 
    'login':Login,
  },
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").catch(error => {
      localStorage.removeItem("token");
      this.token = null
    });
  }
};
</script>