/**
 * RmIdlenessListPop.js
 *
 * @author P123512
 * @date 2018.10.12
 * @version 1.0
 */

$a.page(function() {
	var whole = cflineCommMsgArray['all'] /* 전체 */;
	var gridId = 'gridData';
	var dataParam = null;
	this.init = function(id, param) {
		dataParam = param;
		//$('#title').text("RM유휴회선 목록");
        initGrid();
        setEventListener();
		searchList(dataParam);
	};
	
	//Grid 초기화
	function initGrid() {
		var selectColomn = [
		                    {key : 'portChnlAll',		align : 'left',			width :	'120px',		title : "조회포트명"								/* 조회포트명 */ }
		                    , {key : 'gubun',			align : 'cetner',		width :	'70px',			title : "유휴유무"								/* 유휴유무 */ }
		                    , {key : 'rmPathName',		align : 'left',			width :	'200px',		title : cflineMsgArray['lnNm']					/* 회선명 */ }
		                    , {key : 'mtsoNm',			align : 'center',		width :	'130px',		title : cflineMsgArray['mgmtTmof']				/* 관할전송실 */ }
		                    , {key : 'trunkNm',			align : 'left',			width :	'150px',		title : cflineMsgArray['trunkNm']				/* 트렁크명 */ }
		                    , {key : 'eqpId',			align : 'left',			width :	'120px',		hidden : true									/* 장비ID */ }
		                    , {key : 'eqpNm',			align : 'left',			width :	'80px',			title : cflineMsgArray['equipmentName']			/* 장비명 */ }
		                    , {key : 'portId', 			align : 'left', 		width : '120px', 		hidden : true									/* 포트ID */}
		                    , {key : 'chnlVal', 		align : 'left', 		width : '80px', 		hidden : true 									/* 채널값 */}
		                    , {key : 'aPortChnl', 		align : 'left', 		width : '120px', 		title : "APORT"									/* APORT */}
		                    , {key : 'bPortChnl', 		align : 'left', 		width : '120px', 		title : "BPORT"									/* BPORT */}
		                    , {key : 'insertId', 		align : 'left', 		width : '80px', 		hidden : true 									/* insertId */}
		                    , {key : 'svlnNo', 			align : 'left', 		width : '80px', 		hidden : true 									/* 서비스회선번호 */}
		                    , {key : 'svlnSclCd', 		align : 'left', 		width : '80px', 		hidden : true 									/* 서비스회선소분류 */}
		                    , {key : 'svlnSclCdNm', 	align : 'center', 		width : '140px', 		title : cflineMsgArray['serviceLineScl']		/* 서비스회선소분류명 */}
		                    , {key : 'tie1', 			align : 'left', 		width : '120px', 		title : "TIE1"									/* TIE1 */}
		                    , {key : 'tie2', 			align : 'left', 		width : '120px', 		title : "TIE2"									/* TIE2 */}
		                    , {key : 'icTie1', 			align : 'left', 		width : '120px', 		title : "IC_TIE1"								/* IC_TIE1 */}
		                    , {key : 'icTie2', 			align : 'left', 		width : '120px', 		title : "IC_TIE2"								/* IC_TIE2 */}
		                    , {key : 'ogTie1', 			align : 'left', 		width : '120px', 		title : "OG_TIE1"								/* OG_TIE1 */}
		                    , {key : 'ogTie2', 			align : 'left', 		width : '120px', 		title : "OG_TIE2"								/* OG_TIE2 */}
		                    
		                    , {key : 'oppsRmPathName', 	align : 'left', 		width : '200px', 		title : "대국 RM Path 명"						/* 대국 RM Path 명 */}
		                    , {key : 'oppsEqpNm', 		align : 'left', 		width : '80px', 		title : "대국 장비명"								/* 대국 장비명 */}
		                    , {key : 'oppsAportDescr', 	align : 'left', 		width : '120px', 		title : "대국 APORT"								/* 대국 APORT */}
		                    , {key : 'oppsBportDescr', 	align : 'left', 		width : '120px', 		title : "대국 BPORT"								/* 대국 BPORT */}
		]
		
		//Grid 생성
		$('#'+gridId).alopexGrid({
			columnMapping : selectColomn,
	    	pager : true,
			rowInlineEdit : false,
			cellSelectable : false,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : true,
			rowSingleSelect : true,
			numberingColumnFromZero : false,
			height : 500,
			rowOption:{inlineStyle: function(data,rowOption){
				if(nullToEmpty(data["gubun"]) == "유휴" && ( nullToEmpty(data["oppsRmPathName"]) != "" && nullToEmpty(data["oppsRmPathName"]) != null ) ) return {color:'red'} // background:'orange',
				}
			}
		});
	};
	
	function setEventListener() {
		//닫기
       $('#btnCnclPop').on('click', function(e) {
    	   $a.close();
       });

       //선택
       $('#selectBtn').on('click', function(e) {
    	   var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
    	   if(dataList != null && dataList.length > 0){
//	    	   var data ={portChnlAll : dataList[0].portChnlAll};
	    	   $a.close(dataList[0]);
    	   }
       });
       
       // 셀 더블클릭시 선택
       $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	   var dataObj = AlopexGrid.parseEvent(e).data;
    	   if(dataObj != null ){
//	    	   var data ={portChnlAll : dataObj.portChnlAll};
	    	   $a.close(dataObj);
    	   }
       });
       
       $('#btnExportExcel').on('click', function(e) {
      	 cflineShowProgressBody();
      	 excelDownload();
       });
	};
	
	
	//엑셀다운로드
    function excelDownload() {
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : 'RM유휴회선_'+date,
     		sheetList: [{
     			sheetName: 'RM유휴회선_'+date,
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
    }
	
	function searchList(dataParam) {
		var portChnl = dataParam.portChnl;
		var port = null;
		var chnl = null;
		
		var commaC = portChnl.indexOf(",");
		if(commaC != -1 ){ 
			if((portChnl.length-commaC) <3){
				portChnl = portChnl.substring(0,commaC);
				port = portChnl;
				chnl = "";
			}else{
				port = portChnl.substring(0,commaC);
				chnl = portChnl.substring(commaC,portChnl.length);
			}
//		} else {
//    		callMsgBox('', 'I', "채널 입력 형식은 ,를 붙여서 입력해주세요.", function() {
//    			$a.close();
//    		}); 			
//			return false;
		}
//		
//		if(chnl.length < 3  || chnl.indexOf(",") != 0 || $.isNumeric(chnl[1]) == false || $.isNumeric(chnl[2]) == false  ) {
//    		callMsgBox('', 'I', "채널 ,(comma) 이후에 숫자2개이상 입력가능합니다.", function() {
//    			$a.close();
//    		}); 			
//			return false;
//		}
		
		if(chnl != null && chnl !=""){
			chnl = chnl.substr(0, 3);
		}else{
			port = portChnl;
			chnl = "";
		}
		
	/*	if(nullToEmpty(chnl)=="") {
			callMsgBox('', 'I', "채널값을 2자리 이상 입력해주세요.", function() {
    			$a.close();
    		}); 			
			return false;
		}*/
		cflineShowProgressBody();
		
		$('#eqpNm').val(dataParam.eqpNm );
		$('#portNm').val(port+chnl);
		var param = {
				"eqpNm" : dataParam.eqpNm
				,"portChnl" : port+chnl
				,"portNm" : port
				,"chnlVal": chnl
				,"trunkNm" : dataParam.trunkNm
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getRmIdlenessList', param, 'GET', 'getRmIdlenessList');
	}

	//request 성공시
	function successCallback(response, flag) {
		if(flag == 'getRmIdlenessList') {
			cflineHideProgressBody();
			if(nullToEmpty(response.Result) == "NoChnl"){
	    		alertBox('I', "해당 트렁크의 E1용량 정보를 찾을 수 없습니다."); /* 조회 실패 하였습니다.*/
			}else{
				$('#'+gridId).alopexGrid("dataSet", response.getRmIdlenessList);
			}
		}	
	}
	 
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getRmIdlenessList'){
    		cflineHideProgressBody();
    		$a.close("searchError");
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }

 
});