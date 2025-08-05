/**
 * KepcoDBAnalList.js
 * 한전DB분석 DataGrid정의
 *
 * @author 오현수  
 * @date 2016. 10. 04. 오전 10:00:00
 * @version 1.0
 */
//한전DB분석 KepcoDBAnalList.jsp
var KepcoDBAnalGrid = (function($, Tango, _){
	var options = {};
	
	//1.한전지점별집계
	options.defineDataGridKepcbAlsSum = {
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
			   {fromIndex:6, toIndex:13, title:"현장조사표", id:"nmInfo"},
			   {fromIndex:14, toIndex:21, title:"요금내역서", id:"npInfo"},
			   {fromIndex:22, toIndex:29, title:"비고(현장조사표 - 요금내역서)", id:"gapInfo"},
			],
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "chrDmdYm", align:"center",
				title : "과금청구월",
				width: "100px"
			}, {
				key : "kephdNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationHeadOffice'/>",
				width: "100px"
			}, {
				key : "kepboNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOffice'/>",
				width: "100px"
			}, {
				key : "kepboCd", align:"center",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOfficeCode'/>",
				width: "100px"							
			}, {
				key : "kepafBizrDivCd", align:"center",
				title : "<spring:message code='label.businessMan'/>",
				width: "100px"
			}, {
				key : "fldTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}]
			//,paging:{
			//	pagerSelect:false
			//}			
	}
	//2.전주별상세
	options.defineDataGridKepcoTlplClDtl = {
			columnFixUpto: 7,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: true
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
			headerGroup:[{
				fromIndex:8, toIndex:16, title:"현장조사표", id :"nmInfo"
			},{
				fromIndex:17, toIndex:24, title:"요금내역서", id :"npInfo"
			},{
				fromIndex:25, toIndex:32, title:"비고(현장조사표 - 요금내역서)", id :"gapInfo"
			}],
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "chrDmdYm", align:"center",
				title : "과금청구월",
				width: "100px"
			}, {
				key : "kephdNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationHeadOffice'/>",
				width: "100px"
			}, {
				key : "kepboNm", align:"left",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOffice'/>",
				width: "100px"							
			}, {
				key : "kepboCd", align:"center",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOfficeCode'/>",
				width: "100px"							
			}, {
				key : "kepcoIdxNo", align:"center",
				title : "관리구",
				width: "100px"							
			}, {
				key : "kepcoDrawNo", align:"center",
				title : "전주번호",
				width: "100px"							
			}, {
				key : "kepafBizrDivCd", align:"center",
				title : "<spring:message code='label.businessMan'/>",
				width: "100px"
			}, {
				key : "fldBox", align:"center",
				title : "함체여부",
				width: "100px",
				sorting: false
			}, {
				key : "fldTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gapCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}],
			paging: {
		      	pagerSelect: false,
		      	hidePageList: true
			}			
	}
	//3.사용자지정전주별상세
	options.defineDataGridUserApmtTlplClDtl = {
			columnFixUpto: 3,
			numberingColumnFromZero : false,
			defaultColumnMapping:{
				sorting: true
			},
			rowOption:{
				inlineStyle: function(data,rowOption){
					if(data['spclMtrCtt'] != null){
						return {color:'red'}
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
			headerGroup:[{
				fromIndex:2, toIndex:3, title:"전주전산번호", id :"hCode"
			},{
				fromIndex:5, toIndex:12, title:"현장조사표", id :"nmInfo"
			},{
				fromIndex:13, toIndex:20, title:"요금내역서", id :"npInfo"
			},{
				fromIndex:21, toIndex:24, title:"GIS조수", id :"gisInfo"
			}],
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "kepboCd", align:"center",
				title : "<spring:message code='label.koreaElectricPowerCorporationBranchOfficeCode'/>",
				width: "100px"							
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
				key : "kepafBizrDivCd", align:"center",
				title : "<spring:message code='label.businessMan'/>",
				width: "100px"
			}, {
				key : "fldTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payTotal", align:"right",
				title : "총조수",
				width: "100px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode1", align:"right",
				title : "1",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode2", align:"right",
				title : "2",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode3", align:"right",
				title : "3",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode4", align:"right",
				title : "4",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode5", align:"right",
				title : "5",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode6", align:"right",
				title : "6",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "payCode7", align:"right",
				title : "7",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gisJosuT", align:"right",
				title : "T",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gisJosuN", align:"right",
				title : "N",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gisJosuB", align:"right",
				title : "B",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "gisJosuD", align:"right",
				title : "D",
				width: "90px",
				sorting: false,render : {type : "number"}
			}, {
				key : "fldBox", align:"center",
				title : "GIS함체설치유무",
				width: "200px"
			}, {
				key : "spclMtrCtt", align:"left",
				title : "에러여부",
				width: "120px"
			}]			
	}
	return options;
			
}(jQuery, Tango, _));
