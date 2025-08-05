/**
 * MtsoDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var cifTakeAprvStatCd = "";
var cifTakeRlesStatCd = "";
var aprvA = ""; //A망 권한
var aprvT = ""; //T망 권한
var adtnAttrVal = "";

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

    	if(data.mtsoLatVal != null){
    		$('#mtsoLatValT').val(dd2dms(data.mtsoLatVal));
    	}
    	if(data.mtsoLngVal != null){
    		$('#mtsoLngValT').val(dd2dms(data.mtsoLngVal));
    	}
    	if(data.fromMtsoDemd == "Y"){
    		$('#btnModLkup').hide();
    		$('#btnDupMtso').hide();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', data, 'GET', 'eqpDtlInf');
    	}else{
    		$('#mtsoDtlLkupArea').setData(data);
    	}
    	if(data.mtsoAbbrNm == null){
    		$('#mtsoAbbrNmDtl').val(data.mtsoNm);
    	}
    	if(data.mgmtGrpNm == "SKB"){
    		$('#mtsoAbbrNmDtlLabel').html("GIS국사명") ;
//    		$('#btnDupMtso').setEnabled(false);
    	}

//    	data.mgmtGrpNm = "SKB"

    	// 관리그룹이 SKT 인경우만 중통집 프로세스 적용
    	if(data.mgmtGrpNm == "SKT"){
    		var param =  $("#mtsoDtlLkupForm").getData();

    		var adtnAttrVal = param.adtnAttrVal;

    		if(adtnAttrVal.indexOf('CIF_MTSO_APRV_A') > 0){
    			aprvA = "Y";
    		}
    		$("#btnEqpUprMtsoSearch").hide();

    		if(data.cifTakeAprvStatCd != "" && data.cifTakeAprvStatCd != null){
    			$("#cifMtso1").show();
    			$("#cifMtso2").hide();
    		}else{
    			$("#cifMtso1").hide();
    			$("#cifMtso2").hide();
    		}

    		//중통집인 경우 중통집 신청 구분 안보이게 처리
    		if(data.mtsoTypCd == "2"){
    			$("#cifMtso2").hide();
    			$("#cifMtso1").show();
    			$("#btnCifAdtnInf").show();
//
    		}else{
    			$("#cifMtso1").hide();
    			$("#btnCifAdtnInf").hide();
    		}

    		// 후보대상/제외대상 구분 값(01:후보대상, 02:제외대상)
    		// 후보대상-후보등록, 인수요청, 보완요청
    		if (param.aprvRlesVal == "01") {
    			if (data.cifTakeAprvStatCd == "01" && aprvA == "Y") {
    				$('#btnAprvReq').show();
    				$('#btnTakeRv').hide();
    			}else if ((data.cifTakeAprvStatCd == "02" || data.cifTakeAprvStatCd == "03") && aprvT == "Y") {
    				$('#btnAprvReq').hide();
    				$('#btnTakeRv').show();
    			}else{
    				$('#btnAprvReq').hide();
    				$('#btnTakeRv').hide();
    			}
    			$('#btnRlesAprvReq').hide();
    			$('#btnRlesAprv').hide();
    			$('#btnRlesCncl').hide();

    			// 제외대상-해제대상, 해제요청
    		}else if (param.aprvRlesVal == "02") {
    			if (data.cifTakeRlesStatCd == "01" && aprvT == "Y") {
    				$('#btnRlesAprvReq').show();
    				$('#btnRlesAprv').hide();
    				$('#btnRlesCncl').hide();
    			}else if (data.cifTakeRlesStatCd == "02" && aprvA == "Y") {
    				$('#btnRlesAprvReq').hide();
    				$('#btnRlesAprv').show();
    				$('#btnRlesCncl').show();
    			}else{
    				$('#btnRlesAprvReq').hide();
    				$('#btnRlesAprv').hide();
    				$('#btnRlesCncl').hide();
    			}
    			$('#btnAprvReq').hide();
    			$('#btnTakeRv').hide();

    		} else {
    			$('#btnAprvReq').hide();
    			$('#btnTakeRv').hide();
    			$('#btnRlesAprvReq').hide();
    			$('#btnRlesAprv').hide();
    			$('#btnRlesCncl').hide();
    		}

    		//중심국이고 해제요청 상태가 아닌경우 해제요청 권한자 에게는 해제요청 버튼이 보이도록
    		if(param.mtsoTypCd == "2" && aprvT == "Y" && data.cifTakeRlesStatCd != "02"){
    			$('#btnRlesAprvReq').show();
    		}

    		//중심국 수정은 불가능하도록
    		// 국사세부유형이 T_RN인 경우에는 수정 불가 처리 - 서영응 2019-02-13
    		if(data.mtsoTypCd == "1" || data.mtsoTypCd == "2"){
    			$('#btnModLkup').hide();
    			if(aprvA == "Y"){
	    			$('#btnModLkup').show();
    			}
    		}

    		if(data.mtsoDetlTypCd == "017") {
    			$('#bldNmLabel').html("GIS 설치위치") ;
    			$('#bldblkNoLabel').html("한전전산번호") ;
    			$('#bldFlorNoLabel').html("") ;

    			//$('#mtsoDetlTypNm').val("T_RN");  // 임시 매핑

    			$('#btnModLkup').hide();
    			$('#bldNm').val(data.instlLocNm);
    			$('#bldblkNm').val(data.fildTlplItNo);

    		}

    	}else{
    		$("#cifMtso1").hide();
			$("#cifMtso2").hide();
    		$('#btnAprvReq').hide();
			$('#btnTakeRv').hide();
			$('#btnRlesAprvReq').hide();
			$('#btnRlesAprv').hide();
			$('#btnRlesCncl').hide();
			$("#btnCifAdtnInf").hide();
    	}

    }


    function setEventListener() {

    	//ERP정보
  	 $('#btnErpAcptCurstLkup').on('click', function(e) {
  		var param =  $("#mtsoDtlLkupForm").getData();
  		popupList('ErpCurstLkup', '/tango-transmission-web/configmgmt/common/ErpAcptCurst.do', 'ERP정보', param);
  	 });

    	//네트워크현황
   	 $('#btnNtwkLineCurstLkup').on('click', function(e) {
  		var param =  $("#mtsoDtlLkupForm").getData();
  		popupList('MtsoNtwkLineAcptCurst', '/tango-transmission-web/configmgmt/common/MtsoNtwkLineAcptCurst.do', '네트워크현황', param);
     });

   	 //서비스회선현황
  	 $('#btnSrvcLineCurstLkup').on('click', function(e) {
  		 var param =  $("#mtsoDtlLkupForm").getData();
  		 popupList('MtsoSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/common/MtsoSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
     });

    	//중복국사관리
   	 $('#btnDupMtso').on('click', function(e) {
   		 var param =  $("#mtsoDtlLkupForm").getData();
   		 param.regYn = "Y";

			$a.popup({
	          	popid: 'DupMtsoMgmt',
	          	title: configMsgArray['findEquipment'],
	            url: '/tango-transmission-web/configmgmt/common/DupMtsoMgmt.do',
	            data: param,
	            modal: true,
		        windowpopup : true,
	            movable:true,
	            width : 1200,
	           	height : window.innerHeight * 0.83,
	      });

     });

   	 //장비목록조회
   	$('#eqplist').on('click', function(e) {
		 var param =  $("#mtsoDtlLkupForm").getData();
		 param.closeYn = "N";
		 $a.popup({
	          	popid: 'EqpLkup',
	          	title: configMsgArray['findEquipment'],
	          	url: '/tango-transmission-web/configmgmt/equipment/EqpLkupPop.do',
	            data: param,
	            windowpopup : true,
	            modal: true,
	            movable:true,
	            width : 950,
	           	height : 800,
	      });
    });


    	//수정
   	 $('#btnModLkup').on('click', function(e) {
        	//tango transmission biz 모듈을 호출하여야한다.
   		 if(paramData.mtsoTypCd == "1"){
   			 callMsgBox('','I', "국사유형이 [ "+paramData.mtsoTyp+" ]인 장비는 수정할 수 없습니다." , function(msgId, msgRst){});
   		 }else{
   			 var param =  $("#mtsoDtlLkupForm").getData();
   			 param.regYn = "Y";

   			$a.navigate('/tango-transmission-web/configmgmt/common/MtsoRegPop.do',param);
   		 }
     });

   	 // 승인요청
		$('#btnAprvReq').on('click', function(e) {

			var userId;
			if($("#userId").val() == ""){
				 userId = "SYSTEM";
			}else{
				 userId = $("#userId").val();
			}

			var param =  $("#mtsoDtlLkupForm").getData();

			 if (param.mtsoCntrTypCd == "") {
	     		//필수 선택 항목입니다.[ 중통집구분 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption','통합국 구분'), function(msgId, msgRst){
					var param =  $("#mtsoDtlLkupForm").getData();
		   			 param.regYn = "Y";

		   			$a.navigate('/tango-transmission-web/configmgmt/common/MtsoRegPop.do',param);
				});
	     		return;
		     }

		   	 if (param.cifSlfLesCd == "") {
		     		//필수 선택 항목입니다.[ 국사소유 ]
					callMsgBox('','I', makeArgConfigMsg('requiredOption','국사소유'), function(msgId, msgRst){
						var param =  $("#mtsoDtlLkupForm").getData();
			   			 param.regYn = "Y";

			   			$a.navigate('/tango-transmission-web/configmgmt/common/MtsoRegPop.do',param);
					});
		     		return;
		     }

		   	 if (param.mtsoCntrTypCd == '02' || param.mtsoCntrTypCd == '03' ) {
		   		 if (param.rcuIpVal == "") {
				     		//필수 선택 항목입니다.[ RCU IP ]
							callMsgBox('','I', makeArgConfigMsg('requiredOption',' RCU IP '), function(msgId, msgRst){});
				     		return;
				     }
		   	 }

		   	callMsgBox('','C', "인수요청 하시겠습니까?", function(msgId, msgRst){
			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
			   		// takeReqpId 인수요청자ID
			   		param.takeReqpId = userId;
			   		// takeAprvId 인수승인자ID
			   		param.takeAprvId = "";
			   		// cifTakeAprvStatCd  인수승인상태
			   		param.cifTakeAprvStatCd = "02";
			   		// cifTakeRlesStatCd 인수해제상태
			   		param.cifTakeRlesStatCd = "";

			   		cifTakeAprvStatCd = "02";
			   		cifTakeRlesStatCd = "";

			   		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateCifMtsoInfAprvReq', param, 'POST', 'updateCifMtsoInf');
		        }
		     });
		});

		// 인수검토
		$('#btnTakeRv').on('click', function(e) {

			var param =  $("#mtsoDtlLkupForm").getData();

	 	$a.popup({
		  	popid: 'CifMtsoReg',
		  	title: '인수검토',
		      url: '/tango-transmission-web/configmgmt/common/CifMtsoTakeRv.do',
		      data: param,
		      modal: true,
		      windowpopup : true,
		      movable:true,
		      width : 670,
		      height : 900,
		      callback : function(data) { // 팝업창을 닫을 때 실행
		    	  	var pageNo = $("#pageNo", opener.document).val();
		    		var rowPerPage = $("#rowPerPage", opener.document).val();

		            $(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");

			    	window.close();
	          }
		  });
		});

		// 해제요청
		$('#btnRlesAprvReq').on('click', function(e) {

			var userId;
			if($("#userId").val() == ""){
				 userId = "SYSTEM";
			}else{
				 userId = $("#userId").val();
			}

			var param =  $("#mtsoDtlLkupForm").getData();

	   	callMsgBox('','C', "해제요청 하시겠습니까?", function(msgId, msgRst){
		       //저장한다고 하였을 경우
	        if (msgRst == 'Y') {
		   		// takeReqpId 인수요청자ID
		   		param.takeReqpId = userId;
		   		// takeAprvId 인수승인자ID
		   		param.takeAprvId = "";
		   		// cifTakeAprvStatCd  인수승인상태
		   		param.cifTakeAprvStatCd = "";
		   		// cifTakeRlesStatCd 인수해제상태
		   		param.cifTakeRlesStatCd = "02";

		   		cifTakeAprvStatCd = "";
		   		cifTakeRlesStatCd = "02";

		   		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateCifMtsoInfRlesAprv', param, 'POST', 'updateCifMtsoInf');
	        }
	     });
		});

		// 해제승인
		$('#btnRlesAprv').on('click', function(e) {
			var userId;
			if($("#userId").val() == ""){
				 userId = "SYSTEM";
			}else{
				 userId = $("#userId").val();
			}

			var param =  $("#mtsoDtlLkupForm").getData();
			// takeReqpId 인수요청자ID
			param.takeReqpId = "";
			// takeAprvId 인수승인자ID
			param.takeAprvId = userId;
			// cifTakeAprvStatCd  인수승인상태
			param.cifTakeAprvStatCd = "";
			// cifTakeRlesStatCd 인수해제상태
			param.cifTakeRlesStatCd = "03";
			// 해제승인 시 국사유형을 기지국사로 변경
			param.mtsoTypCd = "3";
			// 해제승인 시 국사세부유형을 T_기지국으로 변경
			param.mtsoDetlTypCd = "003";

			cifTakeAprvStatCd = "";
			cifTakeRlesStatCd = "03";

			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateCifMtsoInfRlesAprv', param, 'POST', 'updateCifMtsoInf');
		});

		// 해제반려
		$('#btnRlesCncl').on('click', function(e) {
			var userId;
			if($("#userId").val() == ""){
				 userId = "SYSTEM";
			}else{
				 userId = $("#userId").val();
			}

			var param =  $("#mtsoDtlLkupForm").getData();
			// takeReqpId 인수요청자ID
			param.takeReqpId = "";
			// takeAprvId 인수승인자ID
			param.takeAprvId = userId;
			// cifTakeAprvStatCd  인수승인상태
			param.cifTakeAprvStatCd = "";
			// cifTakeRlesStatCd 인수해제상태
			param.cifTakeRlesStatCd = "00";

			cifTakeAprvStatCd = "";
			cifTakeRlesStatCd = "00";

			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateCifMtsoInfRlesCncl', param, 'POST', 'updateCifMtsoInf');
		});

		//현장사진관리
	  	 $('#btnFildPic').on('click', function(e) {
	  		 var param =  $("#mtsoDtlLkupForm").getData();
	  		 param.mtsoId = $('#mtsoId').val();

			$a.popup({
	          	popid: 'FildPicMgmt',
	          	title: configMsgArray['findEquipment'],
	            url: '/tango-transmission-web/configmgmt/common/FildPicMgmt.do',
	            data: param,
	            modal: true,
		        windowpopup : true,
	            movable:true,
	            width : 1200,
	           	height : window.innerHeight * 0.83,
		      });
		    });

	  	//중통집추가정보
	  	 $('#btnCifAdtnInf').on('click', function(e) {
	  		var param =  {"mtsoId" : $('#eqpMgmtUmtsoId').val(), "autoSearchYn": "Y"}

	  		$a.popup({
			  	popid: 'CifMtsoAdtnDtlLkup',
			  	title: '통합국 추가 정보',
			      url: '/tango-transmission-web/configmgmt/common/CifMtsoAdtnDtlLkup.do',
			      data: param,
			      windowpopup : true,
			      modal: true,
			      movable:true,
			      width : 830,
			      height : 820
			  });
		    });


   	 $('#btnClose').on('click', function(e) {
          	//tango transmission biz 모듈을 호출하여야한다.
     		 $a.close();
          });

	};



	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'eqpDtlInf') {

    		$('#mtsoDtlLkupArea').setData(response.mtsoMgmtList[0]);
    	}

    	if(flag == 'updateCifMtsoInf') {
    		if(response.Result == "Success"){

	            var userId;
		   		if($("#userId").val() == ""){
		   			userId = "TANGOT";
		   		}else{
		   			userId = $("#userId").val();
		   		}

	    		var rcprUserId = [];
		   		var param = $("#mtsoDtlLkupForm").getData();
//		   		rcprUserId[0] = "PTN0036774";
//		   		rcprUserId[1] = "SKT1101566";
		   		rcprUserId[0] = $("#takeReqpId").val(); //여러명에게 보낼 수 있도록 일단 배열처리
		   		param.rcprUserId = rcprUserId; //수신자 ID
//		   		param.orgId = $("#orgId").val(); // totMailYn = Y 인 경우 orgId에 속한 사람들에게 메일 전송 - 지금은 업무 로직과 맞지 않아 주석처리
		   		param.aprvGubun = "AT"; // AT: A or T망 , M: 매니저 권한자
		   		param.userId = userId; //발신자 ID
		   		param.frstRegUserId = userId;
		   		param.lastChgUserId = userId;

		   		var emailTitlNm = "";
		   		var emailCtt = "";

		   		if(cifTakeAprvStatCd == "02" && cifTakeRlesStatCd == ""){ // 승인요청
		   			emailTitlNm = "통합국 인수 검토 요청";
		   			emailCtt = "[" + param.mtsoNm + "] 국사에 대한 통합국 인수 검토 요청 사항이 있습니다.";
		   			param.totMailYn = "Y"; // Y:T망 권한을 가진 모두에게 전송, N:수신자에게만 전송(rcprUserId[])
		   			param.adtnAttrVal = "CIF_MTSO_APRV_T"
		   		}else if(cifTakeAprvStatCd == "" && cifTakeRlesStatCd == "02"){ // 해제요청
		   			emailTitlNm = "통합국 해제 요청";
		   			emailCtt = "[" + param.mtsoNm + "] 국사에 대한 통합국 해제 요청 사항이 있습니다.";
		   			param.totMailYn = "Y"; // Y:A망 권한을 가진 모두에게 전송, N:수신자에게만 전송(rcprUserId[])
		   			param.adtnAttrVal = "CIF_MTSO_APRV_A"
		   		}else if(cifTakeAprvStatCd == "" && cifTakeRlesStatCd == "03"){ // 해제승인
		   			emailTitlNm = "통합국 해제 승인";
		   			emailCtt = "요청하신 [" + param.mtsoNm + "] 국사의 통합국 해제가 승인 완료 되었습니다.";
		   			param.totMailYn = "N";

		   			//승인 시 국사세부유형을 T_기지국으로 변경
					var paramDataR = [{"mtsoId":param.mtsoId, "mtsoDetlTypCd":"003", "ukeyMtsoCd":param.ukeyMtsoId, "fcltNm":param.mtsoNm, "bldNo":param.bldCd ,"addrNm":param.bldAddr ,"intgFcltsCd":param.repIntgFcltsCd ,"editUserId":userId}];
			        httpRequest('tango-transmission-gis-biz/transmission/gis/fm/facilityinfo/updateMtsoDetlTypCd' , paramDataR, 'POST', '');

		   		}else if(cifTakeAprvStatCd == "" && cifTakeRlesStatCd == "00"){ // 해제취소
		   			emailTitlNm = "통합국 해제 취소";
		   			emailCtt = "요청하신 [" + param.mtsoNm + "] 국사의 통합국 해제가 취소 되었습니다.";
		   			param.totMailYn = "N";
		   		}

		   		param.emailTitlNm = emailTitlNm //메일 제목
		   		param.emailCtt = emailCtt; // 메일 내용

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/reqemail', param, 'POST', 'reqemail');

    			var pageNo = $("#pageNo", opener.document).val();
	    		var rowPerPage = $("#rowPerPage", opener.document).val();

	            $(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    		}else{
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'reqemail') {

    		if(response.Result == "Success"){
    			//승인요청을 완료 하였습니다.
	    		callMsgBox('','I', '정상적으로 완료 되었습니다.' , function(msgId, msgRst){
	    		       if (msgRst == 'Y') {
	    		           $a.close("AprvReq");
	    		       }
	    		});
    		}else{
    			callMsgBox('','I', response.Msg , function(msgId, msgRst){
    				if (msgRst == 'Y') {
	    		           $a.close("RlesAprvReq");
	    		       }
    			});


    		}

    	}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    }

    function dd2dms(v){
		var d, m, sign = '', str;

		d = Math.floor(v);
//		d = v.substring(0,2);
		v = (v - d) * 60;
		m = Math.floor(v);
//		m = v.substring(0,2);
		v = (v - m) * 60;
		x = Math.round(v * Math.pow(10, 2)) / Math.pow(10, 2)
		str = d.toString() + '° ' + m.toString() + "' " + x.toString() + '"';

		return str;
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

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : 550

              });
        }

    function popup(pidData, urlData, titleData, paramData) {

     $a.popup({
           	popid: pidData,
           	title: titleData,
               url: urlData,
               data: paramData,
               iframe: true,
               modal: true,
               movable:true,
               width : 1200,
               height : window.innerHeight * 0.9

               /*
               	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
               */
               //width: 1000,
               //height: 700

           });
     }
});