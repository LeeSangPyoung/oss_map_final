/**
 * NetworkPathListPop.js 
 * 
 * WDM트렁크 또는 트렁크검색후에 선번(정/역방향)선택 후 등록팝업
 * @author 
 * @date 2016. 10. 26. 오전 17:30:03
 * @version 1.0
 */
var targetName;
var zIndex;
var useNetworkPathDirection = "";
var pathSameNo = "";

/**
 * 사용 네트워크가 보정됐는지 여부
 */
var useNetworkPathMergedWithOriginalPath = false;

$a.page(function() {
//	window.addEventListener("beforeunload", function(e) {
//		$a.close();
//	});
	
    var paramData = "";
	var gridResult = 'pathDetail';
	var pathData = [];
	var onload = false;
	var networkInfo = ['NETWORK_ID', 'NETWORK_NM', 'NETWORK_STATUS_CD', 'NETWORK_STATUS_NM', 'PATH_DIRECTION', 'PATH_SAME_NO', 'PATH_SEQ', 'TOPOLOGY_LARGE_CD', 'TOPOLOGY_LARGE_NM', 'TOPOLOGY_SMALL_CD', 'TOPOLOGY_SMALL_NM', 'TOPOLOGY_CFG_MEANS_CD', 'TOPOLOGY_CFG_MEANS_NM'];
	
    this.init = function(id, param) {
    	var editYn = param.editYn;
    	var btnPrevRemove = false;
    	useNetworkPathDirection = param.useNetworkPathDirection;
    	pathSameNo = param.pathSameNo;
    	
    	if(param.searchDivision == "ront"){
    		$('#directionDiv').css('display','none');
    	}
    	
    	if(typeof param.btnPrevRemove == "undefined" || nullToEmpty(param.btnPrevRemove) == "") {
    		btnPrevRemove = false;
    	} else {
    		btnPrevRemove = true;
    	}
    		
    	// 편집 상태가 아니고 btnPrevRemove가 아니면 
		if((editYn == undefined || editYn == 'undefined' || editYn == false) && btnPrevRemove) {
			jQuery("#directionOne").setEnabled(false);
    		jQuery("#directionTwo").setEnabled(false);
    		jQuery("#btnPopConfirm").remove();
    		jQuery("#btnPrev").remove();
		} else if(editYn && btnPrevRemove) {
			jQuery("#btnPrev").remove();
		}
		
		targetName = param.target;
		zIndex = param.zIndex;
		
    	paramData = param;
    	initGrid();
    	setEventListener();
    	
    	if (!jQuery.isEmptyObject(param) ) {
//    		cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', param, 'GET', 'searchPop');
    	} 
    };
    
    //Grid 초기화
    function initGrid() {
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
    			sorting: false
			},
			columnMapping: columnMapping(),
			headerGroup : [
			        {fromIndex:"LEFT_PORT_DESCR", toIndex:"LEFT_CHANNEL_DESCR", title: cflineMsgArray['westPort'], hideSubTitle:true},
	          		{fromIndex:"RIGHT_PORT_DESCR", toIndex:"RIGHT_CHANNEL_DESCR", title:cflineMsgArray['eastPort'], hideSubTitle:true}
			]
        }); 
    };

    function columnMapping() {
    	var mapping = [];
    	
    	mapping.push({ key : 'LINK_SEQ', 					title : cflineMsgArray['lineSeq'], align : 'center', width : '80px' });
    	mapping.push({ key : 'LEFT_ORG_NM', 				title : cflineMsgArray['westMtso'], align : 'left', width : '100px' });	/* A 국사 */
    	mapping.push({ key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '150px' }); /* A 장비 */ 
    	mapping.push({ key : 'LEFT_PORT_DESCR', 			title : cflineMsgArray['westPort'], align : 'left', width : '140px' });	/* A 포트 */
    	mapping.push({ key : 'LEFT_CHANNEL_DESCR', 			title : cflineMsgArray['westPort'], align : 'left', width : '70px' });
    	mapping.push({ key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '150px'}); /* B 장비 */
    	mapping.push({ key : 'RIGHT_PORT_DESCR', 			title : cflineMsgArray['eastPort'], align : 'left', width : '140px' }); /* B 포트 */
    	mapping.push({ key : 'RIGHT_CHANNEL_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '70px' });
    	mapping.push({ key : 'RIGHT_ORG_NM', 				title : cflineMsgArray['eastMtso'], align : 'left', width : '100px' }); /* B 국사 */
    	
    	mapping.push({ key : 'LEFT_PORT_DUMMY', 			title : "LEFT_PORT_DUMMY", align : 'left', width : '100px', hidden : true });
    	mapping.push({ key : 'LEFT_NE_DUMMY', 				title : "LEFT_NE_DUMMY", align : 'left', width : '100px', hidden : true });
    	
    	mapping.push({ key : 'RIGHT_PORT_DUMMY', 			title : "RIGHT_PORT_DUMMY", align : 'left', width : '100px', hidden : true });
    	mapping.push({ key : 'RIGHT_NE_DUMMY', 				title : "RIGHT_NE_DUMMY", align : 'left', width : '100px', hidden : true });
    	
    	return mapping;
    }
    
    function setEventListener() { 
    	// 이전 버튼
    	jQuery('#btnPrev').on('click', function(e) {
    		var dataList = {};
    		dataList.prev = 'Y';
    		$a.close(dataList);
    	});
    	
   	 	// 확인
	   	$('#btnPopConfirm').on('click', function(e) {
	   		var links = $('#'+gridResult).alopexGrid('dataGet');
	   		var dataList = AlopexGrid.trimData(links);
	   		var division = "";
	   		var pathDirection = $(':input[name="direction"]').getValue() == "2" ? 'LEFT' : 'RIGHT';
	   		
	   		for(var i = 0; i < dataList.length; i++) {
	   			if(paramData.searchDivision == "wdm" || paramData.searchDivision == "ront") {
		   			dataList[i].WDM_TRUNK_ID = networkInfo[0];
		   			dataList[i].WDM_TRUNK_NM = networkInfo[1];
		   			dataList[i].WDM_TRUNK_STATUS_CD = networkInfo[2];
		   			dataList[i].WDM_TRUNK_STATUS_NM = networkInfo[3];
		   			dataList[i].WDM_TRUNK_PATH_DIRECTION = pathDirection;
		   			dataList[i].WDM_TRUNK_PATH_SAME_NO = networkInfo[5];
		   			dataList[i].WDM_TRUNK_PATH_SEQ = networkInfo[6];
		   			dataList[i].WDM_TRUNK_TOPOLOGY_LARGE_CD = networkInfo[7];
		   			dataList[i].WDM_TRUNK_TOPOLOGY_LARGE_NM = networkInfo[8];
		   			dataList[i].WDM_TRUNK_TOPOLOGY_SMALL_CD = networkInfo[9];
		   			dataList[i].WDM_TRUNK_TOPOLOGY_SMALL_NM = networkInfo[10];
		   			dataList[i].WDM_TRUNK_TOPOLOGY_CFG_MEANS_CD = networkInfo[11];
		   			dataList[i].WDM_TRUNK_TOPOLOGY_CFG_MEANS_NM = networkInfo[12];
		   			if(dataList[i].TRUNK_ID == null) {
		   				dataList[i].TRUNK_ID = links[i]._index.grid;
		   			}
		   			if(dataList[i].RING_ID == null) {
		   				dataList[i].RING_ID = links[i]._index.grid;
		   			}
	   			} else if(paramData.searchDivision == "trunk") {
	   				dataList[i].TRUNK_ID = networkInfo[0];
		   			dataList[i].TRUNK_NM = networkInfo[1];
		   			dataList[i].TRUNK_STATUS_CD = networkInfo[2];
		   			dataList[i].TRUNK_STATUS_NM = networkInfo[3];
		   			dataList[i].TRUNK_PATH_DIRECTION = pathDirection;
		   			dataList[i].TRUNK_PATH_SAME_NO = networkInfo[5];
		   			dataList[i].TRUNK_PATH_SEQ = networkInfo[6];
		   			dataList[i].TRUNK_TOPOLOGY_LARGE_CD = networkInfo[7];
		   			dataList[i].TRUNK_TOPOLOGY_LARGE_NM = networkInfo[8];
		   			dataList[i].TRUNK_TOPOLOGY_SMALL_CD = networkInfo[9];
		   			dataList[i].TRUNK_TOPOLOGY_SMALL_NM = networkInfo[10];
		   			dataList[i].TRUNK_TOPOLOGY_CFG_MEANS_CD = networkInfo[11];
		   			dataList[i].TRUNK_TOPOLOGY_CFG_MEANS_NM = networkInfo[12];
		   			
		   			if(dataList[i].RING_ID == null) {
//		   				dataList[i].RING_ID = links[i]._index.grid;
		   				dataList[i].RING_ID = AlopexGrid.generateKey();
		   			}
		   			if(dataList[i].WDM_TRUNK_ID == null) {
//		   				dataList[i].WDM_TRUNK_ID = links[i]._index.grid;
		   				dataList[i].WDM_TRUNK_ID = AlopexGrid.generateKey();
		   			} 
		   			
	   			} else {
	   				dataList[i].RING_ID = networkInfo[0];
		   			dataList[i].RING_NM = networkInfo[1];
		   			dataList[i].RING_STATUS_CD = networkInfo[2];
		   			dataList[i].RING_STATUS_NM = networkInfo[3];
		   			dataList[i].RING_PATH_DIRECTION = pathDirection;
		   			dataList[i].RING_PATH_SAME_NO = networkInfo[5];
		   			dataList[i].RING_PATH_SEQ = networkInfo[6];
		   			dataList[i].RING_TOPOLOGY_LARGE_CD = networkInfo[7];
		   			dataList[i].RING_TOPOLOGY_LARGE_NM = networkInfo[8];
		   			dataList[i].RING_TOPOLOGY_SMALL_CD = networkInfo[9];
		   			dataList[i].RING_TOPOLOGY_SMALL_NM = networkInfo[10];
		   			dataList[i].RING_TOPOLOGY_CFG_MEANS_CD = networkInfo[11];
		   			dataList[i].RING_TOPOLOGY_CFG_MEANS_NM = networkInfo[12];
		   			
	   				dataList[i].TRUNK_ID = links[i]._index.grid;
	   				dataList[i].WDM_TRUNK_ID = links[i]._index.grid;
	   			}
	   			
	   			dataList[i].USE_NETWORK_ID = networkInfo[0];
    			dataList[i].USE_NETWORK_PATH_SAME_NO = networkInfo[5];
				dataList[i].USE_NETWORK_PATH_DIRECTION = pathDirection;
				
//				dataList[i].USE_NETWORK_LINK_DIRECTION = networkInfo[4];
				dataList[i].USE_NETWORK_LINK_DIRECTION = dataList[i].LINK_DIRECTION;
	   		}
	   		
	   		// 선번이 보정된 경우
	   		if(useNetworkPathMergedWithOriginalPath) {
	   			var msg = "";
   				msg = "선택한 트렁크(링)에서 사용한 링 또는 WDM트렁크 선번이 변경되어 선번 보정이 필요합니다. <br/>트렁크(링) 관리에서 선번창을 열면 자동으로 보정되며, 보정된 선번을 확인하여 저장한 후 사용해주십시오." + 
					"<br/>그렇지 않으면 회선 조회 시 사용 네트워크(트렁크,링,WDM트렁크) 구간이 자동 보정되어 회선에서 사용한 네트워크(트렁크,링,WDM트렁크) 구간 정보가 사라질수 있습니다.";
	   			
	   			/*
	   			if(paramData.searchDivision == "trunk") {
//	   				msg = "트렁크에서 사용한 네트워크 선번이 변경되어 보정을 한 후에 사용할수 있습니다.";
	   				msg = "회선에서 사용한 트렁크 선번이 변경되었습니다. <br/>트렁크 관리에서 트렁크 선번창을 열면 자동으로 보정되며, 보정된 선번을 확인하여 저장한 후 사용해주십시오." + 
	   						"<br/>그렇지 않으면 회선 조회 시 트렁크 구간이 자동 보정되어 회선에서 사용한 트렁크 구간 정보가 사라질수 있습니다.";
	   			} else if(paramData.searchDivision == "wdm"){
//	   				msg = "WDM 트렁크에서 사용한 네트워크 선번이 변경되어 보정을 한 후에 사용할수 있습니다.<br/> WDM 트렁크 관리에서 WDM 트렁크 선번창을 열면 자동으로 보정되며, 보정된 선번을 확인하여 저장한 후 사용해주십시오.";
	   				msg = "회선(링)에서 사용한 네트워크 선번이 변경되었습니다. <br/>WDM 트렁크 관리에서 WDM 트렁크 선번창을 열면 자동으로 보정되며, 보정된 선번을 확인하여 저장한 후 사용해주십시오." + 
						"<br/>그렇지 않으면 회선 조회 시 WDM 트렁크 구간이 자동 보정되어 회선에서 사용한 WDM 트렁크 구간 정보가 사라질수 있습니다.";
	   			} else {
//	   				msg = "링에서 사용한 네트워크 선번이 변경되어 보정을 한 후에 사용할수 있습니다.<br/> 링 관리에서 링 선번창을 열면 자동으로 보정되며, 보정된 선번을 확인하여 저장한 후 사용해주십시오.";
	   				msg = "링에서 사용한 네트워크 선번이 변경되었습니다. <br/>링관리에서 링 선번창을 열면 자동으로 보정되며, 보정된 선번을 확인하여 저장한 후 사용해주십시오." + 
					"<br/>그렇지 않으면 회선 조회 시 링 구간이 자동 보정되어 회선에서 사용한 링 구간 정보가 사라질수 있습니다.";
	   			}
	   			*/
	   			
	   			callMsgBox('','C', msg, function(msgId, msgRst) {
					if(msgRst == 'Y') {
						$a.close(dataList);
					}
				});
	   			
	   		} else {
		   		$a.close(dataList);
	   		}
	   		
	   	});    	
   	 	
   	 	$(':input[name="direction"]').change(function() {
   	 		// 정방향, 역방향 변화. 방향에 따라서 그리드 재렌더링
//	   		var links = $('#'+gridResult).alopexGrid('dataGet');
	   		var dataList = AlopexGrid.trimData(pathData);
	   		var rePathData = [];
	   		
   	 		if(onload) {
   	 			rePathData = reverseData(pathData);
	   	 		rePathData.reverse();
	   	 		pathData = rePathData;
	   	 		$('#'+gridResult).alopexGrid('dataSet', rePathData);
	   	 		$("#"+gridResult).alopexGrid("viewUpdate");
	   	 		onload = true; 
   	 		}
   	 	});
	}
    
    function reverseData(pathData) {
    	var rePathData = [];
    	jQuery.each(pathData, function(index, value) {
			var data = {};
			for(var key in value) {
				// WEST이면 EAST로 바꾼다.
				if(key.indexOf("LEFT") == 0) {
					var length = key.length;
					var column = "RIGHT" + key.substring(4, length);
					eval("data." + column + " = value." + key);
				} else if(key.indexOf("RIGHT") == 0) {
					// EAST이면 WEST로 바꾼다
					var length = key.length;
					var column = "LEFT" + key.substring(5, length);
					eval("data." + column + " = value." + key);
				} else {
					eval("data." + key + " = value." + key);
				}
			}
			rePathData.push(data);
		});
    	
    	return rePathData;
    }
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
//    	cflineHideProgressBody();
    	
    	if(response.data != undefined) {
    		useNetworkPathMergedWithOriginalPath = response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH;
//    		console.log(response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH);
    		networkInfo[0] = String(response.data.NETWORK_ID);
    		networkInfo[1] = String(response.data.NETWORK_NM);
    		networkInfo[2] = String(response.data.NETWORK_STATUS_CD);
    		networkInfo[3] = String(response.data.NETWORK_STATUS_NM);
    		networkInfo[4] = String(response.data.PATH_DIRECTION);
    		networkInfo[5] = String(response.data.PATH_SAME_NO);
    		networkInfo[6] = String(response.data.PATH_SEQ);
    		networkInfo[7] = String(response.data.TOPOLOGY_LARGE_CD);
    		networkInfo[8] = String(response.data.TOPOLOGY_LARGE_NM);
    		networkInfo[9] = String(response.data.TOPOLOGY_SMALL_CD);
    		networkInfo[10] = String(response.data.TOPOLOGY_SMALL_NM);
    		networkInfo[11] = String(response.data.TOPOLOGY_CFG_MEANS_CD);
    		networkInfo[12] = String(response.data.TOPOLOGY_CFG_MEANS_NM);
    		
    		$('#'+gridResult).alopexGrid('dataSet', response.data.LINKS);
    		pathData = response.data.LINKS;
    		
    		if(response.data.TOPOLOGY_LARGE_CD == '001' && response.data.TOPOLOGY_SMALL_CD == '031') {
    			$("#wkSprlabel").show();
    			
    			if(flag != "networkPathSearchWkSprChange" && response.ntwkLnoGrpSrno != undefined) {
        			$("#ntwkLnoGroSrno").remove();
    				
    				var selectHtml = "<select id = 'ntwkLnoGroSrno' class='divselect'>";
    				for(var i = 0; i < response.ntwkLnoGrpSrno.length; i++) {
    					var optionHtml = "<option value='" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "'";
    					/*if(pathSameNo == response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno) optionHtml += " selected=true ";*/
    					optionHtml += ">" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "</option>";
    					selectHtml += optionHtml;
    				}
    				selectHtml += "</select>";
    				$("#wkSprlabel").append(selectHtml);	
    				$("#ntwkLnoGroSrno").val(pathSameNo);
    			}
    		}
    		
    		// 사용네트워크의 선번내용을 확인하는 경우 사용네트워크의 방향값을 설정해줌.
    		// 저장이 되지 않은 상태에서 방향 전환 후 선번을 다시 조회할때
    		if(useNetworkPathDirection == "RIGHT") {
    			$("#directionOne").setSelected();
    		} else if(useNetworkPathDirection == "LEFT") {
    			$("#directionTwo").setSelected();
    			
    			var rePathData = reverseData(pathData);
       	 		rePathData.reverse();
       	 		pathData = rePathData;
       	 		$('#'+gridResult).alopexGrid('dataSet', rePathData);
       	 		$("#"+gridResult).alopexGrid("viewUpdate");
    		} 
    		// 사용네트워크의 선번내용이 아닌 사용네트워크 설정하기 위해 최초조회시 기본적으로 정방향
    		else {
    			// 저장이 된 선번을 읽어 올 때
	    		/*if(response.data.LINKS[0].LINK_DIRECTION == "RIGHT") {
	    			$("#directionOne").setSelected();
	    		} else {
	    			$("#directionTwo").setSelected();
	    		}*/
    			$("#directionOne").setSelected();
    		}
    		 
    		onload = true;
    	}
//    	$(parent.document.body).find("#"+targetName).css("z-index", zIndex);
    	
    	$("#ntwkLnoGroSrno").change(function(e) {
    		params = {
        			"ntwkLineNo" : paramData.ntwkLineNo, 
//        			"utrdMgmtNo" : utrdMgmtNo,
        			"ntwkLnoGrpSrno" : $('#ntwkLnoGroSrno').val()
        	};
        	
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchWkSprChange');
    	});
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchPop'){
//    		cflineHideProgress(gridResult);
//    		$(parent.document.body).find("#"+targetName).css("z-index", zIndex);
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