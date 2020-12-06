<template>
  <div class="baseChange">
    <span @click="mapType='base'" :class="{on : (mapType == 'base')}">일반</span>
    <span @click="mapType='gray'" :class="{on : (mapType == 'gray')}">회색</span>
  </div>
</template>
<script>
export default {
  name: "mapChangeButton",

  data() {
    return {};
  },

  methods: {}
};
</script>
<style scoped>
/**********  baseChange  **********/
.baseChange {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 24px;
  z-index: 500;
}

.baseChange span {
  padding: 2px 10px;
  height: 30px;
  font-size: 12px;
  display: inline-block;
  line-height: 2;
  font-weight: bold;
  background: #f7f7f7;
  border-radius: 4px;
  border: 1px solid #c8c8c8;
  box-shadow: 0px 1px #888;
  cursor: pointer;
  text-align: center;
}

.baseChange span.on {
  background: #4c4e57;
  color: #fff;
}
</style>