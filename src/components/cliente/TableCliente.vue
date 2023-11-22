<template>
  <div class="d-flex flex-wrap">
    <v-select label="Sucursales" v-model="current_sucursal" :items="list_sucursal" color="cyan-darken-1"
      @update:model-value="initData" />
  </div>

  <FormCliente :p_item_cliente="item_cliente" @saveParent="save" :p_fields_errors="fields_errors"
    :p_sucursal="current_sucursal" @isClear="clear" />

  <div class="d-flex flex-wrap">
    <v-btn color="cyan-darken-1" variant="outlined" class="ma-1" @click="initData">
      <v-icon icon="mdi-refresh" />
    </v-btn>

    <v-btn color="cyan-darken-1" variant="outlined" class="ma-1" @click="openDialogImportData">
      <v-icon icon="mdi-file-excel" />&nbsp;carga masiva
    </v-btn>
  </div>


  <v-card class="my-3">
    <v-text-field v-model="buscar_registros" append-inner-icon="mdi-file-search-outline" clearable
      label="Buscar Registros" color="cyan-darken-1">
    </v-text-field>

    <v-data-table :hover="true" :headers="headers" :items="data" :loading="change"
      :items-per-page-options="items_per_page_options" :show-current-page="true" :fixed-header="true"
      :search="buscar_registros" :height="600" :sort-by="[{ key: 'id', order: 'desc' }]">

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.nombres }} </td>
          <td>{{ item.apellido_paterno }}</td>
          <td>{{ item.apellido_materno }}</td>
          <td>{{ item.n_contacto }}</td>
          <td>{{ item.email }}</td>
          <td>
            <div style="min-width: 150px;">
              <v-btn @click="editForm(item)" class="ma-1" color="cyan-darken-1" icon="mdi-pencil" variant="outlined" />
              <v-btn @click="deleteItem(item)" color="red" class="ma-1" icon="mdi-delete" variant="outlined" />
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px" >
    <v-card class="pa-5">
      <v-card-text class="text-center">
        <v-icon icon="mdi mdi-trash-can-outline" size="100" color="red"
          class="animate__animated animate__infinite animate__bounce"></v-icon>

      </v-card-text>
      <p class="text-subtitle-1 text-center">
        ¿Esta seguro(a) de eliminar este registro?
      </p>

      <div class="d-flex justify-center">
        <v-btn color="red" variant="outlined" @click="closeDialogDelete" class="ma-1">
          <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
        </v-btn>
        <v-btn color="cyan-darken-1" variant="outlined" class="ma-1" @click="confirmDeleteItem">
          <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Aceptar
        </v-btn>
      </div>

    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_import" persistent transition="dialog-bottom-transition" 
    scrollable  width="600px" max-height="600px">
    <DialogImportCliente :p_current_sucursal="current_sucursal" @isCloseDialogImportData="closeDialogImportData"
      @isInitData="initData" />
  </v-dialog>
</template>
  
<script>
import { defineComponent } from 'vue';

import Cliente from '@/http/services/Cliente';
import FormCliente from '@/components/cliente/FormCliente.vue';
import useToastify from '@/composables/useToastify';
import Sucursal from '@/http/services/Sucursal';
import DialogImportCliente from '@/components/cliente/DialogImportCliente.vue';
export default defineComponent({
  components: {

    FormCliente,
    DialogImportCliente,
  },

  data() {
    const change = null;
    const data = [];
    const item_cliente = {};
    const index_item = -1;
    const buscar_registros = "";
    const fields_errors = null;
    const dialog_delete = false;
    const dialog_import = false;
    const list_sucursal = [];
    const current_sucursal = "";
    const headers = [
      { title: 'Nombres', key: 'nombres', },
      { title: 'Apellido Paterno', key: 'apellido_paterno', },
      { title: 'Apellido Materno', key: 'apellido_materno', },
      { title: 'N° de contacto', key: 'n_contacto', },
      { title: 'Correo electronico', key: 'email', },
      { title: 'Acciones', key: 'actions', },
    ];

    const items_per_page_options = [
      { value: 10, title: '10' },
      { value: 25, title: '25' },
      { value: 50, title: '50' },
      { value: 100, title: '100' },
    ];

    return {
      headers,
      change,
      data,
      item_cliente,
      index_item,
      items_per_page_options,
      buscar_registros,
      fields_errors,
      dialog_delete,
      list_sucursal,
      current_sucursal,
      dialog_import,
    }
  },

  methods: {
    initData() {
      this.change = "cyan-darken-1";
      setTimeout(async () => {
        const cliente = new Cliente(this.current_sucursal);
        const respuesta = await cliente.index();
        this.change = null;
        if (respuesta.status) {
          useToastify('success', respuesta.message);
          this.data = respuesta.records;
        } else {
          useToastify('danger', respuesta.message);
        }
      }, 800)
    },//initData

    async listSucursal() {
      const sucursal = new Sucursal();
      const response = await sucursal.index();
      if (response.status) {
        const sucursal_all = response.records;
        this.list_sucursal = sucursal_all.map(item => item.nombres);
        this.current_sucursal = this.list_sucursal[0];
      } else {
        useToastify('danger', response.message);
      }
    },

    newForm() {
      const cliente = new Cliente();
      this.item_cliente = cliente.getAttributes();
    },//newForm

    editForm(item) {
      this.clear();
      this.index_item = this.data.indexOf(item);
      this.item_cliente = Object.assign({}, item);
    },

    deleteItem(item) {
      this.index_item = this.data.indexOf(item);
      this.item_cliente = Object.assign({}, item);
      this.dialog_delete = true;
    },//deleteItem

    async confirmDeleteItem() {
      const cliente = new Cliente();
      cliente.setAttributes(this.item_cliente);
      const response = await cliente.destroy();
      if (response.status) {
        useToastify('success', response.message)
        //eliminamos el dato del array
        this.data.splice(this.index_item, 1);
      } else {
        useToastify('danger', response.message)
      }
      this.closeDialogDelete();
    },

    async save(is_cliente) {
      const cliente = new Cliente(this.current_sucursal, Object.assign({}, is_cliente));

      if (cliente.getAttributes().id > 0) {
        // cuando sea update
        const response = await cliente.update();
        if (response.status) {
          useToastify('success', response.message)
          //buscamos el registro y cambiamos valores
          Object.assign(this.data[this.index_item], response.record);

        } else {
          if (response.message_errors != undefined) {
            this.fields_errors = response.message_errors;
          }
          useToastify('danger', response.message)
        }

      } else {
        //cuando es un registro nuevo
        const response = await cliente.store()

        if (response.status) {
          useToastify('success', response.message)
          //agregamos el registro al array de datos
          this.data.push(response.record);

        } else {
          if (response.message_errors != undefined) {
            this.fields_errors = response.message_errors;
          }
          useToastify('danger', response.message)
        }
      }

    },//save

    closeDialogDelete() {
      this.dialog_delete = false;
      this.clear();
    },//closedialogDelete

    clear() {
      this.fields_errors = {};
      this.item_cliente = {};
      this.index_item = -1;
      this.newForm();
    },//clear

    async openDialogImportData() {
      this.dialog_import = true;
    },

    closeDialogImportData() {
      this.dialog_import = false;
    },


  },//metodos

  async created() {
    await this.listSucursal();
    this.newForm();
    this.initData();
  }

});

</script>


