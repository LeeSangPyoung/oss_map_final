/**
 * RingMgmtDivPathListPop.js
 *
 * @author 
 * @date 2016. 10. 26. 오전 17:30:03
 * @version 1.0
 */
var gridResult = "pathDetail";
$a.page(function() {
    
    this.init = function(id, param) {
    	document.title = param.title;
    	$("#popHeadDiv").append("<h1>" + param.title + "</h1>");
    	$("#titleB").append("<span class='ico ico_title'></span><b>" + param.title + "</b>");
    	
    	initGrid(param.ringMgmtDivCd, param.mgmtGrpCd);
    	
    	// 엑셀 다운로드
    	$('#btnExportExcel').on('click', function(e){
    		var date = getCurrDate();
    		
    		var worker = new ExcelWorker({
         		excelFileName : param.title,
         		sheetList: [{
         			sheetName: param.title,
         			placement: 'vertical',
         			$grid: $('#'+gridResult)
         		}]
         	});
    		
    		worker.export({
         		merge: false,
         		exportHidden: false,
         		useGridColumnWidth : true,
         		border : true,
         		useCSSParser : true
         	});
    	});
    	
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', param, 'GET', 'searchPop');
    };
    
    //Grid 초기화
    function initGrid(ringMgmtDivCd, mgmtGrpCd) {
        //그리드 생성
        $('#'+gridResult).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
    		fitTableWidth: true,
    		hiddenColumnArea : false,
    		defaultColumnMapping:{
    			sorting: true
			},
			columnMapping: columnMapping(ringMgmtDivCd, mgmtGrpCd)
        }); 
    };

    function columnMapping(ringMgmtDivCd, mgmtGrpCd) {
    	var wdmTrunkCol = [
							{ key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
								return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
							}
							, { key : 'WDM_TRUNK_NM'
							    	, title : cflineMsgArray['wdmTrunkName']
									, align : 'left', width : '170px'
									, inlineStyle: {'white-space' : 'pre-line'}
									, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
							}
							, { key : 'WDM_TRUNK_ID', 				align : 'center', width : '10px', hidden : true}
    	                 ];
    	var mappingCol = [
				        { key : 'LEFT_ORG_NM', 				title : cflineMsgArray['westMtso'], align : 'center', width : '110px'} /* A 국사 */
				        , { key : 'LEFT_NODE_ROLE_NM', 			title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
				        , { key : 'LEFT_NE_NM', 				title : cflineMsgArray['westEqp'], align : 'left', width : '180px', inlineStyle: inlineStyleCss, tooltip : tooltipText  } /* A장 비 */
				        , { key : 'LEFT_PORT_DESCR', 			title : cflineMsgArray['westPort'], align : 'left', width : '120px', inlineStyle: inlineStyleCss, tooltip : tooltipText  } /* A 포트 inlineStyle: {color: 'red'} */
				        , { key : 'LEFT_CHANNEL_DESCR', 		title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
				        , { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '180px', inlineStyle: inlineStyleCss, tooltip : tooltipText } /* B 장비 */
				        , { key : 'RIGHT_PORT_DESCR', 			title : cflineMsgArray['eastPort'], align : 'left', width : '120px', inlineStyle: inlineStyleCss, tooltip : tooltipText  } /* B 포트 */
				        , { key : 'RIGHT_CHANNEL_DESCR', 		title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* B 채널 */
				        , { key : 'RIGHT_NODE_ROLE_NM', 		title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
				        , { key : 'RIGHT_ORG_NM', 				title : cflineMsgArray['eastMtso'], align : 'center', width : '110px' } /* B 국사 */
					];
    	
    	var mapping = [];
    	if(ringMgmtDivCd == '2') {
    		// 선로링 : GIS링이므로 WDM트렁크가 필요 없음
    		mapping = mappingCol;
    	} else if(ringMgmtDivCd == '3') {
    		// 장비링
    		if(mgmtGrpCd == "0001") {
    			// SKT링
    			mapping = mappingCol;
    		} else if(mgmtGrpCd == "0002") {
    			// SKB링
    			mapping = wdmTrunkCol.concat(mappingCol);
    		}
    	}
    	
    	return mapping;
    }
    
    function inlineStyleCss(value, data, mapping){	
    	var style = {
    			'text-decoration' : 'line-through',
    			'color' : 'red'
    	}; 
    	 
    	var deletecheck = checkDeleteNodeOrPort(data, mapping);
    	if(deletecheck) {
    		return style;
    	} else {
    		var style = {
    			'background-color' : '#BEBEBE'
    		};
    		
    		if(mapping.key == 'LEFT_NE_NM') {
    			if(data.LEFT_NE_DUMMY) return style;
    			else return '';
    		} else if(mapping.key == 'RIGHT_NE_NM') {
    			if(data.RIGHT_NE_DUMMY) return style;
    			else return '';
    		} else {
    			return '';
    		}
    	}
    }

    function tooltipText(value, data, mapping){
    	var str = "삭제된 장비 또는 포트입니다.";
    	var deletecheck = checkDeleteNodeOrPort(data, mapping);
    	if(deletecheck) {
    		return str;
    	} else {
    		return value;
    	}
    	return str;
    }

    function checkDeleteNodeOrPort(data, mapping) {
    	var deletecheck = false;
    	// WEST 장비
    	if(mapping.key == 'LEFT_NE_NM') {
    		if(data.LEFT_NE_STATUS_CD == '02' || data.LEFT_NE_STATUS_CD == '03') {
    			deletecheck = true;
    		} 
    	} else if(mapping.key == 'LEFT_PORT_DESCR' || mapping.key == 'LEFT_CHANNEL_DESCR') {
    		if(data.LEFT_PORT_STATUS_CD == '0003' || data.LEFT_PORT_STATUS_CD == '0004') {
    			deletecheck = true;
    		} 
    	}
    	
    	// EAST 장비
    	if(mapping.key == 'RIGHT_NE_NM') {
    		if(data.RIGHT_NE_STATUS_CD == '02' || data.RIGHT_NE_STATUS_CD == '03') {
    			deletecheck = true;
    		} 
    	} else if(mapping.key == 'RIGHT_PORT_DESCR' || mapping.key == 'RIGHT_CHANNEL_DESCR') {
    		if(data.RIGHT_PORT_STATUS_CD == '0003' || data.RIGHT_PORT_STATUS_CD == '0004') {
    			deletecheck = true;
    		} 
    	}
    	return deletecheck;
    }
    
    
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(response.data != undefined) {
    		$('#'+gridResult).alopexGrid('dataSet', response.data.LINKS);
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchPop'){
    		alertBox('W', cflineMsgArray['searchFail']);  /* 조회 실패 하였습니다. */
    	}
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