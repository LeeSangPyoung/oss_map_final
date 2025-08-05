/**
 * KepcbFeeDtsStdStcGrid.js
 * 요금DB분석 DataGrid정의
 *
 * @author 오현수  
 * @date 2016. 10. 05. 오전 10:00:00
 * @version 1.0
 */
//요금DB분석 KepcbFeeDtsStdStcList.jsp
//1.요금내역서 기준 요금통계(지점별 기본 통계)
var KepcbFeeDtsStdStcGrid = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridKepcbFeeDtsStdStc = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['kephdNm'] == "<spring:message code='label.summarization'/>"){
						return {color:'red'}
					}
					if(data['kepboNm'] == "<spring:message code='label.subTotal'/>"){
						return {color:'blue'}
					}
				},
		    	styleclass : function(data, rowOption){
		    		if(data['kephdNm'] == "<spring:message code='label.summarization'/>"){
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
			   {fromIndex:4, toIndex:8, title:"<spring:message code='label.feeDtsDocSum'/>", id:"headGrpA"},
			   {fromIndex:4, toIndex:6, title:"<spring:message code='label.thisMonth'/>", id:"headGrpA_1"},
			   {fromIndex:7, toIndex:8, title:"<spring:message code='label.lmthCntrstIcdc'/>", id:"headGrpA_2"},
			   {fromIndex:9, toIndex:10, title:"<spring:message code='label.approvalCodeTotal'/>", id:"headGrpB"},
			   {fromIndex:9, toIndex:10, title:"<spring:message code='label.thisMonth'/>", id:"headGrpB_1"},
			   {fromIndex:11, toIndex:12, title:"<spring:message code='label.approval'/>", id:"headGrpC"},
			   {fromIndex:11, toIndex:12, title:"<spring:message code='label.approvalCode1'/>", id:"headGrpC_1"},
			   {fromIndex:13, toIndex:24, title:"<spring:message code='label.napvAmt'/>", id:"headGrpD"},
			   {fromIndex:13, toIndex:14, title:"<spring:message code='label.approvalCode2'/>", id:"headGrpD_1"},
			   {fromIndex:15, toIndex:16, title:"<spring:message code='label.approvalCode3'/>", id:"headGrpD_2"},
			   {fromIndex:17, toIndex:18, title:"<spring:message code='label.approvalCode4'/>", id:"headGrpD_3"},
			   {fromIndex:19, toIndex:20, title:"<spring:message code='label.approvalCode5'/>", id:"headGrpD_4"},
			   {fromIndex:21, toIndex:22, title:"<spring:message code='label.approvalCode6'/>", id:"headGrpD_5"},
			   {fromIndex:23, toIndex:24, title:"<spring:message code='label.approvalCode7'/>", id:"headGrpD_6"},
			   {fromIndex:25, toIndex:36, title:"<spring:message code='label.napvAdalAmt'/>", id:"headGrpE"},
			   {fromIndex:25, toIndex:26, title:"<spring:message code='label.approvalCode2'/>", id:"headGrpE_1"},
			   {fromIndex:27, toIndex:28, title:"<spring:message code='label.approvalCode3'/>", id:"headGrpE_2"},
			   {fromIndex:29, toIndex:30, title:"<spring:message code='label.approvalCode4'/>", id:"headGrpE_3"},
			   {fromIndex:31, toIndex:32, title:"<spring:message code='label.approvalCode5'/>", id:"headGrpE_4"},
			   {fromIndex:33, toIndex:34, title:"<spring:message code='label.approvalCode6'/>", id:"headGrpE_5"},
			   {fromIndex:35, toIndex:36, title:"<spring:message code='label.approvalCode7'/>", id:"headGrpE_6"}
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
				key : "kepafBizrDivCd", align:"center",
				title : "<spring:message code='label.businessMan'/>",
				width: "100px"
			}, {
				key : "totalBonsu", align:"right",
				title : "<spring:message code='label.theNumberInsideTheCable'/>",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "totalJosu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "totalCost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gapTotalJosu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "gapTotalCost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "sumCodeJosu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "sumCodeCost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "authCode1Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "authCode1Cost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode2Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode2Cost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode3Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode3Cost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode4Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode4Cost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode5Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode5Cost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode6Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode6Cost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode7Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "unauthCode7Cost", align:"right",
				title : "<spring:message code='label.fee'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode2Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode2Cost", align:"right",
				title : "<spring:message code='label.adalAmt'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode3Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode3Cost", align:"right",
				title : "<spring:message code='label.adalAmt'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode4Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px", render : {type : "number"}
			}, {
				key : "addCode4Cost", align:"right",
				title : "<spring:message code='label.adalAmt'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode5Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode5Cost", align:"right",
				title : "<spring:message code='label.adalAmt'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode6Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode6Cost", align:"right",
				title : "<spring:message code='label.adalAmt'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode7Josu", align:"right",
				title : "<spring:message code='label.cableCount'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "addCode7Cost", align:"right",
				title : "<spring:message code='label.adalAmt'/>",
				width: "90px",
				sorting: false, render : {type : "number"}
			}]
			//,paging:{
			//	pagerSelect:false
			//}
		}			
	
	return options;
			
}(jQuery, Tango, _));
