/**
 * NetworkPathReserveList.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 *  
 * 
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2019-01-15  2. 5G-PON고도화  5G-PON RU에 주선번이 있는 경우 주선번의 사용링의 역방향으로 예비회선 자동선번생성 처리해주기 위해 예비선번은 편집불가 처리함
 * 2019-12-10  3. MUX링인 경우 토폴로지구성방식이 RING인 경우 예비선번구현 가능하도록 기능 추가
 */

var reserveGrid = "reservePathList";
 
$a.page(function() {
	this.init = function(id, param) {
		// 예비 선번 보기
		$('#btnReservePath').on('click', function(e){
			$(document.body).attr('class', 'win_popup');
			$("#reservePathList").show();
			$("#reserveBtn").show();
			$("#reserveLabel").show();
			
			var exceptFdfNe = "N";
			if($('#exceptFdfNe').is(':checked')) {
				exceptFdfNe = "Y";
			} 
			
			if($('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
				var mainPath = tempDataTrim(detailGridId);
				$("#reserveBtnPathDelete").show();
				
				// 2019-01-15  2. 5G-PON고도화 5G-PON RU 예비선번 편집불가
				// SMUX 예비선번 체크 사항 1. 토폴로지구성방식이 RING이 아닐경우 ?
				if (isFiveGponRuCoreOld() == true) {
					initGridNetworkPath(reserveGrid);
					reserveNetworkPath(false, exceptFdfNe);	
					$('#reserveBtnPathDelete').hide();
				} else if(isRuCoreLineOld() == true && checkSmuxAndTopoCfgMeansRing(mainPath)) {
					initGridNetworkPath(reserveGrid);
					reserveNetworkPath(false, exceptFdfNe);	
					$('#reserveBtnPathDelete').hide();
				//SMUX링인 경우 토폴로지구성방식이 RING인 경우 예비선번구현 가능 - 2020-06-08
				} else if(isRuCoreLineOld() == false && checkSmuxAndTopoCfgMeansRing(mainPath)) {
					initGridNetworkPath(reserveGrid);
					reserveNetworkPath(false, exceptFdfNe);	
					$('#reserveBtnPathDelete').hide();	
				} else {
					reserveNetworkPath(true, exceptFdfNe);
				}
			} else {
				initGridNetworkPath(reserveGrid);
				reserveNetworkPath(false, exceptFdfNe);
			}
			
			if($('#'+reserveGrid).alopexGrid("dataGet").length > 0 && isFiveGponRuCoreOld() == false) {
				$("#btnReservePathChange").show();
			}
			
			// RU회선-광코어
			if (isRuCoreLineOld() == true) {
				$('#'+reserveGrid).alopexGrid('showCol', ['SERVICE_NM']);
			}
			
			var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
			if (isAbleViaRing(chkTopoSclCd) == true) {
				$('#'+reserveGrid).alopexGrid('showCol', ['CASCADING_RING_NM']);
			}

			if($('#'+reserveGrid).alopexGrid("dataGet").length > 0 && isRuCoreLineOld() == false && checkSmuxAndTopoCfgMeansRing(mainPath) == true ) {
				if(searchCmuxRing(mainPath) == true && searchExt(mainPath) == true) {
					$("#btnReservePathChange").show();
				}	
			}
				
	    });
		
		
		// 예비선번으로 변경
		$('#btnReservePathChange').on('click', function(e){
			if($(document.body).attr('class') == 'win_popup') {
				var networkPathList = AlopexGrid.trimData($('#'+detailGridId).alopexGrid('dataGet'));
				var reservePathList = AlopexGrid.trimData($('#'+reserveGrid).alopexGrid('dataGet'));
				
				$('#'+detailGridId).alopexGrid('dataSet', reservePathList);
				$('#'+reserveGrid).alopexGrid('dataSet', networkPathList);

				$("#"+detailGridId).alopexGrid("startEdit");
				
				var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
				if (isAbleViaRing(chkTopoSclCd) == false) {
					$("#"+reserveGrid).alopexGrid("startEdit");
				}
				
				/* 2018-09-12  3. RU고도화 */ 
				modifyMainPath = true;
				
			} 
		});
		
		// 닫기
		$('#reserveBtnClose').on('click', function(e){
			$("#reservePathList").hide();
			$("#reserveBtn").hide();
			$("#reserveLabel").hide();
			$("#btnReservePathChange").hide();
			$(document.body).attr('class', 'win_popup Overflow-hid');
			
			$('#'+reserveGrid).removeAlopexGrid();
		});
	}
});


/**
 * 편집버튼 클릭
 * 1. 편집 모드이면
 * 2. 편집 모드가 아니면
 */
function btnRegEqpClick() {
//	initGridNetworkPath(reserveGrid);
	initGridNetworkPathEdit(reserveGrid);
//	addRowNullData(reserveGrid);
	setEqpEventListener(reserveGrid);
	$("#reserveBtnPathDelete").show();
	
	if($('#'+reserveGrid).css("display") != "none" && isFiveGponRuCoreOld() == false) {
		$("#btnReservePathChange").show();
	}

//	$("#"+reserveGrid).alopexGrid("startEdit");
//	$('#'+reserveGrid).alopexGrid("viewUpdate");
}

var httpRequestReserveNetworkPath = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url,			//URL 기존 처럼 사용하시면 됩니다.
		data : Param,		//data가 존재할 경우 주입
		method : Method,	//HTTP Method
		flag : Flag
	}).done(successReserveCallback)
	  .fail(failReserveCallback);
}

function successReserveCallback(response, status, jqxhr, flag){
	cflineHideProgressBody();
	if(flag == "reserveNetworkPathAfter") {
		initGridNetworkPathEdit(reserveGrid);
		if(response.data != undefined) {
			reservePathSameNo = response.data.PATH_SAME_NO;
			$('#'+reserveGrid).alopexGrid('dataSet', response.data.LINKS);
		} else {
			$('#'+reserveGrid).alopexGrid('dataEmpty');
		} 
		
		//initGridNetworkPathEdit(reserveGrid);
		setEqpEventListener(reserveGrid);
		
		var lastRowIndex = $('#'+reserveGrid).alopexGrid("dataGet").length;
		var lastData = $('#'+reserveGrid).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
		if(lastData == null 
				|| ( (lastData.LEFT_NE_ID != null || lastData.LEFT_NE_NM != null) 
    					|| (lastData.RIGHT_NE_ID != null || lastData.RIGHT_NE_NM != null )) ) {
			addRowNullData(reserveGrid);
			$("#"+reserveGrid).alopexGrid("startEdit");
		}
		
	} else {
		if(response.data != undefined) {
			reservePathSameNo = response.data.PATH_SAME_NO;
			$('#'+reserveGrid).alopexGrid('dataSet', response.data.LINKS);
		} else {
			$('#'+reserveGrid).alopexGrid('dataEmpty');
		}
	}
	
	if($("#mgmtGrpCd").val() == "0001") {
		$('#'+reserveGrid).alopexGrid('hideCol', ['TRUNK_NM', 'WDM_TRUNK_NM']);
	}
	
	// 선번 조회한 경우
	if (flag == "reserveNetworkPathAfter" || flag == "reserveNetworkPath") {
		// 2019-09-30  8. 기간망 링 선번 고도화 모든 경유링 보기 버튼이 보이는지 체크 후 
		if ($('#cascadingRingDisplayCheckbox').is(':visible') == true) {
			// 예비선번일 경우 예비선번 그리드
			if( wkSprYn ) {
				var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
				if($('#cascadingRingDisplay').is(':checked')) {
					if (isAbleViaRing(chkTopoSclCd) == true) {
						$('#'+reserveGrid).alopexGrid('showCol', ['CASCADING_RING_NM_2']);
					} else {
						$('#'+reserveGrid).alopexGrid('showCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
					}
				} else {
					if (isAbleViaRing(chkTopoSclCd) == true) {
						$('#'+reserveGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_2']);
					} else {
						$('#'+reserveGrid).alopexGrid('hideCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
					}
					
				}
				$('#'+reserveGrid).alopexGrid("updateOption", { fitTableWidth: true });
				$('#'+reserveGrid).alopexGrid("viewUpdate");
			}
		}
		
		if ($('#rontTrunkDisplayCheckbox').is(':visible') == true) {
			// 예비선번일 경우 예비선번 그리드
			if( wkSprYn ) {
				if($('#rontTrunkDisplay').is(':checked')) {
					$('#'+reserveGrid).alopexGrid('showCol', ['RONT_TRK_NM']);
				} else {
					$('#'+reserveGrid).alopexGrid('hideCol', ['RONT_TRK_NM']);
				}
				$('#'+reserveGrid).alopexGrid("updateOption", { fitTableWidth: true });
				$('#'+reserveGrid).alopexGrid("viewUpdate");
			}
		}
	}
};

function failReserveCallback(response, status, jqxhr, flag) {
	//  1. [수정] RU광코어 링/예비선번 사용
	// 편집상태에서 예비선번 조회 실패시  reserveGrid 그리드 초기화
	if(flag == "reserveNetworkPathAfter") {
		initGridNetworkPathEdit(reserveGrid);
	}
}

function reserveNetworkPath(editYn, exceptFdfNe) {
	cflineShowProgressBody();
	if(exceptFdfNe == null || exceptFdfNe == undefined || exceptFdfNe == "") exceptFdfNe = "N";

	// 1. [수정] RU광코어 링/예비선번 사용
	var params = {"ntwkLineNo" : baseNtwkLineNo, "utrdMgmtNo" : utrdMgmtNo, wkSprDivCd: "02", autoClctYn: "N", exceptFdfNe : exceptFdfNe};
	
	if (gridDivision == "serviceLine") {
		//console.log(gridDivision);
		
		// 
		if (isFiveGponRuCoreOld() == true) {
			editYn= false;
		}
		if(editYn) {
			httpRequestReserveNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'reserveNetworkPathAfter');
		} else {
			httpRequestReserveNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'reserveNetworkPath');
		}
	} else {
		if(editYn) {
			httpRequestReserveNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'reserveNetworkPathAfter');
		} else {
			httpRequestReserveNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'reserveNetworkPath');
		}
	}
}

function reservePathClick(gubun, data){
	if (gubun == "data"){ 
		$(document.body).attr('class', 'win_popup');
		$("#reservePathList").show();
		$("#reserveBtn").show();
		$("#reserveLabel").show();
		
		if($('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
			$("#reserveBtnPathDelete").show();
			initGridNetworkPath(reserveGrid);
			initGridNetworkPathEdit(reserveGrid);
			$('#'+reserveGrid).alopexGrid('dataEmpty');
			$('#'+reserveGrid).alopexGrid('dataSet', data);
			addRowNullData(reserveGrid);
			$('#'+reserveGrid).alopexGrid('startEdit');
		} else {
			initGridNetworkPath(reserveGrid);
			reserveNetworkPath(false);
		}		
	}else{
		$(document.body).attr('class', 'win_popup');
		$("#reservePathList").show();
		$("#reserveBtn").show();
		$("#reserveLabel").show();
		
		if($('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
			$("#reserveBtnPathDelete").show();
			initGridNetworkPath(reserveGrid);
			initGridNetworkPathEdit(reserveGrid);
			$('#'+reserveGrid).alopexGrid('dataEmpty');
			addRowNullData(reserveGrid);
			$('#'+reserveGrid).alopexGrid('startEdit');
		} else {
			initGridNetworkPath(reserveGrid);
			reserveNetworkPath(false);
		}		
	}
}
