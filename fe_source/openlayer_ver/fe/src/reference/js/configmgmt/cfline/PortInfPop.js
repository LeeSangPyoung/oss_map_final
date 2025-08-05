/**
 * PortInfPop.js
 * 
 * @author Administrator
 * @date 2016. 12. 08. 오후 15:42:03
 * @version 1.0
 * 
 * 
 ************* 수정이력 ************
 * 2018-11-29  1. [수정] SMUX장비의 경우 TX/RX 포트설정이 가능하도록 수정
 * 2019-02-18  2. [수정] 5G-PON 2.0 CRN장비의 경우 TX/RX 포트설정이 가능하도록 수정(같은 채널 자동 선택)
 * 2021-10-13  3. [추가] FDF장비군 외 ROADM장비도 포트를 2개 설정가능하게 개선
 */
$a.page(function() {
	var gridId = 'dataGrid';
	var ntwkLineNo = "";
	var svlnNo = "";
	var neId = "";
	var serviceLineYn = "N";
	var svlnLclCd = "";
	var svlnSclCd = "";
	var topoLclCd = "";
	var topoSclCd = "";
	var topologyType = "";
	var fiveGponEqpType = "";
	var fiveGponEqpTxRx = [];
	var totalCnt = 0;
	var portNm = "";
	var cardNm = "";
	var portId = "";

	this.init = function(id, param) {
		neId = nullToEmpty(param.neId);
		portId = nullToEmpty(param.portId);

		if (param.isService) {
			serviceLineYn = "Y";
			svlnNo = nullToEmpty(param.svlnNo);
			svlnLclCd = nullToEmpty(param.svlnLclCd);
			svlnSclCd = nullToEmpty(param.svlnSclCd);
		} else {
			ntwkLineNo = nullToEmpty(param.ntwkLineNo);
			topoLclCd = nullToEmpty(param.topoLclCd);
			topoSclCd = nullToEmpty(param.topoSclCd);
			topologyType = nullToEmpty(param.topologyType); 
		}

		$('#neId').val(neId);		// ?????????????????
		
		/**
		 * 포트명에 / 가 포함되어있는 경우 OLT장비의 "포트/카드" 의 형태이기 때문에 포트명을 수정해서 보여주고
		 * 카드명을 조회파라메터로 추가한다
		 * 2025-03-26 이재락M
		 */
		portNm = nullToEmpty(param.portNm);
		var portNmIndex = portNm.indexOf("/");
		
		if(portNmIndex > 0) {	// OLT장비 포트인 경우
			portNm = portNm.substr(0, portNmIndex);
			cardNm = portNm.substr(portNmIndex+1);
		}
		
		$('#portNmPop').val(portNm);

		httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpInf/getEqpInfPk',{ "eqpId" : param.neId }, 'GET', 'getEqpInfo');
		//setGridData("init");
		initGrid();
		setEventListener();
	};

	function setGridData(division) {
		var callBackFlag = 'search';
		var nFirstRowIndex = 1;
		var nLastRowIndex = 20;

		if (division == "scrollBottom") {
			nFirstRowIndex = parseInt($("#firstRowIndex").val()) + 20;
    		$("#firstRowIndex").val(nFirstRowIndex);
			nLastRowIndex = parseInt($("#lastRowIndex").val()) + 20;
    		$("#lastRowIndex").val(nLastRowIndex);
			callBackFlag = 'searchPopForPageAdd';
			
			/* 2019-12-18 lastRowIndex가 총 카운트보다 큰 경우에는 마지막 총카운트를 넘겨준다  */
        	if(nLastRowIndex > totalCnt) {
        		nLastRowIndex = totalCnt;
        	}
			
		} else {
			
			$("#firstRowIndex").val(nFirstRowIndex);
			$("#lastRowIndex").val(nLastRowIndex);
			
		}

		var paramData = $('#searchFormPop').getData();
		$.extend(paramData, { 
				  "serviceLineYn" : serviceLineYn
				, "svlnNo" : svlnNo
				, "ntwkLineNo" : ntwkLineNo
				, "topoLclCd" : topoLclCd
				, "topoSclCd" : topoSclCd
				, "sclCd" : svlnSclCd
				, "eqpRoleDivCd" : paramData.popEqpRoleDivCd
				, "fiveGponEqpType" : fiveGponEqpType
				, "portNm" : paramData.portNm
			}
		);
		
		// 마지막 카운트수가 큰 경우에만 검색하도록 수정
		// 마지막 카운트수와 첫 카운트가 같은 경우 검색되지 않는 경유가 발행하여 수정 2023-03-16
		if(nFirstRowIndex <= nLastRowIndex) { 
			
			if (division == "scrollBottom") {
				cflineShowProgress(gridId);
			} else {
				cflineShowProgressBody();
			}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/getPortInfList', paramData, 'GET', callBackFlag);
		}
		
	}

	function initGrid() {
		var columnMapping = getColumnMapping();

		$('#' + gridId).alopexGrid({
			fitTableWidth : true,
			autoColumnIndex : true,
			autoResize : true,
			numberingColumnFromZero : false,
			rowSingleSelect : false,
			rowClickSelect : true,
			fillUndefinedKey : null,
			height : 320,
			columnMapping : columnMapping,
			columnFixUpto : 1,
			message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"
						+ cflineMsgArray['noData']
						+ "</div>"
			}
		});
		
		// LTE, 5G 회선일 경우 물리포트명 표시
		if(serviceLineYn == "Y" && (svlnSclCd == "016" || svlnSclCd == "030")){
			$('#'+gridId).alopexGrid("showCol", "physPortNm");
		}
	}
	
	function portReg(){
  	 $a.popup({
	     	popid: 'PortReg',
	     	title: '포트등록',
	     	iframe: true,
	     	modal : true,
	     	movable:true,
	     	windowpopup : false,
	        url: '/tango-transmission-web/configmgmt/cfline/PortReg.do',
	        data: {
	        	eqpId :  $('#neId').val()
	        	, eqpNm : $('#popEqpNm').val() 
	        	, fromEqpMgmt : "Y"
	        }, 
	        width : 865,
	        height : window.innerHeight * 0.85
	        , callback: function(data) {
//	        	alert(data);
	        	if(data=="OK"){
	        		$('#btnSearchPop').click();
	        	}
	    	}
     });
	}

	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url : Url, // URL 기존 처럼 사용하시면 됩니다.
			data : Param, // data가 존재할 경우 주입
			method : Method, // HTTP Method
			flag : Flag
		}).done(successCallback).fail(failCallback);
	}

	function setEventListener() {
		// 스크롤
		$('#' + gridId).on('scrollBottom', function(e) {
			setGridData("scrollBottom");
		});

		$('#' + gridId).on('click', function(e) {
			var dataObj = $('#' + gridId).alopexGrid("dataGet", {_state : { selected : true }});
			if (dataObj.length > 2) {
				alertBox('I', makeArgMsg('maxChoice', 2, "", "", ""));
				$('#' + gridId).alopexGrid("rowSelect", {_state : { focused : true }}, false);
				
			}
			
			// 5G-PON CRN 장비의 경우 같은 채널의 값을 선택하여 TX/RX처리함
			if (dataObj.length == 1 && isFGCrnNe(dataObj[0]) == true  ) {
				var portChnlNm = nullToEmpty(dataObj[0].portChnlNm);
				if (fiveGponEqpTxRx.length == 0) {
					if (portChnlNm != "") {
						var chkData = $('#' + gridId).alopexGrid("dataGet");
						$('#'+gridId).alopexGrid("rowSelect", {'portChnlNm' :portChnlNm}, true);
					}
					
					var txRx = $('#' + gridId).alopexGrid("dataGet", {_state : { selected : true }});
					for (var data in txRx) {
						fiveGponEqpTxRx.push(data.portId);
					}
				} else {
					if (portChnlNm != "") {
						var chkData = $('#' + gridId).alopexGrid("dataGet");
						$('#'+gridId).alopexGrid("rowSelect", {'portChnlNm' :portChnlNm}, false);
						fiveGponEqpTxRx = [];
					}
				}
			} 
			
		});

		// 닫기
		$('#btnClosePop').on('click', function(e) {
			$a.close();
		});

		// 선택
		$('#btnConfirmPop').on('click', function(e) {
			var dataObj = $('#' + gridId).alopexGrid("dataGet", {_state : { selected : true }});
			dataObj = AlopexGrid.trimData(dataObj);
			
			// FDF장비만 TX,RX선택 가능 → 두개 선택 가능. 
			// ROADM장비(08)만 포트 2개 선택 가능.
			var eqpRoleDivCd = $("#popEqpRoleDivCd").val();
			var fdfEqpYn = false;  // FDF장비여부
			var isFGSmux = false;
			var isFGCrn = false;
			var roadmEqpYn = false;
			if (eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182" || eqpRoleDivCd == "08"
				|| (serviceLineYn == "Y" && svlnSclCd == "101" && (isFGSmuxNe(dataObj[0]) == true || isFGCrnNe(dataObj[0]) == true )) // 2018-11-29  1. [수정] SMUX장비				
			   ) {
				
				if (eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182") {
					fdfEqpYn = true;
				}
				if (eqpRoleDivCd == "08") {
					roadmEqpYn = true;
				}
				if (isFGSmuxNe(dataObj[0]) == true) {
					isFGSmux = true;
				}
				if (isFGCrnNe(dataObj[0]) == true) {
					isFGCrn = true;
				}
			} 
			
			if(fdfEqpYn == false && isFGSmux == false && isFGCrn == false && roadmEqpYn == false) {
				if(dataObj.length > 1) {
					var msg = cflineMsgArray['fdfEqpPortLength'];
					if (serviceLineYn == "Y" && svlnSclCd == "101") {
						msg = "FDF/SMUX/5G-PON 2.0 CRN 장비만 TX/RX포트 등록이 가능합니다.";
					}
					if ((eqpRoleDivCd != "11" && eqpRoleDivCd != "162" && eqpRoleDivCd != "177" && eqpRoleDivCd != "178" && eqpRoleDivCd != "182" && eqpRoleDivCd != "08")
							&& (serviceLineYn != "Y" && svlnSclCd != "101") ) {
						msg = "FDF/ROADM 장비만 2개의 포트 등록이 가능합니다.";
					}
					alertBox('W', msg);   // cflineMsgArray['fdfEqpPortLength']
					return;
				}
			} 
			
			// LTE회선일 경우 물리포트명으로 변경
			if(serviceLineYn == "Y" && (svlnSclCd == "016" || svlnSclCd == "030")){			
				for( var i in dataObj ){
					if(nullToEmpty(dataObj[i].physPortNm) !=""){
						dataObj[i].portDescr = dataObj[i].physPortNm;
						dataObj[i].portNm = dataObj[i].physPortNm;
					}
				}
			}
			
			// S-MUX 일 경우
			// SMUX(CMUX,LMUX)의 경우 PTP타입의 경우에는 LINE포트 설정불가 - 2020-10-19
			// 4GLMUX(56) 2024-11-13 추가
			if((eqpRoleDivCd == "19" || eqpRoleDivCd == "52" || eqpRoleDivCd == "53" || eqpRoleDivCd == "56") && topoSclCd == "035" && topologyType != ""){
				for( var i in dataObj ){
					dataObj[i].isFGSmux = isFGSmux;
					// PTP일 경우
					if(topologyType == "002"){
						//TODO 등록후 변경시에 오류발생 2021-01-04
//						if(dataObj[i].portId == 3 || dataObj[i].portId == 4){
//							msg = "토폴로지 타입이 PTP일 경우 Line포트는 설정할 수 없습니다.";
//							alertBox('W', msg);   
//							return;
//						}
					}
				}
			}
			
			// 5GSmux 장비의 경우
			if (isFGSmux == true) {
				for( var i in dataObj ){
					dataObj[i].isFGSmux = isFGSmux;
				}
			}
			// 5GCrn 장비의 경우
			if (isFGCrn == true) {
				for( var i in dataObj ){
					dataObj[i].isFGCrn = isFGCrn;
				}
			}
			// BC-MUX/CWDM-MUX 장비인 경우
			if ($("#popEqpRoleDivCd").val() == "183" || $("#popEqpRoleDivCd").val() == "184") {
				for( var i in dataObj ){
					if ( nullToEmpty(dataObj[i].portNm).toUpperCase().indexOf('COM') < 0) {
						dataObj[i].isBcCwMux = true;
					}
				}
			}
			
			// 포트 상태에 따른 알림
			/*
			 * 포트상태코드	: 0001 운용, 0002 미사용, 0003 폐기, 0004 고장, null 미진입 
			 * 1. 사용 	: 이미 연결되어 사용중인 포트입니다.(비고 문구) 확인 후 사용 가능.
			 * 2. 미사용	: 알림 없이 사용 가능
			 * 3. 폐기 : 선택 불가능
			 * 4. 고장 : 선택 불가능
			 * 5. 예비상태 : 예비로 구분된 포트 입니다.(비고 문구) 확인 후 사용 가능.
			 * 6. 미진입 	: 선택 불가능
			 * 
			 * 그린 코드
			 * F, Y, B
			 */
			var msg = "";
			var callState = "";
			
			var eqpRoleDivCd = $("#popEqpRoleDivCd").val();
			if(eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182"
				|| eqpRoleDivCd == "08") {
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
						// 폐기
						msg = "폐기 장비는 선택 불가능합니다.";
						callState = "alertBox";
						break;
						
					} else if(dataObj[i].portStatCd == "0004") {
						// 고장
						msg = "고장 장비는 선택 불가능합니다.";
						callState = "alertBox";
						break;
					} else if(dataObj[i].portStatCd == "0005") {
						// 예비상태
						msg = '예비로 구분된 포트 입니다.';
						if(dataObj[i].coreCnntRmk != null) msg += '(' + dataObj[i].coreCnntRmk + ')';
						
						callState = "callMsgBox";
						break;
					} else {
						// 미진입
						msg = "미인입 장비는 선택 불가능합니다.";
						callState = "alertBox";
						break;
					}					
				}				
				
/*				if (dataObj.length == 2) {
					alertBox('I', "Main이 되는 포트를 선택해 주세요.");
					callState = "callMsgBox";
					break;
				}*/
				
				if(callState == "callMsgBox") {
					callMsgBox('','C', msg, function(msgId, msgRst) {
						if(msgRst == 'Y') {
							$a.close(dataObj);
						}
					});
				} else if(callState == "alertBox"){
					alertBox('W', msg);
				} else {
					$a.close(dataObj);
				}
			} else {
				$a.close(dataObj);
			}
		});

		$('#' + gridId).on('dblclick', '.bodycell', function(e) {
			var dataObj = AlopexGrid.parseEvent(e).data;

			var isFGSmux = false;
			if (isFGSmuxNe(dataObj) == true) {
				isFGSmux = true;
			}
			
			// 5GSmux 장비의 경우
			if (isFGSmux == true) {
				dataObj.isFGSmux = isFGSmux;
			}
			
			// 5GCrn 장비의 경우
			var isFGCrn = false;
			if (isFGCrnNe(dataObj) == true) {
				isFGCrn = true;
				dataObj.isFGCrn = isFGCrn;
			}
			
			// BCMUX/CWDM-MUX 장비의 경우
			if ($("#popEqpRoleDivCd").val() == "183" || $("#popEqpRoleDivCd").val() == "184") {
				if ( nullToEmpty(dataObj.portNm).toUpperCase().indexOf('COM') < 0) {
					dataObj.isBcCwMux = true;
				}
			}
						

			if (dataObj._key == "useYn" && dataObj.useYn == "Y") {
				var param = {
					"ntwkLineNo" : ntwkLineNo,
					"svlnNo" : svlnNo,
					"topoLclCd" : topoLclCd,
					"topoSclCd" : topoSclCd,
					"serviceLineYn" : serviceLineYn,
					"neId" : neId,
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
			} else {
				dataObj = AlopexGrid.trimData(dataObj);

				// LTE, 5G 회선일 경우 물리포트명으로 변경				
				if(serviceLineYn == "Y" &&  (svlnSclCd == "016" || svlnSclCd == "030") && nullToEmpty(dataObj.physPortNm) !=""){
					dataObj.portDescr = dataObj.physPortNm;
					dataObj.portNm = dataObj.physPortNm;
				}
				
				var msg = "";
				var callState = "";
				
				var eqpRoleDivCd = $("#popEqpRoleDivCd").val();
				if(eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182")	{
					if(dataObj.coreLockYn == "Y") {
						// 그린코어
						msg = '해당 포트는 GIS상의 그린 코어입니다. 등록하시겠습니까?';
						
						callState = "callMsgBox";
					} else if(dataObj.portStatCd == "0001") {
						// 운용
						msg = '이미 연결되어 사용중인 포트 입니다. 사용하시겠습니까?';
						if(dataObj.coreCnntRmk != null) msg += '(' + dataObj.coreCnntRmk + ')';
						
						callState = "callMsgBox";
					} else if(dataObj.portStatCd == "0002") {
						// 미사용
						callState = "close";
					} else if(dataObj.portStatCd == "0003") {
						// 폐기/고장
						msg = "폐기 장비는 선택 불가능합니다.";
						callState = "alertBox";
					} else if(dataObj.portStatCd == "0004") {
						// 폐기/고장
						msg = "고장 장비는 선택 불가능합니다.";
						callState = "alertBox";
					} else if(dataObj.portStatCd == "0005") {
						// 예비상태
						msg = '예비로 구분된 포트 입니다.';
						if(dataObj.coreCnntRmk != null) msg += '(' + dataObj.coreCnntRmk + ')';
						
						callState = "callMsgBox";
					}else {
						// 미진입
						msg = "미인입 장비는 선택 불가능합니다.";
						callState = "alertBox";
					}
					
					if(callState == "callMsgBox") {
						callMsgBox('','C', msg, function(msgId, msgRst) {
							if(msgRst == 'Y') {
								$a.close([dataObj]);
							}
						});
					} else if(callState == "alertBox"){
						alertBox('W', msg);
					} else {
						$a.close([dataObj]);
					}
				} else {
					$a.close([dataObj]);
				}
			}
		});

		// 조회
		$('#btnSearchPop').on('click', function(e) {
			setGridData("search");
		});

		// 엔터이벤트
		$('#searchFormPop').on('keydown', function(e) {
			if (e.which == 13) {
				$('#btnSearchPop').click();
				return false;
			}
		});
		// 포트등록
		$('#btnPortReg').on('click', function(e) {
			portReg();
		});
		
	};

	function getColumnMapping() {
		
		var column = [
				 { key : 'check', align : 'center', width : '40px', selectorColumn : true }
				// ,{ align:'center', title : cflineMsgArray['sequence'] /*순번*/, width: '50px', numberingColumn: true }
				,{ key : 'portNm', align : 'center', title : cflineMsgArray['portName'] /* 포트명 */, width : '120px' }
				,{ key : 'portCapaNm', align : 'center', title : cflineMsgArray['portCapacity'] /* 포트용량 */, width : '70px' }
				,{ key : 'portAlsNm', align : 'center', title : cflineMsgArray['portAliasName'] /* 포트별칭명 */, width : '110px' }

				,{ key : 'portChnlNm', align : 'center', title : cflineMsgArray['port'] + cflineMsgArray['channelValue'] /*포트 채널값 */
					, width : '80px', hidden : (nullToEmpty(fiveGponEqpType) == "CRN"  ? false : true)
				}
				,{ key : 'portWaveNm', align : 'center', title : cflineMsgArray['port']  + cflineMsgArray['wavelength'] /*포트 파장 */
					, width : '80px', hidden : (nullToEmpty(fiveGponEqpType) == "CRN"  || $("#popEqpRoleDivCd").val() == "183" || $("#popEqpRoleDivCd").val() == "184"  ? false : true)
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
			];

		if (serviceLineYn == "Y") {
			column.push({
				key : 'useYn',
				align : 'center',
				title : cflineMsgArray['useYesOrNo'] /* 사용여부 */,
				width : '65px'
			});
		}

		return column;
	}

	function failCallback(response, status, jqxhr, flag) {
		cflineHideProgressBody();
		if (flag == 'search') {
			// 조회 실패 하였습니다.
			callMsgBox('', 'W', cflineMsgArray['searchFail'], function(msgId, msgRst) {});
		}
	}

	function successCallback(response, status, jqxhr, flag) {
		if (flag == 'search') {
			cflineHideProgressBody();
			$('#' + gridId).alopexGrid('dataSet', response.portInfList);
			$('#' + gridId).alopexGrid('updateOption',{
				paging : {
					pagerTotal : function(paging) {
						totalCnt = response.totalCnt;
						return cflineCommMsgArray['totalCnt']/* 총 건수 */
								+ ' : '
								+ getNumberFormatDis(response.totalCnt);
					}
				}
			});
			
			// 사용네트워크 포트 선택
			if(response.portInfList.length > 0) {
				var dataList = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet"));
				for(var idx = 0; idx < dataList.length; idx++ ) {
					if(portId == dataList[idx].portId) {
						$('#'+gridId).alopexGrid('rowSelect', {_index: {row:idx}}, true);
						$('#'+gridId).alopexGrid('setScroll', {row:idx});
					} 
				}
			}
			
			
		} else if (flag == 'searchPopForPageAdd') {
			cflineHideProgress(gridId);
			if (response.portInfList.length > 0) {
				$('#' + gridId).alopexGrid("dataAdd",
						response.portInfList);
			}
		} else if (flag == "getEqpInfo") {
			if (response != null && response.Result != null) {
				if(response.Result == "NoEqpId"){
					var msg = cflineMsgArray['noEqpId']; 
					alertBox('W', msg);
					return;
				}
			}
			if (response != null && response.eqpInfPk != null) {
				var eqpInfo = response.eqpInfPk[0];
				$("#popEqpNm").val(eqpInfo.eqpNm); // 장비명
				$("#popOrgNm").val(eqpInfo.mtsoNm); // 국사
				$("#popEqpRoleDivNm").val(eqpInfo.eqpRoleDivNm); // 장비타입
				$("#popEqpRoleDivCd").val(eqpInfo.eqpRoleDivCd);// 장비역할 코드
				
				//FDF 장비일때 포트등록 버튼을 보여준다
				if( $("#popEqpRoleDivCd").val() == "11" || $("#popEqpRoleDivCd").val() == "162" 
					|| $("#popEqpRoleDivCd").val() == "177" || $("#popEqpRoleDivCd").val() == "178" || $("#popEqpRoleDivCd").val() == "182") {
					$("#portRegDiv").show()
				} else {
					$("#portRegDiv").hide()
				}
				
				fiveGponEqpType = nullToEmpty(eqpInfo.fiveGponEqpType);
				
				if (nullToEmpty(fiveGponEqpType) == "CRN") {
					$('#'+gridId).alopexGrid('showCol', ['portChnlNm', 'portWaveNm']);
				}
				
				// BC-MUX / CWDM-MUX 인경우 파장컬럼 표시
				if ($("#popEqpRoleDivCd").val() == "183" ||  $("#popEqpRoleDivCd").val() == "184") {
					$('#'+gridId).alopexGrid('showCol', [/*'portChnlNm',*/ 'portWaveNm']);
				}
			} 
			setGridData("init");
		}
	}
	
	//2018-11-29  1. [수정] SMUX장비 - LMUX추가 (20200911), 4G_LMUX추가 (20241113)
	function isFGSmuxNe(chkData) {
		
		if (($("#popEqpRoleDivCd").val() == '19' && nullToEmpty(chkData.eqpMdlNm).indexOf("5G-SMUX") == 0 )
				|| ($("#popEqpRoleDivCd").val() == '52' && nullToEmpty(chkData.eqpMdlNm).indexOf("5G-CMUX") == 0 )
					|| ($("#popEqpRoleDivCd").val() == '53' && nullToEmpty(chkData.eqpMdlNm).indexOf("5G-LMUX") == 0 )
					|| ($("#popEqpRoleDivCd").val() == '56' && nullToEmpty(chkData.eqpMdlNm).indexOf("4G-LMUX") == 0 )
				&& nullToEmpty(chkData.eqpRglaExprVal) !='') {
			return true;
		}
		
		return false;
	}

	//2019-02-18  2. [수정] 5G-PON 2.0 CRN장비
	function isFGCrnNe(chkData) {
		
		if (nullToEmpty(fiveGponEqpType) == 'CRN') {
			return true;
		}
		
		return false;
	}
});