<template>
  <div class="chart wordcloud_container">
    <div class="_loading_bar">
      <img class="_image" :src="getImageUrl('common/viewLoading.gif')" alt />
    </div>
    <div class="_default_image">
      <img class="_image" :src="getImageUrl('common/img_ready01.png')" alt />
    </div>
  </div>
</template>
<script>
import WordCloud from "wordcloud";
import md5 from "md5";

export default {
  name: "wordcloud",

  props: { options: Object },

  data() {
    return {
      copyData: []
    };
  },

  created() {
    // ie에서는 CustomEvnet 지원하지 않으므로 생성해주어야 함
    (function() {
      if (typeof window.CustomEvent === "function") return false;

      function CustomEvent(event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
          event,
          params.bubbles,
          params.cancelable,
          params.detail
        );
        return evt;
      }

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    })();
  },

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
      if (!data || data.length === 0) return; // 데이터가 없을 경우 리턴

      const element = this.$el; // 이 컴포넌트 DOM
      const chartOption = options.chartOption;
      const shape = chartOption.shape;
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

      const id = md5(new Date() + new Date().getMilliseconds());
      const canvas = d3
        .select(element)
        .append("canvas")
        .attr("id", id)
        .attr("width", width)
        .attr("height", height);
      const wFactor = Math.min(width, height);
      const wordcloudOptions = {
        list: data,
        // gridSize: Math.round((16 * element.offsetWidth) / 1024),  // 그리드 사이즈
        gridSize: 1, // 그리드 사이즈
        // weightFactor:3,
        // weightFactor: size => (size * 10 * wFactor) / 1024, // 가중치 계산
        weightFactor: size => {
          return (size * 8 * wFactor) / 1024;
        }, // 가중치 계산
        // color: ["#ff0000"],  // 색상지정(callback 함수로 size별 색상 설정 가능)
        // classes: (word, value) => md5(word), // 독립적으로 class 줄 수 있음
        shape: shape, // ['circle','triangle','triangle-forward','pentagon','star','cloud','cardioid','diamond','square']
        backgroundColor: "white",
        ellipticity: 1, // flat degree(값이 작을수록 x축으로 flat, 값이 클수록 y축으로 flat)
        shrinkToFit: true, // 크기에 맞게 줄임
        drawOutOfBound: true // 외각 경계를 넘기지 않음
      };

      // debugger;
      WordCloud(document.getElementById(id), wordcloudOptions);
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {
      const browse = navigator.userAgent.toLowerCase();

      // 차트 삭제
      d3.select(this.$el)
        .select("canvas")
        .remove();
    }
  }
};
</script>
<style scoped>
.wordcloud_container {
  width: 100%;
  height: 100%;
}

.wordcloud_container >>> ._default_image {
  background: white;
}

.wordcloud_container >>> ._default_image ._image {
  width: auto;
  bottom: 0;
}
</style>