/**
 * OpenTaskMtsoListPop
 *
 * @author Administrator
 * @date 2017. 9. 08.
 * @version 1.0
 */
var paramData = null;
var selectDataObj = null;
var returnTieMapping = [];
var gridMtsoPop = 'mtsoListPopGrid';
var tmofCd = "";
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
		paramData = param;
		tmofCd = nullToEmpty(paramData.tmofCd);
		$('#mtsoCdNmPop').val(nullToEmpty(paramData.mtsoCdNm));
		getTieGrid();
    	setSelectCode();
        setEventListener();  
 		if($('#jobTypeCdPopTie').val() =="" || $('#svlnSclCdPopTie').val() == ""){
// 			console.log($('#jobTypeCdPopTie').val());		
// 			console.log($('#svlnSclCdPopTie').val());		
 			$a.close('invalidParamValue');
 			return;
 		}
		if(tmofCd == ""){	
 			$a.close('noTmofCd');
		}else{
			searchMtsoPop('B');
		} 
    };
    

    //Grid 초기화
    var getTieGrid = function(response) {  
    	
			//그리드 생성
	        $('#'+gridMtsoPop).alopexGrid({
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		rowClickSelect : true,
	    		rowSingleSelect : true,
	    		numberingColumnFromZero: false,
	    		pager:false,  		
				height : 320,	
	        	message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
	    		},
			columnMapping: [ { selectorColumn : true, width : '50px' } 
				, {key : 'orgId'					,title : cflineMsgArray['mtsoCode'] /*  국사코드 */ ,align:'center', width: '100px'}
		        , {key : 'orgName'	            ,title : cflineMsgArray['mtsoName'] /* 국사명 */ ,align:'center', width: '200px'}
		        , {key : 'orgStatCdNm'	              	,title : cflineMsgArray['mtsoStatName'] /*  국사상태 */ ,align:'left'  , width: '100px'}                                           
			]}); 

    }         

    
    function setSelectCode() {

    }
    
    function setEventListener() { //	 	// 엔터 이벤트 
     	$('#searchMtsoPopForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			searchMtsoPop('S');
    			return false;
    		}
     	});	
	   	    	
	   	//조회 
	   	$('#btnPopMtsoSearch').on('click', function(e) {
	   		searchMtsoPop('S');   		
        });
    	   	
     	// 그리드 더블클릭
 		$('#'+gridMtsoPop).on('dblclick', '.bodycell', function(e){
 			 var dataObj = AlopexGrid.parseEvent(e).data;
			 //var element =  $('#' + gridMtsoPop).alopexGrid("dataGet", { _state : { selected : true }});
 			 var tmpList = [dataObj];
			 $a.close(tmpList);
	    });
 		
	};
	// 조회 처리
	function searchMtsoPop(gubun){
		var mtsoCdNm = nullToEmpty($('#mtsoCdNmPop').val());
		if(gubun=='S' || (gubun=='B' && mtsoCdNm.length>1)){
			if(mtsoCdNm.length < 2){
				alertBox('I', makeArgCommonMsg2("minLengthPossible", cflineMsgArray['mtsoName'], 2)); /* {0} 항목은 {1}자이상 입력가능합니다. */
				return;
			}
			var param =  {"tmofCd":tmofCd,"mtsoCdNm":mtsoCdNm} 
			//console.log(param);		
			cflineShowProgress(gridMtsoPop);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getselectmtsolist', param, 'GET', 'searchMtsoPop'); 
		}
		
	};
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'searchMtsoPop'){
    		cflineHideProgress(gridMtsoPop);
    		$('#'+gridMtsoPop).alopexGrid("dataSet", response.mtsoList);
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'searchMtsoPop'){
    		cflineHideProgress(gridMtsoPop);
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
  
});