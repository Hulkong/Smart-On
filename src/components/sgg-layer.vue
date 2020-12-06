<template>
  <div id="sggLayer">
    <div class="cont_wrap">
      <div class="cont01">
        <h1>
          <div class="select06 st05">
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

          <div class="select06 st05">
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

          <nav class="vote_nav">
            <ul class="nav__menu">
              <li class="nav__menu-item">
                {{ getSggObj ? getSggObj.sgg_nm : ""}}
                <ul class="nav__submenu">
                  <li
                    class="nav__submenu-item"
                    v-for="(item, index) in sgg"
                    :key="index"
                    @click="sggChange(item.sgg_cd)"
                  >
                    {{ item.sgg_nm }}
                    <ul class="nav__submenu02">
                      <li class="nav__submenu-item02">{{ item.sgg_name }}</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </h1>
        <div class="top_section cf">
          <div class="section01">
            <h2>
              {{ getCityNm }} 예산 현황
              <img
                :src="getImageUrl('event/information.png')"
                @mouseenter="openQuestionPopup"
                @mouseleave="closeQuestionPopup"
              />
              <popup-question
                :title="getTitle('electionBudget')"
                :contents="getContents('electionBudget')"
                :position="getPosition('electionBudget')"
              ></popup-question>
            </h2>
            <h3>{{ changeWonUnit(totalBudget) }}</h3>
            <ul class="keyworld">
              <li
                v-for="(item, index) in  businessKeywords"
                :key="index"
              >{{ index &lt; 5 ? "#" + item : "" }}&nbsp;</li>
            </ul>
            <span class="standard">{{ voteDate }} 기준</span>
            <ol class="ver_graph">
              <li
                v-for="(item, index) in realmBuds"
                :key="index"
                :class="Number(item.width) < 6 ? 'row5' : ''"
              >
                <div class="bargraph_bg">
                  <div class="bargraph">
                    <span class="budget" :style="{height: item.width + '%'}">
                      <b
                        :style="getStyleBudget(Number(item.width))"
                      >{{ changeWonUnit(item.budgetTot) }}</b>
                    </span>
                    <span class="percent">{{ item.rate }}%</span>
                  </div>
                </div>
                <span>{{ item.vrealm_nm }}</span>
              </li>
            </ol>
          </div>
          <div class="section02">
            <h2>
              {{ getCityNm }} 분야별 진단
              <img
                :src="getImageUrl('event/information.png')"
                @mouseenter="openQuestionPopup"
                @mouseleave="closeQuestionPopup"
              />
              <popup-question
                :title="getTitle('electionDiagnose')"
                :contents="getContents('electionDiagnose')"
                :position="getPosition('electionDiagnose')"
              ></popup-question>
            </h2>
            <!--그래프 들어갈 자리-->
            <div class="radial_graph01" style="width:428px; height:240px;">
              <radar :options="radar2" ref="radar1" class="radar1"></radar>
            </div>
          </div>
        </div>
      </div>
      <div class="cont02">
        <h1>
          <div class="select06 st05">
            <select class @change="sortCandidates">
              <option
                v-for="(item, index) in filterList"
                :key="index"
                :value="item.value"
              >{{ item.name }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
          <h2>
            {{ getSggObj ? getSggObj.sgg_nm+" " : "" }}
            <span style="color:#FBD14B;">
              {{selectedCandiate["num"] !== undefined && Number(selectedCandiate["num"]) > 0 ? "기호"+selectedCandiate["num"]:""}}
              {{selectedCandiate["nm"] !== undefined && Number(selectedCandiate["num"]) > 0 ? " "+selectedCandiate["nm"] : ""}}
            </span>
            후보자 정보
            <img
              @mouseenter="openQuestionPopup"
              @mouseleave="closeQuestionPopup"
              class="kakao_btn"
              :src="getImageUrl('event/information.png')"
            />
            <popup-question
              :title="getTitle('electionCandidate')"
              :contents="getContents('electionCandidate')"
              :position="getPosition('electionCandidate')"
            ></popup-question>
          </h2>
        </h1>
        <div class="bottom_section" id="wrap">
          <ol class="candidate slider slider-nav">
            <VueSlickCarousel v-bind="slickOptions" v-if="candidates.length" ref="carousel">
              <li
                v-for="(item, index) in candidates"
                :class="item.num === selectedCandiate.num ? 'on' : ''"
                :key="item.num"
                @click="clickCandidate(index)"
              >
                <ul>
                  <li
                    class="can_img"
                    :style="{backgroundImage: 'url(' + getImageUrl('candidates/' + sggCd + '_' + item.num + '.jpg') + ')', backgroundSize: 'cover'}"
                  ></li>
                  <li class="can_info01">기호{{ item.num }}</li>
                  <li
                    class="can_info02"
                    :style="{background: item.party_color}"
                  >{{ item.party_shrt }}</li>
                  <li class="can_info03">{{ item.nm }}</li>
                </ul>
              </li>
            </VueSlickCarousel>
            <div class="bg">
              <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </ol>

          <div class="cf bottom_cont" v-if="candidates.length > 0">
            <div
              v-if="isShowGuide"
              style="width:100%; height:343px; background:#000; position:absolute; top:0; left:0; z-index:500; opacity:0.8; "
            >
              <!-- <img style="width:80%; margin-left:10%; height:auto" :src="getImageUrl('event/bar01_w.png')" />-->
              <img
                style="width:80%; margin-left:10%; margin-top:2%; height:auto; opacity:0.5;"
                :src="getImageUrl('event/bar02_w.png')"
              />
              <!-- <img style="width:80%; margin-left:10%; height:auto" :src="getImageUrl('event/bar01_b.png')" />
              <img style="width:80%; margin-left:10%; height:auto" :src="getImageUrl('event/bar02_b.png')" />-->
              <span
                style="color:#fff; font-size:32px; margin-top:20px; display:inline-block; width:100%; text-align:center; "
              >
                후보자를 선택하시면,
                <br />
                <p>후보자별 상세한 정보를 확인하실수 있습니다.</p>
              </span>
            </div>
            <div class="section01">
              <div class="can_des">
                <dl>
                  <dd>출생</dd>
                  <dt>{{ selectedCandiate.birth }} (만 {{ selectedCandiate.age }}세)</dt>
                  <dd>직업</dd>
                  <dt>{{ selectedCandiate.job }}</dt>
                  <dd>경력</dd>
                  <dt
                    v-html="selectedCandiate.career"
                    @mouseenter="openQuestionPopup"
                    @mouseleave="closeQuestionPopup"
                    class="hoverPop"
                  ></dt>
                  <popup3-question :contents="getContents('candidateCareer')"></popup3-question>
                </dl>
                <dl>
                  <dd>재산</dd>
                  <dt>{{ numberWithCommas(selectedCandiate.prpt) }} 천원</dt>
                  <dd>학력</dd>
                  <dt
                    @mouseenter="openQuestionPopup"
                    @mouseleave="closeQuestionPopup"
                    class="hoverPop"
                  >{{ selectedCandiate.acdm_bkgr }}</dt>
                  <popup3-question :contents="getContents('candidateAcdm')"></popup3-question>
                  <dd>전과</dd>
                  <dt>
                    {{ selectedCandiate.crime }} 건
                    <b
                      class="more"
                      v-if="Number(selectedCandiate.crime) > 0"
                      @click="openCrime(selectedCandiate.crime, selectedCandiate.img_nm)"
                    >+ 더보기</b>
                  </dt>
                </dl>
              </div>
              <div class="article">
                <h3>
                  관련기사
                  <span
                    class="right"
                    @click.stop="nextNews(article.sPage, $event)"
                    :class="article.sPage * 3 >= newsTot ? 'off' : ''"
                  >
                    <img :src="getImageUrl('event/arrow_R.png')" />
                  </span>
                  <span
                    class="left"
                    @click.stop="prevNews(article.sPage, $event)"
                    :class="article.sPage === 1 ? 'off' : ''"
                  >
                    <img :src="getImageUrl('event/arrow_L.png')" />
                  </span>
                </h3>
                <dl v-if="candidates.length > 0">
                  <div v-for="(item, index) in news" :key="index">
                    <a :href="item.originallink" target="_blank">
                      <dt class="cf">
                        <b v-html="item.title"></b>
                      </dt>
                      <dd class="cf">
                        <b v-html="item.description"></b>
                        {{ item.pubDate}}
                      </dd>
                    </a>
                  </div>
                </dl>
              </div>
            </div>
            <div class="section02">
              <h3>
                공약집 키워드
                <span
                  class="download"
                  @click="openPledge(selectedCandiate.img_nm, selectedCandiate.size_mb)"
                >
                  공약집 보기
                  <img
                    style="width:15px; height:auto; position:relative; top:3px;"
                    :src="getImageUrl('event/download00.png')"
                  />
                </span>
              </h3>
              <ul v-if="!isShowGuide" class="cf">
                <wordcloud
                  v-show="selectedCandiate.keyword.length > 0"
                  :options="wordcloud1"
                  ref="wordcloud"
                  class="wordcloud"
                ></wordcloud>
                <div
                  v-show="selectedCandiate.keyword.length === 0"
                  style="display:block; width:100%; height:100%; padding-top: 25%; text-align: center;"
                >
                  <div>
                    <p>이 후보자는 공약집 내 텍스트의 길이가 충분하지 않아</p>
                    <p>키워드, 언급량이 제공되지 않습니다.</p>
                  </div>
                </div>
                <!--
                <li
                  class="memu-wrapper bottom"
                  v-for="(item, index) in selectedCandiate.keyword"
                  :key="index"
                  @mouseenter="mouseEnterPledgeKeyword"
                  @mouseleave="mouseLeavePledgeKeword"
                >
                  <div class="menu">
                    <h5>#{{ item.kwd }}</h5>
                  </div>
                  <div class="link">
                    <h5>#{{ item.kwd }}</h5>
                    <span>{{ item.kwd_str }}</span>
                  </div>
                </li>
                <li class="memu-wrapper bottom" @click="openPledge(selectedCandiate.img_nm)">
                  <p
                    style="font-size: 18px;margin-top: 35px;text-align: center;font-weight: bold;"
                  >+더보기</p>
                </li>
                -->
              </ul>
              <ul v-else>
                <img class="_image" :src="getImageUrl('chart/default_chart.png')" alt />
              </ul>
            </div>
            <div class="section03">
              <h2>
                분야별 언급량
                <img
                  :src="getImageUrl('event/information.png')"
                  @mouseenter="openQuestionPopup"
                  @mouseleave="closeQuestionPopup"
                />
                <popup-question
                  :title="getTitle('candidateIndx')"
                  :contents="getContents('candidateIndx')"
                  :position="getPosition('candidateIndx')"
                ></popup-question>
              </h2>
              <!--그래프 들어갈 자리-->
              <div class="radial_graph01" style="width:428px; height:270px;">
                <img
                  v-if="isShowGuide"
                  width="100%"
                  height="100%"
                  :src="getImageUrl('mobile/radial_ex03.png')"
                  alt
                />
                <radar :options="radar3" ref="radar2" class="radar2"></radar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Radar from "@/components/chart-radar-type2";
import SggSelect from "@/components/sgg-select";
import PopupQuestion from "@/components/popup-question-type2"; // question2 팝업 컴포넌트
import PopupQuestion3 from "@/components/popup-question-type3"; // question1 팝업 컴포넌트
import querystring from "querystring";
import Wordcloud from "@/components/chart-wordcloud"; // 워드클라우드 컴포넌트
import VueSlickCarousel from "vue-slick-carousel";

export default {
  name: "sggLayer",

  data() {
    return {
      isShowGuide: true,
      isShow: false,
      selectedCandiate: {},
      filterList: [
        { name: "기호순", value: "num|asc" },
        { name: "연령 높음", value: "birth|asc" },
        { name: "연령 낮음", value: "birth|desc" },
        { name: "재산 많음", value: "prpt|desc" },
        { name: "재산 적음", value: "prpt|asc" },
        { name: "전과 많음", value: "crime|desc" },
        { name: "전과 적음", value: "crime|asc" }
        /*,
        { name: "서민경제", value: "ecnm|desc" },
        { name: "일자리", value: "jb|desc" },
        { name: "복지", value: "wf|desc" },
        { name: "도시개발", value: "rev|desc" },
        { name: "신규설치", value: "cnst|desc" },
        { name: "교통/도로", value: "trp|desc" }
        */
      ],
      article: {
        totCnt: 3,
        sPage: 1
      },
      slickOptions: {
        arrows: true,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 8,
        initialSlide: 0,
        focusOnSelect: false,
        swipeToSlide: false,
        touchMove: false
      }
    };
  },

  components: {
    radar: Radar,
    "sgg-select": SggSelect,
    "popup-question": PopupQuestion, // 질문 팝업창 컴포넌트
    "popup3-question": PopupQuestion3, // 질문 팝업창 컴포넌트2
    VueSlickCarousel: VueSlickCarousel,
    wordcloud: Wordcloud // 워드클라우드 컴포넌트
  },

  computed: {
    ...mapState("generalelectionstore", ["radar2", "radar3", "wordcloud1"]),

    ...mapGetters("generalelectionstore", {
      megaCd: "getMegaCd",
      cityCd: "getCityCd",
      sggCd: "getSggCd",
      megas: "getMegas",
      citys: "getCitys",
      sgg: "getSgg",
      candidates: "getCandidates",
      news: "getNews",
      newsTot: "getNewsTot",
      voteDate: "getVoteDate",
      businessKeywords: "getBusinessKeywords",
      totalBudget: "getTotalBudget",
      realmBuds: "getRealmBuds",
      radars: "getRadars",
      wordclouds: "getCandidKeywords"
    }),

    // 도움말 추가
    ...mapGetters("questionstore", ["getTitle", "getContents", "getPosition"]),

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
     * @description 선거구 객체 가져옴
     */
    getSggObj() {
      const obj = this.sgg.filter(item => item.sgg_cd === this.sggCd)[0];

      if (obj) return obj;
      else return this.sgg[0];
    }
  },

  methods: {
    ...mapMutations("generalelectionstore", [
      "setMegaCd",
      "setCityCd",
      "setSggCd"
    ]),

    ...mapActions("generalelectionstore", [
      "setAsyncMegas",
      "setAsyncCitys",
      "setAsyncAdmis",
      "setAsyncSggsFromCity",
      "setAsyncCandidates",
      "setAsyncNews",
      "setAsyncVoteDate",
      "setAsyncBsnsKeywords",
      "setAsyncTotBudget",
      "setAsyncRealmBuds",
      "setAsyncRadars",
      "setAsyncCandidKeywords"
    ]),

    ...mapActions("questionstore", ["setContents"]),

    /**
     * @description 뉴스기사 다음페이지 이동
     * @param {Number} sPage 시작페이지
     * @param {Event} event
     */
    nextNews(sPage = 0, event) {
      if (sPage * 3 >= this.newsTot) return;

      const candiNm = this.selectedCandiate["nm"];
      const party = this.selectedCandiate["party"];
      const pageNum = Number(sPage) + 1;
      const target = event.target;

      this.article.sPage = pageNum;

      this.setAsyncNews({
        candiNm: candiNm,
        sPage: pageNum,
        totCnt: 3,
        party: party
      });
    },

    /**
     * @description 뉴스기사 이전 페이지 이동
     * @param {Number} sPage 시작페이지
     * @param {Event} event
     */
    prevNews(sPage = 0, event) {
      if (sPage === 0) return;

      const candiNm = this.selectedCandiate["nm"];
      const party = this.selectedCandiate["party"];
      const pageNum = Number(sPage) - 1;
      const target = event.target;

      if (target.classList.contains("off")) return;

      this.article.sPage = pageNum;

      this.setAsyncNews({
        candiNm: candiNm,
        sPage: pageNum,
        totCnt: 3,
        party: party
      });
    },

    /**
     * @description 공약집 키워드 마우스엔터 이벤트
     * @param {Event} event
     */
    mouseEnterPledgeKeyword(event) {
      const element = event.target;

      element.classList.add("open");
    },

    /**
     * @description 공약집 키워드 마우스리브 이벤트
     * @param {Event} event
     */
    mouseLeavePledgeKeword(event) {
      const element = event.target;

      element.classList.remove("open");
    },

    /**
     * @description 예산액 스타일 적용
     * @param {Number} width
     * @returns {Object}
     */
    getStyleBudget(width = -1) {
      if (width < 0) return;

      const obj = {
        display: "block"
      };

      if (width <= 20) {
        obj["display"] = "none";
      }

      return obj;
    },

    /**
     * @description 후보자 클릭 이벤트
     * @param {Number} index 후보자 배열 인덱스
     */
    clickCandidate(index = -1) {
      if (index < 0) return;

      const that = this;
      const candidate = this.candidates[index];
      const sggcd = candidate["sgg_cd"];
      const candiNum = candidate["num"];
      const candiNm = candidate["nm"];
      const party = candidate["party"];
      const cleanData = this.radarCleanData(candidate); // 정제 데이터

      this.isShowGuide = false;
      this.selectedCandiate = candidate;

      // 선택한 후보자의 경력 popup 추가
      let popCareer = { id: "candidateCareer" };
      popCareer.contents = candidate["career"]
        .replace("<br/>", "|")
        .replace(/(<([^>]+)>)/gi, "");
      this.setContents(popCareer);

      // 선택한 후보자의 학력 popup 추가
      let popAcdm = { id: "candidateAcdm" };
      popAcdm.contents = candidate["acdm_bkgr"];
      this.setContents(popAcdm);

      this.carouselIndex = index;

      // 뉴스 데이터 가져오기
      this.article.sPage = 1;
      this.setAsyncNews({
        candiNm: candiNm,
        sPage: 1,
        totCnt: 3,
        party: party
      });

      this.drawChart("radar2", cleanData); // 방사차트 그림

      // 워드 클라우드
      this.setAsyncCandidKeywords({
        sggcd: sggcd,
        num: candiNum
      }).then(data => {
        that.drawChart("wordcloud", data);
      });
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
      const tmpArr = [];

      columns.reduce((acc, v, i) => {
        const obj = {
          name: v["name"],
          category: v["code"],
          value: data[v["code"]],
          // text: `${data[v["code"]]}`
          text: ""
        };
        tmpArr.push(obj);
        cleanData["axisData"].push(obj);
      }, []);

      cleanData["chartData"].push(tmpArr);

      return cleanData;
    },

    /**
     * @description 방사차트 그림
     * @param {String} name 레퍼런스 이름
     * @param {Array} data 차트 데이터
     * @param {Number} index 레퍼런스 배열 인덱스
     */
    drawChart(name = null, data = []) {
      if (!name) return;

      if (data.length === 0) return;

      const component = this.$refs[name];

      // 컴포넌트가 없으면 리턴
      if (!component) return;

      const options = component.options;

      component.copyData = JSON.stringify(data); // 깊은 복사
      component.remove(); // 컴포넌트에 등록된 차트 제거하기
      component.draw(data, options); // 컴포넌트에 등록된 차트그리기
    },

    /**
     * @description 데이터 리프레시
     */
    refresh() {
      const that = this;
      const cityCd = this.cityCd;
      const sggCd = this.sggCd;

      this.setAsyncCandidates(sggCd);
      this.setAsyncVoteDate();
      this.setAsyncBsnsKeywords(cityCd);
      this.setAsyncTotBudget(cityCd);
      this.setAsyncRealmBuds(cityCd);

      this.setAsyncRadars(cityCd).then(data => {
        that.drawChart("radar1", data); // 방사차트 그림
      });
    },

    /**
     * @description 공약집 PDF 열기
     */
    openPledge(fileName = undefined) {
      if (!fileName) return;
      // const data = this.candidates[index];

      // let query = querystring.encode(
      //   {
      //     dir: "pledge",
      //     file: fileName
      //   },
      //   "&"
      // );

      // window.open("http://dev.openmate-on.co.kr:8480/pdf?" + query, ""); // 새창에서 열림
      // window.open("/pdf?" + query, ""); // 새창에서 열림
      window.open(
        "http://dev.openmate-on.co.kr/pdf/pledge/" + fileName + ".pdf"
      );
    },

    /**
     * @description 범죄 PDF 열기
     * @param {Number} crimeCnt 범죄건수
     * @param {String} fileName 파일명
     */
    openCrime(crimeCnt = 0, fileName = undefined) {
      if (crimeCnt <= 0) return;
      if (!fileName) return;
      // const data = this.candidates[index];

      // let query = querystring.encode(
      //   {
      //     dir: "crime",
      //     file: fileName
      //   },
      //   "&"
      // );

      // window.open("http://dev.openmate-on.co.kr:8480/pdf?" + query, ""); // 새창에서 열림
      // window.open("/pdf?" + query, ""); // 새창에서 열림
      window.open("https://smart-on.co.kr/pdf/crime/" + fileName + ".pdf");
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

      sessionStorage.setItem("ctycd", cityCd);

      this.setAsyncSggsFromCity(cityCd).then(data => {
        sessionStorage.setItem("sggcd", data[0]["sgg_cd"]);
        location.reload();
      });
    },

    /**
     * @description 선거구 변경하는 메소드
     * @param {Event} event
     */
    sggChange(sggCd = -1) {
      // console.log("change sgg!!");

      if (sggCd < 0) return;

      this.setSggCd(sggCd);
      this.setGuideData();
      this.refresh();
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
     * @description 후보자 리스트 필터적용
     * @param {String} filter
     */
    sortCandidates(event) {
      const filter = event.target.value;

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

          return aVal < bVal ? -1 : aVal > bVal ? 1 : sortByNum(a, b);
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

      // this.selectedCandiate = this.candidates[0];
    },

    /**
     * @description 가이드레이어 데이터 세팅
     */
    setGuideData() {
      this.isShowGuide = true;
      this.selectedCandiate = {
        num: 0,
        party: "오픈메이트온",
        nm: "스마트온",
        age: "01",
        job: "도시분석가",
        acdm_bkgr: "스마트온 졸업",
        birth: "2020.02.18",
        prpt: 1000000,
        career: "(현) 스마트온 관리자",
        crime: 0,
        party_shrt: "스마트온",
        party_color: "#4d21bc",
        ecnm: 50,
        jb: 50,
        wf: 50,
        rev: 50,
        cnst: 50,
        trp: 50,
        keyword: [
          { kwd: "스마트온" },
          { kwd: "21대" },
          { kwd: "총선" },
          { kwd: "선거일" },
          { kwd: "2020년" },
          { kwd: "4월 15일" },
          { kwd: "마스크착용" },
          { kwd: "투표해요" }
        ]
      };
      this.setAsyncNews({
        candiNm: this.selectedCandiate.nm,
        sPage: 1,
        totCnt: 3,
        party: this.selectedCandiate.party
      });
    }
  },

  created() {},
  destroyed() {
    console.log(this);
  },
  mounted() {
    const sggCd = sessionStorage.getItem("sggcd");
    const cityCd = sessionStorage.getItem("ctycd");
    const megaCd = cityCd.substring(0, 2);

    this.setMegaCd(megaCd);
    this.setCityCd(cityCd);
    this.setSggCd(sggCd);
    this.setAsyncMegas();
    this.setAsyncCitys(megaCd);
    this.setAsyncSggsFromCity(cityCd);
    this.setGuideData();
    this.refresh();
  }
};
</script>

<style scoped>
#sggLayer >>> .slick-slide {
  width: 12.5%;
  float: left;
}

#sggLayer >>> .slick-arrow {
  background: grey;
}

#sggLayer >>> .slick-prev {
  width: 25px;
  height: 100px;
  background: #4d21bc;
}
#sggLayer >>> .slick-next {
  width: 25px;
  height: 100px;
  background: #4d21bc;
}
#sggLayer >>> .slick-disabled {
  background: #ddd;
}
#sggLayer >>> .slick-slider {
  z-index: 3;
}

#sggLayer >>> .hoverPop {
  cursor: default;
}
</style>
<style scoped src="@/assets/css/election/vote_web.css"></style>
<style scoped src="@/assets/css/election/chart.css"></style>