<template>
  <div id="map">
    <top></top>
    <left></left>
    <contents></contents>
  </div>
</template>

<script>
import Header from "@/components/layout-map-header";
import Nav from "@/components/layout-map-nav";
import Contents from "@/components/layout-map-contents";

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
</style>