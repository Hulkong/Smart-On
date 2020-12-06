<template>
  <div id="cityDiagnosis" @wheel="handleMouseWheel($event, evntAfterWheel)">
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
    <v-container id="bubbles-area-top" fluid class="pa-0 ma-0 fullpage">
      <v-layout class="_parent_layout _parent1" align-center justify-space-between wrap>
        <v-flex md12 class="_layout1">
          분야별 지출 현황
          <img
            class="_question"
            @mouseenter="openQuestionPopup"
            @mouseleave="closeQuestionPopup"
            :src="getImageUrl('common/question_16px.png')"
            alt
          />
          <popup-question
            :title="getTitle('cityDiagnosis1')"
            :contents="getContents('cityDiagnosis1')"
            :position="getPosition('cityDiagnosis1')"
          ></popup-question>
        </v-flex>
        <v-flex md12 class="_layout2 bubbles-area">
          <horizontal-bubble
            :options="horizontalBubbleOptions"
            @trigger="horizenEvnt"
            ref="horizontalBubble1"
          ></horizontal-bubble>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- 컨테이너2 -->
    <v-container fluid class="pa-0 ma-0">
      <v-layout class="_parent_layout _parent2" align-center justify-space-between wrap>
        <v-flex fill-height class="_round" style="background:white;">
          <v-flex md12 class="_layout1">
            분야별 주요 지표
            <img
              class="_question"
              @mouseenter="openQuestionPopup"
              @mouseleave="closeQuestionPopup"
              :src="getImageUrl('common/question_16px.png')"
              alt
            />
            <popup-question
              :title="getTitle('cityDiagnosis2')"
              :contents="getContents('cityDiagnosis2')"
              :position="getPosition('cityDiagnosis2')"
            ></popup-question>
          </v-flex>
          <v-flex md12 class="_layout2 _layout_graph">
            <v-layout align-start justify-space-between fill-height wrap>
              <v-flex md7 style="height:calc(100% - 26px);">
                <radar :options="radarOptions" ref="radar1"></radar>
              </v-flex>
              <v-flex md5 style="height:calc(100% - 26px);">
                <vertical-table @trigger="vertTbeEvnt"></vertical-table>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- 컨테이너2 -->

    <!-- 컨테이너3 -->
    <v-container id="publics-safety-diagnosis" fluid class="pa-0 ma-0 fullpage">
      <v-layout class="_parent_layout _parent3" align-center justify-space-between wrap>
        <v-flex md12 class="_text _title _top_round_small">{{ selectBubble.text}}</v-flex>
        <v-flex md12 class="_contents _layout_contents _right_round _bottom_round">
          <v-flex class="_top" style="height:50%;">
            <v-flex class="_layout2 _text" style="line-height:24px;">
              <span>일자별 지출 현황 그래프</span>
              <span class="_stdr_date">({{dataStandardDate ? dataStandardDate : ""}})</span>
              <img
                class="_question"
                @mouseenter="openQuestionPopup"
                @mouseleave="closeQuestionPopup"
                :src="getImageUrl('common/question_16px.png')"
                alt
              />
              <popup-question
                :title="getTitle('cityDiagnosis3')"
                :contents="getContents('cityDiagnosis3')"
                :position="getPosition('cityDiagnosis3')"
              ></popup-question>
            </v-flex>
            <v-flex class="_layout3" style="height: calc(100% - 24px)">
              <historical-price :options="historicalPriceOptions" ref="historicalPrice1"></historical-price>
            </v-flex>
          </v-flex>
          <v-flex class="_bottom" style="height:50%; padding-top:26px;">
            <v-layout style="height:24px;">
              <v-flex md12 class="_layout4 _text">
                <p>
                  <span>계약 키워드 및 주요 지표</span>
                  <span class="_stdr_date">({{dataStandardDate ? dataStandardDate : ""}})</span>
                  <img
                    class="_question"
                    @mouseenter="openQuestionPopup"
                    @mouseleave="closeQuestionPopup"
                    :src="getImageUrl('common/question_16px.png')"
                    alt
                  />
                  <popup-question
                    :title="getTitle('cityDiagnosis4')"
                    :contents="getContents('cityDiagnosis4')"
                    :position="getPosition('cityDiagnosis4')"
                  ></popup-question>
                </p>
              </v-flex>
            </v-layout>
            <v-flex style="height: calc(100% - 24px)">
              <v-layout align-start justify-space-between fill-height wrap>
                <v-flex md3 class="_layout5 _layout__world" fill-height style>
                  <wordcloud :options="wordcloudOptions" ref="wordcloud1"></wordcloud>
                </v-flex>
                <v-flex md3 class="_layout6 _layout_graph" fill-height>
                  <grid :options="gridOptions" ref="grid1"></grid>
                </v-flex>
                <v-flex
                  md2
                  fill-height
                  v-for="(item, index) in idxRanks"
                  :key="index"
                  :class="item.className"
                >
                  <p class="idx-bar-title">{{item.name}}</p>
                  <v-flex style="height:calc(100% - 44px); padding:0 5px;">
                    <bar :options="item.options" :ref="item.ref"></bar>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-flex>
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
import HorizontalBubble from "@/components/chart-horizontal-bubble";
import Radar from "@/components/chart-radar";
import TableVertical from "@/components/table-vertical";
import HistoricalPrice from "@/components/chart-historical-price";
import Wordcloud from "@/components/chart-wordcloud";
import Grid from "@/components/grid";
import Bar from "@/components/chart-bar-type1";
import Vworld from "@/components/map-vworld-leaflet";
import PopupQuestion from "@/components/popup-question-type2"; // question 팝업 컴포넌트

export default {
  name: "cityDiagnosis",
  data() {
    return {
      isTop: false, // 현재 TOP 위치에 있는지 여부
      selectBubble: {
        text: "",
        index: 0
      },
      activePage: 0,
      offsets: [],
      idxRanks: [
        {
          name: "",
          value: "",
          options: undefined,
          className: "_layout7",
          ref: "bar1"
        },
        {
          name: "",
          value: "",
          options: undefined,
          className: "_layout8",
          ref: "bar2"
        },
        {
          name: "",
          value: "",
          options: undefined,
          className: "_layout9",
          ref: "bar3"
        }
      ],
      dataStandardDate: null
    };
  },

  components: {
    "horizontal-bubble": HorizontalBubble,
    radar: Radar,
    "vertical-table": TableVertical,
    "historical-price": HistoricalPrice,
    wordcloud: Wordcloud,
    grid: Grid,
    bar: Bar,
    vworld: Vworld,
    "popup-question": PopupQuestion // 질문 팝업창 컴포넌트
  },

  computed: {
    ...mapState("commonstore", ["realmIdxTop3", "diagnoseStdrPeriod"]),
    ...mapState("chartstore", {
      horizontalBubbleOptions: "horizontalBubble",
      radarOptions: "radar",
      historicalPriceOptions: "historicalPrice",
      wordcloudOptions: "wordcloud3",
      barOptions1: "bar3",
      barOptions2: "bar4",
      barOptions3: "bar5"
    }),
    ...mapState("gridstore", {
      gridOptions: "grid4"
    }),
    ...mapGetters("questionstore", ["getTitle", "getContents", "getPosition"])
  },

  methods: {
    /**
     * @description SQL 파라미터 설정하는 메소드
     * @param {Object} query
     * @param {String} name
     */
    setQuery(query, name) {
      if (!query) return;

      if (!name) return;

      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드
      const realmcd = sessionStorage.getItem("realmcd"); // 분야코드
      const endDate = sessionStorage.getItem("end_date"); // 데이터 기준 마지막 일자
      const rootDomId = this.$options.name;

      // 쿼리스트링 객체 세팅
      for (let key in query) {
        // 시군구코드
        if (key === "ctycd") {
          query[key] = ctycd;
        }

        // 분야코드
        if (key === "realmcd") {
          query[key] = realmcd;
        }

        // 데이터 기준 마지막 일자
        if (key === "stdrdt") {
          query[key] = endDate;
        }

        // 지수 1순위
        if (key === "ixdcat" && name === "bar1") {
          const value = this.idxRanks[0].value;
          query[key] = value ? value : "";
        }

        // 지수 2순위
        if (key === "ixdcat" && name === "bar2") {
          const value = this.idxRanks[1].value;
          query[key] = value ? value : "";
        }

        // 지수 3순위
        if (key === "ixdcat" && name === "bar3") {
          const value = this.idxRanks[2].value;
          query[key] = value ? value : "";
        }
      }

      return query;
    },

    /**
     * @description TOP버튼 클릭 이벤트
     */
    clickTop() {
      this.isTop = false; // TOP버튼 숨김
      this.activePage = 0; // 활성화 페이지 초기화
      this.moveScroll(0);
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
     * @description 휠 이벤트 발생시 수평버블차트 active/inactive 컨트롤
     * @param {Number} pageIndex 현재 활성화된 페이지 번호
     */
    evntAfterWheel(pageIndex) {
      const scrollTop = document.scrollingElement
        ? document.scrollingElement.scrollTop
        : document.body.scrollTop;

      // 자식 컴포넌트 트리거 이벤트 호출(추후 다른 방법으로 로직 변경)
      this.$refs["horizontalBubble1"].evntFromParent(
        pageIndex,
        this.selectBubble.index
      );

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
     * @description 수평버블 차트 이벤트 버스 리스너
     * @param {Object} param 자식 컴포넌트에서 전송된 파라미터
     */
    horizenEvnt(param) {
      const that = this;
      const realmCd = param.realmCd; // 분야 코드
      const ctyCd = sessionStorage.getItem("ctycd"); // 시군구코드
      const activePage = param.activePage;

      this.moveScroll(this.offsets[activePage]); // 스크롤 이동
      this.selectBubble = param.selectBubble; // 선택된 분야 설정
      this.activePage = activePage; // 활성화 페이지 초기화

      // 세션스토리지에 선택된 분야 설정
      sessionStorage.setItem("realmcd", realmCd);

      if (activePage > 0) {
        this.isTop = true;
      } else {
        this.isTop = false;
      }

      // 지수순위 배열 설정
      this.setIdxRanks(realmCd, ctyCd).then(() => {
        const target = that.makeChartTargets([
          "historicalPrice1",
          "wordcloud1",
          "grid1",
          "bar1",
          "bar2",
          "bar3"
        ]);
        that.drawCharts(target, that.setQuery); // 특정 차트 그림
      });
    },

    /**
     * @description vertical-table 이벤트발생시 radar차트 변경하는 메소드
     * @param {Object} param 적용시킬 값
     */
    vertTbeEvnt(param) {
      const component = this.$refs["radar1"];

      // 유사 지자체 지수 적용
      component.changeValue(1, {
        code: param.parentcd, // 대분류 코드
        value: param.idx_simr_value, // 변경시킬 값
        key: "idx_simr_value"
      });

      // 지수 적용
      component.changeValue(0, {
        code: param.parentcd, // 대분류 코드
        value: param.idx_value, // 변경시킬 값
        key: "idx_value"
      });

      // 전국 지수 적용
      const cleanData = component.changeValue(2, {
        code: param.parentcd, // 대분류 코드
        value: param.idx_all_value, // 변경시킬 값
        key: "idx_all_value"
      });

      component.remove(); // 차트 삭제
      component.draw(cleanData, component.options); // 차트 그림
    },

    /**
     * @description 지수등급 배열 설정하는 메소드
     * @param {String} realmCd 분야코드
     * @param {String} ctyCd 시군구코드
     */
    setIdxRanks(realmCd, ctyCd) {
      const that = this;
      return new Promise((resolve, reject) => {
        that
          .getData(that.realmIdxTop3["dataURL"], {
            realmcd: realmCd,
            ctycd: ctyCd
          })
          .then(result => {
            let data = result["data"];

            const dataLength = data.length;

            // 데이터는 무조건 3개 이상 존재해야 하기 때문에 값이 없을 경우 디폴트 값 만들어 줌
            if (dataLength < 3) {
              for (let i = 0; i < 3 - dataLength; i++) {
                data.push({
                  idx_nm: "",
                  idx_cat: 9999
                });
              }
            }

            // 데이터 내림차순 정렬
            data.sort((a, b) => b.value - a.value);
            data.reduce((acc, v, i) => {
              // 분야별 주요지표 상위 3개 지표 데이터 세팅
              if (i < 3) {
                that.idxRanks[i].name = data[i]["idx_nm"];
                that.idxRanks[i].value = data[i]["idx_cat"];
              }
            }, []);

            resolve();
          });
      });
    },
    resetOffsets(offsets) {
      this.offsets = offsets;
    }
  },

  created() {
    this.idxRanks[0].options = this.barOptions1;
    this.idxRanks[1].options = this.barOptions2;
    this.idxRanks[2].options = this.barOptions3;

    window.addEventListener("resize", this.onResize); // resize 이벤트리스너 등록
  },

  destroyed() {
    window.removeEventListener("resize", this.onResize); // resize 이벤트리스너 해제
  },

  mounted() {
    // 구글 어널리틱스
    this.$ga.page("/report/cityDiagnosis");

    const that = this;
    const ctycd = sessionStorage.getItem("ctycd"); // 지역코드

    // 분야별 세출(예산) 현황 그래프 데이터 바인딩
    this.getData(this.horizontalBubbleOptions["dataURL"], {
      ctycd: ctycd
    }).then(result => {
      let data = result["data"];
      if (data.length === 0) return;

      const realmCd = data[0]["realm_cd"]; // 분야코드
      const cdNm = data[0]["realm_nm"]; // 분야코드
      const ctyCd = sessionStorage.getItem("ctycd"); // 시군구코드

      // 가장 값이 큰(맨 앞) 분야 선택
      that.selectBubble = {
        text: cdNm,
        index: 0
      };

      sessionStorage.setItem("realmcd", realmCd);

      this.setIdxRanks(realmCd, ctyCd).then(() => {
        const target = that.makeChartTargets(["bar1", "bar2", "bar3"]);
        that.drawCharts(target, that.setQuery); // 특정 차트 그림
      });

      const target = that.makeChartTargets([
        "horizontalBubble1",
        "radar1",
        "historicalPrice1",
        "wordcloud1",
        "grid1"
      ]);

      // that.makeBubbleArr(data); // 버블 배열데이터 생성
      that.drawCharts(target, that.setQuery); // target에 포함된 차트들 그리기

      this.getData(this.diagnoseStdrPeriod["dataURL"], {
        ctycd: ctycd,
        realmcd: realmCd
      }).then(result => {
        const data = result["data"];
        that.dataStandardDate = data["sdate"] + " ~ " + data["edate"];
      });

      that.calcFullpageOffsets().then(offsets => {
        this.offsets = offsets;
      }); // full-page offset 동적계산
    });
  }
};
</script>

<style scoped src="@/assets/css/cityDiagnosis.css"></style>
<style scoped></style>