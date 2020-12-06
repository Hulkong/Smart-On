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
          <component
            v-for="(item, index) in searchContents"
            :is="item.name"
            :item="item"
            :key="item.id"
            :name="item.fullName"
          ></component>
        </div>
      </li>
      <li>
        <router-link to="/">
          <img src="@/assets/images/common/ic_home_001_128h.png" alt />
          <span class>Home</span>
        </router-link>
      </li>
      <li>
        <a href="###">
          <img src="@/assets/images/common/ic_question_002_128h.png" alt />
        </a>
        <span class>About</span>
      </li>
      <li>
        <a href="###">
          <img src="@/assets/images/common/ic_message_001_128h.png" alt />
        </a>
        <span class>Contact</span>
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
import { mapState, mapMutations } from "vuex";
export default {
  created: function() {},

  props: {},

  data() {
    return {
      keyword: "",
      searchContents: []
    };
  },

  components: {
    searchContent: {
      template: `<div class="search_contents">{{ name }}</div>`,
      methods: {},
      props: ["name"]
    }
  },

  computed: {
    ...mapState("commonstore", {
      regionList: "regionList"
    }),
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
    searchRegion() {
      let keyword = this.keyword;
      let url = this.regionList["dataURL"] + keyword;

      if (keyword.length === 0) {
        alert("검색어를 입력해 주세요!");
        return;
      }
      this.$common.getData(url).then(result => {
        this.searchContents = [];

        for (let i = 0, max = result["data"].length; i < max; i++) {
          this.searchContents.push({
            id: i,
            fullName: result["data"][i].full_name,
            name: "searchContent"
          });
        }
      });
    }
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
  padding: 15px;
  list-style: none;
}

#nav li {
  margin-bottom: 12px;
  height: 40px;
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
  top: 15px;
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

#nav .search_list {
  position: relative;
  width: 310px;
  left: 57px;
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