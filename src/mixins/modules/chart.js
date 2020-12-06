export default {
  methods: {
    makeChartTargets(filters) {
      const obj = {};
      // vue $ref가 등록된 차트 다시 그리기
      for (let name in this.$refs) {
        const component = this.$refs[name];

        if (filters.indexOf(name) >= 0) {
          obj[name] = component;
        }
      }

      return obj;
    },

    /**
     * @description 특정 레펀러스에 바인딩된 차트(그리드포함) 그림
     * @param {Object references} $ref 설정된 컴포넌트들
     */
    drawCharts(references, callback = () => { }) {

      const rootDomId = this.$options.name;

      //  refs 컴포넌트 루프
      for (let name in references) {
        let component = references[name]; // 특정 컴포넌트

        // v-for 안에 ref 속성을 동적으로 설정하면 $refs로 값을 가져올 때 해당 컴포넌트는 배열임
        if (Array.isArray(this.$refs[name])) {
          component = this.$refs[name][0];
        }

        // 컴포넌트가 없으면 리턴
        if (!component) return;

        const that = this;
        const element = component.$el;
        const options = component.options;
        const clean = options.clean; // 정제콜백함수
        const controlLayout = options.controlLayout;
        const query = options.dataQuery; // 쿼리스트링 객체
        let converQuery = {};

        let url = options.dataURL; // 데이터 호출 url

        // 커스텀 쿼리 세팅 진행
        if (typeof callback === 'function') {
          converQuery = callback(query, name)
        }

        component.remove(); // 컴포넌트에 등록된 차트 제거하기
        this.hideDefaultImage(element);
        this.showLoading(element); // 로딩레이어 생성

        // 데이터 가져옴
        this.getData(url, converQuery).then(result => {
          that.hideLoading(element); // 로딩레이어 삭제


          // 호출된 루트DOM이 없을 경우 리턴
          if (!document.getElementById(rootDomId)) return;

          controlLayout(element); // 차트 레이아웃 조정
          const cleanData = clean(result["data"]); // 정제된 데이터 배열

          if (name.indexOf('grid') < 0 && cleanData.length === 0) {
            this.showDefaultImage(element); // 디폴트 레이어 생성
            return;
          }

          component.copyData = JSON.stringify(cleanData); // 깊은 복사

          component.remove(); // 컴포넌트에 등록된 차트 제거하기
          component.draw(cleanData, options); // 컴포넌트에 등록된 차트그리기
        }).catch(e => {
          console.log(e)
          that.hideLoading(element); // 로딩 레이어 생성
          that.showDefaultImage(element); // 디폴트 레이어 생성

          if (!e.response || !e.response.status) return;

          // 서버 오류 발생시
          if (e.response.status === 500 || e.response.status === 404) {

            // 그리드차트인 경우 빈 배열로 차트 그림
            if (name.indexOf('grid') >= 0) {
              controlLayout(element);
              component.draw([], options)
            }
          }
        });
      }
    },

    /**
     * @description 특정 레펀러스에 바인딩된 차트(그리드포함) 그림
     * @param {Object references} $ref 설정된 컴포넌트들
     */
    redrawCharts(references, callback = () => { }) {

      const rootDomId = this.$options.name;

      //  refs 컴포넌트 루프
      for (let name in references) {
        let component = references[name]; // 특정 컴포넌트

        // v-for 안에 ref 속성을 동적으로 설정하면 $refs로 값을 가져올 때 해당 컴포넌트는 배열임
        if (Array.isArray(this.$refs[name])) {
          component = this.$refs[name][0];
        }

        // 컴포넌트가 없으면 리턴
        if (!component) return;

        const element = component.$el;
        const options = component.options;
        const controlLayout = options.controlLayout;

        // 호출된 루트DOM이 없을 경우 리턴
        if (!document.getElementById(rootDomId)) return;

        controlLayout(element); // 차트 레이아웃 조정

        if (component.copyData.length === 0) {
          this.showDefaultImage(element); // 디폴트 레이어 생성
          return;
        }

        const copyData = JSON.parse(component.copyData); // 정제된 데이터 배열

        this.hideDefaultImage(element);
        component.remove(); // 컴포넌트에 등록된 차트 제거하기
        component.draw(copyData, options); // 컴포넌트에 등록된 차트그리기
      }
    }
  }
}
