import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import PersonalView from '@/views/PersonalView.vue';
import SucursalView from '@/views/SucursalView.vue';
import UsuarioView from '@/views/UsuarioView.vue';
import GraficoView from '@/views/GraficoView.vue';
import VehiculoView from '@/views/VehiculoView.vue';
import ClienteView from '@/views/ClienteView.vue';
import PedidoView from '@/views/PedidoView.vue';

//middleware
import authenticate from '@/http/middleware/authenticate'
import authExpiration from '@/http/middleware/authExpiration'
const routes = [
  {
    path: '/',
    name: 'n-login',
    component: LoginView,
    meta: {
      requireAuth: false
    }
  },

  {
    path: '/home',
    name: 'n-home',
    component: HomeView,
    meta: {
      requireAuth: true
    }
  },

  {
    path: '/sucursal',
    name: 'n-sucursal',
    component: SucursalView,
    meta: {
      requireAuth: true
    }
  },

  {
    path: '/personal',
    name: 'n-personal',
    component: PersonalView,
    meta: {
      requireAuth: true
    }
  },

  {
    path: '/usuario',
    name: 'n-usuario',
    component: UsuarioView,
    meta: {
      requireAuth: true
    }
  },

  {
    path: '/grafico',
    name: 'n-grafico',
    component: GraficoView,
    meta: {
      requireAuth: true
    }
  },

  {
    path: '/vehiculo',
    name: 'n-vehiculo',
    component: VehiculoView,
    meta: {
      requireAuth: true
    }
  },

  {
    path: '/cliente',
    name: 'n-cliente',
    component: ClienteView,
    meta: {
      requireAuth: true
    }
  },


  {
    path: '/pedido',
    name: 'n-pedido',
    component: PedidoView,
    meta: {
      requireAuth: true
    }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


//agregar los middleware para proteger las rutas
router.beforeEach((to, from, next) => {
  authExpiration();
  authenticate(to, from, next);

});

export default router;




