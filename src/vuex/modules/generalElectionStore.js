import mixin from "@/mixins";
import { stat } from "fs";

export default {
  namespaced: true,
  state: {
    "regionList": {
      dataNm: "지역리스트",
      dataURL: "/api/vote/regionList",
      dataQuery: {},
      dataLoc: ""
    },

    "getFullName": {
      dataNm: "지역명(전체)",
      dataURL: "/api/vote/getFullName",
      dataQuery: {},
      dataLoc: ""
    },

    "getUpdate": {
      dataNm: "데이터 최신날짜",
      dataURL: "/api/vote/getUpdate",
      dataQuery: {},
      dataLoc: ""
    },

    "bsnsKeywords": {
      dataNm: "사업주요키워드",
      dataURL: "/api/vote/bsnsKeywords",
      dataQuery: {},
      dataLoc: ""
    },

    "totBudget": {
      dataNm: "예산현액",
      dataURL: "/api/vote/totBudget",
      dataQuery: {},
      dataLoc: ""
    },

    "realmBud": {
      dataNm: "분야별 예산현액",
      dataURL: "/api/vote/realmBud",
      dataQuery: {},
      dataLoc: ""
    },

    "recomIdx": {
      dataNm: "스마트 추천키워드",
      dataURL: "/api/vote/recomIdx",
      dataQuery: {},
      dataLoc: ""
    },

    "candiList": {
      dataNm: "후보자 리스트",
      dataURL: "/api/vote/candiList",
      dataQuery: {},
      dataLoc: ""
    },

    "candiNews": {
      dataNm: "후보자 관련 기사 리스트",
      dataURL: "/api/vote/candiNews",
      dataQuery: {},
      dataLoc: ""
    },

    "electionArea": {
      dataNm: "행정동 선거구 리스트",
      dataURL: "/api/vote/electionArea",
      dataQuery: {},
      dataLoc: ""
    },

    "getCode": {
      dataNm: "필터 공약 분야 리스트",
      dataURL: "/api/vote/getCode",
      dataQuery: {},
      dataLoc: ""
    },

    "radar1": {
      dataId: "radar",
      dataNm: "모바일 방사차트",
      dataURL: "/api/vote/realmIdxs",
      dataQuery: {
        ctycd: ""
      },
      dataLoc: "",
      dataRootLoc: "",
      controlLayout: (element) => { },
      clean: (data) => {

        if (data.length === 0) return [];

        const cleanData = {
          chartData: [],
          axisData: []
        };

        const tmpArr = [];
        data["idx"].reduce((acc, v, i) => {
          const subValue = data["idx_simr"].filter(item => item.realm_cd === v["realm_cd"])[0]["idx_value"];
          const obj = {
            name: v["realm_nm"] + " " + Math.round(v["idx_value"] * 10) / 10,
            category: v["realm_cd"],
            value: v["idx_value"],
            text: ' (유사지자체: ' + Math.round(`${subValue}` * 10) / 10 + ')'
            // text: `${mixin.methods.changeWonUnit(v["idx_value"])}(${subValue})`
          }
          tmpArr.push(obj);
          cleanData["axisData"].push(obj);
        }, [])

        cleanData["chartData"].push(tmpArr)

        return cleanData;
      },
      chartOption: {
        ticks: 4,
        margin: {
          top: 80,
          right: 100,
          bottom: 80,
          left: 100
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
        pointWidth: 1.5
      }
    },

    "radar3": {
      dataId: "radar",
      dataNm: "모바일 방사차트",
      dataURL: "/api/vote/realmIdxs",
      dataQuery: {},
      dataLoc: "",
      dataRootLoc: "",
      chartOption: {
        ticks: 4,
        margin: {
          top: 40,
          right: 35,
          bottom: 40,
          left: 35
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
        pointWidth: 1.5
      }
    },

    "radar2": {
      dataId: "radar",
      dataNm: "웹 방사차트",
      dataURL: "/api/vote/realmIdxs",
      dataQuery: {},
      dataLoc: "",
      dataRootLoc: "",
      chartOption: {
        ticks: 4,
        margin: {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40
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
        pointWidth: 1.5
      }
    },
    "wordcloud1": {
      dataId: "wordcloud1",
      dataNm: "공약 주요 키워드 워드클라우드",
      dataURL: "/api/vote/candidateWords",
      dataQuery: {},
      dataLoc: "",
      dataRootLoc: "",
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

    isShowMobile: false,  // 4.15 총선 페이지 보임 여부 플래그 값
    megas: [], // 광역시/도 배열
    citys: [], // 시군구 배열
    admis: [], // 행정동 배열
    sgg: [], // 선거구 배열
    candidates: [], // 후보자들
    news: [],
    newsTot: [],
    voteDate: "",
    businessKeywords: [],
    totalBudget: 0,
    realmBuds: [],
    smartKeywords: [],
    filterRealms: [],
    megaCd: -1,
    cityCd: -1,
    admiCd: -1,
    sggCd: -1,
    fullName: "",
    radars: [],
    wordcloud: []
  },

  getters: {

    /**
     * @description 지역명(전체) 가져옴
     */
    getFullName: (state) => {
      return state["fullName"];
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
     * @description 선거구 코드 가져옴
     * @param {*} state 
     */
    getSggCd: (state) => {
      return state['sggCd'];
    },

    /**
     * @description 총선 페이지 보임 여부
     * @param {*} state
     */
    getIsShowMobile: (state) => {
      return state['isShowMobile'];
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

    /**
     * @description 선거구 배열 가져옴
     * @param {*} state
     */
    getSgg: (state) => {
      return state["sgg"];
    },

    /**
     * @description 후보자 리스트 배열 가져옴
     * @param {*} state
     */
    getCandidates: (state) => {
      return state["candidates"];
    },

    /**
     * @description 관련기사 배열 가져옴
     * @param {*} state
     */
    getNews: (state) => {
      return state["news"];
    },

    /**
     * @description 관련기사 전체건수 가져옴
     * @param {*} state
     */
    getNewsTot: (state) => {
      return state["newsTot"];
    },

    /**
     * @description 기준날짜 텍스트 가져옴
     * @param {*} state
     */
    getVoteDate: (state) => {
      return state["voteDate"];
    },

    /**
     * @description 사업주요키워드 배열 가져옴
     * @param {*} state
     */
    getBusinessKeywords: (state) => {
      return state["businessKeywords"];
    },

    /**
     * @description 예산현액 가져옴
     * @param {*} state
     */
    getTotalBudget: (state) => {
      return state["totalBudget"];
    },

    /**
     * @description 분아별 예산현액 배열 가져옴
     * @param {*} state
     */
    getRealmBuds: (state) => {
      return state["realmBuds"];
    },

    /**
     * @description 스마트 추천 키워드 배열  가져옴
     * @param {*} state
     */
    getSmartKeywords: (state) => {
      return state["smartKeywords"];
    },

    /**
     * @description 필터 분야리스트 배열 가져옴
     * @param {*} state
     */
    getFilterRealms: (state) => {
      return state["filterRealms"];
    },

    /**
     * @description 필터 분야리스트 배열 가져옴
     * @param {*} state
     */
    getRadars: (state) => {
      return state["radars"];
    },
    /**
     * @description 필터 후보자별 주요키워드 배열 가져옴
     * @param {*} state
     */
    getCandidKeywords: (state) => {
      return state["wordcloud"];
    },
  },

  mutations: {

    /**
     * @description 지역명(전체) 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setFullName(state, payload) {
      state.fullName = payload;
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
     * @description 선거구 코드 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setSggCd(state, payload) {
      state.sggCd = payload;
    },

    /**
     * @description 총선 페이지 모바일 보임 여부 플래그값 설정
     * @param {*} state 
     * @param {*} payload 
     */
    setShowMobile(state, payload) {
      state.isShowMobile = payload;
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

    /**
     * @description 선거구 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setSggs(state, payload) {
      state.sgg = payload;
    },

    /**
     * @description 후보자 리스트 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setCandidates(state, payload) {
      state.candidates = payload;
    },

    /**
     * @description 관련기사 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setNews(state, payload) {
      state.news = payload;
    },

    /**
     * @description 관련기사 전체건수 설정
     * @param {*} state
     * @param {*} payload
     */
    setNewsTot(state, payload) {
      state.newsTot = payload;
    },

    /**
     * @description 기준날짜 텍스트 설정
     * @param {*} state
     * @param {*} payload
     */
    setVoteDate(state, payload) {
      state.voteDate = payload;
    },

    /**
     * @description 사업주요키워드 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setBsnsKeywords(state, payload) {
      state.businessKeywords = payload;
    },

    /**
     * @description 예산현액 설정
     * @param {*} state
     * @param {*} payload
     */
    setTotBudget(state, payload) {
      state.totalBudget = payload;
    },

    /**
     * @description 분아별 예산현액 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setRealmBuds(state, payload) {
      state.realmBuds = payload;
    },

    /**
     * @description 스마트 추천 키워드 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setSmartKeywords(state, payload) {
      state.smartKeywords = payload;
    },

    /**
     * @description 필터 분야리스트 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setFilterRealms(state, payload) {
      state.filterRealms = payload;
    },

    /**
     * @description 방사차트 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setRadars(state, payload) {
      state.radars = payload;
    },
    /**
     * @description 방사차트 배열 설정
     * @param {*} state
     * @param {*} payload
     */
    setCandidKeywords(state, payload) {
      state.wordcloud = payload;
    },
  },

  actions: {

    /**
     * @description 지역명(전체) 설정
     * @param {*} context
     */
    setFullName(context, payload) {

      mixin.methods.getData(context.state['getFullName']["dataURL"], {
        rgnclss: "H3",
        id: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setFullName', data);
      });
    },

    /**
     * @description 광역시/도 리스트 설정
     * @param {*} context
     */
    setAsyncMegas(context, payload) {

      context.commit('setMegas', []);
      context.commit('setCitys', []);
      context.commit('setAdmis', []);

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
     * @description 시군구 리스트 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncCitys(context, payload) {

      if (payload < 0) return;

      context.commit('setCitys', []);
      context.commit('setAdmis', []);
      // console.log("setAsyncCitys!!");
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

      // console.log("setAsyncAdmis!!");
      mixin.methods.getData(context.state['regionList']["dataURL"], {
        rgnclss: "H4",
        odby: "nm",
        parentId: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setAdmis', data);
      });
    },

    /**
     * @description 시군구에 대한 선거구 데이터 설정 
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSggsFromCity(context, payload) {
      if (payload < 0) return;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["electionArea"]["dataURL"], { ctycd: payload })
          .then(result => {
            const data = result["data"];

            context.commit('setSggs', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 행정동에 대한 선거구 데이터 설정 
     * @param {*} context
     * @param {*} payload
     */
    setSggAdmiList(context, payload) {
      if (payload < 0) return;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["electionArea"]["dataURL"], { admicd: payload })
          .then(result => {
            const data = result["data"];

            context.commit('setSggs', data);
            resolve(data);
          });
      });
    },

    /**
     * @description 후보자 리스트 배열 세팅
     * @param {*} context
     * @param {*} payload
     */
    setAsyncCandidates(context, payload) {

      if (payload < 0) return;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["candiList"]["dataURL"], { sggcd: payload }).then(
          result => {
            const data = result["data"];

            context.commit('setCandidates', data);

            resolve(data);
          }
        );
      });

    },

    /**
     * @description 관련기사 배열 세팅
     * @param {*} context
     * @param {*} payload
     */
    setAsyncNews(context, payload) {

      if (!payload) return;

      const candiNm = payload.candiNm;
      const sPage = payload.sPage || 1;
      const totCnt = payload.totCnt;
      const party = payload.party;
      const params = {};

      params["candinm"] = candiNm;
      params["spage"] = sPage;
      params["party"] = party;

      totCnt ? params["totCnt"] = totCnt : "";

      mixin.methods.getData(context.state["candiNews"]["dataURL"], params).then(
        result => {
          const data = result["data"];

          context.commit('setNews', data["article"]);
          context.commit('setNewsTot', data["total"])
        }
      );
    },

    /**
     * @description 기준날짜 텍스트 세팅
     * @param {*} context
     * @param {*} payload
     */
    setAsyncVoteDate(context, payload) {
      mixin.methods.getData(context.state["getUpdate"]["dataURL"], {}).then(result => {
        const data = result["data"];

        context.commit('setVoteDate', data["stdr_date"].join("~"));
      });
    },

    /**
     * @description 사업주요키워드 배열 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncBsnsKeywords(context, payload) {

      if (payload < 0) return;

      mixin.methods.getData(context.state["bsnsKeywords"]["dataURL"], {
        ctycd: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        const tmpArr = [];

        data.reduce((acc, v, i) => {
          tmpArr.push(v["excut_word"]);
        }, []);

        context.commit('setBsnsKeywords', tmpArr);
      });
    },

    /**
     * @description 예산현액 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncTotBudget(context, payload) {

      if (payload < 0) return;

      mixin.methods.getData(context.state["totBudget"]["dataURL"], {
        ctycd: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setTotBudget', data[0].value);
      });
    },

    /**
     * @description 분아별 예산현액 배열 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncRealmBuds(context, payload) {

      if (payload < 0) return;

      mixin.methods.getData(context.state["realmBud"]["dataURL"], {
        ctycd: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        context.commit('setRealmBuds', data);
      });
    },

    /**
     * @description 스마트 추천 키워드 배열 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncSmartKeywords(context, payload) {

      if (payload < 0) return;

      mixin.methods.getData(context.state["recomIdx"]["dataURL"], {
        ctycd: payload
      }).then(result => {
        const data = result["data"];

        if (data.length === 0) return;

        const tmpArr = [];

        data.reduce((acc, v, i) => {
          tmpArr.push(v["idxnm"]);
        }, []);

        context.commit('setSmartKeywords', tmpArr);
      });
    },

    /**
     * @description 필터 분야리스트 배열 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncFilterRealms(context, payload) {
      mixin.methods.getData(context.state["getCode"]["dataURL"], { groupcd: "cddtIdx" }).then(
        result => {

          const data = result["data"];

          context.commit('setFilterRealms', data);
        }
      );
    },

    /**
     * @description 공약 키워드 워드클라우드
     * @param {*} context
     * @param {*} payload
     */
    setAsyncCandidKeywords(context, payload) {
      if (payload < 0) return;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["wordcloud1"]["dataURL"], {
          sggcd: payload.sggcd,
          num: payload.num
        }).then(result => {
          const data = result["data"];

          if (data.length === 0) return;

          const tmpArr = [];
          const valueMin = Math.min(...data.map(d => d["rank"])); // 최댓값
          const valueMax = Math.max(...data.map(d => d["rank"])); // 최댓값

          const scale = d3.scale.linear().domain([valueMax, valueMin]).range([12, 5]); // 범위 함수

          // 데이터 정제
          data.reduce((acc, v, i) => {
            let word = v["kwd"]; // 단어
            let value = Math.round(scale(v["rank"])); // 사이즈

            tmpArr[i] = [word, value];

          }, []);

          context.commit('setCandidKeywords', tmpArr);

          resolve(tmpArr);
        });

      });
    },

    /**
     * @description 방사차트 배열 설정
     * @param {*} context
     * @param {*} payload
     */
    setAsyncRadars(context, payload) {

      if (payload < 0) return;

      return new Promise((resolve, reject) => {
        mixin.methods.getData(context.state["radar1"]["dataURL"], { ctycd: payload }).then(
          result => {

            const data = result["data"];
            if (data.length === 0) return [];

            const cleanData = {
              chartData: [],
              axisData: []
            };

            const tmpArr = [];

            data["idx"].reduce((acc, v, i) => {
              const subValue = data["idx_simr"].filter(item => item.realm_cd === v["realm_cd"])[0]["idx_value"];
              const obj = {
                name: v["realm_nm"] + " " + Math.round(v["idx_value"] * 10) / 10,
                category: v["realm_cd"],
                value: v["idx_value"],
                text: ' (유사지자체: ' + Math.round(`${subValue}` * 10) / 10 + ')'
              }
              tmpArr.push(obj);
              cleanData["axisData"].push(obj);
            }, [])

            cleanData["chartData"].push(tmpArr)

            context.commit('setRadars', cleanData);

            resolve(cleanData);
          }
        );
      });
    }
  }
};
