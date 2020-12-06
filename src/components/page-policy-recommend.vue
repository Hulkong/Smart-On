<template>
  <div id="policyRecommendation" @wheel="handleMouseWheel($event, eventAfterWheel)">
    <div class="sections-menu">
      <span
        class="menu-point"
        v-bind:class="{active: activePage == index}"
        v-on:click="clickFullpage(index)"
        v-for="(offset, index) in offsets"
        v-bind:key="index"
      ></span>
    </div>
    <!-- 컨테이너1 -->
    <v-container id="diagnose-area-top" fluid class="pa-0 ma-0 primary fullpage">
      <v-layout class="_parent_layout _parent1 third" align-center justify-space-between wrap>
        <v-flex md12 class="_layout1">
          <!-- top -->
          <v-flex
            md12
            class="_top _child1 _title _top_round_small _layout_graph"
            style="display:inline-block;"
          >정책 추천 분야</v-flex>
          <img
            class="_question"
            @mouseenter="openQuestionPopup"
            @mouseleave="closeQuestionPopup"
            :src="getImageUrl('common/question_16px.png')"
            alt
          />
          <popup-question
            :title="getTitle('policyRecommen1')"
            :contents="getContents('policyRecommen1')"
            :position="getPosition('policyRecommen1')"
          ></popup-question>
          <!-- top -->

          <!-- bottom -->
          <v-layout class="_bottom _bottom_round" align-center justify-space-between wrap>
            <v-flex md4 v-for="(item, index) in poliRecomm" :key="index" style="height:100%;">
              <v-layout
                class="_layout_contents _bar_container"
                align-center
                justify-space-between
                fill-height
                wrap
              >
                <!-- child1 -->
                <v-flex md12 class="_child1">
                  <div class="_icon">{{ index + 1 }}</div>
                  <span class="_rank">순위</span>
                  <span class="_text">{{ item.title }}</span>
                </v-flex>
                <!-- child1 -->

                <!-- child3 -->
                <v-flex md12 class="_child3">
                  <bar :options="item.option" :ref="item.ref"></bar>
                </v-flex>
                <!-- child3 -->
              </v-layout>
            </v-flex>
          </v-layout>
          <!-- bottom -->
        </v-flex>
      </v-layout>
    </v-container>
    <!-- 컨테이너1 -->

    <!-- 컨테이너2 -->
    <v-container fluid class="pa-0 ma-0">
      <v-layout class="_parent_layout _parent2 third" align-center justify-space-between wrap>
        <v-flex md9 class="_layout1">
          <v-flex
            md12
            class="_top _child1 _title _top_round_small _layout_graph"
            style="width:851px;display:inline-flex;"
          >
            <v-layout align-center justify-space-between wrap fill-height>
              <v-flex md3>추천 정책 리스트</v-flex>
              <v-flex md3 class="_select_container">
                <v-select
                  class="_select"
                  color="rgb(0, 33, 162)"
                  light
                  solo
                  :items="selectboxs1.items"
                  v-model="selectboxs1.select"
                  :menu-props="{auto:true, offsetY: true}"
                  return-object
                  outline
                  dense
                  single-line
                  background-color="black"
                  @change="changeSelectbox1($event)"
                ></v-select>
              </v-flex>
              <v-flex md6 class="_select_container">
                <v-select
                  class="_select"
                  color="rgb(0, 33, 162)"
                  light
                  solo
                  :items="selectboxs2.items"
                  v-model="selectboxs2.select"
                  :menu-props="{auto:true, offsetY: true}"
                  return-object
                  outline
                  dense
                  single-line
                  background-color="black"
                  @change="changeSelectbox2($event)"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
          <img
            class="_question"
            @mouseenter="openQuestionPopup"
            @mouseleave="closeQuestionPopup"
            :src="getImageUrl('common/question_16px.png')"
            alt
          />
          <popup-question
            :title="getTitle('policyRecommen2')"
            :contents="getContents('policyRecommen2')"
            :position="getPosition('policyRecommen2')"
          ></popup-question>
          <v-layout class="_bottom _bottom_round" align-center justify-space-between wrap>
            <v-flex md12 fill-height>
              <v-flex md12 class="_child3">
                <v-layout align-center justify-space-between wrap fill-height>
                  <v-flex md1 fill-height class="_left">
                    <v-img contain :src="getImageUrl('common/recommend_p.png')" max-width="67"></v-img>
                  </v-flex>
                  <v-flex md11 fill-height class="_right">
                    <v-flex md12 class="_title">유사지자체에서 수행한 {{title}} 관련 정책</v-flex>
                    <v-flex md12 class="_chart">
                      <v-flex fill-height>
                        <grid :options="gridOptions2" ref="grid2"></grid>
                      </v-flex>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex md3 class="_layout2 _popularSearches">
          <v-flex md12 class="_top _child1 _title _top_round_small _layout_graph">
            <v-layout align-center justify-space-between wrap fill-height>
              <v-flex md12 style="display:inline-block; font-size:24px;">
                인기 검색어
                <img
                  class="_question"
                  @mouseenter="openQuestionPopup"
                  @mouseleave="closeQuestionPopup"
                  :src="getImageUrl('common/question_16px.png')"
                  alt
                />
                <popup-question
                  :title="getTitle('policyRecommen3')"
                  :contents="getContents('policyRecommen3')"
                  :position="getPosition('policyRecommen3')"
                ></popup-question>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-layout
            class="_bottom _bottom_round"
            align-center
            justify-space-between
            fill-height
            column
          >
            <v-flex md12 class="_popIdx">
              <v-flex class="_title" md12>인기 지표</v-flex>
              <v-flex class="_container" md12>
                <div class="_loading_bar">
                  <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
                </div>
                <div class="_default_image">
                  <v-img
                    contain
                    width="50%"
                    height="50%"
                    class="_image"
                    :src="getImageUrl('common/img_ready.png')"
                    alt
                  />
                  <p class="_text">준비중입니다.</p>
                </div>
                <table>
                  <colgroup>
                    <col width="10%" />
                    <col width="90%" />
                  </colgroup>
                  <tbody>
                    <tr v-for="(item, index) in popularSearches" :key="item.key">
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                    </tr>
                  </tbody>
                </table>
              </v-flex>
            </v-flex>
            <v-flex md12 class="_policyClick">
              <v-flex class="_title" md12>정책 클릭 수</v-flex>
              <v-flex class="_container" md12>
                <div class="_loading_bar">
                  <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
                </div>
                <div class="_default_image">
                  <v-img
                    contain
                    width="50%"
                    height="50%"
                    class="_image"
                    :src="getImageUrl('common/img_ready.png')"
                    alt
                  />
                  <p class="_text">준비중입니다.</p>
                </div>
                <table>
                  <colgroup>
                    <col width="10%" />
                    <col width="90%" />
                  </colgroup>
                  <tbody>
                    <tr v-for="(item, index) in policyClicks" :key="item.key">
                      <td class="_index">{{ index + 1 }}</td>
                      <td class="_name" @click="item.callback">{{ item.name }}</td>
                    </tr>
                  </tbody>
                </table>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- 컨테이너2 -->

    <!-- 컨테이너3 -->
    <v-container fluid class="pa-0 ma-0 fullpage">
      <v-layout class="_parent_layout _parent3 third" align-center justify-space-between wrap>
        <v-flex md12 class="_layout1">
          <v-flex
            md12
            class="_top _child1 _title _top_round_small _layout_graph"
            style="width:770px;display:inline-flex;"
          >
            <v-layout align-center justify-space-between wrap>
              <v-flex md6>분야별 관련 데이터 및 우수기업</v-flex>
              <v-flex md6 class="_select_container">
                <v-select
                  class="_select"
                  color="rgb(0, 33, 162)"
                  light
                  solo
                  :items="selectboxs1.items"
                  v-model="selectboxs1.select"
                  :menu-props="{auto:true, offsetY: true}"
                  return-object
                  outline
                  dense
                  single-line
                  background-color="black"
                  @change="changeSelectbox1($event)"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>

          <img
            class="_question"
            @mouseenter="openQuestionPopup"
            @mouseleave="closeQuestionPopup"
            :src="getImageUrl('common/question_16px.png')"
            alt
          />
          <popup-question
            :title="getTitle('policyRecommen4')"
            :contents="getContents('policyRecommen4')"
            :position="getPosition('policyRecommen4')"
          ></popup-question>

          <v-layout
            class="_bottom _bottom_round _layout_contents"
            align-center
            justify-space-between
            wrap
          >
            <v-flex md12 class="_child1">
              <v-flex md12 class="_title">{{title}} 분야 관련 주요 공공 데이터</v-flex>
              <v-flex md12 class="_chart">
                <v-flex fill-height>
                  <grid :options="gridOptions3" ref="grid3"></grid>
                </v-flex>
              </v-flex>
            </v-flex>

            <v-flex md12 class="_child2">
              <v-flex md12 class="_title">{{title}} 분야 우수 민간 기업</v-flex>
              <v-flex md12 class="_chart">
                <v-flex fill-height>
                  <grid :options="gridOptions4" ref="grid4"></grid>
                </v-flex>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- 컨테이너3 -->

    <!-- TOP버튼 start-->
    <v-fab-transition>
      <v-btn
        color="primary"
        dark
        fixed
        bottom
        right
        fab
        style="bottom:45px;z-index:235;"
        v-show="isTop"
        @click="clickTop"
      >
        <v-icon large color="#fbd146">expand_less</v-icon>
      </v-btn>
    </v-fab-transition>
    <!-- TOP버튼 end-->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Bar from "@/components/chart-bar-type1";
import Grid from "@/components/grid";
import PopupQuestion from "@/components/popup-question-type2"; // question 팝업 컴포넌트

export default {
  name: "policyRecommendation",
  data: function() {
    return {
      isTop: false, // 현재 TOP 위치에 있는지 여부
      title: "",
      // 정책추천분야 막대그래프 레이아웃 데이터
      poliRecomm: [
        {
          title: "문화/관광",
          realmcd: null,
          option: this.barOptions1,
          ref: "bar1"
        },
        {
          title: "사회/복지",
          realmcd: null,
          option: this.barOptions2,
          ref: "bar2"
        },
        {
          title: "국토 및 교통",
          realmcd: null,
          option: this.barOptions3,
          ref: "bar3"
        }
      ],

      // 분야별 주요 키워드 및 세부사업 자료 셀렉트박스 데이터
      selectboxs1: {
        // 셀렉트박스 첫번째
        select: {
          text: "문화/관광",
          value: "1"
        },
        // 셀렉트박스 데이터
        items: [
          {
            text: "문화/관광",
            value: "1"
          }
        ]
      },

      // 분야별 주요 키워드 및 세부사업 자료 셀렉트박스 데이터
      selectboxs2: {
        // 셀렉트박스 두번째
        select: {
          text: "문화/관광",
          value: "1"
        },
        // 셀렉트박스 데이터
        items: [
          {
            text: "문화/관광",
            value: "1"
          }
        ]
      },

      // 배너 데이터
      banners: [
        {
          src: "common/banner_trendon.png",
          href: "https://trend-on.co.kr"
        },
        {
          src: "common/banner_safeon.png",
          href: "https://safe-on.co.kr"
        },
        {
          src: "common/banner_lighton.png",
          href: "http://light-on.co.kr"
        }
      ],
      activePage: 0,
      offsets: [],
      popularSearches: [], // 인기 검색어
      policyClicks: [{ key: 1, name: "test", callback: () => {} }] // 정책 클릭 수
    };
  },

  components: {
    bar: Bar,
    grid: Grid,
    "popup-question": PopupQuestion // 질문 팝업창 컴포넌트
  },

  computed: {
    ...mapState("chartstore", {
      barOptions1: "bar6",
      barOptions2: "bar7",
      barOptions3: "bar8"
    }),
    ...mapState("gridstore", {
      gridOptions1: "grid5",
      gridOptions2: "grid6",
      gridOptions3: "grid7",
      gridOptions4: "grid8"
    }),
    ...mapState("commonstore", {
      titleOption: "recomRealmList",
      selectOption1: "mainIdxCategory",
      selectOption2: "mainIdxDivision",
      popList: "popList",
      similarTitle: "similarTitle"
    }),
    ...mapGetters("questionstore", ["getTitle", "getContents", "getPosition"])
  },

  methods: {
    /**
     * @description TOP버튼 클릭 이벤트
     */
    clickTop() {
      this.isTop = false; // TOP버튼 숨김
      this.activePage = 0; // 활성화 페이지 초기화
      this.moveScroll(0); // 최상단으로 이동
    },

    /**
     * @description fullpage 이동버튼 클릭 이벤트
     * @param {Number} index 활성된 fullpage 이동버튼 인덱스
     */
    clickFullpage(index) {
      this.moveScroll(this.offsets[index]);
      this.activePage = index;
    },

    /**
     * @description SQL 파라미터 설정하는 메소드
     * @param {Object} query
     * @param {String} name
     */
    setQuery(query, name) {
      if (!query) return;

      if (!name) return;

      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드
      const startDate = sessionStorage.getItem("start_date"); // 기준 시작날짜
      const endDate = sessionStorage.getItem("end_date"); // 기준 마지막날짜
      const realmcd = sessionStorage.getItem("realmcd"); // 분야코드
      const idxcd = sessionStorage.getItem("idxcd"); // 지수코드

      // 쿼리스트링 객체 세팅
      for (let key in query) {
        // 시군구코드
        if (key === "ctycd") {
          query[key] = ctycd;
        }

        // 기준 시작날짜
        if (key === "sdate") {
          query[key] = startDate;
        }

        // 기준 마지막날짜
        if (key === "edate") {
          query[key] = endDate;
        }

        // 기준 마지막날짜
        if (key === "lastdt") {
          query[key] = endDate;
        }

        // 선택 분야
        if (key === "realmcd" && name === "bar1") {
          query[key] = this.poliRecomm[0].realmcd;
        }

        // 선택 분야
        if (key === "realmcd" && name === "bar2") {
          query[key] = this.poliRecomm[1].realmcd;
        }

        // 선택 분야
        if (key === "realmcd" && name === "bar3") {
          query[key] = this.poliRecomm[2].realmcd;
        }

        if (key === "realmcd" && name === "grid1") {
          query[key] = realmcd;
        }

        if (key === "realmcd" && name === "grid2") {
          query[key] = realmcd;
        }

        if (key === "realmcd" && name === "grid3") {
          query[key] = realmcd;
        }

        if (key === "realmcd" && name === "grid4") {
          query[key] = realmcd;
        }

        if (key === "idxcd" && name === "grid1") {
          query[key] = idxcd;
        }

        if (key === "idxcd" && name === "grid2") {
          query[key] = idxcd;
        }

        // 최신날짜
        if (key === "date" && !query[key]) {
          query[key] = edate;
        }
      }
      return query;
    },

    /**
     * @description wheel 이벤트 적용 후 작동하는 이벤트 메소드
     * @param {Number} pageIndex 현재 페이지 인덱스
     */
    eventAfterWheel(pageIndex) {
      const activeSelectList = document.getElementsByClassName(
        "menuable__content__active"
      );
      const scrollTop = document.scrollingElement
        ? document.scrollingElement.scrollTop
        : document.body.scrollTop;

      for (let i = 0; i < activeSelectList.length; i++) {
        const currTarget = activeSelectList[i];
        currTarget.style.display = "none";
      }

      // top 버튼 보임 유무
      if (pageIndex === 0) {
        this.isTop = false;
      } else {
        this.isTop = true;
      }

      // 이동한 스크롤이 중간지점에서 멈추었을 때 파라미터로 받은 페이지 위치로 이동
      if (scrollTop !== this.offsets[pageIndex])
        this.moveScroll(this.offsets[pageIndex]);
    },

    /**
     * @description 대분류 SELECT박스 선택 이벤트
     * @param {Event} event 이벤트
     */
    changeSelectbox1(event) {
      const code = event.value;
      const text = event.text;
      const that = this;
      let target = {};

      // 구글 어널리틱스
      this.$ga.event("policyrecom_realm", text, code); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

      // 중분류 셀렉트박스 재설정
      this.setSelectbox2(code).then(({ text = "", value = "" }) => {
        that.title = text.replace("지수", "");
        target = this.makeChartTargets(["grid1", "grid2", "grid3", "grid4"]); // 모든 그리드 선택
        sessionStorage.setItem("realmcd", code);
        sessionStorage.setItem("idxcd", value);

        that.setTitle();

        that.drawCharts(target, that.setQuery); // target에 포함된 차트들 그리기
      });
    },

    /**
     * @description 중분류 지수 SELECT박스 선택 이벤트
     * @param {Event} event 이벤트
     */
    changeSelectbox2(event) {
      const code = event.value;
      const text = event.text;
      const realmcd = sessionStorage.getItem("realmcd");
      const that = this;
      let target = {};

      // 구글 어널리틱스
      this.$ga.event("policyrecom_idx_" + realmcd, text, code); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

      // 중분류 셀렉트박스 변경시
      target = this.makeChartTargets(["grid1", "grid2"]); // 추천 계약 리스트 그리드 선택
      sessionStorage.setItem("idxcd", code);

      that.setTitle();

      this.title = text.replace("지수", "");
      this.drawCharts(target, this.setQuery);
    },

    /**
     * @description 지수 값이 가장 낮은 3분야 기준으로 막대 그래프 세팅하는 메소드
     */
    setBarTop3() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드

      return new Promise((resolve, reject) => {
        this.getData(this.titleOption["dataURL"], {
          ctycd: ctycd
        }).then(result => {
          const data = result["data"];

          data.reduce((acc, v, i) => {
            // 각 분야별 지수 bar 그래프 내용세팅
            that.poliRecomm[i].title = v.realm_nm;
            that.poliRecomm[i].realmcd = v.realm_cd;

            // 각 bar 그래프의 분야 코드 세팅
            that.poliRecomm[i].option.dataQuery.realmcd =
              result["data"][i].realm_cd;
          }, []);
          resolve(data);
        });
      });
    },

    /**
     * @description 대분류 셀렉트박스 생성하는 메소드
     */
    setSelectbox1() {
      // 구글 어널리틱스
      this.$ga.page("/report/policyRecommend");

      const that = this;
      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드

      return new Promise((resolve, reject) => {
        this.getData(this.selectOption1["dataURL"], {
          ctycd: ctycd,
          gcode: "realm",
          ban: "y"
        }).then(result => {
          const data = result["data"];

          that.selectboxs1.items = [];
          data.reduce((acc, v, i) => {
            const obj = {
              text: v["cd_nm"],
              value: v["code"]
            };

            that.selectboxs1.items.push(obj);

            // 첫 번째 리스트 선택
            if (i === 0) that.selectboxs1.select = obj;
          }, []);

          resolve();
        });
      });
    },

    /**
     * @description 중분류 셀렉트박스 생성하는 메소드
     * @param {String}  realmcd 대분류코드
     */
    setSelectbox2(realmcd) {
      // 구글 어널리틱스
      this.$ga.page("/report/policyRecommend");

      const that = this;
      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드

      return new Promise((resolve, reject) => {
        this.getData(this.selectOption2["dataURL"], {
          ctycd: ctycd,
          realmcd: realmcd
        }).then(result => {
          const data = result["data"];

          that.selectboxs2.items = [];
          data.reduce((acc, v, i) => {
            const obj = {
              text: v["idx_nm"],
              value: v["idx_cat"]
            };

            that.selectboxs2.items.push(obj);

            // 첫 번째 리스트 선택
            if (i === 0) {
              that.selectboxs2.select = obj;
              resolve(obj);
            }
          }, []);
        });
      });
    },

    /**
     * @description 인기검색어 배열 설정하는 베소드
     * @param {Array} data
     */
    setPopularIdx() {
      const that = this;
      const arr = this.popularSearches;
      const rootDOM = this.$el.getElementsByClassName("_popIdx")[0];
      const loadingBarDOM = rootDOM.getElementsByClassName("_loading_bar")[0];
      const defaultImageDOM = rootDOM.getElementsByClassName(
        "_default_image"
      )[0];
      const tableDOM = rootDOM.getElementsByTagName("table")[0];

      // defaultImageDOM.style.display = "block";
      // return;

      loadingBarDOM.style.display = "block";
      this.getData(this.popList["dataURL"], {
        poptype: "idx"
      }).then(result => {
        loadingBarDOM.style.display = "none";
        const data = result["data"];

        if (data.length === 0) {
          defaultImageDOM.style.display = "block";
          return;
        }

        tableDOM.style.visibility = "visible";

        arr.splice(0);

        data.reduce((acc, v, i) => {
          arr.push({
            key: i,
            name: v[1],
            idxCd: v[2],
            contractNo: v[3]
          });
        }, []);
      });
    },

    /**
     * @description 정책 클릭 수 배열 설정하는 베소드
     * @param {Array} data
     */
    setPolicyClicks() {
      const that = this;
      const arr = this.policyClicks;
      const rootDOM = this.$el.getElementsByClassName("_policyClick")[0];
      const loadingBarDOM = rootDOM.getElementsByClassName("_loading_bar")[0];
      const defaultImageDOM = rootDOM.getElementsByClassName(
        "_default_image"
      )[0];
      const rootTit = rootDOM.getElementsByClassName("_title")[0].innerText;
      const targetTD = rootDOM.getElementsByClassName("_name")[0];
      const allowLength = targetTD.offsetWidth / 15;
      const tableDOM = rootDOM.getElementsByTagName("table")[0];

      // defaultImageDOM.style.display = "block";
      // return;

      loadingBarDOM.style.display = "block";

      this.getData(this.popList["dataURL"], {
        poptype: "cont"
      }).then(result => {
        loadingBarDOM.style.display = "none";
        const data = result["data"];

        if (data.length === 0) {
          defaultImageDOM.style.display = "block";
          return;
        }

        tableDOM.style.visibility = "visible";

        arr.splice(0);

        data.reduce((acc, v, i) => {
          arr.push({
            key: i,
            name:
              v[1].length > allowLength
                ? v[1].substr(0, allowLength) + "..."
                : v[1],
            contractNo: v[2],
            count: v[3],
            callback: () => {
              // 구글 애널리틱스
              // that.$ga.event("policyrecom_contract_ " + rootTit, v[1], v[2]) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드
              that.$ga.event("policyrecom_contract", v[1], v[2]); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

              window.open(
                "http://www.g2b.go.kr:8067/contract/contList.jsp?searchType=2&v_pagesize=10&page_no=1&bu_name=TcontSearchCall&whakjung_bnumber=" +
                  v[2],
                ""
              );
            }
          });
        }, []);
      });
    },

    /**
     * @description title 설정하는 메소드
     */
    setTitle() {
      const that = this;
      const realmcd = sessionStorage.getItem("realmcd");
      const idxcd = sessionStorage.getItem("idxcd");
      const ctycd = sessionStorage.getItem("ctycd");

      this.getData(this.similarTitle["dataURL"], {
        realmcd: realmcd,
        idxcd: idxcd,
        ctycd: ctycd
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        that.title = data["title"];
      });
    },

    /**
     * @description offset 다시 설정하는 메소드
     * @param {Array} offsets fullpage 오프셋
     */
    resetOffsets(offsets) {
      this.offsets = offsets;
    }
  },

  created() {
    // 가장 상위의 정책 추천 분야 템플릿 세팅을 위한 데이터 설정
    this.poliRecomm[0]["option"] = this.barOptions1;
    this.poliRecomm[1]["option"] = this.barOptions2;
    this.poliRecomm[2]["option"] = this.barOptions3;

    window.addEventListener("resize", this.onResize); // resize 이벤트리스너 등록
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize); // resize 이벤트리스너 해제
  },

  mounted() {
    // 구글 어널리틱스
    const that = this;

    this.$ga.page("/report/policyRecommend");
    this.setPopularIdx();
    this.setPolicyClicks();
    this.setBarTop3().then(data => {
      const firstRealmCd = data[0]["realm_cd"];
      const firstRealmNm = data[0]["realm_nm"];

      // 대분류 설정
      that.setSelectbox1().then(() => {
        that.selectboxs1.select = {
          text: firstRealmNm,
          value: firstRealmCd
        };

        // 중분류 설정
        that.setSelectbox2(firstRealmCd).then(({ text = "", value = "" }) => {
          const target = this.makeChartTargets([
            "bar1",
            "bar2",
            "bar3",
            "grid1",
            "grid2",
            "grid3",
            "grid4"
          ]);

          sessionStorage.setItem("realmcd", firstRealmCd);
          sessionStorage.setItem("idxcd", value);
          that.setTitle();
          that.drawCharts(target, that.setQuery); // target에 포함된 차트들 그리기
          that.calcFullpageOffsets().then(offsets => (this.offsets = offsets)); // full-page offset 동적계산
        });
      });
    });
  }
};
</script>

<style scoped src="@/assets/css/policyRecommend.css"></style>
<style scoped></style>