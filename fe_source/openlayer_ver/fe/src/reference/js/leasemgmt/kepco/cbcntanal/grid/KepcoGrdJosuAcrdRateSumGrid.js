/**
 * KepcoGrdJosuAcrdRateSumGrid.js
 * (지중)한전조수DB일치율분석 DataGrid정의
 *
 * @author 오현수  
 * @date 2016. 11. 07. 오전 10:00:00
 * @version 1.0
 */
//(지중)한전조수DB일치율 KepcoGrdJosuAcrdRateSum.jsp
var KepcoGrdJosuAcrdGrid = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridGrdJosuAcrd = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			renderMapping : {
				"number" : {
					renderer : function(value, data, render, mapping){
						if(value != null && value != ""){
							var reg = /(^[+-]?\d+)(\d{3})/;
							value += '';
							while(reg.test(value)){
								value = value.replace(reg, '$1' + ',' + '$2');
							}
							return value;
						}else{
							return value;
						}
					}
				}
			},
			message: {
				nodata : "<spring:message code='message.noInquiryData'/>",
				filterNodata : "No data"
			},
			headerGroup: [
			   {fromIndex:4,  toIndex:5,  title:"자가설비", id:"headGrpA"},
			   {fromIndex:6,  toIndex:7,  title:"상태설비", id:"headGrpB"},
			   {fromIndex:8,  toIndex:16, title:"NDIS 현장조사표 기준", id:"headGrpC"},
			   {fromIndex:17, toIndex:25, title:"GIS 설비 기준", id:"headGrpD"},
			   {fromIndex:26, toIndex:26, title:"일치율", id:"headGrpE"},
			   {fromIndex:27, toIndex:28, title:"NDIS GIS 검토결과", id:"headGrpF"},
			   {fromIndex:29, toIndex:30, title:"GIS NDIS 과금 검토결과", id:"headGrpG"},
			   {fromIndex:31, toIndex:37, title:"세부내역서 공가요금(T)", id:"headGrpH"},
			   {fromIndex:38, toIndex:44, title:"세부내역서 공가요금(N)", id:"headGrpI"}
			],
			
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "kephdNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationHeadOffice'/>",
				width: "100px"
			}, {
				key : "kepboNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOffice'/>",
				width: "100px"
			}, {
				key : "kepboCd", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOfficeCode'/>",
				width: "140px"
			}, {
				key : "selfHcode", align:"center",
				title : "전산번호",
				width: "100px",
				sorting: false
			}, {
				key : "selfFeedNm", align:"left",
				title : "선로전주명",
				width: "100px",
				sorting: false
			}, {
				key : "otherHcode", align:"center",
				title : "전산번호",
				width: "100px",
				sorting: false
			}, {
				key : "otherFeedNm", align:"left",
				title : "선로전주명",
				width: "100px",
				sorting: false
			}, {
				key : "ndisRentBase", align:"center",
				title : "임대기준",
				width: "90px",
				sorting: false
			}, {
				key : "ndisOutPipeStd", align:"center",
				title : "관로규격",
				width: "90px",
				sorting: false
			}, {
				key : "ndisInPipeStd", align:"center",
				title : "PE내관규격",
				width: "90px",
				sorting: false
			}, {
				key : "ndisComp", align:"center",
				title : "<spring:message code='label.communicationBusinessMan'/>",
				width: "100px",
				sorting: false
			}, {
				key : "ndisCalcLen", align:"right",
				title : "계산긍장",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisActualLen", align:"right",
				title : "실측긍장",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisCnt", align:"right",
				title : "개수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisSumCalcLen", align:"right",
				title : "계산긍장 합계",
				width: "120px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisSumActualLen", align:"right",
				title : "실측긍장 합계",
				width: "120px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisRentBase", align:"center",
				title : "임대기준",
				width: "90px",
				sorting: false
			}, {
				key : "gisOutPipeStd", align:"center",
				title : "관로규격",
				width: "90px",
				sorting: false
			}, {
				key : "gisInPipeStd", align:"center",
				title : "PE내관규격",
				width: "90px",
				sorting: false
			}, {
				key : "gisComp", align:"center",
				title : "<spring:message code='label.communicationBusinessMan'/>",
				width: "100px",
				sorting: false
			}, {
				key : "gisCalcLen", align:"right",
				title : "계산긍장",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisActualLen", align:"right",
				title : "실측긍장",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisCnt", align:"right",
				title : "개수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisSumCalcLen", align:"right",
				title : "계산긍장 합계",
				width: "120px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisSumActualLen", align:"right",
				title : "실측긍장 합계",
				width: "120px",
				sorting: false, render : {type : "number"}
			}, {
				key : "equalNdisGis", align:"center",
				title : "NDIS&GIS",
				width: "120px",
				sorting: false
			}, {
				key : "resultNdisGisT", align:"center",
				title : "분석결과(T)",
				width: "110px",
				sorting: false
			}, {
				key : "resultNdisGisN", align:"center",
				title : "분석결과(N)",
				width: "110px",
				sorting: false
			}, {
				key : "resultGisPayT", align:"center",
				title : "분석결과(T)",
				width: "110px",
				sorting: false
			}, {
				key : "resultGisPayN", align:"center",
				title : "분석결과(N)",
				width: "110px",
				sorting: false
			}, {
				key : "payApprGubunT", align:"center",
				title : "승인구분",
				width: "110px",
				sorting: false
			}, {
				key : "payStartDtT", align:"center",
				title : "요금시작일",
				width: "110px",
				sorting: false
			}, {
				key : "payEndDtT", align:"center",
				title : "요금종료일",
				width: "110px",
				sorting: false
			}, {
				key : "payClearSpanT", align:"right",
				title : "경간",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "payRealClearSpanT", align:"right",
				title : "실측경간",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "payUnitCostT", align:"right",
				title : "적용단가",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "equalNdisPayT", align:"center",
				title : "과금일치여부",
				width: "110px",
				sorting: false
			}, {
				key : "payApprGubunN", align:"center",
				title : "승인구분",
				width: "110px",
				sorting: false
			}, {
				key : "payStartDtN", align:"center",
				title : "요금시작일",
				width: "110px",
				sorting: false
			}, {
				key : "payEndDtN", align:"center",
				title : "요금종료일",
				width: "110px",
				sorting: false
			}, {
				key : "payClearSpanN", align:"right",
				title : "경간",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "payRealClearSpanN", align:"right",
				title : "실측경간",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "payUnitCostN", align:"right",
				title : "적용단가",
				width: "110px",
				sorting: false, render : {type : "number"}
			}, {
				key : "equalNdisPayN", align:"center",
				title : "과금일치여부",
				width: "110px",
				sorting: false
			}],
			paging: {
		      	pagerSelect: false,
		      	hidePageList: true
			},			
	}
	
	return options;
	
}(jQuery, Tango, _));
