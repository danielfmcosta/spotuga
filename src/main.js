import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './app/router';
import loadComponents from './components';

import App from './App.vue';

import './assets/styles/index.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

loadComponents(app);

app.mount('#app');
