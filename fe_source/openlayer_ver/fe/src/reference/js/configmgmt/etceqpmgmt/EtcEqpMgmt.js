/**
 * EtcEqpMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var rtfGridId = 'dataGridRtf';
	var rrsGridId = 'dataGridRrs';
	var fileOnDemendName = "";

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+rtfGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
				align:'center',
				title : '순번',
				width: '50px',
				numberingColumn: true
    		}, {
				key : 'mgmtGrpNm', align:'center',
				title : '관리그룹',
				width: '70px'
			}, {
				key : 'tmof', align:'center',
				title : '전송실',
				width: '100px'
			}, {
				key : 'eqpRoleDivCd', align:'center',
				title : '장비타입코드',
				width: '100px'
			}, {
				key : 'eqpRoleDivNm', align:'center',
				title : '장비타입',
				width: '100px'
			}, {
				key : 'bpId', align:'center',
				title : '제조사ID',
				width: '100px'
			}, {
				key : 'bpNm', align:'center',
				title : '제조사',
				width: '100px'
			}, {
				key : 'eqpMdlId', align:'center',
				title : '모델ID',
				width: '100px'
			}, {
				key : 'eqpMdlNm', align:'center',
				title : '장비모델명',
				width: '150px'
			}, {
				key : 'eqpInstlMtsoNm', align:'center',
				title : '국사',
				width: '150px'
			}, {
				key : 'eqpInstlMtsoId', align:'center',
				title : '국사ID',
				width: '100px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '150px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '100px'
			},{
				key : 'eqpSerNoVal', align:'center',
				title : 'SerialNo',
				width: '100px'
			},{
				key : 'barNo', align:'center',
				title : '바코드',
				width: '100px'
			}, {
				key : 'eqpStatCd', align:'center',
				title : '상태코드',
				width: '100px'
			}, {
				key : 'eqpStatNm', align:'center',
				title : '상태',
				width: '100px'
			}, {
				key : 'portCnt', align:'center',
				title : '포트개수',
				width: '100px'
			},{
				key : 'jrdtTeamOrgId', align:'center',
				title : '관리팀ID',
				width: '100px'
			},{
				key : 'jrdtTeamOrgNm', align:'center',
				title : '관리팀',
				width: '100px'
			},{
				key : 'opTeamOrgId', align:'center',
				title : '운용팀ID',
				width: '100px'
			},{
				key : 'opTeamOrgNm', align:'center',
				title : '운용팀',
				width: '100px'
			},{
				key : 'eqpTid', align:'center',
				title : 'TID',
				width: '100px'
			},{
				key : 'lcl', align:'center',
				title : '모델대분류',
				width: '100px'
			},{
				key : 'mcl', align:'center',
				title : '모델중분류',
				width: '100px'
			},{
				key : 'scl', align:'center',
				title : '모델소분류',
				width: '100px'
			},{
				key : 'eqpHostNm', align:'center',
				title : '호스트명',
				width: '100px'
			},{
				key : 'eqpAutoRegYn', align:'center',
				title : '자동등록여부',
				width: '100px'
			},{
				key : 'dablMgmtYn', align:'center',
				title : '장애관리여부',
				width: '100px'
			},{
				key : 'cstrMgmtNo', align:'center',
				title : '공사관리번호',
				width: '100px'
			},{
				key : 'swVerVal', align:'center',
				title : 'S/W버전',
				width: '100px'
			}, {
				key : 'mainEqpIpAddr', align:'center',
				title : '장비IP',
				width: '100px'
			}, {
				key : 'bldAddr', align:'center',
				title : '주소',
				width: '180px'
			}, {
				key : 'addr', align:'center',
				title : '주소',
				width: '180px'
			}, {
				key : 'eqpFwVerVal', align:'center',
				title : 'F/W 버전',
				width: '100px'
			}, {
				key : 'rtfcMdulCtt', align:'center',
				title : '정류모듈',
				width: '100px'
			}, {
				key : 'eqpRmk', align:'center',
				title : '비고',
				width: '100px'
			}, {
				key : 'BatryCrgTypCd', align:'center',
				title : '축전지충전유형코드',
				width: '100px'
			}, {
				key : 'BatryCrgTypNm', align:'center',
				title : '축전지충전유형',
				width: '100px'
			}, {
				key : 'PrtVotqtVal', align:'center',
				title : '출력전압량값',
				width: '100px'
			}, {
				key : 'DchgVotqtVal', align:'center',
				title : '방전전압량값',
				width: '100px'
			}, {
				key : 'U1gpVendNm', align:'center',
				title : '1조제조사명',
				width: '100px'
			}, {
				key : 'U1gpCapaVal', align:'center',
				title : '1조용량값',
				width: '100px'
			}, {
				key : 'U1gpMnftYm', align:'center',
				title : '1조제조년월',
				width: '100px'
			}, {
				key : 'U2gpVendNm', align:'center',
				title : '2조제조사명',
				width: '100px'
			}, {
				key : 'U2gpCapaVal', align:'center',
				title : '2조용량값',
				width: '100px'
			}, {
				key : 'U2gpMnftYm', align:'center',
				title : '2조제조년월',
				width: '100px'
			}, {
				key : 'U3gpVendNm', align:'center',
				title : '3조제조사명',
				width: '100px'
			}, {
				key : 'U3gpCapaVal', align:'center',
				title : '3조용량값',
				width: '100px'
			}, {
				key : 'U3gpMnftYm', align:'center',
				title : '3조제조년월',
				width: '100px'
			},{
				key : 'frstRegDate', align:'center',
				title : '등록일',
				width: '100px'
			},{
				key : 'frstRegUserId', align:'center',
				title : '등록자',
				width: '100px'
			},{
				key : 'lastChgDate', align:'center',
				title : '변경일',
				width: '100px'
			},{
				key : 'lastChgUserId', align:'center',
				title : '변경자',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+rrsGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
				align:'center',
				title : '순번',
				width: '50px',
				numberingColumn: true
    		}, {
				key : 'mgmtGrpNm', align:'center',
				title : '관리그룹',
				width: '70px'
    		}, {
				key : 'tmof', align:'center',
				title : '전송실',
				width: '100px'
    		}, {
				key : 'eqpRoleDivCd', align:'center',
				title : '장비타입코드',
				width: '100px'
			}, {
				key : 'eqpRoleDivNm', align:'center',
				title : '장비타입',
				width: '100px'
			}, {
				key : 'bpId', align:'center',
				title : '제조사ID',
				width: '100px'
			}, {
				key : 'bpNm', align:'center',
				title : '제조사',
				width: '100px'
			}, {
				key : 'eqpMdlId', align:'center',
				title : '모델ID',
				width: '100px'
			}, {
				key : 'eqpMdlNm', align:'center',
				title : '장비모델명',
				width: '150px'
			}, {
				key : 'eqpInstlMtsoNm', align:'center',
				title : '국사',
				width: '150px'
			}, {
				key : 'eqpInstlMtsoId', align:'center',
				title : '국사ID',
				width: '100px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '150px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '100px'
			},{
				key : 'eqpSerNoVal', align:'center',
				title : 'SerialNo',
				width: '100px'
			},{
				key : 'barNo', align:'center',
				title : '바코드',
				width: '100px'
			}, {
				key : 'eqpStatCd', align:'center',
				title : '상태코드',
				width: '100px'
			}, {
				key : 'eqpStatNm', align:'center',
				title : '상태',
				width: '100px'
			}, {
				key : 'portCnt', align:'center',
				title : '포트개수',
				width: '100px'
			},{
				key : 'jrdtTeamOrgId', align:'center',
				title : '관리팀ID',
				width: '100px'
			},{
				key : 'jrdtTeamOrgNm', align:'center',
				title : '관리팀',
				width: '100px'
			},{
				key : 'opTeamOrgId', align:'center',
				title : '운용팀ID',
				width: '100px'
			},{
				key : 'opTeamOrgNm', align:'center',
				title : '운용팀',
				width: '100px'
			},{
				key : 'eqpTid', align:'center',
				title : 'TID',
				width: '100px'
			},{
				key : 'lcl', align:'center',
				title : '모델대분류',
				width: '100px'
			},{
				key : 'mcl', align:'center',
				title : '모델중분류',
				width: '100px'
			},{
				key : 'scl', align:'center',
				title : '모델소분류',
				width: '100px'
			},{
				key : 'eqpHostNm', align:'center',
				title : '호스트명',
				width: '100px'
			},{
				key : 'eqpAutoRegYn', align:'center',
				title : '자동등록여부',
				width: '100px'
			},{
				key : 'dablMgmtYn', align:'center',
				title : '장애관리여부',
				width: '100px'
			},{
				key : 'cstrMgmtNo', align:'center',
				title : '공사관리번호',
				width: '100px'
			},{
				key : 'swVerVal', align:'center',
				title : 'S/W버전',
				width: '100px'
			}, {
				key : 'mainEqpIpAddr', align:'center',
				title : '장비IP',
				width: '100px'
			}, {
				key : '', align:'center',
				title : 'PING',
				width: '100px'
			}, {
				key : 'usePortCnt', align:'center',
				title : '사용포트수',
				width: '100px'
			}, {
				key : 'eqpFwVerVal', align:'center',
				title : 'F/W 버전',
				width: '100px'
			}, {
				key : 'eqpRmk', align:'center',
				title : '비고',
				width: '100px'
			},{
				key : 'frstRegDate', align:'center',
				title : '등록일',
				width: '100px'
			},{
				key : 'frstRegUserId', align:'center',
				title : '등록자',
				width: '100px'
			},{
				key : 'lastChgDate', align:'center',
				title : '변경일',
				width: '100px'
			},{
				key : 'lastChgUserId', align:'center',
				title : '변경자',
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

		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

    	//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
//    	if($("#sUprOrgId").val() == ""){
//    		//팀 조회
//			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//			//전송실 조회
//	    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
//	    }
    	//장비 역할 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00148', null, 'GET', 'eqpRoleDivCd');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
    	//장비모델 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
    	//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
		//장비 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCd');

    }


    function setEventListener() {

    	var perPage = 100;

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

    	// 페이지 번호 클릭시
    	 $('#'+rtfGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+rtfGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage);
         });

      // 페이지 번호 클릭시
    	 $('#'+rrsGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+rrsGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage);
         });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

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
     		 }

     		//장비모델 조회
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
    		 //제조사 조회
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
          });

     	//장비타입 선택시 이벤트
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

    	//탭변경 이벤트
    	 $('#basicTabs').on("tabchange", function(e, index) {
 			switch (index) {
 			case 0 :
 				$('#'+rtfGridId).alopexGrid("viewUpdate");
 				break;
 			case 1 :
 				$('#'+rrsGridId).alopexGrid("viewUpdate");
 				break;
 			default :
 				break;
 			}
     	});

    	//등록
    	 $('#btnReg').on('click', function(e) {
    		 dataParam = {"regYn" : "N"};
    		 popupRtf('EtcEqpReg', $('#ctx').val()+'/configmgmt/etceqpmgmt/EtcEqpReg.do', '기타 장비 등록', dataParam);
         });

    	//엑셀다운
    	 $('#btnExportExcel').on('click', function(e) {
    		 var idx  = $('#basicTabs').getCurrentTabIndex();
         	 var param =  $("#searchForm").getData();

	   		 param.pageNo = 1;
	   		 param.rowPerPage = 10;
	   		 param.firstRowIndex = 1;
	   		 param.lastRowIndex = 1000000000;

	   		 param.fileExtension = "xlsx";
	   		 param.excelPageDown = "N";
	   		 param.excelUpload = "N";

	   		 if(idx == 0){
	   			 param.method = "getEtcEqpMgmtRtfList";
	   			 param.fileName = "기타장비정보_정류기";
	   			 param = gridExcelColumn(param, rtfGridId);
	   		 }else if(idx == 1){
	   			 param.method = "getEtcEqpMgmtRrsList";
	   			 param.fileName = "기타장비정보_RRS";
	   			 param = gridExcelColumn(param, rrsGridId);

	   		 }

	   		$('#'+rtfGridId).alopexGrid('showProgress');
	   		$('#'+rrsGridId).alopexGrid('showProgress');

	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/etceqpmgmt/excelcreate', param, 'GET', 'excelDownload');
         });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
	            btnExportExcelOnDemandClickEventHandler(e);
	        });

    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+rtfGridId).on('dblclick', '.bodycell', function(e){
    		var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;
    	 	$.extend(dataObj,{"lnkgSystmCd":"RTF"});
    	 	popupRtf('EtcEqpDtlLkup', $('#ctx').val()+'/configmgmt/etceqpmgmt/EtcEqpDtlLkup.do', '기타 장비 상세 정보',dataObj);

    	 });

    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+rrsGridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
       	 	dataObj = AlopexGrid.parseEvent(e).data;
    	 	$.extend(dataObj,{"lnkgSystmCd":"RRS"});
    	 	popup('EtcEqpDtlLkup', $('#ctx').val()+'/configmgmt/etceqpmgmt/EtcEqpDtlLkup.do', '기타 장비 상세 정보',dataObj);

    	 });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

	};

	/*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //기타장비조회조건세팅
		    var idx  = $('#basicTabs').getCurrentTabIndex();
	        var param =  $("#searchForm").getData();
	        if(idx == 0){
	   			 param = gridExcelColumn(param, rtfGridId);
	   		 }else if(idx == 1){
	   			 param = gridExcelColumn(param, rrsGridId);
	   		 }
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();

	   		/* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelFlag = "EtcEqpMgmt";

	   		var excelFileNm = null;
	   		if(idx == 0){
	   			 param.excelMethod = "getEtcEqpMgmtRtfList";
	   			 excelFileNm = 'RTF_Equipment_Information_'+dayTime;
	   			 param = gridExcelColumn(param, rtfGridId);
	   			$('#'+rtfGridId).alopexGrid('showProgress');
	   		 }else if(idx == 1){
	   			 param.excelMethod = "getEtcEqpMgmtRrsList";
	   			excelFileNm = 'RRS_Equipment_Information_'+dayTime;
	   			 param = gridExcelColumn(param, rrsGridId);
	   			$('#'+rrsGridId).alopexGrid('showProgress');
	   		 }

	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	   		param.fileName = excelFileNm;
	        fileOnDemendName = excelFileNm+".xlsx";
  		    console.log("aaa");
  		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
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
		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+rtfGridId).alopexGrid('hideProgress');
 			 $('#'+rrsGridId).alopexGrid('hideProgress');
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
    		var option_data =  [{orgId: "", orgNm: "전체",uprOrgId: ""}];

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
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
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

		if(flag == 'mdl'){
			$('#eqpMdlId').clear();
			var option_data =  [{comCd: "", comCdNm: "전체"}];

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
			var option_data =  [{comCd: "", comCdNm: "전체"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpId').setData({
	             data:option_data
			});
		}

    	if(flag == 'eqpRoleDivCd'){
    		$('#eqpRoleDivCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#eqpRoleDivCd').setData({
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

    	if(flag == 'searchRtf'){

    		$('#'+rtfGridId).alopexGrid('hideProgress');
    		setSPGrid(rtfGridId, response, response.etcEqpMgmtRtf);
    	}

		if(flag == 'searchRrs'){

			$('#'+rrsGridId).alopexGrid('hideProgress');
			setSPGrid(rrsGridId, response, response.etcEqpMgmtRrs);
		}

		if(flag == 'excelDownload'){
			 $('#'+rtfGridId).alopexGrid('hideProgress');
  			 $('#'+rrsGridId).alopexGrid('hideProgress');
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

    	var hideColList1 = ['lcl', 'mcl', 'scl', 'barNo', 'eqpStatNm', 'portCnt', 'jrdtTeamOrgNm', 'eqpTid', 'addr',
    	                   'eqpInstlMtsoId', 'eqpMdlId', 'bpId', 'eqpId', 'eqpStatCd', 'eqpRoleDivCd', 'jrdtTeamOrgId', 'opTeamOrgId', 'opTeamOrgNm', 'eqpHostNm', 'eqpAutoRegYn', 'dablMgmtYn', 'cstrMgmtNo',
    	                   'BatryCrgTypCd', 'BatryCrgTypNm', 'PrtVotqtVal', 'DchgVotqtVal', 'U1gpVendNm', 'U1gpCapaVal', 'U1gpMnftYm', 'U2gpVendNm', 'U2gpCapaVal', 'U2gpMnftYm', 'U3gpVendNm', 'U3gpCapaVal', 'U3gpMnftYm',
    	                   'swVerVal'];

    	var hideColList2 = ['lcl', 'mcl', 'scl', 'barNo', 'eqpStatNm', 'portCnt', 'jrdtTeamOrgNm', 'eqpTid',
    	                   'eqpInstlMtsoId', 'eqpMdlId', 'bpId', 'eqpId', 'eqpStatCd', 'eqpRoleDivCd', 'jrdtTeamOrgId', 'opTeamOrgId', 'opTeamOrgNm', 'eqpHostNm', 'eqpAutoRegYn', 'dablMgmtYn', 'cstrMgmtNo',
    	                   'eqpFwVerVal', 'swVerVal'];

    	$('#'+rtfGridId).alopexGrid("hideCol", hideColList1, 'conceal');
    	$('#'+rrsGridId).alopexGrid("hideCol", hideColList2, 'conceal');

	}

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();
    	 var idx  = $('#basicTabs').getCurrentTabIndex();

    	 switch (idx) {
			case 0 :
				$('#'+rtfGridId).alopexGrid('showProgress');
	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/etceqpmgmt/etcEqpMgmtRtf', param, 'GET', 'searchRtf');
				break;
			case 1 :
				$('#'+rrsGridId).alopexGrid('showProgress');
	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/etceqpmgmt/etcEqpMgmtRrs', param, 'GET', 'searchRrs');
				break;
			default :
				break;
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
	                }
	            });
		}

    function popupRtf(pidData, urlData, titleData, paramData) {
    	$a.popup({
          	popid: pidData,
          	title: titleData,
              url: urlData,
              data: paramData,
              iframe: false,
              modal: true,
              movable:true,
              width : 865,
              height : window.innerHeight * 0.9
          });
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