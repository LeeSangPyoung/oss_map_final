/**
 * DupMtsoMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;

	var mtsoUseChk_data =  [];


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(param.regYn == "Y"){
    		paramData = param;
    	}
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();

    };

    function setRegDataSet(data) {
    	$('#repMgmtGrpNm').val(data.mgmtGrpNm);
    	$('#repOrgNm').val(data.orgNm);
    	$('#repOrgId').val(data.orgId);
    	$('#repTeamId').val(data.teamId);
        $('#repTmofNm').val(data.tmofNm);
        $('#repTmof').val(data.tmof);
        $('#repMtsoId').val(data.mtsoId);
        $('#repMtsoNm').val(data.mtsoNm);
        $('#repMtsoTyp').val(data.mtsoTyp);
        $('#repMtsoTypCd').val(data.mtsoTypCd);
        $('#repMtsoStat').val(data.mtsoStat);
        $('#repMtsoStatCd').val(data.mtsoStatCd);
        $('#repRepIntgFcltsCd').val(data.repIntgFcltsCd);
        $('#repUkeyMtsoId').val(data.ukeyMtsoId);
    	$('#contentArea').setData(data);
    	$('#mtsoId').val('');
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
    		rowSingleSelect: false,
    		rowClickSelect: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		height: 300,
    		columnMapping: [{
				align:'center',
//				title :  configMsgArray['select'],
				width: '50px',
				selectorColumn : true
				//rowSingleSelect: false,
    		}, {/* 관리그룹              */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px'
			},{/* 본부			 */
				key : 'hdofc', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			},{/* 대표통합시설코드    */
				key : 'repIntgFcltsCd', align:'center',
				title : configMsgArray['representationIntegrationFacilitiesCode'],
				width: '120px'
			}, {/* 국사ID		 */
				key : 'mtsoId', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeIdentification'],
				width: '120px'
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '200px'
			},{/* 국사유형코드--숨김데이터	 */
				key : 'mtsoTypCd', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeTypeCode'],
				width: '70px'
			},{/* 국사유형		 */
				key : 'mtsoTypNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px'
			}, {/* 국사상태코드--숨김데이터	 */
				key : 'mtsoStatCd', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeStatusCode'],
				width: '70px'
			}, {/* 국사상태		 */
				key : 'mtsoStatNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'],
				width: '100px'
			},{/* 국사지도입력여부    */
				key : 'mtsoMapInsYn', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeMapInsertYesOrNo'],
				width: '120px'
			},{/* 건물코드		 */
				key : 'bldCd', align:'center',
				title : configMsgArray['buildingCode'],
				width: '120px'
			}, {/* 주소			 */
				key : 'addr', align:'center',
				title :  configMsgArray['address'],
				width: '250px'
			}, {/* 건물명		 */
				key : 'bldNm', align:'center',
				title : '건물명',
				width: '130px'
			},{/* UKEY국사코드		 */
				key : 'ukeyMtsoId', align:'center',
				title : 'SWING국사코드',
				width: '120px'
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

		 /*if(mgmtGrpCd == "SKT"){
			 $("#ukeyMtso1").hide();
			 $("#ukeyMtso2").hide();
		 }else{
			 $("#ukeyMtso1").show();
			 $("#ukeyMtso2").show();
		 }*/

		 //관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpCd, null, 'GET', 'fstOrg');
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpCd, null, 'GET', 'fstTeam');
//	   	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpCd, null, 'GET', 'tmof');

    	//하드코딩 되어져있는 국사명 변경
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00293', null, 'GET', 'mtsoTyp');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStat');
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

    		 /*if(mgmtGrpNm == "SKT"){
    			 $("#ukeyMtso1").hide();
    			 $("#ukeyMtso2").hide();
    		 }else{
    			 $("#ukeyMtso1").show();
    			 $("#ukeyMtso2").show();
    		 }*/

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    		 /*httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStat');

    		 //국사명 초기화
    		 $('#mtsoNm').val("");
    		 //주소 초기화
    		 $('#addr').val("");*/

    		 var option_data =  null;
  			if($('#mgmtGrpNm').val() == "SKT"){
  				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
//  								{comCd: "1",comCdNm: "전송실"},
//  								{comCd: "2",comCdNm: "중심국사"},
  								{comCd: "3",comCdNm: "기지국사"},
  								{comCd: "4",comCdNm: "국소"}
  								];
  			}else{
  				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
//  								{comCd: "1",comCdNm: "정보센터"},
  								{comCd: "2",comCdNm: "국사"},
  								{comCd: "4",comCdNm: "국소"}
  								];
  			}
			$('#mtsoTypCd').setData({
	             data:option_data
			});

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


    	//국사 통합
    	 $('#btnMtsoIntg').on('click', function(e) {
    		 var data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});

    		 if($('#repMtsoId').val() == ""){
    			//필수 선택 항목입니다.[ 대표국사 ]
 		    	 callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['representationMobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
    			 return;
    		 }else if(data.length == 0){
    			//필수 선택 항목입니다.[ 대상국사 ]
 		    	 callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['objectMobileTelephoneSwitchingOffice']), function(msgId, msgRst){});
    			 return;
    		 }
    		 for(var i=0; i<data.length; i++){
         		 if ($('#repMgmtGrpNm').val() != data[i].mgmtGrpNm) {
          			callMsgBox('','I', "대표국사와 관리그룹이 다른 대상국사는 통합할 수 없습니다.", function(msgId, msgRst){});
      	     		return;
      	     	 }
    		 }
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/selectGisChk', data, 'POST', 'selectGisChk');
    		 // 20210315 상면체크 무시(상면 시설코드 무조건 변경하기로 처리)
    		 //httpRequest('tango-transmission-biz/transmisson/configmgmt/common/selectFlorDrawChk', data, 'POST', 'selectFlorDrawChk');
         });

    	//국사 조회
    	 $('#btnRepMtsoSearch').on('click', function(e) {
    		 var param =  $("#searchForm").getData();
    		 if($('#repMtsoStatCd').val() == "" || $('#repMtsoStatCd').val() == null){
    			 param.regYn = "N";
    		 }else{
    			 param.regYn = "Y";
    		 }
    		 param.mgmtGrpNm = $('#repMgmtGrpNm').val();
    		 param.orgId = $("#repOrgId").val();
    		 param.teamId = $("#repTeamId").val();
    		 param.tmof = $("#repTmof").val();
    		 param.mtsoTypCd = $("#repMtsoTypCd").val();
    		 param.mtsoStatCd = $("#repMtsoStatCd").val();
    		 $a.popup({
 	          	popid: 'MtsoLkup',
 	          	title: configMsgArray['representationMobileTelephoneSwitchingOfficeLkup'],
 	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
 	            data: param,
 	            windowpopup: true,
 	            modal: true,
                 movable:true,
 	            width : 950,
 	           	height : window.innerHeight * 0.8,
 	           	callback : function(data) { // 팝업창을 닫을 때 실행
 	                $('#repOrgNm').val(data.orgNm);
 	                $('#repTmofNm').val(data.tmofNm);
 	                $('#repMtsoId').val(data.mtsoId);
 	                $('#repMtsoNm').val(data.mtsoNm);
 	                $('#repMtsoTyp').val(data.mtsoTyp);
 	                $('#repMtsoStat').val(data.mtsoStat);
 	                $('#repRepIntgFcltsCd').val(data.repIntgFcltsCd);
 	                $('#repUkeyMtsoId').val(data.ukeyMtsoId);
 	                $('#repMgmtGrpNm').val(data.mgmtGrpNm);
 	           	}
 	      });
         });

    	//선택삭제
    	 $('#btnSelectDel').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
         	$('#'+gridId).alopexGrid("rowSelect", {_state : {selected : true}}, false);
         });

    	//목록
    	 $('#btnPrev').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 //$a.navigate($('#ctx').val()+'/configmgmt/common/MtsoList.do');
    		 $a.close(dataObj);
         });


	};

	function dupMtsoReg(data) {

		$('#searchForm').progress();

		var repMtsoId = $('#repMtsoId').val();
		var repRepIntgFcltsCd = $('#repRepIntgFcltsCd').val();
		var repUkeyMtsoId = $('#repUkeyMtsoId').val();

		var repMtsoNm = $('#repMtsoNm').val();

		var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		for(var i=0; i<data.length; i++){
//			$.extend(data[i],{"repMtsoId":repMtsoId});
			data[i].frstRegUserId = userId;
			data[i].lastChgUserId = userId;
			data[i].repMtsoId = repMtsoId;
			data[i].repRepIntgFcltsCd = repRepIntgFcltsCd;
			data[i].repUkeyMtsoId = repUkeyMtsoId;
			data[i].repMtsoNm = repMtsoNm;
		}

			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateDupMtsoMgmt', data, 'POST', 'DupMtsoReg');

   }

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'selectFlorDrawChk') {
    		if(response.mtsoId == null || response.mtsoId == ""){
    			var data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});
    			for(var i=0; i<data.length; i++){
    				data[i].repRepIntgFcltsCd = $('#repRepIntgFcltsCd').val();
    			}
        		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/selectGisChk', data, 'POST', 'selectGisChk');
    		}
    		else{
					callMsgBox('','I', "대상국사중 "+response.mtsoNm+"["+response.mtsoId+"] 국사에 상면이 등록되어 있습니다.<br> 도면/층 삭제 후 통합할 수 있습니다." , function(msgId, msgRst){});
					return;
			}
    	}
    	if(flag == 'selectGisChk') {
    		if(response.mtsoId == null || response.mtsoId == ""){
    			var data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});
       		 	var ukeyMtsoCnt = 0;
          		 if($('#repUkeyMtsoId').val() != "" && $('#repUkeyMtsoId').val() != null){
           			 ukeyMtsoCnt++;
           		 }

           		 for(var i=0; i<data.length; i++){
             			if (data[i].ukeyMtsoId != "" && data[i].ukeyMtsoId != null){
             				ukeyMtsoCnt++;
             			}
             		 }

             		 if (ukeyMtsoCnt > 1) {
        				callMsgBox('','W', "대표국사, 대상국사 포함 SWING국사코드가 한개 이상인 경우 통합할 수 없습니다." , function(msgId, msgRst){});
        				return;
         			 }
                	//tango transmission biz 모듈을 호출하여야한다.
           		callMsgBox('','C',  configMsgArray['saveConfirm'], function(msgId, msgRst){
           		     //저장한다고 하였을 경우
           		     if (msgRst == 'Y') {
           		       	dupMtsoReg(data);
           		     }
           	    });
    		}
    		else{
    			//돌아왔을때 받은값에 따라 GIS UPSD 모듈에 따른 통합불가능 여부 확인
 				callMsgBox('','I', "대상 국사중 국사명 "+response.mtsoNm+" ["+response.mtsoId+"]가 GIS에서 사용중이여서 통합 하실 수 없습니다.", function(msgId, msgRst){});
 	     		return;
    		}
    	}

    	if(flag == 'DupMtsoReg') {
    		//저장을 완료 하였습니다.
    		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){});
    		//$a.navigate($('#ctx').val()+'/configmgmt/common/MtsoList.do');

//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/updatemtsoinfapi', data, 'GET', 'cflineUpdate');

    		$('#searchForm').progress().remove();

    		var param = null;

    		param = response.resultList;
    		httpRequest('tango-transmission-biz/inventory/eif/intif/send/tangoTIO008Send', param, 'POST', '');

    		var pageNo = $("#pageNo").val();
    		var rowPerPage = $("#rowPerPage").val();

    		setGrid(pageNo,rowPerPage);
    	}

    	if(flag == 'cflineUpdate') {

    	}

    	//관리그룹
    	/*if(flag == 'mgmtGrpNm'){

    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }

    		$('#mgmtGrpNm').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택"}];

    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCdNm;
						break;
					}
				}
				$('#mgmtGrpNm').setData({
					data:response ,
					mgmtGrpNm:selectId
				});
			}
    	}*/

    	if(flag == 'mgmtGrpNm'){

    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }

    		$('#mgmtGrpNm').clear();

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
	    			$('#mgmtGrpNm').setData({
	    				data:response ,
	    				mgmtGrpNm:selectId
	    			});
	    		}
	    		else {
	    			$('#mgmtGrpNm').setData({
	    	             data:response,
	    	             mgmtGrpNm:paramData.mgmtGrpNm
	    			});
	    		}
			}

			var option_data =  null;
 			if($('#mgmtGrpNm').val() == "SKT"){
 				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
// 								{comCd: "1",comCdNm: "전송실"},
// 								{comCd: "2",comCdNm: "중심국사"},
 								{comCd: "3",comCdNm: "기지국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}else{
 				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
// 								{comCd: "1",comCdNm: "정보센터"},
 								{comCd: "2",comCdNm: "국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}

 			if(paramData == '' || paramData == null) {
    			$('#mtsoTypCd').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#mtsoTypCd').setData({
    	             data:option_data,
    	             mtsoTypCd:paramData.mtsoTypCd
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
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
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
		}

		//국사유형 콤보 박스
		if(flag == 'mtsoTyp'){

			$('#mtsoTypCd').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);

			}

			$('#mtsoTypCd').setData({
	             data:option_data

			});
		}

		//국사상태 콤보 박스
		if(flag == 'mtsoStat'){
			$('#mtsoStatCd').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);

			}

			$('#mtsoStatCd').setData({
	             data:option_data
			});
		}

    	if(flag == 'dupMtsoSearch'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId,response, response.dupMstoMgmtList);
    	}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'dupMtsoSearch'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'DupMtsoReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    // 입력한 Input 데이터가 있는지 체크
    function dataInputCheck(inputdata) {

    	for (var key in inputdata) {
    		if(inputdata[key] != "" || inputdata[key] != null) {
    			return true;
    		}
    	}

    	return false;

    }

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['mtsoTypCd', 'mtsoStatCd'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setGrid(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();

    	if (param.repMtsoId == "") {
     		//필수 선택 항목입니다.[ 대표국사 ]
	    	callMsgBox('','I', '먼저 대표국사를 선택하십시오.', function(msgId, msgRst){});
     		return;
     	 }

 		$('#'+gridId).alopexGrid('showProgress');

 		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/dupMtsoMgmts', param, 'GET', 'dupMtsoSearch');
    }
    /*
    var httpRequest = function(Url, Param, Method, Flag ) {
    	alert(JSON.stringify(Param));
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
    }
    */
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    function setSPGrid(GridID,Option,Data) {

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
});