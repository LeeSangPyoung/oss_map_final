/**
 * AfeMgmtList.js
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var tabs = "";
	//그리드 ID
    var afeGridId = 'byAfeExecRateGrid';
    var itemGridId = 'byItemExecRateGrid';
    var ioCodeGridId = 'byIoCodeExecRateGrid';
    var orgGrpCd = null;
    var userId = null;
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	orgGrpCd = $('#orgGrpCd').val();
    	userId = $('#userId').val();
    	$("#searchBtn").setEnabled(false);
        initGrid();
        setCombo();
        openPopup();
        setEventListener();
    };
    

  	//Grid 초기화
    function initGrid() {
    	var mappingAfe = [
            {
				key : 'afeYr',
				align:'center',
				width:'70px',
				title : demandMsgArray['afeYear'], /* AFE년도 */
				rowspan: true,
				colspanTo:function(value,data,mapping){
					if(data['afeYr'] == '합계'){
						return 'demdBizDivDetlNm';
					}
				}
            
			}
    		, {
				key : 'afeDemdDgr',
				align:'center',
				width:'80px',
				title : demandMsgArray['afeDegree'],  /*차수*/
				rowspan: true
			}
      		, {
				key : 'demdBizDivNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['businessDivisionBig'] /*사업구분(대)*/,
      			rowspan: true,
				colspanTo:function(value,data,mapping){
					if(data['demdBizDivNm'] == '소계'){
						return 'demdBizDivDetlNm';
					}
				}
			}
      		, {
      			key : 'demdBizDivDetlNm',
      			align:'left',
      			width:'250px',
      			title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/,
      			rowspan: true
      		}
    		, {
  				key : 'bonsaBdgtAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['assignBudget'], /*배정예산*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				},
  				inlineStyle : {
      	    		color : function(value, data) {
    					if(data['afeYr'] != '합계' && data['demdBizDivNm'] != '소계' && data['demdBizDivDetlNm'] != '소계' && value != '0'){
      	    				return 'blue';
    					}
      	    		}
				}
  			}
    		, {
    			key : 'bonsaFixAmt',
    			align:'right',
    			width:'100px',
    			title : '확정금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
    		, {
    			key : 'bonsaDesignAmt',
    			align:'right',
    			width:'100px',
    			title : '설계금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
      		, {
  				key : 'bonsaExecAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['executionAmount'], /*집행금액*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
  			}
      		, {
				key : 'bonsaExecRate',
				align:'right',
				width:'100px',
				title : demandMsgArray['executionRate'] /*집행률%*/
			}
      		, {
  				key : 'sudoBdgtAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['assignBudget'], /*배정예산*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				},
  				inlineStyle : {
      	    		color : function(value, data) {
    					if(data['afeYr'] != '합계' && data['demdBizDivNm'] != '소계' && data['demdBizDivDetlNm'] != '소계' && value != '0'){
      	    				return 'blue';
    					}
      	    		}
				}
  			}    		
      		, {
    			key : 'sudoFixAmt',
    			align:'right',
    			width:'100px',
    			title : '확정금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
    		, {
    			key : 'sudoDesignAmt',
    			align:'right',
    			width:'100px',
    			title : '설계금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
      		, {
  				key : 'sudoExecAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['executionAmount'], /*집행금액*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
  			}
      		, {
				key : 'sudoExecRate',
				align:'right',
				width:'100px',
				title : demandMsgArray['executionRate'] /*집행률%*/
			}
      		, {
  				key : 'busanBdgtAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['assignBudget'], /*배정예산*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				},
  				inlineStyle : {
      	    		color : function(value, data) {
    					if(data['afeYr'] != '합계' && data['demdBizDivNm'] != '소계' && data['demdBizDivDetlNm'] != '소계' && value != '0'){
      	    				return 'blue';
    					}
      	    		}
				}
  			}    		
      		, {
    			key : 'busanFixAmt',
    			align:'right',
    			width:'100px',
    			title : '확정금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
    		, {
    			key : 'busanDesignAmt',
    			align:'right',
    			width:'100px',
    			title : '설계금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
      		, {
  				key : 'busanExecAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['executionAmount'], /*집행금액*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
  			}
      		, {
				key : 'busanExecRate',
				align:'right',
				width:'100px',
				title : demandMsgArray['executionRate'] /*집행률%*/
			}
      		, {
  				key : 'seobuBdgtAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['assignBudget'], /*배정예산*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				},
  				inlineStyle : {
      	    		color : function(value, data) {
    					if(data['afeYr'] != '합계' && data['demdBizDivNm'] != '소계' && data['demdBizDivDetlNm'] != '소계' && value != '0'){
      	    				return 'blue';
    					}
      	    		}
				}
  			}
    		, {
    			key : 'seobuFixAmt',
    			align:'right',
    			width:'100px',
    			title : '확정금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
    		, {
    			key : 'seobuDesignAmt',
    			align:'right',
    			width:'100px',
    			title : '설계금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
      		, {
  				key : 'seobuExecAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['executionAmount'], /*집행금액*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
  			}
      		, {
				key : 'seobuExecRate',
				align:'right',
				width:'100px',
				title : demandMsgArray['executionRate'] /*집행률%*/
			}
      		, {
  				key : 'jungbuBdgtAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['assignBudget'], /*배정예산*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				},
  				inlineStyle : {
      	    		color : function(value, data) {
    					if(data['afeYr'] != '합계' && data['demdBizDivNm'] != '소계' && data['demdBizDivDetlNm'] != '소계' && value != '0'){
      	    				return 'blue';
    					}
      	    		}
				}
  			}
    		, {
    			key : 'jungbuFixAmt',
    			align:'right',
    			width:'100px',
    			title : '확정금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
    		, {
    			key : 'jungbuDesignAmt',
    			align:'right',
    			width:'100px',
    			title : '설계금액',
    			render : function(value, data) {
    				if (value == undefined || value == null || ' ' == value || '0' == value) {
    					return '0.00';
    				}
    				return setComma( number_format( Number( value )/1000000, 2 ) );
    			}
    		}
      		, {
  				key : 'jungbuExecAmt',
  				align:'right',
  				width:'100px',
  				title : demandMsgArray['executionAmount'], /*집행금액*/
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
  			}
      		, {
				key : 'jungbuExecRate',
				align:'right',
				width:'100px',
				title : demandMsgArray['executionRate'] /*집행률%*/
			}
		]
  		
  		
        //그리드 생성
        $('#'+afeGridId).alopexGrid({
        	rowOption : {
        		styleclass : function(data, rowOption){
        			if(data["invtDivCd"] == '소계'){
        				return {color:'yellow'}
        			}
        			if(data["invtDivCd"] == '합계'){
        				return {color:'red'}
        			}
        		}
        	},
            autoColumnIndex : true,
            fitTableWidth : true,
            disableTextSelection : true,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            height : 550,
            headerGroup : [
                           { fromIndex : 4, toIndex : 8, title : demandMsgArray['headquarters'] /*본사*/ },
                           { fromIndex : 9, toIndex : 13, title : demandMsgArray['capitalArea'] /*수도권*/},
                           { fromIndex : 14, toIndex : 18, title : demandMsgArray['easternPart'] /*부산*/ },
                           /*{ fromIndex : 14, toIndex : 18, title : demandMsgArray['daegu'] },*/ /*대구*/
                           { fromIndex : 19, toIndex : 23, title : demandMsgArray['westernPart'] /*서부*/ },
                           { fromIndex : 24, toIndex : 28, title : demandMsgArray['centerPart'] /*중부*/ },
            ],
            grouping : {
              	useGrouping : true,
              	by : ['afeYr','afeDemdDgr','demdBizDivNm','demdBizDivDetlNm'],
              	useGroupRowspan : true
            },
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            columnMapping : mappingAfe
        });
    	/*
    	$('#'+afeGridId).on('dblclick', '.bodycell', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		var data = AlopexGrid.trimData(event.data);
    		if ('TT' == data.invtDivCd) {
    			return false;
    		}
    		afeNew(data);
    	});
    	*/
    	var mappingItem = [
    	                  {
    	      				key : 'afeYr',
    	      				align:'center',
    	      				width:'70px',
    	      				title : demandMsgArray['afeYear'], /* AFE년도 */
    	      				rowspan: true,
    	      				render : function(value, data) {
    	      					if (value == "total") {
		      						return demandMsgArray['summarization'] /*합계*/;
		      					} 
		      					else {
		      						return value;
		      					}
    	      				},
    	      				colspanTo:function(value,data,mapping){
    	    					if(data['afeYr'] == 'total'){
    	    						return 'invtDivCdNm';
    	    					}
    	    				}
    	      			}
    	                , {
      	      				key : 'afeDemdDgr',
      	      				align:'center',
      	      				width:'80px',
      	      				title : demandMsgArray['afeDegree'],  /*차수*/
      	      				rowspan: true,
	      	      			render : function(value, data) {
		      	      			if (value == 'byYearTotal') {
		      						return demandMsgArray['subTotal'] /*소계*/;
		      					}
		      					else if (value == "total") {
		      						return demandMsgArray['summarization'] /*합계*/;
		      					} 
		      					else {
		      						return value;
		      					}
	      	      			},
    	      				colspanTo:function(value,data,mapping){
    	    					if(data['afeDemdDgr'] == 'byYearTotal'){
    	    						return 'invtDivCdNm';
    	    					}
    	    				}
    	                }, {
    	      				key : 'invtDivCdNm',
    	      				align:'center',
    	      				width:'80px',
    	      				title : demandMsgArray['division'],  /*구분*/
    	      				rowspan: true,
    	      				render : function(value, data) {
    	      					if (value == '01MTRL') {
    	      						return demandMsgArray['materialPrice'] /*물자비*/;
    	      					}
    	      					else if (value == '02CSTR') {
    	      						return demandMsgArray['constructionCost'] /*공사비*/;
    	      					}
    	      					else if (value == '03LAND') {
    	      						return demandMsgArray['landConstructCost'] /*토지건축비*/;
    	      					}
    	      					else if (value == 'byDgrTotal') {
    	      						return demandMsgArray['subTotal'] /*소계*/;
    	      					} 
    	      					else if (value == 'byYearTotal') {
    	      						return demandMsgArray['subTotal'] /*소계*/;
    	      					}
    	      					else if (value == "total") {
    	      						return demandMsgArray['summarization'] /*합계*/;
    	      					} 
    	      					else {
    	      						return value;
    	      					}
    	      				}
    	      			}
    	          		, {
    	      				key : 'bonsaBdgtAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['assignBudget'], /*배정예산*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	      				key : 'bonsaExecAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['executionAmount'], /*집행금액*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	    				key : 'bonsaExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	          		, {
    	      				key : 'sudoBdgtAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['assignBudget'], /*배정예산*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	      				key : 'sudoExecAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['executionAmount'], /*집행금액*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	    				key : 'sudoExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	          		, {
    	      				key : 'busanBdgtAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['assignBudget'], /*배정예산*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	      				key : 'busanExecAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['executionAmount'], /*집행금액*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	    				key : 'busanExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	          		/*, {
    	      				key : 'daeguBdgtAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['assignBudget'],
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	      				key : 'daeguExecAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['executionAmount'],
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	    				key : 'daeguExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate']
    	    			}*/
    	          		, {
    	      				key : 'seobuBdgtAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['assignBudget'], /*배정예산*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	      				key : 'seobuExecAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['executionAmount'], /*집행금액*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	    				key : 'seobuExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	          		, {
    	      				key : 'jungbuBdgtAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['assignBudget'], /*배정예산*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	      				key : 'jungbuExecAmt',
    	      				align:'right',
    	      				width:'100px',
    	      				title : demandMsgArray['executionAmount'], /*집행금액*/
    	      				render : function(value, data) {
    	      					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	      						return '0.00';
    	      					}
    	      					return setComma( number_format( Number( value )/1000000, 2 ) );
    	      				}
    	      			}
    	          		, {
    	    				key : 'jungbuExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	      			]
    	        		
    	        		
    	              //그리드 생성
    	              $('#'+itemGridId).alopexGrid({
    	              	/*rowOption : {
    	              		styleclass : function(data, rowOption){
    	              			if(data["invtDivCd"] == '소계'){
    	              				return {color:'yellow'}
    	              			}
    	              			if(data["invtDivCd"] == '합계'){
    	              				return {color:'red'}
    	              			}
    	              		}
    	              	},*/
    	                  autoColumnIndex : true,
    	                  fitTableWidth : true,
    	                  disableTextSelection : true,
    	                  rowSingleSelect : true,
    	                  numberingColumnFromZero : false,
    	                  height : 550,
    	                  headerGroup : [
    	                                 { fromIndex : 3, toIndex : 5, title : demandMsgArray['headquarters'] /*본사*/ },
    	                                 { fromIndex : 6, toIndex : 8, title : demandMsgArray['capitalArea'] /*수도권*/},
    	                                 { fromIndex : 9, toIndex : 11, title : demandMsgArray['easternPart'] /*부산*/ },
    	                                 /*{ fromIndex : 12, toIndex : 14, title : demandMsgArray['daegu'] },*/ /*대구*/
    	                                 { fromIndex : 12, toIndex : 14, title : demandMsgArray['westernPart'] /*서부*/ },
    	                                 { fromIndex : 15, toIndex : 17, title : demandMsgArray['centerPart'] /*중부*/ },
    	                  ],
    	                  grouping : {
    	                  useGrouping : true,
      	                  by : ['afeYr', 'afeDemdDgr', 'invtDivCdNm'],
      	                  useGroupRowspan : true
      	                  },
    	      			  message: {
    	      				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
    	      				filterNodata : 'No data'
    	      			  }
    	                  ,columnMapping : mappingItem
    	              });
    	          	/*
    	          	$('#'+itemGridId).on('dblclick', '.bodycell', function(e){
    	          		var event = AlopexGrid.parseEvent(e);
    	          		var data = AlopexGrid.trimData(event.data);
    	          		if ('TT' == data.invtDivCd) {
    	          			return false;
    	          		}
    	          		afeNew(data);
    	          	});
    	            */
    	var mappingIoCode =  [
    	    			{
    	    				key : 'afeYr',
    	    				align:'center',
    	    				width:'80px',
    	    				title : demandMsgArray['afeYear'],/* AFE년도 */
    	    				rowspan: true,
    	    				render : function(value,data){
    	    					if (value == 'total') {
    	      						return demandMsgArray['summarization'] /*합계*/;
    	      					} 
    	      					else {
    	      						return value;
    	      					}
    	    				},
    	      				colspanTo:function(value,data,mapping){
    	    					if(data['afeYr'] == 'total'){
    	    						return 'erpHdofcCd';
    	    					}
    	    				}
    	    			}
    	    			, {
    	    				key : 'demdBizDivNm',
    	    				align:'center',
    	    				width:'150px',
    	    				title : demandMsgArray['businessDivisionBig'],/*사업구분(대)*/
    	    				rowspan: true,
    	    				/*render : function(value,data){
    	    					if (value == 'byBizTotal') {
    	      						return demandMsgArray['subTotal'] 소계;
    	      					} 
    	      					else if (value == 'total') {
    	      						return demandMsgArray['summarization'] 합계;
    	      					} 
    	      					else {
    	      						return value;
    	      					}
    	    				},
    	      				colspanTo:function(value,data,mapping){
    	    					if(data['demdBizDivNm'] == 'byBizTotal'){
    	    						return 'erpHdofcCd';
    	    					}
    	    				}*/
    	    			}
    	    			, {
    	    				key : 'afeDemdDgr',
    	    				align:'center',
    	    				width:'80px',
    	    				title : demandMsgArray['afeDegree'],/* AFE차수 */
    	    				rowspan: true,
    	    				render : function(value,data){
    	    					if (value == 'byDgrTotal') {
    	      						return demandMsgArray['subTotal'] /*소계*/;
    	      					}
    	    					else if (value == 'byBizTotal') {
    	      						return demandMsgArray['subTotal'] /*소계*/;
    	      					} 
    	      					else if (value == 'total') {
    	      						return demandMsgArray['summarization'] /*합계*/;
    	      					} 
    	      					else {
    	      						return value;
    	      					}
    	    				},
    	      				colspanTo:function(value,data,mapping){
    	    					if(data['afeDemdDgr'] == 'byBizTotal'){
    	    						return 'erpHdofcCd';
    	    					}
    	    				}
    	    			}
    	    			, {
    	    				key : 'erpHdofcCd',
    	    				align:'center',
    	    				width:'100px',
    	    				title : demandMsgArray['headOffice'],/*본부*/
    	    				rowspan: true,
    	    				render : function(value, data) {
    	    					if (value == '1000') {
    	      						return demandMsgArray['headquarters'] /*본사*/;
    	      					}
    	    					else if (value == '5100') {
    	      						return demandMsgArray['capitalArea'] /*수도권*/;
    	      					}
    	    					else if (value == '5300') {
    	      						return demandMsgArray['easternPart'] /*동부*/;
    	      					}
    	    					else if (value == '5400') {
    	      						return demandMsgArray['daegu'] /*대구*/;
    	      					}
    	    					else if (value == '5500') {
    	      						return demandMsgArray['westernPart'] /*서부*/;
    	      					}
    	    					else if (value == '5600') {
    	      						return demandMsgArray['centerPart'] /*중부*/;
    	      					}
    	    					else if (value == 'byDgrTotal') {
    	      						return demandMsgArray['subTotal'] /*소계*/;
    	      					}
    	    					else if (value == 'byBizTotal') {
    	      						return demandMsgArray['subTotal'] /*소계*/;
    	      					} 
    	      					else if (value == 'total') {
    	      						return demandMsgArray['summarization'] /*합계*/;
    	      					} 
    	      					else {
    	      						return value;
    	      					}
    	      				}
    	    			}
    	    			, {
    	    				key : 'ioCd',
    	    				align:'center',
    	    				width:'80px',
    	    				title : demandMsgArray['ioCode'],/* IO코드 */
    	    				hidden : true
    	    			}
    	    			, {
    	    				key : 'mtrlAsgnBdgt',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['assignBudget'],/*배정예산*/
    	    				render : function(value, data) {
    	    					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	    						return '0.00';
    	    					}
    	    					return setComma( number_format( Number( value )/1000000, 2 ) );
    	    				}
    	    			}
    	    			, {
    	    				key : 'mtrlExecAmt',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionAmount'],/*집행금액*/
    	    				render : function(value, data) {
    	    					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	    						return '0.00';
    	    					}
    	    					return setComma( number_format( Number( value )/1000000, 2 ) );
    	    				}
    	    			}
    	    			, {
    	    				key : 'mtrlExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	    			, {
    	    				key : 'cstrAsgnBdgt',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['assignBudget'],/*배정예산*/
    	    				render : function(value, data) {
    	    					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	    						return '0.00';
    	    					}
    	    					return setComma( number_format( Number( value )/1000000, 2 ) );
    	    				}
    	    			}
    	    			, {
    	    				key : 'cstrExecAmt',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionAmount'],/*집행금액*/
    	    				render : function(value, data) {
    	    					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	    						return '0.00';
    	    					}
    	    					return setComma( number_format( Number( value )/1000000, 2 ) );
    	    				}
    	    			}
    	    			, {
    	    				key : 'cstrExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	    			, {
    	    				key : 'landCnstAsgnBdgt',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['assignBudget'],/*배정예산*/
    	    				render : function(value, data) {
    	    					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	    						return '0.00';
    	    					}
    	    					return setComma( number_format( Number( value )/1000000, 2 ) );
    	    				}
    	    			}
    	    			, {
    	    				key : 'landCnstExecAmt',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionAmount'],/*집행금액*/
    	    				render : function(value, data) {
    	    					if (value == undefined || value == null || ' ' == value || '0' == value) {
    	    						return '0.00';
    	    					}
    	    					return setComma( number_format( Number( value )/1000000, 2 ) );
    	    				}
    	    			}
    	    			, {
    	    				key : 'landCnstExecRate',
    	    				align:'right',
    	    				width:'100px',
    	    				title : demandMsgArray['executionRate'] /*집행률%*/
    	    			}
    	        	];
    	      		
    	            //그리드 생성
    	            $('#'+ioCodeGridId).alopexGrid({
    	                cellSelectable : true,
    	                autoColumnIndex : true,
    	                fitTableWidth : true,
    	                rowClickSelect : true,
    	                rowSingleSelect : true,
    	                rowInlineEdit : false,
    	                numberingColumnFromZero : false,
    	                headerGroup : [
    	                               { fromIndex : 5, toIndex : 7, title : demandMsgArray['materialPrice'] /*물자비*/},
    	                               { fromIndex : 8, toIndex : 10, title : demandMsgArray['constructionCost'] /*공사비*/ },
    	                               { fromIndex : 11, toIndex : 13, title : demandMsgArray['landConstructCost'] /*토지건축비*/}
    	                ],
    	                columnMapping : mappingIoCode,
    	                grouping : {
    	                	useGrouping : true,
    	                	by : ['afeYr', 'demdBizDivNm', 'afeDemdDgr', 'erpHdofcNm'],
    	                	useGroupRowspan : true
    	                },
    	                message: {
    	    				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
    	    				filterNodata : 'No data'
    	    			}
    	            });
    	            
    	            $('#'+ioCodeGridId).on('dblclick', function(e) {

    	            	var object = AlopexGrid.parseEvent(e);
    	            	var data = AlopexGrid.currentData(object.data);
    	            	
    	            	if (data == null) {
    	            		return false;
    	            	}
    	            	if (object.mapping.key == 'mtrlExecAmt' || object.mapping.key == 'landCnstExecAmt') {
	            		   	if ( data.erpHdofcCd == 'byDgrTotal' || data.erpHdofcCd == 'byBizTotal' || data.erpHdofcCd == 'total') {
	            				return false;
    	              		}
    	              		if ( data._state.focused) {
    	              			budgetPop(data);
    	              		}
    	              	}    	            	
    	            });
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    function openPopup(){
    	 $('#btnAfeNew').on('click', function(e) {
    		 afeNew();
         });
    	
    	// AFE 연차 등록
        $('#btnAddAfe').on('click', function(e) {
        	addAfe();
        });
        
        //사업구분코드등록
        $('#btnAddBizDiv').on('click', function(e) {
        	addBizDiv();
        });
        
        //ERP 세부차수 수정
        $('#btnEditErpDgr').on('click', function(e) {
        	editErpDgr();
        });
    }
    
    function setCombo() {
    	//AFE 연차
    	selectAfeYearCode('afeYr', 'Y', '');
    	selectAfeYearCode('listAfeYr', 'Y', '');
    	if(orgGrpCd == 'SKT' || userId == 'PTN2773271' || userId == 'PTN5205718' || userId == 'PTN2773198'){
    		$("#searchBtn").setEnabled(true);
    	}
    }
    
    function afeNew(data){
    	$a.popup({
        	popid: 'PopAfeNew',
    		url : 'PopAfeNew.do',
    		data : data,
    		iframe : true,
    		modal : true,
    		width : 1280,
    		height : 720,
    		title : demandMsgArray['createAfeBiz'], /* AFE 사업 등록 */
    		movable : true,
    		callback : function(data){
    			if(data == true){
    			}
    		}
    	});
    }
    
    function addAfe(){
    	$a.popup({
    		url : 'PopAddAfe.do',
    		iframe : true,
    		modal : true,
    		width : 800,
    		height : 630,
    		title : demandMsgArray['createAFE'],  /* AFE 차수 등록 */
    		movable : true,
    		callback : function(data){
    			if(data == true){
    			}
    		}
    	});
    }
    
    function addBizDiv(){
    	$a.popup({
    		url : 'PopAddBizDiv.do',
    		iframe : true,
    		modal : true,
    		width : 1280,
    		height : 720,
    		title : demandMsgArray['businessDivisionCodeRegistration'], /* 사업구분코드등록 */
    		movable : true,
    		callback : function(data){
    			if(data == true){
    			}
    		}
    	});
    }
    
    function budgetPop(data){
    	$a.popup({
    		url : '/tango-transmission-web/demandmgmt/transmissiondemandpool/BudgetPopup.do',
    		data : data,
    		iframe : true,
    		modal : true,
    		width : 1280,
    		height : 720,
    		title : demandMsgArray['executionAmountDetail'], /* 집행금액 상세 */
    		movable : true,
    		callback : function(data){
    			if(data == true){
    			}
    		}
    	});
    }
    
    function afeExecRatePop(data){
    	$a.popup({
        	popid: 'PopAfeExecRate',
    		url : 'PopAfeExecRate.do',
    		data : data,
    		iframe : true,
    		modal : true,
    		width : 1280,
    		height : 720,
    		title : 'AFE별 집행률 상세',
    		movable : true,
    		callback : function(data){
    			if(data == true){
    			}
    		}
    	});
    }
    
    function editErpDgr(){
    	$a.popup({
    		url : 'PopEditErpDgr.do',
    		iframe : true,
    		modal : true,
    		width : 1280,
    		height : 720,
    		title : 'ERP 세부 차수 설정',
    		movable : true,
    		callback : function(data){
    			if(data == true){
    			}
    		}
    	});
    }
    
    function apiTest(){
		var dataParam =  { gubun : 'AE' /* A망 선로프로젝트코드 조회 구분값 */
					 , afeYr : '2023' /*AFE 년도*/
					 , afeNo : '1' /*AFE 차수*/
					 , appltNo : '' /* 청약번호 */
					 , uprDemdBizDivCd : '' /* 사업구분(대) */
					 , lowDemdBizDivCd : '' /* 사업구분(세부) */
		}
		
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectPrjcdApi', dataParam, 'GET', 'apiTest');	  
    }
    
  //엑셀
    /*
    function excelDownList() {
    	var dataParam =  $("#listSearchForm").getData();
    	dataParam.firstRowIndex = 1;
    	dataParam.lastRowIndex = 30000;
    	
    	dataParam.fileName = demandMsgArray['afeManagement'];
    	dataParam.fileDataType = "afeMgmtListExcelDown";
    	dataParam.fileExtension = "xlsx";

    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmtexcel/afemgmtexceldownload'
		           , dataParam
		           , 'GET'
		           , 'excelDownList');
    }
    */
    function excelDownList() {
    	var fileName = '';
    	var gridId = '';
    	
    	if ( tabs == 'byAfeExecRate' ) {
    		fileName = demandMsgArray['byAfeExecutionRate'];
    		gridId = afeGridId;
    	}else if(tabs == 'byItemExecRate'){
    		fileName = demandMsgArray['byItemExecutionRate'];
    		gridId = itemGridId;
        }else if(tabs == 'byIoCodeExecRate'){
        	fileName = demandMsgArray['byIoCodeExecutionRate'];
        	gridId = ioCodeGridId;
        }
	    	
    	var list = AlopexGrid.trimData( $("#"+gridId).alopexGrid( "dataGet", {} ) );
    	if ( list.length < 1 ) {
    		alertBox('W', demandMsgArray['noData']);
    		return false;
    	}
    	
    	callMsgBox('','C', demandMsgArray['confirmExcelPrinting'], function(msgId, msgRst){ /* 엑셀로 출력 하시겠습니까? */
    		if (msgRst == 'Y') {
    			bodyProgress();
    			var worker = new ExcelWorker({
    				excelFileName : fileName,
    				palette : [{
    					className : 'B_YELLOW',
    					backgroundColor : '255,255,0'
    				},{
    					className : 'F_RED',
    					color : '#FF0000'
    				}],
    				sheetList : [{
    					sheetName : fileName,
    					$grid : $('#'+gridId)
    				}]
    			});
    			worker.export({
    				merge: true,
            		useGridColumnWidth : true,
            		border  : true,
            		useCSSParser : true
    			});
            	bodyProgressRemove();
    		}
    	});
    }
    
    function setEventListener() {
    	tabs = 'byAfeExecRate';
    	$('#conditionDivScDemdBizDivCd').css("display", "none");
    	$('#afeYrDgr').css("display", "none");
    	
    	$('#basicTabs').on("tabchange", function(e, index) {
    		switch (index) {
    			case 0 :
    				tabs = 'byAfeExecRate';
    				$('#'+afeGridId).alopexGrid("viewUpdate");
    				
    				$('#afeYear').css("display", "");
    		    	$('#afeYrDgr').css("display", "none");
    				$('#conditionDivScDemdBizDivCd').css("display", "none");
    				
    				break;
    			case 1 :
    				tabs = 'byItemExecRate';
    				$('#'+itemGridId).alopexGrid("viewUpdate");
    				
    				$('#afeYear').css("display", "none");
    		    	$('#afeYrDgr').css("display", "");
    				$('#conditionDivScDemdBizDivCd').css("display", "none");
    				
    				break;
    			case 2 :
    				tabs = 'byIoCodeExecRate';
    				$('#'+ioCodeGridId).alopexGrid("viewUpdate");
    				
    				$('#afeYear').css("display", "none");
    		    	$('#afeYrDgr').css("display", "");
    				$('#conditionDivScDemdBizDivCd').css("display", "");
    				
    				break;
    			default :
    				break;
    		}
    	});
	    // 조회
	    $('#searchBtn').on('click', function(e) {  	
	    	
	    	if(tabs == 'byAfeExecRate'){
	    		var dataParam =  {
		    			sAfeYear : $('#afeYr').val(),
		    			tabs : tabs
		    	};	    		
	    		showProgress(afeGridId);	    		
	    	}else if(tabs == 'byItemExecRate'){
	    		var dataParam =  {
		    			sAfeYear : $('#listAfeYr').val(),
		    			sAfeDemdDgr : $('#listAfeDemdDgr').val(),
		    			tabs : tabs
		    	};
	    		showProgress(itemGridId);
	    	}else if(tabs == 'byIoCodeExecRate'){
	    		var dataParam =  {
		    			sAfeYear : $('#listAfeYr').val(),
		    			sAfeDemdDgr : $('#listAfeDemdDgr').val(),
		    			demdBizDivCd : $('#scDemdBizDivCd').val(),
		    			tabs : tabs
		    	};
	    		showProgress(ioCodeGridId);
	    	}
	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectafemgmtlist', dataParam, 'GET', 'AfeMgmtList');	    	
	    });
        
      //AFE 차수
        $('#listAfeYr').on('change',function(e) {
        	var afeYear = $('#listAfeYr').val();
        	if(afeYear == ""){
        		$('#listAfeDemdDgr').empty();
    			$('#listAfeDemdDgr').append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$('#listAfeDemdDgr').setSelected("");
        		$('#scDemdBizDivCd').empty();
    			$('#scDemdBizDivCd').append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$('#scDemdBizDivCd').setSelected("");
        	}else{
	        	var dataParam = { 
	        			AfeYr : this.value
	    		};
	    		selectAfeTsCode('listAfeDemdDgr', 'Y', '', dataParam);
	        	selectYearBizCombo('scDemdBizDivCd', 'Y', this.value, 'C00618', '', 'V');
        	}
        });
        
        //엑셀
        $('#bteExcelDown').on('click',function(e) {
        	//bodyProgress();
        	excelDownList();
        });
        
    	// 더블클릭
    	$('#'+afeGridId).on('dblclick', '.bodycell', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		var data = AlopexGrid.trimData(event.data);
    		var mapping = event.mapping;
    		var key = mapping.key ;
    		var keyValue = "";
    		var bonBu = "";
    		if(data.afeYr !='합계' && data.demdBizDivNm != '소계' && data.demdBizDivDetlNm != '소계'){
    			if(mapping.key == "bonsaBdgtAmt"){
        			keyValue = data.bonsaBdgtAmt;
        			bonBu = '1000';
        		}else if(mapping.key == "sudoBdgtAmt"){
        			keyValue = data.sudoBdgtAmt;
        			bonBu = '5100';
        		}else if(mapping.key == "busanBdgtAmt"){
        			keyValue = data.busanBdgtAmt;
        			bonBu = '5300';
        		}else if(mapping.key == "seobuBdgtAmt"){
        			keyValue = data.seobuBdgtAmt;
        			bonBu = '5500';
        		}else if(mapping.key == "jungbuBdgtAmt"){
        			keyValue = data.jungbuBdgtAmt;
        			bonBu = '5600';
        		}
    		}
    		var dataParam =  {
	    			sAfeYear : $('#afeYr').val(),
	    			tabs : tabs
	    	};	   
    		
    		if(bonBu !="" && keyValue !=0){
    			var popData = {
    					afeYr : data.afeYr,
    					afeDemdDgr : data.afeDemdDgr,
    					demdBizDivCd : data.demdBizDivCd,
    					demdBizDivDetlCd : data.demdBizDivDetlCd,
    					erpHdofcCd : bonBu 
    	    	};	   
    			afeExecRatePop(popData);
    		}
    		
    	});
    	
	};
	
  //request
	function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    }
	
		
	//request 성공시
    function successDemandCallback(response, flag){
    	
    	if ( flag == 'AfeMgmtList' ) {
	    	if ( tabs == 'byAfeExecRate' ) {
	    		hideProgress(afeGridId);
		   		$( '#' + afeGridId ).alopexGrid( "sortClear" );
		   		$( '#' + afeGridId ).alopexGrid( "dataEmpty" );
		   		$( '#' + afeGridId ).alopexGrid( 'updateOption' ,
					{ paging : { pagerTotal : function( paging ) {
						return demandMsgArray['totalCnt']/*총 결과*/+ ' : ' + response.totalCnt;
					}}}
				);
		   		if( response != null ) {
		       		$( '#' + afeGridId ).alopexGrid( "dataSet", response.list);
		   		}
	    	}else if(tabs == 'byItemExecRate'){
		    	
	    		hideProgress(itemGridId);
		   		$( '#' + itemGridId ).alopexGrid( "sortClear" );
		   		$( '#' + itemGridId ).alopexGrid( "dataEmpty" );
		   		$( '#' + itemGridId ).alopexGrid( 'updateOption' ,
					{ paging : { pagerTotal : function( paging ) {
						return demandMsgArray['totalCnt']/*총 결과*/+ ' : ' + response.totalCnt;
					}}}
				);
		    	if(response!= null) {
		        	$('#'+itemGridId).alopexGrid("dataSet", response.list);
		    	}
			   		
	        }else if(tabs == 'byIoCodeExecRate'){
	       		
       			hideProgress( ioCodeGridId );
    	   		$( '#' + ioCodeGridId ).alopexGrid( "sortClear" );
    	   		$( '#' + ioCodeGridId ).alopexGrid( "dataEmpty" );
    	   		$( '#' + ioCodeGridId ).alopexGrid( 'updateOption' ,
    				{ paging : { pagerTotal : function( paging ) {
    					return demandMsgArray['totalCnt']/*총 결과*/+ ' : ' + response.totalCnt;
    				}}}
    			);
    	    	if(response!= null) {
    	        	$('#'+ioCodeGridId).alopexGrid("dataSet", response.list);
    	    	}	    	   
	        }
	    }
    	/*
    	if(flag == 'excelDownList') {
    		if (response.code == "OK") {
    			bodyProgressRemove();
        		var $form=$('<form></form>');
    			$form.attr('name','downloadForm');
    			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
    			$form.attr('method','GET');
    			$form.attr('target','downloadIframe');
    			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
				$form.append(Tango.getFormRemote());
    			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
    			$form.appendTo('body');
    			$form.submit().remove();
    		} else {
    			//alert(response.retMsg);
    			bodyProgressRemove();
    			alertBox('W', response.retMsg);
    		}
    	}
    	*/
    }
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	if(tabs == 'byAfeExecRate'){
    		hideProgress(afeGridId);
    	}else if(tabs == 'byItemExecRate'){
    		hideProgress(itemGridId);
    	}else if(tabs == 'byIoCodeExecRate'){
    		hideProgress(ioCodeGridId);
    	}
    	if(flag == 'AfeMgmtList'){
    		callMsgBox('', 'W', demandMsgArray['searchFail'] );
    		return;
    	}

		bodyProgressRemove();
		alertBox('W', demandMsgArray['systemError']);
    }
    
});