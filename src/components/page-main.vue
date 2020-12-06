<template>
  <v-app>
    <popup></popup>
    <!-- 네비게이션 start-->
    <v-navigation-drawer class="navigation" v-model="drawer" permanent width="420" fixed>
      <v-container fluid class="pa-0 ma-0">
        <v-layout align-center justify-center row wrap class="primary">
          <!-- 섹션1 -->
          <v-flex md12 class="_top_container" style="height:44vh; padding: 0 36px 0 36px;">
            <!-- TOP -->
            <v-flex md12 class="_top_layer" style="padding: 19px 0 14px 0;">
              <v-card>
                <vworld :options="mapOption" ref="map1"></vworld>
              </v-card>
            </v-flex>
            <!-- TOP -->

            <!-- MIDDLE -->

            <v-flex md12 class="_middle_layer">
              <v-card class="text-md-center" flat>
                <span
                  @click="excuteLayerPopup(true)"
                  style=" position:absolute; cursor:pointer; border-radius:20px;  top:-38px; right:-10px; z-index:1000; font-size:12px;  padding:10px 16px; display:inline-block; background:#FBD14B; font-weight:bold; color:#4D21BC; "
                >
                  <img
                    style="position:relative; top:2px;  margin-right:2px; margin-right:2px; width:14px; height:auto;"
                    :src="getImageUrl('common/corona_icon.png')"
                  />
                  <img
                    style="width:35px; height:auto; position:absolute; top:-6px; left:5px"
                    :src="getImageUrl('common/click01.gif')"
                  />
                  코로나19
                </span>
                <div>
                  <p
                    class="_hangeul_region_nm"
                    v-if="regionMap.mega_nm"
                    :style="calFont"
                  >{{ regionMap.mega_nm }} {{ regionMap.cty_nm }}</p>
                  <p class="_hangeul_region_nm" v-else>-</p>
                </div>
                <div style="font-size:17px;">
                  <p
                    class="_eng_region_nm"
                    v-if="regionMap.eng_mega"
                  >{{ regionMap.eng_nm }}, {{ regionMap.eng_mega }}</p>
                  <p class="_eng_region_nm" v-else>-</p>
                </div>
              </v-card>
            </v-flex>
            <!-- MIDDLE -->

            <!-- BOTTOM -->
            <div class="select st07">
              <select class ref="megaSelect" @change="megaChange">
                <option value selected="false">광역시/도</option>
                <option
                  v-for="(mega, index) in megas"
                  :key="index"
                  :value="mega.id"
                  :selected="megaCd === mega.id"
                >{{ mega.nm }}</option>
              </select>
              <div class="select__arrow"></div>
            </div>
            <div class="select st07">
              <select class ref="citySelect" @change="cityChange" @click="cityClick">
                <option value>시/군/구</option>
                <option
                  v-for="(city, index) in citys"
                  :key="index"
                  :value="city.id"
                  :selected="cityCd === city.id"
                >{{ city.nm }}</option>
              </select>
              <div class="select__arrow"></div>
            </div>
            <!-- BOTTOM -->
          </v-flex>
          <!-- 섹션1 -->

          <!-- 섹션2 -->
          <v-flex md12 class="_second_container secondary" style="height:41vh; padding-top:16px;">
            <v-card flat>
              <v-list class="tabs pl-5" dense style=" width:100%; height:100%;">
                <router-link
                  class="navMainTabs"
                  v-for="(tab, index) in navMainTabs"
                  :key="tab.id"
                  :to="{path : tab.path}"
                >
                  <v-list-tile :class="{on: currMainTab === index}" style="margin-bottom:16px;">
                    <v-list-tile-action>
                      <v-img height="26" contain :src="getImageUrl(tab.src)"></v-img>
                    </v-list-tile-action>

                    <v-list-tile-content style="padding-left:40px; font-size:22px;">
                      <v-list-tile-title>{{ tab.name }}</v-list-tile-title>
                    </v-list-tile-content>
                    <img
                      v-if="tab.isNew"
                      style="width:20px; height:auto; position:absolute; top:22px; right:115px"
                      :src="getImageUrl('common/icon_new.png')"
                    />
                  </v-list-tile>
                </router-link>
              </v-list>
            </v-card>
          </v-flex>
          <!-- 섹션2 -->

          <!-- 섹션3 -->
          <v-flex
            md4
            class="_third_container navSubTabs"
            v-for="(item, index) in navSubTabs"
            :key="index"
            :class="{on: currSubTab === index}"
            style="height:5vh;"
          >
            <router-link v-if="item.useRouterLink" :to="item.path">
              <v-btn
                class="_btn ma-0"
                color="white"
                flat
                style="width:100%; height:100%; font-size:18px;"
              >{{ item.name }}</v-btn>
            </router-link>

            <a v-else :href="item.path" :target="item.target" rel="noopener noreferrer">
              <v-btn
                class="_btn ma-0"
                color="white"
                flat
                style="width:100%; height:100%; font-size:18px;"
              >{{ item.name }}</v-btn>
            </a>
          </v-flex>
          <!-- 섹션3 -->

          <!-- 섹션4 -->
          <v-footer class="primary _fourth_container _footer">
            <div class="mateon_ci" style>
              <img :src="getImageUrl('common/mateonlogo.png')" />
            </div>
            <div class="mateon_txt">
              <div class="footer_txt">
                <p class="_contents">주소: 서울특별시 중구 청계천로 100, 시그니처타워 서관 11층</p>
                <p class="_contents">사업자번호: 763-88-01165</p>
              </div>
            </div>
          </v-footer>
          <!-- 섹션4 -->
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <!-- 네비게이션 end-->

    <!-- 컨텐츠 start -->
    <v-content class="_contents_root_container primary pb-0" style="padding-left:420px;">
      <v-card class="left-container" shaped style="height: 100%;">
        <v-container fluid class="ma-0 pa-0">
          <contents></contents>
        </v-container>
      </v-card>
    </v-content>
    <!-- 컨텐츠 end -->

    <!-- 다이얼 -->
    <v-dialog :value="dialog" persistent width="500">
      <v-card class="white">
        <v-card-title class="pa-4 headline grey lighten-2" primary-title>안내</v-card-title>
        <v-card-text class="pa-4">준비 중입니다.</v-card-text>
        <v-divider></v-divider>
        <v-card-actions class>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="excuteDialog(false)">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 다이얼 -->
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Vworld from "@/components/map-vworld-leaflet";
import Contents from "@/components/layout-contents";
import Popup from "@/components/popup-event-covid";
export default {
  props: {},

  data: () => ({
    drawer: true,
    right: null,
    active: null,
    keyword: "", // 입력받은 지자체명
    currMainTab: 0, // 도시현황, 도시진단, 정책추천 탭에서 선택된 탭의 인덱스
    currSubTab: -1, // 홈, 회사, 연락 탭의 인덱스
    orgUrl: "", // 지자체 홈페이지 URL,
    navMainTabs: [
      // {
      //   name: "4.15총선",
      //   src: "common/icon_4.15.png",
      //   path: "/report/ge/select",
      //   isNew: true
      // },
      {
        name: "도시현황",
        src: "common/nav1.png",
        path: "/report/cityStatus",
        isNew: false
      },
      {
        name: "도시진단",
        src: "common/nav2_1.png",
        path: "/report/cityDiagnosis",
        isNew: false
      },
      {
        name: "정책추천",
        src: "common/nav3.png",
        path: "/report/policyRecommend",
        isNew: false
      }
    ],
    navSubTabs: [
      {
        name: "홈", // 네비게이션 이름
        path: "/", // 네이게이션 웹경로
        active: true, // 활성화여부
        target: "_self",
        useRouterLink: true
      },
      {
        name: "회사", // 네비게이션 이름
        path: "/report/about/dataList", // 네이게이션 웹경로
        // path: "https://openmate-on.co.kr",
        active: true, // 활성화여부
        target: "_target",
        useRouterLink: true
      },
      {
        name: "연락", // 네비게이션 이름
        path: "/report/contact", // 네이게이션 웹경로
        // path: "mailto:sales@openmate-on.co.kr",
        active: true, // 활성화여부
        target: "_self",
        useRouterLink: true
      }
    ],
    searchContents: [],
    regionMap: {
      mega_nm: "", // 시도명
      cty_nm: "",
      mega_cd: "",
      cty_cd: "",
      eng_mega: "",
      eng_nm: ""
    }
  }),

  components: {
    searchContent: {
      template: `<div class="search_contents">{{ name }}</div>`,
      methods: {},
      props: ["name"]
    },
    vworld: Vworld,
    contents: Contents,
    popup: Popup
  },

  watch: {
    $route(to, from) {
      const currMainTab = Number(sessionStorage.getItem("currMainTab"));
      const detectMainList = {
        // sggSelect: 0, // 4.15총선 셀렉트페이지
        // sggLayer: 0, //  4.15총선 메인페이지
        cityStatus: 0,
        cityDiagnosis: 1,
        policyRecommend: 2
      };

      const detectSubTabIndex = {
        home: 0,
        dataList: 1,
        whoWeAre: 1,
        contact: 2
      };

      const indexMain = detectMainList[to["name"]];
      const indexSub = detectSubTabIndex[to["name"]];

      // 라우터변경시 세션스토리지 메인탭, 서브탭 값 변경
      // 메인탭일 경우
      if (indexMain >= 0) {
        sessionStorage.setItem("currMainTab", indexMain);
        sessionStorage.setItem("currSubTab", -1);
        this.currMainTab = indexMain;
        this.currSubTab = -1;

        // 그 이외일 경우
      } else {
        sessionStorage.setItem("currMainTab", -1);
        sessionStorage.setItem("currSubTab", indexSub);
        this.currMainTab = -1;
        this.currSubTab = indexSub;
      }

      this.moveScroll(0);
    }
  },

  computed: {
    // 공통 스토어
    ...mapState("commonstore", [
      "baseDate",
      "regionNm",
      "regionList",
      "basicStatus",
      "dialog"
    ]),
    // 지도 관련 스토어
    ...mapState("mapstore", {
      mapOption: "map1"
    }),
    // 지도위에 올라갈 레이어 관련 스토어
    ...mapGetters("layerstore", {
      getLayerInfo: "getLayerInfo"
    }),

    ...mapGetters("commonstore", {
      megaCd: "getMegaCd",
      cityCd: "getCityCd",
      megas: "getMegas",
      citys: "getCitys"
    }),

    activeSearch() {
      if (this.isNarrow) {
        return false;
      } else {
        let keyword = this.keyword;

        if (keyword.length === 0) {
          return false;
        } else {
          return true;
        }
      }
    },

    /**
     * @description 검색리스트 시각 존재 여부
     * @returns {Boolean flag} 시각 존재여부
     */
    isVisibleSearchList() {
      // 검색결과가 존재할 경우 검색리스트 숨김
      if (this.searchContents.length === 0) return false;
      // 검색결과가 존재할 경우 검색리스트 보임
      else return true;
    },

    /**
     * @description 지역명 길이에 맞춘 폰트 사이즈 계산
     * @returns {Object} 스타일
     */
    calFont() {
      let size = "28px"; // default
      const fullName = this.regionMap.mega_nm + this.regionMap.cty_nm;

      if (fullName.length >= 12) {
        size = "18px";
      }

      // ex) 세종특별자치시 세종특별자치구
      if (fullName.length >= 15) {
        size = "14px";
      }

      return {
        fontSize: size
      };
    }
  },

  methods: {
    ...mapMutations("commonstore", ["excuteDialog", "excuteLayerPopup"]),

    ...mapActions("commonstore", ["setAsyncMegas", "setAsyncCitys"]),

    ...mapMutations("commonstore", ["setMegaCd", "setCityCd"]),

    /**
     * @description 시도 변경하는 메소드
     * @param {Event} event
     */
    megaChange(event) {
      // console.log("change mega!!");
      const megaCd = event.target.value;
      this.setAsyncCitys(megaCd);
    },

    /**
     * @description 시군구 변경하는 메소드
     * @param {Event} event
     */
    cityChange(event) {
      // console.log("change city!!");
      const cityCd = event.target.value;

      this.setSessionStorage(cityCd).then(
        () => (location.href = "/report/cityStatus")
      );
    },

    /**
     * @description 시군구 셀렉트박스 클릭 이벤트
     * @param {Event} event
     */
    cityClick(event) {
      // console.log("click city!!");
      const target = event.target;
      const select = this.$refs["megaSelect"];

      if (select.selectedIndex === 0) {
        target.selectedIndex = 0;
        // target.blur();
        // select.focus();
        alert("광역시/도를 선택해 주세요.");
        return;
      }
    },

    /**
     * @description 세션 스토리지 데이터 저장
     */
    setSessionStorage(cityCd = -1) {
      if (cityCd < 0) return;

      const that = this;

      return new Promise((resolve, reject) => {
        const city = this.citys.filter(item => item.id === cityCd);

        if (city.length === 0) return;

        const cityNm = city[0]["nm"];
        const search_location = this.$route.name;

        // 구글 어널리틱스 이벤트
        that.$ga.event(search_location + " search", "search", cityNm); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

        that.getBaseDate(data => {
          const sdate = this.getDate("yyyymmdd", data[0]).join("");
          const edate = this.getDate("yyyymmdd", data[1]).join("");
          const start_date = this.getDate("yyyymmdd", data[0]).join("");
          const end_date = this.getDate("yyyymmdd", data[1]).join("");

          sessionStorage.setItem("sdate", sdate);
          sessionStorage.setItem("edate", edate);
          sessionStorage.setItem("start_date", start_date);
          sessionStorage.setItem("end_date", end_date);
          sessionStorage.setItem("ctycd", cityCd);
          sessionStorage.setItem("currMainTab", 0);
          sessionStorage.setItem("currSubTab", -1);

          resolve();
        });
      });
    },

    /**
     * @description 해당 시군구코드에 매핑되는 지역 한/영 명칭 가져오는 메소드
     */
    setRegionNm(data) {
      if (!data || data.length === 0) return;

      const that = this;
      Object.keys(data[0]).forEach(key => {
        if (that.$data.regionMap[key] === "")
          that.$data.regionMap[key] = data[0][key];
      });
    },

    /**
     * @description 필수 파라미터 체크하는 메소드
     */
    checkEssentialParam() {
      const ctycd = sessionStorage.getItem("ctycd");
      if (!ctycd || ctycd === "undefined") {
        alert("지역을 다시 검색해주세요");
        location.href = "/";
        return;
      }
    },

    /**
     * @description SQL 파라미터 설정하는 메소드
     * @param {Object} query
     */
    setQuery(query) {
      if (!query) return;

      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드

      // 쿼리스트링 객체 세팅
      for (let key in query) {
        // 시군구코드
        if (key === "ctycd") {
          query[key] = ctycd;
        }
      }

      return query;
    },

    setRegionMap() {
      const that = this;
      const target = this.$refs["map1"];
      const layerInfo = this.getDefaultLayers(
        "map1",
        that.getLayerInfo,
        that.setQuery
      );

      target.draw(layerInfo, this.mapOption);
    },

    /**
     *
     */
    excutePop() {}
  },

  // 지시자
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  },

  created() {
    const that = this;
    this.checkEssentialParam();
  },

  mounted() {
    const that = this;
    const ctycd = sessionStorage.getItem("ctycd");
    const megaCd = ctycd.substring(0, 2);

    this.setMegaCd(megaCd);
    this.setCityCd(ctycd);
    this.setAsyncMegas();
    this.setAsyncCitys(megaCd);

    // 지역 한/영 명칭 데이터 호출 및 세팅
    this.getData(this.regionNm["dataURL"], { ctycd: ctycd }).then(result => {
      that.setRegionNm(result["data"]);
    });

    // 기본현황 데이터 호출 및 세팅
    this.getData(this.basicStatus["dataURL"], { ctycd: ctycd }).then(result => {
      if (result.data.length === 0) return;
      that.orgUrl = result["data"][0]["home_link"];
    });

    // 지역 경계 지도 세팅
    that.setRegionMap();
  }
};
</script>

<style scoped></style>
<style scoped src="@/assets/css/nav.css"></style>