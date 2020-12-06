<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    // 모바일 여부 확인
    const deviceInnerWidth = `${innerWidth}`;

    if (deviceInnerWidth <= 834) {
      if (
        location.pathname === "/m" ||
        location.pathname === "/m_detail" ||
        location.pathname === "/pdf" ||
        location.pathname === "/m_election" ||
        location.pathname === "/m_election_result"
      ) {
      } else {
        location.href = location.origin + "/m";
      }
    } else {
      if (location.pathname === "/m" || location.pathname === "/m_detail") {
        location.href = location.origin;
      }
    }
  }
};
</script>
<style src='vuetify/dist/vuetify.min.css'></style>
<style src='material-design-icons-iconfont/dist/material-design-icons.css'></style>
<style src='vue-slick-carousel/dist/vue-slick-carousel.css'></style>
<style src='vue-slick-carousel/dist/vue-slick-carousel-theme.css'></style>
<style src="@/assets/css/event/default.css"></style>
<style src="@/assets/css/common.css"></style>
<style src="@/assets/css/media-query.css"></style>
<style src="leaflet/dist/leaflet.css"></style>
<style scoped></style>