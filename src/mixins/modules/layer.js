import animateScrollTo from "animated-scroll-to";
export default {
  methods: {
    /**
     * @description 로딩바 보임 호출 메소드
     */
    showLoading(element) {
      if (!element) return;

      const loadingBarDOM = element.getElementsByClassName("_loading_bar")[0];

      if (!loadingBarDOM) return;

      // loadingBarDOM.style.visibility = "visible";
      loadingBarDOM.style.display = "block";
    },

    /**
     * @description 로딩바 숨김 호출 메소드
     */
    hideLoading(element) {

      if (!element) return;

      const loadingBarDOM = element.getElementsByClassName("_loading_bar")[0];

      if (!loadingBarDOM) return;

      loadingBarDOM.style.display = "none";
    },

    /**
     * @description 디폴트 레이어 보임 호출 메소드
     */
    showDefaultImage(element) {

      if (!element) return;

      const loadingBarDOM = element.getElementsByClassName("_default_image")[0];

      if (!loadingBarDOM) return;

      loadingBarDOM.style.display = "block";
    },

    /**
     * @description 디폴트 레이어 숨김 호출 메소드
     */
    hideDefaultImage(element) {

      if (!element) return;

      const loadingBarDOM = element.getElementsByClassName("_default_image")[0];

      if (!loadingBarDOM) return;

      loadingBarDOM.style.display = "none";
    },

    /**
     * @description resize 이벤트 리스너
     */
    onResize: _.debounce(function () {
      const that = this;

      // full-page offset 동적계산
      this.calcFullpageOffsets().then(offsets => {
        const callback = that.resetOffsets;

        if (callback && typeof callback === "function") {
          callback(offsets);
        }

        this.moveScroll(offsets[that.activePage]); // 다시 계산된 offset 으로 이동
      });
      this.redrawCharts(this.$refs); // 차트 다시그리는 메소드

    }, 500, false),

    /**
     * @description 부드럽게 스크롤 이동시키는 메소드
     * @param {Number} offset 위치정보
     */
    moveScroll(offset) {

      return new Promise((resolve, reject) => {
        if (offset === undefined) return true;
        animateScrollTo(offset, {
          // Indicated if scroll animation should be canceled on user action (scroll/keypress/touch)
          // if set to "false" user input will be disabled until scroll animation is complete
          cancelOnUserAction: true,

          // Animation easing function, with "easeOutCubic" as default
          easing: t => (--t) * t * t + 1,

          // DOM element that should be scrolled
          // Example: document.querySelector('#element-to-scroll'),
          elementToScroll: window,

          // Horizontal scroll offset
          // Practical when you are scrolling to a DOM element and want to add some padding
          horizontalOffset: 0,

          // Maximum duration of the scroll animation
          maxDuration: 3000,

          // Minimum duration of the scroll animation
          minDuration: 250,

          // Duration of the scroll per 1000px
          speed: 1000,

          // Vertical scroll offset
          // Practical when you are scrolling to a DOM element and want to add some padding
          verticalOffset: 0,
        });

        resolve(offset);
      });

    },

    /**
     * @description 물음표 마우스 오버시 팝업창 여는 메소드
     */
    openQuestionPopup(event) {
      const target = event.target;
      const targetX = target.getBoundingClientRect().x || event.clientX;
      const targetY = target.getBoundingClientRect().y || event.clientY;
      const questionDOM = target.parentElement.getElementsByClassName('_popup_question')[0];
      const questionWidth = questionDOM.getBoundingClientRect().width;
      const questionHeight = questionDOM.getBoundingClientRect().height;
      let x = 0;
      let y = 0;

      if (!questionDOM) return;

      questionDOM.style.visibility = "visible"

      if (questionDOM.classList.contains('top')) {
        y = targetY - questionHeight;
      }

      if (questionDOM.classList.contains('left')) {
        x = targetX - questionWidth;
      }

      if (questionDOM.classList.contains('right')) {
        x = targetX + 30;
      }

      if (questionDOM.classList.contains('bottom')) {

      }

      if (questionDOM.classList.contains('center')) {
        y = Math.floor(targetY - questionHeight / 2);
      }
     
      if (questionDOM.classList.contains('none')) {
        x = targetX ;
        y = targetY + questionHeight;
      }

      if (y <= 0) y = 20;

      questionDOM.style.left = x + "px";
      questionDOM.style.top = y + "px";
    },

    /**
     * @description 물음표 마우스 오버시 팝업창 여는 메소드
     */
    closeQuestionPopup() {
      const target = event.target;
      const questionDOM = target.parentElement.getElementsByClassName('_popup_question')[0];

      if (!questionDOM) return;

      questionDOM.style.visibility = "hidden";
    }
  }
}
