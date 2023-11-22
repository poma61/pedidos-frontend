<template>
    <!-- mostrar errores del archivo excel. -->
    <v-card v-if="shows_import_data.show_errors">

        <v-card-title class="animate__animated animate__bounceInRight bg-deep-purple-darken-1 py-3">
            <v-icon icon="mdi-file-excel" size="50"></v-icon>&nbsp;Errores en el archivo excel
        </v-card-title>

        <v-card-text>
            <v-list lines="two">
                <v-list-item v-for="(error, index) in errors_import" :key="index">
                    <template v-slot:prepend>
                        <v-avatar color="grey-lighten-1">
                            <v-icon color="white" icon="mdi-format-columns"></v-icon>
                        </v-avatar>
                    </template>

                    <template v-slot:title>
                        <div class="text-red-darken-3">
                            Error en la Fila {{ error.row }}.
                        </div>
                    </template>
                    <template v-slot:subtitle>
                        <p>
                            La columna
                            <v-chip class="ma-1" color="indigo" prepend-icon="mdi-table-column-remove">
                                {{ error.attribute }}
                            </v-chip>, tienen la siguiente observacion:
                            <span class="text-red-darken-3">
                                {{ error.validation[0] }}
                            </span>
                        </p>
                    </template>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>

        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn color="red" variant="outlined" @click="toCloseDialogImportData" class="ma-1">
                    <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                </v-btn>
                <v-btn color="deep-purple-darken-1" variant="outlined" class="ma-1" @click="reImport">
                    <v-icon icon="mdi-file-arrow-up-down"></v-icon>&nbsp;Importar
                </v-btn>
        </v-card-actions>
    </v-card>

    <!--cargar archivo excel.-->
    <v-card v-if="shows_import_data.show_import">

        <v-card-title class="animate__animated animate__bounceInRight bg-deep-purple-darken-1 py-3">
            <v-icon icon="mdi-file-excel" size="50"></v-icon>&nbsp;Carga nasiva desde excel
        </v-card-title>

        <v-card-text class="text-center">
            <v-icon icon="mdi-file-excel" size="70" color="success"
                class="animate__animated animate__infinite animate__bounce mt-3"></v-icon>

            <v-file-input label="Seleccionar archivo excel" v-model="selected_file" prepend-icon="mdi-file-excel"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" color="deep-purple-darken-1" show-size>
            </v-file-input>

            <p class="text-subtitle-1 text-center">
                Se almacera de forma masiva todos los registros del archivo excel cargado.
            </p>
            <p class="text-subtitle-1 text-center">
                Los registros seran pertenecientes a
                <v-chip class="ma-2" color="success" prepend-icon="mdi-home" :model-value="true">
                    {{ p_current_sucursal }}
                </v-chip>
            </p>

            <p class="text-subtitle-1 text-center">
                ¿Esta seguro(a) de realizar esta accion?
            </p>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn color="red" variant="outlined" @click="toCloseDialogImportData" class="ma-1">
                    <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                </v-btn>
                <v-btn color="deep-purple-darken-1" variant="outlined" class="ma-1" @click="confirmImportData">
                    <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Aceptar
                </v-btn>
        </v-card-actions>

    </v-card>

    <!-- mostrar progress circular al importar datos -->
    <div v-if="shows_import_data.show_loading" class="d-flex flex-column align-center justify-center">
        <p class="text-h6 text-center font-weight-bold text-white">
            Importando datos espere un momento...
        </p>
        <v-progress-circular color="blue-lighten-3" model-value="20" :size="128" :width="8" indeterminate />
    </div>
    <!-- dialog -->
</template>

<script>
import { defineComponent } from 'vue';
import useToastify from '@/composables/useToastify';
import Cliente from '@/http/services/Cliente';

export default defineComponent({
    props: ['p_current_sucursal'],
    emits: ['isCloseDialogImportData', 'isInitData'],
    data() {
        const shows_import_data = {
            show_loading: false,
            show_errors: false,
            show_import: true,
        }
        const selected_file = [];
        const errors_import = [];
        return {
            selected_file,
            shows_import_data,
            errors_import,
        }
    },

    methods: {
        toCloseDialogImportData() {
            this.$emit('isCloseDialogImportData');
        },
        toInitData() {
            this.$emit('isInitData');
        },
        validateFile() {
            //validar si se selecciono el archivo
            if (this.selected_file.length == 0) {
                useToastify('warning', 'No se cargo ningun archivo excel.')
                return false;
            }
            // Validar la extensión del archivo
            const allowed_extensions = ['xlsx', 'xls'];
            const extension = this.selected_file[0].name.split('.').pop().toLowerCase();
            if (!allowed_extensions.includes(extension)) {
                useToastify('danger', 'El archivo debe ser de tipo Excel (xlsx o xls).');
                return false;
            }
            return true;
        },

        confirmImportData() {
            if (this.validateFile()) {
                this.shows_import_data.show_loading = true;
                this.shows_import_data.show_import = false;
                setTimeout(async () => {
                    try {
                        const cliente = new Cliente(this.p_current_sucursal);
                        const response = await cliente.importRecords(this.selected_file[0]);
                        this.shows_import_data.show_loading = false;
                        if (response.status) {
                            this.toInitData();
                            useToastify('success', response.message);
                            this.toCloseDialogImportData();
                        } else {
                            if (response.errors != undefined) {
                                this.errors_import = response.errors;
                                this.shows_import_data.show_errors = true;
                            }
                            useToastify('danger', response.message);
                        }

                    } catch (error) {
                        if (error.message != 'ERR_UPLOAD_FILE_CHANGED') {
                            useToastify('danger', 'El archivo ha sido modificado mientras estaba seleccionado, vuelva a cargar el archivo.');
                        }
                    }
                }, 800);
            }

        },//confirmImportData
        reImport() {
            this.selected_file = [];
            this.shows_import_data.show_import = true;
            this.shows_import_data.show_errors = false;

        }
    }

});

</script>