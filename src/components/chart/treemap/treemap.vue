<template>
  <div class="chart treemap_container">
    <div class="tooltip hidden"></div>
  </div>
</template>

<script>
export default {
  name: "treemap",

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

      const element = this.$el;
      const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis
      const width =
        Number(
          d3
            .select(element)
            .style("width")
            .replace("px", "")
        ) -
        margin.left -
        margin.right;
      const height =
        Number(
          d3
            .select(element)
            .style("height")
            .replace("px", "")
        ) -
        margin.top -
        margin.bottom;
      const color = d3.scale.ordinal().range(chartOption.colorArr);
      const svg = d3
        .select(element)
        .style("width", width + "px")
        .style("height", height + "px")
        .append("svg")
        .attr("id", id)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(.5,.5)");
      const nodes = this.tree_map(data, width, height);

      // 정렬
      nodes.sort((a, b) => this.getDepth1value(b) - this.getDepth1value(a));

      const cell = svg
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "cell")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

      cell
        .append("rect")
        .attr("width", d => d.dx + 1.5)
        .attr("height", d => d.dy + 1.5)
        .style("fill", d => color(d.color))
        .style("stroke", d => d3.rgb(color(d.color)).darker(0.6))
        .style("vector-effect", "non-scaling-stroke")
        .style("shape-rendering", "crispEdges")
        .style("transform", "none")
        .on("mouseover", d => {
          let xPosition = d.x + d.dx / 2;
          const yPosition = d.y + d.dy / 2,
            svgW = parseFloat(
              d3
                .select(element)
                .select("svg")
                .attr("width")
            ),
            tooltipN = d3
              .select(element)
              .select(".tooltip")
              .node(),
            tooltipW = tooltipN.getBoundingClientRect().width;
          if (svgW < xPosition + tooltipW) {
            xPosition -= tooltipW;
          }
          d3.select(element)
            .select(".tooltip")
            .style({
              left: xPosition + "px",
              top: yPosition + "px"
            })
            .text(d["name"] + " : " + d["value"]);
          d3.select(element)
            .select(".tooltip")
            .classed("hidden", false);
        })
        .on("mouseout", () =>
          d3
            .select(element)
            .select(".tooltip")
            .classed("hidden", true)
        );

      const text1 = cell
        .append("text")
        .text(d => d.name)
        .attr("x", 0)
        .attr("dy", "0.9em")
        .style("fill", d => {
          let c = color(d.color);

          this.getContrastYIQ(c) == "black"
            ? (c = d3.rgb(c).darker(2))
            : (c = d3.rgb(c).brighter(4.5));

          return c;
        });

      text1.each((d, i) => this.wFontSize(d.name, text1[0][i]));

      const text2 = cell
        .append("text")
        .text(d => d3.round((d.value / this.getRootvalue(d)) * 100, 2) + "%")
        .attr("text-anchor", "middle")
        .attr("x", d => d.dx / 2)
        .attr("y", d => d.dy - d.dy / 20)
        .style("fill", d => {
          let c = color(d.color);

          this.getContrastYIQ(c) == "black"
            ? (c = d3.rgb(c).darker(2))
            : (c = d3.rgb(c).brighter(4.5));

          return c;
        });

      text2.each((d, i) => {
        const str = d3.round((d.value / this.getRootvalue(d)) * 100, 2) + "%";
        this.wFontSize(str, text2[0][i], true);
      });
    },

    groupData: (data, nestArr) => {
      let d,
        i,
        j,
        k,
        len,
        len1,
        n,
        strippedData,
        val,
        groupedData = d3.nest();

      for (i = 0, len = nestArr.length; i < len; i++) {
        n = nestArr[i];

        (function(n) {
          return groupedData.key(function(d) {
            return d[n];
          });
        })(n);
      }
      return groupedData.entries(data);
    },

    tree_map(data, w, h) {
      const groupedData = this.groupData(data, ["code", "name"]);

      return d3.layout
        .treemap()
        .mode("squarify")
        .round(true)
        .size([w, h])
        .children(d => d.values)
        .padding(1)
        .sort((a, b) => a.value - b.value)
        .nodes({
          name: "root",
          values: groupedData
        })
        .filter(d => !d.values && d.area);
    },

    getDepth1value(node) {
      if (node.depth > 1) {
        return this.getDepth1value(node.parent);
      }

      return node.value;
    },

    getRootvalue(node) {
      if (node.depth > 0) {
        return this.getRootvalue(node.parent);
      }
      return node.value;
    },

    lineBreak(str, off) {
      const rtn = [],
        len = str.length;
      let point = off;

      rtn.push(str.substring(0, point));

      while (point < len) {
        const tmpStr = str.substring(point, point + off);
        rtn.push(tmpStr);
        point += off;
      }

      return rtn;
    },

    getContrastYIQ(color) {
      let r, g, b;

      if (color.indexOf("#") > -1) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
      } else {
        color = color.match(/\d+/g);
        r = color[0];
        g = color[1];
        b = color[2];
      }

      const yiq = (r * 299 + g * 587 + b * 114) / 1000;

      return yiq >= 128 ? "black" : "white";
    },

    wFontSize(str, obj, nowrap) {
      const w = Number(d3.select(obj.parentElement.firstChild).attr("width")),
        h = Number(d3.select(obj.parentElement.firstChild).attr("height")),
        el = d3.select(obj);
      let size = Math.min(w / (0.8 * 10), h / (0.8 * 10));

      size = size * 2;

      if (size == 0) console.log(size);

      el.style("font-size", size + "px");

      if (!nowrap) {
        const words = this.lineBreak(str, w / size);
        const strOffset = 0;

        el.text("");

        for (let i = 0, len = words.length; i < len; i++) {
          const tspan = el.append("tspan").text(words[i]);

          if (i > 0) tspan.attr("x", 0).attr("dy", i * size);
        }
      }
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
.treemap_container {
  position: relative;
  width: 100%;
  height: 100%;
}

.treemap_container >>> .tooltip {
  position: absolute;
  height: auto;
  padding: 10px;
  background-color: white;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.treemap_container >>> .tooltip.hidden {
  display: none;
}
</style>