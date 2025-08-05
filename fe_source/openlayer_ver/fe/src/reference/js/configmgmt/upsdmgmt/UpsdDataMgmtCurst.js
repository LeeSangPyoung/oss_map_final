/**
 * UpsdDataMgmtCurst.js
 *
 * @author Administrator
 * @date 2017. 10. 11.
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();
    	initGrid();
        setEventListener();
        setDate();
    	//main.setGrid(1,100);
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
    		columnMapping: [{
				align:'center',
				title : configMsgArray['sequence'],
				width: '40px',
				numberingColumn: true
    		}, {
				key : 'saveTime', align:'center',
				title : '저장일자',
				width: '100px'
			}, {
				key : 'orgNm', align:'center',
				title : '본부',
				width: '90'
			}, {
				key : 'teamNm', align:'center',
				title : '팀',
				width: '90'
			}, {
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '90'
			},  {
				key : 'mtsoTyp', align : 'center',
				title : '국사유형',
				width : '90' //MTSO_TYP
			},  {
				key : 'intgMtsoId', align : 'center',
				title : '국사ID(통합국ID)',
				width : '90' //MTSO_TYP
			},   {
				key : 'sisulNm', align : 'center',
				title : '국사명(통합국명)',
				width : '110px'
			}, {
				key : 'floorLabel', align : 'center',
				title : '국소명(라벨명)',
				width : '110px'
			}, {
				key : 'floorName', align : 'center',
				title : '층',
				width : '40px'
			}, {
				key : 'updateFlagNm', align : 'center',
				title : '상태',
				width : '60px'
			}, {
				key : 'loginId', align : 'center',
				title : 'ID',
				width : '60px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
		var searchInspectCd = {supCd : '007000'};
		var searchGubun = {supCd : '008000'};
		var searchWorkGubun = "SKT";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ searchWorkGubun, null, 'GET', 'fstOrg');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchInspectCd, 'GET', 'searchInspectCd');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchGubun, 'GET', 'searchGubun');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');

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
    		 if($('#searchStartDate').val() > $('#searchEndDate').val()) {
    			callMsgBox('','I', '종료일이시작일보다 작습니다. 저장일자를 다시 입력해 주세요.', function(msgId, msgRst){});
  	     		return;
    		 }
    		 main.setGrid(1,perPage);
         });

    	//엔터키로 조회
    	 $('#searchForm').on('keydown', function(e){
    		 if (e.which == 13  ){
    			 if($('#searchStartDate').val() > $('#searchEndDate').val()) {
    				 callMsgBox('','I', '종료일이시작일보다 작습니다. 저장일자를 다시 입력해 주세요.', function(msgId, msgRst){});
    				 return;
    			 }
    			 main.setGrid(1,perPage);
    		 }
    	 });

    	 $('#searchWorkGubun').on('change', function(e) {

       		 var mgmtGrpNm = $("#searchWorkGubun").val();

       		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

       		 var option_data =  null;
    			if($('#searchWorkGubun').val() == "SKT"){
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
       			 var mgmtGrpNm = $("#searchWorkGubun").val();

       			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
       		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

       		 }else{
       			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
       			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
       		 }
            });
      // 	팀을 선택했을 경우
    	 $('#teamId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#teamId").getData();

     	 	 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		 var mgmtGrpNm = $("#searchWorkGubun").val();

    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }

    	 });

    	 $('#rtfTab').on('click', function(e) {
    		 location.href = 'DrawRackEqpAttrHis.do';
         });

    		 var option_data =  null;
    			if($('#searchWorkGubun').val() == "SKT"){
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

	};

	function successCallback(response, status, jqxhr, flag){
		//본부 콤보박스
		if(flag == 'searchInspectCd'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		if(flag == 'fstOrg'){
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

		if(flag == 'fstTeam'){
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

    		var option_data = [{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['all']}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#tmofList').setData({
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

		//용도구분
		if(flag == 'searchGubun'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		for(var i=0; i<response.usrHisList.length; i++) {
    			if(response.usrHisList[i].floorName=="" || response.usrHisList[i].floorName==null) {
    				response.usrHisList[i].floorName="층 없음";
    			}else {
    				response.usrHisList[i].floorName = response.usrHisList[i].floorName + "층";
    			}
    		}
    		setSPGrid(gridId,response, response.usrHisList);
    	}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

 		 var param =  $("#searchForm").serialize();

 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUsrHisList', param, 'GET', 'search');
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

    function setDate() {
    	var date = new Date();
    	var end = new Date(Date.parse(date)-0*1000*60*60*24);
    	/* var start = new Date(); */

    	var yyyyend = end.getFullYear();
    	var mmend   = end.getMonth()+1;
    	var ddend   = end.getDate();

    	if(mmend < 10){
    		mmend = "0"+mmend;
    }
    	if(ddend < 10){
    		ddend = "0"+ddend;
    	}

    	var endFullDate = yyyyend+"-"+mmend+"-"+ddend;


    	var startDate = new Date(end);
    	var start = new Date(Date.parse(date)-30*1000*60*60*24);

    	var yyyystart = start.getFullYear();
    	var mmstart   = start.getMonth()+1;
    	var ddstart   = start.getDate();

    	if(mmstart < 10){
    		mmstart = "0"+mmstart;
    	}
    	if(ddstart < 10){
    		ddstart = "0"+ddstart;
    	}

    	var startFullDate = yyyystart+"-"+mmstart+"-"+ddstart

    	$('#searchStartDate').val(startFullDate);
    	$('#searchEndDate').val(endFullDate);
    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

});