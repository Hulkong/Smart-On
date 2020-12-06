<template>
  <v-layout align-center justify-center row fill-height class="error">
    <v-flex md4 class="imageBx">
      <v-img contain width="100%" height="100%" :src="getImageUrl('error/error404.png')"></v-img>
    </v-flex>
    <v-flex md4 class="textBx">
      <div>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <p>
          존재하지 않는 주소를 입력하셨거나,
          <br />요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
      </div>
      <div class="layer_btm">
        <ul>
          <li>
            <router-link to="/" class="btn_confirm">메인으로 가기</router-link>
          </li>
        </ul>
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