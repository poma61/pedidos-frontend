<template>
    <MainApp>
        <h1 class="animate__animated animate__fadeInLeftBig text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-circle" />&nbsp;Usuario
        </h1>
        <TableUsuario />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import TableUsuario from '@/components/user/TableUser.vue';
</script>

