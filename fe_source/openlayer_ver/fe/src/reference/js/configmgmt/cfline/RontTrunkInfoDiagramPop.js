/**
 * RontTrunkInfoDiagramPop.js
 *
 * @author Administrator
 * @date 2017.02.17.
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2019-12-24  1. [수정] 기간망 고도화 선번 텍스트 입력
 * 2022-03-24  2. [기능추가] 기간망 HOLA선번 등록
 * 2022-04-13  3. [기능추가] rontHolaLnoSearch HOLA 주선번조회 추가
 */

/** 기간망구간분류코드 */
var rontSctnClCdArr = [ 
         	          { RONT_SCTN_CL_NM : "종단Client_S", RONT_SCTN_CL_CD : "001" }
         			, { RONT_SCTN_CL_NM : "전송Client_S", RONT_SCTN_CL_CD : "002" }
         			, { RONT_SCTN_CL_NM : "시스템IO연동_S_1", RONT_SCTN_CL_CD : "003"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_S_2", RONT_SCTN_CL_CD : "004"}
         			, { RONT_SCTN_CL_NM : "Link 정보_S", RONT_SCTN_CL_CD : "005"}
         			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_S", RONT_SCTN_CL_CD : "006"}
         			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_E", RONT_SCTN_CL_CD : "007"}
         			, { RONT_SCTN_CL_NM : "Link 정보_E", RONT_SCTN_CL_CD : "008"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_E_1", RONT_SCTN_CL_CD : "009"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_E_2", RONT_SCTN_CL_CD : "010"}
         			, { RONT_SCTN_CL_NM : "전송Client_E", RONT_SCTN_CL_CD : "011"}
         			, { RONT_SCTN_CL_NM : "종단Client_E", RONT_SCTN_CL_CD : "012"}
//         			, { RONT_SCTN_CL_NM : "중계", RONT_SCTN_CL_CD : "013"}
         	];

/* 기간망구간항목 */
var rontLnoItemArr = [ 
         	          { OLD_ITEM : "LEFT_NE_ROLE_NM", NEW_ITEM : "lftEqpRoleDivNm" }   // 시스템
         			, { OLD_ITEM : "LEFT_JRDT_TEAM_ORG_NM", NEW_ITEM : "lftJrdtTeamOrgNm" }   // 관리팀
         			, { OLD_ITEM : "LEFT_ORG_NM", NEW_ITEM : "lftEqpInstlMtsoNm" }  // 국사
         			, { OLD_ITEM : "LEFT_VENDOR_NM", NEW_ITEM : "lftVendorNm" }   // 제조사
         			, { OLD_ITEM : "LEFT_NE_NM", NEW_ITEM : "lftEqpNm" }   // 노드
         			, { OLD_ITEM : "LEFT_CARD_MODEL_NM", NEW_ITEM : "lftCardMdlNm" }   // Unit
         			, { OLD_ITEM : "LEFT_SHELF_NM", NEW_ITEM : "lftShlfNm" }   // Shelf
         			, { OLD_ITEM : "LEFT_SLOT_NO", NEW_ITEM : "lftSlotNo" }   // Slot
         			, { OLD_ITEM : "LEFT_PORT_DESCR", NEW_ITEM : "lftPortNm" }   // port
         			, { OLD_ITEM : "RIGHT_NE_NM", NEW_ITEM : "rghtEqpPortRefcVal" }   // 우장비포트
         	];
/**
 * 선번 원본
 */
var originalPath = null;
var originalSprPath = null;

/**
 * 노드 그래프 객체의 데이터 목록
 */
var nodeDataArray = [];
var initParam = null;

var holaFlag = "";


$a.page(function() {
	this.init = function(id, param) {
		gridId = param.gridId;
		ntwkLineNo = param.ntwkLineNo;
		tmofInfoPop(param, param.sFlag);
		initParam = param;
		cflineShowProgressBody();
		// 서비스유형
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01081', null, 'GET', 'rontTrkType');
		
		// 기간망 트렁크 정보
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunkinfo', param, 'GET', 'getRontTrunkInfo');
		
		setButtonEventListener();
    };
})

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 
		data : Param,
		method : Method,
		flag : Flag
	}).done(successCallback)
	.fail(failCallback);
}

function successCallback(response, status, jqxhr, flag){
	if(flag == 'rontTrkType'){	//<----------------
		rontTrkTypCdArr = response;
		
		// 선번 조회 : param - 네트워크회선번호, 구간선번그룹코드, 주.예비구분, 자동수집여부
		/* 2019-12-24  1. [수정] 기간망 고도화 선번 텍스트 입력
		 * var networkPathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "01", "autoClctYn": "N"};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkPathSearch');*/
		var rontLnoParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "01"};
		if(initParam.holaYn != 'Y') {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontlnoinf', rontLnoParam, 'GET', 'rontLnoSearch');
		} else {

			var rontLnoParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "01", "ntwkLnoGrpSrno" : "1"}; 
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontholalnoinf', rontLnoParam, 'GET', 'rontHolaLnoSearch');
		}
		
		
	} else if(flag == 'getRontTrunkInfo') {
		if(response != null && response.length > 0){
			$("#popNtwkLineNm").val(response[0].ntwkLineNm);		// 트렁크명
			$("#popNtwkLineNo").val(response[0].ntwkLineNo); 		// 네트워크 회선번호
			$("#popRontTrkTypNm").val(response[0].rontTrkTypNm); 	// 서비스유형
			rontTrkTypCd = response[0].rontTrkTypCd;
			baseInfData = response[0];
		}
	} else if(flag == 'networkPathSearch'){ 						// 주선번조회
		originalPath = response.data;
		generateUI();
		
		// 예비선번 조회
		var networkReservePathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "02", "autoClctYn": "N"};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkReservePathParam, 'GET', 'networkReservePathSearch');
	} else if(flag == 'networkReservePathSearch') {
		originalSprPath = response.data;
		generateSprUI();
		cflineHideProgressBody();
	} else if(flag == 'rontLnoSearch'){ 	// 주선번조회<----------------
		originalPath = response;
		generateUI("01");
		
		// 예비선번 조회
		var rontLnoParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "02"};
		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontlnoinf', rontLnoParam, 'GET', 'rontLnoReserveSearch');
		
	} else if(flag == 'rontHolaLnoSearch'){ 	// HOLA주 선번 조회
		originalPath = response;
		generateUI("01");
		cflineHideProgressBody();

	}  else if(flag == 'rontLnoReserveSearch') {
		originalSprPath = response;
		generateUI("02");
		//generateSprUI();
		cflineHideProgressBody();
	}
}

function failCallback(status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == 'networkPathSearch'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if(flag == 'rontLnoSearch'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
}

function setButtonEventListener() {
	// 선번 편집
	$('#btnPathEdit').on('click', function(e) {	
		rontTrunkInfoPop();
	});
	
	// Ptp링 리스트 조회 버튼 클릭
	$('#btnPtpRingView').on('click', function(e) {
		//alert(1);		
		var prev = "N";
		var ntwkLineNo = "";
		var ntwkLineNm = "";
		ntwkLineNo = nullToEmpty($("#popNtwkLineNo").val());
		//console.log(ntwkLineNo)		
		openPtpRingListPop();
	});	
	
	// 범례
	$('#btnLegend').on('click', function(e) {
		legendPop();
	});
	
}

function rontTrunkInfoPop() {
	var url = getUrlPath() +'/configmgmt/cfline/RontTrunkInfoPop.do';
	
	$a.popup({
		popid: "RontTrunkInfoPop",
	  	title: cflineMsgArray['backboneNetworkTrunk'] + "&nbsp;" +cflineMsgArray['information'], /*기간망트렁크 정보*/
	  	url: url,
	    data: initParam,
	    iframe: true,
	    modal: false,
	    movable:true,
	    windowpopup : true,
	    width : 1700,
	    height : 800,
	    callback:function(data){
	    	// fnSearch("A", true);
	    }
	});
}

// 범례 팝업
function legendPop() {
	var url = getUrlPath() +'/configmgmt/cfline/RontTrunkLegendPop.do';
	
	$a.popup({
		popid: "RontTrunkLegendPop",
	  	title: '범례',
	  	url: url,
	    data: null,
	    iframe: true,
	    modal: true,
	    movable:false,
	    windowpopup : false,
	    width : 300,
	    height : 400,
	    callback:function(data){
	    }
	});
}

/**
 * 주선번/예비선번 모두 생성
 * wkSprDivCd  - 01 : 주, 02 : 예비 
 */
function generateUI(wkSprDivCd) {
	
	var LNO_TYP = (nullToEmpty(wkSprDivCd) == "02" ? "SPR_" : "");
	var tmpLnoPath = (nullToEmpty(wkSprDivCd) == "02" ? originalSprPath : originalPath);
	

	// 다건의 선번 SET 출력하지 않기 위해
	var chkSetIdIndex = 0;  // 다건 선번 SET 구분 Index
	var endRontLnoIndex = 0;  // 다건 선번 SET 구분 Index
	var frstPathNodIndex = 0;
	for(var i = 0; i < rontSctnClCdArr.length; i++) {
		var rontSctnClCd = rontSctnClCdArr[i].RONT_SCTN_CL_CD;
		var clientHtml = "";
		clientHtml +=	'<table class="ne-table">';
		clientHtml +=		'<colgroup>';
		clientHtml +=			'<col style="width:20%;">';
		clientHtml +=			'<col style="width:30%">';
		clientHtml +=			'<col style="width:30%">';
		clientHtml +=			'<col style="width:20%">';
		clientHtml +=		'</colgroup>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="4" style="background-color: #FAE0CD;" id="RONT_SCTN_CL_NM_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="4" style="background-color: #9FF54C; height:30px;" id="lftEqpRoleDivNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td rowspan="5" id="lftJrdtTeamOrgNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="lftEqpInstlMtsoNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=			'<td rowspan="5" id="lftVendorNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="lftEqpNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="lftCardMdlNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="lftShlfNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="lftSlotNo_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="lftPortNm_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="rghtEqpPortRefcVal_' + LNO_TYP + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=	'</table>';
		
		$("#"+ LNO_TYP + rontSctnClCd).html(clientHtml);
		$("#RONT_SCTN_CL_NM_" + LNO_TYP + rontSctnClCd).text(rontSctnClCdArr[i].RONT_SCTN_CL_NM);
		
		/**
		 * 2019-12-24 1. [수정] 기간망 고도화 
		 */		
		if(tmpLnoPath != null && tmpLnoPath.lnoInfList !=null && chkSetIdIndex == 0) {
			var chkPreRontSctnClCd = 0;  //  마지막으로 설정된 구간 코드 
			for(var idx = 0; idx < tmpLnoPath.lnoInfList.length; idx++) {
				var node = tmpLnoPath.lnoInfList[idx];
				
				// 다건의 선번 SET으로 인해 서로 다른 선번 SET 정보가 표시되는 경우를 방지하기 위해
				if (parseInt(node.rontSctnClCd) > parseInt(rontSctnClCd)  && node.rontSctnClCd != "013") {
					break;
				}
				// 다건의 선번 SET의 구분 Index
				if (chkPreRontSctnClCd > parseInt(node.rontSctnClCd) ) {
					chkSetIdIndex = idx;
					break;
				}
				
				// 첫 중계노드의 index
				if (frstPathNodIndex == 0 && node.rontSctnClCd == "013") {
					frstPathNodIndex = idx;
				}
				
				if(node.rontSctnClCd == rontSctnClCd) {
					$("#lftEqpRoleDivNm_" + LNO_TYP + rontSctnClCd).text(node.lftEqpRoleDivNm);   // 시스템
					$("#lftJrdtTeamOrgNm_" + LNO_TYP + rontSctnClCd).text(node.lftJrdtTeamOrgNm);   // 관리팀
					$("#lftEqpInstlMtsoNm_" + LNO_TYP + rontSctnClCd).text(node.lftEqpInstlMtsoNm);   // 국사
					$("#lftVendorNm_" + LNO_TYP + rontSctnClCd).text(node.lftVendorNm);   // 제조사
					$("#lftEqpNm_" + LNO_TYP + rontSctnClCd).text(node.lftEqpNm);    // 노드명
					$("#lftCardMdlNm_" + LNO_TYP + rontSctnClCd).text(node.lftCardMdlNm);   // Unit
					$("#lftShlfNm_" + LNO_TYP + rontSctnClCd).text(node.lftShlfNm);  // 쉘프
					$("#lftSlotNo_" + LNO_TYP + rontSctnClCd).text(node.lftSlotNo);   // 슬롯
					$("#lftPortNm_" + LNO_TYP + rontSctnClCd).text(node.lftPortNm);   // 포트
					$("#rghtEqpPortRefcVal_" + LNO_TYP + rontSctnClCd).text(node.rghtEqpPortRefcVal);    // 우장비	
					if (parseInt(rontSctnClCd) > 6) {
						endRontLnoIndex=  idx;   // 중계노드 이외의 데이터 셋팅한 구간의 index 
					}
				}
				chkPreRontSctnClCd = node.rontSctnClCd != "013" ? parseInt(node.rontSctnClCd) :chkPreRontSctnClCd ;
			}
		}
	}
	
	var pathHtml = "";
	pathHtml +=	'<div style="height:60vh; overflow:auto;" id="path">';
	pathHtml +=		'<table class="ne-table">';
	pathHtml +=			'<colgroup>';
	pathHtml +=				'<col style="width:30%">';
	pathHtml +=				'<col style="width:70%">';
	pathHtml +=			'</colgroup>';
	pathHtml +=			'<tr>';
	pathHtml +=	        	'<td colspan="2" style="background-color: #FAE0CD">중계</td>';
	pathHtml +=			'</tr>';
	pathHtml +=			'<tr>';
	pathHtml +=		       	'<td style="background-color: #9FF54C">NO</td>';
	pathHtml +=		       	'<td style="background-color: #9FF54C">노드명</td>';
	pathHtml +=			'</tr>';
	for(var idx = 0; idx < 40; idx++) {
		pathHtml +=			'<tr>';
		pathHtml +=		       	'<td>P' + (idx+1)+ '</td>';
		pathHtml +=		       	'<td id="pathNode_' + LNO_TYP + idx + '"></td>';
		pathHtml +=			'</tr>';
	}
	pathHtml +=		'</table>';
	pathHtml +=	'</div>';
	
	$("#" + LNO_TYP + "013").html(pathHtml);
	var pathNodeIdx = 0;
	
	if(tmpLnoPath != null && tmpLnoPath.lnoInfList !=null ) {
				
		// 만약 다건 셋이 아닌경우
		if (chkSetIdIndex == 0 && frstPathNodIndex > 0 ) {
			if (endRontLnoIndex > 0 && frstPathNodIndex > endRontLnoIndex) {
				chkSetIdIndex = endRontLnoIndex;
			} else {
				chkSetIdIndex = tmpLnoPath.lnoInfList.length;
			}
		}
		
		for( var idx = 0; idx < tmpLnoPath.lnoInfList.length; idx++ ){
			var node = tmpLnoPath.lnoInfList[idx];
			if(node.rontSctnClCd == "013" && chkSetIdIndex > idx) {
				$("#pathNode_" + LNO_TYP + pathNodeIdx).text(node.lftEqpNm);
				pathNodeIdx++;
			}
		}
	}
}

/**
 * 예비선번
 */	
function generateSprUI() {
	for(var i = 0; i < rontSctnClCdArr.length; i++) {
		var rontSctnClCd = rontSctnClCdArr[i].RONT_SCTN_CL_CD;
		var clientHtml = "";
		clientHtml +=	'<table class="ne-table">';
		clientHtml +=		'<colgroup>';
		clientHtml +=			'<col style="width:20%">';
		clientHtml +=			'<col style="width:30%">';
		clientHtml +=			'<col style="width:30%">';
		clientHtml +=			'<col style="width:20%">';
		clientHtml +=		'</colgroup>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="4" style="background-color: #FAE0CD" id="RONT_SCTN_CL_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="4" style="background-color: #9FF54C;  height:30px;" id="LEFT_NE_ROLE_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td rowspan="5" id="LEFT_JRDT_TEAM_ORG_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_ORG_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=			'<td rowspan="5" id="LEFT_VENDOR_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_NE_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_CARD_MODEL_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_SHELF_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_SLOT_NO_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_PORT_DESCR_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="RIGHT_NE_NM_SPR_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=	'</table>';
		
		$("#SPR_"+ rontSctnClCd).html(clientHtml);
		$("#RONT_SCTN_CL_NM_SPR_"+ rontSctnClCd).text(rontSctnClCdArr[i].RONT_SCTN_CL_NM);
		
		if(originalSprPath != null && originalSprPath != undefined) {
			for(var idx = 0; idx < originalSprPath.LINKS.length; idx++) {
				var node = originalSprPath.LINKS[idx];
				if(node.RONT_SCTN_CL_CD == rontSctnClCd) {
					$("#LEFT_NE_ROLE_NM_SPR_"+ rontSctnClCd).text(node.LEFT_NE_ROLE_NM);
					$("#LEFT_JRDT_TEAM_ORG_NM_SPR_"+ rontSctnClCd).text(node.LEFT_JRDT_TEAM_ORG_NM);
					$("#LEFT_ORG_NM_SPR_"+ rontSctnClCd).text(node.LEFT_ORG_NM);
					$("#LEFT_VENDOR_NM_SPR_"+ rontSctnClCd).text(node.LEFT_VENDOR_NM);
					$("#LEFT_NE_NM_SPR_"+ rontSctnClCd).text(node.LEFT_NE_NM);
					$("#LEFT_CARD_MODEL_NM_SPR_"+ rontSctnClCd).text(node.LEFT_CARD_MODEL_NM);
					$("#LEFT_SHELF_NM_SPR_"+ rontSctnClCd).text(node.LEFT_SHELF_NM);
					$("#LEFT_SLOT_NO_SPR_"+ rontSctnClCd).text(node.LEFT_SLOT_NO);
					$("#LEFT_PORT_DESCR_SPR_"+ rontSctnClCd).text(node.LEFT_PORT_DESCR);
					
					/* 2019-12-24 1. [수정] 기간망 고도화 */
					var rightNeNm = nullToEmpty(node.RIGHT_EQP_PORT_REFC_VAL) == "" ? node.RIGHT_NE_NM : node.RIGHT_EQP_PORT_REFC_VAL;
					$("#RIGHT_NE_NM_SPR_"+ rontSctnClCd).text(rightNeNm);
					//$("#RIGHT_NE_NM_SPR_"+ rontSctnClCd).text(node.RIGHT_NE_NM);
				}
			}
		}
	}
	
	
	var pathHtml = "";
	pathHtml +=	'<div style="height:60vh; overflow:auto;" id="path">';
	pathHtml +=		'<table class="ne-table">';
	pathHtml +=			'<colgroup>';
	pathHtml +=				'<col style="width:30%">';
	pathHtml +=				'<col style="width:70%">';
	pathHtml +=			'</colgroup>';
	pathHtml +=			'<tr>';
	pathHtml +=	        	'<td colspan="2" style="background-color: #FAE0CD">중계</td>';
	pathHtml +=			'</tr>';
	pathHtml +=			'<tr>';
	pathHtml +=		       	'<td style="background-color: #9FF54C">NO</td>';
	pathHtml +=		       	'<td style="background-color: #9FF54C">노드명</td>';
	pathHtml +=			'</tr>';
	for(var idx = 0; idx < 40; idx++) {
		pathHtml +=			'<tr>';
		pathHtml +=		       	'<td>P' + (idx+1)+ '</td>';
		pathHtml +=		       	'<td id="NE_SPR_' + idx + '"></td>';
		pathHtml +=			'</tr>';
	}
	pathHtml +=		'</table>';
	pathHtml +=	'</div>';
	
	$("#SPR_013").html(pathHtml);
	var pathNodeIdx = 0;
	if(originalSprPath != null && originalSprPath != undefined) {
		for( var idx = 0; idx < originalSprPath.LINKS.length; idx++ ){
			var node = originalSprPath.LINKS[idx];
			if(node.RONT_SCTN_CL_CD == "013") {
				$("#NE_SPR_"+ pathNodeIdx).text(node.LEFT_NE_NM);
				pathNodeIdx++;
			}
		}
	}
}

/**
 * Function Name : openPtpRingListPop
 * Description   : Ptp링 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : ntwkLineNm. 입력한 링 명 
 * 				   prev. 선번 팝업창에서 '이전' 버튼으로 호출하는지 여부 
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openPtpRingListPop() {
		
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	var param = {
			  "ntwkLineNo" : $("#popNtwkLineNo").val()
			, "ntwkLineNm" : $("#popNtwkLineNm").val()
	};
	
 	$a.popup({
 		  	popid: 'PtpRingListPop',
 		  	title: 'Ptp링리스트조회팝업',
 		    url: urlPath+'/configmgmt/cfline/PtpRingListPop.do',
 		    data: param,
 		    iframe: true,
 		    modal : true,
 		    movable : true,
 		    windowpopup : true,
 		    width : 1300,
 		    height : 700,
 		    callback:function(data){
 		    }	 
 		});
}