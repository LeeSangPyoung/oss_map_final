/**
 * EqpInfPop.js

 *
 * @author Administrator
 * @date 2019. 06. 12. 오전 17:30:03
 * @version 1.0
 */

var gisMap = null;
var mgMap;
var L;
var circleRange = 0;//반경거리

var comMain = $a.page(function() {
	var historyArr = [];
	var popupSetValue = "1";	// 0: 현재 페이지에서 이동, 1 : 국사 일때 장비는 다른 페이지에서, 2 :  국사/장비 새로운 페이지에서
	var paramData = null;
	var mtsoEqpGubun = "mtso";
	var linkTab = null;
	var isSetup = 0;
	var frstYn = true;
	var linkTabContrlYn = 'N';
	var variableNm 	= null;
	var variableVal 	= null;
    this.init = function(id, param) {

//    	console.log("comlkup init param : ", param);
    	var screenHeight = screen.availHeight * 0.9;
    	window.resizeTo(1020, screenHeight);

    	/*******************************************
    	 * 초기화 Start
    	 ******************************************/
    	historyArr.length = 0;
    	$("[id^='tab_']").removeClass("info-atho");
    	$("[id^='tab_']").removeClass("info-hidden");
    	/*******************************************
    	 * 초기화 End
    	 ******************************************/

    	mtsoEqpGubun 	= param.mtsoEqpGubun;
    	linkTabContrlYn	= param.linkTabContrlYn;				// 특정 URL에서 넘어와 해당 탭 메뉴만 활성화 하기 위함.
    	variableNm			= param.variableNm;					// 특정 URL에서 넘어와 값 전달이 필요할 경우 사용함.
    	variableVal			= param.variableVal;				// 특정 URL에서 넘어와 값 전달이 필요할 경우 사용함.
    	if (linkTabContrlYn == "" || linkTabContrlYn == undefined || linkTabContrlYn == null) { linkTabContrlYn = "N"; }
    	linkTab = param.linkTab;
    	DisplayForm(mtsoEqpGubun);
    	var userId = $("#userId").val();
    	var userData = {userId :  userId};

    	var option_data =  [{cd: "0", cdNm: "현재 페이지에서 이동/보기"},{cd: "1", cdNm: "국사,장비 각 페이지에서 이동/보기"}, {cd: "2", cdNm: "새 페이지에서 이동/보기"}];
		$('#popupEstCd').setData({
			data:option_data
		});

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/popest', userData, 'GET', 'userpopest'); // BIZ : MtsoInfo FILE

    	if (param.mtsoEqpGubun == 'mtso') {
    		if (linkTab == undefined || linkTab == null || linkTab == "") {
    			linkTab = "tab_Mtso";
    			$("#tabId").val("tab_Mtso");
    		}
    		var data = { mtsoId : param.mtsoEqpId }; //
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos'); // BIZ : MtsoInfo FILE
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alm', data, 'GET', 'alm'); 		// BIZ : MtsoInfo FILE
    	} else if (param.mtsoEqpGubun == 'intgmtso') {
    		if (linkTab == undefined || linkTab == null || linkTab == "") {
    			linkTab = "tab_IntgMtso";
    			$("#tabId").val("tab_IntgMtso");
    		}
    		var data = { mtsoId : param.mtsoEqpId, intgMtsoId : param.intgMtsoId }; //
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos'); // BIZ : MtsoInfo FILE
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alm', data, 'GET', 'alm'); 		// BIZ : MtsoInfo FILE
    	} else {
    		if (linkTab == undefined || linkTab == null || linkTab == "") {
    			linkTab = "tab_Eqp";
    			$("#tabId").val("tab_Eqp");
    		}
    		var data = { eqpId : param.mtsoEqpId };
    		var tmpEqp = param.mtsoEqpId.substring(0,2);
			if (tmpEqp == "SE") { // 부대장비
				DisplayInfoHidden("SE");
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', data, 'GET', 'eqpinfo');
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', data, 'GET', 'eqpinfo');
			}
    	}
//    	console.log("linkTab : ", linkTab);
    	Initialize();
    	initGrid();
    };

    function DisplayAthoHidden(gubun) {
    	var adtnAttrVal = $('#adtnAttrVal').val();
    	// 환경, 상면관리 권한여부
    	if(adtnAttrVal.indexOf('CM_UPSD_MGMT') == -1){									// 상면관리 역할 그룹
    		$('#btnUpsd').hide();
    	}
    	if(adtnAttrVal.indexOf('RL0004759') == -1 && adtnAttrVal.indexOf('RL0004771') == -1){	// TNAGO-T ENG.-구축 역할 그룹, ENG 구축 전체 관리자
    		if(adtnAttrVal.indexOf('RL0008100') == -1){											// SKT ENG.-구축 역할그룹

    	    	// 투자, 구축
    	    	if(adtnAttrVal.indexOf('RL0008112') == -1){										// SKT Manager
    	    		// 투자
    	    		if (adtnAttrVal.indexOf('TANGOTCP_THME') == -1 && adtnAttrVal.indexOf('TANGOTCP_THMB') == -1 && adtnAttrVal.indexOf('TANGOTCP_THMC') == -1 && adtnAttrVal.indexOf('TANGOTCP_THMO') == -1 && adtnAttrVal.indexOf('TANGOTCP_TAME') == -1 && adtnAttrVal.indexOf('TANGOTCP_TAMC') == -1 && adtnAttrVal.indexOf('TANGOTCP_TAMO') == -1 ){
        	    		$("#tab_Invt").addClass("info-atho");
        	    	}
    	    		// 구축
    	    		if (adtnAttrVal.indexOf('TANGOTCP_TAMC') == -1 && adtnAttrVal.indexOf('TANGOTCP_THMC') == -1){
        	    		$("#tab_Cnst").addClass("info-atho");
        	    	}
    	    	}
    		}
    	}
    }

    function DisplayInfoHidden(gubun) {
//    	console.log("DisplayInfoHidden gubun : ", gubun);
    	if (gubun == "SE") {
    		$("#tab_Shp").addClass("info-hidden");
    		$("#tab_EqpPort").addClass("info-hidden");
    		$("#tab_EqpLine").addClass("info-hidden");
			$("#tab_EqpOper").addClass("info-hidden");
			$("#tab_EqpCov").addClass("info-hidden");
    	}

    	$("#tab_IntgMtso").addClass("info-hidden");

    	DisplayAthoHidden("eqp");
    }
    function DisplayForm(gubun) {
//    	console.log("DisplayForm : ", gubun);
    	if (gubun == "mtso"
    		|| gubun == "intgmtso") {
    		$(document).attr('title','국사 통합 정보');
    		$("#myUl").css("display", "");
    		$("#mtsoNm").css("display", "");
    		$("#PopInfoMtso").css("display", "");
    		$("#divMenuMtso").css("display", "");
    		$("#eqpNm").css("display", "none");
    		$("#PopInfoEqp").css("display", "none");
    		$("#divMenuEqp").css("display", "none");
    		$("#btnGId").css("display", "");
    		DisplayAthoHidden("mtso");
    	} else {
    		$(document).attr('title','장비 통합 정보');
    		$("#myUl").css("display", "none");
    		$("#mtsoNm").css("display", "none");
    		$("#PopInfoMtso").css("display", "none");
    		$("#divMenuMtso").css("display", "none");
    		$("#eqpNm").css("display", "");
    		$("#PopInfoEqp").css("display", "");
    		$("#divMenuEqp").css("display", "");
    		$("#btnGId").css("display", "none");
    		DisplayAthoHidden("eqp");
    	}
    }
    function Initialize() {
    	$(document).on('click', "[id^='tab_']", function(e){
//    		console.log("Initialize : ", e);
			if(linkTabContrlYn == "N") {
				var tabId = $(this).attr("id");

	    		if ($("#"+tabId).hasClass("info-atho")) {
	    			callMsgBox('','W', "해당 정보를 열람 권한이 없습니다." , function(msgId, msgRst){});
	    		} else if ($("#"+tabId).hasClass("info-hidden")) {
	    			callMsgBox('','W', "해당 정보를 제공하지 않는 국사 또는 장비입니다." , function(msgId, msgRst){});
	    		} else {
	    			switch(tabId)  {
	    			case "tab_Main":
	    				$("#tabId").val("tab_Main");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoMain.do?mtsoId="+paramData.mtsoEqpId;
	    				break;
	    			case "tab_Mtso":
	    				$("#tabId").val("tab_Mtso");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInfo.do?mtsoId="+paramData.mtsoEqpId;
	    				break;
	    			case "tab_Fclt":
	    				$("#tabId").val("tab_Fclt");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Fclt.do?mtsoId="+paramData.mtsoEqpId +"&mgmtGrpNm="+paramData.mgmtGrpNm;
	    				break;
	    			case "tab_Erp":
	    				$("#tabId").val("tab_Erp");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoErp.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
	    				break;
	    			case "tab_Line":
	    				$("#tabId").val("tab_Line");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoLineInfo.do?mtsoId="+paramData.mtsoEqpId; //+paramData.mtsoEqpId;
	    				break;
	    			case "tab_Oper":
	    				$("#tabId").val("tab_Oper");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoOper.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
	    				break;
	    			case "tab_Eqwr":
	    				$("#tabId").val("tab_Eqwr");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EpwrStcInfo.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
	    				break;
	    			case "tab_Draw":
	    				$("#tabId").val("tab_Draw");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Draw.do?mtsoId="+paramData.mtsoEqpId +"&sisulCd="+paramData.sisulCd;
	    				break;
	    			case "tab_Invt":
	    				$("#tabId").val("tab_Invt");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInvt.do?mtsoId="+paramData.mtsoEqpId;
	    				break;
	    			case "tab_Cnst":
	    				$("#tabId").val("tab_Cnst");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoCnst.do?mtsoId="+paramData.mtsoEqpId;
	    				break;
	    			case "tab_Cov":
	    				$("#tabId").val("tab_Cov");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/CoverMap.do?mtsoId="+paramData.mtsoEqpId;
	    				break;
	    				//2023 고도화 phase2 추가
	    			case "tab_IntgMtso":
	    				$("#tabId").val("tab_IntgMtso");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/IntgMtsoInfo.do?mtsoId="+paramData.mtsoEqpId+"&intgMtsoId="+paramData.intgMtsoId;
	    				break;
	    			// 장비 메뉴

	    			case "tab_Eqp":
	    				$("#tabId").val("tab_Eqp");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpInfo.do?eqpId="+paramData.mtsoEqpId+"&mtsoId="+paramData.eqpInstlMtsoId;
	    				break;
	    			case "tab_EqpErp":
	    				$("#tabId").val("tab_EqpErp");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpErpInfo.do?eqpId="+paramData.mtsoEqpId;
	    				break;
	    			case "tab_Shp":
	    				$("#tabId").val("tab_Shp");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/ShpInfo.do?eqpId="+paramData.mtsoEqpId;
	    				break;

	    			case "tab_EqpPort":
	    				$("#tabId").val("tab_EqpPort");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpPort.do?eqpId="+paramData.mtsoEqpId;
	    				break;
	    			case "tab_EqpLine":
	    				$("#tabId").val("tab_EqpLine");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpLineInfo.do?eqpId="+paramData.mtsoEqpId;
	    				break;
	    			case "tab_EqpOper":
	    				$("#tabId").val("tab_EqpOper");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpOper.do?eqpId="+paramData.mtsoEqpId+"&mtsoId="+paramData.eqpInstlMtsoId;
	    				break;
	    			case "tab_EqpDraw":
	    				$("#tabId").val("tab_EqpDraw");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Draw.do?itemId="+paramData.rackId +"&sisulCd="+paramData.sisulCd;
	    				break;
	    			case "tab_EqpCov":
	    				$("#tabId").val("tab_EqpCov");
	    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/CoverMap.do?eqpId="+paramData.mtsoEqpId;
	    				break;
	    			default :
	    				strSrc = "";
	    				break;
	    			}
	    			if (strSrc != "") {


	    				$("#ifrm").attr('src', strSrc);
	    				$("[id^='tab_']").removeClass("on");
	    				$("#"+tabId).addClass("on");


	    				document.body.scrollTop = 0;
	    				document.documentElement.scrollTop = 0;
	    			}
	    		}
			}

		});


    	$("#btnSetting").on('click', function(e) {
    		isSetup = (isSetup == 0) ? 1 : 0;
    		if (isSetup == 1) {
    			$('#divHistory').css('display','none');
    			$('#divSetUp').css('display','inline-block');
    		} else {
    			$('#divSetUp').css('display','none');
    		}
		});

    	$("#btnEstInf").on('click', function(e) {
    		var conFirm = confirm("팝업보기 설정을 변경하시겠습니까?");
    		if(conFirm) {
    			var userId = $("#userId").val();
        		var popupEstCd = $("#popupEstCd").val();
        		var param = {userId :  userId, popupEstCd :  popupEstCd};
        		popupSetValue = popupEstCd.toString();
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/updatepopest', param, 'POST', 'updatepopest');
    			$('#divSetUp').css('display','none');
    		}

		});

    	$("#btnHistory").on('click', function(e) {
    		isSetup = (isSetup == 0) ? 1 : 0;
    		if (isSetup == 1) {
    			if (historyArr.length < 1) {
    				callMsgBox('','W', "이력정보가 존재하지 않습니다." , function(msgId, msgRst){});
    			} else {
    				$('#divSetUp').css('display','none');
        			$('#divHistory').css('display','inline-block');
    			}
    		} else {
    			$('#divHistory').css('display','none');
    		}
		});


    	$("#btnGId").on('click', function(e) {

    		var mtsoLatValChk = $("#mtsoLatVal").val();
    		var mtsoLngValChk = $("#mtsoLngVal").val();


    		if (mtsoLatValChk == "0" || mtsoLngValChk == "0" || mtsoLatValChk == null || mtsoLngValChk == null || mtsoLatValChk == undefined || mtsoLngValChk == undefined || mtsoLatValChk == "" || mtsoLngValChk == "") {
    			callMsgBox('','W', "국사 위경도가 존재 하지 않아 지도로 이동 할수 없습니다." , function(msgId, msgRst){});
    		} else {

    			if(gisMap == null || gisMap.opener == null) {
        			gisMap = window.open('/tango-transmission-gis-web/tgis/Main.do');
    	   		} else {
    	   			gisMap.focus();
    	   			gisMap.$('body').progress();
    	   		}
        		var mtsoId 	= $("#mtsoIdVal").val();
        		var bldAddr	= $("#bldAddr").val();
        		var mtsoTyp	= $("#mtsoTyp").val();
        		var mtsoStat= $("#mtsoStat").val();
        		var mtsoNm	= $("#mtsoNm").val();
        		var mtsoLatVal	= $("#mtsoLatVal").val();
        		var mtsoLngVal	= $("#mtsoLngVal").val();
        		var dataObj = {mtsoId : mtsoId, moveMap : true, bldAddr : bldAddr, mtsoTyp : mtsoTyp, mtsoStat : mtsoStat, mtsoNm : mtsoNm, mtsoLatVal : mtsoLatVal, mtsoLngVal : mtsoLngVal};
        		//console.log(dataObj);
    	   		setTimeout(function(){ gisM(dataObj);}, 5000);
    		}

		});

    	$('#btnUpsd').on('click', function(e) {
//    		var adtnAttrVal = $('#adtnAttrVal').val();
//    		if(adtnAttrVal.indexOf('CM_UPSD_MGMT') == -1){									// 상면관리 역할 그룹
//    			callMsgBox('','W', "해당 정보를 열람 권한이 없습니다." , function(msgId, msgRst){});
//	    	} else {
	    		var sisulCd = $("#sisulCd").val();
				var floorId = $("#floorId").val();
	    		var data = {sisulCd: sisulCd, floorId: floorId};
	    		if (floorId == undefined || floorId == null || floorId == "" || floorId == "0") {
	    			callMsgBox('','W', "상면정보가 존재하지 않습니다." , function(msgId, msgRst){});
	    		} else {
	    			$a.popup({
	        			title: '드로잉 툴',
	        			url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
	        			data: data,
	        			iframe: false,
	        			windowpopup: true,
	        			movable:false,
	        			width : screen.availWidth,
	        			height : screen.availHeight,
	        			callback: function(data) {}
	        		});
	    		}
//	    	}

		});
    }

    function gisM(dataObj){
		gisMap.$('body').progress();
		httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
	}

    function initGrid() {
	}

	//통합국 제외 후 리스트 갱신 및 팝업윈도우 닫음
    this.thisPopUpClose = function(){
    	$(opener.document).find("#btnSearch").click();
    	$a.close();
    };

    this.comLkupClose = function(dataObj) {
    	var conFirm = confirm("선택하신 랙 정보를 사용하시겠습니까?");
		if(conFirm) {
			$a.close(dataObj);
		}
    };

    this.winReSize = function(strHeight) {
    	if (strHeight == null || strHeight == undefined) {strHeight = 500;}
    	$("#divIfrm").height(strHeight+150);
    };
    this.msgBox = function(gubun, strText) {
    	callMsgBox('',gubun, strText, function(msgId, msgRst){});
    };

    this.mtsoMod = function(param) {
    	//2023 통합국사고도화 - 국사 수정 후 국사 유형에 따라 통합국사 탭 처리
    	if(param.mtsoTypCd != '2'){
    		$('#tab_IntgMtso').hide();
    	}else if(param.mtsoTypCd == '2'){
    		$('#tab_IntgMtso').show();
    	}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', param, 'GET', 'mtsoMod');
    };

    this.eqpMod = function(param) {
    	var tmpEqp = param.eqpId.substring(0,2);
    	if (tmpEqp == "SE") {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', param, 'GET', 'eqpinfoMod');
		} else {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfoMod');
		}
    };

    this.intgMtsoMod = function(param) {
    	var userId = $("#userId").val();
    	var userData = {userId :  userId};

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/intgmtso', param, 'GET', 'intgMtsoMod');
    };

    this.popURL = function(param) {
//    	console.log("popURL : ", param);
//    	console.log("popURL popupSetValue: ", popupSetValue);
//    	console.log("popURL mtsoEqpGubun: ", mtsoEqpGubun);
    	var mtsoEqpNm = param.mtsoEqpNm;
    	if (mtsoEqpNm == undefined) {
    		if (param.mtsoEqpGubun == "0") {
    			mtsoEqpNm = "미확인 국사";
    		} else {
    			mtsoEqpNm = "미확인 장비";
    		}
    	}

    	//그리드 클릭시 국사기본 또는 통합국 탭 활성화를 위해 전역변수 수정
    	if (param.mtsoGubun != undefined
    			&& param.linkTab != undefined) {
    		mtsoEqpGubun = param.mtsoGubun;
    		linkTab = param.linkTab;
    	}

    	if (linkTabContrlYn == 'N') {	// 특정 Tab 메뉴 활성화시에는 이동 불가하게 함.
    		var conFirm = confirm(mtsoEqpNm+" 정보로 이동하시겠습니까?");
    		if(conFirm) {
    			/*******************************************
    	    	 * 초기화 Start
    	    	 ******************************************/

    	    	$("[id^='tab_']").removeClass("info-atho");
    	    	$("[id^='tab_']").removeClass("info-hidden");
    	    	/*******************************************
    	    	 * 초기화 End
    	    	 ******************************************/
    	    	if (param.mtsoEqpGubun == "0") {
        			var data = { mtsoId : param.mtsoEqpId, intgMtsoId : param.intgMtsoId };
        	    	if (popupSetValue == "0") {
        	    		if (mtsoEqpGubun == "intgmtso") { //2023 통합국사 고도화 추가-통합국탭 활성을 위해 추가
        	    			linkTab = param.linkTab; // 탭이동을 위해 추가
        		    		DisplayForm("intgmtso");
        	    		}else{
        	    		if (mtsoEqpGubun == "eqp") { mtsoEqpGubun = "mtso"; }
        	    		DisplayForm("mtso");
        	    		}
        	    		HistoryAdd();

        	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos'); // BIZ : MtsoInfo FILE
        	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alm', data, 'GET', 'alm'); 		// BIZ : MtsoInfo FILE
        	    	} else {
//        	    		console.log("popupSetValue : ", popupSetValue, " mtsoEqpGubun : ", mtsoEqpGubun);
        	    		if (popupSetValue == "1" && mtsoEqpGubun == "mtso") {
        	    			linkTab = param.linkTab; // 탭이동을 위해 추가
        		    		DisplayForm("mtso");
        		    		HistoryAdd();
        	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos'); // BIZ : MtsoInfo FILE
            	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alm', data, 'GET', 'alm'); 		// BIZ : MtsoInfo FILE
        	    		} else if (popupSetValue == "1" && mtsoEqpGubun == "intgmtso") { //2023 통합국사 고도화 추가-통합국탭 활성을 위해 추가
        	    			linkTab = param.linkTab; // 탭이동을 위해 추가
        		    		DisplayForm("intgmtso");
        		    		HistoryAdd();
        	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos'); // BIZ : MtsoInfo FILE
            	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alm', data, 'GET', 'alm'); 		// BIZ : MtsoInfo FILE
        	    		} else {
        	    			linkTab = param.linkTab;
        	    			//2023 통합국사 고도화 추가 수정
        	    			mtsoEqpGubun = param.mtsoGubun; //통합국사 탭 활성화 여부를 위해
        	    			var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
        	    			var popMtsoEqp = $a.popup({
        	    				popid: tmpPopId,
        	    				title: '통합 국사/장비 정보',
        	    				url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do?mtsoEqpGubun='+mtsoEqpGubun+'&linkTab='+linkTab+'&mtsoEqpId='+param.mtsoEqpId+'&mtsoTypCd=' + param.mtsoTypCd+'&intgMtsoId=' + param.intgMtsoId,
        	    				//data: data,
        	    				iframe: false,
        	    				modal: false,
        	    				movable:false,
        	    				windowpopup: true,
        	    				width : 900,
        	    				height : window.innerHeight
        	    			});
        	    		}
        	    	}
        		} else {
        			var data = { eqpId : param.mtsoEqpId };
            		var tmpEqp = param.mtsoEqpId.substring(0,2);
            		if (popupSetValue == "0") {
            			if (mtsoEqpGubun == "mtso") { mtsoEqpGubun = "eqp"; }
            			DisplayForm("eqp");
            			HistoryAdd();
            			if (tmpEqp == "SE") { // 부대장비
            				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', data, 'GET', 'eqpinfo'); // BIZ : EqpInfo FILE
            				DisplayInfoHidden("SE");
            			} else {
            				linkTab = param.linkTab;
            				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', data, 'GET', 'eqpinfo');
            			}
        	    	} else {
        	    		linkTab = param.linkTab;
        	    		if (popupSetValue == "1" && mtsoEqpGubun == "eqp") {
        	    			DisplayForm("eqp");
        	    			HistoryAdd();
        	    			if (tmpEqp == "SE") { // 부대장비
                				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', data, 'GET', 'eqpinfo'); // BIZ : EqpInfo FILE
                				DisplayInfoHidden("SE");
                			} else {
                				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', data, 'GET', 'eqpinfo');
                			}
        	    		} else {
        	    			var tmpPopId = "E_"+Math.floor(Math.random() * 10) + 1;
        	    			var popMtsoEqp = $a.popup({
        	    				popid: tmpPopId,
        	    				title: '통합 국사/장비 정보',
        	    				url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do?mtsoEqpGubun=eqp&linkTab='+linkTab+'&mtsoEqpId=' + param.mtsoEqpId,
        	    				//data: data,
        	    				iframe: false,
        	    				modal: false,
        	    				movable:false,
        	    				windowpopup: true,
        	    				width : 900,
        	    				height : window.innerHeight
        	    			});
        	    		}
        	    	}
        		}
    		}
    	}
    };

    $(document).on('click', '[id^="tdHistory"]', function(e){
    	var tdKey = $(this).attr('value');
    	var splitValue = tdKey.split("|^@^|")
    	var conFirm = confirm(splitValue[2]+" 정보로 이동하시겠습니까?");
		if(conFirm) {
			$('#divHistory').css('display','none');
			/*******************************************
	    	 * 초기화 Start
	    	 ******************************************/
	    	$("[id^='tab_']").removeClass("info-atho");
	    	$("[id^='tab_']").removeClass("info-hidden");
	    	/*******************************************
	    	 * 초기화 End
	    	 ******************************************/
			switch(splitValue[0])  {
			case "tab_Main":
			case "tab_Mtso":
			case "tab_Fclt":
			case "tab_Erp":
			case "tab_Line":
			case "tab_Oper":
			case "tab_Eqwr":
			case "tab_Draw":
			case "tab_Invt":
			case "tab_Cnst":
			case "tab_Cov":
				if (popupSetValue == "0") {
					var data = { mtsoId : splitValue[1] };
					linkTab = splitValue[0];
		 	    	if (mtsoEqpGubun == "eqp") { mtsoEqpGubun = "mtso"; }
	    			DisplayForm("mtso");
	    			HistoryAdd();

	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos'); // BIZ : MtsoInfo FILE
    	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alm', data, 'GET', 'alm'); 		// BIZ : MtsoInfo FILE
				} else {
					if (popupSetValue == "1" && mtsoEqpGubun == "mtso") {

						var data = { mtsoId : splitValue[1] };
						linkTab = splitValue[0];
    	    			DisplayForm("mtso");
    	    			HistoryAdd();

    	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsos', data, 'GET', 'mtsos'); // BIZ : MtsoInfo FILE
        	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/alm', data, 'GET', 'alm'); 		// BIZ : MtsoInfo FILE

		    		} else {
		    			var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
		    			var popMtsoEqp = $a.popup({
		    				popid: tmpPopId,
		    				title: '통합 국사/장비 정보',
		    				url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do?mtsoEqpGubun=mtso&mtsoEqpId=' + splitValue[1] +'&linkTab='+splitValue[0],
		    				//data: data,
		    				iframe: false,
		    				modal: false,
		    				movable:false,
		    				windowpopup: true,
		    				width : 900,
		    				height : window.innerHeight
		    			});
		    		}
				}
				break;
			// 장비 메뉴
			case "tab_Eqp":
			case "tab_Shp":
			case "tab_EqpErp":
			case "tab_EqpPort":
			case "tab_EqpLine":
			case "tab_EqpOper":
			case "tab_EqpDraw":
			case "tab_EqpCov":
				if (popupSetValue == "0") {
					var data = { eqpId : splitValue[1] };
					linkTab = splitValue[0];
	        		var tmpEqp = splitValue[1].substring(0,2);
	    			DisplayForm("eqp");
	    			HistoryAdd();
	    			if (tmpEqp == "SE") { // 부대장비
        				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', data, 'GET', 'eqpinfo'); // BIZ : EqpInfo FILE
        				DisplayInfoHidden("SE");
        			} else {
        				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', data, 'GET', 'eqpinfo');
        			}
				} else {
					if (popupSetValue == "1" && mtsoEqpGubun == "eqp") {

						var data = { eqpId : splitValue[1] };
						linkTab = splitValue[0];
		        		var tmpEqp = splitValue[1].substring(0,2);
    	    			DisplayForm("eqp");
    	    			HistoryAdd();
    	    			if (tmpEqp == "SE") { // 부대장비
            				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', data, 'GET', 'eqpinfo'); // BIZ : EqpInfo FILE
            				DisplayInfoHidden("SE");
            			} else {
            				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', data, 'GET', 'eqpinfo');
            			}
		    		} else {
		    			var tmpPopId = "E_"+Math.floor(Math.random() * 10) + 1;
		    			var popMtsoEqp = $a.popup({
		    				popid: tmpPopId,
		    				title: '통합 국사/장비 정보',
		    				url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do?mtsoEqpGubun=eqp&mtsoEqpId=' + splitValue[1] +'&linkTab='+splitValue[0],
		    				//data: data,
		    				iframe: false,
		    				modal: false,
		    				movable:false,
		    				windowpopup: true,
		    				width : 900,
		    				height : window.innerHeight
		    			});
		    		}
				}
				break;
			}
		}
	});

    $(document).on('click', '[id^="spanHistory"]', function(e){
		var conFirm = confirm("아이템을 삭제하시겠습니까?");
		if(conFirm) {
			var tdKey = $(this).attr('value');

			var tmpKey = tdKey.split("|^@^|");
			var keyValue = {tabId : tmpKey[0], mtsoEqpId : tmpKey[1], mtsoEqpNm : tmpKey[2]};
			//console.log(historyArr);
			//console.log(keyValue);
			if (historyArr.indexOf(keyValue) != -1) {
				historyArr.splice(historyArr.indexOf(keyValue),1);
			}
			if (historyArr.indexOf(keyValue) == -1) {
				historyArr.splice(0,0, keyValue);
			}
			historyList();
		}
	});
    function HistoryAdd() {
    	var tabId = $("#tabId").val();
    	var linkId = $("#linkId").val();
    	var linkNm = $("#linkNm").val();
    	var arrData = tabId+"|^@^|"+linkId+"|^@^|"+linkNm;
    	historyArr.push(arrData);
    	historyList();
    }
    function historyList() {

    	var uniqueNames = [];
		$.each(historyArr, function(i, el) {
			if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
		});

    	$('#mytable > tbody > tr').remove();
		var strAppend = '';
		for (var i = 0; i < uniqueNames.length; i++) {
			var splitData = uniqueNames[i];
			splitData = splitData.split("|^@^|");
			var tmpTabId = splitData[0];
			var tmpId = splitData[1];
			var tmpNm = splitData[2];
			var strGubun = "";
			var meGubun = "0";
			switch(tmpTabId)  {
			case "tab_Main":
				strGubun = "종합";
				break;
			case "tab_Mtso":
				strGubun = "기본";
				break;
			case "tab_Fclt":
				strGubun = "시설";
				break;
			case "tab_Erp":
				strGubun = "ERP";
				break;
			case "tab_Line":
				strGubun = "회선";
				break;
			case "tab_Eqwr":
				strGubun = "환경";
				break;
			case "tab_Oper":
				strGubun = "운용";
				break;
			case "tab_Draw":
				strGubun = "상면";
				break;
			case "tab_Invt":
				strGubun = "투자";
				break;
			case "tab_Cnst":
				strGubun = "구축";
				break;
			case "tab_Cov":
				strGubun = "Cov."
				break;
				//2023 고도화 phase2 추가
			case "tab_IntgMtso":
				strGubun = "통합국";
				break;
			// 장비 메뉴
			case "tab_Eqp":
				strGubun = "기본";
				meGubun = "1";
				break;
			case "tab_EqpErp":
				strGubun = "장비ERP";
				meGubun = "1";
				break;
			case "tab_EqpPort":
				strGubun = "포트";
				meGubun = "1";
				break;
			case "tab_Shp":
				strGubun = "현상";
				meGubun = "1";
				break;
			case "tab_EqpLine":
				strGubun = "회선";
				meGubun = "1";
				break;
			case "tab_EqpOper":
				strGubun = "운용";
				meGubun = "1";
				break;
			case "tab_EqpDraw":
				strGubun = "상면";
				meGubun = "1";
				break;
			case "tab_EqpCov":
				strGubun = "Cov.";
				meGubun = "1";
				break;
			}
			var strTitle = tmpNm;
			if (strTitle.length > 15) {
				strTitle = strTitle.substring(0,14)+"..";
			}
			var gradient = "linear-gradient(rgba(234,237,242,0.1), rgba(19,30,46,0.4))";
			if (meGubun == "1") {
				gradient = "linear-gradient(#ebf8e1, #f69d3c)";
			}
			strAppend = '<tr style="border: 1px solid #ffffff;height:20px;">';
			strAppend += '<td id="tdRack-datasA'+i+'" style="width:100%;">';
			strAppend += '<table style="width:234px;background:'+gradient+';"><tr><td id="tdHistory'+i+'" value='+uniqueNames[i].toString()+' style="height:20px;text-align:left;cursor:pointer;"><span ><b>['+strGubun+'] '+strTitle+'</b></span></td>';
			//strAppend += '<td  style="width:25px;height:20px;text-align:center;"><span id="spanHistory'+i+'" value='+uniqueNames[i].toString()+' style="cursor:pointer;"><img src="/tango-transmission-web/resources/images/upsd/x.png" style="width:13px;height:13px;" /></span></td>';
			strAppend += '</tr></table></td></tr>';
			$('#mytable > tbody:last').append(strAppend);
		}
    }

    function successCallback(response, status, jqxhr, flag){
    	if(flag =='searchGisMtsoInf'){
			//레이어초기화

			mgMap = gisMap.window.mgMap;
			L = gisMap.window.L;

			var mtsoInfLayer = mgMap.addCustomLayerByName('MTSO_INF_LAYER');//국사표시를 위한 레이어
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();

	        //GIS국사정보
			var gisMtsoInf = null;
			gisMtsoInf = response.gisMtsoInf;

	       //팝업할 국사정보 세팅
		    var html =
	            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
	            '<b>시설코드:</b><%pop_mtsoMgmtNo%><br>'+
	            '<b>국사번호:</b><%pop_mtsoId%><br>' +
	            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
	            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
	            '<b>건물주소:</b><%pop_bldAddr%>';

	        html = html.replace('<%pop_mtsoNm%>',response.mtsoNm);
	        html = html.replace('<%pop_mtsoId%>',response.mtsoId);
	        html = html.replace('<%pop_mtsoTyp%>',response.mtsoTyp);
	        html = html.replace('<%pop_mtsoStat%>',response.mtsoStat);
	        html = html.replace('<%pop_bldAddr%>',response.bldAddr);

			//GIS 국사정보가 없을 경우
			if (gisMtsoInf == null || gisMtsoInf == "") {
					//구성팀 국사 위경도 있으면
				    if (response.mtsoLatVal != null && response.mtsoLatVal != "" &&
				    	response.mtsoLngVal != null && response.mtsoLngVal != ""	)
				    {
				    	//GIS 국사관리번호가 없습니다. 국사의 위경도 위치를 표시합니다.
		 				callMsgBox('','W', configMsgArray['noGisMtsoMgmtNo'] , function(msgId, msgRst){});
				    	if(response.moveMap){
				    		//해당 좌표로 이동
				    		gisMap.window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], 13);
		 	 			    //반경거리 표시해주고
		 			        if (circleRange != 0){
		 			        	var distance_circle_layer = window.distanceCircleLayer;
		 	 			        distance_circle_layer.clearLayers();
		 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
		 					    distance_circle_layer.addLayer(distance_circle);
		 			        }
				    	}

		 			    //국사포인트 표시하고 정보팝업
				        var marker = L.marker([response.mtsoLatVal, response.mtsoLngVal]);
				        mtsoInfLayer.addLayer(marker);
				        html = html.replace('<%pop_mtsoMgmtNo%>','**********');
				        marker.bindPopup(html).openPopup();

				    //GIS국사정보도 구성팀 국사 위경도도 없으면
				    }else{
				    	//국사의 위도,경도 정보가 없습니다.
				    	callMsgBox('','W', configMsgArray['noMtsoLatLng'] , function(msgId, msgRst){});
				    }
				//GIS국사정보가 있으면
				}else{
				     var latlng = L.MG.Util.wktToGeometry(gisMtsoInf.geoWkt).getLatLng();//국사 위치정보
				     if(response.moveMap){//지도이동여부 예 이면
				    	//해당 좌표로 이동
				    	 gisMap.window.mgMap.setView([latlng.lat, latlng.lng], 13);
		 			    //반경거리 표시해주고
				        if (circleRange != 0){
				        	var distance_circle_layer = gisMap.window.distanceCircleLayer;
		 			        distance_circle_layer.clearLayers();
						    var distance_circle = L.circle([latlng.lat, latlng.lng], parseInt(circleRange));
						    distance_circle_layer.addLayer(distance_circle);
				        }
				   }
				    //국사포인트 표시하고 정보팝업
		        var marker = L.marker([latlng.lat, latlng.lng]);
		        mtsoInfLayer.addLayer(marker);
		        html = html.replace('<%pop_mtsoMgmtNo%>',gisMtsoInf.mtsoMgmtNo);
		        marker.bindPopup(html).openPopup();
				}
		}
    	if (flag == 'mtsos'
    		|| flag == 'eqpinfo'
    		|| flag == 'intgmtso') {
    		$('#cmDtlLkupHeader').find(':input').each(function(){
				switch(this.type) {
				case 'text' :
					$(this).val('');
				break;
				}
			});
    		if(flag == 'mtsos'){

        		$('#cmDtlLkupHeader').setData(response.mtsoInfoList[0]);

//   				console.log('mtsos : ', response.mtsoInfoList[0]);

        		if (response.mtsoInfoList[0].mgmtGrpNm == "SKB") {
        			$("#repIntgFcltsCd2").val(response.mtsoInfoList[0].ukeyMtsoId);
        			$('#tab_Oper').hide();	// SKB 일 경우에는 "운용" 탭 숨김
        			$('#tab_Eqwr').hide();	// SKB 일 경우에는 "환경" 탭 숨김
//        			$('#tab_Draw').hide();	// SKB 일 경우에는 "상면" 탭 숨김
        			$('#tab_Invt').hide();	// SKB 일 경우에는 "투자" 탭 숨김
        			$('#tab_Cnst').hide();	// SKB 일 경우에는 "구축" 탭 숨김
        			$('#tab_Cov').hide();	// SKB 일 경우에는 "Cov." 탭 숨김
        			$('#tab_Erp').hide();	// SKB 일 경우에는 "ERP." 탭 숨김

        		}
        		//2023 통합국사 고도화 추가
        		$('#tab_IntgMtso').hide();	// 통합국이 아닐경우 숨김
        		if(mtsoEqpGubun == "intgmtso"
        			|| response.mtsoInfoList[0].mtsoTypCd == "2") {
        			$('#tab_IntgMtso').show();
        		}

        		paramData = {mtsoEqpId : response.mtsoInfoList[0].mtsoId, sisulCd : response.mtsoInfoList[0].sisulCd, mgmtGrpNm : response.mtsoInfoList[0].mgmtGrpNm, intgMtsoId : response.mtsoInfoList[0].intgMtsoId};
        		$("#linkId").val(response.mtsoInfoList[0].mtsoId);
        		$("#linkNm").val(response.mtsoInfoList[0].mtsoNm);
        		var strSrc = "";
        		switch(linkTab)  {
        		case "tab_Main":
    				$("#tabId").val("tab_Main");
    				linkTab = "tab_Main";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoMain.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Mtso":
    				$("#tabId").val("tab_Mtso");
    				linkTab = "tab_Mtso";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInfo.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Fclt":
    				$("#tabId").val("tab_Fclt");
    				linkTab = "tab_Fclt";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Fclt.do?mtsoId="+paramData.mtsoEqpId +"&mgmtGrpNm="+paramData.mgmtGrpNm;
    				break;
    			case "tab_Erp":
    				$("#tabId").val("tab_Erp");
    				linkTab = "tab_Erp";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoErp.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
    				break;
    			case "tab_Line":
    				$("#tabId").val("tab_Line");
    				linkTab = "tab_Line";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoLineInfo.do?mtsoId="+paramData.mtsoEqpId; //+paramData.mtsoEqpId;
    				break;
    			case "tab_Oper":
    				$("#tabId").val("tab_Oper");
    				linkTab = "tab_Oper";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoOper.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
    				break;
    			case "tab_Eqwr":
    				$("#tabId").val("tab_Eqwr");
    				linkTab = "tab_Eqwr";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EpwrStcInfo.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
    				break;
    			case "tab_Draw":
    				$("#tabId").val("tab_Draw");
    				linkTab = "tab_Draw";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Draw.do?mtsoId="+paramData.mtsoEqpId +"&sisulCd="+paramData.sisulCd+"&variableNm="+variableNm+"&variableVal="+variableVal;
    				break;
    			case "tab_Invt":
    				$("#tabId").val("tab_Invt");
    				linkTab = "tab_Invt";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInvt.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Cnst":
    				$("#tabId").val("tab_Cnst");
    				linkTab = "tab_Cnst";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoCnst.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Cov":
    				$("#tabId").val("tab_Cov");
    				linkTab = "tab_Cov";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/CoverMap.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			//2023 고도화 phase2 추가
    			case "tab_IntgMtso":
    				$("#tabId").val("tab_IntgMtso");
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/IntgMtsoInfo.do?mtsoId="+paramData.mtsoEqpId+"&intgMtsoId="+paramData.intgMtsoId;
    				break;
    			default :
    				$("#tabId").val("tab_Mtso");
    				linkTab = "tab_Mtso";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInfo.do?mtsoId="+paramData.mtsoEqpId;
    				break;
        		}
        	}

    		if(flag == 'intgmtso'){
    			console.log("response : ", response.intgMtsoInfoList[0]);
    			$('#cmDtlLkupHeader').setData(response.intgMtsoInfoList[0]);

        		if (response.intgMtsoInfoList[0].mgmtGrpNm == "SKB") {
        			$("#repIntgFcltsCd2").val(response.intgMtsoInfoList[0].ukeyMtsoId);
        			$('#tab_Oper').hide();	// SKB 일 경우에는 "운용" 탭 숨김
        			$('#tab_Eqwr').hide();	// SKB 일 경우에는 "환경" 탭 숨김
//        			$('#tab_Draw').hide();	// SKB 일 경우에는 "상면" 탭 숨김
        			$('#tab_Invt').hide();	// SKB 일 경우에는 "투자" 탭 숨김
        			$('#tab_Cnst').hide();	// SKB 일 경우에는 "구축" 탭 숨김
        			$('#tab_Cov').hide();	// SKB 일 경우에는 "Cov." 탭 숨김
        			$('#tab_Erp').hide();	// SKB 일 경우에는 "ERP." 탭 숨김

        		}

        		paramData = {mtsoEqpId : response.intgMtsoInfoList[0].mtsoId, sisulCd : response.intgMtsoInfoList[0].sisulCd, mgmtGrpNm : response.intgMtsoInfoList[0].mgmtGrpNm, intgMtsoId : response.intgMtsoInfoList[0].intgMtsoId};
        		$("#linkId").val(response.intgMtsoInfoList[0].mtsoId);
        		$("#linkNm").val(response.intgMtsoInfoList[0].mtsoNm);
        		var strSrc = "";
        		switch(linkTab)  {
        		case "tab_Main":
    				$("#tabId").val("tab_Main");
    				linkTab = "tab_Main";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoMain.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Mtso":
    				$("#tabId").val("tab_Mtso");
    				linkTab = "tab_Mtso";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInfo.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Fclt":
    				$("#tabId").val("tab_Fclt");
    				linkTab = "tab_Fclt";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Fclt.do?mtsoId="+paramData.mtsoEqpId +"&mgmtGrpNm="+paramData.mgmtGrpNm;
    				break;
    			case "tab_Erp":
    				$("#tabId").val("tab_Erp");
    				linkTab = "tab_Erp";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoErp.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
    				break;
    			case "tab_Line":
    				$("#tabId").val("tab_Line");
    				linkTab = "tab_Line";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoLineInfo.do?mtsoId="+paramData.mtsoEqpId; //+paramData.mtsoEqpId;
    				break;
    			case "tab_Oper":
    				$("#tabId").val("tab_Oper");
    				linkTab = "tab_Oper";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoOper.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
    				break;
    			case "tab_Eqwr":
    				$("#tabId").val("tab_Eqwr");
    				linkTab = "tab_Eqwr";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EpwrStcInfo.do?mtsoId="+paramData.mtsoEqpId; //MO01011924080, MO01011933277
    				break;
    			case "tab_Draw":
    				$("#tabId").val("tab_Draw");
    				linkTab = "tab_Draw";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Draw.do?mtsoId="+paramData.mtsoEqpId +"&sisulCd="+paramData.sisulCd+"&variableNm="+variableNm+"&variableVal="+variableVal;
    				break;
    			case "tab_Invt":
    				$("#tabId").val("tab_Invt");
    				linkTab = "tab_Invt";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInvt.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Cnst":
    				$("#tabId").val("tab_Cnst");
    				linkTab = "tab_Cnst";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoCnst.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    			case "tab_Cov":
    				$("#tabId").val("tab_Cov");
    				linkTab = "tab_Cov";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/CoverMap.do?mtsoId="+paramData.mtsoEqpId;
    				break;
    				//2023 고도화 phase2 추가
    			case "tab_IntgMtso":
    				$("#tabId").val("tab_IntgMtso");
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/IntgMtsoInfo.do?mtsoId="+paramData.mtsoEqpId+"&intgMtsoId="+paramData.intgMtsoId;
    				break;
    			default :
    				$("#tabId").val("tab_Mtso");
    				linkTab = "tab_Mtso";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/MtsoInfo.do?mtsoId="+paramData.mtsoEqpId;
    				break;
        		}
        	}
        	if(flag == 'eqpinfo'){
        		$("#intgFcltsCd").val("");
        		$('#cmDtlLkupHeader').setData(response.eqpMgmtList[0]);
        		if (response.eqpMgmtList[0].mgmtGrpNm == "SKB") {
        			$('#tab_EqpOper').hide();	// SKB 일 경우에는 "운영" 탭 숨김
        			$('#tab_EqpDraw').hide();	// SKB 일 경우에는 "상면" 탭 숨김
        			$('#tab_EqpCov').hide();	// SKB 일 경우에는 "Cov." 탭 숨김
        			$('#tab_EqpErp').hide();	// SKB 일 경우에는 "Cov." 탭 숨김
        		}
        		paramData = {mtsoEqpId : response.eqpMgmtList[0].eqpId, sisulCd : response.eqpMgmtList[0].sisulCd, rackId : response.eqpMgmtList[0].rackId, eqpInstlMtsoId : response.eqpMgmtList[0].eqpInstlMtsoId};
        		if (linkTab == undefined || linkTab == null || linkTab == "") {
        			linkTab = "tab_Eqp";
        		}
        		$("#linkId").val(response.eqpMgmtList[0].eqpId);
        		$("#linkNm").val(response.eqpMgmtList[0].eqpNm);
        		var strSrc = "";
        		switch(linkTab)  {
        		case "tab_Eqp":
    				$("#tabId").val("tab_Eqp");
    				linkTab = "tab_Eqp";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpInfo.do?eqpId="+paramData.mtsoEqpId;
    				break;
        		case "tab_Shp":
    				$("#tabId").val("tab_Shp");
    				linkTab = "tab_Shp";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/ShpInfo.do?eqpId="+paramData.mtsoEqpId;
    				break;
        		case "tab_EqpErp":
    				$("#tabId").val("tab_EqpErp");
    				linkTab = "tab_EqpErp";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpErpInfo.do?eqpId="+paramData.mtsoEqpId;
    				break;
        		case "tab_EqpPort":
    				$("#tabId").val("tab_EqpPort");
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpPort.do?eqpId="+paramData.mtsoEqpId+"&eqpNm="+response.eqpMgmtList[0].eqpNm;
    				break;
    			case "tab_EqpLine":
    				$("#tabId").val("tab_EqpLine");
    				linkTab = "tab_EqpLine";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpLineInfo.do?eqpId="+paramData.mtsoEqpId;
    				break;
    			case "tab_EqpOper":
    				$("#tabId").val("tab_EqpOper");
    				linkTab = "tab_EqpOper";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpOper.do?eqpId="+paramData.mtsoEqpId+"&mtsoId="+paramData.eqpInstlMtsoId;
    				break;
    			case "tab_EqpDraw":
    				$("#tabId").val("tab_EqpDraw");
    				linkTab = "tab_EqpDraw";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/Draw.do?itemId="+paramData.rackId +"&sisulCd="+paramData.sisulCd;
    				break;
    			case "tab_EqpCov":
    				$("#tabId").val("tab_EqpCov");
    				linkTab = "tab_EqpCov";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/CoverMap.do?eqpId="+paramData.mtsoEqpId;
    				break;
    			default :
    				$("#tabId").val("tab_Eqp");
    				linkTab = "tab_Eqp";
    				strSrc = "/tango-transmission-web/configmgmt/commonlkup/EqpInfo.do?eqpId="+paramData.mtsoEqpId;
    				break;
        		}
        	}

        	$("#ifrm").attr('src', strSrc);
        	$("[id^='tab_']").removeClass("on");
        	/*******************************************
        	 * 특정 용도로 사용시 해당 탬 메뉴외 비활성화하기 위함. start
        	 ******************************************/
        	if (linkTabContrlYn == 'Y') {
        		$("[id^='tab_']").addClass("info-hidden");
        		$("#"+linkTab).removeClass("info-hidden");
        	}
        	/*******************************************
        	 * 특정 용도로 사용시 해당 탬 메뉴외 비활성화하기 위함. end
        	 ******************************************/
        	$("#"+linkTab).addClass("on");

			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
    	}

    	if(flag == 'userpopest'){
    		if (response.popest.length == 0) {
    			var userId = $("#userId").val();
        		var param = {userId :  userId, popupEstCd :  "0"};
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/updatepopest', param, 'POST', 'updatepopest');
    			popupSetValue = "0";
    		} else {
    			popupEstCd = response.popest[0].popupEstCd;
    			popupSetValue = popupEstCd;
    		}
        	var option_data =  [{cd: "0", cdNm: "현재 페이지에서 이동/보기"},{cd: "1", cdNm: "국사,장비 각 페이지에서 이동/보기"}, {cd: "2", cdNm: "새 페이지에서 이동/보기"}];
      		var selectId = popupSetValue;
    		$('#popupEstCd').setData({
    			data:option_data ,
    			popupEstCd:selectId
    		});
    	}
    	if (flag == 'mtsoMod') {
    		$('#cmDtlLkupHeader').setData(response.mtsoInfoList[0]);
    	}
    	if (flag == 'eqpinfoMod') {
    		$('#cmDtlLkupHeader').setData(response.eqpMgmtList[0]);
    	}
    	if (flag == 'alm') {

    		$('#myUl > li').remove();
    		var strAppend = '';
    		if (response.almList.length > 0) {
    			$.each(response.almList, function(i, item){
    				var faltGrCd = "3";//response.almList[i].faltGrCd;
    				var evtTime = response.almList[i].evtTime.substring(0,10);
    				var eqpNm = response.almList[i].eqpNm;
    				var almDesc = response.almList[i].almDesc;

    				var faltGrCdColor = "blue";
    				if (faltGrCd == "1") {
    					faltGrCdColor = "red";
    				} else if (faltGrCd == "2") {
    					faltGrCdColor = "orange";
    				} else if (faltGrCd == "2") {
    					faltGrCdColor = "yellow";
    				} else if (faltGrCd == "3") {
    					faltGrCdColor = "green";
    				}
    				if (eqpNm == undefined || eqpNm == "undefined") {eqpNm = "미상";}
    				if (almDesc.length > 20) {
    					almDesc = "※ ("+evtTime+") "+ eqpNm+ ', 출입목적 :' + almDesc.substring(0,19)+"..";
    				} else {
    					almDesc = "※ ("+evtTime+") "+ eqpNm+ ', 출입목적 :' + almDesc;
    				}
        			strAppend =  '<li style="overflow:hidden; float:none; width:250px; height:25px;">';
        			strAppend += '<span>&nbsp;&nbsp;'+almDesc+'</span>'; //<span style="background-color:'+faltGrCdColor+'; border: 1px solid;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        			strAppend += '</li>';
        			$('#myUl:last').append(strAppend);
    			});
    			if (frstYn) {
    				if(typeof $().jCarouselLite != "function"){
                	    $.getScript("Marquee.js?vs=2",function(){
                	        $(".jCarouselLite1").jCarouselLite({ visible: 1, speed: 400, auto: 4000, vertical: true });
                	    });
                	}else{
                	    $(".jCarouselLite1").jCarouselLite({ visible: 1, speed: 400, auto: 4000, vertical: true });
                	}
    				frstYn = false;
    			}

    		}
    	}

    	//2023 통합국사 고도화 추가
    	if (flag == 'intgMtsoMod') {

    		$('#cmDtlLkupHeader').setData(response.intgMtsoInfoList[0]);

    	}
    }

    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'info'){
    		alert("잘못된 경로로 접근하였습니다.\n다시 시도하여 주시기 바랍니다.");
    		$a.close();
    	}
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

