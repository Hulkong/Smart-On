<template>
  <div v-show="layerPopup" id="popup-event-covid">
    <!-- 웹 - 안내창 -->
    <div v-show="willYouSee && device !== 'mo'" class="_modal _web">
      <div class="_dataReady">
        <div class="_root">
          <div class="_header"></div>
          <div class="_contents">
            <p class="tit">알려드립니다</p>
            <p class="desc">
              스마트온 서비스 내 코로나19 현황은 주말 및 공휴일에는 업데이트되지
              않습니다.
            </p>
            <p class="desc">
              추가로 회사의 작업일정에 따라 업데이트가 연기되는 일자가 발생할 수
              있습니다.
            </p>
            <p class="desc">이용에 참고 부탁 드립니다.</p>
          </div>
          <div class="_bottom">
            <div class="_close" @click="neverSee">다시보지 않기</div>
            <div class="_close" @click="closeNotice">닫기</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 웹 - 안내창 -->

    <!-- 모바일 - 안내창 -->
    <div v-show="willYouSee && device === 'mo'" class="_modal _mobile">
      <div class="_root">
        <div class="_contents">
          <img :src="getImageUrl('event/popup_contents.svg')" alt />
          <img
            @click="neverSee"
            class="_close _left"
            :src="getImageUrl('event/popup_never_show.svg')"
            alt
          />
          <img
            @click="closeNotice"
            class="_close _right"
            :src="getImageUrl('event/popup_close.svg')"
            alt
          />
        </div>
      </div>
    </div>
    <!-- 모바일 - 안내창 -->

    <div
      style="
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 250;
        opacity: 0.7;
        background: black;
      "
    ></div>

    <!--모달 추가 시작-->
    <div class="mo_modal" v-show="mo_modal" @click="closeModal">
      <img :src="getImageUrl('event/modal_info01.png')" />
      <!-- <img :src="getImageUrl('event/modal_info02.png')" />-->
    </div>
    <!--.mo_modal-->
    <!--모달 추가 끝-->
    <!--	코로나 팝업 시작	-->
    <div class="map_wrap">
      <!-- 지도 시작	-->
      <vworld
        :options="mapOption"
        :deviceType="device"
        :queryDate="stdrDate"
        ref="map2"
      ></vworld>
      <!-- 지도 끝	-->
      <header class="map_top cf">
        <a class="home" href="#" target="_blank">
          <img class="logo" :src="getImageUrl('event/cube_icon.gif')" />
        </a>

        <h1>
          <b>코로나19 현황</b>
          <strong v-if="device == 'web'">(COVID-19)</strong>
        </h1>
        <a class="refresh" href="#none" @click="initZoom">
          <img :src="getImageUrl('event/korea.png')" />전국 현황으로 이동
        </a>
        <div class="select">
          <select v-model="selmegacd" :class="{ active: selmegacd != '' }">
            <option value>광역시/도</option>
            <option
              v-for="(item, index) in megaSelOption"
              :key="index"
              :value="item.id"
            >
              {{ item.mega_nm }}
            </option>
          </select>
          <div class="select__arrow"></div>
        </div>
        <div class="select">
          <select v-model="selctycd" :class="{ active: selctycd != '' }">
            <option value>시/군/구</option>
            <option
              v-for="(item, index) in ctySelOption"
              :key="index"
              :value="item.id"
            >
              {{ item.cty_nm }}
            </option>
          </select>
          <div class="select__arrow"></div>
        </div>

        <img
          class="close"
          :src="getImageUrl('event/cancel.png')"
          @click="closeComponent"
        />
      </header>

      <!--수정 20200316-->
      <section class="hidden_menu">
        <input class="hidden_menu__input" type="checkbox" id="checkbox" />
        <!-- Swiper -->
        <div class="swiper-container hidden_menu__nav">
          <label id="btn" for="checkbox" ref="btn">
            <span class="off">
              <img
                style="width: 40px; height: auto"
                :src="getImageUrl('event/down-arrow.svg')"
              />
            </span>
            <span class="on">
              정보보기
              <!--<img style="width:40px; height:auto;" :src="getImageUrl('event/up-arrow.svg')">-->
            </span>
          </label>
          <div class="swiper-wrapper nav__item">
            <div class="swiper-slide">
              <h2>
                <b>{{ titleRegion }}</b> 현황
              </h2>
              <a :href="coronaInfo.url" target="_blank">
                상세보기
                <img :src="getImageUrl('event/search.png')" />
              </a>
              <span class="num">{{ last_fm }}</span>
              <ul class="cf">
                <li class="tit">
                  <b>확진환자</b>
                  <br />
                  <b class="num">
                    {{ confirmed_n }}&nbsp;
                    <strong>명</strong>
                  </b>
                </li>
                <li class="tit">
                  <b>격리해제/퇴원</b>
                  <br />
                  <b class="num">
                    {{ cured_n }}&nbsp;
                    <strong>명</strong>
                  </b>
                </li>
                <li class="tit">
                  <b>사망자</b>
                  <br />
                  <b class="num">
                    {{ death_n }}&nbsp;
                    <strong>명</strong>
                  </b>
                </li>
                <li class="tit">
                  <b>격리 중</b>
                  <br />
                  <b class="num">
                    {{ isolated_n }}&nbsp;
                    <strong>명</strong>
                  </b>
                </li>
              </ul>
            </div>
            <!--.swiper-slide-->
            <div class="swiper-slide">
              <h2>
                <b>{{ titleRegion }}</b> 일자별 확진자 수
              </h2>
              <div class="graph" style="background-color: transparent">
                <linechart :options="lineOption" ref="linechart"></linechart>
              </div>
            </div>
            <!--.swiper-slide-->

            <div class="swiper-slide">
              <h2 v-if="selctycd == ''">
                <b>{{ regionDivision }}별</b> 확진자 수
              </h2>
              <h2 v-else>
                확진자 이동경로
                <span class="_upt_date" style="font-size: 12px"
                  >(업데이트일시: {{ updFlwDate }})</span
                >
              </h2>
              <!-- <h2 v-else>인구 10만 명당 발생률</h2> -->
              <ul v-if="selctycd == ''" ref="covidList">
                <li
                  v-for="(item, index) in regionConfirmList"
                  :key="index"
                  @click="selectRegion(item)"
                  :class="{ on: item.id == hoverId }"
                  @mouseenter="listEnter(item)"
                  @mouseleave="listLeave()"
                >
                  <span class="num pior">{{ index + 1 }}</span>
                  {{ item.nm }}
                  <b class="num">{{ item.confirmed_n }} 명</b>
                  (
                  <strong class="num">{{ item.diff }}</strong>
                  <img
                    v-if="item.sign != ''"
                    style="width: 20px; height: auto"
                    :src="getImageUrl('event/' + item.sign + '.png')"
                  />
                  )
                </li>
              </ul>
              <ul class v-else ref="covidList">
                <li
                  class="t_left"
                  v-for="(item, index) in regionConfirmList"
                  :key="index"
                >
                  <span class="num pior">{{ item.num }}</span>
                  <!-- {{item.flw}} -->
                  <p v-html="item.flw"></p>
                </li>
                <li class="t_left" v-if="regionConfirmList.length == 0">
                  <p v-html="nullMsg"></p>
                </li>
              </ul>
            </div>
            <!--.swiper-slide-->
          </div>
          <!--.swiper-wrapper-->
          <!-- Add Pagination -->
          <div class="swiper-pagination"></div>
        </div>
        <!--.swiper-container-->
      </section>
    </div>
    <!--.map_wrap-->
    <!--	///코로나 팝업 끝	-->
  </div>
  <!--#popup-event-covid-->

  <!-- </div> -->
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Vworld from "@/components/map-vworld-leaflet";
import linechart from "@/components/chart-line-type1";
// import Swiper from "swiper";
export default {
  name: "popup-event-covid",
  data() {
    return {
      willYouSee: true,
      mo_modal: false,
      // swBox: false,
      stdrDate: null, // 마지막 업데이트 날짜들 ( corona )
      stdrDate_flw: null, // 마지막 업데이트 날짜들 ( corona_flw )
      lastDate: "", // 마지막 업데이트 날짜(query용)
      last_fm: "", // 마지막 업데이트 날짜
      megaSelOption: [], // 시도 리스트
      ctySelOption: [], // 시군구 리스트
      selmegacd: "", // 선택한 시도
      selctycd: "", // 선택한 시군구
      hoverId: "", // 마우스 오버
      titleRegion: "전국", // 선택한 지역의 name
      coronaInfo: {}, // 코로나 정보
      confirmed_n: 0, // 코로나 정보(확진자)
      cured_n: 0, // 코로나 정보(경리해제/퇴원)
      death_n: 0, // 코로나 정보(사망자)
      isolated_n: 0, // 코로나 정보(격리중)
      regionConfirmList: [], // 선택 지역하위 지역리스트
      regionDivision: "시도",
      nullMsg: "", // 확진자 이동경로 default 메시지
      swiper: null, // 스와프 객체
      updFlwDate: "", // 업데이트 날짜
    };
  },
  watch: {
    layerPopup: function (nTogg) {
      if (nTogg) this.initPopup();
    },

    selmegacd: function (newMega) {
      // 시도 selectbox 선택
      const that = this;
      // 타이틀 변경
      if (newMega == "") {
        // 전국 선택
        this.titleRegion = "전국";
        this.ctySelOption = [];
        this.selctycd = "";
        this.regionDivision = "시도";

        //정보가져오기
        this.setInfo("mega");
      } else {
        // 시도 선택
        if ("36,50".indexOf(newMega) != -1) {
          //세종시 혹은 제주시 선택시 시군구선택 내용으로 이동
          this.getCtyOptionList(that.autoSelCty);
        } else {
          this.setTitleNm("mega");
          // 시군구 리스트 가져오기
          this.selctycd = "";
          this.getCtyOptionList();
          this.regionDivision = "시군구";

          //정보가져오기
          this.setInfo("mega");
        }
      }
    },
    selctycd: function (newCty) {
      // 시군구 selectbox 선택
      const that = this;
      // 타이틀 변경

      if (newCty == "") {
        // 상위 광역시 선택
        this.setTitleNm("mega");
        this.setInfo("mega");
      } else {
        // 시군구 선택
        this.setTitleNm("cty");
        //정보가져오기
        this.setInfo("cty");

        // 모바일에서 팝업 올리기
        if (this.getDevice == "mo") {
          const btn = this.$refs["btn"];
          if (btn.className == "on") {
            btn.click();
          }
        }
      }
    },
    // swBox: function(newSw) {
    //   let elBtn = this.$refs["swBtn"];
    //   if (newSw) elBtn.addAttributes("class", "on");
    //   else elBtn.removeClass("class", "on");
    // }
  },
  components: {
    vworld: Vworld,
    linechart: linechart,
  },

  computed: {
    // 공통 스토어
    ...mapState("commonstore", [
      "device", // 기기타입
      "layerPopup", // 레이어 팝업 사용 유무
      "coronaLastDate", // 코로나 마지막 업뎃 날짜
      "coronaMegaList", // 코로나 지역선택 selectbox option 리스트
      "coronaCtyList", // 코로나 지역선택 selectbox option 리스트
      "coronaText01", // 코로나 지역별 정보
      "coronaListMega", // 코로나 리스트-시도(왼쪽 맨아래)
      "coronaListCty", // 코로나 리스트-시군구(왼쪽 맨아래)
    ]),
    // 지도 관련 스토어
    ...mapState("mapstore", {
      mapOption: "map2",
    }),
    // 지도위에 올라갈 레이어 관련 스토어
    ...mapGetters("layerstore", {
      getLayerInfo: "getLayerInfo",
    }),
    // 지도위에 올라갈 레이어 관련 스토어
    ...mapGetters("commonstore", {
      getDevice: "getDevice",
    }),
    // 그래프 관련 스토어
    ...mapState("chartstore", {
      lineOption: "linechart",
    }),
  },

  methods: {
    ...mapMutations("commonstore", ["excuteLayerPopup"]),

    /**
     * @description 다시보지 않기
     */
    neverSee() {
      localStorage.setItem("willYouNeverSee", "YES");
      this.closeNotice();
    },

    /**
     * @description 코로나 페이지 닫기
     */
    closeComponent() {
      const willYouNeverSee = localStorage.getItem("willYouNeverSee");
      this.excuteLayerPopup(false);

      if (willYouNeverSee !== "YES") this.willYouSee = true; // 데이너 안내팝업창 보임
    },

    /**
     * @description 안내창 닫기
     */
    closeNotice() {
      this.willYouSee = false;
    },

    /**
     * 전국 보기 클릭시
     */
    initZoom() {
      const ref = this.$refs["map2"];
      const initOption = ref.init.option;

      if (this.getDevice == "web")
        ref.setCenter(
          initOption.center[1],
          initOption.center[0],
          initOption.level
        );
      else
        ref.setCenter(
          initOption.mcenter[1],
          initOption.mcenter[0],
          initOption.mlevel
        );
      this.selmegacd = "";
    },
    /**
     * @description 코로나 팝업을 처음 열었을때
     */
    initPopup: function () {
      var that = this;
      const layerInfo = this.getDefaultLayers(
        "map2",
        that.getLayerInfo,
        that.setQuery
      );

      // 지역 경계 지도 세팅
      this.getData(this.mapOption["dataURL"], this.mapOption["dataQuery"]).then(
        (result) => {
          that.setRegionMap(layerInfo);
        }
      );

      // 전국 데이터 가져오기
      if (this.selmegacd != "") {
        this.selmegacd = "";
      } else {
        this.setInfo();
      }
    },

    /**
     * @description SQL 파라미터 설정하는 메소드
     * @param {Object} query
     */
    setQuery: function (query) {
      if (!query) return;

      const that = this;
      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드

      // 쿼리스트링 객체 세팅
      for (let key in query) {
        // 시군구코드
        if (key === "ctycd") {
          query[key] = ctycd;
        }

        // 시군구코드
        if (key === "lastdate") {
          query[key] = that.stdrDate.stdr_date;
        }

        // 시군구코드
        if (key === "lastTime") {
          query[key] = that.stdrDate.stdr_time;
        }
      }

      if (this.selctycd == "" && this.selmegacd == "") {
        // 전국 선택
        query.id = null;
        query.rgnclss = "H0";
      } else if (this.selctycd == "" && this.selmegacd != "") {
        // 시도 선택
        query.rgnclss = "H1";
        query.id = this.selmegacd;
      } else if (this.selctycd != "") {
        // 시군구 선택
        query.rgnclss = "H3";
        query.id = this.selctycd;
      }

      return query;
    },
    /**
     * @description 지도생성
     */
    setRegionMap: function (data) {
      const target = this.$refs["map2"];
      target.draw(data, this.mapOption);
    },
    /**
     * @description 시군구select box 리스트 데이터 가져오기
     */
    getCtyOptionList: function (callback) {
      var mega_cd = this.selmegacd;
      this.getData(this.coronaCtyList["dataURL"], {
        rgnclss: "H3",
        parentId: mega_cd,
        odby: "cty_nm",
      }).then((result) => {
        this.ctySelOption = result["data"];
        if ("36,50".indexOf(mega_cd) != -1) {
          if (callback) callback();
        }
      });
    },
    /**
     * @description 각 타이틀에 선택한 지역명 추가
     */
    setTitleNm: function (arrNm) {
      const that = this;
      const id = arrNm == "mega" ? this.selmegacd : this.selctycd;
      const optionArr = this[arrNm + "SelOption"];
      for (let op = 0; op < optionArr.length; op++) {
        if (optionArr[op].id == id) {
          that.titleRegion = optionArr[op][arrNm + "_nm"];
        }
      }
    },
    /**
     * @description 이벤트 페이지 왼쪽 내용 가져오기
     */
    setInfo: _.debounce(function (arrNm) {
      const that = this;
      let query = {
        rgnclss: "H0",
        id: "",
        lastdate: that.stdrDate.stdr_date,
        lastTime: that.stdrDate.stdr_time,
      };
      query = this.setQuery(query);

      // 리스트 스크롤 초기화
      let elmnt = that.$refs["covidList"];
      elmnt.scrollTop = 0;

      // 지도에 표현
      const target = this.$refs["map2"];
      if (arrNm == "mega") target.selectMegaRegion(this.selmegacd);
      else if (arrNm == "cty") target.selectCtyRegion(this.selctycd);

      // 데이터 가져오기 (현황)
      this.setDataArea(query);

      // 데이터 가져오기 (그래프)
      const lineTarget = this.makeChartTargets(["linechart"]);
      this.drawCharts(lineTarget, this.setQuery);

      // 데이터 가져오기 (리스트)
      if (arrNm == "cty") {
        query.lastdate = that.stdrDate_flw.stdr_date;
        query.lastTime = that.stdrDate_flw.stdr_time;
        this.setCoronaList(query, "Cty");
      } else {
        this.setCoronaList(query, "Mega");
      }

      // 구글 어널리틱스
      if (arrNm == "cty") {
        this.$ga.event("corona", that.titleRegion, that.selctycd); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드
      } else {
        this.$ga.event("corona", that.titleRegion, that.selmegacd); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드
      }
    }, 300),

    /**
     * @description 시도별 확진자수-전국선택, 시군구별 확진자수-시도선택(coronaListMega),
     * 확진자(coronaListCty) 이동경로 리스트 가져오기
     */
    setCoronaList: function (query, arrNm) {
      const that = this;
      let msg = null;
      if (arrNm == "Cty") msg = this["coronaList" + arrNm]["errorMsg"];

      this.getData(this["coronaList" + arrNm]["dataURL"], query).then(
        (result) => {
          that.regionConfirmList = result["data"];
          if (arrNm == "Cty") {
            // if (msg !== null) {
            //   if (
            //     query.id.substr(0, 2) == "47" ||
            //     query.id.substr(0, 2) == "11" ||
            //     query.id.substr(0, 2) == "27"
            //   ){
            //     that.nullMsg = msg["null_" + query.id.substr(0, 2)];
            //     that.regionConfirmList = [];
            //   }else{
            //     that.nullMsg = msg["nullall"];
            //   }
            // }
            that.nullMsg = msg["null_temp"];
            that.regionConfirmList = [];
          }
        }
      );
    },
    /**
     * @description 지역 정보 데이터 가져오기(현황)
     */
    setDataArea: function (query) {
      const that = this;
      this.getData(this.coronaText01["dataURL"], query).then((result) => {
        let info = result["data"][0];
        that.coronaInfo = info;
        that.startCounter("confirmed_n", info.confirmed_n);
        that.startCounter("cured_n", info.cured_n);
        that.startCounter("death_n", info.death_n);
        that.startCounter("isolated_n", info.isolated_n);
      });
    },
    /**
     * @description 현황내용 업데이트시 200ms동안 랜덤 [0~value 사이의] number 보여주기
     */
    startCounter: function (name, value) {
      // 초기화
      const that = this;
      if (value == 0) {
        that[name] = value;
        return;
      }

      if (this.getDevice == "mo") {
        that[name] = that.numberWithCommas(value);
      } else {
        // 3000ms까지 랜덤 숫자 변경
        let timerId = setInterval(() => {
          if (value) {
            that[name] = that.numberWithCommas(loopRandom(0, value));
          } else {
            that[name] = value;
          }
        }, 20);
        setTimeout(() => {
          clearInterval(timerId);
          that[name] = that.numberWithCommas(value);
        }, 200);
      }

      function loopRandom(min, max) {
        var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return ranNum;
      }
    },

    /**
     * @description 시도별 확진자수, 시군구별 확진자수 리스트 선택시
     */
    selectRegion: function (item) {
      if (item.id === undefined) return false;
      const that = this;
      if (item.rgn_clss == "H1") {
        that.selmegacd = item.id;
      } else if (item.rgn_clss == "H3") {
        that.selctycd = item.id;
      }
    },

    /**
     * @description 모바일 안내 모달 닫기
     */
    closeModal: function () {
      // 스와이프 닫기
      const btn = document.getElementById("btn");
      btn.click();
      // 모달 닫기
      this.mo_modal = false;
    },

    /**
     * @description 화면 조절에 따른 chart 새로그리기
     */
    resizeDraw: function () {
      const lineComponent = this.$refs["linechart"];
      const lineTarget = this.makeChartTargets(["linechart"]);
      lineComponent.remove();
      this.drawCharts(lineTarget, this.setQuery);
    },

    /**
     * @description 시군구 확진자수, 시도 확진자수 리스트 mouseover (지도 polygon 색상 변경)
     */
    listEnter: function (item) {
      const mapcomponent = this.$refs["map2"];
      if (this.selmegacd == "") {
        mapcomponent.resetFeatureStyle("mega_bound_layer");
        mapcomponent.setHighlight("mega_bound_layer", item.id);
      } else {
        mapcomponent.resetFeatureStyle("cty_layer");
        mapcomponent.setHighlight("cty_layer", item.id);
      }
    },

    /**
     * @description 시군구 확진자수, 시도 확진자수 리스트 mouseleave (지도 polygon 색상 초기화)
     */
    listLeave: function () {
      const mapcomponent = this.$refs["map2"];
      if (this.selmegacd == "")
        mapcomponent.resetFeatureStyle("mega_bound_layer");
      else mapcomponent.resetFeatureStyle("cty_layer");
    },

    /**
     * @description 제주, 세종시 선택시 시군구 단위로 자동선택
     */
    autoSelCty() {
      const that = this;
      const mega = this.selmegacd;

      const target = this.$refs["map2"];
      target.selectMegaRegion(this.selmegacd);

      if (mega == "50") {
        that.selctycd = "50000";
      } else {
        that.selctycd = "36110";
      }
    },
  },

  created() {},

  mounted() {
    // 구글 어널리틱스
    this.$ga.page("/corona");

    const willYouNeverSee = localStorage.getItem("willYouNeverSee");

    if (willYouNeverSee === "YES") this.closeNotice();

    // 모바일인지 확인후 처리
    if (this.getDevice == "mo") {
      // 모바일 팝업 내림
      const btn = document.getElementById("btn");
      btn.addEventListener("click", function () {
        if (this.className == "on") this.classList.remove("on");
        else this.classList.add("on");
      });

      // 모달on
      this.mo_modal = true;

      // swiper 생성
      this.swiper = new Swiper(".swiper-container", {
        updateOnWindowResize: true,
        setWrapperSize: true,
        observer: true,
        observeParents: true,
        pagination: {
          el: ".swiper-pagination",
          dynamicBullets: true,
        },
      });
    }

    // 시도 리스트 가져오기 (selectbox option)
    this.getData(this.coronaMegaList["dataURL"], {
      rgnclss: "H1",
      odby: "id",
    }).then((result) => {
      this.megaSelOption = result["data"];
    });
    // 코로나 마지막 업데이트 날짜가져오기
    this.getData(this.coronaLastDate["dataURL"]).then((result) => {
      this.stdrDate = result["data"].corona[0];
      this.stdrDate_flw = result["data"].corona_flw[0];
      this.last_fm = this.stdrDate["stdr_fm"];
      this.last_flw_fm = this.stdrDate_flw["stdr_fm"];

      let splitDate = this.last_flw_fm.split(".");

      this.updFlwDate =
        splitDate[1] +
        "월 " +
        splitDate[2] +
        "일 " +
        this.stdrDate_flw["stdr_time"] +
        "시";
    });

    window.addEventListener("resize", this.resizeDraw); // resize 이벤트리스너 등록
  },

  destroyed() {
    window.removeEventListener("resize", this.resizeDraw); // resize 이벤트리스너 해제
  },
};
</script>
<style scoped src="@/assets/css/event/sub_main.css"></style>
<style scoped src="@/assets/css/event/mobile.css"></style>
<style scoped>
#popup-event-covid >>> ._modal._web,
#popup-event-covid >>> ._modal._mobile {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
}
#popup-event-covid >>> ._modal ._dataReady {
  width: 100%;
  height: 280px;
  margin-top: 300px;
}
#popup-event-covid >>> ._modal ._dataReady ._root {
  width: 600px;
  height: 100%;
  margin: 0 auto;
  padding: 0;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 2px 2px 2px 2px grey;
}
#popup-event-covid >>> ._modal ._header {
  text-align: right;
  height: 50px;
}
#popup-event-covid >>> ._modal ._header p {
  text-align: right;
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
  margin-right: 15px;
  margin-top: 11px;
}
#popup-event-covid >>> ._modal ._dataReady ._root ._contents p {
  text-align: center;
  margin-bottom: 20px;
}
#popup-event-covid >>> ._modal ._dataReady ._root ._contents .tit {
  font-size: 20px;
  font-weight: bold;
}
#popup-event-covid >>> ._modal ._dataReady ._root ._contents .desc {
  font-size: 15px;
}

#popup-event-covid >>> ._modal ._bottom {
  height: 50px;
  text-align: center;
}

#popup-event-covid >>> ._modal ._close {
  background: rgb(78, 0, 255);
  width: 100px;
  line-height: 36px;
  text-align: center;
  display: inline-block;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

#popup-event-covid >>> ._modal._mobile ._root {
  width: 100%;
  height: 100vh;
}

#popup-event-covid >>> ._modal._mobile img {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#popup-event-covid >>> ._modal._mobile img {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#popup-event-covid >>> ._modal._mobile img._close {
  top: 280px;
  cursor: pointer;
  background: transparent;
}

#popup-event-covid >>> ._modal._mobile img._close._left {
  right: 100px;
}

#popup-event-covid >>> ._modal._mobile img._close._right {
  left: 100px;
}
</style>