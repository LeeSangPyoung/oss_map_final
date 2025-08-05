/**
 * CardMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {
    
	var gridId = 'dataGrid';
	var eqpRoleDivCdList;
	var bpIdList;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };
    
    function setRegDataSet(data) {
    	
    	$('#useYn').setSelected("Y");
    		
    }

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
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'] , 
				width: '50px',
				numberingColumn: true 
			}, {/* 카드모델ID--숨김데이터		 */
				key : 'cardMdlId', align:'center',
				title : configMsgArray['cardModelIdentification'], 
				width: '100px'
			}, {/* 카드모델명		 */
				key : 'cardMdlNm', align:'center',
				title : configMsgArray['cardModelName'], 
				width: '180px'
			}, {/* SKT사용여부		 */
				key : 'sktYn', align:'center',
				title : configMsgArray['skTelecomUseYesOrNo'],
				width: '100px'
			}, {/* SKB사용여부		 */
				key : 'skbYn', align:'center',
				title : configMsgArray['skBroadBandUseYesOrNo'],
				width: '100px'
			}, {/* 제조사ID--숨김데이터		 */
				key : 'bpId', align:'center',
				title : configMsgArray['vendorIdentification'], 
				width: '100px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {/* 장비모델명		 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '180px'
			}, {/* 카드모델유형코드--숨김데이터	 */
				key : 'cardMdlTypCd', align:'center',
				title : configMsgArray['cardModelTypeCode'],
				width: '130px'
			}, {/* 카드모델유형	 */
				key : 'cardMdlTypNm', align:'center',
				title : configMsgArray['cardModelType'],
				width: '130px'
			}, {/* 카달로그ID		 */
				key : 'cardCtlgId', align:'center',
				title : configMsgArray['catalogIdentification'],
				width: '100px'
			}, {/* 카드용량코드1     */
				key : 'cardCapaCd1', align:'center',
				title : configMsgArray['cardCapacityCode']+'1',
				width: '105px'
			}, {/* 포트수 	1	 */
				key : 'portCnt1', align:'center',
				title : configMsgArray['portCount']+'1',
				width: '100px'
			}, {/* 카드용량코드2     */
				key : 'cardCapaCd2', align:'center',
				title : configMsgArray['cardCapacityCode']+'2',
				width: '105px'
			}, {/* 포트수 	2	 */
				key : 'portCnt2', align:'center',
				title : configMsgArray['portCount']+'2',
				width: '100px'
			}, {/* 카드용량코드3	 */
				key : 'cardCapaCd3', align:'center',
				title : configMsgArray['cardCapacityCode']+'3',
				width: '105px'
			}, {/* 포트수 	3	 */
				key : 'portCnt3', align:'center',
				title : configMsgArray['portCount']+'3',
				width: '100px'
			}, {/* 카드모델첨부파일명 */
				key : 'cardMdlAtflNm', align:'center',
				title : configMsgArray['cardModelAttachedFileName'],
				width: '120px'
			}, {/* UKEY슬롯카드종류 */
				key : 'ukeySlotCardKndCd', align:'center',
				title : configMsgArray['ukeySlotCardKind'],
				width: '130px'
			}, {/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '130px'				
			},{/* 등록자		 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'	
			},{/* 변경일자		 */ 
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '130px'				
			},{/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'		
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
    };
    
    function gridHide() {
    	
    	var hideColList = ['cardMdlId', 'bpId', 'cardMdlTypCd', 'cardMdlAtflNm', 'cardCtlgId'];
    	
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
		 
		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

		//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
	    //장비타입 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
	    //제조사 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
	   	//장비모델 조회
	   	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
		//카드타입
	   	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00029', null,'GET', 'cardMdlTypCd');	
   }
 
    function setEventListener() {
    	
    	var perPage = 100;
    	
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
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage);
       		}
     	 });
         
       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {
    		 
    		 var mgmtGrpNm = $("#mgmtGrpNm").val();
    		 var mgmtGrpNmP = "";

    		 if(mgmtGrpNm == '전체'){
    			 mgmtGrpNm = 'ALL';
    			 mgmtGrpNmP = "";
    		 }else{
    			 mgmtGrpNmP = mgmtGrpNm;
    		 }
    		 
    		 var param = {"mgmtGrpNm": mgmtGrpNmP};
    		 
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'fstTeam');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ mgmtGrpNm, null, 'GET', 'eqpRoleDivCd');
    		 //장비모델 조회
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
    		 //제조사 조회
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
         });
    	 
    	 $('#eqpRoleDivCdList').multiselect({
    		 open: function(e){
    			 eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
    		 },
    		 beforeclose: function(e){
    			 var codeID =  $("#eqpRoleDivCdList").getData();
         		 var param = "mgmtGrpNm="+ $("#mgmtGrpNm").getTexts()[0];
         		 var cnt = 0;
         		 
         		 if(eqpRoleDivCdList+"" != codeID.eqpRoleDivCdList+""){
	         		 if(codeID.eqpRoleDivCdList == ''){
	         			
	         		 }else {
	         			for(var i=0; codeID.eqpRoleDivCdList.length > i; i++){
	         				param += "&comCdMlt1=" + codeID.eqpRoleDivCdList[i];
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
         	//tango transmission biz 모듈을 호출하여야한다.
    		 dataParam = {"regYn" : "N"};
    		 popup('CardMdlReg', $('#ctx').val()+'/configmgmt/cardmdlmgmt/CardMdlReg.do', '카드모델 등록', dataParam);
         });
    	 
    	/*// 시공업체 조회
         $('#btnSearchBp').on('click', function(e) {
         	setBp('bpId', 'bpNm');
         });*/
         
         
    	 
    	 /*$('#bpSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'bpSearch',
    	          	title: false,
    	            url: '/tango-common-business-web/business/popup/PopupBpList.do',
    	            width : 750,
    	           	height : window.innerHeight * 0.75,
    	           	modal: true,
                    movable:true,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행 
    	                $('#bpId').val(data.bpId);
    	                $('#bpNm').val(data.bpNm);
    	           	}
    	      });
         });*/
    	 
     	//엑셀다운 
    	 $('#btnExportExcel').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#searchForm").getData();
    		 var eqpRoleDivCd = "";
    		 var bpId = "";
    		 var eqpMdlId = "";
    		 
    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 10;   
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;   
    		 if (param.eqpRoleDivCdList != "" && param.eqpRoleDivCdList != null ){
    			 for(var i=0; i<param.eqpRoleDivCdList.length; i++) {
    				 if(i == param.eqpRoleDivCdList.length - 1){
    					 eqpRoleDivCd += param.eqpRoleDivCdList[i];
                     }else{
                    	 eqpRoleDivCd += param.eqpRoleDivCdList[i] + ",";
                     }
     			}
    			param.eqpRoleDivCd = eqpRoleDivCd ;	
    			param.eqpRoleDivCdList = [];
    		 }
    		 
    		 if (param.bpIdList != "" && param.bpIdList != null ){
    			 for(var i=0; i<param.bpIdList.length; i++) {
    				 if(i == param.bpIdList.length - 1){
    					 bpId += param.bpIdList[i];
                     }else{
                    	 bpId += param.bpIdList[i] + ",";
                     }
     			}
    			param.bpId = bpId ;	
    			param.bpIdList = [];
    		 }
    		 
    		 if (param.eqpMdlIdList != "" && param.eqpMdlIdList != null ){
    			 for(var i=0; i<param.eqpMdlIdList.length; i++) {
    				 if(i == param.eqpMdlIdList.length - 1){
    					 eqpMdlId += param.eqpMdlIdList[i];
                     }else{
                    	 eqpMdlId += param.eqpMdlIdList[i] + ",";
                     }
     			}
    			param.eqpMdlId = eqpMdlId ;	
    			param.eqpMdlIdList = [];
    		 }
    		 
    		 param.fileName = configMsgArray['cardMdlMgmt']; /* 카드모델관 */
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getCardMdlMgmtList";

    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cardmdlmgmt/excelcreate', param, 'GET', 'excelDownload');
         });
         
    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;
      	 	/* 카드모델상세조회 */
    	 	popup('CardMdlDtlLkup', $('#ctx').val()+'/configmgmt/cardmdlmgmt/CardMdlDtlLkup.do', configMsgArray['cardMdlDtlLkup'],dataObj);
    	 
    	 });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });       
	};
	
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
		
		//관리그룹
if(flag == 'mgmtGrpNm'){
    		
    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }
    		
    		$('#mgmtGrpNm').clear();
    		
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all']}];
    		
    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					option_data.push(resObj);
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCdNm;
					}
				}
				$('#mgmtGrpNm').setData({
					data:option_data ,
					mgmtGrpNm:selectId
				});
			}
    	}
		
		if(flag == 'cardMdlTypCd'){
    		$('#cardMdlTypCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#cardMdlTypCd').setData({
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
		
		if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.cardMdlMgmt);
    	}
    	
		if(flag == 'excelDownload'){ 
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);
            
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
    
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
		
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	       	
	}
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'cardMdlTypCd'){
    		//실패
    		callMsgBox('','I', configMsgArray['failure'] , function(msgId, msgRst){});
    	}
    	
		if(flag == 'search'){
			//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    	
		if(flag == 'excelDownload'){ 
			//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
        }	
    }

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cardmdlmgmt/cardMdlMgmt', param, 'GET', 'search');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.8,
              });
        }
    
    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})
    	
    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;
		
		}
    }*/
    
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