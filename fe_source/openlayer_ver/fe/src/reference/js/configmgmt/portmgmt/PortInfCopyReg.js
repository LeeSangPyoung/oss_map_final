/**
 * PortInfCopyReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var copygridId = 'dataCopyGrid';
	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(param.mgmtGrpNm != ""){
    		paramData = param;
    	}
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();

    };

    function setRegDataSet(data) {

    	if(data.mgmtGrpNm == "SKB"){			//SKB 인경우 중복국사관리 기능 불가

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + data.eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
    	}

//    	$('#contentArea').setData(data);
    	$('#eqpMdlId').val(data.eqpMdlId);
    	$('#orglEqpMdlNm').val(data.eqpMdlNm);
    	$('#orglEqpId').val(data.eqpId);
    	$('#orglEqpNm').val(data.eqpNm);
    	/*$('#mgmtGrpNm').setData({
    		mgmtGrpNm:data.mgmtGrpNm
		});*/
    	/*if(data.orgId != "" && data.orgId != null){
    		$('#org').setData({
    			orgId:data.orgId
    		});
    	}
    	if(data.teamId != ""){
	    	$('#team').setData({
	    		teamId:data.teamId
			});
    	}
    	if(data.tmof != ""){
	    	$('#tmof').setData({
	    		tmof:data.tmof
			});
    	}*/

//    	$('#eqpMdlNm').val(data.eqpMdlNm);
//    	$('#eqpNm').val(data.eqpNm);
    }

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: false,
    		autoColumnIndex: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			align:'center',
				width: '50px',
				selectorColumn : true,
    		}, {/* 관리그룹              */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '120px'
			}, {/* 국사명		 */
				key : 'eqpInstlMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '100px'
			}, {/* 숨김데이터 */
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '100px'
			}, {/* 장비명       	 */
				key : 'eqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '180px'
			}, {/* 장비IP주소    	 */
				key : 'mainEqpIpAddr', align:'center',
				title : configMsgArray['equipmentInternetProtocolAddress'],
				width: '100px'
			}, {/* 포트수 		 */
				key : 'portCnt', align:'center',
				title : configMsgArray['portCount'],
				width: '60px'
			}, {/* 장비상태     	 */
				key : 'eqpStatNm', align:'center',
				title : configMsgArray['equipmentStatus'],
				width: '100px'
			}, {/* 장비TID    	 */
				key : 'eqpTid', align:'center',
				title : configMsgArray['equipmentTargetId'],
				width: '120px'
			},{/* 비고			 */
				key : 'eqpRmk', align:'center',
				title : configMsgArray['remark'],
				width: '100px'
			},{/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '130px'
			},{/* 등록자		 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'
			},{/* 변경일자		 */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '130px'
			},{/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        //그리드 생성
        $('#'+copygridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: false,
    		autoColumnIndex: true,
    		defaultColumnMapping:{
    			sorting: true
			},
    		columnMapping: [{
    			align:'center',
				width: '50px',
				selectorColumn : true,
    		}, {/* 관리그룹              */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '120px'
			}, {/* 국사명		 */
				key : 'eqpInstlMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '100px'
			}, {/* 숨김데이터 */
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '100px'
			}, {/* 장비명       	 */
				key : 'eqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '180px'
			}, {/* 장비IP주소    	 */
				key : 'mainEqpIpAddr', align:'center',
				title : configMsgArray['equipmentInternetProtocolAddress'],
				width: '100px'
			}, {/* 포트수 		 */
				key : 'portCnt', align:'center',
				title : configMsgArray['portCount'],
				width: '60px'
			}, {/* 장비상태     	 */
				key : 'eqpStatNm', align:'center',
				title : configMsgArray['equipmentStatus'],
				width: '100px'
			}, {/* 장비TID    	 */
				key : 'eqpTid', align:'center',
				title : configMsgArray['equipmentTargetId'],
				width: '120px'
			},{/* 비고			 */
				key : 'eqpRmk', align:'center',
				title : configMsgArray['remark'],
				width: '100px'
			},{/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '130px'
			},{/* 등록자		 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'
			},{/* 변경일자		 */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '130px'
			},{/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'
			}],
			message: {
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
		 var mgmtGrpCd;
		 if(paramData == '' || paramData == null) {
			 mgmtGrpCd = chrrOrgGrpCd;
		 }else{
			 mgmtGrpCd = paramData.mgmtGrpNm;
		 }

    	//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpCd, null, 'GET', 'fstOrg');
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

      //관리그룹 선택시 이벤트
	   	 $('#mgmtGrpNm').on('change', function(e) {

	   		 var mgmtGrpNm = $("#mgmtGrpNm").val();

//	   		if(mgmtGrpNm == "SKB"){			//SKB 인경우 선택 불가
////				callMsgBox('','I', "SKB 국사는 선택할 수 없습니다.", function(msgId, msgRst){});
//	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + paramData.eqpMdlId, null, 'GET', 'adamsEqpMdlYn');
////				$("#mgmtGrpNm").val('SKT');
////				return;
//			}

	   		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

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

    	//추가
    	 $('#btnAdd').on('click', function(e) {
    		var data          = AlopexGrid.trimData($('#'+gridId    ).alopexGrid('dataGet', {_state:{selected:true}}));
    		var data_editlist = AlopexGrid.trimData($('#'+copygridId).alopexGrid('dataGet', {_state:{added:true}}));

    		for(var i=0; i<data.length; i++){
    			if (data[i].portCnt != "0"){
    				callMsgBox('','W', "포트수가 0건인 데이터를 선택하십시오. (" + data[i].eqpNm+")" , function(msgId, msgRst){});
    				return;
    			}
    			if (data_editlist.length > 0) {
	    			for(var j=0; j<data_editlist.length; j++){
	    				if (data[i].eqpId == data_editlist[j].eqpId){
	    					callMsgBox('','W', configMsgArray['alreadySelect'] + " (" + data[i].eqpNm+")" , function(msgId, msgRst){});
	    					return;
	    				}
	    			}
    			}
    		}
			$('#'+copygridId).alopexGrid('dataAdd', data);
        	$('#'+gridId).alopexGrid("rowSelect", {_state : {selected : true}}, false);
         });

    	//선택삭제
    	$('#btnSelectDel').on('click', function(e) {
        	$('#'+gridId).alopexGrid("rowSelect", {_state : {selected : true}}, false);
         });

    	//선택삭제
    	 $('#btnAddSelectDel').on('click', function(e) {
         	$('#'+copygridId).alopexGrid("rowSelect", {_state : {selected : true}}, false);
         });

    	//삭제
    	$('#btnDel').on('click', function(e) {
    		var data = AlopexGrid.trimData($('#'+copygridId).alopexGrid('dataGet', {_state:{selected:true}}));

    		if(data.length !=0){
    			$('#'+copygridId).alopexGrid('dataDelete',data);
    		}else{
				//선택된 데이타가 없습니다.
				callMsgBox('','W', configMsgArray['selectNoData'] , function(msgId, msgRst){});
			}
        });

    	//취소
    	$('#btnCncl').on('click', function(e) {
    		 $a.close();
    	});

    	//저장
    	$('#btnSave').on('click', function(e) {
    		 var data = $('#'+copygridId).alopexGrid('dataGet');

    		 if(data.length == 0){
 				//선택된 데이터가 없습니다.
 				callMsgBox('','W', configMsgArray['selectNoData'] , function(msgId, msgRst){});
 				return;
 			}

    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
   		       //저장한다고 하였을 경우
   		        if (msgRst == 'Y') {
   		        	portCopyReg();
   		        }
   		      });
         });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'portCopyReg') {

    		if(response.Result == "Success"){
	    		//저장을 완료 하였습니다.
	    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    			if (msgRst == 'Y') {
						 $a.close();
		    		}
		    	 });
    		}else if(response.Result == "Dup"){
    			callMsgBox('','I', configMsgArray['saveFail']+" (중복된 포트명이 있습니다.)" , function(msgId, msgRst){});
    		}else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    	}

    	//관리그룹
    	if(flag == 'mgmtGrpNm'){

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

    		$('#mgmtGrpNm').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == mgmtGrpCd) {
						selectId = resObj.comCdNm;
						break;
					}
				}
				$('#mgmtGrpNm').setData({
					data:response ,
					mgmtGrpNm:selectId
				});
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
	   		}
	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + sUprOrgId, null, 'GET', 'fstTeam');
    	}

    	if(flag == 'org'){
    		$('#org').clear();
    		$('#team').clear();
    		$('#tmof').clear();
    		var option_data =  [{orgId: "", orgNm: "전체",uprOrgId: ""}];

    		$('#team').setData({
                 data:option_data
    		});

    		$('#tmof').setData({
                data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: "전체"}]
    		});

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
    	}

    	if(flag == 'team'){
    		$('#team').clear();
    		var option_data =  [{orgId: "", orgNm: "전체",uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#team').setData({
                 data:option_data
    		});

    		$('#tmof').setData({
                data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: "전체"}]
    		});
    	}

		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: "전체",mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
		}

    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.eqpMgmtList);
    	}

    	if(flag == 'adamsEqpMdlYn'){
    		if (response.length > 0 ) {			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
	    			callMsgBox('','I', "SKB 장비중 ADAMS 연동 모델은 선택 할 수 없습니다.", function(msgId, msgRst){
	       		 		$a.close();
	       		 	});
    		}
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

    	if(flag == 'portCopyReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}

    }

    function portCopyReg() {
    	var orglEqpId = $('#orglEqpId').val();

    	var param = $('#'+copygridId).alopexGrid('dataGet');

    	var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		for(var i=0; i<param.length; i++){
			 param[i].orglEqpId = orglEqpId;
			 param[i].frstRegUserId = userId;
			 param[i].lastChgUserId = userId;
		}
		httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/insertPortCopy', param, 'POST', 'portCopyReg');
    }

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['eqpId'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	$('#'+copygridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();

     	 param.fdfChk = "N";
     	 param.forPortCopy = "Y";
     	 param.adamsMdlYn = "N";

		 $('#'+gridId).alopexGrid('showProgress');
		 //httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portInfCopy', param, 'GET', 'search');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'search');
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