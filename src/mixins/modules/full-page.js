export default {
  methods: {

    /**
     * @description 페이지 offset 계산하는 메소드
     */
    calcFullpageOffsets() {

      const container = document.getElementsByClassName("fullpage");

      return new Promise((resolve, reject) => {

        const offsets = [];
        for (let i = 0; i < container.length; i++) {
          let pageOffset = container[i].offsetTop;
          offsets.push(pageOffset);
        }

        resolve(offsets);
      });
    },

    /**
     * @description 0.3초 간격으로 휠 이벤트 동작 메소드
     * @param {Event} e primitive event parameter
     * @param {Function} callback
     */
    handleMouseWheel(e, callback = () => { }) {
      e.preventDefault();

      /* For IE */
      if (!e) e = window.event;

      // chrome
      let delta = e.wheelDelta;

      // IE or Firefox
      if (!delta) {
        delta = -e.deltaY;
      }

      // 아래로 이동
      if (delta < 0) {
        this.moveDown(callback);

        // 위로 이동
      } else if (delta > 0) {
        this.moveUp(callback);
      }

      return false;
    },

    /**
     * @description 마우스휠 업 이벤트 리스너
     */
    moveUp: _.debounce(function (callback) {
      const that = this;
      if (that.activePage < 1) return;

      let id = --that.activePage;

      that.moveScroll(that.offsets[id])
      callback(that.activePage);
    }, 300),

    /**
     * @description 마우스휠 다운 이벤트 리스너
     */
    moveDown: _.debounce(function (callback) {
      const that = this;
      if (that.activePage >= that.offsets.length - 1) return;

      let id = ++that.activePage;

      that.moveScroll(that.offsets[id]);
      callback(that.activePage);
    }, 300)
  }
}
