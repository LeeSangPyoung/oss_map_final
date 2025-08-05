/**
 * 
 */
var mainGridId = 'mainGrid';
var lnoGridId = 'lnoGrid';
/*var addData = false;*/
                  
$a.page(function() {
    this.init = function() {
    	//initMainGrid();
    	//initLnoGrid();
    	renderGrid(mainGridId, null, 0, false);
    	renderGrid(lnoGridId, null, 0, false);
    };
});

function initMainGrid() {
	var mainColumn = getColumnMapping(mainGridId);
	$('#'+mainGridId).alopexGrid({
    	pager : true,
    	autoColumnIndex: true,
		autoResize: true,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : false, //하단 스크롤바
		rowClickSelect : true,
		rowSingleSelect : true,
		numberingColumnFromZero: false,
		defaultColumnMapping:{sorting: true},
		columnMapping:mainColumn,
		height : "5row",
		fillUndefinedKey:null,
		fitTableWidth : true,
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" },
	}); 
}

function initLnoGrid() {
	var lnocolumn = getColumnMapping(lnoGridId);
	$('#'+lnoGridId).alopexGrid({
		pager : false,
		autoColumnIndex: true,
		autoResize: true,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : false, //하단 스크롤바
		rowClickSelect : true,
		rowSingleSelect : true,
		numberingColumnFromZero: false,
		defaultColumnMapping:{sorting: true},
		columnMapping:lnocolumn,
		height : "7row",
		fillUndefinedKey:null,
		fitTableWidth : true,
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" },
	}); 
}

function getColumnMapping(param){
	var column = [
//	    		  {key : 'check'		, title : cflineMsgArray['number'] /*번호*/, align:'center', width:'60px',numberingColumn : true, rowspan:{by:'ntwkLineNo'} }
				  {key : 'ntwkLineNo'	, title : cflineMsgArray['lineNo'], /* 회선번호 */ align:'center', width: '120px'}
				  , {key : 'ntwkLineNm'	, title : cflineMsgArray['lnNm'], /* 회선명 */align:'left', width: '140px'}
	    		  , {key : 'tsdnRontLineNo'	, title : "TSDN회선번호", align:'center', width: '120px'}
	    	];
	
	if(param == mainGridId){
	    var  mainColumn= [
	          	    		{key : 'tsdnSrvcTypNm'	, title : cflineMsgArray['serviceType'] /*서비스유형: TSDN서비스유형값*/, align:'center', width:'100px'}
	          	    		, {key : 'tsdnChnlVal'	, title : cflineMsgArray['channel']/*채널: TSDN채널값*/, align:'center'	, width: '50px'}
	          	    		, {key : 'wavlVal'	, title : cflineMsgArray['wavelength']/*파장: 파장값*/, align:'right', width: '70px'}
	          	    		, {key : 'tsdnLineTypNm'	, title : cflineMsgArray['lineType'] /*회선유형: TSDN회선유형값*/, align:'center', width: '100px'}
	          	    		, {key : 'protModeTypNm', title : cflineMsgArray['protectionMode'] /*보호모드: 보호모드유형코드*/, align:'center', width:'70px'}
	          	        ];
	    column = column.concat(mainColumn);
	    
	}else{
		var lnoColumn = [
					{ key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
					}
					, { key : 'WDM_TRUNK_ID', align : 'center', width : '10px', hidden : true}
					, { key : 'RONT_SCTN_CL_NM', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px'}
					, { key : 'LEFT_NE_ROLE_NM', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '60px' }
					, { key : 'LEFT_JRDT_TEAM_ORG_NM', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' }
					, { key : 'LEFT_VENDOR_NM', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '70px' }
					, { key : 'LEFT_ORG_NM', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
					, { key : 'LEFT_NE_ID', align : 'center', title : '' /*노드ID*/, hidden : true}
					, { key : 'LEFT_NE_NM', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '150px' }
					, { key : 'LEFT_CARD_MODEL_NM', title : 'Unit', align : 'left', width : '70px' }
					, { key : 'LEFT_SHELF_NM', title : 'Shelf', align : 'left', width : '50px' }
					, { key : 'LEFT_SLOT_NO', title : 'Slot', align : 'left', width : '50px' }
					, { key : 'LEFT_PORT_DESCR', title : 'Port', align : 'left', width : '90px' }
					, { key : 'RIGHT_NE_ID', align : 'center', title : '' /*FDF*/, hidden : true}
					, { key : 'RIGHT_NE_NM', title : 'FDF', align : 'left', width : '130px'}
					, { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['fiberDistributionFramePort']/*FDF포트*/, align : 'left', width : '70px' }
			   	];
		
		column = lnoColumn;
	}
	
	return column;
}

function renderGrid(gridDiv, data, totalCount, addData){
	var returnMsg = "";	
	// 그리드 컬럼 초기화
	if(gridDiv == mainGridId){
		if (addData != true) {			
			initMainGrid();
		}
		
		returnMsg = cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);
		//$('#'+group).text("("+getNumberFormatDis(totalCount)+")");
	}else {
		initLnoGrid();
	}
	
	if(gridDiv == mainGridId && addData != true){
		$('#'+gridDiv).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return returnMsg} } } );
	}
	
	$('#'+gridDiv).on('gridRefresh');
	//$('#'+gridDiv).alopexGrid("columnFix", 4);
}