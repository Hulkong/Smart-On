<template>
  <div
    id="home"
    class="main"
    :style="{backgroundImage: 'url(' + getImageUrl('common/bg_img_main.jpg') + ')'}"
  >
    <v-container fluid class="pa-0" style="height:100vh;">
      <popup></popup>
      <Popup-corona></Popup-corona>
      <div class="bg_gradient">
        <div class="bg_graph"></div>
      </div>
      <v-layout align-center justify-start fill-height row wrap class="_container">
        <v-flex xs12 md12 class="_layout">
          <v-img class="_puzzle" :src="getImageUrl('common/puzzle.gif')"></v-img>
          <img class="_title" :src="getImageUrl('common/main_title.png')" />
          <div class="select st06">
            <select class ref="megaSelect" @change="megaChange">
              <option value>광역시/도</option>
              <option v-for="(mega, index) in megas" :key="index" :value="mega.id">{{ mega.nm }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
          <div class="select st06">
            <select class ref="citySelect" @change="cityChange" @click="cityClick">
              <option value>시/군/구</option>
              <option v-for="(city, index) in citys" :key="index" :value="city.id">{{ city.nm }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
        </v-flex>
      </v-layout>

      <!-- <div class="result cf">
        <a href="/m_election_result" >
          <img class="new" :src="getImageUrl('common/new_icon.png')" />
          <img class="icon" :src="getImageUrl('common/vote_result_icon.png')" />
          <b>제21대</b>총선 선거결과
          <img class="arrow" :src="getImageUrl('common/arrow01.gif')" />
        </a>
      </div>-->

      <div class="corona cf">
        <h3>
          CORONA
          <b>VIRUS</b>
        </h3>
        <h4>
          <b>코로나19 현황</b>(COVID-19)
        </h4>
        <a href="#none" @click="excuteLayerPopup(true)">
          <b>현황</b>보러가기
          <img class="arrow" :src="getImageUrl('common/arrow01.gif')" />
        </a>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Popup from "@/components/popup-home"; // 그리드 컴포넌트
import Popup_corona from "@/components/popup-event-covid";
export default {
  data() {
    return {
      keyword: "",
      searchContents: [],
      isTypingEnter: false // enter키 눌름여부
    };
  },

  components: {
    popup: Popup,
    "Popup-corona": Popup_corona
  },

  computed: {
    ...mapState("commonstore", ["regionList", "baseDate"]),

    ...mapGetters("commonstore", {
      megas: "getMegas",
      citys: "getCitys"
    }),

    /**
     * @description 검색리스트 시각 존재 여부
     * @returns {Boolean flag} 시각 존재여부
     */
    isVisibleSearchList() {
      // 검색결과가 존재할 경우 검색리스트 숨김
      if (this.searchContents.length === 0) return false;
      // 검색결과가 존재할 경우 검색리스트 보임
      else return true;
    }
  },

  methods: {
    ...mapMutations("commonstore", ["excuteLayerPopup"]),

    ...mapActions("commonstore", ["setAsyncMegas", "setAsyncCitys"]),

    /**
     * @description 시도 변경하는 메소드
     * @param {Event} event
     */
    megaChange(event) {
      // console.log("change mega!!");
      const megaCd = event.target.value;
      this.setAsyncCitys(megaCd);
    },

    /**
     * @description 시군구 변경하는 메소드
     * @param {Event} event
     */
    cityChange(event) {
      // console.log("change city!!");
      const that = this;
      const cityCd = event.target.value;
      this.setSessionStorage(cityCd);

      setTimeout(() => {
        that.$router.push("/report/cityStatus");
      }, 1000);
    },

    /**
     * @description 시군구 셀렉트박스 클릭 이벤트
     * @param {Event} event
     */
    cityClick(event) {
      // console.log("click city!!");
      const target = event.target;
      const select = this.$refs["megaSelect"];

      if (select.selectedIndex === 0) {
        target.selectedIndex = 0;
        // target.blur();
        // select.focus();
        alert("광역시/도를 선택해 주세요.");
        return;
      }
    },

    /**
     * @description 세션 스토리지 데이터 저장
     */
    setSessionStorage(cityCd = -1) {
      if (cityCd < 0) return;

      const city = this.citys.filter(item => item.id === cityCd);

      if (city.length === 0) return;

      const cityNm = city[0]["nm"];
      const search_location = this.$route.name;

      // 구글 어널리틱스 이벤트
      this.$ga.event(search_location + " search", "search", cityNm); //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

      this.getBaseDate(data => {
        const sdate = this.getDate("yyyymmdd", data[0]).join("");
        const edate = this.getDate("yyyymmdd", data[1]).join("");
        const start_date = this.getDate("yyyymmdd", data[0]).join("");
        const end_date = this.getDate("yyyymmdd", data[1]).join("");

        sessionStorage.setItem("sdate", sdate);
        sessionStorage.setItem("edate", edate);
        sessionStorage.setItem("start_date", start_date);
        sessionStorage.setItem("end_date", end_date);
        sessionStorage.setItem("ctycd", cityCd);
        sessionStorage.setItem("currMainTab", 0);
        sessionStorage.setItem("currSubTab", -1);
      });
    }
  },

  created() {},

  mounted() {
    // 구글 어널리틱스
    this.$ga.page("/");

    this.setAsyncMegas();
  }
};
</script>

<style scoped>
#home {
  background-size: cover;
}

#home >>> input {
  text-align: center;
  padding-right: 30px !important;
}

#home >>> ._container {
  padding-top: 8%;
  padding-left: 20%;
}

#home >>> ._layout {
  max-width: 560px;
  min-height: 535px;
  padding: 0;
}

#home >>> ._layout ._puzzle {
  float: left;
  width: 80px;
  height: 80px;
}

#home >>> ._layout ._title {
  background-size: inherit;
  z-index: 2;
  position: relative;
}

#home >>> .v-input__slot {
  border-radius: 30px !important;
  padding: 0 30px !important;
}

#home >>> ._search_container {
  position: relative;
  z-index: 1;
  padding-top: 36px;
  padding-left: 80px;
}

#home >>> .search_contents_container {
  height: 220px;
  position: relative;
  top: -30px;
  margin: 0 1px;
  padding: 40px 10px 10px 10px;
  border-bottom-right-radius: 23px;
  border-bottom-left-radius: 23px;
  margin-left: 81px;
}

#home >>> .search_contents {
  height: 40px;
  text-align: center;
  padding-top: 10px;
  font-weight: bold;
  color: black;
}

#home >>> .search_contents:hover {
  background: #433b76;
  color: #fff;
}

::-webkit-scrollbar {
  width: 14px; /* 세로축 스크롤바 길이 */
}
::-webkit-scrollbar-track {
  background-color: rgb(212, 212, 212);
  border-radius: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  width: 10px;
  background-color: #727171;
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  background-clip: content-box;
}
</style>
<style scoped src="@/assets/css/landing.css"></style>
