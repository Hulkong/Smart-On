<template>
  <!--총선 게이트 시작-->
  <div id="vote_gate" class="vote_gate" v-if="isShowMobile">
    <div class="cont_wrap">
      <h1>
        <img class="home_btn" :src="getImageUrl('mobile/cancel.png')" @click="setShowMobile(false)" />
        <img class="logo" :src="getImageUrl('mobile/smarton_txt.png')" />
        <img class="vote_icon" :src="getImageUrl('mobile/vote_icon.png')" />
        <br />
        <span>
          <b>21대</b>국회의원
          <b>선거</b>
        </span>
      </h1>
      <h2>
        <span>
          <b>자신의 투표지역을</b>
          <br />선택 해주세요
        </span>
        <img :src="getImageUrl('mobile/korea_icon.png')" />
      </h2>
      <div class="select st01">
        <select class ref="megaSelect" @change="megaChange">
          <option value>광역시/도</option>
          <option v-for="(mega, index) in megas" :key="index" :value="mega.id">{{ mega.nm }}</option>
        </select>
        <div class="select__arrow"></div>
      </div>
      <div class="select st02">
        <select class ref="citySelect" @change="cityChange" @click="cityClick">
          <option value>시/군/구</option>
          <option v-for="(city, index) in citys" :key="index" :value="city.id">{{ city.nm }}</option>
        </select>
        <div class="select__arrow"></div>
      </div>
      <div class="select st03">
        <select class ref="admiSelect" @change="admiChange" @click="admiClick">
          <option value>읍/면/동</option>
          <option v-for="(admi, index) in admis" :key="index" :value="admi.id">{{ admi.nm }}</option>
        </select>
        <div class="select__arrow"></div>
      </div>

      <!-- <div class="ranking">
        <span class="standard">{{ voteData }} 기준</span>
        <ul>
          <li class="rank01">
            <span>
              회
              <b>선거구</b>
            </span>
            <strong>
              1&nbsp;&nbsp;{{ maxSelectedDistrict }}
              <img :src="getImageUrl('mobile/up.png')" />
            </strong>
          </li>
          <li class="rank02">
            <span>
              최다조회
              <b>후보자</b>
            </span>
            <strong>
              1&nbsp;&nbsp;{{ maxSelectedCandidate }}
              <img :src="getImageUrl('mobile/down.png')" />
            </strong>
          </li>
        </ul>
      </div>-->
    </div>
  </div>
  <!--총선 게이트 끝-->
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  props: {},
  data() {
    return {
      voteData: "",
      maxSelectedDistrict: "",
      maxSelectedCandidate: ""
    };
  },

  components: {},

  computed: {
    ...mapState("generalelectionstore", ["getUpdate", "electionArea"]),
    ...mapGetters("generalelectionstore", {
      isShowMobile: "getIsShowMobile",
      megas: "getMegas",
      citys: "getCitys",
      admis: "getAdmis",
      cityCd: "getCityCd"
    })
  },

  methods: {
    ...mapMutations("generalelectionstore", ["setShowMobile", "setCityCd"]),
    ...mapActions("generalelectionstore", [
      "setAsyncMegas",
      "setAsyncCitys",
      "setAsyncAdmis",
      "setSggAdmiList"
    ]),

    /**
     * @description 기준날짜 텍스트 세팅
     */
    setAsyncVoteDate() {
      const that = this;
      this.getData(this.getUpdate["dataURL"], {}).then(result => {
        const data = result["data"];
        that.voteData = data["stdr_date"].join("~");
      });
    },

    /**
     * @description 최대조회 선거구 설정
     */
    setMaxSelectedDistrict() {
      // console.log("setMaxSelectedDistrict");
      // this.getData().then().catch();
      this.maxSelectedDistrict = "강남갑";
    },

    /**
     * @description 최대조회 후보자 설정
     */
    setMaxSelectedCandidate() {
      // this.getData().then().catch();
      this.maxSelectedCandidate = "홍길동";
    },

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
      const cityCd = event.target.value;

      this.setAsyncAdmis(cityCd);
      this.setCityCd(cityCd);

      // 화성시 선택시 안내문
      if (cityCd == "41590") {
        alert(
          "봉담읍A : 분천리, 왕림리, 세곡리, 당하리, 마하리, 유리, 덕리, 덕우리, 하가등리, 상기리\n\n 봉담읍B : 상리, 내리, 수영리, 동화리, 와우리, 수기리"
        );
      }
    },

    /**
     * @description 행정동 변경하는 메소드
     * @param {Event} event
     */
    admiChange(event) {
      // console.log("change admi!!");

      const admiCd = event.target.value;
      const that = this;

      // 세션스토리지 행정동코드 저장
      sessionStorage.setItem("admicd", admiCd);
      sessionStorage.setItem("ctycd", this.cityCd);
      this.setSggAdmiList(admiCd).then(data => {
        sessionStorage.setItem("sggcd", data[0]["sgg_cd"]); // 세션스토리지 선거구코드 저장
        that.$ga.page("/m_election"); // 구글 어널리틱스 ( page 들어갈때)
        that.$router.push("/m_election");
      });
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
     * @description 행정동 셀렉트박스 클릭 이벤트
     * @param {Event} event
     */
    admiClick(event) {
      // console.log("click admi!!");

      const target = event.target;
      const megaSelect = this.$refs["megaSelect"];
      const citySelect = this.$refs["citySelect"];

      if (megaSelect.selectedIndex === 0) {
        target.selectedIndex = 0;
        // target.blur();
        // megaSelect.focus();
        alert("광역시/도를 선택해 주세요.");
        return;
      }

      if (citySelect.selectedIndex === 0) {
        target.selectedIndex = 0;
        // target.blur();
        // citySelect.focus();
        alert("시군구를 선택해 주세요.");
        return;
      }
    }
  },

  created() {},

  mounted() {
    this.setAsyncMegas("N");
    this.setAsyncVoteDate();
    this.setMaxSelectedDistrict();
    this.setMaxSelectedCandidate();
  }
};
</script>

<style scoped></style>
<style scoped src="@/assets/css/election/vote_gate.css"></style>