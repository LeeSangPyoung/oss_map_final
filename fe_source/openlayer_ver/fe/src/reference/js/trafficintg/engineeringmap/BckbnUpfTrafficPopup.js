/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

	var selectInfList = [
		{value: "core", text: "core"},
		{value: "access", text: "access"}
	  ];

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();     //select 정보 세팅
    	setDate();
    	setHour('startHour');
    	setHour('endHour');
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
        	fitTableWidth : true,
			autoResize: true,
	    	columnMapping: [
	    		{key : 'collectTime', align:'center', title: 'COLLECT_TIME', width: '120px'},
	    		{key : 'neid', align:'center', title: 'NEID', width: '80px'},
	    		{key : 'nwInstance', align:'center', title: 'NEWTORK_INSTANCE', width: '150px'},
	    		{key : 'inf', align:'center', title: 'INTERFACE', width: '90px'},
	    		{key : 'ipv4ThrSum', align:'right', title: 'IPV4_THR_SUM', width: '120px', headerStyleclass: "yellow", inlineStyle: {'font-weight' : 'bold'}},
	    		{key : 'inIpv4Thr', align:'right', title: 'IN_IPV4_THR', width: '120px'},
	    		{key : 'outIpv4Thr', align:'right', title: 'OUT_IPV4_THR', width: '120px'},
	    		{key : 'ipv6ThrSum', align:'right', title: 'IPV6_THR_SUM', width: '120px', headerStyleclass: "yellow", inlineStyle: {'font-weight' : 'bold'}},
	    		{key : 'inIpv6Thr', align:'right', title: 'IN_IPV6_THR', width: '120px'},
	    		{key : 'outIpv6Thr', align:'right', title: 'OUT_IPV6_THR', width: '120px'},
	    		{key : 'avgInTotalThr', align:'right', title: 'AVG_IN_TOTAL_THR', width: '150px'},
	    		{key : 'avgOutTotalThr', align:'right', title: 'AVG_OUT_TOTAL_THR', width: '150px'},
	    		{key : 'avgIpTotalThr', align:'right', title: 'AVG_IP_TOTAL_THR', width: '150px'},
	    		{key : 'peakInTotalThr', align:'right', title: 'PEAK_IN_TOTAL_THR', width: '150px'},
	    		{key : 'peakOutTotalThr', align:'right', title: 'PEAK_OUT_TOTAL_THR', width: '160px'},
	    		{key : 'peakIpTotalThr', align:'right', title: 'PEAK_IP_TOTAL_THR', width: '150px', headerStyleclass: "yellow", inlineStyle: {'font-weight' : 'bold'}},
	    		{key : 'inIpv4Pkts', align:'right', title: 'IN_IPV4_PKTS', width: '120px'},
	    		{key : 'inIpv4Bytes', align:'right', title: 'IN_IPV4_BYTES', width: '140px'},
	    		{key : 'inIpv4PktsFragment', align:'right', title: 'IN_IPV4_PKTS_FRAGMENT', width: '175px'},
	    		{key : 'inIpv4BytesFragment', align:'right', title: 'IN_IPV4_BYTES_FRAGMENT', width: '180px'},
	    		{key : 'inIpv4PktsDrop', align:'right', title: 'IN_IPV4_PKTS_DROP', width: '140px'},
	    		{key : 'inIpv4PktsDropNoPdr', align:'right', title: 'IN_IPV4_PKTS_DROP_NO_PDR', width: '195px'},
	    		{key : 'inIpv4PktsDropGateClosed', align:'right', title: 'IN_IPV4_PKTS_DROP_GATE_CLOSED', width: '240px'},
	    		{key : 'inIpv4PktsDropBitrate', align:'right', title: 'IN_IPV4_PKTS_DROP_BITRATE', width: '200px'},
	    		{key : 'inIpv4PktsDropPktRate', align:'right', title: 'IN_IPV4_PKTS_DROP_PKT_RATE', width: '210px'},
	    		{key : 'inIpv4PktsDropBufferFull', align:'right', title: 'IN_IPV4_PKTS_DROP_BUFFER_FULL', width: '240px'},
	    		{key : 'inIpv4PktsDropBufferFlush', align:'right', title: 'IN_IPV4_PKTS_DROP_BUFFER_FLUSH', width: '245px'},
	    		{key : 'inIpv4PktsDropFwdAction', align:'right', title: 'IN_IPV4_PKTS_DROP_FWD_ACTION', width: '230px'},
	    		{key : 'inIpv4PktsDropQuota', align:'right', title: 'IN_IPV4_PKTS_DROP_QUOTA', width: '190px'},
	    		{key : 'inIpv4PktsDropQuotaHoldingTime', align:'right', title: 'IN_IPV4_PKTS_DROP_QUOTA_HOLDING_TIME', width: '290px'},
	    		{key : 'inIpv4PktsRedirectHttp', align:'right', title: 'IN_IPV4_PKTS_REDIRECT_HTTP', width: '210px'},
	    		{key : 'inIpv4PktsDropNeedFragment', align:'right', title: 'IN_IPV4_PKTS_DROP_NEED_FRAGMENT', width: '270px'},
	    		{key : 'inIpv4PktsDropFragmentFailed', align:'right', title: 'IN_IPV4_PKTS_DROP_FRAGMENT_FAILED', width: '270px'},
	    		{key : 'outIpv4Pkts', align:'right', title: 'OUT_IPV4_PKTS', width: '120px'},
	    		{key : 'outIpv4Bytes', align:'right', title: 'OUT_IPV4_BYTES', width: '120px'},
	    		{key : 'outIpv4IcmpNeedFragmentPkts', align:'right', title: 'OUT_IPV4_ICMP_NEED_FRAGMENT_PKTS', width: '270px'},
	    		{key : 'outIpv4PktsDrop', align:'right', title: 'OUT_IPV4_PKTS_DROP', width: '160px'},
	    		{key : 'outIpv4PktsDropNeedFragment', align:'right', title: 'OUT_IPV4_PKTS_DROP_NEED_FRAGMENT', width: '270px'},
	    		{key : 'inIpv6Pkts', align:'right', title: 'IN_IPV6_PKTS', width: '120px'},
	    		{key : 'inIpv6Bytes', align:'right', title: 'IN_IPV6_BYTES', width: '120px'},
	    		{key : 'inIpv6PktsFragment', align:'right', title: 'IN_IPV6_PKTS_FRAGMENT', width: '175px'},
	    		{key : 'inIpv6BytesFragment', align:'right', title: 'IN_IPV6_BYTES_FRAGMENT', width: '180px'},
	    		{key : 'inIpv6PktsDrop', align:'right', title: 'IN_IPV6_PKTS_DROP', width: '140px'},
	    		{key : 'inIpv6PktsDropNoPdr', align:'right', title: 'IN_IPV6_PKTS_DROP_NO_PDR', width: '200px'},
	    		{key : 'inIpv6PktsDropGateClosed', align:'right', title: 'IN_IPV6_PKTS_DROP_GATE_CLOSED', width: '240px'},
	    		{key : 'inIpv6PktsDropBitrate', align:'right', title: 'IN_IPV6_PKTS_DROP_BITRATE', width: '200px'},
	    		{key : 'inIpv6PktsDropPacketRate', align:'right', title: 'IN_IPV6_PKTS_DROP_PACKET_RATE', width: '240px'},
	    		{key : 'inIpv6PktsDropBufferFull', align:'right', title: 'IN_IPV6_PKTS_DROP_BUFFER_FULL', width: '240px'},
	    		{key : 'inIpv6PktsDropBufferFlush', align:'right', title: 'IN_IPV6_PKTS_DROP_BUFFER_FLUSH', width: '250px'},
	    		{key : 'inIpv6PktsDropFwdAction', align:'right', title: 'IN_IPV6_PKTS_DROP_FWD_ACTION', width: '240px'},
	    		{key : 'inIpv6PktsDropQuota', align:'right', title: 'IN_IPV6_PKTS_DROP_QUOTA', width: '200px'},
	    		{key : 'inIpv6PktsDropQuotaHoldingTime', align:'right', title: 'IN_IPV6_PKTS_DROP_QUOTA_HOLDING_TIME', width: '290px'},
	    		{key : 'inIpv6PktsRedirectHttp', align:'right', title: 'IN_IPV6_PKTS_REDIRECT_HTTP', width: '210px'},
	    		{key : 'inIpv6PktsDropTooBig', align:'right', title: 'IN_IPV6_PKTS_DROP_TOO_BIG', width: '210px'},
	    		{key : 'inIpv6PktsDropFragmentFailed', align:'right', title: 'IN_IPV6_PKTS_DROP_FRAGMENT_FAILED', width: '280px'},
	    		{key : 'outIpv6Pkts', align:'right', title: 'OUT_IPV6_PKTS', width: '120px'},
	    		{key : 'outIpv6Bytes', align:'right', title: 'OUT_IPV6_BYTES', width: '120px'},
	    		{key : 'outIpv6IcmpTooBigPkts', align:'right', title: 'OUT_IPV6_ICMP_TOO_BIG_PKTS', width: '210px'},
	    		{key : 'outIpv6PktsDrop', align:'right', title: 'OUT_IPV6_PKTS_DROP', width: '160px'},
	    		{key : 'outIpv6PktsDropTooBig', align:'right', title: 'OUT_IPV6_PKTS_DROP_TOO_BIG', width: '210px'}
	    	],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
	}

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    	$('#inf').clear();
		$('#inf').setData({data : selectInfList, inf:'core'});
    }

    function setDate() {
    	var clctDtDay = getDay();
   		var clctDtMon = getMonth();
   		var clctDtYear = getYear();

   		var prevClctDtMon = getMonth();

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

		$("#btnTesExportExcel").on("click", function(e) {
			var gridData = $('#'+gridId).alopexGrid('dataGet');
			if (gridData.length == 0) {
				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
			}

			var param =  $("#searchForm").getData();
			var prevDate = $('#clctDtStart').val().replace(/-/gi,'');
			var date = $('#clctDt').val().replace(/-/gi,'');

			param = gridExcelColumn(param, gridId);
			param.pageNo = 1;
			param.rowPerPage = 60;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;
			param.inUserId = $('#sessionUserId').val();

			var now = new Date();
			var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
			var excelFileNm = '백본_UPF_Traffic_'+dayTime;
			param.fileName = excelFileNm;
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.excelMethod = "getTesBckBnUpfTrafficList";
			param.excelFlag = "TesBckBnUpfTrafficList";
			//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
			fileOnDemendName = excelFileNm+".xlsx";

			param.clctDtPrevYear = prevDate.substring(0,4);
	        param.clctDtPrevMon = prevDate.substring(4,6);
	        param.clctDtPrevDay = prevDate.substring(6,8);
	        param.startHour = $('#startHour').val();

	        param.clctDtYear = date.substring(0,4);
	        param.clctDtMon = date.substring(4,6);
	        param.clctDtDay = date.substring(6,8);
	        param.endHour = $('#endHour').val();

			$('#'+gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
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

	function setHour(selectId){
		var hours = [];
		var selectedHour = {};
		var now = new Date();
		var currentHour = now.getHours();

		$('#' + selectId).clear();

		for(var i=0; i<24; i++){
			var hour =
				{
					value: i < 10 ? '0' + i : i,
					text: i < 10 ? '0' + i + '시': i + '시'
				};

			if (i === currentHour) {
				selectedHour = {value: hour.value, text: hour.text};
			}

			hours.push(hour);
//			$('#' + selectId).append($('<option>', {value: i < 10 ? '0' + i : i, text: i < 10 ? '0' + i + '시': i + '시'}))
		}

		if (selectId == 'endHour'){
			$('#' + selectId).setData({data : hours, endHour:selectedHour.value});
		} else{
			$('#' + selectId).setData({data : hours, startHour:hours[0].value});
		}
	}

	function gridExcelColumn(param, gridId) {
		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {
			hidden:false
		});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined
					&& gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align.replace('right','center');
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
        param.startHour = $('#startHour').val();

        param.clctDtYear = date.substring(0,4);
        param.clctDtMon = date.substring(4,6);
        param.clctDtDay = date.substring(6,8);
        param.endHour = $('#endHour').val();

		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-tes-biz/transmisson/tes/engineeringmap/upftraffic/getBckBnUpfTraffic', param, 'GET', 'search');
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

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){
    	//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.bckBnUpfTrafficList);
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