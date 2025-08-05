/**
 * /resources/js/leasemgmt/kepco/legcurstmgmt/LegCurstMgmtGrid.js
 * 양성화 현황 관리 조회 DataGrid정의
 *
 * @author 정현석
 * @date 2016. 10. 19. 오후 13:40:00
 * @version 1.0
 */
//양성화 현황 조회 LegCurstMgmtList.jsp
var LegCurstMgmtGrid = (function($, Tango, _){
	var options = {};

	options.defineDataGridLegCurstMgmt = {
		defaultColumnMapping:{
			sorting: false
		},message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		
		columnMapping: [{
			key : 'legMgmtNo', align:'center',
			title : '양성화관리번호',
			width: '80px'
		}, {
			key : 'mgmtOrgNm', align:'center',
			title : '관리본부',
			width: '100px'
		},{
			key : 'bpNm', align:'center',
			title : '시공업체',
			width: '80px'
		}, {
			key : 'kephdNm', align:'center',
			title : '한전본부',
			width: '100px'
		}, {
			key : 'kepboNm', align:'center',
			title : '한전지사',
			width: '100px'
		}, {
			key : 'legSctnNm', align:'center',
			title : '양성화구간명',
			width: '80px'							
		}, {
			key : 'legCnt', align:'right',
			title : '양성화본수',
			width: '60px'							
		}, {
			key : 'atflNm', align:'center',
			title : '첨부파일',
			width: '150px'
		}, {
			key : 'frstRegDate', align:'center',
			title : '입력일자',
			width: '80px'
		}, {
			key : 'frstRegUserId', align:'center',
			title : '입력자',
			width: '80px'
		}, {
			key : 'lastChgDate', align:'center',
			title : '수정일자',
			width: '80px'
		}, {
			key : 'lastChgUserId', align:'center',
			title : '수정자',
			width: '80px'
		}],
		paging:{
			pagerSelect:false
		}	
	}
	return options;
	
}(jQuery, Tango, _));