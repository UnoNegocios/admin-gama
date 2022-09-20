<template>
    <v-container class="py-4">
        <!-- Header -->
        <v-toolbar dark flat class="mb-0 mt-0 px-6">
            <v-toolbar-title>Lives</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- Filtros -->
            <v-btn light class="ml-6" @click="openSearch=!openSearch">
                <v-icon class="mx-2">mdi-magnify</v-icon>
                Buscar
            </v-btn>
            <!-- Crear -->
            <v-dialog v-model="createDialog" max-width="700px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn light v-bind="attrs" v-on="on" class="ml-8">
                        <v-icon class="mx-2">mdi-account-plus</v-icon>
                        Crear
                    </v-btn> 
                </template>
                <create @closeCreateDialog="closeCreateDialog"/>
            </v-dialog>
        </v-toolbar>
        <!-- Search bar -->
        <v-text-field v-show="openSearch" class="px-12 pt-6" append-icon="mdi-magnify" style="background:white;" @keydown.enter="buscar = !buscar" dense outlined v-model="search" placeholder="Buscador"></v-text-field>

        <!-- Loader -->
        <v-progress-linear v-if="loading" color="primary" class="mt-4" indeterminate rounded height="6"></v-progress-linear>

        <!-- Container -->
        <v-container v-else class="pa-0">
            <!-- Lives -->
            <v-row dense class="ma-0 pa-4" style="background:white;">
                <v-col v-for="(live, index) in records" v-bind:key="index" cols="4" class="pa-4">
                    <v-card class="elevation-0 ma-0 pa-0">
                        <div class="d-flex flex-no-wrap">
                            <v-img :src="liga + 'files/' + live.image_url" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px">
                                <!-- title -->
                                <v-card-title class="text-h5" v-text="live.name"></v-card-title>
                                <!-- options -->
                                <v-menu bottom left >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-btn fab x-small v-bind="attrs" v-on="on" absolute top right class="mt-6">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                    </template>
                                    <v-list style="font-size:13px;">
                                        <v-list-item @click="editItem(live)" >
                                            <v-icon small class="mr-2">
                                                mdi-pencil
                                            </v-icon>
                                            Editar
                                        </v-list-item>
                                        <v-list-item @click="deleteItem(live.id)">
                                            <v-icon small class="mr-2">
                                                mdi-delete
                                            </v-icon>
                                            Eliminar
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-img>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <!-- Pagination -->
            <div class="text-center mt-4">
                <v-pagination
                color="#94233c"
                circle
                v-model="page"
                :length="pageRecords"
                :total-visible="6"
                ></v-pagination>
            </div>
        </v-container>
        <!-- Editar -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:live="record" @closeEditDialog="closeEditDialog"/>
        </v-dialog>
        <!-- Eliminar -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar este Live?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteRecord()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- errores -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
import Create from "../lives/create"
import Edit from "../lives/edit"
export default {
    components: {
        'create':Create,
        'edit':Edit,
    }, 
    data: () => ({
        search:'',
        buscar:false,
        openSearch:false,
        record:{},
        loading: true,
        options: {},
        sheet: false,
        editDialog: false,
        createDialog: false,
        deleteId:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        page:1,
    }),
    created(){
        this.getDataFromApi()
    },
    computed:{
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        pageRecords(){
            return this.$store.state.live.lives_page
        },
        records(){
            return this.$store.state.live.lives
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
    },
    watch: {
        page: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
        buscar: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.$store.dispatch('live/getLives', {filters:'&filter[name]=' + this.search, page:this.page}).then(data => {
                this.loading = false
            })
        },
        permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        },
        closeEditDialog: function(params) {
            this.editDialog = params;
            this.getDataFromApi()
        },
        closeCreateDialog: function(params) {
            this.createDialog = params;
            this.getDataFromApi()
        },
        deleteRecord(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/live/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        deleteItem (id) {
            this.deleteId = id
            this.sheet = true
        },
        editItem(editedItem){
            this.record = editedItem
            this.editDialog = true
        },
    },
}
</script>