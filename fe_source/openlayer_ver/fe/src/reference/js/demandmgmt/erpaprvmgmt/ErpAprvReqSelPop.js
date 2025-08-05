/**
 * ErpPriceList
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	//console.log(id,param);
    	getStdAfeDiv();
        
    	setEventListener();
    	$('#wbsId').setEnabled(false);
    	$('#afeYrPop').setEnabled(false);
    };
    

    function setEventListener() {
    	
    	//AFE 구분 콤보박스
        $('#afeYrPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.erpHdofcCd = dataParam.erpHdofcCdPop;
    		dataParam.baseAfeYr = $('#baseAfeYr').val();
    		dataParam.baseAfeDemdDgr = $('#baseAfeDemdDgr').val();
    		
    		selectAfeTsCodeByERP('afeDemdDgrPop', 'N', '', dataParam);
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/getWbsId', dataParam, 'GET', 'getWbsId');
        });
        
        //AFE 차수 콤보박스
        $('#afeDemdDgrPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.erpHdofcCd = dataParam.erpHdofcCdPop;
    		
    		selectComboCodeByErp('erpBizDivCdPop', 'N', '', dataParam);
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/getWbsId', dataParam, 'GET', 'getWbsId');
        });
        
        // 사업구분코드 변경 시 erp 사업유형 리스트 갱신해준다.
        $('#erpBizDivCdPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.erpHdofcCd = dataParam.erpHdofcCdPop;
    		
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectErpBizTypList', dataParam, 'GET', 'selectErpBizTypList');
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/getWbsId', dataParam, 'GET', 'getWbsId');
        });
        
     // 사업구분코드 변경 시 erp 사업유형 리스트 갱신해준다.
        $('#erpBizTypCd').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.erpHdofcCd = dataParam.erpHdofcCdPop;
    		
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/getWbsId', dataParam, 'GET', 'getWbsId');
        });
        
        $('#erpHdofcCdPop').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		dataParam.afeYr = dataParam.afeYrPop;
    		dataParam.afeDemdDgr = dataParam.afeDemdDgrPop;
    		dataParam.erpBizDivCd = dataParam.erpBizDivCdPop;
    		dataParam.erpHdofcCd = dataParam.erpHdofcCdPop;
    		
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/getWbsId', dataParam, 'GET', 'getWbsId');
        });
        
    	$('#btnAprv').on('click', function(e) {
    		
    		if($('#erpBizTypCd').val() == ""){
    			alertBox('I', 'ERP 사업유형은 필수입니다.');
    			return;
    		}
    		
    		callMsgBox('','C', demandMsgArray['requestErpApprove'], function(msgId, msgRst){     /*시설계획 업로드를 요청 하시겠습니까?*/
        		if (msgRst == 'Y') {
        			bodyProgress();      
        	    	var param = {
            				tempYn : "N",
            				afeYr : $('#afeYrPop').val(),
            				afeDemdDgr : $('#afeDemdDgrPop').val(),
            				erpHdofcCd : $('#erpHdofcCdPop').val(),
            				//demdBizDivCd : $('#demdBizDivCdPop').val(),
            				erpBizDivCd : $('#erpBizDivCdPop').val(),
            				//cstrClassCd : $('#cstrClassCdPop').val(),
            				cstrTypeCd : $('#cstrTypeCdPop').val(),
            				erpBizTypCd : $('#erpBizTypCd').val(),
            				wbsId : $('#wbsId').val()
            		}
        	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpaprvmgmt/upsertErpAprv', param, 'POST', 'upsertErpAprv');
        		}
        	});
	    });	

		/*$('#cstrClassCdPop').on('change', function(e) {
			selectComboCode('cstrTypeCdPop', 'N', 'C00619', '');
		});*/
		
		/*$('#cstrTypeCdPop').on('change', function(e) {
			var cstrClassCd = $('#cstrClassCdPop').val();

			if (cstrClassCd == 'eqp') {
				$('#cstrTypeCdPop').setEnabled(true);
			} else {
				$('#cstrTypeCdPop').val('1');
				$('#cstrTypeCdPop').setEnabled(false);
			}
		});*/
	};
	
	/*
	 * Function Name : getStdAfeDiv
	 * Description   : 기본afe차수 정보 취득
	 */
	function getStdAfeDiv() {
		
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getstdafediv'
				           , null
				           , 'GET'
				           , "getStdAfeDiv");		
	}
	
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
    	var nStart = new Date().getTime();
    	if(flag == 'upsertErpAprv'){
    		switch (response.result.resultMsg.pro){
    		case "OK" :
    			var nEnd = new Date().getTime();
    			var nDiff = nEnd - nStart;
    			nStart = new Date().getTime();
    			nEnd = new Date().getTime();
    			nDiff = nEnd - nStart;
    			
    			sendErpAprv();
    			
    			break;
    		case "FAIL" :
        		bodyProgressRemove();
        		alertBox('W', response.result.resultMsg);
    			break;
    		case "ERROR" :
        		bodyProgressRemove();
        		alertBox('W', demandMsgArray['systemError']);
    			break;
    		default :
    			break;
    		}
    	}
    	
    	if(flag == 'selectErpBizTypList'){
    		if(response.length > 0){
    			$('#erpBizTypCd').setData({data : response});
        		if(response.length > 1){
        			$('#erpBizTypCd').prepend('<option value="">' + demandMsgArray['mandatory'] + '</option>');  // 필수
        			$('#erpBizTypCd').setSelected("");
        		} else if(response.length == 1){
        			$('#erpBizTypCd').setSelected(response[0]);
        		}
    		}
    	}
    	
    	if(flag == 'getWbsId'){
    		$('#wbsId').val(response.result);
    	}
    	
    	if (flag == 'getStdAfeDiv') {
        	// 유선망 기본 afe년차
        	 $('#baseAfeYr').val(response[0].afeYr);
        	 $('#baseAfeDemdDgr').val(response[0].afeDemdDgr);
        	 
        	 setCombo();
    	}
    }
    
    
    //request 실패시.
    function failDemandCallback(response, flag){
		bodyProgressRemove();
		if (nullToEmpty(response.message) != '' && response.message != 'undefined') {
			alertBox('W', response.message);
		} else {
			alertBox('W', demandMsgArray['systemError']);
		}
		//console.log(response);
		if (flag == 'getStdAfeDiv') {
    		alertBox('W', demandMsgArray['failSearchAfeDemdDgr']);  /* 기준차수 취득에 실패했습니다. */
			return false;
    	} 
    }
    
    function sendErpAprv(){
    	bodyProgressRemove();
    	$a.close("OK");
    	
    }

    function setCombo(){
    	//AFE 구분 콤보박스
    	selectAfeYearCode('afeYrPop', 'N', $('#baseAfeYr').val());
    	// 사업구분 대
    	//selectYearBizCombo('demdBizDivCdPop', 'Y', '', 'C00618', '', 'TA');
    	//본부 콤보박스
    	selectComboCode('erpHdofcCdPop', 'N', 'C00623', '');
    	
    	//selectComboCodeByErp('erpBizDivCdPop', 'N', 'C00618', '');
    	//$('#cstrClassCdPop').setSelected("eqp");
    	//selectComboCode('cstrTypeCdPop', 'N', 'C00619', '');
    }
    
});