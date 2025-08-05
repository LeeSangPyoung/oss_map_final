/**
 * EqpLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;
	var closeYn = null;
	var fdfRegBtnYn = false;
	var fdfRegMtsoId = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(param.closeYn == "N"){
    		closeYn = param.closeYn;
    	}
    	if(param.fdfRegBtnYn == "Y"){
    		fdfRegBtnYn = true; //FDF 간편등록버튼

    		if(param.mtsoId != null && param.mtsoId != ''){
    			fdfRegMtsoId = param.mtsoId;//국사번호
        	}
    	}

    	if(param.ukeyEqpYn == "Y"){
    		paramData = param;
    		$('#mgmtGrpNm').setEnabled(false);
    		$('#org').setEnabled(false);
    		$('#team').setEnabled(false);
    		$('#tmof').setEnabled(false);
    		$('#mtsoNm').setEnabled(false);
    		$('#eqpRoleDivCd').setEnabled(false);
    		$('#eqpTid').setEnabled(false);
    	}

        if(param.fromE2EEqpSctn == "Y"){
        	$('#mgmtGrpNm').setEnabled(false);
        	$('#fromE2EEqpSctn').val(param.fromE2EEqpSctn);

        	paramData = {"mgmtGrpNm" : "SKT", "fromE2EEqpSctn" : "Y"};
    	}else if(param.ukeyEqpYn != "Y"){
    		setList(param);
    	}

        initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
        $("#upsdRack1").hide();
        $("#upsdRack2").hide();
        $("#upsdShlf1").hide();
        $("#upsdShlf2").hide();
        $('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
        $('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');
    };

    function setRegDataSet(data) {
    	if(data.ukeyEqpYn == "Y"){
//    		$('#contentArea').setData(data);
    		$('#mgmtGrpNm').val(data.mgmtGrpNm);
        	$('#org').setData({
        		orgId:data.orgId
    		});
        	$('#team').setData({
        		teamId:data.teamId
    		});
        	$('#tmof').setData({
        		tmof:data.tmof
    		});
        	$('#eqpRoleDivCd').setData({
        		eqpRoleDivCd:data.eqpRoleDivCd
    		});
        	$('#mtsoNm').val(data.mtsoNm);
    		$('#eqpTid').val(data.eqpTid);
    		$('#intgEqpYnLkup').val("Y");
//    		paramData = {"mgmtGrpNm" : param.mgmtGrpNm, "ukeyEqpYn" : param.ukeyEqpYn};

    	}
    }

  //Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 관리그룹              */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '100px'
    		}, {/* 전송실 		 */
    			key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			}, {/* 국사   		 */
				key : 'eqpInstlMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOffice'],
				width: '100px'
			}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'
			}, {/* 장비명       	 */
				key : 'eqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '150px'
			}, {/* 숨김데이터 */
				key : 'eqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '100px'
			}, {/* 숨김데이터 */
				key : 'eqpRoleDivCd', align:'center',
				title : configMsgArray['equipmentType']+"ID",
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			}, {/* 장비IP주소    	 */
				key : 'mainEqpIpAddr', align:'center',
				title : configMsgArray['equipmentInternetProtocolAddress'],
				width: '100px'
			}, {/* 장비통시코드     	 */
				key : 'intgFcltsCd', align:'center',
				title : '장비통시코드',
				width: '100px'
			/*}, { 국사통시코드
				key : 'repIntgFcltsCd', align:'center',
				title : '국사통시코드',
				width: '100px'
			}, { UKEY국사코드
				key : 'ukeyMtsoId', align:'center',
				title : 'UKEY국사코드',
				width: '100px'*/
			}, {/* 장비상태     	 */
				key : 'eqpStatNm', align:'center',
				title : configMsgArray['equipmentStatus'],
				width: '100px'
			}, {/* 장비용도     	 */ //라종식
				key : 'tnEqpUsgNm', align:'center',
				title : '장비용도',
				width: '100px'
			},{/* 장비TID    	 */
				key : 'eqpTid', align:'center',
				title : configMsgArray['equipmentTargetId'],
				width: '100px'
			},{/* UKEY장비관리번호 */
				key : 'ukeyEqpMgmtNo', align:'center',
				title : 'SWING장비관리번호',
				width: '120px'
			},{/* 바코드    	 */
				key : 'barNo', align:'center',
				title : configMsgArray['barcode'],
				width: '120px'
			},{/* 장비한글명 		 */ // 라종식
				key : 'eqpHanNm', align:'center',
				title : '장비한글명',//configMsgArray[''],
				width: '180px'
			},{/* 상면랙번호    	 */
				key : 'upsdRackNo', align:'center',
				title : "상면랙번호",
				width: '100px'
			},{/* 상면쉘프번호    	 */
				key : 'upsdShlfNo', align:'center',
				title : "상면쉘프번호",
				width: '100px'
			},{/* 포트수동등록차단 Y:차단, N:미차단_[20171019] */
				key : 'portPveRegIsolYn', align:'center',
				title : "포트수동등록차단",
				width: '100px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		 var mgmtGrpCd = "";
		 if(paramData == '' || paramData == null) {
			 mgmtGrpCd = chrrOrgGrpCd;
		 }else{
			 mgmtGrpCd = paramData.mgmtGrpNm;
		 }

		 if(mgmtGrpCd == "SKT"){
			 $("#sktMtso").show();
			 $("#skbMtso").hide();
			 $('#repIntgFcltsCdLabel').html("국사통시코드") ;
//			 $('#'+gridId).alopexGrid("showCol", 'repIntgFcltsCd');
//			 $('#'+gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
		 }else{
			 $("#sktMtso").hide();
			 $("#skbMtso").show();
			 $('#repIntgFcltsCdLabel').html("SWING국사코드") ;
//			 $('#'+gridId).alopexGrid("hideCol", 'repIntgFcltsCd', 'conceal');
//			 $('#'+gridId).alopexGrid("showCol", 'ukeyMtsoId');
		 }

		 var param = {"mgmtGrpNm": mgmtGrpCd};

		 //관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpCd, null, 'GET', 'fstOrg');
    	//팀 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpCd, null, 'GET', 'fstTeam');
    	//전송실 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpCd, null, 'GET', 'tmof');
    	//장비 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCd');
    	//장비 역할 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCd');
    	if(mgmtGrpCd != "" && mgmtGrpCd != undefined){
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ mgmtGrpCd, null, 'GET', 'eqpRoleDivCd');
    	}
    	//장비모델 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
    	//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');

		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'getUserJrdtTmofInfo');

    }

    function setList(param){
    	if(!fdfRegBtnYn){
    		$('#btnFdfRegPop').hide();//FDF등록버튼
    	}

    	if(JSON.stringify(param).length > 2){
        	$('#contentArea').setData(param);
        	$('#pageNo').val(1);
        	$('#rowPerPage').val(100);

        	paramData = param;
        	param.pageNo = 1;
        	param.rowPerPage = 100;
        	param.fdfChk = "N";
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpLkup', param, 'GET', 'search');
        }
    }

    function setEventListener() {

         var perPage = 100;

     	// 페이지 번호 클릭시
     	 $('#'+gridId).on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	setGrid(eObj.page, eObj.pageinfo.perPage);
          });

     	//페이지 selectbox를 변경했을 시.
          $('#'+gridId).on('perPageChange', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	perPage = eObj.perPage;
          	setGrid(1, eObj.perPage);
          });

     	//조회
     	 $('#btnSearch').on('click', function(e) {
     		 setGrid(1,perPage);
          });

     	//엔터키로 조회
          $('#searchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			setGrid(1,perPage);
        		}
      	 });

     	 //FDF간편등록
         	$('#btnFdfRegPop').on('click', function(e) {
         	 var param = new Object();
         	 param.mtsoId = fdfRegMtsoId;//국사번호
      		 $a.popup({
      	          	popid: 'EqpFdfReg.do',
      	          	title: configMsgArray['fiberDistributionFrameEasyReg'],
      	            url: '/tango-transmission-web/configmgmt/equipment/EqpFdfReg.do',
      	            data: param,
      	            modal: true,
                    movable:true,
                    width : 550,
     	           	height : window.innerHeight * 0.75,
	      	        callback : function(data) { // 팝업창을 닫을 때 실행
	      	        	$a.close(data);//장비 ID
	   	           	}
      	      });
          });

        //등록
     	 $('#btnRegPop').on('click', function(e) {
     		 /* 장비등록     	 */
//     		 popup('EqpRegPop', $('#ctx').val()+'/configmgmt/equipment/EqpReg.do', configMsgArray['equipmentRegistration'], dataParam);
     		 window.open('EqpInfMgmt.do?fromOther=Y');
          });

    	//관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 if(mgmtGrpNm == "SKT"){
    			 $("#sktMtso").show();
    			 $("#skbMtso").hide();
    			 $('#repIntgFcltsCdLabel').html("국사통시코드") ;
//    			 $('#'+gridId).alopexGrid("showCol", 'repIntgFcltsCd');
//    			 $('#'+gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
    		 }else{
    			 $("#sktMtso").hide();
    			 $("#skbMtso").show();
    			 $('#repIntgFcltsCdLabel').html("SWING국사코드") ;
//    			 $('#'+gridId).alopexGrid("hideCol", 'repIntgFcltsCd', 'conceal');
//    			 $('#'+gridId).alopexGrid("showCol", 'ukeyMtsoId');
    		 }

    		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ mgmtGrpNm, null, 'GET', 'eqpRoleDivCd');
    		 //장비모델 조회
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
    		 //제조사 조회
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');

         });

    	//본부 선택시 이벤트
    	 $('#org').on('change', function(e) {

    		 var orgID =  $("#org").getData();

    		 if(orgID.orgId == ''){
    			 var mgmtGrpNm = $("#mgmtGrpNm").val();

    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTeamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
    		 }
         });

    	 // 팀을 선택했을 경우
    	 $('#team').on('change', function(e) {

    		 var orgID =  $("#org").getData();
    		 var teamID =  $("#team").getData();

     	 	 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		var mgmtGrpNm = $("#mgmtGrpNm").val();

			     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }

    	 });

    	//장비타입 선택시 이벤트
     	 $('#eqpRoleDivCd').on('change', function(e) {
          	//tango transmission biz 모듈을 호출하여야한다.
     		 var eqpRoleDivCd =  $("#eqpRoleDivCd").getData();
     		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

     		 if(eqpRoleDivCd.eqpRoleDivCd == ''){

     		 }else {
     			param.eqpRoleDivCd = eqpRoleDivCd.eqpRoleDivCd;

     			 if(eqpRoleDivCd.eqpRoleDivCd == '11' || eqpRoleDivCd.eqpRoleDivCd == '177' || eqpRoleDivCd.eqpRoleDivCd == '178' || eqpRoleDivCd.eqpRoleDivCd == '182'){
     				 $("#upsdRack1").show();
     				 $("#upsdRack2").show();
     				 $("#upsdShlf1").show();
     				 $("#upsdShlf2").show();
     				 $('#'+gridId).alopexGrid("showCol", 'upsdRackNo');
     				 $('#'+gridId).alopexGrid("showCol", 'upsdShlfNo');
     			 }else{
     				 $("#upsdRack1").hide();
     				 $("#upsdRack2").hide();
     				 $("#upsdShlf1").hide();
     				 $("#upsdShlf2").hide();
     				 $('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
     				 $('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');
     				 $("#upsdRackNo").val("");
     				 $("#upsdShlfNo").val("");
     			 }
     		 }

     		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
     		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
          });

     	//제조사 선택시 이벤트
     	 $('#bpId').on('change', function(e) {
          	//tango transmission biz 모듈을 호출하여야한다.
     		 var bpId =  $("#bpId").getData();
     		 var eqpRoleDivCd =  $("#eqpRoleDivCd").getData();
     		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

     	 	 if(bpId.bpId == '' && eqpRoleDivCd.eqpRoleDivCd == ''){

     	 	 }else if(bpId.bpId == '' && eqpRoleDivCd.eqpRoleDivCd != ''){
     	 		param.eqpRoleDivCd = eqpRoleDivCd.eqpRoleDivCd;
     		 }else if(bpId.bpId != '' && eqpRoleDivCd.eqpRoleDivCd == ''){
     			param.bpId = bpId.bpId;
     		 }else {
     			param.eqpRoleDivCd = eqpRoleDivCd.eqpRoleDivCd;
     			param.bpId = bpId.bpId;
     		 }

     	 	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
          });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	if(closeYn != "N"){
    	 		$a.close(dataObj);
    	 	}

    	 });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });

	};

	function successCallback(response, status, jqxhr, flag){

		//관리그룹
    	if(flag == 'mgmtGrpNm'){

    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }

    		$('#mgmtGrpNm').clear();

    		var option_data = [{comCd: "", comCdNm: configMsgArray['all']}];

    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					option_data.push(resObj);

					if(paramData == '' || paramData == null) {
						if(resObj.comCdNm == chrrOrgGrpCd) {
							selectId = resObj.comCdNm;
							break;
						}
					}
				}
				if(paramData == '' || paramData == null) {
	    			$('#mgmtGrpNm').setData({
	    				data:response ,
	    				mgmtGrpNm:selectId
	    			});
	    		}
	    		else {
	    			$('#mgmtGrpNm').setData({
	    	             data:option_data,
	    	             mgmtGrpNm:paramData.mgmtGrpNm
	    			});
	    		}
			}
    	}

    	//본부 콤보박스
    	if(flag == 'fstOrg'){
    		var chrrOrgGrpCd;
    		if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}

			var sUprOrgId = "";
			if(paramData == null){
				if($("#sUprOrgId").val() != ""){
					sUprOrgId = $("#sUprOrgId").val();
				}
			}else{
				if(paramData.orgId == null){
					sUprOrgId = $("#sUprOrgId").val();
				}else{
					sUprOrgId = paramData.orgId;
				}
			}

			$('#org').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
		    		for(var i=0; i<response.length; i++){
		    			var resObj = response[i];
		    			option_data.push(resObj);
		    			if(resObj.orgId == sUprOrgId) {
							selectId = resObj.orgId;
						}
		    		}
		    		if(selectId == null){
		    			selectId = response[0].orgId;
		    			sUprOrgId = selectId;
		    		}
		    		$('#org').setData({
						data:option_data ,
						orgId:selectId
					});

		    		//본부 세션값이 있을 경우 해당 팀,전송실 조회
		   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + sUprOrgId, null, 'GET', 'fstTeam');
	   		}else{
	   			$('#org').setData({
					data:option_data
				});

	   			$('#team').setData({
  					data:option_data
  				});

	   			$('#tmof').setData({
		             data:[{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}]
				});

	   			$('#eqpRoleDivCd').setData({
	                 data:[{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}]
	    		});
	   		}

//	   		if(paramData.ukeyEqpYn == "Y"){
//	   			$('#org').setData({
//	   				orgId:""
//				});
//	   		}

    	}

    	if(flag == 'org'){
    		$('#org').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#org').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'fstTeam'){
    		var chrrOrgGrpCd;
    		if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}

    		var sOrgId = "";
  			if(paramData == null){
  	  			if($("#sOrgId").val() != ""){
  	  				sOrgId = $("#sOrgId").val();
  	  			}
			}else{
				if(paramData.teamId == null){
					sOrgId = $("#sOrgId").val();
				}else{
					sOrgId = paramData.teamId;
				}
			}

  			$('#team').clear();

      		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#team').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#team').val() != ""){
  	    			sOrgId = selectId;
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#team').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + $('#org').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}

//      		if(paramData.ukeyEqpYn == "Y"){
//	   			$('#team').setData({
//	   				teamId:""
//				});
//	   		}
    	}

    	if(flag == 'team'){
    		$('#team').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#team').setData({
                 data:option_data
    		});

    	}

    	if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
		}

		if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCd').clear();
    		var option;
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];
    		var option_data_e2e =  [{comCd: "",comCdNm: configMsgArray['all']}
    								,{comCd: "04",comCdNm: "IBC"}
    								,{comCd: "05",comCdNm: "IBR"}
    								,{comCd: "06",comCdNm: "IBRR"}
    								,{comCd: "03",comCdNm: "LTE L3"}
    								,{comCd: "02",comCdNm: "LTE L2"}
    								,{comCd: "01",comCdNm: "WIFI L2"}
    								,{comCd: "23",comCdNm: "LTE DU"}
    								,{comCd: "25",comCdNm: "LTE RU"}
    								,{comCd: "18",comCdNm: "RINGMUX"}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		if(paramData == null || paramData == ""){
    			option = option_data;
    		}else{
    			if(paramData.fromE2EEqpSctn == "Y"){
    				option = option_data_e2e;
    			}else{
    				option = option_data;
    			}
    		}

    		$('#eqpRoleDivCd').setData({
                 data:option
    		});

    		/*$('#eqpMdlId').setData({
//	             data:[{comCd: "", comCdNm: configMsgArray['all']}]
    			comCd:""
    		});

    		$('#bpId').setData({
//	             data:[{comCd: "", comCdNm: configMsgArray['all']}]
    			comCd:""
    		});*/
    	}

		if(flag == 'mdl'){
			$('#eqpMdlId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#eqpMdlId').setData({
	             data:option_data
			});
		}

		if(flag == 'bp'){
			$('#bpId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpId').setData({
	             data:option_data
			});
		}

    	if(flag == 'eqpStatCd'){
    		$('#eqpStatCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#eqpStatCd').setData({
                 data:option_data,
                 eqpStatCd: '01' // 라종식
    		});
    	}

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.eqpLkupList);
    	}

    	// 사용자 관할 전송실(일반)
		if (flag == 'getUserJrdtTmofInfo') {
			userJrdtTmofInfo = response.userJrdtTmofInfo;
			var userTmof = "";
			var userJrdtTmofMgmtCd = "";

			// 소속전송실 셋팅
			for (var i = 0 ; i < userJrdtTmofInfo.length; i++) {
				if (userJrdtTmofInfo[i].blgtTmofYn == 'Y') {
					userTmof = userJrdtTmofInfo[i].jrdtTmofId;
					break;
				} else if (userJrdtTmofInfo[i].jrdtTmofId == '0') {
					userTmof = userJrdtTmofInfo[i].jrdtTmofId;
					break;
				}
			}

			// 설정된 소속전송실이 없는경우
			if (userTmof == "0") {
				userTmof = "";
			}

			$('#tmof').setData({
				tmof:userTmof
			});
		}

    }

	function setSPGrid(GridID,Option,Data) {

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    	      callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['eqpId', 'eqpRoleDivCd','portPveRegIsolYn']; //portPveRegIsolYn추가[20171019]

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();

    	 var fdfChk = "N" ;
     	 if ($("input:checkbox[id='fdfChk']").is(":checked") ){
     		fdfChk = "Y";
     	 }

     	 var nlnkgChk = "N" ;
	   	 if ($("input:checkbox[id='nlnkgChk']").is(":checked") ){
	   		 nlnkgChk = "Y";
	   	 }

    	 param.fdfChk = fdfChk;
    	 param.nlnkgChk = nlnkgChk;

    	 $('#'+gridId).alopexGrid('showProgress');

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpLkup', param, 'GET', 'search');
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