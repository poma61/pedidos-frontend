

<template>
  <div class="d-flex flex-wrap">
    <v-select style="min-width: 300px;" label="Sucursales" v-model="current_sucursal" :items="list_sucursal" class="ma-1"
      color="cyan-darken-1" @update:model-value="initData" />


    <v-btn color="cyan-darken-1" variant="elevated" class="ma-1" @click="initData">
      <v-icon icon="mdi-refresh" />
    </v-btn>

    <v-btn color="cyan-darken-1" variant="elevated" class="ma-1" @click="newForm">
      <v-icon icon="mdi-note-plus" />&nbsp;Nuevo usuario
    </v-btn>

  </div>

  <v-card>
    <v-text-field v-model="buscar_registros" append-inner-icon="mdi-file-search-outline" clearable
      label="Buscar Registros" color="cyan-darken-1">
    </v-text-field>

    <v-data-table :hover="true" :headers="headers" :items="data" :loading="change"
      :items-per-page-options="items_per_page_options" :show-current-page="true" :fixed-header="true"
      :search="buscar_registros" :height="600" :sort-by="[{ key: 'id', order: 'desc' }]">

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.usuario }} </td>
          <td>{{ item.nombres }} </td>
          <td>{{ item.apellido_paterno }}</td>
          <td>{{ item.apellido_materno }}</td>
          <td>{{ item.type_role }}</td>
          <td>
            <div style="min-width: 150px;">
              <v-btn @click="editForm(item)" class="ma-1" color="cyan-darken-1" icon="mdi-pencil" />
              <v-btn @click="deleteItem(item)" color="red" class="ma-1" icon="mdi-delete" />
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>


    <v-dialog v-model="dialog_form" max-width="500px" persistent transition="dialog-bottom-transition" scrollable>
      <FormUser @closeDialogFormParent="closeDialogForm" :item_user_parent="item_user" @saveParent="save"
        :p_fields_errors="fields_errors" :p_sucursal="current_sucursal" />
    </v-dialog>
 

  <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
    <v-card class="pa-5">
      <v-card-text class="text-center">
        <v-icon icon="mdi mdi-trash-can-outline" size="100" color="red"
          class="animate__animated animate__infinite animate__bounce"></v-icon>

      </v-card-text>
      <p class="text-h6 text-center">
        ¿Esta seguro(a) de eliminar este registro?
      </p>

      <div class="d-flex justify-center">
        <v-btn color="red" variant="elevated" @click="closeDialogDelete" class="ma-1">
          <v-icon icon="mdi-cancel"></v-icon>&nbsp;Cancelar
        </v-btn>
        <v-btn color="cyan-darken-1" variant="elevated" class="ma-1" @click="confirmDeleteItem">
          <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Aceptar
        </v-btn>
      </div>

    </v-card>
  </v-dialog>
</template>
  
<script>
import { defineComponent } from 'vue';

import Usuario from '@/http/services/Usuario';
import FormUser from '@/components/user/FormUser.vue';
import useToastify from '@/composables/useToastify';
import Sucursal from '@/http/services/Sucursal';

export default defineComponent({
  components: {

    FormUser,
  },

  data() {
    const change = null;
    const data = [];
    const dialog_form = false;
    const item_user = {};
    const index_item = -1;
    const buscar_registros = "";
    const fields_errors = null;
    const dialog_delete = false;
    const list_sucursal = [];
    const current_sucursal = "";
    const headers = [
      { title: 'Usuario', key: 'usuario', divider: true, },
      { title: 'Nombres', key: 'nombres', divider: true, },
      { title: 'Apellido Paterno', key: 'apellido_paterno', divider: true, },
      { title: 'Apellido Materno', key: 'apellido_materno', divider: true, },
      { title: 'Rol', key: 'type_role', divider: true, },
      { title: 'Acciones', key: 'actions', divider: true, },
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
      dialog_form,
      item_user,
      index_item,
      items_per_page_options,
      buscar_registros,
      fields_errors,
      dialog_delete,
      list_sucursal,
      current_sucursal,
    }
  },

  methods: {
    initData() {
      this.change = "cyan-darken-1";
      setTimeout(async () => {
        const usuario = new Usuario(this.current_sucursal);
        const respuesta = await usuario.index();
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
      const usuario = new Usuario();
      this.item_user = usuario.getAttributes();
      this.dialog_form = true;
    },//newForm

    editForm(item) {
      this.index_item = this.data.indexOf(item);
      this.item_user = Object.assign({}, item);
      this.dialog_form = true;
    },

    deleteItem(item) {
      this.index_item = this.data.indexOf(item);
      this.item_user = Object.assign({}, item);
      this.dialog_delete = true;
    },//deleteItem

    async confirmDeleteItem() {
      const usuario = new Usuario();
      usuario.setAttributes(this.item_user);
      const response = await usuario.destroy();
      if (response.status) {
        useToastify('success', response.message)
        //eliminamos el dato del array
        this.data.splice(this.index_item, 1);
      } else {
        useToastify('danger', response.message)
      }
      this.closeDialogDelete();
    },

    async save(user) {
      const usuario = new Usuario(this.current_sucursal);
      usuario.setAttributes(Object.assign({}, user));
      if (usuario.getAttributes().id > 0) {
        // cuando sea update
        const response = await usuario.update();
        if (response.status) {
          useToastify('success', response.message)
          //buscamos el registro y cambiamos valores
          Object.assign(this.data[this.index_item], response.record);
          this.closeDialogForm();
        } else {
          if (response.message_errors != undefined) {
            this.fields_errors = response.message_errors;
          }
          useToastify('danger', response.message)
        }

      } else {
        //cuando es un registro nuevo
        const response = await usuario.store()

        if (response.status) {
          useToastify('success', response.message)
          //agregamos el registro al array de datos
          this.data.push(response.record);
          this.closeDialogForm();
        } else {
          if (response.message_errors != undefined) {
            this.fields_errors = response.message_errors;
          }
          useToastify('danger', response.message)
        }
      }

    },//save

    closeDialogForm() {
      this.dialog_form = false;
      this.clear();
    },//closeDialogForm

    closeDialogDelete() {
      this.dialog_delete = false;
      this.clear();
    },//closedialogDelete

    clear() {
      this.fields_errors = {};
      this.item_user = {};
      this.index_item = -1;
    },//clear


  },//metodos

  async created() {
    await this.listSucursal();
    this.initData();
  }

});

</script>
  

