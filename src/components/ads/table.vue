<template>
    <v-container class="py-4">
        <!-- Header -->
        <v-toolbar dark flat class="mb-0 mt-0 px-6">
            <v-toolbar-title>Anuncios</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- Filtros -->
            <!--v-btn light class="ml-6" @click="openSearch=!openSearch">
                <v-icon class="mx-2">mdi-magnify</v-icon>
                Buscar
            </v-btn-->
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
        :options.sync="options"
        :loading="loading">
        <template v-slot:[`item.medida`]="{ item }">
            {{item.height}} x {{item.width}}
        </template>
        <template v-slot:[`item.banner`]="{ item }">
            <img :src="item.image_url" width="10">
        </template>
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
          <edit v-bind:ad="record" @closeEditDialog="closeEditDialog"/>
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
import Create from "../ads/create"
import Edit from "../ads/edit"
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
        currentCampaign(){
            return this.$store.state.campaign.campaigns.filter(campaign=>campaign.id == this.$route.params.campaign_id).map(campaign=>campaign.name)[0]
        },
        totalRecords(){
            return this.$store.state.podcast.podcasts_total
        },
        records(){
            return this.$store.state.ads.ads
        },
        header(){ return [
            { text: 'Cliente', value: 'client.name'},
            { text: 'Titulo', value: 'title'},
            { text: 'Banner', value: 'image_url'},
            { text: 'Link', value: 'url'},

            { text: 'Impresiones', value: 'impressions'},
            { text: 'Clics', value: 'clicks'},

            { text: 'Comienza', value: 'start_time'},
            { text: 'Finaliza', value: 'end_time'},
            
            { text: 'Horario Inicio', value: 'start_hour'},
            { text: 'Horario Fin', value: 'end_hour'},
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

            this.$store.dispatch('ads/getAds', {filters:'&filter[title]=' + this.search, sortBy:this.options.sortBy, sortDesc:this.options.sortDesc, page:this.options.page, itemsPerPage:this.options.itemsPerPage}).then(data => {
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
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ads/"+this.deleteId).then(response => {
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
            console.log(editedItem)
            this.record = [editedItem].map(id=>{return{
                id:id.id,
                is_active: id.is_active,
                client_id:id.client.id,
                client:id.client,
                title: id.title,
                url: id.url,
                start_time: id.start_time,
                end_time: id.end_time,
                start_hour:id.start_hour,
                end_hour:id.end_hour,
                position: id.position,
                image_url: id.image_url,
            }})[0]
            console.log(this.record)
            this.editDialog = true
        },
    },
}
</script>

