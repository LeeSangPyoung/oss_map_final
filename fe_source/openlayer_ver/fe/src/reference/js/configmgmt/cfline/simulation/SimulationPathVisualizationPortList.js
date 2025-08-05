/**
 * SimulationPathVisualizationPortList.js
 *
 * @author Administrator
 * @date 2017. 7. 11. 
 * @version 1.0
 */

var portGridId = "portList";
var portData = null;
var isRing = false;
var portParamData = null;
var portYn = false;
var pageCount = 500;
var setTeamsPath = null;
var setPortData = new PortDescr();
var setTarget = null;
var channelIds = [];
var channelVal = "";
var isFdf = false;
var useNetworkId = "";
var useNetworkChannel = "";
var e1ChannelList = [];
var initParam = null;
var visualLinePath = null;
var teamsPath = null;

var portPop = $a.page(function() {
	
	this.init = function(id, param) {
		initParam = param;
		visualLinePath = opener.visualLinePath;
		teamsPath = opener._app.tpu.teamsPath;
		
		initGridPortInf();
		
		var node = param.node;
		Object.setPrototypeOf(node, TeamsNode.prototype);
		node.resetPrototype();
		
		if(isServiceLine()) {
			$("#t1Check").css("display", "");
		} else {
			$("#channelRight").hide();
			$("#channelLeft").css('width', '100%');
		}
		
		portSearch(node, param.target);
		


    	$('#ruleSpan > .arrow_more').click(function(){
    		var $this = $(this);
    		
    		var $condition_box = $this.closest('.portChannel');
    		var $more_condition = $condition_box.find('.ruleDiv');
    		if($more_condition.css('display') == 'none'){
    			$this.addClass('on')
    			$more_condition.show();
    			
    			$("#portChannelDiv").css({"height":"500px"});
    			$("#channel").css("height", "20vh");
    			$("#channelLeft").css("height", "20vh");
    			$("#channelRight").css("height", "20vh");
    			$('#'+portGridId).alopexGrid("updateOption", { height: 400});
    			$("#waveLength").alopexGrid("updateOption", { height: 200});
    			$("#"+portGridId).alopexGrid("viewUpdate");
    			$("#waveLength").alopexGrid("viewUpdate");
    		}else{
    			$this.removeClass('on')
    			$more_condition.hide();
    			
    			// 그리드 높이 조정. 포트/채널 영역 높이 조정
    			$("#portChannelDiv").css({"height":"650px"});
    			$("#channel").css("height", "35vh");
    			$("#channelLeft").css("height", "35vh");
    			$("#channelRight").css("height", "35vh");
    			$('#'+portGridId).alopexGrid("updateOption", { height: 500});
    			$("#waveLength").alopexGrid("updateOption", { height: 340});
    			$("#"+portGridId).alopexGrid("viewUpdate");
    			$("#waveLength").alopexGrid("viewUpdate");
    		}
    	});
		
		// 탭 변경전 validation 체크
		$("#portChannelTab").on("beforetabchange", function(e,index) {
			if(index == 0 ) {
				// 포트 선택 체크
				var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
				console.log(dataObj.length);
				if(dataObj.length != 1) {
					alertBox('W', cflineMsgArray['pleaseChooseOnePort']); /*'포트를 하나 선택하세요.'*/
					$(this).cancelThisTabChange();
					return;
				} 
			} else if(index == 1) {
				// 파장 선택이 가능한지 체크
				var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
				if(dataObj.length != 1) {
					alertBox('W', cflineMsgArray['pleaseChooseOnePort']); /*'포트를 하나 선택하세요.'*/
					$(this).cancelThisTabChange();
					return;
				} else {
					var eqpMdlId = dataObj[0].eqpMdlId;
					var chkEqpMdlId = [
					                   'DMB0000430', 'DMB0000638', 'DMB0000639', 'DMB0000750', 'DMB0000902', 'DMB0000914',
					                   'DMB0000917', 'DMB0000918', 'DMB0001098', 'DMB0001108', 'DMB0001109', 'DMB0001125',
					                   'DMB0001495', 'DMB0001543', 'DMB0001544', 'DMB0001561', 'DMB0001588', 'DMT0001296',
					                   'DMT0001403', 'DMT0001405', 'DMT0001409', 'DMT0001482', 'DMT0001491', 'DMT0001493',
					                   'DMT0001494', 'DMT0001496', 'DMT0001497', 'DMT0001498', 'DMT0001499', 'DMT0001500',
					                   'DMT0001505', 'DMT0001506', 'DMT0001633', 'DMT0001634', 'DMT0002067', 'DMT0002068',
					                   'DMT0004831', 'DMT0004832', 'DMT0004833', 'DMT0004834', 'DMT0004835', 'DMT0004841',
					                   'DMT0004842', 'DMT0004843', 'DMT0004844', 'DMT0004845' 
					                   ];
					
					var couplerChk = false;
					for(var i=0; i < chkEqpMdlId.length; i++){
						if(eqpMdlId == chkEqpMdlId[i]) {
							couplerChk = true;
						}
					}
					
					if(!couplerChk) {
						alertBox('W', cflineMsgArray['impossibleModelToAddWave']); /*'파장 추가 불가능한 모델입니다.'*/
						$(this).cancelThisTabChange();
						return;
					}
				} 
			}
		});
		
		// 탭 변경 이벤트
		$("#portChannelTab").on("tabchange", function(e,index) {
			if(index == 0){
				// 채널 검색
//				$("#channelLeftContent").html("");
//				$("#channelRightContent").html("");
				
//				searchChannel('C155M');
			} else if(index == 1) {
				// 그리드 init
				initGridCouplerInf();
				searchCoupler();
			}
		});
		
		// 포트 조회
		portGridScroll();
//		e1T1Search();
		setEvent();
	};
	
	// portReg.js에서 포트 등록시 portPop.setGrid 호출.
	this.setGrid = function(page, rowPerPage){	
    }
});

function setEvent() {
	// 닫기
	$('#btnClosePop').on('click', function(e) {
		$a.close();
	});
	
	// 포트 검색
	$('#btnPortSearch').on('click', function(e) {
		searchPortNm();
	});
	
	// 커플러 검색
	$('#btnWavlSearch, #btnDrcValSearch').on('click', function(e) {
		searchCoupler();
	});
	
	// 포트등록
	$('#btnPortReg').on('click', function(e) {
		if(portData != null) {
			if(isFdf) {
				// FDF 포트 등록
				fdfPortReg();
			} else {
				// 그 외 장비 포트 등록
				portReg();
			}
		}
	});
	
	// FDF장비일 경우 다중 포트 선택이 되는데 2개까지만 가능하도록(TX, RX) 
	$('#' + portGridId).on('click', function(e) {
		var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
		if (dataObj.length > 2) {
			alertBox('I', makeArgMsg('maxChoice', 2, "", "", ""));
			$('#' + portGridId).alopexGrid("rowSelect", {_state : { focused : true }}, false);
		}
	});
	
	// 적용
//	$('#btnApply').on('click', function(e) {
	$('#btnConfirmPop').on('click', function(e) {
		/*
		 * FDF장비일 경우 
		 * 포트상태코드	: 0001 운용, 0002 미사용, 0003 폐기, 0004 고장, null 미진입 
		 * 1. 사용 	: 이미 연결되어 사용중인 포트입니다.(비고 문구) 확인 후 사용 가능.
		 * 2. 미사용	: 알림 없이 사용 가능
		 * 3. 예비상태 : 예비로 구분된 포트 입니다.(비고 문구) 확인 후 사용 가능.
		 * 4. 고장/폐기 : 선택 불가능
		 * 5. 미진입 	: 선택 불가능
		 * 
		 * 그린 코드
		 * F, Y, B
		 */
		var msg = "";
		var callState = "";
		if(isFdf) {
			var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
			dataObj = AlopexGrid.trimData(dataObj);
			
			for(var i = 0; i < dataObj.length; i++) {
				if(dataObj[i].coreLockYn == "Y") {
					// 그린코어
					msg = cflineMsgArray['greenCoreOfGis'] + ' ' + cflineMsgArray['register'] /*'해당 포트는 GIS상의 그린 코어입니다. 등록하시겠습니까?'*/;
					
					callState = "callMsgBox";
					break;
				} else if(dataObj[i].portStatCd == "0001" ) {
					// 운용
					msg = cflineMsgArray['thePortIsAlreadyUsed'] + " " +cflineMsgArray['wouldYouLikeToUse'] /*'이미 연결되어 사용중인 포트 입니다. 사용하시겠습니까?'*/;
					if(dataObj[i].coreCnntRmk != null) msg += '(' + dataObj[i].coreCnntRmk + ')';
					
					callState = "callMsgBox";
					break;
				} else if(dataObj[i].portStatCd == "0002") {
					// 미사용
					callState = "close";
				} else if(dataObj[i].portStatCd == "0003") {
					// 예비상태
					msg = cflineMsgArray['thisIsASparePort']/*'예비로 구분된 포트 입니다.'*/;
					if(dataObj[i].coreCnntRmk != null) msg += '(' + dataObj[i].coreCnntRmk + ')';
					
					callState = "callMsgBox";
					break;
				} else if(dataObj[i].portStatCd == "0004") {
					// 폐기/고장
					msg = cflineMsgArray['breakenEquipment']/*"고장 장비는 선택 불가능합니다."*/;
					callState = "alertBox";
					break;
				} else {
					// 미진입
					msg = cflineMsgArray['noneOpenEquipment']/*"미진입 장비는 선택 불가능합니다."*/;
					callState = "alertBox";
					break;
				}
			}
			
			if(callState == "callMsgBox") {
				callMsgBox('','C', msg, function(msgId, msgRst) {
					if(msgRst == 'Y') {
						setPortToDiagram();
					}
				});
			} else if(callState == "alertBox"){
				alertBox('W', msg);
			} else {
				setPortToDiagram();
			}
		} else {
			var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
			if (dataObj.length == 0) {
				alertBox('W', cflineMsgArray['selectNoData']);
				return;
			}
			setPortToDiagram();
		}
	});
	
	// 엔터키 검색
	$('#portNm').on('keydown', function(e) {
		if (e.which == 13) {
			$('#btnPortSearch').click();
			return false;
		}
	});
	
	$('#wavlVal, #drcVal').on('keydown', function(e) {
		if (e.which == 13) {
			$('#btnWavlSearch').click();
			return false;
		}
	});
	
	// 포트 직접 입력 체크
	$('input:checkbox[id="directInput"]').on('click', function(e){
		if(this.checked) {
			$("#directInputChannel").setEnabled(true);
			$("#channelLeftContent *").attr("disabled", true);
			$("#channelRightContent *").attr("disabled", true);
			divDisable("channelLeftContent", true);
			divDisable("channelRightContent", true);
		} else {
			$("#directInputChannel").setEnabled(false);
			$("#channelLeftContent *").attr("disabled", false);
			$("#channelRightContent *").attr("disabled", false);
			divDisable("channelLeftContent", false);
			divDisable("channelRightContent", false);
		}
	});
	
	// T1체크시 
	$('input:checkbox[id="t1"]').on('click', function(e){
		if(channelGroupDescr.channelInfos.length > 0) {
			searchChannel();
		}
	});
	
	// 직접입력 적용
	$('#btnDirectInputChannel').on('click', function(e) {
		if($('#directInput').is(':checked')) {
			// 채널 직접 입력
			channel = $("#directInputChannel").val();
			var port = setPortData.PORT_NM;
			$("#channelDescr").val(port + channel);
		}
	});


	// 포트 그리드
	$('#' + portGridId).on('dataSelectEnd', function(e) {
		var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
		
		if(dataObj.length > 0) {
			// LTE회선일 경우 물리포트명 표시
			setPortData.PORT_ID = dataObj[0].portId;
			if(isServiceLine() && initParam.svlnSclCd == "016"){
				setPortData.PORT_NM = nullToEmpty(dataObj[0].physPortNm);
				setPortData.PORT_DESCR = nullToEmpty(dataObj[0].physPortNm);
			} else {
				setPortData.PORT_NM = nullToEmpty(dataObj[0].portNm);
				setPortData.PORT_DESCR = nullToEmpty(dataObj[0].portNm);
			}
		} else {
			// 하나도 선택이 안되었을 경우 reset
			setPortData.PORT_ID  = "";
			setPortData.PORT_NM = "";
			setPortData.PORT_DESCR = "";
		}
		
		if(isFdf && dataObj.length == 2) {
			setPortData.RX_PORT_ID = dataObj[1].portId;
			if(isServiceLine() && initParam.svlnSclCd == "016") {
				setPortData.RX_PORT_NM = dataObj[1].physPortNm;
			} else {
				setPortData.RX_PORT_NM = dataObj[1].portNm;
			}
			setPortData.RX_PORT_STATUS_CD = dataObj[1].portStatCd;
			setPortData.RX_PORT_STATUS_NM = dataObj[1].portStatNm;
		} else {
			setPortData.RX_PORT_ID = "";
			setPortData.RX_PORT_NM = "";
			setPortData.RX_PORT_STATUS_CD = "";
			setPortData.RX_PORT_STATUS_NM = "";
		}  
		
		var rxPortNm = "";
		if(setPortData.RX_PORT_NM != "") {
			rxPortNm = "(" + setPortData.RX_PORT_NM + ")";
		}
		
		var port = setPortData.PORT_NM + rxPortNm;
		$("#channelDescr").val(port + selectedChannel);
	});
	
	// 파장 그리드
	$('#waveLength').on('dataSelectEnd', function(e) {
		var dataObj = $('#waveLength').alopexGrid("dataGet", {_state : { selected : true }});
		channelVal = "";
		channelIds = [];
		
		for(var i = 0; i < dataObj.length; i++) {
			if(i == 0) channelVal += "("; 
			channelVal += dataObj[i].wavlVal;
			if(i < (dataObj.length-1) && dataObj[i].wavlVal != "") channelVal += "/";
			if(i == dataObj.length-1) channelVal += ")"; 
			
			var temp = {"EQP_MDL_ID" : dataObj[i].eqpMdlId, "EQP_MDL_DTL_SRNO" : dataObj[i].eqpMdlDtlSrno};
			channelIds.push(temp);
		}

		var port = setPortData.PORT_NM;
		$("#channelDescr").val(port + channelVal);
		setPortData.CHANNEL_IDS = channelIds;
//		console.log(setPortData);
	});
	
	// 포트 그리드 클릭
	$('#' + portGridId).on('click', '.bodycell', function(e) {
		// 채널편집없음
		return;
		var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
		
		if(dataObj.length != 1) {
			return;
		} else {
			$("#channelLeftContent").html("");
			$("#channelRightContent").html("");
			searchChannel('C155M');
		}
	});
	
	// 포트 그리드 더블클릭
	$('#' + portGridId).on('dblclick', '.bodycell', function(e) {
		var dataObj = AlopexGrid.parseEvent(e).data;
		var serviceLineYn = isServiceLine() ? "Y" : "N";

		if (dataObj._key == "useYn" && dataObj.useYn == "Y") {
			var param = {
				"ntwkLineNo" : teamsPath.NETWORK_ID,
				"svlnNo" : teamsPath.NETWORK_ID,
				"topoLclCd" : teamsPath.LINE_LARGE_CD,
				"topoSclCd" : teamsPath.LINE_SMALL_CD,
				"serviceLineYn" : serviceLineYn,
				"neId" : $("#neId").val(),
				"portId" : dataObj.portId
			};

			var urlPath = $('#ctx').val();
			if (nullToEmpty(urlPath) == "") {
				urlPath = "/tango-transmission-web";
			}

			$a.popup({
				popid : "UseLineListPop",
				title : cflineMsgArray['searchOfToUse']/*"사용회선조회"*/,
				url : urlPath + '/configmgmt/cfline/UseLineListPop.do',
				data : param,
				iframe : true,
				modal : true,
				movable : true,
				width : 800,
				height : 650,
			});
		}
	});
	
}
/**************************************************************
 * 1. 서비스 회선
 *    1-1. 155M OR 45M 조회
 *          - portChnlCapaNm : C155M
 *          - portChnlVal : null
 *			- 모델ID, 포트ID, 포트명, E1포트용량, T1여부
 *    2-1. 155M OR 45M선택 후 E1/T1 조회
 *          - portChnlCapaNm : C2M
 *          - portChnlVal : 선택한 채널값 ( 01 )
 * 2. 네트워크 조회
 *    2-1. 155M OR 45M 조회
 *          - portChnlCapaNm : C155M
 *          - portChnlVal : null
 *			- 모델ID, 포트ID, 포트명, E1포트용량, T1여부
 * 3. NDCS
 *    3-1 . E0 만 존재함.  155M (45M) 없음.
 *************************************************************/
function searchChannel() {
//	$('#channelDiv').progress();
	cflineShowProgress('channelDiv');
	var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }})[0];
	if(isServiceLine()) {
		// 사용네트워크의 채널 가져오기
		var useNetworkPortChnlVal = "";
		
		// 사용 네트워크 전체 조회
		for(var networkIdx = 0; networkIdx < teamsPath.USE_NETWORK_PATHS.length; networkIdx++ ) {
			var network = teamsPath.USE_NETWORK_PATHS[networkIdx];
			
			// 동일 사용 네트워크이면
			if(network.NETWORK_ID == useNetworkId) {
				
				// 그 네트워크의 노드 조회
				for(var idx = 0; idx < network.NODES.length; idx++) {
					var node = network.NODES[idx];
					
					// 노드 아이디가 동일하고
					if(node.NODE_ID = setTeamsPath.NODE_ID) {
						if(setTarget == "EAST_PORT_CHANNEL" || setTarget == "EAST_PORT_CHANNEL_PART" ) {
							
							// 포트 아이디도 동일하면
							if(node.APortDescr.PORT_ID == portData.PORT_ID) {
								useNetworkPortChnlVal = node.APortDescr.CHANNEL_DESCR;
							}
						} else if(setTarget == "WEST_PORT_CHANNEL" || setTarget == "WEST_PORT_CHANNEL_PART" ) {
							if(node.BPortDescr.PORT_ID == portData.PORT_ID) {
								useNetworkPortChnlVal = node.BPortDescr.CHANNEL_DESCR;
							}
						}
					}
				}
			}
		}
		
		useNetworkChannel = useNetworkPortChnlVal;
		if(useNetworkPortChnlVal == "") {
			useNetworkPortChnlVal = null;
		}
		
		var portChnlVal = "";
		if(channelGroupDescr.channelInfos.length > 0) {
			portChnlVal = channelGroupDescr.generateChannelGroupDescr();
		}
		
		if(portChnlVal == "") {
			portChnlVal = selectedChannel;
		}
		
		var paramData = {
							"eqpMdlId" : dataObj.eqpMdlId
							, "portId" : dataObj.portId
							, "portNm" : dataObj.portNm
							// 무조건 t1기준으로
							, "generateBaseE1" : false
							// E1 기준 여부(T1 체크 반대)
//							, "generateBaseE1" : !portData.IS_CHANNEL_T1
							// 회선 채널 값(구분자 포함)
							, "portChnlVal" : portChnlVal
							, "useNetworkPortChnlVal" : useNetworkPortChnlVal
						};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/generateAvailableChannelList', paramData, 'GET', 'generateAvailableChannelList');
	} else {
		var portChnlVal = "";
		if(channelGroupDescr.channelInfos.length > 0) {
			portChnlVal = channelGroupDescr.generateChannelGroupDescr();
		}
		
		if(portChnlVal == "") {
			portChnlVal = selectedChannel;
		}
		
		var paramData = {
							"eqpMdlId" : dataObj.eqpMdlId
							, "portId" : dataObj.portId
							, "portNm" : dataObj.portNm
							, "generateBaseE1" : false
							// 회선 채널 값(구분자 포함)
//								, "portChnlVal" : portData.CHANNEL_DESCR
							, "portChnlVal" : portChnlVal
							, "useNetworkPortChnlVal" : ""
						};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/generateAvailableChannelList', paramData, 'GET', 'generateAvailableChannelList');
	}
}


/**
 * 포트 그리드
 */
function initGridPortInf() {
	
	var column = columnMappingPort();
	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */;
	
	$('#'+portGridId).alopexGrid({
//		fitTableWidth: true,
		fillUndefinedKey : null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
//		autoResize: false,
		cellInlineEdit : false,
		cellSelectable : false,
		rowSelectOption: {
			clickSelect: true,
			radioColumn: true,
			singleSelect: true,
			disableSelectByKey: true,
			allowSingleUnselect: false
		},
		rowOption : {
			allowSelect : function(data) {
				var portId = "";
				if(portData != null) {
					portId = portData.PORT_ID;
				}
				if(!isRing && portId != "" && portId != data.portId) {
					return false;
				}
			}, 
			inlineStyle : function(value, data, mapping) {
				var portId = "";
				if(portData != null) {
					portId = portData.PORT_ID;
				}
				if(!isRing && portId != "" && portId != value.portId) {
					var style = {
						'background-color' : '#BEBEBE'
					};
					return style;
				}
			}
		},
		rowInlineEdit: false,
		columnMapping : column,
		height : 410,
		pager : false,
    	message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
		}
	});
	
	// LTE회선일 경우 물리포트명 표시
	if(isServiceLine() && initParam.svlnSclCd == "016"){
		$('#'+portGridId).alopexGrid("showCol", "physPortNm");
	}
	
	$('#'+portGridId).alopexGrid('updateColumn', {title:''}, 0);
}

/**
 * 그리드 컬럼
 * @returns {Array}
 */
function columnMappingPort() {
	var column = [
	 			 { key : 'check', align : 'center', width : '40px', selectorColumn : true}
	 			,{ key : 'portNm', align : 'left', title : cflineMsgArray['portName'] /* 포트명 */, width : '120px' }
	 			,{ key : 'portCapaNm', align : 'center', title : cflineMsgArray['portCapacity'] /* 포트용량 */, width : '70px' }
	 			,{ key : 'portAlsNm', align : 'center', title : cflineMsgArray['portAliasName'] /* 포트별칭명 */, width : '110px' }
	 			,{ key : 'physPortNm', align : 'center', title : cflineMsgArray['physical']+cflineMsgArray['portName'] /* 물리포트명 */, width : '95px', hidden : true }
	 			
	 			,{ key : 'cardNm', align : 'center', title : cflineMsgArray['cardName'] /* 카드명 */, width : '76px' }
	 			,{ key : 'cardModelNm', align : 'center', title : cflineMsgArray['cardModelName'] /* 카드모델명 */, width : '100px'}
	 			,{ key : 'rackNm', align : 'center', title : cflineMsgArray['rackName'] /* 렉명 */, width : '60px' }
	 			,{ key : 'shelfNm', align : 'center', title : cflineMsgArray['shelfName'] /* 쉘프명 */, width : '60px' }
	 			,{ key : 'slotNo', align : 'center', title : cflineMsgArray['slotNumber'] /* 슬롯번호 */, width : '65px' }
	 			,{ key : 'portStatNm', align : 'center', title : cflineMsgArray['port'] + cflineMsgArray['statusName'] /* 포트상태명 */, width : '80px'
	 				, render : function(value, data){ 
	 					if(data.coreLockYn == "Y") {
	 						return cflineMsgArray['greenCore'];
	 					} else {
	 						return value;
	 					}
	 				}
	 			}
	 			,{ key : 'coreCnntRmk', align : 'center', title : cflineMsgArray['coreConnectionRemark'] /* 코어접속비고 */, width : '120px'}
	 			
	 			,{ key : 'portId', align : 'center', title : cflineMsgArray['portIdentification'] /* 포트ID */, width : '100px', hidden : true }
	 			,{ key : 'portDescr', align : 'center', title : cflineMsgArray['portDescription'] /* 포트설명 */, width : '160px', hidden : true
	 				,value : function(value, data) { return data["portNm"]; }
	 			}
	 			,{ key : 'rackNo', align : 'center', title : cflineMsgArray['rackNumber'] /* 렉번호 */, width : '150px', hidden : true}
	 			,{ key : 'shelfNo', align : 'center', title : cflineMsgArray['shelfNumber'] /* 쉘프번호 */, width : '150px', hidden : true}
	 			,{ key : 'cardId', align : 'center', title : cflineMsgArray['cardIdentification'] /* 카드ID */, width : '150px', hidden : true }
	 			,{ key : 'cardStatusCd', align : 'center', title : cflineMsgArray['cardStatusCode'] /* 카드상태코드 */, width : '150px', hidden : true }
	 			,{ key : 'cardStatusNm', align : 'center', title : cflineMsgArray['cardStatusName'] /* 카드상태명 */, width : '150px', hidden : true }
	 			,{ key : 'portDummy', align : 'center', title : cflineMsgArray['dummy'] + cflineMsgArray['port'] + cflineMsgArray['yesOrNo'] /* 더미포트여부 */, width : '150px', hidden : true}
	 			,{ key : 'channelDescr', align : 'center', title : cflineMsgArray['channelValue'] /* 채널값 */, width : '150px', hidden : true }
	 			,{ key : 'cardModelId', align : 'center', title : cflineMsgArray['cardModelIdentification'] /* 카드모델ID */, width : '150px', hidden : true }
	 			,{ key : 'cardWavelength', align : 'center', title : cflineMsgArray['card']+ cflineMsgArray['wavelength'] /* 카드파장 */, width : '150px', hidden : true}
	 			,{ key : 'portUseTypeCd', align : 'center', title : cflineMsgArray['portUseTypeCd'] /* 포트사용용도코드 */, width : '150px', hidden : true }
	 			,{ key : 'portUseTypeNm', align : 'center', title : cflineMsgArray['portUseTypeNm'] /* 포트사용용도명 */, width : '150px', hidden : true }
	 			,{ key : 'portStatCd', align : 'center', title : cflineMsgArray['portStatusCode'] /* 포트상태코드 */, width : '150px', hidden : true }
	 			,{ key : 'physPortId', align : 'center', title : '물리포트ID', hidden : true }
	 			,{ key : 'grenTypCd', align : 'center', title : 'grenTypCd', hidden : true }
	 			,{ key : 'e1CapaCvsnVal', align : 'center', title : 'e1CapaCvsnVal', hidden : true 
	 				, value : function(value, data) { 
	 	    			if(nullToEmpty(value) =="" ){
	 						return 0;
	 					} else {
	 						return value;
	 					}
	 	    		}
	 			}
	];
	
	if(isServiceLine()) {
		column.push({
			key : 'useYn',
			align : 'center',
			title : cflineMsgArray['useYesOrNo'] /* 사용여부 */,
			width : '65px'
		});
	}
	
	return column;
}


/**
 * 파장
 */
function initGridCouplerInf() {
	var column = [
	              	{ key : 'check', selectorColumn : true, width : '40px' }
	              	, { key : 'wavlVal', title : cflineMsgArray['wavelength']/*'파장'*/, align : 'center', width : '200px' }
	              	, { key : 'drcVal', title : cflineMsgArray['direction']/*'방향'*/, align : 'center', width : '200px' } 
	              	, { key : 'freqVal', title : cflineMsgArray['frequency']/*'주파수'*/, align : 'center', width : '75px', hidden : true }
	  	         	, { key : 'chnlVal', title : cflineMsgArray['channel']/*'채널'*/, align : 'center', width : '75px', hidden : true }
	  	         	, { key : 'bdwthVal', title : cflineMsgArray['bdwth']/*'밴드'*/, align : 'center', width : '75px', hidden : true }
	  				, { key : 'eqpMdlDtlSrno', title : cflineMsgArray['srno']/*'일련번호'*/, align : 'center', hidden : true } 
			];
	
	$('#waveLength').alopexGrid({
		fitTableWidth: true,
		fillUndefinedKey : null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		autoResize: true,
		rowSingleSelect : false,
		height : 200,
		pager : false,
		columnMapping : column,
		message: {
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
		}
	});
	
	$('#waveLength').alopexGrid("updateOption", { fitTableWidth: true });
}

/**
 * 포트 조회
 * @param data
 * @param target
 */
function portSearch(data, target) {
	// FDF장비일 경우 채널 선택 불가능 & 포트 등록 버튼 생성
	$("#neId").val(data.Ne.NE_ID);
	$("#popEqpNm").val(data.Ne.NE_NM);
	
	if(isFdfNe(data.Ne.NE_ROLE_CD)) {
		$("#channelTab").hide();
//		$("#portRegDiv").show();
//		$("#portNm").css("width", "420px");
		isFdf = true;
		
		$('#' + portGridId).alopexGrid("updateOption", { rowSelectOption: {radioColumn : false, singleSelect : false} });
	} else {
//		$("#channelTab").show();
//		$("#portRegDiv").hide();
//		$("#portNm").css("width", "510px");
		isFdf = false;
		$('#' + portGridId).alopexGrid("updateOption", { rowSelectOption: {radioColumn : true, singleSelect : true} });
	}
	
	// 선택한 네트워크의 아이디 보존
	if(data.isTrunkNode()) {
		useNetworkId = data.Trunk.NETWORK_ID;
	} else if(data.isRingNode()) {
		useNetworkId = data.Ring.NETWORK_ID;
	} else if(data.isWdmTrunkNode()) {
		useNetworkId = data.WdmTrunk.NETWORK_ID;
	}

	// 포트 조회
//	portYn = false;
	setPortData = new PortDescr();
	channelGroupDescr = new ChannelGroupDescr();
	setTarget = target;
	setTeamsPath = visualLinePath.selection.Da.value.data;
	
	$('#'+portGridId).alopexGrid("dataEmpty");
	$("#channelDescr").val("");
	$('#portNm').val("");
	
	//$("#portChannelTab").setTabIndex(0);
	var nFirstRowIndex = 1;
	var nLastRowIndex = pageCount;

	$("#firstRowIndex").val(nFirstRowIndex);
	$("#lastRowIndex").val(nLastRowIndex);
	
	if(data.ADD_DROP_TYPE_CD == "A" || target == "EAST_PORT_CHANNEL" || target == "EAST_PORT_CHANNEL_PART") {
		// add. east. APortDescr
		portData = data.APortDescr;
	} else if(data.ADD_DROP_TYPE_CD == "D" || target == "WEST_PORT_CHANNEL"  || target == "WEST_PORT_CHANNEL_PART") {
		// drop. west. BPortDescr
		portData = data.BPortDescr;
	} else {
		portData = new PortDescr();
	}
	
	// 링노드일 경우 포트 수정 가능 
	/*if(data.isRingNode() || !data.isNetworkNode()) {
		isRing = true;
		$('#btnConfirmPop').show();
	} else {
		isRing = false;
		$('#btnConfirmPop').hide();
	}*/
	// 팝업이 열리면 모두 편집 가능
	isRing = true;
	$('#btnConfirmPop').show();
		
	cflineShowProgress(portGridId);
	portParamData = {"neId" : data.NE_ID, "svlnNo" : initParam.svlnNo, "serviceLineYn" : "Y", "firstRowIndex" : nFirstRowIndex, "lastRowIndex" : nLastRowIndex};
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/getPortInfList', portParamData, 'GET', 'portSearch');

	// 룰 조회
	var eqpParam = {"eqpMdlId" : data.Ne.MODEL_ID};
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectEqpMdlPortRule', eqpParam, 'GET', 'eqpMdelPortRule');
}

// 포트명 조회
function searchPortNm() {
//	portYn = true;
	portParamData.portNm = $("#portNm").val();
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/getPortInfList', portParamData, 'GET', 'portSearch');
}

// 커플러 조회
function searchCoupler() {
	var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }})[0];
	var paramData = {"eqpMdlId" : dataObj.eqpMdlId};
	$.extend(paramData,{"wavlVal": $("#wavlVal").val()});
	$.extend(paramData,{"drcVal": $("#drcVal").val()});
	
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/selectCouplerList', paramData, 'POST', 'couplerSearch');
}

// 페이지 스크롤 조회
function portGridScroll() {
	$('#' + portGridId).on('scrollBottom', function(e) {
//		portYn = false;
		setGridData();
	});
}

/**
 * 그리드 스크롤링으로 포트 조회
 */
function setGridData() {
	nFirstRowIndex = parseInt($("#firstRowIndex").val()) + pageCount;
	nLastRowIndex = parseInt($("#lastRowIndex").val()) + pageCount;
	$("#firstRowIndex").val(nFirstRowIndex);
	$("#lastRowIndex").val(nLastRowIndex);
	
	portParamData.firstRowIndex = nFirstRowIndex;
	portParamData.lastRowIndex = nLastRowIndex;
	portParamData.portNm = $("#portNm").val();
	
//	if(!portYn) {
//		portYn = false;
		cflineShowProgress(portGridId);
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/getPortInfList', portParamData, 'GET', 'portSearchAdd');
//	}
	
}

var channelDescrObj = new Object();
var channelGroupDescr = new ChannelGroupDescr();
var checkHtml = "";
var channelHtml = "";
var channelDescrInfoManager = new ChannelDescrInfoManager();

/**
 * 서비스 회선 채널 generate
 * @param data
 */
function generateChannelService(data) {
	var channelDescr = "";
	var firstChannelCapacityNm = "";
	checkHtml = "";
	channelHtml = "";
	
	var count = 0;
	channelGroupDescr = new ChannelGroupDescr();
	var e1ChannelList = [];
	
	try {
		var t1 = portData.IS_CHANNEL_T1 ? true : false;
		$('#t1').setChecked(t1);
		
		if(data != undefined) {
			channelDescrInfoManager.clear();
			
			// 입력 가능한 채널 전체 조회해서 읽기
			channelDescrInfoManager.fromObject(data);
			
			// 상위 채널(155M OR 45M) 목록을 표시
			count = 0;
			var upperChannels = channelDescrInfoManager.getUpperChannelList();
			
			// 155/45 체크박스 생성
			for(var idx = 0; idx < upperChannels.length; idx++) {
				count = checkBox155M(count, upperChannels[idx], 2);
			}
			$("#channelLeftContent").html(checkHtml);
			$a.convert($("#channelLeftContent"));
			
	
			// 선택 채널 155M/45M 체크
			var selectedChannels = channelDescrInfoManager.getSelectedE1ChannelList();
			for(var idx = 0; idx < upperChannels.length; idx++) {
				for(var selectedIdx = 0; selectedIdx < selectedChannels.length; selectedIdx++) {
					// 155M체크
					if(upperChannels[idx].unit155M != null 
							&& upperChannels[idx].unit155M.CHANNEL_VALUE == selectedChannels[selectedIdx].unit155M.CHANNEL_VALUE) {
						$('input:checkbox[value="'+upperChannels[idx].channelDescrWithoutSep()+'"]').setChecked(true);
						channelGroupDescr.channelInfos.push(upperChannels[idx].channelDescrWithoutSep());
					}
					
					// 45M체크
					if(upperChannels[idx].unit45M != null 
							&& upperChannels[idx].unit45M.CHANNEL_VALUE == selectedChannels[selectedIdx].unit45M.CHANNEL_VALUE) {
						$('input:checkbox[value="'+upperChannels[idx].channelDescrWithoutSep()+'"]').setChecked(true);
					}
				}
			}
			
			// 상위 채널에 해당하는 E1 채널 구하기
			var upperChannelCount = 0;
			for(var idx = 0; idx < upperChannels.length; idx++) {
				// 체크된 상위채널 E1조회
				if($('input:checkbox[value="'+upperChannels[idx].channelDescrWithoutSep()+'"]').is(':checked')) {
					var channelUnitInfo = new ChannelUnitInfo();
					channelUnitInfo = upperChannels[idx].getUpperUnit();
					var e1Channels = channelDescrInfoManager.getE1ChannelList(channelUnitInfo.CHANNEL_VALUE);
					channelHtml = checkBox2M(e1Channels);
					
					
					// E1 체크
					for(var e1Index = 0;  e1Index < e1Channels.length; e1Index++) {
						for(var selectedIdx = 0; selectedIdx < selectedChannels.length; selectedIdx++) {
							if(e1Channels[e1Index].CHANNEL_DESCR == selectedChannels[selectedIdx].CHANNEL_DESCR) {
								$('input:checkbox[value="'+e1Channels[e1Index].channelDescrWithoutSep()+'"]').setChecked(true);
							}
						}
					}
					upperChannelCount++;
				}
			}
			
			
			if(upperChannelCount < 1) {
				// 체크된 상위채널이 없을 경우 전체 조회
				for(var idx = 0; idx < upperChannels.length; idx++) {
					var channelUnitInfo = new ChannelUnitInfo();
					channelUnitInfo = upperChannels[idx].getUpperUnit();
					var e1Channels = channelDescrInfoManager.getE1ChannelList(channelUnitInfo.CHANNEL_VALUE);
					channelHtml = checkBox2M(e1Channels);
				}
			}
			
			var html = $(channelHtml);
			$("#channelRightContent").empty().html(html);
//			$a.convert($("#channelRightContent"));
			
			checkBox155MEvent();
			checkBox2MEvent();
		}
	} catch (e) {
		console.log(e);
	}
	
//	$('#channelDiv').progress().remove();
	cflineHideProgress('channelDiv');
}

/**
 * 네트워크일 경우 155,45만 표시
 * @param data
 */
function generateChannelNetwork(data) {
	var channelDescr = "";
	checkHtml = "";
	
	var count = 0;
	channelGroupDescr = new ChannelGroupDescr();
	
	
	try {
		if(data != undefined) {
			channelDescrInfoManager.clear();
			
			// 입력 가능한 채널 전체 조회해서 읽기
			channelDescrInfoManager.fromObject(data);
			
			// 상위 채널(155M OR 45M) 목록을 표시
			count = 0;
			var upperChannels = channelDescrInfoManager.getUpperChannelList();
			
			// 155/45 체크박스 생성
			for(var idx = 0; idx < upperChannels.length; idx++) {
				count = checkBox155M(count, upperChannels[idx], 11);
			}
			$("#channelLeftContent").html(checkHtml);
			$a.convert($("#channelLeftContent"));
			
//			// 선택 채널 155M/45M 체크
//			var selectedChannels = channelDescrInfoManager.getSelectedE1ChannelList();
//			for(var idx = 0; idx < upperChannels.length; idx++) {
//				for(var selectedIdx = 0; selectedIdx < selectedChannels.length; selectedIdx++) {
//					// 155M체크
//					if(upperChannels[idx].unit155M != null 
//							&& upperChannels[idx].unit155M.CHANNEL_VALUE == selectedChannels[selectedIdx].unit155M.CHANNEL_VALUE) {
//						$('input:checkbox[value="'+upperChannels[idx].channelDescrWithoutSep()+'"]').setChecked(true);
//						channelGroupDescr.channelInfos.push(upperChannels[idx].channelDescrWithoutSep());
//					}
//					
//					// 45M체크
//					if(upperChannels[idx].unit45M != null 
//							&& upperChannels[idx].unit45M.CHANNEL_VALUE == selectedChannels[selectedIdx].unit45M.CHANNEL_VALUE) {
//						$('input:checkbox[value="'+upperChannels[idx].channelDescrWithoutSep()+'"]').setChecked(true);
//					}
//				}
//			}
			
//			checkBox155MEvent();
			setChannel155Descr();
		}
	} catch (e) {
		console.log(e);
	}
}

function generateChannelE1(checked) {
	try {
		cflineShowProgress('channelDiv');
		channelHtml = "";
		$("#channelRightContent").html("");
		
		if(checked) {
			// 체크된 채널만
			for(var idx = 0; idx < channelGroupDescr.channelInfos.length; idx++) {
				if(channelGroupDescr.channelInfos[idx].unit155M != null) {
					var channelUnitInfo = new ChannelUnitInfo();
					channelUnitInfo = channelGroupDescr.channelInfos[idx].unit155M;
					var e1Channels = channelDescrInfoManager.getE1ChannelList(channelUnitInfo.CHANNEL_VALUE);
					channelHtml = checkBox2M(e1Channels);
				} 
				
				if(channelGroupDescr.channelInfos[idx].unit45M != null) {
					var channelUnitInfo = new ChannelUnitInfo();
					channelUnitInfo = channelGroupDescr.channelInfos[idx].unit45M;
					var e1Channels = channelDescrInfoManager.getE1ChannelList(channelUnitInfo.CHANNEL_VALUE);
					channelHtml = checkBox2M(e1Channels);
				} 
			}			
		} else {
			// 체크된 상위채널이 없을 경우 전체 조회
			var upperChannels = channelDescrInfoManager.getUpperChannelList();
			for(var idx = 0; idx < upperChannels.length; idx++) {
				var channelUnitInfo = new ChannelUnitInfo();
				channelUnitInfo = upperChannels[idx].getUpperUnit();
				var e1Channels = channelDescrInfoManager.getE1ChannelList(channelUnitInfo.CHANNEL_VALUE);
				channelHtml = checkBox2M(e1Channels);
			}
		}
		
		$("#channelRightContent").html(channelHtml);
		cflineHideProgress('channelDiv');
		checkBox2MEvent();
	} catch (e) {
		console.log(e);
	}
}

/**
 * E1, T1, generate
 * E1 3열, T1 4열
 * 
 */
function checkBox2M(data) {
	var count = 0;
	
	if(data != undefined) {
		var newlineCnt = 3;
		if($('#t1').is(':checked')) {
			newlineCnt = 4;
		}
		
		for(var idx = 0; idx < data.length; idx++) {
			var CHANNEL_DESCR = data[idx].channelDescrWithoutSep();
			channelHtml += '<input class="Checkbox" type="checkbox" name="' + CHANNEL_DESCR + '" value="' + CHANNEL_DESCR + '" id="chennel2" /><span style="display: inline-block; width: 60px;">' + CHANNEL_DESCR + '</span>';
	
			count++;
			if(count % newlineCnt == 0) {
				channelHtml += '<br/>';
			}
			
			channelDescrObj[CHANNEL_DESCR] = data[idx];
		}
	}
	
	return channelHtml;
}

// 155M/45M 체크박스 생성
function checkBox155M(count, channelDescrInfo, newLineCount) {
	var CHANNEL_DESCR = channelDescrInfo.channelDescrWithoutSep();
	checkHtml += '<input class="Checkbox" type="checkbox" name="' + CHANNEL_DESCR + '" value="' + CHANNEL_DESCR + '" id="chennel155" /><span style="display: inline-block;width: 30px;">' + CHANNEL_DESCR + '</span>';

	count++;
	if(count % newLineCount == 0) {
		checkHtml += '<br/>';
	}
	channelDescrObj[CHANNEL_DESCR] = channelDescrInfo;
	
	return count;
}


// 155M/45M 체크시 이벤트 생성. 2M조회
function checkBox155MEvent() {
	//체크
	$('input:checkbox[id="chennel155"]').on('click', function(e){
		setChannel155Descr();
	});
}

//E1/T1 체크시 이벤트 생성. 2M조회
function checkBox2MEvent() {
	//체크
	$('input:checkbox[id="chennel2"]').on('click', function(e){
		setChannel2Descr();
	});
}

// 155 DESC
function setChannel155Descr() {
	channelGroupDescr.channelInfos = [];
	
	$('input:checkbox[id="chennel155"]').each(function(){
		if(this.checked) {
			channelGroupDescr.channelInfos.push(channelDescrObj[this.value]);
		}
	});
	
	
	// 선택된 155,45가 없을 때 리셋
	if($('input:checkbox[id="chennel155"]:checked').length < 1) {
		channelGroupDescr.channelInfos = [];
		$("#channelDescr").val(setPortData.PORT_NM);
		$("#directInputChannel").val("");
	}
	
	
	if(channelGroupDescr.channelInfos.length > 0) {
		var channel = channelGroupDescr.generateChannelGroupDescr();
		var port = setPortData.PORT_NM;
		$("#channelDescr").val(port + channel);
		$("#directInputChannel").val(channel);
		
		if(channel != "" && isServiceLine()) {
			// 선택한 155M/45M의 E1데이터를 필터링
			generateChannelE1(true);
		}
	} else {
		// 선택된 것이 없을 경우 E1전체
		generateChannelE1(false);
		
//		var upperChannels = channelDescrInfoManager.getUpperChannelList();
		
//		// 155/45 체크박스 생성
//		count = 0;
//		for(var idx = 0; idx < upperChannels.length; idx++) {
//			count = checkBox155M(count, upperChannels[idx], 8);
//		}
//		$("#channelLeftContent").html(checkHtml);
//		$a.convert($("#channelLeftContent"));
	}
}

// E1, T1 DESCR
function setChannel2Descr() {
	channelGroupDescr.channelInfos = [];
	$('input:checkbox[id="chennel2"]').each(function(){
		if(this.checked) {
			channelGroupDescr.channelInfos.push(channelDescrObj[this.value]);
		}
	});
	
	if($('input:checkbox[id="chennel2"]:checked').length < 1) {
		channelGroupDescr.channelInfos = [];
		$('input:checkbox[id="chennel155"]').each(function(){
			if(this.checked) {
				channelGroupDescr.channelInfos.push(channelDescrObj[this.value]);
			}
		});
	}
	
	if(channelGroupDescr.channelInfos.length > 0) {
		var channel = channelGroupDescr.generateChannelGroupDescr();
		var port = setPortData.PORT_NM;
		$("#channelDescr").val(port + channel);
		$("#directInputChannel").val(channel);
	}
}

//다이어그램에 포트 등록
function setPortToDiagram() {
	// EAST = A, WEST = B
	var data = setTeamsPath;
	var channel = "";
	var isWave = false;
	
	if($("#portChannelTab").getCurrentTabIndex() == 0) {
		if(channelGroupDescr.channelInfos.length > 0) {
			// 체크를 통해서 채널 선택
			channel = channelGroupDescr.generateChannelGroupDescr();
		}
		
		if($('#directInput').is(':checked')) {
			// 채널 직접 입력
			channel = $("#directInputChannel").val();
		}
	} else if($("#portChannelTab").getCurrentTabIndex() == 1) {
		// 파장
		if(channelIds.length > 0) {
			isWave = true;
			channel = channelVal;
		} 
	}
	
	setPortData.CHANNEL_DESCR = channel;
	setPortData.IS_CHANNEL_T1 = $('#t1').is(':checked') ? true : false; 
	
	if(setTarget == "EAST_PORT_CHANNEL" || setTarget == "EAST_PORT_CHANNEL_PART") {
		data.APortDescr = setPortData;
		data.EAST_CHANNEL_DESCR = channel;
		if(isWave) {
			data.CHANNEL_IDS = setPortData.CHANNEL_IDS;
		} 
		data.EAST_PORT_CHANNEL = setPortData.PORT_NM + channel; 
		data.EAST_PORT_ID = setPortData.PORT_ID;
		data.EAST_PORT_NM = setPortData.PORT_NM;
	} else if(setTarget == "WEST_PORT_CHANNEL" || setTarget == "WEST_PORT_CHANNEL_PART" ) {
		data.BPortDescr = setPortData;
		data.WEST_CHANNEL_DESCR = channel;
		if(isWave) {
			data.CHANNEL_IDS = setPortData.CHANNEL_IDS;
		} 
		data.WEST_PORT_CHANNEL = setPortData.PORT_NM + channel; 
		data.WEST_PORT_ID = setPortData.PORT_ID;
		data.WEST_PORT_NM = setPortData.PORT_NM;
	}
	
	for(var idx = 0; idx < teamsPath.NODES.length; idx++ ) {
		var node = teamsPath.NODES[idx];
		if(node.NODE_ID == data.NODE_ID) {
			teamsPath.NODES[idx] = data;
			console.log(data);
			break;
		}
	}
	
	opener._app.tpu.teamsPath = teamsPath;
	//console.log(opener._app.tpu.teamsPath);
	$a.close();
}

// FDF장비 신규 포트 등록 
function fdfPortReg() {
	$a.popup({
	     	popid: 'fdfPortReg',
	     	title: '포트등록',
	     	iframe: true,
	     	modal : true,
	     	movable:true,
	     	windowpopup : false,
	        url: '/tango-transmission-web/configmgmt/cfline/PortReg.do',
	        data: { eqpId :  $('#neId').val(), eqpNm : $('#popEqpNm').val(), fromEqpMgmt : "Y" }, 
	        width : 865,
	        height : window.innerHeight * 0.9,
	        callback: function(data) {
	        	if(data == "OK"){
	        		$('#btnPortSearch').click();
	        	}
	    	}
    });
}

function portReg() {
	$a.popup({
     	popid: 'PortReg',
     	title: '포트등록',
     	iframe: true,
     	modal : true,
     	movable:true,
     	windowpopup : false,
        url: '/tango-transmission-web/configmgmt/portmgmt/PortRegPop.do',
//        data: { eqpId :  $('#neId').val(), eqpNm : $('#popEqpNm').val(), fromEqpMgmt : "Y" }, 
        width : 865,
        height : window.innerHeight * 0.9,
        callback: function(data) {
        	if(data == "OK"){
        		$('#btnPortSearch').click();
        	}
    	}
	});
}

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
		data : Param, 		//data가 존재할 경우 주입
		method : Method, 	//HTTP Method
		flag : Flag
	}).done(successCallback);
};


function successCallback(response, status, jqxhr, flag) {
	if(flag == "portSearch" || flag == "portSearchAdd") {
		// 포트 조회
		cflineHideProgress(portGridId);
		
		if(flag == "portSearch") {
			$('#' + portGridId).alopexGrid('dataSet', response.portInfList);
		} else if(flag == "portSearchAdd") {
			if (response.portInfList.length > 0) {
				$('#' + portGridId).alopexGrid("dataAdd", response.portInfList);
			}
		}
		
		selectedChannel = portData.CHANNEL_DESCR;

		// 사용네트워크 포트 선택
		if(response.portInfList.length > 0) {
			var dataList = AlopexGrid.trimData($('#'+portGridId).alopexGrid("dataGet"));
			for(var idx = 0; idx < dataList.length; idx++ ) {
				if(portData != null && dataList[idx].portId == portData.PORT_ID) {
//					portYn = true;
					$('#'+portGridId).alopexGrid('rowSelect', {_index: {row:idx}}, true);
					$('#'+portGridId).alopexGrid('setScroll', {row:idx});
					//searchChannel('C155M');
				} 
				
				if(portData != null && dataList[idx].portId == portData.RX_PORT_ID) {
					$('#'+portGridId).alopexGrid('rowSelect', {_index: {row:idx}}, true);
					$('#'+portGridId).alopexGrid('setScroll', {row:idx});
				}
			}
		}
		
//		var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
//		if(dataObj.length != 1) {
//			return;
//		} else {
//			searchChannel('C155M');
//		}
		
		// 포트가 조회해 온 500개 안에 없으면 계속 로딩
		/*
		if(portData.PORT_ID != 0 && !portYn) {
			setGridData();
		} 
		*/
		
	} else if( flag == "eqpMdelPortRule") {
		// 포트 룰 조회
		try {
			if(response.eqpMdlPortRule != undefined && Object.getOwnPropertyNames(response.eqpMdlPortRule).length > 0) {
				var eqpMdlId = Object.keys(response.eqpMdlPortRule);
				var eqpMdlRule = response.eqpMdlPortRule[eqpMdlId];
				var eqpRuleText = "";
				
				for(var idx = 0; idx < eqpMdlRule.length; idx++ ){ 
					if(idx == 0) {
						eqpRuleText += cflineMsgArray['modelName'] + " : " + eqpMdlRule[idx].eqpMdlNm + "<br/>"; /*모델명*/
					}
					eqpRuleText += cflineMsgArray['ruleEng'] + ") " + eqpMdlRule[idx].shpRuleRmk + "<br/>"; /*룰*/
				}
				
				$("#ruleDiv").html(eqpRuleText);
			} else {
				$("#ruleDiv").html("");
			}
		} catch(e) {
			console.log(e);
		}
		
	} else if( flag == "generateAvailableChannelList" ) {
		try {
			if(isServiceLine()) {
				$("#channelRightContent").html("");
				generateChannelService(response.data);
			} else {
				generateChannelNetwork(response.data);
			}
		} catch (e) {
			console.log(e);
		}
	} else if( flag == "couplerSearch" ) {
		// 커플러(파장) 검색
		if(response.couplerList != undefined) {
			$('#waveLength').alopexGrid('dataSet', response.couplerList);
		}
	} 

}

// 포트관련 체크
// PBOX 추가  2019-12-24
function isFdfNe(neRoleCd) {
	if(neRoleCd == '11' || neRoleCd == '162' || neRoleCd == '177' || neRoleCd == '178' || neRoleCd == '182') { 
		return true;
	} else {
		return false;
	}
}