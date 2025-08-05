/**
 * NetworkPathVisualizationStyle.js
 * 
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0
 * 
 *  
 ************* 수정이력 ************
 * 2018-09-12  1. RU고도화  서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 */

/**
 * 스타일 정의
 *  - 좌포트, 좌채널, 장비, 우포트, 우채널
 */
function textBlockStyle() {
	var style = {
			margin: 4,
//            textAlign: "center",
            isMultiline: true,
            editable: false,
            font: "bold 10px sans-serif",
            wrap: go.TextBlock.WrapFit,
            stroke: "black"
//            isStrikethrough : true	// 취소선 표시(삭제 장비일때 사용)
	};
	
	return style;
}

/**
 * 그리드 서비스회선컬럼 배경 색상
 * @param value
 * @param data
 * @param mapping
 * @returns {___anonymous480_515}
 */
function serviceStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#D3EEFF';
	} 
	
	return style;
	
}

/**
 * 그리드 트렁크컬럼 배경 색상
 * @param value
 * @param data
 * @param mapping
 * @returns {___anonymous480_515}
 */
function trunkStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#F1EBBF';
	} 
	
	return style;
	
}


/**
 * 그리드 링컬럼 배경 색상
 * 
 * @param value
 * @param data
 * @param mapping
 * @returns {___anonymous834_869}
 */
function ringStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#FFEAEA';
	} 
	
	return style;
	
}

/**
 * 그리드 WDM트렁크 배경 색상 
 * 
 * @param value
 * @param data
 * @param mapping
 * @returns {___anonymous1188_1223}
 */
function wdmStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#D6EED6';
	} 
	
	return style;
	
}

/**
 * 그리드 기간망트렁크 배경 색상 
 * 
 * @param value
 * @param data
 * @param mapping
 * @returns {___anonymous1188_1223}
 */
function rontTrkStyleCss(value, data, mapping) {
	var style = {
			'white-space' : 'pre-line'
	};
	
	if(value != null && value != undefined && value != "") {
		style['background-color'] = '#FFCCFF';
	}
	
	return style;
	
}

/**
 * DIV영역 DISABLE CSS
 * @param divId
 */
function divDisable(divId, isDisalbe) {
	if(isDisalbe) {
		$("#" + divId).css("opacity", 0.5);
		$("#" + divId).css("background", "#CCC");
	} else {
		$("#" + divId).css("opacity", "");
		$("#" + divId).css("background", "");
	}
}

function contextMenuStyle() {
//	var style = { "ButtonBorder.fill" : "white", "ButtonBorder.stroke" : "lightgray"}; 
	var style = { }; 
	
	return style;
}