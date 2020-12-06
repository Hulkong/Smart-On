export default {
  namespaced: true,
  state: {
    "pyramid1": {
      dataId: "pyramid1",
      dataNm: "(F9)인구 피라미드",
      dataURL: "/api/ctystate/orgMemList",
      dataQuery: {
        ctycd: null,
        date: 201910
      },
      dataLoc: "page1",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];

        const cleanData = []; // 정제된 데이터배열
        const groups = data.code.map((v) => v["cd_nm"])
        const dataArr = data.data;

        for (let i = 0, max = dataArr.length; i < max; i++) {
          const obj = {
            male: dataArr[i]["male"],
            female: dataArr[i]["female"],
            group: groups[parseInt(dataArr[i]["age"])]
          };

          cleanData[i] = obj;
        }

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 20,
          right: 45,
          bottom: 24,
          left: 45,
          middle: 0
        },
        legend: ["남성", "여성"]
      }
    },
    "pyramid2": {
      dataId: "pyramid2",
      dataNm: "(F8)인구2 피라미드",
      dataURL: "/api/ctystate/orgPyramidList2",
      dataQuery: {
        ctycd: null,
        date: 201907
      },
      dataLoc: "page1",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];

        const cleanData = []; // 정제된 데이터배열
        const groups = data.code.map((v) => v["cd_nm"])
        const dataArr = data.data;

        for (let i = 0, max = dataArr.length; i < max; i++) {
          const obj = {
            male: dataArr[i]["male"],
            female: dataArr[i]["female"],
            group: groups[parseInt(dataArr[i]["age"])]
          };

          cleanData[i] = obj;
        }

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 20,
          right: 45,
          bottom: 24,
          left: 45,
          middle: 0
        },
        legend: ["전입", "전출"]
      }
    },
    "treemap1": {
      dataId: "treemap1",
      dataNm: "(F10)산업별 GRDP트리맵",
      dataURL: "/api/ctystate/orgGRDP",
      dataQuery: {
        ctycd: null
      },
      dataLoc: "page1",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];

        const cleanData = []; // 정제된 데이터배열
        const colorArr = [
          "#311B92",
          "#4527A0",
          "#512DA8",
          "#5E35B1",
          "#673AB7",
          "#7E57C2",
          "#9575CD",
          "#B39DDB",
          "#D1C4E9"
        ];

        // 필요 데이터 정제
        data.reduce((acc, v, i) => {

          cleanData[i] = {
            name: v["ind_nm"], // 이름
            size: v["total_cnt"], // 실제 계산되는 value
            fill: colorArr[Math.floor(i / 2)], // 배경색상
            color: "white", // 폰트색상
            tooltipColor: "#4d21bc",  // tooltip 색상
            rate: v["rate"], // 비율
            unit: "개"  // 단위
          }
        }, []);


        return cleanData;
      },
      chartOption: {
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        root: null,
        node: null
      }
    },
    "treemap2": {
      dataId: "treemap2",
      dataNm: "(F10)사업체 종사자 수 트리맵",
      dataURL: "/api/ctystate/orgWorker",
      dataQuery: {
        ctycd: null
      },
      dataLoc: "page1",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];

        const cleanData = []; // 정제된 데이터배열
        const colorArr = [
          "#BF360C",
          "#D84315",
          "#E64A19",
          "#F4511E",
          "#FF5722",
          "#FF7043",
          "#FF8A65",
          "#FFAB91",
          "#FFCCBC"
        ];

        // 필요 데이터 정제
        data.reduce((acc, v, i) => {

          cleanData[i] = {
            name: v["ind_nm"], // 이름
            size: v["total_cnt"], // 실제 계산되는 value
            fill: colorArr[Math.floor(i / 2)], // 배경색상
            color: "white", // 폰트색상
            tooltipColor: "#ff5f2e",  // tooltip 색상
            rate: v["rate"], // 비율
            unit: "명"  // 단위
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        root: null,
        node: null
      }
    },
    "horizontalBubble": {
      dataId: "(F21)horizontalBubble",
      dataNm: "수평버블",
      dataURL: "/api/diagnose/realmList",
      dataQuery: {
        ctycd: null,
        stdrdt: null
      },
      dataLoc: "page1",
      dataRootLoc: "diagnose",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = data;

        return cleanData;
      },
      chartOption: {}
    },
    "timeseries": {
      dataId: "timeseries",
      dataNm: "(F11)기간선택",
      dataURL: "/api/ctystate/orgBudget",
      dataQuery: {
        ctycd: null,
        start_date: null,
        end_date: null
      },
      dataLoc: "page2",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = data;

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 0,
          right: 30,
          bottom: 20,
          left: 75
          // left: 0
        },
        xColumn: "stdr_date", // y축 데이터
        yColumn: "total_cnt", // x축 데이터
        tickFormat: d3.time.format("%y/%m/%d")
      },
    },
    "wordcloud1": {
      dataId: "wordcloud1",
      dataNm: "(F15)사업 키워드 워드클라우드",
      dataURL: "/api/ctystate/wordStatus",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "bsns",
        lmt: 70
      },
      dataLoc: "page2",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = []; // 정제된 데이터
        const valueMin = Math.min(...data.map(d => d["value"])); // 최댓값
        const valueMax = Math.max(...data.map(d => d["value"])); // 최댓값
        // const scale = d3.scale.linear().domain([0, valueMax]).range([2, 5]); // 범위 함수
        const scale = d3.scale.linear().domain([valueMax, valueMin]).range([15, 5]); // 범위 함수

        // 데이터 정제
        data.reduce((acc, v, i) => {
          let word = v["excut_word"]; // 단어
          // let value = i === 0 ? 12 : Math.round(scale(v["value"])); // 사이즈
          let value = Math.round(scale(v["value"])); // 사이즈

          // cleanData[i] = [word.split(" ")[0], value];
          cleanData[i] = [word, value];

        }, []);

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 5,
          right: 0,
          bottom: 0,
          left: 0
        },
        shape: 'circle'
      }
    },
    "wordcloud2": {
      dataId: "wordcloud2",
      dataNm: "(F18)조달 계약 키워드 워드클라우드",
      dataURL: "/api/ctystate/wordStatus",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "cont",
        lmt: 70
      },
      dataLoc: "page3",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = []; // 정제된 데이터
        const valueMin = Math.min(...data.map(d => d["value"])); // 최댓값
        const valueMax = Math.max(...data.map(d => d["value"])); // 최댓값
        // const scale = d3.scale.linear().domain([0, valueMax]).range([2, 5]); // 범위 함수
        const scale = d3.scale.linear().domain([valueMax, valueMin]).range([15, 5]); // 범위 함수

        // 데이터 정제
        data.reduce((acc, v, i) => {
          let word = v["excut_word"]; // 단어
          // let value = i === 0 ? 12 : Math.round(scale(v["value"])); // 사이즈
          let value = Math.round(scale(v["value"])); // 사이즈
          cleanData[i] = [word, value];
        }, []);


        return cleanData;
      },
      chartOption: {
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        shape: 'circle'
      }
    },
    "wordcloud3": {
      dataId: "wordcloud3",
      dataNm: "(F27-1)워드클라우드3",
      dataURL: "/api/diagnose/conWords",
      dataQuery: {
        ctycd: null,
        wtype: "cont",
        realmcd: null,
        lmt: 70
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = []; // 정제된 데이터
        const valueMin = Math.min(...data.map(d => d["value"])); // 최소값
        const valueMax = Math.max(...data.map(d => d["value"])); // 최댓값
        // const scale = d3.scale.linear().domain([0, valueMax]).range([2, 5]); // 범위 함수
        const scale = d3.scale.linear().domain([valueMax, valueMin]).range([15, 5]); // 범위 함수

        // 데이터 정제
        data.reduce((acc, v, i) => {
          let word = v["excut_word"]; // 단어
          // let value = i === 0 ? 12 : Math.round(scale(v["value"])); // 사이즈
          let value = Math.round(scale(v["value"])); // 사이즈

          cleanData[i] = [word, value];
          // cleanData[i] = [word.split(" ")[0], value];

        }, []);

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 0,
          right: 0,
          bottom: 10,
          left: 0
        },
        shape: 'square'
      }
    },
    "bar1": {
      dataId: "bar1",
      dataNm: "막대1",
      dataURL: "/api/ctystate/realmBudget",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "realm",
        ordby: 7
      },
      dataLoc: "page3",
      dataRootLoc: "ctystate",
      controlLayout: (element) => {
        const metaData = this.default.state.bar1;

        // FHD 해상도보다 작을 경우 특정 차트 속성 변경
        if (outerWidth <= 1700) {
          metaData.chartOption.fontSize = "10px";
          metaData.chartOption.margin.bottom = 60;
        }
      },
      clean: (data) => {
        if (data.length === 0) return [];

        const cleanData = [];

        for (let i = 0, max = data.length; i < max; i++) {

          cleanData[i] = {
            name: data[i]["realm_nm"],
            value: data[i]["expndTot"],
            rate: data[i]["rate"],
            color: '#4d21bc'
          }
        }

        // cleanData.push({
        //   name: "text",
        //   value: -50,
        //   rate: -20,
        //   color: '#4d21bc'
        // })
        return cleanData;
      },
      chartOption: {
        xAxis: {
          isShow: false,
          position: "bottom",
          rotate: ""
        },
        yAxis: {
          isShow: false,
          position: "left",
          rotate: ""
        },
        zeroAxis: {
          isShow: true,
          rotate: "rotate(-25)"
        },
        containerMargin: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10
        },
        margin: {
          top: 15,
          right: 0,
          bottom: 80,
          left: 20
        },
        tickSize: 0,
        text: {
          size: "12px",
          weight: 400,
          unit: "원"
        },
        topText: {
          isShow: true,
          unit: "%"
        },
        barWidth: 20,
      }
    },
    "bar2": {
      dataId: "bar2",
      dataNm: "막대2",
      dataURL: "/api/ctystate/wordsBudget",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "sect",
        ordby: 7
      },
      dataLoc: "page3",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = [];

        for (let i = 0, max = data.length; i < max; i++) {

          cleanData[i] = {
            name: data[i]["excut_word"],
            value: data[i]["value"]
          }

        }

        return cleanData;
      },
      chartOption: {
        fillColor: "#33a63f",
        isXAxis: false,
        isYAxis: false,
        margin: {
          top: 0,
          right: 10,
          bottom: 50,
          left: 10
        },
        ticks: 6,
        fontSize: "12px",
        fontWeight: 100,
      }
    },
    "bar3": {
      dataId: "bar3",
      dataNm: "(F28)주요지표1",
      dataURL: "/api/diagnose/indxcharts",
      dataQuery: {
        ctycd: null,
        tarcty: 11140,
        realmcd: null,
        ixdcat: null
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];

        const cleanData = []; // 정제된 데이터
        const colors = ["#ff5f2e", "#6224fb", "#6224fb"]; // 그래프 색상

        if (data[0]["__self"].length === 0 && data[1]["__all"].length === 0 && data[2]["__around"].length === 0) {
          return [];
        }

        data.reduce((acc, v, i) => {
          let key = Object.keys(v)[0];
          let header = v[key].length > 0 ? v[key][0]["name"] : "";
          let value = v[key].length > 0 ? v[key][0]["cnt"] : 0;

          cleanData[i] = {
            name: i === 0 ? header : header + " 평균",
            value: value,
            color: colors[i]
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        isXAxis: true,
        isYAxis: false,
        margin: {
          top: 10,
          right: 10,
          bottom: 50,
          left: 10
        },
        ticks: 6,
        fontSize: "10px",
        fontWeight: 400,
        rotate: "rotate(-15)",
        isRotate: false,
        isXDomain: true,
        isYDomain: true,
        anchor: "middle",
        unit: ""
      }
    },
    "bar4": {
      dataId: "bar4",
      dataNm: "(F28)주요지표2",
      dataURL: "/api/diagnose/indxcharts",
      dataQuery: {
        ctycd: null,
        tarcty: 11140,
        realmcd: null,
        ixdcat: null
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = []; // 정제된 데이터
        const colors = ["#ff5f2e", "#6224fb", "#6224fb"]; // 그래프 색상

        if (data[0]["__self"].length === 0 && data[1]["__all"].length === 0 && data[2]["__around"].length === 0) {
          return [];
        }

        data.reduce((acc, v, i) => {
          let key = Object.keys(v)[0];
          let header = v[key].length > 0 ? v[key][0]["name"] : "";
          let value = v[key].length > 0 ? v[key][0]["cnt"] : 0;

          cleanData[i] = {
            name: i === 0 ? header : header + " 평균",
            value: value,
            color: colors[i]
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        isXAxis: true,
        isYAxis: false,
        margin: {
          top: 10,
          right: 10,
          bottom: 50,
          left: 10
        },
        ticks: 6,
        fontSize: "10px",
        fontWeight: 400,
        rotate: "rotate(-15)",
        isRotate: false,
        isXDomain: true,
        isYDomain: true,
        anchor: "middle",
        unit: ""
      }
    },
    "bar5": {
      dataId: "bar5",
      dataNm: "(F28)주요지표3",
      dataURL: "/api/diagnose/indxcharts",
      dataQuery: {
        ctycd: null,
        tarcty: 11140,
        realmcd: null,
        ixdcat: null
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = []; // 정제된 데이터
        const colors = ["#ff5f2e", "#6224fb", "#6224fb"]; // 그래프 색상

        if (data[0]["__self"].length === 0 && data[1]["__all"].length === 0 && data[2]["__around"].length === 0) {
          return [];
        }

        data.reduce((acc, v, i) => {
          let key = Object.keys(v)[0];
          let header = v[key].length > 0 ? v[key][0]["name"] : "";
          let value = v[key].length > 0 ? v[key][0]["cnt"] : 0;

          cleanData[i] = {
            name: i === 0 ? header : header + " 평균",
            value: value,
            color: colors[i]
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        isXAxis: true,
        isYAxis: false,
        margin: {
          top: 10,
          right: 10,
          bottom: 50,
          left: 10
        },
        ticks: 6,
        fontSize: "10px",
        fontWeight: 400,
        rotate: "rotate(-15)",
        isRotate: false,
        isXDomain: true,
        isYDomain: true,
        anchor: "middle",
        unit: ""
      }
    },
    "bar6": {
      dataId: "bar6",
      dataNm: "막대6",
      dataURL: "/api/policy/recomRealmChart",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        realmcd: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = [];

        // 색상 지정, 가장 높은 데이터는 주황색계열
        data.reduce((acc, v, i) => {
          cleanData.push({
            name: v["idx_nm"],
            color: i > 0 ? 'rgb(0,33,162)' : '#ff5f2e',
            value: v["tot_value"],
            topPositionValue: v["tot_value"]
          })
        }, []);

        cleanData.sort((a, b) =>
          a.idx_cat < b.idx_cat ? -1 : a.idx_cat > b.idx_cat ? 1 : 0
        );
        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        isXAxis: true,
        isYAxis: false,
        margin: {
          top: 10,
          right: 30,
          bottom: 45,
          left: 30
        },
        ticks: 5,
        fontSize: "10px",
        fontWeight: 400,
        rotate: "rotate(-15)",
        isRotate: false,
        isXDomain: true,
        isYDomain: false,
        isShowTopText: true,
        anchor: "middle",
        unit: ""
      }
    },
    "bar7": {
      dataId: "bar7",
      dataNm: "막대7",
      dataURL: "/api/policy/recomRealmChart",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        realmcd: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = [];

        // 색상 지정, 가장 높은 데이터는 주황색계열
        data.reduce((acc, v, i) => {
          cleanData.push({
            name: v["idx_nm"],
            color: i > 0 ? 'rgb(0,33,162)' : '#ff5f2e',
            value: v["tot_value"],
            topPositionValue: v["tot_value"]
          })
        }, []);

        cleanData.sort((a, b) =>
          a.idx_cat < b.idx_cat ? -1 : a.idx_cat > b.idx_cat ? 1 : 0
        );
        return cleanData;

      },
      chartOption: {
        fillColor: "#2c7bb6",
        isXAxis: true,
        isYAxis: false,
        margin: {
          top: 10,
          right: 30,
          bottom: 45,
          left: 30
        },
        ticks: 5,
        fontSize: "10px",
        fontWeight: 400,
        rotate: "rotate(-15)",
        isRotate: false,
        isXDomain: true,
        isYDomain: false,
        isShowTopText: true,
        anchor: "middle",
        unit: ""
      }
    },
    "bar8": {
      dataId: "bar8",
      dataNm: "막대8",
      dataURL: "/api/policy/recomRealmChart",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        realmcd: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = [];

        // 색상 지정, 가장 높은 데이터는 주황색계열
        data.reduce((acc, v, i) => {
          cleanData.push({
            name: v["idx_nm"],
            color: i > 0 ? 'rgb(0,33,162)' : '#ff5f2e',
            value: v["tot_value"],
            topPositionValue: v["tot_value"]
          })
        }, []);

        cleanData.sort((a, b) =>
          a.idx_cat < b.idx_cat ? -1 : a.idx_cat > b.idx_cat ? 1 : 0
        );
        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        isXAxis: true,
        isYAxis: false,
        margin: {
          top: 10,
          right: 30,
          bottom: 45,
          left: 30
        },
        ticks: 5,
        fontSize: "10px",
        fontWeight: 400,
        rotate: "rotate(-15)",
        isRotate: false,
        isXDomain: true,
        isYDomain: false,
        isShowTopText: true,
        anchor: "middle",
        unit: ""
      }
    },
    "radar": {
      dataId: "radar",
      dataNm: "(F22)분야별 주요지표 방사차트",
      dataURL: "/api/diagnose/realmRadarChart",
      dataQuery: {
        ctycd: null,
        stdrdt: null
      },
      dataLoc: "page1",
      dataRootLoc: "diagnose",
      controlLayout: (element) => { },
      clean: (data) => {

        if (data.length === 0) return [];

        const cleanData = {};
        const budArr = data["bud"];
        const idxArr = data["idx"];
        const idxSimrArr = data["idx_simr"];
        const idxAllArr = data["idx_all"];

        const metaData = {
          idx_simr: {
            arrIndex: 1,
            legend: idxSimrArr[0]["name"]
          },
          idx: {
            arrIndex: 0,
            legend: idxArr[0]["name"]
          },
          idx_all: {
            arrIndex: 2,
            legend: idxAllArr[0]["name"]
          }
        };
        const chartData = [];  // 차트 데이터
        const axisData = []; // 축 데이터
        const tooltipData = []; // tooltip 데이터

        // 예산 기준 내림차순으로 정렬
        budArr.sort((a, b) => {
          const aVal = Number(a.bud);
          const bVal = Number(b.bud);
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        });

        // 필요 배열데이터 개수만큼 초기화
        Object.keys(metaData).reduce((acc, v, i) => {
          chartData[i] = [];
        }, []);

        // 예산 배열 데이터 기준으로 차트 데이터 정제
        budArr.reduce((acc, v, i) => {

          Object.keys(data).reduce((acc1, v1, i1) => {

            if (v1 === "bud") return;

            // 예산으로 정렬된 대분류 코드 필터 적용시킨 배열
            const tmpData = data[v1].filter(item => item.realm_cd === v["realm_cd"]);

            const obj = {
              name: tmpData[0]["realm_nm"],
              category: tmpData[0]["realm_cd"],
              value: tmpData[0]["idx_value"],
              colnm: metaData[v1]["legend"],
              realValue: v1 === "idx_simr" ? v["bud"] : 0,
              rate: v1 === "idx_simr" ? v["rate"] : 0
            }

            chartData[metaData[v1]["arrIndex"]].push(obj)

          }, [])

        }, []);

        // 예산 배열 데이터 기준으로 축 데이터 정제
        budArr.reduce((acc, v, i) => {

          Object.keys(data).reduce((acc1, v1, i1) => {

            // 예산으로 정렬된 대분류 코드 필터 적용시킨 배열
            const tmpData = data[v1].filter(item => item.realm_cd === v["realm_cd"]);
            const obj = {};

            // 예산
            if (v1 === "bud") {
              obj.name = tmpData[0]["realm_nm"];
              obj.rate = tmpData[0]["rate"];
              obj.bud = tmpData[0]["bud"];
              obj.code = tmpData[0]["realm_cd"];

              // 지수
            } else if (v1 === "idx") {
              obj.idx_value = tmpData[0]["idx_value"];

              // 전국 지수
            } else if (v1 === "idx_all") {
              obj.idx_all_value = tmpData[0]["idx_value"];

              // 유사 지자체 지수
            } else if (v1 === "idx_simr") {
              obj.idx_simr_value = tmpData[0]["idx_value"]
            }

            axisData[i] = Object.assign({}, axisData[i], obj)
          }, [])

        }, []);

        // 예산 배열 데이터 기준으로 tooltip 데이터 정제
        budArr.reduce((acc, v, i) => {

          const obj = {};
          const arr = [];
          Object.keys(data).reduce((acc1, v1, i1) => {

            // 예산으로 정렬된 대분류 코드 필터 적용시킨 배열
            const tmpData = data[v1].filter(item => item.realm_cd === v["realm_cd"]);


            // 예산
            if (v1 === "bud") {
              obj.title = tmpData[0]["realm_nm"];
              obj.code = tmpData[0]["realm_cd"];

              // 지수
            } else if (v1 === "idx") {
              arr[0] = {
                name: tmpData[0]["name"],
                value: tmpData[0]["idx_value"]
              }

              // 전국 지수
            } else if (v1 === "idx_all") {

              arr[2] = {
                name: tmpData[0]["name"],
                value: tmpData[0]["idx_value"]
              }

              // 유사 지자체 지수
            } else if (v1 === "idx_simr") {
              arr[1] = {
                name: tmpData[0]["name"],
                value: tmpData[0]["idx_value"]
              }
            }

            obj.contents = arr;

          }, [])
          tooltipData[i] = Object.assign({}, tooltipData[i], obj)

        }, []);

        cleanData["chartData"] = chartData;
        cleanData["axisData"] = axisData;
        cleanData["tooltipData"] = tooltipData;

        return cleanData;
      },
      chartOption: {
        ticks: 4,
        margin: {
          top: 50,
          right: 120,
          bottom: 50,
          left: 120
        },
        radius: 5,
        factor: 1,
        factorLegend: 0.95,
        levels: 7,
        maxValue: 100,
        radians: 2 * Math.PI,
        ToRight: 5,
        TranslateX: 80,
        TranslateY: 30,
        ExtraWidthX: 0,
        ExtraWidthY: 0,
        pointOpacity: (i) => [0.9, 0.9, 0.9][i],
        polygonOpacity: (i) => [0.3, 0, 0][i],
        color: (i) => ['#FF5F2E', '#4D21BC', '#fbd14b'][i],
        dashArray: (i) => [0, 0, '5,5'][i],
        drawOrder: (i) => [2, 1, 0][i],
        isShow: (i) => [true, true, false][i]
      }
    },
    "space": {
      dataId: "space",
      dataNm: "우주공간",
      dataURL: "/api/ctystate/realmBudget",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "page2",
      dataRootLoc: "ctystate",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = []; // 정제된 데이터배열
        const sinCos = [null, 0, 1, 1.6, 2.2, 2.8, 3.5, 4, 4.5, 5, 5.5];
        const radius = [30, 18, 16, 14, 12, 9, 7, 5, 5, 5, 5];
        for (let i = 0, max = data.length - 1; i < max; i++) {
          const obj = {
            value: data[i]["budgetTot"],
            name: data[i]["realm_nm"],
            color: "rgba(96,0,115,1.0)",
            sin: sinCos[i],
            cos: sinCos[i],
            radius: radius[i],
            isMax: i === 0 ? true : false
          };

          cleanData[i] = obj;
        }

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        },
        ticks: 6
      }
    },
    "line": {
      dataId: "line",
      dataNm: "라인",
      dataURL: "/src/data/chart/line.json",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "",
      dataRootLoc: "ctyState",
      controlLayout: (element) => {

      },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = [];

        return cleanData;
      },
      chartOption: {}
    },
    "linechart": {
      dataId: "linechart",
      dataNm: "코로나 페이지 확진자 관련 시계열 그래프",
      dataURL: "/api/covid/coronaTimeSeriese",
      dataQuery: {
        id: null,
        rgnclss: 'H0',
        lastdate: null,
        lastTime: null
      },
      dataLoc: "covid",
      dataRootLoc: "popup",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];

        return data;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        isXAxis: true,
        isYAxis: false,
        margin: {
          top: 10,
          right: 20,
          bottom: 45,
          left: 50
        },
        ticks: 5,
        fontSize: "10px",
        fontWeight: 400,
        rotate: "rotate(-15)",
        isRotate: false,
        isXDomain: true,
        isYDomain: false,
        isShowTopText: true,
        anchor: "middle",
        unit: "명",
        tooltipFormat: function (text) {
          return text.substr(0, 4) + "년 " + text.substr(4, 2) + "월 " + text.substr(6, 2) + "일"
        },
        tickFormat: d3.time.format("%m/%d"),
        setDomain: function (data) {
          let dArr = [];
          if (data.length > 0) {
            let sdate_str = data[0].name;
            let edate_str = data[(data.length - 1)].name;
            dArr = [
              new Date(sdate_str.substr(0, 4) + "-" + sdate_str.substr(4, 2) + "-" + sdate_str.substr(6, 2)),
              new Date(edate_str.substr(0, 4) + "-" + edate_str.substr(4, 2) + "-" + edate_str.substr(6, 2))
            ]

          }
          return dArr;
        }
      }
    },
    "mindmap": {
      dataId: "mindmap",
      dataNm: "마인드맵",
      dataURL: "/static/data/chart/mindmap2.json",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      controlLayout: (element) => {

      },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = data;

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      }
    },
    "historicalPrice": {
      dataId: "historicalPrice",
      dataNm: "(F26)일자별 집행률 그래프",
      dataURL: "/api/diagnose/excuteRate",
      dataQuery: {
        ctycd: null, // 시군구코드
        realmcd: null // 분야코드
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      controlLayout: (element) => { },
      clean: (data) => {
        if (data.length === 0) return [];
        const cleanData = [];

        data.reduce((acc, v, i) => {
          cleanData[i] = {
            date: v["exc_date"],  // 일자
            value: v["tot_exp"], // 누적 집행 금액
            compareValue: i > 0 ? v["exp_amt"] - data[i - 1]["exp_amt"] : v["exp_amt"]  // 집행 금액
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 50,
          right: 0,
          bottom: 50,
          left: 120
        },
        category: {
          date: '일자',
          value: '누적 집행 금액',
          compareValue: '집행 금액'
        }
      }
    }
  },
  getters: {},
  mutations: {},
  actions: {}
};
