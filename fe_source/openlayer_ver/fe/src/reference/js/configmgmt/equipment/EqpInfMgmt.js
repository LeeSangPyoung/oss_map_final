/**
 * EqpMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var fileOnDemendName = "";
	var eqpRoleDivCdList;
	var bpIdList;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();

    	//장비교체 버튼 권한 설정
    	var param =  $("#searchForm").getData();
    	var adtnAttrVal = param.adtnAttrVal;

    	if(adtnAttrVal.indexOf('CM_EQP_CHG_APRV') > 0){
    		$('#btnEqpChg').show();
    	}else{
    		$('#btnEqpChg').hide();
    	}

    	setSelectCode();
        setEventListener();

        if(param.fromOther == "Y"){
        	EqpReg();
        }
        $('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
        $('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');

        $('#sdTooltip').setOptions('showdisabled', true);
    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	rowSelectOption: {
    			allowSingleUnselect: false,
    			disableSelectByKey: true
    		},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
    		}, {/* 관리그룹              */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '130px'
			}, {/* 숨김데이터 */
				key : 'eqpRoleDivCd', align:'center',
				title : '장비타입코드',
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			}, {/* 숨김데이터 */
				key : 'bpId', align:'center',
				title : '제조사ID',
				width: '100px'
			}, {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {/* 숨김데이터 */
				key : 'eqpMdlId', align:'center',
				title : '모델ID',
				width: '100px'
			}, {/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '120px'
			}, {/* 국사명		 */
				key : 'eqpInstlMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '180px'
			}, {/* 국사ID */
				key : 'eqpInstlMtsoId', align:'center',
				title : '국사ID',
				width: '120px'
			}, {/* 장비명       	 */
				key : 'eqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '180px'
			},{/* EMS 장비명    */ //<!-- 라종식 -->
				key : 'emsEqpNm', align:'center',
				title : 'EMS 장비명',
				width: '180px'
			}, {/* 장비ID */
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '120px'
			}, {/* 원장비명       	 */
				key : 'oriEqpNm', align:'center',
				title : '원장비',
				width: '180px'
			}, {/* 원전송실 		 */
				key : 'oriTmofNm', align:'center',
				title : '원전송실',
				width: '130px'
			}, {/* 원국사명		 */
				key : 'oriMtsoNm', align:'center',
				title : '원국사',
				width: '180px'
			},{/* 바코드 		 */
				key : 'barNo', align:'center',
				title : configMsgArray['barcode'],
				width: '100px'
			},{/* 상면랙번호    	 */
				key : 'upsdRackNo', align:'center',
				title : "상면랙번호",
				width: '100px'
			},{/* 상면쉘프번호    	 */
				key : 'upsdShlfNo', align:'center',
				title : "상면쉘프번호",
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
			}, {/* 숨김데이터 */
				key : 'eqpStatCd', align:'center',
				title : '상태코드',
				width: '100px'
			}, {/* 장비상태     	 */
				key : 'eqpStatNm', align:'center',
				title : configMsgArray['equipmentStatus'],
				width: '100px'
			}, {/* 장비용도     	 */
				key : 'tnEqpUsgNm', align:'center',
				title : '장비용도',
				width: '100px'
			}, { /*소유사업자*/
				key : 'ownBizrNm', align:'center',
				title : '소유사업자',
				width: '100px'
			}, {/* 장비TID    	 */
				key : 'eqpTid', align:'center',
				title : configMsgArray['equipmentTargetId'],
				width: '120px'
			}, {/* 포트수 		 */
				key : 'portCnt', align:'center',
				title : configMsgArray['portCount'],
				width: '100px'
			},{/* 숨김데이터 */
				key : 'jrdtTeamOrgId', align:'center',
				title : '관리팀ID',
				width: '100px'
			},{/* 관리팀		 */
				key : 'jrdtTeamOrgNm', align:'center',
				title : configMsgArray['managementTeam'],
				width: '100px'
			},{/* 숨김데이터 */
				key : 'opTeamOrgId', align:'center',
				title : '운용팀ID',
				width: '100px'
			},{/* 운용팀 */
				key : 'opTeamOrgNm', align:'center',
				title : '운용팀',
				width: '100px'
			},{/* UKEY장비관리번호 */
				key : 'ukeyEqpMgmtNo', align:'center',
				title : 'SWING장비관리번호',
				width: '120px'
			},{//숨김 데이터
				key : 'eqpHostNm', align:'center',
				title : '호스트명',
				width: '120px'
			},{/* 장애관리여부     	 */
				key : 'dablMgmtYn', align:'center',
				title : configMsgArray['disabilityManagementYesOrNo'],
				width: '100px'
			},{/* 공사코드		 */
				key : 'cstrMgmtNo', align:'center',
				title : configMsgArray['constructionCode'],
				width: '100px'
			},{/* 작업지시번호   	 */
				key : 'wkrtNo', align:'center',
				title : configMsgArray['workDirectionNumber'],
				width: '100px'
			},{/* 장비펌웨어버전값 	 */
				key : 'eqpFwVerVal', align:'center',
				title : configMsgArray['equipmentFirmwareVersionValue'],
				width: '100px'
			},{/* 소프트웨어버전값	 */
				key : 'swVerVal', align:'center',
				title : configMsgArray['softwareVersionValue'],
				width: '100px'
			},{/* 장비시리얼번호값	 */
				key : 'eqpSerNoVal', align:'center',
				title : '장비시리얼번호값',
				width: '100px'
			},{/* SKT2장비여부     	 */
				key : 'skt2EqpYn', align:'center',
				title : 'SKT2장비여부',
				width: '100px'
			},{/* 미등록장비여부     	 */
				key : 'mgmtInfNrgstYn', align:'center',
				title : '미등록장비여부',
				width: '100px'
			}, {
				key : 'dumyEqpYn', align:'center',
				title : 'DUMMY여부',
				width: '100px'
			},{/* 비고			 */
				key : 'eqpRmk', align:'center',
				title : configMsgArray['remark'],
				width: '100px'
			},{/* 장비한글명 		 */ // 라종식
				key : 'eqpHanNm', align:'center',
				title : '장비한글명',//configMsgArray[''],
				width: '180px'
			},{/* 사이트키    */
				key : 'siteCd', align:'center',
				title : '사이트키',
				width: '100px'
			},{/* 사이트명    */
				key : 'siteNm', align:'center',
				title : configMsgArray['siteName'],
				width: '100px'
			},{/* 상면등록여부    */
				key: 'rackInAttrYn', align:'center',
				title : '상면등록여부',
				width: '120px',
				render : function(value, data, render, mapping){
					if(data.rackInAttrYn == 'Y') {
						return '등록';
					}
					else{
						return '미등록';
					}
				}
			}, {
				align : 'center',
				title : '도면',
				width : '70px',
				key: 'rackId',
				render : function(value, data, render, mapping){
					if(data.rackId != '' && data.rackId != null) {
						return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnUpsdLnk" type="button"></button></div>';
					}
					else{
						return false;
					}
				}
			},{//숨김 데이터
				key : 'trmsEqpYn', align:'center',
				title : '전송장비여부',
				width: '120px'
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

        gridHide();

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	//장비교체버튼 비활성화
    	 $('#btnEqpChg').setEnabled(false);

    	 var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		 if(chrrOrgGrpCd == "SKT"){
			 $("#sktMtso").show();
			 $("#skbMtso").hide();
//			 $('#'+gridId).alopexGrid("showCol", 'repIntgFcltsCd');
//			 $('#'+gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
		 }else{
			 $("#sktMtso").hide();
			 $("#skbMtso").show();
			 $('#intgFcltsCd').setEnabled(false);
//			 $('#'+gridId).alopexGrid("hideCol", 'repIntgFcltsCd', 'conceal');
//			 $('#'+gridId).alopexGrid("showCol", 'ukeyMtsoId');
		 }

		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

		//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');

    	//장비 역할 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCd');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
    	//장비 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCd');
    	//장비모델 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
    	//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
		//장비 용도 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02193', null,'GET', 'tnEqpUsgCd');
		//소유사업자
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00405', null,'GET', 'ownBizrCd');
		//운용 팀 조회 // 라종식
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOpTeamGrp', null, 'GET', 'opTeamOrgId');

    }


    function setEventListener() {

         var perPage = 100;

     	// 페이지 번호 클릭시
     	 $('#'+gridId).on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	main.setGrid(eObj.page, eObj.pageinfo.perPage);
          });

     	//페이지 selectbox를 변경했을 시.
          $('#'+gridId).on('perPageChange', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	perPage = eObj.perPage;
          	main.setGrid(1, eObj.perPage);
          });

     	//조회
     	 $('#btnSearch').on('click', function(e) {
     		 main.setGrid(1,perPage);
          });

     	//엔터키로 조회
          $('#searchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			main.setGrid(1,perPage);
        		}
      	 });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 if(mgmtGrpNm == "SKT"){
    			 $("#sktMtso").show();
    			 $("#skbMtso").hide();
    			 $('#intgFcltsCd').setEnabled(true);
//    			 $("#btnReg").show();
    			 $("#btnMultiReg").show();

//    			 $('#'+gridId).alopexGrid("showCol", 'repIntgFcltsCd');
//    			 $('#'+gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
    		 }else{
    			 $("#sktMtso").hide();
    			 $("#skbMtso").show();
    			 $('#intgFcltsCd').setEnabled(false);
//    			 $("#btnReg").hide();
    			 $("#btnMultiReg").hide();

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
    	 $('#orgId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();

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
    	 $('#teamId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#teamId").getData();

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

    	 $('#eqpRoleDivCdList').multiselect({
    		 open: function(e){
    			 eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
    		 },
    		 beforeclose: function(e){
    			 var codeID =  $("#eqpRoleDivCdList").getData();
         		 var param = "mgmtGrpNm="+ $("#mgmtGrpNm").getTexts()[0];
         		 var cnt = 0;

         		 if(eqpRoleDivCdList+"" != codeID.eqpRoleDivCdList+""){
	         		 if(codeID.eqpRoleDivCdList == ''){

	         			$('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
	    				$('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');

	         		 }else {
	         			for(var i=0; codeID.eqpRoleDivCdList.length > i; i++){
	         				param += "&comCdMlt1=" + codeID.eqpRoleDivCdList[i];
	         				if(codeID.eqpRoleDivCdList[i] == '11' || codeID.eqpRoleDivCdList[i] == '177' || codeID.eqpRoleDivCdList[i] == '178' || codeID.eqpRoleDivCdList[i] == '182'){
	         					cnt++;
		           			}
	         			}

	         			 if(cnt > 0){
	        				 $('#'+gridId).alopexGrid("showCol", 'upsdRackNo');
	        				 $('#'+gridId).alopexGrid("showCol", 'upsdShlfNo');
	        			 }else{
	        				 $('#'+gridId).alopexGrid("hideCol", 'upsdRackNo', 'conceal');
	        				 $('#'+gridId).alopexGrid("hideCol", 'upsdShlfNo', 'conceal');
	        			 }
	         		 }

	         		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
	         		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
         		 }
    		 }
    	 });

     	//제조사 선택시 이벤트
    	 $('#bpIdList').multiselect({
    		 open: function(e){
    			 bpIdList = $("#bpIdList").getData().bpIdList;
    		 },
    		 beforeclose: function(e){
	          	//tango transmission biz 모듈을 호출하여야한다.
	     		 var bpId =  $("#bpIdList").getData();
	     		 var eqpRoleDivCd =  $("#eqpRoleDivCdList").getData();
	     		 var param = "mgmtGrpNm="+ $("#mgmtGrpNm").getTexts()[0];
	     		if(bpIdList+"" != bpId.bpIdList+""){
		     	 	 if(bpId.bpIdList == '' && eqpRoleDivCd.eqpRoleDivCdList == ''){

		     	 	 }else if(bpId.bpIdList == '' && eqpRoleDivCd.eqpRoleDivCdList != ''){
		     	 		for(var i=0; eqpRoleDivCd.eqpRoleDivCdList.length > i; i++){
	         				param += "&comCdMlt1=" + eqpRoleDivCd.eqpRoleDivCdList[i];
	         			}
		     		 }else if(bpId.bpIdList != '' && eqpRoleDivCd.eqpRoleDivCdList == ''){
		     			for(var i=0; bpId.bpIdList.length > i; i++){
	         				param += "&comCdMlt2=" + bpId.bpIdList[i];
	         			}
		     		 }else {
		     			for(var i=0; eqpRoleDivCd.eqpRoleDivCdList.length > i; i++){
	         				param += "&comCdMlt1=" + eqpRoleDivCd.eqpRoleDivCdList[i];
	         			}
		     			for(var i=0; bpId.bpIdList.length > i; i++){
	         				param += "&comCdMlt2=" + bpId.bpIdList[i];
	         			}
		     		 }

		     	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
	     		}
    		 }
    	 });

    	//등록
    	 $('#btnReg').on('click', function(e) {
    		 EqpReg();
         });

    	 $('#btnTest').on('click', function(e) {

//    		 var param = {"mtsoMapInsYn": "Y", "mtsoId": "MO01007171834", "mtsoLatVal" : "37.5406438449993" , "lastChgUserId":"SYSTEM"};
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/updateMtsoMapInsYn', param,'POST', '');

//    		 var param = {"eqpId": "DV10174719181", "upsdRackNo": "2", "upsdShlfNo" : "" , "lastChgUserId":"SYSTEM_TEST"};
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/updateEqpAdtnUpsdInf', param,'POST', '');

    		 var param = {"eqpId": "DV10214371898", "cstrCd": "T12090703980001", "lastChgUserId":"SYSTEM_TEST"};
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/updateEqpCstrCdInf', param,'POST', '')

//    		 var param = {"eqpId": "DV10214455719", "lastChgUserId":"SYSTEM_TEST"};
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/deleteEqpInf', param,'POST', 'test')

    		 /*$a.popup({
    	          	popid: 'test',
    	          	title: 'test',
    	            url: '/tango-transmission-web/configmgmt/common/MtsoIntgLkup.do',
    	            data: {intgFcltsCd : "200823030"},
    	            modal: true,
                  movable:true,
                  width : 1200,
   	           	height : window.innerHeight * 0.9,
 	      	        callback : function(data) { // 팝업창을 닫을 때 실행
// 	      	        	alert(JSON.stringify(data));
 	   	           	}
    	      });*/
         });


    	 $('#btnMultiReg').on('click', function(e) {
     		$a.popup({
     			popid: 'EqpMultiReg',
    	          	title: '장비 멀티 등록',
    	            url: '/tango-transmission-web/configmgmt/equipment/EqpMutiRegPop.do',
     		      windowpopup : true,
     		      modal: true,
     		      movable:true,
     		      width : window.innerWidth * 0.9,
     		      height : 800,
     		      callback : function(data) {
     		    	  //g5EndDsn.setGrid(1,100000);
     		      }
     		});
     	});

    	//FDF간편등록
      	$('#btnFdfRegPop').on('click', function(e) {
   		 $a.popup({
   	          	popid: 'EqpFdfReg',
   	          	title: configMsgArray['fiberDistributionFrameEasyReg'],
   	            url: '/tango-transmission-web/configmgmt/equipment/EqpFdfReg.do',
   	            data: "",
   	            modal: true,
                movable:true,
                width : 550,
  	           	height : window.innerHeight * 0.55,
	      	        callback : function(data) { // 팝업창을 닫을 때 실행
	      	        	$a.close(data);//장비 ID
	   	           	}
   	      });
         });

      	//IP장비등록
      	$('#btnIpEqpRegPop').on('click', function(e) {
      		callMsgBox('','I', 'IP장비정보 반영은 운용전환 후 최대 6시간 소요될 수 있습니다.' , function(msgId, msgRst){
				if (msgRst == 'Y') {
					$a.navigate('/tango-inventory-im-web/inventory/ip/eqpm/neweqpm/IpEqpNewReqInfo.do');
				}
			});
         });

      	//미등록장비
      	$('#btnNlnkEqp').on('click', function(e) {
      		var param =  $("#searchForm").getData();

      		$a.popup({
      			popid: 'NlnkEqpLkup',
      			title: '미등록장비',
      			url: '/tango-transmission-web/configmgmt/equipment/NlnkEqpLkup.do',
      			data: param,
      			windowpopup : true,
      			modal: true,
      			movable:true,
      			width : 1200,
      			height : 600
      		});
      	});

      //전송장비연동정보
      	$('#btnEqpLnkgInf').on('click', function(e) {
      		var param =  $("#searchForm").getData();

      		$a.popup({
      			popid: 'TrmsEqpLnkgInf',
      			title: '전송장비연동정보',
      			url: '/tango-transmission-web/configmgmt/equipment/TrmsEqpLnkgInf.do',
      			data: param,
      			windowpopup : true,
      			modal: true,
      			movable:true,
      			width : 1550,
      			height : 810
      		});
      	});

      	//장비교체 버튼
      	$('#btnEqpChg').on('click', function(e) {
      		var data = null;
      		data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});

      		var userId;
	   		if($("#userId").val() == ""){
	   			userId = "SYSTEM";
	   		}else{
	   			userId = $("#userId").val();
	   		}

	   		data[0].frstRegUserId = userId;
	   		data[0].lastChgUserId = userId;

      		callMsgBox('','C', "["+data[0].eqpNm + "]를 [" + data[0].oriEqpNm + "]으로 교체하시겠습니까?", function(msgId, msgRst){
				//저장한다고 하였을 경우
				if (msgRst == 'Y') {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/updateEqpByChange', data[0], 'POST', 'EqpChange');
				}
			});
      	});

      	//토폴로지
      	$('#btnTopology').on('click', function(e) {
      		var data = null;
      		data = $('#'+gridId).alopexGrid("dataGet", {_state : {selected : true}});
      		if(data == "" || data == null){
      			//선택된 데이터가 없습니다.
      			callMsgBox('','W', configMsgArray['selectNoData'], function(msgId, msgRst){});
      			return;
      		}else{
      			// IBC, IBR, IBRR, LTE L3, LTE L2, LTE DU, LTE RU, RINGMUX
      			if(data[0].eqpRoleDivCd == "01" || data[0].eqpRoleDivCd == "02" || data[0].eqpRoleDivCd == "03" || data[0].eqpRoleDivCd == "04" || data[0].eqpRoleDivCd == "05" || data[0].eqpRoleDivCd == "06" || data[0].eqpRoleDivCd == "18" || data[0].eqpRoleDivCd == "23" || data[0].eqpRoleDivCd == "25"){
      				window.open('/tango-transmission-web/configmgmt/tnbdgm/TnBdgm.do?eqpId='+data[0].eqpId);
      			}else{
      				callMsgBox('','W', "제공하는 장비타입이 아닙니다.", function(msgId, msgRst){});
      				return;
      			}
//    			$a.navigate($('#ctx').val()+'/configmgmt/tnbdgm/TnBdgm.do', data[0]);
      		}
      	});

		//상면링크 클릭시 팝업
		$('#'+gridId).on('click', '#btnUpsdLnk', function(e){
			var dataObj = AlopexGrid.parseEvent(e).data;
//			var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version};
			var data = {itemId: dataObj.rackId};

			$a.popup({
				title: '드로잉 툴',
				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
				data: data,
				iframe: false,
				windowpopup: true,
				movable:false,
				width : screen.availWidth,
				height : screen.availHeight
			});
		});


      	$('#btnExportExcel').on('click', function(e) {
      		//tango transmission biz 모듈을 호출하여야한다.
      		var param =  $("#searchForm").getData();

      		param = gridExcelColumn(param, gridId);
      		param.pageNo = 1;
      		param.rowPerPage = 10;
      		param.firstRowIndex = 1;
      		param.lastRowIndex = 1000000000;

      		var fdfChk = "N" ;
      		if ($("input:checkbox[id='fdfChk']").is(":checked") ){
      			fdfChk = "Y";
      		}

      		param.fdfChk = fdfChk;

      		/* 장비정보     	 */
      		param.fileName = configMsgArray['equipmentInformation'];
      		param.fileExtension = "xlsx";
      		param.excelPageDown = "N";
      		param.excelUpload = "N";

      		 if($("input:checkbox[id='nlnkgChk']").is(":checked")) {
       			 param.method = "getEqpInfMgmtNlnkgChkList";
       		 }
       		 else {
       			param.method = "getEqpInfMgmtList";
       		 }

      		$('#'+gridId).alopexGrid('showProgress');
      		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/excelcreate', param, 'GET', 'excelDownload');
      	});

      	$('#btnExportExcelOnDemand').on('click', function(e){
      		btnExportExcelOnDemandClickEventHandler(e);
      	});

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	/* 장비상세정보    	 */
    	 	//popup('EqpDtlLkup', $('#ctx').val()+'/configmgmt/equipment/EqpDtlLkup.do', configMsgArray['equipmentDetailInf'],dataObj);
    	 	/****************************************************************************
        	*	New Popup Start
        	*****************************************************************************/
        	var tmpPopId = "E_"+Math.floor(Math.random() * 10) + 1;
        	var paramData = {mtsoEqpGubun :'eqp', mtsoEqpId : dataObj.eqpId, parentWinYn : 'Y'};
    		var popMtsoEqp = $a.popup({
    			popid: tmpPopId,
    			title: '통합 국사/장비 정보',
    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
    			data: paramData,
    			iframe: false,
    			modal: false,
    			movable:false,
    			windowpopup: true,
    			width : 900,
    			height : window.innerHeight
    		});
    		//setTimeout(window.close(), 7000);
    		/****************************************************************************
        	*	New Popup End
        	*****************************************************************************/

    	 });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

    	 //장비교체 버튼 - 원장비가 있는경우 활성화
    	 $('#'+gridId).on('click', '.bodycell', function(e){
 			var dataObj = null;
 			dataObj = AlopexGrid.parseEvent(e).data;

 			if(dataObj.oriEqpId == "" || dataObj.oriEqpId == undefined || dataObj.lnkgSystmCd == "IBN"){
 				$('#btnEqpChg').setEnabled(false);
 			}else{
 				$('#btnEqpChg').setEnabled(true);
 			}
 		});

	};

	 /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //장비조회조건세팅
	        var param =  $("#searchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();
	   		if ($("#eqpRoleDivCdList").val() != "" && $("#eqpRoleDivCdList").val() != null ){
	   			param.eqpRoleDivCdList = $("#eqpRoleDivCdList").val() ;
	   		}else{
	   			param.eqpRoleDivCdList = [];
	   		}

	   		if ($("#bpIdList").val() != "" && $("#bpIdList").val() != null ){
	   			param.bpIdList = $("#bpIdList").val() ;
	   		}else{
	   			param.bpIdList = [];
	   		}

	   		if ($("#eqpMdlIdList").val() != "" && $("#eqpMdlIdList").val() != null ){
	   			param.eqpMdlIdList = $("#eqpMdlIdList").val() ;
	   		}else{
	   			param.eqpMdlIdList = [];
	   		}

	   		var fdfChk = "N" ;
	   		if ($("input:checkbox[id='fdfChk']").is(":checked") ){
	   			fdfChk = "Y";
	   		}

	   		param.fdfChk = fdfChk;

	   		var nlnkgChk = "N" ;
	   		if ($("input:checkbox[id='nlnkgChk']").is(":checked") ){
	   			nlnkgChk = "Y";
	   		}

	   		param.nlnkgChk = nlnkgChk;

	   		/* 엑셀정보     	 */
	   		var now = new Date();
	   		var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	   		var excelFileNm = 'Equipment_Information_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
     		 if($("input:checkbox[id='nlnkgChk']").is(":checked")) {
       			 param.excelMethod = "getEqpInfMgmtNlnkgChkList";
       		 }
       		 else {
       			param.excelMethod = "getEqpInfMgmtList";
       		 }
	   		param.excelFlag = "EqpInfMgmt";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	   		fileOnDemendName = excelFileNm+".xlsx";
	   		console.log("aaa");
	   		$('#'+gridId).alopexGrid('showProgress');
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	 }

	function EqpReg() {
		 dataParam = {"regYn" : "N"};
		 /* 장비등록     	 */
		 popup('EqpReg', $('#ctx').val()+'/configmgmt/equipment/EqpReg.do', configMsgArray['equipmentRegistration'], dataParam);
	}

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		//console.log(gridHeader);
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}

	function successCallback(response, status, jqxhr, flag){

		if(flag == 'EqpChange') {
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
				});

				var pageNo = $("#pageNo").val();
	    		var rowPerPage = $("#rowPerPage").val();

	            main.setGrid(pageNo,rowPerPage);
			}else if(response.Result == "Fail"){
				callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
			}
		}

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

		//관리그룹
		if(flag == 'mgmtGrpNm'){

			var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

			$('#mgmtGrpNm').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];

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
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}

			$('#orgId').clear();

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
		    		$('#orgId').setData({
						data:option_data ,
						orgId:selectId
					});
	   		}
	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrg/' + sUprOrgId, null, 'GET', 'fstTeam');
    	}

    	if(flag == 'org'){
    		$('#orgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#orgId').setData({
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
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamId').clear();

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
  	    		$('#teamId').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#teamId').val() != ""){
  	    			sOrgId = selectId;
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpTmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
    	}

    	if(flag == 'team'){
    		$('#teamId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#teamId').setData({
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

		if(flag == 'mdl'){
			$('#eqpMdlIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#eqpMdlIdList').setData({
	             data:option_data
			});
		}

		if(flag == 'bp'){
			$('#bpIdList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpIdList').setData({
	             data:option_data
			});
		}

    	if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCdList').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#eqpRoleDivCdList').setData({
                 data:option_data
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

    	if(flag == 'tnEqpUsgCd'){
    		$('#tnEqpUsgCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#tnEqpUsgCd').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'ownBizrCd'){
    		$('#ownBizrCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#ownBizrCd').setData({
                 data:option_data
    		});
    	}


    	if(flag == 'session'){
    		//alert(JSON.stringify(response));
    		callMsgBox('','W', JSON.stringify(response) , function(msgId, msgRst){});
    	}

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

     		 if($("input:checkbox[id='nlnkgChk']").is(":checked")) {
     			setSPGrid(gridId, response, response.eqpMgmtNlnkgChkList);
       		 }
       		 else {
       			setSPGrid(gridId, response, response.eqpMgmtList);
       		 }
    	}

    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
         // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();

        }

    	if(flag == 'test') {
    		if(response.Result == "Success"){
    			callMsgBox('','I', "성공." , function(msgId, msgRst){});
        	}else if(response.Result == "ExistsGisUse"){
    			callMsgBox('','I', "GIS에서 사용중인 장비로 삭제할 수 없습니다." , function(msgId, msgRst){});
        	}else if(response.Result == "Fail"){
    			callMsgBox('','W', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}

    	}

    	if(flag == 'opTeamOrgId'){ // 라종식

    		$('#opTeamOrgId').clear();

    		var option_data =  [{uprOrgId: "", orgId: "",orgNm: configMsgArray['all']}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#opTeamOrgId').setData({
             data:option_data
			});
    	}
    }

	 function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                    $('#mgmtGrpNm').val('');
                }
            });
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

    	var hideColList = ['eqpMdlId', 'eqpStatCd', 'eqpRoleDivCd', 'bpId', 'jrdtTeamOrgId', 'opTeamOrgId', 'oriEqpNm', 'oriTmofNm', 'oriMtsoNm','trmsEqpYn'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){
    	//장비교체 버튼 비활성화
    	 $('#btnEqpChg').setEnabled(false);

    	 $('#pageNo').val(page);
    	 $('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 if ($("input:checkbox[id='nlnkgChk']").is(":checked") ){
    		 $('#'+gridId).alopexGrid("showCol", 'oriEqpNm');
    		 $('#'+gridId).alopexGrid("showCol", 'oriTmofNm');
    		 $('#'+gridId).alopexGrid("showCol", 'oriMtsoNm');
	   	 }else{
	   		 $('#'+gridId).alopexGrid("hideCol", 'oriEqpNm', 'conceal');
	   		 $('#'+gridId).alopexGrid("hideCol", 'oriTmofNm', 'conceal');
	   		 $('#'+gridId).alopexGrid("hideCol", 'oriMtsoNm', 'conceal');
	   	 }

	   	 $.each($('form input[type=checkbox]')
        		.filter(function(idx){
        			return $(this).prop('checked') === false
        		}),
        		function(idx, el){
        	var emptyVal = "";
        	param += '&' + $(el).attr('name') + '=' + emptyVal;
	   	 });

    	 $('#'+gridId).alopexGrid('showProgress');
 		 if($("input:checkbox[id='nlnkgChk']").is(":checked")) {
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmtNlnkgChk', param, 'GET', 'search');
  		 }
  		 else {
  			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'search');
  		 }
    }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.8
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