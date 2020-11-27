<template>
  <div class="main">
    <div class="left_half">
      <div class="txt_bx">
        <p class="tit">Smart-ON +</p>
        <p>빅데이터 & 인공지능으로 진단하고 처방하는 도시분석 서비스</p>
      </div>
    </div>
    <div class="right_half">
      <div class="top_menu">
        <span class="menu_item">About</span>
        <span class="menu_item">Contact</span>
      </div>
      <div class="search_area">
        <div class="search_box">
          <input
            type="text"
            class="ipt"
            placeholder="지자체명을 입력하세요. 예) 서울특별시 종로구"
            v-model="keyword"
            @keyup.enter="searchRegion"
            v-focus
          />
          <button @click="searchRegion" class="search_btn" value>검색</button>
        </div>
        <div class="search_list" v-show="isVisibleSearchList">
          <router-link
            v-for="(item, index) in searchContents"
            :key="item.index"
            :to="item.path"
            :fullname="item.fullName"
          >
            <div class="search_contents">{{ item.fullName }}</div>
          </router-link>
        </div>
      </div>
      <div class="bottom_menu">
        <router-link to="/map">
          <button class="search_btn map">지도에서 선택하기</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import querystring from "querystring";

export default {
  data() {
    return {
      keyword: "",
      searchContents: []
    };
  },

  components: {},

  computed: {
    ...mapState("commonstore", {
      regionList: "regionList"
    }),

    /**
     * @description 검색리스트 시각 존재 여부
     * @returns {Boolean flag} 시각 존재여부
     */
    isVisibleSearchList() {
      // 검색결과가 존재할 경우 검색리스트 숨김
      if (this.searchContents.length === 0) return false;
      // 검색결과가 존재할 경우 검색리스트 보임
      else return true;
    }
  },
  methods: {
    /**
     * @description 지역검색하는 메소드
     */
    searchRegion() {
      let keyword = this.$data.keyword; // 입력된 키워드

      if (keyword.length === 0) {
        alert("검색어를 입력해 주세요!");
        return;
      }

      let nowDate = this.getDate("yyyymmdd"); // 현재시간
      let query = querystring.encode(
        // 쿼리스트링
        {
          // edate: nowDate.join(""), // 기준 마지막 날짜
          // sdate: nowDate[0] + nowDate[1] + "01" // 기준 시작 날짜
          edate: "20191031", // 기준 마지막 날짜
          sdate: "20191001" // 기준 시작 날짜
        },
        "&"
      );
      let searchUrl = this.regionList["dataURL"] + keyword; // 지역 검색결과 URL
      let reportUrl = "/report/cityStatus?" + query; // 리포트 URL

      // 지역 검색결과 가져옴
      this.getData(searchUrl).then(result => {
        this.searchContents = []; // 검색결과 담을 배열

        // 필요 데이터 정제
        for (let i = 0, max = result["data"].length; i < max; i++) {
          this.searchContents.push({
            id: result["data"][i].id, // 기본키
            fullName: result["data"][i].full_name, // 지역명
            path: reportUrl + "&ctycd=" + result["data"][i].id // router 필요 path
          });
        }
      });
    }
  },

  // 지시자
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  },

  created() {}
};
</script>
<style scoped>
.main {
  width: 100%;
  height: 100%;
}

.search_box {
  position: relative;
  top: 42%;
  left: 72px;
  right: 0;
  width: 700px;
  height: 37px;
  border-radius: 3px;
  background-color: rgb(242, 242, 242);
  -webkit-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
}

.search_box input[type="text"] {
  float: left;
  width: 508px;
  height: 10px;
  padding: 12px 16px 15px;
  border: 0 none;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  background-color: transparent;
  outline: 0;
}

.search_btn {
  padding: 0;
  float: left;
  width: 145px;
  height: 29px;
  margin: 5px 0;
  border: 0 none;
  cursor: pointer;
  border-radius: 3px;
  background: rgb(53, 91, 184);
  color: white;
}

.search_list {
  position: relative;
  top: 43%;
  left: 72px;
  width: 700px;
  height: 30%;
  border-radius: 3px;
  background-color: rgb(242, 242, 242);
  -webkit-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.search_list >>> .search_contents {
  width: 100%;
  height: 31px;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  padding-top: 17px;
  vertical-align: middle;
  border-bottom: 1px solid rgb(177, 178, 177);
}

.search_list >>> .search_contents:hover {
  background: rgb(54, 72, 120);
  cursor: pointer;
  color: white;
}

.search_btn.map {
  float: right;
  margin-right: 99px;
  width: 180px;
}
</style>