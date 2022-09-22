<template>
    <v-card class="elevation-0">
        <v-toolbar dark color="primary" class="elevation-0">
            <v-btn icon dark @click="close()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Modificar Noticia</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark text @click="save()">
                    Actualizar
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-form class="px-12 py-6">
            <v-row class="ma-0">
                <v-col cols="8">
                    <v-text-field label="Título"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-autocomplete :loading="isLoadingCategories" :search-input.sync="searchCategories" hide-no-data placeholder="Escribe para buscar" attach
                        name="category"
                        label="Categorías"
                        outlined
                        v-model="post.categories" 
                        dense
                        :items="categories"
                        item-value="id"
                        class="mt-3"
                        item-text="name"
                        multiple
                        small-chips
                    ></v-autocomplete>
                </v-col>
            </v-row>
            <vue-editor
                id="editor"
                useCustomImageHandler
                @imageAdded="handleImageAdded"
                v-model="post.htmlForEditor"
                >
            </vue-editor>
            <v-row class="ma-4">
                <v-spacer/>
                <vue-dropzone 
                ref="myVueDropzone" 
                id="dropzone" 
                :options="dropzoneOptions" 
                v-on:vdropzone-success="uploadSuccess" 
                v-on:vdropzone-error="uploadError" 
                v-on:vdropzone-removed-file="fileRemoved"/>
                <v-spacer/>
            </v-row>
        </v-form>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            <strong>{{ snackbar.message }}</strong>
        </v-snackbar>
    </v-card>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { VueEditor } from "vue2-editor";
import axios from 'axios'
export default {
    components: { 
        VueEditor,
        vueDropzone: vue2Dropzone
    },
    data: () => ({
        searchCategories:'',
        isLoadingCategories:false,
        post:{
            categories:[],
            htmlForEditor:''
        },
        categories:[],
        image:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        dropzoneOptions: {
            url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/podcast_serie/files",
            addRemoveLinks: true,
            maxFiles: 1,
            //thumbnailWidth: 150,
            dictDefaultMessage: 'Haz clic aquí para agregar o arrastra la imagen destacada',
            dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
            dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
            dictInvalidFileType: "No puede cargar archivos de este tipo.",
            dictCancelUpload: "Cancelar carga",
            dictCancelUploadConfirmation: "Estás seguro de que deseas cancelar esta carga?",
            dictRemoveFile: "Eliminar",
            dictMaxFilesExceeded: "No puedes subir más archivos.",
        },
    }),
    computed:{

    },
    methods:{
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
            var formData = new FormData();
            formData.append("image", file);
            axios({
                url: "https://fakeapi.yoursite.com/images",
                method: "POST",
                data: formData
            })
            .then(result => {
                const url = result.data.url;
                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
            })
            .catch(err => {
                this.snackbar = {
                    message: err,
                    color: 'error',
                    show: true
                }
            });
        },
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
            this.image = ''
        },
        save(){
            console.log('repsonse')
            axios.post('https://wp-backend.gamavision.com/wp-json/wp/v2/posts',{
                //...data
            }, {
                headers:{
                    'Authorization': {"username": "front-end", "password": "XAg(((A^08AdhD#Y#t&Sng2Q"}
                }
            }).then(response=>{
                console.log(repsonse)
            })
        },
        close(){
            if(this.image!=''&&this.image!=null&&this.image!=undefined){
                this.$refs.myVueDropzone.removeFile(this.image)
            }
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", false);
            })
        }
    },
    watch: {
        searchCategories(val){
            //if (this.statesList.length > 0) return
            if (this.isLoadingCategories) return
            this.isLoadingCategories = true

            axios.get('https://wp-backend.gamavision.com/wp-json/wp/v2/categories?search='+val)
            .then(res => {
                this.categories = this.categories.concat(res.data)
            }).finally(() => (this.isLoadingCategories = false))
        },
    },
}
</script>