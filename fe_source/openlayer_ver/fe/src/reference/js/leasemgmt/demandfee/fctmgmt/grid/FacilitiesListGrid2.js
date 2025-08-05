/**
 * FacilitiesListGrid.js
 * 설비목록 DataGrid정의 sample
 *
 * @author 김윤진
 * @date 2016. 8. 09. 오후 3:50:00
 * @version 1.0
 */
var FacilitiesGrid = (function($, Tango, _){
	var options = {};
	
	//광중계기광코아 Grid option
	options.defineOptDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: true
		},
		columnMapping: [
	        {key : 'check', selectorColumn : true, hidden : true},
	        {title : '순번', width : '40px', rowindexColumn : true},
	        {key : 'col2', title : '시설구분', width : '90px'},
	        {key : 'col3', title : 'ERP번호', width : '90px'},
	        {key : 'col4', title : '본부', width : '90px'},
	        {key : 'col5', title : '팀', width : '90px'},
	        {key : 'col6', title : '전송실', width : '90px'},
	        {key : 'col7', title : '회선번호', width : '90px'},
	        {key : 'col8', title : '기지국', width : '90px'},
	        {key : 'col9', title : 'DONOR시스템', width : '90px'},
	        {key : 'col10', title : 'REMOTE시스템', width : '90px'},
	        {key : 'col11', title : '회선상태', width : '90px'},
	        {key : 'col12', title : '과금거리', width : '90px'},
	        {key : 'col13', title : 'OTDR거리', width : '90px'},
	        {key : 'col14', title : '도상거리', width : '90px'},
	        {key : 'col15', title : '코아수', width : '90px'},
	        {key : 'col16', title : '청약일', width : '90px'},
	        {key : 'col17', title : '개통일', width : '90px'},
	        {key : 'col18', title : '해지일', width : '90px'},
	        {key : 'col19', title : '변경일', width : '90px'},
	        {key : 'col20', title : '사업자', width : '90px'},
	        {key : 'col21', title : '과금여부', width : '90px'},
	        {key : 'col22', title : '상위국주소', width : '90px'},
	        {key : 'col23', title : '상위국시구군', width : '90px'},
	        {key : 'col24', title : '상위국면동리', width : '90px'},
	        {key : 'col25', title : '하위국주소', width : '90px'},
	        {key : 'col26', title : '하위국시구군', width : '90px'},
	        {key : 'col27', title : '하위국면동리', width : '90px'},
	        {key : 'col28', title : '최종수정일', width : '90px'},
	        {key : 'col29', title : '입력자', width : '90px'}
	    ]	
	};
	
	//기지국회선 Grid
	options.defineBtsDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: true
		},
		columnMapping: [
	        {key : 'check', selectorColumn : true, hidden : true},
	        {title : '순번', width : '40px', rowindexColumn : true},
	        {key : 'col2', title : '시설구분', width : '90px'},
	        {key : 'col3', title : '본부', width : '90px'},
	        {key : 'col4', title : '팀', width : '90px'},
	        {key : 'col5', title : '전송실', width : '90px'},
	        {key : 'col6', title : '사업구분', width : '90px'},
	        {key : 'col7', title : '기지국', width : '90px'},
	        {key : 'col8', title : '회선명', width : '90px'},
	        {key : 'col9', title : '회선상태', width : '90px'},
	        {key : 'col10', title : '회선번호', width : '90px'},
	        {key : 'col11', title : '청약일', width : '90px'},
	        {key : 'col12', title : '개통일', width : '90px'},
	        {key : 'col13', title : '해지일', width : '90px'},
	        {key : 'col14', title : '변경일', width : '90px'},
	        {key : 'col15', title : '사업자', width : '90px'},
	        {key : 'col16', title : '지역중심국', width : '90px'},
	        {key : 'col17', title : '지역중심국수용여부', width : '90px'},
	        {key : 'col18', title : '구분', width : '90px'},
	        {key : 'col19', title : '거리', width : '90px'},
	        {key : 'col20', title : '회선용량', width : '90px'},
	        {key : 'col21', title : '과금여부', width : '90px'},
	        {key : 'col22', title : '하위국소재지', width : '90px'},
	        {key : 'col23', title : '시군구', width : '90px'},
	        {key : 'col24', title : '면동리', width : '90px'},
	        {key : 'col25', title : '상위국명', width : '90px'},
	        {key : 'col26', title : '하위국명', width : '90px'},
	        {key : 'col27', title : '최종수정일', width : '90px'},
	        {key : 'col28', title : '입력자', width : '90px'},
	        {key : 'col29', title : 'DS1', width : '90px'}
	    ]			
	};
	
	//통신설비 Grid
	options.defineRentDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,	
		rowSingleSelect : true,
		singleSelectorColumnWithRadio  : true,	
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: true
		},
		columnMapping: [
	        {key : 'check', selectorColumn : true, hidden : true},
	        {title : '순번', width : '40px', rowindexColumn : true},
	        {key : 'eqptClass', title : '시설구분', width : '90px'},
	        {key : 'lesCommBizrId', title : '사업자(대)', width : '90px'},
	        {key : 'systmMgmtBizrNm', title : '사업자(소)', width : '90px'},
	        {key : 'lesUsgCtt', title : '용도', width : '90px'},
	        {key : 'hdofcOrgNm', title : '본부', width : '90px'},
	        {key : 'teamOrgNm', title : '팀', width : '90px'},
	        {key : 'trmsMtsoNm', title : '전송실', width : '90px'},
	        {key : 'leslNo', title : '회선번호', width : '90px'},
	        {key : 'dnrSystmNm', title : '상위국', width : '90px'},
	        {key : 'rmteSystmNm', title : '하위국', width : '90px'},
	        {key : 'lineState', title : '회선상태', width : '90px'},
	        {key : 'lesDistm', title : '과금거리', width : '90px'},
	        {key : 'coreCnt', title : '수량', width : '90px'},
	        {key : 'agmtUprc', title : '단위', width : '90px'},
	        {key : 'leslAppltDtm', title : '청약일', width : '90px'},
	        {key : 'leslOpenDtm', title : '개통일', width : '90px'},
	        {key : 'leslTrmnDtm', title : '해지일', width : '90px'},
	        {key : 'lastChgDate', title : '변경일', width : '90px'},
	        {key : 'basUprc', title : '기본단가', width : '90px'},
	        {key : 'janUseAmt', title : '1월', width : '90px'},
	        {key : 'febUseAmt', title : '2월', width : '90px'},
	        {key : 'mayUseAmt', title : '3월', width : '90px'},
	        {key : 'aprUseAmt', title : '4월', width : '90px'},
	        {key : 'marUseAmt', title : '5월', width : '90px'},
	        {key : 'junUseAmt', title : '6월', width : '90px'},
	        {key : 'julUseAmt', title : '7월', width : '90px'},
	        {key : 'augUseAmt', title : '8월', width : '90px'},
	        {key : 'septUseAmt', title : '9월', width : '90px'},
	        {key : 'octUseAmt', title : '10월', width : '90px'},
	        {key : 'novUseAmt', title : '11월', width : '90px'},
	        {key : 'decUseAmt', title : '12월', width : '90px'},
	        {key : 'mthUtilChag', title : '월이용료', width : '90px'},
	        {key : 'tlplFeeAmt', title : '전주이용료', width : '90px'},
	        {key : 'etcCost', title : '기타', width : '90px'},
	        {key : 'tmthSumrAmt', title : '월 청구금액', width : '90px'},
	        {key : 'byyrTotAmt', title : '년 청구금액', width : '90px'},
	        {key : 'umtsoAddr', title : '소재지(상위국)', width : '90px'},
	        {key : 'lmtsoAddr', title : '소재지(하위국)', width : '90px'},
	        {key : 'mthPerdVal', title : '납부주기', width : '90px'},
	        {key : 'selMthDivVal', title : '납부월', width : '90px'},
	        {key : 'lesKndCd', hidden : true},
	        {key : 'lastChgUserId', hidden : true},
	        {key : 'frstRegUserId', hidden : true},	                
	        {key : 'etcRmk', title : '비고', width : '90px'}
	    ]			
	};
	
	//Wi-Fi Grid
	options.defineWifiDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: true
		},	
		columnMapping: [
	        {key : 'check', selectorColumn : true, hidden : true},
			{title : '순번', width : '40px', rowindexColumn : true},
			{key : 'fcltsDivCd', title : '시설구분', width : '90px'},
			{key : 'hdofcOrgNm', title : '본부', width : '90px'},
			{key : 'teamOrgNm', title : '팀', width : '90px'},
			{key : 'trmsMtsoId', title : '전송실', width : '90px'},
			{key : 'wifiLineDivVal', title : '구분', width : '90px'},
			{key : 'bizDivCd', title : '사업구분', width : '90px'},
			{key : 'wifiAfcpyNm', title : '제휴', width : '90px'},
			{key : 'wifiFnchNm', title : '가맹', width : '90px'},
			{key : 'leslStatCd', title : '회선상태', width : '90px'},
			{key : 'leslNo', title : '회선번호', width : '90px'},
			{key : 'leslAppltDtm', title : '청약일', width : '90px'},
			{key : 'leslOpenDtm', title : '개통일', width : '90px'},
			{key : 'leslTrmnDtm', title : '해지일', width : '90px'},
			{key : 'lastChgDate', title : '변경일', width : '90px'},
			{key : 'lesCommBizrId', title : '사업자', width : '90px'},
			{key : 'areaCmtsoNm', title : '지역중심국', width : '90px'},
			{key : 'umtsoNm', title : '상위국명', width : '90px'},
			{key : 'lmtsoNm', title : '하위국명', width : '90px'},
			{key : 'stdLesDistRmk', title : '구분', width : '90px'},
			{key : 'lesDistRmk', title : '거리', width : '90px'},
			{key : 'leslCapaDivVal', title : '회선용량', width : '90px'},
			{key : 'wifiApQuty', title : 'AP수량', width : '90px'},
			{key : 'lmtsoAddr', title : '하위국소재지', width : '90px'},
			{key : 'lmtsoGuAddr', title : '시군구', width : '90px'},
			{key : 'lmtsoDongAddr', title : '면동리', width : '90px'},
	        {key : 'lesKndCd', hidden : true},
	        {key : 'lastChgUserId', hidden : true},
	        {key : 'frstRegUserId', hidden : true},					
			{key : 'wifiTermlEqpNm', title : '종단장비', width : '90px'},
			{key : 'wifiEtcRmk', title : '비고', width : '90px'}
		]			
	};
	
	//B2B Grid
	options.defineB2bDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : false,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: true
		},
		excelWorker: {
			importOption: {
				titleToKeyMapping: {
					'시설구분': 'fcltsDivCd',
					'본부명': 'hdofcOrgNm'
				}
			}
		},	
		columnMapping: [
	        {key : 'check', width : '30px', selectorColumn : true, hidden : true},
	        {title : '순번', width : '40px', rowindexColumn : true},
	        {key : 'fcltsDivCd', title : '시설구분', width : '100px'},
	        {key : 'hdofcOrgNm', title : '본부', width : '100px'},
	        {key : 'teamOrgNm', title : '팀', width : '100px'},
	        {key : 'uprMtsoId', title : '전송실', width : '100px'},
	        {key : 'lesCommBizrId', title : '사업자', width : '100px'},
	        {key : 'leslNo', title : '회선번호', width : '100px'},
	        {key : 'umtsoNm', title : '상위국명', width : '100px'},
	        {key : 'lmtsoNm', title : '하위국명', width : '100px'},
	        {key : 'umtsoAddr', title : '상위국소재지', width : '100px'},
	        {key : 'lmtsoAddr', title : '하위국소재지', width : '100px'},
	        {key : 'leslCapaVal', title : '회선용량', width : '100px'},
	        {key : 'leslStatCd', title : '회선상태', width : '100px'},
	        {key : 'leslOpenDtm', title : '개통일', width : '100px'},
	        {key : 'leslTrmnDtm', title : '해지일', width : '100px'},
	        {key : 'b2bSkt2LineId', title : 'SKT2 회선번호', width : '100px'},
	        {key : 'b2bCustNm', title : '고객사', width : '100px'},
	        {key : 'lesKndCd', hidden : true},
	        {key : 'lastChgUserId', hidden : true},          
	        {key : 'frstRegDate', title : '등록일자', width : '100px'},
	        {key : 'frstRegUserId', title : '등록ID', width : '100px'}
	    ]			
	};
	
	//HFC중계기 Grid
	options.defineHfcDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: true
		},
		columnMapping: [
            {key : 'check', selectorColumn : true, hidden : true},
            {title : '순번', width : '40px', rowindexColumn : true},
            {key : 'fcltsDivCd', title : '시설구분', width : '90px'},
            {key : 'hdofcOrgNm', title : '본부', width : '90px'},
            {key : 'teamOrgNm', title : '팀', width : '90px'},
            {key : 'trmsMtsoNm', title : '전송실', width : '90px'},
            {key : 'leslNo', title : '회선번호', width : '90px'},
            {key : 'dnrSystmNm', title : 'DONOR시스템', width : '90px'},
            {key : 'rmteSystmNm', title : 'REMOTE시스템', width : '90px'},
            {key : 'lesDistm', title : '과금거리', width : '90px'},
            {key : 'coreCnt', title : '코아수', width : '90px'},
            {key : 'leslAppltDtm', title : '청약일', width : '90px'},
            {key : 'leslOpenDtm', title : '개통일', width : '90px'},
            {key : 'leslTrmnDtm', title : '해지일', width : '90px'},
            {key : 'lastChgDate', title : '변경일', width : '90px'},
            {key : 'lesCommBizrId', title : '사업자', width : '90px'},
            {key : 'chrYn', title : '과금여부', width : '90px'},
            {key : 'umtsoAddr', title : '상위국주소', width : '90px'},
            {key : 'umtsoAddr', title : '상위국시구군', width : '90px'},
            {key : 'umtsoAddr', title : '상위국면동리', width : '90px'},
            {key : 'lmtsoAddr', title : '하위국주소', width : '90px'},
            {key : 'lmtsoAddr', title : '하위국시구군', width : '90px'},
            {key : 'lmtsoAddr', title : '하위국면동리', width : '90px'},
            {key : 'lesKndCd', hidden : true},	                
            {key : 'lastChgUserId', hidden : true},
            {key : 'frstRegDate', title : '최종수정일', width : '90px'},
            {key : 'frstRegUserId', title : '입력자', width : '90px'}
        ]			
	};
	
	
	return options;
}(jQuery, Tango, _));
