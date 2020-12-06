<template>
  <!-- header -->
  <div id="header">
    <div class="top_area">
      <img
        src="@/assets/images/common/menu_icon.png"
        alt="menu"
        :class="{ on: isNarrow }"
        @click="changeNav"
      />
      <span>Smart-ON+</span>
    </div>
  </div>
  <!-- //header -->
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  created: function() {
    // 모든 화면이 렌더링된 후 호출됩니다.
    this.$nextTick(() => {});
  },

  props: {},

  data() {
    return {};
  },

  components: {},

  computed: {
    ...mapState("layoutstore", ["isNarrow"])
  },

  methods: {
    ...mapMutations("layoutstore", ["changeNav"])
  }
};
</script>

<style scoped>
#header {
  position: absolute;
  width: 100%;
  height: 40px;
  background-color: #002060;
}

#header .top_area {
  height: 50px;
}

#header .top_area img {
  position: relative;
  top: 5px;
  left: 10px;
  cursor: pointer;
  transform: rotate(0deg);
}

#header .top_area img.on {
  transform: rotate(90deg);
}

#header .top_area span {
  color: #fff;
  font-size: 22px;
  line-height: 2;
  padding: 0 15px;
}
</style>