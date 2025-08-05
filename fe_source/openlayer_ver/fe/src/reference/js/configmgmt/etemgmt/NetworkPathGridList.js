/**
 * 
 */
//var detailGridId = "pathList"; 
var allowYn = true;
var leftOrgNm = "";
var rightOrgNm = "";

$a.page(function() {
	var gridId = "";
	var ntwkLineNo = "";
	
	this.init = function(id, param) {
		gridId = param.gridId;				// 데이터 그리드 OR 작업정보 그리드
		ntwkLineNo = param.ntwkLineNo;
		
		leftOrgNm = "LEFT_ORG_NM";
		rightOrgNm = "RIGHT_ORG_NM";
		// 가입자망 회선, 가입자망링 : 실장국사
		/*// 변경. 모두 실장국사를 표시하도록
		if(gridDivision == "serviceLine") {
			if(nullToEmpty(param.svlnLclCd) == "004" && nullToEmpty(param.svlnSclCd) == "201") {
				leftOrgNm = "LEFT_ORG_NM";
				rightOrgNm = "RIGHT_ORG_NM";
			} else {
				leftOrgNm = "LEFT_ORG_NM_L3";
				rightOrgNm = "RIGHT_ORG_NM_L3";
			}
		} else {
			if(nullToEmpty(param.topoLclCd) == "001" && nullToEmpty(param.topoSclCd) == "031") {
				leftOrgNm = "LEFT_ORG_NM";
				rightOrgNm = "RIGHT_ORG_NM";
			} else {
				leftOrgNm = "LEFT_ORG_NM_L3";
				rightOrgNm = "RIGHT_ORG_NM_L3";
			}
		}
		*/
		initGridNetworkPath(detailGridId);
		initGridNetworkInfo();
	}
	
});


//Grid 초기화
function initGridNetworkPath(detailGridId) {
	var column = columnMappingNetworkPath();
	var groupColumn = groupingColumnNetworkPath();
	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
//	var headerGroup = headerGroupNetworkPath();
	
	$('#'+detailGridId).alopexGrid({
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
//		headerGroup : headerGroup,
		//행처리정의
		rowOption:{
			inlineStyle : {
				color : function(value, data, mapping){
							if(value.CSTR_CD != 'undefined'){									
								return (value.CSTR_CD == null)? '' : 'red';						 
							}
						}
			}
		},
    	message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
		}
	});
	
	$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
}

// 엑셀 다운로드를 위한 기본정보 그리드화
function initGridNetworkInfo() {
	var mapping = [];
	
	if(gridDivision == "trunk" || gridDivision == "ring" || gridDivision == "wdm") {
		var ntwkLineNm = "";
		if(gridDivision == "trunk") ntwkLineNm = "트렁크명";
		else if(gridDivision == "ring") ntwkLineNm = "네트워크(링)명";
		else if(gridDivision == "wdm") ntwkLineNm = "WDM트렁크명";
			
		mapping = [
    	          { key : 'ntwkLineNm', title : ntwkLineNm, align : 'center', width : '300px'}
	  				, { key : 'ntwkLineNo', title : '네트워크ID', align : 'center', width : '150px'}
	  				, { key : 'topoSclNm', title : '망종류', align : 'left', width : '100px' } 
	  				, { key : 'ntwkCapaNm', title : '용량', align : 'left', width : '120px' } 
  			];
	} else {
		mapping = [
	    	          { key : 'lineNm', title : '회선명', align : 'center', width : '300px'}
		  				, { key : 'svlnNo', title : '서비스회선번호', align : 'center', width : '150px'}
		  				, { key : 'svlnLclSclCdNm', title : '서비스회선분류', align : 'left', width : '200px' } 
		  				, { key : 'lineCapaCdNm', title : '용량', align : 'left', width : '120px' } 
	  			];
	}
		
	$('#'+baseGridId).alopexGrid({
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		columnMapping : mapping
	});
}

function columnMappingNetworkPath() {
	var mapping = [];
	
	if(gridDivision == "trunk") {
		mapping = [{ key : 'RING_MERGE', hidden : true, value : function(value, data) {
							if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
								return data._index.id;
							} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
								return data['WDM_TRUNK_ID'];
							} else if(data['RING_ID'] != null) {
								return data['RING_ID'];
							} 
						}
					}
					, { key : 'RING_NM', 						title : cflineMsgArray['ringName'], align : 'left', width : '170px'
								, inlineStyle: ringStyleCss
		 						, rowspan : {by : 'RING_MERGE'}
					  } /* 링 명 */
					, { key : 'RING_ID', 					align : 'center', width : '10px', hidden : true}
					, { key : leftOrgNm, 					title : cflineMsgArray['westMtso'], align : 'center', width : '92px'} /* A 국사 */
					, { key : 'LEFT_NE_NM', 				title : cflineMsgArray['westEqp'], align : 'left', width : '100px' } /* A 장비 */
					, { key : 'LEFT_PORT_DESCR', 			title : cflineMsgArray['westPort'], align : 'left', width : '120px' } /* A 포트 inlineStyle: {color: 'red'} */
					, { key : 'LEFT_CHANNEL_DESCR', 		title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
					, { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '100px'} /* B 장비 */
					, { key : 'RIGHT_PORT_DESCR', 			title : cflineMsgArray['eastPort'], align : 'left', width : '120px' } /* B 포트 */
					, { key : 'RIGHT_CHANNEL_DESCR', 		title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* B 포트 */
					, { key : rightOrgNm, 					title : cflineMsgArray['eastMtso'], align : 'center', width : '92px' } /* B 국사 */
//					, { key : 'WDM_ROW_FILTER', hidden: true }
			        , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
			        , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
			        , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
			        , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
				  ];
	} else if(gridDivision == "ring") {
		mapping = [{ key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
					}
		            , { key : 'WDM_TRUNK_NM'
			            	, title : cflineMsgArray['wdmTrunkName']
		            		, align : 'left', width : '170px'
							, inlineStyle: wdmStyleCss
							, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
					}
		            , { key : 'WDM_TRUNK_ID', 				align : 'center', width : '10px', hidden : true}
		            , { key : leftOrgNm, 					title : cflineMsgArray['westMtso'], align : 'center', width : '110px'} /* A 국사 */
		            , { key : 'LEFT_NODE_ROLE_NM', 			title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
		            , { key : 'LEFT_NE_NM', 				title : cflineMsgArray['westEqp'], align : 'left', width : '180px' 
//		            		, inlineStyle: {
//		            				'text-decoration-line' : 'line-through'
//		            		}
		            } /* A장 비 */
		            , { key : 'LEFT_PORT_DESCR', 			title : cflineMsgArray['westPort'], align : 'left', width : '120px' } /* A 포트 inlineStyle: {color: 'red'} */
		            , { key : 'LEFT_CHANNEL_DESCR', 		title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
		            , { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '180px'} /* B 장비 */
		            , { key : 'RIGHT_PORT_DESCR', 			title : cflineMsgArray['eastPort'], align : 'left', width : '120px' } /* B 포트 */
		            , { key : 'RIGHT_CHANNEL_DESCR', 		title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* B 채널 */
		            , { key : 'RIGHT_NODE_ROLE_NM', 		title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
		            , { key : rightOrgNm, 					title : cflineMsgArray['eastMtso'], align : 'center', width : '110px' } /* B 국사 */
		            , { key : 'WDM_ROW_FILTER', hidden: true } 
			        , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
			        , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
			        , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
			        , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
		      ];
	} else if(gridDivision == "wdm") {
		mapping = [{ key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
					}
			        , { key : 'WDM_TRUNK_NM'
			            	, title : cflineMsgArray['wdmTrunkName']
			        		, align : 'left', width : '200px'
			        		, inlineStyle: wdmStyleCss
							, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
							, hidden : true 
					}
			        , { key : 'WDM_TRUNK_ID', 			align : 'center', width : '10px', hidden : true}
			        , { key : leftOrgNm, 				title : cflineMsgArray['westMtso'], align : 'center', width : '130px'} /* A 국사 */
			        , { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '170px' } /* A장 비 */
			        , { key : 'LEFT_CARD_WAVELENGTH',	title : cflineMsgArray['westWavelength'], align : 'center', width : '80px'} /* 좌파장 */
			        , { key : 'LEFT_PORT_USE_TYPE_NM',	title : cflineMsgArray['west'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px'} /* 좌포트사용용도 */
			        , { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '150px' } /* A 포트 inlineStyle: {color: 'red'} */
			        , { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '170px'} /* B 장비 */
			        , { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '150px' } /* B 포트 */
			        , { key : 'RIGHT_PORT_USE_TYPE_NM',	title : cflineMsgArray['east'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px'} /* 우포트사용용도 */
			        , { key : 'RIGHT_CARD_WAVELENGTH',	title : cflineMsgArray['eastWavelength'], align : 'center', width : '80px'} /* 우파장 */
			        , { key : rightOrgNm, 				title : cflineMsgArray['eastMtso'], align : 'center', width : '130px' } /* B 국사 */ 
			        , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
			        , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
			        , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
			        , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
        ];
	} else {
		mapping = [{ key : 'TRUNK_MERGE', hidden : true, value : function(value, data) {
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
					, { key : 'TRUNK_NM', 				title : cflineMsgArray['trunkNm'], align : 'left', width : '140px'
							, inlineStyle: trunkStyleCss
							, rowspan : {by : 'TRUNK_MERGE'}  /* 트렁크 */							
					}
					, { key : 'TRUNK_ID', 				title : cflineMsgArray['trunkNm'], align : 'center', width : '10px', hidden : true}
					, { key : 'RING_NM', 				title : cflineMsgArray['ringName'], align : 'left', width : '120px'
							, inlineStyle: ringStyleCss
							, rowspan : {by : 'RING_MERGE'}  /* 링 */
						
						} /* 링 명 */
					, { key : 'RING_ID', 				title : cflineMsgArray['ringName'], align : 'center', width : '10px', hidden : true}
			        , { key : 'WDM_TRUNK_NM',	 		title : cflineMsgArray['wdmTrunkName'], align : 'left', width : '120px'
			        		, inlineStyle: wdmStyleCss
							, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
					}
			        , { key : 'WDM_TRUNK_ID', 			title : cflineMsgArray['wdmTrunkName'], align : 'center', width : '10px', hidden : true}
			        , { key : leftOrgNm, 				title : cflineMsgArray['westMtso'], align : 'center', width : '98px'} /* A 국사 */
			        , { key : 'LEFT_NODE_ROLE_NM', 		title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
			        , { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '130px', inlineStyle: inlineStyleCss, tooltip : tooltipText } /* A장 비 */
			        , { key : 'LEFT_IS_CHANNEL_T1',		title : cflineMsgArray['t1'], align : 'center', width : '45px'
			        		, render: function(value, data){  
			        			var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
			        			html += (value === true) ? ' checked':'';
			        			html += '">';
			        			html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
			        			html += '/></label>';
			        			return html;
			        		}
			        }	                	
			        , { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '80px', inlineStyle: inlineStyleCss, tooltip : tooltipText } /* A 포트  */
			        , { key : 'LEFT_CHANNEL_DESCR', 	title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* A 채널 */
			        , { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '130px', inlineStyle: inlineStyleCss, tooltip : tooltipText} /* B 장비 */
			        , { key : 'RIGHT_IS_CHANNEL_T1',	title : cflineMsgArray['t1'], align : 'center', width : '45px'
				        	, render: function(value, data){  
			        			var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
			        			html += (value === true) ? ' checked':'';
			        			html += '">';
			        			html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
			        			html += '/></label>';
			        			return html;
			        		}
			        }
			        , { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '80px', inlineStyle: inlineStyleCss, tooltip : tooltipText } /* B 포트 */
			        , { key : 'RIGHT_CHANNEL_DESCR', 	title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px' } /* B 채널 */
			        , { key : 'RIGHT_NODE_ROLE_NM', 	title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center', width : '90px' } /* 상하위 */
			        , { key : rightOrgNm, 				title : cflineMsgArray['eastMtso'], align : 'center', width : '98px' } /* B 국사 */
//			        , { key : 'TRUNK_ROW_FILTER', hidden: true}
//			        , { key : 'WDM_ROW_FILTER', hidden: true}
			        , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
			        , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
			        , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
			        , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
        ];
	}
	
	mapping = mapping.concat(addcolumn());
	return mapping;
}

function columnMappingNetworkPathEdit() {
	var mapping = [];
	var mappingCol = [];
	mapping = mapping.concat(addcolumn());
	
	if(gridDivision == "trunk") {
		mappingCol = [{ key : 'RING_MERGE', hidden : true, value : function(value, data) {
							if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
								return data._index.id;
							} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
								return data['WDM_TRUNK_ID'];
							} else if(data['RING_ID'] != null) {
								return data['RING_ID'];
							}
						}
			        }
					, { selectorColumn : true, width : '40px', rowspan : {by : 'RING_MERGE' } }
			        , { dragdropColumn : true, width : '30px', rowspan : {by : 'RING_MERGE' } }
					, { key : 'RING_NM', 				title : cflineMsgArray['ringName'], align : 'left', width : '138px'
							, editable:  { type: 'text'}
							, inlineStyle: ringStyleCss
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'trunk');
							}
							, rowspan : {by : 'RING_MERGE'} 
						}
			           , { key : leftOrgNm, 						title : cflineMsgArray['westMtso'], align : 'center', width : '100px'} /* A 국사 */
			           , { key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '190px'
			        	   		, editable:  { type: 'text' }
								, allowEdit : function(value, data, mapping) {
									if(data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') {
										return true;
									} else {
										return chkAllowEdit(value, data, mapping, 'trunk');
									}
								}
								, inlineStyle: inlineStyleCss
								, tooltip : tooltipText
			              } /* A 장비 */
			           , { key : 'LEFT_PORT_DESCR', 			title : cflineMsgArray['westPort'], align : 'left', width : '100px'
				        	   	, editable:  { type: 'text' }
								, allowEdit : function(value, data, mapping) {
									if( (data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') 
											|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')  ) {
						 				return true;
									} else {
										return chkAllowEdit(value, data, mapping, 'trunk');
									}
								}
								, inlineStyle: inlineStyleCss
			        	   		, tooltip : tooltipText
			           } /* A 포트 */
			           , { key : 'LEFT_CHANNEL_DESCR', 	title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px'
		        	   			, editable:  { type: 'text' }
								, allowEdit : function(value, data, mapping) {
									return chkAllowEditChannel(value, data, mapping);
								}
								, styleclass : function(value, data, mapping) {
									var useChannelDescr = data['USE_NETWORK_LEFT_CHANNEL_DESCR'];
									var channelDescr = data['LEFT_CHANNEL_DESCR'];
									if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
										return 'channelDescrCss';
									} else {
										return '';
									}
								}
			        	 } /* A 채널 */
			           , { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '190px'
		        	   		, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								if(data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N') {
					 				return true;
								} else {
									return chkAllowEdit(value, data, mapping, 'trunk');
								}
							}
							, inlineStyle: inlineStyleCss
							, tooltip : tooltipText
		        	  } /* B 장비 */
			           , { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['eastPort'], align : 'left', width : '100px'
			        	   		, editable:  { type: 'text' }
		          				, allowEdit : function(value, data, mapping) {
		          					if( (data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') 
											|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')  ) {
						 				return true;
									} else {
										return chkAllowEdit(value, data, mapping, 'trunk');
									}
		          				}
		          				, inlineStyle: inlineStyleCss
			        	   		, tooltip : tooltipText
			              } /* B 포트 */
			           , { key : 'RIGHT_CHANNEL_DESCR', 	title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px'
		           				, editable:  { type: 'text' }
		           				, allowEdit : function(value, data, mapping) {
		           					return chkAllowEditChannel(value, data, mapping);
		           				}
		           				, styleclass : function(value, data, mapping) {
									var useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
									var channelDescr = data['RIGHT_CHANNEL_DESCR'];
									if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
										return 'channelDescrCss';
									} else {
										return '';
									}
								}
			              } /* B 채널 */
			           , { key : rightOrgNm, 			title : cflineMsgArray['eastMtso'], align : 'center', width : '100px' } /* B 국사 */
//			           , { key : 'WDM_ROW_FILTER', hidden: true }
				        , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
				        , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
				        , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
				        , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
			];
	} else if(gridDivision == "ring") {
		mappingCol = [
		           { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
		        	   return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
		           }
		           , { selectorColumn : true, width : '40px', rowspan : {by : 'WDM_TRUNK_MERGE' } }
		           , { dragdropColumn : true, width : '30px', rowspan : {by : 'WDM_TRUNK_MERGE' } }
		           , { key : 'WDM_TRUNK_NM'
			        	    , title : cflineMsgArray['wdmTrunkName']
		           			, align : 'left', width : '138px'
							, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
							, inlineStyle: wdmStyleCss
							, rowspan : {by : 'WDM_TRUNK_MERGE'}
		           	  }
		           , { key : leftOrgNm, 						title : cflineMsgArray['westMtso'], align : 'center', width : '100px'} /* A 국사 */
		           , { key : 'LEFT_NODE_ROLE_CD', 				title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center', width : '100px'
		        	   		, render : function(value, data){ return data.LEFT_NODE_ROLE_NM;}
		      	    		, editable:{
			      	    		type:"select", 
			      	    		rule : function(value, data){
			      	    			return westNodeRole;
			      	    		}, attr : {
			      	    			style : "width: 83px;min-width:83px;padding: 2px 2px;"
		  			 			}
			      	    	}
					 		, editedValue : function (cell) {
					 			return $(cell).find('select option').filter(':selected').val();
					 		}
					 		, allowEdit : function(value, data, mapping) {
					 			return chkAllowEdit(value, data, mapping, 'ring');
							}
		           } /* 상하위 */
		           , { key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '180px'
		        	   		, editable:  { 
		        	   			type: 'text'
		        	   		}
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
							, inlineStyle: inlineStyleCss
							, tooltip : tooltipText
		              } /* A 장비 */
		           , { key : 'LEFT_PORT_DESCR', 	title : cflineMsgArray['westPort'], align : 'left', width : '100px'
		        	   		, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
							, inlineStyle: inlineStyleCss
							, tooltip : tooltipText
		              } /* A 포트 */
		           , { key : 'LEFT_CHANNEL_DESCR', 	title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px'
				        	, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEditChannel(value, data, mapping);
							}
							, styleclass : function(value, data, mapping) {
								var useChannelDescr = data['USE_NETWORK_LEFT_CHANNEL_DESCR'];
								var channelDescr = data['LEFT_CHANNEL_DESCR'];
								if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
									return 'channelDescrCss';
								} else {
									return '';
								}
							}
		           	  } /* A 채널 */
		           , { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '180px'
	        	   		, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping, 'ring');
						}
						, inlineStyle: inlineStyleCss
						, tooltip : tooltipText
	        	   } /* B 장비 */
		           , { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['eastPort'], align : 'left', width : '100px'
	        	   			, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
	        	   			, inlineStyle: inlineStyleCss
	        	   			, tooltip : tooltipText
		              } /* B 포트 */
		           , { key : 'RIGHT_CHANNEL_DESCR', 	title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px'
	        	   			, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEditChannel(value, data, mapping);
							}
							, styleclass : function(value, data, mapping) {
								var useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
								var channelDescr = data['RIGHT_CHANNEL_DESCR'];
								if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
									return 'channelDescrCss';
								} else {
									return '';
								}
							}
		              } /* B 채널 */
		           
		           , { key : 'RIGHT_NODE_ROLE_CD', 			title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center', width : '100px'
				        	, render : function(value, data){ return data.RIGHT_NODE_ROLE_NM;}
		     	    		, editable:{
			      	    		type:"select", 
			      	    		rule : function(value, data){
			      	    			return eastNodeRole;
			      	    		}, attr : {
			      	    			style : "width: 83px;min-width:83px;padding: 2px 2px;"
		 			 			}
			      	    	}
					 		, editedValue : function (cell) {
					 			return $(cell).find('select option').filter(':selected').val();
					 		}
					 		, allowEdit : function(value, data, mapping) {
					 			return chkAllowEdit(value, data, mapping, 'ring');
							}
		        	   } /* 상하위 */
		           , { key : rightOrgNm, 			title : cflineMsgArray['eastMtso'], align : 'center', width : '100px' } /* B 국사 */
		           , { key : 'WDM_ROW_FILTER', hidden: true } 
			       , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
			       , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
			       , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
			       , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
		   ];
	} else if(gridDivision == "wdm") {
		mappingCol = [
					{ key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
			        	   return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
		             }
		           , { selectorColumn : true, width : '40px', rowspan : {by : 'WDM_TRUNK_MERGE' } }
		           , { dragdropColumn : true, width : '30px', rowspan : {by : 'WDM_TRUNK_MERGE' } }
		           , { key : 'WDM_TRUNK_NM'
			        	    , title : cflineMsgArray['wdmTrunkName']
		           			, align : 'left', width : '138px'
							, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
							, inlineStyle: wdmStyleCss
							, rowspan : {by : 'WDM_TRUNK_MERGE'}
							, hidden : true 
		           	 }
		           , { key : leftOrgNm, 						title : cflineMsgArray['westMtso'], align : 'center', width : '120px'} /* A 국사 */
		           , { key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '190px'
		        	   		, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
							, inlineStyle: inlineStyleCss
							, tooltip : tooltipText
		              } /* A 장비 */
		           , { key : 'LEFT_CARD_WAVELENGTH',		title : cflineMsgArray['westWavelength'], align : 'center', width : '80px'} /* 좌파장 */
		           , { key : 'LEFT_PORT_USE_TYPE_NM',		title : cflineMsgArray['west'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px' } /* 좌포트사용용도 */
		           , { key : 'LEFT_PORT_DESCR', 	title : cflineMsgArray['westPort'], align : 'left', width : '130px'
	        	   			, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
							, inlineStyle: inlineStyleCss
	        	   			, tooltip : tooltipText
		        	 } /* A 포트 */
		           , { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '190px'
	        	   		, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping, 'ring');
						}
						, inlineStyle: inlineStyleCss
						, tooltip : tooltipText
	        	    } /* B 장비 */
		           , { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['eastPort'], align : 'left', width : '130px'
	        	   			, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'ring');
							}
			        	   	, inlineStyle: inlineStyleCss
	       	   				, tooltip : tooltipText
		              } /* B 포트 */
		           , { key : 'LEFT_PORT_USE_TYPE_NM',	title : cflineMsgArray['east'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px' } /* 우포트사용용도 */
		           , { key : 'RIGHT_CARD_WAVELENGTH',		title : cflineMsgArray['eastWavelength'], align : 'center', width : '80px'} /* 우파장 */
		           
		           , { key : rightOrgNm, 			title : cflineMsgArray['eastMtso'], align : 'center', width : '120px' } /* B 국사 */
			       , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
			       , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
			       , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
			       , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
		   ];
	} else {
		mappingCol = [	{ key : 'TRUNK_MERGE', hidden : true, value : function(value, data) {
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
						   return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; 
						}
					}
					, { selectorColumn : true, width : '40px', rowspan : {by : 'TRUNK_MERGE' } }
			        , { dragdropColumn : true, width : '30px', rowspan : {by : 'TRUNK_MERGE' } }
			        , { key : 'TRUNK_NM', 				title : cflineMsgArray['trunkNm'], align : 'left', width : '110px'
							, editable:  { type: 'text' }
			        		, inlineStyle: trunkStyleCss
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'serviceLine');
							}
							, rowspan : {by : 'TRUNK_MERGE'}
					}
			        , { key : 'TRUNK_ID', width : '120px', title : "TRUNK_ID", hidden: true }
			        , { key : 'RING_NM', title : cflineMsgArray['ringName'], align : 'left', width : '138px'
							, editable:  { type: 'text'}
			        		, inlineStyle: ringStyleCss
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'serviceLine');
							}
							, rowspan : {by : 'RING_MERGE'} 
						}
			        , { key : 'RING_ID', width : '120px', title : "RING_ID", hidden: true }
					, { key : 'WDM_TRUNK_NM'
								, title : cflineMsgArray['wdmTrunkName']
								, align : 'left', width : '138px'
								, editable:  { type: 'text' }
								, allowEdit : function(value, data, mapping) {
									return chkAllowEdit(value, data, mapping, 'serviceLine');
								}
								, inlineStyle: wdmStyleCss
								, rowspan : {by : 'WDM_TRUNK_MERGE'} 
						 }
					, { key : 'WDM_TRUNK_ID', width : '120px', title : "WDM_TRUNK_ID", hidden: true }
		            , { key : leftOrgNm, title : cflineMsgArray['westMtso'], align : 'center', width : '100px'} /* A 국사 */
		            , { key : 'LEFT_NODE_ROLE_CD', title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center'//, width : '100px' 
				        	   	, render : function(value, data){  return data.LEFT_NODE_ROLE_NM; }
			      	    		, editable:{
				      	    		type:"select", 
				      	    		rule : function(value, data){
				      	    			return westNodeRole;
				      	    		}, attr : {
				      	    			style : "width: 83px;min-width:83px;padding: 2px 2px;"
			  			 			}
				      	    	}
						 		, editedValue : function (cell) {
						 			return $(cell).find('select option').filter(':selected').val();
						 		}
						 		, allowEdit : function(value, data, mapping) {
						 			if(data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') {
						 				if(nullToEmpty(data['TRUNK_ID']) == "" || (data['TRUNK_ID'].indexOf('alopex') == 0)) {
						 					return true;
						 				} else {
						 					return false;
						 				}
									} else {
										return chkAllowEdit(value, data, mapping, 'serviceLine');
									}
								}
		        	   } /* 상하위 */
		           , { key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '190px'
		        	   		, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								if(data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') {
									if(nullToEmpty(data['TRUNK_ID']) == "" || (data['TRUNK_ID'].indexOf('alopex') == 0) ) {
					 					return true;
					 				} else {
					 					return false;
					 				}
								} else {
									return chkAllowEdit(value, data, mapping, 'serviceLine');
								}
							}
							, inlineStyle: inlineStyleCss
							, tooltip : tooltipText
		              } /* A 장비 */
		           , { key : 'LEFT_IS_CHANNEL_T1',			title : cflineMsgArray['t1'], align : 'center', width : '45px'
		        	   		, render : {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
//		        	   		, render: function(value, data){  return data.LEFT_IS_CHANNEL_T1; }
			           		, editable: {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
			           		, editedValue: function (cell) {
			           			return $(cell).find('input').is(':checked') ? true:false;
			           		}
			           		, allowEdit : function(value, data, mapping) {
								return chkAllowEditChannel(value, data, mapping);
							}
		           }
		           , { key : 'LEFT_PORT_DESCR', 	title : cflineMsgArray['westPort'], align : 'left', width : '100px' 
	        	   			, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								if( (data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') 
										|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')  ) {
									if(nullToEmpty(data['TRUNK_ID']) == "" || (data['TRUNK_ID'].indexOf('alopex') == 0)) {
										if(nullToEmpty(data['LEFT_PORT_DESCR']) != '') {
											return false;
										} else {
											return true;
										}
					 				} else {
					 					return false;
					 				}
								} else {
									return chkAllowEdit(value, data, mapping, 'serviceLine');
								}
							}
							, inlineStyle: inlineStyleCss
	       	   				, tooltip : tooltipText
		              } /* A 포트 */
		           , { key : 'LEFT_CHANNEL_DESCR', 	title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px'
	        	   			, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEditChannel(value, data, mapping);
							}
							, styleclass : function(value, data, mapping) {
								var useChannelDescr = data['USE_NETWORK_LEFT_CHANNEL_DESCR'];
								var channelDescr = data['LEFT_CHANNEL_DESCR'];
								if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
									return 'channelDescrCss';
								} else {
									return '';
								}
							}
		        	 } /* A 채널 */
		           , { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '190px'
	        	   		, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							if(data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N') {
								if(nullToEmpty(data['TRUNK_ID']) == "" || (data['TRUNK_ID'].indexOf('alopex') == 0)) {
				 					return true;
				 				} else {
				 					return false;
				 				}
							} else {
								return chkAllowEdit(value, data, mapping, 'serviceLine');
							}
						}
						, inlineStyle: inlineStyleCss
						, tooltip : tooltipText
	        	  } /* B 장비 */
		           , { key : 'RIGHT_IS_CHANNEL_T1',			title : cflineMsgArray['t1'], align : 'center', width : '45px'
		           			, render : {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
		           			, editable: {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
		               		, editedValue: function (cell) {
		               			return $(cell).find('input').is(':checked') ? true:false;
		               		}
		               		, allowEdit : function(value, data, mapping) {
								return chkAllowEditChannel(value, data, mapping);
							}
		           }
		           , { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['eastPort'], align : 'left', width : '100px'
	        	   			, editable:  { type: 'text' }
	          				, allowEdit : function(value, data, mapping) {
	          					if( (data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') 
										|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')  ) {
	          						if(nullToEmpty(data['TRUNK_ID']) == "" || (data['TRUNK_ID'].indexOf('alopex') == 0)) {
	          							if(nullToEmpty(data['RIGHT_PORT_DESCR']) != '') {
											return false;
										} else {
											return true;
										}
					 				} else {
					 					return false;
					 				}
								} else {
									return chkAllowEdit(value, data, mapping, 'serviceLine');
								}
	          				}
	          				, inlineStyle: inlineStyleCss
	       	   				, tooltip : tooltipText
		              } /* B 포트 */
		           , { key : 'RIGHT_CHANNEL_DESCR', 	title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px'
	           				, editable:  { type: 'text' }
	           				, allowEdit : function(value, data, mapping) {
	           					return chkAllowEditChannel(value, data, mapping);
	           				}
	           				, styleclass : function(value, data, mapping) {
								var useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
								var channelDescr = data['RIGHT_CHANNEL_DESCR'];
								if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
									return 'channelDescrCss';
								} else {
									return '';
								}
							}
		              } /* B 채널 */
		           , { key : 'RIGHT_NODE_ROLE_CD', 			title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center'//, width : '100px' 
	        	   			, render : function(value, data){ return data.RIGHT_NODE_ROLE_NM;}
		     	    		, editable:{
			      	    		type:"select", 
			      	    		rule : function(value, data){
			      	    			return eastNodeRole;
			      	    		}, attr : {
			      	    			style : "width: 83px;min-width:83px;padding: 2px 2px;"
		 			 			}
			      	    	}
					 		, editedValue : function (cell) {
					 			return $(cell).find('select option').filter(':selected').val();
					 		}
					 		, allowEdit : function(value, data, mapping) {
					 			if(data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N') {
					 				if(nullToEmpty(data['TRUNK_ID']) == "" || (data['TRUNK_ID'].indexOf('alopex') == 0) ) {
					 					return true;
					 				} else {
					 					return false;
					 				}
								} else {
									return chkAllowEdit(value, data, mapping, 'serviceLine');
								}
							}
		        	   } /* 상하위 */
		           , { key : rightOrgNm, 			title : cflineMsgArray['eastMtso'], align : 'center', width : '100px' } /* B 국사 */
//		           , { key : 'TRUNK_ROW_FILTER', hidden: true}
//		           , { key : 'WDM_ROW_FILTER', hidden: true}
			        , { key : 'CSTR_CD', 				title : cflineMsgArray['cstrCd'], align : 'center', width : '120px' } /* 공사코드 */
			        , { key : 'CSTR_NM', 				title : cflineMsgArray['cstrNm'], align : 'center', width : '160px' } /* 공사명 */
			        , { key : 'SCTN_LAST_CHG_DATE', 				title : cflineMsgArray['sectionLastChangeDate'], align : 'center', width : '120px' } /* 구간최종변경일자 */
			        , { key : 'SCTN_LAST_CHG_USER_ID', 				title : cflineMsgArray['sectionLastChangeUserIdentification'], align : 'center', width : '150px' } /* 구간최종변경사용자ID */
			];
	}

	mapping = mapping.concat(mappingCol);
	return mapping;
}

function addcolumn() {
	var mappingAddColumn = [
	    { key : 'LEFT_NE_ID', width : '100px', title : "좌장비", hidden: true }
	    , { key : 'LEFT_NE_REMARK', width : '100px', title : "좌장비", hidden: true }
	    , { key : 'LEFT_NE_ROLE_CD', width : '100px', title : "좌장비", hidden: true}
	    , { key : 'LEFT_MODEL_ID', width : '100px', title : "모델", hidden: true}
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
		, { key : 'RIGHT_MODEL_ID', width : '100px', title : "모델", hidden: true}
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
		
		, { key : 'RX_LINK_ID', hidden: true }
		, { key : 'RX_LINK_DIRECTION', hidden: true 
			, value : function(value, data){
				if(nullToEmpty(value)==""){
					return nullToEmpty(data["RX_LINK_DIRECTION"]) == ""? "RIGHT":data["RX_LINK_DIRECTION"];
				} else {
					return value;
				}
			}	
		}
		, { key : 'LEFT_RX_NE_ID', hidden: true }
		, { key : 'LEFT_RX_NE_NM', hidden: true }
		, { key : 'LEFT_RX_PORT_ID', hidden: true }
		, { key : 'RIGHT_RX_NE_ID', hidden: true}
		, { key : 'RIGHT_RX_NE_NM', hidden: true }
		, { key : 'RIGHT_RX_PORT_ID', hidden: true}
		
    	, { key : 'LINK_ID', width : '120px', title : "LINK_ID", hidden: true }
	    , { key : 'LINK_SEQ', width : '120px', title : "LINK_SEQ", hidden: true  }
	    , { key : 'LINK_DIRECTION', width : '120px', title : "LINK_DIRECTION", hidden: true
//	    		, value : function(value, data) { 
//	    			if(nullToEmpty(value)==""){
//						return nullToEmpty(data["LINK_ID"]) == ""? "RIGHT":data["LINK_DIRECTION"];
//					} else {
//						return value;
//					}
//	    		}
	    	}
	    , { key : 'LINK_VISIBLE', width : '100px', title : "LINK_VISIBLE",  hidden: true
//		    	, value : function(value, data) { 
//	    			if(nullToEmpty(value) != "") return value;
//	    			else if(nullToEmpty(data["LINK_VISIBLE"]) != "") return data["LINK_VISIBLE"]; 
//	    			else return true;
//	    		}
		    }
	    
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
	    
	    , { key : 'LEFT_ADD_DROP_TYPE_CD', title : 'LEFT_ADD', width : '100px', hidden: true}		   
	    , { key : 'RIGHT_ADD_DROP_TYPE_CD', title : 'RIGHT_DROP', width : '100px', hidden: true}		   
	];
	return mappingAddColumn;
}

function chkAllowEdit(value, data, mapping, division) {
	if(division === 'ring') {
		allowYn = (data['WDM_TRUNK_MERGE'] == data['WDM_TRUNK_ID']) ? false : true;
	} else if(division == 'trunk') {
		allowYn = (data['RING_MERGE'] === data['RING_ID']) ? false : true;
	} else if(division === 'serviceLine') {
		if(data['TRUNK_MERGE'] === data['TRUNK_ID'] || data['TRUNK_MERGE'] === data['RING_ID'] || data['TRUNK_MERGE'] === data['WDM_TRUNK_ID']) {
			allowYn = false;
		} else {
			if(mapping.key == 'TRUNK_NM' || mapping.key == 'WDM_TRUNK_NM' || mapping.key == 'RING_NM') {
				if((data['LEFT_NE_ID'] != null && data['LEFT_NE_ID'] != 'DV00000000000' )|| (data['RIGHT_NE_ID'] != null && data['RIGHT_NE_ID'] != 'DV00000000000')) {
					allowYn = false;
				} else {
					allowYn = true;
				}
			} else {
				allowYn = true;
			}
		}
	} 
	return allowYn;
}

/**
 * 
 * @param value
 * @param data
 * @param mapping
 * @returns {Boolean}
 * 
 * 11			FDF
 * 162			QDF
 * 177			OFD
 * 178			IJP
 * 182          PBOX
 */
function chkAllowEditChannel(value, data, mapping) {
	// PBOX 추가  2019-12-24
	if(mapping.key == "LEFT_CHANNEL_DESCR") {
		if(data['LEFT_NE_ROLE_CD'] == '11' || data['LEFT_NE_ROLE_CD'] == '162' || data['LEFT_NE_ROLE_CD'] == '177' || data['LEFT_NE_ROLE_CD'] == '178' || data['LEFT_NE_ROLE_CD'] == '182') return false; 
	} else if(mapping.key == "RIGHT_CHANNEL_DESCR") {
		if(data['RIGHT_NE_ROLE_CD'] == '11' || data['RIGHT_NE_ROLE_CD'] == '162' || data['RIGHT_NE_ROLE_CD'] == '177' || data['RIGHT_NE_ROLE_CD'] == '178' || data['RIGHT_NE_ROLE_CD'] == '182') return false;
	} else {
		return true;
	}
	
	return true;
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


function trunkStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
//		style['background-color'] = '#FFB8AF';
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
			'background-color' : '#FFEA75'
		};
		
		if(mapping.key == 'LEFT_NE_NAME') {
			if(data.LEFT_NE_DUMMY) return style;
			else return '';
		} else if(mapping.key == 'RIGHT_NE_NAME') {
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
