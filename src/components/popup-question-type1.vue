<template>
  <div class="_popup_question tri-right border round btm-left-in">
    <div class="_popup_question_contents">
      <p>{{ contents }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: String,
      required: false,
      default: "Input the Data"
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
  position: fixed;
  left: 500px;
  top: 0;
  z-index: 9999;
  background: white;
  display: inline-block;
  width: auto;
  height: auto;
  background-color: white;
}
.border {
  border: 2px solid #666;
}
.round {
  border-radius: 15px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
}

/* Right triangle placed top left flush. */
.tri-right.border.left-top:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -40px;
  right: auto;
  top: -8px;
  bottom: auto;
  border: 32px solid;
  border-color: #666 transparent transparent transparent;
}
.tri-right.left-top:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -20px;
  right: auto;
  top: 0px;
  bottom: auto;
  border: 22px solid;
  border-color: white transparent transparent transparent;
}

/* Right triangle, left side slightly down */
.tri-right.border.left-in:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -40px;
  right: auto;
  top: 30px;
  bottom: auto;
  border: 20px solid;
  border-color: #666 #666 transparent transparent;
}
.tri-right.left-in:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -20px;
  right: auto;
  top: 38px;
  bottom: auto;
  border: 12px solid;
  border-color: white white transparent transparent;
}

/*Right triangle, placed bottom left side slightly in*/
.tri-right.border.btm-left:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: -8px;
  right: auto;
  top: auto;
  bottom: -40px;
  border: 32px solid;
  border-color: transparent transparent transparent #666;
}
.tri-right.btm-left:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: 0px;
  right: auto;
  top: auto;
  bottom: -20px;
  border: 22px solid;
  border-color: transparent transparent transparent white;
}

/*Right triangle, placed bottom left side slightly in*/
.tri-right.border.btm-left-in:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: 36px;
  right: auto;
  top: auto;
  bottom: -24px;
  border: 12px solid;
  border-color: #666 transparent transparent #666;
}
.tri-right.btm-left-in:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: 38px;
  right: auto;
  top: auto;
  bottom: -20px;
  border: 12px solid;
  border-color: white transparent transparent white;
}

/*Right triangle, placed bottom right side slightly in*/
.tri-right.border.btm-right-in:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: 30px;
  bottom: -40px;
  border: 20px solid;
  border-color: #666 #666 transparent transparent;
}
.tri-right.btm-right-in:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: 38px;
  bottom: -20px;
  border: 12px solid;
  border-color: white white transparent transparent;
}
/*
	left: -8px;
  right: auto;
  top: auto;
	bottom: -40px;
	border: 32px solid;
	border-color: transparent transparent transparent #666;
	left: 0px;
  right: auto;
  top: auto;
	bottom: -20px;
	border: 22px solid;
	border-color: transparent transparent transparent white;

/*Right triangle, placed bottom right side slightly in*/
.tri-right.border.btm-right:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -8px;
  bottom: -40px;
  border: 20px solid;
  border-color: #666 #666 transparent transparent;
}
.tri-right.btm-right:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: 0px;
  bottom: -20px;
  border: 12px solid;
  border-color: white white transparent transparent;
}

/* Right triangle, right side slightly down*/
.tri-right.border.right-in:before {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -40px;
  top: 30px;
  bottom: auto;
  border: 20px solid;
  border-color: #666 transparent transparent #666;
}
.tri-right.right-in:after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -20px;
  top: 38px;
  bottom: auto;
  border: 12px solid;
  border-color: white transparent transparent white;
}

/* Right triangle placed top right flush. */
.tri-right.border.right-top:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -40px;
  top: -8px;
  bottom: auto;
  border: 32px solid;
  border-color: #666 transparent transparent transparent;
}
.tri-right.right-top:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: -20px;
  top: 0px;
  bottom: auto;
  border: 20px solid;
  border-color: white transparent transparent transparent;
}

/* talk bubble contents */
._popup_question_contents {
  padding: 1em;
  /* padding: 5px; */
  text-align: left;
  line-height: 1.5em;
}
._popup_question_contents p {
  /* remove webkit p margins */
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
</style>