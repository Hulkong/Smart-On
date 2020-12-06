<template>
  <div id="pdfMobile">
    <PDFViewer
      v-bind="{url}"
      @document-errored="onDocumentErrored"
      @document-rendered="onDocumentRendered"
      ref="pdf"
    ></PDFViewer>
  </div>
</template>

<script>
import PDFViewer from "@/components/PDFViewer.vue";

export default {
  name: "app",

  components: {
    PDFViewer
  },

  data() {
    return {
      url: "",
      documentError: undefined
    };
  },

  methods: {
    urlUpdated(url) {
      this.documentError = undefined;
      this.url = url;
    },
    onDocumentRendered(data) {
      const that = this;
      that.$refs["pdf"].updateFit("auto");
    },
    onDocumentErrored(e) {
      this.documentError = e.text;
    }
  },

  created() {
    this.$on("document-rendered", this.onDocumentRendered);
  },

  mounted() {
    const that = this;
    const querys = this.$route.query;
    const directoryNm = querys["dir"] ? querys["dir"] : undefined;
    const file = querys["file"] ? querys["file"] : undefined;

    if (!directoryNm) return;
    if (!file) return;

    // 백엔드 호스트네임
    let backendUrl = location.protocol + "//" + location.host;
    // let backendUrl = "http://dev.openmate-on.co.kr:8481";

    if (location.hostname.indexOf("smart-on.co.kr") >= 0) {
      backendUrl = location.protocol + "//" + location.hostname;
    }

    // this.url = backendUrl + "/static/R_T-test.pdf";
    this.url =
      backendUrl + "/static/pdf/" + [directoryNm, file].join("/") + ".pdf";
  }
};
</script>

<style scoped>
#pdfMobile {
  margin: 0;
  padding: 0;
  background-color: #606f7b;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #62637a;
  height: 100vh;
}

#pdfMobile >>> label.form {
  color: white;
  font-family: Monaco, "Courier New", Courier, monospace;
  font-weight: bold;
  margin-bottom: 2em;
  display: block;
}

#pdfMobile >>> input {
  /* padding: 0.45em; */
  padding: 0;
  text-align: center;
  font-size: 1em;
}
#pdfMobile >>> .error {
  border: 1px solid red;
  background: pink;
  color: red;
  padding: 0.5em 3em;
  display: inline;
}

#pdfMobile >>> a.icon {
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  padding: 3px;
  /* padding: 0.25em; */
  width: 1.5em;
  height: 1.5em;
  font-size: 1.5em;
}

#pdfMobile >>> .box-shadow {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
}

#pdfMobile >>> .overflow-hidden {
  overflow: hidden;
}

@media print {
  body {
    background-color: transparent;
  }
  #app {
    margin: 0;
    padding: 0;
  }
}
</style>
