<template>
  <div id="pdf">
    <canvas id="the-canvas"></canvas>
  </div>
</template>
<script>
import pdfjsLib from "pdfjs-dist";
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  methods: {},

  created() {},

  mounted() {
    // If absolute URL from the remote server is provided, configure the CORS
    // header on that server.
    // var url =
    //   "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf";

    // 백엔드 호스트네임
    let backendUrl = location.protocol + "//" + location.host;

    if (location.hostname.indexOf("smart-on.co.kr") >= 0) {
      backendUrl = location.protocol + "//" + location.hostname;
    }

    const url = backendUrl + "/static/R_T-test.pdf";

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    // var pdfjsLib = window["pdfjs-dist/build/pdf"];

    // The workerSrc property shall be specified.
    // pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";

    // Asynchronous download of PDF
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(
      function(pdf) {
        console.log("PDF loaded");

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          console.log("Page loaded");

          var scale = 1.5;
          var viewport = page.getViewport({ scale: scale });

          // Prepare canvas using PDF page dimensions
          var canvas = document.getElementById("the-canvas");
          var context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function() {
            console.log("Page rendered");
          });
        });
      },
      function(reason) {
        // PDF loading error
        console.error(reason);
      }
    );
  }
};
</script>

<style scoped></style>