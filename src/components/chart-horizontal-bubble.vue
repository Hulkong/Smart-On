<template>
  <div class="chart horizontal_bubble_container">
    <v-layout align-center justify-space-between fill-height wrap>
      <v-flex
        class="bubbles"
        md1
        v-for="(item, index) in bubbles"
        :key="index"
        :class="{on: item.active, _no_value: item.noValue}"
        @click="clickBubble($event, item.code, index)"
      >
        <v-flex class="_top">
          <v-layout align-center justify-center fill-height>
            <v-avatar class="_bubble_avatar" :key="index" :size="item.size">
              <v-img
                contain
                :width="item.size - 48"
                :src="getImageUrl(item.src)"
                max-width="43"
                alt="avatar"
                style="border-radius:0;"
                position="center center"
              />
            </v-avatar>
          </v-layout>
        </v-flex>
        <v-flex class="_bottom">
          <p class="_bubble_title">{{ item.name }}</p>
        </v-flex>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  name: "horizontalBubble",

  props: {
    options: Object
  },

  data() {
    return {
      copyData: [],
      bubbles: [], // 버블차트 그리기 위한 데이터(복수)
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
      this.makeBubbleArr(data);
    },

    /**
     * @description 차트 삭제하는 메소드
     */
    remove() {},

    /**
     * @description 버블차트 배열데이터 만드는 메소드
     * @param {Array} data 데이터
     */
    makeBubbleArr(data) {
      const that = this;
      const items = [
        {
          code: "110", // 산업, 중소기업
          src: "common/icon_id.png",
          offSrc: "common/icon_id.png",
          onSrc: "common/icon_id_on.png",
          size: 100,
          active: false
        },
        {
          code: "120", // 수송 및 교통
          src: "common/icon_traffic.png",
          offSrc: "common/icon_traffic.png",
          onSrc: "common/icon_traffic_on.png",
          size: 80,
          active: false
        },
        {
          code: "50", // 교육
          src: "common/icon_edu.png",
          offSrc: "common/icon_edu.png",
          onSrc: "common/icon_edu_on.png",
          size: 80,
          active: false
        },
        {
          code: "140", // 국토 및 지역개발
          src: "common/icon_local.png",
          offSrc: "common/icon_local.png",
          onSrc: "common/icon_local_on.png",
          size: 80,
          active: false
        },
        {
          code: "80", // 사회복지
          src: "common/icon_welfare.png",
          offSrc: "common/icon_welfare.png",
          onSrc: "common/icon_welfare_on.png",
          size: 60,
          active: false
        },
        {
          code: "160", // 예비비
          src: "common/icon_budget.png",
          offSrc: "common/icon_budget.png",
          onSrc: "common/icon_budget_on.png",
          size: 60,
          active: false
        },
        {
          code: "90", // 보건
          src: "common/icon_health.png",
          offSrc: "common/icon_health.png",
          onSrc: "common/icon_health_on.png",
          size: 60,
          active: false
        },
        {
          code: "60", // 문화 및 관광
          src: "common/icon_culture.png",
          offSrc: "common/icon_culture.png",
          onSrc: "common/icon_culture_on.png",
          size: 40,
          active: false
        },
        {
          code: "10", // 일반 공공행정
          src: "common/icon_public.png",
          offSrc: "common/icon_public.png",
          onSrc: "common/icon_public_on.png",
          size: 40,
          active: false
        },
        {
          code: "20", // 공공질서 및 안전
          src: "common/icon_safe.png",
          offSrc: "common/icon_safe.png",
          onSrc: "common/icon_safe_on.png",
          size: 40,
          active: false
        },
        {
          code: "70", // 환경보호
          src: "common/icon_environment.png",
          offSrc: "common/icon_environment.png",
          onSrc: "common/icon_environment_on.png",
          size: 40,
          active: false
        },
        {
          code: "900", // 기타
          src: "common/icon_etc.png",
          offSrc: "common/icon_etc.png",
          onSrc: "common/icon_etc_on.png",
          size: 40,
          active: false
        },
        {
          code: "100", // 농림해양수산
          src: "common/icon_ns.png",
          offSrc: "common/icon_ns.png",
          onSrc: "common/icon_ns_on.png",
          size: 40,
          active: false
        },
        {
          code: "150", // 과학기술
          src: "common/icon_st.png",
          offSrc: "common/icon_st.png",
          onSrc: "common/icon_st_on.png",
          size: 40,
          active: false
        }
      ];
      // 가장 큰 크기 찾기
      // let bubEl = this.$el.getElementsByClassName("bubbles-area")[0];
      let bubEl = this.$el;
      let bub_w = bubEl.offsetWidth / 12;
      let bub_h = bubEl.offsetHeight * 0.8;
      let max_r = Math.min(bub_w, bub_h);

      this.bubbles = [];
      data.reduce((acc, v, i) => {
        let offSrc = "";
        let onSrc = "";
        // let size = items[i]["size"];
        const budIdx = v["budIdx"];
        // let size = Math.round(((100 - 40) * budIdx) / 100) + 50;
        let size =
          ((max_r - 50) * budIdx) / 100 > 0
            ? ((max_r - 50) * budIdx) / 100 + 50
            : 50;
        let currItem = items.filter(item => item.code === v["realm_cd"]);

        // if (budIdx > 0) {
        offSrc =
          currItem.length === 0 ? "common/empty_12.png" : currItem[0]["src"];
        onSrc =
          currItem.length === 0
            ? "common/empty_12_on.png"
            : currItem[0]["onSrc"];

        // 이하일 경우 빈 이미지 사용
        // } else {
        //   offSrc = "common/empty_12.png";
        //   onSrc = "common/empty_12_on.png";
        // }

        that.bubbles.push({
          src: i === 0 ? onSrc : offSrc, // 실제 사용되는 이미지
          onSrc: onSrc, // on 이미지
          offSrc: offSrc, // off 이미지
          size: size, // 이미지 사이즈
          name: v["realm_nm"], // 분야명
          budgetTot: v["budgetTot"], // 지수
          code: v["realm_cd"], // 분야코드
          budIdx: budIdx, // 지수
          active: i === 0 ? true : false, // 활성화 여부
          noValue: budIdx === 0 ? true : false // 지수값 여부
        });
      }, []);
    },

    /**
     * @description wheel 이벤트 적용 후 작동하는 이벤트 메소드
     * @param {Number} pageIndex 활성화된 페이지 인덱스
     * @param {Number} activeBubbleIndex 활성화된 분야 인덱스
     */
    evntFromParent(pageIndex, activeBubbleIndex) {
      const activeSelectList = document.getElementsByClassName(
        "menuable__content__active"
      );

      for (let i = 0; i < activeSelectList.length; i++) {
        const currTarget = activeSelectList[i];
        currTarget.style.display = "none";
      }

      this.activeBubble(pageIndex, activeBubbleIndex); // 액티브 버블 활성화
    },

    /**
     * @description 스크롤 이벤트에 따른 버블 활성화
     * @param {Number} pageIndex 활성화된 페이지 인덱스
     * @param {Number} activeBubbleIndex 활성화된 분야 인덱스
     */
    activeBubble(pageIndex, activeBubbleIndex) {
      if (this.bubbles.length === 0) return;
      // 첫 번째 페이지 이상일 경우 버블 활성화
      if (pageIndex > 0) {
        const activeBubble = this.bubbles[activeBubbleIndex]; // 선택된 분야
        activeBubble["active"] = true; // 버블 활성화
        activeBubble["src"] = activeBubble["onSrc"]; // 버블 이미지 On
      }
    },

    /**
     * @description 수평 원차트 클릭 트리거 이벤트
     * @param {Event} event DOM 이벤트
     * @param {String} code 분야코드
     * @param {Number} index 인덱스
     */
    clickBubble(event, realmCd, index) {
      const that = this;
      const ctyCd = sessionStorage.getItem("ctycd");
      let activePage = 0;

      // 지수가 없는 분야는 리턴
      if (event.currentTarget.classList.contains("_no_value")) return;

      // 이벤트 감지 DOM이 active인 경우
      if (event.currentTarget.classList.contains("on")) {
        event.currentTarget.classList.remove("on");

        this.bubbles[index]["src"] = this.bubbles[index]["offSrc"];
        this.bubbles[index]["active"] = false;

        // 이벤트 감지 DOM이 inactive인 경우
      } else {
        this.bubbles.reduce((acc, v, i) => {
          v["src"] = v["offSrc"];
          v["active"] = false;
        }, []);
        this.bubbles[index]["src"] = this.bubbles[index]["onSrc"];
        this.bubbles[index]["active"] = true;
        event.currentTarget.classList.add("on");

        activePage = 1;
      }

      // 부모로 이벤트버스 호출
      this.$emit("trigger", {
        activePage: activePage,
        selectBubble: {
          text: this.bubbles.filter(item => item.code === realmCd)[0]["name"],
          index: index
        },
        realmCd: realmCd
      });
    }
  }
};
</script>
<style scoped>
.horizontal_bubble_container {
  width: 100%;
  height: 100%;
}
</style>