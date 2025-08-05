/**
 * EqpFdfReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
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
    	setSelectCode(param);     //select 정보 세팅
        setEventListener();  //이벤트
    };

    /*-----------------------------*
     *  넘어온 데이터 세팅
     *-----------------------------*/
    function setRegDataSet(data) {

    	//국사코드가 넘어 왔으면
    	if (paramData != null && paramData != ""){
    		var mtsoId = null;
    		mtsoId = paramData.mtsoId;
    		if (mtsoId != null && mtsoId != ""){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', paramData, 'GET', 'setMtsoInf');
    		}

    		if(data.regYn == "Y"){
				//장비모델조회
		 		var param = new Object();
		 		param.eqpRoleDivCd= data.eqpRoleDivCd;
		 		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlSimple', param, 'GET', 'setEqpMdlInf');

        		$('#eqpFdfRegArea').setData(data);
        		$('#rackNumberReg').val(data.upsdRackNo);
        		$('#shelfNumberReg').val(data.upsdShlfNo);
        		$('#eqpInstlMtsoNmReg').setEnabled(false);
        		$('#btnMtsoSearch').hide();
//        		$('#rackNumberReg').setEnabled(false);
//        		$('#shelfNumberReg').setEnabled(false);
        		if (data.upsdRackNo != null && data.upsdRackNo != ""){
        			$('#rackNumberReg').setEnabled(false);
        		}
        		if (data.upsdShlfNo != null && data.upsdShlfNo != ""){
        			$('#shelfNumberReg').setEnabled(false);
        		}
        		$('#eqpNmReg').setEnabled(false);
        		$('#eqpRoleDivCdReg').setEnabled(false);
        		$('#eqpMdlNmReg').setEnabled(false);
        		$('#jrdtTeamOrgIdReg').setEnabled(false);

		 		// (2017-06-13 : HS Kim) 숫자포트이름 중 MAX값 셋팅
		 		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpFdfMaxnumPortnm', paramData, 'GET', 'setPortCntFdfReg');
        	}else{
        		//장비 ID
            	$("#eqpIdReg").val("DV***********");
            	//장비상태코드
            	$("#eqpStatCd").val("01");
            	//FDF포트수
            	$('#portCntFdfReg').val("0");
        	}
    	}else{
    		//장비 ID
        	$("#eqpIdReg").val("DV***********");
        	//장비상태코드
        	$("#eqpStatCd").val("01");
        	//FDF포트수
        	$('#portCntFdfReg').val("0");
    	}
    }

    /*-----------------------------*
     *  select 정보 세팅
     *-----------------------------*/
    function setSelectCode(data) {

    	//FDF장비타입 세팅
    	var option_data =  [{comCd: "",comCdNm: "선택"},
    	                    {comCd: "11",comCdNm: "FDF"},
							{comCd: "177",comCdNm: "OFD"},
							{comCd: "178",comCdNm: "IJP"},
							{comCd: "182",comCdNm: "PBOX"}];

		$('#eqpRoleDivCdReg').setData({
	         data:option_data
		});

		//FDF장비모델 세팅
    	var option_data =  [{comCd: "",comCdNm: "선택"}];

		$('#eqpMdlNmReg').setData({
	         data:option_data
		});

		//관리그룹
		if($("#chrrOrgGrpCd").val() == ""){
		     $('#chrrOrgGrpCd').val("SKT");
		}

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpMgmtTeamGrp', null, 'GET', 'mgmtTeamOrgId');

		//장비 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCdReg');
    }

    /*-----------------------------*
     *  이벤트
     *-----------------------------*/
    function setEventListener() {

    	//취소
    	 $('#btnCnclFdfReg').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnSaveFdfReg').on('click', function(e) {

    		 var param =  $("#eqpFdfRegForm").getData();

    		 if (param.eqpInstlMtsoId == "") {
  	    		//필수입력 항목입니다.[ 국사 ]
  	    		 callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.rackNumber == "") {
  	        	//필수입력 항목입니다.[ 랙번호 ]
 		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['rackNumber']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.shelfNumber == "") {
  	        	//필수입력 항목입니다.[ 쉘프번호]
 		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['shelfNumber']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.eqpNm == "") {
   	        	//필수입력 항목입니다.[ FDF장비명 ]
  		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['fiberDistributionFrameEquipmentName']), function(msgId, msgRst){});
   	     		return;
   	     	 }

    		 if (param.eqpRoleDivCd == "") {
  	        	//필수입력 항목입니다.[ FDF장비타입 ]
 		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['fiberDistributionFrame']+configMsgArray['equipmentType']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.eqpMdlId == "") {
 	        	//필수입력 항목입니다.[ FDF장비모델명 ]
		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['fiberDistributionFrame']+configMsgArray['equipmentModelName']), function(msgId, msgRst){});
 	     		return;
 	     	 }

    		 if (param.jrdtTeamOrgId == "") {
  	        	//필수입력 항목입니다.[ 관리팀 ]
 		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['managementTeam']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (param.portCnt == "") {
  	        	//필수입력 항목입니다.[ 포트수 ]
 		    	callMsgBox('','W', makeArgConfigMsg('requiredOption',configMsgArray['portCount']), function(msgId, msgRst){});
  	     		return;
  	     	 }

    		 if (paramData != null && paramData != ""){
	    		 if(paramData.regYn == "Y" && numPortMax > param.portCnt ) {	// (2017-06-13 : HS Kim) FDF수량변경일때만 체크
	    			 //alert("numPortMax / param.portCnt : "+ numPortMax + " / " + param.portCnt);
	    			 callMsgBox('','I', "기존 포트수보다 작은 포트수는 저장할 수 없습니다." , function(msgId, msgRst){});
//	    			 callMsgBox('','I', configMsgArray['saveFail']+" \n기존 포트수보다 큰 포트수만 저장이 가능합니다." , function(msgId, msgRst){});
	    			 return;
	    		 }
    		 }

    		 var codeID =  $("#eqpRoleDivCdReg").getData();

 			if(codeID.eqpRoleDivCd == '11' || codeID.eqpRoleDivCd == '177' || codeID.eqpRoleDivCd == '178' || codeID.eqpRoleDivCd == '182'){
 	 	   		var defaultEqpNm = "";
 		   		defaultEqpNm = "FDF#"+$('#rackNumberReg').getData().rackNumber+"R-"+$('#shelfNumberReg').getData().shelfNumber+"S_"+$('#eqpInstlMtsoNmReg').val();
 		   		$('#eqpNmReg').val(defaultEqpNm);
 			}

//     		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMdlTypChk', param, 'GET', 'eqpMdlTypChk');

    		//저장하시겠습니까?
 			callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 		       //저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	eqpFdfReg();
 		        }
 		    });

         });


    	// FDF장비타입 선택시 FDF장비모델세팅
    	 $('#eqpRoleDivCdReg').on('change', function(e) {

    		 var eqpRoleDivCd =  $("#eqpRoleDivCdReg").getData().eqpRoleDivCd;

     	 	 if(eqpRoleDivCd == '' || eqpRoleDivCd == null){
     	 		var option_data =  [{comCd: "",comCdNm: "선택"}];
     			$('#eqpMdlNmReg').setData({
     		         data:option_data
     			});
     	 	 }else{
     	 	    //장비모델조회
     	 		var param = new Object();
     	 		param.eqpRoleDivCd= eqpRoleDivCd;
     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlSimple', param, 'GET', 'setEqpMdlInf');
     	 	 }
    	 });

    	// FDF장비모델선택시 포트수 세팅
    	 $('#eqpMdlNmReg').on('change', function(e) {

 	   		if (paramData != null && paramData != ""){
	   			if(paramData.regYn == "Y"){
	   				return;
	   			}
	   		}

    		 var eqpMdlId =  $("#eqpMdlNmReg").getData().eqpMdlId;

     	 	 if(eqpMdlId == '' || eqpMdlId == null){
     	 		$('#portCntFdfReg').val("");
     	 	 }else{
     	 	    //장비모델상세조회
     	 		var param = new Object();
     	 		param.eqpMdlId = eqpMdlId;
     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpMdlSimple', param, 'GET', 'setEqpMdlPortCnt');
     	 	 }
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
    	           			$('#eqpInstlMtsoIdReg').val(data.mtsoId);//국사ID
        	                $('#eqpInstlMtsoNmReg').val(data.mtsoNm);//국사명
        	                var defaultEqpNm = "";
        	    	   		defaultEqpNm = "FDF#"+$('#rackNumberReg').getData().rackNumber+"R-"+$('#shelfNumberReg').getData().shelfNumber+"S_"+data.mtsoNm;
        	    	   		$('#eqpNmReg').val(defaultEqpNm);
    	           		}
    	           	}
    	      });
         });

    	 //랙번호 입력시
    	 $('#rackNumberReg').keyup(function(e) {
 	 		if(!$("#rackNumberReg").validate()){
	   			//랙번호는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['rackNumber'] ), function(msgId, msgRst){});
	   			$('#rackNumberReg').val("");
	   			 return;
	   		};
	   		//default 장비명세팅(FDF#랙번호-쉘프번호)
	   		var defaultEqpNm = "";
	   		defaultEqpNm = "FDF#"+$('#rackNumberReg').getData().rackNumber+"R-"+$('#shelfNumberReg').getData().shelfNumber+"S_"+$('#eqpInstlMtsoNmReg').val();
	   		$('#eqpNmReg').val(defaultEqpNm);
 	 	 });

    	 //쉘프번호 입력시
    	 $('#shelfNumberReg').keyup(function(e) {
 	 		if(!$("#shelfNumberReg").validate()){
	   			//쉘프번호는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['shelfNumber'] ), function(msgId, msgRst){});
	   			$('#shelfNumberReg').val("");
	   			 return;
	   		};
	   		//default 장비명세팅(FDF#랙번호-쉘프번호)
	   		var defaultEqpNm = "";
	   		defaultEqpNm = "FDF#"+$('#rackNumberReg').getData().rackNumber+"R-"+$('#shelfNumberReg').getData().shelfNumber+"S_"+$('#eqpInstlMtsoNmReg').val();
	   		$('#eqpNmReg').val(defaultEqpNm);
 	 	 });

    	//포트수 입력시
    	 $('#portCntFdfReg').keyup(function(e) {
 	 		if(!$("#portCntFdfReg").validate()){
	   			//포트수는 숫자만 입력 가능합니다.
	   			callMsgBox('','W', makeArgConfigMsg('requiredDecimal',configMsgArray['portCount'] ), function(msgId, msgRst){});
	   			$('#portCntFdfReg').val("");
	   			 return;
	   		};
 	 	 });

	};

    /*-----------------------------*
     *  FDF 장비등록
     *-----------------------------*/
    function eqpFdfReg() {

		 var param =  $("#eqpFdfRegForm").getData();

		 //장비정보
		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }
		 param.frstRegUserId = userId; //등록자
		 param.lastChgUserId = userId; //변경자

		 param.upsdRackNo = $('#rackNumberReg').val(); //랙번호
		 param.upsdShlfNo = $('#shelfNumberReg').val(); //쉘프번호

		 param.opTeamOrgId = $('#jrdtTeamOrgIdReg').val() // 운용팀

//		 param.eqpStatCd = '01';       //장비서비스상태:운용
		 param.eqpStatCd = $('#eqpStatCdReg').val();
		 if (paramData != null && paramData != ""){
			 //param.portCntOrgl = paramData.portCnt;	// paramData.portCnt : 이전화면(장비상세정보)에서 넘어온 포트수
			 param.portCntOrgl = numPortMax;
		 }else{
			 param.portCntOrgl = "0";
		 }	// alert("portCntOrgl (처음등록화면이면 0) : " + param.portCntOrgl );	alert("param.portCnt(내가 화면에 입력한 수) : " + param.portCnt);
		 //FDF장비등록
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpFdfReg', param, 'POST', 'EqpFdfReg');
    }

	/*-----------------------------*
     *  성공처리
     *-----------------------------*/
    function successCallback(response, status, jqxhr, flag){

    	//국사조회 다녀온 후 국사정보 세팅
    	if(flag == 'setMtsoInf') {
    		if(response.mtsoMgmtList[0] != null && response.mtsoMgmtList[0] != ''){
        		$('#eqpInstlMtsoIdReg').val(response.mtsoMgmtList[0].mtsoId);//국사ID
        		$('#eqpInstlMtsoNmReg').val(response.mtsoMgmtList[0].mtsoNm);//국사명
    		}

    	}

    	//모델조회 다녀온 후 모델select 세팅
    	if(flag == 'setEqpMdlInf') {
    		$('#eqpMdlNmReg').clear();

    		var option_data =  [{comCd: "",comCdNm: "선택"}];
	   		if(response.eqpMdlMgmt.length > 0){
	   			var eqpMdlMgmt = response.eqpMdlMgmt;
	    		for(var i=0; i<eqpMdlMgmt.length; i++){
	    			option_data.push({comCd: eqpMdlMgmt[i].eqpMdlId, comCdNm: eqpMdlMgmt[i].eqpMdlNm});
	    		}
	   		}

	   		$('#eqpMdlNmReg').setData({
				data:option_data
			});

	   		if (paramData != null && paramData != ""){
	   			if(paramData.regYn == "Y"){
	   				$('#eqpMdlNmReg').setSelected(paramData.eqpMdlId);
	   			}
	   		}
    	}
    	// (2017-06-13 : HS Kim) 숫자포트이름 중 MAX값 셋팅
    	if(flag == 'setPortCntFdfReg') {
    		$('#portCntFdfReg').val(response.eqpFdfMaxnumPortnm);
    		numPortMax = response.eqpFdfMaxnumPortnm;
    	}

    	//모델상세 읽어와서 포트수 세팅
    	if(flag == 'setEqpMdlPortCnt') {
	    	$('#portCntFdfReg').clear();
		   		if(response.eqpMdlMgmt.length > 0){
		   			var portCnt = response.eqpMdlMgmt[0].portCnt;
		   			if(portCnt == null || portCnt == ''){
		   				$('#portCntFdfReg').val('0');
		   			}else{
		   			    $('#portCntFdfReg').val(response.eqpMdlMgmt[0].portCnt);
		   		    }
		   		}
    	}

    	//등록 다녀온 후
    	if(flag == 'EqpFdfReg') {

    		if(response.eqpResult == "Success" && response.portResult == "Success"){
    			var userId;
				if($("#userId").val() == ""){
					userId = "SYSTEM";
				}else{
					   userId = $("#userId").val();
				}

				var eqpId;
				if (paramData != null && paramData != ""){
				   if(paramData.regYn == "Y"){
					   eqpId = $("#eqpIdReg").val();
				   }else{
					   eqpId = response.eqpId;
				   }
			    }else{
			    	eqpId = response.eqpId;
			    }

				var param = {"eqpId":eqpId, "lastChgUserId":userId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portNmCnt', param, 'GET', 'portNmCnt');

    			//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'], function(msgId, msgRst){
        			   if (msgRst == 'Y') {
        				   if (paramData != null && paramData != ""){
        					   if(paramData.regYn == "Y"){
        						   var paramF = {"eqpNm":$('#eqpNmReg').val(), "rackNumber":$('#rackNumberReg').val(), "shelfNumber":$('#shelfNumberReg').val(), "regYn":"Y"};
            					   $a.close(paramF);

            					   var pageNo = $("#pageNo", parent.document).val();
            					   var rowPerPage = $("#rowPerPage", parent.document).val();

            					   $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
            				   }else{
            					   $a.close(response.eqpId);
            				   }
        				   }else{
        					   $a.close(response.eqpId);
        				   }
        		       }
        		});
    		}else if(response.Result == "FailPortCnt"){
    			callMsgBox('','I', "기존 포트수보다 작은 포트수는 저장할 수 없습니다." , function(msgId, msgRst){});
//    			callMsgBox('','I', configMsgArray['saveFail']+" \n기존 포트수보다 큰 포트수만 저장이 가능합니다." , function(msgId, msgRst){});
    		}else if(response.eqpResult == "DupUpsdMtso"){
    			callMsgBox('','I', "동일 국사에 동일한 상면랙/상면쉘프 번호를 가진 FDF가 있습니다." , function(msgId, msgRst){});
    		}else if(response.eqpResult == "ExistsNtwkLine"){
    			var param =  $("#eqpFdfRegForm").getData();
    			param.eqpRegCheck = 'ExistsNtwkLine';
    	   		popupList('EqpNtwkLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
    		}else if(response.eqpResult == "ExistsSrvcLine"){
    	   		var param =  $("#eqpFdfRegForm").getData();
    			param.eqpRegCheck = 'ExistsSrvcLine';
    	   		popupList('EqpSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
        	 }else{
    			//저장을 실패 하였습니다.
        		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'eqpStatCdReg'){

    		$('#eqpStatCdReg').clear();

    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#eqpStatCdReg').setData({
    	             data:option_data
    			});
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

    	//장비ID 생성
    	if(flag == 'eqpIdReg'){

    		$("#eqpIdReg").val(response.eqpId);
    	}

    	if(flag == 'portNmCnt'){
    		if(response.portNmCnt.portCnt > 0){
    			httpRequest('tango-transmission-gis-biz/transmission/gis/nm/fdflnst/updatePort?eqpId='+response.portNmCnt.eqpId+"&portCnt="+response.portNmCnt.portCnt+"&insUserId="+response.portNmCnt.lastChgUserId , null, 'GET', 'updatePort');
    		}
    	}

    }

	/*-----------------------------*
     *  실패처리
     *-----------------------------*/
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'EqpFdfReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
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

});