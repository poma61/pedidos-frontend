<template>
    <MainApp>
        <h1 class="animate__animated animate__backInUp text-h6 my-3 pa-1 bg-light-blue-darken-3 as-box-shadow">
            <v-icon icon="mdi-cart-outline" class="animate__animated animate__infinite animate__heartBeat" />&nbsp;Pedido
        </h1>
        <TablePedido />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';

import TablePedido from '@/components/pedido/TablePedido.vue';
</script>

