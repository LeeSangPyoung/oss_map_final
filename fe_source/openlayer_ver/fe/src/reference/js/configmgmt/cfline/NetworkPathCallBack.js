/**
 * NetworkPathCallBack.js
 *
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 * 
 ************* 수정이력 ************
 * 2018-03-05  1. [수정] RU광코어 링/예비선번 사용
 * 2018-04-26  2. [수정]가입자망인 경우 선번그룹번호 전송
 * 2018-12-04  3. [수정]SMUX링/서비스회선 고도화 selectSvlnLinePath/selectSmuxRingPathInfo/autoProcSmuxRingToSvlnNo/updateSmuxRingNameByCotNm 추가함
 * 				  selectSvlnLinePath : SMUX링에서 기설서비스회선 정보취득하여 FDF~FDF정보셋팅
 * 				  selectSmuxRingPathInfo : SMUX관련 RU에서 기설/신설 링 정보취득하여 사용링 정보셋팅
 * 				  autoProcSmuxRingToSvlnNo : SMUX링에서 선번이 정상적으로 등록된 경우 행당 링을 기설 서비스회선에서 사용링 선번으로 구현하여 선번 교체
 * 				  updateSmuxRingNameByCotNm : SMUX링에서 COT장비가 첫 구간으로 설정된 경우 링명에 해당 장비의 번호가 없으면 링명을 업데이트 처리해줌
 * 2018-09-12  4. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리, RX포트 E2E적용
 * 2018-12-28  5. RU고도화  망구성방식코드 체크하여 기본정보테이블에 설정함 setRuNetCfgMeans(Common.js에 존재)
 * 2019-01-08  6. 5G-PON고도화  5G-PON링에 COT장비가 설정된 경우 링명에 해당 장비의 번호가 없으면 링명을 업데이트 처리해줌 updateFiveGRingNameByCotNm(Common.js에 존재)
 * 2019-01-15  7. 5G-PON고도화  5G-PON RU에 주선번이 있는 경우 주선번의 사용링의 역방향으로 예비회선 자동선번생성 처리해줌 autoProcSprPathOfFgPonSvlnLine
 *                              5G-PON RU의 주선번에서 CRN정보바탕으로 사용링 검색 자동적용하도록 ETE적용기능 개선 selectEteInfWithEqpList
 *                              5G-PON RU중 장비ENG 에서 설정한 CRN 파장기준 장비모델 추출-> 해당 모델을 사용하는 서비스회선 N000017998107선번복제  copySvlnPathInfoByCrn
 * 2019-09-30  8. 기간망 링 선번 고도화 : openUseRingRontTrunkSearchPop로 링/기간망 트렁크 조회하여 링에서 경유링을 설정 할 수 있게 처리함
 * 2020-04-16  9. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 * 2020-06-01  10. 경유링을 쓰는 SMUX링의 경우 확장형이면 PTP형식이어도 예비선번이 보이도록 기능추가
 * 2020-06-10  11. 예비선번 구현 : 서비스회선 저장시 추가된 CMUX링이 이원화된 링이면서 확장형인 경우 예비선번 구현
 *                           : Cascade한 링이 CMUX이원화로 구성되어있는 SMUX링인 경우 저장시에 예비선번도 구성해서 저장함
 * 2020-08-03  12. 가입자망링 경유링 사용 
 *                경유링은 1차 까지만 참조가능                
 *                경유링으로 사용가능한 종류 : BC-MUX링, CWDM-MUX링
 *                가입자망의 경유링 사용으로 가입자망의 주선번의 선번그룹일련번호도 같이 넘겨서 자동수정 대상중 수동수정처리, 자동수정대상목록 추출 하도록 처리(extractAcceptNtwkLine)
 * 2021-03-08  13. 1건인 경우 그대로 셋팅 - setOtlInfoToGrid, 다건인 경우 팝업Open (openOltEpqListPop)
 * 2024-03-20  14. SKB 가입자망링의 경우 편집에서 그룹이동시 해당그룹선번이 조회되지 않는 현상이 있어 개선 - 가입자망의 경우 별도 'EG' Flag값을 전달한다  
 * 2024-09-11  15. [수정] ADAMS관련 편집불가였던 내용에 대해 원복 - 모든링에 대해 관리주체제한없이 편집가능       
 * 2024-10-30  16. RU광코어의 경우 마지막 East장비(DUL) 등록여부 확인한다.   
 *         
 */


/* 구선번 편집창에서 저장시 flag 정리
 * 주선번만 존재하는 회선인경우 : saveLinePath(서비스회선) / saveNetworkPath(네트워크회선) 
 *                     / saveNetworkPathSelectChangeAfter(가입자망링 선번선택 셀렉트 박스의 값을 변경하여 저장)/saveNetworkPathLineInsertAfter(가입자망링에선 신규선번 버튼을 클릭하여 기존선번 저장시)
 * 주선번/예비선번이 존재하는 회선인 경우 : saveReserveLinePath(서비스회선 주선번 저장) -> saveLinePath(서비스회선 예비선번 저장) 
 *                           saveReserveNetworkPath(네트워크회선 주선번 저장) -> saveNetworkPath(네트워크회선 예비선번 저장)
 *                                          
 */
$a.page(function() {
	this.init = function(id, param) {
		
	}
});

/*
 * FDF의 ETE 정보를 선번에 셋팅
 * 
 * addDataList : 셋팅할 정보
 * currGridId : 셋팅할 그리드
 * rowIndex : 셋팅 행
 * eqpPosition : L : LEFT에 셋팅, R : RIGHT에 셋팅, T : 둘다
 * chRxPortYn : RX포트 존재여부 
 * */
function setPathOfEteInfoOfFdf(addDataList, currGridId, rowIndex, eqpPosition, chRxPortYn) {

	
	// 2018-09-12  3. RU고도화 RX 포트명
	var LEFT_PORT_DESCR = addDataList.lftPortNm;  //좌포트명
	var RIGHT_PORT_DESCR = addDataList.rghtPortNm;  // 우포트명
	
	// 건별 RX포트명 편집을 위해
	var chkRxPortDescr = false;
	 
	// rx포트
	if (chRxPortYn == true) {
		if (nullToEmpty(addDataList.lftPortId) != "" && addDataList.lftRxPortId != "" 
			&& nullToEmpty(addDataList.lftPortId) != addDataList.lftRxPortId) {
			LEFT_PORT_DESCR = makeTxRxPortDescr(addDataList.lftPortNm, addDataList.lftRxPortNm);
			chkRxPortDescr = true;
		} 
		if (nullToEmpty(addDataList.rghtPortId) != "" && addDataList.rghtRxPortId != "" 
			&& nullToEmpty(addDataList.rghtPortId) != addDataList.rghtRxPortId) {
			RIGHT_PORT_DESCR = makeTxRxPortDescr(addDataList.rghtPortNm, addDataList.rghtRxPortNm);
			chkRxPortDescr = true;
		}
	}
	addDataList.chkRxPortDescr = chkRxPortDescr;
	addDataList.LEFT_PORT_DESCR = LEFT_PORT_DESCR;
	addDataList.RIGHT_PORT_DESCR = RIGHT_PORT_DESCR;
	
	if (eqpPosition != "L") {
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtEqpId, {_index : { row : rowIndex}}, "RIGHT_NE_ID");		
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtEqpNm, {_index : { row : rowIndex}}, "RIGHT_NE_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtPortId, {_index : { row : rowIndex}}, "RIGHT_PORT_ID");
		
		// RX포트의 작업을 위해
		//$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtPortNm, {_index : { row : rowIndex}}, "RIGHT_PORT_DESCR");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.RIGHT_PORT_DESCR, {_index : { row : rowIndex}}, "RIGHT_PORT_DESCR");
		
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtPortNm, {_index : { row : rowIndex}}, "RIGHT_PORT_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtTopMtsoId, {_index : { row : rowIndex}}, "RIGHT_ORG_ID");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtTopMtsoNm, {_index : { row : rowIndex}}, "RIGHT_ORG_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtEqpRoleDivCd, {_index : { row : rowIndex}}, "RIGHT_NE_ROLE_CD");
		
		// RX포트정보 셋팅.
		if (addDataList.chkRxPortDescr == true) {
			$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtRxEqpId, {_index : { row : rowIndex}}, "RIGHT_RX_NE_ID");		
			$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtRxEqpNm, {_index : { row : rowIndex}}, "RIGHT_RX_NE_NM");
			$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtRxPortId, {_index : { row : rowIndex}}, "RIGHT_RX_PORT_ID");
		}

		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtModelId, {_index : { row : rowIndex}}, "RIGHT_MODEL_ID");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtModelNm, {_index : { row : rowIndex}}, "RIGHT_MODEL_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtCardModelNm, {_index : { row : rowIndex}}, "RIGHT_CARD_MODEL_NM");

		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.rghtNeRoleNm, {_index : { row : rowIndex}}, "RIGHT_NE_ROLE_NM");
		
		 $('#'+currGridId).alopexGrid('refreshCell', {_index: {id: rowIndex}}, 'RIGHT_FIVE_GPON_EQP_TYPE');        
	}
	
	if (eqpPosition != "R") {
		// 마지막 구간은 무조건 왼쪽만
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftEqpId, {_index : { row : rowIndex}}, "LEFT_NE_ID");		
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftEqpNm, {_index : { row : rowIndex}}, "LEFT_NE_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftPortId, {_index : { row : rowIndex}}, "LEFT_PORT_ID");

		// RX포트의 작업을 위해
		//$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftPortNm, {_index : { row : rowIndex}}, "LEFT_PORT_DESCR");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.LEFT_PORT_DESCR, {_index : { row : rowIndex}}, "LEFT_PORT_DESCR");
		
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftPortNm, {_index : { row : rowIndex}}, "LEFT_PORT_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftTopMtsoId, {_index : { row : rowIndex}}, "LEFT_ORG_ID");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftTopMtsoNm, {_index : { row : rowIndex}}, "LEFT_ORG_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftEqpRoleDivCd, {_index : { row : rowIndex}}, "LEFT_NE_ROLE_CD");							

		// RX포트정보 셋팅.
		if (addDataList.chkRxPortDescr == true) {
			$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftRxEqpId, {_index : { row : rowIndex}}, "LEFT_RX_NE_ID");		
			$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftRxEqpNm, {_index : { row : rowIndex}}, "LEFT_RX_NE_NM");
			$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftRxPortId, {_index : { row : rowIndex}}, "LEFT_RX_PORT_ID");
		}

		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftModelId, {_index : { row : rowIndex}}, "LEFT_MODEL_ID");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftModelNm, {_index : { row : rowIndex}}, "LEFT_MODEL_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftCardModelNm, {_index : { row : rowIndex}}, "LEFT_CARD_MODEL_NM");
		$('#'+currGridId).alopexGrid( "cellEdit", addDataList.lftNeRoleNm, {_index : { row : rowIndex}}, "LEFT_NE_ROLE_NM");

		$('#'+currGridId).alopexGrid('refreshCell', {_index: {id: rowIndex}}, 'LEFT_FIVE_GPON_EQP_TYPE');  
	}
	
	/* 2018-09-12  3. RU고도화 */ 
	setChangedMainPath(currGridId);
}

/* ETE 정보가 없는 경우 입력한 FDF정보를 EAST-WEST구조로 셋팅*/
function noDataOfEte(response, currGridId) {
	// 데이터가 아예 없을 경우
	// 좌장비 입력일 때 윗구간 선번 생성
	var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	if(response.eqpSctnRghtInf[0].generateLeft) {
		var prevRowData = "";
		if(rowIndex > 0) {
			prevRowData = $('#'+currGridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
		} 
		
		var setIndex = 0;
		if(rowIndex == 0 || nullToEmpty(prevRowData.RIGHT_NE_ID) != "" ) {
			if(focusData.LEFT_NE_ID == nullToEmpty(prevRowData.RIGHT_NE_ID)) {
				setIndex = rowIndex -1;
			} else {
				var addData = {};
				$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
				$("#"+currGridId).alopexGrid("startEdit");
				if(rowIndex == 0) setIndex = 0;
				else setIndex = rowIndex;
			}
		} else if(focusData.LEFT_NE_ID == prevRowData.RIGHT_NE_ID) {
			setIndex = rowIndex -1;
		} else {
			setIndex = rowIndex -1;
		}
		
		for(var key in focusData) {
			if(key.indexOf("LEFT") == 0) {
				var length = key.length;
				$('#'+currGridId).alopexGrid( "cellEdit", eval("focusData." + key), {_index : { row : setIndex}}, "RIGHT" + key.substring(4, length));
			}
		}
	} else {
		// 우장비 입력일 때 아래 구간 선번 생성
		var nextRowData = "";
		if(rowIndex > 0) {
			nextRowData = $('#'+currGridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
		} 
		
		var setIndex = 0;
		if(rowIndex == 0 || nullToEmpty(nextRowData.LEFT_NE_ID != "") ) {
			if(focusData.RIGHT_NE_ID == nullToEmpty(nextRowData.LEFT_NE_ID)) {
				setIndex = rowIndex +1;
			} else {
				var addData = {};
				$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
				$("#"+currGridId).alopexGrid("startEdit");
				setIndex = rowIndex +1;
//				if(rowIndex == 0) setIndex = 0;
//				else setIndex = rowIndex;
			}
		} else if(focusData.RIGHT_NE_ID == nextRowData.LEFT_NE_ID) {
			setIndex = rowIndex +1;
		} else {
			setIndex = rowIndex +1;
		}
		
		for(var key in focusData) {
			if(key.indexOf("RIGHT") == 0) {
				var length = key.length;
				$('#'+currGridId).alopexGrid( "cellEdit", eval("focusData." + key), {_index : { row : setIndex}}, "LEFT" + key.substring(5, length));
			}
		}
	}
	
	return rowIndex;
}

/* ETE 정보를 셋팅
 * response ETE결과
 * */
function setEteInfoToGrid(response, currGridId) {
	var rowIndex = -1;
	// 장비구간의 우장비 정보 조회
	if(response.eqpSctnRghtInf != undefined) {
		var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
		rowIndex = focusData._index.row;  //2
		
		if(nullToEmpty(response.autoFlg) != "") {
			if(nullToEmpty(response.rowIndex) != "") {
				focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_index : { data:response.rowIndex}}, {_state : {focused : true}})[0]);
				rowIndex = response.rowIndex;
			}
		}
		
		var addDataList = [];
		
		if(response.eqpSctnRghtInf.length > 1) {
			// 2018-09-12  3. RU고도화 전체목록중 RX포트존재여부
			var chRxPortYn = false;
			
			for(var i = 0; i < response.eqpSctnRghtInf.length; i++) {
				var addData = {};
				for(var key in response.eqpSctnRghtInf[i]) {
					eval("addData." + key + " = response.eqpSctnRghtInf[i]." + key);
					
					if (nullToEmpty(response.eqpSctnRghtInf[i].lftRxPortId) != "" || nullToEmpty(response.eqpSctnRghtInf[i].rghtRxPortId) != "") {
						chRxPortYn = true;
					}
				}
				addDataList.push(addData);
			}
			
			// EAST 장비에서 ETE를 날린경우
			if(!addDataList[0].generateLeft) {
				// 우장비부터 시작
				for(var i = 0; i < addDataList.length; i++) {
					if(i == 0) {
						// ETE 정보 셋팅
						setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "R", chRxPortYn);
					} else if(i == addDataList.length-1) {
						// ETE 정보 셋팅
						setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "L", chRxPortYn);
					} else {
						// 그 외는 다
						var addData = {};
						$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+i}});

						// ETE 정보 셋팅
						setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "T", chRxPortYn);
					}
					setLinkDataNull(rowIndex+i, currGridId);
				}
			} 
			// WEST 장비에서 ETE를 날린 경우
			else {
				// 좌장비부터 시작 
				var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
				if(nullToEmpty(response.autoFlg) != "") {
					focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_index : { data:rowIndex}}, {_state : {focused : true}})[0]);
				}
				
				var rightDataList = AlopexGrid.trimData(focusData);
				var keyParam = "RIGHT";
				var addData = {};
				for(var key in rightDataList) {
    				if(key.indexOf(keyParam) == 0) {
						eval("addData." + key + " = rightDataList." + key);
    				} else {
    					eval("addData." + key + " = null");
    				}
				}
				
				// 데이터 정합성 확인 후 맞지 않을 경우 선택 장비만 copy. 현재 좌장비와 가져온 데이터 마지막구간의 좌장비가 동일한지 확인.
				var prevRowData = "";
				if(rowIndex > 0) {
					prevRowData = $('#'+currGridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
				} 
				// ETE적용시작 WEST장비ID와 ETE결과 마지막 구간의 WEST장비가 다른경우 ETE결과가 부정확 한 거임.
				if(focusData.LEFT_NE_ID != addDataList[addDataList.length-1].lftEqpId) {
					var setIndex = 0;
					if(rowIndex == 0 || nullToEmpty(prevRowData.RIGHT_NE_ID != "") ) {
						if(focusData.LEFT_NE_ID == nullToEmpty(prevRowData.RIGHT_NE_ID)) {
							setIndex = rowIndex -1;
						} else {
							var addData = {};
							$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex}});
							$("#"+currGridId).alopexGrid("startEdit");
							if(rowIndex == 0) setIndex = 0;
							else setIndex = rowIndex;
						}
					} else if(focusData.LEFT_NE_ID == prevRowData.RIGHT_NE_ID) {
						setIndex = rowIndex -1;
					} else {
						setIndex = rowIndex -1;
					}
					
					for(var key in focusData) {
						if(key.indexOf("LEFT") == 0) {
							var length = key.length;
							$('#'+currGridId).alopexGrid( "cellEdit", eval("focusData." + key), {_index : { row : setIndex}}, "RIGHT" + key.substring(4, length));
						}
					}
				}
				// ETE적용시작 WEST장비ID와 ETE결과 마지막 구간의 WEST장비가 같은경우 ETE결과가 정확 한 거임.
				else {
					// 아닐 경우 조회해온 장비 insert
					for(var i = 0; i < addDataList.length; i++) {	
						if(i == 0) {

							// ETE 정보 셋팅
							setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "T", chRxPortYn);
						} else if(i == addDataList.length-1) {
							$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+i}});
							// ETE 정보 셋팅
							setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "L", chRxPortYn);
						} else {
							var addEmptyData = {};
							$("#"+currGridId).alopexGrid('dataAdd', addEmptyData, {_index:{row:rowIndex+i}});

							// ETE 정보 셋팅
							setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "T", chRxPortYn);
						}
						setLinkDataNull(rowIndex+i, currGridId);
					}
					
					if(rowIndex > 0) {
						if(prevRowData.RIGHT_NE_ID == addDataList[addDataList.length-1].lftEqpId) {
							// 동일 장비이면 병합 
							for(var key in prevRowData) {
								if(key.indexOf("LEFT") == 0) {
									$('#'+currGridId).alopexGrid( "cellEdit", eval("prevRowData."+key), {_index : { row : rowIndex}}, key);
								}
							}
							$('#'+currGridId).alopexGrid("dataDelete", {_index : { data:rowIndex-1 }});
							
						}
					}
				}
			}
		} 
		// ETE정보가 없는경우
		else {
			rowIndex = noDataOfEte(response, currGridId);				
		}
		 
		$("#"+currGridId).alopexGrid("startEdit");	

		// row 추가
		var lastRowIndex = $('#'+currGridId).alopexGrid("dataGet").length;
		var lastData = $('#'+currGridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
		
		if((lastData.SERVICE_ID != null || // 2018-09-12  3. RU고도화
				lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
			|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
			|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
			addRowNullData(currGridId);
			$("#"+currGridId).alopexGrid("startEdit");
		}
		
    	/* 2018-09-12  3. RU고도화 */ 
    	setChangedMainPath(currGridId);
	}
	cflineHideProgressBody();
	return rowIndex;
}


/* 
 * OTL장비 정보를 셋팅
 * 
 */
function setOtlInfoToGrid(response, currGridId) {
	
	var result = false;
	// 장비구간의 우장비 정보 조회
	if(response.otlEqpIdInf != undefined) {
		
		$('#'+currGridId).alopexGrid("focusCell", {_index : {data : 0}}, 'RIGHT_NE_NM' );
		var focusData = $('#'+detailGridId).alopexGrid("dataGet", {_state : {focused : true}}[0]);
		var rowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData[0]._index.row); //- 0
		var dataRowIndex = (focusData == null || focusData.length == 0 ? 0 : focusData.length);
		var dataList = AlopexGrid.trimData(focusData)[rowIndex];
		
		// 장비구간의 우장비 정보 조회
		var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
		rowIndex = focusData._index.row; 
		
		var addDataList = [];
		
		if(response.otlEqpIdInf.length > 1) {
			
			var chRxPortYn = false;
			
			for(var i = 0; i < response.otlEqpIdInf.length; i++) {
				var addData = {};
				for(var key in response.otlEqpIdInf[i]) {
					eval("addData." + key + " = response.otlEqpIdInf[i]." + key);
					
					if (nullToEmpty(response.otlEqpIdInf[i].lftRxPortId) != "" || nullToEmpty(response.otlEqpIdInf[i].rghtRxPortId) != "") {
						chRxPortYn = true;
					}
				}
				addDataList.push(addData);
			}

			sectionSeparation2(currGridId);
			for(var i = 0; i < addDataList.length; i++) {
				if(i == 0) {
					// OLT장비 정보 셋팅
					setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "R", chRxPortYn);
				} else if(i == addDataList.length-1) {
					// OLT장비 정보 셋팅
					setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "L", chRxPortYn);
				} else {
					// 그 외는 다
					var addData = {};
					$("#"+currGridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+i}});

					// OLT장비 정보 셋팅
					setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "T", chRxPortYn);
				}
				setLinkDataNull(rowIndex+i, currGridId);
				result = true;
			}
		} 
		 
		$("#"+currGridId).alopexGrid("startEdit");	

		// row 추가
		var lastRowIndex = $('#'+currGridId).alopexGrid("dataGet").length;
		var lastData = $('#'+currGridId).alopexGrid("dataGetByIndex", {row : lastRowIndex -1});
		
		if((lastData.SERVICE_ID != null ||
				lastData.TRUNK_ID != null || lastData.RING_ID != null || lastData.WDM_TRUNK_ID != null)
			|| (lastData.LEFT_NE_ID != null && lastData.LEFT_NE_NM != null) 
			|| (lastData.RIGHT_NE_ID != null && lastData.RIGHT_NE_NM != null )) {
			addRowNullData(currGridId);
			$("#"+currGridId).alopexGrid("startEdit");
		}
	}
	cflineHideProgressBody();
	return result;
}

function networkPathCallBack(response, status, jqxhr, flag) {
	/*
	if(flag == "testInfo"){
		console.log(response);
		alertBox('W', response.msg);
	}
	*/
	// 일반 ETE
	if(flag.indexOf("selectEqpSctnRghtInf") == 0) {
		// ETE 셋팅관련 기능 function처리

		var currGridId = flag.replace("selectEqpSctnRghtInf", "");
		setEteInfoToGrid(response, currGridId);
		if (nullToEmpty(response.eqpSctnRghtInf) != "" && response.eqpSctnRghtInf.length > 0 && nullToEmpty(response.eqpSctnRghtInf[0].errMsg) != "") {  
			alertBox('W', response.eqpSctnRghtInf[0].errMsg);
			return;
		}
	}
	/*
	 * 1. [수정] RU광코어 링/예비선번 사용
	 */
	else if(flag == "saveReserveNetworkPath" || flag == "saveReserveLinePath") {
		// WDM 트렁크 예비 선번포함
		if(response.PATH_RESULT) {
			var userId = $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val();
			
			var data = tempDataTrim(reserveGrid);
			var reserveParams = {
					"ntwkLineNo" : baseNtwkLineNo,
					"wkSprDivCd" : "02",
					"autoClctYn" : "N",
					"linePathYn" : "N",
					"userId" : userId,
					"utrdMgmtNo" : utrdMgmtNo,
					"links" : JSON.stringify(data)
			};
			$.extend(reserveParams,{"ntwkLnoGrpSrno": reservePathSameNo});
			
			// 1. [수정] RU광코어 링/예비선번 사용
			if(gridDivision == "serviceLine") {
				
				// 2019-01-15  7. 5G-PON고도화 - 5G-PON RU회선인 경우 주선번이 존재 하고 주선번이 변경된 경우 경우 예비선번은 자동생성한다. 
				var mainPath = tempDataTrim(detailGridId);
				
				if (isFiveGponRuCoreOld() == true && mainPath.length > 0 &&  modifyMainPath == true) {
					 
					var autoProcSprPath = {
							"svlnNo" : baseNtwkLineNo
					}
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoprocsprpathoffgponsvlnline', autoProcSprPath, 'GET', 'saveLinePath');
				} else if(isRuCoreLineOld() == true && mainPath.length > 0 && checkSmuxAndTopoCfgMeansRing(mainPath) == true && modifyMainPath == true ){
					
					var autoProcSprPath = {
							"svlnNo" : baseNtwkLineNo
					}
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoprocsprpathofsmuxsvlnline', autoProcSprPath, 'GET', 'saveLinePath');
				
				/*  
				 * 1. 토폴로지구성방식 RING형식으로 구성된 SMUX를 사용 
				 * 2. 서비스회선 저장시 CUMX링을 추가하고 추가된 CMUX링이 이원화된 링이면서 확장형인 경우
		         * CMUX링의 예비선번으로 회선의 예비선번을 구성해준다.
		         * 2020-06-11
		         */
				} else if(searchSmuxRing(mainPath) || (searchCmuxRing(mainPath) && searchExt(mainPath))) {
					var autoProcSprPath = {
							"svlnNo" : baseNtwkLineNo,
							"ringExtYn" : "Y"
					}
					
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoprocsprpathofsmuxsvlnline', autoProcSprPath, 'GET', 'saveLinePath');
				} else {
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', reserveParams, 'POST', 'saveLinePath');
				}
				
			} else {
				if(topoSclCd == '035') {
					var mainPath = tempDataTrim(detailGridId);
					/*
					 *  SMUX링의 경우 SMUX, CMUX장비구분에 따라 랑에 링을 꽂은 경우 예비선번을 저장하는 경우가 있음
					 *  CMUX 이원화로 구성되어있는 SMUX링을 저장시에 예비선번도 구성해서 저장함
					 */
					if(searchCmuxRing(mainPath)) {
						var autoProcSprPath = {
								"ntwkLineNo" : baseNtwkLineNo,
								"userId" : userId,
								"delRerveCd" : "N"
						}
						//이원화로 구성된 링의 확장형의 경우 - 예비선번 저장
						if(searchExt(mainPath)) {
							cmuxExtYN = "Y";
							httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/autoprocsprpathofcmuxextline', autoProcSprPath, 'POST', 'saveNetworkPath');
						} else {
							//이원화로 구성된 링의 확장형이 아닌 경우 - 기존에 예비선번이 있는 경우에는 삭제 아닌 경우에는 반환
							var data = reserveGrid;
							var links = $('#'+data).alopexGrid('dataGet');
							if(links.length > 0) {
								$.extend(autoProcSprPath,{"ntwkLnoGrpSrno": reservePathSameNo});
								$.extend(autoProcSprPath,{"delRerveCd": "Y"});  // 예비선번이 있는 경우
								httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/autoprocsprpathofcmuxextline', autoProcSprPath, 'POST', 'saveNetworkPath');	
							}
						}
					} 
				} else {
					// WDM트렁크일 경우 예비선번 저장 전 이미 저장을 했기때문에 또 묻지 않음
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', reserveParams, 'POST', 'saveNetworkPath');
				}
			}
			/*
			callMsgBox('','C', cflineMsgArray['saveMsg'], function(msgId, msgRst) {
				if (msgRst == 'Y') {
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', reserveParams, 'POST', 'saveNetworkPath');
				} else {
					cflineHideProgressBody();
					addRowNullData(detailGridId);
					addRowNullData(reserveGrid);
					$("#"+detailGridId).alopexGrid("startEdit");
					$("#"+reserveGrid).alopexGrid("startEdit");
				}
			});
			*/
		} else {
			cflineHideProgressBody();
			alertBox('W', response.PATH_ERROR_MSG);
			addRowNullData(detailGridId);
			addRowNullData(reserveGrid);
			$("#"+detailGridId).alopexGrid("startEdit");
			$("#"+reserveGrid).alopexGrid("startEdit");
		}
//	//TODO
//	//기지국회선	
//	} else if(flag == "saveLinePathTrunk") {
//
//		cflineHideProgressBody();
//		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/e1CheckLinePath', params, 'GET', 'linePathSaveAfterCheck');
//
//	//TODO
//	} else if(flag == "linePathSaveAfterCheck") {
//		
//		//회선포트와 트렁크포트정보가 같으면 자동으로 selectLinePath 실행
//		if(response.chkResult == "Y") {
//			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearchSaveAfter');
//		} else {
//
//			cflineHideProgressBody();
//			if(trunkServicePortYn != "N") {
//				var automsg = "<center>트렁크포트정보와 회선의 포트정보가 다릅니다."
//					+"<br>회선정보기준으로 표시하시겠습니까?</center>";
//				//정보가 같지 않은 경우에는 어떤 정보를 표시할지 사용자에게 확인
//				callMsgBox('','C', automsg, function(msgId, msgRst) {
//	        		if (msgRst == 'Y') {	
//	        			//회선정보기준표시
//	        			params.trunkServicePortYn = "N";
//	        			trunkServicePortYn = "N";
//	        		} else {
//	        			params.trunkServicePortYn = "Y";
//	        		}
//	        		//linePathSearchSaveAfter
//	        		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearchSaveAfter');
//	        	});
//			} else {
//				params.trunkServicePortYn = trunkServicePortYn;
//				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearchSaveAfter');
//			}
//		}
//		
	} else if(flag == "saveNetworkPath" || flag == "saveLinePath") {
		// 네트워크, 서비스 저장 후
		cflineHideProgressBody();
		if(response.PATH_RESULT) {
			if(flag == "saveLinePath") {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearchSaveAfter');
			} else {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchSaveAfter');
			}		
			//
			/* 20170907 FDF사용정보 GIS 전송건 시작
			 * 20171222 예비선번정보까지 검색위해 호출 위치 변경
			 *          PTP 링 / WDM 트렁크의 경우 주선번 저장시 flag : saveReserveNetworkPath  -> 그후 예비선번 저장시 flag : saveNetworkPath 호출함
			 *          그렇기때문에 서비스회선 flag(saveLinePath)와 링일 경우 주선번 및 예비선번이 저장된 후의 flag(saveNetworkPath)가 성공한 경우 호출함
			 *  */
			// 서비스회선   / 링
			if (flag == "saveLinePath" || (flag == "saveNetworkPath" && typeof topoLclCd != "undefined"  && topoLclCd == '001')) {
				
				sendFdfUseInfo(flag);
			}
			/* 20170907 FDF사용정보 GIS 전송건 끝 */
			

			/* 20171222 네트워크정보 TSDN 전송건 시작 */
			// PTP 링   / 기간망 트렁크
			if (flag == "saveNetworkPath" // 네트워크
				&& typeof topoLclCd != "undefined"  && topoSclCd != "undefined" 
					&&    (topoLclCd == '001' && topoSclCd == '002')     // PTP 링
			   ) {
				var ntwkEditLneType = (topoLclCd == '001') ? "R" : "T";
				sendToTsdnNetworkInfo(baseNtwkLineNo, ntwkEditLneType, "E");
			}
			/* 20171222 네트워크정보 TSDN 전송건 끝 */
						
			/* 20170518 수용네트워크 처리 시작 */
			if (flag == "saveLinePath" ||  (flag == "saveNetworkPath" && typeof topoLclCd != "undefined")) { 

				chkExtractAcceptNtwkLine = "SAVE";
   				cflineShowProgressBody();
				var acceptParam = {
						 lineNoStr : baseNtwkLineNo
					   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
					   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
					   , linePathYn : (gridDivision == "serviceLine" ? "Y" : "N")
					   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
					   , excelDataYn : "N"
					   , mgmtGrpCd : nullToEmpty($('#mgmtGrpCd').val())
   					   , callMsg : cflineMsgArray['saveSuccess']  // 저장에 성공한 경우
					   , callViewType : nullToEmpty(initParam.callViewType)
					   , cmuxExtYN : nullToEmpty(cmuxExtYN)   // CMUX링 여부
					   , subScrNtwkLnoGrpSrno : (isSubScriRingOld() == true ? $('#ntwkLnoGroSrno').val() : "")  // 가입자망 링의 선번그룹일련번호
				}
				modifyMainPath == false;
				
				
				//ADAMS 고도화 - SKB회선 제외 2020.04.01
				//TODO 이전으로 20240911
				extractAcceptNtwkLine(acceptParam);
				//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//				if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (topoSclCd == "030" || topoSclCd == "031")) {
//					extractAcceptNtwkLine(acceptParam);
//				} else {
//					cflineHideProgressBody();
//					var msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
//					alertBox('I', msg);    //정상적으로 처리되었습니다. 
//				}
			}
			/* 20170518 수용네트워크 처리 끝 */
			
			/* SMUX링의 기설 서비스호선 회선 자동생성 기능 호출 */
			if (flag == "saveNetworkPath" && isSmuxRingOld() == true) {
				var smuxRingParam = {
							 "useRingNtwkLineNo" : baseNtwkLineNo
		    			   , "newServiceLineYn" : "N"
		        		   , "callApiForSmux" : "CF"  // 회선자체에서 해당 기능을 사용하기 위해
		        		   , "userId" : $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val()
				}
				autoProcSmuxRingToSvlnNo(smuxRingParam);
			}
			
			/* SMUX링인경우 COT장비의 번호를 링명에 셋팅*/
			if (flag == "saveNetworkPath" && isSmuxRingOld() == true) {
				var smuxRingParam = {
							 "ntwkLineNo" : baseNtwkLineNo
		        		   , "userId" : $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val()	   
		        		   , "viewType" : "O"
				}
				updateSmuxRingNameByCotNm(smuxRingParam);  
			}
			

			/* 5G-PON링인경우 COT장비의 번호를 링명에 셋팅*/
			if (flag == "saveNetworkPath" && isFiveGponRingOld() == true) {
				var fiveGponRingParam = {
							 "ntwkLineNo" : baseNtwkLineNo
		        		   , "userId" : $("#chrrUserId").val() == "" ? "admin" : $("#chrrUserId").val()	   
		        		   , "viewType" : "O"
				}
				updateFiveGRingNameByCotNm(fiveGponRingParam);  
			}
			
			/* M/W PTP링인경우 MW용도구분 셋팅*/
			if (flag == "saveNetworkPath" && isMWPtpRingOld() ==  true) {
				insertMwUsgDiv(baseNtwkLineNo);
			}

			/* RU회선_중계기인 경우 망구성방식코드 정보갱신 */
			if (isRuCoreLineOld() == true) {
				var ruParam = {
						"lineNoStr" : baseNtwkLineNo
					  , "editType"  : "E"
				}
				setRuNetCfgMeans(ruParam);
			}
			
			// 토폴로지구성방식이 PTP인경우 마지막 FDF의 설치국사로 하위국사 셋팅 2019-01-16
			if(flag == "saveNetworkPath" && typeof topoLclCd != "undefined"  && topoLclCd == '001' && baseInfData[0].topoCfgMeansCd == '002'){
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/setlowmtsobylastfdf', params, 'GET', 'setLowMtsoByLastFdf');
			}
			
		} else {
			//alertBox('W', response.PATH_ERROR_MSG);
			chkExtractAcceptNtwkLine = "";
			addRowNullData();
			$("#"+detailGridId).alopexGrid("startEdit");
			
			// 1. [수정] RU광코어 링/예비선번 사용
			// 예비선번 사용하는 서비스회선/링인경우 주선번(saveReserveNetworkPath/saveReserveLinePath) 저장 후 예비선번(saveNetworkPath/saveLinePath) 저장에서 에러가 나도 
			// 이미 저장된 주선번의 FDF정보를 전송해야함
			if ( wkSprYn ) {
				
				addRowNullData(reserveGrid);
				$("#"+reserveGrid).alopexGrid("startEdit");
				
				// 서비스회선   / 링
				if (flag == "saveLinePath" || (flag == "saveNetworkPath" && typeof topoLclCd != "undefined"  && topoLclCd == '001')) {
					sendFdfUseInfo(flag);
				}
				
				/* 20170518 수용네트워크 처리 시작 */
				if (flag == "saveLinePath" ||  (flag == "saveNetworkPath" && typeof topoLclCd != "undefined")) { 
					chkExtractAcceptNtwkLine = "SAVE";
					var acceptParam = {
							 lineNoStr : baseNtwkLineNo
						   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
						   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
						   , linePathYn : (gridDivision == "serviceLine" ? "Y" : "N")
						   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
						   , excelDataYn : "N"
						   , mgmtGrpCd : nullToEmpty($('#mgmtGrpCd').val())
	   					   , callMsg : response.PATH_ERROR_MSG  // 에러인 경우 에러메세지를 넘김
	   					   , onlyMainOk : "Y"  // 주선번만 정상 저장됨
	   					   , callViewType : nullToEmpty(initParam.callViewType)
						   , subScrNtwkLnoGrpSrno : (isSubScriRingOld() == true ? $('#ntwkLnoGroSrno').val() : "")  // 가입자망 링의 선번그룹일련번호
					}
					modifyMainPath == false;
					//ADAMS 고도화 - SKB회선 제외 2020.04.01
					//TODO 이전으로 20240911
					extractAcceptNtwkLine(acceptParam);
					//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//					if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (topoSclCd == '030' || topoSclCd == '031')) {
//						extractAcceptNtwkLine(acceptParam);
//					} else {
//						cflineHideProgressBody();;
//						var msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
//						alertBox('I', msg);    //정상적으로 처리되었습니다. 
//					}
				} else {
					alertBox('W', response.PATH_ERROR_MSG);
				}
				/* 20170518 수용네트워크 처리 끝 */
				
				/* RU회선_중계기인 경우 망구성방식코드 정보갱신 */
				if (isRuCoreLineOld() == true && flag == "saveLinePath") {
					var ruParam = {
							"lineNoStr" : baseNtwkLineNo
						  , "editType"  : "E"
					}
					setRuNetCfgMeans(ruParam);
				}
			} else {
				alertBox('W', response.PATH_ERROR_MSG);
			}
		}
	} else if(flag == "C00030") {
		// 링 상하위
		westNodeRole = response;
		eastNodeRole = response;

		params.ringMgmtDivCd = '1';
		params.wkSprDivCd =  '01';
		params.autoClctYn = 'N';
			
		params.mgmtGrpCd = mgmtGrpCd;
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
	} else if(flag == "C00967") {
		// 회선 상하위
		westNodeRole = response;
		eastNodeRole = response;
 
		// RU회선 - RU(CMS수집) : 003 - 103
		// 기지국회선 - LTE : 001 - 016 , 기지국회선 - 5G : 001 - 030
		if( (svlnLclCd == "003" && svlnSclCd == "013") || (svlnLclCd == "001" && svlnSclCd == "016") || (svlnLclCd == "001" && svlnSclCd == "030")) {
			if(params.ntwkLnoGrpSrno == "") {
				params.autoClctYn = "Y";
			}
		}
//		/**
//		 * TODO
//		 * 기지국회선의 경우에는 selectLinePath전에 미리 트렁크정보와 회선의 포트정보가 일치하는지 판단한다.
//		 * 같지 않은 경우 어떤 정보를 보여줄지 사용자가 선택하게 유도
//		 */
//		if( svlnLclCd == "001" ) {
//			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/e1CheckLinePath', params, 'GET', 'linePathSearchBeforeCheck');
//		} else {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
//		}
	} else if(flag == "C00542") {
		// WDM 사용용도
		westPortUseType = response;
		eastPortUseType = response;
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
//	
//	//TODO
//	} else if(flag == "linePathSearchBeforeCheck") {
//		
//		//회선포트와 트렁크포트정보가 같으면 자동으로 selectLinePath 실행
//		if(response.chkResult == "Y") {
//			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
//		} else {
//
//			cflineHideProgressBody();
//			if(trunkServicePortYn != "N") {
//				var automsg = "<center>트렁크포트정보와 회선의 포트정보가 다릅니다."
//				+"<br>회선정보기준으로 표시하시겠습니까?</center>";
//				//정보가 같지 않은 경우에는 어떤 정보를 표시할지 사용자에게 확인
//				callMsgBox('','C', automsg, function(msgId, msgRst) {
//	        		if (msgRst == 'Y') {	
//	        			//회선정보기준표시
//	        			params.trunkServicePortYn = "N";
//	        			trunkServicePortYn = "N";
//	        		} else {
//	        			params.trunkServicePortYn = "Y";
//	        		}
//	        		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
//	        	});
//			} else {
//				params.trunkServicePortYn = trunkServicePortYn;
//				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
//			}
//		}
//		
	} else if(flag == "linePathSearch" || flag == "networkPathSearch") {
		// 네트워크, 서비스 조회 후
		gridHidColSet();
		cflineHideProgressBody();
		
		
		
		var ringYn = false;
		if(flag == "networkPathSearch" && topoLclCd == '001' && topoSclCd == '031') {
			// 가입자망링
			$("#wkSpr").show();
			
			if(!$('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
				if(openGridId != "dataGridWork") {
					$("#btnLineInsert").hide();
				}
			}
			
			ringYn = true;
		}
		
		if(flag == "networkPathSearch" && topoLclCd == '001' && topoSclCd == '035'){
			if(baseInfData[0].topoCfgMeansCd == "001") {
				bRessmuxRing = false;
				topoCfgMeansCd = baseInfData[0].topoCfgMeansCd;
			}
		}
		
		if(flag == "linePathSearch" && baseInfData.svlnStatCd == "008") {
			// 해지 회선. 편집 불가
			$("#btnRegEqp").setEnabled(false); // 편집
			$("#btnPahViaualEdit").setEnabled(false); // 시각화
			$("#btnSave").setEnabled(false);
		}
				
		// 광코어 FDF수집 버튼 보이기
		// 2018-12-04 대표회선 설정 화면에서 대표회선을 기준으로 선번을 복제하는 기능을 제공하기로 함에 해당 버튼은 주석처리함
		/*if(flag == "linePathSearch" && baseInfData.optlCnt >= 1 && response.data != undefined) {
			$("#btnOptServiceOptlPop").show();
		}*/
		
		if(response.data != undefined) {
			pathSameNo = response.data.PATH_SAME_NO;
			$('#'+detailGridId).alopexGrid('dataSet', response.data.LINKS);
//			response.data.USE_NETWORK_PATHS;
	//		$('#'+detailGridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
			
			// 주선번이 자동보정된 경우 주선번 편집으로 판별한다
			modifyMainPath = response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH;
			
		} else {
			
			// ADD 201811 : 반영시 주석 제거
			if(openGridId == "dataGridWork") {
				if(flag == "networkPathSearch") {
					// SMUX링인 경우
					if(isSmuxRingOld() == true) {
						/* 
						 * 실 작업은 common.js의 setPreLinePath()에서 처리함 
						 * SMUX링의 경우 청약시 설정한 기설 서비스회선이 존재하고 해당 회선의 선번에 SMUX링을 사용하고 있지 않은 경우
						 * 해당 선번을 이용하여 SMUX의 링 선번을 자동 구현한다 
						 * SMUX링의 SMUX(COT/RN) 장비가 존재하는경우 1), 4)번은 작업하고 없는경우 1), 4)번은 작업하지 않는다
						 * 1) 첫구간 WEST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(COT) 장비
						 * 2) 첫구간 EAST 장비 : 기설 서비스회선의 첫 EAST FDF 장비
						 * 3) 2)부터~ 마지막 WEST FDF 장비까지의 선번정보 복사
						 * 4) 마지막 EAST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(RN) 장비
						 */
												
						cflineShowProgressBody();
						httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectSvlnLinePath', params, 'GET', 'selectSvlnLinePath');
						
					}
				} 
			}
		}
		
		//편집모드
		if(openGridId == "dataGridWork") {
			
			/* 
			 * 1. SMUX 이원화링인 경우
			 * 2. 경유링을 쓰는 SMUX링의 경우 확장형이면 PTP형식이어도 예비선번이 보이도록 기능추가
			 * 2020-06
			 */
			var mainPath = tempDataTrim(detailGridId);
	
			if(searchSmuxRing(mainPath) || (searchCmuxRing(mainPath) && searchExt(mainPath))) {
				$("#btnReservePath").show();
			} else {
				$("#btnReservePath").hide();
			}
		}
		
		// 서비스 회선의 선번의 존재여부와 상관 없이 기설/신설 SMUX링 선번을 사용링으로 설정
		if(flag == "linePathSearch" && openGridId == "dataGridWork") {
			/*
			 * RU회선-광코어
			 * SMUX회선의 신설 청약의 경우 해당 회선의 선번이 RU장비만 존재하는 경우
			 * 해당 회선의 청약의 기설/신설 SMUX링의 선번을 취득하여 선번을 자동 구현 한다.
			 * 1) 기설/신설 SMUX링의 선번이 정상 구현된 경우(SMUX_COR ~ FDF -> FDF(ETE) ~ SMUX_RN) 해당 선번을 취득
			 * 2) 1) 선번의 첫 구간의 WEST 장비인 SMUX_COT장비를 서비스 회선의 첫 선번의 EAST 장비에 셋팅
			 * 3) 1) 선번을 복사
			 * 4) 1) 선번의 마지막 구간의 EAST 장비인 SMUX_RN 장비를 서비스회선의 마지막 구간의 WEST 장비에 셋팅
			 * 
			 * */	
			
			// S-MUX 광코어 신설 서비스회선에 기설/신설 링 선번정보 자동셋팅
			if(isSmuxRuCoreOld() == true && checkUseRingAtRuPath(detailGridId) == false ) {					
				cflineShowProgressBody();
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectSmuxRingPathInfo', params, 'GET', 'selectSmuxRingPathInfo');
			}
			
			/*
			 * 서비스 회선의 선번 존재여부와 상관 없이
			 * RU회선-광코어
			 * 5G-PON 회선의 신설 청약의 경우 해당 회선의 선번이사용링이 없는경우
			 * 해당 회선의 청약의 장비ENG에서 설정한 COT장비와 CRN장비의 파장정보를 바탕으로 해당 CRN을 사용하는 서비스회선을 조회하여 선번을 복제
			 *    장비ENG : 청약번호당 ENG가 다건발행됨
			 *              기본적으로 최근 ENG번호기준
			 *              단, COT장비/CRN 파장 장비가 설정된 ENG가 있는경우 해당건이 우선함.
			 *              ENG 1 COT 장비설정됨/ CRN 파장 설정됨
			 *              ENG 2 COT 장비설정됨/ CRN 파장 설정 안됨
			 *              <= ENG 1번 사용함
			 * 1) 해당 회선의 장비ENG(CRN 파장)에서 설정한 정보를 바탕으로 DU-L/하위국사와 같은 건물에 속한 같은 CNR모델의 장비를 사용하는 서비스회선을 찾음 
			 * 2) 1) 해당 선번정보중 CRN의 포트를 ENG 설정한 주파수에 해당하는 채널포트 2개(TX/RX)로 교체
			 * 3) 2) 에 원 선번의 DU-L정보를 셋팅하여 선번을 구현
			 * 4) 해당 선번을 원 선번 뒤에 추가함
			 * 
			 * */	
			
			/* 신설 서비스회선에 CRN 장비기준 기존 서비스회선 선번 자동셋팅 주석*/
			if(isFiveGponRuCoreOld() == true && checkUseRingAtRuPath(detailGridId) == false ) {					
				cflineShowProgressBody();
				var copyParam = {"svlnNo" : params.ntwkLineNo};
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/copySvlnPathInfoByCrn', copyParam, 'GET', 'copySvlnPathInfoByCrn');
			}
		}
		
		eqpMdlPortRule = response.eqpMdlPortRule;
		
		// 가입자망링 일 때 선번ID 표시
		if(ringYn && flag == "networkPathSearch") {
			if(response.ntwkLnoGrpSrno != undefined) {
				// 선번이 존재
				$("#ntwkLnoGroSrno").remove();
				var selectHtml = "<select id = 'ntwkLnoGroSrno' name = 'ntwkLnoGroSrno' class='divselect'>";
				for(var i = 0; i < response.ntwkLnoGrpSrno.length; i++) {
					var optionHtml = "<option value='" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "'";
					/*if(pathSameNo == response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno) optionHtml += " selected=true ";*/
					optionHtml += ">" + response.ntwkLnoGrpSrno[i].ntwkLnoGrpSrno + "</option>";
					selectHtml += optionHtml;
				}
				selectHtml += "</select>";
				$("#wkSprlabel").append(selectHtml);
				$("#ntwkLnoGroSrno").val(pathSameNo);
				
				// select change시 저장해야 될 ID
				setPrevNtwkLnoGrpSrno(pathSameNo);
			} else {
				// 선번이 존재하지 않아서 기본 1로 설정
				$("#ntwkLnoGroSrno").remove();
				var selectHtml = "<select id = 'ntwkLnoGroSrno' name = 'ntwkLnoGroSrno' class='divselect'>";
				selectHtml += "<option value='1' selected=true>1</option>";
				selectHtml += "</select>";
				$("#wkSprlabel").append(selectHtml);
				
				// select change시 저장해야 될 ID
				setPrevNtwkLnoGrpSrno("1");
			}
			
			// select change 이벤트 바인딩
			ntwkLnoGrpSrnoChangeEvent();
		}
		
		// 엑셀 다운로드를 위한 기본정보 저장
		baseInfData.svlnLclSclCdNm = baseInfData.svlnLclCdNm + " - " + baseInfData.svlnSclCdNm;
		$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
		
		if(openGridId == "dataGridWork") {
			
			var btnHideArray = ['btnRegEqp'];
			
			// 기지국회선 - LTE회선, 기지국회선 - WCDMA(IPNB)수집, 기지국회선 - 5G, RU회선 - RU(CMS수집)회선  편집 불가  
			// 20180202 SKT-B2B회선, SKT-기타-기타회선 편집 오플처리
			if( (typeof svlnLclCd != "undefined" && typeof svlnSclCd != "undefined")){
				if((svlnLclCd == "001" && svlnSclCd == "016") || (svlnLclCd == "001" && svlnSclCd == "030") || (svlnLclCd == "001" && svlnSclCd == "020" && autoClctYn == 'Y') || (svlnLclCd == "003" && svlnSclCd == "103")
						/*|| ( mgmtGrpCd =="0001" && ((svlnLclCd == "005") || (svlnLclCd == "006" && svlnSclCd =="005")) )*/
				) {
					$("#btnRegEqp").setEnabled(false);
					$("#btnPahViaualEdit").setEnabled(false);
				} else {
					addRow("", btnHideArray);
					addRowNullData();
					$("#"+detailGridId).alopexGrid("startEdit");
					gridHidColSet();
					autoClctPathBtnVisible();
				}
			
				//RU회선이면서 CMS회선인 경우 autoClctYn = 'N' 인 경우에는 편집가능
				if(svlnSclCd == "103" && autoClctYn == "N") {
					$("#btnRegEqp").setEnabled(true);
					$("#btnPahViaualEdit").setEnabled(true);
				}
			}
			// 20180202 SKT-B2B회선, SKT-기타-기타회선 편집 오플처리
			/* else if(topoLclCd == '002' && topoSclCd == '100' && mgmtGrpCd =='0001'){ //SKT 트렁크회선 편집불가
				$("#btnRegEqp").setEnabled(false);
			}*/
			else {
				addRow("", btnHideArray);
				addRowNullData();
				$("#"+detailGridId).alopexGrid("startEdit");
				gridHidColSet();
				autoClctPathBtnVisible();
			}
			
			//수집선번비교 버튼 활성화 로직임
			if(isFiveGponRuCoreOld() == true) {
				$('#btnCmslineCompare').show();	//수집회선비교버튼의 활성화
			} else {
				$('#btnCmslineCompare').hide(); //그외조건에서는 수집회선비교버튼 비활성화 처리
			}
		}
		
		// 11.28 FDF 구간 제외 클릭 & 예비선번도 존재할때 예비선번도 FDF구간 제외 조회
		if( wkSprYn && $("#reservePathList").attr('data-alopexgrid') != undefined ) {
			if($('#'+detailGridId).alopexGrid("readOption").cellInlineEdit) {
				reserveNetworkPath(true, params.exceptFdfNe);
			} else {
				reserveNetworkPath(false, params.exceptFdfNe);
			}
		}
		
	} else if(flag == "linePathSearchSaveAfter" || flag == "networkPathSearchSaveAfter" || flag == "networkPathSearchSelectChangeAfter"
		|| flag == "networkPathSearchAfter" || flag == "linePathSearchAfter") {
//		console.log(flag);
		// 선번 저장 후 리로딩을 위해 저장 후 재조회 한 후					: linePathSearchSaveAfter, networkPathSearchSaveAfter)
		// SELECT CHANGE를 통해 데이터 저장 후 현재 선택된 선번을 가져 온 뒤 	: networkPathSearchSelectChangeAfter
		
		if(response.data != undefined) {
			pathSameNo = response.data.PATH_SAME_NO;
			$('#'+detailGridId).alopexGrid('dataSet', response.data.LINKS);			

			/* 2018-09-12  3. RU고도화 */ 
			modifyMainPath = response.data.USE_NETWORK_PATH_MERGED_WITH_ORIGINAL_PATH;  // 주선번이 자동보정된 경우 주선번 편집으로 판별한다
		} 
		
		// 광코어 FDF수집 버튼 숨기기
		if( (flag == "linePathSearchSaveAfter" || flag == "linePathSearchAfter") && baseInfData.optlCnt >= 1 && response.data != undefined) {
			$("#btnOptServiceOptlPop").show();
		} else {
			$("#btnOptServiceOptlPop").hide();
		}
		
		if(flag != "networkPathSearchSelectChangeAfter" && flag != "networkPathSearchAfter" && flag != "linePathSearchAfter") {
			
			if (chkExtractAcceptNtwkLine == "CHK_SAVE") { // 저장을 완료하였습니다. 메시지가 표시되었음
				chkExtractAcceptNtwkLine = "";
			} else if (chkExtractAcceptNtwkLine == "SAVE") {  // 저장을 완료하였습니다
				
			} else {  // 수용네트워크 목록을 추출하는 api를 호출하지 않았음
				cflineHideProgressBody();
				alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
			}
			
			//callMsgBox('' , 'I', cflineMsgArray['saveSuccess'] , function(msgId, msgRst){
				/**
				 * 수용회선 체크
				 * 1. 네트워크 저장 후 : networkPathSearchSaveAfter
				 * 2. 링-가입자망링
				 *    - 선번생성 버튼을 통한 저장 후 : saveNetworkPathLineInsertAfter
				 *    - select change event를 통한 저장 후 : saveNetworkPathSelectChangeAfter
				 * 3. 서비스 회선 저장 후 : linePathSearchSaveAfter
				 * 
				 */
				// acceptPath();
			//}); /* 저장을 완료 하였습니다.*/
		}  
		else if(flag == "networkPathSearchAfter") {
			setPrevNtwkLnoGrpSrno(pathSameNo);
			/* 
			 * 실 작업은 common.js의 setPreLinePath()에서 처리함 
			 * SMUX링의 경우 청약시 설정한 기설 서비스회선이 존재하고 해당 회선의 선번에 SMUX링을 사용하고 있지 않은 경우
			 * 해당 선번을 이용하여 SMUX의 링 선번을 자동 구현한다 
			 * SMUX링의 SMUX(COT/RN) 장비가 존재하는경우 1), 4)번은 작업하고 없는경우 1), 4)번은 작업하지 않는다
			 * 1) 첫구간 WEST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(COT) 장비
			 * 2) 첫구간 EAST 장비 : 기설 서비스회선의 첫 EAST FDF 장비
			 * 3) 2)부터~ 마지막 WEST FDF 장비까지의 선번정보 복사
			 * 4) 마지막 EAST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(RN) 장비
			 */
			
			if(isSmuxRingOld() && response.data == undefined) {	
				
				cflineShowProgressBody();
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectSvlnLinePath', params, 'GET', 'selectSvlnLinePath');
				
			}
		}
		else if(flag == "linePathSearchAfter") {
			setPrevNtwkLnoGrpSrno(pathSameNo);
			
			/*
			 * 서비스 회선의 선번 존재여부와 상관 없이
			 * RU회선-광코어
			 * SMUX회선의 신설 청약의 경우 해당 회선의 선번이 RU장비만 존재하는 경우
			 * 해당 회선의 청약의 기설/신설 SMUX링의 선번을 취득하여 선번을 자동 구현 한다.
			 * 1) 기설/신설 SMUX링의 선번이 정상 구현된 경우(SMUX_COR ~ FDF -> FDF(ETE) ~ SMUX_RN) 해당 선번을 취득
			 * 2) 1) 선번의 첫 구간의 WEST 장비인 SMUX_COT장비를 서비스 회선의 첫 선번의 EAST 장비에 셋팅
			 * 3) 1) 선번을 복사
			 * 4) 1) 선번의 마지막 구간의 EAST 장비인 SMUX_RN 장비를 서비스회선의 마지막 구간의 WEST 장비에 셋팅
			 * 
			 * */	
			
			/* 신설 서비스회선에 기설/신설 링 선번정보 자동셋팅 주석*/
			if(isSmuxRuCoreOld() == true && checkUseRingAtRuPath(detailGridId) == false ) {					
				cflineShowProgressBody()
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectSmuxRingPathInfo', params, 'GET', 'selectSmuxRingPathInfo');
			}
			
			/*
			 * 서비스 회선의 선번 존재여부와 상관 없이
			 * RU회선-광코어
			 * 5G-PON 회선의 신설 청약의 경우 해당 회선의 선번이사용링이 없는경우
			 * 해당 회선의 청약의 장비ENG에서 설정한 COT장비와 CRN장비의 파장정보를 바탕으로 해당 CRN을 사용하는 서비스회선을 조회하여 선번을 복제
			 *    장비ENG : 청약번호당 ENG가 다건발행됨
			 *              기본적으로 최근 ENG번호기준
			 *              단, COT장비/CRN 파장 장비가 설정된 ENG가 있는경우 해당건이 우선함.
			 *              ENG 1 COT 장비설정됨/ CRN 파장 설정됨
			 *              ENG 2 COT 장비설정됨/ CRN 파장 설정 안됨
			 *              <= ENG 1번 사용함
			 * 1) 해당 회선의 장비ENG(CRN 파장)에서 설정한 정보를 바탕으로 DU-L/하위국사와 같은 건물에 속한 같은 CNR모델의 장비를 사용하는 서비스회선을 찾음 
			 * 2) 1) 해당 선번정보중 CRN의 포트를 ENG 설정한 주파수에 해당하는 채널포트 2개(TX/RX)로 교체
			 * 3) 2) 에 원 선번의 DU-L정보를 셋팅하여 선번을 구현
			 * 4) 해당 선번을 원 선번 뒤에 추가함
			 * 
			 * */	
			
			/* 신설 서비스회선에 CRN 장비기준 기존 서비스회선 선번 자동셋팅 주석*/
			if(isFiveGponRuCoreOld() == true && checkUseRingAtRuPath(detailGridId) == false ) {					
				cflineShowProgressBody();
				var copyParam = {"svlnNo" : params.ntwkLineNo}
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/copySvlnPathInfoByCrn', copyParam, 'GET', 'copySvlnPathInfoByCrn');
			}
		}
		else {
			setPrevNtwkLnoGrpSrno(pathSameNo);
		}
		if (nullToEmpty(chkExtractAcceptNtwkLine) !="SAVE") {
			cflineHideProgressBody();
		}
		/* 17.05.10 저장 후 편집 모드 막기 */
		if(flag != "linePathSearchSaveAfter" && flag != "networkPathSearchSaveAfter") {
			addRowNullData();

			// 2019-09-30  8. 기간망 링 선번 고도화 모든 경유링 보기 버튼이 보이는지 체크 후 
			var chkTopoSclCd = isRingOld() == true ?  baseInfData[0].topoSclCd :  baseInfData.topoSclCd;
			if ($('#cascadingRingDisplayCheckbox').is(':visible') == true) {
				if($('#cascadingRingDisplay').is(':checked')) {
					// 2019-09-30  5. 기간망 링 선번 고도화
					if (isAbleViaRing(chkTopoSclCd) == true) {
						$('#'+detailGridId).alopexGrid('showCol', ['CASCADING_RING_NM_3']);
					} else {
						$('#'+detailGridId).alopexGrid('showCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
					}
					
				} else {
					// 2019-09-30  5. 기간망 링 선번 고도화
					if (isAbleViaRing(chkTopoSclCd) == true) {
						$('#'+detailGridId).alopexGrid('hideCol', ['CASCADING_RING_NM_3']);
					} else {
						$('#'+detailGridId).alopexGrid('hideCol', ['CASCADING_RING_NM_2', 'CASCADING_RING_NM_3']);
					}
					
				}
				$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
			}
			
			if ($('#rontTrunkDisplayCheckbox').is(':visible') == true) {
				if($('#rontTrunkDisplay').is(':checked')) {
					$('#'+detailGridId).alopexGrid('showCol', ['RONT_TRK_NM']);
				} else {
					$('#'+detailGridId).alopexGrid('hideCol', ['RONT_TRK_NM']);
				}
				$('#'+detailGridId).alopexGrid("updateOption", { fitTableWidth: true });
			}
			
			$("#"+detailGridId).alopexGrid("startEdit");
			
			
		} else {
			// 편집 관련 버튼을 조회 모드에서 선번창을 띄웠을때와 동일한 상태로 변경
//			if(gridDivision != 'wdm') {
			if( !wkSprYn ) {
				$("#btnReservePathChange").hide();	
				$("#btnReservePath").hide();
			} else {
				$("#btnReservePathChange").hide();   // 예비선번으로 
				$("#reserveBtnPathDelete").hide();   // 예비선번영역 선번삭제버튼 숨기기
			}
			$("#exceptFdfNeDisplayCheckbox").show();
			$("#btnPathDelete").hide();
			$("#btnModificationDetailsDisplay").hide();
			$("#btnSave").hide();
			$("#btnLineInsert").hide();
			
			$("#btnRegEqp").show();
			//저장후 수집선번버튼 숨기기
			$("#btnCmslineCompare").hide();
			//저장후 선번검색 버튼 숨기기
			$("#btnEqpNodeInfo").hide();
			autoClctPathBtnVisible();
			
			// 그리드 상태 update
			$('#'+detailGridId + ', #'+reserveGrid).alopexGrid({
				fitTableWidth: true,
				fillUndefinedKey : null,
				numberingColumnFromZero: false,
				alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
				preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
				useClassHovering : true,
				autoResize: true,
				cellInlineEdit : false,
				cellSelectable : false,
				rowInlineEdit: false,
				rowClickSelect : false,
				rowSingleSelect : true,
				rowspanGroupSelect: true
			});
			
			
			$('#'+detailGridId).alopexGrid("updateColumn", { selectorColumn: false });
			$('#'+detailGridId).alopexGrid("updateColumn", { dragdropColumn: false });
			
			if( wkSprYn ) {
				$('#'+reserveGrid).alopexGrid("updateColumn", { selectorColumn: false });
				$('#'+reserveGrid).alopexGrid("updateColumn", { dragdropColumn: false });
			}
		}
		
		// 예비선번 조회
		// networkPathSearchAfter -> 이후 조회는 true
		// 1. [수정] RU광코어 링/예비선번 사용 : linePathSearchAfter && RU회선 -> 조회후 true 
		if( wkSprYn ) {
			if( flag == "networkPathSearchAfter" ) {
				reserveNetworkPath(true);
			}
			// 5G-PON RU광코어 중 예비선번저장후 재 조회 
			else if( flag == "linePathSearchSaveAfter" && isFiveGponRuCoreOld()== true) {
				reserveNetworkPath(true);
			}
			else {
				/*
				 * 1. [수정] RU광코어 링/예비선번 사용
				 */
				if (flag == "linePathSearchAfter" 
					&& (typeof svlnLclCd != "undefined" && typeof svlnSclCd != "undefined"
					    && svlnLclCd == "003" && svlnSclCd == "101")  // 101
					) {
					reserveNetworkPath(true);
				} else {
					reserveNetworkPath(false);	
				}
				
			}
		}
	} else if(flag == "saveNetworkPathLineInsertAfter") {		
		/* 가입자망 신규그룹 추가시 해당 flag를 먼저 실행한다. */
		/* 20170518 수용네트워크 처리 시작(새로운 MAX 선번그룹 번호가 셋팅 되기 전에 prevNtwkLnoGrpSrno 값으로 이전 선번 그룹(신규선번번호생성되기 전)으로 자동수정 대상을 추출 */
		if (typeof topoLclCd != "undefined"  && topoLclCd == '001') { 
			chkExtractAcceptNtwkLine = "SAVE";
			var acceptParam = {
					 lineNoStr : baseNtwkLineNo
				   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
				   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
				   , linePathYn : (gridDivision == "serviceLine" ? "Y" : "N")
				   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
				   , excelDataYn : "N"
				   , mgmtGrpCd : nullToEmpty($('#mgmtGrpCd').val())
				   , callMsg : ""
				   , onlyMainOk : "Y"  // 주선번만 존재하는 가입자망링
				   , callViewType : nullToEmpty(initParam.callViewType)
				   , subScrNtwkLnoGrpSrno : (isSubScriRingOld() == true ? prevNtwkLnoGrpSrno : "")  // 가입자망 링의 선번그룹일련번호
			}
			modifyMainPath = false;
			//ADAMS 고도화 - SKB회선 제외 2020.04.01
			//TODO 이전으로  20240911
			extractAcceptNtwkLine(acceptParam);
			//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//			if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (topoSclCd == "030" || topoSclCd == "031")) {
//				extractAcceptNtwkLine(acceptParam);
//			} else {
//				cflineHideProgressBody();;
//				var msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
//				alertBox('I', msg);    //정상적으로 처리되었습니다. 
//			}
		}
		/* 20170518 수용네트워크 처리 끝 */
		
		// SKB의 가입자망링의 경우 선번 생성 버튼을 통해 그리드의 데이터를 저장 한 후 MAX 선번 아이디를 가져 온다
		wkSprDivFlag = false;
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectMaxNtwkLnoGrpSrno', params, 'POST', 'selectMaxNtwkLnoGrpSrno');
				
		/* 20170907 FDF사용정보 GIS 전송건 시작
		 * 20171222 예비선번정보까지 검색위해 호출 위치 변경
		 *          PTP 링 / WDM 트렁크의 경우 주선번 저장시 flag : saveReserveNetworkPath  -> 그후 예비선번 저장시 flag : saveNetworkPath 호출함
		 *          그렇기때문에 서비스회선 flag(saveLinePath)와 링일 경우 주선번 및 예비선번이 저장된 후의 flag(saveNetworkPath)가 성공한 경우 호출함
		 *  */
		// 서비스회선   / 링
		if ( typeof topoLclCd != "undefined"  && topoLclCd == '001') {
			sendFdfUseInfo(flag);
		}
		/* 20170907 FDF사용정보 GIS 전송건 끝 */
		

		/* 20171222 네트워크정보 TSDN 전송건 시작 */
		// PTP 링   / 기간망 트렁크
		if ( typeof topoLclCd != "undefined"  && topoSclCd != "undefined" 
				&& (   (topoLclCd == '001' && topoSclCd == '002')     // PTP 링
						|| (topoLclCd == '003' && topoSclCd == '102')  // 기간망트렁크
					)
		   ) {
			var ntwkEditLneType = (topoLclCd == '001') ? "R" : "T";
			sendToTsdnNetworkInfo(baseNtwkLineNo, ntwkEditLneType, "E");
		}
		/* 20171222 네트워크정보 TSDN 전송건 끝 */
		
	} else if(flag == "saveNetworkPathSelectChangeAfter") {
		/* 가입자망에서 그룹변경시 해당 flag호출되면서 현 그룹선번 저장 */
		/* 20170518 수용네트워크 처리 시작(새로운 MAX 선번그룹 번호가 셋팅 되기 전에 prevNtwkLnoGrpSrno 값으로 이전 선번 그룹(신규선번번호생성되기 전)으로 자동수정 대상을 추출 */
		if (typeof topoLclCd != "undefined"  && topoLclCd == '001') { 
			chkExtractAcceptNtwkLine = "SAVE";
			var acceptParam = {
					 lineNoStr : baseNtwkLineNo
				   , topoLclCd : (typeof topoLclCd != "undefined" ? topoLclCd: "")
				   , topoSclCd : (typeof topoSclCd != "undefined" ? topoSclCd: "")
				   , linePathYn : (gridDivision == "serviceLine" ? "Y" : "N")
				   , editType : (modifyMainPath == true ? "E" : "RS")  // E : 주선번 수정 , RS : 재저장(주선번변경없이 저장/예비선번은 변경됬을 가능성 있음)
				   , excelDataYn : "N"
				   , mgmtGrpCd : nullToEmpty($('#mgmtGrpCd').val())
				   , callMsg : ""
				   , onlyMainOk : "Y"  // 주선번만 존재하는 가입자망링
				   , callViewType : nullToEmpty(initParam.callViewType)
				   , subScrNtwkLnoGrpSrno : (isSubScriRingOld() == true ? prevNtwkLnoGrpSrno : "")  // 가입자망 링의 선번그룹일련번호
			}
			modifyMainPath = false;
			//ADAMS 고도화 - SKB회선 제외 2020.04.01
			//TODO 이전으로  20240911
			extractAcceptNtwkLine(acceptParam);
			//if(nullToEmpty(mgmtOnrNm) != "ADAMS") {
//			if(nullToEmpty(svlnLclCd) == "004" || nullToEmpty($('#mgmtGrpCd').val()) != "0002" || (topoSclCd == "030" || topoSclCd == "031")) {
//				extractAcceptNtwkLine(acceptParam);
//			} else {
//				cflineHideProgressBody();;
//				var msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
//				alertBox('I', msg);    //정상적으로 처리되었습니다. 
//			}
		}
		/* 20170518 수용네트워크 처리 끝 */
		
		// SELECT CHANGE를 통해서 그리드의 데이터를 저장 한 후 
		params = {
				"ntwkLineNo" : baseNtwkLineNo, 
				"utrdMgmtNo" : utrdMgmtNo,
				"ntwkLnoGrpSrno" : $('#ntwkLnoGroSrno').val()
		};
		wkSprDivFlag = false;
		$('#'+detailGridId).alopexGrid('dataEmpty');
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearchSelectChangeAfter');
		
		/* 20170907 FDF사용정보 GIS 전송건 시작
		 * 20171222 예비선번정보까지 검색위해 호출 위치 변경
		 *          PTP 링 / WDM 트렁크의 경우 주선번 저장시 flag : saveReserveNetworkPath  -> 그후 예비선번 저장시 flag : saveNetworkPath 호출함
		 *          그렇기때문에 서비스회선 flag(saveLinePath)와 링일 경우 주선번 및 예비선번이 저장된 후의 flag(saveNetworkPath)가 성공한 경우 호출함
		 *  */
		// 서비스회선   / 링
		if ( typeof topoLclCd != "undefined"  && topoLclCd == '001') {
			sendFdfUseInfo(flag);
		}
		/* 20170907 FDF사용정보 GIS 전송건 끝 */
		

		/* 20171222 네트워크정보 TSDN 전송건 시작 */
		// PTP 링   / 기간망 트렁크
		if ( typeof topoLclCd != "undefined"  && topoSclCd != "undefined" 
				&& (   (topoLclCd == '001' && topoSclCd == '002')     // PTP 링
						|| (topoLclCd == '003' && topoSclCd == '102')  // 기간망트렁크
					)
		   ) {
			var ntwkEditLneType = (topoLclCd == '001') ? "R" : "T";
			sendToTsdnNetworkInfo(baseNtwkLineNo, ntwkEditLneType, "E");
		}
		/* 20171222 네트워크정보 TSDN 전송건 끝 */		
		
	} else if(flag == "selectMaxNtwkLnoGrpSrno") {
		// MAX 선번 아이디를 가지고 온 뒤
		cflineHideProgressBody();
		var ntwkLnoGrpSrno = response.ntwkLineNo;
		
		var optionHtml = "<option value='" + ntwkLnoGrpSrno + "' selected='selected'>" + ntwkLnoGrpSrno + "</option>";
		var addYn = true;
		
		$("#ntwkLnoGroSrno").find("option").each(function() {
			if(ntwkLnoGrpSrno == this.value) {
				addYn = false;
			} 
		})
		
		if(addYn) {
			$("#ntwkLnoGroSrno").append(optionHtml);
		}
		
		$('#'+detailGridId).alopexGrid('dataEmpty');
		addRowNullData();
		$("#"+detailGridId).alopexGrid("startEdit");
		
		// select change 이벤트 바인딩
	//	ntwkLnoGrpSrnoChangeEvent();
		
		// select change 할때 이전
		setPrevNtwkLnoGrpSrno(ntwkLnoGrpSrno);
		// 저장후 재조회시 사용하는 그룹번호를 params에 셋팅해줌
		$.extend(params,{"ntwkLnoGrpSrno": $("#ntwkLnoGroSrno").val()});
	} else if(flag == "checkEqpMdlPortRule") {
		
		var tmpGridId = detailGridId;
		// 채널 정규식 체크
		var data = $('#'+tmpGridId).alopexGrid("focusInfo").cellFocus;
		
		if (data == null) {
			tmpGridId = reserveGrid;
			data = $('#'+tmpGridId).alopexGrid("focusInfo").cellFocus;
		}
		var rowIndex = data.row;
		var colIdx = data.columnIndex;
		var $cell = $('#'+tmpGridId).find('div[data-alopexgrid-rowindex=' + rowIndex + '][data-alopexgrid-columnindex=' + colIdx + ']');
		
		if(!response.eqpMdlPortRuleYn && response.eqpMdlPortRuleYn != undefined) {
			$($cell).find('input').attr('style', 'border-color:red');
		} else {
			$($cell).find('input').removeAttr('style');
		}
		
		$("#channelRule").empty();
		$("#channelRuleMsg").empty();
		
		$("#channelRule").append(response.channelRule);
		$("#channelRuleMsg").append(response.channelRuleMsg);
		
		if(response.channelRule != null && !response.eqpMdlPortRuleYn) {
			$("#channelRuleBox").show();
		}
	} else if(flag == "saveBeforeCheckEqpMdlPortRule") {
		bNotMerge = false;
		bRessmuxRing = false;
		if(!response.eqpMdlPortRuleYn && response.eqpMdlPortRuleYn != undefined) {
			$("#channelRule").empty();
			$("#channelRuleMsg").empty();
			
			$("#channelRule").append(response.channelRule);
			$("#channelRuleMsg").append(response.channelRuleMsg);
			$("#channelRuleBox").show();
			
			cflineHideProgressBody();
			addRowNullData();
			$("#"+detailGridId).alopexGrid("startEdit");
			
			var rowIndex = response.LINK_SEQ - 1; 
			var colKey = response.COL_KEY;
			var columnChk = response.columnChk;
			var $cell = '';
			
			if(columnChk == 'PORT' ) {
				if(response.COL_KEY.indexOf('RIGHT') == 0) {
					$cell = $('#'+detailGridId).find('div[data-alopexgrid-rowindex=' + rowIndex + '][data-alopexgrid-key=RIGHT_PORT_DESCR]');
				} else {
					$cell = $('#'+detailGridId).find('div[data-alopexgrid-rowindex=' + rowIndex + '][data-alopexgrid-key=LEFT_PORT_DESCR]');
				}
			} else {
				$cell = $('#'+detailGridId).find('div[data-alopexgrid-rowindex=' + rowIndex + '][data-alopexgrid-key=' + colKey + ']');
			}
			
			$($cell).find('input').attr('style', 'border-color:red');
			
			alertBox('W', response.channelRuleMsg);
		} else {
			$("#channelRuleBox").hide();
//			cflineHideProgressBody();
			
			// 주선번 또는 예비선번의 구간정합성이 맞지 않을 경우 이미 confirm을 띄운 상태. & wdm트렁크인 경우
			if(!rtnNeFlag || !reserveRtnNeFlag || wkSprDivFlag) {
				cflineShowProgressBody();
				chkUseLineBfSave();  // 저장전 사용서비스/네트워크회선 체크				
			} else {
				callMsgBox('','C', cflineMsgArray['saveMsg'], function(msgId, msgRst) {
					if (msgRst == 'Y') {
						cflineShowProgressBody();
						chkUseLineBfSave();  // 저장전 사용서비스/네트워크회선 체크	
					} else {
						cflineHideProgressBody();
						bRessmuxRing = false;
						addRowNullData();
						$("#"+detailGridId).alopexGrid("startEdit");
					}
				});
			}
		}
	} 
	
	else if(flag == "selectSvlnLinePath") {	
		cflineHideProgressBody();
		if(response.data != undefined) {
			
			/* 
			 * 실 작업은 common.js의 setPreLinePath()에서 처리함 
			 * SMUX링의 경우 청약시 설정한 기설 서비스회선이 존재하고 해당 회선의 선번에 SMUX링을 사용하고 있지 않은 경우
			 * 해당 선번을 이용하여 SMUX의 링 선번을 자동 구현한다 
			 * SMUX링의 SMUX(COT/RN) 장비가 존재하는경우 1), 4)번은 작업하고 없는경우 1), 4)번은 작업하지 않는다
			 * 1) 첫구간 WEST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(COT) 장비
			 * 2) 첫구간 EAST 장비 : 기설 서비스회선의 첫 EAST FDF 장비
			 * 3) 2)부터~ 마지막 WEST FDF 장비까지의 선번정보 복사
			 * 4) 마지막 EAST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(RN) 장비
			*/
			var copyPathData = setPreLinePath(response);
			if (copyPathData.length > 0) {
				alertBox('I', "청약시 설정한 기설 서비스회선 [" + response.data.NETWORK_NM + "] 의 <br>선번을 복제하여 자동 셋팅했습니다. <br>선번 내용을 확인해 주세요.");
				$('#'+detailGridId).alopexGrid('dataSet', copyPathData);
				modifyMainPath = true;
			}
			
			addRowNullData();
			$("#"+detailGridId).alopexGrid("startEdit");
			
			
		}

	}
	else if(flag == "selectSmuxRingPathInfo" ) {	
		cflineHideProgressBody();
		if(nullToEmpty(response.data) != '') {
			
			var throughLinks = setPathRingData(response);
			
			if (throughLinks.length > 0) {
				alertBox('I', "청약시 설정한 링  [" + response.data.NETWORK_NM + "] 의 <br>선번을 복제하여 자동 셋팅했습니다. <br>선번 내용을 확인해 주세요.");
				// 선번 넣기
				var lastIndex = $("#"+detailGridId).alopexGrid("dataGet").length ;
				lastIndex = (lastIndex == 0 ? 0 : lastIndex-1);
				$('#'+detailGridId).alopexGrid('dataAdd', throughLinks, {_index: {data : lastIndex}});
				$("#"+detailGridId).alopexGrid("startEdit");
				modifyMainPath = true;
			}
		}
	}
	else if(flag == "copySvlnPathInfoByCrn" ) {	
		cflineHideProgressBody();
		if(nullToEmpty(response.result) == 'OK') {
			var copyPath = response.copyPath;			
			if (copyPath.LINKS.length > 0) {
				alertBox('I', "  [" + copyPath.NETWORK_NM + "] 의 <br>선번을 복제하여 자동 셋팅했습니다. <br>선번 내용을 확인해 주세요.");
				// 선번 넣기
				var lastIndex = $("#"+detailGridId).alopexGrid("dataGet").length ;
				lastIndex = (lastIndex == 0 ? 0 : lastIndex-1);
				$('#'+detailGridId).alopexGrid('dataAdd', copyPath.LINKS, {_index: {data : lastIndex}});
				$("#"+detailGridId).alopexGrid("startEdit");
				modifyMainPath = true;
			}
		} else if (nullToEmpty(response.result) == 'NG1' && nullToEmpty(response.resultMsg) != "") {
			alertBox('W', response.resultMsg);
		}
	}
	// 5G-PON RU회선용 ETE
	else if(flag.indexOf("selectEteInfWithEqpList") == 0) {
		cflineHideProgressBody();
		//console.log(response);
		setEteInfoFor5GPON(flag, response);
		
	// 상위OLT장비설정
	} else if(flag == "selectOltEqpInf") {
		var currGridId = 'pathList';
		//건수가 한개인 경우 선번에 바로 설정
		if(nullToEmpty(response.failMsg) == "") {
			if (nullToEmpty(response.otlEqpIdInfCnt) == 1) {
				//1건인경우 바로 셋팅
				var result = setOtlInfoToGrid(response, currGridId);
				if(!result) {
					cflineHideProgressBody();
					alertBox("W", "상위OLT장비설정에 문제가 발생하였습니다.<br>관리자에게 문의바랍니다.");
				}
			} else if (nullToEmpty(response.otlEqpIdInfCnt) > 1) {
				//다건인경우 팝업표시
				cflineHideProgressBody();
				openOltEpqListPop(response, currGridId);
			} 
		} else {
			cflineHideProgressBody();
			alertBox('I', response.failMsg);
		}
	}
	
	orgChk();
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001' && topoSclCd == "031") {
		errorDataChk();
	}
	
	/**
	 * 수용회선 팝업
	 */
	if(flag == "selectAcceptPathList") {
		cflineHideProgressBody();
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		var acceptList = response.data;
		
		// 수용회선이 있으면
		if(acceptList.length > 0) {
			$a.popup({
				popid: "acceptPath",
				title: cflineMsgArray['acceptPathList'],
				url: urlPath + '/configmgmt/cfline/NetworkPathAcceptList.do',
				data: {"acceptList" : acceptList, "ntwkLineNo" : params.ntwkLineNo, "ntwkLnoGrpSrno" : params.ntwkLnoGrpSrno},
				modal: false,
				movable:true,
				windowpopup : true,
				width : 900,
				height : 730,
				callback:function(data){
					
				}
			});
		}
	}
	
	if(flag == "insertMwUsgDiv"){
		if(response.updateCnt > 0){
			// 부모창 데이터 재조회
			if (nullToEmpty(opener) != "" && $('#btnSearch' , opener.document).val() != undefined) {
				$('#btnSearch' , opener.document).click();
			}
			if (nullToEmpty(opener) != "" &&  $('#btnOpenerSeach' , opener.document).val() != undefined) {
				$('#btnOpenerSeach' , opener.document).click();
			}
		}
	}
	
	if(flag == "checkSMuxRingType"){
		cflineHideProgressBody();
		
		if(response.result == "OK"){
			bRessmuxRing = true;
			$("#btnSave").click();
		}
		else if (response.result == "NG"){
			callMsgBox('','C', 'S-MUX의 토폴로지 Ring 구조에 맞지않는 선번입니다.<br>자동으로 보정처리 하시겠습니까?<br>취소시 이대로 저장됩니다.', function(msgId, msgRst) {
				if (msgRst == 'Y') {
					cflineShowProgressBody();
					var data = tempDataTrim();
					var ruleParam = {"links" : JSON.stringify(data)
							, "topoLclCd" : initParam.topoLclCd
							, "topoSclCd" : initParam.topoSclCd
					};
					
					httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/makeSMuxSubRing', ruleParam, 'POST', 'makeSMuxSubRing');
				}
				else{
					bRessmuxRing = true;
					$("#btnSave").click();
				}
			});
			bRessmuxRing = true;
			$("#btnSave").click();
		}
		else if (response.result == "MISS"){
			var saveMsg = response.errMsg + "<br>계속 진행하시겠습니까?";
			
			callMsgBox('','C', saveMsg, function(msgId, msgRst) {
				if (msgRst == 'Y') {
					bRessmuxRing = true;
					$("#btnSave").click();
				} else {
					$('#'+detailGridId).alopexGrid("startEdit");
					bRessmuxRing = false;
				}
			});
		}
	}
	if(flag == "makeSMuxSubRing"){
		cflineHideProgressBody();
		
		if(response.result == "OK"){
			var list = $('#'+detailGridId).alopexGrid("dataGet");
			var len = list.length;
			var linklen = response.links.length;
			var diff = linklen - len;
			
			if(diff > 0){
				for(var i = 0; i < diff; i++){
					addRowNullData();
				}
			}
			
			$('#'+detailGridId).alopexGrid('dataSet', response.links);
			$('#'+detailGridId).alopexGrid("startEdit");
			
			if(response.msg != undefined && response.msg != null && response.msg != ""){
				callMsgBox('','I', response.msg, function(msgId, msgRst){  
					
				});
			}
		}
		else{
			$('#'+detailGridId).alopexGrid("startEdit");
			callMsgBox('','W', response.msg, function(msgId, msgRst){  
				
			});
		}
	}
	
	if(flag =="setLowMtsoByLastFdf"){
		var param = {"ntwkLineNo" : baseInfData[0].ntwkLineNo
				
		}
		tmofInfoPop(param, "Y");
	}
	
	/*
	 * 2020-08-20 12. 가입자망회선의 링조회 팝업 연결시 FDF선번정보를 통해 FDF장비 자동셋팅
	 */
	if(flag=="selectFdfEqpNm"){
		if(response.resultList == null){
			checkPop("ring", schVal, dataObj.data.SERVICE_ID, dataObj.data.TRUNK_ID, dataObj.data.RING_ID, dataObj.data.WDM_TRUNK_ID, dataObj.data.RING_PATH_DIRECTION, dataObj.data, dataObj.$grid.attr("id"));
		}else{
		}
	}
	
}


/*
 * 2019-01-15  7. 5G-PON고도화
 * ETE시 특정 장비가 TX/RX설정인 경우 상태편 RX장비 셋팅하기 위해
 * setPreFix : 셋팅할 장비(lft/rght)
 * rowIndex : 작업할 행
 */
function setRxEqpInfo(setPreFix, currGridId, rowIndex) {
	var rowData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_index:{row:rowIndex}})[0]);
	var preFix = setPreFix == "RIGHT" ? "LEFT" : "RIGHT";
	
	if (nullToEmpty(eval("rowData." + preFix + "_RX_PORT_ID")) == "" || nullToEmpty(eval("rowData." + setPreFix + "_RX_NE_ID")) != "") {
		return;
	}
	
	$('#'+currGridId).alopexGrid( "cellEdit", eval("rowData." + preFix + "_NE_ID"), {_index : { row : rowIndex}}, setPreFix+ "_RX_NE_ID");
	$('#'+currGridId).alopexGrid( "cellEdit", eval("rowData." + preFix + "_NE_NM"), {_index : { row : rowIndex}}, setPreFix+ "_RX_NE_NM");
}

// 1. [수정] RU광코어 링/예비선번 사용
// 장비/사용서비스회선 사용관련 체크후 실제 저장 작업 진행
function savePath() {
	/*
	 * 서비스회선 저장시 CUMX링을 추가하고 추가된 CMUX링이 이원화된 링이면서 확장형인 경우
	 * CMUX링의 예비선번으로 회선의 예비선번을 구성해준다.
	 * 2020-06
	 */
	var mainPath = tempDataTrim(detailGridId);
	if(searchCmuxRing(mainPath) && searchExt(mainPath)) {
		wkSprYn = true;
	}	
	
	if(gridDivision == "serviceLine") {
		
		if( wkSprYn ) {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', saveParams, 'POST', 'saveReserveLinePath');
		} else {
			//TODO
//			if( svlnLclCd == "001" ) {
//				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', saveParams, 'POST', 'saveLinePathTrunk');	
//			} else {
				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveLinePath', saveParams, 'POST', 'saveLinePath');	
//			}
		}
	} else {

		if( wkSprYn ) {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', saveParams, 'POST', 'saveReserveNetworkPath');
		} else {
			httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/saveNetworkPath', saveParams, 'POST', 'saveNetworkPath');
		}
	}
}

function orgChk(gridId) {
	if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	
	// 리셋
	for(var i = 0; i < dataList.length; i++) {
		$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "LEFT_ORG_BORDER");
		$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "RIGHT_ORG_BORDER");
	}
	
	if(dataList.length > 0) {
		// 좌체크
		var lftOrgId = "";
		var fstChk = true;
		var order = 0;
		for(var i = 0; i < dataList.length; i++) {
			if(lftOrgId == "") {
				lftOrgId = dataList[i].LEFT_ORG_ID;
			} else {
				if(lftOrgId == dataList[i].LEFT_ORG_ID) {
					if(nullToEmpty(dataList[i].LEFT_ORG_ID) != "") {
						if(fstChk) {
							order++;
							$('#'+gridId).alopexGrid("cellEdit", 'leftSame'+order, {_index : { row : i-1}}, "LEFT_ORG_BORDER");
							fstChk = false;
						}
						$('#'+gridId).alopexGrid("cellEdit", 'leftSame'+order, {_index : { row : i}}, "LEFT_ORG_BORDER");
					}
				} else {
					fstChk = true;
				}
				lftOrgId = dataList[i].LEFT_ORG_ID;;
			}
		}
		
		// 우체크
		var rghtOrgId = "";
		var fstChk = true;
		var order = 0;
		for(var i = 0; i < dataList.length; i++) {
			if(rghtOrgId == "") {
				rghtOrgId = dataList[i].RIGHT_ORG_ID;
			} else {
				if(rghtOrgId == dataList[i].RIGHT_ORG_ID) {
					if(nullToEmpty(dataList[i].RIGHT_ORG_ID) != "") {
						if(fstChk) {
							order++;
							$('#'+gridId).alopexGrid("cellEdit", 'rightSame'+order, {_index : { row : i-1}}, "RIGHT_ORG_BORDER");
							fstChk = false;
						}
						$('#'+gridId).alopexGrid("cellEdit", 'rightSame'+order, {_index : { row : i}}, "RIGHT_ORG_BORDER");
					}
				} else {
					fstChk = true;
				}
				rghtOrgId = dataList[i].RIGHT_ORG_ID;;
			}
		}
		
		refreshCell(gridId);
	}
}

function refreshCell(gridId) {
	var dataList = $('#'+gridId).alopexGrid("dataGet");
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001' && topoSclCd == "031") {
		for(var i = 0; i < dataList.length; i++) {
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_ORG_NM');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_NODE_ROLE_CD');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_NODE_ROLE_NM');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_NE_NM');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_PORT_DESCR');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_CHANNEL_DESCR');
			
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_ORG_NM');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_NODE_ROLE_CD');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_NODE_ROLE_NM');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_NE_NM');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_PORT_DESCR');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_CHANNEL_DESCR');
		}
	} else {
		for(var i = 0; i < dataList.length; i++) {
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'LEFT_ORG_NM');
			$('#'+gridId).alopexGrid('refreshCell', {_index: {row: i}}, 'RIGHT_ORG_NM');
		}
	}
	
}

// 가입자망링 오류 데이터 확인
function errorDataChk(gridId) {
	if( (typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined") && topoLclCd == '001' && topoSclCd == "031") {
		if(gridId == null || gridId == undefined || gridId == "") gridId = detailGridId;
		var dataList = $('#'+gridId).alopexGrid("dataGet");
		
		// 리셋
		for(var i = 0; i < dataList.length; i++) {
			$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "ROW_HIGHLIGHT");
		}
		
		var rightNeId = "";
		if(dataList.length > 0) {
			for(var i = 0; i < dataList.length; i++) {
				if(rightNeId == "") {
					rightNeId = dataList[i].RIGHT_NE_ID;
				} else {
					if(dataList[i].LEFT_NE_ID !=  rightNeId) {
						$('#'+gridId).alopexGrid("cellEdit", 'H', {_index : { row : i}}, "ROW_HIGHLIGHT");
					}
					
					rightNeId = dataList[i].RIGHT_NE_ID;
				}
				
				if(dataList[i].LEFT_NE_ID == null && dataList[i].RIGHT_NE_ID == null) {
					$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "ROW_HIGHLIGHT");
				}
			}
		}
		
		refreshCell(gridId);
	}
}

// 수용회선
function acceptPath() {
	// 수용회선 리스트가 있을 경우 오픈
	$.extend(params,{"ntwkLnoGrpSrno": saveParams.ntwkLnoGrpSrno});
	
	cflineShowProgressBody();
	httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectAcceptPathList', params, 'GET', 'selectAcceptPathList');
}

// FDF사용정보 전송(서비스회선/링편집시만 호출됨)
function sendFdfUseInfo(flag ) {
	/* 기본 편집은  E모드 , SKB 가입자망의 경우에는 별도 EG모드로 전달한다. */
	var fdfEditType = "E";
	if ( typeof topoSclCd != "undefined"  && topoSclCd == '031') {
		fdfEditType = "EG";
	}
	
	sendFdfUseInfoCommon(baseNtwkLineNo, (flag == "saveLinePath" ? "S" : "R"), fdfEditType, fdfSendLnoGrpSrno);
}

/** RU회선_광코어의 경우 사용링이 있는경우
 *   1. SMUX링 선번 자동 검색기능 실행 하지 않기
 *   2. 5G-PON 기존 서비스회선 복제를 실행하지 않기위해
 *   3. 사용링 수 제한하기위해
 * @param 체크할 그리드
 * @return true : 사용링 존재, false : 사용링 없음
*/
function checkUseRingAtRuPath(chkGridId) {
	var chkData = $("#"+chkGridId).alopexGrid("dataGet");
	
	var chkUseRing = false;
	for(var i = 0 ; i < chkData.length; i++) {
		if (nullToEmpty(chkData[i].RING_ID) != "" && chkData[i].RING_ID.substring(0,1) == "N" ) {
			chkUseRing = true;
			break;
		}
	}
	
	return chkUseRing;
}

/** 사용링 갯수 체크
 * @param 체크할 그리드
 * @return 링갯수
*/
function checkUseRingCntAtRuPath(chkGridId) {
	var chkData = $("#"+chkGridId).alopexGrid("dataGet");
	
	var chkUseRingCnt = 0;
	var bfUseRing = "";
	for(var i = 0 ; i < chkData.length; i++) {
		if (nullToEmpty(chkData[i].RING_ID) != "") {			
			if (bfUseRing != nullToEmpty(chkData[i].RING_ID) && chkData[i].RING_ID.substring(0,1) == "N") {
				bfUseRing = nullToEmpty(chkData[i].RING_ID);
				chkUseRingCnt++;
			}
		}
	}
	
	return chkUseRingCnt;
}

/* TODO
 * 마지막 East장비(DUL) 등록여부 확인 - 2024-10-30
 * RU광코어회선 DU-L 장비 체크 
 * 25	LTE RU
 * 26	W-RU
 * 27	광중계기
 * 28	RF중계기
 * 31	중계기정합장치
 * 32	MiBOS
 * 38	5G DU-L
 * 42	ERP 광중계기
 * 43	ERP RF급
 */
function checkDuLEqpLow(chkGridId) {
	
	var chkData = $("#"+chkGridId).alopexGrid("dataGet");
	
	var eqpList = ['25','26','27','28','31','32','38','42','43']; //DUL장비군
		
	var chkDulEqpCnt = 0;
	
	var count = 1;
	for(var i = 0 ; i < chkData.length-1; i++) {
		
		var leftNeId = nullToEmpty(chkData[i].LEFT_NE_ID);
		//등록된 장비명을 화면에서 삭제하고 저장하는 경우가 있어 개선 2024-11-27
		if(leftNeId != '') {
			var neRoleCd = nullToEmpty(chkData[i].RIGHT_NE_ROLE_CD);
			
			for (var j = 0; j < eqpList.length; j++) {
				if (neRoleCd == eqpList[j]) {
					chkDulEqpCnt++;
					break;
				}
			}
		}
		count++;
	}
	
	return chkDulEqpCnt;
}

/**
 * checkSmuxAndTopoCfgMeansRing 
 * @param chkPath
 * @returns retrunValue
 */
function checkSmuxAndTopoCfgMeansRing(chkPath){

	var retrunValue = false
	var topoCfgMeansCd = "";
	var checkSmuxRing = "";
	
	if (nullToEmpty(chkPath) != "") {
		for(var i = 0 ; i < chkPath.length; i++) {
			if ( nullToEmpty(chkPath[i].RING_TOPOLOGY_SMALL_CD) == "035") {
				checkSmuxRing = true;
			}
			if ( nullToEmpty(chkPath[i].RING_TOPOLOGY_CFG_MEANS_CD) != "") {
				topoCfgMeansCd = chkPath[i].RING_TOPOLOGY_CFG_MEANS_CD;
			}
		}
	}
	if ( checkSmuxRing && topoCfgMeansCd =="001" ){
		retrunValue = true
	}
	
	return retrunValue;
}


/**
 * checkSmuxAndTopoCfgMeansPTP 
 * @param chkPath
 * @returns retrunValue
 */
function checkSmuxAndTopoCfgMeansPTP(chkPath){

	var retrunValue = false
	var topoCfgMeansCd = "";
	var checkSmuxRing = "";
	

	if (nullToEmpty(chkPath) != "") {
		for(var i = 0 ; i < chkPath.length; i++) {
			if ( nullToEmpty(chkPath[i].TOPOLOGY_SMALL_CD) == "035") {
				checkSmuxRing = true;
			}
			if ( nullToEmpty(chkPath[i].TOPOLOGY_CFG_MEANS_CD) != "") {
				topoCfgMeansCd = chkPath[i].TOPOLOGY_CFG_MEANS_CD;
			}
		}
	}
	if ( checkSmuxRing && topoCfgMeansCd =="002" ){
		retrunValue = true
	}
	
	return retrunValue;
}


/******************************* 5G-PON 서비스회선용 ETE적용 START ************************************/
	function setEteInfoFor5GPON(flag, response) {
		var currGridId = flag.replace("selectEteInfWithEqpList", "");
		var rowIndex = null;
		var errMsg = "";
		var startEteFromCrnEqp = false;
		// ETE정보가 있는경우
		if (response.eqpSctnRghtInf != undefined ) {
			
			if (response.eqpSctnRghtInf.length > 1) {
				// ETE설정
				rowIndex = setEteInfoToGrid(response, currGridId);
				
				if (nullToEmpty(response.eqpSctnRghtInf[0].errMsg) != "") {  
					errMsg = response.eqpSctnRghtInf[0].errMsg + "<br><br>";
				}
			} else if (response.eqpSctnRghtInf.length == 1) {
				var tmpFocusDataList = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}}));
				if (tmpFocusDataList.length > 0) {
					tmpFocusData = tmpFocusDataList[0];
					var tmpRowIndex = tmpFocusData._index.row;
					if (nullToEmpty(tmpFocusData.LEFT_FIVE_GPON_EQP_TYPE) == "CRN") {
						rowIndex = tmpRowIndex-1;
						startEteFromCrnEqp = true;
					} else {
						rowIndex = tmpRowIndex;
					}
				}
				
			}
			
			var cfMsg = errMsg;
			// 사용링 정보 취득이 된경우
			if (nullToEmpty(response.useRing)!= "" && nullToEmpty(response.useRing)!= "NONE" && (isFiveGponRuCoreOld() == true && checkUseRingAtRuPath(currGridId) == false) ) {
				
				cfMsg +="선택하신 CRN장비를 바탕으로 취득한 MRN을 포함하는 링구간이 조회되었습니다. 자동으로 사용링 처리 하시겠습니까? ";
				
				callMsgBox('','C', cfMsg, function(msgId, msgRst){   /**/
					// 사용링 형태로 셋팅
					if (msgRst == 'Y') {
						if (response.eqpSctnRghtInf[0].generateLeft == true && rowIndex > 0 && startEteFromCrnEqp == false) {
							rowIndex = rowIndex -1;
						}
						// 포커스 셋팅
						$('#'+currGridId).alopexGrid("focusCell",{_index:{row:rowIndex}} , "RIGHT_PORT_DESCR");
						setEteInfoToGridWithUseNetworkPath(response, currGridId, "UR");
					}
				});
			} 
			// 사용링이 없는경우
			else {
				// ETE 구간 종단에 MAIN-RN 장비 정보를 취득한 경우
				
				// ETE 구간의 종단에 SUB-RN 장비 정보를 취득한 경우
				if (response.crnEqpList != undefined && nullToEmpty(response.crnEqpList)!= "" && response.crnEqpList.length > 0) {
					
					cfMsg += response.eqpSctnRghtInf[0].rghtTopMtsoNm + "국사 소속의 C-RN장비목록이 조회되었습니다.<br> C-RN장비를 설정하시겠습니까?"
					
					callMsgBox('','C', cfMsg, function(msgId, msgRst){   /*XX국사 소속의 C-RN장비목록이 조회되었습니다.<br> C-RN장비를 설정하시겠습니까?*/
						// 장비선택
						if (msgRst == 'Y') {		
							openEqpListOfMtsoPop(response, currGridId, rowIndex);
						} 
					});
				} else {
					if (errMsg != "") {
						alertBox('W', errMsg);
						return;
					}
				}
			}
		} 
		// ETE선번이 없는 경우
		else {
			// 그냥 셋팅
			setEteInfoToGrid(response, currGridId);
			if (nullToEmpty(response.eqpSctnRghtInf) != "" && response.eqpSctnRghtInf.length > 0 && nullToEmpty(response.eqpSctnRghtInf[0].errMsg) != "") {  
				alertBox('W', response.eqpSctnRghtInf[0].errMsg);
				return;
			}
		}
	}
	

	/**
	 * 2019-01-15  4. 5G-PON고도화 5G-PON 서비스회선의 국사별 RN, FDF 장비 설정
	*/
	function openEqpListOfMtsoPop(data, gridId, rowIndex) {
		var param = data;

		// COT 정보
		param.fiveGponCotEqpNm = nullToEmpty(baseInfData.fiveGponCotEqpNm);
		param.fiveGponCotPortNm = nullToEmpty(baseInfData.fiveGponCotPortNm);
		// MRN 정보
		param.fiveGponMrnEqpMdlNm = getFiveGponEqpMdlNm(nullToEmpty(baseInfData.fiveGponMrnEqpMdlId), "MRN");
		param.fiveGponMrnPortNm = nullToEmpty(baseInfData.fiveGponMrnPortNm);
		
		// CRN정보
		param.fiveGponCrnEqpMdlId = nullToEmpty(baseInfData.fiveGponCrnEqpMdlId);
		param.fiveGponCrnEqpMdlNm = getFiveGponEqpMdlNm(nullToEmpty(baseInfData.fiveGponCrnEqpMdlId), "CRN");
		param.fiveGponCrnChnlNm = nullToEmpty(baseInfData.fiveGponCrnChnlNm);
		param.fiveGponCrnWaveNm = nullToEmpty(baseInfData.fiveGponCrnWaveNm);
		
		param.popTitle ="RN장비, FDF 장비 설정";
		$a.popup({
			  	popid: 'SubRnInfoPop',
			  	title: 'RN장비, FDF 장비 설정',
			    url: '/tango-transmission-web/configmgmt/cfline/EqpListOfMtsoPop.do',
			    data: param,
			    iframe: true,
			    modal : true,
			    movable : true,
			    windowpopup : true,
			    width : 1200,
			    height : 800,
			    callback:function(data){
			    	if(data != null){
			    		//console.log(data);
			    		if (nullToEmpty(data.eqpSctnRghtInf) != "" && data.eqpSctnRghtInf.length > 0) {
			    			
			    			// RN장비 기준 셋팅
			    			setCrnAndFdfInfoToGrid(data.eqpSctnRghtInf, gridId, rowIndex);
			    			
			    			// 연결장비 설정에서 ETE적용을 선택하거나 FDF설정없이 CRN장비만 설정한 경우 ETE작용 적용
			    			if (data.eteYn == "Y" || (data.eteYn == "N" && data.eqpSctnRghtInf[1].fiveGponEqpType == "CRN"  && nullToEmpty(data.rnInfo) != "" && nullToEmpty(data.rnInfo.eqpId) != "")) {
			    				cflineShowProgressBody();
			    				
			    				var eqpParam = {
			    						"eqpId" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftEqpId : "")
			    					  , "portNm" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftPortNm: "")
			    					  , "mtsoId" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftTopMtsoId: "")
			    					  , "generateLeft" : true
			    					  , "rxPortNm" : (data.eteYn == "Y" ? data.eqpSctnRghtInf[1].lftRxPortNm: "")
			    				};
			    				
			    				if (nullToEmpty(data.rnInfo) != "" && nullToEmpty(data.rnInfo.eqpId) != "") {
			    					eqpParam.crnEqpId = data.rnInfo.eqpId;    // CRN장비ID
			    					eqpParam.crnEqpNm = data.rnInfo.eqpNm;    // CRN장비ID
			    					eqpParam.crnPortId = data.rnInfo.bPortId; // CRN장비의 WEST(B)포트
			    					eqpParam.crnPortNm = data.rnInfo.bPortNm; // CRN장비의 WEST(B)포트 
			    					eqpParam.eqpInstlMtsoId = data.rnInfo.mtsoId; // CRN장비의 WEST(B)실장국사
			    				}
			    				eqpParam.appltTypeOfFiveg = baseInfData.appltTypeOfFiveg;
			    				eqpParam.ntwkLineNo = baseNtwkLineNo;
			    				eqpParam.lowMtsoId = nullToEmpty(baseInfData.lowMtsoId);
			    				eqpParam.fiveGponVer = nullToEmpty(baseInfData.fiveGponVer);
			    				
			    				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectEteInfWithEqpList', eqpParam, 'GET', 'selectEteInfWithEqpList'+gridId);
			    			}
			    		}
			    	}
			    	// 다른 팝업에 영향을 주지않기 위해
					$.alopex.popup.result = null; 
			    }
		});	
	}


	/*
	 * 2019-01-15  7. 5G-PON고도화
	 * CRN장비정보 셋팅
	 * setEqpPortInfo  : 선택 장비 정보
	 * rowIndex : 작업할 시작 row
	 */
	function setCrnAndFdfInfoToGrid(setEqpPortInfo, currGridId, rowIndex) {
		var rowData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_index:{row:rowIndex}})[0]);
		var rightDataList = AlopexGrid.trimData(rowData);
		var keyParam = "RIGHT";
		
		var lastData = {};
		for(var key in rightDataList) {
			if(key.indexOf(keyParam) == 0) {
				eval("lastData." + key + " = rightDataList." + key);
			} else {
				eval("lastData." + key + " = null");
			}
		}
		
		// RX포트설정
		var chRxPortYn = false;
		var addDataList = [];
		for(var i = 0; i < setEqpPortInfo.length; i++) {
			var addData = {};
			for(var key in setEqpPortInfo[i]) {
				eval("addData." + key + " = setEqpPortInfo[i]." + key);
				if (nullToEmpty(setEqpPortInfo[i].lftRxPortId) != "" || nullToEmpty(setEqpPortInfo[i].rghtRxPortId) != "") {
					chRxPortYn = true;
				}
			}
			addDataList.push(addData);
		}
		
		for(var i = 0; i < addDataList.length; i++) {	
			if(i == 0) {

				// ETE 정보 셋팅
				setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "T", chRxPortYn);
			} else if(i == addDataList.length-1) {
				$("#"+currGridId).alopexGrid('dataAdd', lastData, {_index:{row:rowIndex+i}});
				// ETE 정보 셋팅
				setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "L", chRxPortYn);
				
				// 만약 CRN 장비의 포트가 TX/RX인경우 RIGHT장비에 RX장비 셋팅 필요
				setRxEqpInfo("RIGHT", currGridId, rowIndex+i);
				
				// 5G-PON 2.0 CrN인 경우
    			if (nullToEmpty(addDataList[i].fiveGponEqpType) == "CRN" && isFiveGponRuCoreOld() == true) {
    				var channelVal = addDataList[i].portWave;
					var channelIds = [];
					/*for(var i = 0; i < data.length; i++) {
						if(i == 0) channelVal += "("; 
						channelVal += data[i].portWaveNm;
						if(i < (data.length-1) && data[i].portWaveNm != "") channelVal += "/";
						if(i == data.length-1) channelVal += ")"; 
						
						var temp = {"EQP_MDL_ID" : data[i].eqpMdlId, "EQP_MDL_DTL_SRNO" : data[i].eqpMdlDtlSrno};
						channelIds.push(temp);
					}*/
					
    				$('#'+currGridId).alopexGrid('cellEdit', null, {_index : { row : rowIndex+i}}, 'LEFT_CHANNEL_DESCR');
					$('#'+currGridId).alopexGrid('cellEdit', channelVal, {_index : { row : rowIndex+i}}, 'LEFT_CHANNEL_DESCR');
					$('#'+currGridId).alopexGrid('cellEdit', channelIds, {_index : { row : rowIndex+i}}, 'LEFT_CHANNEL_IDS');
    				//data[0].cardWavelength = data[0].portWaveNm;
    			}
			} else {
				var addEmptyData = {};
				$("#"+currGridId).alopexGrid('dataAdd', addEmptyData, {_index:{row:rowIndex+i}});

				// ETE 정보 셋팅
				setPathOfEteInfoOfFdf(addDataList[i], currGridId, rowIndex+i, "T", chRxPortYn);
			}
			setLinkDataNull(rowIndex+i, currGridId);
		}
		// 포커스 셋팅
		$("#"+currGridId).alopexGrid("startEdit");
		$('#'+currGridId).alopexGrid("focusCell",{_index:{row:rowIndex+1}} , "LEFT_PORT_DESCR");
	}
	
	/* 2019-01-15  7. 5G-PON고도화
	 * ETE결과 사용링처리
	 * response : ETE결과
	 * currGridId : 작업 그리드
	 * useNetworkType : 사용네트워크타입(UR : 사용링)
	 */
	function setEteInfoToGridWithUseNetworkPath(response, currGridId, useNetworkType) {
		var useNetwork = null;
		if (useNetworkType == "UR") {
			useNetwork = response.useRing;
		} else {
			//console.log("사용링만 제공");
			return;
		}
		var focusData = AlopexGrid.currentData($('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
		var rowIndex = focusData._index.row;
		var eteEqpList = response.eqpSctnRghtInf;
		var eteEqpCnt = response.eqpSctnRghtInf.length;
		
		var eteFdfTwoRow = false;
		var tmpLink = null;
		// 사용링 정보 셋팅
		var addLink = {};
		$("#"+currGridId).alopexGrid('dataAdd', addLink, {_index:{row:rowIndex}});
		
		var useRingPath = rowIndex;
		for (var i= 0; i < useNetwork.LINKS.length; i++) {
			tmpLink = useNetwork.LINKS[i];
			if (i == 0) {
				// 링의 첫 구간인 경우 해당 구간의 WEST 장비를 복제하여 서비스회선의 첫구간의 EAST 장비로 설정한다.
	    		// 추가된 첫 라인
	    		for(var key in tmpLink){
					if(key.indexOf('LEFT_') == 0 ) {
						var colKey = key.replace("LEFT_", "RIGHT_");
						$('#'+currGridId).alopexGrid( "cellEdit", eval("tmpLink."+key) , {_index : { row : useRingPath}}, colKey);	
					}
				}
	    		
	            // 좌장비 ADD_DROP타입설정
	    		$('#'+currGridId).alopexGrid( "cellEdit", "N", {_index : { row : useRingPath}}, "LEFT_ADD_DROP_TYPE_CD");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "NA", {_index : { row : useRingPath}}, "LEFT_NODE_ROLE_CD");	

	    		$('#'+currGridId).alopexGrid('refreshCell', {_index: {id: useRingPath}}, 'LEFT_FIVE_GPON_EQP_TYPE');  
	    		
	            // 우장비 정보 셋팅
	    		$('#'+currGridId).alopexGrid( "cellEdit", "", {_index : { row : useRingPath}}, "RIGHT_PORT_DESCR");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "", {_index : { row : useRingPath}}, "RIGHT_PORT_NM");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : useRingPath}}, "RIGHT_PORT_ID");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "A", {_index : { row : useRingPath}}, "RIGHT_ADD_DROP_TYPE_CD");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "NA", {_index : { row : useRingPath}}, "RIGHT_NODE_ROLE_CD");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : useRingPath}}, "RIGHT_RX_NE_ID");		
				$('#'+currGridId).alopexGrid( "cellEdit", "", {_index : { row : useRingPath}}, "RIGHT_RX_NE_NM");
				$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : useRingPath}}, "RIGHT_RX_PORT_ID");
				
				// 청약설정시 설정한 장비와 일치하는 경우
				if (nullToEmpty(baseInfData.fiveGponCotEqpId) == tmpLink.LEFT_NE_ID) {
					$('#'+currGridId).alopexGrid( "cellEdit", nullToEmpty(baseInfData.fiveGponCotPortNm), {_index : { row : useRingPath}}, "RIGHT_PORT_DESCR");	
		    		$('#'+currGridId).alopexGrid( "cellEdit", nullToEmpty(baseInfData.fiveGponCotPortNm), {_index : { row : useRingPath}}, "RIGHT_PORT_NM");	
		    		$('#'+currGridId).alopexGrid( "cellEdit", nullToEmpty(baseInfData.fiveGponCotPortId), {_index : { row : useRingPath}}, "RIGHT_PORT_ID");	
				}

	    		$('#'+currGridId).alopexGrid('refreshCell', {_index: {id: useRingPath}}, 'RIGHT_FIVE_GPON_EQP_TYPE');  
				useRingPath++;
			}
	
			// 사용링 처리
			tmpLink.USE_NETWORK_ID = useNetwork.NETWORK_ID;
			tmpLink.USE_NETWORK_NM = useNetwork.NETWORK_NM;
			tmpLink.USE_NETWORK_PATH_SAME_NO = useNetwork.PATH_SAME_NO;
			tmpLink.USE_NETWORK_PATH_DIRECTION = useNetwork.PATH_DIRECTION;
			tmpLink.USE_NETWORK_LINK_DIRECTION = useNetwork.PATH_DIRECTION;
		    
			tmpLink.RING_ID = useNetwork.NETWORK_ID;
			tmpLink.RING_NM = useNetwork.NETWORK_NM;
			tmpLink.RING_STATUS_CD = useNetwork.NETWORK_STATUS_CD;
			tmpLink.RING_STATUS_NM = useNetwork.NETWORK_STATUS_NM;
	        tmpLink.RING_PATH_SAME_NO = useNetwork.PATH_SAME_NO;
	        //tmpLink.RING_PATH_GROUP_NO = 1;
	        tmpLink.RING_PATH_DIRECTION = useNetwork.PATH_DIRECTION;
	        tmpLink.RING_TOPOLOGY_LARGE_CD = useNetwork.TOPOLOGY_LARGE_CD;
	        tmpLink.RING_TOPOLOGY_LARGE_NM = useNetwork.TOPOLOGY_LARGE_NM;
	        tmpLink.RING_TOPOLOGY_SMALL_CD = useNetwork.TOPOLOGY_SMALL_CD;
	        tmpLink.RING_TOPOLOGY_SMALL_NM = useNetwork.TOPOLOGY_SMALL_NM;
			
			tmpLink.LEFT_ADD_DROP_TYPE_CD = "T";
			tmpLink.RIGHT_ADD_DROP_TYPE_CD = "T";
	
			tmpLink.LEFT_NODE_ROLE_CD = "NA";
			tmpLink.RIGHT_NODE_ROLE_CD = "NA";
			
			// 장비정보 셋팅
			$("#"+currGridId).alopexGrid('dataAdd', tmpLink, {_index:{row:useRingPath}});
			useRingPath++;
			
			// 마지막 구간인 경우
			if (i == useNetwork.LINKS.length -1) {
				/*if (eteFdfTwoRow == false) {
					// 빈구간 삽입
					var addLink = {};
					$("#"+currGridId).alopexGrid('dataAdd', addLink, {_index:{row:useRingPath}});
					useRingPath++;
				}*/
				for(var key in tmpLink){
					if(key.indexOf('RIGHT_') == 0 ) {
						var colKey = key.replace("RIGHT_", "LEFT_");
						$('#'+currGridId).alopexGrid( "cellEdit", eval("tmpLink."+key) , {_index : { row : useRingPath}}, colKey);	
					}
				}
	
	            // 좌장비 정보 셋팅
	    		$('#'+currGridId).alopexGrid( "cellEdit", "", {_index : { row : useRingPath}}, "LEFT_PORT_DESCR");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "", {_index : { row : useRingPath}}, "LEFT_PORT_NM");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : useRingPath}}, "LEFT_PORT_ID");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "D", {_index : { row : useRingPath}}, "LEFT_ADD_DROP_TYPE_CD");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "NA", {_index : { row : useRingPath}}, "LEFT_NODE_ROLE_CD");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : useRingPath}}, "LEFT_RX_NE_ID");		
				$('#'+currGridId).alopexGrid( "cellEdit", "", {_index : { row : useRingPath}}, "LEFT_RX_NE_NM");
				$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : useRingPath}}, "LEFT_RX_PORT_ID");
	    		
	    		// Main-Rn장비정보가 있는경우 포트 설정
	    		if (nullToEmpty(response.mainRnInfo) != "" && response.mainRnInfo.lftEqpId != "" && response.mainRnInfo.lftPortId != ""  && nullToEmpty(baseInfData.fiveGponVer) == "2") {
	
	        		$('#'+currGridId).alopexGrid( "cellEdit", response.mainRnInfo.lftPortId, {_index : { row : useRingPath}}, "LEFT_PORT_ID");	
	        		$('#'+currGridId).alopexGrid( "cellEdit", response.mainRnInfo.lftPortNm, {_index : { row : useRingPath}}, "LEFT_PORT_NM");	
	        		$('#'+currGridId).alopexGrid( "cellEdit", response.mainRnInfo.lftPortNm, {_index : { row : useRingPath}}, "LEFT_PORT_DESCR");	
	    		}

	    		$('#'+currGridId).alopexGrid('refreshCell', {_index: {id: useRingPath}}, 'LEFT_FIVE_GPON_EQP_TYPE');  
				
	            // 우장비 ADD_DROP타입설정
	    		$('#'+currGridId).alopexGrid( "cellEdit", "N", {_index : { row : useRingPath}}, "RIGHT_ADD_DROP_TYPE_CD");	
	    		$('#'+currGridId).alopexGrid( "cellEdit", "NA", {_index : { row : useRingPath}}, "RIGHT_NODE_ROLE_CD");	
	    		

	    		$('#'+currGridId).alopexGrid('refreshCell', {_index: {id: useRingPath}}, 'RIGHT_FIVE_GPON_EQP_TYPE');  
			}
		}
	
		$("#"+currGridId).alopexGrid("startEdit");
		/* 2018-09-12  3. RU고도화 */ 
		setChangedMainPath(currGridId);
		
	}
	
	/**
	 * 2019-01-15  4. 5G-PON고도화 주선번이 한개도 없는경우 특정 그리드 선번 모두 삭제함(기본은 예비선번)
	*/
	function deleteSprPathAll(grid) {
		if (grid == null) {
			grid = reserveGrid;
		}
		
		var mainPath = $('#'+detailGridId).alopexGrid("dataGet");
		var chkPath = false;
		if (mainPath.length > 0) {
			for (var i = 0; i < mainPath.length; i++) {			
				if (nullToEmpty(mainPath[i].LEFT_NE_NM) != "" || nullToEmpty(mainPath[i].LEFT_NE_ID) != "" || nullToEmpty(mainPath[i].LEFT_PORT_DESCR) != "" || nullToEmpty(mainPath[i].LEFT_CHANNEL_DESCR) != ""
					|| nullToEmpty(mainPath[i].RIGHT_NE_NM) != "" || nullToEmpty(mainPath[i].RIGHT_NE_ID) != "" || nullToEmpty(mainPath[i].RIGHT_PORT_DESCR) != "" || nullToEmpty(mainPath[i].RIGHT_CHANNEL_DESCR) != "") {
					chkPath = true;
					break;
				}
			}
		}
		
		// 주선번이 없는경우 예비선번 전체삭제
		if (chkPath == false) {
			$('#'+reserveGrid).alopexGrid('dataEmpty');
		}
	}
	
	/**
	 * 5G-PON 2.0 장비 타입별 모델명 추출
	 * @param eqpMdlId : 장비모델 ID
	 * @param eqpMdlType : 장비모델 타입
	 */
	function getFiveGponEqpMdlNm(eqpMdlId, eqpMdlType) {
		var mdlList = [];
		
		if (eqpMdlType == "COT") {
			mdlList = baseInfData.fiveGponEqpMdlIdList.cotEqpMdlList;
		} else if (eqpMdlType == "MRN") {
			mdlList = baseInfData.fiveGponEqpMdlIdList.mrnEqpMdlList;
		} else if (eqpMdlType == "CRN") {
			mdlList = baseInfData.fiveGponEqpMdlIdList.crnEqpMdlList;
		}
		
		var eqpMdlNm = "";
		for (var i = 0; i < mdlList.length; i++) {
			if (eqpMdlId == mdlList[i].text) {
				eqpMdlNm = mdlList[i].comCdDesc;
				break;
			}
		}
		
		return eqpMdlNm;
	}
/******************************5G-PON 서비스회선용 ETE적용 END ****************************************************/
