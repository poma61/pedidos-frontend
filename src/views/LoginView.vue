<template>
    <div class="d-flex justify-center align-center as-content-login">
        <v-card class="mx-3 pa-5 as-login" width="500" elevation="24" height="550">
            <v-img :src="image_path" class="my-2" />
            <v-form @submit.prevent="login">
                <v-text-field v-model="user" :readonly="loading" class="mb-2" clearable label="Usuario"
                    placeholder="Escriba su usuario..." color="blue-darken-3"></v-text-field>

                <v-text-field v-model="password" :readonly="loading"  label="Password"
                    placeholder="Escriba su contraseña..." color="blue-darken-3"
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                    autocomplete="off" @click:append-inner="show = !show"></v-text-field>

                <v-btn :loading="loading" block color="blue-darken-3" size="large" type="submit" variant="elevated">
                    Ingresar
                </v-btn>
            </v-form>
        </v-card>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/useAuth';
import useToastify from '@/composables/useToastify';
//data
const image_path = require('@/assets/images/icono.jpeg')
const user = ref("");
const password = ref("");
const loading = ref(false);
const router = useRouter();
const show = ref(false);
//methods 
const login = () => {
    loading.value = true;

    setTimeout(async () => {
        const auth = useAuth();
        const auth_success = await auth.login(user.value, password.value)
        if (auth_success.status) {
            router.push("home");
            useToastify('info', auth_success.message);
        } else {
            useToastify('danger', auth_success.message);
        }
        loading.value = false;

    }, 800);
}
</script>

<style scoped>
body {
    overflow: hidden;
}
.as-content-login {
    min-height: 100vh;
    background-image: linear-gradient(to bottom, rgb(204, 204, 204, 0.5), rgb(153, 153, 153, 0.5)), url(@/assets/images/ecommerce.jpg);
    background-size: cover;
    overflow: hidden !important;
}
.as-login {
    /* background-color: rgba(255, 255, 255, 0.699); */
}
.btn-close {
    position: absolute;
    top: -10px;
    right: -10px;
}
</style>