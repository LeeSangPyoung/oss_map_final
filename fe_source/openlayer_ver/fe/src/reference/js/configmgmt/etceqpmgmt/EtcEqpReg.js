/**
 * EqpReg.js
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

    	setEventListener();
        setSelectCode();
        setRegDataSet(param);

    };


    function setRegDataSet(data) {

    	if(data.regYn == "Y"){
    		$('#btnEqpMdlSearch').hide();
        	$('#lnkgSystmCdReg').setEnabled(false);
        	$('#regYn').val("Y");

        	if(data.lnkgSystmCd == "RTF"){
        		$('#btnRrsDtlInfMgmtReg').setEnabled(false);
        	}else if(data.lnkgSystmCd == "RRS"){
        		document.getElementById('rtfReg').style.display="none";
        	}

        	$('#etcEqpRegArea').setData(data);
    	}else{
    		$('#btnEtcEqpLnkgInfReg').setEnabled(false);
        	$('#btnRrsDtlInfMgmtReg').setEnabled(false);
//    		$('#etcEqpRegArea').clear();
    	}

    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		//관리팀 조회
	   	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpMgmtTeamGrp', null, 'GET', 'mgmtTeamOrgId');
    	//장비 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCdReg');
    	//축전지충전유형코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00292', null, 'GET', 'batryCrgTypCdReg');
    }

    function setEventListener() {

    	//목록
    	 $('#btnPrevReg').on('click', function(e) {
    		 $a.close();
          });

    	//기타장비연동정보
    	 $('#btnEtcEqpLnkgInfReg').on('click', function(e) {
    		 var param =  $("#etcEqpRegForm").getData();
    		 $a.popup({
 	          	popid: 'EtcEqpLnkgInfReg',
 	          	title: '기타 장비 연동 정보 등록',
// 	              url: $('#ctx').val()+'/configmgmt/etceqpmgmt/EtcEqpLnkgInfReg.do',
 	              url: $('#ctx').val()+'/configmgmt/equipment/EqpLnkgInfReg.do',
 	              data: param,
 	              iframe: false,
 	              modal: true,
 	              movable:true,
 	              width : 865,
 	              height : window.innerHeight * 0.8
 	          });
         });

    	 //정류기상세
    	 $('#btnRtfDtlInfMgmtReg').on('click', function(e) {
    		 var param =  $("#etcEqpRegForm").getData();
    		 popup('RtfDtlInfMgmt', $('#ctx').val()+'/configmgmt/etceqpmgmt/RtfDtlInfMgmt.do', '정류기 상세 정보', param);
         });

    	//DCN상세
    	 $('#btnDcnDtlInfMgmtReg').on('click', function(e) {
    		 var param =  $("#etcEqpRegForm").getData();
    		 popupList('DcnDtlInfMgmt', $('#ctx').val()+'/configmgmt/etceqpmgmt/DcnDtlInfMgmt.do', 'DCN 상세 정보', param);
         });

    	//RRS상세
    	 $('#btnRrsDtlInfMgmtReg').on('click', function(e) {
    		 var param =  $("#etcEqpRegForm").getData();
    		 popupList('RrsDtlInfMgmt', $('#ctx').val()+'/configmgmt/etceqpmgmt/RrsDtlInfMgmt.do', 'RRS 상세 정보', param);
         });

    	 //장비구분
    	 $('#lnkgSystmCdReg').on('change', function(e) {
    		if($('#lnkgSystmCdReg').val() == "RTF"){
	    		document.getElementById('rtfReg').style.display="block";
	    	}else{
	    		document.getElementById('rtfReg').style.display="none";
	    	}
    	 });

    	//장비모델 조회
    	 $('#btnEqpMdlSearch').on('click', function(e) {
    		 var param;
    		 if($('#lnkgSystmCdReg').val() == "RTF"){
    			 param = {"eqpRoleDivCd":"22"};
                 $('#eqpRoleDivCdReg').val("22");
    		 }else{
    			 param = {"eqpRoleDivCd":"09"};
    			 $('#eqpRoleDivCdReg').val("09");
    		 }

    		 $a.popup({
    	          	popid: 'EqpMdlLkup',
    	          	title: '장비모델조회',
    	            url: $('#ctx').val()+'/configmgmt/equipment/EqpMdlLkup.do',
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.67,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#eqpMdlNmReg').val(data.eqpMdlNm);
    	                $('#eqpMdlIdReg').val(data.eqpMdlId);
    	                //setEqpMdlId(data.lcl);
    	                $("#eqpIdReg").val("DV***********");
    	           	}
    	      });
         });

    	 //국사 조회
    	 $('#btnMtsoSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'MtsoLkup',
    	          	title: '국사조회',
    	            url: $('#ctx').val()+'/configmgmt/common/MtsoLkup.do',
//    	            data: {autoSearchYn : "Y"},
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.8,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#eqpInstlMtsoNmReg').val(data.mtsoNm);
    	                $('#eqpInstlMtsoNmReg2').val(data.mtsoNm);
    	                $('#eqpInstlMtsoIdReg').val(data.mtsoId);
    	                $('#eqpTmofReg').val(data.tmofNm);
    	                $('#bldAddrReg').val(data.bldAddr);
    	                $('#jrdtTeamOrgIdReg').setData({
    	                	jrdtTeamOrgId:data.teamId
    	        		});
    	           	}
    	      });
         });

    	//바코드조회
    	 $('#btnBarNoSearch').on('click', function(e) {

    		 if ($('#eqpInstlMtsoIdReg').val() == "") {
  	    		//필수입력 항목입니다.[ 국사 ]
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 var param =  {"sisulGbn": "mtso"
		    			 , "sisulCd": $('#eqpInstlMtsoIdReg').val()
		    			 , "sisulNm": $('#eqpInstlMtsoNmReg').val()
    			 		 , "namsMatlCd": $('#eqpInstlMtsoIdReg').val()
    			 		 , "namsMatlNm": $('#eqpInstlMtsoNmReg').val()};
    		 $a.popup({
    	          	popid: 'BarcodeInfoListPop',
    	          	title: '바코드조회',
    	            url: $('#ctx').val()+'/configmgmt/shpmgmt/BarcodeInfoListPop.do',
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 1300,
    	           	height : window.innerHeight * 0.8,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#barNoReg').val(data);
    	           	}
    	      });
         });

    	 $('#u1gpMnftYmReg').keyup(function(e) {
 	 		if(!$("#u1gpMnftYmReg").validate()){
	   			//1조 제조년월(yymm)는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',"1조 제조년월(yymm)"), function(msgId, msgRst){});
	   			$('#u1gpMnftYmReg').val("");
	   			 return;
	   		};
	 	 });

	 	 $('#u2gpMnftYmReg').keyup(function(e) {
	 	 		if(!$("#u2gpMnftYmReg").validate()){
		   			//2조 제조년월(yymm)는 숫자만 입력 가능합니다.
		   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',"2조 제조년월(yymm)"), function(msgId, msgRst){});
		   			$('#u2gpMnftYmReg').val("");
		   			 return;
		   		};
	 	 });

	 	 $('#u3gpMnftYmReg').keyup(function(e) {
	 	 		if(!$("#u3gpMnftYmReg").validate()){
		   			//3조 제조년월(yymm)는 숫자만 입력 가능합니다.
		   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',"3조 제조년월(yymm)"), function(msgId, msgRst){});
		   			$('#u3gpMnftYmReg').val("");
		   			 return;
		   		};
	 	 });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

    	//저장
    	 $('#btnSaveReg').on('click', function(e) {

    		 var param =  $("#etcEqpRegForm").getData();

    		 if (param.eqpNm == "") {
    	       	//필수입력 항목입니다.[ 장비명 ]
   		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['equipmentName']), function(msgId, msgRst){});
    	     	return;
    	     }

             if (param.eqpMdlId == "") {
	    		//필수입력 항목입니다.[ 장비모델 ]
	    		 callMsgBox('','W', makeArgConfigMsg('required'," 장비모델 "), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.eqpInstlMtsoId == "") {
	    		//필수입력 항목입니다.[ 국사 ]
	    		 callMsgBox('','W', makeArgConfigMsg('required'," 국사 "), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.eqpStatCd == "") {
  	     	    //필수입력 항목입니다. [ 장비상태 ]
  	     		callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['equipmentStatus']), function(msgId, msgRst){});
  	     		return;
  	     	 }

	    	 /*if (param.barNo == "") {
	    		//필수입력 항목입니다. [ 바코드 ]
	    		 callMsgBox('','W', makeArgConfigMsg('required'," 바코드 "), function(msgId, msgRst){});
	     		return;
	     	 }*/

	    	 /*var u1gpMnftYmRegLeng = $('#u1gpMnftYmReg').val().length;

			 if( u1gpMnftYmRegLeng > 0 && u1gpMnftYmRegLeng != 4 ){
			     //날짜 형식이 틀립니다. [YYMM]
		    	 callMsgBox('','W', makeArgConfigMsg('dateFormat',"1조 제조년월:YYMM"), function(msgId, msgRst){});
		    	 $('#u1gpMnftYmReg').focus();
		    	 return;
		    	}

	    	 var u2gpMnftYmRegLeng = $('#u2gpMnftYmReg').val().length;

			 if( u2gpMnftYmRegLeng > 0 && u2gpMnftYmRegLeng != 4 ){
			     //날짜 형식이 틀립니다. [YYMM]
		    	 callMsgBox('','W', makeArgConfigMsg('dateFormat',"2조 제조년월:YYMM"), function(msgId, msgRst){});
		    	 $('#u2gpMnftYmReg').focus();
		    	 return;
		    	}

	    	 var u3gpMnftYmRegLeng = $('#u3gpMnftYmReg').val().length;

			 if( u3gpMnftYmRegLeng > 0 && u3gpMnftYmRegLeng != 4 ){
			     //날짜 형식이 틀립니다. [YYMM]
		    	 callMsgBox('','W', makeArgConfigMsg('dateFormat',"3조 제조년월:YYMM"), function(msgId, msgRst){});
		    	 $('#u3gpMnftYmReg').focus();
		    	 return;
		    	}*/



 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	etcEqpReg();
 		        }
 		      });
         });
    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'EtcEqpReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		});
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();

            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}

    	if(flag == 'batryCrgTypCdReg'){

    		$('#batryCrgTypCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#batryCrgTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#batryCrgTypCdReg').setData({
    	             data:option_data,
    	             eqpStatCd:paramData.eqpStatCd
    			});
    		}
    	}

    	if(flag == 'eqpStatCdReg'){

    		$('#eqpStatCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#eqpStatCdReg').setData({
    	             data:option_data
    			});
    			$('#eqpStatCdReg').setSelected("01");
    		}
    		else {
    			$('#eqpStatCdReg').setData({
    	             data:option_data,
    	             eqpStatCd:paramData.eqpStatCd
    			});
    		}
    	}

    	if(flag == 'mgmtTeamOrgId'){

    		$('#jrdtTeamOrgIdReg').clear();
    		$('#opTeamOrgIdReg').clear();

    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#jrdtTeamOrgIdReg').setData({
   	             data:option_data
    			});

    			$('#opTeamOrgIdReg').setData({
      	             data:option_data
       			});
    		}
    		else {
    			$('#jrdtTeamOrgIdReg').setData({
    	             data:option_data,
    	             jrdtTeamOrgId:paramData.jrdtTeamOrgId
    			});

    			$('#opTeamOrgIdReg').setData({
   	             data:option_data,
   	             opTeamOrgId:paramData.opTeamOrgId
    			});
    		}
    	}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'EqpReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function etcEqpReg() {

		 var param =  $("#etcEqpRegForm").getData();

		 if(param.eqpAutoRegYn == "YES"){
			 param.eqpAutoRegYn = "Y";
		 }else{
			 param.eqpAutoRegYn = "N";
		 }

		 if(param.dablMgmtYn == "YES"){
			 param.dablMgmtYn = "Y";
		 }else{
			 param.dablMgmtYn = "N";
		 }

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

    	 if($('#regYn').val() == "Y"){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/etceqpmgmt/updateEtcEqpInfo', param, 'POST', 'EtcEqpReg');
    	 }else{
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/etceqpmgmt/insertEtcEqpInfo', param, 'POST', 'EtcEqpReg');
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

    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }*/

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