<template>
    <div id="dleaflet" class="mapArea">
    </div>
</template>
<script>
    export default {
        mounted : function(){
            this.createMap();
        },
        data: () => ({
            daum: {
                srs: "EPSG:5181",
                proj: "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
                tileSize: 256,
    //                extent: [-30000, -60000, 494288, 988576],
                bounds : L.bounds([-30000, -60000], [494288, 988576]),
                resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
                origin: [-30000, -60000],
                zoomReverse : true,
                zoomOffset : 1,
                doTms: true,
                tileUrl: 'http://map{s}.daumcdn.net/map_2d/1712dec/L{z}/{y}/{x}.png'
            },
            crs: null,
            map : null,           // 지도 객체
            zoomlevel : 1,       // 현재 zoomlevel
            init : {              // 초기값
                center : [36.427947440859654, 126.89597882653241],
                level : 1
            },
            mapType : 'ROADMAP',  // base map type
            layers : []           // 레이어 저장 
        }),
        methods : {
            setCrs : function(){
                this.$data.crs = new L.Proj.CRS(
				              this.$data.daum.srs
                            , this.$data.daum.proj 
                            , { resolutions: this.$data.daum.resolutions
                                , origin: this.$data.daum.origin
                                , bounds: this.$data.daum.bounds
                              }
			    )
            },
            createMap: function() {       // 지도 생성
                // 좌표계 생성
                this.setCrs();
                
                //지도 만들기
                var that = this;
                this.$data.map = L.map('dleaflet', {
                    zoomControl:false,
                    crs : this.$data.crs,
                }).setView(this.$data.init.center, this.$data.init.level);

                L.tileLayer( 'http://map{s}.daumcdn.net/map_2d/'+kakao.maps.VERSION.HYBRID+'/L{z}/{y}/{x}.png'
                // L.tileLayer( 'http://map{s}.daumcdn.net/map_skyview/L{z}/{y}/{x}.jpg?v=160114'
                , {	    attribution : '© kakaomap',
                        noWrap: true,       // 반복없애기
                        minZoom : 1,
                        maxZoom : 13,
                        zoomOffset: this.$data.daum.zoomOffset,
                        zoomReverse: this.$data.daum.zoomReverse,
                        subdomains: '0123',
                        tms: this.$data.daum.doTms
                }).addTo(this.$data.map);

                L.control.zoom({
                    position:'topright'
                }).addTo(this.$data.map);

            },
            getCenter : function() {
                console.log(this.$data.map.getCenter());
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
</style>