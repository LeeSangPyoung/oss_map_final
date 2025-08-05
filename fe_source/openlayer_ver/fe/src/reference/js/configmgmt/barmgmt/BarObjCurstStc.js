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
    	initGrid('R');
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {

//    	$('#useYn').setSelected("Y");

    }

  //Grid 초기화
    function initGrid(strGubun) {

    	//  NAMS 장착수량 조회 옵션이 체크되어 있는 경우 (엑셀 다운 때문에 그리드를 따로 정의함)
	   		if ($("input:checkbox[id='namsMntCntChk']").is(":checked") ){

	   			if (strGubun == "R") {	// 랙
	   				var headerMappingN =  [{fromIndex:5, toIndex:8, title:"NAMS 랙수량", id:'u0'}
	   												,{fromIndex:9, toIndex:12, title:"NAMS 장착수량", id:'u1'}
													,{fromIndex:13, toIndex:16, title:"TANGO 장비 수집수량", id:'u2'}
													,{fromIndex:17, toIndex:20, title:"NAMS 랙-TANGO수집 수량", id:'u3'}];

	   			}
	   			else if (strGubun == "U"){		// 유니트
	    			var headerMappingN =  [{fromIndex:5, toIndex:8, title:"NAMS 유니트수량", id:'u0'}
	    											,{fromIndex:9, toIndex:12, title:"NAMS 장착수량", id:'u1'}
													,{fromIndex:13, toIndex:16, title:"TANGO 유니트 수집수량", id:'u2'}
													,{fromIndex:17, toIndex:20, title:"NAMS유니트-TANGO수집 수량", id:'u3'}];
	    		}
	    		else {		// 광모듈
		    		var headerMappingN =  [{fromIndex:5, toIndex:8, title:"NAMS 광모듈수량", id:'u0'}
		    										,{fromIndex:9, toIndex:12, title:"NAMS 장착수량", id:'u1'}
													,{fromIndex:13, toIndex:16, title:"TANGO 광모듈 수집수량", id:'u2'}
													,{fromIndex:17, toIndex:20, title:"NAMS광모듈-TANGO수집 수량", id:'u3'}];
	    		}

	    		var mappingN =  [{key : 'vendNm', align:'center',title : '협력업체명',width: '100px'},
	    							   {key : 'eqpRoleDivNm', align:'center',title : '장비타입',width: '100px'},
	    							   {key : 'namsMatlCd', align:'center',title : '자재코드',width: '100px'},
	    							   {key : 'namsMatlNm', align:'center',title : 'NAMS자재명',width: '200px'},
	    							   {key : 'whinCnt', align:'center',title : 'Open2U입고수량',width: '100px'},

	    							   {key : 'storCnt1', align:'center',title : '수도권',width: '60px'},
	    							   {key : 'storCnt2', align:'center',title : '동부',width: '60px'},
	    							   {key : 'storCnt3', align:'center',title : '서부',width: '60px'},
	    							   {key : 'storCnt4', align:'center',title : '중부',width: '60px'},

	    							   {key : 'mntCnt1', align:'center',title : '수도권',width: '60px'},
	    							   {key : 'mntCnt2', align:'center',title : '동부',width: '60px'},
	    							   {key : 'mntCnt3', align:'center',title : '서부',width: '60px'},
	    							   {key : 'mntCnt4', align:'center',title : '중부',width: '60px'},

	    							   {key : 'opCnt1', align:'center',title : '수도권',width: '60px'},
	    							   {key : 'opCnt2', align:'center',title : '동부',width: '60px'},
	    							   {key : 'opCnt3', align:'center',title : '서부',width: '60px'},
	    							   {key : 'opCnt4', align:'center',title : '중부',width: '60px'},

	    							   {key : 'mntDscdCnt1', align:'center',title : '수도권',width: '60px'},
	    							   {key : 'mntDscdCnt2', align:'center',title : '동부',width: '60px'},
	    							   {key : 'mntDscdCnt3', align:'center',title : '서부',width: '60px'},
	    							   {key : 'mntDscdCnt4', align:'center',title : '중부',width: '60px'}];

	   		}
	   		else {


	   			if (strGubun == "R") {	// 랙
	   				var headerMappingN =  [{fromIndex:5, toIndex:8, title:"NAMS 랙수량", id:'u0'}
													,{fromIndex:9, toIndex:12, title:"TANGO 장비 수집수량", id:'u1'}
													,{fromIndex:13, toIndex:16, title:"NAMS 랙-TANGO수집 수량", id:'u2'}];

	   			}
	   			else if (strGubun == "U"){		// 유니트
	    			var headerMappingN =  [{fromIndex:5, toIndex:8, title:"NAMS 유니트수량", id:'u0'}
													,{fromIndex:9, toIndex:12, title:"TANGO 유니트 수집수량", id:'u1'}
													,{fromIndex:13, toIndex:16, title:"NAMS유니트-TANGO수집 수량", id:'u2'}];
	    		}
	    		else {		// 광모듈
		    		var headerMappingN =  [{fromIndex:5, toIndex:8, title:"NAMS 광모듈수량", id:'u0'}
													,{fromIndex:9, toIndex:12, title:"TANGO 광모듈 수집수량", id:'u1'}
													,{fromIndex:13, toIndex:16, title:"NAMS광모듈-TANGO수집 수량", id:'u2'}];
	    		}

	    		var mappingN =  [{key : 'vendNm', align:'center',title : '협력업체명',width: '100px'},
	    							   {key : 'eqpRoleDivNm', align:'center',title : '장비타입',width: '100px'},
	    							   {key : 'namsMatlCd', align:'center',title : '자재코드',width: '100px'},
	    							   {key : 'namsMatlNm', align:'center',title : 'NAMS자재명',width: '200px'},
	    							   {key : 'whinCnt', align:'center',title : 'Open2U입고수량',width: '100px'},

	    							   {key : 'storCnt1', align:'center',title : '수도권',width: '60px'},
	    							   {key : 'storCnt2', align:'center',title : '동부',width: '60px'},
	    							   {key : 'storCnt3', align:'center',title : '서부',width: '60px'},
	    							   {key : 'storCnt4', align:'center',title : '중부',width: '60px'},

	    							   {key : 'opCnt1', align:'center',title : '수도권',width: '60px'},
	    							   {key : 'opCnt2', align:'center',title : '동부',width: '60px'},
	    							   {key : 'opCnt3', align:'center',title : '서부',width: '60px'},
	    							   {key : 'opCnt4', align:'center',title : '중부',width: '60px'},

	    							   {key : 'mntDscdCnt1', align:'center',title : '수도권',width: '60px'},
	    							   {key : 'mntDscdCnt2', align:'center',title : '동부',width: '60px'},
	    							   {key : 'mntDscdCnt3', align:'center',title : '서부',width: '60px'},
	    							   {key : 'mntDscdCnt4', align:'center',title : '중부',width: '60px'}];
	   		}

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
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
		var hideColList = ['mtsoId', 'bpId','portId','optlMdulMdlId','vendId','wavlDivCd','matlStatDivCd'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

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
            		 fileName = '바코드대상통계-RACK장비';
            		 method = 'getBarEqpObjCurstStcList';
            	 }
            	 else if (tabId == "#cardTab") {
            		 fileName = '바코드대상통계-UNIT카드';
            		 method = 'getBarObjCurstStcList';
            	 }
            	 else {
            		 fileName = '바코드대상통계-SFP광모듈';
            		 method = 'getOptlMdulCurstStcList';
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

           	if (index == 1)
           		initGrid('R');
           	else if (index == 2)
           		initGrid('U');
           	else
           		initGrid();

           });

    	 //NAMS 장착 수량 조회 체크 여부
    	 $('#namsMntCntChk').on('click', function(e) {
    		 var tabId = $('#barMappTabs').getCurrentTabContent();

        	 if (tabId == "#eqpTab")
        		 initGrid('R');
        	 else if (tabId == "#cardTab")
        		 initGrid('U');
        	 else
        		 initGrid();
         });

	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		if (response.barEqpObjCurstStc != undefined)
    			setSPGrid(gridId, response, response.barEqpObjCurstStc);
    		else if (response.barObjCurstStc != undefined)
        		 setSPGrid(gridId, response, response.barObjCurstStc);
        	 else
        		 setSPGrid(gridId, response, response.optlMdulCurstStc);
    	}

		//본부 콤보박스
    	if(flag == 'org'){
    		$('#orgId').clear();
			var option_data =  [{orgId: "", orgNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){

				var resObj =  {orgId: response[i].cd, orgNm: response[i].cdNm};
				option_data.push(resObj);
			}

			$('#orgId').setData({
	             data:option_data
			});
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
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barEqpObjCurstStc', param, 'GET', 'search');
    	 else if (tabId == "#cardTab")
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barObjCurstStc', param, 'GET', 'search');
    	 else
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/optlMdulCurstStc', param, 'GET', 'search');



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