<template>
  <div id="mobile_home">
    <!-- ********************** 지우시면 안돼요(1/2) ********************** -->
    <popup></popup>
    <!-- ********************** //지우시면 안돼요(1/2) ********************** -->

    <section class="bg_img">
      <div class="bg_gradient"></div>
      <img class="main_txt" :src="getImageUrl('mobile/main_txt.png')" />
      <img class="logo" :src="getImageUrl('mobile/logo.gif')" />
      <div class="utube">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/NiW_BDLmqrg?amp;autoplay=1"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="link">
        <a class="vote" @click="excuteLayerPopup(true)">
          <span class="issue">Issue</span>
          <b>코로나19</b> 현황
          <img :src="getImageUrl('mobile/arrow01.gif')" />
        </a>
        <a class="corona" href="/m_election_result">
          <b>제21대</b> 총선
          <b>선거결과</b>
          <img :src="getImageUrl('mobile/arrow01.gif')" />
        </a>
        <a class="smart_on" @click="setShowMobile(true)">
          <b>제21대</b> 총선
          <b>공약분석</b>
          <img :src="getImageUrl('mobile/arrow01.gif')" />
        </a>
        <a class="item_guide" href="/m_detail" target="_self" style="margin-top:20px;">
          <b>스마트온 상품안내</b>
          <img :src="getImageUrl('mobile/arrow01.gif')" />
        </a>
      </div>
    </section>

    <mobile-Select></mobile-Select>

    <!--
    <div class="applyFinish">
  
      <div class="wrap_head">
        <h1 class="main_logo bold helv">
          <a href="/" class="logo">
            <v-img contain width="100%" height="100%" :src="getImageUrl('mobile/logo.png')" />
          </a>
        </h1>
        <div class="content">
          <div class="con_top">
            <p class="tit">
              Smart-ON 서비스에
              <br />방문해 주셔서 감사합니다.
            </p>
          </div>
        </div>
      </div>
      <div class="layer_con">
        <div class="group_txt">
          <p class="finishImg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/NiW_BDLmqrg?amp;autoplay=1"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          
          </p>
          <p class="txt">현재 버전은</p>
          <p class="txt">모바일을 지원하지 않습니다.</p>
          <br />
          <p class="txt">불편하시더라도</p>
          <p class="txt">PC를 통해 이용해주세요.</p>
          <p class="txt">감사합니다.</p>
    -->
    <!-- </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Popup from "@/components/popup-event-covid";
import Select from "@/components/mobile-general-election-select";
export default {
  data() {
    return {};
  },

  components: {
    popup: Popup,
    "mobile-Select": Select
  },

  computed: {},

  methods: {
    ...mapMutations("commonstore", ["excuteLayerPopup", "setDeviceType"]),
    ...mapMutations("generalelectionstore", ["setShowMobile"])
  },

  created() {
    this.setDeviceType("mo");
  },

  mounted() {}
};
</script>
<style scoped src="@/assets/css/event/mo_main.css"></style>
<style scoped>
#mobile_home {
  height: 100vh;
}

#mobile_home >>> section span.issue {
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  position: absolute;
  top: -10px;
  left: -10px;
  padding: 4px 10px;
  color: red;
  background: #f8f8f8;
  border-radius: 20px;
  border: 2px solid red;
}

#mobile_home >>> .item_guide {
  margin-top: 20px;
  display: block;
  font-size: 18px;
  background: rgb(128, 92, 240);
  padding: 15px 16px;
  color: #ddd6ff;
  border-radius: 40px;
  width: 76%;
  margin-left: 12%;
}
</style>