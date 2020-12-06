<template>
  <div id="sggSelect">
    <div class="cont_wrap">
      <div v-if="sgg.length > 0" :class="getClassNm()">
        <h1>
          <b>{{ fullName.length > 0 ? fullName[0].full_name : "" }}</b>의 선거구를 선택하세요
        </h1>
        <ul class="cf">
          <li v-for="(item, index) in sgg" :key="index" @click="selectSgg(item.sgg_cd)">
            <h2>{{ item.sgg_nm }}</h2>
            <span>{{ item.sgg_name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },

  components: {},

  computed: {
    ...mapGetters("generalelectionstore", {
      sggCd: "getSggCd",
      sgg: "getSgg",
      fullName: "getFullName"
    })
  },

  methods: {
    ...mapMutations("generalelectionstore", [
      "setSggCd",
      "setShowSelect",
      "setShowMain"
    ]),

    ...mapActions("generalelectionstore", [
      "setAsyncSggsFromCity",
      "setFullName"
    ]),

    /**
     * @description 클래스 이름 가져옴
     */
    getClassNm() {
      if (this.sgg.length < 2) {
        return "col02";
      } else {
        return "col0" + this.sgg.length;
      }
    },

    /**
     * @description 시군구 선택
     */
    selectSgg(sggCd = -1) {
      if (sggCd < 0) return;

      sessionStorage.setItem("sggcd", sggCd);
      this.$router.push("/report/ge/main");
    }
  },

  created() {},

  mounted() {
    const that = this;
    const cityCd = sessionStorage.getItem("ctycd");

    this.setFullName(cityCd);
    this.setAsyncSggsFromCity(cityCd).then(data => {
      sessionStorage.setItem("sggcd", data[0]["sgg_cd"]);
      that.setSggCd(data[0]["sgg_cd"]);

      // 선거구가 1개일 경우 메인페이지로 바로 이동
      if (data.length === 1) that.$router.push("/report/ge/main");
    });
  }
};
</script>
<style scoped src="@/assets/css/election/vote_web.css"></style>
<style scoped src="@/assets/css/election/sgg-select.css"></style>
