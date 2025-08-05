/**
 * FeeCompareResultGrid.js
 * 요금대사 결과 DataGrid
 *
 * @author 정중식
 * @date 2016. 8. 09. 오후 3:50:00
 * @version 1.0
 */
var FeeCompareResultGrid = (function($, Tango, _){
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
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	        {key : 'check', selectorColumn : true, hidden : true},
			{key : 'ROWNUM', title : '순번' , width : '40px', rowindexColumn : true },
			{key : 'fcltsDivNm', title:'시설구분'             , width : '90px'},
			{key : 'objYm',title:'청구연월'            , width : '90px'},
			{key : 'leslNo',title:'회선번호'                 , width : '90px'},
			{key : 'hdofcOrgNm',title:'본부'             , width : '180px'},
			{key : 'trmsMtsoNm',title:'전송실'           , width : '180px'},
			{key : 'dnrSystmNm',title:'DONOR시스템'	        , width : '180px'},
			{key : 'rmteSystmNm',title:'REMOTE시스템'       , width : '180px'},
			{key : 'lesDistm', title:'거리'                       , width : '90px'},
			{key : 'coreCnt', title:'코아수'               , width : '90px'},
			{key : 'openDtm', title:'개통일'              , width : '90px'},
			{key : 'trmnDtm', title:'해지일'            , width : '90px'},
			{key : 'lesCommBizrNm', title:'사업자'    , width : '90px'},
			{key : 'basUprc', title:'기본단가'             , width : '90px', align : 'right'},
			{key : 'mthUtilChag', title:'월이용료'           , width : '90px', align : 'right'},
			{key : 'tlplChag', title:'전주료'             , width : '90px', align : 'right'},
			{key : 'etcCost', title:'기타'                   , width : '90px', align : 'right'},
			{key : 'feeSumrAmt', title:'요금계'                 , width : '90px', align : 'right'},
			{key : 'drtCalcAplyDayCnt', title:'일할계산적용일수' , width : '90px'},
			{key : 'drtCalcAmt', title:'일할계산액'       , width : '90px', align : 'right'},
			{key : 'tmthSumrAmt', title:'당월계'              , width : '90px', align : 'right'},
			{key : 'atrnfDiscAmt', title:'자동이체금액'        , width : '90px', align : 'right'},
			{key : 'splyAmt', title:'공급가액'           , width : '90px', align : 'right'},
			{key : 'rfndAmt', title:'환급'                     , width : '90px', align : 'right'},
			{key : 'nextConfFlag', title:'환급환불여부'     , width : '90px'},
			{key : 'nextConfReason', title:'환급환불내용'	  , width : '90px'},
			{key : 'etcRmk', title:'요금변경 사유'            , width : '180px'}
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
			sorting: true
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	                	{key : 'check', selectorColumn : true, hidden : true},
						{title : '순번', width : '40px', rowindexColumn : true},
						{key : 'fcltsDivNm', title:'시설구분'            , width : '90px'},
						{key : 'objYm',title:'청구연월'	          , width : '90px'},
						{key : 'leslNo',title:'회선번호'                , width : '90px'},
						{key : 'hdofcOrgNm',title:'본부'            , width : '180px'},
						{key : 'teamOrgNm',title:'팀'                    , width : '180px'},
						{key : 'trmsMtsoNm',title:'전송실'	         , width : '90px'},
						{key : 'afcpyNm',title:'제휴사'             , width : '180px'},
						{key : 'fnchNm',title:'가맹점'		     , width : '180px'},
						{key : 'lineAppltDtm', title:'청약일'             , width : '90px'},
						{key : 'openDtm', title:'개통일'             , width : '90px'},
						{key : 'trmnDtm', title:'해지일'	          , width : '90px'},
						{key : 'lesCommBizrNm', title:'사업자'	       , width : '90px'},
						{key : 'umtsoNm', title:'관할국(상위국)'         , width : '180px'},
						{key : 'lmtsoNm', title:'관할국(하위국)'         , width : '180px'},
						{key : 'stdLesDistm', title:'구분'                        , width : '90px'},
						{key : 'lesDistm', title:'거리'                      , width : '90px'},
						{key : 'basUprc', title:'기본단가'            , width : '90px', align : 'right'},
						{key : 'mthUtilChag', title:'월이용료'          , width : '90px', align : 'right'},
						{key : 'devCost', title:'장치비'               , width : '90px', align : 'right'},
						{key : 'etcCost', title:'기타'                  , width : '90px', align : 'right'},
						{key : 'feeSumrAmt', title:'요금계'                , width : '90px', align : 'right'},
						{key : 'drtCalcAplyDayCnt', title:'일할계산적용일수', width : '90px'},
						{key : 'drtCalcAmt', title:'일할계산액'		    , width : '90px', align : 'right'},
						{key : 'tmthSumrAmt', title:'당월계'	            , width : '90px', align : 'right'},
						{key : 'atrnfDiscAmt', title:'자동이체할인액'	    , width : '90px', align : 'right'},
						{key : 'splyVat', title:'부가세'                     , width : '90px', align : 'right'},
						{key : 'dmdAmt', title:'청구금액'		          , width : '90px', align : 'right'},
						{key : 'splyAmt', title:'공급가액'          , width : '90px', align : 'right'},
						{key : 'rfndAmt', title:'환급금액'	               , width : '90px', align : 'right'},
						{key : 'nextConfFlag', title:'환급환불여부'    , width : '90px'},
						{key : 'nextConfReason', title:'환급환불내용'	 , width : '90px'},
						{key : 'etcRmk', title:'요금변경 사유'	          , width : '180px'}
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
			sorting: true
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	                	{key : 'check', selectorColumn : true, hidden : true},
						{title : '순번', width : '40px', rowindexColumn : true},
						{key : 'fcltsDivNm', title:'시설구분',  width : '90px'},
						{key : 'objYm',title:'청구연월',        width : '90px'},
						{key : 'leslNo',title:'회선번호',       width : '90px'},
						{key : 'hdofcOrgNm', title:'본부',   width : '180px'},
						{key : 'teamOrgNm', title:'팀' ,	 width : '180px'},
						{key : 'lesCommBizrNm', title:'사업자' ,	   width : '90px'},
						{key : 'umtsoNm', title:'상위국명' ,        width : '180px'},
						{key : 'lmtsoNm', title:'하위국명' ,        width : '180px'},
						{key : 'leslStatVal', title:'회선용량' ,       width : '90px'},
						{key : 'leslCapaCd', title:'회선상태' ,      width : '90px'},
						{key : 'openDtm', title:'개통일' ,	    width : '90px'},
						{key : 'trmnDtm', title:'해지일',     width : '90px'},
						{key : 'sktLineId', title:'SKT2 회선번호', width : '90px'},
						{key : 'custNm', title:'고객사',		  width : '90px'},
						{key : 'splyAmt', title:'공급가액'       ,width : '90px', align : 'right'},
						{key : 'rfndAmt1', title:'환급'                  ,width : '90px', align : 'right'},
						{key : 'nextConfFlag', title:'환급환불여부'  ,width : '90px'},
						{key : 'nextConfReason', title:'환급환불내용',width : '90px'},
						{key : 'etcRmk', title:'요금변경 사유'         ,width : '180px'}
	    ]			
	};
	
	//HFC Grid option
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
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	        {key : 'check', selectorColumn : true, hidden : true},
			{key : 'ROWNUM', title : '순번' , width : '40px', rowindexColumn : true },
			{key : 'fcltsDivNm', title:'시설구분'             , width : '90px'},
			{key : 'objYm',title:'청구연월'            , width : '90px'},
			{key : 'leslNo',title:'회선번호'                 , width : '90px'},
			{key : 'hdofcOrgNm',title:'본부'             , width : '180px'},
			{key : 'trmsMtsoNm',title:'전송실'           , width : '180px'},
			{key : 'dnrSystmNm',title:'DONOR시스템'	        , width : '180px'},
			{key : 'rmteSystmNm',title:'REMOTE시스템'       , width : '180px'},
			{key : 'lesDistm', title:'거리'                       , width : '90px'},
			{key : 'coreCnt', title:'코아수'               , width : '90px'},
			{key : 'openDtm', title:'개통일'              , width : '90px'},
			{key : 'trmnDtm', title:'해지일'            , width : '90px'},
			{key : 'lesCommBizrNm', title:'사업자'    , width : '90px'},
			{key : 'basUprc', title:'기본단가'             , width : '90px', align : 'right'},
			{key : 'mthUtilChag', title:'월이용료'           , width : '90px', align : 'right'},
			{key : 'tlplChag', title:'전주료'             , width : '90px', align : 'right'},
			{key : 'etcCost', title:'기타'                   , width : '90px', align : 'right'},
			{key : 'feeSumrAmt', title:'요금계'                 , width : '90px', align : 'right'},
			{key : 'drtCalcAplyDayCnt', title:'일할계산적용일수' , width : '90px'},
			{key : 'drtCalcAmt', title:'일할계산액'       , width : '90px', align : 'right'},
			{key : 'tmthSumrAmt', title:'당월계'              , width : '90px', align : 'right'},
			{key : 'atrnfDiscAmt', title:'자동이체금액'        , width : '90px', align : 'right'},
			{key : 'splyAmt', title:'공급가액'           , width : '90px', align : 'right'},
			{key : 'rfndAmt', title:'환급'                     , width : '90px', align : 'right'},
			{key : 'nextConfFlag', title:'환급환불여부'     , width : '90px'},
			{key : 'nextConfReason', title:'환급환불내용'	  , width : '90px'},
			{key : 'etcRmk', title:'요금변경 사유'            , width : '180px'}
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
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	                	{key : 'check', selectorColumn : true, hidden : true},
						{title : '순번', width : '40px', rowindexColumn : true},
						{key : 'fcltsDivNm', title:'시설구분'      , width : '90px'},
						{key : 'objYm', title:'청구연월'           , width : '90px'},
						{key : 'hdofcOrgNm',title:'본부'        , width : '180px'},
						{key : 'trmsMtsoNm',title:'전송실'       , width : '180px'},
						{key : 'bmtsoMtsoNm',title:'기지국'      , width : '180px'},
						{key : 'leslNo', title:'회선번호'          , width : '90px'},
						{key : 'openDtm', title:'개통일'          , width : '90px'},
						{key : 'trmnDtm', title:'해지일'          , width : '90px'},
						{key : 'lesCommBizrNm', title:'사업자' , width : '90px'},
						{key : 'stdLesDistm', title:'구분'   , width : '90px'},
						{key : 'lesDistm', title:'거리'          , width : '90px'},
						{key : 'leslCapaCd', title:'회선용량'      , width : '90px'},
						{key : 'basUprc', title:'기본단가'         , width : '90px', align : 'right'},
						{key : 'mthUtilChag', title:'월이용료'     , width : '90px', align : 'right'},
						{key : 'devCost', title:'장치비'          , width : '90px', align : 'right'},
						{key : 'etcCost', title:'기타'           , width : '90px', align : 'right'},
						{key : 'feeSumrAmt', title:'요금계'       , width : '90px', align : 'right'},
						{key : 'drtCalcAplyDayCnt', title:'일할계산적용일수' , width : '90px'},
						{key : 'drtCalcAmt', title:'일할계산액'     , width : '90px', align : 'right'},
						{key : 'rfndAmt', title:'환급'           , width : '90px', align : 'right'},
						{key : 'tmthSumrAmt',title:'당월계'               , width : '90px', align : 'right'},
						{key : 'atrnfDiscAmt', title:'자동이체할인액'      , width : '90px', align : 'right'},
						{key : 'splyAmt', title:'공급가액'	          , width : '90px', align : 'right'},
						{key : 'nextConfFlag', title:'환급환불여부'     , width : '90px'},
						{key : 'nextConfReason', title:'환급환불내용'	  , width : '90px'},
						{key : 'etcRmk', title:'요금변경 사유'            , width : '180px'}
	    ]			
	};
	
	return options;
}(jQuery, Tango, _));
