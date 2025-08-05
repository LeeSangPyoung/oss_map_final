/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var gridIdDistance = 'dataGridDistance';
	var totalCnt = 0;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
        setRegDataSet();

        $('#distanceM').val("100");
    };

    function setRegDataSet() {

    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height:"8row",
        	autoColumnIndex: true,
        	rowSingleSelectAllowUnselect: false,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		enableDefaultContextMenu:false,
    		columnMapping: [{
				key : 'gubun', align:'left',
				title : configMsgArray['division'],
				width: '80px',
				treeColumn : true,
				treeColumnHeader : true
    		}, {/* 관리그룹			 */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '100px'
			}, {/* 본부			 */
				key : 'orgNm', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px'
			}, {/* 본부ID	--숨김데이터	 */
				key : 'orgId', align:'center',
				title : configMsgArray['headOfficeIdentification'],
				width: '100px'
			}, {/* 팀	 */
				key : 'teamNm', align:'center',
				title : configMsgArray['team'],
				width: '100px'
			}, {/* 팀ID--숨김데이터			 */
				key : 'teamId', align:'center',
				title : configMsgArray['teamIdentification'],
				width: '100px'
			},{/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '150px'
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '250px'
			}, { /* 국사 약어명		 */
				key : 'mtsoAbbrNm', align:'center',
				title : '국사약어명',
				width: '250px'
			},{/* 국사유형		 */
				key : 'mtsoTyp', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px'
			}, {/* 국사상태		 */
				key : 'mtsoStat', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'],
				width: '100px'
			}, {/* 건물주소		 */
				key : 'bldAddr', align:'center',
				title : configMsgArray['buildingAddress'],
				width: '250px'
			}, {/* 건물명		 */
				key : 'bldNm', align:'center',
				title : '건물명',
				width: '130px'
			},{/* 건물동--숨김데이터		 */
				key : 'bldblkNo', align:'center',
				title : configMsgArray['buildingBlock'],
				width: '100px'
			},{/* 건물동		 */
				key : 'bldblkNm', align:'center',
				title : configMsgArray['buildingBlock'],
				width: '100px'
			},{/* 건물층값--숨김데이터		 */
				key : 'bldFlorNo', align:'center',
				title : configMsgArray['buildingFloorValue'],
				width: '100px'
			},{/* 건물층값		 */
				key : 'bldFlorCnt', align:'center',
				title : configMsgArray['buildingFloorValue'],
				width: '100px'
			},{/* 관리그룹코드--숨김데이터        */
				key : 'mgmtGrpCd', align:'center',
				title : configMsgArray['managementGroupCode'],
				width: '100px'
			},{/* 관리그룹            */
				key : 'mgmtGrpNM', align:'center',
				title : configMsgArray['managementGroup'],
				width: '100px'
			},{/* 대표통합시설코드    */
				key : 'repIntgFcltsCd', align:'center',
				title : configMsgArray['representationIntegrationFacilitiesCode'],
				width: '120px'
			},{/* 통합시설코드 		 */
				key : 'intgFcltsCd', align:'center',
				title : configMsgArray['integrationFacilitiesCode'],
				width: '100px'
			},{/* 공용대표시설코드 		 */
				key : 'shrRepFcltsCd', align:'center',
				title : configMsgArray['shareRepresentationFacilitiesCode'],
				width: '120px'
			},{/* 공용대표구분 		 */
				key : 'shrRepDivNm', align:'center',
				title : configMsgArray['shareRepresentationDivisionName'],
				width: '100px'
			},{/* 국사위도값          */
				key : 'mtsoLatVal', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeLatitudeValue'],
				width: '100px'
			},{/* 국사경도값          */
				key : 'mtsoLngVal', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeLongitudeValue'],
				width: '100px'
			},{/* 국사위도값          */
				key : 'mtsoLatValT', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeLatitudeValue'],
				width: '100px'
			},{/* 국사경도값          */
				key : 'mtsoLngValT', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeLongitudeValue'],
				width: '100px'
			},{/* 시공업체		 */
				key : 'cnstnBpId', align:'center',
				title : configMsgArray['constructionVendor'],
				width: '100px'
			},{/* 국사지도입력여부    */
				key : 'mtsoMapInsYn', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeMapInsertYesOrNo'],
				width: '120px'
			}, {/* 국사ID	--숨김데이터	 */
				key : 'mtsoId', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeIdentification'],
				width: '100px'
			},{/* 건물코드--숨김데이터		 */
				key : 'bldCd', align:'center',
				title : configMsgArray['buildingCode'],
				width: '100px'
			},{/* 등록일자    */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '100px'
			},{/* 등록자    */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'
			},{/* 변경일자    */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '100px'
			},{/* 변경자    */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'
			}],
			tree : { useTree:true, idKey:'treeNo', parentIdKey : 'treePrntNo',expandedKey : 'treeDivVal'},
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+gridIdDistance).alopexGrid({
        	height:"5row",
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
    		},{/* 대표통합시설코드    */
				key : 'repIntgFcltsCd', align:'center',
				title : configMsgArray['representationIntegrationFacilitiesCode'],
				width: '120px'
    		}, {/* 국사ID		 */
				key : 'mtsoId', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeIdentification'],
				width: '150px'
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '150px'
			},{/* 국사유형		 */
				key : 'mtsoTyp', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px'
			}, {/* 국사상태		 */
				key : 'mtsoStat', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'],
				width: '100px'
			}, {/* 건물주소		 */
				key : 'bldAddr', align:'center',
				title : configMsgArray['buildingAddress'],
				width: '200px'
			},{/* 반경(M)          */
				key : 'mtsoDistance', align:'center',
				title : '반경(M)',
				width: '100px'
			},{/* ROADM          */
				key : 'roadmCnt', align:'center',
				title : 'ROADM',
				width: '100px'
			},{/* PTS          */
				key : 'ptsCnt', align:'center',
				title : 'PTS',
				width: '100px'
			},{/* Ring MUX          */
				key : 'ringmuxCnt', align:'center',
				title : 'Ring MUX',
				width: '100px'
			},{/* L2            */
				key : 'ltwoCnt', align:'center',
				title : 'L2',
				width: '100px'
			},{/* L3		 */
				key : 'lthreeCnt', align:'center',
				title : 'L3',
				width: '100px'
			},{/* MSPP		 */
				key : 'msppCnt', align:'center',
				title : 'MSPP',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

//        $('#'+gridId).alopexGrid("hideCol", 'intgFcltsCd', 'conceal');
//        $('#'+gridId).alopexGrid("hideCol", 'shrRepFcltsCd', 'conceal');
//        $('#'+gridId).alopexGrid("hideCol", 'shrRepDivNm', 'conceal');

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

		 var op = $('#'+gridId).alopexGrid('readOption');

		 if(chrrOrgGrpCd == "SKT"){
			 $('#mtsoAbbrNmLabel').html("국사약어명") ;
			 op.columnMapping[8].title = "국사약어명" ;
		 }else{
			 $('#mtsoAbbrNmLabel').html("GIS국사명") ;
			 op.columnMapping[8].title = "GIS국사명" ;
		 }

		 $('#'+gridId).alopexGrid('updateOption', {
  			  columnMapping: op.columnMapping
  		});

		//관리그룹 조회
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
		//본부 세션 값이 없을 경우 팀,전송실 전체 조회
//		 if($("#sUprOrgId").val() == ""){
//			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//	    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
//	     }
//		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
		//하드코딩 되어져있는 국사명 변경
//    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00293', null, 'GET', 'mtsoTyp');
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStat');
    }


    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
//    	 $('#'+gridId).on('pageSet', function(e){
//         	var eObj = AlopexGrid.parseEvent(e);
//         	main.setGrid(eObj.page, eObj.pageinfo.perPage);
//         });

    	//페이지 selectbox를 변경했을 시.
//         $('#'+gridId).on('perPageChange', function(e){
//         	var eObj = AlopexGrid.parseEvent(e);
//         	perPage = eObj.perPage;
//         	main.setGrid(1, eObj.perPage);
//         });


    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 main.setGrid();
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid();
       		}
     	 });

       //엔터키로 조회
         $('#distanceM').on('keydown', function(e){
     		if (e.which == 13  ){
     			var data = null;
     			data = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}}));
          	 	data[0].distanceM = $('#distanceM').val();

          	 	$('#'+gridIdDistance).alopexGrid('showProgress');
        		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoDistance', data[0], 'GET', 'searchDistance');
       		}
     	 });

         /*$('#'+gridId).on('click', '.alopexgrid-treecolumn-icon', function(e){
        	 var data = AlopexGrid.currentData(AlopexGrid.parseEvent(e).data);
//        	 aa(data);
        	 var aa = AlopexGrid.parseEvent(e).data._state.expandedTreeNode;
        	 $('#'+copygridId).alopexGrid('dataAdd', data, {});
        	 if(aa){
        		 $('#'+gridIdDistance).alopexGrid('hideProgress');
//        		 $('#'+gridIdDistance).alopexGrid('hideCol', 'repIntgFcltsCd', 'conceal');
//        		 alert(aa);
        		 $('#dataGrid').alopexGrid("hideCol", 'intgFcltsCd', 'conceal');
//        		 $('#dataGrid').alopexGrid("hideCol", 'shrRepFcltsCd', 'conceal');
//        		 $('#dataGrid').alopexGrid("hideCol", 'shrRepDivNm', 'conceal');
        	 }else{
        		 $('#'+gridIdDistance).alopexGrid('showProgress');
//        		 $('#'+gridIdDistance).alopexGrid('showCol', 'repIntgFcltsCd');
//        		 alert(aa);
        		 $('#dataGrid').alopexGrid('showCol', 'intgFcltsCd');
//        		 $('#dataGrid').alopexGrid('showCol', 'shrRepFcltsCd');
//        		 $('#dataGrid').alopexGrid('showCol', 'shrRepDivNm');
        	 }
         });*/

//         $('#'+gridId).on('click', '.expanded', function(e){
//        	 alert("b");
////        	 $('#'+gridId).alopexGrid("hideCol", 'intgFcltsCd', 'conceal');
////        	 $('#'+gridId).alopexGrid("hideCol", 'shrRepFcltsCd', 'conceal');
////        	 $('#'+gridId).alopexGrid("hideCol", 'shrRepDivNm', 'conceal');
//         });

         $('#'+gridId).on('scrollBottom', function(e){
        	var nFistRowIndex = parseInt($('#firstRowIndex').val())+100;
 			var nLastRowIndex = parseInt($('#lastRowIndex').val())+100;

 			if(totalCnt > nFistRowIndex){
	 			$('#firstRowIndex').val(nFistRowIndex);
	 			$('#lastRowIndex').val(nLastRowIndex);

	     		var param =  $("#searchForm").serialize();

	     		if($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != ""){
	    			$.each($("#mtsoTypCdList").val(), function(key, value) {
	    				param += '&' + "mtsoTypCdList1" + '=' + value;
	    			});
	    		}

		   		$('#'+gridId).alopexGrid('showProgress');
		   		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsosDemd', param, 'GET', 'searchPageAdd');
 			}
     	});

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

    		 var op = $('#'+gridId).alopexGrid('readOption');

    		 if(mgmtGrpNm == "SKT"){
    			 $('#mtsoAbbrNmLabel').html("국사약어명") ;
    			 op.columnMapping[8].title = "국사약어명" ;
    		 }else{
    			 $('#mtsoAbbrNmLabel').html("GIS국사명") ;
    			 op.columnMapping[8].title = "GIS국사명" ;
    		 }

    		 $('#'+gridId).alopexGrid('updateOption', {
      			  columnMapping: op.columnMapping
      		});

    		 var option_data =  null;
 			if($('#mgmtGrpNm').val() == "SKT"){
 				option_data =  [{comCd: "1",comCdNm: "전송실"},
 								{comCd: "2",comCdNm: "중심국사"},
 								{comCd: "3",comCdNm: "기지국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}else{
 				option_data =  [{comCd: "1",comCdNm: "정보센터"},
 								{comCd: "2",comCdNm: "국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}
 			$('#mtsoTypCdList').setData({
                 data:option_data
 			});

         });

    	//본부 선택시 이벤트
    	 $('#orgId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();

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
    	 $('#teamId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#teamId").getData();

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

    	//엑셀다운
    	 $('#btnDistanceExportExcel').on('click', function(e) {
       		//tango transmission biz 모듈을 호출하여야한다.
    		 var param = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}}));
       	 	 param[0].distanceM = $('#distanceM').val();

       		 param[0] = gridExcelColumn(param[0], 'dataGridDistance');
       		 param[0].pageNo = 1;
       		 param[0].rowPerPage = 10;
       		 param[0].firstRowIndex = 1;
       		 param[0].lastRowIndex = 1000000000;

       		 param[0].fileName = "국사수요관리_반경"; /* 국사관리 */
       		 param[0].fileExtension = "xlsx";
       		 param[0].excelPageDown = "N";
       		 param[0].excelUpload = "N";
       		 param[0].method = "getMtsoDistanceList";
       		 $('#'+gridIdDistance).alopexGrid('showProgress');
    	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/excelcreate', param[0], 'GET', 'excelDownload');
         });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
	            btnExportExcelOnDemandClickEventHandler(e);
	     });

    	//첫번째 row를 클릭했을때 이벤트 발생
    	 $('#'+gridId).on('click', '.bodycell', function(e){
    		 var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;
      	 	dataObj.distanceM = $('#distanceM').val();


      	 	$('#'+gridIdDistance).alopexGrid('showProgress');
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoDistance', dataObj, 'GET', 'searchDistance');

    	 });

    	//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
    	 $('#'+gridIdDistance).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;
      	 	var param = {"fromMtsoDemd":"Y", "mtsoId":dataObj.mtsoId};
      	 	/* 국사 상세정보 */
    	 	popup2('MtsoDtlLkup', $('#ctx').val()+'/configmgmt/common/MtsoDtlLkup.do', '국사 상세정보',param);

    	 });

	};

	/*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(event){

        var param =  $("#searchForm").getData();

//        if($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != ""){
//			param.mtsoTypCdList1 = param.mtsoTypCdList;
//		}

   		param = gridExcelColumn(param, gridId);
   		param.pageNo = 1;
   		param.rowPerPage = 60;
   		param.firstRowIndex = 1;
   		param.lastRowIndex = 1000000000;
   		param.inUserId = $('#sessionUserId').val();
   		if ($("#mtsoTypCdList").val() != "" && $("#mtsoTypCdList").val() != null ){
   			param.mtsoTypCdList = $("#mtsoTypCdList").val();
   			param.mtsoTypCdList1 = $("#mtsoTypCdList").val();
   		 }else{
   			var tmp = [];
   			param.mtsoTypCdList = tmp;
   			param.mtsoTypCdList1 = tmp;
   		 }


   		/* 엑셀정보     	 */
   	    var now = new Date();
        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
        var excelFileNm = 'Mobile_Telecom_Switching_Office_Demand_Management_'+dayTime;
   		param.fileName = excelFileNm;
   		param.fileExtension = "xlsx";
   		param.excelPageDown = "N";
   		param.excelUpload = "N";
   		param.excelMethod = "getMtsoDemdMgmtList";
   		param.excelFlag = "MtsoDemdList";
   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
        fileOnDemendName = excelFileNm+".xlsx";
		    console.log("aaa");
		 	$('#'+gridId).alopexGrid('showProgress');
		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
    }

	function aa(data){
		var aa = data._state.expandedTreeNode;
   	 if(aa == "true"){
   		 $('#dataGrid').alopexGrid("hideCol", 'intgFcltsCd', 'conceal');
   		 $('#dataGrid').alopexGrid("hideCol", 'shrRepFcltsCd', 'conceal');
   		 $('#dataGrid').alopexGrid("hideCol", 'shrRepDivNm', 'conceal');
   	 }else{
   		 $('#dataGrid').alopexGrid('showCol', 'intgFcltsCd');
   		 $('#dataGrid').alopexGrid('showCol', 'shrRepFcltsCd');
   		 $('#dataGrid').alopexGrid('showCol', 'shrRepDivNm');
   	 }
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
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
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
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
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
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
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

    	// 전송실
    	if(flag == 'tmof'){
    		$('#tmof').clear();

    		var option_data = [{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['all']}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#tmof').setData({
                 data:option_data
    		});
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

			var option_data =  null;
			if($('#mgmtGrpNm').val() == "SKT"){
				option_data =  [{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				option_data =  [{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCdList').setData({
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

    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
//    		setSPGrid(gridId,response, response.mtsoMgmtList);
    		$('#'+gridId).alopexGrid('dataSet', response.mtsoDemdMgmtList);
    		$('#'+gridId).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return '총 건수 : ' + response.totalCnt;
					}}}
			);
    		totalCnt = response.totalCnt;
    	}

    	if(flag == 'searchPageAdd'){
    		$('#'+gridId).alopexGrid('hideProgress');
			if(response.mtsoDemdMgmtList.length <= 0){
				return false;
			}else{
	    		$('#'+gridId).alopexGrid("dataAdd", response.mtsoDemdMgmtList);
	    		$('#'+gridId).alopexGrid('updateOption',
						{paging : {pagerTotal: function(paging) {
							return '총 건수 : ' + response.totalCnt;
						}}}
				);
			}
    	}

    	if(flag == 'searchDistance'){
    		$('#'+gridIdDistance).alopexGrid('hideProgress');
    		$('#'+gridIdDistance).alopexGrid('dataSet', response.mtsoDistanceList);
    	}

    	if(flag == 'excelDownload'){
    		$('#'+gridIdDistance).alopexGrid('hideProgress');
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

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['orgId', 'teamId', 'mgmtGrpCd', 'mgmtGrpNM', 'bldblkNo', 'bldFlorNo', 'mtsoLatVal', 'mtsoLngVal'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

    	var distanceHideColList = ['mtsoId'];
    	$('#'+gridIdDistance).alopexGrid("hideCol", distanceHideColList, 'conceal');

	}

    this.setGrid = function(){

    	$("#firstRowIndex").val(1);
     	$("#lastRowIndex").val(100);

    	var param =  $("#searchForm").serialize();

    	if($("#mtsoTypCdList").val() != null && $("#mtsoTypCdList").val() != ""){
			$.each($("#mtsoTypCdList").val(), function(key, value) {
				param += '&' + "mtsoTypCdList1" + '=' + value;
			});
		}

    	$('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsosDemd', param, 'GET', 'search');
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
                  iframe: true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9

              });
        }



    function popup2(pidData, urlData, titleData, paramData) {

    	$a.popup({
				  	popid: pidData,
				  	title: titleData,
				      url: urlData,
				      data: paramData,
				      iframe: false,
				      modal: true,
				      movable:true,
				      width : 865,
				      height : window.innerHeight * 0.70
				  });
		}

    /*
    var httpRequest = function(Url, Param, Method, Flag ) {
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

//    function setSPGrid(GridID,Option,Data) {
//		var serverPageinfo = {
//	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
//	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
//	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
//	      	};
//	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
//
//	}

});