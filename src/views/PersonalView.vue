<template>
    <MainApp>
        <h1 class="animate__animated animate__shakeY text-h6 my-3 pa-1 bg-amber-darken-3 as-box-shadow">
            <v-icon icon="mdi-home-account" />&nbsp;Personal
        </h1>
        <TablePersonal />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import TablePersonal from '@/components/personal/TablePersonal.vue';
</script>

