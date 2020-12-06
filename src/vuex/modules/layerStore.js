import { circle } from "leaflet";

export default {
    namespaced: true,
    state: {
        "cty_bound_layer": {
            layerId: "cty_bound_layer",
            layerNm: "시군구 경계 가져오기",
            dataURL: "/api/map/areaWKT2",
            dataQuery: {
                ctycd: 0,
                rgnclss: 'H3'
            },
            dataLatlng: null,
            layerLoc: "navi",
            layerRootLoc: "main",
            clean(data) {
                return data;
            },
            option: {
                type: 'polygon',
                style: function () {
                    return {
                        fillColor: "#FF5F2E",
                        weight: 2,
                        opacity: 1,
                        color: "#FF5F2E",
                        fillOpacity: 0.32
                    }
                },
                onMouseClick: {
                    using: false,
                    callback: (event, vueInstance) => {
                    }
                },
                onMouseEnter: {
                    using: false,
                    callback: (event, vueInstance) => {
                    }
                },
                onMouseMove: {
                    using: false,
                    callback: null
                },
                onMouseOut: {
                    using: false,
                    callback: (event, vueInstance) => {
                    }
                },
                pointToLayer: null,
                defaultCenter: false,
                saveBound: false,
                fitBound: true
            },
            bounds: null
        },
        "blur_layer": {
            layerId: "blur_layer",
            layerNm: "지도위에 디자인 효과",
            dataURL: null,
            dataQuery: {
            },
            dataLatlng: [
                [44.4808302785626, 116.38993112664474],
                [44.4808302785626, 142.11483964970802],
                [29.630771207229, 142.11483964970802],
                [29.630771207229, 116.38993112664474]
            ],
            layerLoc: "covid page",
            layerRootLoc: "popup",
            clean(data) {
            },
            option: {
                type: 'polygon',
                style: {
                    fillColor: "#FFFFFF",
                    weight: 0,
                    opacity: 0,
                    color: "#FF5F2E",
                    fillOpacity: 0.75,
                    className: 'backBlur'

                },
                onMouseClick: {
                    using: false,
                    callback: (event, vueInstance) => {
                    }
                },
                onMouseEnter: {
                    using: false,
                    callback: (event, vueInstance) => {
                    }
                },
                onMouseMove: {
                    using: false,
                    callback: null
                },
                onMouseOut: {
                    using: false,
                    callback: (event, vueInstance) => {
                    }
                },
                pointToLayer: null,
                defaultCenter: false,
                saveBound: false,
                fitBound: false
            },
            bounds: null
        },

        "cty_layer": {
            layerId: "cty_layer",
            layerNm: "선택한 시도의 시군구 경계 가져오기",
            dataURL: "/api/covid/mapBound",
            dataQuery: {
                parentId: 0,
                rgnclss: 'H3'
            },
            dataLatlng: null,
            layerLoc: "covid page",
            layerRootLoc: "popup",
            clean(data) {
                return data;
            },
            option: {
                type: 'polygon',
                style: function () {
                    return {
                        fillColor: "#FFFFFF",
                        weight: 1,
                        opacity: 1,
                        color: "#43307F",
                        fillOpacity: 0
                    }
                },
                onMouseClick: {
                    using: true,
                    callback: (event, vueInstance) => {
                        vueInstance.$parent.$data.selctycd = event.target.properties.id;
                    }
                },
                onMouseEnter: {
                    using: true,
                    callback: (event, vueInstance) => {
                        const tLayer = event.target;
                        tLayer.setStyle({
                            weight: 2,
                            opacity: 1,
                            color: "#6326FF",
                            fillColor: "#2b01fc",
                            fillOpacity: 0.2
                        });

                        // 왼쪽 아래 리스트 hover 효과 추가
                        vueInstance.$parent.$data.hoverId = tLayer.properties.id;

                        //팝업 on
                        const tid = tLayer.properties.id
                        const bubLayer = vueInstance.getLayer('cty_bubble_layer', tid);
                        if (bubLayer !== undefined && bubLayer.length > 0)
                            vueInstance.setPopup(event.latlng, tLayer._fid, bubLayer[0].properties, tid);
                    }
                },
                onMouseMove: {
                    using: true,
                    callback: (event, vueInstance) => {
                        const tLayer = event.target;
                        const tid = tLayer.properties.id
                        if (vueInstance.isLayer('popup')) {
                            const bubLayer = vueInstance.getLayer('cty_bubble_layer', tid);
                            if (bubLayer !== undefined && bubLayer.length > 0)
                                vueInstance.setPopup(event.latlng, tLayer._fid, bubLayer[0].properties, tid);
                        }
                    }
                },
                onMouseOut: {
                    using: true,
                    callback: (event, vueInstance) => {
                        const tLayer = event.target;
                        const id = event.target.properties.id;
                        const compareId = vueInstance.$parent.$data['selctycd'];
                        vueInstance.resetFeatureStyle(tLayer._fid, id, compareId);
                        // 왼쪽 아래 리스트 hover 효과 초기화
                        vueInstance.$parent.$data.hoverId = "";

                        //팝업 off
                        const map = vueInstance.map;
                        const popLayer = vueInstance.getLayer('popup', 'popup');
                        if (popLayer.length > 0)
                            map.removeLayer(popLayer[0])
                    }
                },
                pointToLayer: null,
                defaultCenter: false,
                saveBound: false,
                fitBound: false
            },
            bounds: null
        },
        "mega_bound_layer": {
            layerId: "mega_bound_layer",
            layerNm: "광역시 경계 가져오기",
            dataURL: "/api/covid/mapBound",
            dataQuery: {
                rgnclss: 'H1',
            },
            dataLatlng: null,
            layerLoc: "covid page",
            layerRootLoc: "popup",
            clean(data) {
                return data;
            },
            option: {
                type: 'polygon',
                style: function () {
                    return {
                        fillColor: "#FFFFFF",
                        weight: 1,
                        opacity: 1,
                        color: "#43307F",
                        fillOpacity: 0
                    }
                },
                onMouseClick: {
                    using: true,
                    callback: (event, vueInstance) => {
                        vueInstance.$parent.$data.selmegacd = event.target.properties.id;
                    }
                },
                onMouseEnter: {
                    using: true,
                    callback: (event, vueInstance) => {
                        let tLayer = event.target;
                        // 색상 하이라이트
                        tLayer.setStyle({
                            weight: 2,
                            opacity: 1,
                            color: "#6326FF",
                            fillColor: "#2b01fc",
                            fillOpacity: 0.2
                        });


                        // 왼쪽 아래 리스트 hover 효과 추가
                        vueInstance.$parent.$data.hoverId = tLayer.properties.id;

                        //팝업 on
                        const tid = tLayer.properties.id;
                        const bubLayer = vueInstance.getLayer('mega_bubble_layer', tid);
                        vueInstance.setPopup(event.latlng, tLayer._fid, bubLayer[0].properties, tid);
                    }
                },
                onMouseMove: {
                    using: true,
                    callback: (event, vueInstance) => {
                        let tLayer = event.target;

                        //팝업 on
                        const tid = tLayer.properties.id
                        const bubLayer = vueInstance.getLayer('mega_bubble_layer', tid);
                        vueInstance.setPopup(event.latlng, tLayer._fid, bubLayer[0].properties, tid);
                    }
                },
                onMouseOut: {
                    using: true,
                    callback: (event, vueInstance) => {
                        let tLayer = event.target;
                        const id = tLayer.properties.id;
                        const compareId = vueInstance.$parent.$data['selmegacd'];
                        // 시도 경계 초기화
                        vueInstance.resetFeatureStyle(tLayer._fid, id, compareId);

                        // 왼쪽 아래 리스트 hover 효과 초기화
                        vueInstance.$parent.$data.hoverId = "";

                        //팝업 off
                        const map = vueInstance.map;
                        let popLayer = vueInstance.getLayer('popup', 'popup');
                        if (popLayer.length > 0)
                            map.removeLayer(popLayer[0])
                    }
                },
                pointToLayer: null,
                saveBound: true,
                fitBound: false,
                defaultCenter: ['select_x', 'select_y', 'zoom']
            },
            bounds: null
        },
        "mega_bubble_layer": {
            layerId: "mega_bubble_layer",
            layerNm: "광역시 코로나 확진자 bubble 가져오기",
            dataURL: "/api/covid/getMegaBuble",
            dataQuery: {
                rgnclss: 'H1',
                lastDate: null,
                lastTime: null
            },
            dataLatlng: null,
            layerLoc: "covid page",
            layerRootLoc: "popup",
            clean(data) {
                return data;
            },
            option: {
                type: 'divIcon',
                valueMap: [100, 90, 80, 70, 60],
                colorMap: ['#320096', '#532f99', '#62449c', '#856db5', '#b6a7d4'],
                className: 'circle0',
                valueColm: 'confirmed_n',
                gradeColm: 'grade',
                regionColm: 'mega_nm_2',
                fitBound: false,
                defaultCenter: false,
                saveBound: false,
                onMouseClick: {
                    using: true,
                    callback: (event, vueInstance) => {
                        vueInstance.$parent.$data.selmegacd = event.target.properties.id
                    }
                },
                onMouseEnter: {
                    using: true,
                    callback: (event, vueInstance) => {
                        // polygon feature 스타일 변경
                        let tLayer = event.target;
                        let tid = tLayer.properties.id;
                        vueInstance.setHighlight('mega_bound_layer', tid);

                        // 왼쪽 아래 리스트 hover 효과 추가
                        vueInstance.$parent.$data.hoverId = tid;

                        //팝업 on
                        vueInstance.setPopup(event.latlng, tLayer._fid, tLayer.properties, tid);
                    }
                },
                onMouseMove: {
                    using: true,
                    callback: (event, vueInstance) => {
                        let tLayer = event.target;
                        //팝업 move
                        if (tLayer) {
                            let tid = tLayer.properties.id;
                            vueInstance.setPopup(event.latlng, tLayer._fid, tLayer.properties, tid);
                        }
                    }
                },
                onMouseOut: {
                    using: true,
                    callback: (event, vueInstance) => {
                        // 시도 경계 초기화
                        let tid = event.target.properties.id;
                        const compareId = vueInstance.$parent.$data['selmegacd'];
                        vueInstance.resetFeatureStyle('mega_bound_layer', tid, compareId);

                        // 왼쪽 아래 리스트 hover 효과 초기화
                        vueInstance.$parent.$data.hoverId = "";

                        //팝업 off
                        const map = vueInstance.map;
                        let popLayer = vueInstance.getLayer('popup', 'popup');
                        if (popLayer.length > 0)
                            map.removeLayer(popLayer[0])
                    }
                },
            },
            bounds: null
        },
        "cty_bubble_layer": {
            layerId: "cty_bubble_layer",
            layerNm: "시군구 코로나 확진자 bubble 가져오기",
            dataURL: "/api/covid/getctyBuble",
            dataQuery: {
                rgnclss: 'H3',
                parentId: null,
                lastDate: null,
                lastTime: null
            },
            dataLatlng: null,
            layerLoc: "covid page",
            layerRootLoc: "popup",
            clean(data) {
                return data;
            },
            option: {
                type: 'divIcon',
                valueMap: [100, 90, 80, 70, 60],
                colorMap: ['#320096', '#532f99', '#62449c', '#856db5', '#b6a7d4'],
                className: 'circle0',
                valueColm: 'confirmed_n',
                gradeColm: 'grade',
                regionColm: 'cty_nm',
                fitBound: false,
                defaultCenter: false,
                saveBound: false,
                onMouseClick: {
                    using: true,
                    callback: (event, vueInstance) => {
                        vueInstance.$parent.$data.selctycd = event.target.properties.id;
                    }
                },
                onMouseEnter: {
                    using: true,
                    callback: (event, vueInstance) => {
                        let tid = event.target.properties.id;
                        let tLayer = vueInstance.getLayer('cty_layer', tid);
                        if (tLayer.length > 0) {
                            tLayer[0].setStyle({
                                weight: 2,
                                opacity: 1,
                                color: "#6326FF",
                                fillColor: "#2b01fc",
                                fillOpacity: 0.2
                            });
                        }

                        // 왼쪽 아래 리스트 hover 효과 추가
                        vueInstance.$parent.$data.hoverId = tid;

                        //팝업 on
                        vueInstance.setPopup(event.latlng, event.target._fid, event.target.properties, tid);
                    }
                },
                onMouseMove: {
                    using: false,
                    callback: (event, vueInstance) => {
                        //팝업 on
                        let tid = event.target.properties.id;
                        vueInstance.setPopup(event.latlng, event.target.properties, tid);
                    }
                },
                onMouseOut: {
                    using: true,
                    callback: (event, vueInstance) => {
                        // 시도 경계 초기화
                        let tid = event.target.properties.id;
                        const compareId = vueInstance.$parent.$data['selctycd'];
                        vueInstance.resetFeatureStyle('cty_layer', tid, compareId);

                        // 왼쪽 아래 리스트 hover 효과 초기화
                        vueInstance.$parent.$data.hoverId = "";

                        //팝업 off
                        const map = vueInstance.map;
                        let popLayer = vueInstance.getLayer('popup', 'popup');
                        if (popLayer.length > 0)
                            map.removeLayer(popLayer[0])
                    }
                },
            },
            bounds: null
        },
        "popupOption": {

        }
    },
    getters: {
        /**
         * 레이어 기본 정보 가져오기
         */
        getLayerInfo: (state) => (id) => {
            return state[id];
        },
    },
    mutations: {
    },
    actions: {}
};
