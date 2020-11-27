<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app width="350" height="100%" style="overflow-y:hidden;">
      <v-app-bar color="rgb(24,38,51)" height="300">
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <v-card class="mx-auto" width="100%" max-width="800" height="25">
                <v-toolbar dense color="rgb(49,63,76)">
                  <v-toolbar-title class="subtitle-1">
                    <v-text-field color="white" hide-details placeholder="지자체명을 입력하세요" single-line></v-text-field>
                  </v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn icon color="white">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-divider></v-divider>

                <v-card-text v-show="false" style="height: 200px;"></v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="12">
              <v-card
                outlined
                class="pa-4"
                height="100"
                color="rgb(24,38,51)"
                style="color:rgb(221,78,30);"
              >
                <p class="text-center">서울특별시 중구</p>
                <p class="text-center">Jung-hu, Seoul</p>
              </v-card>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <v-card outlined height="50" color="rgb(24,38,51)">
                <p class="overline text-center" style="color:white;">인구 수</p>
                <p class="overline text-center" style="color:white;">####</p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card outlined height="50" color="rgb(24,38,51)">
                <p class="overline text-center" style="color:white;">예산총액</p>
                <p class="overline text-center" style="color:white;">####</p>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <v-card outlined height="50" color="rgb(24,38,51)">
                <p class="overline text-center" style="color:white;">유형</p>
                <p class="overline text-center" style="color:white;">시군구 - 가</p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card outlined height="50" color="rgb(24,38,51)">
                <p class="overline text-center" style="color:white;">집행률</p>
                <p class="overline text-center" style="color:white;">63.25%</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>
      <div style="height: calc(100% - 300px); overflow-y:auto;">
        <v-card class="mx-auto" max-width="400" tile height="350"></v-card>
        <v-card class="mx-auto" max-width="400" tile height="350"></v-card>
        <v-card class="mx-auto" max-width="400" tile height="350"></v-card>
        <v-card class="mx-auto" max-width="400" tile height="350"></v-card>
        <v-card class="mx-auto" max-width="400" tile height="350"></v-card>
        <v-footer color="rgb(24,38,51)">
          <p class="white--text">주소: 서울특별시 중구 청계천로 100, 시그니처타워 서관 9층</p>
          <p class="white--text">사업자번호: 763-88-01165</p>
          <p class="white--text">TEL: 02.6956.7541</p>
          <p class="white--text">FAX: 0505.055.7522</p>
          <p class="white--text">EMAIL: sales@openmate-on.co.kr</p>
        </v-footer>
      </div>
    </v-navigation-drawer>

    <v-app-bar app color="rgb(24,38,51)" height="50">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <v-tabs grow background-color="rgb(24,38,51)" color="#FEFEFE" :hide-slider="true" dark>
        <v-tab v-for="(tab, index) in tabs" :key="index" :style="{opacity: 1}">{{tabs[index]}}</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn :href="source" icon large target="_blank" v-on="on">
                  <v-icon large>mdi-code-tags</v-icon>
                </v-btn>
              </template>
              <span>Source</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  large
                  href="https://codepen.io/johnjleider/pen/zgxeLQ"
                  target="_blank"
                  v-on="on"
                >
                  <v-icon large>mdi-codepen</v-icon>
                </v-btn>
              </template>
              <span>Codepen</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<!-- App.vue -->
<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    active: null,
    tabs: ["도시현황", "도시진단", "정책추진"]
  })
};
</script>
<style scoped>
.v-tab--active {
  background: rgb(254, 254, 254);
  color: rgb(24, 38, 51);
}

.v-tabs-bar.theme--dark .v-tab:not(.v-tab--active):not(.v-tab--disabled) {
  color: white;
}

#inspire >>> .v-navigation-drawer__content {
  overflow: hidden;
}

#inspire >>> .v-input input {
  color: white;
}

#inspire >>> .v-input input::placeholder {
  color: white;
}
</style>