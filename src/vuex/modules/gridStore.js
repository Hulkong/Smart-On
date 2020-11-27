export default {
  namespaced: true,
  state: {
    "grid1": {
      dataNm: "집행된 세부 사업",
      headerData: [{
          "header": "자치단체명",
          "name": "cty_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "회계구분명",
          "name": "accnut_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "세부사업명",
          "name": "sect_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "집행일자",
          "name": "exc_date",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "예산현액",
          "name": "budget_amt",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "국비",
          "name": "nation_fee",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "시도비",
          "name": "mega_fee",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "시군구비",
          "name": "cty_fee",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "지출액",
          "name": "expndtr_amt",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "분야명",
          "name": "sect_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "부문명",
          "name": "realm_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      // dataURL: "/src/data/grid/data1.json",
      dataURL: "/api/ctystate/exct/",
      dataLoc: "도시현황-페이지2",
      dataRootLoc: "ctystate",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    },
    "grid2": {
      dataNm: "우수 계약 업체",
      headerData: [{
          "header": "순위",
          "name": "rank",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "업체명",
          "name": "contract_company",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "누적계약금액",
          "name": "cumulativeAmount",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      // dataURL: "/src/data/grid/data2.json",
      dataURL: "/api/ctystate/companyList/",
      dataLoc: "도시현황-페이지3",
      dataRootLoc: "ctystate",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        // bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    },
    "grid3": {
      dataNm: "조달 계약 리스트",
      headerData: [{
          "header": "업무",
          "name": "contract_job",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약번호",
          "name": "contract_no",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약건명",
          "name": "contract_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "정보제공기관",
          "name": "info_org",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "수요기관",
          "name": "dmand_org",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약금액(단위: 원)",
          "name": "contract_fee",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약방법",
          "name": "contract_type",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약일자",
          "name": "stdr_date",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      // dataURL: "/src/data/grid/data3.json",
      dataURL: "/api/ctystate/contractList/",
      dataLoc: "도시현황-페이지3",
      dataRootLoc: "ctystate",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    },
    "grid4": {
      dataNm: "공공질서 및 안전계약 키워드",
      headerData: [{
          "header": "순위",
          "name": "rank",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "특정지자체",
          "name": "__self",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "유사지자체",
          "name": "__around",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "전국",
          "name": "__all",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {
        ctycd: null,
        wtype: "sect"
      },
      // dataURL: "/src/data/grid/data4.json",
      dataURL: "/api/diagnose/conWords/",
      dataLoc: "도시진단-페이지2",
      dataRootLoc: "diagnose",
      clean(data) {
        const cleanData = []; // 정제된 데이터배열
        const rowMax = data[0]["__self"].length;

        for (let i = 0; i < rowMax; i++) {
          cleanData[i] = {
            rank: i + 1,
            "__self": data[0]["__self"][i]["cnt"],
            "__all": data[1]["__all"][i]["cnt"],
            "__around": data[2]["__around"][i]["cnt"]
          }
        }

        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        // bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    },
    "grid5": {
      dataNm: "요즘 빈번한 주제",
      headerData: [{
          "header": "업무",
          "name": "work",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약번호",
          "name": "contractNo",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약건명",
          "name": "contractNm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "정보제공기관",
          "name": "infoProvider",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "수요기관",
          "name": "demandOrgan",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약금액(단위: 원)",
          "name": "contractFee",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약방법",
          "name": "contractWay",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약일자",
          "name": "contractDate",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {},
      dataURL: "/src/data/grid/data5.json",
      dataLoc: "정책추천-페이지1",
      dataRootLoc: "recommend",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    },
    "grid6": {
      dataNm: "유사 지자체에서 많이 수행한 주체",
      headerData: [{
          "header": "업무",
          "name": "work",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약번호",
          "name": "contractNo",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약건명",
          "name": "contractNm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "정보제공기관",
          "name": "infoProvider",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "수요기관",
          "name": "demandOrgan",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약금액(단위: 원)",
          "name": "contractFee",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약방법",
          "name": "contractWay",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "계약일자",
          "name": "contractDate",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {},
      dataURL: "/src/data/grid/data6.json",
      dataLoc: "정책추천-페이지2",
      dataRootLoc: "recommend",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    },
    "grid7": {
      dataNm: "관련 공공 데이터",
      headerData: [{
          "header": "순위",
          "name": "rank",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "명칭",
          "name": "name",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "활용 분야",
          "name": "subject",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "공급자",
          "name": "supplier",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "바로 가기",
          "name": "url",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {},
      dataURL: "/src/data/grid/data7.json",
      dataLoc: "정책추천-페이지2",
      dataRootLoc: "recommend",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        // bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    },
    "grid8": {
      dataNm: "관련 민관 데이터",
      headerData: [{
          "header": "순위",
          "name": "rank",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "명칭",
          "name": "name",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "활용 분야",
          "name": "subject",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "공급자",
          "name": "supplier",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        },
        {
          "header": "바로 가기",
          "name": "url",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc"
        }
      ],
      dataQuery: {},
      dataURL: "/src/data/grid/data8.json",
      dataLoc: "정책추천-페이지2",
      dataRootLoc: "ctystate",
      clean(data) {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 15,
        // rowHeaders: ["rowNum"],
        header: {
          height: 40
        },
        columnOptions: {
          resizable: true // 컬럼 넓이 조절
        },
        // bodyHeight: "fitToParent"
        // heightResizable: true,
      }
    }
  },
  mutations: {},
  actions: {}
};
