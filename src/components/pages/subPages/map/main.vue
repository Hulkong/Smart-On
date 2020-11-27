<template>
  <div id="map">
    <top></top>
    <left></left>
    <contents></contents>
  </div>
</template>

<script>
import Header from "@/components/pages/subPages/map/layout/header";
import Nav from "@/components/pages/subPages/map/layout/nav";
import Contents from "@/components/pages/subPages/map/layout/contents";

export default {
  created: function() {},

  props: {},

  data() {
    return {};
  },

  components: {
    top: Header,
    left: Nav,
    contents: Contents
  },

  computed: {},

  methods: {}
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