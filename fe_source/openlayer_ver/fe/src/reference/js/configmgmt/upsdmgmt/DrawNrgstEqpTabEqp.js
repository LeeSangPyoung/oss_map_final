/**
 * EqpLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var TabEqp = $a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        initGrid();
    	setSelectCode();
        setEventListener();

    	if(param.mtsoNm !="" ){
    		paramData = param;
    	}
        $("#upsdRack1").hide();
        $("#upsdRack2").hide();
        $("#upsdShlf1").hide();
        $("#upsdShlf2").hide();
        $('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
        $('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');
    };

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
    		height: 280,
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
		 }else{
			 $("#sktMtso").hide();
			 $("#skbMtso").show();
			 $('#repIntgFcltsCdLabel').html("SWING국사코드") ;
		 }

		 var param = {"mgmtGrpNm": mgmtGrpCd};

		 //관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpCd, null, 'GET', 'fstOrg');
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

    }

    function setList(param){
		$('#btnFdfRegPop').hide();//FDF등록버튼
    	if(JSON.stringify(param).length > 2){
//        	$('#contentArea').setData(param)
    		$('#mgmtGrpNm').val(param.mgmtGrpNm);
    		$('#mtsoNm').val(param.mtsoNm);
    		$('#mtsoId').val(param.mtsoId);
        	$('#pageNo').val(1);
        	$('#rowPerPage').val(100);

        	paramData = param;
        	var param =  $("#searchFormEqpTab").getData();
        	param.mtsoNm = paramData.mtsoNm;
        	param.mtsoId = paramData.mtsoId;
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getNrgstEqpList', param, 'GET', 'search');
        }
    }

    function setEventListener() {

         var perPage = 100;

     	// 페이지 번호 클릭시
     	 $('#'+gridId).on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	TabEqp.setGrid(eObj.page, eObj.pageinfo.perPage);
          });

     	//페이지 selectbox를 변경했을 시.
          $('#'+gridId).on('perPageChange', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	perPage = eObj.perPage;
          	TabEqp.setGrid(1, eObj.perPage);
          });

     	//조회
     	 $('#btnSearch').on('click', function(e) {
     		 TabEqp.setGrid(1,perPage);
          });

     	//엔터키로 조회
          $('#searchFormEqpTab').on('keydown', function(e){
      		if (e.which == 13  ){
      			TabEqp.setGrid(1,perPage);
        		}
      	 });

    	//관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 if(mgmtGrpNm == "SKT"){
    			 $("#sktMtso").show();
    			 $("#skbMtso").hide();
    			 $('#repIntgFcltsCdLabel').html("국사통시코드") ;
    		 }else{
    			 $("#sktMtso").hide();
    			 $("#skbMtso").show();
    			 $('#repIntgFcltsCdLabel').html("SWING국사코드") ;
    		 }

    		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
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

    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
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
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
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
    	 $('#'+gridId).on('click', '.bodycell', function(e){
    		$('#regInfArea').formReset();
    		regInf.resetComboBox();
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
			paramEqpId = {eqpId:dataObj.eqpId};
			$('#regInfEqpId').val(dataObj.eqpId);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpInstlMtsoInf', paramEqpId, 'GET', 'eqpInstlMtsoInf');
    	 });

 		$('#basicTabs').on("tabchange", function(e, index) {
 			switch (index) {
 			case 1 :
 	    		$('#regInfArea').formReset();
 	    		regInf.resetComboBox();
 				$a.navigate('/tango-transmission-web/configmgmt/upsdmgmt/DrawNrgstEqpTabSbeqp.do', paramData, '_blank');
 				break;
 			default :
 				break;
 			}
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

//    		var option_data = [{comCd: "", comCdNm: configMsgArray['all']}];
    		var option_data = [];

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
		   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
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
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#team').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#org').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
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

			setList(paramData); // 최종적으로 호출하는 API 불러온 후 실행. 본부/팀 정보를 가져오기 위해
		}

		if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCd').clear();
    		var option;
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#eqpRoleDivCd').setData({
                 data:option_data
    		});
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
                 data:option_data
    		});
    	}

    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.eqpLkupList);
    	}

    	if(flag == 'eqpInstlMtsoInf'){
    		regInf.eqpInstlMtsoInf(response);
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

    this.setGrid = function(page, rowPerPage) {
//    function setGrid(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchFormEqpTab").getData();

    	 $('#'+gridId).alopexGrid('showProgress');
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getNrgstEqpList', param, 'GET', 'search');
    }

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