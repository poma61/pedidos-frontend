<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
            color="blue-darken-3" :rail="rail">

            <v-list-item :prepend-avatar="image_Path" :title="'Tu empresa'" nav height="50" @click="rail = false">

                <template v-slot:append>
                    <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
                </template>

            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <div class="d-flex flex-column justify-center align-center my-2">
                    <v-avatar :image="image_Path" size="80"></v-avatar>
                    <p class="text-subtitle-1">Carlos Poma Muñoz</p>
                </div>

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">EMPRESA</p>
                <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio"
                    :to="{ name: 'n-home' }"></v-list-item>

                <v-list-item prepend-icon="mdi-home" title="Sucursal" value="Sucursal"
                    :to="{ name: 'n-sucursal' }"></v-list-item>

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">TUS ENTREGAS</p>

                <v-list-item prepend-icon="mdi-account-group" title="Cliente" value="Cliente"
                    :to="{ name: 'n-cliente' }"></v-list-item>

                <v-list-item prepend-icon="mdi-cart-outline" :to="{ name:'n-pedido' }" title="Pedidos" value="Pedidos"></v-list-item>

                <v-list-item prepend-icon="mdi-truck-delivery-outline" title="Entrega" value="Entrega"></v-list-item>

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">UBICACIONES</p>
                <v-list-item prepend-icon="mdi-map-marker-radius-outline" title="Rutas chofer"
                    value="Rutas chofer"></v-list-item>

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">ADMINISTRACION</p>
                <v-list-item prepend-icon="mdi-home-account" title="Personal" value="Personal"
                    :to="{ name: 'n-personal' }"></v-list-item>

                <v-list-item prepend-icon="mdi-account-circle" title="Usuario" value="Usuario"
                    :to="{ name: 'n-usuario' }"></v-list-item>

                <v-list-item prepend-icon="mdi-car-estate" title="Vehiculos" value="Vehiculos"
                    :to="{ name: 'n-vehiculo' }"></v-list-item>

                <v-list-item prepend-icon="mdi-store" title="Inventario" value="Inventario"></v-list-item>

                <v-divider class="border-opacity-25 my-2"></v-divider>
                <p class="text-subtitle-1" style="font-weight: bold;">OTROS</p>
                <v-list-item prepend-icon="mdi-chart-bar" title="Graficos" value="Graficos"
                    :to="{ name: 'n-grafico' }"></v-list-item>

            </v-list>
        </v-navigation-drawer>

        <AppBar @openByCloseNavigationDrawerEmit="openByCloseNavigationDrawer" />
        <v-main class="ma-3">
            <slot></slot>
        </v-main>

    </v-app>
</template>

<script setup>
import AppBar from '@/layouts/AppBar.vue';
import { ref } from 'vue';
//data
const drawer = ref(true);
const rail = ref(false);
const image_Path = require('@/assets/images/icono.jpeg')

//methods
const openByCloseNavigationDrawer = () => {
    drawer.value = !drawer.value;
}
</script>
