import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './vuex';
import mixin from "@/mixins";
import Vuetify from 'vuetify';
import VueAnalytics from 'vue-analytics';
import md5 from 'md5';
import 'es6-promise/auto';

console.log(`inner: ${innerWidth} / ${innerHeight}`)
console.log(`outer: ${outerWidth} / ${outerHeight}`)

Vue.prototype.$md5 = md5;
Vue.prototype.$EventBus = new Vue(); // 이벤트버스 전역객체 등록
Vue.mixin(mixin);
Vue.use(Vuetify, {
  theme: {
    primary: "#4d21bc",
    secondary: "#6224fb",
    third: "#dedcee",
    colorYellow: "fbd146"
  }
});

let vga_id = 'UA-155901869-2'; // smart-on.co.kr 용

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: vga_id,
  router
});


new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
});
