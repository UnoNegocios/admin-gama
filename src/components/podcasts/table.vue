<template>
    <v-container class="py-4">
        <!-- Header -->
        <v-toolbar dark flat class="mb-0 mt-0 px-6">
            <v-toolbar-title>Podcast - <strong>{{currentPodcast}}</strong></v-toolbar-title>
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

        <!-- Tabla -->
        <v-data-table
        class="mb-6 elevation-1"
        :items="records" 
        :headers="header"
        :footer-props="{'items-per-page-options':[15, 30, 50, totalRecords]}"
        :options.sync="options"
        :server-items-length="totalRecords"
        :loading="loading">
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de podcast aún
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item)">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item.id)">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table>
        <!-- Editar -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:podcast="record" @closeEditDialog="closeEditDialog"/>
        </v-dialog>
        <!-- Eliminar -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar este episodio de podcast?
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
import Create from "../podcasts/create"
import Edit from "../podcasts/edit"
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
    }),
    computed:{
        currentPodcast(){
            return this.$store.state.podcast_serie.series.filter(serie=>serie.id == this.$route.params.serie_id).map(serie=>serie.name)[0]
        },
        totalRecords(){
            return this.$store.state.podcast.podcasts_total
        },
        records(){
            return this.$store.state.podcast.podcasts.map(id=>{
                return{
                    id: id.id,
                    title: id.title,
                    description: id.description,
                    url: id.url,
                    podcast_series_id: id.podcast_series.id,
                    created_at:id.created_at
                }
            })
        },
        header(){ return [
            { text: 'Titulo', value: 'title'},
            { text: 'URL', value: 'url'},
            { text: 'Descripción', value: 'description'},
            { text: 'Creación', value: 'created_at'},
            { value: 'actions', sortable: false, align: 'end', }
        ]},
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
    },
    watch: {
        options: {
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
            this.$store.dispatch('podcast/getPodcasts', {filters:'&filter[title]=' + this.search + '&filter[podcast_series_id]=' + this.$route.params.serie_id, sortBy:this.options.sortBy, sortDesc:this.options.sortDesc, page:this.options.page, itemsPerPage:this.options.itemsPerPage}).then(data => {
                this.filterStorageLength = localStorage.getItem('filtersfiltersPodcastsLength')
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
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/podcasts/"+this.deleteId).then(response => {
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