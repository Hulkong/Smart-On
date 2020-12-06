<template>
  <div id="_who_we_are">
    <v-container fluid class="third _parent_layout" style="height:100vh;">
      <v-layout row fill-height>
        <!-- (F8)기본현황 start-->
        <v-flex>
          <div id="wrap">
            <!--	페이지 백그라운드	-->
            <div class="datalist">
              <!--	타이틀		-->
              <div class="title">
                <div class="data">
                  <router-link to="/report/about/dataList">
                    <h1>Data List</h1>
                  </router-link>
                </div>
                <div class="who on">
                  <router-link to="/report/about/whoWeAre">
                    <h1>Who We Are</h1>
                  </router-link>
                </div>
              </div>
              <!--	///타이틀		-->
              <!--	팀 테이블	-->
              <div class="member">
                <!--	ceo		-->
                <div class="ceo">
                  <p class="team_slogan">
                    빅데이터 노하우+
                    <br />융합+A.I 분석 기술
                    <br />전문가 그룹
                  </p>
                  <div class="ex">
                    <div class="face_img face01"></div>
                    <div class="m01_border"></div>
                    <div class="m01_name">
                      <span>이은영</span>
                      <span>(CEO)</span>
                    </div>
                    <div class="m01_motto01">
                      <span>데이터&공간의 숨겨진 가치를</span>
                    </div>
                    <div class="m01_motto02">
                      <span>발굴하는 마스터 디자이너.</span>
                    </div>
                    <div class="m01_title">
                      <span>- (주)오픈메이트 대표이사/사장</span>
                    </div>
                    <div class="m01_univ">
                      <span>- 미시건주립대 재무 석사</span>
                    </div>
                    <div class="m01_email">
                      <span>eunylee@openmate-on.co.kr</span>
                    </div>
                  </div>
                </div>
                <!--	///ceo		-->
                <!--	임직원		-->
                <v-layout class="cont" justify-start row wrap>
                  <v-flex md3 class="mem_12" v-for="(item, index) in memberList" :key="index">
                    <v-flex class="_cont_layout">
                      <div class="face_img">
                        <v-img contain width="100%" :src="getImageUrl(item.imageUrl)"></v-img>
                      </div>
                      <div class="m02_border"></div>
                      <div class="m02_name">
                        <span>{{ item.name }}</span>
                        <span>({{ item.nickname }})</span>
                      </div>
                      <div class="m02_motto01">
                        <span>{{ item.contentsA }}</span>
                      </div>
                      <div class="m02_motto02">
                        <span>{{ item.contentsB }}</span>
                      </div>
                      <div class="m02_univ">
                        <span>- {{ item.univ }}</span>
                      </div>
                      <div class="m02_email">
                        <span>{{ item.email }}</span>
                      </div>
                    </v-flex>
                  </v-flex>
                </v-layout>
                <!--	///임직원		-->
              </div>
              <!--	///팀 테이블	-->
            </div>
            <!--	///페이지 백그라운드	-->
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "whoWeAre",
  data() {
    return {
      memberList: [
        {
          imageUrl: "menu/company/who_NSY.png",
          name: "노서영",
          nickname: "데이터서비스 리더",
          contentsA: "데이터와 서비스, 사람을",
          contentsB: "연결하는 기획자.",
          title: "",
          univ: "서울대학교 도시계획 석사",
          email: "nsy@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_LYB.png",
          name: "이영빈",
          nickname: "데이터분석 리더",
          contentsA: "실생활의 문제 해결을",
          contentsB: "고민하는 빅데이터 분석 리더.",
          title: "",
          univ: "서울대학교 도시계획 석사",
          email: "youngbin@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_HHJ.png",
          name: "함현진",
          nickname: "서비스개발 리더",
          contentsA: "끊임없이 도전하여 혁신을",
          contentsB: "이끌어내는 서비스개발 리더.",
          title: "",
          univ: "홍익대학교 세라믹공학 학사",
          email: "hhj0508@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_PJH.png",
          name: "박장호",
          nickname: "경영지원 리더",
          contentsA: "사람들의 소비행동에",
          contentsB: "관심이 많은 경영지원 리더.",
          title: "",
          univ: "홍익대학교 독어독문학 학사",
          email: "wkdgh0430@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_LJD.png",
          name: "이종덕",
          nickname: "데이터 분석가",
          contentsA: "건물과 미학에 관심이 많은",
          contentsB: "부동산 도메인 전문 분석가.",
          title: "",
          univ: "한양대학교 건축학 석사",
          email: "jdok@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_PMH.png",
          name: "박민혜",
          nickname: "데이터 분석가",
          contentsA: "사람들의 소비행동에",
          contentsB: "관심이 많은 전문 분석가.",
          title: "",
          univ: "공주대학교 지리교육 학사",
          email: "petitmh@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_LNR.png",
          name: "이나래",
          nickname: "데이터 분석가",
          contentsA: "다양한 시각으로 표와 숫자에",
          contentsB: "스토리를 불어 넣는 분석가.",
          title: "",
          univ: "브리검영대학교 심리 학사",
          email: "rae@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_KSW.png",
          name: "김성원",
          nickname: "디자인 리더",
          contentsA: "혁신을 추구하는",
          contentsB: "창의적인 디자인 리더.",
          title: "",
          univ: "홍익대학교 산업디자인 석사",
          email: "skyanl7@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_KJH.png",
          name: "김종현",
          nickname: "데이터 분석가",
          contentsA: "데이터에서 트렌드를 읽어내는데",
          contentsB: "관심이 많은 분석가.",
          title: "",
          univ: "안양대학교 정보통계학 학사",
          email: "dadfff10@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_KDH.png",
          name: "김동혁",
          nickname: "데이터 분석가",
          contentsA: "통계적 사고를 바탕으로",
          contentsB: "숫자에 가치를 찾는 분석가.",
          title: "",
          univ: "수원대학교 응용통계학과 학사",
          email: "ehdgur9467@openmate-on.co.kr"
        },
        {
          imageUrl: "menu/company/who_HHW.png",
          name: "한희원",
          nickname: "데이터 분석가",
          contentsA: "딥러닝에 관심이 많은",
          contentsB: "끊임없이 도전하는 분석가.",
          title: "",
          univ: "건국대학교 응용통계 학사",
          email: "hwhan@openmate-on.co.kr"
        }
      ]
    };
  },
  mounted() {
    // 구글 어널리틱스
    this.$ga.page("/about/whoWeAre");
  }
};
</script>
<style scoped src="@/assets/css/menu/style.css"></style>
<style scoped></style>
