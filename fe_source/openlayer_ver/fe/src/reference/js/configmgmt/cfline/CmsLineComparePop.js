/**
 * CmsLineComparePop.js
 *
 * RU 광코어 고도화 - 수집선번비교
 * @author P128406
 * @date 2019. 2. 25.
 * @version 1.0
 */

var autoServicelineGrid = "autoCollectionServiceListGrid";	// 수집회선 그리드
var inputServiceListGrid = "inputServiceListGrid";	// 입력회선 그리드

var initParam = null;		// 마스터 그리드에서 넘겨준 정보
var originalPath = null;		// CMS선번
var searchParam = null;		// 선번 조회 parameter

var openGridId = null;
var editPath = new TeamsPath();
/**
 * TEAMS 포인트 방식 회선 선번
 */
var teamsPath = new TeamsPath();
var comAutoList = null;

var baseInfData = null; //5GPON타입검색용 기본데이터
var flag = null;


var chkDataSet = 0;

/*
 * Ring 검증
 */
var ringCnt = 0;	//RingSize 
var ringCompareResult = "ok";
var ringYNResult = true;
var ringAddResult = false;
var ringDropResult = false;

/*
 * 검증결과
 */
var summary = "";
var inconsistency = "불일치";
var equipment = "장비";
var port = "포트";
var ringSummary = false;

$a.page( function() {
	
	this.init = function(id, param) {

		utrdMgmtNo = nullToEmpty(param.utrdMgmtNo) == "" ? "" : param.utrdMgmtNo;
		openGridId = param.gridId;
		initParam = param;  
		baseInfData = param.baseInfData.fiveGponEqpMdlIdList;

		//data를 set하기 전에 그리드 초기화
		initGridComparePath(inputServiceListGrid);
    	initGridComparePath(autoServicelineGrid);
    	
    	searchGrid(autoServicelineGrid, initParam);
    	editInputDataGrid(inputServiceListGrid, initParam);
    	
    	// editPath
		$('#btnPopSave').setEnabled(true);

        setEventListener();
		
        //입력선번데이터셋팅
		dataSetting(param);
	};
	// Grid 초기화
	function initGridComparePath(gridId) {

		var groupColumn = groupingColumnPath();
		var column = [
		              { dragdropColumn : true, width : '30px', rowspan : {by : 'RING_MERGE' } }
					];
		
		var baseColumn = [{ selectorColumn : true, width : '40px', rowspan : {by : 'RING_MERGE' } }
						, 
						{ key : 'RING_MERGE', hidden : true, value : function(value, data) {
								if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] == null) {
									return data._index.id;
								} else if(data['RING_ID'] == null && data['WDM_TRUNK_ID'] != null) {
									return data['WDM_TRUNK_ID'];
								} else {
									if(data['RING_ID'] != null) {
										return data['RING_ID'];
									}
								} 
							}
						}
		   			    , { key : 'RING_NM', 					title : cflineMsgArray['ringName'], align : 'left', width : '100px'
		   			    	, tooltip : tooltipText
		   			    	, inlineStyle: ringStyleCss
		   			        , styleclass : function(value, data, mapping) {
			   		   			return ringInlineStyleCss(value, data, mapping, gridId);
			   				}
		   			    	, rowspan : {by : 'RING_MERGE'}   /*링 */
		   			        , rowDragDrop : true
		   			    }
			   		 	  // 2019-02-08  2. 5G-PONU고도화
			   		 	, { key : 'A_FIVE_G_PON_EQP_TYPE', title : 'A_FIVE', width : '50px', hidden: true 
			   		 		    	, value : function(value, data) { 
			   		 						return getFiveGponEqpType(data, 'A');
			   		 		    	}
			   		 	  }
			   		 	, { key : 'B_FIVE_G_PON_EQP_TYPE', title : 'B_FIVE', width : '50px', hidden: true 
			   		 		    	, value : function(value, data) { 
			   		 					return getFiveGponEqpType(data, 'B');
			   		 		    	}
			   		 	     }
		   		   		, { key : 'NE_NM', 						title : '장비명', align : 'left', width : '170px', tooltip : tooltipText
		   		   			, inlineStyle: eqpStyleCss
		   		   			, styleclass : function(value, data, mapping) {
			   		   			return eqpInlineStyleCss(value, data, mapping, gridId);
			   				}
				   		   	, render : function(value, data) { 
			 						//return setEqpTypeIcon(data) +" "+ data.NE_NM;
			 						return data.NE_NM;
			 		    	}
		   		   		  }
		   		   		, { key : 'A_PORT_DESCR', 				title : 'A포트', align : 'left', width : '90px', tooltip : tooltipText
					   		   		, value : function(value, data) { 
					 						if(nullToEmpty(data.A_PORT_DESCR) != "" && data.A_PORT_DESCR != "null"){
					 							return data.A_PORT_DESCR;
					 						} else {
					 							return "";
					 						}
					 		    	} 
				   		   			, styleclass : function(value, data, mapping) {
					   		   			return portInlineStyleCss(value, data, mapping, gridId, "A");
					   				}
		   		   		}
		   		   		, { key : 'A_CHANNEL_DESCR', 			title : 'A파장', align : 'left', width : '80px' 
					   		   		, value : function(value, data) { 
					 						if(nullToEmpty(data.A_CHANNEL_DESCR) != "" && data.A_CHANNEL_DESCR != "(null)"){
					 							return data.A_CHANNEL_DESCR;
					 						} else {
					 							return "";
					 						}
					 		    	}
		   		   		}
		   		   		
		   		   		, { key : 'B_PORT_DESCR', 				title : 'B포트', align : 'left', width : '90px', tooltip : tooltipText
					   		   		, value : function(value, data) { 
				 						if(nullToEmpty(data.B_PORT_DESCR) != "" && data.B_PORT_DESCR != "null"){
				 							return data.B_PORT_DESCR;
				 						} else {
				 							return "";
				 						}
					   		   		}
				   		   			, styleclass : function(value, data, mapping) {
					   		   			return portInlineStyleCss(value, data, mapping, gridId, "B");
					   				}
		   		   		}
		   		   		, { key : 'B_CHANNEL_DESCR', 			title : 'B파장', align : 'left', width : '80px' 
					   		   		, value : function(value, data) { 
				 						if(nullToEmpty(data.B_CHANNEL_DESCR) != "" && data.B_CHANNEL_DESCR != "(null)"){
				 							return data.B_CHANNEL_DESCR;
				 						} else {
				 							return "";
				 						}
				 		    	}
		   		   		}		

		   			];
		
		if(gridId == inputServiceListGrid) {
			column = column.concat(baseColumn);
		} else {
			column = baseColumn;
		}
		
		column = column.concat(addTeamsColumn());
		
		// 그리드 생성 - auto (cms)
		$('#' + gridId).alopexGrid({	
			fitTableWidth: true,
			fillUndefinedKey : null,
			useClassHovering : true,
			alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
			preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
			
			autoColumnIndex : true ,
			autoResize : true ,
			cellSelectable : false ,
			rowSelectOption : {
				clickSelect : true ,
				singleSelect : false ,
				groupSelect : true
			} ,
			numberingColumnFromZero : false, 
			pager : false ,
			height : 340 ,	     
			message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			} ,
			columnMapping : column,
			grouping : groupColumn,
			enableDefaultContextMenu : false ,
			enableContextMenu : false,
			rowspanGroupSelect: true,
			rowspanGroupFocus: true
		});	
	}

	//검증결과표시
	function resultSummarySetting(){
		summary = resultSummary();
		$('#resultSummary').text(summary);
	}
	
	//입력선번타이틀항목셋팅
	function dataSetting(param){
		$('#popLineNmSpan').text(param.baseInfData.lineNm); //회선명
		$('#popSvlnNoSpan').text(param.baseInfData.svlnNo);	//서비스회선번호
	}
	
	 function setEventListener() {
		 // 취소(닫기)
		 $('#btnPopClose').on('click', function(e) {
			 $a.close();
	     });
		 
		 //일괄적용버튼 클릭
		 $('#btnBatch').on('click', function(e) {

			 var autoData = AlopexGrid.trimData($('#'+autoServicelineGrid).alopexGrid('dataGet'));
			 
			 if(autoData.length == 0) {
				 alertBox('W', "일괄적용 할 수집선번이 없습니다.");
				 return false;
			 }
			 
			 $('#'+inputServiceListGrid).alopexGrid("dataDelete");
			 $('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData);

			 summary = "";
			 styleSet();
			 ringAddDropCom();
			 resultSummarySetting();
			 
			 
		 });
		 
		 // 입력선번적용
		 $('#btnPopSave').on('click', function(e) {

			 var autoData = AlopexGrid.trimData($('#'+autoServicelineGrid).alopexGrid('dataGet'));
			 if(autoData.length == 0) {
				 alertBox('I', "적용된 내용이 없습니다.");
				 return false;
			 }
			 
			 //적용하시겠습니까? 물어보기.
			 callMsgBox('','C', "이대로 적용하시겠습니까?", function(msgId, msgRst){  
			       	if (msgRst == 'Y') {

			       		var copyPath = new TeamsPath();
						var data = $('#'+inputServiceListGrid).alopexGrid("dataGet");

  						var compareNode = new TeamsNode();
					    var nodes = [];
					    
					    //for start
						for(var i = 0; i < data.length; i++){
							compareNode = new TeamsNode();
						    compareNode.fromData(data[i]);
						    nodes.push(compareNode);
						    
						    copyPath.NODES = [];
						    copyPath.NODES = copyPath.NODES.concat(nodes);
						}
						
						// 구선번용
						var comparePath = {};
						comparePath.pathOld = copyPath.toTangoPath().toData();
						
						// 구선번용 LINKS에 불필요한 속성삭제
						var oldPathList = [];
						if (comparePath.pathOld.LINKS.length > 0) {
							for (var i = 0; i <comparePath.pathOld.LINKS.length; i++) {
								var tmpPath = comparePath.pathOld.LINKS[i];
								var oldPath = {}
								for(var s in tmpPath){
									
									if(s != "Ring" && s != "Service" && s != "Trunk" && s != "WdmTrunk" && s != "leftNode" && s != "rightNode") {
										eval("oldPath." + s + " = tmpPath." + s);
									}
								}
								oldPathList.push(oldPath);
							}
							comparePath.pathOld.LINKS = oldPathList;
						}
						
						comparePath.pathNew = copyPath.toData();

						$a.close(comparePath);
			       	}
			  });
		 });

		 // 선택선번 삭제 버튼
		 $('#btnSelectSrvcLineDelete').on('click', function(e) {
			deleteSelectPath();
		 });
		 
		 //장비이동화살표 클릭
		 $('#moveSvlnBtn').on('click', function(e) {
			 var notAdd = false;
			 var count = 0;
			 var selRowIndex = 0;
			 var eqpType;
			 
			 var autoData = AlopexGrid.trimData($('#'+autoServicelineGrid).alopexGrid('dataGet', {_state:{selected:true}}));
			 if(autoData == undefined || autoData.length == 0) {
				alertBox('I', '이동할 수집선번데이터를 선택해주세요.'); 
			 	return;
			 } else if (autoData.length > 0){
				 
				 var selData = $('#'+inputServiceListGrid).alopexGrid('dataGet');
				 if(selData.length == 0){
					 selRowIndex = 0;
					 $('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{row:selRowIndex}});
				 } else {
				 
					 var ringYn = false;
					 var ringData = [];
					 for(var i=0; i < autoData.length;i++){
						 ringYn = ringPathYN(autoData[i], "auto");
						 if (ringYn == true) {
							 ringData.push(autoData[i]);
							 continue;
						 }
						 // 이전 RING에대한 처리
						 if (ringYn == true && ringData.length > 0) {
							 eqpType = "RING";
							 autolineMove(ringData, eqpType);
						 }
						 					 
						 if (ringYn == false) {
							 eqpType  = getComFiveGPonEqpType(autoData[i], "compare");
							 autolineMove(autoData[i], eqpType);
						 }
					 }
					 
					// 이전 RING에대한 처리
					 if (ringData.length > 0) {
						 eqpType = "RING";
						 autolineMove(ringData, eqpType);
						 ringData= [];
					 }
				 }
			 }
		 });

		// 수집선번이동이 끝나면 데이터비교 하기
		$('#'+inputServiceListGrid).on('dataAddEnd', function(e){
			//수집선번 체크박스 해제
			$('#'+autoServicelineGrid).alopexGrid("rowSelect", {_state : {selected : true}}, false );
			
			summary = "";
			styleSet();
			ringAddDropCom();
			resultSummarySetting();
		});
		
		// 입력선번삭제가 끝나면 데이터비교 하기
		$('#'+inputServiceListGrid).on('dataDeleteEnd', function(e){
			//수집선번의 데이터가 셋팅되면 입력선번의 그리드를 다시 그린다. (비교색을 위해서...)
			
			summary = "";
			styleSet();
			ringAddDropCom();
			resultSummarySetting();
		});
	 }

	 //수집선번의 이동
	 function autolineMove(autoData, eqpType){

		 var count = 0;
		 var selRowIndex = 0;

		 var selData = $('#'+inputServiceListGrid).alopexGrid('dataGet');
		 if(selData.length == 0){
			 selRowIndex = 0;
			 $('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{data:selRowIndex}});
		 } else {
			 
			 var delRowIndex = 0;
			 
			 if(eqpType == "DUH"){	//ok
					for(var idx = 0; idx < selData.length; idx++){
						type = getComFiveGPonEqpType(selData[idx], "compare");
						selRowIndex = 0;
						if(type == eqpType){
							delRowIndex = selData[idx]._index.row;
							$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
						} 
					}
					$('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{data:selRowIndex}});
				 }
	
			 else if(eqpType == "MRN"){	
				for(var idx = 0; idx < selData.length; idx++){
					type = getComFiveGPonEqpType(selData[idx], "compare");
					if(type == eqpType){
						selRowIndex = selData[idx]._index.row;
						delRowIndex = selData[idx]._index.row;
						$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
					} else {
						var selectRing = ringPathYN(selData[idx], "auto"); 
						if(!selectRing) {
							if(type == "MRN"){
								if(idx + 1 <=  selData.length){
									for(var i = idx + 1; i < selData.length; i++){
										type = getComFiveGPonEqpType(selData[i], "compare");
										if(type == "FDF"){
											selRowIndex = selData[i]._index.row + 1;
										} else {
											break;
										}
									}
								}
							} else if(type == "DUH" || type == "RING") {
								selRowIndex = selData[idx]._index.row + 1;
								break;
							} else if(type == "DUL") {
								selRowIndex = selData[idx]._index.row;
								break;
							} 
						} else {
							//RING이 있는 경우
							selRowIndex = selData[idx]._index.row - 1;
						}
					}
				}
				$('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{data:selRowIndex}});
			 }
				 
			 else if(eqpType == "CRN"){	
				
				for(var idx = 0; idx < selData.length; idx++){
					type = getComFiveGPonEqpType(selData[idx], "compare");
					if(type == eqpType){
						selRowIndex = selData[idx]._index.row;
						delRowIndex = selData[idx]._index.row;
						$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
					} else {
						var selectRing = ringPathYN(selData[idx], "auto"); 
						if(!selectRing) {
							if(type == "MRN"){
								if(idx + 1 <=  selData.length){
									for(var i = idx + 1; i < selData.length; i++){
										type = getComFiveGPonEqpType(selData[i], "compare");
										if(type == "FDF"){
											selRowIndex = selData[i]._index.row + 1;
										} else {
											break;
										}
									}
								}
							} else {
								if(type == "DUH" || type == "RING") {
									selRowIndex = selData[idx]._index.row + 1;
								} else if(type == "DUL") {
									selRowIndex = selData[idx]._index.row;
								}
							}
						} else {
							//RING이 있는 경우
							selRowIndex = selData[idx]._index.row + 1;
						}
					}
				}
				$('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{data:selRowIndex}});
			 }

			 else if(eqpType == "RING") {
				 var rowEq = [];
				 for(var idx = 0; idx < selData.length; idx++){	
					type = getComFiveGPonEqpType(selData[idx], "compare");
					if(type == eqpType){
						selRowIndex = selData[idx]._index.row;
						delRowIndex = selData[idx]._index.row;
						$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
					} else {
						selRowIndex = selData[idx]._index.row;
						if(type == "COT" || type == "MRN") {
							selRowIndex = selData[idx]._index.row;
							delRowIndex = selData[idx]._index.row;
							$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
							
							if(idx + 1 <=  selData.length){
								for(var i = idx + 1; i < selData.length; i++){
									type = getComFiveGPonEqpType(selData[i], "compare");
									if(type == "FDF" || type == "MRN"){
										var row = selData[i]._index.row;
										$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:row }});
									} else {
										break;
									}
								}
							}
						} else if(type == "CRN" || type == "DUL"){
							selRowIndex = selData[idx]._index.row;
							rowEq.push(type+"_"+selRowIndex);
						} else if(type == "DUH") {
							selRowIndex = selData[idx]._index.row + 1;
							rowEq.push(type+"_"+selRowIndex);
						} 
					}
				}
				var rowIndex = 0;
				if(rowEq.length > 0){ 
					for(var i=0;i<rowEq.length;i++){
						if(rowEq[i].indexOf("DUH") == 0) {
							rowIndex = rowEq[i].split('_')[1];
							break;
						} else if(rowEq[i].indexOf("CRN") == 0) {
							rowIndex = rowEq[i].split('_')[1];
							break;
						}
					}
				} 
				$('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{data:rowIndex}});
				rowEq = [];
			 }
				 
			 else if(eqpType == "DUL"){	
				for(var idx = 0; idx < selData.length; idx++){
					type = getComFiveGPonEqpType(selData[idx], "compare");
					selRowIndex = selData.length;
					if(type == eqpType){
						delRowIndex = selData[idx]._index.row;
						$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
					}
				}
				$('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{data:selRowIndex}});
			 }
			 else {
				 for(var idx = 0; idx < selData.length; idx++){
					type = getComFiveGPonEqpType(selData[idx], "compare");
					if(type == eqpType){
						if(selData[idx].NE_ID == autoData.NE_ID){
							delRowIndex = selData[idx]._index.row;
							$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
						} else {
							selRowIndex = selData[idx]._index.row
						}
					}
					else if(type == "DUH") {
						selRowIndex = selData[idx]._index.row + 1;
					} else if(type == "DUL") {
						selRowIndex = selData[idx]._index.row;
						break;
					} 
				}
				 $('#'+inputServiceListGrid).alopexGrid('dataAdd',  autoData, {_index:{data:selRowIndex}}); 
			 }
		 }
	 }

	 
	//선번내에 RING이 존재하는지 판단
	function ringPathYN(data, flag) {
		//flag가 "sel"인 경우에는 dataset전체에서 RING이 존재하는지 비교
		if(flag == "sel") {
			ringCnt = 0;
			if(data.length > 0){
				 for(var i = 0; i < data.length; i++){
					 if(nullToEmpty(data[i].RING_ID) != "") {
						 ringCnt++;
					 }
				 }
				 if(ringCnt > 0 && ringCnt <= data.length){
					 return true;
				 }
			 } 
		} else {
			//flag가 "auto"인 경우에는 넘어온 data가 ring인지 아닌지를 비교
			if(nullToEmpty(data.RING_ID) != ""){
				return true;
			}
		}
		return false;
	} 
	 
	//어떤장비인지 판단
	function getComFiveGPonEqpType(data, type){

		 var fiveGPontype;
		 
		 if(data.length > 0){
			 if(ringPathYN(data, "sel")) fiveGPontype = "RING";
		 } else {
			 if(nullToEmpty(data.FIVE_GPON_EQP_TYPE) != "") {
				 fiveGPontype = data.FIVE_GPON_EQP_TYPE;
			 } else {
				 if(nullToEmpty(data.A_FIVE_G_PON_EQP_TYPE) != ""){
					 fiveGPontype = data.A_FIVE_G_PON_EQP_TYPE;
				 } else {
					 fiveGPontype = data.B_FIVE_G_PON_EQP_TYPE;
				 }
			 }
			 
			 if(type == "compare") {
				 if(nullToEmpty(data.RING_ID) != "") {
					 fiveGPontype = "RING"; 
				 } 
			 }
		 }
			 
		 return fiveGPontype;
	 }

	//5G장비명앞에 Image 아이콘붙임
	 function setEqpTypeIcon(data){
		 
		 if(data != null && data != undefined && data != "") {
			var eqpType;
			if(nullToEmpty(data.A_FIVE_G_PON_EQP_TYPE) != ""){
				eqpType = data.A_FIVE_G_PON_EQP_TYPE;
			} else if(nullToEmpty(data.b_FIVE_G_PON_EQP_TYPE) != ""){
				eqpType = data.B_FIVE_G_PON_EQP_TYPE;
			}
		}
		 
		var image = eqpIconStyle(eqpType);
		return  image;
	 }

	 //장비에 따른 이미지 URL
	 function eqpIconStyle(eqpType){
		var urlPath = $('#ctx').val();
	 	if(nullToEmpty(urlPath) == ""){
	 		urlPath = "/tango-transmission-web";
	 	}
		var image = "";
		var url = urlPath +'/resources/images';
	 	if (eqpType == "COT") {
	 		image = "<img src='"+url+"/img_sk_logo_test.png' height='10'></img>";
	 	} else if (eqpType == "MRN") {
	 		image = "<img src='"+url+"/img_sk_logo_test.png' height='10'></img>";
	 	} else if (eqpType == "CRN") {
	 		image = "<img src='"+url+"/img_sk_logo_test.png' height='10'></img>";
	 	} else if (eqpType == "DUH") {
	 		image = "<img src='"+url+"/img_sk_logo_test.png' height='10'></img>";
	 	} else if (eqpType == "DUL") {
	 		image = "<img src='"+url+"/img_sk_logo_test.png' height='10'></img>";
	 	} 

		return image;
	}

	//장비에 따른 background-color 스타일
	 function styleCss(eqpType){
		 var style = {
		 			'white-space' : 'pre-line'
		 	};

	 	if (eqpType == "COT") {
	 		style['background-color'] = '#C1E1FF';
	 	} else if (eqpType == "MRN") {
	 		style['background-color'] = '#CAE6CA';
	 	} else if (eqpType == "CRN") {
	 		style['background-color'] = '#EAEAB3';
	 	} else if (eqpType == "DUH") {
	 		style['background-color'] = '#FFDAC4';
	 	} else if (eqpType == "DUL") {
	 		style['background-color'] = '#CECECE';
	 	} 

		return style;
	}

	//검증결과를 위한 장비, 포트비교
	function resultSummary(){
		var ringResult = true;
		
		var result = true;
		var autoList = $('#'+autoServicelineGrid).alopexGrid("dataGet");
		var selList = $('#'+inputServiceListGrid).alopexGrid("dataGet");
		
  		var ringAutoYn = ringPathYN(autoList, "sel");
  		var ringSelYn = ringPathYN(selList, "sel");
  		var ynCnt = 0;

  		if(autoList.length > 0){
  			
  			if(ringCompareResult == "diff") {
				ringResult = false;
			}
  			
			for(var i = 0; i < autoList.length; i++){
				var fstFiveGPonEqpType = getComFiveGPonEqpType(autoList[i], "set");
				var fstNeId = autoList[i].NE_ID;

				if(fstFiveGPonEqpType != "FDF") {
					if(nullToEmpty(selList) != ""){
 						
						ynCnt = 0;
						
						for(var idx = 0; idx < selList.length; idx++){
			
							var secFiveGPonEqpType = getComFiveGPonEqpType(selList[idx], "set");
							var secNeId = selList[idx].NE_ID;

							//양쪽에 링이 존재하는 경우 RingNo가 같고 ADD,DROP이 같은지 확인후 같은경우에는 링안에 장비를 비교하지 않는다.
							if(nullToEmpty(autoList[i].RING_ID) != "" && ringCompareResult == "ok") {
								ringResult = true;
							}
							
							//같은 장비인지 비교
	 						if(fstFiveGPonEqpType == secFiveGPonEqpType) {
			 					if(secFiveGPonEqpType != "FDF"){
									if(fstNeId == secNeId) {
										//A_Port비교
			 							//if(nullToEmpty(selList[idx].RING_ID) == "" && autoList[i].A_PORT_DESCR != selList[idx].A_PORT_DESCR) {
				 						if(nullToEmpty(selList[idx].RING_ID) == "" && portCom(autoList[i].A_PORT_DESCR, selList[idx].A_PORT_DESCR) != 0) {
		 									summary = summary +  fstFiveGPonEqpType +" : ("+ autoList[i].NE_NM + ") 장비의 A" + port +" " + inconsistency + "\n";
										}
										//B_Port비교
			 							//if(nullToEmpty(selList[idx].RING_ID) == "" && autoList[i].B_PORT_DESCR != selList[idx].B_PORT_DESCR) {
					 					if(nullToEmpty(selList[idx].RING_ID) == "" && portCom(autoList[i].B_PORT_DESCR, selList[idx].B_PORT_DESCR) != 0) {
		 									summary = summary +  fstFiveGPonEqpType +" : ("+ autoList[i].NE_NM + ") 장비의 B" + port +" " + inconsistency + "\n";
		 								} 
									} else {
										//result = false;
										if(nullToEmpty(selList[idx].RING_ID) == "") {
											summary = summary +  fstFiveGPonEqpType +" : ("+ autoList[i].NE_NM + ") 장비 " +" " + inconsistency + "\n";
										}
									}
			 					}
							} else {
								ynCnt++;
								//다른 장비임
								result = false;
							}
						}
						
						if(!result) {
							//RING이 아니면서 같은장비가 존재하지 않는 경우에 표시
							if(nullToEmpty(autoList[i].RING_ID) == "" && ynCnt == selList.length) {
								summary = summary + fstFiveGPonEqpType +" : 장비없음" + "\n";
							}
						}
					}
				}
			}
			
			if(!ringYNResult || !ringResult) {
				//서로 다른 RING ID가 존재함
				summary = summary + "\n";
			}
			
			return summary;
  		}
	}
		
	//TODO
	//PORT끼리의 비교
	//(RX)가 입력되어있지 않아도 TX가 같으면 같은 PORT로 인식한다.
	function portCom(port1, port2){
		var result = 0;
		if(nullToEmpty(port1) == "" && nullToEmpty(port2) == "") {
			return result;
		} else {
			if(nullToEmpty(port1) != "") {
				result = port2.indexOf(port1);
				if(result < 0) {
					if(nullToEmpty(port2) != "") {
						result = port1.indexOf(port2);
					} else {
						result = -1;
					}
				}
			} else {
				result = -1;
			}
		}
		
		return result;
	}
	
	//RING끼리의 비교(같은 RING인 경우에는 Add&Drop비교포함)
	function ringAddDropCom(){

  		ringYNResult = true;
		var autoList = $('#'+autoServicelineGrid).alopexGrid("dataGet");
		var selList = $('#'+inputServiceListGrid).alopexGrid("dataGet");
  		
  		var ringAutoYn = ringPathYN(autoList, "sel");
  		var ringSelYn = ringPathYN(selList, "sel");
  		
  		var ringNm;
  		//RING ADD, DROP 체크
  		if(ringAutoYn && ringSelYn) {
  			//양쪽에 링이 존재하는 경우 RingNo가 같고 ADD,DROP이 같은지 확인후 같은경우에는 링안에 장비를 비교하지 않는다.
  			for(var i = 0; i < autoList.length; i++){
  				if(nullToEmpty(autoList[i].RING_ID) != "") {
  					var fstFiveGPonEqpType = getComFiveGPonEqpType(autoList[i], "set");
	  				
  					if(nullToEmpty(autoList[i].ADD_DROP_TYPE_CD) != "" && autoList[i].ADD_DROP_TYPE_CD == "A"){
	  					
  						var autoAport = autoList[i].A_PORT_ID;
	  					for(var idx = 0; idx < selList.length; idx++){
	  						//RING ID가 서로 같은 경우
	  		  				if(nullToEmpty(selList[idx].RING_ID) != "" && autoList[i].RING_ID == selList[idx].RING_ID ) {

	  						 	var secFiveGPonEqpType = getComFiveGPonEqpType(selList[idx], "set");
	  			  				if(nullToEmpty(selList[idx].ADD_DROP_TYPE_CD) != "" && selList[idx].ADD_DROP_TYPE_CD == "A"){
	  			  					if(fstFiveGPonEqpType == secFiveGPonEqpType) {
			  			  				if(autoAport == selList[idx].A_PORT_ID){
			  								ringAddResult = true;
			  								break;
			  							} else {
			  			  					//장비가 같은 경우의 Add포트비교
		  			  						summary =  summary  + "RING : COT Add " + equipment +"의 " + port + " " + inconsistency + "\n";
		  			  						ringCompareResult = "diff";
		  			  						ringSummary = true;
			  							}
		  			  				} else {
		  			  					//장비가 다른 경우의 Add포트비교
		  			  					summary =  summary  + "RING : Add " + equipment + "의 " + inconsistency + "\n";
		  			  					ringCompareResult = "diff";
		  			  					ringSummary = true;
		  			  				}
	  						 	}
	  		  				} else if(nullToEmpty(selList[idx].RING_ID) != "" && autoList[i].RING_ID != selList[idx].RING_ID ) {
	  	  						//RING ID가 서로 다른 경우
	  		  					ringNm = autoList[i].RING_NM;
	  			  				ringYNResult = false;
	  			  			}
	  		  			}
	  				}
	  				
	  				if(nullToEmpty(autoList[i].ADD_DROP_TYPE_CD) != "" && autoList[i].ADD_DROP_TYPE_CD == "D"){
	  					
	  					var autoBport = autoList[i].B_PORT_ID;
	  					for(var idx = 0; idx < selList.length; idx++){
	  						//RING ID가 서로 같은 경우
	  		  				if(nullToEmpty(selList[idx].RING_ID) != ""  && autoList[i].RING_ID == selList[idx].RING_ID ) {

	  						 	var secFiveGPonEqpType = getComFiveGPonEqpType(selList[idx], "set");

	  			  				if(nullToEmpty(selList[idx].ADD_DROP_TYPE_CD) != "" && selList[idx].ADD_DROP_TYPE_CD == "D"){
	  			  					if(fstFiveGPonEqpType == secFiveGPonEqpType) {
			  			  				if(autoBport == selList[idx].B_PORT_ID){
			  								ringDropResult = true;
			  								break;
			  							} else {
			  								//장비가 같은 경우의 Drop포트비교
		  			  						summary =  summary  + "RING : MRN Drop " + equipment +"의 " + port + " " + inconsistency + "\n";
		  			  						ringCompareResult = "diff";
		  			  						ringSummary = true;
			  							}
		  			  				} else {
		  			  					//장비가 다른 경우의 Drop포트비교
		  			  					summary =  summary  + "RING : Drop " + equipment + "의 " + inconsistency + "\n";
		  			  					ringCompareResult = "diff";
		  			  					ringSummary = true;
		  			  				}
	  						 	}
	  		  				} else if(nullToEmpty(selList[idx].RING_ID) != "" && autoList[i].RING_ID != selList[idx].RING_ID ) {
	  	  						//RING ID가 서로 다른 경우
	  		  					ringNm = autoList[i].RING_NM;
	  			  				ringYNResult = false;
	  			  			}
	  		  			}
	  				}
  				}
  			}
						
  			//같은 RING이면서 Add, Drop장비가 일치하는 경우
			if(ringAddResult && ringDropResult){
				ringCompareResult = "ok";
			}
  		}
  		//수집선번에만 RING이 존재하는 경우
  		if(ringAutoYn && !ringSelYn) {
  			if(selList.length > 0) {
  				summary =  summary  + "RING : 없음" + "\n";
  			} else {
  				summary =  summary  + "입력선번 데이터가 존재하지 않습니다. " + "\n";
  			}
			ringCompareResult = "diff";
  		}
  		
  		//양쪽 RING이 존재하면서 RING ID가 불일치하는 경우 
  		if(!ringYNResult) {
  			summary =  summary  + "RING : (" + ringNm + ") 불일치 " + "\n";
			ringCompareResult = "diff";
  		}
	}
		
	//장비 기본바탕 스타일
	function eqpStyleCss(value, data, mapping) {
		
		if(value != null && value != undefined && value != "") {
			var eqpType;
			if(nullToEmpty(data.A_FIVE_G_PON_EQP_TYPE) != ""){
				eqpType = data.A_FIVE_G_PON_EQP_TYPE;
			} else if(nullToEmpty(data.b_FIVE_G_PON_EQP_TYPE) != ""){
				eqpType = data.B_FIVE_G_PON_EQP_TYPE;
			}
			return styleCss(eqpType);
		}  
	}

	 //장비 비교후 테두리 스타일
	function eqpInlineStyleCss(value, data, mapping, gridId){

		//Grid 2개의 데이터가 모두 로딩된후 비교
		if (chkDataSet == 2) {
			var chkResult = true;			
			var fstNeID = data.NE_ID;
			var fstFiveGPonEqpType = getComFiveGPonEqpType(data, "set");
			var dataList = null;
	  		if(gridId == autoServicelineGrid) {
	  			dataList = $('#'+inputServiceListGrid).alopexGrid("dataGet");
	  		} else {
	  			dataList = $('#'+autoServicelineGrid).alopexGrid("dataGet");
	  		}
	
	  		if(fstFiveGPonEqpType != "FDF") {
				if(nullToEmpty(dataList) != ""){
					for(var idx = 0; idx < dataList.length; idx++){
						var secNeID = dataList[idx].NE_ID;
					 	var secFiveGPonEqpType = getComFiveGPonEqpType(dataList[idx], "set");

					 	//양쪽에 링이 존재하는 경우 RingNo가 같고 ADD,DROP이 같은지 확인후 같은경우에는 링안에 장비를 비교하지 않는다.
					 	if(nullToEmpty(data.RING_ID) != "" && ringCompareResult =="ok") {
		 					chkResult = true;
		 					break;
		 				} 
					 	
		 				if(fstNeID == secNeID) {
		 					if(secFiveGPonEqpType != "FDF"){
			 					if(fstFiveGPonEqpType == secFiveGPonEqpType){
			 						//ID도 같고 장비명도 동일한경우 (완벽히 일치)
 		 							chkResult = true;
		 				 			return null;
					 			} 
			 				} else {
			 					//FDF의 경우에는 색표시 안함
			 					chkResult = true;
					 			return null;
			 				}
				 		} else {
				 			chkResult = false;
				 		}
					}
					
					if(!chkResult){
						return 'orgBorder1';
					}
				} 
	  		} else {
				chkResult = true;
	 			return null;
			}
		}
	}

	//포트 비교후 테두리 스타일
	function portInlineStyleCss(value, data, mapping, gridId, portNm){
		//Grid 2개의 데이터가 모두 로딩된후 비교
		if (chkDataSet == 2) {
			var chkResult = true;
			
	  		var eqpType = getComFiveGPonEqpType(data, "set");
	  		var style = styleCss(eqpType);
	  		
			var fstNeID = data.NE_ID;
			var fstFiveGPonEqpType = getComFiveGPonEqpType(data, "set");
			var dataList = null;
	  		if(gridId == autoServicelineGrid) {
	  			dataList = $('#'+inputServiceListGrid).alopexGrid("dataGet");
	  		} else {
	  			dataList = $('#'+autoServicelineGrid).alopexGrid("dataGet");
	  		}

	  		if(fstFiveGPonEqpType != "FDF") {
				if(nullToEmpty(dataList) != ""){
					for(var idx = 0; idx < dataList.length; idx++){
						var secNeID = dataList[idx].NE_ID;
					 	var secFiveGPonEqpType = getComFiveGPonEqpType(dataList[idx], "set");
		 				if(fstNeID == secNeID) {
		 					if(secFiveGPonEqpType != "FDF"){
		 						//양쪽에 링이 존재하는 경우 RingNo가 같고 ADD,DROP이 같은지 확인후 같은경우에는 링안에 장비를 비교하지 않는다.
		 						if(nullToEmpty(data.RING_ID) != "" && ringCompareResult == "ok") {
		 							chkResult = true;
						 			return null;
		 						}
		 						if(fstFiveGPonEqpType == secFiveGPonEqpType){
		 							//A_Port비교
			 						if(portNm == "A") {
			 							
				 						if(portCom(data.A_PORT_DESCR, dataList[idx].A_PORT_DESCR) != 0) {
			 							//if(data.A_PORT_DESCR != dataList[idx].A_PORT_DESCR) {
							 				chkResult = false;
										} else {
				 							chkResult = true;
				 							return null;
				 						}
				 					
			 						} //B_Port비교
			 						else if (portNm == "B") {
				 						if(portCom(data.B_PORT_DESCR, dataList[idx].B_PORT_DESCR) != 0) {
		 		 						//if(data.B_PORT_DESCR != dataList[idx].B_PORT_DESCR) {
							 				chkResult = false;
							 			} else {
				 							chkResult = true;
				 							return null;
				 						}
			 						} 
					 			} 
			 					
			 				} else {
			 					chkResult = true;
					 			return null;
			 				}
				 		} 
					}
					
					if(!chkResult){
						return 'orgBorder1';
					}
				} 
	  		} else {
				chkResult = true;
	 			return null;
			}
		}
	}
	
	//RING기본바탕 스타일
	function ringStyleCss(value, data, mapping) {
		var style = {
				'white-space' : 'pre-line'
		};
		
		if(value != null && value != undefined && value != "") {
			style['background-color'] = '#FFEAEA';
		} else {
			
		} 
		return style;
	}	 
	
	
	//RING비교후 테두리 스타일변경
	function ringInlineStyleCss(value, data, mapping, gridId) {
		if (chkDataSet == 2) {
			var fstRing = ringPathYN(data, "auto");
			var dataList = null;
			if(gridId == autoServicelineGrid) {
				dataList = $('#'+inputServiceListGrid).alopexGrid("dataGet");
			} else {
				dataList = $('#'+autoServicelineGrid).alopexGrid("dataGet");
			}

			var secRing = ringPathYN(dataList, "sel");
			
			if(dataList.length > 0) {
				//둘중 한군데에 링이 존재하지 않는 경우
				if(fstRing != secRing){
					if(nullToEmpty(data.RING_ID) != "") {
						return 'orgBorder1';	
					}
				}
				
				// 링 비교
				if(nullToEmpty(data.RING_ID) != "") {
					for(var i = 0; i < dataList.length; i++){
						if(nullToEmpty(dataList[i].RING_ID) != "") {
							//Ring Id가 서로 다른 경우
							if(data.RING_ID != dataList[i].RING_ID) {
								return 'orgBorder1';				
							}
						}
					}
				}
			}
		}
	}
	
	 /**
	  * 선번 삭제
	  */
	 function deleteSelectPath() {
	 	var dataList = $('#inputServiceListGrid').alopexGrid("dataGet", {_state : {selected:true}} );
	 	var selectCnt = dataList.length;
	 	var addYn = false;
	 	
	 	if(selectCnt <= 0){
	 		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
	 	} else {
	 		var dataDeleteCount = 0;
	 		for(var i = 0; i < dataList.length; i++ ) {
	 			var data = dataList[i];    		
	 			var rowIndex = data._index.data;
	 			
	 			$('#inputServiceListGrid').alopexGrid("dataDelete", {_index : { data:rowIndex }});
	 		}
	 	}
	 }


	/*
	 * 수집선번 회선 검색
	 */
	function searchGrid(gridId, param){

		var svlnLclCd = param.svlnLclCd;
		var svlnSclCd = param.svlnSclCd;
	
		if(gridId == autoServicelineGrid){
			searchParam = {"ntwkLineNo" : param.ntwkLineNo, "utrdMgmtNo" : utrdMgmtNo, "exceptFdfNe" : "N","svlnLclCd" : param.svlnLclCd, "svlnSclCd" : param.svlnSclCd, "reqPathJrdtMtsoList":"Y", "sFlag":"N"};

			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoSelectLinePath', searchParam, 'GET', 'selectAutoCmsPath');
			
		} 
	}

	/*
	 * 넘겨받은 입력선번을  NODES타입으로 변경
	 */
	function editInputDataGrid(inputServiceListGrid, param){
		if(param.editPath != undefined) {
			if(!param.teamsFlag) {
				var editPath = new TeamsPath();
				var tmpData = {
				 		 "PATH_DIRECTION" : null
				 		, "PATH_SAME_NO" : null
				 		, "PATH_SEQ" : null
				 		, "USE_NETWORK_PATHS" : []
				 		, "USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH" : false
				 		, "LINKS" : []
				} 
				// 기존 서비스회선 선번에 SMUX링 편집 선번을 추가함
				tmpData.LINKS = param.editPath;
				editPath.fromTangoPath(tmpData);
				teamsPathData = editPath.toData();		// 그리드	// 	
				$('#'+inputServiceListGrid).alopexGrid('dataSet', teamsPathData.NODES);
			} else {
				//시각화에서 넘어온 수집선번
				$('#'+inputServiceListGrid).alopexGrid('dataSet', param.editPath.NODES);
			}
			chkDataSet++;
			if (chkDataSet == 2) {
				ringAddDropCom();	//양쪽 링이 존재하는 경우 같은 RING에 정, 역방향만 다른 RING인지 판단
				styleSet();
				resultSummarySetting();
			}
		} 	
	}

	//삭제및 선번이동후 양쪽 색비교를 다시하기 위한 Refresh기능
	function styleSet() {
		$('#'+autoServicelineGrid + ', #'+inputServiceListGrid).alopexGrid({
			forceRefreshAllOnDataEdit : true
		});
	}

	 var httpRequest = function(Url, Param, Method, Flag ) {
	    	Tango.ajax({
	    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
	    		data : Param, //data가 존재할 경우 주입
	    		method : Method, //HTTP Method
	    		flag : Flag
	    	}).done(function(response){successCallback(response, Flag);})
	  	    .fail(function(response){failCallback(response, Flag);})
	 };
	 

	 function successCallback(response, flag) {
		 if (flag == "selectAutoCmsPath") {
			 if(response.autoLinePath.resultMsg != undefined) {
					alertBox('I', response.autoLinePath.resultMsg); /* 조회 실패 하였습니다.*/
			 }
			 if(response.autoLinePath.baseInfo != undefined) {
				$('#popLineNmSpan_a').text(response.autoLinePath.baseInfo.lineNm); //회선명
				$('#popSvlnNoSpan_a').text(response.autoLinePath.baseInfo.svlnNo); //서비스회D
				//$('#popSvlnNoSpan_a').text(response.autoLinePath.serialNo.eqpSerNoVal);	//DU-L시리얼번호
				//$('#popSvlnLclCdNmSpan_a').text(response.data.LINE_LARGE_NM+ " - "+ response.data.LINE_SMALL_NM);	//서비스회선분류
			 }
			 if(response.erpInfo != undefined) {
					$('#popLowIntgFcltsCdSpan').text(response.erpInfo.lowIntgFcltsCd); //통합시설코드
					$('#popPrntBmtsoCdSpan').text(response.erpInfo.prntBmtsoCd);	//모기지국통합시설코드
					$('#popPrntBmtsoNmSpan').text(response.erpInfo.prntBmtsoNm);	//모기지국통합시설코드명
			}
			// 검증 결과 확인을 위한 국사 정보 설정
			if(response.autoLinePath.data != undefined) {
				
				originalPath = response.autoLinePath.data;
				teamsPath = new TeamsPath();
				teamsPath.fromTangoPath(originalPath);
				teamsPathData = teamsPath.toData();		// 그리드

				$('#'+autoServicelineGrid).alopexGrid('dataSet', teamsPathData.NODES);		
			}
			
			//수집선번의 데이터가 셋팅되면 입력선번의 그리드를 다시 그린다. (비교색을 위해서...)
			chkDataSet++;
			if (chkDataSet == 2) {
				ringAddDropCom();	//양쪽 링이 존재하는 경우 같은 RING에 정, 역방향만 다른 RING인지 판단
				styleSet();
				resultSummarySetting();
			}
		 }
	 }
	 
	 function failCallback(response, status, flag) {

		cflineHideProgressBody();
		 if ( flag == 'servicelineRuRptOptlList' || flag == 'searchLno' || flag == 'optlSet' || flag == 'deleteOptl' ) {
			 cflineHideProgressBody();
	    	 alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
		 }
		 
		 if ( flag == 'checkRpetrForOptlSet' ) {
			 cflineHideProgressBody();
	    	 alertBox('I', cflineMsgArray['saveFail']); /* 저장에 실패 하였습니다.*/
		 }
	 } 
	 

	 /*
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
	 	
	 	var val = nullToEmpty(data.NE_NM);
	 	if(val.indexOf("FDF") == 0 ) {
	 		return "FDF";
	 	}
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

	     var result = false;
	     var val = nullToEmpty(chkData.MODEL_ID);

	     var chkVal = [];
	     if (nullToEmpty(baseInfData) != "" && nullToEmpty(baseInfData.cotEqpMdlList) != "") {
	     	chkVal = baseInfData.cotEqpMdlList;
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
	     
	     result = isFiveGponOneCotOld(chkData, preFix);
	     return result;
	 }

	 /**
	  * isFiveGponOneCotOld
	  * 넘겨받은 데이터가 5G-PON 1.0 COT타입장비인지 체크
	  * @param data   LINK형태 데이터
	  * @param preFix LEFT/RIGHT 구분자
	  */
	 function isFiveGponOneCotOld(chkData, preFix) {
	 	//TODO 5G-PON 장비 추가
	 	// 5G-PON 1.0
	 	 /*
	      * 장비모델 ID 값으로 판별
	      * DMT0008327   5GPON_COT_쏠리드
	      * DMT0008330   5GPON_COT_HFR
	      * DMT0008333   5GPON_COT_썬웨이브텍
	      * DMT0008336   5GPON_COT_코위버(주)
	      * */
	     var result = false;
	     var val = nullToEmpty(eval("chkData." + preFix + "_MODEL_ID"));
	     
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

	     //var chkVal = ["DMT0009081", "DMT0009082", "DMT0009083", "DMT0009084",  "DMT0009085",  "DMT0009086",  "DMT0009087",  "DMT0009088"];
	     var chkVal = [];
	     if (nullToEmpty(baseInfData) != "" && nullToEmpty(baseInfData.mrnEqpMdlList) != "") {
	     	chkVal = baseInfData.mrnEqpMdlList;
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
	 	
	 	// 5G-PON 1.0
	    result = isFiveGponOneMrnOld(chkData, preFix);
	    return result;
	 	
	 }

	 /**
	  * isFiveGponMrnOneOld
	  * 넘겨받은 데이터가 5G-PON 1.0 MRN타입장비인지 체크
	  * @param data   LINK형태 데이터
	  * @param preFix LEFT/RIGHT 구분자
	  */
	 function isFiveGponOneMrnOld(chkData, preFix) {
	 	
	 	var result = false;
	     
	 	// 5G-PON 1.0
	     var val = nullToEmpty(eval("chkData." + preFix + "_CARD_MODEL_NM"));
	     
	     chkVal = ["5GPON_MAIN_RN_"];
	     for (var i = 0 ; i < chkVal.length ; i++) {
	         if (val.indexOf(chkVal[i]) == 0) {
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
	     if (nullToEmpty(baseInfData) != "" && nullToEmpty(baseInfData.crnEqpMdlList) != "") {
	     	chkVal = baseInfData.crnEqpMdlList;
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
	 	
	     result = isFiveGponOneCrnOld(chkData, preFix)
	     return result;
	 }


	 /**
	  * isFiveGponCrnOneOld
	  * 넘겨받은 데이터가 5G-PON 1.0 CRN타입장비인지 체크
	  * @param data   LINK형태 데이터
	  * @param preFix LEFT/RIGHT 구분자
	  */
	 function isFiveGponOneCrnOld(chkData, preFix) {
	 	
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
	     
	     var chkVal = ["5G DU-H", "ERP 기지국", "LTE DU"]; //장비타입명
	     for (var i = 0 ; i < chkVal.length ; i++) {
	         if (val == chkVal[i]) {
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
	         if (val == chkVal[i]) {
	             result =  true;
	             break;
	         }
	     }
	     return result;
	 }

	function groupingColumnPath() {
		var grouping = {
				by : ['RING_MERGE'], 
				useGrouping:true,
				useGroupRowspan:true,
				useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
				useGroupRearrange : false
		};
		
		return grouping;
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
		        
		        , { key : 'FIVE_GPON_EQP_TYPE', 			title : 'FIVE_GPON_EQP_TYPE', align : 'left', hidden: true }
		        

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
		        , { key : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD', 	title : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD', align : 'left', hidden: true }
		        , { key : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_NM', 	title : 'WDM_TRUNK_TOPOLOGY_CFG_MEANS_NM', align : 'left', hidden: true }
		];
		
		// ADD_DROP_TYPE_CD, ADD_DROP_TYPE_NM
		return addColumn;
	}
	
	/**
	 * 장비 툴팁
	 * @param value
	 * @param data
	 * @param mapping
	 */
	function tooltipText(value, data, mapping){
		var str = "삭제된 장비 또는 포트입니다.";
		var deletecheck = false;//checkDeleteNodeOrPort(data, mapping);
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
				str = '포트ID : ' + nullToEmpty(data.A_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.A_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.A_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.A_PORT_DUMMY);
			}
			else if ( mapping.key == 'B_PORT_DESCR' ) {
				str = '포트ID : ' + nullToEmpty(data.B_PORT_ID) + '\n포트명 : ' + nullToEmpty(data.B_PORT_DESCR) + '\n상태 : ' + nullToEmpty(data.B_PORT_STATUS_NM) + '\n더미포트 : ' + nullToEmpty(data.B_PORT_DUMMY);
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

	function deleteCheck(type, i, data){

		var delRowIndex = i;
		for(var idx = 0; idx < data.length; idx++){
			
		}
		$('#'+inputServiceListGrid).alopexGrid('dataDelete', {_index:{ row:delRowIndex }});
	}
	 
/* =============================================== 이하 백업소스임 ==================================================== */
	 //장비스타일
	/*function inlineStyleCssEqp(value, data, mapping, gridId){
		
		var chkResult = true;
		
  		var eqpType = getComFiveGPonEqpType(data, "set");
  		var style = styleCss(eqpType);
  		
		var fstNeID = data.NE_ID;
		var fstFiveGPonEqpType = getComFiveGPonEqpType(data, "set");
		var dataList = null;
  		if(gridId == autoServicelineGrid) {
  			dataList = $('#inputServiceListGrid').alopexGrid("dataGet");
  		} else {
  			dataList = $('#'+autoServicelineGrid).alopexGrid("dataGet");
  		}

		if(nullToEmpty(dataList) != ""){
			for(var idx = 0; idx < dataList.length; idx++){
				var secNeID = dataList[idx].NE_ID;
			 	var secFiveGPonEqpType = getComFiveGPonEqpType(dataList[idx], "set");

 				if(fstNeID == secNeID) {
 					if(fstFiveGPonEqpType == secFiveGPonEqpType){
 						//A_Port비교
 						if(data.A_PORT_DESCR == dataList[idx].A_PORT_DESCR) {
 							//A_Channel비교
 							if(data.A_CHANNEL_DESCR == dataList[idx].A_CHANNEL_DESCR) {
 								//B_Port비교
 		 						if(data.B_PORT_DESCR == dataList[idx].B_PORT_DESCR) {
 		 							//B_Channel비교
 		 							if(data.B_CHANNEL_DESCR == dataList[idx].B_CHANNEL_DESCR) {
 		 								chkResult = true;
 		 				 				return null;
 		 							}
 		 						}
 							}
 						} 
		 			} else {
		 				chkResult = false;
		 				return styleCss(fstFiveGPonEqpType);
		 			}
		 		} else {
		 			chkResult = false;
		 		}
			}
			
			if(!chkResult){
				return styleCss(fstFiveGPonEqpType);
			}
		} else {
			return styleCss(fstFiveGPonEqpType);
		}
	}*/

});	

