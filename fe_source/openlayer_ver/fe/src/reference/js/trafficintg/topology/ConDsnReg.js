/**
 *
 * @author Administrator
 * @date 2023. 08. 21.
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
	var paramData = null;
	var numPortMax = 0;	// (2017-06-13 : HS Kim) 숫자포트 Max값

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(JSON.stringify(param).length > 2){
    		paramData = param;
    	}
    	setRegDataSet(param);//넘어온 데이터 세팅
    	setSelectCode();     //select 정보 세팅
        setEventListener();  //이벤트
    };

    /*-----------------------------*
     *  넘어온 데이터 세팅
     *-----------------------------*/
    function setRegDataSet(data) {

    	//국사코드가 넘어 왔으면 - 수정
		if(data.regYn == "Y"){
			$("#coverageIdReg").val(data.coverageId);
			$("#coverageTerrNmReg").val(data.coverageTerrNm);
			$("#mtsoNmReg").val(data.mtsoNm);
			$("#mtsoIdReg").val(data.mtsoId);
			$("#ldongCdReg").val(data.ldongCd);

			//button
			$("#btnMtsoSearch").setEnabled(false);
			$("#btnDel").show();
			$("#btnCopy").show();
			$("#covOpt").css("display", "");

			var param = {
            		ldongCd : data.ldongCd
            };
            httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getLdongAddr', param, 'GET', 'ldongAddr');
//            httpRequest('tango-transmission-tes-biz/transmisson/tes/topology/getLdongAddr', param, 'GET', 'ldongAddr');
    	}else{
        	$("#coverageIdReg").val("WC***********");
        	$("#btnDel").hide();
        	$("#btnCopy").hide();
        	$("#covOpt").css("display", "none");
    	}
    }

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode() {
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {

    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSave').on('click', function(e) {

    		 var param =  $("#covDsnRegForm").getData();

    		 if (param.mtsoId == "") {
  	    		//필수입력 항목입니다.[ 국사 ]
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption','기준 국사'), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		//저장하시겠습니까?
 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	covDsnReg();
 		        }
 		    });
         });

    	 $('#btnDel').on('click', function(e) {
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){

   		        if (msgRst == 'Y') {
   		        	covDsnDel();
   		        }
   		    });
         });

    	 //국사 조회
    	 $('#btnMtsoSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'MtsoLkup',
    	          	title: configMsgArray['findMtso'],
    	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
    	            //data: {autoSearchYn : "Y"},
    	            windowpopup: true,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	            height : 800,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	           		if(data != null && data != ''){
    	           			$('#mtsoIdReg').val(data.mtsoId);//국사ID
        	                $('#mtsoNmReg').val(data.mtsoNm);//국사명
        	                $('#ldongCdReg').val(data.ldongCd);//국사명

        	                var param = {
        	                		ldongCd : data.ldongCd
        	                };
        	                httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getLdongAddr', param, 'GET', 'ldongAddr');
//        	                httpRequest('tango-transmission-tes-biz/transmisson/tes/topology/getLdongAddr', param, 'GET', 'ldongAddr');
    	           		}
    	           	}
    	      });
         });

    	 $('#btnCopy').on('click', function(e) {

    		 var param =  $("#covDsnRegForm").getData();

    		 if (param.mtsoId == "") {
    			 //필수입력 항목입니다.[ 국사 ]
    			 callMsgBox('','W', makeArgConfigMsg('requiredOption','기준 국사'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if ((param.threshold < 0 || param.threshold > 500)
    			|| param.threshold == "") {
    			 callMsgBox('','W', '간소화 임계치는 0~500사이의 정수를 입력해주세요.', function(msgId, msgRst){});
    			 return;
    		 }

    		 //저장하시겠습니까?
    		 callMsgBox('','C', "선택한 커버리지를 복사하시겠습니까?", function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 covDsnCopy();
    			 }
    		 });
    	 });
	};

    /*-----------------------------*
     *  커버리지 등록
     *-----------------------------*/
    function covDsnReg() {

		 var param =  $("#covDsnRegForm").getData();
		 if(param.threshold != ""){
			 param.threshold = parseInt(param.threshold);
		 }

		 //장비정보
		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.frstRegUserId = userId; //등록자
		 param.lastChgUserId = userId; //변경자
    	 httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/coverageDsnReg', param, 'POST', 'coverageDsnReg');
//    	 httpRequest('tango-transmission-tes-biz/transmisson/tes/topology/coverageDsnReg', param, 'POST', 'coverageDsnReg');
    }
    /*-----------------------------*
     *  커버리지 삭제
     *-----------------------------*/
    function covDsnDel() {

    	var param =  $("#covDsnRegForm").getData();
    	httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/coverageDsnDel', param, 'POST', 'coverageDsnDel');
//    	httpRequest('tango-transmission-tes-biz/transmisson/tes/topology/coverageDsnDel', param, 'POST', 'coverageDsnDel');
    }

    function covDsnCopy() {

		 var param =  $("#covDsnRegForm").getData();
		 if(param.threshold != ""){
			 param.threshold = parseInt(param.threshold);
		 }

		 //장비정보
		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.frstRegUserId = userId; //등록자
		 param.lastChgUserId = userId; //변경자
		 httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/coverageDsnCopy', param, 'POST', 'coverageDsnCopy');
//		 httpRequest('tango-transmission-tes-biz/transmisson/tes/topology/coverageDsnCopy', param, 'POST', 'coverageDsnCopy');
	}

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'coverageDsnReg') {
    		if(response.Result == "Success"){
        		callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
        			   if (msgRst == 'Y') {
        				   $a.close();
        		       }
        		});
    		} else if(response.Result == "Use"){
    			callMsgBox('','I', configMsgArray['saveFail']+" (해당 국사의 커버리지 설계가 존재합니다.)" , function(msgId, msgRst){});
    		} else {
    			//저장을 실패 하였습니다.
        		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'coverageDsnDel') {
    		if(response.Result == "Success"){
    			callMsgBox('','I', configMsgArray['delSuccess'], function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close();
    				}
    			});
    		} else {
    			//저장을 실패 하였습니다.
    			callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'coverageDsnCopy') {
    		if(response.Result == "Success"){
        		callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
        			   if (msgRst == 'Y') {
        				   $a.close();
        		       }
        		});
    		} else if(response.Result == "Use"){
    			callMsgBox('','I', configMsgArray['saveFail']+" (해당 국사의 커버리지 설계가 존재합니다.)" , function(msgId, msgRst){});
    		} else {
    			//저장을 실패 하였습니다.
        		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'ldongAddr'){
    		$("#addrvalue").text(response.result.addrvalue);
    	}
    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'coverageDsnReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'coverageDsnDel'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'ldongAddr'){
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    };

    /*-----------------------------*
     *  HTTP
     *-----------------------------*/
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    };

});