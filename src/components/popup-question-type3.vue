<template>
  <div class="_popup_question" :class="position">
    <div class="_popup_question_container">
        <div class="_popup_question_data_container">
        <div class="_popup_question_data_block">
          <div v-for="(text, index) in contents" :key="index" class="_popup_question_data_value">
            <p class="_sub" v-show="text.indexOf('@') >= 0">&middot; {{ text.split('@')[1] }}</p>
            <p v-show="text.indexOf('@') < 0">{{ text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Array,
      required: false,
      default: () => []
    },
    position: {
      type: String,
      required: false,
      default: "none"
    }
  },
  data() {
    return {
      isVisibleLayer: true
    };
  }
};
</script>
<style scoped>
/* CSS talk bubble */
._popup_question {
  visibility: hidden;
  color: rgb(68, 68, 68);
  font-family: Nanum Gothic;
  font-weight: 200;
  font-size: 12px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 4px 7px;
  position: fixed;
  z-index: 300;
}

._popup_question.hidden {
  visibility: hidden;
}

._popup_question >>> ._popup_question_container {
  background-color: rgb(255, 255, 255);
  padding: 6px;
  width: -moz-max-content;
  width: -webkit-max-content;
  width: -o-max-content;
}

._popup_question >>> ._popup_question_data_container {
  overflow-y: auto;
  z-index: -1;
}

._popup_question >>> ._popup_question_data_block {
  font-size: 12px;
  padding: 3px 6px;
  position: relative;
  color: rgb(0, 0, 0);
}

._popup_question >>> ._popup_question_data_value {
  display: block;
  text-align: left;
  top: 3px;
  right: 6px;
  line-height: 20px;
}

._popup_question >>> ._popup_question_data_value p:not(._sub) {
  margin-left: 7px;
}

._popup_question >>> ._popup_question_data_seperator {
  background-color: rgb(221, 221, 221);
  display: block;
  height: 1px;
  margin: 0px 3px;
}

._popup_question >>> ._popup_question_footer {
  font-size: 10px;
  position: relative;
  text-align: center;
}
</style>