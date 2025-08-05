/**
 * EqpSctnMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
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
        $('#'+gridId).alopexGrid({
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
    		headerGroup : [ { fromIndex :  2 , toIndex :  10 , title : configMsgArray['west'] , id : "West", color : "YELLOW"},
                  			{ fromIndex : 11 , toIndex : 19 , title : configMsgArray['east'] , id : "East", color : "BLUE"}],
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			}, {/* 구간ID		 */
				key : 'eqpSctnId', align:'center',
				title : configMsgArray['sectionIdentification'],
				width: '100px'
			}, {/* 본부			 */
				key : 'lftOrgNm', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px'
			}, {/* 전송실 		 */
				key : 'lftTmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			}, {/* 국사명		 */
				key : 'lftMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '120px'
			}, {/* 장비명       	 */
				key : 'lftEqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '130px'
			}, {/* 장비타입       	 */
				key : 'lftEqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '130px'
			}, {/* 포트명		 */
				key : 'lftPortNm', align:'center',
				title : configMsgArray['portName'],
				width: '100px'
			}, {/* 포트IP 	 */
				key : 'lftPortIpAddr', align:'center',
				title : configMsgArray['portInternetProtocol'],
				width: '100px'
			}, {/* 포트용량 		 */
				key : 'lftPortCapaNm', align:'center',
				title : configMsgArray['portCapacity'],
				width: '100px'
			}, {/* 포트설명 		 */
				key : 'lftPortDesc', align:'center',
				title : configMsgArray['portDescription'],
				width: '100px'
			}, {/* 본부			 */
				key : 'rghtOrgNm', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px'
			}, {/* 전송실 		 */
				key : 'rghtTmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			}, {/* 국사명		 */
				key : 'rghtMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '120px'
			}, {/* 장비명       	 */
				key : 'rghtEqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '130px'
			}, {/* 장비타입       	 */
				key : 'rghtEqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '130px'
			}, {/* 포트명		 */
				key : 'rghtPortNm', align:'center',
				title : configMsgArray['portName'],
				width: '100px'
			}, {/* 포트IP 	 */
				key : 'rghtPortIpAddr', align:'center',
				title : configMsgArray['portInternetProtocol'],
				width: '100px'
			}, {/* 포트용량 		 */
				key : 'rghtPortCapaNm', align:'center',
				title : configMsgArray['portCapacity'],
				width: '100px'
			}, {/* 포트설명 		 */
				key : 'rghtPortDesc', align:'center',
				title : configMsgArray['portDescription'],
				width: '100px'
			}, {/* 자동/수동   	 */
				key : 'autoClctYn', align:'center',
				title : configMsgArray['autoPassive'],
				width: '100px'
			}, {/* 원천구간ID		 */
				key : 'srcEqpSctnId', align:'center',
				title : configMsgArray['sourceSectionIdentification'],
				width: '100px'
			}, {/* 자동수집여부   	 */
				key : 'sctnStatTypNm', align:'center',
				title : configMsgArray['autoCollectionYesOrNo'],
				width: '100px'
			}, {/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '130px'
			}, {/* 등록자		 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'
			}, {/* 변경일자		 */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '130px'
			}, {/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'
			}, {/* 장비ID--숨김데이터    	 */
				key : 'lftEqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '130px'
			}, {/* 장비모델명 --숨김데이터  	 */
				key : 'lftEqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'
			}, {/* 포트ID--숨김데이터 		 */
				key : 'lftPortId', align:'center',
				title : configMsgArray['portIdentification'],
				width: '100px'
			}, {/* 장비ID--숨김데이터    	 */
				key : 'rghtEqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '130px'
			}, {/* 장비모델명--숨김데이터   	 */
				key : 'rghtEqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'
			}, {/* 포트ID--숨김데이터 		 */
				key : 'rghtPortId', align:'center',
				title : configMsgArray['portIdentification'],
				width: '100px'
			}, {/* 연결정보유형코드--숨김데이터    */
				key : 'connInfTypCd', align:'center',
				title : configMsgArray['connectionInformationTypeCode'],
				width: '100px'
			}, {/* 자동수집여부--숨김데이터   	 */
				key : 'sctnStatTypCd', align:'center',
				title : configMsgArray['autoCollectionYesOrNo'],
				width: '100px'
			}, {/* 본부ID--숨김데이터   	 */
				key : 'lftOrgId', align:'center',
				title : '본부ID',
				width: '100px'
			}, {/* 팀ID--숨김데이터   	 */
				key : 'lftTeamId', align:'center',
				title : '팀ID',
				width: '100px'
			}, {/* 전송실ID--숨김데이터   	 */
				key : 'lftTmof', align:'center',
				title : '전송실ID',
				width: '100px'
			}, {/* 본부ID--숨김데이터   	 */
				key : 'rghtOrgId', align:'center',
				title : '본부ID',
				width: '100px'
			}, {/* 팀ID--숨김데이터   	 */
				key : 'rghtTeamId', align:'center',
				title : '팀ID',
				width: '100px'
			}, {/* 전송실ID--숨김데이터   	 */
				key : 'rghtTmof', align:'center',
				title : '전송실ID',
				width: '100px'
			} ],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
   };

// 컬럼 숨기기
   function gridHide() {

   	var hideColList = ['lftMtsoId','lftEqpId','lftEqpMdlNm','lftEqpMdlId','lftPortId','rghtMtsoId','rghtEqpId','rghtEqpMdlNm','rghtEqpMdlId','rghtPortId','connInfTypCd','sctnStatTypCd', 'lftOrgId', 'lftTeamId', 'lftTmof', 'rghtOrgId', 'rghtTeamId', 'rghtTmof'];

   	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	 function setSelectCode() {
		 var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');

    	//본부 세션 값이 없을 경우 팀,전송실 전체 조회
//    	if($("#sUprOrgId").val() == ""){
//	    	//팀 조회
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//	    	//전송실 조회
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
//    	}

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

    		 var param =  $("#searchForm").getData();

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

    		 main.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			var param =  $("#searchForm").getData();

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

     			main.setGrid(1,perPage);
       		}
     	 });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

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

    	 //장비수용현황
    	 $('#status_popup').on('click', function(e) {
    		 popupList('EqpSctnAcptCurst', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpSctnAcptCurst.do', configMsgArray['equipmentAcceptCurrentState']);
          });

    	//미연동장비
    	 $('#equip_popup').on('click', function(e) {
    		 popupList('EqpSctnNlnkgLkup', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpSctnNlnkgLkup.do', configMsgArray['notLinkageEquipment']);
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
 	     	 }
         });

    	//등록
    	 $('#btnReg').on('click', function(e) {
	    	 dataParam = {"regYn" : "N"};
    		 popup('EqpSctnReg', 'EqpSctnReg.do', configMsgArray['equipmentSectionRegistration'], dataParam);
         });

    	//멀티등록
    	 $('#btnMltReg').on('click', function(e) {
	    	 dataParam = {"regYn" : "N"};
	    	 $a.popup({
	          	popid: 'EqpSctnMltReg',
	          	title: configMsgArray['equipmentSectionRegistration'],
	              url: 'EqpSctnMltReg.do',
	              data: dataParam,
	              iframe: false,
	              modal: true,
	              movable:true,
	              width : 1200,
	              height : window.innerHeight * 0.75
	          });
         });

    	 $('#btnExportExcel').on('click', function(e) {
     		 var param =  $("#searchForm").getData();

     		 param = gridExcelColumn(param, gridId);
     		 param.pageNo = 1;
     		 param.rowPerPage = 10;
     		 param.firstRowIndex = 1;
     		 param.lastRowIndex = 1000000000;

     		 param.fileName = configMsgArray['equipmentSectionMgmt']; /* 장비구간관리   	 */
     		 param.fileExtension = "xlsx";
     		 param.excelPageDown = "N";
     		 param.excelUpload = "N";
     		 param.method = "getEqpSctnMgmtList";

     		 $('#'+gridId).alopexGrid('showProgress');
  	    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/excelcreate', param, 'GET', 'excelDownload');
          });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
    		 var param =  $("#searchForm").getData();

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

	         btnExportExcelOnDemandClickEventHandler(e);
	     });

    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = null;
    	 	dataObj = AlopexGrid.parseEvent(e).data;
    	 	dataObj.mgmtGrpNm = $('#mgmtGrpNm').val();
    	 	/* 장비구간상세정보 */
    	 	popup('EqpSctnDtlLkup', 'EqpSctnDtlLkup.do', configMsgArray['equipmentSectionDetailInf'],dataObj);

    	 });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });
    };

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //장비구간조회조건세팅
	        var param =  $("#searchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();

	   		/* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = 'Equipment_Section_Information_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getEqpSctnMgmtList";
	   		param.excelFlag = "EqpSctnMgmt";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
  		    console.log("aaa");
  		 	$('#'+gridId).alopexGrid('showProgress');
  		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	    }

    function gridExcelColumn(param, gridId) {

    	/*======Grid의 HeaderGroup 내용 가져오기======*/
    	var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");

    	var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

		for(var i=0; i<gridHeaderGroup.length; i++) {
			if(gridHeaderGroup[i].title != undefined) {
				excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex - 1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupFromIndex += ";";
				excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex - 1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupToIndex += ";";
				excelHeaderGroupTitle += gridHeaderGroup[i].title;
				excelHeaderGroupTitle += ";";
				excelHeaderGroupColor += gridHeaderGroup[i].color;
				excelHeaderGroupColor += ";";
			}
		}

		/*======Grid의 Header 내용 가져오기 ======*/
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

		/*======해더그룹정보======*/
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		/*======해더정보======*/
		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}

	function successCallback(response, status, jqxhr, flag){
		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.EqpSctnMgmt);
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

			$('#org').clear();

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
    		var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];

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
    		var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];

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
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['select'],mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
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
	}

	function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
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

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").getData();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/eqpSctnMgmt', param, 'GET', 'search');
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
                  height : window.innerHeight * 0.75
              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
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