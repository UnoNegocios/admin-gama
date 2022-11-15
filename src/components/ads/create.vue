<template>
  <v-container class="pa-0">
        <v-card class="elevation-0 pa-6">
            <v-row class="ma-0 mb-3">
                <v-card-title>Crear Anuncio</v-card-title>
                <v-spacer/>
                <v-switch
                v-model="ad.is_active"
                inset
                label="Activo"
                ></v-switch>
            </v-row>
            <v-form>
                <v-row class="ma-0">
                    <v-col cols="12" class="py-0">
                        <v-autocomplete 
                            v-model="ad.client_id" 
                            :items="clientsList" 
                            :loading="isLoadingClients" 
                            :search-input.sync="searchClients" 
                            :hide-no-data="showCreateClient"
                            item-value="id" 
                            item-text="name" 
                            label="Cliente" 
                            placeholder="Escribe para buscar" 
                            dense
                            outlined
                        >
                            <template slot="no-data">
                                <div class="px-6 pt-3">
                                    No existen clientes relacionados.
                                    <v-text-field v-model="createClient.name" label="Crear Cliente" append-icon="mdi-plus" @click:append="saveClient()"></v-text-field>
                                </div>
                            </template>
                        </v-autocomplete>
                    </v-col>

                    <v-col cols="12" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="title"
                            label="Titulo"
                            outlined
                            v-model="ad.title" 
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="url"
                            label="Link del Anuncio"
                            outlined
                            v-model="ad.url" 
                            dense
                        ></v-text-field>
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
                                v-model="ad.start_time"
                                label="Fecha Inicio"
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                                outlined
                                dense
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="ad.start_time"
                                @change="saveDate"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-menu
                            ref="menu2"
                            v-model="menu2"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                v-model="ad.end_time"
                                label="Finalización"
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                                outlined
                                dense
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="ad.end_time"
                                @change="saveDate2"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>

                    
                     <v-col cols="12" md="6" sm="6" class="py-0">
                        <v-select
                            :rules="[rules.required]"
                            name="height"
                            label="Horario Inicio"
                            outlined
                            v-model="ad.start_hour" 
                            dense
                            :items="hours"
                        ></v-select>
                     </v-col>
                      <v-col cols="12" md="6" sm="6" class="py-0">
                        <v-select
                            :rules="[rules.required]"
                            name="width"
                            label="Horario Fin"
                            outlined
                            v-model="ad.end_hour" 
                            dense
                            :items="hours"
                        ></v-select>
                      </v-col>
                    

                    <v-col cols="6" class="py-0">
                        <v-select :items="positions" v-model="ad.position" outlined dense label="Posición" item-text="label" item-value="label"></v-select>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-menu top offset-x class="hidden-md-and-down">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :disabled="ad.position==''" :color="colorFile" style="font-size:12px;" text v-bind="attrs" v-on="on">
                                    <v-icon class="mr-2">mdi-attachment</v-icon> Adjuntar Banner <strong>{{positionSize}}</strong>
                                </v-btn>
                            </template>
                            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
                        </v-menu>
                    </v-col>

                </v-row>
            </v-form>
            <v-card-actions class="px-0">
                
                <v-spacer/>
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
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from "axios"
export default {
    components: {
        vueDropzone: vue2Dropzone
    }, 
    data: () => ({
        positions:[
            {label:'Fullscreen App', size:'1170×2077'},
            {label:'Inicio', size:'1280x240'},
            {label:'Categoría', size:'1280x240'},
            {label:'Noticia', size:'720x720'},
            {label:'En Vivo', size:'1280x240'},
            {label:'Podcast', size:'720x720'},
            {label:'Episodio', size:'720x720'},
        ],
        showCreateClient:true,
        createClient:{
            name:''
        },
        clientsList:[],
        isLoadingClients: false,
        searchClients: null,
        colorFile:'black',
        dropzoneOptions: {
            url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ad/files",
            addRemoveLinks: true,
            maxFiles: 1,
            headers:{"Authorization":'Bearer ' + localStorage.getItem("token")},
        },
        gris:false,
        image:'',
        ad:{
            is_active: true,
            client_id:'',
            title: '',
            url: '',
            start_time: '',
            end_time: '',
            start_hour:'',
            end_hour:'',
            position: '',
            image_url: '',
        },
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        menu:false,
        menu2:false,
    }),
    watch:{
        searchClients(val){
            //if (this.companyLists.length > 0) return
            if (this.isLoadingClients) return
            this.isLoadingClients = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/clients?filter[name]='+val)
            .then(res => {
                this.clientsList = this.clientsList.concat(res.data.data)
                if(!res.data.data.length){
                    this.showCreateClient = false
                    this.createClient.name = this.searchClients
                }
            }).finally(() => (this.isLoadingClients = false))
        },
    },
    computed:{
        positionSize(){
            return this.positions.filter(position=>position.label == this.ad.position).map(position=>position.size)[0] 
        },
        hours(){
            var arr = [], i, j;
            for(i=0; i<24; i++) {
                for(j=0; j<4; j++) {
                    arr.push(this.cero(i) + ":" + (j===0 ? "00" : 15*j) + ":00");
                }
            }
            return arr
        },
        rules(){
            return{
                required: value => !!value || 'Campo requerido.',
            }
        },
        ready(){
            return false
            if(this.ad.title!=''&&
                this.ad.image_url!=''){
                return false
            }else{
                return true
            }
        },
    },
    methods:{
        
        saveClient(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/clients', this.createClient)
            .then(res => {
                this.searchClients = ''
                this.$nextTick(() => {
                    this.searchClients = this.createClient.name
                })
            })
        },
        cero(i){
            if(i<10){
                return '0' + i
            }else{
                return i
            }
        },
        saveDate (date) {
            this.$refs.menu.save(date)
        },
        saveDate2 (date) {
            this.$refs.menu2.save(date)
        },
        save(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ads", this.ad).then(response=>{
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
            if(this.image!=''&&this.image!=null&&this.image!=undefined){
                this.$refs.myVueDropzone.removeFile(this.image)
            }
            this.ad={
                image_url: '',
                ad_campaing_id: '',
                alt: '',
                end_time: '',
                height: '',
                image_path: '',
                is_active: true,
                start_time: '',
                title: '',
                url: '',
                width: '',
            }
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", false);
            })
        },
        uploadSuccess(file, response) {
            this.image = file
            this.ad.image_path = response.file
            this.ad.image_url = process.env.VUE_APP_BACKEND_ROUTE + 'files/' + response.file
            this.colorFile = 'success'
        },
        uploadError(file, message) {
            this.snackbar = {
                message: 'No se puedo cargar la imagen',
                color: 'error',
                show: true
            }
            this.colorFile = 'error'
        },
        fileRemoved() {
            
        },
    }
}
</script>