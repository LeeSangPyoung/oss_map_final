/**
 * ErpSlipGrid.js
 * ERP전표
 *
 * @author 양춘길
 * @date 2016. 9. 29. 오전 10:00:00
 * @version 1.0
 */
//Erp전표발행 현황 ErpSlipIssueCurrentStateList.jsp
var erpSlipIssueCurrentStateList = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridErpSlipIssueCurrentStateList = {
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'dmdYm', 					align:'center',	title : '청구년월',			width: '60px',		rowspan : true}, 
		    {key : 'hdofcOrgNm', 			align:'center',	title : '본부',				width: '100px',	rowspan : true,	hidden : true}, 
		    {key : 'hdofcOrgId', 			align:'center',	title : '본부',				width: '100px',	rowspan : true,	hidden : true}, 
		    {key : 'teamOrgNm', 			align:'center',	title : '본부',				width: '100px',	rowspan : true}, 
		    {key : 'teamOrgId', 				align:'center',	title : '본부',				width: '100px',	rowspan : true,	hidden : true}, 
		    {key : 'lesCommBizrNm', 		align:'center',	title : '제공사',			width: '100px'}, 
		    {key : 'lesCommBizrId', 		align:'center',	title : '제공사',			width: '100px',	hidden : true}, 
		    {key : 'vndrBzno', 				align:'center',	title : '사업자번호',		width: '100px'}, 
		    {key : 'glAcntgNm', 				align:'center',	title : '실적계정',			width: '100px'}, 
		    {key : 'glAcntgCd', 				align:'center',	title : '실적계정',			width: '100px',	hidden : true}, 
		    {key : 'totalDmdAmt', 			align:'right',		title : '청구금액',			width: '100px', 	align: 'right'}, 
		    {key : 'slipReqAmt', 			align:'right',		title : '전표금액',			width: '100px', 	align: 'right'}, 
		    {key : 'lesDmdProcStatNm', 	align:'center',	title : '임차청구처리상태',	width: '100px'}, 
		    {key : 'lesDmdProcStatCd', 	align:'center',	title : '임차청구처리상태',	width: '100px',	hidden : true}, 
		    {key : 'frstRegDate', 			align:'center',	title : '최초등록일',			width: '100px'}, 
		    {key : 'frstRegUserNm', 		align:'center',	title : '최초등록자',			width: '100px'}, 
		    {key : 'frstRegUserId', 			align:'center',	title : '최초등록자',			width: '100px',	hidden : true},  
		    {key : 'lastChgDate', 			align:'center',	title : '최종수정일',			width: '100px'}, 
		    {key : 'lastChgUserId', 			align:'center',	title : '최종수정자',			width: '100px',	hidden : true}, 
		    {key : 'lastChgUserNm', 		align:'center',	title : '최종수정자',			width: '100px'}
	    ],		
		paging:{
			pagerSelect:false
		}
	}			
	
	return options;
			
}(jQuery, Tango, _));

/**
 * ErpSlipGrid.js
 * ERP전표
 *
 * @author 양춘길
 * @date 2016. 9. 29. 오전 10:00:00
 * @version 1.0
 */
//Erp전표발행 현황 ErpSlipIssueCurrentStateList.jsp
var leaseLine = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseLine = {
		defaultColumnMapping:{
			sorting: false
		},
		height : 300,
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'leslNo', 		align:'center',	title : '임차회선번호',		width: '120px',	rowspan : true}, 
		    {key : 'leslNm', 		align:'center',	title : '임차회선명',			width: '100px',	rowspan : true}, 
		    {key : 'lesKndNm', 	align:'center',	title : '임차종류',			width: '100px'}, 
		    {key : 'openDtm', 	align:'center',	title : '개통일자',			width: '100px'}, 
		    {key : 'splyVat', 		align:'right',		title : '공급부가가치세',	width: '100px'}, 
		    {key : 'splyAmt', 	align:'right',		title : '공급요금',			width: '100px'}, 
		    {key : 'dmdAmt', 	align:'right',		title : '청구요금',			width: '100px'}
	    ],		
		paging:{
			pagerSelect:false
		}
	}			
	
	return options;
		
}(jQuery, Tango, _));
