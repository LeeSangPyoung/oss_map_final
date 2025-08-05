/**
 * SbeqpReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var sbeqp = $a.page(function() {

    //초기 진입점
	var paramData = null;
	var pageNo = 1;
	var rowPerPage = 10;
	var regYn = "N";
	var orgMtsoId = null; //기존 국사ID
	var orgSbeqpNm = null; //기존 부대장비명

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$a.maskedinput($('#mnftDtReg')[0], '0000-00-00');
    	paramData = param;
        setEventListener();
        setSelectCode();
        pageNo = paramData.pageNo;
		rowPerPage = paramData.rowPerPage;
        if(paramData.epwrClCd != null){
        	$('#sbeqpClNmReg').setEnabled(false);
        	paramData.sbeqpClCd = paramData.epwrClCd;
        	$('#sbeqpClNmReg').setData(paramData);
        	setPage();
        }
    	if(paramData.regYn == "Y"){
    		regYn = paramData.regYn;
    		$('#sbeqpClNmReg').setEnabled(false);

    		var codeID = paramData.sbeqpClCd;
    		if(codeID == 'E' || codeID == 'L' || codeID == 'N' ){
				$('#btnSbeqpMdlSearch').hide();
			} else {
				$('#btnSbeqpMdlSearch').show();
			}

    		//$('#btnSbeqpMdlSearch').hide();
    		//$('#mnftDtCal').setEnabled(false);

//    		setRegDataSet(paramData);
    		setPage();
    	}else {
    		if(param.eqpInstlMtsoIdReg != null || param.eqpInstlMtsoIdReg != undefined && (param.eqpInstlMtsoNmReg == null || param.eqpInstlMtsoNmReg == undefined)){
    			var param = {mtsoId : param.eqpInstlMtsoIdReg}
       		 	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoLkup', param, 'GET', 'mtsoNmList');
    		}
    	}
    };

    function setRegDataSet(data) {
    	$('#regYn').val("Y");
    	sbeqpId = {"sbeqpId" : data.sbeqpId};
    	switch(data.sbeqpClCd){
    	case "R" :	// 정류기
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpRtfMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "A" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpArcnMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "M" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpRtfMdulMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "B" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpBatryMgmt',sbeqpId, 'GET', 'search');
 			break;
 		case "F" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpFextnMgmt',sbeqpId, 'GET', 'search');
 			break;
 		case "N" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpGntMgmt',sbeqpId, 'GET', 'search');
 			break;
 		case "L" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpCbplMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "S" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpExstrMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "I" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpIvtrMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "C" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpContrMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "T" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpTvssMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "P" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpIpdMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "G" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpGageMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		case "O" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpEtcMgmt',sbeqpId, 'GET', 'search');
 			break;
 		case "E" :
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpEtcMgmt',sbeqpId, 'GET', 'search');
 		 	break;
 		 default :
 			 break;
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
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpOpStat');
    	//부대장비 분류 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02406', null, 'GET', 'sbeqpClCd');

    }

    function setEventListener() {
    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 //alert(paramData.regYn);
    		 if(paramData.regYn == "Y") {
    			 //$a.back();
    			 $a.close();
    		 }
    		 else {
    			 $a.close();
    		 }
         });
    	//저장
    	 $('#btnSaveReg').on('click', function(e) {

    		 var param =  $("#sbeqpRegForm").getData();
     		 if (param.sbeqpClCd == "") {
    	    		//필수선택 항목입니다.[ 부대장비타입 ]
    	    		 callMsgBox('','W', '필수선택 항목입니다.[ 부대장비타입 ]', function(msgId, msgRst){});
    	     		return;
    	     	 }

     		 if (param.sbeqpInstlMtsoNm == "") {
   	    		//필수입력 항목입니다.[ 국사 ]
   	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
   	     		return;
   	     	 }

			 if (param.sbeqpMdlNm == "") {
				 if(param.sbeqpClCd != "E") {
					//필수입력 항목입니다.[ 모델명 ]
					callMsgBox('','W', '필수입력 항목입니다.[ 모델명 ]', function(msgId, msgRst){});
					return;
				 }
			 }
			 if (param.mnftDt == "") {
				//필수입력 항목입니다.[ 제조일자 ]
				callMsgBox('','W', '필수입력 항목입니다.[ 제조일자 ]', function(msgId, msgRst){});
				return;
			 }

     		 if (param.sbeqpNm == "") {
				//필수입력 항목입니다.[ 부대장비명 ]
				callMsgBox('','W', '필수입력 항목입니다.[ 부대장비명 ]', function(msgId, msgRst){});
				return;
			 }

     		 if (param.sbeqpOpStatCd == "") {
  	     	    //필수입력 항목입니다. [ 운용상태 ]
  	     		callMsgBox('','W', '필수입력 항목입니다. [ 운용상태 ]', function(msgId, msgRst){});
  	     		return;
  	     	 }
     		var subFormValChk = "N";
     		switch(param.sbeqpClCd)  {
	     		 case "R" :	// 정류기
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpRtf.rtfValChk();
	     		 	break;
	     		case "A" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpArcn.arcnValChk();
	     		 	break;
	     		case "M" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpRtfMdul.rtfMdulValChk();
	     		 	break;
	     		case "B" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpBatry.batryValChk();
	     			break;
	     		case "A" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpArcn.arcnValChk();
	     			break;
	     		case "F" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpFextn.fextnValChk();
	     			break;
	     		case "N" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpGnt.gntValChk();
	     			break;
	     		case "L" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpCbpl.cbplValChk();
	     		 	break;
	     		case "S" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpExstr.exstrValChk();
	     		 	break;
	     		case "I" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpIvtr.ivtrValChk();
	     		 	break;
	     		case "C" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpContr.contrValChk();
	     		 	break;
	     		case "T" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpTvss.tvssValChk();
	     		 	break;
	     		case "P" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpIpd.ipdValChk();
	     		 	break;
	     		case "G" :
	     			subFormValChk = $("#ifrm").prop('contentWindow').sbeqpGage.gageValChk();
	     		 	break;
	     		case "O" :
	     			subFormValChk = "Y";
	     			break;
	     		case "E" :
	     			subFormValChk = "Y";
	     		 	break;
	     		 default :
	     			 break;
     		}
    		 if(subFormValChk != "Y") {
    			 callMsgBox('','W', subFormValChk , function(msgId, msgRst){});//냉방기로 메세지 확인 완료
    			 return;
    		 }
    		 if(param.sbeqpClCd == 'O' && param.sbeqpNm != orgSbeqpNm){
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpNmDupChk', {sbeqpNm: $('#sbeqpNmReg').val()}, 'GET', 'SbeqpNmDupChk');
    		 }else{
         		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
   			       //저장한다고 하였을 경우
   		        if (msgRst == 'Y') {
   		        	SbeqpReg();
	   		        }
	   		     });
    		 }
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
    	            url: '/tango-transmission-web/configmgmt/shpmgmt/BarcodeInfoListPop.do',
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 1300,
    	           	height : 800,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#barNoReg').val(data);
    	           	}
    	      });
         });

    	//부대장비모델조회
    	 $('#btnSbeqpMdlSearch').on('click', function(e) {
    		 var param = {"sbeqpClCd": $('#sbeqpClNmReg').val(), "gntFlag" : "Y"};
    		 if(paramData.epwrClCd != null){
    			 param.fix = "Y";
    		 }
    		 if(paramData.regYn != null && paramData.regYn != '' && paramData.regYn != undefined && paramData.regYn != 'undefined'){
    			 param.regYn = paramData.regYn;
    		 }
    		 $a.popup({
    	          	popid: 'SbeqpMdlLkup',
    	          	title: '부대장비모델조회',
    	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMdlLkup.do',
    	            data: param,
    	            modal: true,
                    movable:true,
                    windowpopup : true,
    	            width : 950,
    	           	height : 800,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	           		$('#sbeqpMdlNmReg').val(data.sbeqpMdlNm);
    	                $('#sbeqpMdlIdReg').val(data.sbeqpMdlId);
    	                $('#sbeqpVendNmReg').val(data.sbeqpVendNm);
    	                if($('#sbeqpClNmReg').val() != data.sbeqpClCd && data.sbeqpClCd != undefined) {
    	             		$('#sbeqpIdReg').val('SE'+data.sbeqpClCd+'***********');
        	                $('#sbeqpClNmReg').setData({
        	                	sbeqpClCd:data.sbeqpClCd
        	    			});
        	                setPage();
    	                }
    	                if(data.sbeqpClCd == 'O') {
    	                	$('#sbeqpNmReg').setEnabled(false);
    	                	callMsgBox('','I', '국사 선택시 부대장비명(옥외랙 고유번호)이 자동 입력 됩니다.', function(msgId, msgRst){});
	             			if(paramData.regYn != 'Y' && $('#sbeqpInstlMtsoIdReg').val() != null && $('#sbeqpInstlMtsoIdReg').val() != '' && $('#sbeqpInstlMtsoIdReg').val() != undefined && $('#sbeqpInstlMtsoIdReg').val() != 'undefined') {
	             				httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpOutdrRackNm', {sbeqpInstlMtsoId:$('#sbeqpInstlMtsoIdReg').val()}, 'GET', 'sbeqpOutdrRackNm');
	             			}
    	                }else{
    	                	$('#sbeqpNmReg').setEnabled(true);
    	                }
    	           	}
    	      });
         });

    	 //국사 조회
    	 $('#btnMtsoSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'MtsoLkup',
    	          	title: configMsgArray['findMtso'],
    	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
//    	            data: {autoSearchYn : "Y"},
    	            windowpopup : true,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : 800,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#sbeqpInstlMtsoNmReg').val(data.mtsoNm);
    	                $('#sbeqpInstlMtsoIdReg').val(data.mtsoId);
    	                $('#tmofNmReg').val(data.tmofNm);
    	                $('#teamNmReg').val(data.teamNm);
    	                $('#orgIdReg').val(data.orgId);
    	                $('#mgmtGrpNmReg').val(data.mgmtGrpNm);
    	                $('#mtsoTypReg').setData({
    	                	mtsoTyp:data.mtsoTyp
    	        		});
    	                if($('#sbeqpClNmReg').val() == 'O') {
    	                	if(orgMtsoId != data.mtsoId){
        	                	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpOutdrRackNm', {sbeqpInstlMtsoId:data.mtsoId}, 'GET', 'sbeqpOutdrRackNm');
    	                	}
    	                	else {
    	                		$('#sbeqpNmReg').val(orgSbeqpNm);
    	                	}
    	                }
    	           	}
    	      });
         });

    	 $('#btnRmsSearch').on('click', function(e) {
    		 var sbeqpInstlMtsoIdReg = $('#sbeqpInstlMtsoIdReg').val();
    		 var beforeRmsId = $('#sbeqpRmsIdReg').val();
    		 $('#rmsMappDivVal').val("");

    		 var param = {mtsoId : sbeqpInstlMtsoIdReg};
    		 $a.popup({
    	          	popid: 'RmsLkup',
    	          	title: '',
    	          	data: param,
    	            url: '/tango-transmission-web/configmgmt/sbeqpmgmt/IrmsSearch.do?',
    	            windowpopup : true,
    	            modal: true,
                    movable:true,
    	            width : 900,
    	           	height : 800,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	           		$('#sbeqpRmsIdReg').val(data.irmsid);
    	           		//2023 통합국사 고도화 - 추가 필드
    	           		$('#rmsBmtsoId').val(data.stationid);
    	           		$('#rmsBmtsoNm').val(data.stationname);
    	           		$('#rmsSpecNm').val(data.itemnm);

    	           		//RMS ID 사용자가 변경시 처리로직 추가
    	           		if(beforeRmsId != data.irmsid){
    	           			if(!$.TcpMsg.isEmpty($('#sbeqpRmsIdReg').val())){
    	           				$('#rmsMappDivVal').val("USER_MAPP"); //사용자가 매핑정보 수정
    	           			}
    	           		}
    	           	}
    	      });
         });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

     	//부대장비타입 선택시 이벤트
     	 $('#sbeqpClNmReg').on('change', function(e) {
			$('#sbeqpMdlNmReg').val('');
	        $('#sbeqpMdlIdReg').val('');
	        $('#sbeqpVendNmReg').val('');
	        $('#sbeqpNmReg').setEnabled(true);

          	//tango transmission biz 모듈을 호출하여야한다.
     		 var codeID =  $("#sbeqpClNmReg").getData();
     		 if(codeID.sbeqpClCd == '' || codeID.sbeqpClCd == null) {
     			codeID.sbeqpClCd = '#';
     		 }
     		 if(codeID.sbeqpClCd == 'O') {
       			$('#sbeqpNmReg').setEnabled(false);
     			callMsgBox('','I', '국사 선택시 부대장비명(옥외랙 고유번호)이 자동 입력 됩니다.', function(msgId, msgRst){});
     			if($('#sbeqpInstlMtsoIdReg').val() != null && $('#sbeqpInstlMtsoIdReg').val() != '' && $('#sbeqpInstlMtsoIdReg').val() != undefined && $('#sbeqpInstlMtsoIdReg').val() != 'undefined') {
     				httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpOutdrRackNm', {sbeqpInstlMtsoId:$('#sbeqpInstlMtsoIdReg').val()}, 'GET', 'sbeqpOutdrRackNm');
     			}
     		 }
     		$('#sbeqpIdReg').val('SE'+codeID.sbeqpClCd+'***********');
     		var param = $("#sbeqpRegForm").getData();
     		setPage();
         });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'SbeqpReg') {
    		if(response.Result == "Success"){
    			var codeID = $('#sbeqpClNmReg').val();
    			switch(codeID){
    			case 'R':
    				$("#ifrm").prop('contentWindow').sbeqpRtf.sbeqpRtfReg(response.resultList);
    				break;
    			case 'M':
    				$("#ifrm").prop('contentWindow').sbeqpRtfMdul.sbeqpRtfMdulReg(response.resultList);
    				break;
    			case 'B':
    				$("#ifrm").prop('contentWindow').sbeqpBatry.sbeqpBatryReg(response.resultList);
    				break;
    			case 'A':
    				$("#ifrm").prop('contentWindow').sbeqpArcn.sbeqpArcnReg(response.resultList);
    				break;
    			case 'F':
    				$("#ifrm").prop('contentWindow').sbeqpFextn.sbeqpFextnReg(response.resultList);
    				break;
    			case 'N':
    				$("#ifrm").prop('contentWindow').sbeqpGnt.sbeqpGntReg(response.resultList);
    				break;
    			case 'L':
    				$("#ifrm").prop('contentWindow').sbeqpCbpl.sbeqpCbplReg(response.resultList);
    				break;
    			case 'S':
    				$("#ifrm").prop('contentWindow').sbeqpExstr.sbeqpExstrReg(response.resultList);
    				break;
    			case 'I':
    				$("#ifrm").prop('contentWindow').sbeqpIvtr.sbeqpIvtrReg(response.resultList);
    				break;
    			case 'C':
    				$("#ifrm").prop('contentWindow').sbeqpContr.sbeqpContrReg(response.resultList);
    				break;
    			case 'T':
    				$("#ifrm").prop('contentWindow').sbeqpTvss.sbeqpTvssReg(response.resultList);
    				break;
    			case 'P':
    				$("#ifrm").prop('contentWindow').sbeqpIpd.sbeqpIpdReg(response.resultList);
    				break;
    			case 'G':
    				$("#ifrm").prop('contentWindow').sbeqpGage.sbeqpGageReg(response.resultList);
    				break;
    			case 'O':
    				SbeqpReg();
    				break;
    			case 'E':
    				SbeqpReg();
    				break;
    			default :
    				break;
    			}
	    	}
    	}

    	if(flag == 'SbeqpEtcReg') {
    		sbeqp.success();
    	}

    	if(flag == 'eqpOpStat'){

    		$('#sbeqpOpStatNmReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#sbeqpOpStatNmReg').setData({
    	             data:option_data
    			});
    			$('#sbeqpOpStatNmReg').setSelected("01");
    		}
    		else {
    			if(paramData.regYn == "Y"){
        			$('#sbeqpOpStatNmReg').setData({
       	             data:option_data,
       	             sbeqpOpStatCd:paramData.sbeqpOpStatCd
        			});
    			}
    			else{
        			$('#sbeqpOpStatNmReg').setData({
          	             data:option_data
           			});
        			$('#sbeqpOpStatNmReg').setSelected("01");
    			}
    		}
    		if(paramData.regYn == "Y"){
        		setRegDataSet(paramData);
        		if(paramData.sbeqpClCd == 'O'){
        			orgMtsoId = paramData.sbeqpInstlMtsoId;
        			orgSbeqpNm = paramData.sbeqpNm;
           			$('#sbeqpNmReg').setEnabled(false);
         			callMsgBox('','I', '국사 선택시 부대장비명(옥외랙 고유번호)이 자동 입력 됩니다.', function(msgId, msgRst){});
        		}
        	}
    	}

    	if(flag == 'mgmtTeamOrgId'){

    		$('#jrdtTeamOrgNmReg').clear();

    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#jrdtTeamOrgNmReg').setData({
   	             data:option_data
    			});
    		}
    		else {
    			if(paramData.regYn == "Y"){
        			$('#jrdtTeamOrgNmReg').setData({
       	             data:option_data,
       	             jrdtTeamOrgId:paramData.jrdtTeamOrgId
        			});
    			}
    			else{
        			$('#jrdtTeamOrgNmReg').setData({
          	             data:option_data
           			});
    			}
    		}
    	}

    	if(flag == 'search'){
    		switch(paramData.sbeqpClCd){
        	case "R" :	// 정류기
        		var result = response.sbeqpRtfMgmtList[0];
     		 	break;
     		case "A" :
     			var result = response.sbeqpArcnMgmtList[0];
     		 	break;
     		case "M" :
     			var result = response.sbeqpRtfMdulMgmtList[0];
     		 	break;
     		case "B" :
     			var result = response.sbeqpBatryMgmtList[0];
     			break;
     		case "F" :
     			var result = response.sbeqpFextnMgmtList[0];
     			break;
     		case "N" :
     			var result = response.sbeqpGntMgmtList[0];
     			break;
     		case "L" :
     			var result = response.sbeqpCbplMgmtList[0];
     		 	break;
     		case "S" :
     			var result = response.sbeqpExstrMgmtList[0];
     		 	break;
     		case "I" :
     			var result = response.sbeqpIvtrMgmtList[0];
     		 	break;
     		case "C" :
     			var result = response.sbeqpContrMgmtList[0];
     		 	break;
     		case "T" :
     			var result = response.sbeqpTvssMgmtList[0];
     		 	break;
     		case "P" :
     			var result = response.sbeqpIpdMgmtList[0];
     		 	break;
     		case "G" :
     			var result = response.sbeqpGageMgmtList[0];
     		 	break;
     		case "O" :
     			var result = response.sbeqpEtcMgmtList[0];
     		 	break;
     		case "E" :
     			var result = response.sbeqpEtcMgmtList[0];
     			break;
     		 default :
     			 break;
        	}
    		$('#sbeqpRegArea').setData(result);
    	}

    	if(flag == 'sbeqpClCd'){
    		$('#sbeqpClNmReg').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택하세요"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#sbeqpClNmReg').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'sbeqpOutdrRackNm'){
    		$('#sbeqpNmReg').val(response.sbeqpOutdrRackNm);
    	}

    	if(flag == 'SbeqpNmDupChk'){
    		if(response.sbeqpDupNm == null || response.sbeqpDupNm == '' || response.sbeqpDupNm == undefined || response.sbeqpDupNm == 'undefined') {
        		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
     			       //저장한다고 하였을 경우
     		        if (msgRst == 'Y') {
     		        	SbeqpReg();
  	   		        }
  	   		     });
    		}
    		else {
       		 callMsgBox('','C', '해당 부대장비명(고유번호)으로 옥외랙이 이미 등록되어 있습니다. <br> "'+response.sbeqpDupNm+'"으로 등록하시겠습니까?', function(msgId, msgRst){
			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	$('#sbeqpNmReg').val(response.sbeqpDupNm);
		        	SbeqpReg();
   		        }
   		      });
    		}
    	}

    	if(flag == 'mtsoNmList'){
    		$('#sbeqpInstlMtsoNmReg').val(response.mtsoLkupList[0].mtsoNm);
            $('#sbeqpInstlMtsoIdReg').val(response.mtsoLkupList[0].mtsoId);
            $('#tmofNmReg').val(response.mtsoLkupList[0].tmofNm);
            $('#teamNmReg').val(response.mtsoLkupList[0].teamNm);
            $('#orgIdReg').val(response.mtsoLkupList[0].orgId);
            $('#mgmtGrpNmReg').val(response.mtsoLkupList[0].mgmtGrpNm);
            $('#mtsoTypReg').setData({
            	mtsoTyp:response.mtsoLkupList[0].mtsoTyp
    		});
            if($('#sbeqpClNmReg').val() == 'O') {
            	if(orgMtsoId != response.mtsoLkupList[0].mtsoId){
                	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/getSbeqpOutdrRackNm', {sbeqpInstlMtsoId:response.mtsoLkupList[0].mtsoId}, 'GET', 'sbeqpOutdrRackNm');
            	}
            	else {
            		$('#sbeqpNmReg').val(orgSbeqpNm);
            	}
            }
    	}
    }

    this.success = function(){
		if($('#regYn').val() == "Y"){
			//저장을 완료 하였습니다.
			callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
				if (msgRst == 'Y') {
					//$a.back();
					$a.close();
				}
			});
		} else {
			$a.close();
		}

		if(paramData.epwrClCd == 'R'){
			$(opener.location).attr("href","javascript:rtf.setGrid("+pageNo+","+rowPerPage+");");
		} else if(paramData.epwrClCd == 'B'){
			$(opener.location).attr("href","javascript:batry.setGrid("+pageNo+","+rowPerPage+");");
		} else if(paramData.epwrClCd == 'A'){
			$(opener.location).attr("href","javascript:arcn.setGrid("+pageNo+","+rowPerPage+");");
		} else if(paramData.epwrClCd == 'F'){
			$(opener.location).attr("href","javascript:fextn.setGrid("+pageNo+","+rowPerPage+");");
		} else if(paramData.epwrClCd == 'N'){
			$(opener.location).attr("href","javascript:gnt.setGrid("+pageNo+","+rowPerPage+");");
		}
		else {
			$(opener.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
	    }
    }
	this.fail = function(){
		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'SbeqpReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function SbeqpReg() {

		 var param =  $("#sbeqpRegForm").getData();

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 if(!$.TcpMsg.isEmpty($('#sbeqpRmsIdReg').val())){
			 param.rmsMappDivVal = "USER_MAPP"
		 }else{
			 param.rmsMappDivVal = ""
		 }
    	 if(param.mnftDt.length > 6) {
    		var tmp = (param.mnftDt).split('-');
        	param.mnftDt = tmp[0];
    	 }
    	 if(pageNo == null || pageNo == "" || pageNo == undefined){
    		 pageNo = 1;
    	 }
    	 if(rowPerPage == null || rowPerPage == "" ||  rowPerPage == undefined){
    		 if(paramData.epwrClCd != null){
    			 rowPerPage = 100;
    		 }else{
    			 rowPerPage = 10;
    		 }
    	 }
		 param.pageNo = pageNo;
		 param.rowPerPage = rowPerPage;

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 console.log("save param : ", param);

		 if(param.sbeqpClCd == "E" || param.sbeqpClCd == "O"){
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpEtcMgmt', param, 'POST', 'SbeqpEtcReg');
		 } else {
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/mergeSbeqpMgmt', param, 'GET', 'SbeqpReg');
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

    function setPage(){
    	var strSrc = null;
		var codeID = $('#sbeqpClNmReg').val();
		if(codeID == null) { // 콤보박스 실행이 늦어 setRegData 후에 긁어도 ClNm값이 null일 경우 있어서 파라미터에서 가져옴
			codeID = paramData.sbeqpClCd;
		}
		$('#ifrm').attr("style","width:100%; height:250px; border:0px;margin-top: 0px;");

		if(codeID == 'N'){
			window.resizeTo(900,850);
		} else if(codeID == 'F'){
			window.resizeTo(900,780);
		}else{
			window.resizeTo(900,700);
		}
		if(paramData.regYn != 'Y'){
			if(codeID == 'E'){
				$('#sbeqpMdlIdReg').val('SME0000000');
				$('#sbeqpMdlNmReg').val('N/A');
				$('#btnSbeqpMdlSearch').hide();
				$('#sbeqpVendNmReg').val('N/A');
			} else if (codeID == 'L'){
				$('#sbeqpMdlIdReg').val('SML0000000');
				$('#sbeqpMdlNmReg').val('N/A');
				$('#btnSbeqpMdlSearch').hide();
				$('#sbeqpVendNmReg').val('N/A');
			} else if (codeID == 'N'){
				$('#sbeqpMdlIdReg').val('SMN0000000');
				$('#sbeqpMdlNmReg').val('N/A');
				$('#btnSbeqpMdlSearch').hide();
				$('#sbeqpVendNmReg').val('N/A');
			}
			else {
				$('#btnSbeqpMdlSearch').show();

			}
		}
    	switch (codeID) {
		case 'E' :
			strSrc="";
			break;
		case 'R' :
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
			break;
		case 'M' :
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfMdulReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
			break;
		case 'B' :
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
			break;
		case 'A' :
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtArcnReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
			break;
		case 'F' :
			$('#ifrm').attr("style","width:100%; height:350px; border:0px;margin-top: 0px;");
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
			break;
		case 'N' :
			$('#ifrm').attr("style","width:100%; height:450px; border:0px;margin-top: 0px;");
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtGntReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
			break;
		case "L" :
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtCbplReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
 		 	break;
		case "S" :
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtExstrReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
 		 	break;
		case "I" :
			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIvtrReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
 		 	break;
		case "C" :
 			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtContrReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
 		 	break;
 		case "T" :
 			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtTvssReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
 		 	break;
 		case "P" :
 			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIpdReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
 		 	break;
 		case "G" :
 			strSrc="/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtGageReg.do?sbeqpId="+paramData.sbeqpId+"&regYn="+paramData.regYn;
 		 	break;
 		case "O" :
 			strSrc="";
 			break;
		default :
			break;
    	}
    	$("#ifrm").attr('src', strSrc);
    };

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