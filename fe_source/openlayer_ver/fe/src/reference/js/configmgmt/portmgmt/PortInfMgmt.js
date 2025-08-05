/**
 * PortMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;
	var fileOnDemendName = "";

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();

        if (! jQuery.isEmptyObject(param) ) {
        	main.setGrid(1,10);
        }
    };

    function setRegDataSet(data) {

    	$('#contentArea').setData(data);
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
				key : 'orgId', align:'center',
				title : 'orgId',
				width: '70px'
    		}, {
				key : 'teamId', align:'center',
				title : 'teamId',
				width: '70px'
    		}, {
				key : 'tmof', align:'center',
				title : 'tmof',
				width: '70px'
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '150px'
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
			},{
				key : 'eqpMdlNm', align:'center',
				title : '장비모델명',
				width: '100px'
			}, {
				key : 'eqpInstlMtsoId', align:'center',
				title : '국사ID',
				width: '100px'
			}, {
				key : 'eqpInstlMtsoNm', align:'center',
				title : '국사명',
				width: '200px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '100px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '200px'
			}, {
				key : 'portIdxNo', align:'center',
				title : '포트Index',
				width: '100px'
			}, {
				key : 'portId', align:'center',
				title : '포트ID',
				width: '100px'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '200px'
			}, {
				key : 'portAlsNm', align:'center',
				title : '포트별칭명',
				width: '200px'
			}, {
				key : 'portOpStatNm', align:'center',
				title : '포트운용상태',
				width: '100px'
			}, {
                key : 'stndRackNo', align:'center',   // stndRackNo ... stndPortNo 추가 [20171121]
                title : 'RaNo',
                width: '28px'
            }, {
                key : 'stndShelfNo', align:'center',
                title : 'ShNo',
                width: '28px'
            }, {
                key : 'stndSlotNo', align:'center',
                title : 'SlNo',
                width: '28px'
            }, {
                key : 'stndSubSlotNo', align:'center',
                title : 'SuNo',
                width: '28px'
            }, {
                key : 'stndPortNo', align:'center',
                title : 'PoNo',
                width: '28px'
            }, {
				key : 'crsLnkgYn', align:'center',
				title : 'CRS연동여부',
				width: '100px'
			}, {
				key : 'crsPathNm', align:'center',
				title : 'CRS경로명',
				width: '200px'
			}, {
				key : 'crsChgDate', align:'center',
				title : 'CRS변경일자',
				width: '100px'
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트IP',
				width: '100px'
			}, {
				key : 'portTypCd', align:'center',
				title : '포트유형코드',
				width: '100px'
			}, {
				key : 'portTypNm', align:'center',
				title : '포트유형',
				width: '100px'
			}, {
				key : 'portStatCd', align:'center',
				title : '포트상태코드',
				width: '100px'
			}, {
				key : 'portStatNm', align:'center',
				title : '포트상태',
				width: '100px'
			}, {
				key : 'dumyPortYn', align:'center',
				title : 'DUMMY여부',
				width: '100px'
			},{
				key : 'portCapaCd', align:'center',
				title : '포트용량코드',
				width: '100px'
			},{
				key : 'portCapaNm', align:'center',
				title : '포트용량',
				width: '100px'
			},{//숨김 데이터
				key : 'lgcPortYn', align:'center',
				title : '논리포트여부',
				width: '100px'
			},{
				key : 'srsPortYn', align:'center',
				title : '중요포트여부',
				width: '100px'
			},{
				key : 'autoMgmtYn', align:'center',
				title : '자동관리여부',
				width: '100px'
			},{
				key : 'upLinkPortYn', align:'center',
				title : 'UP링크포트여부',
				width: '100px'
			},{
				key : 'dplxgMeansDivCd', align:'center',
				title : '이중화방식코드',
				width: '100px'
			},{
				key : 'dplxgMeansDivNm', align:'center',
				title : '이중화방식',
				width: '100px'
			},{
				key : 'dplxgPortYn', align:'center',
				title : '이중화여부',
				width: '100px'
			},{
				key : 'portMacNo', align:'center',
				title : '포트MAC',
				width: '100px'
			},{
				key : 'portGwIpAddr', align:'center',
				title : '포트게이트웨이',
				width: '100px'
			},{
				key : 'portSrvcDivCd', align:'center',
				title : '포트서비스구분코드',
				width: '100px'
			},{
				key : 'portSrvcDivNm', align:'center',
				title : '포트서비스구분',
				width: '100px'
			},{
				key : 'portSbntIpAddr', align:'center',
				title : '포트서브넷',
				width: '100px'
			},{
				key : 'termlEqpNm', align:'center',
				title : '종속단장비명',
				width: '150px'
			},{
				key : 'portDesc', align:'center',
				title : '포트설명',
				width: '100px'
			},{
				key : 'portRmk', align:'center',
				title : '포트비고',
				width: '100px'
			},{
				key : 'edgYn', align:'center',
				title : '말단여부',
				width: '100px'
			},{
				key : 'chnlVal', align:'center',
				title : '채널값',
				width: '100px'
			},{
				key : 'wavlVal', align:'center',
				title : '파장값',
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
			},{
				key : 'cardId', align:'center',
				title : '카드ID',
				width: '100px'
			},{
				key : 'cardNm', align:'center',
				title : '카드명',
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
    	//포트 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00101', null, 'GET', 'portStatCd');
    	//포트 유형 코드 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00028', null, 'GET', 'portTypCd');
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

	    	 if (param.eqpRoleDivCd == "") {
	     		//필수 선택 항목입니다.[ 포트명 ]
	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 장비타입 "), function(msgId, msgRst){});
	     		return;
	     	 }

     		 main.setGrid(1,perPage);
          });

     	//엔터키로 조회
          $('#searchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			var param =  $("#searchForm").getData();

    	    	 if (param.eqpRoleDivCd == "") {
    	     		//필수 선택 항목입니다.[ 포트명 ]
    	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 장비타입 "), function(msgId, msgRst){});
    	     		return;
    	     	 }

      			main.setGrid(1,perPage);
        	}
      	 });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

//    		 if (mgmtGrpNm == 'SKB')
//    			 $('#btnRegCard').hide();
//    		 else
//    			 $('#btnRegCard').show();

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

     		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
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

       /*//대분류 선택시 이벤트
    	 $('#lcl').on('change', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var codeID =  $("#lcl").getData();

    		 if(codeID.lcl == ''){
    			 $('#mcl').setData({
    	             data:[{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}]
        		});

    			 $('#scl').setData({
    				 data:[{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}]
    			});

    			 $('#eqpMdlId').setData({
    				 data:[{comCd: "", comCdNm: "전체"}]
    			});

    		 }else {
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00289/'+codeID.lcl, null,'GET', 'mcl');
    		 }
         });

    	//중분류 선택시 이벤트
    	 $('#mcl').on('change', function(e) {
    		 var codeID =  $("#mcl").getData();

    		 if(codeID.mcl == ''){
    			 $('#scl').setData({
    	             data:[{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}]
        		});
    		 }else {
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00184/'+codeID.mcl, null,'GET', 'scl');
    		 }
         });

    	//소분류 선택시 이벤트
    	 $('#scl').on('change', function(e) {
    		 var codeID =  $("#scl").getData();

    		 if(codeID.scl == ''){
    			 $('#eqpMdlId').setData({
    	             data:[{comCd: "", comCdNm: "전체"}]
        		});
    		 }else {
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl/'+codeID.scl, null,'GET', 'mdl');
    		 }
         });*/

     	 //카드등록
     	$('#btnRegCard').on('click', function(e) {
   		 dataParam = {"regYnCard" : "N"};
//    		 popup('CardReg', $('#ctx').val()+'/configmgmt/shpmgmt/CardReg.do', '형상 Card 등록', dataParam);
    		 $a.popup({
             	popid: 'CardReg',
             	title: '형상 Card 등록',
                 url: $('#ctx').val()+'/configmgmt/shpmgmt/CardReg.do',
                 data: dataParam,
                 iframe: false,
                 modal: true,
                 movable:true,
                 width : 865,
                 height : window.innerHeight * 0.85
             });
         });

    	//등록
    	 $('#btnReg').on('click', function(e) {
    		 dataParam = {"regYn" : "N"};
    		 popup('PortReg', $('#ctx').val()+'/configmgmt/portmgmt/PortReg.do', '포트 등록', dataParam);
         });

    	//엑셀다운
    	 $('#btnExportExcel').on('click', function(e) {
    		 var param =  $("#searchForm").getData();

    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 10;
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;

    		 var dumyPortYn = "N" ;
         	 if ($("input:checkbox[id='dumyPortYn']").is(":checked") ){
         		dumyPortYn = "Y";
         	 }

         	 param.dumyPortYn = dumyPortYn;

    		 param.fileName = "포트정보";
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getPortInfMgmtList";

    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/excelcreate', param, 'GET', 'excelDownload');
         });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
	    		 var param =  $("#searchForm").getData();

		    	 if (param.eqpRoleDivCd == "") {
		     		//필수 선택 항목입니다.[ 포트명 ]
		     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 장비타입 "), function(msgId, msgRst){});
		     		return;
		     	 }

	            btnExportExcelOnDemandClickEventHandler(e);
	        });

    	 //첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
    	 	popup('PortDtlLkup', $('#ctx').val()+'/configmgmt/portmgmt/PortDtlLkup.do', '포트상세정보',dataObj);

    	 });

	};

	/*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //포트조회조건세팅
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
	        var excelFileNm = 'Port_Information_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getPortInfMgmtList";
	   		param.excelFlag = "PortInfMgmt";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
  		    console.log("aaa");
  		 	$('#'+gridId).alopexGrid('showProgress');
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

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

    	/*if(flag == 'lcl'){
			$('#lcl').clear();
			$('#mcl').clear();
			$('#scl').clear();
			$('#eqpMdlId').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];

			$('#mcl').setData({
	             data:option_data
			});

			$('#scl').setData({
				data:option_data
			});

			$('#eqpMdlId').setData({
				 data:[{comCd: "", comCdNm: "전체"}]
			});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#lcl').setData({
	             data:option_data
			});
		}

		if(flag == 'mcl'){
			$('#mcl').clear();
			$('#scl').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mcl').setData({
	             data:option_data
			});

			$('#scl').setData({
				 data:[{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}]
			});
		}

		if(flag == 'scl'){
			$('#scl').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#scl').setData({
	             data:option_data
			});
		}*/

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
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "선택", useYn: ""}];

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

    	if(flag == 'portStatCd'){
    		$('#portStatCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#portStatCd').setData({
                 data:option_data
    		});
    	}

        if(flag == 'portTypCd'){

    		$('#portTypCd').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: "전체", useYn: ""}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		if(paramData == '' || paramData == null) {
    			$('#portTypCd').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#portTypCd').setData({
    	             data:option_data,
    	             portTypCd:paramData.portTypCd
    			});
    		}
    	}

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');
    			setSPGrid(gridId, response, response.portMgmtList);
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

    	var hideColList = ['orgId', 'teamId', 'tmof', 'eqpRoleDivCd', 'bpId', 'eqpInstlMtsoId', 'eqpMdlId', 'eqpId', 'portId', 'portTypCd', 'portStatCd', 'portCapaCd',
    	                   'dplxgMeansDivCd', 'portSrvcDivCd', 'portSrvcDivNm', 'cardId', 'cardNm'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	 $('#pageNo').val(page);
    	 $('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();

		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/portmgmt/portMgmt', param, 'GET', 'search');
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
                  height : window.innerHeight * 0.9
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