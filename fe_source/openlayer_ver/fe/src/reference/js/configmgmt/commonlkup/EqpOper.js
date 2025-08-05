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


var comEqpOper = $a.page(function() {
	var gridId = 'dataGrid';
	var gridTrafficId = 'trafficGrid';
	var paramData = null;
	var selTimeTyp = "";	// 분단위/시단위 선택 구분값

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
    	initGrid();

    	var strGubun = '1m';

    	if(param.eqpRoleDivCd =="05") {
    		strGubun = '1m';
    		$('#rdGubun_1').setSelected();
    	}
    	else if (param.eqpRoleDivCd =="07") {
    		strGubun = '5m';
    		$('#rdGubun_2').setSelected();
    	}
    	else if (param.eqpRoleDivCd =="10") {
    		strGubun = '15m';
    		$('#rdGubun_3').setSelected();
    	}
    	else if (param.eqpRoleDivCd =="23") {
    		strGubun = '1d';
    		$('#rdGubun_4').setSelected();
    	}

    	initTrafficGrid(strGubun);

		setEventListener();
		paramData = param;
		$('#eqpOperLkupArea').setData(param);
		//console.log(param);
		// 조회일자 Data Set
		var startDate = new Date().format("yyyy-MM-dd");
		var endDate = new Date().format("yyyy-MM-dd");

		$("#srchStartDt").val(startDate);
		$("#srchEndDt").val(endDate);


		var d = new Date().format("yyyy-MM-dd");
		var sDate = dateAdd(d, -2);
		var eDate = dateAdd(d, -1);

		$("#srchSDt").val(sDate);
		$("#srchEDt").val(eDate);

		searchSDt = sDate.toString().replace("-","").replace("-","");
		searchEDt = eDate.toString().replace("-","").replace("-","");

		param.srchSDt = searchSDt;
		param.srchEDt = searchEDt;
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpIp', param, 'GET', 'alltrafficlist');

		resizeContents();
	}

	function resizeContents(){
    	var contentHeight = $("#eqpOperLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

	function initGrid() {

		$("#divChart").html("");
		var appendStr = "<table style='width:100%;'>";
			appendStr += "<tbody>";
			appendStr += "<tr><td style='text-align:center;height:200px;'>조회된 데이터가 없습니다</td></tr>";
			appendStr += "</tbody>";
			appendStr += "</table>";
		$("#divChart").append(appendStr);

		var option_data = [{cd : "", cdNm : "시간"}];
		for(i = 23; i > -1; i--) {
			var resObj = {cd : NumberPad(i, 2), cdNm : NumberPad(i, 2)};
			option_data.push(resObj);
		}
		$("#srchClctSHour").clear();
		$("#srchClctSHour").setData({
			data:option_data
		});

		$("#srchClctEHour").clear();
		$("#srchClctEHour").setData({
			data:option_data
		});


//		$("select[name=srchClctSHour]").prop('disabled', true);
//		$("select[name=srchClctEHour]").prop('disabled', true);


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

    	if (strGubun == "1m") {
    		var mappingN =  [
        		{ key : 'clctDt', align:'center', title : '일자', width: '110px' },
        		{ key : 'portNm', align:'center', title : '포트명', width: '110px' },
        		{ key : 'portIp', align:'center', title : '포트IP', width: '150px' },
        		{ key : 'ringNm', align:'left', title : '링명', width: '200px' },
        		{ key : 'portDesc', align:'center', title : '추가정보(포트별명)', width: '150px' },
        		{ key : 'portSpedVal', align:'center', title : '속도(Mb)', width: '150px' },
        		{ key : 'inPktQty', align:'center', title : 'INBPS(5분,Kb)', width: '130px' },
        		{ key : 'outPktQty', align:'center', title : 'OUTBPS(5분,Kb)', width: '100px' },
        		{ key : 'portId', align:'center', title : '포트ID', width: '100px', hidden : true }];

    	} else if(strGubun == "5m")  {
    		var mappingN =  [
    			{ key : 'clctDt', align:'center', title : '일자', width: '110px' },
        		{ key : 'portNm', align:'center', title : '포트명', width: '110px' },
        		{ key : 'portIp', align:'center', title : '포트IP', width: '150px' },
        		{ key : 'ringNm', align:'left', title : '링명', width: '200px' },
        		{ key : 'portAlsNm', align:'center', title : '포트별명(서비스명)', width: '150px' },
        		{ key : 'portSpedVal', align:'center', title : '속도(Mb)', width: '150px' },
        		{ key : 'avgInBpsVal', align:'center', title : 'INBPS(5분,Kb)', width: '130px' },
        		{ key : 'avgOutBpsVal', align:'center', title : 'OUTBPS(5분,Kb)', width: '100px' },
        		{ key : 'portId', align:'center', title : '포트ID', width: '100px', hidden : true }];

    	} else if(strGubun == "15m")  {
    		var mappingN =  [
    			{ key : 'clctDt', align:'center', title : '일자', width: '110px' },
        		{ key : 'portNm', align:'center', title : '포트명', width: '110px' },
        		{ key : 'portAlsNm', align:'center', title : '포트별명(서비스명)', width: '150px' },
        		{ key : 'portSpedVal', align:'center', title : '속도(Mb)', width: '150px' },
        		{ key : 'inBpsVal', align:'center', title : 'INBPS(Mb)', width: '130px' },
        		{ key : 'outBpsVal', align:'center', title : 'OUTBPS(Mb)', width: '100px' },
        		{ key : 'avgInBpsRate', align:'center', title : 'INBPS사용률(%)', width: '100px' },
        		{ key : 'avgOutBpsRate', align:'center', title : 'OUTBPS사용률(%)', width: '100px' },
        		{ key : 'maxRxpwrVal', align:'center', title : '최대RXPOWER', width: '100px' },
        		{ key : 'avgRxpwrVal', align:'center', title : '평균RXPOWER', width: '100px' },
        		{ key : 'minRxpwrVal', align:'center', title : '최소RXPOWER', width: '100px' },
        		{ key : 'maxTxpwrVal', align:'center', title : '최대TXPOWER', width: '100px' },
        		{ key : 'avgTxpwrVal', align:'center', title : '평균TXPOWER', width: '100px' },
        		{ key : 'minTxpwrVal', align:'center', title : '최소TXPOWER', width: '100px' },
        		{ key : 'portId', align:'center', title : '포트ID', width: '100px', hidden : true }];

    	}else if(strGubun == "1d")  {
    		var mappingN =  [
    			{ key : 'clctDt', align:'center', title : '일자', width: '110px' },
    			{ key : 'eqpNm', align:'left', title : 'DU명', width: '200px' },
    			{ key : 'enbId', align:'center', title : 'EMBID', width: '110px' },
        		{ key : 'l3EqpNm', align:'center', title : 'eNode-B S/W', width: '150px' },
        		{ key : 'cellCnt', align:'center', title : 'Cell수', width: '80px' },
        		{ key : 'ruCnt', align:'center', title : 'RU수', width: '80px' },
        		{ key : 'dwldTrfVal', align:'center', title : 'DU DOWN Kb', width: '150px' },
        		{ key : 'uladTrfVal', align:'center', title : 'DU UP Kb', width: '150px' }];

    	}

        $('#'+gridTrafficId).alopexGrid({
        	paging : {
				pagerSelect: [100,300,500,1000,5000]
				,hidePageList: false  // pager 중앙 삭제
			},
			paging: { enabledByPager: true, perPage: rowPerPage, pagerCount: 10, pagerSelect: false, hidePageList: "auto" },
        	cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,

             numberingColumnFromZero : false,
             columnMapping : mappingN
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row"
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


		$('input[name="rdGubun"]:radio').on("click", function(e) {
			var rdGubun = $('input:radio[name=rdGubun]:checked').val();
			if (rdGubun == "5m") {
				$("#srchClctSHour").val("");
				$("#srchClctEHour").val("");
//				$("select[name=srchClctSHour]").prop('disabled', false);
//				$("select[name=srchClctEHour]").prop('disabled', false);

			} else {
				$("#srchClctSHour").val("");
				$("#srchClctEHour").val("");
//				$("select[name=srchClctSHour]").prop('disabled', true);
//				$("select[name=srchClctEHour]").prop('disabled', true);
			}
    	});


		var perPage = 100;
		// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			comEqpOper.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			comEqpOper.setGrid(1, eObj.perPage);
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
			comEqpOper.setTrafficGrid(1,100);
		});

		$('#btnSearch').on("click", function(e) {
			comEqpOper.setGrid(1,100);
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

		var perPage2 = 100;
		// 페이지 번호 클릭시
		$('#'+gridTrafficId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			comEqpOper.setTrafficGrid(eObj.page, eObj.pageinfo.perPage);
		});

		//페이지 selectbox를 변경했을 시.
		$('#'+gridTrafficId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			comEqpOper.setTrafficGrid(1, eObj.perPage);
		});


		$('#'+gridTrafficId).on('click', '.bodycell', function(e){
			$('#divChart').progress();
			var dataObj = null;
	 	 	dataObj = AlopexGrid.parseEvent(e).data;
	 	 	var rdGubun = $('input:radio[name=rdGubun]:checked').val();
	 	 	var mtsoId		= $('#mtsoId').val();
			var eqpId		= $('#eqpId').val();
	 	 	if (rdGubun == "1d") {
	 	 		var data = {eqpId : eqpId};

	 	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpDuChart', data, 'GET', 'allchart');
	 	 	} else {
	 	 		var clctDt = dataObj.clctDt.substring(0,10).replace("-","").replace("-","");
				var data = {portId : dataObj.portId, mtsoId : mtsoId, eqpId : eqpId, srchSDt : clctDt};
	 	 		if (dataObj.portId == undefined || dataObj.portId == null || dataObj.portId == "") {

	 	 		} else {
	 	 			if (rdGubun == "1m") {
		 	 			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpIpChart', data, 'GET', 'allchart1m');
					} else if (rdGubun == "5m") {

						httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpPtsChart', data, 'GET', 'allchart');
					}
	 	 		}
	 	 	}

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
		var srchEndDt = $("#endDate").val();
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

		var srchSDt = $("#srchSDt").val();
		var srchEDt = $("#srchEDt").val();
		if ((srchSDt == null || srchSDt == undefined || srchSDt == "") || (srchEDt == null || srchEDt == undefined || srchEDt == "")) {

		} else {
			$('#'+gridTrafficId).alopexGrid('showProgress');
			var mtsoId		= $('#mtsoId').val();
			var eqpId		= $('#eqpId').val();
			var portNm		= $('#srchPortNm').val();
			var srchClctSHour	= $('#srchClctSHour').val();
			var srchClctEHour	= $('#srchClctEHour').val();
			var pageNo		= $('#pageNo2').val();
			var rowPerPage 	= $('#rowPerPag2').val();
			if (srchClctSHour == "") {srchClctSHour = "00";}
			if (srchClctEHour == "") {srchClctEHour = "23";}
			srchSDt = srchSDt.replace("-","").replace("-","")+srchClctSHour+"0000";
			srchEDt = srchEDt.replace("-","").replace("-","")+srchClctEHour+"5959";

			if (rdGubun == "1m") {
				var param = {mtsoId : mtsoId, eqpId : eqpId, portNm : portNm, srchSDt : srchSDt, srchEDt : srchEDt, srchClctSHour : srchClctSHour, srchClctEHour : srchClctEHour, pageNo : pageNo, rowPerPage : rowPerPage};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpIp', param, 'GET', 'alltrafficlist');
			} else if (rdGubun == "5m") {
				var param = {mtsoId : mtsoId, eqpId : eqpId, portNm : portNm, srchSDt : srchSDt, srchEDt : srchEDt, srchClctSHour : srchClctSHour, srchClctEHour : srchClctEHour, pageNo : pageNo, rowPerPage : rowPerPage};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpPts', param, 'GET', 'alltrafficlist');
			} else if (rdGubun == "15m") {
				var param = {mtsoId : mtsoId, eqpId : eqpId, portNm : portNm, srchSDt : srchSDt, srchEDt : srchEDt, srchClctSHour : srchClctSHour, srchClctEHour : srchClctEHour, pageNo : pageNo, rowPerPage : rowPerPage};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpMw', param, 'GET', 'alltrafficlist');
			}else if (rdGubun == "1d") {
				var srchSDt = $("#srchSDt").val();
				var srchEDt = $("#srchEDt").val();
				srchSDt = srchSDt.replace("-","").replace("-","");
				srchEDt = srchEDt.replace("-","").replace("-","");
				var param = {mtsoId : mtsoId, eqpId : eqpId, portNm : portNm, srchSDt : srchSDt, srchEDt : srchEDt, pageNo : pageNo, rowPerPage : rowPerPage};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqpDu', param, 'GET', 'alltrafficlist');
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

		if(flag == 'allchart1m'){
			var chartXVal = [];
			var JsonArray = new Array();

			if (response.allchart.length == 0) {
				$("#divChart").html("");
				var appendStr = "<table style='width:100%;'>";
					appendStr += "<tbody>";
					appendStr += "<tr><td style='text-align:center;height:200px;'>조회된 데이터가 없습니다</td></tr>";
					appendStr += "</tbody>";
					appendStr += "</table>";
				$("#divChart").append(appendStr);
			} else {
				$("#divChart").html("");
				var appendStr = "<table style='width:100%;'>";
					appendStr += "<tbody>";
					appendStr += "<tr><td style='text-align:center;height:200px;'>";
					appendStr += "<div id='chartContainer' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
					//appendStr += "<div style='width:100%;text-align:center;'><b>"+tmpText+"</b></div>";
					appendStr += "</td></tr>";
					appendStr += "</tbody>";
					appendStr += "</table>";
				$("#divChart").append(appendStr);
				var chartData1 =[];
				var tmpData1 = 0;
				var tmpName = "";
				$.each(response.allchart, function(i, item){
					tmpName = response.allchart[0].portNm;
					//console.log(tmpName);
					chartXVal.push(response.allchart[i].clctDt)
					tmpData1 = Math.round(parseFloat(response.allchart[i].rate1),2);
					chartData1.push(tmpData1);
				});

				var arrData = {name : tmpName, data : chartData1};
				JsonArray.push(arrData);

//				var chartData2 =[];
//				var tmpData2 = 0;
//				$.each(response.allchart, function(i, item){
//					tmpData2 = Math.round(parseFloat(response.allchart[i].rate2),2);
//					chartData2.push(tmpData2);
//				});
//
//				var arrData = {name : "Out", data : chartData2};
//				JsonArray.push(arrData);
			}
			Highcharts.chart('chartContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
				legend:{ layout: 'horizontal', align:'center', verticalAlign:'bottom' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArray,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
			$('#divChart').progress().remove();
		}
		if(flag == 'allchart'){
			var chartXVal = [];
			var JsonArray = new Array();

			if (response.allchart.length == 0) {
				$("#divChart").html("");
				var appendStr = "<table style='width:100%;'>";
					appendStr += "<tbody>";
					appendStr += "<tr><td style='text-align:center;height:200px;'>조회된 데이터가 없습니다</td></tr>";
					appendStr += "</tbody>";
					appendStr += "</table>";
				$("#divChart").append(appendStr);
			} else {
				$("#divChart").html("");
				var appendStr = "<table style='width:100%;'>";
					appendStr += "<tbody>";
					appendStr += "<tr><td style='text-align:center;height:200px;'>";
					appendStr += "<div id='chartContainer' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
					//appendStr += "<div style='width:100%;text-align:center;'><b>"+tmpText+"</b></div>";
					appendStr += "</td></tr>";
					appendStr += "</tbody>";
					appendStr += "</table>";
				$("#divChart").append(appendStr);
				var chartData1 =[];
				var tmpData1 = 0;
				$.each(response.allchart, function(i, item){
					chartXVal.push(response.allchart[i].clctDt)
					tmpData1 = Math.round(parseFloat(response.allchart[i].rate1),2);
					chartData1.push(tmpData1);
				});

				var arrData = {name : "In", data : chartData1};
				JsonArray.push(arrData);

				var chartData2 =[];
				var tmpData2 = 0;
				$.each(response.allchart, function(i, item){
					tmpData2 = Math.round(parseFloat(response.allchart[i].rate2),2);
					chartData2.push(tmpData2);
				});

				var arrData = {name : "Out", data : chartData2};
				JsonArray.push(arrData);
			}
			Highcharts.chart('chartContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
				legend:{ layout: 'horizontal', align:'right', verticalAlign:'middle' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArray,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
			$('#divChart').progress().remove();
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