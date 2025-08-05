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
	var regMeans = '';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	regMeans = getRegMean(param.regMeansNm);

    	if(regMeans == "RM00"){
    		callMsgBox('','I', '\"' +param.regMeansNm + '\"' + '방식으로 입력된 정보는 이력정보가 존재하지 않습니다.' , function(msgId, msgRst){
 		       if (msgRst == 'Y') {
 		           $a.close();
 		       }
    		});
    	}

    	$('#pageNo').val(1);
    	$('#rowPerPage').val(100000000);
    	
    	initGrid(regMeans);
    	setGridData(param);
    	setEventListener();
    };

    function getRegMean(value){
    	var returnDate = "RM00";

    	switch(value){
			case "BPM연동":
				returnDate =  "RM01";
				break;
			case "엑셀연동":
				returnDate =  "RM02";
				break;
			case "용량증설":
				returnDate =  "RM03";
				break;
			default :
				returnData = "RM00";
    	}

    	return returnDate;
    }

    function getGridColumn(value){
    	var gridColumn = [];

    	switch(value){
    		case "RM01":
	    		gridColumn =  [
					    			{key : 'regMeansNm', align:'center', title : '연동방식', width: '120px', editable: false},
					    			{key : 'afeYr', align:'center', title : '년도', width: '70px', editable: false},
					    			{key : 'afeDemdDgr', align:'center', title : '차수', width: '70px', editable: false},
					    			{key : 'hdofcNm', align:'center', title : '본부', width: '80px', editable: false},
					    			{key : 'areaNm', align:'center', title : '지사', width: '100px', editable: false},
					    			{key : 'fcltsCd', align:'center', title : '시설코드', width: '100px', editable: false},
					    			{key : 'demdMtsoNm', align:'left', title : '국소명', width: '250px', editable: false},
					    			{key : 'srvcNm', align:'center', title : '서비스명', width: '80px', editable: false},
					    			{key : 'cstrTyp', align:'center', title : '공사유형', width: '100px', editable: false},
					    			{key : 'fhOnafMeansNm', align:'center', title : '장비방식', width: '80px', editable: false},
					    			{key : 'srvcLclNm', align:'center', title : '서비스대분류', width: '100px', editable: false},
					    			{key : 'srvcMclNm', align:'center', title : '서비스중분류', width: '100px', editable: false},
					    			{key : 'procProgStatVal', align:'center', title : '진행상태', width: '100px', editable: false},
					    			{key : 'sggNm', align:'center', title : '시군구', width: '80px', editable : false},
					    			{key : 'emdNm', align:'center', title : '읍면동', width: '80px', editable : false},
					    			{key : 'xcrdVal', align:'center', title : '위도', width: '80px', editable : false},
					    			{key : 'ycrdVal', align:'center', title : '경도', width: '80px', editable : true },
					    			{key : 'siteCd', align:'center', title : '사이트키', width: '130px', editable: false}
						      ];
			break;
    		case "RM02":
    			gridColumn =  [
    								{key : 'regMeansNm', align:'center', title : '연동방식', width: '120px', editable: false},
    								{key : 'afeYr', align:'center', title : '년도', width: '80px', editable: false},
    								{key : 'afeDemdDgr', align:'center', title : '차수', width: '80px', editable: false},
    								{key : 'hdofcNm', align:'center', title : '본부', width: '80px', editable: false},
    								{key : 'areaNm', align:'center', title : '지사', width: '80px', editable: false},
    								{key : 'siteCd', align:'center', title : '사이트키', width: '150px', editable: false},
    								{key : 'fcltsCd', align:'center', title : '시설코드', width: '150px', editable: false},
    								{key : 'mtsoNm', align:'center', title : '국소명', width: '250px', editable: false},
    								{key : 'srvcLclNm', align:'center', title : '공사유형', width: '120px', editable: false},
    								{key : 'srvcMclNm', align:'center', title : '세부공사유형', width: '120px', editable: false},
    								{key : 'sggNm', align:'center', title : '시군구', width: '120px', editable : false},
    								{key : 'emdNm', align:'center', title : '읍면동', width: '120px', editable : false},
    								{key : 'xcrdVal', align:'center', title : '위도', width: '100px', editable : false},
    								{key : 'ycrdVal', align:'center', title : '경도', width: '130px', editable : false}
    					      ];
    		break;
    		case "RM03":
    			gridColumn =  [
    								{key : 'regMeansNm', align:'center', title : '연동방식', width: '120px', editable: false},
    								{key : 'clctDt', align:'center', title : '일자', width: '80px', editable: false},
    								{key : 'eqpDivNm', align:'center', title : '장비구분', width: '80px', editable: false},
    								{key : 'hdofcNm', align:'center', title : '본부', width: '80px', editable: false},
    								{key : 'areaNm', align:'center', title : '지사', width: '80px', editable: false},
    								{key : 'demdMtsoNm', align:'center', title : '국사', width: '140px', editable: false},
    								{key : 'eqpNm', align:'center', title : '장비명', width: '160px', editable: false},
    								{key : 'splyVndrNm', align:'center', title : '제조사', width: '100px', editable: false},
    								{key : 'icreDivCd', align:'center', title : '증설구분코드', width: '100px', editable : false},
    								{key : 'portCnt', align:'center', title : '포트수', width: '80px', editable : false},
    								{key : 'trfAvgVal', align:'center', title : '트래픽량', width: '80px', editable : false},
    								{key : 'mcpNm', align:'center', title : '광역시도', width: '80px', editable : false},
    								{key : 'sggNm', align:'center', title : '시군구', width: '80px', editable : false},
    								{key : 'emdNm', align:'center', title : '읍면동', width: '80px', editable : false},
    								{key : 'extrtRsn', align:'center', title : '용량증설 추출사유', width: '180px', editable : false}
		    				  ];
    			break;
    		default :
    			gridColumn =  [
				    				{key : 'regMeansNm', align:'center', title : '연동방식', width: '120px', editable: false},
					    			{key : 'afeYr', align:'center', title : '년도', width: '70px', editable: false},
					    			{key : 'afeDemdDgr', align:'center', title : '차수', width: '70px', editable: false},
					    			{key : 'hdofcNm', align:'center', title : '본부', width: '80px', editable: false},
					    			{key : 'areaNm', align:'center', title : '지사', width: '100px', editable: false},
					    			{key : 'fcltsCd', align:'center', title : '시설코드', width: '100px', editable: false},
					    			{key : 'demdMtsoNm', align:'left', title : '국소명', width: '250px', editable: false},
					    			{key : 'srvcNm', align:'center', title : '서비스명', width: '80px', editable: false},
					    			{key : 'cstrTyp', align:'center', title : '공사유형', width: '100px', editable: false},
					    			{key : 'fhOnafMeansNm', align:'center', title : '장비방식', width: '80px', editable: false},
					    			{key : 'srvcLclNm', align:'center', title : '서비스대분류', width: '100px', editable: false},
					    			{key : 'srvcMclNm', align:'center', title : '서비스중분류', width: '100px', editable: false},
					    			{key : 'procProgStatVal', align:'center', title : '진행상태', width: '100px', editable: false},
					    			{key : 'sggNm', align:'center', title : '시군구', width: '80px', editable : false},
					    			{key : 'emdNm', align:'center', title : '읍면동', width: '80px', editable : false},
					    			{key : 'xcrdVal', align:'center', title : '위도', width: '80px', editable : false},
					    			{key : 'ycrdVal', align:'center', title : '경도', width: '80px', editable : true },
					    			{key : 'siteCd', align:'center', title : '사이트키', width: '130px', editable: false}
					    	   ];
    	}

    	return gridColumn;
    }

    function initGrid(regMeans){

    	var gridColumn = getGridColumn(regMeans);

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
    		columnMapping: gridColumn
        });
    }


    function setGridData(param) {

    	param.pageNo = 1;
    	param.rowPerPage = 100000000;

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getDemdRvHstList', param, 'GET', 'search');
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
	        var excelFileNm = '수요검토연동내역_'+dayTime;
        	var worker = new ExcelWorker({
        		excelFileName : excelFileNm,
        		sheetList:[{
        			sheetName : '수요검토연동내역',
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