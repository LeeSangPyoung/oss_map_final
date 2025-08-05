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

//    	$('#useYn').setSelected("Y");

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
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			},{/* 제조사 Part Number	 */
				key : 'vendPartsNoVal', align:'center',
				title : '제조사 Part Number',
				width: '180px'
			},{/* SKT기준 자재코드	 */
				key : 'matlCd', align:'center',
				title : 'SKT기준 자재코드',
				width: '150'
			},{/* SKT기준 자재명	 */
				key : 'matlNm', align:'center',
				title : 'SKT기준 자재명(계약명칭)',
				width: '180px'
			},{/* 제조사/공급사 SFP 명칭	 */
				key : 'optlMdulMdlNm', align:'center',
				title : '제조사/공급사 SFP 명칭',
				width: '280px'
			},{/* 제조사ID	 -- 숨김데이터*/
				key : 'vendId', align:'center',
				title : '제조사ID',
				width: '100px'
			},{/* 원천제조사 */
				key : 'vendNm', align:'center',
				title : '원천제조사',
				width: '100px'
			},{/* 원천제조사국적 */
				key : 'vendCntyNm', align:'center',
				title : '원천제조사 국적',
				width: '120px'
			},{/* 공급사ID - 숨김데이터*/
				key : 'prvdId', align:'center',
				title : '공급사ID',
				width: '100px'
			},{/* 공급사명 */
				key : 'prvdNm', align:'center',
				title : '공급사',
				width: '100px'
			},{/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			},{/* 바코드 대상여부     	 */
				key : 'barYn', align:'center',
				title : '바코드 대상여부',
				width: '120px'
			},{/* 파장     	 */
				key : 'wavlVal', align:'center',
				title : '파장(nm)',
				width: '180px'
			},{/* Fixed 파장/Tunable  	 */
				key : 'wavlDivVal', align:'center',
				title : 'Fixed 파장/Tunable',
				width: '180px'
			},{/* Min Rate(Gbps)  	 */
				key : 'minRate', align:'center',
				title : 'Min Rate(Gbps)',
				width: '120px'
			},{/* Max Rate(Gbps)  	 */
				key : 'maxRate', align:'center',
				title : 'Max Rate(Gbps)',
				width: '120px'
			},{/* 크기(XFP,SFP+, SFP등)  	 */
				key : 'optlMdulSizeVal', align:'center',
				title : '크기(XFP,SFP+, SFP등)',
				width: '160px'
			},{/* 멀티모드/싱글모드  	 */
				key : 'cblIstnDivVal', align:'center',
				title : '멀티모드/싱글모드',
				width: '160px'
			},{/* Core 개수  	 */
				key : 'coreCnt', align:'center',
				title : 'Core 개수',
				width: '80px'
			},{/* Fiber Connector(PC / APC)  	 */
				key : 'optlDcrsMachStrdVal', align:'center',
				title : 'Fiber Connector(PC / APC)',
				width: '180px'
			},{/* 최대 전송거리(Km)  	 */
				key : 'maxTrmsDistk', align:'center',
				title : '최대 전송거리(Km)',
				width: '160px'
			},{/* TEC 유/무  	 */
				key : 'tmprCtrlYn', align:'center',
				title : 'TEC 유/무',
				width: '80px'
			},{/* 최대 소모전력(W)  	 */
				key : 'maxUseWattVal', align:'center',
				title : '최대 소모전력(W)',
				width: '120px'
			},{/* Rx Sensitivity(dBm)  	 */
				key : 'rxSenstVal', align:'center',
				title : 'Rx Sensitivity(dBm)',
				width: '130px'
			},{/* Tx Min(dBm)  	 */
				key : 'txMinVal', align:'center',
				title : 'Tx Min(dBm)',
				width: '120px'
			},{/* Tx Avg(dBm)  	 */
				key : 'txAvgVal', align:'center',
				title : 'Tx Avg.(dBm)',
				width: '120px'
			},{/* Tx Max(dBm)  	 */
				key : 'txMaxVal', align:'center',
				title : 'Tx Max(dBm)',
				width: '120px'
			},{/* Overload(dBm)  	 */
				key : 'ovldVal', align:'center',
				title : 'Overload(dBm)',
				width: '120px'
			},{/* PD(Pin-PD / APD)  	 */
				key : 'ptdtcVal', align:'center',
				title : 'PD(Pin-PD / APD)',
				width: '120px'
			},{/* EML/DML  	 */
				key : 'mdlsrVal', align:'center',
				title : 'EML/DML',
				width: '100px'
			},{/* 동작온도 최저 (ºC, Ta 기준)  	 */
				key : 'tmprMinVal', align:'center',
				title : '동작온도 최저 (ºC, Ta 기준)',
				width: '180px'
			},{/* 동작온도 최고 (ºC, Tc 기준)  	 */
				key : 'tmprMaxVal', align:'center',
				title : '동작온도 최고 (ºC, Tc 기준)',
				width: '180px'
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
		var hideColList = ['vendId', 'prvdId'];
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

    	//장비 역할 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
    	//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
		//바코드 대상여부
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/BARYN', null, 'GET', 'barYn');
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

    		 $a.popup({
       			popid: 'OptlMdulMdlReg',
       			title: '광모듈모델등록',
       			url: '/tango-transmission-web/configmgmt/eqpmdlmgmt/OptlMdulMdlReg.do',
       			data: dataParam,
       			windowpopup : true,
       			modal: true,
       			movable:true,
       			width : 910,
       			height : 840,
       			callback: function() {
       				main.setGrid(1,perPage);
       			}

       		});


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

	   		 if (param.vendIdList != "" && param.vendIdList != null ){
	   			 for(var i=0; i<param.vendIdList.length; i++) {
	   				 if(i == param.vendIdList.length - 1){
	   					 bpId += param.vendIdList[i];
	                    }else{
	                   	 bpId += param.vendIdList[i] + ",";
	                    }
	    			}
	   			param.bpId = bpId ;
	   			param.bpIdList = [];
	   		 }

      		 param.fileName = '광모듈모델관리'
      		 param.fileExtension = "xlsx";
      		 param.excelPageDown = "N";
      		 param.excelUpload = "N";
      		 param.method = "getOptlMdulMdlMgmtList";

      		 $('#'+gridId).alopexGrid('showProgress');
   	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/excelcreate', param, 'GET', 'excelDownload');
           });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 var param = {optlMdulMdlId : dataObj.optlMdulMdlId};
    		 //param.optlMdulMdlId = dataObj.optlMdulMdlId;
    		 /* 장비모델상세조회 	 */
     		 $a.popup({
        			popid: 'OptlMdulMdlDtlLkup',
        			title: '광모듈모델상세정보',
        			url: '/tango-transmission-web/configmgmt/eqpmdlmgmt/OptlMdulMdlDtlLkup.do',
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 980,
        			height : 860,
        			callback: function(data) {
    	            	  if (data.optlMduldMdlDelYn != null){
    	            		  main.setGrid(1,perPage);
    	            	  }
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



    	if(flag == 'bp'){
			$('#vendIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#vendIdList').setData({
	             data:option_data
			});
		}

    	if(flag == 'barYn'){
    		var option_data =  [{comCd: "", comCdNm: "전체"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#barYn').setData({
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

    		setSPGrid(gridId, response, response.optlMdulMdlMgmt);
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
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/optlMdulMdlMgmt', param, 'GET', 'search');
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