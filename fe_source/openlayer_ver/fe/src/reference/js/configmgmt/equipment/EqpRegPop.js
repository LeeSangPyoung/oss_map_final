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
	var otherFlag = "";
	var orgJrdtTeamOrgId = null; // 최초값 확인용. 정상적으로 관리팀 변경될 시 값 변경되어 저장
	var orgJrdtTeamOrgIdSave = null; // 변경전 값 확인용. 정상적으로 관리팀이 변경되지 않을 시 이전값으로 돌리기 위해 사용
	var orgEqpRoleDivCdSave = null; // 변경전 값 확인용. 변경전 장비타입 저장용
	var orgMgmtGrpNm = null;
	var eqpRoleDivNmDiv = null;

	var fdfEqpYn = "N";

    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	paramData = null;

    	if(param.regYn == "Y"){
    		if(param.eqpTid == null || param.eqpTid == undefined){
    			param.eqpTid = "";
    		}
    		if(param.upsdRackNo == null || param.upsdRackNo == undefined){
    			param.upsdRackNo = "";
    		}
    		if(param.upsdShlfNo == null || param.upsdShlfNo == undefined){
    			param.upsdShlfNo = "";
    		}
    		if(param.mainEqpIpAddr == null || param.mainEqpIpAddr == undefined){
    			param.mainEqpIpAddr = "";
    		}
    		paramData = param;
    		orgMgmtGrpNm = param.mgmtGrpNm;
    	}else {

    		if(param.eqpInstlMtsoIdReg != null || param.eqpInstlMtsoIdReg != undefined && (param.eqpInstlMtsoNmReg == null || param.eqpInstlMtsoNmReg == undefined)){
    			var param = {mtsoId : param.eqpInstlMtsoIdReg}
       		 	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoLkup', param, 'GET', 'mtsoNmList');
    		}

    	}
//    	alert(JSON.stringify(paramData));
        setEventListener();
        setSelectCode();
        setRegDataSet(param);

        //선택한 장비에 해당하는 수동등록여부 조회[20171019]
        httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/eqpPortPveRegIsolYn', param, 'GET', 'eqpPortPveRegIsolYn');

    };

  //장비모델ID 생성
    /*function setEqpMdlId(data) {

    	if(paramData == null){
	    	var id = "DV***********";

	    	$("#eqpIdReg").val(id);
    	}
    }*/

    function setRegDataSet(data) {

    	$('#btnUkeyEqpSearch').hide();
    	$("#ukeyEqpReg1").hide();
    	$("#ukeyEqpReg2").hide();


    	if(data.regYn == "Y"){
    		$('#btnEqpMdlSearch').hide();
        	$('#regYn').val("Y");

    		$('#eqpRegArea').setData(data);

    		if(data.cstrCd != "" && data.cstrCd != undefined) {
    			$("#cstrMgnoReg").val(data.cstrCd);
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/cstrCdToIntgFcltsCd', data, 'GET', 'cstrCdToIntgFcltsCd');
    		}


    		if(data.mgmtGrpNm == 'SKB'){
        		$("#ukeyEqpReg1").show();
        		$("#ukeyEqpReg2").show();
        		$("#intgFcltsCdReg1").hide();
        		$("#intgFcltsCdReg2").hide();

        	}

    		if(data.mgmtGrpNm == "SKB" && data.ukeyEqpMgmtNo == "" && (data.eqpRoleDivCd == '11' || data.eqpRoleDivCd == '177' || data.eqpRoleDivCd == '178' || data.eqpRoleDivCd == '182')){
        		$('#btnUkeyEqpSearch').show();
        	}

    		if(data.eqpRoleDivCd == '11' || data.eqpRoleDivCd == '177' || data.eqpRoleDivCd == '178' || data.eqpRoleDivCd == '182'){
        		$("#upsdReg").show();
        	}else{
        		$("#upsdReg").hide();
        	}

    		if (data.eqpRoleDivCd == '19' || data.eqpRoleDivCd == '52' || data.eqpRoleDivCd == '53') {		// SMUM, CMUX, LMUX 장비인 경우 (펌웨어/소프트웨어/장비용도 비활성)
     			$('#eqpFwVerValReg').setEnabled(false);
             	$('#swVerValReg').setEnabled(false);
             	$('#tnEqpUsgCdReg').setEnabled(false);
     		}else {
     			$('#eqpFwVerValReg').setEnabled(true);
             	$('#swVerValReg').setEnabled(true);
             	$('#tnEqpUsgCdReg').setEnabled(true);
     		}

    		if(data.eqpRoleDivCd == '10') {
    			// M/W 일 경우
    			$('#eqpHanNmLabel').html("GIS Layer명") ;
        		$('#swVerValLabel').html("라이선스") ;
        		$('#eqpRmkLabel').html("철탑정보") ;

        		$('#eqpHanNm').setEnabled(true);
        		document.getElementById('eqpRmkReg').placeholder = '사업자/형태/높이 (예, SKT/사각철탑/45m)';
    		}
    		else
    			document.getElementById('eqpRmkReg').placeholder = '';

    		if(data.gisUseYn == "Y"){
    			$('#upsdRackNoReg').setEnabled(false);
    			$('#upsdShlfNoReg').setEnabled(false);
    		}

    		//수정시에도 장비명 룰체크 적용
    		if(data.eqpRglaExprVal != "" && data.eqpRglaExprVal != undefined){
    			$('#eqpRule').val(data.eqpRuleRmk);
            	$('#eqpRglaExprVal').val(data.eqpRglaExprVal);

                $('#ruleChk').show();
        		$('#ruleChkErr').show();

        		ruleChk();
            }else{
                $('#ruleChkErr').hide();
                $('#ruleChk').hide();
            	$('#eqpRule').val("");
            	$('#eqpRuleErrMsg').val("");
            }
    		if(orgMgmtGrpNm == 'SKT' && $('#eqpMdlIdReg').val() != 'DMT0000009' && $('#eqpMdlIdReg').val() != 'DMB0000009'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bymdlTypMappList/'+$("#eqpMdlIdReg").val(), null,'GET', 'bymdlTypMapp'); //API 호출
    		}
    		else if (orgMgmtGrpNm == 'SKB' && $('#eqpMdlIdReg').val() != 'DMT0000009' && $('#eqpMdlIdReg').val() != 'DMB0000009') {
    			var paramMdl =  {"eqpMdlId": $("#eqpMdlIdReg").val()};
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/getFdfEqpYnCheck', paramMdl, 'GET', 'fdfEqpYn');
    		}
    		else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCdReg');
			}

    		if(data.trmsEqpYn == 'N'){
    			$('#btnIntgFcltsCdSearch').hide();
    		}else {
    			if(data.intgFcltsCd != null && data.intgFcltsCd != "" && data.intgFcltsCd != undefined){
    				$('#btnIntgFcltsCdSearch').hide();
        		}

    			if(data.cstrMgmtNo != null && data.cstrMgmtNo != "" && data.cstrMgmtNo != undefined){
    				$('#intgFcltsCdLabel').html("<em class=\"color_red\">*</em> 장비시설코드") ;
    			}

    		}




    	}else{
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCdReg');

    		$('#btnPortInfMgmtReg').setEnabled(false);
        	$('#btnEqpLnkgInfReg').setEnabled(false);
        	$('#btnEqpSctnCurstReg').setEnabled(false);
        	$('#btnSrvcLineCurstReg').setEnabled(false);
        	$('#btnChgHstReg').setEnabled(false);
        	$("#eqpIdReg").val("DV***********");

        	$("#cstrMgnoReg").val(data.cstrCd);
        	$("#wkrtNoReg").val(data.wkrtNo);
        	$('#skt2EqpYnReg').setSelected("NO");
        	$("#upsdReg").hide();
//    		$('#eqpStatCd').setSelected("");
//    		$('#eqpRegArea').clear();
        	if(data.cstrCd != null && data.cstrCd != "" && data.cstrCd != undefined){
        		otherFlag = "Y";

        		if(data.eqpRoleDivCd == '45' || data.eqpRoleDivCd == '19' || data.eqpRoleDivCd == '52' || data.eqpRoleDivCd == '53' || data.eqpRoleDivCd == '55') {
      				$('#barCodeLabel').html("<em class=\"color_red\">*</em> 바코드") ;
      			 }
        	}

        	//5G-PON 장비명 정규식 체크
            $('#ruleChkErr').hide();
            $('#ruleChk').hide();
        	$('#eqpRule').val("");
        	$('#eqpRuleErrMsg').val("");

        	//$('#intgFcltsCdLabel').html("장비시설코드") ;
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

    	//장비 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCdReg');
    	//장비 역할 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCdReg');
    	//관리팀 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teams', null, 'GET', 'teamOrgId');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpMgmtTeamGrp', null, 'GET', 'mgmtTeamOrgId');

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOpTeamGrp', null, 'GET', 'opTeamOrgId');
    	//소유사업자
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00405', null,'GET', 'ownBizrCd');
		//장비용도 조회 //라종식
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02193', null, 'GET', 'tnEqpUsgCdReg');

    }

    function setEventListener() {

    	//목록
    	 $('#btnPrevReg').on('click', function(e) {
    		 $a.close();
          });

    	//UKEY장비조회
    	 $('#btnUkeyEqpSearch').on('click', function(e) {
    		 var param =  $("#eqpRegForm").getData();

    		 param.ukeyEqpYn = "Y";
    		 param.mtsoNm = param.eqpInstlMtsoNm;

    		 $a.popup({
    	          	popid: 'UkeyEqpLkup',
    	          	title: '장비조회',
    	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.83,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	           		if(data.ukeyEqpMgmtNo != "" && data.ukeyEqpMgmtNo != null){
	    	           		$('#intgEqpId').val(data.eqpId);
	    	           		$('#intgEqpYn').val("Y");
	    	                $('#ukeyEqpMgmtNoReg').val(data.ukeyEqpMgmtNo);
    	           		}
    	           	}
    	      });
         });

    	//취소
    	 $('#btnCnclReg').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveReg').on('click', function(e) {

    		 var param =  $("#eqpRegForm").getData();

    		 if($('#eqpStatCdReg').val() == "01" && ($('#eqpRoleDivCdReg').val() == "07" || $('#eqpRoleDivCdReg').val() == "08" || $('#eqpRoleDivCdReg').val() == "10" ||  $('#eqpRoleDivCdReg').val() == "12" || $('#eqpRoleDivCdReg').val() == "14" || $('#eqpRoleDivCdReg').val() == "15" || $('#eqpRoleDivCdReg').val() == "16" || $('#eqpRoleDivCdReg').val() == "17" || $('#eqpRoleDivCdReg').val() == "18" || $('#eqpRoleDivCdReg').val() == "20" || $('#eqpRoleDivCdReg').val() == "21" || $('#eqpRoleDivCdReg').val() == "29" || $('#eqpRoleDivCdReg').val() == "179" || $('#eqpRoleDivCdReg').val() == "180")){
				 if($('#eqpTidReg').val() == ""){
	    			//필수 선택 항목입니다.[ 장비TID ]
	    			 callMsgBox('','W', '선택하신 장비 타입은 장비TID 항목이 필수입력 항목입니다.', function(msgId, msgRst){});
	    			 return;
	    		 }
	    	 }

    		 if (param.eqpNm == "") {
    	        //필수입력 항목입니다.[ 장비명 ]
   		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['equipmentName']), function(msgId, msgRst){});
    	     	return;
    	      }

    		 if ($('#eqpRuleErrMsg').val() != "") {
 	     		callMsgBox('','W', '장비명의 표기법이 옳바르지 않습니다.', function(msgId, msgRst){});
 	     		return;
 	     	 }

     		 if (param.eqpRoleDivCd == "") {
    	        //필수입력 항목입니다.[ 장비타입 ]
   		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['equipmentType']), function(msgId, msgRst){});
    	     	return;
    	      }

    		 if (param.eqpMdlId == "") {
 	        	//필수입력 항목입니다.[ 장비모델명 ]
		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['equipmentModelName']), function(msgId, msgRst){});
 	     		return;
 	     	 }

    		 if (param.eqpInstlMtsoId == "") {
 	    		//필수입력 항목입니다.[ 국사 ]
 	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
 	     		return;
 	     	 }

    		 if (otherFlag == "Y" && ($("#eqpRoleDivCdReg").val() == "19" || $("#eqpRoleDivCdReg").val() == "45" || $("#eqpRoleDivCdReg").val() == "55") && $('#eqpRglaExprVal').val() != "" && param.barNo == "") {
  	    		//필수입력 항목입니다.[ 바코드 ]

    			 if($("#eqpRoleDivCdReg").val() == "19") {
    				 callMsgBox('','W', 'SMUX 장비개통인 경우 바코드는 필수 입력 항목입니다.', function(msgId, msgRst){});
    			 } else if ($("#eqpRoleDivCdReg").val() == "55") {
    				 callMsgBox('','W', '5GPON 2.0 장비개통인 경우 바코드는 필수 입력 항목입니다.', function(msgId, msgRst){});
    			 }
    			 else {
    				 callMsgBox('','W', '5GPON 3.1 장비개통인 경우 바코드는 필수 입력 항목입니다.', function(msgId, msgRst){});
    			 }


  	     		return;
  	     	 }

    		 if (param.eqpStatCd == "") {
  	     	    //필수입력 항목입니다. [ 장비상태 ]
  	     		callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['equipmentStatus']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.jrdtTeamOrgId == "") {
	     	    //필수입력 항목입니다. [ 관리팀 ]
	     		callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['managementTeam']), function(msgId, msgRst){});
	     		return;
	     	 }

    		 if (param.trmsEqpYn == "Y" && param.intgFcltsCd == "" && (param.cstrMgmtNo !="" && param.eqpStatCd != "02")) {
    			 callMsgBox('','W', '전송장비인 경우에는 장비시설코드는 필수 입력 항목입니다..', function(msgId, msgRst){});
 	     		return;
    		 }

    		 if($("#upsdReg").css('display')!= 'none'){
        		 if (param.upsdRackNo == "") {
        			 //필수입력 항목입니다. [ 상면랙번호 ]
        			 callMsgBox('','W', '필수입력 항목입니다. [ 상면랙번호 ]', function(msgId, msgRst){});
        			 return;
        		 }
        		 if (param.upsdShlfNo == "") {
        			 //필수입력 항목입니다. [ 상면쉘프번호 ]
        			 callMsgBox('','W', '필수입력 항목입니다. [ 상면쉘프번호 ]', function(msgId, msgRst){});
        			 return;
        		 }
    		 }

   			var codeID =  $("#eqpRoleDivCdReg").getData();

			if(codeID.eqpRoleDivCd == '11' || codeID.eqpRoleDivCd == '177' || codeID.eqpRoleDivCd == '178' || codeID.eqpRoleDivCd == '182'){
	 	   		var defaultEqpNm = "";
		   		defaultEqpNm = "FDF#"+$('#upsdRackNoReg').getData().upsdRackNo+"R-"+$('#upsdShlfNoReg').getData().upsdShlfNo+"S_"+$('#eqpInstlMtsoNmReg').val();
		   		$('#eqpNmReg').val(defaultEqpNm);
			}


			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMdlTypChk', param, 'GET', 'eqpMdlTypChk');


//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/dupEqpNm', param, 'GET', 'dupEqpNm');
         });

    	//장비모델조회
    	 $('#btnEqpMdlSearch').on('click', function(e) {
    		 //수정
    		 var param = {"eqpRoleDivCd": $('#eqpRoleDivCdReg').val(), "mgmtGrpNm": orgMgmtGrpNm};
    		 orgJrdtTeamOrgId = $('#jrdtTeamOrgIdReg').val();
    		 orgEqpRoleDivCdSave = $('#eqpRoleDivCdReg').val();
    		 $a.popup({
    	          	popid: 'EqpMdlLkup',
    	          	title: configMsgArray['equipmentModelLkup'],
    	            url: '/tango-transmission-web/configmgmt/equipment/EqpMdlLkup.do',
    	            windowpopup : true,
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.9,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#eqpMdlNmReg').val(data.eqpMdlNm);
    	                $('#eqpMdlIdReg').val(data.eqpMdlId);
    	                $('#eqpRoleDivCdReg').setData({
    	    	             eqpRoleDivCd:data.eqpRoleDivCd
    	    			});

    	                $('#eqpRule').val("");
	                	$('#eqpRglaExprVal').val("");
	                	$('#eqpRuleErrMsg').val("");

	                	if(data.eqpMdlId != null && data.eqpMdlId != ''){
	                		orgMgmtGrpNm = data.mgmtGrpNm;
							//그룹별 관리팀 조회
					    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpMgmtTeamGrp', null, 'GET', 'mgmtTeamOrgIdBygrp');
						}
						if(data.eqpMdlId != null && data.eqpMdlId != '' && orgMgmtGrpNm == 'SKT' && $('#eqpMdlIdReg').val() != 'DMT0000009' && $('#eqpMdlIdReg').val() != 'DMB0000009'){
	                		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bymdlTypMappList/'+$("#eqpMdlIdReg").val(), null,'GET', 'bymdlTypMapp'); //API 호출
	                	}
	                	else {
	    	                eqpRoleDivNmDiv = (data.eqpRoleDivNm).split(',');
	    	                if(eqpRoleDivNmDiv[1] == null || eqpRoleDivNmDiv[1] == '' || eqpRoleDivNmDiv[1] == undefined || eqpRoleDivNmDiv[1] == 'undefined') {
	    	                	eqpRoleDivNmDiv = eqpRoleDivNmDiv[0];
	    	                }
	    	                else {
	    	                	eqpRoleDivNmDiv = null;
	    	                }
	                    	//장비 역할 조회
	                    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCdReg');
	                	}

    	              //5G-PON 장비명 정규식 체크
    	                if(data.eqpRglaExprVal != "" && data.eqpRglaExprVal != undefined){
    	                	$('#eqpRule').val(data.eqpRuleRmk);
    	                	$('#eqpRglaExprVal').val(data.eqpRglaExprVal);

        	                $('#ruleChk').show();
    		        		$('#ruleChkErr').show();

    		        		ruleChk();
    	                }else{
    	                	$('#ruleChk').hide();
    		        		$('#ruleChkErr').hide();
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
    	           	height : window.innerHeight * 0.9,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행

	                $('#eqpInstlMtsoNmReg').val(data.mtsoNm);
	                $('#eqpInstlMtsoIdReg').val(data.mtsoId);
	                $('#eqpTmofReg').val(data.tmofNm);
	                $('#jrdtTeamOrgIdReg').setData({
	                	jrdtTeamOrgId:data.teamId
	        		});
	                $('#opTeamOrgIdReg').setData({
	                	opTeamOrgId:data.teamId
	        		});
	                var ownBizrCd = "";
	                if(data.mgmtGrpNm == "SKT"){
	                	ownBizrCd = "01";
	                }else if(data.mgmtGrpNm == "SKB"){
	                	ownBizrCd = "02";
	                }
	                $('#ownBizrCdReg').setData({
	                	ownBizrCd:ownBizrCd
	        		});

	                if($("#upsdReg").css('display')!= 'none'){
    	                var defaultEqpNm = "";
    	    	   		defaultEqpNm = "FDF#"+$('#upsdRackNoReg').getData().upsdRackNo+"R-"+$('#upsdShlfNoReg').getData().upsdShlfNo+"S_"+$('#eqpInstlMtsoNmReg').val();
    	    	   		$('#eqpNmReg').val(defaultEqpNm);
	                }

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
    	            url: '/tango-transmission-web/configmgmt/shpmgmt/BarcodeInfoListPop.do',
    	            windowpopup : true,
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 1300,
    	           	height : window.innerHeight * 0.82,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                if(data != "[object Object]" && data != "" && data != null){
    	           			$('#barNoReg').val(data);
    	           		}
    	           	}
    	      });
         });

    	//장비타입 선택시 이벤트
     	 $('#eqpRoleDivCdReg').on('change', function(e) {
          	//tango transmission biz 모듈을 호출하여야한다.
     		 var codeID =  $("#eqpRoleDivCdReg").getData();
     		 var cstrCd = $("#cstrMgnoReg").getData();


 			 if(codeID.eqpRoleDivCd == '11' || codeID.eqpRoleDivCd == '177' || codeID.eqpRoleDivCd == '178' || codeID.eqpRoleDivCd == '182'){
 				 $("#upsdReg").show();
 			 }else{
 				 $("#upsdReg").hide();
 			 }

 			if(codeID.eqpRoleDivCd == '19' || codeID.eqpRoleDivCd == '52' || codeID.eqpRoleDivCd == '53'){
 				$('#eqpFwVerValReg').setEnabled(false);
 	        	$('#swVerValReg').setEnabled(false);
 	        	$('#tnEqpUsgCdReg').setEnabled(false);
 	        	$('#tnEqpUsgCdReg').setSelected("");
 			}else {
 				$('#eqpFwVerValReg').setEnabled(true);
 	        	$('#swVerValReg').setEnabled(true);
 	        	$('#tnEqpUsgCdReg').setEnabled(true);
 			}

 			if(codeID.eqpRoleDivCd == '10') {
 				// M/W 일 경우
 				$('#eqpHanNmLabel').html("GIS Layer명") ;
 	    		$('#swVerValLabel').html("라이선스") ;
 	    		$('#eqpRmkLabel').html("철탑정보") ;

 	    		$('#eqpHanNm').setEnabled(true);

 	    		document.getElementById('eqpRmkReg').placeholder = '사업자/형태/높이 (예, SKT/사각철탑/45m)';


 			}
 			else {
 				$('#eqpHanNmLabel').html("장비한글명") ;
 	    		$('#swVerValLabel').html("소프트웨어버전값") ;
 	    		$('#eqpRmkLabel').html("비고") ;

 	    		if(paramData != '' && paramData != null) {
 	    			if(paramData.regYn == "Y"){
 	    				$('#eqpHanNm').val(paramData.eqpHanNm);
 	    			}
 	    		}
 	    		$('#eqpHanNm').setEnabled(false);

 	    		document.getElementById('eqpRmkReg').placeholder = '';

 			}


 			if(cstrCd != null && cstrCd != "" && cstrCd != undefined){
 				 if(codeID.eqpRoleDivCd == '45' || codeID.eqpRoleDivCd == '19' || codeID.eqpRoleDivCd == '52' || codeID.eqpRoleDivCd == '53' || codeID.eqpRoleDivCd == '55' ) {
 	  				$('#barCodeLabel').html("<em class=\"color_red\">*</em> 바코드") ;
 	  			 }
 	 			else {
 	    			$('#barCodeLabel').html("바코드") ;
 	    		}
 			}


 			 if(paramData != '' && paramData != null) {
	 			 if(paramData.regYn == "Y"){
	 				if(paramData.mgmtGrpNm == "SKB" && paramData.ukeyEqpMgmtNo == "" && (codeID.eqpRoleDivCd == '11' || codeID.eqpRoleDivCd == '177' || codeID.eqpRoleDivCd == '178' || codeID.eqpRoleDivCd == '182')){
	 					 $('#btnUkeyEqpSearch').show();
	 				 }else{
	 					 $('#btnUkeyEqpSearch').hide();
	 					 $('#intgEqpId').val("");
	 					 $('#intgEqpYn').val("N");
	 					 $('#ukeyEqpMgmtNoReg').val("");
	 				 }
	 			 }
 			 }

 			if(codeID.eqpRoleDivCd == '19' || codeID.eqpRoleDivCd == '45' || codeID.eqpRoleDivCd == '52' || codeID.eqpRoleDivCd == '53' || codeID.eqpRoleDivCd == '55'){		// SMUX 이중화에 경우 동일 모델에 타입이 다중이기 때문에 타입 변경이 네이일룰 재조회

 				var leqpRoleDivCd = codeID.eqpRoleDivCd;
 				var leqpMdlId = $("#eqpMdlIdReg").getData().eqpMdlId;
 				var lmgmtGrpNm = orgMgmtGrpNm;

 				if(leqpRoleDivCd != '' && leqpRoleDivCd != null && leqpMdlId != '' && leqpMdlId != null) {
 					var param = {eqpRoleDivCd : leqpRoleDivCd ,eqpMdlId : leqpMdlId ,mgmtGrpNm : lmgmtGrpNm};
// 					SMUX 이원화 기능 주석
 	 				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/sktEqpMdlLkup', param, 'GET', 'eqpRuleReSearch');
 				}


 			}

         });

     	//관리팀 선택시 이벤트
     	 $('#jrdtTeamOrgIdReg').on('change', function(e) {
          	//tango transmission biz 모듈을 호출하여야한다.
     		var codeNm =  $("#jrdtTeamOrgIdReg").getTexts()+"";
     		codeNm = codeNm.substr(0,3);
     		orgJrdtTeamOrgIdSave = orgJrdtTeamOrgId;
     		var ownBizrCd = "";
     		orgMgmtGrpNm = codeNm;
     		if($("#eqpMdlIdReg").val()!=''&&$("#eqpMdlIdReg").val()!=null&$('#regYn').val()=='Y'){
 				if(codeNm == 'SKT'){
     				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bymdlTypMappList/'+$("#eqpMdlIdReg").val(), null,'GET', 'bymdlTypMapp'); //API 호출
     			}
     			else {
     				//장비 역할 조회
                	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCdReg');
     			}
     		}
            if(codeNm == "SKT"){
            	ownBizrCd = "01";
            }else if(codeNm == "SKB"){
            	ownBizrCd = "02";
            }
            $('#ownBizrCdReg').setData({
            	ownBizrCd:ownBizrCd
    		});
         });
     	//관리팀 선택시 이벤트
     	 $('#jrdtTeamOrgIdReg').on('click', function(e) {
     		 //tango transmission biz 모듈을 호출하여야한다.
     		 orgJrdtTeamOrgId =  $("#jrdtTeamOrgIdReg").val();
     	 });

    	 $('#portCntReg').keyup(function(e) {
    	 		if(!$("#portCntReg").validate()){
 	   			//포트수는 숫자만 입력 가능합니다.
 	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['portCount'] ), function(msgId, msgRst){});
 	   			$('#portCntReg').val("");
 	   			 return;
 	   		};
    	 	});

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

    	 $('#eqpNmReg').keyup(function(e) {
    		 ruleChk();
    	 });

    	 $('#eqpNmReg').on('click', function(e) {
    		 if($('#eqpRglaExprVal').val() != ""){
        		 $('#ruleChk').show();
        		 $('#ruleChkErr').show();
    		 }
         });

    	 $('#eqpNmReg').on('blur', function(e) {
    		 if($('#eqpMdlIdReg').val() != "" && $('#eqpRuleErrMsg').val() == ""){
	    		 $('#ruleChk').hide();
	    		 $('#ruleChkErr').hide();
    		 }
         });


    	 //랙번호 입력시
    	 $('#upsdRackNoReg').keyup(function(e) {
 	 		if(!$("#upsdRackNoReg").validate()){
	   			//랙번호는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['rackNumber'] ), function(msgId, msgRst){});
	   			$('#upsdRackNoReg').val("");
	   			 return;
	   		};
	   		//default 장비명세팅(FDF#랙번호-쉘프번호)
	   		var defaultEqpNm = "";
	   		defaultEqpNm = "FDF#"+$('#upsdRackNoReg').getData().upsdRackNo+"R-"+$('#upsdShlfNoReg').getData().upsdShlfNo+"S_"+$('#eqpInstlMtsoNmReg').val();
	   		$('#eqpNmReg').val(defaultEqpNm);
 	 	 });

    	 //쉘프번호 입력시
    	 $('#upsdShlfNoReg').keyup(function(e) {
 	 		if(!$("#upsdShlfNoReg").validate()){
	   			//쉘프번호는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['shelfNumber'] ), function(msgId, msgRst){});
	   			$('#upsdShlfNoReg').val("");
	   			 return;
	   		};
	   		//default 장비명세팅(FDF#랙번호-쉘프번호)
	   		var defaultEqpNm = "";
	   		defaultEqpNm = "FDF#"+$('#upsdRackNoReg').getData().upsdRackNo+"R-"+$('#upsdShlfNoReg').getData().upsdShlfNo+"S_"+$('#eqpInstlMtsoNmReg').val();
	   		$('#eqpNmReg').val(defaultEqpNm);
 	 	 });

    	 $('#btnIntgFcltsCdSearch').on('click', function(e) {

     		 $a.popup({
 		          	popid: 'IntgFcltsSearchPop',
 		          	/* 포트현황		 */
 		          	title: '통합시설검색',
 		            url: '/tango-transmission-web/demandmgmt/common/IntgFcltsSearchPopup.do',
 		            data : {
 		            	reqMode : "TE"
 		            },
 		            windowpopup : true,
 		            modal: true,
 		            movable:true,
 		            width : 1300,
// 		            height : window.innerHeight * 0.7,
 		           height : window.innerHeight * 0.8,
 		           callback : function(data) {

 		        	  if(data.intgFcltsDivCd == "13" || data.intgFcltsDivCd == "05" || data.intgFcltsDivCd == "06") {
 		        		 $('#intgFcltsCdReg').val(data.intgFcltsCd);
 		        		console.log($('#intgFcltsCdReg').val());
 		        	  } else {
 		        		 callMsgBox('','I', "통합시설코드에 조회구분이 전송장비/전송실/지역중심국인 경우만 선택 가능합니다." , function(msgId, msgRst){});
 		        	  }

					}
 		   	});
 	   	 });

	};

	//5G-PON 장비명 정규식 체크
	function ruleChk(){
		 if($('#eqpRglaExprVal').val() != ""){
	   		 var name = $('#eqpNmReg').val();
	   		 var rglaExprVal = $('#eqpRglaExprVal').val();

	   		 var num = 0;
   			 var ruleInf = new RegExp("^"+rglaExprVal+"$", "g");
   			 if(ruleInf.test(name)){
   				 num++;
   			 }

	   		 if(num > 0){
	   			 $('#eqpRuleErrMsg').val("");
	   		 }else{
	   			 $('#eqpRuleErrMsg').val("'"+name+"' 의 표기법은 옳바르지 않습니다.");
	   		 }
		 }
	}

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'EqpReg') {
    		if(response.Result == "Success"){

        		//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
        			if (msgRst == 'Y') {
        				$a.close(response.resultList);
        			}
        		});

        		if(response.resultList.lnkgDatDivCd == "U" && response.resultList.eqpStatCd == "02"){
        			response.resultList.lnkgDatDivCd = "D";
        		}

        		param = response.resultList;
        		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO001Send', param, 'POST', '');

        		//S-MUX 장비타입으로 등록 시 포트 템플릿 테이블의 내용으로 포트 등록 20181109
        		// 조건 equls 변경 - 라종식 20190328
//        		if(( paramData == '' || paramData == null || paramData == "undefined" || paramData == undefined ) && ($("#eqpRoleDivCdReg").val() == "19" || $("#eqpRoleDivCdReg").val() == "45") && $('#eqpRglaExprVal').val() != ""){
//    				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/insertEqpMdlPort', param, 'POST', '');
//    			}

        		var pageNo = $("#pageNo", parent.document).val();
        		var rowPerPage = $("#rowPerPage", parent.document).val();

//                $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    		}else if(response.Result == "DupUpsdMtso"){
    			callMsgBox('','I', "동일 국사에 동일한 상면랙/상면쉘프 번호를 가진 FDF가 있습니다." , function(msgId, msgRst){});
    		}else if(response.Result == "DupTidModelTmof"){
    			var param =  $("#eqpRegForm").getData();
    			if(param.eqpRoleDivCd != '08' && param.eqpRoleDivCd != '21') {
    				callMsgBox('','I', "선택한 모델, TID, 전송실 값을 다른 장비에서 이미 사용 중 입니다." , function(msgId, msgRst){});
    			}
    			else{
    				callMsgBox('','I', "선택한 모델, TID 값을 다른 장비에서 이미 사용 중 입니다.<br>(ROADM/OTN모델인 경우 동일한 모델내에 동일한 TID를 사용할 수 없습니다.)", function(msgId, msgRst){}); //라종식
    			}
    		}else if(response.Result == "DupMainEqpIpAddrCnt"){
    			callMsgBox('','I', "이미 사용중인 장비IP 입니다." , function(msgId, msgRst){});
    		}else if(response.Result == "ExistsNtwkLine"){
    			var param =  $("#eqpRegForm").getData();
    			param.eqpRegCheck = 'ExistsNtwkLine';
    	   		popupList('EqpNtwkLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
    		}else if(response.Result == "ExistsSrvcLine"){
    	   		var param =  $("#eqpRegForm").getData();
    			param.eqpRegCheck = 'ExistsSrvcLine';
    	   		popupList('EqpSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
        	 }else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'eqpStatCdReg'){

    		$('#eqpStatCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

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
    			var eqpStatCdData;
    			if(paramData.mgmtInfNrgstYn == "YES"){
    				eqpStatCdData = "01";
	   		 	}else{
	   		 		eqpStatCdData = paramData.eqpStatCd;
	   		 	}
    			$('#eqpStatCdReg').setData({
    	             data:option_data,
    	             eqpStatCd:eqpStatCdData
    			});
    		}
    	}

    	if(flag == 'tnEqpUsgCdReg'){ //라종식

    		$('#tnEqpUsgCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
    		if(paramData == '' || paramData == null) {
    			$('#tnEqpUsgCdReg').setData({
    	             data:option_data,
    	             tnEqpUsgCd: ""
    			});
    		}
    		else {
    			var tnEqpUsgCdData = paramData.tnEqpUsgCd;
    			$('#tnEqpUsgCdReg').setData({
    	             data:option_data,
    	             tnEqpUsgCd:tnEqpUsgCdData
    			});
    		}
    	}

    	if(flag == 'eqpRoleDivCdReg'){

    		$('#eqpRoleDivCdReg').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
					option_data.push(resObj);
				if(eqpRoleDivNmDiv != '' || eqpRoleDivNmDiv != null){
					if(option_data[i].comCdNm == eqpRoleDivNmDiv){
						eqpRoleDivNmDiv = option_data[i].comCd;
					}
				}
			}

			if(paramData == '' || paramData == null) {

				// SKB 장비 수정일 경우 FDF 계정 장비 모델이 아닌 경우 FDF 타입 제거
    			if (orgMgmtGrpNm == "SKB" && fdfEqpYn == "N") {
    				for(var i=0; i<option_data.length; i++){
    					if (option_data[i].comCd == "11" || option_data[i].comCd == "177" || option_data[i].comCd == "178" || option_data[i].comCd == "182") {
    						option_data.splice(i,1);
    						i--;
    					}
    				}
    			}

				if(eqpRoleDivNmDiv == '' || eqpRoleDivNmDiv == null){
					$('#eqpRoleDivCdReg').setData({
			             data:option_data,
			             eqpRoleDivCd:orgEqpRoleDivCdSave
					});
				}
				else {
					$('#eqpRoleDivCdReg').setData({
			             data:option_data,
			             eqpRoleDivCd:eqpRoleDivNmDiv
					});
				}
			}
    		else {

    			// SKB 장비 수정일 경우 FDF 계정 장비 모델이 아닌 경우 FDF 타입 제거
    			if (paramData.mgmtGrpNm == "SKB" && fdfEqpYn == "N") {
    				for(var i=0; i<option_data.length; i++){
    					if (option_data[i].comCd == "11" || option_data[i].comCd == "177" || option_data[i].comCd == "178" || option_data[i].comCd == "182") {
    						option_data.splice(i,1);
    						i--;
    					}
    				}
    			}

    			$('#eqpRoleDivCdReg').setData({
    	             data:option_data,
    	             eqpRoleDivCd:paramData.eqpRoleDivCd
    			});
    		}
    	}
    	if(flag == 'mgmtTeamOrgIdBygrp'){

    		$('#jrdtTeamOrgIdReg').clear();

    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: configMsgArray['select']}];
    		var mgmtGrpNm = orgMgmtGrpNm;
    		var selectId = null;

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				var tmp = (resObj.orgNm).split('/');
				if(tmp[0].trim() == mgmtGrpNm) {
					if(resObj.orgId == orgJrdtTeamOrgId){
						selectId = resObj.orgId;
					}
					option_data.push(resObj);
				}
			}

    		if(selectId == '' || selectId == null) {
    			$('#jrdtTeamOrgIdReg').setData({
   	             data:option_data
    			});
    		}
    		else {
    			$('#jrdtTeamOrgIdReg').setData({
    	             data:option_data,
    	             jrdtTeamOrgId:selectId
    			});
    		}
    	}
    	if(flag == 'mgmtTeamOrgId'){

    		$('#jrdtTeamOrgIdReg').clear();

    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#jrdtTeamOrgIdReg').setData({
   	             data:option_data
    			});
    		}
    		else {
    			$('#jrdtTeamOrgIdReg').setData({
    	             data:option_data,
    	             jrdtTeamOrgId:paramData.jrdtTeamOrgId
    			});
    		}
    	}

    	if(flag == 'opTeamOrgId'){

    		$('#opTeamOrgIdReg').clear();

    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#opTeamOrgIdReg').setData({
      	             data:option_data
       			});
    		}
    		else {
    			$('#opTeamOrgIdReg').setData({
   	             data:option_data,
   	             opTeamOrgId:paramData.opTeamOrgId
    			});
    		}
    	}

    	if(flag == 'ownBizrCd'){
    		$('#ownBizrCdReg').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#ownBizrCdReg').setData({
                 data:option_data
    		});
    	}

    	//장비ID 생성
    	if(flag == 'eqpIdReg'){

    		$("#eqpIdReg").val(response.eqpId);
    	}

    	if(flag == 'dupEqpNm'){
    		var param =  $("#eqpRegForm").getData();
    		var dupEqpNmMsg = "";

    		if($('#regYn').val() == "Y"){
    			if(response.dupEqpNm > 0 && (paramData.eqpNm != param.eqpNm || (paramData.eqpStatCd != param.eqpStatCd && param.eqpStatCd == "01")) && param.eqpRoleDivCd != "11" && param.eqpRoleDivCd != "177" && param.eqpRoleDivCd != "178" && param.eqpRoleDivCd != "182"){
    				dupEqpNmMsg = "같은 이름의 장비가 존재합니다.<br><br>"+configMsgArray['saveConfirm'];
    			}else{
    				dupEqpNmMsg = configMsgArray['saveConfirm'];
    			}
    		}else{
    			if(response.dupEqpNm > 0 && param.eqpRoleDivCd != "11" && param.eqpRoleDivCd != "177" && param.eqpRoleDivCd != "178" && param.eqpRoleDivCd != "182"){
    				dupEqpNmMsg = "같은 이름의 장비가 존재합니다.<br><br>"+configMsgArray['saveConfirm'];
    			}else{
    				dupEqpNmMsg = configMsgArray['saveConfirm'];
    			}
    		}

    		callMsgBox('','C', dupEqpNmMsg, function(msgId, msgRst){
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	eqpReg();
 		        }
 		    });
    	}

        /* 선택한 장비에 해당하는 수동등록여부 처리_S_[20171019] */
        if(flag == 'eqpPortPveRegIsolYn'){
            if(response.Result == 'Y'){
                $('#btnPortInfCopyReg').setEnabled(false);
            }
        }
        //T장비일 경우 해당 장비 모델에 매핑되는 타입인지 체크
        if(flag == 'eqpMdlTypChk'){
        	var param =  $("#eqpRegForm").getData();
        	console.log(param.intgFcltsCd)
        	if(response.eqpMdlTypChkResult == '' || response.eqpMdlTypChkResult == null){
        		if(orgMgmtGrpNm=='SKT' && $('#eqpMdlIdReg').val() != 'DMT0000009' && $('#eqpMdlIdReg').val() != 'DMB0000009'){
        			callMsgBox('','W', "해당 모델에서 선택하신 타입은 SKT모델에서 관리되지 않습니다.<br>장비타입을 변경하거나 변경가능한 장비타입이 없는경우<br>SKB 관리팀으로 변경해 주십시오. ", function(msgId, msgRst){});
    	     		return;
        		}
        		else{
        			//httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/dupEqpNm', param, 'GET', 'dupEqpNm');
        			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/dupEqpIntgFcltCdChk', param, 'GET', 'dupEqpIntgFcltCdChk');
        		}
        	}
        	else {
        		//httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/dupEqpNm', param, 'GET', 'dupEqpNm');
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/dupEqpIntgFcltCdChk', param, 'GET', 'dupEqpIntgFcltCdChk');
        	}
        }
        /* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */
        //20190212 모델별 타입조회
		if(flag == 'bymdlTypMapp'){
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			if(option_data[1] == null || option_data[1] == '' || option_data[1] == 'undefined'){
				$('#jrdtTeamOrgIdReg').setData({
					jrdtTeamOrgId:orgJrdtTeamOrgIdSave
				});
				if (orgMgmtGrpNm == 'SKT' && $('#eqpMdlIdReg').val() != 'DMT0000009' && $('#eqpMdlIdReg').val() != 'DMB0000009'){
					callMsgBox('','W', "해당 모델장비는 SKT에서 관리되지 않는 모델 입니다. <br>SKB관리팀으로 변경시 기존 장비타입을 가져옵니다." , function(msgId, msgRst){});
					if($('#regYn').val()=='Y'){
						$('#eqpRoleDivCdReg').clear();
						$('#eqpRoleDivCdReg').setData({
				             data:option_data
						});
					}
				}
				else {
					callMsgBox('','W', "해당 모델장비는 SKT에서 관리되지 않는 모델 입니다." , function(msgId, msgRst){});
				}
			}
			else {
				if(option_data[1].comCd != null && option_data[1].comCd != '' && option_data[1].comCd != 'undefined' ) {
					$('#eqpRoleDivCdReg').clear();
					if(paramData == '' || paramData == null) {
						if(option_data.length > 2){
							$('#eqpRoleDivCdReg').setData({
					             data:option_data,
					             eqpRoleDivCd:orgEqpRoleDivCdSave
							});
						}
						else {
							$('#eqpRoleDivCdReg').setData({
					             data:option_data,
					             eqpRoleDivCd:option_data[1].comCd
							});
						}
					}
					else {
						$('#eqpRoleDivCdReg').setData({
				             data:option_data,
				             eqpRoleDivCd:paramData.eqpRoleDivCd
						});
					}
				}
			}
		}

		if(flag == 'mtsoNmList'){

			$('#eqpInstlMtsoNmReg').val(response.mtsoLkupList[0].mtsoNm);
            $('#eqpInstlMtsoIdReg').val(response.mtsoLkupList[0].mtsoId);
            $('#eqpTmofReg').val(response.mtsoLkupList[0].tmofNm);
            $('#jrdtTeamOrgIdReg').setData({
            	jrdtTeamOrgId:response.mtsoLkupList[0].teamId
    		});
            $('#opTeamOrgIdReg').setData({
            	opTeamOrgId:response.mtsoLkupList[0].teamId
    		});
            var ownBizrCd = "";
            if(response.mtsoLkupList[0].mgmtGrpNm == "SKT"){
            	ownBizrCd = "01";
            }else if(response.mtsoLkupList[0].mgmtGrpNm == "SKB"){
            	ownBizrCd = "02";
            }
            $('#ownBizrCdReg').setData({
            	ownBizrCd:ownBizrCd
    		});

		}
		if(flag == 'eqpRuleReSearch'){

			$('#eqpRule').val("");
          	$('#eqpRglaExprVal').val("");
          	$('#eqpRuleErrMsg').val("");



            //5G-PON 장비명 정규식 체크
              if(response.eqpMdlLkupList[0].eqpRglaExprVal != "" && response.eqpMdlLkupList[0].eqpRglaExprVal != undefined){
              	$('#eqpRule').val(response.eqpMdlLkupList[0].eqpRuleRmk);
              	$('#eqpRglaExprVal').val(response.eqpMdlLkupList[0].eqpRglaExprVal);

	                $('#ruleChk').show();
	        		$('#ruleChkErr').show();

	        		ruleChk();
              }else{
              	$('#ruleChk').hide();
	        		$('#ruleChkErr').hide();
              }
		}

		if(flag == 'dupEqpIntgFcltCdChk'){

			if(response.eqpIntgFcltCdResult != '' && response.eqpIntgFcltCdResult != null){
				//callMsgBox('','I', "해당 국사는 ["+mtsoUseChk_data[0]+" "+ mtsoUseChk_data[1] + " " + mtsoUseChk_data[2] + "] 모듈에서 사용하고있는 국사 입니다. 철거 하실 수 없습니다.<br> * 철거불가 예1)  GIS에 입력된 국사일 경우 <br> * 철거불가 예2) 회선 상하위국사 혹은 관할국사로 입력된 국사일 경우 <br> * 철거불가 예3) 링 상하위국사 혹은 관할국사로 입력된 국사일 경우", function(msgId, msgRst){});
				callMsgBox('','W', "해당 장비시설코드는 [" + response.eqpIntgFcltCdResult + "] 장비에서 사용중입니다." , function(msgId, msgRst){});
				return;

			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/dupEqpNm', param, 'GET', 'dupEqpNm');
			}

		}

		if(flag == 'cstrCdToIntgFcltsCd'){
			if(response.cstrCdToIntgFcltsCdResult != '' && response.cstrCdToIntgFcltsCdResult != null){
				$("#intgFcltsCdReg").val(response.cstrCdToIntgFcltsCdResult);
				$("#btnIntgFcltsCdSearch").hide();
			}
		}

		if(flag == 'fdfEqpYn'){

			fdfEqpYn = response.fdfEqpYnCheck;

			if (response.fdfEqpYnCheck == 'Y') {

				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bymdlTypMappList/'+$("#eqpMdlIdReg").val(), null,'GET', 'bymdlTypMapp'); //API 호출
			}else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCdReg');
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

    function eqpReg() {

		 var param =  $("#eqpRegForm").getData();

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

		 if(param.skt2EqpYn == "YES"){
			 param.skt2EqpYn = "Y";
		 }else{
			 param.skt2EqpYn = "N";
		 }

		 if(param.portCnt == ""){
			 param.portCnt = "0";
		 }

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 if(param.eqpRoleDivCd != '11' && param.eqpRoleDivCd != '177' && param.eqpRoleDivCd != '178' && param.eqpRoleDivCd != '182'){
			 param.upsdRackNo = "";
			 param.upsdShlfNo = "";
		 }

    	 if($('#regYn').val() == "Y"){

    		 param.orglEqpNm = paramData.eqpNm;
    		 param.orglEqpTid = paramData.eqpTid;
    		 param.orglEqpMdlId = paramData.eqpMdlId;
    		 param.orglMtsoId = paramData.eqpInstlMtsoId;
    		 param.orglTmof = paramData.tmof;
    		 param.orglMainEqpIpAddr = paramData.mainEqpIpAddr;
    		 param.orglEqpStatCd = paramData.eqpStatCd;
    		 param.orglEqpRoleDivCd = paramData.eqpRoleDivCd;

    		 if(paramData.upsdRackNo != $('#upsdRackNoReg').val() || paramData.upsdShlfNo != $('#upsdShlfNoReg').val() || paramData.eqpInstlMtsoId != $('#eqpInstlMtsoId').val()){
    			 param.dupChk = "Y";
    		 }else{
    			 param.dupChk = "N";
    		 }
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/updateEqpMgmt', param, 'POST', 'EqpReg');
    	 }else{
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/insertEqpMgmt', param, 'POST', 'EqpReg');
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
                  windowpopup : true,
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