<template>
  <div id="verticalTable">
    <table>
      <tbody>
        <tr v-for="(item, index) in category" :key="index">
          <td>{{ item.main.realm_nm }}</td>
          <td class="select">
            <v-select
              @change="onChange"
              :items="item.sub.items"
              v-model="item.sub.select"
              class="idx_sel"
              outline
              return-object
              single-line
              :menu-props="{auto:true, offsetY: true}"
            ></v-select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "verticalTable",

  data() {
    return {
      category: []
    };
  },

  computed: {
    ...mapState("commonstore", ["mainIdxDivisionAll"])
  },

  methods: {
    // 그리드 삭제하는 메소드
    remove(id) {
      if (!id) {
        alert("컴포넌트 아이디가 없습니다!");
        return;
      }
    },

    /**
     * @description 셀렉트박스 change 이벤트리스너
     */
    onChange(data) {
      sessionStorage.setItem("realmcd", data.parentcd);
      sessionStorage.setItem("ixdcat", data.realValue1);

      // 이벤트버스 호출
      this.$emit("trigger", data);
    },

    /**
     * @description 대분류 카테고리 배열 생성하는 메소드
     */
    makeMainCategory() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd"); // 시군구 코드
      const endDate = sessionStorage.getItem("end_date"); // 데이터 기준 마지막 일자
      return new Promise((resolve, rejcet) => {
        that
          .getData("/api/diagnose/realmRadarChart", {
            ctycd: ctycd,
            stdrdt: endDate
          })
          .then(result => {
            const data = result["data"];
            const bud = data["bud"];

            if (data.length === 0) return;

            that.category.main = [];

            // 예산 기준 내림차순으로 정렬
            bud.sort((a, b) => {
              const aVal = Number(a.bud);
              const bVal = Number(b.bud);
              return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            });

            bud.reduce((acc, v, i) => {
              Object.keys(data).reduce((acc1, v1, i1) => {
                if (v1 === "bud") return;

                // 예산으로 정렬된 대분류 코드 필터 적용시킨 배열
                const tmpData = data[v1].filter(
                  item => item.realm_cd === v["realm_cd"]
                );

                // 유사 지자체 지수 or 지수 or 전국 지수 설정
                if (v1 === "idx") v["idx_nm"] = tmpData[0]["idx_nm"];
                v[v1 + "_value"] = tmpData[0]["idx_value"];
              });

              // 셀렉트박스 매핑 데이터 초기화
              that.category.push({
                main: v,
                sub: {
                  items: [],
                  select: {}
                }
              });
            }, []);

            resolve();
          });
      });
    },

    /**
     * @description 중분류 카테고리 배열 생성하는 메소드
     */
    makeSubCategory() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd"); // 시군구코드

      return new Promise((resolve, rejcet) => {
        that
          .getData(that.mainIdxDivisionAll["dataURL"], {
            ctycd: ctycd
          })
          .then(result => {
            const data = result["data"];

            if (data.length === 0) return;

            // 내림차순 정렬된 대분류 12개를 기준으로 루프
            that.category.reduce((acc, v, i) => {
              const realmcd = v.main["realm_cd"]; // 대분류코드

              // 예산으로 정렬된 대분류 코드 필터 적용시킨 배열
              let filterArr = data.filter(item => item["parentcd"] === realmcd);

              // 데이터가 없을경우 초기화
              if (filterArr.length === 0) {
                filterArr = [
                  {
                    cd_nm: "준비중입니다.",
                    value: -1
                  }
                ];
              } else {
                // 처음 배열 데이터는 해당 대분류 지수로 설정
                filterArr.unshift({
                  cd_nm: v.main["idx_nm"], // 지수명
                  value: v.main["idx_value"], // 지수
                  simr_value: v.main["idx_simr_value"], // 유사 지자체 지수
                  all_value: v.main["idx_all_value"], // 전국 지수
                  parentcd: realmcd // 대분류 코드
                });
              }

              filterArr.reduce((acc1, v1, i1) => {
                // 선택된 셀렉트값 설정하기위한 변수 세팅
                const obj = {
                  text: v1["cd_nm"], // 지수명
                  value: i1, // 중복을 피하기 위한 독립적인 값
                  idx_simr_value: v1["simr_value"], // 유사 지자체 지수
                  idx_value: v1["value"], // 지수
                  idx_all_value: v1["all_value"], // 전국 지수
                  parentcd: v1["parentcd"] // 대분류 코드
                };

                // 대분류 지수를 가장 처음 선택되도록 함
                if (i1 === 0) {
                  v.sub.select = obj;
                }

                v.sub.items.push(obj);
              }, []);
            }, []);
          });
      });
    }
  },

  created() {},

  mounted() {
    // 대분류 카테고리 설정 후 중분류 카테고리 설정
    this.makeMainCategory().then(this.makeSubCategory);
  }
};
</script>
<style scoped>
#verticalTable {
  position: relative;
  width: 100%;
  height: 100%;
}

#verticalTable >>> table {
  width: 100%;
  height: 100%;
}

#verticalTable >>> table tr td:nth-child(1) {
  font-size: 19px;
  font-weight: bold;
  text-align: center;
  width: 30%;
}

#verticalTable >>> table tr td:nth-child(2) {
  /* font-size: 17px; */
  font-size: 1vmin;
  text-align: left;
  width: 70%;
}

#verticalTable >>> table .select select {
  width: 90%;
  height: 100%;
  padding-left: 5px;
  border: 1px solid black;
}

#verticalTable >>> .v-input.v-text-field {
  height: 40px;
  max-width: 90%;
}

#verticalTable >>> .v-input__slot {
  min-height: auto;
}

#verticalTable >>> .v-input__append-inner {
  margin-top: 0;
}

#verticalTable >>> .v-label {
  top: 9px;
}
</style>