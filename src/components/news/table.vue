<template>
    <v-container class="py-4">
        <!-- Header -->
        <v-toolbar dark flat class="mb-0 mt-0 px-6">
            <v-toolbar-title>Noticias</v-toolbar-title>
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
            <v-dialog v-model="createDialog" fullscreen transition="dialog-bottom-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn light v-bind="attrs" v-on="on" class="ml-8">
                        Crear
                    </v-btn> 
                </template>
                <create @closeCreateDialog="closeCreateDialog"/>
            </v-dialog>
        </v-toolbar>
        <!-- Tabla -->
        <v-data-table
        class="mb-6 elevation-1"
        :items="records" 
        :headers="header"
        :footer-props="{'items-per-page-options':[15, 30, 50, totalRecords]}"
        :options.sync="options"
        :server-items-length="totalRecords"
        :loading="loader">
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de usuarios aún
            </template>
            <template v-slot:[`item.date`]="{ item }">
                {{dateFormat(item.created_at)}}
            </template>
            <template v-slot:[`item.categories`]="{ item }">
                <span v-for="(category, index) in item.categories" v-bind:key="index">{{category.name}} <span v-if="index<(item.categories.length-1)">, </span></span>
            </template>
            <template v-slot:[`item.sent_push_notification`]="{ item }">
                <v-icon v-if="item.sent_push_notification">mdi-check</v-icon>
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
                        <v-list-item @click="sendPushNotification(item.id)">
                            <v-icon small class="mr-2">
                                mdi-bell
                            </v-icon>
                            Enviar Notifiación
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table>
        <!-- Editar -->
        <v-dialog v-model="editDialog" fullscreen transition="dialog-bottom-transition">
            <edit v-bind:post="record" @closeEditDialog="closeEditDialog"/>
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
import Filter from "../news/filter"
import Create from "../news/create"
import Edit from "../news/edit"
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
        filterStorageLength:0,
        category_filter:''
    }),
    computed:{
        loader(){
            return this.$store.state.post.loader
        },
        totalRecords(){
            return this.$store.state.post.posts_total
        },
        records(){
            return this.$store.state.post.posts
        },
        header(){ return [
            { text: 'Titulo', value: 'title'},
            { text: 'Categorías', value: 'categories'},
            { text: 'Fecha', value: 'date'},
            { text: 'Notifiación', value: 'sent_push_notification'},
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
        sendPushNotification(id){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/post/' + id + '/send_push').then(response=>{
                this.getDataFromApi()
            })
        },
        dateFormat(date){
            // Creamos el objeto fecha instanciándolo con la clase Date
            const fecha = new Date(date.slice(0,10));
            // Creamos array con los días de la semana
            const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            //Creamos constante para el dia de hoy
            const hoy = new Date(new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10))
            //sacamos diferencia
            const difference = (Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))/(1000*60*60*24)
            // Creamos array con los meses del año
            const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
            // Construimos el formato de salida
            if(fecha.getUTCFullYear()!=new Date().getUTCFullYear()){
                return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()];
            }else{
                return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
            }
            
        },
        getDataFromApi () {
            const { sortBy, sortDesc, page, itemsPerPage } = this.options
            if(this.category_filter!=''){
                this.category_filter = '&categories='+this.category_filter
            }
            var sort = ''
            if (sortBy.length === 1 && sortDesc.length === 1) {
                if(sortDesc[0]){
                    sort = "-" + sortBy[0]
                }else{
                    sort = sortBy[0]
                }
            }
            this.$store.dispatch('post/getPosts', {'sort':sort, 'page':page, 'itemsPerPage':itemsPerPage, 'category':this.category_filter}).then(data => {
                this.filterStorageLength = localStorage.getItem('filtersPostsLength')
            })
        },
        userName(user){
            var name = user.name
            if(user.last!=null){
                return name + ' ' + user.last
            }else{
                return name
            }
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
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/posts/"+this.deleteId).then(response => {
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
            this.record = [editedItem].map(id=>{
                return{
                    categories:id.categories.map(category=>category.id),
                    content:id.content,
                    title:id.title,
                    visibility:id.visibility,
                    featured_media_path:id.featured_media_path,
                    status:id.status,
                    short_description:id.short_description,
                    author_id:this.existId(id.author)
                }
            })[0]
            this.editDialog = true
        },
        existId(author){
            if(author!=undefined){
                return author.id
            }else{
                return ''
            }
        }
    },
}
</script>