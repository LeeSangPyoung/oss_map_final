/**
 * EqpMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'sbeqpGrid';
	var fileOnDemendName = "";
	var eqpRoleDivCdList;
	var bpIdList;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [
    			{align:'center', title : '순번', width: '40px', numberingColumn: true},
    			{key : 'mgmtGrpNm', align:'center', title : '관리그룹', width: '70px'},
    			{key : 'tmofNm', align:'center', title : '전송실', width: '90px'},
    			{key : 'sbeqpClNm', align:'center', title : '장비타입', width: '80px'},
    			{key : 'sbeqpVendNm', align:'center',title : '제조사', width: '80px'},
    			{key : 'sbeqpMdlNm', align:'center', title : '부대장비모델명', width: '100px'},
    			{key : 'sbeqpInstlMtsoNm', align:'center', title : '국사명', width: '120px'},
    			{key : 'sbeqpNm', align:'center', title : '부대장비명', width: '150px'},
    			{key : 'sbeqpOpStatNm', align:'center', title : '운용상태', width: '80px'},
    			{key : 'stationName', align:'center', title : 'RMS기지국', width: '120px'},
    			{key : 'sbeqpRmsNm', align:'center', title : 'RMS제원명', width: '120px'},
    			{key: 'upsdMtsoNm', align:'center', title : '상면국사', width: '100px'},
    			{key: 'floorName', align:'center', title : '층', width: '50px'},
    			{key: 'label', align:'center', title : '랙명', width: '80px'},
    			{key: 'rackInAttrYn', align:'center', title : '상면등록여부', width: '90px'},
    			{align : 'center', title : '도면', width : '70px', key: 'rackId',
					render : function(value, data, render, mapping){
						if(data.rackId != '' && data.rackId != null) {
							return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnUpsdLnk" type="button"></button></div>';
						}
						else{
							return false;
						}
					}
				},
    			{key : 'intgFcltsCd', align:'center', title : '국사통시코드', width: '100px'},
    			{key : 'barNo', align:'center', title : '바코드', width: '100px'},
    			{key : 'jrdtTeamOrgNm', align:'center', title : '관리팀', width: '100px'},
    			{key : 'sbeqpId', align:'center', title : '부대장비ID', width: '110px'},
    			{key : 'sbeqpRmsId', align:'center', title : 'RMS ID', width: '140px'},
				{key : 'frstRegDate', align:'center', title : configMsgArray['registrationDate'], width: '100px'},
				{key : 'frstRegUserId', align:'center', title : configMsgArray['registrant'], width: '90px'},
				{key : 'lastChgDate', align:'center', title : configMsgArray['changeDate'], width: '100px'},
				{key : 'lastChgUserId', align:'center', title : configMsgArray['changer'], width: '90px'},
    			{key : 'sbeqpMdlId', align:'center', title : '부대장비모델ID', width: '120px'},
    			{key : 'sbeqpInstlMtsoId', align:'center', title : '국사ID', width: '110px' },
				{key : 'sbeqpClCd', align:'center', title : '부대장비분류명', width: '100px'},
				{key : 'jrdtTeamOrgId', align:'center', title : '관리팀ID', width: '100px'},
				{key : 'mtsoTypCd', align:'center', title : '국사유형코드', width: '100px'},
				{key : 'mtsoTyp', align:'center', title : '국사유형명', width: '100px'}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['sbeqpMdlId', 'sbeqpInstlMtsoId', 'sbeqpClCd', 'jrdtTeamOrgId', 'mtsoTypCd', 'mtsoTyp'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	 var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		 if(chrrOrgGrpCd == "SKT"){
			 $("#sktMtso").show();
			 $("#skbMtso").hide();
		 }else{
			 $("#sktMtso").hide();
			 $("#skbMtso").show();
			 $('#intgFcltsCd').setEnabled(false);
		 }

		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

		//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
    	//부대장비 분류 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02406', null, 'GET', 'sbeqpClCd');

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpOpStat');

    }

    function setEventListener() {

          var perPage = 100;

         $('#'+gridId).on('click', '#btnUpsdLnk', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
// 			var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};
 			var data = {itemId: dataObj.rackId};

 			$a.popup({
 				title: '드로잉 툴',
 				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
 				data: data,
 				iframe: false,
 				windowpopup: true,
 				movable:false,
 				width : screen.availWidth,
 				height : screen.availHeight
 			});
 		});


     	// 페이지 번호 클릭시
     	 $('#'+gridId).on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	main.setGrid(eObj.page, eObj.pageinfo.perPage);
          });

     	//페이지 selectbox를 변경했을 시.
          $('#'+gridId).on('perPageChange', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	perPage = eObj.perPage;
          	main.setGrid(1, eObj.perPage);
          });

     	//조회
     	 $('#btnSearch').on('click', function(e) {
     		 main.setGrid(1,perPage);
          });

     	//엔터키로 조회
          $('#sbeqpSearchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			main.setGrid(1,perPage);
        		}
      	 });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 if(mgmtGrpNm == "SKT"){
    			 $("#sktMtso").show();
    			 $("#skbMtso").hide();
    			 $('#intgFcltsCd').setEnabled(true);
    		 }else{
    			 $("#sktMtso").hide();
    			 $("#skbMtso").show();
    			 $('#intgFcltsCd').setEnabled(false);
    		 }

    		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
         });

       //본부 선택시 이벤트
    	 $('#orgId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();

    		 if(orgID.orgId == ''){
    			 var mgmtGrpNm = $("#mgmtGrpNm").val();

    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTeamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
    		 }
         });

    	 // 팀을 선택했을 경우
    	 $('#teamId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#teamId").getData();

     	 	 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		 var mgmtGrpNm = $("#mgmtGrpNm").val();

			     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }

    	 });

    	 $('#eqpRoleDivCdList').multiselect({ // 분류를 여러개 선택했을시 해당 분류에 따른 제조사들 조회 . rjs
    		 open: function(e){
    			 eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
    		 },
    		 beforeclose: function(e){
    			 var codeID =  $("#eqpRoleDivCdList").getData();
         		 var param = "mgmtGrpNm="+ $("#mgmtGrpNm").getTexts()[0];
         		 var cnt = 0;

         		 if(eqpRoleDivCdList+"" != codeID.eqpRoleDivCdList+""){
	         		 if(codeID.eqpRoleDivCdList == ''){

	         			$('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
	    				$('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');

	         		 }else {
	         			for(var i=0; codeID.eqpRoleDivCdList.length > i; i++){
	         				param += "&comCdMlt1=" + codeID.eqpRoleDivCdList[i];
	         				if(codeID.eqpRoleDivCdList[i] == '11' || codeID.eqpRoleDivCdList[i] == '177' || codeID.eqpRoleDivCdList[i] == '178' || codeID.eqpRoleDivCdList[i] == '182'){
	         					cnt++;
		           			}
	         			}

	         			 if(cnt > 0){
	        				 $('#'+gridId).alopexGrid("showCol", 'upsdRackNo');
	        				 $('#'+gridId).alopexGrid("showCol", 'upsdShlfNo');
	        			 }else{
	        				 $('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
	        				 $('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');
	        			 }
	         		 }

	         		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
	         		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
         		 }
    		 }
    	 });

     	//제조사 선택시 이벤트
    	 $('#bpIdList').multiselect({
    		 open: function(e){
    			 bpIdList = $("#bpIdList").getData().bpIdList;
    		 },
    		 beforeclose: function(e){
	          	//tango transmission biz 모듈을 호출하여야한다.
	     		 var bpId =  $("#bpIdList").getData();
	     		 var eqpRoleDivCd =  $("#eqpRoleDivCdList").getData();
	     		 var param = "mgmtGrpNm="+ $("#mgmtGrpNm").getTexts()[0];
	     		if(bpIdList+"" != bpId.bpIdList+""){
		     	 	 if(bpId.bpIdList == '' && eqpRoleDivCd.eqpRoleDivCdList == ''){

		     	 	 }else if(bpId.bpIdList == '' && eqpRoleDivCd.eqpRoleDivCdList != ''){
		     	 		for(var i=0; eqpRoleDivCd.eqpRoleDivCdList.length > i; i++){
	         				param += "&comCdMlt1=" + eqpRoleDivCd.eqpRoleDivCdList[i];
	         			}
		     		 }else if(bpId.bpIdList != '' && eqpRoleDivCd.eqpRoleDivCdList == ''){
		     			for(var i=0; bpId.bpIdList.length > i; i++){
	         				param += "&comCdMlt2=" + bpId.bpIdList[i];
	         			}
		     		 }else {
		     			for(var i=0; eqpRoleDivCd.eqpRoleDivCdList.length > i; i++){
	         				param += "&comCdMlt1=" + eqpRoleDivCd.eqpRoleDivCdList[i];
	         			}
		     			for(var i=0; bpId.bpIdList.length > i; i++){
	         				param += "&comCdMlt2=" + bpId.bpIdList[i];
	         			}
		     		 }

		     	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
	     		}
    		 }
    	 });

    	//등록
    	 $('#btnReg').on('click', function(e) {
    		 SbeqpReg();
         });

  		$('#btnSbeqpInfStcCurst').on('click', function(e) {
			$a.popup({
				title: '부대장비통계현황',
				url: $('#ctx').val()+'/configmgmt/sbeqpmgmt/SbeqpInfStcCurst.do',
				data: '',
				iframe: false,
				windowpopup: true,
				modal: false,
				movable:true,
				width : 1300,
				height : 700,
			});
		});

 		$('#btnSbeqpInfRegCurst').on('click', function(e) {
			$a.popup({
				title: '부대장비등록현황',
				url: $('#ctx').val()+'/configmgmt/sbeqpmgmt/SbeqpInfRegCurst.do',
				data: '',
				iframe: false,
				windowpopup: true,
				modal: false,
				movable:true,
				width : 1300,
				height : 700,
			});
		});

 		 $('#btnExportExcelOnDemand').on('click', function(e){
	            btnExportExcelOnDemandClickEventHandler(e);
 		 });

    	 $('#btnExportExcel').on('click', function(e) {
    		//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#sbeqpSearchForm").getData();

    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 100;
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;

			var tmofList_Tmp = "";
			var sbeqpClCdList_Tmp = "";
			if (param.tmofList != "" && param.tmofList != null ){
	   			 for(var i=0; i<param.tmofList.length; i++) {
	   				 if(i == param.tmofList.length - 1){
	   					tmofList_Tmp += param.tmofList[i];
	                    }else{
	                    	tmofList_Tmp += param.tmofList[i] + ",";
	                    }
	    			}
	   			param.tmofList = tmofList_Tmp ;
	   		 }

			if (param.sbeqpClCdList != "" && param.sbeqpClCdList != null ){
	   			 for(var i=0; i<param.sbeqpClCdList.length; i++) {
	   				 if(i == param.sbeqpClCdList.length - 1){
	   					sbeqpClCdList_Tmp += param.sbeqpClCdList[i];
	                    }else{
	                    	sbeqpClCdList_Tmp += param.sbeqpClCdList[i] + ",";
	                    }
	    			}
	   			param.sbeqpClCdList = sbeqpClCdList_Tmp ;
	   		 }

    		 /* 장비정보     	 */
    		 param.fileName = '부대장비정보';
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getSbeqpInfMgmtList";

    		 $('#'+gridId).alopexGrid('showProgress');
 	    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/excelcreate', param, 'GET', 'excelDownload');
         });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	dataObj.pageNo = $('#pageNo').val();
     	 	dataObj.rowPerPage = $('#rowPerPage').val();

     	 	/* 부대장비상세정보    	 */
     	 	/****************************************************************************
        	*	New Popup Start
        	*****************************************************************************/
        	var tmpPopId = "E_"+Math.floor(Math.random() * 10) + 1;
        	var paramData = {mtsoEqpGubun :'eqp', mtsoEqpId : dataObj.sbeqpId, parentWinYn : 'Y'};
    		var popMtsoEqp = $a.popup({
    			popid: tmpPopId,
    			title: '통합 국사/장비 정보',
    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
    			data: paramData,
    			iframe: false,
    			modal: false,
    			movable:false,
    			windowpopup: true,
    			width : 900,
    			height : window.innerHeight
    		});
    		//setTimeout(window.close(), 7000);
    		/****************************************************************************
        	*	New Popup End
        	*****************************************************************************/
    	 });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

	};

	 /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //장비조회조건세팅
	        var param =  $("#sbeqpSearchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 100;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();

	   		if ($("#sbeqpClCdList").val() != "" && $("#sbeqpClCdList").val() != null ){
	   			param.sbeqpClCdList = $("#sbeqpClCdList").val() ;
	   		}else{
	   			param.sbeqpClCdList = [];
	   		}

//	   		if ($("#tmofList").val() != "" && $("#tmofList").val() != null ){
//	   			param.tmofList = $("#tmofList").val() ;
//	   		}else{
//	   			param.tmofList = [];
//	   		}
//


         	 /* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = '부대장비정보_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getSbeqpInfMgmtList";
	   		param.excelFlag = "getSbeqpInfMgmtList";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
   		 	$('#'+gridId).alopexGrid('showProgress');
   		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	    }

	function SbeqpReg() {
		 var dataParam = null;
		 var pageNo = $("#pageNo").val();
		 var rowPerPage = $("#rowPerPage").val();
		 if($("#mgmtGrpNm").val()=='SKB'){
			 dataParam = {"regYn" : "N"};
		 }
		 else {
			 dataParam = {"regYn" : "N"};
		 }
		 dataParam.pageNo = pageNo;
		 dataParam.rowPerPage = rowPerPage;
		 /* 장비등록     	 */
		 popup('SbeqpReg','/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do', '부대장비등록', dataParam);
	}

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		//console.log(gridHeader);
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}

	function successCallback(response, status, jqxhr, flag){

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

		//관리그룹
    	if(flag == 'mgmtGrpNm'){

    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }

    		$('#mgmtGrpNm').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCdNm;
						break;
					}
				}
				$('#mgmtGrpNm').setData({
					data:response ,
					mgmtGrpNm:selectId
				});
			}
    	}

    	//본부 콤보박스
    	if(flag == 'fstOrg'){
    		var chrrOrgGrpCd;
    		if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}

			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}

			$('#orgId').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
		    		for(var i=0; i<response.length; i++){
		    			var resObj = response[i];
		    			option_data.push(resObj);
		    			if(resObj.orgId == sUprOrgId) {
							selectId = resObj.orgId;
						}
		    		}
		    		if(selectId == null){
		    			selectId = response[0].orgId;
		    			sUprOrgId = selectId;
		    		}
		    		$('#orgId').setData({
						data:option_data ,
						orgId:selectId
					});
	   		}
	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + sUprOrgId, null, 'GET', 'fstTeam');
    	}

    	if(flag == 'fstTeam'){
    		var chrrOrgGrpCd;
    		if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}

    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamId').clear();

      		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#teamId').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#teamId').val() != ""){
  	    			sOrgId = selectId;
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
    	}

    	if(flag == 'team'){
    		$('#teamId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#teamId').setData({
                 data:option_data
    		});

    	}

		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
		}

		if(flag == 'mdl'){
			$('#eqpMdlIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#eqpMdlIdList').setData({
	             data:option_data
			});
		}

		if(flag == 'bp'){
			$('#bpIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpIdList').setData({
	             data:option_data
			});
		}

    	if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCdList').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#eqpRoleDivCdList').setData({
                 data:option_data
    		});

    	}
    	if(flag == 'eqpOpStat'){

    		$('#sbeqpOpStatCd').clear();

    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		$('#sbeqpOpStatCd').setData({
                data:option_data
    		});
    	}

    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.sbeqpMgmtList);
    	}

    	if(flag == 'sbeqpClCd'){
    		$('#sbeqpClCdList').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#sbeqpClCdList').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
//            console.log('excelCreate');

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
         // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();

        }
    }

	 function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
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

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	 $('#pageNo').val(page);
    	 $('#rowPerPage').val(rowPerPage);
    	 var param =  $("#sbeqpSearchForm").serialize();

	   	 $.each($('form input[type=checkbox]')
        		.filter(function(idx){
        			return $(this).prop('checked') === false
        		}),
        		function(idx, el){
        	var emptyVal = "";
        	param += '&' + $(el).attr('name') + '=' + emptyVal;
	   	 });

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpMgmt', param, 'GET', 'search');
    }

    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : 600
              });
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