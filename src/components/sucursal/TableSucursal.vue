<template>
    <!-- data table -->
    <v-card>
        <v-text-field v-model="buscar_data_table" append-inner-icon="mdi-magnify" clearable label="Buscar Registros..."
            color="light-blue-lighten-1" />
        <v-data-table :hover="true" :items="data" :headers="columns" :search="buscar_data_table"
            :loading="loading_data_table" :items-per-page-options="items_per_page_options" :show-current-page="true"
            :fixed-header="true" :height="300" :sort-by="[{ key: 'id', order: 'desc' }]">

            <template v-slot:item.actions="{ item }">
                <div style="width: 150px;">
                    <v-btn @click="editForm(item)" color="light-blue-lighten-1" class="ma-1" variant="outlined">
                        <span class="mdi mdi-pencil is-size-5"></span>
                    </v-btn>
                    <v-btn @click="openDeleteData(item)" color="red" class="ma-1" variant="outlined">
                        <span class="mdi mdi-delete is-size-5"></span>
                    </v-btn>
                </div>
            </template>

        </v-data-table>
    </v-card>

    <div class="my-2">
        <v-btn color="light-blue-lighten-1" variant="elevated" class="ma-1" @click="toData">
            <v-icon icon="mdi-refresh" />
        </v-btn>
    </div>
    <!-- formulario -->
    <FormSucursal :p_item_sucursal="item_sucursal" :p_fields_errors="fields_errors" @toSave="save" @isClear="clear" />

    <!-- dialog para eliminar el registro -->
    <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
        <v-card class="px-5 py-5">
            <v-card-text class="text-center">
                <v-icon icon="mdi mdi-trash-can-outline" size="100" color="red"
                    class="animate__animated animate__infinite animate__bounce"></v-icon>

            </v-card-text>
            <p class="text-h6 text-center">
                ¿Esta seguro(a) de eliminar este registro?
            </p>

            <div class="d-flex justify-center">
                <v-btn color="red" variant="elevated" @click="closeDeleteData" class="ma-1">
                    <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
                </v-btn>
                <v-btn color="light-blue-lighten-1" variant="elevated" class="ma-1" @click="confirmDeleteData()">
                    <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Aceptar
                </v-btn>
            </div>

        </v-card>
    </v-dialog>
</template>

<script setup>

import Sucursal from '@/http/services/Sucursal';
import { onMounted } from 'vue';
import { ref } from 'vue';
import useToastify from '@/composables/useToastify';
import FormSucursal from '@/components/sucursal/FormSucursal.vue';

const index_data_item = ref(-1);
const fields_errors = ref({});
const dialog_delete = ref(false);
const item_sucursal = ref({});
const buscar_data_table = ref("");
const loading_data_table = ref(null);
const items_per_page_options = ref([
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
    { value: 100, title: '100' },
]);
const columns = ref([
    { title: 'Nombres', key: 'nombres' },
    { title: 'Direccion', key: 'direccion' },
    { title: 'N° de contacto', key: 'n_contacto' },
    { title: 'Acciones', key: 'actions' },
]);
const data = ref([]);

//methods
const toData = () => {
    const sucursal = new Sucursal();
    loading_data_table.value = 'light-blue-lighten-1';
    setTimeout(async () => {
        const response = await sucursal.index();
        loading_data_table.value = null;
        if (response.status) {
            data.value = response.records;
            useToastify('success', response.message);
        } else {
            useToastify('danger', response.message);
        }
    }, 800);

}//toData

const clear = () => {
    item_sucursal.value = {};
    index_data_item.value - 1;
    fields_errors.value = {};
    newForm();
}

const newForm = () => {
    const sucursal = new Sucursal();
    item_sucursal.value = sucursal.getAttributes();
}

const editForm = (is_sucursal) => {
    item_sucursal.value = Object.assign({}, is_sucursal);
    index_data_item.value = data.value.indexOf(is_sucursal);
}

const save = async (is_sucursal) => {
    const sucursal = new Sucursal(is_sucursal);
    if (sucursal.getAttributes().id > 0) {
        //cuando es update
        const response = await sucursal.update();
        if (response.status) {
            //buscamos el registro y cambiamos valores
            Object.assign(data.value[index_data_item.value], response.record);
            useToastify('success', response.message);

            clear();
        } else {
            if (response.message_errors != undefined) {
                fields_errors.value = Object.assign({}, response.message_errors);
            }
            useToastify('danger', response.message);
        }

    } else {
        //cuando es store
        const response = await sucursal.store();
        if (response.status) {
            data.value.push(Object.assign({}, response.record));
            useToastify('success', response.message);
            clear();
        } else {
            if (response.message_errors != undefined) {
                fields_errors.value = Object.assign({}, response.message_errors);
            }
            useToastify('danger', response.message);
        }
    }
}


const openDeleteData = (item) => {
    item_sucursal.value = Object.assign({}, item);
    index_data_item.value = data.value.indexOf(item);
    dialog_delete.value = true;
}

const confirmDeleteData = async () => {
    const sucursal = new Sucursal(Object.assign({}, item_sucursal.value));
    const response = await sucursal.destroy();
    if (response.status) {
        data.value.splice(index_data_item.value, 1);
        useToastify('success', response.message);
    } else {
        useToastify('danger', response.message)
    }
    closeDeleteData();
}

const closeDeleteData = () => {
    dialog_delete.value = false;
    clear();
}

onMounted(() => {
    toData();
});
</script>
