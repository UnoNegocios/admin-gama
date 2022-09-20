<template>
  <v-container class="pa-0">
        <v-card class="elevation-0 pa-6">
            <v-card-title>Crear Usuario</v-card-title>
            <v-form>
                <v-row class="ma-0">
                    <v-col cols="6" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="name"
                            label="Nombre"
                            outlined
                            v-model="user.name" 
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="last"
                            label="Apellido"
                            outlined
                            v-model="user.last" 
                            dense
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" class="py-0">
                        <v-autocomplete :loading="isLoadingStates" :search-input.sync="searchStates" hide-no-data placeholder="Escribe para buscar" attach
                            :rules="[rules.required]"
                            name="state"
                            label="Estado"
                            outlined
                            v-model="state" 
                            dense
                            :items="statesList"
                            item-value="name"
                            item-text="name"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="6" class="py-0"><!--:search-input.sync="searchCities"-->
                        <v-autocomplete :loading="isLoadingCities" hide-no-data placeholder="Escribe para buscar" attach
                            :rules="[rules.required]"
                            name="city"
                            label="Ciudad"
                            outlined
                            v-model="user.city" 
                            dense
                            :items="citiesList"
                            :disabled="state==''"
                            item-value="name"
                            item-text="name"
                        ></v-autocomplete>
                    </v-col>


                    <v-col cols="6" class="py-0">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                v-model="user.birthdate"
                                label="Fecha de Nacimiento"
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                                name="birthdate"
                                outlined
                                dense
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="user.birthdate"
                                :active-picker.sync="activePicker"
                                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                min="1950-01-01"
                                @change="saveDate"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-select
                            :rules="[rules.required]"
                            name="gender"
                            label="Genero"
                            outlined
                            v-model="user.gender" 
                            dense
                            :items="genders"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-select
                            :rules="[rules.required]"
                            name="type"
                            label="Tipo de Usuario"
                            outlined
                            v-model="user.type" 
                            dense
                            :items="types"
                        ></v-select>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            @keydown.enter="login" 
                            label="Correo Electrónico" 
                            name="login" 
                            v-model="user.email" 
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            name="password"
                            label="Contraseña"
                            outlined
                            @click:append="show = !show"
                            @keydown.enter="login" v-model="user.password" 
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-text-field 
                            :rules="[rules.required, rules.same_password]"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            name="password"
                            label="Confirmar Contraseña"
                            outlined
                            @click:append="show = !show"
                            @keydown.enter="login" v-model="confirmPassword" 
                            dense
                            :disabled="user.password==''"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
            <v-card-actions class="px-0">
                <v-btn @click="close()" class="elevation-0 px-4" text><strong>Cancelar</strong></v-btn>
                <v-btn :disabled="ready||gris" @click="save()" class="elevation-0 px-4" color="primary"><strong>Guardar</strong></v-btn>
            </v-card-actions>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            <strong>{{ snackbar.message }}</strong>
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data: () => ({
        activePicker: null,
        menu: false,
        gris:false,
        show: false,
        user:{
            state:'',
            type:'',
            gender:'',
            city:'',
            birthdate:'',
            email:'',
            last:'',
            name:'',
            password:''
        },
        confirmPassword:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        genders:['Masculino', 'Femenino'],
        types:['Administrador', 'Usuario App'],
        entries:{
            states: [],
            cities:[]
        },
        state:'',
        isLoadingCities: false,
        isLoadingStates: false,
        searchCities: null,
        searchStates: null,
    }),
    computed:{
        statesList(){
            return this.entries.states
        },
        citiesList(){
            return this.entries.cities
        },
        rules(){
            return{
                required: value => !!value || 'Campo requerido.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'E-mail inavlido.'
                },
                same_password: value => value === this.user.password || 'Las contraseñas no coinciden',
            }
        },
        ready(){
            if(this.user.name!=''&&
            //this.user.state!=''&&
            this.user.type!=''&&
            this.user.gender!=''&&
            this.user.city!=''&&
            this.user.birthdate!=''&&
            this.user.email!=''&&
            this.user.name!=''&&
            this.user.password!=''&&
            this.user.password==this.confirmPassword){
                return false
            }else{
                return true
            }
        },
    },
    methods:{
        saveDate (date) {
            this.$refs.menu.save(date)
        },
        save(){
            this.entries.state = this.state
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users", this.user).then(response=>{
                this.close()
            }).catch(error=>{
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
                this.gris = false
            })
        },
        close(){
            this.user={
                state:'',
                type:'',
                gender:'',
                city:'',
                birthdate:'',
                email:'',
                last:'',
                name:'',
                password:''
            }
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", false);
            })
        }
    },
    watch: {
        menu (val) {
            val && setTimeout(() => (this.activePicker = 'YEAR'))
        },
        searchStates(val){
            //if (this.statesList.length > 0) return
            if (this.isLoadingStates) return
            this.isLoadingStates = true

            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/states?filter[name]='+val)
            .then(res => {
                this.entries.states = res.data
            }).finally(() => (this.isLoadingStates = false))
        },
        state: {
            handler () {
                //if (this.citiesList.length > 0) return
                if (this.isLoadingCities) return
                this.isLoadingCities = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/cities?filter[state.name]=' + this.state)
                .then(res => {
                    this.entries.cities = res.data
                }).finally(() => (this.isLoadingCities = false))
            },
            deep: true,
        },
    },
}
</script>