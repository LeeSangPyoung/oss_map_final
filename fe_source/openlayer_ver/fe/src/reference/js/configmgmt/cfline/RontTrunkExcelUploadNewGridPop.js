/**
 * RontTrunkExcelUploadNewGridPop.js
 *
 * @author Administrator
 * @date 2020.01.02.
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2019-12-26  1. [신규] 기간망 고도화 EAST FDF장비/포트 텍스트 입력 엑셀업로드
 */
var excelFileGridId = 'excelFileGridId';
var excelUploadGrid = 'excelUploadGrid';
                  
$a.page(function() {
    this.init = function() {
    	renderExcelGrid(excelFileGridId, 0, false, "B");
    	renderExcelGrid(excelUploadGrid, 0, false, "B");
    };
});


function initFileGridInfo(xlsWorkObjVal) {
	var column = getColumnMapping(excelFileGridId, xlsWorkObjVal);    
	$('#'+excelFileGridId).alopexGrid({
    	pager : true,
    	autoColumnIndex: true,
		autoResize: true,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
		rowClickSelect : true,
		rowSingleSelect : false,
		numberingColumnFromZero: false,
		defaultColumnMapping:{sorting: true},
		columnMapping:column,
		height : "13row",
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" },
	
		enableDefaultContextMenu:false,
		enableContextMenu:true,
	}); 
}

function initExcelGridInfo(xlsWorkObjVal) {
	var column = getColumnMapping(excelUploadGrid, xlsWorkObjVal);
	var headerGroup = getHeaderGroup(excelUploadGrid, xlsWorkObjVal);
    
	$('#'+excelUploadGrid).alopexGrid({
    	pager : true,
    	autoColumnIndex: true,
		autoResize: true,
		cellSelectable : false,
		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
		rowClickSelect : true,
		rowInlineEdit : true,
		rowSingleSelect : false,
		numberingColumnFromZero: false,
		defaultColumnMapping:{sorting: true},
		columnMapping:column,
		height : "12row",
		headerGroup:headerGroup,
		message: { nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>" },
		enableDefaultContextMenu:false,
		enableContextMenu:true,
		
	}); 
}

function getColumnMapping(param, xlsWorkObjVal){
	var testHidden = true;
	var column = [];
	
	if(param == excelFileGridId){
	    var  mainColumn= [
	                      	  {selectorColumn : true, width : '50px' } 
	                      	, {key : 'check'		, title : cflineMsgArray['number']/* 번호*/, align:'right', width:'30px',numberingColumn : true}
							, {key : 'fileName'	      ,title : "파일명"        	  ,align:'left', width: '250px'}
							, {key : 'excelUploadJobNo',	title : "파일키", align:'left', width: '100px'  }
							, {key : 'frstRegUserId',	title : "등록자ID", align:'left', width: '100px'  }
							, {key : 'frstRegDate',	title : "등록일자", align:'center', width: '110px'  }
				      	    , {key : 'mgmtGrpCdNm',	title : cflineMsgArray['managementGroup'] /*관리그룹*/, align:'center', width: '70px'  }
				      	    , {key : 'xlsWorkObjVal',	title : "정보타입", align:'center', width: '120px'  }
				      	    , {key : 'excelCnt',	title : "총건수", align:'right', width: '80px', render: {type:"string", rule : "comma"}  }
				      	    , {key : 'procCnt',	title : "처리건수", align:'right', width: '80px', render: {type:"string", rule : "comma"}}
				      	    , {key : 'noneProcCnt',	title : "미처리건수", align:'right', width: '80px' , render: {type:"string", rule : "comma"} }
				      	    , {key : 'okCnt',	title : "성공건수", align:'right', width: '80px'  , render: {type:"string", rule : "comma"} ,hidden : true}
				      	    , {key : 'ngCnt',	title : "Data Not OK", align:'right', width: '80px' , render: {type:"string", rule : "comma"} }
				      	    , {key : 'okChkDataCnt',	title : "Data OK", align:'right', width: '80px', render: {type:"string", rule : "comma"}  }
	          	        ];
	    column = column.concat(mainColumn);
	    
	}else{
	    var infoColumn = [
	             /* {selectorColumn : true, width : '50px' } ,*/
	              {key : 'check'		, title : cflineMsgArray['number'] /*번호*/, align:'right', width:'40px',numberingColumn : true}
	            , {key : 'procYn'		, title : "처리여부", align:'center', width:'60px'}
				, {key : 'procRsltCtt'	, title : "처리결과", align:'left', width:'150px'
					   , tooltip : tooltipProcRsultTextOfBase
					   , inlineStyle: function(value, data, mapping) {
		 				   return columnHeaderStyle("", data, mapping);
		 			    }
				       , render : function(value) {
				    	   return renderingProcRsltCtt(value);
				       }
				  }
				, {key : 'workDivVal'	, title : "작업구분", align:'center', width:'60px'
						, editable:  { type: 'text'}
		 			    , inlineStyle: function(value, data, mapping) {
		 				   return columnHeaderStyle("REQ", data, mapping);
		 			    }
						, tooltip : tooltipProcRsultTextOfBase
				  }
				, {key : 'uprMtsoNm'	, title : cflineMsgArray['section']+'S' /* 구간S */, align:'left', width: '110px'}
				, {key : 'lowMtsoNm'	, title : cflineMsgArray['section']+'E' /* 구간E */, align:'left'	, width: '110px'}
	    		, {key : 'ntwkLineNm'	, title : cflineMsgArray['lnNm']/*회선명*/, align:'left', width:'280px'
	    			  , editable:  { type: 'text'}
		 			  , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("REQ", data, mapping);
		 			  }
					  , tooltip : tooltipProcRsultTextOfBase
	    	      }
	    		, {key : 'rontTrkTypNm'	, title : cflineMsgArray['serviceType'] /*서비스유형*/, align:'left', width:'100px'
	    			  , editable:  { type: 'text'}
	 			  	  , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("REQ", data, mapping);
		 			  }
					  , tooltip : tooltipProcRsultTextOfBase
	    	      }
	    		, {key : 'wdmChnlVal'	, title : cflineMsgArray['channel']/*채널*/, align:'left'	, width: '100px'
	    			  , editable:  { type: 'text'}
		 			  , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("CHO", data, mapping);
		 			  }
					  , tooltip : tooltipProcRsultTextOfBase
	    	      }
	    		, {key : 'wdmWavlVal'	, title : cflineMsgArray['wavelength']/*파장*/, align:'left', width: '100px'
	    			  , editable:  { type: 'text'}
		 			  , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("CHO", data, mapping);
		 			  }
                    , tooltip : tooltipProcRsultTextOfBase
	    	      }
	    		, {key : 'rontTrkCapaTypNm'	, title : cflineMsgArray['lineType'] /*회선유형*/, align:'left', width: '80px'
	    			  , editable:  { type: 'text'}
		 			  , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("REQ", data, mapping);
		 			  }
                    , tooltip : tooltipProcRsultTextOfBase
	    	      }
	    		, {key : 'protModeTypNm', title : cflineMsgArray['protectionMode'] /*보호모드*/, align:'left', width:'80px'
	    			  , editable:  { type: 'text'}
		 			  , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("REQ", data, mapping);
		 			  }
                    , tooltip : tooltipProcRsultTextOfBase
	    	      }   
	    		, {key : 'rontTrkLineRmk'	, title : cflineMsgArray['lineIdentification'] /* 회선ID */, align:'center', width: '100px'
	    			   , editable:  { type: 'text'}
	    			   , inlineStyle: function(value, data, mapping) {
	    				  return columnHeaderStyle("CHO", data, mapping);
	    			   }
						, tooltip : tooltipProcRsultTextOfBase
	    		  }
				, {key : 'ntwkLineNo'	, title : cflineMsgArray['networkLineNumber']/*네트워크회선번호*/, align:'center', width: '120px'
						, editable:  { type: 'text'}
		 			    , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("REQ", data, mapping);
		 			    }
						, tooltip : tooltipProcRsultTextOfBase
				  }	 
				/*, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus'] '회선상태'         	  ,align:'center', width: '100px'}
	    		, {key : 'rontTrkUseYn'	, title : cflineMsgArray['useExistenceAndNonexistence']  사용유무 , align:'center', width: '120px'
	    			  , editable:  { type: 'text'}
		 			  , inlineStyle: function(value, data, mapping) {
		 				  return columnHeaderStyle("CHO", data, mapping);
		 			  }
                      , tooltip : tooltipProcRsultTextOfBase
	    	      }
	    		, {key : 'lineAppltNo'	, title : cflineMsgArray['lineApplicationNumber']회선청약번호, align:'center', width: '120px'}    
	    		, {key : 'useRingNtwkLineNos'	, title : "경유PTP링", align:'center', width: '200px'}  // // 경유PTP링*/	  
      ];
	    
	    column = column.concat(infoColumn);
	    
	    if(xlsWorkObjVal == "A"){
	    	column.push({key : 'wkSprDivCdNm'		, title : '주예비구분', align:'center'	, width: '80px'
				    		, editable:  { type: 'text'}
						    , inlineStyle: function(value, data, mapping) {
							   return columnHeaderStyle("REQ", data, mapping);
						     }
		                    , tooltip : tooltipProcRsultTextOfLno		                    
	    		        }
	    	           );
			var rontSctnClCd = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012"];
			
			for(var colNum = 0; colNum < rontSctnClCd.length; colNum++){
				if (rontSctnClCd[colNum] != "003" && rontSctnClCd[colNum] != "004" && rontSctnClCd[colNum] != "009" && rontSctnClCd[colNum] != "010") {
					column.push({key : rontSctnClCd[colNum]+'lftEqpRoleDivNm'		, title : cflineMsgArray['system']/* 시스템 */, align:'center'	, width: '100px'
				    			  , editable:  { type: 'text'}
					 			  , inlineStyle: function(value, data, mapping) {
					 				  return columnHeaderStyle("", data, mapping);
					 			  }
			                      , tooltip : tooltipProcRsultTextOfLno});
					column.push({key : rontSctnClCd[colNum]+'lftJrdtTeamOrgNm'	, title : cflineMsgArray['managementTeam']/* 관리팀 */, align:'center'	, width: '100px'
				    			  , editable:  { type: 'text'}
					 			  , inlineStyle: function(value, data, mapping) {
					 				  return columnHeaderStyle("", data, mapping);
					 			  }
					 			  , tooltip : tooltipProcRsultTextOfLno});			
					column.push({key : rontSctnClCd[colNum]+'lftVendorNm'		, title : cflineMsgArray['vend']/* 제조사 */, align:'center', width: '100px'
				    			  , editable:  { type: 'text'}
					 			  , inlineStyle: function(value, data, mapping) {
					 				  return columnHeaderStyle("", data, mapping);
					 			  }
			                      , tooltip : tooltipProcRsultTextOfLno});
				    column.push({key : rontSctnClCd[colNum]+'lftEqpInstlMtsoNm'	, title : cflineMsgArray['mtso']/* 국사 */, align:'center'	, width: '100px'
				    			  , editable:  { type: 'text'}
					 			  , inlineStyle: function(value, data, mapping) {
					 				  return columnHeaderStyle("", data, mapping);
					 			  }
			                      , tooltip : tooltipProcRsultTextOfLno});
				}
			    column.push({key : rontSctnClCd[colNum]+'lftEqpNm'			, title : cflineMsgArray['nodeName']/* 노드명 */, align:'center'	, width: '150px'
				    			  , editable:  { type: 'text'}
								  , inlineStyle: function(value, data, mapping) {
						 			return columnHeaderStyle("", data, mapping);
						 			}
			                      , tooltip : tooltipProcRsultTextOfLno  });
			    
			    column.push({key : rontSctnClCd[colNum]+'lftCardMdlNm'		, title : "Unit"/* Unit */, align:'center'	, width: '80px'
				    			  , editable:  { type: 'text'}
					 			  , inlineStyle: function(value, data, mapping) {
					 				  return columnHeaderStyle("", data, mapping);
					 			  }
				                , tooltip : tooltipProcRsultTextOfLno});
			    column.push({key : rontSctnClCd[colNum]+'lftShlfNm'			, title : "Shelf", align:'center'	, width: '50px'
	    			 			 , editable:  { type: 'text'}
				 			     , inlineStyle: function(value, data, mapping) {
				 				   return columnHeaderStyle("", data, mapping);
				 			      }
			                     , tooltip : tooltipProcRsultTextOfLno});
			    column.push({key : rontSctnClCd[colNum]+'lftSlotNo'			, title : "Slot", align:'center'	, width: '50px'
				    			  , editable:  { type: 'text'}
				 			  	  , inlineStyle: function(value, data, mapping) {
				 				    return columnHeaderStyle("", data, mapping);
				 			      }
			                , tooltip : tooltipProcRsultTextOfLno});
			    column.push({key : rontSctnClCd[colNum]+'lftPortNm'		    , title : "Port", align:'center'	, width: '110px'
				    			  , editable:  { type: 'text'}
			                      , tooltip : tooltipProcRsultTextOfLno
					               }
				                  );
			    column.push({key : rontSctnClCd[colNum]+'rghtEqpPortRefcVal'	, title : "FDF", align:'center'	, width: '200px'
				    			  , editable:  { type: 'text'}
					 			  , inlineStyle: function(value, data, mapping) {
					 				  return columnHeaderStyle("", data, mapping);
					 			  }
			                      , tooltip : tooltipProcRsultTextOfLno});

			    column.push({key : rontSctnClCd[colNum]+'rontSctnClCd'	    , title : '기간망구간코드', align:'center'	, width: '150px' , hidden : testHidden});
			}
			
			for(var i=1; i<41; i++ ){
				column.push({key : 'p'+i+'lftEqpNm', title : "P"+i, align:'center'	, width: '100px'
				    			  , editable:  { type: 'text'}
					 			  , inlineStyle: function(value, data, mapping) {
					 				  return columnHeaderStyle("", data, mapping);
					 			  } 
			                      , tooltip : tooltipProcRsultTextOfLno
			 			    }
				          );
			    column.push({key : 'p'+i+'rontSctnClCd'	    , title : '기간망구간코드', align:'center'	, width: '150px' , hidden : testHidden});
			}
		}
	    
	    // 편집여부
	    column.push({key : 'workType'	    , title : '수정유형', align:'center'	, width: '10px' , hidden : testHidden});
	}
	
	return column;
}

function getHeaderGroup(param, xlsWorkObjVal){
	var headerGroup = [ { title:cflineMsgArray['line'], fromIndex:1, toIndex:13 } ];
	/**
	 * 001 종단Client_S, 002 전송Client_S, 003 시스템IO연동_S_1, 004 시스템IO연동_S_2, 005 Link 정보_S, 006 ROADM MUX 정보_S
	 * 007 ROADM MUX 정보_E, 008 Link 정보_E, 009 시스템IO연동_E_1, 010 시스템IO연동_E_2, 011 전송Client_E, 012 종단Client_E, 013 중계
	 */
   
    var pathHeaderStart = 15;
    
    if(xlsWorkObjVal == "A"){
    	var sIndex = pathHeaderStart;
    	var eIndex = pathHeaderStart;
     	var title = ['종단Client_S','전송Client_S','시스템IO연동_S'/*,'시스템IO연동_S_2'*/,'Link 정보_S','ROADM MUX 정보_S','ROADM MUX 정보_E','Link 정보_E'
     	                   ,'시스템IO연동_E'/*,'시스템IO연동_E_2'*/,'전송Client_E','종단Client_E'];
     	
     	for(var i in title){
     		eIndex = sIndex + ((title[i] != '시스템IO연동_S' && title[i] != '시스템IO연동_E') ? 10 : 12);
     		headerGroup.push({ title:title[i], fromIndex:sIndex, toIndex:eIndex });
     		sIndex = eIndex + ((title[i] != '시스템IO연동_S' && title[i] != '시스템IO연동_E') ? 1 : 2);
     	}
     	
     	eIndex = sIndex + 80;
     	headerGroup.push({ title:"중계", fromIndex:sIndex, toIndex:eIndex });
 	}
 	
 	return headerGroup;
}

function renderExcelGrid (gridDiv, totalCount, addData, xlsWorkObjVal){
	var returnMsg = "";	
	// 그리드 컬럼 초기화
	if(gridDiv == excelFileGridId){
		if (addData != true) {			
			initFileGridInfo(xlsWorkObjVal);
		}
		
		//returnMsg = cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);
	}else {
		if (addData != true) {	
			initExcelGridInfo(xlsWorkObjVal);
		}
	}

	returnMsg = cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);
	//if( addData != true){
		$('#'+gridDiv).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return returnMsg} } } );
	//}
	
	$('#'+gridDiv).on('gridRefresh');
}

/**
 * 
 * @param columnType REQ : 필수, CHO : 선택
 * @returns style
 */ 
function columnHeaderStyle(columnType, data, mapping) {
	var style = {
 			'white-space' : 'pre-line'
 	};
		
	if (columnType == "REQ") {
 		style['background-color'] = '#C1E1FF';
 	} else if (columnType == "CHO") {
 		style['background-color'] = '#FFEAEA';
 	}
	
	var procRsltCtt = "";
	var rontSctnClCd = "";
	

	// 처리결과
	if (mapping.key == "procRsltCtt") {
		if (nullToEmpty(data["procRsltCtt"]) == "") {
			return style;
		} else {
			style['background-color'] = '#FF0000';   // 에러는 붉은색
			return style;
		}
	}
	// 선번쪽 데이터인 경우
	if (mapping.key == 'wkSprDivCdNm' 
		|| mapping.key.indexOf("lftEqpRoleDivNm") > 0 
		|| mapping.key.indexOf("lftJrdtTeamOrgNm") > 0 
		|| mapping.key.indexOf("lftVendorNm") > 0 
		|| mapping.key.indexOf("lftEqpInstlMtsoNm") > 0 
		|| mapping.key.indexOf("lftEqpNm") > 0 
		|| mapping.key.indexOf("lftCardMdlNm") > 0 
		|| mapping.key.indexOf("lftShlfNm") > 0 
		|| mapping.key.indexOf("lftSlotNo") > 0 
		|| mapping.key.indexOf("lftPortNm") > 0 
		|| mapping.key.indexOf("rghtEqpPortRefcVal") > 0) {
		if (mapping.key == 'wkSprDivCdNm') {
			$.each(data, function(key,val){
				if (key.indexOf("procRsltCtt") > 0  && nullToEmpty(val).indexOf("wkSprDivCdNm") == 0) {
					rontSctnClCd = (key.indexOf("p") == 0 ?  key.substring(0, key.indexOf("lftEqpNm")) : key.substring(0, 3));
					return false;
				}
			});
		} // 중계노드 P1~P40
		else if (mapping.key.indexOf("p") == 0 ) {			
			rontSctnClCd = mapping.key.substring(0, mapping.key.indexOf("lftEqpNm"));   // 중계노드의 mappingKey 취득 p1 ~ p40
		}
	    else {
	    	rontSctnClCd = mapping.key.substring(0, 3);	
		}
		
		procRsltCtt = nullToEmpty(data[rontSctnClCd + "procRsltCtt"]);
	}	
	// 기본정보인 경우
	else {
		procRsltCtt = nullToEmpty(data.procRsltCtt);
		
	}
	
	// 에러존재여부
	if (procRsltCtt.indexOf(mapping.key) > -1) {
		style['background-color'] = '#FF0000';   // 에러는 붉은색
	}

	return style;
}

/*
 * 에러메세지 표시(기본)
 * */
function tooltipProcRsultTextOfBase(value, data, mapping){

	var procRsltCtt = nullToEmpty(data.procRsltCtt);
	
	var str = '';
			
	// 에러메세지 없으면
	if (procRsltCtt == "") {
		return str;
	} 
	else if (mapping.key == "procRsltCtt") {
		return renderingProcRsltCtt(procRsltCtt);
	}
	else if (procRsltCtt.indexOf(mapping.key) < 0) {
		return str;
	}
	
	var procRsltCttArr = procRsltCtt.split("▦");
	
	for (var i = 0 ; i < procRsltCttArr.length; i++) {
		if (procRsltCttArr[i].indexOf(mapping.key) == 0) {
			str = procRsltCttArr[i].substring(procRsltCttArr[i].indexOf(":") + 1)
			break;
		}
	}

	return str;
}

/*
 * 에러메세지 표시(선번)
 * */
function tooltipProcRsultTextOfLno(value, data, mapping){
	var procRsltCtt = "";
	var rontSctnClCd = "";
	var str = '';
	
	// 주예비 구분
	if (mapping.key == "wkSprDivCdNm") {
		
		$.each(data, function(key,val){
			if (key.indexOf("procRsltCtt") > 0  && nullToEmpty(val).indexOf("wkSprDivCdNm") == 0) {
				rontSctnClCd = (key.indexOf("p") == 0 ?  key.substring(0, key.indexOf("lftEqpNm")) : key.substring(0, 3));
				return false;
			}
		});
	}
	// 중계노드 P1~P40
	else if (mapping.key.indexOf("p") == 0 ) {
		if (mapping.key.indexOf("lftEqpNm") < 0) {
			return str;
		}
		rontSctnClCd = mapping.key.substring(0, mapping.key.indexOf("lftEqpNm"));
	}
    else {
    	rontSctnClCd = mapping.key.substring(0, 3);	
	}
		
	procRsltCtt = nullToEmpty(data[rontSctnClCd + "procRsltCtt"]);
	/*
	// 에러메세지 없으면
	 if (procRsltCtt.indexOf(mapping.key) < 0) {

		if (str == ""  && (mapping.key.indexOf("lftEqpNm") > 0 || mapping.key.indexOf("lftPortNm") > 0 )) {
			// 장비 ID 가 있는 경우
			if (mapping.key.indexOf("lftEqpNm") > 0 && nullToEmpty(data[rontSctnClCd + "lftEqpIdVal"]) != "") {
				str = "장비 ID : " + data[rontSctnClCd + "lftEqpIdVal"];
			}
			// 포트 ID가 있는 경우
			else if (mapping.key.indexOf("lftPortNm") > 0 && nullToEmpty(data[rontSctnClCd + "lftPortNoVal"]) != "") {
				str = "포트 ID : " + data[rontSctnClCd + "lftPortNoVal"];
			}
		}
		return str;
	}*/
	
	var procRsltCttArr = procRsltCtt.split("▦");
	
	for (var i = 0 ; i < procRsltCttArr.length; i++) {
		if (procRsltCttArr[i].indexOf(mapping.key) == 0) {
			str = procRsltCttArr[i].substring(procRsltCttArr[i].indexOf(":") + 1);
			break;
		}
	}

	return str;
}

function renderingProcRsltCtt(procRsltCtt) {
	var str = "";
	if (nullToEmpty(procRsltCtt) == "") {
		return;
	}
	var procRsltCttArr = procRsltCtt.split("▦");
	for (var i =0; i< procRsltCttArr.length; i++) {
		if (str.length > 0) {
			str += "\n";
		}
		var columnDivIdx = procRsltCttArr[i].indexOf(":")
		str += procRsltCttArr[i].substring(columnDivIdx > 0 ?  columnDivIdx + 1 : 0);
	}
	return str;
}
