/**
 * RackReg.js
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

    	//alert(param.regYnRack);
    	if(param.regYnRack == "Y"){
    		paramData = param;
    	}

//    	document.getElementById('rackDtlTab').click();
    	setSelectCode();
    	setEventListener();
        setRegDataSet(param);

    };


    function setRegDataSet(data) {
    	$('#regYnRack').val("");
    	if(data.regYnRack == "Y"){  //수정
    		//$('#btnDelDtl').setEnabled(true);
        	//document.getElementById('btnDelDtl1').style.display="block";
    		initData();//항목 초기화
        	$('#regYnRack').val("Y");
        	$('#rackRegArea').setData(data);
        	$('#btnEqpSearch1').hide();  //장비 변경 불가

    	}else{
    		if(data.fromRackReg == "Y"){
    			$('#rackRegArea').setData(data);
    		}
    		//$('#eqpIdRack').val('');
        	//$('#eqpNmRack').val('');
    	}
    }

    function initData() {
    	$('#eqpIdRack').val("");
    	$('#eqpNmRack').val("");
    	$('#rackNo').val("");
    	$('#rackNm').val("");
    	$('#rackTyp').clear();
    	$('#rackTypCd').val("");
    	$('#barNoRack').val("");
    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	//제조사 조회
    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/vendNmList', null, 'GET', 'vendNmList');
    	//Rack유형 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/rackTypCdList', null, 'GET', 'rackTypCdList');

    	//사용여부 세팅
    	$('#rackUse').clear();
    	var option_data =  [{rackUseYn: "Y", rackUseYnNm: "사용"},{rackUseYn: "N", rackUseYnNm: "미사용"}];
    	var rackUseYnCd = '';

    	if(paramData == '' || paramData == null) {
			$('#rackUse').setData({
	             data:option_data
			});
		}else {
			if(paramData.rackUseYn == "사용"){
				rackUseYnCd = "Y";
			}else{
				rackUseYnCd = "N";
			}
    		//$('#rackUse').clear();
    		$('#rackUse').setData({
    			data:option_data,
	            rackUseYn:rackUseYnCd
			});
		}
    }

    function setEventListener() {
    	//제조사 선택 시 값 세팅
   	 	/*$('#vend').on('click', function(e) {
   	 		var vendCd = $('#vend').val();
   	 		$('#vendCd').val(vendCd);
        });*/


   	 	//Rack유형 선택 시 값 세팅
   	 	$('#rackTyp').on('click', function(e) {
   	 		var rackTypCd = $('#rackTyp').val();
   	 		$('#rackTypCd').val(rackTypCd);
        });

    	//삭제
	   	 $('#btnDelDtl1').on('click', function(e) {
	        	//tango transmission biz 모듈을 호출하여야한다.
	 			 callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
	 			       //삭제한다고 하였을 경우
	 			        if (msgRst == 'Y') {
	 			        	rackDel();
	 			        }
	 			      });
        });

    	//취소
    	 $('#btnCnclReg1').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveReg1').on('click', function(e) {
    		 if($('#eqpNmRack').val() == '' || $('#rackNm').val() == '' || $('#rackTyp').val() == ''){
	    		 if($('#eqpNmRack').val() == '' || $('#eqpIdRack').val() == ''){
	    			//필수입력 항목입니다. [ 장비 ]
	 	   			callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
	    		 }else if($('#rackNm').val() == ''){
	    			//필수입력 항목입니다. [ "Rack명 ]
		 	   		callMsgBox('','W', makeArgConfigMsg('required'," Rack명 "), function(msgId, msgRst){});
//	    		 }else if($('#rackTyp').val() == ''){
	    			//필수 선택 항목입니다.[ Rack유형 ]
//	 	   	 		callMsgBox('','W', makeArgConfigMsg('requiredOption'," Rack유형 "), function(msgId, msgRst){});
	    		 }
    		 }else{

	 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
	 		       //저장한다고 하였을 경우
	 		        if (msgRst == 'Y') {
	 		        	rackReg();
	 		        }
	 		      });
    		 }
         });

    	 //장비 조회
    	 $('#btnEqpSearch1').on('click', function(e) {
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

    	                	$('#rackNm').val('');

    	                	alertBox('W','수동등록 할 수없는 모델입니다.');
    	            		return;
    	                } else {

    	                	setEnableObjByPortPveReg(true);

    	                	$('#eqpNmRack').val(data.eqpNm);
        	                $('#eqpIdRack').val(data.eqpId);
        	                $('#intgFcltsCd').val(data.intgFcltsCd);
	    	                }
    	                }
    	           	}
    	      });
         });

    	 /* [20171019] */
    	 function setEnableObjByPortPveReg(enable){
    		$('#rackNm').setEnabled(enable);
         	$('#btnSaveReg1').setEnabled(enable);
         	$('#rackUse').setEnabled(enable);

            if(!enable){
                $('#rackNm').val('');
            }
    	 }
    	 /*_[20171019] */

    	//바코드조회
	   	 $('#btnBarNoSearch').on('click', function(e) {

	   		 if ($('#eqpIdRack').val() == "") {
	 	    		//필수입력 항목입니다.[ 장비 ]
	   			 	callMsgBox('','W', makeArgConfigMsg('required'," 장비 "), function(msgId, msgRst){});
	 	     		return;
	 	     	 }

	   		 var param =  {"sisulGbn": "intgFclts"
			    			 , "sisulCd": $('#intgFcltsCd').val()};

	   		 $a.popup({
	   	          	popid: 'BarcodeInfoListPop',
	   	          	title: '바코드조회',
	   	            //url: $('#ctx').val()+'/configmgmt/shpmgmt/BarcodeInfoListPop.do',
	   	            url: '/tango-transmission-web/configmgmt/shpmgmt/BarcodeInfoListPop.do',
	   	            data: param,
	   	            modal: true,
	                   movable:true,
	   	            width : 1300,
	   	           	height : window.innerHeight * 0.8,
	   	           	callback : function(data) { // 팝업창을 닫을 때 실행
	   	                $('#barNoRack').val(data);
	   	           	}
	   	      });
        });


    	 $('#btnClose').on('click', function(e) {
    		 $('#regBtnTyp').val("");
      		 $a.close();
           });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'RackReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		});

    		param = response.resultList;
    		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO002Send', param, 'POST', '');

//    		$a.navigate($('#ctx').val()+'/configmgmt/shpmgmt/ShpMgmt.do');
    		var pageNo = $("#pageNoDtl", parent.document).val();
    		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

            $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridRack','1','100');");
    	}

    	if(flag == 'RackUpt') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    			if (msgRst == 'Y') {
 		           $a.close();
 		       }
    		});

    		param = response.resultList;
    		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO002Send', param, 'POST', '');

//    		$a.navigate($('#ctx').val()+'/configmgmt/shpmgmt/ShpMgmt.do');
    		var pageNo = $("#pageNoDtl", parent.document).val();
    		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

            $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridRack','1','100');");
    	}

    	if(flag == 'RackDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		 });
//    		$a.navigate($('#ctx').val()+'/configmgmt/shpmgmt/ShpMgmt.do');
    		var pageNo = $("#pageNoDtl", parent.document).val();
    		var rowPerPage = $("#rowPerPageDtl", parent.document).val();

            $(parent.location).attr("href","javascript:subMain.setGridP('ShpGridRack','1','100');");
    	}
    	/*
    	if(flag == 'vendNmList'){

    		$('#vend').clear();

    		var option_data =  [{vendCd: "", vendNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#vend').setData({
    	             data:option_data
    			});
    		}else {
    			$('#vend').setData({
    	             data:option_data,
    	             vendCd:paramData.vendCd
    			});
    		}
    	}*/

    	if(flag == 'rackTypCdList'){

    		$('#rackTyp').clear();

    		var option_data =  [{rackTypCd: "", rackTypNm: "선택"}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#rackTyp').setData({
    	             data:option_data
    			});
    		}else {
    			$('#rackTyp').setData({
    	             data:option_data,
    	             rackTypCd:paramData.rackTypCd
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
    	if(flag == 'RackReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'RackUpt'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    	if(flag == 'RackDel'){
    		//삭제을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function rackReg() {
    	var param =  $("#rackRegForm").getData();

    	 if($("#userId").val() == ""){
    		param.userId = "SYSTEM";
    	 }else{
    		param.userId = $("#userId").val();
		 }

		 var regYn = $('#regYnRack').val();

    	 if(regYn == "Y") {  //수정
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/updateRackMgmt', param, 'POST', 'RackUpt');
    	 } else { //등록
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/insertRackMgmt', param, 'POST', 'RackReg');
    	 }

    }

    function rackDel() {

		var param =  $("#rackRegForm").getData();
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/deleteRackMgmt', param, 'POST', 'RackDel');

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