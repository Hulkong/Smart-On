<template>
  <!-- 본문 -->
  <div id="contents" :class="{ on: change }">
    <vworld ref="vworld"></vworld>
    <div class="select_region">
      <button
        class="search_btn mega"
        :class="{on: isActiveRegion}"
        @click="isActiveRegion = true"
      >시도 선택</button>
      <button
        class="search_btn cty"
        :class="{on: !isActiveRegion}"
        @click="isActiveRegion = false"
      >시군구 선택</button>
    </div>
  </div>
  <!-- //본문 -->
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Vworld from "@/components/map/vworld/leaflet";
export default {
  created() {},

  props: {},

  data() {
    return {
      isActiveRegion: true,
      searchContents: []
    };
  },

  components: {
    vworld: Vworld
  },

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
  overflow: hidden;
  position: absolute;
  top: 40px;
  left: 28%;
  width: 72%;
  height: calc(100% - 40px);
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