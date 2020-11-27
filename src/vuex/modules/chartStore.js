export default {
  namespaced: true,
  state: {
    "pyramid": {
      dataId: "pyramid",
      dataNm: "피라미드",
      // dataURL: "/src/data/chart/pyramid.json",
      dataURL: "/api/ctystate/orgMemList/",
      dataQuery: {
        ctycd: null,
        date: 201907
      },
      dataLoc: "page1",
      dataRootLoc: "ctystate",
      clean(data) {
        const cleanData = []; // 정제된 데이터배열
        const groups = [
          "0-9",
          "10-19",
          "20-29",
          "30-39",
          "40-49",
          "50-59",
          "60-69",
          "70-79",
          "80-89",
          "90-99",
          "100-109"
        ];

        for (let i = 0, max = data.length; i < max; i++) {
          const obj = {
            male: data[i]["male"],
            female: data[i]["female"],
            group: groups[parseInt(data[i]["age"])]
          };

          cleanData[i] = obj;
        }

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 20,
          right: 20,
          bottom: 24,
          left: 20,
          middle: 28
        }
      }
    },
    "treemap": {
      dataId: "treemap",
      dataNm: "트리맵",
      dataURL: "/src/data/chart/treemap.json",
      // dataURL: "/api/ctystate/orgWorker/",
      dataQuery: {
        ctycd: null
      },
      dataLoc: "page1",
      dataRootLoc: "ctystate",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        colorArr: [
          "#ff8166",
          "#ffd3a6",
          "#2e6695",
          "#17c0c0",
          "#72f5c4",
          "#777"
        ],
        root: null,
        node: null
      }
    },
    "horizontalBubble": {
      dataId: "horizontalBubble",
      dataNm: "수평버블",
      // dataURL: "/src/data/chart/horizontalBubble.json",
      dataURL: "/api/diagnose/realmList/",
      dataQuery: {
        ctycd: null
      },
      dataLoc: "page1",
      dataRootLoc: "diagnose",
      clean(data) {
        let cleanData = [];

        for (let i = 0, max = data.length; i < max; i++) {
          cleanData[i] = {
            'text': data[i]['realm_nm'],
            'value': data[i]['budgetTot']
          }
        }

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 20,
          right: 100,
          bottom: 30,
          left: 100
        },
        ticks: 6
      }
    },
    "timeseries": {
      dataId: "timeseries",
      dataNm: "시계열",
      dataURL: "/src/data/chart/timeseries.json",
      // dataURL: "/api/ctystate/orgBudget/",
      dataQuery: {
        ctycd: null
      },
      dataLoc: "page2",
      dataRootLoc: "ctystate",
      clean(data) {
        let cleanData = data;

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 20,
          right: 0,
          bottom: 50,
          left: 0
        }
      }
    },
    "wordcloud1": {
      dataId: "wordcloud1",
      dataNm: "워드클라우드1",
      // dataURL: "/src/data/chart/wordcloud1.json",
      dataURL: "/api/ctystate/wordsBudget/",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "bsns"
      },
      dataLoc: "page2",
      dataRootLoc: "ctystate",
      clean(data) {
        let cleanData = [];
        const valueMax = Math.max(...data.map(d => d['value']));
        const scale = d3.scale.linear().domain([0, valueMax]).range([0, 80]);

        data.reduce((acc, v, i) => {
          let word = v["excut_word"];
          let value = scale(v["value"]);

          cleanData[i] = [word.split(" ")[0], value];

        }, []);

        return cleanData;
      },
      chartOption: {}
    },
    "wordcloud2": {
      dataId: "wordcloud2",
      dataNm: "워드클라우드2",
      // dataURL: "/src/data/chart/wordcloud2.json",
      dataURL: "/api/ctystate/wordsBudget/",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "realm"
      },
      dataLoc: "page3",
      dataRootLoc: "ctystate",
      clean(data) {
        let cleanData = [];
        const valueMax = Math.max(...data.map(d => d['value']));
        const scale = d3.scale.linear().domain([0, valueMax]).range([0, 80]);

        data.reduce((acc, v, i) => {
          let word = v["excut_word"];
          let value = scale(v["value"]);

          cleanData[i] = [word.split(" ")[0], value];

        }, []);

        return cleanData;
      },
      chartOption: {}
    },
    "wordcloud3": {
      dataId: "wordcloud3",
      dataNm: "워드클라우드3",
      // dataURL: "/src/data/chart/wordcloud3.json",
      dataURL: "/api/ctystate/wordsBudget/",
      dataQuery: {
        ctycd: null,
        wtype: "sect"
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      clean(data) {
        let cleanData = [];
        const valueMax = Math.max(...data.map(d => d['value']));
        const scale = d3.scale.linear().domain([0, valueMax]).range([0, 80]);

        data.reduce((acc, v, i) => {
          let word = v["excut_word"];
          let value = scale(v["value"]);

          cleanData[i] = [word.split(" ")[0], value];

        }, []);

        return cleanData;
      },
      chartOption: {}
    },
    "bar1": {
      dataId: "bar1",
      dataNm: "막대1",
      // dataURL: "/src/data/chart/bar1.json",
      dataURL: "/api/ctystate/wordsBudget/",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "realm",
        ordby: 7
      },
      dataLoc: "page3",
      dataRootLoc: "ctystate",
      clean(data) {
        let cleanData = [];

        for (let i = 0, max = data.length; i < max; i++) {

          cleanData[i] = {
            name: data[i]["excut_word"],
            value: data[i]["value"]
          }

        }

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        xAxis: false,
        yAxis: false,
        margin: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10
        },
        ticks: 6
      }
    },
    "bar2": {
      dataId: "bar2",
      dataNm: "막대2",
      // dataURL: "/src/data/chart/bar2.json",
      dataURL: "/api/ctystate/wordsBudget/",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null,
        wtype: "sect",
        ordby: 7
      },
      dataLoc: "page3",
      dataRootLoc: "ctystate",
      clean(data) {
        let cleanData = [];

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
        xAxis: false,
        yAxis: false,
        margin: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10
        },
        ticks: 6
      }
    },
    "bar3": {
      dataId: "bar3",
      dataNm: "막대3",
      // dataURL: "/src/data/chart/bar3.json",
      dataURL: "/api/diagnose/indxcharts/",
      dataQuery: {
        ctycd: null,
        tarcty: 11140,
        realmcd: 50,
        ixdcat: 'A'
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      clean(data) {
        let cleanData = [];
        let headers = {
          "__self": '특정지자체',
          "__all": '유사지자체',
          "__around": '전국'
        };

        data.reduce((acc, v, i) => {
          let key = Object.keys(v)[0];
          let header = headers[key];
          let value = v[key][0]["cnt"];

          cleanData[i] = {
            name: header,
            value: value
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        xAxis: true,
        yAxis: false,
        margin: {
          top: 30,
          right: 10,
          bottom: 70,
          left: 10
        },
        ticks: 6
      }
    },
    "bar4": {
      dataId: "bar4",
      dataNm: "막대4",
      dataURL: "/api/diagnose/indxcharts/",
      dataQuery: {
        ctycd: null,
        tarcty: 11140,
        realmcd: 50,
        ixdcat: 'A'
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      clean(data) {
        let cleanData = [];
        let headers = {
          "__self": '특정지자체',
          "__all": '유사지자체',
          "__around": '전국'
        };

        data.reduce((acc, v, i) => {
          let key = Object.keys(v)[0];
          let header = headers[key];
          let value = v[key][0]["cnt"];

          cleanData[i] = {
            name: header,
            value: value
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        xAxis: true,
        yAxis: false,
        margin: {
          top: 30,
          right: 10,
          bottom: 70,
          left: 10
        },
        ticks: 6
      }
    },
    "bar5": {
      dataId: "bar5",
      dataNm: "막대5",
      dataURL: "/api/diagnose/indxcharts/",
      dataQuery: {
        ctycd: null,
        tarcty: 11140,
        realmcd: 50,
        ixdcat: 'A'
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      clean(data) {
        let cleanData = [];
        let headers = {
          "__self": '특정지자체',
          "__all": '유사지자체',
          "__around": '전국'
        };

        data.reduce((acc, v, i) => {
          let key = Object.keys(v)[0];
          let header = headers[key];
          let value = v[key][0]["cnt"];

          cleanData[i] = {
            name: header,
            value: value
          }
        }, []);

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        xAxis: true,
        yAxis: false,
        margin: {
          top: 30,
          right: 10,
          bottom: 70,
          left: 10
        },
        ticks: 6
      }
    },
    "bar6": {
      dataId: "bar6",
      dataNm: "막대6",
      dataURL: "/src/data/chart/bar6.json",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      clean(data) {
        let cleanData = data;

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        xAxis: true,
        yAxis: false,
        margin: {
          top: 30,
          right: 10,
          bottom: 70,
          left: 10
        },
        ticks: 6
      }
    },
    "bar7": {
      dataId: "bar7",
      dataNm: "막대7",
      dataURL: "/src/data/chart/bar7.json",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      clean(data) {
        let cleanData = data;

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        xAxis: true,
        yAxis: false,
        margin: {
          top: 30,
          right: 10,
          bottom: 70,
          left: 10
        },
        ticks: 6
      }
    },
    "bar8": {
      dataId: "bar8",
      dataNm: "막대8",
      dataURL: "/src/data/chart/bar8.json",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      clean(data) {
        let cleanData = data;

        return cleanData;
      },
      chartOption: {
        fillColor: "#2c7bb6",
        xAxis: true,
        yAxis: false,
        margin: {
          top: 30,
          right: 10,
          bottom: 70,
          left: 10
        },
        ticks: 6
      }
    },
    "radar": {
      dataId: "radar",
      dataNm: "방사",
      // dataURL: "/src/data/chart/radar.json",
      dataURL: "/api/diagnose/realmRadarChart/",
      dataQuery: {
        ctycd: null
      },
      dataLoc: "page1",
      dataRootLoc: "diagnose",
      clean(data) {
        let cleanData = [];

        for (let i = 0, max = data.length; i < max; i++) {
          cleanData[i] = {
            name: data[i]["realm_nm"],
            category: data[i]["realm_cd"],
            value: data[i]["budgetTot"]
          }
        }

        return cleanData;
      },
      chartOption: {
        ticks: 4,
        margin: {
          top: 10,
          right: 20,
          bottom: 70,
          left: 100
        },
        radius: 5,
        factor: 1,
        factorLegend: 0.85,
        levels: 7,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0,
        ToRight: 5,
        TranslateX: 80,
        TranslateY: 30,
        ExtraWidthX: 100,
        ExtraWidthY: 100,
        color: d3.scale.category10(),
        categoryArr: [1, 2, 3]
      }
    },
    "space": {
      dataId: "space",
      dataNm: "우주공간",
      // dataURL: "/src/data/chart/space.json",
      dataURL: "/api/ctystate/realmBudget/",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "page2",
      dataRootLoc: "ctystate",
      clean(data) {
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
      clean(data) {
        let cleanData = [];

        return cleanData;
      },
      chartOption: {}
    },
    "mindmap": {
      dataId: "mindmap",
      dataNm: "마인드맵",
      dataURL: "/src/data/chart/mindmap.json",
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataLoc: "page1",
      dataRootLoc: "recommend",
      clean(data) {
        let cleanData = data;

        return cleanData;
      },
      chartOption: {
        // margin: {
        //   top: 20,
        //   right: 50,
        //   bottom: 50,
        //   left: 80
        // }
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
      dataNm: "가격변동",
      // dataURL: "/src/data/chart/historicalPrice.json",
      dataURL: "/api/diagnose/excuteRate/",
      dataQuery: {
        ctycd: null,
        realmcd: 50
      },
      dataLoc: "page2",
      dataRootLoc: "diagnose",
      clean(data) {
        let cleanData = [];

        for (let i = 0, max = data.length; i < max; i++) {
          let time = data[i]["exc_date"];
          let year = time.substr(0, 4);
          let month = time.substr(4, 2);
          let day = time.substr(6, 2);
          cleanData[i] = {
            date: new Date(year, month - 1, day),
            totExp: data[i]["tot_exp"],
            expAmt: data[i]["exp_amt"]
          }
        }

        return cleanData;
      },
      chartOption: {
        margin: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        }
      }
    }
  },
  getters: {},
  mutations: {},
  actions: {}
};
