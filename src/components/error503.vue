<template>
  <v-layout align-center justify-center row fill-height class="error">
    <v-flex md4 class="imageBx">
      <v-img contain width="100%" height="100%" :src="getImageUrl('error/error503.png')"></v-img>
    </v-flex>
    <v-flex md4 class="textBx">
      <div>
        <h1>서버가 잠시 중단되었습니다.</h1>
        <p>이용에 불편을 드려서 죄송합니다.</p>
        <p>잠시 후 다시 이용해주세요.</p>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  created() {},

  props: {},

  data() {
    return {};
  },

  components: {},

  computed: {},

  methods: {}
};
</script>
<style scoped src="@/assets/css/error.css"></style>
<style scoped></style>