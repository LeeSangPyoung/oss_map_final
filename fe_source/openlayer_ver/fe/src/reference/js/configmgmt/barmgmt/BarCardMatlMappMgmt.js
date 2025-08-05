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
    	initGrid('N');
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {

//    	$('#useYn').setSelected("Y");

    	$('#btnBarMappDel').setEnabled(false);
    	$('#btnBarMapp').setEnabled(false);		// 장비 탭인 경우 버튼 비활성
    }

  //Grid 초기화
    function initGrid(strGubun) {

//    	$('#'+gridId).removeAlopexGrid();

    	if (strGubun == "N") {

    		var headerMappingN =  [{fromIndex:0, toIndex:4, title:"TANGO", id:'u0'}
										,{fromIndex:5, toIndex:8, title:"NAMS", id:'u1'}];

    		var mappingN =  [{key : 'bpId', align:'center', title : '협력업체ID', width: '80px'},
    			{key : 'bpNm', align:'center', title : '협력업체명', width: '120px'},
    			{key : 'eqpMdlId', align:'center', title : '장비모델ID', width: '120px'},
    			{key : 'eqpMdlNm', align:'center', title : '장비모델명', width: '120px'},
    			{key : 'eqpCnt', align:'center', title : '장비건수', width: '80px'},
    			{key : 'namsMatlCd', align:'center', title : 'NAMS자재코드', width: '100px'},
    			{key : 'namsMatlNm', align:'center', title : 'NAMS자재명', width: '220px'},
    			{key : 'vendVndrNm', align:'center', title : '제조사명', width: '160px'},
    			{key : 'matlCnt', align:'center', title : '자재건수', width: '80px'}];
    	} else {

    		var headerMappingN = [{fromIndex:0, toIndex:6, title:"TANGO", id:'u0'}
										,{fromIndex:7, toIndex:10, title:"NAMS", id:'u1'}];

    		var mappingN =  [{key : 'bpId', align:'center', title : '협력업체ID', width: '80px'},
    			{key : 'bpNm', align:'center', title : '협력업체명', width: '120px'},
    			{key : 'cardMdlId', align:'center', title : '카드모델ID', width: '120px'},
    			{key : 'cardMdlNm', align:'center', title : '카드모델명', width: '120px'},
    			{key : 'eqpMdlNm', align:'center', title : '대표장비모델명', width: '120px'},
    			{key : 'eqpMdlId', align:'center', title : '대표장비모델ID', width: '180px'},
    			{key : 'cardCnt', align:'center', title : '카드건수', width: '80px'},
    			{key : 'namsMatlCd', align:'center', title : 'NAMS자재코드', width: '100px'},
    			{key : 'namsMatlNm', align:'center', title : 'NAMS자재명', width: '220px'},
    			{key : 'vendVndrNm', align:'center', title : '제조사명', width: '160px'},
    			{key : 'matlCnt', align:'center', title : '자재건수', width: '80px'}];
    	}


        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		headerGroup : headerMappingN,
    		columnMapping : mappingN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

//	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['eqpMdlId', 'splyVndrCd','splyVndrNm','vendVndrCd'];
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

       // 그리드 선택시
         $('#'+gridId).on('click', function(e){
        	 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;

    		 if (dataObj != null) {
	    		 if (dataObj._state.selected == true) {
	        		 $('#btnBarMappDel').setEnabled(true);
				 }
				 else
					 $('#btnBarMappDel').setEnabled(false);
    		 }
         });


    	//삭제
    	 $('#btnBarMappDel').on('click', function(e) {

    		 callMsgBox('','I', configMsgArray['deleteConfirm'] , function(msgId, msgRst){
    			 barMatlMappDel();
			});

         });

    	//등록
    	 $('#btnBarMappReg').on('click', function(e) {


    		 var tabId = $('#barMappTabs').getCurrentTabContent();

    		 var popId = "";
    		 var Title = "";
    		 var Url = "";


    		 if (tabId == "#eqpTab") {
    			 popId = 'BarEqpMatlMappDtlEdit';
    			 Title = '장비바코드-자재매핑상세편집';
    			 Url = '/tango-transmission-web/configmgmt/barmgmt/BarEqpMatlMappDtlEdit.do';
    		 }
    		 else {
    			 popId = 'BarCardMatlMappDtlEdit';
    			 Title = '카드바코드-자재매핑상세편집';
    			 Url = '/tango-transmission-web/configmgmt/barmgmt/BarCardMatlMappDtlEdit.do';
    		 }


			 $a.popup({
	    			popid: popId,
	    			title: Title,
	    			url: Url,
	    			data: null,
	    			windowpopup : true,
	    			modal: true,
	    			movable:true,
	    			width : 1241,
	    			height : 862,
	    			callback: function(data) {
	       				main.setGrid(1,100);
				      }
	    		});

         });

    	//매핑 대상
    	 $('#btnBarMapp').on('click', function(e) {
    		 $a.popup({
       			popid: 'BarCardMatlMappObj',
       			title: '카드바코드-자재매핑대상조회',
       			url: '/tango-transmission-web/configmgmt/barmgmt/BarCardMatlMappObj.do',
       			data: null,
       			windowpopup : true,
       			modal: true,
       			movable:true,
       			width : 1441,
       			height : 740,
       			callback: function(data) {
       				main.setGrid(1,100);
			      }
       		});

         });

    	 $('#btnExportExcel').on('click', function(e) {
       		//tango transmission biz 모듈을 호출하여야한다.
       		 var param =  $("#searchForm").getData();
       		 var fileName = "";
       		 var method = "";

       		 param = gridExcelColumn(param, gridId);
       		 param.pageNo = 1;
       		 param.rowPerPage = 10;
       		 param.firstRowIndex = 1;
       		 param.lastRowIndex = 1000000000;


       		 var tabId = $('#barMappTabs').getCurrentTabContent();

        	 if (tabId == "#eqpTab") {
        		 fileName = '바코드_RACK-자재매핑관리';
        		 method = 'getBarEqpMatlMappMgmtList';
        	 }
        	 else {
        		 fileName = '바코드_UNIT-자재매핑관리';
        		 method = 'getBarCardMatlMappMgmtList';
        	 }

       		 param.fileName = fileName;
       		 param.fileExtension = "xlsx";
       		 param.excelPageDown = "N";
       		 param.excelUpload = "N";
       		 param.method =method;

       		 $('#'+gridId).alopexGrid('showProgress');
    	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/excelcreate', param, 'GET', 'excelDownload');
            });


    	 $('#barMappTabs').on('tabchange', function(e, index, index2){

         	index = index+1;

         	$('#'+gridId).alopexGrid('dataEmpty');

         	if (index == 1) {
         		initGrid('N');
         		$('#btnBarMapp').setEnabled(false);		// 장비 탭인 경우 버튼 비활성
         		$('#btnBarMappDel').setEnabled(false);
         	}
         	else {
         		initGrid();
         		$('#btnBarMapp').setEnabled(true);		// 카드 탭인 경우 버튼 활성
         		$('#btnBarMappDel').setEnabled(false);
         	}

         });

	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		if (response.barEqpMatlMappMgmt != undefined)
    			setSPGrid(gridId, response, response.barEqpMatlMappMgmt);
    		else
    			setSPGrid(gridId, response, response.barCardMatlMappMgmt);
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
		if(flag == 'BarCardMatlMappDel' || flag == 'BarEqpMatlMappDel'){

			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
				 main.setGrid(1,100);
			});

		}

    }

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		param.headerGrpCnt = 1;
		var excelHeaderGroupTitle = "";
		var excelHeaderGroupColor = "";
		var excelHeaderGroupFromIndex = "";
		var excelHeaderGroupToIndex = "";


		var excelHeaderGroupFromIndexTemp = "";
		var excelHeaderGroupToIndexTemp = "";
		var excelHeaderGroupTitleTemp ="";
		var excelHeaderGroupColorTemp = "";

		var toBuf = "";


		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			if (i== gridColmnInfo.length-1) {

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf =  toBuf + (gridColmnInfo[i].groupColumnIndexes.length)
			}

			excelHeaderGroupTitleTemp += gridColmnInfo[i].title + ";";
			excelHeaderGroupColorTemp +='undefined'+ ";";

		}

		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			excelHeaderGroupFromIndex += excelHeaderGroupFromIndexTemp.split(";")[i] + ";";
			excelHeaderGroupToIndex += excelHeaderGroupToIndexTemp.split(";")[i] + ";";
			excelHeaderGroupTitle += excelHeaderGroupTitleTemp.split(";")[i] + ";";
			excelHeaderGroupColor += excelHeaderGroupColorTemp.split(";")[i] + ";";

		}

		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

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

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
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


    	 var tabId = $('#barMappTabs').getCurrentTabContent();

    	 if (tabId == "#eqpTab")
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barEqpMatlMappMgmt', param, 'GET', 'search');

    	 else
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barCardMatlMappMgmt', param, 'GET', 'search');

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

    function barMatlMappDel() {

    	var param =   $('#'+gridId).alopexGrid('dataGet',{_state: {selected:true}})[0];

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.useYn = "N";

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 var tabId = $('#barMappTabs').getCurrentTabContent();

		 if (tabId == "#eqpTab")
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/mergeBarEqpMatlMappInf', param, 'GET', 'BarEqpMatlMappDel');
		 else
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/mergeBarCardMatlMappInf', param, 'GET', 'BarCardMatlMappDel');
    }



});