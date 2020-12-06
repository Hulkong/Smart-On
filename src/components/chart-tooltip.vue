<template>
  <div class="_tooltip hidden">
    <div class="_tooltip_container">
      <div class="_tooltip_header">
        <div class="_tooltip_title">aaa</div>
      </div>
      <div class="_tooltip_data_container">
        <div class="_tooltip_data_block">
          <div class="_tooltip_data_name">aaa</div>
          <div class="_tooltip_data_value">aaa</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "tooltip",

  props: {},

  methods: {
    /**
     * @description tooltip 마우스 오버 리스너
     * @param {Element} target tooltip 부모 엘리먼트
     * @param {Object} data tooltip 표현 데이터
     */
    mouseenter(target, data) {
      const tooltip = d3
        .select(target)
        .select("._tooltip")
        .classed("hidden", false);
      const title = data.title; // 제목
      const color = data.color; // 타이틀 색상
      const toolTipWidth = Number(tooltip.style("width").replace("px", "")); // tooltip 너비
      const toolTipHeight = Number(tooltip.style("height").replace("px", "")); // tooltip 높이
      const x = event.clientX - toolTipWidth / 2; // tooltip 정가운데
      const y = event.clientY - toolTipHeight - 15; // tooltip 가장 밑부분

      // tooltip 위치 변경
      tooltip.style({
        left: x + "px",
        top: y + "px"
      });

      // tooltip 데이터 바인딩
      tooltip.select("._tooltip_title").text(title);
      tooltip.select("._tooltip_title").style("color", color);

      const dataContainer = tooltip.select("._tooltip_data_container").html("");
      data.contents.reduce((acc, v, i) => {
        if (i > 0) {
          dataContainer.append("div").attr("class", "_tooltip_data_seperator");
        }
        const block = dataContainer
          .append("div")
          .attr("class", "_tooltip_data_block");

        block
          .append("div")
          .attr("class", "_tooltip_data_name")
          .text(v["name"]);
        block
          .append("div")
          .attr("class", "_tooltip_data_value")
          .text(v["value"]);
      }, []);
    },

    /**
     * @description tooltip 마우스아웃 리스터
     * @param {Element} target tooltip 부모 엘리먼트
     */
    mouseleave(target) {
      const tooltip = d3
        .select(target)
        .select("._tooltip")
        .classed("hidden", true);
    }
  }
};
</script>
<style scoped>
._tooltip {
  color: rgb(68, 68, 68);
  font-family: Nanum Gothic;
  font-weight: 200;
  font-size: 12px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 4px 7px;
  /* position: absolute; */
  position: fixed;
  max-height: 700px;
  z-index: 25;
}

._tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

._tooltip.hidden {
  visibility: hidden;
}

._tooltip >>> ._tooltip_container {
  background-color: rgb(255, 255, 255);
  padding: 6px;
  width: -moz-max-content;
  width: -webkit-max-content;
  width: -o-max-content;
}

._tooltip >>> ._tooltip_header {
  position: relative;
  z-index: 1;
}

._tooltip >>> ._tooltip_title {
  color: rgb(207, 176, 23);
  vertical-align: top;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  z-index: 1;
  font-size: 16px;
  line-height: 17px;
  padding: 3px;
}

._tooltip >>> ._tooltip_data_container {
  overflow-y: auto;
  z-index: -1;
  max-height: 144px;
}

._tooltip >>> ._tooltip_data_block {
  font-size: 12px;
  padding: 3px 6px;
  position: relative;
  color: rgb(0, 0, 0);
}

._tooltip >>> ._tooltip_data_name {
  display: inline-block;
  width: 155px;
  min-height: 14px;
}

._tooltip >>> ._tooltip_data_value {
  display: block;
  position: absolute;
  text-align: right;
  top: 3px;
  right: 6px;
}

._tooltip >>> ._tooltip_data_seperator {
  background-color: rgb(221, 221, 221);
  display: block;
  height: 1px;
  margin: 0px 3px;
}

._tooltip >>> ._tooltip_footer {
  font-size: 10px;
  position: relative;
  text-align: center;
}
</style>