<template>
  <div class="leaflet mapArea" :style="options.mapStyle">
    <!-- basemap change type -->
    <div class="baseChange" v-show="baseChange">
      <span @click="mapType='base'" :class="{on : (mapType == 'base')}">일반</span>
      <span @click="mapType='gray'" :class="{on : (mapType == 'gray')}">회색</span>
    </div>
  </div>
</template>
<script>
import leaflet from "leaflet";
import MiniMap from "leaflet-minimap";
import wkt from "terraformer-wkt-parser";
// import geostats from "geostats";
// import proj4j from "proj4";
// import wkt from "wkt";
export default {
  name: "map_vworld_leaflet",
  components: {},
  watch: {
    mapType: function(newType, oldType) {
      // base layer 다시 그리기
      this.setBaseLayaer(newType);
    }
  },
  mounted: function() {},
  props: {
    options: Object,
    deviceType: {
      type: String,
      default: "web"
    },
    queryDate: Object
  },
  data: () => ({
    init: undefined,
    base: {
      srs: "EPSG:3857",
      tileSize: 256,
      zoomReverse: false,
      zoomOffset: 0,
      doTms: false,
      tileUrl: "https://trend-on.co.kr/xdworld/2d/Base/201411/{z}/{x}/{y}.png"
      // tileUrl: "http://xdworld.vworld.kr:8080/2d/Base/201411/{z}/{x}/{y}.png"
    },
    gray: {
      srs: "EPSG:3857",
      tileSize: 256,
      zoomReverse: false,
      zoomOffset: 0,
      doTms: false,
      tileUrl: "https://trend-on.co.kr/xdworld/2d/gray/201512/{z}/{x}/{y}.png"
      // tileUrl: "http://xdworld.vworld.kr:8080/2d/gray/201512/{z}/{x}/{y}.png"
    },
    crs: null,
    zoomlevel: 0, // 줌 레벨
    map: null, // 지도 저장
    miniMap: null, // 미니맵 저장
    mapType: "base", // 배경지도 타입
    baseChange: false, // 배경지도 변경 버튼 사용여부
    layerBounds: null, // 초기화 바운더리
    layerArr: [] // 생성한 레이어 모음
  }),

  methods: {
    /**
     * @description 지도 생성을 위해 가장 먼저 호출하는 메소드
     */
    draw: function(baseLayers, options) {
      // set option
      if (options !== undefined) {
        this.$data.init = options.mapConfig;
        this.baseChange = options.mapConfig.baseChange;
        this.mapType = options.mapConfig.mapType;
      }

      // 지도 생성
      if (this.map === null) {
        this.createMap();
        // base layer 올리기
        this.setBaseLayaer(this.mapType);
        // data가 있으면 layer 지도위에 올리기
        if (baseLayers.length > 0) {
          // 데이터 가져오기
          // 가져온 데이터 지도에 표현
          this.setLayerStarter(baseLayers);
        }

        // 미니맵 생성
        if (options.mapConfig.miniMap.using) {
          if (this.deviceType !== "mo") {
            this.createMini(this.mapType, options.mapConfig.miniMap.options);
          }
        }
      } else {
        const initOption = this.$data.init.option;
        if (this.deviceType == "web")
          this.setCenter(
            initOption.center[1],
            initOption.center[0],
            initOption.level
          );
        else
          this.setCenter(
            initOption.mcenter[1],
            initOption.mcenter[0],
            initOption.mlevel
          );
      }
    },

    /**
     * @description 지도 생성
     */
    createMap: function() {
      const that = this;
      const config = this.$data.init.option;
      let center = config.center;
      let level = config.level;
      if (this.deviceType == "mo") {
        center = config.mcenter;
        level = config.mlevel;
      }

      //지도 만들기
      this.map = L.map(this.$el, {
        zoomControl: config.zoomControl,
        scrollWheelZoom: config.scrollWheelZoom,
        zoomAnimation: config.zoomAnimation,
        dragging: config.dragging,
        fadeAnimation: config.fadeAnimation
      }).setView(center, level);

      if (config.zoomOption) {
        var control = L.control
          .zoom({
            position: config.zoomOption.position
          })
          .addTo(that.map);

        if (config.zoomOption.style.top)
          control.getContainer().style.top = config.zoomOption.style.top;
        if (config.zoomOption.style.bottom)
          control.getContainer().style.bottom = config.zoomOption.style.bottom;
        if (config.zoomOption.style.left)
          control.getContainer().style.left = config.zoomOption.style.left;
        if (config.zoomOption.style.right)
          control.getContainer().style.right = config.zoomOption.style.right;
      }

      //   this.map.on('click', function(e){
      //     console.log(e.latlng);
      //     console.log(that.map.getZoom());
      //   });
    },

    /**
     * @description 미니맵 생성
     */
    createMini(type, options) {
      var osmUrl = this[type].tileUrl;
      var miniBase = new L.TileLayer(osmUrl, { minZoom: 6, maxZoom: 18 });
      new MiniMap(miniBase, options).addTo(this.map);
    },

    /**
     * @description 배경지도 레이어 생성
     * @param type String 지도 타입
     */
    setBaseLayaer: function(type) {
      const config = this.$data.init.option;
      const minL = config.minLevel === undefined ? 6 : config.minLevel;
      const maxL = config.maxLevel === undefined ? 18 : config.maxLevel;

      // 현재 적용되어 있는 배경지도 삭제
      if (this.baseLayer != null) this.map.removeLayer(this.baseLayer);

      if (type !== "None") {
        // 배경지도 새롭게 생성
        this.baseLayer = L.tileLayer(this[type].tileUrl, {
          attribution: "© vworld",
          noWrap: true, // 반복없애기
          minZoom: minL,
          maxZoom: maxL,
          zoomOffset: this[type].zoomOffset,
          zoomReverse: this[type].zoomReverse,
          subdomains: "0123",
          tms: this[type].doTms
        }).addTo(this.map);
      }
    },
    /**
     * @description 지도 화면 처음에 생성할 layer 그리기
     */
    setLayerStarter: function(layers) {
      const that = this;
      for (let ll = 0; ll < layers.length; ll++) {
        const llInfo = layers[ll];
        that.getLayerData(llInfo);
      }
    },
    /**
     * @description 레이어 데이터 가져오기
     *
     */
    getLayerData: function(layerObj) {
      var that = this;
      const query = layerObj.dataQuery;
      let layerId = layerObj.layerId;
      if (query.parentId) layerId = layerId + "_" + query.parentId;

      if (layerObj["dataURL"] == null) {
        if (layerObj["dataLatlng"] != null) {
          that.setLayerByLatlng(layerObj);
        }
        return false;
      }

      // 기존에 만들었던 레이어가 있는지 확인
      if (this.isLayer(layerId)) {
        // 있으면 레이어 on
        this.setExistLayer(layerId);
      } else {
        // 없으면 데이터 가져오기
        if (this.queryDate) {
          query.lastdate = this.queryDate.stdr_date;
          query.lastTime = this.queryDate.stdr_time;
        }
        this.getData(layerObj["dataURL"], query).then(result => {
          that.setLayer(result["data"], layerId, layerObj.option);
        });
      }
    },
    /**
     * @description 레이어 존재 여부 확인
     */
    isLayer: function(layerId) {
      let existL = false;
      let layerArr = this.layerArr;
      if (layerId !== undefined) {
        for (let ll = 0; ll < layerArr.length; ll++) {
          if (layerArr[ll]._fid.indexOf(layerId) > -1) {
            existL = true;
          }
        }
      }

      return existL;
    },
    /**
     * @description 존재하는 레이어 지도위에 올리기
     */
    setExistLayer(layerId) {
      const map = this.map;
      let layerArr = this.layerArr;
      // let bounds = null;
      if (layerId !== undefined) {
        for (let ll = 0; ll < layerArr.length; ll++) {
          if (layerArr[ll]._fid.indexOf(layerId) > -1) {
            layerArr[ll].addTo(map);

            // if (bounds == null) bounds = layerArr[ll].getBounds();
            // else bounds.extend(layerArr[ll].getBounds());
          }
        }
      }

      // if(bounds != null) map.fitBounds(bounds);
    },
    /**
     * @description 지도 중심 이동
     * @param type String  (center, bound)
     * @param latlngs Array 좌표 배열
     */
    setCenter: function(lng, lat, zoom, callback) {
      const map = this.map;
      let latlng = new L.latLng(lat, lng);
      // map.panTo(latlng);
      // map.setZoom(zoom);
      map.setView(latlng, zoom);
      // map.flyTo(latlng, zoom);
      if (callback) setTimeout(callback, 230);
    },
    /**
     * @description 도형에 맞춰 지도 이동
     * @param type Object  (layer)
     */
    goFitBounds: function(layers, callback) {
      const map = this.map;
      let bounds = null;
      if (layers !== undefined && layers.length > 0) {
        for (let i = 0; i < layers.length; i++) {
          if (i == 0) bounds = layers[i].getBounds();
          else bounds.extend(layers[i].getBounds());
        }
      } else {
        return false;
      }
      map.fitBounds(bounds);

      if (callback) setTimeout(callback, 230);
    },
    /**
     * @description 특정 latlng를 이용한 레이어 생성
     */
    setLayerByLatlng: function(layerObj) {
      const that = this;
      let option = layerObj.option;
      const map = this.map;
      if (option.type == "polygon") {
        L.polygon(layerObj.dataLatlng, option.style).addTo(map);
      }
    },

    /**
     * @description 레이어 생성
     */
    setLayer(data, layerId, option) {
      const that = this;
      const map = this.map;
      const type = option.type;
      let bounds = null;

      // 데이터 형식 변경
      data.reduce((acc, v, i) => {
        let layer = undefined;

        // 버블일 경우
        if (type == "divIcon") {
          layer = L.geoJSON(wkt.parse(v.wkt4326), {
            pointToLayer(feature, latlng) {
              return that.makeMarker({
                latlng: latlng,
                option: that.makeIconOptions(v, option)
              });
            }
          });

          // 폴리곤일 경우
        } else {
          layer = that.makePolygon({
            data: v,
            option: option
          });
        }

        this.bindEvent(layer, option);
        // 데의터 저장 ( 지오코드 제외 )
        this.setProperties(layer, v);
        // 데이터 기준 option 저장
        layer["_propOption"] = {
          gradeColm: option.gradeColm,
          valueMap: option.valueMap
        };

        // 레이어 아이디 추가
        layer._fid = layerId;
        this.layerArr.push(layer);
        layer.addTo(map);
        // 테두리 저장
        if (i == 0) bounds = layer.getBounds();
        else bounds.extend(layer.getBounds());
      }, []);

      // 초기화를 위한 경계 기억하기
      if (option.saveBound) that.layerBounds = bounds;

      // 도형 영역이 전부 보이는 영역으로 경계 맞추기
      if (option.fitBound) map.fitBounds(bounds);
    },

    /**
     * @description 레이어 객체생성
     * @param {String} layerId 레이어 아이디
     * @param {String} type 레이어 형태
     * @param {Array} data 데이터
     * @param {Object} option 레이어 스타일
     */
    bindEvent: function(layer, option) {
      let that = this;

      // 레이어에 클릭 이벤트 추가
      if (option.onMouseClick.using) {
        this.bindMouseClickEvent(layer, option.onMouseClick.callback);
      }

      // 레이어에 hover 이벤트 추가
      if (option.onMouseEnter.using) {
        this.bindMouseEnterEvent(layer, option.onMouseEnter.callback);
      }

      // 레이어에 move 이벤트 추가
      if (option.onMouseMove.using) {
        this.bindMouseMoveEvent(layer, option.onMouseMove.callback);
      }

      // 레이어에 hover - out 이벤트 추가
      if (option.onMouseOut.using) {
        this.bindMouseOutEvent(layer, option.onMouseOut.callback);
      }

      return layer;
    },
    /**
     * @description 지역 마우스 오버시 혹은 선택시 스타일 변경
     */
    setHighlight(layerId, id, option) {
      const that = this;
      let defaultStyle = {
        weight: 2,
        opacity: 1,
        color: "#6326FF",
        fillColor: "#2b01fc",
        fillOpacity: 0.2
      };
      if (option) defaultStyle = Object.assign(defaultStyle, option);
      let tLayers = this.getLayer(layerId, id);
      if (tLayers !== undefined && tLayers.length > 0) {
        for (let t = 0; t < tLayers.length; t++) {
          tLayers[t].setStyle(defaultStyle);
        }
      }
    },
    /**
     * @description 지역 경계 스타일 원상 복귀
     */
    resetFeatureStyle: function(layerId, id, compareId) {
      const that = this;
      let tLayers = this.getLayer(layerId, id);
      if (tLayers !== undefined && tLayers.length > 0) {
        for (let t = 0; t < tLayers.length; t++) {
          // 특정 아이디에 해당하는 레이어만 스타일 초기화
          if (id !== undefined) {
            if (compareId != id) {
              tLayers[t].resetStyle();
            }
          } else {
            // 모든 레이어 스타일 초기화
            tLayers[t].resetStyle();
          }
        }
      }
    },
    /**
     * @description 팝업생성
     */
    setPopup(latlng, layerId, data, id) {
      const that = this;
      const map = this.map;
      let iconOption = {};
      iconOption.type = "popup";

      // todo. makeIconOptions 옵션에 size관련 내용 추가
      if (typeof layerId === "string" && layerId.indexOf("bubble") > -1) {
        // 버블일 경우 버블 반지름만큼 위에 위치
        let refLayer = that.getLayer(layerId, id);
        if (refLayer !== undefined) {
          let refOption = refLayer[0]["_propOption"];
          let isize = refOption.valueMap[data[refOption["gradeColm"]] - 1];
          iconOption.iconAnchor = [-15, isize / 2 + 265];
        }
      } else {
        // 버블이 아닐 경우 default iconAnchor 유지
        iconOption.iconAnchor = [-15, 290];
      }

      if (this.isLayer("popup")) {
        // 팝업 레이어가 있으면
        let pLayer = this.getLayer("popup", "popup");
        if (pLayer.length > 0) {
          // 레이어 내용 변경
          let icon = pLayer[0].getIcon();
          if (iconOption.iconAnchor)
            icon.options.iconAnchor = iconOption.iconAnchor;
          icon.options.html = this.mkPopupHtml(data);
          // 레이어 띄우기
          pLayer[0].setLatLng(latlng);
          pLayer[0].addTo(map);
        }
      } else {
        // 팝업 레이어가 없으면 만들기
        let popup = this.makeMarker({
          latlng: latlng,
          option: this.makeIconOptions(data, iconOption)
        });
        popup._fid = "popup";
        popup.properties = { id: "popup" };
        popup.addTo(map);

        this.layerArr.push(popup);
      }
    },
    /**
     * @description div 아이콘 옵션 추가
     */
    makeIconOptions(data, option) {
      const that = this;
      let divOption = {};
      // divIcon 만들기
      if (option !== undefined && option.type === "divIcon") {
        const size = option["valueMap"][Number(data[option["gradeColm"]]) - 1];
        divOption.iconAnchor = [size / 2, size / 2];
        divOption.className = option.className + data[option["gradeColm"]];
        divOption.html = that.mkDivHtml(data, option);
      } else if (option !== undefined && option.type === "popup") {
        divOption = option;
        if (divOption.iconAnchor == undefined)
          divOption.iconAnchor = [-15, 290];
        divOption.html = that.mkPopupHtml(data);
      }

      const iconDiv = L.divIcon(divOption);
      return { icon: iconDiv };
    },

    /**
     * @description marker 그림
     * @param {Object}
     * latlng - 좌표
     * option -
     */
    makeMarker({ latlng, option = {} }) {
      return L.marker(latlng, option);
    },

    /**
     * @description polygon 그림
     * @param {Object}
     * latlng - 좌표
     * option -
     */
    makePolygon({ data, option }) {
      return L.geoJSON(wkt.parse(data.wkt4326), {
        style: option.style
      });
    },

    /**
     * @description div icon의 html 만들기(bubble div)
     */
    mkDivHtml: function(data, option) {
      var type = option.className;
      var html = "";
      if (type.indexOf("circle") > -1) {
        html += '<span class="loca" >' + data[option["regionColm"]] + "</span>";
        html +=
          '<span class="lo_num" >' +
          (data[option["valueColm"]] == null
            ? "-"
            : data[option["valueColm"]]) +
          "</span>";
      } else if (type.indexOf("popup") > -1) {
      }
      return html;
    },

    /**
     * @description div icon의 html 만들기(popup div)
     */
    mkPopupHtml: function(data) {
      var html = "";
      html += '<div class="hover_cont_bg">';
      html += '<span class="num">' + data.nm + " 현황</span>";
      html += "<h2><b>" + data.last_date + "</b></h2>";
      html += '<ul class="cf">';

      html +=
        '<li class="tit"><b>확진환자</b><br><b class="num color">' +
        data.confirmed_n +
        "</b>&nbsp;&nbsp;명</li>";

      html +=
        '<li class="tit"><b>격리해제/퇴원</b><br><b class="num">' +
        data.cured_n +
        "</b>&nbsp;&nbsp;명</li>";

      html +=
        '<li class="tit"><b>사망자</b><br><b class="num">' +
        data.death_n +
        "</b>&nbsp;&nbsp;명</li>";

      html +=
        '<li class="tit"><b>격리중</b><br><b class="num">' +
        data.isolated_n +
        "</b>&nbsp;&nbsp;명</li>";

      html += "</ul></div>";

      return html;
    },

    /**
     * @description 레이어 각각에 wkt를 제외한 데이터 저장
     */
    setProperties: function(layer, data) {
      var prop = {};
      for (let dkey in data) {
        if (dkey != "wkt4326") prop[dkey] = data[dkey];
      }
      layer["properties"] = prop;
    },

    /**
     * @description 레이어 아이디와 지역 아이디로 레이어 찾아서 return 하기
     */
    getLayer: function(layerId, id) {
      const map = this.map;
      const layerArr = this.layerArr;
      let lArr = [];
      if (layerId !== undefined) {
        for (let ll = 0; ll < layerArr.length; ll++) {
          if (layerArr[ll]._fid.indexOf(layerId) > -1) {
            if (id !== undefined) {
              if (layerArr[ll].properties.id == id) lArr.push(layerArr[ll]);
            } else {
              lArr.push(layerArr[ll]);
            }
          }
        }
      }
      return lArr;
    },
    /**
     * @description 선택한 지역으로 표현 ( 공유 아님! )
     *  코로나 페이지(popup-event-covid)에서 특정 광역시 선택시 실행되는 메소드
     */
    selectMegaRegion: function(id) {
      let that = this;
      const layerId = "mega_bound_layer";
      // 시도 경계 초기화
      let megaLayer = this.getLayer(layerId);
      if (megaLayer.length > 0) {
        for (let tl = 0; tl < megaLayer.length; tl++) {
          megaLayer[tl].resetStyle();
        }
      }

      // 먼저 선택된 시군구 레이어 삭제
      this.removeLayers("cty_layer");
      // 먼저 선택된 버블 삭제
      this.removeLayers("cty_bubble_layer");
      // 광역시 버블 레이어 삭제
      this.removeLayers("mega_bubble_layer");

      // 전국 현황 보기 or 초기화
      if (id == "") {
        // 지도 센터 & zoom 초기화
        const initOption = this.$data.init.option;
        if (this.deviceType == "web")
          this.setCenter(
            initOption.center[1],
            initOption.center[0],
            initOption.level
          );
        else
          this.setCenter(
            initOption.mcenter[1],
            initOption.mcenter[0],
            initOption.mlevel
          );

        // 광역시 버블 on
        this.setExistLayer("mega_bubble_layer");
      } else {
        // 테두리 색상 변경
        let tLayer = this.getLayer(layerId, id);
        if (tLayer.length > 0) {
          for (let tl = 0; tl < tLayer.length; tl++) {
            tLayer[tl].setStyle({
              fillColor: "#2b01fc",
              weight: 3,
              opacity: 1,
              color: "#2B01FC",
              fillOpacity: 0.2
            });
          }

          // 중심 이동
          const props = tLayer[0].properties;
          if (this.deviceType == "web")
            this.setCenter(props.select_x, props.select_y, props.zoom, ctySet);
          else {
            this.setCenter(props.mo_x, props.mo_y, props.mo_zoom, ctySet);
            // this.goFitBounds(tLayer, ctySet);
          }
        }

        function ctySet() {
          // 시군구 경계 표현
          var layerObj = that.$parent.getLayerInfo("cty_layer");
          layerObj.dataQuery.parentId = id;
          that.getLayerData(layerObj);

          // 시군구 버블 표현
          var bubleObj = that.$parent.getLayerInfo("cty_bubble_layer");
          bubleObj.dataQuery.parentId = id;
          that.getLayerData(bubleObj);
        }
      }
    },
    /**
     * @description 레이어 클릭 이벤트(cty) ( 공유 아님! )
     *  코로나 페이지(popup-event-covid)에서 특정 시군구 선택시 실행되는 메소드
     */
    selectCtyRegion: function(id) {
      const layerId = "cty_layer";
      // 시군구 경계 초기화
      let ctyLayer = this.getLayer(layerId);
      if (ctyLayer.length > 0) {
        for (let tl = 0; tl < ctyLayer.length; tl++) {
          ctyLayer[tl].resetStyle();
        }
      }

      if (id == "") {
        // 지도 중심 변경 광역시 경계로
        this.goFitBounds(ctyLayer);
      } else {
        // 테두리 색상 변경
        let tLayer = this.getLayer(layerId, id);
        if (tLayer.length > 0) {
          for (let tl = 0; tl < tLayer.length; tl++) {
            tLayer[tl].setStyle({
              fillColor: "#2b01fc",
              weight: 3,
              opacity: 1,
              color: "#2B01FC",
              fillOpacity: 0.2
            });
          }
        }

        // 지도 중심 변경
        this.goFitBounds(tLayer);
      }
    },
    /**
     * @description 레이어 클릭 이벤트(mega)
     */
    bindMouseClickEvent: function(layer, callback) {
      var that = this;
      layer.on("click", function(event) {
        callback(event, that);
      });
    },
    /**
     * @description 레이어 마우스 오버 이벤트 추가
     */
    bindMouseEnterEvent: function(layer, callback) {
      var that = this;
      layer.on("mouseover", function(event) {
        callback(event, that);
      });
    },
    /**
     * @description 레이어 마우스 무브 이벤트 추가
     */
    bindMouseMoveEvent: function(layer, callback) {
      var that = this;
      layer.on("mousemove", function(event) {
        callback(event, that);
      });
    },
    /**
     * @description 레이어 마우스 아웃 이벤트 추가
     */
    bindMouseOutEvent: function(layer, callback) {
      var that = this;
      layer.on("mouseout", function(event) {
        callback(event, that);
      });
    },

    /**
     * @description 레이어 삭제
     */
    removeLayers: function(layerId) {
      const map = this.map;
      let layerArr = this.layerArr;
      if (layerId !== undefined) {
        for (let ll = 0; ll < layerArr.length; ll++) {
          if (layerArr[ll]._fid.indexOf(layerId) > -1) {
            map.removeLayer(layerArr[ll]);
          }
        }
      }
    }
  }
};
</script>
<style src="leaflet/dist/leaflet.css"></style>
<style scoped>
/**********  map  **********/

/**********  zoomController  **********/
.leaflet >>> .leaflet-control-zoom.leaflet-bar.leaflet-control {
  top: 100px;
}

/********** mini map **********/
.leaflet >>> .leaflet-control-minimap.leaflet-container {
  border-radius: 10px;
  border: 2px solid #eee;
}

/**********  baseChange  **********/
.leaflet >>> .baseChange {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 24px;
  z-index: 500;
}

.leaflet >>> .baseChange span {
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

.leaflet >>> .baseChange span.on {
  background: #4c4e57;
  color: #fff;
}

.leaflet >>> .circle_1 {
  color: #333;
}

.leaflet >>> .bubble_1 {
  background-color: #ff0000;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.leaflet >>> .bubble_2 {
  background-color: #b6a7d4;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.leaflet >>> .bubble_3 {
  background-color: #856db5;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.leaflet >>> .bubble_4 {
  background-color: #532f99;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.leaflet >>> .bubble_5 {
  background-color: #320096;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: #856db5;
}

.leaflet >>> .backBlur {
  cursor: default;
}

.leaflet >>> .leaflet-marker-icon.leaflet-div-icon {
  background: transparent;
  border: 0;
}
</style>
