/**
 * NetworkPathNodeEdit.js
 * 선번편집화면의 서브메뉴 (구간편집, 노드삽입 등의 메뉴에 대한 스크립트)
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 *  
 * 
 ************* 수정이력 ************
 * 2018-09-12  1. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2019-11-28  2. 기간망 링 선번 고도화 : MW PTP링 추가로 MW관련 장비 채널설정 가능하도록 수정
 * 2020-01-13  3. FDF장비군에 PBOX추가
 * 2020-08-05  4. [추가] e2eAppltyAuto : FDF선로 검색후 자동 ETE연결된 FDF구간 삽입시에 호출
 */
var cutData = {};

$a.page(function() {
	this.init = function(id, param) {
		
	}
});

var httpRequest = function(Url, Param, Method, Flag) {
	Tango.ajax({
		url : Url,			//URL 기존 처럼 사용하시면 됩니다.
		data : Param,		//data가 존재할 경우 주입
		method : Method,	//HTTP Method
		flag : Flag
	}).done(nodeSuccessCallback)
	  .fail(nodeFailCallback);
}

/**
 * 구간 삽입
 */
function sectionInsert(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var addData = {};
	$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
	$("#"+gridId).alopexGrid("startEdit");
}

/**
 * 구간 병합
 */
function sectionMerge(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	var prevDataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0]);
	var nextDataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0]);
	
	var mergeYn = false;
	var deleteRowIndex = -1;
	var keyParam = "";
	
	if(data._key.indexOf("LEFT") == 0) {
		keyParam = "LEFT";
		deleteRowIndex = rowIndex-1;
	} else if(data._key.indexOf("RIGHT") == 0) {
		keyParam = "RIGHT";
		deleteRowIndex = rowIndex+1;
	}
	
	// 무조건 우측 기준으로
	keyParam = "RIGHT";
	
	if(keyParam == "LEFT") {
		 
	} else if(keyParam == "RIGHT") {
		// 우장비
		/* 1. 현재 구간의 우장비가 null인 경우. 
			  - 현재 구간의 좌장비가 null인 경우
			      - 다음 구간의 둘 중 하나만 데이터가 있어거나 둘다 없어야 한다.
			  - 현재 구간의 좌장비가 null이 아닌 경우
			      - 다음 구간의 좌장비가 null이어야 한다.
			2. 현재 구간의 우장비가 null이 아닌 경우.
			  - 현재 구간의 좌장비가 null이고 다음 구간의 우장비가 null이어야 한다.
		*/
		if((dataObj.RIGHT_NE_ID == null || dataObj.RIGHT_NE_ID == "" || dataObj.RIGHT_NE_ID == "DV00000000000") ) {
			 // 현재 구간의 우장비가 null인 경우.
			if( (dataObj.LEFT_NE_ID == null || dataObj.LEFT_NE_ID == "" || dataObj.LEFT_NE_ID == "DV00000000000") ) {
				// 현재 구간의 좌장비가 null인 경우. // 다음 구간의 둘 중 하나만 데이터가 있어야 한다.
				if( (nextDataObj.LEFT_NE_ID == null || nextDataObj.LEFT_NE_ID == "" || nextDataObj.LEFT_NE_ID == "DV00000000000")  
						&& (nextDataObj.RIGHT_NE_ID != null && nextDataObj.RIGHT_NE_ID != "" && nextDataObj.RIGHT_NE_ID != "DV00000000000")  ) {
					// 좌장비가 없으면 우장비가 있어야 된다.
					mergeYn = true;
				} else if((nextDataObj.LEFT_NE_ID != null && nextDataObj.LEFT_NE_ID != "" && nextDataObj.LEFT_NE_ID == "DV00000000000")  
						&& (nextDataObj.RIGHT_NE_ID == null || nextDataObj.RIGHT_NE_ID == "" || nextDataObj.RIGHT_NE_ID != "DV00000000000")) {
					// 좌장비가 있으면 우장비가 없어야 된다.
					mergeYn = true;
				} else if((nextDataObj.LEFT_NE_ID == null || nextDataObj.LEFT_NE_ID == "" || nextDataObj.LEFT_NE_ID == "DV00000000000")  
						&& (nextDataObj.RIGHT_NE_ID == null || nextDataObj.RIGHT_NE_ID == "" || nextDataObj.RIGHT_NE_ID != "DV00000000000")) {
					// 둘다 없을 경우 merge
					mergeYn = true;
				}
			} else {
				// 현재 구간의 좌장비가 null이 아닌 경우
				if( (nextDataObj.LEFT_NE_ID == null || nextDataObj.LEFT_NE_ID == "" || nextDataObj.LEFT_NE_ID == "DV00000000000")) {
					// 다음 구간의 좌장비가 null이어야 된다.
					mergeYn = true;
				}
			}
		} else {
			// 현재 구간의 우장비가 null이 아닌 경우.
			if( (dataObj.LEFT_NE_ID == null || dataObj.LEFT_NE_ID == "" || dataObj.LEFT_NE_ID == "DV00000000000") ) {
				if( (nextDataObj.RIGHT_NE_ID == null || nextDataObj.RIGHT_NE_ID == "" || nextDataObj.RIGHT_NE_ID == "DV00000000000")) {
					mergeYn = true;
				}
			}
		}
	}
	
	if(mergeYn) {
		if(keyParam == "RIGHT") {
			var nextDataObjList = AlopexGrid.trimData(nextDataObj);
			for(var key in nextDataObjList) {
				if(key.indexOf(keyParam) == 0) {
					$('#'+gridId).alopexGrid( "cellEdit", eval("nextDataObjList."+key), {_index : { row : rowIndex}}, key);
				}
			}
			
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:deleteRowIndex }});
		} else if(keyParam == "LEFT") {
			var prevDataObjList = AlopexGrid.trimData(prevDataObj);
			for(var key in prevDataObjList) {
				if(key.indexOf(keyParam) == 0) {
					$('#'+gridId).alopexGrid( "cellEdit", eval("prevDataObjList."+key), {_index : { row : rowIndex}}, key);
				}
			}
			
			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:deleteRowIndex }});
		}
		
		/* 2018-09-12  3. RU고도화 */ 
    	setChangedMainPath(gridId);
	} else {
		alertBox('I', "병합할 수 없습니다.");
	}
}

/**
 * 노드 복사 
 */
function nodeCopy(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var keyParam = "";
	
	if(data._key == "LEFT_NE_NM") {
		$("#copyEqpNm").val(data.LEFT_NE_NM);
		$("#copyPortNm").val(data.LEFT_PORT_DESCR);
		keyParam = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		$("#copyEqpNm").val(data.RIGHT_NE_NM);
		$("#copyPortNm").val(data.RIGHT_PORT_DESCR);
		keyParam = "RIGHT";
	}

	$("#generate").val(keyParam);
	$("#copyCut").val("copy");
	$("#copyRowIndex").val(rowIndex);
	
	var dataObj = $('#'+gridId).alopexGrid("dataGet");
	
	resetCellBackgroundColor(rowIndex, keyParam, gridId);
	setCellBackgroundColor(rowIndex, keyParam, gridId);
}

/**
 * 노드 붙여넣기
 */
function nodeCopyPaste(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var currDataObject = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	// 붙여넣기를 위한 데이터
	var dataObj = $('#'+gridId).alopexGrid("dataGet");	
	//var dataObj = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet"));  현 편집중인 그리드 값을 복사하는 경우
	var schEqpNm = $("#copyEqpNm").val();
	var schPortNm = $("#copyPortNm").val();
	var copyRowIndex = $("#copyRowIndex").val();
	
	// 붙여넣기 하는 대상 구분
	var setParam = "";
	if(data._key == "LEFT_NE_NM") {
		setParam = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		setParam = "RIGHT";
	}
	
	var addData = {};
	var keyParam = "";
	
	// 복사한 대상 구분
	keyParam = $("#generate").val();
	for(var key in dataObj[copyRowIndex]) {
		if(key.indexOf(keyParam) == 0 && key != keyParam + "_NE_COPY") {
			var length = key.length;
			if(keyParam == "LEFT") {
				eval("addData." + key.substring(4, length) + " = dataObj[copyRowIndex]." + key);
			} else if(keyParam == "RIGHT") {
				eval("addData." + key.substring(5, length) + " = dataObj[copyRowIndex]." + key);
			}
			
		}
	}
	
//	for(var i = 0; i < dataObj.length; i++) {
//		if(nullToEmpty(dataObj[i].LEFT_NE_NM) == schEqpNm && nullToEmpty(dataObj[i].LEFT_PORT_DESCR) == schPortNm) {
//			keyParam = "LEFT";
//			for(var key in dataObj[i]) {
//				if(key.indexOf(keyParam) == 0 && key != "LEFT_NE_COPY") {
//					var length = key.length;
//					eval("addData." + key.substring(4, length) + " = dataObj[i]." + key);
//				}
//			}
//			break;
//		}
//		
//		if(nullToEmpty(dataObj[i].RIGHT_NE_NM) == schEqpNm  && nullToEmpty(dataObj[i].RIGHT_PORT_DESCR) == schPortNm) {
//			keyParam = "RIGHT";
//			for(var key in dataObj[i]) {
//				if(key.indexOf(keyParam) == 0 && key != "RIGHT_NE_COPY") {
//					var length = key.length;
//					eval("addData." + key.substring(5, length) + " = dataObj[i]." + key);
//				}
//			}
//			break;
//		}
//	}
	
	resetCellBackgroundColor($("#copyRowIndex").val(), $("#generate").val(), gridId);
	
	for(var key in currDataObject) {
		var keyColumn = "";
		// 현재 구간에서 좌,우 어느쪽에 붙여 넣을 것인지 체크
		if(key.indexOf(setParam) == 0) {
			var addKeyColumn = "";
			
			// 복사해온 데이터에서 붙여넣을 데이터 체크
			for(var addKey in addData) {
				addKeyColumn = setParam + addKey;
				
				if(key == addKeyColumn) {
					$('#'+gridId).alopexGrid( "cellEdit", eval("addData." + addKey), {_index : { row : rowIndex}}, addKeyColumn);
				}
			}
		}
	}
	
	// 마지막 줄이면 구간 하나 더 생성
	if(rowIndex == (dataObj.length-1)) {
		addRowNullData(gridId);
		$("#"+gridId).alopexGrid("startEdit");
	}
	
	// 리셋
	$("#copyEqpNm").val("");
	$("#copyPortNm").val("");
	$("#generate").val("");
	$("#copyCut").val("");
	$("#copyRowIndex").val("");
	cutData = {};
}

/**
 * 노드 잘라내기
 */
function nodeCut(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var keyParam = "";
	
	if(data._key == "LEFT_NE_NM") {
		keyParam = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		keyParam = "RIGHT";
	}

	$("#generate").val(keyParam);
	$("#copyCut").val("cut");
	$("#copyRowIndex").val(rowIndex);
	
	
	var dataObj = $('#'+gridId).alopexGrid("dataGet");	
	var currDataObject = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	/* 현 편집중인 그리드 값을 복사하는 경우
	var dataObj = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet"));
	var currDataObject = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }}))[0];
	*/
	
	for(var key in currDataObject) {
		if(key.indexOf(keyParam) == 0) {
			var length = key.length;
			if(keyParam == "LEFT") {
				eval("cutData." + key.substring(4, length) + " = currDataObject." + key);
			} else if(keyParam == "RIGHT") {
				eval("cutData." + key.substring(5, length) + " = currDataObject." + key);
			}
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
		}
	}
	
	resetCellBackgroundColor(rowIndex, keyParam, gridId);
	setCellBackgroundColor(rowIndex, keyParam, gridId);
}

/**
 * 노드 붙여넣기
 */
function nodeCutPaste(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var dataObj = $('#'+gridId).alopexGrid("dataGet");	
	var currDataObject = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	// 붙여넣기 하는 대상 구분
	var setParam = "";
	if(data._key == "LEFT_NE_NM") {
		setParam = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		setParam = "RIGHT";
	}
	
	for(var key in currDataObject) {
		var keyColumn = "";
		// 현재 구간에서 좌,우 어느쪽에 붙여 넣을 것인지 체크
		if(key.indexOf(setParam) == 0) {
			var addKeyColumn = "";
			
			// 복사해온 데이터에서 붙여넣을 데이터 체크
			for(var addKey in cutData) {
				addKeyColumn = setParam + addKey;
				
				if(key == addKeyColumn) {
					$('#'+gridId).alopexGrid( "cellEdit", eval("cutData." + addKey), {_index : { row : rowIndex}}, addKeyColumn);
				}
			}
		}
	}
	
	setLinkDataNull(rowIndex, gridId);
	
	resetCellBackgroundColor($("#copyRowIndex").val(), $("#generate").val(), gridId);
	$("#copyEqpNm").val("");
	$("#copyPortNm").val("");
	$("#generate").val("");
	$("#copyCut").val("");
	$("#copyRowIndex").val("");
	cutData = {};
	
	// 마지막 줄이면 구간 하나 더 생성
	if(rowIndex == (dataObj.length-1)) {
		addRowNullData(gridId);
		$("#"+gridId).alopexGrid("startEdit");
	}
}

/**
 * 취소 : 노드 복사, 잘라내기 취소
 */
function nodeCopyCutCancle(data, $cell, gridId) {
	var rowIndex = $("#copyRowIndex").val();
	var currDataObject = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	var copyCut = $("#copyCut").val();
	
	if(copyCut == "cut") {
		var setParam = $("#generate").val();
		for(var key in currDataObject) {
			for(var addKey in cutData) {
				addKeyColumn = setParam + addKey;
				
				if(key == addKeyColumn) {
					$('#'+gridId).alopexGrid( "cellEdit", eval("cutData." + addKey), {_index : { row : rowIndex}}, addKeyColumn);
				}
			}
		}
	}
	
	$("#copyEqpNm").val("");
	$("#copyPortNm").val("");
	$("#generate").val("");
	$("#copyCut").val("");
	$("#copyRowIndex").val("");
	cutData = {};
	resetCellBackgroundColor(null, null, gridId);
}

function setCellBackgroundColor(rowIndex, keyParam, gridId) {
	$('#'+gridId).alopexGrid("cellEdit", "copy", {_index : { row : rowIndex}}, keyParam + "_NE_COPY");
	$('#'+gridId).alopexGrid('startEdit');  
}

function resetCellBackgroundColor(rowIndex, keyParam, gridId) {
	// 복사한 노드의 배경색 되돌리기 
	var gridDataList = $('#'+gridId).alopexGrid("dataGet");
	
	for(var i = 0; i < gridDataList.length; i++) {
		$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "LEFT_NE_COPY");
		$('#'+gridId).alopexGrid("cellEdit", null, {_index : { row : i}}, "RIGHT_NE_COPY");
	}
	
	$('#'+gridId).alopexGrid('startEdit');  
}

/**
 * 노드 삭제
 */
function nodeDelete(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var keyParam = "";
	if(data._key == "LEFT_NE_NM") {
		keyParam = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		keyParam = "RIGHT";
	}
	
	var gridDataList = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	var currDataList = AlopexGrid.trimData(gridDataList);
	for(var key in currDataList) {
		if(key.indexOf(keyParam) == 0) {
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
		}
	}
	
	setLinkDataNull(rowIndex, gridId);
	
	
	// 이전 구간이나 다음구간 동시 삭제
	var changeRowIdx = "";
	var changeKeyParam = "";
	if(keyParam == "LEFT") {
		if(rowIndex > 0) changeRowIdx = rowIndex-1;
		changeKeyParam = "RIGHT";	
	} else if(keyParam == "RIGHT") {
		changeRowIdx = rowIndex+1;
		changeKeyParam = "LEFT";
	}
	
	var gridDataList = $('#'+gridId).alopexGrid("dataGet", {_index : { data:changeRowIdx }})[0];
	var changeDataList = AlopexGrid.trimData(gridDataList);
	
	if(nullToEmpty(changeDataList.USE_NETWORK_ID) == "") {
		for(var key in changeDataList) {
			if(key.indexOf(changeKeyParam) == 0) {
				$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : changeRowIdx}}, key);
			}
		}
		setLinkDataNull(changeRowIdx, gridId);
	}
}

function sectionSeparation2(gridId) {

	var rowIndex = 0;
	var gridDataList = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	var addDataList = AlopexGrid.trimData(gridDataList);
	var addData = {};
	
	var keyParam = "RIGHT";
	for(var key in addDataList) {
		if(key.indexOf("RIGHT") == 0) {
			eval("addData." + key + " = addDataList." + key);
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
		}
	}
	
	setLinkDataNull(rowIndex, gridId);
	$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
	$("#"+gridId).alopexGrid("startEdit");
}

/**
 * 구간 분리 -> 노드 삽입
 */
function sectionSeparation(data, $cell, gridId) {
//	$("#"+gridId).alopexGrid('clearFilter');
	var rowIndex = data._index.row;
	var gridDataList = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	var addDataList = AlopexGrid.trimData(gridDataList);
	var addData = {};
	
	var keyParam = "RIGHT";
	for(var key in addDataList) {
		if(key.indexOf("RIGHT") == 0) {
			eval("addData." + key + " = addDataList." + key);
			$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
		}
	}
	
	setLinkDataNull(rowIndex, gridId);
	$("#"+gridId).alopexGrid('dataAdd', addData, {_index:{row:rowIndex+1}});
	$("#"+gridId).alopexGrid("startEdit");
//	$('#'+gridId).alopexGrid('setFilter', 'filterVisibleLink', filterVisibleLink);
}

/**
 * 구간 뒤집기
 */
function reverseLink(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var reverseYn = true;
	var dataNullYn = true;
	
	if(gridDivision == "serviceLine") {
		// 2018-09-12  3. RU고도화
		reverseYn = (data.SERVICE_MERGE === data.SERVICE_ID || data.TRUNK_MERGE === data.TRUNK_ID || data.TRUNK_MERGE === data.RING_ID || data.TRUNK_MERGE === data.WDM_TRUNK_ID) ? false : true;
	} else if(gridDivision == "trunk") {
		reverseYn = (data.RING_MERGE === data.RING_ID) ? false : true;
	} else if(gridDivision == "ring" || gridDivision == "wdm") {
		reverseYn = (data.WDM_TRUNK_MERGE == data.WDM_TRUNK_ID) ? false : true;
	}
	
	if( (data.LEFT_NE_ID == null || data.LEFT_NE_ID == "") && ( data.RIGHT_NE_ID == null || data.RIGHT_NE_ID == "") ) {
		dataNullYn = false;
	}
	
	if(reverseYn && dataNullYn) {
		for(var key in data) {
			if(key.indexOf("LEFT") == 0) {
				var length = key.length;
				var column = "RIGHT" + key.substring(4, length);
				$('#'+gridId).alopexGrid( "cellEdit", eval("data." + key), {_index : { row : rowIndex}}, column);
			} else if(key.indexOf("RIGHT") == 0) {
				var length = key.length;
				var column = "LEFT" + key.substring(5, length);
				$('#'+gridId).alopexGrid( "cellEdit", eval("data." + key), {_index : { row : rowIndex}}, column);
			} 
		}
		
		if(data.LINK_ID != null) {
			var linkDirection = data.LINK_DIRECTION;
			if(linkDirection == 'RIGHT') {
				$('#'+gridId).alopexGrid( "cellEdit", 'LEFT', {_index : { row : rowIndex}}, 'LINK_DIRECTION');
			} else if(linkDirection == 'LEFT') {
				$('#'+gridId).alopexGrid( "cellEdit", 'RIGHT', {_index : { row : rowIndex}}, 'LINK_DIRECTION');
			}
		}
	} else {
		alertBox('W', cflineMsgArray['notReverseLink']); /* 구간뒤집기를 할수 없습니다. */
	}
	
}

/**
 * 장비 복사
 */
function equipmentCopy(data, $cell, gridId) {
	var rowIndex = data._index.row;
	if(data._key == "LEFT_NE_NM") {
		$("#copyEqpNm").val(data.LEFT_NE_NM);
	} else if(data._key == "RIGHT_NE_NM") {
		$("#copyEqpNm").val(data.RIGHT_NE_NM);
	}
}

/**
 * 장비 붙여넣기
 * 그리드에서 장비명으로 검색하여 동일한 장비 셋팅. 기존 장비가 있을 경우 바꿔준다
 */
function equipmentPaste(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var currDataObject = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
	
	// 붙여넣기를 위한 데이터
	var dataObj = $('#'+gridId).alopexGrid("dataGet");	
	var schEqpNm = $("#copyEqpNm").val();
//	var schPortNm = $("#copyPortNm").val();
	
	// 붙여넣기 하는 대상 구분
	var setParam = "";
	if(data._key == "LEFT_NE_NM") {
		setParam = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		setParam = "RIGHT";
	}
	
	var addData = {};
	var keyParam = "";
	
	// 복사한 대상 구분
	for(var i = 0; i < dataObj.length; i++) {
		if(dataObj[i].LEFT_NE_NM == schEqpNm) {
			keyParam = "LEFT";
			for(var key in dataObj[i]) {
				if(key.indexOf(keyParam) == 0) {
					var length = key.length;
					eval("addData." + key.substring(4, length) + " = dataObj[i]." + key);
				}
			}
			break;
		}
		
		if(dataObj[i].RIGHT_NE_NM == schEqpNm) {
			keyParam = "RIGHT";
			for(var key in dataObj[i]) {
				if(key.indexOf(keyParam) == 0) {
					var length = key.length;
					eval("addData." + key.substring(5, length) + " = dataObj[i]." + key);
				}
			}
			break;
		}
	}
	
	var neColumnList = [  
	                    "_JRDT_TEAM_ORG_ID", "_JRDT_TEAM_ORG_NM", "_OP_TEAM_ORG_ID", "_OP_TEAM_ORG_NM", "_ORG_ID_L3", "_ORG_NM_L3"
	                    , "_ORG_ID", "_ORG_NM", "_MODEL_LCL_CD", "_MODEL_LCL_NM", "_MODEL_MCL_CD", "_MODEL_MCL_NM"
	                    , "_MODEL_SCL_CD", "_MODEL_SCL_NM", "_MODEL_ID", "_MODEL_NM", "_VENDOR_ID", "_VENDOR_NM"
	                    , "_NE_ID", "_NE_NM", "_NE_STATUS_CD", "_NE_STATUS_NM", "_NE_DUMMY", "_NE_ROLE_CD", "_NE_ROLE_NM", "_NE_REMARK"
	                    ];
	
	for(var i = 0; i < neColumnList.length; i++) {
		for(var addKey in addData) {
			var addKeyColumn = "";
			addKeyColumn = setParam + addKey;
			if(neColumnList[i] == addKey) {
				$('#'+gridId).alopexGrid( "cellEdit", eval("addData." + addKey), {_index : { row : rowIndex}}, addKeyColumn);
			}
		}
	}
//	for(var key in currDataObject) {
//		var keyColumn = "";
//		// 현재 구간에서 좌,우 어느쪽에 붙여 넣을 것인지 체크
//		if(key.indexOf(setParam) == 0) {
//			var addKeyColumn = "";
//			
//			// 복사해온 데이터에서 붙여넣을 데이터 체크
//			for(var addKey in addData) {
//				addKeyColumn = setParam + addKey;
//				
//				if(key == addKeyColumn) {
//					$('#'+gridId).alopexGrid( "cellEdit", eval("addData." + addKey), {_index : { row : rowIndex}}, addKeyColumn);
//				}
//			}
//		}
//	}
	
	// 마지막 줄이면 구간 하나 더 생성
	if(rowIndex == (dataObj.length-1)) {
		addRowNullData(gridId);
		$("#"+gridId).alopexGrid("startEdit");
	}
}

/**
 * 포트 복사
 */
function portCopy(data, $cell, gridId) {
	var rowIndex = data._index.row;
	if(data._key == "LEFT_PORT_DESCR") {
		$("#copyPortNm").val(data.LEFT_PORT_DESCR);
	} else if(data._key == "RIGHT_PORT_DESCR") {
		$("#copyPortNm").val(data.RIGHT_PORT_DESCR);
	}
}
/**
 * 포트 붙여넣기
 */
function portPaste(data, $cell, gridId) {
	var neId = "";
	if(data._key == "LEFT_PORT_DESCR") {
		neId = data.LEFT_NE_ID;
	} else if(data._key == "RIGHT_PORT_DESCR") {
		neId = data.RIGHT_NE_ID;
	}
	
	var schPortNm = $("#copyPortNm").val();
	var paramData = {"neId" : neId, "portNm" : schPortNm};
	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/selectPortByEqp', paramData, 'GET', 'selectPortByEqp'+gridId);
}

/**
 * 장비 위로
 * 윗 구간의 동일 방향 장비가 비어 있을 경우 위로 이동
 */
function equipmentUp(data, $cell, gridId) {
	var rowIndex = data._index.row;
	if(rowIndex > 0) {
		var prevDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex-1 }})[0];
		var param = "";
		
		if(data._key == "LEFT_NE_NM") {
			// 좌장비 올리기
			param = "LEFT";
		} else if(data._key == "RIGHT_NE_NM") {
			// 우장비 올리기
			param = "RIGHT";
		}
		
		var addData = {};
		if( (eval("data." + param + "_NE_ID") != null || eval("data." + param + "_NE_ID") != "DV00000000000")  
				&& (eval("prevDataObj." + param + "_NE_ID") == null || eval("prevDataObj." + param + "_NE_ID") == "DV00000000000")) {
			for(var key in data) {
				if(key.indexOf(param) == 0) {
					eval("addData." + key + " = data." + key);
					$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
				}
			}
			
			for(var prevRowKey in prevDataObj) {
				$.each(addData, function(key,val){
			 		if(key == prevRowKey){
			 			$('#'+gridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex-1}}, key);
			 		}         		
			 	});
			}
		} else {
			alertBox('W', cflineMsgArray['noMoveEqp']);
		}
		
		// 장비 이동 후 현재 구간의 데이터가 없을 경우 삭제
//		var dataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
//		if( (dataObj.LEFT_NE_ID == null || dataObj.LEFT_NE_ID == "DV00000000000") 
//				&& (dataObj.RIGHT_NE_ID == null || dataObj.RIGHT_NE_ID == "DV00000000000") ) {
//			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
//		}
	} else {
		alertBox('W', '첫 구간입니다.');
	}
}

/**
 * 장비 아래로
 * 아래 구간의 동일 방향 장비가 비어 있을 경우 아래로 이동
 */
function equipmentDown(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var dataObj = $('#'+gridId).alopexGrid("dataGet");
	
	var nextDataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex+1 }})[0];
	var param = "";
	
	if(data._key == "LEFT_NE_NM") {
		// 좌장비 내리기
		param = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		// 우장비 내리기
		param = "RIGHT";
	}
	
	var addData = {};
	if( (eval("data." + param + "_NE_ID") != null || eval("data." + param + "_NE_ID") != "DV00000000000")  
			&& (eval("nextDataObj." + param + "_NE_ID") == null || eval("nextDataObj." + param + "_NE_ID") == "DV00000000000")) {
		for(var key in data) {
			if(key.indexOf(param) == 0) {
				eval("addData." + key + " = data." + key);
				$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
			}
		}
		
		for(var nextRowKey in nextDataObj) {
			$.each(addData, function(key,val) {
		 		if(key == nextRowKey){
		 			$('#'+gridId).alopexGrid( "cellEdit", val, {_index : { row : rowIndex+1}}, key);
		 		} 
		 	});
		}
	} else {
		alertBox('W', cflineMsgArray['noMoveEqp']);
	}
		
	if(rowIndex == (dataObj.length-2)) {
		addRowNullData(gridId);
		$("#"+gridId).alopexGrid("startEdit");
	}
		
	// 장비 이동 후 현재 구간의 데이터가 없을 경우 삭제
//		var dataObj = $('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0];
//		if( (dataObj.LEFT_NE_ID == null || dataObj.LEFT_NE_ID == "DV00000000000") 
//				&& (dataObj.RIGHT_NE_ID == null || dataObj.RIGHT_NE_ID == "DV00000000000") ) {
//			$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
//		}
//	}
}
 
/**
 * 장비 옆으로
 * 아래 구간의 동일 방향 장비가 비어 있을 경우 아래로 이동
 */
function equipmentASide(data, $cell, gridId) {
	var rowIndex = data._index.row;
	var param = "";
	var partnerParam = "";
	
	if(data._key == "LEFT_NE_NM") {
		// 좌장비 내리기
		param = "LEFT";
		partnerParam = "RIGHT";
	} else if(data._key == "RIGHT_NE_NM") {
		// 우장비 내리기
		param = "RIGHT";
		partnerParam = "LEFT";
	}
	
	if( (eval("data." + param + "_NE_ID") != null || eval("data." + param + "_NE_ID") != "DV00000000000")
		&& (eval("data." + partnerParam + "_NE_ID") == null || eval("data." + partnerParam + "_NE_ID") == "DV00000000000") ) {
		for(var key in data) {
			var column = "";
			if(key.indexOf(param) == 0) {
				var length = key.length;
				if(param == "LEFT") {
					column = "RIGHT" + key.substring(4, length);
				} else if(param == "RIGHT") {
					column = "LEFT" + key.substring(5, length);
				}
				
				$('#'+gridId).alopexGrid( "cellEdit", eval("data." + key), {_index : { row : rowIndex}}, column);
				$('#'+gridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, key);
			}
		}
	} else {
		alertBox('W', cflineMsgArray['noMoveEqp']);
	}
}


/**
 * 장비 비고
 */
function openEqpRemarkPop(data, $cell, grid) {
	var eqpId = "";
	var eqpKey = "";
		
	if(data._key == "LEFT_NE_NM") {
		eqpId = data.LEFT_NE_ID;
		eqpKey = "LEFT";
	} else if(data._key == "RIGHT_NE_NM") {
		eqpId = data.RIGHT_NE_ID;
		eqpKey = "RIGHT";
	}
	
	if(eqpId == "" || eqpId == null) return;
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	var paramData = {"ntwkLineNo" : baseNtwkLineNo, "eqpSctnId" : data.LINK_ID, "lftEqpRmk" : data.LEFT_NE_REMARK, "rghtEqpRmk" : data.RIGHT_NE_REMARK, "eqpKey" : eqpKey, "division" : gridDivision};
	$a.popup({
	  	popid: "EqpRemarkInfPop" + data._key,
	  	title: '비고',
	  	url: urlPath + '/configmgmt/cfline/EqpRemarkInfPop.do',
	  	data: paramData,
		modal: true,
		movable:true,
		width : 300,
		height : 180,
		callback:function(data){
//			cflineShowProgressBody();
//			if(gridDivision == "serviceLine") {
//				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectLinePath', params, 'GET', 'linePathSearch');
//			} else {
//				httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', params, 'GET', 'networkPathSearch');
//			}
		}
	});
}

/**
 * 커플러 추가
 */
function openCouplerPop(data, $cell, grid) {
	
	if (grid == null || grid == "null" || grid == "") {
		grid = detailGridId;
	}
	// 팝업 오픈 여부 판단
	var focusData = AlopexGrid.currentData($('#'+grid).alopexGrid("dataGet", {_state : {focused : true}})[0]);
	var rowIndex = focusData._index.row;
	var dataObj = AlopexGrid.parseEvent(event);
	var popOpenYn = true;
	
	// 더블클릭이나 엔터로 호출한 경우
	if(dataObj.$cell != undefined) {
		var editing = dataObj.$cell.context.classList;
	 	var editYn = false;
	 	
	 	for(var i = 0; i < editing.length; i++) {
	 		if(editing[i] == 'editing') {
	 			editYn = true;
	 		}
	 	}
	 	
	 	
	 	if(!editYn && !(focusData._state.editing == false)) {
	 		popOpenYn = true;
	 	} else {
	 		popOpenYn = false;
	 	}
	}
	
	if(popOpenYn) {
		var eqpMdlId = "";
		var eqpRoleCd = "";
		var eqpKey = "";
		var eqpRoleCd = "";
		var portNm = "";
		var rxPortNm = "";

		var fiveGponCrn =false;
		var ntwkLineNo = "";
		var ringIndex = 0;
		
		var ringIndex = AlopexGrid.currentData($('#'+grid).alopexGrid("dataGet", {_state : {focused : true}})[0])._index.row;
		
		if(data._key == "LEFT_CHANNEL_DESCR") {
			eqpMdlId = data.LEFT_MODEL_ID;
			eqpRoleCd = data.LEFT_NE_ROLE_CD;
			eqpKey = "LEFT";
			ntwkLineNo = nullToEmpty(data.RING_ID);
			if (nullToEmpty(data.LEFT_FIVE_GPON_EQP_TYPE) == "CRN") {
				fiveGponCrn = true;
				portNm = nullToEmpty(data.LEFT_PORT_NM);
			}
			ringIndex = (ringIndex < 1 ? 0 : ringIndex-1);
		} else if(data._key == "RIGHT_CHANNEL_DESCR") {
			eqpMdlId = data.RIGHT_MODEL_ID;
			eqpRoleCd = data.RIGHT_NE_ROLE_CD;
			eqpKey = "RIGHT";
			ntwkLineNo = nullToEmpty(data.RING_ID);
			if (nullToEmpty(data.RIGHT_FIVE_GPON_EQP_TYPE) == "CRN") {
				fiveGponCrn = true;
			}

			ringIndex = ((ringIndex+1) == (AlopexGrid.currentData($('#'+grid).alopexGrid("dataGet")).length) ? ringIndex : ringIndex+1);
		} else if(data.mapping.key == "LEFT_CHANNEL_DESCR") {
			eqpMdlId = data.data.LEFT_MODEL_ID;
			eqpRoleCd = data.data.LEFT_NE_ROLE_CD;
			eqpKey = "LEFT";
			ntwkLineNo = nullToEmpty(data.data.RING_ID);

			if (nullToEmpty(data.data.LEFT_FIVE_GPON_EQP_TYPE) == "CRN") {
				fiveGponCrn = true;
			}

			ringIndex = (ringIndex < 1 ? 0 : ringIndex-1);
		} else if(data.mapping.key == "RIGHT_CHANNEL_DESCR") {
			eqpMdlId = data.data.RIGHT_MODEL_ID;
			eqpRoleCd = data.data.RIGHT_NE_ROLE_CD;
			eqpKey = "RIGHT";
			ntwkLineNo = nullToEmpty(data.data.RING_ID);
			
			if (nullToEmpty(data.data.RIGHT_FIVE_GPON_EQP_TYPE) == "CRN") {
				fiveGponCrn = true;
			}

			ringIndex = ((ringIndex+1) == (AlopexGrid.currentData($('#'+grid).alopexGrid("dataGet")).length) ? ringIndex : ringIndex+1);
		}
		
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
		
		
		if((eqpRoleCd == '183' || eqpRoleCd == '184') && isSubScriRingOld() == true) {
			alertBox('W', 'BC-MUX, CWDM-MUX 파장은 <br>포트 설정을 통해 설정하시거나 <br> 직접 입력해 주세요.');
			return;
		}	 
		// MW 장비인 경우(2019-12-04 MW장비 채널 사용않함) 
		var chkMwEqpMdlId = [
							/* MW 장비 2019-11-21 */
							 'DMT0001637', 'DMT0001638' , 'DMT0001639' , 'DMT0001660' , 'DMT0001661'  
							];
		var microWaveChk = false;
		/*for(var i=0; i < chkMwEqpMdlId.length; i++){
			if(eqpMdlId == chkMwEqpMdlId[i]) {
				microWaveChk = true;
				break;
			}
		}*/
		
		if(couplerChk  == true
			|| microWaveChk == true
			//|| (fiveGponCrn == true && isFiveGponRuCoreOld() == true)
		  ) {
			if(eqpMdlId == "" || eqpMdlId == null) {
				alertBox('W', cflineMsgArray['setEqp']);
				return;
			}
			
			var urlPath = $('#ctx').val();
			if(nullToEmpty(urlPath) ==""){
				urlPath = "/tango-transmission-web";
			}
			
			// 만약 MW 장비인 경우 특정링의 채널 수만큼 조회 하기 위해
			if (microWaveChk == true ){
				// 링 번호 취득
				if (isMWPtpRingOld() == true) {
					ntwkLineNo = baseNtwkLineNo;
				}
				// 왼쪽 장비면 바로 이전 선번의 RING번호 취득
				else {
					// ringIndex 정보를 이용하여 링정보를 취득
					if (ntwkLineNo == "") {
						 var tempRingData= $('#'+grid).alopexGrid("dataGet", {_index : { data:ringIndex }});
						 ntwkLineNo = (tempRingData.length == 0 ? "" : tempRingData[0].RING_ID);
					}
				}
			}
			
			var paramData = {"eqpMdlId" : eqpMdlId, "eqpRoleCd" : eqpRoleCd, "ntwkLineNo" : ntwkLineNo, "microWaveEqpYn" : (microWaveChk == true ? "Y" : "N")};
			$a.popup({
			  	popid: "RingCouplerPop" + eqpKey,
			  	title: (eqpRoleCd == '10' ? '채널' : '파장') +  '조회',
			  	url: urlPath + '/configmgmt/cfline/RingCouplerPop.do',
			  	data: paramData,
				modal: true,
				movable:true,
				iframe: true,
//				windowpopup : true,
				width : 480,
				height : 640,
				callback:function(data){
					if(data != null){
						var channelVal = "";
						channelIds = [];
						for(var i = 0; i < data.length; i++) {
							/* 2019-11-28 MW 장비의 경우 해당 팝업이 채널을 선택하는 팝업으로 사용되도록 수정함
							 * MW장비의 경우 채널 설정, 포트와의 구분자 , 로 사용
							 * MW장비이외경우 파장 설정, 포트와의 구분자 () 로 사용
							 */
							if(i == 0) channelVal += (microWaveChk == true  ? "," : "("); 
							channelVal += (microWaveChk == true  ? data[i].chnlVal : data[i].wavlVal);   // 장비의 모델이 M/W인 경우 파장이 아닌 채널을 셋팅
							if(i < (data.length-1) && data[i].wavlVal != "") channelVal += "/";
							if(i == data.length-1) channelVal += (microWaveChk == true  ? "" : ")"); 
							
							var temp = {"EQP_MDL_ID" : data[i].eqpMdlId, "EQP_MDL_DTL_SRNO" : data[i].eqpMdlDtlSrno};
							channelIds.push(temp);
						}

						var focusData = AlopexGrid.currentData($('#'+grid).alopexGrid("dataGet", {_state : {focused : true}})[0]);
						var rowIndex = focusData._index.row;
						$('#'+grid).alopexGrid('cellEdit', null, {_index : { row : rowIndex}}, eqpKey + '_CHANNEL_DESCR');
						$('#'+grid).alopexGrid('cellEdit', channelVal, {_index : { row : rowIndex}}, eqpKey + '_CHANNEL_DESCR');
						$('#'+grid).alopexGrid('cellEdit', channelIds, {_index : { row : rowIndex}}, eqpKey + '_CHANNEL_IDS');
					}
				}
			});
		}
		else {
			alertBox('W', '파장 추가 불가능한 모델입니다.');
		}
	}
}

function nodeSuccessCallback(response, status, jqxhr, flag) {
	if(flag.indexOf("selectPortByEqp") == 0) {
		if(response.portInf.length > 0) {
			var currGridId = flag.replace("selectPortByEqp", "");
			var focusData = $('#'+currGridId).alopexGrid("dataGet", {_state : {focused : true}})[0];
			var rowIndex = focusData._index.row;
			var param = "";
			if(focusData._key.indexOf("LEFT") == 0) {
				param = "LEFT";
			} else if(focusData._key.indexOf("RIGHT") == 0) {
				param = "RIGHT";
			}
			
			if(param == "LEFT" || param == "RIGHT") {
				// 포트 column set
				var txColumnList = [  
				                    "PORT_DESCR", "RACK_NO", "RACK_NM", "SHELF_NO", "SHELF_NM", "SLOT_NO", "CARD_ID", "CARD_NM", "CARD_STATUS_CD"
				                    , "PORT_ID", "PORT_NM", "PORT_STATUS_CD", "PORT_STATUS_NM", "PORT_DUMMY", "CHANNEL_DESCR"
				                    , "PORT_USE_TYPE_NM", "CARD_WAVELENGTH"
				                    ];
				 
		//		if(serviceLineYn == "Y" && svlnSclCd == "016"){
		//			$('#'+gridId).alopexGrid("showCol", "physPortNm");
		//		} 
				// FDF 장비일 경우
				var eqpRoleDivCd = eval("focusData." + param + "_NE_ROLE_CD");
				if(eqpRoleDivCd == "11" || eqpRoleDivCd == "162" || eqpRoleDivCd == "177" || eqpRoleDivCd == "178" || eqpRoleDivCd == "182") {
					if(response.portInf[0].coreLockYn == "Y") {
						// 그린코어
						msg = '해당 포트는 GIS상의 그린 코어입니다. 등록하시겠습니까?';
						
						callState = "callMsgBox";
					} else if(response.portInf[0].portStatCd == "0001") {
						// 운용
						msg = '이미 연결되어 사용중인 포트 입니다. 사용하시겠습니까?';
						if(response.portInf[0].coreCnntRmk != null) msg += '(' + response.portInf[0].coreCnntRmk + ')';
						
						callState = "callMsgBox";
					} else if(response.portInf[0].portStatCd == "0002") {
						// 미사용
						callState = "close";
					} else if(response.portInf[0].portStatCd == "0003") {
						// 폐기/고장
						msg = "폐기 장비는 선택 불가능합니다.";
						callState = "alertBox";
					} else if(response.portInf[0].portStatCd == "0004") {
						// 폐기/고장
						msg = "고장 장비는 선택 불가능합니다.";
						callState = "alertBox";
					} else if(response.portInf[0].portStatCd == "0005") {
						// 예비상태
						msg = '예비로 구분된 포트 입니다.';
						if(response.portInf[0].coreCnntRmk != null) msg += '(' + response.portInf[0].coreCnntRmk + ')';
						
						callState = "callMsgBox";
					} else {
						// 미진입
						msg = "미인입 장비는 선택 불가능합니다.";
						callState = "alertBox";
					}
					
					
					if(callState == "callMsgBox") {
						callMsgBox('','C', msg, function(msgId, msgRst) {
							if(msgRst == 'Y') {
								$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param + "_" + "PORT_DESCR");
								$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param + "_" + "PORT_ID");
								setEqpData(param, rowIndex, response.portInf[0], txColumnList, currGridId);
							}
						});
					} else if(callState == "alertBox"){
						alertBox('W', msg);
					} else {
						$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param + "_" + "PORT_DESCR");
						$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param + "_" + "PORT_ID");
						setEqpData(param, rowIndex, response.portInf[0], txColumnList, currGridId);
					}
				} else {
					$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param + "_" + "PORT_DESCR");
					$('#'+currGridId).alopexGrid( "cellEdit", null, {_index : { row : rowIndex}}, param + "_" + "PORT_ID");
					setEqpData(param, rowIndex, response.portInf[0], txColumnList, currGridId);
				}
			} else {
				alertBox('I', "포트 항목이 아닙니다.");
			}
		} else {
			alertBox('I', "사용 가능한 포트가 없습니다.");
		}
		
	}
	
}

/**
 * E2E 적용
 * 
 * @param data
 * @param $cell
 * @param gridId
 */
function e2eApplty(data, $cell, gridId) {
	// 더미 장비가 아니면
	var lftEqpId = "";
	var lftPortNm = "";
	var lftEqpInstlMtsoId = "";
	var generateLeft = false;
	
	// 2018-09-12  1. RU고도화 RX포트가 있는경우 ETE 작업
	var lftRxPortNm = "";
	var mappingKey = data._key;
	
	if(data._key == "LEFT_PORT_DESCR") {
		lftEqpId = data.LEFT_NE_ID;
		lftPortNm = data.LEFT_PORT_NM;
		lftEqpInstlMtsoId = data.LEFT_ORG_ID;
		generateLeft = true;		
	} else if(data._key == "RIGHT_PORT_DESCR") {
		lftEqpId = data.RIGHT_NE_ID;
		lftPortNm = data.RIGHT_PORT_NM;
		lftEqpInstlMtsoId = data.RIGHT_ORG_ID;
		generateLeft = false;
	}
	
	var orgPortDescr = eval("data."+mappingKey);
	
	// RX가 있는 경우 
	if (nullToEmpty(orgPortDescr) !="" ) {
		var rxStrIdx = orgPortDescr.indexOf("(");
		var rxEndIdx = orgPortDescr.indexOf(")");
		if (rxStrIdx > 0 && rxEndIdx > rxStrIdx) {
			lftRxPortNm = orgPortDescr.substr((rxStrIdx +1), (rxEndIdx - rxStrIdx -1)) ;
		}
	}
	
	//console.log("PORT_DESCR : " + orgPortDescr +  ".......... RX_PORT_NM : " + lftRxPortNm);
	cflineShowProgressBody();
	var eqpParam = {"lftEqpId" : lftEqpId, "lftPortNm" : lftPortNm, "lftEqpInstlMtsoId" : lftEqpInstlMtsoId, "generateLeft" : generateLeft, "lftRxPortNm" : lftRxPortNm};
	if (isFiveGponRuCoreOld() == false ) {
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectEqpSctnRghtInf', eqpParam, 'GET', 'selectEqpSctnRghtInf'+gridId);
	} else {
		eqpParam = {"eqpId" : lftEqpId, "portNm" : lftPortNm, "mtsoId" : lftEqpInstlMtsoId, "generateLeft" : generateLeft, "rxPortNm" : lftRxPortNm};
		eqpParam.appltTypeOfFiveg = baseInfData.appltTypeOfFiveg;
		eqpParam.ntwkLineNo = baseNtwkLineNo;
		eqpParam.lowMtsoId = nullToEmpty(baseInfData.lowMtsoId);
		eqpParam.fiveGponVer = nullToEmpty(baseInfData.fiveGponVer);
		
		
		// 좌장비중 CRN장비_포트가 있는지 체크 

 		var crnDataObj = $('#'+gridId).alopexGrid("dataGet", {'LEFT_FIVE_GPON_EQP_TYPE' :'CRN'}, 'LEFT_FIVE_GPON_EQP_TYPE');
		if (crnDataObj.length > 0 && crnDataObj[0]._index.row > data._index.row) {
			eqpParam.crnEqpId = crnDataObj[0].LEFT_NE_ID;    // CRN장비ID
			eqpParam.crnEqpNm = crnDataObj[0].LEFT_NE_NM;    // CRN장비명
			eqpParam.crnPortId = crnDataObj[0].LEFT_PORT_ID; // CRN장비의 WEST(B)포트 
			eqpParam.crnPortNm = crnDataObj[0].LEFT_PORT_NM; // CRN장비의 WEST(B)포트 명
			eqpParam.eqpInstlMtsoId = crnDataObj[0].LEFT_ORG_ID; // CRN장비의 WEST(B)장비실장국사
			
		}
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectEteInfWithEqpList', eqpParam, 'GET', 'selectEteInfWithEqpList'+gridId);
	}
}

function nodeFailCallback() {
	
}

/**
 * E2E 적용
 * FDF선로 검색후 자동 ETE연결된 FDF구간 삽입시에 호출
 * @param data
 * @param $cell
 * @param gridId
 */
function e2eAppltyAuto(data, key, gridId, rowIndex, autoFlag) {
	// 더미 장비가 아니면
	var lftEqpId = "";
	var lftPortNm = "";
	var lftEqpInstlMtsoId = "";
	var generateLeft = false;
	
	// 2018-09-12  1. RU고도화 RX포트가 있는경우 ETE 작업
	var lftRxPortNm = "";
	var mappingKey = key;
	
	if(key == "LEFT_PORT_DESCR") {
		lftEqpId = data.LEFT_NE_ID;
		lftPortNm = data.LEFT_PORT_NM;
		lftEqpInstlMtsoId = data.LEFT_ORG_ID;
		generateLeft = true;		
	} 

	if(data.LEFT_RX_PORT_ID != null) {
		var orgPortDescr = data.LEFT_PORT_DESCR;
		
		// RX가 있는 경우 
		if (nullToEmpty(orgPortDescr) !="" ) {
			var rxStrIdx = orgPortDescr.indexOf("(");
			var rxEndIdx = orgPortDescr.indexOf(")");
			if (rxStrIdx > 0 && rxEndIdx > rxStrIdx) {
				lftRxPortNm = orgPortDescr.substr((rxStrIdx +1), (rxEndIdx - rxStrIdx -1)) ;
			}
		}
	}
	
	//console.log("PORT_DESCR : " + orgPortDescr +  ".......... RX_PORT_NM : " + lftRxPortNm);
	cflineShowProgressBody();
	var eqpParam = {"lftEqpId" : lftEqpId, "lftPortNm" : lftPortNm, "lftEqpInstlMtsoId" : lftEqpInstlMtsoId, "generateLeft" : generateLeft, "lftRxPortNm" : lftRxPortNm, 
			"autoFlag" : autoFlag, "rowIndex": rowIndex};
	if (isFiveGponRuCoreOld() == false ) {
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectEqpSctnRghtInf', eqpParam, 'GET', 'selectEqpSctnRghtInf'+gridId);
	} else {
		eqpParam = {"eqpId" : lftEqpId, "portNm" : lftPortNm, "mtsoId" : lftEqpInstlMtsoId, "generateLeft" : generateLeft, "rxPortNm" : lftRxPortNm};
		eqpParam.appltTypeOfFiveg = baseInfData.appltTypeOfFiveg;
		eqpParam.ntwkLineNo = baseNtwkLineNo;
		eqpParam.lowMtsoId = nullToEmpty(baseInfData.lowMtsoId);
		eqpParam.fiveGponVer = nullToEmpty(baseInfData.fiveGponVer);
		//추가 - 2020-08-05
		eqpParam.autoFlag = autoFlag;
		eqpParam.rowIndex = rowIndex;
		
		
		// 좌장비중 CRN장비_포트가 있는지 체크 

 		var crnDataObj = $('#'+gridId).alopexGrid("dataGet", {'LEFT_FIVE_GPON_EQP_TYPE' :'CRN'}, 'LEFT_FIVE_GPON_EQP_TYPE');
		if (crnDataObj.length > 0 && crnDataObj[0]._index.row < rowIndex) {
			eqpParam.crnEqpId = crnDataObj[0].LEFT_NE_ID;    // CRN장비ID
			eqpParam.crnEqpNm = crnDataObj[0].LEFT_NE_NM;    // CRN장비명
			eqpParam.crnPortId = crnDataObj[0].LEFT_PORT_ID; // CRN장비의 WEST(B)포트 
			eqpParam.crnPortNm = crnDataObj[0].LEFT_PORT_NM; // CRN장비의 WEST(B)포트 명
			eqpParam.eqpInstlMtsoId = crnDataObj[0].LEFT_ORG_ID; // CRN장비의 WEST(B)장비실장국사
			
		}
		httpRequestNetworkPath('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/selectEteInfWithEqpList', eqpParam, 'GET', 'selectEteInfWithEqpList'+gridId);
	}
}