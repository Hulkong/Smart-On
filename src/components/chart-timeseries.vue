<template>
  <div class="chart timeseries_container" ref="wrap">
    <div class="group_help" v-show="isShowGuide" @click="isShowGuide = false">
      <p>조회를 원하시는 일자에 따라 스크롤을 움직여 보세요.</p>
    </div>
    <div class="gslider startSlider" ref="gslider_startSlider" id="gslider_startSlider">
      <img :src="getImageUrl('common/sgy-y_left.png')" />
      <span>{{sResult}}</span>
    </div>
    <div class="gslider endSlider" ref="gslider_endSlider" id="gslider_endSlider">
      <span>{{eResult}}</span>
      <img :src="getImageUrl('common/sgy-y_right.png')" />
    </div>
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
      isShowGuide: true,
      copyData: [],
      limitM: 1, // 화면맨 왼쪽에서 그래프 시작까지의 px
      data: [], // 데이터
      bDate: undefined, // x축 시작 날짜
      bDateForX: undefined, // x축 시작 날짜(tick value를 위한 값)
      eDateForX: undefined, // x축 마지막 날짜(tick value를 위한 값)
      eDate: undefined, // x축 마지막 날짜
      defaultPeriod: ["20190902", "20190910"], // 기본 선택 기간
      lineChartObj: undefined, // 라인 차트 저장
      sResult: "19/09/09", // 선택한 날짜(start)
      eResult: undefined, // 선택한 날짜(end)
      isInit: false,
      chartX: undefined // 차트 시작 X위치
    };
  },

  created() {},

  mounted() {},

  // 뷰
  template: "",

  computed: {},

  // 액션
  methods: {
    /**
     * @description 컴포넌트 데이터 초기화 하는 메소드
     * @param {Array} data 차트 데이터
     */
    init(data) {
      // 오늘 날짜로 올해의 시작일과 마지막날을 startStr, endStr에 넣기

      const yearFromData = sessionStorage.getItem("edate").substring(0, 4); // 선택한 마지막 날짜 ( endslider의 날짜 )
      const sessionEndData = sessionStorage.getItem("end_date"); // DB데이터에 존재하는 마지막 날짜

      const startStr = this.formatYYYYMMDDToDate(yearFromData + "0101"); // 실제 데이터가 있는 해당 년도의 첫 날 - 시작 일자(String, 20191111)
      const endStr = this.formatYYYYMMDDToDate(yearFromData + "1231"); // 실제 데이터가 있는 해당 년도의 마지막 날 - 마지막 일자(String, 20191111)
      endStr.setDate(endStr.getDate() + 15);
      const startDate = new Date(startStr); // x축 시작 일자(Date)
      const endDate = new Date(endStr); // x축 마지막 일자(Date)

      // 가장 최신 데이터의 날짜를 this.dataEnd 에 넣기( 선택가능한 가장 마지막 날짜 )
      this.dataEnd = this.formatYYYYMMDDToDate(sessionEndData); // 실제 데이터가 있는 해당 년도의 마지막 날 - 마지막 일자(String, 20191111)

      const defaultLastDate = new Date(this.dataEnd);
      const sResult = new Date(startDate.getTime()); // 선택박스 x축 왼쪽박스 데이터
      const eResult = new Date(defaultLastDate.getTime()); // 선택박스 x축 오른쪽박스 데이터
      // sResult.setMonth(sResult.getMonth() - 2); // 기준날짜부터 2개월 이후로 세팅
      // eResult.setMonth(eResult.getMonth() + 12); // 기준날짜부터 2개월 이후로 세팅

      this.data = data;
      this.bDate = startStr;
      this.eDate = endStr;
      this.bDateForX = new Date(startStr);
      this.eDateForX = defaultLastDate;
      this.sResult = this.tickFormat(sResult);
      this.eResult = this.tickFormat(eResult);
      this.defaultPeriod[0] = this.getDate("yyyymmdd", sResult).join("");
      this.defaultPeriod[1] = this.getDate("yyyymmdd", eResult).join("");

      // 현재 그래프의 시작점 찾기( 실제 left margin 계산 )
      let margin = this.margin;
      let element = this.$el;
      let sdate = "20" + this.sResult.split("/").join("");
      let edate = "20" + this.eResult.split("/").join("");

      sessionStorage.setItem("sdate", sdate);
      sessionStorage.setItem("edate", edate);

      // 세팅된 기간을 기준으로 차트 새로 그림
      this.$emit("trigger", {
        sdate: sdate,
        edate: edate
      });
    },

    /**
     * @description 차트 그리는 함수
     * @param {Array} json 데이터
     * @param {Object} options 옵션
     */
    draw(json, options) {
      if (!json || json.length === 0) return; // 데이터가 없을 경우 리턴

      let that = this;
      let id = this.$refs.wrap;
      const element = this.$el;
      const chartOption = options.chartOption;
      const margin = chartOption.margin;
      const yColumn = chartOption.yColumn;
      const xColumn = chartOption.xColumn;
      const tickFormat = chartOption.tickFormat;

      this.margin = margin;
      this.tickFormat = tickFormat;

      var data = [];
      var total_bud = 0;
      if (json.data !== undefined && json.data.length > 0) {
        data = json.data;
        total_bud = json.totBud;
      } else {
        return false;
      }

      if (!this.isInit) {
        this.isInit = true;
        this.init(data);
      }

      this.chartX =
        (document.body.clientWidth -
          document.getElementsByClassName("navigation")[0].offsetWidth -
          Number(
            d3
              .select(element)
              .style("width")
              .replace("px", "")
          )) /
          2 +
        document.getElementsByClassName("navigation")[0].offsetWidth;

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
      this.width = width;
      this.x = d3.time.scale().range([0, width]);
      this.y = d3.scale.linear().range([height, 0]);
      let x = this.x;
      let y = this.y;

      // x 축 ( 그릴때 사용할 option ) - 메인
      //  .domain([new Date('2018-12-31'),new Date('2020-01-31')])
      // x축 실제 날짜 범위 지정
      var xScale = x.domain([that.$data.bDate, that.$data.eDate]);
      const xVDate = new Date(JSON.parse(JSON.stringify(that.$data.bDateForX)));
      var xValues = []; // x축에 보여질 날짜들 모임 ( 매월 01일 & 마지막 날짜:2019.01.31)
      for (var xi = 0; xi < 13; xi++) {
        if (xi == 0) {
          xValues.push(that.$data.bDate);
        } else if (xi < 12 && xi > 0) {
          var addDate = xVDate.setMonth(xVDate.getMonth() + 1);
          xValues.push(new Date(addDate));
        } else xValues.push(that.$data.eDateForX);
      }

      let xAxis = d3.svg
        .axis()
        .scale(xScale)
        //   .scale(x)
        .ticks(d3.time.month)
        .tickValues(xValues)
        .tickSize(-4, 0)
        //   .tickSize(-height)
        .tickFormat(tickFormat);

      let ytotValue = total_bud;
      let yMaxValue = d3.max(data, function(d) {
        return d[yColumn];
      });

      // if (ytotValue > yMaxValue) yMaxValue = ytotValue;
      yMaxValue = yMaxValue * 1.5;
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
        .tickFormat(that.dateFomat)
        .tickPadding(10);

      // x축과 곡선그래프 사이의 면적
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

      let line2 = d3.svg
        .line()
        .x(function(d) {
          return x(that.formatYYYYMMDDToDate(d[xColumn]));
        })
        .y(function(d) {
          return y(total_bud);
        });

      let svg = d3
        .select(element)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ",-10)");

      that.drawClipSvg(svg, width, height); // 그래프가 나올 영역 지정

      svg.datum(data); // 데이터 바인딩
      x.domain([that.$data.bDate, that.$data.eDate]);
      y.domain([0, yMaxValue + yMaxValue / 8]).nice();

      that.drawPath(svg, area); // 회색 그래프 ( 영역 그래프 )
      that.drawXaxis(svg, xAxis, width, height); // x축
      that.drawClipPath(svg, height); // x축위에 있는 slide바 영역 지정
      that.drawFillRectXaxis(svg, height); // 선택box(x축(날짜)부분의 진한 색상박스)
      that.drawSlideboxX(svg, xAxis, height); // 선택box(x축(날짜)부분의 진한 색상박스)안의 흰색 text
      that.drawYaxis(svg, yAxis); // y축 (+그리드)

      that.lineChartObj = that.drawLinePath(svg, line); // 회색 그래프 최상단 라인
      that.drawLastPoint(svg, data, chartOption); // 회색 선그래프 마지막 포인트에 dot 추가
      // that.drawLinePath2(svg, line2);      //  예산선 그래프 추가
      this.startSlider = this.sliderBuilder(
        svg,
        id,
        "startSlider",
        width,
        height,
        that.movingHandler,
        that.moveEndHandler
      ); // 왼쪽 포인터
      this.endSlider = this.sliderBuilder(
        svg,
        id,
        "endSlider",
        width,
        height,
        that.movingHandler,
        that.moveEndHandler
      ); // 오른쪽 포인터

      this.startSlider.constrain(that.sSliderHandler); // 슬라이더의 시작 부분 제한 함수( 기간 제한이나 길이 제한 등등)
      this.endSlider.constrain(that.eSliderHandler); // 슬라이더의 끝 부분 제한 함수( 기간 제한이나 길이 제한 등등)
      this.rectArea = that.drawGuideRect(svg, height, width); // 선택box(날짜부분의 진한 색상박스)

      // 초기값 설정
      var dStart = this.formatYYYYMMDDToDate(that.$data.defaultPeriod[0]);
      var dEnd = this.formatYYYYMMDDToDate(that.$data.defaultPeriod[1]);

      this.startSlider.move(x(dStart));
      this.endSlider.move(x(dEnd));
    },

    /**
     * @description x축과 곡선그래프 사이의 넓이를 계산하기 위한 컨테이너를 세팅하는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Number} width 차트 DOM 넓이
     * @param {Number} height 차트 DOM 높이
     */
    drawClipSvg(svg, width, height) {
      svg
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fillOpacity", 0.76)
        .style("background-color", "#F7B103");
      // .style("background-color", "#4d21bc");
    },

    /**
     * @description x축과 곡선그래프 사이의 넓이를 색상으로 채우는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Function} area 면적 그리는  콜백 함수
     */
    drawPath(svg, area) {
      svg
        .append("path")
        .attr("class", "area")
        .attr("clip-path", "url(#clip)")
        .attr("d", area);
    },

    /**
     * @description 곡선그래프 최상단 라인 그리는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Function} line 라인 그리는 콜백 함수
     * @returns {Object} 곡선그래프 최상단 라인
     */
    drawLinePath(svg, line) {
      return svg
        .append("path")
        .attr("class", "line")
        .attr("d", line);
    },

    drawLinePath2(svg, line) {
      return svg
        .append("path")
        .attr("class", "line2")
        .attr("d", line);
    },

    /**
     * @description x축 그리는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Function} xAxis x축 그리는 콜백 함수
     * @param {Number} height 위아래 조정 위한 높이
     */
    drawXaxis(svg, xAxis, width, height) {
      // x축 박스
      // svg
      //   .append("rect")
      //   .attr("class", "axisBox")
      //   .attr("transform", "translate(0," + height + ")")
      //   .attr("width", width)
      //   .attr("x", 0)
      //   .attr("height", "28px")
      //   .attr("stroke", "#4d21bc")
      //   .attr("stroke-width", "1")
      //   .style("opacity", 0.5)
      //   .attr("fill", "#ffffff");

      // x축
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dy", "1.2em")
        .style("font-size", "12px");
    },

    /**
     * @description y축 그리는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Function} yAxis y축 그리는 콜백 함수
     * @param {Number} left 좌우 조정 위한 마진 왼쪽
     */
    drawYaxis(svg, yAxis) {
      svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll(".y .tick:not(:first-of-type) line")
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2,2");
    },

    /**
     * @description 선택기간에 따른 x축 텍스트 (선택된 x축 영역)
     * @param {Document} svg 차트 DOM
     * @param {Function} xAxis x축 그리는 콜백 함수
     * @param {Number} height 위아래 조정 위한 높이
     *
     */
    drawSlideboxX(svg, xAxis, height) {
      svg
        .append("g")
        .attr("clip-path", "url(#clip2)")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dy", "1.2em")
        .style("font-size", "12px")
        .attr("fill", "#000000");
    },

    /**
     * @description 슬라이드박스 좌우 라인 그리는 메소드
     * @param {Document} slidebox 슬라이드박스 DOM
     * @param {Number} height 위아래 조정 위한 높이
     * @returns {Object} 슬라이드 박스 좌우 라인
     */
    drawSlideboxLine(slidebox, height) {
      var linePath = slidebox
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

    /**
     * @description 슬라이드박스 좌우 라인 위 점 그리는 메소드
     * @param {Document} slidebox 슬라이드박스 DOM
     * @returns {Object} 슬라이드 박스 좌우 라인 위 점
     */
    drawSlidePoint(slidebox) {
      var dot = slidebox
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5);
      return dot;
    },
    /**
     * @description 선그래프 마지막에 dot 넣기
     * @param {Document} svg 차트 DOM
     * @param {Document} data 데이터
     * @returns {Object} 슬라이드 박스 좌우 라인 위 점
     */
    drawLastPoint(svg, data, chartOption) {
      var that = this;
      return svg
        .selectAll(".dot_last")
        .data(data)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot_last") // Assign a class for styling
        .attr("cx", function(d) {
          if (
            that.x(that.eDateForX) ==
            that.x(that.formatYYYYMMDDToDate(d[chartOption.xColumn]))
          )
            return that.x(that.eDateForX);
          // return that.x(that.formatYYYYMMDDToDate(d[chartOption.xColumn]));
        })
        .attr("cy", function(d) {
          if (
            that.x(that.eDateForX) ==
            that.x(that.formatYYYYMMDDToDate(d[chartOption.xColumn]))
          )
            return that.y(d[chartOption.yColumn]) - 2.5;
          // return 0;
        })
        .attr("r", 5);

      // return
      // svg.append("circle")
      //   .attr("class", "dot_last")
      //   .attr("transform", "translate(" + 0 + "," + 0 + ")")
      //   .attr("r", 5);
    },

    /**
     * @description 슬라이드박스 기본세팅하는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Number} height 위아래 조정 위한 높이
     */
    drawClipPath(svg, height) {
      var that = this;
      var sPeriod = this.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[0])
      );
      var ePeriod = this.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[1])
      );
      var xPosition = this.margin.left;
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
          return sPeriod;
          // return sPeriod - 32;
        })
        .attr("y", 0)
        .attr("height", height + 21);
    },

    /**
     * @description 슬라이드박스 x축 그리는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Number} height 위아래 조정 위한 높이
     */
    drawFillRectXaxis(svg, height) {
      var that = this;
      var sPeriod = this.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[0])
      );
      var ePeriod = this.x(
        that.formatYYYYMMDDToDate(that.$data.defaultPeriod[1])
      );
      var xPosition = this.margin.left;
      svg
        .append("rect")
        .attr("class", "fillRect")
        .attr("ref", "fillRect")
        .attr("width", function() {
          return ePeriod - sPeriod;
        })
        .attr("x", function() {
          return sPeriod;
          // return sPeriod - 32;
        })
        .attr("y", height)
        .attr("height", 30)
        .attr("fill", "#6224fb");
      // .attr("fill", "#6224fb");
    },

    /**
     * @description x축을 제외한 슬라이드박스 내부 그리는 메소드
     * @param {Document} svg 차트 DOM
     * @param {Number} height 위아래 조정 위한 높이
     * @param {Number} height 좌우 조정 위한 높이
     */
    drawGuideRect(svg, height, width) {
      const that = this;
      let margin = this.margin;
      let dataEnd = this.dataEnd;
      let startSlider = this.startSlider;
      let endSlider = this.endSlider;
      let scaleX = this.x;
      let chartX = this.chartX;
      // 데이터가 있는 날까지만 검색
      let lastPosition = scaleX(dataEnd);
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
        // .attr("fill", "rgb(98,36,251, 0.8)")
        .attr("opacity", 0.3)
        .attr("cursor", "move")
        .call(dragBehavior);

      // 마우스 드래그시작시 호출되는 콜백함수
      function onSelectionDrag() {
        const self = d3.select(this);
        const currentX = Number(self.attr("x")); // 선택박스 가장 왼쪽 x좌표
        const sWidth = Number(self.attr("width")); // 선택박스 넓이
        const newX = currentX + d3.event.dx; // 선택박스 이동시킬 x좌표 (현재 선택박스 가장 왼쪽 x좌표 + 현재 마우스 x좌표)

        // 선택박스 이동시킬 x좌표가 음수이거나 선택박스 넓이보다 클 경우 리턴
        if (newX < 0 || newX + fillWidth > lastPosition) return;
        // if (newX < 0 || newX + sWidth > width) return;
        // if (newX < 0 || newX + sWidth > lastPosition) return false;

        rect.attr("x", newX);
        rect.attr("width", fillWidth);

        startSlider.move(newX);
        // endSlider.move(newX + sWidth);
        endSlider.move(newX + fillWidth);

        // 슬라이더 버튼의 날짜 변경
        that.movingHandler();
      }

      // 마우스 드래그끝날 경우 호출되는 콜백함수
      function onSelectionDragEnd() {
        /*
        const self = d3.select(this);
        const currentX = self.attr("x");
        const sWidth = self.attr("width");
        const x0 = scaleX.invert(currentX);
        const x1 = new Date(that.dateRound(x0).getTime() + term);

        startSlider.move(scaleX(that.dateRound(x0)));
        endSlider.move(scaleX(x1));
        */
        that.moveEndHandler();
      }
    },

    /**
     *
     */
    sliderBuilder(
      canvas,
      id,
      sliderName,
      maxWidth,
      height,
      movingHandler,
      moveEndHandler
    ) {
      // 선택 화살표 포인터부분
      let that = this;
      let chartX = this.chartX;
      let scaleX = this.x;
      let scaleY = this.y;
      let margin = this.margin;
      let silderData = this.data;
      var linePath = this.lineChartObj; // line chart object
      var sliderGroup = canvas.append("g").attr("class", "marker");
      var dotLine = this.drawSlideboxLine(sliderGroup, height);
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
          left = e.clientX;
          // 제한 사항 체크
          if (_constrain) {
            _constrain(event, elmnt);
          }
          var elmnt_left = elmnt.style.left.replace("px", "");
          left = Number(elmnt_left);
          offx = sliderName == "startSlider" ? margin.left : 0; //왼쪽 slider margin처리
          // moveX(elmnt_left - chartX + offx);
          // moveX(elmnt_left + offx);
          // var tick = getStopTick(left+offx);
          var tick = getStopTick(left + offx - margin.left);
          moveX(scaleX(tick));
          // 슬라이더 버튼의 날짜 변경
          movingHandler();
        }

        function closeDragElement(e) {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;

          // left = e.clientX;
          var elmnt_left = elmnt.style.left.replace("px", "");
          // left = left - chartX;
          left = Number(elmnt_left);
          offx = sliderName == "startSlider" ? margin.left : 0; //왼쪽 slider margin처리

          // var tick = getStopTick(left);
          var tick = getStopTick(left + offx - margin.left);
          moveX(scaleX(tick));
          // moveX(elmnt.offsetLeft + offx);
          // 슬라이더 버튼의 날짜 변경 및 선택에 대한 데이터 반영
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
        // var nearYvalue = scaleY(d.total_cnt);

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

    /**
     * @description 선택박스 다시 그리는 메소드
     */
    rectRedraw() {
      let margin = this.margin;
      let scaleX = this.x;
      let startX = this.startSlider.getX();
      let endX = this.endSlider.getX();
      if (endX - startX < 0) return;

      document.getElementById("guideRect").style.width = endX - startX + "px";
      document
        .getElementById("guideRect")
        .setAttribute("width", endX - startX + "px");
      document.getElementById("guideRect").setAttribute("x", startX);

      var sSliderHtml = this.$refs["gslider_startSlider"];
      var eSliderHtml = this.$refs["gslider_endSlider"];
      sSliderHtml.style.left = startX + "px";
      sSliderHtml.style["margin-left"] =
        -sSliderHtml.offsetWidth + margin.left + "px";
      eSliderHtml.style.left = endX + margin.left + "px";
      if (eSliderHtml.offsetWidth < sSliderHtml.offsetWidth)
        eSliderHtml.style["width"] = sSliderHtml.offsetWidth + "px";
      eSliderHtml.style["margin-right"] =
        -eSliderHtml.offsetWidth + margin.right + "px";
      // eSliderHtml.style["margin-left"] = eSliderHtml.offsetWidth + "px";

      var fillRect = document.getElementsByClassName("fillRect");
      if (fillRect.length > 0) {
        for (var fr = 0; fr < fillRect.length; fr++) {
          fillRect[fr].style.width = endX - startX + "px";
          fillRect[fr].setAttribute("width", endX - startX + "px");
          fillRect[fr].setAttribute("x", startX);
        }
      }
    },

    /**
     * 라벨에 대한 fomat 설정
     */
    dateFomat(d) {
      return this.changeWonUnit(d);
    },

    dateRound(dd) {
      var nDate = new Date(dd);
      nDate.setHours(nDate.getHours() + Math.round(nDate.getMinutes() / 60));
      nDate.setMinutes(0);
      return nDate;
    },

    /**
     * @description 선택박스 x축 왼쪽 박스 드래그이벤트 리스너
     * @param {Event} event Dom 이벤트
     * @param {Document} element 선택박스 x축 왼쪽 박스 DOM
     */
    sSliderHandler(event, element) {
      let left = event.clientX;
      let margin = this.margin;
      let chartX = this.chartX;
      let scaleX = this.x;
      let limitM = this.limitM;
      let endSlider = this.endSlider;
      var sSliderHtml = this.$refs["gslider_startSlider"];
      var sSliderLeft = sSliderHtml.style.left;

      // eslider 날짜의 1달 전 계산하기
      var lastDate = scaleX.invert(endSlider.getX());
      lastDate.setMonth(lastDate.getMonth() - limitM);
      // 1달 전 날짜의 위치 가져오기
      var endPosition = scaleX(lastDate);

      // 왼쪽 슬라드 버튼 움직임 제한
      sSliderLeft = Math.max(0, left - chartX);
      sSliderLeft = Math.min(sSliderLeft, endPosition);
      // sSliderLeft = Math.min(sSliderLeft, endSlider.getX())
      sSliderHtml.style.left = sSliderLeft + "px";
    },

    /**
     * @description 선택박스 x축 오른쪽 박스 드래그이벤트 리스너
     * @param {Event} event Dom 이벤트
     * @param {Document} element 선택박스 x축 오른쪽 박스 DOM
     */
    eSliderHandler(event, element) {
      let left = event.clientX;
      let width = this.width;
      let margin = this.margin;
      let chartX = this.chartX;
      let scaleX = this.x;
      let limitM = this.limitM;
      let startSlider = this.startSlider;
      var eSliderHtml = this.$refs["gslider_endSlider"];
      var eSliderLeft = Number(eSliderHtml.style.left.replace("px", ""));

      // 데이터가 있는 날까지만 검색
      var lastPosition = scaleX(this.dataEnd);

      // sslider 날짜의 1달 후 계산하기
      var startDate = scaleX.invert(startSlider.getX());
      startDate.setMonth(startDate.getMonth() + limitM);
      // 1달 후 날짜의 위치 가져오기
      var startPosition = scaleX(startDate);

      eSliderLeft = Math.max(
        left - chartX,
        Number(startPosition) + margin.left
      );
      eSliderLeft = Math.min(lastPosition + margin.left, eSliderLeft);

      eSliderHtml.style.left = eSliderLeft + "px";
    },

    /**
     * @description 선택 완료시
     */
    moveEndHandler() {
      const that = this;

      // 안내 팝업창 숨김
      d3.select(that.$el)
        .select(".group_help")
        .style("display", "none");

      let scaleX = this.x;
      let startSlider = this.startSlider;
      let endSlider = this.endSlider;
      let tickFormat = this.tickFormat;

      // 선택박스 x축 왼쪽 박스 날짜 데이터
      this.sResult = tickFormat(scaleX.invert(startSlider.getX()));
      // 선택박스 x축 오른쪽 박스 날짜 데이터
      this.eResult = tickFormat(scaleX.invert(endSlider.getX()));

      const sdate = "20" + this.sResult.split("/").join("");
      const edate = "20" + this.eResult.split("/").join("");

      this.defaultPeriod[0] = sdate;
      this.defaultPeriod[1] = edate;
      // 부모에게 이벤트발행
      this.$emit("trigger", {
        sdate: sdate,
        edate: edate
      });
    },

    /**
     * @description 선택박스 x축 좌우 박스 텍스트 변경하는 메소드
     */
    movingHandler() {
      let scaleX = this.x;
      let startSlider = this.startSlider;
      let endSlider = this.endSlider;
      let tickFormat = this.tickFormat;

      // 선택박스 x축 왼쪽 박스 날짜 데이터
      this.sResult = tickFormat(scaleX.invert(startSlider.getX()));
      // 선택박스 x축 오른쪽 박스 날짜 데이터
      this.eResult = tickFormat(scaleX.invert(endSlider.getX()));
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
  /* stroke: #666;
  stroke-width: 1.5px; */
  stroke: #42210b;
  stroke-width: 2px;
}
.timeseries_container >>> path.line2 {
  fill: none;
  stroke: #ff0000;
  stroke-width: 1.5px;
}
.timeseries_container >>> path.area {
  fill: #f7b103;
  /* fill: rgb(98, 36, 251); */
}
.timeseries_container >>> .axis {
  shape-rendering: crispEdges;
}
.timeseries_container >>> .axis line {
  color: #6224fb;
  /* color: #fbd14b; */
}
.timeseries_container >>> .axis .tick line {
  shape-rendering: crispEdges;
  fill: transparent;
  stroke: #555;
  /* color: #fbd14b; */
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
.timeseries_container >>> .y.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: "crispEdges"; /* 축 길이를 얇게 설정 */
}
.timeseries_container >>> .y.axis .tick line {
  stroke: #000;
  opacity: 0.7;
}
.timeseries_container >>> .guideline {
  stroke: #6224fb;
  /* stroke: #fbd14b; */
  stroke-width: 2;
}
.timeseries_container >>> .marker .dot {
  fill: #6224fb;
  /* fill: #fbd14b; */
}
.timeseries_container >>> .dot_last {
  fill: #42210b;
  /* fill: #fbd14b; */
}
/* 손잡이 */
.timeseries_container >>> .gslider {
  position: absolute;
  z-index: 1;
  bottom: 0px;
  height: 30px;
  padding: 0.2em 8px 0 8px;
  font-size: 13px;
  font-weight: bold;
  line-height: 22px;
  color: #fff;
  background-color: #6224fb;
  /* background-color: #fbd14b; */
  cursor: move;
}

/* 차트안의 선택 영역 */
.timeseries_container >>> .guideRect {
  fill: #6224fb;
  /* fill: #fbd14b; */
}

/* x축 선택 영역 */
.timeseries_container >>> .fillRect {
  fill: #6224fb;
  fill-opacity: 0.3;
  /* fill: #fbd14b; */
}
.timeseries_container >>> .gslider img {
  vertical-align: middle;
}
/* 왼쪽 손잡이 */
.timeseries_container >>> .gslider.startSlider {
  text-align: right;
  padding-left: 10px;
  border-bottom-left-radius: 15px;
  border-top-left-radius: 15px;
}
/* 왼쪽 손잡이(앞쪽) */
/* .timeseries_container >>> .gslider.startSlider:after {
  content: "";
  position: absolute;
  left: -14px;
  top: 0;
  border-style: solid;
  border-color: transparent transparent #6224FB transparent;
  border-width: 0 0 30px 14px;
} */

/* 오른쪽 손잡이 */
.timeseries_container >>> .gslider.endSlider {
  text-align: left;
  border-bottom-right-radius: 15px;
  border-top-right-radius: 15px;
}
/* 오른쪽 손잡이(뒷쪽) */
/* .timeseries_container >>> .gslider.endSlider:after {
  content: "";
  position: absolute;
  right: -14px;
  top: 0;
  border-style: solid;
  border-color: #6224FB transparent transparent transparent;
  border-width: 30px 14px 0 0;
} */
/* 회색 안내 팝업 */
.timeseries_container >>> .group_help {
  position: absolute;
  left: 50%;
  top: 35px;
  margin-left: -10%;
  padding: 10px 2%;
  border-radius: 5px;
  font-size: 14px;
  color: #fff;
  background: rgba(51, 51, 51, 0.8);
  text-align: center;
  cursor: pointer;
}
</style>