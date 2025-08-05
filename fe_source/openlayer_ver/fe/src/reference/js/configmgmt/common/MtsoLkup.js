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
	var intgFcltsCdParam = "";
	var fromCifMtsoYn = "";
	var swingCdSearch = "N";

	var AcsnwOrgid = null;  //20180107 A망팀 Core운용 팀 매핑 정보 Global 변수에 추가 - 서영응

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	if(param.regYn == "Y"){
    		paramData = param;
    	}

    	if(param.swingCdSearch == "Y"){
    		swingCdSearch = "Y";
    	 }


    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();

        //중통집 후보추가시 넘어오는 파라미터
        if(param.fromCifMtsoYn == "Y"){
        	fromCifMtsoYn = "Y";
        	$('#btnMtsoMapPop').hide();
        }

        if(param.autoSearchYn == "Y"){
        	setList(param);
        }
    };

    function setRegDataSet(data) {
//    	$('#contentArea').setData(data);

    	if(data.mtsoMapInsYn == "Y"){			// 국사 조회시 지도입력여부 파라미터 받으면 조건에 지도입력여부 Y로 두고 비활성 (2021-0-21, yeseo)
    		 $('#mtsoMapInsYn').setData({
    			 mtsoMapInsYn:"Y"
    			});
         	$('#mtsoMapInsYn').setEnabled(false);
         }

    	$('#mgmtGrpNm').val(data.mgmtGrpNm);
    	$('#org').setData({
    		orgId:data.orgId
		});
    	$('#team').setData({
    		teamId:data.teamId
		});
    	$('#tmof').setData({
    		tmof:data.tmof
		});
		$('#mtsoStatCd').setData({
			mtsoStatCd:"01"
		});
    	$('#mtsoNm').val(data.mtsoNm);
    	$('#bldAddr').val(data.bldAddr);
    	$('#intgFcltsCd').val(data.intgFcltsCd);

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
				width: '100px'
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '150px'
			}, {/* 국사약어명		 */
				key : 'mtsoAbbrNm', align:'center',
				title : '국사약어명',
				width: '150px'
			},{/* 국사유형		 */
				key : 'mtsoTyp', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px'
			}, {/* 국사상태		 */
				key : 'mtsoStat', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'],
				width: '100px'
			},{/* 국사세부유형    */
				key : 'mtsoDetlTypNm', align:'center',
				title : '국사세부유형',
				width: '120px'
			},{/* 지도입력여부    */
				key : 'mtsoMapInsYn', align:'center',
				title : '지도입력여부',
				width: '100px'
			},{/* 대표통시코드    */
				key : 'repIntgFcltsCd', align:'center',
				title : '대표통시코드',
				width: '120px'
			},{/* UKEY국사코드    */
				key : 'ukeyMtsoId', align:'center',
				title : 'SWING국사코드',
				width: '120px'
			},{/* 건물주소		 */
				key : 'bldAddr', align:'center',
				title : configMsgArray['buildingAddress'],
				width: '200px'
			},{/* 건물명		 */
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
			},{/* UKEY동코드--숨김데이터	 */
				key : 'ldongCd', align:'center',
				title : configMsgArray['ukeyDongCode'],
				width: '100px'
			},{/* UKEY구분코드--숨김데이터	 */
				key : 'bunjiTypCd', align:'center',
				title : configMsgArray['ukeyDivisionCode'],
				width: '100px'
			},{/* UKEY대번지주소--숨김데이터   */
				key : 'mainBunjiCtt', align:'center',
				title : configMsgArray['ukeyBigBunjiAddress'],
				width: '100px'
			},{/* UKEY소번지주소--숨김데이터   */
				key : 'subBunjiCtt', align:'center',
				title : configMsgArray['ukeySmallBunjiAddress'],
				width: '100px'
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
				width: '120px'
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
    	if(JSON.stringify(param).length > 2){
        	$('#pageNo').val(1);
        	$('#rowPerPage').val(100);

        	param.page = 1;
        	param.rowPerPage = 100;
        	$('#'+gridId).alopexGrid('showProgress');
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoLkup', param, 'GET', 'search');
        }
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

		 var op = $('#'+gridId).alopexGrid('readOption');

		 if(mgmtGrpCd == "SKT"){
			 $('#intgFcltsCdLabel').html("국사통시코드") ;
			 $('#mtsoAbbrNmLkupLabel').html("국사약어명") ;
			 $('#'+gridId).alopexGrid("showCol", 'repIntgFcltsCd');
			 $('#'+gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
			 op.columnMapping[6].title = "국사약어명" ;
		 }else{
			 $('#intgFcltsCdLabel').html("SWING국사코드") ;
			 $('#mtsoAbbrNmLkupLabel').html("GIS국사명") ;
			 $('#'+gridId).alopexGrid("hideCol", 'repIntgFcltsCd', 'conceal');
			 $('#'+gridId).alopexGrid("showCol", 'ukeyMtsoId');
			 op.columnMapping[6].title = "GIS국사명" ;
		 }

		 $('#'+gridId).alopexGrid('updateOption', {
 			  columnMapping: op.columnMapping
 		 });

		//관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpCd, null, 'GET', 'fstOrg');

//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpCd, null, 'GET', 'fstTeam');
//	   	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpCd, null, 'GET', 'tmof');

    	//하드코딩 되어져있는 국사명 변경
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00293', null, 'GET', 'mtsoTyp');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStat');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02016', null, 'GET', 'mtsoDetlTyp');

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'getUserJrdtTmofInfo');


    	var sOrgId = null ;
    	if( $("#sOrgId").val() != ""){
    		sOrgId = $("#sOrgId").val()
    	}
    	if (sOrgId != null) {
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/acsnwTeamOrg/' + sOrgId, null, 'GET', 'acsnwTeam'); //20180107 A망팀 Core운용 팀 매핑 정보 Global 변수에 추가 - 서영응
    	}

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

       //등록
     	 $('#btnRegPop').on('click', function(e) {
     		 /* 장비등록     	 */
//     		 popup('EqpRegPop', $('#ctx').val()+'/configmgmt/equipment/EqpReg.do', configMsgArray['equipmentRegistration'], dataParam);
     		 var mgmtGrpNm = $("#mgmtGrpNm").val();
     		 var intgFcltsCd = "";
     		 if(mgmtGrpNm == "SKT"){
     			intgFcltsCd = $('#intgFcltsCd').val();
     		 }
     		 window.open('MtsoList.do?fromOther=Y&intgFcltsCd='+intgFcltsCd);
          });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

    		 var op = $('#'+gridId).alopexGrid('readOption');

    		 if(mgmtGrpNm == "SKT"){
    			 $('#intgFcltsCdLabel').html("국사통시코드") ;
    			 $('#mtsoAbbrNmLkupLabel').html("국사약어명") ;
    			 $('#'+gridId).alopexGrid("showCol", 'repIntgFcltsCd');
    			 $('#'+gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
    			 op.columnMapping[6].title = "국사약어명" ;
    			 $('#intgFcltsCd').val(intgFcltsCdParam);
    		 }else{
    			 $('#intgFcltsCdLabel').html("SWING국사코드") ;
    			 $('#mtsoAbbrNmLkupLabel').html("GIS국사명") ;
    			 $('#'+gridId).alopexGrid("hideCol", 'repIntgFcltsCd', 'conceal');
    			 $('#'+gridId).alopexGrid("showCol", 'ukeyMtsoId');
    			 op.columnMapping[6].title = "GIS국사명" ;
    			 intgFcltsCdParam = $('#intgFcltsCd').val();
    			 $('#intgFcltsCd').val("");
    		 }

    		 $('#'+gridId).alopexGrid('updateOption', {
    			  columnMapping: op.columnMapping
    		 });

    		 var option_data =  null;
  			if($('#mgmtGrpNm').val() == "SKT"){
  				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
  								{comCd: "1",comCdNm: "전송실"},
  								{comCd: "2",comCdNm: "중심국사"},
  								{comCd: "3",comCdNm: "기지국사"},
  								{comCd: "4",comCdNm: "국소"}
  								];
  			}else if ($('#mgmtGrpNm').val() == "SKB" && swingCdSearch == "Y") {
 				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
//					{comCd: "1",comCdNm: "정보센터"},
					{comCd: "2",comCdNm: "국사"},
					{comCd: "4",comCdNm: "국소"}
					];
  			}else{
  				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
  								{comCd: "1",comCdNm: "정보센터"},
  								{comCd: "2",comCdNm: "국사"},
  								{comCd: "4",comCdNm: "국소"}
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

    	 $('#btnAddrSearch').on('click', function(e) {
    		 $a.popup({
    				popid : 'SearchAddress',
    				url: '/tango-transmission-web/demandmgmt/buildinginfomgmt/SearchAddress.do',
    				modal : true,
    				width : 830,
    				height : 630,
    				title : '주소 검색',
    				movable : true,
    				callback : function(data){
    					console.log(data);

    					var bunji = "";

    					if(data.selectSmlBunjiVal != "") {
//    						if(data.selectSmlBunjiVal != "0") {
    							bunji = data.selectBigBunjiVal + "-" + data.selectSmlBunjiVal;
//    						}
//    						else {
//    							bunji = data.selectBigBunjiVal;
//    							console.log(" data.selectSmlBunjiVal : " + data.selectSmlBunjiVal );
//    						}
    					}
    					else {
    						bunji = data.selectBigBunjiVal;
    					}

    					console.log("bunji : " + bunji);

    					var lndDivCd = "";

    					if(data.selectLndDivCd == "2") {
    						lndDivCd = "산 ";
    					}
    					else if(data.selectLndDivCd == "3") {
    						lndDivCd = "블록 ";
    					}

    					var finalBunji = "";

    					if(data.selectLndDivCd == "3" && bunji == "") {
    						finalBunji = "블록";
    					}
    					else {
    						finalBunji = lndDivCd + bunji;
    					}

    					console.log("finalBunji : " + finalBunji);

    					$('#bldAddrSearch').val(data.selectAllAddr + " " + finalBunji);
    					$('#bunjiVal').val(bunji);
    					$('#ldongCd').val(data.selectLdongCd);
    				}
    			});
		 });

    	 $('#btnAddrDel').on('click', function(e) {
    		 $('#bldAddrSearch').val("");
    		 $('#bunjiVal').val("");
    		 $('#ldongCd').val("");
    	 });

    	 $('#btnMtsoMapPop').on('click', function(e) {
    		 $a.popup({
 			  	popid: 'MtsoMapPop',
 			  	title: '국사 지도 조회',
 			      url: '/tango-transmission-web/configmgmt/common/MtsoMapSearch.do',
 			      windowpopup : true,
 			      modal: true,
 			      movable:true,
 			      width : 1300,
 			      height : 900,
 			     callback : function(data) { // 팝업창을 닫을 때 실행
 			    	window.close();
 	           	}
 			});
    	 });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	 //$a.navigate($('#ctx').val()+'/configmgmt/common/MtsoReg.do',dataObj);
    	 	//alert(JSON.stringify(dataObj));
    	 	if(fromCifMtsoYn == "Y"){

    	 		if (dataObj.mgmtGrpNm == "SKB") {
    				callMsgBox('','W', 'SKB 국사는 후보로 등록할 수 없습니다.', function(msgId, msgRst){});
    	     		return;
    	     	}

    	 		if (dataObj.mtsoTypCd == "1" || dataObj.mtsoTypCd == "2") {
    				callMsgBox('','W', '전송실이나 중심국사는 후보로 등록할 수 없습니다.', function(msgId, msgRst){});
    	     		return;
    	     	}

    	 		//후보등록, 인수요청, 보완요청, 해제대상, 해제요청
    	 		if (dataObj.cifTakeAprvStatCd == "01" || dataObj.cifTakeAprvStatCd == "02" || dataObj.cifTakeAprvStatCd == "03" || dataObj.cifTakeRlesStatCd == "01" || dataObj.cifTakeRlesStatCd == "02") {
    	 			var msg = "";
    	 			if(dataObj.cifTakeAprvStatCd != undefined){
    	 				msg = dataObj.cifTakeAprvStatNm;
    	 			}else if(dataObj.cifTakeRlesStatCd != undefined){
    	 				msg = dataObj.cifTakeRlesStatNm;
    	 			}
    				callMsgBox('','W', '현재 ['+msg+'] 상태로 후보 등록 할 수 없습니다.', function(msgId, msgRst){});
    	     		return;
    	     	}

    	 		dataObj.regYn = "Y";
          	 	if(dataObj.ukeyMtsoId == "수동등록"){
          	 		dataObj.ukeyMtsoId = "";
          	 	}
          	 	dataObj.aprvRlesVal = $('#aprvRlesVal').val();
          	 	dataObj.fromCifMtsoYn = "Y";
          	 	if(dataObj.cifSlfLesCd == undefined){
          	 		dataObj.cifSlfLesCd = "";
          	 	}
          	 	if(dataObj.rcuIpVal == undefined){
          	 		dataObj.rcuIpVal = "";
          	 	}
          	 	if(dataObj.cifMtsoCntrTypCd == undefined){
          	 		dataObj.cifMtsoCntrTypCd = "";
          	 	}

          	 	/* 국사 상세정보 */
        	 	$a.popup({
    			  	popid: 'MtsoRegPop2',
    			  	title: '국사 상세정보',
    			      url: '/tango-transmission-web/configmgmt/common/MtsoRegPop.do',
    			      data: dataObj,
    			      windowpopup : true,
    			      modal: true,
    			      movable:true,
    			      width : 865,
    			      height : 820,
    			      callback : function(data) { // 팝업창을 닫을 때 실행
    	 			    	window.close();
    	 	           	}
    			});
    	 	}else{
    	 		$a.close(dataObj);
    	 	}

    	 });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });

	};

	function successCallback(response, status, jqxhr, flag){

		//관리그룹
    	/*if(flag == 'mgmtGrpNm'){

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
    	}*/

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
 								{comCd: "3",comCdNm: "기지국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}else if ($('#mgmtGrpNm').val() == "SKB" && swingCdSearch == "Y") {      //SWING 국사코드 입력시에 정보센터 제거
 				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
						{comCd: "2",comCdNm: "국사"},
						{comCd: "4",comCdNm: "국소"}
						];
	        }else{
 				option_data =  [{comCd: "",comCdNm: configMsgArray['all']},
 								{comCd: "1",comCdNm: "정보센터"},
 								{comCd: "2",comCdNm: "국사"},
 								{comCd: "4",comCdNm: "국소"}
 								];
 			}

			$('#mtsoTypCd').setData({
	             data:option_data
			});
    	}

    	//본부 콤보박스
    	if(flag == 'fstOrg'){
    		/*var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#org').setData({
                 data:option_data
    		});*/

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
						}else if("" == sUprOrgId){
							//DCN등록 화면에서 넘어올때 전송실 정보만 갖고 올 경우를 위해 추가함 20180806
							selectId = "";
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
	   		if(selectId == ""){
	   			//DCN등록 화면에서 넘어올때 전송실 정보만 갖고 올 경우를 위해 추가함 20180806
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ paramData.mgmtGrpNm, null, 'GET', 'team');
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ paramData.mgmtGrpNm, null, 'GET', 'tmof');
	   		}else{
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   		}
    	}

    	if(flag == 'org'){
    		$('#org').clear();
//    		$('#team').clear();
//    		$('#tmof').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

//    		$('#team').setData({
//                 data:option_data
//    		});
//
//    		$('#tmof').setData({
//                data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['all']}]
//    		});

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#org').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'fstTeam'){
    		/*$('#team').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#team').setData({
                 data:option_data
    		});*/

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
  	    		if(selectId == null){			// 20180107 A망 소속 사용자 Core운영팀 매핑 정보 - 서영응
//  	    			selectId = response[0].orgId;
  	    			if (AcsnwOrgid != null ) {
  	    				selectId = AcsnwOrgid[0].uprOrgId;
  	    			}
  	    			else {
  	    				selectId = response[0].orgId;
  	    			}


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

//    		$('#tmof').setData({
//                data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['all']}]
//    		});
    	}

		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			if(paramData == '' || paramData == null) {
    			$('#tmof').setData({
    	             data:option_data
    			});
    		}
    		else {
    			$('#tmof').setData({
    	             data:option_data,
    	             tmof:paramData.tmof
    			});
    		}
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

		//국사세부유형 콤보 박스
    	if(flag == 'mtsoDetlTyp'){
    		$('#mtsoDetlTypCd').clear();

    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#mtsoDetlTypCd').setData({
                 data:option_data
    		});
    	}

		//국사 조회시
		if(flag == 'search'){
			$('#'+gridId).alopexGrid('hideProgress');
			setSPGrid(gridId,response, response.mtsoLkupList);
		}

		// 사용자 관할 전송실(일반)
		if (flag == 'getUserJrdtTmofInfo') {
			userJrdtTmofInfo = response.userJrdtTmofInfo;
			var userTmof = "";
			var userJrdtTmofMgmtCd = "";

			// 소속전송실 셋팅
			for (var i = 0 ; i < userJrdtTmofInfo.length; i++) {
				if (userJrdtTmofInfo[i].blgtTmofYn == 'Y') {
					userTmof = userJrdtTmofInfo[i].jrdtTmofId;
					break;
				} else if (userJrdtTmofInfo[i].jrdtTmofId == '0') {
					userTmof = userJrdtTmofInfo[i].jrdtTmofId;
					break;
				}
			}
			//console.log(userTmof);
			// 설정된 소속전송실이 없는경우
			if (userTmof == "0") {
				//$('#topMtsoIdList').setSelected();
				//alert($('#topMtsoIdList option:first').val());
				userTmof = "";
			}

//			$('#tmof').setSelected(userTmof);
			$('#tmof').setData({
				tmof:userTmof
			});
//			$('#tmof').setSelected(userTmof);
			//console.log("111전송실 : " + $('#userJrdtTmofMgmtCd').val());
			//console.log(userTmof);
		}
		if (flag == 'acsnwTeam') {			// 20180107 A망팀 Core운용 팀 매핑 정보 Global 변수에 추가 - 서영응
			if (response.length > 0) {
				AcsnwOrgid = response;
			}
			else {
				AcsnwOrgid = null;
			}


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

    	 param.swingCdSearch = swingCdSearch;

		 $('#'+gridId).alopexGrid('showProgress');
		 //httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsolkup', param, successCallback, failCallback, 'GET', 'search');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsoLkup', param, 'GET', 'search');
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