<template>
    <v-container class="py-4">
        <!-- Header -->
        <v-toolbar dark flat class="mb-0 mt-0 px-6">
            <v-toolbar-title>Campañas de Anucnios</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- Filtros -->
            <!--v-dialog v-model="filterDialog" max-width="700px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn light class="ml-6" v-if="filterStorageLength== undefined" v-bind="attrs" v-on="on">
                        <v-icon class="mx-2">mdi-filter</v-icon>
                        Filtrar
                    </v-btn>
                    <v-btn light class="ml-6" v-else v-bind="attrs" v-on="on">
                        <v-badge overlap color="primary">
                            <template v-slot:badge>
                                {{filterStorageLength}}
                            </template>
                            <v-icon class="mx-2">mdi-filter</v-icon>
                        </v-badge>
                        Filtrar
                    </v-btn>
                </template>
                <filter @filters="filters"/>
            </v-dialog-->
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
        <!-- Tabla -->
        <v-data-table
        :item-class="activeCampaign" 
        class="mb-6 elevation-1"
        :items="records" 
        :headers="header"
        :footer-props="{'items-per-page-options':[15, 30, 50, totalRecords]}"
        :options.sync="options"
        :server-items-length="totalRecords"
        :loading="loading">
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de campañas aún
            </template>
            <!-- Ver más -->
            <template v-slot:[`item.view`]="{ item }">
                 <v-btn small icon :to="{ path: '/ads/'+ item.id}"><v-icon x-small> mdi-eye</v-icon></v-btn>
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
          <edit v-bind:campaign="record" @closeEditDialog="closeEditDialog"/>
        </v-dialog>
        <!-- Eliminar -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar este usuario?
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
import Filter from "../campaigns/filter"
import Create from "../campaigns/create"
import Edit from "../campaigns/edit"
export default {
    components: {
        'filter':Filter,
        'create':Create,
        'edit':Edit,
    }, 
    data: () => ({
        filters:false,
        record:{},
        loading: true,
        options: {},
        sheet: false,
        editDialog: false,
        createDialog: false,
        filterDialog: false,
        deleteId:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        filterStorageLength:0
    }),
    computed:{
        totalRecords(){
            return this.$store.state.campaign.campaigns_total
        },
        records(){
            return this.$store.state.campaign.campaigns
        },
        header(){ return [
            { value: 'view', sortable: false, align: 'start', },
            { text: 'id', value: 'id'},
            { text: 'Nombre', value: 'name' },
            //{ text: '', value: 'is_active' },
            { text: 'Impresiones', value: 'views' },
            { text: 'Clics', value: 'clicks' },
            
            { text: 'Fecha Inicio', value: 'start_datetime' },
            { text: 'Fecha Finalización', value: 'end_datetime' },
            
            { text: 'Creada', value: 'created_at' },
            { text: 'Editada', value: 'updated_at' },


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
    },
    methods:{
        activeCampaign: function (item) {
            if(item.is_active){
                return 'border-green, active-border'
            }else{
                return 'border-red, active-border'
            }
        },
        getDataFromApi () {
            this.loading = true
            const { sortBy, sortDesc, page, itemsPerPage } = this.options
            this.$store.dispatch('campaign/getCampaigns', {sortBy:sortBy, sortDesc:sortDesc, page:page, itemsPerPage:itemsPerPage}).then(data => {
                this.filterStorageLength = localStorage.getItem('filtersfiltersCampaignsLength')
                this.loading = data
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
        filtersRecord: function(params) {
            this.filterDialog = params;
            this.getDataFromApi()
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
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ad_campaigns/"+this.deleteId).then(response => {
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
<style scoped>
.active-border{
    border-left: solid 3px;
}
.border-green{
    border-color: green;
}
.border-red{
    border-color: red;
}
</style>