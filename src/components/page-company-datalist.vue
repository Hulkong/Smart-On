<template>
  <div id="data-list">
    <v-container fluid class="third _parent_layout" style="height:100vh;">
      <v-layout row fill-height>
        <!-- (F8)기본현황 start-->
        <v-flex>
          <div id="wrap">
            <!--	페이지 백그라운드	-->
            <div class="datalist">
              <!--	타이틀		-->
              <div class="title">
                <div class="data on">
                  <router-link to="/report/about/dataList">
                    <h1>Data List</h1>
                  </router-link>
                </div>
                <div class="who">
                  <router-link to="/report/about/whoWeAre">
                    <h1>Who We Are</h1>
                  </router-link>
                </div>
              </div>
              <!--	///타이틀		-->
              <div class="member">
                <!--	데이터 리스트	-->
                <h2 class="list01">데이터 리스트</h2>
                <div class="_table">
                  <grid :options="gridOptions1" ref="grid1"></grid>
                </div>
                <!--	///데이터 리스트	-->
                <!--	관련 기관 리스트	-->
                <h2 class="list02">관련 기관 리스트</h2>
                <v-layout class="connect" align-center justify-start row wrap>
                  <v-flex md3 v-for="(item, index) in orgList" :key="index" class="co_01">
                    <a :href="item.src" target="_blank">
                      <img :src="getImageUrl(item.imageUrl)" alt="행정안전부" />
                    </a>
                  </v-flex>
                </v-layout>

                <!--	///관련 기관 리스트	-->
              </div>
            </div>
            <!--	///페이지 백그라운드	-->
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Grid from "@/components/grid"; // 그리드 컴포넌트
export default {
  name: "data-list",
  data() {
    return {
      orgList: [
        {
          name: "행정안전부",
          src: "https://www.mois.go.kr/frt/a01/frtMain.do",
          imageUrl: "menu/data/h1_01.png"
        },
        {
          name: "중소벤처기업부",
          src: "https://www.mss.go.kr/site/smba/mss/main.do",
          imageUrl: "menu/data/h1_02.png"
        },
        {
          name: "국토교통부",
          src: "http://www.molit.go.kr/portal.do",
          imageUrl: "menu/data/h1_03.png"
        },
        {
          name: "국가공간정보포털",
          src: "http://www.nsdi.go.kr/lxportal/?menuno=2679",
          imageUrl: "menu/data/h2_01.png"
        },
        {
          name: "조달청",
          src: "http://www.pps.go.kr/kor/index.do",
          imageUrl: "menu/data/h2_02.png"
        },
        {
          name: "고용노동부",
          src: "http://www.moel.go.kr/index.do",
          imageUrl: "menu/data/h2_03.png"
        },
        {
          name: "지방재정365",
          src: "http://lofin.mois.go.kr/portal/main.do",
          imageUrl: "menu/data/h3_01.png"
        },
        {
          name: "공공구매종합정보",
          src: "http://www.smpp.go.kr/smpp/index.do",
          imageUrl: "menu/data/h3_02.png"
        },
        {
          name: "조달정보개방포털",
          src: "http://data.g2b.go.kr:8275/pt/main/index.do",
          imageUrl: "menu/data/h3_03.png"
        },
        {
          name: "중앙선거관리위원회",
          src: "http://www.nec.go.kr/portal/main.do",
          imageUrl: "menu/data/h4_01.png"
        },
        {
          name: "국가통계포털",
          src: "http://kosis.kr/index/index.do",
          imageUrl: "menu/data/h4_02.png"
        },
        {
          name: "행정안전부",
          src: "https://www.laiis.go.kr/myMain.do",
          imageUrl: "menu/data/h4_03.png"
        }
      ],
      gridOptions1: {
        dataNm: " 데이터 리스트",
        headerData: [
          {
            header: "순번",
            name: "id",
            align: "center",
            valign: "middle",
            sortable: true,
            sortingType: "desc",
            width: "auto"
          },
          {
            header: "이름",
            name: "nm",
            align: "center",
            valign: "middle",
            sortable: true,
            sortingType: "desc",
            width: "auto"
          },
          {
            header: "기준시점",
            name: "std_time",
            align: "center",
            valign: "middle",
            sortable: true,
            sortingType: "desc",
            width: "auto"
          },
          {
            header: "출처",
            name: "src",
            align: "center",
            valign: "middle",
            sortable: true,
            sortingType: "desc",
            width: "auto"
          }
        ],
        dataQuery: {},
        // dataURL: "/static/data/grid/data1.json",
        dataURL: "/api/com/dataList",
        dataLoc: "회사-데이터리스트",
        dataRootLoc: "",
        onMouseEnter: {
          using: false,
          callback: () => {},
          key: null
        },
        onMouseClick: {
          using: true,
          callback: (data, vueInstance) => {
            // implement your code
            if (data.rowKey !== undefined) {
              const url = data.url;
              // 구글 애널리틱스
              vueInstance.$ga.event("dataList_data", data.nm, data.id); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

              if (url !== "") {
                window.open(
                  url,
                  ""
                  // "_blank"
                ); // 새창에서 열림
              }
            }
          }
        },
        controlLayout: () => {},
        clean: data => {
          const cleanData = data; // 정제된 데이터배열
          return cleanData;
        },
        style: {
          head: "#0840B3",
          body: {
            odd: "white",
            even: "#D8DFEA"
          }
        },
        gridOption: {
          usageStatistics: false, // Google Analytic 사용
          scrollX: false,
          scrollY: true,
          rowHeight: 37,
          // rowHeaders: ["rowNum"],
          // rowHeight: 20,
          minRowHeight: 37,
          header: {
            height: 37
          },
          columnOptions: {
            resizable: true // 컬럼 넓이 조절
          },
          bodyHeight: "fitToParent",
          copyOptions: {
            useFormattedValue: true
          }
        }
      }
    };
  },

  components: {
    grid: Grid // 그리드 컴포넌트
  },

  created() {},

  mounted() {
    // 구글 어널리틱스
    this.$ga.page("/about/dataList");

    const target = this.makeChartTargets(["grid1"]);
    this.drawCharts(target);
  },

  methods: {}
};
</script>
<style scoped src="@/assets/css/menu/style.css"></style>
<style scoped></style>
