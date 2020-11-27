<template>
  <div class="chart horizontal-bubble-component"></div>
</template>
<script>
export default {
  name: "horizontalBubble",

  props: { options: Object },

  data() {
    return {
      data: [] // 데이터
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
      if (!data || data.length === 0) return; // 데이터가 없을 경우 리턴

      const element = this.$el;
      const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis
      const that = this;
      const width = Number(
        d3
          .select(element)
          .style("width")
          .replace("px", "")
      );
      const height = Number(
        d3
          .select(element)
          .style("height")
          .replace("px", "")
      );

      //serieschart
      const svg = d3
        .select(element)
        .append("svg")
        .attr("id", id)
        .attr("class", "serieschart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //blue layer
      const layer = svg.append("g").attr("class", "layer");

      const circle = layer.selectAll("circle").data(data);
      const cyScale = d3.scale
        .linear()
        .domain([0, data.length])
        .range([0, width - 100]);
      circle
        .enter()
        .append("circle")
        .attr("fill", "#2d4e95")
        .attr("cy", 60)
        .attr("cx", function(d, i) {
          return cyScale(i);
        })
        .attr("r", 40)
        .on("click", function() {
          console.log(that.$route);
          that.click(this);
        });

      circle
        .enter()
        .append("text")
        .text(function(d) {
          return d.text;
        })
        .attr("x", function(d, i) {
          return cyScale(i);
        })
        .attr("y", -70)
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", 0.1)
        .attr("transform", function(d) {
          return "translate(0," + 130 + ")";
        })
        .attr("font-size", 13)
        .attr("font-weight", 400)
        .attr("text-anchor", "middle")
        .append("tspan")
        .text(d => {
          return this.numberWithCommas(d.value);
        })
        .attr("font-size", "8px")
        .attr("font-weight", "bold")
        .attr("x", function(d, i) {
          return cyScale(i);
        })
        .attr("y", -50);
      // circle.exit().remove();
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      d3.select(this.$el)
        .select("svg")
        .remove();
    },

    click(target) {
      var that = this;

      d3.selectAll("circle").attr("class", "");
      d3.select(target).attr("class", "active");

      that.$emit("trigger");
    }
  }
};
</script>
<style scoped>
.horizontal-bubble-component {
  width: 100%;
  height: 100%;
  position: absolute;
}

.horizontal-bubble-component >>> circle {
  fill: #2d4e95;
}

.horizontal-bubble-component >>> circle:hover {
  fill: orange;
  cursor: pointer;
}

.horizontal-bubble-component >>> circle.active {
  fill: orange;
}

.horizontal-bubble-component >>> text:hover {
  cursor: pointer;
}
</style>