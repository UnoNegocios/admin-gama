<template>
    <v-container fill-height>
        <v-card width="500" class="elevation-0" style="margin:auto;">
            <v-img class="ma-6" src="/logo.png" transition="scale-transition" width="120" style="filter: grayscale(1) brightness(0) invert(1);"/>
            <v-card-title>Login</v-card-title>
            <v-form>
                <v-text-field 
                    :rules="[rules.required]"
                    @keydown.enter="login" 
                    label="Correo Electrónico" 
                    name="login" 
                    v-model="user.email" 
                    outlined
                    rounded
                ></v-text-field>
                <v-text-field 
                    :rules="[rules.required]"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    name="password"
                    label="Contraseña"
                    outlined
                    rounded
                    @click:append="show = !show"
                    @keydown.enter="login" v-model="user.password" 
                ></v-text-field>
            </v-form>
            <v-card-actions class="px-0">
                <v-btn rounded :disabled="user.email==''||user.password==''||gris" block @click="login" class="py-6 elevation-0" color="primary"><strong color="white">Acceder</strong></v-btn>
            </v-card-actions>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            <strong>{{ snackbar.message }}</strong>
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios"
  export default {
    data: () => ({
        gris:false,
        show: false,
        rules: {
            required: value => !!value || 'Campo requerido.',
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'E-mail inavlido.'
            },
        },
        user:{
            email: '',
            password: '',
        },
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),

    methods:{
        login() {
            this.gris = true
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/login", this.user).then(response => {
                if (response.data.access_token) {
                    localStorage.setItem("token", response.data.access_token);
                    window.location.replace("#/");
                    location.reload();
                }else{
                    this.snackbar = {
                        message: response.data.message,
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                }
            })
        },
    },
  }
</script>