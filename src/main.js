import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as VueGoogleMaps from "vue2-google-maps";
import {GmapMarker} from 'vue2-google-maps/src/components/marker';
import '@/assets/styles.css';

Vue.config.productionTip = false;
Vue.component('GmapMarker', GmapMarker)

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAPS_KEY
  },
  installComponents: true
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
