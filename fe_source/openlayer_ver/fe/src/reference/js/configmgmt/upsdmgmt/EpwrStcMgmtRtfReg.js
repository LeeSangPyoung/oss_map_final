/**
 * EpwrStcMgmtRtfReg.js
 *
 * @author Administrator
 * @date 2018. 02. 06.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var userId = 'testUser';
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	paramData = param
    	if(param.stat == 'add'){
    		$('#rtfMod').hide();
    		$('#rtfAdd').show();
    	}else if(param.stat == 'mod'){
    		$('#rtfAdd').hide();
    		$('#rtfMod').show();
    		setData(param)
    		$('#btnUpsdMtsoSearch').hide();
    	}
    	setEventListener();
    };

    function setData(param) {
    	$('#EpwrStcMgmtRtfRegForm').setData(param);

    }
    function setEventListener() {
    	//취소
    	 $('#btnRtfCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnRtfReg').on('click', function(e) {
    		 $('#frstRegUserId').val(userId);
    		 $('#lastChgUserId').val(userId);




    		// 입력 받은 값에 마지막에 숫자가 아닌 것이 들어간 경우 잘라낸다
    		 var strRInsVcurVal = $('#rInsVcurVal').val();

    		 for(var i=strRInsVcurVal.length; i > 0; i--){
    			 if( strRInsVcurVal[i-1] !='.') {
    				var strRInsVcurValTmp = strRInsVcurVal.substr(0,i);
    				$('#rInsVcurVal').val(strRInsVcurValTmp);
    				break;
    			 }
    		 }


    		 var strSInsVcurVal = $('#sInsVcurVal').val();

    		 for(var i=strSInsVcurVal.length; i > 0; i--){
    			 if( strSInsVcurVal[i-1] !='.') {
    				var strSInsVcurValTmp = strSInsVcurVal.substr(0,i);
    				$('#sInsVcurVal').val(strSInsVcurValTmp);
    				break;
    			 }
    		 }

    		 var strTInsVcurVal = $('#tInsVcurVal').val();

    		 for(var i=strTInsVcurVal.length; i > 0; i--){
    			 if( strTInsVcurVal[i-1] !='.') {
    				var strTInsVcurValTmp = strTInsVcurVal.substr(0,i);
    				$('#tInsVcurVal').val(strTInsVcurValTmp);
    				break;
    			 }
    		 }

    		 var strPrtVoltVal = $('#prtVoltVal').val();

    		 for(var i=strPrtVoltVal.length; i > 0; i--){
    			 if( strPrtVoltVal[i-1] !='.') {
    				var strPrtVoltValTmp = strPrtVoltVal.substr(0,i);
    				$('#prtVoltVal').val(strPrtVoltValTmp);
    				break;
    			 }
    		 }

    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#systmNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','시스템명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#mdlNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','모델명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#engStdDivVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','Eng기준'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfcMdulCapa').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfcMdulCnt').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','수량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#insVoltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfcMdulInsVoltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','입력전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rInsVcurVal').val() == '' || $('#sInsVcurVal').val() == '' || $('#tInsVcurVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','입력전류'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#prtVoltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','출력전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#prtVcurVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','출력전류'), function(msgId, msgRst){});
    			 return;
    		 }





    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rtfReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnRtfMod').on('click', function(e) {
    		 $('#lastChgUserId').val(userId);
    		// 입력 받은 값에 마지막에 숫자가 아닌 것이 들어간 경우 잘라낸다
    		 var strRInsVcurVal = $('#rInsVcurVal').val();

    		 for(var i=strRInsVcurVal.length; i > 0; i--){
    			 if( strRInsVcurVal[i-1] !='.') {
    				var strRInsVcurValTmp = strRInsVcurVal.substr(0,i);
    				$('#rInsVcurVal').val(strRInsVcurValTmp);
    				break;
    			 }
    		 }


    		 var strSInsVcurVal = $('#sInsVcurVal').val();

    		 for(var i=strSInsVcurVal.length; i > 0; i--){
    			 if( strSInsVcurVal[i-1] !='.') {
    				var strSInsVcurValTmp = strSInsVcurVal.substr(0,i);
    				$('#sInsVcurVal').val(strSInsVcurValTmp);
    				break;
    			 }
    		 }

    		 var strTInsVcurVal = $('#tInsVcurVal').val();

    		 for(var i=strTInsVcurVal.length; i > 0; i--){
    			 if( strTInsVcurVal[i-1] !='.') {
    				var strTInsVcurValTmp = strTInsVcurVal.substr(0,i);
    				$('#tInsVcurVal').val(strTInsVcurValTmp);
    				break;
    			 }
    		 }

    		 var strPrtVoltVal = $('#prtVoltVal').val();

    		 for(var i=strPrtVoltVal.length; i > 0; i--){
    			 if( strPrtVoltVal[i-1] !='.') {
    				var strPrtVoltValTmp = strPrtVoltVal.substr(0,i);
    				$('#prtVoltVal').val(strPrtVoltValTmp);
    				break;
    			 }
    		 }

    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#systmNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','시스템명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#mdlNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','모델명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#engStdDivVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','Eng기준'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfcMdulCapa').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','용량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfcMdulCnt').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','수량'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#insVoltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rtfcMdulInsVoltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','입력전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#rInsVcurVal').val() == '' || $('#sInsVcurVal').val() == '' || $('#tInsVcurVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','입력전류'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#prtVoltVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','출력전압'), function(msgId, msgRst){});
    			 return;
    		 }
    		 if($('#prtVcurVal').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','출력전류'), function(msgId, msgRst){});
    			 return;
    		 }

    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rtfReg();
    			 }
    		 });
    	 });

    	 //삭제
    	 $('#btnRtfDel').on('click', function(e) {
    		 /*    		 if($('#mtsoTypNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }*/
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 rtfDel();
    			 }
    		 });
    	 });

    	 // 입력 전류 R
    	 $('#rInsVcurVal').keyup(function(e) {
    		 if($('#rInsVcurVal').val() != "" ){
       		 var RInsVcurVal = $('#rInsVcurVal').val();

       		 var nResult = 0;
       		 var RuleInf = new RegExp("[^0-9\.]", "g")

       		RuleInf.test(RInsVcurVal);

       		 if(RuleInf.lastIndex > 0){
        			$('#rInsVcurVal').val("");
        		}

    		 }
    	 });

    	 // 입력 전류 S
    	 $('#sInsVcurVal').keyup(function(e) {
    		 if($('#sInsVcurVal').val() != "" ){
       		 var RInsVcurVal = $('#sInsVcurVal').val();

       		 var nResult = 0;
       		 var RuleInf = new RegExp("[^0-9\.]", "g")

       		RuleInf.test(RInsVcurVal);

       		 if(RuleInf.lastIndex > 0){
        			$('#sInsVcurVal').val("");
        		}

    		 }
    	 });

    	 // 입력 전류 T
    	 $('#tInsVcurVal').keyup(function(e) {
    		 if($('#tInsVcurVal').val() != "" ){
       		 var RInsVcurVal = $('#tInsVcurVal').val();

       		 var nResult = 0;
       		 var RuleInf = new RegExp("[^0-9\.]", "g")

       		RuleInf.test(RInsVcurVal);

       		 if(RuleInf.lastIndex > 0){
        			$('#tInsVcurVal').val("");
        		}

    		 }
    	 });

    	 // 출력 전압
    	 $('#prtVoltVal').keyup(function(e) {
    		 if($('#prtVoltVal').val() != "" ){
       		 var RInsVcurVal = $('#prtVoltVal').val();

       		 var nResult = 0;
       		 var RuleInf = new RegExp("[^0-9\.]", "g")

       		RuleInf.test(RInsVcurVal);

       		 if(RuleInf.lastIndex > 0){
        			$('#prtVoltVal').val("");
        		}

    		 }
    	 });

    	 //국사검색
    	 $('#btnUpsdMtsoSearch').on('click',function(e) {
    		 $a.popup({
   	          	popid: 'UpsdMtsoLkup',
   	          	title: configMsgArray['findMtso'],
   	            url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdMtsoLkup.do',
   	            modal: true,
                movable:true,
                windowpopup: true,
   	            width : 850,
   	           	height : 600,
   	           	callback : function(data) { // 팝업창을 닫을 때 실행
   	              $('#mtsoId').val(data.mtsoId);
   	              $('#intgFcltsCd').val(data.sisulCd);
   	              $('#mtsoNm').val(data.sisulNm);
   	              $('#mtsoTypNm').val(data.affairNm);
   	              $('#mtsoTypCd').val(data.affairCd);
   	           	}
   	      });
    	 })

    	 /*$("#idSelect").setOptions({
  			url : 'tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoSearch',
  			method : "get",
  			datatype: "json",
  			paramname : "mtsoNm",
  			minlength: 0,
  			before : function(id, option){
  			},
  			select : function(e){
  				var param = $('#idSelect').getSelectedData();
  				$('#mtsoTypNm').val(param.affairNm);
  				$('#mtsoTypCd').val(param.affairCd);
  			}
  		});*/
	};



	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'rtfReg'){
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			}
			var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:rtf.setGrid("+pageNo+","+rowPerPage+");");

		}
		if(flag == 'rtfDel') {
    		if(response.Result == "Success"){
    			//삭제 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    				if (msgRst == 'Y') {
    					$a.close();
    				}
    			});
    		}
    		var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:rtf.setGrid("+pageNo+","+rowPerPage+");");
    	}
		if(flag == 'getBatryInf') {
			var param = $('#EpwrStcMgmtRtfRegForm').getData();
			//모듈 용량 * 모듈 수량
			param.fcltsCapa = parseInt(param.rtfcMdulCapa) * parseInt(param.rtfcMdulCnt);
			//출력 전류 * 시설 용량
			if(param.fcltsCapa != 0){
				param.loadRate = ((parseInt(param.prtVcurVal) / param.fcltsCapa)*100).toFixed(1);
			}
			//(출력전류/70%/모듈 용량)
			param.rqrdCalCnt = Math.round(parseInt(param.prtVcurVal) / 0.7 / parseInt(param.rtfcMdulCapa)) + 1;

			param.rtfOvstCnt = parseInt(param.rtfcMdulCnt) - parseInt(param.rqrdCalCnt);

			if(response.length > 0){
				if(response[0].batryDistVal != 0){
					param.voltDropVal = ((35.6*(param.prtVcurVal*1.24)*response[0].batryDistVal)/(1000*param.cblTknsVal));
				}

				param.cblTknsVal = response[0].cblTknsVal;

				param.jarCnt = response[0].jarCnt;

				param.totCapa = response[0].totCapa;

				param.capaCoefVal = getCapaCoef(param.engStdDivVal,response[0].batryMdlNm);

				if(param.capaCoefVal == 2.875){
		    		param.rqrdCapa = Math.round(param.prtVcurVal*param.capaCoefVal*1.115);
		    	}else{
		    		param.rqrdCapa = Math.round(param.prtVcurVal*param.capaCoefVal);
		    	}

				param.batryOvstCapa = (param.totCapa - param.rqrdCapa);
				if(response[0].batryMdlNm == '리튬폴리머'){
					if(0 < param.batryOvstCapa/(param.totCapa*param.jarCnt)){
						param.ovstJarCnt = 0;
					}else{
						param.ovstJarCnt = -1;
					}
				}else{
					param.ovstJarCnt = param.batryOvstCapa/(param.totCapa*param.jarCnt);
					if(0 < param.ovstJarCnt){
						param.ovstJarCnt = Math.ceil(param.ovstJarCnt);
					}else{
						param.ovstJarCnt = Math.floor(param.ovstJarCnt);
					}
				}
				param.bkExptTime = param.totCapa * bkTime(param.capaCoefVal) / param.rqrdCapa ;
			}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveRtf', param, 'POST', 'rtfReg');
		}

	}
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'rtfReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function rtfReg(){
    	var param = $('#EpwrStcMgmtRtfRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBatryInf', param, 'GET', 'getBatryInf');

    }


    function rtfDel(){
    	var param = $('#EpwrStcMgmtRtfRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteRtf', param, 'POST', 'rtfDel');
    }

    function getCapaCoef(engStd,batryMdlNm){
    	if(batryMdlNm == '리튬폴리머'){
    		if(engStd == '중심국(3H)'){
        		return 3;
        	}else if(engStd == '중심국(4H)'){
        		return 4;
        	}else if(engStd == 'DU집중국(3H)'){
        		return 3;
        	}else if(engStd == 'DU집중국(4H)'){
        		return 4;
        	}else if(engStd == '3G집중국(1.5H)'){
        		return 3.5;
        	}else if(engStd == '교환사옥(2H)'){
        		return 2;
        	}else if(engStd == '기지국(1.5H)'){
        		return 1.5;
        	}
    	}else{
    		if(engStd == '중심국(3H)'){
        		return 4.87;
        	}else if(engStd == '중심국(4H)'){
        		return 6.94;
        	}else if(engStd == 'DU집중국(3H)'){
        		return 4.7;
        	}else if(engStd == 'DU집중국(4H)'){
        		return 6.91;
        	}else if(engStd == '3G집중국(1.5H)'){
        		return 2.875;
        	}else if(engStd == '교환사옥(2H)'){
        		return 4.74;
        	}else if(engStd == '기지국(1.5H)'){
        		return 2.875;
        	}
    	}
    }
    function bkTime(capaCoe){
    	if(capaCoe == 6.94){
    		return 4;
    	}else if(capaCoe == 4.87){
    		return 3;
    	}else if(capaCoe == 4.7){
    		return 3;
    	}else if(capaCoe == 4.74){
    		return 2;
    	}else if(capaCoe == 2.758){
    		return 1.5;
    	}else if(capaCoe == 3){
    		return 3;
    	}else if(capaCoe == 4){
    		return 4;
    	}else if(capaCoe == 2){
    		return 2;
    	}else{
    		return 1.5
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