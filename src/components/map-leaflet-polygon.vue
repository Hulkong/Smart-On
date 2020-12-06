<template>
  <div class="mapArea">
    <ChageButton v-if="false"></ChageButton>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import leaflet from "leaflet";
import ChageButton from "@/components/map-change-button";
export default {
  props: {
    layerData: {
      type: Array,
      required: false,
      default: () => []
    },
    layerStyle: {
      type: Function,
      required: false,
      default: () => 1
    },
    mouseover: {
      type: Function,
      required: false,
      default: () => 1
    },
    mousemove: {
      type: Function,
      required: false,
      default: () => 1
    },
    mouseout: {
      type: Function,
      required: false,
      default: () => 1
    },
    click: {
      type: Function,
      required: false,
      default: () => 1
    },
    popupOptions: {
      type: Object,
      required: false,
      default: () => {}
    },
    legendOptions: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      tile: {
        srs: "EPSG:3857",
        size: 256,
        zoomReverse: false,
        zoomOffset: 0,
        doTms: false,
        url: {
          base: "http://xdworld.vworld.kr:8080/2d/Base/201411/{z}/{x}/{y}.png",
          grey: "http://xdworld.vworld.kr:8080/2d/gray/201512/{z}/{x}/{y}.png"
        }
      },
      map: {},
      crs: L.CRS.EPSG3857,
      center: [37.492334, 127.062444],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      dragging: false,
      fadeAnimation: false,
      baseChange: false,
      mapType: "", // base map type
      baseLayer: null,
      layers: [],
      popup: {},
      wmsLayer: null
    };
  },

  computed: {},

  watch: {
    popupOptions() {
      this.updatePopup();
    },

    legendOptions() {
      this.createLegend();
    },

    layerData() {
      if (this.layerData.length === 0) {
        this.map.setZoom(13);
        this.removeAllLayer();
        return;
      }

      this.createGeojsonLayer(this.layerData);

      if (this.layerData.length > 0) {
        this.setBound(this.getLayers());
        this.map.setZoom(this.getZoom() - 0.5);
      }
    }
  },

  components: {
    ChageButton: ChageButton
  },

  methods: {
    ...mapMutations("generalelectionresultstore", ["setMap"]),

    /**
     * @description 기본 맵 객체 설정
     */
    createMap() {
      this.map = L.map(this.$el, {
        zoomSnap: 0.25,
        crs: this.crs,
        zoomControl: this.zoomControl,
        scrollWheelZoom: this.scrollWheelZoom,
        zoomAnimation: this.zoomAnimation,
        dragging: this.dragging,
        fadeAnimation: this.fadeAnimation
      }).setView(this.center, this.zoom);
    },

    /**
     * @description 배경지도 설정
     * @param {String} name 컬러 / 그레이
     */
    setBaseLayer(name = "base") {
      if (this.baseLayer != null) this.map.removeLayer(this.baseLayer);

      this.baseLayer = L.tileLayer(this.tile.url["base"], {
        attribution: "© vworld",
        noWrap: true, // 반복없애기
        minZoom: 6,
        maxZoom: 18,
        zoomOffset: this.tile.zoomOffset,
        zoomReverse: this.tile.zoomReverse,
        subdomains: "0123",
        tms: this.tile.doTms
      }).addTo(this.map);
    },

    /**
     * @description 컨트롤 설정
     */
    setControll() {
      let control = L.control
        .zoom({
          position: "topright"
        })
        .addTo(this.map);

      control.getContainer().style.position = "absolute";
      control.getContainer().style.top = "50px";
      control.getContainer().style.right = "0px";
    },

    /**
     * @description 현재 중심 좌표 가져옴
     * @returns {Object} lat(위도), lng(경도)
     */
    getCenter() {
      return this.getCenter();
    },

    /**
     * @description 현재 줌레벨 가져옴
     * @returns {Number}
     */
    getZoom() {
      return this.map.getZoom();
    },

    /**
     * @description 레이어 스타일 가져옴
     * @param {String} type 유형
     * @returns {Object}
     */
    getStyle(layer = {}) {
      return layer.options.style;
    },

    /**
     * @description 특정 레이어 스타일 업데이트
     * @param {Object} layer 레이어
     * @param {Object} style 스타일
     */
    updateStyle(layer = {}, style = {}) {
      layer.updateStyle(style);
    },

    /**
     * @description 레이어 삭제
     * @param {Array} layers 레이어 배열
     */
    removeLayer(layer = {}) {
      const id = layer._fid;
      const index = Number(id.split("_")[2]);

      layer.remove();
      this.layers.splice(index, 1);
    },

    /**
     * @description 모든 레이어 삭제
     */
    removeAllLayer() {
      const that = this;
      this.layers.reduce((acc, v, i) => {
        v.remove();
      }, []);
      this.layers = [];
    },

    /**
     * @description 영역 설정
     * @param {Array} layers 레이어배열
     */
    setBound(layers = []) {
      const map = this.map;
      let bounds = null;

      layers.reduce((acc, v, i) => {
        if (i === 0) {
          bounds = v.getBounds();
        } else {
          bounds.extend(v.getBounds());
        }
      }, []);

      map.fitBounds(bounds);
      // map.flyToBounds(bounds, 10);
      // map.panInsideBounds(bounds);
    },

    /**
     * @description 특정레이어 가져옴
     * @param {Number} index 레이어 인덱스
     * @returns {Array}
     */
    getLayer(index) {
      return this.layers.filter(
        item => item._fid === ["layer", "polygon", index].join("_")
      )[0];
    },

    /**
     * @description 레이어배열 가져옴
     * @returns {Array}
     */
    getLayers() {
      return this.layers;
    },

    /**
     * @description 레이어배열 세팅
     * @param {Object} layer 레이어
     */
    setLayer(layer = {}) {
      this.layers.push(layer);
    },

    /**
     * @description 레이어 생성
     * @param {Array} data 배열객체
     */
    createGeojsonLayer(data = {}) {
      const that = this;
      let geoJSON = L.geoJSON(data, {
        style: this.layerStyle,
        onEachFeature: (feature, layer) => {
          layer.on({
            mousemove: this.mousemove,
            mouseover: this.mouseover,
            mouseout: function(e) {
              that.mouseout(e, geoJSON);
            },
            click: this.click
          });
        }
      }).addTo(this.map);

      geoJSON._fid = ["layer", "polygon", this.layers.length].join("_");
      this.setLayer(geoJSON);
    },

    /**
     * @description WMS 레이어 그림
     * @param {String} url WMS 응답 서버주소
     * @param {Object} option WMS 옵션
     */
    createWMSLayer(url = "", options = {}) {
      if (url.length === 0) return;

      const that = this;

      return new Promise((resolve, reject) => {
        this.wmsLayer = L.tileLayer.wms(url, options).addTo(that.map);
        resolve();
      });
    },

    /**
     * @description 범례 생성
     */
    createLegend() {
      const options = this.legendOptions;
      const isVisible = options.isVisible;

      if (!isVisible) return;

      const contents = options.legendContents();
      const position = options.position;
      const legend = L.control({ position: position });

      legend.onAdd = function(map) {
        let div = L.DomUtil.create("div", "info legend");

        div.innerHTML += contents;

        return div;
      };

      legend.addTo(this.map);
    },

    /**
     * @description 팝업 업데이트
     */
    updatePopup() {
      const options = this.popupOptions;
      const contents = options.popupContents();
      const latlng = options.latlng;

      this.popup.setContent(contents);
      this.popup.setLatLng(latlng);
    },

    /**
     * @description 팝업 생성
     */
    createPopup() {
      const contents = "";
      const latlng = this.map.getCenter();
      this.popup = L.popup()
        .setLatLng(latlng)
        .setContent(contents);
    }
  },

  mounted() {
    const that = this;

    this.createMap();
    this.createPopup();

    // this.setBaseLayer();
    this.map.scrollWheelZoom.disable(); // 지도 마우스휠 이벤트 막기
    this.map.doubleClickZoom.disable(); // 지도 더블클릭 이벤트 막기

    // this.setBound(this.getLayers());
    // const layer = this.getLayer(1);

    // setTimeout(() => {
    // that.removeLayer(this.getLayers("polygons"));
    // that.removeAllLayer();
    //   }, 3000);
  }
};
</script>
<style scoped>
/**********  map  **********/
.mapArea {
  width: 100%;
  height: 100%;
  /* width: 500px; */
  /* height: 850px; */
  background: white;
}

/**********  zoomController  **********/
/* .mapArea >>> .leaflet-control-zoom.leaflet-bar.leaflet-control {
  top: 100px;
} */
</style>