<template>
  <div id="line"></div>
</template>

<script>
export default {
  data: function() {
    return {
      chartData: [
        {
          value: 9830216,
          code: "4",
          rate: 33,
          name: "12~15시 "
        },
        {
          value: 5263183,
          code: "6",
          rate: 18,
          name: "18~21시 "
        },
        {
          value: 4701062,
          code: "5",
          rate: 16,
          name: "15~18시 "
        },
        {
          value: 3768869,
          code: "3",
          rate: 13,
          name: "9~12시 "
        },
        {
          value: 2810983,
          code: "7",
          rate: 10,
          name: "21~24시 "
        },
        {
          value: 2131519,
          code: "2",
          rate: 7,
          name: "6~9시 "
        },
        {
          value: 967574,
          code: "1",
          rate: 3,
          name: "0~6시"
        }
      ]
    };
  },

  created: function() {
    // 모든 화면이 렌더링된 후 호출됩니다.
    this.$nextTick(() => {
      // line 아이디를 가지는 엘리먼트에 resize이벤트 바인딩 / 차트초기화
      this.bindReszieEvent("line");
    });
  },

  mounted: function() {},

  // 뷰
  template: "",

  // 액션
  methods: {
    /**
     * @description d3차트 resize 이벤트 바인딩하는 메소드
     * @param {String id}: 컴포넌트 아이디
     */
    bindReszieEvent: function(id) {
      if (!id) {
        alert("컴포넌트 아이디가 없습니다!");
        return;
      }

      const that = this;

      // 지원브라우저: 크롬(o), 파이어폭스(0), IE(x), 사파리(o)
      if (window.ResizeObserver) {
        /*
        // ResizeObserver 생성자 호출시 entries return
        const resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {}
          console.log('Size changed');
        });
        */

        // ResizeObserver 생성자 호출
        // debounce 사용하여 0.3초 간격으로 마지막 이벤트만 호출하도록 함
        const resizeObserver = new ResizeObserver(
          _.debounce(function() {
            if (!document.getElementById(id)) {
              return;
            }

            console.log("Size changed");
            that.remove(id); // d3차트 삭제
            that.draw(id); // de차트 생성
          }, 300)
        );

        // id가 pyramid인 엘리먼트의 크기가 변하면 resizeObserver의 콜백함수 호출
        resizeObserver.observe(document.getElementById(id));
      }
    },

    /**
     * @description d3차트를 그리는 메소드
     * @param {String: id} 컴포넌트 아이디
     */
    draw: function(id) {
      // vue 컴포넌트 내장 데이터
      let chartData = JSON.parse(JSON.stringify(this.$data.chartData));

      let chart_config = {
        ticks: 6,
        chartMargin: { top: 20, right: 20, bottom: 30, left: 70 }
      };

      let chartWidth =
        Number(
          d3
            .select("#line")
            .style("width")
            .replace("px", "")
        ) -
        chart_config.chartMargin.left -
        chart_config.chartMargin.right;
      let chartHeight =
        Number(
          d3
            .select("#line")
            .style("height")
            .replace("px", "")
        ) -
        chart_config.chartMargin.top -
        chart_config.chartMargin.bottom;

      let yScale = d3.scale.linear().range([chartHeight, 0]);
      let xScale = d3.scale.ordinal().rangePoints([0, chartWidth]);

      let yMaxValue = d3.max(chartData, function(d) {
        return d.value;
      });
      //axis
      let xAxis = d3.svg
        .axis()
        .scale(xScale)
        .ticks(5);

      let yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-chartWidth)
        .ticks(chart_config.ticks)
        .tickPadding(10)
        .tickFormat(function(d) {
          let ff = d3.format(",");
          return ff(d);
        });

      let line = d3.svg
        .line()
        .x(function(d) {
          return xScale(d.name);
        })
        .y(function(d) {
          return yScale(d.value);
        });

      let svg = d3
        .select("#line")
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
            chart_config.chartMargin.left +
            "," +
            chart_config.chartMargin.top +
            ")"
        );

      yScale.domain([0, yMaxValue + yMaxValue / 8]).nice();
      xScale.domain(
        chartData.map(function(d) {
          return d.name;
        })
      );

      //datum :
      svg.datum(chartData);

      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(xAxis);

      svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

      let linePath = svg
        .append("path")
        .attr("class", "line")
        .attr("d", line);

      // Define the div for the tooltip
      let tooltipDiv = this.addTooltipDiv();

      svg
        .selectAll("dot")
        .data(chartData)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
          return xScale(d.name);
        })
        .attr("cy", function(d) {
          return yScale(d.value);
        })
        .on("mouseover", function(obj) {
          tooltipDiv
            .transition()
            // .duration(200)
            .style("opacity", 0.9);
          tooltipDiv
            .html("시간 : " + obj.name + "<br/>값 : " + obj.value)
            .style("left", d3.event.pageX - 30 + "px")
            .style("top", d3.event.pageY - 120 + "px");
        })
        .on("mouseout", function(obj) {
          tooltipDiv
            .transition()
            // .duration(500)
            .style("opacity", 0);
        });

      // Step 7 : Apply tooltips over data points.
      // this.applyTooltips(svg, chartData, xScale, yScale);
    },

    addTooltipDiv: function() {
      let tooltipDiv = d3
        .select("#line")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      return tooltipDiv;
    },

    applyTooltips: function(svg, chartData, xScale, yScale) {
      // Define the div for the tooltip
      let tooltipDiv = this.addTooltipDiv();
      console.log(tooltipDiv);
      // Add the scatterplot
      svg
        .selectAll("circle")
        .data(chartData)
        .enter()
        .append("circle")
        .style("stroke", "transparent")
        .style("stroke-width", "35px")
        .style("fill", "#00688B")
        .attr("r", 5)
        .attr("cx", function(obj) {
          console.log(obj.name);
          return xScale(obj.name);
        })
        .attr("cy", function(obj) {
          console.log(obj.value);
          return yScale(obj.value);
        })
        .on("mouseover", function(obj) {
          tooltipDiv
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          tooltipDiv
            .html("Quantity : " + obj.name + "<br/>Price : " + obj.value)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function(obj) {
          tooltipDiv
            .transition()
            .duration(500)
            .style("opacity", 0);
        });
    },

    // svg 삭제하는 메소드
    remove: id => {
      if (!id) {
        alert("컴포넌트 아이디가 없습니다!");
        return;
      }

      // svg 삭제
      d3.select("#" + id)
        .select("svg")
        .remove();
    }
  }
};
</script>

<style>
#line {
  width: 100%;
  height: 100%;
  position: absolute;
}

#line .axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#line .y.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#line .y.axis .tick line {
  stroke: lightgrey;
  opacity: 0.7;
}

#line g circle {
  fill: #1db34f;
  stroke: #16873c;
  stroke-width: 2px;
}

#line g path.line {
  stroke: #1db34f;
  stroke-width: 2px;
  stroke-opacity: 1;
  fill: none;
}

#line div.tooltip {
  position: absolute;
  text-align: center;
  width: 90px;
  height: 30px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
</style>