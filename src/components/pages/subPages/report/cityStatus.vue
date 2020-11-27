/**
  @description: 도시현황 컴포넌트
  @childComponents: page1, page2, page3
 */
<template>
  <div id="cityStatus" @wheel="fixTimeseries($event)">
    <!-- part1 start -->
    <div style="position:relative; width:100%; height:100%;">
      <div style="position:relative; width:100%; height:35%;">
        <div style="position:absolute; width:50%; height:100%;">
          <div id="basicStatus" style="position:absolute; width:50%; height:100%;">
            <p>
              <strong>기본 현황</strong>
            </p>
            <p>인구: {{ numberWithCommas(topLeft.popltn) }} (단위:명)</p>
            <p>면적: {{ numberWithCommas(topLeft.region_area) }}(단위:제곱미터)</p>
            <p>GRDP: {{ numberWithCommas(topLeft.grdp) }} ({{ topLeft.grdp_year }}) (단위:수)</p>
            <p>재정규모: {{ numberWithCommas(topLeft.fnanc_scale) }} (단위:만원)</p>
            <p>행정동 수: (단위:개)</p>
          </div>
          <div style="position:absolute; left:50%; width:50%; height:100%;">
            <p>
              <strong>홈페이지</strong>
            </p>
            <a :href="topLeft.home_link" target="_blank">
              <img src="/src/assets/images/default/joongu.png" alt width="85%" height="75%" />
            </a>
          </div>
        </div>
        <div style="position:absolute; left:50%; width:50%; height:100%;">
          <p>
            <strong>자치단체장</strong>
          </p>
          <div style="position:absolute; width:50%; height:calc(100% - 2em);">
            <p>이름: {{ topRight.boss_nm }}</p>
            <p>소속: {{ topRight.boss_group }}</p>
            <p>경력:</p>
            <p v-for="(item, index) in topRight.resm" :key="index">{{item}}</p>
          </div>
          <div style="position:absolute; left:50%; width:50%; height:calc(100% - 2em);">
            <img src="/src/assets/images/default/seoyangho.png" alt width="100%" height="80%" />
          </div>
        </div>
      </div>
      <div style="position:relative; width:100%; height:65%;">
        <div style="position:absolute; width:50%; height:100%;">
          <p>
            <strong>인구 피라미드</strong>
          </p>
          <span>연령대별 주민등록인구 인구 피라미드</span>
          <pyramid :options="pyramidOptions" ref="pyramid1" style="height: calc(100% - 2em - 38px)"></pyramid>
        </div>
        <div style="position:absolute; left:50%; width:50%; height:100%;">
          <p>
            <strong>산업구조</strong>
          </p>
          <span>산업별 GRDP or 사업체 종사자 수</span>
          <treemap :options="treemapOptions" ref="treemap1" style="height: calc(100% - 2em - 38px)"></treemap>
        </div>
      </div>
    </div>
    <!-- part1 end -->

    <!-- part2 start -->
    <div style="position:relative; width:100%; height:100%;">
      <!-- timeseries-area-top start -->
      <div id="timeseries-area-top" style="position:absolute; width:100%; height:20%;">
        <!-- 기간선택 start -->
        <p>
          <strong>기간선택</strong>
        </p>
        <timeseries
          :options="timeseriesOptions"
          @trigger="chagedTimeseries"
          ref="timeseries1"
          style="height: calc(100% - 2em - 19px)"
        ></timeseries>
        <!-- 기간선택 end -->
      </div>
      <!-- timeseries-area-top start -->

      <!-- timeseries-area-bottom start -->
      <div id="timeseries-area-bottom" style="position:absolute; top:20%; width:100%; height:80%;">
        <!-- 예산 및 사업현황 start -->
        <div style="position:relative; width:100%; height:100%;">
          <div style="position:absolute; width:100%; height:50%;">
            <div style="position:absolute; width:50%; height:100%;">
              <p>
                <strong>예산 및 사업현황</strong>
              </p>
              <div style="position:absolute; width:50%; height:calc(100% - 2em - 19px);">
                <span>분야별 예산 현황(세출현황)</span>
                <span style="font-size: 11px;">행안부 지방재정365</span>
                <space :options="spaceOptions" ref="space1" style="height: calc(100% - 38px)"></space>
              </div>
              <div style="position:absolute; left:50%; width:50%; height:calc(100% - 2em - 19px);">
                <div style="height: calc(100% - 95px); margin-top: 95px;">
                  <p
                    v-for="(item, index) in budgetBS"
                    :key="item.index"
                  >{{ item.realm_nm }}: {{ numberWithCommas(item.budgetTot) }}</p>
                </div>
              </div>
            </div>

            <div style="position:absolute; left:50%; width:50%; height:100%;">
              <div
                style="position:absolute; width:50%; top:calc(2em + 19px); height:calc(100% - 2em - 19px);"
              >
                <span>사업 키워드(기간)</span>
                <br />
                <span style="font-size: 11px;">행안부 지방재정 365 내 세부사업명 텍스트 마이닝</span>
                <wordcloud
                  :options="wordcloudOptions1"
                  ref="wordcloud1"
                  style="height: calc(100% - 38px)"
                ></wordcloud>
              </div>
              <div
                style="position:absolute; top:calc(2em + 19px); left:50%; width:50%; height:calc(100% - 2em - 19px);"
              >
                <div style="height: calc(100% - 95px); margin-top: 95px;">
                  <p>WORDCLOUD: 13건</p>
                  <p>TAG: 9건</p>
                  <p>CLOUD: 8건</p>
                </div>
              </div>
            </div>
          </div>

          <div style="position:absolute; top:50%; width:100%; height:50%;">
            <div style="position:absolute; width:100%; height:85%;">
              <span>집행된 세부 사업(기간)</span>
              <br />
              <span style="font-size: 11px;">행정안전부 지방재정365(일자별 업데이트)</span>
              <grid :options="gridOptions1" ref="grid1" style="height: calc(100% - 57px)"></grid>
            </div>
          </div>
        </div>
        <!-- 예산 및 사업현황 end -->

        <!-- 조달계약 현황 start -->
        <div style="position:relative; width:100%; height:100%;">
          <div style="position:absolute; width:100%; height:50%;">
            <p>
              <strong>조달계약 현황</strong>
            </p>
            <div style="position:absolute; width:50%; height:calc(100% - 1em - 38px);">
              <span>조달계약 키워드</span>
              <div style="position:absolute; width:30%; height: calc(100% - 19px);">
                <wordcloud :options="wordcloudOptions2" ref="wordcloud2"></wordcloud>
              </div>
              <div style="position:absolute; left:30%; width:70%; height: calc(100% - 19px);">
                <div style="position:absolute; width:100%; height:50%;">
                  <bar :options="barOptions1" ref="bar1"></bar>
                </div>
                <div style="position:absolute; top:50%; width:100%; height:50%;">
                  <bar :options="barOptions2" ref="bar2"></bar>
                </div>
              </div>
            </div>

            <div style="position:absolute; left:50%; width:50%; height:calc(95% - 1em - 38px);">
              <span>우수 계약 업체</span>
              <grid :options="gridOptions2" ref="grid2" style="height: calc(100% - 19px)"></grid>
            </div>
          </div>

          <div style="position:absolute; top:50%; width:100%; height:50%;">
            <div style="position:absolute; width:100%; height:95%;">
              <span>조달 계약 리스트</span>
              <grid :options="gridOptions3" ref="grid3" style="height: calc(100% - 19px)"></grid>
            </div>
          </div>
        </div>
        <!-- 조달계약 현황 end -->
      </div>
      <!-- timeseries-area-bottom end -->
    </div>
    <!-- part2 end -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Pyramid from "@/components/chart/pyramid/pyramid";
import Treemap from "@/components/chart/treemap/treemap";
import Timeseries from "@/components/chart/timeseries/timeseries";
import Space from "@/components/chart/space/space";
import Wordcloud from "@/components/chart/wordcloud/wordcloud";
import Grid from "@/components/grid/grid";
import Bar from "@/components/chart/bar/bar";

export default {
  name: "cityStatus",

  data() {
    return {
      // 기본현황 데이터
      topLeft: {
        popltn: "", // 인구
        region_area: "", // 면적
        grdp: "", // GRDP
        grdp_year: "", // GRDP 년도
        fnanc_scale: "", // 재정규모
        home_link: "" // 홈페이지 링크
      },

      // 자치단체장
      topRight: {
        boss_nm: "", // 이름
        boss_group: "", // 소속
        resm: [] // 경력
      },

      budgetBS: [] // 예산 및 사업현황 top3
    };
  },

  components: {
    pyramid: Pyramid, // 인구 피라미드 컴포넌트
    treemap: Treemap, // 산업구조 컴포넌트
    timeseries: Timeseries,
    space: Space,
    wordcloud: Wordcloud,
    grid: Grid,
    bar: Bar
  },

  computed: {
    //차트 스토어
    ...mapState("chartstore", {
      pyramidOptions: "pyramid",
      treemapOptions: "treemap",
      timeseriesOptions: "timeseries",
      spaceOptions: "space",
      wordcloudOptions1: "wordcloud1",
      wordcloudOptions2: "wordcloud2",
      barOptions1: "bar1",
      barOptions2: "bar2"
    }),

    ...mapState("gridstore", {
      gridOptions1: "grid1",
      gridOptions2: "grid2",
      gridOptions3: "grid3"
    }),
    // 공통 스토어
    ...mapState("commonstore", ["basicStatus", "selfGovernment"])
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
    },

    /**
     * @description 기본현황 데이터 바인딩
     * @param {Object} data 서버데이터
     */
    setTopLeft(data) {
      if (data.length === 0) return;

      const that = this;
      Object.keys(data).forEach(key => {
        if (that.$data.topLeft[key] === "") that.$data.topLeft[key] = data[key];
      });
    },

    /**
     * @description 자치단체장 데이터 바인딩
     * @param {Object} data 서버데이터
     */
    setTopRight(data) {
      if (data.length === 0) return;

      const that = this;

      if (Array.isArray(data)) {
        for (let i = 0, max = data.length; i < max; i++) {
          that.$data.topRight["resm"][i] = data[i]["resm"];
        }
      } else {
        Object.keys(data).forEach(key => {
          if (that.$data.topRight[key] === "")
            that.$data.topRight[key] = data[key];
        });
      }
    },

    /**
     *  @description 예산 및 사업현황 top3 설정하는 메소드
     */
    setBudgetBSTop3(data) {
      if (data.length === 0) return;
      this.$data.budgetBS = data.filter((d, i) => i < 3);
    },

    /**
     * @description 기간선택시 트리거 이벤트
     */
    chagedTimeseries() {
      const obj = {}; // 레퍼런스 중 page2에 해당하는 컴포넌트 담을 변수
      for (let name in this.$refs) {
        const component = this.$refs[name];
        const options = component.options;

        // page1 제외
        if (options.pageLoc !== "page1") {
          // 기간선택 제외
          if (name !== "timeseries1") {
            obj[name] = component;
          }
        }
      }

      this.drawCharts(obj);
    },

    fixTimeseries(event) {
      const timeseriesTop = document.getElementById("timeseries-area-top");
      const timeseriesBottom = document.getElementById(
        "timeseries-area-bottom"
      );
      const target = document.getElementById("cityStatus");

      // 마우스휠 다운
      if (event.deltaY > 0) {
        if (target.scrollTop >= target.offsetHeight) {
          target.style["overflow-y"] = "hidden";
          timeseriesTop.style.position = "fixed";
          timeseriesTop.style.top = "80px";
          timeseriesBottom.style["overflow-y"] = "auto";
        }
        // 마우스휠 업
      } else {
        if (timeseriesBottom.scrollTop === 0) {
          target.style["overflow-y"] = "auto";
          timeseriesTop.style.position = "absolute";
          timeseriesTop.style.top = "";
          timeseriesBottom.style["overflow-y"] = "hidden";
        }
      }
    }
  },

  created() {},

  mounted() {
    const that = this;
    const ctycd = this.$route.query.ctycd;
    const sdate = this.$route.query.sdate;
    const edate = this.$route.query.edate;

    // 기본현황 데이터 호출 및 세팅
    this.getData(this.basicStatus["dataURL"] + ctycd).then(result => {
      that.setTopLeft(result["data"][0]);
      that.setTopRight(result["data"][0]);
    });

    // 지방단체장 데이터 호출 및 세팅
    this.getData(this.selfGovernment["dataURL"], { ctycd: ctycd }).then(
      result => that.setTopRight(result["data"])
    );

    // 분야별 예산 현황 데이터 호출 및 그리기
    this.getData(this.spaceOptions["dataURL"], {
      ctycd: ctycd,
      sdate: sdate,
      edate: edate
    }).then(result => {
      that.setBudgetBSTop3(result["data"]); // top3 데이터 세팅
    });

    this.drawCharts(this.$refs);
  }
};
</script>

<style scoped>
#cityStatus {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

p {
  margin: 1em;
}

span {
  margin: 2em;
}
</style>