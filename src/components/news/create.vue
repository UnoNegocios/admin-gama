<template>
    <v-card class="elevation-0">

        <v-toolbar dark color="primary" class="elevation-0">
            <v-btn icon dark @click="close()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Nueva Noticia</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-checkbox class="my-5 mr-5" v-model="post.visibility.web" label="Página Web"></v-checkbox>
                <v-checkbox class="my-5 mr-5" v-model="post.visibility.app" label="Aplicación"></v-checkbox>
                <v-btn dark text @click="save()" :disabled="grey">
                    Publicar
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-form class="px-12 py-6">
            <v-row class="ma-0">
                <v-col cols="8">
                    <v-text-field v-model="post.title" label="Título"></v-text-field>
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
            <strong>Contenido:</strong>
            <vue-editor
                use-custom-image-handler
                @image-added="handleImageAdded"
                v-model="post.content"
                :editorOptions="editorSettings"
                >
            </vue-editor>
            <v-row class="ma-4 mt-8">
                <v-textarea v-model="post.short_description"
                counter
                maxlength="100"
                outlined  
                label="Descripción Corta"></v-textarea>
                <v-spacer/>
                <vue-dropzone 
                v-bind:auth="dropzoneOptions.headers"
                ref="myVueDropzone" 
                id="dropzone" 
                :options="dropzoneOptions" 
                v-on:vdropzone-success="uploadSuccess" 
                v-on:vdropzone-error="uploadError" 
                v-on:vdropzone-removed-file="fileRemoved"/>
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
import { VueEditor,Quill } from 'vue2-editor';

import ImageResize from 'quill-image-resize-vue';
import { ImageDrop } from 'quill-image-drop-module';

Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

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
            content:'',
            title:'',
            visibility:{
                web:true,
                app:true
            },
            featured_media_path:'',
            status:'published',
            short_description:''
        },
        editorSettings: {
            modules: {
                imageDrop: true,
                imageResize: {},
            }
        },
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
            dictDefaultMessage: 'Haz clic aquí para editar o arrastra la imagen destacada. <br/><strong>Se recomienda relación aspecto 16:9</strong><br/><span style="font-size:14px; color:#b3b3b3;">Medida sugerida: 960 x 540 pixeles<span/>',
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
        categories(){
            return this.$store.state.category.categories
        },
        grey(){
            if((this.post.categories.length==0||
            this.post.content==''||this.post.content==null||this.post.content==undefined||
            this.post.title==''||this.post.title==null||this.post.title==undefined||
            this.post.featured_media_path==''||this.post.featured_media_path==null||this.post.featured_media_path==undefined||
            this.post.short_description==''||this.post.short_description==null||this.post.short_description==undefined) 
            || (!this.post.visibility.app && !this.post.visibility.web) ){
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
            var formData = new FormData();
            formData.append("image", file);
            axios({
                url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/post/image",
                method: "POST",
                data: formData,
            })
            .then(response => {
                const url = process.env.VUE_APP_BACKEND_ROUTE + 'files/' + response.data.file
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
            this.post.featured_media_path = process.env.VUE_APP_BACKEND_ROUTE + 'files/' + response.file
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
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/posts', this.post).then(response=>{
                this.close()
            })
        },
        close(){
            if(this.image!=''&&this.image!=null&&this.image!=undefined){
                this.$refs.myVueDropzone.removeFile(this.image)
            }
            this.post = {
                categories:[],
                content:'',
                title:'',
                visibility:{
                    web:true,
                    app:true
                },
                image:'',
                short_description:''
            },
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", false);
            })
        }
    },
}
</script>