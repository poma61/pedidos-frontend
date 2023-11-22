<template>
    <v-card class="mb-3">

        <v-card-title class="animate__animated animate__bounceInRight bg-cyan-darken-1 py-3">
            Registrar cliente | {{ p_sucursal }}
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-text-field color="cyan-darken-1" label="Nombres" v-model="item_cliente.nombres"
                        :error-messages="showFieldsErrors('nombres')" variant="underlined" />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field color="cyan-darken-1" label="Apellido Paterno" v-model="item_cliente.apellido_paterno"
                        :error-messages="showFieldsErrors('apellido_paterno')" variant="underlined" />
                </v-col>

                <v-col cols="12" sm="4">
                    <v-text-field color="cyan-darken-1" label="Apellido materno" v-model="item_cliente.apellido_materno"
                        :error-messages="showFieldsErrors('apellido_materno')" variant="underlined" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field color="cyan-darken-1" label="Correo electronico" v-model="item_cliente.email"
                        :error-messages="showFieldsErrors('email')" variant="underlined" />
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field color="cyan-darken-1" label="N° de contacto (celular)" v-model="item_cliente.n_contacto"
                        :error-messages="showFieldsErrors('n_contacto')" variant="underlined" type="number" />
                </v-col>

            </v-row>

        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" variant="outlined"  @click="toClear">
                <v-icon icon="mdi-delete" />
            </v-btn>

            <v-btn color="cyan-darken-1" variant="outlined" @click="saveChild">
                <v-icon icon="mdi-content-save-outline"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>


<script>
import { defineComponent } from 'vue';


export default defineComponent({
    props: ['p_item_cliente', 'p_fields_errors', 'p_sucursal'],
    emits:['saveParent','isClear'],
    data() {
        const show_password = false;
        const ci = "";
        const change_search_personal = null;
        const item_cliente = this.p_item_cliente;
        return {
            show_password,
            ci,
            change_search_personal,
            item_cliente,
        }
    },//data

    watch: {
        //cuando se modifica los valores de p_item_cliente variable del componente padre
        p_item_cliente() {
            this.item_cliente = this.p_item_cliente;
        }
    },

    computed: {
        showFieldsErrors() {
            return function (property) {
                if (this.p_fields_errors && this.p_fields_errors[property]) {
                    return this.p_fields_errors[property][0];
                }
                return "";
            };

        },
    },
    methods: {
        saveChild() {
            this.$emit('saveParent', this.item_cliente);
        },
        toClear() {
            this.$emit('isClear');
        },


    },//methods

});


</script>
