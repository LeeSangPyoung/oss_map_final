/**
 * KepcoGisCncntExcsCurstGrid.js
 * 조수초과현황 DataGrid정의
 *
 * @author 오현수  
 * @date 2016. 10. 27. 오전 10:00:00
 * @version 1.0
 */
//조수초과현황 KepcoGisCncntExcsCurstList.jsp
//1.조수초과현황
var GisCncntExcsCurstGrid = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridGisCncntExcsCurst = {
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
			columnMapping: [
		    {title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true},
			{
				key : "nwNm", align:"left",
				title : "관리본부",
				width: "100px"
			}, {
				key : "oprNm", align:"left",
				title : "관리팀",
				width: "140px"
			}, {
				key : "comNm", align:"left",
				title : "협력사",
				width: "160px"
			}, {
				key : "addr", align:"left",
				title : "법정동명",
				width: "180px"
			}, {
				key : "skMgno", align:"center",
				title : "SK관리번호",
				width: "120px"
			}, {
				key : "unqMgno", align:"left",
				title : "고유관리번호",
				width: "130px"
			}, {
				key : "coreMnt", align:"right",
				title : "코아수",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "compMt", align:"center",
				title : "준공일자",
				width: "90px"
			}, {
				key : "compLen", align:"right",
				title : "준공거리",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "gisLen", align:"right",
				title : "도상거리",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "ungrLocNm", align:"left",
				title : "케이블종류",
				width: "110px"
			}, {
				key : "cnstMgno", align:"center",
				title : "공사번호",
				width: "130px"
			}, {
				key : "cnstNm", align:"left",
				title : "공사명",
				width: "230px"
			}, {
				key : "workNo", align:"center",
				title : "작업지시번호",
				width: "130px"
			}, {
				key : "insDt", align:"center",
				title : "입력일자",
				width: "90px"
			}, {
				key : "areaSeq", align:"right",
				title : "기별순서",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "keIdxCd", align:"left",
				title : "도면번호",
				width: "90px"
			}, {
				key : "keDrwNo", align:"left",
				title : "전산번호",
				width: "90px"
			}, {
				key : "keMlNo", align:"left",
				title : "선로전주명",
				width: "130px"
			}, {
				key : "areaLen", align:"right",
				title : "구간거리",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "lyrNm", align:"left",
				title : "시설물종류",
				width: "140px"
			}, {
				key : "kepboNo", align:"center",
				title : "한전지점코드",
				width: "90px"
			}, {
				key : "josuT", align:"right",
				title : "조수-SKT",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "josuN", align:"right",
				title : "조수-SKN",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "josuB", align:"right",
				title : "조수-SKB",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "josuD", align:"right",
				title : "조수-두루넷",
				width: "90px",
				render : {type : "number"}
			}, {
				key : "overReasonNm", align:"left",
				title : "조수초과사유",
				width: "90px"
			}, {
				key : "etcOverReason", align:"left",
				title : "기타사유",
				width: "90px"
			}],
			paging: {
		      	pagerSelect: false,
		      	hidePageList: true
			}
		}			
	
	return options;
			
}(jQuery, Tango, _));

