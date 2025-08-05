/**
 * KepcoCbcntDBAnalGrid.js
 * 조수DB분석 DataGrid정의
 *
 * @author 오현수  
 * @date 2016. 10. 17. 오전 10:00:00
 * @version 1.0
 */
//조수DB분석 KepcoCbcntDBAnalList.jsp
//1.요금내역서 기준 승인코드별/지사별 집계 (지사별 기본 집계)
var KepcoCbcntDBAnalGrid = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridKephdBasSum = {
			columnFixUpto: 4,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['kephdNm'] == "<spring:message code='label.summarization'/>"){
						return {color:'red'}
					}
					if(data['compCd'] == "<spring:message code='label.subTotal'/>"){
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
			   {fromIndex:5, toIndex:11, title:"<spring:message code='label.approvalCode'/>", id:"headGrpA"}
			],
			
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "kephdNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationHeadOffice'/>",
				width: "120px"
			}, {
				key : "compCd", align:"left",
				title : "<spring:message code='label.businessManCode'/>",
				width: "120px"
			}, {
				key : "totalBonsu", align:"right",
				title : "<spring:message code='label.sumIncb'/>",
				width: '100px',
				sorting: false, render : {type : "number"}
			}, {
				key : "totalJosu", align:"right",
				title : "<spring:message code='label.sumJosu'/>",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod1", align:"right",
				title : "1",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod2", align:"right",
				title : "2",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod3", align:"right",
				title : "3",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod4", align:"right",
				title : "4",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod5", align:"right",
				title : "5",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod6", align:"right",
				title : "6",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod7", align:"right",
				title : "7",
				width: "100px",
				sorting: false, render : {type : "number"}
			}]
			//,paging:{
			//	pagerSelect:false
			//}
	}
	
	options.defineDataGridKepboBasSum = {
			columnFixUpto: 5,
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
		  	   {fromIndex:6, toIndex:12, title:"<spring:message code='label.approvalCode'/>", id:"headGrpA"}
			],
			
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "kephdNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationHeadOffice'/>",
				width: "120px"
			}, {       
				key : "kepboNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOffice'/>",
				width: "120px"
			}, {
				key : "compCd", align:"left",
				title : "<spring:message code='label.businessManCode'/>",
				width: "120px"
			}, {
				key : "totalBonsu", align:"right",
				title : "<spring:message code='label.sumIncb'/>",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "totalJosu", align:"right",
				title : "<spring:message code='label.sumJosu'/>",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod1", align:"right",
				title : "1",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod2", align:"right",
				title : "2",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod3", align:"right",
				title : "3",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod4", align:"right",
				title : "4",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod5", align:"right",
				title : "5",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod6", align:"right",
				title : "6",
				width: "100px",
				sorting: false, render : {type : "number"}
			}, {
				key : "josuCod7", align:"right",
				title : "7",
				width: "100px",
				sorting: false, render : {type : "number"}
			}]
			//,paging:{
			//	pagerSelect:false
			//}
	}
	
	options.defineDataGridKephdDtlSum = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['KEPHDNM'] == "<spring:message code='label.summarization'/>"){
						return {color:'red'}
					}
					if(data['COMPCD'] == "<spring:message code='label.subTotal'/>"){
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
			   {fromIndex:4, toIndex:10, title:"<spring:message code='label.approvalCode'/>", id:"headGrp_1"}
			],
			
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "kephdNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationHeadOffice'/>",
				width: "100px"
			}, {
				key : "compCd", align:"left",
				title : "<spring:message code='label.businessManCode'/>",
				width: "120px"
			}, {
				key : "totalJosu", align:"center",
				title : "<spring:message code='label.sumJosu'/>",
				width: "100px",
				sorting: false
			/*	
			}, {
				key : 'josuCod1', align:'right',
				title : '1',
				width: '100px',
				sorting: false, render : {type : "number"}
			}, {
				key : 'josuCod2', align:'right',
				title : '2',
				width: '100px',
				sorting: false, render : {type : "number"}
			}, {
				key : 'josuCod3', align:'right',
				title : '3',
				width: '100px',
				sorting: false, render : {type : "number"}
			}, {
				key : 'josuCod4', align:'right',
				title : '4',
				width: '100px',
				sorting: false, render : {type : "number"}
			}, {
				key : 'josuCod5', align:'right',
				title : '5',
				width: '100px',
				sorting: false, render : {type : "number"}
			}, {
				key : 'josuCod6', align:'right',
				title : '6',
				width: '100px',
				sorting: false, render : {type : "number"}
			}, {
				key : 'josuCod7', align:'right',
				title : '7',
				width: '100px',
				sorting: false, render : {type : "number"}
				*/
			}]
			//,paging:{
			//	pagerSelect:false
			//}			
	}
	
	options.defineDataGridKepboDtlSum = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: false
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['KEPHDNM'] == "<spring:message code='label.summarization'/>"){
						return {color:'red'}
					}
					if(data['KEPBONM'] == "<spring:message code='label.hdofcSubTotal'/>"){
						return {color:'blue'}
					}
					if(data['COMPCD'] == "<spring:message code='label.boSubTotal'/>"){
						return {color:'orange'}
					}
				},
		    	styleclass : function(data, rowOption){
		    		if(data['KEPHDNM'] == "<spring:message code='label.summarization'/>"){
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
				width: "120px"
			}, {
				key : "compCd", align:"left",
				title : "<spring:message code='label.businessManCode'/>",
				width: "120px"
			}, {
				key : "totalBonsu", align:"right",
				title : "<spring:message code='label.sumIncb'/>",
				width: "100px",
				sorting: false, render : {type : "number"}
			}]
			//,paging:{
			//	pagerSelect:false
			//}			
	}
	
	return options;
			
}(jQuery, Tango, _));
