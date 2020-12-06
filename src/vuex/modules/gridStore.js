export default {
  namespaced: true,
  state: {
    "grid1": {
      dataNm: "(F16)집행된 세부 사업",
      headerData: [
        {
          "header": "분야",
          "name": "sect_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "120"
        },
        {
          "header": "부문",
          "name": "realm_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "120"
        },
        {
          "header": "사업명",
          "name": "bsns_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "auto"
        },
        {
          "header": "집행일자",
          "name": "exc_date_form",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "100"
        },
        {
          "header": "예산현액(천원)",
          "name": "budget_amt",
          "align": "right",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "120",
          formatter(obj) {
            const chun = Math.round(Number(obj.value) / 1000);
            return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        {
          "header": "국비(천원)",
          "name": "nation_fee",
          "align": "right",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "120",
          formatter(obj) {
            const chun = Math.round(Number(obj.value) / 1000);
            return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        {
          "header": "시도비(천원)",
          "name": "mega_fee",
          "align": "right",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "120",
          formatter(obj) {
            const chun = Math.round(Number(obj.value) / 1000);
            return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        {
          "header": "시군구비(천원)",
          "name": "cty_fee",
          "align": "right",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "120",
          formatter(obj) {
            const chun = Math.round(Number(obj.value) / 1000);
            return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        {
          "header": "지출액(천원)",
          "name": "expndtr_amt",
          "align": "right",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "120",
          formatter(obj) {
            const chun = Math.round(Number(obj.value) / 1000);
            return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        {
          "header": "회계구분",
          "name": "accnut_nm",
          "align": "center",
          "valign": "middle",
          "sortable": true,
          "sortingType": "desc",
          "width": "90"
        }
      ],
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataURL: "/api/ctystate/exct",
      dataLoc: "도시현황-페이지2",
      dataRootLoc: "ctystate",
      onMouseEnter: {
        using: true,
        callback: () => {
          const metaData = this.default.state.grid1;

          return metaData.onMouseEnter.key;
        },
        key: "bsns_nm"
      },
      onMouseClick: {
        using: false,
        callback: () => { }
      },
      controlLayout: (element) => { },
      clean: (data) => {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      style: {
        head: "#0840B3",
        body: {
          odd: "white",
          even: "#D8DFEA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 30,
        minRowHeight: 30,
        header: {
          height: 29
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        copyOptions: {
          useFormattedValue: true
        }
      }
    },
    "grid2": {
      dataNm: "(F19)우수 계약 업체",
      headerData: [{
        "header": "순위",
        "name": "rank",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "90"
      },
      {
        "header": "업체명",
        "name": "contract_company",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "누적계약금액(천원)",
        "name": "cumulativeAmount",
        "align": "right",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "150",
        formatter(obj) {
          const chun = Math.round(Number(obj.value) / 1000);
          return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      },
      {
        "header": "계약 수(건)",
        "name": "cnt",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "135",
        formatter(obj) {
          const numValue = obj.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return numValue;
        }
      }
      ],
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataURL: "/api/ctystate/companyList",
      dataLoc: "도시현황-페이지3",
      dataRootLoc: "ctystate",
      onMouseEnter: {
        using: false,
        callback: () => { },
        key: null
      },
      onMouseClick: {
        using: false,
        callback: () => { }
      },
      controlLayout: (element) => {

        const metaData = this.default.state.grid2;
        const containerHeight = element.offsetHeight // 그리드 컨테이너 높이
        const rowCount = 6; // 그리드 row 총 개수
        const rowHeight = Math.round(containerHeight / rowCount); // 각 row별 높이

        metaData.gridOption.header["height"] = rowHeight - 1;
        metaData.gridOption["rowHeight"] = rowHeight;
        metaData.gridOption["minRowHeight"] = rowHeight;
      },
      clean: (data) => {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      style: {
        head: "#FF5F2E",
        body: {
          odd: "white",
          even: "#FFE8CA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 30,
        minRowHeight: 30,
        header: {
          height: 29
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        copyOptions: {
          useFormattedValue: true
        }
      }
    },
    "grid3": {
      dataNm: "(F20)조달 계약 리스트",
      headerData: [{
        "header": "업무",
        "name": "job_type",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "100"
      },
      {
        "header": "계약번호",
        "name": "contract_no",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "120"
      },
      {
        "header": "계약건명",
        "name": "contract_nm",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "계약금액(천원)",
        "name": "contract_price",
        "align": "right",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "110",
        formatter(obj) {
          const chun = Math.round(Number(obj.value) / 1000);
          return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      },
      {
        "header": "계약방법",
        "name": "contract_type",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "100"
      },
      {
        "header": "계약일자",
        "name": "contract_date_form",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "120"
      },
      {
        "header": "계약명2",
        "hidden": true,
        "name": "contract_nm2"
      }
      ],
      dataQuery: {
        ctycd: null,
        sdate: null,
        edate: null
      },
      dataURL: "/api/ctystate/contractList",
      dataLoc: "도시현황-페이지3",
      dataRootLoc: "ctystate",
      onMouseEnter: {
        using: true,
        callback: () => { },
        key: "contract_nm"
      },
      onMouseClick: {
        using: true,
        callback: (data, vueInstance) => {

          if (data.rowKey !== undefined) {
            const dataNm = this.default.state.grid6.dataNm;
            const contractNm = data.contract_nm2;
            const contractNo = data.contract_no;

            // 구글 애널리틱스
            vueInstance.$ga.event("citystatus_contract_ " + dataNm, contractNm, contractNo) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

            if (contractNo !== "") {
              window.open(
                "http://www.g2b.go.kr:8067/contract/contList.jsp?searchType=2&v_pagesize=10&page_no=1&bu_name=TcontSearchCall&whakjung_bnumber=" + contractNo,
                ""
                // "_blank"
              ); // 새창에서 열림

            }
          }
        }
      },
      controlLayout: (element) => { },
      clean: (data) => {
        const cleanData = data; // 정제된 데이터배열

        return cleanData;
      },
      style: {
        head: "#FF5F2E",
        body: {
          odd: "white",
          even: "#FFE8CA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 30,
        minRowHeight: 30,
        header: {
          height: 29
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        copyOptions: {
          useFormattedValue: true
        }

      }
    },
    "grid4": {
      dataNm: "(F27-2)공공질서 및 안전계약 키워드",
      headerData: [{
        "header": "순위",
        "name": "rank",
        "align": "center",
        "valign": "middle",
        "sortable": false,
        "sortingType": "desc",
        "width": "50"
      },
      {
        "header": "특정지자체",
        "name": "__self",
        "align": "center",
        "valign": "middle",
        "sortable": false,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "유사지자체",
        "name": "__around",
        "align": "center",
        "valign": "middle",
        "sortable": false,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "전국",
        "name": "__all",
        "align": "center",
        "valign": "middle",
        "sortable": false,
        "sortingType": "desc",
        "width": "auto"
      }
      ],
      dataQuery: {
        ctycd: null,
        wtype: "cont",
        tarcty: 11140,
        realmcd: null
      },
      dataURL: "/api/diagnose/conWordTable",
      dataLoc: "도시진단-페이지2",
      dataRootLoc: "diagnose",
      onMouseEnter: {
        using: false,
        callback: () => { },
        key: null
      },
      onMouseClick: {
        using: false,
        callback: () => { }
      },
      controlLayout: (element) => {

        const metaData = this.default.state.grid4;
        const containerHeight = element.offsetHeight // 그리드 컨테이너 높이
        const rowCount = 4; // 그리드 row 총 개수
        const rowHeight = Math.round(containerHeight / rowCount); // 각 row별 높이

        metaData.gridOption.header["height"] = rowHeight - 1;
        metaData.gridOption["rowHeight"] = rowHeight;
        metaData.gridOption["minRowHeight"] = rowHeight;
      },
      clean: (data) => {

        const cleanData = []; // 정제된 데이터배열
        const metaData = this.default.state.grid4;

        let rowMax = data[0]["__self"].length; // 특정지자체 데이터 개수

        // header변경

        if (rowMax > 0) {
          metaData.headerData[1]["header"] = data[0]["__self"][0]["cty_nm"];
        }

        // 특정지자체 데이터가 없을 경우
        if (rowMax === 0) {
          rowMax = data[1]["__around"].length // 전국데이터 개수
        }

        // 전국 데이터가 없을 경우
        if (rowMax === 0) {
          rowMax = data[2]["__all"].length // 유자지자체 개수
        }

        for (let i = 0; i < rowMax; i++) {

          let self = data[0]["__self"][i];
          let around = data[1]["__around"][i];
          let all = data[2]["__all"][i];

          cleanData[i] = {
            rank: i + 1,
            "__self": self ? self.excut_word : null,
            "__all": all ? all.excut_word : null,
            "__around": around ? around.excut_word : null
          }
        }

        return cleanData;
      },
      style: {
        head: "#0840B3",
        body: {
          odd: "white",
          even: "#D8DFEA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: false,
        rowHeight: 45,
        minRowHeight: 45,
        header: {
          height: 44
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        // minBodyHeight: "130"
      }
    },
    "grid5": {
      dataNm: "요즘 빈번한 주제",
      headerData: [{
        "header": "지역",
        "name": "full_nm",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "110"
      },
      {
        "header": "업무",
        "name": "job_type",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "80"
      },
      {
        "header": "계약번호",
        "name": "contract_no",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "120"
      },
      {
        "header": "계약건명",
        "name": "contract_nm",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto",
      },
      {
        "header": "계약금액(천원)",
        "name": "contract_price",
        "align": "right",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "120",
        formatter(obj) {
          const chun = Math.round(Number(obj.value) / 1000);
          return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      },
      {
        "header": "계약방법",
        "name": "contract_type",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "80"
      },
      {
        "header": "계약일자",
        "name": "contract_date_form",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "120"
      },
      {
        "header": "계약명2",
        "hidden": true,
        "name": "contract_nm2"
      }
      ],
      dataQuery: {
        ctycd: null, // 지역코드
        realmcd: null, // 분야코드
        idxcd: null, // 지수코드
        lastdt: null, // db데이터의 가장 최근 날짜
        limitM: 3 // 조회기간
      },
      dataURL: "/api/policy/keywordContList",
      dataLoc: "정책추천-페이지1",
      dataRootLoc: "recommend",
      onMouseEnter: {
        using: true,
        callback: () => { },
        key: "contract_nm"
      },
      onMouseClick: {
        using: true,
        callback: (data, vueInstance) => {

          if (data.rowKey !== undefined) {
            const dataNm = this.default.state.grid6.dataNm;
            const contractNm = data.contract_nm2;
            const contractNo = data.contract_no;

            // 구글 애널리틱스
            // vueInstance.$ga.event("policyrecom_contract_ " + dataNm, contractNm, contractNo) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드
            vueInstance.$ga.event("policyrecom_contract", contractNm, contractNo) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

            if (contractNo !== "") {
              window.open(
                "http://www.g2b.go.kr:8067/contract/contList.jsp?searchType=2&v_pagesize=10&page_no=1&bu_name=TcontSearchCall&whakjung_bnumber=" + contractNo,
                ""
                // "_blank"
              ); // 새창에서 열림

            }
          }
        }
      },
      controlLayout: (element) => { },
      clean: (data) => {
        const cleanData = data; // 정제된 데이터배열

        return cleanData;
      },
      style: {
        head: "#0840B3",
        body: {
          odd: "white",
          even: "#D8DFEA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 30,
        minRowHeight: 30,
        header: {
          height: 29
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        copyOptions: {
          useFormattedValue: true
        }
      }
    },
    "grid6": {
      dataNm: "유사 지자체에서 많이 수행한 주체",
      headerData: [{
        "header": "지역",
        "name": "full_nm",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "업무",
        "name": "job_type",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "80"
      },
      {
        "header": "계약번호",
        "name": "contract_no",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "계약건명",
        "name": "contract_nm",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "계약금액(천원)",
        "name": "contract_price",
        "align": "right",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto",
        formatter(obj) {
          const chun = Math.round(Number(obj.value) / 1000);
          return chun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      },
      {
        "header": "계약방법",
        "name": "contract_type",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "계약일자",
        "name": "contract_date_form",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "계약명2",
        "hidden": true,
        "name": "contract_nm2"
      }
      ],
      dataQuery: {
        ctycd: null, // 지역코드
        realmcd: null, // 분야코드
        idxcd: null // 지수코드
      },
      dataURL: "/api/policy/similarContList",
      dataLoc: "정책추천-페이지2",
      dataRootLoc: "recommend",
      onMouseEnter: {
        using: true,
        callback: () => { },
        key: "contract_nm"
      },
      onMouseClick: {
        using: true,
        callback: (data, vueInstance) => {
          if (data.rowKey !== undefined) {
            const dataNm = this.default.state.grid6.dataNm;
            const contractNm = data.contract_nm2;
            const contractNo = data.contract_no;

            // 구글 애널리틱스
            // vueInstance.$ga.event("policyrecom_contract_ " + dataNm, contractNm, contractNo) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드
            vueInstance.$ga.event("policyrecom_contract", contractNm, contractNo) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

            if (contractNo !== "") {
              window.open(
                "http://www.g2b.go.kr:8067/contract/contList.jsp?searchType=2&v_pagesize=10&page_no=1&bu_name=TcontSearchCall&whakjung_bnumber=" + contractNo,
                ""
                // "_blank"
              ); // 새창에서 열림

            }
          }
        }
      },
      controlLayout: (element) => { },
      clean: (data) => {
        const cleanData = data; // 정제된 데이터배열

        return cleanData;
      },
      style: {
        head: "#0840B3",
        body: {
          odd: "white",
          even: "#D8DFEA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 30,
        minRowHeight: 30,
        header: {
          height: 29
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        copyOptions: {
          useFormattedValue: true
        }
      }
    },
    "grid7": {
      dataNm: "관련 공공 데이터",
      headerData: [{
        "header": "순위",
        "name": "rank",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "200"
      },
      {
        "header": "데이터명",
        "name": "name",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "활용 분야",
        "name": "use_to",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "공급자",
        "name": "provider",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "데이터명2",
        "hidden": true,
        "name": "name2"
      }
      ],
      dataQuery: {
        ctycd: null,
        realmcd: null
      },
      dataURL: "/api/policy/publicList",
      dataLoc: "정책추천-페이지2",
      dataRootLoc: "recommend",
      onMouseEnter: {
        using: false,
        callback: () => { },
        key: null
      },
      onMouseClick: {
        using: true,
        callback: (data, vueInstance) => {
          if (data.rowKey !== undefined) {
            const url = data['link_url'];
            const dataNm = this.default.state.grid7.dataNm;
            const contractNm = data.name2;
            const contractNo = data.contract_no;

            // 구글 애널리틱스
            vueInstance.$ga.event("policyrecom_data", contractNm, contractNo) //  이벤트 종류, 이벤트 행동, 이벤트 신청 위치, 키워드

            if (url !== "") {
              window.open(
                url,
                ""
                // "_blank"
              ); // 새창에서 열림
            }
          }
        }
      },
      controlLayout: (element) => { },
      clean: (data) => {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      style: {
        head: "#0840B3",
        body: {
          odd: "white",
          even: "#D8DFEA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 30,
        minRowHeight: 30,
        header: {
          height: 29
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        copyOptions: {
          useFormattedValue: true
        }
      }
    },
    "grid8": {
      dataNm: "관련 민관 데이터",
      headerData: [{
        "header": "순위",
        "name": "rank",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "200"
      },
      {
        "header": "사업체명",
        "name": "name",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "사업 분야",
        "name": "bsns_nm",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "소재지역",
        "name": "region_nm",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      },
      {
        "header": "구분",
        "name": "company_type",
        "align": "center",
        "valign": "middle",
        "sortable": true,
        "sortingType": "desc",
        "width": "auto"
      }
      ],
      dataQuery: {
        ctycd: null,
        realmcd: null
      },
      dataURL: "/api/policy/privateList",
      dataLoc: "정책추천-페이지2",
      dataRootLoc: "ctystate",
      onMouseEnter: {
        using: false,
        callback: () => { },
        key: null
      },
      onMouseClick: {
        using: false,
        callback: () => { }
      },
      controlLayout: (element) => { },
      clean: (data) => {
        const cleanData = data; // 정제된 데이터배열
        return cleanData;
      },
      style: {
        head: "#0840B3",
        body: {
          odd: "white",
          even: "#D8DFEA"
        }
      },
      gridOption: {
        usageStatistics: false, // Google Analytic 사용
        scrollX: false,
        scrollY: true,
        rowHeight: 30,
        minRowHeight: 30,
        header: {
          height: 29
        },
        columnOptions: {
          resizable: false // 컬럼 넓이 조절
        },
        bodyHeight: "fitToParent",
        copyOptions: {
          useFormattedValue: true
        }
      }
    }
  },
  mutations: {

  },
  actions: {

  }
};
