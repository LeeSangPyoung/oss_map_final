/**
 * PopRingAddDrop.js
 * 
 * @author Administrator
 * @date 2016. 9. 9. 오전 17:30:03 
 * @version 1.0
 */
var add = null;
var drop = null;
var ptpYn = false;
var wdmRing = false;
//var addDropChek = false;
var nodeDataArray = [];
var linkDataArray = [];
var responseObject = [];
var useNetworkPathDirection = "";
var networkId = "";
var networkNm = "";
var networkInfo = ['NETWORK_ID', 'NETWORK_NM', 'NETWORK_STATUS_CD', 'NETWORK_STATUS_NM', 'PATH_DIRECTION', 'PATH_SAME_NO', 'PATH_SEQ', 'TOPOLOGY_LARGE_CD', 'TOPOLOGY_LARGE_NM', 'TOPOLOGY_SMALL_CD', 'TOPOLOGY_SMALL_NM', 'TOPOLOGY_CFG_MEANS_CD', 'TOPOLOGY_CFG_MEANS_NM'];

// parent progress z-index 설정
var targetName;
var zIndex;

$a.page(function() {
	window.addEventListener("beforeunload", function(e) {
		$a.close();
	});
	
	var ringAddDrop;
	var direction;
	var editYn;
	var ntwkLineNo;
	var addDropStatus; // 0: 어떤 것도 선택불가하며 ADD, DROP 지정 안된 상태, 1: ADD 지정 가능 상태, 2: DROP 지정 가능 상태, 3: ADD DROP 지정 완료 상태
	var isSetAddPortInfo = false; 
	var isSetDropPortInfo = false;
	
	var paramDataList = [];
	var isDataList = false;
	
	// init. parameter 설정
	this.init = function(id, param) {
		
		
		if (! jQuery.isEmptyObject(param) ) {
			paramDataList = param.dataList;
			if(nullToEmpty(paramDataList) != '') {
				isDataList = true;
			}
			var data = {"ntwkLineNo" : param.ntwkLineNo, "ntwkLnoGrpSrno" : "1"};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getRingAddDropPop', data, 'GET', 'search');
    	} 
		
		useNetworkPathDirection = param.useNetworkPathDirection;
		editYn = param.editYn;
		if(editYn == undefined || editYn == 'undefined') {
			editYn = 'N';
		}
		addDropStatus = 0;
		
		targetName = param.target;
		zIndex = param.zIndex;
		
    };
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
    		data : Param, 		//data가 존재할 경우 주입
    		method : Method, 	//HTTP Method
    		flag : Flag
    	}).done(successCallback);
    }
    
    function setEventListener() {
    	$a.convert(jQuery("#ringAddDropDiv"));
    	
    	// 이전 버튼
    	jQuery('button#btnPrev').on('click', function(e) {
    		var returnData = {};
    		returnData.prev = 'Y';
    		$a.close(returnData);
    	});
    	
    	// 등록 버튼
    	jQuery('button#btnInsert').on('click', function(e) {
    		if(add == null || drop == null) {
    			alertBox('W', 'ADD, DROP을 선택해주세요.');
    			return;
    		}
    		
        	/*************************************************************************************************
        	 * 1. path의 0번째는 무조건 ADD, 마지막은 무조건 DROP --> 노드
        	 * 2. 전체 데이터를 선번정보로 넘기되 ADD전에 ADD포트 입력을 위한 신규 ROW생성
        	 *    DROP후에 DROP포트 입력을 위한 신규 ROW생성
        	 * 3. ADD, DROP사이의 Through구간의 LEFT_ADD_DROP_TYPE_CD = 'T'. LEFT_ADD_DROP_TYPE_NM = 'THROUGH'
        	 *    RIGHT_ADD_DROP_TYPE_CD, RIGHT_ADD_DROP_TYPE_NM 동일
        	 * 4. 그 외의 구간은 N(NONE)
        	 **************************************************************************************************/
        	var returnData = [];
        	var noneYn = true;
//        	var addCheckYn = false;
        	var direction = jQuery("input[name=direction]").getValue();
        	var copyObject = {};
        	
        	var addCheckObjIndex = 0;
        	var dropCheckObjIndex = 0;
        	var isLinkOnlyOne = false; // 구간이 하나인 경우 때문에 만든 변수
        	
        	for(var i = 0 ; i < responseObject.length; i++) {
        		if(responseObject.length > 1) {
        			if(isLinkOnlyOne) {
        				if(direction == 'RIGHT') {
    						responseObject[i].COMPOSITION = 'D';
    						responseObject[i].COMPOSITION2 = 'D2';
    					} else {
    						responseObject[i].COMPOSITION = 'A';
    						responseObject[i].COMPOSITION2 = 'A2';
    					}
        			} else if(add.data.eqpSctnId == responseObject[i].LINK_ID) {
        				// ADD
        				responseObject[i].COMPOSITION = 'A';
    					responseObject[i].COMPOSITION2 = 'A2';
    					addCheckObjIndex = i;
        			} else if(drop.data.eqpSctnId == responseObject[i].LINK_ID) {
        				// DROP
        				responseObject[i].COMPOSITION = 'D';
    					responseObject[i].COMPOSITION2 = 'D2';
    					dropCheckObjIndex = i;
        			}
        		} else {
        			// 구간이 하나일 경우
        			var data = {};
        			copyObject = jQuery.extend({}, responseObject[i]);
        			
					for(var key in copyObject) {
						var length = key.length;
						if(key.indexOf("LEFT") == 0) {
							value = "RIGHT" + key.substring(4, length);
							eval("data." + key + " = copyObject." + value);
						} else if(key.indexOf("RIGHT") == 0) {
							value = "LEFT" + key.substring(5, length);
							eval("data." + key + " = copyObject." + value);
						} else {
							eval("data." + key + " = copyObject." + key);
						}
					}
					
					data.LINK_ID = null;
					responseObject[responseObject.length] = data;
					
					if(direction == 'RIGHT') {
						responseObject[i].COMPOSITION = 'A';
						responseObject[i].COMPOSITION2 = 'A2';
					} else {
						responseObject[i].COMPOSITION = 'D';
						responseObject[i].COMPOSITION2 = 'D2';
					}
					
					isLinkOnlyOne = true;
        		}
        		
    			responseObject[i].RING_ID = networkInfo[0];
    			responseObject[i].RING_NM = networkInfo[1];
    			responseObject[i].RING_STATUS_CD = networkInfo[2];
    			responseObject[i].RING_STATUS_NM = networkInfo[3];
    			responseObject[i].RING_PATH_DIRECTION = direction; // networkInfo[4]; 
    			responseObject[i].RING_PATH_SAME_NO = networkInfo[5];
    			responseObject[i].RING_PATH_SEQ = networkInfo[6];
    			responseObject[i].RING_TOPOLOGY_LARGE_CD = networkInfo[7];
    			responseObject[i].RING_TOPOLOGY_LARGE_NM = networkInfo[8];
    			responseObject[i].RING_TOPOLOGY_SMALL_CD = networkInfo[9];
    			responseObject[i].RING_TOPOLOGY_SMALL_NM = networkInfo[10];
    			responseObject[i].RING_TOPOLOGY_CFG_MEANS_CD = networkInfo[11];
    			responseObject[i].RING_TOPOLOGY_CFG_MEANS_NM = networkInfo[12];
    			
    			responseObject[i].USE_NETWORK_ID = networkInfo[0];
    			responseObject[i].USE_NETWORK_PATH_SAME_NO = networkInfo[5];		//	선번 ID
    			responseObject[i].USE_NETWORK_LINK_DIRECTION = networkInfo[4];		//	원래 링 선번상의 구간 방향
    			
    			useNetworkPathDirection = direction;
    			var useNetworkLinkDirection = networkInfo[4];
    			
    			//	최종 구간 방향은 역방향일 경우에만 '링 선번상의 구간 방향' 을 뒤집는다.
    			var linkDirection = useNetworkLinkDirection;
    			if ( direction == "LEFT" ) {
    				if ( useNetworkLinkDirection == "RIGHT" ) {
    					linkDirection = "LEFT";
    				} else if ( useNetworkLinkDirection == "LEFT" ) {
        				linkDirection = "RIGHT";
        			}
    			}
    			
    			responseObject[i].USE_NETWORK_PATH_DIRECTION = useNetworkPathDirection;
    			responseObject[i].LINK_DIRECTION = linkDirection;
    			
    			
            	// 링의 상하위 코드 대신 회선의 상하위 코드(해당없음)로 변경
    			responseObject[i].LEFT_NODE_ROLE_CD = 'NA';
    			responseObject[i].LEFT_NODE_ROLE_NM = '해당없음';
    			responseObject[i].RIGHT_NODE_ROLE_CD = 'NA';
    			responseObject[i].RIGHT_NODE_ROLE_NM = '해당없음';
        	}
        	
        	// THROUGH, NONE 지정 구간 찾기
        	for(var i = 0 ; i < responseObject.length; i++) {
        		if(responseObject[i].hasOwnProperty('COMPOSITION') 
        		&& (responseObject[i].COMPOSITION == 'A' || responseObject[i].COMPOSITION == 'D')) {
        			continue;
        		}
        		
    			if(addCheckObjIndex < dropCheckObjIndex) {
        			if(i > addCheckObjIndex && i < dropCheckObjIndex) {
            			responseObject[i].COMPOSITION = 'T';
            		} else {
            			responseObject[i].COMPOSITION = 'N';
            		}
        		} else {
        			if(i > dropCheckObjIndex && i < addCheckObjIndex) {
            			responseObject[i].COMPOSITION = 'N';
            		} else {
            			responseObject[i].COMPOSITION = 'T';
            		}
        		}
        	}
        	
        	// ADD
        	for(var i = 0; i < responseObject.length; i++) {
        		if(responseObject[i].COMPOSITION == 'A') {
        			compoistion(returnData, responseObject[i], 'A', direction);
        		}
        	}
        	
        	/** NONE 구간
        	// D-N연결(ADD ROW추가 후 NONE를 먼저 등록을 해야 되니 D-N연결을 먼저 등록 : 정방향일 경우)
        	if(direction == "RIGHT") {
        		for(var i = 0 ; i < responseObject.length; i++) {
        			if(responseObject[i].COMPOSITION2 == 'D2') {
        				compoistion(returnData, responseObject[i], 'N', direction);
        			}
        		}
        	}
        	
        	// NONE
        	for(var i = 0 ; i < responseObject.length; i++) {
        		if(responseObject[i].COMPOSITION == 'N') {
        			compoistion(returnData, responseObject[i], 'N', direction);
        		}
        	}
        	
        	if(direction == "LEFT") {
        		for(var i = 0 ; i < responseObject.length; i++) {
        			if(responseObject[i].COMPOSITION2 == 'A2') {
        				compoistion(returnData, responseObject[i], 'N', direction);
        			}
        		}
        	}
        	NONE 구간 **/
        	
        	/** THROUTH 구간 **/
        	// A-T연결(NONE구간 다 등록후 A-T연결을 등록 : 정방향일 경우)
        	if(direction == "RIGHT") {
        		for(var i = 0; i < responseObject.length; i++) {
        			if(responseObject[i].COMPOSITION2 == 'A2') {
        				compoistion(returnData, responseObject[i], 'T', direction);
        			}
        		}
        	}
        	
        	// THROUGH
        	if(addCheckObjIndex < dropCheckObjIndex) {
            	for(var i = 0 ; i < responseObject.length; i++) {
            		if(responseObject[i].COMPOSITION == 'T') {
            			compoistion(returnData, responseObject[i], 'T', direction);
            		}
            	}
    		} else {
    			for(var i = addCheckObjIndex + 1; i < responseObject.length; i++) {
            		if(responseObject[i].COMPOSITION == 'T') {
            			compoistion(returnData, responseObject[i], 'T', direction);
            		}
            	}
    			
    			for(var i = 0; i < dropCheckObjIndex; i++) {
            		if(responseObject[i].COMPOSITION == 'T') {
            			compoistion(returnData, responseObject[i], 'T', direction);
            		}
            	}
    		}
        	
        	if(direction == "LEFT") {
        		for(var i = 0 ; i < responseObject.length; i++) {
        			if(responseObject[i].COMPOSITION2 == 'D2') {
//        				if(nodeDataArray.length == 2) {
//        					compoistion(returnData, responseObject[0], 'T', direction);
//        				} else {
//        					compoistion(returnData, responseObject[i], 'T', direction);
//        				}
        				
        				compoistion(returnData, responseObject[i], 'T', direction);
        			}
        		}
        	}
        	/** THROUTH 구간 **/
        	
        	
        	// DROP
        	for(var i = 0 ; i < responseObject.length; i++) {
        		if(responseObject[i].COMPOSITION == 'D') {
        			compoistion(returnData, responseObject[i], 'D', direction);
        		}
        	}
        	
        	
        	/** ADD, DROP 은 사용 네트워크 구간이 아니다. **/
        	for(var i = 0 ; i < returnData.length; i++) {
        		var obj = returnData[i];
        		
        		// ??
        		if ( obj.LEFT_ADD_DROP_TYPE_CD == 'A' || obj.LEFT_ADD_DROP_TYPE_CD == 'D'
         		   || obj.RIGHT_ADD_DROP_TYPE_CD == 'A' || obj.RIGHT_ADD_DROP_TYPE_CD == 'D' ) {
        			obj.USE_NETWORK_ID = null;
        			obj.USE_NETWORK_PATH_SAME_NO = null;		//	선번 ID
        			obj.USE_NETWORK_PATH_DIRECTION = null;
        			obj.USE_NETWORK_LINK_DIRECTION = null;		//	원래 링 선번상의 구간 방향
					
					/** 등록 버튼을 누르면 신규 등록과 같은 로직으로 처리한다.  */
        			obj.LINK_ID = null;
        			obj.LINK_DIRECTION = null;
        		} 
        	}
        	
        	
        	
        	$a.close(returnData);
    	});
 
    	function compoistion(returnData, object, division, direction) {
    		var data = {};
    		var addDropCol = "_ADD_DROP_TYPE";
    		
    		if(division == 'A') {    			
    			data = compositionAddDrop(division, object, addDropCol, direction);
    			
    			// ADD, DROP구간은 사용네트워크에 포함되지 않는다.
    			for(var key in data) {
    				if(key.indexOf("TRUNK") == 0 || key.indexOf("RING") == 0 || key.indexOf("WDM_TRUNK") == 0) {
    					eval("data." + key + " = null");
    				}
    			}
    		} else if(division == 'T' || division == 'N') {
    			for(var key in object) {
					if(key.indexOf("LEFT" + addDropCol) == 0) {
						if(division == 'T') {
							if(key == "LEFT" + addDropCol + "_CD") eval("data." + key + " = 'T'");
	    					else if(key == "LEFT" + addDropCol + "_NM") eval("data." + key + " = 'THROUGH'");
						} else if(division == 'N') {
							if(key == "LEFT" + addDropCol + "_CD") eval("data." + key + " = 'N'");
	    					else if(key == "LEFT" + addDropCol + "_NM") eval("data." + key + " = 'NONE'");
						}
					} else if(key.indexOf("RIGHT" + addDropCol) == 0) {
						if(division == 'T') {
							if(key == "RIGHT" + addDropCol + "_CD") eval("data." + key + " = 'T'");
							else if(key == "RIGHT" + addDropCol + "_NM") eval("data." + key + " = 'THROUGH'");
						} else if(division == 'N') {
							if(key == "RIGHT" + addDropCol + "_CD") eval("data." + key + " = 'N'");
							else if(key == "RIGHT" + addDropCol + "_NM") eval("data." + key + " = 'NONE'");
						}
					} else if(key == "LINK_VISIBLE") {
						if(division == 'N') eval("data." + key + " = false");
						else eval("data." + key + " = true");
					} else {
						eval("data." + key + " = object." + key);
					}
    			}
    			
        		data.TRUNK_ID = "alopex"+networkInfo[0];
    			data.WDM_TRUNK_ID = "alopex"+networkInfo[0];
    		} else if(division == 'D'){
    			data = compositionAddDrop(division, object, addDropCol, direction);
    			
    			// ADD, DROP구간은 사용네트워크에 포함되지 않는다.
    			for(var key in data) {
    				if(key.indexOf("TRUNK") == 0 || key.indexOf("RING") == 0 || key.indexOf("WDM_TRUNK") == 0) {
    					eval("data." + key + " = null");
    				}
    			}
    		}
    		
    		

			returnData.push(data);
			return returnData;
    	}
    	
    	/**********************************************
    	 * ADD, DROP ROW 생성을 위한 구성
    	 * param 
    	 *    division : ADD, DROP 구분
    	 **********************************************
		 * ADD일 경우 ADD포트 입력을 위한 ROW 생성
		 * 1. WEST(LEFT)의 정보 모두 NULL
		 *    - LEFT_ADD_DROP_TYPE_CD = 'N'
		 * 2. EAST(RIGHT)의 정보 중에서 포트 관련 정보 NULL
		 *    - RIGHT_ADD_DROP_TYPE_CD = 'A'
		 *    - 그 외의 정보는 LEFT정보를 RIGHT에 등록
		 **********************************************
		 * DROP일 경우 DROP포트 입력을 위한 ROW 생성
		 * 1. WEST(LEFT)의 정보 중에서 포트 관련 정보 NULL
		 *    - LEFT_ADD_DROP_TYPE_CD = 'D'
		 * 2. EAST(RIGHT)의 정보 모두 NULL
		 *    - RIGHT_ADD_DROP_TYPE_CD = 'N'
		 *    - 그 외의 정보는 RIGHT정보를 LEFT에 등록
		 **********************************************/
    	function compositionAddDrop(division, object, addDropCol, direction) {
    		var data = {};
    		
    		var lDivision = "";
    		var rDivision = "";
    		var subStrLength = 0;
    		var code = "";
    		var name = "";
    		
			if(division == 'A') {
    			lDivision = "LEFT";
    			rDivision = "RIGHT";
    			code = "A";
    			name = "ADD";
    		} else if(division == 'D') {
    			lDivision = "RIGHT";
    			rDivision = "LEFT";
    			code = "D";
    			name = "DROP";
    		}
    		
			var addNodeInfo = add.data;
			var dropNodeInfo = drop.data;
			
			for(var key in object) {
				if(key.indexOf(lDivision) == 0) {
					if(key == lDivision + addDropCol + "_CD") eval("data." + key + " = 'N'");
					else if(key == lDivision + addDropCol + "_NM") eval("data." + key + " = 'NONE'");
					else eval("data." + key + " = ''");
				} else if(key.indexOf(rDivision) == 0) {
					if(key.indexOf(rDivision + "_PORT") == 0 || key.indexOf(rDivision + "_CARD") == 0
					|| key.indexOf(rDivision + "_RACK") == 0 || key.indexOf(rDivision + "_CHANNEL_DESCR") == 0
					|| key.indexOf(rDivision + "_SHELF") == 0 || key.indexOf(rDivision + "_SLOT_NO") == 0) {
						
//						if(division == 'A' && addNodeInfo.hasOwnProperty('PORT_ID')) {
						if(division == 'A' && isSetAddPortInfo) {
							for(var i in addNodeInfo) {
								if(key == (rDivision + '_' + i)) {
									eval("data." + key + " = '" + nullToEmpty(addNodeInfo[i]) + "'");
									break;
								}
							}
//						} else if(division == 'D' && dropNodeInfo.hasOwnProperty('PORT_ID')) {
						} else if(division == 'D' && isSetDropPortInfo) {
							for(var i in dropNodeInfo) {
								if(key == (rDivision + '_' + i)) {
									eval("data." + key + " = '" + nullToEmpty(dropNodeInfo[i]) + "'");
									break;
								}
							}
						} else {
							if(key.indexOf(rDivision + "_PORT") == 0) {
								eval("data." + key + " = ''");
							} else {
								var length = key.length;
								var value = "";
								
								if(direction == "RIGHT") {
									if(division == 'A') {
										value = lDivision + key.substring(5, length);
									} else {
										value = rDivision + key.substring(4, length);
									}
								} else {
									if(division == 'A') {
										value = rDivision + key.substring(5, length);
									} else {
										value = lDivision + key.substring(4, length);
									}
								}
								
								eval("data." + key + " = object." + value);
							}
						}
					}else if(key.indexOf(rDivision + addDropCol) == 0) {
						if(key == rDivision +  addDropCol + "_CD") eval("data." + key + " = '" + code + "'");
						else if(key == rDivision + addDropCol + "_NM") eval("data." + key + " = '" + name + "'");
					} else {
						var length = key.length;
						var value = "";
						
						if(direction == "RIGHT") {
							if(division == 'A') {
								value = lDivision + key.substring(5, length);
							} else {
								value = rDivision + key.substring(4, length);
							}
						} else {
							if(division == 'A') {
								value = rDivision + key.substring(5, length);
							} else {
								value = lDivision + key.substring(4, length);
							}
						}
						
						eval("data." + key + " = object." + value);
					}
				} else {
					if(key == "LINK_ID") data.LINK_ID = ''; 
					else eval("data." + key + " = object." + key);
				}
			}
			
    		return data;
    	}
    	
    	// ADD, DROP 지정
    	jQuery('button#setAddDropEnable').on('click', function(e) {
    		if(nodeDataArray.length === 1) {
    			var msg = 'ADD, DROP 지정을 할 수 없습니다.';
    			callMsgBox('','I', msg, function(msgId, msgRst){
            		if (msgRst == 'Y') {
            		}
        		});
    			return;
    		} else if(nodeDataArray.length === 2 && linkDataArray.length === 1) {
    			var msg = '구간이 하나인 경우의 ADD, DROP 지정은 정방향, 역방향 선택으로 하시면 됩니다.';
    			callMsgBox('','I', msg, function(msgId, msgRst){
            		if (msgRst == 'Y') {
            		}
        		});
    			return;
    		}
    		if(addDropStatus == 1 || addDropStatus == 2) {
    			var msg = makeArgMsg("selectObject", cflineMsgArray['equipment']);
	    		callMsgBox('','I', msg, function(msgId, msgRst){
	        		if (msgRst == 'Y') {
	        		}
	    		});
    			return;
    		}
    		
        	// add, drop 설정이 가능하도록 변경
    		ringAddDrop.setProperties({maxSelectionCount: 2});
    		
    		addDropStatus = 1;
    		add = null;
    		drop = null;
    		// 설정된 노드 리셋
    		pathReset();
    		
    		// 문구 안보이게
    		jQuery('#explainAddDropPortSetting').css('visibility', 'hidden');
    		
    		//addDropChek = false;
        });
    	
    	// 정방향, 역방향 변환
    	jQuery(':input[name="direction"]').change(function() {
    		changeDirection();
    	});
    }
    
    function changeDirection() {
    	var linkChangeDataArray = [];
		if(linkDataArray.length > 0) {
			// responseObject 뒤집기
			var rePathData = [];
			jQuery.each(responseObject, function(index, value) {
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

	 		rePathData.reverse();
	 		responseObject = rePathData;

		 		// 방향 뒤집기
	   	 	for(var i = 0; i < linkDataArray.length; i++) {
				var obj = ringAddDrop.findLinkForData(linkDataArray[i]).data;
				linkChangeDataArray.push({from : obj.to, to : obj.from});
			}
//			linkDataArray = linkChangeDataArray.reverse();
	   	 	linkDataArray = linkChangeDataArray;
			
	   	 	setCurvVal();
	   	 	
			// 장비 뒤집기
			ringAddDrop.model.linkDataArray = linkDataArray;
			
			if(addDropStatus !== 3) {
				addDropStatus = 0;
			}
			
			ringAddDrop.setProperties({maxSelectionCount: 0});
			
			pathReset();

			if(add != null && drop != null) {
//				if(responseObject.length < 2 || ptpYn) {
				if(nodeDataArray.length < 3 || ptpYn) {
		    		var temp = add;
		    		add = drop;
		    		drop = temp; 
				}
				
				if(add.findObject('addMark') == null) {
					setAddDropMark(add, 'A');
					setAddDropClickEvent(add, 'addMark');
				}
				if(drop.findObject('dropMark') == null) {
					setAddDropMark(drop, 'D');
					setAddDropClickEvent(drop, 'dropMark');
				}
				
				highlightPath(add, drop);
			}
			
			// diagram 범례변경
			jQuery('span[name=diagLegend]').each(function(){
				if( jQuery(this).text().indexOf('WEST') > 0 ) {
					jQuery(this).text('● EAST포트');
				} else if( jQuery(this).text().indexOf('EAST') > 0 ){
					jQuery(this).text('● WEST포트');
				}
			});
		}
    }
    
    // 설정된 노드 리셋
    function pathReset() {
		for(var i = 0; i < nodeDataArray.length; i++) {
			var node = ringAddDrop.findNodeForData(nodeDataArray[i]);
			var checkedNode = node.findObject("nodeImage");
    		checkedNode.source = nodeTypeImage(nodeDataArray[i].eqpRoleDivCd);
    		
			node.findLinksOutOf().each(function(l){l.isHighlighted = false});
			
			//add 포트, drop 포트는 삭제
			if(node.findObject('addMarkPort') != null) {
				node.findObject('addMark').remove(node.findObject('addMarkPort'));
				delete node.data.PORT_DESCR;
				delete node.data.RACK_NO;
				delete node.data.RACK_NM;
				delete node.data.SHELF_NO;
				delete node.data.SHELF_NM;
				delete node.data.SLOT_NO;
				delete node.data.CARD_ID;
				delete node.data.CARD_NM;
				delete node.data.CARD_STATUS_CD;
				delete node.data.PORT_ID;
				delete node.data.PORT_NM;
				delete node.data.PORT_STATUS_CD;
				delete node.data.PORT_STATUS_NM;
				delete node.data.PORT_DUMMY;
				delete node.data.CHANNEL_DESCR;
				
				isSetAddPortInfo = false;
			}
			if(node.findObject('dropMarkPort') != null) {
				node.findObject('dropMark').remove(node.findObject('dropMarkPort'));
				delete node.data.PORT_DESCR;
				delete node.data.RACK_NO;
				delete node.data.RACK_NM;
				delete node.data.SHELF_NO;
				delete node.data.SHELF_NM;
				delete node.data.SLOT_NO;
				delete node.data.CARD_ID;
				delete node.data.CARD_NM;
				delete node.data.CARD_STATUS_CD;
				delete node.data.PORT_ID;
				delete node.data.PORT_NM;
				delete node.data.PORT_STATUS_CD;
				delete node.data.PORT_STATUS_NM;
				delete node.data.PORT_DUMMY;
				delete node.data.CHANNEL_DESCR;
				
				isSetDropPortInfo = false;
			}
			
//			if(addDropStatus != 3 || (nodeDataArray.length == 2 && linkDataArray.length == 1)) {
			if(addDropStatus != 3 || (nodeDataArray.length == 2)) {
				//ADD, DROP 마크 삭제
				if(node.findObject('addMark') != null) {
					node.remove(node.findObject('addMark'));
				}
				if(node.findObject('dropMark') != null) {
					node.remove(node.findObject('dropMark'));
				}
			}
		}
		
		modAddDropBtnText();
    }
    
    //ADD, DROP지정 버튼 문구 변경
    function modAddDropBtnText() {
    	if(addDropStatus === 0 || addDropStatus === 3) {
    		jQuery('button#setAddDropEnable').text('ADD, DROP 지정').css('background-color', '#878787');
    	} else if(addDropStatus === 1) {
    		jQuery('button#setAddDropEnable').text('ADD 지정').css('background-color', 'red');
    	} else if(addDropStatus === 2) {
    		jQuery('button#setAddDropEnable').text('DROP 지정').css('background-color', 'blue');
    	}
    }
    
//    function setDefaultListener() {
//    	// 정방향 역방향 설정
//    	if(useNetworkPathDirection === "RIGHT") {
//    		jQuery("#directionOne").setSelected();
//    	} else if(useNetworkPathDirection === "LEFT") {
//    		jQuery("#directionTwo").setSelected();
//    	}  else {
//			// 저장이 된 선번을 읽어 올 때
//    		if(direction == "RIGHT") {
//    			$("#directionOne").setSelected();
//    		} else {
//    			$("#directionTwo").setSelected();
//    		}
//		}
//    }
    
    
    // ADD, DROP이 지정된 경우 노드 표시
    function fillNode() {
    	for(var i = 0; i < nodeDataArray.length; i++) {
    		if(nodeDataArray[i].rightAddDropTypeCd == "A") {
    			add = ringAddDrop.findNodeForData(nodeDataArray[i]);
    			var checkedNode = add.findObject("nodeImage");
        		checkedNode.source = nodeTypeImage(nodeDataArray[i].eqpRoleDivCd);
        		setAddDropMark(add, 'A');
        		setAddDropClickEvent(add, 'addMark');
        		
        		if(isDataList) {
        			showAddDropPort(add, 'A');
        			setPortData();
        		}
    		}
    		
    		if(nodeDataArray[i].leftAddDropTypeCd == "D") {
    			drop = ringAddDrop.findNodeForData(nodeDataArray[i]);
    			var checkedNode = drop.findObject("nodeImage");
        		checkedNode.source = nodeTypeImage(nodeDataArray[i].eqpRoleDivCd);
        		setAddDropMark(drop, 'D');
        		setAddDropClickEvent(drop, 'dropMark');
        		
        		if(isDataList) {
        			showAddDropPort(drop, 'D');
        			setPortData();
        		}
    		}
    	}
    	
    	if(add != null && drop != null) {
    		highlightPath(add, drop);
    	}
    }
    
    function setSpacing() {
    	var lay = ringAddDrop.layout;
    	if(!ptpYn && nodeDataArray.length >= 2){
    		if(nodeDataArray.length < 10 && nodeDataArray.length > 0) {
        		lay.spacing = parseInt(300 / nodeDataArray.length);
        	} else {
        		lay.spacing = 10;
        	}
    	}
    }
    
    function successCallback(response, status, jqxhr, flag){
    	// parent progress z-index 설정 
    	jQuery(parent.document.body).find("#"+targetName).css("z-index", zIndex);
    	
    	console.log('response');
    	console.log(response);
    	
    	if(response.outRingList.length > 0) {
	    	jQuery("#ringAddDropDiv").append("&nbsp;&nbsp;&nbsp;<div id='btnDiv' style=''>" +
	    			"<span id='directionDiv'>" +
	    			"<label><input class='Radio' type='radio' id='directionOne' name='direction' value='RIGHT'>정방향</label>" +
	    			"<label><input class='Radio' type='radio' id='directionTwo' name='direction' value='LEFT'>역방향</label>" +
	    			"</span>" +
	    			"<span id='dataDiv' style='font-size:10px;'></span>" +
	    			"&nbsp;&nbsp;&nbsp;<button type='button' class='Button button3' id='setAddDropEnable'>ADD, DROP 지정</button>" +
	    			"<span id='explainAddDropPortSetting' style='margin:0 0 0 20px;background:yellow;visibility:hidden'>ADD, DROP 박스를 Click하면 포트를 지정할 수 있습니다.</span>" +
	    			"<span id='diagLegendBlue' name='diagLegend' style='text-align:center;width:100px;color:blue;font-size:1.1em;float:right';'>● WEST포트</span>" + 
	    			"<span id='diagLegendRed' name='diagLegend' style='text-align:center;width:100px;color:red;font-size:1.1em;float:right;'>● EAST포트</span>" +
	    			"</div>"
	    	);
	    	jQuery("#ringAddDropDiv").append("<div id='ringDiagram' style='height:680px;'></div>");
	    	jQuery("#ringAddDropDiv").append("<div class='button_box'><button type='button' class='Button button bg_blue' id='btnPrev'>이전</button><button type='button' class='Button button bg_blue' id='btnInsert'>등록</button></div>");
	    	
	    	setEventListener();
	    	
	    	// gojs 호출
	    	// maxScale
			if(response.TOPOLOGY_SMALL_CD === '002') {
				ptpYn = true;
			} else if(response.TOPOLOGY_SMALL_CD === '013') {
				wdmRing = true;
			}
		    var $ = go.GraphObject.make;
		    if(ptpYn) {
		    	ringAddDrop = $(go.Diagram, "ringDiagram", {
		    		initialContentAlignment:go.Spot.Center, padding:10, isReadOnly:true
		    		, initialAutoScale: go.Diagram.Uniform
		    		, maxSelectionCount:0
		    		, layout : $(go.GridLayout, {sorting: go.GridLayout.Forward, spacing: new go.Size(100, 100)})
		    	});
		    } else {
		    	ringAddDrop = $(go.Diagram, "ringDiagram"
		    						, {initialContentAlignment:go.Spot.Center, padding:20, isReadOnly:true, InitialLayoutCompleted : initPortPosition
		    								, initialAutoScale: go.Diagram.Uniform//, allowSelect: false
		    								, layout : $(go.CircularLayout, {sorting: go.CircularLayout.Forwards, startAngle : -90}) 
		    								//, spacing : 200 
		    								// , {spacing : 0.01, direction:go.CircularLayout.Clockwise }
		    								// , startAngle : 150, sorting: go.CircularLayout.Forwards  
		    								, maxSelectionCount:0
		    					});
		    			
		    }
		    
		    ringAddDrop.toolManager.clickSelectingTool.standardMouseSelect = function() {
		    	var diagram = this.diagram;
		    	if(diagram === null || !diagram.allowSelect) return;
		    	var e = diagram.lastInput;
		    	var count = diagram.selection.count;
		    	var curobj = diagram.findPartAt(e.documentPoint, false);
		    	
		    	if(curobj !== null) {
		    		if(count < 2) {
		    			if(!curobj.isSelected) {
		    				var part = curobj;
		    				if(part !== null) {
		    					part.isSelected = true;
		    				}
		    			}
		    		} else {
		    			if(!curobj.isSelected) {
		    				var part = curobj;
		    				if(part !== null) {
		    					diagram.select(part);
		    				}
		    			}
		    		}
		    	} else if(e.left && !(e.controll || e.meta) && !e.shift) {
		    		modAddDropBtnText();
		    		diagram.clearSelection();
		    	}
		    }
		    
		    	
		    // node 데이터 설정
		    var result = response.outRingList;
		    networkInfo[0] = response.NETWORK_ID;
    		networkInfo[1] = response.NETWORK_NM;
    		networkInfo[2] = response.NETWORK_STATUS_CD;
    		networkInfo[3] = response.NETWORK_STATUS_NM;
    		networkInfo[4] = response.PATH_DIRECTION;
    		networkInfo[5] = response.PATH_SAME_NO;
    		networkInfo[6] = response.PATH_SEQ;
    		networkInfo[7] = response.TOPOLOGY_LARGE_CD;
    		networkInfo[8] = response.TOPOLOGY_LARGE_NM;
    		networkInfo[9] = response.TOPOLOGY_SMALL_CD;
    		networkInfo[10] = response.TOPOLOGY_SMALL_NM;
    		networkInfo[11] = response.TOPOLOGY_CFG_MEANS_CD;
    		networkInfo[12] = response.TOPOLOGY_CFG_MEANS_NM;
    		
		    responseObject = result;
			direction = response.PATH_DIRECTION;
			
			// LINK_DIRECTION
			if(useNetworkPathDirection == "RIGHT") {
    			jQuery("#directionOne").setSelected();
    		} else if(useNetworkPathDirection == "LEFT") {
    			jQuery("#directionTwo").setSelected();
    		} else {
    			// 저장이 된 선번을 읽어 올 때
	    		if(response.PATH_DIRECTION == "RIGHT") {
	    			jQuery("#directionOne").setSelected();
	    		} else {
	    			jQuery("#directionTwo").setSelected();
	    		}
    		}
			
		    /****************************************************************************************************
		     * 1. 첫번째 데이터일 경우 inports를 비워두고 outports에 좌포트 데이터를 설정한다.
		     *     - 우포트 데이터를 임시 데이터로 담아둔다.(tempPortDescr, tempAddDropTypeCd)
		     * 2. 첫번째 데이터가 아닐 경우 이전 데이터의 임시 정보를 가져와서 inports에 설정하고 outports에 좌포트 데이터를 설정한다.
		     *     - 우포트 데이터를 다시 임시 데이터로 담아둔다. (tempPortDescr, tempAddDropTypeCd)
		     * 3. 마지막으로 임시데이터를 첫번째 데이터의 inports에 설정해준다.
		     ****************************************************************************************************/
			/* 아래의 FDF, WDM 장비는 노드에 포함되면 안됨.
			C00148	15	DWDM				DWDM
			C00148	16	CWDM				CWDM
			C00148	11	FDF					FDF
			C00148	124	M-WDM(기간망)		M-WDM(기간망)
			C00148	125	WDM(기간망)			WDM(기간망)
			C00148	145	WDM 시외망(단국용)	WDM 시외망(단국용)
			C00148	150	CWDM(기간망)		CWDM(기간망)
			C00148	169	WDM 시내망(단국용)	WDM 시내망(단국용)
			
			C00148	181   COUPLER		COUPLER
			
			RIGHT_EQP_ROLE_DIV_CD
			LEFT_EQP_ROLE_DIV_CD
			*/
		    var size = result.length;
		    var firstNode = true;
		    var tempPortDescr;
		    var tempAddDropTypeCd;
		    var firstNodeData = {};
		    /* 11 : FDF, 162 : QDF, 177 : OFD, 178 : IJP, 182 : PBOX */
		    var exceptNeRoleCdArray = ['15', '16', '124', '125', '145', '150', '169', '11', '162', '177', '178', '181','182'];  // PBOX 추가  2019-12-24
		    
		    // WDM_Ring은 WDM 장비도 Add-Drop 가능. FDF, 커플러만 제외.
		    if(wdmRing) {
		    	exceptNeRoleCdArray = ['11', '162', '177', '178', '181', '182']; // PBOX 추가  2019-12-24
		    }
		    
		    jQuery.each(result, function(index, value) {
//		    	console.log(value.LEFT_ADD_DROP_TYPE_CD);
//		    	console.log(value.RIGHT_ADD_DROP_TYPE_CD);
		    	var excptNeChkVal = false;
		    	
		    	if(nullToEmpty(value.LEFT_EQP_ROLE_DIV_CD) == '') {
		    		excptNeChkVal = true;
		    	}
		    	for(var i=0; i<exceptNeRoleCdArray.length; i++) {
		    		if(exceptNeRoleCdArray[i] == value.LEFT_EQP_ROLE_DIV_CD) {
		    			excptNeChkVal = true;
		    			break;
		    		}
		    	}
		    	
		    	if(excptNeChkVal){
		    		if(index == (size-1) && nodeDataArray[0].inports == 'temp') {
		    			nodeDataArray[0].inports = tempPortDescr;
		    			nodeDataArray[0].leftAddDropTypeCd = tempAddDropTypeCd;
		    		}
		    		return true;
		    	}
		    	
		    	var data = {};
		    	if(firstNode) {
		    		data.eqpSctnId = value.LINK_ID;
		    		data.key = value.LINK_SEQ;
		    		data.text = value.LEFT_NE_NM;
		    		data.text2 = omitLongText(value.LEFT_NE_NM);
		    		data.category = String(value.LINK_SEQ);
		    		data.inports = "temp";
		    		data.outports = value.LEFT_PORT_DESCR;
    				// TODO ADD DROP 데이터 확인할것.
		    		data.leftAddDropTypeCd = "temp";
		    		data.rightAddDropTypeCd = value.RIGHT_ADD_DROP_TYPE_CD;
		    		data.eqpRoleDivCd = value.LEFT_EQP_ROLE_DIV_CD;
    				
    				tempPortDescr = value.RIGHT_PORT_DESCR;
    				tempAddDropTypeCd = value.LEFT_ADD_DROP_TYPE_CD;
    				
    				data.eqpId = value.LEFT_NE_ID;
    				data.neRoleNm = value.LEFT_NE_ROLE_NM;
    				data.modelNm = value.LEFT_MODEL_NM;
    				data.orgNmL3 = value.LEFT_ORG_NM_L3;
    				data.nodeTooltipText = makeNodeTooltipTxt(data.text, data.neRoleNm, data.modelNm, data.orgNmL3);
    				
	    			firstNode = false;
		    	} else {
		    		data.eqpSctnId = value.LINK_ID;
	    			data.key = value.LINK_SEQ;
    				data.text = value.LEFT_NE_NM;
    				data.text2 = omitLongText(value.LEFT_NE_NM);
    				data.category = String(value.LINK_SEQ);
    				data.inports = tempPortDescr;
    				data.outports = value.LEFT_PORT_DESCR;
    				// TODO ADD DROP 데이터 확인할것.
    				data.leftAddDropTypeCd = tempAddDropTypeCd;
    				data.rightAddDropTypeCd = value.RIGHT_ADD_DROP_TYPE_CD;
    				data.eqpRoleDivCd = value.LEFT_EQP_ROLE_DIV_CD;
    				
    				tempPortDescr = value.RIGHT_PORT_DESCR;
    				tempAddDropTypeCd = value.RIGHT_ADD_DROP_TYPE_CD;
    				
    				data.eqpId = value.LEFT_NE_ID;
    				data.neRoleNm = value.LEFT_NE_ROLE_NM;
    				data.modelNm = value.LEFT_MODEL_NM;
    				data.orgNmL3 = value.LEFT_ORG_NM_L3;
    				data.nodeTooltipText = makeNodeTooltipTxt(data.text, data.neRoleNm, data.modelNm, data.orgNmL3);
    				
//    				makeNodeTemplate($, data.category, data.inports, data.outports, ptpYn);
		    	}
 
		    	nodeDataArray.push(data);
		    	
		    	// 마지막
		    	if(index == (size-1)) {
		    		if(size == 1) {
		    			// 구간이 하나일 경우
		    			data.inports = '';
		    			data.leftAddDropTypeCd = '';
//		    			makeNodeTemplate($, data.category, data.inports, data.outports, ptpYn);
		    			 
		    			var data = {};
		    			data.eqpSctnId = value.LINK_ID;
		    			data.key = parseInt(value.LINK_SEQ)+1;
	    				data.text = value.RIGHT_NE_NM;
	    				data.text2 = omitLongText(value.RIGHT_NE_NM);
	    				data.category = String(value.LINK_SEQ);
	    				data.inports = value.RIGHT_PORT_DESCR;
	    				data.outports = '';
	    				data.leftAddDropTypeCd = value.RIGHT_ADD_DROP_TYPE_CD;
	    				data.rightAddDropTypeCd = '';
	    				//data.eqpRoleDivCd = value.LEFT_EQP_ROLE_DIV_CD;
	    				data.eqpRoleDivCd = value.RIGHT_EQP_ROLE_DIV_CD;
	    				
	    				data.eqpId = value.RIGHT_NE_ID;
	    				data.neRoleNm = value.RIGHT_NE_ROLE_NM;
	    				data.modelNm = value.RIGHT_MODEL_NM;
	    				data.orgNmL3 = value.RIGHT_ORG_NM_L3;
	    				data.nodeTooltipText = makeNodeTooltipTxt(data.text, data.neRoleNm, data.modelNm, data.orgNmL3);
	    				
	    				var isExcptNe = false;
	    				
	    				if(nullToEmpty(data.eqpRoleDivCd) == '') {
	    					isExcptNe = true;
	    				}
	    				for(var i=0; i<exceptNeRoleCdArray.length; i++) {
	    		    		if(data.eqpRoleDivCd == exceptNeRoleCdArray[i]) {
	    		    			isExcptNe = true;
	    		    			break;
	    		    		}
	    		    	}
	    				
	    				if(!isExcptNe) {
	    					makeNodeTemplate($, data.category, data.inports, data.outports, ptpYn);
			    			nodeDataArray.push(data);
	    				}
		    		} else {
		    			nodeDataArray[0].inports = tempPortDescr;
		    			nodeDataArray[0].leftAddDropTypeCd = tempAddDropTypeCd;
//		    			makeNodeTemplate($, nodeDataArray[0].category, nodeDataArray[0].inports, nodeDataArray[0].outports, ptpYn);
		    		}
		    	}  
		    });
		    
		    makeNodeTemplate($, ptpYn);
		    
		    // 노드 갯수가 0개인 경우 조회되지 않는다는 메시지와 함께 창 닫음.
//		    if((editYn == false || editYn === "N") && nodeDataArray.length < 1) {
		    if(nodeDataArray.length < 1) {		    	
		    	callMsgBox('','W', '링 구성도를 표시할 데이터가 없습니다.', function(msgId, msgRst){
	        		if (msgRst == 'Y') {
	        			var returnData = {};
	            		$a.close(returnData);
	        		}
	    		});
		    	
		    	return false;
		    }

//		    setDefaultListener();
	
		    // link 데이터 설정
		    for(var i = 0; i < nodeDataArray.length; i++) {
		    	if(i == nodeDataArray.length -1) {
		    		if(i == 0) {
		    			linkDataArray = {};
		    		} else if(responseObject.length > 1 && !ptpYn) {
		    			linkDataArray.push({from : parseInt(nodeDataArray[i].key), to: parseInt(nodeDataArray[0].key)});
		    		}
	    		} else {
	    			linkDataArray.push({from : parseInt(nodeDataArray[i].key), to: parseInt(nodeDataArray[i+1].key)});
	    		}
		    }
		    
//		    setDefaultListener();
		    
		    // 링크 설정
//		    if(!ptpYn || nodeDataArray.length > 1) {
		    if(!ptpYn && linkDataArray.length >= 1) {		    	
		    	ringAddDrop.linkTemplate = $(go.Link, {routing:go.Link.Normal, selectable:false, curve:go.Link.Bezier}
										, $(go.Shape, {strokeWidth:2, stroke:"black"}
										, new go.Binding("stroke", "isHighlighted", function(h) {return h ? "green" : "black";}).ofObject())
										, $(go.Shape, {toArrow: "Standard", stroke:"black"}
										, new go.Binding("stroke", "isHighlighted", function(h) {return h ? "green" : "black";}).ofObject())
						);
		    }
		    
		    //노드갯수(장비갯수)가 2개인 링인 경우(ptp링 아님) add, drop 미리 지정
		    if ((editYn != false && editYn !== "N") && nodeDataArray.length == 2 && linkDataArray.length == 1) {
//		    else if ((editYn != false && editYn !== "N") && nodeDataArray.length == 2 ) {
		    	nodeDataArray[0].rightAddDropTypeCd = "A";
		    	nodeDataArray[1].leftAddDropTypeCd = "D";
		    	addDropStatus = 3;
		    }
		    
		    setPortData();
		    setCurvVal();
		    
		    if(linkDataArray.length >= 1) {
		    	ringAddDrop.model.linkDataArray = linkDataArray;
		    }
		    if(nodeDataArray.length > 0) {
		    	ringAddDrop.model.nodeDataArray = nodeDataArray;
		    }
		    
		    //정방향, 역방향 확인 후 링크 전환
		    if(jQuery("input[name=direction]").getValue() == 'LEFT') {
		    	changeDirection();
		    }
		    
		    fillNode();
		    setSpacing();
		    btnSetting();
		    
		    // 툴팁 설정
		    if(editYn != false && editYn !== "N") {
		    	ringAddDrop.toolTip = $(go.Adornment, "Auto", 
		    			new go.Binding("visible", "text", function(){return (addDropStatus > 0 && addDropStatus < 3)}).ofObject(),
	    				$(go.Shape, { fill: "#FFFFCC" }),
	    				$(go.TextBlock, {margin: 4}, new go.Binding("text", "", getAddDropToolTipStr))
	    				);
		    }
		    
		    // add, drop이 지정된 상태이면 port 지정할 수 있다는 문구표시
		    if(addDropStatus == 3) {
		    	jQuery('#explainAddDropPortSetting').css('visibility', 'visible');
		    }
		    
    	} else {
    		callMsgBox('','W', '조회된 데이터가 없습니다.', function(msgId, msgRst){
        		if (msgRst == 'Y') {
        			var returnData = {};
//            		returnData.prev = 'Y';
            		$a.close(returnData);
        		}
    		});
    	}
    }
    
    function setPortData() {
    	// Grid에 set된 링명 더블클릭으로 들어온 경우
	    if(isDataList) {
//	    	var isSetAdd = false;
//	    	var isSetDrop = false;
	    	
	    	for(var j = 0; j <nodeDataArray.length; j++) {
    			if(paramDataList[0].RIGHT_ADD_DROP_TYPE_CD == 'A' && paramDataList[0].RIGHT_NE_ID == nodeDataArray[j].eqpId) {
    				nodeDataArray[j].leftAddDropTypeCd = paramDataList[0].LEFT_ADD_DROP_TYPE_CD;
    				nodeDataArray[j].rightAddDropTypeCd = paramDataList[0].RIGHT_ADD_DROP_TYPE_CD;
    				nodeDataArray[j].PORT_DESCR = paramDataList[0].RIGHT_PORT_DESCR;
    				nodeDataArray[j].RACK_NO = paramDataList[0].RIGHT_RACK_NO;
    				nodeDataArray[j].RACK_NM = paramDataList[0].RIGHT_RACK_NM;
    				nodeDataArray[j].SHELF_NO = paramDataList[0].RIGHT_SHELF_NO;
    				nodeDataArray[j].SHELF_NM = paramDataList[0].RIGHT_SHELF_NM;
    				nodeDataArray[j].SLOT_NO = paramDataList[0].RIGHT_SLOT_NO;
    				nodeDataArray[j].CARD_ID = paramDataList[0].RIGHT_CARD_ID;
    				nodeDataArray[j].CARD_NM = paramDataList[0].RIGHT_CARD_NM;
    				nodeDataArray[j].CARD_STATUS_CD = paramDataList[0].RIGHT_CARD_STATUS_CD;
    				nodeDataArray[j].PORT_ID = paramDataList[0].RIGHT_PORT_ID;
    				nodeDataArray[j].PORT_NM = paramDataList[0].RIGHT_PORT_NM;
    				nodeDataArray[j].PORT_STATUS_CD = paramDataList[0].RIGHT_PORT_STATUS_CD;
    				nodeDataArray[j].PORT_STATUS_NM = paramDataList[0].RIGHT_PORT_STATUS_NM;
    				nodeDataArray[j].PORT_DUMMY = paramDataList[0].RIGHT_PORT_DUMMY;
    				nodeDataArray[j].CHANNEL_DESCR = paramDataList[0].RIGHT_CHANNEL_DESCR;
    				
    				isSetAddPortInfo = true;
    			} else if(paramDataList[paramDataList.length-1].LEFT_ADD_DROP_TYPE_CD == 'D' && paramDataList[paramDataList.length-1].LEFT_NE_ID == nodeDataArray[j].eqpId) {
	    			
	    			nodeDataArray[j].leftAddDropTypeCd = paramDataList[paramDataList.length-1].LEFT_ADD_DROP_TYPE_CD;
    				nodeDataArray[j].rightAddDropTypeCd = paramDataList[paramDataList.length-1].RIGHT_ADD_DROP_TYPE_CD;
    				nodeDataArray[j].PORT_DESCR = paramDataList[paramDataList.length-1].LEFT_PORT_DESCR;
    				nodeDataArray[j].RACK_NO = paramDataList[paramDataList.length-1].LEFT_RACK_NO;
    				nodeDataArray[j].RACK_NM = paramDataList[paramDataList.length-1].LEFT_RACK_NM;
    				nodeDataArray[j].SHELF_NO = paramDataList[paramDataList.length-1].LEFT_SHELF_NO;
    				nodeDataArray[j].SHELF_NM = paramDataList[paramDataList.length-1].LEFT_SHELF_NM;
    				nodeDataArray[j].SLOT_NO = paramDataList[paramDataList.length-1].LEFT_SLOT_NO;
    				nodeDataArray[j].CARD_ID = paramDataList[paramDataList.length-1].LEFT_CARD_ID;
    				nodeDataArray[j].CARD_NM = paramDataList[paramDataList.length-1].LEFT_CARD_NM;
    				nodeDataArray[j].CARD_STATUS_CD = paramDataList[paramDataList.length-1].LEFT_CARD_STATUS_CD;
    				nodeDataArray[j].PORT_ID = paramDataList[paramDataList.length-1].LEFT_PORT_ID;
    				nodeDataArray[j].PORT_NM = paramDataList[paramDataList.length-1].LEFT_PORT_NM;
    				nodeDataArray[j].PORT_STATUS_CD = paramDataList[paramDataList.length-1].LEFT_PORT_STATUS_CD;
    				nodeDataArray[j].PORT_STATUS_NM = paramDataList[paramDataList.length-1].LEFT_PORT_STATUS_NM;
    				nodeDataArray[j].PORT_DUMMY = paramDataList[paramDataList.length-1].LEFT_PORT_DUMMY;
    				nodeDataArray[j].CHANNEL_DESCR = paramDataList[paramDataList.length-1].LEFT_CHANNEL_DESCR;
    				
    				isSetDropPortInfo = true;
	    		}
    		}
	    	
	    	if(isSetAddPortInfo && isSetDropPortInfo) {
	    		addDropStatus = 3;
	    	} else {
	    		addDropStatus = 0;
	    	}
	    }
    }
    
    function setCurvVal() {
    	if(!ptpYn && linkDataArray.length >= 1) {
    		var curvinessVal = ringAddDrop.linkTemplate.curviness;
        	var directionVal = jQuery("input[name=direction]").getValue();
        	
        	if(isNaN(curvinessVal)) {
        		var defaultCurvVal = 210 * Math.pow(nodeDataArray.length, -1);
            	
            	if(directionVal == 'LEFT') {
            		defaultCurvVal *= -1;
            	}
            	
        		ringAddDrop.linkTemplate.curviness = defaultCurvVal;
        	} else {
        		if(directionVal == 'LEFT') {
        			ringAddDrop.linkTemplate.curviness = Math.abs(curvinessVal) * -1;
        		} else if(directionVal == 'RIGHT') {
        			ringAddDrop.linkTemplate.curviness = Math.abs(curvinessVal);
        		}
        	}
    	}
    }
    
    function getAddDropToolTipStr() {
    	var str = '';
    	if(addDropStatus === 1) {
    		str = 'ADD를 지정하세요';
    	} else if(addDropStatus === 2) {
    		str = 'DROP을 지정하세요';
    	}
    	
    	return str;
    }
    
    function makeNodeTemplate($, ptpYn) {
    	var inport = makePort($, true);
    	var outport = makePort($, false);
    	var node = "";
    	if(!ptpYn) {
    		node = $(go.Node, "Spot"
					, {locationSpot: go.Spot.Center, name : "nodeData", selectionAdorned:false, selectionChanged: addDropSelect
    					, toolTip : $(go.Adornment, "Auto",
    									$(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"}),
    									$(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4})
    								)
    				}
					, $(go.Picture, {name : "nodeImage", desiredSize: new go.Size(77, 78)}, new go.Binding("source", "eqpRoleDivCd", nodeTypeImage))
					, $(go.Panel, "Vertical", {name : "portLeft", alignment: go.Spot.Left}
							//, $(go.TextBlock, inports, {width: 50, name : "portLeftText", font: "9pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							//, $(go.TextBlock, new go.Binding("text", "inports"), {name : "portLeftText", font: "10pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							, inport
					)
					, $(go.TextBlock, new go.Binding("text", "inports"), 
							{name : "portLeftText", font: "14pt Dotum", width : 120, alignment : new go.Spot(0.5,0.5,-120,0), textAlign : "left"}
					)
					, $(go.Panel, "Vertical", {name : "portRight", alignment: go.Spot.Right}
							//, $(go.TextBlock, outports, {width: 50, name : "portRightText", font: "9pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							//, $(go.TextBlock, new go.Binding("text", "outports"), {name : "portRightText", font: "10pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							, outport
					)
					, $(go.TextBlock, new go.Binding("text", "outports"), 
							{name : "portRightText", font: "14pt Dotum", width : 120, alignment: new go.Spot(0.5,0.5,120,0), textAlign : "right"}
					)
					, $(go.TextBlock, new go.Binding("text", "text2"), 
							{font: "16pt Dotum bold", alignment:go.Spot.BottomCenter, width: 200, textAlign : "center"
							, wrap : go.TextBlock.wrapDesiredSize}
					)
    		);
    	} else {
    		node = $(go.Node, "Spot"
					, {locationSpot: go.Spot.Center, name : "nodeData", selectionAdorned:false, selectionChanged: addDropSelect
		    			, toolTip : $(go.Adornment, "Auto",
								$(go.Shape, "RoundedRectangle", {fill: "#FFFFCC"}),
								$(go.TextBlock, new go.Binding("text", "nodeTooltipText"), { margin: 4})
							)
    				}
					, $(go.Picture, {name : "nodeImage", desiredSize: new go.Size(60, 60)}, new go.Binding("source", "eqpRoleDivCd", nodeTypeImage))
					, $(go.Panel, "Vertical", {name : "portLeft", alignment: go.Spot.Left}
							//, $(go.TextBlock, inports, {width: 50, name : "portLeftText", font: "9pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							//, $(go.TextBlock, new go.Binding("text", "inports"), {name : "portLeftText", font: "10pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							, inport
					)
					, $(go.TextBlock, new go.Binding("text", "inports"), 
							{name : "portLeftText", font: "14pt Dotum", width : 120, alignment : new go.Spot(0.5,0.5,-120,0), textAlign : "center"}
					)
					, $(go.Panel, "Vertical", {name : "portRight", alignment: go.Spot.Right}
							//, $(go.TextBlock, outports, {width: 50, name : "portRightText", font: "9pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							//, $(go.TextBlock, new go.Binding("text", "outports"), {name : "portRightText", font: "10pt Dotum", alignment:go.Spot.BottomLeft, alignmentFocus: go.Spot.TopRight})
							, outport
					)
					, $(go.TextBlock, new go.Binding("text", "outports"), 
							{name : "portRightText", font: "14pt Dotum", width : 120, alignment: new go.Spot(0.5,0.5,120,0), textAlign : "center"}
					)
					, $(go.TextBlock, new go.Binding("text", "text2"), 
							{font: "16pt Dotum bold", alignment:go.Spot.BottomCenter, width: 200, textAlign : "center"
							, wrap : go.TextBlock.wrapDesiredSize}
					)
    		);
    	}
    	
    	ringAddDrop.nodeTemplate = node;
    }
    
    
    function nodeTypeImage(eqpRoleDivCd) {
    	var imagePath = getContextPath() + "/resources/images/topology/";
    	if(eqpRoleDivCd == '01') return imagePath + "L2-SW_01.png";
    	else if(eqpRoleDivCd == '02') return imagePath + "L2-SW_01.png";
    	else if(eqpRoleDivCd == '03') return imagePath + "L3-SW_01.png";
    	else if(eqpRoleDivCd == '04') return imagePath + "IBC_01.png";
    	else if(eqpRoleDivCd == '05') return imagePath + "IBR_01.png";
    	else if(eqpRoleDivCd == '06') return imagePath + "IBRR_01.png";
    	else if(eqpRoleDivCd == '07') return imagePath + "PTS_01.png";
    	else if(eqpRoleDivCd == '15') return imagePath + "DWDM_01.png";
    	else if(eqpRoleDivCd == '18') return imagePath + "SCAN_WM_01.png";
    	else if(eqpRoleDivCd == '21') return imagePath + "OTN_01.png";
//    	else if(eqpRoleDivCd == '23') return imagePath + "DU_01.png";
    	else if(eqpRoleDivCd == '25') return imagePath + "RU_01.png";
    	else if(eqpRoleDivCd == '101') return imagePath + "RT_01.png";
    	else return imagePath + "PG_01.png";
    }
    
    function nodeTypeImageOn(eqpRoleDivCd) {
    	var imagePath = getContextPath() + "/resources/images/topology/";
    	if(eqpRoleDivCd == '01') return imagePath + "L2-SW_01_ON.png";
    	else if(eqpRoleDivCd == '02') return imagePath + "L2-SW_01_ON.png";
    	else if(eqpRoleDivCd == '03') return imagePath + "L3-SW_01_ON.png";
    	else if(eqpRoleDivCd == '04') return imagePath + "IBC_01_ON.png";
    	else if(eqpRoleDivCd == '05') return imagePath + "IBR_01_ON.png";
    	else if(eqpRoleDivCd == '06') return imagePath + "IBRR_01_ON.png";
    	else if(eqpRoleDivCd == '07') return imagePath + "PTS_01_ON.png";
    	else if(eqpRoleDivCd == '15') return imagePath + "DWDM_01_ON.png";
    	else if(eqpRoleDivCd == '18') return imagePath + "SCAN_WM_01_ON.png";
    	else if(eqpRoleDivCd == '21') return imagePath + "OTN_01_ON.png";
//    	else if(eqpRoleDivCd == '23') return imagePath + "DU_01_ON.png";
    	else if(eqpRoleDivCd == '25') return imagePath + "RU_01_ON.png";
    	else if(eqpRoleDivCd == '101') return imagePath + "RT_01_ON.png";
    	else return imagePath + "PG_01_ON.png";
    }
    
//    function makePort($, value, leftside) {
//		var portLeft = $(go.Shape, "Circle"
//			   			, { name : "portLeftPanel", fill : "red", stroke:null, desiredSize: new go.Size(15, 15)} // , portId : "", toMaxLinks:1
//	   					);
//		var portRight = $(go.Shape, "Circle"
//	   					, { name : "portRightPanel", fill : "blue", stroke:null, desiredSize: new go.Size(15, 15)} // , portId : "", toMaxLinks:1
//						);
//		var panel = $(go.Panel, "Horizontal", {margin: new go.Margin(2,0)});
//	   
//		if(leftside) {
//			panel.add(portLeft);
//		} else {
//			panel.add(portRight);
//		}
//		return panel;
//	}

	function makePort($, leftside) {
		var portLeft = $(go.Shape, "Circle"
			   			, { name : "portLeftPanel", fill : "red", stroke:null, desiredSize: new go.Size(15, 15)} // , portId : "", toMaxLinks:1
	   					);
		var portRight = $(go.Shape, "Circle"
	   					, { name : "portRightPanel", fill : "blue", stroke:null, desiredSize: new go.Size(15, 15)} // , portId : "", toMaxLinks:1
						);
		var panel = $(go.Panel, "Horizontal", {margin: new go.Margin(2,0)});
	   
		if(leftside) {
			panel.add(portLeft);
		} else {
			panel.add(portRight);
		}
		return panel;
	}
    
    // ADD, DROP선택
    function addDropSelect(node) {
    	var diagram = node.diagram;
    	if(diagram === null) {
    		return;
    	}
    	
    	if(node.isSelected) {
    		var checkedNode = node.findObject("nodeImage");
    		checkedNode.source = nodeTypeImageOn(node.data.eqpRoleDivCd);
    		
    		if(diagram.selection.count === 2) {
    			var begin = diagram.selection.first();
    			var end = node;
    			highlightPath(begin, end);
    			add = begin;
    			drop = end;
    			diagram.setProperties({maxSelectionCount:0});
    			addDropStatus = 3;
    			//문구표시
    		    jQuery('#explainAddDropPortSetting').css('visibility', 'visible');
    			setAddDropMark(node, 'D');
    			setAddDropClickEvent(node, 'dropMark');
    		} else if(diagram.selection.count === 1) {
    			addDropStatus = 2;
    			setAddDropMark(node, 'A');
    			setAddDropClickEvent(node, 'addMark');
    		}
    	} else {
    		/*
    		if(!addDropChek) {
    			var msg = makeArgMsg("selectObject", cflineMsgArray['equipment']);
	    		callMsgBox('','I', msg, function(msgId, msgRst){
	        		if (msgRst == 'Y') {
	        			addDropChek = false;
	    	    		
//	    	    		ringAddDrop.setProperties({maxSelectionCount:0});
	    	    		ringAddDrop.setProperties({maxSelectionCount: 2});
	    	    		
	    	    		// 설정된 노드 리셋
	    	    		pathReset();
	    	    		drop = null;
	    	    		return;
	        		}
	    		});
	    		
	    		add = diagram.selection;
    		}
    		*/
    		
    		if(addDropStatus != 3) {
    			var msg = makeArgMsg("selectObject", cflineMsgArray['equipment']);
	    		callMsgBox('','I', msg, function(msgId, msgRst){
	        		if (msgRst == 'Y') {

	        			addDropStatus = 0;
	        			ringAddDrop.setProperties({maxSelectionCount:0});
	        			// 설정된 노드 리셋
	    	    		pathReset();
	    	    		return;
	        		}
	    		});
    		}
    		
    	}
    }
    
    
    function setAddDropMark(node, div) {
		var $1 = go.GraphObject.make;
		
		if(div === 'A') {
			node.add($1(go.Panel, "Vertical", 
					{name: 'addMark', alignment: new go.Spot(0.5,0.5,0,-70), cursor: 'pointer'},
					$1(go.TextBlock, {text: 'ADD', font: '14pt Dotum bold', stroke: 'white', background : 'green'})
			));
		} else if(div === 'D') {
			node.add($1(go.Panel, "Vertical", 
					{name: 'dropMark', alignment: new go.Spot(0.5,0.5,0,70), cursor: 'pointer'},
					$1(go.TextBlock, {text: 'DROP', font: '14pt Dotum bold', stroke: 'white', background : 'green'})
			));
		}
		
		modAddDropBtnText();
    }
    
    function showAddDropPort(node, div) {
    	if(node.data.hasOwnProperty('PORT_DESCR') && nullToEmpty(node.data.PORT_DESCR) !== '') {
    		var $1 = go.GraphObject.make;
    		
    		if(div === 'A') {
    			if(node.findObject('addMarkPort') != null) {
    				node.findObject('addMark').remove(node.findObject('addMarkPort'));
    			}
    			
    			node.findObject('addMark').add($1(go.TextBlock, 
    					{name: 'addMarkPort', text: node.data.PORT_DESCR, font: '10pt Dotum', stroke: 'black', background : 'yellow'}
    			));
    		} else if(div === 'D') {
    			if(node.findObject('dropMarkPort') != null) {
    				node.findObject('dropMark').remove(node.findObject('dropMarkPort'));
    			}
    			
    			node.findObject('dropMark').add($1(go.TextBlock, 
    					{name: 'dropMarkPort', text: node.data.PORT_DESCR, font: '10pt Dotum', stroke: 'black', background : 'yellow'}
    			));
    		}
    	}
    }
    
    function setAddDropClickEvent(node, nodeNm) {
    	node.findObject(nodeNm).setProperties({click: function(e, obj){
    		//param = LEFT, RIGHT
    		var param = '';
    		var direction = jQuery("input[name=direction]").getValue();
    		
    		if(nodeNm.indexOf('add') == 0) {
    			if(direction == 'RIGHT') {
    				param = 'RIGHT';
    			} else if(direction == 'LEFT'){
    				param = 'LEFT';
    			}
    		} else if(nodeNm.indexOf('drop') == 0) {
    			if(direction == 'RIGHT') {
    				param = 'LEFT';
    			} else if(direction == 'LEFT'){
    				param = 'RIGHT';
    			}
    		}
    		
    		openPortListPop(obj.part.data.eqpId, "", param, node, nodeNm);
    	}});
    }
    
    function openPortListPop(eqpId, searchPortNm, param, node, nodeNm){
		var paramData = new Object();
		$.extend(paramData,{"neId":nullToEmpty(eqpId)});
		$.extend(paramData,{"portNm":nullToEmpty(searchPortNm)});
		
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		$a.popup({
		  	popid: "popPortListSch" + param,
		  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
		  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
		  	data: paramData,
		  	iframe:true,
			modal: true,
			movable:true,
			windowpopup : true,
			width : 850,
			height : 700,
			callback:function(data){
				if(data != null && data.length > 0){
					node.data.PORT_DESCR = data[0].portDescr;
					node.data.RACK_NO = data[0].rackNo;
					node.data.RACK_NM = data[0].rackNm;
					node.data.SHELF_NO = data[0].shelfNo;
					node.data.SHELF_NM = data[0].shelfNm;
					node.data.SLOT_NO = data[0].slotNo;
					node.data.CARD_ID = data[0].cardId;
					node.data.CARD_NM = data[0].cardNm;
					node.data.CARD_STATUS_CD = data[0].cardStatusCd;
					node.data.PORT_ID = data[0].portId;
					node.data.PORT_NM = data[0].portNm;
					node.data.PORT_STATUS_CD = data[0].portStatusCd;
					node.data.PORT_STATUS_NM = data[0].portStatusNm;
					node.data.PORT_DUMMY = data[0].portDummy;
					node.data.CHANNEL_DESCR = data[0].channelDescr;
					
					var div = '';
					if(nodeNm.indexOf('add') == 0) {
						div = 'A';
						isSetAddPortInfo = true;
					} else if(nodeNm.indexOf('drop') == 0) {
						div = 'D';
						isSetDropPortInfo = true;
					}
					showAddDropPort(node, div);
				}
			}
		}); 
    }
    
    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str == "undefined") {
        	str = "";
        }	
    	return str;
    }
    
    function highlightPath(begin, end) {
    	/****************************************************************************
    	 * 1. 정방향일 경우
    	 *  - ADD장비의 좌포트가 ADD가 되고 DROP장비의 우포트가 DROP이 된다.
    	 * 2. 역방향일 경우
    	 *  - ADD장비의 우포트가 ADD가 되고 DROP장비의 좌포트가 DROP이 된다.
    	 *  # begin : add, end : drop
    	 ****************************************************************************/
    	var addLeft = begin.findObject("portLeftText").text;
    	var addRight = begin.findObject("portRightText").text;
    	var dropLeft = end.findObject("portLeftText").text;
    	var dropRight = end.findObject("portRightText").text;
    	
    	var addDropText = "";
    	var direction = jQuery("input[name=direction]").getValue();
    	if(direction === "RIGHT") {
    		// 정방향
    		begin.findObject("portLeftPanel").stroke = "black";
    		end.findObject("portRightPanel").stroke = "black";
    		begin.findObject("portLeftPanel").strokeWidth = 2;
    		end.findObject("portRightPanel").strokeWidth = 2;
    		
    		addDropText = addLeft + " / " + dropRight;
    		
    		// 리셋
    		begin.findObject("portRightPanel").stroke = null;
    		end.findObject("portLeftPanel").stroke = null;
    	} else if(direction === "LEFT") {
    		// 역방향
    		begin.findObject("portRightPanel").stroke = "black";
    		end.findObject("portLeftPanel").stroke = "black";
    		begin.findObject("portRightPanel").strokeWidth = 2;
    		end.findObject("portLeftPanel").strokeWidth = 2;
    		addDropText = addRight + " / " + dropLeft;
    		
    		// 리셋
    		begin.findObject("portLeftPanel").stroke = null;
    		end.findObject("portRightPanel").stroke = null;
    	}
    	
//		jQuery("#dataDiv").html(addDropText);
    	var path = new go.List();
    	path.add(end);
    	
    	while(end !== null) {
    		var next = end.findNodesInto().value;
    		
	    	if(next !== null) {
	    		path.add(next);
	    		
	    		if(begin === next) {
	    			next = null;
	    		} 
	    	}
	    	end = next;
    	}
    	path.reverse();
    	
    	// 노드 색깔
    	for(var i = 0; i < path.count; i++) {
    		var node = path.elt(i)
    		var checkedNode = node.findObject("nodeImage");
    		checkedNode.source = nodeTypeImageOn(node.data.eqpRoleDivCd);    		
    	}
    	
    	// 링크 색깔
    	for(var i = 0; i < path.count -1; i++) {
    		var f = path.elt(i);
    		var t = path.elt(i+1);
    		
    		f.findLinksTo(t).each(function(l) {
    			l.isHighlighted = true;
    		});
    	}
    	
    	//addDropChek = true;
    	addDropStatus = 3;
    }
    
    /**
     * 함수명 		: initPortPosition
     * parameter 	: 없음
     * return 	 	: 없음
     * 역할 		: 한 노드의 좌우 포트점을 화면 중점 기준으로 중점보다 오른쪽에 노드가 위치하면 포트는 그대로
     * 				  중점보다 왼쪽에 노드가 위치하면 포트는 좌우 변경.
     * 				  ptp는 적용 안 됨.
     */
    function initPortPosition() {
    	var locMaxX = 0;
		var locMinX = 0;
		var locMaxY = 0;
		var locMinY = 0;
		
		// 중점 위치 계산
    	for(var i = 0; i < nodeDataArray.length; i++) {
			var node = ringAddDrop.findNodeForData(nodeDataArray[i]);
			var x = node.location.x;
			var y = node.location.y;
			
			if(x > locMaxX) locMaxX = x;
			if(locMinX == 0 || locMinX > x) locMinX = x;
			
			//if(y > locMaxY) locMaxY = x;
			if(y > locMaxY) locMaxY = y;
			if(locMinY == 0 || locMinY > y) locMinY = y;
		}
    	var center = (locMaxX + locMinX) / 2;
    	var centerY = (locMaxY + locMinY) / 2;
		
		// 중점 위치의 x값은 처음 노드의 x location값이라 판단됨.
    	if(nodeDataArray.length > 0) {
//    		var firstNode = ringAddDrop.findNodeForData(nodeDataArray[0]);
//    		var center = firstNode.location.x;
//    		var centerX = parseInt(firstNode.location.x);
//    		var centerY = parseInt(Math.abs(firstNode.location.y)) * -1;
    		
        	for(var i = 0; i < nodeDataArray.length; i++) {
    			var node = ringAddDrop.findNodeForData(nodeDataArray[i]);
    			var x = node.location.x;
    			var y = node.location.y;
    			
//    			if(y > centerY) {
    				if( (x - center) < (y - centerY) ) {
    					if(node.findObject("portLeft") != null) {
    						node.findObject("portLeft").alignment = go.Spot.Right;
    						node.findObject("portRight").alignment = go.Spot.Left;
    						
    						// 포트 텍스트를 같은 panel에서 분리 후에 추가된 소스
    						node.findObject("portLeftText").alignment = new go.Spot(0.5,0.5,120,0);
    						node.findObject("portLeftText").textAlign = "right";
    						node.findObject("portRightText").alignment = new go.Spot(0.5,0.5,-120,0);
    						node.findObject("portLeftText").textAlign = "left";
    					} else {
    						// 포트가 null일 경우 예외처리
    					}
    				}
//    			}
    		}
    	}
    }

    function btnSetting() {
    	if(editYn == false || editYn === "N") {
    		jQuery("#setAddDropEnable").remove();
    		jQuery("#btnPrev").remove();
    		jQuery("#btnInsert").remove();
    		jQuery("#directionOne").setEnabled(false);
    		jQuery("#directionTwo").setEnabled(false);
    	}
    }
    
    function omitLongText(str, lenWanted) {
    	var text = '';
    	var length = 0;
    	
    	if(lenWanted == null || isNaN(lenWanted)) {
    		length = 28;
    	} else {
    		length = lenWanted;
    	}
    	
    	if(nullToEmpty(str) == '') {
    		text = '';
    	} else if(str.length <= length) {
    		text = str;
    	} else {
    		text = str.substring(0, length) + '...';
    	}
    	
    	return text;
    }
    
    function makeNodeTooltipTxt(neNm, neRoleNm, modelNm, orgNmL3){
    	return '장비명 : '+ neNm +'\n장비타입 : ' + neRoleNm + '\n모델명 : ' + modelNm + '\n소속국사 : ' + orgNmL3;
    }
});
