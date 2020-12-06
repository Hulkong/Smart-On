export default {
  namespaced: true,
  state: {
    "map1": {
      mapNm: '네비상단 지도',
      dataId: "map1",
      dataNm: "검색 지역 영역",
      dataURL: "/api/map/areaWKT2",
      dataQuery: {
        ctycd: 0,
        rgnclss: 'H3'
      },
      dataLoc: "navi",
      dataRootLoc: "main",
      clean(data) {
        // console.log(data);
        // const cleanData = []; // 정제된 데이터배열

        return data;
      },
      mapStyle: {
        'position': 'relative',
        'width': '100%',
        'height': '100%'
      },
      mapConfig: {
        option: {
          center: [37.492334, 127.062444],
          level: 11,
          minLevel: 7,      // 최소 줌레벨
          maxLevel: 14,     // 최대 줌레벨
          zoomControl: false,     // zoom 컨트롤러 생성여부
          scrollWheelZoom: false, // 스크롤 휠 사용여부
          zoomAnimation: false,   // zoom 사용 애니메이션
          dragging: false,        // 드래그 사용 여부
          fadeAnimation: false    // fade 사용여부
        },
        baseChange: false,      // 배경지도 변경 버튼 on/off
        mapType: "gray", // base map type
        baseLayer: null,
        miniMap: {
          using: false,
          options: {
          }
        },
        layers: ['cty_bound_layer'] // 레이어 저장( 시작할때 올릴 레이어 명 )
      }
    },
    "map2": {
      mapNm: '코로나 지도',
      dataId: "map1",
      dataNm: "전국",
      dataURL: "/api/map/areaWKT2",
      dataQuery: {
        rgnclss: 'H1'
      },
      dataLoc: "covid page",
      dataRootLoc: "popup",
      clean(data) {
        return data;
      },
      mouseOver() {

      },
      mouseClick() {

      },
      mapStyle: {
        'position': 'fixed',
        'width': '95%',
        'height': '95%'
      },
      mapConfig: {
        option: {
          mcenter: [36.31512514748051, 127.85888671875001],
          mlevel: 7,
          center: [36.5341019875413, 127.238159179687],
          level: 8,
          minLevel: 7,      // 최소 줌레벨
          maxLevel: 14,     // 최대 줌레벨
          zoomControl: false,     // zoom 컨트롤러 생성여부
          zoomOption: {
            position: 'topright',
            style: {
              position: "absolute",
              top: "230px",
              right: "0px"
            }
          },
          scrollWheelZoom: true, // 스크롤 휠 사용여부
          zoomAnimation: true,   // zoom 사용 애니메이션
          dragging: true,        // 드래그 사용 여부
          fadeAnimation: true    // fade 사용여부
        },
        baseChange: false,      // 배경지도 변경 버튼 on/off
        mapType: "gray", // base map type ['gray','base','None']
        baseLayer: null,
        miniMap: {
          using: true,
          options: {
            position: 'topright',
            width: 250,
            height: 150,
            toggleDisplay: true,
            zoomAnimation: true,
            aimingRectOptions: { color: "#2B01FC ", weight: 3 },
            zoomLevelOffset: -4
          }
        },
        // layers: ['mega_bound_layer'] // 레이어 저장( 시작할때 올릴 레이어 명 )
        layers: ['blur_layer', 'mega_bound_layer', 'mega_bubble_layer'] // 레이어 저장( 시작할때 올릴 레이어 명 )
      }
    }
  },
  getters: {},
  mutations: {
  },
  actions: {}
};
