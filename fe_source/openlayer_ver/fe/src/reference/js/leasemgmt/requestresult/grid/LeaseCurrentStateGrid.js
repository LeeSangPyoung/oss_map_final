/**
 * LeaseCurrentStateGrid.js
 * 임차현황 DataGrid정의
 *
 * @author 양춘길
 * @date 2016. 8. 24. 오전 10:00:00
 * @version 1.0
 */
//임차현황 LeaseCurrentStateList.jsp
var leaseCurrentState = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseCurrentState = {
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'lesKndNm', 			align:'center',	title : '임차종류',			width: '100px'}, 
		    {key : 'hdofcOrgNm', 		align:'center',	title : '본부',				width: '100px'}, 
		    {key : 'teamOrgNm', 		align:'center',	title : '팀',					width: '100px'}, 
		    {key : 'trmsMtsoNm', 		align:'center',	title : '전송실명',			width: '100px', hidden: true}, 
		    {key : 'leslNo', 				align:'center',	title : '임차회선번호',		width: '100px'}, 
		    {key : 'uprMtsoNm', 		align:'center',	title : '상위국사',			width: '100px'}, 
		    {key : 'lowMtsoNm', 		align:'center',	title : '하위국사',			width: '100px'}, 
		    {key : 'leslStatNm', 			align:'center',	title : '임차회선상태',		width: '100px'}, 
		    {key : 'leslCapaCd', 		align:'center',	title : '임차회선용량',		width: '100px'}, 
		    {key : 'lesCommBizrNm', 	align:'center',	title : '제공사',			width: '100px'}, 
		    {key : 'lesTypNm', 			align:'center',	title : '임차유형',			width: '80px'}, 
		    {key : 'cstrCd', 				align:'center',	title : '공사번호',			width: '160px'}, 
		    {key : 'engstNo', 			align:'center',	title : 'Eng.SheetNo',	width: '160px'}
	    ],		
		paging:{
			pagerSelect:false
		}
	}			
	
	return options;
			
}(jQuery, Tango, _));

//임차신청처리이력
var leaseRequestProcDts = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseRequestProcDts = {	
		height : 260,
		defaultColumnMapping:{
			sorting: true
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'lesRqsProcSrno', 	align:'right', 		title : '순번', 			width: '40px'}, 
			{key : 'skAfcoDivCd', 		align:'center',	title : '처리사',			width: '90px'}, 
			{key : 'regHdofcOrgNm', 	align:'center',	title : '본부',			width: '90px'}, 
			{key : 'regTeamOrgNm', 	align:'center', 	title : '팀',				width: '90px'}, 
			{key : 'lesProcCtt', 			align:'center',	title : '처리내용',		width: '150px'}, 
			{key : 'lesProcStatNm', 	align:'center',	title : '임차처리상태',	width: '150px'}, 
			{key : 'lesProcDtm', 		align:'center',	title : '처리일자',		width: '100px'}
		],		
		paging:{
			pagerSelect:false
		}	
	}			
	
	return options;
			
}(jQuery, Tango, _));

//임차신청현황
var leaseRequestProg = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseRequestProg = {	
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'lesReqHdofcOrgNm', 					align:'center',	title : '본부',	width: '180px'}, 
		    {key : 'lesReqTeamOrgNm', 					align:'center',	title : '팀',		width: '180px'}, 
		    {key : 'lesProgActualInspection', 				align:'center',	title : '실사요청',		width: '100px'}, 
		    {key : 'lesProgActualInspectionAccept', 	align:'center',	title : '실사접수',		width: '100px'}, 
		    {key : 'lesProgActualInspectionResult', 		align:'center',	title : '실사결과',		width: '100px'}, 
		    {key : 'lesProgActualInspectionReview',		align:'center',	title : '임차결정',		width: '100px'}, 
		    {key : 'lesProgLeaseRequest', 				align:'center',	title : '임차신청',		width: '100px'}, 
		    {key : 'lesProgLeaseResult', 					align:'center',	title : '임차준공',		width: '100px'}, 
		    {key : 'lesProgLeaseCompletion', 			align:'center',	title : '결과등록',		width: '100px'}, 
		    {key : 'lesProgLeaseCancellation', 			align:'center',	title : '임차해지',		width: '100px'}
	    ],		
		paging:{
			pagerSelect:false
		}
	}			
	
	return options;
			
}(jQuery, Tango, _));

//임차현황관리
var leaseCurrentStateMgmt = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseCurrentStateMgmt = {	
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'lesRqsNo', 				align:'right',		title : '임차일련번호',			width: '80px', hidden:true}, 
		    {key : 'lesRqsGrpNo', 			align:'right',		title : '임차그룹번호',			width: '80px', hidden:true}, 
		    {key : 'lesReqHdofcOrgNm', 	align:'center',	title : '본부',					width: '150px'}, 
		    {key : 'lesReqTeamOrgNm', 	align:'center',	title : '팀',						width: '120px'}, 
		    {key : 'lesReqCommBizrNm', 	align:'center',	title : '요청사',			width: '80px'}, 
		    {key : 'lesReqCommBizrId', 	align:'center',	title : '요청사',			width: '80px'}, 
		    {key : 'lesOfrCommBizrNm', 	align:'center',	title : '제공사',			width: '80px'}, 
		    {key : 'lesOfrCommBizrId', 	align:'center',	title : '제공사',			width: '80px'}, 
		    {key : 'lesKndNm', 				align:'center',	title : '임차종류',				width: '80px'}, 
		    {key : 'lesReqNm', 				align:'center',	title : '임차요청명',				width: '150px',	inlineStyle : {color:'blue'}}, 
		    {key : 'leslNo', 					align:'center',	title : '임차회선번호',			width: '150px'}, 
		    {key : 'svlnNo', 					align:'center',	title : '서비스번호',				width: '150px'}, 
		    {key : 'uprMtsoNm', 			align:'center',	title : '상위국사',				width: '100px'}, 
		    {key : 'umtsoDtlAddr', 			align:'center',	title : '상위주소',				width: '200px'}, 
		    {key : 'lowMtsoNm', 			align:'center',	title : '하위국사',				width: '100px'}, 
		    {key : 'lmtsoDtlAddr', 			align:'center',	title : '하위주소',				width: '200px'}, 
		    {key : 'lesProcStatNm', 		align:'center',	title : '임차신청상태',			width: '120px'}, 
		    {key : 'lesRqsDtm', 				align:'center',	title : '임차신청일',				width: '160px'}, 
		    {key : 'lesProcStatCd', 		align:'center',	title : '임차신청상태',			width: '90px'}, 
		    {key : 'aispRsltLesPsblYn', 		align:'center',	title : '실사결과임차가능여부',	width: '90px'}, 
		    {key : 'skAfcoDivCd', 			align:'right',		title : 'sk계열사구분코드',		width: '80px',		hidden: true}
		],
		paging:{
			pagerSelect:false
		}
	}			
	
	return options;
			
}(jQuery, Tango, _));

//임차신청일괄신청
var leaseBatchRequest = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseBatchRequest = {	
		defaultColumnMapping:{
			sorting: true
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},	
		columnMapping: [
		    {key : 'lesReqNm', 				align:'center',	title : '임차요청명',		width: '200px'}, 
			{key : 'lesKndCd', 				align:'center',	title : '임차종류코드',	width: '120px'}, 
			{key : 'lesReqHdofcOrgId', 	align:'center',	title : '요청본부조직코드',width: '120px'}, 
			{key : 'lesReqTeamOrgId', 	align:'center',	title : '요청팀조직코드',	width: '120px'}, 
			{key : 'lesReqCommBizrId', 	align:'center',	title : '요청사',			width: '120px'}, 
			{key : 'lesOfrCommBizrId', 	align:'center',	title : '제공사',		width: '120px'}, 
			{key : 'uprMtsoId', 				align:'center',	title : '상위국사',		width: '100px'}, 
			{key : 'umtsoDtlAddr', 			align:'center',	title : '상위주소',		width: '160px'}, 
			{key : 'lowMtsoId', 				align:'center',	title : '하위국사',		width: '100px'}, 
			{key : 'lmtsoDtlAddr', 			align:'center',	title : '하위주소',		width: '160px'}, 
			{key : 'openPrfrDt', 				align:'center',	title : '임차개시일',	width: '120px'}, 
			{key : 'lesPerdDivCd', 			align:'center',	title : '임차기간',		width: '80px'}, 
			{key : 'lesTypCd', 				align:'center',	title : '임차유형코드',	width: '80px'}, 
			{key : 'leslCapaCd', 			align:'center',	title : '임차회선용량',	width: '80px'}, 
			{key : 'exptUprc', 				align:'right',		title : '예상단가',		width: '80px'}, 
			{key : 'lesRqsQuty', 			align:'right',		title : '수량',			width: '80px'}, 
			{key : 'lesDistm', 				align:'right',		title : '임차거리(km)',	width: '80px'}, 
			{key : 'lesFeeAmt', 				align:'right',		title : '요금(원)',		width: '80px'}, 
			{key : 'useUsgDivCd', 			align:'center',	title : '사용용도구분',	width: '80px'}, 
			{key : 'lesAreaCd', 				align:'center',	title : '지역',			width: '80px'}, 
			{key : 'lesRqsCtt', 				align:'center',	title : '요청내용',		width: '160px'}, 
			{key : 'lesRqsRmk', 				align:'center',	title : '비고',			width: '160px'}, 
			{key : 'srvcTechmCd', 			align:'center',	title : '서비스기술방식',	width: '80px'}, 
			{key : 'cstrCd', 					align:'center',	title : '공사번호',		width: '120px'}, 
			{key : 'engstNo', 				align:'center',	title : 'Eng Sheet No',width: '120px'}, 
			{key : 'salesChrrNm', 			align:'center',	title : '영업담당자',	width: '120px'}, 
			{key : 'salesChrrTlno', 			align:'center',	title : '영업담당자연락처',width: '120px'}, 
		    {key : 'successYn', 				align:'center',	title : '성공여부',		width: '80px'}, 
		    {key : 'errorMessage', 			align:'center',	title : '에러메세지',	width: '200px'}
	    ],		
		paging:{
			pagerSelect:false
		}
	}
	
	return options;
			
}(jQuery, Tango, _));

//임차신청일괄신청
var leaseBatchRequestForm = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridLeaseBatchRequestForm = {	
		defaultColumnMapping:{
			sorting: true
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},	
		columnMapping: [
			{key : 'lesReqNm', 				align:'center',	title : '임차요청명',		width: '200px'}, 
			{key : 'lesKndCd', 				align:'center',	title : '임차종류코드',	width: '120px'},  
			{key : 'lesReqHdofcOrgId', 	align:'center',	title : '요청본부조직코드',width: '120px'}, 
			{key : 'lesReqTeamOrgId', 	align:'center',	title : '요청팀조직코드',	width: '120px'}, 
			{key : 'lesReqCommBizrId', 	align:'center',	title : '요청사Id',		width: '120px'}, 
			{key : 'lesOfrCommBizrId', 	align:'center',	title : '제공사Id',		width: '120px'}, 
			{key : 'uprMtsoId', 				align:'center',	title : '상위국사',		width: '100px'}, 
			{key : 'umtsoDtlAddr', 			align:'center',	title : '상위주소',		width: '160px'}, 
			{key : 'lowMtsoId', 				align:'center',	title : '하위국사',		width: '100px'}, 
			{key : 'lmtsoDtlAddr', 			align:'center',	title : '하위주소',		width: '160px'}, 
			{key : 'openPrfrDt', 				align:'center',	title : '임차개시일',	width: '120px'}, 
			{key : 'lesPerdDivCd', 			align:'center',	title : '임차기간',		width: '80px'}, 
			{key : 'lesTypCd', 				align:'center',	title : '임차유형코드',	width: '80px'}, 
			{key : 'leslCapaCd', 			align:'center',	title : '임차회선용량',	width: '80px'}, 
			{key : 'exptUprc', 				align:'right',		title : '예상단가',		width: '80px'}, 
			{key : 'lesRqsQuty', 			align:'right',		title : '수량',			width: '80px'}, 
			{key : 'lesDistm', 				align:'right',		title : '임차거리(km)',	width: '80px'}, 
			{key : 'lesFeeAmt', 				align:'right',		title : '요금(원)',		width: '80px'}, 
			{key : 'useUsgDivCd', 			align:'center',	title : '사용용도구분',	width: '80px'}, 
			{key : 'lesAreaCd', 				align:'center',	title : '지역',			width: '80px'}, 
			{key : 'lesRqsCtt', 				align:'center',	title : '요청내용',		width: '160px'}, 
			{key : 'lesRqsRmk', 				align:'center',	title : '비고',			width: '160px'}, 
			{key : 'srvcTechmCd', 			align:'center',	title : '서비스기술방식',	width: '80px'}, 
			{key : 'cstrCd', 					align:'center',	title : '공사번호',		width: '120px'}, 
			{key : 'engstNo', 				align:'center',	title : 'Eng Sheet No',width: '120px'}, 
			{key : 'salesChrrNm', 			align:'center',	title : '영업담당자',	width: '120px'}, 
			{key : 'salesChrrTlno', 			align:'center',	title : '영업담당자연락처',width: '120px'}
	    ],		
		paging:{
			pagerSelect:false
		}
	}
	
	return options;
			
}(jQuery, Tango, _));

//해지대상임차회선현황
var terminationLeaseLineCurrentState = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridTerminationLeaseLineCurrentState = {
	
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'appltNo', 			align:'right',		title : '청약번호',		width: '140px'}, 
		    {key : 'appltNm', 			align:'right',		title : '청약명',			width: '160px'}, 
		    {key : 'appltKndNm', 		align:'center',	title : '청약종류',		width: '120px'}, 
		    {key : 'appltAcepDtm', 	align:'center',	title : '청약접수일시',	width: '100px'}, 
		    {key : 'svlnNo', 				align:'center',	title : '서비스회선번호',	width: '120px'}, 
		    {key : 'svlnNm', 				align:'center',	title : '서비스회선명',	width: '140px'}, 
		    {key : 'svlnStatNm', 		align:'center',	title : '서비스회선상태',width: '100px'}, 
		    {key : 'hdofcOrgNm', 		align:'right',		title : '본부',		width: '120px'}, 
		    {key : 'teamOrgNm', 		align:'right',		title : '팀',		width: '120px'}, 
		    {key : 'leslNo', 				align:'center',	title : '임차회선번호',	width: '120px'}, 
		    {key : 'leslNm', 				align:'center',	title : '임차회선명',		width: '120px'}, 
		    {key : 'lesCommBizrNm', 	align:'center',	title : '제공사',		width: '80px'}, 
		    {key : 'leslStatNm', 			align:'center',	title : '임차회선상태',	width: '100px'}, 
		    {key : 'lesRqsNo', 			align:'center',	title : '임차요청번호',	width: '100px'}, 
		    {key : 'lesReqNm', 			align:'center',	title : '임차요청명',		width: '120px'}, 
		    {key : 'lesKndNm', 			align:'center',	title : '임차종류',		width: '80px'}, 
		    {key : 'lesProcStatNm', 	align:'center',	title : '임차처리상태',	width: '100px'}, 
		    {key : 'trmnSchdDt', 		align:'center',	title : '해지예정일자',	width: '100px'}, 
		    {key : 'trmnDtm', 			align:'center',	title : '해지일시',		width: '100px'}
		],
		paging:{
			pagerSelect:false
		}
	}
	
	return options;
		
}(jQuery, Tango, _));

//해지회선청구현황
var terminationLeaseLineDemandCurrentState = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridTerminationLeaseLineDemandCurrentState = {	
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		grouping : {
			by : ['dmdYm','hdofcOrgNm','teamOrgNm'],
			useGrouping : true,
			useGroupRowspan : true
		},
		columnMapping: [
		    {key : 'dmdYm', 				align:'center',	title : '청구년월',		width: '60px',		rowspan : true}, 
		    {key : 'hdofcOrgId', 		align:'center',	title : '본부',			width: '140px',	hidden: true}, 
		    {key : 'hdofcOrgNm', 		align:'center',	title : '본부',			width: '140px',	rowspan : true}, 
		    {key : 'teamOrgId', 			align:'center',	title : '본부',			width: '140px',	hidden: true}, 
		    {key : 'teamOrgNm', 		align:'center',	title : '팀',				width: '140px',	rowspan : true}, 
		    {key : 'lesCommBizrId', 	align:'center',	title : '제공사',			width: '140px',	hidden: true}, 
		    {key : 'lesCommBizrNm', 	align:'center',	title : '제공사',	width: '140px'}, 
		    {key : 'splyAmtSum', 		align:'right',		title : '공급총액',		width: '120px'}, 
		    {key : 'splyVatSum', 		align:'right',		title : '공급부가총액',	width: '120px'}, 
		    {key : 'dmdAmtSum', 		align:'right',		title : '청구총액',		width: '120px'}
		],
		paging:{
			pagerSelect:false
		}
	}
	
	return options;
			
}(jQuery, Tango, _));

//해지회선청구내역
var terminationLeaseLineDemand = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridTerminationLeaseLineDemand = {	
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'hdofcOrgNm', 		align:'center',	title : '본부',				width: '140px'}, 
		    {key : 'teamOrgNm', 		align:'center',	title : '팀',					width: '140px'}, 
		    {key : 'lesCommBizrNm', 	align:'center',	title : '제공사',		width: '140px'}, 
		    {key : 'leslNo', 				align:'center',	title : '회선번호',			width: '140px'}, 
		    {key : 'leslAppltDtm', 		align:'center',	title : '회선신청일자',		width: '140px'}, 
		    {key : 'leslOpenDtm', 		align:'center',	title : '회선개통일자',		width: '140px'}, 
		    {key : 'leslTrmnDtm', 		align:'center',	title : '회선해지일자',		width: '140px'}, 
		    {key : 'splyAmtSum', 		align:'right',		title : '공급금액',			width: '120px'}, 
		    {key : 'splyVatSum', 		align:'right',		title : '공급부가가치세',	width: '120px'}, 
		    {key : 'dmdAmtSum', 		align:'right',		title : '청구금액',			width: '120px'}
		],
		paging:{
			pagerSelect:false
		}
	}
	
	return options;
			
}(jQuery, Tango, _));

//해지회선청구내역
var overPaymentLeaseLine = (function($, Tango, _){
	var options = {};
	
	options.defineDataGridOverPaymentLeaseLine = {	
		defaultColumnMapping:{
			sorting: false
		},
		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},
		columnMapping: [
		    {key : 'hdofcOrgNm', 		align:'center',	title : '본부',				width: '140px'}, 
		    {key : 'teamOrgNm', 		align:'center',	title : '팀',					width: '140px'}, 
		    {key : 'lesCommBizrNm', 	align:'center',	title : '제공사',			width: '140px'}, 
		    {key : 'leslNo', 				align:'center',	title : '회선번호',			width: '140px'}, 
		    {key : 'leslAppltDtm', 		align:'center',	title : '회선신청일자',		width: '140px'}, 
		    {key : 'leslOpenDtm', 		align:'center',	title : '회선개통일자',		width: '140px'}, 
		    {key : 'leslTrmnDtm', 		align:'center',	title : '회선해지일자',		width: '140px'}, 
		    {key : 'splyAmtSum', 		align:'right',		title : '공급금액',			width: '120px'}, 
		    {key : 'splyVatSum', 		align:'right',		title : '공급부가가치세',	width: '120px'}, 
		    {key : 'dmdAmtSum', 		align:'right',		title : '청구금액',			width: '120px'}
		],
		paging:{
			pagerSelect:false
		}
	}
	
	return options;
			
}(jQuery, Tango, _));
