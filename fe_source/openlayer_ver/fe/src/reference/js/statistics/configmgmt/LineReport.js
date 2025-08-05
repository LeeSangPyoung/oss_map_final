/**
 * LineReport.js
 *
 * @author P123512
 * @date 2017.12.22
 * @version 1.0
 */
var svlnLclList = [];
var svlnSclList = [];
var whole = cflineCommMsgArray['all'] /* 전체 */;
var commBizrSkt = [];
var commBizrSkb = [];
var skTb2bSvlnSclCdData = [];
var skBb2bSvlnSclCdData = [];
var mgmtGrpCd = null;

var bonbuId = null;
var teamId = null;
var mtsoId = null;

var commBizrCd = null;
var commBizrNm = null;


var showBonbu = null;
var showTeam = null;
var showMtso = null;
$a.page(function() {
	var orgId  = null;
	var teamId = null;
	var tmof   = null;
	var orgNm  = null;
	var teamNm = null;
	var tmofNm   = null;
	var gridId = 'dataGrid';
	var C00188Data = [];  // 관리구분데이타   comCd:comCdNm
	var dualMtsoFlag = null;
	var uprMtsoFlag = null;
	var lowMtsoFlag = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
 		
 		tomfHeaderYn = "Y";
		
 		createGrid('', '');
    	setSelectCode();
        setEventListener();
    };
    
    //그리드생성
	function createGrid(sType, headerVal) {
    	var columnMapping = [
    	                  {key : 'SVLN_LCL_NM',			align:'center',			width:'150px',		title : cflineMsgArray['serviceLineLcl']		,excludeFitWidth: true,		rowspan: true							/* 서비스회선 대분류 */}
    	                , {key : 'SVLN_SCL_NM',			align:'center',			width:'150px',		title : cflineMsgArray['serviceLineScl']		,excludeFitWidth: true,		rowspan: true						/* 서비스회선 소분류*/}
    	                , {key : 'COMM_BIZR_NM',		align:'left',			width:'150px',		title : cflineMsgArray['orderingOrganization'] 	,excludeFitWidth: true,		rowspan: true							/* 사업자 */}
    	       			, {key : 'SVLN_TYP_NM',			align:'left',			width:'150px',		title : cflineMsgArray['service'] 									/* 서비스 */	}
    	       			, {key : 'CNT_TOTAL',			align:'right',			width:'110px',		title : cflineMsgArray['summarization'] ,inlineStyle : { cursor: 'pointer' ,  color: 'blue' } ,render : {type: 'string', rule : 'comma'} 	/* 합계 */ }
    	       			, {key : 'CNT_TOTAL_P',			align:'left',			width:'150px',		title : cflineMsgArray['possessionRate']+"(%)" 							/* 점유율 */	}
    	       			, {key : 'transmissionOffice',	align:'left',			width:'150px',		title : cflineMsgArray['transmissionOffice']						/* 전송실 */	}
    	       		]
		
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: false,
		    cellSelectable : true,
		    rowInlineEdit : false,
		    numberingColumnFromZero : false,
		    height: 450,
			headerGroup : [
	               			{ fromIndex: 'transmissionOffice', toIndex: 'transmissionOffice', title: cflineMsgArray['headOffice']		 /* 본부 */ }
	        ],
		    message : {
		      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
		       	filterNodata: 'No data'
		    },
		    columnMapping: columnMapping
		});
			
		
		if(sType == "bonbu") {
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: null , hideSortingHandle: true, disableHeaderClickSorting: true});
			/**
			 *  본부
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				autoResize: false,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnBonbu
	            ,grouping : {
	            	by : ['SVLN_LCL_NM','SVLN_SCL_NM','COMM_BIZR_NM'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
			    
			});
		} else if (sType == "team") {
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal, hideSortingHandle: true, disableHeaderClickSorting: true});
			/**
			 * 팀
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				autoResize: false,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnTeam
	            ,grouping : {
	            	by : ['SVLN_LCL_NM','SVLN_SCL_NM','COMM_BIZR_NM'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
			});
		}else if(sType == "mtso"){
			$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerVal, hideSortingHandle: true, disableHeaderClickSorting: true});
			/**
			 *  전송실
			 */
			$('#' + gridId).alopexGrid({
				autoColumnIndex: true,
				fitTableWidth: true,
				disableTextSelection: true,
			    cellSelectable : true,
			    rowInlineEdit : false,
			    numberingColumnFromZero : false,
			    height: 450,
			    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    },
			    columnMapping: columnMtso
	            ,grouping : {
	            	by : ['SVLN_LCL_NM','SVLN_SCL_NM','COMM_BIZR_NM'],
	            	useGrouping : true,
	            	useGroupRowspan : true,
	            }
			});
		}

	}
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	createMgmtGrpSelectBox ("mgmtGrpNm", "N", "SKT");
    	setSearchCode("orgId", "teamId", "tmof");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linereport/getcommbizrlist', null, 'GET', 'getCommBizrList');
    }

    function setEventListener() {
    	// 관리그룹 선택시
	 	$('#mgmtGrpNm').on('change',function(e){
	 		changeMgmtGrp("mgmtGrpNm", "orgId", "teamId", "tmof", "tmof");
	 		setComboLclScl($('#mgmtGrpNm option:selected').text(), null);
	   		if($('#mgmtGrpNm').val() == '0001') {
	   			$('#commBizrCd').setData({data : commBizrSkt});
	   		} else if($('#mgmtGrpNm').val() == '0002'){
	   			$('#commBizrCd').setData({data : commBizrSkb});
	   		}
	   		
	   		
	   		
	   	});  
   		// 본부 선택시
    	$('#orgId').on('change',function(e){
    		changeHdofc("orgId", "teamId", "tmof", "tmof");
      	});    	 
  		// 팀 선택시
    	$('#teamId').on('change',function(e){
    		changeTeam("teamId", "tmof", "tmof");
      	});
    	
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 cflineShowProgressBody();
 			 bonbuId = $('#orgId').val();
			 teamId = $('#teamId').val();
			 mtsoId = $('#tmof').val();
			 
			 commBizrCd = $('#commBizrCd').val();
			 commBizrNm = $('#commBizrCd').getTexts()[0];
			 
		     showBonbu = $("input:radio[id='showBonbu']").is(":checked");
			 showTeam = $("input:radio[id='showTeam']").is(":checked");
			 showMtso = $("input:radio[id='showMtso']").is(":checked");
    		 mgmtGrpCd = $("#mgmtGrpNm").val();
    		 
    		 if($("input:radio[id='dualMtso']").is(":checked")){
    			 dualMtsoFlag = "Y";
    			 uprMtsoFlag = "Y";
    			 lowMtsoFlag = "Y";
    		 }else if($("input:radio[id='uprMtso']").is(":checked")){
    			dualMtsoFlag = "N";
 				uprMtsoFlag = "Y";
 				lowMtsoFlag = "N";
		 	 }else if($("input:radio[id='lowMtso']").is(":checked")){
		 		dualMtsoFlag = "N";
 				uprMtsoFlag = "N";
 				lowMtsoFlag = "Y";
          	 }
    		 
    		 var dataParam =  $("#searchForm").getData();
         	 dataParam.showBonbu = $("input:radio[id='showBonbu']").is(":checked");
         	 dataParam.showTeam = $("input:radio[id='showTeam']").is(":checked");
         	 dataParam.showMtso = $("input:radio[id='showMtso']").is(":checked");
         	 dataParam.dualMtsoFlag = dualMtsoFlag;
         	 dataParam.uprMtsoFlag = uprMtsoFlag;
         	 dataParam.lowMtsoFlag = lowMtsoFlag;
         	 /*console.log(dataParam);*/
    		 httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/linereport/getlinereportlist', dataParam, 'GET', 'getLineReportList');
         });

    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
         
 		//상세팝업
 		$('#' + gridId).on('click', '.bodycell', function(e) {
 			linePop(e);
 		});
 		
    	// 서비스회선 대분류 선택 
    	$('#svlnLclCd').on('change', function(e){
    		setComboScl($('#mgmtGrpNm option:selected').text(),$('#svlnLclCd').val());
      	});        	 

     	
	};
	
	//팝업
	function linePop(e) {
		var dataObj = AlopexGrid.parseEvent(e).data;
		var dataKey = dataObj._key;
		var eventCellVal = parseInt(AlopexGrid.currentValue(dataObj,  dataKey));
		if(dataKey != "SVLN_LCL_NM" && dataKey != "COMM_BIZR_NM" && dataKey != "SVLN_TYP_NM" && dataKey != "CNT_TOTAL_P" && eventCellVal >= 1 ) {
			detailPop(dataObj);
		}
	}
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'C00188Data') {
			// 관리그룹
			C00188Data = response;
		}
		if(flag == 'getLineReportList'){
			$('#btnExportExcel').setEnabled(true);	
			cflineHideProgressBody();
			renderGrid(response.list.headerList, response.list.keyList);
			$('#'+gridId).alopexGrid('dataSet', response.list.getLineReportList );
		}
		//통신사업자 셋팅 
		if(flag == 'getCommBizrList') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			commBizrSkt.push({"uprComCd":"","value":"","text":whole});
			commBizrSkb.push({"uprComCd":"","value":"","text":whole});
			var commBizrList = response.getCommBizrList;
			
			for(var index = 0 ; index < commBizrList.length ; index++) { 
				if(commBizrList[index].uprComCd == '0001' ) {
					commBizrSkt.push(commBizrList[index]);
				} else if(commBizrList[index].uprComCd == '0002') {
					commBizrSkb.push(commBizrList[index]);
				} else {
					commBizrSkt.push(commBizrList[index]);
					commBizrSkb.push(commBizrList[index]);
				}
			}
			$('#commBizrCd').setData({data : commBizrSkt});
		}
		if(flag == 'svlnLclSclCodeData') {
			var tmpMgmtCd = $('#mgmtGrpNm').val();
			var tmpMgmtCdNm = $('#mgmtGrpNm option:selected').text();
			
			svlnLclList = response.svlnLclCdList;
			svlnSclList = response.svlnSclCdList;

			setComboLclScl();
			
		}	
	}
	
	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getLineReportList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
    function setComboLclScl(mgmtGrpNm, lclCd) {
		var setLclCombo = [];
		for(var i = 0; i < svlnLclList.length; i++ ) {
			if(i == 0 ) {
				setLclCombo.push({"uprComCd":"","value":"","text":cflineCommMsgArray['all']});
			}
			if(mgmtGrpNm == 'SKB') {
				if(svlnLclList[i].cdFltrgVal == 'SKB' || svlnLclList[i].cdFltrgVal == 'ALL' ) {
					setLclCombo.push(svlnLclList[i]);
				}
			} else {
				if(svlnLclList[i].cdFltrgVal == 'SKT' || svlnLclList[i].cdFltrgVal == 'ALL' ) {
					setLclCombo.push(svlnLclList[i]);
				}	
			}
		}
		$('#svlnLclCd').clear();
		$('#svlnLclCd').setData({data : setLclCombo});

		
		var setSclCombo = [];
		for(var i = 0 ; i < svlnSclList.length; i++ ) {
			if(i == 0 ) {
				setSclCombo.push({"uprComCd":"","value":"","text":cflineCommMsgArray['all']});
			}
			if(mgmtGrpNm == 'SKB') {
				if(svlnSclList[i].cdFltrgVal == 'SKB' || svlnSclList[i].cdFltrgVal == 'ALL' ) {
					setSclCombo.push(svlnSclList[i]);
				}
			} else {
				if(svlnSclList[i].cdFltrgVal == 'SKT' || svlnSclList[i].cdFltrgVal == 'ALL' ) {
					setSclCombo.push(svlnSclList[i]);
				}
			}
		}
		$('#svlnSclCd').clear();
		$('#svlnSclCd').setData({data : setSclCombo});
	}
    
    function setComboScl(mgmtGrpNm , lclCd) {
    	var setSclCombo = [];
    	for(var i = 0 ; i < svlnSclList.length; i++  ) {
    		if(i == 0 ) {
				setSclCombo.push({"uprComCd":"","value":"","text":cflineCommMsgArray['all']});
			}
    		if(nullToEmpty(lclCd) == "" ) {
    			if(mgmtGrpNm == 'SKB') {
    				if(svlnSclList[i].cdFltrgVal == 'SKB' || svlnSclList[i].cdFltrgVal == 'ALL' ) {
    					setSclCombo.push(svlnSclList[i]);
    				}
    			} else {
    				if(svlnSclList[i].cdFltrgVal == 'SKT' || svlnSclList[i].cdFltrgVal == 'ALL' ) {
    					setSclCombo.push(svlnSclList[i]);
    				}
    			}
    		} else {
	    		if(svlnSclList[i].uprComCd == lclCd && (mgmtGrpNm == svlnSclList[i].cdFltrgVal || "ALL" == svlnSclList[i].cdFltrgVal   )) {
	    			setSclCombo.push(svlnSclList[i]);
	    		}
    		}
    	}
    	$('#svlnSclCd').clear();
		$('#svlnSclCd').setData({data : setSclCombo});
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
    
	//그리드 랜더링
	function renderGrid(addHeader, addColumn) {
		var headerDiv = addHeader;
		var columnDiv = "";

		//칼럼 구성
		if(addColumn != null) {
			//본부 조회
			if($("input:radio[id='showBonbu']").is(":checked")) {
				columnBonbu = columnMapping("bonbu");
				
				if(addColumn != null) {
					$.each(addColumn, function(key, val) {
						$.extend(val, {"inlineStyle" : { cursor: function(value) { if(value != 0) return 'pointer' },  color: function(value) { if(value != 0) return 'blue'; }}})
						$.extend(val, {"render"      : {type: 'string', rule : 'comma'}  });
						columnBonbu.push(val);
					})
				}
				columnDiv = "bonbu";
			}
			//팀 조회
			else if($("input:radio[id='showTeam']").is(":checked")) {
				columnTeam = columnMapping("team");
				
				if(addColumn !=  null) {
					$.each(addColumn, function(key, val) {
						$.extend(val, {"inlineStyle" : { cursor: function(value) { if(value != 0) return 'pointer' },  color: function(value) { if(value != 0) return 'blue'; }}})
						$.extend(val, {"render"      : {type: 'string', rule : 'comma'}  });
						columnTeam.push(val);
					})
				}
				columnDiv = "team";
			}
			//전송실 조회
			else if($("input:radio[id='showMtso']").is(":checked")) {
				columnMtso = columnMapping("mtso");
				
				if(addColumn != null) {
					$.each(addColumn, function(key, val) {
						$.extend(val, {"inlineStyle" : { cursor: function(value) { if(value != 0) return 'pointer' },  color: function(value) { if(value != 0) return 'blue'; }}})
						$.extend(val, {"render"      : {type: 'string', rule : 'comma'}  });
						columnMtso.push(val);
					})
				}
				columnDiv = "mtso";
			} else {
				headerDiv = "";
				columnDiv = "";
			}
		}
	
		createGrid(columnDiv, headerDiv);
	}
	
	//컬럼 구성
	function columnMapping(sType) {		
		var mapping = [
 	                  {key : 'SVLN_LCL_NM',			align:'center',			width:'150px',		title : cflineMsgArray['serviceLineLcl']		,excludeFitWidth: true,		rowspan: true							/* 서비스회선 대분류 */}
 	                , {key : 'SVLN_SCL_NM',			align:'center',			width:'150px',		title : cflineMsgArray['serviceLineScl']		,excludeFitWidth: true,		rowspan: true						/* 서비스회선 소분류*/}
  	                , {key : 'COMM_BIZR_NM',		align:'center',			width:'150px',		title : cflineMsgArray['orderingOrganization'] ,excludeFitWidth: true,		rowspan: true						/* 사업자 */}
  	       			, {key : 'SVLN_TYP_NM',			align:'center',			width:'150px',		title : cflineMsgArray['service'] 									/* 서비스 */	}
  	       			, {key : 'CNT_TOTAL',			align:'right',			width:'110px',		title : cflineMsgArray['summarization'] ,inlineStyle : { cursor: 'pointer' ,  color: 'blue' },render : {type: 'string', rule : 'comma'} /* 합계 */ }
  	       			, {key : 'CNT_TOTAL_P',			align:'right',			width:'110px',		title : cflineMsgArray['possessionRate']+"(%)" 						/* 점유율 */	}
  	       		]

		
		return mapping;
	}
    
    
    //상세팝업
    function detailPop(rowData){
    	if(nullToEmpty(commBizrCd) == "" ) {
	    	var gridData = {
					 "commBizrCd"  : rowData.COMM_BIZR_ID
					, "commBizrNm"  : rowData.COMM_BIZR_NM
	    	};
    	} else {
    		var gridData = {
					 "commBizrCd"  : commBizrCd
					, "commBizrNm"  : commBizrNm
    		};
    	}
    	
		$.extend(gridData, {
			"svlnLclCd"  : rowData.SVLN_LCL_CD
			,"svlnLclNm"  : rowData.SVLN_LCL_NM
			,"svlnSclCd"  : rowData.SVLN_SCL_CD
			,"svlnSclNm"  : rowData.SVLN_SCL_NM
			, "svlnTypCd"  : rowData.SVLN_TYP_CD
			, "svlnTypNm"  : rowData.SVLN_TYP_NM
			, "key"     : rowData._key
			, "mgmtGrpCd" : mgmtGrpCd
			, "bonbuId"     : bonbuId
			, "teamId"     : teamId
			, "mtsoId"     : mtsoId
			, "showBonbu"  : showBonbu
			, "showTeam"    : showTeam
			, "showMtso"    : showMtso
			, "dualMtsoFlag" :dualMtsoFlag
			, "uprMtsoFlag" : uprMtsoFlag
			, "lowMtsoFlag" : lowMtsoFlag
		})
    	
		 $a.popup({
 			popid: "LineReportDetailPop",
 			title: "회선현황상세",
 			url: $('#ctx').val()+'/statistics/configmgmt/LineReportDetailPop.do',
 			data : gridData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1200,
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
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : '회선총괄현황_'+date,
     		sheetList: [{
     			sheetName: '회선총괄현황',
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

    
});