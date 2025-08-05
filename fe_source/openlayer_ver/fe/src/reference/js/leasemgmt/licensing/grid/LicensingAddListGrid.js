/**
 * LicensingAddListGrid.js
 * 인허가 신청 조회 DataGrid정의
 *
 * @author 정현석
 * @date 2016. 9. 26. 오후 13:29:00
 * @version 1.0
 */
//인허가 신청 조회 LicensingList.jsp
var LicensingListGrid = (function($, Tango, _){
	var options = {};
	
	//SKB 인허가 신청현황
	options.defineDataGridFtlcnBasSkbInfo = {
		defaultColumnMapping:{
			sorting: false
		},message: {
			nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i><spring:message code='message.noInquiryData'/></div>",
			filterNodata : 'No data'
		},
		
		columnMapping: [{
			key : 'lcenMgmtNo', align:'center',
			title : '인허가 관리번호',
			width: '80px'
		}, {
			key : 'mgmtHdofcCd', align:'center',
			title : '관리본부',
			width: '80px'
		}, {
			key : 'mgmtTeam', align:'center',
			title : '관리팀',
			width: '80px'
		}, {
			key : 'sidoNm', align:'center',
			title : '시도',
			width: '80px'
		}, {
			key : 'sggNm', align:'center',
			title : '구군',
			width: '80px'							
		}, {
			key : 'emdNm', align:'center',
			title : '읍면동',
			width: '80px'							
		}, {
			key : 'lcenDtlAddr', align:'center',
			title : '상세주소',
			width: '150px'
		}, {
			key : 'lcenRqsProcStatCdNm', align:'center',
			title : '처리상태',
			width: '80px'
		},{key : 'lcenRqsMgmtNo', hidden : true}]
	}
	
	//SKT 인허가 현황관리
	options.defineDataGridFtlcnBasSktInfo = {
		defaultColumnMapping:{
			sorting: false
		},message: {
			nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i><spring:message code='message.noInquiryData'/></div>",
			filterNodata : 'No data'
		},
		
		columnMapping: [{
			key : 'lcenMgmtNo', align:'center',
			title : '인허가 관리번호',
			width: '80px'
		}, {
			key : 'mgmtHdofcCd', align:'center',
			title : '관리본부',
			width: '80px'
		}, {
			key : 'mgmtTeam', align:'center',
			title : '관리팀',
			width: '80px'
		}, {
			key : 'sidoNm', align:'center',
			title : '시도',
			width: '80px'
		}, {
			key : 'sggNm', align:'center',
			title : '구군',
			width: '80px'							
		}, {
			key : 'emdNm', align:'center',
			title : '읍면동',
			width: '80px'							
		}, {
			key : 'lcenDtlAddr', align:'center',
			title : '상세주소',
			width: '150px'
		}, {
			key : 'lcenRqsProcStatCdNm', align:'center',
			title : '처리상태',
			width: '80px'
		},
		{key : 'lcenRqsMgmtNo', hidden : true}],
		paging:{
			pagerSelect:false
		}
	}
	

	return options;
	
}(jQuery, Tango, _));
