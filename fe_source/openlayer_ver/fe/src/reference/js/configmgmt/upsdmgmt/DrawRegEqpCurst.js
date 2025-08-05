/**
 * EqpMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'drawRegEqpGrid';
	var gridIdExcel = 'drawRegEqpGridExcel';
	var fileOnDemendName = "";
	var eqpRoleDivCdList;
	var bpIdList;
	var userGroupRowspanMode = 1;

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
			grouping:{
				useGrouping:true,
				by:['headerText','mtsoNm','eqpDivFlag','rackInAttrYn'],
				useGroupHeader:['mtsoNm'],
    			useGroupFooter:['mtsoNm','eqpDivFlag','rackInAttrYn'],
    			useGroupRowspan:true,
				useGroupRearrange:true,
    			groupRowspanMode: userGroupRowspanMode
			},
    		columnMapping: [
			{/* 관리그룹		 */
				key : 'orgGrpCd', align:'center',
				title : '관리그룹',
				width: '10px'
			}, {/* 본부		 */
				key : 'orgNm', align:'center',
				title : '본부',
				width: '10px'
			}, {/* 팀		 */
				key : 'taskOrgNm', align:'center',
				title : '팀',
				width: '10px'
			}, {/* 전송실명		 */
				key : 'topMtsoNm', align:'center',
				title : '전송실',
				width: '10px'
			}, {/* 국사명		 */
				key : 'mtsoNm',
				groupFoldingHeader: 'mtsoNm',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				rowspan:true,
				groupHeader:['groupFoldingIcon()','groupValue(0)'],
				groupFooter:['groupValue(1)', ' 소계: ','count() '],
				groupHeaderStyleclass: 'white',
				groupFooterStyleclass: 'white',
				colspanTo: function(value, data, mapping, range){
					if(userGroupRowspanMode ===1 && (data._state.groupFooter || data._state.groupHeader) && range && range.groupDepth === 1){
						return 'barNo';
					}
				},
				width: '150px'
			}, {/* 장비구분플래그		 */
				key : 'eqpDivFlag', align:'center',
				groupFoldingHeader: 'rackInAttrYn',
				title : '구분',
				groupFooter:['소계: ','count() '],
				groupFooterStyleclass: 'white',
				width: '60px',
				colspanTo: function(value, data, mapping, range){
					if(userGroupRowspanMode ===1 && (data._state.groupFooter || data._state.groupHeader) && range && range.groupDepth === 2){
						return 'barNo';
					}
				},
				sorting:true,
				rowspan:true
			},{/* 장비실장여부    */
				key: 'rackInAttrYn', align:'center',
				title : '장비실장여부',
				groupFooter:[ function(value, data, render, mapping){
					if(value.value == '등록'){
						return '등록: ';
					}
					else {
						return '미등록: ';
					}
				},'count() '],
				groupFooterStyleclass: 'white',
				width: '80px',
				colspanTo: function(value, data, mapping, range){
					if(userGroupRowspanMode ===1 && (data._state.groupFooter || data._state.groupHeader) && range && range.groupDepth === 3){
						return 'barNo';
					}
				}
    			,styleclass : function(value,data,mapping){
					if(data.rackInAttrYn == '등록') {
						return 'row-highlight-blue';
					}else if(data.rackInAttrYn == '미등록') {
						return 'row-highlight-red';
					}
  			  	}
			}, {/* 상면국사존재여부		 */
				key : 'upsdMtsoYn', align:'center',
				title : '상면국사존재여부',
				groupFooterStyleclass: 'white',
				width: '80px'
			}, {/* 층		 */
				key : 'floorName', align:'center',
				title : '층',
				groupFooterStyleclass: 'white',
				width: '50px'
			}, {/* 랙명		 */
				key : 'label', align:'center',
				title : '랙명',
				groupFooterStyleclass: 'white',
				width: '100px'
			}, {/* 시작위치		 */
				key : 'sPos', align:'center',
				title : '시작위치',
				groupFooterStyleclass: 'white',
				width: '60px'
			}, {/* 장비타입		 */
				key : 'eqpRoleDivNm', align:'center',
				title : '장비타입',
				groupFooterStyleclass: 'white',
				width: '80px'
			},  {/* 제조사		 */
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				groupFooterStyleclass: 'white',
				width: '80px'
			},{/* 장비모델ID		 */
				key : 'eqpMdlId', align:'center',
				title : '장비모델ID',
				groupFooterStyleclass: 'white',
				width: '120px'
			},{/* 장비모델명   	 */
				key : 'eqpMdlNm', align:'center',
				title : '장비모델명',
				groupFooterStyleclass: 'white',
				width: '120px'
			}, {/* 장비ID */
				key : 'eqpId', align:'center',
				title : '장비ID',
				groupFooterStyleclass: 'white',
				width: '110px'
			}, {/* 장비명       	 */
				key : 'eqpNm', align:'center',
				title : '장비명',
				groupFooterStyleclass: 'white',
				width: '150px'
			},{/* 장비운용상태명 		 */
				key : 'opStatNm', align:'center',
				title : '장비상태',
				groupFooterStyleclass: 'white',
				width: '100px'
			},{/* 바코드		 */
				key : 'barNo', align:'center',
				title : configMsgArray['barcode'],
				groupFooterStyleclass: 'white',
				width: '100px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        //그리드 생성
        $('#'+gridIdExcel).alopexGrid({
        	paging : false,
        	autoColumnIndex: true,
        	autoResize: true,
        	numberingColumnFromZero: false,
        	grouping:{
        		useGrouping:true,
        		by:['headerText','mtsoNm','eqpDivFlag','rackInAttrYn'],
        		useGroupHeader:['mtsoNm'],
        		useGroupFooter:['mtsoNm','eqpDivFlag','rackInAttrYn'],
        		useGroupRowspan:true,
        		useGroupRearrange:true,
        		groupRowspanMode: userGroupRowspanMode
        	},
    		columnMapping: [
    			{/* 관리그룹		 */
    				key : 'orgGrpCd', align:'center',
    				title : '관리그룹',
    				width: '70px'
    			}, {/* 본부		 */
    				key : 'orgNm', align:'center',
    				title : '본부',
    				width: '100px'
    			}, {/* 팀		 */
    				key : 'taskOrgNm', align:'center',
    				title : '팀',
    				width: '100px'
    			}, {/* 전송실명		 */
    				key : 'topMtsoNm', align:'center',
    				title : '전송실',
    				width: '100px'
    			}, {/* 국사명		 */
    				key : 'mtsoNm',
    				groupFoldingHeader: 'mtsoNm',
    				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
    				rowspan:true,
    				groupHeader:['groupFoldingIcon()','groupValue(0)'],
    				groupFooter:['groupValue(1)', ' 소계: ','count() '],
    				groupHeaderStyleclass: 'white',
    				groupFooterStyleclass: 'white',
    				colspanTo: function(value, data, mapping, range){
    					if(userGroupRowspanMode ===1 && (data._state.groupFooter || data._state.groupHeader) && range && range.groupDepth === 1){
    						return 'barNo';
    					}
    				},
    				width: '150px'
    			}, {/* 장비구분플래그		 */
    				key : 'eqpDivFlag', align:'center',
    				groupFoldingHeader: 'rackInAttrYn',
    				title : '구분',
    				groupFooter:['소계: ','count() '],
    				groupFooterStyleclass: 'white',
    				width: '60px',
    				colspanTo: function(value, data, mapping, range){
    					if(userGroupRowspanMode ===1 && (data._state.groupFooter || data._state.groupHeader) && range && range.groupDepth === 2){
    						return 'barNo';
    					}
    				},
    				sorting:true,
    				rowspan:true
    			},{/* 장비실장여부    */
    				key: 'rackInAttrYn', align:'center',
    				title : '장비실장여부',
    				groupFooter:[ function(value, data, render, mapping){
    					if(value.value == '등록'){
    						return '등록: ';
    					}
    					else {
    						return '미등록: ';
    					}
    				},'count() '],
    				groupFooterStyleclass: 'white',
    				width: '80px',
    				colspanTo: function(value, data, mapping, range){
    					if(userGroupRowspanMode ===1 && (data._state.groupFooter || data._state.groupHeader) && range && range.groupDepth === 3){
    						return 'barNo';
    					}
    				}
        			,styleclass : function(value,data,mapping){
    					if(data.rackInAttrYn == '등록') {
    						return 'row-highlight-blue';
    					}else if(data.rackInAttrYn == '미등록') {
    						return 'row-highlight-red';
    					}
      			  	}
    			}, {/* 상면국사존재여부		 */
    				key : 'upsdMtsoYn', align:'center',
    				title : '상면국사존재여부',
    				groupFooterStyleclass: 'white',
    				width: '80px'
    			}, {/* 층		 */
    				key : 'floorName', align:'center',
    				title : '층',
    				groupFooterStyleclass: 'white',
    				width: '50px'
    			}, {/* 랙명		 */
    				key : 'label', align:'center',
    				title : '랙명',
    				groupFooterStyleclass: 'white',
    				width: '100px'
    			}, {/* 시작위치		 */
    				key : 'sPos', align:'center',
    				title : '시작위치',
    				groupFooterStyleclass: 'white',
    				width: '60px'
    			}, {/* 장비타입		 */
    				key : 'eqpRoleDivNm', align:'center',
    				title : '장비타입',
    				groupFooterStyleclass: 'white',
    				width: '80px'
    			},  {/* 제조사		 */
    				key : 'bpNm', align:'center',
    				title : configMsgArray['vend'],
    				groupFooterStyleclass: 'white',
    				width: '80px'
    			},{/* 장비모델ID		 */
    				key : 'eqpMdlId', align:'center',
    				title : '장비모델ID',
    				groupFooterStyleclass: 'white',
    				width: '120px'
    			},{/* 장비모델명   	 */
    				key : 'eqpMdlNm', align:'center',
    				title : '장비모델명',
    				groupFooterStyleclass: 'white',
    				width: '120px'
    			}, {/* 장비ID */
    				key : 'eqpId', align:'center',
    				title : '장비ID',
    				groupFooterStyleclass: 'white',
    				width: '110px'
    			}, {/* 장비명       	 */
    				key : 'eqpNm', align:'center',
    				title : '장비명',
    				groupFooterStyleclass: 'white',
    				width: '150px'
    			},{/* 장비운용상태명 		 */
    				key : 'opStatNm', align:'center',
    				title : '장비상태',
    				groupFooterStyleclass: 'white',
    				width: '100px'
    			},{/* 바코드		 */
    				key : 'barNo', align:'center',
    				title : configMsgArray['barcode'],
    				groupFooterStyleclass: 'white',
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

		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

		//관리그룹 조회
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
		//통합국 유형 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');


    	//본부 세션 값이 없을 경우 팀,전송실 전체 조회
    	if($("#sUprOrgId").val() == ""){
	    	//팀 조회
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
	    	//전송실 조회
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
    	}
    	//장비 상태 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCd');


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
          $('#SearchForm').on('keydown', function(e){
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
    		 }else{
    			 $("#sktMtso").hide();
    			 $("#skbMtso").show();
    			 $('#intgFcltsCd').setEnabled(false);
    		 }

    		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

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

    	 $('#eqpRoleDivCdList').multiselect({ // 분류를 여러개 선택했을시 해당 분류에 따른 제조사들 조회 . rjs
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

  		$('#btnDrawRegEqpStcCurst').on('click', function(e) {
			$a.popup({
				title: '장비상면등록현황',
				url: $('#ctx').val()+'/configmgmt/upsdmgmt/DrawRegEqpStcCurst.do',
				data: '',
				iframe: false,
				windowpopup: true,
				modal: false,
				movable:true,
				width : 1300,
				height : 700,
			});
		});


    	 $('#btnExportExcel').on('click', function(e) {
	    	var param =  $("#SearchForm").getData();
			param.pageNo = 1;
			param.rowPerPage = 10000;

	    	$('#'+gridId).alopexGrid('showProgress');
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawRegEqpMgmtList', param, 'GET', 'searchExcel');
         });

       	$('#btnExportExcel2').on('click', function(e) {
      		//tango transmission biz 모듈을 호출하여야한다.
      		var param =  $("#SearchForm").getData();

      		param = gridExcelColumn(param, gridId);
      		param.pageNo = 1;
      		param.rowPerPage = 10;
      		param.firstRowIndex = 1;
      		param.lastRowIndex = 1000000000;

      		/* 장비정보     	 */
      		param.fileName = '상면미등록장비현황';
      		param.fileExtension = "xlsx";
      		param.excelPageDown = "N";
      		param.excelUpload = "N";
      		param.method = "getDrawRegEqpMgmtList";

      		$('#'+gridId).alopexGrid('showProgress');
      		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/drawRegEqpExcelcreate', param, 'GET', 'excelDownload');
      	});

    	 $('#btnExportExcelOnDemand').on('click', function(e){
	            btnExportExcelOnDemandClickEventHandler(e);
	        });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    		 var popidTmp = null;
    		 var urlTmp = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	if(dataObj.upsdMtsoYn == 'N'){
     	 		callMsgBox('','W', '동일건물포함 국사 중 상면에 등록된 국사가 없습니다. 상면국사를 등록해주세요.<br> (# 등록 경로: 구성-상면관리-상면국사리스트-등록)' , function(msgId, msgRst){});
     	 	}else{
         	 	dataObj.pageNo = $('#pageNo').val();
         	 	dataObj.rowPerPage = $('#rowPerPage').val();
         	 	if((dataObj.eqpId).indexOf("DV") != -1){
         	 		popidTmp = 'DrawNrgstEqpTabEqp';
         	 		urlTmp = '/tango-transmission-web/configmgmt/upsdmgmt/DrawNrgstEqpTabEqp.do';
         	 	}
         	 	else{
         	 		popidTmp = 'DrawNrgstEqpTabSbeqp';
         	 		urlTmp = '/tango-transmission-web/configmgmt/upsdmgmt/DrawNrgstEqpTabSbeqp.do';
         	 	}

    	   		 $a.popup({
    		          	popid: popidTmp,
    		          	title: configMsgArray['findMtso'],
    		            url: urlTmp,
    		            windowpopup : true,
    		            modal: true,
    		            movable:true,
    		            width : 1000,
    		            data : dataObj,
    		           	height : 900,
    		           	callback : function(data) { // 팝업창을 닫을 때 실행
    		           	}
    		      });
     	 	}
    	 });

    	 $('#btnClose').on('click', function(e) {
      		 $a.close();
           });

	};

	 /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //장비조회조건세팅
	        var param =  $("#SearchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 100;
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
         	 /* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = '상면미등록장비현황_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getDrawRegEqpMgmtList";
	   		param.excelFlag = "drawRegEqpMgmtList";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
   		 	$('#'+gridId).alopexGrid('showProgress');
   		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	    }


	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
//		console.log(gridColmnInfo);

		var gridHeader = $('#'+gridIdExcel).alopexGrid("columnGet", {hidden:false});

//		console.log(gridHeader);
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

		if(flag == 'tmof'){
			$('#tmofList').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmofList').setData({
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

    	}
    	if(flag == 'eqpOpStat'){

    		$('#sbeqpOpStatCdList').clear();
    		$('#eqpStatCd').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

    		$('#sbeqpOpStatCdList').setData({
                data:option_data,
                sbeqpOpStatCdList: '01'
    		});
    		$('#eqpStatCd').setData({
    			data:option_data,
    			eqpStatCd: '01'
    		});

    	}
//    	if(flag == 'eqpStatCd'){
//    		$('#sbeqpOpStatNmReg').clear();
//    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];
//
//    		for(var i=0; i<response.length; i++){
//    			var resObj = response[i];
//    			option_data.push(resObj);
//    		}
//
//    		$('#sbeqpOpStatNmReg').setData({
//                 data:option_data
//    		});
//    	}

    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		console.log(response);
    		setSPGrid(gridId, response, response.drawRegEqpMgmtList);
    	}

    	if(flag == 'searchExcel'){
    		setSPGrid(gridIdExcel, response, response.drawRegEqpMgmtList);
			var d = new Date();
			var month = (d.getMonth()+1)+"";
			if(month.length < 2){
				month = "0" + month;
			}
			var date = d.getFullYear()+""+month+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds();
			var worker = new ExcelWorker({
				excelFileName : "상면미등록장비현황_"+date,
				palette : [{
					className : 'B_YELLOW',
					backgroundColor : '255,255,0'
				},{
					className : 'F_RED',
					color : '#FF0000'
				}],
				sheetList : [{
					sheetName : "상면미등록장비현황",
					$grid : $('#'+gridIdExcel)
				}]
			});
			worker.export({
				selected : false,
				exportHidden : false,
				useGridColumnWidth: true,
				merge : true,
				exportGroupSummary: true,
				exportFooter: false

			});
			$('#'+gridId).alopexGrid('hideProgress');
    	}

    	if(flag == 'sbeqpClCd'){
    		$('#sbeqpClCdList').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#sbeqpClCdList').setData({
                 data:option_data
    		});
    	}
    	//국사유형 콤보 박스
    	if(flag == 'mtsoTyp'){
    		$('#mtsoTypCdList').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#mtsoTypCdList').setData({
                 data:option_data
    		});
    	}
    	if(flag == 'mtsoCntrTypCdList') {
    		$('#mtsoCntrTypCdList').clear();

    		var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoCntrTypCdList').setData({
	             data:option_data
			});
    	}

    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
//            console.log('excelCreate');

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

    	var hideColList = ['orgGrpCd','orgNm','taskOrgNm','topMtsoNm','upsdMtsoYn'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

    	var hideColListExcel = ['upsdMtsoYn'];
    	$('#'+gridIdExcel).alopexGrid("hideCol", hideColListExcel, 'conceal');
	}

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	 $('#pageNo').val(page);
    	 $('#rowPerPage').val(rowPerPage);
    	 var param =  $("#SearchForm").serialize();

	   	 $.each($('form input[type=checkbox]')
        		.filter(function(idx){
        			return $(this).prop('checked') === false
        		}),
        		function(idx, el){
        	var emptyVal = "";
        	param += '&' + $(el).attr('name') + '=' + emptyVal;
	   	 });
    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawRegEqpMgmtList', param, 'GET', 'search');
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
                  windowpopup : true,
                  width : 900,
                  height : 600
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