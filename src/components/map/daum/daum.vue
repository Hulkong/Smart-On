<template>
    <div id="ddaumAPI" class="mapArea">
        <!-- basemap change type -->
        <div class="baseChange">
          <span @click="mapType='ROADMAP'" :class="{on : (mapType == 'ROADMAP')}">일반</span>
				  <span @click="mapType='SKYVIEW'" :class="{on : (mapType == 'SKYVIEW')}">위성</span>
				  <span @click="mapType='HYBRID'" :class="{on : (mapType == 'HYBRID')}">겹쳐보기</span>
        </div>
        <!-- ////  basemap change type -->
        <!-- zoomController -->
        <div class="custom_zoomcontrol radius_border 4menu">
          <span @click="(zoomlevel -= 1)">
            <img
              src="http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
              class="zoom"
              alt="확대"
            >
          </span>
          <span @click="(zoomlevel += 1)">
            <img
              src="http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
              class="zoom"
              alt="축소"
            >
          </span>
          <span @click="reload">
            <img src="/src/assets/images/map/map_util_refresh.png" class="zoom" alt="지도 초기화" width="15px" height="17px">
          </span>
        </div>
        <!-- ///// zoomController -->
    </div>
</template>
<script>
  export default {
    watch : {
      zoomlevel : function(newLevel, oldLevel){   // zoomlevel 변경
        if(newLevel < 14 && newLevel > 1) this.$data.map.setLevel(newLevel);
        else this.$data.zoomlevel = oldLevel;
      },
      mapType : function(newType, oldType){       // base map type 변경
        this.$data.map.setMapTypeId(kakao.maps.MapTypeId[newType]);
      }
    },
    mounted : function(){
      // 지도 생성
      if(this.$data.map == null) this.createMap();  
    },
    data: () => ({
      map : null,           // 지도 객체
      zoomlevel : 13,       // 현재 zoomlevel
      init : {              // 초기값
        center : [35.91516410110089, 127.15138456797408],
        level : 13
      },
      mapType : 'ROADMAP',  // base map type
      layers : []           // 레이어 저장 
    }),
    methods : {
      createMap: function() {       // 지도 생성
        var mapContainer = this.$el;
        var mapOption = {
            center: new kakao.maps.LatLng(this.$data.init.center[0],this.$data.init.center[1]), 
            disableDoubleClick: true,
            disableDoubleClickZoom: true,
            tileAnimation: true,
            level: this.$data.zoomlevel // 지도의 확대 레벨
        };
      
        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        this.$data.map = new kakao.maps.Map(mapContainer, mapOption);
      },
      reload : function(){        // 지도 초기화
        // 초기중심으로 이동
        this.$data.map.setCenter(new kakao.maps.LatLng(this.$data.init.center[0],this.$data.init.center[1]));
        // 초기 Zoom level로 이동
        this.$data.map.setLevel(this.$data.init.level);
      }
    }
  }
</script>
<style scoped>
/**********  map  **********/
.mapArea {
  width : 100%;
  height : 100%;
}
/**********  zoombar  **********/
.radius_border{border:1px solid #919191;border-radius:5px;}     
.custom_zoomcontrol {position:absolute;top:10%;right:10px;width:40px;overflow:hidden;z-index:2;background-color:#f5f5f5;} 
.custom_zoomcontrol.3menu {height:120px;}
.custom_zoomcontrol.4menu {height:160px;}
.custom_zoomcontrol span {display:block;width:40px;height:42px;text-align:center;cursor:pointer;}     
.custom_zoomcontrol span img {border:none;}            
.custom_zoomcontrol span img.zoom {width:15px;height:15px;padding:12px 0;border:none;height:40px;}             
.custom_zoomcontrol span {border-bottom:1px solid #bfbfbf;} 
.custom_zoomcontrol span:last-child{border-bottom:0px solid #bfbfbf;} 
.custom_zoomcontrol span:last-child img {border:none;} 

/**********  baseChange  **********/
.baseChange {position:absolute;top:10px;right:10px;height:24px;z-index: 2;}
.baseChange span {padding:2px 10px;height:30px;font-size: 12px;display: inline-block;line-height: 2;font-weight: bold;background: #f7f7f7;border-radius: 4px;border: 1px solid #c8c8c8;box-shadow: 0px 1px #888;cursor: pointer;text-align:center;}
.baseChange span.on {background: #4C4E57;color:#fff;}
</style>