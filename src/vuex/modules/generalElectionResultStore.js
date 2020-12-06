import mixin from "@/mixins";

export default {
  namespaced: true,
  state: {
    "regionList": {
      dataNm: "지역선택",
      dataURL: "/api/eresult/regionList",
      dataQuery: {},
      dataLoc: ""
    },
    "electionArea": {
      dataNm: "지역선택-광역시도-선거구",
      dataURL: "/api/eresult/electionArea",
      dataQuery: {},
      dataLoc: ""
    },
    "electionMap": {
      dataNm: "지역구-지도",
      dataURL: "/api/eresult/electionMap",
      dataQuery: {},
      dataLoc: ""
    },
    "electionParty": {
      dataNm: "비례대표-지도",
      dataURL: "/api/eresult/electionParty",
      dataQuery: {},
      dataLoc: ""
    },
    "electionAllMap": {
      dataNm: "시도 영역 경계 ",
      dataURL: "/api/eresult/electionAllMap",
      dataQuery: {},
      dataLoc: ""
    },
    "eResultSeatCnt": {
      dataNm: "선거구 의석수",
      dataURL: "/api/eresult/eResultSeatCnt",
      dataQuery: {},
      dataLoc: ""
    },
    "eResultList": {
      dataNm: "선거구 결과 테이블",
      dataURL: "/api/eresult/eResultList",
      dataQuery: {},
      dataLoc: ""
    },
    "eResultDetail": {
      dataNm: "해당 선거구 비교",
      dataURL: "/api/eresult/eResultDetail",
      dataQuery: {},
      dataLoc: ""
    },
    "ePartySeatCnt": {
      dataNm: "선거구 비례대표 의석수",
      dataURL: "/api/eresult/ePartySeatCnt",
      dataQuery: {},
      dataLoc: ""
    },
    "ePartyList": {
      dataNm: "선거구 비례대표 결과 테이블",
      dataURL: "/api/eresult/ePartyList",
      dataQuery: {},
      dataLoc: ""
    },
    "ePartyDetail": {
      dataNm: "해당 선거구 비례대표 비교",
      dataURL: "/api/eresult/ePartyDetail",
      dataQuery: {},
      dataLoc: ""
    },
    "electionResult": {
      dataNm: "지역별 투표율",
      dataURL: "/api/eresult/electionResult",
      dataQuery: {},
      dataLoc: ""
    },
    isShowMobile: false, // 4.15 총선 결과 모바일 페이지 보임 여부 플래그 값
    layerData: [], // 레이어데이터 배열
    layerStyle: () => 1,
    mousemove: () => 1,
    mouseout: () => 1,
    click: () => 1,
    megas: [], // 광역시도 배열
    sggs: [], // 선거구 배열
    megaCd: -1, // 광역시도 코드
    sggCd: -1, // 선거구 코드
    sggSeats: [], // 선거구 의석수
    sggResult: [], // 선거구 결과
    sggCompare: [], // 선거구 비교
    sggPartySeats: [], // 선거구 비례대표 의석수
    sggPartyResult: [], // 선거구 비례대표 결과 
    sggPartyCompare: [], // 선거구 비례대표 비교
    voteRate: [], // 지역별 투표율
    currRequestNm: "" // 현재 요청 중인 이름
  },

  getters: {

    /**
     * @description 4.15 총선 결과 모바일 페이지 보임 여부 플래그 값 가져옴
     * @param {*} state
     */
    getIsShowMobile: (state) => {
      return state['isShowMobile'];
    },

    /**
     * @description 레이어 데이터 배열 가져옴
     * @param {*} state
     */
    getLayerData: (state) => {
      return state["layerData"];
    },

    /**
     * @description 레이어 스타일 가져옴
     * @param {*} state
     */
    getLayerStyle: (state) => {
      return state["layerStyle"];
    },

    /**
     * @description mousemove 이벤트 가져옴
     * @param {*} state
     */
    getMousemove: (state) => {
      return state["mousemove"];
    },

    /**
     * @description mouseover 이벤트 가져옴
     * @param {*} state
     */
    getMouseover: (state) => {
      return state["mouseover"];
    },

    /**
     * @description mouseout 이벤트 가져옴
     * @param {*} state
     */
    getMouseout: (state) => {
      return state["mouseout"];
    },

    /**
     * @description click 이벤트 가져옴
     * @param {*} state
     */
    getClick: (state) => {
      return state["click"];
    },

    /**
     * @description 광역시/도 배열 가져옴
     * @param {*} state
     */
    getMegas: (state) => {
      return state["megas"];
    },

    /**
     * @description 선거구 배열 가져옴
     * @param {*} state
     */
    getSggs: (state) => {
      return state["sggs"];
    },

    /**
     * @description 광역시/도 코드 가져옴
     * @param {*} state 
     */
    getMegaCd: (state) => {
      return state['megaCd'];
    },

    /**
     * @description 선거구 코드 가져옴
     * @param {*} state 
     */
    getSggCd: (state) => {
      return state['sggCd'];
    },

    /**
     * @description 선거구 의석수 가져옴
     * @param {*} state 
     */
    getSggSeats: (state) => {
      return state['sggSeats'];
    },

    /**
     * @description 선거구 결과 가져옴
     * @param {*} state 
     */
    getSggResult: (state) => {
      return state['sggResult'];
    },

    /**
     * @description 선거구 비교 가져옴
     * @param {*} state 
     */
    getSggCompare: (state) => {
      return state['sggCompare'];
    },

    /**
     * @description 선거구 비례대표 의석수 가져옴
     * @param {*} state 
     */
    getSggPartySeats: (state) => {
      return state['sggPartySeats'];
    },

    /**
     * @description 선거구 비례대표 결과 가져옴
     * @param {*} state 
     */
    getSggPartyResult: (state) => {
      return state['sggPartyResult'];
    },

    /**
     * @description 선거구 비례대표 비교 가져옴
     * @param {*} state 
     */
    getSggPartyCompare: (state) => {
      return state['sggPartyCompare'];
    },

    /**
     * @description 지역별 투표율 가져옴
     * @param {*} state 
     */
    getVoteRate: (state) => {
      return state['voteRate'];
    },

    /**
     * @description 현재 요청중인 이름 가져옴
     * @param {*} state 
     */
    getCurrRequestNm: (state) => {
      return state['currRequestNm'];
    }
  },

  mutations: {

    /**
     * @description 4.15 총선 결과 모바일 페이지 보임 여부 플래그 값 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setShowMobile(state, payload) {
      state.isShowMobile = payload;
    },

    /**
     * @description 레이어 데이터 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setLayerData(state, payload) {
      state.layerData = payload;
    },

    /**
     * @description 레이어 스타일 설정
     * @param {*} state
     * @param {*} payload
     */
    setLayerStyle(state, payload) {
      state.layerStyle = payload;
    },

    /**
     * @description mousemove 설정
     * @param {*} state
     * @param {*} payload
     */
    setMousemove(state, payload) {
      state.mousemove = payload;
    },

    /**
     * @description mouseover 설정
     * @param {*} state
     * @param {*} payload
     */
    setMouseover(state, payload) {
      state.mouseover = payload;
    },
    /**
     * @description mouseout 설정
     * @param {*} state
     * @param {*} payload
     */
    setMouseout(state, payload) {
      state.mouseout = payload;
    },

    /**
     * @description click 설정
     * @param {*} state
     * @param {*} payload
     */
    setClick(state, payload) {
      state.click = payload;
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
     * @description 선거구 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setSggs(state, payload) {
      state.sggs = payload;
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
     * @description 선거구 코드 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggCd(state, payload) {
      state.sggCd = payload;
    },

    /**
     * @description 선거구 의석수 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggSeats(state, payload) {
      state.sggSeats = payload;
    },

    /**
     * @description 선거구 결과 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggResult(state, payload) {
      state.sggResult = payload;
    },

    /**
     * @description 선거구 비교 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggCompare(state, payload) {
      state.sggCompare = payload;
    },

    /**
     * @description 선거구 비례대표 의석수 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggPartySeats(state, payload) {
      state.sggPartySeats = payload;
    },

    /**
     * @description 선거구 비례대표 결과 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggPartyResult(state, payload) {
      state.sggPartyResult = payload;
    },

    /**
     * @description 선거구 비례대표 비교 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggPartyCompare(state, payload) {
      state.sggPartyCompare = payload;
    },

    /**
     * @description 지역별 투표율 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setVoteRate(state, payload) {
      state.voteRate = payload;
    },

    /**
     * @description 현재 요청중인 이름 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setCurrRequestNm(state, payload) {
      state.currRequestNm = payload;
    }
  },

  actions: {

    /**
     * @description 지도 영역 설정
     * @param {*} context
     */
    setAsyncAreaMaps(context, payload) {

      const currRequestNm = payload.currRequestNm;
      const options = payload.options;
      const rgnClss = payload.rgnClss

      context.commit('setCurrRequestNm', currRequestNm);

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state['electionAllMap']["dataURL"], {
          rgnclss: rgnClss,
        }).then(result => {
          const data = result["data"];

          if (data.length === 0) return;
          if (context.state.currRequestNm !== currRequestNm) return;

          const cleanData = options.clean(data);
          context.commit('setLayerData', cleanData);
          context.commit('setLayerStyle', options.layerStyle);
          context.commit('setMousemove', options.mousemove);
          context.commit('setMouseover', options.mouseover);
          context.commit('setMouseout', options.mouseout);
          context.commit('setClick', options.click);

          resolve(cleanData);
        });
      });
    },

    /**
     * @description 선거구 지도 설정
     * @param {*} context
     */
    setAsyncSggMaps(context, payload) {
      const params = {
        rgnclss: payload.rgnClss,
        diff: payload.diff,
        year: 2020
      };

      if (payload.megaCd >= 0) params.megacd = payload.megaCd;

      const currRequestNm = payload.currRequestNm;
      const options = payload.options;

      context.commit('setCurrRequestNm', currRequestNm);

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state['electionMap']["dataURL"], params).then(result => {
          const data = result["data"];

          if (data.length === 0) return;
          if (context.state.currRequestNm !== currRequestNm) return;

          const cleanData = options.clean(data);
          context.commit('setLayerData', cleanData);
          context.commit('setLayerStyle', options.layerStyle);
          context.commit('setMousemove', options.mousemove);
          context.commit('setMouseover', options.mouseover);
          context.commit('setMouseout', options.mouseout);
          context.commit('setClick', options.click);

          resolve(cleanData);
        });
      });
    },

    /**
     * @description 비례대표 지도 설정
     * @param {*} context
     */
    setAsyncPartyMaps(context, payload) {

      const params = {
        rgnclss: payload.rgnClss,
        diff: payload.diff,
        year: 2020
      };

      if (payload.megaCd >= 0) params.megacd = payload.megaCd;

      const currRequestNm = payload.currRequestNm;
      const options = payload.options;

      context.commit('setCurrRequestNm', currRequestNm);

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state['electionParty']["dataURL"], params).then(result => {
          const data = result["data"];


          if (data.length === 0) return;
          if (context.state.currRequestNm !== currRequestNm) return;

          const cleanData = options.clean(data);
          context.commit('setLayerData', cleanData);
          context.commit('setLayerStyle', options.layerStyle);
          context.commit('setMousemove', options.mousemove);
          context.commit('setMouseover', options.mouseover);
          context.commit('setMouseout', options.mouseout);
          context.commit('setClick', options.click);

          resolve(cleanData);
        });
      });
    },

    /**
     * @description 광역시/도 리스트 설정
     * @param {*} context
     */
    setAsyncMegas(context, payload) {

      context.commit('setMegas', []);

      payload = payload === undefined ? "Y" : payload;
      mixin.methods.getData(context.state['regionList']["dataURL"], {
        rgnclss: "H1",
        ban: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setMegas', data);
      });
    },

    /**
     * @description 광역시도 대한 선거구 데이터 설정 
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggsFromMega(context, payload) {
      if (payload < 0) return;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["electionArea"]["dataURL"], {
            megacd: payload
          })
          .then(result => {
            const data = result["data"];

            context.commit('setSggs', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 선거구 의석수 데이터 설정 
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggSeats(context, payload) {

      const year = payload.year;
      const megaCd = payload.megaCd;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["eResultSeatCnt"]["dataURL"], {
            megacd: megaCd,
            year: year
          })
          .then(result => {
            const data = result["data"];

            context.commit('setSggSeats', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 선거구 결과 데이터 설정 
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggResult(context, payload) {

      const year = payload.year;
      const megaCd = payload.megaCd;
      const diff = payload.diff;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["eResultList"]["dataURL"], {
            megacd: megaCd,
            diff: diff,
            year: year
          })
          .then(result => {
            const data = result["data"];

            context.commit('setSggResult', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 선거구 비교 데이터 설정 
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggCompare(context, payload) {

      const year = payload.year;
      const sggCd = payload.sggCd;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["eResultDetail"]["dataURL"], {
            sggcd: sggCd,
            year: year
          })
          .then(result => {
            const data = result["data"];

            context.commit('setSggCompare', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 선거구 비례대표 의석수 데이터 설정 
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggPartySeats(context, payload) {

      const year = payload.year;
      const megaCd = payload.megaCd;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["ePartySeatCnt"]["dataURL"], {
            megacd: megaCd,
            year: year
          })
          .then(result => {
            const data = result["data"];

            context.commit('setSggPartySeats', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 선거구 비례대표 결과 데이터 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggPartyResult(context, payload) {

      const year = payload.year;
      const megaCd = payload.megaCd;
      const diff = payload.diff;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["ePartyList"]["dataURL"], {
            megacd: megaCd,
            diff: diff,
            year: year
          })
          .then(result => {
            const data = result["data"];

            context.commit('setSggPartyResult', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 선거구 비례대표 비교 데이터 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggPartyCompare(context, payload) {

      const year = payload.year;
      const sggCd = payload.sggCd;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["ePartyDetail"]["dataURL"], {
            sggcd: sggCd,
            year: year
          })
          .then(result => {
            const data = result["data"];

            context.commit('setSggPartyCompare', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 지역별 투표율 데이터 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncVoteRate(context, payload) {

      const megaCd = payload.megaCd;
      const year = payload.year;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["electionResult"]["dataURL"], {
            megacd: megaCd,
            year: year
          })
          .then(result => {
            const data = result["data"];

            context.commit('setVoteRate', data);
            resolve(data);
          });
      });
    }
  }
};
