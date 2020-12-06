<template>
  <!-- side menu -->
  <div id="nav" :class="{ on: isNarrow }">
    <ul>
      <li>
        <a href="###">
          <img src="@/assets/images/common/ic_search_001_128h.png" alt />
        </a>
        <div class="search_box" v-show="!isNarrow">
          <input
            type="text"
            class="ipt"
            placeholder="지자체명을 입력하세요."
            v-model="keyword"
            @keyup.enter="searchRegion"
          />
          <button @click="searchRegion" class="search_btn" value>검색</button>
        </div>
      </li>
      <li v-show="activeSearch">
        <div class="search_list">
          <a v-for="(item, index) in searchContents" :href="item.path" :key="index">
            <div class="search_contents">{{ item.fullName }}</div>
          </a>
        </div>
      </li>
      <li v-show="!isNarrow">
        <div class="search_map">
          <div style="position: absolute; top:10%; width:100%; height: 50%;">
            <vworld></vworld>
          </div>
          <div style="position: absolute; top:60%; width:100%; height: 40%;">
            <div style="position: absolute; width:50%; height: 50%;">
              <p>인구수</p>
              <p>{{ numberWithCommas(navMap.region_pop) }}</p>
            </div>
            <div style="position: absolute; left:50%; width:50%; height: 50%;">
              <p>예산총액</p>
              <!-- <p>{{ numberWithCommas(navMap.budget_tot) }}</p> -->
            </div>
            <div style="position: absolute; top:50%; width:50%; height: 50%;">
              <p>유형</p>
              <p>{{ navMap.region_type }}</p>
            </div>
            <div style="position: absolute; top:50%; left:50%; width:50%; height: 50%;">
              <p>집행률</p>
              <!-- <p>{{ numberWithCommas(navMap.excut_rate) + "%" }}</p> -->
            </div>
          </div>
        </div>
      </li>
      <li>
        <router-link to="/">
          <img src="@/assets/images/common/ic_home_001_128h.png" alt />
          <span>Home</span>
        </router-link>
      </li>
      <li>
        <router-link to="/report/about">
          <img src="@/assets/images/common/ic_question_002_128h.png" alt />
          <span>About</span>
        </router-link>
      </li>
      <li>
        <router-link to="/report/contact">
          <img src="@/assets/images/common/ic_message_001_128h.png" alt />
          <span>Contact</span>
        </router-link>
      </li>
      <li v-show="!isNarrow">
        <div class="footer">
          <p>오픈메이트온</p>
          <p>주소: 서울특별시 중구 청계천로 100, 시그니처타워 서관 9층</p>
          <p>사업자번호: 763-88-01165</p>
          <p>TEL: 02-6956-7541</p>
          <p>FAX: 0505-055-7522</p>
          <p>EMAIL: sales@openmate-on.co.kr</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import querystring from "querystring";
import Vworld from "@/components/map-vworld-leaflet";

export default {
  data() {
    return {
      keyword: "",
      searchContents: [],
      // 네비게이션 데이터
      navMap: {
        region_pop: "", // 인구수
        budget_tot: "", // 예산총액
        region_type: "", // 유형
        excut_rate: "" // 집행률
      }
    };
  },

  components: {
    searchContent: {
      template: `<div class="search_contents">{{ name }}</div>`,
      methods: {},
      props: ["name"]
    },
    vworld: Vworld
  },

  computed: {
    ...mapState("commonstore", ["navData", "regionList"]),
    ...mapState("layoutstore", ["isNarrow"]),
    activeSearch() {
      if (this.isNarrow) {
        return false;
      } else {
        let keyword = this.keyword;

        if (keyword.length === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  },

  methods: {
    /**
     * @description 지역검색하는 메소드
     */
    searchRegion() {
      let keyword = this.keyword; // 입력된 키워드

      if (keyword.length === 0) {
        alert("검색어를 입력해 주세요!");
        return;
      }

      let nowDate = this.getDate("yyyymm"); // 현재시간
      let query = querystring.encode(
        // 쿼리스트링
        {
          edate: nowDate.join(""), // 기준 마지막 날짜
          sdate: nowDate[0] + "01" // 기준 시작 날짜
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
    },

    /**
     * @description 네비게이션 데이터 바인딩
     * @param {Object} data 서버데이터
     */
    setNavData(data) {
      if (data.length === 0) return;

      const that = this;
      Object.keys(data).forEach(key => {
        if (that.$data.navMap[key] === "") that.$data.navMap[key] = data[key];
      });
    }
  },

  created() {},

  mounted() {
    const that = this;
    const ctycd = sessionStorage.getItem("ctycd");

    // 기본현황 데이터 호출 및 세팅
    this.getData(this.navData["dataURL"] + ctycd).then(result => {
      that.setNavData(result["data"]);
    });
  }
};
</script>

<style scoped>
#nav {
  position: absolute;
  /* width: 390px; */
  width: 28%;
  height: calc(100% - 40px);
  top: 40px;
  background-color: #002060;
}

#nav p {
  color: white;
  margin: 0;
  padding: 0;
}

#nav ul {
  margin: 0;
  margin-top: 27px;
  padding: 15px;
  list-style: none;
}

#nav li {
  margin-bottom: 12px;
  height: fit-content;
}

#nav li:nth-child(2) {
  height: 295px;
  /* display: none; */
}

#nav span {
  color: #fff;
  font-size: 20px;
  display: inline-block;
  position: absolute;
  padding: 10px;
  margin-left: 16px;
}

#nav img {
  width: 34px;
}

#nav .search_box {
  position: absolute;
  top: 40px;
  left: 72px;
  right: 0;
  width: 310px;
  height: 37px;
  border-radius: 3px;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
}

#nav .search_box input[type="text"] {
  float: left;
  width: 195px;
  height: 10px;
  padding: 12px 16px 15px;
  border: 0 none;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  background-color: transparent;
  outline: 0;
}

#nav .search_box button {
  padding: 0;
  float: left;
  width: 75px;
  height: 28px;
  margin: 5px 0;
  border: 0 none;
  cursor: pointer;
  background: rgb(53, 91, 184);
}

#nav .search_map {
  position: relative;
  width: 368px;
  height: 295px;
  border-radius: 3px;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  text-align: center;
}

#nav .search_map p {
  color: black;
}

#nav .search_list {
  position: relative;
  width: 368px;
  height: 295px;
  border-radius: 3px;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

#nav .search_list .search_contents {
  width: 100%;
  height: 31px;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  padding-top: 17px;
  vertical-align: middle;
  border-bottom: 1px solid rgb(177, 178, 177);
}

#nav .search_list .search_contents:hover {
  background: rgb(54, 72, 120);
  cursor: pointer;
  color: white;
}

#nav .footer {
  position: absolute;
  left: 55px;
  width: 86%;
  bottom: 15px;
}
</style>