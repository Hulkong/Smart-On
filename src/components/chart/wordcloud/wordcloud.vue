<template>
  <div class="chart wordcloud_container"></div>
</template>
<script>
// import json from "./sample-data.json";
import WordCloud from "wordcloud";
export default {
  name: "wordcloud",

  props: { options: Object },

  data() {
    return {};
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
      if (!data || data.length === 0) return; // 데이터가 없을 경우 리턴

      // vue 컴포넌트 내장 데이터
      const element = this.$el;
      const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis

      let width = Number(
        d3
          .select(element)
          .style("width")
          .replace("px", "")
      );
      let height = Number(
        d3
          .select(element)
          .style("height")
          .replace("px", "")
      );

      const svg = d3
        .select(element)
        .append("svg")
        .attr("id", 1)
        .attr("width", width)
        .attr("height", height);

      const canvas = svg
        .append("canvas")
        .attr("class", "word_cloud")
        .attr("width", width)
        .attr("height", height);

      const wordcloudOptions = {
        list: data,
        // gridSize: Math.round(
        //   (16 * document.getElementById("word_cloud").offsetWidth) / 1024
        // ),
        // weightFactor(size) {
        //   return (
        //     (Math.pow(size, 1.9) *
        //       document.getElementById("word_cloud").offsetWidth) /
        //     1024
        //   );
        // },
        shape: "star",
        backgroundColor: "rgb(255, 255, 255, 0)"
      };

      //   WordCloud.minFontSize = "15px";
      let a = WordCloud(element, wordcloudOptions);
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      // 차트 삭제
      d3.select(this.$el)
        .select("svg")
        .remove();
    }
  }
};
</script>
<style scoped>
.wordcloud_container {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>