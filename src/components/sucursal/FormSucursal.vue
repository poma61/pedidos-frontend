<template>
    <v-card>
        <v-card-title class="bg-light-blue-lighten-1">
            <span class="text-h6">Registrar sucursal</span>
        </v-card-title>
        <v-card-text class="mt-2">
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_sucursal.nombres" label="Nombres" color="light-blue-lighten-1"
                        :error-messages="showFieldsErrors('nombres')" clearable></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="item_sucursal.n_contacto" label="N° de contacto" color="light-blue-lighten-1"
                        :error-messages="showFieldsErrors('n_contacto')" clearable></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="item_sucursal.direccion" label="Direccion" color="light-blue-lighten-1"
                        :error-messages="showFieldsErrors('direccion')" clearable rows="2"></v-textarea>
                </v-col>
            </v-row>

        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" variant="elevated" @click="toClear">
                <v-icon icon="mdi-delete" />
            </v-btn>
            <v-btn color="light-blue-lighten-1" variant="elevated" @click="onSave">
                <v-icon icon="mdi-content-save-outline"></v-icon>&nbsp;Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
const props = defineProps(['p_item_sucursal', 'p_fields_errors']);
const emit = defineEmits(['toSave', 'isClear'])
const item_sucursal = ref(props.p_item_sucursal);

const onSave = () => {
    emit('toSave', Object.assign({}, item_sucursal.value));
};

watch(() => props.p_item_sucursal, () => {
    item_sucursal.value = props.p_item_sucursal;
});

const toClear = () => {
    emit('isClear');
}

const showFieldsErrors = computed(() => {
    return function (field) {
        if (props.p_fields_errors[field]) {
            return props.p_fields_errors[field][0];
        }
        return "";
    }
});


</script>