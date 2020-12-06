/** 
 * @description 도시현황 - 집행된 세부사업 그리드 컴포넌트
 */ 
<template>
  <div class="chart grid">
    <tooltip ref="tooltip"></tooltip>
    <div ref="_table"></div>
    <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>
  </div>
</template>
<script>
import Grid from "@/library/tui-grid"; // toast grid UI 컴포넌트
import Tooltip from "@/components/chart-tooltip";

export default {
  name: "grid", // 컴포넌트 이름

  props: { options: Object },

  data() {
    return {
      copyData: null,
      gridOptions: {},
      cleanData: []
    };
  },

  components: {
    tooltip: Tooltip
  },

  created() {},

  mounted() {},

  // 뷰
  template: "",

  methods: {
    /**
     * @description 차트 그리는 함수
     * @param {Array data}: 데이터
     * @param {Object options}: 옵션
     */
    draw(data, options) {
      if (data.length === 0) data = [];

      Grid.applyTheme("striped", this.getDefaultStyle()); // 그리드 스타일 세팅

      const that = this;
      const gridOption = options.gridOption; // 그리드 생성자 옵션데이터
      const onMouseClick = options.onMouseClick; // 그리드 데이터
      const onMouseEnter = options.onMouseEnter; // 그리드 데이터
      const customStyle = options.style; // 그리드 커스텀 스타일

      gridOption.el = this.$refs["_table"];
      gridOption.columns = options.headerData; // 그리드 헤더 데이터
      gridOption.data = data; // 그리드 데이터

      this.grid = new Grid(gridOption);
      this.addAbbreviation(data, onMouseEnter.key); // 긴 문장 줄임말 표시

      // 커스텀 스타일 있을 경우 설정
      if (customStyle) {
        this.setCustomStyle(customStyle);
      }

      // 커스텀 클릭이벤트 사용시
      if (onMouseClick.using) {
        this.bindMouseClickEvent(onMouseClick.callback);
      }

      // 커스텀 마우스엔터이벤트 사용시
      if (onMouseEnter.using) {
        this.bindScrollEvent(this.triggerAfterScroll(data)); // 스크롤 이벤트 바인딩
        this.bindMouseEnterEvent(onMouseEnter.callback, onMouseEnter.key);
      }
    },

    /**
     * @description 스크롤 이벤트 후 실행될 트리거 함수
     * @param {Array} data 그리드 데이터
     * @returns {Function} callback 함수
     */
    triggerAfterScroll(data) {
      if (!data || data.length.length === 0) return;

      const that = this;
      const onMouseEnter = this.options.onMouseEnter;

      return () => {
        that.addAbbreviation(data, onMouseEnter.key); // 긴 문장 줄임말 표시
        that.unbindMouseEnterEvent(); // 마우스엔터이벤트 언바인딩
        that.bindMouseEnterEvent(onMouseEnter.callback, onMouseEnter.key); // 마우스엔터이벤트 바인딩
      };
    },

    /**
     * @description 긴 문장 줄임말 표시 메소드
     * @param {Array} data 그리드 데이터
     * @param {String} key 적용 대상 컬럼 key
     */
    addAbbreviation(data, key) {
      if (!key) return;
      const that = this;
      const container = this.$el.getElementsByClassName(
        "tui-grid-rside-area"
      )[0];

      if (!container) return;

      const ths = Array.from(container.getElementsByTagName("th"));
      const targetTH = ths.filter(
        item => item.dataset["columnName"] === key
      )[0];

      const allowLength = targetTH.offsetWidth / 13;

      data.reduce((acc, v, i) => {
        if (v[key] && v[key].length > allowLength) {
          v[key] = v[key].substr(0, allowLength) + "...";
        }
      }, []);

      that.grid.resetData(data);
    },

    /**
     * @description 스크롤이벤트 바인딩하는 메소드
     * @param {Function} callback 콜백함수
     */
    bindScrollEvent(callback = () => {}) {
      const that = this;
      const container = this.$el.getElementsByClassName(
        "tui-grid-rside-area"
      )[0];

      if (!container) return;

      const scrollArea = container.getElementsByClassName(
        "tui-grid-body-area"
      )[0]; // 스크롤 대상 영역

      scrollArea.onscroll = _.debounce(callback, 300); // 디바운스 적용
    },

    /**
     * @description 마우스엔터이벤트 바인딩하는 메소드
     * @param {Function} callback 콜백함수
     * @param {String} key 적용 대상 컬럼 key
     */
    bindMouseEnterEvent(callback = () => {}, key) {
      const that = this;

      // 그리드 리렌더링하는데 약간의 시간소요가 필요함
      setTimeout(() => {
        const container = that.$el.getElementsByClassName(
          "tui-grid-rside-area"
        )[0];

        if (!container) return;

        const trOdds = Array.from(
          container.getElementsByClassName("tui-grid-row-odd")
        );
        const trEvens = Array.from(
          container.getElementsByClassName("tui-grid-row-even")
        );
        const trs = trOdds.concat(trEvens);

        for (let i = 0; i < trs.length; i++) {
          trs[i].onmouseenter = that.onMouseEnter.bind(null, key);
          trs[i].onmouseleave = that.mouseleave;
        }
      }, 300);
    },

    /**
     * @description 마우스엔터이벤트 언바인딩하는 메소드
     */
    unbindMouseEnterEvent() {
      const that = this;
      const container = this.$el.getElementsByClassName(
        "tui-grid-rside-area"
      )[0];

      if (!container) return;

      const trOdds = Array.from(
        container.getElementsByClassName("tui-grid-row-odd")
      );
      const trEvens = Array.from(
        container.getElementsByClassName("tui-grid-row-even")
      );
      const trs = trOdds.concat(trEvens);

      for (let i = 0; i < trs.length; i++) {
        trs[i].onmouseenter = null;
        trs[i].onmouseleave = null;
      }
    },

    /**
     * @description 마우스엔터이벤트 바인딩하는 메소드
     * @param {String} key 적용 대상 컬럼 key
     * @param {Event} event 네이티브 이벤트
     */
    onMouseEnter(key, event) {
      const dataIndex = event.target.getElementsByTagName("td")[0].dataset[
        "rowKey"
      ];
      const data = JSON.parse(this.copyData);
      const value = data[dataIndex][key];
      const params = {
        title: value,
        contents: [],
        color: "black"
      };

      if (!this.$refs["tooltip"]) return;

      this.$refs["tooltip"].mouseenter(this.$el, params);

      const tds = Array.from(event.target.getElementsByTagName("td"));
      const td = tds.filter(
        element => element.dataset["columnName"] === key
      )[0];
      const tooltipDOM = this.$el.getElementsByClassName("_tooltip")[0];

      const x = Math.round(td.getBoundingClientRect().x);
      const y = Math.round(td.getBoundingClientRect().y);

      tooltipDOM.style.left =
        x -
        tooltipDOM.getBoundingClientRect().width / 2 +
        td.getBoundingClientRect().width / 2 +
        "px";
      tooltipDOM.style.top = y - 40 + "px";
    },

    /**
     * @description 마우스리브이벤트 바인딩하는 메소드
     */
    mouseleave() {
      if (!this.$refs["tooltip"]) return;
      this.$refs["tooltip"].mouseleave(this.$el);
    },

    /**
     * @description 커스텀 클릭 이벤트 바인딩하는 메소드
     * @param {Function} callback 커스텀 클릭 이벤트 리스너
     */
    bindMouseClickEvent(callback = () => {}) {
      const that = this;
      const container = this.$el;

      if (!container) return;

      this.grid.on("click", function(e) {
        if (e.rowKey !== undefined) {
          const gridData = that.grid.getRow(e.rowKey);
          callback(gridData, that);
        }
      });

      container.classList.add("useClick");
    },

    /**
     * @description 커스텀 스타일 적용하는 메소드
     * @param {Object} customStyle 커스텀 스타일
     */
    setCustomStyle(customStyle) {
      // 헤더 세팅인 경우
      if (customStyle.head) {
        this.setHeadStyle(customStyle.head);
      }

      // 바디 세팅인 경우
      if (customStyle.body) {
        this.setBodyStyle(customStyle.body);
      }
    },

    /**
     * @description 커스텀 헤드 스타일 설정하는 메소드
     * @param {String} color 색상
     */
    setHeadStyle(color) {
      const container = this.$el;
      const headDOM = container.getElementsByClassName("tui-grid-header-area");

      for (let i = 0; i < headDOM.length; i++) {
        headDOM[i].style.backgroundColor = color;
      }
    },

    /**
     * @description 커스텀 바디 스타일 설정하는 메소드
     * @param {Object} 바디 색상(짝수 / 홀수)
     */
    setBodyStyle(body) {
      const container = this.$el;
      const bodyDOM = container.getElementsByClassName("tui-grid-table");
      const color = body.even;

      for (let i = 0; i < bodyDOM.length; i++) {
        if (color == "#D8DFEA") {
          bodyDOM[i].classList.add("grid-blue");
        } else {
          bodyDOM[i].classList.add("grid-orange");
        }
      }
    },

    /**
     * @description 기본 스타일 가져오는 메소드
     */
    getDefaultStyle() {
      return {
        outline: {
          border: "black",
          showVerticalBorder: true
        },
        grid: {
          background: "#fff",
          border: "#fff",
          text: "#fff"
        },
        selection: {
          background: "transparent",
          border: "transparent"
        },
        toolbar: {
          border: "#ccc",
          background: "#fff"
        },
        scrollbar: {
          background: "#f5f5f5",
          thumb: "#d9d9d9",
          active: "#c1c1c1"
        },
        area: {
          header: {
            background: "#0840B3",
            // border: "red"
            color: "white"
          },
          body: {
            background: "transparent"
          },
          summary: {
            background: "transparent"
          }
        },
        row: {
          even: {
            background: "transparent"
          },
          odd: {
            background: "transparent"
          },
          hover: {
            background: "#ccc"
          }
        },
        cell: {
          normal: {
            background: "#fbfbfb",
            border: "#333333",
            text: "black",
            showHorizontalBorder: true
          },
          header: {
            background: "transparent",
            border: "transparent",
            text: "white"
          },
          editable: {
            background: "red",
            text: "red"
          },
          selectedHead: {
            background: "red"
          },
          selectedRowHeader: {
            background: "red"
          },
          focused: {
            border: "trasparent",
            background: "trasparent"
          },
          focusedInactive: {
            border: "trasparent"
          },
          disabled: {
            text: "#b0b0b0"
          }
        }
      };
    },

    /**
     * @description 그리드 삭제하는 메소드
     */
    remove() {
      const target = this.$refs["_table"];

      if (target.firstChild) target.removeChild(target.firstChild);
    },

    update() {
      var that = this;
      this.getData(this.$props.options["dataURL"]).then(result =>
        that.$data.grid.resetData(result["data"]["data"])
      );
    }
  }
};
</script>
<style src="@/library/tui-grid/dist/tui-grid.min.css"/>

<style scoped>
.grid {
  position: relative;
  width: 100%;
  height: 100%;
}

.grid >>> .tui-grid-layer-state {
  background: transparent;
}

.grid >>> .grid-orange tr.tui-grid-row-odd {
  background: #fff !important;
}

.grid >>> .grid-orange tr.tui-grid-row-even {
  background: #ffe8ca !important;
}

.grid >>> .grid-blue tr.tui-grid-row-odd {
  background: #fff !important;
}

.grid >>> .grid-blue tr.tui-grid-row-even {
  background: #d8dfea !important;
}

.grid >>> tr.tui-grid-row-odd:hover,
.grid >>> tr.tui-grid-row-even:hover,
.grid >>> tr.tui-grid-row-odd:hover,
.grid >>> tr.tui-grid-row-even:hover {
  background: #999ca5 !important;
}

.grid.useClick {
  cursor: pointer;
}

.grid >>> .tui-grid-cell-header.tui-grid-cell-selected {
  background: transparent;
}

.grid >>> ._tooltip ._tooltip_title {
  padding: 3px 15px;
}
</style>