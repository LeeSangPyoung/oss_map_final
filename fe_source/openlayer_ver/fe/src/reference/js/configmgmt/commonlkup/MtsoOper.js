/**
 * EpwrStcMgmtHeltrCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */


var maxGridRows = 100000;	// 그리드에 표기할 총 데이터 수
var rowPerPage = 100;		// 한 페이지당 표기할 데이터 수
var curPage = 1;			// 표기할 현재 페이지 번호

var rowPerPage2 = 100;		// 한 페이지당 표기할 데이터 수
var curPage2 = 1;			// 표기할 현재 페이지 번호

var srchStartDtm = "";
var srchEndDtm = "";

var countIp = 0;
var chartXValIp = [];
var JsonArrayIp = new Array();
var countPts = 0;
var chartXValPts = [];
var JsonArrayPts = new Array();
var countDu = 0;
var chartXValDu = [];
var JsonArrayDu = new Array();


var comMtsoOper = $a.page(function() {
	var gridId = 'dataGrid';
	var gridTrafficId = 'trafficGrid';
	var paramData = null;
	var selTimeTyp = "";	// 분단위/시단위 선택 구분값

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
    	initGrid();
    	initTrafficGrid('all');

		setEventListener();
		paramData = param;
		$('#mtsoOperLkupArea').setData(param);



		// 조회일자 Data Set
		var startDate = new Date().format("yyyy-MM-dd");
		var endDate = new Date().format("yyyy-MM-dd");
		$("#srchDt").val(dateAddRemove('R',startDate, 1));
		$("#srchStartDt").val(startDate);
		$("#srchEndDt").val(endDate);

		$('#divChart').progress();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/ipchart', param, 'GET', 'ipchart');

		var d = new Date().format("yyyy-MM-dd");
		var eDate = dateAdd(d, -1);
		searchDt = eDate.toString().replace("-","").replace("-","");

		param.searchDt = searchDt;

		resizeContents();
	}

	function resizeContents(){
    	var contentHeight = $("#mtsoOperLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

	function initGrid() {
		headerData = [{ numberingColumn: true, title: "No."           , width:  "50px", align: "right", hidden:true  },
			{ key: "faltGrCd"         , title: "알람등급"           , width:  "80px", align: "center", render: { type: "faltGrNmView" },
				tooltip: function(value, data, mapping) {
					return data.faltGrNm;		// faltGrNm(value, false);
				}
			},
			{ key: "jrdtHdofcOrgNm"  , title: "관할본부"           , width: "100px", align: "left"   },
			{ key: "jrdtTeamOrgNm"   , title: "관할팀"             , width: "120px", align: "left"   },
			{ key: "opHdofcOrgNm"    , title: "운용본부"           , width: "100px", align: "left"   },		// Access, Transport Only		// (2019.03.11월 Core/IP 경우에도 추가)
			{ key: "opTeamOrgNm"     , title: "운용팀"             , width: "120px", align: "left"   },		// Access, Transport Only		// (2019.03.11월 Core/IP 경우에도 추가)
			{ key: "evtTime"           , title: "발생시각"           , width: "130px", align: "center" },
			{ key: "rcovTime"          , title: "복구시각"           , width: "130px", align: "center" },		// (2019.06.17월 Access/Core FAULT 이면, 미표기)
			{ key: "srvcStopTime"     , title: "고장이장<br/>시간"  , width:  "80px", align: "right"  },		// (2018.05.29화 Access/Core FAULT 이면, 미표기)
			{ key: "almDivVal"        , title: "알람구분"           , width: "100px", align: "center", hidden: true },	// IP Only
			{ key: "uiAlmCdNm"       , title: "알람코드"           , width: "100px", align: "left"   },
		//	{ key: "SRS_ALM_YN"         , title: "KPI여부"            , width:  "80px", align: "center" },		// ROW Color로 대신함.
			{ key: "eqpClLvl1Nm"     , title: "장비구분"           , width:  "80px", align: "center" },
			{ key: "eqpClLvl2Nm"     , title: "장비중분류"         , width: "100px", align: "center", hidden: true },	// Transport Only
			{ key: "eqpClLvlDtlNm"  , title: "장비분류"           , width: "150px", align: "left"   },
			{ key: "grpId"             , title: "MME<br/>그룹"       , width:  "55px", align: "center" },				// Access Only
			{ key: "ipSrvcNetUsgNm" , title: "IP서비스망 용도"    , width: "120px", align: "left"  , hidden: true },	// IP Only
			{ key: "dablUnitNm"       , title: "장애<br/>단위"      , width:  "55px", align: "center", hidden: true },	// Core Only (2018.07.10화 추가). (2019.02.22금 항목명 변경: NFV구분 → 장애단위)
			{ key: "eqpNm"             , title: "장비명"             , width: "200px", align: "left"  },		// 항목명 다름. Access/IP/Transport 장비명, Core 대표장비명. (2018.04.09월 회선알람 icon 표기 추가)
			{ key: "svrEqpNm"         , title: "서버장비명"         , width: "150px", align: "left"  , hidden: true },	// Core Only
			{ key: "cardNm"            , title: "카드명"             , width: "120px", align: "left"  , hidden: true },	// IP, Transport Only		// (2019.01.17목 항목 추가)
			{ key: "imIfNm"           , title: "포트명"             , width: "100px", align: "left"  , hidden: true },	// IP, Transport Only		// (2017.07.17월 항목명 변경: IF명 → 포트명)
			{ key: "portAlsNm"        , title: "포트별명"           , width: "120px", align: "left"  , hidden: true },	// IP, Transport Only		// (2017.07.17월 항목명 변경: 포트별칭 → 포트별명)
			{ key: "quotaBdwhVal"     , title: "포트대역폭"         , width: "100px", align: "center", hidden: true },	// IP, Transport Only
			{ key: "srsPortYn"        , title: "중요포트<br/>여부"  , width:  "80px", align: "center", hidden: true },	// IP Only
			{ key: "uprEqpNm"         , title: "모기지국 정보"      , width: "200px", align: "left"   },				// Access Only
			{ key: "enbId"             , title: "eNB ID<br/>(MSC-RNC-NB)", width: "115px", align: "center" },			// Access Only				// (2017.11.14화 항목명 변경: eNB ID → eNB ID (MSC-RNC-NB))
			{ key: "splyBpNm"         , title: "제조사"             , width: "110px", align: "center" },		// 항목명 다름. Access/Core 제조사, IP/Transport 장비제조사
			{ key: "eqpMdlNm"         , title: "장비모델명"         , width: "130px", align: "left"  , hidden: true },	// IP, Transport Only
			{ key: "faltOccrLocCtt"  , title: "발생위치"           , width: "300px", align: "left"   },
			{ key: "almDesc"           , title: "발생원인"           , width: "300px", align: "left"   },
			{ key: "ipAddr"            , title: "IP주소"             , width: "110px", align: "left"  , hidden: true },	// IP, Transport Only
			{ key: "eqpOpStatNm"     , title: "운용상태"           , width: "100px", align: "center" },
			{ key: "repIntgFcltsCd"  , title: "공용시설코드"       , width: "110px", align: "left"   },				// Access Only
			{ key: "mtsoNm"            , title: "운용국사"           , width: "200px", align: "left"   },
			{ key: "topMtsoNm"        , title: "최상위 전송국사"    , width: "130px", align: "left"   },
			{ key: "ipMgmtNetLclNm" , title: "관리망 대분류"      , width: "110px", align: "left"  , hidden: true },	// IP Only
			{ key: "ipMgmtNetSclNm" , title: "관리망 소분류"      , width: "110px", align: "left"  , hidden: true },	// IP Only
			{ key: "ipMgmtSystmClNm", title: "관리시스템 분류"    , width: "130px", align: "left"  , hidden: true },	// IP Only
			{ key: "emsEqpNm"         , title: "EMS명"              , width: "100px", align: "left"   },				// Access, Core Only
			{ key: "emsEvtTime"       , title: "EMS 발생시각"       , width: "130px", align: "center", hidden: true },	// Transport Only
			{ key: "emsRcovTime"      , title: "EMS 복구시각"       , width: "130px", align: "center", hidden: true },	// Transport Only
			{ key: "mcpNm"             , title: "시도"               , width:  "60px", align: "center" },				// Access Only
			{ key: "sggNm"             , title: "시군구"             , width: "100px", align: "left"   },				// Access Only
		//	{ key: "TRTM_INF_NM"        , title: "조치내용"           , width: "200px", align: "left"   },		// (2017.06.13화 항목 미표기)
		//	{ key: "TRTM_INSR_ID"       , title: "조치자"             , width: "100px", align: "center" },		// (2017.06.13화 항목 미표기)
		//	{ key: "TRTM_INS_TIME"      , title: "조치입력시각"       , width: "130px", align: "center" },		// (2017.06.13화 항목 미표기)
			{ key: "clctTime"          , title: "수집시각"           , width: "130px", align: "center" },
			{ key: "recoTime"          , title: "인지시각"           , width: "130px", align: "center" },		// (2018.05.29화 Access/Core FAULT 이면, 미표기)
			{ key: "recopId"           , title: "인지자"             , width: "100px", align: "center" },		// (2018.05.29화 Access/Core FAULT 이면, 미표기)
			{ key: "istrId"            , title: "복구자"             , width: "100px", align: "left"   },		// (2018.07.06금 항목 추가. Access/Core FAULT 이면, 미표기)
			{ key: "ctnuOccrFaltNum" , title: "연속<br/>건수"      , width:  "55px", align: "right" , render: { type: "cntView" } },	// (2018.07.16월 `다발 → 연속` 변경)
		//	{ key: "FREQU_OCCR_FALT_NUM", title: "반복<br/>건수"      , width:  "55px", align: "right" , render: { type: "cntView" } },	// (2017.06.19월 항목 미표기)
			{ key: "workInfId"        , title: "작업정보ID"         , width: "130px", align: "left"   },
			{ key: "workInfCtt"       , title: "작업정보내용"       , width: "200px", align: "left"   },
			{ key: "imsiSumrCnt"      , title: "이용자수"           , width:  "80px", align: "right" , render: { type: "cntView" } },	// Access Only (2017.11.10금 항목명 변경: DU<br/>이용자수 → 이용자수)
			{ key: "srvcNetNm"        , title: "서비스"             , width: "110px", align: "left"   },
			{ key: "lineAlmCnt"       , title: "회선<br/>알람수"    , width:  "65px", align: "right"  }		// Access, IP, Transport Only (2018.04.09월 항목 추가)

		];
        $('#'+gridId).alopexGrid({
        	paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			height : '10row',
			paging: { enabledByPager: true, perPage: rowPerPage, pagerCount: 10, pagerSelect: false, hidePageList: "auto" },
			fitTableWidth: false,
			columnMapping : headerData,
			renderMapping: {
				faltGrNmView: {
					renderer: function(value, data, render, mapping, grid) {
						var viewVal = "";
						if (data.excsvOccrFaltYn == "Y") {
							viewVal = "다발";
						} else if (data.frequOccrFaltYn == "Y") {
							viewVal = "반복";
						}
						if (data.almStatVal == "A") {
							viewVal = "(" + data.almStatVal + ")" + viewVal;
						}
						return faltGrNm(value, true, viewVal);
					}
				},
				cntView: {
					renderer: function(value, data, render, mapping, grid) {
						if (value != null && value >= 1000) {
							return AlopexGrid.renderUtil.addCommas(value);
						} else {
							return value;
						}
					}
				}
			},
			rowOption: {
				styleclass: function(data, rowOption) {
					if (data["srsAlmYn"] == "Y") {
						return "kpi2";
					}
				}
			},

			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });


	}

	function initTrafficGrid(strGubun) {

    	if (strGubun == "all") {
    		var mappingN =  [{ align:'center', title : '순번', width: '40px', numberingColumn: true },
        		{ key : 'clctDt', align:'center', title : '일자', width: '110px' },
        		{ key : 'eqpNm', align:'left', title : '장비명', width: '150px' },
        		{ key : 'eqpTypNm', align:'center', title : '구분', width: '80px' },
        		{ key : 'eqpMdlNm', align:'left', title : '장비모델명', width: '150px' },
        		{ key : 'portNm', align:'center', title : '포트명', width: '150px' },
        		{ key : 'portDesc', align:'center', title : '포트별칭', width: '150px' },
        		{ key : 'ringNm', align:'center', title : '링명', width: '130px' },
        		{ key : 'speed', align:'center', title : '속도(Mb)', width: '100px' },
        		{ key : 'maxBpxHour', align:'center', title : 'Max시(1분)', width: '100px' },
        		{ key : 'maxBpsVal', align:'center', title : 'Max(1분,Mb)', width: '100px' },
        		{ key : 'maxUseRate', align:'center', title : '사용률(1분,%)', width: '100px' },
        		{ key : 'avgHour', align:'center', title : 'Max시(5분)', width: '100px' },
        		{ key : 'avgBpsVal', align:'center', title : 'Max(5분,Mb)', width: '100px' },
        		{ key : 'avgUseRate', align:'center', title : '사용률(1분,%)', width: '100px' },
        		{ key : 'busyHour', align:'center', title : '최번시', width: '100px' },
        		{ key : 'busyHourAvg', align:'center', title : '최번시평균(Mb)', width: '100px' },
        		{ key : 'useRate', align:'center', title : '사용률(%)', width: '100px' },
        		{ key : 'usemainEqpIpAddrRate', align:'center', title : '장비IP', width: '130px' }];
    	} else if(strGubun == "pts")  {
    		var mappingN =  [{ key : 'daily', align:'center', title : '일자', width: '90px' },
    			{ key : 'hdofc', align:'left', title : '본부', width: '130px' },
//    			{ key : 'team', align:'left', title : '팀', width: '110px' },
//    			{ key : 'trmsMtso', align:'left', title : '전송실', width: '150px' },
//    			{ key : 'mtsoTyp', align:'center', title : '국사유형', width: '110px' },
    			{ key : 'mtsoNm', align:'left', title : '국사명', width: '150px' },
    			{ key : 'lara', align:'center', title : '권역구분', width: '90px' },
    			{ key : 'srfcCd', align:'center', title : '대표통합시설코드', width: '130px' },
    			{ key : 'bldCd', align:'left', title : '건물코드', width: '130px' },
    			{ key : 'intgFcltsCd', align:'left', title : '주소', width: '180px'},
    			{ key : 'bldNm', align:'left', title : '건물명', width: '130px' },
    			{ key : 'duCount', align:'right', title : 'DU수', width: '50px' },
    			{ key : 'ruCount', align:'right', title : 'RU수', width: '50px' },
    			{ key : 'eqpMdl', align:'left', title : '장비모델', width: '150px' },
    			{ key : 'ringNm', align:'left', title : '링명', width: '160px' },
    			{ key : 'eqpNm', align:'left', title : '장비명', width: '180px' },
    			{ key : 'cardNm', align:'left', title : '카드명', width: '110px' },
    			{ key : 'cardMdl', align:'left', title : '카드모델', width: '150px' },
    			{ key : 'portNm', align:'left', title : '포트명', width: '180px' },
    			{ key : 'speed', align:'right', title : '속도(Mb)', width: '90px' },
    			{ key : 'srvcNm', align:'center', title : '서비스명', width: '100px' },
    			{ key : 'maxBpxHour', align:'center', title : 'MAX시(1분)', width: '90px' },
    			{ key : 'maxBpsVal', align:'right', title : 'MAX(1분,Mb)', width: '100px' },
    			{ key : 'maxUseRate', align:'right', title : '사용률(1분,%)', width: '100px' },
    			{ key : 'avgHour', align:'center', title : 'MAX시(5분)', width: '90px' },
    			{ key : 'avgBpsVal', align:'right', title : 'MAX(5분,Mb)', width: '100px' },
    			{ key : 'avgUseRate', align:'right', title : '사용률(5분,%)', width: '100px' },
    			{ key : 'busyHour', align:'center', title : '최번시', width: '90px' },
    			{ key : 'busyHourAvg', align:'right', title : '최번시평균(Mb)', width: '100px' },
    			{ key : 'useRate', align:'right', title : '사용률(%)', width: '80px' },
    			{ key : 'dpsTotSumr', align:'right', title : 'DPS총계', width: '100px' },
    			{ key : 'eqpIp', align:'left', title : '장비IP', width: '100px' }];

    	} else if(strGubun == "l2sw")  {
    		var mappingN =  [{ key : 'clctDt', align:'center', title : '일자', width: '90px' },
//    			{ key : 'orgNm', align:'left', title : '본부', width: '130px' },
//    			{ key : 'teamNm', align:'left', title : '팀', width: '130px' },
//    			{ key : 'trmsMtsoNm', align:'left', title : '전송실', width: '130px' },
//    			{ key : 'mtsoTypNm', align:'center', title : '국사유형', width: '120px' },
    			{ key : 'mtsoNm', align:'left', title : '국사명', width: '130px' },
    			{ key : 'adstNm', align:'center', title : '권역구분', width: '90px' },
    			{ key : 'repIntgFcltsCd', align:'center', title : '대표통합시설코드', width: '130px'},
    			{ key : 'bldCd', align:'left', title : '건물코드', width: '130px' },
    			{ key : 'intgFcltsCd', align:'left', title : '주소',	},
    			{ key : 'bldNm', align:'left', title : '건물명', width: '130px' },
    			{ key : 'ptsG10Nm', align:'center', title : '10G PTS', width: '80px' },
    			{ key : 'ptsG1Nm', align:'center', title : '1G PTS', width: '80px' },
    			{ key : 'eqpTypNm', align:'center', title : '구분', width: '60px' },
    			{ key : 'eqpMdlNm', align:'left', title : '장비모델', width: '130px' },
    			{ key : 'eqpNm', align:'left', title : '장비명', width: '200px' },
    			{ key : 'portNm', align:'left', title : '포트명', width: '150px' },
    			{ key : 'portAlsNm', align:'left', title : '포트별명', width: '130px' },
    			{ key : 'userDesc', align:'left', title : '포트설명', width: '150px' },
    			{ key : 'duIpAddr', align:'left', title : 'DU IP', width: '100px' },
    			{ key : 'vlanNo', align:'left', title : 'VLAN', width: '100px' },
    			{ key : 'portSpedVal', align:'right', title : '속도(Mb)', width: '90px' },
    			{ key : 'mgmtDivCd', align:'center', title : '관리', width: '60px' },
    			{ key : 'operDivCd', align:'center', title : '운영', width: '60px' },
    			{ key : 'max', align:'center', title : 'MAX시(5분)', width: '100px' },
    			{ key : 'maxMb', align:'right', title : 'MAX(5분,Mb)', width: '100px' },
    			{ key : 'useRate5', align:'right', title : '사용률(5분,%)', width: '100px' },
    			{ key : 'busyHour', align:'center', title : '최번시', width: '70px' },
    			{ key : 'busyHourAvg', align:'right', title : '최번시평균(Mb)', width: '110px' },
    			{ key : 'useRate', align:'right', title : '사용률(%)', width: '90px' },
    			{ key : 'mainEqpIpAddr', align:'left', title : '장비IP', width: '100px' }];

    	} else if(strGubun == "ip")  {
    		var mappingN =  [{ key : 'daily', align:'center', title : '일자', width: '100px' },
    			//{ key : 'weekly', align:'center', title : '주차', width: '100px' },
    			//{ key : 'monthly', align:'center', title : '월', width: '100px' },
//    			{ key : 'orgNm', align:'left', title : '본부', width: '130px' },
//    			{ key : 'teamNm', align:'left', title : '팀', width: '120px' },
//    			{ key : 'trmsMtsoNm', align:'left', title : '전송실', width: '120px' },
//    			{ key : 'mtsoTypNm', align:'left', title : '국사유형', width: '110px' },
    			{ key : 'mtsoNm', align:'left', title : '국사명', width: '130px' },
    			{ key : 'adstNm', align:'center', title : '권역구분', width: '100px' },
    			{ key : 'repIntgFcltsCd', align:'center', title : '대표통합시설코드', width: '130px' },
    			{ key : 'bldCd', align:'left', title : '건물코드', width: '130px' },
    			{ key : 'intgFcltsCd', align:'left', title : '주소',	width: '180px' },
    			{ key : 'bldNm', align:'left', title : '건물명', width: '130px' },
    			{ key : 'eqpTypNm', align:'left', title : '구분', width: '110px' },
    			{ key : 'eqpMdlNm', align:'left', title : '장비모델', width: '130px' },
    			{ key : 'ringNm', align:'left', title : '링명', width: '130px' },
    			{ key : 'eqpNm', align:'left', title : '장비명', width: '150px' },
    			{ key : 'korNm', align:'left', title : '장비명(한글)', width: '130px' },
    			{ key : 'portNm', align:'left', title : '포트명', width: '130px' },
    			{ key : 'portAlsNm', align:'left', title : '포트별명', width: '130px' },
    			{ key : 'userDesc', align:'left', title : '포트설명', width: '130px' },
    			{ key : 'physPort', align:'left', title : '물리포트', width: '100px' },
    			{ key : 'duIpAddr', align:'left', title : 'DU IP', width: '110px' },
    			{ key : 'vlanNo', align:'left', title : 'VLAN', width: '110px' },
    			{ key : 'portSpedVal', align:'right', title : '속도(Mb)', width: '100px' },
    			{ key : 'mgmtDivCd', align:'center', title : '관리', width: '90px' },
    			{ key : 'operDivCd', align:'center', title : '운영', width: '90px' },
    			{ key : 'max1', align:'center', title : 'MAX시(1분)', width: '90px' },
    			{ key : 'max1Mb', align:'right', title : 'MAX(1분,Mb)', width: '110px' },
    			{ key : 'useRate1', align:'right', title : '사용률(1분,%)', width: '90px' },
    			{ key : 'max5', align:'center', title : 'MAX시(5분)', width: '90px' },
    			{ key : 'max5Mb', align:'right', title : 'MAX(5분,Mb)', width: '110px' },
    			{ key : 'useRate5', align:'right', title : '사용률(5분,%)', width: '110px' },
    			{ key : 'busyHour', align:'center', title : '최번시', width: '90px' },
    			{ key : 'busyHourAvg', align:'right', title : '최번시평균(Mb)', width: '110px' },
    			{ key : 'useRate', align:'right', title : '사용률(%)', width: '90px' },
    			{ key : 'mainEqpIpAddr', align:'left', title : '장비IP', width: '100px' }];

    	} else if(strGubun == "du")  {
    		var mappingN =  [{ key : 'clctDt', align:'center', title : '일자', width: '100px' },
//    			{ key : 'orgNm', align:'left', title : '본부명', width: '130px' },
//    			{ key : 'teamNm', align:'left', title : '팀명', width: '120px' },
//    			{ key : 'trmsMtsoNm', align:'left', title : '전송실명', width: '120px'},
    			{ key : 'bldCd', align:'left', title : '건물코드', width: '130px' },
    			{ key : 'intgFcltsCd', align:'left', title : '주소',	width: '180px'},
    			{ key : 'bldNm', align:'left', title : '건물명', width: '130px' },
    			{ key : 'repIntgFcltsCd', align:'center', title : '공용대표시설코드', width: '130px' },
    			{ key : 'mtsoTypNm', align:'left', title : '국사유형명', width: '100px' },
    			{ key : 'svlnNo', align:'left', title : '회선번호', width: '110px' },
    			{ key : 'svlnNm', align:'left', title : 'DU명', width: '180px' },
    			{ key : 'intgFcltsNm', align:'left', title : '통합시설코드명', width: '200px' },
    			{ key : 'repNm', align:'left', title : '공용대표시설코드명', width: '180px' },
    			{ key : 'duVendNm', align:'center', title : 'DU제조사', width: '100px' },
    			{ key : 'mtsoAddr', align:'left', title : '국사주소', width: '200px' },
    			{ key : 'mtsoStNmAddr', align:'left', title : '국사신주소', width: '150px' },
    			{ key : 'adstNm', align:'center', title : '권역구분', width: '90px' },
    			{ key : 'duCtyDivVal1', align:'center', title : '도심구분1', width: '90px' },
    			{ key : 'duCtyDivVal2', align:'center', title : '도심구분2', width: '90px' },
    			{ key : 'duRuCnt', align:'center', title : 'RU수', width: '70px' },
    			{ key : 'duCellCnt', align:'center', title : '셀수', width: '90px' },
    			{ key : 'eqpNm', align:'left', title : '장비#0', width: '130px' },
    			{ key : 'portId', align:'left', title : '포트DSCR', width: '130px' },
    			{ key : 'portSpedVal', align:'right', title : '포트용량', width: '110px' },
    			{ key : 'maxValStdHour', align:'center', title : '최번시', width: '70px' },
    			{ key : 'maxBpsVal', align:'right', title : 'MAX BPS', width: '110px' },
    			{ key : 'eqpNm1', align:'left', title : '장비#1', width: '130px' },
    			{ key : 'ulnkPortId1', align:'left', title : 'UP 포트DESCR', width: '130px' },
    			{ key : 'ulnkPortSpedVal1', align:'right', title : 'UP 포트용량', width: '110px' },
    			{ key : 'ulnkMaxValStdHour1', align:'center', title : 'UP 포트 최번시', width: '120px' },
    			{ key : 'ulnkMaxBpsVal1', align:'right', title : 'UP 포트 MAX BPS', width: '140px' },
    			{ key : 'dlnkPortId1', align:'left', title : 'DN 포트 DESCR', width: '130px' },
    			{ key : 'dlnkPortSpedVal1', align:'right', title : 'DN 포트 용량', width: '110px' },
    			{ key : 'dlnkMaxValStdHour1', align:'center', title : 'DN 포트 최번시', width: '120px' },
    			{ key : 'dlnkMaxBpsVal1', align:'right', title : 'DN 포트 MAX BPS', width: '140px' },
    			{ key : 'eqpNm2', align:'left', title : '장비#2', width: '130px' },
    			{ key : 'ulnkPortId2', align:'left', title : 'UP 포트 DESCR', width: '110px' },
    			{ key : 'ulnkPortSpedVal2', align:'right', title : 'UP 포트 용량', width: '110px' },
    			{ key : 'ulnkMaxValStdHour2', align:'center', title : 'UP 포트 최번시', width: '120px' },
    			{ key : 'ulnkMaxBpsVal2', align:'right', title : 'UP 포트 MAX BPS', width: '140px' },
    			{ key : 'dlnkPortId2', align:'left', title : 'DN 포트 DESCR', width: '130px' },
    			{ key : 'dlnkPortSpedVal2', align:'right', title : 'DN 포트 용량', width: '150px' },
    			{ key : 'dlnkMaxValStdHour2', align:'center', title : 'DN 포트 최번시', width: '150px' },
    			{ key : 'dlnkMaxBpsVal2', align:'right', title : 'DN 포트 MAX BPS', width: '150px' },
    			{ key : 'eqpNm3', align:'center', title : '장비#3', width: '110px' },
    			{ key : 'ulnkPortId3', align:'left', title : 'UP 포트 DESCR', width: '110px' },
    			{ key : 'ulnkPortSpedVal3', align:'right', title : 'UP 포트 용량', width: '140px' },
    			{ key : 'ulnkMaxValStdHour3', align:'center', title : 'UP 포트 최번시', width: '150px' },
    			{ key : 'ulnkMaxBpsVal3', align:'right', title : 'UP 포트 MAX BPS', width: '130px' },
    			{ key : 'dlnkPortId3', align:'left', title : 'DN 포트 DESCR', width: '130px' },
    			{ key : 'dlnkPortSpedVal3', align:'right', title : 'DN 포트 용량', width: '110px' },
    			{ key : 'dlnkMaxValStdHour3', align:'center', title : 'DN 포트 최번시', width: '110px' },
    			{ key : 'dlnkMaxBpsVal3', align:'right', title : 'DN 포트 MAX BPS', width: '150px' },
    			{ key : 'eqpNm4', align:'left', title : '장비#4', width: '130px' },
    			{ key : 'ulnkPortId4', align:'left', title : 'UP 포트 DESCR', width: '130px' },
    			{ key : 'ulnkPortSpedVal4', align:'right', title : 'UP 포트 용량', width: '100px' },
    			{ key : 'ulnkMaxValStdHour4', align:'center', title : 'UP 포트 최번시', width: '110px' },
    			{ key : 'ulnkMaxBpsVal4', align:'right', title : 'UP 포트 MAX BPS', width: '150px' },
    			{ key : 'dlnkPortId4', align:'left', title : 'DN 포트 DESCR', width: '130px' },
    			{ key : 'dlnkPortSpedVal4', align:'right', title : 'DN 포트 용량', width: '100px' },
    			{ key : 'dlnkMaxValStdHour4', align:'center', title : 'DN 포트 최번시', width: '110px' },
    			{ key : 'dlnkMaxBpsVal4', align:'right', title : 'DN 포트 MAX BPS', width: '140px' },
    			{ key : 'duBsyHour', align:'center', title : 'DU 최번시', width: '90px' },
    			{ key : 'duDwldTrfVal', align:'right', title : 'DU DOWN Mb', width: '90px' },
    			{ key : 'duUladTrfVal', align:'right', title : 'DU UP Mb', width: '90px' }];

    	}

        $('#'+gridTrafficId).alopexGrid({
        	paging : {
				hidePageList: false  // pager 중앙 삭제
			},
			paging: { enabledByPager: true, perPage: rowPerPage, pagerCount: 10, pagerSelect: false, hidePageList: "auto" },
        	cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,

             numberingColumnFromZero : false
    	   ,
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row",message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            columnMapping : mappingN
        });

    }


	function faltGrNm(val, flag, innerText) {
		if (!innerText) {
			innerText = "&nbsp;";
		}

		switch(val) {
			case "1"		 :
				return (flag == true) ? "<span class='sort remark_red'>" + innerText + "</span>"		: "Critical"; 	break;
			case "2"		 :
				return (flag == true) ? "<span class='sort remark_orange'>" + innerText + "</span>" 	: "Major"; 		break;
			case "3"		 :
				return (flag == true) ? "<span class='sort remark_yellow'>" + innerText + "</span>"		: "Minor"; 		break;
			case "4"		 :
				return (flag == true) ? "<span class='sort remark_green'>" + innerText + "</span>"		: "Warning"; 	break;
			case "5"		 :
				return (flag == true) ? "<span class='sort remark_blue'>" + innerText + "</span>" 		: "Info"; 		break;
			case "Kpi"	 :
				return (flag == true) ? "<span class='sort remark_brown'>" + innerText + "</span>" 		: "Kpi"; 		break;
			case "Critical"		 :
				return "1"; break;
			case "Major"		 :
				return "2"; break;
			case "Minor"		 :
				return "3"; break;
			case "Warning"		 :
				return "4"; 	break;
			case "Info"		 :
				return "5"; 	break;
			default: return val; 			break;
		}
	}

	Date.prototype.format = function(f) {
	    if (!this.valueOf()) return " ";
	    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var d = this;
	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};

	Number.prototype.zf = function(len){return prependZeor(this, len);};
	function prependZeor(num, len) {
		while(num.toString().length < len) {
			num = "0"+num;
		}
		return num;
	}


	function setEventListener() {

		var option_data =  [];
		for(var i=0; i < 24; i++){
			var tmpH =  NumberPad(i, 2);
			var resObj = {cd:tmpH, cdNm : tmpH};
			option_data.push(resObj);
		}
		$('#srchStartHh').setData({ data:option_data });
		$("#srchStartHh").val("00");

		$('#srchEndHh').setData({ data:option_data });
		$("#srchEndHh").val("23");

		var option_data =  [];
		for(var i=0; i < 60; i++){
			var tmpM =  NumberPad(i, 2);
			var resObj = {cd:tmpM, cdNm : tmpM};
			option_data.push(resObj);
		}
		$('#srchStartMi').setData({ data:option_data });
		$("#srchStartMi").val("00");

		$('#srchEndMi').setData({ data:option_data });
		$("#srchEndMi").val("59");


		var perPage = 100;
		// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			comMtsoOper.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			comMtsoOper.setGrid(1, eObj.perPage);
		});

		$('input[name="srchAlmCdNmYn"]:radio').on("change", function(e) {
			var val = $(this).val();
			if (val == "Y") {
				$("#srchAlmCdNm")[0].placeholder = "알람코드를 입력하세요";
			} else if (val == "N") {
				$("#srchAlmCdNm")[0].placeholder = "알람 발생원인을 입력하세요";
			}
		});

		$('#btnTrafficSearch').on("click", function(e) {
			comMtsoOper.setTrafficGrid(1,100);
		});

		$('#btnSearch').on("click", function(e) {
			comMtsoOper.setGrid(1,100);
		});



		$('#btnYesterday').on("click", function(e) {
			var srchStartDt = new Date().format("yyyy-MM-dd").toString();
			srchStartDt = dateAddRemove('R', srchStartDt, 1);
			$("#srchStartDt").val(srchStartDt);
			$("#srchStartHh").val("00");
			$("#srchStartMi").val("00");
			var srchEndDt = new Date().format("yyyy-MM-dd").toString();
			srchEndDt = dateAddRemove('R', srchEndDt, 1);
			$("#srchEndDt").val(srchEndDt);
			$("#srchEndHh").val("23");
			$("#srchEndMi").val("59");


		});

		$('#btnOneWeek').on("click", function(e) {
			var srchStartDt = new Date().format("yyyy-MM-dd").toString();
			srchStartDt = dateAddRemove('R', srchStartDt, 6);
			$("#srchStartDt").val(srchStartDt);
			$("#srchStartHh").val("00");
			$("#srchStartMi").val("00");
			var srchEndDt = new Date().format("yyyy-MM-dd").toString();
			$("#srchEndDt").val(srchEndDt);
			$("#srchEndHh").val("23");
			$("#srchEndMi").val("59");
		});

		$('#btnToday').on("click", function(e) {
			var srchStartDt = new Date().format("yyyy-MM-dd").toString();
			$("#srchStartDt").val(srchStartDt);
			$("#srchStartHh").val("00");
			$("#srchStartMi").val("00");
			var srchEndDt = new Date().format("yyyy-MM-dd").toString();
			$("#srchEndDt").val(srchEndDt);
			$("#srchEndHh").val("23");
			$("#srchEndMi").val("59");
		});

		$('input[name="searchGubun"]:checkbox').on("change", function(e) {
			var searchGubun = $("input:checkbox[id=searchGubun]").is(":checked") ? true : false;
			var tmpSearch = "N";
			if (searchGubun) {
				tmpSearch = "Y";
			}
			$('#divChart').progress();
			var mtsoId = $("#mtsoId").val();
			var paramData =  {tmpSearch :  tmpSearch, mtsoId : mtsoId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/ipchart', paramData, 'GET', 'ipchart');
    	});



		var perPage2 = 100;
		// 페이지 번호 클릭시
		$('#'+gridTrafficId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			comMtsoOper.setTrafficGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridTrafficId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			comMtsoOper.setTrafficGrid(1, eObj.perPage);
		});

	};

	function dateAddRemove(sGubun, sDate, sNum) {
		var sDate = sDate.split("-");
		var yy = parseInt(sDate[0]);
		var mm = parseInt(sDate[1]);
		var dd = parseInt(sDate[2]);
		if (sGubun == 'R') {
			var d = new Date(yy, mm -1, dd - sNum);
		} else {
			var d = new Date(yy, mm -1, dd + sNum);
		}
		yy = d.getFullYear();
		mm = d.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;
		dd = d.getDate(); dd = (dd < 10) ? '0' + dd : dd;
		return '' + yy + '-' + mm + '-' + dd;

	}


	this.setGrid = function(page, rowPerPage){

		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);


		var startDate = new Date().format("yyyy-MM-dd");
		var endDate = new Date().format("yyyy-MM-dd");

		var srchStartDt = $("#srchStartDt").val();
		var srchEndDt = $("#srchEndDt").val();
		if (srchStartDt == null || srchStartDt == undefined || srchStartDt == "") {
			$("#srchStartDt").val(startDate);
		}
		if (srchEndDt == null || srchEndDt == undefined || srchEndDt == "") {
			$("#srchEndDt").val(endDate);
		}
		$("#srchStartDtm").val($("#srchStartDt").val() + " " + $("#srchStartHh").val() + ":" + $("#srchStartMi").val() + ":00");
		$("#srchEndDtm").val($("#srchEndDt").val() + " " + $("#srchEndHh").val() + ":" + $("#srchEndMi").val() + ":59");

		var param =  $("#searchForm").serialize();
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alarmlist', param, 'GET', 'search');
	}


	this.setTrafficGrid = function(page, rowPerPage){

		$('#pageNo2').val(page);
		$('#rowPerPage2').val(rowPerPage);
		var rdGubun = $('input:radio[name=rdGubun]:checked').val();

		initTrafficGrid(rdGubun);

		var clctDt = $("#srchDt").val();
		if (clctDt == null || clctDt == undefined || clctDt == "") {

		} else {
			$('#'+gridTrafficId).alopexGrid('showProgress');
			//var param =  $("#searchForm").serialize();

			var mtsoId		= $('#mtsoId').val();
			var eqpId		= $('#eqpId').val();
			var eqpNm		= $('#srchEqpNm').val();
			var pageNo		= $('#pageNo2').val();
			var rowPerPage 	= $('#rowPerPag2').val();

			clctDt = clctDt.replace("-","").replace("-","");

			var param = {mtsoId : mtsoId, eqpId : eqpId, eqpNm : eqpNm, pageNo : pageNo, rowPerPage : rowPerPage, clctDt : clctDt};
			if (rdGubun == "all") {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alltrafficlist', param, 'GET', 'alltrafficlist');
			} else if (rdGubun == "ip") {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/ipBackhaulTrafficlist', param, 'GET', 'alltrafficlist');
			} else if (rdGubun == "l2sw") {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/l2SWTrafficlist', param, 'GET', 'alltrafficlist');
			} else if (rdGubun == "pts") {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/representTrafficMainlist', param, 'GET', 'alltrafficlist');
			} else if (rdGubun == "du") {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/e2EDataLineTrafficLkuplist', param, 'GET', 'alltrafficlist');
			}
		}
	}

	function dateAdd(sDate, nDays) {
		var yy = parseInt(sDate.substr(0,4), 10);
		var mm = parseInt(sDate.substr(5,2), 10);
		var dd = parseInt(sDate.substr(8), 10);

		d = new Date(yy, mm-1, dd + nDays);

		yy = d.getFullYear();
		mm = d.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;
		dd = d.getDate(); dd = (dd < 10) ? '0' + dd : dd;

		return '' + yy + '-' + mm + '-' + dd;

	}

	function chartAdd() {
		var SumCount = countIp + countPts + countDu;
		$('#divChart').progress().remove();
		$("#divChart").html("");
		var appendStr = "<table style='width:100%;'>";

		if (SumCount == 0) {
			appendStr += "<tr><td style='text-align:center;height:200px;'>조회된 데이터가 없습니다</td></tr>";
		} else if (SumCount == 1) {
			var tmpId = "";
			var tmpText = "";
			if (countIp == 1) {
				tmpId = "ipContainer";
				tmpText = "IP 백홀 트래픽(TB)";
			} else if (countPts == 1) {
				tmpId = "ptsContainer";
				tmpText = "PTS/L2SW 트래픽(TB)";
			}  else if (countDu == 1) {
				tmpId = "duContainer";
				tmpText = "DU 트래픽(TB)";
			}
			appendStr += "<tbody>";
			appendStr += "<tr><td style='text-align:center;height:200px;'>";
			appendStr += "<div id='"+tmpId+"' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
			appendStr += "<div style='width:100%;text-align:center;'><b>"+tmpText+"</b></div>";
			appendStr += "</td></tr>";
		} else if (SumCount == 2) {
			var tmpId = "";
			var tmpText = "";
			var tmpId2 = "";
			var tmpText2 = "";
			if (countIp == 1) {
				tmpId = "ipContainer";
				tmpText = "IP 백홀 트래픽(TB)";
				if (countPts == 1) {
					tmpId2 = "ptsContainer";
					tmpText2 = "PTS/L2SW 트래픽(TB)";
				} else {
					tmpId2 = "duContainer";
					tmpText2 = "DU 트래픽(TB)";
				}
			} else {
				tmpId = "ptsContainer";
				tmpText = "PTS/L2SW 트래픽(TB)";
				tmpId2 = "duContainer";
				tmpText2 = "DU 트래픽(TB)";
			}
			appendStr += "<colgroup>";
			appendStr += "<col style='width:50%;' />";
			appendStr += "<col style='width:50%;' />";
			appendStr += "</colgroup>";
			appendStr += "<tbody>";
			appendStr += "<tr>";
			appendStr += "<td style='text-align:center;height:200px;'><div id='"+tmpId+"' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
			appendStr += "<div style='width:100%;text-align:center;'><b>"+tmpText+"</b></div></td>";
			appendStr += "<td style='text-align:center;height:200px;'><div id='"+tmpId2+"' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
			appendStr += "<div style='width:100%;text-align:center;'><b>"+tmpText2+"</b></div></td>";
			appendStr += "</tr>";
		} else if (SumCount == 3) {
			appendStr += "<colgroup>";
			appendStr += "<col style='width:33%;' />";
			appendStr += "<col style='width:33%;' />";
			appendStr += "<col style='width:34%;' />";
			appendStr += "</colgroup>";
			appendStr += "<tbody>";
			appendStr += "<tr>";
			appendStr += "<td style='text-align:center;height:200px;'><div id='ipContainer' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
			appendStr += "<div style='width:100%;text-align:center;'><b>IP 백홀 트래픽(TB)</b></div></td>";
			appendStr += "<td style='text-align:center;height:200px;'><div id='ptsContainer' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
			appendStr += "<div style='width:100%;text-align:center;'><b>PTS/L2SW 트래픽(TB)</b></div></td>";
			appendStr += "<td style='text-align:center;height:200px;'><div id='duContainer' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
			appendStr += "<div style='width:100%;text-align:center;'><b>DU 트래픽(TB)</b></div></td>";
			appendStr += "</tr>";
		}
		appendStr += "</tbody>";
		appendStr += "</table>";
		$("#divChart").append(appendStr);

		if (countIp > 0) {
			Highcharts.chart('ipContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXValIp },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
				legend:{ layout: 'horizontal', align:'center', verticalAlign:'top' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArrayIp,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
		}
		if (countPts > 0) {
			Highcharts.chart('ptsContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXValPts },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
				legend:{ layout: 'horizontal', align:'center', verticalAlign:'top' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArrayPts,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
		}
		if (countDu > 0) {
			Highcharts.chart('duContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXValDu },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
				legend:{ layout: 'horizontal', align:'center', verticalAlign:'top' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArrayDu,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
		}
		$('#divChart').progress().remove();
	}

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.mtsoOperAlarm);
		}

		if(flag == 'alltrafficlist'){
			$('#'+gridTrafficId).alopexGrid('hideProgress');
			setSPGrid(gridTrafficId, response, response.alltrafficlist);
		}


		if(flag == 'ipchart'){
			var tmpNm = [];
			JsonArrayIp.length = 0;
			if (response.ipchart.length == 0) {
				countIp = 0;
			} else {
				countIp = 1;
				$.each(response.ipchart, function(i, item){
					var conData = response.ipchart[i].eqpMdlNm;
					tmpNm.push(conData);
				});
				var uniqueNames = [];
				$.each(tmpNm, function(i, el) {
					if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
				});
				for(j = 0; j < uniqueNames.length; j++) {
					var eqpMdlNm = uniqueNames[j];
					var tmpData = 0;
					var chartData =[];
					$.each(response.ipchart, function(i, item) {
						var clctDt = response.ipchart[i].clctDt.substring(4,9);
						if (eqpMdlNm == response.ipchart[i].eqpMdlNm) {
							chartXValIp.push(clctDt)
							if (response.ipchart[i].sumBpsVal == null || response.ipchart[i].sumBpsVal == undefined || response.ipchart[i].sumBpsVal == "") {
								tmpData = 0;
							} else {
								tmpData = Math.round(parseFloat(response.ipchart[i].sumBpsVal)/1000,2);
							}
							chartData.push(tmpData);
						}
					});
				}
				var arrData = {name : eqpMdlNm, data : chartData};
				JsonArrayIp.push(arrData);
			}

			var searchGubun = $("input:checkbox[id=searchGubun]").is(":checked") ? true : false;
			var tmpSearch = "N";
			if (searchGubun) {
				tmpSearch = "Y";
			}
			var mtsoId =  $("#mtsoId").val();
			var paramData = {searchGubun : tmpSearch, mtsoId : mtsoId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/ptschart', paramData, 'GET', 'ptschart');

		}
		if(flag == 'ptschart'){

			var tmpNm = [];
			JsonArrayPts.length = 0;
			if (response.ptschart.length == 0) {
				countPts = 0;
			} else {
				countPts = 1;
				$.each(response.ptschart, function(i, item){
					var conData = response.ptschart[i].eqpMdlNm;
					tmpNm.push(conData);
				});
				var uniqueNames = [];
				$.each(tmpNm, function(i, el) {
					if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
				});
				for(j = 0; j < uniqueNames.length; j++) {
					var eqpMdlNm = uniqueNames[j];
					var tmpData = 0;
					var chartData =[];
					$.each(response.ptschart, function(i, item) {
						var clctDt = response.ptschart[i].clctDt.substring(4,9);
						if (eqpMdlNm == response.ptschart[i].eqpMdlNm) {
							chartXValPts.push(clctDt)
							if (response.ptschart[i].sumBpsVal == null || response.ptschart[i].sumBpsVal == undefined || response.ptschart[i].sumBpsVal == "") {
								tmpData = 0;
							} else {
								tmpData = Math.round(parseFloat(response.ptschart[i].sumBpsVal)/1000,2);
							}
							chartData.push(tmpData);
						}
					});
				}
				var arrData = {name : eqpMdlNm, data : chartData};
				JsonArrayPts.push(arrData);
			}
			var searchGubun = $("input:checkbox[id=searchGubun]").is(":checked") ? true : false;
			var tmpSearch = "N";
			if (searchGubun) {
				tmpSearch = "Y";
			}
			var mtsoId =  $("#mtsoId").val();
			var paramData = {searchGubun : tmpSearch, mtsoId : mtsoId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/duchart', paramData, 'GET', 'duchart');

		}
		if(flag == 'duchart'){
			var tmpNm = [];
			JsonArrayDu.length = 0;
			if (response.duchart.length == 0) {
				countDu = 0;
			} else {
				countDu = 1;
				$.each(response.duchart, function(i, item){
					var conData = response.duchart[i].eqpMdlNm;
					tmpNm.push(conData);
				});
				var uniqueNames = [];
				$.each(tmpNm, function(i, el) {
					if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
				});
				for(j = 0; j < uniqueNames.length; j++) {
					var eqpMdlNm = uniqueNames[j];
					var tmpData = 0;
					var chartData =[];
					$.each(response.duchart, function(i, item) {
						var clctDt = response.duchart[i].clctDt.substring(4,9);
						if (eqpMdlNm == response.duchart[i].eqpMdlNm) {
							chartXValDu.push(clctDt)
							if (response.duchart[i].sumBpsVal == null || response.duchart[i].sumBpsVal == undefined || response.duchart[i].sumBpsVal == "") {
								tmpData = 0;
							} else {
								tmpData = Math.round(parseFloat(response.duchart[i].sumBpsVal)/1000,2);
							}
							chartData.push(tmpData);
						}
					});
				}
				var arrData = {name : eqpMdlNm, data : chartData};
				JsonArrayDu.push(arrData);
			}

			setTimeout(chartAdd(), 3000);

		}

	}
	//request 실패시.
	function failCallback(response, status, jqxhr, flag){}

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 			//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 		//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
	function NumberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}

});