import router from '../../router';
import axios from "axios";
import querystring from "querystring";

export default {
  methods: {

    /**
     * @description 쿠키 가져오는 메소드
     * @param {*} name 쿠키 속성
     * @returns value 쿠키 값
     */
    getCookie(name) {
      const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return value ? value[2] : null;
    },

    /**
     * @description 쿠기 설정하는 메소드
     * @param {*} name  쿠키 속성
     * @param {*} value 쿠키 값
     * @param {*} day 만료일자
     */
    setCookie(name, value, day) {
      const date = new Date();
      const ONE_DAY = 60 * 60 * 24 * 1000;
      date.setTime(date.getTime() + day * ONE_DAY);
      document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    },

    /**
     * @description 쿠키 삭제하는 메소드
     * @param {*} name 쿠키 속성
     */
    deleteCookie(name) {
      const date = new Date();
      document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
    },

    /**
     * @description searchContents 배열기반 세션스토리지 설정(추후 로직 변경)
     * @param {*} index 배열인덱스
     */
    setSessionValue(index) {
      const contents = this.searchContents[index];
      const querys = contents["query"];
      sessionStorage.setItem('currMainTab', 0);
      sessionStorage.setItem('currSubTab', -1);

      Object.keys(querys).forEach(key => {
        sessionStorage.setItem(key, querys[key]);
      });
    },

    /**
     * @description 지역검색 타이핑(디바운스 적용)
     */
    typingRegion: _.debounce(function (e) {

      // 현재 엔터키가 눌려진 상태이면 리턴
      if (e.keyCode === 13) return;

      const keyword = this.keyword; // 입력된 키워드

      if (keyword.length === 0) {

        this.searchContents = []; // 검색결과 담을 배열
        // alert("검색어를 입력해 주세요!");
        return;
      }

      this.searchRegion();
    }, 400),

    /**
     * @description 지역검색 엔터 타이핑
     */
    typingEnterRegion() {
      const that = this;
      const keyword = this.keyword; // 입력된 키워드

      if (keyword.length === 0) {

        this.searchContents = []; // 검색결과 담을 배열
        // alert("검색어를 입력해 주세요!");
        return;
      }

      this.searchRegion();
    },

    /**
     * @description 지역검색하는 메소드
     */
    searchRegion() {

      return new Promise((resolve, reject) => {

        const that = this;
        let keyword = this.keyword; // 입력된 키워드
        let search_location = this.$route.name

        // 구글 어널리틱스 이벤트
        this.$ga.event(search_location + ' search', 'search', keyword) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드
        // this.$ga.event('region search', 'search', keyword )

        this.getBaseDate(data => {
          let searchUrl = that.regionList["dataURL"]; // 지역 검색결과 URL
          const query = {
            format: 'json',
            keyword: keyword
          }
          // 지역 검색결과 가져옴
          that.getData(searchUrl, query).then(result => {

            resolve();
            that.searchContents = []; // 검색결과 담을 배열

            // 데이터가 없을 경우 디폴트 메시지 출력
            if (result["data"].length === 0) {
              that.searchContents.push({
                id: 0,
                fullName: '"' + keyword + '"' + " 지역은 조회할 수 없습니다.",
                path: "###"
              });

              return;
            }

            // 필요 데이터 정제
            for (let i = 0, max = result["data"].length; i < max; i++) {
              let obj = {
                // edate: nowDate.join(""), // 기준 마지막 날짜
                // sdate: nowDate[0] + nowDate[1] + "01" // 기준 시작 날짜
                sdate: this.getDate("yyyymmdd", data[0]).join(""),
                edate: this.getDate("yyyymmdd", data[1]).join(""),
                start_date: this.getDate("yyyymmdd", data[0]).join(""),
                end_date: this.getDate("yyyymmdd", data[1]).join(""),
                ctycd: result["data"][i]["id"]
              }
              // let nowDate = this.getDate("yyyymmdd"); // 현재시간

              let reportUrl = "/report/cityStatus"; // 리포트 URL

              that.searchContents.push({
                id: result["data"][i].id, // 기본키
                fullName: result["data"][i].full_name, // 지역명
                path: reportUrl, // router 필요 path
                query: obj
              });
            }
          });
        });
      });
    },

    /**
     * @description 데이터 마지막 기준날짜 가져오는 메소드
     * @param {Function callback} 콜백함수
     * @returns {Array} startDate, endDate 데이터 기준날짜 리턴
     */
    getBaseDate(callback) {
      const searchUrl = this.baseDate["dataURL"];

      this.getData(searchUrl).then(result => {
        if (result.length === 0) return;

        const endStr = this.formatYYYYMMDDToDate(result.data[0]["lastdate"]);
        const startDate = new Date(endStr); // 데이터 시작 날짜
        const endDate = new Date(endStr); // 데이터 마지막 날짜


        // startDate.setMonth(endDate.getMonth());
        startDate.setMonth(0); // 1월로 세팅
        startDate.setDate(1); // 1일로 세팅


        if (typeof callback === "function") callback([startDate, endDate]);

        return [startDate, endDate];
      });
    },

    /**
     * @description json 타입 데이터 가져옴
     * @param {String url}: url
     * @param {Object query}: querystring
     */
    getData(path, query) {

      if (!path) {
        console.log('path가 없습니다!');
        return;
      }

      let encQuery = querystring.stringify(query); // 쿼리스트링
      // let backendUrl = "http://localhost:8000"; // 백엔드 호스트네임
      let backendUrl = "http://dev.openmate-on.co.kr:8001"; // 백엔드 호스트네임
      // let backendUrl = "http://115.68.218.0:8000"; // 백엔드 호스트네임

      if (location.hostname.indexOf("smart-on.co.kr") >= 0) {
        backendUrl = location.protocol + "//" + location.hostname;
      }

      const realUrl = backendUrl + path; // domain + path
      const fullUrl = encQuery ? realUrl + '?' + encQuery : realUrl; // 실제 요청 URL

      return new Promise(function (resolve, reject) {
        axios.get(fullUrl).then(result => {
          resolve(result);
        }).catch(e => {
          console.log(e)

          reject(e);
          if (!e.response || !e.response.status) return;
          if (e.response.status !== 404 && e.response.status !== 500) {

            if (location.href.indexOf('error503') < 0)
              router.replace('/error503');
          }
        });
      });
    },

    /**
     * @description d3차트 resize 이벤트 바인딩하는 메소드
     * @param {document element}: 컴포넌트 엘리먼트
     */
    connectResizeEvent(element, vueComponent) {
      if (!element) {
        alert("엘리먼트가 없습니다!");
        return;
      }

      // 지원브라우저: 크롬(o), 파이어폭스(0), IE(x), 사파리(o)
      // ResizeObserver 생성자 호출
      // debounce 사용하여 0.3초 간격으로 마지막 이벤트만 호출하도록 함
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(
          _.debounce(
            function () {
              let id = vueComponent.$props.options.dataId;

              if (!document.getElementById(id)) {
                console.log(id + " unobserve");
                resizeObserver.unobserve(element);
              } else {
                console.log(id + " Size changed");
                vueComponent.remove(element); // d3차트 삭제
                vueComponent.draw(element); // d3차트 생성
              }
            },
            300,
            false
          )
        );

        // 엘리먼트의 크기가 변하면 resizeObserver의 콜백함수 호출
        resizeObserver.observe(element);
      }
    },

    /**
     * @description 시간 구하는 메소드
     * @param {String type} 구분값: yyyy, yyyymm, yyyymmdd
     * @param {Date date} 시간
     */
    getDate(type, date) {
      if (!date) var date = new Date();

      if (!type) var type = "yyyymmdd";

      const year = date.getFullYear().toString();
      const month =
        (date.getMonth() + 1).toString().length === 1 ?
          "0" + (date.getMonth() + 1) :
          (date.getMonth() + 1).toString();
      const day =
        date.getDate().toString().length === 1 ?
          "0" + date.getDate() :
          date.getDate().toString();

      if (type.toLocaleLowerCase() === "yyyy") {
        return [year];
      } else if (type === "yyyymm") {
        return [year, month];
      } else if (type === "yyyymmdd") {
        return [year, month, day];
      }
    },

    /**
     * @description 날짜포맷 세팅하는 메소드
     * @param {String} date 입력 날짜
     * @returns {Date}
     * @example 20191118 -> 2019-11-18
     */
    formatYYYYMMDDToDate(date) {
      return new Date(
        date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2)
      );
    },

    /**
     * @description 3자리 단위로 콤마 추가하는 메소드
     * @param {String} x
     * @returns {String} 
     * @example xxxxxx -> xxx,xxx
     */
    numberWithCommas(x = null) {

      if (!x) return "0";

      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * @description 화폐단위 변경하는 메소드
     * @param {*} won  화폐
     * @returns {String} 단위 붙인 화폐
     */
    changeWonUnit(won) {
      const units = {
        won: "원",
        manwon: "만원",
        ukwon: "억원",
        jo: "조원"
      }
      const cleanWon = "" + won; // 정제된 화폐
      const cleanWonLength = cleanWon.length; // 정제된 화폐길이
      let unit = "won"; // 단위
      let returnInt = 0; // 정수
      let returnDeci = 0; // 소수
      let returnWon = cleanWon; // 리턴할 화폐 
      let classifyPos = 0; // 구분위치

      // 단위가 만원일 경우
      if (cleanWonLength >= 5) {
        classifyPos = cleanWonLength - 5;
        unit = "manwon"

        returnInt = cleanWon.substr(0, classifyPos + 1);
        returnDeci = cleanWon.substr(classifyPos + 1, 2);
        returnWon = returnInt + "." + Math.round(returnDeci / 100);
      }

      // 단위가 억원일 경우
      if (cleanWonLength >= 9) {
        classifyPos = cleanWonLength - 9;
        unit = "ukwon"

        returnInt = cleanWon.substr(0, classifyPos + 1);
        returnDeci = cleanWon.substr(classifyPos + 1, 2);
        returnWon = returnInt + "." + Math.round(returnDeci / 100);
      }

      // 단위가 조일 경우
      if (cleanWonLength >= 13) {
        classifyPos = cleanWonLength - 13;
        unit = "jo"

        returnInt = cleanWon.substr(0, classifyPos + 1);
        returnDeci = cleanWon.substr(classifyPos + 1, 2);
        returnWon = returnInt + "." + Math.round(returnDeci / 100);
      }

      return returnWon + units[unit];
    },

    /**
     * @description 객체 얕은 복사하는 함수
     * @param {Object} obj 복사할 객체
     * @returns {Object} copy 복사된 객체
     */
    cloneObj(obj) {
      if (obj === null || typeof obj !== "object") return obj;

      let copy = obj.constructor();

      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }

      return copy;
    },

    /**
     * @description 이미지 소스 풀 주소 리턴하는 함수
     * @param {*} src 
     */
    getImageUrl(src) {
      try {
        return require('@/assets/images/' + src);
      } catch (error) {
        // console.log(error)
        return require('@/assets/images/common/defalt_img.jpg');
      }

    },

    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },

    rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },

    /**
     * @description 기본 스크롤 이동 메소드
     * @param {*} offset 이동할 위치
     */
    evntDefaultScroll(offset = 0) {

      // 라이프사이클 created 메소드 호출시 최상단으로 이동(vue router는 scrollTop이 캐쉬적용되는 것 같음)
      // ie 제외한 브라우저
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = offset;

        // ie
      } else {
        document.documentElement.scrollTop = offset;
      }
    }
  }
};
