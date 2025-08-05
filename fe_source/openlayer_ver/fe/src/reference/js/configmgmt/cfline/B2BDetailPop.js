var dataParam = null;
var gridDivision = "serviceLine";
var svlnLclCd = "";
var svlnSclCd = "";
var id = "";

var gridId = "pathList";
var baseGridId = "pathBaseInfo";
var leftOrgNm = "LEFT_ORG_NM";
var rightOrgNm = "RIGHT_ORG_NM";
var ntwkLnoGrpSrno = null; 

$a.page(function() {
	var vDataParam  = null;
	this.init  = function(id, param) {
		//id = id;
		dataParam = param;
		vDataParam = {"svlnNo":param.ntwkLineNo};
		setPopEventListener();
		
		
		
		initGridNetworkPath(gridId);
    	initGridNetworkInfo();
    	
    	
		httpRequestB2b('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getServiceLineInfo', vDataParam, 'GET', 'getServiceLineInfo');
		$('#btnExportExcel').setEnabled(true);
		
    };
   
    
    function setPopEventListener() {
    	
    	// 엑셀 다운로드
    	$('#btnExportExcel').on('click', function(e){
    		var date = getCurrDate();
    		var fileName = 'B2B';
    		
    		var grid = [$('#'+baseGridId), $('#'+gridId)];
    		
    		var worker = new ExcelWorker({
         		excelFileName : fileName + '_선번 정보_' + date,
         		sheetList: [{
         			sheetName: fileName + '_선번 정보_' + date,
         			placement: 'vertical',
         			$grid: grid
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
    	
    	$('.arrow_more').click(function(){
			var $this = $(this);

			var $condition_box = $this.closest('.popup');
			var $more_condition = $condition_box.find('.path_hide');
			if($more_condition.css('display') == 'none'){
				$this.addClass('on')
				$more_condition.show();
			}else{
				$this.removeClass('on')
				$more_condition.hide();
			}

		});
    	
    	$('#'+gridId ).on('dblclick', '.bodycell', function(e){
    		event = e;
    		var dataObj = AlopexGrid.parseEvent(e);
     	 	var schVal = dataObj.data._state.editing[(dataObj.data._column)];
     	 	var division = (gridDivision == "wdm") ? "wdm" : "";
     	 	
     	 	if(dataObj.mapping.key == "TRUNK_NM") {
    			checkPop("trunk", schVal, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.TRUNK_PATH_DIRECTION, dataObj.data);
    		} else if(dataObj.mapping.key == "RING_NM") {
    			checkPop("ring", schVal, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.RING_PATH_DIRECTION, dataObj.data, dataObj.$grid.attr("id"));
    		}
    	});
    	
    	$('#close, #btnClose').on('click', function(e){
    		$a.close();
	    });
    	$('#btn_close').on('click', function(e){
    		//$a.close();
    	});    	
    }
    

    /**
     * 
     * @param division
     * @param schVal
     * @param trunkDataObj
     * @param ringDataObj
     * @param wdmTrunkDataObj
     */
    function checkPop(division, schVal, trunkDataObj, ringDataObj, wdmTrunkDataObj, useNetworkPathDirection, dataObj, gridId) {
    	/*
    	 * 1. [수정] RU광코어 링/예비선번 사용
    	 */
    	
    	if (typeof gridId == "undefined" || gridId == null || gridId == "" || gridId == "null") {
    		gridId = gridId;
    	}
    	var editYn = false;
    	
    	var trunkId = nullToEmpty(trunkDataObj);
    	trunkId = (trunkId.indexOf("alopex") == 0) ? "" : trunkId; 
    	var ringId = nullToEmpty(ringDataObj);
    	ringId = (ringId.indexOf("alopex") == 0) ? "" : ringId;
    	var wdmTrunkId = nullToEmpty(wdmTrunkDataObj);
    	wdmTrunkId = (wdmTrunkId.indexOf("alopex") == 0) ? "" : wdmTrunkId;
    	
    	if(trunkId != "") {
    		// 트렁크 선번 팝업창 오픈
    		openNetworkPathPop(editYn, trunkDataObj, "trunk", true, dataObj.TRUNK_PATH_DIRECTION, dataObj.TRUNK_PATH_SAME_NO);
    		
    	} else if(trunkId == "" && ringId != "") {
    		if(dataObj.RING_TOPOLOGY_LARGE_CD == '001' && dataObj.RING_TOPOLOGY_SMALL_CD == '031') {
    			openNetworkPathPop(editYn, ringDataObj, "ring", true, useNetworkPathDirection, dataObj.RING_PATH_SAME_NO);
    		} else {
    			addDropPop(editYn, ringId, useNetworkPathDirection, gridId);
    		}
    	} 
    }
    
    /**
     * Function Name 	: openNetworkPathPop
     * Description   	: 트렁크, WDM트렁크 선번 팝업 창
     * ----------------------------------------------------------------------------------------------------
     * param    	 	: 
     *   editYn		 	: 수정가능 여부
     *   ntwkLineNo  	: 선번 번호
     *   searchDivision : 트렁크, WDM트렁크 구분
     *   btnPrevRemove	: 선번 팝업창에서 '이전' 버튼 유무
     *   useNetworkPathDirection : 네트워크 방향
     *   pathSameNo		: 선ID번
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function openNetworkPathPop(editYn, ntwkLineNo, searchDivision, btnPrevRemove, useNetworkPathDirection, pathSameNo, gridId) {
    	if(ntwkLineNo == null) return;
    	if(gridId == null || gridId == undefined || gridId == "") gridId = gridId;

    	var param = {"ntwkLineNo" : ntwkLineNo, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno, "searchDivision" : searchDivision, "editYn" : editYn
    						, "btnPrevRemove" : btnPrevRemove, "useNetworkPathDirection" : useNetworkPathDirection, "pathSameNo" : pathSameNo };
    	
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) ==""){
    		urlPath = "/tango-transmission-web";
    	}
    	
    	var popupName = $a.popup({
    	  	url: urlPath+'/configmgmt/cfline/NetworkPathListPop.do',
    	  	data: param,
    	    windowpopup : true,
//    	    other:'width=1100,height=700,scrollbars=yes,resizable=yes',
//    		popid: 'NetworkPathListPop',
//    	  	title: '선번',
//    	    iframe: true,
//    	    modal : true,
//    	    movable : true,
    	    width : 1100,
    	    height : 700,
    	    callback:function(data){
    	    	cflineHideProgressBody();
    	    }
    	});
    }
    
    /**
     * Function Name : addDropPop
     * Description   : 링구성도 팝업창
     * ----------------------------------------------------------------------------------------------------
     * param    	 : editYn
     *                 callGridIdForRing. 링 호출한 Grid
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function addDropPop(editYn, ntwkLineNo, useNetworkPathDirection, callGridIdForRing) {
    	var urlPath = $('#ctx').val();
    	if(nullToEmpty(urlPath) ==""){
    		urlPath = "/tango-transmission-web";
    	}
    	
    	if (typeof callGridIdForRing == "undefined" || callGridIdForRing == "" || callGridIdForRing == null) {
    		callGridIdForRing = gridId;
    	}
    	
    	cflineShowProgressBody();
    	var zIndex = parseInt($(".alopex_progress").css("z-index")) + 1;
    	var params = {"ntwkLineNo" : ntwkLineNo, "editYn" : editYn, "useNetworkPathDirection" : useNetworkPathDirection
    					, "zIndex":zIndex, "target":"Alopex_Popup_selectAddDrop"};

    	// 링 데이터 가져오기(T)
    	var focusData = $('#'+callGridIdForRing).alopexGrid("dataGet", {_state : {focused : true}});
    	var rowIndex = focusData[0]._index.row;
    	var dataList = $('#'+callGridIdForRing).alopexGrid("groupRangeGet", {_index: {row : rowIndex}}, "RING_MERGE").member;
    	var ringDataList = [];
    	
    	// ADD
    	var addData = "";
    	// ADD 구간 가져오기
    	addData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : rowIndex -1});
    	ringDataList.push(addData);
    	
    	// THROUGH
    	for(var i = 0; i < dataList.length; i++) {
    		ringDataList.push(dataList[i]);
    	}
    	
    	// DROP
    	var dropData = "";
    	var lastIdx = dataList.length-1;
    	// DROP 구간 가져오기
    	dropData = $('#'+callGridIdForRing).alopexGrid("dataGetByIndex", {row : rowIndex + (lastIdx+1)});
    	ringDataList.push(dropData);
    	
    	if(ringDataList.length > 1) {
    		$.extend(params,{"dataList":AlopexGrid.trimData(ringDataList)});
    	}

    	$a.popup({
        	popid: "selectAddDrop",
    		title: "링 ADD DROP",
    		url: urlPath+'/configmgmt/cfline/RingAddDropPop.do',
    		data: params,
    		iframe: true,
    		modal: true,
    		movable:true,
    		windowpopup : true,
    		width : 1200,
    		height : 850,
    		callback:function(data){
    			cflineHideProgressBody();
    			
    		}
        });
    }
    
    var httpRequestB2b = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallbackB2b)
		  .fail(failCallbackB2b);
    }

    function successCallbackB2b(response, status, jqxhr, flag){
    	if(flag == 'getServiceLineInfo') {
    		cflineHideProgressBody();
    		$('#b2bDetailPopForm').setData(response);
    		baseInfData = response;
    		svlnLclCd = response.svlnLclCd;
    		if(svlnLclCd == '005') {
    			tmofInfo(response);
        		
    			dataParam.mgmtGrpCd = response.mgmtGrpCd;
    	    	dataParam.vType = "B2B";
    	    	
    	    	cflineShowProgressBody();
    	    	httpRequestB2b('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', dataParam, 'GET', 'linePathSearch');
        		//beforeInitGridList(id, dataParam);
    			
    		} else {
    			alertBox('I', "회선정보가 존재하지 않습니다.");
    		}
    	} else if(flag == 'linePathSearch') {
    		if(response.data != undefined) {
    			pathSameNo = response.data.PATH_SAME_NO;
    			$('#'+gridId).alopexGrid('dataSet', response.data.LINKS);
    			$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
    			ntwkLnoGrpSrno = pathSameNo;
    			if (response.data.LINKS > 0) {
    				$('#btnExportExcel').setEnabled(false);
    			}
    		}
    		cflineHideProgressBody();
    	}
    }
    
    function tmofInfo(response){
    	var svlnNoSpan = "";
		$('#lineNmSpan').text(response.lineNm);	//회선명
		
		if(response.mgmtGrpCd == "0002") {
			// 서비스관리번호/가입서비스관리번호
			if(response.srvcMgmtNo == undefined && response.scrbSrvcMgmtNo == undefined){
				svlnNoSpan = response.svlnNo;
			} else {
				svlnNoSpan = response.srvcMgmtNo + "/" + response.scrbSrvcMgmtNo;
			}
		} else if(response.mgmtGrpCd == "0001") {
			svlnNoSpan = response.svlnNo;
		}
		$("#svlnNoSpan").text(svlnNoSpan);	// 회선번호
		$("#sktLineIdValSpan").text(response.sktLineIdVal);	// SKT회선번호
		$("#lineCapaCdNmSpan").text(response.lineCapaCdNm);	// 회선용량
		$("#uprMtsoIdNmSpan").text(response.uprMtsoIdNm);	// 상위국사
		$("#lowMtsoIdNmSpan").text(response.lowMtsoIdNm);	// 하위국사
		$("#chrStatCdNmSpan").text(response.chrStatCdNm);	// 과금상태
		$("#ctrtCustNmSpan").text(response.ctrtCustNm);		// 고객명
    }
    
    function failCallbackB2b(status, jqxhr, flag){
    	//alertBox('I', "실패"); /* 실패 */
    }
    
    
    
    
    
    
    
    
    
    
    
    
    /**
     * B2BDetailPopGridList.js add
     */
    
    
  //Grid 초기화
    function initGridNetworkPath(gridId) {
    	var column = columnMappingNetworkPath();
    	var groupColumn = groupingColumnNetworkPath();
    	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
//    	var headerGroup = headerGroupNetworkPath();
    	
    	$('#'+gridId).alopexGrid({
    		fitTableWidth: true,
    		fillUndefinedKey : null,
    		numberingColumnFromZero: false,
    		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
    		useClassHovering : true,
    		autoResize: true,
    		cellInlineEdit : false,
    		cellSelectable : false,
    		rowInlineEdit: false,
    		rowClickSelect : false,
    		rowSingleSelect : true,
    		rowspanGroupSelect: true,
    		columnMapping : column,
    		grouping : groupColumn,
        	message: {
        		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
    		}
    	});
    	
    	$('#'+gridId).alopexGrid("updateOption", { fitTableWidth: true });
    }
    
    
 // 엑셀 다운로드를 위한 기본정보 그리드화
    function initGridNetworkInfo() {
    	var mapping = [];
    	
    	mapping = [
	    	          { key : 'lineNm', title : '회선명', align : 'center', width : '300px'}
		  				, { key : 'svlnNo', title : '회선번호', align : 'center', width : '150px'}
		  				, { key : 'sktLineIdVal', title : 'SKT회선번호', align : 'left', width : '120px' } 
		  				, { key : 'lineCapaCdNm', title : '회선용량', align : 'left', width : '200px' } 
		  				, { key : 'uprMtsoIdNm', title : '상위국사', align : 'left', width : '120px' } 
		  				, { key : 'lowMtsoIdNm', title : '하위국사', align : 'left', width : '120px' } 
		  				, { key : 'chrStatCdNm', title : '과금상태', align : 'left', width : '120px' } 
		  				, { key : 'ctrtCustNm', title : '고객명', align : 'left', width : '120px' } 
	  			];
    		
    	$('#'+baseGridId).alopexGrid({
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
    		useClassHovering : true,
    		columnMapping : mapping
    	});
    }

    function columnMappingNetworkPath() {
    	var mapping = [];
    	
    	mapping = [
		            {key : 'SVLN_NO', title : '서비스회선번호', value : dataParam.ntwkLineNo, hidden : true }
		            , {key : 'LINE_NM', title : '경유회선명(Cascading)', value : dataParam.lineNm , hidden : true }
		           
		           ,{ key : 'TRUNK_MERGE', hidden : true, value : function(value, data) {
							if(data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
								return data._index.id;
							} else if(data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
								return data['WDM_TRUNK_ID'];
							} else if(data['TRUNK_ID'] == null && data['RING_ID'] != null) {
								return data['RING_ID'];
							} else if(data['TRUNK_ID'] != null) {
								return data['TRUNK_ID'];
							} 
						}
					}
					, { key : 'RING_MERGE', hidden : true, value : function(value, data) {
							if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
								return data._index.id;
							} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
								return data['WDM_TRUNK_ID'];
							} else if(data['RING_ID'] != null) {
								return data['RING_ID'];
							} 
					   }
					}
		            , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
					}
		            , { key : 'WDM_TRUNK_NM',	 		title : cflineMsgArray['wdmTrunkName'], align : 'left', width : '120px'
		        		, inlineStyle: wdmStyleCss
		        		, tooltip : tooltipNetworkText
						, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
		        		, hidden : true
					}
			        , { key : 'WDM_TRUNK_ID', 			title : cflineMsgArray['wdmTrunkName'], align : 'center', width : '10px', hidden : true}
			        , { key : 'RING_NM', 				title : cflineMsgArray['ringName'], align : 'left', width : '120px'
						, inlineStyle: ringStyleCss
						, tooltip : tooltipNetworkText
						, rowspan : {by : 'RING_MERGE'}  /* 링 */
					
					  } /* 링 명 */
			        , { key : 'RING_ID', 				title : cflineMsgArray['ringName'], align : 'center', width : '10px', hidden : true}
					, { key : 'TRUNK_NM', 				title : cflineMsgArray['trunkNm'], align : 'left', width : '140px'
							, inlineStyle: trunkStyleCss
							, tooltip : tooltipNetworkText
							, rowspan : {by : 'TRUNK_MERGE'}  /* 트렁크 */		
							, hidden : false
					}
					, { key : 'TRUNK_ID', 				title : cflineMsgArray['trunkNm'], align : 'center', width : '10px', hidden : true}
			        
			        , { key : leftOrgNm, 				title : cflineMsgArray['westMtso'], align : 'center', width : '98px', styleclass : nodeCopyPasteCss} /* A 국사 */
			        , { key : 'LEFT_NODE_ROLE_NM', 		title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center', width : '90px', styleclass : nodeCopyPasteCss } /* 상하위 */
			        , { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '130px', inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss } /* A장 비 */
			        , { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '80px', inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss } /* A 포트  */
			        , { key : 'LEFT_CHANNEL_DESCR', 	title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px', styleclass : nodeCopyPasteCss } /* A 채널 */
			        , { key : 'LEFT_IS_CHANNEL_T1',		title : cflineMsgArray['t1'], align : 'center', width : '45px'
			        	, render: function(value, data){  
			        		var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
			        		html += (value === true) ? ' checked':'';
			        		html += '">';
			        		html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
			        		html += '/></label>';
			        		return html;
			        	}
			        , styleclass : nodeCopyPasteCss
			        }	                	
			        
			      /*  , { key : 'A', 			title : '',  align : 'left', width : '5px'
			        		, styleclass: 'guard'
			        		, headerStyleclass : 'guard'
			        	}*/ /* 경계선 */
			        
			        , { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '130px', inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss} /* B 장비 */
			        , { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '80px', inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss } /* B 포트 */
			        , { key : 'RIGHT_CHANNEL_DESCR', 	title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px', styleclass : nodeCopyPasteCss } /* B 채널 */
			        , { key : 'RIGHT_IS_CHANNEL_T1',	title : cflineMsgArray['t1'], align : 'center', width : '45px'
			        	, render: function(value, data){  
			        		var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
			        		html += (value === true) ? ' checked':'';
			        		html += '">';
			        		html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
			        		html += '/></label>';
			        		return html;
			        	}
			        , styleclass : nodeCopyPasteCss
			        }
			        , { key : 'RIGHT_NODE_ROLE_NM', 	title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center', width : '90px', styleclass : nodeCopyPasteCss } /* 상하위 */
			        , { key : rightOrgNm, 				title : cflineMsgArray['eastMtso'], align : 'center', width : '98px', styleclass : nodeCopyPasteCss } /* B 국사 */
//			        , { key : 'TRUNK_ROW_FILTER', hidden: true}
//			        , { key : 'WDM_ROW_FILTER', hidden: true}
       ];
    	
    	//mapping = mapping.concat(addcolumn());
    	return mapping;
    }
    
    
    function trunkStyleCss(value, data, mapping) {
    	var style = {
    			'white-space' : 'pre-line'
    	};
    	
    	if(value != null && value != undefined && value != "") {
    		style['background-color'] = '#F1EBBF';
    	} 
    	
    	return style;
    	
    }

    function ringStyleCss(value, data, mapping) {
    	var style = {
    			'white-space' : 'pre-line'
    	};
    	
    	if(value != null && value != undefined && value != "") {
    		style['background-color'] = '#FFEAEA';
    	} 
    	
    	return style;
    	
    }

    function wdmStyleCss(value, data, mapping) {
    	var style = {
    			'white-space' : 'pre-line'
    	};
    	
    	if(value != null && value != undefined && value != "") {
    		style['background-color'] = '#D6EED6';
    	} 
    	
    	return style;
    	
    }
    
    function nodeCopyPasteCss(value, data, mapping) {
    	// 장비 복사, 잘라내기 배경색 
    	var channelYn = false;
    	if(data.LEFT_NE_COPY == "copy") {
    		if(mapping.key.indexOf("LEFT") == 0) {
    			return 'nodeSelectBackground';
    		} 
    	} else if(data.RIGHT_NE_COPY == "copy") {
    		if(mapping.key.indexOf("RIGHT") == 0) {
    			return 'nodeSelectBackground';
    		}
    	} else {
    		channelYn = true;
    	}
    	
    	// 국사 묶음 표시
    	if(nullToEmpty(data.LEFT_ORG_BORDER) != "") {
    		if(data.LEFT_ORG_BORDER.indexOf("leftSame") == 0) {
    			if(mapping.key == "LEFT_ORG_NM") {
//    			if(mapping.key.indexOf("LEFT") == 0) {
    				var indexKey = data.LEFT_ORG_BORDER.replace("leftSame", "") % 3;
    				return 'orgBorder'+indexKey;
//    				if(mapping.key == "LEFT_ORG_NM") {
//    					return 'orgBorder'+indexKey + ' left';
//    				} else if(mapping.key == "LEFT_CHANNEL_DESCR"){
//    					return 'orgBorder'+indexKey + ' right';
//    				} else {
//    					return 'orgBorder'+indexKey;
//    				}
    				
    			}
    		} 
    	}
    	
    	if(nullToEmpty(data.RIGHT_ORG_BORDER) != "") {
    		if(data.RIGHT_ORG_BORDER.indexOf("rightSame") == 0) {
    			if(mapping.key == "RIGHT_ORG_NM") {
//    			if(mapping.key.indexOf("RIGHT") == 0) {
    				var indexKey = data.RIGHT_ORG_BORDER.replace("rightSame", "") % 3;
    				return 'orgBorderRght'+indexKey;
//    				if(mapping.key == "RIGHT_ORG_NM") {
//    					return 'orgBorderRght'+indexKey + ' left';
//    				} else if(mapping.key == "RIGHT_CHANNEL_DESCR") {
//    					return 'orgBorderRght'+indexKey + ' right';
//    				} else {
//    					return 'orgBorderRght'+indexKey;
//    				}
    			}
    		} 
    	}
    	 	
    	// 채널과 사용네트워크의 채널의 시작이 다를 때 테두리 색깔
    	if(channelYn) {
    		var useChannelDescr = "";
    		var channelDescr = "";
    		if(mapping.key == "LEFT_CHANNEL_DESCR") {
    			useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
    			channelDescr = data['LEFT_CHANNEL_DESCR'];
    		} else if(mapping.key == "RIGHT_CHANNEL_DESCR") {
    			useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
    			channelDescr = data['RIGHT_CHANNEL_DESCR'];
    		}
    		
    		if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
    			return 'channelDescrCss';
    		} else {
    			return '';
    		}
    	}
    }
     
    
    function inlineStyleCss(value, data, mapping){
    	var style = {
    			'text-decoration' : 'line-through',
    			'color' : 'red'
    	}; 
    	 
    	var deletecheck = checkDeleteNodeOrPort(data, mapping);
    	if(deletecheck) {
    		return style;
    	} else if ( checkNotExistNeFromRing(data, mapping) ) {
    		style = {
    				'font-weight' : 'bold',
    				'color' : 'red'
    		};
    		
    		return style;
    	} else if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001' && topoSclCd == "031") {
    		// 가입자망링 데이터 오류 체크
    		if($('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
    			// 셀이 편집 상태인 경우 배경
    			var style = { 'background' : '#93DAFF'}; 
    			if(data['ROW_HIGHLIGHT'] == "H") return style;
    			return false;
    		} else {
    			// 셀이 편집이 아닌 경우 빨간 글자
    			var style = {'color' : 'red'}; 
    			if(data['ROW_HIGHLIGHT'] == "H") return style;
    			else return '';
    		}
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
    		if ( mapping.key == 'LEFT_NE_NM' ) {
    			str = '장비ID : ' + nullToEmpty(data.LEFT_NE_ID) + '\n장비명 : ' + nullToEmpty(data.LEFT_NE_NM) + '\n장비역할 : ' + nullToEmpty(data.LEFT_NE_ROLE_NM)
    					+ '\n제조사 : ' + nullToEmpty(data.LEFT_VENDOR_NM)
    					+ '\n모델 : ' + nullToEmpty(data.LEFT_MODEL_NM)
    					+ '\n모델(대) : ' + nullToEmpty(data.LEFT_MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.LEFT_MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.LEFT_MODEL_SCL_NM)
    				 	+ '\n상태 : ' + nullToEmpty(data.LEFT_NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.LEFT_ORG_NM) + '\n전송실 : ' + nullToEmpty(data.LEFT_ORG_NM_L3)
    				 	+ '\n더미장비 : ' + nullToEmpty(data.LEFT_NE_DUMMY);
    		}
    		else if ( mapping.key == 'RIGHT_NE_NM' ) {
    			str = '장비ID : ' + nullToEmpty(data.RIGHT_NE_ID) + '\n장비명 : ' + nullToEmpty(data.RIGHT_NE_NM) + '\n장비역할 : ' + nullToEmpty(data.RIGHT_NE_ROLE_NM)
    					+ '\n제조사 : ' + nullToEmpty(data.RIGHT_VENDOR_NM)
    					+ '\n모델 : ' + nullToEmpty(data.RIGHT_MODEL_NM)
    					+ '\n모델(대) : ' + nullToEmpty(data.RIGHT_MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.RIGHT_MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.RIGHT_MODEL_SCL_NM)
    				 	+ '\n상태 : ' + nullToEmpty(data.RIGHT_NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.RIGHT_ORG_NM) + '\n전송실 : ' + nullToEmpty(data.RIGHT_ORG_NM_L3)
    					+ '\n더미장비 : ' + nullToEmpty(data.RIGHT_NE_DUMMY);
    		}		
    		else if ( mapping.key == 'LEFT_PORT_DESCR' ) {
    			str = '포트ID : ' + nullToEmpty(data.LEFT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.LEFT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.LEFT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.LEFT_PORT_DUMMY);
    		}
    		else if ( mapping.key == 'RIGHT_PORT_DESCR' ) {
    			str = '포트ID : ' + nullToEmpty(data.RIGHT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.RIGHT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.RIGHT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.RIGHT_PORT_DUMMY);
    		}
    		else {
    			str = value;
    		}
    	}
    	return str;
    }

    function tooltipNetworkText(value, data, mapping){

    	var str = '';
    	if ( mapping.key == 'TRUNK_NM' ) {
//    		if ( data.TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//    			str = '트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//    		} else {
//    			str = data.TRUNK_NM;
//    		}
    		
    		str = data.TRUNK_NM;
    	}
    	else if ( mapping.key == 'RING_NM' ) {
//    		if ( data.RING_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//    			str = '링 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//    		} else {
//    			str = data.RING_NM;
//    		}
    		
    		str = data.RING_NM;
    	}		
    	else if ( mapping.key == 'WDM_TRUNK_NM' ) {
//    		if ( data.WDM_TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//    			str = 'WDM 트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//    		} else {
//    			str = data.WDM_TRUNK_NM;
//    		}
    		
    		str = data.WDM_TRUNK_NM;
    	}

    	return str;
    }
    
    
    function groupingColumnNetworkPath() {
    	var grouping = {
    			by : ['TRUNK_MERGE', 'RING_MERGE', 'WDM_TRUNK_MERGE'], 
    			useGrouping:true,
    			useGroupRowspan:true,
    			useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
    			useGroupRearrange : true
    	};
    	
    	return grouping;
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

    function checkNotExistNeFromRing(data, mapping) {
    	var deletecheck = false;
    	// WEST 장비
    	if(mapping.key == 'LEFT_NE_NM') {
    		if(data.LEFT_NE_ID == '-' ) {
    			deletecheck = true;
    		} 
    	}
    	
    	// EAST 장비
    	if(mapping.key == 'RIGHT_NE_NM') {
    		if(data.RIGHT_NE_ID == '-' ) {
    			deletecheck = true;
    		} 
    	}
    	return deletecheck;
    }
    
    
});