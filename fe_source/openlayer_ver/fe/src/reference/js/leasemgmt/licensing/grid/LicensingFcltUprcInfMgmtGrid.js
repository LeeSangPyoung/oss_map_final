/**
 * LicensingFcltUprcInfMgmtGrid.js
 * 설비목록 DataGrid정의
 *
 * @author Jeong,JungSig
 * @date 2016. 8. 31. 오후 3:50:00
 * @version 1.0
 */

//시설물단가관리 LicensingFcltUprcInfMgmtGrid.jsp
var LicensingFcltUprcInfMgmtGrid = (function($, Tango, _){
	var options = {};

	options.defineFcltUprcInfMgmtDataGrid = {
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i><spring:message code='message.noInquiryData'/></div>",
			filterNodata : 'No data'
		},
		columnMapping: [{
			key : 'lcenUprcMgmtNo', align:'center',
			title : '관리번호',
			width: '100px'
		}, {
			key : 'aplyDt', align:'center',
			title : '단가적용일',
			width: '100px'
		}, {
			key : 'lcenFcltKndNm', align:'center',
			title : '시설물종류',
			width: '100px'							
		}, {
			key : 'fcltKndUnitDivCdNm', align:'center',
			title : '시설물종류단위',
			width: '100px'							
		}, {
			key : 'pvuseUnitDivCdNm', align:'center',
			title : '점용단위',
			width: '100px'
		}, {
			key : 'pvusePerdDivCdNm', align:'center',
			title : '점용기간',
			width: '100px'
		}, {
			key : 'locDivCdNm', align:'center',
			title : '소재지구분',
			width: '100px'
		}, {
			key : 'unitUprc', align:'right',
			title : '기준단가(원)',
			width: '80px'
		}, {		
			key : 'lcenUprcRmk', align:'center',
			title : '인허가단가비고',
			width: '100px'
		}],
		
		paging:{
			pagerSelect:false
		}
	}

	return options;
	
}(jQuery, Tango, _));