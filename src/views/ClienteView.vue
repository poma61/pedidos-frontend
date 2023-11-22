<template>
    <MainApp>
        <h1 class="animate__animated animate__backInUp text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-group" class="animate__animated animate__infinite animate__heartBeat" />&nbsp;Cliente
        </h1>
        <TableCliente />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';

import TableCliente from '@/components/cliente/TableCliente.vue';
</script>
