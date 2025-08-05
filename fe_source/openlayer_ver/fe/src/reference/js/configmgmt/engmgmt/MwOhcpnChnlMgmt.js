
$a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
        setRegDataSet(param);
    };

    function setRegDataSet(data) {


    }


	//Grid 초기화
    function initGrid() {

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
//        	rowSingleSelect : false,
    		columnMapping: [{key : 'mwSrno', align:'center',title : 'mwSrno',width: '80px'},
			{key : 'ntwkLineNo', align:'center',title : '링ID',width: '80px'},
			{key : 'ntwkLineNm', align:'center',title : '링명',width: '80px'},
			{key : 'sctnDistk', align:'center',title : '구간거리(Km)',width: '80px'},
			{key : 'mwFreqVal', align:'center', title : '주파수(Ghz)', width: '80px'},
			{key : 'modulMeansVal', align:'center', title : '변조방식', width: '80px'},
			{key : 'mwBdwhCdVal', align:'center', title : '대역폭', width: '80px'},
			{key : 'avlbMaxChnlCnt', align:'center', title : '채널수(가용 최대 채널수)', width: '80px'},
			{key : 'useChnlVal', align:'center',title : '현재사용채널',width: '80px'},
			{key : 'cmptrUseChnlVal', align:'center',title : '경쟁사사용채널',width: '80px'},
			{key : 'remChnlCnt', align:'center',title : '잔여채널',width: '80px'}
    		],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

        gridHide();
	};
	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['mwSrno'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	function setSelectCode() {

		//MW 대역폭
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02506', null, 'GET', 'mwBdwhCd');
	}

    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);

         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	setGrid(1, eObj.perPage);

         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setGrid(1,perPage);
       		}
     	 });
         //등록
         $('#btnMwOhcpnChnlMgmtReg').on('click', function(e) {

        	 dataParam = {"regYn" : "N"};

    		 $a.popup({
       			popid: 'MwInvtReg',
       			title: 'M/W 타사 채널 등록',
       			url: '/tango-transmission-web/configmgmt/engmgmt/MwOhcpnChnlReg.do',
       			data: dataParam,
       			windowpopup : true,
       			modal: true,
       			movable:true,
       			width : 790,
       			height : 300,
       			callback: function(data) {
            		setGrid(1,100);
       			}
       		});

         });

         //첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 var param =  [{mwSrno : dataObj.mwSrno}];

     		 $a.popup({
        			popid: 'MwInvtDtlLkup',
        			title: '타사 사용 채널 상세 정보',
        			url: '/tango-transmission-web/configmgmt/engmgmt/MwOhcpnChnlDtlLkup.do',
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 790,
           			height : 300,
        			callback: function(data) {
        				setGrid(1,100);
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
				fileName = 'MW타사사용채널관리';
				method = 'getMwOhcpnChnlMgmtList';


				 param.fileName = fileName;
				 param.fileExtension = "xlsx";
				 param.excelPageDown = "N";
				 param.excelUpload = "N";
				 param.method =method;

				 $('#'+gridId).alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/excelcreate', param, 'GET', 'excelDownload');
             });


	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.mwOhcpnChnlMgmt);
    	}


    	if(flag == 'mwBdwhCd'){
    		$('#mwBdwhCd').clear();
    		var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

    		for(var i=0; i<response.length; i++){

    			var resObj =  {comCd: response[i].comCd, comCdNm: response[i].comCdNm};
    			option_data.push(resObj);
    		}

    		$('#mwBdwhCd').setData({
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

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
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

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex-1 + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)-1+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf-1+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)-1+ ";";
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

    function setGrid(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwOhcpnChnlMgmt', param, 'GET', 'search');
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