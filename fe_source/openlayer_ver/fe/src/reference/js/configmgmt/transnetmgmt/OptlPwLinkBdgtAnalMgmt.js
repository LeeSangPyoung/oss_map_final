/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var main = $a.page(function() {

	var gridId = 'dataGrid';
	var fileOnDemendName = "";

	$a.keyfilter.addKeyUpRegexpRule('numberRule', /^[1-9](\d{0,6}([.]\d{0,3})?)|[0-9]([.]\d{0,3})?$/);

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
			headerGroup: [
				{fromIndex:1, toIndex:4, title:'공통'},
				{fromIndex:5, toIndex:8, title:'감쇄항목'},
				{fromIndex:9, toIndex:10, title:'측정값(dB)'},
				{fromIndex:11, toIndex:14, title:'Link Budget(dB)'}
			],
    		columnMapping: [{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
    		}, {/* 링ID            */
				key : 'ntwkLineNo', align:'center',
				title : '링ID',
				width: '110px'
			}, {/* 링명			 */
				key : 'ntwkLineNm', align:'center',
				title : '링명',
				width: '180px'
			}, {/* 공급방식		 */
				key : 'topoSclNm', align:'center',
				title : '공급방식',
				width: '100px'
			}, {/* 제조사	 */
				key : 'bpNm', align:'center',
				title : '제조사',
				width: '100px'
			},{/* FDF(패치포함)	 */
				key : 'fdfCnt', align:'center',
				title : 'FDF(패치포함)',
				width: '120px'
			}, {/* 접속함체			 */
				key : 'cbntCnt', align:'center',
				title : '접속함체',
				width: '80px'
			},{/* 케이블 거리(m) 		 */
				key : 'cblDistm', align:'center',
				title : '케이블 거리(m) ',
				width: '150px'
			}, {/* MRN		 */
				key : 'mrnCnt', align:'center',
				title : 'MRN',
				width: '80px'
			},{/* 송신Power    */
				key : 'txpwrVal', align:'center',
				title : '송신Power',
				width: '80px'
			},{/* 수신Power    */
				key : 'rxpwrVal', align:'center',
				title : '수신Power',
				width: '80px'
			}, {/* 예상 Loss		 */
				key : 'exptVal', align:'center',
				title : '예상 Loss',
				width: '100px'
			},{/* 측정 Loss		 */
				key : 'realVal', align:'center',
				title : '측정 Loss',
				width: '80px'
			}, {/* Loss 차이		 */
				key : 'gapVal', align:'center',
				title : 'Loss 차이',
				width: '100px'
			}, {/* 상태		 */
				key : 'gapStat', align:'center',
				title : '상태',
				width: '90px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

//        gridHide();

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
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
		//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');

		//알람등급 조회 (임시)
		$('#gapStatList').clear();

		var option_data = [];

		var option_critical = {value: "CRITICAL", text: "CRITICAL"};
		var option_major = {value: "MAJOR", text: "MAJOR"};
		var option_minor = {value: "MINOR", text: "MINOR"};
		var option_normal = {value: "NORMAL", text: "NORMAL"};

		option_data.push(option_critical);
		option_data.push(option_major);
		option_data.push(option_minor);
		option_data.push(option_normal);

		$('#gapStatList').setData({
             data:option_data
		});
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

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

    		 var op = $('#'+gridId).alopexGrid('readOption');

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

    	 $('#opTeamOrgId').on('change', function(e) {

    		 var orgID =  $("#opTeamOrgId").getData();
    		 if(orgID.opTeamOrgId == ''){
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPost');

    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/' + orgID.opTeamOrgId+'/D', null, 'GET', 'opPost');
    		 }
         });

     	//첫번째 row를 클릭했을때 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;

//      	 	$('#'+gridId).alopexGrid('showProgress');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/RingInfoPop.do', dataObj, 'GET', '');
        	var sFlag = gridId == "dataGrid"? "N" : "Y";
        	var url = $('#ctx').val()+'/configmgmt/cfline/RingInfoPop.do';
        	$a.popup({
        		popid: "RingEditPop",
    		  	title: '링 선번조회' /*링 선번조회*/,
    		  	url: url,
    		    data: {"gridId":gridId, "ntwkLineNo":dataObj.ntwkLineNo, "sFlag":sFlag, "topoLclCd":'001', "topoSclCd":'036'},
    		    iframe: true,
    		    modal: false,
    		    movable:true,
    		    windowpopup : true,
    		    width : 1400,
//    		    height : window.innerHeight * 0.85
//    		    height : 940,
    		    height : 780,
     		    callback:function(data){
     		    	// setGrid(1,pageForCount,"All");
     		    }
        	});

    	 });

    	//엑셀다운
    	 $('#btnExportExcel').on('click', function(e) {
       		//tango transmission biz 모듈을 호출하여야한다.

       		 var param =  $("#searchForm").getData();
       		 param = gridExcelColumn(param, gridId);
       		 param.pageNo = 1;
       		 param.rowPerPage = 10;
       		 param.firstRowIndex = 1;
       		 param.lastRowIndex = 1000000000;
       		 param.fileName = '광PowerLinkBudgetAnalysisMgmt'; /* 국사관리 */
       		 param.fileExtension = "xlsx";
       		 param.excelPageDown = "N";
       		 param.excelUpload = "N";
       		 param.method = "getOptlPwLinkBdgtAnalMgmtList";

 			var tmofList_Tmp = "";
			var gapStatList_Tmp = "";
			if (param.tmofList != "" && param.tmofList != null ){
	   			 for(var i=0; i<param.tmofList.length; i++) {
	   				 if(i == param.tmofList.length - 1){
	   					tmofList_Tmp += param.tmofList[i];
	                    }else{
	                    	tmofList_Tmp += param.tmofList[i] + ",";
	                    }
	    			}
	   			param.tmofList = tmofList_Tmp ;
	   		 }


			if (param.gapStatList != "" && param.gapStatList != null ){
	   			 for(var i=0; i<param.gapStatList.length; i++) {
	   				 if(i == param.gapStatList.length - 1){
	   					gapStatList_Tmp += param.gapStatList[i];
	                    }else{
	                    	gapStatList_Tmp += param.gapStatList[i] + ",";
	                    }
	    			}
	   			param.gapStatList = gapStatList_Tmp ;
	   		 }

       		 $('#'+gridId).alopexGrid('showProgress');
    	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/transnetmgmt/excelcreate', param, 'GET', 'excelDownload');
         });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
	            btnExportExcelOnDemandClickEventHandler(e);
	        });

	};

	/*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        var param =  $("#searchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();
	   		if ($("#mtsoTypCdList").val() != "" && $("#mtsoTypCdList").val() != null ){
       			param.mtsoTypCdList = $("#mtsoTypCdList").val() ;
       		 }else{
       			param.mtsoTypCdList = [];
       		 }

	   		if ($("#mtsoCntrTypCdList").val() != "" && $("#mtsoCntrTypCdList").val() != null ){
       			param.mtsoCntrTypCdList = $("#mtsoCntrTypCdList").val() ;
       		 }else{
       			param.mtsoCntrTypCdList = [];
       		 }

	   		if ($("#tmofList").val() != "" && $("#tmofList").val() != null ){
       			param.tmofList = $("#tmofList").val() ;
       		 }else{
       			param.tmofList = [];
       		 }

	   		 var bldChk = "" ;
	       	 if ($("input:checkbox[id='bldChk']").is(":checked") ){
	       		bldChk = "Y";
	       	 }

	       	 param.bldChk = bldChk;

	       	 var mtsoChk = "" ;
        	 if ($("input:checkbox[id='mtsoChk']").is(":checked") ){
        		 mtsoChk = "Y";
        	 }

        	 param.mtsoChk = mtsoChk;

	   		/* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = 'Mobile_Telecom_Switching_Office_Information_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getMtsoMgmtList";
	   		param.excelFlag = "MtsoList";
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
    		$('#tmofList').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#tmofList').setData({
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
    		var option_data = [];
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == 'SKT'){
						option_data.push(resObj);
					}
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCdNm;
						break;
					}
				}
				$('#mgmtGrpNm').setData({
					data:option_data ,
					mgmtGrpNm:selectId
				});
			}

			option_data =  null;
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

    	if(flag == 'opTeam'){
    		$('#opTeamOrgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#opTeamOrgId').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'opPost'){
    		$('#opPostOrgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#opPostOrgId').setData({
                 data:option_data
    		});
    	}

    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId,response, response.optlPwLinkBdgtAnalMgmtList);
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

		if(flag == 'bp'){
			$('#bpId').clear();
			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				if (resObj.comCd == 'BP0003733' || resObj.comCd == 'BP0004395' || resObj.comCd == 'BP0004419' || resObj.comCd == 'BP0004445'){
					option_data.push(resObj);
				}
			}
			$('#bpId').setData({
	             data:option_data
			});
		}

    	// 전송실
    	if(flag == 'gapStatList'){
    		$('#gapStatList').clear();

    		var option_data = [];

    		var option_critical = {value: "CRITICAL", text: "Critical"};
    		var option_major = {value: "MAJOR", text: "Major"};
    		var option_minor = {value: "MINOR", text: "Minor"};
    		var option_normal = {value: "NORMAL", text: "Normal"};

    		option_data.push(option_critical);
    		option_data.push(option_major);
    		option_data.push(option_minor);
    		option_data.push(option_normal);
//    		for(var i=0; i<response.length; i++){
//    			var resObj = response[i];
//    			option_data.push(resObj);
//
//    		}

    		$('#gapStatList').setData({
                 data:option_data
    		});
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
//    	var hideColList = ['tmof', 'orgId', 'teamId', 'mgmtGrpCd', 'mgmtGrpNM', 'bldblkNo', 'bldFlorNo', 'mtsoLatVal', 'mtsoLngVal', 'cifTakeAprvStatCd', 'cifTakeRlesStatCd','instlLocCd'];
//    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").serialize();

 		 $.each($('form input[type=checkbox]')
        		.filter(function(idx){
        			return $(this).prop('checked') === false
        		}),
        		function(idx, el){
        	var emptyVal = "";
        	param += '&' + $(el).attr('name') + '=' + emptyVal;
	   	 });

 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/transnetmgmt/optlPwLinkBdgtAnalMgmtList', param, 'GET', 'search');
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
				      height : window.innerHeight * 0.8
				  });
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

    this.aa = function(page, rowPerPage){
    	alert("chrrOrgGrpCd="+$("#chrrOrgGrpCd").val()+", UprOrgId="+$("#sUprOrgId").val()+", OrgId="+$("#sOrgId").val()+", chrrOrgId="+$("#chrrOrgId").val()+", "+$("#userInfo").val());
    }
});