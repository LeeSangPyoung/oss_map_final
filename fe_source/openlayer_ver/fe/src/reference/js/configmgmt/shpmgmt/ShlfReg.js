/**
 * ShlfReg.js
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
    	$('.reg_display_opt').css("display","none");

    	//alert(param.regYnShlf);
    	if(param.regYnShlf == "Y"){
    		paramData = param;
    	}
//    	document.getElementById('shlfDtlTab').click();
        setEventListener();
        setSelectCode();
        setRegDataSet(param);

    };


    function setRegDataSet(data) {

		$('#regYnShlf').val("");

    	if(data.regYnShlf == "Y"){  //수정
    		//$('#btnDelDtl').setEnabled(true);
        	//document.getElementById('btnDelDtl1').style.display="block";

    		initData();//항목 초기화
    		document.getElementById('regBtnArea').style.display="none";
        	$('#regYnShlf').val("Y"); //수정
        	$('#shlfRegArea').setData(data);
        	$('#rackListShlf').setEnabled(false); //rack 변경 불가
        	$('#btnEqpSearch2').hide();  //장비 변경 불가

        	var eqpId = $('#eqpIdShlf').val();
        	if(eqpId != ""){
        	//Rack 항목에 선택한 장비에 해당하는 rack 리스트업
               httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regRackList/'+eqpId, null, 'GET', 'regRackList');
        	}

        	$('#eqpIdOld').val(eqpId);
        	var rackNoOld = $('#rackNo').val();
        	$('#rackNoOld').val(rackNoOld);

    	}else{
        	//$('#eqpIdShlf').val('');
        	//$('#eqpNmShlf').val('');
    		//장비 선택 전 rack 리스트는 없음
    		var eqpId = null;
    		if(data.fromShlfReg == "Y"){
    			$('#shlfRegArea').setData(data);
    			eqpId = $('#eqpIdShlf').val();
    		}
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regRackList/'+eqpId, null, 'GET', 'regRackList');
    		/*
    		var option_data =  [{rackNo: "", rackNm: "선택"}];
    		$('#rackList').setData({
                 data:option_data
    		});
    		*/

    	}
    }

    function initData() {
    	$('#eqpIdShlf').val("");
    	$('#eqpNmShlf').val("");
    	$('#rackNo').val("");
    	//$('#rackList').clear();
    	$('#shlfNo').val("");
    	$('#shlfNm').val("");
    	$('#shlfTyp').clear();
    	$('#shlfTypCd').val("");
    }
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	//Shelf유형 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shlfTypCdList', null, 'GET', 'shlfTypCdList');

    	//사용여부 세팅
    	$('#shlfUse').clear();
    	var option_data =  [{shlfUseYn: "Y", shlfUseYnNm: "사용"},{shlfUseYn: "N", shlfUseYnNm: "미사용"}];
    	var shlfUseYnCd = '';

    	if(paramData == '' || paramData == null) {
			$('#shlfUse').setData({
	             data:option_data
			});
		}else {
			if(paramData.shlfUseYn == "사용"){
				shlfUseYnCd = "Y";
			}else{
				shlfUseYnCd = "N";
			}
    		$('#shlfUse').setData({
    			data:option_data,
    			shlfUseYn:shlfUseYnCd
			});
		}

    }

    function setEventListener() {

    	//장비 조회
   	 	$('#btnEqpSearch2').on('click', function(e) {
	   		 $a.popup({
	   	          	popid: 'EqpLkup',
	   	          	title: '장비조회',
	   	            //url: $('#ctx').val()+'/configmgmt/equipment/EqpLkup.do',
	   	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
	   	            modal: true,
                    movable:true,
	   	            width : 950,
	   	           	height : window.innerHeight * 0.83,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행

	   	           		if (data.adamsMdlYn == 'Y')  {
	   	           			callMsgBox('','I', "SKB 장비중 ADAMS 연동 모델은 선택 할 수 없습니다.", function(msgId, msgRst){});
	   	           		} else {
	   	           		if(data.portPveRegIsolYn == 'Y'){ // [20171019]

		   	           		setEnableObjByPortPveReg(false);

		   	   		        alertBox('W','수동등록 할 수없는 모델입니다.');
		   	   		        return;

		   	           	} else {

		   	           		setEnableObjByPortPveReg(true);

		   	                $('#eqpNmShlf').val(data.eqpNm);
		   	                $('#eqpIdShlf').val(data.eqpId);

		   	                //Rack 항목에 선택한 장비에 해당하는 rack 리스트업
		   	                httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/regRackList/'+data.eqpId, null, 'GET', 'regRackList');
		   	           	}
	   	           		}


	   	            }
	   	      });
        });

	   	 /* [20171019] */
	   	 function setEnableObjByPortPveReg(enable){
	   		 $('#btnRegRack2').setEnabled(enable);
	   		 $('#btnRegCard2').setEnabled(enable);
	   		 $('#rackListShlf').setEnabled(enable);
	   		 $('#shlfNo').setEnabled(enable);
	   		 $('#shlfNm').setEnabled(enable);
	   		 $('#shlfTyp').setEnabled(enable);
	   		 $('#shlfUse').setEnabled(enable);
	   		 $('#btnSaveReg2').setEnabled(enable);

             if(!enable){
                $('#rackListShlf').setSelected('');
                $('#shlfTyp').setSelected('');
                $('#shlfUse').setSelected('');
                $('#shlfNo').val('');
                $('#shlfNm').val('');
            }
	   	 }
	   	 /*_[20171019] */

   	 	//rack 선택 시 shelf 리스트 초기화
   	 	$('#rackListShlf').on('click', function(e) {

   	 		if($('#eqpIdShlf').val() == ""){
   	 			//필수입력 항목입니다. [ 장비 ]
 	   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
   	 		}else{
	   	 		//rack 값 세팅
	   	 		var rackNoNew = $('#rackListShlf').val();
	   	 		$('#rackNoNew').val(rackNoNew);
	   	 		$('#rackNo').val(rackNoNew);
   	 		}

        });

   	 	//shelf유형 선택 시 값 세팅
   	 	$('#shlfTyp').on('click', function(e) {
   	 		var shlfTypCd = $('#shlfTyp').val();
   	 		$('#shlfTypCd').val(shlfTypCd);
        });

	   	 //Rack등록, Card등록 버튼 클릭
   	 	 $('#btnRegRack2').on('click', function(e) {
   	 		$a.close();
   	 		dataParam = {"regYnRack" : "N", "fromRackReg":"Y", "eqpId": $('#eqpIdShlf').val(), "eqpNm": $('#eqpNmShlf').val()};
	   	 	//popup('RackReg', $('#ctx').val()+'/configmgmt/shpmgmt/RackReg.do', '형상 Rack 등록', dataParam);
	   	    popup('RackReg', '/tango-transmission-web/configmgmt/shpmgmt/RackReg.do', '형상 Rack 등록', dataParam);
	   	 });

  		 $('#btnRegCard2').on('click', function(e) {
  			$a.close();
  			dataParam = {"regYnCard" : "N", "fromCardReg":"Y", "eqpId": $('#eqpIdShlf').val(), "eqpNm": $('#eqpNmShlf').val()};
//	   	 	popup('CardReg', $('#ctx').val()+'/configmgmt/shpmgmt/CardReg.do', '형상 Card 등록', dataParam);
		   	 $a.popup({
	           	popid: 'CardReg',
	           	title: '형상 Card 등록',
	               //url: $('#ctx').val()+'/configmgmt/shpmgmt/CardReg.do',
	               url: '/tango-transmission-web/configmgmt/shpmgmt/CardReg.do',
	               data: dataParam,
	               iframe: false,
	               modal: true,
	               movable:true,
	               width : 865,
	               height : window.innerHeight * 0.7
	           });
	   	 });

    	//삭제
  		 /*
	   	 $('#btnDelDtl2').on('click', function(e) {
	        	//tango transmission biz 모듈을 호출하여야한다.
	 			  callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
			       //삭제한다고 하였을 경우
			        if (msgRst == 'Y') {
			         shlfDel();
			        }
			      });
        });
	   	 */

    	/*
    	//목록
    	 $('#btnPrevReg').on('click', function(e) {
     		 $a.navigate($('#ctx').val()+'/configmgmt/shpmgmt/ShpMgmt.do');
          });

    	//형상 정보 조회
	   	 $('#btnShpInfLkupReg').on('click', function(e) {
    		 popupList('btnShpInfLkupReg', $('#ctx').val()+'/configmgmt/shpmgmt/ShpInfLkup.do', '형상 정보 조회');
         });
         */

    	//취소
    	 $('#btnCnclReg2').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveReg2').on('click', function(e) {
    		 //alert($('#rackNoOld').val());
    		 //alert($('#rackNo').val());
    		 //alert($('#rackNoNew').val());
    		 //var rackNm =  $("#rackList option:selected").text();

    		 if($('#eqpNmShlf').val() == '' || $('#rackListShlf').val() == '' || $('#shlfNm').val() == ''){
	    		 if($('#eqpNmShlf').val() == ''){
	    			//필수입력 항목입니다. [ 장비 ]
		 	   		callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
	    		 }else if($('#rackListShlf').val() == ''){
	    			//필수 선택 항목입니다.[ Rack명 ]
		 	   	 	callMsgBox('','W', makeArgConfigMsg('requiredOption'," Rack명 "), function(msgId, msgRst){});
	    		 }else if($('#shlfNm').val() == ''){
	    			//필수입력 항목입니다. [ Shelf명 ]
			 	   	callMsgBox('','W', makeArgConfigMsg('required'," Shelf명 "), function(msgId, msgRst){});
	    		 }
    		 }else{

	 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
	 		       //저장한다고 하였을 경우
	 		        if (msgRst == 'Y') {
	 		        	shlfReg();
	 		        }
	 		      });
    		 }
         });


    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'ShlfReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		});

    		param = response.resultList;
    		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO003Send', param, 'POST', '');

//    		$a.navigate($('#ctx').val()+'/configmgmt/shpmgmt/ShpMgmt.do');
    		var pageNo = $("#pageNoDtl", parent.document).val();
    		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

            $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridShlf','1','100');");
    	}
    	if(flag == 'ShlfUpt') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    			if (msgRst == 'Y') {
 		           $a.close();
 		       }
    		});

    		param = response.resultList;
    		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO003Send', param, 'POST', '');

//    		$a.navigate($('#ctx').val()+'/configmgmt/shpmgmt/ShpMgmt.do');
    		var pageNo = $("#pageNoDtl", parent.document).val();
    		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

            $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridShlf','1','100');");
    	}
    	if(flag == 'ShlfDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		 });
//    		$a.navigate($('#ctx').val()+'/configmgmt/shpmgmt/ShpMgmt.do');
    		var pageNo = $("#pageNoDtl", parent.document).val();
    		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

            $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridShlf','1','100');");
    	}

    	if(flag == 'shlfTypCdList'){

    		$('#shlfTyp').clear();

    		var option_data =  [{shlfTypCd: "", shlfTypNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#shlfTyp').setData({
    	             data:option_data
    			});
    		}else {
    			$('#shlfTyp').setData({
    	             data:option_data,
    	             shlfTypNm:paramData.shlfTypNm
    			});
    		}
    	}


    	if(flag == 'regRackList'){

    		$('#rackListShlf').clear();

    		var option_data =  [{rackNo: "", rackNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#rackListShlf').setData({
    	             data:option_data
    			});
    		}else {
    			$('#rackListShlf').setData({
    	             data:option_data,
    	             rackNo:paramData.rackNo
    			});
    		}

    	}

    	//장비ID 생성
    	if(flag == 'eqpIdReg'){

    		$("#eqpIdReg").val(response.eqpId);
    	}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'ShlfReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'ShlfUpt'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'ShlfDel'){
    		//삭제을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function shlfReg() {
    	var param =  $("#shlfRegForm").getData();

    	 if($("#userId").val() == ""){
    		param.userId = "SYSTEM";
    	 }else{
    		param.userId = $("#userId").val();
		 }

		 var regYn = $('#regYnShlf').val();

	    	 if(regYn == "Y") {  //수정
	    		 //alert($('#rackNoOld').val());
	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/updateShlfMgmt', param, 'POST', 'ShlfUpt');
	    	 } else { //등록
	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/insertShlfMgmt', param, 'POST', 'ShlfReg');
	    	 }
    }

    function shlfDel() {

		var param =  $("#shlfRegForm").getData();
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/deleteShlfMgmt', param, 'POST', 'ShlfDel');

   }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 650,
                  height : window.innerHeight * 0.8
              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
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