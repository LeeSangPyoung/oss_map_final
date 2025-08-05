/**
 * NetworkPathVisualizationPortList.js
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
var isRotn = false;
var isFGSmux = false;
var isFGCrn = false;
var isBcCwMux = false;  //  BC-MUX(183), CWDM-MUX(184)
var useNetworkId = "";
var e1ChannelList = [];
var initParam = null;
var visualLinePath = null;
var teamsPath = null;

var isNDCS = false;
var visibleUpperChannelDiv = true;
var visibleLowerChannelDiv = true;

/** 포트 그리드에서 이전에 선택된 행 데이터 */
var prevSelectedPortData = null;
var isInitPort = false; 

var fiveGponEqpType = "";
var fiveGponEqpTxRx = [];
var microWaveEqpYn = "N";
var searchEqpMdlId = "";

var topologyType = "";

var portPop = $a.page(function() {
	
	this.init = function(id, param) {
		
		initParam = param;
		visualLinePath = opener.visualLinePath;
		teamsPath = opener.teamsPath;
		setPortData = opener.setPortData;
		
		topologyType = nullToEmpty(param.topologyType);
		// 포트그리드
		initGridPortInf();
		
		var node = param.node;
		fiveGponEqpType = nullToEmpty(node.Ne.FIVE_GPON_EQP_TYPE);
		Object.setPrototypeOf(node, TeamsNode.prototype);
		node.resetPrototype();
		

		// 마이크로 웨이브용 채널
		initMicroWaveChannelGrid();
		searchEqpMdlId = nullToEmpty(node.Ne.MODEL_ID);  // 해당 장비 모델
		microWaveEqpYn = (node.Ne.isMwRoleCd() == true ? "Y" : "N");
		
		isNDCS = node.Ne.isModelNDCS();
		
		if ( isNDCS ) {
			$("#channelLeft").hide();
			$("#channelRight").css('width', '100%');
			$("#channelRightTitleContent").text("E0/T0");
			$("#t1Check").css("display", "");
			visibleUpperChannelDiv = false;
			visibleLowerChannelDiv = true;
		} else if(microWaveEqpYn == "Y") {
			$("#channelTab").hide();  // 일반 채널 탭
			$("#channelDiv").hide();  // 일반 채널 탭
			$("#channelRight").hide();
			$("#portChannelTopDiv").css('width', '0%');
			$("#portArea").css('width', '100%');
			$("#portList").alopexGrid("updateOption", { width: 1150});
			
			visibleUpperChannelDiv = true;
			visibleLowerChannelDiv = false;
			/*$("#channelTab").hide();  // 일반 채널 탭
			$("#channelDiv").hide();  // 일반 채널 탭
			
			$("#microWaveChannelTab").show();  // 파장 탭
			
			$("#microWaveChannelDiv").show(); // 마이크로 웨이브 채널
			visibleUpperChannelDiv = false;
			visibleLowerChannelDiv = false;

			$("#portChannelTab").setTabIndex(2);
			searchMicroWaveChannel();*/
		} else {
			if( typeof initParam.topoLclCd  != "undefined" && initParam.topoLclCd == "001" ) {
				// 링이 아닐 경우 파장 탭 보이기
				$("#waveLengthTab").show();
			}
			
			if(isServiceLine()) {
				$("#t1Check").css("display", "");
				visibleUpperChannelDiv = true;
				visibleLowerChannelDiv = true;
			} else {
				$("#channelRight").hide();
				$("#channelLeft").css('width', '100%');
				visibleUpperChannelDiv = true;
				visibleLowerChannelDiv = false;
			}
		}

		portSearch(node, param.target);
		
		// 탭 변경전 validation 체크
		$("#portChannelTab").on("beforetabchange", function(e,index) {
			if(index == 0 ) {
				// 포트 선택 체크
				var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
				if(dataObj.length != 1) {
					alertBox('W', '포트를 하나 선택하세요.');
					$(this).cancelThisTabChange();
					return;
				} 
			} else if(index == 1) {
				// 파장 선택이 가능한지 체크
				var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
				if(dataObj.length != 1) {
					alertBox('W', '포트를 하나 선택하세요.');
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
						alertBox('W', '파장 추가 불가능한 모델입니다.');
						$(this).cancelThisTabChange();
						return;
					}
				} 
			}
		});
		
		// 탭 변경 이벤트
		$("#portChannelTab").on("tabchange", function(e,index) {
			if(index == 0){

			} else if(index == 1) {
				// 그리드 init
				initGridCouplerInf();
				searchCoupler();
			}
			// 마이크로웹이브 채널
			else if(index == 2) {
				$('#microWaveChannel').alopexGrid("viewUpdate");
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
	
	//TODO
	// FDF장비일 경우 다중 포트 선택이 되는데 2개까지만 가능하도록(TX, RX) 
	$('#' + portGridId).on('click', function(e) {
		var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
		if (dataObj.length > 2) {
			alertBox('I', makeArgMsg('maxChoice', 2, "", "", ""));
			$('#' + portGridId).alopexGrid("rowSelect", {_state : { focused : true }}, false);
		}
		
		// 5G-PON CRN 장비의 경우 같은 채널의 값을 선택하여 TX/RX처리함
		if (dataObj.length == 1 && isFGCrnNe(dataObj[0]) == true  ) {
			var portChnlNm = nullToEmpty(dataObj[0].portChnlNm);
			if (fiveGponEqpTxRx.length == 0) {
				if (portChnlNm != "") {
					var chkData = $('#' + portGridId).alopexGrid("dataGet");
					$('#'+portGridId).alopexGrid("rowSelect", {'portChnlNm' :portChnlNm}, true);
				}
				
				var txRx = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
				for (var data in txRx) {
					fiveGponEqpTxRx.push(data.portId);
				}
			} else {
				if (portChnlNm != "") {
					var chkData = $('#' + portGridId).alopexGrid("dataGet");
					$('#'+portGridId).alopexGrid("rowSelect", {'portChnlNm' :portChnlNm}, false);
					fiveGponEqpTxRx = [];
				}
			}
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
		if(isFdf || isRotn) {
			var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
			dataObj = AlopexGrid.trimData(dataObj);
			
			for(var i = 0; i < dataObj.length; i++) {
				if(dataObj[i].coreLockYn == "Y") {
					// 그린코어
					msg = '해당 포트는 GIS상의 그린 코어입니다. 등록하시겠습니까?';
					
					callState = "callMsgBox";
					break;
				} else if(dataObj[i].portStatCd == "0001" ) {
					// 운용
					msg = '이미 연결되어 사용중인 포트 입니다. 사용하시겠습니까?';
					if(dataObj[i].coreCnntRmk != null) msg += '(' + dataObj[i].coreCnntRmk + ')';
					
					callState = "callMsgBox";
					break;
				} else if(dataObj[i].portStatCd == "0002") {
					// 미사용
					callState = "close";
				} else if(dataObj[i].portStatCd == "0003") {
					// 예비상태
					msg = '예비로 구분된 포트 입니다.';
					if(dataObj[i].coreCnntRmk != null) msg += '(' + dataObj[i].coreCnntRmk + ')';
					
					callState = "callMsgBox";
					break;
				} else if(dataObj[i].portStatCd == "0004") {
					// 폐기/고장
					msg = "고장 장비는 선택 불가능합니다.";
					callState = "alertBox";
					break;
				} else {
					// 미진입
					msg = "미진입 장비는 선택 불가능합니다.";
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
		
		
		onCheckedChangedDirectInput(e);
	});
	
	// T1체크시 
	$('input:checkbox[id="t1"]').on('click', function(e){
		onCheckedChangedT1(e);
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
		onSelectedChangedPortDataGrid(e);
	});
	
	// 파장 그리드
	$('#waveLength').on('dataSelectEnd', function(e) {
		onSelectedChangedWavelengthDataGrid(e);
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
				title : "사용회선조회",
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
	
	$('#microWaveChannel').on('dataSelectEnd', function(e) {
		
		onSelectedChangedPortDataGrid(e);
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
function onSelectedChangedPortDataGrid(e) {
	try {
		var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }});
				
		if(dataObj.length > 0) {
			// LTE회선일 경우 물리포트명 표시
			setPortData.PORT_ID = dataObj[0].portId;
			if(isServiceLine() && (initParam.svlnSclCd == "016" || initParam.svlnSclCd == "030")){
				setPortData.PORT_NM = dataObj[0].physPortNm;
				setPortData.PORT_DESCR = dataObj[0].physPortNm;
			} else {
				setPortData.PORT_NM = dataObj[0].portNm;
				setPortData.PORT_DESCR = dataObj[0].portNm;
			}
		} else {
			// 하나도 선택이 안되었을 경우 reset
			setPortData.PORT_ID  = "";
			setPortData.PORT_NM = "";
			setPortData.PORT_DESCR = "";
		}
		
		//TODO
		if((isFdf
			|| isRotn
			|| (isFGSmux == true && isRuCoreLine() == true)
			|| (isFGCrn == true && fiveGponEqpType == "CRN")
			) 
			&& dataObj.length == 2) {
			setPortData.RX_PORT_ID = dataObj[1].portId;
			if(isServiceLine() && (initParam.svlnSclCd == "016" || initParam.svlnSclCd == "030")){			
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
		
		if (microWaveEqpYn == "Y") {
			var mwChannlDataObj = $('#microWaveChannel').alopexGrid("dataGet", {_state : { selected : true }});
			var mwChannlData = "";
			if (mwChannlDataObj.length > 0) {
				mwChannlData = "," 
				for (var i = 0; i < mwChannlDataObj.length; i++) {
					if (i > 0) {
						mwChannlData += "/" 
					}
					mwChannlData+= mwChannlDataObj[i].chnlVal;
				}
				
			}

			$("#channelDescr").val(port + mwChannlData);
		}
		else {

			$("#channelDescr").val(port + selectedChannel);
			// 파장정보도 셋팅
			if ((isFGCrn == true && fiveGponEqpType == "CRN")
				|| (isBcCwMux == true && isSubScriRing() == true && nullToEmpty(setPortData.PORT_NM).toUpperCase().indexOf("COM") < 0)
			    ) {
							
				channelVal = "";
				channelIds = [];
				
				for(var i = 0; i < dataObj.length; i++) {
					if (nullToEmpty(dataObj[i].portWaveNm) != '') {
						if(i == 0) channelVal += "("; 
						channelVal += dataObj[i].portWaveNm;
						if(i < (dataObj.length-1) && dataObj[i].portWaveNm != "") channelVal += "/";
						if(i == dataObj.length-1) channelVal += ")"; 
						
						var temp = {"EQP_MDL_ID" : dataObj[i].eqpMdlId, "EQP_MDL_DTL_SRNO" : dataObj[i].eqpMdlDtlSrno};
						if (nullToEmpty(dataObj[i].eqpMdlDtlSrno) != "") {
							channelIds.push(temp);
						}
					}
				}
				if (nullToEmpty($("#channelDescr").val()).indexOf(channelVal) < 0) {
					$("#channelDescr").val($("#channelDescr").val() + channelVal);
				}
				
				setPortData.CHANNEL_IDS = channelIds;
			} else {
				searchChannel();	
			}	
		}
	} catch ( err ) {
		console.log(err);
	}
};

function onSelectedChangedWavelengthDataGrid(e) {
	try {
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
	} catch ( err ) {
		console.log(err);
	}
}


function searchChannel() {
	
	try {
		
		cflineShowProgress('channelDiv');
		
		$("#channelLeftContent").html("");
		$("#channelRightContent").html("");
	
		
		var dataObj = $('#' + portGridId).alopexGrid("dataGet", {_state : { selected : true }})[0];
		
		//	동일한 카드의 포트 변경 선택이면 재조회하지 않고 채널 선택만 리셋한다.
		if ( prevSelectedPortData !== null  && isNullOrEmpty(dataObj.cardId) == false && prevSelectedPortData.cardId === dataObj.cardId 
				&& isNullOrEmpty(dataObj.portCapaNm) == false && prevSelectedPortData.portCapaNm === dataObj.portCapaNm ) {
			channelDescrInfoManager.setSelectedUpperChannelAll(false);
			channelDescrInfoManager.setSelectedE1ChannelAll(false);
			
			generateUpperChannel();
			generateLowerChannel();
			generateChannelGroupDescr();
			
			return;
		}
		
		prevSelectedPortData = dataObj;
		
		var baseT1 = $('#t1').is(':checked');
		
		if(isServiceLine()) {
			// 사용네트워크의 채널 가져오기
			var useNetworkPortChnlVal = null;
			
			var useNetworkPath = teamsPath.findUseNetworkPath(useNetworkId);
			if ( useNetworkPath != null ) {
				var node = useNetworkPath.findNodeById(setTeamsPath.NODE_ID);
				if ( node != null ) {
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
			
			var paramData = {
								"eqpMdlId" : dataObj.eqpMdlId
								, "portId" : dataObj.portId
								, "portNm" : dataObj.portNm
								// 무조건 t1기준으로
								, "generateBaseE1" : false
								// 회선 채널 값(구분자 포함)
								, "portChnlVal" : selectedChannel
								, "useNetworkPortChnlVal" : useNetworkPortChnlVal
								, "generateE1Channel" : true
							};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/generateAvailableChannelList', paramData, 'GET', 'generateAvailableChannelList');
		} else {
			
			var paramData = {
								"eqpMdlId" : dataObj.eqpMdlId
								, "portId" : dataObj.portId
								, "portNm" : dataObj.portNm
								, "generateBaseE1" : false
								// 회선 채널 값(구분자 포함)
								, "portChnlVal" : selectedChannel
								, "useNetworkPortChnlVal" : ""
								, "generateE1Channel" : visibleLowerChannelDiv
							};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/generateAvailableChannelList', paramData, 'GET', 'generateAvailableChannelList');
		}
	} catch ( err ) {
		console.log(err);
	} finally {
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
			clickSelect: false,
			radioColumn: true,
			singleSelect: true,
			disableSelectByKey: true,
			allowSingleUnselect: false
		},
		rowOption : {
			allowSelect : function(data) {
				var portId = "";
				if(portData != null && portData.PORT_ID != "0") {
					portId = portData.PORT_ID;
				}
				if(!isRing && portId != "" && portId != data.portId) {
					return false;
				}
			}, 
			inlineStyle : function(value, data, mapping) {
				var portId = "";
				if(portData != null && portData.PORT_ID != "0") {
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
		columnFixUpto : 1,
		height : 340,
		pager : false,
    	message: {
    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
		}
	});
	
	// LTE회선일 경우 물리포트명 표시
	if(isServiceLine() && (initParam.svlnSclCd == "016" || initParam.svlnSclCd == "030")){	
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
	 			
	 			,{ key : 'portChnlNm', align : 'center', title : cflineMsgArray['port'] + cflineMsgArray['channelValue'] /*포트 채널값 */
	 				, width : '80px', hidden : (nullToEmpty(fiveGponEqpType) == "CRN" ? false : true)
				}
				,{ key : 'portWaveNm', align : 'center', title : cflineMsgArray['port']  + cflineMsgArray['wavelength'] /*포트 파장 */
					, width : '80px', hidden : (nullToEmpty(fiveGponEqpType) == "CRN" ? false : true)
				}
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
	 			,{ key : 'coreCnntRmk', align : 'left', title : cflineMsgArray['coreConnectionRemark'] /* 코어접속비고 */, width : '800px'}
	 			
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
	              	, { key : 'wavlVal', title : '파장', align : 'center', width : '200px' }
	              	, { key : 'drcVal', title : '방향', align : 'center', width : '200px' } 
	              	, { key : 'freqVal', title : '주파수', align : 'center', width : '75px', hidden : true }
	  	         	, { key : 'chnlVal', title : '채널', align : 'center', width : '75px', hidden : true }
	  	         	, { key : 'bdwthVal', title : '밴드', align : 'center', width : '75px', hidden : true }
	  				, { key : 'eqpMdlDtlSrno', title : '일련번호', align : 'center', hidden : true } 
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
		height : 260,
		pager : false,
		columnMapping : column,
		message: {
			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>조회된 데이터가 없습니다</div>"
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
	
	if(isFdfNe(data.Ne.NE_ROLE_CD) 
		|| isRotnNe(data.Ne.NE_ROLE_CD) 	
		|| (isFGSmuxNe(data.Ne.NE_ROLE_CD, data.Ne.MODEL_NM)== true && isRuCoreLine() == true)
		|| (isFGCrnNe(data.Ne) == true && fiveGponEqpType == "CRN")
		|| ((data.Ne.NE_ROLE_CD == '183' || data.Ne.NE_ROLE_CD == '184') && isSubScriRing() == true)
	) {
		
		$("#channelTab").hide();
		$("#channelDiv").css("display", "none");
		if (isFdfNe(data.Ne.NE_ROLE_CD)) {
			isFdf = true;
		}
		if (isRotnNe(data.Ne.NE_ROLE_CD)) {
			isRotn = true;
		}
		if (isFGSmuxNe(data.Ne.NE_ROLE_CD, data.Ne.MODEL_NM)== true) {
			isFGSmux = true;
		}
		if (isFGCrnNe(data.Ne)== true) {
			isFGCrn = true;
		}
		// BC-MUX 혹은 CWDM-MUX
		if (data.Ne.NE_ROLE_CD == '183' || data.Ne.NE_ROLE_CD == '184') {
			isBcCwMux = true;
		}
		
		$("#portChannelTopDiv").hide();
		$("#portNm").css("width", "1110px");
		
		$('#' + portGridId).alopexGrid("updateOption", { rowSelectOption: {radioColumn : false, singleSelect : false} });
		$('#' + portGridId).alopexGrid("updateOption", { width : 1190 });
	} 
	// 마이크로 웨이브 장비인 경우
	else if (microWaveEqpYn == "Y") {
		//$('#' + portGridId).alopexGrid("updateOption", { rowSelectOption: {radioColumn : true, singleSelect : true} });
	}
	
	else {
		$("#channelTab").show();
//		$("#portRegDiv").hide();
		isFdf = false;
		isRotn = false;
		isFGSmux = false;
		isFGCrn = false;
		isBcCwMux = false;
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
	setPortData = opener.setPortData;// opener에서 생성한 객체를 사용 explore오류수정
	
	// 마이크로 웨이브 장비가 아닌경우
	if (microWaveEqpYn == "N") {
		channelGroupDescr = new ChannelGroupDescr();
		$("#portChannelTab").setTabIndex(0);
	}
	setTarget = target;
	setTeamsPath = visualLinePath.selection.Da.value.data;
	
	$('#'+portGridId).alopexGrid("dataEmpty");
	$("#channelDescr").val("");
	$('#portNm').val("");
	
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
	
	selectedChannel = portData.CHANNEL_DESCR;
	
	
	// 링노드일 경우 포트 수정 가능 
	if(data.isRingNode() || !data.isNetworkNode()) {
		isRing = true;
	} else {
		isRing = false;
	}
		
	cflineShowProgress(portGridId);
	var svlnNo = opener.baseInfData.svlnNo;
	portParamData = {    "neId" : data.NE_ID
				       , "svlnNo" : svlnNo
				       , "serviceLineYn" : "Y"
				       , "firstRowIndex" : nFirstRowIndex
				       , "lastRowIndex" : nLastRowIndex
				       , "fiveGponEqpType" : fiveGponEqpType
				       , "eqpRoleDivCd" : data.Ne.NE_ROLE_CD
			        };
	
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/getPortInfList', portParamData, 'GET', 'portSearch');

	// 룰 조회
	var eqpParam = {"eqpMdlId" : data.Ne.MODEL_ID};
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectEqpMdlPortRule', eqpParam, 'GET', 'eqpMdelPortRule');
	
//	console.log( 'request port list ');
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

//커플러 조회
function searchMicroWaveChannel(paramData) {
	
	var searchNtwkLineNo = nullToEmpty(initParam.ntwkLineNo);
	if (nullToEmpty(initParam.node.Ring) != "") {
		searchNtwkLineNo = initParam.node.Ring.NETWORK_ID;
	}
	var paramData = {"eqpMdlId" : searchEqpMdlId, "eqpRoleCd" : initParam.node.Ne.NE_ROLE_CD, "microWaveEqpYn" : microWaveEqpYn, "ntwkLineNo" : searchNtwkLineNo};
	
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/selectCouplerList', paramData, 'POST', 'microWaveChannelSearch');
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

	// 장비의 5G-PON타입
	portParamData.fiveGponEqpType = fiveGponEqpType;
	
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
 * 채널 generate
 * 선택할수 있는 채널 및 E1/T1 값이 출력되며 설정된 값이 있으면 체크해준다..
 * 예) 01-3-06-01,08351
 * 포트채널		| 채널	| E1,T1
 * 01-3-06-01   | 08	| 08111 ~ 08373  
 * @param data
 */
function generateServiceLineChannel(data) {

	try {
		var t1 = portData.IS_CHANNEL_T1 ? true : false;
		$('#t1').setChecked(t1);
		
		if(data != undefined) {
			
//			StopWatch stopWatch = new StopWatch();
//			stopWatch.start();
//			debugger;
			channelDescrInfoManager.clear();
			
			// 입력 가능한 채널 전체 조회해서 읽기
			channelDescrInfoManager.fromObject(data);
			
			// 상위 채널(155M OR 45M) 목록을 표시
			generateUpperChannel();
			generateLowerChannel();
			generateChannelGroupDescr();

//			stopWatch.stop();
//			console.log( "generateChannel : " + stopWatch.elapsed() );
			
		}
	} catch (e) {
		console.log(e);
	}
	
//	$('#channelDiv').progress().remove();
	cflineHideProgress('channelDiv');
};


/**
 * 채널 generate
 * @param data
 */
function generateNetworkChannel(data) {
	
	try {

		if(data != undefined) {
			
//			StopWatch stopWatch = new StopWatch();
//			stopWatch.start();
//			debugger;
			channelDescrInfoManager.clear();
			
			// 입력 가능한 채널 전체 조회해서 읽기
			channelDescrInfoManager.fromObject(data);
			
			// 상위 채널(155M OR 45M) 목록을 표시
			generateUpperChannel();
			generateLowerChannel();
			generateChannelGroupDescr();

//			stopWatch.stop();
//			console.log( "generateChannel : " + stopWatch.elapsed() );
			
		}
	} catch (e) {
		console.log(e);
	}
	
//	$('#channelDiv').progress().remove();
	cflineHideProgress('channelDiv');
};



/**
 * 상위 채널을 생성한다.
 */
function generateUpperChannel() {
	try {
		cflineShowProgress('channelDiv');
		channelHtml = "";
		$("#channelLeftContent").html("");
		
		var upperChannelList = null;
		if ( visibleUpperChannelDiv ) {
			upperChannelList = channelDescrInfoManager.getUpperChannelList();
			
			if ( upperChannelList != null && upperChannelList.length > 0 ) {
				
				if ( visibleLowerChannelDiv ) {
					//	상위 채널 중 선택된 게 없으면 첫번째 채널을 기본 선택 처리
					var hasSelected = false; 
					for ( var idx = 0; idx < upperChannelList.length; idx++ ) {
						var channelDescr = upperChannelList[idx];
						if ( channelDescr.SELECTED ) {
							hasSelected = true;
							break;
						}
					}
					
					if ( hasSelected == false ) {
						upperChannelList[0].SELECTED = true;
					}
				}
				
				checkBox155M( upperChannelList );
			}
		}	
		
	} catch (e) {
		console.log(e);
	} finally {
		$("#channelLeftContent").html(channelHtml);
		cflineHideProgress('channelDiv');
		checkBox155MEvent();
	}
	
};







/**
 * 하위 채널을 생성한다.
 */
function generateLowerChannel() {
	try {
		cflineShowProgress('channelDiv');
		channelHtml = "";
		$("#channelRightContent").html("");
		
		if ( visibleLowerChannelDiv == false ) {
			return;
		}
		
		var baseT1 = $('#t1').is(':checked');
		
		//	선택된 상위 채널 목록
		var selectedUpperChannelList = channelDescrInfoManager.getSelectedUpperChannelList();
		
		//	E1 채널 전체
		var e1Channels = channelDescrInfoManager.getE1ChannelList(null, baseT1);

		//	E1 채널 선택 및 숨김 처리
		var visibleLowerChannelList = [];
		
		for (var idx = 0; idx < e1Channels.length; idx++) {
			var channelDescr = e1Channels[idx];

			if ( visibleUpperChannelDiv ) {
				//	상위 채널을 구한다.
				var upperChannel = null;
				if ( selectedUpperChannelList != null && selectedUpperChannelList.length > 0 ) {
					for ( var upperIdx = 0; upperIdx < selectedUpperChannelList.length; upperIdx++ ) {
						upperChannel = selectedUpperChannelList[upperIdx];
						if ( upperChannel.isSubChannel(channelDescr) ) {
							//	상위 채널이 선택된 경우에 해당 하위 채널 모두 표시 
							if ( upperChannel.SELECTED ) {
								visibleLowerChannelList.push(channelDescr);
							}

							break;
						}
					}
				}
				
			} else {
				//	상위 채널 비표시일 경우에는 모든 하위 채널 표시
				visibleLowerChannelList.push(channelDescr);
			}
		}
		
		channelHtml = checkBox2M(visibleLowerChannelList);
		
	} catch (e) {
		console.log(e);
	} finally {
		$("#channelRightContent").html(channelHtml);
		cflineHideProgress('channelDiv');
		checkBox2MEvent();
	}
	
};


/**
 * 현재 선택된 채널에 따라 채널 그룹 문자열을 설정한다.
 */
function generateChannelGroupDescr() {
	
	try {
		
		var baseT1 = $('#t1').is(':checked');
		
		//	채널 그룹 문자열 설정
		//	E1 채널이 선택된 게 있으면  E1 채널로 설정하고 없으면 상위 채널로 설정
		channelGroupDescr.channelInfos = [];
		
		if ( visibleLowerChannelDiv ) {
			var selectedUpperChannelList = channelDescrInfoManager.getSelectedUpperChannelList();
			var selectedLowerChannelList = channelDescrInfoManager.getSelectedE1ChannelList(baseT1);
			
			if ( selectedLowerChannelList != null && selectedLowerChannelList.length > 0 ) {
				channelGroupDescr.channelInfos = channelGroupDescr.channelInfos.concat(selectedLowerChannelList);
			} else if ( selectedUpperChannelList != null && selectedUpperChannelList.length > 0 ) {
				channelGroupDescr.channelInfos = channelGroupDescr.channelInfos.concat(selectedUpperChannelList);
			}
		} else {
			var selectedUpperChannelList = channelDescrInfoManager.getSelectedUpperChannelList();
			
			if ( selectedUpperChannelList != null && selectedUpperChannelList.length > 0 ) {
				channelGroupDescr.channelInfos = channelGroupDescr.channelInfos.concat(selectedUpperChannelList);
			}
		}
		
		var channel = channelGroupDescr.generateChannelGroupDescr(baseT1);
		var port = setPortData.PORT_NM;
		$("#channelDescr").val(port + channel);
		$("#directInputChannel").val(channel);	
		
	} catch ( err ) {
		console.log(err);
	}
};





//155M/45M 체크박스 생성
function checkBox155M(data) {
	
	var count = 0;
	
	if ( data != undefined ) {
		var newlineCnt = 2;

		if ( visibleLowerChannelDiv == false ) {
			newlineCnt = 10;
		}
		
		for(var idx = 0; idx < data.length; idx++) {
			var channelDescr = data[idx];
			var CHANNEL_DESCR = channelDescr.channelDescrWithoutSep();
			channelHtml += '<span id="divUpperChannel_' + CHANNEL_DESCR + '"><input class="Checkbox" type="checkbox" name="' 
									+ CHANNEL_DESCR + '" value="' + CHANNEL_DESCR + '" id="ckbChannel155"';

			if ( channelDescr.SELECTED ) {
				channelHtml += '" checked/>'
			} else {
				channelHtml += '/>';
			}
			
			channelHtml +=  '<span style="display: inline-block; width: 30px;">' + CHANNEL_DESCR + '</span></span>';
			
			count++;
			if(count % newlineCnt == 0) {
				channelHtml += '<br/>';
			}
			
			channelDescrObj[CHANNEL_DESCR] = data[idx];
		}
	}
	
	return channelHtml;

};



/**
 * E1, T1, generate
 * E1 3열, T1 4열
 * 
 */
function checkBox2M(data) {
	var count = 0;
	
	if(data != undefined) {
		var newlineCnt = 3;
		var baseT1 = $('#t1').is(':checked');
		
		if ( isNDCS ) {
			newlineCnt = 5;
		} else {
			if( baseT1 ) {
				newlineCnt = 4;
			}			
		}
		
		for(var idx = 0; idx < data.length; idx++) {
			var channelDescr = data[idx];
			var CHANNEL_DESCR = channelDescr.channelDescrWithoutSep();
			channelHtml += '<span id="divLowChannel_' + CHANNEL_DESCR + '"><input class="Checkbox" type="checkbox" name="' 
									+ CHANNEL_DESCR + '" value="' + CHANNEL_DESCR + '" id="ckbChannel2"';

			if ( channelDescr.SELECTED ) {
				channelHtml += ' checked/>'
			} else {
				channelHtml += '/>';
			}
			
			channelHtml +=  '<span style="display: inline-block; width: 60px;">' + CHANNEL_DESCR + '</span></span>';
			
			count++;
			if(count % newlineCnt == 0) {
				channelHtml += '<br/>';
			}
			
			channelDescrObj[CHANNEL_DESCR] = data[idx];
		}
	}
	
	return channelHtml;
};



function checkBox155MEvent() {
	//체크
	$('input:checkbox[id="ckbChannel155"]').on('click', function(e){
		onCheckedChangedUpperChannel(e);
	});
};



//E1/T1 체크시 이벤트 생성. 2M조회
function checkBox2MEvent() {
	//체크
	$('input:checkbox[id="ckbChannel2"]').on('click', function(e){
		onCheckedChangedLowerChannel(e);
	});
};



//상위 채널 선택 변경시
function onCheckedChangedUpperChannel(e) {
	
	try {

		var channelValue = e.target.value;
		var channelChecked = e.target.checked;
		
		var channelDescr = channelDescrInfoManager.findUpperChannelDescr(channelValue);
		channelDescr.SELECTED = channelChecked;
		
		if ( channelChecked == false ) {
			var e1ChannelList = channelDescrInfoManager.getE1ChannelList(channelValue, true);
			if ( e1ChannelList != null ) {
				for ( var idx = 0; idx < e1ChannelList.length; idx++ ) {
					var e1ChannelDescr = e1ChannelList[idx];
					e1ChannelDescr.SELECTED = false;
				}
			} 
		}
		
		generateLowerChannel();
		generateChannelGroupDescr();
	} catch ( err ) {
		console.log(err);
	}

};





//하위 채널 선택 변경시
function onCheckedChangedLowerChannel(e) {

	try {
		var channelValue = e.target.value;
		var channelChecked = e.target.checked;
		
		var channelDescr = channelDescrInfoManager.findE1ChannelDescr(channelValue);
		channelDescr.SELECTED = channelChecked;
		
		generateChannelGroupDescr();
		
	} catch ( err ) {
		console.log(err);
	}
	
};



//T1 선택 변경시
function onCheckedChangedT1(e) {
	
	try {

		var channelValue = e.target.value;
		var channelChecked = e.target.checked;
		
		if ( channelChecked == false ) {
			var e1ChannelList = channelDescrInfoManager.getE1ChannelList(null, true);
			if ( e1ChannelList != null ) {
				for ( var idx = 0; idx < e1ChannelList.length; idx++ ) {
					var e1ChannelDescr = e1ChannelList[idx];
					if ( e1ChannelDescr.IS_T1 ) {
						e1ChannelDescr.SELECTED = false;
					}
				}
			} 
		}
		
		generateLowerChannel();
		generateChannelGroupDescr();
	} catch ( err ) {
		console.log(err);
	}

};


//직접입력 선택 변경시
function onCheckedChangedDirectInput(e) {
	
	try {
		var channelValue = e.target.value;
		var channelChecked = e.target.checked;
		
		if ( channelChecked == false ) {
			if ( visibleLowerChannelDiv ) {
				//	직접 입력한 것을 파싱하기 어렵다.
				//	그냥 E1 전체를 리셋한다.
				var e1ChannelList = channelDescrInfoManager.getE1ChannelList(null, true);
				if ( e1ChannelList != null ) {
					for ( var idx = 0; idx < e1ChannelList.length; idx++ ) {
						var e1ChannelDescr = e1ChannelList[idx];
						e1ChannelDescr.SELECTED = false;
					}
				} 
			} else if ( visibleUpperChannelDiv ) {
				//	네트워크 선번에서 상위 채널만 표시될 때만 리셋
				var upperChannelList = channelDescrInfoManager.getUpperChannelList();
				
				if ( upperChannelList != null ) {
					for ( var idx = 0; idx < upperChannelList.length; idx++ ) {
						var channelDescr = upperChannelList[idx];
						channelDescr.SELECTED = false;
					}
					
					generateUpperChannel();
				} 
				
			}
		}
		
		generateLowerChannel();
		generateChannelGroupDescr();
	} catch ( err ) {
		console.log(err);
	}

};



//다이어그램에 포트 등록
function setPortToDiagram() {
	// EAST = A, WEST = B
	var data = setTeamsPath;
	var channel = "";
	var isWave = false;
	var baseT1 = $('#t1').is(':checked');
	
	// S-MUX 장비의 토폴리지 타입이 PTP 형태인 경우 (SMUX인 경우에만 체크한다!!)
	if(initParam.node.NE_ROLE_CD == "19" && initParam.topoLclCd == "001" && initParam.topoSclCd == "035" && topologyType == "002"){
		if(setPortData.PORT_ID == "3" || setPortData.PORT_ID == "4"){
			alertBox('W', "토폴로지 타입이 PTP일 경우 Line포트는 설정할 수 없습니다.");   
			return;
		}
	}
	
	
	if($("#portChannelTab").getCurrentTabIndex() == 0) {
		if(channelGroupDescr.channelInfos.length > 0) {
			// 체크를 통해서 채널 선택
			channel = channelGroupDescr.generateChannelGroupDescr(baseT1);
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
	// MW 채널
	else if ($("#portChannelTab").getCurrentTabIndex() == 2) {
		var dataObj = $('#microWaveChannel').alopexGrid("dataGet", {_state : { selected : true }});
		if (dataObj.length > 0) {
			dataObj = AlopexGrid.trimData(dataObj);
			channel = ","+dataObj[0].chnlVal;
			if (dataObj.length > 1) {
				channel += "/" + dataObj[1].chnlVal;
			}
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
		
		// FDF장비일 경우 A,B 동일하게 설정
		if(isFdf || isRotn) {
			data.BPortDescr = setPortData;
		}
		
		// CRN 장비의 경우 파장
		// 5G-PON 2.0, 3.1 CRN 장비의 경우
		if (fiveGponEqpType == "CRN" && nullToEmpty(channelVal) != "") {	
			data.APortDescr.CHANNEL_DESCR = channelVal;
			data.EAST_CHANNEL_DESCR = channelVal;
		}
		// 가입자망의 BC-MUX, CWDM-MUX장비인 경우
		if (isBcCwMux == true && isSubScriRing() == true && nullToEmpty(setPortData.PORT_NM).toUpperCase().indexOf("COM") < 0) {
			data.APortDescr.CHANNEL_DESCR = channelVal;
			data.EAST_CHANNEL_DESCR = channelVal;
		}
	} else if(setTarget == "WEST_PORT_CHANNEL" || setTarget == "WEST_PORT_CHANNEL_PART" ) {
		data.BPortDescr = setPortData;
		data.WEST_CHANNEL_DESCR = channel;
		if(isWave) {
			data.CHANNEL_IDS = setPortData.CHANNEL_IDS;
		} 
		data.WEST_PORT_CHANNEL = setPortData.PORT_NM + channel; 
		data.WEST_PORT_ID = setPortData.PORT_ID;
		data.WEST_PORT_NM = setPortData.PORT_NM;
		
		// FDF장비일 경우 A,B 동일하게 설정
		if(isFdf || isRotn) {
			data.APortDescr = setPortData;
		}
		
		// CRN 장비의 경우 파장
		// 5G-PON 2.0, 3.1 CRN 장비의 경우
		if (fiveGponEqpType == "CRN" && nullToEmpty(channelVal) != "") {	
			data.BPortDescr.CHANNEL_DESCR = channelVal;			
			data.WEST_CHANNEL_DESCR = channelVal;
		}
		
		// 가입자망의 BC-MUX, CWDM-MUX장비인 경우
		if (isBcCwMux == true && isSubScriRing() == true && nullToEmpty(setPortData.PORT_NM).toUpperCase().indexOf("COM") < 0) {
			data.BPortDescr.CHANNEL_DESCR = channelVal;			
			data.WEST_CHANNEL_DESCR = channelVal;
		}
	}
	
	for(var idx = 0; idx < teamsPath.NODES.length; idx++ ) {
		var node = teamsPath.NODES[idx];
		if(node.NODE_ID == data.NODE_ID) {
			teamsPath.NODES[idx] = data;
			break;
		}
	}
	
	opener.teamsPath = teamsPath;
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
//	        url: '/tango-transmission-web/configmgmt/portmgmt/PortReg.do',
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
//		console.log( 'received port list ');
		
		// 포트 조회
		cflineHideProgress(portGridId);
		
		if(flag == "portSearch") {
			$('#' + portGridId).alopexGrid('dataSet', response.portInfList);
			// 5G-PON 2.0, 3.1 CRN 장비의 경우
			if (fiveGponEqpType == "CRN") {
				$('#'+portGridId).alopexGrid("showCol", ['portChnlNm', 'portWaveNm']);
			} 
			// 장비가 BC-MUX, CWDM-MUX인경우
			else if (isBcCwMux == true) {
				$('#'+portGridId).alopexGrid("showCol", ['portWaveNm']);
			}
			
		} else if(flag == "portSearchAdd") {
			if (response.portInfList.length > 0) {
				$('#' + portGridId).alopexGrid("dataAdd", response.portInfList);
			}
		}
		
		if ( isInitPort == false ) {
			
			// 사용네트워크 포트 선택
			if(response.portInfList.length > 0) {
				var dataList = AlopexGrid.trimData($('#'+portGridId).alopexGrid("dataGet"));
				for(var idx = 0; idx < dataList.length; idx++ ) {
					if(portData != null && dataList[idx].portId == portData.PORT_ID) {
						$('#'+portGridId).alopexGrid('rowSelect', {_index: {row:idx}}, true);
						$('#'+portGridId).alopexGrid('setScroll', {row:idx});
						searchChannel();
					} 
					
					if(portData != null && dataList[idx].portId == portData.RX_PORT_ID) {
						$('#'+portGridId).alopexGrid('rowSelect', {_index: {row:idx}}, true);
						$('#'+portGridId).alopexGrid('setScroll', {row:idx});
					}
				}
			}
		
			//	초기 설정된 포트의 채널값이므로 채널 검색 후 없앤다.
			selectedChannel = '';

			isInitPort = true;
		}

	} else if( flag == "eqpMdelPortRule") {
		// 포트 룰 조회
		try {
			if(response.eqpMdlPortRule != undefined && Object.getOwnPropertyNames(response.eqpMdlPortRule).length > 0) {
				var eqpMdlId = Object.keys(response.eqpMdlPortRule);
				var eqpMdlRule = response.eqpMdlPortRule[eqpMdlId];
				var eqpRuleText = "";
				
				for(var idx = 0; idx < eqpMdlRule.length; idx++ ){ 
					if(idx == 0) {
						eqpRuleText += "모델명 : " + eqpMdlRule[idx].eqpMdlNm + "<br/>";
					}
					eqpRuleText += "룰) " + eqpMdlRule[idx].shpRuleRmk + "<br/>";
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
			if ( isServiceLine() ) {
				generateServiceLineChannel(response.data);
			} else {
				generateNetworkChannel(response.data);
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
	// 마이크로 웨이브용 채널 검색
	else if( flag == "microWaveChannelSearch" ) {
		// 커플러(파장) 검색
		if(response.couplerList != undefined) {
			$('#microWaveChannel').alopexGrid('dataSet', response.couplerList);
			
			var orgChnlVal = "";
			if (setTarget == "EAST_PORT_CHANNEL" || setTarget == "EAST_PORT_CHANNEL_PART") {
				orgChnlVal = initParam.node.APortDescr.CHANNEL_DESCR;
			} else if (setTarget == "WEST_PORT_CHANNEL" || setTarget == "WEST_PORT_CHANNEL_PART") {
				orgChnlVal = initParam.node.BPortDescr.CHANNEL_DESCR;
			}
			
			orgChnlVal = orgChnlVal.replace(/\,/g, '');
			var orgChnlValArr = orgChnlVal.split("/");
			
			var dataList = AlopexGrid.trimData($('#microWaveChannel').alopexGrid("dataGet"));
			for (var i =0; i < orgChnlValArr.length; i++) {
				for (var idx = 0; idx < dataList.length; idx++) {
					if (orgChnlValArr[i] == dataList[idx].chnlVal) {
						$('#microWaveChannel').alopexGrid('rowSelect', {_index: {row:idx}}, true);
						$('#microWaveChannel').alopexGrid('setScroll', {row:idx});
						break;
					}
				}
			}
		}
	} 
}


//2019-02-18  2. [수정] 5G-PON 2.0, 3.1 CRN장비
function isFGCrnNe(chkData) {
	
	if (nullToEmpty(fiveGponEqpType) == 'CRN') {
		return true;
	}
	
	return false;
}

/**
 * 마이크로웨이브 채널 그리드
 */
function initMicroWaveChannelGrid() {
	
	var column = [
	              	{ key : 'check', selectorColumn : true, width : '40px' }
	              	, { key : 'wavlVal', title : '파장', align : 'center', width : '75px' , hidden :  true }
	              	, { key : 'drcVal', title : '방향', align : 'center', width : '75px' , hidden :  true} 
	              	, { key : 'freqVal', title : '주파수', align : 'center', width : '75px', hidden : true }
  	         	    , { key : 'chnlVal', title : '채널', align : 'left', width : '200px', hidden :  false  }
	  				, { key : 'bdwthVal', title : '밴드', align : 'center', width : '75px', hidden : true }
	  				, { key : 'eqpMdlDtlSrno', title : '일련번호', align : 'center', hidden : true } 
			];
	
	$('#microWaveChannel').alopexGrid({
		fitTableWidth: true,
		fillUndefinedKey : null,
		numberingColumnFromZero: false,
		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
		useClassHovering : true,
		rowSingleSelect : false,
		height: 320,
		columnMapping : column,
		pager : false,
	  	message: {
	  		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>조회된 데이터가 없습니다</div>"
		}
	});
	
	$('#microWaveChannel').alopexGrid("updateOption", { fitTableWidth: true });
}
