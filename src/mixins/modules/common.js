import axios from "axios";
import _ from "lodash";
import querystring from "querystring";
export default {
  methods: {
    /**
     * @description json 타입 데이터 가져옴
     * @param {String url}: url
     * @param {Object query}: querystring
     */
    getData(url, query) {

      if (!url) {
        alert('url이 없습니다!');
        return;
      }

      const encQuery = querystring.encode(query, "&"); // 쿼리스트링

      return new Promise(function (resolve, reject) {
        axios.get(encQuery ? url + '?' + encQuery : url).then(result => {
          resolve(result);
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
        date.getMonth().toString().length === 1 ?
        "0" + date.getMonth() :
        date.getMonth().toString();
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

    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
