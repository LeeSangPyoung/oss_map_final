/**
 * PacketTrunkIndex.js
 *
 * @author P123512
 * @date 2018. 06. 11. 
 * @version 1.0
 * 
 */
var mgmtGrpCd = null;
var C00188Data = [];  // 관리구분데이타   comCd:comCdNm
var commBizrSkt = []; // 콤보박스용 리스트
var commBizrSkb = []; // 콤보박스용 리스트
var commBizrList = [];
var cellCommBizrList = [];
var	cellCommBizrSkt = [];
var cellCommBizrSkb = [];
var cellTrkTypCdList = [];

var serviceTypList = [];
var cellServiceList = [];
var main = $a.page(function() {
	var gridId = 'dataGrid';
	var gridWorkId = 'dataGridWork';
	var searchYn   = false ;
	var whole = cflineCommMsgArray['all'] /* 전체 */;
	var addData = false;
	
	var columnPacketInfo = columnMapping("PacketInfo");
	var columnWorkInfo = columnMapping("WorkInfo");
	
	var ringDigNtwkLineNo = null;
	
	var pageForCount = 200;
	this.init = function(id, param) {
    	setSelectCode();
    	setEventListener();
    	createGrid('All'); // 최초 그리드 셋팅 
    	$('#btnExportExcel').setEnabled(false);
    	$('#btnDupMtsoMgmt').setEnabled(false);
    	$('#btnWorkCnvt').setEnabled(false);
    	$('#btnUpdateWorkInfo').setEnabled(false);
    	$('#noteArea').hide();
    	$('#port').attr("readonly",true);
    	$('#port').css("background-color","silver");
    };

    function columnMapping(sType) {	//	PacketInfo: 패킷정보, WorkInfo: 작업정보
    	var em = sType == 'WorkInfo'? '<em class="color_red">*</em>': '';
    	var mapping = [
  			         { selectorColumn : true, width : '50px' } 
					    , {key : 'pktTrkNm',			   	align:'left',			width:'400px',	    title : em + cflineMsgArray['trunkNm'] ,editable:{type:"text"},	fixed : true  /*트렁크명 */ }
					    , {key : 'tlIdVal',              	align:'left',	        width:'300px',		title : cflineMsgArray['identification']			/* ID*/ }
						, {key : 'vlanVal',			    align:'center',		    width:'130px',		title : cflineMsgArray['virtualLocalAreaNetwork']	 /*VLAN*/  }
						, {key : 'topoSclCdNm',				align:'center',			width:'120px',		title : cflineMsgArray['service']+'타입'				 /*서비스타입*/  }
						, {key : 'svlnTypCdVal',				align:'center',			width:'130px',		title : cflineMsgArray['service']					 /*서비스*/ , 
							render : {
			      	    		type : 'string',
			      	    		rule : function(value, data) {
			      	    			if(sType !=  'WorkInfo'){
			      	    				var render_data = [];
				      	    			if(cellServiceList.length > 1) {
				      	    				return render_data = render_data.concat(cellServiceList);
				      	    			}else {
				      	    				return render_data.concat({value : data.svlnTypCdVal, text : data.svlnTypCdNm });
				      	    			}
			      	    			} else {
			      	    				var render_data = [];
			      	    				render_data = render_data.concat({value : '', text : "선택"});
			      	    				render_data = render_data.concat(cellServiceList);
			      	    				return render_data;
			      	    			}
			      	    		}	
							},
							editable:{
			      	    		type:"select", 
			      	    		rule : function(value, data){
			      	    			var render_data = [];
			      	    			render_data = render_data.concat({value : '', text : "선택"});
		      	    				render_data = render_data.concat(cellServiceList);
		      	    				return render_data;
			      	    		}, attr : {
		  			 				style : "width: 115px;min-width:115px;padding: 2px 2px;"
		  			 			}
			      	    	},
			  				editedValue : function(cell) {
			  					return $(cell).find('select option').filter(':selected').val(); 
			  				}
						}
						, {key : 'trkTypCdVal',				align:'center',			width:'130px',		title : cflineMsgArray['configuration']+cflineMsgArray['frm'] /*구성형태*/ ,
							render : {
			      	    		type : 'string',
			      	    		rule : function(value, data) {
			      	    			if(sType !=  'WorkInfo'){
			      	    				var render_data = [];
				      	    			if(cellTrkTypCdList.length > 1) {
				      	    				return render_data = render_data.concat(cellTrkTypCdList);
				      	    			}else {
				      	    				return render_data.concat({value : data.trkTypCdVal, text : data.trkTypCdNm });
				      	    			}
			      	    			} else {
			      	    				var render_data = [];
			      	    				render_data = render_data.concat({value : '', text : "선택"});
			      	    				render_data = render_data.concat(cellTrkTypCdList);
			      	    				return render_data;
			      	    			}
			      	    		}	
							},
							editable:{
			      	    		type:"select", 
			      	    		rule : function(value, data){
			      	    			var render_data = [];
			      	    			render_data = render_data.concat({value : '', text : "선택"});
		      	    				render_data = render_data.concat(cellTrkTypCdList);
		      	    				return render_data;
			      	    		}, attr : {
		  			 				style : "width: 115px;min-width:115px;padding: 2px 2px;"
		  			 			}
			      	    	},
			  				editedValue : function(cell) {
			  					return $(cell).find('select option').filter(':selected').val(); 
			  				}	
						}
						, {key : 'cirVal',				align:'center',			width:'130px',		title : "CIR(Min)"									 /*CIR(Min)*/  }
						, {key : 'pirVal',				align:'center',			width:'130px',		title : cflineMsgArray['passiveInfraredRay']+"(Max)" /*PIR(Max)*/  }
						, {key : 'ring1Id',				align:'right',			width:'90px',		title : "ring1Id"	,   hidden : true	  }
						, {key : 'ring1Nm',				align:'left',			width:'250px',		title : cflineMsgArray['ring']+"#1"	,editable:{type:"text"}				 /*링#1*/  }
						, {title : cflineMsgArray['ring'] + cflineMsgArray['blockDiagram'] + "#1",	align:'center',	width: '80px'  
			           		, render : function(value, data, render, mapping) {
			           			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnRing1Pop" type="button"></button></div>';
			           			}
			               }		/* 링구성도 #1 */
						, {key : 'ring1MatchNm',				align:'right',			width:'90px',		title : "ring1MatchNm"	,   hidden : true	  }
						, {key : 'ringMtchVal1',				align:'right',			width:'80px',		title : "매칭건수#1" ,  inlineStyle :	{ cursor: 'pointer' ,  color: 'blue' } /*매칭건수#1*/ }
						, {key : 'eqp1Nm',				align:'left',			width:'250px',		title : cflineMsgArray['equipmentName']+"#1"		 /*장비명#1 */ }
						, {key : 'eqpPortVal1',				align:'center',			width:'120px',		title : cflineMsgArray['port']+"#1"					 /*PORT#1 */ }
						, {key : 'ring2Id',				align:'right',			width:'90px',		title : "ring2Id"	,   hidden : true	  }
						, {key : 'ring2Nm',				align:'left',			width:'250px',		title : cflineMsgArray['ring']+"#2"	,editable:{type:"text"}				 /*링#2*/  }
						, {title : cflineMsgArray['ring'] + cflineMsgArray['blockDiagram'] + "#2",	align:'center',	width: '80px'  
			           		, render : function(value, data, render, mapping) {
			           			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnRing2Pop" type="button"></button></div>';
			           			}
			               }		/* 링구성도 #2 */
						, {key : 'ring2MatchNm',				align:'right',			width:'90px',		title : "ring2MatchNm"	,   hidden : true	  }
						, {key : 'ringMtchVal2',				align:'right',			width:'80px',		title : "매칭건수#2"	,inlineStyle :	{ cursor: 'pointer' ,  color: 'blue' }  /*매칭건수#2  */}
						, {key : 'eqp2Nm',				align:'left',			width:'250px',		title : cflineMsgArray['equipmentName']+"#2"		 /*장비명#2  */}
						, {key : 'eqpPortVal2',				align:'center',			width:'120px',		title : cflineMsgArray['port']+"#2"					 /*PORT#2  */}
						, {key : 'rtEqpPortVal',				align:'center',			width:'120px',		title : cflineMsgArray['drop']+cflineMsgArray['port'] /*DROP포트  */}
						, {key : 'tlNm1',				align:'left',			width:'320px',		title : "TUNNEL#1"									 /*TUNNEL#1  */}
						, {key : 'tlNm2',				align:'left',			width:'320px',		title : "TUNNEL#2"									 /*TUNNEL#2  */}
						, {key : 'commBizrIdVal',			align:'center',			width:'130px',		title : em + cflineMsgArray['businessMan']		,		 /*사업자  */
							render : {
			      	    		type : 'string',
			      	    		rule : function(value, data) {
			      	    			if(sType !=  'WorkInfo'){
			      	    				var render_data = [];
				      	    			if(cellCommBizrList.length > 1) {
				      	    				return render_data = render_data.concat(cellCommBizrList);
				      	    			}else {
				      	    				return render_data.concat({value : data.bizCd, text : data.bizNm });
				      	    			}
			      	    			} else {
			      	    				var render_data = [];
				      	    			if (mgmtGrpCd == '0001') {
				      	    				render_data = render_data.concat(cellCommBizrSkt);
				      	    				return render_data;
				      	    			} else {
				      	    				render_data = render_data.concat(cellCommBizrSkb);
				      	    				return render_data;
				      	    			}
			      	    			}
			      	    		}	
							},
							editable:{
			      	    		type:"select", 
			      	    		rule : function(value, data){
			      	    			var render_data = [];
			      	    			if (mgmtGrpCd == '0001') {
			      	    				render_data = render_data.concat(cellCommBizrSkt);
			      	    				return render_data;
			      	    			} else if (mgmtGrpCd == '0002') {
			      	    				render_data = render_data.concat(cellCommBizrSkb);
			      	    				return render_data;
			      	    			} else  {
			      	    				render_data = render_data.concat(cellCommBizrList);
			      	    				return render_data;
			      	    			}
			      	    			
			      	    		}, attr : {
		  			 				style : "width: 115px;min-width:115px;padding: 2px 2px;"
		  			 			}
			      	    	},
			  				editedValue : function(cell) {
			  					return $(cell).find('select option').filter(':selected').val(); 
			  				}
						}
						, {key : 'mgmtGrpCdNm',				align:'center',			width:'130px',		title : cflineMsgArray['managementGroup']	 /*관리그룹  */}
						, {key : 'lineOpenDt',				align:'center',			width:'130px',		title : cflineMsgArray['openingDay'],editable:{type:"text"}	/*개통일  */}
						, {key : 'lastChgDate',				align:'center',			width:'130px',		title : cflineMsgArray['modification']+cflineMsgArray['day'] /*수정일  */}
						, {key : 'umtsoNm',					align:'center',			width:'150px',		title : cflineMsgArray['upperMtso']					/* 상위국사*/  }
						, {key : 'lmtsoNm',					align:'center',			width:'150px',		title : cflineMsgArray['lowerMtso']					/* 하위국사*/  }
						, {key : 'areaCtrMtsoId',			align:'center',			width:'150px',		title : cflineMsgArray['centerMtso'], hidden : true		 /*중심국사*/   }
						, {key : 'areaCmtsoNm',				align:'center',			width:'190px',		title : cflineMsgArray['centerMtso'],editable:{type:"text"}		 /*중심국사*/   }
						, {key : 'areaCmtsoMatchNm',		align:'center',			width:'150px',		hidden: true,	title : cflineMsgArray['centerMtso']   }
						, {key : 'ntwkRmk1',				align:'left',			width:'160px',		title : cflineMsgArray['remark1']	,editable:{type:"text"}				 /*비고1*/  }
						, {key : 'ntwkRmk2',				align:'left',			width:'160px',		title : cflineMsgArray['remark2']	,editable:{type:"text"}				 /*비고2 */ }
						, {key : 'ntwkRmk3',				align:'left',			width:'160px',		title : cflineMsgArray['remark3']	,editable:{type:"text"}				 /*비고3*/  }
						, {key : 'pktTrkNo',				align:'center',			width:'170px',		title : cflineMsgArray['trunkIdentification']		 /*트렁크ID*/  }
			];
		return mapping;
    }
    
    // select 조회조건 코드 세팅
    function setSelectCode() {
    	createMgmtGrpSelectBox ("mgmtGrpCd", "ALL", "SKT");
    	setSearchCode("orgId", "teamId", "topMtsoIdList");
    	searchUserJrdtTmofInfo("topMtsoIdList");

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getbizcdlist', null, 'GET', 'bizrCdList');  // 사업자
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getservicetyplist', null, 'GET', 'serviceTypList'); //서비스타입
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getservicelist', null, 'GET', 'serviceList'); // 서비스
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/gettrktypcdlist', null, 'GET', 'trkTypCdList'); // 구성형태
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188Data'); // 관리그룹
    }
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
                }, 
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                  	if (resultCode == "OK") {
                  		//$('#btnSearch').click();
                  	}
               	}
        });
    }
    
    // mgmtGrpCd: 관리그룹, hdofcCd: 본부, teamCd: 팀, topMtsoIdList: 전송실, mtso: 국사
    function setEventListener() {
    	//탭 선택 이벤트
    	$("#basicTabs").on("tabchange", function(e,index){
    		if(index == 0){
    			$("#"+gridId).alopexGrid("viewUpdate");
    			var selectedId = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
    			btnEnableProc(gridId, "btnDupMtsoMgmt", "btnWorkCnvt", "A");
    			if($('#'+gridId).alopexGrid("dataGet").length <= 0){
    				$('#btnExportExcel').setEnabled(false);
    			} else {
    				$('#btnExportExcel').setEnabled(true);
    			}
    		}else if(index == 1){
    			$("#"+gridWorkId).alopexGrid("viewUpdate");
    			var selectedId = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
    			btnEnableProc(gridWorkId, "btnDupMtsoMgmt", "btnWorkCnvt", "B");
    			if($('#'+gridWorkId).alopexGrid("dataGet").length <= 0){
    				$('#btnExportExcel').setEnabled(false);
    			} else {
    				$('#btnExportExcel').setEnabled(true);
    			}
    		}
    	});
    	
        // 작업정보에서 작업정보 선택시 전송실설정버튼 활성화, 선택해제시 비활성화
        $('#'+gridWorkId).on("click", function(e){
        	var selectedId = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
        	btnEnableProc2(gridWorkId, "btnDupMtsoMgmt");
			if(selectedId.length > 0) {
				$('#btnUpdateWorkInfo').setEnabled(true);
			}else {
				$('#btnUpdateWorkInfo').setEnabled(false);
			}
        });
        
        // 관리그룹 선택시
        $('#mgmtGrpCd').on('change',function(e){
 	 		changeMgmtGrp("mgmtGrpCd", "orgId", "teamId", "topMtsoIdList", "topMtsoIdList");
	   		if($('#mgmtGrpCd').val() == '0001') {
	   			$('#commBizrId').setData({data : commBizrSkt});
	   		} else if($('#mgmtGrpCd').val() == '0002'){
	   			$('#commBizrId').setData({data : commBizrSkb});
	   		} else {
	   			$('#commBizrId').setData({data : commBizrList});
	   		}
 	   	}); 
    	
    	// 본부 선택시
     	$('#orgId').on('change',function(e){
     		changeHdofc("orgId", "teamId", "topMtsoIdList", "topMtsoIdList");
       	});    	 
   		// 팀 선택시
     	$('#teamId').on('change',function(e){
     		changeTeam("teamId", "topMtsoIdList", "topMtsoIdList");
       	});

        //	패킷 정보 스크롤 시 페이징
        $('#'+gridId).on('scrollBottom', function(e){
        	addData = true;
        	setGrid(pageForCount,pageForCount,"PacketInfo");
    	});
        
        // 작업 정보 스크롤 시 페이징
        $('#'+gridWorkId).on('scrollBottom', function(e){
        	addData = true;
        	setGrid(pageForCount,pageForCount,"WorkInfo");
    	});
    	
	    // 조회 
   	 	$('#btnSearch').on('click', function(e) {
   	 		mgmtGrpCd = $('#mgmtGrpCd').val();
			searchYn = true;
			addData = false;
			setGrid(1,pageForCount,"All");
        });
	   	 	
	   	//기본정보 상세팝업
	       $('#' + gridId).on('click', '.bodycell', function(e) {
	       detailPop(e);
	   	});
	       
		//작업정보 상세팝업
	    $('#' + gridWorkId).on('click', '.bodycell', function(e) {
	       detailPop(e);
	   	});
	   	 	
   	 	// 전송실설정 
   	 	$('#btnDupMtsoMgmt').on('click', function(e) {
   	 		var element =  $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
   	 		var selectCnt = element.length;
   	 		
   			if(selectCnt <= 0){
   				alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
   			}else{
   				var paramMtso = null;
   				var paramList = [element.length];
   				var mgmtGrpStr = "";
   				var mgmtGrpChk = "N";
   					if(selectCnt==1){
   						paramMtso = {"multiYn":"N", "mgmtGrpCd":element[0].mgmtGrpCdVal, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "pktTrkNoList":element[0].pktTrkNo, "lowMtsoId":element[0].lowMtsoId, "uprMtsoId":element[0].uprMtsoId};
   					}else{
   						alertBox('I', cflineMsgArray['selectOnlyOneItem']); /* 여러개가 선택되었습니다. 하나만 선택하세요. */
   						return false;
   					}
   					
   					$a.popup({
   		    		  	popid: "pktTmofEstPop",
   		    		  	title: cflineMsgArray['jrdtTmofEst'] /*관할전송실 설정*/,
   		    			url: $('#ctx').val()+'/configmgmt/cfline/PktTmofEstPop.do',
   		    			data: paramMtso,
   		    		    iframe: true,
   		    			modal: false,
   		    			movable:true,
   		    			windowpopup : true,
		    			width : 600,
		    			height :750,
   		    			callback:function(data){
	    					if(data != null){
	    						if (data=="Success"){
	    	 						setGrid(1,pageForCount,"All");
	     						}
	    					}
   		    			}
   		    		});
   				}	 
        });
 
		// 작업정보 그리드 클릭시
		$('#'+gridWorkId).on('click', function(e) {
        	var object = AlopexGrid.parseEvent(e);
        	var data = AlopexGrid.currentData(object.data);
        	var selectedId = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
        	
        	if (data == null) {
        		return false;
        	}
        	// 개통일
        	if (object.mapping.key == "lineOpenDt") {
        		if ( data._state.focused) {
        			var keyValue = object.mapping.key;
        			datePicker(gridWorkId, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
        		}
        	}
		});
		
		// 작업정보 그리드 더블클릭시
		$('#'+gridWorkId).on('dblclick', function(e) {
			var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
     		
     		var param = dataObj._state.editing[dataObj._column];
     		// 링명 #1 , 링명 #2
 			if(object.mapping.key == "ring1Nm") {
 				if(nullToEmpty(data.ring1Nm) == "" ) {
 					alertBox('I', "링명을 입력해주세요." );
 					return false;
 				} else {
 					if ( data._state.focused) {
            			searchRingPop(e);
            		}
 				}
 			} else if(object.mapping.key == "ring2Nm") {
 				if(nullToEmpty(data.ring2Nm) == "" ) {
 					alertBox('I', "링명을 입력해주세요." );
 					return false;
 				} else {
 					if ( data._state.focused) {
            			searchRingPop(e);
            		}
 				}
 			} else if (object.mapping.key == "areaCmtsoNm") {
				if ( data._state.focused) {
					searchCtrMtso(null,data.mgmtGrpCdVal,null,param,dataObj);
        		}
 			}
		});
		
     	// 작업정보 엔터 이벤트
     	$('#'+gridWorkId).on('keydown', function(e){
     		var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
        	
        	var param = dataObj._state.editing[dataObj._column];
     		if (e.which == 13  ){
     			// 링명 #1 , 링명 #2
     			if(object.mapping.key == "ring1Nm") {
     				if(nullToEmpty(data.ring1Nm) == "" ) {
     					alertBox('I', cflineMsgArray['CheckRingName'] );/* 링명을 입력해주세요. */
     					return false;
     				} else {
     					if ( data._state.focused) {
                			searchRingPop(e);
                		}
     				}
     			} else if(object.mapping.key == "ring2Nm") {
     				if(nullToEmpty(data.ring2Nm) == "" ) {
     					alertBox('I', cflineMsgArray['CheckRingName'] );/* 링명을 입력해주세요. */
     					return false;
     				} else {
     					if ( data._state.focused) {
                			searchRingPop(e);
                		}
     				}
     			} else if (object.mapping.key == "areaCmtsoNm") {
 					if ( data._state.focused) {
 						searchCtrMtso(null,data.mgmtGrpCdVal,null,param,dataObj);
            		}
     			}
     		}
     	});
     	
     	//콤보박스 엔터 이벤트
     	$('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			addData = false;
     			setGrid(1,pageForCount,"All");
     		}
     	});

   	 	// 엑셀업로드
	   	$('#btnAddExcel').on('click', function(e) {
	      	$a.popup({
	           	popid: 'PacketTrunkIndexExcelUploadPop',
	           	title: cflineMsgArray['svlnExcelUpload'], /*'서비스회선 엑셀업로드'*/
	           	iframe: true,
	           	modal : false,
	           	windowpopup : true,
	            url: $('#ctx').val() +'/configmgmt/cfline/PacketTrunkIndexExcelUploadPop.do',
	            data: null, 
	            width : 620,
	            height : 330 
	            ,callback: function(resultCode) {
		            if (resultCode == "OK") {
		                //$('#btnSearch').click();
		            }
	            }
	       	 	,xButtonClickCallback : function(el){
	       	 		alertBox('W', cflineMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
	       	 		return false;
	       	 	}
	        });
	    });   
	   	
	   	// 패킷정보 그리드 : 링구성도 클릭시 링구성도#1(팝업)
	   	$('#'+gridId).on('click', '#btnRing1Pop', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var dataParam = {
					"ntwkLineNo" : dataObj.ring1Id
			}
			
			ringDigNtwkLineNo = dataObj.ring1Id;
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/selectNetworkPathId', dataParam, 'GET', 'selectNetworkPathId');
		});
	   	
	   	// 패킷정보 그리드 : 링구성도 클릭시 링구성도#2(팝업)
	   	$('#'+gridId).on('click', '#btnRing2Pop', function(e){
	   		var dataObj = AlopexGrid.parseEvent(e).data;
			var dataParam = {
					"ntwkLineNo" : dataObj.ring2Id
			}
			
			ringDigNtwkLineNo = dataObj.ring2Id;
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/selectNetworkPathId', dataParam, 'GET', 'selectNetworkPathId');
		});
	   	
		// 패킷작업정보 그리드 : 링구성도 클릭시 링구성도#1(팝업)
	   	$('#'+gridWorkId).on('click', '#btnRing1Pop', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			var dataParam = {
					"ntwkLineNo" : dataObj.ring1Id
			}
			
			ringDigNtwkLineNo = dataObj.ring1Id;
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/selectNetworkPathId', dataParam, 'GET', 'selectNetworkPathId');
		});
	   	
	   	// 패킷작업정보 그리드 : 링구성도 클릭시 링구성도#2(팝업)
	   	$('#'+gridWorkId).on('click', '#btnRing2Pop', function(e){
	   		var dataObj = AlopexGrid.parseEvent(e).data;
			var dataParam = {
					"ntwkLineNo" : dataObj.ring2Id
			}
			
			ringDigNtwkLineNo = dataObj.ring2Id;
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/selectNetworkPathId', dataParam, 'GET', 'selectNetworkPathId');
		});
	   	
   	 	// 작업전환
   	 	$('#btnWorkCnvt').on('click', function(e) {
   	 		fnWorkCnvt();
        });
   	 	
        // 패킷정보 그리드에서 패킷트렁크 선택시 작업전환버튼 활성화, 선택해제시 비활성화
        $('#'+gridId).on("click", function(e){
        	btnEnableProc2(gridId, "btnWorkCnvt");
        });
	   	
    	//장비명 입력시
    	$('#equipmentName').on('input', function(e) {
    		if($('#equipmentName').val() == '' || $('#equipmentName').val() == null ) {
    			$('#port').attr("readonly",true);
    			$('#port').css("background-color","silver");
    			$('#port').val(null);
    		} else {
    			$('#port').attr("readonly",false);
    			$('#port').css("background-color","white");
    		}
    	});
    	
		// 작업정보저장
		$('#btnUpdateWorkInfo').on('click', function(e){
			fnUpdateWorkInfo();
		});
    }     
    
	// 그리드 편집모드시 달력
    function datePicker(gridId, cellId, rowIndex, keyValue){
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		var insertDate = dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
    		$('#' + gridId + '').alopexGrid("cellEdit", insertDate, {_index : { row : rowIndex }}, keyValue);
		});
    }
    
    // 링 구성도 팝업
    function showRingAddDropPop(response) { 
    	$a.popup({
	   		popid: "selectAddDrop",
			title: cflineMsgArray['ring']+" "+cflineMsgArray['blockDiagram'] /*링 구성도*/,
			url: $('#ctx').val()+'/configmgmt/cfline/RingDiagramPop.do',
			data: {"ntwkLineNo" : ringDigNtwkLineNo, "ntwkLnoGrpSrno" : response}, 
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			//width : 600,
			width : 1400,
			//height : window.innerHeight * 0.8
			height : 900
		});
    }
    
    
    // 작업전환
    function fnWorkCnvt(){
		if( $('#'+gridId).length == 0) return;  // 그리드가 존재하지 않는 경우
		var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		var paramDataList = [];
		var tempPktTrkNm = "";
		var chkTrmn = 0;
		msgVal = "";
		if (dataList.length > 0 ){
			for(k=0; k<dataList.length; k++){
				if(dataList[k].pktTrkWorkYn == "N" 
					&& dataList[k].workMgmtYn == "Y"   /*사용자관할전송실여부*/
				    && dataList[k].ntwkStatCdVal !='02'   /*네트워크상태값 : 해지 아닌것만*/
						){	
					paramDataList.push({ 
										"pktTrkNo":dataList[k].pktTrkNo
										, "tmpIndex":dataList[k]._index.row
							            , "mtsoLnoInsProgStatCd":"02"
 							            , "singleMtsoIdYn":false
 							           });
					dataList[k].pktTrkWorkYn = "Y";
				}else{
					tempPktTrkNm = dataList[k].pktTrkNm;
					if (dataList[k].ntwkStatCdVal =='02') {
						tempPktTrkNm = tempPktTrkNm + "(" + "해지" + ")";
						chkTrmn = chkTrmn +1;
					}
					if(msgVal==""){
						msgVal = tempPktTrkNm
						
					}else{
						msgVal += "," + tempPktTrkNm;
					}
				}
			}
			
			for(j=0; j<paramDataList.length; j++){	
				// 해지회선 이외
				if (paramDataList[j].ntwkStatCdVal !='02') {
					$('#'+gridId).alopexGrid("updateOption", {
						rowOption : {_index:{row:paramDataList[j].tmpIndex}}, color: 'red'
					});					
				}
			}
			if(msgVal != null && msgVal != ""){ // 메세지 세팅
				msgVal =  cflineMsgArray['packetTrunkName']/*패킷트렁크명*/ + makeArgMsg('preRegistration',"[" + [msgVal] + "]","","","")/* {0}는(은) 이미 작업정보로 등록되었습니다. */;
			}
			if (chkTrmn > 0) {
				msgVal = msgVal + "(" + "해지회선은 제외됨" + ")";
			}
			
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getWorkCnvt', paramDataList, 'POST', 'workCnvt');
		}else{
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
		}
    }

    //매칭 건수 상세 팝업
    function detailPop(e) {
    	var dataObj = AlopexGrid.parseEvent(e).data;
    	var dataKey = dataObj._key;
    	
    	var eventCellVal = parseInt(AlopexGrid.currentValue(dataObj,  dataKey));
    	if(dataKey == "ringMtchVal1" || dataKey == "ringMtchVal2" ) {
    		if(dataKey == "ringMtchVal1") {
    			var gridData = {
    				"ntwkLineNo" : dataObj.ringLstVal1
    				,"eqpNm" : dataObj.eqp1Nm
    				,"eqpPortVal" : dataObj.eqpPortVal1
    			};
    		} else if(dataKey == "ringMtchVal2") {
    			var gridData = {
    				"ntwkLineNo" : dataObj.ringLstVal2
    				,"eqpNm" : dataObj.eqp2Nm
    				,"eqpPortVal" : dataObj.eqpPortVal2
    			};
    		}
    		$a.popup({
    			popid: "PacketTrunkDetailPop",
    			title: "매칭 건수",		
    			url: $('#ctx').val()+'/configmgmt/cfline/PacketTrunkDetailPop.do',
    			data: gridData,
    			iframe: true,
    	    	modal : false,
    	    	windowpopup : true,
    			movable:true,
    			width : 1250,
    			height : 550,
    			callback:function(data){
    				if(data != null){
    				}
    				//다른 팝업에 영향을 주지않기 위해
    				$.alopex.popup.result = null;
    			}  
    		});
    	}
    }
    
    //링명 검색 상세 팝업
    function searchRingPop(e) {
    	var dataObj = AlopexGrid.parseEvent(e).data;
    	var dataKey = dataObj._key;
    	var msgStr = "";
    	
    	var param = dataObj._state.editing[dataObj._column];
    	
    	var gridData = { 
    			"pktTrkNo" : dataObj.pktTrkNo
    			,"ringNm"  : param
    	};
    	if (nullToEmpty(param) != ""  ) {
 			$a.popup({
    			popid: "PacketTrunkSearchRingPop",
    			title: "링명 검색",		
    			url: $('#ctx').val()+'/configmgmt/cfline/PacketTrunkSearchRingPop.do',
    			data: gridData,
    			iframe: true,
    	    	modal : false,
    	    	windowpopup : true,
    			movable:true,
    			width : 720,
    			height : 430,
    			callback:function(data){
    				if(data != null){
    	 				if(dataKey=='ring1Nm') {
	 						$('#' + gridWorkId + '').alopexGrid("cellEdit", data[0].ntwkLineNm, {_index : { row : dataObj._index.row }}, dataKey);	
    	 					$('#' + gridWorkId + '').alopexGrid("cellEdit", data[0].ntwkLineNm, {_index : { row : dataObj._index.row }}, "ring1MatchNm");
    	 					$('#' + gridWorkId + '').alopexGrid("cellEdit", data[0].ntwkLineNo, {_index : { row : dataObj._index.row }}, "ring1Id");
    	 					$("#"+gridWorkId).alopexGrid("updateOption");
    	 				}else if(dataKey=='ring2Nm') {
    	 					$('#' + gridWorkId + '').alopexGrid("cellEdit", data[0].ntwkLineNm, {_index : { row : dataObj._index.row }}, dataKey);
    	 					$('#' + gridWorkId + '').alopexGrid("cellEdit", data[0].ntwkLineNm, {_index : { row : dataObj._index.row }}, "ring2MatchNm");
    	 					$('#' + gridWorkId + '').alopexGrid("cellEdit", data[0].ntwkLineNo, {_index : { row : dataObj._index.row }}, "ring2Id");
    	 					$("#"+gridWorkId).alopexGrid("updateOption");
    	 				}
    				}
    				//다른 팝업에 영향을 주지않기 위해
    				$.alopex.popup.result = null;
    			}  
    		});
    	}
    }
    
    /**
     * Function Name : searchMtso
     * Description   : 국사 검색
     * ----------------------------------------------------------------------------------------------------
     * param    	 : searchDiv. 검색flag (upr - 상위국, low - 하위국, grid - 그리드)
     * 				   mgmtGrpCd. 사업자
     * 				   tmofId. 전송실 
     *                 mtsoNm. 국사명 
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function searchCtrMtso(searchDiv, mgmtGrpCd, tmofId, mtsoNm,dataObj){
    	var mgmtGrpNm = mgmtGrpCd == "0002"? "SKB":"SKT";

    	// paramValue : 사업자, 전송실, 국사명
 	 	var paramValue = { "mgmtGrpNm": mgmtGrpNm, "orgId" : "" , "teamId" : "", "tmof": "", "mtsoNm": mtsoNm, "regYn" : "Y", "mtsoStatCd" : "01" };
 	 	var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) ==""){
 			urlPath = "/tango-transmission-web";
 		}
 		
 		// 2017-04-06 국사 자동검색 기능제거
 		// 국사 조회 팝업 오픈 시 자동 검색
 		/*if(paramValue != null){
 			$.extend(paramValue,{"autoSearchYn":"Y"});
 		}*/
 		
 		$a.popup({
 		  	popid: "popMtsoSch",
 		  	title: cflineCommMsgArray['findMtso']/* 국사 조회 */,
 		  	url: urlPath + '/configmgmt/common/MtsoLkup.do',
 			data: paramValue,
 			iframe: true,
 		    modal : true,
 		    movable : true,
 			width : 950,
 			height : 750,
 			callback:function(data){
 				$('#' + gridWorkId + '').alopexGrid("cellEdit", data.mtsoId, {_index : { row : dataObj._index.row }}, "areaCtrMtsoId");
 				$('#' + gridWorkId + '').alopexGrid("cellEdit", data.mtsoNm, {_index : { row : dataObj._index.row }}, "areaCmtsoNm");
 				$('#' + gridWorkId + '').alopexGrid("cellEdit", data.mtsoNm, {_index : { row : dataObj._index.row }}, "areaCmtsoMatchNm");
 			}
 		}); 
    }
  
    // 엑셀배치실행
    function funExcelBatchExecute(){
    	cflineShowProgressBody();
    	//cflineShowProgress(workTotalCntGrid);
    	
    	var topMtsoIdList = [];
    	if (nullToEmpty( $("#topMtsoIdList").val() )  != ""  ){
    		topMtsoIdList =   $("#topMtsoIdList").val() ;	
    	}
    	
    	var dataParam =  $("#searchForm").getData();
    	
    	$.extend(dataParam,{topMtsoIdList: topMtsoIdList });
    	
    	var noRingData = false;					// 링정보 없음
    	
    	if($("input:checkbox[id='noRingData']").is(":checked")) {
    		noRingData = true;
    	}
    	$.extend(dataParam, {noRingData: noRingData});
    	
    	var overlapRingData = false;				// 링정보 중복
    	
    	if($("input:checkbox[id='overlapRingData']").is(":checked")) {
    		overlapRingData = true;
    	}
    	$.extend(dataParam, {overlapRingData: overlapRingData});
    	
    	var sWorkGrpWhereUse = false;		// 작업정보 조회시 조회조건 적용
    	
    	if($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked")) {
    		sWorkGrpWhereUse = true;
    	}
    	$.extend(dataParam, {sWorkGrpWhereUse: sWorkGrpWhereUse});
    	
    	var stabIndex = $('#basicTabs').getCurrentTabIndex();
    	
    	if (stabIndex =="0"){
    		dataParam.method = "packetTrunkInfo";
//                		dataParam.fileName = "패킷트렁크 회선정보";
    	}else if (stabIndex =="1"){
    		dataParam.method = "packetTrunkWorkInfo";
//                		dataParam.fileName = "패킷트렁크 작업정보";
    	}
    	
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
    
    // 배치상태확인
    function funExcelBatchExecuteStatus(){
 		//console.log("btnExcelBatchExecuteStatus S [" + jobInstanceId + "]"); 
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchExecuteStatus/'+jobInstanceId, null , 'GET', 'excelBatchExecuteStatus');
    }
    
    // 엑셀다운로드
    function funExcelDownload(){
    	cflineHideProgressBody();
    	// Excel File Download URL
    	var excelFileUrl = '/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchDownload';
    	//var excelFileUrl = 'excelDownload';
    	var $form=$( "<form></form>" );
		$form.attr( "name", "downloadForm" );
		//$form.attr( "action", excelFileUrl + "?jobInstanceId=" + $excelFileId.val() );
		$form.attr( "action", excelFileUrl + "?jobInstanceId=" + jobInstanceId );
		$form.attr( "method", "GET" );
		$form.attr( "target", "downloadIframe" );
		$form.append(Tango.getFormRemote());
		// jobInstanceId를 조회 조건으로 사용
		$form.append( "<input type='hidden' name='jobInstanceId' value='" + jobInstanceId + "' />" );
		$form.appendTo('body')
		$form.submit().remove();
    }
  
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
    function successCallback(response, status, jqxhr, flag){
    	// 관리그룹데이터셋팅
    	if(flag == 'C00188Data') {
    		C00188Data = response;
    	}
    	
    	// 작업전환   
    	if(flag == 'workCnvt'){	
    		cflineHideProgressBody();
    		if(response.Result == 'Success'){
    			var msgStr = "";
    			if(msgVal == ""){
    				msgStr = "(" + getNumberFormatDis(response.cnt) + ")";
    			}else{
    				msgStr = msgVal + "<br>" + "(" + getNumberFormatDis(response.cnt) + ")";
    			}
//        		msgStr = makeArgCommonMsg2('lineCountProc', response.tCnt, response.sCnt)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountTotal', response.tCnt, null)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountAuth', response.aCnt, null)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountWork', response.wCnt, null)
//  		          + "<br/>" + makeArgCommonMsg2('lineCountSuccess', response.sCnt, null);

        		callMsgBox('','I', makeArgMsg('processed',msgStr,"","",""), function(msgId, msgRst){ /* ({0})건 처리 되었습니다. */
					if (msgRst == 'Y') {
						searchYn = true ; 
						setGrid(1,pageForCount,"WorkInfo");
					}
            	});
    			cflineHideProgressBody();
    		}else if(response.Result == 'NODATA'){ 
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
  
		// 임차사업자 셋팅
		if(flag == 'bizrCdList') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			commBizrSkt.push({"uprComCd":"","value":"","text":whole});
			commBizrSkb.push({"uprComCd":"","value":"","text":whole});
			commBizrList.push({"uprComCd":"","value":"","text":whole});
			cellCommBizrList = response.list;
			for(var index = 0 ; index < response.list.length ; index++) { 
				if(response.list[index].uprComCd == '0001' ) {
					commBizrSkt.push(response.list[index]);
					cellCommBizrSkt.push(response.list[index]);
					commBizrList.push(response.list[index]);
				} else if(response.list[index].uprComCd == '0002') {
					commBizrSkb.push(response.list[index]);
					cellCommBizrSkb.push(response.list[index]);
					commBizrList.push(response.list[index]);
				} else {
					commBizrList.push(response.list[index]);
					commBizrSkt.push(response.list[index]);
					commBizrSkb.push(response.list[index]);
					cellCommBizrSkt.push(response.list[index]);
					cellCommBizrSkb.push(response.list[index]);
				}
			}
			$('#commBizrId').setData({data : commBizrSkt});
		}
		
		// 서비스타입 셋팅
		if(flag == 'serviceTypList') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			serviceTypList = response.list;
			serviceTypList.unshift({"uprComCd":"","value":"","text":whole});
			$('#topoSclCdVal').setData({data : serviceTypList});
		}
		
		// 서비스 셋팅
		if(flag == 'serviceList') {
			cellServiceList = response.list;
		}
		
		// 구성형태 셋팅
		if(flag == 'trkTypCdList') {
			cellTrkTypCdList = response.list;
		}
		
    	// 패킷정보조회
    	if(flag == 'searchPacketInfo') {
    		var data = response.getPacketTrunkList;
    		if(data.length == 0){
    			cflineHideProgress(gridId);
    			addData = false;
    			return false;
    		}
    		renderGrid(gridId, data,null, response.getPacketTrunkListCnt);
    	  	if(addData){
    	  		$('#'+gridId).alopexGrid("dataAdd", response.getPacketTrunkList);
    	  		addData = false;
    	  	} else {
    	  		$('#'+gridId).alopexGrid("dataSet", response.getPacketTrunkList);
    	  	}
    	  	cflineHideProgress(gridId);
    	}
    	
    	// 작업정보조회
    	if(flag == 'searchWorkInfo') {
    		var data =  response.getPacketTrunkWorkList;
    		if(data.length == 0){
    			cflineHideProgress(gridWorkId);
    			addData = false;
    			return false;
    		}
    		renderGrid(gridWorkId, data, null, response.getPacketTrunkWorkListCnt);
    	  	if(addData){
    	  		$('#'+gridWorkId).alopexGrid("dataAdd", response.getPacketTrunkWorkList);
    	  		addData = false;
			}else{
				$('#'+gridWorkId).alopexGrid("dataSet", response.getPacketTrunkWorkList);
    		}
    	  	cflineHideProgress(gridWorkId);
    	  	$('#'+gridWorkId).alopexGrid("startEdit");
    	}
    	
    	// 전체조회
    	if(flag == 'searchAll') {
    		var data = response.getPacketTrunkList;
    		renderGrid(gridId, data, null , response.getPacketTrunkListCnt);
    	  	data = response.getPacketTrunkWorkList;
    	  	renderGrid(gridWorkId, data, null, response.getPacketTrunkWorkListCnt);
			if(addData){
				$('#'+gridId).alopexGrid("dataAdd", response.getPacketTrunkList);
				$('#'+gridWorkId).alopexGrid("dataAdd", response.getPacketTrunkWorkList);
				addData = false;
			}else{
				$('#'+gridId).alopexGrid("dataSet", response.getPacketTrunkList);
				$('#'+gridWorkId).alopexGrid("dataSet", response.getPacketTrunkWorkList);
    		}

			var totalCount = response.getPacketTrunkListCnt + response.getPacketTrunkWorkListCnt;
	    	if(totalCount > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}
			
    		cflineHideProgressBody();
			$('#'+gridWorkId).alopexGrid("startEdit");
    	}
   
    	// 작업정보저장
    	if(flag == 'updateWorkInfo'){
    		if(response.returnCode == '200'){
    			cflineHideProgressBody();
    			callMsgBox('','I', cflineMsgArray['saveSuccess'], function(msgId, msgRst){ /* 저장을 완료 하였습니다.*/ 
            		if (msgRst == 'Y') {
                		searchYn = true ; 
               		 	setGrid(1,pageForCount,"All");
            		}
            	});
    			cflineHideProgressBody();
    		}else if(response.returnCode == '500'){
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	// 작업정보완료 , 모든작업정보완료 
    	if(flag == 'workInfoFinish'){
    		cflineHideProgressBody();
    		if(response.Result == 'Success'){ 

    			msgStr = "(" + response.cnt + ")";
    			callMsgBox('','I',makeArgMsg('processed',msgStr,"","",""), function(msgId,msgRst){ /* ({0})건 처리 되었습니다. */
    				if(msgRst == 'Y'){
    					searchYn = true ;
    					setGrid(1,pageForCount,"All");
    				}
    			});
    			cflineHideProgressBody();
    		}else if(response.Result == 'NODATA'){ 
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	if(flag == 'excelDownload') {
    		cflineHideProgressBody();
    		var $form=$('<form></form>');
    		$form.attr('name','downloadForm');
    		//$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
    		$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/exceldownload");
    		$form.attr('method','GET');
//			$form.attr('method','POST');
    		$form.attr('target','downloadIframe');
    		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
    		$form.append(Tango.getFormRemote());
    		$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
    		$form.appendTo('body');
    		$form.submit().remove();
    	}
    	if(flag == 'excelBatchExecute') {
//			cflineHideProgressBody();
//			console.log("excelBatchExecute");
//			console.log(response);
			if(response.returnCode == '200'){ 
				//console.log("response.resultData.jobInstanceId S>>" + response.resultData.jobInstanceId);
				jobInstanceId  = response.resultData.jobInstanceId;
				cflineHideProgressBody();
				//$('#excelFileId').val(response.resultData.jobInstanceId );
				excelCreatePop(jobInstanceId);
				//funExcelBatchExecuteStatus();
			}else if(response.returnCode == '500'){ 
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
			}
    	}
    	
    	if(flag == 'excelBatchExecuteStatus') {
    		//console.log("response.resultData.jobStatus >>" + response.resultData.jobStatus);
   		 	if(response.returnCode == '200'){ 	
    			var jobStatus  = response.resultData.jobStatus ;
    			/*jobStatus ( ok | running | error )*/
    			if (jobStatus =="ok"){
    				//엑셀파일다운로드 활성화
    				funExcelDownload();
    			}else if (jobStatus =="running"){
    				//10초뒤 다시 조회
    				setTimeout(function(){ funExcelBatchExecuteStatus(); } , 1000*5 );
    			}else if (jobStatus =="error"){
    				cflineHideProgressBody();
    				//setTimeout(funExcelBatchExecuteStatus() ,50000);
    				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    			}
    		}else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    			/*alert('실패 되었습니다.  ');*/
    			alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
    	
    	// 링구성도를 위한 선번그룹일련번호 
    	if(flag == 'selectNetworkPathId') {
    		showRingAddDropPop(response);
    	}
    }
    
	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'searchAll'){
    		/*alert('실패');*/
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'workCnvt'){
    		/*alert('실패');*/
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	if (flag == 'checklnsctninfo') {
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
    // 그리드 랜더링
    function renderGrid(gridDiv, data, addColumn, totalCount){
    	var group = "";
    	var columnDiv = "";
    	// 그리드 컬럼 초기화
    	if(gridDiv == gridId){
    		group = "totalCntSpan";
    		columnDiv = "PacektInfo";
    	} 
    	else {
    		group = "workTotalCntSpan";
    		columnDiv = "WorkInfo";
    	}
    	
    	if(totalCount > 0){
			$('#btnExportExcel').setEnabled(true);
    	}
    	else{
    		$('#btnExportExcel').setEnabled(false);
    	}
   	
		$('#'+gridDiv).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineMsgArray['totalCnt']+' : ' + getNumberFormatDis(totalCount);} } } );
		$('#'+group).text("("+getNumberFormatDis(totalCount)+")");

		createGrid(columnDiv);
    }

    //엑셀다운로드
    $('#btnExportExcel').on('click', function(e) {
    	funExcelBatchExecute();
    });

    
    function createGrid(sTypes) {
    	var nodata = cflineMsgArray['noInquiryData'] /* 조회된 데이터가 없습니다. */;
    	if(sTypes == "All" || sTypes == "PacketInfo"){
	        //	그리드 생성
	        $('#'+gridId).alopexGrid({
	        	pager : true,
            	autoColumnIndex: true,
        		autoResize: true,
        		cellSelectable : false,
        		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        		rowClickSelect : true,
        		rowSingleSelect : false,
        		numberingColumnFromZero: false,
        		defaultColumnMapping:{sorting: true},
    			columnMapping:columnPacketInfo,
    			fillUndefinedKey:null,
    			columnFixUpto:1,
    			columnFixUpto:'pktTrkNm',
    			
				rowOption:{inlineStyle: function(data,rowOption){
					    // 작업정보
						if(data['pktTrkWorkYn'] == 'Y' && data['workMgmtYn'] == 'Y' && data['ntwkStatCdVal'] != '02') {
		    				return {color:'red'} // background:'orange',
		    			}
	    			}
				},
	    		// contextmenu
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    							title: cflineMsgArray['workInfo'] /*작업 정보*/,
	    						    processor: function(data, $cell, grid) {
	    						    	fnWorkCnvt();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	//return data._state.selected;
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	for(var i in selectedData){
	    						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y"  && nullToEmpty(selectedData[i].ntwkStatCdVal) != "02"){
	    						    			returnValue = true;
	    						    			//break;
	    						    		}
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    }
	    					   }
	    		               ],
	   		    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    }
			});
    	}
    	if(sTypes == "All" || sTypes == "WorkInfo"){
	        //	그리드 생성
	        $('#'+gridWorkId).alopexGrid({
	        	pager : true,
	        	autoColumnIndex: true,
	        	autoResize: true,
	        	cellSelectable : false,
	        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	        	rowInlineEdit : true, //행전체 편집기능 활성화
	        	rowClickSelect : true,
	        	rowSingleSelect : false,
	        	numberingColumnFromZero: false,
	        	defaultColumnMapping:{sorting: true},
	        	columnMapping:columnWorkInfo,
	        	fillUndefinedKey:null,
    			columnFixUpto:1,
    			columnFixUpto:'pktTrkNm',
	    		// contextmenu
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    							title: cflineMsgArray['workInfSave'] /*작업정보저장*/,
	    						    processor: function(data, $cell, grid) {
	    						    	fnUpdateWorkInfo();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	return data._state.selected;
	    						    }
	    					   },
	    		               {
	    		            	   title: cflineMsgArray['workInfo']+cflineMsgArray['finish'] /*작업정보완료*/,
	    		            	   processor: function(data, $cell, grid) {
	    		            		   fnWorkInfoFnsh(false);
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   return data._state.selected;
	    		            	   }
	    		               },
	    		               {
	    		            	   title: cflineMsgArray['AllWorkInfFnsh'] /*모든작업정보완료*/,
	    		            	   processor: function(data, $cell, grid) {
	    		            		   fnWorkInfoFnsh(true);
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   return data._state.selected;
	    		            	   }
	    		               }
	    		               ],
	   		    message : {
			      	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
			       	filterNodata: 'No data'
			    }
	        }); 
    	}
        $('#'+gridWorkId).alopexGrid("viewUpdate");
    }
  
 // 작업정보저장 function
    function fnUpdateWorkInfo(){
    	var checkDate = true;
    	
    	if($('#'+gridWorkId).length == 0) {return;}
		$('#'+gridWorkId).alopexGrid('endEdit', {_state:{editing:true}});
		var dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
    	dataList = AlopexGrid.currentData(dataList);
    	if (dataList.length > 0 ){
    		if(fnVaildation(dataList)){
    			dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
    			dataList = AlopexGrid.currentData(dataList);
				var updateList = $.map(dataList, function(data){
					if(nullToEmpty(data.lineOpenDt)!="") {
						if(isValidDate(data.lineOpenDt)) {
							data.lineOpenDt = data.lineOpenDt.replace(/-/gi,'');	
						} else {
							alertBox('I', "개통일자가 잘못 입력되었습니다.");
							checkDate = false;
							return false;
						}
					}
					var saveParam = {
							  "pktTrkNo":data.pktTrkNo
							, "pktTrkNm":data.pktTrkNm
							, "trkTypCdVal":data.trkTypCdVal
							, "ring1Id":data.ring1Id
							, "ring2Id":data.ring2Id
							, "svlnTypCdVal":data.svlnTypCdVal
							, "commBizrIdVal":data.commBizrIdVal
							, "lineOpenDt":data.lineOpenDt
							, "areaCtrMtsoId":data.areaCtrMtsoId
							, "ntwkRmk1":data.ntwkRmk1
							, "ntwkRmk2":data.ntwkRmk2
							, "ntwkRmk3":data.ntwkRmk3
							
					};
					return saveParam;
				});
				if(checkDate == false ) {
					$('#'+gridWorkId).alopexGrid("startEdit");
					return;
				}
				
				cflineShowProgressBody();
				httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/updateWorkInfo', updateList, 'POST', 'updateWorkInfo');
    		}
		}else {
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
			$('#'+gridWorkId).alopexGrid("startEdit");
		}
    }

  //작업정보완료, 모든작업정보완료
    function fnWorkInfoFnsh(isAll){
    	var checkDate = true;
    	if( $('#'+gridWorkId).length == 0) return;
    	var dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state: {selected:true}});
    	dataList = AlopexGrid.currentData(dataList);
    	if (dataList.length > 0 ){
    		if(fnVaildation(dataList)){
    			dataList = $('#'+gridWorkId).alopexGrid('dataGet', {_state:{selected:true}});
    			dataList = AlopexGrid.currentData(dataList);
    			var setTdmChgUserId = "";
    			var updateList = $.map(dataList, function(data){
    				if(nullToEmpty(data.lineOpenDt)!="") {
						if(isValidDate(data.lineOpenDt)) {
							data.lineOpenDt = data.lineOpenDt.replace(/-/gi,'');	
						} else {
							alertBox('I', "개통일자가 잘못 입력되었습니다.");
							checkDate = false;
							return false;
						}
					}
    				var saveParam = {
						 "pktTrkNo":data.pktTrkNo
						, "pktTrkNm":data.pktTrkNm
						, "trkTypCdVal":data.trkTypCdVal
						, "ring1Id":data.ring1Id
						, "ring2Id":data.ring2Id
						, "svlnTypCdVal":data.svlnTypCdVal
						, "commBizrIdVal":data.commBizrIdVal
						, "lineOpenDt":data.lineOpenDt
						, "areaCtrMtsoId":data.areaCtrMtsoId
						, "ntwkRmk1":data.ntwkRmk1
						, "ntwkRmk2":data.ntwkRmk2
						, "ntwkRmk3":data.ntwkRmk3
    				}; 

    				return saveParam;
    			});
    			
    			if(checkDate == false ) {
					$('#'+gridWorkId).alopexGrid("startEdit");
					return;
				}
    			
    			var param = {"finishAll" : isAll, "updatePacketList" : updateList };
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/workInfoFinish', param, 'POST', 'workInfoFinish');
    		}
    	}else{
    		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
    	}
    }
 
    function fnVaildation(dataList){
    	var msgStr = "";
    	var validate = true;
    	
		var requiredColumn = { pktTrkNm : cflineMsgArray['trunkNm']
							 , commBizrIdVal : cflineMsgArray['businessMan'] };
    	for(var i=0; i<dataList.length; i++){
    		$.each(requiredColumn, function(key,val){
    			var value = eval("dataList[i]" + "." + key);
    			if(nullToEmpty(value) == ""){
    				msgStr = "<br>"+dataList[i].pktTrkNo + " : " + val;
    				validate = false;
    				return validate;
    			}
         	});
    		
    		if(!validate){
        		alertBox('W', makeArgMsg('required',msgStr,"","","")); /* 필수 입력 항목입니다.[{0}]*/ 
        		$('#'+gridWorkId).alopexGrid("startEdit");
        		return validate;
    		}
    	}
    	
    	for( var index = 0 ; index < dataList.length; index++ ) {
    		if(nullToEmpty(dataList[index].ring1Nm) == "" ) {
    			dataList[index].ring1Nm = null;
    			$('#' + gridWorkId + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "ring1Id");
				dataList[index].ring1MatchNm = null;
    		}
    		if(nullToEmpty(dataList[index].ring2Nm) == "" ) {
    			dataList[index].ring2Nm = null;
    			$('#' + gridWorkId + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "ring2Id");
				dataList[index].ring2MatchNm = null;
    		}
    		if(nullToEmpty(dataList[index].areaCmtsoNm) == "" ) {
    			dataList[index].areaCmtsoNm = null;
    			$('#' + gridWorkId + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "areaCtrMtsoId");
				dataList[index].areaCmtsoMatchNm = null;
    		}
    		if(( nullToEmpty(dataList[index].ring1Nm) != "" && nullToEmpty(dataList[index].ring1Id) == "" ) || ( nullToEmpty(dataList[index].ring2Nm) != "" && nullToEmpty(dataList[index].ring2Id) == "" ) ) {
    			alertBox('W', cflineMsgArray['CheckMultiRingName']);  /* 링#1 , 링#2 는 검색 후 선택하여 수정해주십시오. */
    			$('#'+gridWorkId).alopexGrid("startEdit");
    			validate = false;
    			return validate;
    		}
    		if( (dataList[index].ring1Nm != dataList[index].ring1MatchNm) || (dataList[index].ring2Nm != dataList[index].ring2MatchNm) ) {
    			alertBox('W', cflineMsgArray['CheckMultiRingName']);  /* 링#1 , 링#2 는 검색 후 선택하여 수정해주십시오. */ 
    			$('#'+gridWorkId).alopexGrid("startEdit");
    			validate = false;
    			return validate;
    		}
    		if( nullToEmpty(dataList[index].areaCmtsoNm) != "" && nullToEmpty(dataList[index].areaCtrMtsoId) == "" ) {
    			alertBox('W', cflineMsgArray['CheckCtrMtso']);  /*  중심국사는 검색 후 선택하여 수정해주십시오. */
    			$('#'+gridWorkId).alopexGrid("startEdit");
    			validate = false;
    			return validate;
    		}
    		if( dataList[index].areaCmtsoNm != dataList[index].areaCmtsoMatchNm ) {
    			alertBox('W', cflineMsgArray['CheckCtrMtso']);  /*  중심국사는 검색 후 선택하여 수정해주십시오. */
    			$('#'+gridWorkId).alopexGrid("startEdit");
    			validate = false;
    			return validate;
    		}
    		
    	}
    	return validate;
    }

    function setGrid(first, last, sType) {
		if( first == "1" && last =="200"){
			//초기 조회 일시 링,작업 에 각각 첫번째 마지막 페이지에 값을 넣어준다 
			$("#firstRowIndex").val( parseInt(first) );
			$("#lastRowIndex").val( parseInt(last) );
			//패킷트렁크 조회
			$("#firstRow01").val( parseInt(first) );
			$("#lastRow01").val( parseInt(last) );
			//작업조회 
			$("#firstRow02").val( parseInt(first) );
			$("#lastRow02").val( parseInt(last) );
		}else{
			 if (sType == "All"){
					$("#firstRowIndex").val( parseInt($("#firstRowIndex").val())  + parseInt(first)  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRowIndex").val())  + parseInt(last)  ) ;	
			 }else if (sType == "PacketInfo"){
				 	
					$("#firstRow01").val( parseInt($("#firstRow01").val())  + parseInt(first)  ) ;
					$("#lastRow01").val( parseInt($("#lastRow01").val())  + parseInt(last)  ) ;	
					
					$("#firstRowIndex").val( parseInt($("#firstRow01").val())  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRow01").val())    ) ;						
				 				 
			 }else if (sType == "WorkInfo"){
				 	
				    $("#firstRow02").val( parseInt($("#firstRow02").val())  + parseInt(first)  ) ;
					$("#lastRow02").val( parseInt($("#lastRow02").val())  + parseInt(last)  ) ;	
					
					$("#firstRowIndex").val( parseInt($("#firstRow02").val())  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRow02").val())    ) ;						
			 }
		}			
		if($("input:checkbox[id='noRingData']").is(":checked")) {
			$("#noRingData").val(true);
		}else {
			$("#noRingData").val(false);
		}
		if($("input:checkbox[id='overlapRingData']").is(":checked")) {
			$("#overlapRingData").val(true);
		}else {
			$("#overlapRingData").val(false);
		}
		if($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked")) {
			$("#sWorkGrpWhereUse").val(true);
		}else {
			$("#sWorkGrpWhereUse").val(false);
		}
		var param =  $("#searchForm").serialize();	//parameter 형태로 데이터 넘어감 : query String parameter
//		var param =  $("#searchForm").getData(); // Object 형태로 데이터 넘어감 : query String parameter
		
		//param.noRingData = $("input:checkbox[id='noRingData']").is(":checked");
		//param.overlapRingData = $("input:checkbox[id='overlapRingData']").is(":checked");
		//param.sWorkGrpWhereUse = $("input:checkbox[id='sWorkGrpWhereUse']").is(":checked");
		if (sType == "All"){
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getPacketTrunkListAll', param, 'GET', 'searchAll'); 
		}else if (sType == "PacketInfo"){
			cflineShowProgress(gridId);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getPacketTrunkList', param, 'GET', 'searchPacketInfo'); 
		}else if (sType == "WorkInfo"){
			cflineShowProgress(gridWorkId);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getPacketTrunkWorkList', param, 'GET', 'searchWorkInfo'); 
		}
    }
    

   
});

/*날짜 포맷에 맞는지 검사*/
function isDateFormat(date) {
	var df = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
	return date.match(df);
}

/*윤년여부검사*/
function isLeaf(year) {
	var leaf = false;
	
	if(year%4==0){
		leaf = true;
		
		if(year%100==0){
			leaf=false;
		}
		
		if(year%400==0){
			leaf=true;
		}
	}
	return leaf;
}

function isValidDate(date) {
	if(!isDateFormat(date)) {
		return false;
	}
	
	var month_day = [31,28,31,30,31,30,31,31,30,31,30,31];
	var dateToken = date.split('-');
	var year = Number(dateToken[0]);
	var month = Number(dateToken[1]);
	var day = Number(dateToken[2]);
	
	if(day == 0 ) {
		return false;
	}
	var isValid = false;
	
	if(isLeaf(year)) {
		if(month==2) {
			if(day<=month_day[month-1] + 1 )  {
				isValid = true;
			}
		} else {
			if(day <= month_day[month-1]) {
				isValid = true;
			}
		}
	} else {
		if(day <= month_day[month-1]) {
			isValid = true;
		}
	}
	return isValid;
	
}


function onloadMgmtGrpChange(){
	changeMgmtGrp("mgmtGrpCd", "orgId", "teamId", "topMtsoIdList", "mtso");
}