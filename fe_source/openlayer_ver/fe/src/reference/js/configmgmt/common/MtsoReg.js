/**
 * MtsoReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.

	var paramData = null;
	var dupBldChk = "N";
	var dupMtsoNm = "";
	var mtsoDetlTypChg = null;

	var mtsoOthrMdulUseYn = null;
	var orgMtsoStatCd = null;
	var mtsoUseChk_data = [];

    this.init = function(id, param) {

    	if(param.regYn == "Y"){
    		paramData = param;
    		orgMtsoStatCd = param.mtsoStatCd;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/selectMtsoUseYn', paramData, 'GET', 'mtsoUseChk');
    	}
    	setEventListener();
        setSelectCode();
        setRegDataSet(param);
        //alert(dd2dms(param.mtsoLatVal));
    };

    function setRegDataSet(data) {
    	$('#btnUkeyMtsoSearch').hide();

    	if(data.regYn == "Y"){
    		$('#mtsoIdReg').setEnabled(false);
//        	$('#mtsoTypCdReg').setEnabled(false);
        	$('#regYn').val("Y");
        	if(data.mtsoLatVal != null){
        		$('#mtsoLatValTReg').val(dd2dms(data.mtsoLatVal));
        	}
        	if(data.mtsoLngVal != null){
        		$('#mtsoLngValTReg').val(dd2dms(data.mtsoLngVal));
        	}
        	if(data.mgmtGrpNm == "SKB" && data.ukeyMtsoId == ""){
        		$('#btnUkeyMtsoSearch').show();
        	}

        	$('#mtsoRegArea').setData(data);
        	$('#mtsoStatCdOld').val(data.mtsoStatCd);

        	if(data.mtsoDetlTypCd == "017") {

        		$('#mgmtGrpCdReg').setEnabled(false);
        		$('#orgReg').setEnabled(false);
        		$('#teamReg').setEnabled(false);
        		$('#tmofReg').setEnabled(false);

        		$('#mtsoTypCdReg').setEnabled(false);
        		$('#mtsoDetlTypCdReg').setEnabled(false);
        		$('#sktSkbIntgMtsoYnReg').setEnabled(false);
        		$('#btnBldSearch').setEnabled(false);


        		$('#rnMgmtLabel').html("") ;
        		$('#rnOrgLabel').html("") ;
        		$('#rnTeamLabel').html("") ;
        		$('#rnTmofLabel').html("") ;
        		$('#rnMtsoTypLabel').html("") ;
        		$('#rnMtsoDetlTypLabel').html("") ;

        		$('#bldNmLabel').html("GIS 설치위치") ;
    			$('#bldblkNoLabel').html("한전전산번호") ;
    			$('#bldFlorNoLabel').html("") ;

        	}

    	}else{
    		$('#btnDel').hide();
    		$("#mtsoIdReg").val("MO***********");
    		$("#mtsoMapInsYnReg").val("NO");
//    		$('#mtsoRegArea').clear();
    		$('#sktSkbIntgMtsoYnReg').setSelected("NO");
    		if(data.mtsoAbbrNm == null){
        		$('#mtsoAbbrNmReg').val(data.mtsoNm);
        	}

    	}

    	if(data.fromMtsoIntg == "Y"){
    		$('#mtsoRegArea').setData(data);
    		$('#bldFlorCntReg').val(data.bldFlorVal);
    		$('#bldAddrReg').val(data.mcpNm+" "+data.sggNm+" "+data.ldongNm+" "+data.mainBunjiCtt+"-"+data.subBunjiCtt);
    	}

    	//통합시설코드로 국사명 조회
    	if(data.intgFcltsCd != "" && data.intgFcltsCd != null && data.regYn != "Y"){
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoNm/'+ data.intgFcltsCd, null, 'GET', 'mtsoNm');
    		$('#repIntgFcltsCdReg').val(data.intgFcltsCd);
    	}

    	//중심국 수정은 불가능하도록
    	if(data.mtsoTypCd == "2"){
    		$('#btnSave').hide();
    		$('#mtsoTypCdReg').setEnabled(false);
    	}
    	//중통집 구분은 무조건 수정못하도록 처리
    	$('#mtsoCntrTypCdReg').setEnabled(false);

    }

    function setSelectCode() {

    	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		 var mgmtGrpCd;
		 if(paramData == '' || paramData == null) {
			 mgmtGrpCd = chrrOrgGrpCd;
		 }else{
			 mgmtGrpCd = paramData.mgmtGrpNm;
		 }

		 if(mgmtGrpCd == "SKT"){
			 $('#bldFlorCntEm').show();
			 $('#mtsoAbbrNmRegLabel').html("국사약어명") ;
		 }else{
			 $('#bldFlorCntEm').hide();
			 $('#mtsoAbbrNmRegLabel').html("GIS국사명") ;
//			 $('#btnDupMtso').setEnabled(false);
		 }

		 //관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpCdReg');
		 //본부 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpCd, null, 'GET', 'orgReg');
    	//국사 타입 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00293', null, 'GET', 'mtsoTypCdReg');
    	//국사 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStatCdReg');
    	//국사 센터 유형
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdReg');
    	//인입 유형
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01972', null, 'GET', 'linTypCdReg');
    	//인입이중화유형
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01973', null, 'GET', 'linDplxgTypCdReg');
    	//국사 세부 유형
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02016', null, 'GET', 'mtsoDetlTypCdReg');

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeamReg');


    	var comCd = "";

    	if(mgmtGrpCd == "SKT" && paramData != null){
 			 if(paramData.mtsoTypCd == "1"){
 				comCd = "001";
 			 }else if(paramData.mtsoTypCd == "2"){
 				comCd = "002";
 			 }else if(paramData.mtsoTypCd == "3"){
 				comCd = "003";
 			 }else if(paramData.mtsoTypCd == "4"){
 				comCd = "SMTSO";
 			 }else if(paramData.mtsoTypCd == ""){
 				comCd = "ALL";
 			 }
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mtsoDetlTyp/C02016/'+ mgmtGrpCd +'/'+ comCd, null, 'GET', 'mtsoDetlTypCdReg');
 		 }else{
 			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mtsoDetlTyp/C02016/'+ mgmtGrpCd +'/ALL', null, 'GET', 'mtsoDetlTypCdReg');
 		 }
    }

    function setEventListener() {

    	//관리그룹 선택시 이벤트
	   	 $('#mgmtGrpCdReg').on('change', function(e) {

	   		var mgmtGrpNm = $("#mgmtGrpCdReg").getTexts();

	   		if(mgmtGrpNm == "SKT"){
	   			 $('#bldFlorCntEm').show();
				 $('#mtsoAbbrNmRegLabel').html("국사약어명") ;
				 $('#btnDupMtso').setEnabled(true);
			}else{
				 $('#bldFlorCntEm').hide();
				 $('#mtsoAbbrNmRegLabel').html("GIS국사명") ;
				 $('#btnDupMtso').setEnabled(false);
			}

	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'orgReg');
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mtsoDetlTyp/C02016/'+ mgmtGrpNm +'/ALL', null, 'GET', 'mtsoDetlTypCdReg');

	   		var option_data =  null;
 			if($('#mgmtGrpCdReg').getTexts() == "SKT"){
// 				if(paramData != null && paramData != '' && paramData.mtsoTypCd == "2"){
// 					option_data =  [{comCd: "",comCdNm: "선택"},
// 	 								{comCd: "2",comCdNm: "중심국사"},
// 	 								{comCd: "3",comCdNm: "기지국사"},
// 	 								{comCd: "4",comCdNm: "국소"}
// 	 								];
// 				}else{
 					option_data =  [{comCd: "",comCdNm: "선택"},
 	 								{comCd: "3",comCdNm: "기지국사"},
 	 								{comCd: "4",comCdNm: "국소"}
 	 								];
// 				}
 			}else{
 				option_data =  [{comCd: "",comCdNm: "선택"},
// 								{comCd: "1",comCdNm: "정보센터"},
 								{comCd: "2",comCdNm: "국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}

 			if(paramData == '' || paramData == null) {
    			$('#mtsoTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#mtsoTypCdReg').setData({
    	             data:option_data,
    	             mtsoTypCd:paramData.mtsoTypCd
    			});
    		}

	     });

    	 //본부 선택시 이벤트
	   	 $('#orgReg').on('change', function(e) {
	        	//tango transmission biz 모듈을 호출하여야한다.

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

	   		 }

	   		 else {
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

	   			var httpRequestUri = 'tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + teamID.teamId ;

	   			httpRequest(httpRequestUri, null, 'GET', 'tmofReg');
	   		 }

	   	 });

	   	$('#mtsoTypCdReg').on('change', function(e) {

	   		 var mtsoTypCd = $("#mtsoTypCdReg").getData();
	   		 var mgmtGrpNm = $("#mgmtGrpCdReg").getTexts();
	   		 var comCd = "";
	   		 mtsoDetlTypChg = "Y";

   			 if(mgmtGrpNm == "SKT"){
   				 if(mtsoTypCd.mtsoTypCd == "1"){
   					 comCd = "001";
   				 }else if(mtsoTypCd.mtsoTypCd == "2"){
   					 comCd = "002";
   				 }else if(mtsoTypCd.mtsoTypCd == "3"){
   					 comCd = "003";
   				 }else if(mtsoTypCd.mtsoTypCd == "4"){
   					 comCd = "SMTSO";
   				 }else if(mtsoTypCd.mtsoTypCd == ""){
   					 comCd = "ALL";
   				 }
   				 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mtsoDetlTyp/C02016/'+ mgmtGrpNm +'/'+ comCd, null, 'GET', 'mtsoDetlTypCdReg');
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

	   	$('#mtsoLatValTReg').on('mousedown', function(e) {
	   		if($('#mtsoLatValReg').val() != ""){
	   				$('#mtsoLatValTReg').val($('#mtsoLatValReg').val());
	   			}
	   	});

	   	$('#mtsoLatValTReg').on('blur', function(e) {
	   		$('#mtsoLatValReg').val($('#mtsoLatValTReg').val());
				if($('#mtsoLatValTReg').val() != ""){
					$('#mtsoLatValTReg').val(dd2dms($('#mtsoLatValTReg').val()));
				}
	   	});

	   	$('#mtsoLngValTReg').on('mousedown', function(e) {
	   		if($('#mtsoLngValReg').val() != ""){
	   				$('#mtsoLngValTReg').val($('#mtsoLngValReg').val());
	   			}
	   	});

	   	$('#mtsoLngValTReg').on('blur', function(e) {
	   		$('#mtsoLngValReg').val($('#mtsoLngValTReg').val());
				if($('#mtsoLngValTReg').val() != ""){
					$('#mtsoLngValTReg').val(dd2dms($('#mtsoLngValTReg').val()));
				}
	   	});

	   	//목록
    	 $('#btnPrev').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });

    	//ERP정보
    	 $('#btnErpAcptCurstLkup').on('click', function(e) {
	   		var param =  $("#mtsoRegForm").getData();
	   		popupList('ErpCurstLkup', '/tango-transmission-web/configmgmt/common/ErpAcptCurst.do', 'ERP정보', param);
	     });

    	//네트워크현황
    	 $('#btnNtwkLineCurstLkup').on('click', function(e) {
	   		var param =  $("#mtsoRegForm").getData();
	   		popupList('MtsoNtwkLineAcptCurst', '/tango-transmission-web/configmgmt/common/MtsoNtwkLineAcptCurst.do', '네트워크현황', param);
	     });

    	 //서비스회선현황
       	 $('#btnSrvcLineCurstLkup').on('click', function(e) {
       		 var param =  $("#mtsoRegForm").getData();
       		 popupList('MtsoSrvcLineAcptCurst', '/tango-transmission-web/configmgmt/common/MtsoSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
         });

    	//중복국사관리
    	 $('#btnDupMtso').on('click', function(e) {
    		 if(paramData == '' || paramData == null) {
    			 popup('DupMtsoMgmt', '/tango-transmission-web/configmgmt/common/DupMtsoMgmt.do', configMsgArray['duplicationMobileTelephoneSwitchingMgmt']);
    		 }else{
    			 var param =  $("#mtsoRegForm").getData();
    			 param.regYn = "Y";
    			 param.mgmtGrpNm = $("#mgmtGrpCdReg").getTexts();
    			 param.orgNm = $("#orgReg").getTexts();
    			 param.teamNm = $("#teamReg").getTexts();
    			 param.tmofNm = $("#tmofReg").getTexts();
    			 param.mtsoTyp = $("#mtsoTypCdReg").getTexts();
    			 param.mtsoStat = $("#mtsoStatCdReg").getTexts();
    			 popup('DupMtsoMgmt', '/tango-transmission-web/configmgmt/common/DupMtsoMgmt.do', configMsgArray['duplicationMobileTelephoneSwitchingMgmt'], param);
    		 }
         });

    	 //건물조회
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
    	           		$('#mtsoLatValTReg').val(dd2dms(data.bldDongInfo.wgs84YcrdVal));
    	           		$('#mtsoLngValTReg').val(dd2dms(data.bldDongInfo.wgs84XcrdVal));
    	           		$('#mtsoLatValReg').val(data.bldDongInfo.wgs84YcrdVal);
    	           		$('#mtsoLngValReg').val(data.bldDongInfo.wgs84XcrdVal);
    	                $('#bldCdReg').val(data.bldInfo.bldCd);
    	                $('#bldNmReg').val(data.bldInfo.bldNm);
//    	                $('#bldAddrReg').val(data.bldInfo.sidoNm+" "+data.bldInfo.sggNm+" "+data.bldInfo.emdNm+" "+data.bldInfo.addrBunjiVal);
    	                $('#bldAddrReg').val(data.bldInfo.bldAddr);
    	                $('#bldblkNoReg').val(data.bldDongInfo.bldBlkNo);
    	                $('#bldblkNmReg').val(data.bldDongInfo.bldBlkNm);
    	                if(data.bldFlorInfo == null){
    	                	$('#bldFlorNoReg').val("");
        	                $('#bldFlorCntReg').val("");
    	           		}else{
    	           			$('#bldFlorNoReg').val(data.bldFlorInfo.bldFlorNo);
        	                $('#bldFlorCntReg').val(data.bldFlorInfo.bldFlorCnt);
    	           		}

    	                if(String($("#mgmtGrpCdReg").getTexts()) == "SKT"){
    	                	var param = {"bldCd": data.bldInfo.bldCd, "bldblkNo": data.bldDongInfo.bldBlkNo, "bldFlorNo": data.bldFlorInfo.bldFlorNo, "mgmtGrpNm": String($("#mgmtGrpCdReg").getTexts())};
    	                	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/dupBldChk', param, 'GET', 'dupBldChk');
    	                }

    	                var ldongParam = {"pageNo" : 1, "rowPerPage" : 100, "mgmtGrpNm" : String($("#mgmtGrpCdReg").getTexts()), "ldongCd" : data.bldInfo.ldongCd};
    	                httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam', ldongParam, 'GET', 'ldongSearch');
    	           	}
    	      });
         });

    	//상위국사조회
    	 $('#btnUprMtsoSearch').on('click', function(e) {
    		 var param = {};
    		 param.regYn = "Y";
    		 param.mgmtGrpNm = String($("#mgmtGrpCdReg").getTexts());
    		 param.orgId = $("#orgReg").val();
    		 param.teamId = $("#teamReg").val();
    		 param.tmof = $("#tmofReg").val();
    		 $a.popup({
    	          	popid: 'MtsoLkup',
    	          	title: configMsgArray['findMtso'],
    	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
    	            data: param,
    	            windowpopup : true,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : 750,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#uprMtsoIdReg').val(data.mtsoId);
    	                $('#uprMtsoNmReg').val(data.mtsoNm);
    	           	}
    	      });
         });

    	//장비상위국사조회
    	 $('#btnEqpUprMtsoSearch').on('click', function(e) {
    		 var param = {};
    		 param.regYn = "Y";
    		 param.mgmtGrpNm = String($("#mgmtGrpCdReg").getTexts());
    		 param.orgId = $("#orgReg").val();
    		 param.teamId = $("#teamReg").val();
    		 param.tmof = $("#tmofReg").val();
    		 param.bldAddr = $("#bldAddrReg").val();
    		 $a.popup({
    	          	popid: 'MtsoLkup',
    	          	title: configMsgArray['findMtso'],
    	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
    	            data: param,
    	            windowpopup : true,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : 750,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#eqpMgmtUmtsoIdReg').val(data.mtsoId);
    	                $('#eqpMgmtUmtsoNmReg').val(data.mtsoNm);
    	           	}
    	      });
         });

    	//협력업체조회
    	 $('#btnCnstnBpSearch').on('click', function(e) {
    		 var param =  $("#mtsoRegForm").getData();
    		 $a.popup({
    	          	popid: 'CnstnBp',
    	          	title: '협력업체조회',
    	            url: '/tango-transmission-web/constructprocess/common/BpCommon.do',
    	            data: param,
    	            windowpopup : true,
    	            modal: true,
                    movable:true,
    	            width : 800,
    	           	height : window.innerHeight * 0.65,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#cnstnBpIdReg').val(data.bpId);
    	                $('#cnstnBpNmReg').val(data.bpNm);
    	           	}
    	      });
         });

    	 //UKEY국사조회
    	 $('#btnUkeyMtsoSearch').on('click', function(e) {
    		 var param =  $("#mtsoRegForm").getData();
    		 param.mgmtGrpNm = String($("#mgmtGrpCdReg").getTexts());
    		 param.swingCdSearch ='Y';
    		 $a.popup({
	 	          	popid: 'MtsoLkup',
	 	          	title: configMsgArray['findMtso'],
	 	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
	 	            data: param,
	 	            modal: true,
	                movable:true,
	 	            width : 950,
	 	           	height : window.innerHeight * 0.8,
	 	           callback : function(data) { // 팝업창을 닫을 때 실행
		                if(data.ukeyMtsoId != "" && data.ukeyMtsoId != null){
		                	$('#ukeyMtsoIdReg').val(data.ukeyMtsoId);
		                	$('#intgMtsoId').val(data.mtsoId);
		                	$('#intgMtsoYn').val("Y");
		                	$('#mtsoNmReg').val(data.mtsoNm);
		                }
		           	}
	 	      });
         });

    	 $('#eqplist').on('click', function(e) {
    		 var param =  $("#mtsoRegForm").getData();
    		 param.mgmtGrpNm = String($("#mgmtGrpCdReg").getTexts());
    		 param.closeYn = "N";
    		 $a.popup({
    	          	popid: 'EqpLkup',
    	          	title: configMsgArray['findEquipment'],
    	            url: '/tango-transmission-web/configmgmt/equipment/EqpLkup.do',
    	            data: param,
    	            modal: true,
                    movable:true,
    	            width : 950,
    	           	height : window.innerHeight * 0.8,
    	      });
         });

    	 //사이트 조회
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

    	//취소
    	 $('#btnCncl').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 $a.close();
         });

    	//저장
    	 $('#btnSave').on('click', function(e) {

    		 var param =  $("#mtsoRegForm").getData();

    		 if(orgMtsoStatCd != '03' && param.mtsoStatCd == '03') {
    	    	 if (mtsoOthrMdulUseYn == "Y") {
 	    			//타모듈 사용 체크
    	    		callMsgBox('','I', "해당 국사는 ["+mtsoUseChk_data[0]+" "+ mtsoUseChk_data[1] + " " + mtsoUseChk_data[2] + "] 모듈에서 사용하고있는 국사 입니다. 철거 하실 수 없습니다.<br> * 철거불가 예1)  GIS에 입력된 국사일 경우 <br> * 철거불가 예2) 회선 상하위국사 혹은 관할국사로 입력된 국사일 경우 <br> * 철거불가 예3) 링 상하위국사 혹은 관할국사로 입력된 국사일 경우", function(msgId, msgRst){});
   	 	     		return;
    	    	 }
    		 }

    		 if (param.mgmtGrpCd == "") {
	     		//필수 선택 항목입니다.[ 관리그룹 ]
		    	callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['managementGroup']), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.orgId == "") {
		     	//필수 선택 항목입니다.[ 본부 ]
			    callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['hdofc']), function(msgId, msgRst){});
		     	return;
		     }

	    	 if (param.teamId == "") {
	    		//필수 선택 항목입니다.[ 팀 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['team']), function(msgId, msgRst){});
			    return;
		     }

	    	 if (param.tmof == "") {
	    		//필수 선택 항목입니다.[ 전송실 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['transmissionOffice']), function(msgId, msgRst){});
			    return;
		     }

	    	 if (param.mtsoNm == "") {
	    		//필수 선택 항목입니다.[ 국사명 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOfficeName']), function(msgId, msgRst){});
			    return;
		     }

	    	 if (param.mtsoTypCd == "") {
	     		//필수 선택 항목입니다.[ 국사유형 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOfficeType']), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.mtsoStatCd == "") {
	     		//필수 선택 항목입니다.[ 국사상태 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['mobileTelephoneSwitchingOfficeStatus']), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.bldCd == "") {
	     		//필수 선택 항목입니다.[ 건물명 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',' 건물명 '), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.bldblkNo == "") {
	     		//필수 선택 항목입니다.[ 건물동 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',' 건물동 '), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (param.bldFlorNo == "" && param.mgmtGrpCd == "0001") {
	     		//필수 선택 항목입니다.[ 건물층값 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption',' 건물층값 '), function(msgId, msgRst){});
	     		return;
	     	 }

	    	 if (dupBldChk == "Y") {
    			//건물 중복 체크
 		    	callMsgBox('','I', "선택하신 건물/건물동/건물층에 기존에 등록된 국사["+ dupMtsoNm +"]가 있습니다.", function(msgId, msgRst){});
 	     		return;
	     	 }

	    	 if (param.mtsoDetlTypCd == "") {
	     		//필수 선택 항목입니다.[ 국사세부유형 ]
				callMsgBox('','I', makeArgConfigMsg('requiredOption','국사세부유형'), function(msgId, msgRst){});
	     		return;
	     	 }

         	//tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
 			       //저장한다고 하였을 경우
		        if (msgRst == 'Y') {
		        	 mtsoReg();
		        }
		     });
         });

    	//삭제
    	 $('#btnDel').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	mtsoDel();;
  		        }
  		      });
         });

	};



	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'updateGisFdfEqpNm') {
			var userId;
	   		if($("#userId").val() == ""){
	   			 userId = "SYSTEM";
	   		}else{
	   			 userId = $("#userId").val();
	   		}
	   		var paramDataR =  $("#mtsoRegForm").getData();
            var param = [{"mtsoId":paramDataR.mtsoId, "mtsoDetlTypCd":paramDataR.mtsoDetlTypCd, "ukeyMtsoCd":paramDataR.ukeyMtsoId, "fcltNm":paramDataR.mtsoNm, "bldNo":paramDataR.bldCd ,"addrNm":paramDataR.bldAddr ,"intgFcltsCd":paramDataR.repIntgFcltsCd ,"editUserId":userId}];
            httpRequest('tango-transmission-gis-biz/transmission/gis/fm/facilityinfo/updateMtsoDetlTypCd' , param, 'POST', 'updateMtsoDetlTypCd');

    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		});

            var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();

            $(parent.location).attr("href","javascript:mtsoIntgLkup.setGrid("+pageNo+","+rowPerPage+");");
    	}

    	if(flag == 'MtsoReg') {
    		if(response.Result == "Success"){
        		var paramDataR =  $("#mtsoRegForm").getData();
                httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateGisFdfEqpNm', paramDataR, 'POST', 'updateGisFdfEqpNm');
    		}else if(response.Result == "Use"){
    			callMsgBox('','I', configMsgArray['saveFail']+" (운용중인 장비가 있습니다.)" , function(msgId, msgRst){});
    		}else if(response.Result == "DupIntgFcltsCd"){
    			callMsgBox('','W', "[ "+response.DupIntgFcltsCd[0].intgFcltsCd+" ] 코드는 [ "+response.DupIntgFcltsCd[0].mtsoStat+" ] 상태의 [ "+response.DupIntgFcltsCd[0].mtsoNm+" ] 국사에 이미 등록되어 있습니다.", function(msgId, msgRst){});
    		}
    	}

    	if(flag == 'MtsoDel') {
    		//삭제를 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
    		       if (msgRst == 'Y') {
    		           $a.close();
    		       }
    		 });
    		var pageNo = $("#pageNo", parent.document).val();
    		var rowPerPage = $("#rowPerPage", parent.document).val();

            $(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+");");
    	}

    	//본부 콤보박스
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
	   			 }else{
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
		       		//본부 세션값이 있을 경우 해당 팀,전송실 조회
	       			if(selectId == null){
	    	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'teamReg');
	    		    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmofReg');
	    	   		}else{
	    	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'teamReg');
	    	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + sUprOrgId+'/ALL', null, 'GET', 'tmofReg');
	    	   		}
	   			 }
    		}
    		else {
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
	    			var httpRequestUri = 'tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + $('#orgReg').val() ;

		   			httpRequest(httpRequestUri, null, 'GET', 'teamReg');
	    		}
    		}
    	}

    	// 팀 콤보 박스
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
	   			 }else{
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
    		}
    		else {

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
    				var httpRequestUri = 'tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#teamReg').val() ;

    	   			httpRequest(httpRequestUri, null, 'GET', 'tmofReg');
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
    		}
    		else {
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

    	//국사유형 콤보 박스
    	if(flag == 'mtsoTypCdReg') {
    		$('#mtsoTypCdReg').clear();

    		if(paramData == '' || paramData == null) {
    			$('#mtsoTypCdReg').setData({
    	             data:response
    			});
    		}
    		else {
    			$('#mtsoTypCdReg').setData({
    	             data:response,
    	             mtsoTypCd:paramData.mtsoTypCd
    			});
    		}
    	}

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
	    		}
	    		else {
	    			$('#mgmtGrpCdReg').setData({
	    	             data:response,
	    	             mgmtGrpCd:paramData.mgmtGrpCd
	    			});
	    		}
			}

			var option_data =  null;
 			if($('#mgmtGrpCdReg').getTexts() == "SKT"){
// 				if(paramData != null && paramData != '' && paramData.mtsoTypCd == "2"){
// 					option_data =  [{comCd: "",comCdNm: "선택"},
// 	 								{comCd: "2",comCdNm: "중심국사"},
// 	 								{comCd: "3",comCdNm: "기지국사"},
// 	 								{comCd: "4",comCdNm: "국소"}
// 	 								];
// 				}else{
 					option_data =  [{comCd: "",comCdNm: "선택"},
 	 								{comCd: "3",comCdNm: "기지국사"},
 	 								{comCd: "4",comCdNm: "국소"}
 	 								];
// 				}
 			}else{
 				option_data =  [{comCd: "",comCdNm: "선택"},
// 								{comCd: "1",comCdNm: "정보센터"},
 								{comCd: "2",comCdNm: "국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}

 			if(paramData == '' || paramData == null) {
    			$('#mtsoTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#mtsoTypCdReg').setData({
    	             data:option_data,
    	             mtsoTypCd:paramData.mtsoTypCd
    			});
    		}
    	}

    	//국사 ID 생성
    	if(flag == 'mtsoIdReg') {
    		$("#mtsoIdReg").val(response.mtsoId);
    	}

    	//국사 명 생성
    	if(flag == 'mtsoNm') {
    		if(response.result == null || response.result == ""){

    		}else{
    			$('#mtsoNmReg').setEnabled(false);
	    		$("#mtsoNmReg").val(response.result.mtsoNm);
	    		$('#intgFcltsDivCdReg').val(response.result.intgFcltsDivCd);
	    		$('#detlBizDivCdReg').val(response.result.detlBizDivCd);

	    		var mtsoTyp = "";
	    		if(response.result.intgFcltsDivCd == "02"){
	    			mtsoTyp = "3";
	    		}else if(response.result.intgFcltsDivCd == "03"){
	    			mtsoTyp = "4";
	    		}else if(response.result.intgFcltsDivCd == "04"){
	    			mtsoTyp = "4";
	    		}else if(response.result.intgFcltsDivCd == "05"){
	    			mtsoTyp = "1";
	    		}else if(response.result.intgFcltsDivCd == "06"){
	    			mtsoTyp = "2";
	    		}

	    		$('#mtsoTypCdReg').setSelected(mtsoTyp);
    		}
    	}

    	if(flag == 'dupBldChk') {
    		if(response.result == null || response.result == ""){
    			dupBldChk = "N";
    		}else{
    			dupBldChk = "Y";
    			dupMtsoNm = response.result.mtsoNm;
    		}
    	}

    	//국사상태 콤보 박스
    	if(flag == 'mtsoStatCdReg') {
    		$('#mtsoStatCdReg').clear();


    		if(paramData == '' || paramData == null) {
    			$('#mtsoStatCdReg').setData({
    	             data:response,
    	             mtsoStatCd:"01"
    			});
    		}
    		else {
    			$('#mtsoStatCdReg').setData({
    	             data:response,
    	             mtsoStatCd:paramData.mtsoStatCd
    			});
    		}

    	}

    	//국사센터유형 콤보 박스
    	if(flag == 'mtsoCntrTypCdReg') {
    		$('#mtsoCntrTypCdReg').clear();

    		var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#mtsoCntrTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			var mtsoCntrTypCdData = "";
    			if(paramData.mtsoTypCd == "2"){
    				mtsoCntrTypCdData = paramData.mtsoCntrTypCd
    			}else{
    				mtsoCntrTypCdData = "99";
    			}

    			$('#mtsoCntrTypCdReg').setData({
    	             data:option_data,
    	             mtsoCntrTypCd:mtsoCntrTypCdData
    			});
    		}
    	}

    	//인입유형 콤보 박스
    	if(flag == 'linTypCdReg') {
    		$('#linTypCdReg').clear();

    		var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#linTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#linTypCdReg').setData({
    	             data:option_data,
    	             linTypCd:paramData.linTypCd
    			});
    		}
    	}

    	//인입이중화유형 콤보 박스
    	if(flag == 'linDplxgTypCdReg') {
    		$('#linDplxgTypCdReg').clear();

    		var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#linDplxgTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#linDplxgTypCdReg').setData({
    	             data:option_data,
    	             linDplxgTypCd:paramData.linDplxgTypCd
    			});
    		}
    	}

    	if(flag == 'mtsoDetlTypCdReg') {
    		$('#mtsoDetlTypCdReg').clear();

    		var option_data =  [{comCd: "", comCdNm: configMsgArray['select']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];

				if (resObj.comCd != '017') {    // T_RN 국사일 경우엔 리스트에 보여주지 않음 - 서영응 20190213
					option_data.push(resObj);
				}
			}

    		if(paramData == '' || paramData == null) {
    			$('#mtsoDetlTypCdReg').setData({
    	             data:option_data
    			});
    		}
    		else {
    			if(paramData.mtsoDetlTypCd == '017') {
    				option_data.push({comCd:paramData.mtsoDetlTypCd, comCdNm: paramData.mtsoDetlTypNm}   );
    			}


    			$('#mtsoDetlTypCdReg').setData({
    	             data:option_data,
    	             mtsoDetlTypCd:paramData.mtsoDetlTypCd
    			});
    		}

    		if(mtsoDetlTypChg == "Y"){
    			var mgmtGrpNm = $("#mgmtGrpCdReg").getTexts();
    			var mtsoTypCd = $("#mtsoTypCdReg").getData();

    			if(mgmtGrpNm == "SKT" && mtsoTypCd.mtsoTypCd == "1"){
    				$('#mtsoDetlTypCdReg').setSelected("001");
    			}else if(mgmtGrpNm == "SKT" && mtsoTypCd.mtsoTypCd == "2"){
    				$('#mtsoDetlTypCdReg').setSelected("002");
    			}else if(mgmtGrpNm == "SKT" && mtsoTypCd.mtsoTypCd == "3"){
    				$('#mtsoDetlTypCdReg').setSelected("003");
    			}else if(mgmtGrpNm == "SKT" && mtsoTypCd.mtsoTypCd == "4" && $("#intgFcltsDivCdReg").val() == "03"){
    				$('#mtsoDetlTypCdReg').setSelected("005");
    			}else if(mgmtGrpNm == "SKT" && mtsoTypCd.mtsoTypCd == "4" && $("#intgFcltsDivCdReg").val() == "04" && $("#detlBizDivCdReg").val() == "010"){
    				$('#mtsoDetlTypCdReg').setSelected("006");
    			}
    		}
    	}

    	if(flag == 'opTeamReg'){
    		$('#opTeamOrgIdReg').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


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
    		}
    		else {
    			$('#opPostOrgIdReg').setData({
                    data:option_data,
                    opPostOrgId:paramData.opPostOrgId
    			});
    		}
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

    	if(flag == 'mtsoUseChk') {
    		mtsoUseChk_data =  [];
    		if(response.result == null || response.result == ""){
    			mtsoOthrMdulUseYn = "N";
    		}else{
        		for(var i=0; i<3; i++){
        			var resObj = response.result[i];
        			 if(resObj == null || resObj == ""){
         				resObj = '';
         				mtsoUseChk_data[i] = resObj;
         			}
        			 else{
             			if(resObj.useChk == 'SRVC'){
            				resObj.useChk = '회선';
            			}
            			else if(resObj.useChk == 'NTWK'){
            				resObj.useChk = '링';
            			}
             			mtsoUseChk_data[i] = resObj.useChk;
        			 }
        		}
    			mtsoOthrMdulUseYn = "Y";
    		}
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    	if(flag == 'MtsoReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'MtsoDel'){
    		//삭제를 실패 하였습니다.
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

    	 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

    	 if($('#regYn').val() == "Y"){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateMtsoMgmt', param, 'POST', 'MtsoReg');
    	 }else{
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/insertMtsoMgmt', param, 'POST', 'MtsoReg');
    	 }
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

    function mtsoDel() {
   	 	var mtsoId =  $("#mtsoIdReg").val();

   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/deleteMtsoInf/'+mtsoId, null, 'POST', 'MtsoDel');

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