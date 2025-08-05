/**
 * EqpDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        setEventListener();
        setRegDataSet(param);
        httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/optlMdulMdlMgmt', param, 'GET', 'optlMdulMdlDtlInf');
    };

    function setRegDataSet(data) {


    }

    function setEventListener() {


    	$('#btnModLkup').on('click', function(e) {

    		 var param =  $("#searchForm").getData();
    		 param.regYn = 'Y' ;

    		 if (param.tmprCtrlYn == '유') param.tmprCtrlYn = 'Y';
    		 else if (param.tmprCtrlYn == '무') param.tmprCtrlYn = 'N';
    		 else param.tmprCtrlYn = '';

    		 if (param.barYn == '바코드') param.barYn = 'Y';
    		 else if (param.barYn == '비바코드') param.barYn = 'N';
    		 else param.barYn = '';


    		 //param.optlMdulMdlId = dataObj.optlMdulMdlId;
    		 /* 장비모델상세조회 	 */
     		 $a.popup({
        			popid: 'OptlMdulMdlEdit',
        			title: '광모듈모델수정',
        			url: '/tango-transmission-web/configmgmt/eqpmdlmgmt/OptlMdulMdlReg.do',
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 980,
        			height : 860,
        			callback: function(data) {
  	            	  if (data != null){
  	            		  var paramData = {optlMdulMdlId : data.optlMdulMdlId};
  	            		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/optlMdulMdlMgmt', paramData, 'GET', 'optlMdulMdlDtlInf');
  	            	  }
  			      }
        		});
           });
    	 $('#btnDelLkup').on('click', function(e) {

    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    		       //삭제한다고 하였을 경우
    		        if (msgRst == 'Y') {
    		        	optlMdulMdlDel();
    		        }
    		    });

           });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'optlMdulMdlDtlInf') {
    		$('#searchForm').formReset()
    		$('#searchForm').setData(response.optlMdulMdlMgmt[0]);

    	}
    	if(flag == 'OptlMdulMdlDel') {
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
 		       if (msgRst == 'Y') {
 		    	  response.optlMduldMdlDelYn = 'Y'
 		           $a.close(response);
 		       }
    		});

//    		var pageNo = $("#pageNo", parent.document).val();
//    		var rowPerPage = $("#rowPerPage", parent.document).val();
//
//            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");

    	}



    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpDel'){
    		//삭제를 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function optlMdulMdlDel() {
    	//tango transmission biz 모듈을 호출하여야한다.
		 var param =  $("#searchForm").getData();

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.useYn = 'N';
		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 if (param.tmprCtrlYn == '유') param.tmprCtrlYn = 'Y';
		 else if (param.tmprCtrlYn == '무') param.tmprCtrlYn = 'N';
		 else param.tmprCtrlYn = '';

		 if (param.barYn == '바코드') param.barYn = 'Y';
		 else if (param.barYn == '비바코드') param.barYn = 'N';
		 else param.barYn = '';

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/mergeOptlMdulMdlInf', param, 'POST', 'OptlMdulMdlDel');
    }

    $.fn.formReset = function() {

    	return this.each(function() {
    		var type = this.type,
    			tag = this.tagName.toLowerCase()
    		if (tag === "form") {
    			return $(":input", this).formReset()
    		}

    		if (type === "text" || type === "password" || type == "hidden" || tag === "textarea") {
    			this.value = ""
    		}
    		else if (type === "checkbox" || type === "radio") {
    			this.checked = false
    		}
    		else if (tag === "select") {
    			this.selectedIndex = -1
    		}
    	})
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