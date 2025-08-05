/**
 * LeaseBudgetResultGrid.js
 * 임차예산실적 DataGrid정의
 *
 * @author 양춘길
 * @date 2016. 9. 19. 오전 10:00:00
 * @version 1.0
 */
//임차예산현황 LeaseBudgetCurrentState.jsp
var leaseBudgetCurrentState = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseBudgetCurrentState = {
	defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		grouping : {
			by : ['teamOrgNm'],
			useGrouping : true,
			useGroupRowspan : true
		},
		columnMapping: [
		    {key : 'teamOrgNm', 			align:'center', 	title : '본부', 		width: '120px', rowspan : true}, 
		    {key : 'erpBdgtNm', 			align:'center', 	title : '예산코드',	width: '120px'}, 
		    {key : 'januaryBdgtAmt', 		align:'center', 	title : '1월', 		width: '60px', 		align: 'right'}, 
		    {key : 'februaryBdgtAmt', 		align:'center', 	title : '2월', 		width: '60px', 		align: 'right'}, 
		    {key : 'marchBdgtAmt', 		align:'center', 	title : '3월',		width: '60px', 		align: 'right'}, 
		    {key : 'aprilBdgtAmt', 			align:'center', 	title : '4월', 		width: '60px', 		align: 'right'}, 
		    {key : 'mayBdgtAmt', 			align:'center', 	title : '5월', 		width: '60px', 		align: 'right'}, 
		    {key : 'juneBdgtAmt', 			align:'center', 	title : '6월', 		width: '60px', 		align: 'right'}, 
		    {key : 'julyBdgtAmt', 			align:'center', 	title : '7월',		width: '60px', 		align: 'right'}, 
		    {key : 'augustBdgtAmt', 		align:'center', 	title : '8월',		width: '60px', 		align: 'right'}, 
		    {key : 'septemberBdgtAmt', 	align:'center', 	title : '9월', 		width: '60px', 		align: 'right'}, 
		    {key : 'octoberBdgtAmt', 		align:'center',	title : '10월', 		width: '60px', 		align: 'right'}, 
		    {key : 'novemberBdgtAmt', 	align:'center', 	title : '11월', 		width: '60px', 		align: 'right'}, 
		    {key : 'decemberBdgtAmt', 	align:'center', 	title : '12월', 		width: '60px', 		align: 'right'}, 
		    {key : 'totalBdgtAmt', 			align:'center',	title : '계', 		width: '60px', 		align: 'right'}
		],		
		paging:{
			pagerSelect:false
		}
	}			
	
	return options;
		
}(jQuery, Tango, _));


//임차실적현황 LeaseResultCurrentState.jsp
var leaseResultCurrentState = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseResultCurrentState = {
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		grouping : {
			by : ['teamOrgNm','pcofNm'],
			useGrouping : true,
			useGroupRowspan : true
		},
		columnMapping: [
	        {key : 'teamOrgNm', 			align:'center',	title : '본부',		width: '120px',		rowspan : true}, 
	        {key : 'pcofNm', 				align:'center',	title : '제공사',	width: '120px',		rowspan : true}, 
	        {key : 'glAcntgNm', 				align:'center',	title : '실적계정',	width: '120px'}, 
	        {key : 'januaryResltAmt', 		align:'center',	title : '1월',		width: '60px', 		align: 'right'}, 
	        {key : 'februaryResltAmt', 		align:'center',	title : '2월',		width: '60px', 		align: 'right'}, 
	        {key : 'marchResltAmt', 		align:'center',	title : '3월',		width: '60px', 		align: 'right'}, 
	        {key : 'aprilResltAmt', 			align:'center',	title : '4월',		width: '60px', 		align: 'right'}, 
	        {key : 'mayResltAmt', 			align:'center',	title : '5월',		width: '60px', 		align: 'right'}, 
	        {key : 'juneResltAmt', 			align:'center',	title : '6월',		width: '60px', 		align: 'right'}, 
	        {key : 'julyResltAmt', 			align:'center',	title : '7월',		width: '60px', 		align: 'right'}, 
	        {key : 'augustResltAmt', 		align:'center',	title : '8월',		width: '60px', 		align: 'right'}, 
	        {key : 'septemberResltAmt', 	align:'center',	title : '9월',		width: '60px', 		align: 'right'}, 
	        {key : 'octoberResltAmt', 		align:'center',	title : '10월',		width: '60px', 		align: 'right'}, 
	        {key : 'novemberResltAmt', 	align:'center',	title : '11월',		width: '60px', 		align: 'right'}, 
	        {key : 'decemberResltAmt', 	align:'center',	title : '12월',		width: '60px', 		align: 'right'}, 
	        {key : 'totalResltAmt', 			align:'center',	title : '계',			width: '60px', 		align: 'right'}
	    ],	
		paging:{
			pagerSelect:false
		}
	}
	
	return options;
		
}(jQuery, Tango, _));


//임차실적현황 LeaseResultCurrentState.jsp
var leaseBudgetResultCurrentState = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseBudgetResultCurrentState = {
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		headerGroup:[{fromIndex:4, toIndex:16, title:'실적금액'}],
		grouping : {
			by : ['teamOrgNm','pcofNm','glAcntgNm'],
			useGrouping : true,
			useGroupRowspan : true
		},
		columnMapping: [
	        {key : 'teamOrgNm', 			align:'center',	title : '본부',		width: '120px',	rowspan : true}, 
	        {key : 'pcofNm', 				align:'center',	title : '제공사',	width: '120px',	rowspan : true}, 
	        {key : 'glAcntgNm', 				align:'center',	title : '실적계정',	width: '120px',	rowspan : true}, 
	        {key : 'resultDiv', 				align:'center',	title : '구분',		width: '80px'}, 
	        {key : 'januaryResltAmt', 		align:'center',	title : '1월',		width: '60px', 		align: 'right'}, 
	        {key : 'februaryResltAmt', 		align:'center',	title : '2월',		width: '60px', 		align: 'right'}, 
	        {key : 'marchResltAmt', 		align:'center',	title : '3월',		width: '60px', 		align: 'right'}, 
	        {key : 'aprilResltAmt', 			align:'center',	title : '4월',		width: '60px', 		align: 'right'}, 
	        {key : 'mayResltAmt', 			align:'center',	title : '5월',		width: '60px', 		align: 'right'}, 
	        {key : 'juneResltAmt', 			align:'center',	title : '6월',		width: '60px', 		align: 'right'}, 
	        {key : 'julyResltAmt', 			align:'center',	title : '7월',		width: '60px', 		align: 'right'}, 
	        {key : 'augustResltAmt', 		align:'center',	title : '8월',		width: '60px', 		align: 'right'}, 
	        {key : 'septemberResltAmt', 	align:'center',	title : '9월',		width: '60px', 		align: 'right'}, 
	        {key : 'octoberResltAmt', 		align:'center',	title : '10월',		width: '60px', 		align: 'right'}, 
	        {key : 'novemberResltAmt', 	align:'center',	title : '11월',		width: '60px', 		align: 'right'}, 
	        {key : 'decemberResltAmt', 	align:'center',	title : '12월',		width: '60px', 		align: 'right'}, 
	        {key : 'totalResltAmt', 			align:'center',	title : '누적금액',	width: '60px', 		align: 'right'}
	    ],	
		paging:{
			pagerSelect:false
		}	
	}
	
	return options;
		
}(jQuery, Tango, _));


//임차실적현황 LeaseResultCurrentState.jsp
var leaseBudgetResultGapCurrentState = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseBudgetResultGapCurrentState = {
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		grouping : {
			by : ['teamOrgNm','pcofNm'],
			useGrouping : true,
			useGroupRowspan : true
		},
		columnMapping: [
		    {key : 'teamOrgNm', 	align:'center',	title : '본부',				width: '120px',		rowspan : true}, 
		    {key : 'pcofNm', 		align:'center',	title : '제공사',			width: '120px',		rowspan : true}, 
		    {key : 'glAcntgNm', 		align:'center',	title : '실적계정',			width: '120px'}, 
		    {key : 'slipNo', 			align:'center',	title : '전표번호',			width: '120px'}, 
		    {key : 'resltAmt', 		align:'center',	title : '전표금액(A)',		width: '120px', 		align: 'right'}, 
		    {key : 'dmdAmt', 		align:'center',	title : '청구금액(B)',		width: '120px', 		align: 'right'}, 
		    {key : 'mgmtLeslAmd', 	align:'center',	title : '관리회선요금(C)',	width: '120px', 		align: 'right'}, 
		    {key : 'resltAmtGap', 	align:'center',	title : '차이(A-B)',			width: '120px', 		align: 'right'}, 
		    {key : 'dmdAmtGap', 	align:'center',	title : '차이(B-C)',		width: '120px', 		align: 'right'}
		],	
		paging:{
			pagerSelect:false
		}	
	}
	
	return options;
		
}(jQuery, Tango, _));
