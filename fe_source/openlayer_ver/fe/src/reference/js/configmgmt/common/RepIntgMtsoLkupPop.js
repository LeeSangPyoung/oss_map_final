/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;



    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {



    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();

    };

    function setRegDataSet(data) {

    	$('#mtsoStatCd').setData({
			mtsoStatCd:"01"
		});
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
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 관리그룹            */
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px'
    		}, {/* 본부			 */
				key : 'orgNm', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px'
    		}, {/* 팀ID 			 */
				key : 'teamId', align:'center',
				title : configMsgArray['team'],
				width: '100px'
			}, {/* 팀 			 */
				key : 'teamNm', align:'center',
				title : configMsgArray['team'],
				width: '100px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '150px'
			},{/* 국사유형		 */
				key : 'mtsoTypNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px'
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '120px'
			}, {/* 국사상태		 */
				key : 'mtsoStatNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'],
				width: '80px'
			},{/* 대표통시코드    */
				key : 'repIntgFcltsCd', align:'center',
				title : '대표통시코드',
				width: '100px'
			},{/* 건물주소		 */
				key : 'bldAddr', align:'center',
				title : configMsgArray['buildingAddress'],
				width: '200px'
			},{/* 건물명		 */
				key : 'bldNm', align:'center',
				title : '건물명',
				width: '130px'
			}, {/* 국사ID	 */
				key : 'mtsoId', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeIdentification'],
				width: '120px'
			},{/* 건물코드	 */
				key : 'bldCd', align:'center',
				title : configMsgArray['buildingCode'],
				width: '120px'
			},{/* 사이트키	 */
				key : 'siteCd', align:'center',
				title : '사이트키',
				width: '150px'
			},{/* 사이트명	 */
				key : 'siteNm', align:'center',
				title : '사이트명',
				width: '150px'
			}],
			message: {/* 데이터가 없습니다.   */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['teamId', 'bldblkNo', 'bldFlorNo', 'ldongCd', 'bunjiTypCd', 'mainBunjiCtt', 'subBunjiCtt'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setList(param){

    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		 var mgmtGrpCd;
		 if(paramData == '' || paramData == null) {
			 mgmtGrpCd = chrrOrgGrpCd;
		 }else{
			 mgmtGrpCd = paramData.mgmtGrpNm;
		 }



		//관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpCd, null, 'GET', 'fstOrg');

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpCd, null, 'GET', 'team');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpCd, null, 'GET', 'tmof');

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStat');



    }


    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	setGrid(1, eObj.perPage);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setGrid(1,perPage);
       		}
     	 });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

    		 var option_data =  null;
  			if($('#mgmtGrpNm').val() == "SKT"){
  				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
  								{comCd: "1",comCdNm: "전송실"},
  								{comCd: "2",comCdNm: "중심국사"},
  								];
  			}else{
  				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
  								{comCd: "1",comCdNm: "정보센터"},
  								];
  			}

 			$('#mtsoTypCd').setData({
 	             data:option_data
 			});

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

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
//    	 	alert(JSON.stringify(dataObj));
    	 	$a.close({'repIntgFcltsCd' : dataObj.repIntgFcltsCd});

    	 });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });


    };

	function successCallback(response, status, jqxhr, flag){

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
				if(paramData == '' || paramData == null) {
	    			$('#mgmtGrpNm').setData({
	    				data:response ,
	    				mgmtGrpNm:selectId
	    			});
	    		}
	    		else {
	    			$('#mgmtGrpNm').setData({
	    	             data:response,
	    	             mgmtGrpNm:paramData.mgmtGrpNm
	    			});
	    		}
			}

			var option_data =  null;
 			if($('#mgmtGrpNm').val() == "SKT"){
 				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
 								{comCd: "1",comCdNm: "전송실"},
 								{comCd: "2",comCdNm: "중심국사"},
 								];
 			}else{
 				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
 								{comCd: "1",comCdNm: "정보센터"},
 								];
 			}

			$('#mtsoTypCd').setData({
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

			$('#org').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
		    		for(var i=0; i<response.length; i++){
		    			var resObj = response[i];
		    			option_data.push(resObj);
		    		}

		    		$('#org').setData({
						data:option_data
					});
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

		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId,response, response.repIntgMtsoLkupList);
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
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();


		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/repIntgMtsoLkup', param, 'GET', 'search');

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