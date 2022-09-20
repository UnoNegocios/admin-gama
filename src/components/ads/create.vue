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

                    <v-row class="ma-0">
                    <v-col cols="12" md="4" sm="4" class="py-0">
                        <v-menu top offset-x class="hidden-md-and-down">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :color="colorFile" style="font-size:12px;" text v-bind="attrs" v-on="on">
                                    <v-icon class="mr-2">mdi-attachment</v-icon> Adjuntar Banner
                                </v-btn>
                            </template>
                            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
                        </v-menu>
                    </v-col>
                     <v-col cols="12" md="4" sm="4" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="height"
                            label="Alto"
                            outlined
                            v-model="ad.height" 
                            dense
                        ></v-text-field>
                     </v-col>
                      <v-col cols="12" md="4" sm="4" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="width"
                            label="Ancho"
                            outlined
                            v-model="ad.width" 
                            dense
                        ></v-text-field>
                      </v-col>
                    </v-row>

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
                                label="Inicio"
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
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from "axios"
export default {
    components: {
        vueDropzone: vue2Dropzone
    }, 
    data: () => ({
        colorFile:'black',
        dropzoneOptions: {
            url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ad/files",
            addRemoveLinks: true,
            maxFiles: 1
        },
        gris:false,
        image:'',
        ad:{
            image_url: '',
            ad_campaign_id: '',
            alt: '',
            end_time: '',
            height: '',
            image_path: '',
            is_active: true,
            start_time: '',
            title: '',
            url: '',
            width: '',
        },
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        menu:false,
        menu2:false,
    }),
    computed:{
        rules(){
            return{
                required: value => !!value || 'Campo requerido.',
            }
        },
        ready(){
            if(this.ad.title!=''&&
            this.ad.image_url!=''){
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
        saveDate2 (date) {
            this.$refs.menu2.save(date)
        },
        save(){
            this.ad.ad_campaign_id = this.$route.params.serie_id
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
                ad_campaign_id: '',
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
            this.ad.image_url = process.env.VUE_APP_BACKEND_ROUTE + response.file
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