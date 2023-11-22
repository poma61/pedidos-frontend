//vue 3
import router from '@/router'
import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstated from 'pinia-plugin-persistedstate'
import '@/assets/css/style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'


//para traducciones
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'
// Importa las traducciones desde node_modules  de vuetify
import esTranslations from 'vuetify/lib/locale/es.mjs';
import enTranslations from 'vuetify/lib/locale/en.mjs';

//animate css
import 'animate.css';

const messages = {
  es: {
    $vuetify: {
      ...esTranslations,
    },
    10: '10',   // Forzar traducción (aunque no sea necesaria)
    25: '25',   // Forzar traducción (aunque no sea necesaria)
    50: '50',   // Forzar traducción (aunque no sea necesaria)
    100: '100', // Forzar traducción (aunque no sea necesaria)
  },
  en: { //cargamos idioma ingles como idioma secundario
    $vuetify: {
      ...enTranslations,
    },
    10: '10',   // Forzar traducción (aunque no sea necesaria)
    25: '25',   // Forzar traducción (aunque no sea necesaria)
    50: '50',   // Forzar traducción (aunque no sea necesaria)
    100: '100', // Forzar traducción (aunque no sea necesaria)
  },
}

const i18n = new createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: 'es',
  fallbackLocale: 'en',
  messages,
})

const vuetify = createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  components,
  directives,
});
const pinia = createPinia();
pinia.use(piniaPluginPersistedstated);

createApp(App).use(router).use(pinia).use(vuetify).mount('#app')


