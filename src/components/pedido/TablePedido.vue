<template>
  <div class="d-flex flex-wrap">
    <v-select label="Sucursales" v-model="current_sucursal" :items="list_sucursal" color="orange-darken-1"
      @update:model-value="initData" />
  </div>
  <!-- iterator -->
  <v-card elevation="5" style="height:700px; ">
    <v-overlay v-model="loading_data_iterator" contained class="d-flex align-center justify-center">
      <v-progress-circular color="orange-darken-1" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-data-iterator :items="data" :items-per-page="15" :search="buscar_registros">
      <template v-slot:header="{ page, pageCount, prevPage, nextPage }">

        <div class="d-flex justify-space-between flex-wrap pa-2">

          <v-text-field v-model="buscar_registros" clearable density="comfortable" hide-details
            placeholder="Buscar Registros" prepend-inner-icon="mdi-magnify" color="orange-darken-1" class="pa-2"
            style="min-width: 300px;" />

          <div class="d-flex align-center">
            <v-btn :disabled="page === 1" icon="mdi-arrow-left" density="comfortable" variant="elevated"
              color="orange-darken-1" @click="prevPage"></v-btn>

            <div class="mx-2 text-caption">
              Pagina {{ page }} de {{ pageCount }}
            </div>

            <v-btn :disabled="page >= pageCount" icon="mdi-arrow-right" density="comfortable" variant="elevated"
              color="orange-darken-1" @click="nextPage"></v-btn>
          </div>

        </div>

      </template>

      <template v-slot:default="{ items }">
        <div>
          <v-container class="pa-2 pb-5" fluid style="overflow:hidden; overflow-y: auto;  height:600px; ">
            <v-row>
              <v-col v-for="(item, index) in items" :key="index" cols="auto" md="4">

                <v-card class="pa-3" color="orange-lighten-1" variant="tonal">

                  <v-list-item class="">
                    <template v-slot:title>
                      <strong>
                        {{ item.raw.nombres }} {{ item.raw.apellido_paterno }} {{ item.raw.apellido_materno }}
                      </strong>
                    </template>

                    <template v-slot:subtitle>
                      <strong class="text-subtitle-2 text-light-blue-darken-3">
                        {{ item.raw.email }}
                      </strong>
                    </template>
                  </v-list-item>

                  <div class="d-flex justify-space-between px-4">
                    <p class="text-subtitle-2 text-light-blue-darken-3">
                      Pedido(s): {{ item.raw.cantidad_pedidos }}
                    </p>

                    <v-btn size="small" icon="mdi-cart-outline" color="light-blue-darken-3" variant="elevated" />

                  </div>
                </v-card>

              </v-col>

            </v-row>

          </v-container>
        </div>

      </template>

    </v-data-iterator>
  </v-card>
  <!-- iterator -->


  <!-- <FormPedido :p_item_cliente="item_cliente" @saveParent="save" :p_fields_errors="fields_errors"
    :p_sucursal="current_sucursal" @isClear="clear" /> -->

  <div class="d-flex flex-wrap justify-end my-2">
    <v-btn color="orange-darken-1" variant="elevated" class="ma-1" @click="initData">
      <v-icon icon="mdi-refresh" />
    </v-btn>

    <v-btn color="orange-darken-1" variant="elevated" class="ma-1" @click="openDialogImportData">
      <v-icon icon="mdi-file-excel" />&nbsp;carga masiva
    </v-btn>
  </div>


  <v-dialog v-model="dialog_delete" persistent transition="dialog-bottom-transition" max-width="500px">
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
        <v-btn color="orange-darken-1" variant="outlined" class="ma-1" @click="confirmDeleteItem">
          <v-icon icon="mdi-check-bold"></v-icon>&nbsp;Aceptar
        </v-btn>
      </div>

    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_import" persistent transition="dialog-bottom-transition" scrollable width="600px"
    max-height="600px">
    <DialogImportPedido :p_current_sucursal="current_sucursal" @isCloseDialogImportData="closeDialogImportData"
      @isInitData="initData" />
  </v-dialog>
</template>
  
<script>
import { defineComponent } from 'vue';
import Pedido from '@/http/services/Pedido';
import FormPedido from '@/components/pedido/FormPedido.vue';
import useToastify from '@/composables/useToastify';
import Sucursal from '@/http/services/Sucursal';
import DialogImportPedido from '@/components/pedido/DialogImportPedido.vue';
export default defineComponent({
  components: {

    DialogImportPedido,
  },

  data() {
    const loading_data_iterator = false;
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
      loading_data_iterator,
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
      this.loading_data_iterator = true;
      setTimeout(async () => {
        const pedido = new Pedido(this.current_sucursal);
        const respuesta = await pedido.index();
        this.loading_data_iterator = false;
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
      const pedido = new Pedido();
      this.item_cliente = pedido.getAttributes();
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
      const pedido = new Pedido();
      pedido.setAttributes(this.item_cliente);
      const response = await pedido.destroy();
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
      const pedido = new Pedido(this.current_sucursal, Object.assign({}, is_cliente));

      if (pedido.getAttributes().id > 0) {
        // cuando sea update
        const response = await pedido.update();
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
        const response = await pedido.store()

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


