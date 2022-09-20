<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app dark src="/bg-2.jpg"><!-- -->
      
      <v-img class="ma-6" src="/logo.png" transition="scale-transition" width="120" style="filter: grayscale(1) brightness(0) invert(1);"/><!---->
      <v-list>
        <v-list-item :disabled="item.disabled" @click="changeRoute(item.link)" v-for="(item, i) in items" :key="i" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn text bottom absolute @click="logout()">
        <v-icon>mdi-logout</v-icon>
        Cerrar Sesión
      </v-btn>
    </v-navigation-drawer>
    <v-main class="pa-0" style="background-color:#f4f5fa; min-height:100vh;">
      <v-container class="px-12 py-4" fluid>
          <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import router from '../router';
export default {
  name: 'App',
  data: () => ({
    dialog:true,
    drawer: true,
    items:[
      {icon: 'mdi-podcast', label:'Podcasts', link:'/podcast', disabled:false},
      {icon: 'mdi-youtube-subscription', label:'Lives', link:'/lives', disabled:false},
      {icon: 'mdi-bullhorn', label:'Anuncios', link:'/ads', disabled:false},
      //{icon: 'mdi-chart-bar', label:'Reportes', link:'/reports', disabled:true},
      {icon: 'mdi-account-multiple', label:'Usarios', link:'/users', disabled:false},
      {icon: 'mdi-account', label:'Mi Cuenta', link:'/account', disabled:false},
    ]
  }),
  computed:{
    currentUser:{
      get(){
        return this.$store.state.currentUser.user;
      }
    },
    liga(){
      return process.env.VUE_APP_BACKEND_ROUTE
    },
  },
  created(){
    this.$store.dispatch('currentUser/getUser')
  },
  methods:{
    logout(){
      this.$store.dispatch('currentUser/logoutUser')
    },
    changeRoute(link){
      /*
      for(var i=0; i<this.items.length; i++){
        this.items[i].color = 'primary'
      }
      this.items[index].color = 'red'
      */
      router.push(link)
      //this.dialog = false
    }
  }
};
</script>
<style>
.v-dialog--fullscreen{
  margin-top: 65px!important; 
  height:calc(100% - 65px)!important;
  box-shadow: none!important;
  background-color:white!important;
}
.v-dialog--fullscreen > .v-card, .v-application--wrap{
  max-height:calc(100% - 65px)!important;
  min-height:calc(100% - 65px)!important;
}
.theme--light.v-btn:hover::before {
    opacity: 0.0!important;
}
</style>


