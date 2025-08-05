/**
 * SbeqpReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
	var paramData = null;

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	if(param.regYn == "Y"){
    		paramData = param;
    	}
    	setDate();
    	setSelectCode();
        setEventListener();

        setRegDataSet(param);
    };

    function setDate() {
    	var date = new Date();
    	var year = date.getFullYear();
    	var month = date.getMonth()+1;
    	var day = date.getDate();

    	if((month+"").length < 2){
    		month = "0" + month;
    	}
    	if((day+"").length < 2){
    		day = "0" + day;
    	}
    	;
    	var Today = year + '-' + month + '-' + day;

    	$('#frstRegDateReg').val(Today);
    	$("#sbeqpMdlIdReg").val("SM********");
    }
    $('#sbeqpClCdReg').on('change', function(e) {
    	var sbeqpMdlIdReg = "SM"+param.sbeqpClCdReg+"*******";
    	$("#sbeqpMdlIdReg").val(sbeqpMdlIdReg);
      });
    function setEventListener() {

    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnMdlSaveReg').on('click', function(e) {

    		 var param =  $("#sbeqpRegForm").getData();
    		 param.sbeqpClCdReg = $("#sbeqpClCdReg").val();
    		 alert(JSON.stringify(param));
    		 //param.sbeqpMdlIdReg = "SM"+param.sbeqpClCdReg+"*******";
    		 if (param.sbeqpClCdReg == "") {
    	        //필수입력 항목입니다.[ 장비타입 ]
   		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['sbeqpmdlmgmtType']), function(msgId, msgRst){});
    	     	return;
    	     }

    		 if (param.sbeqpMdlIdReg == "") {
   	        	//필수입력 항목입니다.[ 부대장비모델ID ]
  		    	callMsgBox('','W', '부대장비모델ID를 입력해 주십시오.', function(msgId, msgRst){});
   	     		return;
   	     	 }

    		 if (param.sbeqpMdlNmReg == "") {
 	        	//필수입력 항목입니다.[ 부대장비모델명 ]
		    	callMsgBox('','W', '부대장비모델명을 입력해 주십시오.', function(msgId, msgRst){});
 	     		return;
 	     	 }

    		 if (param.sbeqpVendNmReg == "") {
 	    		//필수입력 항목입니다.[ 제조사 ]
 	    		 callMsgBox('','W', '제조사를 입력해 주십시오.', function(msgId, msgRst){});
 	     		return;
 	     	 }

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmdlmgmt/insertSbeqpMgmt', param, 'POST', 'SbeqpReg');

         });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
         });
	};


	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02406', null, 'GET', 'sbeqpClCdReg');
	}

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpReg') {
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close();
    				}
    			});

    			if(response.resultList.lnkgDatDivCd == "U" && response.resultList.eqpStatCd == "02"){
    				response.resultList.lnkgDatDivCd = "D";
    			}

    			param = response.resultList;
    			httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO001Send', param, 'POST', '');

    			var pageNo = $("#pageNo", parent.document).val();
    			var rowPerPage = $("#rowPerPage", parent.document).val();

    			$(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    		}else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}

    	}

    	if(flag == 'sbeqpClCdReg'){
    		$('#sbeqpClCdReg').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#sbeqpClCdReg').setData({
                 data:option_data,
    		});
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function setRegDataSet(data) {
    	if(data.regYn == 'Y'){

    	}
    }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
              });
        }

    function popupList(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7
              });
        }

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback)
    }

});