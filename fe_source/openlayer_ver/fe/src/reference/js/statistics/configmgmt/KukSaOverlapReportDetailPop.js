/**
 * KukSaOverlapReportDetailPop.js
 *
 * @author P123512
 * @date 2018.04.09
 * @version 1.0
 */
var gridId = 'dataGridPop';
var paramData = null;
var excelFileSheetName = "";
var param = {};
$a.page(function() {
	this.init = function(id, param) {
		$('#btnExportExcelPop').setEnabled(false);
		paramData = param;
        setEventListener();
        initGrid();
        searchList();
	};
	
	
	
	//Grid 초기화
	function initGrid() {
		var columnMapping = [
			                      {key : 'lineNm',		align:  'left',				width : '280px',			title : cflineMsgArray['lnNm']					/* 회선명 */ }
			                    , {key : 'trunkNm', 	align : 'left', 			width : '310px', 			title : cflineMsgArray['trunkNm']				/* 트렁크명 */}
			                    , {key : 'ringNm',		align : 'left',				width : '270px',			title : cflineMsgArray['ringName']				/* 링명 */}
			                    , {key : 'eqpNm', 		align : 'left', 			width : '270px', 			title : cflineMsgArray['equipmentName']			/* 장비명*/ }		
			                    , {key : 'aPortNm', 	align : 'center', 			width : '150px', 			title : "A_PORT",								/* A_PORT */
			                    	render : function(value, data){
			                    		if(nullToEmpty(data.rxAPortNm) != "" ){
			                    			return value+"("+data.rxAPortNm+")"
			                    		} else {
			                    			return value;
			                    		}
			                    	}
			                    }
			                    , {key : 'bPortNm', 	align : 'center', 			width : '150px', 			title : "B_PORT"	,							/* B_PORT */
			                    	render : function(value, data){
			                    		if(nullToEmpty(data.rxBPortNm) != ""){
			                    			return value+"("+data.rxBPortNm+")"
			                    		} else {
			                    			return value;
			                    		}
			                    	}
			                    }
			]

		//Grid 생성
		$('#'+gridId).alopexGrid({
				columnMapping : columnMapping,
		    	pager : true,
				rowInlineEdit : true,
				cellSelectable : true,
				autoColumnIndex: true,
				fitTableWidth: true,
				rowClickSelect : true,
				rowSingleSelect : true,
				numberingColumnFromZero : false,
				height : 380,
				message: {
					nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
					filterNodata : 'No data'
				}
		});
	};
	
	function searchList() {
		cflineShowProgressBody();
		var param = 
			"mobileLine="+paramData.mobileLine+"&etcLine="+paramData.etcLine+"&companyLine="+paramData.companyLine+"&mtso="+paramData.mtso+"&eqpId="+paramData.eqpId ; 
		for(var index = 0 ; index < paramData.popCallBackData.length ; index++ ) {
			param += "&popCallBackData="+paramData.popCallBackData[index].addmtsoId; 
		} 
		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/kuksaoverlapreport/getKukSaOverlapDetailList', param, 'GET', 'getKukSaOverlapDetailList');
	}

	function setEventListener() {

	    //닫기
	    $('#btnCnclPop').on('click', function(e) {
	 	   $a.close();
	    });
	};
	
	//request 성공시
	function successCallback(response, flag) {
		if (flag == 'getKukSaOverlapDetailList') {
			cflineHideProgressBody();
			$('#'+gridId).alopexGrid("dataSet", response.getKukSaOverlapDetailList);
    	}
	
	}
	
	//request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getKukSaOverlapDetailList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']);  /*조회 실패 하였습니다.*/
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