import Vue from "vue";
import vueRouter from "vue-router";
import home from '@/components/pages/home';
import map from '@/components/pages/subPages/map/main';
import report from '@/components/pages/subPages/report/main';
import cityStatus from '@/components/pages/subPages/report/cityStatus';
import cityDiagnosis from '@/components/pages/subPages/report/cityDiagnosis';
import policyRecommend from '@/components/pages/subPages/report/policyRecommend';
import about from '@/components/pages/subPages/about/main';
import contact from '@/components/pages/subPages/contact/main';

Vue.use(vueRouter);

export default new vueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/map",
      name: "map",
      component: map,
      // component: () =>
      //       import(
      //         /* webpackChunkName: "leaflet" */ "../components/map/vworld/leaflet.vue"
      //       )
    },
    {
      path: "/report",
      name: "report",
      component: report,
      children: [{
        path: "cityStatus",
        name: "도시현황",
        component: cityStatus
      }, {
        path: "cityDiagnosis",
        name: "정책추천",
        component: cityDiagnosis
      }, {
        path: "policyRecommend",
        name: "도시진단",
        component: policyRecommend
      }, {
        path: "about",
        name: "about",
        component: about
      }, {
        path: "contact",
        name: "contact",
        component: contact
      }]
    }
  ]
});
