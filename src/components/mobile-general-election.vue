<template>
  <div id="mGeneralElection">
    <div v-show="isShowAlarm" id="alarm">
      <div class="_dataReady">
        <div class="_container">
          <div class="_header"></div>
          <div class="_contents">
            <p
              class="desc"
            >선관위는 국민의 선거권 행사를 보장하기 위해 공직선거법 규정(제49조 12항)에 따라 선거일까지만 등록재산, 병역사항, 세금 납부 및 체납, 범죄경력 등의 후보자 정보 자료를 공개하고 있고,</p>
            <p class="desc">오픈메이트온의 서비스 또한 선거일 이후 중안선거관리위원회 선거통계시스템에서 공개 및 제공하는 정보로 운영됩니다.</p>
          </div>
          <div class="_bottom">
            <button class="_close" @click="clickAlarmClose">닫기</button>
          </div>
        </div>
      </div>
    </div>
    <!--관련기사 시작-->
    <div class="sort_article" v-show="isShowNews">
      <div class="cont_wrap">
        <h1>
          <img
            class="close_btn"
            :src="getImageUrl('mobile/cancel.png')"
            @click="isShowNews = false"
          />
          <dl class="cf">
            <dd>
              <img class="article_icon" :src="getImageUrl('mobile/newspaper_W.png')" />관련기사
            </dd>
            <dt>
              <span class="num">
                <b>{{ nowCandiIdx >= 0 ? candidates[nowCandiIdx]["party_shrt"] : "" }}</b>
                <br />
                기호{{ nowCandiIdx >= 0 ? candidates[nowCandiIdx]["num"] : 0 }}
              </span>
              <span class="name">{{ nowCandiIdx >= 0 ? candidates[nowCandiIdx]["nm"] : "" }}</span>
            </dt>
          </dl>
        </h1>
        <article>
          <ul>
            <li v-for="(item, index) in news" :key="index">
              <span class="link" href="#" @click="moveNews(item.originallink)">
                기사보기
                <img
                  style="position: relative;top: 2px;right: -2px;width: 13px;height: auto;"
                  :src="getImageUrl('mobile/out.png')"
                />
              </span>
              <h3 v-html="item.title"></h3>
              <p>
                <span v-html="item.description"></span>
              </p>
            </li>
          </ul>
        </article>
        <!--.ranking-->
      </div>
      <!--.cont_wrap-->
    </div>
    <!--.sort_article-->
    <!--관련기사 끝-->

    <!--필터 시작-->
    <div class="filter" v-show="isShowFilter">
      <div class="cont_wrap">
        <h1>
          <img
            class="close_btn"
            :src="getImageUrl('mobile/cancel.png')"
            @click="isShowFilter = false"
          />
          <b>후보자 정보</b>
          <span class="refresh" href="#" @click="filterOff">
            <img
              style="width:9px; height:auto;"
              class="refresh"
              :src="getImageUrl('mobile/refresh.png')"
            />
            초기화
          </span>
        </h1>
        <h2>인적사항</h2>
        <ul>
          <div v-for="(item, index) in filterList">
            <li>
              <label @click.prevent.stop="clickFilterLabel($event, item.condition, item.text)">
                <b>{{ item.text.split(' ')[0] }}</b>
                {{ item.text.split(' ')[1] }}
                <img
                  style="width:15px; position:relative; top:2px; left:2px; height:auto;"
                  class="refresh"
                  :src="getImageUrl(item.src)"
                />
              </label>
              <input
                type="radio"
                name="sort_radio"
                class="radios"
                @click="sortCandidates(item.condition, item.text)"
              />
            </li>
            <li v-if="(index + 1) % 2 === 0 && index !== filterList.length - 1" class="row_line"></li>
          </div>
        </ul>
        <!--
        <h2>정책분야</h2>
        <ol>
          <li v-for="(item, index) in filterRealms" :key="index">
            <label
              @click.prevent.stop="clickFilterLabel($event, item.code + '|desc', item.cd_nm)"
            >{{ item.cd_nm }}</label>
            <input
              type="radio"
              name="sort_radio"
              class="radios"
              @click="sortCandidates( item.code + '|desc', item.cd_nm)"
            />
          </li>
        </ol>
        -->
      </div>
      <!--.cont_wrap-->
    </div>
    <!--.filter-->
    <!--필터 끝-->

    <!--content_wrap-->
    <section class="cont_wrap cf">
      <div class="fixed_menu">
        <h1>
          <img
            style=" "
            class="home_btn"
            :src="getImageUrl('mobile/home_arrow.png')"
            @click="moveHome"
          />
          <!-- {{ [getMegaNm, getCityNm, getAdmiNm, getSggNm].join(" ") }} -->
          {{ getSggNm }}
          <kakao-share :showCustomBtn="true"></kakao-share>
        </h1>
        <div class="sort cf">
          <div class="select st04">
            <select class ref="megaSelect" @change="megaChange">
              <option value selected="false">광역시/도</option>
              <option
                v-for="(mega, index) in megas"
                :key="index"
                :value="mega.id"
                :selected="megaCd === mega.id"
              >{{ mega.nm }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
          <div class="select st04">
            <select class ref="citySelect" @change="cityChange" @click="cityClick">
              <option value>시/군/구</option>
              <option
                v-for="(city, index) in citys"
                :key="index"
                :value="city.id"
                :selected="cityCd === city.id"
              >{{ city.nm }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
          <div class="select st04">
            <select class ref="admiSelect" @change="admiChange" @click="admiClick">
              <option value>읍/면/동</option>
              <option
                v-for="(admi, index) in admis"
                :key="index"
                :value="admi.id"
                :selected="admiCd === admi.id"
              >{{ admi.nm }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
        </div>
      </div>
      <!--.fixed_menu-->
      <!--예산 및 사업현황 시작-->
      <div class="budget" v-show="useMenu">
        <h2 class="cf">
          <b>{{ tmpCtyNm2 || getCityNm }}</b>
          <span>예산 및 사업현황</span>
          <span class="standard">{{ voteDate }} 기준</span>
        </h2>
        <div class="keyword_wrap scroll_x_init">
          <div class="keyword cf" :style="getStyleKeyword(businessKeywords)">
            <span v-for="(item, index) in businessKeywords" :key="index">#{{ item }}</span>
          </div>
        </div>
        <h3 class="keyword_tit">사업 주요 키워드</h3>
        <article>
          <h4>
            <span>예산현액</span>
            <b>{{ changeWonUnit(totalBudget) }}</b>
          </h4>
          <ol class="row_graph cf">
            <li
              class="cf"
              v-for="(item, index) in realmBuds"
              :key="index"
              :class="Number(item.width) < 6 ? 'row5' : ''"
            >
              <span>{{ item.vrealm_nm }}</span>
              <div class="bargraph_bg">
                <div class="bargraph">
                  <span class="budget" :style="getStyleBudgetLeft(Number(item.width))">
                    <b>{{ item.rate }}%</b>
                    / {{ changeWonUnit(item.budgetTot) }}
                  </span>
                  <span class="percent" :style="getStyleBudgetRight(Number(item.width))">
                    <b>{{ item.rate }}%</b>
                    / {{ changeWonUnit(item.budgetTot) }}
                  </span>
                </div>
              </div>
            </li>
          </ol>
        </article>
      </div>
      <!--.budget-->

      <!--예산 및 사업현황 끝-->

      <!--분야별 진단 시작-->

      <div class="field" v-show="useMenu">
        <h2 class="cf">
          <b>{{ tmpCtyNm2 || getCityNm }}</b>
          <span>분야별 진단</span>
          <span class="standard">{{ voteDate }} 기준</span>
        </h2>
        <div class="keyword_wrap scroll_x_init">
          <div class="keyword cf" :style="getStyleKeyword(smartKeywords)">
            <span v-for="(item, index) in smartKeywords" :key="index">#{{ item }}</span>
          </div>
        </div>
        <h3 class="keyword_tit">스마트 추천 키워드</h3>
        <div class="radial_graph" style="height:371px;">
          <!--예시임 삭제 하시고 방사형 그래프 삽입하시면 됩니다.-->
          <!-- <img :src="getImageUrl('mobile/radial_ex.png')" /> -->
          <radar :options="radar1" ref="radar1" class="radar1"></radar>
        </div>
      </div>
      <!--.filed-->

      <!--분야별 진단 끝-->

      <!--후보자정보 시작-->
      <div class="onlyregion50" v-show="!useMenu"></div>
      <div class="candidate">
        <h2>
          <b>후보자</b>
          정보
          <span class="hide" href="#" @click="unfoldingAll">
            <img
              style=" position:relative; top:2px; width:13px; height:auto;"
              :src="getImageUrl('mobile/hide.png')"
            />
            전체접기
          </span>
          <span class="filter" href="#" @click="clickFilter">
            <img
              style=" position:relative; top:2px; width:13px; height:auto;"
              :src="getImageUrl('mobile/filter.png')"
            />
            {{ (filterNm==''? '필터': filterNm) }}
          </span>
        </h2>
        <article class="cf cont_wrap">
          <div
            class="dropdown-container"
            v-for="(item, index) in candidates"
            :key="item.num"
            @click="clickCandidate(index, $event)"
          >
            <input type="checkbox" :id="'drop0' + item.num" class="dropdown checkboxes" />
            <label class="cf" :for="'drop0' + item.num">
              <dl class="default">
                <dd>
                  <div class="candidate_img">
                    <img :src="getImageUrl(getCandidateImage(item.num))" />
                  </div>
                  <h5>기호{{ item.num }}</h5>
                  <h6 :style="{color:item.party_color}">{{ item.party_shrt }}</h6>
                  <span class="h7">{{ item.nm }}</span>
                </dd>

                <dt>
                  <div>
                    <p
                      v-for="(d1, i1) in item.keyword"
                      :key="i1"
                    >{{ item.size_mb && i1 &lt; 3 ? "#" + d1.kwd : "" }}</p>
                  </div>
                </dt>
              </dl>

              <dl class="on">
                <dd>
                  <div class="candidate_img">
                    <img :src="getImageUrl(getCandidateImage(item.num))" />
                  </div>
                </dd>
                <dt class="cf">
                  <h5>기호{{ item.num }}</h5>

                  <h6>
                    {{ item.age }}세 /
                    <strong class="male">{{ item.gender }}</strong>
                    <!-- 여자일때 <strong class="female">여</strong>-->
                  </h6>
                  <span class="h7" :style="{color:item.party_color}">{{ item.party_shrt }}</span>

                  <span class="h8">{{ item.nm }}</span>
                  <span class="fortune">
                    <b>재산 )</b>
                    선거일까지 공개
                    <!-- {{ numberWithCommas(item.prpt) }} 천원 -->
                  </span>
                  <span class="career01" v-html="item.career"></span>
                </dt>
              </dl>
            </label>
            <ul class="content">
              <li class="btn">
                <span
                  class="book"
                  href="#"
                  :class="item.size_mb != null ? 'book' :'non_book'"
                  @click="openPledge(item.img_nm, item.size_mb)"
                >
                  공약집보기
                  <img
                    style=" position:relative; top:2px; width:13px; height:auto;"
                    :src="item.size_mb != null ? getImageUrl('mobile/out.png') : getImageUrl('mobile/out_non.png')"
                  />
                </span>

                <span
                  :class="Number(item.newsLen) > 0 ? 'article' : 'non_article'"
                  href="#"
                  @click="openNews(index)"
                >
                  <img
                    style=" position:relative; top:2px; width:13px; height:auto;"
                    :src="Number(item.newsLen) > 0 ? getImageUrl('mobile/newspaper.png') : getImageUrl('mobile/newspaper_non.png')"
                  /> 관련기사
                </span>

                <!-- <span
                  :class="Number(item.crime) > 0 ? 'crime' :'non_crime'"
                  @click="openCrime(item.crime, item.img_nm)"
                >
                  전과 {{ item.crime }}건
                  <img
                    style=" position:relative; top:2px; width:13px; height:auto;"
                    :src="Number(item.crime) > 0 ? getImageUrl('mobile/out.png') : getImageUrl('mobile/out_non.png')"
                  />
                </span>-->
                <span class="crime" @click="isShowAlarm = true">
                  전과기록
                  <img
                    style="position:relative; top:2px; width:13px; height:auto;"
                    :src="getImageUrl('mobile/out.png')"
                  />
                </span>
              </li>
              <li class="graph">
                <span class="h8">
                  <b>공약집</b>분야별 그래프
                </span>
                <div class="radial_graph">
                  <!-- 예시임 삭제 하시고 방사형 그래프 삽입하시면 됩니다.-->
                  <!-- <img
                    style="width:80%; margin-left:6%; height:auto;"
                    :src="getImageUrl('mobile/radial_ex02.png')"
                  />-->

                  <radar :options="radar3" ref="radar2" class="radar2" :class="'radar_' + index"></radar>
                </div>

                <span class="h8" :class="item.keyword.length == 0 ? 'off' :''">
                  <b>공약집</b>주요 키워드
                </span>
                <div class="keyword_wrap" :class="item.keyword.length == 0 ? 'off' :''">
                  <div class="keyword cf" :style="getStyleKeyword(item.keyword)">
                    <span v-for="(d2, i2) in item.keyword" :key="i2">#{{ d2.kwd }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <!--후보자정보 끝-->
    </section>
    <!--.cont_wrap-->
  </div>
  <!--#mGeneralElection-->
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Radar from "@/components/chart-radar-type2";
import KakaoShare from "@/components/kakao-share";
import querystring from "querystring";
export default {
  name: "mGeneralElection",
  data() {
    return {
      isShowAlarm: false,
      tmpCtyNm1: "",
      tmpCtyNm2: "",
      tmpCtyCd: -1,
      isShowFilter: false, // 필터 레이어 보임 여부
      isShowNews: false, // 기사 레이어 보임 여부
      nowCandiIdx: -1,
      filterNm: "", // 선택한 필터명
      useMenu: true, //제주시일때만 메뉴 숨김
      filterList: [
        {
          condition: "birth|asc",
          text: "연령 높음",
          src: "mobile/down.png"
        },
        {
          condition: "birth|desc",
          text: "연령 낮음",
          src: "mobile/up.png"
        },
        {
          condition: "prpt|desc",
          text: "재산 많음",
          src: "mobile/down.png"
        },
        {
          condition: "prpt|asc",
          text: "재산 적음",
          src: "mobile/up.png"
        },
        {
          condition: "crime|desc",
          text: "전과 많음",
          src: "mobile/down.png"
        },
        {
          condition: "crime|asc",
          text: "전과 적음",
          src: "mobile/up.png"
        }
      ]
    };
  },

  components: {
    radar: Radar,
    "kakao-share": KakaoShare
  },

  computed: {
    ...mapState("generalelectionstore", ["radar1", "radar3"]),

    ...mapGetters("generalelectionstore", {
      megaCd: "getMegaCd",
      cityCd: "getCityCd",
      admiCd: "getAdmiCd",
      sggCd: "getSggCd",
      // isShow: "isShow",
      megas: "getMegas",
      citys: "getCitys",
      admis: "getAdmis",
      sgg: "getSgg",
      candidates: "getCandidates",
      news: "getNews",
      voteDate: "getVoteDate",
      businessKeywords: "getBusinessKeywords",
      totalBudget: "getTotalBudget",
      realmBuds: "getRealmBuds",
      smartKeywords: "getSmartKeywords",
      filterRealms: "getFilterRealms"
    }),

    /**
     * @description 광역시/도 이름 가져옴
     */
    getMegaNm() {
      const obj = this.megas.filter(item => item.id === this.megaCd)[0];

      if (obj) return obj["nm"];
    },

    /**
     * @description 시군구 이름 가져옴
     */
    getCityNm() {
      const obj = this.citys.filter(item => item.id === this.cityCd)[0];

      if (obj) return obj["nm"];
    },

    /**
     * @description 행정동 이름 가져옴
     */
    getAdmiNm() {
      const obj = this.admis.filter(item => item.id === this.admiCd)[0];

      if (obj) return obj["nm"];
    },

    /**
     * @description 선거구 이름 가져옴
     */
    getSggNm() {
      const obj = this.sgg.filter(item => item.sgg_cd === this.sggCd)[0];

      if (obj) {
        return obj["sgg_name"];
      } else {
        return this.getCityNm;
      }
    }
  },

  methods: {
    ...mapMutations("generalelectionstore", [
      "setShowMobile",
      "setMegaCd",
      "setCityCd",
      "setAdmiCd",
      "setSggCd"
    ]),
    ...mapActions("generalelectionstore", [
      "setAsyncMegas",
      "setAsyncCitys",
      "setAsyncAdmis",
      "setSggAdmiList",
      "setAsyncCandidates",
      "setAsyncNews",
      "setAsyncVoteDate",
      "setAsyncBsnsKeywords",
      "setAsyncTotBudget",
      "setAsyncRealmBuds",
      "setAsyncSmartKeywords",
      "setAsyncFilterRealms"
    ]),

    /**
     * @description 스크롤 x 초기화
     */
    scrollXInit() {
      const arr = Array.from(this.$el.getElementsByClassName("scroll_x_init"));

      arr.reduce((acc, v, i) => {
        v.scrollLeft = 0;
      }, []);
    },

    /**
     * @description 예산액 스타일 적용
     * @param {Number} width
     * @returns {Object}
     */
    getStyleBudgetLeft(width = -1) {
      if (width < 0) return;

      const obj = {
        width: width + "%",
        fontSize: "11px"
      };

      if (width === 0) {
        obj["display"] = "none";
      }

      if (width < 52) {
        obj["fontSize"] = 0;
      }

      return obj;
    },

    /**
     * @description 예산 비율 스타일 적용
     * @param {Number} width
     * @returns {Object}
     */
    getStyleBudgetRight(width = -1) {
      if (width < 0) return;

      const obj = {
        fontSize: "11px",
        display: "block"
      };

      if (width >= 52) {
        obj["display"] = "none";
      }

      return obj;
    },

    /**
     * @description 키워드 스타일 적용
     * @param {Number} width
     * @returns {Object}
     */
    getStyleKeyword(data = []) {
      if (data.length == 0) return;

      let width = 0;

      // 전체 앞뒤 padding : 5 *2
      // 각 단어 앞뒤 padding : 8*2
      // 각 단어 뒤 margin : 10
      // 폰트 11
      // '#', ' ' -> 0.5개로
      data.map((v, i) => {
        if (i == 0) width += 5 * 2;

        // 문자 배열일 경우
        if (typeof v == "string") {
          // 전체 글짜에 맞는 width
          width += (v.length + 1) * 11 + 8 * 2 + 10;
          // 띄어쓰기 개수별 사이즈 제외
          let blank = v.match(/ /g) == null ? 0 : v.match(/ /g).length;
          width = width - blank * 11;
        } else {
          width += 10; //  후보자 상세보기 영역 앞의 padding 값이 더 있어요

          // 이중배열일 경우
          if (v["kwd"] !== undefined && v["kwd"] != null) {
            // 전체 글짜에 맞는 width
            width += (v["kwd"].length + 0.5) * 11 + 8 * 2 + 10;
            // 띄어쓰기 개수별 사이즈 제외
            let blank =
              v["kwd"].match(/ /g) == null ? 0 : v["kwd"].match(/ /g).length;
            width = width - blank * 11;
          } else {
            width = 20000;
          }
        }
      });

      if (width == 0) width = 20000;

      const obj = {
        width: width + "px"
      };

      return obj;
    },

    /**
     * @description 후보자 클릭 이벤트
     * @param {Number} index 후보자 배열 인덱스
     * @param {Event} event
     */
    clickCandidate(index = -1, event) {
      if (index < 0) return;

      const isChecked = event.target.checked;
      const that = this;

      if (!isChecked) return;

      // this.nowCandiIdx = index;

      // const candidate = this.candidates[index];
      // const cleanData = this.radarCleanData(candidate); // 정제 데이터
      // setTimeout(() => {
      //   that.drawRadar("radar2", cleanData, index); // 방사차트 그림
      // }, 1000);
    },

    /**
     * @description 후보자 방사차트 정제
     * @param {Object} data 방사차트 데이터
     * @returns {Array}
     */
    radarCleanData(data) {
      const cleanData = {
        chartData: [],
        axisData: []
      };
      const columns = [
        { code: "ecnm", name: "서민경제" },
        { code: "jb", name: "일자리" },
        { code: "wf", name: "복지" },
        { code: "rev", name: "도시개발" },
        { code: "cnst", name: "신규설치" },
        { code: "trp", name: "교통/도로" }
      ];
      // const tmpArr = [];

      const tmpArr = columns.map((v, i) => {
        const obj = {
          name: v["name"],
          category: v["code"],
          value: data[v["code"]],
          text: ""
          // text: `${data[v["code"]]}`
        };
        // tmpArr.push(obj);
        cleanData["axisData"].push(obj);
        return obj;
      });

      cleanData["chartData"].push(tmpArr);

      return cleanData;
    },

    /**
     * @description 방사차트 그림
     * @param {String} name 레퍼런스 이름
     * @param {Array} data 차트 데이터
     * @param {Number} index 레퍼런스 배열 인덱스
     */
    drawRadar(name = null, data = [], index = 0) {
      if (!name) return;

      if (data.length === 0) return;

      const component = this.$refs[name][index];

      // 컴포넌트가 없으면 리턴
      if (!component) return;

      const options = component.options;

      component.copyData = JSON.stringify(data); // 깊은 복사
      component.remove(); // 컴포넌트에 등록된 차트 제거하기
      component.draw(data, options); // 컴포넌트에 등록된 차트그리기
    },

    /**
     * @description 구글 어낼릭틱스 설정
     * @param {String} category
     * @param {String} action
     */
    setGA(category = null, action = null) {
      if (!category) return;
      if (!action) return;

      const megaNm = this.getMegaNm;
      const cityNm = this.getCityNm;
      const admiNm = this.getAdmiNm;
      const sggNm = this.getSggNm;

      const regionFullNm = [megaNm, cityNm, admiNm, sggNm].join(" ");

      this.$ga.event(category, action, regionFullNm);
    },

    /**
     * @description 알람닫기버튼 클릭
     */
    clickAlarmClose() {
      this.isShowFilter = false;
      this.isShowAlarm = false;
    },

    /**
     * @description 필터버튼 클릭
     */
    clickFilter() {
      this.isShowFilter = true;
      this.isShowAlarm = true;
    },

    /**
     * @description 필터 라벨 클릭
     * @param {Evnet} event
     * @param {String} filter 필터 값
     * @param {String} filterNm 필터 이름
     */
    clickFilterLabel(event, filter = null, filterNm = "") {
      if (!filter) return;

      const target = event.target;

      if (!target.nextElementSibling) return;

      target.nextElementSibling.checked = true;
      this.sortCandidates(filter, filterNm);
    },

    /**
     * @description 후보자 리스트 필터적용
     * @param {String} filter
     */
    sortCandidates(filter = null, filter_nm = "") {
      if (!filter) return;
      const column = filter.split("|")[0];
      const orderby = filter.split("|")[1];

      // 오름차순
      if (orderby === "asc") {
        this.candidates.sort((a, b) => {
          let aVal = Number(a[column]);
          let bVal = Number(b[column]);

          if (isNaN(aVal)) aVal = Number(a[column].replace(/\./g, ""));
          if (isNaN(bVal)) bVal = Number(b[column].replace(/\./g, ""));

          let result = aVal < bVal ? -1 : aVal > bVal ? 1 : sortByNum(a, b);
          return result;
        });

        // 내림차순
      } else {
        this.candidates.sort((a, b) => {
          let aVal = Number(a[column]);
          let bVal = Number(b[column]);

          if (isNaN(aVal)) aVal = Number(a[column].replace(/\./g, ""));
          if (isNaN(bVal)) bVal = Number(b[column].replace(/\./g, ""));

          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        });
      }

      // 기호순으로 정렬(올림차순)
      function sortByNum(a, b) {
        return Number(a["num"]) < Number(b["num"])
          ? -1
          : Number(a["num"]) < Number(b["num"])
          ? 1
          : 0;
      }

      this.isShowFilter = false;
      this.unfoldingAll();
      // 필터 버튼명 변경
      this.filterNm = filter_nm;
    },

    moveNews(url = null) {
      if (!url) return;

      window.open(url, ""); // 새창에서 열림
    },

    /**
     * @description 공약집 PDF 열기
     * @param {String} fileName 파일명
     * @param {Number} size 파일 사이즈
     */
    openPledge(fileName = undefined, size = null) {
      if (!fileName) return;
      if (!size) return;

      if (
        confirm(
          "후보자 공약집은 새 창에서 열리거나, 다운로드 됩니다.\nWi-Fi 접속 환경을 권장드립니다.\n(파일 크기: " +
            size +
            "MB)"
        )
      ) {
        window.open(
          "http://dev.openmate-on.co.kr/pdf/pledge/" + fileName + ".pdf"
        );
        // window.open("/pdf?" + query, ""); // 새창에서 열림
      }
    },

    /**
     * @description 범죄 PDF 열기
     * @param {Number} crimeCnt 범죄건수
     * @param {String} fileName 파일명
     */
    openCrime(crimeCnt = 0, fileName = undefined) {
      if (crimeCnt <= 0) return;
      if (!fileName) return;
      window.open(
        "http://dev.openmate-on.co.kr/pdf/crime/" + fileName + ".pdf"
      );
    },

    /**
     * @description 관련기사 레이어 열기
     * @param {Number} index 선택된 후보자 인덱스
     */
    openNews(index = -1) {
      if (index < 0) return;

      // const index = this.nowCandiIdx;
      const data = this.candidates[index];
      const candiNm = data["nm"];
      const party = data["party"];
      const newsLen = data["newsLen"];

      if (newsLen === 0) return;

      this.nowCandiIdx = index;
      this.isShowNews = true;
      this.setAsyncNews({
        candiNm: candiNm,
        party: party,
        sPage: 1
      });
    },

    /**
     * @description 후보자 사진 가져옴
     * @param {Number} number 기호
     */
    getCandidateImage(number) {
      return "candidates/" + this.sggCd + "_" + number + ".jpg";
    },

    /**
     * @description 홈페이지 이동
     */
    moveHome() {
      this.setShowMobile(false);
      this.$router.push("/m");
    },

    /**
     * @description 후보자 리스트 전체 접기 이벤트
     */
    unfoldingAll() {
      const arr = Array.from(this.$el.getElementsByClassName("checkboxes"));

      arr.reduce((acc, v, i) => {
        v.checked = false;
      }, []);
    },

    /**
     * @description 후보자 리스트 전체 접기 이벤트
     */
    filterOff() {
      const arr = Array.from(this.$el.getElementsByClassName("radios"));

      arr.reduce((acc, v, i) => {
        v.checked = false;
      }, []);

      this.sortCandidates("num|asc");
    },

    /**
     * @description 시도 변경하는 메소드
     * @param {Event} event
     */
    megaChange(event) {
      // console.log("change mega!!");
      const megaCd = event.target.value;

      this.setMegaCd(megaCd);
      this.setAsyncCitys(megaCd);
    },

    /**
     * @description 시군구 변경하는 메소드
     * @param {Event} event
     */
    cityChange(event) {
      // console.log("change city!!");
      const cityCd = event.target.value;

      if (
        !event.target.selectedOptions ||
        event.target.selectedOptions.length <= 0
      )
        return;

      this.tmpCtyNm1 = event.target.selectedOptions[0].text;
      this.tmpCtyCd = cityCd;
      this.setAsyncAdmis(cityCd);

      // 화성시 선택시 안내문 alert
      if (cityCd == "41590") {
        alert(
          "봉담읍A : 분천리, 왕림리, 세곡리, 당하리, 마하리, 유리, 덕리, 덕우리, 하가등리, 상기리\n\n 봉담읍B : 상리, 내리, 수영리, 동화리, 와우리, 수기리"
        );
      }
    },

    /**
     * @description 행정동 변경하는 메소드
     * @param {Event} event
     */
    admiChange(event) {
      // console.log("change admi!!");

      const admiCd = event.target.value || -1;
      const that = this;

      if (admiCd < 0) return;

      // 제주도 선택시 일부 메뉴 숨기기
      if (this.megaCd == "50") this.useMenu = false;

      this.setAdmiCd(admiCd);
      this.setCityCd(this.tmpCtyCd);
      this.tmpCtyNm2 = this.tmpCtyNm1;

      // 세션스토리지 행정동코드 저장
      sessionStorage.setItem("admicd", admiCd);
      this.setSggAdmiList(admiCd).then(data => {
        // 세션스토리지 선거구코드 저장
        sessionStorage.setItem("sggcd", data[0]["sgg_cd"]);

        that.setSggCd(data[0]["sgg_cd"]);
        that.refresh(); // 모든 데이터 refresh
      });
    },

    /**
     * @description 시군구 셀렉트박스 클릭 이벤트
     * @param {Event} event
     */
    cityClick(event) {
      // console.log("click city!!");
      const target = event.target;
      const select = this.$refs["megaSelect"];

      if (select.selectedIndex === 0) {
        target.selectedIndex = 0;
        // target.blur();
        // select.focus();
        alert("광역시/도를 선택해 주세요.");
        return;
      }
    },

    /**
     * @description 행정동 셀렉트박스 클릭 이벤트
     * @param {Event} event
     */
    admiClick(event) {
      // console.log("click admi!!");

      const target = event.target;
      const megaSelect = this.$refs["megaSelect"];
      const citySelect = this.$refs["citySelect"];

      if (megaSelect.selectedIndex === 0) {
        target.selectedIndex = 0;
        // target.blur();
        // megaSelect.focus();
        alert("광역시/도를 선택해 주세요.");
        return;
      }

      if (citySelect.selectedIndex === 0) {
        target.selectedIndex = 0;
        // target.blur();
        // citySelect.focus();
        alert("시군구를 선택해 주세요.");
        return;
      }
    },

    /**
     * @description SQL 파라미터 설정하는 메소드
     * @param {Object} query
     * @param {String} name
     */
    setQuery(query, name) {
      if (!query) return;

      if (!name) return;

      // 쿼리스트링 객체 세팅
      for (let key in query) {
        // 시군구코드
        if (key === "ctycd") {
          query[key] = this.cityCd;
        }
      }

      return query;
    },

    /**
     * @description 데이터 리프레시
     */
    refresh() {
      const that = this;
      const sggCd = this.sggCd;
      const cityCd = this.cityCd;
      const megaCd = this.megaCd;

      this.setAsyncCandidates(sggCd).then(data => {
        data.reduce((acc, v, i) => {
          let candidate = that.candidates[i];
          let cleanData = that.radarCleanData(candidate); // 정제 데이터
          that.drawRadar("radar2", cleanData, i);
        }, []);
      });

      this.setAsyncVoteDate();
      this.unfoldingAll();
      this.setAsyncFilterRealms();
      this.filterOff();

      if (megaCd != "50") {
        this.useMenu = true;
        this.setAsyncBsnsKeywords(cityCd);
        this.setAsyncTotBudget(cityCd);
        this.setAsyncRealmBuds(cityCd);
        this.setAsyncSmartKeywords(cityCd);
        this.scrollXInit();

        const target = that.makeChartTargets(["radar1"]);
        that.drawCharts(target, this.setQuery); // target에 포함된 차트들 그리기
      } else {
        this.useMenu = false;
      }
    }
  },

  created() {
    document.documentElement.style.overflowY = "scroll";
  },

  destroyed() {
    sessionStorage.setItem("admicd", -1);
    sessionStorage.setItem("ctycd", -1);
    sessionStorage.setItem("sggcd", -1);
  },

  mounted() {
    const that = this;
    const admiCd = sessionStorage.getItem("admicd");
    const cityCd = sessionStorage.getItem("ctycd");
    const sggCd = sessionStorage.getItem("sggcd");
    const megaCd = admiCd.substring(0, 2);
    // const cityCd = admiCd.substring(0, 5);

    this.tmpCtyCd = cityCd;
    this.setMegaCd(megaCd);
    this.setCityCd(cityCd);
    this.setAdmiCd(admiCd);
    this.setAsyncMegas("N");
    this.setAsyncCitys(megaCd);
    this.setAsyncAdmis(cityCd);

    this.setSggAdmiList(admiCd).then(data => {
      // 세션스토리지 선거구코드 저장
      sessionStorage.setItem("sggcd", data[0]["sgg_cd"]);

      that.setSggCd(data[0]["sgg_cd"]);
      that.refresh(); // 모든 데이터 refresh
    });
  }
};
</script>
<style scoped src="@/assets/css/event/default.css"></style>
<style scoped src="@/assets/css/election/vote.css"></style>
<style scoped src="@/assets/css/election/chart.css"></style>
<style scoped>
#mGeneralElection {
  background: white;
}

#mGeneralElection >>> .onlyregion50 {
  width: 100%;
  height: 100px;
}

#mGeneralElection >>> #alarm {
  display: block;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
}

#mGeneralElection >>> #alarm ._dataReady {
  width: 100%;
  height: 250px;
  margin-top: 250px;
  padding: 0px 18px;
}

#mGeneralElection >>> #alarm ._container {
  height: 100%;
  margin: 0 auto;
  background-color: #521ddb;
  color: white;
  border-radius: 25px;
  padding: 0 12px;
}

#mGeneralElection >>> #alarm ._header {
  text-align: right;
  height: 40px;
}

#mGeneralElection >>> #alarm ._contents {
  height: calc(100% - 90px);
}

#mGeneralElection >>> #alarm ._bottom {
  text-align: center;
  height: 50px;
}

#alarm ._header p {
  text-align: right;
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
  margin-right: 15px;
  margin-top: 11px;
}

#alarm ._dataReady ._container ._contents p {
}

#alarm ._dataReady ._container ._contents .tit {
  font-size: 20px;
  font-weight: bold;
}

#alarm ._dataReady ._container ._contents .desc {
  font-size: 15px;
}

#mGeneralElection >>> #alarm ._bottom ._close {
  border: 2px solid white;
  width: 80px;
  height: 30px;
}
</style>

