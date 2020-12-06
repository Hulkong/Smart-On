<template>
  <div class="pdf-zoom">
    <a @click.prevent.stop="zoomIn" class="icon" :disabled="isDisabled">
      <img :src="getImageUrl('pdf/zoom-in.png')" style="width:100%; height:100%;" />
    </a>
    <a @click.prevent.stop="zoomOut" class="icon" :disabled="isDisabled">
      <img :src="getImageUrl('pdf/zoom-out.png')" style="width:100%; height:100%;" />
    </a>
    <a @click.prevent.stop="fitWidth" class="icon" :disabled="isDisabled">
      <img :src="getImageUrl('pdf/pinch-wide.png')" style="width:100%; height:100%;" />
    </a>
    <a @click.prevent.stop="fitAuto" class="icon" :disabled="isDisabled">
      <img :src="getImageUrl('pdf/pinch-zoom.png')" style="width:100%; height:100%;" />
    </a>
  </div>
</template>

<script>
export default {
  name: "PDFZoom",

  components: {},

  props: {
    scale: {
      type: Number
    },
    increment: {
      type: Number,
      default: 0.25
    }
  },

  computed: {
    isDisabled() {
      return !this.scale;
    }
  },

  methods: {
    zoomIn() {
      this.updateScale(this.scale + this.increment);
    },

    zoomOut() {
      if (this.scale <= this.increment) return;
      this.updateScale(this.scale - this.increment);
    },

    updateScale(scale) {
      this.$emit("change", { scale });
    },

    fitWidth() {
      this.$emit("fit", "width");
    },

    fitAuto() {
      this.$emit("fit", "auto");
    }
  }
};
</script>

<style>
.pdf-zoom a {
  float: left;
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  line-height: 1.5em;
  width: 1.5em;
  height: 1.5em;
  font-size: 1.5em;
}
</style>
