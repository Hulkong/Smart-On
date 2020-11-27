export default {
  namespaced: true,
  state: {
    "map1": {
      dataId: "map1",
      dataNm: "리플릿",
      dataURL: "/src/components/map/vworld/data.json",
      dataQuery: {},
      dataLoc: "page3",
      dataRootLoc: "diagnose",
      clean(data) {
        const cleanData = []; // 정제된 데이터배열

        return cleanData;
      },
      mapOption: {}
    },
    "map2": {
      dataId: "map2",
      dataNm: "리플릿",
      dataURL: "/src/components/map/vworld/data.json",
      dataQuery: {},
      dataLoc: "page3",
      dataRootLoc: "diagnose",
      clean(data) {
        const cleanData = []; // 정제된 데이터배열

        return cleanData;
      },
      mapOption: {}
    }
  },
  getters: {},
  mutations: {},
  actions: {}
};
