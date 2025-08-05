/**
 * PacketTrunkDetailPop.js
 *
 * @author P123512
 * @date 2018.06.12
 * @version 1.0
 */
var gridId = 'gridIdPop';
var paramData = null;

var ntwkLineNoList = null;
var ntwkLineNo = null;

var existTangoLineNO = false; // ring list var에 N으로 시작하는 회선이 있을경우에 대한 여부 
$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#title').text("패킷트렁크 - 매칭건수");
    	paramData = param;
    	
        setEventListener();
        initGrid();
    	
    	if(nullToEmpty(paramData.ntwkLineNo) == "" ) {
    		if( nullToEmpty(paramData.eqpNm) == "" && nullToEmpty(paramData.eqpPortVal) == "" ) {
    			// 겸색결과가 없음.
    		} else {
    			initGrid("setEqp");
    		}
    	} else {
    		if(paramData.ntwkLineNo.indexOf('N') != -1) {
        		existTangoLineNO = true;
        		ntwkLineNo=paramData.ntwkLineNo;
        	} else {
        		ntwkLineNoList = paramData.ntwkLineNo.split('|');	
        	}
    		searchList();
    	}
    	
        
    };
    
  	//Grid 초기화
    function initGrid(setEqp) {
    	var columnMapping = [
    	                      {key : 'ntwkLineNm',			align:'left',			width:'200px',		title : cflineMsgArray['ringName']						/* 링명 */}
    	         			, {key : 'lftEqpNm',			align:'left',			width:'200px',		title : cflineMsgArray['west']+cflineMsgArray['equipmentName']	/* WEST장비명 */}
    	         			, {key : 'lftPortNm',			align:'left',			width:'100px',		title : cflineMsgArray['west']+cflineMsgArray['portEng']	/* WEST포트 */}
    	         			, {key : 'letRingRtCot',			align:'center',			width:'100px',		title : cflineMsgArray['west']+" "+cflineMsgArray['remoteTerminal']+"/"+cflineMsgArray['centerOfficeTerminal']	/* WEST RT/COT */}
    	         			, {key : 'rghtEqpNm',			align:'left',			width:'200px',		title : cflineMsgArray['east']+cflineMsgArray['equipmentName'] /* EAST장비명 */	}
    	         			, {key : 'rghtPortNm',			align:'left',			width:'100px',		title : cflineMsgArray['east']+cflineMsgArray['portEng']	/* EAST포트 */ }
    	         			, {key : 'rghtRingRtCot',			align:'center',			width:'100px',		title : cflineMsgArray['east']+" "+cflineMsgArray['remoteTerminal']+"/"+cflineMsgArray['centerOfficeTerminal']/* EAST RT/COT */ }
     	]
    	
    	if(setEqp == "setEqp") {
    		var data = [ 
    		    { "lftEqpNm" : paramData.eqpNm , "lftPortNm" : paramData.eqpPortVal }
    		]
    		//그리드 생성
            $('#'+gridId).alopexGrid({
            	columnMapping : columnMapping,
            	pager : true,
            	data : data,
    			rowInlineEdit : true,
    			cellSelectable : true,
    			autoColumnIndex: true,
    			fitTableWidth: true,
    			rowClickSelect : true,
    			rowSingleSelect : true,
    			numberingColumnFromZero : false,
    			height : 400,
    			message: {
    				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
    				filterNodata : 'No data'
    			}
            });
    		
    	} else {
    		//그리드 생성
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
    			height : 400,
    			message: {
    				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],
    				filterNodata : 'No data'
    			}
            });
    	}
    	
    };
    

    function searchList(){
    	cflineShowProgressBody();
    	var param = "existTangoLineNO="+existTangoLineNO;
    	
    	if(existTangoLineNO) {
    		param += "&ntwkLineNo="+ntwkLineNo;
    	} else {
    		for(var index = 0 ; index < ntwkLineNoList.length ; index++ ) {
        		param += "&ntwkLineNoList="+ntwkLineNoList[index];
    		 }
    	}
    	
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/packettrunkindex/getPacketMatchingList',param, 'GET', 'getPacketMatchingList');
    	
    }
    
    function setEventListener() {
       //닫기
       $('#btnCnclPop').on('click', function(e) {
    	   $a.close();
       });
	};

	//request 성공시
    function successCallback(response, flag){ 
    	if (flag == 'getPacketMatchingList') {
			$('#'+gridId).alopexGrid('dataSet', response.getPacketMatchingList );
			cflineHideProgressBody();
    	}
    }
    //request 실패시.
    function failCallback(response, flag){
    	if(flag == 'getPacketMatchingList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }
});