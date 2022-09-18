import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import 'normalize.css';
import './styles/main.scss';

import './router/permission';

import SvgIcon from './components/SvgIcon/SvgContainer.vue';
import './assets/svg-js/iconfont';

const app = createApp(App);

app.use(router).use(createPinia());

app.component('SvgIcon', SvgIcon);

app.mount('#app');
