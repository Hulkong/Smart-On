/**
  @description: 도시현황 컴포넌트
  @childComponents: page1, page2, page3
 */
<template>
  <div id="cityStatus" @wheel="handleMouseWheel($event, isShowTimeLayout)">
    <div class="sections-menu">
      <span
        class="menu-point"
        v-bind:class="{active: activePage == index}"
        v-on:click="clickFullpage(index)"
        v-for="(offset, index) in offsets"
        v-bind:key="index"
      ></span>
    </div>
    <!-- 컨테이너1 -->
    <v-container fluid class="pa-0 ma-0 fullpage third">
      <v-layout class="_parent_layout _parent1" align-center justify-space-between wrap>
        <!-- 기본현황-TITLE -->
        <v-flex md4 class="_layout1">
          <v-card class="_title _top_round_small" style="display:inline-block;">개요</v-card>
          <img
            class="_question"
            @mouseenter="openQuestionPopup"
            @mouseleave="closeQuestionPopup"
            :src="getImageUrl('common/question_16px.png')"
            alt
          />
          <popup-question
            :title="getTitle('cityStatus1')"
            :contents="getContents('cityStatus1')"
            :position="getPosition('cityStatus1')"
          ></popup-question>
        </v-flex>
        <!-- 기본현황-TITLE -->

        <!-- 인구&산업-TITLE -->
        <v-flex md8 class="_layout2">
          <v-card class="_title _top_round_small" style="display:inline-block;">인구&산업</v-card>
          <img
            class="_question"
            @mouseenter="openQuestionPopup"
            @mouseleave="closeQuestionPopup"
            :src="getImageUrl('common/question_16px.png')"
            alt
          />
          <popup-question
            :title="getTitle('cityStatus2')"
            :contents="getContents('cityStatus2')"
            :position="getPosition('cityStatus2')"
          ></popup-question>
        </v-flex>
        <!-- 인구&산업-TITLE -->

        <!-- 기본현황-DATA -->
        <v-flex md4 class="_layout3">
          <!-- 기본현황-TOP -->
          <v-flex md12 class="_top_round" style="height:50%;">
            <v-layout align-center justify-space-between fill-height wrap>
              <!-- LEFT -->
              <v-flex md12 class="_layout_contents _right_round" style="height:100%;">
                <v-card flat>
                  <p class="_title">일반현황</p>
                  <!-- 인구 -->
                  <p>
                    <span class="info_tit">인구:</span>
                    <span
                      v-if="basicStatusView.region_pop"
                      class="info_fr"
                    >{{numberWithCommas(basicStatusView.region_pop) }} 명</span>
                    <span v-else>-</span>
                  </p>
                  <!-- //인구 -->
                  <!-- 인구 순위 -->
                  <p>
                    <span class="info_tit">인구 순위:</span>
                    <span v-if="basicStatusView.region_pop_rnk" class="info_fr">
                      {{numberWithCommas(basicStatusView.region_pop_rnk) }}
                      <span
                        class="union_ft"
                      >/227</span>
                    </span>
                    <span v-else>-</span>
                  </p>
                  <!-- //인구 순위 -->

                  <!-- 면적 -->
                  <p>
                    <span class="info_tit">면적:</span>
                    <span
                      v-if="basicStatusView.region_area"
                      class="info_fr"
                    >{{numberWithCommas(basicStatusView.region_area)}} ㎢</span>
                    <span v-else>-</span>
                  </p>
                  <!-- //면적 -->
                  <!-- 면적 순위 -->
                  <p>
                    <span class="info_tit">면적 순위:</span>
                    <span v-if="basicStatusView.region_area_rnk" class="info_fr">
                      {{numberWithCommas(basicStatusView.region_area_rnk) }}
                      <span
                        class="union_ft"
                      >/227</span>
                    </span>
                    <span v-else>-</span>
                  </p>
                  <!-- // 면적 순위 -->
                  <!-- LEFT -->

                  <!-- RIGHT -->
                  <!-- 행정동 수 -->
                  <p>
                    <span class="info_tit">읍면동 수:</span>
                    <span
                      v-if="basicStatusView.admiCnt"
                      class="info_fr"
                    >{{ numberWithCommas(basicStatusView.admiCnt) }} 개</span>
                    <span v-else>-</span>
                  </p>
                  <!-- 행정동 수 -->

                  <!-- 유형 -->
                  <p>
                    <span class="info_tit">유형:</span>
                    <span
                      v-if="basicStatusView.region_type"
                      class="info_fr"
                    >{{ basicStatusView.region_type }}</span>
                    <span v-else>-</span>
                  </p>
                  <!-- 유형 -->
                </v-card>
              </v-flex>
              <!-- RIGHT -->
            </v-layout>
          </v-flex>
          <!-- 기본현황-TOP -->

          <!-- 기본현황-BOTTOM -->
          <v-flex md12 class="_bottom_round" style="height:50%;">
            <v-layout align-center justify-space-between fill-height wrap>
              <!-- TOP-LEFT -->
              <v-flex
                md6
                class="_layout_contents"
                style="height:50%;padding-right:15px;padding-top:0px;"
              >
                <v-card flat>
                  <p class="_title">자치단체장</p>
                  <p>
                    <span>이름:</span>
                    <span v-if="basicStatusView.boss_nm">{{ " " + basicStatusView.boss_nm }}</span>
                    <span v-else>-</span>
                  </p>
                  <p>
                    <span>소속:</span>
                    <span v-if="basicStatusView.boss_group">{{ " " + basicStatusView.boss_group }}</span>
                    <span v-else>-</span>
                  </p>
                </v-card>
              </v-flex>
              <!-- TOP-LEFT -->

              <!-- TOP-RIGHT -->
              <v-flex md6 class="_layout_contents mayor_img" style="height:50%;padding:0px;">
                <v-card flat>
                  <v-img contain height="100%" :src="getImageUrl(getBossImage)"></v-img>
                </v-card>
              </v-flex>
              <!-- TOP-RIGHT -->

              <!-- BOTTOM -->
              <v-flex
                md12
                class="_bottom _layout_contents _bottom_round"
                style="height:50%;padding-top:15px;"
              >
                <v-card flat>
                  <p>
                    <!-- <span v-if="basicStatusView.career.length > 0">경력:</span>
                    <span v-else>경력: -</span>-->
                  </p>
                  <p v-for="(item, index) in basicStatusView.career" :key="index">{{item}}</p>
                </v-card>
              </v-flex>
              <!-- BOTTOM -->
            </v-layout>
          </v-flex>
          <!-- 기본현황-BOTTOM -->
        </v-flex>
        <!-- 기본현황-DATA -->

        <!-- 인구&산업-DATA -->
        <v-flex md8 class="_layout4">
          <v-flex class="_layout_contents _bottom_round _right_round" fill-height>
            <v-layout align-center justify-space-between fill-height wrap>
              <v-flex md6 fill-height class="_left" style="padding-right:13px;">
                <v-flex class="_top" style="height: 50%; padding-bottom:13px;">
                  <!-- 인구-TITLE -->
                  <v-flex class="_title">연령대별 주민등록인구</v-flex>
                  <!-- 인구-TITLE -->

                  <!-- 인구-피라미드 -->
                  <v-flex style="height:calc(100% - 21px); padding-top:13px;">
                    <pyramid :options="pyramidOptions1" ref="pyramid1"></pyramid>
                  </v-flex>
                  <!-- 인구-피라미드 -->
                </v-flex>

                <v-flex class="_bottom" style="height: 50%; padding-top:13px;">
                  <!-- 산업별 사업체 수-TITLE -->
                  <v-flex class="_title">산업별 사업체 수</v-flex>
                  <!-- 산업별 사업체 수-TITLE -->

                  <!-- 산업별 사업체 수-트리맵 -->
                  <v-flex style="height:calc(100% - 21px); padding-top:13px;">
                    <treemap :options="treemapOptions1" ref="treemap1"></treemap>
                  </v-flex>
                  <!-- 산업별 사업체 수-트리맵 -->
                </v-flex>
              </v-flex>

              <v-flex md6 fill-height class="_right" style="padding-left:13px;">
                <v-flex class="_top" style="height: 50%; padding-bottom:13px;">
                  <!-- 전입/전출 인구-TITLE -->
                  <v-flex class="_title">연령대별 전입 / 전출 인구</v-flex>
                  <!-- 전입/전출 인구-TITLE -->

                  <!-- 전입/전출 인구-피라미드 -->
                  <v-flex style="height:calc(100% - 21px); padding-top:13px;">
                    <pyramid :options="pyramidOptions2" ref="pyramid2"></pyramid>
                  </v-flex>
                  <!-- 전입/전출 인구-피라미드 -->
                </v-flex>
                <v-flex class="_bottom" style="height: 50%; padding-top:13px;">
                  <!-- 사업체 종사자 수-TITLE -->
                  <v-flex class="_title">사업체 종사자 수</v-flex>
                  <!-- 사업체 종사자 수-TITLE -->

                  <!-- 사업체 종사자 수-트리맵 -->
                  <v-flex style="height:calc(100% - 21px); padding-top:13px;">
                    <v-card flat>
                      <treemap :options="treemapOptions2" ref="treemap2"></treemap>
                    </v-card>
                  </v-flex>
                  <!-- 사업체 종사자 수-트리맵 -->
                </v-flex>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-flex>
        <!-- 인구&산업-DATA -->

        <!-- 예산 및 사업현황 -->
        <v-flex md12 class="_layout5">
          <v-layout align-center justify-space-between fill-height wrap>
            <v-flex md2 class="_left _title">
              <v-card flat>
                <v-layout row fill-height align-center>
                  <v-flex class="_text" md12>
                    예산 및
                    <img
                      class="_question"
                      @mouseenter="openQuestionPopup"
                      @mouseleave="closeQuestionPopup"
                      :src="getImageUrl('common/question_16px.png')"
                      alt
                    />
                    <popup-question
                      :title="getTitle('cityStatus3')"
                      :contents="getContents('cityStatus3')"
                      :position="getPosition('cityStatus3')"
                    ></popup-question>
                    <br />사업현황
                  </v-flex>

                  <v-flex md6>
                    <v-img
                      :src="getImageUrl('common/icon_budget_83.png')"
                      width="100%"
                      height="85%"
                      style="position:absolute; top:7px; right:19px;"
                      position="right bottom"
                      contain
                    ></v-img>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex md10 class="_contents _right_round _left_round_small">
              <v-layout align-center justify-space-between fill-height wrap>
                <!-- 올해 기준 총 예산 -->
                <v-flex md4 style="height:100%;">
                  <p class="_title">{{budgetBusi.total.date}} 기준</p>
                  <span>예산 현액</span>
                  <span
                    class="primary--text"
                    v-if="budgetBusi.total.fee"
                  >{{ " " + changeWonUnit(budgetBusi.total.fee) }}</span>
                  <span v-else>-</span>
                </v-flex>
                <!-- 올해 기준 총 예산 -->

                <!-- 올해 기준 집행률 -->
                <v-flex md4 style="height:100%;">
                  <p class="_title">{{budgetBusi.enforce.date}} 기준</p>
                  <span>집행률</span>
                  <span
                    class="primary--text"
                    v-if="budgetBusi.enforce.rate"
                  >{{ " " + numberWithCommas(budgetBusi.enforce.rate) + "%" }}</span>
                  <span v-else>-</span>
                </v-flex>
                <!-- 올해 기준 집행률 -->

                <!-- 올해 예산 주요 키워드 -->
                <v-flex md4 style="height:100%;">
                  <p class="_title">{{budgetBusi.keyword.date}} 사업 주요 키워드</p>
                  <div v-if="budgetBusi.keyword.top3.length > 0">
                    <span
                      v-for="(item, index) in budgetBusi.keyword.top3"
                      class="primary--text"
                      :key="index"
                    >#{{ item.excut_word }}</span>
                  </div>
                  <div v-else>
                    <span>준비중입니다.</span>
                  </div>
                </v-flex>
                <!-- 올해 예산 주요 키워드 -->
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- 예산 및 사업현황 -->

        <!-- 조달계약 현황 -->
        <v-flex md12 class="_layout6">
          <v-layout align-center justify-space-between fill-height row wrap>
            <v-flex md2 class="_left _title">
              <v-card flat>
                <v-layout row fill-height align-center>
                  <v-flex class="_text" md12>
                    조달계약
                    <br />현황
                    <img
                      class="_question"
                      @mouseenter="openQuestionPopup"
                      @mouseleave="closeQuestionPopup"
                      :src="getImageUrl('common/question_16px.png')"
                      alt
                    />
                    <popup-question
                      :title="getTitle('cityStatus4')"
                      :contents="getContents('cityStatus4')"
                      :position="getPosition('cityStatus4')"
                    ></popup-question>
                  </v-flex>

                  <v-flex md6>
                    <v-img
                      :src="getImageUrl('common/icon_contract_orange_62.png')"
                      width="100%"
                      height="85%"
                      style="position:absolute; top:7px; right:19px;"
                      position="right bottom"
                      contain
                    ></v-img>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex md10 class="_contents _right_round _left_round_small">
              <v-layout align-center justify-space-between fill-height wrap>
                <!-- 2019년 기준 총 예산 -->
                <v-flex md4 style="height:100%;">
                  <p class="_title">{{contract.total.date}} 기준</p>
                  <span>총 계약</span>
                  <span
                    class
                    style="color:rgb(241, 72, 37);"
                    v-if="contract.total.fee"
                  >{{ " " + changeWonUnit(contract.total.fee) }}</span>
                  <span v-else>-</span>
                </v-flex>
                <!-- 2019년 기준 총 예산 -->

                <!-- 2019년 최신기준 계약 1위 업체 -->
                <v-flex md4 style="height:100%;">
                  <p class="_title">{{contract.org.date}} 기준</p>
                  <span>계약 1위</span>
                  <span
                    style="color:rgb(241, 72, 37);"
                    v-if="contract.org.top1"
                  >{{ contract.org.top1 }}</span>
                  <span v-else>-</span>
                </v-flex>
                <!-- 2019년 최신기준 계약 1위 업체 -->

                <!-- 2019년 예산 주요 키워드 -->
                <v-flex md4 style="height:100%;">
                  <p class="_title">{{contract.keyword.date}} 조달계약 키워드</p>
                  <div v-if="contract.keyword.top3.length > 0">
                    <span
                      v-for="(item, index) in contract.keyword.top3"
                      :key="index"
                      style="color:rgb(241, 72, 37);"
                    >#{{ item.excut_word }}</span>
                  </div>
                  <div v-else>
                    <span>준비중입니다.</span>
                  </div>
                </v-flex>
                <!-- 2019년 예산 주요 키워드 -->
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- 조달계약 현황 -->
      </v-layout>
    </v-container>
    <!-- 컨테이너1-->

    <!-- 컨테이너2 -->
    <v-container id="timeseries-area-top" fluid class="pa-0 ma-0 primary hidden _top_left">
      <v-layout
        class="_parent_layout _parent2 third"
        align-center
        justify-space-between
        fill-height
        wrap
      >
        <v-flex md12 class="_layout1">
          <div style="float:left">
            <v-btn
              class="move-btn _sub_title"
              round
              :class="{ on: moveBtn === 1 }"
              @click="clickToMove(1)"
            >예산 및 사업현황</v-btn>

            <v-btn
              class="move-btn _sub_title"
              round
              :class="{ on: moveBtn === 2 }"
              @click="clickToMove(2)"
            >조달계약 현황</v-btn>
          </div>
          <div style="float:right">
            <img
              class="_question"
              @mouseenter="openQuestionPopup"
              @mouseleave="closeQuestionPopup"
              :src="getImageUrl('common/question_16px.png')"
              alt
            />
            <popup-question
              :title="getTitle('cityStatus5')"
              :contents="getContents('cityStatus5')"
              :position="getPosition('cityStatus5')"
            ></popup-question>
            <span class="_sub_title">{{ selectDate }}</span>
            <v-btn color="primary" round @click="excuteDialog(true)">기간 직접 입력</v-btn>
          </div>
        </v-flex>
        <v-flex md12 class="_layout2">
          <v-card flat style="background:transparent;">
            <timeseries :options="timeseriesOptions" @trigger="chagedTimeseries" ref="timeseries1"></timeseries>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- 컨테이너2 -->

    <!-- 컨테이너3 -->
    <v-container id="business-status" fluid class="pa-0 ma-0 fullpage">
      <v-layout class="_parent_layout _parent3 third" align-center justify-space-between wrap>
        <!-- 분야별 예산 현황 -->
        <v-flex class="_layout1" md8>
          <v-flex fill-height class="_layout_contents _round" style="background: white;">
            <v-flex class="_child1" md12>
              <span class="_title">분야별 예산 집행</span>
              <span class="_title_date">({{ selectDate }})</span>
              <img
                class="_question"
                @mouseenter="openQuestionPopup"
                @mouseleave="closeQuestionPopup"
                :src="getImageUrl('common/question_16px.png')"
                alt
              />
              <popup-question
                :title="getTitle('cityStatus6')"
                :contents="getContents('cityStatus6')"
                :position="getPosition('cityStatus6')"
              ></popup-question>
            </v-flex>
            <v-flex style="height:calc(100% - 26px);">
              <bar :options="barOptions1" ref="bar1"></bar>
            </v-flex>
          </v-flex>
        </v-flex>
        <!-- 분야별 예산 현황 -->

        <!-- 사업 키워드 -->
        <v-flex class="_layout2" md4>
          <v-layout
            align-center
            justify-space-between
            wrap
            class="_round"
            style="height:100%; background:white;"
          >
            <v-flex md12 style="height:20%;">
              <v-card flat class="_layout_contents _top_round">
                <div style="height:100%;">
                  <span class="_title">사업키워드</span>
                  <span class="_title_date">({{ selectDate }})</span>
                  <img
                    class="_question"
                    @mouseenter="openQuestionPopup"
                    @mouseleave="closeQuestionPopup"
                    :src="getImageUrl('common/question_16px.png')"
                    alt
                  />
                  <popup-question
                    :title="getTitle('cityStatus7')"
                    :contents="getContents('cityStatus7')"
                    :position="getPosition('cityStatus7')"
                  ></popup-question>
                </div>
              </v-card>
            </v-flex>
            <v-flex md12 style="height:80%;">
              <v-flex md12 style="height:77%;">
                <v-card flat class="_layout_graph">
                  <wordcloud :options="wordcloudOptions1" ref="wordcloud1"></wordcloud>
                </v-card>
              </v-flex>
              <v-flex md12 class="_bottom" style="height:23%;">
                <v-card flat class="_bottom_round">
                  <span
                    class="_sub_title"
                    v-for="(item, index) in wordcloud.budgetTop3"
                    :key="index"
                  >{{ item.excut_word }}: {{item.value}}건</span>
                </v-card>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- 사업 키워드 -->

        <!-- 집행된 세부 사업(기간) -->
        <v-flex class="_layout3 _grid_layout" md12>
          <v-flex fill-height class="_layout_contents _round">
            <v-flex class="_child1" md12>
              <span class="_title">예산 집행 세부 내역</span>
              <span class="_title_date">({{ selectDate }})</span>
              <img
                class="_question"
                @mouseenter="openQuestionPopup"
                @mouseleave="closeQuestionPopup"
                :src="getImageUrl('common/question_16px.png')"
                alt
              />
              <popup-question
                :title="getTitle('cityStatus8')"
                :contents="getContents('cityStatus8')"
                :position="getPosition('cityStatus8')"
              ></popup-question>
            </v-flex>
            <v-flex md12 class="_child2">
              <v-flex fill-height>
                <grid :options="gridOptions1" ref="grid1"></grid>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>
        <!-- 집행된 세부 사업(기간) -->
      </v-layout>
    </v-container>
    <!-- 컨테이너3 -->

    <!-- 컨테이너4 -->
    <v-container id="contract-status" fluid class="pa-0 ma-0 fullpage">
      <v-layout class="_parent_layout _parent4 third" align-center justify-space-between wrap>
        <v-flex class="_layout1" md4>
          <v-layout
            align-center
            justify-space-between
            wrap
            class="_round"
            style="height:100%; background:white;"
          >
            <v-flex md12 style="height:25%;">
              <v-card flat class="_layout_contents _top_round" style="padding-right:0;">
                <div style="height:100%; display:inline-block;">
                  <span class="_title">조달 계약 키워드</span>
                  <span class="_title_date">({{ selectDate }})</span>
                </div>
                <img
                  class="_question"
                  @mouseenter="openQuestionPopup"
                  @mouseleave="closeQuestionPopup"
                  :src="getImageUrl('common/question_16px.png')"
                  alt
                />
                <popup-question
                  :title="getTitle('cityStatus9')"
                  :contents="getContents('cityStatus9')"
                  :position="getPosition('cityStatus9')"
                ></popup-question>
              </v-card>
            </v-flex>
            <v-flex md12 style="height:75%;">
              <v-flex md12 style="height:80%;">
                <v-card flat class="_layout_graph">
                  <wordcloud :options="wordcloudOptions2" ref="wordcloud2"></wordcloud>
                </v-card>
              </v-flex>
              <v-flex md12 class="_bottom" style="height:20%;">
                <v-card flat class="_bottom_round">
                  <span
                    class="_sub_title"
                    v-for="(item, index) in wordcloud.contractTop3"
                    :key="index"
                  >{{ item.excut_word }}: {{item.value}}건</span>
                </v-card>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex class="_layout2 _grid_layout" md8>
          <v-flex fill-height class="_layout_contents _round">
            <v-flex class="_child1" md12>
              <span class="_title">업체별 계약 실적</span>
              <span class="_title_date">({{ selectDate }})</span>
              <img
                class="_question"
                @mouseenter="openQuestionPopup"
                @mouseleave="closeQuestionPopup"
                :src="getImageUrl('common/question_16px.png')"
                alt
              />
              <popup-question
                :title="getTitle('cityStatus10')"
                :contents="getContents('cityStatus10')"
                :position="getPosition('cityStatus10')"
              ></popup-question>
            </v-flex>
            <v-flex md12 class="_child2">
              <v-flex fill-height>
                <grid :options="gridOptions2" ref="grid2"></grid>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>
        <v-flex class="_layout3 _grid_layout" md12>
          <v-flex fill-height class="_layout_contents _round">
            <v-flex class="_child1" md12>
              <span class="_title">조달 계약 리스트</span>
              <span class="_title_date">({{ selectDate }})</span>
              <img
                class="_question"
                @mouseenter="openQuestionPopup"
                @mouseleave="closeQuestionPopup"
                :src="getImageUrl('common/question_16px.png')"
                alt
              />
              <popup-question
                :title="getTitle('cityStatus11')"
                :contents="getContents('cityStatus11')"
                :position="getPosition('cityStatus11')"
              ></popup-question>
            </v-flex>
            <v-flex md12 class="_child2">
              <v-flex fill-height>
                <grid :options="gridOptions3" ref="grid3"></grid>
              </v-flex>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- 컨테이너4 -->

    <!-- TOP버튼 start-->
    <v-fab-transition>
      <v-btn
        color="primary"
        dark
        fixed
        bottom
        right
        fab
        style="bottom:45px;z-index:235;"
        v-show="isTop"
        @click="clickTop"
      >
        <v-icon large color="#fbd146">expand_less</v-icon>
      </v-btn>
    </v-fab-transition>
    <!-- TOP버튼 end-->
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import Pyramid from "@/components/chart-pyramid"; // 피라미드 컴포넌트
import Treemap from "@/components/chart-treemap"; // 트리맵 컴포넌트
import Timeseries from "@/components/chart-timeseries"; // 시계열 컴포넌트
import Wordcloud from "@/components/chart-wordcloud"; // 워드클라우드 컴포넌트
import Grid from "@/components/grid"; // 그리드 컴포넌트
import Bar from "@/components/chart-bar-type2"; // 바차트 컴포넌트
import PopupQuestion from "@/components/popup-question-type2"; // question 팝업 컴포넌트

export default {
  name: "cityStatus",

  data() {
    return {
      isTop: false, // 현재 TOP 위치에 있는지 여부
      selectDate: "",
      // 기본현황 데이터
      basicStatusView: {
        region_pop: "", // 인구
        region_pop_rnk: "", // 인구 순위
        region_area: "", // 면적
        region_area_rnk: "", // 면적 순위
        admiCnt: "", // 행정동 수
        region_type: "", // 유형
        boss_nm: "", // 이름
        boss_group: "", // 소속
        boss_image_url: "common/defalt_img.jpg", // 자치단체장 사진
        home_boss_link: "", // 자치단체장 소개 페이지 URL
        career: [] // 경력
      },

      //  예산 및 사업현황
      budgetBusi: {
        // 총예산
        total: {
          date: "", // 기준년월
          fee: 0 // 총 예산
        },
        //집행률
        enforce: {
          date: "", // 기준년월
          rate: "" // 집행률
        },
        // 주요키워드
        keyword: {
          date: "", // 기준년월
          top3: [] // 키워드 top3,
        }
      },

      // 조달계약 현황
      contract: {
        // 총계약
        total: {
          date: "", // 기준년월
          fee: 0 // 총 예산
        },
        // 계약리스트
        org: {
          date: "", // 기준년월
          top1: "" // 계약1위 업체,
        },
        // 키워드
        keyword: {
          date: "", // 기준년월
          top3: [] // 키워드 top3,
        }
      },

      // 워드클라우드
      wordcloud: {
        budgetTop3: [], // 사업 키워드 top3
        contractTop3: [] // 조달계약 키워드 top3
      },
      moveBtn: 1, // 예산 및 사업현황 or 조달계약 현황 중 액티브 버튼
      activePage: 0,
      offsets: []
    };
  },

  components: {
    pyramid: Pyramid, // 피라미드 컴포넌트
    treemap: Treemap, // 트리맵 컴포넌트
    timeseries: Timeseries, // 시계열 컴포넌트
    wordcloud: Wordcloud, // 워드클라우드 컴포넌트
    grid: Grid, // 그리드 컴포넌트
    bar: Bar, // 바차트 컴포넌트
    "popup-question": PopupQuestion // 질문 팝업창 컴포넌트
  },

  computed: {
    //차트 스토어
    ...mapState("chartstore", {
      pyramidOptions1: "pyramid1", // (F9)인구 피라미드
      pyramidOptions2: "pyramid2", // (F9)인구2 피라미드
      treemapOptions1: "treemap1", // (F10)산업별 GRDP 트리맵
      treemapOptions2: "treemap2", // (F10)사업체 종사자 수 트리맵
      timeseriesOptions: "timeseries", // (F11)기관선택 그래프
      wordcloudOptions1: "wordcloud1", // (F15)사업 키워드 워드클라우드
      wordcloudOptions2: "wordcloud2", // (F18)조달계약 키워드 워드클라우드
      barOptions1: "bar1" // (F14) 분야별 예산 현황 수직 막대 그래프
    }),

    // 그리드 스토어
    ...mapState("gridstore", {
      gridOptions1: "grid1", // (F16)집행된 세부사업(기간) 그리드
      gridOptions2: "grid2", // (F19)우수 계약 업체
      gridOptions3: "grid3" // (F20)조달 계약 리스트
    }),

    // 공통 스토어
    ...mapState("commonstore", [
      "basicStatus", // 기본현황
      "selfGovernment", // 자치단체장
      "budgetTotalFee", // 예산 및 사업현황: 총 예산
      "budgetEnforceRate", // 예산 및 사업현황: 집행률
      "budgetKeywordTop3", // 예산 및 사업현황 사업키워드 TOP3
      "contractTotalFee", // 조달계약 현황: 총 예산
      "contractTop1", // 조달계약 현황: 계약 1위 업체
      "contractKeywordTop3", // 조달계약 현황: 조달키워드 TOP3
      "budgetWordcloudTop3", // 워드클라우드: 사업키워드
      "contractWordcloudTop3" // 워드클라우드: 조달키워드
    ]),

    ...mapGetters("questionstore", ["getTitle", "getContents", "getPosition"]),

    /**
     * @description 자치단체장 이미지 가져오는 메소드
     */
    getBossImage() {
      let ctycd = sessionStorage.getItem("ctycd");

      // 시군구 코드가 4자리일 경우 0하나 더 붙임
      if (ctycd.length === 4) {
        ctycd += "0";
      }

      this.boss_image_url = "default/chief/" + ctycd + "00000.jpg";
      return this.boss_image_url;
    }
  },

  methods: {
    ...mapMutations("commonstore", ["excuteDialog"]),

    /**
     * @description SQL 파라미터 설정하는 메소드
     * @param {Object} query
     */
    setQuery(query, name) {
      if (!query) return;
      if (!name) return;

      const ctycd = sessionStorage.getItem("ctycd"); // 지역코드
      const sdate = sessionStorage.getItem("sdate"); // 기준 시작날짜
      const edate = sessionStorage.getItem("edate"); // 기준 마지막날짜
      const start_date = sessionStorage.getItem("start_date"); // 기준 마지막날짜
      const end_date = sessionStorage.getItem("end_date"); // 기준 마지막날짜

      // 쿼리스트링 객체 세팅
      for (let key in query) {
        // 시군구코드
        if (key === "ctycd") {
          query[key] = ctycd;
        }

        // 기준 시작날짜
        if (key === "sdate") {
          query[key] = sdate;
        }

        // 기준 마지막날짜
        if (key === "edate") {
          query[key] = edate;
        }

        // 최신날짜
        if (key === "date" && !query[key]) {
          query[key] = edate;
        }

        // 선택 시작날짜
        if (key === "start_date" && !query[key]) {
          query[key] = start_date;
        }

        // 선택 마지막날짜
        if (key === "end_date" && !query[key]) {
          query[key] = end_date;
        }
      }

      return query;
    },

    // 기간선택 텍스트 세팅
    setSelectDate() {
      const sdate = sessionStorage.getItem("sdate"); // 기준 시작날짜
      const edate = sessionStorage.getItem("edate"); // 기준 마지막날짜

      this.selectDate =
        this.getDate("yyyymmdd", this.formatYYYYMMDDToDate(sdate)).join(".") +
        "~" +
        this.getDate("yyyymmdd", this.formatYYYYMMDDToDate(edate)).join(".");
    },

    /**
     * @description (F11)기간선택시 트리거 이벤트
     */
    chagedTimeseries(query) {
      sessionStorage.setItem("sdate", query["sdate"]);
      sessionStorage.setItem("edate", query["edate"]);

      const target = this.makeChartTargets([
        "bar1",
        "wordcloud1",
        "grid1",
        "wordcloud2",
        "grid2",
        "grid3"
      ]);

      this.drawCharts(target, this.setQuery);
      this.setBudgetWordcoludTop3();
      this.setContractWordcoludTop3();
      this.setSelectDate();
    },

    /**
     * @description TOP버튼 클릭 이벤트
     */
    clickTop() {
      this.isTop = false; // TOP버튼 숨김
      this.activePage = 0; // 활성화 페이지 초기화
      this.isShowTimeLayout(0); // 시계열차트 레이아웃 숨김
      this.moveScroll(0);
    },

    /**
     * @description 예산 및 사업현황 or 조달계약 현황 버튼 클릭시 이동시키는 메소드
     * @param {Number} index 타겟 인덱스
     */
    clickToMove(index) {
      this.moveScroll(this.offsets[index]);
      this.moveBtn = index;
      this.activePage = index;
    },

    /**
     * @description 스크롤 위치에 따른 시계열차트 레이아웃 보임/숨김하는 메소드
     * @param {Number} pageIndex 활성된 페이지 인덱스
     */
    isShowTimeLayout(pageIndex) {
      const dom = document.getElementById("timeseries-area-top");
      const scrollTop = document.scrollingElement
        ? document.scrollingElement.scrollTop
        : document.body.scrollTop;

      // 2페이지 이상부터 시게열 레이아웃 보임
      if (pageIndex > 0) {
        dom.style.display = "block";
        dom.style.visibility = "visible";
        dom.classList.remove("hidden");

        this.moveBtn = pageIndex; // 시계열 그래프 상위 버튼 활성화
        this.isTop = true;

        // 레이아웃 숨김
      } else {
        dom.style.display = "none";
        this.isTop = false;
      }

      this.activePage = pageIndex;

      // 이동한 스크롤이 중간지점에서 멈추었을 때 파라미터로 받은 페이지 위치로 이동
      if (scrollTop !== this.offsets[pageIndex])
        this.moveScroll(this.offsets[pageIndex]);
    },

    /**
     * @description fullpage 이동버튼 클릭 이벤트
     * @param {Number} index 활성된 fullpage 이동버튼 인덱스
     */
    clickFullpage(index) {
      this.moveScroll(this.offsets[index]).then(offset => {
        this.isShowTimeLayout(index);
      });
    },

    /**
     * @description 기본현황 데이터 바인딩
     * @param {Object} data 서버데이터
     */
    setbasicStatusView(data) {
      if (!data || data.length === 0) return;
      const that = this;
      Object.keys(data).forEach(key => {
        if (that.$data.basicStatusView[key] === "" && data[key])
          that.$data.basicStatusView[key] = data[key];
      });
    },

    /**
     * @description (F8)자치단체장 데이터 바인딩
     * @param {Object} data 서버데이터
     */
    setCareer(data) {
      if (!data || data.length === 0) return;

      const that = this;

      if (Array.isArray(data)) {
        for (let i = 0, max = data.length; i < max; i++) {
          that.$data.basicStatusView["career"][i] = data[i]["resm"];
        }
      }
    },

    /**
     * @description 예산 및 사업현황: 총 예산
     */
    setBudgetTotalFee() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");

      this.getData(this.budgetTotalFee["dataURL"], {
        ctycd: ctycd
      }).then(result => {
        const data = result["data"]["data"];
        const date = result["data"]["stdr_date"];
        if (data.length === 0) return;
        that.$data.budgetBusi.total.fee = data[0]["value"];
        that.$data.budgetBusi.total.date = date.join(" ~ ");
      });
    },

    /**
     * @description 예산 및 사업현황: 집행률
     */
    setBudgetEnforceRate() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");

      this.getData(this.budgetEnforceRate["dataURL"], {
        ctycd: ctycd
      }).then(result => {
        const data = result["data"]["data"];
        const date = result["data"]["stdr_date"];
        if (data.length === 0) return;

        that.$data.budgetBusi.enforce.rate = data["value"];
        that.$data.budgetBusi.enforce.date = date.join(" ~ ");
      });
    },

    /**
     *  @description 예산 및 사업현황: 사업 주요 키워드 TOP3
     */
    setBudgetKeywordTop3() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");

      this.getData(this.budgetKeywordTop3["dataURL"], {
        ctycd: ctycd
      }).then(result => {
        const data = result["data"]["data"];
        const date = result["data"]["stdr_date"];
        if (!data || data.length === 0) return;
        that.$data.budgetBusi.keyword.top3 = data;
        that.$data.budgetBusi.keyword.date = date.join(" ~ ");
      });
    },

    /**
     * @description 조달계약 현황: 총 계약
     */
    setContractTotalFee() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");

      this.getData(this.contractTotalFee["dataURL"], {
        ctycd: ctycd
      }).then(result => {
        const data = result["data"]["data"];
        const date = result["data"]["stdr_date"];
        if (data.length === 0) return;

        that.$data.contract.total.fee = data[0]["value"];
        that.$data.contract.total.date = date.join(" ~ ");
      });
    },

    /**
     * @description 조달계약 현황: 계약 1위 업체
     */
    setContractKeywordTop1() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");
      const sdate = sessionStorage.getItem("sdate");
      const edate = sessionStorage.getItem("edate");

      this.getData(this.contractTop1["dataURL"], {
        ctycd: ctycd,
        sdate: sdate,
        edate: edate
      }).then(result => {
        const data = result["data"]["data"];
        const date = result["data"]["stdr_date"];
        if (!data || data.length === 0) return;
        that.$data.contract.org.top1 = data[0]["orgNm"];
        that.$data.contract.org.date = date.join(" ~ ");
      });
    },

    /**
     * @description 조달계약 현황: 조달계약 키워드 TOP3
     */
    setContractKewordTop3() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");
      const sdate = sessionStorage.getItem("sdate");
      const edate = sessionStorage.getItem("edate");
      this.getData(this.contractKeywordTop3["dataURL"], {
        ctycd: ctycd
      }).then(result => {
        const data = result["data"]["data"];
        const date = result["data"]["stdr_date"];
        if (!data || data.length === 0) return;
        that.$data.contract.keyword.top3 = data;
        that.$data.contract.keyword.date = date.join(" ~ ");
      });
    },

    /**
     * @description 워드클라우드: 사업키워드 TOP3
     */
    setBudgetWordcoludTop3() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");
      const sdate = sessionStorage.getItem("sdate");
      const edate = sessionStorage.getItem("edate");
      this.getData(this.wordcloudOptions1["dataURL"], {
        ctycd: ctycd,
        sdate: sdate,
        edate: edate,
        lmt: 3,
        wtype: "bsns"
      }).then(result => {
        const data = result["data"];
        if (!data || data.length === 0) {
          that.$data.wordcloud.budgetTop3 = [];
        } else {
          that.$data.wordcloud.budgetTop3 = data.filter((d, i) => {
            d.value = that.numberWithCommas(d.value);
            if (i < 3) return d;
          });
        }
      });
    },

    /**
     * @description 워드클라우드: 조달계약 키워드 TOP3
     */
    setContractWordcoludTop3() {
      const that = this;
      const ctycd = sessionStorage.getItem("ctycd");
      const sdate = sessionStorage.getItem("sdate");
      const edate = sessionStorage.getItem("edate");
      this.getData(this.wordcloudOptions2["dataURL"], {
        ctycd: ctycd,
        sdate: sdate,
        edate: edate,
        lmt: 3,
        wtype: "cont"
      }).then(result => {
        const data = result["data"];
        if (!data || data.length === 0) {
          that.$data.wordcloud.contractTop3 = [];
        } else {
          that.$data.wordcloud.contractTop3 = data.filter((d, i) => i < 3);
        }
      });
    },

    resetOffsets(offsets) {
      const excludeDom = document.getElementById("timeseries-area-top");

      for (let i = 0; i < offsets.length; i++) {
        if (i > 0) {
          let pageOffset = offsets[i];
          offsets.splice(i, 1, pageOffset - excludeDom.offsetHeight);
        }

        this.offsets = offsets;
      }
    }
  },

  created() {
    window.addEventListener("resize", this.onResize); // resize 이벤트리스너 등록
  },

  updated() {},

  destroyed() {
    window.removeEventListener("resize", this.onResize); // resize 이벤트리스너 해제
  },

  mounted() {
    // 구글 어널리틱스
    this.$ga.page("/report/cityStatus");

    const that = this;
    const ctycd = sessionStorage.getItem("ctycd");
    const sdate = sessionStorage.getItem("sdate");
    const edate = sessionStorage.getItem("edate");
    const target = that.makeChartTargets([
      "pyramid1",
      "pyramid2",
      "treemap1",
      "treemap2",
      "timeseries1"
    ]);

    // (F8)기본현황 데이터 호출 및 세팅
    this.getData(this.basicStatus["dataURL"], { ctycd: ctycd }).then(result => {
      that.setbasicStatusView(result["data"][0]);
    });

    // (F8)지방단체장 데이터 호출 및 세팅
    this.getData(this.selfGovernment["dataURL"], {
      ctycd: ctycd
    }).then(result => that.setCareer(result["data"]));

    /****************예산 및 사업현황******************/
    // 예산 및 사업현황: 총 예산 데이터 호출 및 세팅
    this.setBudgetTotalFee();

    // 예산 및 사업현황: 집행률 데이터 호출 및 세팅
    this.setBudgetEnforceRate();

    // 예산 및 사업현황: 데이터 호출 및 키워드 TOP3 세팅
    this.setBudgetKeywordTop3();
    /****************예산 및 사업현황******************/

    /****************조달계약 현황******************/
    // 조달계약 현황 총 계약 데이터 호출 및 세팅
    this.setContractTotalFee();

    // 조달계약 현황 데이터 호출 및 계약 1위업체 세팅
    this.setContractKeywordTop1();

    // 조달계약 현황 데이터 호출 및 키워드 TOP3 세팅
    this.setContractKewordTop3();
    /****************조달계약 현황******************/

    /****************워드클라우드******************/
    // 워드클라우드 사업 키워드 TOP3  세팅
    this.setBudgetWordcoludTop3();

    // 워드클라우드 조달계약 키워드 TOP3 세팅
    this.setContractWordcoludTop3();
    /****************워드클라우드******************/

    this.drawCharts(target, this.setQuery); // target에 포함된 차트들 그리기
    this.calcFullpageOffsets().then(offsets => {
      that.resetOffsets(offsets);
    }); // full-page offset 동적계산
  }
};
</script>

<style scoped src="@/assets/css/cityStatus.css"></style>
<style scoped></style>