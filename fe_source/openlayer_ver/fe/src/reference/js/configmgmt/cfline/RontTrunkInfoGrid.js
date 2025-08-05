/**
 * RontTrunkInfoGrid.js
 *
 * @author Administrator
 * @date 2017.02.17.
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2019-12-24  1. [수정] 기간망 고도화 선번 텍스트 입력
 * 2022-04-13  2. [수정] dataGridHola 추가
 */
$a.page(function() { 
	var detailGridId = "pathList"; //주선번 그리드
	var reserveGridId = "reservePathList"; //예비선번 그리드
	
	var gridId = ""; 
	
	this.init = function(id, param) {
		gridId = param.gridId;
		
		initGridNetworkPath(gridId);
		initGridNetworkReservePath(gridId);
		initGridNetworkInfo();
    };
    
	//주선번 Grid 초기화
    function initGridNetworkPath(gridId) {
    	var column = columnMappingNetworkPath(gridId);
    	var groupColumn = groupingColumnNetworkPath();
    	
    	$('#'+detailGridId).alopexGrid({
    		fitTableWidth: true,
    		fillUndefinedKey:null,
    		numberingColumnFromZero: false,
    		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
    		useClassHovering : true,
    		autoResize: true,
    		cellInlineEdit : false,
    		rowInlineEdit: false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		rowspanGroupSelect: true,
    		columnMapping : column,
    		//grouping : groupColumn,
    		defaultSorting : null,
    		heigth : 300,
    		message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"
			}
    	});
    }
    
	//예비선번 Grid 초기화
    function initGridNetworkReservePath(gridId) {
    	var column = columnMappingNetworkPath(gridId);
    	var groupColumn = groupingColumnNetworkPath();
    	
    	$('#'+reserveGridId).alopexGrid({
    		fitTableWidth: true,
    		fillUndefinedKey:null,
    		numberingColumnFromZero: false,
    		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
    		useClassHovering : true,
    		autoResize: true,
    		cellInlineEdit : false,
    		rowInlineEdit: false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		rowspanGroupSelect: true,
    		columnMapping : column,
    		//grouping : groupColumn,
    		defaultSorting : null,
    		heigth : 300,
    		message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"
			}
    	});
    }
    
    
    // 엑셀 다운로드를 위한 기본정보 그리드화
    function initGridNetworkInfo() {
    	$('#'+baseGridId).alopexGrid({
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
    		useClassHovering : true,
    		columnMapping : [{ key : 'ntwkLineNm', title : cflineMsgArray['lnNm']/*회선명*/, align : 'center', width : '300px'}
							, { key : 'ntwkLineNo', title : cflineMsgArray['networkLineNumber']/*네트워크회선번호*/, align : 'center', width : '150px'}
							, { key : 'rontTrkTypNm', title : cflineMsgArray['serviceType']/*서비스유형*/, align : 'left', width : '100px' } 
			]
    	});
    }
    
  
});

function columnMappingNetworkPath(param) {
	var mapping = [];  // 기존
	var mappingNew = [];   // TEXT
	if(param == "dataGrid" || param == "dataGridHola"){
		mapping = [  
		    { key : 'WDM_TRUNK_ID', align : 'center', width : '10px', hidden : true}
		    , { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
				return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
			}
		    , { key : 'SET_ID', title : "PATH ID", align : 'center', width : '100px', hidden : true}
			, { key : 'RONT_SCTN_CL_CD', title : cflineMsgArray['division']/*구분*/, width : '100px', hidden : true}
			, { key : 'RONT_SCTN_CL_NM', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px' }
			, { key : 'WDM_TRUNK_NM', title : cflineMsgArray['trunkNm']/*트렁크명*/, align : 'left', hidden : true, width : '140px'}
			, { key : 'LEFT_NE_ROLE_NM', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '60px' }
			, { key : 'LEFT_JRDT_TEAM_ORG_NM', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' }
			, { key : 'LEFT_VENDOR_NM', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '70px' }
//			, { key : 'LEFT_ORG_NM_L3', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
			, { key : 'LEFT_ORG_NM', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
			, { key : 'LEFT_NE_ID', align : 'center', title : '' /*노드ID*/, hidden : true}
			, { key : 'LEFT_NE_NM', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '120px' }
			, { key : 'LEFT_CARD_MODEL_NM', title : 'Unit', align : 'left', width : '70px' }
			, { key : 'LEFT_SHELF_NM', title : 'Shelf', align : 'left', width : '50px' }
			, { key : 'LEFT_SLOT_NO', title : 'Slot', align : 'left', width : '50px' }
			, { key : 'LEFT_PORT_DESCR', title : 'Port', align : 'left', width : '90px' }
			, { key : 'RIGHT_NE_ID', align : 'center', title : '' /*FDF*/, hidden : true}
			, { key : 'RIGHT_NE_NM', title : 'FDF_OLD', align : 'left', width : '100px', hidden : true}
			, { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['fiberDistributionFramePort'] +'_OLD'/*FDF포트*/, align : 'left', width : '90px' , hidden : true}
			, { key : 'RIGHT_EQP_PORT_REFC_VAL', title : 'FDF'/*FDF포트*/, align : 'left', width : '150px' 
				, value : function(value, data) {
           			return value == null || value == "" ? nullToEmpty(data['RIGHT_NE_NM']) + (nullToEmpty(data['RIGHT_PORT_DESCR']) != "" ? "," : "") + nullToEmpty(data['RIGHT_PORT_DESCR']) : value; }
			  }
	   	  ];
		
		mappingNew = [  
				      { key : 'SET_ID', title : "PATH ID", align : 'center', width : '100px', hidden : true}
					, { key : 'rontSctnClCd', title : cflineMsgArray['division']/*구분*/, width : '100px', hidden : true}
					, { key : 'rontSctnClNm', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px' }
					, { key : 'lftEqpRoleDivNm', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '60px' }
					, { key : 'lftJrdtTeamOrgNm', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' }
					, { key : 'lftVendorNm', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '70px' }
					, { key : 'lftEqpInstlMtsoNm', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '100px' }
					, { key : 'lftEqpNm', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '120px' }
					, { key : 'lftCardMdlNm', title : 'Unit', align : 'left', width : '70px' }
					, { key : 'lftShlfNm', title : 'Shelf', align : 'left', width : '50px' }
					, { key : 'lftSlotNo', title : 'Slot', align : 'left', width : '50px' }
					, { key : 'lftPortNm', title : 'Port', align : 'left', width : '90px' }
					, { key : 'rghtEqpPortRefcVal', title : 'FDF'/*FDF포트*/, align : 'left', width : '150px' }
			   	  ];
	} else {
		// 텍스트 선번
		mappingNew = [
		           	 { key : 'SET_ID', align : 'center', width : '100px', title : "PATH ID", hidden : true}
		           	, { key : 'rontSctnClCd', title : cflineMsgArray['division']/*구분*/, hidden : true}
					, { key : 'IS_SELECT', align : 'center', width : '40px', title : ''
						, defaultValue : 'false'
						, editable : function(value, data){
							var html = '';
		        			if(data['rontSctnClCd']== "013"){
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
						}
					}
					, { key : 'rontSctnClNm', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px' }	
					, { key : 'lftEqpRoleDivNm', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '80px' , editable : { type:'text'}}
					, { key : 'lftJrdtTeamOrgNm', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' , editable : { type:'text'}}
					, { key : 'lftVendorNm', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '80px' , editable : { type:'text'}}
					, { key : 'lftEqpInstlMtsoNm', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '120px' , editable : { type:'text'}}
					, { key : 'lftEqpNm', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '120px', editable : { type:'text'}}
					, { key : 'lftCardMdlNm', title : 'Unit', align : 'left', width : '70px', editable : { type:'text'}}
					, { key : 'lftShlfNm', title : 'Shelf', align : 'left', width : '50px' , editable : { type:'text'}}
					, { key : 'lftSlotNo', title : 'Slot', align : 'left', width : '50px' , editable : { type:'text'}}
					, { key : 'lftPortNm', 	title :'Port', align : 'left', width : '130px', editable:  { type: 'text' }}					
					, { key : 'rghtEqpPortRefcVal', title : 'FDF'/*FDF포트*/, align : 'left', width : '150px' , editable:  { type: 'text' }}
			   	];
		
		mapping = [
		           	  { key : 'WDM_TRUNK_ID', align : 'center', width : '10px', hidden : true}  
		           	, { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
	           			return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
		           	}
		           	, { key : 'SET_ID', align : 'center', width : '100px', title : "PATH ID", hidden : true}
		           	, { key : 'RONT_SCTN_CL_CD', title : cflineMsgArray['division']/*구분*/, hidden : true}
					, { key : 'IS_SELECT', align : 'center', width : '40px', title : ''
						, defaultValue : 'false'
						, editable : function(value, data){
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
						}
					}
					, { key : 'WDM_TRUNK_NM', title : cflineMsgArray['trunkNm']/*트렁크명*/, align : 'left', width : '200px'
						, hidden : true
						, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}
						, inlineStyle: {'white-space' : 'pre-line'}
					  }
					, { key : 'RONT_SCTN_CL_NM', title : cflineMsgArray['division']/*구분*/, align : 'center', width : '140px' }	
					, { key : 'LEFT_NE_ROLE_NM', title : cflineMsgArray['system']/*시스템*/, align : 'center', width : '80px' }
					, { key : 'LEFT_JRDT_TEAM_ORG_NM', title : cflineMsgArray['managementTeam']/*관리팀*/, align : 'left', width : '120px' }
					, { key : 'LEFT_VENDOR_NM', title : cflineMsgArray['vend']/*제조사*/, align : 'center', width : '80px' }
//					, { key : 'LEFT_ORG_NM_L3', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '120px' }
					, { key : 'LEFT_ORG_NM', title : cflineMsgArray['mtso']/*국사*/, align : 'left', width : '120px' }
					, { key : 'LEFT_NE_ID', align : 'center', title : '' /*노드ID*/, hidden : true}
					, { key : 'LEFT_NE_NM', title : cflineMsgArray['nodeName']/*노드명*/, align : 'left', width : '120px', editable : { type:'text'}
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}
					  }
					, { key : 'LEFT_CARD_MODEL_NM', title : 'Unit', align : 'left', width : '70px'}
					, { key : 'LEFT_SHELF_NM', title : 'Shelf', align : 'left', width : '50px' }
					, { key : 'LEFT_SLOT_NO', title : 'Slot', align : 'left', width : '50px' }
					, { key : 'LEFT_PORT_DESCR', 	title :'Port', align : 'left', width : '130px'
        	   			, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}
						, inlineStyle: inlineStyleCss
					  }
					, { key : 'LEFT_EQP_PORT_REFC_VAL', title : 'Port', align : 'left', width : '90px' , hidden : true}
					, { key : 'RIGHT_NE_ID', align : 'center', title : '' /*FDF*/, hidden : true}
					, { key : 'RIGHT_NE_NM', title : 'FDF_OLD', align : 'left', width : '100px', editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}
						, hidden : true
					  }
					, { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['fiberDistributionFramePort']+'_OLD'/*FDF포트*/, align : 'left', width : '130px' 
        	   			, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							return chkAllowEdit(value, data, mapping);
						}
						, inlineStyle: inlineStyleCss
						, hidden : true
					  }
					, { key : 'RIGHT_EQP_PORT_REFC_VAL', title : 'FDF'/*FDF포트*/, align : 'left', width : '150px' , editable:  { type: 'text' }
						, value : function(value, data) {
	           			return value == null || value == "" ? nullToEmpty(data['RIGHT_NE_NM']) + (nullToEmpty(data['RIGHT_PORT_DESCR']) != "" ? "," : "") + nullToEmpty(data['RIGHT_PORT_DESCR']) : value; }
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
								|| data['RONT_SCTN_CL_CD'] == "011" || data['RONT_SCTN_CL_CD'] == "012"){
								return true;
							} else {
								return false;
							}
							
						} 						 
					}
	];
	
	mapping = mapping.concat(addColumn);
	//return mapping;
	return mappingNew;
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

function inlineStyleCss(value, data, mapping){
	var style = { 'text-decoration' : 'line-through', 'color' : 'red' }; 
	 
	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if(deletecheck) {
		return style;
	} else {
		return value;
	}
}

function checkDeleteNodeOrPort(data, mapping) {
	var deletecheck = false;
	// WEST 장비
	if(mapping.key == 'LEFT_NE_NM') {
		if(data.LEFT_NE_STATUS_CD == '02' || data.LEFT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'LEFT_PORT_DESCR') {
		if(data.LEFT_PORT_STATUS_CD == '02' || data.LEFT_PORT_STATUS_CD == '03') {
			deletecheck = true;
		} 
	}
	
	// EAST 장비
	if(mapping.key == 'RIGHT_NE_NM') {
		if(data.RIGHT_NE_STATUS_CD == '02' || data.RIGHT_NE_STATUS_CD == '03') {
			deletecheck = true;
		} 
	} else if(mapping.key == 'RIGHT_PORT_DESCR') {
		if(data.RIGHT_PORT_STATUS_CD == '02' || data.RIGHT_PORT_STATUS_CD == '03') {
			deletecheck = true;
		} 
	}
	return deletecheck;
}

function chkAllowEdit(value, data, mapping){
	var allowEdit = true;
	
	if(mapping.key == "WDM_TRUNK_NM"){
		if(data['WDM_TRUNK_ID'] != null 
			|| data['RONT_SCTN_CL_CD'] != null
			|| (data['LEFT_NE_ID'] !=null && data['LEFT_NE_ID'] !='DV00000000000') 
			|| (data['RIGHT_NE_ID'] !=null && data['LEFT_NE_ID'] !='DV00000000000') )
		{
			allowEdit = false;
		}
	} else {
		if(data['WDM_TRUNK_ID'] != null){
			allowEdit = false;
		}
	}
	
	return allowEdit;
}
