/**
 * NetworkPathPointList.js
 *
 * @author Administrator
 * @date 2017. 7. 11.
 * @version 1.0
 *  
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-09-12  2. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2019-09-30  3. 기간망 링 선번 고도화 : 링/기간망 트렁크 조회하여 링에서 경유링을 설정 할 수 있게 처리함
 * 2020-08-06  4. 가입자망 링 고도화 : 경유링 사용가능하게 처리
 */

var teamsGridId = "teamsPathList";
var teamsSrpGridId = "teamsSprPathList";
var tagngoGridId = "tangoPathList";
$a.page(function() {
	this.init = function(id, param) {
		$("#basicTabs").on("tabchange", function(e,index){
			if(index == 0){
				$("#"+tagngoGridId).alopexGrid("viewUpdate");
			} else if(index == 1){
				$("#"+teamsGridId).alopexGrid("viewUpdate");
			} else if(index == 3) {
				$("#selectPath").show();
			}
		});
		
		// 노드선번 엑셀 다운로드
		$('#btnExportExcelTeamsPath, #btnExportExcelTangoPath').on('click', function(e) {	
			var date = getCurrDate();
			var gridId = "";
			
			if(this.id == "btnExportExcelTeamsPath") {
				var gridId = teamsGridId;
			} else {
				var gridId = tagngoGridId;
			}
			
			var worker = new ExcelWorker({
	     		excelFileName : '선번 정보_' + date,
	     		sheetList: [{
	     			sheetName: '선번 정보_' + date,
	     			placement: 'vertical',
	     			$grid: $('#'+gridId)
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
	};
});

function teamsPathGrid() {
//	initGridNetworkPath('teamsPathList');
	$('#'+teamsGridId).alopexGrid('dataSet', teamsPathData.NODES);
//	$('#'+teamsGridId).alopexGrid("viewUpdate");
	
}

function tangoPathGrid() {
//	initGridNetworkPath('tangoPathList');
	var tangoPath = teamsPath.toTangoPath();
	var tangoPathData = tangoPath.toData(); 
	
	$('#'+tagngoGridId).alopexGrid('dataSet', tangoPathData.LINKS);
//	$('#'+tagngoGridId).alopexGrid("viewUpdate");
}

function initGridNetworkPath(gridId) {
	var column = [];
	var groupColumn = groupingColumnPath();
	
	if(gridId == teamsGridId || gridId == teamsSrpGridId) {
		column = columnMappingTeamsPath();
	} else if(gridId == tagngoGridId) {
		column = columnMappingTangoPath();
	}
	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
	
	// 주/예비선번 탭이 있는경우 그리드의 높이가 달라야 하기 때문에 변수처리함
	var height = 340;
	if( isPtp() || isWdmTrunk() || isRuCoreLine() ) {
		height = 310;
	}
	
	$('#'+gridId).alopexGrid({
		defaultColumnMapping: {
			resizing: true
		},
		autoColumnIndex: true,
		fillUndefinedKey : null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		cellInlineEdit : false,
		cellSelectable : false,
		rowInlineEdit: false,
		rowClickSelect : false,
		rowSingleSelect : true,
		rowspanGroupSelect: true,
		columnMapping : column,
		grouping : groupColumn,
		height : height,		
		pager : false,
    	message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
		}
	});
	
	// 회선 및 네트워크에 따라 숨기는 컬럼 정의
	gridHidColSet(gridId);
	$('#'+gridId).alopexGrid("updateOption", { fitTableWidth: true });
}

/**
 * 그리드 컬럼
 * @returns {Array}
 */
function columnMappingTeamsPath() {
	var baseColumn = [
		{ key : 'NE_NM', 						title : '장비명', align : 'left', width : '170px', tooltip : tooltipText }
		, { key : 'A_PORT_DESCR', 				title : 'A포트', align : 'left', width : '140px', tooltip : tooltipText }
		, { key : 'A_CHANNEL_DESCR', 			title : 'A채널', align : 'left', width : '90px' }
		
		, { key : 'B_PORT_DESCR', 				title : 'B포트', align : 'left', width : '140px', tooltip : tooltipText }
		, { key : 'B_CHANNEL_DESCR', 			title : 'B채널', align : 'left', width : '90px' }
	];
	
	if (isEdit() == true) {
		var fiveGponColum = [
		      { key : 'A_FIVE_GPON_EQP_TYPE', title : 'A_FIVE_G_PON_EQP_TYPE', width : '100px', hidden: true 
			    	, value : function(value, data) { 
						return getFiveGponEqpType(data, 'A');
			    	}
		      }
		    , { key : 'B_FIVE_GPON_EQP_TYPE', title : 'B_FIVE_G_PON_EQP_TYPE', width : '100px', hidden: true 
			    	, value : function(value, data) { 
						return getFiveGponEqpType(data, 'B');
			    	}
		      }
		  ];
		baseColumn = baseColumn.concat(fiveGponColum);
	}
	  
	
	var column = [];

	if(isServiceLine()) {
		column = [
		          /** 2018-09-12  2. RU고도화*/
		          { key : 'SERVICE_MERGE', hidden : true, value : function(value, data) {
						if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] != null) {
							return data['RING_ID'];
						} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] != null) {
							return data['TRUNK_ID'];
						} else if(data['SERVICE_ID'] != null) {
							return data['SERVICE_ID'];
						} 
		          	}
				  }
		          , { key : 'TRUNK_MERGE', hidden : true, value : function(value, data) {
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
			      /*
			         * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한 경우라면 L2에 해당 데이터가 셋팅된다
			         * 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 
			         * 2차 참조까지의 데이터만 있는경우2차링의 정보를 표시하도록 편집이 필요함
			         */
					, { key : 'RONT_MERGE', hidden : true, value : function(value, data) {
							if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
								return data._index.id;
							} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
								return data['WDM_TRUNK_ID'];
							} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "" ) {
								return data._index.id;
							} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" ) {
								if (nullToEmpty(data['RING_LVL']) == "1") {
									return data['RING_ID'];
								} else if (nullToEmpty(data['RING_LVL']) == "2") {
									return data['RING_ID_L2'];
								} else if (nullToEmpty(data['RING_LVL']) == "3") {
									return data['RING_ID_L3'];
								}								
							} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
								return data['REFC_RONT_TRK_NTWK_LINE_NO'];
							} 
					    }
				      }	
			        , { key : 'RING_MERGE3', hidden : true, value : function(value, data) {
							if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
								return data._index.id;
							} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
								return data['WDM_TRUNK_ID'];
							} else if(nullToEmpty(data['RING_ID']) != ""  ) {
								if (nullToEmpty(data['RING_LVL']) == "1") {
									return data['RING_ID'];
								} else if (nullToEmpty(data['RING_LVL']) == "2") {
									return nvlStr(data['RING_ID_L2'], data._index.id);
								} else if (nullToEmpty(data['RING_LVL']) == "3") {
									return nvlStr(data['RING_ID_L3'], data._index.id);
								}
							} 
					     }
			          }	
		            , { key : 'RING_MERGE2', hidden : true, value : function(value, data) {
			            	if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
								return data._index.id;
							} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
								return data['WDM_TRUNK_ID'];
							} else if(nullToEmpty(data['RING_ID']) != ""  ) {
								if (nullToEmpty(data['RING_LVL']) == "1") {
									return data['RING_ID'];
								} else if (nullToEmpty(data['RING_LVL']) == "2" || nullToEmpty(data['RING_LVL']) == "3") {
									return data['RING_ID_L2'];
								} 
							} 
					    }
			          }	
			      , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; 
						}
					}
		          , { key : 'WDM_TRUNK_NM', 		title : 'WDM트렁크', align : 'left', width : '170px'
			    	  	, inlineStyle: wdmStyleCss
						, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
			      }
		          , { key : 'CASCADING_RING_NM_3', 		title : '경유링Lv1 명'    /*경유링 Lv1 명*/ , hidden:true
					    , align : 'left', width : '170px'
						, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE3'}
						, value : function(value, data) {							
							var RING_NM_L3 = data['RING_NM_L3'] ;
							if (nullToEmpty(data['RING_LVL']) == "2") {
								RING_NM_L3 = data['RING_NM_L2'] ;
							}
							return RING_NM_L3;
						}
				}
	            , { key : 'RONT_TRK_NM', 		title : '기간망 트렁크명'   /* 기간망 트렁크명 */, hidden:true
					, width : '170px'
				    , inlineStyle: rontTrkStyleCss
				    , rowspan : {by : 'RONT_MERGE'}
					, value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				  }
				, { key : 'CASCADING_RING_NM_2', 		title : '경유링Lv2 명'    /*경유링Lv2 명*/ , hidden:true
					    , align : 'left', width : '170px'
						, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE2'}
						, value : function(value, data) {								
							var RING_NM_L2 = data['RING_NM_L2'] ;
							// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
							if (nullToEmpty(data['RING_LVL']) == "2") {
								RING_NM_L2 = "" ;
							}
							return RING_NM_L2;
						}
				 }
				 /*, { key : 'CASCADING_RING_NM', 		title : '경유링(Cascading)명'    경유링 명 , hidden:true, width : '170px'
					    , inlineStyle: ringStyleCss
					    , rowspan : {by : 'RING_MERGE'}
						, value : function(value, data) {
							var RING_NM = data['RING_NM'] ;							
							return RING_NM;
						}
					}*/
		          , { key : 'RING_NM', 				title : '링', align : 'left', width : '170px'
			    	  	, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE'}		/* 링 */
			      }
		          , { key : 'TRUNK_NM', 				title : '트렁크', align : 'left', width : '170px'
			    	  	, inlineStyle: trunkStyleCss
						, rowspan : {by : 'TRUNK_MERGE'}  /* 트렁크 */			
			      }
			      , { key : 'SERVICE_NM', 				title : '경유회선명(Cascading)', align : 'left', width : '170px'
			    	  	, inlineStyle: serviceStyleCss
						, rowspan : {by : 'SERVICE_MERGE'}  /* 서비스 */			
			      }
		];
		
	} else if(isTrunk()) {
		column = [
		      { key : 'RING_MERGE', hidden : true, value : function(value, data) {
					if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
						return data._index.id;
					} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
						return data['WDM_TRUNK_ID'];
					} else if(data['RING_ID'] != null) {
						return data['RING_ID'];
					} 
				}
			  }
		      /*
		         * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한 경우라면 L2에 해당 데이터가 셋팅된다
		         * 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 
		         * 2차 참조까지의 데이터만 있는경우2차링의 정보를 표시하도록 편집이 필요함
		         */
				, { key : 'RONT_MERGE', hidden : true, value : function(value, data) {
						if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "" ) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}								
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						} 
				    }
			      }	
		        , { key : 'RING_MERGE3', hidden : true, value : function(value, data) {
						if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return nvlStr(data['RING_ID_L2'], data._index.id);
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return nvlStr(data['RING_ID_L3'], data._index.id);
							}
						} 
				     }
		          }	
	          , { key : 'RING_MERGE2', hidden : true, value : function(value, data) {
		            	if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2" || nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							} 
						} 
				    }
		          }	
		      , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
					return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; 
					}
				}
		      , { key : 'WDM_TRUNK_NM', 		title : 'WDM트렁크', align : 'left', width : '170px'
		    	  	, inlineStyle: wdmStyleCss
					, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
		      }

		      , { key : 'CASCADING_RING_NM_3', 		title : '경유링Lv1 명'    /*경유링 Lv1 명*/ , hidden:true
				    , align : 'left', width : '170px'
					, inlineStyle: ringStyleCss
					, rowspan : {by : 'RING_MERGE3'}
					, value : function(value, data) {							
						var RING_NM_L3 = data['RING_NM_L3'] ;
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'] ;
						}
						return RING_NM_L3;
					}
			}
	          , { key : 'RONT_TRK_NM', 		title : '기간망 트렁크명'   /* 기간망 트렁크명 */, hidden:true
					, width : '170px'
				    , inlineStyle: rontTrkStyleCss
				    , rowspan : {by : 'RONT_MERGE'}
					, value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				  }
				, { key : 'CASCADING_RING_NM_2', 		title : '경유링Lv2 명'    /*경유링Lv2 명*/ , hidden:true
					    , align : 'left', width : '170px'
						, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE2'}
						, value : function(value, data) {								
							var RING_NM_L2 = data['RING_NM_L2'] ;
							// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
							if (nullToEmpty(data['RING_LVL']) == "2") {
								RING_NM_L2 = "" ;
							}
							return RING_NM_L2;
						}
				}
			 /*, { key : 'CASCADING_RING_NM', 		title : '경유링명'    경유링 명 , hidden:true, width : '170px'
				    , inlineStyle: ringStyleCss
				    , rowspan : {by : 'RING_MERGE'}
					, value : function(value, data) {
						var RING_NM = data['RING_NM'] ;
						if (nullToEmpty(data['RING_NM']) != ""
							&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NM']) != ""
								&& nullToEmpty(data['RING_NM_L2']) == "" 
								&& nullToEmpty(data['RING_NM_L3']) == "" ) {
							RING_NM += "[기간망 : " + data['REFC_RONT_TRK_NTWK_LINE_NM'] + "]" ;
						}
						return RING_NM;
					}
				}*/
		      , { key : 'RING_NM', 				title : '링', align : 'left', width : '170px'
		    	  	, inlineStyle: ringStyleCss
					, rowspan : {by : 'RING_MERGE'}		/* 링 */
		      }
		      
		];
	} else if(isRing()) {
		column = [

			      { key : 'RING_MERGE', hidden : true, value : function(value, data) {
						if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(data['RING_ID'] != null) {
							return data['RING_ID'];
						} 
					}
				  }
			    /*
		         * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한 경우라면 L2에 해당 데이터가 셋팅된다
		         * 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 
		         * 2차 참조까지의 데이터만 있는경우2차링의 정보를 표시하도록 편집이 필요함
		         */
				, { key : 'RONT_MERGE', hidden : true, value : function(value, data) {
						if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "" ) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							}								
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						} 
				    }
			      }	
		        , { key : 'RING_MERGE3', hidden : true, value : function(value, data) {
						if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						} 
				     }
		          }	
	            , { key : 'RING_MERGE2', hidden : true, value : function(value, data) {
		            	if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2" || nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							} 
						} 
				    }
		          }	
		     ,{ key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
					return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; 
					}
				}
		      , { key : 'WDM_TRUNK_NM', 		title : 'WDM트렁크', align : 'left', width : '180px'
		    	  	, inlineStyle: wdmStyleCss
					, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
		      }

	          , { key : 'CASCADING_RING_NM_3', 		title : '경유링Lv1 명'   /* 경유링 명 */, hidden:true, align : 'left', width : '170px'
					, inlineStyle: ringStyleCss
					, rowspan : {by : 'RING_MERGE3'}
					, value : function(value, data) {							
						var RING_NM_L3 = data['RING_NM_L3'] ;
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'] ;
						}
						return RING_NM_L3;
					}
				}
			 , { key : 'CASCADING_RING_NM_2', 		title : '경유링Lv2명'   /* 경유링 명 */, hidden:true, align : 'left', width : '170px'
					, inlineStyle: ringStyleCss
					, rowspan : {by : 'RING_MERGE2'}
					, value : function(value, data) {								
						var RING_NM_L2 = data['RING_NM_L2'] ;		
						// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L2 = "" ;
						}
						return RING_NM_L2;
					}
				}
			 , { key : 'RONT_TRK_NM', 		title : '기간망 트렁크명'   /* 기간망 트렁크명 */, hidden:true
					, width : '170px'
				    , inlineStyle: rontTrkStyleCss
				    , rowspan : {by : 'RONT_MERGE'}
					, value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				  }
			 , { key : 'CASCADING_RING_NM', 		title : '경유링명'    /*경유링 명*/ , hidden:true, width : '170px'
				    , inlineStyle: ringStyleCss
				    , rowspan : {by : 'RING_MERGE'}
					, value : function(value, data) {
						var RING_NM = data['RING_NM'] ;
						return RING_NM;
					}
				}
		];
	} else if(isWdmTrunk()) {
			
	}
	
	if(this.window.name == "Alopex_Popup_ServiceLineInfoPopNew" && 	initParam.mgmtGrpCd == "0002") {
		column.unshift({ key : 'ORG_NM', 						title : '국사', align : 'center', width : '90px' } );
		column.unshift({ key : 'VERIFY_PATH_RESULT_MSG', 		title : '검증결과', align : 'left', width : '180px' } );
	}
	
	column = column.concat(baseColumn);
	
	// 링일 경우 상/하위 표시
	if(isRing()) {
		var cotRt = [ { key : 'NODE_ROLE_NM', 				title :cflineMsgArray['supSub'], align : 'center', width : '100px'	} ];
		column = column.concat(cotRt);
	}
	
	column = column.concat(addTeamsColumn());
	return column;
}

function columnMappingTangoPath() {
	var baseColumn = [
		{ key : 'LEFT_ORG_NM', 						title : cflineMsgArray['westMtso'], align : 'center', width : '98px' } /* A 국사 */
		, { key : 'LEFT_NODE_ROLE_NM', 				title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center', width : '90px'} /* 상하위 */
		, { key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '130px', tooltip : tooltipText } /* A장 비 */
		, { key : 'LEFT_PORT_DESCR', 				title : cflineMsgArray['westPort'], align : 'left', width : '80px', tooltip : tooltipText } /* A 포트  */
		, { key : 'LEFT_CHANNEL_DESCR', 			title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
  	];
	
	if(isServiceLine()) {
		baseColumn = baseColumn.concat(
				{ key : 'LEFT_IS_CHANNEL_T1',		title : cflineMsgArray['t1'], align : 'center', width : '45px'
					, render: function(value, data){  
		        		var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
		        		html += (value === true) ? ' checked':'';
		        		html += '">';
		        		html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
		        		html += '/></label>';
		        		return html;
		        	}
				}
		);
	}
	
	baseColumn = baseColumn.concat(
			{ key : 'RIGHT_ORG_NM', 					title : cflineMsgArray['eastMtso'], align : 'center', width : '98px'} /* A 국사 */
			, { key : 'RIGHT_NODE_ROLE_NM', 			title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center', width : '90px'} /* 상하위 */
			, { key : 'RIGHT_NE_NM', 					title : cflineMsgArray['eastEqp'], align : 'left', width : '130px', tooltip : tooltipText } /* A장 비 */
			, { key : 'RIGHT_PORT_DESCR', 				title : cflineMsgArray['eastPort'], align : 'left', width : '80px', tooltip : tooltipText } /* A 포트  */
			, { key : 'RIGHT_CHANNEL_DESCR', 			title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
	);
	
	if(isServiceLine()) {
		baseColumn = baseColumn.concat(
				 { key : 'RIGHT_IS_CHANNEL_T1',	title : cflineMsgArray['t1'], align : 'center', width : '45px'
			        	, render: function(value, data){  
			        		var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
			        		html += (value === true) ? ' checked':'';
			        		html += '">';
			        		html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
			        		html += '/></label>';
			        		return html;
			        	}
			      }
		);
	}
	
	var column = [];
	if(isServiceLine()) {
		column = [
		          /** 2018-09-12  2. RU고도화*/
		          { key : 'SERVICE_MERGE', hidden : true, value : function(value, data) {
						if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] == null && data['RING_ID'] != null) {
							return data['RING_ID'];
						} else if(data['SERVICE_ID'] == null && data['TRUNK_ID'] != null) {
							return data['TRUNK_ID'];
						} else if(data['SERVICE_ID'] != null) {
							return data['SERVICE_ID'];
						} 
					}
				}
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
				/*
		         * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한 경우라면 L2에 해당 데이터가 셋팅된다
		         * 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 
		         * 2차 참조까지의 데이터만 있는경우2차링의 정보를 표시하도록 편집이 필요함
		         */
				, { key : 'RONT_MERGE', hidden : true, value : function(value, data) {
						if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "" ) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}								
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						} 
				    }
			      }	
		        , { key : 'RING_MERGE3', hidden : true, value : function(value, data) {
						if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return nvlStr(data['RING_ID_L2'], data._index.id);
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return nvlStr(data['RING_ID_L3'], data._index.id);
							}
						} 
				     }
		          }	
	            , { key : 'RING_MERGE2', hidden : true, value : function(value, data) {
		            	if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2" || nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							} 
						} 
				    }
		          }	
				, { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
				}
				, { key : 'WDM_TRUNK_NM',	 		title : cflineMsgArray['wdmTrunkName'], align : 'left', width : '120px'
					, inlineStyle: wdmStyleCss
					, rowspan : {by : 'WDM_TRUNK_MERGE'}
				}
				, { key : 'CASCADING_RING_NM_3', 		title : '경유링Lv1 명'    /*경유링 Lv1 명*/ , hidden:true
				    , align : 'left', width : '170px'
					, inlineStyle: ringStyleCss
					, rowspan : {by : 'RING_MERGE3'}
					, value : function(value, data) {							
						var RING_NM_L3 = data['RING_NM_L3'] ;
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'] ;
						}
						return RING_NM_L3;
					}
				}
	            , { key : 'RONT_TRK_NM', 		title : '기간망 트렁크명'   /* 기간망 트렁크명 */, hidden:true
					, width : '170px'
				    , inlineStyle: rontTrkStyleCss
				    , rowspan : {by : 'RONT_MERGE'}
					, value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				  }
				, { key : 'CASCADING_RING_NM_2', 		title : '경유링Lv2 명'    /*경유링Lv2 명*/ , hidden:true
					    , align : 'left', width : '170px'
						, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE2'}
						, value : function(value, data) {								
							var RING_NM_L2 = data['RING_NM_L2'] ;
							// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
							if (nullToEmpty(data['RING_LVL']) == "2") {
								RING_NM_L2 = "" ;
							}
							return RING_NM_L2;
						}
				}
	            /*, { key : 'CASCADING_RING_NM', 		title : '경유링(Cascading)명'    경유링 명 , hidden:true, width : '170px'
				    , inlineStyle: ringStyleCss
				    , rowspan : {by : 'RING_MERGE'}
					, value : function(value, data) {
						var RING_NM = data['RING_NM'] ;
						if (nullToEmpty(data['RING_NM']) != ""
							&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NM']) != ""
								&& nullToEmpty(data['RING_NM_L2']) == "" 
								&& nullToEmpty(data['RING_NM_L3']) == "" ) {
							RING_NM += "[기간망 : " + data['REFC_RONT_TRK_NTWK_LINE_NM'] + "]" ;
						}
						return RING_NM;
					}
				  }*/
				, { key : 'RING_NM', 				title : cflineMsgArray['ringName'], align : 'left', width : '120px'
					, inlineStyle: ringStyleCss
					, rowspan : {by : 'RING_MERGE'}
					
				} /* 링 명 */
				, { key : 'TRUNK_NM', 				title : cflineMsgArray['trunkNm'], align : 'left', width : '140px'
					, inlineStyle: trunkStyleCss
					, rowspan : {by : 'TRUNK_MERGE'}					
				}
				, { key : 'SERVICE_NM', 				title : '경유회선명(Cascading)' /* 서비스회선명 */, align : 'left', width : '140px'
					, inlineStyle: serviceStyleCss
					, rowspan : {by : 'SERVICE_MERGE'}					
				}
		];
	} else if(isTrunk()) {
		column = [
		          { key : 'RING_MERGE', hidden : true, value : function(value, data) {
			        	  if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
			        		  return data._index.id;
			        	  } else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
			        		  return data['WDM_TRUNK_ID'];
			        	  } else if(data['RING_ID'] != null) {
			        		  return data['RING_ID'];
			        	  } 
			          }
		          }
		          /*
			         * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한 경우라면 L2에 해당 데이터가 셋팅된다
			         * 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 
			         * 2차 참조까지의 데이터만 있는경우2차링의 정보를 표시하도록 편집이 필요함
			         */
				, { key : 'RONT_MERGE', hidden : true, value : function(value, data) {
						if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "" ) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}								
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						} 
				    }
			      }	
		        , { key : 'RING_MERGE3', hidden : true, value : function(value, data) {
						if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return nvlStr(data['RING_ID_L2'], data._index.id);
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return nvlStr(data['RING_ID_L3'], data._index.id);
							}
						} 
				     }
		          }	
	            , { key : 'RING_MERGE2', hidden : true, value : function(value, data) {
		            	if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2" || nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							} 
						} 
				    }
		          }	
		          , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
		        	  return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
		          }
		          , { key : 'WDM_TRUNK_NM',	 		title : cflineMsgArray['wdmTrunkName'], align : 'left', width : '120px'
		        	  , inlineStyle: wdmStyleCss
		        	  , rowspan : {by : 'WDM_TRUNK_MERGE'}
		          }
		          , { key : 'CASCADING_RING_NM_3', 		title : '경유링Lv1 명'    /*경유링 Lv1 명*/ , hidden:true
					    , align : 'left', width : '170px'
						, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE3'}
						, value : function(value, data) {							
							var RING_NM_L3 = data['RING_NM_L3'] ;
							if (nullToEmpty(data['RING_LVL']) == "2") {
								RING_NM_L3 = data['RING_NM_L2'] ;
							}
							return RING_NM_L3;
						}
				}
	            , { key : 'RONT_TRK_NM', 		title : '기간망 트렁크명'   /* 기간망 트렁크명 */, hidden:true
					, width : '170px'
				    , inlineStyle: rontTrkStyleCss
				    , rowspan : {by : 'RONT_MERGE'}
					, value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				  }
				, { key : 'CASCADING_RING_NM_2', 		title : '경유링Lv2 명'    /*경유링Lv2 명*/ , hidden:true
					    , align : 'left', width : '170px'
						, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE2'}
						, value : function(value, data) {								
							var RING_NM_L2 = data['RING_NM_L2'] ;
							// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
							if (nullToEmpty(data['RING_LVL']) == "2") {
								RING_NM_L2 = "" ;
							}
							return RING_NM_L2;
						}
					}
		           /* , { key : 'CASCADING_RING_NM', 		title : '경유링(Cascading)명'    경유링 명 , hidden:true, width : '170px'
					    , inlineStyle: ringStyleCss
					    , rowspan : {by : 'RING_MERGE'}
						, value : function(value, data) {
							var RING_NM = data['RING_NM'] ;
							if (nullToEmpty(data['RING_NM']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NM']) != ""
									&& nullToEmpty(data['RING_NM_L2']) == "" 
									&& nullToEmpty(data['RING_NM_L3']) == "" ) {
								RING_NM += "[기간망 : " + data['REFC_RONT_TRK_NTWK_LINE_NM'] + "]" ;
							}
							return RING_NM;
						}
					  }*/
		          , { key : 'RING_NM', 				title : cflineMsgArray['ringName'], align : 'left', width : '120px'
		        	  , inlineStyle: ringStyleCss
		        	  , rowspan : {by : 'RING_MERGE'}
		          
		          } /* 링 명 */
		];
	} else if(isRing()) {
		column = [
		           { key : 'RING_MERGE', hidden : true, value : function(value, data) {
				      	  if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
				    		  return data._index.id;
				    	  } else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
				    		  return data['WDM_TRUNK_ID'];
				    	  } else if(data['RING_ID'] != null) {
				    		  return data['RING_ID'];
				    	  } 
				      }
				  }
	           /*
		         * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한 경우라면 L2에 해당 데이터가 셋팅된다
		         * 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 
		         * 2차 참조까지의 데이터만 있는경우2차링의 정보를 표시하도록 편집이 필요함
		         */
				, { key : 'RONT_MERGE', hidden : true, value : function(value, data) {
						if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "" ) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							}								
						} else if (nullToEmpty(data['RING_ID']) != "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						} 
				    }
			      }	
		        , { key : 'RING_MERGE3', hidden : true, value : function(value, data) {
						if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						} 
				     }
		          }	
	            , { key : 'RING_MERGE2', hidden : true, value : function(value, data) {
		            	if(nullToEmpty(nullToEmpty(data['RING_ID']) == ""  &&  data['RING_ID_L3']) == "" && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if(nullToEmpty(data['RING_ID']) == ""  &&  nullToEmpty(data['RING_ID_L3']) == ""  && nullToEmpty(data['RING_ID_L2']) == "" &&  nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "" && data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if(nullToEmpty(data['RING_ID']) != ""  ) {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2" || nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							} 
						} 
				    }
		          }	 
				
		         , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
		        	  return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
		          }
		          , { key : 'WDM_TRUNK_NM',	 		title : cflineMsgArray['wdmTrunkName'], align : 'left', width : '120px'
		        	  , inlineStyle: wdmStyleCss
		        	  , rowspan : {by : 'WDM_TRUNK_MERGE'}
		          }

		          , { key : 'CASCADING_RING_NM_3', 		title : '경유링Lv1 명'   /* 경유링 명 */, hidden:true, align : 'left', width : '170px'
						, inlineStyle: ringStyleCss
						, rowspan : {by : 'RING_MERGE3'}
						, value : function(value, data) {							
							var RING_NM_L3 = data['RING_NM_L3'] ;
							if (nullToEmpty(data['RING_LVL']) == "2") {
								RING_NM_L3 = data['RING_NM_L2'] ;
							}
							return RING_NM_L3;
						}
					}
		          , { key : 'RONT_TRK_NM', 		title : '기간망 트렁크명'   /* 기간망 트렁크명 */, hidden:true
						, width : '170px'
					    , inlineStyle: rontTrkStyleCss
					    , rowspan : {by : 'RONT_MERGE'}
						, value : function(value, data) {
							return data['REFC_RONT_TRK_NTWK_LINE_NM'];
						}
					  }
					, { key : 'CASCADING_RING_NM_2', 		title : '경유링Lv2명'   /* 경유링 명 */, hidden:true, align : 'left', width : '170px'
							, inlineStyle: ringStyleCss
							, rowspan : {by : 'RING_MERGE2'}
							, value : function(value, data) {								
								var RING_NM_L2 = data['RING_NM_L2'] ;
								// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
								if (nullToEmpty(data['RING_LVL']) == "2") {
									RING_NM_L2 = "" ;
								}
								return RING_NM_L2;
							}
						}
		            , { key : 'CASCADING_RING_NM', 		title : '경유링명'    /*경유링 명*/ , hidden:true, width : '170px'
					    , inlineStyle: ringStyleCss
					    , rowspan : {by : 'RING_MERGE'}
						, value : function(value, data) {
							var RING_NM = data['RING_NM'] ;
							return RING_NM;
						}
					  }
		];
	} else if(isWdmTrunk()) {
		
	}
	
	column = column.concat(baseColumn);
	column = column.concat(addTangoColumn());
	
	
	
	return column;
}

/**
 * 기본적인 필수 컬럼. hidden
 * @returns {Array}
 */
function addTeamsColumn() {
	var addColumn = [
	        { key : 'A_CARD_ID', 						title : 'A_CARD_ID', align : 'left', hidden: true }
	        , { key : 'A_CARD_NM', 						title : 'A_CARD_NM', align : 'left', hidden: true }
	        , { key : 'A_CARD_MODEL_ID', 				title : 'A_CARD_MODEL_ID', align : 'left', hidden: true }
	        , { key : 'A_CARD_MODEL_NM', 				title : 'A_CARD_MODEL_NM', align : 'left', hidden: true }
	        , { key : 'A_CARD_STATUS_CD', 				title : 'A_CARD_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'A_CARD_STATUS_NM', 				title : 'A_CARD_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'A_CHANNEL_IDS', 					title : 'A_CHANNEL_IDS', align : 'left', hidden: true }
	        , { key : 'A_PORT_ID', 						title : 'A_PORT_ID', align : 'left', hidden: true }
	        , { key : 'A_PORT_DUMMY', 					title : 'A_PORT_DUMMY', align : 'left', hidden: true }
	        , { key : 'A_PORT_NM', 						title : 'A_PORT_NM', align : 'left', hidden: true }
	        , { key : 'A_PORT_NULL', 					title : 'A_PORT_NULL', align : 'left', hidden: true }
	        , { key : 'A_PORT_STATUS_CD', 				title : 'A_PORT_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'A_PORT_STATUS_NM', 				title : 'A_PORT_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'A_PORT_USE_TYPE_CD', 			title : 'A_PORT_USE_TYPE_CD', align : 'left', hidden: true }
	        , { key : 'A_PORT_USE_TYPE_NM', 			title : 'A_PORT_USE_TYPE_NM', align : 'left', hidden: true }
	        , { key : 'A_RACK_NO', 						title : 'A_RACK_NO', align : 'left', hidden: true }
	        , { key : 'A_RACK_NM', 						title : 'A_RACK_NM', align : 'left', hidden: true }
	        , { key : 'A_SHELF_NO', 					title : 'A_SHELF_NO', align : 'left', hidden: true }
	        , { key : 'A_SHELF_NM', 					title : 'A_SHELF_NM', align : 'left', hidden: true }
	        , { key : 'A_SLOT_NO', 						title : 'A_SLOT_NO', align : 'left', hidden: true }
	        
	        , { key : 'B_CARD_ID', 						title : 'B_CARD_ID', align : 'left', hidden: true }
	        , { key : 'B_CARD_NM', 						title : 'B_CARD_NM', align : 'left', hidden: true }
	        , { key : 'B_CARD_MODEL_ID', 				title : 'B_CARD_MODEL_ID', align : 'left', hidden: true }
	        , { key : 'B_CARD_MODEL_NM', 				title : 'B_CARD_MODEL_NM', align : 'left', hidden: true }
	        , { key : 'B_CARD_STATUS_CD', 				title : 'B_CARD_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'B_CARD_STATUS_NM', 				title : 'B_CARD_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'B_CHANNEL_IDS', 					title : 'B_CHANNEL_IDS', align : 'left', hidden: true }
	        , { key : 'B_PORT_ID', 						title : 'B_PORT_ID', align : 'left', hidden: true }
	        , { key : 'B_PORT_DUMMY', 					title : 'B_PORT_DUMMY', align : 'left', hidden: true }
	        , { key : 'B_PORT_NM', 						title : 'B_PORT_NM', align : 'left', hidden: true }
	        , { key : 'B_PORT_NULL', 					title : 'B_PORT_NULL', align : 'left', hidden: true }
	        , { key : 'B_PORT_STATUS_CD', 				title : 'B_PORT_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'B_PORT_STATUS_NM', 				title : 'B_PORT_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'B_PORT_USE_TYPE_CD', 			title : 'B_PORT_USE_TYPE_CD', align : 'left', hidden: true }
	        , { key : 'B_PORT_USE_TYPE_NM', 			title : 'B_PORT_USE_TYPE_NM', align : 'left', hidden: true }
	        , { key : 'B_RACK_NO', 						title : 'B_RACK_NO', align : 'left', hidden: true }
	        , { key : 'B_RACK_NM', 						title : 'B_RACK_NM', align : 'left', hidden: true }
	        , { key : 'B_SHELF_NO', 					title : 'B_SHELF_NO', align : 'left', hidden: true }
	        , { key : 'B_SHELF_NM', 					title : 'B_SHELF_NM', align : 'left', hidden: true }
	        , { key : 'B_SLOT_NO', 						title : 'B_SLOT_NO', align : 'left', hidden: true }
	        
	        , { key : 'JRDT_TEAM_ORG_ID', 				title : 'JRDT_TEAM_ORG_ID', align : 'left', hidden: true }
	        , { key : 'JRDT_TEAM_ORG_NM', 				title : 'JRDT_TEAM_ORG_NM', align : 'left', hidden: true }
	        , { key : 'MODEL_ID', 						title : 'MODEL_ID', align : 'left', hidden: true }
	        , { key : 'MODEL_NM', 						title : 'MODEL_NM', align : 'left', hidden: true }
	        , { key : 'MODEL_LCL_CD', 					title : 'MODEL_LCL_CD', align : 'left', hidden: true }
	        , { key : 'MODEL_LCL_NM', 					title : 'MODEL_LCL_NM', align : 'left', hidden: true }
	        , { key : 'MODEL_MCL_CD', 					title : 'MODEL_MCL_CD', align : 'left', hidden: true }
	        , { key : 'MODEL_MCL_NM', 					title : 'MODEL_MCL_NM', align : 'left', hidden: true }
	        , { key : 'MODEL_SCL_CD', 					title : 'MODEL_SCL_CD', align : 'left', hidden: true }
	        , { key : 'MODEL_SCL_NM', 					title : 'MODEL_SCL_NM', align : 'left', hidden: true }
	        
	        , { key : 'NE_ID', 							title : 'NE_ID', align : 'left', hidden: true }
	        , { key : 'NE_DUMMY', 						title : 'NE_DUMMY', align : 'left', hidden: true }
	        , { key : 'NE_NULL', 						title : 'NE_NULL', align : 'left', hidden: true }
	        , { key : 'NE_REMARK', 						title : 'NE_REMARK', align : 'left', hidden: true }
	        , { key : 'NE_ROLE_CD', 					title : 'NE_ROLE_CD', align : 'left', hidden: true }
	        , { key : 'NE_ROLE_NM', 					title : 'NE_ROLE_NM', align : 'left', hidden: true }
	        , { key : 'NE_STATUS_CD', 					title : 'NE_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'NE_STATUS_NM', 					title : 'NE_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'NODE_ROLE_CD', 					title : 'NODE_ROLE_CD', align : 'left', hidden: true }
	        , { key : 'NODE_ROLE_NM', 					title : 'NODE_ROLE_NM', align : 'left', hidden: true }
	        
	        , { key : 'OP_TEAM_ORG_ID', 				title : 'OP_TEAM_ORG_ID', align : 'left', hidden: true }
	        , { key : 'OP_TEAM_ORG_NM', 				title : 'OP_TEAM_ORG_NM', align : 'left', hidden: true }
	        , { key : 'ORG_ID', 						title : 'ORG_ID', align : 'left', hidden: true }
	        , { key : 'ORG_ID_L3', 						title : 'ORG_ID_L3', align : 'left', hidden: true }
	        , { key : 'ORG_NM', 						title : 'ORG_NM', align : 'left', hidden: true }
	        , { key : 'ORG_NM_L3', 						title : 'ORG_NM_L3', align : 'left', hidden: true }
	        , { key : 'VENDOR_ID', 						title : 'VENDOR_ID', align : 'left', hidden: true }
	        , { key : 'VENDOR_NM', 						title : 'VENDOR_NM', align : 'left', hidden: true }
	        

	        , { key : 'SERVICE_ID', 					title : 'SERVICE_ID', align : 'left', hidden: true }
	        , { key : 'SERVICE_PATH_DIRECTION', 		title : 'SERVICE_PATH_DIRECTION', align : 'left', hidden: true }
	        , { key : 'SERVICE_PATH_SAME_NO', 			title : 'SERVICE_PATH_SAME_NO', align : 'left', hidden: true }
	        , { key : 'SERVICE_STATUS_CD', 				title : 'SERVICE_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'SERVICE_STATUS_NM', 				title : 'SERVICE_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'SERVICE_LINE_LARGE_CD', 			title : 'SERVICE_LINE_LARGE_CD', align : 'left', hidden: true }
	        , { key : 'SERVICE_LINE_LARGE_NM', 			title : 'SERVICE_LINE_LARGE_NM', align : 'left', hidden: true }
	        , { key : 'SERVICE_LINE_SMALL_CD', 			title : 'SERVICE_LINE_SMALL_CD', align : 'left', hidden: true }
	        
	        , { key : 'TRUNK_ID', 						title : 'TRUNK_ID', align : 'left', hidden: true }
	        , { key : 'TRUNK_PATH_DIRECTION', 			title : 'TRUNK_PATH_DIRECTION', align : 'left', hidden: true }
	        , { key : 'TRUNK_PATH_SAME_NO', 			title : 'TRUNK_PATH_SAME_NO', align : 'left', hidden: true }
	        , { key : 'TRUNK_STATUS_CD', 				title : 'TRUNK_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'TRUNK_STATUS_NM', 				title : 'TRUNK_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'TRUNK_TOPOLOGY_LARGE_CD', 		title : 'TRUNK_TOPOLOGY_LARGE_CD', align : 'left', hidden: true }
	        , { key : 'TRUNK_TOPOLOGY_LARGE_NM', 		title : 'TRUNK_TOPOLOGY_LARGE_NM', align : 'left', hidden: true }
	        , { key : 'TRUNK_TOPOLOGY_SMALL_CD', 		title : 'TRUNK_TOPOLOGY_SMALL_CD', align : 'left', hidden: true }
	        , { key : 'TRUNK_TOPOLOGY_CFG_MEANS_CD', 		title : 'TRUNK_TOPOLOGY_CFG_MEANS_CD', align : 'left', hidden: true }
	        , { key : 'TRUNK_TOPOLOGY_CFG_MEANS_NM', 		title : 'TRUNK_TOPOLOGY_CFG_MEANS_NM', align : 'left', hidden: true }
	        
	        , { key : 'RING_ID', 						title : 'RING_ID', align : 'left', hidden: true }
	        , { key : 'RING_PATH_DIRECTION', 			title : 'RING_PATH_DIRECTION', align : 'left', hidden: true }
	        , { key : 'RING_PATH_SAME_NO', 				title : 'RING_PATH_SAME_NO', align : 'left', hidden: true }
	        , { key : 'RING_STATUS_CD', 				title : 'RING_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'RING_STATUS_NM', 				title : 'RING_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'RING_TOPOLOGY_LARGE_CD', 		title : 'RING_TOPOLOGY_LARGE_CD', align : 'left', hidden: true }
	        , { key : 'RING_TOPOLOGY_LARGE_NM', 		title : 'RING_TOPOLOGY_LARGE_NM', align : 'left', hidden: true }
	        , { key : 'RING_TOPOLOGY_SMALL_CD', 		title : 'RING_TOPOLOGY_SMALL_CD', align : 'left', hidden: true }
	        , { key : 'RING_TOPOLOGY_CFG_MEANS_CD', 		title : 'RING_TOPOLOGY_CFG_MEANS_CD', align : 'left', hidden: true }
	        , { key : 'RING_TOPOLOGY_CFG_MEANS_NM', 		title : 'RING_TOPOLOGY_CFG_MEANS_NM', align : 'left', hidden: true }
	        
	        , { key : 'WDM_TRUNK_ID', 					title : 'WDM_TRUNK_ID', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_PATH_DIRECTION', 		title : 'WDM_TRUNK_PATH_DIRECTION', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_PATH_SAME_NO', 		title : 'WDM_TRUNK_PATH_SAME_NO', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_STATUS_CD', 			title : 'WDM_TRUNK_STATUS_CD', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_STATUS_NM', 			title : 'WDM_TRUNK_STATUS_NM', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_TOPOLOGY_LARGE_CD', 	title : 'WDM_TRUNK_TOPOLOGY_LARGE_CD', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_TOPOLOGY_LARGE_NM', 	title : 'WDM_TRUNK_TOPOLOGY_LARGE_NM', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_TOPOLOGY_SMALL_CD', 	title : 'WDM_TRUNK_TOPOLOGY_SMALL_CD', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD', 		title : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD', align : 'left', hidden: true }
	        , { key : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_NM', 		title : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_NM', align : 'left', hidden: true }
	];
	
	// ADD_DROP_TYPE_CD, ADD_DROP_TYPE_NM
	return addColumn;
}

function addTangoColumn() {
	var addColumn = [
		    { key : 'LEFT_NE_ID', width : '100px', title : "좌장비", hidden: true }
		    , { key : 'LEFT_NE_REMARK', width : '100px', title : "좌장비", hidden: true }
		    , { key : 'LEFT_NE_ROLE_CD', width : '100px', title : "좌장비", hidden: true}
		    , { key : 'LEFT_NE_DUMMY', width : '100px', title : "좌장비", hidden: true
				, value : function(value, data){
					if(value == "Y") {
						return 'true';
					} else if(value == "N") {
						return 'false';
					} else {
						return value;
					}
				}
		    }
		    , { key : 'LEFT_MODEL_ID', width : '100px', title : "모델", hidden: true}
		    , { key : 'LEFT_MODEL_NM', width : '100px', title : "모델", hidden: true}
			, { key : 'LEFT_PORT_ID', width : '100px', title : "좌포트", hidden: true } 
			, { key : 'LEFT_PORT_NM', width : '100px', title : "좌포트", hidden: true }
			, { key : 'LEFT_RACK_NO', width : '100px', hidden: true }
			, { key : 'LEFT_RACK_NM', width : '100px', hidden: true }
			, { key : 'LEFT_SHELF_NO', width : '100px', hidden: true }
			, { key : 'LEFT_SHELF_NM', width : '100px', hidden: true }
			, { key : 'LEFT_SLOT_NO', width : '100px', hidden: true }
			, { key : 'LEFT_CARD_ID', width : '100px', hidden: true }
			, { key : 'LEFT_CARD_NM', width : '100px', hidden: true }
			, { key : 'LEFT_CARD_STATUS_CD', width : '100px', hidden: true }
			, { key : 'LEFT_PORT_STATUS_CD', width : '100px', hidden: true }
			, { key : 'LEFT_PORT_STATUS_NM', width : '100px', hidden: true }
			, { key : 'LEFT_PORT_DUMMY', width : '100px', hidden: true }
			, { key : 'LEFT_CHANNEL_IDS', width : '100px', hidden: true }
			, { key : 'LEFT_ORG_ID', width : '100px', hidden: true }
			
			, { key : 'RIGHT_NE_ID', width : '100px', title : "우장비", hidden: true }
			, { key : 'RIGHT_NE_REMARK', width : '100px', title : "우장비", hidden: true }
			, { key : 'RIGHT_NE_ROLE_CD', width : '100px', title : "우장비", hidden: true }
			, { key : 'RIGHT_NE_DUMMY', width : '100px', title : "우장비", hidden: true
				, value : function(value, data){
					if(value == "Y") {
						return 'true';
					} else if(value == "N") {
						return 'false';
					} else {
						return value;
					}
				}
			}
			, { key : 'RIGHT_MODEL_ID', width : '100px', title : "모델", hidden: true}
			, { key : 'RIGHT_MODEL_NM', width : '100px', title : "모델", hidden: true}
			, { key : 'RIGHT_PORT_ID', width : '100px', title : "우포트", hidden: true }
			, { key : 'RIGHT_PORT_NM', width : '100px', title : "우포트", hidden: true}
			, { key : 'RIGHT_RACK_NO', width : '100px', hidden: true }
			, { key : 'RIGHT_RACK_NM', width : '100px', hidden: true }
			, { key : 'RIGHT_SHELF_NO', width : '100px', hidden: true }
			, { key : 'RIGHT_SHELF_NM', width : '100px', hidden: true }
			, { key : 'RIGHT_SLOT_NO', width : '100px', hidden: true }
			, { key : 'RIGHT_CARD_ID', width : '100px', hidden: true }
			, { key : 'RIGHT_CARD_NM', width : '100px', hidden: true }
			, { key : 'RIGHT_CARD_STATUS_CD', width : '100px', hidden: true }
			, { key : 'RIGHT_PORT_STATUS_CD', width : '100px', hidden: true }
			, { key : 'RIGHT_PORT_STATUS_NM', width : '100px', hidden: true }
			, { key : 'RIGHT_PORT_DUMMY', width : '100px', hidden: true }
			, { key : 'RIGHT_CHANNEL_IDS', width : '100px', hidden: true }
			, { key : 'RIGHT_ORG_ID', width : '100px', hidden: true }
			
			, { key : 'RX_LINK_ID', title : "RX_LINK_ID", hidden: true }
			, { key : 'RX_LINK_DIRECTION', title : "RX_LINK_DIRECTION", hidden: true }
			, { key : 'LEFT_RX_NE_ID', hidden: true }
			, { key : 'LEFT_RX_NE_NM', hidden: true }
			, { key : 'LEFT_RX_PORT_ID', hidden: true }
			, { key : 'RIGHT_RX_NE_ID', hidden: true}
			, { key : 'RIGHT_RX_NE_NM', hidden: true }
			, { key : 'RIGHT_RX_PORT_ID', hidden: true}
			
	    	, { key : 'LINK_ID', width : '120px', title : "LINK_ID", hidden: true }
		    , { key : 'LINK_SEQ', width : '120px', title : "LINK_SEQ", hidden: true }
		    , { key : 'LINK_DIRECTION', width : '120px', title : "LINK_DIRECTION", hidden: true }
		    , { key : 'LINK_VISIBLE', width : '100px', title : "LINK_VISIBLE",  hidden: true }
		    
		    , { key : 'USE_NETWORK_ID', width : '100px', title : "USE_NTWK_ID", hidden: true}
		    , { key : 'USE_NETWORK_PATH_SAME_NO', width : '100px', title : "USE_NTWK_PATH_SAME_NO", hidden: true}
		    , { key : 'USE_NETWORK_PATH_DIRECTION', width : '140px', title : "USE_NTWK_PATH_DIRECTION", hidden: true}
		    , { key : 'USE_NETWORK_LINK_DIRECTION', width : '140px', title : "USE_NTWK_LINK_DIRECTION", hidden: true}		   
		    , { key : 'USE_NETWORK_LEFT_CHANNEL_DESCR', width : '100px', title : 'USE_NTWK_LEFT_CHANNEL', hidden: true 
		    	, value : function(value, data) { 
	    			if(nullToEmpty(value) =="" ){
						return "";
					} else {
						return value;
					}
	    		}
		    }
		    , { key : 'USE_NETWORK_RIGHT_CHANNEL_DESCR', width : '100px', title : 'RIGHT_NTWK_LEFT_CHANNEL', hidden: true }
		    

		    , { key : 'SERVICE_PATH_DIRECTION', width : '140px', title : "SERVICE_PATH_DIRECTION", hidden: true}
		    , { key : 'SERVICE_PATH_SAME_NO', width : '100px', title : 'SERVICE_PATH_SAME_NO', hidden: true }
		    , { key : 'SERVICE_LINE_LARGE_CD', width : '100px', title : 'SERVICE_LINE_LARGE_CD', hidden: true }
		    , { key : 'SERVICE_LINE_SMALL_CD', width : '100px', title : 'SERVICE_LINE_SMALL_CD', hidden: true }
		    		    
		    , { key : 'TRUNK_PATH_DIRECTION', width : '140px', title : "TRUNK_PATH_DIRECTION", hidden: true}
		    , { key : 'TRUNK_PATH_SAME_NO', width : '100px', title : 'TRUNK_PATH_SAME_NO', hidden: true }
		    , { key : 'TRUNK_TOPOLOGY_LARGE_CD', width : '100px', title : 'TRUNK_TOPOLOGY_LARGE_CD', hidden: true }
		    , { key : 'TRUNK_TOPOLOGY_SMALL_CD', width : '100px', title : 'TRUNK_TOPOLOGY_SMALL_CD', hidden: true }
		    , { key : 'TRUNK_TOPOLOGY_CFG_MEANS_CD', width : '100px', title : 'TRUNK_TOPOLOGY_LARGE_CD', hidden: true }
		    
		    , { key : 'RING_PATH_DIRECTION', width : '140px', title : "RING_PATH_DIRECTION", hidden: true}
		    , { key : 'RING_PATH_SAME_NO', width : '100px', title : 'RING_PATH_SAME_NO', hidden: true }
		    , { key : 'RING_TOPOLOGY_LARGE_CD', width : '100px', title : 'RING_TOPOLOGY_LARGE_CD', hidden: true }
		    , { key : 'RING_TOPOLOGY_SMALL_CD', width : '100px', title : 'RING_TOPOLOGY_SMALL_CD', hidden: true }
		    , { key : 'RING_TOPOLOGY_CFG_MEANS_CD', width : '100px', title : 'RING_TOPOLOGY_CFG_MEANS_CD', hidden: true }
		    
		    , { key : 'WDM_TRUNK_PATH_DIRECTION', width : '140px', title : "WDM_TRUNK_PATH_DIRECTION", hidden: true}
		    , { key : 'WDM_TRUNK_PATH_SAME_NO', width : '100px', title : 'WDM_TRUNK_PATH_SAME_NO', hidden: true }
		    , { key : 'WDM_TRUNK_TOPOLOGY_LARGE_CD', width : '100px', title : 'WDM_TRUNK_TOPOLOGY_LARGE_CD', hidden: true }
		    , { key : 'WDM_TRUNK_TOPOLOGY_SMALL_CD', width : '100px', title : 'WDM_TRUNK_TOPOLOGY_SMALL_CD', hidden: true }
		    , { key : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD', width : '100px', title : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD', hidden: true }
		    
		    , { key : 'LEFT_ADD_DROP_TYPE_CD', title : 'LEFT_ADD', width : '100px', hidden: true}		   
		    , { key : 'RIGHT_ADD_DROP_TYPE_CD', title : 'RIGHT_DROP', width : '100px', hidden: true}
		    
		    , { key : 'RING_TOPOLOGY_LARGE_CD', title : 'RING_TOPOLOGY_LARGE_CD', width : '100px', hidden: true }
		    , { key : 'RING_TOPOLOGY_SMALL_CD', title : 'RING_TOPOLOGY_SMALL_CD', width : '100px', hidden: true }
		    , { key : 'RING_TOPOLOGY_CFG_MEANS_CD', title : 'RING_TOPOLOGY_CFG_MEANS_CD', width : '100px', hidden: true }
	];
	
	return addColumn;
}

/****************************************************************
 * 숨기는 컬럼 정의
 * - 서비스 회선(트렁크, 링, WDM트렁크)		: 숨기는 컬럼
 *    1. 관리그룹(SKT(0001))일 경우		: WDM트렁크
 *    2. RU회선-RU(CMS수집)(003/103)	: 트렁크, WDM트렁크
 *    3. RU회선-광코어(003/101)			: 트렁크, 링, WDM트렁크, 채널  
 *                                       <= 2018-03-06 1. [수정] RU광코어 링/예비선번 사용 : RU광코어 링 추가 가능(채널표시)
 *    4. 가입자망회선(004/ALL)			: 트렁크, WDM트렁크
 *    5. 기지국회선(001/not in(020) )			: WDM트렁크
 *    6. 기지국회선(001/020)			:  트렁크, WDM트렁크
 *    7. 기타회선-WIFI(006/102)		    : 트렁크, 링, WDM트렁크
 *    8. 기타회선-중계기정합장치회선(006/061) : 트렁크, WDM트렁크
 *    9. 기타_DCN회선(006/070) : 트렁크, WDM트렁크
 *    10.기타_RMS회선(006/071) : 트렁크, WDM트렁크
 *    11.기타_IP정류기회선(006/072) : 트렁크, WDM트렁크
 *    12.기타_예비회선(006/106) : 트렁크, WDM트렁크
 *   
 * - 트렁크(링, WDM트렁크)
 * 	  1. 관리그룹(SKT(0001))일 경우		: WDM트렁크
 * 
 * - 링(WDM트렁크)
 *    1. 관리그룹(SKT(0001))일 경우		: WDM트렁크
 *    2. 링-가입자망링(001/031)			: WDM트렁크
 *    3. 경유링 정보 
 *       MESH링(020), SMUX(035), 가입자망(031)	: 표시
 *       Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038) : 표시(2차경유링 표시 체크박스 표시)  
 * 
 ****************************************************************/
function gridHidColSet(gridId) {
	if(isServiceLine()) {
		// 모든 경유링
		if (initParam.mgmtGrpCd == "0001") {
			$('#cascadingRingDisplayCheckbox').show();
			$('#cascadingRingDisplaySprCheckbox').show();
		}
		$('#'+gridId).alopexGrid('hideCol', ['CASCADING_RING_NM']);
		// 관리그룹이 SKT일경우 WDM컬럼 삭제
		if(initParam.mgmtGrpCd == "0001") {
			$('#'+gridId).alopexGrid('hideCol', ['WDM_TRUNK_NM']);
		}
		if(nullToEmpty(initParam.svlnLclCd) == "003" && nullToEmpty(initParam.svlnSclCd) == "103") {
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			
		} 
		// RU회선
		//else if(nullToEmpty(initParam.svlnLclCd) == "003" && (nullToEmpty(initParam.svlnSclCd) == "101")) {
		else if (isRuCoreLine() == true || isRuMatchLine() == true) {	
			if( gridId == tagngoGridId) {
				//$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM', 'LEFT_CHANNEL_DESCR', 'RIGHT_CHANNEL_DESCR']);
				$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM',  'WDM_TRUNK_NM']);
			} else {
				//$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM', 'A_CHANNEL_DESCR', 'B_CHANNEL_DESCR']);
				$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			}

		} else if(nullToEmpty(initParam.svlnLclCd) == "004") {
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			
		} else if(nullToEmpty(initParam.svlnLclCd) == "001") {
			if(initParam.svlnSclCd == '020' ){
				$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			}else{
				$('#'+gridId).alopexGrid('hideCol', ['WDM_TRUNK_NM']);
			}
			
		} else if(nullToEmpty(initParam.svlnLclCd) == "006" && nullToEmpty(initParam.svlnSclCd) == "102") {
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'RING_NM', 'WDM_TRUNK_NM']);
			// 모든경유링
			$('#cascadingRingDisplayCheckbox').hide();
			$('#cascadingRingDisplaySprCheckbox').hide();
		} else if(nullToEmpty(initParam.svlnLclCd) == "006" && (nullToEmpty(initParam.svlnSclCd) == "061")) {
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			
		} else if(nullToEmpty(initParam.svlnLclCd) == "006" && (nullToEmpty(initParam.svlnSclCd) == "070")) {
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			
		} else if(nullToEmpty(initParam.svlnLclCd) == "006" && (nullToEmpty(initParam.svlnSclCd) == "071")) {
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			
		} else if(nullToEmpty(initParam.svlnLclCd) == "006" && (nullToEmpty(initParam.svlnSclCd) == "072")) {
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			
		} else if(nullToEmpty(initParam.svlnLclCd) == "006" && (nullToEmpty(initParam.svlnSclCd) == "106")) {	//기타_예비회선추가 2023-09-19
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
		}


		// RU회선 이외는 모두 서비스회선명이 안보여야 함
		//if((nullToEmpty(initParam.svlnLclCd) == "003" && (nullToEmpty(initParam.svlnSclCd) == "101")) == false) {
		if (isRuCoreLine() == false /*&& isRuMatchLine() == false*/ ) {
			$('#'+gridId).alopexGrid('hideCol', ['SERVICE_NM']);
		}
	} else if( isRing() ) {
		if( initParam.mgmtGrpCd == "0001" ) {
			// SKT링일경우 WDM컬럼 삭제
			$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			
		} else {
			if(nullToEmpty(initParam.topoLclCd) == "001" && nullToEmpty(initParam.topoSclCd) == "031") {
				$('#'+gridId).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
			}
		}
		
		// SKT 경유링 정보
		if (initParam.mgmtGrpCd == "0001") {
			if (isMeshRing(initParam.topoSclCd) == true || isAbleViaRing(initParam.topoSclCd) == true) {
				$('#'+gridId).alopexGrid('showCol', ['CASCADING_RING_NM']);
				// SMUX링 / 가입자망 링 제외
				if (isAbleViaRing(initParam.topoSclCd) == true && initParam.topoSclCd != "035" ) {
					$('#cascadingRingDisplayCheckbox').show();
					$('#cascadingRingDisplaySprCheckbox').show();
				} 
				// MESH링인 경우 기간망 트렁크 정보를 보여줄 체크박스 표시
				if (isMeshRing(initParam.topoSclCd) == true) {
					$('#rontTrunkDisplayCheckbox').show();
					$('#rontTrunkDisplaySprCheckbox').show();
				}
			}
		}
		// SKB
		else if (initParam.mgmtGrpCd == "0002") {
			if (initParam.topoSclCd == '031') {
				// 경유링 명만 표시, 상세 경유링 표시는 숨김.
				$('#'+gridId).alopexGrid('showCol', ['CASCADING_RING_NM']);
			}
		}
	} else if( isTrunk() ) {
		if( initParam.mgmtGrpCd == "0001"  ) {
			// SKT링일경우 WDM컬럼 삭제
			$('#'+gridId).alopexGrid('hideCol', ['WDM_TRUNK_NM']);

			$('#cascadingRingDisplayCheckbox').show();
			$('#cascadingRingDisplaySprCheckbox').show();
			$('#'+gridId).alopexGrid('hideCol', ['CASCADING_RING_NM']);
			
		}
	}

}

function groupingColumnPath() {
	
	var groupingColumn = ['SERVICE_MERGE', 'TRUNK_MERGE', 'RING_MERGE', 'RING_MERGE2', 'RING_MERGE3', 'RONT_MERGE',  'WDM_TRUNK_MERGE'];
	if (isRing() == true) {
		groupingColumn = ['SERVICE_MERGE', 'TRUNK_MERGE', 'RING_MERGE', 'RING_MERGE3', 'RONT_MERGE',  'WDM_TRUNK_MERGE'];
	}
	var grouping = {
			by : groupingColumn, 
			useGrouping:true,
			useGroupRowspan:true,
			useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
			useGroupRearrange : true
	};
	
	return grouping;
}

/**
 * 장비 툴팁
 * @param value
 * @param data
 * @param mapping
 */
function tooltipText(value, data, mapping){
	var str = "삭제된 장비 또는 포트입니다.";
	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if(deletecheck) {
		return str;
	} else {
		if ( mapping.key == 'NE_NM' ) {
			str = '장비ID : ' + nullToEmpty(data.NE_ID) + '\n장비명 : ' + nullToEmpty(data.NE_NM) + '\n장비역할 : ' + nullToEmpty(data.NE_ROLE_NM)
					+ '\n제조사 : ' + nullToEmpty(data.VENDOR_NM)
					+ '\n모델 : ' + nullToEmpty(data.MODEL_NM)
					+ '\n모델(대) : ' + nullToEmpty(data.MODEL_LCL_NM) + '\n모델(중) : ' + nullToEmpty(data.MODEL_MCL_NM)+ '\n모델(소) : ' + nullToEmpty(data.MODEL_SCL_NM)
				 	+ '\n상태 : ' + nullToEmpty(data.NE_STATUS_NM) + '\n국사 : ' + nullToEmpty(data.ORG_NM) + '\n전송실 : ' + nullToEmpty(data.ORG_NM_L3)
				 	+ '\n더미장비 : ' + nullToEmpty(data.NE_DUMMY);
		}
		else if ( mapping.key == 'A_PORT_DESCR' ) {
			//이재락M요청 2025-03-26 상위OLT장비는 포트명에 카드명이 포함되어 화면에 표시된다. 
			if(initParam.mgmtGrpCd == "0002" && nullToEmpty(data.A_CARD_NM) != "") {

				var portNmIndex = data.A_PORT_DESCR.indexOf("/");
				var portNm = "";
				if(portNmIndex > 0) {	// OLT장비 포트인 경우
					portNm = data.A_PORT_DESCR.substr(0, portNmIndex);
				}
				
				str = '포트ID : ' + nullToEmpty(data.A_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(portNm) + '\n카드명 : ' 
						+ nullToEmpty(data.A_CARD_NM) + '\n상태 : '
						+ nullToEmpty(data.A_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.A_PORT_DUMMY);
			} else {
				str = '포트ID : ' + nullToEmpty(data.A_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.A_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.A_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.A_PORT_DUMMY);
			}
		}
		else if ( mapping.key == 'B_PORT_DESCR' ) {
			
			if(initParam.mgmtGrpCd == "0002" && nullToEmpty(data.B_CARD_NM) != "") {

				var portNmIndex = data.B_PORT_DESCR.indexOf("/");
				var portNm = "";
				if(portNmIndex > 0) {	// OLT장비 포트인 경우
					portNm = data.B_PORT_DESCR.substr(0, portNmIndex);
				}
				
				str = '포트ID : ' + nullToEmpty(data.B_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(portNm) + '\n카드명 : ' 
						+ nullToEmpty(data.B_CARD_NM) + '\n상태 : '
						+ nullToEmpty(data.B_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.B_PORT_DUMMY);
			} else {
				str = '포트ID : ' + nullToEmpty(data.B_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.B_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.B_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.B_PORT_DUMMY);
			}
			
		}
		else if( mapping.key == 'LEFT_NE_NM') {
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
			if(initParam.mgmtGrpCd == "0002" && nullToEmpty(data.LEFT_CARD_NM) != "") {

				var portNmIndex = data.LEFT_PORT_DESCR.indexOf("/");
				var portNm = "";
				if(portNmIndex > 0) {	// OLT장비 포트인 경우
					portNm = data.LEFT_PORT_DESCR.substr(0, portNmIndex);
				}
				
				str = '포트ID : ' + nullToEmpty(data.LEFT_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(portNm) + '\n카드명 : ' 
						+ nullToEmpty(data.LEFT_CARD_NM) + '\n상태 : '
						+ nullToEmpty(data.LEFT_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.LEFT_PORT_DUMMY);
			} else {
				str = '포트ID : ' + nullToEmpty(data.LEFT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.LEFT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.LEFT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.LEFT_PORT_DUMMY);	
			}
		}
		else if ( mapping.key == 'RIGHT_PORT_DESCR' ) {
			if(initParam.mgmtGrpCd == "0002" && nullToEmpty(data.RIGHT_CARD_NM) != "") {

				var portNmIndex = data.RIGHT_PORT_DESCR.indexOf("/");
				var portNm = "";
				if(portNmIndex > 0) {	// OLT장비 포트인 경우
					portNm = data.RIGHT_PORT_DESCR.substr(0, portNmIndex);
				}
				
				str = '포트ID : ' + nullToEmpty(data.RIGHT_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(portNm) + '\n카드명 : ' 
						+ nullToEmpty(data.RIGHT_CARD_NM) + '\n상태 : '
						+ nullToEmpty(data.RIGHT_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.RIGHT_PORT_DUMMY);
			} else {
				str = '포트ID : ' + nullToEmpty(data.RIGHT_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.RIGHT_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.RIGHT_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.RIGHT_PORT_DUMMY);
			}
		}
		else {
			str = value;
		}
	}
	return str;
}

/**
 * 삭제 장비 및 포트 체크
 * 
 * @param data
 * @param mapping
 * @returns {Boolean}
 */
function checkDeleteNodeOrPort(data, mapping) {
	var deletecheck = false;
	
	if(data.NE_STATUS_CD == '02' || data.NE_STATUS_CD == '03') {
		deletecheck = true;
	} 
	if(data.A_PORT_STATUS_CD == '0003' || data.A_PORT_STATUS_CD == '0004') {
		deletecheck = true;
	} 
	if(data.B_PORT_STATUS_CD == '0003' || data.B_PORT_STATUS_CD == '0004') {
		deletecheck = true;
	} 
	
	return deletecheck;
}

/**
 * getFiveGPonEqpType
 * 넘겨받은 데이터가 어떤 5G-PON장비타입인지 체크하여 리턴(COT, MRN, CRN, DUH, DUL)
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function getFiveGponEqpType(data, preFix) {
	var result = false;
	// COT
	result = isFiveGponCot(data, preFix);
	if (result == true) return "COT";
	
	// MRN(MAIN_RN)
	result = isFiveGponMrn(data, preFix);
	if (result == true) return "MRN";
		
	// CRN(SUB_RN)
	result = isFiveGponCrn(data, preFix);
	if (result == true) return "CRN";
	
	// DUH(DU)
	result = isFiveGponDuH(data, preFix);
	if (result == true) return "DUH";
	
	// DUL(RU)
	result = isFiveGponDuL(data, preFix);
	if (result == true) return "DUL";
	
	return "";
}

// 2019-02-08  2. 5G-PONU고도화
/**
 * isFiveGponCot
 * 넘겨받은 데이터가 5G-PON COT타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponCot(chkData, preFix) {
	// 5G-PON 2.0
	// 5G-PON 1.0
	 /*
     * 장비모델 ID 값으로 판별
     * DMT0008327   5GPON_COT_쏠리드
     * DMT0008330   5GPON_COT_HFR
     * DMT0008333   5GPON_COT_썬웨이브텍
     * DMT0008336   5GPON_COT_코위버(주)
     * */
    var result = false;
    var val = nullToEmpty(chkData.MODEL_ID);
    
    var chkVal = [];
    if (isEdit() == true && nullToEmpty(baseInfData.fiveGponEqpMdlIdList) != "" && nullToEmpty(baseInfData.fiveGponEqpMdlIdList.cotEqpMdlList) != "") {
    	chkVal = baseInfData.fiveGponEqpMdlIdList.cotEqpMdlList;
    }
    
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i].text) {
            result =  true;
            break;
        }
    }
    
    if (result == true) {
    	return result;
    }
    
    result= isFiveGponOneCot(chkData, preFix);
    return result;
}

/**
 * isFiveGponOneCot
 * 넘겨받은 데이터가 5G-PON 1.0 COT타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponOneCot(chkData, preFix) { 
	// 5G-PON 2.0
	// 5G-PON 1.0
	 /*
     * 장비모델 ID 값으로 판별
     * DMT0008327   5GPON_COT_쏠리드
     * DMT0008330   5GPON_COT_HFR
     * DMT0008333   5GPON_COT_썬웨이브텍
     * DMT0008336   5GPON_COT_코위버(주)
     * */
    var result = false;
    var val = nullToEmpty(chkData.MODEL_ID);
    
    var chkVal = ["DMT0008327", "DMT0008330", "DMT0008333", "DMT0008336"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]) {
            result =  true;
            break;
        }
    }
    return result;
}

/**
 * isFiveGponMrn
 * 넘겨받은 데이터가 5G-PON MRN타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponMrn(chkData, preFix) {
	// 5G-PON 2.0
	var result = false;
    var val = nullToEmpty(chkData.MODEL_ID);
    
    var chkVal = [];
    if (isEdit() == true &&  nullToEmpty(baseInfData.fiveGponEqpMdlIdList) != "" && nullToEmpty(baseInfData.fiveGponEqpMdlIdList.mrnEqpMdlList) != "") {
    	chkVal = baseInfData.fiveGponEqpMdlIdList.mrnEqpMdlList;
    }
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i].text) {
            result =  true;
            break;
        }
    }
    
    if (result == true) {
        return result;
    }
	result = isFiveGponOneMrn(chkData, preFix) ;
	
    return result;
	
}

/**
 * isFiveGponOneMrn
 * 넘겨받은 데이터가 5G-PON 1.0 MRN타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponOneMrn(chkData, preFix) {
	var result = false;
    var val = nullToEmpty(chkData.MODEL_ID);
   
	// 5G-PON 1.0
    var val = nullToEmpty(eval("chkData." + preFix + "_CARD_MODEL_NM"));
    
    chkVal = ["5GPON_MAIN_RN_"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val.indexOf(chkVal[i]) == 0 ) {
            result =  true;
            break;
        }
    }
    return result;
	
}
/**
 * isFiveGponCrn
 * 넘겨받은 데이터가 5G-PON CRN타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponCrn(chkData, preFix) {
	// 5G-PON 2.0
	var result = false;
    var val = nullToEmpty(chkData.MODEL_ID);

    var chkVal = [];
    if (isEdit() == true && nullToEmpty(baseInfData.fiveGponEqpMdlIdList) != "" && nullToEmpty(baseInfData.fiveGponEqpMdlIdList.crnEqpMdlList) != "") {
    	chkVal = baseInfData.fiveGponEqpMdlIdList.crnEqpMdlList;
    }
    
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i].text ) {
            result =  true;
            break;
        }
    }
    
    if (result == true) {
        return result;
    }
    
    result = isFiveGponOneCrn(chkData, preFix);
    return result;
}

/**
 * isFiveGponOneCrn
 * 넘겨받은 데이터가 5G-PON 1.0 CRN타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponOneCrn(chkData, preFix) {
	
	var result = false;
    	
	// 5G-PON 1.0
    var val = nullToEmpty(eval("chkData." + preFix + "_CARD_MODEL_NM"));
    
    chkVal = ["5GPON_SUB_RN_"];
    for (var i = 0 ; i < chkVal.length ; i++) {
    	if (val.indexOf(chkVal[i]) == 0) {
            result =  true;
            break;
        }
    }
    return result;
}

/**
 * isFiveGponDuH
 * 넘겨받은 데이터가 5G-PON DUH타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponDuH(chkData, preFix) {
	// 5G-PON 2.0	
	// 5G-PON 1.0
	
    var result = false;
    var val = nullToEmpty(chkData.NE_ROLE_NM);
    
    var chkVal = ["5G DU-H", "ERP 기지국", "LTE DU"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]  
        && (isFiveGponRuCoreLine() == true && preFix == "A")) {
            result =  true;
            break;
        }
    }
    return result;
}

/**
 * isFiveGponDuL
 * 넘겨받은 데이터가 5G-PON DUL타입장비인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isFiveGponDuL(chkData, preFix) {
	// 5G-PON 2.0	
	// 5G-PON 1.0	
    var result = false;
    var val = nullToEmpty(chkData.NE_ROLE_NM);
    var chkVal = ["5G DU-L", "ERP 광중계기", "광중계기", "MiBOS", "LTE RU"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]   
        && (isFiveGponRuCoreLine() == true && preFix == "A")) {
            result =  true;
            break;
        }
    }
    return result;
}


/**
 * isCmuxRnCard
 * 넘겨받은 데이터가 CMUX 기본형 RN타입 카드인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isCmuxRnCard(chkData, preFix) { 

	/*
     * CM00002952541 (CMUX-R29)
     * CM00002952563 (CMUX-R27)
     */
    var result = false;
    var val = nullToEmpty(chkData);
    
    var chkVal = ["CM00002952541", "CM00002952563"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]) {
            result =  true;
            break;
        }
    }
    return result;
}

/**
 * isCmuxRnExtCard
 * 넘겨받은 데이터가 CMUX 확장형 RN타입 카드인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isCmuxRnExtCard(chkData, preFix) { 

	/*
     * CM00002952542 (CMUX-R29_E) 
     * CM00002952564 (CMUX-R27_E)
     */
    var result = false;
    var val = nullToEmpty(chkData);
    
    var chkVal = ["CM00002952542", "CM00002952564"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]) {
            result =  true;
            break;
        }
    }
    return result;
}


/**
 * isLmuxRnExtCard
 * 넘겨받은 데이터가 CMUX 확장형 RN타입 카드인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isLmuxRnExtCard(chkData, preFix) { 

	/*
     * CM00002952663 (LMUX-R_E) 
     */
    var result = false;
    var val = nullToEmpty(chkData);
    
    var chkVal = ["CM00002952663"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]) {
            result =  true;
            break;
        }
    }
    return result;
}