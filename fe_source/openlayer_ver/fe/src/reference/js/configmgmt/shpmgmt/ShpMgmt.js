/**
 * ShpMgmt.js
 *
 * @author Administrator
 * @date 2016. 8. 22. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var rackGridId = 'dataGridRack';
	var shlfGridId = 'dataGridShlf';
	var cardGridId = 'dataGridCard';
	var fileOnDemendName = "";

	/*if(document.getElementById("rack").checked == true){
		$('#gubunValue').val('rack');
		gridId = 'dataGridRack';
	}else if(document.getElementById("shlf").checked == true){
		$('#gubunValue').val('shlf');
		gridId = 'dataGridShlf';
	}else if(document.getElementById("card").checked == true){
		$('#gubunValue').val('card');
		gridId = 'dataGridCard';
	}*/

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
    };

  //Grid 초기화
    function initGrid() {

//    	if(gridId == 'dataGridRack'){

            //그리드 생성
            $('#'+rackGridId).alopexGrid({
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
    				width: '40px',
    				numberingColumn: true
    			}, {
    				key : 'topMtsoNm', align:'center',
    				title : configMsgArray['transmissionOffice'],
    				width: '130px'
    			}, {
    				key : 'mtsoNm', align:'center',
    				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
    				width: '130px'
    			}, {
    				key : 'eqpRoleDivNm', align:'center',
    				title : configMsgArray['equipmentType'],
    				width: '100px'
    			}, {
    				key : 'bpNm', align:'center',
    				title : configMsgArray['vend'],
    				width: '100px'
    			}, {
    				key : 'eqpMdlNm', align:'center',
    				title : configMsgArray['equipmentModelName'],
    				width: '120px'
    			}, {
    				key : 'eqpId', align:'center',
    				title : '장비ID',
    				width: '110px'
    			}, {
    				key : 'eqpNm', align:'center',
    				title : '장비명',
    				width: '150px'
    			/*}, {
    				key : 'rackTypNm', align:'center',
    				title : 'Rack유형',
    				width: '110px'*/
    			}, {
    				key : 'rackNo', align:'center',
    				title : 'Rack No',
    				width: '110px'
    			}, {
    				key : 'rackNm', align:'center',
    				title : 'Rack명',
    				width: '90px'
    			}, {
    				key : 'barNoRack', align:'center',
    				title : '바코드번호',
    				width: '90px'
    			}, {
    				key : 'rackUseYn', align:'center',
    				title : '사용여부',
    				width: '90px'
    			}, {
    				key : 'shlfCnt', align:'center',
    				title : 'Shelf수',
    				width: '90px'
    			},{
    				key : 'frstRegDate', align:'center',
    				title : '등록일',
    				width: '100px'
    			},{
    				key : 'frstRegUserId', align:'center',
    				title : '등록자',
    				width: '100px'
    			}, {
    				key : 'lastChgDate', align:'center',
    				title : '변경일',
    				width: '100px'
    			},{
    				key : 'lastChgUserId', align:'center',
    				title : '변경자',
    				width: '100px'
    			}],
				message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
            });

//         } else if(gridId == 'dataGridShlf'){

        //그리드 생성
        $('#'+shlfGridId).alopexGrid({
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
				width: '40px',
				numberingColumn: true
			}, {
				key : 'topMtsoNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '130px'
			}, {
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '130px'
			}, {
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			}, {
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '120px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '110px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '150px'
			}, {
				key : 'rackNm', align:'center',
				title : 'Rack명',
				width: '90px'
			}, {
				key : 'shlfNo', align:'center',
				title : 'Shelf No',
				width: '100px'
			}, {key : 'shlfNm', align:'center',
				title : 'Shelf명',
				width: '180px'
			}, {
				key : 'shlfTypNm', align:'center',
				title : 'Shelf유형',
				width: '90px'
			}, {
				key : 'ukeyShlfTidVal', align:'center',
				title : 'U.Key Shelf TID',
				width: '90px'
			}, {
				key : 'shlfUseYn', align:'center',
				title : '사용여부',
				width: '90px'
			},{
				key : 'cardCnt', align:'center',
				title : 'Card수',
				width: '90px'
			},{
				key : 'frstRegDate', align:'center',
				title : '등록일',
				width: '100px'
			},{
				key : 'frstRegUserId', align:'center',
				title : '등록자',
				width: '100px'
			}, {
				key : 'lastChgDate', align:'center',
				title : '변경일',
				width: '100px'
			},{
				key : 'lastChgUserId', align:'center',
				title : '변경자',
				width: '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

//     } else if(gridId == 'dataGridCard'){

        $('#'+cardGridId).alopexGrid({
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
				width: '40px',
				numberingColumn: true
			}, {
				key : 'topMtsoNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '130px'
			}, {
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '130px'
			}, {
				key : 'eqpRoleDivNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '100px'
			}, {
				key : 'bpNm', align:'center',
				title : configMsgArray['vend'],
				width: '100px'
			}, {
				key : 'eqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '120px'
			}, {
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '110px'
			}, {
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '150px'
			}, {
				key : 'rackNm', align:'center',
				title : 'Rack명',
				width: '90px'
			}, {
				key : 'shlfNm', align:'center',
				title : 'Shelf명',
				width: '180px'
			}, {
				key : 'cardId', align:'center',
				title : 'Card ID',
				width: '150px'
			}, {
				key : 'cardNm', align:'center',
				title : 'Card명',
				width: '150px'
			}, {
				key : 'slotNo', align:'center',
				title : 'Slot번호',
				width: '100px'
			}, {
				key : 'cardMdlNm', align:'center',
				title : 'Card모델명',
				width: '150px'
			}, {
				key : 'prntCardNm', align:'center',
				title : '부모Card명',
				width: '100px'
			}, {
				key : 'cardStatNm', align:'center',
				title : 'Card상태',
				width: '100px'
			}, {
			//	key : 'cardRoleDivCd', align:'center',
			//	title : '역할',
			//	width: '100px'
			//}, {
				key : 'barNoCard', align:'center',
				title : '바코드번호',
				width: '100px'
			},{
				key : 'staPortNoVal', align:'center',
				title : '시작포트번호',
				width: '100px'
			},{
				key : 'cstrCd', align:'center',
				title : '공사코드',
				width: '100px'
			},{
				key : 'wkrtNo', align:'center',
				title : '작업지시번호',
				width: '100px'
			},{
				key : 'cardSerNoVal', align:'center',
				title : '시리얼번호',
				width: '100px'
			},{
				key : 'instlDt', align:'center',
				title : '설치일자',
				width: '100px'
			},{
				key : 'mnftYm', align:'center',
				title : '제조년월',
				width: '100px'
			},{
				key : 'cardRmk', align:'center',
				title : '카드비고',
				width: '100px'
			},{
				key : 'autoRegYn', align:'center',
				title : '자동등록여부',
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
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
//     }
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

	   	//장비 타입 조회
	   	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ chrrOrgGrpCd, null, 'GET', 'eqpRoleDivCd');
    	//장비모델 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/mdl', param,'GET', 'mdl');
    	//제조사 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/bp', param,'GET', 'bp');
		//장비 상태 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00027', null, 'GET', 'eqpStatCd');

	   	//본부 세션 값이 없을 경우 팀,전송실 전체 조회
//	   	if($("#sUprOrgId").val() == ""){
//	    	//팀 조회
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//	    	//전송실 조회
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
//    	}

//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', null, 'GET', 'cardMdl');
    }



    function setEventListener() {

    	var perPage = 100;

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 var param =  $("#searchForm").getData();

    		 if (param.tmof == "") {
 	     		//필수 선택 항목입니다.[ 전송실 ]
 	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 전송실 "), function(msgId, msgRst){});
 	     		return;
 	     	 }

    		 setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			var param =  $("#searchForm").getData();

     			if (param.tmof == "") {
    	     		//필수 선택 항목입니다.[ 전송실 ]
    	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 전송실 "), function(msgId, msgRst){});
    	     		return;
    	     	}

     			setGrid(1,perPage);
       		}
     	 });

   	 	 // 랙 그리드 페이지 번호 클릭시
   	 	 $('#dataGridRack').on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	 // 랙 그리드 페이지 selectbox를 변경했을 시
   	 	 $('#dataGridRack').on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	setGrid(1, eObj.perPage);
         });

   	 	 // 쉘프 그리드 페이지 번호 클릭시
   	 	 $('#dataGridShlf').on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	 // 쉘프 그리드 페이지 selectbox를 변경했을 시
   	 	 $('#dataGridShlf').on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	setGrid(1, eObj.perPage);
         });

   	 	 // 카드 그리드 페이지 번호 클릭시
   	 	 $('#dataGridCard').on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	 // 카드 그리드 페이지 selectbox를 변경했을 시
   	 	 $('#dataGridCard').on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	setGrid(1, eObj.perPage);
         });

         /*$(".Radio").on('change', function(e){
        	 if(document.getElementById("rack").checked == true){
				 document.getElementById("shpNmText").innerHTML = 'Rack명';
				 $('#shpNm').val(''); //랙명 항목 초기화
				 $("#tab_rack").click(); //랙탭 활성화
				 gridId = 'dataGridRack';
				 initGrid();
				 $('#gubunValue').val('rack');
				 document.getElementById('c1').style.display="none";
			 }else if(document.getElementById("shlf").checked == true){
				 document.getElementById("shpNmText").innerHTML = 'Shelf명';
				 $('#shpNm').val(''); //쉘프명 항목 초기화
				 $("#tab_shlf").click(); //쉘프탭 활성화
				 gridId = 'dataGridShlf';
				 initGrid();
				 $('#gubunValue').val('shlf');
				 document.getElementById('c1').style.display="none";
			 }else if(document.getElementById("card").checked == true){
				 //카드모델 조회
//			     httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmdl', null, 'GET', 'cardMdl');
			     document.getElementById('c1').style.display="block";

				 document.getElementById("shpNmText").innerHTML = 'Card명';
				 $('#shpNm').val(''); //카드명 항목 초기화
				 $("#tab_card").click(); //카드탭 활성화
				 gridId = 'dataGridCard';
				 initGrid();
				 $('#gubunValue').val('card');

			 }
         });*/

        /* $("#tab_rack").on('click', function(e){  //랙탭 클릭 시 구분 라디오버튼 쉘프옵션 활성화처리
        	 $("#rack").click();
        	 $('#gubunValue').val('rack');
         });
         $("#tab_shlf").on('click', function(e){  //쉘프탭 클릭 시 구분 라디오버튼 쉘프옵션 활성화처리
        	 $("#shlf").click();
        	 $('#gubunValue').val('shlf');
         });
         $("#tab_card").on('click', function(e){  //카드탭 클릭 시 구분 라디오버튼 카드옵션 활성화처리
        	 $("#card").click();
        	 $('#gubunValue').val('card');
         });*/

       //탭변경 이벤트
    	 $('#basicTabs').on("tabchange", function(e, index) {
 			switch (index) {
 			case 0 :
 				$('#'+rackGridId).alopexGrid("viewUpdate");
 				document.getElementById("shpNmText").innerHTML = 'Rack명';
 				$('#barNoDiv').show();
 				break;
 			case 1 :
 				$('#'+shlfGridId).alopexGrid("viewUpdate");
 				document.getElementById("shpNmText").innerHTML = 'Shelf명';
 				$('#barNoDiv').hide();
 				break;
 			case 2 :
 				$('#'+cardGridId).alopexGrid("viewUpdate");
 				document.getElementById("shpNmText").innerHTML = 'Card명';
 				$('#barNoDiv').show();
 				break;
 			default :
 				break;
 			}
     	});

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {

    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

//    		 if (mgmtGrpNm == 'SKB') {
//    			 $('#btnRegRack').hide();
//    			 $('#btnRegShlf').hide();
//    			 $('#btnRegCard').hide();
//    		 }
//    		 else {
//    			 $('#btnRegRack').show();
//    			 $('#btnRegShlf').show();
//    			 $('#btnRegCard').show();
//    		 }

    		 var param = {"mgmtGrpNm": $("#mgmtGrpNm").getTexts()[0]};

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpOrgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    		 //장비 타입
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

     	//제조사 선택시 이벤트
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

         //등록
    	 $('#btnRegRack').on('click', function(e) {
    		dataParam = {"regYnRack" : "N"};
    		popup('RackReg', $('#ctx').val()+'/configmgmt/shpmgmt/RackReg.do', '형상 Rack 등록', dataParam);

         });

    	 $('#btnRegShlf').on('click', function(e) {
    		 dataParam = {"regYnShlf" : "N"};
     		 popup('ShlfReg', $('#ctx').val()+'/configmgmt/shpmgmt/ShlfReg.do', '형상 Shelf 등록', dataParam);

          });

    	 $('#btnRegCard').on('click', function(e) {
    		 dataParam = {"regYnCard" : "N"};
//     		 popup('CardReg', $('#ctx').val()+'/configmgmt/shpmgmt/CardReg.do', '형상 Card 등록', dataParam);
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




    	//엑셀다운
    	 $('#btnExportExcel').on('click', function(e) {

    		 /*var gubunValue = $('#gubunValue').val();
	         	//tango transmission biz 모듈을 호출하여야한다.
	    		 var param =  $("#searchForm").getData();
	    		 var method = "";
	    		 var fileName = "";

	    		 if(gubunValue == 'rack'){
	    			 method = "getRackMgmtList";
	    			 fileName = "형상Rack정보";
	    		 }else if(gubunValue == 'shlf'){
	    			 method = "getShlfMgmtList";
	    			 fileName = "형상Shelf정보"
	    		 }else{
	    			 method = "getCardMgmtList";
	    			 fileName = "형상Card정보"
	    		 }

	    		 param = gridExcelColumn(param, gridId);
	    		 param.pageNo = 1;
	    		 param.rowPerPage = 10;
	    		 param.firstRowIndex = 1;
	    		 param.lastRowIndex = 1000000000;

	    		 param.fileName = fileName;
	    		 param.fileExtension = "xlsx";
	    		 param.excelPageDown = "N";
	    		 param.excelUpload = "N";
	    		 param.method = method;

	    		 $('#'+gridId).alopexGrid('showProgress');
	 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/excelcreate', param, 'GET', 'excelDownload');*/

	 	    	 var idx  = $('#basicTabs').getCurrentTabIndex();
	         	 var param =  $("#searchForm").getData();

		   		 param.pageNo = 1;
		   		 param.rowPerPage = 10;
		   		 param.firstRowIndex = 1;
		   		 param.lastRowIndex = 1000000000;

		   		 param.fileExtension = "xlsx";
		   		 param.excelPageDown = "N";
		   		 param.excelUpload = "N";

		   		 if(idx == 0){
		   			 param.method = "getRackMgmtList";
		   			 param.fileName = "형상Rack정보";
		   			 param = gridExcelColumn(param, 'dataGridRack');
		   			 $('#dataGridRack').alopexGrid('showProgress');
		   		 }else if(idx == 1){
		   			 param.method = "getShlfMgmtList";
		   			 param.fileName = "형상Shelf정보"
		   			 param = gridExcelColumn(param, 'dataGridShlf');
	    			 $('#dataGridShlf').alopexGrid('showProgress');
		   		 }else if(idx == 2){
		   			 param.method = "getCardMgmtList";
		   			 param.fileName = "형상Card정보"
		   			 param = gridExcelColumn(param, 'dataGridCard');
	    			 $('#dataGridCard').alopexGrid('showProgress');
		   		 }

		    	httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/excelcreate', param, 'GET', 'excelDownload');
	         });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
    		 var param =  $("#searchForm").getData();

    		 if (param.tmof == "") {
 	     		//필수 선택 항목입니다.[ 전송실 ]
 	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 전송실 "), function(msgId, msgRst){});
 	     		return;
 	     	 }
	         btnExportExcelOnDemandClickEventHandler(e);
    	 });

    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#dataGridRack').on('dblclick', '.bodycell', function(e){

    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	dataObj.rackNo = "";
    	 	dataObj.rackNm = "";
    	 	dataObj.rackTypNm = "";
    	 	dataObj.barNoRack = "";
    	 	dataObj.rackUseYn = "";
    	 	dataObj.mgmtGrpNm =  $("#mgmtGrpNm").val(); //[20171221]
    	 	popupList('ShpInfLkup', $('#ctx').val()+'/configmgmt/shpmgmt/ShpInfLkup.do', '형상 상세 조회',dataObj);

    	 });

    	 //첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#dataGridShlf').on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	dataObj.rackNo = "";
    	 	dataObj.shlfNo = "";
    	 	dataObj.shlfNm = "";
    	 	dataObj.shlfTypNm = "";
    	 	dataObj.shlfUseYn = "";
    	 	dataObj.mgmtGrpNm =  $("#mgmtGrpNm").val(); //[20171221]
    	 	popupList('ShpInfLkup', $('#ctx').val()+'/configmgmt/shpmgmt/ShpInfLkup.do', '형상 상세 조회',dataObj);

    	 });

    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#dataGridCard').on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	dataObj.rackNo = "";
    	 	dataObj.shlfNo = "";
    	 	dataObj.cardMdlNm = "";
    	 	dataObj.cardNm = "";
    	 	dataObj.prntCardNm = "";
    	 	dataObj.cardStatNm = "";
    	 	dataObj.barNoCard = "";
    	 	dataObj.staPortNoVal = "";
    	 	dataObj.instlDt = "";
    	 	dataObj.mnftYm = "";
    	 	dataObj.cardRmk = "";
    	 	dataObj.slotNo = "";
    	 	dataObj.mgmtGrpNm =  $("#mgmtGrpNm").val(); //[20171221]
    	 	popupList('ShpInfLkup', $('#ctx').val()+'/configmgmt/shpmgmt/ShpInfLkup.do', '형상 상세 조회',dataObj);

    	 });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};

	/*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        //형상정보조회조건세팅
	        var idx  = $('#basicTabs').getCurrentTabIndex();
	        var param =  $("#searchForm").getData();
	        if(idx == 0){
	   			 param = gridExcelColumn(param, 'dataGridRack');
	   		}else if(idx == 1){
	   			 param = gridExcelColumn(param, 'dataGridShlf');
	   		}else if(idx == 2){
	   			 param = gridExcelColumn(param, 'dataGridCard');
	   		}
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();

	   		/* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelFlag = "ShpMgmt";

	   		var excelFileNm = null;
	   		if(idx == 0){
	   			 param.excelMethod = "getRackMgmtList";
	   			 excelFileNm = 'Rack_Shape_Information_'+dayTime;
	   			 param = gridExcelColumn(param, 'dataGridRack');
	   			 $('#'+rackGridId).alopexGrid('showProgress');
	   		}else if(idx == 1){
	   			 param.excelMethod = "getShlfMgmtList";
	   			excelFileNm = 'Shelf_Shape_Information_'+dayTime;
	   			 param = gridExcelColumn(param, 'dataGridShlf');
	   			$('#'+shlfGridId).alopexGrid('showProgress');
	   		}else if(idx == 2){
	   			 param.excelMethod = "getCardMgmtList";
	   			excelFileNm = 'Card_Shape_Information_'+dayTime;
	   			 param = gridExcelColumn(param, 'dataGridCard');
	   			$('#'+cardGridId).alopexGrid('showProgress');
	   		}

	   		param.fileName = excelFileNm;
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
		    fileOnDemendName = excelFileNm+".xlsx";

  		    console.log("aaa");
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

	function successCallback(response, status, jqxhr, flag){
		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
            var idx  = $('#basicTabs').getCurrentTabIndex();
			if(idx == 0){
				$('#dataGridRack').alopexGrid('hideProgress');
			}else if(idx == 1){
				$('#dataGridShlf').alopexGrid('hideProgress');
			}else if(idx == 2){
				$('#dataGridCard').alopexGrid('hideProgress');
			}
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
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['select'],mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
		}

		if(flag == 'mtso'){ //국사 리스트
			$('#mtso').clear();
			var option_data =  [{mtsoId2: "", mtsoNm2: "전체"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtso').setData({
	             data:option_data
			});
		}

		if(flag == 'cardMdl'){
			$('#cardMdl').clear();
			var option_data =  [{cardMdlId: "", cardMdlNm: "전체"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#cardMdl').setData({
	             data:option_data
			});
		}

		if(flag == 'mdl'){
			$('#eqpMdlId').clear();
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

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
			var option_data =  [{comCd: "", comCdNm: configMsgArray['all']}];

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
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

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

    	/*if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');
    		if(gridId == 'dataGridRack'){
    			setSPGrid(gridId, response, response.rackMgmtList);
    		}else if(gridId == 'dataGridShlf'){
    			setSPGrid(gridId, response, response.shlfMgmtList);
    		}else if(gridId == 'dataGridCard'){
    			setSPGrid(gridId, response, response.cardMgmtList);
    		}
    	}*/

    	if(flag == 'searchRack'){

    		$('#'+rackGridId).alopexGrid('hideProgress');
    		setSPGrid(rackGridId, response, response.rackMgmtList);
    	}

		if(flag == 'searchShlf'){

			$('#'+shlfGridId).alopexGrid('hideProgress');
			setSPGrid(shlfGridId, response, response.shlfMgmtList);
		}

		if(flag == 'searchCard'){

			$('#'+cardGridId).alopexGrid('hideProgress');
			setSPGrid(cardGridId, response, response.cardMgmtList);
		}

    	if(flag == 'excelDownload') {
    		/*
    		$('#'+gridId).alopexGrid('hideProgress');
    		console.log('excelCreate');
    		console.log(response);

    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();*/


			var idx  = $('#basicTabs').getCurrentTabIndex();

			if(idx == 0){
				$('#dataGridRack').alopexGrid('hideProgress');
			}else if(idx == 1){
				$('#dataGridShlf').alopexGrid('hideProgress');
			}else if(idx == 2){
				$('#dataGridCard').alopexGrid('hideProgress');
			}
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

    //request 실패시
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['eqpId'];

        $('#'+rackGridId).alopexGrid("hideCol", hideColList, 'conceal');
        $('#'+shlfGridId).alopexGrid("hideCol", hideColList, 'conceal');
        $('#'+cardGridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();

//    	 $('#'+gridId).alopexGrid('showProgress');

    	 var idx  = $('#basicTabs').getCurrentTabIndex();

    	 switch (idx) {
			case 0 :
				$('#'+rackGridId).alopexGrid('showProgress');
	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/rackmgmt', param, 'GET', 'searchRack');
				break;
			case 1 :
				$('#'+shlfGridId).alopexGrid('showProgress');
	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shlfmgmt', param, 'GET', 'searchShlf');
				break;
			case 2 :
				$('#'+cardGridId).alopexGrid('showProgress');
	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmgmt', param, 'GET', 'searchCard');
				break;
			default :
				break;
		}


    	 /*if(gridId == 'dataGridRack'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/rackmgmt', param, 'GET', 'search');
    	 }else if(gridId == 'dataGridShlf'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/shlfmgmt', param, 'GET', 'search');
    	 }else if(gridId == 'dataGridCard'){
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/shpmgmt/cardmgmt', param, 'GET', 'search');
    	 }*/
    }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
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
                  width : 650,
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