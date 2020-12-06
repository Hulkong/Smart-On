<template>
  <div class="_popup_question" :class="position">
    <div class="_popup_question_container">
      <div v-if="closeBtn" class="_popup_question_close" @click="close">닫기</div>
      <div v-if="title.length > 0" class="_popup_question_header">
        <div class="_popup_question_title">{{ title }}</div>
      </div>
      <div class="_popup_question_data_container" v-if="contents.length > 0">
        <div class="_popup_question_data_block">
          <div v-for="(text, index) in contents" :key="index" class="_popup_question_data_value">
            <p class="_sub" v-show="text.indexOf('@') >= 0">&middot; {{ text.split('@')[1] }}</p>
            <p class="_real" v-show="text.indexOf('@') < 0">{{ text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ""
    },
    contents: {
      type: Array,
      required: false,
      default: () => []
    },
    position: {
      type: String,
      required: false,
      default: "top right"
    },
    closeBtn: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    close(event) {
      this.$el.style.visibility = "hidden";
    }
  }
};
</script>
<style scoped>
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

._popup_question >>> p._real {
  float: left !important;
}

._popup_question >>> ._popup_question_container {
  background-color: rgb(255, 255, 255);
  padding: 6px;
  width: -moz-max-content;
  width: -webkit-max-content;
  width: -o-max-content;
}

._popup_question >>> ._popup_question_header {
  position: relative;
  z-index: 1;
}

._popup_question >>> ._popup_question_title {
  color: black;
  vertical-align: top;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  z-index: 1;
  font-size: 16px;
  font-weight: bold;
  line-height: 17px;
  padding: 3px;
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

._popup_question >>> ._popup_question_close {
  cursor: pointer;
}
</style>