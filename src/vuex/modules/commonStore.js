export default {
  namespaced: true,
  state: {
    "regionList": {
      dataNm: "시군구리스트",
      dataURL: "/api/map/area/name/?format=json&keyword=",
      dataQuery: {},
      dataLoc: ""
    },
    "navData": {
      dataNm: "네비게이션 데이터",
      dataURL: "/api/ctystate/info/left/",
      dataQuery: {},
      dataLoc: ""
    },
    "basicStatus": {
      dataNm: "기본현황",
      dataURL: "/api/ctystate/info/top/",
      dataQuery: {},
      dataLoc: "도시현황-페이지1"
    },
    "selfGovernment": {
      dataNm: "지방단체장",
      dataURL: "/api/ctystate/info/resmlist/",
      dataQuery: {},
      dataLoc: "도시현황-페이지1"
    },
    "f23title": {
      dataNm: "지방단체장",
      dataURL: "/api/com/commonList/",
      dataQuery: {
        gcode: "realm"
      },
      dataLoc: "도시현황-페이지1"
    },
    "f23contents": {
      dataNm: "지방단체장",
      dataURL: "/api/com/commonList/",
      dataQuery: {
        gcode: "indx"
      },
      dataLoc: "도시현황-페이지1"
    }
  },
  mutations: {},
  actions: {}
};
