/**
 * NetworkPathGridList.js
 * 
 * @author Administrator
 * @date 2017. 6. 26.
 * @version 1.0 *
 * 
 * ************ 수정이력 ************ 
 * 2018-09-12 1. RU고도화 서비스회선에 서비스회선을 사용네트워크로 사용가능하도록 처리 
 * 2019-02-08 2. 5G-PONU고도화 장비별 5G-PON장비타입구분 컬럼 추가 
 * 2019-09-30 3. 기간망링 선번 고도화 : 링/기간망 트렁크 조회하여 링에서 경유링을 설정 할 수 있게 처리함 
 * 2020-01-06 4. PBOX 코드(182) 추가
 * 2020-07-21 5. CMUX 기본,확장형 카드 확인 function추가
 * 2024-09-11 6. [수정] ADAMS관련 편집불가였던 내용에 대해 원복 - 모든링에 대해 관리주체제한없이 편집가능   
 *
 */
//var detailGridId = "pathList";
var allowYn = true;
var allowChYn = true;
var leftOrgNm = "";
var rightOrgNm = "";

$a.page(function() {
	var gridId = "";
	var ntwkLineNo = "";

	this.init = function(id, param) {
		gridId = param.gridId; // 데이터 그리드 OR 작업정보 그리드
		ntwkLineNo = param.ntwkLineNo;

		leftOrgNm = "LEFT_ORG_NM";
		rightOrgNm = "RIGHT_ORG_NM";

		initGridNetworkPath(detailGridId);
		initGridNetworkInfo();
	}
});

// Grid 초기화
function initGridNetworkPath(gridId) {
	var column = columnMappingNetworkPath();
	var groupColumn = groupingColumnNetworkPath();
	var nodata = cflineMsgArray['noInquiryData']; /* 조회된 데이터가 없습니다. */
	;
	// var headerGroup = headerGroupNetworkPath();

	$('#' + gridId)
			.alopexGrid(
					{
						fitTableWidth : true,
						fillUndefinedKey : null,
						numberingColumnFromZero : false,
						alwaysShowHorizontalScrollBar : false, // 하단 스크롤바
						preventScrollPropagation : true, // 그리드 스크롤만 동작(브라우저
															// 스크롤 동작 안함)
						useClassHovering : true,
						autoResize : true,
						cellInlineEdit : false,
						cellSelectable : false,
						rowInlineEdit : false,
						rowClickSelect : false,
						rowSingleSelect : true,
						rowspanGroupSelect : true,
						columnMapping : column,
						grouping : groupColumn,
						message : {
							nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"
									+ nodata + "</div>"
						}
					});

	$('#' + gridId).alopexGrid("updateOption", {
		fitTableWidth : true
	});
}

// 엑셀 다운로드를 위한 기본정보 그리드화
function initGridNetworkInfo() {
	var mapping = [];

	if (gridDivision == "trunk" || gridDivision == "ring"
			|| gridDivision == "wdm") {
		var ntwkLineNm = "";
		if (gridDivision == "trunk")
			ntwkLineNm = "트렁크명";
		else if (gridDivision == "ring")
			ntwkLineNm = "네트워크(링)명";
		else if (gridDivision == "wdm")
			ntwkLineNm = "WDM트렁크명";

		mapping = [ {
			key : 'ntwkLineNm',
			title : ntwkLineNm,
			align : 'center',
			width : '300px'
		}, {
			key : 'ntwkLineNo',
			title : '네트워크ID',
			align : 'center',
			width : '150px'
		}, {
			key : 'topoSclNm',
			title : '망종류',
			align : 'left',
			width : '100px'
		}, {
			key : 'ntwkCapaNm',
			title : '용량',
			align : 'left',
			width : '120px'
		} ];
	} else {
		mapping = [ {
			key : 'lineNm',
			title : '회선명',
			align : 'center',
			width : '300px'
		}, {
			key : 'svlnNo',
			title : '서비스회선번호',
			align : 'center',
			width : '150px'
		}, {
			key : 'svlnLclSclCdNm',
			title : '서비스회선분류',
			align : 'left',
			width : '200px'
		}, {
			key : 'lineCapaCdNm',
			title : '용량',
			align : 'left',
			width : '120px'
		} ];
	}

	$('#' + baseGridId).alopexGrid({
		preventScrollPropagation : true, // 그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
		useClassHovering : true,
		columnMapping : mapping
	});
}

function columnMappingNetworkPath() {
	var mapping = [];

	if (gridDivision == "trunk") {
		mapping = [
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				},
				{
					key : 'RING_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['RING_ID'] != null) {
							return data['RING_ID'];
						}
					}
				}
				/*
				 * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한
				 * 경우라면 L2에 해당 데이터가 셋팅된다 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를
				 * 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 2차 참조까지의 데이터만 있는경우2차링의 정보를
				 * 표시하도록 편집이 필요함
				 */
				,
				{
					key : 'RONT_MERGE',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						}
					}
				},
				{
					key : 'RING_MERGE3',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return nvlStr(data['RING_ID_L2'],
										data._index.id);
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return nvlStr(data['RING_ID_L3'],
										data._index.id);
							}
						}
					}
				},
				{
					key : 'RING_MERGE2',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2"
									|| nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							}
						}
					}
				}, {
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'] /* WDM 트렁크 */
					,
					align : 'left',
					width : '170px',
					inlineStyle : wdmStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				}, {
					key : 'WDM_TRUNK_ID',
					align : 'center',
					width : '10px',
					hidden : true
				}

				, {
					key : 'CASCADING_RING_NM_3',
					title : '경유링Lv1 명' /* 경유링 Lv1 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE3'
					},
					value : function(value, data) {
						var RING_NM_L3 = data['RING_NM_L3'];
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'];
						}
						return RING_NM_L3;
					}
				}, {
					key : 'RONT_TRK_NM',
					title : '기간망 트렁크명' /* 기간망 트렁크명 */,
					hidden : true,
					width : '170px',
					inlineStyle : rontTrkStyleCss,
					rowspan : {
						by : 'RONT_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				}, {
					key : 'CASCADING_RING_NM_2',
					title : '경유링Lv2 명' /* 경유링Lv2 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE2'
					},
					value : function(value, data) {
						var RING_NM_L2 = data['RING_NM_L2'];
						// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미
						// 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L2 = "";
						}
						return RING_NM_L2;
					}
				}, {
					key : 'RING_NM',
					title : cflineMsgArray['ringName'] /* 링 명 */
					,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE'
					}
				}, {
					key : 'RING_ID',
					align : 'center',
					width : '10px',
					hidden : true
				}, {
					key : 'RING_ID_L2',
					align : 'center',
					width : '10px',
					hidden : true
				}, {
					key : 'RING_ID_L3',
					align : 'center',
					width : '10px',
					hidden : true
				}

				, {
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '92px',
					styleclass : nodeCopyPasteCss
				} /* A 국사 */
				, {
					key : 'LEFT_NE_NM',
					title : cflineMsgArray['westEqp'],
					align : 'left',
					width : '100px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 장비 */
				, {
					key : 'LEFT_PORT_DESCR',
					title : cflineMsgArray['westPort'],
					align : 'left',
					width : '120px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss,
					tooltip : tooltipText
				} /* A 포트 */
				, {
					key : 'LEFT_CHANNEL_DESCR',
					title : cflineMsgArray['west'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px, styleclass : nodeCopyPasteCss'
				} /* A 채널 */

				, {
					key : 'A',
					title : '',
					align : 'left',
					width : '5px',
					styleclass : 'guard',
					headerStyleclass : 'guard'
				}

				, {
					key : 'RIGHT_NE_NM',
					title : cflineMsgArray['eastEqp'],
					align : 'left',
					width : '100px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 장비 */
				, {
					key : 'RIGHT_PORT_DESCR',
					title : cflineMsgArray['eastPort'],
					align : 'left',
					width : '120px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss,
					tooltip : tooltipText
				} /* B 포트 */
				, {
					key : 'RIGHT_CHANNEL_DESCR',
					title : cflineMsgArray['east'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					styleclass : nodeCopyPasteCss
				} /* B 포트 */
				, {
					key : rightOrgNm,
					title : cflineMsgArray['eastMtso'],
					align : 'center',
					width : '92px',
					styleclass : nodeCopyPasteCss
				} /* B 국사 */
				// , { key : 'WDM_ROW_FILTER', hidden: true }
				// 2018-09-12 1. RU고도화
				, {
					key : 'SERVICE_ID',
					width : '120px',
					title : "SERVICE_ID",
					hidden : true
				} /*
					 * 트렁크/링/wdm트렁크의 경우 SERVICE_ID 값을 select해 오지 않기때문에 hidden값으로
					 * 컬럼만 설정해둠
					 */
		];
	} else if (gridDivision == "ring") {
		mapping = [
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				}
				/*
				 * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한
				 * 경우라면 L2에 해당 데이터가 셋팅된다 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를
				 * 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 2차 참조까지의 데이터만 있는경우2차링의 정보를
				 * 표시하도록 편집이 필요함
				 */
				,
				{
					key : 'RONT_MERGE',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							}
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						}
					}
				},
				{
					key : 'RING_MERGE3',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						}
					}
				},
				{
					key : 'RING_MERGE2',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2"
									|| nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							}
						}
					}
				},
				{
					key : 'RING_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['RING_ID'] != null) {
							return data['RING_ID'];
						}
					}
				}, {
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'left',
					width : '170px',
					inlineStyle : wdmStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				/* WDM 트렁크 */
				}, {
					key : 'WDM_TRUNK_ID',
					align : 'center',
					width : '10px',
					hidden : true
				}

				, {
					key : 'CASCADING_RING_NM_3',
					title : '경유링Lv1 명' /* 경유링 Lv1 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE3'
					},
					value : function(value, data) {
						var RING_NM_L3 = data['RING_NM_L3'];
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'];
						}
						return RING_NM_L3;
					}
				}, {
					key : 'CASCADING_RING_NM_2',
					title : '경유링Lv2 명' /* 경유링Lv2 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE2'
					},
					value : function(value, data) {
						var RING_NM_L2 = data['RING_NM_L2'];
						// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미
						// 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L2 = "";
						}
						return RING_NM_L2;
					}
				}, {
					key : 'RING_NM',
					title : cflineMsgArray['ringName'] /* 링 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE'
					}
				}

				, {
					key : 'RONT_TRK_NM',
					title : '기간망 트렁크명' /* 기간망 트렁크명 */,
					hidden : true,
					width : '170px',
					inlineStyle : rontTrkStyleCss,
					rowspan : {
						by : 'RONT_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				}, {
					key : 'CASCADING_RING_NM',
					title : '경유링 명' /* 경유링 명 */,
					hidden : true,
					editable : {
						type : 'text'
					},
					width : '170px',
					inlineStyle : ringStyleCss,
					rowspan : {
						by : 'RING_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						var RING_NM = data['RING_NM'];
						return RING_NM;
					}
				}, {
					key : 'RING_ID',
					align : 'center',
					width : '10px',
					hidden : true
				}, {
					key : 'RING_ID_L2',
					align : 'center',
					width : '10px',
					hidden : true
				}, {
					key : 'RING_ID_L3',
					align : 'center',
					width : '10px',
					hidden : true
				}

				, {
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '110px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss
				} /* A 국사 */
				, {
					key : 'LEFT_NODE_ROLE_NM',
					title : cflineMsgArray['west'] + cflineMsgArray['supSub'],
					align : 'center',
					width : '90px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss
				} /* 상하위 */
				, {
					key : 'LEFT_NE_NM',
					title : cflineMsgArray['westEqp'],
					align : 'left',
					width : '180px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A장 비 */
				, {
					key : 'LEFT_PORT_DESCR',
					title : cflineMsgArray['westPort'],
					align : 'left',
					width : '120px',
					styleclass : nodeCopyPasteCss,
					tooltip : tooltipText,
					inlineStyle : inlineStyleCss
				} /* A 포트 */
				, {
					key : 'LEFT_CHANNEL_DESCR',
					title : cflineMsgArray['west'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					styleclass : nodeCopyPasteCss,
					inlineStyle : inlineStyleCss
				} /* A 채널 */

				, {
					key : 'A',
					title : '',
					align : 'left',
					width : '5px',
					styleclass : 'guard',
					headerStyleclass : 'guard'
				}

				, {
					key : 'RIGHT_NE_NM',
					title : cflineMsgArray['eastEqp'],
					align : 'left',
					width : '180px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 장비 */
				, {
					key : 'RIGHT_PORT_DESCR',
					title : cflineMsgArray['eastPort'],
					align : 'left',
					width : '120px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss,
					tooltip : tooltipText
				} /* B 포트 */
				, {
					key : 'RIGHT_CHANNEL_DESCR',
					title : cflineMsgArray['east'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					styleclass : nodeCopyPasteCss,
					inlineStyle : inlineStyleCss
				} /* B 채널 */
				, {
					key : 'RIGHT_NODE_ROLE_NM',
					title : cflineMsgArray['east'] + cflineMsgArray['supSub'],
					align : 'center',
					width : '90px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss
				} /* 상하위 */
				, {
					key : rightOrgNm,
					title : cflineMsgArray['eastMtso'],
					align : 'center',
					width : '110px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss
				} /* B 국사 */
				// , { key : 'WDM_ROW_FILTER', hidden: true }
				// 2018-09-12 1. RU고도화
				, {
					key : 'SERVICE_ID',
					width : '120px',
					title : "SERVICE_ID",
					hidden : true
				} /*
					 * 트렁크/링/wdm트렁크의 경우 SERVICE_ID 값을 select해 오지 않기때문에 hidden값으로
					 * 컬럼만 설정해둠
					 */
		];
	} else if (gridDivision == "wdm") {
		mapping = [
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				},
				{
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'left',
					width : '200px',
					inlineStyle : wdmStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					} /* WDM 트렁크 */
					,
					hidden : true
				},
				{
					key : 'WDM_TRUNK_ID',
					align : 'center',
					width : '10px',
					hidden : true
				},
				{
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '130px',
					styleclass : nodeCopyPasteCss
				} /* A 국사 */
				,
				{
					key : 'LEFT_NE_NM',
					title : cflineMsgArray['westEqp'],
					align : 'left',
					width : '170px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A장 비 */
				,
				{
					key : 'LEFT_PORT_USE_TYPE_NM',
					title : cflineMsgArray['west']
							+ cflineMsgArray['useUsageType'],
					align : 'center',
					width : '130px',
					styleclass : nodeCopyPasteCss
				} /* 좌포트사용용도 */
				,
				{
					key : 'LEFT_PORT_DESCR',
					title : cflineMsgArray['westPort'],
					align : 'left',
					width : '150px',
					styleclass : nodeCopyPasteCss,
					tooltip : tooltipText
				} /* A 포트 */
				,
				{
					key : 'LEFT_CARD_WAVELENGTH',
					title : cflineMsgArray['westWavelength'],
					align : 'center',
					width : '80px',
					styleclass : nodeCopyPasteCss
				} /* 좌파장 */

				,
				{
					key : 'A',
					title : '',
					align : 'left',
					width : '5px',
					styleclass : 'guard',
					headerStyleclass : 'guard'
				}

				,
				{
					key : 'RIGHT_NE_NM',
					title : cflineMsgArray['eastEqp'],
					align : 'left',
					width : '170px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 장비 */
				,
				{
					key : 'RIGHT_PORT_USE_TYPE_NM',
					title : cflineMsgArray['east']
							+ cflineMsgArray['useUsageType'],
					align : 'center',
					width : '130px',
					styleclass : nodeCopyPasteCss
				} /* 우포트사용용도 */
				, {
					key : 'RIGHT_PORT_DESCR',
					title : cflineMsgArray['eastPort'],
					align : 'left',
					width : '150px',
					styleclass : nodeCopyPasteCss,
					tooltip : tooltipText
				} /* B 포트 */
				, {
					key : 'RIGHT_CARD_WAVELENGTH',
					title : cflineMsgArray['eastWavelength'],
					align : 'center',
					width : '80px',
					styleclass : nodeCopyPasteCss
				} /* 우파장 */
				, {
					key : rightOrgNm,
					title : cflineMsgArray['eastMtso'],
					align : 'center',
					width : '130px',
					styleclass : nodeCopyPasteCss,
					styleclass : nodeCopyPasteCss
				} /* B 국사 */
				// 2018-09-12 1. RU고도화
				, {
					key : 'SERVICE_ID',
					width : '120px',
					title : "SERVICE_ID",
					hidden : true
				} /*
					 * 트렁크/링/wdm트렁크의 경우 SERVICE_ID 값을 select해 오지 않기때문에 hidden값으로
					 * 컬럼만 설정해둠
					 */
		];
	} else {
		mapping = [
				{
					key : 'SERVICE_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] == null
								&& data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] == null
								&& data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] == null
								&& data['RING_ID'] != null) {
							return data['RING_ID'];
						} else if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] != null) {
							return data['TRUNK_ID'];
						} else if (data['SERVICE_ID'] != null) {
							return data['SERVICE_ID'];
						}
					}
				},
				{
					key : 'TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['TRUNK_ID'] == null && data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['TRUNK_ID'] == null
								&& data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['TRUNK_ID'] == null
								&& data['RING_ID'] != null) {
							return data['RING_ID'];
						} else if (data['TRUNK_ID'] != null) {
							return data['TRUNK_ID'];
						}
					}
				},
				{
					key : 'RING_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['RING_ID'] != null) {
							return data['RING_ID'];
						}
					}
				}
				/*
				 * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한
				 * 경우라면 L2에 해당 데이터가 셋팅된다 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를
				 * 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 2차 참조까지의 데이터만 있는경우2차링의 정보를
				 * 표시하도록 편집이 필요함
				 */
				,
				{
					key : 'RONT_MERGE',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						}
					}
				},
				{
					key : 'RING_MERGE3',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return nvlStr(data['RING_ID_L2'],
										data._index.id);
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return nvlStr(data['RING_ID_L3'],
										data._index.id);
							}
						}
					}
				},
				{
					key : 'RING_MERGE2',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2"
									|| nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							}
						}
					}
				},
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				},
				{
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'left',
					width : '120px',
					inlineStyle : wdmStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				/* WDM 트렁크 */
				},
				{
					key : 'WDM_TRUNK_ID',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'center',
					width : '10px',
					hidden : true
				}

				,
				{
					key : 'CASCADING_RING_NM_3',
					title : '경유링Lv1 명' /* 경유링 Lv1 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE3'
					},
					value : function(value, data) {
						var RING_NM_L3 = data['RING_NM_L3'];
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'];
						}
						return RING_NM_L3;
					}
				},
				{
					key : 'RONT_TRK_NM',
					title : '기간망 트렁크명' /* 기간망 트렁크명 */,
					hidden : true,
					width : '170px',
					inlineStyle : rontTrkStyleCss,
					rowspan : {
						by : 'RONT_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				},
				{
					key : 'CASCADING_RING_NM_2',
					title : '경유링Lv2 명' /* 경유링Lv2 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE2'
					},
					value : function(value, data) {
						var RING_NM_L2 = data['RING_NM_L2'];
						// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미
						// 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L2 = "";
						}
						return RING_NM_L2;
					}
				}

				,
				{
					key : 'RING_NM',
					title : cflineMsgArray['ringName'],
					align : 'left',
					width : '120px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE'
					}
				/* 링 */

				},
				{
					key : 'RING_ID',
					title : cflineMsgArray['ringName'],
					align : 'center',
					width : '10px',
					hidden : true
				},
				{
					key : 'RING_ID_L2',
					align : 'center',
					width : '10px',
					hidden : true
				},
				{
					key : 'RING_ID_L3',
					align : 'center',
					width : '10px',
					hidden : true
				}

				,
				{
					key : 'TRUNK_NM',
					title : cflineMsgArray['trunkNm'],
					align : 'left',
					width : '140px',
					inlineStyle : trunkStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'TRUNK_MERGE'
					}
				/* 트렁크 */
				},
				{
					key : 'TRUNK_ID',
					title : cflineMsgArray['trunkNm'],
					align : 'center',
					width : '10px',
					hidden : true
				},
				{
					key : 'SERVICE_NM',
					title : "경유회선명(Cascading)"/* cflineMsgArray['lnNm'] */,
					align : 'left',
					width : '150px',
					inlineStyle : serviceStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'SERVICE_MERGE'
					} /* 회선명 */
					,
					hidden : true
				},
				{
					key : 'SERVICE_ID',
					title : cflineMsgArray['lnNm'],
					align : 'center',
					width : '10px',
					hidden : true
				}

				,
				{
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '98px',
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				} /* A 국사 */
				,
				{
					key : 'LEFT_NODE_ROLE_NM',
					title : cflineMsgArray['west'] + cflineMsgArray['supSub'],
					align : 'center',
					width : '90px',
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				} /* 상하위 */
				,
				{
					key : 'LEFT_NE_NM',
					title : cflineMsgArray['westEqp'],
					align : 'left',
					width : '130px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A장 비 */
				,
				{
					key : 'LEFT_PORT_DESCR',
					title : cflineMsgArray['westPort'],
					align : 'left',
					width : '80px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 포트 */
				,
				{
					key : 'LEFT_CHANNEL_DESCR',
					title : cflineMsgArray['west'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				} /* A 채널 */
				,
				{
					key : 'LEFT_IS_CHANNEL_T1',
					title : cflineMsgArray['t1'],
					align : 'center',
					width : '45px',
					render : function(value, data) {
						var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
						html += (value === true) ? ' checked' : '';
						html += '">';
						html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
						html += '/></label>';
						return html;
					},
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				}

				,
				{
					key : 'A',
					title : '',
					align : 'left',
					width : '5px',
					styleclass : 'guard',
					headerStyleclass : 'guard'
				} /* 경계선 */

				,
				{
					key : 'RIGHT_NE_NM',
					title : cflineMsgArray['eastEqp'],
					align : 'left',
					width : '130px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 장비 */
				,
				{
					key : 'RIGHT_PORT_DESCR',
					title : cflineMsgArray['eastPort'],
					align : 'left',
					width : '80px',
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 포트 */
				,
				{
					key : 'RIGHT_CHANNEL_DESCR',
					title : cflineMsgArray['east'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				} /* B 채널 */
				,
				{
					key : 'RIGHT_IS_CHANNEL_T1',
					title : cflineMsgArray['t1'],
					align : 'center',
					width : '45px',
					render : function(value, data) {
						var html = '<label class="alopexgrid-input-wrapper alopexgrid-input-checkbox-wrapper';
						html += (value === true) ? ' checked' : '';
						html += '">';
						html += '<input type="checkbox" class="alopexgrid-default-renderer" disabled = "true" ';
						html += '/></label>';
						return html;
					},
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				}, {
					key : 'RIGHT_NODE_ROLE_NM',
					title : cflineMsgArray['east'] + cflineMsgArray['supSub'],
					align : 'center',
					width : '90px',
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				} /* 상하위 */
				, {
					key : rightOrgNm,
					title : cflineMsgArray['eastMtso'],
					align : 'center',
					width : '98px',
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				} /* B 국사 */
		// , { key : 'TRUNK_ROW_FILTER', hidden: true}
		// , { key : 'WDM_ROW_FILTER', hidden: true}
		];
	}

	mapping = mapping.concat(addcolumn());
	return mapping;
}

function columnMappingNetworkPathEdit() {
	var mapping = [];
	var mappingCol = [];
	mapping = mapping.concat(addcolumn());

	if (gridDivision == "trunk") {
		mappingCol = [
				{
					key : 'RING_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['RING_ID'] != null) {
							return data['RING_ID'];
						}
					}
				}
				/*
				 * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한
				 * 경우라면 L2에 해당 데이터가 셋팅된다 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를
				 * 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 2차 참조까지의 데이터만 있는경우2차링의 정보를
				 * 표시하도록 편집이 필요함
				 */
				,
				{
					key : 'RONT_MERGE',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						}
					}
				},
				{
					key : 'RING_MERGE3',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return nvlStr(data['RING_ID_L2'],
										data._index.id);
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return nvlStr(data['RING_ID_L3'],
										data._index.id);
							}
						}
					}
				},
				{
					key : 'RING_MERGE2',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2"
									|| nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							}
						}
					}
				},
				{
					selectorColumn : true,
					width : '40px',
					rowspan : {
						by : 'RING_MERGE'
					}
				},
				{
					dragdropColumn : true,
					width : '30px',
					rowspan : {
						by : 'RING_MERGE'
					}
				},
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				},
				{
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'left',
					width : '138px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : wdmStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				},
				{
					key : 'WDM_TRUNK_ID',
					width : '120px',
					title : "WDM_TRUNK_ID",
					hidden : true
				}

				,
				{
					key : 'CASCADING_RING_NM_3',
					title : '경유링Lv1 명' /* 경유링 Lv1 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE3'
					},
					value : function(value, data) {
						var RING_NM_L3 = data['RING_NM_L3'];
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'];
						}
						return RING_NM_L3;
					}
				},
				{
					key : 'RONT_TRK_NM',
					title : '기간망 트렁크명' /* 기간망 트렁크명 */,
					hidden : true,
					width : '170px',
					inlineStyle : rontTrkStyleCss,
					rowspan : {
						by : 'RONT_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				},
				{
					key : 'CASCADING_RING_NM_2',
					title : '경유링Lv2 명' /* 경유링Lv2 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE2'
					},
					value : function(value, data) {
						var RING_NM_L2 = data['RING_NM_L2'];
						// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미
						// 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L2 = "";
						}
						return RING_NM_L2;
					}
				},
				{
					key : 'RING_NM',
					title : cflineMsgArray['ringName'],
					align : 'left',
					width : '138px',
					editable : {
						type : 'text'
					},
					inlineStyle : ringStyleCss,
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'trunk');
					},
					rowspan : {
						by : 'RING_MERGE'
					},
					tooltip : tooltipNetworkText
				},
				{
					key : 'RING_ID',
					width : '120px',
					title : "RING_ID",
					hidden : true
				},
				{
					key : 'RING_ID_L2',
					align : 'center',
					width : '10px',
					hidden : true
				},
				{
					key : 'RING_ID_L3',
					align : 'center',
					width : '10px',
					hidden : true
				}

				,
				{
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '100px',
					styleclass : nodeCopyPasteCss
				} /* A 국사 */
				,
				{
					key : 'LEFT_NE_NM',
					title : cflineMsgArray['westEqp'],
					align : 'left',
					width : '190px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						if (data['LEFT_ADD_DROP_TYPE_CD'] == 'N'
								&& data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') {
							return true;
						} else {
							return chkAllowEdit(value, data, mapping, 'trunk');
						}
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 장비 */
				,
				{
					key : 'LEFT_PORT_DESCR',
					title : cflineMsgArray['westPort'],
					align : 'left',
					width : '100px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						if ((data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A')
								|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')) {
							return true;
						} else {
							return chkAllowEdit(value, data, mapping, 'trunk');
						}
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 포트 */
				,
				{
					key : 'LEFT_CHANNEL_DESCR',
					title : cflineMsgArray['west'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEditChannel(value, data, mapping);
					},
					styleclass : nodeCopyPasteCss
				// , styleclass : function(value, data, mapping) {
				// var useChannelDescr = data['USE_NETWORK_LEFT_CHANNEL_DESCR'];
				// var channelDescr = data['LEFT_CHANNEL_DESCR'];
				// if(nullToEmpty(channelDescr) != '' &&
				// nullToEmpty(useChannelDescr) != '' &&
				// channelDescr.indexOf(useChannelDescr) != 0) {
				// return 'channelDescrCss';
				// } else {
				// return '';
				// }
				// }
				} /* A 채널 */

				,
				{
					key : 'A',
					title : '',
					align : 'left',
					width : '5px',
					styleclass : 'guard',
					headerStyleclass : 'guard'
				}

				,
				{
					key : 'RIGHT_NE_NM',
					title : cflineMsgArray['eastEqp'],
					align : 'left',
					width : '190px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						if (data['LEFT_ADD_DROP_TYPE_CD'] == 'D'
								&& data['RIGHT_ADD_DROP_TYPE_CD'] == 'N') {
							return true;
						} else {
							return chkAllowEdit(value, data, mapping, 'trunk');
						}
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 장비 */
				,
				{
					key : 'RIGHT_PORT_DESCR',
					title : cflineMsgArray['eastPort'],
					align : 'left',
					width : '100px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						if ((data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A')
								|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')) {
							return true;
						} else {
							return chkAllowEdit(value, data, mapping, 'trunk');
						}
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 포트 */
				, {
					key : 'RIGHT_CHANNEL_DESCR',
					title : cflineMsgArray['east'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEditChannel(value, data, mapping);
					},
					styleclass : nodeCopyPasteCss
				// , styleclass : function(value, data, mapping) {
				// var useChannelDescr =
				// data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
				// var channelDescr = data['RIGHT_CHANNEL_DESCR'];
				// if(nullToEmpty(channelDescr) != '' &&
				// nullToEmpty(useChannelDescr) != '' &&
				// channelDescr.indexOf(useChannelDescr) != 0) {
				// return 'channelDescrCss';
				// } else {
				// return '';
				// }
				// }
				} /* B 채널 */
				, {
					key : rightOrgNm,
					title : cflineMsgArray['eastMtso'],
					align : 'center',
					width : '100px',
					styleclass : nodeCopyPasteCss
				} /* B 국사 */
				// , { key : 'WDM_ROW_FILTER', hidden: true }
				// 2018-09-12 1. RU고도화
				, {
					key : 'SERVICE_ID',
					width : '120px',
					title : "SERVICE_ID",
					hidden : true
				} /*
					 * 트렁크/링/wdm트렁크의 경우 SERVICE_ID 값을 select해 오지 않기때문에 hidden값으로
					 * 컬럼만 설정해둠
					 */
		];
	} else if (gridDivision == "ring") {
		mappingCol = [
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				}
				/*
				 * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한
				 * 경우라면 L2에 해당 데이터가 셋팅된다 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를
				 * 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 2차 참조까지의 데이터만 있는경우2차링의 정보를
				 * 표시하도록 편집이 필요함
				 */
				,
				{
					key : 'RONT_MERGE',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							}
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						}
					}
				},
				{
					key : 'RING_MERGE3',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						}
					}
				},
				{
					key : 'RING_MERGE2',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2"
									|| nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							}
						}
					}
				},
				{
					key : 'RING_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['RING_ID'] != null) {
							return data['RING_ID'];
						}
					}
				},
				{
					selectorColumn : true,
					width : '40px',
					rowspan : {
						by : 'RING_MERGE'
					}
				},
				{
					dragdropColumn : true,
					width : '30px',
					rowspan : {
						by : 'RING_MERGE'
					}
				}

				/*
				 * , { selectorColumn : true, width : '40px', rowspan : {by :
				 * 'WDM_TRUNK_MERGE' } } , { dragdropColumn : true, width :
				 * '30px', rowspan : {by : 'WDM_TRUNK_MERGE' } }
				 */
				,
				{
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'left',
					width : '138px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : wdmStyleCss
					// , inlineStyle: inlineStyleCss
					,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				},
				{
					key : 'WDM_TRUNK_ID',
					width : '120px',
					title : "WDM_TRUNK_ID",
					hidden : true
				}

				,
				{
					key : 'CASCADING_RING_NM_3',
					title : '경유링Lv1 명' /* 경유링 Lv1 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE3'
					},
					value : function(value, data) {
						var RING_NM_L3 = data['RING_NM_L3'];
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'];
						}
						return RING_NM_L3;
					}
				},
				{
					key : 'CASCADING_RING_NM_2',
					title : '경유링Lv2 명' /* 경유링Lv2 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE2'
					},
					value : function(value, data) {
						var RING_NM_L2 = data['RING_NM_L2'];
						// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미
						// 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L2 = "";
						}
						return RING_NM_L2;
					}
				},
				{
					key : 'RING_NM',
					title : cflineMsgArray['ringName'],
					align : 'left',
					width : '138px',
					hidden : true,
					editable : {
						type : 'text'
					},
					inlineStyle : ringStyleCss,
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'trunk');
					},
					rowspan : {
						by : 'RING_MERGE'
					},
					tooltip : tooltipNetworkText
				},
				{
					key : 'RONT_TRK_NM',
					title : '기간망 트렁크명' /* 기간망 트렁크명 */,
					hidden : true,
					width : '170px',
					inlineStyle : rontTrkStyleCss,
					rowspan : {
						by : 'RONT_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				},
				{
					key : 'CASCADING_RING_NM',
					title : '경유링 명' /* 경유링 명 */,
					hidden : true,
					editable : {
						type : 'text'
					},
					width : '170px',
					inlineStyle : ringStyleCss,
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping,
								'cascadingRing');
					},
					rowspan : {
						by : 'RING_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						var RING_NM = data['RING_NM'];
						return RING_NM;
					}
				},
				{
					key : 'RING_ID',
					width : '120px',
					title : "RING_ID",
					hidden : true
				},
				{
					key : 'RING_ID_L2',
					align : 'center',
					width : '10px',
					hidden : true
				},
				{
					key : 'RING_ID_L3',
					align : 'center',
					width : '10px',
					hidden : true
				}

				,
				{
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '100px',
					inlineStyle : inlineStyleCss,
					styleclass : nodeCopyPasteCss
				} /* A 국사 */
				,
				{
					key : 'LEFT_NODE_ROLE_CD',
					title : cflineMsgArray['west'] + cflineMsgArray['supSub'],
					align : 'center',
					width : '100px',
					render : function(value, data) {
						return data.LEFT_NODE_ROLE_NM;
					},
					editable : {
						type : "select",
						rule : function(value, data) {
							return westNodeRole;
						},
						attr : {
							style : "width: 83px;min-width:83px;padding: 2px 2px;"
						}
					},
					editedValue : function(cell) {
						return $(cell).find('select option')
								.filter(':selected').val();
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					styleclass : nodeCopyPasteCss,
					inlineStyle : inlineStyleCss
				} /* 상하위 */
				,
				{
					key : 'LEFT_NE_NM',
					title : cflineMsgArray['westEqp'],
					align : 'left',
					width : '180px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 장비 */
				,
				{
					key : 'LEFT_PORT_DESCR',
					title : cflineMsgArray['westPort'],
					align : 'left',
					width : '100px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 포트 */
				,
				{
					key : 'LEFT_CHANNEL_DESCR',
					title : cflineMsgArray['west'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEditChannel(value, data, mapping, 'ring');
					},
					styleclass : nodeCopyPasteCss,
					inlineStyle : inlineStyleCss
				} /* A 채널 */

				,
				{
					key : 'A',
					title : '',
					align : 'left',
					width : '5px',
					styleclass : 'guard',
					headerStyleclass : 'guard'
				}

				,
				{
					key : 'RIGHT_NE_NM',
					title : cflineMsgArray['eastEqp'],
					align : 'left',
					width : '180px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 장비 */
				,
				{
					key : 'RIGHT_PORT_DESCR',
					title : cflineMsgArray['eastPort'],
					align : 'left',
					width : '100px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 포트 */
				,
				{
					key : 'RIGHT_CHANNEL_DESCR',
					title : cflineMsgArray['east'] + cflineMsgArray['channel'],
					align : 'left',
					width : '80px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEditChannel(value, data, mapping, 'ring');
					},
					styleclass : nodeCopyPasteCss,
					inlineStyle : inlineStyleCss
				} /* B 채널 */

				,
				{
					key : 'RIGHT_NODE_ROLE_CD',
					title : cflineMsgArray['east'] + cflineMsgArray['supSub'],
					align : 'center',
					width : '100px',
					render : function(value, data) {
						return data.RIGHT_NODE_ROLE_NM;
					},
					editable : {
						type : "select",
						rule : function(value, data) {
							return eastNodeRole;
						},
						attr : {
							style : "width: 83px;min-width:83px;padding: 2px 2px;"
						}
					},
					editedValue : function(cell) {
						return $(cell).find('select option')
								.filter(':selected').val();
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					styleclass : nodeCopyPasteCss,
					inlineStyle : inlineStyleCss
				} /* 상하위 */
				, {
					key : rightOrgNm,
					title : cflineMsgArray['eastMtso'],
					align : 'center',
					width : '100px',
					styleclass : nodeCopyPasteCss,
					inlineStyle : inlineStyleCss
				} /* B 국사 */
				// 2018-09-12 1. RU고도화
				, {
					key : 'SERVICE_ID',
					width : '120px',
					title : "SERVICE_ID",
					hidden : true
				} /*
					 * 트렁크/링/wdm트렁크의 경우 SERVICE_ID 값을 select해 오지 않기때문에 hidden값으로
					 * 컬럼만 설정해둠
					 */
		];
	} else if (gridDivision == "wdm") {
		mappingCol = [
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				},
				{
					selectorColumn : true,
					width : '40px',
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				},
				{
					dragdropColumn : true,
					width : '30px',
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				},
				{
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'left',
					width : '138px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : wdmStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					},
					hidden : true
				},
				{
					key : 'WDM_TRUNK_ID',
					width : '120px',
					title : "WDM_TRUNK_ID",
					hidden : true
				},
				{
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '120px',
					styleclass : nodeCopyPasteCss
				} /* A 국사 */
				,
				{
					key : 'LEFT_NE_NM',
					title : cflineMsgArray['westEqp'],
					align : 'left',
					width : '190px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 장비 */
				,
				{
					key : 'LEFT_PORT_USE_TYPE_NM',
					title : cflineMsgArray['west']
							+ cflineMsgArray['useUsageType'],
					align : 'center',
					width : '130px',
					styleclass : nodeCopyPasteCss
				} /* 좌포트사용용도 */
				,
				{
					key : 'LEFT_PORT_DESCR',
					title : cflineMsgArray['westPort'],
					align : 'left',
					width : '130px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* A 포트 */
				,
				{
					key : 'LEFT_CARD_WAVELENGTH',
					title : cflineMsgArray['westWavelength'],
					align : 'center',
					width : '80px',
					styleclass : nodeCopyPasteCss
				} /* 좌파장 */

				,
				{
					key : 'A',
					title : '',
					align : 'left',
					width : '5px',
					styleclass : 'guard',
					headerStyleclass : 'guard'
				}

				,
				{
					key : 'RIGHT_NE_NM',
					title : cflineMsgArray['eastEqp'],
					align : 'left',
					width : '190px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 장비 */
				,
				{
					key : 'RIGHT_PORT_USE_TYPE_NM',
					title : cflineMsgArray['east']
							+ cflineMsgArray['useUsageType'],
					align : 'center',
					width : '130px',
					styleclass : nodeCopyPasteCss
				} /* 우포트사용용도 */
				, {
					key : 'RIGHT_PORT_DESCR',
					title : cflineMsgArray['eastPort'],
					align : 'left',
					width : '130px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'ring');
					},
					inlineStyle : inlineStyleCss,
					tooltip : tooltipText,
					styleclass : nodeCopyPasteCss
				} /* B 포트 */
				, {
					key : 'RIGHT_CARD_WAVELENGTH',
					title : cflineMsgArray['eastWavelength'],
					align : 'center',
					width : '80px',
					styleclass : nodeCopyPasteCss
				} /* 우파장 */
				, {
					key : rightOrgNm,
					title : cflineMsgArray['eastMtso'],
					align : 'center',
					width : '120px',
					styleclass : nodeCopyPasteCss
				} /* B 국사 */
				// 2018-09-12 1. RU고도화
				, {
					key : 'SERVICE_ID',
					width : '120px',
					title : "SERVICE_ID",
					hidden : true
				} /*
					 * 트렁크/링/wdm트렁크의 경우 SERVICE_ID 값을 select해 오지 않기때문에 hidden값으로
					 * 컬럼만 설정해둠
					 */
		];
	} else {
		mappingCol = [
				{
					key : 'SERVICE_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] == null
								&& data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] == null
								&& data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] == null
								&& data['RING_ID'] != null) {
							return data['RING_ID'];
						} else if (data['SERVICE_ID'] == null
								&& data['TRUNK_ID'] != null) {
							return data['TRUNK_ID'];
						} else if (data['SERVICE_ID'] != null) {
							return data['SERVICE_ID'];
						}
					}
				},
				{
					key : 'TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['TRUNK_ID'] == null && data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['TRUNK_ID'] == null
								&& data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['TRUNK_ID'] == null
								&& data['RING_ID'] != null) {
							return data['RING_ID'];
						} else if (data['TRUNK_ID'] != null) {
							return data['TRUNK_ID'];
						}
					}
				},
				{
					key : 'RING_MERGE',
					hidden : true,
					value : function(value, data) {
						if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (data['RING_ID'] == null
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (data['RING_ID'] != null) {
							return data['RING_ID'];
						}
					}
				}
				/*
				 * 경유링 정보와 관련하여 쿼리 조회시 3차링 까지 참조한 경우라면 L3에 데이터가 셋팅되고 2차 까지 참조한
				 * 경우라면 L2에 해당 데이터가 셋팅된다 하지만 화면에 표현지 경유링 Lv1의 컬럼에 가자 낮은 레벨의 데이터를
				 * 표시하기 위해 3차 참조의 데이터가 있는경우 3차링을 2차 참조까지의 데이터만 있는경우2차링의 정보를
				 * 표시하도록 편집이 필요함
				 */
				,
				{
					key : 'RONT_MERGE',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return data['RING_ID_L2'];
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L3'];
							}
						} else if (nullToEmpty(data['RING_ID']) != ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) != "") {
							return data['REFC_RONT_TRK_NTWK_LINE_NO'];
						}
					}
				},
				{
					key : 'RING_MERGE3',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2") {
								return nvlStr(data['RING_ID_L2'],
										data._index.id);
							} else if (nullToEmpty(data['RING_LVL']) == "3") {
								return nvlStr(data['RING_ID_L3'],
										data._index.id);
							}
						}
					}
				},
				{
					key : 'RING_MERGE2',
					hidden : true,
					value : function(value, data) {
						if (nullToEmpty(nullToEmpty(data['RING_ID']) == ""
								&& data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] == null) {
							return data._index.id;
						} else if (nullToEmpty(data['RING_ID']) == ""
								&& nullToEmpty(data['RING_ID_L3']) == ""
								&& nullToEmpty(data['RING_ID_L2']) == ""
								&& nullToEmpty(data['REFC_RONT_TRK_NTWK_LINE_NO']) == ""
								&& data['WDM_TRUNK_ID'] != null) {
							return data['WDM_TRUNK_ID'];
						} else if (nullToEmpty(data['RING_ID']) != "") {
							if (nullToEmpty(data['RING_LVL']) == "1") {
								return data['RING_ID'];
							} else if (nullToEmpty(data['RING_LVL']) == "2"
									|| nullToEmpty(data['RING_LVL']) == "3") {
								return data['RING_ID_L2'];
							}
						}
					}
				},
				{
					key : 'WDM_TRUNK_MERGE',
					hidden : true,
					value : function(value, data) {
						return data['WDM_TRUNK_ID'] == null ? data._index.id
								: data['WDM_TRUNK_ID'];
					}
				},
				{
					selectorColumn : true,
					width : '40px',
					rowspan : {
						by : 'SERVICE_MERGE'
					}
				},
				{
					dragdropColumn : true,
					width : '30px',
					rowspan : {
						by : 'SERVICE_MERGE'
					}
				}

				/* 사용네트워크영역 */
				,
				{
					key : 'WDM_TRUNK_NM',
					title : cflineMsgArray['wdmTrunkName'],
					align : 'left',
					width : '138px',
					editable : {
						type : 'text'
					},
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'serviceLine');
					},
					inlineStyle : wdmStyleCss,
					rowspan : {
						by : 'WDM_TRUNK_MERGE'
					}
				},
				{
					key : 'WDM_TRUNK_ID',
					width : '120px',
					title : "WDM_TRUNK_ID",
					hidden : true
				}

				,
				{
					key : 'CASCADING_RING_NM_3',
					title : '경유링Lv1 명' /* 경유링 Lv1 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE3'
					},
					value : function(value, data) {
						var RING_NM_L3 = data['RING_NM_L3'];
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L3 = data['RING_NM_L2'];
						}
						return RING_NM_L3;
					}
				},
				{
					key : 'RONT_TRK_NM',
					title : '기간망 트렁크명' /* 기간망 트렁크명 */,
					hidden : true,
					width : '170px',
					inlineStyle : rontTrkStyleCss,
					rowspan : {
						by : 'RONT_MERGE'
					},
					tooltip : tooltipNetworkText,
					value : function(value, data) {
						return data['REFC_RONT_TRK_NTWK_LINE_NM'];
					}
				},
				{
					key : 'CASCADING_RING_NM_2',
					title : '경유링Lv2 명' /* 경유링Lv2 명 */,
					hidden : true,
					align : 'left',
					width : '170px',
					inlineStyle : ringStyleCss,
					tooltip : tooltipNetworkText,
					rowspan : {
						by : 'RING_MERGE2'
					},
					value : function(value, data) {
						var RING_NM_L2 = data['RING_NM_L2'];
						// 현재 사용리의 경유링 레벨이 2 라면 해당 링의 경유링 Lv1명에 RING_NM_L2 이 이미
						// 사용되었기 때문에 CASCADING_RING_NM_2 에는 빈값이 들어가야함
						if (nullToEmpty(data['RING_LVL']) == "2") {
							RING_NM_L2 = "";
						}
						return RING_NM_L2;
					}
				},
				{
					key : 'RING_NM',
					title : cflineMsgArray['ringName'],
					align : 'left',
					width : '138px',
					editable : {
						type : 'text'
					},
					inlineStyle : ringStyleCss,
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'serviceLine');
					},
					rowspan : {
						by : 'RING_MERGE'
					},
					tooltip : tooltipNetworkText
				},
				{
					key : 'RING_ID',
					width : '120px',
					title : "RING_ID",
					hidden : true
				},
				{
					key : 'RING_ID_L2',
					align : 'center',
					width : '10px',
					hidden : true
				},
				{
					key : 'RING_ID_L3',
					align : 'center',
					width : '10px',
					hidden : true
				}

				,
				{
					key : 'TRUNK_NM',
					title : cflineMsgArray['trunkNm'],
					align : 'left',
					width : '110px',
					editable : {
						type : 'text'
					},
					inlineStyle : trunkStyleCss,
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'serviceLine');
					},
					rowspan : {
						by : 'TRUNK_MERGE'
					}
				},
				{
					key : 'TRUNK_ID',
					width : '120px',
					title : "TRUNK_ID",
					hidden : true
				},
				{
					key : 'SERVICE_NM',
					title : "경유회선명(Cascading)",
					align : 'left',
					width : '150px',
					editable : {
						type : 'text'
					},
					inlineStyle : serviceStyleCss,
					allowEdit : function(value, data, mapping) {
						return chkAllowEdit(value, data, mapping, 'serviceLine');
					},
					rowspan : {
						by : 'SERVICE_MERGE'
					},
					hidden : true
				},
				{
					key : 'SERVICE_ID',
					width : '120px',
					title : "SERVICE_ID",
					hidden : true
				}

				,
				{
					key : leftOrgNm,
					title : cflineMsgArray['westMtso'],
					align : 'center',
					width : '100px',
					styleclass : nodeCopyPasteCss
				// , inlineStyle: inlineStyleCss
				} /* A 국사 */
				,
				{ key : 'LEFT_NODE_ROLE_CD', title : cflineMsgArray['west']+cflineMsgArray['supSub'], align : 'center'//, width : '100px' 
	        	   	, render : function(value, data){  return data.LEFT_NODE_ROLE_NM; }
      	    		, editable:{
	      	    		type:"select", 
	      	    		rule : function(value, data){
	      	    			return westNodeRole;
	      	    		}, attr : {
	      	    			style : "width: 83px;min-width:83px;padding: 2px 2px;"
  			 			}
	      	    	}
			 		, editedValue : function (cell) {
			 			return $(cell).find('select option').filter(':selected').val();
			 		}
			 		, allowEdit : function(value, data, mapping) {
			 			if(data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') {
			 				if((nullToEmpty(data['SERVICE_ID']) == "" && nullToEmpty(data['TRUNK_ID']) == "") 
									|| (nullToEmpty(data['SERVICE_ID']).indexOf('alopex') == 0 && data['TRUNK_ID'].indexOf('alopex') == 0) ) {
			 					return true;
			 				} else {
			 					return false;
			 				}
						} else {
							return chkAllowEdit(value, data, mapping, 'serviceLine');
						}
					}
			 		, styleclass : nodeCopyPasteCss
			 		//, inlineStyle: serviceStyleCss
				} /* 상하위 */
		       , { key : 'LEFT_NE_NM', 					title : cflineMsgArray['westEqp'], align : 'left', width : '190px'
		    	   		, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
							if(data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A' && nullToEmpty(data['RING_ID_L1']) == "" ) {
								if((nullToEmpty(data['SERVICE_ID']) == "" && nullToEmpty(data['TRUNK_ID']) == "") 
									|| (nullToEmpty(data['SERVICE_ID']).indexOf('alopex') == 0 && data['TRUNK_ID'].indexOf('alopex') == 0) ) {
				 					return true;
				 				} else {
				 					return false;
				 				}
							} else {
								return chkAllowEdit(value, data, mapping, 'serviceLine');
							}
						}
						, inlineStyle: inlineStyleCss
						, styleclass : nodeCopyPasteCss
						, tooltip : tooltipText
		          } /* A 장비 */
		       , { key : 'LEFT_PORT_DESCR', 	title : cflineMsgArray['westPort'], align : 'left', width : '100px' 
			   			, editable:  { type: 'text' }
						, allowEdit : function(value, data, mapping) {
					if( (data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') 
							|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')  ) {
						if((nullToEmpty(data['SERVICE_ID']) == "" && nullToEmpty(data['TRUNK_ID']) == "") 
								|| (nullToEmpty(data['SERVICE_ID']).indexOf('alopex') == 0 && data['TRUNK_ID'].indexOf('alopex') == 0) ) {
							if(nullToEmpty(data['LEFT_PORT_DESCR']) != '') {
								return false;
							} else {
								return true;
							}
		 				} else {
		 					return false;
		 				}
					} else {
						return chkAllowEdit(value, data, mapping, 'serviceLine');
					}
				}
				, inlineStyle: inlineStyleCss
	   				, tooltip : tooltipText
	   				, styleclass : nodeCopyPasteCss
		        } /* A 포트 */
				,
				{ key : 'LEFT_CHANNEL_DESCR', 	title : cflineMsgArray['west'] + cflineMsgArray['channel'], align : 'left', width : '80px'
    	   			, editable:  { type: 'text' }
					, allowEdit : function(value, data, mapping) {
						return chkAllowEditChannel(value, data, mapping);
					}
					, styleclass : nodeCopyPasteCss
				 //	, inlineStyle: inlineStyleCss
//					, styleclass : function(value, data, mapping) {
//						var useChannelDescr = data['USE_NETWORK_LEFT_CHANNEL_DESCR'];
//						var channelDescr = data['LEFT_CHANNEL_DESCR'];
//						if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
//							return 'channelDescrCss';
//						} else {
//							return '';
//						}
//					}
	        	 } /* A 채널 */
				 , { key : 'LEFT_IS_CHANNEL_T1',			title : cflineMsgArray['t1'], align : 'center', width : '45px'
	        	   		, render : {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
	//	        	   		, render: function(value, data){  return data.LEFT_IS_CHANNEL_T1; }
		           		, editable: {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
		           		, editedValue: function (cell) {
		           			return $(cell).find('input').is(':checked') ? true:false;
		           		}
		           		, allowEdit : function(value, data, mapping) {
							return chkAllowEditChannel(value, data, mapping);
						}
		           		, styleclass : nodeCopyPasteCss
		           		//, inlineStyle: inlineStyleCss
	           }
	           , { key : 'A', 			title : '',  align : 'left', width : '5px'
	        		, styleclass: 'guard'
	        		, headerStyleclass : 'guard'
	        	} /* 경계선 */
           
	           , { key : 'RIGHT_NE_NM', 				title : cflineMsgArray['eastEqp'], align : 'left', width : '190px'
    	   			, editable:  { type: 'text' }
					, allowEdit : function(value, data, mapping) {
					if(data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N' && nullToEmpty(data['RING_ID_L1']) == "") {
						if((nullToEmpty(data['SERVICE_ID']) == "" && nullToEmpty(data['TRUNK_ID']) == "") 
								|| (nullToEmpty(data['SERVICE_ID']).indexOf('alopex') == 0 && data['TRUNK_ID'].indexOf('alopex') == 0) ) {
		 					return true;
		 				} else {
		 					return false;
		 				}
					} else {
						return chkAllowEdit(value, data, mapping, 'serviceLine');
					}
				}
				, inlineStyle: inlineStyleCss
				, tooltip : tooltipText
				, styleclass : nodeCopyPasteCss
	           } /* B 장비 */
	           , { key : 'RIGHT_PORT_DESCR', title : cflineMsgArray['eastPort'], align : 'left', width : '100px'
	    	   			, editable:  { type: 'text' }
	      				, allowEdit : function(value, data, mapping) {
	      					if( (data['LEFT_ADD_DROP_TYPE_CD'] == 'N' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'A') 
									|| (data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N')  ) {
	      						if((nullToEmpty(data['SERVICE_ID']) == "" && nullToEmpty(data['TRUNK_ID']) == "") 
										|| (nullToEmpty(data['SERVICE_ID']).indexOf('alopex') == 0 && data['TRUNK_ID'].indexOf('alopex') == 0) ) {
	      							if(nullToEmpty(data['RIGHT_PORT_DESCR']) != '') {
										return false;
									} else {
										return true;
									}
				 				} else {
				 					return false;
				 				}
							} else {
								return chkAllowEdit(value, data, mapping, 'serviceLine');
							}
	      				}
	      				, inlineStyle: inlineStyleCss
	   	   				, tooltip : tooltipText
	   	   				, styleclass : nodeCopyPasteCss
	              } /* B 포트 */
           		, { key : 'RIGHT_CHANNEL_DESCR', 	title : cflineMsgArray['east'] + cflineMsgArray['channel'], align : 'left', width : '80px'
       				, editable:  { type: 'text' }
       				, allowEdit : function(value, data, mapping) {
       					return chkAllowEditChannel(value, data, mapping);
       				}
       				, styleclass : nodeCopyPasteCss
       			//	, inlineStyle: inlineStyleCss
//       				, styleclass : function(value, data, mapping) {
//						var useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
//						var channelDescr = data['RIGHT_CHANNEL_DESCR'];
//						if(nullToEmpty(channelDescr) != '' && nullToEmpty(useChannelDescr) != '' && channelDescr.indexOf(useChannelDescr) != 0) {
//							return 'channelDescrCss';
//						} else {
//							return '';
//						}
//					}
           		} /* B 채널 */
           		, { key : 'RIGHT_IS_CHANNEL_T1',			title : cflineMsgArray['t1'], align : 'center', width : '45px'
	           			, render : {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
	           			, editable: {type: "checkbox", rule: [{value: true, checked: true}, {value: false, checked: false}] }
	               		, editedValue: function (cell) {
	               			return $(cell).find('input').is(':checked') ? true:false;
	               		}
	               		, allowEdit : function(value, data, mapping) {
							return chkAllowEditChannel(value, data, mapping);
						}
	               		, styleclass : nodeCopyPasteCss
	               //		, inlineStyle: inlineStyleCss
           		}
           		, { key : 'RIGHT_NODE_ROLE_CD', 			title : cflineMsgArray['east']+cflineMsgArray['supSub'], align : 'center'//, width : '100px' 
	    	   			, render : function(value, data){ return data.RIGHT_NODE_ROLE_NM;}
	     	    		, editable:{
		      	    		type:"select", 
		      	    		rule : function(value, data){
		      	    			return eastNodeRole;
		      	    		}, attr : {
		      	    			style : "width: 83px;min-width:83px;padding: 2px 2px;"
	 			 			}
		      	    	}
				 		, editedValue : function (cell) {
				 			return $(cell).find('select option').filter(':selected').val();
				 		}
				 		, allowEdit : function(value, data, mapping) {
				 			if(data['LEFT_ADD_DROP_TYPE_CD'] == 'D' && data['RIGHT_ADD_DROP_TYPE_CD'] == 'N') {
				 				if((nullToEmpty(data['SERVICE_ID']) == "" && nullToEmpty(data['TRUNK_ID']) == "") 
										|| (nullToEmpty(data['SERVICE_ID']).indexOf('alopex') == 0 && data['TRUNK_ID'].indexOf('alopex') == 0) ) {
				 					return true;
				 				} else {
				 					return false;
				 				}
							} else {
								return chkAllowEdit(value, data, mapping, 'serviceLine');
							}
						}
				 		, styleclass : nodeCopyPasteCss
				 		//, inlineStyle: inlineStyleCss
	        	   } /* 상하위 */
	           , { key : rightOrgNm, 			title : cflineMsgArray['eastMtso'], align : 'center', width : '100px', styleclass : nodeCopyPasteCss  }
		];
	}

	mapping = mapping.concat(mappingCol);
	return mapping;
}

function addcolumn() {
	var mappingAddColumn = [ {
		key : 'LEFT_NE_ID',
		width : '100px',
		title : "좌장비",
		hidden : true,
		editable : {
			type : 'text'
		}
	}, {
		key : 'LEFT_NE_REMARK',
		width : '100px',
		title : "좌장비",
		hidden : true
	}, {
		key : 'LEFT_NE_ROLE_CD',
		width : '100px',
		title : "좌장비",
		hidden : true
	}, {
		key : 'LEFT_NE_ROLE_NM',
		width : '100px',
		title : "좌장비",
		hidden : true
	}, {
		key : 'LEFT_NE_DUMMY',
		width : '100px',
		title : "좌장비",
		hidden : true,
		value : function(value, data) {
			if (value == "Y") {
				return 'true';
			} else if (value == "N") {
				return 'false';
			} else {
				return value;
			}
		}
	}, {
		key : 'LEFT_MODEL_ID',
		width : '100px',
		title : "모델",
		hidden : true
	}, {
		key : 'LEFT_MODEL_NM',
		width : '100px',
		title : "모델",
		hidden : true
	}, {
		key : 'LEFT_PORT_ID',
		width : '100px',
		title : "좌포트",
		hidden : true,
		editable : {
			type : 'text'
		}
	}, {
		key : 'LEFT_PORT_NM',
		width : '100px',
		title : "좌포트",
		hidden : true
	}, {
		key : 'LEFT_RACK_NO',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_RACK_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_SHELF_NO',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_SHELF_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_SLOT_NO',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_CARD_ID',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_CARD_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_CARD_STATUS_CD',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_CARD_MODEL_ID',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_CARD_MODEL_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_PORT_STATUS_CD',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_PORT_STATUS_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_PORT_DUMMY',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_CHANNEL_IDS',
		width : '100px',
		hidden : true
	}, {
		key : 'LEFT_ORG_ID',
		width : '100px',
		hidden : true
	}

	, {
		key : 'RIGHT_NE_ID',
		width : '100px',
		title : "우장비",
		hidden : true,
		editable : {
			type : 'text'
		}
	}, {
		key : 'RIGHT_NE_REMARK',
		width : '100px',
		title : "우장비",
		hidden : true
	}, {
		key : 'RIGHT_NE_ROLE_CD',
		width : '100px',
		title : "우장비",
		hidden : true
	}, {
		key : 'RIGHT_NE_ROLE_NM',
		width : '100px',
		title : "우장비",
		hidden : true
	}, {
		key : 'RIGHT_NE_DUMMY',
		width : '100px',
		title : "우장비",
		hidden : true,
		value : function(value, data) {
			if (value == "Y") {
				return 'true';
			} else if (value == "N") {
				return 'false';
			} else {
				return value;
			}
		}
	}, {
		key : 'RIGHT_MODEL_ID',
		width : '100px',
		title : "모델",
		hidden : true
	}, {
		key : 'RIGHT_MODEL_NM',
		width : '100px',
		title : "모델",
		hidden : true
	}, {
		key : 'RIGHT_PORT_ID',
		width : '100px',
		title : "우포트",
		hidden : true,
		editable : {
			type : 'text'
		}
	}, {
		key : 'RIGHT_PORT_NM',
		width : '100px',
		title : "우포트",
		hidden : true
	}, {
		key : 'RIGHT_RACK_NO',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_RACK_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_SHELF_NO',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_SHELF_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_SLOT_NO',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_CARD_ID',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_CARD_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_CARD_STATUS_CD',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_CARD_MODEL_ID',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_CARD_MODEL_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_PORT_STATUS_CD',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_PORT_STATUS_NM',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_PORT_DUMMY',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_CHANNEL_IDS',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_ORG_ID',
		width : '100px',
		hidden : true
	}

	, {
		key : 'RX_LINK_ID',
		title : "RX_LINK_ID",
		hidden : true
	}, {
		key : 'RX_LINK_DIRECTION',
		title : "RX_LINK_DIRECTION",
		hidden : true
	// , value : function(value, data){
	// if(nullToEmpty(value)==""){
	// return nullToEmpty(data["RX_LINK_DIRECTION"]) == ""?
	// "RIGHT":data["RX_LINK_DIRECTION"];
	// } else {
	// return value;
	// }
	// }
	}, {
		key : 'LEFT_RX_NE_ID',
		hidden : true
	}, {
		key : 'LEFT_RX_NE_NM',
		hidden : true
	}, {
		key : 'LEFT_RX_PORT_ID',
		hidden : true
	}, {
		key : 'RIGHT_RX_NE_ID',
		hidden : true
	}, {
		key : 'RIGHT_RX_NE_NM',
		hidden : true
	}, {
		key : 'RIGHT_RX_PORT_ID',
		hidden : true
	}

	, {
		key : 'LINK_ID',
		width : '120px',
		title : "LINK_ID",
		hidden : true
	}, {
		key : 'LINK_SEQ',
		width : '120px',
		title : "LINK_SEQ",
		hidden : true
	}, {
		key : 'LINK_DIRECTION',
		width : '120px',
		title : "LINK_DIRECTION",
		hidden : true
	// , value : function(value, data) {
	// if(nullToEmpty(value)==""){
	// return nullToEmpty(data["LINK_ID"]) == ""?
	// "RIGHT":data["LINK_DIRECTION"];
	// } else {
	// return value;
	// }
	// }
	}, {
		key : 'LINK_VISIBLE',
		width : '100px',
		title : "LINK_VISIBLE",
		hidden : true
	// , value : function(value, data) {
	// if(nullToEmpty(value) != "") return value;
	// else if(nullToEmpty(data["LINK_VISIBLE"]) != "") return
	// data["LINK_VISIBLE"];
	// else return true;
	// }
	}

	, {
		key : 'USE_NETWORK_ID',
		width : '100px',
		title : "USE_NTWK_ID",
		hidden : true
	}, {
		key : 'USE_NETWORK_PATH_SAME_NO',
		width : '100px',
		title : "USE_NTWK_PATH_SAME_NO",
		hidden : true
	}, {
		key : 'USE_NETWORK_PATH_DIRECTION',
		width : '140px',
		title : "USE_NTWK_PATH_DIRECTION",
		hidden : true
	}, {
		key : 'USE_NETWORK_LINK_DIRECTION',
		width : '140px',
		title : "USE_NTWK_LINK_DIRECTION",
		hidden : true
	}, {
		key : 'USE_NETWORK_LEFT_CHANNEL_DESCR',
		width : '100px',
		title : 'USE_NTWK_LEFT_CHANNEL',
		hidden : true,
		value : function(value, data) {
			if (nullToEmpty(value) == "") {
				return "";
			} else {
				return value;
			}
		}
	}, {
		key : 'USE_NETWORK_RIGHT_CHANNEL_DESCR',
		width : '100px',
		title : 'RIGHT_NTWK_LEFT_CHANNEL',
		hidden : true
	}

	// 2018-09-12 1. RU고도화
	, {
		key : 'SERVICE_PATH_DIRECTION',
		width : '140px',
		title : "SERVICE_PATH_DIRECTION",
		hidden : true
	}, {
		key : 'SERVICE_PATH_SAME_NO',
		width : '100px',
		title : 'SERVICE_PATH_SAME_NO',
		hidden : true
	}, {
		key : 'SERVICE_LINE_LARGE_CD',
		width : '100px',
		title : 'SERVICE_LINE_LARGE_CD',
		hidden : true
	}, {
		key : 'SERVICE_LINE_SMALL_CD',
		width : '100px',
		title : 'SERVICE_LINE_SMALL_CD',
		hidden : true
	}

	, {
		key : 'TRUNK_PATH_DIRECTION',
		width : '140px',
		title : "TRUNK_PATH_DIRECTION",
		hidden : true
	}, {
		key : 'TRUNK_PATH_SAME_NO',
		width : '100px',
		title : 'TRUNK_PATH_SAME_NO',
		hidden : true
	}, {
		key : 'TRUNK_TOPOLOGY_LARGE_CD',
		width : '100px',
		title : 'TRUNK_TOPOLOGY_LARGE_CD',
		hidden : true
	}, {
		key : 'TRUNK_TOPOLOGY_SMALL_CD',
		width : '100px',
		title : 'TRUNK_TOPOLOGY_SMALL_CD',
		hidden : true
	}, {
		key : 'TRUNK_TOPOLOGY_MEANS_CD',
		width : '100px',
		title : 'TRUNK_TOPOLOGY_MEANS_CD',
		hidden : true
	}

	, {
		key : 'RING_PATH_DIRECTION',
		width : '140px',
		title : "RING_PATH_DIRECTION",
		hidden : true
	}, {
		key : 'RING_PATH_SAME_NO',
		width : '100px',
		title : 'RING_PATH_SAME_NO',
		hidden : true
	}, {
		key : 'RING_TOPOLOGY_LARGE_CD',
		width : '100px',
		title : 'RING_TOPOLOGY_LARGE_CD',
		hidden : true
	}, {
		key : 'RING_TOPOLOGY_SMALL_CD',
		width : '100px',
		title : 'RING_TOPOLOGY_SMALL_CD',
		hidden : true
	}, {
		key : 'RING_TOPOLOGY_MEANS_CD',
		width : '100px',
		title : 'RING_TOPOLOGY_MEANS_CD',
		hidden : true
	}

	, {
		key : 'WDM_TRUNK_PATH_DIRECTION',
		width : '140px',
		title : "WDM_TRUNK_PATH_DIRECTION",
		hidden : true
	}, {
		key : 'WDM_TRUNK_PATH_SAME_NO',
		width : '100px',
		title : 'WDM_TRUNK_PATH_SAME_NO',
		hidden : true
	}, {
		key : 'WDM_TRUNK_TOPOLOGY_LARGE_CD',
		width : '100px',
		title : 'WDM_TRUNK_TOPOLOGY_LARGE_CD',
		hidden : true
	}, {
		key : 'WDM_TRUNK_TOPOLOGY_SMALL_CD',
		width : '100px',
		title : 'WDM_TRUNK_TOPOLOGY_SMALL_CD',
		hidden : true
	}, {
		key : 'WDM_TRUNK_TRUNK_TOPOLOGY_MEANS_CD',
		width : '100px',
		title : 'WDM_TRUNK_TOPOLOGY_MEANS_CD',
		hidden : true
	}

	, {
		key : 'LEFT_ADD_DROP_TYPE_CD',
		title : 'LEFT_ADD',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_ADD_DROP_TYPE_CD',
		title : 'RIGHT_DROP',
		width : '100px',
		hidden : true
	}

	// 노드 복사, 잘라내기, 붙여넣기 활용 컬럼
	, {
		key : 'LEFT_NE_COPY',
		title : 'LEFT_NE_COPY',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_NE_COPY',
		title : 'RIGHT_NE_COPY',
		width : '100px',
		hidden : true
	}

	// 동일 국사 테두리 활용 컬럼
	, {
		key : 'LEFT_ORG_BORDER',
		title : 'LEFT_ORG_BORDER',
		width : '100px',
		hidden : true
	}, {
		key : 'RIGHT_ORG_BORDER',
		title : 'RIGHT_ORG_BORDER',
		width : '100px',
		hidden : true
	}

	// 가입자망링 오류 데이터 하이라이트 표시를 위한 컬럼
	, {
		key : 'ROW_HIGHLIGHT',
		title : 'ROW_HIGHLIGHT',
		width : '100px',
		hidden : true
	}

	, {
		key : 'RING_TOPOLOGY_LARGE_CD',
		title : 'RING_TOPOLOGY_LARGE_CD',
		width : '100px',
		hidden : true
	}, {
		key : 'RING_TOPOLOGY_SMALL_CD',
		title : 'RING_TOPOLOGY_SMALL_CD',
		width : '100px',
		hidden : true
	}, {
		key : 'RING_TOPOLOGY_MEANS_CD',
		title : 'RING_TOPOLOGY_MEANS_CD',
		width : '100px',
		hidden : true
	}

	// 2019-02-08 2. 5G-PONU고도화
	, {
		key : 'LEFT_FIVE_GPON_EQP_TYPE',
		title : 'LEFT_FIVE_GPON_EQP_TYPE',
		width : '100px',
		hidden : true,
		value : function(value, data) {
			return getFiveGponEqpTypeOld(data, 'LEFT');
		}
	}, {
		key : 'RIGHT_FIVE_GPON_EQP_TYPE',
		title : 'RIGHT_FIVE_GPON_EQP_TYPE',
		width : '100px',
		hidden : true,
		value : function(value, data) {
			return getFiveGponEqpTypeOld(data, 'RIGHT');
		}
	}

	];
	return mappingAddColumn;
}

function chkAllowEdit(value, data, mapping, division) {
	if (division === 'ring') {
		allowYn = (data['WDM_TRUNK_MERGE'] == data['WDM_TRUNK_ID']
				|| data['RING_MERGE'] == data['RING_ID'] || data['RING_MERGE'] == data['WDM_TRUNK_ID']) ? false
				: true;
	} else if (division == 'trunk') {
		allowYn = (data['RING_MERGE'] === data['RING_ID']) ? false : true;
	} else if (division === 'serviceLine') {
		if (data['SERVICE_MERGE'] === data['SERVICE_ID']
				|| data['TRUNK_MERGE'] === data['TRUNK_ID']
				|| data['TRUNK_MERGE'] === data['RING_ID']
				|| data['TRUNK_MERGE'] === data['WDM_TRUNK_ID']) {
			allowYn = false;
		} else {
			if (mapping.key == 'SERVICE_NM' || mapping.key == 'TRUNK_NM'
					|| mapping.key == 'WDM_TRUNK_NM'
					|| mapping.key == 'RING_NM') {
				if ((data['LEFT_NE_ID'] != null && data['LEFT_NE_ID'] != 'DV00000000000')
						|| (data['RIGHT_NE_ID'] != null && data['RIGHT_NE_ID'] != 'DV00000000000')) {
					allowYn = false;
				} else {
					allowYn = true;
				}
			} else {
				allowYn = true;
			}
		}
	}
	// 2019-09-30 5. 기간망 링 선번 고도화
	else if (division === 'cascadingRing') {
		allowYn = (data['RING_MERGE'] == data['RING_ID']) ? false : true;
	}
	
	/* ADAMS 연동 고도화*/
	//TODO 이전으로 20240911
//	if($("#mgmtGrpCd").val() == "0002" && ((topoSclCd != '030' || topoSclCd != '031'))) {
//	//if(nullToEmpty(mgmtOnrNm) == "ADAMS") {
//		if (mapping.key == 'TRUNK_NM' || mapping.key == 'WDM_TRUNK_NM' || mapping.key == 'RING_NM'){
//			allowYn = false;
//		} 
//		else {
//			if(mapping.key == 'LEFT_NODE_ROLE_CD' || mapping.key == 'LEFT_NE_NM' || mapping.key == 'LEFT_PORT_DESCR') {
//				if (data['LEFT_NE_ROLE_CD'] == '11' || data['LEFT_NE_ROLE_CD'] == '162'
//					|| data['LEFT_NE_ROLE_CD'] == '177'
//					|| data['LEFT_NE_ROLE_CD'] == '178'
//					|| data['LEFT_NE_ROLE_CD'] == '182'
//					|| data['LEFT_NE_ROLE_CD'] == '99' || nullToEmpty(data['LEFT_NE_ROLE_CD']) == ""
//						//|| data['LEFT_MODEL_NM'] == 'FDF'
//							) {
//					allowYn = true;
//				} else {
//					allowYn = false;
//				}
//			}
//			if(mapping.key == 'RIGHT_NODE_ROLE_CD' || mapping.key == 'RIGHT_NE_NM' || mapping.key == 'RIGHT_PORT_DESCR') {	
//				if (data['RIGHT_NE_ROLE_CD'] == '11'
//					|| data['RIGHT_NE_ROLE_CD'] == '162'
//					|| data['RIGHT_NE_ROLE_CD'] == '177'
//					|| data['RIGHT_NE_ROLE_CD'] == '178'
//					|| data['RIGHT_NE_ROLE_CD'] == '182'
//					|| data['RIGHT_NE_ROLE_CD'] == '99' || nullToEmpty(data['RIGHT_NE_ROLE_CD']) == ""
//						//|| data['RIGHT_MODEL_NM'] == 'FDF'
//							) {
//					allowYn = true;
//				} else {
//					allowYn = false;
//				}
//			}
//		}
//	}
	
	return allowYn;
}

/**
 * 
 * @param value
 * @param data
 * @param mapping
 * @param division
 * @returns {Boolean}
 * 
 * 11 FDF 162 QDF 177 OFD 178 IJP 182 PBOX 추가 2019-12-24
 */
function chkAllowEditChannel(value, data, mapping, division) {
	
	if (mapping.key == "LEFT_CHANNEL_DESCR") {
		if (data['LEFT_NE_ROLE_CD'] == '11' || data['LEFT_NE_ROLE_CD'] == '162'
				|| data['LEFT_NE_ROLE_CD'] == '177'
				|| data['LEFT_NE_ROLE_CD'] == '178'
				|| data['LEFT_NE_ROLE_CD'] == '182') {
			// FDF 장비
			allowChYn = false;
		} else if (data['USE_NETWORK_ID'] != null
				&& data['USE_NETWORK_ID'] == data['WDM_TRUNK_ID']) {
			// 사용 네트워크가 WDM일 때
			allowChYn = false;
		} else if (data['USE_NETWORK_ID'] != null
				&& data['USE_NETWORK_ID'] == data['SERVICE_ID']) {
			// 사용 네트워크가 서비스일 때
			allowChYn = false;
		}
		// MW장비인 경우(편집안됨)
		else if (checkMwEqpYn(data, "LEFT") == true) {
			allowChYn = false;
		}
		// 링 편집중이고 사용 네트워크가 링 때
		else if (data['USE_NETWORK_ID'] != null
				&& data['USE_NETWORK_ID'] == data['RING_ID']
				&& division == 'ring') {
			allowChYn = false;
		}
		// 장비가 CRN인경우
		else if (data['LEFT_FIVE_GPON_EQP_TYPE'] == 'CRN') {
			allowChYn = false;
		} else {
			allowChYn = true;
		}
	} else if (mapping.key == "RIGHT_CHANNEL_DESCR") {
		if (data['RIGHT_NE_ROLE_CD'] == '11'
				|| data['RIGHT_NE_ROLE_CD'] == '162'
				|| data['RIGHT_NE_ROLE_CD'] == '177'
				|| data['RIGHT_NE_ROLE_CD'] == '178'
				|| data['RIGHT_NE_ROLE_CD'] == '182') {
			// FDF 장비
			allowChYn = false;
		} else if (data['USE_NETWORK_ID'] != null
				&& data['USE_NETWORK_ID'] == data['WDM_TRUNK_ID']) {
			// 사용 네트워크가 WDM일 때
			allowChYn = false;
		} else if (data['USE_NETWORK_ID'] != null
				&& data['USE_NETWORK_ID'] == data['SERVICE_ID']) {
			// 사용 네트워크가 서비스일 때
			allowChYn = false;
		}
		// MW장비인 경우(편집안됨)
		else if (checkMwEqpYn(data, "RIGHT") == true) {
			allowChYn = false;
		}
		// 링 편집중이고 사용 네트워크가 링 때
		else if (data['USE_NETWORK_ID'] != null
				&& data['USE_NETWORK_ID'] == data['RING_ID']
				&& division == 'ring') {

			allowChYn = false;
		}
		// 장비가 CRN인경우
		else if (data['RIGHT_FIVE_GPON_EQP_TYPE'] == 'CRN') {
			allowChYn = false;
		} else {
			allowChYn = true;
		}
	} else {
		allowChYn = true;
	}

	/* ADAMS 연동 고도화 */
	//TODO 이전으로 20240911
//	if($("#mgmtGrpCd").val() == "0002" && ((topoSclCd != '030' || topoSclCd != '031'))) {
//	//if(nullToEmpty(mgmtOnrNm) == "ADAMS") {
//		if (mapping.key == 'TRUNK_NM' || mapping.key == 'WDM_TRUNK_NM' || mapping.key == 'RING_NM'){
//			allowYn = false;
//		}
//		
//		if(mapping.key == 'LEFT_CHANNEL_DESCR') {
//			if (data['LEFT_NE_ROLE_CD'] == '11' || data['LEFT_NE_ROLE_CD'] == '162'
//				|| data['LEFT_NE_ROLE_CD'] == '177'
//				|| data['LEFT_NE_ROLE_CD'] == '178'
//				|| data['LEFT_NE_ROLE_CD'] == '182'
//				|| data['LEFT_NE_ROLE_CD'] == '99' || nullToEmpty(data['LEFT_NE_ROLE_CD']) == "") {
//				allowChYn = true;
//			} else {
//				allowChYn = false;
//			}
//		}
//		if(mapping.key == 'RIGHT_CHANNEL_DESCR') {	
//			if (data['RIGHT_NE_ROLE_CD'] == '11'
//				|| data['RIGHT_NE_ROLE_CD'] == '162'
//				|| data['RIGHT_NE_ROLE_CD'] == '177'	
//				|| data['RIGHT_NE_ROLE_CD'] == '178'
//				|| data['RIGHT_NE_ROLE_CD'] == '182'
//				|| data['RIGHT_NE_ROLE_CD'] == '99' || nullToEmpty(data['RIGHT_NE_ROLE_CD']) == "") {
//				allowChYn = true;
//			} else {
//				allowChYn = false;
//			}
//		}
//	}
	/* ADAMS 연동 고도화
	if($("#mgmtGrpCd").val() == "0002") {
		
		if(mapping.key == 'LEFT_CHANNEL_DESCR') {
			if (data['LEFT_NE_ROLE_CD'] == '11' || data['LEFT_NE_ROLE_CD'] == '162'
				|| data['LEFT_NE_ROLE_CD'] == '177'
				|| data['LEFT_NE_ROLE_CD'] == '178'
				|| data['LEFT_NE_ROLE_CD'] == '182'
				|| data['LEFT_NE_ROLE_CD'] == '99' || nullToEmpty(data['LEFT_NE_ROLE_CD']) == "") {
				allowChYn = true;
			} else {
				allowChYn = false;
			}
		}
		if(mapping.key == 'RIGHT_CHANNEL_DESCR') {	
			if (data['RIGHT_NE_ROLE_CD'] == '11'
				|| data['RIGHT_NE_ROLE_CD'] == '162'
				|| data['RIGHT_NE_ROLE_CD'] == '177'	
				|| data['RIGHT_NE_ROLE_CD'] == '178'
				|| data['RIGHT_NE_ROLE_CD'] == '182'
				|| data['RIGHT_NE_ROLE_CD'] == '99' || nullToEmpty(data['RIGHT_NE_ROLE_CD']) == "") {
				allowChYn = true;
			} else {
				allowChYn = false;
			}
		}
	}
	*/
	return allowChYn;
}

function groupingColumnNetworkPath() {

	var groupingColumn = [ 'SERVICE_MERGE', 'TRUNK_MERGE', 'RING_MERGE',
			'RING_MERGE2', 'RING_MERGE3', 'RONT_MERGE', 'WDM_TRUNK_MERGE' ];
	if (gridDivision == "ring") {
		groupingColumn = [ 'SERVICE_MERGE', 'TRUNK_MERGE', 'RING_MERGE',
				'RING_MERGE3', 'RONT_MERGE', 'WDM_TRUNK_MERGE' ];
	}

	var grouping = {
		by : groupingColumn,
		useGrouping : true,
		useGroupRowspan : true,
		useDragDropBetweenGroup : false, // 그룹핑 컬럼간의 드래그앤드랍 불허용
		useGroupRearrange : true
	};

	return grouping;
}

function serviceStyleCss(value, data, mapping) {
	var style = {
		'white-space' : 'pre-line'
	};

	if (value != null && value != undefined && value != "") {
		style['background-color'] = '#D3EEFF';
	}

	return style;

}

function trunkStyleCss(value, data, mapping) {
	var style = {
		'white-space' : 'pre-line'
	};

	if (value != null && value != undefined && value != "") {
		style['background-color'] = '#F1EBBF';
	}

	return style;

}

function ringStyleCss(value, data, mapping) {
	var style = {
		'white-space' : 'pre-line'
	};

	if (value != null && value != undefined && value != "") {
		style['background-color'] = '#FFEAEA';
	} else {
		/*
		 * if (gridDivision === 'serviceLine' && isRuCoreLineOld()) {
		 * if(nullToEmpty(data.SERVICE_NM) !='' &&
		 * nullToEmpty(data.SERVICE_MERGE) != '' && nullToEmpty(data.SERVICE_ID) != '' &&
		 * nullToEmpty(data.SERVICE_MERGE) == nullToEmpty(data.SERVICE_ID) ) {
		 * var style = {'background-color' : '#D3EEFF'}; return style; } }
		 */
	}

	return style;

}

function wdmStyleCss(value, data, mapping) {
	var style = {
		'white-space' : 'pre-line'
	};

	if (value != null && value != undefined && value != "") {
		style['background-color'] = '#D6EED6';
	}

	return style;

}

function rontTrkStyleCss(value, data, mapping) {
	var style = {
		'white-space' : 'pre-line'
	};

	if (value != null && value != undefined && value != "") {
		style['background-color'] = '#FFCCFF';
	}

	return style;

}

function nodeCopyPasteCss(value, data, mapping) {
	// 장비 복사, 잘라내기 배경색
	var channelYn = false;
	if (data.LEFT_NE_COPY == "copy") {
		if (mapping.key.indexOf("LEFT") == 0) {
			return 'nodeSelectBackground';
		}
	} else if (data.RIGHT_NE_COPY == "copy") {
		if (mapping.key.indexOf("RIGHT") == 0) {
			return 'nodeSelectBackground';
		}
	} else {
		channelYn = true;
	}

	// 국사 묶음 표시
	if (nullToEmpty(data.LEFT_ORG_BORDER) != "") {
		if (data.LEFT_ORG_BORDER.indexOf("leftSame") == 0) {
			if (mapping.key == "LEFT_ORG_NM") {
				// if(mapping.key.indexOf("LEFT") == 0) {
				var indexKey = data.LEFT_ORG_BORDER.replace("leftSame", "") % 3;
				return 'orgBorder' + indexKey;
				// if(mapping.key == "LEFT_ORG_NM") {
				// return 'orgBorder'+indexKey + ' left';
				// } else if(mapping.key == "LEFT_CHANNEL_DESCR"){
				// return 'orgBorder'+indexKey + ' right';
				// } else {
				// return 'orgBorder'+indexKey;
				// }

			}
		}
	}

	if (nullToEmpty(data.RIGHT_ORG_BORDER) != "") {
		if (data.RIGHT_ORG_BORDER.indexOf("rightSame") == 0) {
			if (mapping.key == "RIGHT_ORG_NM") {
				// if(mapping.key.indexOf("RIGHT") == 0) {
				var indexKey = data.RIGHT_ORG_BORDER.replace("rightSame", "") % 3;
				return 'orgBorderRght' + indexKey;
				// if(mapping.key == "RIGHT_ORG_NM") {
				// return 'orgBorderRght'+indexKey + ' left';
				// } else if(mapping.key == "RIGHT_CHANNEL_DESCR") {
				// return 'orgBorderRght'+indexKey + ' right';
				// } else {
				// return 'orgBorderRght'+indexKey;
				// }
			}
		}
	}

	// 채널과 사용네트워크의 채널의 시작이 다를 때 테두리 색깔
	if (channelYn) {
		var useChannelDescr = "";
		var channelDescr = "";
		if (mapping.key == "LEFT_CHANNEL_DESCR") {
			useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
			channelDescr = data['LEFT_CHANNEL_DESCR'];
		} else if (mapping.key == "RIGHT_CHANNEL_DESCR") {
			useChannelDescr = data['USE_NETWORK_RIGHT_CHANNEL_DESCR'];
			channelDescr = data['RIGHT_CHANNEL_DESCR'];
		}

		if (nullToEmpty(channelDescr) != ''
				&& nullToEmpty(useChannelDescr) != ''
				&& channelDescr.indexOf(useChannelDescr) != 0) {
			return 'channelDescrCss';
		} else {
			return '';
		}
	}
}

function inlineStyleCss(value, data, mapping) {

	/*
	 * if (gridDivision === 'serviceLine' && isRuCoreLineOld()) {
	 * if(nullToEmpty(data.SERVICE_NM) !='' && nullToEmpty(data.SERVICE_MERGE) != '' &&
	 * nullToEmpty(data.SERVICE_ID) != '' && nullToEmpty(data.SERVICE_MERGE) ==
	 * nullToEmpty(data.SERVICE_ID) ) { var style = {'background-color' :
	 * '#D3EEFF'}; return style; } }
	 */

	var style = {
		'text-decoration' : 'line-through',
		'color' : 'red'
	};

	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if (deletecheck) {
		return style;
	} else if (checkNotExistNeFromRing(data, mapping)) {
		style = {
			'font-weight' : 'bold',
			'color' : 'red'
		};
		return style;
		// 2019-10-23
	} else if (checkNotExistPortFromRing(data, mapping)) {
		style = {
			'font-weight' : 'bold',
			'color' : 'red'
		};
		return style;
	} else if ((typeof topoLclCd != "undefined" && typeof topoSclCd != "undefined")
			&& topoLclCd == '001' && topoSclCd == "031") {
		// 가입자망링 데이터 오류 체크
		if ($('#' + detailGridId).alopexGrid("readOption").cellInlineEdit) {
			// 셀이 편집 상태인 경우 배경
			var style = {
				'background' : '#93DAFF'
			};
			if (data['ROW_HIGHLIGHT'] == "H")
				return style;
			return false;
		} else {
			// 셀이 편집이 아닌 경우 빨간 글자
			var style = {
				'color' : 'red'
			};
			if (data['ROW_HIGHLIGHT'] == "H")
				return style;
			else
				return '';
		}
	} else {
		var style = {
			'background-color' : '#BEBEBE'
		};

		if (mapping.key == 'LEFT_NE_NM') {
			if (data.LEFT_NE_DUMMY)
				return style;
			else
				return '';
		} else if (mapping.key == 'RIGHT_NE_NM') {
			if (data.RIGHT_NE_DUMMY)
				return style;
			else
				return '';
		} else {
			return '';
		}
	}
}

function tooltipText(value, data, mapping) {

	var str = "삭제된 장비 또는 포트입니다.";
	var deletecheck = checkDeleteNodeOrPort(data, mapping);
	if (deletecheck) {
		return str;
	} else {
		if (mapping.key == 'LEFT_NE_NM') {
			str = '장비ID : ' + nullToEmpty(data.LEFT_NE_ID) + '\n장비명 : '
					+ nullToEmpty(data.LEFT_NE_NM) + '\n장비역할 : '
					+ nullToEmpty(data.LEFT_NE_ROLE_NM) + '\n제조사 : '
					+ nullToEmpty(data.LEFT_VENDOR_NM) + '\n모델 : '
					+ nullToEmpty(data.LEFT_MODEL_NM) + '\n모델(대) : '
					+ nullToEmpty(data.LEFT_MODEL_LCL_NM) + '\n모델(중) : '
					+ nullToEmpty(data.LEFT_MODEL_MCL_NM) + '\n모델(소) : '
					+ nullToEmpty(data.LEFT_MODEL_SCL_NM) + '\n상태 : '
					+ nullToEmpty(data.LEFT_NE_STATUS_NM) + '\n국사 : '
					+ nullToEmpty(data.LEFT_ORG_NM) + '\n전송실 : '
					+ nullToEmpty(data.LEFT_ORG_NM_L3) + '\n더미장비 : '
					+ nullToEmpty(data.LEFT_NE_DUMMY);
		} else if (mapping.key == 'RIGHT_NE_NM') {
			str = '장비ID : ' + nullToEmpty(data.RIGHT_NE_ID) + '\n장비명 : '
					+ nullToEmpty(data.RIGHT_NE_NM) + '\n장비역할 : '
					+ nullToEmpty(data.RIGHT_NE_ROLE_NM) + '\n제조사 : '
					+ nullToEmpty(data.RIGHT_VENDOR_NM) + '\n모델 : '
					+ nullToEmpty(data.RIGHT_MODEL_NM) + '\n모델(대) : '
					+ nullToEmpty(data.RIGHT_MODEL_LCL_NM) + '\n모델(중) : '
					+ nullToEmpty(data.RIGHT_MODEL_MCL_NM) + '\n모델(소) : '
					+ nullToEmpty(data.RIGHT_MODEL_SCL_NM) + '\n상태 : '
					+ nullToEmpty(data.RIGHT_NE_STATUS_NM) + '\n국사 : '
					+ nullToEmpty(data.RIGHT_ORG_NM) + '\n전송실 : '
					+ nullToEmpty(data.RIGHT_ORG_NM_L3) + '\n더미장비 : '
					+ nullToEmpty(data.RIGHT_NE_DUMMY);
		} else if (mapping.key == 'LEFT_PORT_DESCR') { 

			//SKB 가입자망선번에 OLT장비가 등록된 경우 포트, 카드명까지 나타낸다. 2025-03-26 이재락M
			if(mgmtGrpCd == '0002' && nullToEmpty(data.LEFT_CARD_NM) != "") {

				var portNmIndex = data.LEFT_PORT_DESCR.indexOf("/");
				var portNm = "";
				if(portNmIndex > 0) {	// OLT장비 포트인 경우
					portNm = data.LEFT_PORT_DESCR.substr(0, portNmIndex);
				}
				
				str = '포트ID : ' + nullToEmpty(data.LEFT_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(portNm) + '\n카드명 : ' 
						+ nullToEmpty(data.LEFT_CARD_NM) + '\n상태 : '
						+ nullToEmpty(data.LEFT_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.LEFT_PORT_DUMMY);
			} else {

				str = '포트ID : ' + nullToEmpty(data.LEFT_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(data.LEFT_PORT_DESCR) + '\n상태 : '
						+ nullToEmpty(data.LEFT_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.LEFT_PORT_DUMMY);
			} 
			
		} else if (mapping.key == 'RIGHT_PORT_DESCR') {
			//SKB 가입자망선번에 OLT장비가 등록된 경우 포트, 카드명까지 나타낸다. 2025-03-26 이재락M
			if(mgmtGrpCd == '0002' && nullToEmpty(data.RIGHT_CARD_NM) != "") {

				var portNmIndex = data.RIGHT_PORT_DESCR.indexOf("/");
				var portNm = "";
				if(portNmIndex > 0) {	// OLT장비 포트인 경우
					portNm = data.RIGHT_PORT_DESCR.substr(0, portNmIndex);
				}
				
				str = '포트ID : ' + nullToEmpty(data.RIGHT_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(portNm) + '\n카드명 : ' 
						+ nullToEmpty(data.RIGHT_CARD_NM) + '\n상태 : '
						+ nullToEmpty(data.RIGHT_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.RIGHT_PORT_DUMMY);
			} else {
				str = '포트ID : ' + nullToEmpty(data.RIGHT_PORT_ID) + '\n포트명 : '
						+ nullToEmpty(data.RIGHT_PORT_DESCR) + '\n상태 : '
						+ nullToEmpty(data.RIGHT_PORT_STATUS_NM) + '\n더미포트 : '
						+ nullToEmpty(data.RIGHT_PORT_DUMMY);
			}
		} else {
			str = value;
		}
	}
	return str;
}

function tooltipNetworkText(value, data, mapping) {

	var str = '';
	if (mapping.key == 'SERVICE_NM') {
		str = data.SERVICE_NM;
	} else if (mapping.key == 'TRUNK_NM') {
		// if ( data.TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
		// str = '트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
		// } else {
		// str = data.TRUNK_NM;
		// }

		str = data.TRUNK_NM;
	} else if (mapping.key == 'RING_NM') {
		// if ( data.RING_PATH_MERGED_WITH_ORIGINAL_PATH ) {
		// str = '링 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
		// } else {
		// str = data.RING_NM;
		// }

		str = data.RING_NM;
	} else if (mapping.key == 'WDM_TRUNK_NM') {
		// if ( data.WDM_TRUNK_PATH_MERGED_WITH_ORIGINAL_PATH ) {
		// str = 'WDM 트렁크 선번이 변경되어 보정되었습니다.\n변경 사항을 반영하려면 편집 및 저장해야 합니다. ';
		// } else {
		// str = data.WDM_TRUNK_NM;
		// }

		str = data.WDM_TRUNK_NM;
	}

	return str;
}

function checkDeleteNodeOrPort(data, mapping) {
	var deletecheck = false;
	// WEST 장비
	if (mapping.key == 'LEFT_NE_NM') {
		if (data.LEFT_NE_STATUS_CD == '02' || data.LEFT_NE_STATUS_CD == '03') {
			deletecheck = true;
		}
	} else if (mapping.key == 'LEFT_PORT_DESCR'
			|| mapping.key == 'LEFT_CHANNEL_DESCR') {
		if (data.LEFT_PORT_STATUS_CD == '0003'
				|| data.LEFT_PORT_STATUS_CD == '0004') {
			deletecheck = true;
		}
	}

	// EAST 장비
	if (mapping.key == 'RIGHT_NE_NM') {
		if (data.RIGHT_NE_STATUS_CD == '02' || data.RIGHT_NE_STATUS_CD == '03') {
			deletecheck = true;
		}
	} else if (mapping.key == 'RIGHT_PORT_DESCR'
			|| mapping.key == 'RIGHT_CHANNEL_DESCR') {
		if (data.RIGHT_PORT_STATUS_CD == '0003'
				|| data.RIGHT_PORT_STATUS_CD == '0004') {
			deletecheck = true;
		}
	}
	return deletecheck;
}

function checkNotExistNeFromRing(data, mapping) {
	var deletecheck = false;
	// WEST 장비
	if (mapping.key == 'LEFT_NE_NM') {
		if (data.LEFT_NE_ID == '-') {
			deletecheck = true;
		}
	}

	// EAST 장비
	if (mapping.key == 'RIGHT_NE_NM') {
		if (data.RIGHT_NE_ID == '-') {
			deletecheck = true;
		}
	}
	return deletecheck;
}

// TODO 2019-10-23
function checkNotExistPortFromRing(data, mapping) {
	var deletecheck = false;
	// WEST 장비
	if (mapping.key == 'LEFT_PORT_DESCR') {
		if (data.LEFT_NE_ID != '-' && data.LEFT_PORT_ID == '-') {
			deletecheck = true;
		}
	}

	// EAST 장비
	if (mapping.key == 'RIGHT_PORT_DESCR') {
		if (data.RIGHT_NE_ID != '-' && data.RIGHT_PORT_ID == '-') {
			deletecheck = true;
		}
	}
	return deletecheck;
}
/**
 * getFiveGponEqpTypeOld 넘겨받은 데이터가 어떤 5G-PON장비타입인지 체크하여 리턴(COT, MRN, CRN, DUH,
 * DUL)
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function getFiveGponEqpTypeOld(data, preFix) {
	var result = false;
	// COT
	result = isFiveGponCotOld(data, preFix);
	if (result == true)
		return "COT";

	// MRN(MAIN_RN)
	result = isFiveGponMrnOld(data, preFix);
	if (result == true)
		return "MRN";

	// CRN(SUB_RN)
	result = isFiveGponCrnOld(data, preFix);
	if (result == true)
		return "CRN";

	// DUH(DU)
	result = isFiveGponDuHOld(data, preFix);
	if (result == true)
		return "DUH";

	// DUL(RU)
	result = isFiveGponDuLOld(data, preFix);
	if (result == true)
		return "DUL";

	return "";
}

// 2019-02-08 2. 5G-PONU고도화
/**
 * isFiveGponCotOld 넘겨받은 데이터가 5G-PON COT타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponCotOld(chkData, preFix) {
	// 5G-PON 2.0
	var result = false;
	var val = nullToEmpty(eval("chkData." + preFix + "_MODEL_ID"));

	var chkVal = [];
	if (nullToEmpty(baseInfData.fiveGponEqpMdlIdList) != ""
			&& nullToEmpty(baseInfData.fiveGponEqpMdlIdList.cotEqpMdlList) != "") {
		chkVal = baseInfData.fiveGponEqpMdlIdList.cotEqpMdlList;
	}

	for (var i = 0; i < chkVal.length; i++) {
		if (val == chkVal[i].text) {
			result = true;
			break;
		}
	}

	if (result == true) {
		return result;
	}

	result = isFiveGponOneCotOld(chkData, preFix);
	return result;
}

/**
 * isFiveGponOneCotOld 넘겨받은 데이터가 5G-PON 1.0 COT타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponOneCotOld(chkData, preFix) {

	// 5G-PON 1.0
	/*
	 * 장비모델 ID 값으로 판별 DMT0008327 5GPON_COT_쏠리드 DMT0008330 5GPON_COT_HFR
	 * DMT0008333 5GPON_COT_썬웨이브텍 DMT0008336 5GPON_COT_코위버(주)
	 */
	var result = false;
	var val = nullToEmpty(eval("chkData." + preFix + "_MODEL_ID"));

	var chkVal = [ "DMT0008327", "DMT0008330", "DMT0008333", "DMT0008336" ];

	for (var i = 0; i < chkVal.length; i++) {
		if (val == chkVal[i]) {
			result = true;
			break;
		}
	}
	return result;
}

/**
 * isFiveGponMrnOld 넘겨받은 데이터가 5G-PON MRN타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponMrnOld(chkData, preFix) {
	// 5G-PON 2.0
	var result = false;
	var val = nullToEmpty(eval("chkData." + preFix + "_MODEL_ID"));

	// var chkVal = ["DMT0009081", "DMT0009082", "DMT0009083", "DMT0009084",
	// "DMT0009085", "DMT0009086", "DMT0009087", "DMT0009088"];
	var chkVal = [];
	if (nullToEmpty(baseInfData.fiveGponEqpMdlIdList) != ""
			&& nullToEmpty(baseInfData.fiveGponEqpMdlIdList.mrnEqpMdlList) != "") {
		chkVal = baseInfData.fiveGponEqpMdlIdList.mrnEqpMdlList;
	}
	for (var i = 0; i < chkVal.length; i++) {
		if (val == chkVal[i].text) {
			result = true;
			break;
		}
	}

	if (result == true) {
		return result;
	}

	// 5G-PON 1.0
	result = isFiveGponOneMrnOld(chkData, preFix);
	return result;

}

/**
 * isFiveGponMrnOneOld 넘겨받은 데이터가 5G-PON 1.0 MRN타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponOneMrnOld(chkData, preFix) {

	var result = false;

	// 5G-PON 1.0
	var val = nullToEmpty(eval("chkData." + preFix + "_CARD_MODEL_NM"));

	chkVal = [ "5GPON_MAIN_RN_" ];
	for (var i = 0; i < chkVal.length; i++) {
		if (val.indexOf(chkVal[i]) == 0) {
			result = true;
			break;
		}
	}
	return result;

}

/**
 * isFiveGponCrnOld 넘겨받은 데이터가 5G-PON CRN타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponCrnOld(chkData, preFix) {
	// 5G-PON 2.0
	var result = false;
	var val = nullToEmpty(eval("chkData." + preFix + "_MODEL_ID"));

	var chkVal = [];
	if (nullToEmpty(baseInfData.fiveGponEqpMdlIdList) != ""
			&& nullToEmpty(baseInfData.fiveGponEqpMdlIdList.crnEqpMdlList) != "") {
		chkVal = baseInfData.fiveGponEqpMdlIdList.crnEqpMdlList;
	}
	for (var i = 0; i < chkVal.length; i++) {
		if (val == chkVal[i].text) {
			result = true;
			break;
		}
	}

	if (result == true) {
		return result;
	}
	result = isFiveGponOneCrnOld(chkData, preFix)
	return result;
}

/**
 * isFiveGponCrnOneOld 넘겨받은 데이터가 5G-PON 1.0 CRN타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponOneCrnOld(chkData, preFix) {

	var result = false;

	// 5G-PON 1.0
	var val = nullToEmpty(eval("chkData." + preFix + "_CARD_MODEL_NM"));

	chkVal = [ "5GPON_SUB_RN_" ];
	for (var i = 0; i < chkVal.length; i++) {
		if (val.indexOf(chkVal[i]) == 0) {
			result = true;
			break;
		}
	}
	return result;
}

/**
 * isFiveGponDuHOld 넘겨받은 데이터가 5G-PON DUH타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponDuHOld(chkData, preFix) {
	// 5G-PON 2.0
	// 5G-PON 1.0

	var result = false;
	var val = nullToEmpty(eval("chkData." + preFix + "_NE_ROLE_NM"));

	var chkVal = [ "5G DU-H", "ERP 기지국", "LTE DU" ];
	for (var i = 0; i < chkVal.length; i++) {
		if (val == chkVal[i]) {
			result = true;
			break;
		}
	}
	return result;
}

/**
 * isFiveGponDuLOld 넘겨받은 데이터가 5G-PON DUL타입장비인지 체크
 * 
 * @param data
 *            LINK형태 데이터
 * @param preFix
 *            LEFT/RIGHT 구분자
 */
function isFiveGponDuLOld(chkData, preFix) {
	// 5G-PON 2.0
	// 5G-PON 1.0
	var result = false;
	var val = nullToEmpty(eval("chkData." + preFix + "_NE_ROLE_NM"));

	var chkVal = [ "5G DU-L", "ERP 광중계기", "광중계기", "MiBOS", "LTE RU" ];
	for (var i = 0; i < chkVal.length; i++) {
		if (val == chkVal[i]) {
			result = true;
			break;
		}
	}
	return result;
}

/**
 * checkMwEqpYn MW 장비여부
 * 
 * @param rowData :
 *            해당 행 값
 * @param preFix :
 *            LEFT or RIGHT
 */
function checkMwEqpYn(rowData, preFix) {
	var chkVal = eval("rowData." + preFix + "_NE_ROLE_CD");

	if (chkVal == "10") {
		return true;
	}
	return false;
}



/**
 * isCmuxRnCard
 * 넘겨받은 데이터가 CMUX 기본형 RN타입 카드인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isCmuxRnCard(chkData, preFix) { 

	/*
     * CM00002952541 (CMUX-R29)
     * CM00002952563 (CMUX-R27)
     */
    var result = false;
    var val = nullToEmpty(chkData);
    
    var chkVal = ["CM00002952541", "CM00002952563"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]) {
            result =  true;
            break;
        }
    }
    return result;
}

/**
 * isCmuxRnExtCard
 * 넘겨받은 데이터가 CMUX 확장형 RN타입 카드인지 체크
 * @param data   LINK형태 데이터
 * @param preFix LEFT/RIGHT 구분자
 */
function isCmuxRnExtCard(chkData, preFix) { 

	/*
     * CM00002952542 (CMUX-R29_E) 
     * CM00002952564 (CMUX-R27_E)
     */
    var result = false;
    var val = nullToEmpty(chkData);
    
    var chkVal = ["CM00002952542", "CM00002952564"];
    for (var i = 0 ; i < chkVal.length ; i++) {
        if (val == chkVal[i]) {
            result =  true;
            break;
        }
    }
    return result;
}
