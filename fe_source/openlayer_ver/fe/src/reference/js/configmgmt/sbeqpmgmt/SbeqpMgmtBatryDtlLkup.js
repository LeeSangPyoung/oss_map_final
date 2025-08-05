/**
 * EpwrStcMgmtBatryRsltReg.js
 *
 * @author Administrator
 * @date 2018. 02. 28.
 * @version 1.0
 */
var sbeqpBatryDtl = $a.page(function() {
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
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryMgmt',sbeqpId, 'GET', 'search');
    }

    function setRegDataSet(data) {
    	$(':input','#sbeqpMgmtBatryDtlLkupArea').val('');
    }
    function setSelectCode() {

    }
    function setEventListener() {

    	//장비수정
   	 	$('#btnModLkup').on('click', function(e) {
			var param =  $("#sbeqpMgmtBatryDtlLkupArea").getData();
			param.regYn = "Y";
			$a.navigate('/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do',param);
        });

   	 	//점검항목
   	 	$('#btnInspItm').on('click', function(e) {
			var param =  $("#sbeqpMgmtBatryDtlLkupArea").getData();
			param.regYn = "Y";
			$a.navigate('/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryInspItmReg.do',param);
        });

   	 	//내부저항
   	 	$('#btnIntnRstn').on('click', function(e) {
   	 		var param =  $("#sbeqpMgmtBatryDtlLkupArea").getData();
   	 		param.regYn = "Y";
   	 		$a.navigate('/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryIntnRstnRsltReg.do',param);
   	 	});

    	//취소
   	 	$('#btnClose').on('click', function(e) {
   	 		$a.close();
        });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		var result = response.sbeqpBatryMgmtList[0];

    		$('#sbeqpMgmtBatryDtlLkupArea').setData(result);
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