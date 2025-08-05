/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var sbeqpClCdList;
	var sbeqpClCdNm;

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
			}, {/* 부대장비구분		 */
				key : 'sbeqpClCd', align:'center',
				title : '부대장비구분',
				width: '100px'
			}, {/* 제조사   	 */
				key : 'sbeqpVendNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {/* 부대장비모델ID	 */
				key : 'sbeqpMdlId', align:'center',
				title : '부대장비모델ID',
				width: '100px'
			}, {/* 부대장비모델명		 */
				key : 'sbeqpMdlNm', align:'center',
				title : '부대장비모델명',
				width: '100px'
			}, {/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '130px'
			}, {/* 등록자     	 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'
			}, {/* 변경일자		 */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '130px'
			}, {/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'/////////////////////////////
			}, {/* 장비사용여부		 */
				key : 'useYn', align:'center',
				title : '장비사용여부',
				width: '100px'/////////////////////////////
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {

	var hideColList = ['useYn'];

	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

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
         $('#sbeqpSearchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage);
       		}
     	 });

       //첫번째 row를 클릭했을때 팝업 이벤트 발생
    	/* $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	 장비상세정보
    	 	popup('SbeqpDtlLkup', '/tango-transmission-web/configmgmt/sbeqpmdlmgmt/SbeqpMdlReg.do', configMsgArray['equipmentDetailInf'],dataObj);

    	 });*/
    	//등록
     	 $('#btnReg').on('click', function(e) {
    		 sbeqpReg();
         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
    	 $('#btnExportExcel').on('click', function(e) {
     		//tango transmission biz 모듈을 호출하여야한다.
     		 var param =  $("#sbeqpSearchForm").getData();

     		 param = gridExcelColumn(param, gridId);
     		 param.pageNo = 1;
     		 param.rowPerPage = 10;
     		 param.firstRowIndex = 1;
     		 param.lastRowIndex = 1000000000;

//  	   		if ($("#sbeqpClCdList").val() != "" && $("#sbeqpClCdList").val() != null ){
//        			param.sbeqpClCdList = $("#sbeqpClCdList").val() ;
//        		 }else{
//        			param.sbeqpClCdList = [];
//        		 }

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
     		 param.fileName = '부대장비모델정보';
     		 param.fileExtension = "xlsx";
     		 param.excelPageDown = "N";
     		 param.excelUpload = "N";
     		 param.method = "getSbeqpMdlMgmtList";

     		 $('#'+gridId).alopexGrid('showProgress');
  	    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmdlmgmt/excelcreate', param, 'GET', 'excelDownload');
          });

	};

	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02406', null, 'GET', 'sbeqpClCdList');

	}

	function successCallback(response, status, jqxhr, flag){

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

		if(flag == 'mdl'){
			$('#eqpMdlId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#eqpMdlId').setData({
	             data:option_data
			});
		}

		if(flag == 'excelDownload'){
			$('#'+gridId).alopexGrid('hideProgress');
//			console.log('excelCreate');
//			console.log(response);

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

    	if(flag == 'sbeqpClCdList'){
    		$('#sbeqpClCdList').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#sbeqpClCdList').setData({
                 data:option_data,
    		});
    	}

		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.sbeqpMdlMgmt);

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
    	 var param =  $("#sbeqpSearchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmdlmgmt/sbeqpMdlMgmt', param, 'GET', 'search');
    }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  //iframe: false,
                  windowpopup: true,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.4
              });
        }

    function sbeqpReg() {
		 dataParam = {"regYn" : "N"};
		 /* 장비등록     	 */
		 popup('SbeqpMdlReg', '/tango-transmission-web/configmgmt/sbeqpmdlmgmt/SbeqpMdlReg.do', '부대장비모델등록', dataParam);
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

    /*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/
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
});