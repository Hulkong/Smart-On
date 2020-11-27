import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './vuex';
import mixin from "@/mixins";
import axios from "axios";
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.config.devtools = true;
Vue.prototype.$EventBus = new Vue(); // 이벤트버스 전역객체 등록
Vue.prototype.$http = axios; // axios 전역객체 등록
Vue.mixin(mixin);
Vue.use(Vuetify);

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router,
  vuetify: new Vuetify({})
});
