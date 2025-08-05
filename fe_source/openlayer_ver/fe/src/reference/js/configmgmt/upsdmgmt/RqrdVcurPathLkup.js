/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {

    }

  //Grid 초기화
    function initGrid() {


    		var headerMappingN =  [{fromIndex:7, toIndex:8, title:"계약전력", id:'u0'}
										,{fromIndex:9, toIndex:10, title:"Main 분전반", id:'u1'},
										,{fromIndex:11, toIndex:12, title:"분기 분전반", id:'u2'},
										,{fromIndex:13, toIndex:17, title:"실장정보", id:'u3'}];

    		var mappingN =  [{key : 'mgmtGrpNm', align:'center', title : '관리그룹', width: '70px',rowspan:true},
    			{key : 'orgNm', align:'center', title : '본부', width: '100px',rowspan:true},
    			{key : 'teamNm', align:'center', title : '팀', width: '100px',rowspan:true},
    			{key : 'tmofNm', align:'center', title : '전송실', width: '120px',rowspan:true},
    			{key : 'mtsoTypNm', align:'center', title : '국사유형', width: '80px',rowspan:true},
    			{key : 'mtsoNm', align:'center', title : '국사명', width: '120px',rowspan:true},
    			{key : 'florDivVal', align:'center', title : '총 층수', width: '80px',
    			 render: function(value){
					if(value == null || value == '')
						return
					else{
						for(var i=-6; i<0; i++){
							if(value == i){
								return "B" + -i + "층";
							}
						}
						for(var i=1; i<21; i++){
							if(value == i){
								return i + "층";
							}
						}
					}
				},rowspan:true},
    			{key : 'ctrtEpwrVal', align:'center', title : '계약전력(KW)', width: '100px',rowspan:true},
    			{key : 'ctrtEpwrRoadRate', align:'center', title : '부하율(%)', width: '100px',
    			 render: function(value){
							if(value == null || value == '')
								return
							else
								return value + '%';
				},rowspan:true},
    			{key : 'mainSbeqpNm', align:'center', title : '분전반명', width: '100px',rowspan:true},
    			{key : 'mainCbplEpwrVal', align:'center', title : '전력(KW)', width: '80px',rowspan:true},
    			{key : 'qrtSbeqpNm', align:'center', title : '분전반명', width: '100px',rowspan:true},
    			{key : 'qrtCbplEpwrVal', align:'center', title : '전력(KW)', width: '80px',rowspan:true},
    			{key : 'eqpRackNm', align:'center', title : '랙명', width: '120px',rowspan:true},
    			{key : 'sPos', align:'center', title : '랙시작위치', width: '80px'},
    			{key : 'ePos', align:'center', title : '랙종료위치', width: '80px'},
    			{key : 'eqpNm', align:'center', title : '장비명', width: '120px'},
    			{key : 'rqrdEpwrMaxChfVal', align:'center', title : '소요전력(KW)', width: '120px'}];


        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
    		grouping:{
				by:['mgmtGrpNm','orgNm','teamNm','tmofNm','mtsoTypNm','mtsoNm','florDivVal','ctrtEpwrVal','ctrtEpwrRoadRate', 'mainSbeqpNm', 'mainCbplEpwrVal','qrtSbeqpNm','qrtCbplEpwrVal','eqpRackNm'],
				useGrouping:true,
				useGroupRearrange:true,
				useGroupRowspan:true
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
		var hideColList = [];
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
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
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

    	 $('#btnExportExcel').on('click', function(e) {
       		//tango transmission biz 모듈을 호출하여야한다.
       		 var param =  $("#searchForm").getData();
       		 var fileName = "";
       		 var method = "";

       		 param = gridExcelColumn(param, gridId);
       		 param.pageNo = 1;
       		 param.rowPerPage = 10;
       		 param.firstRowIndex = 1;
       		 param.lastRowIndex = 1000000000;
        	 fileName = '상면관리_입전경로조회';
        	 method = 'getRqrdVcurPathLkupList';

       		 param.fileName = fileName;
       		 param.fileExtension = "xlsx";
       		 param.excelPageDown = "N";
       		 param.excelUpload = "N";
       		 param.method =method;

       		 $('#'+gridId).alopexGrid('showProgress');
    	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/rqrdVcurPathLkupExcelcreate', param, 'GET', 'excelDownload');
            });


	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.rqrdVcurPathLkup);

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
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}


    }

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/rqrdVcurPathLkup', param, 'GET', 'search');

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