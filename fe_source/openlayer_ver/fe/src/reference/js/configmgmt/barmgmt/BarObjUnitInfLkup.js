/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var eqpRoleDivCdList;
	var bpIdList;
	var currentTab;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid('R');
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
        currentTab = 1;
    };

    function setRegDataSet(data) {

//    	$('#useYn').setSelected("Y");

    }

  //Grid 초기화
    function initGrid(strGubun) {


    	if (strGubun == "R") {

    		var headerMappingN =  [{fromIndex:0, toIndex:4, title:"기본정보", id:'u0'}
										,{fromIndex:5, toIndex:8, title:"TANGO정보", id:'u1'}
										,{fromIndex:9, toIndex:17, title:"NAMS정보", id:'u2'}];

    		var mappingN =  [{key : 'eqpRoleDivNm', align:'center',title : '장비타입',width: '100px'},
					    			{key : 'bpNm', align:'center',title : '협력업체',width: '100px'},
					    			{key : 'eqpMdlNm', align:'center',title : '장비모델명',width: '100px'},
					    			{key : 'mtsoNm', align:'center',title : '국사명',width: '120px'},
					    			{key : 'eqpNm', align:'center',title : '장비명',width: '180px'},

					    			{key : 'serNo', align:'center',title : '시리얼번호',width: '150px'},
					    			{key : 'intgFcltsCd', align:'center',title : '통합시설코드',width: '110px'},
					    			{key : 'intgFcltsNm', align:'center',title : '통합시설명',width: '160px'},
					    			{key : 'barNo', align:'center',title : '바코드번호',width: '140px'},

					    			{key : 'namsMatlNm', align:'center',title : 'NAMS자재명',width: '200px'},
					    			{key : 'vendSerNo', align:'center',title : '시리얼번호',width: '150px'},
					    			{key : 'vendVndrNm', align:'center',title : '제조사명',width: '100px'},
					    			{key : 'splyVndrNm', align:'center',title : '공급사명',width: '100px'},
					    			{key : 'barIntgFcltsCd', align:'center',title : '통합시설코드',width: '110px'},
					    			{key : 'barIntgFcltsNm', align:'center',title : '통합시설명',width: '160px'},
					    			{key : 'mnftDt', align:'center',title : '제조일자',width: '80px'},
					    			{key : 'curstLocNm', align:'center',title : 'NAMS위치명',width: '200px'},
					    			{key : 'matlStatNm', align:'center',title : '자재상태',width: '80px'}];
    	}
    	else if (strGubun == "U") {
    		var headerMappingN =  [{fromIndex:0, toIndex:4, title:"기본정보", id:'u0'}
										  ,{fromIndex:5, toIndex:10, title:"TANGO정보", id:'u1'}
										 ,{fromIndex:11, toIndex:19, title:"NAMS정보", id:'u2'}];

			var mappingN =  [{key : 'eqpRoleDivNm', align:'center',title : '장비타입',width: '100px'},
									{key : 'bpNm', align:'center',title : '협력업체',width: '100px'},
									{key : 'eqpMdlNm', align:'center',title : '장비모델명',width: '100px'},
									{key : 'mtsoNm', align:'center',title : '국사명',width: '120px'},
									{key : 'eqpNm', align:'center',title : '장비명',width: '180px'},

									{key : 'serNo', align:'center',title : '시리얼번호',width: '150px'},
									{key : 'cardMdlNm', align:'center',title : '카드모델명',width: '100px'},
									{key : 'cardNm', align:'center',title : '카드명',width: '120px'},
									{key : 'intgFcltsCd', align:'center',title : '통합시설코드',width: '110px'},
									{key : 'intgFcltsNm', align:'center',title : '통합시설명',width: '160px'},
									{key : 'barNo', align:'center',title : '바코드번호',width: '140px'},

									{key : 'namsMatlNm', align:'center',title : 'NAMS자재명',width: '200px'},
									{key : 'prntMatlBarNo', align:'center',title : '부모바코드',width: '120px'},
									{key : 'vendVndrNm', align:'center',title : '제조사명',width: '100px'},
									{key : 'splyVndrNm', align:'center',title : '공급사명',width: '100px'},
					    			{key : 'barIntgFcltsCd', align:'center',title : '통합시설코드',width: '110px'},
					    			{key : 'barIntgFcltsNm', align:'center',title : '통합시설명',width: '160px'},
									{key : 'mnftDt', align:'center',title : '제조일자',width: '80px'},
									{key : 'curstLocNm', align:'center',title : 'NAMS위치명',width: '200px'},
									{key : 'matlStatNm', align:'center',title : '자재상태',width: '80px'}];
    	}
    	else {

    		var headerMappingN =  [{fromIndex:0, toIndex:5, title:"기본정보", id:'u0'}
											,{fromIndex:6, toIndex:14, title:"TANGO정보", id:'u1'}
											,{fromIndex:15, toIndex:19, title:"광모듈정보", id:'u2'}
											,{fromIndex:20, toIndex:28, title:"NAMS정보", id:'u3'}];

			var mappingN =  [{key : 'eqpRoleDivNm', align:'center',title : '장비타입',width: '100px'},
									{key : 'bpNm', align:'center',title : '협력업체',width: '100px'},
									{key : 'eqpMdlNm', align:'center',title : '장비모델명',width: '120px'},
									{key : 'mtsoNm', align:'center',title : '국사명',width: '120px'},
									{key : 'eqpNm', align:'center',title : '장비명',width: '180px'},
									{key : 'portNm', align:'center',title : '포트명',width: '180px'},

									{key : 'serNo', align:'center',title : '시리얼번호',width: '100px'},
									{key : 'vendPartsNoVal', align:'center',title : 'Part Number',width: '140px'},
									{key : 'tangoVendNm', align:'center',title : '제조사명',width: '80px'},
									{key : 'wavlVal', align:'center',title : '파장',width: '80px'},
									{key : 'tmprVal', align:'center',title : '온도',width: '80px'},
									{key : 'voltVal', align:'center',title : '전압',width: '80px'},
									{key : 'rxpwrVal', align:'center',title : 'Rx 파워',width: '80px'},
									{key : 'txpwrVal', align:'center',title : 'Tx 파워',width: '80px'},
									{key : 'lastChgDate', align:'center',title : '수집일시',width: '150px'},

									{key : 'optlMdulMdlNm', align:'center',title : '광모듈명',width: '200px'},
									{key : 'vendNm', align:'center',title : '원천제조사명',width: '120px'},
									{key : 'wavlDivVal', align:'center',title : 'Fixed 파장/Tunable',width: '100px'},
									{key : 'barYn', align:'center',title : '바코드대상',width: '100px'},
									{key : 'barNo', align:'center',title : '바코드번호',width: '120px'},

									{key : 'namsMatlCd', align:'center',title : 'NAMS자재코드',width: '120px'},
									{key : 'namsMatlNm', align:'center',title : 'NAMS자재명',width: '200px'},
									{key : 'prntMatlBarNo', align:'center',title : '부모바코드',width: '120px'},
									{key : 'intgFcltsCd', align:'center',title : '통합시설코드',width: '120px'},
									{key : 'vendVndrNm', align:'center',title : '제조사명',width: '100px'},
									{key : 'splyVndrNm', align:'center',title : '공급사명',width: '100px'},
									{key : 'mnftDt', align:'center',title : '제조일자',width: '80px'},
									{key : 'curstLocNm', align:'center',title : 'NAMS위치명',width: '200px'},
									{key : 'matlStatNm', align:'center',title : '자재상태',width: '80px'}];
		}

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		headerGroup : headerMappingN,
    		columnMapping : mappingN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['eqpRoleDivCd','lnkgSystmCd','eqpMdlId','mtsoId', 'bpId','cardMdlId','cardId','matlStatDivCd','vendVndrCd','splyVndrCd'];
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
		 var param = {"mgmtGrpNm": chrrOrgGrpCd};


		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
    	//장비 역할 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
    	//협력업체 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
		//장비모델 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
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
         		 var param = "mgmtGrpNm="+ $("#chrrOrgGrpCd").val();
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
	     		 var param = "mgmtGrpNm="+ $("#chrrOrgGrpCd").val();
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

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 var param = dataObj;

    		 var tabId = $('#barMappTabs').getCurrentTabContent();

    		 var popId = "";
    		 var Title = "";
    		 var Url = "";

    		 if (tabId == "#eqpTab") {
    			 popId = 'BarObjEqpDtlInf';
    			 Title = '바코드 대상 - RACK(장비) 상세';
    			 Url = '/tango-transmission-web/configmgmt/barmgmt/BarObjEqpDtlInf.do';
    		 }
    		 else if (tabId == "#cardTab") {
    			 popId = 'BarObjUnitDtlInf';
    			 Title = '바코드 대상 - UNIT(카드) 상세';
    			 Url = '/tango-transmission-web/configmgmt/barmgmt/BarObjUnitDtlInf.do';
    		 }
    		 else{
    			 popId = 'OptlMdulDtlInf';
    			 Title = '바코드 대상 - SFP(광모듈) 상세';
    			 Url = '/tango-transmission-web/configmgmt/barmgmt/OptlMdulDtlInf.do';
    		 }

     		 $a.popup({
        			popid: popId,
        			title: Title,
        			url: Url,
        			data: param,
        			windowpopup : true,
        			modal: true,
        			movable:true,
        			width : 1118,
        			height : 743,
        			callback: function(data) {

    			      }
        		});

    	 });

    	 $('#btnExportExcel').on('click', function(e) {
    		 var gridData = $('#'+gridId).alopexGrid('dataGet');
    		 if (gridData.length == 0) {
    			 callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
    			 return;
    		 }

        		//tango transmission biz 모듈을 호출하여야한다.
        		 var param =  $("#searchForm").getData();
        		 var fileName = "";
           		 var method = "";
           	 var eqpRoleDivCd = "";
    		 var bpId = "";
    		 var eqpMdlId = "";

        		 param = gridExcelColumn(param, gridId);
        		 param.pageNo = 1;
        		 param.rowPerPage = 10;
        		 param.firstRowIndex = 1;
        		 param.lastRowIndex = 1000000000;

    		 param.eqpRoleDivCdList = $("#eqpRoleDivCdList").val();
    		 param.bpIdList = $("#bpIdList").val();
    		 param.eqpMdlIdList = $("#eqpMdlIdList").val();

    		 if (param.eqpRoleDivCdList != "" && param.eqpRoleDivCdList != null ){
  	   			 for(var i=0; i<param.eqpRoleDivCdList.length; i++) {
  	   				 if(i == param.eqpRoleDivCdList.length - 1){
  	   					 eqpRoleDivCd += param.eqpRoleDivCdList[i];
  	                 }else{
  	                   	 eqpRoleDivCd += param.eqpRoleDivCdList[i] + ",";
  	                 }
  	    		 }
  	   			 param.eqpRoleDivCd = eqpRoleDivCd;
  	   			 param.eqpRoleDivCdList = [];
  	   		 }

  	   		 if (param.bpIdList != "" && param.bpIdList != null ){
  	   			 for(var i=0; i<param.bpIdList.length; i++) {
  	   				 if(i == param.bpIdList.length - 1){
  	   					 bpId += param.bpIdList[i];
  	                    }else{
  	                   	 bpId += param.bpIdList[i] + ",";
  	                    }
  	    		 }
  	   			 param.bpId = bpId;
  	   			 param.bpIdList = [];
  	   		 }

  	   		 if (param.eqpMdlIdList != "" && param.eqpMdlIdList != null ){
	   			 for(var i=0; i<param.eqpMdlIdList.length; i++) {
	   				 if(i == param.eqpMdlIdList.length - 1){
	   					 eqpMdlId += param.eqpMdlIdList[i];
	                 }else{
	                	 eqpMdlId += param.eqpMdlIdList[i] + ",";
	                 }
	    		 }
	   			 param.eqpMdlId = eqpMdlId;
	   			 param.eqpMdlIdList = [];
	   		 }

        		 var tabId = $('#barMappTabs').getCurrentTabContent();

            	 if (tabId == "#eqpTab") {
            		 fileName = '바코드대상정보-RACK';
            		 method = 'getBarObjEqpInfList';
            	 }
            	 else if (tabId == "#cardTab") {
            		 fileName = '바코드대상정보-UNIT카드';
            		 method = 'getBarObjUnitInfList';
            	 }
            	 else {
            		 fileName = '바코드대상정보-SFP광모듈';
            		 method = 'getOptlMdulInfList';
            	 }

           		 param.fileName = fileName;
           		 param.fileExtension = "xlsx";
           		 param.excelPageDown = "N";
           		 param.excelUpload = "N";
           		 param.method =method;

        		 $('#'+gridId).alopexGrid('showProgress');
     	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/excelcreate', param, 'GET', 'excelDownload');
             });

    	 $('#barMappTabs').on('tabchange', function(e, index, index2){

          	index = index+1;
          	$('#'+gridId).alopexGrid('dataEmpty');

			 if (index == 1) {
				 currentTab = 1;
          		initGrid('R');
				 if($('Button.button4.arrow_more').hasClass('on')) {
					 $('#cardSearchTab').hide();
				     $('#sfpSearchTab').hide();
				 }
			 }
			 else if (index == 2) {
				 currentTab = 2;
          		initGrid('U');
				 if($('Button.button4.arrow_more').hasClass('on')) {
					 $('#cardSearchTab').show();
				     $('#sfpSearchTab').hide();
				 }
			 }
			 else {
				 currentTab = 3;
          		initGrid();
				 if($('Button.button4.arrow_more').hasClass('on')) {
					 $('#cardSearchTab').hide();
				     $('#sfpSearchTab').show();
				 }
			 }

          });

    	 $('Button.button4.arrow_more').on('click', function(){
    		 if(!$(this).hasClass('on')) {
    			 $('#cardSearchTab').hide();
				 $('#sfpSearchTab').hide();
    		 } else {
    			 if(currentTab == 1) {
    				 $('#cardSearchTab').hide();
    				 $('#sfpSearchTab').hide();
    			 } else if(currentTab == 2) {
    				 $('#cardSearchTab').show();
    				 $('#sfpSearchTab').hide();
    			 } else {
    				 $('#cardSearchTab').hide();
    				 $('#sfpSearchTab').show();
    			 }
    		 }
    	 })
	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		if (response.barObjEqpInf != undefined)
    			setSPGrid(gridId, response, response.barObjEqpInf);
    		else if (response.barObjUnitInf != undefined)
        		 setSPGrid(gridId, response, response.barObjUnitInf);
        	 else
        		 setSPGrid(gridId, response, response.optlMdulInf);

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

		if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');

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

    function gridExcelColumn(param, gridId) {
    	var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		param.headerGrpCnt = 1;
		var excelHeaderGroupTitle = "";
		var excelHeaderGroupColor = "";
		var excelHeaderGroupFromIndex = "";
		var excelHeaderGroupToIndex = "";


		var excelHeaderGroupFromIndexTemp = "";
		var excelHeaderGroupToIndexTemp = "";
		var excelHeaderGroupTitleTemp ="";
		var excelHeaderGroupColorTemp = "";

		var toBuf = "";


		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			if (i== gridColmnInfo.length-1) {

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf =  toBuf + (gridColmnInfo[i].groupColumnIndexes.length)
			}

			excelHeaderGroupTitleTemp += gridColmnInfo[i].title + ";";
			excelHeaderGroupColorTemp +='undefined'+ ";";

		}

		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			excelHeaderGroupFromIndex += excelHeaderGroupFromIndexTemp.split(";")[i] + ";";
			excelHeaderGroupToIndex += excelHeaderGroupToIndexTemp.split(";")[i] + ";";
			excelHeaderGroupTitle += excelHeaderGroupTitleTemp.split(";")[i] + ";";
			excelHeaderGroupColor += excelHeaderGroupColorTemp.split(";")[i] + ";";

		}

		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

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

		return param;
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');

    	 var tabId = $('#barMappTabs').getCurrentTabContent();

    	 if (tabId == "#eqpTab")
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barObjEqpInf', param, 'GET', 'search');
    	 else if (tabId == "#cardTab")
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barObjUnitInf', param, 'GET', 'search');
    	 else
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/optlMdulInf', param, 'GET', 'search');
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