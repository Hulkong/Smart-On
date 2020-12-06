import mixin from "@/mixins";

export default {
  namespaced: true,
  state: {
    "budgetTotalFee": {
      dataNm: "예산 및 사업현황-총 예산",
      dataURL: "/api/ctystate/totBudgetFee",
      dataQuery: {
        ctycd: 0,
        pdate: 20190101
      },
      dataLoc: ""
    },
    "budgetEnforceRate": {
      dataNm: "예산 및 사업현황-집행률",
      dataURL: "/api/ctystate/totBudgetRate",
      dataQuery: {
        ctycd: 0
      },
      dataLoc: ""
    },

    "budgetKeywordTop3": {
      dataNm: "예산 및 사업현황-사업키워드TOP3",
      dataURL: "/api/ctystate/bwordTop3Status",
      dataQuery: {
        ctycd: 0
      },
      dataLoc: ""
    },
    "contractTotalFee": {
      dataNm: "조달계약 현황-총 예산",
      dataURL: "/api/ctystate/totContractFee",
      dataQuery: {
        ctycd: 0,
        pdate: 20190101
      },
      dataLoc: ""
    },
    "contractTop1": {
      dataNm: "조달계약 현황-계약 1위 업체",
      dataURL: "/api/ctystate/topCompany",
      dataQuery: {
        ctycd: 0,
        pdate: 20191031
      },
      dataLoc: ""
    },
    "contractKeywordTop3": {
      dataNm: "조달계약 현황-조달계약 키워드TOP3",
      dataURL: "/api/ctystate/cwordTop3Status",
      dataQuery: {
        ctycd: 0
      },
      dataLoc: ""
    },
    "budgetWordcloudTop3": {
      dataNm: "(F51)사업 주요 키워드 TOP3",
      dataURL: "/api/ctystate/wordStatus",
      dataQuery: {
        ctycd: 0,
        pdate: 20191031,
        wtype: "bsns",
        lmt: 3
      },
      dataLoc: ""
    },
    "contractWordcloudTop3": {
      dataNm: "(F52)조달 계약 키워드 TOP3",
      dataURL: "/api/ctystate/wordStatus",
      dataQuery: {
        ctycd: 0,
        pdate: 20191031,
        wtype: "cont",
        lmt: 3
      },
      dataLoc: ""
    },
    "baseDate": {
      dataNm: "데이터 기준날짜",
      dataURL: "/api/ctystate/orgBudPeriod",
      dataQuery: {},
      dataLoc: ""
    },
    "regionNm": {
      dataNm: "시군구명 한글/영어",
      dataURL: "/api/map/area/name/eng",
      dataQuery: {},
      dataLoc: ""
    },
    "regionList": {
      dataNm: "시군구리스트",
      dataURL: "/api/map/area/name",
      dataQuery: {},
      dataLoc: ""
    },
    "navData": {
      dataNm: "네비게이션 데이터",
      dataURL: "/api/ctystate/info/left",
      dataQuery: {},
      dataLoc: ""
    },
    "basicStatus": {
      dataNm: "(F8)기본현황",
      dataURL: "/api/ctystate/info/top",
      dataQuery: {},
      dataLoc: ""
    },
    "selfGovernment": {
      dataNm: "(F8)지방단체장",
      dataURL: "/api/ctystate/info/resmlist",
      dataQuery: {},
      dataLoc: ""
    },
    "mainIdxCategory": {
      dataNm: "(F23-1)분야별 주요지표 헤더",
      dataURL: "/api/com/commonList",
      dataQuery: {
        gcode: "realm",
        ban: "y"
      },
      dataLoc: ""
    },
    "mainIdxDivisionAll": {
      dataNm: "(F23-2)분야별 주요지표 바디",
      dataURL: "/api/diagnose/idxOptions",
      dataQuery: {
        ctycd: null,
        realmcd: null
      },
      dataLoc: ""
    },
    "mainIdxDivision": {
      dataNm: "(F23-2)분야별 주요지표 바디",
      dataURL: "/api/policy/idxOptions",
      dataQuery: {
        ctycd: null,
        realmcd: null
      },
      dataLoc: ""
    },
    "realmIdxTop3": {
      dataNm: "",
      dataURL: "/api/diagnose/realmIndxTop3",
      dataQuery: {
        ctycd: null,
        realmcd: null
      },
      dataLoc: ""
    },
    "diagnoseStdrPeriod": {
      dataNm: "도시진단 데이터 기준일",
      dataURL: "/api/diagnose/stdrPeriod",
      dataQuery: {
        ctycd: null,
        realmcd: null
      },
      dataLoc: ""
    },
    "recomRealmList": {
      dataNm: "정책추천 분야리스트",
      dataURL: "/api/policy/recomRealm",
      dataQuery: {
        ctycd: null
      },
      dataLoc: ""
    },
    "popList": {
      dataNm: "정책추천 분야리스트",
      dataURL: "/api/policy/popList",
      dataQuery: {
        poptype: "idx"
      },
      dataLoc: ""
    },
    "similarTitle": {
      dataNm: "정책추천 분야리스트",
      dataURL: "/api/policy/similarTitle",
      dataQuery: {
        realmcd: null,
        idxcd: null,
        ctycd: null
      },
      dataLoc: ""
    },
    "coronaLastDate": {
      dataNm: "코로나 마지막 업데이트 날짜 가져오기",
      dataURL: "/api/covid/lastDate",
      dataQuery: {
      },
      dataLoc: ""
    },
    "coronaMegaList": {
      dataNm: "코로나 지역선택 selectbox option 리스트",
      dataURL: "/api/covid/regionList",
      dataQuery: {
        rgnclss: 'H1',
        odby: 'id'
      },
      dataLoc: ""
    },
    "coronaCtyList": {
      dataNm: "코로나 지역선택 selectbox option 리스트",
      dataURL: "/api/covid/regionList",
      dataQuery: {
        rgnclss: 'H3',
        parentId: null,
        odby: 'cty_nm'
      },
      dataLoc: ""
    },
    "coronaText01": {
      dataNm: "코로나 지역선택 selectbox option 리스트",
      dataURL: "/api/covid/getCoronaInfo",
      dataQuery: {
        rgnclss: 'H3',
        id: null,
        lastdate: null,
        lastTime: null
      },
    },
    "coronaListMega": {
      dataNm: "코로나 리스트",
      dataURL: "/api/covid/coronaListMega",
      dataQuery: {
        rgnclss: 'H3',
        id: null,
        lastdate: null
      },
      dataLoc: ""
    },
    "coronaListCty": {
      dataNm: "코로나 리스트",
      // dataURL: "/api/covid/coronaListCty",
      dataURL: "/api/covid/coronaListCty2",
      dataQuery: {
        id: null,
        lastdate: null
      },
      dataLoc: "",
      errorMsg: {
        "null_temp": "2020년 08월 14일 이후 수도권을 중심으로 전국적인 코로나 19 집단감염이 급속하게 늘고 있는 상황으로 인해 확진자 이동 경로 수집은 일시적으로 중단합니다.",
        "null_27": "코로나19 위기경보를<br/>심각 단계로 격상함에 따라<br/>확진환자 이동경로 동선 정보 또한<br/>지자체별 환자 등 동향정보로<br/>대체되어 제공함을 알려드립니다.",
        "null_47": "코로나19 위기경보를<br/>심각 단계로 격상함에 따라<br/>확진환자 이동경로 동선 정보 또한<br/>지자체별 환자 등 동향정보로<br/>대체되어 제공함을 알려드립니다.",
        "null_48": "조회가능한 정보가 없습니다.<br/>추후 업데이트 될 예정입니다.",
        "nullall": "확진환자 수가 0명으로<br/>조회가능한 이동경로 데이터가 없습니다."
      }
    },
    dialog: false,
    layerPopup: false,
    device: 'web',
    megaCd: -1,
    cityCd: -1,
    admiCd: -1,
    megas: [], // 광역시/도 배열
    citys: [], // 시군구 배열
    admis: [], // 행정동 배열
  },
  getters: {
    /**
     * @description 기기 정보 가져오기
     * @param {*} state
     */
    getDevice: (state) => {
      return state['device'];
    },

    /**
     * @description 광역시/도 코드 가져옴
     * @param {*} state 
     */
    getMegaCd: (state) => {
      return state['megaCd'];
    },

    /**
     * @description 시군구 코드 가져옴
     * @param {*} state 
     */
    getCityCd: (state) => {
      return state['cityCd'];
    },

    /**
     * @description 행정동 코드 가져옴
     * @param {*} state 
     */
    getAdmiCd: (state) => {
      return state['admiCd'];
    },

    /**
     * @description 광역시/도 배열 가져옴
     * @param {*} state
     */
    getMegas: (state) => {
      return state["megas"];
    },

    /**
     * @description 시군구 배열 가져옴
     * @param {*} state
     */
    getCitys: (state) => {
      return state["citys"];
    },

    /**
     * @description 행정동 배열 가져옴
     * @param {*} state
     */
    getAdmis: (state) => {
      return state["admis"];
    },
  },
  mutations: {
    /**
     * @description dialog active/inactive 
     * @param {*} state 
     * @param {*} payload 
     */
    excuteDialog(state, payload) {
      state.dialog = payload;
    },

    /**
     * @description layerpopup active/inactive 
     * @param {*} state 
     * @param {*} payload 
     */
    excuteLayerPopup(state, payload) {
      state.layerPopup = payload;
    },

    /**
     * @description 기기 저장
     * @param {*} state 
     * @param {*} payload 
     */
    setDeviceType(state, payload) {
      state.device = payload;
    },

    /**
     * @description 광역시/도 코드 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setMegaCd(state, payload) {
      state.megaCd = payload;
    },

    /**
     * @description 시군구 코드 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setCityCd(state, payload) {
      state.cityCd = payload;
    },

    /**
     * @description 행정동 코드 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setAdmiCd(state, payload) {
      state.admiCd = payload;
    },

    /**
     * @description 광역시/도 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setMegas(state, payload) {
      state.megas = payload;
    },

    /**
     * @description 시군구 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setCitys(state, payload) {
      state.citys = payload;
    },

    /**
     * @description 행정동 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setAdmis(state, payload) {
      state.admis = payload;
    },
  },
  actions: {
    /**
     * @description 광역시/도 리스트 설정
     * @param {*} context
     */
    setAsyncMegas(context) {

      context.commit('setMegas', []);
      context.commit('setCitys', []);
      context.commit('setAdmis', []);

      mixin.methods.getData(context.state['regionList']["dataURL"], {
        rgnclss: "H1",
        odby: "id"
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setMegas', data);
      });
    },

    /**
     * @description 시군구 리스트 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncCitys(context, payload) {

      if (payload < 0) return;

      context.commit('setCitys', []);
      context.commit('setAdmis', []);

      mixin.methods.getData(context.state['regionList']["dataURL"], {
        rgnclss: "H3",
        odby: "nm",
        parentId: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setCitys', data);
      });
    },

    /**
     * @description 행정동 리스트 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncAdmis(context, payload) {

      if (payload < 0) return;

      context.commit('setAdmis', []);

      mixin.methods.getData(context.state['regionList']["dataURL"], {
        rgnclss: "H4",
        odby: "nm",
        parentId: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setAdmis', data);
      });
    }
  }
};
