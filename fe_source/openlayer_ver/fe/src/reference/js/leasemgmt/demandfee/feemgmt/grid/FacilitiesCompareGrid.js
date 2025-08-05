/**
 * FacilitiesCompareGrid.js
 * 설비e대사 DataGrid
 *
 * @author 정중식
 * @date 2016. 8. 25. 오후 3:50:00
 * @version 1.0
 */
var FacilitiesCompareGrid = (function($, Tango, _){
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
		/*defaultColumnMapping:{
			align : 'center',
			inlineStyle : {
				background : function(value, data, mapping){
					if(data["pair"] == '1' ){
						return '#FFFFFF';  
					}else
						return '#E7E7F3';
				}
			},
			sorting: false
		},*/
		headerGroup: [
                          {fromIndex:4,  toIndex:5,  title:"DONOR명", id:"headGrpA"},
                          {fromIndex:6, toIndex:7, title:"REMOTE명", id:"headGrpB"},
                          {fromIndex:8, toIndex:9, title:"거리", id:"headGrpC"},
                          {fromIndex:10, toIndex:11, title:"코아수", id:"headGrpD"},
                          {fromIndex:12, toIndex:13, title:"개통일", id:"headGrpD1"},
                          {fromIndex:14, toIndex:15, title:"해지일", id:"headGrpD2"}
                       ],
		columnMapping: [
		                {key : 'check', selectorColumn : true, hidden : true},
//		    			{title : "<spring:message code='label.sequence'/>", width : "40px", numberingColumn : true },
		                {key : 'hdofcOrgNm'		  , title : '본부' , width : '180px'},
		    			{key : 'teamOrgNm'		, title : '팀' , width : '180px'},
		    			{key : 'leslNo'  , title : '회선번호'	, width : '90px'},
		    			{key : 'dnrSystmNm',		  
		    						title : 'SKT',//'DONOR명',
		    						inlineStyle : {
		    							background : function(value, data, mapping){
		    								if((data["dnrSystmNm"] == '' || data["dnrSystmNm"] == null) || (data["dnrSystmNm"] != data["dnrSystmNmC"])){
		    									return '#FFB2D9';  //red
		    								}
		    							}
		    						},
		    						width : '180px'},
						{key : 'dnrSystmNmC',		  
		    							title : '사업자',//'DONOR명',
		    							inlineStyle : {
		    								background : function(value, data, mapping){
		    									if((data["dnrSystmNmC"] == '' || data["dnrSystmNmC"] == null) || (data["dnrSystmNm"] != data["dnrSystmNmC"])){
		    										return '#FFB2D9';  //red
		    									}
		    								}
		    							},
		    							width : '180px'},
		    			{key : 'rmteSystmNm', title : 'SKT',//'REMOTE명'	,
		    							inlineStyle : {
		    								background : function(value, data, mapping){
		    									if((data["rmteSystmNm"] == '' || data["rmteSystmNm"] == null) || (data["rmteSystmNm"] != data["rmteSystmNmC"])){
		    										return '#FFB2D9';  //red
		    									}
		    								}
		    							},
		    							width : '180px'},
						{key : 'rmteSystmNmC', title : '사업자',//'REMOTE명'	,
		    								inlineStyle : {
		    									background : function(value, data, mapping){
		    										if((data["rmteSystmNmC"] == '' || data["rmteSystmNmC"] == null) || (data["rmteSystmNm"] != data["rmteSystmNmC"])){
		    											return '#FFB2D9';  //red
		    										}
		    									}
		    								},
		    								width : '180px'},
		    			{key : 'lesDistm',	title : 'SKT',//'거리' ,
		    								inlineStyle : {
		    									background : function(value, data, mapping){
		    										if((data["lesDistm"] == '' || data["lesDistm"] == null) || (data["lesDistm"] != data["lesDistmC"])){
		    											return '#FFB2D9';  //red
		    										}
		    									}
		    								},
		    								width : '90px'},
						{key : 'lesDistmC',	title : '사업자',//'거리' ,
		    									inlineStyle : {
		    										background : function(value, data, mapping){
		    											if((data["lesDistmC"] == '' || data["lesDistmC"] == null) || (data["lesDistm"] != data["lesDistmC"])){
		    												return '#FFB2D9';  //red
		    											}
		    										}
		    									},
		    									width : '90px'},
		    			{key : 'coreCnt', title : 'SKT',//'코아수',
		    									inlineStyle : {
		    										background : function(value, data, mapping){
		    											if((data["coreCnt"] == '' || data["coreCnt"] == null) || (data["coreCnt"] != data["coreCntC"])){
		    												return '#FFB2D9';  //red
		    											}
		    										}
		    									},
		    							  width : '90px'},
		    			{key : 'coreCntC', title : '사업자',//'코아수',
		    								  inlineStyle : {
		    									  background : function(value, data, mapping){
		    										  if((data["coreCntC"] == '' || data["coreCntC"] == null) || (data["coreCnt"] != data["coreCntC"])){
		    											  return '#FFB2D9';  //red
		    										  }
		    									  }
		    								  },
		    								  width : '90px'},
		    			{key : 'openDtm', title : 'SKT',//'개통일',
		    									inlineStyle : {
		    										background : function(value, data, mapping){
		    											if((data["openDtm"] == '' || data["openDtm"] == null) || (data["openDtm"] != data["openDtmC"])){
		    												return '#FFB2D9';  //red
		    											}
		    										}
		    									},
		    									 width : '90px'},
						{key : 'openDtmC', title : '사업자',//'개통일',
		    										inlineStyle : {
		    											background : function(value, data, mapping){
		    												if((data["openDtmC"] == '' || data["openDtmC"] == null) || (data["openDtm"] != data["openDtmC"])){
		    													return '#FFB2D9';  //red
		    												}
		    											}
		    										},
		    							  width : '90px'},
		    			{key : 'trmnDtm', title : 'SKT',//'해지일',
		    									inlineStyle : {
		    										background : function(value, data, mapping){
		    											if((data["trmnDtm"] != data["trmnDtmC"])){
		    												return '#FFB2D9';  //red
		    											}
		    										}
		    									},
		    							  width : '90px'},
					    {key : 'trmnDtmC', title : '사업자',//'해지일',
		    								  inlineStyle : {
		    									  background : function(value, data, mapping){
		    										  if((data["trmnDtm"] != data["trmnDtmC"])){
		    											  return '#FFB2D9';  //red
		    										  }
		    									  }
		    								  },
		    								  width : '90px'},
		    			{key : 'lesCommBizrNm'	, title : '사업자'	, width : '90px'},
		    	        {key : 'dnrSystmNm', hidden : true},
		    	        {key : 'rmteSystmNm', hidden : true}
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
			inlineStyle : {
				background : function(value, data, mapping){
					if(data["pair"] == '1' ){
						return '#FFFFFF';  
					}else
						return '#E7E7F3';
				}
			},
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		headerGroup: [
                          {fromIndex:5,  toIndex:6,  title:"개통일", id:"headGrpA"},
                          {fromIndex:7, toIndex:8, title:"해지일", id:"headGrpB"},
                          {fromIndex:11, toIndex:12, title:"거리", id:"headGrpC"}
                       ],
		columnMapping: [
							{key : 'check', selectorColumn : true, hidden : true},
		    				{key : 'hdofcOrgNm'		  , title : '본부' , width : '180px'},
		    				{key : 'teamOrgNm'		, title : '팀' , width : '180px'},
							{key : 'bmtsoMtsoNm', 	title : '기지국',	width : '180px'},
							{key : 'leslNo'  , title : '회선번호'	, width : '90px'},							
		    				{key : 'openDtm', title : 'SKT',
		    										inlineStyle : {
		    											background : function(value, data, mapping){
		    												if((data["openDtm"] == '' || data["openDtm"] == null) || (data["openDtm"] != data["openDtmC"])){
		    													return '#FFB2D9';  //red
		    												}
		    											}
		    										},
		    								  width : '90px'},
						    {key : 'openDtmC', title : '사업자',
		    									  inlineStyle : {
		    										  background : function(value, data, mapping){
		    											  if((data["openDtmC"] == '' || data["openDtmC"] == null) || (data["openDtm"] != data["openDtmC"])){
		    												  return '#FFB2D9';  //red
		    											  }
		    										  }
		    									  },
		    									  width : '90px'},
		    				{key : 'trmnDtm', title : 'SKT',
		    										inlineStyle : {
		    											background : function(value, data, mapping){
		    												if( (data["trmnDtm"] != data["trmnDtmC"])){
		    													return '#FFB2D9';  //red
		    												}
		    											}
		    										},
		    								  width : '90px'},
		    				{key : 'trmnDtmC', title : '사업자',
		    									  inlineStyle : {
		    										  background : function(value, data, mapping){
		    											  if( (data["trmnDtm"] != data["trmnDtmC"])){
		    												  return '#FFB2D9';  //red
		    											  }
		    										  }
		    									  },
		    									  width : '90px'},
		    				{key : 'lesCommBizrNm'	, title : '사업자'	, width : '90px'},
		    				//STD_LES_DISTM 기준임차거리M asis는 코드 임
							{key : 'stdLesDistm', 	 title : '구분', width : '90px'},
		    				{key : 'lesDistm',	title : 'SKT' ,
		    									inlineStyle : {
		    										background : function(value, data, mapping){
		    											if((data["lesDistm"] != data["lesDistmC"])){
		    												return '#FFB2D9';  //red
		    											}
		    										}
		    									},
		    									width : '90px'},
							{key : 'lesDistmC',	title : '사업자' ,
		    										inlineStyle : {
		    											background : function(value, data, mapping){
		    												if((data["lesDistm"] != data["lesDistmC"])){
		    													return '#FFB2D9';  //red
		    												}
		    											}
		    										},
		    										width : '90px'},
		    				//임차회선용량코드 미정의 LESL_CAPA_CD
							{key : 'leslCapaCd', title : '회선용량',	width : '90px'},
			    	        {key : 'dnrSystmNm', hidden : true},
			    	        {key : 'rmteSystmNm', hidden : true}
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
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		headerGroup: [
                          {fromIndex:4,  toIndex:5,  title:"제휴사", id:"headGrpA"},
                          {fromIndex:7, toIndex:8, title:"거리", id:"headGrpB"},
                          {fromIndex:9, toIndex:10, title:"개통일", id:"headGrpC"},
                          {fromIndex:11, toIndex:12, title:"해지일", id:"headGrpD"},
                       ],
		columnMapping: [
		                {key : 'check', selectorColumn : true, hidden : true},
		    			{key : 'hdofcOrgNm'		  , title : '본부' , width : '180px'},
		    			{key : 'teamOrgNm'		, title : '팀' , width : '180px'},
		    			{key : 'leslNo'  , title : '회선번호'	, width : '90px'},
		    			{key : 'AfcpyNm', title : 'SKT'	,
		    					inlineStyle : {
		    						background : function(value, data, mapping){
		    							if((data["AfcpyNm"] == '' || data["AfcpyNm"] == null) || (data["AfcpyNm"] != data["AfcpyNmC"])){
		    								return '#FFB2D9';  //red
		    							}
		    						}
		    					},
		    					width : '180px'},
    					{key : 'AfcpyNmC', title : '사업자'	,
		    						inlineStyle : {
		    							background : function(value, data, mapping){
		    								if((data["AfcpyNmC"] == '' || data["AfcpyNmC"] == null) || (data["AfcpyNm"] != data["AfcpyNmC"])){
		    									return '#FFB2D9';  //red
		    								}
		    							}
		    						},
		    						width : '180px'},
		    			{key : 'stdLesDistm',title : '구분' 	, width : '90px'},
		    			{key : 'lesDistm',	title : 'SKT' ,
		    									inlineStyle : {
		    										background : function(value, data, mapping){
		    											if((data["lesDistm"] != data["lesDistmC"])){
		    												return '#FFB2D9';  //red
		    											}
		    										}
		    									},
		    									width : '90px'},
						{key : 'lesDistmC',	title : '사업자' ,
	    										inlineStyle : {
	    											background : function(value, data, mapping){
	    												if((data["lesDistm"] != data["lesDistmC"])){
	    													return '#FFB2D9';  //red
	    												}
	    											}
	    										},
	    										width : '90px'},
		    			{key : 'openDtm', title : 'SKT',
		    										inlineStyle : {
		    											background : function(value, data, mapping){
		    												if((data["openDtm"] == '' || data["openDtm"] == null) || (data["openDtm"] != data["openDtmC"])){
		    													return '#FFB2D9';  //red
		    												}
		    											}
		    										},
		    								  width : '90px'},
					    {key : 'openDtmC', title : '사업자',
	    									  inlineStyle : {
	    										  background : function(value, data, mapping){
	    											  if((data["openDtmC"] == '' || data["openDtmC"] == null) || (data["openDtm"] != data["openDtmC"])){
	    												  return '#FFB2D9';  //red
	    											  }
	    										  }
	    									  },
	    									  width : '90px'},
	    				{key : 'trmnDtm', title : 'SKT',
	    										inlineStyle : {
	    											background : function(value, data, mapping){
	    												if( (data["trmnDtm"] != data["trmnDtmC"])){
	    													return '#FFB2D9';  //red
	    												}
	    											}
	    										},
	    								  width : '90px'},
	    				{key : 'trmnDtmC', title : '사업자',
	    									  inlineStyle : {
	    										  background : function(value, data, mapping){
	    											  if( (data["trmnDtm"] != data["trmnDtmC"])){
	    												  return '#FFB2D9';  //red
	    											  }
	    										  }
	    									  },
	    									  width : '90px'},
		    			{key : 'lesCommBizrNm'	, title : '사업자'	, width : '90px'}	
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
			inlineStyle : {
				background : function(value, data, mapping){
					if(data["pair"] == '1' ){
						return '#FFFFFF';  
					}else
						return '#E7E7F3';
				}
			},
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
	        {key : 'check', width : '30px',  selectorColumn : true, hidden : true},
	        /*{title : '순번', width : '40px',  rowindexColumn : true},*/
	        
			{key : 'categoryFlag', 		title : 'categoryFlag',   width : '30px', hidden : true},
			{key : 'hdofcOrgNmFlag', 	title : 'hdofcOrgNmFlag',  width : '30px', hidden : true},
			{key : 'teamOrgNmFlag', 	title : 'teamOrgNmFlag',    width : '30px', hidden : true},
			{key : 'leslNoFlag', 	 	title : 'leslNoFlag',      width : '30px', hidden : true},
			{key : 'dnrSystmNmFlag', 	title : 'dnrSystmNmFlag',  width : '30px', hidden : true},
			{key : 'rmteSystmNmFlag',   title : 'rmteSystmNmFlag', width : '30px', hidden : true},
			{key : 'lesDistmFlag',		title : 'lesDistmFlag',	    width : '30px', hidden : true},
			{key : 'coreCntFlag', 		title : 'coreCntFlag', 	    width : '30px', hidden : true},
			{key : 'openDtmFlag', 		title : 'openDtmFlag', 	    width : '30px', hidden : true},
			{key : 'trmnDtmFlag', 		title : 'trmnDtmFlag', 	    width : '30px', hidden : true},
			{key : 'umtsoNmFlag', 	hidden : true},
			{key : 'lmtsoNmFlag', 	hidden : true},
			{key : 'skt2LineIdFlag', 	hidden : true},
			{key : 'custNmFlag', 	hidden : true},			
			{key : 'lesCommBizrNmFlag', hidden : true},
			{key : 'pair', 				title : 'pair',  width : '30px', hidden : true},
			{key : 'category' , title : '분류' , width : '90px'},
			{key : 'hdofcOrgNm'		  , title : '본부' , width : '180px'},
			{key : 'teamOrgNm'		, title : '팀' , width : '180px'},
			{key : 'leslNo'  , title : '회선번호'	, width : '90px'},
			{key : 'umtsoNm',title : '상위국'	  , width : '180px'},
			{key : 'lmtsoNm',title : '하위국'	  , width : '180px'},
			{key : 'skt2LineId', title : 'SKT2 회선번호',
				inlineStyle : {
					background : function(value, data, mapping){
						if(data["skt2LineIdFlag"] == '1' ){
							return '#FFB2D9';  //red
						}else{
							if(data["pair"] == '1' ){
								return '#FFFFFF';  //white
							}else
								return '#E7E7F3';
						}
					}
				},
			width : '90px'},
			{key : 'openDtm', title : '개통일',
				inlineStyle : {
					background : function(value, data, mapping){
						if(data["openDtmFlag"] == '1' ){
							return '#FFB2D9';  //red
						}else{
							if(data["pair"] == '1' ){
								return '#FFFFFF';  //white
							}else
								return '#E7E7F3';
						}
					}
				},
			width : '90px'},
			{key : 'trmnDtm', title : '해지일',
				inlineStyle : {
					background : function(value, data, mapping){
						if(data["trmnDtmFlag"] == '1' ){
							return '#FFB2D9';  //red
						}else{
							if(data["pair"] == '1' ){
								return '#FFFFFF';  //white
							}else
								return '#E7E7F3';
						}
					}
				},
			width : '90px'},
			{key : 'custNm', title : '고객명',
				inlineStyle : {
					background : function(value, data, mapping){
						if(data["custNmFlag"] == '1' ){
							return '#FFB2D9';  //red
						}else{
							if(data["pair"] == '1' ){
								return '#FFFFFF';  //white
							}else
								return '#E7E7F3';
						}
					}
				},
			width : '90px'},
			{key : 'lesCommBizrNm'	, title : '사업자'	, width : '90px'}
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
			inlineStyle : {
				background : function(value, data, mapping){
					if(data["pair"] == '1' ){
						return '#FFFFFF';  
					}else
						return '#E7E7F3';
				}
			},
			sorting: false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
		columnMapping: [
            {key : 'check', selectorColumn : true, hidden : true},
            /*{title : '순번', width : '40px', rowindexColumn : true},*/
			{key : 'categoryFlag', 		title : 'categoryFlag',   width : '30px', hidden : true},
			{key : 'hdofcOrgNmFlag', 	title : 'hdofcOrgNmFlag',  width : '30px', hidden : true},
			{key : 'teamOrgNmFlag', 	title : 'teamOrgNmFlag',    width : '30px', hidden : true},
			{key : 'trmsMtsoNmFlag', 	title : 'trmsMtsoNmFlag',  width : '30px', hidden : true},
			{key : 'leslNoFlag', 	 	title : 'leslNoFlag',      width : '30px', hidden : true},
			{key : 'dnrSystmNmFlag', 	title : 'dnrSystmNmFlag',  width : '30px', hidden : true},
			{key : 'rmteSystmNmFlag',   title : 'rmteSystmNmFlag', width : '30px', hidden : true},
			{key : 'lesDistmFlag',		title : 'lesDistmFlag',	    width : '30px', hidden : true},
			{key : 'coreCntFlag', 		title : 'coreCntFlag', 	    width : '30px', hidden : true},
			{key : 'openDtmFlag', 		title : 'openDtmFlag', 	    width : '30px', hidden : true},
			{key : 'trmnDtmFlag', 		title : 'trmnDtmFlag', 	    width : '30px', hidden : true},
			{key : 'lesCommBizrNmFlag', title : 'lesCommBizrNmFlag', width : '30px', hidden : true},
			{key : 'pair', 				title : 'pair',  width : '30px', hidden : true},
			{key : 'category' , title : '분류' , width : '90px'},
			{key : 'hdofcOrgNm'		  , title : '본부' , width : '180px'},
			{key : 'teamOrgNm'		, title : '팀' , width : '180px'},
//			{key : 'trmsMtsoNm'		  , title : '전송실'	, width : '180px'},
			{key : 'leslNo'  , title : '회선번호'	, width : '90px'},
			{key : 'dnrSystmNm',		  
						title : 'DONOR명',
						inlineStyle : {
							background : function(value, data, mapping){
								if(data["dnrSystmNmFlag"] == '1' ){
									return '#FFB2D9';  //red
								}else{
									if(data["pair"] == '1' ){
										return '#FFFFFF';  //white
									}else
										return '#E7E7F3';
								}
							}
						},
						width : '180px'},
			{key : 'rmteSystmNm', title : 'REMOTE명'	,
							inlineStyle : {
								background : function(value, data, mapping){
									if(data["rmteSystmNmFlag"] == '1' ){
										return '#FFB2D9';  //red
									}else{
										if(data["pair"] == '1' ){
											return '#FFFFFF';  //white
										}else
											return '#E7E7F3';
									}
								}
							},
							width : '180px'},
			{key : 'lesDistm',	title : '거리' ,
								inlineStyle : {
									background : function(value, data, mapping){
										if(data["lesDistmFlag"] == '1' ){
											return '#FFB2D9';  //red
										}else{
											if(data["pair"] == '1' ){
												return '#FFFFFF';  //white
											}else
												return '#E7E7F3';
										}
									}
								},
								width : '90px'},
			{key : 'coreCnt', title : '코아수',
									inlineStyle : {
										background : function(value, data, mapping){
											if(data["coreCntFlag"] == '1' ){
												return '#FFB2D9';  //red
											}else{
												if(data["pair"] == '1' ){
													return '#FFFFFF';  //white
												}else
													return '#E7E7F3';
											}
										}
									},
							  width : '90px'},
			{key : 'openDtm', title : '개통일',
									inlineStyle : {
										background : function(value, data, mapping){
											if(data["openDtmFlag"] == '1' ){
												return '#FFB2D9';  //red
											}else{
												if(data["pair"] == '1' ){
													return '#FFFFFF';  //white
												}else
													return '#E7E7F3';
											}
										}
									},
							  width : '90px'},
			{key : 'trmnDtm', title : '해지일',
									inlineStyle : {
										background : function(value, data, mapping){
											if(data["trmnDtmFlag"] == '1' ){
												return '#FFB2D9';  //red
											}else{
												if(data["pair"] == '1' ){
													return '#FFFFFF';  //white
												}else
													return '#E7E7F3';
											}
										}
									},
							  width : '90px'},
			{key : 'lesCommBizrNm'	, title : '사업자'	, width : '90px'}	
        ]
	};
	
	return options;
	
}(jQuery, Tango, _));
