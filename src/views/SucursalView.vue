<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-light-blue-lighten-1 as-box-shadow">
            <v-icon icon="mdi-home" class="animate__animated animate__infinite animate__swing"></v-icon>&nbsp;Sucursal
        </h1>
        <TableSucursal />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import TableSucursal from '@/components/sucursal/TableSucursal.vue';
</script>