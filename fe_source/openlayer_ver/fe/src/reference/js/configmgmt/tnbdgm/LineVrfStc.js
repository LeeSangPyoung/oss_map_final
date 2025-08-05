/**
 * LineVrfStc.js
 *
 * @author Administrator
 * @date 2017. 10. 27.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var fileOnDemendName = "";
	var svlnLclSclCodeData = [];
	var skTb2bSvlnSclCdData = [];
	var skBb2bSvlnSclCdData = [];
	var svlnLclCd = null;
	var svlnSclCd = null;

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
               pagerTotal: false
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		grouping:{
    			by:['mngGrpNm','orgNm','teamNm'],
    			useGrouping:true,
    			useGroupRowspan: true
    		},
    		columnMapping: [
    		{
				key : 'mngGrpNm', align:'left',
				title : '관리그룹',
				width: '80',
				rowspan: true,
				colspan: function(value, data, mapping){
					if(value == "합계"){
						return 4;
					}
				}
			}, {
				key : 'orgNm', align : 'left',
				title : '본부',
				width : '100',
				rowspan: true,
				colspan: function(value, data, mapping){
					if(value == "소계"){
						return 3;
					}
				}
			},{
				key : 'teamNm', align : 'left',
				title : '팀',
				width : '100',
				rowspan: true,
				colspan: function(value, data, mapping){
					if(value == "소계"){
						return 2;
					}
				}
			}, {
				key : 'tmofNm', align : 'left',
				title : '전송실',
				width : '100',
			}, {
				key : 'lineCnt', align : 'right',
				title : '전체 회선수',
				width : '100',
				inlineStyle : {
					color: 'blue',
					cursor:'pointer'
				}
			}, {
				key : 'normalLineCnt', align : 'right',
				title : '정상 회선수',
				inlineStyle : {
					color: 'blue',
					cursor:'pointer'
				}
			}, {
				key : 'errorLineCnt', align : 'right',
				title : '이상 회선수',
				width : '100',
				inlineStyle : {
					color: 'blue',
					cursor:'pointer'
				}
			}, {
				key : 'ratio', align : 'right',
				title : '정상율(%)',
				width : '300'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {


    	//본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ 'SKB', null, 'GET', 'fstOrg');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCode');
    }


    function setEventListener() {
    	//본부 선택시 이벤트
    	$('#org').on('change', function(e) {

    		var orgID =  $("#org").getData();

    		if(orgID.orgId == ''){

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ 'SKB', null, 'GET', 'team');
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ 'SKB', null, 'GET', 'tmof');

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
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ 'SKB', null, 'GET', 'tmof');
    		}else if(orgID.orgId == '' && teamID.teamId != ''){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.orgId, null,'GET', 'tmof');
    		}else if(orgID.orgId != '' && teamID.teamId == ''){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
    		}else {
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
    		}

    	});
    	// 서비스회선 대분류 선택
    	$('#svlnLclCd').on('change', function(e){
    		changeSvlnSclCd('svlnLclCd', 'svlnSclCd', svlnSclCdData); // 서비스회선소분류 selectbox 제어
    		//makeSearchFormByLcd('svlnLclCd', 'svlnSclCd', svlnSclCdData);
    	});

    	//회선내역
    	$('#'+gridId).on('click','.bodycell', function(e) {
    		var param =  $("#searchForm").getData();
    		var dataObj = AlopexGrid.parseEvent(e).data;
    		dataObj.svlnLclCd = param.svlnLclCd;
    		dataObj.svlnSclCd = param.svlnSclCd;
    		if(dataObj.mngGrpNm == '합계'){
    			dataObj.mngGrpId = '0002';
    			dataObj.orgId = param.orgId;
    			dataObj.teamId = param.teamId;
    			dataObj.tmofId = param.tmofId;
    		}
    		if(dataObj.orgNm == '합계' || dataObj.orgNm == '소계' ){
    			delete dataObj['orgId'];
    			dataObj.orgId = param.orgId;
    			dataObj.teamId = param.teamId;
    			dataObj.tmofId = param.tmofId;
    		}
    		if(dataObj.teamNm == '합계' || dataObj.teamNm == '소계' ){
    			delete dataObj['teamId'];
    			dataObj.teamId = param.teamId;
    			dataObj.tmofId = param.tmofId;
    		}
    		if(dataObj.tmofNm == '합계' || dataObj.tmofNm == '소계' ){
    			delete dataObj['tmofId'];
    			dataObj.tmofId = param.tmofId;
    		}

    		var key = dataObj._key;
    		if(key == 'lineCnt'){
    			delete dataObj['mtsoVrfRsltVal'];
    			popup('LineVrfStcLkup',$('#ctx').val()+'/configmgmt/tnbdgm/LineVrfStcLkup.do','전체 회선 내역',dataObj)
    		}
    		if(key == 'normalLineCnt'){
    			dataObj.mtsoVrfRsltVal = 'S';
    			popup('LineVrfStcLkup',$('#ctx').val()+'/configmgmt/tnbdgm/LineVrfStcLkup.do','정상 회선 내역',dataObj)
    		}
    		if(key =='errorLineCnt'){
    			dataObj.mtsoVrfRsltVal = 'F';
    			popup('LineVrfStcLkup',$('#ctx').val()+'/configmgmt/tnbdgm/LineVrfStcLkup.do','이상 회선 내역',dataObj)
    		}
    	});


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

        $('#btnExportExcel').on('click', function(e) {
       		//tango transmission biz 모듈을 호출하여야한다.
       		 var param =  $("#searchForm").getData();


       		 param = gridExcelColumn(param, gridId);
       		 param.pageNo = 1;
       		 param.rowPerPage = 10;
       		 param.firstRowIndex = 1;
       		 param.lastRowIndex = 1000000000;


       		 param.fileName = '회선검증통계';
       		 param.fileExtension = "xlsx";
       		 param.excelPageDown = "N";
       		 param.excelUpload = "N";
       		 param.method = "getLineVrfStcList";

       		 $('#'+gridId).alopexGrid('showProgress');
    	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/excelcreate', param, 'GET', 'excelDownload');
            });
    };

	/*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
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
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   	}

    	if(flag == 'org'){
    		$('#org').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


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
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'], uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#team').setData({
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
    	/*
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
		}
		*/
    	if(flag == 'svlnLclSclCode'){
    		var tmpMgmtCd = '0002'
			var tmpMgmtCdNm = 'SKB'
			svlnLclSclCodeData = response;
			var svlnLclCd_option_data =  [];
			var tmpFirstSclCd = "";

			svlnLclCd_option_data.push({"uprComCd":"","value":"","text":configMsgArray['all']});
			for(i=0; i<response.svlnLclCdList.length; i++){
				var dataL = response.svlnLclCdList[i];
				if(i==0){
					tmpFirstSclCd = dataL.value;
				}

				if(nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataL.cdFltrgVal) || "ALL" == nullToEmpty(dataL.cdFltrgVal) ){
					if(dataL.value != '004'){
						svlnLclCd_option_data.push(dataL);
					}
				}
			}
			$('#svlnLclCd').clear();
			$('#svlnLclCd').setData({data : svlnLclCd_option_data});


			var svlnSclCd_option_data =  [];
			var svlnSclCd2_option_data =  [];

			var tmpSvlnLclCd = $('#svlnLclCd').val();

			if(tmpSvlnLclCd == ""){
				svlnSclCd_option_data.push({"uprComCd":"","value":"","text":configMsgArray['all']});
				svlnSclCd2_option_data.push({"uprComCd":"","value":"","text":configMsgArray['all']});
			}

			for(k=0; k<response.svlnSclCdList.length; k++){

				skBb2bSvlnSclCdData.push(response.svlnSclCdList[k]);
				if(k==0 && tmpFirstSclCd =="005"){
					var dataFst = {"uprComCd":"","value":"","text":configMsgArray['all']};
					svlnSclCd_option_data.push(dataFst);
					svlnSclCd2_option_data.push(dataFst);
				}

				var dataOption = response.svlnSclCdList[k];
				if(nullToEmpty(tmpSvlnLclCd) == nullToEmpty(dataOption.uprComCd)
						&& ("ALL" == nullToEmpty(dataOption.cdFltrgVal) || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataOption.cdFltrgVal) )){
					svlnSclCd_option_data.push(dataOption);
				}

				svlnSclCd2_option_data.push(dataOption);

			}
			svlnSclCdData = svlnSclCd2_option_data;
			$('#svlnSclCd').clear();
			$('#svlnSclCd').setData({data : svlnSclCd_option_data});
		}


    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId,response.lineVrfStcList);
    	}

    	//엑셀다운로드
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

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }
/*
	//서비스회선 대분류 변경
    function changeSvlnLclCd(svlnLclId, svlnSclId, svlnCdData, mgmtGrpId, selGbn){
    	if(svlnCdData != null){
    		var selPrePendStr = "";
    		if(selGbn == 'S'){
    			//selPrePendStr = '<option value="">선택</option>';
    			selPrePendStr = cflineCommMsgArray['select']  선택 ;
    		}else if(selGbn == 'N'){
    			selPrePendStr = "";
    		}else{
    			//selPrePendStr = '<option value="">전체</option>';
    			selPrePendStr = cflineCommMsgArray['all']  전체 ;
    		}
    	 	var tmpMgmtCd = $('#' + mgmtGrpId).val();
    	 	var tmpMgmtCdNm = $('#' + mgmtGrpId + ' option:selected').text();

    	 	var tmpSvlnLclCd = $('#' + svlnLclId).val();
    	 	if(svlnCdData.svlnLclCdList != null){
    			var svlnLclCd_option_data =  [];
    			for(i=0; i<svlnCdData.svlnLclCdList.length; i++){
    				if(i==0 && selPrePendStr != ""){
    					var dataFst = {"uprComCd":"","value":"","text":selPrePendStr};
    					svlnLclCd_option_data.push(dataFst);
    				}
    				var dataL = svlnCdData.svlnLclCdList[i];

    				if(nullToEmpty(tmpMgmtCdNm) == "" || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataL.cdFltrgVal) || "ALL" == nullToEmpty(dataL.cdFltrgVal)  ){
    					svlnLclCd_option_data.push(dataL);
    				}

    			}
    			$('#' + svlnLclId).clear();
    			$('#' + svlnLclId).setData({data : svlnLclCd_option_data});

    			$('#' + svlnLclId).setSelected(tmpSvlnLclCd);
    	 	}
    	}
    }
 	*/
  //서비스회선 소분류 변경
    function changeSvlnSclCd(svlnLclId, svlnSclId, svlnSclCdData){

     	var svlnLclCd = $('#' + svlnLclId).val();
     	var tmpSvlnSclCd = $('#' + svlnSclId).val();
     	var mgmtGrpVal = '0002';
     	var tmpMgmtCdNm = 'SKB';

    	var svlnSclCd_option_data =  [];
     	if(svlnLclCd != null && svlnLclCd != ""){
    		for(m=0; m<svlnSclCdData.length; m++){
    			var dataS = svlnSclCdData[m];

    			if(dataS.value == "" && (svlnLclCd == "005")){// B2B회선인 경우 전체 는 무조건 포함
    				svlnSclCd_option_data.push(dataS);
    			}else if(m==0 && dataS.value != "" && (svlnLclCd == "005")){
    				var dataFst = {"uprComCd":"","value":"","text": configMsgArray['all']};
    				svlnSclCd_option_data.push(dataFst);
    			}
    			if(nullToEmpty(svlnLclCd) == dataS.uprComCd){

    				if(nullToEmpty(tmpMgmtCdNm) == "" || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataS.cdFltrgVal) || "ALL" == nullToEmpty(dataS.cdFltrgVal) ){
    					svlnSclCd_option_data.push(dataS);
    				}
    			}
    		}
    		if(nullToEmpty(mgmtGrpVal)=="0002" && nullToEmpty(svlnLclCd) =="005"){
    			tmpSvlnSclCd = "009";
    		}
    		$('#' + svlnSclId).clear();
    		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
    		$('#' + svlnSclId).setSelected(tmpSvlnSclCd);

     	}else{
    		/*for(m=0; m<svlnSclCdData.length; m++){
    			var dataS = svlnSclCdData[m];

    			if(dataS.value == ""){
    				svlnSclCd_option_data.push(dataS);
    			}
//    			console.log("2tmpMgmtCdNm : " + tmpMgmtCdNm + " ==== " + dataS.cdFltrgVal);
    			if(nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataS.cdFltrgVal) || "ALL" == nullToEmpty(dataS.cdFltrgVal) ){
    				svlnSclCd_option_data.push(dataS);
    			}
    		}
    		*/
     		var dataFst = {"uprComCd":"","value":"","text": configMsgArray['all']};
			svlnSclCd_option_data.push(dataFst);
			$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
    	}


    }
    function popup(pidData, urlData, titleData, paramData) {
    	$a.popup({
    		popid: pidData,
    		title: titleData,
    		url: urlData,
    		data: paramData,
    		iframe: false,
			modal : false,
			windowpopup : true,
    		width : 1100,
    		height : window.innerHeight * 0.7
    	});
    }

    this.setGrid = function(e){
 		 var param =  $("#searchForm").serialize();
 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/getLineVrfStcList', param, 'GET', 'search');
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

    function setSPGrid(GridID, Data) {
	       	$('#'+GridID).alopexGrid('dataSet', Data);

	}
});