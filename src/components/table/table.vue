<template>
  <div id="verticalTable">
    <table>
      <!-- <tr>
          <td>공공질서 및 안전</td>
          <td>
            <select name id @change="onChange($event)">
              <option value>1인당 CCTV 설치대수</option>
              <option value>test</option>
            </select>
          </td>
      </tr>-->
    </table>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "verticalTable",

  data() {
    return {
      headers: [],
      contents: []
    };
  },

  computed: {
    ...mapState("commonstore", ["f23title", "f23contents"])
  },

  methods: {
    makeHeader(data) {
      console.log(data);

      const element = this.$el;
      let tbody = document.createElement("tbody");
      let trs = [];
      let targetTbody = element.querySelector("table");

      for (let i = 0, max = data.length; i < max; i++) {
        trs[i] = "<tr>";
        trs[i] += "<td>" + data[i]["cd_nm"] + "</td>";
        trs[i] += '<td class="select"></td>';
        trs[i] += "</tr>";
      }

      tbody.innerHTML = trs.join("");

      targetTbody.appendChild(tbody);

      this.makeBody();
    },

    /**
     * @description 테이블바디 만드는 메소드
     * @param {Array data} 데이터
     */
    makeBody() {
      const element = this.$el;
      let trs = [];
      let selectbox = element.getElementsByClassName("select");

      for (let i = 0, max = selectbox.length; i < max; i++) {
        this.getData(this.f23contents["dataURL"], {
          gcode: "indx"
        }).then(result => {
          let select = document.createElement("select");
          let option = "";

          result["data"].reduce((acc, v, i) => {
            option +=
              '<option value="' +
              v["groupcd"] +
              '">' +
              v["cd_nm"] +
              "</option>";
          }, []);

          select.innerHTML = option;
          select.onchange = this.onChange;
          selectbox[i].appendChild(select);
        });
      }
    },

    // 그리드 삭제하는 메소드
    gridRemove(id) {
      if (!id) {
        alert("컴포넌트 아이디가 없습니다!");
        return;
      }

      // let tbody = document.getElementById('table').getElementsByClassName('.tbody');

      // 그리드 삭제
      // tbody.remove();
    },

    onChange(event) {
      this.$emit("trigger");
    }
  },

  created() {},

  mounted() {
    const that = this;

    this.getData(this.f23title["dataURL"], {
      gcode: "realm"
    }).then(result => {
      this.makeHeader(result["data"]);
    });
  }
};
</script>
<style scoped>
#verticalTable {
  position: relative;
  width: 100%;
  height: 100%;
}

#verticalTable table {
  width: 100%;
  height: 100%;
}
</style>