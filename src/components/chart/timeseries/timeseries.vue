<template>
  <div class="chart timeseries_container" ref="wrap">
    <div
      class="gslider"
      draggable="true"
      ref="gslider_startSlider"
      id="gslider_startSlider"
    >{{sResult}}</div>
    <div class="gslider" draggable="true" ref="gslider_endSlider" id="gslider_endSlider">{{eResult}}</div>
    <svg ref="d3_svg" />
  </div>
</template>
<script>
export default {
  // 컴포넌트 이름
  name: "timeseries",

  props: { options: Object },

  // 상태
  data() {
    return {
      data: [], // 데이터
      bDate: new Date("2019-09-01"), // x축 시작 날짜
      eDate: new Date("2019-09-14"), // x축 마지막 날짜
      chartMargin: { top: 20, right: 0, bottom: 50, left: 0 }, // 여백
      yColumn: "total_cnt", // y축 데이터
      xColumn: "stdr_date", // x축 데이터
      defaultPeriod: ["20190905", "20190910"], // 기본 선택 기간
      lineChartObj: null, // 라인 차트 저장
      sResult: "19/09/05", // 선택한 날짜(start)
      eResult: "19/09/10" // 선택한 날짜(end)
    };
  },

  created() {},

  mounted() {},

  // 뷰
  template: "",

  // 액션
  methods: {
    /**
     * @description 현재 이 컴포넌트에 차트데이터 설정함
     */
    setData(data) {
      this.$data.data = data;
      this.$data.bDate = this.formatYYYYMMDDToDate(data[0].stdr_date);
      this.$data.eDate = this.formatYYYYMMDDToDate(
        data[data.length - 1].stdr_date
      );
    },

    /**
     * @description 차트 그리는 함수
     * @param {Array data}: 데이터
     * @param {Object options}: 옵션
     */
    draw(data, options) {
      if (!data || data.length === 0) return; // 데이터가 없을 경우 리턴

      this.setData(data);

      let that = this;
      let id = this.$refs.wrap;
      let yColumn = this.$data.yColumn;
      let xColumn = this.$data.xColumn;

      // vue 컴포넌트 내장 데이터
      const element = this.$el;
      // const id = options.dataId;
      const chartOption = options.chartOption;
      const margin = chartOption.margin; // margin.middle is distance from center line to each y-axis

      const tickFormat = d3.time.format("%y/%m/%d");
      this.$data.tickFormat = tickFormat;

      let width =
        Number(
          d3
            .select(element)
            .style("width")
            .replace("px", "")
        ) -
        margin.left -
        margin.right;
      let height =
        Number(
          d3
            .select(element)
            .style("height")
            .replace("px", "")
        ) -
        margin.top -
        margin.bottom;
      this.$data.width = width;
      this.$data.x = d3.time.scale().range([margin.left, width + margin.left]);
      this.$data.y = d3.scale.linear().range([height, 0]);
      let x = this.$data.x;
      let y = this.$data.y;

      // x 축 ( 그릴때 사용할 option )
      let xAxis = d3.svg
        .axis()
        .scale(x)
        .ticks(data["length"])
        .tickSize(-height)
        .tickFormat(tickFormat);

      let yMaxValue = d3.max(data, function(d) {
        return d[yColumn];
      });
      let yValueWidth = yMaxValue / 4;
      yValueWidth = Math.round(yValueWidth / 1000) * 1000;
      let tickValues = [0, yValueWidth, yValueWidth * 2, yValueWidth * 3];

      // y 축 ( 그릴때 사용할 option )
      let yAxis = d3.svg
        .axis()
        .scale(y)
        .orient("left")
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickValues(tickValues)
        .tickPadding(10);

      // 면적 그래프 ( 그릴때 사용할 option )
      let area = d3.svg
        .area()
        .interpolate("monotone")
        .x(function(d) {
          return x(that.formatYYYYMMDDToDate(d[xColumn]));
        })
        .y0(height)
        .y1(function(d) {
          return y(d[yColumn]);
        });

      // 선그래프 ( 그릴때 사용할 option )
      let line = d3.svg
        .line()
        .interpolate("monotone")
        .x(function(d) {
          return x(that.formatYYYYMMDDToDate(d[xColumn]));
        })
        .y(function(d) {
          return y(d[yColumn]);
        });

      let svg = d3.select(element).append("svg");

      that.drawClipSvg(svg, width + margin.left, height); // 그래프가 나올 영역 지정

      svg.datum(data); // 데이터 바인딩
      x.domain([that.$data.bDate, that.$data.eDate]);
      y.domain([0, yMaxValue + yMaxValue / 8]).nice();

      that.drawPath(svg, area); // 회색 그래프

      that.drawXaxis(svg, xAxis, height); // x축

      that.drawClipPath(svg, height); // x축위에 있는 slide바 영역 지정
      this.$data.rectXaxis = that.drawFillRectXaxis(svg, height); // 선택box(x축(날짜)부분의 진한 색상박스)
      that.drawSlideXaxis(svg, height, xAxis); // 선택box(x축(날짜)부분의 진한 색상박스)안의 흰색 text

      that.drawYaxis(svg, yAxis); // y축 (+그리드)

      this.$data.lineChartObj = that.drawLinePath(svg, line); // 회색 그래프 최상단 라인

      this.$data.startSlider = this.sliderBuilder(
        svg,
        id,
        "startSlider",
        width,
        height,
        that.moveEndHandler
      ); // 왼쪽 포인터
      this.$data.endSlider = this.sliderBuilder(
        svg,
        id,
        "endSlider",
        width,
        height,
        that.moveEndHandler
      ); // 오른쪽 포인터
      this.$data.startSlider.constrain(that.sSliderHandler);
      this.$data.endSlider.constrain(that.eSliderHandler);

      this.$data.rectArea = that.drawGuideRect(svg, height, width); // 선택box(날짜부분의 진한 색상박스)

      // 초기값 설정
      var dStart = this.formatYYYYMMDDToDate(that.$data.defaultPeriod[0]);
      var dEnd = this.formatYYYYMMDDToDate(that.$data.defaultPeriod[1]);
      this.$data.startSlider.move(x(dStart));
      this.$data.endSlider.move(x(dEnd));
    },
    drawClipSvg(svg, width, height) {
      // 그래프가 나올 영역 지정
      svg
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#ff0000");
    },

    drawPath(svg, area) {
      // 회색 그래프
      svg
        .append("path")
        .attr("class", "area")
        .attr("clip-path", "url(#clip)")
        .attr("d", area);
    },
    drawLinePath(svg, line) {
      // 회색 그래프 최상단 라인
      return svg
        .append("path")
        .attr("class", "line")
        .attr("d", line);
    },
    drawXaxis(svg, xAxis, height) {
      // x축
      let xGr = svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      xGr
        .selectAll("text")
        .attr("dy", ".99em")
        .style("font-size", "12px");
    },

    drawYaxis(svg, yAxis) {
      // y축 (+그리드)
      let that = this;
      svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + that.$data.chartMargin.left + ",0)")
        .call(yAxis);

      svg
        .selectAll(".y .tick:not(:first-of-type) line")
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2,2");
    },

    drawSlideXaxis(svg, height, xAxis) {
      // 선택box(x축(날짜)부분의 진한 색상박스)안의 흰색 text

      let slideXaxis = svg
        .append("g")
        .attr("clip-path", "url(#clip2)")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dy", ".99em")
        .style("font-size", "12px")
        .attr("fill", "#ffffff");
    },

    drawSlideLine(slideSvg, height) {
      var linePath = slideSvg
        .append("line")
        .attr("class", "guideline")
        .attr("clip-path", function() {
          return "url(#clip)";
        })
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

      return linePath;
    },

    drawSlidePoint(slideSvg) {
      var dot = slideSvg
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5);
      return dot;
    },

    drawClipPath(svg, height) {
      // x축위에 있는 slide바 영역 지정
      var that = this;
      var sPeriod = this.$data.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[0])
      );
      var ePeriod = this.$data.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[1])
      );
      var xPosition = this.$data.chartMargin.left;
      svg
        .append("clipPath")
        .attr("id", "clip2")
        .append("rect")
        .attr("class", "fillRect")
        .attr("id", "fillRect")
        .attr("width", function() {
          return ePeriod - sPeriod;
        })
        .attr("x", function() {
          return sPeriod - 32;
        })
        .attr("y", 0)
        .attr("height", height + 21);
    },

    drawFillRectXaxis(svg, height) {
      // 선택box(x축(날짜)부분의 진한 색상박스)
      var that = this;
      var sPeriod = this.$data.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[0])
      );
      var ePeriod = this.$data.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[1])
      );
      var xPosition = this.$data.chartMargin.left;
      svg
        .append("rect")
        .attr("class", "fillRect")
        .attr("ref", "fillRect")
        .attr("width", function() {
          return ePeriod - sPeriod;
        })
        .attr("x", function() {
          return sPeriod - 32;
        })
        .attr("y", height)
        .attr("height", 30)
        .attr("fill", "#F7941D");
    },

    drawGuideRect(svg, height, width) {
      // 선택box( 진한 색상박스)
      let that = this;
      let startSlider = this.$data.startSlider;
      let endSlider = this.$data.endSlider;
      let scaleX = this.$data.x;
      let term = 0;
      let fillWidth = 0;
      let dragBehavior = d3.behavior
        .drag()
        .on("dragstart", function() {
          term =
            scaleX.invert(endSlider.getX()) - scaleX.invert(startSlider.getX());
          fillWidth = endSlider.getX() - startSlider.getX();
        })
        .on("drag", onSelectionDrag)
        .on("dragend", onSelectionDragEnd);

      let rect = svg
        .append("g")
        .append("rect")
        .attr("class", "guideRect")
        .attr("id", "guideRect")
        .attr("width", fillWidth)
        .attr("x", 0)
        .attr("height", height)
        .attr("fill", "#fca65a")
        .attr("opacity", 0.3)
        .attr("cursor", "move")
        .call(dragBehavior);

      function onSelectionDrag() {
        let $this = d3.select(this),
          currentX = +$this.attr("x"),
          sWidth = +$this.attr("width"),
          newX = currentX + d3.event.dx;

        if (newX < 0 || newX + sWidth > width) return;

        rect.attr("x", newX);
        rect.attr("width", fillWidth);
        startSlider.move(newX);
        endSlider.move(newX + sWidth);
      }
      function onSelectionDragEnd() {
        let $this = d3.select(this);
        let currentX = $this.attr("x");
        let sWidth = $this.attr("width");
        let x0 = scaleX.invert(currentX);
        let x1 = new Date(that.dateRound(x0).getTime() + term);

        startSlider.move(scaleX(that.dateRound(x0)));
        endSlider.move(scaleX(x1));
        that.moveEndHandler();
      }
    },

    sliderBuilder(canvas, id, sliderName, maxWidth, height, moveEndHandler) {
      // 선택 화살표 포인터부분
      let that = this;
      let scaleX = this.$data.x;
      let scaleY = this.$data.y;
      let margin = this.$data.chartMargin;
      let silderData = this.$data.data;
      var linePath = this.$data.lineChartObj; // line chart object
      var sliderGroup = canvas.append("g").attr("class", "marker");
      var dotLine = this.drawSlideLine(sliderGroup, height);
      var dot = this.drawSlidePoint(sliderGroup);

      var _selectedData = silderData[0];
      var _constrain;

      function constrain(dragConstrain) {
        _constrain = dragConstrain;
      }

      var _sliderName = "gslider_" + sliderName;
      draggable(this.$refs[_sliderName]);

      function draggable(elmnt) {
        var offx = 0,
          left = 0;
        if (document.getElementById(elmnt.id)) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id).onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          left = e.clientX;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          // offx = left - e.clientX;
          left = e.clientX;
          // set the element's new position:
          // elmnt.style.left = (elmnt.offsetLeft - offx) + "px";
          if (_constrain) {
            _constrain(event, elmnt);
          }
          // console.log(margin);
          offx = sliderName == "startSlider" ? margin.left : 0; //왼쪽 slider margin처리
          moveX(elmnt.offsetLeft + offx - margin.left);
        }

        function closeDragElement(e) {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;

          left = e.clientX;
          offx = sliderName == "startSlider" ? margin.left : 0; //왼쪽 slider margin처리
          var tick = getStopTick(left + offx - margin.left);
          // moveX(scaleX(tick));
          moveEndHandler();
        }
      }

      function getStopTick(xleft) {
        var x0 = scaleX.invert(xleft);
        return that.dateRound(x0);
      }

      var posX = 0;
      function moveX(xxx) {
        if (xxx < 0 || xxx > maxWidth) return;

        var rWidth = 0;
        var rPosx = 0;

        posX = xxx;
        var x0 = scaleX.invert(posX);
        var newValue = Math.round(x0);
        var bisectTimeCd = d3.bisector(function(d) {
          return d.stdr_date;
        }).left;
        var i = bisectTimeCd(silderData, x0, 1);

        var d0 = silderData[i - 1];
        var d1 = silderData[i];
        var d0_data = that.formatYYYYMMDDToDate(d0.stdr_date);
        var d1_data = that.formatYYYYMMDDToDate(d0.stdr_date);

        var d =
          x0.getTime() - d0_data.getTime() > d1_data.getTime() - x0 ? d1 : d0;
        _selectedData = d;

        // TODO, 변수로 변경하기
        var nearYvalue = scaleY(d.total_cnt);

        // var pathEl = linePath.node();
        var pathEl = linePath[0][0];
        var pathLength = pathEl.getTotalLength();
        var beginning = posX,
          end = pathLength,
          target,
          pos;

        while (true) {
          target = Math.floor((beginning + end) / 2);
          pos = pathEl.getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x0 !== scaleX) {
            break;
          }
          if (pos.x > posX) end = target;
          else if (pos.x < posX) beginning = target;
          else break; //position found
        }

        dot.attr("transform", "translate(" + pos.x + "," + pos.y + ")");
        dotLine.attr("transform", "translate(" + pos.x + ",0)");
        that.rectRedraw();
      }

      return {
        move: moveX,
        value() {
          return _selectedData;
        },
        getX() {
          return posX;
        },
        constrain: constrain
      };
    },

    rectRedraw() {
      let margin = this.$data.chartMargin;
      let scaleX = this.$data.x;
      let startX = this.$data.startSlider.getX();
      let endX = this.$data.endSlider.getX();
      if (endX - startX < 0) return;

      document.getElementById("guideRect").style.width = endX - startX + "px";
      document.getElementById("guideRect").setAttribute("x", startX);

      var sSliderHtml = this.$refs["gslider_startSlider"];
      var eSliderHtml = this.$refs["gslider_endSlider"];
      sSliderHtml.style.left = startX + "px";
      sSliderHtml.style["margin-left"] = -sSliderHtml.offsetWidth + "px";
      eSliderHtml.style.left = endX + "px";

      // $(".gslider.startSlider").html( tFormat(dateRound(x.invert(startX))));
      // $(".gslider.endSlider").html(   tFormat(dateRound(x.invert(endX))) );

      var fillRect = document.getElementsByClassName("fillRect");
      if (fillRect.length > 0) {
        for (var fr = 0; fr < fillRect.length; fr++) {
          fillRect[fr].style.width = endX - startX + "px";
          fillRect[fr].setAttribute("x", startX);
        }
      }
    },

    dateRound(dd) {
      var nDate = new Date(dd);
      nDate.setHours(nDate.getHours() + Math.round(nDate.getMinutes() / 60));
      nDate.setMinutes(0);
      return nDate;
    },

    /**
     * @description 객체 얕은 복사하는 함수
     * @param {Object obj} 복사할 객체
     * @returns {Object copy} 복사된 객체
     */
    cloneObj(obj) {
      if (obj === null || typeof obj !== "object") return obj;

      let copy = obj.constructor();

      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }

      return copy;
    },
    addDays(sDate, days) {
      var dat = this.formatYYYYMMDDToDate(sDate);
      dat.setDate(dat.getDate() + days);
      return dat;
    },
    formatYYYYMMDDToDate(strdate) {
      // 날짜 포멧
      return new Date(
        strdate.substr(0, 4) +
          "-" +
          strdate.substr(4, 2) +
          "-" +
          strdate.substr(6, 2)
      );
    },
    sSliderHandler(event, obj) {
      let margin = this.$data.chartMargin;
      // let scaleX = this.$data.x;
      let left = event.clientX;
      let endSlider = this.$data.endSlider;
      var sSliderHtml = this.$refs["gslider_startSlider"];

      obj.style.left =
        Math.max(margin.left, left - sSliderHtml.offsetWidth) + "px";
      obj.style.left =
        Math.min(
          left + margin.left - sSliderHtml.offsetWidth,
          endSlider.getX() + 50
        ) + "px";
    },
    eSliderHandler(event, obj) {
      // (오른쪽) 선택 기간 limit 혹은 제한 설정
      let width = this.$data.width;
      let margin = this.$data.chartMargin;
      let scaleX = this.$data.x;
      let startSlider = this.$data.startSlider;
      let left = event.clientX;
      var sSliderHtml = this.$refs["gslider_startSlider"];

      obj.style.left = Math.max(left - 200, startSlider.getX()) + "px";
      obj.style.left = Math.min(width, obj.offsetLeft + 10) + "px";
    },

    moveEndHandler() {
      let scaleX = this.$data.x;
      let startSlider = this.$data.startSlider;
      let endSlider = this.$data.endSlider;
      let tickFormat = this.$data.tickFormat;
      this.$data.sResult = tickFormat(scaleX.invert(startSlider.getX()));
      this.$data.eResult = tickFormat(scaleX.invert(endSlider.getX()));

      this.$emit("trigger");
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
.timeseries_container {
  width: 100%;
  height: 100%;
  position: absolute;
}

.timeseries_container >>> svg {
  width: 100%;
  height: 100%;
  font: 10px sans-serif;
}
.timeseries_container >>> path.line {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}
.timeseries_container >>> path.area {
  fill: #e7e7e7;
}
.timeseries_container >>> .axis {
  shape-rendering: crispEdges;
}
.timeseries_container >>> .axis line {
  color: #ff0000;
}
.timeseries_container >>> .x.axis .minor {
  stroke-opacity: 0.5;
}
.timeseries_container >>> .x.axis path {
  display: none;
}
.timeseries_container >>> .y.axis .minor {
  stroke-opacity: 0.5;
}
.timeseries_container >>> .y.axis path {
  display: none;
}
.timeseries_container >>> .guideline {
  stroke: rgb(255, 0, 0);
  stroke-width: 2;
}
.timeseries_container >>> .marker .dot {
  fill: #ff0000;
}

.timeseries_container >>> .gslider {
  position: absolute;
  z-index: 1;
  /* top: 82px; */
  bottom: 40px;
  height: 30px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: bold;
  line-height: 22px;
  color: #fff;
  background-color: #f26522;
  cursor: move;
}

.timeseries_container >>> .gslider.startSlider {
  text-align: right;
}

.timeseries_container >>> .gslider.startSlider:after {
  content: "";
  position: absolute;
  left: -14px;
  top: 0;
  border-style: solid;
  border-color: transparent transparent #f26522 transparent;
  border-width: 0 0 20px 14px;
}

.timeseries_container >>> .gslider.endSlider {
  text-align: left;
}

.timeseries_container >>> .gslider.endSlider:after {
  content: "";
  position: absolute;
  right: -14px;
  top: 0;
  border-style: solid;
  border-color: #f26522 transparent transparent transparent;
  border-width: 20px 14px 0 0;
}
</style>