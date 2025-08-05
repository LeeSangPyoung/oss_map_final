/**
 * FhDsnObjMgmt.js
 *
 * @author P135551
 * @date 2019. 1. 29. 오전 13:30:03
 * @version 1.0
 */
var gridModel = null;
$a.page(function() {
    var gridId = 'excelGrid';
    var gridIdExcel = 'dataExcelGrid';
    var ckData = null;
    this.init = function(id, param) {
        initGrid();
    	setCombo();
    	setEventListener();
    };

	function setCombo() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/ComCdAfeYrList', null, 'GET', 'afeYrList');
		var userId = $("#userId").val();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getErpHdofcId', null, 'GET', 'getErpHdofcId');

//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/storgMgmtList', null, 'GET', 'gridSearch');

//		$("#hdofcNm").clear();
//		var option_data =  [{cd: "",cdNm: "선택하세요"}];
//		option_data.push({cd: "수도권", cdNm: "수도권"});
//		option_data.push({cd: "부산", cdNm: "부산"});
//		option_data.push({cd: "중부", cdNm: "중부"});
//		option_data.push({cd: "대구", cdNm: "대구"});
//		option_data.push({cd: "서부", cdNm: "서부"});
//
//		$("#hdofcNm").setData({
//			data:option_data
//		});

		$("#fhOpTeamNm").clear();
		var option_data =  [{cd: "",cdNm: "선택하세요"}];
		option_data.push({cd: "강남 Access Infra팀", cdNm: "강남 Access Infra팀"});
		option_data.push({cd: "강북 Access Infra팀", cdNm: "강북 Access Infra팀"});
		option_data.push({cd: "강서 Access Infra팀", cdNm: "강서 Access Infra팀"});
		option_data.push({cd: "경인 Access Infra팀", cdNm: "경인 Access Infra팀"});
		option_data.push({cd: "광주 Access Infra팀", cdNm: "광주 Access Infra팀"});
		option_data.push({cd: "대구 Access Infra팀", cdNm: "대구 Access Infra팀"});
		option_data.push({cd: "대전 Access Infra팀", cdNm: "대전 Access Infra팀"});
		option_data.push({cd: "부산 Access Infra팀", cdNm: "부산 Access Infra팀"});
		option_data.push({cd: "원주 Access Infra팀", cdNm: "원주 Access Infra팀"});
		option_data.push({cd: "전주 Access Infra팀", cdNm: "전주 Access Infra팀"});
		option_data.push({cd: "제주 Access Infra팀", cdNm: "제주 Access Infra팀"});
		option_data.push({cd: "청주 Access Infra팀", cdNm: "청주 Access Infra팀"});
		$("#fhOpTeamNm").setData({
			data:option_data
		});
		$("#fhCnstTeamNm").clear();
		var option_data =  [{cd: "",cdNm: "선택하세요"}];
		option_data.push({cd: "중부구축팀", cdNm: "중부구축팀"});
		option_data.push({cd: "수도권구축팀", cdNm: "수도권구축팀"});
		option_data.push({cd: "동부구축팀", cdNm: "동부구축팀"});
		option_data.push({cd: "서부구축팀", cdNm: "서부구축팀"});

		$("#fhCnstTeamNm").setData({
			data:option_data
		});

    }

    function initGrid() {

    	var mapping =  [
    		{key : 'fhHdofcNm' 	 	 , align:'center', width:'90px', title : '본부명'}
    		, {key : 'fhYr'              , align:'center', width:'90px', title : '년도'}
    		, {key : 'fhDgr'             , align:'center', width:'90px', title : '차수'}
    		, {key : 'fhOpTeamNm'        , align:'center', width:'90px', title : '운용CC'}
    		, {key : 'fhCnstTeamNm'      , align:'center', width:'90px', title : '구축CC'}
    		, {key : 'intgFcltsCd'     , align:'center', width:'90px', title : '시설코드',
    			styleclass : function(value,data,mapping){
				return 'row-text-weight';
		  	}}
    		, {key : 'fhOnafSmtsoNm'     , align:'center', width:'90px', title : '국소명' }
    		, {key : 'fhOnafDetlAddr'    , align:'center', width:'90px', title : '주소'}
    		, {key : 'fhFocsMtsoFcltsCd' , align:'center', width:'90px', title : '시설코드'

    		}
    		, {key : 'fhFocsMtsoSmtsoNm' , align:'center', width:'90px', title : '국소명'}
    		, {key : 'fhFocsMtsoDetlAddr', align:'center', width:'90px', title : '주소'}

    		, {key : 'fhEngId', align:'center', width:'90px', title : 'engId' ,hidden:true}
    		, {key : 'fhEngDtlId', align:'center', width:'90px', title : 'enfDtlId',hidden:true}
    		, {key : 'intgFcltsCd', align:'center', width:'90px', title : 'intgFcltsCd',hidden:true}
    		, {key : 'splyMeansNm', align:'center', width:'100px', title : '공급방식명'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}
    		, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'splyMeansCd', align:'left', width:'120px', title : '공급방식코드'
    			,styleclass : function(value,data,mapping){
                    return 'row-highlight-gray';
  			  	}
    			, headerStyleclass : 'headerBackGroundBlueS'
    				,hidden:true
    		}
    		, {key : 'cnntInvtCst', align:'right', width:'90px', title : '선로접속비',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
    		,styleclass : function(value,data,mapping){
                return 'row-highlight-gray';
			  	}
    		, headerStyleclass : 'headerBackGroundBlueS'
    		}
    		, {key : 'icreInvtCst', align:'right', width:'90px', title : '선로증설비',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
				}
    		,styleclass : function(value,data,mapping){
                return 'row-highlight-gray';
			  	}
    		, headerStyleclass : 'headerBackGroundBlueS'
			}
    		, {key : 'eqpInvtCst', align:'right', width:'90px', title : '장비투자비',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
    		,styleclass : function(value,data,mapping){
                return 'row-highlight-gray';
			  	}
    		, headerStyleclass : 'headerBackGroundBlueS'
			}
    		, {key : 'splyEqpMdlNm'      , align:'center', width:'110px', title : '장비모델'}
    		, {key : 'splyEqpNm'         , align:'center', width:'100px', title : '장비명'}
    		, {key : 'chnlVal'           , align:'center', width:'80px', title : '채널'}
    		, {key : 'wavlVal'           , align:'center', width:'90px', title : '파장'}
    		, {key : 'frstRegDate'       , align:'center', width:'90px', title : '등록일'}
    		, {key : 'frstRegUserId'     , align:'center', width:'90px', title : '등록자'}
    		, {key : 'lastChgDate'       , align:'center', width:'90px', title : '수정일'}
    		, {key : 'lastChgUserId' 	, align:'center', width:'90px', title : '수정자'}
    	];
    	var userId = $("#userId").val();
    	gridModel = Tango.ajax.init({
    		url: "tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/fhApplyReflctList"
//        	url: "tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/fhExcelMgmtList"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 10000,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
    	$('#'+gridIdExcel).alopexGrid({
			paging : false,
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			columnMapping: mapping
			,headerGroup: [
	    		{fromIndex:0, toIndex:4, title:'기본 정보'},
	    		{fromIndex:5, toIndex:7, title:'A망국소정보'},
	    		{fromIndex:8, toIndex:10, title:'DU국소정보'},
	    		{fromIndex:11, toIndex:18, title:'F/H자동설계결과' , headerStyleclass : 'headerBackGroundBlueS'},

			]

		});

        //그리드 생성
        $('#'+gridId).alopexGrid({
//        	cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : false,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
           paging: {
        	   pagerTotal:true,
        	   pagerSelect:false,
        	   hidePageList:true
           }
    	,headerGroup: [
//    		{fromIndex:0, toIndex:22, title : '공급방식 01:선로직결, 02:5G-SMUX(신설), 03:5G-SMUX(기설),04:5G-PON(신설),05:5G-ON(기설), 09:미정'},
    		{fromIndex:0, toIndex:4, title:'기본 정보'},
    		{fromIndex:5, toIndex:7, title:'A망국소정보'},
    		{fromIndex:8, toIndex:10, title:'DU국소정보'},
    		{fromIndex:11, toIndex:18, title:'F/H자동설계결과' , headerStyleclass : 'headerBackGroundBlueS'},
    		{fromIndex:19, toIndex:22, title:'설계추천정보'},
		]
    	   ,columnMapping : mapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,ajax: {
   	         model: gridModel                  // ajax option에 grid 연결할 model을지정
   		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
   		    }
            ,defaultColumnMapping: {
            	sorting: true
            }
            ,height : 500

        });

        $("#"+gridId).on( 'dblclick', '.bodycell' , function(e){
        	var dataObj = AlopexGrid.parseEvent(e).data;
		    	$a.popup({
	            	popid: 'GetFhApplyReflctPopup',
	            	title: 'F/H 설계 결과 상세정보',
	            	windowpopup : true,
		            modal: true,
		            movable:true,
	                url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhExcelApplyReflctPop.do',
	                data: dataObj,
	                width : 800,
	                height : 600, //window.innerHeight * 0.9,
	                /*
	            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	            	*/
	                callback: function(data) {
	                	if (data != null) {
	                		$('#search').click();
	                	}
	               	}
	            });
		});
    }

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};


    function setEventListener() {
    	$('#'+gridId).on('change','.headercell input', function(e) {
    		var checked = $(e.target).is(':checked') ? 'T' : 'F';
    		$("#checkCd").val(checked);
    	});

//    	$("#pageNo").val(1);
//    	$('#rowPerPage').val(15);
    	$('#search').on('click', function(e) {
        	var dataParam =  $("#searchForm").getData();
//        	bodyProgress();
        	dataParam.pageNo = '1';
        	dataParam.rowPerPage = '10000';
        	var hdofc = $("#hdofcNm").getTexts();
	   		if(dataParam.hdofcNm == "" || dataParam.hdofcNm  == null ){
	        	dataParam.hdofcNm = "";
	   		}else{
	        	dataParam.hdofcNm = hdofc[0];
	   		}
    		gridModel.get({
        		data: dataParam,
	    	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'search');})
	    	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});
        });

    	//FhTmpLockerMgmt
    	//엔터키로 조회
        $('#searchForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			$('#search').click();
      		}
    	 });

    	$("#afeYr").on('change',function(e) {
    		var param = $("#afeYr").getData();
    		//httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getAfeDgrList', param, 'GET', 'afeDgrList');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/ComCdAfeDgrList', param, 'GET', 'afeDgrList');
    	});

    	$('#btnFhTmpExcelUpload').on('click', function(e) {
	    	var param = $("#searchForm").getData();
	    	param.chk = "Y";
	   	 $a.popup({
	        	popid: 'FhDsnObjExcelUploadPopup',
	        	title: '프론트홀 청약설계 대상 엑셀업로드팝업',
//	        	iframe: true,
//	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhApplyRefcltExcelUpload.do',
	            data: param,
	            width: "600",
	            height: "300",
	            windowpopup : true,
	            modal: false,
	            movable:true
	            /*
	        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	        	*/
	            ,callback: function(resultCode) {
		            	$('#search').click();
               	}
	       });
       });


      	$('#btnExportExcelOnDemand').on('click', function(e){

//      		$('#'+gridId).alopexGrid('showProgress');
    		btnExportExcelOnDemandClickEventHandler(e);
//      		var param =  $("#searchForm").getData();
//    		param.fhEngId = $("#fhEngId").val();
//           	var hdofc = $("#hdofcNm").getTexts();
//       		if(param.hdofcNm == "" || param.hdofcNm  == null ){
//       			param.hdofcNm = "";
//       		}else{
//       			param.hdofcNm = hdofc[0];
//       		}
//       		param.pageNo = 1;
//			param.rowPerPage = 10000;
////
////			$('#'+gridId).alopexGrid('showProgress');
//			bodyProgress();
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/fhApplyReflctList', param, 'GET', 'excleDownload');

      	});

    };

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //장비조회조건세팅
	        var param =  $("#searchForm").getData();
	     	var hdofc = $("#hdofcNm").getTexts();
	   		if(param.hdofcNm == "" || param.hdofcNm  == null ){
	   			param.hdofcNm = "";
	   		}else{
	   			param.hdofcNm = hdofc[0];
	   		}
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 10000;
	   		param.inUserId = $('#sessionUserId').val();

	   		/* 엑셀정보     	 */
	   		var now = new Date();
	   		var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	   		var excelFileNm = 'FhApplyReflctList'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getFhApplyReflctList";
	   		param.excelFlag = "FhApplyReflctList";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	   		fileOnDemendName = excelFileNm+".xlsx";
	   		console.log("aaa");
	   		$('#'+gridId).alopexGrid('showProgress');
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	 }

	 function gridExcelColumn(param, gridId) {
	    	var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");

	    	var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
			var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
			var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
			var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

			for(var i=0; i<gridHeaderGroup.length; i++) {
				if(gridHeaderGroup[i].title != undefined) {
					excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex;/*순번칼럼다운 제외되니까*/
					excelHeaderGroupFromIndex += ";";
					excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex;/*순번칼럼다운 제외되니까*/
					excelHeaderGroupToIndex += ";";
					excelHeaderGroupTitle += gridHeaderGroup[i].title;
					excelHeaderGroupTitle += ";";
					excelHeaderGroupColor += gridHeaderGroup[i].color;
					excelHeaderGroupColor += ";";
				}
			}

			var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
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


			/*======해더그룹정보======*/
			param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
			param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
			param.excelHeaderGroupTitle = excelHeaderGroupTitle;
			param.excelHeaderGroupColor = excelHeaderGroupColor;


			/*======해더정보======*/
			param.excelHeaderCd = excelHeaderCd;
			param.excelHeaderNm = excelHeaderNm;
			param.excelHeaderAlign = excelHeaderAlign;
			param.excelHeaderWidth = excelHeaderWidth;
			//param.excelHeaderInfo = gridColmnInfo;

			return param;
		}


    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
//        	bodyProgressRemove();
    		// 검색
    	}

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }


    	if(flag == 'afeYrList'){
    		$("#afeYr").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push({cd: resObj.afeYr, cdNm: resObj.afeYr});
			}

    		$("#afeYr").setData({
    			data:option_data
    		});

    		var param = $("#afeYr").getData();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/ComCdAfeDgrList', param, 'GET', 'afeDgrList');
    	}

    	if(flag == 'afeDgrList'){
    		$("#acsnwAfeDgr").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.acsnwAfeDgr, cdNm: resObj.acsnwAfeDgr});
    		}

    		$("#acsnwAfeDgr").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'hdofcNmList'){
    		$("#hdofcNm").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.hdofcNm, cdNm: resObj.hdofcNm});
    		}

    		$("#hdofcNm").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'excleDownload'){

    		setSPGrid(gridIdExcel, response, response.lists);

    		var worker = new ExcelWorker({
    			excelFileName: 'FhExcelApplyReflctList',
//    			defaultPalette : {
//    				font : '맑은고딕',
//    				fontSize : 11,
//    			},
    			sheetList : [{
    				sheetName : 'sheet1',
    				$grid : $('#'+gridIdExcel)
    			}]
    		});

    		worker.export({
//    			exportType : "csv",
//    			selected : false,
    			border : true,
				exportHidden : false,
				useGridColumnWidth: true,
				merge : true,
//    			exportHidden:false,
//    			useCSSParser: true // 색상 스타일 그대로 적용

    		});
    		bodyProgressRemove();

    	}
    	if(flag == 'getErpHdofcId'){
        	var erpHdofCdId = "";
    		if(response.length >= 1 ){
    			erpHdofCdId = response[0].erpHdofcCd;
    		}

    		$("#hdofcNm").clear();
    		var option_data =  [{cd: "",cdNm: "선택하세요"}];
    		option_data.push({cd: "5100", cdNm: "수도권"});
    		option_data.push({cd: "5300", cdNm: "부산"});
    		option_data.push({cd: "5600", cdNm: "중부"});
    		option_data.push({cd: "5400", cdNm: "대구"});
    		option_data.push({cd: "5500", cdNm: "서부"});
    		$("#hdofcNm").setData({
    			data:option_data,
    			hdofcNm: erpHdofCdId
    		});

//    		$("#hdofcNm").setEnabled(false);
    	}
	}


	function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};

		var size = 0;

		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function bodyProgress() {
    	$('body').progress();
    }

    function bodyProgressRemove() {
    	$('body').progress().remove();
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