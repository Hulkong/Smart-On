<template>
  <div id="mapLeaflet">
    <button class="group_button" :class="isActive ? 'on' : ''" @click="isActive = true">지역구</button>
    <button class="group_button" :class="!isActive ? 'on' : ''" @click="isActive = false">카토그램</button>
    <LeafletPolygon ref="polygon"></LeafletPolygon>
  </div>
</template>

<script>
import LeafletPolygon from "@/components/map-leaflet-polygon";
export default {
  name: "mapLeaflet",
  data() {
    return {
      isActive: true
    };
  },

  watch: {
    // 지역구 <-> 비례대표
    isActive() {
      const component = this.$refs["polygon"];
      component.createWMSLayer();
    }
  },

  components: {
    LeafletPolygon: LeafletPolygon
  },

  computed: {},

  methods: {},

  created() {},
  mounted() {}
};
</script>

<style scoped>
#mapLeaflet >>> button {
  width: auto;
  height: 30px;
  margin: 5px;
  padding: 5px;
  background: cornflowerblue;
}

#mapLeaflet >>> button.on {
  background: tomato;
}

#mapLeaflet >>> button.group_button {
  background: brown;
}

#mapLeaflet >>> button.group_button.on {
  background: cadetblue;
}
</style>