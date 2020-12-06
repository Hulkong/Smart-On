export default {
    methods: {
        /**
         * 
         * @param {String} name         컴포넌트 객체명가져오기 
         * @param {Function} info       레이어 정보가져오는 함수
         * @param {Function} callback   paramter 가져오는 함수
         */
        getDefaultLayers(name, infoFuc = () => { }, callback = () => { }){
            const target = this.$refs[name];
            const layers = target.options.mapConfig.layers;
            const layerInfo = [];
            // 초기 세팅될 레이어 정보 가져오기
            if(layers.length > 0){
                for(let i = 0; i < layers.length; i++){
                    var info = infoFuc(layers[i]);
                    // 레이어를 가져올 url에 대한 paramter 수정
                    info.dataQuery = callback(info.dataQuery)
                    layerInfo.push(info);
                }
            }

            return layerInfo;
        }
    }
}