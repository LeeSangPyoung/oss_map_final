/**
 * IntgMtsoReg.js
 *
 * @author Administrator
 * @date 2023. 04. 27.
 * @version 1.0
 */
var popupObj = $a.page(function() {

    // 초기 진입점
    // param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.

	var paramData = null;
	var dupBldChk = "N";
	var dupMtsoNm = "";
	var mtsoDetlTypChg = null;
	var cifTakeRlesAprvStatCd = "";
	var cifTakeAprvStatCd = "";
	var mtsoOthrMdulUseYn = null;
	var orgMtsoStatCd = null;
	var mtsoUseChk_data = [];
	var aprvA = null;
	var beforBldCd = null;
	var beforbldBlkNo = null;
	var beforbldFolrNo = null;

	this.init = function(id, param) {
//		console.log("popup param : ", JSON.stringify(param));
    	beforBldCd = param.bldCd;
    	beforbldBlkNo = param.bldblkNo;
    	beforbldFolrNo = param.bldFlorNo;

    	if(param.regYn == "Y"){
    		paramData = param;
    		orgMtsoStatCd = param.mtsoStatCd;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/selectMtsoUseYn', paramData, 'GET', 'mtsoUseChk');
    	}

    	if (param.epwrFixdGntEyn	== 'O') {paramData.epwrFixdGntEyn	= 'Y';} else if (param.epwrFixdGntEyn	== 'X') {paramData.epwrFixdGntEyn	= 'N';}
    	if (param.epwrMovGntEyn	== 'O') {paramData.epwrMovGntEyn	= 'Y';} else if (param.epwrMovGntEyn	== 'X') {paramData.epwrMovGntEyn	= 'N';}
    	if (param.epwrDlstYn       == 'O') {paramData.epwrDlstYn       = 'Y';} else if (param.epwrDlstYn       == 'X') {paramData.epwrDlstYn       = 'N';}
    	if (param.comUseYn         == 'O') {paramData.comUseYn         = 'Y';} else if (param.comUseYn         == 'X') {paramData.comUseYn         = 'N';}
    	if (param.epwrDlstYn       == 'O') {paramData.epwrDlstYn       = 'Y';} else if (param.epwrDlstYn       == 'X') {paramData.epwrDlstYn       = 'N';}
    	if (param.trmsOptlLnDlstYn == 'O') {paramData.trmsOptlLnDlstYn = 'Y';} else if (param.trmsOptlLnDlstYn == 'X') {paramData.trmsOptlLnDlstYn = 'N';}
    	if (param.envIntnCctvEyn   == 'O') {paramData.envIntnCctvEyn   = 'Y';} else if (param.envIntnCctvEyn   == 'X') {paramData.envIntnCctvEyn   = 'N';}
    	if (param.envFlodSnsrEyn   == 'O') {paramData.envFlodSnsrEyn   = 'Y';} else if (param.envFlodSnsrEyn   == 'X') {paramData.envFlodSnsrEyn   = 'N';}
    	if (param.flodSnsrNeedYn   == 'O') {paramData.flodSnsrNeedYn   = 'Y';} else if (param.flodSnsrNeedYn   == 'X') {paramData.flodSnsrNeedYn   = 'N';}

//    	console.log("popup paramData : ", paramData);
    	setEventListener();
        setSelectCode();
        setRegDataSet(param);

    };

    function setEventListener(){
    	// 본부 선택시 이벤트
    	$('#orgReg').on('change', function(e) {
    		// tango transmission biz 모듈을 호출하여야한다.
    		var orgID =  $("#orgReg").getData();

    		if(orgID.orgId == ''){
    			var chrrOrgGrpCd;
    			if($("#chrrOrgGrpCd").val() == ""){
    				chrrOrgGrpCd = "SKT";
    			}else{
    				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    			}

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'teamReg');
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmofReg');
    		}else{
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'teamReg');
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmofReg');
    		}
    	});

    	// 팀을 선택했을 경우
    	$('#teamReg').on('change', function(e) {
    		var teamID =  $("#teamReg").getData();

    		if(teamID.teamId == ''){
    			var chrrOrgGrpCd;
    			if($("#chrrOrgGrpCd").val() == ""){
    				chrrOrgGrpCd = "SKT";
    			}else{
    				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    			}
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmofReg');
    		}else {
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + teamID.teamId, null, 'GET', 'tmofReg');
    		}
    	});

    	$('#opTeamOrgIdReg').on('change', function(e) {
    		var orgID =  $("#opTeamOrgIdReg").getData();
    		if(orgID.opTeamOrgId == ''){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPostReg');
    		}else{
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/' + orgID.opTeamOrgId+'/D', null, 'GET', 'opPostReg');
    		}
    	});

    	// 건물조회
    	$('#btnBldSearch').on('click', function(e) {
    		var param =  $("#mtsoRegForm").getData();
    		$a.popup({
    			popid: 'BuildInfoListExternalPop',
    			title: configMsgArray['buildingLkup'],
    			url: '/tango-transmission-web/demandmgmt/buildinginfomgmt/BuildInfoListExternalPop.do',
    			data: {bldCd : param.bldCd},
    			windowpopup : true,
    			width : window.innerWidth * 0.8,
    			height : window.innerHeight * 0.8,
    			modal: true,
    			movable:true,
    			callback : function(data) { // 팝업창을 닫을 때 실행
//    				console.log("btnBldSearch : ", data);
    				var bldFolrNo = "" ;
    				$('#bldCdReg').val(data.bldInfo.bldCd);
    				$('#bldNmReg').val(data.bldInfo.bldNm);
    				$('#bldAddrReg').val(data.bldInfo.bldAddr);
    				$('#mtsoLatValReg').val(data.bldDongInfo.wgs84YcrdVal);
	           		$('#mtsoLngValReg').val(data.bldDongInfo.wgs84XcrdVal);


    				if(data.bldDongInfo == null){
    					$('#bldblkNoReg').val("");
    					$('#bldblkNmReg').val("");
    				}else{
    					$('#bldblkNoReg').val(data.bldDongInfo.bldBlkNo);
    					$('#bldblkNmReg').val(data.bldDongInfo.bldBlkNm);
    				}

    				if(data.bldFlorInfo == null){
    					$('#bldFlorNoReg').val("");
    					$('#bldFlorCntReg').val("");
    				}else{

    					var grudBsmtDivNm = data.bldFlorInfo.grudBsmtDivCd;
    					var bldFlorCnt = data.bldFlorInfo.bldFlorCnt;
	           			if(grudBsmtDivNm == "지상"){
	           				grudBsmtDivNm = "";
	           			}
	           			if(grudBsmtDivNm == "옥상"){
	           				bldFlorCnt = "";
	           			}

	           			$('#bldFlorNoReg').val(data.bldFlorInfo.bldFlorNo);
    	                $('#bldFlorCntReg').val(grudBsmtDivNm + bldFlorCnt);
    	                $('#bldBrudBsmtDivCdReg').val(grudBsmtDivNm);
    					bldFolrNo = data.bldFlorInfo.bldFlorNo;
    				}

    				var param =  $("#mtsoRegForm").getData();
//    				console.log("beforBldCd : ", beforBldCd);
//    				console.log("data.bldInfo.bldCd : ", data.bldInfo.bldCd);
//    				console.log("beforbldBlkNo : ", beforbldBlkNo);
//    				console.log("data.bldDongInfo.bldBlkNo : ", $('#bldblkNoReg').val());
//    				console.log("beforbldFolrNo : ", beforbldFolrNo);
//    				console.log("bldFolrNo : ", bldFolrNo);
//    				console.log("regYn : ", $("#regYn").val());
//    				console.log("intgRegYn : ", $("#intgRegYn").val());
//    				console.log("bldBlkNo : ", data.bldDongInfo.bldBlkNo);
    				if(param.mgmtGrpCd == "0001"){

    					//동일 건물내 통합국사가 존재하는지 체크
						var param = {"bldCd": data.bldInfo.bldCd, "bldblkNo": data.bldDongInfo.bldBlkNo, "bldFlorNo": data.bldFlorInfo.bldFlorNo, "mgmtGrpNm": String($('#mgmtGrpCdReg').getTexts())};
//						console.log("param : ", param);
						httpRequest('tango-transmission-biz/transmisson/configmgmt/common/dupIntgBldChk', param, 'GET', 'dupIntgBldChk');
    				}else{
    					dupBldChk = "N";
    				}

    				var ldongParam = {"pageNo" : 1, "rowPerPage" : 100, "mgmtGrpNm" : String($("#mgmtGrpCdReg").getTexts()), "ldongCd" : data.bldInfo.ldongCd};
	                httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam', ldongParam, 'GET', 'ldongSearch');
    			}
    		});
    	});

    	// 사이트 조회
    	$('#btnSiteSearch').on('click', function(e) {
    		var param =  $("#mtsoRegForm").getData();
    		$a.popup({
    			popid: 'SiteLkup',
    			title: '사이트 조회',
    			url: '/tango-transmission-web/configmgmt/common/SiteLkup.do',
    			data: param,
    			modal: true,
    			movable:true,
    			width : 800,
    			height : window.innerHeight * 0.85,
    			callback : function(data) { // 팝업창을 닫을 때 실행
    				$('#mtsoRegArea').find('#siteCd').val(data.siteCd);
    				$('#mtsoRegArea').find('#siteNm').val(data.siteNm);
    			}
    		});
    	});

    	// 취소
    	$('#btnCncl').on('click', function(e) {
    		// tango transmission biz 모듈을 호출하여야한다.
    		$a.close();
    	});

    	// 저장
    	$('#btnSave').on('click', function(e) {
    		var param =  $("#mtsoRegForm").getData();

    		if(orgMtsoStatCd != '03' && param.mtsoStatCd == '03') {
    			if (mtsoOthrMdulUseYn == "Y") {
    				// 타모듈 사용 체크
    				callMsgBox('','I', "해당 국사는 ["+mtsoUseChk_data[0]+" "+ mtsoUseChk_data[1] + " " + mtsoUseChk_data[2] + "] 모듈에서 사용하고있는 국사 입니다. 철거 하실 수 없습니다.<br> * 철거불가 예1)  GIS에 입력된 국사일 경우 <br> * 철거불가 예2) 회선 상하위국사 혹은 관할국사로 입력된 국사일 경우 <br> * 철거불가 예3) 링 상하위국사 혹은 관할국사로 입력된 국사일 경우", function(msgId, msgRst){});
    				return;
    			}
    		}

    		if (param.mgmtGrpCd == "") {
    			// 필수 선택 항목입니다.[ 관리그룹 ]
    			callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['managementGroup']), function(msgId, msgRst){});
	     		return;
    		}

    		if (param.orgId == "") {
		     	// 필수 선택 항목입니다.[ 본부 ]
			    callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['hdofc']), function(msgId, msgRst){});
		     	return;
    		}

    		if (param.teamId == "") {
	    		// 필수 선택 항목입니다.[ 팀 ]
    			callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['team']), function(msgId, msgRst){});
			    return;
    		}

    		if (param.tmof == "") {
	    		// 필수 선택 항목입니다.[ 전송실 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['transmissionOffice']), function(msgId, msgRst){});
			    return;
    		}

    		if (param.intgMtsoNm == "") {
    			// 필수 선택 항목입니다.[ 국사명 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption','통합국명'), function(msgId, msgRst){});
			    return;
    		}

    		if (param.bldCd == "") {
	     		// 필수 선택 항목입니다.[ 건물명 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption','건물명'), function(msgId, msgRst){});
	     		return;
    		}

	    	 if (param.bldblkNo == "") {
	    		 //필수 선택 항목입니다.[ 건물동 ]
	    		 callMsgBox('','I', makeArgConfigMsg('requiredOption','건물동'), function(msgId, msgRst){});
	    		 return;
	    	 }

	    	 if (param.bldFlorNo == "") {
	    		 //필수 선택 항목입니다.[ 건물층값 ]
	    		 callMsgBox('','I', makeArgConfigMsg('requiredOption','건물층값'), function(msgId, msgRst){});
	    		 return;
	    	 }

    		if (dupBldChk == "Y") {
    			// 건물 중복 체크
 		    	callMsgBox('','I', "선택하신 건물에 기존에 등록된 통합국사["+ dupMtsoNm +"]가 있습니다.", function(msgId, msgRst){});
 	     		return;
    		}

    		if (param.mtsoStatCd == "") {
	     		//필수 선택 항목입니다.[ 국사상태 ]
    			callMsgBox('','I', makeArgConfigMsg('requiredOption','국사상태'), function(msgId, msgRst){});
	     		return;
	     	 }

    		if (param.cifSlfLesCd == "") {
    			 // 필수 선택 항목입니다.[ 국사소유 ]
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사소유'), function(msgId, msgRst){});
    			 return;
    		}

         	// tango transmission biz 모듈을 호출하여야한다.
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       // 저장한다고 하였을 경우
    			if (msgRst == 'Y') {
    				mtsoReg();
    			}
    		});
    	});

    	// 삭제
    	$('#btnDel').on('click', function(e) {
         	// tango transmission biz 모듈을 호출하여야한다.
    		callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
  		       // 삭제한다고 하였을 경우
    			if (msgRst == 'Y') {
    				mtsoDel();;
    			}
    		});
    	});

    	$('#trmsGoutTimeVal').keyup(function(e) {
    		if(isNaN(Number($("#trmsGoutTimeVal").val()))){
 	   			//시간은 숫자만 입력 가능합니다.
    			callMsgBox('','W', makeArgConfigMsg('requiredDecimal','[출동시간(분)]' ), function(msgId, msgRst){});
    			$('#trmsGoutTimeVal').val("");
    			return;
    		};
    	});

    	$('#trmsGoutDistVal').keyup(function(e) {
    		if(isNaN(Number($("#trmsGoutDistVal").val()))){
  	   			//거리는 숫자만 입력 가능합니다.
    			callMsgBox('','W', makeArgConfigMsg('requiredDecimal','[출동거리(KM)]' ), function(msgId, msgRst){});
    			$('#trmsGoutDistVal').val("");
    			return;
    		};
    	});

    }

    function setSelectCode() {
    	var chrrOrgGrpCd;
    	if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
    	} else {
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	}

    	var mgmtGrpCd;
    	if(paramData == '' || paramData == null) {
    		mgmtGrpCd = chrrOrgGrpCd;
    	} else {
    		mgmtGrpCd = paramData.mgmtGrpNm;
    	}

    	if(mgmtGrpCd == "SKT"){
    		$('#bldFlorCntEm').show();
    		$('#mtsoAbbrNmRegLabel').html("국사약어명") ;
    	} else {
    		$('#bldFlorCntEm').hide();
    		$('#mtsoAbbrNmRegLabel').html("GIS국사명") ;
    	}

    	//관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpCdReg');
		//본부 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpCd, null, 'GET', 'orgReg');
		//국사등급코드
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/MTSOGR', null, 'GET', 'mtsoGr');
    	//통합국공정구분
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/IMPRCSCD', null, 'GET', 'intgMtsoPrcs');
    	//국사 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStatCdReg');
    	//운용팀
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeamReg');
    	//국사소유 코드
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02363', null, 'GET', 'cifSlfLesCdReg');


    	//2023 통합국사 고도화 - 통합국사 관리권한 소유자만  등록/수정 가능
    	if($("#adtnAttrVal").val().indexOf('CIF_MTSO_APRV_A') > 0){
    		$("#btnSave").show();
		}else{
			$("#btnSave").hide();
		}

    }

    function setRegDataSet(data) {
//    	console.log("RegData : ", JSON.stringify(data));
    	// only skt
    	$('#mgmtGrpCdReg').setEnabled(false);

    	if(data.regYn == "Y"
    		&& data.intgRegYn == "Y"){
        	$('#regYn').val("Y");
        	$('#intgRegYn').val("Y");

        	$('#mtsoRegArea').setData(data);
        	$('#mtsoStatCdOld').val(data.mtsoStatCd);
        	//2023 통합국사 고도화 추가
        	$('#btnBldSearch').setEnabled(false);

    	} else {
    		$("#mtsoIdReg").val("MO***********");
    		$("#mtsoMapInsYnReg").val("NO");
    		$('#sktSkbIntgMtsoYnReg').setSelected("NO");

    	}

    }

	// request 성공시
	function successCallback(response, status, jqxhr, flag){

		//통합국사등록
		if(flag == 'MtsoReg') {
			if(response.Result == "Success"){
//				console.log("successCallback : flag : ", flag, "</br> response ", JSON.stringify(response));
    			//저장을 완료 하였습니다.
            	callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
            		if (msgRst == 'Y') {
            			var mtsoId = response.resultList.mtsoId;
            			$a.close();

            			if($("#regYn").val() == ""
            				&& $("#intgRegYn").val() == ""){ //통합국 신규 등록 후 국사 상세 팝업 전환
            				mtsoDtlPop(mtsoId);
            			}
            		}
            	});

            	var pageNo = $("#pageNo", opener.document).val();
            	var rowPerPage = $("#rowPerPage", opener.document).val();



    		}else if(response.Result == "Use"){
    			callMsgBox('','I', configMsgArray['saveFail']+" (운용중인 장비가 있습니다.)" , function(msgId, msgRst){});
    		}else if(response.Result == "DupIntgFcltsCd"){
    			callMsgBox('','W', "[ "+response.DupIntgFcltsCd[0].intgFcltsCd+" ] 코드는 [ "+response.DupIntgFcltsCd[0].mtsoStat+" ] 상태의 [ "+response.DupIntgFcltsCd[0].mtsoNm+" ] 국사에 이미 등록되어 있습니다.", function(msgId, msgRst){});
    		}
    	}

		//관리그룹
		if(flag == 'mgmtGrpCdReg'){

			var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

			$('#mgmtGrpCdReg').clear();

    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCd;
						break;
					}
				}
				if(paramData == '' || paramData == null) {
					$('#mgmtGrpCdReg').setData({
						data:response ,
						mgmtGrpCd:selectId
					});
				} else {
					$('#mgmtGrpCdReg').setData({
						data:response,
						mgmtGrpCd:paramData.mgmtGrpCd
					});
				}
			}
    	}

		// 본부
    	if(flag == 'orgReg') {

    		$('#orgReg').clear();
    		$('#teamReg').clear();
    		if(paramData == '' || paramData == null) {
    			var sUprOrgId = "";
    			if($("#sUprOrgId").val() != ""){
    				sUprOrgId = $("#sUprOrgId").val();
    			}

    			var chrrOrgGrpCd;
    			if($("#chrrOrgGrpCd").val() == ""){
    				chrrOrgGrpCd = "SKT";
    			}else{
    				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    			}

    			if(sUprOrgId == ""){
    				var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];

    				$('#teamReg').setData({
    					data:option_data
    				});

	     			$('#tmofReg').setData({
	     	            data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['select']}]
	     			});

	     			for(var i=0; i<response.length; i++){
	     				var resObj = response[i];
	     				option_data.push(resObj);
	     			}

	     			$('#orgReg').setData({
	     				data:option_data
	     			});
    			} else {
    				$('#orgReg').clear();

		       		var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];

		       		var selectId = null;
		       		if(response.length > 0){
		       			for(var i=0; i<response.length; i++){
		       				var resObj = response[i];
		   	    			option_data.push(resObj);
		   	    			if(resObj.orgId == sUprOrgId) {
		   	    				selectId = resObj.orgId;
		   					}
		       			}
		   	    		$('#orgReg').setData({
		   	    			data:option_data ,
		   					orgId:selectId
		   	    		});
		       		}
		       		// 본부 세션값이 있을 경우 해당 팀,전송실 조회
	       			if(selectId == null){
	       				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'teamReg');
	    		    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmofReg');
	    	   		}else{
	    	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'teamReg');
	    	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + sUprOrgId+'/ALL', null, 'GET', 'tmofReg');
	    	   		}
    			}
    		} else {
    			var selectId = null;

    			for(var i=0; i<response.length; i++){
    				var resObj = response[i];
    				if(resObj.orgNm == paramData.orgNm) {
    					selectId = resObj.orgId;
    				}
    			}
    			$('#orgReg').setData({
    				data:response,
    				orgId:selectId
    			});

    			if($('#orgReg').val() != null){
		   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + $('#orgReg').val(), null, 'GET', 'teamReg');
	    		}
    		}
    	}

    	// 팀
    	if(flag == 'teamReg') {
    		$('#teamReg').clear();

    		if(paramData == '' || paramData == null) {
    			var sOrgId = "";
    			if($("#sOrgId").val() != ""){
    				sOrgId = $("#sOrgId").val();
    			}

    			if(sUprOrgId == ""){
    				var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];

	    			for(var i=0; i<response.length; i++){
	    				var resObj = response[i];
	    				option_data.push(resObj);
	    			}

	    			$('#teamReg').setData({
	    				data:option_data
	    			});
    			} else {
    				var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];

	   	       		var selectId = null;
	   	       		if(response.length > 0){
	   	   	    		for(var i=0; i<response.length; i++){
	   	   	    			var resObj = response[i];
	   	   	    			option_data.push(resObj);
	   	   	    			if(resObj.orgId == sOrgId) {
	   	   	    				selectId = resObj.orgId;
	   	   					}
	   	   	    		}
	   	   	    		$('#teamReg').setData({
	   	   	    			data:option_data ,
	   	   					teamId:selectId
	   	   				});
	   	       		}
    			}
    		} else {

    			var selectId = null;
    			for(var i=0; i<response.length; i++){
    				var resObj = response[i];
    				if(resObj.orgNm == paramData.teamNm) {
    					selectId = resObj.orgId;
    				}
    			}
    			$('#teamReg').setData({
    				data:response,
    				teamId:selectId
    			});

    			if($('#teamReg').val() != null){
    	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#teamReg').val(), null, 'GET', 'tmofReg');
    			}
    		}
    	}

    	// 전송실
    	if(flag == 'tmofReg') {
    		$('#tmofReg').clear();
    		if(paramData == '' || paramData == null) {

    			var option_data =  [{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['select']}];

    			for(var i=0; i<response.length; i++){
    				var resObj = response[i];
    				option_data.push(resObj);
    			}

    			$('#tmofReg').setData({
    				data:option_data
    			});
    		} else {

    			var selectId = null;
    			if(response.length > 0){
    				for(var i=0; i<response.length; i++){
    					var resObj = response[i];

    					if(resObj.mtsoNm == paramData.tmofNm) {
    						selectId = resObj.mtsoId;
    					}
    				}
    				$('#tmofReg').setData({
    					data:response ,
    					tmof:selectId
    				});
    			}else{
    				$('#tmofReg').setData({
    					data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['select']}]
    				});
    			}
    		}
    	}

    	//국사등급
    	if(flag == 'mtsoGr'){
    		var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];
			for(var i=0; i<response.length; i++){
				var resObj = {comCd : response[i].comCd, comCdNm : response[i].comCdNm};
				option_data.push(resObj);
			}
			if(paramData == '' || paramData == null) {
				$('#mtsoGrCd').setData({ data:option_data, mtsoGrCd : '' });
			} else {
				$('#mtsoGrCd').setData({ data:option_data, mtsoGrCd : paramData.mtsoGrCd });
			}
    	}

    	//통합공정구분
    	if(flag == 'intgMtsoPrcs'){
			var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];
			for(var i=0; i<response.length; i++){
				var resObj = {comCd : response[i].comCd, comCdNm : response[i].comCdNm};
				option_data.push(resObj);
			}
			if(paramData == '' || paramData == null) {
				$('#intgMtsoScrePrcsCd').setData({ data:option_data, intgMtsoScrePrcsCd : '' });
			} else {
				$('#intgMtsoScrePrcsCd').setData({ data:option_data, intgMtsoScrePrcsCd : paramData.intgMtsoScrePrcsCd });
			}
		}

    	//국사상태 콤보 박스
    	if(flag == 'mtsoStatCdReg') {
    		$('#mtsoStatCdReg').clear();

    		var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#mtsoStatCdReg').setData({
    				data:option_data,
    				mtsoStatCd:"01"
    			});
    		} else {
    			$('#mtsoStatCdReg').setData({
    				data:response,
    				mtsoStatCd:paramData.mtsoStatCd
    			});
    		}
    	}

    	//운용팀
    	if(flag == 'opTeamReg'){
			$('#opTeamOrgIdReg').clear();
			var option_data =  [{orgId: "", orgNm: configMsgArray['select'], uprOrgId: ""}];


			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#opTeamOrgIdReg').setData({
				data:option_data
			});

			var orgID =  $("#opTeamOrgIdReg").getData();
			if(orgID.opTeamOrgId == ''){
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPostReg');

			}else{
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/' + orgID.opTeamOrgId+'/D', null, 'GET', 'opPostReg');
			}
		}

    	//국사소유
		if(flag == 'cifSlfLesCdReg') {
			$('#cifSlfLesCdReg').clear();

			var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#cifSlfLesCdReg').setData({
					data:response,
					cifSlfLesCd:""
				});
			} else {
				$('#cifSlfLesCdReg').setData({
					data:response,
					cifSlfLesCd:paramData.cifSlfLesCd
				});
			}
		}

		//운용POST
		if(flag == 'opPostReg'){
			$('#opPostOrgIdReg').clear();
			var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
				$('#opPostOrgIdReg').setData({
					data:option_data
				});
			} else {
				$('#opPostOrgIdReg').setData({
					data:option_data,
					opPostOrgId:paramData.opPostOrgId
				});
			}
		}

		if(flag == 'dupIntgBldChk') {
    		if(response.result == null || response.result == ""){
    			dupBldChk = "N";
    		}else{
    			dupBldChk = "Y";
    			dupMtsoNm = response.result.mtsoNm;
    		}
    		console.log("dupIntgBldChk dupBldChk : ", dupBldChk);
    	}

		if(flag == 'ldongSearch') {
    		var orgId = response.ldongTeamMgmtList[0].orgId;
    		var teamId = response.ldongTeamMgmtList[0].teamId;
    		var tmofId = response.ldongTeamMgmtList[0].tmofId;
    		var opTeamOrgId = response.ldongTeamMgmtList[0].opTeamOrgId;

    		$('#orgReg').setData({
	             orgId:orgId
			});

    		$('#teamReg').setData({
	             teamId:teamId
			});

    		$('#tmofReg').setData({
	             tmof:tmofId
			});

    		$('#opTeamOrgIdReg').setData({
	             opTeamOrgId:opTeamOrgId
			});
    	}
	}

	// request 실패시.
	function failCallback(response, status, jqxhr, flag){

		if(flag == 'MtsoReg'){
			// 저장을 실패 하였습니다.
			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
		}

		if(flag == 'MtsoDel'){
			// 삭제를 실패 하였습니다.
			callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
		}
	}

	function mtsoReg() {

		var param =  $("#mtsoRegForm").getData();

		if(param.mtsoMapInsYn == "YES"){
			param.mtsoMapInsYn = "Y";
		}else{
			param.mtsoMapInsYn = "N";
		}

		if(param.sktSkbIntgMtsoYn == "YES"){
			param.sktSkbIntgMtsoYn = "Y";
		}else{
			param.sktSkbIntgMtsoYn = "N";
		}

		// 수정
		if( beforBldCd != param.bldCd ){
			param.beforBldCd = beforBldCd;
			param.bldCdChgCheck = "Y";
		}else{
			param.beforBldCd = "";
			param.bldCdChgCheck = "N";
		}

		var userId;
		if($("#userId").val() == ""){
			userId = "SYSTEM";
		}else{
			userId = $("#userId").val();
		}

		param.frstRegUserId = userId;
		param.lastChgUserId = userId;

		param.cifTakeRlesAprvStatCd = cifTakeRlesAprvStatCd;
		param.cifTakeAprvStatCd = cifTakeAprvStatCd;

		param.mtsoTypCd = "2"; // 국사유형코드 - 중심국사 fix
		param.mtsoCntrTypCd = "02"; // 국사센터유형코드 - 통합국 fix
		param.mtsoStatCd = "01"; // 국사상태 - 운영 fix
		param.mtsoDetlTypCd = "002"; //국사세부유형 - T_중심국 fix

//		console.log("SAVE Param : ", JSON.stringify(param));

		if($('#regYn').val() == "Y"
			&& $('#intgRegYn').val() == "Y"){
			param.cifTakeAprvStatCd = "05"; //인수완료??
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateIntgMtsoMgmt', param, 'POST', 'MtsoReg');
		}else{
			param.cifTakeAprvStatCd = "05";
			// 삽입 이벤트
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/insertIntgMtsoMgmt', param, 'POST', 'MtsoReg');
		}
	}

	function mtsoDtlPop(mtsoId){
		var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
		$a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do?mtsoEqpGubun=intgmtso&parentWinYn=Y&mtsoTypCd=2&linkTab=tab_IntgMtso&mtsoEqpId='+mtsoId,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 900,
			height : window.innerHeight
		});
	}

	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, // URL 기존 처럼 사용하시면 됩니다.
			data : Param, // data가 존재할 경우 주입
			method : Method, // HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	};

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
		});
	}

	var close = function(){
		$a.close();
	}
});