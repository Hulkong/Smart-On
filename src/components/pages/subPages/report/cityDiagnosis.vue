<template>
  <div id="cityDiagnosis">
    <!-- part1 start -->
    <div style="position:relative; width:100%; height:20%;">
      <!-- 분야별 세출(예산) 현황 start -->
      <p>
        <strong>분야별 세출(예산) 현황</strong>
      </p>
      <div style="position:absolute; top:2em; width:100%; height:calc(100% - 2em);">
        <horizontal-bubble
          :options="horizontalBubbleOptions"
          @trigger="clickCircle"
          ref="horizontalBubble1"
        ></horizontal-bubble>
      </div>
      <!-- 분야별 세출(예산) 현황 end -->
    </div>
    <!-- part1 end -->

    <!-- part2 start -->
    <div style="position:relative; width:100%; height:calc(80% - 1em); overflow-y:auto;">
      <!-- sub-part1 start -->
      <div style="position:relative; width:100%; height:100%;">
        <!-- 분야별 주요 지표 start -->
        <p>
          <strong>분야별 주요 지표</strong>
        </p>
        <div style="position:absolute; top:2em; width:100%; height:calc(100% - 2em);">
          <div style="position:absolute; width:60%; height:100%;">
            <radar :options="radarOptions" ref="radar1"></radar>
          </div>
          <div style="position:absolute; left:60%; width:40%; height:100%;">
            <vertical-table @trigger="changeSelectBox"></vertical-table>
          </div>
        </div>
        <!-- 분야별 주요 지표 end -->
      </div>
      <!-- sub-part1 end -->

      <!-- sub-part2 start -->
      <div style="position:relative; width:100%; height:100%;">
        <!-- 공공질서 및 안전 분야 진단 start -->
        <p>
          <strong>공공질서 및 안전 분야 진단</strong>
        </p>
        <div style="position:absolute; top:2em; width:100%; height:calc(100% - 2em);">
          <div style="position:relative; width:100%; height:50%;">
            <span>일자별 집행률 그래프</span>
            <historical-price
              :options="historicalPriceOptions"
              ref="historicalPrice1"
              style="height: calc(100% - 1em);"
            ></historical-price>
          </div>
          <div style="position:absolute; top:50%; width:100%; height:50%;">
            <span>공공질서 및 안전 계약 키워드</span>
            <div style="position:absolute; width:50%; height:calc(100% - 2em);">
              <div style="position:absolute; width:50%; height:100%;">
                <wordcloud :options="wordcloudOptions" ref="wordcloud1"></wordcloud>
              </div>
              <div
                style="position:absolute; left:50%; width:50%; height:calc(100% - 70px); margin-top:70px;"
              >
                <grid :options="gridOptions" ref="grid1"></grid>
              </div>
            </div>
            <div style="position:absolute; left:50%; width:50%; height:calc(100% - 2em);">
              <div style="position:absolute; width:33.3%; height:100%;">
                <bar :options="barOptions1" ref="ba1"></bar>
              </div>
              <div style="position:absolute; left:33.3%; width:33.3%; height:100%;">
                <bar :options="barOptions2" ref="ba2"></bar>
              </div>
              <div style="position:absolute; left:66.6%; width:33.3%; height:100%;">
                <bar :options="barOptions3" ref="ba3"></bar>
              </div>
            </div>
          </div>
        </div>
        <!-- 공공질서 및 안전 분야 진단 start -->
      </div>
      <!-- sub-part2 end -->

      <!-- sub-part3 start -->
      <div style="width:100%; height:100%; position:relative;">
        <p>
          <strong>공공질서 및 안전 분야 진단</strong>
        </p>
        <vworld></vworld>
      </div>
      <!-- sub-part3 end -->
    </div>
    <!-- part2 end -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import HorizontalBubble from "@/components/chart/horizontalBubble/horizontalBubble";
import Radar from "@/components/chart/radar/radar";
import VerticalTable from "@/components/table/table";
import HistoricalPrice from "@/components/chart/historicalPrice/historicalPrice";
import Wordcloud from "@/components/chart/wordcloud/wordcloud";
import Grid from "@/components/grid/grid";
import Bar from "@/components/chart/bar/bar";
import Vworld from "@/components/map/vworld/leaflet";

export default {
  data() {
    return {};
  },

  components: {
    "horizontal-bubble": HorizontalBubble,
    radar: Radar,
    "vertical-table": VerticalTable,
    "historical-price": HistoricalPrice,
    wordcloud: Wordcloud,
    grid: Grid,
    bar: Bar,
    vworld: Vworld
  },

  computed: {
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
    })
  },

  methods: {
    /**
     * @description 수평 원차트 클릭 트리거 이벤트
     */
    clickCircle() {
      const obj = {}; // 레퍼런스 중 page2에 해당하는 컴포넌트 담을 변수
      for (let name in this.$refs) {
        const component = this.$refs[name];
        const options = component.options;

        // horizontalBubble 컴포넌트 제외 모든 컴포넌트 할당
        if (name !== "horizontalBubble1") {
          obj[name] = component;
        }
      }

      this.drawCharts(obj);
    },

    /**
     * @description 오른쪽 셀렉트박스 변경시 radar차트 변경하는 메소드
     */
    changeSelectBox() {
      this.drawCharts({ radar1: this.$refs["radar1"] });
    },

    /**
     * @description 특정 레펀러스에 바인딩된 차트(그리드포함) 그림
     * @param {Object references} $ref 설정된 컴포넌트들
     */
    drawCharts(references) {
      const ctycd = this.$route.query.ctycd; // 지역코드
      const sdate = this.$route.query.sdate; // 기준 시작날짜
      const edate = this.$route.query.edate; // 기준 마지막날짜

      //  refs 컴포넌트 루프
      for (let name in references) {
        const component = references[name]; // 특정 컴포넌트
        const options = component.options;
        const clean = options.clean; // 정제콜백함수
        const query = options.dataQuery; // 쿼리스트링 객체
        let url = options.dataURL; // 데이터 호출 url

        // 쿼리스트링 객체 세팅
        for (let key in query) {
          // 시군구코드
          if (key === "ctycd") {
            query[key] = ctycd;
          }

          // 기준 시작날짜
          if (key === "sdate") {
            query[key] = sdate;
          }

          // 기준 마지막날짜
          if (key === "edate") {
            query[key] = edate;
          }

          // 최신날짜
          if (key === "date" && !query[key]) {
            query[key] = edate;
          }
        }

        // 데이터 가져옴
        this.getData(url, query).then(result => {
          const cleanData = clean(result["data"]); // 정제된 데이터 배열

          component.remove(); // 컴포넌트에 등록되 차트 제거하기
          component.draw(cleanData, options); // 컴포넌트에 등록된 차트그리기
        });
      }
    }
  },

  created() {},

  mounted() {
    this.drawCharts(this.$refs);
  }
};
</script>

<style scoped>
#cityDiagnosis {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

p {
  margin: 1em;
}

span {
  margin: 2em;
}
</style>