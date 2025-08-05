/**
 * LicensingCurstSumGrid.js
 * 인허가 현황 집계 조회 DataGrid정의
 *
 * @author 정현석
 * @date 2016. 9. 28. 오후 13:40:00
 * @version 1.0
 */
//인허가 현황집계 조회 LicensingCurstSumList.jsp


//인허가 현황집계
var LicensingCurstSumGrid = (function($, Tango, _){
	var options = {};

	options.defineDataGridLicensingCurstSum = {
		defaultColumnMapping:{
			sorting: false
		},
		
		columnMapping: [{
			key : 'lcenMgmtNo', align:'center',
			title : '관리번호',
			width: '80px'
		}, {
			key : 'mgmtHdofcCd', align:'center',
			title : '관리본부',
			width: '120px'
		}, {
			key : 'mgmtTeam', align:'center',
			title : '관리팀',
			width: '80px'
		}, {
			key : 'lcenFcltSrno', align:'center',
			title : '시설물순번',
			width: '80px'
		}, {
			key : 'staLcenDsrctNm', align:'center',
			title : '시작구간',
			width: '80px'							
		}, {
			key : 'endLcenDsrctNm', align:'center',
			title : '종단구간',
			width: '80px'							
		}, {
			key : 'lcenDocNo', align:'center',
			title : '허가번호',
			width: '150px'
		}, {
			key : 'lcenDt', align:'center',
			title : '허가일자',
			width: '80px'
		}, {
			key : 'lcenInstnNm', align:'center',
			title : '허가기관명',
			width: '170px'
		}, {
			key : 'lcenFcltKndNm', align:'center',
			title : '시설물종류',
			width: '80px'
		}, {
			key : 'fcltStrdCdVal', align:'center',
			title : '시설물규격',
			width: '80px'
		}, {
			key : 'fcltQuty', align:'right',
			title : '시설물수량',
			width: '80px'
		}, {
			key : 'cstrCd', align:'center',
			title : '공사번호',
			width: '120px'
		}, {
			key : 'cstrNm', align:'center',
			title : '공사명',
			width: '150px'
		}, {
			key : 'ftlcnAddr', align:'center',
			title : '상세주소',
			width: '150px'
		}],
		paging:{
			pagerSelect:false
		}	
	}
	

	return options;
	
}(jQuery, Tango, _));