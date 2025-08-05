/**
 * EpwrStcMgmtBatryRsltReg.js
 *
 * @author Administrator
 * @date 2018. 02. 28.
 * @version 1.0
 */
var sbeqpRtfDtl = $a.page(function() {
    //초기 진입점
	var paramData = null;
	var sbeqpId = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	sbeqpId = {"sbeqpId":param.sbeqpId};
    	setEventListener();
    	paramData = param;
        setRegDataSet(paramData);
        search();
    };

    function search(){
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpRtfMgmt',sbeqpId, 'GET', 'search');
    }

    function setRegDataSet(data) {
    	$(':input','#sbeqpMgmtRtfDtlLkupArea').val('');
    }
    function setSelectCode() {

    }
    function setEventListener() {

    	//장비수정
   	 	$('#btnModLkup').on('click', function(e) {
			var param =  $("#sbeqpMgmtRtfDtlLkupArea").getData();
			param.regYn = "Y";
			$a.navigate('/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do',param);
        });

   	 	//점검항목
   	 	$('#btnInspItm').on('click', function(e) {
			var param =  $("#sbeqpMgmtRtfDtlLkupArea").getData();
			param.regYn = "Y";
			$a.navigate('/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfInspItmReg.do',param);
        });

   	 	//방전시험
   	 	$('#btnDchgTest').on('click', function(e) {
   	 		var param =  $("#sbeqpMgmtRtfDtlLkupArea").getData();
   	 		param.regYn = "Y";
   	 		$a.navigate('/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfDchgTestReg.do',param);
   	 	});

    	//취소
   	 	$('#btnClose').on('click', function(e) {
   	 		$a.close();
        });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		var result = response.sbeqpRtfMgmtList[0];
    		if(result == null || result == "" || result == undefined){
    		}else{
	    		switch(result.engStdDivNo){
	    			case '1':
	    				result.engStdDivNo = '중심국(3H)';
	    				break;
	    			case '2':
	    				result.engStdDivNo = '중심국(4H)';
	    				break;
	    			case '3':
	    				result.engStdDivNo = 'DU집중국(3H)';
	    				break;
	    			case '4':
	    				result.engStdDivNo = 'DU집중국(4H)';
	    				break;
	    			case '5':
	    				result.engStdDivNo = '3G집중국';
	    				break;
	    			case '6':
	    				result.engStdDivNo = '기지국';
	    				break;
	    			case '7':
	    				result.engStdDivNo = '교환사옥';
	    				break;
	    			default:
	    				break;
	    		}
	    		switch(result.brRlesStatCd){
	    		case 'Y':
	    			result.brRlesStatCd = '완료';
	    			break;
	    		case 'N':
	    			result.brRlesStatCd = '미완료';
	    			break;
				default:
					break;
	    		}
	    		switch(result.rmsAcptStatCd){
	    		case 'Y':
	    			result.rmsAcptStatCd = '수용';
	    			break;
	    		case 'N':
	    			result.rmsAcptStatCd = '미수용';
	    			break;
	    		default:
	    			break;
	    		}
	    		switch(result.eqrstRfctStatCd){
	    		case 'Y':
	    			result.eqrstRfctStatCd = '완료';
	    			break;
	    		case 'N':
	    			result.eqrstRfctStatCd = '미완료';
	    			break;
	    		default:
	    			break;
	    		}
	    		switch(result.combMeansDivNo){
	    		case '1':
	    			result.combMeansDivNo = '단상';
	    			break;
	    		case '2':
	    			result.combMeansDivNo = '3상3선';
	    			break;
	    		case '3':
	    			result.combMeansDivNo = '3상4선';
	    			break;
	    		default:
	    			break;
	    		}
    		}
    		$('#sbeqpMgmtRtfDtlLkupArea').setData(result);
    	}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){


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