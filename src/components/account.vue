<template>
    <v-container class="py-4">
        <v-toolbar dark flat class="mb-0 mt-0 px-6">
            <v-toolbar-title>Mi Cuenta</v-toolbar-title>
        </v-toolbar>
        <v-card style="background:transparent; border-radius:0px;" class="elevation-0 mt-3 pb-4">
            <div style="background:white;" class="px-6 pb-5">
                <v-row class="p-4">
                    <v-col cols="3" class="pb-6 pt-7">Foto</v-col>
                    <v-col cols="7" class="pb-6 pt-7">Puedes personalizar tu cuenta con una foto</v-col>
                    <v-col cols="2">
                        <v-dialog v-model="dialog" width="325">
                            <template v-slot:activator="{ on, attrs }">
                                <v-avatar v-bind="attrs" v-on="on" elevation="2" size="50px">
                                    <v-img alt="user" :src="link + 'files/'+currentUser.avatar"></v-img>
                                </v-avatar>
                            </template>
                            <v-card>
                                <vue-dropzone 
                                    ref="myVueDropzone" 
                                    id="dropzone" 
                                    :options="dropzoneOptions" 
                                    v-on:vdropzone-success="uploadSuccess" 
                                    v-on:vdropzone-error="uploadError" 
                                    v-on:vdropzone-removed-file="fileRemoved"/>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-snackbar :color="snackbar2.color" v-model="snackbar2.show">
                                {{ snackbar2.message }}
                            </v-snackbar>
                        </v-dialog>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Nombre</v-col>
                    <v-col cols="7">
                        <span v-if="editName==false">{{currentUser.name}} {{currentUser.last}}</span>
                        <v-text-field v-else v-model="currentUser.name"  @click:append="save" append-icon="mdi-content-save" label="Nombre" placeholder="Nombre" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editName==false" @click="editName=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editName==true" @click="editName=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Correo Electr??nico</v-col>
                    <v-col cols="7">
                        <span v-if="editEmail==false">{{currentUser.email}}</span>
                        <v-text-field v-model="currentUser.email" @click:append="save" append-icon="mdi-content-save" v-else label="Correo Electr??nico" placeholder="Correo Electr??nico" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editEmail==false" @click="editEmail=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editEmail==true" @click="editEmail=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Contrase??a</v-col>
                    <v-col cols="7">
                        <span v-if="editPassword==false">* * * * * * * *</span>
                        <v-text-field v-model="editedPassword.password" @click:append="savePassword" append-icon="mdi-content-save" v-else label="Contrase??a" placeholder="Contrase??a" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editPassword==false" @click="editPassword=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editPassword==true" @click="editPassword=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
                <v-divider class="mt-4"></v-divider>
                <v-row class="pt-4">
                    <v-col cols="3">Tel??fono</v-col>
                    <v-col cols="7">
                        <span v-if="editPhone==false">{{currentUser.phone}}</span>
                        <v-text-field v-model="currentUser.phone" @click:append="save" append-icon="mdi-content-save" v-else label="Tel??fono" placeholder="Tel??fono" outlined></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pl-7">
                        <v-icon v-if="editPhone==false" @click="editPhone=true" small>mdi-pencil</v-icon>
                        <v-icon v-if="editPhone==true" @click="editPhone=false" small>mdi-close</v-icon>
                    </v-col>
                </v-row>
            </div>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
    import vue2Dropzone from "vue2-dropzone";
    import "vue2-dropzone/dist/vue2Dropzone.min.css";
    import axios from "axios";
    export default {
        components: {
            vueDropzone: vue2Dropzone,
        },  
        data () {
            return {
                dialog: false,
                snackbar2: {
                    show: false,
                    message: null,
                    color: null
                },
                dropzoneOptions: {
                    url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/photo",
                    addRemoveLinks: true,
                    maxFiles: 1,
                    thumbnailWidth: 250,
                    dictDefaultMessage: 'Haz clic aqu?? o arrastra una imagen.',
                    dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
                    dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                    dictInvalidFileType: "No puede cargar archivos de este tipo.",
                    dictCancelUpload: "Cancelar carga",
                    dictCancelUploadConfirmation: "Est??s seguro de que deseas cancelar esta carga?",
                    dictRemoveFile: "Eliminar",
                    dictMaxFilesExceeded: "No puedes subir m??s archivos.",
                    headers:{"Authorization":'Bearer ' + localStorage.getItem("token")},
                },
                info:true,
                editName:false,
                editPhoto:false,
                editEmail:false,
                editPassword:false,
                editPhone:false,
                editedPassword:{
                    password:''
                },
                snackbar: {
                    show: false,
                    message: null,
                    color: null
                },
            }
        },
        methods:{
            save(){
                axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/update",Object.assign(this.currentUser)).then(response=>{
                    this.$store.dispatch('currentUser/getUser')
                    this.editName=false
                    this.editPhoto=false
                    this.editEmail=false
                    this.editPhone=false
                    this.dialog=false
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            },
            savePassword(){
                axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/password",Object.assign(this.currentUser, this.editedPassword)).then(response=>{
                    this.editedPassword=''
                    this.editPassword=false
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            },
            uploadSuccess(file, response) {
                console.log('File Successfully Uploaded with file name: ' + response.file);
                this.fileName = response.file
                this.currentUser.avatar = this.fileName
                this.index = this.index+1
            },
            uploadError(file, message) {
                this.snackbar2 = {
                    message: message.message,
                    color: 'error',
                    show: true
                }
            },
            fileRemoved(file) {
                this.currentUser.avatar = ''
            },
        },
        computed:{
            link(){
                return process.env.VUE_APP_BACKEND 
            },
          currentUser:{
            get(){
              return this.$store.state.currentUser.user
            }
          }
        },
    }
</script>

<style>
@media (min-width: 980px){
    .padding1{
        padding-left: 24px !important;
        padding-right: 48px !important;
    }
    .padding3{
        padding-right: 36px !important;
        padding-left: 36px !important;
    }
}
@media (max-width: 980px){
    .padding1{
        padding-top:20px!important;
    }
}
.v-sheet--offset {
    top: -50px;
    position: relative;
    margin: auto;
    display: block;
    border-radius: 50%!important;
    margin-bottom: -30px;
  }
</style>