/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

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
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			}, {/* 장비모델ID		 */
				key : 'eqpMdlId', align:'center',
				title : configMsgArray['equipmentModelIdentification'],
				width: '100px'
			}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '100px'
			}, {/* 장비모델OID값	 */
				key : 'eqpMdlOidVal', align:'center',
				title : configMsgArray['equipmentModelObjectIdentifierValue'],
				width: '100px'
			}, {/* SKT사용여부		 */
				key : 'sktYn', align:'center',
				title : configMsgArray['skTelecomUseYesOrNo'],
				width: '100px'
			}, {/* SKB사용여부		 */
				key : 'skbYn', align:'center',
				title : configMsgArray['skBroadBandUseYesOrNo'],
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '200px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {/* 제조사ID--숨김데이터		 */
				key : 'bpId', align:'center',
				title : configMsgArray['vendorIdentification'],
				width: '100px'
			}, {/* 장비용량코드--숨김데이터	 */
				key : 'eqpCapaCd', align:'center',
				title : configMsgArray['equipmentCapacityCode'],
				width: '100px'
			}, {/* 용량			 */
				key : 'eqpCapaNm', align:'center',
				title : configMsgArray['capacity'],
				width: '100px'
			}, {/* 장비포트분석값	 */
				key : 'eqpPortAnalVal', align:'center',
				title : configMsgArray['equipmentPortAnalysisValue'],
				width: '100px'
			}, {/* 비고			 */
				key : 'eqpMdlRmk', align:'center',
				title : configMsgArray['remark'],
				width: '100px'
			}, {/* 쉘프사용수  	 */
				key : 'shlfUseCnt', align:'center',
				title : configMsgArray['shelfUseCount'],
				width: '100px'
			}, {/* 공통슬롯수		 */
				key : 'comSlotCnt', align:'center',
				title : configMsgArray['commonSlotCount'],
				width: '100px'
			}, {/* 채널슬롯수		 */
				key : 'chnlSlotCnt', align:'center',
				title : configMsgArray['channelSlotCount'],
				width: '100px'
			}, {/* 슬롯형태구분코드--숨김데이터 	 */
				key : 'slotFrmDivCd', align:'center',
				title : configMsgArray['slotFormDivisionCode'],
				width: '100px'
			}, {/* 슬롯형태      	 */
				key : 'slotFrmDivNm', align:'center',
				title : configMsgArray['slotForm'],
				width: '100px'
			}, {/* 전원이중화여부     */
				key : 'pwrDplxgYn', align:'center',
				title : configMsgArray['powerDuplexingYesOrNo'],
				width: '100px'
			}, {/* 장비가로길이   	 */
				key : 'eqpWidhLen', align:'center',
				title : configMsgArray['equipmentWidthLength'],
				width: '100px'
			}, {/* 장비세로길이   	 */
				key : 'eqpHeghLen', align:'center',
				title : configMsgArray['equipmentHeightLengthLength'],
				width: '100px'
			}, {/* 장비높이     	 */
				key : 'eqpHght', align:'center',
				title : configMsgArray['equipmentHeight'] ,
				width: '100px'
			}, {/* 장비무게    	 */
				key : 'eqpWght', align:'center',
				title : configMsgArray['equipmentWeight'],
				width: '100px'
			}, {/* 정격전압량값  	 */
				key : 'ratnVotqtVal', align:'center',
				title : configMsgArray['ratingVoltageQuantityValue'],
				width: '100px'
			}, {/* 소요전력평균실장값  	 */
				key : 'rqrdEpwrAvgChfVal', align:'center',
				title : '평균(소요전력)',
				width: '110px'
			}, {/* 소요전력최소실장값  	 */
				key : 'rqrdEpwrMinChfVal', align:'center',
				title : '최소(소요전력)',
				width: '110px'
			}, {/* 소요전력최대실장값  	 */
				key : 'rqrdEpwrMaxChfVal', align:'center',
				title : '최대(소요전력)',
				width: '110px'
			}, {/* 소요전력비고  	 */
				key : 'rqrdEpwrRmk', align:'center',
				title : '비고(소요전력)',
				width: '110px'
			}, {/* 소요전력첨부  	 */
				key : 'rqrdEpwrAtfl', align:'center',
				title : '첨부(소요전력)',
				width: '110px',
				render : function(value, data, render, mapping){
					if(value != null){
						return '<button class="Valign-md" id="fileDownBtn" type="button" style="cursor: pointer"><span class="icoonly ico_attachment"></span></button>';
					}
				},
				tooltip : function(value, data, render, mapping){
					return data.atflNm;
				}
			}, {/* 소요 전류 (A)  	 */
				key : 'rqrdVcqtyVal', align:'center',
				title : '소요 전류 (A)',
				width: '110px'
			}, {/* 장비크기분류명	 */
				key : 'eqpSizeClNm', align:'center',
				title : configMsgArray['eqpSizeClasification'],
				width: '100px'
			}, {/* 랙유니트수   	 */
				key : 'rackUntCnt', align:'center',
				title : configMsgArray['rackUnitCnt'],
				width: '100px'
			}, {/* FAN수      	 */
				key : 'fanCnt', align:'center',
				title : configMsgArray['fanCnt'],
				width: '100px'
			}, {/* CPU모델명      	 */
				key : 'cpuMdlNm', align:'center',
				title : configMsgArray['centralProcessionUnitModelName'],
				width: '100px'
			}, {/* 메모리용량  	 */
				key : 'memCapaVal', align:'center',
				title : configMsgArray['memoryCapacity'],
				width: '100px'
			}, {/* OS유형명      	 */
				key : 'osTypNm', align:'center',
				title : configMsgArray['operationSystemTypeName'],
				width: '100px'
			}, {/* 통신방식내용        */
				key : 'commMeansCtt', align:'center',
				title : configMsgArray['communicationMeansContent'],
				width: '100px'
			}, {/* 주요기능내용        */
				key : 'imptFuncCtt', align:'center',
				title : configMsgArray['importantFunctionContent'],
				width: '100px'
			}, {/* 장비모델첨부파일명 */
				key : 'eqpMdlAtflNm', align:'center',
				title : configMsgArray['equipmentModelAttachedFileName'],
				width: '100px'
			}, {/* 파장포트여부 */
				key : 'eqpMdlDtlYn', align:'center',
				title : '파장포트여부',
				width: '100px'
			},{/* 등록일자      */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '130px'
			},{/* 등록자      */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'
			},{/* 변경일자      */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '130px'
			},{/* 변경자      */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {

	var hideColList = ['eqpMdlId', 'eqpCapaCd', 'slotFrmDivCd', 'bpId', 'eqpMdlDtlYn'];

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
    	//장비 역할 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCd');
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
    	//장비모델 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl/ALL', null,'GET', 'mdl');
    	//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');

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

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ mgmtGrpNm, null, 'GET', 'eqpRoleDivCd');
    		 //제조사 조회
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
         });

    	//장비타입 선택시 이벤트
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

		         		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
	        		 }
	   		 }
	   	 });


    	//등록
    	 $('#btnReg').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 dataParam = {"regYn" : "N"};
    		 popup('EqpReg', $('#ctx').val()+'/configmgmt/eqpmdlmgmt/EqpMdlReg.do', '장비모델 등록', dataParam);
         });

    	 $('#'+gridId).on('click', '#fileDownBtn', function(e){
    		var dataObj = AlopexGrid.parseEvent(e).data;

  			var $form=$('<form></form>');
  			$form.attr('name','downloadForm');
  			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/downloadfile");
  			$form.attr('method','GET');
  			$form.attr('target','downloadIframe');
  			// 2016-11-인증관련 추가 file 다운로드시 추가필요
  			// X-Remote-Id와 X-Auth-Token을 parameter로 넘기기 위한 함수(open api를 통하므로 반드시 작성)
  			$form.append(Tango.getFormRemote());
  			$form.append('<input type="hidden" name="fileName" value="'+ dataObj.atflSaveNm +'" />');
  			$form.append('<input type="hidden" name="fileOriginalName" value="'+ dataObj.atflNm +'" />');
  			$form.append('<input type="hidden" name="filePath" value="'+ dataObj.atflPathNm +'" />');
  			$form.appendTo('body');
  			$form.submit().remove();
     	 });

    	 $('#btnExportExcel').on('click', function(e) {
      		//tango transmission biz 모듈을 호출하여야한다.
      		 var param =  $("#searchForm").getData();
      		 var eqpRoleDivCd = "";
      		 var bpId = "";

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

      		 param.fileName = configMsgArray['equipmentModelManagement']; /* 장비모델관리 */
      		 param.fileExtension = "xlsx";
      		 param.excelPageDown = "N";
      		 param.excelUpload = "N";
      		 param.method = "getEqpMdlMgmtList";

      		 $('#'+gridId).alopexGrid('showProgress');
   	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/excelcreate', param, 'GET', 'excelDownload');
           });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
     	 	 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 var param = dataObj;
//    		 var param = {eqpMdlId : dataObj.eqpMdlId};
    		 //param.optlMdulMdlId = dataObj.optlMdulMdlId;
    		 /* 장비모델상세조회 	 */
     		 $a.popup({
        			popid: 'EqpMdlDtlLkupPop',
        			title: '장비모델상세조회',
        			url: '/tango-transmission-web/configmgmt/eqpmdlmgmt/EqpMdlDtlLkupPop.do',
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 980,
        			height : 860,
        			callback: function(data) {
        				$('#btnSearch').click();
    			      }
        		});

    	 });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id" && gridHeader[i].key != "rqrdEpwrAtfl")) {
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

		/*if(flag == 'mdl'){
			$('#eqpMdlId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#eqpMdlId').setData({
	             data:option_data
			});
		}*/

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

    		setSPGrid(gridId, response, response.eqpMdlMgmt);
    	}

		if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');

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
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlMgmt', param, 'GET', 'search');
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
                  height : window.innerHeight * 0.9
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