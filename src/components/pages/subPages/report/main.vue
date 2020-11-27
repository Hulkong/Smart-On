<template>
  <div id="report">
    <top></top>
    <left></left>
    <tab></tab>
    <contents></contents>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Vworld from "@/components/map/vworld/leaflet";
import Header from "@/components/pages/subPages/report/layout/header";
import Nav from "@/components/pages/subPages/report/layout/nav";
import Tab from "@/components/pages/subPages/report/layout/tab";
import Contents from "@/components/pages/subPages/report/layout/contents";

export default {
  props: {},

  data() {
    return {};
  },

  components: {
    vworld: Vworld,
    top: Header,
    left: Nav,
    tab: Tab,
    contents: Contents
  },

  computed: {},

  methods: {},

  created() {},

  mounted() {
    // 쿼리스트링이 없을경우 악의적 조작될 가능성 있으므로 홈으로 리다이렉트
    for (let key in this.$route.query) {
      if (!this.$route.query[key] || this.$route.query[key] === "undefined") {
        alert(key + "가 없습니다.");
        location.href = "/";
        return;
      }
    }
  }
};
</script>

<style scoped>
#map {
  position: relative;
  width: 100%;
  height: 100%;
}

#nav.on {
  width: 5%;
}

#tab.on,
#contents.on {
  left: 5%;
  width: 95%;
}

@media screen and (min-width: 1800px) {
  #nav {
    width: 21%;
  }
  #contents {
    left: 21%;
    width: 79%;
  }
}
</style>