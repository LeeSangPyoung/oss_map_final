/**
 * RontTrunkInfoPop.js
 *
 * @author Administrator
 * @date 2017.02.17.
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2019-12-24  1. [수정] 기간망 고도화 선번 텍스트 입력
 * 2022-04-13  2. [수정] hola 기간망판단 flag 추가
 */
var detailGridId = "pathList";
var baseGridId = "pathBaseInfo";
var reserveGridId = "reservePathList";
var currentGridId= "pathList";


var gridId = "";
var ntwkLineNo = "";
var rontTrkTypCd = "";
var rontTrkTypCdArr = [];
var topoLclCd = "003";
var topoSclCd = "102";
var dataDeleteCount = 0;
var baseInfData = [];
var setIdNumber = 1;
var ntwkLnoGrpSrno = "";
var reservePathSameNo = "";


var initParam = null;

/** 기간망구간분류코드 */
var rontSctnClCdArr = [ 
         	          { RONT_SCTN_CL_NM : "종단Client_S", RONT_SCTN_CL_CD : "001" , rontSctnClNm : "종단Client_S", rontSctnClCd : "001" }
         			, { RONT_SCTN_CL_NM : "전송Client_S", RONT_SCTN_CL_CD : "002" , rontSctnClNm : "전송Client_S", rontSctnClCd : "002"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_S_1", RONT_SCTN_CL_CD : "003", rontSctnClNm : "시스템IO연동_S_1", rontSctnClCd : "003"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_S_2", RONT_SCTN_CL_CD : "004", rontSctnClNm : "시스템IO연동_S_2", rontSctnClCd : "004"}
         			, { RONT_SCTN_CL_NM : "Link 정보_S", RONT_SCTN_CL_CD : "005", rontSctnClNm : "Link 정보_S", rontSctnClCd : "005"}
         			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_S", RONT_SCTN_CL_CD : "006", rontSctnClNm : "ROADM MUX 정보_S", rontSctnClCd : "006"}
         			, { RONT_SCTN_CL_NM : "중계", RONT_SCTN_CL_CD : "013", rontSctnClNm : "중계", rontSctnClCd : "013"}
         			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_E", RONT_SCTN_CL_CD : "007", rontSctnClNm : "ROADM MUX 정보_E", rontSctnClCd : "007"}
         			, { RONT_SCTN_CL_NM : "Link 정보_E", RONT_SCTN_CL_CD : "008", rontSctnClNm : "Link 정보_E", rontSctnClCd : "008"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_E_1", RONT_SCTN_CL_CD : "009", rontSctnClNm : "시스템IO연동_E_1", rontSctnClCd : "009"}
         			, { RONT_SCTN_CL_NM : "시스템IO연동_E_2", RONT_SCTN_CL_CD : "010", rontSctnClNm : "시스템IO연동_E_2", rontSctnClCd : "010"}
         			, { RONT_SCTN_CL_NM : "전송Client_E", RONT_SCTN_CL_CD : "011", rontSctnClNm : "전송Client_E", rontSctnClCd : "011"}
         			, { RONT_SCTN_CL_NM : "종단Client_E", RONT_SCTN_CL_CD : "012", rontSctnClNm : "종단Client_E", rontSctnClCd : "012"}
         	];

var rontSctnLinkClCdArr = [
          			  { RONT_SCTN_CL_NM : "Link 정보_S", RONT_SCTN_CL_CD : "005" , rontSctnClNm : "Link 정보_S", rontSctnClCd : "005"}
          			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_S", RONT_SCTN_CL_CD : "006", rontSctnClNm : "ROADM MUX 정보_S", rontSctnClCd : "006"}
          			, { RONT_SCTN_CL_NM : "중계", RONT_SCTN_CL_CD : "013", rontSctnClNm : "중계", rontSctnClCd : "013"}
          			, { RONT_SCTN_CL_NM : "ROADM MUX 정보_E", RONT_SCTN_CL_CD : "007", rontSctnClNm : "ROADM MUX 정보_E", rontSctnClCd : "007"}
          			, { RONT_SCTN_CL_NM : "Link 정보_E", RONT_SCTN_CL_CD : "008", rontSctnClNm : "Link 정보_E", rontSctnClCd : "008"}
          	];

// 링크구간은 수정을 못하게? - 확인되면 수정 
$a.page(function() {
	this.init = function(id, param) {
		gridId = param.gridId;
		ntwkLineNo = param.ntwkLineNo;
		
		setEventListener();
		setButtonDisplay(gridId);
		tmofInfoPop(param, param.sFlag);
		initParam = param;	//추가
		
		$("#rontAllView").setChecked(true);
		

		cflineShowProgressBody();
		
		// 서비스유형
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01081', null, 'GET', 'rontTrkType');
		
		// 기간망 트렁크 정보
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronttrunkinfo', param, 'GET', 'getRontTrunkInfo');
    };

    function setEventListener() {
    	
    	$('#btnClose').on('click', function(e){
    		$a.close();
	    });
    	
		$('#rontAllView').on('click', function(e){
			if($('#rontAllView').is(':checked')) {
				$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
				$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			} else {
				$('#'+detailGridId).alopexGrid('deleteFilter', 'filterVisibleLink');
				$('#'+reserveGridId).alopexGrid('deleteFilter', 'filterVisibleLink');
			}
		});
		
		// 편집
		$('#btnRegEqp').on('click', function(e){
			setButtonDisplay("dataGridWork");
			
			var dataList = $('#'+detailGridId).alopexGrid("dataGet");
    		if(dataList == null || dataList.length == 0){
    			addPathSet(detailGridId);
    		} else {
    			setPathData(dataList, false, detailGridId);
    		}
    		
    		var reserveDataList = $('#'+reserveGridId).alopexGrid("dataGet");
    		if(reserveDataList == null || reserveDataList.length == 0){
    			addPathSet(reserveGridId);
    		} else {
    			setPathData(reserveDataList, false, reserveGridId);
    		}
    		
    		if($('#rontAllView').is(':checked')) {
    			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
    			$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
    		}
    		
    		startEditingMode();
    		$('#'+currentGridId).alopexGrid("viewUpdate");
    	});
    	
		// 저장
		$('#btnSave').on('click', function(e){
    		savePath();
    	});
		
		// 선번 삭제
    	$('#btnPathDelete').on('click', function(e){
    		deletePath();
    	});
    	
    	$('#btnAutoClctPath').on('click', function(e){
    		openAutoClctPathListPop();
    	});
    	
    	// 선번 SET 추가
    	$('#btnPathSetAdd').on('click', function(e){
    		addPathSet(currentGridId);
    	});
    	
		// 예비선번으로 변경
		$('#btnReservePathChange').on('click', function(e){
			var networkPathList = AlopexGrid.trimData($('#'+detailGridId).alopexGrid('dataGet'));
			var reservePathList = AlopexGrid.trimData($('#'+reserveGridId).alopexGrid('dataGet'));
			
			$('#'+detailGridId).alopexGrid('dataSet', reservePathList);
			$('#'+reserveGridId).alopexGrid('dataSet', networkPathList);
			
			$("#"+detailGridId).alopexGrid("startEdit");
			$("#"+reserveGridId).alopexGrid("startEdit");
			
			if($('#rontAllView').is(':checked')) {
				$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
				$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			}
		});
    	
    	// 탭 선택 이벤트
   	 	$("#basicTabsPop").on("tabchange", function(e, index) {
   	 		if(index == 0) {
   	 			$("#btnReservePathChange").show();
   	 			$("#btnSave").show();
   	 			$("#btnExportExcel").show();
   	 			$("#btnClose").show();
	   	 		if(initParam.holaYn == 'Y') {
		   	 		$("#btnAutoClctPath").hide();
		   			$("#btnReservePathChange").hide();
		   			$("#btnPathSetAdd").hide();
		   			$("#btnPathDelete").hide();
		   			$("#btnSave").hide();
		   			$("#btnRegEqp").hide();
	   	 		}
   			
   	 			$('#'+detailGridId).alopexGrid("viewUpdate");
   	 			currentGridId = detailGridId;
   	 		} else if(index == 1) {
   	 			$("#btnReservePathChange").hide();
   	 			$("#btnSave").hide();
   	 			$("#btnExportExcel").hide();
   	 			$("#btnClose").hide();
   	 			$('#'+reserveGridId).alopexGrid("viewUpdate");
   	 			currentGridId = reserveGridId;
   	 		}
   	 	});
    	
    	// 엑셀 다운로드
    	$('#btnExportExcel').on('click', function(e){
    		var fileName = cflineMsgArray['backboneNetworkTrunk']; /* 기간망트렁크*/
    		fileName += cflineMsgArray['lno']; /* 선번 */
    		fileName += cflineMsgArray['information']; /* 정보 */
    		fileName += "_" + getCurrDate(); /* date */
    		
    		$('#'+detailGridId).alopexGrid('hideCol', 'IS_SELECT');
    		
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
         			sheetName: cflineMsgArray['lno'] + cflineMsgArray['information'],
         			placement: 'vertical',
         			$grid: [$('#'+baseGridId), $('#'+detailGridId)]
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
    		
    		$('#'+detailGridId).alopexGrid('showCol', 'IS_SELECT');
    	});
    }
});

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, //URL 기존 처럼 사용하시면 됩니다.
		data : Param, //data가 존재할 경우 주입
		method : Method, //HTTP Method
		flag : Flag
	}).done(successCallback)
	.fail(failCallback);
}

function successCallback(response, status, jqxhr, flag){
	if(flag == 'rontTrkType'){
		rontTrkTypCdArr = response;
		
		// 선번 조회 : param - 네트워크회선번호, 구간선번그룹코드, 주.예비구분, 자동수집여부
//		var networkPathParam = {"ntwkLineNo" : ntwkLineNo, "ntwkLnoGrpSrno" : "1", "wkSprDivCd" : "01", "autoClctYn": "N"};
		var networkPathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "01", "autoClctYn": "N"};
		var networkReservePathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "02", "autoClctYn": "N"};
		/* 2019-12-24  1. [수정] 기간망 고도화 선번 텍스트 입력
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkPathParam, 'GET', 'networkPathSearch');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', networkReservePathParam, 'GET', 'networkReservePathSearch');
		*/

		if(initParam.holaYn != 'Y') {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontlnoinf', networkPathParam, 'GET', 'rontLnoSearch');	
		} else {

			var networkPathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "01", "autoClctYn": "N", "ntwkLnoGrpSrno" : "1"};
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontholalnoinf', networkPathParam, 'GET', 'rontHolaLnoSearch');
		}
	}
	else if(flag == 'getRontTrunkInfo') {
		if(response != null && response.length > 0){
			$("#popNtwkLineNm").val(response[0].ntwkLineNm);	// 트렁크명
			$("#popNtwkLineNo").val(response[0].ntwkLineNo); // 네트워크 회선번호
			$("#popRontTrkTypNm").val(response[0].rontTrkTypNm); // 서비스유형
			rontTrkTypCd = response[0].rontTrkTypCd;
			// 서비스유형이 LINK일 경우 트렁크 전체보기 체크박스, 선번SET추가 숨기기
			if(rontTrkTypCd == '023'){
				$("#rontAllViewCheck").hide();
				$("#btnPathSetAdd").hide();
			}
			
			baseInfData = response[0];
		}
	}
	else if(flag == 'networkPathSearch'){ 				//주선번조회
		cflineHideProgressBody();
		var links;
		
		if(gridId == "dataGridWork"){
			if(response.data != undefined && response.data.LINKS != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					setPathData(links, false, detailGridId);
				}			
			} else {
				addPathSet(detailGridId);
			}
			
			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			startEditingMode();
		}
		else {
			if(response.data != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					$('#'+detailGridId).alopexGrid('dataSet', links);
					$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
				}			
			} else {
				$("#rontAllView").setChecked(false);
			}	
		}
		
//		ntwkLnoGrpSrno = (links == null)? "1" : links.PATH_SAME_NO;
		ntwkLnoGrpSrno = (links == null)? "1" : response.data.PATH_SAME_NO;
		
		// 엑셀 다운로드를 위한 기본정보 저장
		$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
		$('#'+detailGridId).alopexGrid("viewUpdate");
		$('#'+baseGridId).alopexGrid("viewUpdate");
	
	}else if(flag == "networkReservePathSearch"){ 				//예비선번조회
		var links;
		
		if(gridId == "dataGridWork"){
			if(response.data != undefined && response.data.LINKS != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					setPathData(links, false, reserveGridId);
				}			
			} else {
				addPathSet(reserveGridId);
			}
			
			$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			startEditingMode();
		}
		else {
			if(response.data != undefined) {
				links = response.data.LINKS;
				if(links != null && links.length > 0){
					$('#'+reserveGridId).alopexGrid('dataSet', links);
					$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
				}			
			}
		}
		
		reservePathSameNo = (links == null)? "2" : response.data.PATH_SAME_NO;
				
		$('#'+reserveGridId).alopexGrid("viewUpdate");
	}	
	else if(flag == "saveNetworkPath"){
		if(response.PATH_RESULT) {
			saveReservePath();
		}else{
			cflineHideProgressBody();
			alertBox('W', response.PATH_ERROR_MSG);
			startEditingMode();
		}
	}
	else if(flag == "saveReserveNetworkPath") {
		if(response.PATH_RESULT) {
			
			/* 20171222 네트워크정보 TSDN 전송건 시작 */			
				sendToTsdnNetworkInfo(ntwkLineNo, "T", "E");
			/* 20171222 네트워크정보 TSDN 전송건 끝 */
			
			var params = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "01", "autoClctYn": "N"};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchSaveAfter');
			var paramsTwo = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "02", "autoClctYn": "N"};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', paramsTwo, 'GET', 'networkPathSearchSaveAfterTwo');
		} else {
			cflineHideProgressBody();
			alertBox('W', response.PATH_ERROR_MSG);
			startEditingMode();
		}
	}
	else if(flag == "rontEqpSctn"){
		/**
		 * FDF 장비구간데이터
		 * 1. 선택한 포트가 1건이고 조회된 구간이 1건일 경우 -> FDF set
		 * 2. 선택한 포트가 1건이고 조회된 구간이 2건일 경우 - 장비가 동일하면 FDF, Rx set
		 * 3. 선택한 포트가 2건이고 각각의 조회된 구간이 1건일 경우 -> FDF, Rx set
		 * 4. 그 외의 케이스는 자동입력 안함
		 */
		if(response != null && response.RIGHT_NE_ID != undefined){
			var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}});
			var rowIndex = focusData[0]._index.row;
			
			$.each(response, function(key,val){
		 		$('#'+detailGridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, key);         		
		 	});
			
//			$('#'+detailGridId).alopexGrid('dataEdit', response, {_index : {data : rowIndex}});
		}
		cflineHideProgressBody();	
	}
	else if(flag == "networkPathSearchSaveAfter") {
		var links;
		if(response.data != undefined && response.data.LINKS != undefined) {
			links = response.data.LINKS;
			if(links != null && links.length > 0){
				setPathData(links, false, detailGridId);
			}			
		} else {
			addPathSet(detailGridId);
		}
		
		startEditingMode();
		
//		ntwkLnoGrpSrno = (links == null)? "1" : links.PATH_SAME_NO;
		ntwkLnoGrpSrno = (links == null)? "1" : response.data.PATH_SAME_NO;
		
		$('#'+detailGridId).alopexGrid("viewUpdate");
//		$('#'+baseGridId).alopexGrid("viewUpdate");
		
	}
	else if(flag == "networkPathSearchSaveAfterTwo") {
		var links;
		if(response.data != undefined && response.data.LINKS != undefined) {
			links = response.data.LINKS;
			if(links != null && links.length > 0){
				setPathData(links, false, reserveGridId);
			}			
		} else {
			addPathSet(reserveGridId);
		}
		
		startEditingMode();
		
//		reservePathSameNo = (links == null)? "2" : links.PATH_SAME_NO;
		reservePathSameNo = (links == null)? "2" : response.data.PATH_SAME_NO;
		
		$('#'+reserveGridId).alopexGrid("viewUpdate");
//		$('#'+baseGridId).alopexGrid("viewUpdate");
		
		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/		
	}
	// 2019-12-24  1. [수정] 기간망 고도화 주선번
	else if(flag == 'rontLnoSearch'){ 				//주선번조회
		cflineHideProgressBody();
		var links = (response != null && response.lnoInfList != null) ? response.lnoInfList : null; 
		
		if(gridId == "dataGridWork"){
			if(links != null && links.length > 0) {
				setPathData(links, false, detailGridId);
			} else {
				addPathSet(detailGridId);
			}
			
			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			startEditingMode();
		}
		else {
			if(links != null && links.length > 0) {
				$('#'+detailGridId).alopexGrid('dataSet', links);
				$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			} else {
				$("#rontAllView").setChecked(false);
			}	
		}
		
		ntwkLnoGrpSrno = (links == null)? "1" : response.ntwkLnoGroSrno ;
		
		// 엑셀 다운로드를 위한 기본정보 저장
		$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
		$('#'+detailGridId).alopexGrid("viewUpdate");
		$('#'+baseGridId).alopexGrid("viewUpdate");

		var networkReservePathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "02", "autoClctYn": "N"};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontlnoinf', networkReservePathParam, 'GET', 'rontLnoReserveSearch');
	
	} else if(flag == 'rontHolaLnoSearch'){ 	// HOLA주 선번 조회
		cflineHideProgressBody();
		var links = (response != null && response.lnoInfList != null) ? response.lnoInfList : null; 

		if(links != null && links.length > 0) {
			$('#'+detailGridId).alopexGrid('dataSet', links);
			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
		} else {
			$("#rontAllView").setChecked(false);
		}	
		
		// 엑셀 다운로드를 위한 기본정보 저장
		$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
		$('#'+detailGridId).alopexGrid("viewUpdate");
		$('#'+baseGridId).alopexGrid("viewUpdate");

	} 
	// 2019-12-24  1. [수정] 기간망 고도화 예비선번
	else if(flag == "rontLnoReserveSearch"){ 				//예비선번조회
		var links = (response != null && response.lnoInfList != null) ? response.lnoInfList : null; 
		
		if(gridId == "dataGridWork"){
			if(links != null && links.length > 0) {
				setPathData(links, false, reserveGridId);
			} else {
				addPathSet(reserveGridId);
			}
			
			$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			startEditingMode();
		}
		else {				
			if(links != null && links.length > 0){
				$('#'+reserveGridId).alopexGrid('dataSet', links);
				$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			}	
		}
		
		reservePathSameNo = (links == null)? "2" : response.ntwkLnoGroSrno;
		
		/* 
		 * 선번그룹일련번호와 관련 최초조회시 
		 *    주선번 데이터가 없는경우 무조건 1
		 *    예비선번 데이터가 없는경우 무조건 2로 셋팅한다.
		 *    만약 주선번과 예비선번 그룹 번호가 같은 경우 주선번+1.
		 */
		if (ntwkLnoGrpSrno == reservePathSameNo) {
			reservePathSameNo = parseInt(ntwkLnoGrpSrno)+1;
			reservePathSameNo = reservePathSameNo + "";
		}
		
		$('#'+reserveGridId).alopexGrid("viewUpdate");
	}
	// 기간망 텍스트 선번 주선번 저장
	else if(flag == "saveRontLno") {
		if(response.resultCd != undefined && response.resultCd == "OK") {
			var reservelinks = $('#'+reserveGridId).alopexGrid('dataGet');
			var reserveData = AlopexGrid.trimData(reservelinks);
			
			for(var i = 0; i < reserveData.length; i++) {
				for(var key in reserveData[i]) {
					var temp = String(eval("reserveData[i]."+key)).indexOf('alopex'); 
					if(temp == 0) {
						eval("reserveData[i]."+key + " = ''");
					}
				}
				//data[i].LINK_SEQ = (i+1);
			}
						
			var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
			var params = {
					  "ntwkLineNo" : ntwkLineNo
					, "ntwkLnoGrpSrno" : reservePathSameNo
					, "wkSprDivCd" : "02"
					, "autoClctYn" : "N"
					, "topoLclCd" : topoLclCd
					, "topoSclCd" : topoSclCd
					, "linePathYn" : "N"	// 회선선번여부
					, "userId" : userId
					, "rontTrunkList" : reserveData
			};
			
			cflineShowProgressBody();
			//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPath');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/saverontlnoinf', params, 'POST', 'saveReserveRontLno');
		} else {
			cflineHideProgressBody();
			alertBox('W', response.resultMsg);
			startEditingMode();
		}
	}
	// 기간망 텍스트 선번 예비선번 저장	
	else if(flag == "saveReserveRontLno") {
		if(response.resultCd != undefined && response.resultCd == "OK") {
			
			/* 20171222 네트워크정보 TSDN 전송건 시작 */			
			sendToTsdnNetworkInfo(ntwkLineNo, "T", "E");
			/* 20171222 네트워크정보 TSDN 전송건 끝 */
			
			var networkPathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "01", "autoClctYn": "N"};			
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontlnoinf', networkPathParam, 'GET', 'rontLnoSearchSaveAfter');
			
		} else {
			cflineHideProgressBody();
			alertBox('W', response.resultMsg);
			startEditingMode();
		}
	}
	// 저장후 주선번 조회
	else if(flag == "rontLnoSearchSaveAfter") {
		var links = (response != null && response.lnoInfList != null) ? response.lnoInfList : null; 
		
		if(links != null && links.length > 0) {
			setPathData(links, false, detailGridId);
		} else {
			addPathSet(detailGridId);
		}
		
		startEditingMode();
		
		ntwkLnoGrpSrno = (links == null)? "1" : response.ntwkLnoGroSrno;;
		
		$('#'+detailGridId).alopexGrid("viewUpdate");	

		cflineHideProgressBody();
		alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/	
		
		var networkReservePathParam = {"ntwkLineNo" : ntwkLineNo, "wkSprDivCd" : "02", "autoClctYn": "N"};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectrontlnoinf', networkReservePathParam, 'GET', 'rontLnoReserveSearchSaveAfter');
	}
	// 저장후 예비선번 조회
	else if(flag == "rontLnoReserveSearchSaveAfter") {
		
		var links = (response != null && response.lnoInfList != null) ? response.lnoInfList : null; 
		
		if(links != null && links.length > 0) {
			setPathData(links, false, reserveGridId);
		} else {
			addPathSet(reserveGridId);
		}
		
		startEditingMode();
		
		reservePathSameNo = (links == null)? "2" : response.ntwkLnoGroSrno;
		
		/* 
		 * 선번그룹일련번호와 관련 최초조회시 
		 *    주선번 데이터가 없는경우 무조건 1
		 *    예비선번 데이터가 없는경우 무조건 2로 셋팅한다.
		 *    만약 주선번과 예비선번 그룹 번호가 같은 경우 주선번+1.
		 */
		if (ntwkLnoGrpSrno == reservePathSameNo) {
			reservePathSameNo = parseInt(ntwkLnoGrpSrno)+1;
			reservePathSameNo = reservePathSameNo + "";
		}
		
		$('#'+reserveGridId).alopexGrid("viewUpdate");
	}
}

function failCallback(status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == 'networkPathSearch'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
	if (flag == "saveRontLno" || flag == "saveReserveRontLno") {
		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
	}
	if(flag == 'rontLnoSearch' || flag == 'rontLnoReserveSearch' 
		|| flag == 'rontLnoSearchSaveAfter' || flag == 'rontLnoReserveSearchSaveAfter'){
		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
}

function setPathData(links, isAutoClct, gridId){
	links = AlopexGrid.trimData(links);
	var isPath = false;
	var addDataList = [];
	var codeList = (baseInfData.rontTrkTypCd == "023")? rontSctnLinkClCdArr : rontSctnClCdArr;
		
	for(var i=0, y=0; links.length > i;){
		var addData = {"SET_ID" : "alopex" + setIdNumber };
		var linkCode = links[i].rontSctnClCd;//links[i].RONT_SCTN_CL_CD;
		var code = codeList[y].rontSctnClCd;// codeList[y].RONT_SCTN_CL_CD;
		
		if(linkCode == code){
			addData = $.extend(addData, links[i]);
			isPath = (code == "013")? true : false;
			i++;
			y++;
		}
		else if(isPath && linkCode == "013"){
			addData = $.extend(addData, links[i]);
			i++;
		}
		else {
			addData = $.extend(addData, codeList[y]);
			y++;
		}
		
		addData.SET_ID = "alopex" + setIdNumber;
		addDataList.push(addData);
		
		if(i == links.length && y != codeList.length ){
			for(y; codeList.length > y; y++){
				var data = {"SET_ID" : "alopex" + setIdNumber };
				data = $.extend(data, codeList[y]);
				addDataList.push(data);
			}
			setIdNumber++;
		}
		else if(y == codeList.length ){
			y = 0;
			setIdNumber++;
		}
	}
	
	// 수집선번 데이터 셋
	if(isAutoClct){
		var isNullData = true;
		var data = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet"));
		for(var row in data){
			if(data[row].LEFT_NE_ID != null || data[row].RIGHT_NE_ID != null){
				isNullData = false;
				break;
			}
		}
		
		if(isNullData){
			$('#'+gridId).alopexGrid('dataSet', addDataList);
		} else {
			$('#'+gridId).alopexGrid('dataAdd', addDataList);
		}
		
		if($('#rontAllView').is(':checked')) {
			$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			$('#'+reserveGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
		}
		
	} else {
		$('#'+gridId).alopexGrid('dataSet', addDataList);
	}
	
}

/**
 * 선번set 추가
 */
function addPathSet(gridId){
	cflineShowProgressBody();
//	
	var addData = [];
	var setId = "alopex" + setIdNumber;
	var codeList = (baseInfData.rontTrkTypCd == "023")? rontSctnLinkClCdArr : rontSctnClCdArr;
	
	for(var i = 0; i < codeList.length; i++) {
		//addData.push({'SET_ID' : setId, 'RONT_SCTN_CL_CD':codeList[i].RONT_SCTN_CL_CD,'RONT_SCTN_CL_NM' : codeList[i].RONT_SCTN_CL_NM, _state:{editing:true}});
		addData.push({'SET_ID' : setId, 'rontSctnClCd':codeList[i].rontSctnClCd,'rontSctnClNm' : codeList[i].rontSctnClNm, _state:{editing:true}});
	}
	
	$('#'+gridId).alopexGrid('dataAdd', addData);
	setIdNumber++;
	cflineHideProgressBody();
}
/**
 * 선번 저장
 */
function savePath() {
	$("#"+detailGridId).alopexGrid("endEdit");
	var links = $('#'+detailGridId).alopexGrid('dataGet');
	$("#"+detailGridId).alopexGrid("startEdit");
	var data = AlopexGrid.trimData(links);
	
	$("#"+reserveGridId).alopexGrid("endEdit");
	var reservelinks = $('#'+reserveGridId).alopexGrid('dataGet');
	$("#"+reserveGridId).alopexGrid("startEdit");
	var reserveData = AlopexGrid.trimData(reservelinks);
	
	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	
	var mainCheck = rontLnoVaildation(data, reserveData);// fnVaildation(data, "main");
	//var reserveChek =  fnVaildation(reserveData, "reserve");
	
	// 데이터 검증은 주예비 동시에 검증하고 저장은 주선번을 저장한뒤 예비선번을 저장한다
	if( mainCheck /*&& reserveChek*/ ){
		
		callMsgBox('','C', cflineMsgArray['saveData'], function(msgId, msgRst) {
			if (msgRst == 'Y') {
				for(var i = 0; i < data.length; i++) {
					for(var key in data[i]) {
						var temp = String(eval("data[i]."+key)).indexOf('alopex'); 
						if(temp == 0) {
							eval("data[i]."+key + " = ''");
						}
					}
					//data[i].LINK_SEQ = (i+1);
				}
				 
				var params = {
						  "ntwkLineNo" : ntwkLineNo
						, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno
						, "wkSprDivCd" : "01"
						, "autoClctYn" : "N"
						, "topoLclCd" : topoLclCd
						, "topoSclCd" : topoSclCd
						, "linePathYn" : "N"	// 회선선번여부
						, "userId" : userId
						//, "links" : JSON.stringify(data)
						, rontTrunkList : data
				};
				
				cflineShowProgressBody();
				//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveNetworkPath');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/saverontlnoinf', params, 'POST', 'saveRontLno');
			}
		});
	}
}

function saveReservePath() {
	$("#"+reserveGridId).alopexGrid("endEdit");
	var reserveLinks = $('#'+reserveGridId).alopexGrid('dataGet');
	$("#"+reserveGridId).alopexGrid("startEdit");
	var reserveData = AlopexGrid.trimData(reserveLinks);
	
	var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
	
	var params = {
			  "ntwkLineNo" : ntwkLineNo
			, "ntwkLnoGrpSrno" : reservePathSameNo
			, "wkSprDivCd" : "02"
			, "autoClctYn" : "N"
			, "topoLclCd" : topoLclCd
			, "topoSclCd" : topoSclCd
			, "linePathYn" : "N"	// 회선선번여부
			, "userId" : userId
			, "links" : JSON.stringify(reserveData)
	};
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', params, 'POST', 'saveReserveNetworkPath');
}

function addLinkPath(data, $cell, grid){
	cflineShowProgressBody();
	var row = data._index.row + 1;
	//var addRow = {"SET_ID":data.SET_ID, "RONT_SCTN_CL_CD":"013", "RONT_SCTN_CL_NM":"중계"};
	var addRow = {"SET_ID":data.SET_ID, "rontSctnClCd":"013", "rontSctnClNm":"중계"};
	
	$("#"+currentGridId).alopexGrid("dataAdd", $.extend({}, addRow), {_index : { row:row} });
	$("#"+currentGridId).alopexGrid("startEdit");
	
	cflineHideProgressBody();
}

function deletePathSet(data, $cell, grid, gridId){
	cflineShowProgressBody();
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	var deleteDataList = $('#'+gridId).alopexGrid("dataGet", {"SET_ID" : data.SET_ID} );
	
	$('#'+gridId).alopexGrid("dataDelete", {"SET_ID" : data.SET_ID});
	
	if(dataList.length == deleteDataList.length){
		addPathSet(gridId);
	}
	
	cflineHideProgressBody();
}

/**
 * 선번 삭제
 */
function deletePath() {
	$("#"+currentGridId).alopexGrid("endEdit");
	var dataList = $('#'+currentGridId).alopexGrid("dataGet", {"IS_SELECT" : "true"} );
	var selectCnt = dataList.length;
	var addYn = false;
	if(selectCnt == 0){
		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
		$("#"+currentGridId).alopexGrid("startEdit");
	} else {
		cflineShowProgressBody();
		dataDeleteCount = 0;
		for(var i = 0; i < dataList.length; i++ ) {
			var data = dataList[i];
			var rowIndex = data._index.row;
			
			// 동일 기간망트렁크 LINK구간 삭제
    		var deleteDataSet = $('#'+currentGridId).alopexGrid("dataGet", {"SET_ID":data.SET_ID, "RONT_SCTN_CL_CD":"013"}, "SET_ID");
    		if(deleteDataSet.length == "1"){
    			var addRow = {"SET_ID":data.SET_ID, "RONT_SCTN_CL_CD":"013", "RONT_SCTN_CL_NM":"중계"};
    			$('#'+currentGridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    			$("#"+currentGridId).alopexGrid("dataAdd", $.extend({}, addRow), {_index : { data:rowIndex} });
    		} else {
    			$('#'+currentGridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    		}
			
			dataDeleteCount++;
		}

		$("#"+currentGridId).alopexGrid("startEdit");
		cflineHideProgressBody();
	}
}

/**
 * 선번체크
 * fnVaildation
 * @param dataList
 * @returns {Boolean}
 */
function fnVaildation(dataList, guBun){
	
	// 구간의 좌장비 우장비 둘다 존재 하지 않는 구간은 존재 하지 않는다
	// 주선번의 구간이 하나도 존재 하지않으면 저장을 할수 없다.
	var pathCnt = 0;
	if(guBun == "main"){
		for(var i = 0; i < dataList.length; i++){
			if(dataList[i].RIGHT_NE_ID != null || dataList[i].LEFT_NE_ID != null){
				pathCnt++
			}
		}
	}else{
		pathCnt = dataList.length
	}
	
	if(pathCnt < 1 && dataDeleteCount < 1){
		alertBox('W', cflineMsgArray['noReqData']); /* 요청할 데이터가 없습니다. */
		return false;
	}
	
	// alopex index id 삭제
	for(key in dataList[i]) {
		var temp = String(eval("dataList[i]."+key)).indexOf('alopex'); 
		if(temp == 0) {
			eval("data[i]."+key + " = ''");
		}
	}
	
	var msgArg = "";	
	for(var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		
		var wdmTrunkId = nullToEmpty(data.WDM_TRUNK_ID);
		if(wdmTrunkId.indexOf("alopex") === 0){
			data.WDM_TRUNK_ID = "";
		}
		if(nullToEmpty(data.WDM_TRUNK_NM) != "" && nullToEmpty(data.WDM_TRUNK_ID) == "") {
			msgArg = cflineMsgArray['trunk']; /* 트렁크 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
		} else if(nullToEmpty(data.RONT_SCTN_CL_NM) == ""){
			alertBox('W', makeArgMsg("requiredMessage", cflineMsgArray['division'])); /* 필수 입력 항목입니다.<br>{0} */
			return false;
		} else if(nullToEmpty(data.LEFT_NE_NM) != "" && nullToEmpty(data.LEFT_NE_ID) == "") {
			msgArg = cflineMsgArray['node']; /* 노드 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
		} else if(nullToEmpty(data.LEFT_PORT_DESCR) != "" && nullToEmpty(data.LEFT_PORT_ID) == "") {
			msgArg = cflineMsgArray['port']; /* 포트 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
//		} else if(nullToEmpty(data.LEFT_NE_ID) != "" && data.LEFT_NE_ID !="DV00000000000" && nullToEmpty(data.LEFT_PORT_ID) == "" ){
//			alertBox('W', makeArgMsg("requiredMessage", "'" + data.LEFT_NE_NM + "'의 " + cflineMsgArray['port'])); /* 필수 입력 항목입니다.<br>{0} */
//			return false;
		} else if(nullToEmpty(data.RIGHT_NE_NM) != "" && nullToEmpty(data.RIGHT_NE_ID) == "") {
			msgArg = cflineMsgArray['fiberDistributionFrame']; /* FDF */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
		} else if(nullToEmpty(data.RIGHT_PORT_DESCR) != "" && nullToEmpty(data.RIGHT_PORT_ID) == "") {
			msgArg = cflineMsgArray['fiberDistributionFramePort']; /* FDF포트 */
			alertBox('W', makeArgMsg('validationId',msgArg,"","","")); /* {1} 검색을 통해 조회한 후 {0} 등록을 하시기 바랍니다. */
			return false;
//		} else if(nullToEmpty(data.RIGHT_NE_ID) != "" && data.RIGHT_NE_ID !="DV00000000000" && nullToEmpty(data.RIGHT_PORT_ID) == ""){
//			alertBox('W', makeArgMsg("requiredMessage", "'" + data.RIGHT_NE_NM + "'의 " + cflineMsgArray['fiberDistributionFramePort'])); /* 필수 입력 항목입니다.<br>{0} */
//			return false;
		}
	}
	return true;
}


/**
 * 기간망 텍스트 선번체크
 * rontLnoVaildation
 * @param dataList, reserveData
 * @returns {Boolean}
 */
function rontLnoVaildation(dataList, reserveData){
	
	// 구간의 좌장비 우장비 둘다 존재 하지 않는 구간은 존재 하지 않는다
	// 주선번의 구간이 하나도 존재 하지않으면 저장을 할수 없다.
	/*var pathCnt = 0;
	if(guBun == "main"){
		for(var i = 0; i < dataList.length; i++){
			if(clearOfAllSpace( dataList[i].lftEqpNm) != "" || clearOfAllSpace( dataList[i].rghtEqpPortRefcVal) != ""){
				pathCnt++
			}
		}
	}else{
		pathCnt = dataList.length
	}
	
	if(pathCnt < 1 && dataDeleteCount < 1){
		alertBox('W', cflineMsgArray['noReqData']);  요청할 데이터가 없습니다. 
		return false;
	}*/
	
	// alopex index id 삭제
	for(key in dataList[i]) {
		var temp = String(eval("dataList[i]."+key)).indexOf('alopex'); 
		if(temp == 0) {
			eval("data[i]."+key + " = ''");
		}
	}
	
	var msgArg = "";	
	var chkItem = [
	                 {itemNm : cflineMsgArray['system'], itemCd : "lftEqpRoleDivNm", limitSize : "33"} // 시스템
	               , {itemNm : cflineMsgArray['managementTeam'], itemCd : "lftJrdtTeamOrgNm", limitSize : "66"}   // 관리팀
	               , {itemNm : cflineMsgArray['vend'], itemCd : "lftVendorNm", limitSize : "33"}   // 제조사
	               , {itemNm : cflineMsgArray['mtso'], itemCd : "lftEqpInstlMtsoNm", limitSize : "100"}    // 국사
	               , {itemNm : cflineMsgArray['nodeName'], itemCd : "lftEqpNm", limitSize : "66"}   // 노드명
	               , {itemNm : 'Unit', itemCd : "lftCardMdlNm", limitSize : "66"}   // Unit
	               , {itemNm : 'Shelf', itemCd : "lftShlfNm", limitSize : "100"}   // Shelf
	               , {itemNm : 'Slot', itemCd : "lftSlotNo", limitSize : "66"}   // Slot
	               , {itemNm : 'Port', itemCd : "lftPortNm", limitSize : "66"}   // Port
	               , {itemNm : "FDF", itemCd : "rghtEqpPortRefcVal", limitSize : "166"}   // FDF
	               ];
	var chkItemSize = true;
	
	// 주선번 체크
	var mainPathCnt = 0;
	for(var i = 0; i < dataList.length; i++) {
		
		if(nullToEmpty(dataList[i].rontSctnClCd) == ""){
			alertBox('W', makeArgMsg("requiredMessage", cflineMsgArray['division'])); /* 필수 입력 항목입니다.<br>{0} */
			return false;
		} 
		// 어떤항목이든 값이 있는경우
		else if (clearOfAllSpace( dataList[i].lftEqpRoleDivNm) != "" 
		        || clearOfAllSpace( dataList[i].lftJrdtTeamOrgNm) != ""  
				|| clearOfAllSpace( dataList[i].lftVendorNm) != ""  
				|| clearOfAllSpace( dataList[i].lftEqpInstlMtsoNm) != ""  
				|| clearOfAllSpace( dataList[i].lftEqpNm) != "" 
			    || clearOfAllSpace( dataList[i].lftCardMdlNm) != ""  
				|| clearOfAllSpace( dataList[i].lftShlfNm) != ""  
				|| clearOfAllSpace( dataList[i].lftSlotNo) != ""  
			    || clearOfAllSpace( dataList[i].lftPortNm) != ""  
			    || clearOfAllSpace( dataList[i].rghtEqpPortRefcVal) != "" ) 
	      {
			mainPathCnt++;
			for (var j = 0 ;  j < chkItem.length; j++) {
				if (getLengthB( eval("dataList[i]."+ chkItem[j].itemCd)) > parseInt(chkItem[j].limitSize)) {
					alertBox('W', makeArgMsg('maxLengthPossible', chkItem[j].itemNm + "(" + dataList[i].rontSctnClNm + ")", chkItem[j].limitSize,"","")); /* {0} 항목은 {1}자까지 입력가능합니다. */
					chkItemSize = false;
					break;
				}
			}
			if (chkItemSize == false) {
				break;
			}
		}
	}
	
	if (chkItemSize == false) {
		return chkItemSize;
	}
	
	// 예비선번 체크
	var reservePathCnt = 0;
	for(var i = 0; i < reserveData.length; i++) {
		
		if(nullToEmpty(reserveData[i].rontSctnClCd) == ""){
			alertBox('W', makeArgMsg("requiredMessage", cflineMsgArray['division'])); /* 필수 입력 항목입니다.<br>{0} */
			return false;
		} 
		// 어떤항목이든 값이 있는경우
		else if (clearOfAllSpace( reserveData[i].lftEqpRoleDivNm) != "" 
	        || clearOfAllSpace( reserveData[i].lftJrdtTeamOrgNm) != ""  
			|| clearOfAllSpace( reserveData[i].lftVendorNm) != ""  
			|| clearOfAllSpace( reserveData[i].lftEqpInstlMtsoNm) != ""  
			|| clearOfAllSpace( reserveData[i].lftEqpNm) != "" 
		    || clearOfAllSpace( reserveData[i].lftCardMdlNm) != ""  
			|| clearOfAllSpace( reserveData[i].lftShlfNm) != ""  
			|| clearOfAllSpace( reserveData[i].lftSlotNo) != ""  
		    || clearOfAllSpace( reserveData[i].lftPortNm) != ""  
		    || clearOfAllSpace( reserveData[i].rghtEqpPortRefcVal) != "" ) 
      {
			reservePathCnt++;
			for (var j = 0 ;  j < chkItem.length; j++) {
				if (getLengthB( eval("reserveData[i]."+ chkItem[j].itemCd)) > parseInt(chkItem[j].limitSize)) {
					alertBox('W', makeArgMsg('maxLengthPossible', chkItem[j].itemNm + "(" + reserveData[i].rontSctnClNm + ")", chkItem[j].limitSize,"","")); /* {0} 항목은 {1}자까지 입력가능합니다. */
					chkItemSize = false;
					break;
				}
			}
			if (chkItemSize == false) {
				break;
			}
		}
	}
	
	if (chkItemSize == false) {
		return chkItemSize;;
	}
	
	if (mainPathCnt == 0 && reservePathCnt > 0) {
		alertBox('W', cflineMsgArray['spareLineNoChange'] );   /* 주선번이 존재하지 않으면 예비선번을 저장할 수 없습니다. */
		return false;
	}
	return chkItemSize;
}

function setButtonDisplay(param){
	var displayDiv = nullToEmpty(param) ==""? gridId : param;
	
	if(displayDiv == "dataGrid"){
		$("#infoBtn").show();
		$("#workBtn").hide();
	} else if (displayDiv == "dataGridHola"){

		$("#btnAutoClctPath").hide();
		$("#btnReservePathChange").hide();
		$("#btnPathSetAdd").hide();
		$("#btnPathDelete").hide();
		$("#btnSave").hide();
		$("#btnRegEqp").hide();
		
	}
	else {
		$("#infoBtn").hide();
		$("#workBtn").show();
	}
}

/**
 * Function Name : startEditingMode
 * Description   : 선번 편집 모드 변경  
 * 
 */
function startEditingMode() {
	tmofInfoPop({ntwkLineNo : ntwkLineNo, sFlag : "Y"}, "Y");
	var columnEdit = columnMappingNetworkPath("dataGridWork");
	
	$('#'+detailGridId).alopexGrid("updateOption", {
		  rowSingleSelect : false
		, cellInlineEdit : true
		, rowInlineEdit: true
		, cellSelectable : false
		, enableDefaultContextMenu:false
		, enableContextMenu:true
		, rowClickSelect : false
		, defaultSorting : null
		, contextMenu : [
						{
							title: cflineMsgArray['lnoSet']+cflineMsgArray['delete'],		/* 선번Set 삭제 */
						    processor: function(data, $cell, grid) {
						    	deletePathSet(data, $cell, grid, detailGridId);
						    },
						    use: function(data, $cell, grid) {
						    	return true;
						    }
						}						
						,{
							title: '중계구간 추가',
						    processor: function(data, $cell, grid) {
						    	addLinkPath(data, $cell, grid);
						    },
						    use: function(data, $cell, grid) {
						    	//if(data['RONT_SCTN_CL_CD'] == "013" && data['WDM_TRUNK_ID'] == null){
						    	if(data['rontSctnClCd'] == "013" ){
						    		return true;
						    	} else {
						    		return false;
						    	}
						    }
					   }
					   ,{
							title: cflineMsgArray['save'],				/* 저장 */
						    processor: function(data, $cell, grid) {
						    	savePath();
						    },
						    use: function(data, $cell, grid) {
						    	return true;
						    }
					   }
		]
		, columnMapping : columnEdit
	});
	
	$('#'+reserveGridId).alopexGrid("updateOption", {
		  rowSingleSelect : false
		, cellInlineEdit : true
		, rowInlineEdit: true
		, cellSelectable : false
		, enableDefaultContextMenu:false
		, enableContextMenu:true
		, rowClickSelect : false
		, defaultSorting : null
		, contextMenu : [
						{
							title: cflineMsgArray['lnoSet']+cflineMsgArray['delete'],		/* 선번Set 삭제 */
						    processor: function(data, $cell, grid) {
						    	deletePathSet(data, $cell, grid, reserveGridId);
						    },
						    use: function(data, $cell, grid) {
						    	return true;
						    }
						}					
						,{
							title: '중계구간 추가',
						    processor: function(data, $cell, grid) {
						    	addLinkPath(data, $cell, grid);
						    },
						    use: function(data, $cell, grid) {
						    	//if(data['RONT_SCTN_CL_CD'] == "013" && data['WDM_TRUNK_ID'] == null){
						    	if(data['rontSctnClCd'] == "013"){
						    		return true;
						    	} else {
						    		return false;
						    	}
						    }
					   }
					   ,{
							title: cflineMsgArray['save'],				/* 저장 */
						    processor: function(data, $cell, grid) {
						    	savePath();
						    },
						    use: function(data, $cell, grid) {
						    	return true;
						    }
					   }
		]
		, columnMapping : columnEdit
	});
	
	//컬럼 업데이트 모드
	$("#"+detailGridId).alopexGrid("startEdit");
	$('#'+detailGridId).alopexGrid("viewUpdate");
	$("#"+reserveGridId).alopexGrid("startEdit");
	$('#'+reserveGridId).alopexGrid("viewUpdate");
	//setEqpEventListener();
}

function setEqpEventListener() {
 	// 주선번 데이터 변경
	$('#'+detailGridId).on('propertychange input', function(e){
		var dataObj = AlopexGrid.parseEvent(e).data;
		var rowIndex = dataObj._index.row;
		
		// 좌장비 변경
		if(dataObj._key == "LEFT_NE_NM" && nullToEmpty(dataObj.LEFT_NE_ID) != ""){
			var dataList = AlopexGrid.trimData(dataObj);
			for(var key in dataList) {
				if(key.indexOf("LEFT") == 0) {
					if(key != dataObj._key) {
						$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
					}
				}
			}
			
			setLinkDataNull(rowIndex);
		}
		// 우장비 변경
		else if(dataObj._key == "RIGHT_NE_NM" && nullToEmpty(dataObj.RIGHT_NE_ID) != ""){
			var dataList = AlopexGrid.trimData(dataObj);
			for(var key in dataList) {
				if(key.indexOf("RIGHT") == 0) {
					if(key != dataObj._key) {
						$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
					}
				}
			}
			setLinkDataNull(rowIndex);
		}
		// 좌포트 변경
		else if(dataObj._key == "LEFT_PORT_DESCR" && nullToEmpty(dataObj.LEFT_PORT_ID) != ""){
			var flag = "LEFT_"
			// 포트 column set
			var columnList = [  
			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO"
			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
			                    , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
			                    , "RX_PORT_ID", "RX_PORT_NM", "RX_PORT_STATUS_CD", "RX_PORT_STATUS_NM", "RX_PORT_DUMMY"
			                  ];
			
			$.each(columnList, function(key,val){
				if(dataObj._key != (flag+val)){
					$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
				}
	     	});
			setLinkDataNull(rowIndex);
		}
		// 우포트 변경
		else if(dataObj._key == "RIGHT_PORT_DESCR" && nullToEmpty(dataObj.RIGHT_PORT_ID) != ""){
			var flag = "RIGHT_"
			// 포트 column set
			var columnList = [  
			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO"
			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
			                    , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
			                    , "RX_PORT_ID", "RX_PORT_NM", "RX_PORT_STATUS_CD", "RX_PORT_STATUS_NM", "RX_PORT_DUMMY"
			                  ];
			
			$.each(columnList, function(key,val){
				if(dataObj._key != (flag+val)){
					$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
				}
	     	});
			setLinkDataNull(rowIndex);
		}	
	});
	
	$('#'+detailGridId).on('keyup', function(e){
		if(e.keyCode == 13) {
			var dataObj = AlopexGrid.parseEvent(e).data;
			var rowIndex = dataObj._index.row;
			var schVal = dataObj._state.editing[dataObj._column];
			
			if(dataObj._key == "LEFT_NE_NM") {
				// 좌장비
				openEqpListPop("LEFT");
			} else if(dataObj._key == "RIGHT_NE_NM") {
				// 우장비
				openEqpListPop("RIGHT");
			} else if(dataObj._key == "LEFT_PORT_DESCR") {
				// 좌포트
				openPortListPop("LEFT");
			} else if(dataObj._key == "RIGHT_PORT_DESCR") {
				// 우포트
				openPortListPop("RIGHT");
			} 
			else if(dataObj._key == "RIGHT_EQP_PORT_REFC_VAL") {
				// 우포트
				openPortListPop("FDF");
			}
			return false;
		}
    });
	
	// 예비선번 데이터 변경
	$('#'+reserveGridId).on('propertychange input', function(e){
		var dataObj = AlopexGrid.parseEvent(e).data;
		var rowIndex = dataObj._index.row;
		
		// 좌장비 변경
		if(dataObj._key == "LEFT_NE_NM" && nullToEmpty(dataObj.LEFT_NE_ID) != ""){
			var dataList = AlopexGrid.trimData(dataObj);
			for(var key in dataList) {
				if(key.indexOf("LEFT") == 0) {
					if(key != dataObj._key) {
						$('#'+reserveGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
					}
				}
			}
			
			setLinkDataNull(rowIndex);
		}
		// 우장비 변경
		else if(dataObj._key == "RIGHT_NE_NM" && nullToEmpty(dataObj.RIGHT_NE_ID) != ""){
			var dataList = AlopexGrid.trimData(dataObj);
			for(var key in dataList) {
				if(key.indexOf("RIGHT") == 0) {
					if(key != dataObj._key) {
						$('#'+reserveGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
					}
				}
			}
			setLinkDataNull(rowIndex);
		}
		// 좌포트 변경
		else if(dataObj._key == "LEFT_PORT_DESCR" && nullToEmpty(dataObj.LEFT_PORT_ID) != ""){
			var flag = "LEFT_"
			// 포트 column set
			var columnList = [  
			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO"
			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
			                    , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
			                    , "RX_PORT_ID", "RX_PORT_NM", "RX_PORT_STATUS_CD", "RX_PORT_STATUS_NM", "RX_PORT_DUMMY"
			                  ];
			
			$.each(columnList, function(key,val){
				if(dataObj._key != (flag+val)){
					$('#'+reserveGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
				}
	     	});
			setLinkDataNull(rowIndex);
		}
		// 우포트 변경
		else if(dataObj._key == "RIGHT_PORT_DESCR" && nullToEmpty(dataObj.RIGHT_PORT_ID) != ""){
			var flag = "RIGHT_"
			// 포트 column set
			var columnList = [  
			                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO"
			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
			                    , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
			                    , "RX_PORT_ID", "RX_PORT_NM", "RX_PORT_STATUS_CD", "RX_PORT_STATUS_NM", "RX_PORT_DUMMY"
			                  ];
			
			$.each(columnList, function(key,val){
				if(dataObj._key != (flag+val)){
					$('#'+reserveGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, flag+val);
				}
	     	});
			setLinkDataNull(rowIndex);
		}
	});
	
	$('#'+reserveGridId).on('keyup', function(e){
		if(e.keyCode == 13) {
			var dataObj = AlopexGrid.parseEvent(e).data;
			var rowIndex = dataObj._index.row;
			var schVal = dataObj._state.editing[dataObj._column];
			
			if(dataObj._key == "LEFT_NE_NM") {
				// 좌장비
				openEqpListPop("LEFT");
			} else if(dataObj._key == "RIGHT_NE_NM") {
				// 우장비
				openEqpListPop("RIGHT");
			} else if(dataObj._key == "LEFT_PORT_DESCR") {
				// 좌포트
				openPortListPop("LEFT");
			} else if(dataObj._key == "RIGHT_PORT_DESCR") {
				// 우포트
				openPortListPop("RIGHT");
			} 
			else if(dataObj._key == "RIGHT_EQP_PORT_REFC_VAL") {
				// 우포트
				openPortListPop("FDF");
			}
			return false;
		}
    });
}

function setLinkDataNull(rowIndex) {
	return;
	//구간 데이터 변경
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_SEQ");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_ID");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_DIRECTION");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "LINK_STATUS_CD");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_ID");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_DIRECTION");
	$('#'+currentGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, "RX_LINK_STATUS_CD");
}

/**
 * Function Name : openAutoClctPathListPop
 * Description   : 자동수집선번 팝업
 */
function openAutoClctPathListPop() {
	
//	var param = { "ntwkLineNo" : ntwkLineNo, "userNtwkLnoGrpSrno" : ntwkLnoGrpSrno };
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: 'AutoClctPathListPop',
	  	title: '자동수집선번 팝업',
	  	url: urlPath+'/configmgmt/cfline/RontClctLnoPop.do',
//	    data: param,
	    iframe: false,
	    modal : true,
	    movable : true,
	    windowpopup : true,
	    width : 1200,
	    height : 850,
	    callback:function(data){
	    	if(data != null){	    		
//	    		for(var key in data) {
//	    			// 동일 기간망트렁크 LINK구간 삭제
//	    			if(data[key].WDM_TRUNK_ID != null){
//	    				$('#'+detailGridId).alopexGrid("dataDelete", {"WDM_TRUNK_ID" : data[key].WDM_TRUNK_ID} );
//	    			}
//	    		}
	    		// 자동수집선번 EAST 장비 FDF 장비정보로 편집
	    		for (var i = 0; i < data.length; i++) {
	    			data[i].RIGHT_EQP_PORT_REFC_VAL = (nullToEmpty(data[i].RIGHT_NE_NM) == "" ? "" : data[i].RIGHT_NE_NM + (nullToEmpty(data[i].RIGHT_PORT_DESCR) == "" ? "" : "," + data[i].RIGHT_PORT_DESCR));
	    			
	    		}
	    		
	    		setPathData(data, true, currentGridId);
	    		$("#"+currentGridId).alopexGrid("startEdit");
	    	}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
	    }	  
	});
}


/**
 * Function Name : openNetworkPathPop
 * Description   : WDM트렁크 선번 검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 :  editYn. 편집 가능 여부
 * 					paramValue. 기간망트렁크ID(networkLineNo) 
 * 					btnPrevRemove. 선번 팝업창에서 '이전' 버튼 유무
 * 					useNetworkPathDirection : 네트워크 방향
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */
function openNetworkPathPop(editYn, paramValue, btnPrevRemove, useNetworkPathDirection) {
//	cflineShowProgressBody();
//	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
//	var param = {"ntwkLineNo" : paramValue, "ntwkLnoGrpSrno" : "1", "searchDivision" : "wdm", "editYn" : editYn, "zIndex":zIndex, "target":"Alopex_Popup_NetworkPathListPop"};
	var param = {"ntwkLineNo" : paramValue
				, "ntwkLnoGrpSrno" : "1"
				, "searchDivision" : "ront"
				, "editYn" : editYn
				, "btnPrevRemove" : btnPrevRemove
				, "useNetworkPathDirection" : useNetworkPathDirection			
	};
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}

	$a.popup({
		popid: 'NetworkPathListPop',
	  	title: '선번',
	  	url: urlPath+'/configmgmt/cfline/NetworkPathListPop.do',
	    data: param,
	    iframe: true,
	    modal : true,
	    movable : true,
	    windowpopup : true,
	    width : 1100,
	    height : 700,
	    callback:function(data){
//	    	cflineHideProgressBody();
	    	if(editYn && data != null){
	    		var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}})[0];
	    		if(data.prev == "Y"){
	    			if(String(focusData.WDM_TRUNK_MERGE).indexOf('alopex') == 0){
	    				var schVal = AlopexGrid.currentData(focusData).WDM_TRUNK_NM;
	    				openRontTrunkListPop(nullToEmpty(schVal));
	    			}
	    		} else {
		    		var rowIndex = focusData._index.row;
		    		
		    		// 입력데이터 리셋
		    		$('#'+detailGridId).alopexGrid("cellEdit", null, {_index : { row : rowIndex}}, "WDM_TRUNK_NM");
		    		
		    		// 동일 기간망트렁크 LINK구간 삭제
		    		var deleteDataList = $('#'+detailGridId).alopexGrid("dataGet", {"WDM_TRUNK_ID":paramValue}, "WDM_TRUNK_ID");
		    		var deleteRowIndex = 0;
		    		
		    		for(var i = 0; i < deleteDataList.length; i++) {
		    			deleteRowIndex = deleteDataList[i]._index.row;
		    			$('#'+detailGridId).alopexGrid("dataDelete", {_index : { row:deleteRowIndex }});
		    		}
		    		
		    		if(rowIndex > (deleteRowIndex-deleteDataList.length) && deleteRowIndex !== 0){
		    			rowIndex = deleteRowIndex;
		    		}

		    		// LINK_DIRECTION 설정
		    		var usePath = data[0].USE_NETWORK_PATH_DIRECTION; 
	    			var useLink = data[0].USE_NETWORK_LINK_DIRECTION;
	    			var link = 'RIGHT';
	    			if(usePath == 'RIGHT' && useLink == 'RIGHT') link = 'RIGHT';
	    			else if(usePath == 'RIGHT' && useLink == 'LEFT') link = 'LEFT';
	    			else if(usePath == 'LEFT' && useLink == 'RIGHT') link = 'LEFT';
	    			else if(usePath == 'LEFT' && useLink == 'LEFT') link = 'RIGHT';
	    			
		    		for(var i = 0; i < data.length; i++) {
		    			data[i].LINK_DIRECTION = link;
		    		}
		    		
		    		$('#'+detailGridId).alopexGrid('dataAdd', data, {_index:{data : rowIndex}});
	    		}
	    	}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
	    }
	});
}

/**
 * Function Name : openEqpListPop
 * Description   : 장비검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 좌우구분(LEFT, RIGHT)
 * ----------------------------------------------------------------------------------------------------
 */ 
function openEqpListPop(param){
	var focusData = AlopexGrid.currentData($('#'+currentGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	var paramData = {"vTmofInfo":vTmofInfo};
	if(param == "RIGHT"){
		$.extend(paramData,{"neRoleCd":"11", "neNm":nullToEmpty(focusData.RIGHT_NE_NM), "fdfAddVisible":true});
	}
	// FDF 설정 장비인 경우
	else if (param == 'FDF') {
		var RIGHT_EQP_PORT_REFC_VAL = nullToEmpty(focusData.RIGHT_EQP_PORT_REFC_VAL);
		var portIndex = RIGHT_EQP_PORT_REFC_VAL.indexOf(",");
		RIGHT_EQP_PORT_REFC_VAL = RIGHT_EQP_PORT_REFC_VAL.substr(0, (portIndex < 0 ? RIGHT_EQP_PORT_REFC_VAL.length : portIndex));
		$.extend(paramData,{"neRoleCd":"11", "neNm":RIGHT_EQP_PORT_REFC_VAL, "fdfAddVisible":true});
	}
	else {
		$.extend(paramData,{"neNm":nullToEmpty(focusData.LEFT_NE_NM), "fdfAddVisible":false});
	}
//	TODO 네트워크 분류에 따른 장비 모델 확정되면 추가 필요
//	modelLclCdList = nullToEmpty(param.modelLclCd);
//	modelMclCdList = nullToEmpty(param.modelMclCd);
//	modelSclCdList = nullToEmpty(param.modelSclCd);

	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	} 
	
	$a.popup({
	  	popid: "popEqpListSch" + param,
	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
		data: paramData,
		iframe: true,
	    modal: true,
	    movable:true,
	    windowpopup : true,
		width : 830,
		height : 730,
		callback:function(data){
			if(data != null){
				// 장비 data 초기화 column set
				var columnList = [];
				var dataList = AlopexGrid.trimData(focusData);
				
				// 오른쪽 FDF 텍스트 입력이 아닌경우
				if (param != 'FDF') {
	    			for(var key in dataList) {
	    				if(key.indexOf(param) == 0) {
	    					columnList.push(key.replace(param+"_", ""));
	    				}
	    			}
				} else {
					
				}
    			// 장비 data set
    			setEqpData(param, rowIndex, data, columnList);
    			setLinkDataNull(rowIndex);
			}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 		
		}
	});		
}

/**
 * Function Name : openPortListPop
 * Description   : 포트검색 팝업 창
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 좌우구분(LEFT, RIGHT)
 * ----------------------------------------------------------------------------------------------------
 */ 
function openPortListPop(param){
	var focusData = AlopexGrid.currentData($('#'+currentGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	var neId = "";
	var schVal = "";
	
	var txPortId = "";
	var rxPortId = "";
	
	if(param == "LEFT"){
		neId = focusData.LEFT_NE_ID;
		schVal = focusData.LEFT_PORT_DESCR;
	} else {
		neId = focusData.RIGHT_NE_ID;
		schVal = focusData.RIGHT_PORT_DESCR;
	}
	
	if(nullToEmpty(neId)=="" || neId == "DV00000000000"){
		var msg = param=="LEFT"? cflineMsgArray['node'] : cflineMsgArray['fiberDistributionFrame'];
 		alertBox('W', makeArgMsg("selectObject",msg)); /* {0}을 선택하세요 */
 		return;
	}
	
	var paramData = {"ntwkLineNo" : ntwkLineNo, "neId":neId, "portNm":nullToEmpty(schVal), "isService":false, "topoLclCd": topoLclCd, "topoSclCd":topoSclCd};
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	} 
	
	$a.popup({
	  	popid: "popPortListSch" + param,
	  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
	  	url: urlPath + '/configmgmt/cfline/PortInfPop.do',
		data: paramData,
		width : 850,
		height : 720,
		iframe: true,
	    modal: true,
	    movable:true,
	    windowpopup : true,
		callback:function(data){
			if(data != null && data.length > 0){
				// 포트 column set
    			var txColumnList = [  
    			                    "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CHANNEL_DESCR"
    			                    , "CARD_ID","CARD_MODEL_ID", "CARD_MODEL_NM", "CARD_STATUS_CD"
    			                    , "PORT_ID", "PORT_NM", "PORT_DESCR", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY"
    			                  ];
    			// tx구간 set
    			setEqpData(param, rowIndex, data[0], txColumnList);
    			
    			if(data.length > 1){
    				// rx구간 set
    				var rxColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
    				var rxParam = param+"_RX";
    				setEqpData(rxParam, rowIndex, data[1], rxColumnList);
    				
    				// port descr set
    				var portDescr = makeTxRxPortDescr(data[0].portNm, data[1].portNm);
    				$('#'+currentGridId).alopexGrid( "cellEdit", portDescr, {_index : { row : rowIndex}}, param+"_PORT_DESCR");
    				
    				// rx구간의 장비set
    				var rxSctnColumnList = ["PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "NE_ID", "NE_NM"];
    				var rxSctnParam = (param == "LEFT" ? "RIGHT" : "LEFT");
    				var rxSctnData = {"portId" : eval("focusData." + rxSctnParam + "_PORT_ID"), "portDescr" : eval("focusData." + rxSctnParam + "_PORT_DESCR")
    						, "portStatusCd" : eval("focusData." + rxSctnParam + "_PORT_STATUS_CD"), "portStatusNm" : eval("focusData." + rxSctnParam + "_PORT_STATUS_NM")
    						, "portDummy" : eval("focusData." + rxSctnParam + "_PORT_DUMMY"), "neId" : eval("focusData." + rxSctnParam + "_NE_ID")
    						, "neNm" : eval("focusData." + rxSctnParam + "_NE_NM")};
    				
    				
    				if(param == "LEFT") {
    					setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
    				} else if(param == "RIGHT") {
    					if(eval("focusData." + rxSctnParam + "_RX" + "_PORT_ID") == null) {
    						setEqpData(rxSctnParam + "_RX", rowIndex, rxSctnData, rxSctnColumnList);
        				}
    				}
    				
    				txPortId = data[0].portId;
    				rxPortId = data[1].portId;
    			} else {
    				txPortId = data[0].portId;
    			}
    			
    			setLinkDataNull(rowIndex);
    			
    			// 좌포트 입력이고 우장비(FDF)가 null일 경우 장비ID와 포트ID로 FDF 검색
    			if(param == "LEFT" && nullToEmpty(focusData.RIGHT_NE_ID) ){
    				searchFDF(neId, txPortId, rxPortId);
    			}
			}
			// 다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null; 
		}
	});
}

function searchFDF(eqpId, txPortId, rxPortId){
	cflineShowProgressBody();
	
	var mtsoList = [];
	$.each(vTmofInfo, function(key,val){
		mtsoList.push(vTmofInfo[key].mtsoId);
	});
	
	var param = {"lftEqpId" : eqpId, "lftPortId" : txPortId, "rxLftPortId" : rxPortId, "topMtsoIdList": mtsoList};

	// 장비구간 FDF검색
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ronttrunk/selectronteqpsctn', param, 'POST', 'rontEqpSctn');
}

/**
 * Function Name : setEqpData
 * Description   : 장비데이터set
 * ----------------------------------------------------------------------------------------------------
 * param    	 : 구분자(LEFT, RIGHT)
 * rowIndex    	 : 데이터를 입력할 grid row
 * data    	 	 : 입력 데이터
 * columnList    : 변경 컬럼 array
 * ----------------------------------------------------------------------------------------------------
 */ 
function setEqpData(param, rowIndex, data, columnList){
	var editData = {};
	
	for(var i=0; i < columnList.length; i++){
		var columnKey = columnList[i];
		
		// conversion
		var convertKey = columnKey.toLowerCase();
        convertKey = convertKey.replace(/_(\w)/g, function(word) {
            return word.toUpperCase();
        });
		convertKey = convertKey.replace(/_/g, "");
		
		var setValue = false;
		$.each(data, function(key,val){
	 		if(key == convertKey){
//	 			$('#'+detailGridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex}}, param+"_"+columnKey);
	 			var keyStr = param+"_"+columnKey;
	 			eval("editData" + "." + keyStr + "=" + "val");
	 			setValue = true;
	 		}         		
	 	});
		
		if(!setValue){
			var keyStr = param+"_"+columnKey;
			eval("editData" + "." + keyStr + "=" + "null");
//			$('#'+detailGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param+"_"+columnKey);
		}
	}

	$('#'+currentGridId).alopexGrid( "dataEdit", $.extend({}, editData), {_index : { row : rowIndex}});
	
}

function filterVisibleLink( data ) {
	data = AlopexGrid.currentData(data);
	
	if(baseInfData.rontTrkTypCd == "023"){
		return true;
	} 
	//else if (data === null || data.LINK_VISIBLE === null || data.LINK_VISIBLE === undefined ) {
	else if (data === null  ) {
	    return true;
	}
	/*else if( nullToEmpty(data.RONT_SCTN_CL_CD) == "" 
			|| data.RONT_SCTN_CL_CD == "001" || data.RONT_SCTN_CL_CD == "002" 
			|| data.RONT_SCTN_CL_CD == "011" || data.RONT_SCTN_CL_CD == "012")*/
	else if( nullToEmpty(data.rontSctnClCd) == "" 
		|| data.rontSctnClCd == "001" || data.rontSctnClCd == "002" 
		|| data.rontSctnClCd == "011" || data.rontSctnClCd == "012")
	{
		return true;
	} else {
		return false;
	}
}
