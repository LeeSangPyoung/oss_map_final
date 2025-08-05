/**
 * 
 * <ul>
 * <li>업무 그룹명 : tango-transmission-web</li>
 * <li>설 명 : WdmTrunkDetailPop.js</li>
 * <li>작성일 : 2018. 5. 29.</li>
 * <li>작성자 : posgen</li>
 * </ul>
 */
  
/** 기간망구간분류코드 */
var rontSctnClCdArr = [ 
         	          { RONT_SCTN_CL_NM : "종단Client_S", RONT_SCTN_CL_CD : "001" }
           			, { RONT_SCTN_CL_NM : "SPLITTER_S", RONT_SCTN_CL_CD : "014" }
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
           			, { RONT_SCTN_CL_NM : "SPLITTER_E", RONT_SCTN_CL_CD : "015" }
         			, { RONT_SCTN_CL_NM : "종단Client_E", RONT_SCTN_CL_CD : "012"}
//         			, { RONT_SCTN_CL_NM : "중계", RONT_SCTN_CL_CD : "013"}
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

var networkPathParam = null;


// 탭별 div 객체
var tabObjList = [ 
               { new_type : "main_pathList_table" , old_type: "old_main_pathList_view", new_type_grid: "main_pathList_view"} 
             , { new_type : "spr_pathList_table" , old_type: "old_spr_pathList_view", new_type_grid: "spr_pathList_view"} 
           ];

var leftOrgNm = "";
var rightOrgNm = "";

/* 관리주체키 */
var mgmtOnrNm = "";

$a.page(function() {
	this.init = function(id, param) {

		leftOrgNm = "LEFT_ORG_NM";
		rightOrgNm = "RIGHT_ORG_NM";
		
		gridId = param.gridId;
		ntwkLineNo = param.ntwkLineNo;
		tmofInfoPop(param, param.sFlag);
		initParam = param;
		
		// TODO SKB ADAMS 연동 고도화
		mgmtGrpCd = param.mgmtGrpCd;
		topoSclCd = param.topoSclCd;
		mgmtOnrNm = param.mgmtOnrNm;

		// TSDN 형태의 그리드
		wdmTrunkPathInitGrid(tabObjList[0].new_type_grid);  // TSDN타입 주선번
		wdmTrunkPathInitGrid(tabObjList[1].new_type_grid);  // TSDN타입 예비선번
		
		oldTypeWdmTrunkPathInitGrid(tabObjList[0].old_type); // Wdm트렁크 기존 선번 형태_주선번
		oldTypeWdmTrunkPathInitGrid(tabObjList[1].old_type); // Wdm트렁크 기존 선번 형태_예비선번
		
		initGridNetworkInfoView();
		
		cflineShowProgressBody();
		// 서비스유형
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01081', null, 'GET', 'rontTrkType');
		
		// 기간망 트렁크 정보
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunkinfo', param, 'GET', 'getRontTrunkInfo');
		// wdm트렁크 정보
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/getwdmtrunkinfo', param, 'GET', 'getWdmTrunkInfo');
		
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
	if(flag == 'rontTrkType'){
		rontTrkTypCdArr = response;
	} 
	// 기본정보 조회
	else if(flag == 'getWdmTrunkInfo') {
		if(response != null ){
			$("#popNtwkLineNm").val(response.ntwkLineNm);		// 트렁크명
			$("#popNtwkLineNo").val(response.ntwkLineNo); 		// 네트워크 회선번호
			$("#popTopoSclNm").val(response.topoSclNm); 	    // 망종류
			$("#popNtwkCapaNm").val(response.ntwkCapaNm); 	    // 용량
			
			baseInfData = response;
			

			$('#pathBaseInfoView').alopexGrid('dataSet', baseInfData);
			$('#pathBaseInfoView').alopexGrid("viewUpdate");
			
			// 선번 조회 : param - 네트워크회선번호, 구간선번그룹코드, 주.예비구분, 자동수집여부
			networkPathParam = {"ntwkLineNo" : ntwkLineNo, "utrdMgmtNo" : initParam.utrdMgmtNo, "exceptFdfNe" : "N", "topoLclCd" : response.topoLclCd, "topoSclCd" : response.topoSclCd, "wkSprDivCd" : "01", "autoClctYn": "N"};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkPathSearch');
		}
	} else if(flag == 'networkPathSearch'){ 						// 주선번조회
		originalPath = response.data;

		// 선번정보가 있는경우
		if (response.data != undefined && response.data.LINKS != undefined) {
			var links = response.data.LINKS;
			// 기존 wdm 트렁크 형식인 경우
			if (nullToEmpty(baseInfData.tsdnRontLineNo) == '') {
				$("#" + tabObjList[0].old_type).show();
				$("#" + tabObjList[0].new_type).hide();
				$('#btnLegend').hide();
				$('#' + tabObjList[0].old_type).alopexGrid('dataSet', links);	
				$('#' + tabObjList[0].old_type).alopexGrid("viewUpdate");
			} 
			// TSDN 형식인 경우
			else {
				$("#" + tabObjList[0].new_type).show();
				$("#" + tabObjList[0].old_type).hide();
				$('#btnLegend').show();
				generateUI();
				$('#'+tabObjList[0].new_type_grid).alopexGrid('dataSet', response.data.LINKS);  // tsdn형태의 그리드
			}
		} 
		// 선번정보가 없는경우 기존 WDM 트렁크 형식으로 표시
		else {
			$("#" + tabObjList[0].old_type).show();
			$("#" + tabObjList[0].new_type).hide();
			$('#btnLegend').hide();
			$("#" + tabObjList[0].old_type).alopexGrid('dataEmpty');
			$('#' + tabObjList[0].old_type).alopexGrid("viewUpdate");
		}
		
		
		// 예비선번 조회
		$.extend(networkPathParam,{"wkSprDivCd": "02"});
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkReservePathSearch');
	} else if(flag == 'networkReservePathSearch') {
		originalSprPath = response.data;
		
		// 선번정보가 있는경우
		if (response.data != undefined && response.data.LINKS != undefined) {
			var links = response.data.LINKS;
			
			// 기존 wdm 트렁크 형식인 경우
			if (nullToEmpty(baseInfData.sprTsdnRontLineNo) == '') {
				// 주선번이 TSDN형식인 경우(데이터가 있어도 표시해주지 않음
				if (nullToEmpty(baseInfData.tsdnRontLineNo) != '') {
					$("#" + tabObjList[1].new_type).show();
					$("#" + tabObjList[1].old_type).hide();
					generateSprUI();
				} else {
					$("#" + tabObjList[1].old_type).show();
					$("#" + tabObjList[1].new_type).hide();
					$('#' + tabObjList[1].old_type).alopexGrid('dataSet', links);
					$('#' + tabObjList[1].old_type).alopexGrid("viewUpdate");
				}	
			}
			// TSDN 형식인 경우
			else {
				$("#" + tabObjList[1].new_type).show();
				$("#" + tabObjList[1].old_type).hide();
				generateSprUI();
				$('#' + tabObjList[1].new_type_grid).alopexGrid('dataSet', response.data.LINKS);  // tsdn형태의 그리드
			}
		}
		// 선번정보가 없는경우 기존 WDM 트렁크 형식으로 표시
		else {
			if (nullToEmpty(baseInfData.tsdnRontLineNo) == '') {
				$("#" + tabObjList[1].old_type).show();
				$("#" + tabObjList[1].new_type).hide();
				$("#" + tabObjList[1].old_type).alopexGrid('dataEmpty');
				$('#' + tabObjList[1].old_type).alopexGrid("viewUpdate");
			} else {
				$("#" + tabObjList[1].new_type).show();
				$("#" + tabObjList[1].old_type).hide();
				generateSprUI();
			}
		}
				
		cflineHideProgressBody();
	}
}

function failCallback(status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == 'networkPathSearch'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
}

function setButtonEventListener() {
	// 선번 편집
	$('#btnWdmPathEdit').on('click', function(e) {	
		wdmTrunkInfoPop();
	});
	
	
	// 범례
	$('#btnLegend').on('click', function(e) {
		legendPop();
	});
	
	// 탭 선택 이벤트
 	$("#rontTrunkWkSpr").on("tabchange", function(e, index) {
 		if(index == 0) {
 			$('#'+tabObjList[0].old_type).alopexGrid("viewUpdate");
 		} else {
 			$('#'+tabObjList[1].old_type).alopexGrid("viewUpdate");
 		}
 	});	
 	
	// 재검색
	$('#btnResearch').on('click', function(e) {
		reSearch();
	});
	
	// 엑셀 다운로드
	$('#btnExportExcelView').on('click', function(e){
		var tabIdx = $("#rontTrunkWkSpr").getCurrentTabIndex();
		
		var fileName = cflineMsgArray['wdmTrunk']; /* WDM트렁크*/
		fileName += (tabIdx == 0 ? "주" : "예비") + cflineMsgArray['lno']; /* 선번 */
		fileName += cflineMsgArray['information']; /* 정보 */
		fileName += "_" + getCurrDate(); /* date */
		
		//$('#'+detailGridId).alopexGrid('hideCol', 'IS_SELECT');

		var excelGrid = tabObjList[0].new_type_grid;
		
		if (tabIdx == 0) {
			// tsdn 형식이 아닌경우
			if ($('#'+tabObjList[0].new_type).css("display") == "none") {
				excelGrid = tabObjList[0].old_type;  // 기존 wdm트렁크 형식의 grid 설정
			}
		} else {
			// tsdn 형식이 아닌경우
			if ($('#'+tabObjList[1].new_type).css("display") == "none") {
				excelGrid = tabObjList[1].old_type;    // 기존 wdm트렁크 형식의 grid 설정
			} else {
				excelGrid = tabObjList[1].new_type_grid;    // tsdn 형식의 wdm트렁크  grid 설정
			}
		}
			
		
		var worker = new ExcelWorker({
     		excelFileName : fileName, 
     		palette : [{
     			className : 'B_YELLOW',
     			backgroundColor: '#EEEEF8'
     		},{
     			className : 'F_RED',
     			color: '#EEEEF8'
     		}],
     		sheetList: [{
     			sheetName: (tabIdx == 0 ? "주" : "예비") + cflineMsgArray['lno'] + cflineMsgArray['information'],
     			placement: 'vertical',
     			$grid: [$('#pathBaseInfoView'), $('#'+excelGrid)]
     		}]
     	});
		
		worker.export({
     		merge: false,
     		exportHidden: false,
     		selected: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		
		//$('#'+detailGridId).alopexGrid('showCol', 'IS_SELECT');
	});
}

function eqpDtlLkupPop(param){
	var tmp = param;
	var eqpId = $('#'+tmp).attr('value');
	
	if(eqpId == undefined || eqpId == "DV00000000000") {
		return;
	} else {
		var param = {"eqpId" : eqpId, "fromE2E": "Y"};
		var urlData = '/tango-transmission-web/configmgmt/equipment/EqpDtlLkupPop.do';
		
		$a.popup({
			popid: 'EqpDtlLkup',
	  		title: cflineMsgArray['equipmentDetailInf'],
	      	url: urlData,
	      	data: param,
	      	windowpopup : true,
	      	modal: true,
	      	movable:true,
	      	width : 865,
	      	height : window.innerHeight * 0.85
		});
	}
}

function changeCursor(param) {
	var tmp = param;
	var eqpId = $('#'+tmp).attr('value');

	if(eqpId == undefined || eqpId == "DV00000000000") {
		return ;
	} else {
		$('#'+tmp).attr('style', 'cursor: pointer;');
	}
}

function wdmTrunkInfoPop() {
	var url = getUrlPath() +'/configmgmt/cfline/WdmTrunkDetailModPop.do';
	
	// 선번편집 눌렀을때 바로 편집모드로 들어가게 하기위해
	initParam.gridId = "dataGridWork";
	
	$a.popup({
		popid: "WdmTrunkInfoPop",
	  	title: cflineMsgArray['wdmTrunk'] + "&nbsp;" +cflineMsgArray['information'], /*Wdm트렁크 정보*/
	  	url: url,
	    data: initParam,
	    iframe: true,
	    modal: false,
	    movable:true,
	    windowpopup : true,
	    width : 1580,
	    height : 860,
	    callback:function(data){
	    	// fnSearch("A", true);
	    }
	});
}

/**
 * 선번편집 후 해당 데이터 재 조회
 */
function reSearch() {

	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/getwdmtrunkinfo', initParam, 'GET', 'getWdmTrunkInfo');
}


//엑셀 다운로드를 위한 기본정보 그리드화
function initGridNetworkInfoView() {
	$('#pathBaseInfoView').alopexGrid({
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		columnMapping : [{ key : 'ntwkLineNm', title : cflineMsgArray['lnNm']/*회선명*/, align : 'center', width : '300px'}
						, { key : 'ntwkLineNo', title : cflineMsgArray['networkLineNumber']/*네트워크회선번호*/, align : 'center', width : '150px'}
						/*, { key : 'rontTrkTypNm', title : cflineMsgArray['serviceType']서비스유형, align : 'left', width : '100px' } */
		]
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
 * 주선번
 */
function generateUI() {
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
		clientHtml +=			'<td colspan="4" style="background-color: #FAE0CD;" id="RONT_SCTN_CL_NM_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="4" style="background-color: #9FF54C; height:30px;" id="LEFT_NE_ROLE_NM_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td rowspan="5" id="LEFT_JRDT_TEAM_ORG_NM_' + rontSctnClCd + '"></td>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_ORG_NM_' + rontSctnClCd + '"></td>';
		clientHtml +=			'<td rowspan="5" id="LEFT_VENDOR_NM_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_NE_NM_' + rontSctnClCd + '" ondblclick="eqpDtlLkupPop(this.id)"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_CARD_MODEL_NM_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_SHELF_NM_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_SLOT_NO_' + rontSctnClCd + '"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=		'<tr>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_PORT_DESCR_' + rontSctnClCd + '"></td>';
		clientHtml +=			'<td colspan="2" style="height:30px;" id="RIGHT_NE_NM_' + rontSctnClCd + '" ondblclick="eqpDtlLkupPop(this.id)" onmouseover="changeCursor(this.id)"></td>';
		/*if (rontSctnClCd == '000' || rontSctnClCd == '015') {
			clientHtml +=			'<td colspan="2" style="height:30px;" id="RIGHT_NE_NM_' + rontSctnClCd + '1"></td>';	
			clientHtml +=		'</tr>';
			clientHtml +=		'<tr>';
			clientHtml +=			'<td colspan="2" style="height:30px;" id="RIGHT_NE_NM_' + rontSctnClCd + '2"></td>';		
		} else {
			clientHtml +=			'<td colspan="2"  rowspan="2" style="height:30px;" id="RIGHT_NE_NM_' + rontSctnClCd + '"></td>';
		}*/
		clientHtml +=		'</tr>';
		clientHtml +=	'</table>';
		
		$("#"+ rontSctnClCd).html(clientHtml);
		$("#RONT_SCTN_CL_NM_"+ rontSctnClCd).text(rontSctnClCdArr[i].RONT_SCTN_CL_NM);
		
		if(originalPath != null) {
			var splitterS = 0;
			var splitterE = 0;
			for(var idx = 0; idx < originalPath.LINKS.length; idx++) {
				var node = originalPath.LINKS[idx];
				if(node.RONT_SCTN_CL_CD == rontSctnClCd) {
					if (node.RONT_SCTN_CL_CD == '014') {
						splitterS++;
					}
					if (node.RONT_SCTN_CL_CD == '015') {
						splitterE++;
					}
					// Splitter_S 혹은 Splitter_E 의 두번째 구간인 경우는 우장비명 이외는 설정작업이 필요없기때문(<- 각각의 splitter의 두번째 구간은 모든 장비들이 동일하고 FDF에 해당하는 우측장비만 다르기 때문에
					if (!( (rontSctnClCd == '014' && splitterS == 2) || (rontSctnClCd == '015' && splitterE == 2) ) ) { 
						$("#LEFT_NE_ROLE_NM_"+ rontSctnClCd).text(node.LEFT_NE_ROLE_NM);
						$("#LEFT_JRDT_TEAM_ORG_NM_"+ rontSctnClCd).text(node.LEFT_JRDT_TEAM_ORG_NM);
						$("#LEFT_ORG_NM_"+ rontSctnClCd).text(node.LEFT_ORG_NM);
						$("#LEFT_VENDOR_NM_"+ rontSctnClCd).text(node.LEFT_VENDOR_NM);
						$("#LEFT_NE_NM_"+ rontSctnClCd).text(node.LEFT_NE_NM);
						$("#LEFT_NE_NM_"+ rontSctnClCd).attr('value', node.LEFT_NE_ID);
						$("#LEFT_NE_NM_"+ rontSctnClCd).attr('style', 'cursor: pointer;');
						$("#LEFT_CARD_MODEL_NM_"+ rontSctnClCd).text(node.LEFT_CARD_MODEL_NM);
						$("#LEFT_SHELF_NM_"+ rontSctnClCd).text(node.LEFT_SHELF_NM);
						$("#LEFT_SLOT_NO_"+ rontSctnClCd).text(node.LEFT_SLOT_NO);
						$("#LEFT_PORT_DESCR_"+ rontSctnClCd).text(node.LEFT_PORT_DESCR);
					}
					if (splitterS == 2 || splitterE == 2 ) {
						if (nullToEmpty(node.RIGHT_NE_NM) != '') {
							if ($("#RIGHT_NE_NM_"+ rontSctnClCd).text() != node.RIGHT_NE_NM) {
								$("#RIGHT_NE_NM_"+ rontSctnClCd).text($("#RIGHT_NE_NM_"+ rontSctnClCd).text() + "(" + node.RIGHT_NE_NM + ")");
							}
						}						
					} else {
						$("#RIGHT_NE_NM_"+ rontSctnClCd).text(node.RIGHT_NE_NM);
						$("#RIGHT_NE_NM_"+ rontSctnClCd).attr('value', node.RIGHT_NE_ID);
					}			
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
		pathHtml +=		       	'<td id="NE_' + idx + '" ondblclick="eqpDtlLkupPop(this.id)"></td>';
		pathHtml +=			'</tr>';
	}
	pathHtml +=		'</table>';
	pathHtml +=	'</div>';
	
	$("#013").html(pathHtml);
	var pathNodeIdx = 0;
	if(originalPath != null) {
		for( var idx = 0; idx < originalPath.LINKS.length; idx++ ){
			var node = originalPath.LINKS[idx];
			if(node.RONT_SCTN_CL_CD == "013") {
				$("#NE_"+ pathNodeIdx).text(node.LEFT_NE_NM);
				$("#NE_"+ pathNodeIdx).attr('value', node.LEFT_NE_ID);
				$("#NE_"+ pathNodeIdx).attr('style', 'cursor: pointer;');
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
		clientHtml +=			'<td colspan="2" style="height:30px;" id="LEFT_NE_NM_SPR_' + rontSctnClCd + '" ondblclick="eqpDtlLkupPop(this.id)"></td>';
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
		clientHtml +=			'<td colspan="2" style="height:30px;" id="RIGHT_NE_NM_SPR_' + rontSctnClCd + '" ondblclick="eqpDtlLkupPop(this.id)" onmouseover="changeCursor(this.id)"></td>';
		clientHtml +=		'</tr>';
		clientHtml +=	'</table>';
		
		$("#SPR_"+ rontSctnClCd).html(clientHtml);
		$("#RONT_SCTN_CL_NM_SPR_"+ rontSctnClCd).text(rontSctnClCdArr[i].RONT_SCTN_CL_NM);
		
		if(originalSprPath != null && originalSprPath != undefined) {

			var splitterS = 0;
			var splitterE = 0;
			
			for(var idx = 0; idx < originalSprPath.LINKS.length; idx++) {
				
				var node = originalSprPath.LINKS[idx];
				if(node.RONT_SCTN_CL_CD == rontSctnClCd) {
					if (node.RONT_SCTN_CL_CD == '014') {
						splitterS++;
					}
					if (node.RONT_SCTN_CL_CD == '015') {
						splitterE++;
					}
					
					// Splitter_S 혹은 Splitter_E 의 두번째 구간인 경우는 우장비명 이외는 설정작업이 필요없기때문(<- 각각의 splitter의 두번째 구간은 모든 장비들이 동일하고 FDF에 해당하는 우측장비만 다르기 때문에
					if (!( (rontSctnClCd == '014' && splitterS == 2) || (rontSctnClCd == '015' && splitterE == 2) ) ) { 
						$("#LEFT_NE_ROLE_NM_SPR_"+ rontSctnClCd).text(node.LEFT_NE_ROLE_NM);
						$("#LEFT_JRDT_TEAM_ORG_NM_SPR_"+ rontSctnClCd).text(node.LEFT_JRDT_TEAM_ORG_NM);
						$("#LEFT_ORG_NM_SPR_"+ rontSctnClCd).text(node.LEFT_ORG_NM);
						$("#LEFT_VENDOR_NM_SPR_"+ rontSctnClCd).text(node.LEFT_VENDOR_NM);
						$("#LEFT_NE_NM_SPR_"+ rontSctnClCd).text(node.LEFT_NE_NM);
						$("#LEFT_NE_NM_SPR_"+ rontSctnClCd).attr('value', node.LEFT_NE_ID);
						$("#LEFT_NE_NM_SPR_"+ rontSctnClCd).attr('style', 'cursor: pointer;');
						$("#LEFT_CARD_MODEL_NM_SPR_"+ rontSctnClCd).text(node.LEFT_CARD_MODEL_NM);
						$("#LEFT_SHELF_NM_SPR_"+ rontSctnClCd).text(node.LEFT_SHELF_NM);
						$("#LEFT_SLOT_NO_SPR_"+ rontSctnClCd).text(node.LEFT_SLOT_NO);
						$("#LEFT_PORT_DESCR_SPR_"+ rontSctnClCd).text(node.LEFT_PORT_DESCR);
					}
					if (splitterS == 2 || splitterE == 2 ) {
						if (nullToEmpty(node.RIGHT_NE_NM) != '') {
							if ($("#RIGHT_NE_NM_SPR_"+ rontSctnClCd).text() != node.RIGHT_NE_NM) {
								$("#RIGHT_NE_NM_SPR_"+ rontSctnClCd).text($("#RIGHT_NE_NM_SPR_"+ rontSctnClCd).text() + "(" + node.RIGHT_NE_NM + ")");
							}
						}						
					} else {
						$("#RIGHT_NE_NM_SPR_"+ rontSctnClCd).text(node.RIGHT_NE_NM);
						$("#RIGHT_NE_NM_SPR_"+ rontSctnClCd).attr('value', node.RIGHT_NE_ID);
					}	
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
		pathHtml +=		       	'<td id="NE_SPR_' + idx + '" ondblclick="eqpDtlLkupPop(this.id)"></td>';
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
				$("#NE_SPR_"+ pathNodeIdx).attr('value', node.LEFT_NE_ID);
				$("#NE_SPR_"+ pathNodeIdx).attr('style', 'cursor: pointer;');
				pathNodeIdx++;
			}
		}
	}
}


/**
 * Function Name : tooltipNetworkText
 * Description   : 툴팁
 * ----------------------------------------------------------------------------------------------------
 * param    	 : value. 값
 *                 data   데이터
 *                 mapping 메핑키
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function tooltipNetworkText(value, data, mapping){

	var str = '';
	if ( mapping.key == 'TRUNK_NM' ) {
//		if ( data.TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//			str = '트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//		} else {
//			str = data.TRUNK_NM;
//		}
		
		str = data.TRUNK_NM;
	}
	else if ( mapping.key == 'RING_NM' ) {
//		if ( data.RING_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//			str = '링 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//		} else {
//			str = data.RING_NM;
//		}
		
		str = data.RING_NM;
	}		
	else if ( mapping.key == 'WDM_TRUNK_NM' ) {
//		if ( data.WDM_TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//			str = 'WDM 트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//		} else {
//			str = data.WDM_TRUNK_NM;
//		}
		
		str = data.WDM_TRUNK_NM;
	}

	return str;
}


function wdmStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#D6EED6';
	} 
	
	return style;
	
}

function inlineStyleCss(value, data, mapping){
	var style = { 'text-decoration' : 'line-through', 'color' : 'red' }; 
	 
	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if(deletecheck) {
		return style;
	} else {
		return value;
	}
}

function checkDeleteNodeOrPort(data, mapping) {
	var deletecheck = false;
	// WEST 장비
	if(mapping.key == 'LEFT_NE_NM') {
		if(data.LEFT_NE_STATUS_CD == '02' || data.LEFT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'LEFT_PORT_DESCR') {
		if(data.LEFT_PORT_STATUS_CD == '02' || data.LEFT_PORT_STATUS_CD == '03') {
			deletecheck = true;
		} 
	}
	
	// EAST 장비
	if(mapping.key == 'RIGHT_NE_NM') {
		if(data.RIGHT_NE_STATUS_CD == '02' || data.RIGHT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'RIGHT_PORT_DESCR') {
		if(data.RIGHT_PORT_STATUS_CD == '02' || data.RIGHT_PORT_STATUS_CD == '03') {
			deletecheck = true;
		} 
	}
	return deletecheck;
}

function nodeCopyPasteCss(value, data, mapping) {
	// 장비 복사, 잘라내기 배경색 
	var channelYn = false;
	if(data.LEFT_NE_COPY == "copy") {
		if(mapping.key.indexOf("LEFT") == 0) {
			return 'nodeSelectBackground';
		} 
	} else if(data.RIGHT_NE_COPY == "copy") {
		if(mapping.key.indexOf("RIGHT") == 0) {
			return 'nodeSelectBackground';
		}
	} else {
		channelYn = true;
	}
	
	// 국사 묶음 표시
	if(nullToEmpty(data.LEFT_ORG_BORDER) != "") {
		if(data.LEFT_ORG_BORDER.indexOf("leftSame") == 0) {
			if(mapping.key == "LEFT_ORG_NM") {
//			if(mapping.key.indexOf("LEFT") == 0) {
				var indexKey = data.LEFT_ORG_BORDER.replace("leftSame", "") % 3;
				return 'orgBorder'+indexKey;
//				if(mapping.key == "LEFT_ORG_NM") {
//					return 'orgBorder'+indexKey + ' left';
//				} else if(mapping.key == "LEFT_CHANNEL_DESCR"){
//					return 'orgBorder'+indexKey + ' right';
//				} else {
//					return 'orgBorder'+indexKey;
//				}
				
			}
		} 
	}
	
	if(nullToEmpty(data.RIGHT_ORG_BORDER) != "") {
		if(data.RIGHT_ORG_BORDER.indexOf("rightSame") == 0) {
			if(mapping.key == "RIGHT_ORG_NM") {
//			if(mapping.key.indexOf("RIGHT") == 0) {
				var indexKey = data.RIGHT_ORG_BORDER.replace("rightSame", "") % 3;
				return 'orgBorderRght'+indexKey;
//				if(mapping.key == "RIGHT_ORG_NM") {
//					return 'orgBorderRght'+indexKey + ' left';
//				} else if(mapping.key == "RIGHT_CHANNEL_DESCR") {
//					return 'orgBorderRght'+indexKey + ' right';
//				} else {
//					return 'orgBorderRght'+indexKey;
//				}
			}
		} 
	}
	 	
	// 채널과 사용네트워크의 채널의 시작이 다를 때 테두리 색깔
	if(channelYn) {
		var useChannelDescr = "";
		var channelDescr = "";
		if(mapping.key == "LEFT_CHANNEL_DESCR") {
			useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
			channelDescr = data['LEFT_CHANNEL_DESCR'];
		} else if(mapping.key == "RIGHT_CHANNEL_DESCR") {
			useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
			channelDescr = data['RIGHT_CHANNEL_DESCR'];
		}
		
		if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
			return 'channelDescrCss';
		} else {
			return '';
		}
	}
}


/**
 * Function Name : tooltipText
 * Description   : 툴팁
 * ----------------------------------------------------------------------------------------------------
 * param    	 : value. 값
 *                 data   데이터
 *                 mapping 메핑키
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function tooltipText(value, data, mapping){

	var str = "삭제된 장비 또는 포트입니다.";
	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if(deletecheck) {
		return str;
	} else {
		if ( mapping.key == 'LEFT_NE_NM' ) {
			str = '장비ID : ' + nullToEmpty(data.LEFT_NE_ID) + '\n장비명 : ' + nullToEmpty(data.LEFT_NE_NM) + '\n장비역할 : ' + nullToEmpty(data.LEFT_NE_ROLE_NM)
					+ '\n제조사 : ' + nullToEmpty(data.LEFT_VENDOR_NM)
					+ '\n모델 : ' + nullToEmpty(data.LEFT_MODEL_NM)
					+ '\n모델(대) : ' + nullToEmpty(data.LEFT_MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.LEFT_MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.LEFT_MODEL_SCL_NM)
				 	+ '\n상태 : ' + nullToEmpty(data.LEFT_NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.LEFT_ORG_NM) + '\n전송실 : ' + nullToEmpty(data.LEFT_ORG_NM_L3)
				 	+ '\n더미장비 : ' + nullToEmpty(data.LEFT_NE_DUMMY);
		}
		else if ( mapping.key == 'RIGHT_NE_NM' ) {
			str = '장비ID : ' + nullToEmpty(data.RIGHT_NE_ID) + '\n장비명 : ' + nullToEmpty(data.RIGHT_NE_NM) + '\n장비역할 : ' + nullToEmpty(data.RIGHT_NE_ROLE_NM)
					+ '\n제조사 : ' + nullToEmpty(data.RIGHT_VENDOR_NM)
					+ '\n모델 : ' + nullToEmpty(data.RIGHT_MODEL_NM)
					+ '\n모델(대) : ' + nullToEmpty(data.RIGHT_MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.RIGHT_MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.RIGHT_MODEL_SCL_NM)
				 	+ '\n상태 : ' + nullToEmpty(data.RIGHT_NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.RIGHT_ORG_NM) + '\n전송실 : ' + nullToEmpty(data.RIGHT_ORG_NM_L3)
					+ '\n더미장비 : ' + nullToEmpty(data.RIGHT_NE_DUMMY);
		}		
		else if ( mapping.key == 'LEFT_PORT_DESCR' ) {
			str = '포트ID : ' + nullToEmpty(data.LEFT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.LEFT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.LEFT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.LEFT_PORT_DUMMY);
		}
		else if ( mapping.key == 'RIGHT_PORT_DESCR' ) {
			str = '포트ID : ' + nullToEmpty(data.RIGHT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.RIGHT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.RIGHT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.RIGHT_PORT_DUMMY);
		}
		else {
			str = value;
		}
	}
	return str;
}

/**
 * Function Name : wdmTrunkPathInitGrid
 * Description   : TSDN wdm트렁크 선번 그리드 생성
 * ----------------------------------------------------------------------------------------------------
 * param    	 : gridId. 그리드 ID 
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
/*
 * Wdm 트렁크 기존 데이터 형태
 */
function wdmTrunkPathInitGrid(gridId) {
	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
 	var column = [
		              { key : 'WDM_TRUNK_ID', align : 'center', width : '10px', hidden : true}
				    , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
					  }
				    , { key : 'SET_ID', title : "PATH ID", align : 'center', width : '100px', hidden : true}
					, { key : 'RONT_SCTN_CL_CD', title : cflineMsgArray['division']/*구분*/, width : '100px', hidden : true}
					, { key : 'RONT_SCTN_CL_NM', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px' }
					, { key : 'WDM_TRUNK_NM', title : cflineMsgArray['trunkNm']/*트렁크명*/, align : 'left', hidden : true, width : '140px'}
					, { key : 'LEFT_NE_ROLE_NM', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '60px' }
					, { key : 'LEFT_JRDT_TEAM_ORG_NM', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' }
					, { key : 'LEFT_VENDOR_NM', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '70px'}
		//			, { key : 'LEFT_ORG_NM_L3', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
					, { key : 'LEFT_ORG_NM', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
					, { key : 'LEFT_NE_ID', align : 'center', title : '' /*노드ID*/, hidden : true}
					, { key : 'LEFT_NE_NM', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '150px' }
					, { key : 'LEFT_CARD_MODEL_NM', title : 'Unit', align : 'left', width : '70px' }
					, { key : 'LEFT_SHELF_NM', title : 'Shelf', align : 'left', width : '50px' }
					, { key : 'LEFT_SLOT_NO', title : 'Slot', align : 'left', width : '50px' }
					, { key : 'LEFT_PORT_DESCR', title : 'Port', align : 'left', width : '90px' }
					, { key : 'RIGHT_NE_ID', align : 'center', title : '' /*FDF*/, hidden : true}
					, { key : 'RIGHT_NE_NM', title : 'FDF', align : 'left', width : '130px'}
					, { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['fiberDistributionFramePort']/*FDF포트*/, align : 'left', width : '90px' }
			    ];
 	
 	$('#'+gridId).alopexGrid({
		fitTableWidth: true,
		fillUndefinedKey : null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		autoResize: true,
		cellInlineEdit : false,
		cellSelectable : false,
		rowInlineEdit: false,
		rowClickSelect : false,
		rowSingleSelect : true,
		rowspanGroupSelect: true,
		height : 550,
		width : 1530,
		columnMapping : column,
    	message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
		}
	});
	
	$('#'+gridId).alopexGrid("updateOption", { fitTableWidth: true });
}

/**
 * Function Name : oldTypeWdmTrunkPathInitGrid
 * Description   : 기존 wdm트렁크 선번 그리드 생성
 * ----------------------------------------------------------------------------------------------------
 * param    	 : gridId. 그리드 ID 
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
/*
 * Wdm 트렁크 기존 데이터 형태
 */
function oldTypeWdmTrunkPathInitGrid(gridId) {
	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
 	var column = [
		           { 	 key : 'WDM_TRUNK_MERGE', hidden : true
		        	   , value : function(value, data) {
									return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; 
							    }
		           }	
				    , { key : 'WDM_TRUNK_NM'
				        	, title : cflineMsgArray['wdmTrunkName']
				    		, align : 'left', width : '200px'
				    		, inlineStyle: wdmStyleCss
				    		, tooltip : tooltipNetworkText
							, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
							, hidden : true 
					}
				    , { key : 'WDM_TRUNK_ID', 			align : 'center', width : '10px', hidden : true}
				    , { key : leftOrgNm, 				title : cflineMsgArray['westMtso'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss} /* A 국사 */
				    , { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '170px', inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss } /* A장 비 */
				    , { key : 'LEFT_PORT_USE_TYPE_NM',	title : cflineMsgArray['west'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss} /* 좌포트사용용도 */
				    , { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '150px', styleclass : nodeCopyPasteCss, tooltip : tooltipText } /* A 포트 */
				    , { key : 'LEFT_CARD_WAVELENGTH',	title : cflineMsgArray['westWavelength'], align : 'center', width : '80px', styleclass : nodeCopyPasteCss} /* 좌파장 */
				    
				    , { key : 'A', 			title : '',  align : 'left', width : '5px'
						, styleclass: 'guard'
						, headerStyleclass : 'guard'
					} 
				    
				    , { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '170px', inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss} /* B 장비 */
				    , { key : 'RIGHT_PORT_USE_TYPE_NM',	title : cflineMsgArray['east'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss} /* 우포트사용용도 */
				    , { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '150px', styleclass : nodeCopyPasteCss, tooltip : tooltipText } /* B 포트 */
				    , { key : 'RIGHT_CARD_WAVELENGTH',	title : cflineMsgArray['eastWavelength'], align : 'center', width : '80px', styleclass : nodeCopyPasteCss} /* 우파장 */
				    , { key : rightOrgNm, 				title : cflineMsgArray['eastMtso'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss, styleclass : nodeCopyPasteCss } /* B 국사 */ 
			    ];
 	
 	$('#'+gridId).alopexGrid({
		fitTableWidth: true,
		fillUndefinedKey : null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		autoResize: true,
		cellInlineEdit : false,
		cellSelectable : false,
		rowInlineEdit: false,
		rowClickSelect : false,
		rowSingleSelect : true,
		rowspanGroupSelect: true,
		height : 550,
		//width : 1530,
		columnMapping : column,
    	message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
		}
	});
	
	$('#'+gridId).alopexGrid("updateOption", { fitTableWidth: true });
}
