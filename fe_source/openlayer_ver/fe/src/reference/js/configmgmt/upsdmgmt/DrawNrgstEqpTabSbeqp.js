var TabSbeqp = $a.page(function() {
	var gridId = 'sbeqpGrid';
	var paramData = null;

    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();

    	 if(param.mtsoNm !="" ){
     		paramData = param;
     	}
        $('#tab_sbeqp').addClass("Selected");
        $('#tab_eqp').removeClass("Selected");
    };

    function setList(param){
    	if(JSON.stringify(param).length > 2){
//        	$('#sbeqpLkupArea').setData(param);
    		$('#mgmtGrpNm').val(param.mgmtGrpNm);
    		$('#mtsoNm').val(param.mtsoNm);
    		$('#mtsoId').val(param.mtsoId);
        	$('#pageNo').val(1);
        	$('#rowPerPage').val(100);

        	paramData = param;
        	var param =  $("#searchFormSbeqpTab").getData();
        	param.mtsoNm = paramData.mtsoNm;
        	param.mtsoId = paramData.mtsoId;
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getNrgstSbeqpList', param, 'GET', 'search');
        }


    }
    //그리드 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height: 320,
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
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'sbeqpClCd', align:'center',
				title : '장비타입',
				width: '100px',
				render: function(value){
					if(value != null && value != '') {
						if(value == 'R'){
							return '정류기';
						}else if(value=='B'){
							return '축전지';
						}else if(value=='A'){
							return '냉방기';
						}else if(value=='F'){
							return '소화설비';
						}else if(value=='N'){
							return '발전기';
						}else if(value=='L'){
							return '분전반';
						}else if(value=='M'){
							return '정류기 모듈';
						}else if(value=='P'){
							return 'IPD';
						}else if(value=='G'){
							return '계량기함';
						}else if(value=='S'){
							return '배풍기';
						}else if(value=='C'){
							return '컨버터';
						}else if(value=='I'){
							return '인버터';
						}else if(value=='T'){
							return 'TVSS(SPD)';
						}else if(value=='E'){
							return '기타 장비';
						}else if(value=='' || value==null){
							return '';
						}
					}
				}
			},  {/* 제조사		 */
				key : 'sbeqpVendNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			},{/* 부대장비모델ID		 */
				key : 'sbeqpMdlId', align:'center',
				title : '부대장비모델ID',
				width: '100px'
			}, {/* 부대장비모델명   	 */
				key : 'sbeqpMdlNm', align:'center',
				title : '부대장비모델명',
				width: '120px'
			}, {/* 국사명		 */
				key : 'sbeqpInstlMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '180px'
			}, {/* 국사ID */
				key : 'sbeqpInstlMtsoId', align:'center',
				title : '국사ID',
				width: '100px'
			}, {/* 부대장비명       	 */
				key : 'sbeqpNm', align:'center',
				title : '부대장비명',
				width: '180px'
			}, {/* 부대장비ID */
				key : 'sbeqpId', align:'center',
				title : '부대장비ID',
				width: '100px'
			},{/* RMS ID		 */
				key : 'sbeqpRmsId', align:'center',
				title : 'RMS ID',
				width: '100px'
			},{/* 통시코드		 */
				key : 'intgFcltsCd', align:'center',
				title : '통시코드',
				width: '100px'
			},{/* 바코드 		 */
				key : 'barNo', align:'center',
				title : configMsgArray['barcode'],
				width: '100px'
			},{/* 관리팀		 */
				key : 'jrdtTeamOrgNm', align:'center',
				title : configMsgArray['managementTeam'],
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
			},{/* 부대장비분류명		 */
				key : 'sbeqpClNm', align:'center',
				title : '부대장비분류명',
				width: '100px'
			},{/* 부대장비운용상태명		 */
				key : 'sbeqpOpStatNm', align:'center',
				title : '부대장비운용상태명',
				width: '100px'
			},{/* 관리팀ID		 */
				key : 'jrdtTeamOrgId', align:'center',
				title : '관리팀ID',
				width: '100px'
			},{/* 국사유형코드		 */
				key : 'mtsoTypCd', align:'center',
				title : '국사유형코드',
				width: '100px'
			},{/* 국사유형명		 */
				key : 'mtsoTyp', align:'center',
				title : '국사유형명',
				width: '100px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['sbeqpClNm', 'sbeqpOpStatNm', 'jrdtTeamOrgId','mtsoTypCd', 'mtsoTyp'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
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
	 }else{
		 $("#sktMtso").hide();
		 $("#skbMtso").show();
		 $('#intgFcltsCd').setEnabled(false);
	 }

	 var param = {"mgmtGrpNm": mgmtGrpCd};

	//관리그룹 조회
    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
	 //본부 조회
//	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpCd, null, 'GET', 'fstOrg');
	//부대장비 분류 코드 조회
	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02406', null, 'GET', 'sbeqpClCd');
    };

    function setEventListener() {
    	var perPage = 100;

     	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	TabSbeqp.setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	TabSbeqp.setGrid(1, eObj.perPage);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 TabSbeqp.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchFormSbeqpTab').on('keydown', function(e){
     		if (e.which == 13  ){
     			TabSbeqp.setGrid(1,perPage);
       		}
     	 });

//         $(window).bind("beforeunload",function(e){
////    		 var dataObj = AlopexGrid.parseEvent(e).data;
//    		 var dataObj = [{endFlag : "Y"}];
//    		 $a.close(dataObj);
//    	 });

		//관리그룹 선택시 이벤트
		$('#mgmtGrpNm').on('change', function(e) {

			var mgmtGrpNm = $("#mgmtGrpNm").val();

			if(mgmtGrpNm == "SKT"){
				$("#sktMtso").show();
				$("#skbMtso").hide();
				$('#intgFcltsCd').setEnabled(true);
			}else{
				$("#sktMtso").hide();
				$("#skbMtso").show();
				$('#intgFcltsCd').setEnabled(false);
			}

			var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
			//장비모델 조회
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
			//제조사 조회
//			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
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

		$('#btnExportExcel').on('click', function(e) {
			//tango transmission biz 모듈을 호출하여야한다.
			var param =  $("#searchFormSbeqpTab").getData();

			param = gridExcelColumn(param, gridId);
			param.pageNo = 1;
			param.rowPerPage = 10;
			param.firstRowIndex = 1;
			param.lastRowIndex = 1000000000;

			param.fdfChk = fdfChk;

			/* 장비정보     	 */
			param.fileName = '부대장비정보';
			param.fileExtension = "xlsx";
			param.excelPageDown = "N";
			param.excelUpload = "N";
			param.method = "getSbeqpInfMgmtList";

			$('#'+gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/excelcreate', param, 'GET', 'excelDownload');
		});

		//첫번째 row를 클릭했을때 팝업 이벤트 발생
		$('#'+gridId).on('click', '.bodycell', function(e){
			$('#regInfArea').formReset();
			regInf.resetComboBox();
			var dataObj = AlopexGrid.parseEvent(e).data;
			paramEqpId = {eqpId:dataObj.sbeqpId};
			$('#regInfEqpId').val(dataObj.sbeqpId);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getEqpInstlMtsoInf', paramEqpId, 'GET', 'eqpInstlMtsoInf');
		});

 		$('#basicTabs').on("tabchange", function(e, index) {
 			switch (index) {
 			case 0 :
 	    		$('#regInfArea').formReset();
 	    		regInf.resetComboBox();
 				$a.navigate('/tango-transmission-web/configmgmt/upsdmgmt/DrawNrgstEqpTabEqp.do', paramData, '_blank');
 				break;
 			default :
 				break;
 			}
		});
    };

	function successCallback(response, status, jqxhr, flag){

		//관리그룹
//    	if(flag == 'mgmtGrpNm'){
//
//    		var chrrOrgGrpCd;
//			 if($("#chrrOrgGrpCd").val() == ""){
//				 chrrOrgGrpCd = "SKT";
//			 }else{
//				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
//			 }
//
//    		$('#mgmtGrpNm').clear();
//
//    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];
//
//    		var selectId = null;
//			if(response.length > 0){
//				for(var i=0; i<response.length; i++){
//					var resObj = response[i];
//					if(resObj.comCdNm == chrrOrgGrpCd) {
//						selectId = resObj.comCdNm;
//						break;
//					}
//				}
//				$('#mgmtGrpNm').setData({
//					data:response ,
//					mgmtGrpNm:selectId
//				});
//
//			}
//    	}
		if(flag == 'mgmtGrpNm'){

    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }

    		$('#mgmtGrpNm').clear();

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

//			var sUprOrgId = "";
//			if($("#sUprOrgId").val() != ""){
//				 sUprOrgId = $("#sUprOrgId").val();
//			}

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
//  			if($("#sOrgId").val() != ""){
//  				sOrgId = $("#sOrgId").val();
//  			}
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
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.sbeqpMgmtList);
    	}

    	if(flag == 'sbeqpClCd'){
    		$('#sbeqpClCdList').clear();
			var option_data =  [{comCd: "",comCdNm: "전체"}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
				option_data.push(resObj);
    		}

    		$('#sbeqpClCdList').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'eqpInstlMtsoInf'){
    		regInf.eqpInstlMtsoInf(response);
    	}
	};

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

//   function setGrid(page, rowPerPage) {
   this.setGrid = function setGrid(page, rowPerPage){

   	 $('#pageNo').val(page);
   	 $('#rowPerPage').val(rowPerPage);
   	 var param =  $("#searchFormSbeqpTab").getData();
	   	 $.each($('form input[type=checkbox]')
       		.filter(function(idx){
       			return $(this).prop('checked') === false
       		}),
       		function(idx, el){
       	var emptyVal = "";
       	param += '&' + $(el).attr('name') + '=' + emptyVal;
	   	 });

   	 $('#'+gridId).alopexGrid('showProgress');
	 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getNrgstSbeqpList', param, 'GET', 'search');
   }

   function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	};

    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: true,
                  modal: true,
                  movable:true,
                  windowpopup : true,
                  width : 900,
                  height : window.innerHeight * 0.8
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
});