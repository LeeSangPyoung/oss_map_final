/**
 * NetworkPathCopyPop.js
 * 
 * 선번복사 - copyPath()
 * @author P095783
 * @date 2017. 7. 21.
 * @version 1.0
 */
var infoGrid = 'infoGrid';
var pathGrid = 'pathGrid';
var paramData = null;
var selectDataObj = null;
var popPageForCount = 200;
var mgmtGrpCdVal = "";
var callBackData = {};
$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	createMgmtGrpSelectBox ("mgmtGrpCdPop", "A", mgmtGrpCdVal);  // 관리 그룹 selectBox
    	initInfoGrid();
    	initPathGrid();
    	setSelectCode();
        setEventListener();   
    };
    
  // infoGrid 초기화
    function initInfoGrid() {
        //그리드 생성
        $('#'+infoGrid).alopexGrid({
        	pager : false,
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
			height : 320,	
			width : 560,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [
			{key : 'check'		, title : cflineMsgArray['number']/*번호*/	, align:'center', width:'60px'		,numberingColumn : true	}
			, {key : 'ntwkLineNo'	, title : cflineMsgArray['trunkIdentification']/*트렁크ID*/, align:'center'	, width: '120px'}
			, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px'}
            , {key : 'ntwkLineNm'	, title : cflineMsgArray['trunkNm']/*트렁크명*/, align:'left'	, width:'280px'	}
    		, {key : 'ntwkCapaCd'	, title : cflineMsgArray['capacity'] /*용량*/, align:'center'	, width: '55px'
				, render : function(value, data){ return data.ntwkCapaNm;}
			  }
    		, {key : 'wdmEqpMdlId', title : cflineMsgArray['equipmentModel'] /*장비모델*/, align:'left', width: '230px'
					, render : function(value, data){ return data.wdmEqpMdlNm;}
			  }
    		, {key : 'wdmBdwthVal', title : cflineMsgArray['bdwth']/*밴드*/, align:'center'	, width: '70px'}
    		, {key : 'wavlVal', title : cflineMsgArray['wavelength']+'/'+cflineMsgArray['frequency']/*파장/주파수*/, align:'left', width: '100px'
				, render : function(value,data){ return data.wavlVal; }
			  }
    		, {key : 'wdmDrcVal'	, title : cflineMsgArray['direction']/*방향*/, align:'left'	, width: '200px'}
  			, {key : 'lineOpenDt'	, title : cflineMsgArray['openingDate']/*개통일자*/, align:'center'	, width: '80px'}
  			, {key : 'lastChgDate'	, title : cflineMsgArray['modificationDate']/*수정일자*/, align:'center'	, width: '80px'}
  			, {key : 'uprMtsoIdNm'	, title : cflineMsgArray['upperMtso']/*상위국사*/, align:'left'	, width: '130px'}
  			, {key : 'lowMtsoIdNm'	, title : cflineMsgArray['lowerMtso']/*하위국사*/, align:'left'	, width: '130px'}
  			, {key : 'ntwkRmkOne'	, title : cflineMsgArray['remark1']/*비고1*/, align:'left'	, width: '120px'}
  			, {key : 'ntwkRmkTwo'	, title : cflineMsgArray['remark2']/*비고2*/, align:'left'	, width: '120px'}
  			, {key : 'ntwkRmkThree'	, title : cflineMsgArray['remark3']/*비고3*/, align:'left'	, width: '120px'}
            ]                                                                       
        }); 
        $('#'+infoGrid).on('scrollBottom', function(e){
    		var nFirstRowIndex =parseInt($("#firstRowIndexPop").val()) + popPageForCount; 
    		$("#firstRowIndexPop").val(nFirstRowIndex);
    		var nLastRowIndex =parseInt($("#lastRowIndexPop").val()) + popPageForCount;
    		$("#lastRowIndexPop").val(nLastRowIndex);
        	var dataParam =  $("#searchPopForm").serialize();
        	cflineShowProgress(infoGrid);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectwdmtrunklist', dataParam, 'GET', 'searchPopForPageAdd');
    	});        
    };
    
    //pathGrid 초기화
    function initPathGrid() {
    	//그리드 생성
    	$('#'+pathGrid).alopexGrid({
    		pager : false,
    		autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
    		height : 320,	
    		width : 560,
    		message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
    		},
    		columnMapping: [
    		                { key : 'WDM_TRUNK_MERGE', hidden : true, value : function(value, data) {
    							return data['WDM_TRUNK_ID'] == null ? data._index.id : data['WDM_TRUNK_ID']; }
    						}
    				        , { key : 'WDM_TRUNK_NM'
    				            	, title : cflineMsgArray['wdmTrunkName']
    				        		, align : 'left', width : '200px'
    								, hidden : true 
    						}
    				        , { key : 'WDM_TRUNK_ID', 			align : 'center', width : '10px', hidden : true}
    				        , { key : 'LEFT_ORG_NM', 				title : cflineMsgArray['westMtso'], align : 'center', width : '130px'} /* A 국사 */
    				        , { key : 'LEFT_NE_NM', 			title : cflineMsgArray['westEqp'], align : 'left', width : '170px'} /* A장 비 */
    				        , { key : 'LEFT_PORT_USE_TYPE_NM',	title : 'WEST' + cflineMsgArray['useUsageType'], align : 'center', width : '130px'} /* 좌포트사용용도 */
    				        , { key : 'LEFT_PORT_DESCR', 		title : cflineMsgArray['westPort'], align : 'left', width : '150px'} /* A 포트 */
    				        , { key : 'LEFT_CARD_WAVELENGTH',	title : 'WEST' + cflineMsgArray['wavelength'], align : 'center', width : '80px'} /* 좌파장 */
    				        , { key : 'RIGHT_NE_NM', 			title : cflineMsgArray['eastEqp'], align : 'left', width : '170px'} /* B 장비 */
    				        , { key : 'RIGHT_PORT_USE_TYPE_NM',	title : 'EAST' + cflineMsgArray['useUsageType'], align : 'center', width : '130px'} /* 우포트사용용도 */
    				        , { key : 'RIGHT_PORT_DESCR', 		title : cflineMsgArray['eastPort'], align : 'left', width : '150px'} /* B 포트 */
    				        , { key : 'RIGHT_CARD_WAVELENGTH',	title : "EAST" + cflineMsgArray['wavelength'], align : 'center', width : '80px'} /* 우파장 */
    				        , { key : 'RIGHT_ORG_NM', 				title : cflineMsgArray['eastMtso'], align : 'center', width : '130px'} /* B 국사 */ 
    		                ]                                                                       
    	});      
    };
    
    function setSelectCode() {
    	setSearchCode("hdofcCdPop", "teamCdPop", "tmofCdPop");
    }
    
    function setEventListener() {
     	$('#searchPopForm').on('keydown', function(e){	// 엔터 이벤트 
     		if (e.which == 13  ){
    			$('#btnPopSearch').click();
    			return false;
    		}
     	});	
     	
	   	//조회 
	   	$('#btnPopSearch').on('click', function(e) {
    		selectDataObj = null;
			$("#firstRowIndexPop").val(1);
			$("#lastRowIndexPop").val(popPageForCount);
			var param =  $("#searchPopForm").serialize();
			cflineShowProgress(infoGrid);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/wdmtrunk/selectwdmtrunklist', param, 'GET', 'searchPop');  	   		
        });
	
    	$('#mgmtGrpCdPop').on('change',function(e){
    		changeMgmtGrp("mgmtGrpCdPop", "hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
      	});    	  
        
    	// 본부 선택시
    	$('#hdofcCdPop').on('change',function(e){
    		changeHdofc("hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
      	});    	 
    	
  		// 팀 선택시
    	$('#teamCdPop').on('change',function(e){
    		changeTeam("teamCdPop", "tmofCdPop", "mtsoPop");
      	});      	 
    	
		//국사찾기
		$('#btnMtsoPopSch').on('click', function(e) {
			var paramValue = "";
			paramValue = {"mgmtGrpNm": $('#mgmtGrpCdPop option:selected').text(),"orgId": $('#hdofcCdPop').val(),"teamId": $('#teamCdPop').val(),"mtsoNm": $('#mtsoPopNm').val()}
			openMtsoDataPop("mtsoPopCd", "mtsoPopNm", paramValue);			
		}); 
		
	 	// 국사 keydown
     	$('#mtsoPopNm').on('keydown', function(e){
     		if(event.keyCode != 13) {
     			$("#mtsoPopCd").val("");
     		}
     	});
     	
     	// 복사버튼클릭
     	$('#btnPopCopy').on('click', function(e){
     		/*if( callBackData.mainLinks != undefined){
        		callMsgBox('','C', cflineMsgArray['pathCopyMsg'], function(msgId, msgRst){
               		if (msgRst == 'Y') {
               			$a.close(callBackData);
               		}
        		}); 
     		}else{
     			alertBox('I', cflineMsgArray['selectNoData']);  선택된 데이터가 없습니다 
     		} */
     		var element =  $('#'+infoGrid).alopexGrid('dataGet', {_state: {selected:true}});
    		var selectCnt = element.length;
    		var pathCnt = $('#'+pathGrid).alopexGrid('dataGet').length
    		
    		if(selectCnt < 1 || pathCnt < 1){
    			alertBox('I', cflineMsgArray['selectNoData']);  /*선택된 데이터가 없습니다 */
    		}else{
        		callMsgBox('','C', cflineMsgArray['pathCopyMsg'], function(msgId, msgRst){
               		if (msgRst == 'Y') {
               			$a.close(callBackData);
               		}
        		}); 
    		}
     	});
     	
 		// 그리드 클릭
 		$('#'+infoGrid).on('click', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
			selectDataObj = dataObj;
			
			var mainParams = {
					"ntwkLineNo" : selectDataObj.ntwkLineNo,
					"wkSprDivCd" : "01", 
			};
			var reserveParams = {
					"ntwkLineNo" : selectDataObj.ntwkLineNo,
					"wkSprDivCd" : "02", 
			};
			cflineShowProgress(pathGrid);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', mainParams, 'GET', 'searchPath');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectNetworkPath', reserveParams, 'GET', 'searchReservePath');
	    });  		
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchPop'){
    		cflineHideProgress(infoGrid);
    		setSPGrid(infoGrid, response, response.outWdmTrunkList);
    	}
    	if(flag == 'searchPath'){
    		if( response.data != undefined ){
				$.extend(callBackData,{mainLinks: response.data.LINKS });
				$('#'+pathGrid).alopexGrid('dataSet', response.data.LINKS)
			}else{
				$('#'+pathGrid).alopexGrid("dataEmpty");
			}
			cflineHideProgress(pathGrid);
    	}
    	if(flag == 'searchReservePath'){
    		if(response.data != undefined){
				$.extend(callBackData,{reserveLinks: response.data.LINKS });
    		}
    	}
    	if(flag == 'searchPopForPageAdd'){
    		cflineHideProgress(infoGrid);
			if(response.outWdmTrunkList.length == 0){
				return false;
			}else{
	    		$('#'+infoGrid).alopexGrid("dataAdd", response.outWdmTrunkList);
			}
    	}   	
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchPop' || flag == 'searchPopForPageAdd'){
    		cflineHideProgress(infoGrid);
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
    function setSPGrid(GridID ,Option ,Data) {
		if(Data.length == 0){
			$('#'+GridID).alopexGrid("dataSet", Data);
		}else{
    		$('#'+GridID).alopexGrid("dataSet", Data);
		}	 
	}    
});