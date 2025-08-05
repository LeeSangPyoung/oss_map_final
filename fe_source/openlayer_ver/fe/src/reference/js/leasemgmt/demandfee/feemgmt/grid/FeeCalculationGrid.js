/**
 * FeeCalculationGrid.js
 * 요금계산 DataGrid (청구요금과 유사함)
 *
 * @author 정중식
 * @date 2016. 8. 30. 오후 3:50:00
 * @version 1.0
 */
    
var FeeCalculationGrid = (function($, Tango, _){
	var options = {};
	
	//통신설비 Grid
	options.defineRentDataGrid = {
			filteringHeader: false,//필터 로우 visible
			hideSortingHandle : true,//Sorting 표시 visible
			rowClickSelect : true,
			rowSingleSelect : true,
			rowSingleSelectAllowUnselect : true,
			autoColumnIndex : true,
			rowindexColumnFromZero : false,
			defaultColumnMapping:{
				align : 'center',
				sorting: false
			},
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
			columnMapping: [
			                /*{key : 'rnum', title: '순번', width: '40px', rowindexColumn: true},*/
			                {key : 'lesKndCd', hidden : true},
			                {key : 'tblNm', hidden : true},
			                {key: 'objYm', title: '대상년월'},
			                {key : 'fcltsDivNm', title : '시설구분', width : '90px'},
			                {key : 'lesCommBizrNm', title : '사업자(대)', width : '90px'},
			                {key : 'systmMgmtBizrNm', title : '사업자(소)', width : '90px'},
			                {key : 'lesUsgCtt', title : '용도', width : '90px'},
			                {key : 'hdofcOrgNm', title : '본부', width : '180px'},
			                {key : 'teamOrgNm', title : '팀', width : '180px'},
			                {key : 'trmsMtsoNm', title : '전송실', width : '180px'},
			                {key : 'leslNo', title : '회선번호', width : '90px'},
			                {key : 'dnrSystmNm', title : '상위국', width : '180px'},
			                {key : 'rmteSystmNm', title : '하위국', width : '180px'},
			                {key : 'leslStatNm', title : '회선상태', width : '90px'},
			                {key : 'lesDistm', title : '과금거리', width : '90px'},
			                {key : 'coreCnt', title : '수량', width : '90px'},
			                {key : 'leslAppltDtm', title : '청약일', width : '90px'},
			                {key : 'leslOpenDtm', title : '개통일', width : '90px'},
			                {key : 'TrmnDtm', title : '해지일', width : '90px'},
			                {key : 'lastChgDate', title : '변경일', width : '90px'},
			                {key : 'basUprc', title : '기본단가', width : '90px', align : 'right'},
			                {key : 'stdMthUtilChag', title : '월이용료', width : '90px', align : 'right'},
			                {key : 'tlplChag', title : '전주이용료', width : '90px', align : 'right'},
			                {key : 'etcCost', title : '기타', width : '90px', align : 'right'},
			                {key : 'tmthSumrAmt', title : '월 청구금액', width : '90px', align : 'right'},
			                {key : 'byyrTotAmt', title : '년 청구금액', width : '90px', align : 'right'},
			                {key : 'umtsoAddr', title : '소재지(상위국)', width : '200px'},
			                {key : 'lmtsoAddr', title : '소재지(하위국)', width : '200px'},
			                {key : 'mthPerdVal', title : '납부주기', width : '90px'},
			                {key : 'selMthDivVal', title : '납부월', width : '90px'},
			                {key : 'etcRmk', title : '비고', width : '90px'}
			                ]
	};
	
	
	//WiFi Grid
	options.defineWiFiDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	                	{key : 'check', selectorColumn : true, hidden : true},
						/*{title : '순번', width : '40px', rowindexColumn : true},*/
						{key : 'tblNm', hidden : true},
						{key: 'objYm', title: '대상년월'},
						{key: 'fcltsDivNm', title:'시설구분'},
						{key: 'hdofcOrgNm',title:'본부', width : '180px'},
						{key: 'teamOrgNm',title:'팀', width : '180px'},
						{key: 'trmsMtsoNm',title:'전송실', width : '180px'},
						{key: 'srvcClVal',title:'사업구분'},
						{key: 'afcpyNm',title:'제휴사', width : '180px'},
						{key: 'fnchNm',title:'가맹점명', width : '180px'},
						{key: 'leslStatNm',title:'회선상태'},
						{key: 'leslNo',title:'회선번호'},
						{key: 'wifiLineDivNm', title:'회선구분'},
						{key: 'leslAppltDtm', title:'청약일'},
						{key: 'leslOpenDtm', title:'개통일'},
						{key: 'leslTrmnDtm', title:'해지일'},
						{key: 'lastChgDate', title:'변경일'},
						{key: 'lesCommBizrNm', title:'사업자'},
						{key: 'lesCommBizrId', hidden : true},
						{key: 'areaCmtsoNm', title:'지역중심국명'},
						{key: 'umtsoNm', title:'관할국(상위국)', width : '180px'},
						{key: 'lmtsoNm', title:'관할국(하위국)', width : '180px'},
						{key: 'lineSctnTypNm', title:'구분'},
						{key: 'lesDistm', title:'거리'},
						{key: 'apQuty', title:'AP수량'},
						{key: 'basUprc', title:'기본단가', align : 'right'},
						{key: 'mthUtilChag', title:'월이용료', align : 'right'},
						{key: 'devCost', title:'장치비', align : 'right'},
						{key: 'etcCost', title:'기타', align : 'right'},
						{key: 'feeSumrAmt', title:'요금계', align : 'right'},
						{key: 'drtCalcAplyDayCnt', title:'일할계산적용일수'},
						{key: 'drtCalcAmt', title:'일할계산액', align : 'right'},
						{key: 'rfndAmt', title:'환급금액', align : 'right'},	
						{key: 'tmthSumrAmt', title:'당월계', align : 'right'},
						{key: 'atrnfYn', title:'자동이체여부', align:"center"},
						{key: 'atrnfDiscAmt', title:'자동이체할인액', align : 'right'},
						{key: 'splyAmt', title:'공급가액', align : 'right'},
						{key: 'splyVat', title:'부가세', align : 'right'},
						{key: 'dmdAmt', title:'청구금액', align : 'right'},	
						{key: 'leslCapaCd', title:'회선종류'},
						{key: 'lmtsoAddr', title:'하위국소재지', width : '180px'},	
						//{key: 'lmtsoGuAddr', title:'시구군', width : '180px'},
						//{key: 'lmtsoDongAddr', title:'면동리', width : '180px'},
						{key: 'etcRmk', title:'비고'},
						{key: 'termlEqpNm', title:'종단장치'},
						{key: 'frstRegDate', title:'등록일자'},
						{key: 'frstRegUserId', title:'등록자ID'}
	    ]			
	};
	
	//B2B Grid
	options.defineB2BDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	                	{key : 'check', selectorColumn : true, hidden : true},
						/*{title : '순번', width : '40px', rowindexColumn : true},*/
						{key : 'tblNm', hidden : true},
						{key: 'objYm', title: '대상년월'},
						{key: 'hdofcOrgNm',title:'본부명', width : '180px'},
						{key: 'teamOrgNm',title:'팀명', width : '180px'},
						{key: 'lesCommBizrNm', title:'제공사업자'},
						{key: 'leslNo',title:'회선번호'},				
						{key: 'umtsoNm', title:'상위국명', width : '180px'},
						{key: 'lmtsoNm', title:'하위국명', width : '180px'},
						{key: 'umtsoAddr', title:'상위국주소', width : '200px'},
						{key: 'lmtsoAddr', title:'하위국주소', width : '200px'},
						{key: 'leslCapaCd', title:'회선종류'},
						{key: 'leslStatNm',title:'회선상태'},
						{key: 'leslTrmnDtm', title:'과금개시일'},				                           
						{key: 'leslTrmnDtm', title:'해지일'},
						{key: 'splyAmt', title:'공급가액', align : 'right'},
						{key: 'Skt2leslNo', title:'SKT2 회선번호', width:120},
						{key: 'custNm', title:'고객명', width:120},
						{key: 'frstRegDate', title:'등록일자'},
						{key: 'frstRegUserId', title:'등록자ID'}						
						]			
	};
	
	//Opt&HFC Grid option
	options.defineOptHfcDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	        {key : 'check', selectorColumn : true, hidden : true},
			/*{key : 'ROWNUM', title : '순번' , width : '40px', rowindexColumn : true },*/
	        {key: 'objYm', title: '대상년월'},
            {key: 'lesKndCd', hidden : true},
            {key : 'tblNm', hidden : true},
            {key: 'fcltsDivNm', title: '시설구분'},
            {key: 'hdofcOrgNm', title: '본부명', width : '180px'},
            {key: 'teamOrgNm', title: '팀명', width : '180px'},
            {key: 'trmsMtsoNm', title: '전송실명', width : '180px'},
            {key: 'leslNo', title: '회선번호'},
            {key: 'dnrSystmNm', title: 'DONOR시스템명', width : '180px'},
            {key: 'rmteSystmNm', title: 'REMOTE시스템명', width : '180px'},
            {key: 'leslStatNm', title: '회선상태'},
            {key: 'lesDistm', title: '거리', align : 'right'},
            {key: 'coreCnt', title: '코아수', align : 'right'},
            {key: 'leslAppltDtm', title: '청약일'},
            {key: 'leslOpenDtm', title: '개통일'},
            {key: 'leslTrmnDtm', title: '해지일'},
            {key: 'lastChgDate', title: '변경일'},
            {key: 'agmtUprc', title: '기본단가', align : 'right'},
            {key: 'mthUtilChag', title: '월이용료', align : 'right'},
            {key: 'tlplChag', title: '전주료', align : 'right'},
            {key: 'etcCost', title: '기타', align : 'right'},
            {key: 'feeSumrAmt', title: '요금계', align : 'right'},
            {key: 'drtCalcAplyDayCnt', title: '일할계산적용일'},
            {key: 'drtCalcAmt', title: '일할계산액', align : 'right'},
            {key: 'rfndAmt1', title: '환급', align : 'right'},
            {key: 'tmthSumrAmt', title: '당월계', align : 'right'},
            {key: 'atrnfYn', title: '자동이체여부', align:"center"},
            {key: 'atrnfDiscAmt', title: '자동이체금액', align : 'right'},
            {key: 'splyAmt', title: '공급가액', align : 'right'},
            {key: 'splyVat', title: '부가세', align : 'right'},
            {key: 'feeTotSumrAmt', title: '청구금액', align : 'right'},
			{key: 'lesCommBizrNm', title:'제공사업자명'},
			{key: 'lesCommBizrId', hidden : true},
            {key: 'minUseDayCnt', title: '최소사용기간'},
            {key: 'minUseExprnDtm', title: '최소사용만료일'},
            {key: 'trmnPsblYn', title: '해지가능여부'},
            {key: 'umtsoAddr', title: '상위국주소', width : '200px'},
            //{key: 'umtsoGuAddr', title: '상위국시구군', width : '180px'},
            //{key: 'umtsoDongAddr', title: '상위국면동리', width : '180px'},
            {key: 'lmtsoAddr', title: '하위국주소', width : '200px'},
            //{key: 'lmtsoGuAddr', title: '하위국시구군', width : '180px'},
            //{key: 'lmtsoDongAddr', title: '하위국면동리', width : '180px'},
            {key: 'etcRmk', title: '비고'},
            {key: 'frstRegDate', title: '등록일자', width: '140px'},
            {key: 'frstRegUserId', title: '등록자ID', width: '110px'}
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
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	                	{key : 'check', selectorColumn : true, hidden : true},
						/*{title : '순번', width : '40px', rowindexColumn : true},*/
	                	{key : 'objYm', title:'대상년월', width : '90px'},
						{key : 'tblNm', hidden : true},
		                {key : 'fcltsDivNm', title : '시설구분', width : '90px'},
		                {key : 'hdofcOrgNm', title : '본부명', width : '180px'},
		                {key : 'teamOrgNm', title : '팀명', width : '180px'},
		                {key : 'trmsMtsoNm', title : '전송실명', width : '180px'},
		                {key : 'srvcClVal', title : '사업구분', width : '90px'},
						{key: 'formDivVal', title:'형태', width : '100px'},						 
						//{key : 'erpNo', title:'ERP번호', width : '100px'},					 
						{key : 'bmtsoMtsoNm', title:'기지국명', width : '180px'},					 
		                {key : 'leslNm', title : '회선명', width : '90px'},
		                {key : 'leslStatNm', title : '회선상태', width : '90px'},
		                {key : 'leslNo', title : '회선번호', width : '90px'},
		                {key : 'leslAppltDtm', title : '청약일', width : '90px'},
		                {key : 'leslOpenDtm', title : '개통일', width : '90px'},
		                {key : 'leslTrmnDtm', title : '해지일', width : '90px'},
		                {key : 'lastChgDate', title : '변경일', width : '90px'},
		                {key : 'lesCommBizrNm', title : '제공사업자', width : '90px'},
		                {key : 'areaCmtsoNm', title : '지역중심국', width : '180px'},
		                {key : 'areaCmtsoAcptYn', title:'지역중심국수용여부'},
						{key : 'selfNetObjYn', title:'자체망대상여부'},
						{key : 'selfNetCnstDtm', title:'구축시기'},
						{key : 'selfNetAcptYn', title:'자체망수용여부'},
						{key : 'umtsoNm', title : '상위국명', width : '100px'},
						{key : 'lmtsoNm', title : '하위국명', width : '100px'},
		                {key : 'lineSctnTypNm', title : '구분', width : '90px'},
		                {key : 'lesDistm', title : '거리', width : '90px'},
						{key : 'agmtUprc', title:'기본단가'         , width : '90px', align : 'right'},
						{key : 'mthUtilChag', title:'월이용료'     , width : '90px', align : 'right'},
						{key : 'devCost', title:'장치비'          , width : '90px', align : 'right'},
						{key : 'etcCost', title:'기타'           , width : '90px', align : 'right'},
						{key : 'feeSumrAmt', title:'요금계'       , width : '90px', align : 'right'},
						{key : 'drtCalcAplyDayCnt', title:'일할계산적용일수' , width : '90px'},
						{key : 'drtCalcAmt', title:'일할계산액'     , width : '90px', align : 'right'},
						{key : 'rfndAmt1', title:'환급'           , width : '90px', align : 'right'},
						{key : 'tmthSumrAmt',title:'당월계'               , width : '90px', align : 'right'},
						{key : 'atrnfYn', title:'자동이체여부'        , width : '90px'},
						{key : 'atrnfDiscAmt', title:'자동이체할인액'      , width : '90px', align : 'right'},
						{key : 'splyAmt', title:'공급가액'	          , width : '90px', align : 'right'},
						{key : 'splyVat', title:'부가세'                     , width : '90px', align : 'right'},
						{key : 'feeTotSumrAmt', title:'청구금액'		          , width : '90px', align : 'right'},
						{key : 'leslCapaCd', title:'회선종류'},				
						{key : 'minUseDayCnt', title:'최소사용적용기간'},
						{key : 'minUseExprnDtm', title:'최소사용만료일'},
						{key : 'trmnPsblYn', title:'해지가능'},
			            {key : 'lmtsoAddr', title : '하위국소재지', width : '200px'},
			            //{key : 'lmtsoGuAddr', title : '시구군', width : '90px', width : '180px'},
			            //{key : 'lmtsoDongAddr', title : '면동리', width : '90px', width : '180px'},
						{key : 'etcRmk', title:'비고', width : '90px'},
			            {key : 'frstRegDate', title : '등록일자', width : '100px'},
			            {key : 'frstRegUserId', title : '등록자ID', width : '100px'}
	    ]			
	};
	
	return options;
}(jQuery, Tango, _));
