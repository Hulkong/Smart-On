<template>
  <div v-show="isVisibleLayer" id="popup">
    <v-flex
      style="position:absolute;width:100%;height:100%;z-index:21;opacity:0.7;background:black;"
    ></v-flex>
    <v-flex style="position:absolute;width:100%;height:100%;z-index:22;">
      <!--	크롬팝업창	-->
      <div class="chrome">
        <div class="cu">
          <img class="ch_cb" :src="getImageUrl('common/puzzle.gif')" alt="Smart-ON" />
          <!-- <span>
            본 사이트는 Chrome 브라우저에 최적화되어 있습니다.
            <br />
            <br />
          </span>
          <span>
            Smart-ON 서비스를 100% 이용하기 위해서는
            <br />
          </span>
          <span>Chrome 브라우저를 이용하시길 권장합니다.</span>-->
          <span>본 사이트는 Chrome 브라우저,</span>
          <br />
          <span>해상도 1920 * 1080 에 최적화 되어있습니다.</span>
          <br />
          <span>Smart-On 서비스를 100% 이용하시기 위해서는</span>
          <br />
          <span>Chrome 브라우저를 이용하시고,</span>
          <br />
          <span>알맞은 해상도로 조절 후 이용하시길 권장합니다.</span>
          <br />
          <span>감사합니다.</span>
          <br />
          <br />
        </div>
        <div class="ch_bt01">
          <div class="ch_dl">
            <a href="https://www.google.com/intl/ko/chrome/" target="_blank">Chrome 다운받기</a>
          </div>
        </div>
        <div class="ch_bt02">
          <div class="cl" @click="noShow">다시 보지 않기</div>
          <div class="cl" @click="isVisibleLayer = false">닫 기</div>
        </div>
      </div>
      <!--	///크롬팝업창	-->
    </v-flex>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisibleLayer: true
    };
  },

  components: {},

  computed: {},

  methods: {
    noShow() {
      this.setCookie("alarm_1", "Y", 365);
      this.isVisibleLayer = false;
    }
  },

  created() {},

  mounted() {
    const browse = navigator.userAgent.toLowerCase();

    const cookieValue = this.getCookie("alarm_1");
    if (cookieValue === "Y") {
      this.isVisibleLayer = false;
    }
  }
};
</script>
<style scoped src="@/assets/css/popup/style.css"></style>
<style scoped></style>