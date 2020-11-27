<template>
  <div id="tab" :class="{ on: isNarrow }">
    <router-link
      v-for="(tab, index) in tabs"
      :key="tab.id"
      :to="{path : tab.path, params: params}"
      class="tab_child"
      :class="{on: currentTab === index}"
    >
      <span @click="currentTab = index">{{ tab.name }}</span>
    </router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  created: function() {
    const ctycd = this.$route.query.ctycd; // 지역코드
    const sdate = this.$route.query.sdate; // 기준 시작날짜
    const edate = this.$route.query.edate; // 기준 마지막날짜

    for (var obj in this.$data.tabs) {
      this.$data.tabs[obj].path += "?ctycd=" + ctycd;
      this.$data.tabs[obj].path += "&sdate=" + sdate;
      this.$data.tabs[obj].path += "&edate=" + edate;
    }
  },

  props: {},

  data() {
    return {
      currentTab: 0,
      params: {},
      tabs: [
        {
          path: "/report/cityStatus",
          name: "도시현황"
        },
        {
          path: "/report/cityDiagnosis",
          name: "도시진단"
        },
        {
          path: "/report/policyRecommend",
          name: "정책추천"
        }
      ]
    };
  },

  components: {},

  computed: {
    ...mapState("layoutstore", ["isNarrow"])
  },

  methods: {}
};
</script>

<style scoped>
#tab {
  overflow: hidden;
  position: absolute;
  top: 40px;
  left: 28%;
  width: 72%;
  height: 40px;
  background-color: #002060;
  text-align: center;
}

#tab span {
  display: block;
  padding-top: 3%;
  color: #fff;
  cursor: pointer;
}

#tab .tab_child {
  float: left;
  width: calc(100% / 3);
  height: 100%;
}

.tab_child:hover {
  background: #244a8d;
}

.tab_child.on {
  background: #244a8d;
}
</style>