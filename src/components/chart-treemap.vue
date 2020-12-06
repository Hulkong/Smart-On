<template>
  <div class="chart treemap_container">
    <tooltip ref="tooltip"></tooltip>
    <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>
    <div class="_default_image">
      <v-img
        contain
        width="50%"
        height="50%"
        class="_image"
        :src="getImageUrl('common/img_ready.png')"
        alt
      />
      <p class="_text">준비중입니다.</p>
    </div>
  </div>
</template>

<script>
import Tooltip from "@/components/chart-tooltip";
export default {
  name: "treemap",

  props: { options: Object },

  data() {
    return {
      copyData: []
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
     * @param {Array} data 데이터
     * @param {Object} options 옵션
     */
    draw(data, options) {
      // 데이터가 없을 경우 리턴
      if (!data || data.length === 0) return;
      const chartOption = options["chartOption"];

      this.init(chartOption); // 초기 설정값 세팅
      this.makeSVG(chartOption, data); // 차트 컨테이너 생성
      this.makeTreemap(chartOption); // treemap 생성
      this.makeCell(chartOption, data); // cell 생성
      this.makeTopText(chartOption, data); // cell 최상위 지점 텍스트 생성
      this.makeBottomText(chartOption, data); // cell 최하단 지점 텍스트 생성
      this.makeFakeCell(chartOption, data); // 가짜 cell 생성
    },

    /**
     * @description 초기 설정값 세팅하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    init(options) {
      const element = this.$el;
      const margin = options.margin; // margin.middle is distance from center line to each y-axis
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

      options.width = width;
      options.height = height;
    },

    /**
     * @description 차트 컨테이너 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeSVG(options, data) {
      const element = this.$el;
      const width = options.width;
      const height = options.height;
      const id = this.$md5(new Date());

      options.svg = d3
        .select(element)
        .append("svg")
        .attr("id", id)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .style("fill", "white")
        .attr("transform", "translate(.5,.5)");
    },

    /**
     * @description Treemap 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeTreemap(options) {
      const width = options.width;
      const height = options.height;

      options.treemap = d3.layout
        .treemap()
        .size([width, height])
        .padding(5)
        .sticky(true)
        .sort((a, b) => a.value - b.value)
        .value(d => d.size);
    },

    /**
     * @description Cell 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     * @param {Array} data 차트 데이터
     */
    makeCell(options, data) {
      const svg = options.svg;
      const treemap = options.treemap;
      const root = {
        name: "root",
        children: data
      };
      const node = svg
        .datum(root)
        .selectAll("g")
        .data(treemap.nodes)
        .enter()
        .append("g")
        .attr("class", "cell")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

      node
        .append("rect")
        .attr("width", d => d.dx + 1.5)
        .attr("height", d => d.dy + 1.5)
        .style("fill", d => d.fill)
        .style("stroke", (d, i) => (i > 0 ? "#f5f5f5" : "transparent")) // root 제외
        .style("vector-effect", "non-scaling-stroke")
        .style("shape-rendering", "crispEdges")
        .style("transform", "none");

      options.nodes = node;
    },

    /**
     * @description cell의 최상단 지점 텍스트 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     * @param {Array} data 차트 데이터
     */
    makeTopText(options, data) {
      const node = options.nodes;
      const text = node
        .append("text")
        .text((d, i) => {
          if (i === 0) return;

          if (i < data.length - 3) return d.name;
        })
        .attr("x", 3)
        .attr("y", 3)
        .attr("dy", "0.9em")
        .attr("class", "name")
        .style("fill", d => d.color);

      text.each((d, i) => {
        if (i <= 1) return; // root 포함 첫 번째 cell 제외

        if (i > data.length - 4) return; // root 포함 하위 3 cell 제외
        this.setDynamicFontSize(d.name, text[0][i]);
        this.textAbbreviation(text[0][i], d.name);
      });
    },

    /**
     * @description cell의 최하단 지점 텍스트 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     * @param {Array} data 차트 데이터
     */
    makeBottomText(options, data) {
      const node = options.nodes;

      const rate = node
        .append("text")
        .text((d, i) => {
          const excludeCnt = 4 + 1; // root 포함 제외할 개수
          if (i < data.length - excludeCnt) return d.rate + "%";
        })
        .attr("x", d => d.dx / 2)
        .attr("y", (d, i) => {
          const excludeCnt = 5 + 1; // root 포함 제외할 개수

          if (i < data.length - excludeCnt) {
            return d.dy - 8;
          } else {
            return d.dy - 4;
          }
        })
        .attr("text-anchor", "middle")
        .style("fill", d => d.color)
        .style("font-size", function(d, i) {
          const parentW = Number(
            d3.select(this.parentNode.firstChild).attr("width")
          );
          const parentH = Number(
            d3.select(this.parentNode.firstChild).attr("height")
          );
          const smallerTextSize = 7;
          let size = smallerTextSize;

          if (i === 0) return;
          if (parentW > parentH) {
            size = Math.floor(parentH / 3);
          } else {
            size = Math.floor(parentW / 4);
          }

          if (size < smallerTextSize) size = smallerTextSize;

          return size + "px";
        });
    },

    /**
     * @description 가짜 cell 생성하는 메소드
     * @param {Object} options 차트 필수 옵션
     */
    makeFakeCell(options) {
      const node = options.nodes;
      const that = this;
      node
        .append("rect")
        .attr("width", d => d.dx + 1.5)
        .attr("height", d => d.dy + 1.5)
        .style("fill", d => "black")
        .style("opacity", 0)
        .style("stroke", (d, i) => (i > 0 ? "#f5f5f5" : "transparent")) // root 제외
        .style("vector-effect", "non-scaling-stroke")
        .style("shape-rendering", "crispEdges")
        .style("transform", "none")
        .on("mousemove", function(d) {
          const data = {
            title: d["name"].replace(/\|/gi, " "),
            contents: [
              {
                name: "value",
                value: that.numberWithCommas(d["value"]) + d["unit"]
              },
              {
                name: "rate",
                value: d["rate"] + "%"
              }
            ],
            color: d["tooltipColor"]
          };

          that.$refs["tooltip"].mouseenter(that.$el, data);
        })
        .on("mouseleave", function() {
          that.$refs["tooltip"].mouseleave(that.$el);
        });
    },

    /**
     * @description 줄임표시 동적 세팅
     * @param {Document} dom
     * @param {String} text
     */
    textAbbreviation(dom, text) {
      const el = d3.select(dom);
      const parentW = Number(
        d3.select(dom.parentNode.firstChild).attr("width")
      );
      const w = dom.clientWidth;

      // 텍스트의 넓이가 cell의 넓이보다 클 경우 줄임표시
      if (parentW < w) {
        el.text(text.substring(0, 2) + "...");
      }
    },

    /**
     * @description 구분자에 따른 폰트 크기 변경
     * @param {String} text 구분자 기준으로 자를 기준데이터
     * @param {Document} obj 넓이와 높이를 가져올 도큐먼트
     * @param {String} separator 구분자
     */
    setDynamicFontSize(text, dom, separator = "|") {
      const parentW = Number(
        d3.select(dom.parentNode.firstChild).attr("width")
      );
      const parentH = Number(
        d3.select(dom.parentNode.firstChild).attr("height")
      );
      const el = d3.select(dom);
      const words = text.split(separator);
      const standardOffset = 0;
      const smallerTextSize = 7;
      let size = smallerTextSize;

      let wlen = 0;

      if (parentW > parentH) {
        size = parentH / 5 / words.length;
      } else {
        size = parentW / 5 / words.length;
      }

      el.style("font-size", size + "px");

      el.text("");

      for (let i = 0, len = words.length; i < len; i++) {
        var tword = "";
        if (i > 0) tword = words[i];
        else tword = words[i];

        const tspan = el.append("tspan").text(tword);
        if (i > 0) tspan.attr("x", 3).attr("dy", i * size + 3);
      }
    },

    /**
     * @description 마우스오버 이벤트
     * @param {Object} d 데이터
     */
    mouseenter(d) {
      const that = this;
      const element = this.$el;
      let xPosition = d.x + d.dx / 2;
      const yPosition = d.y + d.dy / 2;
      const svgW = parseFloat(
        d3
          .select(element)
          .select("svg")
          .attr("width")
      );
      const tooltipN = d3
        .select(element)
        .select(".tooltip")
        .node();
      const tooltipW = tooltipN.getBoundingClientRect().width;
      if (svgW < xPosition + tooltipW) {
        xPosition -= tooltipW;
      }
      d3.select(element)
        .select(".tooltip")
        .style({
          left: xPosition + "px",
          top: yPosition + "px"
        })
        .text(function() {
          var str = d["name"];
          const words = str.split("|");
          // const strOffset = 0;

          let name = "";
          if (words.length > 0) {
            for (var i = 0; i < words.length; i++) {
              if (i > 0) name += " " + words[i];
              else name += words[i];
            }
          }
          return (
            name +
            " : " +
            that.numberWithCommas(d["value"]) +
            "(" +
            d["rate"] +
            "%)"
          );
        })
        .style("font-size", "14px");

      d3.select(element)
        .select(".tooltip")
        .style("display", "inline-block");
    },

    /**
     * @description 마우스아웃 이벤트
     * @param {Object} d 데이터
     */
    mouseleave(d) {
      const element = this.$el;
      d3.select(element)
        .select(".tooltip")
        .style("display", "none");
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
  width: fit-content;
  height: auto;
  padding: 10px;
  background-color: white;
  /* -webkit-border-radius: 10px; */
  /* -moz-border-radius: 10px; */
  /* border-radius: 10px; */
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  color: black;
  font-size: 16px;
}

.treemap_container >>> .tooltip.hidden {
  display: none;
}

.treemap_container >>> .cell:nth-child(1) {
  display: none;
}
</style>
