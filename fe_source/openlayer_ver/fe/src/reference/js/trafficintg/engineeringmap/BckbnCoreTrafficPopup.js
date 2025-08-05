/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();     //select 정보 세팅
    	setDate();
        setEventListener();  //이벤트
        initGrid();
    };

    //Grid 초기화
	function initGrid() {
		//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
	    		key : 'daily', align:'center',
				title : '일자',
				width: '100px'
			},{
    			key : 'mtsoNm', align:'center',
				title : '국사명',
				width: '130px'
			},{
    			key : 'eqpMdlNm', align:'center',
				title : '장비모델',
				width: '130px'
			},{
    			key : 'eqpNm', align:'center',
				title : '장비명',
				width: '150px'
			},{
    			key : 'portNm', align:'center',
				title : '포트명',
				width: '130px'
			},{
    			key : 'portAlsNm', align:'center',
				title : '포트별명',
				width: '250px'
			},{
    			key : 'portIpAddr', align:'center',
				title : '포트IP',
				width: '130px'
			},{
    			key : 'portSpedVal', align:'right',
				title : '속도(Mb)',
				width: '100px'
			},{
    			key : 'mgmtDivCd', align:'center',
				title : '관리',
				width: '90px'
			},{
    			key : 'operDivCd', align:'center',
				title : '운영',
				width: '90px'
			},{
    			key : 'max1', align:'center',
				title : 'MAX시(1분)',
				width: '90px'
			},{
    			key : 'max1Mb', align:'right',
				title : 'MAX(1분,Mb)',
				width: '110px'
			},{
    			key : 'useRate1', align:'right',
				title : '사용률(1분,%)',
				width: '100px'
			},{
    			key : 'max5', align:'center',
				title : 'MAX시(5분)',
				width: '90px'
			},{
    			key : 'max5Mb', align:'right',
				title : 'MAX(5분,Mb)',
				width: '110px'
			},{
    			key : 'useRate5', align:'right',
				title : '사용률(5분,%)',
				width: '110px'
			},{
    			key : 'busyHour', align:'center',
				title : '최번시',
				width: '90px'
			},{
    			key : 'busyHourAvg', align:'right',
				title : '최번시평균(Mb)',
				width: '110px'
			},{
    			key : 'useRate', align:'right',
				title : '사용률(%)',
				width: '90px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
	}

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
    	var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	httpRequest('tango-transmission-biz/transmisson/trafficintg/trafficintgcode/trmsmtsos', param, 'GET', 'trmsmtsos');
    }

    function setDate() {
    	var clctDtDay = getDay(-1);
   		var clctDtMon = getMonth(-1);
   		var clctDtYear = getYear(-1);

   		var prevClctDtMon = getMonth(-1,-1);

   		$('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
   		$('#clctDtStart').val(clctDtYear + '-' + prevClctDtMon + '-' + clctDtDay);
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {
    	var perPage = 100;

    	// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			main.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			main.setGrid(1, eObj.perPage);
		});

		// 조회
   	 	$('#btnSearch').on('click', function(e) {
   	 		main.setGrid(1, perPage);
        });

   	 	// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				main.setGrid(1, perPage);
			}
		});

		$("#btnExportExcel").on("click", function(e) {
			var gridData = $('#'+gridId).alopexGrid('dataGet');
			if (gridData.length == 0) {
				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
			}

			//tango transmission biz 모듈을 호출하여야한다.
			var param =  $("#searchForm").getData();
    		var prevDate = $('#clctDtStart').val().replace(/-/gi,'');
    		var date = $('#clctDt').val().replace(/-/gi,'');

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;
            param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "bckBnCoreTraffic";

    		param.fileExtension = "xlsx";
            // (2017-03-06 : HS Kim) OnDemand 엑셀배치 추가 Start
            var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        param.fileName = "백본_CORE_대표_Traffic_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "BckBnCoreTraffic";
    		//alert("(HS Kim) excelFlag / param.dateDiv / param.trmsMtsoId : " + param.excelFlag + " / " + param.dateDiv + " / " + param.trmsMtsoId);
    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;
    		// (2017-03-06 : HS Kim) End

    		param.clctDtPrevYear = prevDate.substring(0,4);
            param.clctDtPrevMon = prevDate.substring(4,6);
            param.clctDtPrevDay = prevDate.substring(6,8);

            param.clctDtYear = date.substring(0,4);
            param.clctDtMon = date.substring(4,6);
            param.clctDtDay = date.substring(6,8);

    		$('#'+gridId).alopexGrid('showProgress');
    		// (2017-03-06 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, 'POST', 'excelDownloadOnDemand');
		});
	};

	function getYear(setDay = 0, setMonth = 0, setDate= 0){
    	if (setDate == 0){
    		var vDate = new Date();
    	} else{
    		var vDate = new Date( parseInt(setDate.toString().substring(0,4)),  parseInt(setDate.toString().substring(4,6)) -1, parseInt(setDate.toString().substring(6,8)));
    	}

    	// 기준 월이 없을 경우
    	if (setDay == 0) {
    		vDate.setDate(vDate.getDate());
    	} else {

    		if (setDay.toString()[0] == "-") {
				vDate.setDate(vDate.getDate() - parseInt(setDay.toString().replace("-","")));
			} else {
				vDate.setDate(vDate.getDate() + parseInt(setDay.toString().replace("-","")));
			}
    	}

    	var returnMon;
    	if (setMonth == 0) {
    		returnMon = vDate.getMonth() + 1;
    	} else {

    		if (setMonth.toString()[0] == "-") {
    			vDate.setMonth(vDate.getMonth()  - parseInt(setMonth.toString().replace("-","")));
    			returnMon =  vDate.getMonth() + 1;
			} else {
				vDate.setMonth(vDate.getMonth()  + parseInt(setMonth.toString().replace("-","")));
				returnMon =  vDate.getMonth() + 1;
			}

    	}

    	return  vDate.getFullYear();
    }

    function getMonth(setDay = 0, setMonth = 0, setDate = 0){
    	if (setDate == 0){
    		var vDate = new Date();
    	} else{
    		var vDate = new Date( parseInt(setDate.toString().substring(0,4)),  parseInt(setDate.toString().substring(4,6)) -1, parseInt(setDate.toString().substring(6,8)));
    	}

    	// 기준 월이 없을 경우
    	if (setDay == 0) {
    		vDate.setDate(vDate.getDate());
    	} else {

    		if (setDay.toString()[0] == "-") {
				vDate.setDate(vDate.getDate() - parseInt(setDay.toString().replace("-","")));
			} else {
				vDate.setDate(vDate.getDate() + parseInt(setDay.toString().replace("-","")));
			}
    	}

    	var returnMon;

    	if (setMonth == 0) {
    		returnMon = vDate.getMonth() + 1;
    	} else {

    		if (setMonth.toString()[0] == "-") {
    			vDate.setMonth(vDate.getMonth()  - parseInt(setMonth.toString().replace("-","")));
    			 returnMon =  vDate.getMonth() + 1;
			} else {
				vDate.setMonth(vDate.getMonth()  + parseInt(setMonth.toString().replace("-","")));
				returnMon =  vDate.getMonth() + 1;
			}

    	}

    	return parseInt(returnMon) < 10 ? '0' + returnMon : returnMon;
    }

	function getDay(setDay = 0, setDate = 0){
    	if (setDate == 0){
    		var vDate = new Date();
    	} else{
    		var vDate = new Date( parseInt(setDate.toString().substring(0,4)),  parseInt(setDate.toString().substring(4,6)) -1, parseInt(setDate.toString().substring(6,8)));
    	}

    	// 기준 일이 없을 경우
    	if (setDay == 0) {
    		vDate.setDate(vDate.getDate());
    	} else {
    		if (setDay.toString()[0] == "-") {
				vDate.setDate(vDate.getDate() - parseInt(setDay.toString().replace("-","")));
			} else {
				vDate.setDate(vDate.getDate() + parseInt(setDay.toString().replace("-","")));
			}
    	}

    	var returnDay = vDate.getDate();

    	return parseInt(returnDay) < 10 ? '0' + returnDay : returnDay;
    }

	function gridExcelColumn(param, gridId) {
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

	this.setGrid = function(page, rowPerPage){
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);
		$('#'+gridId).alopexGrid('dataEmpty');

		var param =  $("#searchForm").getData();
		var prevDate = $('#clctDtStart').val().replace(/-/gi,'');
		var date = $('#clctDt').val().replace(/-/gi,'');

		param.clctDtPrevYear = prevDate.substring(0,4);
        param.clctDtPrevMon = prevDate.substring(4,6);
        param.clctDtPrevDay = prevDate.substring(6,8);

        param.clctDtYear = date.substring(0,4);
        param.clctDtMon = date.substring(4,6);
        param.clctDtDay = date.substring(6,8);

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/trafficintg/trafficeng/getBckBnCoreTraffic', param, 'GET', 'search');
	}


	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'trmsmtsos'){
    		$('#trmsMtsoNm').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj =  {mtsoId: response[i].mtsoId, mtsoNm: response[i].mtsoNm};
				option_data.push(resObj);
    		}

    		$('#trmsMtsoNm').setData({
	             data:option_data
			});
    	}

    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.bckBnCoreTrafficList);
    	}

    	if(flag == 'excelDownloadOnDemand'){
    		$('#'+gridId).alopexGrid('hideProgress');

    		var jobInstanceId = response.resultData.jobInstanceId;
    		//alert("(HS Kim) fileOnDemandName / jobInstanceId : " + fileOnDemandName + " / " + jobInstanceId);
    		// 엑셀다운로드팝업
            $a.popup({
                   popid: 'TrafficExcelDownloadPop' + jobInstanceId,
                   title: '엑셀다운로드',
                   iframe: true,
                   modal : false,
                   windowpopup : true,
                   url: '/tango-transmission-web/trafficintg/TrafficExcelDownloadPop.do',
                   data: {
                       jobInstanceId : jobInstanceId,
                       fileName : fileOnDemandName,
                       fileExtension : fileOnDemandExtension
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
    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
		}
    };

    function setSPGrid(GridID, Option, Data) {
    	var serverPageinfo = {};
    	if (GridID == "dataGrid") {
    		serverPageinfo = {
    				dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
    				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	}

    	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    /*-----------------------------*
     *  HTTP
     *-----------------------------*/
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };

});