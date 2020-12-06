export default {
  namespaced: true,
  state: {
    cityStatus1: {
      title: "일반현황",
      contents: "@선택한 지자체에 대한 일반 현황을 보여줍니다.|각 정보에 대한 출처는 Data List를 참고해주세요.",
      position: "right center"
    },
    cityStatus2: {
      title: "인구 & 산업",
      contents: "@선택한 지자체의 성별, 연령별 인구현황 및 이동과|지역 내 산업 현황을 업종별로 구분하여 보여줍니다.",
      position: "right center"
    },
    cityStatus3: {
      title: "예산 및 사업현황",
      contents: "@선택한 지자체의 예산 규모를 나타내는 예산 현액과|실제 예산을 집행한 비율을 나타내는 집행률,|예산을 집행한 사업의 키워드를 3순위까지 제공합니다.",
      position: "right center"
    },
    cityStatus4: {
      title: "조달계약 현황",
      contents: "@선택한 지자체에서 발주하여 조달청에 등록된 사업의 계약 규모와|누적 계약금액이 큰 사업체명, 조달청을 계약명의 키워드를 3순위|까지 제공합니다.",
      position: "right center"
    },
    cityStatus5: {
      title: "기간선택",
      contents: "@선택한 지자체의 예산집행 현황을 일자에 따라|조회하실 수 있습니다.",
      position: "right center"
    },
    cityStatus6: {
      title: "분야별 예산 집행",
      contents: "@기간선택을 통해 선택된 기간 동안 예산 집행분야에|따른 구성비율과 금액을 나타냅니다.",
      position: "right center"
    },
    cityStatus7: {
      title: "사업키워드",
      contents: "@선택한 기간 내 예산이 집행된 사업들에 대한|키워드를 추출하여 표현합니다.",
      position: "left top"
    },
    cityStatus8: {
      title: "예산집행 세부 내역",
      contents: "@예산이 집행된 각 사업별 세부 내용을 나타냅니다.|자료의 출처는 Data List를 참고해주세요.",
      position: "right center"
    },
    cityStatus9: {
      title: "조달 계약 키워드",
      contents: "@선택한 기간동안 지자체에서 발주하여 조달청에 등록된|사업들의 키워드를 추출하여 나타냅니다.",
      position: "right center"
    },
    cityStatus10: {
      title: "업체별 계약 실적",
      contents: "@조달청 계약을 기반으로 선택한 기간동안|사업을 수행한 기업을 금액이 높은 순서로|5순위까지 보여줍니다.",
      position: "right center"
    },
    cityStatus11: {
      title: "조달 계약 리스트",
      contents: "@선택한 기간동안 계약된 사업들의 세부 내용을나타냅니다.|각 사업을 클릭하시면 세부 정보 페이지로 이동합니다.",
      position: "right center"
    },
    cityDiagnosis1: {
      title: "분야별 지출 현황",
      contents: "@올해의 예산지출 분야별 지출 현황을 나타냅니다. 각 아이콘의|크기는 지출 규모에 비례합니다. (기타 및 예비비 항목은 제외)|@각 아이콘을 클릭하시면 일자별 지출 현황과 주요 키워드,|지표를 확인할 수 있습니다.",
      position: "right center"
    },
    cityDiagnosis2: {
      title: "분야별 주요 지표",
      contents: "@전국 지자체에 보유하고 있는 지역통계 데이터, 공공 데이터를 활용하여 도시를|진단할 수 있는 주요 지표를 나타냅니다. 수집된 데이터들은 각 자료의 특성과|분포에 따라 최대 100점의 지표로 변환하여 지수를 산출합니다.|@분야별 지수는 각 분야 내 지표들을 결합한 지표이고,유사지자체 지수는 지표에|대한 유사지자체들의 평균 지숫값, 전국 지수는 지표에 대한 전국 지자체의 평균|지숫값을 뜻합니다.|@각 지표에 대한 연산방식이 다르기 때문에 지수 비교 시에는 주의가 필요합니다.",
      position: "right center"
    },
    cityDiagnosis3: {
      title: "일자별 지출 현황 그래프",
      contents: "@분야별 지출 현황 메뉴에서 선택된 분야의 일자별|지출 현황을 나타냅니다. 조회를 원하는 일자에|마우스를 올려보세요.",
      position: "right center"
    },
    cityDiagnosis4: {
      title: "계약 키워드 및 주요 지표",
      contents: "@분야별 지출 현황 메뉴에서 선택된 분야에서 지출된 세부 사업의 키워드와,|분야 내 상위 지표를 유사지자체 및 전국과 비교할 수 있습니다.",
      position: "right center"
    },
    policyRecommen1: {
      title: "정책 추천 분야",
      contents: "@도시진단 결과 정책 추천이 필요한 분야 3순위와 각 분야 내 하위 지표를 나타냅니다.|@유사지자체와의 지숫값 차이가 큰 분야일수록 높은 순위를 부여합니다.|@현재 추천된 분야 및 지숫값은 지자체의 절대적인 부족함 정도를 나타내는 것은 아니며,|해석에 주의가 필요합니다.",
      position: "right center"
    },
    policyRecommen2: {
      title: "추천 정책 리스트",
      contents: "@각 분야 및 지표별 추천 정책을 조회할 수 있습니다.|@유사지자체에서 수행한 정책 중 선택한 분야 및 지표와 유사도가 높은|정책부터 정렬하여 나타납니다.|@각 계약을 클릭하시면 세부 정보 조회 페이지로 이동합니다.",
      position: "right center"
    },
    policyRecommen3: {
      title: "인기 검색어",
      contents: "@스마트온 이용자들이 가장 많이 조회한 지표와 정책을|조회할 수 있습니다.",
      position: "left top"
    },
    policyRecommen4: {
      title: "분야별 관련 데이터 및 우수기업",
      contents: "@선택한 분야와 관련된 공공데이터를 활용도에 따라 정렬하여 |보여줍니다. 마우스 클릭 시 해당 자료 페이지로 이동합니다.|@우수기업은 선택한 분야의 공공사업을 많이 수행한 기업들을 |수행 규모에 따라 내림차순으로 보여줍니다.",
      position: "right center"
    },
    electionBudget: {
      title: "분야별 예산 현황",
      contents: "조회하고 있는 지자체의 2019년 분야별 예산을 나타냅니다.|추가로, 예산이 집행된 세부사업명의 주요 키워드를 제공합니다.",
      position: "right center"
    },
    electionDiagnose: {
      title: "분야별 진단",
      contents: "@전국 지자체에 보유하고 있는 지역통계 데이터, 공공 데이터를 활용하여 도시를|진단할 수 있는 주요 지표를 나타냅니다. 수집된 데이터들은 각 자료의 특성과|분포에 따라 최대 100점의 지표로 변환하여 지수를 산출합니다.|@분야별 지수는 각 분야 내 지표들을 결합한 지표이고,유사지자체 지수는 지표에|대한 유사지자체들의 평균 지숫값을 뜻합니다.|@각 지표에 대한 연산방식이 다르기 때문에 지수 비교 시에는 주의가 필요합니다.",
      position: "left bottom"
    },
    electionCandidate: {
      title: "후보자 정보",
      contents: "후보 사진과 프로필 정보는 중앙선거관리위원회에서 제공받으며,|후보 노출 순서는 중앙선거관리위원회와 동일합니다.",
      position: "right center"
    },
    candidateCareer: {
      title: "준비중입니다.",
      contents: "준비중입니다.",
      position: "none"
    },
    candidateAcdm: {
      title: "준비중입니다.",
      contents: "준비중입니다.",
      position: "none"
    },
    candidateIndx: {
      title: "분야별 언급량",
      contents: "공약집 내 분야별 언급 비율을 국회의원 후보자 전체와 비교하여 나타냅니다.|해당 그래프가 표현하는 내용은 공약집의 내용을 기반으로 하며, 후보자의 실제 공약 내용과 차이가 있을 수 있습니다.|또한, 그래프의 크기에 따라 정책의 좋고 나쁨 등의 질적 판단이나 후보 간의 분야에 대한 직접 비교는 불가능합니다.|분야별 공약에 대한 평가나 판단은 사용자에게 달려있으며, 세부사항은 후보자 공약집을 확인하시기 바랍니다.",
      position: "left center"
    }
  },
  getters: {

    getTitle: (state) => (id) => {
      return state[id]["title"];
    },

    getContents: (state) => (id) => {
      const contents = state[id]["contents"];
      if(contents !== undefined) return contents.split('|');
      else return contents;
    },

    getPosition: (state) => (id) => {
      return state[id]["position"];
    }
  },
  mutations: {
    /**
     * @description popup 내용 수정
     * @param {*} state
     * @param {*} payload
     */
    setContents(state, payload) {
      state[payload["id"]]["contents"] = payload["contents"];
    },
  },
  actions: {
    /**
     * @description popup 내용 수정
     * @param {*} context
     * @param {*} payload
     */
    setContents(context, payload) {
        context.commit('setContents', payload);
    },
  }
};
