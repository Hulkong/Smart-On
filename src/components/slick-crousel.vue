<template>
  <div id="slickCrousel">
    <!-- <VueSlickCarousel v-bind="settings">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </VueSlickCarousel>-->
    <ol>
      <VueSlickCarousel v-bind="settings" ref="crousel">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </VueSlickCarousel>
    </ol>
  </div>
</template>
 
<script>
import VueSlickCarousel from "vue-slick-carousel";

export default {
  name: "MyComponent",
  data() {
    return {
      settings: {
        arrows: true,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }
    };
  },
  components: { VueSlickCarousel },
  methods: {}
};
</script> 
<style scoped>
#slickCrousel {
  width: 100vw;
  height: 100vh;
  background: blueviolet;
  padding: 0 15px;
}

#slickCrousel >>> .slick-arrow {
  background: grey;
  z-index: 99;
}

#slickCrousel >>> .slick-slide {
  background: yellow;
}
</style>
<style scoped src='vue-slick-carousel/dist/vue-slick-carousel.css'></style>
<style scoped src='vue-slick-carousel/dist/vue-slick-carousel-theme.css'></style>