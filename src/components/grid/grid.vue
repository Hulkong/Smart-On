/** 
 * @description 도시현황 - 집행된 세부사업 그리드 컴포넌트
 */ 
<template>
  <div class="chart grid"></div>
</template>
<script>
import Grid from "tui-grid"; // toast grid UI 컴포넌트
import tuiGridCss from "tui-grid/dist/tui-grid.css";

export default {
  name: "grid", // 컴포넌트 이름

  props: { options: Object },

  data() {
    return {
      data: [], // 그리드 데이터
      gridHeaderData: [], // 그리드 헤더 데이터
      grid: null
    };
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

      const gridOption = options.gridOption;

      gridOption.el = this.$el;
      gridOption.columns = options.headerData; // 그리드 헤더 데이터
      gridOption.data = data; // 그리드 데이터

      this.$data.grid = new Grid(gridOption);

      // 그리드 스타일 세팅
      Grid.applyTheme("striped", {
        gird: {
          border: "#ff0000",
          text: "#333"
        },
        selection: {
          // background: "red"
        },
        cell: {
          normal: {
            background: "#ff0000"
          },
          disabled: {
            text: "#999"
          }
        },
        row: {
          hover: {
            // background: "red"
          }
        }
      });
    },

    /**
     * @description 그리드 삭제하는 메소드
     */
    remove() {
      const target = this.$el;

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
<style scoped>
.grid {
  width: 100%;
  height: 100%;
}
</style>