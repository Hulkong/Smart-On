<template>
  <div id="mobile_detail">
    <div class="smartP_wrap">
      <!-- <div class="section01">
            <span class="Nt_R">- 오픈메이트온 뉴스레터</span>
      </div>-->
      <div class="section02">
        <img :src="getImageUrl('mobile/title.png')" alt="Smart-ON 서비스 소개" />
      </div>
      <div class="section03">
        <div class="dash"></div>
        <span class="NS_EB">
          " Smart-ON은
          <br />
        </span>
        <span class="NS_EB">
          빅데이터와 인공지능으로
          <br />
        </span>
        <span class="NS_EB">도시를 분석합니다. "</span>
        <div class="dash"></div>
      </div>
      <div class="main">
        <div class="section04">
          <img :src="getImageUrl('mobile/se_01.png')" alt="빅데이터를 모아서" />
          <h1 class="NS_EB">빅데이터를 모아서</h1>
          <span class="Nt_M">
            분야별 공공데이터,
            <br />
          </span>
          <span class="Nt_M">
            예산 지출현황 등 빅데이터로
            <br />
          </span>
          <span class="Nt_M">도시를 한 눈에 파악합니다.</span>
        </div>
        <div class="section05">
          <img :src="getImageUrl('mobile/se_02.png')" alt="도시를 진단해" />
          <h1 class="NS_EB">도시를 진단해</h1>
          <span class="Nt_M">
            12개 분야의 다양한
            <br />
          </span>
          <span class="Nt_M">
            진단지표를 통해 도시를 진단하고
            <br />
          </span>
          <span class="Nt_M">유사지자체와 비교합니다.</span>
        </div>
        <div class="section06">
          <img :src="getImageUrl('mobile/se_03.png')" alt="인공지능이 정책을 매칭" />
          <h1 class="NS_EB">인공지능이 정책을 매칭</h1>
          <span class="Nt_M">
            현황 및 진단 데이터를
            <br />
          </span>
          <span class="Nt_M">
            기반으로 필요한 정책을
            <br />
          </span>
          <span class="Nt_M">매칭하여 보여줍니다.</span>
        </div>
        <!-- 
            <div class="ex">
                <div class="section07">
                    <span class="Nt_B">오픈메이트온의<br></span>
                    <span class="Nt_B">다른 서비스들도 궁금하다면? 👇<br></span>
                    <span class="Nt_R">(클릭하시면 해당 서비스로 이동합니다.)</span>
                </div>
                <div class="section08">
                    <a href="https://trend-on.co.kr/" target="_blank"><img src="../img/trend-on.png" alt="Trend-ON"></a>
                </div>
                <div class="section09">
                    <a href="https://safe-on.co.kr/" target="_blank"><img src="../img/safe-on.png" alt="Safe-ON"></a>
                </div>
                <div class="section10">
                    <a href="http://light-on.co.kr/" target="_blank"><img src="../img/light-on.png" alt="Light-ON"></a>
                </div> 
            </div>
        -->
        <div class="section11">
          <span class="Nt_R">
            PC로 smart-on.co.kr에 접속하시면
            <br />
          </span>
          <span class="Nt_R">
            다양한 기능을 사용할 수 있습니다.
            <br />
          </span>
          <span class="Nt_R">
            Chrome 브라우저, 해상도 1920*1080에 최적화되어 있습니다.
            <br />
          </span>
          <span class="Nt_R">감사합니다.</span>
          <!-- <span class="Nt_R">ㅡ</span> -->
        </div>
      </div>

      <div class="section12">
        <span class="Nt_R">
          오픈메이트온
          <a class="btn" href="https://www.openmate-on.co.kr/" target="_blank">
            홈페이지&nbsp;
            <b>바로가기</b>
          </a>
          <br />
        </span>
        <span class="Nt_R">
          sales@openmate-on.co.kr
          <br />
        </span>
        <span class="Nt_R">
          서울시 중구 청계천로 100 시그니처타워 서관 11층
          <br />
        </span>
        <span class="SHS_R">Tel) 02-6956-7541</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },

  components: {},

  computed: {
    // 지도위에 올라갈 레이어 관련 스토어
    ...mapGetters("commonstore", {
      getDevice: "getDevice"
    })
  },

  methods: {},

  created() {
    this.setDeviceType("mo");
  },

  mounted() {
    if (this.getDevice == "mo") {
      let html = document.documentElement;
      html.setAttribute("style", "overflow-y:scroll");
    }
  },
  methods: {
    ...mapMutations("commonstore", ["setDeviceType"])
  }
};
</script>
 <style scoped src="@/assets/css/event/default.css"></style>
 <style scoped src="@/assets/css/event/mobile-detail-info.css"></style>
<style scoped></style>