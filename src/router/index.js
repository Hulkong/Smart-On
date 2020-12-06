import Vue from "vue";
import vueRouter from "vue-router";
const Home = () => import( /* webpackChunkName:home */ '@/components/home');
const Map = () => import( /* webpackChunkName:home */ '@/components/page-map');
const Report = () => import( /* webpackChunkName:home */ '@/components/page-main');
const CityStatus = () => import( /* webpackChunkName:home */ '@/components/page-city-status');
const CityDiagnosis = () => import( /* webpackChunkName:home */ '@/components/page-city-diagnosis');
const PolicyRecommend = () => import( /* webpackChunkName:home */ '@/components/page-policy-recommend');
const About = () => import( /* webpackChunkName:home */ '@/components/page-company');
const DataList = () => import( /* webpackChunkName:home */ '@/components/page-company-datalist');
const WhoWeAre = () => import( /* webpackChunkName:home */ '@/components/page-company-whoweare');
const Contact = () => import( /* webpackChunkName:home */ '@/components/page-contact');
const Error_404 = () => import( /* webpackChunkName:home */ '@/components/error404');
const Error_503 = () => import( /* webpackChunkName:home */ '@/components/error503');
const MobileHome = () => import( /* webpackChunkName:home */ '@/components/mobile-home');
const MobileDetailInfo = () => import( /* webpackChunkName:home */ '@/components/mobile-detail-info');
const GeneralElection = () => import( /* webpackChunkName:home */ '@/components/page-general-election');
const SggSelect = () => import( /* webpackChunkName:home */ '@/components/sgg-select');
const SggLayer = () => import( /* webpackChunkName:home */ '@/components/sgg-layer');
const MobileGeneralElection = () => import( /* webpackChunkName:home */ '@/components/mobile-general-election');
const MobileGeneralElectionResult = () => import( /* webpackChunkName:home */ '@/components/mobile-general-election-result');
const Pdf = () => import( /* webpackChunkName:home */ '@/components/pdf-type2');
const KakaoShare = () => import( /* webpackChunkName:home */ '@/components/kakao-share');
const SlickCrousel = () => import( /* webpackChunkName:home */ '@/components/slick-crousel');
const LeafletDemo = () => import( /* webpackChunkName:home */ '@/components/map-leaflet-demo');

Vue.use(vueRouter);

export default new vueRouter({
  scrollBehavior() {
    window.scrollTo(0, 0);
  },
  mode: "history",
  routes: [{
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/map",
      name: "map",
      component: Map,
    },
    {
      path: "/report",
      name: "report",
      component: Report,
      children: [{
          path: "cityStatus",
          name: "cityStatus",
          component: CityStatus
        },
        {
          path: "cityDiagnosis",
          name: "cityDiagnosis",
          component: CityDiagnosis
        },
        {
          path: "policyRecommend",
          name: "policyRecommend",
          component: PolicyRecommend
        },
        {
          path: "ge",
          name: "generalElection",
          component: GeneralElection,
          children: [{
              path: "select",
              name: "sggSelect",
              component: SggSelect
            },
            {
              path: "main",
              name: "sggLayer",
              component: SggLayer
            }
          ]
        },
        {
          path: "about",
          name: "about",
          component: About,
          children: [{
              path: "dataList",
              name: "dataList",
              component: DataList
            },
            {
              path: "whoWeAre",
              name: "whoWeAre",
              component: WhoWeAre
            }
          ]
        }, {
          path: "contact",
          name: "contact",
          component: Contact
        }
      ]
    },
    {
      path: "/error503",
      name: "503error",
      component: Error_503
    },
    {
      path: "/pdf",
      name: "Pdf",
      component: Pdf
    },
    {
      path: "/kakaoShare",
      name: "KakaoShare",
      component: KakaoShare
    },
    {
      path: "/slickCrousel",
      name: "SlickCrousel",
      component: SlickCrousel
    },
    {
      path: "/leafletDemo",
      name: "LeafletDemo",
      component: LeafletDemo
    },
    {
      path: "/m",
      name: "MobileHome",
      component: MobileHome
    },
    {
      path: "/m_detail",
      name: "MobileDetailInfo",
      component: MobileDetailInfo
    },
    {
      path: "/m_election",
      name: "MobileGeneralElection",
      component: MobileGeneralElection
    },
    {
      path: "/m_election_result",
      name: "MobileGeneralElectionResult",
      component: MobileGeneralElectionResult
    },
    {
      path: "*",
      name: "404error",
      component: Error_404
    }
  ]
});
