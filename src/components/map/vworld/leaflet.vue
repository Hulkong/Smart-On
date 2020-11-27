<template>
  <div class="mapArea">
    <!-- basemap change type -->
    <div class="baseChange">
      <span @click="mapType='base'" :class="{on : (mapType == 'base')}">일반</span>
      <span @click="mapType='gray'" :class="{on : (mapType == 'gray')}">회색</span>
    </div>
    <!-- ////  basemap change type -->
  </div>
</template>
<script>
export default {
  watch: {
    mapType: function(newType, oldType) {
      // base layer 다시 그리기
      this.setBaseLayer(newType);
    }
  },
  mounted: function() {
    let mType = this.$route.params.type;
    const baseLayerConfig = this.$data.init;
    if (this.$route.params.type === undefined) mType = "base";
    this.createMap(baseLayerConfig);
    this.$data.mapType = mType;
  },
  data: () => ({
    base: {
      srs: "EPSG:3857",
      tileSize: 256,
      zoomReverse: false,
      zoomOffset: 0,
      doTms: false,
      tileUrl: "http://xdworld.vworld.kr:8080/2d/Base/201411/{z}/{x}/{y}.png"
    },
    gray: {
      srs: "EPSG:3857",
      tileSize: 256,
      zoomReverse: false,
      zoomOffset: 0,
      doTms: false,
      tileUrl: "http://xdworld.vworld.kr:8080/2d/gray/201512/{z}/{x}/{y}.png"
    },
    crs: null,
    map: null, // 지도 객체
    zoomlevel: 7, // 현재 zoomlevel
    init: {
      // 초기값
      // center: [35.72421761691415, 127.15576171875001],
      center: [37.492334, 127.062444],
      level: 11,
      zoomControl: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      fadeAnimation: false
    },
    mapType: "", // base map type
    baseLayer: null,
    layers: [] // 레이어 저장
  }),

  methods: {
    createMap: function(config) {
      //지도 만들기
      this.$data.map = L.map(this.$el, {
        zoomControl: config.zoomControl,
        scrollWheelZoom: config.scrollWheelZoom,
        zoomAnimation: config.zoomAnimation,
        fadeAnimation: config.fadeAnimation
      }).setView(this.$data.init.center, this.$data.init.level);

      var control = L.control
        .zoom({
          position: "topright"
        })
        .addTo(this.$data.map);

      control.getContainer().style.position = "absolute";
      control.getContainer().style.top = "50px";
      control.getContainer().style.right = "0px";

      // 지도 마우스휠 이벤트 막기
      // this.$data.map.scrollWheelZoom.disable();

      // 지도 더블클릭 이벤트 막기
      this.$data.map.doubleClickZoom.disable();

      this.createLayer();
    },
    setBaseLayer: function(name) {
      if (this.$data.baseLayer != null)
        this.$data.map.removeLayer(this.$data.baseLayer);
      this.$data.baseLayer = L.tileLayer(this.$data[name].tileUrl, {
        attribution: "© vworld",
        noWrap: true, // 반복없애기
        minZoom: 6,
        maxZoom: 18,
        zoomOffset: this.$data[name].zoomOffset,
        zoomReverse: this.$data[name].zoomReverse,
        subdomains: "0123",
        tms: this.$data[name].doTms
      }).addTo(this.$data.map);
    },

    createLayer: function() {
      const that = this;
      const map = this.$data.map;
      // 주제도 색상 정의
      var colorArr = ["#2c7bb6", "#abdda4", "#ffffbf", "#fdae61", "#d7191c"];

      // map 기본 속성 ( 외부값으로 추가/변경 가능한 속상 배열 )
      var map_config = {
        layerFid: "layer", // layerID
        choroColumn: "total_cnt", // choropleth의 기준 속성값
        strokeColor: "#fff" // 테두리 색상
      };

      that.getData().then(result => {
        var bounds = null;
        // data = $.extend(true, {}, json);
        let layer = L.geoJSON(result.data, {
          // 						style : featureStyle
        });
        layer._fid = map_config.layerFid;
        layer.addTo(map);
        bounds = layer.getBounds();
        map.off("moveend", setDocumentTitle);
        map.on("moveend", setDocumentTitle);
        map.fitBounds(bounds);
        doAdmiChoropleth(map_config.choroColumn, layer, colorArr);
      });

      /**
       * choropleth 단계구분도 (행정동)
       * @param colName 	choropleth의 기준 속성값
       * @param layer		적용할 layer
       * @param colorArr	choropleth 색상 배열
       */
      function doAdmiChoropleth(colName, layer, colorArr) {
        var classifyData = new Array();
        var colNameArr = colName;
        for (var fnum in layer._layers) {
          var colNameCnt = layer._layers[fnum].feature.properties[colNameArr];
          if (colNameCnt != "0") {
            classifyData.push(colNameCnt);
          }
        }
        var serie = new geostats(classifyData);
        var arrNum = serie.getQuantiles(6);
        function style(feature) {
          var colNameCnt = feature.properties[colNameArr];
          var cIndex = Number(closeset(colNameCnt, arrNum));
          var colar = colorArr[cIndex];
          return {
            fillColor: colar,
            weight: 1,
            opacity: 1,
            color: map_config.strokeColor,
            fillOpacity: 0.5
          };
        }
        layer.setStyle(style);
      }

      /**
       * 행렬중 입력한 숫자와 가장 근접한 행 찾기
       * @param num 입력한 수
       * @param arr 기준 행렬
       * @returns
       */
      function closeset(num, arr) {
        var curr = arr[0];
        var index = 0;

        for (var i = 0; i < arr.length; i++) {
          if (Math.abs(num - arr[i]) < Math.abs(num - curr)) {
            curr = arr[i];
            index = i;
          }
        }

        return arr.indexOf(curr);
      }

      /*
       * zoomend 후 title변경
       */
      function setDocumentTitle() {
        document.title = "complete";
      }
    },

    /**
     * @description json 타입 데이터 가져옴
     */
    getData: function() {
      var that = this;
      return new Promise(function(resolve, reject) {
        that.$http.get("/src/components/map/vworld/data.json").then(result => {
          resolve(result);
        });
      });
    },

    getCenter: function() {
      console.log(this.$data.map.getCenter());
      console.log(this.$data.map.getZoom());
    }
  }
};
</script>
<style scoped>
/**********  map  **********/
.mapArea {
  width: 100%;
  height: 100%;
}

/**********  zoomController  **********/
.leaflet-control-zoom.leaflet-bar.leaflet-control {
  top: 100px;
}

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