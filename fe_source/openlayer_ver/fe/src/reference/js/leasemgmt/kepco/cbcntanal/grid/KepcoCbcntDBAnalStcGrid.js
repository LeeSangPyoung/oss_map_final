/**
 * KepcoCbcntDBAnalStcGrid.js
 * 조수DB분석통계 DataGrid정의
 *
 * @author 오현수  
 * @date 2016. 10. 13. 오전 10:00:00
 * @version 1.0
 */
//조수DB분석통계 KepcoCbcntDBAnalStcList.jsp
//1.NDIS VS GIS 비교분석(SKT)
var KepcoCbcntDBAnalStcGrid = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridNdisVSGisCmprStc_SKT = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['resultRmk'] == "<spring:message code='label.mgmtHdofcSubTotal'/>"){
						return {color:'red'}
					}
					if(data['resultRmk'] == "<spring:message code='label.brnchSubTotal'/>"){
						return {color:'blue'}
					}
				},
		    	styleclass : function(data, rowOption){
		    		if(data['resultRmk'] == "<spring:message code='label.mgmtHdofcSubTotal'/>"){
		    			return 'row-highlight'
		    		}
		    	}
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
			   {fromIndex:4, toIndex:12, title:"SKT1", id:"headGrpA"},
			   {fromIndex:4, toIndex:6, title:"한전NDIS 기준", id:"headGrpA_1"},
			   {fromIndex:7, toIndex:9, title:"SK GIS 기준", id:"headGrpA_2"},
			   {fromIndex:11, toIndex:12, title:"비율", id:"headGrpA_3"},
			   {fromIndex:13, toIndex:21, title:"SKT2", id:"headGrpB"},
			   {fromIndex:13, toIndex:15, title:"한전NDIS 기준", id:"headGrpB_1"},
			   {fromIndex:16, toIndex:18, title:"SK GIS 기준", id:"headGrpB_2"},
			   {fromIndex:20, toIndex:21, title:"비율", id:"headGrpB_3"}
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
				key : "resultRmk", align:"left",
				title : "구분",
				width: "140px"
			}, {
				key : "ndisBonsuT", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisJosuT", align:"right",
				title : "조수(가)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisUnauthJosuT", align:"right",
				title : "위약본수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisBonsuT", align:"right",
				title : "본",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisJosuT", align:"right",
				title : "조수(나)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisUnauthJosuT", align:"right",
				title : "위약본수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuGapT", align:"right",
				title : "조수차이(다=가-나)",
				width: "140px",
				sorting: false, render : {type : "number"}
			}, {
				key : "rateBonsuT", align:"left",
				title : "본",
				width: "90px",
				sorting: false
			}, {
				key : "rateJosuT", align:"left",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false
			}, {
				key : "ndisBonsuN", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisJosuN", align:"right",
				title : "조수(라)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisUnauthJosuN", align:"right",
				title : "위약조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisBonsuN", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisJosuN", align:"right",
				title : "조수(마)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisUnauthJosuN", align:"right",
				title : "위약조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuGapN", align:"right",
				title : "조수차이(바=라-마)",
				width: "140px",
				sorting: false, render : {type : "number"}
			}, {
				key : "rateBonsuN", align:"left",
				title : "본",
				width: "90px",
				sorting: false
			}, {
				key : "rateJosuN", align:"left",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false
			}]
			//,paging:{
			//	pagerSelect:false
			//}			
	}
	
	options.defineDataGridNdisVSGisCmprStc_SKB = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['resultRmk'] == "<spring:message code='label.mgmtHdofcSubTotal'/>"){
						return {color:'red'}
					}
					if(data['resultRmk'] == "<spring:message code='label.brnchSubTotal'/>"){
						return {color:'blue'}
					}
				},
		    	styleclass : function(data, rowOption){
		    		if(data['resultRmk'] == "<spring:message code='label.mgmtHdofcSubTotal'/>"){
		    			return 'row-highlight'
		    		}
		    	}
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
			   {fromIndex:4, toIndex:12, title:"SKB", id:"headGrpA"},
			   {fromIndex:4, toIndex:6, title:"한전NDIS 기준", id:"headGrpA_1"},
			   {fromIndex:7, toIndex:9, title:"SK GIS 기준", id:"headGrpA_2"},
			   {fromIndex:11, toIndex:12, title:"비율", id:"headGrpA_3"},
			   {fromIndex:13, toIndex:21, title:"두루넷", id:"headGrpB"},
			   {fromIndex:13, toIndex:15, title:"한전NDIS 기준", id:"headGrpB_1"},
			   {fromIndex:16, toIndex:18, title:"SK GIS 기준", id:"headGrpB_2"},
			   {fromIndex:20, toIndex:21, title:"비율", id:"headGrpB_3"}
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
				key : "resultRmk", align:"left",
				title : "구분",
				width: "140px"
			}, {
				key : "ndisBonsuT", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisJosuT", align:"right",
				title : "조수(가)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisUnauthJosuT", align:"right",
				title : "위약본수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisBonsuT", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisJosuT", align:"right",
				title : "조수(나)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisUnauthJosuT", align:"right",
				title : "위약본수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuGapT", align:"right",
				title : "조수차이(다=가-나)",
				width: "140px",
				sorting: false, render : {type : "number"}
			}, {
				key : "rateBonsuT", align:"left",
				title : "본",
				width: "90px",
				sorting: false
			}, {
				key : "rateJosuT", align:"left",
				title : "조수",
				width: "90px",
				sorting: false
			}, {
				key : "ndisBonsuN", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisJosuN", align:"right",
				title : "조수(라)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisUnauthJosuN", align:"right",
				title : "위약조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisBonsuN", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisJosuN", align:"right",
				title : "조수(마)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisUnauthJosuN", align:"right",
				title : "위약조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuGapN", align:"right",
				title : "조수차이(바=라-마)",
				width: "140px",
				sorting: false, render : {type : "number"}
			}, {
				key : "rateBonsuN", align:"left",
				title : "본",
				width: "90px",
				sorting: false
			}, {
				key : "rateJosuN", align:"left",
				title : "조수",
				width: "90px",
				sorting: false
			}]
			//,paging:{
			//	pagerSelect:false
			//}			
	}
	
	options.defineDataGridFildVSNdisNGisCmprStc = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['resultRmk'] == "<spring:message code='label.mgmtHdofcSubTotal'/>"){
						return {color:'red'}
					}
					if(data['resultRmk'] == "<spring:message code='label.brnchSubTotal'/>"){
						return {color:'blue'}
					}
				},
		    	styleclass : function(data, rowOption){
		    		if(data['resultRmk'] == "<spring:message code='label.mgmtHdofcSubTotal'/>"){
		    			return 'row-highlight'
		    		}
		    	}
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
			   {fromIndex:4, toIndex:12, title:"현장과 한전 NDIS 비교검토결과", id:"headGrpA"},
			   {fromIndex:4, toIndex:6, title:"현장 기준", id:"headGrpA_1"},
			   {fromIndex:7, toIndex:9, title:"한전NDIS 기준", id:"headGrpA_2"},
			   {fromIndex:11, toIndex:12, title:"비율", id:"headGrpA_3"},
			   {fromIndex:13, toIndex:21, title:"현장과 SK GIS 비교검토결과", id:"headGrpB"},
			   {fromIndex:13, toIndex:15, title:"현장", id:"headGrpB_1"},
			   {fromIndex:16, toIndex:18, title:"SK GIS 기준", id:"headGrpB_2"},
			   {fromIndex:20, toIndex:21, title:"비율", id:"headGrpB_3"}
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
				key : "resultRmk", align:"left",
				title : "구분",
				width: "140px"
			}, {
				key : "fieldBonsuTn1", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "fieldJosuTn1", align:"right",
				title : "조수(A)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "fieldUnauthJosuTn1", align:"right",
				title : "위약본수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisBonsuTn", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisJosuTn", align:"right",
				title : "조수(B)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "ndisUnauthJosuTn", align:"right",
				title : "위약본수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuGapTn1", align:"right",
				title : "조수차이(C=A-B)",
				width: "140px",
				sorting: false, render : {type : "number"}
			}, {
				key : "rateBonsu1", align:"left",
				title : "본",
				width: "90px",
				sorting: false
			}, {
				key : "rateJosu1", align:"left",
				title : "조수",
				width: "90px",
				sorting: false
			}, {
				key : "fieldBonsuTn2", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "fieldJosuTn2", align:"right",
				title : "조수(D)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "fieldUnauthJosuTn2", align:"right",
				title : "위약조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisBonsuTn", align:"right",
				title : "본",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisJosuTn", align:"right",
				title : "조수(E)",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gisUnauthJosuTn", align:"right",
				title : "위약조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuGapTn2", align:"right",
				title : "조수차이(F=D-E)",
				width: "140px",
				sorting: false, render : {type : "number"}
			}, {
				key : "rateBonsu2", align:"left",
				title : "본",
				width: "90px",
				sorting: false
			}, {
				key : "rateJosu2", align:"left",
				title : "조수",
				width: "90px",
				sorting: false
			}]
			//,paging:{
			//	pagerSelect:false
			//}			
	}
	
	return options;
	
}(jQuery, Tango, _));
