/**
 * CifMtsoAdtnDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.

	var paramData = null;

    this.init = function(id, param) {
    	setEventListener();
        setRegDataSet(param);
        paramData = param;
    };

    function setRegDataSet(data) {
    	$("#mtsoId").val(data.mtsoId);
    	if(data.autoSearchYn == "Y"){
    		data.page = 1;
    		data.rowPerPage = 100;
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoAdtnList', data, 'GET', 'search');
        }else{
        	$('#cifMtsoAdtnDtlLkupArea').setData(data);
        }
    	
    	//2023 통합국사 고도화 - 통합국사 관리권한 소유자만  등록/수정 가능
    	if($("#adtnAttrVal").val().indexOf('CIF_MTSO_APRV_A') > 0){
    		$("#btnModLkup").show();
		}else{
			$("#btnModLkup").hide();
		}
    }


    function setEventListener() {



    	//수정
   	 $('#btnModLkup').on('click', function(e) {
		var param =  $("#cifMtsoAdtnDtlLkupForm").getData();
		param.regYn = "Y";
		param.autoSearchYn = "";
   		$a.navigate('/tango-transmission-web/configmgmt/common/CifMtsoAdtnReg.do',param);

     });


   	 //닫기
   	 $('#btnClose').on('click', function(e) {
          	//tango transmission biz 모듈을 호출하여야한다.
     		 $a.close();
          });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {

    		$('#cifMtsoAdtnDtlLkupArea').setData(response.cifMtsoAdtnList[0]);
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