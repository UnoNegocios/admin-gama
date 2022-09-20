<template>
  <v-container class="pa-0">
        <v-card class="elevation-0 pa-6">
            <v-card-title>Editar Serie</v-card-title>
            <v-form>
                <v-row class="ma-0">
                    <v-col cols="6" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="name"
                            label="Nombre"
                            outlined
                            v-model="serie.name" 
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-menu top offset-x class="hidden-md-and-down">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn :color="colorFile" style="font-size:12px;" text v-bind="attrs" v-on="on">
                                    <v-icon class="mr-2">mdi-attachment</v-icon> Adjuntar Portada
                                </v-btn>
                            </template>
                            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
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
    props:{
        serie:Object,
    },
    data: () => ({
        colorFile: 'black',
        gris:false,
        image:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        dropzoneOptions: {
            url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/podcast_serie/files",
            addRemoveLinks: true,
            maxFiles: 1
        },
    }),
    computed:{
        rules(){
            return{
                required: value => !!value || 'Campo requerido.',
            }
        },
        ready(){
            if(this.serie.name!=''&&
            this.serie.image_url!=''){
                return false
            }else{
                return true
            }
        },
    },
    methods:{
        uploadSuccess(file, response) {
            this.image = file
            this.serie.image_url = response.file
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
        save(){
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/podcast_serie/" + this.serie.id, this.serie).then(response=>{
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
            this.$nextTick(() => {
                this.$emit("closeEditDialog", false);
            })
        }
    }
}
</script>