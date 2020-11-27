<template>
  <div id="policyRecommendation">
    <!-- part1 start -->
    <div style="position:relative; width:100%; height:30%;">
      <!-- 정책추천 분야 start -->
      <p>
        <strong>정책 추천 분야</strong>
      </p>
      <div style="position:absolute; width:100%; height:calc(100% - 1em - 19px);">
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
      <!-- 정책추천 분야 end -->
    </div>
    <!-- part1 end -->

    <!-- part2 start -->
    <div style="position:relative; width:100%; height:calc(70% - 1em); overflow-y:auto;">
      <!-- 분야별 주요 키워드 및 세부사업 자료 start -->
      <p>
        <strong>분야별 주요 키워드 및 세부사업 자료</strong>
      </p>
      <div style="position:relative; width:100%; height:calc(100% - 2em - 19px);">
        <div style="position:absolute; width:40%; height:100%;">
          <span>주요 키워드 간 관계도</span>
          <mindmap :options="mindmapOptions" ref="mindmap1" style="height: calc(100% - 19px);"></mindmap>
        </div>
        <div style="position:absolute; left:40%; width:60%; height:100%;">
          <div style="position:absolute; width:100%; height:45%;">
            <span>추천정책 - 요즘 빈번한 주제</span>
            <grid1 :options="gridOptions1" ref="grid1" style="height: calc(100% - 19px);"></grid1>
          </div>
          <div style="position:absolute; top:50%; width:100%; height:45%;">
            <span>추천정책 - 유사 지자체에서 많이 수행한 주제</span>
            <grid2 :options="gridOptions2" ref="grid2" style="height: calc(100% - 38px);"></grid2>
          </div>
        </div>
      </div>
      <!-- 분야별 주요 키워드 및 세부사업 자료 end -->

      <!-- 분야별 주요 키워드 및 세부사업 자료 start -->
      <p>
        <strong>분야별 주요 키워드 및 세부사업 자료</strong>
      </p>
      <div style="position:relative; width:100%; height:calc(100% - 2em - 19px);">
        <div style="position:absolute; width:60%; height:100%;">
          <div style="position:absolute; width:100%; height:45%;">
            <span>관련 공공 데이터</span>
            <grid3 :options="gridOptions3" ref="grid3" style="height: calc(100% - 19px);"></grid3>
          </div>
          <div style="position:absolute; top:50%; width:100%; height:45%;">
            <span>관련 공공 데이터</span>
            <grid4 :options="gridOptions4" ref="grid4" style="height: calc(100% - 38px);"></grid4>
          </div>
        </div>
        <div style="position:absolute; left:60%; width:40%; height:100%;"></div>
      </div>
      <!-- 분야별 주요 키워드 및 세부사업 자료 end -->
    </div>
    <!-- part2 end -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Bar from "@/components/chart/bar/bar";
import Mindmap from "@/components/chart/mindmap/mindmap";
import Grid1 from "@/components/grid/grid";
import Grid2 from "@/components/grid/grid";
import Grid3 from "@/components/grid/grid";
import Grid4 from "@/components/grid/grid";

export default {
  data: function() {
    return {};
  },

  components: {
    bar: Bar,
    mindmap: Mindmap,
    grid1: Grid1,
    grid2: Grid2,
    grid3: Grid3,
    grid4: Grid4
  },

  computed: {
    ...mapState("chartstore", {
      barOptions1: "bar6",
      barOptions2: "bar7",
      barOptions3: "bar8",
      mindmapOptions: "mindmap"
    }),
    ...mapState("gridstore", {
      gridOptions1: "grid5",
      gridOptions2: "grid6",
      gridOptions3: "grid7",
      gridOptions4: "grid8"
    })
  },

  methods: {
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
#policyRecommendation {
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