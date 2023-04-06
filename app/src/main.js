import Vue from 'vue'
import App from './App.vue';
import { Icon } from 'leaflet';
import '@/assets/css/tailwind.css';
import 'leaflet/dist/leaflet.css';


import store from './store';
import router from './router';

Vue.config.productionTip = false;

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
};
Vue.use(Toast, options);


import VueImg from 'v-img';

Vue.use(VueImg);

import VueJsModal from 'vue-js-modal';
Vue.use(VueJsModal, {
  dialog: true,
  dynamicDefaults: {
    draggable: false
  }
});





// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');



