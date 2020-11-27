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
  created() {},

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

<style scoped>
#contents {
  overflow-y: auto;
  position: absolute;
  top: 80px;
  left: 28%;
  width: 72%;
  height: calc(100% - 80px);
}

#contents .select_region {
  z-index: 9999;
  position: fixed;
  top: 58px;
  width: fit-content;
  height: fit-content;
  margin-left: 15px;
}

#contents .select_region button {
  padding: 8px 27px;
  background: rgb(177, 178, 177);
}

#contents .select_region .on {
  background: rgb(53, 91, 184);
}
</style>