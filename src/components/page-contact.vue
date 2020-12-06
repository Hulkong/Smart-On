<template>
  <div id="contact">
    <v-container fluid class="third _parent_layout" style="height:100vh;">
      <v-layout row fill-height>
        <!-- (F8)기본현황 start-->
        <v-flex>
          <div id="wrap">
            <div class="datalist">
              <!--	연락처	-->
              <div class="callme">
                <!--	주소	-->
                <div class="adress">
                  <h2>홈페이지 및 연락처</h2>
                  <p class="home">
                    <img :src="getImageUrl('menu/contact/icon_home.png')" width="18px" alt="홈페이지" />
                    <span>
                      <a href="http://openmate-on.co.kr" target="_blank">www.openmate-on.co.kr</a>
                    </span>
                  </p>
                  <p class="tel">
                    <img :src="getImageUrl('menu/contact/icon_tel.png')" alt="전화" />
                    <span>02-6956-7541</span>
                  </p>
                  <p class="fax">
                    <img :src="getImageUrl('menu/contact/icon_fax.png')" alt="팩스" />
                    <span>0505-055-7522</span>
                  </p>
                  <p class="mail">
                    <img :src="getImageUrl('menu/contact/icon_mail.png')" alt="이메일" />
                    <span>
                      <a href="mailto:sales@openmate-on.co.kr">{{email}}</a>
                    </span>
                  </p>
                </div>
                <!--	///주소	-->
                <!--	번호,팩스,이메일	-->
                <div class="number">
                  <h2>오시는 길</h2>
                  <p>
                    <img :src="getImageUrl('menu/contact/icon_adress.png')" alt="주소" />
                    <span>
                      서울특별시 중구 청계천로 100, 시그니쳐타워 서관 11층
                      <br />11th Floor, 100 Cheonggyecheon-ro Jung-gu,
                      <br />Seoul, Republic of Korea
                    </span>
                  </p>
                </div>
                <!--	///번호,팩스,이메일	-->
              </div>
              <!--	///연락처	-->
              <!--	오시는 길	-->
              <div class="map map_wrap">
                <!-- <h2>오시는 길</h2> -->
                <div id="map" class="in_map" ref="map">
                  <!-- 지도 확대, 축소 컨트롤 div 입니다 -->
                  <div class="custom_zoomcontrol radius_border">
                    <span @click="zoomIn">
                      <img
                        src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
                        alt="확대"
                      />
                    </span>
                    <span @click="zoomOut">
                      <img
                        src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
                        alt="축소"
                      />
                    </span>
                    <span @click="refresh">
                      <img :src="getImageUrl('map/map_util_refresh.png')" class="zoom" alt="지도 초기화" />
                    </span>
                  </div>
                </div>
              </div>
              <!--	///오시는 길	-->
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "contact",

  data() {
    return {
      email: "sales@openmate-on.co.kr",
      baseMap: "", // 기본 배경지도
      centerYX: [37.56745, 126.988228080535] // 초기 중심 좌표
    };
  },

  components: {},

  created() {},

  mounted() {
    // 구글 어널리틱스
    this.$ga.page("/contact/main");

    const yx = this.centerYX;
    const baseMap = this.createBaseMap(this.$refs.map, yx);
    const marker = this.drawCustomMarker(baseMap, [
      37.567461648908,
      126.988228080535
    ]);

    this.baseMap = baseMap;

    this.createInfoWindow(baseMap, marker, yx);
    baseMap.setZoomable(false);
  },

  methods: {
    /**
     * @description marker 그리는 메소드
     * @param {Docuement} element 배경지도 그려질 엘리먼트
     * @param {yx} 좌표
     * @returns {Object} baseMap
     */
    createBaseMap(element, yx) {
      const container = element; //지도를 담을 영역의 DOM 레퍼런스
      const options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(yx[0], yx[1]), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      return new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    },

    /**
     * @description 커스텀이미지 마커 생성하는 메소드
     * @param {Object} baseMap 배경지도
     * @param {yx} 좌표
     * @returns {Object} marker
     */
    drawCustomMarker(baseMap = this.baseMap, yx = []) {
      if (yx.length === 0) return;

      const imageSrc = this.getImageUrl("map/map_pointer.png"), // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(45, 55), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(23, 55) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      const markerOption = {
        position: new kakao.maps.LatLng(yx[0], yx[1]), //지도의 중심좌표.
        image: new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      };

      return this.drawMarker(baseMap, markerOption);
    },

    /**
     * @description marker 생성하는 메소드
     * @param {Object} baseMap 배경지도
     * @param {yx} 좌표
     * @returns {Object} marker
     */
    drawMarker(baseMap = this.baseMap, markerOption = {}) {
      if (!baseMap) {
        alert("배경지도가 없습니다!\n배경지도를 세팅해 주세요.");
        return;
      }

      if (!markerOption["position"]) return;

      // 마커를 생성합니다
      const marker = new kakao.maps.Marker(markerOption);

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(baseMap);

      // 아래 코드는 지도 위의 마커를 제거하는 코드입니다
      // marker.setMap(null);

      return marker;
    },

    /**
     * @description 팝업창 생성하는 메소드
     * @param {Object} baseMap 배경지도
     * @param {Object} marker
     * @param {yx} 좌표
     */
    createInfoWindow(baseMap, marker, yx) {
      if (!baseMap) {
        alert("배경지도가 없습니다!\n배경지도를 세팅해 주세요.");
        return;
      }

      if (!marker) {
        alert("표시할 마커 없습니다!\n마커를 세팅해 주세요.");
        return;
      }

      // 인포윈도우를 생성합니다
      const infowindow = new kakao.maps.InfoWindow({
        position: new kakao.maps.LatLng(yx[0], yx[1]), //지도의 중심좌표.
        content: '<div style="padding:5px 5px 5px 20px;">(주)오픈메이트온</div>' // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      });

      // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
      infowindow.open(baseMap, marker);
      infowindow.Dh.style.top = 29 + "px";
    },

    /**
     * @description 지도 축소하는 함수
     */
    zoomIn() {
      this.baseMap.setLevel(this.baseMap.getLevel() - 1);
    },

    /**
     * @description 지도 확대하는 함수
     */
    zoomOut() {
      this.baseMap.setLevel(this.baseMap.getLevel() + 1);
    },

    /**
     * @description 배경지도 초기 좌표로 줌 변경 및 이동
     */
    refresh() {
      const yx = this.centerYX;
      const baseMap = this.baseMap;

      baseMap.setLevel(3);
      baseMap.setCenter(new kakao.maps.LatLng(yx[0], yx[1]));
    }
  }
};
</script>
<style scoped src="@/assets/css/menu/style.css"></style>