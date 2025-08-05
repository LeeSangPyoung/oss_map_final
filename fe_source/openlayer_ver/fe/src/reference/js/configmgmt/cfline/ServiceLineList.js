/**
 * ServiceLineList.js 
 * 
 * @author park. i. h.
 * @date 2016.09.08
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2018-03-12  1. [수정] RM선번편집 창 자동열기 
 * 2018-05-30  2. [수정] WDM트렁크 기간망 형식으로 변경
 * 2018-09-05  3. [추가] 기타회선 > DCN 망 추가
 * 2018-10-01  4. [추가] 기타회선 > 중계기 정합장치 회선 추가
 * 2018-11-13  5. [수정] RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2020-04-16  6. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 * 2022-01-19  7. SMUX장비구분별 검색 - SMUX장비구분 선택시 자동으로 SMUX링구성선택됨
 * 2022-12-12  8. 링구성방식 추가에 따라 장비구분 선택시 로직 변경
 * 2023-11-08  9. [추가] 등록버튼 활성화에 기타 - 예비회선 추가 
 * 2024-01-10  10. [추가] RU광코어 프론트홀구간보기 검색조건 추가 - 전체구간보기는 불가능하게 됨
 * 2024-09-25  11. [추가] 4G-LMUX장비(56) 에 맞는 링구성방식(008) 추가
 */ 
var svlnSclCdData = [];  // 서비스회선소분류코드 데이터
var svlnTypCdListCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnTypCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnCommCodeData = [];  // 서비스회선 공통코드
var cmCodeData =[];  // 서비스회선 공통코드
var svlnLclSclCodeData = [];  // 서비스회선 대분류 소분류코드
var bizrCdCodeData = [];
var msgVal = "";		// 메시지 내용

var returnMapping = [] // 회선정보 헤더
var returnWorkMapping = [] // 작업정보 헤더

var emClass = '' ; // 그리드 편집모드시 필수표시
var infoMaxnumber = 0;
var workMaxnumber = 0;

var svlnLclCd = null;
var svlnSclCd = null;
var tmpSchLcd = "";
var tmpSchScd = "";

var jobInstanceId = "";

var gridIdScrollBottom = true;
var gridIdWorkScrollBottom = true;
var pageForCount = 200;
var totalCnt = 0;   /* 2019-11-06 추가 */
var workTotalCnt = 0;   /* 2019-11-06 추가 */

var showAppltNoYn = false;

var skTb2bSvlnSclCdData = [];
var skBb2bSvlnSclCdData = [];

var fdfUsingInoLineNo = null;

// 3. [수정] WDM트렁크 기간망 형식으로 변경 = > 해지시 자동 수정 대상 테이블에서 삭제 처리
var procAcceptTargetList = null;

// RU 광코어 : 관리 본부, 팀 데이터
var mgmtOrgData = [];

//RU 광코어 : 장비구분
var EqpDivData = [];

// RU 광코어 > 대표회선 관련 그리드 hide 플래그
//var ocmYn = false;

// 해지요청중 : 승인권한
var aprvUserId = null;
//var aprvUserIdYn = null;
var btnLineTrmnNm = cflineMsgArray['trmn'];

// 망구성방식코드업데이트
var netCfgMeansSvlnNo = null;

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        
    	fdfUsingInoLineNo = null;
    	procAcceptTargetList = null;
    	
    	$('#btnExportExcel').setEnabled(false);
    	$('#btnDupMtsoMgmt').setEnabled(false);
    	$('#btnRepeaterMgmt').setEnabled(false);  // 중계기설정
    	//$('#btnRepeaterMgmt').hide();  // 중계기설정
    	
    	$('#btnLineTrmn').setEnabled(false);
		$('#btnWorkUpdate').setEnabled(false);
		$('#btnAllWorkInfFnsh').setEnabled(false);
		$('#btnWorkInfFnsh').setEnabled(false);
		
		$('#btnWorkCnvt').setEnabled(false);		// 작업전환
		$('#btnSetRprtLine').setEnabled(false);	// 대표회선 설정 : RU 광코어일 때만
		
		
    	createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
    	//initGridServiceLine();     
    	setSelectCode();
    	 
    	//setGridEventListener();
        setEventListener();      
    	getGrid();
    	// 사용자 권한체크 : 승인버튼
    	aprvUserId = $('#userId').val();
    	aprvAminChk("service", aprvUserId);
 
    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearch2Code("hdofcCd", "teamCd", "tmofCd","A");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', null, 'GET', 'svlnCommCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getMgmtBonbuTeam', null, 'GET', 'getMgmtBonbuTeam');	// 관리 본부/팀 데이터
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getEqpDivList', null, 'GET', 'EqpDivData');  //장비구분 - 2022-01-19
    	
    	 // 사용자 소속 전송실
    	searchUserJrdtTmofInfo("tmofCd");
    }
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		//$('#btnSearch').click();
                  	}
               	}
            });
    }
    
    function pwEvcListPop (data){
		 $a.popup({
  			popid: "PwEvcListPop",
  			title: "PW/EVC명 검색",
  			url: 'PwEvcListPop.do',
			data: data,
  			iframe: true,
  			modal : true,
  			movable:true,
  			width : 1000,
  			height : 600
  			,callback:function(data){
  				if(data != null){
  		    		var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
  		    		var rowIndex = focusData[0]._index.data;
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.pktTrkNm, {_index : { row : rowIndex}}, "pktTrkNm");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.pktTrkNm, {_index : { row : rowIndex}}, "pktTrkMatchNm");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.pktTrkNo, {_index : { row : rowIndex}}, "pktTrkNo");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.vlanVal, {_index : { row : rowIndex}}, "vlanId");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.ringOneName, {_index : { row : rowIndex}}, "ringOneName");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.eqpNmOne, {_index : { row : rowIndex}}, "eqpNmOne");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.ringTwoName, {_index : { row : rowIndex}}, "ringTwoName");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.eqpNmTwo, {_index : { row : rowIndex}}, "eqpNmTwo");
  					$('#'+gridIdWork).alopexGrid( "cellEdit", data.eqpPortVal, {_index : { row : rowIndex}}, "eqpPortVal");
  				}

				// 다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
  			}  
		});
    }
    
    function baseMtsoPop() {
    	var data = $('#searchForm').getData();
    	var mtsoVal = data.tmofCd;
    	    	
    	$a.popup({
    		popid: "BaseMtsoPop",
    		title: "기지국사 등록",
    		url: "BaseMtsoPop.do",
    		data: mtsoVal,
    		iframe: true,
    		modal: true,
    		movable: true,
    		width: 1000,
    		height: 500,
    		callback: function(data) {
    			if(data != null) {
    				var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
  		    		var rowIndex = focusData[0]._index.data;
  		    		
    				$('#'+gridIdWork).alopexGrid("cellEdit", data.cmsId, {_index: {row: rowIndex}}, "cmsId");
   					$('#'+gridIdWork).alopexGrid("cellEdit", data.btsName, {_index: {row: rowIndex}}, "cmsBmtso");
   					$('#'+gridIdWork).alopexGrid("cellEdit", data.mscId, {_index: {row: rowIndex}}, "cmsMscId");
   					$('#'+gridIdWork).alopexGrid("cellEdit", data.bscId, {_index: {row: rowIndex}}, "cmsBscId");
   					$('#'+gridIdWork).alopexGrid("cellEdit", data.btsId, {_index: {row: rowIndex}}, "cmsBtsId");
   					
    			}
    		}
    	});
    }
    
    function setEventListener() {
	 	// 엔터 이벤트   #searchForm
     	$('.condition_box').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnSearch').click();
    			return false;
    		}
     	});	   
     	
     	
    	// 탭 선택 이벤트
   	 	$("#basicTabs").on("tabchange", function(e, index) {
   	 		if(index == 0) {
   	 			$('#'+gridId).alopexGrid("viewUpdate");
   	 			//btnEnableProc(gridId, "btnDupMtsoMgmt", "btnWorkCnvt", "A");
   	 			btnEnableProc(gridId, "btnDupMtsoMgmt", "", "A");

   	     	    $('#btnRepeaterMgmt').setEnabled(false);  // 중계기설정
   	 			$('#tabIndexValue').val("0");

   	 			/*
   	 			$('#btnDupMtsoMgmt').setEnabled(false);
   		   	 	var selectedId = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
   				if(selectedId.length > 0 ){
   					$('#btnWorkCnvt').setEnabled(true);
   				}else{
   					$('#btnWorkCnvt').setEnabled(false);
   				} 
   				*/  	 		
   	 		} else if(index == 1) {
   	 			$('#'+gridIdWork).alopexGrid("viewUpdate");
   	 			
   	 			//btnEnableProc(gridIdWork, "btnDupMtsoMgmt", "btnWorkCnvt", "B");
   	 			btnEnableProc(gridIdWork, "btnDupMtsoMgmt", "", "B");
   	 			// 중계기 설정
   	 			// RU-중계기/전체인 경우만 활성
   	 			if ($('#svlnLclCd').val() == '003'  && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101')) {
   	 				//btnEnableProc(gridIdWork, "btnRepeaterMgmt", "btnWorkCnvt", "B");
   	 				btnEnableProc(gridIdWork, "btnRepeaterMgmt", "", "B");
   	 			}
   	 			$('#tabIndexValue').val("1");
   	 		    // ADAMS 연동 고도화
	   	 		if($('#mgmtGrpCd').val() == '0002' && $('#svlnLclCd').val() != '004'){
					$('#btnDupMtsoMgmt').setEnabled(false);
				}
   	 			/*
   	 			$('#btnWorkCnvt').setEnabled(false);
   		   	 	var selectedId = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
   				if(selectedId.length > 0 ){
   					$('#btnDupMtsoMgmt').setEnabled(true);
   				}else{
   					$('#btnDupMtsoMgmt').setEnabled(false);
   				}
   				*/
   	 		}
   	 	});    
   	 	$('#tab1Header').on("click", function(e){
   	 		//btnEnableProc(gridId, "btnDupMtsoMgmt", "btnWorkCnvt", "A");
   	 		btnEnableProc(gridId, "btnDupMtsoMgmt", "", "A");
	     	$('#btnRepeaterMgmt').setEnabled(false);  // 중계기설정   	 		
   	 		/*
   	 		//console.log("tab1 클릭");
   	 		$('#btnDupMtsoMgmt').setEnabled(false);
	   	 	var selectedId = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
			if(selectedId.length > 0 ){
				$('#btnWorkCnvt').setEnabled(true);
			}else{
				$('#btnWorkCnvt').setEnabled(false);
			}
			*/
	    });
   	 	$('#tab2Header').on("click", function(e){
   	 		//btnEnableProc(gridIdWork, "btnDupMtsoMgmt", "btnWorkCnvt", "B");
   	 		btnEnableProc(gridIdWork, "btnDupMtsoMgmt", "", "B");
 			// 중계기 설정
   	 	   // RU-중계기/전체인 경우만 활성
	 	    if ($('#svlnLclCd').val() == '003'  && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101') ) {
	 	    	//btnEnableProc(gridIdWork, "btnRepeaterMgmt", "btnWorkCnvt", "B");
	 	    	btnEnableProc(gridIdWork, "btnRepeaterMgmt", "", "B");
	 	    }
	 	    
	 	  // ADAMS 연동 고도화
	 	  if($('#mgmtGrpCd').val() == '0002' && $('#svlnLclCd').val() != '004'){
//				$('#btnDupMtsoMgmt').setEnabled(false);
				$('#btnWorkUpdate').setEnabled(false);
				$('#btnAllWorkInfFnsh').setEnabled(false);
				$('#btnWorkInfFnsh').setEnabled(false);
			}
   	 		/*
   	 		//console.log("tab2 클릭");
   	 		$('#btnWorkCnvt').setEnabled(false);
	   	 	var selectedId = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
			if(selectedId.length > 0 ){
				$('#btnDupMtsoMgmt').setEnabled(true);
			}else{
				$('#btnDupMtsoMgmt').setEnabled(false);
			}
			*/
	    });
   	 	$('#tab1').on("click", function(e){
   	 		/*
   	 		//console.log("tab1 클릭");
	 		var selectedId = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
			if(selectedId.length > 0 ){
				$('#btnWorkCnvt').setEnabled(true);
			}else{
				$('#btnWorkCnvt').setEnabled(false);
			}
			*/
	    });
	 	$('#tab2').on("click", function(e){
   	 		btnEnableProc2(gridIdWork, "btnDupMtsoMgmt"); 
 			// 중계기 설정
   	 	    // RU-중계기/전체인 경우만 활성
   	 		//console.log($('#svlnLclCd').val() + "  " + $('#svlnSclCd').val());
	 	    if ($('#svlnLclCd').val() == '003' && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101')  ) {
	 	    	btnEnableProc2(gridIdWork, "btnRepeaterMgmt"); 
	 	    }

   	 		/*
	 		//console.log("tab2 클릭");
	 		var selectedId = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
			if(selectedId.length > 0 ){
				$('#btnDupMtsoMgmt').setEnabled(true);
			}else{
				$('#btnDupMtsoMgmt').setEnabled(false);
			}
			*/
	    });
	 	// 국사 keydown
     	$('#mtsoNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#mtsoId").val("");
     		}
     	});
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 gridIdScrollBottom = true;
    		 gridIdWorkScrollBottom = true;
    		 svlnLclCd = $('#svlnLclCd').val();
    		 svlnSclCd = $('#svlnSclCd').val();
    		 if(nullToEmpty(svlnLclCd) == ""){
    			 alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineLcl'],"","","")); /*"서비스 회선 대분류를 선택해 주세요.;*/
         		return;
    		 }
    		 
    		 //	TODO RU광코어 인 경우에만 프론트홀보기 체크를 한다. 2023-11
    		 // ONS본부/팀 조회의 경우 프론트홀구간보기를 체크한 경우에만 가능하다 (별도 쿼리 존재)
    		 if(svlnLclCd == "003" && svlnSclCd == "101") {
    			 var frontHaulPath ='N';
    			 var onsHdofcCd = $('#onsHdofcCd').val();
    			 var onsTeamCd = $('#onsTeamCd').val();
			 
    			 if ($("input:checkbox[id='frontHaulPath']").is(":checked") ){
    				 frontHaulPath = 'Y'; 
    			 }
			   
    			 if(nullToEmpty(onsHdofcCd) != "" || nullToEmpty(onsTeamCd) != "") {
    				 if (frontHaulPath == "N"){
    					 alertBox('W', makeArgMsg('selectObject',cflineMsgArray['frontHaulSctnVsbe'],"","","")); /* "ONS본부/팀 조회는 프론트홀구간보기를 체크한 경우에만 가능합니다." */
    					 return;
    				 }
    			 }
    		 }
    		 
    		 searchProc();    		 
         });
    	//조회 
    	 $('#btnMoreDis').on('click', function(e) {
    		 svlnLclCd = $('#svlnLclCd').val();
    		 svlnSclCd = $('#svlnSclCd').val();
    		 if(nullToEmpty(svlnLclCd) == ""){
    			 alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineLcl'],"","","")); /*"서비스 회선 대분류를 선택해 주세요.;*/
         		return;
    		 } 		 
         });
    	 
         
         // 엑셀업로드
          $('#btnAddExcel').on('click', function(e) {
         	 $a.popup({
              	popid: 'ServiceLineExcelUplaodPop',
              	title: cflineMsgArray['svlnExcelUpload'], /*'서비스회선 엑셀업로드'*/
              	iframe: true,
              	modal : false,
              	windowpopup : true,
                  url: $('#ctx').val() +'/configmgmt/cfline/ServiceLineExcelUploadPop.do',
                  data: {mgmtGrpCd : $("#mgmtGrpCd").val()}, 
                  width : 1400,
                  height : 900 //window.innerHeight * 0.5,
                  /*$('#ctx').val() + url
              		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
              	*/                
                  ,callback: function(resultCode) {
	                  	if (resultCode == "OK") {
	                  		//$('#btnSearch').click();
	                  	}
                 	}
         	 	  ,xButtonClickCallback : function(el){
         	 			alertBox('W', cflineMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
         	 			return false;
         	 		}
              });
         });    	 
    	 
         //엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 funExcelBatchExecute();
         });  

     	// 관리그룹 클릭시
     	$('#mgmtGrpCd').on('change',function(e){
     		if( $('#mgmtGrpCd').val() == '0001' ){
     			$('#btnServiceWritePop').setEnabled(false);
     			$('#btnAddExcel').setEnabled(true);
     			showAppltNoYn = false;
     		}else{
     			/* 기존 소스
     			$('#btnServiceWritePop').setEnabled(true);
     			showAppltNoYn = true;
     			 여기까지*/
     			// ADAMS 연동 고도화
//     			$('#btnDupMtsoMgmt').setEnabled(false);
     			$('#btnRepeaterMgmt').setEnabled(false);
     			$('#btnServiceWritePop').setEnabled(false);
     			$('#btnAddExcel').setEnabled(false);
     			$('#btnLineTrmn').setEnabled(false);
//				$('#btnWorkUpdate').setEnabled(false);
//				$('#btnAllWorkInfFnsh').setEnabled(false);
//				$('#btnWorkInfFnsh').setEnabled(false);
//				$('#btnApproval').setEnabled(false); 
     			showAppltNoYn = false;
     			
     		}
     		changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
     		changeSvlnLclCd('svlnLclCd', 'svlnSclCd', svlnLclSclCodeData, "mgmtGrpCd", "N"); // 서비스회선소분류 selectbox 제어	
//     		changeSvlnSclCd('svlnLclCd', 'svlnSclCd', svlnSclCdData, "mgmtGrpCd"); // 서비스회선소분류 selectbox 제어	
     		makeSearchFormByMgmt('svlnLclCd', 'svlnSclCd', svlnSclCdData);
     		createBizrCdByChangeMgmtCd("mgmtGrpCd", "bizrCd", bizrCdCodeData, "A")  // 통신사업자 selectBox 제어
       	});   
     	
    	// 서비스회선 대분류 선택 
    	$('#svlnLclCd').on('change', function(e){
    		changeSvlnSclCd('svlnLclCd', 'svlnSclCd', svlnSclCdData, "mgmtGrpCd"); // 서비스회선소분류 selectbox 제어
    		makeSearchFormByLcd('svlnLclCd', 'svlnSclCd', svlnSclCdData);
    		
    		// 중계기설정   
    		if ($('#svlnLclCd').val() == '003'  && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101') ) {
	 	    	//btnEnableProc(gridIdWork, "btnRepeaterMgmt", "btnWorkCnvt", "B");
    			btnEnableProc(gridIdWork, "btnRepeaterMgmt", "", "B");
    			$('#btnSetRprtLine').setEnabled(true);
	 	    } else {
	 	    	 $('#btnRepeaterMgmt').setEnabled(false);  // 중계기설정   	
	 	    	 $('#btnSetRprtLine').setEnabled(false);
	 	    }
    		
    		if( ($('#mgmtGrpCd').val() == "0001" ) && ($('#svlnLclCd').val() == "005")) {
		 		$("#nitsCisConn").setEnabled(true);
		 	} else {
		 		$("#nitsLabel").removeClass();
		 		$("#nitsCisConn").prop('checked',false);
		 		$("#nitsLabel").addClass('ImageCheckbox');
		 		$("#nitsCisConn").setEnabled(false);
		 	}
    		
    		// 관리 본부,팀
     		changeMgmtBonbu();
         	$('#mgmtBonbuId').on('change', function(e){
         		var mgmtBonbuId = $('#mgmtBonbuId').val();
         		changeMgmtBonbu(mgmtBonbuId);
         	});
         	
            /**
             * 1. 장비구분 선택시 링구성방식 S-MUX고정
             * 2. 링구성방식 추가에 따라 장비구분 선택시 로직 변경
             * 2022-01-19 추가
             * 3. 4G_LMUX추가(56-008) 20241113
             */
            $('#eqpDivCd').on('change', function(e) { 
            	if($('#eqpDivCd').val() != '') {
            		if($('#eqpDivCd').val() == '19') {
	            		$('#netCfgMeansCd').setSelected("003");
	            		$('#netCfgMeansCd').val("003");
            		} else if($('#eqpDivCd').val() == '52') {
	            		$('#netCfgMeansCd').setSelected("005");
	            		$('#netCfgMeansCd').val("005");
            		} else if($('#eqpDivCd').val() == '53') {
	            		$('#netCfgMeansCd').setSelected("006");
	            		$('#netCfgMeansCd').val("006");
            		} else if($('#eqpDivCd').val() == '56') {
	            		$('#netCfgMeansCd').setSelected("008");
	            		$('#netCfgMeansCd').val("008");
            		}
            	}
    	    }); 
         	
            /**
             * 링구성방식 MUX -> 타구성방식으로 변경시 장비구분은 리셋한다.
             * 2022-12-12 추가
             * 4G-LMUX (008) 2024-11-13 추가
             */
            $('#netCfgMeansCd').on('change', function(e) { 
            	if($('#netCfgMeansCd').val() != '003' && $('#netCfgMeansCd').val() != '005' && $('#netCfgMeansCd').val() != '006' && $('#netCfgMeansCd').val() != '008') {
            		$('#eqpDivCd').setSelected("");
        			$('#eqpDivCd').val("");
            	}
            }); 
            
         	// 승인 버튼
         	/*$('#btnApproval').setEnabled(false);
    		setApprovalBtn();
    		$('#svlnStatCd').on('change', function(e) {
    			setApprovalBtn();
    		});*/
    		
    		// 회선정보 그리드 버튼 활성화
    		setGridIdBtn();
    		
    		// SKT: B2B, RU회선광코어, 기타_중계기정합장치
    		if ($('#mgmtGrpCd').val() == "0001" 
    			&& ($('#svlnLclCd').val() == "005" 
    				|| ($('#svlnLclCd').val() == "003" && $('#svlnSclCd').val() == "101") ) 
    				|| ($('#svlnSclCd').val() == '061')) {
    			btnLineTrmnNm = cflineMsgArray['approval'] +"/" + cflineMsgArray['trmn'];
    		} else {
    			btnLineTrmnNm = cflineMsgArray['trmn'];	
    		}
    		$("#btnLineTrmnNm").html(btnLineTrmnNm);    	
    		
    		// ADAMS 연동 고도화 SKB 가입자망 회선만 가능 
    		if( ($('#mgmtGrpCd').val() == "0002" ) && ($('#svlnLclCd').val() == "004")) {
    			$('#btnServiceWritePop').setEnabled(true);
     			$('#btnAddExcel').setEnabled(true);
//     			$('#btnDupMtsoMgmt').setEnabled(true);
//     			$('#btnLineTrmn').setEnabled(true);	
     			showAppltNoYn = true;
		 	} else {
		 		if($('#mgmtGrpCd').val() == "0001" ) {
		 			$('#btnAddExcel').setEnabled(true);
//		 			$('#btnDupMtsoMgmt').setEnabled(true);
//	     			$('#btnLineTrmn').setEnabled(true);	
		 			showAppltNoYn = false;
		 		} else {
			 		$('#btnServiceWritePop').setEnabled(false);
	     			$('#btnAddExcel').setEnabled(false);
//	     			$('#btnDupMtsoMgmt').setEnabled(false);
//	     			$('#btnLineTrmn').setEnabled(false);	     			
//	     			showAppltNoYn = false;
		 	    }
		 	}

    		/**
    		 * FDF구간제외의 경우 전체구간보기를 선택한 경우에만 활성화된다
    		 * 2021-07-09
    		 */
    		if($('#mgmtGrpCd').val() == '0001' && $('#svlnLclCd').val() == '001'){
    			$('#btnSearchRmPath').setEnabled(true);
        		if ($("input:checkbox[id='pathAll']").is(":checked") ){
		    		$("#exceptFdfNeDisplayCheckbox").show();
		    	}else{
		    		$('#exceptFdfNeDisplayCheckbox').hide();
		    	}
			} else {
				$('#btnSearchRmPath').setEnabled(false);
        		$('#exceptFdfNeDisplayCheckbox').hide();
			}
      	});        	 
    	// 서비스회선소분류코드 선택시
    	$('#svlnSclCd').on('change', function(e){
    		makeSearchFormByScd('svlnLclCd', 'svlnSclCd', svlnSclCdData);
     		reSetGrid();
     		
     		// 등록버튼 활성화
     		//기타회선, 기지국회선, 공동망회선
     		// 기타 - 예비회선 추가 2023-11-08
     		if( ( $('#svlnLclCd').val() == '006'  && ( $('#svlnSclCd').val() == '060' || $('#svlnSclCd').val() == '061' || $('#svlnSclCd').val() == '070' || $('#svlnSclCd').val() == '071' || $('#svlnSclCd').val() == '072' || $('#svlnSclCd').val() == '106') )
     		  ||( $('#svlnLclCd').val() == '001'  && ( $('#svlnSclCd').val() == '001' || $('#svlnSclCd').val() == '003' || $('#svlnSclCd').val() == '012' || $('#svlnSclCd').val() == '020') )
     		  ||( $('#svlnLclCd').val() == '007'  && ( $('#svlnSclCd').val() == '080') )
     		) {
 				$('#btnServiceWritePop').setEnabled(true);
 				$('#btnAddExcel').setEnabled(true); // ADAMS 연동 고도화
 				showAppltNoYn = true;
 			} else {
// 				if( $('#mgmtGrpCd').val() == '0002' ){  // ADAMS 연동 고도화 원래 소스
// 					$('#btnServiceWritePop').setEnabled(true);
// 	     			showAppltNoYn = true;
// 	     		}else{ // 여기까지
 	     			$('#btnServiceWritePop').setEnabled(false);
 	     			showAppltNoYn = false;
// 	     		}
 			}


     	    // 중계기설정   
     		if ($('#svlnLclCd').val() == '003'  && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101') ) {
	 	    	//btnEnableProc(gridIdWork, "btnRepeaterMgmt", "btnWorkCnvt", "B");
     			btnEnableProc(gridIdWork, "btnRepeaterMgmt", "", "B");
     			$('#btnSetRprtLine').setEnabled(true);
	 	    } else {
	 	    	 $('#btnRepeaterMgmt').setEnabled(false);  // 중계기설정   	
	 	    	 $('#btnSetRprtLine').setEnabled(false);
	 	    }
     	 	//임차회선포함 체크박스 제어
     	 	leslDisplayProc("svlnLclCd", "svlnSclCd");
     	 	
     	 	// 관리 본부,팀
     		changeMgmtBonbu();
         	$('#mgmtBonbuId').on('change', function(e){
         		var mgmtBonbuId = $('#mgmtBonbuId').val();
         		changeMgmtBonbu(mgmtBonbuId);
         	});
         	
         	// 승인버튼
         	/*$('#btnApproval').setEnabled(false);
     		setApprovalBtn();
     		$('#svlnStatCd').on('change', function(e) {
    			setApprovalBtn();
    		});*/
     		
     		// 회선정보 그리드 버튼 활성화
    		setGridIdBtn();
    		
    		// SKT: B2B, RU회선광코어, 기타_중계기정합장치
    		if ($('#mgmtGrpCd').val() == "0001" 
    			&& ($('#svlnLclCd').val() == "005" 
    				|| ($('#svlnLclCd').val() == "003" && $('#svlnSclCd').val() == "101") ) 
    				|| ($('#svlnSclCd').val() == '061')) {
    			btnLineTrmnNm = cflineMsgArray['approval'] +"/" + cflineMsgArray['trmn'];
    		} else {
    			btnLineTrmnNm = cflineMsgArray['trmn'];	
    		}
    		$("#btnLineTrmnNm").html(btnLineTrmnNm);    	
    		
            /** TODO
             * RU광코어회선인 경우에만 프론트홀구간보기선택을 활성화 한다
             */
        	if($('#svlnLclCd').val() == "003" && $('#svlnSclCd').val() == "101") {
        		$('#frontHaulPathCheckbox').show();
        		
        	} else {
        		$('#frontHaulPathCheckbox').hide();
        		$("#pathAll").setEnabled(true);
        	}
            
      	});   	 
    	// 본부 선택시
    	$('#hdofcCd').on('change',function(e){
    		changeHdofc("hdofcCd", "teamCd", "tmofCd", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "tmofCd", "mtso");
      	});      	 
  		// 전송실 선택시
    	$('#tmofCd').on('change',function(e){
    		changeTmof("tmofCd", "mtso");
      	});
    	
     	//좌장비 입력시 
     	$('#lftEqpNm').on('keydown', function(e){
     		if ( nullToEmpty( $('#lftEqpNm').val() )  != "" ){
     			$('#lftPortNm').setEnabled(true);// 좌포트
     		}else{
     			$('#lftPortNm').setEnabled(false);// 좌포트
     			$('#lftPortNm').val("");
     		}
     	});

     	//우장비 입력시  
     	$('#rghtEqpNm').on('keydown', function(e){
     		if ( nullToEmpty( $('#rghtEqpNm').val() )  != "" ){
     			$('#rghtPortNm').setEnabled(true);// 좌포트
     		}else{
     			$('#rghtPortNm').setEnabled(false);// 좌포트
     			$('#rghtPortNm').val("");
     		}
     	});    	
		
		// 작업정보해지
	    $('#btnLineTrmn').on('click', function(e) {
	    	delWorkInfo();
	   	});
		// 작업정보저장
	    $('#btnWorkUpdate').on('click', function(e) {
	    	workUpdate();
	   	});
	   	// 작업정보완료
	   	$('#btnWorkInfFnsh').on('click', function(e) {
	   		workInfFnsh("");
	   	});
	    // 모든작업정보완료
	   	$('#btnAllWorkInfFnsh').on('click', function(e) {
	   		workInfFnsh("A");
	   	});
		
		// 전송실 등록
		$('#btnDupMtsoMgmt').on('click', function(e) {
			var element =  $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
			var selectCnt = element.length;
			
			if(selectCnt <= 0){
    			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
			}else{
				var paramMtso = null;
				var paramList = [element.length];
				var mgmtGrpStr = "";
				var mgmtGrpChk = "N";
				if(selectCnt==1){
					paramMtso = {"multiYn":"N", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "svlnNo":element[0].svlnNo};
				}else{
					for(i=0;i<element.length;i++){
						paramList[i] = element[i].svlnNo;
						//paramList[i] = {"svlnNoArr":element[i].svlnNo};
						//paramList.push({"svlnNoArr":element[i].svlnNo};
						if(i==0){
							mgmtGrpStr = element[0].mgmtGrpCd;
						}
						if(i>0 && mgmtGrpStr != element[i].mgmtGrpCd){
							mgmtGrpChk = "Y";
						}
						
					}
					if(mgmtGrpChk == "Y"){
						//alert("여러 회선에 대한 전송실 등록시는 동일 관리그룹만 가능합니다.");						
						alertBox('W', cflineMsgArray['multiMtsoRegSameMngrGrpPoss']);/*여러 회선에 대한 전송실 등록시 동일 관리그룹만 가능합니다.*/
						return;
					}
					paramMtso = {"multiYn":"Y", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "svlnNoArr":paramList};
				}

//				console.log("btnDupMtsoMgmt S" );
//	    		console.log(paramMtso);
//	    		console.log("btnDupMtsoMgmt E" );
				srvcPopup2( "svlnMtsoUpdatePop", "/configmgmt/cfline/ServiceLineMtsoUpdatePop.do", paramMtso, 1200, -1, cflineMsgArray['serviceLine']/*서비스회선*/ +" "+ cflineMsgArray['mtsoEstablish']/*서비스회선전송실설정*/);
					    		
			}
		});
		// 서비스회선등록
		$('#btnServiceWritePop').on('click', function(e) {
			var paramData = {
					"svlnLclCd" : svlnLclCd
					, "svlnSclCd" : svlnSclCd
			}
			srvcPopup( "popServcieLineWrite", "/configmgmt/cfline/ServiceLineWritePop.do", paramData, 1000, 800, cflineMsgArray['serviceLine']+cflineMsgArray['registration']);
		});
        
        $('#'+gridId).on('scrollBottom', function(e){
        	
        	/* 전체 카운트수가 기본카운트수 200 이 넘을때만 재검색 20191113 */
        	if(totalCnt > 200) {
	    		var nFirstRowIndex =parseInt($("#firstRow01").val()) + pageForCount; // 페이징개수
	    		var nLastRowIndex =parseInt($("#lastRow01").val()) + pageForCount; // 페이징개수
	
	    		/* 2019-11-06 lastRowIndex가 총 카운트보다 큰 경우에는 마지막 총카운트를 넘겨준다 */
	        	if(nLastRowIndex > totalCnt) {
	        		nLastRowIndex = totalCnt;
	        	}
	    		
	            if(nFirstRowIndex < nLastRowIndex) { // 마지막 카운트수가 큰 경우에만 검색하도록 수정
		    		$("#firstRow01").val(nFirstRowIndex);
		    		$("#lastRow01").val(nLastRowIndex);  
		    		$("#firstRowIndex").val(nFirstRowIndex);
		    		$("#lastRowIndex").val(nLastRowIndex);  
		
		        	var dataParam =  $("#searchForm").serialize(); 
		        	if(gridIdScrollBottom){
		            	cflineShowProgress(gridId);
		        		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelist', dataParam, 'GET', 'searchForPageAdd');
		        	}
	            }
        	}
    	});   
        
        $('#'+gridIdWork).on('scrollBottom', function(e){

        	/* 전체 카운트수가 기본카운트수 200 이 넘을때만 재검색 20191113 */
        	if(workTotalCnt > 200) {
	    		var nFirstRowIndex =parseInt($("#firstRow02").val()) + pageForCount;  // 페이징개수
	    		var nLastRowIndex =parseInt($("#lastRow02").val()) + pageForCount; // 페이징개수
	    		
	    		/* 2019-11-06 lastRowIndex가 총 카운트보다 큰 경우에는 마지막 총카운트를 넘겨준다 */
	        	if(nLastRowIndex > workTotalCnt) {
	        		nLastRowIndex = workTotalCnt;
	        	}
	          	
	            if(nFirstRowIndex < nLastRowIndex) { // 마지막 카운트수가 큰 경우에만 검색하도록 수정
	            	searchWorkProc(nFirstRowIndex, nLastRowIndex, 'searchWorkForPageAdd');
	            }
        	}
    	});  	
		//국사찾기
		$('#btnMtsoSch').on('click', function(e) {
//			openMtsoPop("mtsoCd", "mtsoNm");
			var paramValue = "";
			
			paramValue = {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text(),"orgId": $('#hdofcCd').val()
					,"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val()
					, "regYn" : "Y", "mtsoStatCd" : "01"}
//			console.log("====================");
//			console.log(paramValue);
			openMtsoDataPop("mtsoCd", "mtsoNm", paramValue);
		}); 
		   
		//기지국회선 장비찾기
		$('#btnBmtsoEqpSch').on('click', function(e) {
			openEqpPop("bmtsoEqpCd", "bmtsoEqpNm");
		});    
		//B2B 장비찾기
		$('#btnB2bEqpSch').on('click', function(e) {
			openEqpPop("b2bEqpCd", "b2bEqpNm");
		});
		//가입자망 장비찾기
		$('#btnInnetEqpSch').on('click', function(e) {
			openEqpPop("innetEqpCd", "innetEqpNm");
		});
		
		//기지국회선 포트찾기
		$('#btnBmtsoPortSch').on('click', function(e) {
			openPortPop("bmtsoPort", "bmtsoPortNm");
		});    
		//B2B 포트찾기
		$('#btnB2bPortSch').on('click', function(e) {
			openPortPop("b2bPort", "b2bPortNm");
		});     
		//가입자망 포트찾기
		$('#btnInnetPortSch').on('click', function(e) {
			openPortPop("innetPort", "innetPortNm");
		});  
		

    	//그리드 첨부파일 업/다운로드
    	$('#'+gridIdWork).on('click', '#btnUpDownFile', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	var rowIndex = dataObj._index.row;
//    	 	console.log("=====================");
//    	 	console.log(dataObj);
//    	 	console.log(dataObj.svlnNo);
//    	 	console.log(rowIndex);
    		 	//openFileGridPop(gridIdWork, gridId, rowIndex, dataObj.svlnNo); // (작업그리드ID, 그리드ID, row 순번, 서비스회선번호)
    	 	openFileGridPop(gridIdWork, gridId, dataObj); // (작업그리드ID, 그리드ID, row 순번, 서비스회선번호)
    	});	    
    	//그리드 첨부파일 업/다운로드
    	$('#'+gridId).on('click', '#btnUpDownFile', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	var rowIndex = dataObj._index.row;
//    	 	console.log("=====================");
//    	 	console.log(dataObj);
//    	 	console.log(dataObj.svlnNo);
//    	 	console.log(rowIndex);
    		 	//openFileGridPop(gridIdWork, gridId, rowIndex, dataObj.svlnNo); // (작업그리드ID, 그리드ID, row 순번, 서비스회선번호)
    	 	openFileGridPop(gridIdWork, gridId, dataObj); // (작업그리드ID, 그리드ID, row 순번, 서비스회선번호)
    	});
    	// 20171116 E2E,시각화편집 버튼 클릭 이벤트
    	$('#'+gridId).on('click', '#btnE2ePop', function(e){  
			intgE2ETopo(gridId);
		}).on('click', '#btnServiceLIneInfoPop', function(e){  
			var dataObj = AlopexGrid.parseEvent(e).data;
			showServiceLIneInfoPop( gridId, dataObj, "N");
		});
    	$('#'+gridIdWork).on('click', '#btnE2ePop', function(e){  
			intgE2ETopo(gridIdWork);
		}).on('click', '#btnServiceLIneInfoPop', function(e){  
			var dataObj = AlopexGrid.parseEvent(e).data;
			showServiceLIneInfoPop( gridIdWork, dataObj, "Y");
		});
    	// 회선 정보 그리드 더블클릭
        $('#'+gridId).on('dblclick', '.bodycell', function(e){
	       	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	var dataKey = dataObj._key; 
    	 	// 교환기 포트ID 수정은 작업정보에서만 되게 수정 2017-02-06
    	 	/*if(dataKey == "exchrNm" || dataKey == "exchrPortId"){
    	 		if ( dataObj._state.focused) {
    	 		var exchrParam = {"scrbSrvcMgmtNo":dataObj.scrbSrvcMgmtNo};
    			srvcPopup( "popServiceLineExchrList", '/configmgmt/cfline/ServiceLineExchrPop.do', exchrParam, 600, 400, "QDF "+cflineMsgArray['establishment']설정);
    	 		}
    	 	}else{// 상세정보팝업
    	 		showServiceLIneInfoPop( gridId, dataObj ,"N");
    	 	}*/
    	 	
//    	 	showServiceLIneInfoPop( gridId, dataObj ,"N");
//    	 	intgE2ETopo();

    	 	showServiceLineEditPop( gridId, dataObj ,"Y");
        });
        
        // [추가] 20181217 서비스회선정보 그리드 클릭
        $('#'+gridId).on('click', function(e) {
        	setGridIdBtn();
        });
   	
    	// 작업정보 그리드 더블클릭
		$('#'+gridIdWork).on('dblclick', '.bodycell', function(e){

			var dataObj = AlopexGrid.parseEvent(e).data;
//	    	 	console.log("=====================selected");
//	    	 	console.log(event);
//	    	 	console.log(dataObj._key);
//	    	 	console.log(dataObj.scrbSrvcMgmtNo);
    	 	var dataKey = dataObj._key;
    	    // 교환기 포트ID 팝업
    	 	/*if(dataKey == "exchrNm" || dataKey == "exchrPortId"){
    	 		if ( dataObj._state.focused) {
	    	 		var exchrParam = {"scrbSrvcMgmtNo":dataObj.scrbSrvcMgmtNo};
	    			srvcPopup( "popServiceLineExchrList", '/configmgmt/cfline/ServiceLineExchrPop.do', exchrParam, 600, 400, "QDF "+cflineMsgArray['establishment']설정);
    	 		}
    	 	} else*/
    	 	if ( dataKey == "pktTrkNm" && (dataObj.svlnSclCd == "020" || dataObj.svlnSclCd == "016" || dataObj.svlnSclCd == "030") ) {
    	 		if((dataObj.svlnSclCd == "016" || dataObj.svlnSclCd == "030") && (dataObj.svlnNetDivCd != '002' && dataObj.svlnNetDivCd != '004' ) ){
        	 		showServiceLineEditPop( gridIdWork, dataObj ,"Y");
    	 		} else {
    	 			if(dataObj.autoClctYn =="N"){
            	 		var param = {"vlanId" : dataObj.vlanId
	 										, "pktTrkNm" : dataObj.pktTrkNm};
            	 		pwEvcListPop(param);
    	 			}else{
    	 				showServiceLineEditPop( gridIdWork, dataObj ,"Y");
    	 			}
    	 		}
    	 	} else if(dataKey == "cotEqpNm" || dataKey == "cotUlnkLftPortNm" || dataKey == "cotUlnkRghtPortNm"  ) {
    	 		//기지국회선 : LTE
    	 		//망구분 : PTS일경우에만 COT장비등록이 활성화됨
    	 		if(dataObj.svlnNetDivCd != "002") {
    	 			showServiceLineEditPop( gridIdWork, dataObj ,"Y");
    	 		} else {
    	 			openRmEqpPortPop(gridIdWork, e);	
    	 		}
    	 			
    	 	} else if (dataKey == "rontNtwkLineNo" || dataKey == "rontTrkNm" ) {
    	 		var param = {"popFlag" : "serviceLineRontSearch"};
    	 		searchRontTrunkPop(param);
    	 	} else if (dataKey == "rnmEqpIdNm" || dataKey == "rnmPortIdNm" || dataKey == "rnmPortChnlVal" ) {  // RM장비찾기, RM포트찾기 팝업
    	 		openRmEqpPortPop(gridIdWork, e);
    	 	} else if(dataKey == "cmsId" || dataKey == "cmsBmtso") {
    	 		if(dataObj.svlnLclCdNm == "기지국회선" && (dataObj.svlnSclCdNm == "1X" || dataObj.svlnSclCdNm == "2G" || dataObj.svlnSclCdNm == "WCDMA(NODEB)" || dataObj.svlnSclCdNm == "WCDMA(IPNB)" || dataObj.svlnSclCdNm == "Wibro" || dataObj.svlnSclCdNm == "EV-DO")) {
    	 			baseMtsoPop();
    	 		}
    	 	}else{
    	 		// 상세정보팝업
//    	 		showServiceLIneInfoPop( gridIdWork, dataObj ,"Y");
//    	 		intgE2ETopo();

    	 		showServiceLineEditPop( gridIdWork, dataObj ,"Y");
	 		}
		});
		
		// 그리드 엔터시 
		$('#'+gridIdWork).on('keydown', function(e){
			var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
     		
     		var param = {"vlanId" : dataObj.vlanId
						, "pktTrkNm" : dataObj._state.editing[dataObj._column]};
     		if (e.which == 13  ){
     			if (object.mapping.key == "pktTrkNm") {
 					if ( data._state.focused) {
 						pwEvcListPop(param);
            		}
     			} else if(object.mapping.key == "cotEqpNm") {
     				if(nullToEmpty(data.cotEqpNm) == "" ) {
     					alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['equipmentName'],"","","")); /*" COT장비명은필수 입력 항목입니다.;*/
     					return false;
     				}
     				openRmEqpPortPop(gridIdWork, e);  
     				
     			} else if(object.mapping.key == "cotUlnkRghtPortNm") {
     				if(nullToEmpty(data.cotEqpId) == "" ) {
     					alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['equipmentName'],"","","")); /*" COT장비명은필수 입력 항목입니다.;*/
     					return false;
     				} 
 					if(nullToEmpty(data.cotUlnkRghtPortNm) == "" ) {
     					alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['portName']+"#2","","","")); /*" COT포트명#2은필수 입력 항목입니다.;*/
     					return false;
     				}
 					if(nullToEmpty(data.cotEqpId) != "" && nullToEmpty(data.cotUlnkRghtPortNm) != "") {
     					openRmEqpPortPop(gridIdWork, e);	
     				}
     				
     			} else if(object.mapping.key == "cotUlnkLftPortNm") {
     				if(nullToEmpty(data.cotEqpId) == "" ) {
     					alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['equipmentName'],"","","")); /*" COT장비명은필수 입력 항목입니다.;*/
     					return false;
     				}
     				if(nullToEmpty(data.cotUlnkLftPortNm) == "" ) {
     					alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['portName']+"#1","","","")); /*" COT포트명#1은필수 입력 항목입니다.;*/
     					return false;
     				} 
     				if(nullToEmpty(data.cotEqpId) != "" && nullToEmpty(data.cotUlnkLftPortNm) != "") {
     					openRmEqpPortPop(gridIdWork, e);	
     				}
     			} else {
     				openRmEqpPortPop(gridIdWork, e);     				
     			}
    		}
     	});	      			
		
		// 작업정보 그리드 클릭시
		$('#'+gridIdWork).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var selectedId = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
        	
        	if (data == null) {
        		return false;
        	}
        	
        	// 회선상태에 따른 이벤트 처리 > 해지요청중 : 편집불가능
        	// 기타_예비회선 추가 2023-11-08
			if ( data.svlnStatCd == "300" ) {
				var dataObj = object.data;
		    	var rowIndex = dataObj._index.row;
		    	
		    	if ( ( dataObj.svlnLclCd == "003" && dataObj.svlnSclCd == "101" ) || dataObj.svlnLclCd == "005" || dataObj.svlnSclCd == "061") {
		    		$('#'+gridIdWork).alopexGrid('endEdit', {_index : { row : rowIndex}});
					//return false;
		    	}
		    	else {
		    		$('#'+gridIdWork).alopexGrid('startEdit', {_index : { row : rowIndex}});
		    	}
			}
			
        	// 회선개통일자
        	if (object.mapping.key == "lineOpenDt" && object.mapping.editable == true && data.svlnStatCd !="300") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	// 회선해지일자
        	if (object.mapping.key == "lineTrmnDt" && object.mapping.editable == true && data.svlnStatCd !="300") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	// 회선해지예정일자
        	if (object.mapping.key == "lineTrmnSchdDt" && object.mapping.editable == true && data.svlnStatCd !="300") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	// 청약일자
        	if (object.mapping.key == "appltDt" && object.mapping.editable == true && data.svlnStatCd !="300") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridIdWork, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
        	// 작업정보 버튼 활성화
         	var selectedId = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
         	//DU 회선이거나, RU회선이면 활성화시키지 않는다. 추후
			//if(selectedId.length > 0 /*&& svlnLclCd != "003" && svlnSclCd != "016"*/) {
         	if(selectedId.length > 0) {
         	   // ADAMS 연동 고도화
         		if($('#mgmtGrpCd').val() == "0001" || $('#svlnLclCd').val() == "004"){
         			$('#btnLineTrmn').setEnabled(true);
    				$('#btnWorkUpdate').setEnabled(true);
    				$('#btnAllWorkInfFnsh').setEnabled(true);
    				$('#btnWorkInfFnsh').setEnabled(true);
//    				$('#btnDupMtsoMgmt').setEnabled(true);
         		}else{
         			$('#btnLineTrmn').setEnabled(false);
         			$('#btnWorkUpdate').setEnabled(false);
    				$('#btnAllWorkInfFnsh').setEnabled(false);
    				$('#btnWorkInfFnsh').setEnabled(false);
//    				$('#btnDupMtsoMgmt').setEnabled(false);
         		}
//         		$('#btnLineTrmn').setEnabled(true);
//				$('#btnWorkUpdate').setEnabled(true);
//				$('#btnAllWorkInfFnsh').setEnabled(true);
//				$('#btnWorkInfFnsh').setEnabled(true);
				
				// 20181203 회선상태 > 해지요청중 
				//if ( selectedId[i].svlnStatCd == "300" ) {
				//	setApprovalBtn(selectedId);
				//}

			}else {
		    	$('#btnLineTrmn').setEnabled(false);
				$('#btnWorkUpdate').setEnabled(false);
				$('#btnAllWorkInfFnsh').setEnabled(false);
				$('#btnWorkInfFnsh').setEnabled(false);
//				$('#btnDupMtsoMgmt').setEnabled(false);
				//$('#btnApproval').setEnabled(false);
			}
        });
		
		// 전송실 등록
		$('#btnRepeaterMgmt').on('click', function(e) {
			openRepeaterMgmt();
		});
		
		/*// 승인버튼 클릭
		$('#btnApproval').on('click', function(e) {
			delWorkInfo("trmnAprvReq");
		});*/
		
		$('#'+gridIdWork).on('cellValueEditing', function(e) {
			// 회선상태에 따른 이벤트 처리 > 해지요청중 : 편집모드에서 사용자가 해지요청중 선택 불가
			var obj = AlopexGrid.parseEvent(e);
			var dataObj = obj.data;
			
			//회선상태변경중 해지는 해지로직을 타도록 유도
			if ( obj.mapping.key == "svlnStatCd" && obj.value == "008" && obj.prevValue != "008" ) {
				alertBox("I", "해지는 그리드 상단의 해지 버튼</br>혹은 회선 선택 후 마우스 우클릭하여 표기되는 해지 메뉴를 통해 진행하시기 바랍니다.");
				$('#'+gridIdWork).alopexGrid( "cellEdit", obj.prevValue,{_index:{id: obj.data._index.id}}, "svlnStatCd");	
				$('#'+gridIdWork).alopexGrid("startEdit", {_index:{id: obj.data._index.id}} );
			}
			
			//미개통은 회선편집이 안되므로 최종다시 확인.
			if ( obj.mapping.key == "svlnStatCd" && obj.value == "100" && obj.prevValue != "100" ) {
				callMsgBox('','C', "회선 상태를 미개통으로 변경 후 저장하면 회선 및 선번편집이 불가능합니다. 변경하시겠습니까?", function(msgId, msgRst){  
		       		if (msgRst != 'Y') {
		       			$('#'+gridIdWork).alopexGrid('cellEdit', obj.prevValue, {_index:{id: obj.data._index.id}}, 'svlnStatCd');
						$('#'+gridIdWork).alopexGrid("startEdit", {_index:{id: obj.data._index.id}} );
		       		}
		       	}); 							
			}		
			
			// 20181217 분기처리
			// 기타_예비회선 추가 2023-11-08
			if ( obj.mapping.key == "svlnStatCd" && obj.value == "300" && obj.prevValue != "300" ) {
				if ( ( dataObj.svlnLclCd == "003" && dataObj.svlnSclCd == "101" ) || dataObj.svlnLclCd == "005" || ( dataObj.svlnLclCd == "006" && dataObj.svlnSclCd == "061") ) {
					alertBox("I", "해지요청중은 청약을 통해서 신청해야합니다.");
				}
				else {
					alertBox("W", "해지요청중은 RU회선, B2B회선, 중계기정합장치회선만 청약을 통해 신청 가능합니다.");
				}
				$('#'+gridIdWork).alopexGrid('cellEdit', obj.prevValue, {_index:{id: obj.data._index.id}}, 'svlnStatCd');
				$('#'+gridIdWork).alopexGrid("startEdit", {_index:{id: obj.data._index.id}} );
			}
			
			// 20181227 SKT B2B회선 관련 분기처리(서비스회선상태가 운용으로 변경될경우)
			if ( obj.mapping.key == "svlnStatCd" && dataObj.svlnLclCd == "005" && dataObj.mgmtGrpCd == "0001" && obj.value == "002" && obj.prevValue != "002" ) {
				$('#'+gridIdWork).alopexGrid("endEdit", {_index:{id: obj.data._index.id}} );
				var custNm = nullToEmpty(dataObj.b2bCustNm);
				if(custNm == ""){
					custNm = nullToEmpty(dataObj.ctrtCustNm);
				}
				var newLineNm = custNm  + "_" //b2b고객명 없는경우 계약고객명
				              + nullToEmpty(dataObj.uprMtsoIdNm) + "_" //상위국명
				              + nullToEmpty(dataObj.lowMtsoIdNm) + "_" //하위국명
				              + nullToEmpty(dataObj.svlnTypCdNm); //서비스유형명				
				
				if(getLengthB(newLineNm) > 200){
					newLineNm = cutLengthB(newLineNm, 200);
				}
				
				$('#'+gridIdWork).alopexGrid( "cellEdit", newLineNm, {_index : { row : dataObj._index.row}}, "lineNm");
				$('#'+gridIdWork).alopexGrid("startEdit", {_index:{id: obj.data._index.id}} );
				
			}
			
			// 20190104 망구성방식(링구성유형) 변경제약(직결(C)<-> Ringmux만 가능)
			if ( obj.mapping.key == "netCfgMeansCd") {
				var okYn = false;
				if (obj.value == "001" || obj.value == "002") {   // 001 직결(C), 002 Ringmux 
					if (obj.value == "001" && obj.prevValue == "002") {
						okYn = true;   // Ringmux -> 직결(C)
					} else if (obj.value == "002" && obj.prevValue == "001") {
						okYn = true;   // 직결(C) -> Ringmux
					}
				} 
				
				if (okYn == false) {
					alertBox("W", "링구성방식은 직결(C) -> Ringmux 혹은 Ringmux -> 직결(C)로만 변경 가능합니다.");
					$('#'+gridIdWork).alopexGrid('cellEdit', obj.prevValue, {_index:{id: obj.data._index.id}}, obj.mapping.key);
					$('#'+gridIdWork).alopexGrid("startEdit", {_index:{id: obj.data._index.id}} );
				}
			}			
			
		});
		// [추가] 20181217 작업전환 버튼
		$('#btnWorkCnvt').on('click', function(e) {
			workCnvt();
		});
		
		// [추가] 20181217 대표회선 설정 버튼 : RU 광코어일 때만 보이게 하기
		$('#btnSetRprtLine').on('click', function(e) {
			var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
			setRepresentationLine(data[0]);		// 대표회선설정은 한개씩만 선택해서 할 수 있다.
		});
		
        //RM조회팝업 버튼 클릭 - 20210406 $('#mgmtGrpCd').val()
        $('#btnSearchRmPath').on('click', function(e) {

        	// RM조회데이터 설정팝업
        	 $a.popup({
                popid: 'RmPathLinePop',
                title: "RM 선번조회",
        		//url: 'RmPathLineListPop.do',
        		iframe: true,
        		modal : true,
        		movable:false,
               	windowpopup : true,
        	  	url: $('#ctx').val() + '/configmgmt/cfline/RmPathLineListPop.do',
                data: {"mgmtGrpNm": $('#mgmtGrpCd option:selected').text()
                	, "svlnLclCd": $('#svlnLclCd').val()
                	, "mgmtOnrNm": "TANGO"
                	, "mtsoList" : $('#tmofCd').val()
                	}, 
                width : 1200,
                height : 900
                ,callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		//$('#btnSearch').click();
                  	}
              	}
           });
        });
     
        /**
         * 기지국회선인 경우에만 FDF구간제외 기능을 활성화한다
         * 2021-07-09 추가
         */
        $('#pathAll').on('click', function(e) { 
        	if(svlnLclCd == "001") {
		    	if ($("input:checkbox[id='pathAll']").is(":checked") ){
		    		$("#exceptFdfNeDisplayCheckbox").show();
		    	}else{
		    		$('#exceptFdfNeDisplayCheckbox').hide();
		    	}
        	} else {
        		$('#exceptFdfNeDisplayCheckbox').hide();
        	}
	    }); 
        
        /**
         * RU광코어인 경우에만 프론트홀구간보기 메뉴를 활성화한다
         * 프론트홀구간보기메뉴를 선택한 경우 전체구간보기메뉴는 비활성화시킨다.
         * 2023-11
         */
        $('#frontHaulPath').on('click', function(e) { 
	    	if(svlnLclCd == "003" && svlnSclCd == "101") {
		    	if ($("input:checkbox[id='frontHaulPath']").is(":checked") ){
		    		$("#pathAll").setEnabled(false);
		    	}else{
		    		$("#pathAll").setEnabled(true);
		    	}
	    	} else {
	    		$("#pathAll").setEnabled(true);
	    	}
        }); 
	};	
	
	// RM 장비 포트 찾기 팝업 호출, RM 선번에 전달 함수   
	function openRmEqpPortPop(gridVal, e){
		var dataObj = AlopexGrid.parseEvent(e).data;
	 	var dataKey = dataObj._key;
	 	if (dataKey == "rnmEqpIdNm" || dataKey == "cotEqpNm" ) {  // RM장비찾기 팝업
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
//    	 	console.log(dataObj);
	 		var tmpRmEqpIdNm = null;
	 		if(dataKey == "rnmEqpIdNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	 		} else if(dataKey == "cotEqpNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.cotEqpNm);
	 		}
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == ""){
	   			if(dataKey == "rnmEqpIdNm") {
	   				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/	
	   			} else if(dataKey == "cotEqpNm" && dataObj.svlnNetDivCd == '002' ) {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['equipmentName'],"","","")); /*" COT장비명은필수 입력 항목입니다.;*/
	   			}
	 			return false;
	 		}    	 		
	 		var param = {"neNm" : tmpRmEqpIdNm	
	 				, "mgmtGrpCd" : dataObj.mgmtGrpCd	//2021-11-15 장비검색을 위해서 추가
	 				};
	 		
	 		if(dataKey == "rnmEqpIdNm") {
	 			openRmEqpPop(gridVal, "rnmEqpId", "rnmEqpIdNm", "rnmPortId", "rnmPortIdNm", param);	
	 		} else if(dataKey == "cotEqpNm" && dataObj.svlnNetDivCd == '002') {
	 			openCotEqpPop(gridVal, "cotEqpId", "cotEqpNm","cotEqpMatchNm", "cotUlnkLftPortId", "cotUlnkLftPortNm","cotUlnkLftPortMatchNm","cotUlnkRghtPortId" ,"cotUlnkRghtPortNm" , "cotUlnkRghtPortMatchNm",param);
	 		}
	 	} else if (dataKey == "rnmPortIdNm" || dataKey == "cotUlnkLftPortNm" || dataKey == "cotUlnkRghtPortNm") {  // RM포트찾기 팝업
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
	 		var tmpRmEqpIdNm = null;
	 		var tmpRmEqpId = null;
	 		var searchPortNm = null;
	 		if(dataKey == "rnmPortIdNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
		 		tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
		 		searchPortNm = nullToEmpty(dataObj.rnmPortIdNm);	
	 		} else if(dataKey == "cotUlnkLftPortNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.cotEqpNm);
		 		tmpRmEqpId = nullToEmpty(dataObj.cotEqpId);
		 		searchPortNm = nullToEmpty(dataObj.cotUlnkLftPortNm);
	 		} else if(dataKey == "cotUlnkRghtPortNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.cotEqpNm);
		 		tmpRmEqpId = nullToEmpty(dataObj.cotEqpId);
		 		searchPortNm = nullToEmpty(dataObj.cotUlnkRghtPortNm);
	 		}
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == "" || tmpRmEqpId == ""){
	   			if(dataKey == "rnmPortIdNm") {
	   				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/	
	   			} else if( (dataKey == "cotUlnkLftPortNm" || dataKey == "cotUlnkRghtPortNm") && dataObj.svlnNetDivCd == '002') {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['equipmentName'],"","","")); /*" COT장비명은필수 입력 항목입니다.;*/
	   			}
	 			return false;
	 		}    	 		
	   		if(searchPortNm == ""){
	   			if(dataKey == "rnmPortIdNm") {
	   				alertBox('W', makeArgMsg('required',cflineMsgArray['rmPortNm'],"","","")); /*" RM포트명은필수 입력 항목입니다.;*/	
	   			} else if(dataKey == "cotUlnkLftPortNm" && dataObj.svlnNetDivCd == '002') {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['portName']+"#1","","","")); /*" COT포트명#1은필수 입력 항목입니다.;*/
	   			} else if(dataKey == "cotUlnkRghtPortNm" && dataObj.svlnNetDivCd == '002') {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['portName']+"#2","","","")); /*" COT포트명#2은필수 입력 항목입니다.;*/
	   			}
	 			return false;
	 		}    	 		
	 		$("#"+gridVal).alopexGrid("startEdit");
	 		if(dataKey == "rnmPortIdNm") {
	 			openRmPortPop(gridVal, "rnmPortId", "rnmPortIdNm", tmpRmEqpId, searchPortNm)
	 		} else if(dataKey == "cotUlnkLftPortNm" && dataObj.svlnNetDivCd == '002' ) {
	 			openCotPortPop(gridVal, "cotUlnkLftPortId", "cotUlnkLftPortNm", "cotUlnkLftPortMatchNm", tmpRmEqpId, searchPortNm)
	 		} else if(dataKey == "cotUlnkRghtPortNm" && dataObj.svlnNetDivCd == '002' ) {
	 			openCotPortPop(gridVal, "cotUlnkRghtPortId", "cotUlnkRghtPortNm","cotUlnkRghtPortMatchNm", tmpRmEqpId, searchPortNm)
	 		}
	 	} else if (dataKey == "rnmPortChnlVal") {  // RM 채널 
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
	 		var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	 		var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
	 		var tmpPortNm = nullToEmpty(dataObj.rnmPortIdNm);
	 		var tmpPortId = nullToEmpty(dataObj.rnmPortId);
	 		var tmpPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
//	 		console.log(dataObj);
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == "" || tmpRmEqpId == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
	   		if(tmpPortNm == "" || tmpPortId == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmPortNm'],"","","")); /*" RM포트명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
//	   		if(tmpPortChnlVal == ""){
//				alertBox('W', makeArgMsg('required',cflineMsgArray['rmChannelName'],"","","")); /*" RM채널명은필수 입력 항목입니다.;*/  
//	 			return false;
//	 		}    	
	   		showServiceLIneInfoPop( gridVal, dataObj, "Y");
	 	}
	}
    /**
     * 첨부파일 업로드 다운로드 
     */
    function openFileGridPop(GridIdWork, GridId, dataObj){
	 	var dataObjParam = "";
	 	dataObjParam = {"svlnNo":dataObj.svlnNo,"fileUladSrno":dataObj.fileUladSrno,"uladFileNm":dataObj.uladFileNm};
    	$a.popup({
    	  	popid: "popFileUpDown",
    	  	title: cflineMsgArray['attachedFile'] /*첨부파일*/,
    	  	url: $('#ctx').val() + '/configmgmt/cfline/ServiceLineAttachFilePop.do',
    		data: dataObjParam,
    		iframe: true,
			modal: false,
			movable:false,
			windowpopup : true,
    		width : 650,
    		height : 400,
    		callback:function(data){
    			if(data != null){
    				if(data == true){
    					var lastRow02 = $("#lastRow02").val();
		    			$("#firstRow02").val(1);
		    	     	$("#lastRow02").val(lastRow02);
		    			searchWorkProc(1, lastRow02, 'searchWork');
		    			var lastRow01 = $("#lastRow01").val();
		    			$("#firstRow01").val(1);
		    	     	$("#lastRow01").val(lastRow01);
		    	     	searchInfoProc(1, lastRow01, 'searchInfo');
    				}
    				//alert(rowIndex);
    				//$('#'+GridId).alopexGrid( "cellEdit", data.mtsoId, {_index : { row : rowIndex}}, mostCdId);
    				//$('#'+GridId).alopexGrid( "cellEdit", data.mtsoNm, {_index : { row : rowIndex}}, mostNmId);
    			}

				// 다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
    		}
    	}); 	
    	
    }   	
	function srvcPopup( popId, url, paramData, widthVal, heightVal, titleStr){
		var heightValue = window.innerHeight * 0.9;
		if(heightVal != null && heightVal>0){
			heightValue = heightVal;
		}
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: $('#ctx').val() + url,
			data: paramData,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				if(popId == "popServiceLineExchrList"){
					if(data != null){
			    		var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
			    		var rowIndex = focusData[0]._index.data;
						$('#'+gridIdWork).alopexGrid( "cellEdit", data.exchrPortId, {_index : { row : rowIndex}}, "exchrPortId");	
						$('#'+gridIdWork).alopexGrid( "cellEdit", data.exchrNm, {_index : { row : rowIndex}}, "exchrNm");	
					}
				}if(popId == "popServcieLineWrite"){
					//console.log(data);
					if(data != null){
						if(data.Result == "Success"){
							if(data.serviceLineVO != null){
					    		//$('#mgmtGrpCd').setSelected(data.serviceLineVO.mgmtGrpCd);
					    		//$('#svlnLclCd').setSelected(data.serviceLineVO.svlnLclCd);
					    		//$('#svlnSclCd').setSelected(data.serviceLineVO.svlnSclCd);
					    		/*alert(data.serviceLineVO.svlnLclCd);*/
					    		callMsgBox('', 'I', cflineMsgArray['saveSuccess'] /* 저장을 완료 하였습니다. */, function() {
					    			//svlnLclCd = data.serviceLineVO.svlnLclCd;
									//svlnLclCd = data.serviceLineVO.svlnLclCd;
						    		searchProc();
					    		}); 
								
							}
						} else if (data.Result == "Fail") {
							alertBox('I', cflineMsgArray['saveFail'] /* 저장을 실패 하였습니다. */); 
						}
						else{
							
						}
					}
				}

				// 다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
			}
		}); 		
	} 
	
	function srvcPopup2( popId, url, paramData, widthVal, heightVal, titleStr){
		var heightValue = window.innerHeight * 0.9;
		if(heightVal != null && heightVal>0){
			heightValue = heightVal;
		}
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: $('#ctx').val() + url,
			data: paramData,
		    //iframe: false,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				if(popId == "svlnMtsoUpdatePop"){
					if(data != null){
			    		if(data == "Success"){
			    			//alert("성공하였습니다.");
			    			callMsgBox('', 'I', cflineMsgArray['saveSuccess'], function() { /* 저장을 완료 하였습니다.*/
				    			var lastRow02 = $("#lastRow02").val();
				    			$("#firstRow02").val(1);
				    	     	$("#lastRow02").val(lastRow02);
				    			searchWorkProc(1, lastRow02, 'searchWork');
			    			});
 			    			
			    		} else if (data == "Fail") {
			    			//alert("실패하였습니다.");
			    			alertBox('W', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			    		}			    		
			    		else{
			    			
			    		}
					}
				}

				// 다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
			}
		});
	}
	
	/*
	 * 조회 함수
	 */
	function searchProc(){
//		console.log("page String  : " + getLocalTimeString());
		
		/*var tmofFullSize = $('#tmofCd option').size();
		var tmofChekedSize = nullToEmpty( $('#tmofCd').val() ).length;
		// 전송실 전체선택시 in query 속도저하 방지
		if( tmofFullSize == tmofChekedSize ){
			$('#tmofCd').val(null);
		}
		*/
		infoMaxnumber = 0;
		workMaxnumber = 0;
		$('#mtsoCd').val("");
		$("#firstRow01").val(1);
     	$("#lastRow01").val(pageForCount); // 페이징개수 
		$("#firstRow02").val(1);
     	$("#lastRow02").val(pageForCount); // 페이징개수
		$("#firstRowIndex").val(1);
     	$("#lastRowIndex").val(pageForCount); // 페이징개수
//    	var mtsoSelectData = $('#mtso').getSelectedData();
//		if (mtsoSelectData !=null && $('#mtsoCd').val() != null && $('#mtsoCd').val() != "") {
//			 $('#mtsoCd').val(mtsoSelectData.value);
//		}    
     	
     	// 링구성방식 셀렉트 박스 고정으로 submit과정에서 값이 안읽혀 풀어준후 다시고정
//    	if($('#eqpDivCd').val() != ''){
//        	$('#netCfgMeansCd').attr("disabled",false);
//    	}
    	
    	var param =  $("#searchForm").serialize();

     	// 셀렉트 박스 고정으로 submit과정에서 값이 안읽혀 풀어준후 다시고정
//    	if($('#eqpDivCd').val() != ''){
//        	$('#netCfgMeansCd').attr("disabled",true);
//    	}else{
//    		$('#netCfgMeansCd').attr("disabled",false);
//    	}

    	/**
    	 * 기지국회선의 경우에만 FDF구간 제외기능을 추가한다.
    	 * FDF구간 제외 추가 2021-07-09
    	 */
    	if(svlnLclCd == "001") {
	    	var exceptFdfNe = 'N' ;
	    	if ($("input:checkbox[id='pathAll']").is(":checked") ){
	        	if ($("input:checkbox[id='exceptFdfNe']").is(":checked") ){
	        		exceptFdfNe = 'Y'; 
	        	}
	    	}
	    	$.extend(param,{exceptFdfNe: exceptFdfNe });
    	} else {
    		$.extend(param,{exceptFdfNe: "N" });
    	}
    	
    	/**
    	 * TODO
    	 * 프론트홀보기가 선택된 경우 전체구간보기는 "" 로 변경해준다.
    	 */
    	if ($("input:checkbox[id='frontHaulPath']").is(":checked") ){
    		$.extend(param,{pathAll: "N" });
    	}
    	
		//var param =  $("#searchForm").getData(); 
    	//alert($("#searchForm"));
		//$('#'+gridId).alopexGrid('showProgress');     
    	
    	// [추가] 20181217 조회 시, 서비스회선상태가 해지이면
    	if ( $('#svlnStatCd').val() == "008" ) {
    		$('#btnWorkCnvt').setEnabled(false);		// 작업전환
    		$('#btnSetRprtLine').setEnabled(false);	// 대표회선 설정 : RU 광코어일 때만
    	}
    	cflineShowProgressBody();		
//		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicealllist', param, 'GET', 'search');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelist', param, 'GET', 'searchAllInfo');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getserviceworklist', param, 'GET', 'searchAllWork');

	}
	/*
	 * 
	 */
	function searchInfoProc(nFirstRowIndex, nLastRowIndex, searchGubun){
		$("#firstRow01").val(nFirstRowIndex);
		$("#lastRow01").val(nLastRowIndex); 
		$("#firstRowIndex").val(nFirstRowIndex);
		$("#lastRowIndex").val(nLastRowIndex);   		

    	var dataParam =  $("#searchForm").serialize(); 
    	cflineShowProgress(gridId);		
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getservicelist', dataParam, 'GET', searchGubun);		
	}
	/*
	 * 
	 */
	function searchWorkProc(nFirstRowIndex, nLastRowIndex, searchGubun){
		$("#firstRow02").val(nFirstRowIndex);
		$("#lastRow02").val(nLastRowIndex); 
		$("#firstRowIndex").val(nFirstRowIndex);
		$("#lastRowIndex").val(nLastRowIndex);   		

    	var dataParam =  $("#searchForm").serialize(); 
    	if(gridIdWorkScrollBottom){
        	cflineShowProgress(gridIdWork);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getserviceworklist', dataParam, 'GET', searchGubun);
    	}
	}
	function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'search'){
    		getGrid(svlnLclCd, svlnSclCd, response);
    		cflineHideProgressBody();
    		
    		if(response.totalCnt > 0 ){
    	    	$('#totalCntSpan').text("(" + getNumberFormatDis(response.totalCnt) + ")");
    			//$a.maskedinput(response.totalCnt,"000,000,000,000",{reverse:true});
    			$('#btnExportExcel').setEnabled(true);
    		}else{
    			$('#totalCntSpan').text("");
    			$('#btnExportExcel').setEnabled(false);
    		}    
    		if(response.totalWorkCnt > 0 ){
    	    	$('#workTotalCntSpan').text("("+getNumberFormatDis(response.totalWorkCnt)+")");
    		}else{
    			$('#workTotalCntSpan').text("");
    		}    	
    		//console.log(response);
    		
    		setSPGrid(gridId, response.ServiceLineList, response.totalCnt);
    		setSPGrid(gridIdWork, response.ServiceLineWorkList, response.totalWorkCnt);

//    		console.log("page End : " + getLocalTimeString());		
    	} 
    	if(flag == 'searchAllInfo'){
//    		console.log("page Mid searchAllInfo : " + getLocalTimeString());		
    		getGrid(svlnLclCd, svlnSclCd, response, gridId);
    		cflineHideProgressBody();
    		if(response.totalCnt > 0 ){
    			totalCnt = response.totalCnt;
    	    	$('#totalCntSpan').text("(" + getNumberFormatDis(response.totalCnt) + ")");
    			//$a.maskedinput(response.totalCnt,"000,000,000,000",{reverse:true});
    			$('#btnExportExcel').setEnabled(true);
    		}else{
    			totalCnt = 0;
    			$('#totalCntSpan').text("");
    			$('#btnExportExcel').setEnabled(false);
    		} 	
    		setSPGrid(gridId, response.ServiceLineList, response.totalCnt, response.prntCnt);

//    		console.log("page End : " + getLocalTimeString());		
    	}
    	if(flag == 'searchAllWork'){
//    		console.log("page Mid : searchAllWork " + getLocalTimeString());		
    		getGrid(svlnLclCd, svlnSclCd, response, gridIdWork);
    		if(response.totalCnt > 0 ){
    			workTotalCnt = response.totalCnt;
    	    	$('#workTotalCntSpan').text("("+getNumberFormatDis(response.totalCnt)+")");
    		}else{
    			$('#workTotalCntSpan').text("");
    		}    		
    		setSPGrid(gridIdWork, response.ServiceLineWorkList, response.totalCnt);

//    		console.log("page End : " + getLocalTimeString());		
    	}
    	if(flag == 'searchForPageAdd'){
    		cflineHideProgress(gridId);
			if(response.ServiceLineList.length == 0){
				gridIdScrollBottom = false;
				return false;
			}else{
        		getGrid(svlnLclCd, svlnSclCd, response, gridId);
	    		$('#'+gridId).alopexGrid("dataAdd", response.ServiceLineList);
//	    		$('#'+gridId).alopexGrid('updateOption',
//						{paging : {pagerTotal: function(paging) {
//							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(response.totalCnt);
//						}}}
//				);
			}
    	}
    	if(flag == 'searchWorkForPageAdd'){
    		cflineHideProgress(gridIdWork);
			if(response.ServiceLineWorkList.length == 0){
				gridIdWorkScrollBottom = false;
				return false;
			}else{
        		getGrid(svlnLclCd, svlnSclCd, response, gridIdWork);
	    		$('#'+gridIdWork).alopexGrid("dataAdd", response.ServiceLineWorkList);
//	    		$('#'+gridIdWork).alopexGrid('updateOption',
//						{paging : {pagerTotal: function(paging) {
//							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(response.totalCnt);
//						}}}
//				);
	    		//	작업 정보 편집모드 활성화
	    		$("#"+gridIdWork).alopexGrid("startEdit");
			}
    	}
    	if(flag == 'searchInfo'){
    		cflineHideProgress(gridId);
    		if(response.totalCnt > 0 ){
    	    	$('#totalCntSpan').text("("+getNumberFormatDis(response.totalCnt)+")");
    		}else{
    			$('#totalCntSpan').text("");
    		}    		
			if(response.ServiceLineList.length == 0){
				reSetGrid();
				return false;
			}else{
	    		$('#'+gridId).alopexGrid("dataSet", response.ServiceLineList);
	    		$('#'+gridId).alopexGrid('updateOption',
						{paging : {pagerTotal: function(paging) {
							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(response.totalCnt);
						}}}
				);
			}
    	}
    	if(flag == 'searchWork'){
    		cflineHideProgress(gridIdWork);
    		if(response.totalCnt > 0 ){
    	    	$('#workTotalCntSpan').text("("+getNumberFormatDis(response.totalCnt)+")");
    		}else{
    			$('#workTotalCntSpan').text("");
    		}    		
			if(response.ServiceLineWorkList.length == 0){
				reSetGrid();
				return false;
			}else{
	    		$('#'+gridIdWork).alopexGrid("dataSet", response.ServiceLineWorkList);
	    		$('#'+gridIdWork).alopexGrid('updateOption',
						{paging : {pagerTotal: function(paging) {
							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(response.totalCnt);
						}}}
				);
			}
			$("#"+gridIdWork).alopexGrid("startEdit");
    	}
    	
		// 서비스 회선에서 사용하는 대분류, 소분류, 회선유형 코드
		if(flag == 'svlnLclSclCodeData') {	
			var tmpMgmtCd = $('#mgmtGrpCd').val();
			var tmpMgmtCdNm = $('#mgmtGrpCd option:selected').text();
			svlnLclSclCodeData = response;
			var svlnLclCd_option_data =  [];
			var tmpFirstSclCd = "";
			for(i=0; i<response.svlnLclCdList.length; i++){
				var dataL = response.svlnLclCdList[i]; 
				if(i==0){
//					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
//					svlnLclCd_option_data.push(dataFst);
					tmpFirstSclCd = dataL.value;
				}
//				if(nullToEmpty(tmpMgmtCd) != "0001" || nullToEmpty(dataL.value) != "004" ){
//					svlnLclCd_option_data.push(dataL);
//				}
				if(nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataL.cdFltrgVal) || "ALL" == nullToEmpty(dataL.cdFltrgVal) ){
					svlnLclCd_option_data.push(dataL);
				}
				
			}
			$('#svlnLclCd').clear();
			$('#svlnLclCd').setData({data : svlnLclCd_option_data});
			

			var svlnSclCd_option_data =  [];
			var svlnSclCd2_option_data =  [];

			var tmpSvlnLclCd = $('#svlnLclCd').val();
			for(k=0; k<response.svlnSclCdList.length; k++){
				
				if( (response.svlnSclCdList[k].uprComCd == "005" ) && (response.svlnSclCdList[k].cdFltrgVal == "SKT") ){
					skTb2bSvlnSclCdData.push(response.svlnSclCdList[k]);
				}else if( (response.svlnSclCdList[k].uprComCd == "005" ) &&  (response.svlnSclCdList[k].cdFltrgVal == "SKB") ){
					skBb2bSvlnSclCdData.push(response.svlnSclCdList[k]);
				}
				
				if(k==0 && (tmpFirstSclCd =="005" || tmpFirstSclCd == "001")){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
					svlnSclCd_option_data.push(dataFst);
					svlnSclCd2_option_data.push(dataFst);
				}

				var dataOption = response.svlnSclCdList[k]; 

//				if(nullToEmpty(tmpMgmtCd) != "0001" || nullToEmpty(dataOption.uprComCd) != "004" ){
//					svlnSclCd_option_data.push(dataOption);
//				}	
//				if(nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataOption.cdFltrgVal) || "ALL" == nullToEmpty(dataOption.cdFltrgVal) ){
//					svlnSclCd_option_data.push(dataOption);
//				}	
				if(nullToEmpty(tmpSvlnLclCd) == nullToEmpty(dataOption.uprComCd) 
						&& ("ALL" == nullToEmpty(dataOption.cdFltrgVal) || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataOption.cdFltrgVal) )){
					svlnSclCd_option_data.push(dataOption);
				}
				
				svlnSclCd2_option_data.push(dataOption);
				
			}		
			svlnSclCdData = svlnSclCd2_option_data;	
			$('#svlnSclCd').clear();
			$('#svlnSclCd').setData({data : svlnSclCd_option_data});	
			
			reSetGrid();
		 	//임차회선포함 체크박스 제어
		 	leslDisplayProc("svlnLclCd", "svlnSclCd");
		 	
		 	if( ($('#mgmtGrpCd').val() == "0001" ) && ($('#svlnLclCd').val() == "005")) {
		 		$("#nitsCisConn").setEnabled(true);
		 	} else {
		 		$("#nitsCisConn").setEnabled(false);
		 	}
/*		 	console.log("b2b회선확인");
		 	console.log(skTb2bSvlnSclCdData);
		 	console.log("b2b회선확인2");
		 	console.log(skBb2bSvlnSclCdData);
		 	console.log("b2b회선확인3");*/
		 	
			// 서비스회선유형코드 셋팅
			svlnTypCdListCombo = response.svlnTypCdListCombo;
			var dataFst = {"value":"","text":cflineCommMsgArray['select']};
			for(i=0; i<response.svlnSclCdList.length; i++){
				var tmpSvlnSclCd = response.svlnSclCdList[i].value;
				var option_data =  [];
				option_data = svlnTypCdListCombo[tmpSvlnSclCd];
				option_data.unshift(dataFst);	
				eval("$.extend(svlnTypCombo,{'" + tmpSvlnSclCd + "' : option_data})");		 // 서비스회선유형코드	
			}			
			
			//$('#btnApproval').hide();
			//setApprovalBtn();
			
			//RM조회 버튼 제어 - 2021-04-06
			if($('#mgmtGrpCd').val() == '0001' && $('#svlnLclCd').val() == '001'){
				$('#btnSearchRmPath').setEnabled(true);
			} else {
				$('#btnSearchRmPath').setEnabled(false);
			}
			
		} 
		// 서비스 회선에서 사용하는 코드
		if(flag == 'svlnCommCodeData') {
			
			var tmpCmCodeData =  JSON.parse(JSON.stringify(response));

			var dataFst = {"value":"","text":cflineCommMsgArray['select']};
//			var dataMandatory = {"value":"","text":cflineCommMsgArray['mandatory']};
			var option_data =  [];
			option_data = tmpCmCodeData.svlnStatCdList;
			option_data.unshift(dataFst);

//			cmCodeData = {"svlnStatCdList":option_data};  // 서비스회선상태
			$.extend(cmCodeData,{"svlnStatCdList":option_data});		 // 서비스회선상태
			option_data =  [];
			option_data = tmpCmCodeData.lineUsePerdTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineUsePerdTypCdList":option_data});		 // 회선사용기간유형	
			option_data =  [];
			option_data = tmpCmCodeData.svlnCapaCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"svlnCapaCdList":option_data});		 // 회선용량	
			option_data =  [];
			option_data = tmpCmCodeData.ynList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"ynList":option_data});		 // 예,아니오
			option_data =  [];
			option_data = tmpCmCodeData.lineDistTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineDistTypCdList":option_data});		 // 회선거리유형
			option_data =  [];
			option_data = tmpCmCodeData.lineSctnTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineSctnTypCdList":option_data});		 // 회선구간유형
			option_data =  [];
			option_data = tmpCmCodeData.chrStatCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"chrStatCdList":option_data});		 // 과금상태
			
			/*회선관리그룹 SKT SKB 나눔*/
			option_data =  [];
			option_data = tmpCmCodeData.lineMgmtGrCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineMgmtGrCdList":option_data});		 // 회선관리등급
			var skt_LineMgmtGrCd = [] ;
			var skb_LineMgmtGrCd = [] ;
			var skt_LineMgmtGrCdSearch = [] ;
			var skb_LineMgmtGrCdSearch = [] ;
			for(var i=1; i<tmpCmCodeData.lineMgmtGrCdList.length; i++){
				if(tmpCmCodeData.lineMgmtGrCdList[i].cdFltrgVal == "ALL" ||tmpCmCodeData.lineMgmtGrCdList[i].cdFltrgVal == "SKT"){
					skt_LineMgmtGrCd.push(tmpCmCodeData.lineMgmtGrCdList[i]);
					skt_LineMgmtGrCdSearch.push(tmpCmCodeData.lineMgmtGrCdList[i]);
				}
				skb_LineMgmtGrCd.push(tmpCmCodeData.lineMgmtGrCdList[i]);
				skb_LineMgmtGrCdSearch.push(tmpCmCodeData.lineMgmtGrCdList[i]);
			}
			
			$.extend(response,{"lineMgmtGrCdListSKT":skt_LineMgmtGrCdSearch});
			$.extend(response,{"lineMgmtGrCdListSKB":skb_LineMgmtGrCdSearch});
			skt_LineMgmtGrCd.unshift(dataFst);
			skb_LineMgmtGrCd.unshift(dataFst);
			$.extend(cmCodeData,{"lineMgmtGrCdListSKT":skt_LineMgmtGrCd});
			$.extend(cmCodeData,{"lineMgmtGrCdListSKB":skb_LineMgmtGrCd});
			
			option_data =  [];
			option_data = tmpCmCodeData.ogicCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"ogicCdList":option_data});		 // OG/IC
			

			option_data =  [];
			option_data = tmpCmCodeData.lesTypeCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lesTypeCdList":option_data});		 // 임차유형
			option_data =  [];
			option_data = tmpCmCodeData.svlnB2bCapaCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"svlnB2bCapaCdList":option_data});		 // B2B 서비스회선 용량
			option_data =  [];
			option_data = tmpCmCodeData.llcfCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"llcfCdList":option_data});		 // 국사LLCF
			option_data =  [];
			option_data = tmpCmCodeData.negoCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"negoCdList":option_data});		 // 국사NEGO
			option_data =  [];
			option_data = tmpCmCodeData.mgmtPostCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"mgmtPostCdList":option_data});		 // 관리포스트
			option_data =  [];
			option_data = tmpCmCodeData.cdngMeansTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"cdngMeansTypCdList":option_data});		 // 코딩방식유형
			option_data =  [];
			option_data = tmpCmCodeData.coLineCostVrfRsnCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"coLineCostVrfRsnCdList":option_data});		 // 비대상사유
			
			// 20181228 RU회선_광코어 망구성방식코드 추가
			option_data =  [];
			option_data = tmpCmCodeData.netCfgMeansCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"netCfgMeansCdList":option_data});		 // 망구성방식코드
			
			option_data =  [];
			option_data = tmpCmCodeData.bkbnCommBizrCdList;
			option_data.unshift(dataFst);
			$.extend(cmCodeData,{"bkbnCommBizrCdList":option_data});		 // 백본통신사업자코드
			
//			cmCodeData.push(tmpCmCodeData);
			svlnCommCodeData = response;
			makeSearchFormByMgmt('svlnLclCd', 'svlnSclCd', svlnSclCdData);
//			console.log(svlnCommCodeData);
//			console.log(cmCodeData);
		} 
		// 작업전환
		if(flag == 'workCnvtResult'){
    		if(response.Result == 'Success'){ 
    			var msgStr = "";
    			if(response.ussWorkList != null && response.ussWorkList.length>0){

    				for(k=0; k<response.ussWorkList.length; k++){
    					var dataResultList = response.ussWorkList[k];  
    					if(k==0){
    						msgStr = dataResultList.lineNm;
    					}else{
    						msgStr += "," + dataResultList.lineNm;
    					}
    				}
    			}
//    			if(msgVal == ""){
//    				msgStr = "(" + response.cnt + ")";
//    			}else{
//    				msgStr = msgVal + "<br>" + "(" + response.cnt + ")";
//    			}
//    			alertBox('I', makeArgMsg('processed',msgStr,"","","")); /* ({0})건 처리 되었습니다. */	
    			
    			
    			msgStr = makeArgCommonMsg2('lineCountProc', response.tCnt, response.sCnt)
		          + "<br>" + makeArgCommonMsg2('lineCountTotal', response.tCnt, null)
		          + "<br>" + makeArgCommonMsg2('lineCountAuth', response.aCnt, null)
		          + "<br>" + makeArgCommonMsg2('lineCountWork', response.wCnt, null)
		          + "<br>" + makeArgCommonMsg2('lineCountSuccess', response.sCnt, null);

    			/* ({0})건 처리 되었습니다. */
    			callMsgBox('', 'I', msgStr, function() {
    				var lastRow01 = $("#lastRow01").val();
    				$("#firstRow01").val(1);
    		     	$("#lastRow01").val(lastRow01);
    		     	searchInfoProc(1, lastRow01, 'searchInfo');    			
    				
    				var lastRow02 = $("#lastRow02").val();
    				$("#firstRow02").val(1);
    		     	$("#lastRow02").val(lastRow02);
    				searchWorkProc(1, lastRow02, 'searchWork');    	
    			});

    		}else if(response.Result == 'NODATA'){ 
    			//alert('변경할 데이터가 없습니다.'); 
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			//alert('실패 하였습니다.'); 
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
				
		}
		// 회선복원 
		if(flag == 'lineRestorationResult'){
			cflineHideProgressBody();
    		if(response.Result == 'Success'){ 
				
				// FDF사용정보 전송
				sendFdfUseInfo("B");
				
    			var msgStr = "";
    			if(response.ussWorkList != null && response.ussWorkList.length>0){

    				for(k=0; k<response.ussWorkList.length; k++){
    					var dataResultList = response.ussWorkList[k];  
    					if(k==0){
    						msgStr = dataResultList.lineNm;
    					}else{
    						msgStr += "," + dataResultList.lineNm;
    					}
    				}
    			}
//    			if(msgVal == ""){
//    				msgStr = "(" + response.cnt + ")";
//    			}else{
//    				msgStr = msgVal + "<br>" + "(" + response.cnt + ")";
//    			}
//    			alertBox('I', makeArgMsg('processed',msgStr,"","","")); /* ({0})건 처리 되었습니다. */	
    			
    			
    			msgStr = makeArgCommonMsg2('lineCountRestoration', response.tCnt, response.sCnt);
    			
    			// RU회선_광코어
				if ($('#svlnLclCd').val() == '003'  && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101') && response.sCnt > 0) {
					// 망 구성방식 코드 업데이트
					var ruParam = {
							"lineNoStr" : netCfgMeansSvlnNo
						  , "editType"  : "B"
					}
					setRuNetCfgMeans(ruParam);
				}

    			/* ({0})건 처리 되었습니다. */
    			callMsgBox('', 'I', msgStr, function() {
    				var lastRow01 = $("#lastRow01").val();
    				$("#firstRow01").val(1);
    		     	$("#lastRow01").val(lastRow01);
    		     	searchInfoProc(1, lastRow01, 'searchInfo');   	
    			});

    		}else if(response.Result == 'NODATA'){ 
    			//alert('변경할 데이터가 없습니다.'); 
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			//alert('실패 하였습니다.'); 
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
				
		}
		// RU-광코어로 이동 
		if(flag == 'updateLclSclResult'){
    		if(response.Result == 'Success'){ 

				// FDF사용정보 전송
				sendFdfUseInfo("B");
				
				// RU회선_광코어
				if ($('#svlnLclCd').val() == '003'  && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101') && response.sCnt > 0) {
					// 망 구성방식 코드 업데이트
					var ruParam = {
							"lineNoStr" : netCfgMeansSvlnNo
						  , "editType"  : "B"
					}
					setRuNetCfgMeans(ruParam);
				}
				
    			var msgStr = "";
    			if(response.ussWorkList != null && response.ussWorkList.length>0){

    				for(k=0; k<response.ussWorkList.length; k++){
    					var dataResultList = response.ussWorkList[k];  
    					if(k==0){
    						msgStr = dataResultList.lineNm;
    					}else{
    						msgStr += "," + dataResultList.lineNm;
    					}
    				}
    			}
    			
    			msgStr = makeArgCommonMsg2('lineCountRestoration', response.tCnt, response.sCnt);

    			/* ({0})건 처리 되었습니다. */
    			callMsgBox('', 'I', msgStr, function() {
    				var lastRow01 = $("#lastRow01").val();
    				$("#firstRow01").val(1);
    		     	$("#lastRow01").val(lastRow01);
    		     	searchInfoProc(1, lastRow01, 'searchInfo');     			
    				
    				var lastRow02 = $("#lastRow02").val();
    				$("#firstRow02").val(1);
    		     	$("#lastRow02").val(lastRow02);
    				searchWorkProc(1, lastRow02, 'searchWork');   	
    			});

    		}else if(response.Result == 'NODATA'){ 
    			//alert('변경할 데이터가 없습니다.'); 
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			//alert('실패 하였습니다.'); 
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
				
		}
		
		
		if(flag == 'excelDownload') {
			cflineHideProgressBody();
//			console.log('excelCreate');
//    		console.log(response);
    		
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
    	}
		if(flag == 'excelBatchExecute') {
	   		
    		if(response.returnCode == '200'){ 
    				
    			jobInstanceId  = response.resultData.jobInstanceId;
    			cflineHideProgressBody();
    			$('#excelFileId').val(response.resultData.jobInstanceId );
    			excelCreatePop(jobInstanceId);
    		}
    		else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
		
		//해지
		if(flag == 'delWorkInfo') {
//			console.log(response);
			cflineHideProgressBody();
			if (nullToEmpty(response.Result) == "Success") {
				
				// FDF사용정보 전송
				if (response.upCount > 0) {
					// FDF정보 GIS쪽에 전송
					sendFdfUseInfo("C");
					/* 2018-08-13 해지된 회선 중 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
					var acceptParam = {
							 lineNoStr : procAcceptTargetList
						   , topoLclCd : ""
						   , linePathYn : "Y"
						   , editType : "C"   // 해지
						   , excelDataYn : "N"
					}
					extractAcceptNtwkLine(acceptParam);
					
					// RU회선_광코어
					if ($('#svlnLclCd').val() == '003'  && ($('#svlnSclCd').val() == '' || $('#svlnSclCd').val() == '101')) {
						// 망 구성방식 코드 업데이트
						var ruParam = {
								"lineNoStr" : netCfgMeansSvlnNo
							  , "editType"  : "B"
						}
						setRuNetCfgMeans(ruParam);
					}

				}

				var returnMsg = makeArgMsg('processed', response.upCount ,"","","");
				
				if (nullToEmpty(response.usedLineNo) != "") {
					returnMsg =  returnMsg + "<br><br>"
					           + "[ " + response.usedLineNo + " ]<br>"
					           + "은 수용목록이 존재하여 해지할 수 없습니다.";
				}
				
				/*if (nullToEmpty(response.statLineNo) != "") {
					returnMsg =  returnMsg + "<br><br>"
					           + "[ " + response.statLineNo + " ]<br>"
					           + "은 해지요청중이 아니기 때문에 승인할 수 없습니다.";
				}*/
				
				if (nullToEmpty(response.schdLineNo) != "") {
					/* 20181214 변경 : 해지승인은 철거요청일 [2018/12/20] 이후에 승인 가능 합니다.  */
					returnMsg =  returnMsg + "<br><br>"
					           + "[ " + response.schdLineNo + " ]<br>"
					           + " 승인/해지는 철거요청일 이후에 승인/해지 가능합니다.";
				}
				
				if (nullToEmpty(response.noTrmnLineNo) != "") {
					returnMsg =  returnMsg + "<br><br>"
			           + "[ " + response.noTrmnLineNo + " ]<br>"
			           + "해지요청중인 건은 승인을 통해 해지 가능합니다.";
				}
				
				callMsgBox('', 'I', returnMsg, function() {  /* ({0})건 처리 되었습니다. */
					searchProc();					

					// 서비스회선을 사용하는 수용네트워크가 있는경우 해당 목록을 보여준다
					if (nullToEmpty(response.usedLineNo) != "") {
						var chkNtwkLine = response.usedLineNo.split(",");
						var param = {
										"ntwkLineNoList":chkNtwkLine
									  , "topoLclCd":null
									  , "topoSclCd":null
									  , "title" : cflineMsgArray['acceptLine']+cflineMsgArray['list']
									  , "callType":"UL"   // US : 서비스회선 수용목록 조회
						            };
						$a.popup({
								popid: "UsingInfoPop",
								title: cflineMsgArray['acceptLine']+cflineMsgArray['list']  /*수용회선목록*/,
								url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
								data: param,
								iframe: true,
								modal: true,
								movable:true,
							    windowpopup : true,
								width : 1200,
								height : 650,
								callback:function(data){
							    	//fnSearch("A", true);
							    }
							});
					}
				});	    		
			}
		}
		//작업정보저장
		if(flag == 'workUpdate' ){
			if (response.Result == "Success") {
				
				// FDF사용정보 전송
				sendFdfUseInfo("B");
				
				if(response.upCountMsg != undefined) {
					callMsgBox('', 'I', makeArgMsg('processedStatCd', response.upCount , response.upCountMsg,"",""), function() { /* ({0})건 처리 되었습니다.<br>{1} */
						searchProc();
					});
				} else {
					callMsgBox('', 'I', makeArgMsg('processed', response.upCount ,"","",""), function() { /* ({0})건 처리 되었습니다. */
						searchProc();
					});
				}
				
			} else {
				alertBox('', 'I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			}
			
		}
		//작업정보완료 || 모든작업정보완료
		if(flag == 'workInfFnsh'){
			if (response.Result == "Success") {
				
				// FDF사용정보 전송
				sendFdfUseInfo("B");
				
				if(response.upCountMsg != undefined) {
					callMsgBox('', 'I', makeArgMsg('processedStatCd', response.upCount , response.upCountMsg,"",""), function() { /* ({0})건 처리 되었습니다.<br>{1} */
						searchProc();
					});
				} else {
					callMsgBox('', 'I', makeArgMsg('processed', response.upCount ,"","",""), function() { /* ({0})건 처리 되었습니다. */
						searchProc();
					});
				}
			} else {
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			}    		
		}
		
		// RU 광코어 : 관리 본부, 팀, 전송실 조회
		if( flag == 'getMgmtBonbuTeam' ) {
			mgmtOrgData = response;
			makeSearchFormByMgmt('svlnLclCd', 'svlnSclCd', svlnSclCdData);
		}
		
		// RU 광코어 : 장비구분데이터셋팅
    	if(flag == 'EqpDivData'){
    		var gridEqpDivData = [];
			for(var i=0; i<response.EqpDivData.length; i++){
				EqpDivData.push({value: response.EqpDivData[i].eqpDivCd, text : response.EqpDivData[i].eqpDivNm});
    		}
    	}
    		
	}
    
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'search'){
    		cflineHideProgressBody();
    		//alert('조회 실패하였습니다.');
    		alertBox('W', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'searchAllInfo'){
    		cflineHideProgressBody();
    		//alert('조회 실패하였습니다.');
    		alertBox('W', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'searchForPageAdd'){
    		//$('#'+gridId).alopexGrid('hideProgress');
    		cflineHideProgress(gridId);
    		//alert('조회 실패하였습니다.');
    		alertBox('W', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'searchWorkForPageAdd'){
    		//$('#'+gridId).alopexGrid('hideProgress');
    		cflineHideProgress(gridIdWork);
    		//alert('조회 실패하였습니다.');
    		alertBox('W', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
		if(flag == 'excelDownload') {
			cflineHideProgressBody();
		}
    	if(flag == 'lineRestorationResult'){
        	cflineHideProgressBody();
    		alertBox('W', cflineCommMsgArray['failChange']); /* 변경 실패 */
    	}
    	if(flag == 'updateLclSclResult'){
    		alertBox('W', cflineCommMsgArray['failChange']); /* 변경 실패 */
    	}
    	if (flag == "delWorkInfo") {
    		alertBox('W', cflineCommMsgArray['failChange']); /* 변경 실패 */
    		cflineShowProgressBody();
    	}

    }
    
    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['frstRegDate','frstRegUserId','lastChgDate','lastChgUserId'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
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
    
    function setSPGrid(GridID , Data, totalCnt, prntCnt) {
		$('#'+GridID).alopexGrid("dataSet", Data);
		$('#'+GridID).alopexGrid('updateOption',
				{paging : {pagerTotal: function(paging) {
					if(totalCnt > 0){
						if(GridID == gridId && ( Data[0].svlnSclCd == "016" || Data[0].svlnSclCd == "103"  || Data[0].svlnSclCd == "030") ){
							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' :  ' + getNumberFormatDis(prntCnt) + makeArgMsg('detailCnt', getNumberFormatDis(totalCnt), "","","");
						} else {
							return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(totalCnt);	
						}
					}else{
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(totalCnt);
					}
				}}}
		); 
		//	작업 정보 편집모드 활성화
		$("#"+gridIdWork).alopexGrid("startEdit");
	}
    //구선번 편집 팝업
    function showServiceLineEditPop(gridId, dataObj, sFlag){
		var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do';
		var width = 1500;
//		var height = 940;
		var height = 780;
				
		var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
		if (lineLnoGrpSrno == undefined){
			lineLnoGrpSrno =null;
		}
		
		var autoClctYn = dataObj.autoClctYn;
		if (autoClctYn == undefined){
			autoClctYn =null;
		}
		

		var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
		var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
		var tmpPortId = nullToEmpty(dataObj.rnmPortId);
		var tmpPortIdNm = nullToEmpty(dataObj.rnmPortIdNm);
		var tmpPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
		//서비스회선의 ADAMS 관리주체키 설정 - 2020.04.14
		var mgmtOnrNm =  (typeof dataObj.mgmtOnrNm == "undefined" ? "TANGO": dataObj.mgmtOnrNm);
		var paramData = {
							"gridId" : gridId
							, "ntwkLineNo" : dataObj.svlnNo
							, "svlnLclCd" : dataObj.svlnLclCd
							, "svlnLclCdNm" : dataObj.svlnLclCdNm
							, "svlnSclCd" : dataObj.svlnSclCd
							, "sFlag" : sFlag
							, "ntwkLnoGrpSrno" : lineLnoGrpSrno
							, "mgmtGrpCd" : dataObj.mgmtGrpCd 
							, "rnmEqpId" : tmpRmEqpId 
							, "rnmEqpIdNm" : tmpRmEqpIdNm 
							, "rnmPortId" : tmpPortId 
							, "rnmPortIdNm" : tmpPortIdNm 
							, "rnmPortChnlVal" : tmpPortChnlVal 
							, "autoClctYn" : autoClctYn 
							, "mgmtOnrNm":mgmtOnrNm
						};
		
		$a.popup({
			popid: "ServiceLineEditPop",
//			popid: "ServiceLIneInfoPop",
			title: cflineMsgArray['serviceLineDetailInfo'] /*서비스회선상세정보*/,
			url: url,
			//data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":sFlag},
			data: paramData,
			iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
//			height : window.innerHeight * 0.91
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
    }
    
    // 1. [수정] RM선번편집 창 자동열기
    function openRmLinePop(dataObj) {
		url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPopNew.do';
		width = 1400;
		height = 940;
		
		var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
		if (lineLnoGrpSrno == undefined){
			lineLnoGrpSrno =null;
		}
				
		var rnmEqpId = nullToEmpty(dataObj.rnmEqpId);
		var rnmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
		var rnmPortId = nullToEmpty(dataObj.rnmPortId);
		var rnmPortIdNm = nullToEmpty(dataObj.rnmPortIdNm);
		var rnmPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
				
		var paramData = {
							"gridId" : gridIdWork
							, "ntwkLineNo" : dataObj.svlnNo
							, "svlnLclCd" : dataObj.svlnLclCd
							, "svlnSclCd" : dataObj.svlnSclCd
							, "sFlag" : "Y"
							, "ntwkLnoGrpSrno" : lineLnoGrpSrno
							, "mgmtGrpCd" : dataObj.mgmtGrpCd 
							, "rnmEqpId" : rnmEqpId 
							, "rnmEqpIdNm" : rnmEqpIdNm 
							, "rnmPortId" : rnmPortId 
							, "rnmPortIdNm" : rnmPortIdNm 
							, "rnmPortChnlVal" : rnmPortChnlVal 
						};
		// RM선번편집 직접호출여부
		paramData.rmEditYn = "Y";
		
		
		$a.popup({
			popid: "ServiceLineInfoPopNew",
			title: "서비스회선 시각화" /*서비스회선상세정보*/,
			url: url,
			data: paramData,
			iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
//			height : window.innerHeight * 0.91
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
    }
    
    
// common.js에 같은 함수 명이 있었어 주석처리 함 2017-12-06    
//  	// 서비스 회선 정보 팝업 
//	function showServiceLIneInfoPop( gridId, dataObj, sFlag) {
////		var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do';
//		var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoDiagramPop.do';
//		var width = 1400;
//		var height = 940;
//		
//		if(dataObj.svlnLclCd =="001" && dataObj.svlnSclCd == "020"){
//			url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineIpTransLineInfoPop.do';
//			width = 1000;
//			height = 300;
//		}
//		var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
//		if (lineLnoGrpSrno == undefined){
//			lineLnoGrpSrno =null;
//		}
//		console.log(dataObj);
//		// RM 관련 변수 추가 2017-12-04
// 		var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
// 		var tmpPortId = nullToEmpty(dataObj.rnmPortId);
// 		var tmpPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
//		var paramData = {
//							"gridId" : gridId
//							,"ntwkLineNo" : dataObj.svlnNo
//							,"svlnLclCd" : dataObj.svlnLclCd
//							,"svlnSclCd" : dataObj.svlnSclCd
//							,"sFlag" : sFlag
//							, "ntwkLnoGrpSrno" : lineLnoGrpSrno
//							, "mgmtGrpCd" : dataObj.mgmtGrpCd 
//							, "rnmEqpId" : tmpRmEqpId 
//							, "rnmPortId" : tmpPortId 
//							, "rnmPortChnlVal" : tmpPortChnlVal 
//						};
//		$a.popup({
//			popid: "ServiceLineDiagramPop",
//			title: cflineMsgArray['serviceLineDetailInfo'] /*서비스회선상세정보*/,
//			url: url,
//			//data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":sFlag},
//			data: paramData,
//			iframe: true,
//			modal : false,
//			movable:true,
//			windowpopup : true,
//			width : width,
////			height : window.innerHeight * 0.91
//			height : height
//			,callback:function(data){
//				if(data != null){
//					//alert(data);
//				}
//			}
//		});
//    }
//	
	// 그리드 편집모드시 달력
    function datePicker(gridId, cellId, rowIndex, keyValue){
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		var insertDate = dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
    		$('#' + gridId + '').alopexGrid("cellEdit", insertDate, {_index : { row : rowIndex }}, keyValue);
		}
    	);
    }
    
    // E2E 토폴로지 팝업창 오픈
    function intgE2ETopo(pGridId) {
    	var focusData = $('#'+pGridId).alopexGrid("dataGet", {_state : {focused : true}});
    	window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=SRVN&searchId=' + focusData[0].svlnNo + '&searchNm=' + focusData[0].lineNm);
    }
    
    // 작업전환
    function workCnvt() {
	 	//tango transmission biz 모듈을 호출하여야한다.
		 //$a.navigate($('#ctx').val()+'/configmgmt/common/DupMtsoMgmt.do');
		 
		if( $('#'+gridId).length == 0) return;  // 그리드가 존재하지 않는 경우
		var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		var paramDataList = [];
		msgVal = "";
		if (dataList.length > 0 ){
			for(k=0; k<dataList.length; k++){
//				if(dataList[k].svlnWorkYn == "N"){	
//					paramDataList.push({ "svlnNo":dataList[k].svlnNo , "tmpIndex":dataList[k]._index.row });
//					dataList[k].svlnWorkYn = "Y";
//					//$('#'+gridId).alopexGrid('color', {_index:{row:dataList[k]._index.row}},'red');
//
//				}else{
//					if(msgVal==""){
//						msgVal = dataList[k].lineNm;
//					}else{
//						msgVal += "," + dataList[k].lineNm;
//						// if(data['svlnWorkYn'] == 'Y') return {color:'red'} // background:'orange',
//						 //$('#'+gridId).alopexGrid('updateOption', {color:'red'});
//					}					
//				}

				paramDataList.push({ "svlnNo":dataList[k].svlnNo , "svlnWorkMgmtYn":dataList[k].svlnWorkMgmtYn , "svlnWorkYn":dataList[k].svlnWorkYn , "tmpIndex":dataList[k]._index.row });
//				dataList[k].svlnWorkYn = "Y";			
			}

	       	/* confirm("작업전환 하시겠습니까?") */
	       	//callMsgBox('','C', cflineMsgArray['workConvertOk'], function(msgId, msgRst){  
	       	//	if (msgRst == 'Y') {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updatemtsollnoinsprogstat', paramDataList, 'POST', 'workCnvtResult');
	    			if(msgVal != null && msgVal != ""){
	    				msgVal =  cflineMsgArray['lnNm']/*회선명*/ + makeArgMsg('preRegistration',"[" + [msgVal] + "]","","","")/* {0}는(은) 이미 작업정보로 등록되었습니다. */;
	    			}	
	       	//	}
	       	//});  				
		}else{
			//alert("작업전환할 데이터를 선택하세요.");
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
		}
    }
    
    //회선복원 
    function lineRestoration(){

    	// FDF 사용정보 
    	fdfUsingInoLineNo = "";
    	// 망구성방식코드
    	netCfgMeansSvlnNo = "";
    	
		if( $('#'+gridId).length == 0) return;  // 그리드가 존재하지 않는 경우
		var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		var paramDataList = [];
		msgVal = "";
		if (dataList.length > 0 ){
			for(k=0; k<dataList.length; k++){
				paramDataList.push({ "svlnNo":dataList[k].svlnNo, "tmpIndex":dataList[k]._index.row });
				
				// FDF 사용정보 
		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[k].svlnNo + ",";
		    	netCfgMeansSvlnNo += dataList[k].svlnNo + ",";
			}

	    	cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updatelinerestoration', paramDataList, 'POST', 'lineRestorationResult');
			if(msgVal != null && msgVal != ""){
				msgVal =  cflineMsgArray['lnNm']/*회선명*/ + makeArgCommonMsg2('alreadyRestoration',"[" + [msgVal] + "]")/* {0}는(은) 이미 복원되었습니다. */;
			}			
		}else{
			//alert("작업전환할 데이터를 선택하세요.");
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
		}
    }
    
    //서비스회선 대소분류 변경(구 NITS회선 --> 광코어) 
    function updateLclScl(){
		if( $('#'+gridId).length == 0) return;  // 그리드가 존재하지 않는 경우
		var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		var paramDataList = [];

		if (dataList.length > 0 ){

	    	// FDF 사용정보 
	    	fdfUsingInoLineNo = "";
	    	netCfgMeansSvlnNo = "";
	    	
			for(k=0; k<dataList.length; k++){
				paramDataList.push({ "svlnNo":dataList[k].svlnNo, "tmpIndex":dataList[k]._index.row });				

				// FDF 사용정보 
		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[k].svlnNo + ",";
		    	// 망구성방식코드
		    	netCfgMeansSvlnNo = netCfgMeansSvlnNo + dataList[k].svlnNo + ",";
			}

			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updatelinelclscl', paramDataList, 'POST', 'updateLclSclResult');
		
		}else{
			//alert("작업전환할 데이터를 선택하세요.");
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
		}
    }
    
    // 작업정보해지
    function delWorkInfo() {
    	if( $('#'+gridIdWork).length == 0) return;
		$('#'+gridIdWork).alopexGrid('endEdit', {_state:{editing:true}});
		var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
		var paramUsing = null;
		var paramList = [];
		var svlnNoList = "";		// 사용자가 해지승인에 대한 권한이 없을 때 해지요청중인 건인 회선을 담는 리스트
		var appltNoList = "";		// 청약번호가 존재하는 회선을 담는 리스트
		var optlShreSvlnList = "";  // 광공유모듈의 대표회선
		if ( dataList.length > 0 ) {
			for ( var i = 0; i < dataList.length; i++ ) {
				// 체크1. 해지요청건인 회선 체크
				if ( dataList[i].svlnStatCd == "300" ) {
					// 체크1-1. 권한이 있는 경우
					if ( $('#chkAprv').val() == "Y" ) {
						if ( (dataList[i].svlnLclCd == "003" && dataList[i].svlnSclCd == "101")  || dataList[i].svlnLclCd == "005" || ( dataList[i].svlnLclCd == "006" && dataList[i].svlnSclCd == "061") ) {
							dataList[i].lineAprvWorkDivVal = "T";
						}
						else {
							alertBox("I", "승인해지는 RU 광코어, B2B회선, 기타 중계기정합장치회선만 가능합니다.");
							return;
						}
						paramList.push(dataList[i]);
					}
					// 체크1-2. 권한이 없는 경우
					else if ( $('#chkAprv').val() == "N" ) {
						svlnNoList += dataList[i].svlnNo + ", ";
					}
				}
				// 체크2. 해지요청이 아닌 나머지 회선상태의 경우
				else {
					
					// 광공유모듈의 대표회선
					if (dataList[i].svlnLclCd == "003" && dataList[i].svlnSclCd == "101" 
					     && nullToEmpty(dataList[i].optlShreRepSvlnNo) == nullToEmpty(dataList[i].svlnNo) 
					     && nullToEmpty(dataList[i].optlShreCnt) > 0) 
					{
						optlShreSvlnList += dataList[i].svlnNo + ", ";
					}
					// 청약번호가 존재하는 경우(20190103 - 청약측 해지요청건 처리가 되면 해당 주석 제거)
					/*else if (nullToEmpty(dataList[i].lineAppltNo) != '' 
						&& ( (dataList[i].svlnLclCd == "003" && dataList[i].svlnSclCd == "101")  
							  || dataList[i].svlnLclCd == "005" 
							  || ( dataList[i].svlnLclCd == "006" && dataList[i].svlnSclCd == "061" ) )
					   ) {
						appltNoList += dataList[i].svlnNo + ", ";
					}*/ 
					// 그외
					else {
						paramList.push(dataList[i]);
					}
				}
			}
			
	    	fdfUsingInoLineNo = "";			// FDF 사용정보
	    	procAcceptTargetList = "";		// 자동수정대상건
	    	netCfgMeansSvlnNo = "";
	    	
			for( var i = 0; i < paramList.length; i++ ) {
		    	fdfUsingInoLineNo = fdfUsingInoLineNo + paramList[i].svlnNo + ",";
		    	procAcceptTargetList = procAcceptTargetList + paramList[i].svlnNo + ",";
		    	netCfgMeansSvlnNo += paramList[i].svlnNo + ",";
			}
			
			paramUsing = {"serviceLineList":paramList};
			
			if ( dataList.length > 0 ) {
				var alertMsg = "";
				
				if ( svlnNoList.length > 0 ) {
					alertMsg += "[ " + svlnNoList + " ]<br>건은 승인권한이 없기 때문에 승인해지가 불가능합니다.<br>";
				}
				
				if ( appltNoList.length > 0 ) {
					alertMsg += "[ " + appltNoList + " ]<br>건은 청약번호가 존재하기 때문에 승인해지가 불가능합니다.<br>";
				}
				
				if ( optlShreSvlnList.length > 0 ) {
					alertMsg += "[ " + optlShreSvlnList + " ]<br>건은 광공유모듈의 대표회선이기 때문에 승인해지가 불가능합니다.<br>"
					          + " 대표회선설정화면을 통해 대표회선에서 해제후 승인해지 작업을 진행해 주세요.<br>";
				}
				
				if (paramList.length > 0) {
					callMsgBox('','C', alertMsg + "해지작업을 진행하시겠습니까?" , function(msgId, msgRst) {
						if (msgRst == 'Y') {
							//console.log(paramUsing);
							cflineShowProgressBody();
							httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updatelineterminationstat', paramUsing, 'POST', 'delWorkInfo');
						} else {
							$("#"+gridIdWork).alopexGrid("startEdit");
						}
					});
				} else {
					alertBox("I", alertMsg);
					$("#"+gridIdWork).alopexGrid("startEdit");
					return;
				}	
					
			}
		}
		else {
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
			$("#"+gridIdWork).alopexGrid("startEdit");
		}
    }
    
    //작업정보저장
    function workUpdate(){
    	$('#'+gridIdWork).alopexGrid('endEdit', {_state:{editing:true}});
		if( $('#'+gridIdWork).length == 0) return;
		var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
		var paramUsing = null;
		var paramList = [];
		var requiredColumn = rtnRequiredColumn(svlnLclCd, svlnSclCd);
		var validate = true;
		var msgStr ="";
		
		if (dataList.length > 0 ){

	    	// FDF 사용정보 
	    	fdfUsingInoLineNo = "";
	    	
			for(i=0;i<dataList.length;i++){
				$.each(requiredColumn, function(key, val){
					var value = eval("dataList[i]" + "." + key);
					if(nullToEmpty(value) == "" || value.replace(/ /gi,"") == ""){
						msgStr = "<br>"+dataList[i].svlnNo + " : " + val;
						validate = false;
						return validate;
					}
				});
				
				if(!validate){
					alertBox('W', makeArgMsg('required', msgStr, "","",""));  /*필수 입력 항목입니다.[{0}]*/ 
					$('#'+gridIdWork).alopexGrid("startEdit");
					return;
				}
				
				// 20181217 해지요청중 회선 체크
				if ( nullToEmpty(dataList[i].svlnStatCd) != "" ) {
					if ( dataList[i].svlnStatCd == "300" && dataList[i]._original.svlnStatCd != "300" ) {
						if ( dataList[i].svlnLclCd == "003" || dataList[i].svlnLclCd == "005" || ( dataList[i].svlnLclCd == "006" && dataList[i].svlnSclCd == "061" ) ) {
							alertBox('W', "해지요청중은 청약을 통해서 신청해야합니다.");
						}
						else {
							alertBox('W', "해지요청중은 RU회선, B2B회선, 중계기정합장치회선만 청약을 통해 신청 가능합니다.");
						}
						
						$('#'+gridIdWork).alopexGrid("startEdit");
		    			validate = false;
		    			return validate;
					}
					// RU회선, B2B회선, 중계기정합장치회선인 경우 작업정보 완료 처리하면 안됨(상태값이 운영이 되버림)
					if ( dataList[i].svlnLclCd == "003" || dataList[i].svlnLcl == "005" || ( dataList[i].svlnLclCd == "006" && dataList[i].svlnSclCd == "061" ) ) {
						if ( dataList[i].svlnStatCd == "300") {
							alertBox('W', "해지요청중은 작업정보 저장 할 수 없습니다.");
							$('#'+gridIdWork).alopexGrid("startEdit");
			    			validate = false;
			    			return validate;
						}
					}
				}
					
				if(nullToEmpty(dataList[i].pktTrkNm) == "" ) {
	    			dataList[i].pktTrkNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "pktTrkNo");
					dataList[i].pktTrkMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].pktTrkNm) != "" && nullToEmpty(dataList[i].pktTrkNo) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckPwEvcNm']);  /*  PW/EVC명은 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].pktTrkNm != dataList[i].pktTrkMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckPwEvcNm']);  /*  PW/EVC명은 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotEqpNm) == "" ) {
	    			dataList[i].cotEqpNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotEqpId");
					dataList[i].cotEqpMatchNm = null;
					
					dataList[i].cotUlnkLftPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkLftPortId");
					dataList[i].cotUlnkLftPortMatchNm = null;
					
					dataList[i].cotUlnkRghtPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkRghtPortId");
					dataList[i].cotUlnkRghtPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotEqpNm) != "" && nullToEmpty(dataList[i].cotEqpId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotEqpNm']);  /*  COT장비는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotEqpNm != dataList[i].cotEqpMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotEqpNm']);  /*  COT장비는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotUlnkLftPortNm) == "" ) {
	    			dataList[i].cotUlnkLftPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkLftPortId");
					dataList[i].cotUlnkLftPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotUlnkLftPortNm) != "" && nullToEmpty(dataList[i].cotUlnkLftPortId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);   /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotUlnkLftPortNm != dataList[i].cotUlnkLftPortMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);  /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotUlnkRghtPortNm) == "" ) {
	    			dataList[i].cotUlnkRghtPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkRghtPortId");
					dataList[i].cotUlnkRghtPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotUlnkRghtPortNm) != "" && nullToEmpty(dataList[i].cotUlnkRghtPortId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);  /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotUlnkRghtPortNm != dataList[i].cotUlnkRghtPortMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);   /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
				
				paramList[i] = dataList[i];
				
				// FDF 사용정보 
		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].svlnNo + ",";
			}
			
			paramUsing = {"serviceLineList":paramList
					      , "titleSvlnLclCd" : svlnLclCd 
					      , "titleSvlnSclCd" : svlnSclCd
					     };
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updateserviceline', paramUsing, 'POST', 'workUpdate');
		 }else{
			 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
			 $("#"+gridIdWork).alopexGrid("startEdit");
		 }
    }
    
    //작업정보완료 || 모든작업정보완료
    function workInfFnsh(gubun){
    	$('#'+gridIdWork).alopexGrid('endEdit', {_state:{editing:true}});
		
    	if( $('#'+gridIdWork).length == 0) {
			return;
		}
    	
		var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
		var paramUsing = null;
		var paramList = [];
		var requiredColumn = rtnRequiredColumn(svlnLclCd, svlnSclCd);
		var validate = true;
		var msgStr ="";
		
		if (dataList.length > 0 ){

	    	// FDF 사용정보 
	    	fdfUsingInoLineNo = "";
	    	
			for(i=0;i<dataList.length;i++){
				$.each(requiredColumn, function(key, val){
					var value = eval("dataList[i]" + "." + key);
					if(nullToEmpty(value) == "" || value.replace(/ /gi,"") == ""){
						msgStr = "<br>"+dataList[i].svlnNo + " : " + val;
						validate = false;
						return validate;
					}
				});
				
				if(!validate){
					alertBox('W', makeArgMsg('required', msgStr, "","","")); /* 필수 입력 항목입니다.[{0}] */
					$('#'+gridIdWork).alopexGrid("startEdit");
					return;
				}
				
				// 20181217 해지요청중 회선 체크
				if ( nullToEmpty(dataList[i].svlnStatCd) != "" ) {
					if ( dataList[i].svlnStatCd == "300" && dataList[i]._original.svlnStatCd != "300" ) {
						if ( dataList[i].svlnLclCd == "003" || dataList[i].svlnLcl == "005" || ( dataList[i].svlnLclCd == "006" && dataList[i].svlnSclCd == "061" ) ) {
							alertBox('W', "해지요청중은 청약을 통해서 신청해야합니다.");
						}
						else {
							alertBox('W', "해지요청중은 RU회선, B2B회선, 중계기정합장치회선만 청약을 통해 신청 가능합니다.");
						}
						
						$('#'+gridIdWork).alopexGrid("startEdit");
		    			validate = false;
		    			return validate;
					}
					
					// RU회선, B2B회선, 중계기정합장치회선인 경우 작업정보 완료 처리하면 안됨(상태값이 운영이 되버림)
					if ( dataList[i].svlnLclCd == "003" || dataList[i].svlnLcl == "005" || ( dataList[i].svlnLclCd == "006" && dataList[i].svlnSclCd == "061" ) ) {
						if ( dataList[i].svlnStatCd == "300") {
							alertBox('W', "해지요청중은 완료처리 할 수 없습니다.");
							$('#'+gridIdWork).alopexGrid("startEdit");
			    			validate = false;
			    			return validate;
						}
					}
				}
				
				if(nullToEmpty(dataList[i].pktTrkNm) == "" ) {
	    			dataList[i].pktTrkNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "pktTrkNo");
					dataList[i].pktTrkMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].pktTrkNm) != "" && nullToEmpty(dataList[i].pktTrkNo) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckPwEvcNm']);  /*  PW/EVC명은 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].pktTrkNm != dataList[i].pktTrkMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckPwEvcNm']);  /*  PW/EVC명은 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    			    		
	    		if(nullToEmpty(dataList[i].cotEqpNm) == "" ) {
	    			dataList[i].cotEqpNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotEqpId");
					dataList[i].cotEqpMatchNm = null;
					
					dataList[i].cotUlnkLftPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkLftPortId");
					dataList[i].cotUlnkLftPortMatchNm = null;
					
					dataList[i].cotUlnkRghtPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkRghtPortId");
					dataList[i].cotUlnkRghtPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotEqpNm) != "" && nullToEmpty(dataList[i].cotEqpId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotEqpNm']);  /*  COT장비는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotEqpNm != dataList[i].cotEqpMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotEqpNm']);  /*  COT장비는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotUlnkLftPortNm) == "" ) {
	    			dataList[i].cotUlnkLftPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkLftPortId");
					dataList[i].cotUlnkLftPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotUlnkLftPortNm) != "" && nullToEmpty(dataList[i].cotUlnkLftPortId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);   /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotUlnkLftPortNm != dataList[i].cotUlnkLftPortMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);  /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotUlnkRghtPortNm) == "" ) {
	    			dataList[i].cotUlnkRghtPortNm = null;
	    			$('#' + gridIdWork + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkRghtPortId");
					dataList[i].cotUlnkRghtPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotUlnkRghtPortNm) != "" && nullToEmpty(dataList[i].cotUlnkRghtPortId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);  /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotUlnkRghtPortNm != dataList[i].cotUlnkRghtPortMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);   /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridIdWork).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
				
				paramList[i] = dataList[i];				

				// FDF 사용정보 
		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].svlnNo + ",";
			}
			paramUsing = {"wokDivCd":gubun, "serviceLineList":paramList
				      , "titleSvlnLclCd" : svlnLclCd 
				      , "titleSvlnSclCd" : svlnSclCd
				      };
//			console.log("==============================");
//			console.log(paramUsing);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updateworkcomplete', paramUsing, 'POST', 'workInfFnsh');
			
		 }else{
			 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
			 $("#"+gridIdWork).alopexGrid("startEdit");
		 }
    }
        
    // 필수컬럼을 회선구분에 따라 리턴해주는 함수
    function rtnRequiredColumn(svlnLclCd, svlnSclCd){
    	var requiredColumn = null
    	//여기서부터 대분류 코드, 소분류코드에 따른 필수컬럼을 체크해준다.
    	//미지정
    	if(svlnLclCd == '000') {
			requiredColumn = 
			{ 
	    		lineNm : cflineMsgArray['lnNm'] /*  회선명 */
				, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode']
				, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
				, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
				, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
				, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
				, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
				, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
				, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
				, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
				, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
				,lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
			};
    	}
    	//기지국회선
    	if(svlnLclCd == '001') {
    		if(svlnSclCd == '001'){
				requiredColumn = 
    				{ 
    		    		lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
    					, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
    					, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
    					, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
    					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
    					, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
    					, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
    					, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
    					, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
    					, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
    					, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    					, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
    				};
    		}else if (svlnSclCd == '002'){
    			requiredColumn = 
    			{ 
    					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
	    			 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
	    			 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */ 
	    			 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
    					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
	    			 	, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
	    			 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
	    			 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
	    			 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
	    			 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
	    			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
	    			 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
    			};
    		}else if (svlnSclCd == '003'){
    			requiredColumn = 
    			{ 
    					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
    					, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
    					, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
    					, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
    					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
    					, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
    					, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
    					, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
    					, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
    					, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
    					, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    					, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
    			};
    		}else if (svlnSclCd == '020') {
    			requiredColumn = 
    			{ 
    					lineUsePerdTypCd : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/
    			};
    		}else if (svlnSclCd != '016' && svlnSclCd != '030'){	//LTE, 5G 외 기지국회선에서 체크한다.
    			requiredColumn = 
    			{ 
    					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
						, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
					 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
						, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
					 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
					 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
					 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
					 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
    			};
    		}
    	}
    	//RU회선
    	if(svlnLclCd == '003') {
    		if(svlnSclCd == '101'){
        		requiredColumn =
        		{ 
						svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
        				, svlnTypCd : cflineMsgArray['serviceLineType'] /*서비스회선유형*/
        			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
        		};
    		}
    	}
    	//가입자망회선
    	if(svlnLclCd == '004') {
			requiredColumn = 
			{ 
					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    			 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
    			 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */ 
    			 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
    			 	, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
    			 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
    			 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
    			 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
    			 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
    			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    			 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
			};
    	}
    	//B2B
    	if(svlnLclCd == '005') {
    		if ( $('#mgmtGrpCd').val() == '0002' || svlnSclCd =="009" || svlnSclCd =="021" ) {
        		requiredColumn = 
    			{ 
    				lineNm : cflineMsgArray['lnNm'] /*  회선명 */
        			, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
				 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
				 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
	 				, svlnTypCd : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */	
		 			, lineCapaCd : cflineMsgArray['lineCapacity'] /*회선용량*/
				 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
				 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
			 		, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    			};
    		}else {
        		requiredColumn = 
    			{ 
        			lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    				, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
				 	, svlnNo : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/
				 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */	
				 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
		 			, svlnTypCd : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */	
				 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
				 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
		 			, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    			};
    		}
    	}
    	//공동망회선
    	if(svlnLclCd == '007'){
    		requiredColumn = 
			{ 
    			lineNm : cflineMsgArray['lnNm'] /*  회선명 */
				, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
			};
    	}
    	//기타회선
    	if(svlnLclCd == '006') {
    		if(svlnSclCd != '102' && svlnSclCd != '105' ){
    			if(svlnSclCd == '061'){			// 중계기 정합장치 회선
        			requiredColumn =
            		{ 
    						svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
            			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
            		};
        		} else if(svlnSclCd == '070' || svlnSclCd == '071' || svlnSclCd == '072'){
        			requiredColumn =
            		{ 
    	    				lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    						, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
        					, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/
            		};
        		} else if(svlnSclCd == '106'){ //예비회선 추가 2023-11-08
        			requiredColumn =
            		{ 
    	    				lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    						, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
            		};
        		} else {
        			requiredColumn = 
    				{ 
    	    				lineNm : cflineMsgArray['lnNm'] /*  회선명 */
        					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
    	    		 		, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
    	    				, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
    	    		 		, svlnTypCd : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */	
    	    		 		, lineCapaCd : cflineMsgArray['lineCapacity'] /*회선용량*/
    	    		 		, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */
    	    		 		, faltMgmtObjYn : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/
    	    		 		, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
    	    		 		, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
    				};
        		}
    		}else{
        		requiredColumn =
        		{ 
    					svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
        			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
        		};    			
    		}
    	}
    	
    	if(requiredColumn == null) {
    		requiredColumn =
    		{ 
    		};
    	}    	
    	return requiredColumn
    }
    

    //FRONTHAULMAKEHEADER 
	// 2024-01     6. [추가] RU회선 광코어에서 프론트홀구간보기가 체크된 경우
    //TODO
    function frontHaulMakeHeader(data, flag) {
    	
    	var mapping = '';
    	var maxnumber = 0;
    	var number = 0;
    	for(var i=0; i<data.length; i++){
			var serviceLineList = data[i].serviceLineList  ;
				if(serviceLineList != null && serviceLineList.length  > 0 ){

					for(var j=0; j<serviceLineList.length; j++){
						// 	        		
						if(nullToEmpty(serviceLineList[j].eqpRoleDivCd) != '' 
							&& (serviceLineList[j].eqpRoleDivCd == '18' || serviceLineList[j].eqpRoleDivCd == '19' || serviceLineList[j].eqpRoleDivCd == '30' || serviceLineList[j].eqpRoleDivCd == '45'
								 || serviceLineList[j].eqpRoleDivCd == '52' || serviceLineList[j].eqpRoleDivCd == '53' || serviceLineList[j].eqpRoleDivCd == '55'
									 || serviceLineList[j].eqpRoleDivCd == '56')) {	//4G_LMUX장비 추가 2024-11-13
							
							var useRingNtwkLineNo = serviceLineList[j].useRingNtwkLineNo;
							if(nullToEmpty(useRingNtwkLineNo) != '') {
								if(nullToEmpty(serviceLineList[j].onsHdofcCdNm) != '') {
									data[i]["onsHdofcCdNm"] = nullToEmpty(serviceLineList[j].onsHdofcCdNm);
									data[i]["onsTeamCdNm"] = nullToEmpty(serviceLineList[j].onsTeamCdNm);
									break;
								}
							}
						}
					}
					
					for(var j=0; j<serviceLineList.length; j++){
						// 	        		                  
						data[i]["eqpNm#"+j] = nullToEmpty(serviceLineList[j].eqpNm);
						data[i]["eqpId#"+j] = nullToEmpty(serviceLineList[j].eqpId);
						data[i]["eqpMdlNm#"+j] = nullToEmpty(serviceLineList[j].eqpMdlNm);
						data[i]["bpNm#"+j] = nullToEmpty(serviceLineList[j].bpNm);
					}
					number  = serviceLineList.length;
				}
				if (flag == 'info'){
					if (infoMaxnumber < number){
						infoMaxnumber = number;
					}
		    	}else{
		    		if (workMaxnumber < number){
		    			workMaxnumber = number;
					}
		    	}
		}
    	if (flag == 'info'){
    		mapping = returnMapping;
    		maxnumber = infoMaxnumber;
    	}else{
    		mapping = returnWorkMapping;
    		maxnumber = workMaxnumber;
    	}
    	
    	// 프론트홀구간보기
    	// SKO 본부/SKO 품질개선팀/제조사
    	// 장비명/EQP ID/장비모델명/장비TID
		mapping.push({ key:'onsHdofcCdNm'		, title:'SKO본부'	,align:'left', width: '200px' });
		mapping.push({ key:'onsTeamCdNm'		, title:'SKO품질개선팀'	,align:'left', width: '200px' });

    	if( svlnSclCd == '101' ){
        	for(var j=0; j < maxnumber; j++){
        		var k = j +1 ; 
        		mapping.push({ key:'eqpNm#'+j		, title:cflineMsgArray['equipmentName']+'#'+k	,align:'left', width: '200px' });
        		mapping.push({ key:'eqpId#'+j		, title:cflineMsgArray['equipmentIdentification']+'#'+k	,align:'left', width: '200px' });
        		mapping.push({ key:'eqpMdlNm#'+j	, title:cflineMsgArray['equipmentModelName']+'#'+k	,align:'left', width: '200px' });
        		mapping.push({ key:'bpNm#'+j		, title:cflineMsgArray['vend']+'#'+k  ,align:'left', width: '200px' });
        		//mapping.push({ key:'eqpTid#'+j		, title:cflineMsgArray['equipmentTargetId']+'#'+k 	,align:'left', width: '200px' });

        	}
    	} 
    	return data;
    	
    }
    
    
  //MAKEHEADER 
    function makeHeader (data, flag){ // flag 값에따라 작업정보인지 아닌지 구분
    	var mapping = '';
    	var maxnumber = 0;
    	var number = 0;
    	
    	
    	for(var i=0; i<data.length; i++){
			var serviceLineList = data[i].serviceLineList  ;
				if(serviceLineList != null && serviceLineList.length  > 0 ){
					for(var j=0; j<serviceLineList.length; j++){
						var k = j +1 ; 
						// 
						data[i]["useLineSvlnNm#"+j] = serviceLineList[j].useLineSvlnNm;
						data[i]["useTrkNtwkLineNm#"+j] = serviceLineList[j].useTrkNtwkLineNm;
						data[i]["useRingNtwkLineNm#"+j] = serviceLineList[j].useRingNtwkLineNm;
						data[i]["useWdmTrkNtwkLineNm#"+j] = serviceLineList[j].useWdmTrkNtwkLineNm;
						
						var tmpSctnDrdCD = "1";
						var sctnDrcCd  = serviceLineList[j].sctnDrcCd;
						var lftEqpRingDivCdNm = serviceLineList[j].lftEqpRingDivCdNm;
						var lEqpNm = serviceLineList[j].lEqpNM;
						var lEqpTid = serviceLineList[j].lEqpTid;
                        var lPortNm = nullToEmpty(serviceLineList[j].lPortNm);
						var lWavVal = serviceLineList[j].lWavVal;
                        var lPortChNm  = serviceLineList[j].lftPortChnlVal;
                        var lftPortChnlT1Yn  = serviceLineList[j].lftPortChnlT1Yn;
                        var rghtEqpRingDivCdNm = serviceLineList[j].rghtEqpRingDivCdNm
						var rEqpNm = serviceLineList[j].rEqpNM;
						var rEqpTid = serviceLineList[j].rEqpTid;
                        var rPortNm    = nullToEmpty(serviceLineList[j].rPortNm);
						var rWavVal = serviceLineList[j].rWavVal;
                        var rPortChNm  = serviceLineList[j].rghtPortChnlVal;
                        var rghtPortChnlT1Yn  = serviceLineList[j].rghtPortChnlT1Yn;
                        
                        var rxSctnDrcCd  = serviceLineList[j].rxSctnDrcCd;
                        var rxLftPortNm  = "";
                        var rxRghtPortNm  = "";

                        var lftPortDescr = "";
                        var rghtPortDescr = "";
                        var lftChnlDescr = "";
                        var rghtChnlDescr = "";
                        
                        // 사용수용네트워크명 취득
                        var useTrkNtwkLineNm = serviceLineList[j].useTrkNtwkLineNm;
                        
                        //RT구간방향 getRxSctnDrcCd
                        if ("2" == nullToEmpty(rxSctnDrcCd) ){
                            rxLftPortNm = nullToEmpty(serviceLineList[j].rxRghtPortNm);
                            rxRghtPortNm = nullToEmpty(serviceLineList[j].rxLftPortNm);
                        }else{
                            rxLftPortNm = nullToEmpty(serviceLineList[j].rxLftPortNm);
                            rxRghtPortNm = nullToEmpty(serviceLineList[j].rxRghtPortNm);
                        }                        
                        
                        
                        var useNtwkSctnDrcCd = null;
                        
                        if(serviceLineList[j].useNtwkSctnDrcCd == "2"){
                        	useNtwkSctnDrcCd = "2";
                        }else{
                        	useNtwkSctnDrcCd = "1";
                        }
                        
                        if((nullToEmpty(sctnDrcCd) == "2" && nullToEmpty(useNtwkSctnDrcCd) == "1") ||  (nullToEmpty(sctnDrcCd) == "1" && nullToEmpty(useNtwkSctnDrcCd) == "2") ){
							tmpSctnDrdCD = "2";
						}
						if (tmpSctnDrdCD == "1"){
							data[i]["lftEqpRingDivCdNm#"+j] = lftEqpRingDivCdNm;
							data[i]["lEqpNM#"+j] = lEqpNm;
							data[i]["lEqpTid#"+j] = lEqpTid;
//							data[i]["lPortNm#"+j] = lPortNm;
							data[i]["lWavVal#"+j] = lWavVal;
							data[i]["rghtEqpRingDivCdNm#"+j] = rghtEqpRingDivCdNm;
							data[i]["rEqpNM#"+j] = rEqpNm;
							data[i]["rEqpTid#"+j] = rEqpTid;
//							data[i]["rPortNm#"+j] = rPortNm;	
							data[i]["rWavVal#"+j] = rWavVal;

                            lftChnlDescr = nullToEmpty(lPortChNm);
                            rghtChnlDescr = nullToEmpty(rPortChNm); 
                            data[i]["lftPortChnlT1Yn#"+j] = lftPortChnlT1Yn;
							data[i]["rghtPortChnlT1Yn#"+j] = rghtPortChnlT1Yn;
							
	                         // 좌포트(노드 포트)
                           if("" != rxLftPortNm){
                        	   lftPortDescr = makeTxRxPortDescr(lPortNm, rxLftPortNm);
                           }
                           else {
                        	   lftPortDescr = lPortNm;
                           }
                           // 우포트(FDF 포트)
                           if("" != rxRghtPortNm){
                        	   rghtPortDescr = makeTxRxPortDescr(rPortNm, rxRghtPortNm);
                           }
                           else {
                        	   rghtPortDescr = rPortNm;
                           } 	
						}else if (tmpSctnDrdCD == "2"){
							
							data[i]["lftEqpRingDivCdNm#"+j] = rghtEqpRingDivCdNm;
							data[i]["lEqpNM#"+j] = rEqpNm;
							data[i]["lEqpTid#"+j] = rEqpTid;
							data[i]["lWavVal#"+j] = rWavVal;
							data[i]["rghtEqpRingDivCdNm#"+j] = lftEqpRingDivCdNm;
							data[i]["rEqpNM#"+j] = lEqpNm;
							data[i]["rEqpTid#"+j] = lEqpTid;
							data[i]["rWavVal#"+j] = lWavVal;
							
                            lftChnlDescr = nullToEmpty(rPortChNm);	//lftChnlDescr = "", rPortChNm = undefined
                            rghtChnlDescr = nullToEmpty(lPortChNm); //rghtChnlDescr = "04-1-18-36", lPortChNm = "04-1-18-36"

							
							data[i]["lftPortChnlT1Yn#"+j] = rghtPortChnlT1Yn;
							data[i]["rghtPortChnlT1Yn#"+j] = lftPortChnlT1Yn;
							
	                         // 좌포트(노드 포트)
                            if("" != rxLftPortNm){
                            	lftPortDescr = makeTxRxPortDescr(rPortNm, rxLftPortNm);	//lftPortDescr = "1", rPortNm = "1
                            }
                            else {
                            	lftPortDescr = rPortNm;
                            }
                            // 우포트(FDF 포트)
                            if("" != rxRghtPortNm){
                            	rghtPortDescr = makeTxRxPortDescr(lPortNm, rxRghtPortNm);	//rghtPortDescr = "", lPortNm = "04-1-"
                            }
                            else {
                            	rghtPortDescr = lPortNm;
                            } 	
						}

						
						//수용트렁크가 OEDT타입인경우 트렁크에는 "랙-쉘프-" 까지만 입력되지만 실제 회선에는 "랙-쉘프-카드-포트"까지 등록되므로 화면에 조회될때 "랙-쉘프-랙-쉘프-카드-포트" 로 표시되는것을 막기 위해 추가
						var oedtTrk = 'N';
						if(nullToEmpty(useTrkNtwkLineNm) != "") {
							if(useTrkNtwkLineNm.indexOf("OEDT") > 0) {
								oedtTrk = 'Y';
							}
						}

                		if (nullToEmpty(lftChnlDescr) != ""){
	                    	if(oedtTrk == 'Y') {
	                    		data[i]["lPortNm#"+j] = lftChnlDescr;
	                    	} else {
	                    		data[i]["lPortNm#"+j] = lftPortDescr + lftChnlDescr;
	                    	}
						}else{
    						data[i]["lPortNm#"+j] = lftPortDescr;
                        }
    						
                        if (nullToEmpty(rghtChnlDescr) != ""){	
                        	if(oedtTrk == 'Y') {
                        		data[i]["rPortNm#"+j] = rghtChnlDescr;	
                        	} else {
                        		data[i]["rPortNm#"+j] = rghtPortDescr + rghtChnlDescr;	
                        	}
                        }else{
    						data[i]["rPortNm#"+j] = rghtPortDescr;	
                        }						
						
					}
					number  = serviceLineList.length;
				}
				if (flag == 'info'){
					if (infoMaxnumber < number){
						infoMaxnumber = number;
					}
		    	}else{
		    		if (workMaxnumber < number){
		    			workMaxnumber = number;
					}
		    	}
		}
    	if (flag == 'info'){
    		mapping = returnMapping;
    		maxnumber = infoMaxnumber;
    	}else{
    		mapping = returnWorkMapping;
    		maxnumber = workMaxnumber;
    	}
    	
    	// 전체구간보기
    	if ( svlnSclCd == '016'|| svlnSclCd == '030' ){
        	//MAKEHEADER 
        	for(var j=0; j < maxnumber; j++){
        		var k = j +1 ; 
        		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
        		mapping.push({ key:'lEqpNM#'+j		 , title:cflineMsgArray['westEqp']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['westPort']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rEqpNM#'+j		 , title:cflineMsgArray['eastEqp'] +'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['eastPort'] +'#'+k	    	,align:'left', width: '200px' });

        	}
    	}
    	else if( svlnSclCd == '102' || svlnSclCd == '105' || ( svlnLclCd == "003" && svlnSclCd == "") ){
        	for(var j=0; j < maxnumber; j++){
        		var k = j +1 ; 
        		mapping.push({ key:'lEqpNM#'+j		 , title:cflineMsgArray['westEqp']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['westPort']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rEqpNM#'+j		 , title:cflineMsgArray['eastEqp'] +'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['eastPort'] +'#'+k	    	,align:'left', width: '200px' });

        	}
    	} 
    	// 2018-11-13  5. [수정] RU고도화 RU회선-광코어
    	else if( svlnSclCd == '101' ){
        	for(var j=0; j < maxnumber; j++){
        		var k = j +1 ; 
        		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
        		mapping.push({ key:'useLineSvlnNm#'+j    	 ,title:"경유회선(Cascading)"+'#'+k     ,align:'left', width: '200px' });
        		mapping.push({ key:'lEqpNM#'+j		 , title:cflineMsgArray['westEqp']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['westPort']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rEqpNM#'+j		 , title:cflineMsgArray['eastEqp'] +'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['eastPort'] +'#'+k	    	,align:'left', width: '200px' });

        	}
    	} 
    	// 2018-11-13  5. [수정] RU고도화 기타-중계기정합장치회선 
    	// 2018-12-26 DCN, RMS, IP정류기 추가
    	// 2019-02-19 기지국회선(001) - WCDMA(IPNB) 추가
    	// 2023-11-08 기타_예비회선(106) 추가
    	else if( svlnSclCd == '061' || svlnSclCd == '070' || svlnSclCd == '071' || svlnSclCd == '072' || svlnSclCd =='020' || svlnSclCd == '106' ){
        	for(var j=0; j < maxnumber; j++){
        		var k = j +1 ; 
        		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
        		mapping.push({ key:'lEqpNM#'+j		 , title:cflineMsgArray['westEqp']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['westPort']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rEqpNM#'+j		 , title:cflineMsgArray['eastEqp'] +'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['eastPort'] +'#'+k	    	,align:'left', width: '200px' });

        	}
    	}
    	else if( svlnSclCd == '103' ){
        	//MAKEHEADER 
        	for(var j=0; j < maxnumber; j++){
        		var k = j +1 ; 
        		mapping.push({key : 'lftEqpRingDivCdNm#'+j	 ,title : cflineMsgArray['westSupSub']+'#'+k /*WEST상하위*/			,align:'center', width: '160px'});
        		mapping.push({key : 'lEqpNM#'+j	       			 ,title : cflineMsgArray['westEqp']+'#'+k /*WEST장비명(좌장비명)*/ 			,align:'center', width: '160px'});
        		mapping.push({key : 'lPortNm#'+j	       			 ,title : cflineMsgArray['westPort']+'#'+k /*WEST포트명(좌포트명)*/			,align:'center', width: '160px'});
        		mapping.push({key : 'lEqpTid#'+j	       			 ,title : cflineMsgArray['westEqpTargetId']+'#'+k /*WEST장비TID*/			,align:'center', width: '160px'});
        		mapping.push({key : 'rghtEqpRingDivCdNm#'+j	       			 ,title : cflineMsgArray['eastSupSub']+'#'+k /*EAST상하위*/			,align:'center', width: '160px'});
        		mapping.push({key : 'rEqpNM#'+j	       			 ,title : cflineMsgArray['eastEqp']+'#'+k /*EAST장비명(우장비명)*/			,align:'center', width: '160px'});
        		mapping.push({key : 'rPortNm#'	+j       			 ,title : cflineMsgArray['eastPort']+'#'+k /*EAST포트명(우포트명)*/			,align:'center', width: '160px'});
        		mapping.push({key : 'rEqpTid#'+j	       			 ,title : cflineMsgArray['eastEqpTargetId']+'#'+k /*EAST장비TID*/			,align:'center', width: '160px'});
        	}
    	} else {
        	for(var j=0; j < maxnumber; j++){
        		var k = j +1 ; 
        		if ( svlnLclCd == "005"){
            		mapping.push({ key:'useWdmTrkNtwkLineNm#'+j    ,title:cflineMsgArray['wdmTrunk']+'#'+k     ,align:'left', width: '200px' });
        		}
        		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
        		mapping.push({ key:'useTrkNtwkLineNm#'+j    ,title:cflineMsgArray['trunk']+'#'+k     ,align:'left', width: '200px' });
        		mapping.push({ key:'lEqpNM#'+j		 , title:cflineMsgArray['westEqp']+'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['westPort']+'#'+k	    	,align:'left', width: '200px' });
        		if ( svlnLclCd == "005"){
            		mapping.push({ key:'lftPortChnlT1Yn#'+j    ,title:"WESTT1여부"+'#'+k     ,align:'left', width: '200px' });
        		}
        		mapping.push({ key:'rEqpNM#'+j		 , title:cflineMsgArray['eastEqp'] +'#'+k	    	,align:'left', width: '200px' });
        		mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['eastPort'] +'#'+k	    	,align:'left', width: '200px' });
        		if ( svlnLclCd == "005"){
            		mapping.push({ key:'rghtPortChnlT1Yn#'+j    ,title:"EASTT1여부"+'#'+k     ,align:'left', width: '200px' });
        		}
        	}
    	}
    	return data;
    }
    
    /*// 컨텍스트메뉴 ru, du일때 비활성 추후
    var contextMenuYn = function(){
    	if(svlnLclCd != "003" && svlnSclCd != "016"){
        	return true;
    	}else{
    		return false;
    	}
    }*/
    
    
 // 트리그리드 ru, du일때 활성
    var useTreeYn = function(){
    	if(svlnLclCd != "003" && svlnSclCd != "016" && svlnSclCd != "030" && svlnSclCd != "020"){
        	return false;
    	}else{
    		return true;
    	}
    }
    
    //그리드 재셋팅
    function reSetGrid(){
    	svlnLclCd = $('#svlnLclCd').val();
    	svlnSclCd = $('#svlnSclCd').val();
    	//그리드 재설정후 데이터 비우고 건수 0으로 변경
		$('#'+gridId).alopexGrid("dataEmpty");
		$('#'+gridIdWork).alopexGrid("dataEmpty");
    	getGrid(svlnLclCd, svlnSclCd);
		$('#'+gridId).alopexGrid('updateOption',
				{paging : {pagerTotal: function(paging) {
					return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + 0;
				}}}
		);
    	$('#totalCntSpan').text("");
		$('#'+gridIdWork).alopexGrid('updateOption',
				{paging : {pagerTotal: function(paging) {
					return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + 0;
				}}}
		);
    	$('#workTotalCntSpan').text("");
    }
    //배치실행 
    function funExcelBatchExecute() {
    	var tmofCdList = "";
    	var tmofCdList2 = [];
    	var lenList = 0;
    	/*var tmofFullSize = $('#tmofCd option').size(); // 2017-07-18 속도저하방지
*/   		if (nullToEmpty( $("#tmofCd").val() )  != ""  ){
   			lenList = $("#tmofCd").val().length;
   			tmofCdList2 = $("#tmofCd").val();
   			for(i=0; i<lenList; i++){
   				if(tmofCdList==""){
   					tmofCdList = nullToEmpty($("#tmofCd").val()[i]);
   				}else{
   					tmofCdList = tmofCdList + "," + nullToEmpty($("#tmofCd").val()[i]);   					
   				}

   			}
   		} /*else if ( nullToEmpty( $("#tmofCd").val() ).length == tmofFullSize ){
   			tmofCdList = null;
   		} */else {
   			tmofCdList = null;
   		}
   		
    	var tabIndexValue = $('#tabIndexValue').val();
    	var dataParamMethod = "";
    	var dataCnt = 0;
    	if(tabIndexValue == "0"){
    		dataParamMethod = "I";
    		var data = $('#'+gridId).alopexGrid('dataGet');
    		dataCnt = data.length;
    		fileName = cflineMsgArray['serviceLine'] + cflineMsgArray['information'];   //서비스회선정보
    	}else if(tabIndexValue == "1"){
    		dataParamMethod = "W";  
    		var dataWork = $('#'+gridIdWork).alopexGrid('dataGet');
    		dataCnt = dataWork.length;
    		fileName =cflineMsgArray['serviceLine'] + cflineMsgArray['workInfo'];  //서비스회선작업정보
    	}
    	
    	/*if(dataCnt <= 0){
    		return;
    	}*/
    	
     	var dataParam =  $("#searchForm").getData();
     	
     	$.extend(dataParam,{tmofCdList: tmofCdList });
     	$.extend(dataParam,{tmofCd: tmofCdList2 });
     	
     	var pathAll = 'N' ;
     	if ($("input:checkbox[id='pathAll']").is(":checked") ){
    		pathAll = 'Y'; 
    	}
    	$.extend(dataParam,{pathAll: pathAll });

    	//FDF구간 제외 추가 - 2021-07-09
    	var exceptFdfNe = 'N' ;
    	if ($("input:checkbox[id='pathAll']").is(":checked") ){
        	if ($("input:checkbox[id='exceptFdfNe']").is(":checked") ){
        		exceptFdfNe = 'Y'; 
        	}
    	}
    	$.extend(dataParam,{exceptFdfNe: exceptFdfNe });
    	
    	var lkupCondAply = 'N';
    	if ($("input:checkbox[id='lkupCondAply']").is(":checked") ){
    		lkupCondAply = 'Y'; 
    	}
    	$.extend(dataParam,{lkupCondAply: lkupCondAply });
    	var leslSrchYn = 'N';
    	if ($("input:checkbox[id='leslSrchYn']").is(":checked") ){
    		leslSrchYn = 'Y'; 
    	}
    	$.extend(dataParam,{leslSrchYn: leslSrchYn });
    	var notUseLine ='N'
		if ($("input:checkbox[id='notUseLine']").is(":checked") ){
			notUseLine = 'Y'; 
    	}
    	$.extend(dataParam,{notUseLine: notUseLine });
    	var nitsCisConn ='N'
		if ($("input:checkbox[id='nitsCisConn']").is(":checked") ){
			if($('#mgmtGrpCd').val() == "0001" ) {
				nitsCisConn = 'Y';	
			}
    	}
        $.extend(dataParam,{nitsCisConn: nitsCisConn });
        // RU 광코어 : OCM보기
        var ocmChk = 'N';
        if( $("input:checkbox[id='ocmChk']").is(":checked") ) {
        	ocmChk = 'Y';
        }
        $.extend(dataParam,{ocmChk: ocmChk });
     	
        //TODO 2024-01-10 프론트홀구간보기 추가
    	var frontHaulPath = 'N' ;
        if ($("input:checkbox[id='frontHaulPath']").is(":checked") ){
        		frontHaulPath = 'Y'; 
        		pathAll = 'N';
        }
    	$.extend(dataParam,{pathAll: pathAll });
    	$.extend(dataParam,{frontHaulPath: frontHaulPath });
        
     	dataParam = gridExcelColumn(dataParam, gridId);
     	
     	var headerGroupInfo = null;
     	if ($('#svlnLclCd').val() == "003" && $('#svlnSclCd').val() == "101") {
     		headerGroupInfo = getHeaderGroupForCfLine(gridId);
     		dataParam.headerGroupInfo = headerGroupInfo;
     	}
     	
    	dataParam.fileExtension = "xlsx";
     	dataParam.method = dataParamMethod;
     	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
    
    // 기간망트렁크팝업
    function searchRontTrunkPop(param){
		$a.popup({
		  	popid: "RontTrunkListPop",
		  	title: "트렁크 리스트 조회",
			url: $('#ctx').val()+'/configmgmt/cfline/TrunkListPop.do',
			data: param,
			iframe: true,
  			modal : true,
  			movable:true,
			windowpopup : false,
			width : 1500,
			height : window.innerHeight * 0.9,
			callback:function(data){
	    		var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.data;
				$('#'+gridIdWork).alopexGrid( "cellEdit", data[0].ntwkLineNo, {_index : { row : rowIndex}}, "rontNtwkLineNo");
				$('#'+gridIdWork).alopexGrid( "cellEdit", data[0].ntwkLineNm, {_index : { row : rowIndex}}, "rontTrkNm");
			}
		});
    }

    //Grid 초기화
    var getGrid = function(svlnLclCd, svlnSclCd, response, gridDiv) {
    	
    	//선번정보 표시유무
    	var pathAll = false;
    	if($("input:checkbox[id='pathAll']").is(":checked")){
    		pathAll = true;
		}
    	
    	//프론트홀정보 표시유무
    	var frontHaulPath = false;
    	if($("input:checkbox[id='frontHaulPath']").is(":checked")){
    		frontHaulPath = true;
    		pathAll = false;
		}
    	
    	/*
    		svlnLclCd
    		000 :	미지정 
    		001 :	기지국회선
    		003 :	RU회선
    		004 :	가입자망회선
    		005 :	B2B
    		006 :	기타회선	
    	*/
    	
    	// 미지정
    	if(svlnLclCd =="000"){
			returnMapping = mapping001001('info', showAppltNoYn);
			returnWorkMapping = mapping001001('work', showAppltNoYn);
    	// 기지국 회선
    	}else if(svlnLclCd =="001"){
    		//전체  ( 교환기간 , 기지국간 , 상호접속간 ) 
    		if(nullToEmpty(svlnSclCd) == "") {
    			returnMapping = mapping001111('info', showAppltNoYn);
    			returnWorkMapping = mapping001111('work', showAppltNoYn);
    		//교환기간
    		}else if(svlnSclCd == "001"){
    			returnMapping = mapping001001('info', showAppltNoYn);
    			returnWorkMapping = mapping001001('work', showAppltNoYn);
    		// 기지국간
    		}else if(svlnSclCd == "002"){
    			returnMapping = mapping001002('info', showAppltNoYn);
    			returnWorkMapping = mapping001002('work', showAppltNoYn);
    		// 상호접속간
    		}else if(svlnSclCd == "003"){
    			returnMapping = mapping001003('info', showAppltNoYn);
    			returnWorkMapping = mapping001003('work', showAppltNoYn);
    		//DU
    		}else if(svlnSclCd == "016") {
    			returnMapping = mapping001016('info', showAppltNoYn);
    			returnWorkMapping = mapping001016('work', showAppltNoYn);
    		}else if(svlnSclCd == "020") {
				returnMapping = mapping001020('info');
				returnWorkMapping = mapping001020('work');
			//5G
    		}else if(svlnSclCd == "030") {
    			returnMapping = mapping001030('info', showAppltNoYn);
    			returnWorkMapping = mapping001030('work', showAppltNoYn);
    		}else {
				returnMapping = mapping001002('info', showAppltNoYn);
				returnWorkMapping = mapping001002('work', showAppltNoYn);
			}
    	// RU회선
    	}else if(svlnLclCd == "003"){
    		if(svlnSclCd == "104" || svlnSclCd == "") {
    			returnMapping = mappingCore003('info', showAppltNoYn);
    			returnWorkMapping = mappingCore003('work', showAppltNoYn);
    		}
    		// 광코어
    		// ocmYn : RU 광코어 > 대표회선 번호, 대표회선 통시코드, 대표회선명 hide
    		else if(svlnSclCd == "101"){
    			/*if( !$("input:checkbox[id='ocmChk']").is(":checked") ) {
    				ocmYn = true;
    			}
    			else {
    				ocmYn = false;
    			}
    			
    			returnMapping = mappingCore003('info', showAppltNoYn, ocmYn);
    			returnWorkMapping = mappingCore003('work', showAppltNoYn, ocmYn);*/
    			returnMapping = mappingCore003('info', showAppltNoYn);
    			returnWorkMapping = mappingCore003('work', showAppltNoYn);
    		//RU
    		}else {
    			returnMapping = mappingRu003('info', showAppltNoYn);
    			returnWorkMapping = mappingRu003('work', showAppltNoYn);
    		}
    	// 가입자망 회선
    	}else if(svlnLclCd == "004"){
    		returnMapping = mapping004('info', showAppltNoYn);
    		returnWorkMapping = mapping004('work', showAppltNoYn);
    	// B2B
    	}else if(svlnLclCd == "005"){
    		if ( $('#mgmtGrpCd').val() == '0002' ) {
    			returnMapping = mapping005('info', showAppltNoYn);
    			returnWorkMapping = mapping005('work', showAppltNoYn);
    		} else {
    			if ( $('#mgmtGrpCd').val() == '0001' ){
        			returnMapping = mapping001005('info', true, showAppltNoYn);
        			returnWorkMapping = mapping001005('work', true, showAppltNoYn);
    			} else {
        			returnMapping = mapping001005('info', false, showAppltNoYn);
        			returnWorkMapping = mapping001005('work', false, showAppltNoYn);
    			}
    		}
    	// 공동망회선
    	}else if(svlnLclCd == "007"){
    		returnMapping = mapping007080('info', showAppltNoYn);
    		returnWorkMapping = mapping007080('work', showAppltNoYn);
		//기타회선
    	}else{
    		if($('#mgmtGrpCd').val() != '0002'){ // ADAMS연동 고도화
				if (svlnSclCd == "102") {
					returnMapping = mappingWifi003('info', showAppltNoYn);
					returnWorkMapping = mappingWifi003('work', showAppltNoYn);
				} else if  (svlnSclCd == "105") {
					returnMapping = mappingNits('info', showAppltNoYn);
					returnWorkMapping = mappingNits('work', showAppltNoYn);
				} else if (svlnSclCd == "060") {		// DCN망
					returnMapping = mappingDcn('info', showAppltNoYn);
					returnWorkMapping = mappingDcn('work', showAppltNoYn);
				} else if (svlnSclCd == "061") {		// 중계기 정합장치 회선
					returnMapping = mapping006061('info', showAppltNoYn);
					returnWorkMapping = mapping006061('work', showAppltNoYn);
				} else if(svlnSclCd == "070" || svlnSclCd == "071" ||svlnSclCd == "072"){ 
					returnMapping = mapping006070('info');
					returnWorkMapping = mapping006070('work');
				} else if(svlnSclCd == "106"){ //기타_예비회선 추가 2023-11-08
					returnMapping = mapping006106('info');
					returnWorkMapping = mapping006106('work');
				} else  {
					returnMapping = mapping006('info', showAppltNoYn);
					returnWorkMapping = mapping006('work', showAppltNoYn);
				}
    		}else{ // ADAMS연동 고도화 아래 추가
    			returnMapping = mappingSkb006('info', showAppltNoYn); // 정보 컬럼 매핑
				returnWorkMapping = mappingSkb006('work', showAppltNoYn); // 작업정보 컬럼 매핑
    		}
    	}
    	//선번정보 추가
    	if (pathAll == true && response != undefined){
    		if(gridDiv == gridId){
    			response.ServiceLineList = makeHeader(response.ServiceLineList, 'info');
    		}else if(gridDiv == gridIdWork){
        		response.ServiceLineWorkList = makeHeader(response.ServiceLineWorkList, 'work');
    		}else{
        		response.ServiceLineList = makeHeader(response.ServiceLineList, 'info');
        		response.ServiceLineWorkList = makeHeader(response.ServiceLineWorkList, 'work');
    		}
    	}
    	//TODO 프론트홀구간정보 추가
    	if (frontHaulPath == true && response != undefined){
    		if(gridDiv == gridId){
    			response.ServiceLineList = frontHaulMakeHeader(response.ServiceLineList, 'info');
    		}else if(gridDiv == gridIdWork){
        		response.ServiceLineWorkList = frontHaulMakeHeader(response.ServiceLineWorkList, 'work');
    		}else{
        		response.ServiceLineList = frontHaulMakeHeader(response.ServiceLineList, 'info');
        		response.ServiceLineWorkList = frontHaulMakeHeader(response.ServiceLineWorkList, 'work');
    		}
    	}
    	//임시 -- 마지막 컬럼에 e2e,시각화편집 버튼 추가
    	//returnMapping = returnMapping.concat(addBtnCols);
    	//returnWorkMapping = returnWorkMapping.concat(addBtnCols);
    	
    	
    	var headerMapping = [];
    	var rowGrouping = [];
    	
    	// RU - 광코어 헤더맵핑
    	if(svlnLclCd == "003" || svlnLclCd == "006") {
    		if(svlnSclCd == "101" || svlnSclCd == "061") {
    			var lesYn = $("input:checkbox[id='leslSrchYn']").is(":checked");
    			
    			if(lesYn) {	// 임차회선이 포함되지 않았을 때
    				headerMapping = [
        							{fromIndex: 'useWaveVal', toIndex: 'emsWaveVal', title: cflineMsgArray['waveInfo']	/* 파장정보 */}
       								, {fromIndex: 'uprMtsoIdNm', toIndex: 'erpUmtsoAddr', title: cflineMsgArray['uprInfo']	/* 상위국정보 */}
       								, {fromIndex: 'lowMtsoIdNm', toIndex: 'erpLmtsoAddr', title: cflineMsgArray['lowInfo']	/* 하위국정보 */}
       								, {fromIndex: 'uprIntgFcltsCdNm', toIndex: 'sisulLineDivNm', title: cflineMsgArray['erpInfo']	/* ERP정보 */}
       								, {fromIndex: 'lineDistm', toIndex: 'eteOhcpnDistm', title: cflineMsgArray['distanceInfo']	/* 거리정보 */}
       								, {fromIndex: 'lineAppltNo', toIndex: 'lineTrmnSchdDt', title: cflineMsgArray['applicationInformation']	/* 청약정보 */}
       								, {fromIndex: 'siteCd', toIndex: 'siteAddrDetl', title: 'Moira 정보'	/* Moira 정보 */}
       								, {fromIndex: 'ovpyObjYn', toIndex: 'fcltsDivCdNm', title: cflineMsgArray['lesLineInfo']	/* 임차회선정보 */}
       						];
    			} else {
    				headerMapping = [
      								{fromIndex: 'useWaveVal', toIndex: 'emsWaveVal', title: cflineMsgArray['waveInfo']	/* 파장정보 */}
       								, {fromIndex: 'uprMtsoIdNm', toIndex: 'erpUmtsoAddr', title: cflineMsgArray['uprInfo']	/* 상위국정보 */}
      								, {fromIndex: 'lowMtsoIdNm', toIndex: 'erpLmtsoAddr', title: cflineMsgArray['lowInfo']	/* 하위국정보 */}
      								, {fromIndex: 'uprIntgFcltsCdNm', toIndex: 'sisulLineDivNm', title: cflineMsgArray['erpInfo']	/* ERP정보 */}
      								, {fromIndex: 'lineDistm', toIndex: 'eteOhcpnDistm', title: cflineMsgArray['distanceInfo']	/* 거리정보 */}
      								, {fromIndex: 'lineAppltNo', toIndex: 'lineTrmnSchdDt', title: cflineMsgArray['applicationInformation']	/* 청약정보 */}
      								, {fromIndex: 'siteCd', toIndex: 'siteAddrDetl', title: 'Moira 정보'	/* Moira 정보 */}
      						];
    			}
    						
    			rowGrouping = ['optlShreRepSvlnNo', 'optlIntgFcltsCd', 'optlLineNm'];
    		}
    	} else {
    		headerMapping = null;
    		rowGrouping = null;
    	}
    	
    	if(gridDiv == gridId){ //기본정보일때
    		 $('#'+gridId).alopexGrid({
	            autoColumnIndex : true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	            rowClickSelect : true,
	            rowSingleSelect : false,
	            numberingColumnFromZero : false,
	    		defaultColumnMapping:{sorting: true},
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    		            	    title: cflineMsgArray['workConvert'], /*"작업전환"*/
	    						    processor: function(data, $cell, grid) {
	    						    	workCnvt();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	var trueCount = 0;
	    						    	for(i=0; i<selectedData.length; i++){
	    						    		if ( nullToEmpty(selectedData[i].svlnWorkMgmtYn) == "Y"  //작업권한이있는지 확인
	    						    			&& nullToEmpty(selectedData[i].svlnStatCd) != "008"		//해지된회선인지 확인
	    						    			&& nullToEmpty(selectedData[i].svlnStatCd) != "300"){ //해지요청중인 회선인지 확인
	    		            				  trueCount++;
	    						    		}
	    						    	}
	    						    	if(trueCount>0){
	    						    		returnValue = true;
	    						    	}
	    						    	return returnValue;
	    						    }
	    					   },
	    					   /*
	    					    * 서비스회선상세정보
	    					    
	    					   {
	    		            	    title: cflineMsgArray['serviceLineDetailInfo'],
	    						    processor: function(data, $cell, grid) {
	    						    	var rowIndex = data._index.row;
	    						    	var dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    						    	
	    						    	showServiceLIneInfoPop( gridId, dataObj, "N");
	    						    }
	    					   },
	    					   */
	    		               {
	    		            	    title: cflineCommMsgArray['restoration'], /*"복원"*/
	    						    processor: function(data, $cell, grid) {
	    						    	lineRestoration();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	var trueCount = 0;
	    						    	for(i=0; i<selectedData.length; i++){
	    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) == "008" 
	    						    				&& (nullToEmpty(selectedData[i].svlnSclCd) != "016" 
	    						    					&& nullToEmpty(selectedData[i].svlnSclCd) != "030"  //5G	    						    					
	    						    					&& nullToEmpty(selectedData[i].svlnSclCd) != "103") ){
	    		            				  trueCount++;
	    						    		}
	    						    	}
	    						    	if(trueCount>0){
	    						    		returnValue = true;
	    						    	}
	    						    	return returnValue;
	    						    }
	    					   },
	    		               {
	    		            	    title: cflineMsgArray['svlnLclSclChange'], /*"RU-광코어로 이동"*/
	    						    processor: function(data, $cell, grid) {
	    						    	updateLclScl();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	var trueCount = 0;
	    						    	for(i=0; i<selectedData.length; i++){
	    						    		if ( nullToEmpty(selectedData[i].svlnSclCd) == "105"
	    						    			&& nullToEmpty(selectedData[i].svlnStatCd) != "300" ){	//해지요청중회선이 아닐경우
	    		            				  trueCount++;
	    						    		}
	    						    	}
	    						    	if(trueCount>0){
	    						    		returnValue = true;
	    						    	}
	    						    	return returnValue;
	    						    }
	    					   }
	    					  ,
	    					   {
	    						   	// RU광코어 고도화 : 대표회선번호 설정
	    		            	    title: cflineMsgArray['representaionLineSet'],	/* 대표회선 설정 */
	    						    processor: function(data, $cell, grid) {
	    						    	setRepresentationLine(data);
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	var trueCount = 0;
	    						    	
	    						    	for(i=0; i<selectedData.length; i++){
	    						    		if ( ( nullToEmpty(selectedData[i].svlnLclCd) == "003" && nullToEmpty(selectedData[i].svlnSclCd) == "101" )
	    						    				&& nullToEmpty(selectedData[i].svlnStatCd) != "008" 
	    						    				&& nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지와 해지요청중이 아니고 RU 광코어 일 때만
	    		            				  trueCount++;
	    						    		}
	    						    	}
	    						    	
	    						    	if(trueCount>0){
	    						    		returnValue = true;
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    }
	    					   }
	    		               ],
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		columnMapping : returnMapping,
	    		tree : { useTree:useTreeYn(), idKey:'treeNo', parentIdKey : 'treePrntNo', expandedKey : 'treeDivVal'},
	    		headerGroup: headerMapping,
	    		grouping: {
	    			  by: rowGrouping,
	    			  useGrouping : true,
			          useGroupRowspan : true,
	    		} ,
	    		rowSelectOption: {
	    			groupSelect: false
	    		},
	    		rowOption:{inlineStyle: function(data,rowOption){
	    				if(data['svlnWorkYn'] == 'Y') return {color:'red'} // background:'orange',
	    			}
		    		, allowSelect: function(data){
		    			if( data.treePrntNo){
		    				if (data.svlnNo == data.treePrntNo ) {
		    					return false;
		    				} else {
			    				return true;
		    				}
	    				} else {
	    					return true;
	    				}
	    			}
	    		}
	    	});
    		 if(svlnSclCd != "101") {
    			 $('#'+gridId).alopexGrid("columnFix", 4);
    		 } else {
    			 AlopexGrid.clearSetup();
    			 $('#'+gridId).alopexGrid("columnFix", 7);
    		 }
		} else if (gridDiv == gridIdWork){ //작업정보일때
			if($('#mgmtGrpCd').val() == "0001" || $('#svlnLclCd').val() == "004"){ // ADAMS 연동 고도화 "해지" 비활성화를 위해 추가
				//그리드 생성
		        $('#'+gridIdWork).alopexGrid({
		        	autoColumnIndex: true,
		        	autoResize: true,
		        	cellSelectable : false,
		        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
		        	rowInlineEdit : true, //행전체 편집기능 활성화
		        	rowClickSelect : true,
		        	rowSingleSelect : false,
		        	numberingColumnFromZero: false,
		        	defaultColumnMapping:{sorting: true},
		        	enableDefaultContextMenu:false,
		    		enableContextMenu:true,
		    		contextMenu : [
		    		               {
		    							title: "작업 정보 저장",
		    						    processor: function(data, $cell, grid) {
		    						    	workUpdate();
		    						    },
		    						    use: function(data, $cell, grid) {
		    						    	var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    						    	
		    						    	//return data._state.selected;
		    						    }
		    					   },
		    		               {
		    		            	   title: "작업 정보 완료",
		    		            	   processor: function(data, $cell, grid) {
		    		            		   workInfFnsh("");
		    		            	   },
		    		            	   use: function(data, $cell, grid) {
		    		            		   var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    		            	   }
		    		               },
		    		               {
		    		            	   title: "모든 작업 정보 완료",
		    		            	   processor: function(data, $cell, grid) {
		    		            		   workInfFnsh("A");
		    		            	   },
		    		            	   use: function(data, $cell, grid) {
		    		            		   var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    		            	   }
		    		               },
		    		               {
		    		            	   title: "해지",
		    		            	   processor: function(data, $cell, grid) {
		    		            		   delWorkInfo();
		    		            	   },
		    		            	   use: function(data, $cell, grid) {
		    		            		   var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    		            		   return data._state.selected;
		    		            	   }
		    		               }
		    		               /*
		    					    * 서비스회선상세정보
		    					    
		    					   {
		    		            	    title: cflineMsgArray['serviceLineDetailInfo'],
		    						    processor: function(data, $cell, grid) {
		    						    	var rowIndex = data._index.row;
		    						    	var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
		    						    	
		    						    	showServiceLIneInfoPop( gridIdWork, dataObj, "Y");
		    						    }
		    					   }
		    					   */
		    		               , // 1. [수정] RM선번편집 창 자동열기
		    		               {
		    		            	     title: cflineMsgArray['rmLinePathSearch']//RM선번조회   "RM선번적용"
		    		            	   , processor: function(data, $cell, grid) {
		    		            		   var rowIndex = data._index.row;
		    						       var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
		    		            		   openRmLinePop(dataObj);
		    		            	   }
			    		               , use: function(data, $cell, grid) {
		    		            		   var rowIndex = data._index.row;
		    						       var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
		    		            		   
		    						       // SKT / 기지국회선(001) // LTE(016), IP전송로(020), 5G(030) 이외 
		    						       if (data._state.selected == true && dataObj.mgmtGrpCd == "0001" && dataObj.svlnLclCd == "001" && dataObj.svlnSclCd != "016"
		    						    	   && dataObj.svlnSclCd != "020" && dataObj.svlnSclCd != "030") {
		    		            			   return true;
		    		            		   } else {
		    		            			   return false;
		    		            		   }
		    		            	   }
		    		               }
		    		               ],
		        	message: {
		    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
		    		},
		        	columnMapping:returnWorkMapping,
		    		tree : { useTree:useTreeYn(), idKey:'treeNo', parentIdKey : 'treePrntNo', expandedKey : 'treeDivVal'},
		    		headerGroup: headerMapping ,
		    		grouping: {
		    			  by: rowGrouping,
		    			  useGrouping : true,
				          useGroupRowspan : true,
		    		} ,
		    		rowSelectOption: {
		    			groupSelect: false
		    		}
		        });
			}else{  // ADAMS 연동 고도화 추가
				//그리드 생성
		        $('#'+gridIdWork).alopexGrid({
		        	autoColumnIndex: true,
		        	autoResize: true,
		        	cellSelectable : false,
		        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
//		        	rowInlineEdit : true, //행전체 편집기능 활성화
		        	rowInlineEdit : false, //행전체 편집기능 안됨 // ADAMS 연동 고도화
		        	rowClickSelect : true,
		        	rowSingleSelect : false,
		        	numberingColumnFromZero: false,
		        	defaultColumnMapping:{sorting: true},
		        	enableDefaultContextMenu:false,
		    		enableContextMenu:true,
		    		contextMenu : [
		    		               /* ADAMS 연동 고도화 
		    		               {
		    							title: "작업 정보 저장",
		    						    processor: function(data, $cell, grid) {
		    						    	workUpdate();
		    						    },
		    						    use: function(data, $cell, grid) {
		    						    	var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    						    	
		    						    	//return data._state.selected;
		    						    }
		    					   },
		    		               {
		    		            	   title: "작업 정보 완료",
		    		            	   processor: function(data, $cell, grid) {
		    		            		   workInfFnsh("");
		    		            	   },
		    		            	   use: function(data, $cell, grid) {
		    		            		   var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    		            	   }
		    		               },
		    		               {
		    		            	   title: "모든 작업 정보 완료",
		    		            	   processor: function(data, $cell, grid) {
		    		            		   workInfFnsh("A");
		    		            	   },
		    		            	   use: function(data, $cell, grid) {
		    		            		   var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    		            	   }
		    		               }
		    		               ,
		    		               { 
		    		            	   title: "해지",
		    		            	   processor: function(data, $cell, grid) {
		    		            		   delWorkInfo();
		    		            	   },
		    		            	   use: function(data, $cell, grid) {
		    		            		   var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
		    						    	var returnValue = false;
		    						    	var trueCount = 0;
		    						    	
		    						    	for(i=0; i<selectedData.length; i++){
		    						    		if ( nullToEmpty(selectedData[i].svlnStatCd) != "300"){ // 회선상태가 해지요청중이 아닌 것
		    		            				  trueCount++;
		    						    		}
		    						    	}
		    						    	
		    						    	if(trueCount>0){
		    						    		returnValue = data._state.selected;
		    						    	}
		    						    	
		    						    	return returnValue;
		    		            		   return data._state.selected;
		    		            	   }
		    		               } */
		    		               /*
		    					    * 서비스회선상세정보
		    					    
		    					   {
		    		            	    title: cflineMsgArray['serviceLineDetailInfo'],
		    						    processor: function(data, $cell, grid) {
		    						    	var rowIndex = data._index.row;
		    						    	var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
		    						    	
		    						    	showServiceLIneInfoPop( gridIdWork, dataObj, "Y");
		    						    }
		    					   }
		    		               , 
		    		                */
		    		                // 1. [수정] RM선번편집 창 자동열기
		    		               {
		    		            	     title: cflineMsgArray['rmLinePathSearch']//RM선번조회   "RM선번적용"
		    		            	   , processor: function(data, $cell, grid) {
		    		            		   var rowIndex = data._index.row;
		    						       var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
		    		            		   openRmLinePop(dataObj);
		    		            	   }
			    		               , use: function(data, $cell, grid) {
		    		            		   var rowIndex = data._index.row;
		    						       var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
		    		            		   
		    						       // SKT / 기지국회선(001) // LTE(016), IP전송로(020), 5G(030) 이외 
		    						       if (data._state.selected == true && dataObj.mgmtGrpCd == "0001" && dataObj.svlnLclCd == "001" && dataObj.svlnSclCd != "016"
		    						    	   && dataObj.svlnSclCd != "020" && dataObj.svlnSclCd != "030") {
		    		            			   return true;
		    		            		   } else {
		    		            			   return false;
		    		            		   }
		    		            	   }
		    		               }
		    		               ],
		        	message: {
		    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
		    		},
		        	columnMapping:returnWorkMapping,
		    		tree : { useTree:useTreeYn(), idKey:'treeNo', parentIdKey : 'treePrntNo', expandedKey : 'treeDivVal'},
		    		headerGroup: headerMapping ,
		    		grouping: {
		    			  by: rowGrouping,
		    			  useGrouping : true,
				          useGroupRowspan : true,
		    		} ,
		    		rowSelectOption: {
		    			groupSelect: false
		    		}
		        });
			}
   		 
	        if(svlnSclCd != "101") {
	   			 $('#'+gridIdWork).alopexGrid("columnFix", 4);
	   		 } else {
	   			 AlopexGrid.clearSetup();
	   			 $('#'+gridIdWork).alopexGrid("columnFix", 6);
	   		 }
   		 
	    	//	작업 정보 편집모드 활성화
	    	$("#"+gridIdWork).alopexGrid("startEdit");
		}else{
	        $('#'+gridId).alopexGrid({
	            autoColumnIndex : true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	            rowClickSelect : true,
	            rowSingleSelect : false,
	            numberingColumnFromZero : false,
	    		defaultColumnMapping:{sorting: true},
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    		            	    title: cflineMsgArray['workConvert'], /*"작업전환"*/
	    						    processor: function(data, $cell, grid) {
	    						    	workCnvt();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	var trueCount = 0;
	    						    	for(i=0; i<selectedData.length; i++){
	    						    		if ( nullToEmpty(selectedData[i].svlnWorkMgmtYn) == "Y"  ){
	    		            				  trueCount++;
	    						    		}
	    						    	}
	    						    	if(trueCount>0){
	    						    		returnValue = true;
	    						    	}
	    						    	return returnValue;
	    						    }
	    					   }
	    		               ],
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		columnMapping : returnMapping,
	    		tree : { useTree:true, idKey:'treeNo', parentIdKey : 'treePrntNo',expandedKey : 'treeDivVal'},
	    		headerGroup: headerMapping,
	    		grouping: {
	    			  by: rowGrouping,
	    			  useGrouping : true,
			          useGroupRowspan : true,
	    		} ,
	    		rowSelectOption: {
	    			groupSelect: false
	    		},
	    		rowOption:{inlineStyle: function(data,rowOption){
	    				if(data['svlnWorkYn'] == 'Y') return {color:'red'} // background:'orange',
	    			}
		    		, allowSelect: function(data){
		    			if( data.treePrntNo){
		    				if (data.svlnNo == data.treePrntNo ) {
		    					return false;
		    				} else {
			    				return true;
		    				}
	    				} else {
	    					return true;
	    				}
	    			}
	    		}
	    	}); 
	        
	        //그리드 생성
	        $('#'+gridIdWork).alopexGrid({
	        	autoColumnIndex: true,
	        	autoResize: true,
	        	cellSelectable : false,
	        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	        	rowInlineEdit : true, //행전체 편집기능 활성화
	        	rowClickSelect : true,
	        	rowSingleSelect : false,
	        	numberingColumnFromZero: false,
	        	defaultColumnMapping:{sorting: true},
	        	enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    							title: "작업 정보 저장",
	    						    processor: function(data, $cell, grid) {
	    						    	workUpdate();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	return data._state.selected;
	    						    }
	    					   },
	    		               {
	    		            	   title: "작업 정보 완료",
	    		            	   processor: function(data, $cell, grid) {
	    		            		   workInfFnsh("");
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   return data._state.selected;
	    		            	   }
	    		               },
	    		               {
	    		            	   title: "모든 작업 정보 완료",
	    		            	   processor: function(data, $cell, grid) {
	    		            		   workInfFnsh("A");
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   return data._state.selected;
	    		            	   }
	    		               },
	    		               {
	    		            	   title: "해지",
	    		            	   processor: function(data, $cell, grid) {
	    		            		   delWorkInfo();
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   return data._state.selected;
	    		            	   }
	    		               }
	    		               , // 1. [수정] RM선번편집 창 자동열기
	    		               {
	    		            	     title: cflineMsgArray['rmLinePathSearch']//RM선번조회"RM선번적용"
	    		            	   , processor: function(data, $cell, grid) {
	    		            		   var rowIndex = data._index.row;
	    						       var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    		            		   openRmLinePop(dataObj);
	    		            	   }
	    		            	   , use: function(data, $cell, grid) {
	    		            		   var rowIndex = data._index.row;
	    						       var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    		            		   
	    						       // SKT / 기지국회선(001) // LTE(016), 5G(030) 이외
	    						       if (data._state.selected == true && dataObj.mgmtGrpCd == "0001" && dataObj.svlnLclCd == "001" && dataObj.svlnSclCd != "016" && dataObj.svlnSclCd != "030") {
	    		            			   return true;
	    		            		   } else {
	    		            			   return false;
	    		            		   }
	    		            	   }
	    		               }
	    		               ],
	        	message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
	    		},
	        	columnMapping:returnWorkMapping,
	    		tree : { useTree:useTreeYn(), idKey:'treeNo', parentIdKey : 'treePrntNo', expandedKey : 'treeDivVal'},
	    		headerGroup: headerMapping,
	    		grouping: {
	    			  by: rowGrouping,
	    			  useGrouping : true,
			          useGroupRowspan : true,
	    		} ,
	    		rowSelectOption: {
	    			groupSelect: false
	    		}
	        });     
	        
	        if(svlnSclCd != "101") {
	   			 $('#'+gridId).alopexGrid("columnFix", 4);
	   			 $('#'+gridIdWork).alopexGrid("columnFix", 4);
	   		 } else {
	   			 AlopexGrid.clearSetup();
	   			 $('#'+gridId).alopexGrid("columnFix", 6);
	   			$('#'+gridIdWork).alopexGrid("columnFix", 6);
	   		 }
	    	
	    	//	작업 정보 편집모드 활성화
	    	$("#"+gridIdWork).alopexGrid("startEdit");
		}
    } 
    
    function onloadMgmtGrpChange(){
    	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
    }
    
    // 전송망 설정
    function openRepeaterMgmt() {
    	var repeaterData = null;
    	var element =  $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
		var selectCnt = element.length;
		
		if(selectCnt <= 0){
			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
			return;
		} else if (selectCnt > 1) {
			alertBox('W', cflineMsgArray['selectOnlyOneItem']/* 여러개가 선택되었습니다. 하나만 선택하세요. */); 
			return;
		} else {
			// RU-중계기 인지 체크
			var listData = null;
			var mgmtGrpChk = true;
			for(i=0;i<element.length;i++){
				repeaterData = element[i];
				if (repeaterData.svlnLclCd !='003' || repeaterData.svlnSclCd != '101') {
					mgmtGrpChk = false;
					break;
				}				
			}
			if(mgmtGrpChk == false){				
				alertBox('W', cflineMsgArray['onlyRuRepeater']);/*중계기 설정은 RU회선의 광코어인 경우만 설정가능합니다.*/
				return;
			}
		}
    	
    	/*중계기설정팝업*/
		$a.popup({
		  	popid: "RepeaterMgmtPop",
		  	title: cflineMsgArray['repeaterMgmt'],
			url: $('#ctx').val()+"/configmgmt/cfline/RepeaterMgmtPop.do",
			data: repeaterData,
		    //iframe: false,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : 1500,
			height : window.innerHeight * 0.9,
			callback:function(data){
				//console.log(data);
				/*;
				if (data != null && data.type != undefined && data.type == "W") {
					
					if (data.changeYn == "Y") {
						
						$('#btnSearch').click();
					}
				}*/
				
				if (data != null && data == 'Y') {
					$('#btnSearch').click();
				}
				// 다른 팝업에 영향을 주지 않기 위해
				$.alopex.popup.result = null;
			}
		});
    }
    
 // FDF사용정보 전송(서비스회선/링편집시만 호출됨)
   function sendFdfUseInfo(flag ) {	
      sendFdfUseInfoCommon(fdfUsingInoLineNo, "S", "B", null);   
   }
   
 //COT장비 찾기(그리드ID, 장비코드필드, 장비명필드, 좌포트코드필드, 좌포트명필드, 우포트코드필드, 우포트명필드, 파라메터 ) 
   function openCotEqpPop(GridId, eqpId, eqpNm,eqpMatchNm, portLftId, portLftNm,portLftMatchNm, portRghId , portRghNm ,portRghMatchNm, param){
   	var urlPath = $('#ctx').val();
   	if(nullToEmpty(urlPath) ==""){
   		urlPath = "/tango-transmission-web";
   	}

   	$a.popup({
   	  	popid: "popEqpRmSch_" + eqpId,
   	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
//   	  	url: urlPath + '/configmgmt/equipment/EqpLkup.do',
   	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
   	  	data: param,
   		modal: true,
   		movable:true,
   		width : 1200,
   		height : 810,
   		callback:function(data){
   			if(data != null){
   				if(GridId != null && GridId != ""){
   		    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
   		    		var rowIndex = focusData[0]._index.data;
   					//alert(data.mtsoNm);
   					//alert(rowIndex);
   					$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, eqpId);
   					$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, eqpNm);
   					$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, eqpMatchNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portLftId);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portLftNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portLftMatchNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portRghId);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portRghNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portRghMatchNm);
   				}else{	
   					$("#" + eqpId).val(data.neNm);
   					$("#" + eqpNm).val(data.neId);
   					$("#" + eqpNm).attr('style', 'background-color:#e2e2e2');
   					$("#" + portId).val(data.neNm);
   					$("#" + portNm).val(data.neId);
   					$("#" + portNm).attr('style', 'background-color:#ffffff');
   				}
   			}else{
   				if(GridId != null && GridId != ""){
   		    		/*var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
   		    		var rowIndex = focusData[0]._index.data;
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, eqpId);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, eqpNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, eqpMatchNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portLftId);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portLftNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portLftMatchNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portRghId);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portRghNm);
   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portRghMatchNm);*/
   				}else{	
   					$("#" + eqpId).val("");
   					$("#" + eqpNm).val("");
   					$("#" + eqpNm).attr('style', 'background-color:#ffffff');
   				}
   			}
   		}
   	});		
   }
   
   //COT포트 찾기 팝업  사용함(그리드ID, 포트코드필드, 포트명필드, 장비ID, 검색할 포트명) 
   function openCotPortPop(GridId, portId, portNm, portMatchNm ,paramEqpId, searchPortNm){
   	var param = new Object();
   	$.extend(param,{"neId":nullToEmpty(paramEqpId)});
   	$.extend(param,{"portNm":nullToEmpty(searchPortNm)});
   	
   	var urlPath = $('#ctx').val();
   	if(nullToEmpty(urlPath) ==""){
   		urlPath = "/tango-transmission-web";
   	}
   	
   	$a.popup({
   	  	popid: "popPortRmSch_" + portId,
   	  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
   	  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
   	  	data: param,
   		modal: true,
   		movable:true,
   		width : 1100,
   		height : 740,
   		callback:function(data){
   			if(data != null){
   				if(GridId != null && GridId != ""){
   		    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
   		    		var rowIndex = focusData[0]._index.data;
   					$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, portId);
   					$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, portNm);
   					$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, portMatchNm);
   				}else{
   					$("#" + portId).val(data[0].portId);
   					$("#" + portNm).val(data[0].portNm);
   					$("#" + portMatchNm).val(data[0].portMatchNm);
   				}
   			}
   		}
   	}); 
   }
   
   
   // RU 고도화 : 대표회선 설정
   function setRepresentationLine(param) {
	   var element = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
	   var selectCnt = element.length;
	   
	   if(selectCnt <= 0) {
		   alertBox('W', cflineMsgArray['selectNoData']);		/* 선택된 데이터가 없습니다. */
		   return;
	   } else if (selectCnt > 1) {
		   alertBox('W', cflineMsgArray['selectOnlyOneItem']);		/* 선택된 데이터가 없습니다. */
		   return;
	   }

	   $a.popup({
		  	popid: "RepresentationLineSetPop",
		  	title: "RU "+ cflineMsgArray['opticalCore'] + " " + cflineMsgArray['representaionLineSet'],
			url: $('#ctx').val()+'/configmgmt/cfline/RepresentationLineSetPop.do',
			data: param,
			iframe: true,
			modal: false,
		    movable:true,
		    windowpopup : true,
			width : 1500,
			height : 800,
			callback:function(data){
	    		if(data == "OK") {
	    			searchProc();
	    		}
			}
		});
   }
   	
   // 승인버튼 활성화 : RU, B2B, 중계기정합장치 - 회선상태가 해지요청중이면 승인버튼 활성화
   function setApprovalBtn(param) {
	   if ( param != null ) {
		   if ( param[0].svlnLclCd == "003" || param[0].svlnLclCd == "005" || ( param[0].svlnLclCd == "006" && param[0].svlnSclCd == "061" ) ) {
			   // 건수만큼 체크 필요
			   var chkStat = true;
			   for (var i = 0; i < param.length; i++) {
				   if (param[i].svlnStatCd != "300") {
					   chkStat = false;
					   break;
				   }
			   }
			   
			   if( chkStat == true ) {
				   $('#btnApproval').show();
				   $('#btnApproval').setEnabled(true);
				   $('#btnLineTrmn').setEnabled(false);
			   }
			   else {
				   $('#btnApproval').setEnabled(false);
					$('#btnLineTrmn').setEnabled(true);
			   }
		   }
		   else {
			   $('#btnApproval').hide();
			   //$('#btnApproval').setEnabled(false);
		   }
	   }
	   else {
		   if ( $('#svlnLclCd').val() == "003" || $('#svlnLclCd').val() == "005" || ( $('#svlnLclCd').val() == "006" && $('#svlnSclCd').val() == "061" ) ) {
			   $('#btnApproval').show();
			   $('#btnApproval').setEnabled(false);
		   }
		   else {
			   $('#btnApproval').hide();
			   $('#btnApproval').setEnabled(false);
		   }
	   }
   }
   
   // [추가] 20181217 회선정보 버튼 활성화
   function setGridIdBtn() {
	   var selectedId = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
		if(selectedId.length > 0) {
			
			// 서비스회선상태가 해지이면
			for ( var i = 0; i < selectedId.length; i++ ) {
				if ( selectedId[i].svlnStatCd == "008" ) {
					$('#btnWorkCnvt').setEnabled(false);
					$('#btnSetRprtLine').setEnabled(false);
				}
				else {
					$('#btnWorkCnvt').setEnabled(true);
					
					if ( svlnLclCd == "003" && svlnSclCd == "101" ) {
						$('#btnSetRprtLine').setEnabled(true);
					}
				}
			}
		}else {
			$('#btnWorkCnvt').setEnabled(false);
			$('#btnSetRprtLine').setEnabled(false);
		}
   }
   
});
