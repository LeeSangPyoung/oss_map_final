/**
 * KepcoNDISDataAnalGrid.js
 * NDIS 자료분석 DataGrid정의
 *
 * @author 오현수  
 * @date 2016. 10. 18. 오전 10:00:00
 * @version 1.0
 */
//NDIS 자료분석 KepcoNDISDataAnalList.jsp
var KepcoNDISDataAnalGrid = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridFqstrCmprAnal_SKT = {
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
			   {fromIndex:6, toIndex:8,  title:"SKT", id:"headGrpA"},
			   {fromIndex:9, toIndex:11, title:"SKN", id:"headGrpB"}
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
				key : "kepcoIdxNo", align:"center",
				title : "전주번호",
				width: "100px",
				sorting: false
			}, {
				key : "kepcoDrawNo", align:"center",
				title : "전산번호",
				width: "100px",
				sorting: false
			}, {
				key : "baseT", align:"right",
				title : "기준월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "compareT", align:"right",
				title : "비교월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeT", align:"center",
				title : "증감조수",
				width: "90px",
				sorting: false
			}, {
				key : "baseN", align:"right",
				title : "기준월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "compareN", align:"right",
				title : "비교월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeN", align:"center",
				title : "증감조수",
				width: "90px",
				sorting: false
			}],
			paging: {
		      	pagerSelect: false,
		      	hidePageList: true
			},			
	}
	//2.한전현장조사비교분석(SKB)
	options.defineDataGridFqstrCmprAnal_SKB = {
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
			   {fromIndex:6, toIndex:8,   title:"SKB",   id:"headGrpA"},
			   {fromIndex:9, toIndex:11,  title:"두루넷",  id:"headGrpB"},
			   {fromIndex:12, toIndex:14, title:"온세통신", id:"headGrpC"}
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
				key : "kepcoIdxNo", align:"center",
				title : "전주번호",
				width: "100px",
				sorting: false
			}, {
				key : "kepcoDrawNo", align:"center",
				title : "전산번호",
				width: "100px",
				sorting: false
			}, {
				key : "baseB", align:"right",
				title : "기준월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "compareB", align:"right",
				title : "비교월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeB", align:"center",
				title : "증감조수",
				width: "90px",
				sorting: false
			}, {
				key : "baseD", align:"right",
				title : "기준월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "compareD", align:"right",
				title : "비교월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeD", align:"center",
				title : "증감조수",
				width: "90px",
				sorting: false
			}, {
				key : "baseO", align:"right",
				title : "기준월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "compareO", align:"right",
				title : "비교월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeO", align:"center",
				title : "증감조수",
				width: "90px",
				sorting: false
			}],
			paging: {
		      	pagerSelect: false,
		      	hidePageList: true
			},			
	}
	////3.한전공가요금내역서비교분석
	options.defineDataGridFeeDtsCmprAnal = {
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
		   	   {fromIndex:4, toIndex:5,   title:"전산화번호",   id:"headGrp"},
			   {fromIndex:7, toIndex:9,   title:"조수증감내역",   id:"headGrpA"},
			   {fromIndex:10, toIndex:31,  title:"요금증감내역",  id:"headGrpB"},
			   {fromIndex:12, toIndex:13, title:"<spring:message code='label.approvalCode1'/>", id:"headGrpB_1"},
			   {fromIndex:14, toIndex:16, title:"<spring:message code='label.approvalCode2'/>", id:"headGrpB_2"},
			   {fromIndex:17, toIndex:19, title:"<spring:message code='label.approvalCode3'/>", id:"headGrpB_3"},
			   {fromIndex:20, toIndex:22, title:"<spring:message code='label.approvalCode4'/>", id:"headGrpB_4"},
			   {fromIndex:23, toIndex:25, title:"<spring:message code='label.approvalCode5'/>", id:"headGrpB_5"},
			   {fromIndex:26, toIndex:28, title:"<spring:message code='label.approvalCode6'/>", id:"headGrpB_6"},
			   {fromIndex:29, toIndex:31, title:"<spring:message code='label.approvalCode7'/>", id:"headGrpB_7"}
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
				key : "kepcoIdxNo", align:"center",
				title : "전주번호",
				width: "100px",
				sorting: false
			}, {
				key : "kepcoDrawNo", align:"center",
				title : "전산번호",
				width: "100px",
				sorting: false
			}, {
				key : "comp", align:"center",
				title : "<spring:message code='label.businessManCode'/>",
				width: "100px",
				sorting: false
			}, {
				key : "base", align:"right",
				title : "기준월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "compare", align:"right",
				title : "비교월조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "change", align:"center",
				title : "증감조수",
				width: "90px",
				sorting: false
			}, {
				key : "changeTotalJosu", align:"right",
				title : "총조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeTotalCost", align:"right",
				title : "총금액",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeAuthJosu", align:"right",
				title : "정상조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeAuthCost", align:"right",
				title : "정상요금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthJosu", align:"right",
				title : "무단조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthCost", align:"right",
				title : "무단요금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthCostAdd", align:"right",
				title : "무단추징금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthNewJosu", align:"right",
				title : "신규위약조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthNewCost", align:"right",
				title : "신규위약요금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthNewCostAdd", align:"right",
				title : "신규무단추징금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeHfcUnauthJosu", align:"right",
				title : "HFC무단조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeHfcUnauthCost", align:"right",
				title : "HFC무단요금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeHfcUnauthCostAdd", align:"right",
				title : "HFC무단추징금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeConnJosu", align:"right",
				title : "점속개소조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeConnCost", align:"right",
				title : "점속개소요금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeConnCostAdd", align:"right",
				title : "점속개소추징금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeSelfUnauthJosu", align:"right",
				title : "자진신고무단조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeSelfUnauthCost", align:"right",
				title : "자진신고무단요금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeSelfUnauthCostAdd", align:"right",
				title : "자진신고무단추징금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthNewJosu2", align:"right",
				title : "신규무단조수",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthNewCost2", align:"right",
				title : "신규무단요금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}, {
				key : "changeUnauthNewCostAdd2", align:"right",
				title : "신규무단추징금",
				width: "90px",
				sorting: false, render : {type : "number"}
			}],
			paging: {
		      	pagerSelect: false,
		      	hidePageList: true
			},			
	}
	
	return options;
	
}(jQuery, Tango, _));
