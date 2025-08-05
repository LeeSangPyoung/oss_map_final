
/**
 * PopAddAfe.js
 *
 * @author P095783
 * @date 2016. 7. 11.
 * @version 1.0
 */
var flagYear = false;
var maxYear = null;
var nextYear = null;
var afeCnt = 0;

$a.page(function() {
	
	//그리드 ID
    var gridId = 'alGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setCombo();
    	setEventListener();
    };
    

  	//Grid 초기화
    function initGrid() {
		var mapping = [
			{
				width:'15px',
				key : 'check',
				selectorColumn : true
			}
			, {
				key : 'check',
				align:'center',
				width:'20x',
				title : demandMsgArray['sequence'] /*순번*/,
				numberingColumn : true
			}
    		, {
				key : 'afeYr',
				align:'center',
				width:'50px',
				title : demandMsgArray['afeYear'] /*AFE 연도*/,
			}
    		, {
				key : 'afeDemdDgr',
				align:'center',
				width:'50px',
				title : demandMsgArray['afeDegree'] /*AFE차수*/
			}
    		, {
				key : 'erpDemdDgr',
				align:'center',
				width:'50px',
				title : demandMsgArray['erpDegree'] /*ERP차수*/
			}
    		, {
				key : 'stdAfeDivYn',
				align:'center',
				width:'50px',
				title : demandMsgArray['standardDegreeYn'] /*기준차수여부*/,
			}
    		, {
				key : 'afeDesc',
				align:'center',
				width:'50px',
				title : demandMsgArray['description'] /*설명*/,
			}
		];
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	columnMapping : mapping,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : true,
			rowSingleSelect : true,
			numberingColumnFromZero : false,
			height : 250,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
      //그리드 행 클릭 이벤트
		$('#'+gridId).on("click",'.bodycell', function(e){
			
			var list = $('#'+gridId).alopexGrid( "dataGet", { _state : { selected : true } } );
			$('#afeYr').setSelected(list[0].afeYr);
			$('#afeDemdDgr').val(list[0].afeDemdDgr);
			$('#erpDemdDgr').val(list[0].erpDemdDgr);
			$('#stdAfeDivYn').setSelected(list[0].stdAfeDivYn);
			$('#afeDesc').val(list[0].afeDesc);
		});
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    function setCombo() {
    	//AFE 구분 콤보박스
    	selectAfeYearCode('sAfeYear', 'Y', '');
    	selectAfeYearCode('afeYr', 'N', '');
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/getmaxyear', '', 'GET', 'getMaxYear');
    }
    
    function searchList(sAfeYear){
    	$('#afeDemdDgr').val('');
		$('#erpDemdDgr').val('');
		$('#afeDesc').val('');
		$('#stdAfeDivYn').val('N');
    	var dataParam = {
    			sAfeYear : (nullToEmpty(sAfeYear) == '' ) ? $('#sAfeYear').val() : sAfeYear
    		};
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/afelist', dataParam, 'GET', 'search');
    }
    
    function saveCheck(){
    	
    	var date = new Date;
    	var currentYear = date.getFullYear();
    	
    	if( $("#afeYr").val() < currentYear){
    		callMsgBox('', 'W', demandMsgArray['addAfeNotice2'] ); /*당해년 이전의 데이터 수정은 관리자에게 문의 하십시오. */
    		return;
    	}
    	
    	var afeDemdDgrChk = $("#afeDemdDgr").val();
    	var erpDemdDgrChk = $("#erpDemdDgr").val();
    	
    	if(nullToEmpty(afeDemdDgrChk) =='') {
    		callMsgBox('', 'W', demandMsgArray['requiredDegree'] ); /*차수는 필수 사항 입니다.*/
    		return false;
    	} else if (nullToEmpty(erpDemdDgrChk) ==''){
    		callMsgBox('', 'W', demandMsgArray['requiredErpDegree'] ); /*ERP차수는 필수 사항 입니다.*/
    		return false;
    	} else if ((isNaN(afeDemdDgrChk) == true) || (afeDemdDgrChk.length >= 4) ){
    		callMsgBox('', 'W', demandMsgArray['requiredUnderThreeDecimalDegree'] ); /*차수는 3자리 이하 숫자만 입력 가능합니다.*/
    		$('#afeDemdDgr').val('');
    		return false;
    	} else if (afeDemdDgrChk.length == 2){
    		$('#afeDemdDgr').val("0" + $('#afeDemdDgr').val() );
    	} else if (afeDemdDgrChk.length == 1){
    		$('#afeDemdDgr').val("00" + $('#afeDemdDgr').val() );
    	} else if (erpDemdDgrChk.length >= 4 ){
    		callMsgBox('', 'W', demandMsgArray['requiredErpDegreeWarning1'] ); /*ERP차수는 영문 + 숫자 조합 3자리 이하만 입력 가능합니다.*/
    		$('#erpDemdDgr').val('');
    		return false;
    	} else if (erpDemdDgrChk.match(/[^a-zA-Z0-9]/) != null ){
    		callMsgBox('', 'W', demandMsgArray['requiredErpDegreeWarning1'] ); /*ERP차수는 영문 + 숫자 조합 3자리 이하만 입력 가능합니다.*/
    		return false;
    	}
    	saveAfe();
    }
    
    function saveAfe(){
    	/*"저장하시겠습니까?"*/
		callMsgBox('','C', demandMsgArray['save'], function(msgId, msgRst){
    		if (msgRst == 'Y') {
    			
    			// 기준차수 셋팅
    			/*if ( $('#stdAfeDivYn').val() == 'Y') {
    		  		  var stdData = {
    		  			  sAfeYear : $('#afeYr').val()
    		  		  };
    		  		  demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/stdsetting', stdData, 'GET', 'stdSetting');
    		  	  }*/
    				
    			  //저장
    			 bodyProgress();
    		  	  var dataParam = {
    		  			  sAfeYear : $('#afeYr').val()
    		  			  , sAfeDemdDgr : $('#afeDemdDgr').val()
    		  			  , erpDemdDgr : $('#erpDemdDgr').val()
    		  			  , stdAfeDivYn : $('#stdAfeDivYn').val()
    		  			  , afeDesc : $('#afeDesc').val()
    		  	  };
    		  	  demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/afeinsert', dataParam, 'GET', 'insert');
    		} 
		});
    }
   
    function deleteRow(){
    	var list = $('#'+gridId).alopexGrid( "dataGet", { _state : { selected : true } } );
    	if(list.length <= 0){
    		callMsgBox('', 'W', demandMsgArray['selectNoData'] ); /*선택된 데이터가 없습니다.*/
    		return;
    	}
    	var date = new Date;
    	var currentYear = date.getFullYear();
    	
    	if( list[0].afeYr < currentYear){
    		callMsgBox('', 'W', demandMsgArray['addAfeNotice2'] ); /*당해년 이전의 데이터 수정은 관리자에게 문의 하십시오.*/
    		return;
    	}
    	/*"삭제하시겠습니까?"*/
		callMsgBox('','C', demandMsgArray['delete'], function(msgId, msgRst){
    		if (msgRst == 'Y') {
   			   bodyProgress();
    			var dataParam = {
        				sAfeYear : list[0].afeYr
    					, afeDemdDgr : list[0].afeDemdDgr
    					, stdAfeDivYn : list[0].stdAfeDivYn
        		};
				demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/afedelete', dataParam, 'GET', 'delete');
    		}
		});
	}
    
    //다음년도 구하기
    function getNextYear (){
    	var date = new Date;
    	nextYear = date.getFullYear() + 1;
    }
    	
    function setEventListener() {
    	// 조회
    	 $('#btnSearch').on('click', function(e) {
    		 showProgress(gridId)
    		 searchList();
         });
    	
        // 저장
        $('#btnSave').on('click', function(e) {
        	saveCheck();
        });
        
        // 삭제
        $('#btnDelete').on('click', function(e) {
        	deleteRow();
        });
        
        // 다음년도 셋팅
        $('#afeYr').on('change', function(e) {
        	getNextYear();
        	if(flagYear == false && nextYear != maxYear ){
        		$('#afeYr').append($('<option>',{
            		value : nextYear,
        			text : nextYear
            	}));
        		flagYear = true;
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
    	  //.error();
    }
	
		
	//request 성공시
    function successDemandCallback(response, flag){
    	if(flag == 'search'){
    		hideProgress(gridId);
    		$('#'+gridId).alopexGrid("sortClear");
    		$('#'+gridId).alopexGrid("dataEmpty");
    		if(response!= null) {
        		$('#'+gridId).alopexGrid("dataSet", response.list);
    		}
    	}
    	    	
    	if(flag == 'insert'){
    		bodyProgressRemove();
			callMsgBox('', 'I', demandMsgArray['saveSuccess'] , function() {
				$('#afeDemdDgr').val('');
				$('#erpDemdDgr').val('');
				$('#afeDesc').val('');
				$('#stdAfeDivYn').val('N');
				selectAfeYearCode('sAfeYear', 'Y', $('#afeYr').val());
				searchList($('#afeYr').val());
			}); /*저장을 완료 하였습니다.*/
    	}
    	
    	if(flag == 'delete'){
    		bodyProgressRemove();
			selectAfeYearCode('sAfeYear', 'Y', '');
			if ( response.result ==0 ){
				callMsgBox('', 'W', demandMsgArray['afeDeleteWarning'] ); /*해당 차수의 수요혹은 Access망수요 정보가 존재합니다.*/
			}else {
				callMsgBox('', 'I', demandMsgArray['deleteSuccess'] , function() {
		    		$('#afeDemdDgr').val('');
					$('#erpDemdDgr').val('');
					$('#afeDesc').val('');
					searchList();
				}); /*삭제 하였습니다.*/
			}
			
    	}
    	
    	if(flag == 'getMaxYear'){
    		maxYear = response.maxYear;
    	}
    	
    	if(flag=='getAfeCnt'){
    		afeCnt = response.afeCnt;
    	}
    }
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	if(flag == 'search'){
    		callMsgBox('', 'W', demandMsgArray['searchFail'] ); /*조회 실패 하였습니다.*/
    	}
    	
    	if(flag == 'insert'){
    		bodyProgressRemove();
    		callMsgBox('', 'W', demandMsgArray['saveFail'] ); /*저장을 실패 하였습니다.*/
    	}
    	
    	if(flag == 'delete'){
    		bodyProgressRemove();
    		callMsgBox('', 'W', demandMsgArray['delFail'] ); /*삭제를 실패 하였습니다.*/
    	}
    }
});