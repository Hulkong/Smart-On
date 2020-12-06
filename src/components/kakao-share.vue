<template>
  <a id="kakao-link-btn">
    <img v-if="showCustomBtn" class="kakao_btn" :src="getImageUrl('mobile/kakao-talk.png')" style />
    <img
      v-else
      class="kakao_btn"
      src="//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
    />
  </a>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    showCustomBtn: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  components: {},

  computed: {},

  methods: {},

  created() {},

  mounted() {
    // 사용할 앱의 JavaScript 키를 설정해 주세요.
    if (!Kakao.isInitialized()) Kakao.init("5d79209fbd811e50c697440869cf2399");

    // 백엔드 호스트네임
    let backendUrl = "http://dev.openmate-on.co.kr:8481";

    if (location.hostname.indexOf("smart-on.co.kr") >= 0) {
      backendUrl = location.protocol + "//" + location.hostname;
    }

    Kakao.Link.createDefaultButton({
      container: "#kakao-link-btn",
      objectType: "feed",
      content: {
        title: "스마트온",
        description: "제21대 국회의원 선거 우리동네에 딱 맞는 후보는 누구?",
        imageUrl: backendUrl + "/static/meta_img.png", // 썸네일 이미지
        // imageUrl: backendUrl + "/static/favicon.ico", // 썸네일 이미지
        imageWidth: 400,
        imageHeight: 256,
        link: {
          // webUrl: "https://smart-on.co.kr",
          // mobileWebUrl: "https://smart-on.co.kr/m"
        }
      },
      // social: {
      //   likeCount: 10,
      //   commentCount: 20,
      //   sharedCount: 30
      // },
      // buttons: [
      //   {
      //     title: "게시글 확인", // 버튼 제목
      //     link: {
      //       webUrl: "https://trend-on.co.kr/", // PC버전 카카오톡에서 사용하는 웹 링크 URL
      //       mobileWebUrl: "https://trend-on.co.kr/" // 모바일 카카오톡에서 사용하는 웹 링크 URL
      //     }
      //   }
      // ],
      success: function(response) {
        console.log(response);
      },
      fail: function(error) {
        console.log(error);
      }
    });
  }
};
</script>

<style scoped>
div.fixed_menu img.kakao_btn {
  width: 28px;
  height: auto;
  position: absolute;
  top: 9px;
  right: 20px;
}
@media (max-width: 768px) and (min-width: 601px) {
  div.fixed_menu img.kakao_btn {
    width: 45px;
    height: auto;
    position: absolute;
    top: 16px;
    right: 20px;
  }
}
</style>