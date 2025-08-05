/**
 * PacketLineRegistRateIp.js
 *
 * @author P095783
 * @date 2018.05.29
 * @version 1.0
 */
var whole = cflineCommMsgArray['all'] /* 전체 */;
var tBonbuList_data = [];
var tTeamList_data = [];
var tMtsoList_data = [];
var gridId = 'dataGrid';

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
 		setSelectCode();
        setEventListener();
        getGrid();
    };
});
    
// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
function setSelectCode() {
	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getsktbonbu', null, 'GET', 'getSKTBonBu');
	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getsktteam', null, 'GET', 'getSKTTeam');
	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/dcssamereport/getsktmtso', null, 'GET', 'getSKTMtso');
}

function setEventListener() {
	
	//본부 선택시
	$('#bonbuId').on('change',function(e){
		clickBonbu();
  	});
	
	// 팀 선택시
	$('#teamId').on('change',function(e){
		clickTeam();
  	});
	
	//조회 
	 $('#btnSearch').on('click', function(e) {
		 $('#btnExportExcel').setEnabled(false);
		 searchProc();   
     });		
	 
	//엑셀다운로드
     $('#btnExportExcel').on('click', function(e) {
    	 excelDownload();
     });
     
     //상세팝업
		$('#' + gridId).on('click', '.bodycell', function(e) {
			var dataObj = AlopexGrid.parseEvent(e).data;
	    	 var dataKey = dataObj._key;
	    	 
	    	 if((dataKey == "unCountTrunk" || dataKey == "unCountRing") && dataObj.mtsoNm != "소계" && dataObj.bonbuNm != "합계" && dataObj.teamNm != "소계") {
	    		 detailPop(e);
	    	 }
		});

		//칼럼설명
		$('#columnExplain').on('click', function(e) {
			$a.popup({
				popid: "cloumnExplain",
				title: "칼럼설명",
				url: $('#ctx').val()+'/statistics/configmgmt/PacketColumnExplainPop.do',
				iframe: true,
		    	modal : true,
				movable:true,
				width : 710,
				height : 200,
				callback:function(data){
					if(data != null){
					}
					//다른 팝업에 영향을 주지않기 위해
					$.alopex.popup.result = null;
				}  
			});
		});
};

//Grid 초기화
function getGrid() {
	var columnMapping = [
	                     {key : 'bonbuNm',		align:  'center',		width:  '130px',			title : cflineMsgArray['headOffice'], rowspan : true,		sorting: true		/* 본부 */ }
	                     , {key : 'teamNm',			align : 'center', 		width : '130px', 			title : cflineMsgArray['team'], rowspan : true,		sorting: true	 /* 팀 */ }
	                     , {key : 'mtsoNm',		align : 'center',		width : '130px',			title : cflineMsgArray['transmissionOffice'],		sorting: true		 /* 전송실 */}
	                     , {key : 'cnt',			align : 'right',		width : '100px',			title : cflineMsgArray['lineCount'],	render: {type:"string", rule : "comma"},		sorting: true		 /* 회선수 */}
	                     , {key : 'countTrunk', 	align : 'right', 		width : '130px', 		title : "PTS" + cflineMsgArray['registerLineCnt'],	render: {type:"string", rule : "comma"} /* PTS등록회선수 */
	                     	,	sorting: true}
	                     , {key : 'unCountTrunk', 	align : 'right', 		width : '130px', 			title : "PTS" + cflineMsgArray['unRegisterLineCnt'],	render: {type:"string", rule : "comma"}			/* PTS미등록회선수 */
	                     	,	 inlineStyle: function(value, data) {
	                     				if(data.mtsoNm == "소계" || data.teamNm == "소계" || data.bonbuNm == "합계") { return {color: 'black'};} 
	                     				else { return {color: 'blue', cursor: 'pointer'};}
	                     	},		sorting: true}
	                     , {key : 'trunkRate', 		align : 'right',		width : '130px', 			title : "PTS" + cflineMsgArray['registrationRate'] /* PTS등록율 */
	                     	,		sorting: true}
	                     , {key : 'countRing', 		align : 'right', 		width : '130px', 			title : cflineMsgArray['ringRegisterLineCnt'],	render: {type:"string", rule : "comma"} /* 링등록회선수 */
	                     	,		sorting: true}
	                     , {key : 'unCountRing', 		align : 'right', 		width : '130px', 			title : cflineMsgArray['ringUnRegisterLineCnt'],	render: {type:"string", rule : "comma"}		/* 링미등록회선수 */
	                     ,	 inlineStyle: function(value, data) {
              				if(data.mtsoNm == "소계" || data.teamNm == "소계" || data.bonbuNm == "합계") { return {color: 'black'};} 
              				else { return {color: 'blue', cursor: 'pointer'};}
	                     },		sorting: true}
	                     , {key : 'ringRate', 		align : 'right', 		width : '130px', 			title : cflineMsgArray['ringRegistRate'] /* 링등록율 */
	                     	,		sorting: true}
	];
	
	$('#'+gridId).alopexGrid({
        autoColumnIndex : true,
		autoResize: true,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        rowClickSelect : true,
        rowSingleSelect : true,
        numberingColumnFromZero : false,
		defaultColumnMapping:{sorting: false},
		enableDefaultContextMenu:false,
		enableContextMenu:true,
		height : 540,
		message: {
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
		},
		columnMapping: columnMapping
    	,grouping : {
        	by : ['bonbuNm','teamNm'],
        	useGrouping : true,
        	useGroupRowspan : true,
        }
	}); 
} 


//본부 선택시
function clickBonbu() {
	
	var tTeamList =  [];
	var tMtsoList =  [];
	
	if(nullToEmpty($('#bonbuId').val()) == "") {
		$('#teamId').setData({data : tTeamList_data});
		$('#mtsoId').setData({data : tMtsoList_data});
	} else {
		for( i=0 ; i<tTeamList_data.length; i++) {
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tTeamList.push(dataFst);
			}
			if(tTeamList_data[i].uprOrgId == $('#bonbuId').val()){
				tTeamList.push(tTeamList_data[i]);	
			}
		}
		$('#teamId').setData({data : tTeamList});
		for( i=0 ; i<tMtsoList_data.length; i++) {
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList.push(dataFst);
			}
			if(tMtsoList_data[i].hdofcCd == $('#bonbuId').val()){
				tMtsoList.push(tMtsoList_data[i]);	
			}
		}
		$('#mtsoId').setData({data : tMtsoList});
	} 
}

//팀 선택시
function clickTeam() {
	var tMtsoList =  [];
	if(nullToEmpty($('#teamId').val()) == "") {
		if(nullToEmpty($('#bonbuId').val()) == "") {
			$('#mtsoId').setData({data : tMtsoList_data});
		} else {
			for( i=0 ; i<tMtsoList_data.length; i++) {
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tMtsoList.push(dataFst);
				}
				if(tMtsoList_data[i].hdofcCd == $('#bonbuId').val()){
					tMtsoList.push(tMtsoList_data[i]);	
				}
			}
			$('#mtsoId').setData({data : tMtsoList});
		}
	} else {
		for( i=0 ; i<tMtsoList_data.length; i++) {
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList.push(dataFst);
			}
			if(tMtsoList_data[i].teamCd == $('#teamId').val()){
				tMtsoList.push(tMtsoList_data[i]);	
			}
		}
		$('#mtsoId').setData({data : tMtsoList});
	}
}

//조회
function searchProc(){
	cflineShowProgressBody();
	
	var param = $("#searchForm").getData();
	httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/packetlineregistrateip/getPacketLineRegistRateIpList', param , 'GET', 'getPacketLineRegistRateIpList');
}

//상세
function detailPop(e) {
	var dataObj = AlopexGrid.parseEvent(e).data;
	var dataKey = dataObj._key;
	
	if(dataKey == "unCountTrunk") {
		var param = {
							"mtsoId" : dataObj.mtsoId
							, "unCountTrunk" : 1 
							, "dataKey" : dataKey
		}
		var popTitle = cflineMsgArray['ptsUnCntTrunkDetail']	/* PTS 미등록 회선 수 상세(IP) */
	} else {
		var param = {
							"mtsoId" : dataObj.mtsoId
							, "unCountRing" : 1
							, "dataKey" : dataKey
		}
		var popTitle = cflineMsgArray['ringUnCntDetail']	/* 링 미등록 회선 수 상세(IP)  */
	}
	
	$a.popup({
		popid: "PacketLineRegistRateIpDetailPop",
		title: popTitle,
		url: $('#ctx').val()+'/statistics/configmgmt/PacketLineRegistRateIpDetailPop.do',
		data: param,
		iframe: true,
    	modal : false,
    	windowpopup : true,
		movable:true,
		width : 1000,
		height : 650,
		callback:function(data){
			if(data != null){
			}
			//다른 팝업에 영향을 주지않기 위해
			$.alopex.popup.result = null;
		}  
	});
}

//엑셀다운로드
function excelDownload() {
	cflineShowProgressBody();
	var date = getCurrDate();
	var worker = new ExcelWorker({
 		excelFileName : '패킷회선등록율(IP)_'+date,
 		sheetList: [{
 			sheetName: '패킷회선등록율(IP)',
 			placement: 'vertical',
 			$grid: $('#'+gridId)
 		}]
 	});
	worker.export({
 		merge: true,
 		exportHidden: false,
 		useGridColumnWidth : true,
 		border : true,
 		useCSSParser : true
 	});
	cflineHideProgressBody();
}


//request 성공시.
function successCallback(response, status, jqxhr, flag){
	if(flag == 'getPacketLineRegistRateIpList'){
		cflineHideProgressBody();
		$('#'+gridId).alopexGrid("dataSet", response.result);
		if(response.result.length > 0) {
			$('#btnExportExcel').setEnabled(true);	
		}
	}
	
	// T본부 셋팅
	if(flag == 'getSKTBonBu') {
		var whole = cflineCommMsgArray['all'] /* 전체 */;
		tBonbuList_data =  [];
		for(i=0; i<response.bonbulist.length; i++){
			var dataL = response.bonbulist[i]; 
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tBonbuList_data.push(dataFst);
			}
			tBonbuList_data.push(dataL);
		}
		$('#bonbuId').clear();
		$('#bonbuId').setData({data : tBonbuList_data});
	}
	
	//T팀 셋팅
	if(flag == 'getSKTTeam') {
		var whole = cflineCommMsgArray['all'] /* 전체 */;
		tTeamList_data =  [];
		for(i=0; i<response.teamlist.length; i++){
			var dataL = response.teamlist[i]; 
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tTeamList_data.push(dataFst);
			}
			tTeamList_data.push(dataL);
		}
		$('#teamId').setData({data : tTeamList_data});

	}
	
	//T전송실 셋팅
	if(flag == 'getSKTMtso') {
		var whole = cflineCommMsgArray['all'] /* 전체 */;
		tMtsoList_data =  [];
		if(response.mtsolist.length == 0 ) {
			var dataFst = {"uprComCd":"","value":"","text":whole};
			tMtsoList_data.push(dataFst);
		}
		for(i=0; i<response.mtsolist.length; i++){
			var dataL = response.mtsolist[i]; 
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList_data.push(dataFst);
			}
			tMtsoList_data.push(dataL);
			
		}
		$('#mtsoId').setData({data : tMtsoList_data});
	}
}

//request 실패시.
function failCallback(response, status, flag){
	if(flag == 'getDcsSameReportList'){
		cflineHideProgressBody();
		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
	}
}

//httpRequest
var httpRequest = function(Url, Param, Method, Flag ) {
	Tango.ajax({
		url : Url, //URL 기존 처럼 사용하시면 됩니다.
		data : Param, //data가 존재할 경우 주입
		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
}
 

