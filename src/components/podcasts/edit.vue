<template>
  <v-container class="pa-0">
        <v-card class="elevation-0 pa-6">
            <v-card-title>Editar Podcast</v-card-title>
            <v-form>
                <v-row class="ma-0">
                    <v-col cols="12" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="title"
                            label="Titulo"
                            outlined
                            v-model="podcast.title" 
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="url"
                            label="URL"
                            outlined
                            v-model="podcast.url" 
                            dense
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="py-0">
                        <v-textarea 
                            name="description"
                            label="Description"
                            outlined
                            v-model="podcast.description" 
                            dense
                        ></v-textarea>
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
import axios from "axios"
export default {
    props:{
        podcast:Object,
    },
    data: () => ({
        gris:false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    computed:{
        rules(){
            return{
                required: value => !!value || 'Campo requerido.',
            }
        },
        ready(){
            if(this.podcast.title!=''&&
            this.podcast.url!=''){
                return false
            }else{
                return true
            }
        },
    },
    methods:{
        save(){
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/podcasts/" + this.podcast.id, this.podcast).then(response=>{
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
            this.$nextTick(() => {
                this.$emit("closeEditDialog", false);
            })
        }
    }
}
</script>