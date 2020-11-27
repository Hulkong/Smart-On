<template>
  <div class="chart radar"></div>
</template>
<script>
export default {
  name: "radar",

  props: { options: Object },

  data() {
    return {};
  },

  created() {},

  mounted() {},

  // 뷰
  template: "",

  // 액션
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

      let chartData = [];
      let chartDataArr = [];
      let categoryArr = [];
      var timeVal = [
        "공공질서 및 안전",
        "농림해양수산",
        "문화 및 관광",
        "일반 공공행정",
        "환경보호",
        "수송 및 교통",
        "산업/중소기업",
        "사회복지",
        "보건",
        "국토 및 지역개발",
        "교육",
        "과학기술"
      ];

      var j = 0;
      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        chartDataArr.push({
          name: item.name,
          rootCd: timeVal.indexOf(item.name.trim()),
          colnm: item.category,
          value: item.value,
          desc: "0"
        });

        if (timeVal.length == chartDataArr.length) {
          chartData[j] = chartDataArr;
          chartDataArr = [];
          categoryArr.push(item.category);
          j++;
        }
      }

      // 정렬
      chartData.sort(function CompareForSort(first, second) {
        return first.rootCd - second.rootCd;
      });

      var width =
        Number(
          d3
            .select(".radar")
            .style("width")
            .replace("px", "")
        ) -
        margin.left -
        margin.right;
      var chartHeight =
        Number(
          d3
            .select(".radar")
            .style("height")
            .replace("px", "")
        ) -
        margin.top -
        margin.bottom;

      chartOption.maxValue = Math.max(
        chartOption.maxValue,
        d3.max(chartData, function(i) {
          return d3.max(
            i.map(function(o) {
              return o.value;
            })
          );
        })
      );
      var allAxis = chartData[0].map(function(i, j) {
        return i.name;
      });
      var total = allAxis.length;
      var radius = chartOption.factor * Math.min(width / 2, chartHeight / 2);
      var Format = function(d) {
        return Math.floor(d) + "명";
      };

      var chart = d3
        .select(element)
        .append("svg")
        .attr("id", id)
        .attr("width", width + chartOption.ExtraWidthX)
        .attr("height", chartHeight + chartOption.ExtraWidthY)
        .append("g")
        .attr(
          "transform",
          "translate(" +
            chartOption.TranslateX +
            "," +
            chartOption.TranslateY +
            ")"
        );

      // 범위 혹은 눈금을 알려주는 바탕 도형
      for (var j = 0; j < chartOption.levels - 1; j++) {
        var levelFactor =
          chartOption.factor * radius * ((j + 1) / chartOption.levels);
        chart
          .selectAll(".levels")
          .data(allAxis)
          .enter()
          .append("svg:line")
          .attr("x1", function(d, i) {
            return (
              levelFactor *
              (1 -
                chartOption.factor *
                  Math.sin((i * chartOption.radians) / total))
            );
          })
          .attr("y1", function(d, i) {
            return (
              levelFactor *
              (1 -
                chartOption.factor *
                  Math.cos((i * chartOption.radians) / total))
            );
          })
          .attr("x2", function(d, i) {
            return (
              levelFactor *
              (1 -
                chartOption.factor *
                  Math.sin(((i + 1) * chartOption.radians) / total))
            );
          })
          .attr("y2", function(d, i) {
            return (
              levelFactor *
              (1 -
                chartOption.factor *
                  Math.cos(((i + 1) * chartOption.radians) / total))
            );
          })
          .attr("class", "line")
          .style("stroke", "grey")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "0.3px")
          .attr(
            "transform",
            "translate(" +
              (width / 2 - levelFactor) +
              ", " +
              (chartHeight / 2 - levelFactor) +
              ")"
          );
      }

      //범위 혹은 눈금을 알려주는 바탕 도형의 text
      for (var j = 0; j < chartOption.levels; j++) {
        var levelFactor =
          chartOption.factor * radius * ((j + 1) / chartOption.levels);
        chart
          .selectAll(".levels")
          .data([1]) //dummy data
          .enter()
          .append("svg:text")
          .attr("x", function(d) {
            return levelFactor * (1 - chartOption.factor * Math.sin(0));
          })
          .attr("y", function(d) {
            return levelFactor * (1 - chartOption.factor * Math.cos(0));
          })
          .attr("class", "legend")
          .style("font-family", "sans-serif")
          .style("font-size", "10px")
          .attr(
            "transform",
            "translate(" +
              (width / 2 - levelFactor + chartOption.ToRight) +
              ", " +
              (chartHeight / 2 - levelFactor) +
              ")"
          )
          .attr("fill", "#737373")
          .text(Format(((j + 1) * chartOption.maxValue) / chartOption.levels));
      }

      let series = 0;

      var axis = chart
        .selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

      axis
        .append("line")
        .attr("x1", width / 2)
        .attr("y1", chartHeight / 2)
        .attr("x2", function(d, i) {
          return (
            width / 2 -
            radius *
              chartOption.factor *
              Math.sin((i * chartOption.radians) / total)
          );
        })
        .attr("y2", function(d, i) {
          return (
            chartHeight / 2 -
            radius *
              chartOption.factor *
              Math.cos((i * chartOption.radians) / total)
          );
        })
        .attr("class", "line")
        .style("stroke", function(d, i) {
          return "grey";
        })
        .style("stroke-width", "1px");

      axis
        .append("text")
        .attr("class", "legend")
        .text(function(d) {
          return d;
        })
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i) {
          return "translate(0, -10)";
        })
        .attr("x", function(d, i) {
          return (
            width / 2 -
            radius *
              chartOption.factorLegend *
              Math.sin((i * chartOption.radians) / total) -
            60 * Math.sin((i * chartOption.radians) / total)
          );
        })
        .attr("y", function(d, i) {
          return (
            chartHeight / 2 -
            radius * Math.cos((i * chartOption.radians) / total) -
            20 * Math.cos((i * chartOption.radians) / total)
          );
        });

      let dataValues = [];

      //도형그리기
      chartData.forEach(function(y, x) {
        dataValues = [];
        chart.selectAll(".nodes").data(y, function(j, i) {
          dataValues.push([
            width / 2 -
              radius *
                (parseFloat(Math.max(j.value, 0)) / chartOption.maxValue) *
                chartOption.factor *
                Math.sin((i * chartOption.radians) / total),
            chartHeight / 2 -
              radius *
                (parseFloat(Math.max(j.value, 0)) / chartOption.maxValue) *
                chartOption.factor *
                Math.cos((i * chartOption.radians) / total)
          ]);
        });
        dataValues.push(dataValues[0]);

        chart
          .selectAll(".area")
          .data([dataValues])
          .enter()
          .append("polygon")
          .attr("class", "radar-chart-serie" + series)
          .style("stroke-width", "2px")
          .style("stroke", chartOption.color(series))
          .attr("points", function(d) {
            var str = "";
            for (var pti = 0; pti < d.length; pti++) {
              str = str + d[pti][0] + "," + d[pti][1] + " ";
            }
            return str;
          })
          .style("fill", function(j, i) {
            return chartOption.color(series);
          })
          .style("fill-opacity", chartOption.opacityArea)
          .on("mouseover", function(d) {
            let z = "polygon." + d3.select(this).attr("class");
            chart
              .selectAll("polygon")
              .transition(200)
              .style("fill-opacity", 0.1);
            chart
              .selectAll(z)
              .transition(200)
              .style("fill-opacity", 0.7);
          })
          .on("mouseout", function() {
            chart
              .selectAll("polygon")
              .transition(200)
              .style("fill-opacity", chartOption.opacityArea);
          });
        series++;
      });
      series = 0;

      //도형위의 point만들기
      chartData.forEach(function(y, x) {
        chart
          .selectAll(".nodes")
          .data(y)
          .enter()
          .append("svg:circle")
          .attr("class", "radar-chart-serie" + series)
          .attr("r", chartOption.radius)
          .attr("alt", function(j) {
            return Math.max(j.value, 0);
          })
          .attr("cx", function(j, i) {
            dataValues.push([
              width / 2 -
                radius *
                  (parseFloat(Math.max(j.value, 0)) / chartOption.maxValue) *
                  chartOption.factor *
                  Math.sin((i * chartOption.radians) / total),
              chartHeight / 2 -
                radius *
                  (parseFloat(Math.max(j.value, 0)) / chartOption.maxValue) *
                  chartOption.factor *
                  Math.cos((i * chartOption.radians) / total)
            ]);
            return (
              width / 2 -
              radius *
                (Math.max(j.value, 0) / chartOption.maxValue) *
                chartOption.factor *
                Math.sin((i * chartOption.radians) / total)
            );
          })
          .attr("cy", function(j, i) {
            return (
              chartHeight / 2 -
              radius *
                (Math.max(j.value, 0) / chartOption.maxValue) *
                chartOption.factor *
                Math.cos((i * chartOption.radians) / total)
            );
          })
          .attr("data-id", function(j) {
            return j.axis;
          })
          .style("fill", chartOption.color(series))
          .style("fill-opacity", 0.9)
          .on("mouseover", function(d) {
            let newX = parseFloat(d3.select(this).attr("cx")) - 10;
            let newY = parseFloat(d3.select(this).attr("cy")) - 5;

            tooltip
              .attr("x", newX)
              .attr("y", newY)
              .text(d.colnm + " : " + Format(d.value))
              .transition(200)
              .style("opacity", 1);

            let z = "polygon." + d3.select(this).attr("class");
            chart
              .selectAll("polygon")
              .transition(200)
              .style("fill-opacity", 0.1);
            chart
              .selectAll(z)
              .transition(200)
              .style("fill-opacity", 0.7);
          })
          .on("mouseout", function() {
            tooltip.transition(200).style("opacity", 0);

            chart
              .selectAll("polygon")
              .transition(200)
              .style("fill-opacity", chartOption.opacityArea);
          });

        series++;
      });

      //Tooltip
      var tooltip = chart
        .append("text")
        .style("opacity", 0)
        .style("font-family", "sans-serif")
        .style("font-size", "13px");

      //범례
      var legend = chart
        .append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr("transform", "translate(90,20)");

      //범례 색박스
      legend
        .selectAll("rect")
        .data(chartOption.categoryArr)
        .enter()
        .append("rect")
        .attr("x", width - 200)
        .attr("y", function(d, i) {
          return i * 20;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i) {
          return chartOption.color(i);
        });

      //범례 text
      legend
        .selectAll("text")
        .data(chartOption.categoryArr)
        .enter()
        .append("text")
        .attr("x", width - 180)
        .attr("y", function(d, i) {
          return i * 20 + 9;
        })
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) {
          return d;
        });
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      d3.select(this.$el)
        .select("svg")
        .remove();
    }
  }
};
</script>
<style scoped>
.radar {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>