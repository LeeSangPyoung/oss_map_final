/**
 * WreEqpDemdRvListPop.js
 *
 * @author PTN9017220
 * @date 2024. 06. 12
 * @version 1.0
 */
var popUp = $a.page(function() {

	var gridId = 'gridData';
	var paramData = null;
	var mEqpDivCmb = [];

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	$('#pageNo').val(1);
    	$('#rowPerPage').val(100000000);

    	initGrid();
    	setGridData(param);
    	setEventListener();
    };

    function initGrid(){
    	$('#'+gridId).alopexGrid({
    		paging : {
    			pagerSelect: false
    			,hidePageList: true  // pager 중앙 삭제
    		},
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			width:'100%',
				align:'center',
    		},
			message:{
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>",
				filterNodata: configMsgArray['noData']
			},
			headerGroup: [
				{fromIndex:'demdMtsoNm', toIndex:'regMeansNm', title:'수요 정보'}
			],
    		columnMapping: [
    			{key : 'afeYr', align:'center', title : '년도', width: '70px', editable: false},
    			{key : 'afeDemdDgr', align:'center', title : '차수', width: '70px', editable: false},
    			{key : 'hdofcNm', align:'center', title : '본부', width: '80px', editable: false},
    			{key : 'areaNm', align:'center', title : '지사', width: '100px', editable: false},
    			{key : 'demdBizDivNm', align:'center', title : '사업목적', width: '130px', editable: false},
    			{key : 'lowDemdBizDivNm', align:'center', title : '사업구분', width: '180px', editable: false},
    			{key : 'eqpDivNm', align:'center', title : '설계대상', width: '100px'},
    			{key : 'demdMtsoNm', align:'left', title : '수요국사', width: '180px', editable: false},
    			{key : 'eqpRoleDivNm', align:'center', title : '장비', width: '100px', editable: false},
    			{key : 'splyVndrNm', align:'center', title : '벤더', width: '115px', editable: false},
    			{key : 'demdEqpQuty', align:'center', title : '수량', width: '90px'},
    			{key : 'dsnRsltNm', align:'center', title : '설계반영', width: '90px', editable : false},
    			{key : 'regMeansNm', align:'center', title : '등록방식', width: '100px', editable : false}
	      ]
        });
    }


    function setGridData(param) {

    	param.pageNo = 1;
    	param.rowPerPage = 100000000;

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getDemdRvRsltHstList', param, 'GET', 'search');
    }

    function setEventListener(){


    	// 취소
		$('#btnPopClose').on('click', function(e) {
			$a.close();
		});

    	// 페이지 번호 클릭시
   	 	$('#'+gridId).on('pageSet', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	setFormData(obj.page, obj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var obj = AlopexGrid.parseEvent(e);
        	setFormData(1, obj.perPage);
        });

		// 엑셀 다운로드
        $('#btnExcelDown').on('click', function(e) {
        	var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = '설계결과연동내역_'+dayTime;
        	var worker = new ExcelWorker({
        		excelFileName : excelFileNm,
        		sheetList:[{
        			sheetName : '설계결과 연동내역',
        			$grid: $('#'+gridId)
        		}]
        	});

        	worker.export({
        		merge: true,
        		exportHidden: false,
        		filtered: false,
        		useGridColumnWidth : true,
        		border: true,
        		exportGroupSummary:true,
        		exportFooter: true,
        		useCSSParser: true,
        		callback : {
 					preCallback : function(gridList){
 						for(var i=0; i < gridList.length; i++) {
 							if(i == 0  || i == gridList.length -1)
 								gridList[i].alopexGrid('showProgress');
 						}
 					},
 					postCallback : function(gridList) {
 						for(var i=0; i< gridList.length; i++) {
 							gridList[i].alopexGrid('hideProgress');
 						}
 					}
 				}
        	});
		});
    }

    // 조회
    function setFormData(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    }

    function setGrid(gridId, Option, Data) {

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);
	}

  	//request 호출
    var httpRequest = function(Url, Param, Method, Flag) {

    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    //request 성공시.
	function successCallback(response, status, jqxhr, flag){

		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setGrid(gridId, response, response.dataList);
		}
    }

    //request 실패시.
    function failCallback(response, status, flag, jqxhr ){
    	$('#'+gridId).alopexGrid('hideProgress');
    	//조회 실패 하였습니다.
		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    }
});