/**
 * CardMdlReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

    //초기 진입점
	var paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	paramData = null;

    	if(param.regYn == "Y"){
    		paramData = param[0];
    	}

        setEventListener();
        setSelectCode();
        setRegDataSet(param[0]);
        httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwOhcpnChnlMgmt', param[0], 'GET', 'mwOhcpnChnlMgmt');

    };


    function setRegDataSet(data) {

    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }

    function setEventListener() {

    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });


    	//수정
    	 $('#btnModLkup').on('click', function(e) {

    		 var param =  $("#MwOhcpnChnlDtlLkupForm").getData();
    		 param.regYn = 'Y' ;

    		 $a.popup({
        			popid: 'MwInvtReg',
        			title: 'M/W 타사 채널 수정',
           			url: '/tango-transmission-web/configmgmt/engmgmt/MwOhcpnChnlReg.do',
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 790,
           			height : 300,
        			callback: function(data) {
    	            	  if (data != null){
    	            		  httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mwOhcpnChnlMgmt', data, 'GET', 'mwOhcpnChnlMgmt');
    	            	  }
    			      }
        		});
         });

    	 $('#btnDelLkup').on('click', function(e) {

    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){

      			if (msgRst == 'Y')
      				mwOhcpnChnlMgmtDel();
    			});

           });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){




    	if(flag == 'mwOhcpnChnlMgmt'){

			$('#MwOhcpnChnlDtlLkupForm').formReset();
			$('#MwOhcpnChnlDtlLkupForm').setData(response.mwOhcpnChnlMgmt[0]);

		}

		if(flag == 'mwOhcpnChnlMgmtDel' ){

			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
				$a.close();
			});

		}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpMdlReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function mwOhcpnChnlMgmtDel() {

    	var param =  $("#MwOhcpnChnlDtlLkupForm").getData();

    	var userId;

    	if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }


		param.useYn = 'N';
		param.frstRegUserId = userId;
		param.lastChgUserId = userId;

		httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/mergeMwOhcpnChnlMgmt', param, 'GET', 'mwOhcpnChnlMgmtDel');
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