/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var fileOnDemendName = "";


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setRegDataSet(param);
    	setSelectCode();
    	initGrid('I');
        setEventListener();
    };

    function setRegDataSet(data) {

    	$('#cofcChk').setChecked(true);	//2023 통합국사고도화 : 통합국 -> 중심국 조회 옵션으로 재활용

    	$('#repMtsoYn').setChecked(true); //2023 통합국사고도화 : 건물단위통계 -> 통합국 조회 옵션으로 재활용

    	var startDate = new Date().format("yyyy-MM-dd");
		$("#stcStdDate").val(startDate);
    }

  //Grid 초기화
    function initGrid(strGubun) {

    	// 통합국 -> 중심국 + 통합국 조회
    	if (strGubun == "I") {
    		var headerN = [{fromIndex:4, toIndex:12, title:"통합국 정보", headerStyleclass: "blue"},
  	            				{fromIndex:13, toIndex:20, title:"통합국 통계", id:'u1', headerStyleclass: "blue"}];

    		var mappingN =  [
    			{ key : 'orgNm', align:'center', title : '본부', width: '80px', headerStyleclass: "blue", rowspan:true},
    			{ key : 'teamNm', align:'center', title : '팀', width: '80px' , headerStyleclass: "blue", rowspan:true},
    			{ key : 'tmofNm', align:'center', title : '전송실', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'opPostOrgNm', align:'center', title : '운용본부', width: '80px' , headerStyleclass: "blue",rowspan:true},

    			// 2023 통합국사 고도화 추가 필드
    			{ key : 'intgMtsoNm', align:'center', title : '통합국사명', width: '120px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'intgMtsoId', align:'center', title : '통합국사ID', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			
    			{ key : 'mtsoNm', align:'center', title : '국사명', width: '120px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'mtsoId', align:'center', title : '국사ID', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '90px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'erpIntgFcltsNm', align:'center', title : '통합시설명', width: '90px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'bldAddr', align:'center', title : '주소', width: '150px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'siteCd', align:'center', title : '사이트키', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'siteNm', align:'center', title : '사이트명', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'bmtsoCnt', align:'center', title : '기지국수', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'smtsoCnt', align:'center', title : '국소수', width: '70px', headerStyleclass: "blue" ,rowspan:true},
    			{ key : 'g5DuhCnt', align:'center', title : '5G DU-H', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g5DulCnt', align:'center', title : '5G DU-L', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g4DuCnt', align:'center', title : '4G DU', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g4RuCnt', align:'center', title : '4G RU', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g3Cnt', align:'center', title : '3G', width: '50px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g2Cnt', align:'center', title : '2G', width: '50px', headerStyleclass: "blue",rowspan:true}];

    	}//기지국
    	else if (strGubun == "B") {

    		var headerN = [{fromIndex:4, toIndex:12, title:"통합국 정보", headerStyleclass: "blue"},
  	            {fromIndex:13, toIndex:20, title:"통합국 통계", id:'u1', headerStyleclass: "blue"},
  	            {fromIndex:21, toIndex:27, title:"기지국 정보", id:'u2', headerStyleclass: "green"},
  	            {fromIndex:28, toIndex:33, title:"기지국 통계", id:'u3', headerStyleclass: "green"}];

    		var mappingN =  [
    			{ key : 'orgNm', align:'center', title : '본부', width: '80px', headerStyleclass: "blue", rowspan:true},
    			{ key : 'teamNm', align:'center', title : '팀', width: '80px' , headerStyleclass: "blue", rowspan:true},
    			{ key : 'tmofNm', align:'center', title : '전송실', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'opPostOrgNm', align:'center', title : '운용팀', width: '80px' , headerStyleclass: "blue",rowspan:true},

    			// 2023 통합국사 고도화 추가 필드
    			{ key : 'intgMtsoNm', align:'center', title : '통합국사명', width: '120px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'intgMtsoId', align:'center', title : '통합국사ID', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			
    			{ key : 'mtsoNm', align:'center', title : '국사명', width: '120px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'mtsoId', align:'center', title : '국사ID', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '90px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'erpIntgFcltsNm', align:'center', title : '통합시설명', width: '90px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'bldAddr', align:'center', title : '주소', width: '150px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'siteCd', align:'center', title : '사이트키', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'siteNm', align:'center', title : '사이트명', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'bmtsoCnt', align:'center', title : '기지국수', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'smtsoCnt', align:'center', title : '국소수', width: '70px', headerStyleclass: "blue" ,rowspan:true},
    			{ key : 'g5DuhCnt', align:'center', title : '5G DU-H', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g5DulCnt', align:'center', title : '5G DU-L', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g4DuCnt', align:'center', title : '4G DU', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g4RuCnt', align:'center', title : '4G RU', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g3Cnt', align:'center', title : '3G', width: '50px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g2Cnt', align:'center', title : '2G', width: '50px', headerStyleclass: "blue",rowspan:true},
    			//기지국
    			{ key : 'bmtsoMtsoNm', align:'center', title : '국사명', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoMtsoId', align:'center', title : '국사ID', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoIntgFcltsCd', align:'center', title : '통합시설코드', width: '90px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoErpIntgFcltsNm', align:'center', title : '통합시설명', width: '90px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoBldAddr', align:'center', title : '주소', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoSiteCd', align:'center', title : '사이트키', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoSiteNm', align:'center', title : '사이트명', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG5DuhCnt', align:'center', title : '5G DU-H', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG5DulCnt', align:'center', title : '5G DU-L', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG4DuCnt', align:'center', title : '4G DU', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG4RuCnt', align:'center', title : '4G RU', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG3Cnt', align:'center', title : '3G', width: '50px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG2Cnt', align:'center', title : '2G', width: '50px' , headerStyleclass: "green",rowspan:true}];

    	}//국소
    	else {
    		var headerN = [{fromIndex:4, toIndex:12, title:"통합국 정보", headerStyleclass: "blue"},
  	            {fromIndex:13, toIndex:20, title:"통합국 통계", id:'u1', headerStyleclass: "blue"},
  	            {fromIndex:21, toIndex:27, title:"기지국 정보", id:'u2', headerStyleclass: "green"},
  	            {fromIndex:28, toIndex:33, title:"기지국 통계", id:'u3', headerStyleclass: "green"},
  	            {fromIndex:34, toIndex:40, title:"국소 정보", id:'u4',  headerStyleclass: "gingreen"},
  	            {fromIndex:41, toIndex:42, title:"국소 통계", id:'u5', headerStyleclass: "gingreen"}];

    		var mappingN =  [
    			{ key : 'orgNm', align:'center', title : '본부', width: '80px', headerStyleclass: "blue", rowspan:true},
    			{ key : 'teamNm', align:'center', title : '팀', width: '80px' , headerStyleclass: "blue", rowspan:true},
    			{ key : 'tmofNm', align:'center', title : '전송실', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'opPostOrgNm', align:'center', title : '운용팀', width: '80px' , headerStyleclass: "blue",rowspan:true},

    			// 2023 통합국사 고도화 추가 필드
    			{ key : 'intgMtsoNm', align:'center', title : '통합국사명', width: '120px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'intgMtsoId', align:'center', title : '통합국사ID', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			
    			{ key : 'mtsoNm', align:'center', title : '국사명', width: '120px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'mtsoId', align:'center', title : '국사ID', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '90px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'erpIntgFcltsNm', align:'center', title : '통합시설명', width: '90px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'bldAddr', align:'center', title : '주소', width: '150px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'siteCd', align:'center', title : '사이트키', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'siteNm', align:'center', title : '사이트명', width: '80px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'bmtsoCnt', align:'center', title : '기지국수', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'smtsoCnt', align:'center', title : '국소수', width: '70px', headerStyleclass: "blue" ,rowspan:true},
    			{ key : 'g5DuhCnt', align:'center', title : '5G DU-H', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g5DulCnt', align:'center', title : '5G DU-L', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g4DuCnt', align:'center', title : '4G DU', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g4RuCnt', align:'center', title : '4G RU', width: '70px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g3Cnt', align:'center', title : '3G', width: '50px' , headerStyleclass: "blue",rowspan:true},
    			{ key : 'g2Cnt', align:'center', title : '2G', width: '50px', headerStyleclass: "blue",rowspan:true},
    			//기지국
    			{ key : 'bmtsoMtsoNm', align:'center', title : '국사명', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoMtsoId', align:'center', title : '국사ID', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoIntgFcltsCd', align:'center', title : '통합시설코드', width: '90px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoErpIntgFcltsNm', align:'center', title : '통합시설명', width: '90px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoBldAddr', align:'center', title : '주소', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoSiteCd', align:'center', title : '사이트키', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoSiteNm', align:'center', title : '사이트명', width: '80px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG5DuhCnt', align:'center', title : '5G DU-H', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG5DulCnt', align:'center', title : '5G DU-L', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG4DuCnt', align:'center', title : '4G DU', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG4RuCnt', align:'center', title : '4G RU', width: '70px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG3Cnt', align:'center', title : '3G', width: '50px' , headerStyleclass: "green",rowspan:true},
     			{ key : 'bmtsoG2Cnt', align:'center', title : '2G', width: '50px' , headerStyleclass: "green",rowspan:true},
     			//국소
     			{ key : 'smtsoMtsoNm', align:'center', title : '국사명', width: '80px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoMtsoId', align:'center', title : '국사ID', width: '80px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoIntgFcltsCd', align:'center', title : '통합시설코드', width: '90px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoErpIntgFcltsNm', align:'center', title : '통합시설명', width: '90px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoBldAddr', align:'center', title : '주소', width: '80px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoSiteCd', align:'center', title : '사이트키', width: '80px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoSiteNm', align:'center', title : '사이트명', width: '80px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoG5DulCnt', align:'center', title : '5G DU-L', width: '70px' , headerStyleclass: "gingreen"},
     			{ key : 'smtsoG4RuCnt', align:'center', title : '4G RU', width: '70px' , headerStyleclass: "gingreen"}];
    	}





            //그리드 생성
            $('#'+gridId).alopexGrid({
    			headerGroup: headerN,
            	paging : {
            		pagerSelect: [100,300,500,1000,5000]
                   ,hidePageList: false  // pager 중앙 삭제
            	},
            	defaultColumnMapping:{
    				width:'100px',
    				align:'center'
            	},
            	fitTableWidth:true,
            	autoColumnIndex: true,
        		autoResize: true,
        		numberingColumnFromZero: false,
        		columnMapping: mappingN,
    			message: {/* 데이터가 없습니다.      */
    				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
    			}
    	    });

            if ($('#smtsoChk').is(':checked')){
                $('#'+gridId).alopexGrid({
            		grouping: {
                		by: ['orgNm','teamNm','tmofNm','opPostOrgNm','intgMtsoNm','intgMtsoId','mtsoNm','mtsoId','intgFcltsCd','erpIntgFcltsNm','bldAddr','siteCd','siteNm','bmtsoCnt','smtsoCnt','g5DuhCnt','g5DulCnt','g4DuCnt','g4RuCnt','g3Cnt','g2Cnt','bmtsoMtsoNm','bmtsoMtsoId','bmtsoIntgFcltsCd','bmtsoErpIntgFcltsNm','bmtsoBldAddr','bmtsoSiteCd','bmtsoSiteNm','bmtsoSmtsoCnt','bmtsoG5DuhCnt','bmtsoG5DulCnt','bmtsoG4DuCnt','bmtsoG4RuCnt','bmtsoG3Cnt','bmtsoG2Cnt'],
                		useGrouping: true,
                		useGroupRearrange:true,
                		useGroupRowspan:true
                	}
        	    });
            } else if ($('#bmtsoChk').is(':checked')){
                $('#'+gridId).alopexGrid({
            		grouping: {
                		by: ['orgNm','teamNm','tmofNm','opPostOrgNm','intgMtsoNm','intgMtsoId','mtsoNm','mtsoId','intgFcltsCd','erpIntgFcltsNm','bldAddr','siteCd','siteNm','bmtsoCnt','smtsoCnt','g5DuhCnt','g5DulCnt','g4DuCnt','g4RuCnt','g3Cnt','g2Cnt'],
                		useGrouping: true,
                		useGroupRearrange:true,
                		useGroupRowspan:true
        			}
        	    });
            } else {
                $('#'+gridId).alopexGrid({
            		grouping: {
                		by: [],
                		useGrouping: false,
                		useGroupRearrange:false,
                		useGroupRowspan:false
        			}
        	    });
            }

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList =['intgMtsoNm', 'intgMtsoId'];
		if ($('#repMtsoYn').is(':checked')) {
			$('#'+gridId).alopexGrid("showCol", hideColList);
        }else {
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
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

    	 $('#cofcChk').on('click', function(e) {
    		 $('#'+gridId).alopexGrid('dataEmpty');		// Check Box 변경시 그리드 초기화
    		 initGrid('I');
    	 });

    	 $('#bmtsoChk').on('click', function(e) {
    		 $('#'+gridId).alopexGrid('dataEmpty');     // Check Box 변경시 그리드 초기화
    		 initGrid('B');
         });

    	 $('#smtsoChk').on('click', function(e) {
    		 $('#'+gridId).alopexGrid('dataEmpty');     // Check Box 변경시 그리드 초기화
    		 initGrid();
         });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
       		btnExportExcelOnDemandClickEventHandler(e);
       	});


     	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 var param = dataObj;
    		 param.bldYn = $("#bldYn").val();

     		 $a.popup({
        			popid: 'BmtsoOpCurstDtlInf',
        			title: '통합국사 기지국운용현황 - 상세',
        			url: '/tango-transmission-web/configmgmt/transnetmgmt/BmtsoOpCurstDtlInf.do',
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

    	 $('#repMtsoYn').on('change', function(e) {
    		 gridHide();
    	 });

	};

	function successCallback(response, status, jqxhr, flag){

		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.bmtsoOpCurstList);
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

		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				//본리인 경우는 제외, DVT 요청
				if (resObj.mtsoNm.indexOf('본리') < 0) {
					option_data.push(resObj);
				}
			}

			$('#tmof').setData({
	             data:option_data
			});
		}

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
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

     	var startDate = new Date().format("yyyy-MM-dd");
		var stcStdDate = $("#stcStdDate").val();
		if (stcStdDate == null || stcStdDate == undefined || stcStdDate == "") {
			$("#stcStdDate").val(startDate);
		}
		$("#stcStdDt").val($("#stcStdDate").val().replace(/-/gi,''));

         if ($('#smtsoChk').is(':checked')){
        	 $("#mtsoCheck").val('smtso');
         } else if ($('#bmtsoChk').is(':checked')){
        	 $("#mtsoCheck").val('bmtso');
         } else {
        	 $("#mtsoCheck").val('amtso');
         }

         if ($('#repMtsoYn').is(':checked')) {
        	 $("#bldYn").val('Y');
         }else {
        	 $("#bldYn").val('N');
         }

    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/transnetmgmt/bmtsoOpCurstList', param, 'GET', 'search');
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
                    $('#mgmtGrpNm').val('');
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

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

		 var param =  $("#searchForm").getData();

		 param = gridExcelColumn(param, gridId);

		 var stcStdDate = $("#stcStdDate").val();

		 if (stcStdDate == null || stcStdDate == undefined || stcStdDate == "")
			$("#stcStdDate").val(startDate);

		param.stcStdDt = $("#stcStdDate").val().replace(/-/gi,'');

         if ($('#smtsoChk').is(':checked'))
        	 param.mtsoCheck = 'smtso';
         else if ($('#bmtsoChk').is(':checked'))
        	 param.mtsoCheck = 'bmtso';
         else
        	 param.mtsoCheck = 'amtso';

         if ($('#repMtsoYn').is(':checked'))
        	 param.bldYn = 'Y';
         else
        	 param.bldYn = 'N';

		 param.pageNo = 1;
		 param.rowPerPage = 60;
	   	 param.firstRowIndex = 1;
	   	 param.lastRowIndex = 1000000000;
	   	 param.inUserId = $('#sessionUserId').val();

	   	 var now = new Date();
	   	 var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	   	 var excelFileNm = '유선망기지국현황_'+dayTime;
	   	 param.fileName = excelFileNm;

		 param.fileExtension = "xlsx";
		 param.excelPageDown = "N";
		 param.excelUpload = "N";
		 param.excelMethod = "getBmtsoOpCurstInfList";
		 param.excelFlag = "getBmtsoOpCurstInfList";
		 fileOnDemendName = fileOnDemendName = excelFileNm+".xlsx";

		 console.log("excel param : ", param);
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');

	 }

    Date.prototype.format = function(f) {
	    if (!this.valueOf()) return " ";
	    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var d = this;
	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};

	Number.prototype.zf = function(len){return prependZeor(this, len);};
	function prependZeor(num, len) {
		while(num.toString().length < len) {
			num = "0"+num;
		}
		return num;
	}

    function NumberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
});