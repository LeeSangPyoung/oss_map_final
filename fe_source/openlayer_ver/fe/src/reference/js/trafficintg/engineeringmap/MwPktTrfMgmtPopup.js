
let gridId = "pktTrfGrid";
let perPage = 100;


let main = $a.page(function() {

	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	sessionStorage.setItem('param', JSON.stringify(param));

    	setClctDt();

    	MwPktTrf.initGrid();

    	setEventListner();
    }

    function setEventListner() {
    	let dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    	// 페이지 번호 클릭시
		$('#'+gridId).on('pageSet', function(e){
			let eObj = AlopexGrid.parseEvent(e);
			MwPktTrf.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#'+gridId).on('perPageChange', function(e){
			let eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			MwPktTrf.setGrid(1, eObj.perPage);
		});

    	// 조회
   	 	$('#btnSearch').on('click', function(e) {
   	 		MwPktTrf.setGrid(1, perPage);
        });

   	 	// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13  ){
				MwPktTrf.setGrid(1, perPage);
			}
		});

		// 날짜 입력 값 잘못 변경할 경우
		$('#searchBaseDt').on('change', function(e) {
			if ($('#searchBaseDt').val() == "" || !$('#searchBaseDt').val().match(dateRegex)){
				setClctDt();
			}
		});

		// excel download
    	$('#btnTesExportExcel').on('click', function(e) {
    		var gridData = $('#'+gridId).alopexGrid('dataGet');
			if (gridData.length == 0) {
				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
			}

			var param =  $("#searchForm").getData();

			param = MwPktTrf.gridExcelColumn(param, gridId);
			param.pageNo = 1;
			param.rowPerPage = 60;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;
			param.inUserId = $('#sessionUserId').val();

			var now = new Date();
			var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
			var excelFileNm = 'MW선번트래픽_'+dayTime;
			param.fileName = excelFileNm;
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.excelMethod = "getTesMwPktTrfList";
			param.excelFlag = "TesMwPktTrfList";
			//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
			fileOnDemendName = excelFileNm+".xlsx";

			$('#'+gridId).alopexGrid('showProgress');
			MwPktTrf.httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
    	});

    }

    function setClctDt() {
    	var clctDtDay = getDay(-1);
   		var clctDtMon = getMonth(-1);
   		var clctDtYear = getYear(-1);

   		var prevClctDtMon = getMonth(-1,-1);

   		$('#searchBaseDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }

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
});

let MwPktTrf = {
		// 링 정보 그리드
		initGrid: function() {
	    	//그리드 생성
			let titleList = [
				"NO",
				"M/W선번ID",
				"선번명",
				"지역",
				"상위국",
				"하위국",
				"링명",
				"포트속도",
				"전월트래픽(M bps)",
				"기준트래픽(M bps)",
				"백홀장비S",
				"백홀포트S",
				"백홀장비E",
				"백홀포트E",
				"E2E용량(M bps)",
				"E2E사용률(%)",
				"ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"M/W구간ID",
				"M/W구간",
				"채널",
				"용량(M bps)",
				"전월(%)",
				"사용량(%)",
				"링no",
				"백홀포트S명",
				"백홀포트E명"
				];

			let cnt = 0;

			//그리드 생성
			$('#'+gridId).alopexGrid({
				renderMapping : {
					"orangeColor" : {
						renderer : function(value, data, render, mapping) {
							if(value == undefined) value = "";

							if(value >= 50) {
								return '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: orange; color: black; ">'+ value+'</div>';
							}
						}
					}
				},
				paging : {
					pagerSelect: [100,300,500,1000,5000],
					hidePageList: false  // pager 중앙 삭제
				},
				height: '10row',
				fitTableWidth : true,
				autoResize: true,
				cellInlineEdit : true,
				cellInlineEditOption : {startEvent:'click'},
				cellSelectable : true,
				rowSingleSelect : false,
				rowClickSelect: false,
				rowInlineEdit: true,
				numberingColumnFromZero: false,
				enableEdit: true,
				defaultColmunMapping: true,
				headerGroup: [
		  			{fromIndex:0,   toIndex:6,   title:'선번정보'},
		  			{fromIndex:7,   toIndex:13,  title:'백홀정보'},
		  			{fromIndex:14,  toIndex:16,  title:'통계'},
		  			{fromIndex:17,  toIndex:22,  title:'구간1'},
		  			{fromIndex:23,  toIndex:28,  title:'구간2'},
		  			{fromIndex:29,  toIndex:34,  title:'구간3'},
		  			{fromIndex:35,  toIndex:40,  title:'구간4'},
		  			{fromIndex:41,  toIndex:46,  title:'구간5'},
		  			{fromIndex:47,  toIndex:52,  title:'구간6'},
		  			{fromIndex:53,  toIndex:58,  title:'구간7'},
		  			{fromIndex:59,  toIndex:64,  title:'구간8'},
		  			{fromIndex:65,  toIndex:70,  title:'구간9'},
		  			{fromIndex:71,  toIndex:76,  title:'구간10'},
		  			{fromIndex:77,  toIndex:82,  title:'구간11'},
		  			{fromIndex:83,  toIndex:88,  title:'구간12'},
		  			{fromIndex:89,  toIndex:94,  title:'구간13'},
		  			{fromIndex:95,  toIndex:100, title:'구간14'},
		  			{fromIndex:101, toIndex:106, title:'구간15'},
		  			{fromIndex:107, toIndex:112, title:'구간16'},
		  			{fromIndex:113, toIndex:118, title:'구간17'},
		  			{fromIndex:119, toIndex:124, title:'구간18'},
		  			{fromIndex:125, toIndex:130, title:'구간19'},
		  			{fromIndex:131, toIndex:136, title:'구간20'}
				],
				columnMapping: [
					{align:'center',title : titleList[cnt++],width: '40',numberingColumn: true},
					{key : 'mwLnoId', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwLnoNm', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'areaNm', align : 'center', title : titleList[cnt++],width : '100', editable: false},
					{key : 'umtsoNm', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'lmtsoNm', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'ntwkLineNm',align : 'center',title : titleList[cnt++],width : '100',editable: false},
					{key : 'portSpeed', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'preTrpk', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'stdTrpk', align : 'center',title : titleList[cnt++],width : '100', editable: false},

					{key : 'bkhlStaEqpNm', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'bkhlStaPortNm', align : 'center', title : titleList[cnt++], width : '120', editable : false},
					{key : 'bkhlEndEqpNm', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'bkhlEndPortNm', align : 'center', title : titleList[cnt++], width : '120', editable : false},

					{key : 'e2eCapaVal', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'e2eUsage', align : 'center',title : titleList[cnt++],width : '100', editable: false, render: {type:'orangeColor'}},

					{key : 'mwSctnId1', hidden:true, align : 'left',title : titleList[cnt++],width : '30', editable: false},
					{key : 'mwSctnNm1', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'mwChnlNoVal1', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal1', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage1', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage1', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId2', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm2', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal2', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal2', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage2', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage2', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId3', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm3', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal3', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal3', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage3', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage3', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId4', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm4', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal4', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal4', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage4', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage4', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId5', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm5', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal5', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal5', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage5', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage5', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId6', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm6', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal6', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal6', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage6', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage6', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId7', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm7', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal7', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal7', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage7', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage7', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId8', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm8', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal8', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal8', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage8', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage8', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId9', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm9', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal9', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal9', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage9', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage9', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId10', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm10', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal10', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal10', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage10', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage10', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},

					{key : 'mwSctnId11', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm11', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal11', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal11', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage11', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage11', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId12', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm12', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal12', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal12', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage12', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage12', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId13', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm13', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal13', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal13', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage13', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage13', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId14', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm14', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal14', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal14', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage14', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage14', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId15', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm15', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal15', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal15', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage15', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage15', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId16', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm16', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal16', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal16', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage16', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage16', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId17', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm17', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal17', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal17', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage17', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage17', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId18', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm18', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal18', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal18', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage18', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage18', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId19', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm19', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal19', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal19', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage19', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage19', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'mwSctnId20', hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'mwSctnNm20', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'mwChnlNoVal20', align : 'center',title : titleList[cnt++],width : '100', editable: false},
					{key : 'chnlCapaVal20', align : 'center',title : titleList[cnt++],width : '100', editable: false },
					{key : 'preUsage20', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'stdUsage20', align : 'center',title : titleList[cnt++],width : '100', editable: false , render: {type:'orangeColor'}},
					{key : 'ntwkLineNo',    hidden:true, align : 'center',title : titleList[cnt++],width : '100'},
					{key : 'bkhlStaPortId', hidden:true, align : 'center',title : titleList[cnt++],width : '100', editable: true},
					{key : 'bkhlEndPortId', hidden:true, align : 'center',title : titleList[cnt++],width : '100', editable: true},
					{key : 'flag', hidden:true, align : 'center',title : titleList[cnt++],width : '100'}
				],
				message : {
					nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
				}
			});

		},

		// 링 정보 그리드
		setGrid : function(page, rowPerPage) {
			let sparam = JSON.parse(sessionStorage.getItem('param'));

			$('#pageNo').val(page);
			$('#rowPerPage').val(rowPerPage);

			$('#' + gridId).alopexGrid('dataEmpty');
			$('#' + gridId).alopexGrid('showProgress');

			let param =  $("#searchForm").serialize();

			Util.jsonAjax({
				url: '/transmisson/tes/engineeringmap/mwlno/getMwLnoPktTrfList',
				data:param,
				method:'GET',
				async:true
				}).done(
				function(response) {
					let serverPageinfo = {};
		    		serverPageinfo = {
		    				dataLength  : response.pager.totalCnt, 	//총 데이터 길이
		    				current 	: response.pager.pageNo, 	//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
		    				perPage 	: response.pager.rowPerPage //한 페이지에 보일 데이터 갯수
		    		};

		    		$('#'+gridId).alopexGrid('hideProgress');
		    		$('#'+gridId).alopexGrid('dataSet', response.trflist, serverPageinfo);

				}.bind(this)
			);
		},

		gridExcelColumn : function(param, gridId) {
			var gridHeaderGroup = [
				{fromIndex:0,   toIndex:5,   title:'선번정보'},
	  			{fromIndex:6,   toIndex:12,  title:'백홀정보'},
	  			{fromIndex:13,  toIndex:14,  title:'통계'},
	  			{fromIndex:15,  toIndex:19,  title:'구간1'},
	  			{fromIndex:20,  toIndex:24,  title:'구간2'},
	  			{fromIndex:25,  toIndex:29,  title:'구간3'},
	  			{fromIndex:30,  toIndex:34,  title:'구간4'},
	  			{fromIndex:35,  toIndex:39,  title:'구간5'},
	  			{fromIndex:40,  toIndex:44,  title:'구간6'},
	  			{fromIndex:45,  toIndex:49,  title:'구간7'},
	  			{fromIndex:50,  toIndex:54,  title:'구간8'},
	  			{fromIndex:55,  toIndex:59,  title:'구간9'},
	  			{fromIndex:60,  toIndex:64,  title:'구간10'},
	  			{fromIndex:65,  toIndex:69,  title:'구간11'},
	  			{fromIndex:70,  toIndex:74,  title:'구간12'},
	  			{fromIndex:75,  toIndex:79,  title:'구간13'},
	  			{fromIndex:80,  toIndex:84,  title:'구간14'},
	  			{fromIndex:85,  toIndex:89,  title:'구간15'},
	  			{fromIndex:90,  toIndex:94,  title:'구간16'},
	  			{fromIndex:95,  toIndex:99,  title:'구간17'},
	  			{fromIndex:100, toIndex:104, title:'구간18'},
	  			{fromIndex:105, toIndex:109, title:'구간19'},
	  			{fromIndex:110, toIndex:114, title:'구간20'}
			]

			var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
			var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
			var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
			var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

			for(var i=gridHeaderGroup.length-1; i>=0; i--) {
				if (gridHeaderGroup[i].title != undefined) {
					excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex;/*순번칼럼다운 제외되니까*/
					excelHeaderGroupFromIndex += ";";
					excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex;/*순번칼럼다운 제외되니까*/
					excelHeaderGroupToIndex += ";";
					excelHeaderGroupTitle += gridHeaderGroup[i].title;
					excelHeaderGroupTitle += ";";
					excelHeaderGroupColor += gridHeaderGroup[i].color;
					excelHeaderGroupColor += ";";
				}
			};

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

			return param;
		},

		/*-----------------------------*
		 *  성공처리
		 *-----------------------------*/
		successCallback : function(response, status, jqxhr, flag){
			//ON-DEMANT엑셀다운로드
			if(flag == "excelDownloadOnDemand"){
				$('#'+gridId).alopexGrid('hideProgress');
		        var jobInstanceId = response.resultData.jobInstanceId;
		        MwPktTrf.onDemandExcelCreatePop ( jobInstanceId );
		    }
		},

		/*-----------------------------*
	     *  실패처리
	     *-----------------------------*/
	    failCallback : function(response, status, jqxhr, flag){
	    	if(flag == 'search'){
				//조회 실패 하였습니다.
				callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
			}
	    },

	    onDemandExcelCreatePop : function( jobInstanceId ){
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
		},

		/*-----------------------------*
		 *  HTTP
		 *-----------------------------*/
		httpRequest : function(Url, Param, Method, Flag ) {
			Tango.ajax({
				url : Url, //URL 기존 처럼 사용하시면 됩니다.
				data : Param, //data가 존재할 경우 주입
				method : Method, //HTTP Method
				flag : Flag
			}).done(MwPktTrf.successCallback)
			  .fail(MwPktTrf.failCallback);
		}
}