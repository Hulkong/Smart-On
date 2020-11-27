<template>
  <div id="bubble"></div>
</template>
<script>
export default {
  name: "bubble",
  data: function() {
    return {
      chartData: [
        {
          value: 150373,
          name: "한식"
        },
        {
          value: 57710,
          name: "의복/의류"
        },
        {
          value: 37994,
          name: "분식"
        },
        {
          value: 32862,
          name: "커피/디저트"
        },
        {
          value: 32715,
          name: "의약/의료품"
        },
        {
          value: 32507,
          name: "편의점"
        },
        {
          value: 30798,
          name: "고기요리"
        },
        {
          value: 30740,
          name: "한식국/탕/찌개"
        },
        {
          value: 28394,
          name: "일반주점"
        },
        {
          value: 27748,
          name: "특화병원"
        }
      ]
    };
  },

  created: function() {
    this.$nextTick(() => {
      //   // 모든 화면이 렌더링된 후 호출됩니다.
      this.draw;
    });
  },

  mounted: function() {
    // console.log('mounted', this.$el);
  },

  computed: {
    draw: function() {
      let chartData = JSON.parse(JSON.stringify(this.$data.chartData));
      var chart_config = {
        ticks: 6,
        chartMargin: { top: 10, right: 20, bottom: 100, left: 70 },
        colorArr: [
          "#2b83ba",
          "#64abb0",
          "#9dd3a7",
          "#c7e9ad",
          "#edf8b9",
          "#ffedaa",
          "#fec980",
          "#f99e59",
          "#e85b3a",
          "#d7191c"
        ]
      };

      d3.select("#bubble").html("");

      var chartWidth =
        Number(
          d3
            .select("#bubble")
            .style("width")
            .replace("px", "")
        ) -
        chart_config.chartMargin.left -
        chart_config.chartMargin.right;
      var chartHeight =
        Number(
          d3
            .select("#bubble")
            .style("height")
            .replace("px", "")
        ) -
        chart_config.chartMargin.top -
        chart_config.chartMargin.bottom;

      var color = d3.scale.ordinal().range(chart_config.colorArr);

      var chart = d3
        .select("#bubble")
        .append("svg")
        .attr(
          "width",
          chartWidth +
            chart_config.chartMargin.left +
            chart_config.chartMargin.right
        )
        .attr(
          "height",
          chartHeight +
            chart_config.chartMargin.top +
            chart_config.chartMargin.bottom
        )
        .append("g")
        .attr(
          "transform",
          "translate(" +
            chart_config.chartMargin.top +
            "," +
            chart_config.chartMargin.left +
            ")"
        );

      var bubbleScale = d3.layout
        .pack()
        .size([chartWidth, chartHeight])
        .padding(10);

      var nodes = bubbleScale
        .nodes({ children: chartData })
        .filter(function(d) {
          return !d.children;
        });

      var bubbles = chart
        .selectAll(".bubble")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", function(d) {
          return d.r;
        })
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        })
        .attr("fill", function(d) {
          return color(d.value);
        })
        .on("mouseover", function(d) {
          d3.select(this).attr("r", d["r"] + 10);
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("r", d["r"]);
        });

      bubbles
        .append("text")
        .attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y + 5;
        })
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(function(d, i) {
          return d.name;
        });
    }
  }
};
</script>
<style scoped>
#bubble {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>