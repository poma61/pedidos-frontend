<template>
    <v-card>
        <v-card-title class="animate__animated animate__bounceInRight bg-cyan-darken-1 py-3">
            <v-icon size="50" icon="mdi-account-circle"
                class="animate__animated animate__infinite animate__heartBeat" />&nbsp;Registrar usuario
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-text-field color="cyan-darken-1" label="Sucursal" readonly v-model="sucursal" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field color="cyan-darken-1" label="Usuario" v-model="item_user.usuario"
                            :error-messages="showFieldsErrors('usuario')" autocomplete="none" />
                    </v-col>

                    <v-col cols="12">

                        <v-text-field color="cyan-darken-1" label="Contraseña" :type="show_password ? 'text' : 'password'"
                            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append-inner="show_password = !show_password" v-model="item_user.password"
                            :error-messages="showFieldsErrors('password')" autocomplete="none" />
                    </v-col>

                    <v-col cols="12">
                        <v-radio-group v-model="item_user.type_role" label="Rol" inline
                            :error-messages="showFieldsErrors('type_role')">
                            <v-radio label="Normal" value="Normal" color="cyan-darken-1"></v-radio>
                            <v-radio label="Administrador" value="Administrador" color="cyan-darken-1"></v-radio>
                            <v-radio label="Chofer" value="Chofer" color="cyan-darken-1"></v-radio>
                        </v-radio-group>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field color="cyan-darken-1" label="Personal" readonly v-model="nombreCompleto"
                            :error-messages="showFieldsErrors('id_personal')" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field label="Buscar Personal" color="cyan-darken-1" @keyup.enter="searchPersonal()"
                            prepend-inner-icon="mdi-magnify" placeholder="Escriba el CI del personal (Solo numero)."
                            v-model="ci" :loading="change_search_personal">
                            <template v-slot:append>
                                <v-btn icon="mdi-magnify" color="orange-darken-3" @click="searchPersonal"
                                    variant="elevated" />
                            </template>
                        </v-text-field>

                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" variant="elevated" @click="closeDialogFormChild">
                <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
            </v-btn>
            <v-btn color="cyan-darken-1" variant="elevated" @click="saveChild">
                <v-icon icon="mdi-content-save-outline"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>


<script>
import { defineComponent } from 'vue';
import Personal from '@/http/services/Personal';
import useToastify from '@/composables/useToastify';

export default defineComponent({
    props: ['item_user_parent', 'p_fields_errors', 'p_sucursal'],
    data() {
        const show_password = false;
        const ci = "";
        const change_search_personal = null;
        const item_user = this.item_user_parent;
        const sucursal = this.p_sucursal;
        return {
            show_password,
            ci,
            change_search_personal,
            item_user,
            sucursal,
        }
    },//data


    computed: {
        showFieldsErrors() {
            return function (property) {
                if (this.p_fields_errors && this.p_fields_errors[property]) {
                    return this.p_fields_errors[property][0];
                }
                return "";
            };

        },
        nombreCompleto() {
            if (this.item_user.nombres != undefined && this.item_user.apellido_paterno != undefined && this.item_user.apellido_materno != undefined) {
                return `${this.item_user.nombres} ${this.item_user.apellido_paterno} ${this.item_user.apellido_materno}`
            } else {
                return "";
            }

        }
    },
    methods: {
        closeDialogFormChild() {
            this.$emit('closeDialogFormParent');
        },

        saveChild() {
            this.$emit('saveParent', this.item_user);
        },

        searchPersonal() {
            const personal = new Personal(this.p_sucursal, { ci: this.ci });
            this.change_search_personal = 'cyan-darken-1';
            setTimeout(async () => {
                const response = await personal.byCiPersonal();
                this.change_search_personal = null;
                if (response.status) {
                    this.item_user.nombres = response.record.nombres;
                    this.item_user.apellido_paterno = response.record.apellido_paterno;
                    this.item_user.apellido_materno = response.record.apellido_materno;
                    this.item_user.id_personal = response.record.id;
                    useToastify('success', response.message);
                } else {
                    useToastify('danger', response.message);
                }
                this.ci = "";
            }, 800);

        },

    },//methods

});


</script>
