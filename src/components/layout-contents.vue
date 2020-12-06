<template>
  <!-- 본문 -->
  <div id="contents" :class="{ on: change }">
    <router-view></router-view>
  </div>
  <!-- //본문 -->
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  created() {
    const that = this;

    // 페이지 리로딩시 감지 리스너
    window.onunload = function(event) {
      that.evntDefaultScroll(0);
    };
  },

  props: {},

  data() {
    return {
      isRegionActive: true,
      searchContents: []
    };
  },

  components: {},

  computed: {
    ...mapState("layoutstore", ["isNarrow"]),
    change() {
      if (this.$refs.vworld) this.$refs.vworld.map.invalidateSize();
      return this.isNarrow;
    }
  },

  methods: {}
};
</script>

<style scoped></style>