<template>
  <v-container class="pa-0">
        <v-card class="elevation-0 pa-6">
            <v-row class="ma-0 mb-3">
                <v-card-title>Crear Campaña</v-card-title>
                <v-spacer/>
                <v-switch
                v-model="campaign.is_active"
                inset
                label="Activo"
                ></v-switch>
            </v-row>
            <v-form>
                <v-row class="ma-0">
                    <v-col cols="12" class="py-0">
                        <v-text-field 
                            :rules="[rules.required]"
                            name="title"
                            label="Titulo"
                            outlined
                            v-model="campaign.name" 
                            dense
                        ></v-text-field>
                    </v-col>

                    <v-col cols="6" class="py-0">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                v-model="campaign.start_time"
                                label="Inicio"
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                                outlined
                                dense
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="campaign.start_time"
                                @change="saveDate"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6" class="py-0">
                        <v-menu
                            ref="menu2"
                            v-model="menu2"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                v-model="campaign.end_time"
                                label="Finalización"
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                                outlined
                                dense
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="campaign.end_time"
                                @change="saveDate2"
                            ></v-date-picker>
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
import axios from "axios"
export default {
    data: () => ({
        gris:false,
        campaign:{
            end_datetime: '',
            is_active: '',
            name: '',
            start_datetime: '',
        },
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        menu:false,
        menu2:false,
    }),
    computed:{
        rules(){
            return{
                required: value => !!value || 'Campo requerido.',
            }
        },
    },
    methods:{
        saveDate (date) {
            this.$refs.menu.save(date)
        },
        saveDate2 (date) {
            this.$refs.menu2.save(date)
        },
        save(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/ad_campaigns", this.campaign).then(response=>{
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
            this.campaign={
                end_datetime: '',
                is_active: '',
                name: '',
                start_datetime: '',
            },
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", false);
            })
        }
    }
}
</script>