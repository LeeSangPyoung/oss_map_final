/**
 * DwTargetRegPop.js
 *
 * @author 김장훈
 * @date 2022. 07. 05. 오전 10:14:03
 * @version 1.0
 */
$a.page(function() {
	var gridId = 'dataGridPop';
	var mOpLinkMin 		= [];
	var mOLinkTime 		= [];
	var mOLinkDay 		= [];
	var mOldLnkgTblNm	= "";
    //초기 진입점
	var paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;

    	setRegDataSet(param);
    	setCyeSelectBox();
        setEventListener();

    	initGrid();

        // DW연동대상 상세조회
        httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/dwTargetMgmtDtl', param, 'GET', 'detail');

    };

    function setRegDataSet(data) {

    	if(data.newYn == "Y"){
    		$("#btnDtlDel").hide();
    		$("#spn_header").text("등록");
    		$("#spn_title").text("DW 연동 대상 관리 - 등록");
    		$("#btnReProcYn").hide();
    	}else{
    		$("#btnDtlDel").show();
    		$("#spn_header").text("상세 정보");
    		$("#spn_title").text("DW 연동 대상 관리 - 상세 정보");
    	}

    	// 연동시간(분)
    	$("#selLinkMin").empty();
    	for( var i = 0; i <= 59; i++){
    		var value = i + "";
    		$("#selLinkMin").append("<option value='"+value.padStart(2,'0')+"'>"+value.padStart(2,'0')+"</option>");
    	}

    	// 연동시간(시)
    	$("#selLinkTime").empty();
    	for( var i = 0; i <= 23; i++){
    		var value = i + "";
    		$("#selLinkTime").append("<option value='"+value.padStart(2,'0')+"'>"+value.padStart(2,'0')+"</option>");
    	}

    	// 연동시간(일)
    	$("#selLinkDay").empty();
    	for( var i = 1; i <= 30; i++){
    		var value = i + "";
    		$("#selLinkDay").append("<option value='"+value.padStart(2,'0')+"'>"+value.padStart(2,'0')+"</option>");
    	}

	}

	//Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	pager : false,
        	autoColumnIndex: true,
    		autoResize: true,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : false
    		},
    		rowSelectOption : {
    			clickSelect : false
    		},
       		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : '순번',
				width: '50px',
				numberingColumn: true
			}, {
				width : '40px',
				selectorColumn : true
			},
			{
				key : 'colNm', align:'center',
				title : '컬럼명',
				width: '200px'
			}, {
				key : 'colComments', align:'center',
				title : 'Comment',
				width: '200px'
			}, {
				key : 'dataType', align:'center',
				title : 'Type',
				width: '100px'
			}, {
				key : 'dataLength', align:'center',
				title : 'Size',
				width: '80px'
			}, {
				key : 'columnId', align:'center',
				title : 'columnId',
				width: '80px',
				hidden: true
			}, {
				key : 'colSeq', align:'center',
				title : 'colSeq',
				width: '80px',
				hidden: true
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	};

    function setEventListener() {

        //조회
    	$('#btnDtlSearch').on('click', function(e) {
    		setPopGrid();
    	});

    	//승인
    	$('#btnAprv').on('click', function(e) {
    		dwTargetAprvReg();
    	});

    	//저장
    	$('#btnDtlSave').on('click', function(e) {
    		dwTargetInfoReg();
    	});

    	//삭제
		$('#btnDtlDel').on('click', function(e) {
			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
				//삭제한다고 하였을 경우
				if (msgRst == 'Y') {
					var param =  $("#dwTargetRegForm").getData();

					$('#'+gridId).alopexGrid('showProgress');
					httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/dwTargetMgmtDel?method=delete', param, 'POST', 'delete');
				}
		    });
		});

    	//취소
		$('#btnDtlCncl').on('click', function(e) {
			$a.close();
		});

    	//연동주기 선택
    	$('#selLinkCyc').on('change', function(e) {
    		setCyeSelectBox($(this).val());
    	});

    	//엑셀다운
    	$('#btnExportExcelDown').on('click', function(e) {
    		var gridData = $('#'+gridId).alopexGrid('dataGet');
    		if (gridData.length == 0) {
    			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
    				return;
    		}

    		var param = $("#dwTargetRegForm").getData();
        	if (param.lnkgTblNm == "") {
        		callMsgBox('','W', '필수입력 항목입니다. [ 대상테이블 ]', function(msgId, msgRst){});
        		return;
        	}

    		var excelFileName = "DW연동테이블컬럼정보_"+param.lnkgTblNm;
    		var worker = new ExcelWorker({
        		excelFileName : excelFileName,
        		palette : [{
        			className : 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className : 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: param.lnkgTblNm,
        			$grid: $('#dataGridPop')
        		}]
        	});
        	worker.export({
        		merge: false,
        		exportHidden: false,
        		useGridColumnWidth : true,
        		border  : true,
        		exportNumberingColumn : true,
        		selected: true
        	});
        });

    	//재처리
		$('#btnReProcYn').on('click', function(e) {
			 $a.popup({
		        	popid: 'dwTargetReProcPop',
		        	title: 'DW 재처리',
		        	url: '/tango-transmission-web/configmgmt/dwtargetmgmt/DwTargetReProcPop.do',
		        	data: paramData,
		        	windowpopup : true,
		        	modal: true,
		        	movable:true,
		        	width : 400,
		        	height : 160,
		        	callback: function(data) {
		        		console.log(data);

		        		if (data.reProcYn === 'Y') {
		        			$("#btnReProcYn").hide();
		        		}
		        	}
		        });

		});

	}

    // 연동주기 선택박스 이벤트
    function setCyeSelectBox(value){
    	$("#span_LinkDay").hide();
    	$("#div_LinkDay").hide();
    	$("#span_LinkWeek").hide();
    	$("#div_LinkWeek").hide();

    	switch(value){
    	case "W":	// 주간
        	$("#span_LinkWeek").show();
        	$("#div_LinkWeek").show();
    		break;
    	case "M":	// 월간
        	$("#span_LinkDay").show();
        	$("#div_LinkDay").show();
    		break;
		}
    }

	function setPopGrid(){
    	$('#pageNo').val(2);
    	$('#rowPerPage').val(10);
    	var param =  $("#dwTargetRegForm").getData();

    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/getTblColSearch', param, 'GET', 'search');
    }

	// DW대상정보 승인
	function dwTargetAprvReg() {
		var param =  $("#dwTargetRegForm").getData();
		param.aprvReg = 'Y';

		// DW대상정보 저장
	    callMsgBox('','C', "메타정보를 전달하셨습니까?", function(msgId, msgRst){
	    	//전달 하였을 경우
	    	if (msgRst == 'Y') {
	    		$('#'+gridId).alopexGrid('showProgress');
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/dwTargetMgmtReg', param, 'POST', 'aprvReg');
	    	}
	    });
	}

	// DW대상정보 저장
    function dwTargetInfoReg() {

    	var param =  $("#dwTargetRegForm").getData();

    	// 연동주기 처리
    	var ifPrdDesc = ""; // 연동주기 Full values
    	switch($("#selLinkCyc").val()){
    	case "D":	// 일간
    		ifPrdDesc = $("#selLinkCyc").val() + " " + $("#selLinkMin").val() + " " + $("#selLinkTime").val();
    		break;
    	case "W":	// 주간
    		var week = $("#selLinkWeek option:selected").text();
    		ifPrdDesc = $("#selLinkCyc").val() + " " + $("#selLinkMin").val() + " " + $("#selLinkTime").val() + " " + week;
    		break;
    	case "M":	// 월간
    		ifPrdDesc = $("#selLinkCyc").val() + " " + $("#selLinkMin").val() + " " + $("#selLinkTime").val() + " " + $("#selLinkDay").val();
    		break;
		}
    	param.ifPrdDesc = ifPrdDesc;

    	// 선택한 컬럼 정보
    	var gridData = $('#'+gridId).alopexGrid('dataGet',{_state: {selected:true}});

    	//컬럼ID로 오름차순 정렬
    	//var sortData = gridData.sort(function(a, b){return Number(a.columnId) - Number(b.columnId);});

    	var colNm = "";
    	for(var i = 0; i < gridData.length; i++){
    		colNm = colNm + gridData[i].colNm +",";
    	}

    	var strSelQryCtt = colNm.slice(0,-1);
    	param.selQryCtt1 = stringfromByteLen(strSelQryCtt,4000);
    	param.selQryCtt2 = strSelQryCtt.substring(param.selQryCtt1.length,strSelQryCtt.length);

//    	param.selQryCtt = colNm.slice(0,-1);

    	// 필수값 체크 확인
    	if (param.lnkgIfNm == "") {
    		callMsgBox('','W', '필수입력 항목입니다. [ 연동명 ]', function(msgId, msgRst){});
    		return;
    	}
    	if (param.lnkgTblNm == "") {
    		callMsgBox('','W', '필수입력 항목입니다. [ 대상테이블 ]', function(msgId, msgRst){});
    		return;
    	}
    	if (param.selQryCtt == "") {
    		callMsgBox('','W', '선택한 컬럼정보가 없습니다. [ 컬럼명 ]', function(msgId, msgRst){});
    		return;
    	}
    	if (mOldLnkgTblNm != param.lnkgTblNm) {
    		callMsgBox('','W', '대상테이블이 변경되었습니다.\n 조회 후 저장 하십시오.', function(msgId, msgRst){});
    		return;
    	}

    	// DW대상정보 저장
	    callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
	    	//저장한다고 하였을 경우
	    	if (msgRst == 'Y') {
	    		$('#'+gridId).alopexGrid('showProgress');
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/dwTargetMgmtReg', param, 'POST', 'save');
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

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
		switch(flag){
		case "search":
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.columnList);

			// 원본 테이블명 셋팅
			mOldLnkgTblNm = $('#lnkgTblNm').val();

			break;
		case "detail":
    		$('#dwTargetRegForm').formReset();

    		var data = response.detaleData;

    		if(data != null){
    			var dataSplit = data.ifPrdDesc.split(" ");
    			setCyeSelectBox(dataSplit[0]);

    			// 승인버튼 활성
    			if(data.delYn == "Y"){
    				$("#btnAprv").show();
    				$("#txtAprvYn").val("N");
    			}else{
    				$("#btnAprv").hide();
    				$("#txtAprvYn").val("Y");
    			}

    			// 재처리 버튼 활성화
    			if(data.lnkgFailYn == "Y" && data.reProcYn == "N"){
    				$("#btnReProcYn").show();
    			}else{
    				$("#btnReProcYn").hide();
    			}


    			// 연동주기 셋팅
    			data.linkCycCd = dataSplit[0];
    			data.linkMinCd = dataSplit[1];
    			data.linkTimeCd = dataSplit[2];

    			if(dataSplit[0] == "D"){
    				data.linkDayCd = getNowDate("DD");
    				data.linkWeekCd = getNowDate("DAY");
    			}else if(dataSplit[0] == "W"){
        			data.linkDayCd = getNowDate("DD");
        			if(dataSplit[3] == ""){

            			data.linkWeekCd = getNowDate("DAY");;
        			}else{
        				$("#selLinkWeek option").filter(function(){return this.text == dataSplit[3];}).attr("selected",true);
            			data.linkWeekCd = $("#selLinkWeek option:selected").val();
        			}
    			}else if(dataSplit[0] == "M"){
        			data.linkWeekCd = getNowDate("DAY");
        			if(dataSplit[3] == ""){
            			data.linkDayCd = getNowDate("DD");;
        			}else{
            			data.linkDayCd = dataSplit[3];
        			}
    			}
    		}else{
    			//$("#txtAprvYn").val("N");
    			// 연동주기 셋팅
    			data = {"linkCycCd":"D","linkMinCd":getNowDate("mm"),"linkTimeCd":getNowDate("hh"),
    					"linkDayCd":getNowDate("DD"),"linkWeekCd":getNowDate("DAY"),"colNmInclYn":"N",
    					"frstRegUserNm":"","frstRegDate":""};
    		}

    		$('#frstRegUserNm').text(data.frstRegUserNm);
    		$('#frstRegDate').text(data.frstRegDate);
    		$('#dwTargetRegForm').setData(data);

    		// 컬럼조회
    		setPopGrid();
			break;
		case "save":
			$('#'+gridId).alopexGrid('hideProgress');
			if(response.Result == "Success"){
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	  		       if (msgRst == 'Y') {
	  		    	   $("#btnDtlDel").show();
	  		    	   var dataParam = {"lnkgIfId": response.lnkgIfId};
	  		    	   // DW연동대상 상세조회
	  		    	   httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/dwTargetMgmtDtl', dataParam, 'GET', 'detail');
	  		       }
	     		});
			}else if (response.Result == "Fail") {
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
			break;
		case "aprvReg":
			$('#'+gridId).alopexGrid('hideProgress');
			if(response.Result == "Success"){
				callMsgBox('','I', "승인처리 되었습니다." , function(msgId, msgRst){
	  		       if (msgRst == 'Y') {
	  		    	   var dataParam = {"lnkgIfId": response.lnkgIfId};
	  		    	   // DW연동대상 상세조회
	  		    	   httpRequest('tango-transmission-biz/transmisson/configmgmt/dwtargetmgmt/dwTargetMgmtDtl', dataParam, 'GET', 'detail');
	  		       }
	     		});
			}else if (response.Result == "Fail") {
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
			break;
		case "delete":
			$('#'+gridId).alopexGrid('hideProgress');
			if(response.Result == "Success"){
				callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
		  		       if (msgRst == 'Y') {
		  		    	 $a.close();
		  		       }
				});
			}else if (response.Result == "Fail") {
    			callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
    		}
			break;
		}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
		case "search":
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
			break;
		case "save":
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
			break;
		case "delete":
    		//삭제를 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
			break;
		}
    }

    //조회데티어 출력
    function setSPGrid(GridID, Option, Data) {
		$('#'+GridID).alopexGrid('dataSet', Data, "");

		for(var i = 0; i < Data.length; i++){
			if(Data[i].colSelect == "Y"){
				$('#'+GridID).alopexGrid('rowSelect', {_index:{data : i}}, true);
			}
		}
	}


    // 현재날짜,시간,요일 가져오기
    function getNowDate(dateFormat) {
    	var calDate = new Date();

    	var year = calDate.getFullYear();
    	var day = calDate.getDay();
    	var month = calDate.getMonth() + 1;
    	var dd = calDate.getDate();
    	var hh = calDate.getHours();
    	var mm = calDate.getMinutes();

    	switch(dateFormat) {
    		case 'YYYY' :
    			dateStr = year;
    			break;
    		case 'DAY' :
    			dateStr = day;
    			break;
    		case 'MM' :
    			dateStr = month.toString().padStart(2,'0');
    			break;
    		case 'DD' :
    			dateStr = dd.toString().padStart(2,'0');
    			break;
    		case 'hh' :
    			dateStr = hh.toString().padStart(2,'0');
    			break;
    		case 'mm' :
    			dateStr = mm.toString().padStart(2,'0');
    			break;
    		case 'M' :
    			dateStr = month.toString();
    			break;
    		case 'D' :
    			dateStr = dd.toString();
    			break;
    		case 'h' :
    			dateStr = hh.toString();
    			break;
    		case 'm' :
    			dateStr = mm.toString();
    			break;
    		default :
    			dateStr = year + "-" + month.toString().padStart(2,'0') + "-" + dd.toString().padStart(2,'0');
    			break;
    	}

    	return dateStr;
    }

    $.fn.formReset = function() {

    	return this.each(function() {
    		var type = this.type,
    			tag = this.tagName.toLowerCase()
    		if (tag === "form") {
    			return $(":input", this).formReset()
    		}

    		if (type === "text" || type === "password" || type == "hidden" || tag === "textarea") {
    			this.value = ""
    		}
    		else if (type === "checkbox" || type === "radio") {
    			this.checked = false
    		}
    		else if (tag === "select") {
    			this.selectedIndex = -1
    		}
    	})
    }

    function stringfromByteLen(str, maxByte) {

    	for (b=i=0; c=str.charCodeAt(i);) {
    		b+=c>>7?2:1;

    		if(b > maxByte)
    			break;

    		i++;
    	}

    	return str.substring(0,i);
    }



});