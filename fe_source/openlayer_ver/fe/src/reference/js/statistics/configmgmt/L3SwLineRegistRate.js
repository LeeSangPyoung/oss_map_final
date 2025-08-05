/**
 * L3SwLineRegistRate.js
 *
 * @author P123512
 * @date 2018.06.01
 * @version 1.0
 */
var whole = cflineCommMsgArray['all'] /* 전체 */;
var tBonbuList_data = [];
var tTeamList_data = [];
var tMtsoList_data = [];
var gridId = 'dataGrid';

var mtsoId = null;
var teamId = null;
var bonbuId = null;
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
	$('#orgCd').on('change',function(e){
		clickBonbu();
  	});
	
	// 팀 선택시
	$('#teamCd').on('change',function(e){
		clickTeam();
  	});
	
	//조회 
	 $('#btnSearch').on('click', function(e) {
		 bonbuId = $('#orgCd').val();
		 teamId = $('#teamCd').val();
		 mtsoId = $('#topMtsoCd').val();
		 searchProc();   
     });		
	 
	//엑셀다운로드
     $('#btnExportExcel').on('click', function(e) {
    	 cflineShowProgressBody();
    	 excelDownload();
     });
     
	 //상세팝업
     $('#' + gridId).on('click', '.bodycell', function(e) {
		detailPop(e);
	 });
     
	 //컬럼설명 팝업 
     $('#btnColumnExplainPop').on('click', function(e) {
		columnExplainPop(e);
	 });
};

//Grid 초기화
function getGrid() {
	var columnMapping = [
	                       {key : 'bonbuNm',		align:  'center',		width:  '200px',			title : cflineMsgArray['headOffice'] ,excludeFitWidth: true,		rowspan: true	/* 본부 */ }
	                     , {key : 'teamNm',			align : 'center', 		width : '200px', 			title : cflineMsgArray['team']	,excludeFitWidth: true,		rowspan: true	 /* 팀 */}
	                     , {key : 'mtsoNm',			align : 'center',		width : '200px',			title : cflineMsgArray['transmissionOffice'] ,excludeFitWidth: true,		rowspan: true	/* 전송실 */}
	                     , {key : 'cnt',			align : 'right',		width : '200px',			title : cflineMsgArray['lineCount'] /* 회선수 */}
	                     , {key : 'cotCnt', 		align : 'right', 		width : '200px', 			title : "L3 S/W" + cflineMsgArray['registerLineCnt'] /* L3 SW 등록 회선수 */}
	                     , {key : 'unCotCnt', 		align : 'right', 		width : '200px', 			title : "L3 S/W" + cflineMsgArray['unRegisterLineCnt'] ,  /* L3 SW 미등록 회선수 */
	   						inlineStyle : function(value,data) {
	  							if(data.unCotCnt != "0"  && data.unCotCnt != undefined ) {
		  							return { cursor: 'pointer' ,  color: 'blue' };
	  							}
	  						}
	                     }
	                     , {key : 'cotRate', 		align : 'right',		width : '200px', 			title : "L3 S/W" + cflineMsgArray['registrationRate']+"(%)" /* L3 SW 등록율 */}
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
		height : 600,
		message: {
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
		},
		columnMapping: columnMapping
    	,grouping : {
        	by : ['bonbuNm','teamNm' ,'mtsoNm' ],
        	useGrouping : true,
        	useGroupRowspan : true,
        }
	}); 
} 


//본부 선택시
function clickBonbu() {
	
	var tTeamList =  [];
	var tMtsoList =  [];
	
	if(nullToEmpty($('#orgCd').val()) == "") {
		$('#teamCd').setData({data : tTeamList_data});
		$('#topMtsoCd').setData({data : tMtsoList_data});
	} else {
		for( i=0 ; i<tTeamList_data.length; i++) {
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tTeamList.push(dataFst);
			}
			if(tTeamList_data[i].uprOrgId == $('#orgCd').val()){
				tTeamList.push(tTeamList_data[i]);	
			}
		}
		$('#teamCd').setData({data : tTeamList});
		for( i=0 ; i<tMtsoList_data.length; i++) {
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList.push(dataFst);
			}
			if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
				tMtsoList.push(tMtsoList_data[i]);	
			}
		}
		$('#topMtsoCd').setData({data : tMtsoList});
	} 
}

//팀 선택시
function clickTeam() {
	var tMtsoList =  [];
	if(nullToEmpty($('#teamCd').val()) == "") {
		if(nullToEmpty($('#orgCd').val()) == "") {
			$('#topMtsoCd').setData({data : tMtsoList_data});
		} else {
			for( i=0 ; i<tMtsoList_data.length; i++) {
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":whole};
					tMtsoList.push(dataFst);
				}
				if(tMtsoList_data[i].hdofcCd == $('#orgCd').val()){
					tMtsoList.push(tMtsoList_data[i]);	
				}
			}
			$('#topMtsoCd').setData({data : tMtsoList});
		}
	} else {
		for( i=0 ; i<tMtsoList_data.length; i++) {
			if(i==0){
				var dataFst = {"uprComCd":"","value":"","text":whole};
				tMtsoList.push(dataFst);
			}
			if(tMtsoList_data[i].teamCd == $('#teamCd').val()){
				tMtsoList.push(tMtsoList_data[i]);	
			}
		}
		$('#topMtsoCd').setData({data : tMtsoList});
	}
}

//조회
function searchProc(){
	cflineShowProgressBody();
	$('#btnExportExcel').setEnabled(false);
	var dataParam =  $("#searchForm").getData();
	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/l3swlineregistrate/getl3swlineregistratelist', dataParam ,'GET','getL3SwLineRegistRateList');
}


//상세 팝업
function detailPop(e) {
	var dataObj = AlopexGrid.parseEvent(e).data;
	var dataKey = dataObj._key;
	
	var gridData = {
			"orgCd"  : dataObj.bonbuId
			,"teamCd"  : dataObj.teamId
			,"topMtsoCd"  : dataObj.mtsoId
	};
	if(nullToEmpty(mtsoId) != "") {
		$.extend(gridData, {
			"topMtsoCd"  : mtsoId
		})
	}
	if(nullToEmpty(teamId) != "") {
		$.extend(gridData, {
			"teamCd"  : teamId
		})
	}
	if(nullToEmpty(bonbuId) != "") {
		$.extend(gridData, {
			"orgCd"  : bonbuId
		})
	}
	var eventCellVal = parseInt(AlopexGrid.currentValue(dataObj,  dataKey));
	if(dataKey == "unCotCnt" && eventCellVal >= 1 ) {
		$a.popup({
			popid: "L3SwLineRegistRateDetailPop",
			title: "L3 SW "+cflineMsgArray['unRegisterLineCnt']+" "+cflineMsgArray['detail'],		/* L3 SW 미등록회선수 상세 */
			url: $('#ctx').val()+'/statistics/configmgmt/L3SwLineRegistRateDetailPop.do',
			data: gridData,
			iframe: true,
	    	modal : false,
	    	windowpopup : true,
			movable:true,
			width : 1200,
			height : 600,
			callback:function(data){
				if(data != null){
				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
			}  
		});
	}
}


//컬럼 설명 팝업
function columnExplainPop(e) {
	$a.popup({
		popid: "L3SwLineColumnExplainPop",
		title: "컬럼 설명",		
		url: $('#ctx').val()+'/statistics/configmgmt/L3SwLineColumnExplainPop.do',
		data: null,
		iframe: true,
    	modal : false,
		movable:true,
		width : 600,
		height : 200,
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
	var date = getCurrDate();
	var worker = new ExcelWorker({
 		excelFileName : 'L3 SW 회선'+cflineMsgArray['registrationRate']+'_'+date,
 		sheetList: [{
 			sheetName: "L3 SW 회선"+cflineMsgArray['registrationRate'],
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
	if(flag == 'getL3SwLineRegistRateList'){
		cflineHideProgressBody();
		$('#'+gridId).alopexGrid("dataSet", response.getL3SwLineRegistRateList);
		$('#btnExportExcel').setEnabled(true);	
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
		$('#orgCd').clear();
		$('#orgCd').setData({data : tBonbuList_data});
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
		$('#teamCd').setData({data : tTeamList_data});

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
		$('#topMtsoCd').setData({data : tMtsoList_data});
	}
}

//request 실패시.
function failCallback(response, status, flag){
	if(flag == 'getL3SwLineRegistRateList'){
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
 

