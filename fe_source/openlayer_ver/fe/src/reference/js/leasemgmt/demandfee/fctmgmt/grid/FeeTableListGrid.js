/**
 * FeeTableListGrid.js
 * 요금테이블 DataGrid정의
 *
 * @author 정중식
 * @date 2016. 11. 01. 오후 3:50:00
 * @version 1.0
 */
	var FeeTableGrid = (function($, Tango, _){
		
		var options = {}; 
		
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
					sorting: false
				},
	            rowOption:{
	                inlineStyle: function(data,rowOption){
	                    if(data['errFlag'] == "Y"){
	                        return {color:'red'}
	                    }
	                }
	            },
				columnMapping: [{key : 'check', selectorColumn : true, hidden : true},
				                {title : '순번', width : '40px', rowindexColumn : true},
				                {key : 'lesCommBizrNm', title : '제공사업자', width : '100px'},
				                {key : 'uprcAplyDt', title : '적용일',  width : '100px'},
				                {key : 'lesKndCd', hidden : true},
				                {key : 'lesKndNm', title : '회선유형', width : '100px'},
				                {key : 'uprcLstNm', hidden : true},
				                {key : 'coreCnt', title : '코아수', align : 'right', width : '100px'},
				                {key : 'minLineCnt',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '최소회선수', align : 'right', width : '100px'},
				                {key : 'maxLineCnt',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '최대회선수', align : 'right', width : '100px'},
				                {key : 'agmtUprc',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '단가', align : 'right', width : '100px'},
				                {key : 'uprcDiscRate',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '할인율', align : 'right', width : '100px'},
				                {key : 'errFlag', hidden : true}
	                ],
    			paging:{
    				pagerSelect:true
    			}
		};
		
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
	            rowOption:{
	                inlineStyle: function(data,rowOption){
	                    if(data['errFlag'] == "Y"){
	                        return {color:'red'}
	                    }
	                }
	            },
				columnMapping: [{key : 'check', selectorColumn : true, hidden : true},
				                {title : '순번', width : '40px', rowindexColumn : true},
				                {key : 'lesCommBizrNm', title : '제공사업자', width : '100px'},
				                {key : 'uprcAplyDt', title : '적용일', width : '100px'},
				                {key : 'lesKndCd', hidden : true},
				                {key : 'uprcLstNm', hidden : true},
				                {key : 'lesKndNm', title : '회선유형', width : '100px'},
				                {key : 'leslCapaNm', title : '회선용량', width : '100px'},
				                {key : 'lesDistFeeDivNm', title : '구분', width : '100px'},
				                {key : 'leslDistCdVal', title : '거리', width : '100px'},
				                {key : 'leslDistCd', hidden : true},
				                {key : 'ntfcnUprc',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '고시단가', align : 'right', width : '100px'},
				                {key : 'agmtUprc',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '약정단가', align : 'right', width : '100px'},
				                {key : 'uprcDiscRate',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '할인율', align : 'right', width : '100px'},
					            {key : 'errFlag', hidden : true}
            	],		
    			paging:{
    				pagerSelect:true
    			}	
		};
		
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
					sorting: false
				},	
	            rowOption:{
	                inlineStyle: function(data,rowOption){
	                    if(data['errFlag'] == "Y"){
	                        return {color:'red'}
	                    }
	                }
	            },
				columnMapping: [{key : 'check', selectorColumn : true, hidden : true},
								{title : '순번', width : '40px', rowindexColumn : true},
								{key : 'lesCommBizrNm', title : '제공사업자', width : '110px'},
								{key : 'lesKndCd', hidden : true},
								{key : 'uprcLstNm', hidden : true},
								{key : 'uprcAplyDt', title : '적용일', width : '110px'},
								{key : 'apQuty', title : 'AP 수', align : 'right',width : '110px'},
								{key : 'agmtUprc',
									render: {
										type: 'string',
										rule: 'comma'
									},
									title : '약정단가', align : 'right', width : '110px'},
								{key : 'lineDivNm',
									render: {
										type: 'string',
										rule: 'comma'
									},
									title : '구분',   width : '110px'},
				                {key : 'fstUprcDiscRate',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '2년경과 할인율', align : 'right', width : '100px'},
				                {key : 'scndUprcDiscRate',
									render: {
										type: 'string',
										rule: 'comma'
									},
				                	title : '4년경과 할인율', align : 'right', width : '100px'},
				                {key : 'errFlag', hidden : true}
				],
    			paging:{
    				pagerSelect:true
    			}
		};

		return options;
		
	}(jQuery, Tango, _));

