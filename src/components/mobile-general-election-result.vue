!<template>
  <div v-show="true" id="mGeneralElectionResult">
    <div style="position:fixed;width:100%;height:100%;z-index:250;opacity:0.7;background:black;"></div>

    <!--	코로나 팝업 시작	-->
    <div class="map_wrap">
      <header class="map_top cf" style="border-bottom:2px solid #ddd;">
        <a class="home" :href="isMobile ? '###' : '/'" target="_self">
          <img class="logo" :src="getImageUrl('event/cube_icon.gif')" />
        </a>

        <h1>
          <b>제 21 대 국회의원선거</b>
          <strong>결과</strong>
        </h1>
        <!--
        <a class="refresh" href="#none" @click="initZoom">
          <img :src="getImageUrl('event/korea.png')" />전국 현황으로 이동
        </a>
        -->
        <div class="vote_institution">
          <img class="infomation" :src="getImageUrl('event/vote_result_information.png')" />모든 정보는
          <span class="link">
            <a href="http://info.nec.go.kr" target="_blank">
              중앙선거관리위원회
              <img class="link" :src="getImageUrl('event/vote_result_link.png')" />
            </a>
          </span>에서 제공받은 정보를 기반으로 제공됩니다.
        </div>

        <a href="/">
          <img class="close" :src="getImageUrl('event/cancel.png')" />
        </a>
      </header>

      <!--수정 20200316-->
      <section class="hidden_menu cf">
        <article class="map_wrap">
          <div class="map">
            <div v-if="isMobile" class="map_guard"></div>
            <LeafletPolygon
              :layerData="layerData"
              :layerStyle="layerStyle"
              :mousemove="mousemove"
              :mouseover="mouseover"
              :mouseout="mouseout"
              :click="click"
              ref="polygon"
            ></LeafletPolygon>
          </div>
          <div class="map_btn">
            <span
              class="chahge btn"
              :class="isActivePartyChange ? 'on' : ''"
              @click="isActivePartyChange = !isActivePartyChange"
            >정당변화</span>
            <span
              class="cartogram btn"
              :class="isActiveCato ? 'on' : ''"
              @click="isActiveCato = !isActiveCato"
            >Cartogram</span>
          </div>
          <h2>
            <img class="map_tit_img" :src="getImageUrl('event/korea_icon.png')" />
            <span>{{ getMegaNm }}</span>
          </h2>
          <div class="vote_result">
            <div class="time">
              <!-- <img :src="getImageUrl('event/clock.png')" /> -->
              <span>{{ voteRate.length > 0 ? voteRate[0]["nm"] : "전국" }}</span>
            </div>
            <div class="vote_percent">
              <span class="rate">
                <!-- <b>{{ voteRate.length > 0 ? voteRate[0]["nm"] : "전국" }}</b> -->
                <br />투표율
              </span>
              <span class="percent">
                <b>{{ voteRate.length > 0 ? Math.round(voteRate[0]["vt_ratio"] * 10) / 10 : "-" }}</b>
                %
              </span>
            </div>
            <div class="vote_people">
              <b>{{ voteRate.length > 0 ? voteRate[0]["vt_cnt"] : "-" }}</b>
              <br />명이 투표하였습니다.
            </div>
          </div>
          <!--vote_result-->
          <div class="map_legend">
            <img
              :src="isActiveSgg ? getImageUrl('event/map_legend.png') : getImageUrl('event/map_legend02.png')"
            />
          </div>

          <div class="popup" ref="popup">
            <h6>홍천군철원군화천군양구군인제군</h6>
            <dl>
              <dd>
                <img src="#" />
              </dd>
              <dt>
                <b>홍길동</b>
                <strong>민주당</strong>
                <span>62.88%</span>
              </dt>
            </dl>
            <ul>
              <li># 1인가구</li>
              <li># 금융실명제</li>
              <li># 경제</li>
              <li># 종부세</li>
              <li># 1인가구</li>
              <li># 금융실명제</li>
              <li># 경제</li>
              <li># 종부세</li>
            </ul>
          </div>
        </article>

        <div class="top_menu">
          <div class="vote_class_wrap">
            <span class="btn" :class="isActiveSgg ? 'on' : ''" @click="isActiveSgg = true">지역구</span>
            <span class="btn" :class="!isActiveSgg ? 'on' : ''" @click="isActiveSgg = false">비례대표</span>
          </div>
          <div class="select">
            <select @change="megaChange">
              <option value>전국</option>
              <option
                v-for="(mega, index) in megas"
                :key="index"
                :value="mega.id"
                :selected="megaCd === mega.id"
              >{{ mega.nm }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
          <div class="select">
            <select @change="sggChange">
              <option value>선거구</option>
              <option
                v-for="(sgg, index) in sggs"
                :key="index"
                :value="sgg.sgg_cd"
                :selected="sggCd === sgg.sgg_cd"
              >{{ sgg.sgg_name }}</option>
            </select>
            <div class="select__arrow"></div>
          </div>
        </div>
        <!--top_menu-->

        <div class="bottom_menu">
          <p class="graph_txt">
            <strong>{{ getTotalSeat }}</strong>
            <span>{{ getTitle }}</span>
            <img
              v-show="!isActiveSgg && megaCd >= 0"
              class="_question"
              @click="clickQuestion"
              :src="getImageUrl('common/question_16px.png')"
            />
            <popup-question :contents="questionContents" position="top left"></popup-question>
          </p>
          <tooltip ref="tooltip"></tooltip>

          <ul v-show="isActiveSgg" class="row_bar_graph">
            <li
              v-for="(item, index) in sggSeats"
              :key="index"
              :class="'party' + item.party_cd"
              :style="{width: item.width + '%'}"
              @mousemove="showTooltip(item.party, item.seatCnt, item.rate)"
              @mouseleave="closeTooltip"
            >
              <img
                v-show="item.party_cd !== '06' && item.width >= 5"
                class="party_logo"
                :src="getImageUrl('event/party' + item.party_cd + '.png')"
              />
              <span v-show="item.width > 3">
                {{ item.seatCnt }}
                <b :style="{display: item.width < 5 ? 'none' : ''}">석</b>
              </span>
            </li>
          </ul>
          <ul v-show="!isActiveSgg" class="row_bar_graph">
            <li
              v-for="(item, index) in sggPartySeats"
              :key="[item.party_cd, index].join('_')"
              :class="'party' + item.party_cd"
              :style="{width: item.width + '%'}"
              @mousemove="showTooltip(item.party, item.seatCnt, item.rate)"
              @mouseleave="closeTooltip"
            >
              <img
                v-show="item.party_cd !== '06' && item.width >= 6.5"
                class="party_logo"
                :src="getImageUrl('event/party' + item.party_cd + '.png')"
              />
              <span v-show="megaCd < 0 && item.width > 3">
                {{ item.seatCnt }}
                <b :style="{display: item.width < 5 ? 'none' : ''}">석</b>
              </span>
              <span v-show="megaCd >= 0 && item.width > 3">
                {{ Math.round(item.rate * 10) / 10 }}
                <b
                  :style="{display: item.width < 5 ? 'none' : ''}"
                >%</b>
              </span>
            </li>
          </ul>
        </div>
        <!--bottom_menu-->

        <aside class="map_cont_wrap" :class="isMobile && megaCd < 0 ? 'mo_map_height' : ''">
          <!-- 지역구 or 비례대표 메인 -->
          <div
            class="cont_wrap"
            v-show="!isActivePartyChange && megaCd < 0"
            style="text-align:center;"
          >
            <!--img style 변경 20200420 100d-->
            <img
              :src="getImageUrl('event/main1.png')"
              style="width:100%;padding:5%; padding-top:0%;"
            />
          </div>
          <!-- // 지역구 or 비례대표 메인 -->
          <!-- 정당변화 지역구 메인 -->
          <div
            class="cont_wrap"
            v-show="isActivePartyChange && isActiveSgg && megaCd < 0"
            style="text-align:center;"
          >
            <!--img style 변경 20200420 100d-->
            <img
              :src="getImageUrl('event/main3.png')"
              style="width:90%;padding:5%; padding-top:0%;"
            />
          </div>
          <!-- // 정당변화 지역구 메인 -->
          <!-- 정당변화 비례대표 메인 -->
          <div
            class="cont_wrap"
            v-show="isActivePartyChange && !isActiveSgg && megaCd < 0"
            style="text-align:center;"
          >
            <!--img style 변경 20200420 100d-->
            <img
              :src="getImageUrl('event/main2.png')"
              style="width:100%;padding:5%; padding-top:0%;"
            />
          </div>
          <!-- // 정당변화 비례대표 메인 -->

          <div
            class="cont_wrap location_party_table"
            v-show="isActiveSgg && megaCd >=0 && sggCd < 0"
          >
            <h3>
              <img :src="getImageUrl('event/vote_icon02.png')" />
              <span>{{ getMegaNm }}</span>
              <div class="select">
                <select @change="sort">
                  <option value>
                    <img :src="getImageUrl('event/array.png')" />정렬
                  </option>
                  <option
                    v-for="(item, index) in sggSortList"
                    :key="index"
                    :value="item.value"
                  >{{ item.name }}</option>
                </select>
                <div class="select__arrow"></div>
              </div>
            </h3>
            <div class="table">
              <table>
                <colgroup>
                  <col width="40%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>선거구</th>
                    <th>정당</th>
                    <th>이름</th>
                    <th>득표율</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in sggResult"
                    :key="index"
                    :class="'party' + item.party_cd"
                  >
                    <td>{{ item.sgg_nm }}</td>
                    <td>{{ item.party }}</td>
                    <td>{{ item.nm }}</td>
                    <td v-if="isMobile">{{ Math.round(item.vr * 10) / 10 }}%</td>
                    <td v-else>
                      <ol class="row_graph cf">
                        <li class="cf">
                          <div class="bargraph_bg">
                            <div class="bargraph">
                              <span class="budget" :style="getStyleBudget(Number(item.vr + 10))">
                                <b>{{ Math.round(item.vr * 10) / 10 }}%</b>
                              </span>
                              <!-- <span class="percent" :style="getStylePercent(Number(item.vr))">
                                <b>{{ Math.round(item.vr * 10) / 10 }}%</b>
                              </span>-->
                            </div>
                          </div>
                        </li>
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!--.location_party_table-->

          <div class="cont_wrap rate_party_table" v-show="!isActiveSgg && megaCd >=0 && sggCd < 0">
            <h3>
              <img :src="getImageUrl('event/vote_icon02.png')" />
              <span>{{ getMegaNm }}</span>
              <div class="select">
                <select @change="sort">
                  <option value>
                    <img :src="getImageUrl('event/array.png')" />정렬
                  </option>
                  <option
                    v-for="(item, index) in partySortList"
                    :key="index"
                    :value="item.value"
                  >{{ item.name }}</option>
                </select>
                <div class="select__arrow"></div>
              </div>
            </h3>
            <div class="table">
              <table>
                <colgroup>
                  <col width="40%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="20%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>선거구</th>
                    <th>정당</th>
                    <th>득표수</th>
                    <th>득표율</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in sggPartyResult"
                    :key="index"
                    :class="'party' + item.party_cd"
                  >
                    <td>{{ item.sgg_nm }}</td>
                    <td>{{ item.party }}</td>
                    <td>{{ item.vt }}</td>
                    <td v-if="isMobile">{{ Math.round(item.vr * 10) / 10 }}%</td>
                    <td v-else>
                      <ol class="row_graph cf">
                        <li class="cf">
                          <div class="bargraph_bg">
                            <div class="bargraph">
                              <span class="budget" :style="getStyleBudget(Number(item.vr + 10))">
                                <b>{{ Math.round(item.vr * 10) / 10 }}%</b>
                              </span>
                              <!-- <span class="percent" :style="getStylePercent(Number(item.vr))">
                                <b>{{ Math.round(item.vr * 10) / 10 }}%</b>
                              </span>-->
                            </div>
                          </div>
                        </li>
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!--.rate_party_table-->

          <div class="cont_wrap location_party_vs" v-show="isActiveSgg && sggCd >= 0">
            <h3>
              <img :src="getImageUrl('event/vote_icon02.png')" />
              <span v-show="sggCd < 0">{{ getMegaNm }}</span>
              <span v-show="sggCd >= 0">{{ getSggNm }}</span>
            </h3>
            <div v-for="(item, index) in sggCompare" :key="index" :class="'vs0' + (index+ 1)">
              <img v-show="index === 0" class="prize" :src="getImageUrl('event/party_flag.png')" />
              <div class="candidate">
                <img
                  v-show="isActiveSgg"
                  :src="getImageUrl('candidates/' + sggCd + '_' + item.num + '.jpg')"
                />
              </div>
              <div class="candidate_txt">
                <span class="candidate_num">기호 {{ item.num }}번</span>
                <div class="party_logo">
                  <img
                    v-show="item.party_cd !== '06'"
                    :src="getImageUrl('event/party_logo' + item.party_cd + '.png')"
                  />
                  <h3 v-show="item.party_cd === '06'">{{ item.party }}</h3>
                </div>
                <h3>{{ item.nm }}</h3>
              </div>

              <div v-show="index === 0" class="vs">
                <span class="tit">개표완료</span>
                <dl>
                  <dd>{{ sggCompare[0]["vt"] }}표 ({{ Math.round(sggCompare[0]["vr"] * 10) / 10 + '%' }})</dd>
                  <dd>{{ sggCompare[1]["vt"] }}표 ({{ Math.round(sggCompare[1]["vr"] * 10) / 10 + '%' }})</dd>
                  <dt>
                    <span
                      :class="'vs01 party' + sggCompare[0].party_cd"
                      :style="{width: sggCompare[0].rwidth +'%'}"
                    ></span>
                  </dt>
                  <dt>
                    <span
                      :class="'vs02 party' + sggCompare[1].party_cd"
                      :style="{width: sggCompare[1].rwidth +'%'}"
                    ></span>
                  </dt>
                </dl>
                <span class="tit" style="visibility:hidden;">득표율</span>
                <dl style="visibility:hidden;">
                  <dd>{{ Math.round(sggCompare[0]["vr"] * 10) / 10 + '%' }}</dd>
                  <dd>{{ Math.round(sggCompare[1]["vr"] * 10) / 10 + '%' }}</dd>
                  <dt>
                    <span
                      :class="'vs01 party' + sggCompare[0].party_cd"
                      :style="{width: sggCompare[0].rwidth +'%'}"
                    ></span>
                  </dt>
                  <dt>
                    <span
                      :class="'vs02 party' + sggCompare[1].party_cd"
                      :style="{width: sggCompare[1].rwidth +'%'}"
                    ></span>
                  </dt>
                </dl>
                <h4>
                  표차
                  <b>{{ item.vd2 }}</b>
                </h4>
                <h4>
                  득표율차
                  <b>{{ Math.round(item.vd * 10) / 10 }}%</b>
                </h4>
                <h5>
                  제 21 대
                  <br />국회의원 선거
                </h5>
                <img class="ballotbox" :src="getImageUrl('event/ballotbox.png')" />
              </div>

              <div class="keyword">
                <ul>
                  <li v-for="(d, i) in item.keyword" :key="i"># {{ d }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="cont_wrap location_party_vs" v-show="!isActiveSgg && sggCd >= 0">
            <h3>
              <img :src="getImageUrl('event/vote_icon02.png')" />
              <span v-show="sggCd < 0">{{ getMegaNm }}</span>
              <span v-show="sggCd >= 0">{{ getSggNm }}</span>
            </h3>
            <div v-for="(item, index) in sggPartyCompare" :key="index" :class="'vs0' + (index+ 1)">
              <img v-show="index === 0" class="prize" :src="getImageUrl('event/party_flag1.png')" />
              <div class="candidate">
                <img
                  :style="{backgroundImage: 'url(' + getImageUrl('event/party_logo' + item.party_cd + '.png') + ')'}"
                />
              </div>
              <div class="candidate_txt">
                <h3 v-show="!isActiveSgg" class="rate_party">{{ item.party }}</h3>
              </div>

              <div v-show="index === 0" class="vs">
                <span class="tit">개표완료</span>
                <dl>
                  <dd>{{ sggPartyCompare[0]["vt"] }}표 ({{ Math.round(sggPartyCompare[0]["vr"] * 10) / 10 + '%' }})</dd>
                  <dd>{{ sggPartyCompare[1]["vt"] }}표 ({{ Math.round(sggPartyCompare[1]["vr"] * 10) / 10 + '%' }})</dd>
                  <dt>
                    <span
                      :class="'vs01 party' + sggPartyCompare[0].party_cd"
                      :style="{width: sggPartyCompare[0].rwidth +'%'}"
                    ></span>
                  </dt>
                  <dt>
                    <span
                      :class="'vs02 party' + sggPartyCompare[1].party_cd"
                      :style="{width: sggPartyCompare[1].rwidth +'%'}"
                    ></span>
                  </dt>
                </dl>
                <span class="tit" style="visibility:hidden;">득표율</span>
                <dl style="visibility:hidden;">
                  <dd>{{ Math.round(sggPartyCompare[0]["vr"] * 10) / 10 + '%' }}</dd>
                  <dd>{{ Math.round(sggPartyCompare[1]["vr"] * 10) / 10 + '%' }}</dd>
                  <dt>
                    <span
                      :class="'vs01 party' + sggPartyCompare[0].party_cd"
                      :style="{width: sggPartyCompare[0].rwidth +'%'}"
                    ></span>
                  </dt>
                  <dt>
                    <span
                      :class="'vs02 party' + sggPartyCompare[1].party_cd"
                      :style="{width: sggPartyCompare[1].rwidth +'%'}"
                    ></span>
                  </dt>
                </dl>
                <h4>
                  표차
                  <b>{{ item.vd2 }}</b>
                </h4>
                <h4>
                  득표율차
                  <b>{{ Math.round(item.vd * 10) / 10 }}%</b>
                </h4>
                <h5>
                  제 21 대
                  <br />국회의원 선거
                </h5>
                <img class="ballotbox" :src="getImageUrl('event/ballotbox.png')" />
              </div>

              <div class="keyword">
                <ul>
                  <li v-for="(d, i) in item.keyword" :key="i"># {{ d }}</li>
                </ul>
              </div>
            </div>
          </div>
          <!--.location_party_vs-->
        </aside>
      </section>
    </div>
    <!--.map_wrap-->
    <!--	///코로나 팝업 끝	-->
  </div>
  <!--#popup-event-covid-->

  <!-- </div> -->
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import LeafletPolygon from "@/components/map-leaflet-polygon";
import PopupQuestion from "@/components/popup-question-type2"; // question 팝업 컴포넌트
import Tooltip from "@/components/chart-tooltip";
import wkt from "terraformer-wkt-parser";
export default {
  name: "mapLeaflet",
  data() {
    return {
      isOpenQuestion: false,
      isMobile: false,
      isActivePartyChange: false,
      isActiveCato: false,
      isActiveSgg: true,
      currLayer: {},
      sggSortList: [
        { name: "선거구 내림차순", value: "sgg_nm|desc|string" },
        { name: "선거구 올림차순", value: "sgg_nm|asc|string" },
        { name: "정당 내림차순", value: "party|desc|string" },
        { name: "정당 올림차순", value: "party|asc|string" },
        { name: "이름 내림차순", value: "nm|desc|string" },
        { name: "이름 올림차순", value: "nm|asc|string" },
        { name: "득표율 내림차순", value: "vr|desc|number" },
        { name: "득표율 올림차순", value: "vr|asc|number" }
      ],
      partySortList: [
        { name: "선거구 내림차순", value: "sgg_nm|desc|string" },
        { name: "선거구 올림차순", value: "sgg_nm|asc|string" },
        { name: "정당 내림차순", value: "party|desc|string" },
        { name: "정당 올림차순", value: "party|asc|string" },
        { name: "득표수 내림차순", value: "vt|desc|number" },
        { name: "득표수 올림차순", value: "vt|asc|number" },
        { name: "득표율 내림차순", value: "vr|desc|number" },
        { name: "득표율 올림차순", value: "vr|asc|number" }
      ],
      questionContents: [
        "비례대표 투표율은 무효표를 제외한",
        "전체 투표 수 대비 각 정당별 득표 수를 뜻하며,",
        "소수 둘째자리에서 반올림하여 표현됩니다."
      ],

      // 영역 지도 옵션
      areaOptions: {
        layerStyle: feature => {
          return {
            fillColor: "black",
            weight: 2,
            opacity: 1,
            color: "#000",
            dashArray: null,
            fillOpacity: 0
          };
        },

        clean: data => {
          const tmpData = [];
          data.reduce((acc, v, i) => {
            if (!v.wkt4326) return;

            tmpData.push({
              type: "Feature",
              properties: {
                nm: v["nm"],
                megaCd: v["mega_cd"],
                sggCd: v["sgg_cd"]
              },
              geometry: wkt.parse(v.wkt4326)
            });
          }, []);
          return tmpData;
        },

        mousemove: e => {
          const layer = e.target;

          this.openPopup(e, layer => {
            const props = layer.feature.properties;
            return `<div class="popup2">${props.nm}</div>`;
          });

          layer.setStyle({
            weight: 5,
            color: "#000",
            dashArray: null,
            fillOpacity: 0.7
          });

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
        },
        mouseover: () => 1,
        mouseout: (e, geoJSON) => {
          geoJSON.resetStyle(e.target);
          this.closePopup(e);
        },
        click: e => {
          const layer = e.target;
          const properties = layer.feature.properties;
          const megaCd = properties.megaCd;

          this.setMegaCd(megaCd);
        }
      },

      // 선거구 지도 옵션
      allOptions: {
        layerStyle: feature => {
          return {
            fillColor: feature.properties["color"],
            opacity: 1,
            weight: 0.8,
            color: "#4E4E4E",
            dashArray: null,
            fillOpacity: 1
          };
        },

        clean: data => {
          const tmpData = [];
          data.reduce((acc, v, i) => {
            if (!v.wkt4326) return;

            tmpData.push({
              type: "Feature",
              properties: {
                party: v["party"],
                nm: v["nm"],
                color: v["color"],
                megaCd: v["mega_cd"],
                sggCd: v["sgg_cd"]
              },
              geometry: wkt.parse(v.wkt4326)
            });
          }, []);

          return tmpData;
        },
        mousemove: () => 1,
        mouseover: () => 1,
        mouseout: () => 1,
        click: () => 1
      },

      // 광역시도 선거구 지도 옵션
      megaOptions: {
        layerStyle: feature => {
          return {
            fillColor: feature.properties["color"],
            opacity: 1,
            weight: 1,
            color: "#4E4E4E",
            dashArray: null,
            fillOpacity: 1
          };
        },

        clean: data => {
          const tmpData = [];

          data.reduce((acc, v, i) => {
            if (!v.wkt4326) return;

            tmpData.push({
              type: "Feature",
              properties: {
                party: v["party"],
                num: v["num"],
                nm: v["nm"],
                color: v["color"],
                megaCd: v["mega_cd"],
                sggCd: v["sgg_cd"],
                sggNm: v["sgg_nm"],
                keyword: v["keyword"],
                vr: v["vr"]
              },
              geometry: wkt.parse(v.wkt4326)
            });
          }, []);

          return tmpData;
        },

        mousemove: e => {
          const layer = e.target;
          const props = layer.feature.properties;
          const name = props.nm;
          const party = props.party;
          const keyword = props.keyword;
          const voteRate = Math.round(props.vr * 10) / 10;
          const sggCd = props.sggCd;
          const sggNm = props.sggNm;
          const num = props.num;

          let li = "";
          keyword.reduce((acc, v, i) => {
            li += "<li># " + v + "</li>";
          }, []);

          this.openPopup(
            e,
            `<div class="popup">
          <h6>${sggNm}</h6>
          <dl>
            <dd>
              <img src="${this.getImageUrl(
                "candidates/" + sggCd + "_" + num + ".jpg"
              )}" />
            </dd>
            <dt>
              <b>${name}</b>
              <strong>${party}</strong>
              <span>${voteRate}%</span>
            </dt>
          </dl>
          <ul>
           ` +
              li +
              `
          </ul></div>`
          );
        },
        mouseover: () => 1,
        mouseout: this.closePopup,
        click: (e, geoJSON) => {
          const layer = e.target;
          const properties = layer.feature.properties;
          const sggCd = properties.sggCd;

          this.setSggCd(sggCd);
        }
      },

      // 광역시도 비례대표 지도 옵션
      megaPartyOptions: {
        layerStyle: feature => {
          return {
            fillColor: feature.properties["color"],
            opacity: 1,
            weight: 1,
            color: "#4E4E4E",
            dashArray: null,
            fillOpacity: 1
          };
        },

        clean: data => {
          const tmpData = [];

          data.reduce((acc, v, i) => {
            if (!v.wkt4326) return;

            tmpData.push({
              type: "Feature",
              properties: {
                party: v["party"],
                partyCd: v["party_cd"],
                color: v["color"],
                megaCd: v["mega_cd"],
                sggCd: v["sgg_cd"],
                sggNm: v["sgg_nm"],
                keyword: v["keyword"],
                vr: v["vr"]
              },
              geometry: wkt.parse(v.wkt4326)
            });
          }, []);

          return tmpData;
        },

        mousemove: e => {
          const layer = e.target;

          this.openPopup(e, layer => {
            const props = layer.feature.properties;
            const party = props.party;
            const partyCd = props.partyCd;
            const keyword = props.keyword;
            const voteRate = Math.round(props.vr * 10) / 10;
            const sggNm = props.sggNm;

            let li = "";
            keyword.reduce((acc, v, i) => {
              li += "<li># " + v + "</li>";
            }, []);
            return (
              `<div class="popup">
                <h6>${sggNm}</h6>
                  <dl>
                    <dd>
                      <img style="background-image: url('` +
              this.getImageUrl("event/party_logo" + partyCd + ".png") +
              `');" />
                    </dd>
                    <dt>
                      <b>${party}</b>
                      <span>${voteRate}%</span>
                    </dt>
                  </dl>
                  <ul>` +
              li +
              `</ul>
                </div>`
            );
          });
        },
        mouseover: () => 1,
        mouseout: this.closePopup,
        click: (e, geoJSON) => {
          const layer = e.target;
          const properties = layer.feature.properties;
          const sggCd = properties.sggCd;

          this.setSggCd(sggCd);
        }
      }
    };
  },

  watch: {
    // 지역구 <-> 비례대표
    isActiveSgg() {
      this.setLayerData([]);
      this.drawMap();
      this.refresh();
    },

    // 정당변화 활성/비활성
    isActivePartyChange() {
      this.setLayerData([]);
      this.drawMap();
      this.setSggCd(-1);
      this.refresh();
    },

    // 카토그램 활성/비활성
    isActiveCato() {
      this.setLayerData([]);
      this.drawMap();
    },

    // 광역시도 코드 변경
    megaCd(newVal, oldVal) {
      this.setLayerData([]);
      this.drawMap();
      this.setAsyncSggsFromMega(newVal);
      this.refresh();
    },

    // 선거구 코드 변경
    sggCd(newVal, oldVal) {
      this.fixLayer();
      this.refresh();
    }
  },

  components: {
    LeafletPolygon: LeafletPolygon,
    "popup-question": PopupQuestion, // 질문 팝업창 컴포넌트
    Tooltip: Tooltip
  },

  computed: {
    ...mapGetters("generalelectionresultstore", {
      layerData: "getLayerData",
      layerStyle: "getLayerStyle",
      mousemove: "getMousemove",
      mouseover: "getMouseover",
      mouseout: "getMouseout",
      click: "getClick",
      megas: "getMegas",
      sggs: "getSggs",
      megaCd: "getMegaCd",
      sggCd: "getSggCd",
      sggSeats: "getSggSeats",
      sggResult: "getSggResult",
      sggCompare: "getSggCompare",
      sggPartySeats: "getSggPartySeats",
      sggPartyResult: "getSggPartyResult",
      sggPartyCompare: "getSggPartyCompare",
      voteRate: "getVoteRate"
    }),

    /**
     * @description 총 의석수 가져옴
     */
    getTotalSeat() {
      // 지역구 활성화
      if (this.isActiveSgg && this.sggSeats.length > 0) {
        return this.sggSeats[0]["sumCnt"];
      }

      // 비례대표 활성화
      if (!this.isActiveSgg && this.sggPartySeats.length > 0) {
        return this.sggPartySeats[0]["sumCnt"];
      }
    },

    /**
     * @description 광역시/도 이름 가져옴
     */
    getMegaNm() {
      const obj = this.megas.filter(item => item.id === this.megaCd)[0];

      if (obj) return obj["nm"];
      else return "전국";
    },

    /**
     * @description 선거구 객체 가져옴
     */
    getSggNm() {
      const obj = this.sggs.filter(item => item.sgg_cd === this.sggCd)[0];

      if (obj) return obj["sgg_nm"];
      else return "";
    },

    getTitle() {
      const isActiveSgg = this.isActiveSgg;
      const megaCd = this.megaCd;

      // 지역구 + 전국
      if (isActiveSgg && megaCd < 0) {
        return "전국 지역구별 정당 의석수";
      }

      // 지역구 + 광역시도
      if (isActiveSgg && megaCd >= 0) {
        return this.getMegaNm + " 지역구별 정당 의석수";
      }

      // 비례대표 + 전국
      if (!isActiveSgg && megaCd < 0) {
        return "전국 비례대표 정당 의석수";
      }

      // 비례대표 + 광역시도
      if (!isActiveSgg && megaCd >= 0) {
        return this.getMegaNm + " 비례대표 정당 득표율";
      }
    }
  },

  methods: {
    ...mapMutations("generalelectionresultstore", [
      "setLayerStyle",
      "setMousemove",
      "setMouseover",
      "setMouseout",
      "setClick",
      "setMegaCd",
      "setSggCd",
      "setSggs",
      "setLayerData",
      "setCurrRequestNm"
    ]),

    ...mapActions("generalelectionresultstore", [
      "setAsyncMegas",
      "setAsyncSggsFromMega",
      "setAsyncAreaMaps",
      "setAsyncSggMaps",
      "setAsyncPartyMaps",
      "setAsyncSggSeats",
      "setAsyncSggResult",
      "setAsyncSggCompare",
      "setAsyncSggPartySeats",
      "setAsyncSggPartyResult",
      "setAsyncSggPartyCompare",
      "setAsyncVoteRate",
      "getAsyncSggMaps"
    ]),

    clickQuestion(event) {
      this.isOpenQuestion = !this.isOpenQuestion;

      if (this.isOpenQuestion) this.openQuestionPopup(event);
      else this.closeQuestionPopup();
    },

    /**
     * @description 기존 선택된 레이어 고정
     */
    fixLayer() {
      const component = this.$refs["polygon"];
      const groupLayers = Array.from(component.getLayers());
      let cLayer = [];

      groupLayers.reduce((acc, v, i) => {
        v.resetStyle(this.currLayer);
        let layers = v.getLayers();
        cLayer = layers.filter(
          item => item.feature.properties["sggCd"] === this.sggCd
        );
      }, []);

      if (cLayer.length === 0) return;

      this.currLayer = cLayer[0];

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        this.currLayer.bringToFront();
      }

      this.currLayer.setStyle({
        weight: 5,
        color: "#000",
        dashArray: "",
        fillOpacity: 1
      });
    },

    /**
     * @description 팝업 열기
     * @param {Event} e
     * @param {Function} content 팝업 내용
     */
    openPopup2(e, content = null) {
      const layer = e.target;
      // console.log(e);

      if (!content) return;

      const popup = this.$refs["popup"];

      popup.innerHTML = "";
      popup.innerHTML = content;
      popup.style.left = e.layerPoint["x"] + "px";
      popup.style.top = e.layerPoint["y"] + "px";

      return;
    },

    /**
     * @description 팝업 열기
     * @param {Event} e
     * @param {Function} content 팝업 내용
     */
    openPopup(e, content = null) {
      const layer = e.target;

      if (!content) return;

      const point = e.layerPoint;
      const latlng = this.$refs["polygon"].map.layerPointToLatLng([
        point.x,
        (point.y -= 10)
      ]);

      if (!layer.getPopup()) {
        layer.bindPopup(content);
      }

      if (!layer.getPopup().isOpen()) {
        layer.getPopup().options.closeButton = false;
        layer.getPopup().options.autoPan = false;
        layer.openPopup();
      }

      layer.getPopup().setLatLng(latlng);
    },

    /**
     * @description 팝업 닫기
     */
    closePopup(e) {
      const layer = e.target;

      layer.closePopup();
      layer.unbindPopup();
    },

    /**
     * @description 바차트 툴팁 보임
     * @param {String} party 정당
     * @param {Number} seatCnt 의석수
     * @param {Number} rate 투표율
     */
    showTooltip(party = "", seatCnt = 0, rate = 0) {
      const unit = !this.isActiveSgg && this.megaCd >= 0 ? "표" : "석";
      const data = {
        title: this.getTitle,
        contents: [
          {
            name: `${party}:`,
            value: `${seatCnt} ${unit} ( ${Math.round(rate * 10) / 10}%)`
          }
        ],
        color: "black"
      };

      this.$refs["tooltip"].mouseenter(this.$el, data);
    },

    /**
     * @description 바차트 툴팁 숨김
     */
    closeTooltip() {
      this.$refs["tooltip"].mouseleave(this.$el);
    },

    /**
     * @description 예산액 스타일 적용
     * @param {Number} width
     * @returns {Object}
     */
    getStyleBudget(width = -1) {
      if (width < 0) return;

      const obj = {
        display: "block",
        width: width + "%"
      };

      // if (parseInt(width) > 60) {
      //   obj["fontSize"] = 0;
      // }

      return obj;
    },

    /**
     * @description 예산액 스타일 적용
     * @param {Number} width
     * @returns {Object}
     */
    getStylePercent(width = -1) {
      if (width < 0) return;

      const obj = {
        display: "block"
      };

      if (parseInt(width) <= 60) {
        obj["fontSize"] = 0;
      }

      return obj;
    },

    /**
     * @description 정렬
     * @param {Event}
     */
    sort(event) {
      const filter = event.target.value;
      const isActiveSgg = this.isActiveSgg;
      const column = filter.split("|")[0];
      const orderby = filter.split("|")[1];
      const type = filter.split("|")[2];
      let tmpData = [];

      if (!filter) return;

      if (isActiveSgg) tmpData = this.sggResult;
      // 지역구 활성화
      else tmpData = this.sggPartyResult; // 비례대표 활성화

      // 오름차순
      if (orderby === "asc") {
        // 숫자
        if (type === "number") {
          tmpData.sort((a, b) => {
            let aVal = Number(a[column]);
            let bVal = Number(b[column]);

            if (isNaN(aVal)) aVal = Number(a[column].replace(/\./g, ""));
            if (isNaN(bVal)) bVal = Number(b[column].replace(/\./g, ""));

            if (isNaN(aVal)) aVal = Number(a[column].replace(/\,/g, ""));
            if (isNaN(bVal)) bVal = Number(b[column].replace(/\,/g, ""));

            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          });
        } else {
          tmpData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          });
        }

        // 내림차순
      } else {
        // 숫자
        if (type === "number") {
          tmpData.sort((a, b) => {
            let aVal = Number(a[column]);
            let bVal = Number(b[column]);

            if (isNaN(aVal)) aVal = Number(a[column].replace(/\./g, ""));
            if (isNaN(bVal)) bVal = Number(b[column].replace(/\./g, ""));

            if (isNaN(aVal)) aVal = Number(a[column].replace(/\,/g, ""));
            if (isNaN(bVal)) bVal = Number(b[column].replace(/\,/g, ""));

            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
          });
        } else {
          tmpData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
          });
        }
      }
    },

    /**
     * @description WMS 호출
     * @param {String} name 레이어이름
     * @param {String} style 스타일
     */
    drawWMS(name = "", style = "") {
      if (name.length === 0) return;
      if (style.length === 0) return;

      const that = this;

      return new Promise((resolve, reject) => {
        const url = "https://www.safe-on.co.kr/geoserver/cctv/wms?";
        const component = that.$refs["polygon"];
        const wmsOptions = {
          // layers: "smarteresultprcato",
          // styles: "smarteresult",
          layers: name,
          styles: style,
          format: "image/png",
          transparent: true,
          version: "1.1.1",
          uppercase: true,
          tileSize: 256,
          crossOrigin: false,
          noWrap: true
        };

        component.createWMSLayer(url, wmsOptions).then(() => {
          component.map.fitBounds([
            [34.1080554172753, 125.889049771846],
            [38.608741886375, 129.606819363206]
          ]);
          component.map.setZoom(component.map.getZoom() - 0.5);

          resolve();
        });
      });
    },

    /**
     * @description 지도 그림
     */
    drawMap() {
      const that = this;
      const isActiveSgg = this.isActiveSgg; // 지역구 or 비례대표
      const isActivePartyChange = this.isActivePartyChange; //  정당변화
      const isActiveCato = this.isActiveCato; // 카토그램
      const megaCd = this.megaCd;
      const component = this.$refs["polygon"];
      const params = {
        rgnClss: isActiveCato ? "C21" : "H21",
        diff: isActivePartyChange ? "Y" : "N",
        megaCd: -1,
        options: {}
      };

      if (component.wmsLayer) component.wmsLayer.remove();

      // 전국 + 지역구
      if (megaCd < 0 && isActiveSgg) {
        let layerName = "smarteresult";
        let style = "smarteresult";

        // 카토그램
        if (isActiveCato) {
          layerName = "smarteresultcato";
          style = "smarteresult";
        }

        // 정당변화
        if (isActivePartyChange) {
          layerName = "smarteresult";
          style = "smarteresultY";
        }

        // 정당변화 + 카토그램
        if (isActivePartyChange && isActiveCato) {
          layerName = "smarteresultcato";
          style = "smarteresultY";
        }

        this.drawWMS(layerName, style).then(() => {
          that.setAsyncAreaMaps({
            rgnClss: isActiveCato ? "C1" : "H1",
            currRequestNm: "area",
            options: that.areaOptions
          });
        });
      }

      // 전국 + 비례대표
      if (megaCd < 0 && !isActiveSgg) {
        let layerName = "smarteresultpr"; // 전국
        let style = "smarteresult"; // 기본

        // 카토그램
        if (isActiveCato) {
          layerName = "smarteresultprcato";
          style = "smarteresult";
        }

        // 정당변화
        if (isActivePartyChange) {
          layerName = "smarteresultpr";
          style = "smarteresultY";
        }

        // 정당변화 + 카토그램
        if (isActivePartyChange && isActiveCato) {
          layerName = "smarteresultprcato";
          style = "smarteresultY";
        }

        this.drawWMS(layerName, style).then(() => {
          that.setAsyncAreaMaps({
            rgnClss: isActiveCato ? "C1" : "H1",
            currRequestNm: "area",
            options: that.areaOptions
          });
        });
      }

      // 광역시도 + 지역구
      if (megaCd >= 0 && isActiveSgg) {
        params["currRequestNm"] = "megaSgg";
        params["options"] = this.megaOptions;
        params["megaCd"] = this.megaCd;
        this.setAsyncSggMaps(params).then(() => {
          that.fixLayer();
        });
      }

      // 광역시도 + 비례대표
      if (megaCd >= 0 && !isActiveSgg) {
        params["currRequestNm"] = "megaParty";
        params["options"] = this.megaPartyOptions;
        params["megaCd"] = this.megaCd;
        this.setAsyncPartyMaps(params).then(() => {
          that.fixLayer();
        });
      }
    },

    /**
     * @description 시도 변경하는 메소드
     * @param {Event} event
     */
    megaChange(event) {
      let megaCd = event.target.value;

      if (megaCd.length === 0) {
        megaCd = -1;
        this.setSggs([]);
      }
      this.setMegaCd(megaCd);
      this.setSggCd(-1);
    },

    /**
     * @description 선거구 변경하는 메소드
     * @param {Event} event
     */
    sggChange(event) {
      let sggCd = event.target.value;

      if (sggCd.length === 0) sggCd = -1;

      this.setSggCd(sggCd);
    },

    /**
     * @description 리프레쉬
     */
    refresh() {
      let megaCd = this.megaCd;
      const sggCd = this.sggCd;
      const isActiveSgg = this.isActiveSgg;
      const diff = this.isActivePartyChange ? "Y" : "N";

      if (isActiveSgg) {
        // 지역구 활성화
        if (megaCd < 0 || megaCd.length === 0) megaCd = 99;

        this.setAsyncSggSeats({ megaCd: megaCd, year: 2020 });
        this.setAsyncSggResult({ megaCd: megaCd, year: 2020, diff: diff });
        this.setAsyncSggCompare({ sggCd: sggCd, year: 2020 });
      } else {
        // 비례대표 활성화
        if (megaCd < 0 || megaCd.length === 0) megaCd = 100;

        this.setAsyncSggPartySeats({ megaCd: megaCd, year: 2020 });
        this.setAsyncSggPartyResult({
          megaCd: megaCd,
          year: 2020,
          diff: diff
        });
        this.setAsyncSggPartyCompare({ sggCd: sggCd, year: 2020 });
      }

      this.setAsyncVoteRate({
        megaCd: sggCd >= 0 ? sggCd : megaCd,
        year: 2020
      });
    },

    /**
     * @description 해당 feature 영역 진입
     */
    zoomToFeature(e) {
      const map = this.$refs["polygon"].map;
      map.fitBounds(e.target.getBounds());
    }
  },

  created() {
    const deviceInnerWidth = `${innerWidth}`;
    if (deviceInnerWidth <= 834) {
      document.documentElement.style.overflowY = "scroll";
      document.body.style.height = "auto";
      this.isMobile = true;
    }
  },

  mounted() {
    const that = this;
    this.setAsyncMegas();
    this.drawMap();
    this.refresh();
  }
};
</script>
<style scoped src="@/assets/css/event/sub_main_result.css"></style>
<style scoped src="@/assets/css/event/mobile_result.css"></style>
<style scoped>
#mGeneralElectionResult >>> .leaflet-popup-content {
  width: auto !important;
  margin: 0;
}

#mGeneralElectionResult >>> .leaflet-popup-content .popup {
  border: none !important;
  position: initial !important;
  /* width: auto !important; */
}

#mGeneralElectionResult >>> .leaflet-popup-content .popup2 {
  padding: 5px;
  min-width: 90px;
  font-size: 16px;
  text-align: center;
}

#mGeneralElectionResult >>> ._tooltip_container {
  width: 282px;
}

#mGeneralElectionResult >>> div.location_party_vs div.vs01 div.candidate img,
#mGeneralElectionResult >>> div.location_party_vs div.vs02 div.candidate img {
  border: 3px solid #eee;
  background-size: 90%;
  background-position: center;
}

#mGeneralElectionResult >>> div.map_guard {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1000;
  background: red;
  opacity: 0;
}
</style>