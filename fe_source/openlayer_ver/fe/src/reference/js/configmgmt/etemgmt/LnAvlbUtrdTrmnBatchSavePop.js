/**
 * LnAvlbUtrdTrmnBatchSavePop
 *
 * @author P128406
 * @date 2024. 12. 04
 * @version 1.0
 * 
 * ************* 수정이력 ************
 * 2025-01-08  1. 다건 추가후 일괄등록기능 신규추가
 */

var gridId = 'gridIdPop';
var paramData = null;
var userId = null;
var utrdMgmtNoArray = [];

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnTrmnBatchSave').setEnabled(true);
    	paramData = param.dataList;
    	userId = param.userId;
    	
        setEventListener();
        initGrid();
    };
    
    function initGrid() {
    	var optionData1 = [{value:"", text:"-" },
	             	{value:"N", text:"미완료" },
	               	{value:"Y", text:"완료"}
	               	]

    	var optionData2 = [{value:"", text:"-" },
	             	{value:"N", text:"철거안함" },
	               	{value:"Y", text:"철거"}
	               	]
    	
    	//해지장비철거여부
		$('#eqpRemvYnPop').setData({
	       	data:[{value:"", text:"-" },
		       	   {value:"N", text:"미철거" },
		       	   {value:"Y", text:"철거" },
		       	   {value:"E", text:"광랜E" }
	             ],
	       	option_selected: '' // 최초 선택값 설정
	       });
    	//망OJC
		$('#scrbrNetCstrNeedYnPop').setData({
	       	data:optionData2,
	       	option_selected: '' // 최초 선택값 설정
	       });

    	//케이블
		$('#eqpRackCstrNeedYnPop').setData({
	       	data:optionData2,
	       	option_selected: '' // 최초 선택값 설정
	       });
		//가입자망OJC
		$('#ojcCstrNeedYnPop').setData({
	       	data:optionData2,
	       	option_selected: '' // 최초 선택값 설정
	       });
		
		//GIS현행화여부
		$('#gisCrrtYnPop').setData({
	       	data:optionData1,
	        option_selected: '' // 최초 선택값 설정
        });
		//회선라우팅삭제여부
		$('#lineRotgDelYnPop').setData({
	       	data:optionData1,
	        option_selected: '' // 최초 선택값 설정
        });
		
		//회선맵삭제여부
		$('#lineMapDelYnPop').setData({
	       	data:optionData1,
	        option_selected: '' // 최초 선택값 설정
       });
    }
  	    
    
    function setEventListener() {
    	//일괄적용
    	$('#btnTrmnBatchSave').on('click', function(e) {
	    	//cflineShowProgressBody();
    		var param = null;
    		for(var i = 0; i < paramData.length; i++){			
    			utrdMgmtNoArray[i] = paramData[i].utrdMgmtNo;
    		}
    		    		
    		param = { 
				      "utrdMgmtNoArray" : utrdMgmtNoArray
    				, "eqpRemvYnPop" : $('#eqpRemvYnPop').val()
    				, "scrbrNetCstrNeedYnPop" : $('#scrbrNetCstrNeedYnPop').val()
    				, "eqpRackCstrNeedYnPop" : $('#eqpRackCstrNeedYnPop').val()
    				, "ojcCstrNeedYnPop" : $('#ojcCstrNeedYnPop').val()
    				, "gisCrrtYnPop" : $('#gisCrrtYnPop').val()
    				, "lineRotgDelYnPop" : $('#lineRotgDelYnPop').val()
    				, "lineMapDelYnPop" : $('#lineMapDelYnPop').val()
    				, "utrdRmkPop" : $('#utrdRmkPop').val()
    				, "userIdPop" : userId
    			};
    		
    		
	    	callMsgBox('','C', '일괄등록 하시겠습니까?', function(msgId, msgRst){   /*전송하시겠습니까?*/
	    		if (msgRst == 'Y') {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/updateLnAvlbTrmnBatchSaveInf', param, 'POST', 'updateLnAvlbTrmnBatchSaveInf');
	        	}
	    	});
    	
       });
     
       //닫기
       $('#btnCnclPop').on('click', function(e) {
    	   $a.close();
       });

       //전체 데이터 클리어
       $('#btn_clear').on('click', function(){
    	   $('#eqpRemvYnPop').setSelected("-");
    	   $('#scrbrNetCstrNeedYnPop').setSelected("-");
    	   $('#eqpRackCstrNeedYnPop').setSelected("-");
    	   $('#ojcCstrNeedYnPop').setSelected("-");
    	   $('#gisCrrtYnPop').setSelected("-");
    	   $('#lineRotgDelYnPop').setSelected("-");
    	   $('#lineMapDelYnPop').setSelected("-");
    	   $('#utrdRmkPop').val("");
       });

	};

	//request 성공시
    function successCallback(response, flag){ 
    	if (flag == 'searchList') {
			$('#'+gridId).alopexGrid('dataSet', response );
			cflineHideProgressBody();
    	}
    	
    	if (flag == 'updateLnAvlbTrmnBatchSaveInf') {
    		$a.close(response.returnCode);   
    	}
    }
    //request 실패시.
    function failCallback(response, flag){
    	if(flag == 'searchList'){
    		cflineHideProgressBody();
    		alertBox('I', "조회 실패 하였습니다.");
    	}
    	
    	if(flag == 'updateLnAvlbTrmnBatchSaveInf'){
	  		//cflineHideProgressBody();
	  		//alertBox('I', cflineMsgArray['abnormallyProcessed']); /*"정상적으로 처리되지 않았습니다.<br>관리자에게 문의하시기 바랍니다.;*/
    		$a.close(response.returnCode);   
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