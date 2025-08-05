 
//주선번 Grid 초기화  
function initGridNetworkPath(gridType, gridId) {
	var column = columnMappingNetworkPath(gridType);
	var groupColumn = groupingColumnNetworkPath();	
	
	var tmpEdit = true;
	if (nullToEmpty(gridType) == 'TMP') {
		tmpEdit = false;
	}
	 
	$('#'+gridId).alopexGrid({
		fitTableWidth: true,
		fillUndefinedKey:null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
		useClassHovering : true,
		autoResize: true,
		cellInlineEdit : tmpEdit,
		cellSelectable : false,
		rowInlineEdit: false,
		rowClickSelect : false,
		rowSingleSelect : false,	
		rowspanGroupSelect: true,
		columnMapping : column,
		grouping : groupColumn,
		defaultSorting : null,
		height : (nullToEmpty(gridType).indexOf('TMP') == 0 ? 410 : 480),
		//width : (nullToEmpty(gridType).indexOf('TMP') == 0 ?  740 : 1520),   // 740 : 1520
		message: {
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"
		}

	    , cellSelectable : false
		, enableDefaultContextMenu:false
		, enableContextMenu:true
		, contextMenu : [
						{
							title: cflineMsgArray['lnoSet']+cflineMsgArray['delete'],		 //선번Set 삭제 
						    processor: function(data, $cell, grid) {
						    	deletePathSet(data, $cell, grid);
						    },
						    use: function(data, $cell, grid) {
						    	return false;
						    }
						}	
					   ,{
							title: cflineMsgArray['save'],				// 저장 
						    processor: function(data, $cell, grid) {
						    	savePath();
						    },
						    use: function(data, $cell, grid) {
						    	return (nullToEmpty(gridType).indexOf('TMP') == 0 || gridId == reserveGridId ? false : true);
						    }
					   }
		]
	});
	
	$('#'+gridId).alopexGrid("columnFix", 6);
}
    
// 엑셀 다운로드를 위한 기본정보 그리드화
function initGridNetworkInfo() {
	$('#'+baseGridId).alopexGrid({
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		columnMapping : [{ key : 'ntwkLineNm', title : cflineMsgArray['lnNm']/*회선명*/, align : 'center', width : '300px'}
						, { key : 'ntwkLineNo', title : cflineMsgArray['networkLineNumber']/*네트워크회선번호*/, align : 'center', width : '150px'}
						/*, { key : 'rontTrkTypNm', title : cflineMsgArray['serviceType']서비스유형, align : 'left', width : '100px' } */
		]
	});
}

function columnMappingNetworkPath(gridType) {
	var tmpHidden = false;
	if (nullToEmpty(gridType).indexOf('TMP') == 0) {
		tmpHidden = true;
	}

	var tmpEdit = true;
	if (nullToEmpty(gridType) == 'TMP') {
		tmpEdit = false;
	}
	
	var mapping = [];
	if(gridType == "dataGrid"){
		mapping = [  
		    { key : 'WDM_TRUNK_ID', align : 'center', width : '10px', hidden : true}
		    , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
				return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
			}
		    , { key : 'SET_ID', title : "PATH ID", align : 'center', width : '100px', hidden : true}
			, { key : 'RONT_SCTN_CL_CD', title : cflineMsgArray['division']/*구분*/, width : '100px', hidden : true}
			, { key : 'RONT_SCTN_CL_NM', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px' }
			, { key : 'WDM_TRUNK_NM', title : cflineMsgArray['trunkNm']/*트렁크명*/, align : 'left', hidden : true, width : '140px'}
			, { key : 'LEFT_NE_ROLE_NM', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '60px' , hidden : tmpHidden}
			, { key : 'LEFT_JRDT_TEAM_ORG_NM', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' , hidden : tmpHidden}
			, { key : 'LEFT_VENDOR_NM', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '70px' , hidden : tmpHidden}
//			, { key : 'LEFT_ORG_NM_L3', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
			, { key : 'LEFT_ORG_NM', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
			, { key : 'LEFT_NE_ID', align : 'center', title : '' /*노드ID*/, hidden : true}
			, { key : 'LEFT_NE_NM', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '150px' }
			, { key : 'LEFT_CARD_MODEL_NM', title : 'Unit', align : 'left', width : '70px' }
			, { key : 'LEFT_SHELF_NM', title : 'Shelf', align : 'left', width : '50px' }
			, { key : 'LEFT_SLOT_NO', title : 'Slot', align : 'left', width : '50px' }
			, { key : 'LEFT_PORT_DESCR', title : 'Port', align : 'left', width : '90px' }
			, { key : 'RIGHT_NE_ID', align : 'center', title : '' /*FDF*/, hidden : true}
			, { key : 'RIGHT_NE_NM', title : 'FDF', align : 'left', width : '130px'}
			, { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['fiberDistributionFramePort']/*FDF포트*/, align : 'left', width : '90px' }
	   	];
	} else {
		mapping = [
		           	  { key : 'WDM_TRUNK_ID', align : 'center', width : '10px', hidden : true}  
		           	, { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
	           			return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
		           	}
		           	, { key : 'SET_ID', align : 'center', width : '100px', title : "PATH ID", hidden : true}
		           	, { key : 'RONT_SCTN_CL_CD', title : cflineMsgArray['division']/*구분*/, hidden : true}
					, { key : 'IS_SELECT', align : 'center', width : '40px', title : '', hidden : true//tmpHidden
						//, defaultValue : 'false'
							
						/*, render : function(value, data, render, mapping) {
							var html = '';
		        			if(data['WDM_TRUNK_ID'] == null && data['RONT_SCTN_CL_CD']== "013"){
		        				html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper">';
			        			html += '<input type="checkbox" class="alopexgrid-default-renderer" value= "true"/>';
			        			html += '</label>';
		        			}
		        			else {
		        				html = '<label>';
			        			html += '<input type="hidden" class="alopexgrid-default-renderer" value="false" />';
			        			html += '</label>';
		        			}
		        			return html;
						}
						, editableValue : function(cell, data, render, mapping, grid) {
							return $(cell).finde('input').filter(':checked').val();
						}*/
					}
					, { key : 'WDM_TRUNK_NM', title : cflineMsgArray['trunkNm']/*트렁크명*/, align : 'left', width : '200px'
						, hidden : true
						, editable: { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}
						, inlineStyle: {'white-space' : 'pre-line'}
					  }
					, { key : 'RONT_SCTN_CL_NM', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px' }	
					, { key : 'LEFT_NE_ROLE_NM', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '80px' , hidden : tmpHidden}
					, { key : 'LEFT_JRDT_TEAM_ORG_NM', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' , hidden : tmpHidden}
					, { key : 'LEFT_VENDOR_NM', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '80px' , hidden : tmpHidden}
//					, { key : 'LEFT_ORG_NM_L3', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '120px' }
					, { key : 'LEFT_ORG_NM', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '120px' }
					, { key : 'LEFT_NE_ID', align : 'center', title : '' /*노드ID*/, hidden : true}
					, { key : 'LEFT_NE_NM', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '180px'
						/*, editable : { type:'text'}
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}*/
					  }
					, { key : 'LEFT_CARD_MODEL_NM', title : 'Unit', align : 'left', width : '70px'}
					, { key : 'LEFT_SHELF_NM', title : 'Shelf', align : 'left', width : '50px' }
					, { key : 'LEFT_SLOT_NO', title : 'Slot', align : 'left', width : '50px' }
					, { key : 'LEFT_PORT_DESCR', 	title :'Port', align : 'left', width : '130px'
        	   			/*, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}*/
						, inlineStyle: inlineStyleCss
					  }
					, { key : 'RIGHT_NE_ID', align : 'center', title : '' /*FDF*/, hidden : true}
					, { key : 'RIGHT_NE_NM', title : 'FDF', align : 'left', width : '180px'
						, editable:  { type: 'text' } 
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);   // 선번비교 기존선번은 편집모드가 되지 않기 위해							
						}
					  }
					, { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['fiberDistributionFramePort']/*FDF포트*/, align : 'left', width : '130px' 
        	   			, editable: { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping); 
						}
						, inlineStyle: inlineStyleCss
					  }
			   	];
	}
	
	var addColumn = [
					  { key : 'USE_NETWORK_ID', hidden: true }
					, { key : 'USE_NETWORK_PATH_SAME_NO', hidden: true }
					, { key : 'USE_NETWORK_PATH_DIRECTION', hidden: true }
					, { key : 'USE_NETWORK_LINK_DIRECTION', hidden: true }
					
					, { key : 'WDM_TRUNK_STATUS_CD', hidden: true }
					, { key : 'WDM_TRUNK_PATH_SAME_NO', hidden: true }
					, { key : 'WDM_TRUNK_PATH_GROUP_NO', hidden: true }
					, { key : 'WDM_TRUNK_PATH_DIRECTION', hidden: true }
					, { key : 'WDM_TRUNK_TOPOLOGY_LARGE_CD', hidden: true }
					, { key : 'WDM_TRUNK_TOPOLOGY_SMALL_CD', hidden: true }
					, { key : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD', hidden: true }

					, { key : 'LEFT_NE_DUMMY', hidden: true }
					, { key : 'LEFT_NE_REMARK', hidden: true }
					, { key : 'LEFT_NE_STATUS_CD', hidden: true }
					, { key : 'LEFT_NE_ROLE_CD', hidden: true }
					, { key : 'LEFT_CHANNEL_DESCR', hidden: true }
					, { key : 'LEFT_ADD_DROP_TYPE_CD', hidden: true
						, value : function(value, data){
							if(nullToEmpty(value)== ""){
								return nullToEmpty(data["LEFT_ADD_DROP_TYPE_CD"]) == ""? 'N':data["LEFT_ADD_DROP_TYPE_CD"];
							} else {
								return value;
							}
						}
					}
					, { key : 'LEFT_IS_CHANNEL_T1', hidden: true }
					, { key : 'LEFT_NODE_ROLE_CD', hidden: true, value : 'N' }
					, { key : 'LEFT_PORT_NM', hidden: true }
					, { key : 'LEFT_RACK_NO', hidden: true }
					, { key : 'LEFT_RACK_NM', hidden: true }
					, { key : 'LEFT_SHELF_NO', hidden: true }
					, { key : 'LEFT_CARD_STATUS_CD', hidden: true }
					, { key : 'LEFT_CARD_ID', hidden: true }
					, { key : 'LEFT_CARD_MODEL_ID', hidden: true }
					, { key : 'LEFT_PORT_ID', hidden: true }
					, { key : 'LEFT_PORT_STATUS_CD', hidden: true }
					, { key : 'LEFT_PORT_STATUS_NM', hidden: true }
					, { key : 'LEFT_PORT_DUMMY', hidden: true }
					
					, { key : 'RIGHT_NE_DUMMY', hidden: true }
					, { key : 'RIGHT_NE_REMARK', hidden: true }
					, { key : 'RIGHT_NE_STATUS_CD', hidden: true }
					, { key : 'RIGHT_CHANNEL_DESCR', hidden: true }
					, { key : 'RIGHT_ADD_DROP_TYPE_CD', hidden: true
						, value : function(value, data){
							if(nullToEmpty(value)== ""){
								return nullToEmpty(data["RIGHT_ADD_DROP_TYPE_CD"]) == ""? 'N':data["RIGHT_ADD_DROP_TYPE_CD"];
							} else {
								return value;
							}
						}
					}
					, { key : 'RIGHT_IS_CHANNEL_T1', hidden: true }
					, { key : 'RIGHT_NODE_ROLE_CD', hidden: true, value : 'N' }
					, { key : 'RIGHT_PORT_NM', hidden: true }
					, { key : 'RIGHT_RACK_NO', hidden: true }
					, { key : 'RIGHT_RACK_NM', hidden: true }
					, { key : 'RIGHT_SHELF_NO', hidden: true }
					, { key : 'RIGHT_SHELF_NM', hidden: true }
					, { key : 'RIGHT_SLOT_NO', hidden: true }
					, { key : 'RIGHT_CARD_ID', hidden: true }
					, { key : 'RIGHT_CARD_MODEL_ID', hidden: true }
					, { key : 'RIGHT_CARD_MODEL_NM', hidden: true }
					, { key : 'RIGHT_CARD_STATUS_CD', hidden: true }
					, { key : 'RIGHT_PORT_ID', hidden: true }
					, { key : 'RIGHT_PORT_STATUS_CD', hidden: true }
					, { key : 'RIGHT_PORT_STATUS_NM', hidden: true }
					, { key : 'RIGHT_PORT_DUMMY', hidden: true }
					
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
					
					, { key : 'LINK_SEQ', hidden: true }
					, { key : 'LINK_ID', hidden: true }
					, { key : 'LINK_DIRECTION', hidden: true
						, value : function(value, data){
							if(nullToEmpty(value)==""){
								return nullToEmpty(data["LINK_DIRECTION"]) == ""? "RIGHT":data["LINK_DIRECTION"];
							} else {
								return value;
							}
						} 
					  }
					, { key : 'LINK_STATUS_CD', hidden: true }
					, { key : 'LINK_VISIBLE', hidden: true
						, value : function(value, data){
							if(data['RONT_SCTN_CL_CD'] == "001" || data['RONT_SCTN_CL_CD'] == "002" 
								|| data['RONT_SCTN_CL_CD'] == "014" || data['RONT_SCTN_CL_CD'] == "015"
								|| data['RONT_SCTN_CL_CD'] == "011" || data['RONT_SCTN_CL_CD'] == "012"){
								return true;
							} else {
								return false;
							}
							
						} 						 
					}
	];
	
	mapping = mapping.concat(addColumn);
	return mapping;
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

function tooltipNetworkText(value, data, mapping){

	var str = '';
	if ( mapping.key == 'TRUNK_NM' ) {
//		if ( data.TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//			str = '트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//		} else {
//			str = data.TRUNK_NM;
//		}
		
		str = data.TRUNK_NM;
	}
	else if ( mapping.key == 'RING_NM' ) {
//		if ( data.RING_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//			str = '링 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//		} else {
//			str = data.RING_NM;
//		}
		
		str = data.RING_NM;
	}		
	else if ( mapping.key == 'WDM_TRUNK_NM' ) {
//		if ( data.WDM_TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
//			str = 'WDM 트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
//		} else {
//			str = data.WDM_TRUNK_NM;
//		}
		
		str = data.WDM_TRUNK_NM;
	}

	return str;
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
//			if(mapping.key.indexOf("LEFT") == 0) {
				var indexKey = data.LEFT_ORG_BORDER.replace("leftSame", "") % 3;
				return 'orgBorder'+indexKey;
//				if(mapping.key == "LEFT_ORG_NM") {
//					return 'orgBorder'+indexKey + ' left';
//				} else if(mapping.key == "LEFT_CHANNEL_DESCR"){
//					return 'orgBorder'+indexKey + ' right';
//				} else {
//					return 'orgBorder'+indexKey;
//				}
				
			}
		} 
	}
	
	if(nullToEmpty(data.RIGHT_ORG_BORDER) != "") {
		if(data.RIGHT_ORG_BORDER.indexOf("rightSame") == 0) {
			if(mapping.key == "RIGHT_ORG_NM") {
//			if(mapping.key.indexOf("RIGHT") == 0) {
				var indexKey = data.RIGHT_ORG_BORDER.replace("rightSame", "") % 3;
				return 'orgBorderRght'+indexKey;
//				if(mapping.key == "RIGHT_ORG_NM") {
//					return 'orgBorderRght'+indexKey + ' left';
//				} else if(mapping.key == "RIGHT_CHANNEL_DESCR") {
//					return 'orgBorderRght'+indexKey + ' right';
//				} else {
//					return 'orgBorderRght'+indexKey;
//				}
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

/*
 * Wdm 트렁크 기존 데이터 형태
 */
function oldWdmTrunkPathInitGrid(gridType, gridId) {
	
	var tmpEdit = true;
	var tmpHidden =false;
	if (nullToEmpty(gridType) == 'TMP') {
		tmpEdit = false;
		tmpHidden = true;
	}
	
	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
	
	var mapping = [];
	mapping = mapping.concat(addcolumn());
	
 	var column = [
		           { 	 key : 'WDM_TRUNK_MERGE', hidden : true
		        	   , value : function(value, data) {
									return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; 
							    }
		           }		           
		           , { selectorColumn : true, width : '40px', rowspan : {by : 'WDM_TRUNK_MERGE' } , hidden : tmpHidden}
		           , { dragdropColumn : true, width : '30px', rowspan : {by : 'WDM_TRUNK_MERGE' } , hidden : tmpHidden}
				    , { key : 'WDM_TRUNK_NM'
				        	, title : cflineMsgArray['wdmTrunkName']
				    		, align : 'left', width : '200px'
							, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
								return chkAllowEdit(value, data, mapping, 'old');
							}
				    		, inlineStyle: wdmStyleCss
				    		, tooltip : tooltipNetworkText
							, rowspan : {by : 'WDM_TRUNK_MERGE'}  /* WDM 트렁크 */
							, hidden : true 
					}
				    , { key : 'WDM_TRUNK_ID', 			align : 'center', width : '10px', hidden : true}
				    , { key : leftOrgNm, 				title : cflineMsgArray['westMtso'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss} /* A 국사 */
				    , { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '170px'
							 , editable:  { type: 'text' }
							 , allowEdit : function(value, data, mapping) {
								            	return chkAllowEdit(value, data, mapping, 'old');
								           } 
				    	     , inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss 
				      } /* A장 비 */
				    , { key : 'LEFT_PORT_USE_TYPE_NM',	title : cflineMsgArray['west'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss} /* 좌포트사용용도 */
				    , { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '150px'
		        	   		 , editable:  { type: 'text' }
							 , allowEdit : function(value, data, mapping) {
							 	                return chkAllowEdit(value, data, mapping, 'old');
							               } 
				    	     , styleclass : nodeCopyPasteCss, tooltip : tooltipText 
				      } /* A 포트 */
				    , { key : 'LEFT_CARD_WAVELENGTH',	title : cflineMsgArray['westWavelength'], align : 'center', width : '80px', styleclass : nodeCopyPasteCss} /* 좌파장 */
				    
				    , { key : 'A', 			title : '',  align : 'left', width : '5px'
						, styleclass: 'guard'
						, headerStyleclass : 'guard'
					} 
				    
				    , { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '170px'
		        	   		, editable:  { type: 'text' }
						    , allowEdit : function(value, data, mapping) {
							                 return chkAllowEdit(value, data, mapping, 'old');
						                  }
				    	    , inlineStyle: inlineStyleCss, tooltip : tooltipText, styleclass : nodeCopyPasteCss
				      } /* B 장비 */
				    , { key : 'RIGHT_PORT_USE_TYPE_NM',	title : cflineMsgArray['east'] + cflineMsgArray['useUsageType'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss} /* 우포트사용용도 */
				    , { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '150px'
	        	   			, editable:  { type: 'text' }
							, allowEdit : function(value, data, mapping) {
											return chkAllowEdit(value, data, mapping, 'old');
										  }
				    	    , styleclass : nodeCopyPasteCss, tooltip : tooltipText 
				      } /* B 포트 */
				    , { key : 'RIGHT_CARD_WAVELENGTH',	title : cflineMsgArray['eastWavelength'], align : 'center', width : '80px', styleclass : nodeCopyPasteCss} /* 우파장 */
				    , { key : rightOrgNm, 				title : cflineMsgArray['eastMtso'], align : 'center', width : '130px', styleclass : nodeCopyPasteCss, styleclass : nodeCopyPasteCss } /* B 국사 */ 
			    ];
 	

	mapping = mapping.concat(column);
	
 	$('#'+gridId).alopexGrid({
		fitTableWidth: true,
		fillUndefinedKey : null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		autoResize: true,
		cellInlineEdit : tmpEdit,
		cellSelectable : false,
		rowInlineEdit: false,
		rowClickSelect : false,
		rowSingleSelect : false,
		rowspanGroupSelect: true,
		height : (gridType == "TMP" ? 410 : 480),
		//width : (gridType == "TMP" ? 740 : 1520), //740 : 1520
		enableDefaultContextMenu:false,
		enableContextMenu:true,
		contextMenu : (gridType == "TMP" ? null : contextMenu(gridId)),
		columnMapping : mapping,
    	message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
		}
	});
	
	$('#'+gridId).alopexGrid("updateOption", { fitTableWidth: true });
}

// 추가컬럼
function addcolumn() {
	var mappingAddColumn = [
	    { key : 'LEFT_NE_ID', width : '100px', title : cflineMsgArray['lftEqp']/* 좌장비 */, hidden: true, editable:  { type: 'text'} }
	    , { key : 'LEFT_NE_REMARK', width : '100px', title : cflineMsgArray['lftEqp']/* 좌장비 */, hidden: true }
	    , { key : 'LEFT_NE_ROLE_CD', width : '100px', title : cflineMsgArray['lftEqp']/* 좌장비 */, hidden: true}
	    , { key : 'LEFT_NE_DUMMY', width : '100px', title : cflineMsgArray['lftEqp']/* 좌장비 */, hidden: true
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
		, { key : 'LEFT_PORT_ID', width : '100px', title : cflineMsgArray['lftPort']/* 좌포트 */, hidden: true, editable:  { type: 'text'} } 
		, { key : 'LEFT_PORT_NM', width : '100px', title : cflineMsgArray['lftPort']/* 좌포트 */, hidden: true }
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
		
		, { key : 'RIGHT_NE_ID', width : '100px', title : cflineMsgArray['rghtEqp']/* 우장비 */, hidden: true, editable: { type: 'text'} }
		, { key : 'RIGHT_NE_REMARK', width : '100px', title : cflineMsgArray['rghtEqp']/* 우장비 */, hidden: true }
		, { key : 'RIGHT_NE_ROLE_CD', width : '100px', title : cflineMsgArray['rghtEqp']/* 우장비 */, hidden: true }
		, { key : 'RIGHT_NE_DUMMY', width : '100px', title : cflineMsgArray['rghtEqp']/* 우장비 */, hidden: true
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
		, { key : 'RIGHT_PORT_ID', width : '100px', title : cflineMsgArray['rghtPort']/* 우포트 */, hidden: true, editable: { type: 'text'} }
		, { key : 'RIGHT_PORT_NM', width : '100px', title : cflineMsgArray['rghtPort']/* 우포트 */, hidden: true}
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
		, { key : 'RX_LINK_DIRECTION', title : "RX_LINK_DIRECTION", hidden: true 
//			, value : function(value, data){
//				if(nullToEmpty(value)==""){
//					return nullToEmpty(data["RX_LINK_DIRECTION"]) == ""? "RIGHT":data["RX_LINK_DIRECTION"];
//				} else {
//					return value;
//				}
//			}	
		}
		, { key : 'LEFT_RX_NE_ID', hidden: true }
		, { key : 'LEFT_RX_NE_NM', hidden: true }
		, { key : 'LEFT_RX_PORT_ID', hidden: true }
		, { key : 'RIGHT_RX_NE_ID', hidden: true}
		, { key : 'RIGHT_RX_NE_NM', hidden: true }
		, { key : 'RIGHT_RX_PORT_ID', hidden: true}
		
    	, { key : 'LINK_ID', width : '120px', title : "LINK_ID", hidden: true }
	    , { key : 'LINK_SEQ', width : '120px', title : "LINK_SEQ", hidden: true }
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
	    
	    , { key : 'TRUNK_PATH_DIRECTION', width : '140px', title : "TRUNK_PATH_DIRECTION", hidden: true}
	    , { key : 'TRUNK_PATH_SAME_NO', width : '100px', title : 'TRUNK_PATH_SAME_NO', hidden: true }
	    , { key : 'TRUNK_TOPOLOGY_LARGE_CD', width : '100px', title : 'TRUNK_TOPOLOGY_LARGE_CD', hidden: true }
	    , { key : 'TRUNK_TOPOLOGY_SMALL_CD', width : '100px', title : 'TRUNK_TOPOLOGY_SMALL_CD', hidden: true }
	    , { key : 'TRUNK_TOPOLOGY_CFG_MEANS_CD', width : '100px', title : 'TRUNK_TOPOLOGY_CFG_MEANS_CD', hidden: true }
	    
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
	    
	    // 노드 복사, 잘라내기, 붙여넣기 활용 컬럼
	    , { key : 'LEFT_NE_COPY', title : 'LEFT_NE_COPY', width : '100px', hidden: true}
	    , { key : 'RIGHT_NE_COPY', title : 'RIGHT_NE_COPY', width : '100px', hidden: true}
	    
	    // 동일 국사 테두리 활용 컬럼
	    , { key : 'LEFT_ORG_BORDER', title : 'LEFT_ORG_BORDER', width : '100px', hidden: true}
	    , { key : 'RIGHT_ORG_BORDER', title : 'RIGHT_ORG_BORDER', width : '100px', hidden: true}
	    
	    // 가입자망링 오류 데이터 하이라이트 표시를 위한 컬럼
	    , { key : 'ROW_HIGHLIGHT', title : 'ROW_HIGHLIGHT', width : '100px', hidden: true }
	    
	    , { key : 'RING_TOPOLOGY_LARGE_CD', title : 'RING_TOPOLOGY_LARGE_CD', width : '100px', hidden: true }
	    , { key : 'RING_TOPOLOGY_SMALL_CD', title : 'RING_TOPOLOGY_SMALL_CD', width : '100px', hidden: true }
	    , { key : 'RING_TOPOLOGY_CFG_MEANS_CD', title : 'RING_TOPOLOGY_CFG_MEANS_CD', width : '100px', hidden: true }
	    
	    
	];
	return mappingAddColumn;
}


// 컨텍스트메뉴
function contextMenu(gridId){
	var contextMenu = [
		     {
					title: cflineMsgArray['lineDelete'],		/* 선번 삭제 */
				    processor: function(data, $cell, grid) {
				    	deletePath(gridId);
				    },
				    use: function(data, $cell, grid) {
			    		//ADAMS
				    	if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
	    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
		    				&&
		    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
		    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
		    				) {
		    				return true;
		    			} else {
		    				return false;
		    			}
				    }
			   },
			   {
					title: cflineMsgArray['save'],				/* 저장 */
				    processor: function(data, $cell, grid) {
				    	savePath();
				    },
				    use: function(data, $cell, grid) {
				    	return (gridId == 'old_'+reserveGridId ? false : true);
				    }
			   },
			   {
					title: '빈 ' + cflineMsgArray['sectionInsert'],		/* 구간 삽입 */
				    processor: function(data, $cell, grid) {
				    	setChangedMainPath();
				    	sectionInsert(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
				    		//TODO 이전으로 20240812
				    		//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
				    			return contextMenuYn(gridId);
				    		//}
				    	} else {
				    		return false;
				    	}
				    }
		//		    ,seperator:true
			   },
			   {
					title: cflineMsgArray['sectionMerge'],		/* 구간 병합 */
				    processor: function(data, $cell, grid) {
				    	sectionMerge(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
				    		return contextMenuYn(gridId);
				    	} else {
				    		return false;
				    	}
				    }
			   },
			   {
					title: cflineMsgArray['sectionReverse'],	/* 구간 뒤집기 */
				    processor: function(data, $cell, grid) {
				    	reverseLink(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
				    		//ADAMS
				    		if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
		    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
			    				||
			    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
			    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
			    				) {
					    		return contextMenuYn(gridId);
			    			} else {
			    				return false;
			    			}
				    	} else {
				    		return false;
				    	}
				    }
			   },
			   {
					title: cflineMsgArray['nodeInsert'],		/* 구간 분리 -> 명칭변경 : 노드 삽입 */
				    processor: function(data, $cell, grid) {
				    	sectionSeparation(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
				    		return contextMenuYn(gridId);
				    	} else {
				    		return false;
				    	}
				    }
			   },
			   {
					title: cflineMsgArray['nodeDelete'],		/* 노드 삭제 */
				    processor: function(data, $cell, grid) {
				    	nodeDelete(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
				    		if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "DV00000000000") 
				    				&& (data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "DV00000000000")) {
				    			return false;
				    		} else {
				    			//ADAMS
					    		if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
			    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
				    				||
				    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
				    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
				    				) {
						    		return contextMenuYn(gridId);
				    			} else {
				    				return false;
				    			}
				    		}
				    	} else {
				    		return false;
				    	}
				    }
			   },
			   {
					title: cflineMsgArray['nodeCopy'],		/* 노드 복사 */
				    processor: function(data, $cell, grid) {
				    	nodeCopy(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data._key == "LEFT_NE_NM" || data._key == "RIGHT_NE_NM") {
				    		//ADAMS
				    		if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
		    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
			    				||
			    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
			    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
			    				) {
					    		return contextMenuYn(gridId);
			    			} else {
			    				return false;
			    			}
				    	} else {
				    		return false;
				    	}
				    	
				    }
			   },
			   {
					title: cflineMsgArray['nodeCut'],		/* 노드 잘라내기 */
				    processor: function(data, $cell, grid) {
				    	nodeCut(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data.TRUNK_ID == null && data.RING_ID == null && data.WDM_TRUNK_ID == null) {
					    	if(data._key == "LEFT_NE_NM" || data._key == "RIGHT_NE_NM") {
					    		//ADAMS
					    		if((data.LEFT_NE_ROLE_CD == "11" || data.LEFT_NE_ROLE_CD == "162"
			    					 || data.LEFT_NE_ROLE_CD == "177" || data.LEFT_NE_ROLE_CD == "178" || data.LEFT_NE_ROLE_CD == "182")
				    				||
				    				(data.RIGHT_NE_ROLE_CD == "11" || data.RIGHT_NE_ROLE_CD == "162"
				    					 || data.RIGHT_NE_ROLE_CD == "177" || data.RIGHT_NE_ROLE_CD == "178" || data.RIGHT_NE_ROLE_CD == "182")
				    				) {
						    		return contextMenuYn(gridId);
				    			} else {
				    				return false;
				    			}
					    	} else {
					    		return false;
					    	}
				    	} else {
				    		return false;
				    	}
				    }
			   },
			   {
					title: cflineMsgArray['nodePaste'],		/* 노드 붙여넣기 */
				    processor: function(data, $cell, grid) {
				    	if($("#copyCut").val() == "copy") {
				    		nodeCopyPaste(data, $cell, gridId);
				    	} else if($("#copyCut").val() == "cut") {
				    		nodeCutPaste(data, $cell, gridId);
				    	}
				    	
				    },
				    use: function(data, $cell, grid) {
				    	if($("#copyCut").val() != "") {
				    		return contextMenuYn(gridId);
				    	} else {
				    		return false;
				    	}
				    }
			   },
			   {
					title: cflineMsgArray['cancel'],		/* 취소 */
				    processor: function(data, $cell, grid) {
				    	nodeCopyCutCancle(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if($("#copyCut").val() != "") {
				    		return contextMenuYn(gridId);
				    	} else {
				    		return false;
				    	}
				    }
			   },
			   {
					title: cflineMsgArray['eteApply'],		/* E2E추가 */
				    processor: function(data, $cell, grid) {
				    	e2eApplty(data, $cell, gridId);
				    },
				    use: function(data, $cell, grid) {
				    	if(data._key == 'LEFT_PORT_DESCR') {
				    		if(data.LEFT_PORT_DESCR != null && data.LEFT_PORT_DESCR != "") {
				    			if(data.LEFT_NE_ROLE_CD == '11' || data.LEFT_NE_ROLE_CD == '162' 
									|| data.LEFT_NE_ROLE_CD == '177' || data.LEFT_NE_ROLE_CD == '178' || data.LEFT_NE_ROLE_CD == '182') {  // PBOX 추가  2019-12-24
				    				return true;
				    			} else {
				    				return false;
				    			}
				    		}  else {
				    			return false;
				    		}
				    	} else if(data._key == 'RIGHT_PORT_DESCR') {
				    		if(data.RIGHT_PORT_DESCR != null && data.RIGHT_PORT_DESCR != "") {
				    			if(data.RIGHT_NE_ROLE_CD == '11' || data.RIGHT_NE_ROLE_CD == '162' 
									|| data.RIGHT_NE_ROLE_CD == '177' || data.RIGHT_NE_ROLE_CD == '178' || data.RIGHT_NE_ROLE_CD == '182') { // PBOX 추가  2019-12-24
				    				return true;
				    			} else {
				    				return false;
				    			}
				    		} else {
				    			return false;
				    		}
				    	} else {
				    		return false;
				    	}
				    }
			   }
		];
	
	return contextMenu;
}

/**
 * 컨텍스트메뉴 사용여부
 */
function contextMenuYn(gridId) {
	var dataLength =  $('#'+gridId).alopexGrid("dataGet", { _state : { selected : true }});
	if(dataLength.length > 1) {
		return false;
	} else {
		return true;
	}
}
/*
*//**
 * 선번 삭제
 *//*
function deletePath(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
	var selectCnt = dataList.length;
	var addYn = false;
	
	if(selectCnt <= 0){
		alertBox('I', cflineMsgArray['selectNoData']); 선택된 데이터가 없습니다. 
	} else {
//		$('#'+detailGridId).alopexGrid("showProgress");
		dataDeleteCount = 0;
		for(var i = 0; i < dataList.length; i++ ) {
			var data = dataList[i];    		
			var rowIndex = data._index.data;
			if(nullToEmpty(data.TRUNK_ID) == "" && nullToEmpty(data.WDM_TRUNK_ID) == "" && nullToEmpty(data.RING_ID) == ""
				&& nullToEmpty(data.LEFT_NE_ID) == "" && nullToEmpty(data.RIGHT_NE_ID) == "") {
				addYn = true;
			}
			
			dataDeleteCount++;
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
		}
		
		// 전체를 삭제할 경우 row추가
		var list = $('#'+gridId).alopexGrid("dataGet");
		if(list < 1) {
			addRowNullData(gridId);
			$("#"+gridId).alopexGrid("startEdit");
			//addYn = false;
		}
		else {
			var lastObject = list[list.length-1];
			if(nullToEmpty(lastObject.TRUNK_ID) != "" || nullToEmpty(lastObject.WDM_TRUNK_ID) != "" || nullToEmpty(lastObject.RING_ID) != ""
				|| nullToEmpty(lastObject.LEFT_NE_ID) != "" || nullToEmpty(lastObject.RIGHT_NE_ID) != "") {
			//if(addYn) {
				addRowNullData(gridId);
				$("#"+gridId).alopexGrid("startEdit");
			}
		}
	}
}*/

/** * 
 * 빈 Row 삽입
 */
function addRowNullData(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = currentGridId;
	
	var addData = {};
//	$("#"+gridId).alopexGrid('clearFilter');
	$("#"+gridId).alopexGrid('dataAdd', $.extend({_state:{editing:true}}, addData));
//	$('#'+gridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
	
}

function groupingColumnNetworkPath() {
	var grouping = {
			by : ["WDM_TRUNK_MERGE"]
			,useGrouping:true
			,useGroupRowspan:true
			,useDragDropBetweenGroup:false
			,useGroupRearrange : true
	};
	return grouping;
}

// 삭제되거나 철거된 장비/포트의 셀 표시
function inlineStyleCss(value, data, mapping){
	var style = { 'text-decoration' : 'line-through', 'color' : 'red' }; 
	 
	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if(deletecheck) {
		return style;
	} else {
		//return value;
		
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

// 장비/포트의 상태값을 확인 하여 삭제가 필요한 장비/포트 여부 체크
function checkDeleteNodeOrPort(data, mapping) {
	var deletecheck = false;
	// WEST 장비
	if(mapping.key == 'LEFT_NE_NM') {
		if(data.LEFT_NE_STATUS_CD == '02' || data.LEFT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'LEFT_PORT_DESCR') {
		if(data.LEFT_PORT_STATUS_CD == '0003' || data.LEFT_PORT_STATUS_CD == '0004') {
			deletecheck = true;
		} 
	}
	
	// EAST 장비
	if(mapping.key == 'RIGHT_NE_NM') {
		if(data.RIGHT_NE_STATUS_CD == '02' || data.RIGHT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'RIGHT_PORT_DESCR') {
		if(data.RIGHT_PORT_STATUS_CD == '0003' || data.RIGHT_PORT_STATUS_CD == '0004') {
			deletecheck = true;
		} 
	}
	return deletecheck;
}

// WDM트렁크에서는 장비의 설정에 제약이 없음
function chkAllowEdit(value, data, mapping, wdmDataType){
	var allowEdit = true;
	
	if (nullToEmpty(wdmDataType) == "old") {
		return allowEdit;
	}
	
	/*if(mapping.key == "WDM_TRUNK_NM"){
		if(data['WDM_TRUNK_ID'] != null 
			|| data['RONT_SCTN_CL_CD'] != null
			|| (data['LEFT_NE_ID'] !=null && data['LEFT_NE_ID'] !='DV00000000000') 
			|| (data['RIGHT_NE_ID'] !=null && data['RIGHT_NE_ID'] !='DV00000000000') )
		{
			allowEdit = false;
		}
	} else {
		if(data['WDM_TRUNK_ID'] != null){
			allowEdit = false;
		}
	}*/
	
	if (mapping.key == "RIGHT_NE_NM") {
		if (nullToEmpty(data['LEFT_NE_ID']) == '') {
			allowEdit = false;
		}
	} else if (mapping.key == "RIGHT_PORT_DESCR") {
		if (nullToEmpty(data['LEFT_NE_ID']) == '') {
			allowEdit = false;
		}
	}
	
	return allowEdit;
}
