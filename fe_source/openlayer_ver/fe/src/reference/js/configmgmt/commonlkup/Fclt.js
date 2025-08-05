/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var cifTakeAprvStatCd = "";
var cifTakeRlesStatCd = "";
var aprvA = ""; //A망 권한
var aprvT = ""; //T망 권한
var adtnAttrVal = "";
var gridModel = null;
var rowPerPage = 100000;		// 한 페이지당 표기할 데이터 수
var curPage = 1;			// 표기할 현재 페이지 번호

var com = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataGridEquipmentList';
	var gridIdSbeqp = 'dataGridSbeqpList';
	var gridIdEqpFdf = 'dataGridEqpFdfList';

	var paramData = null;

	var befEqpRoleDivCdList;

    this.init = function(id, param) {
    	initGrid();
    	initGridEqpFdf();
    	setEventListener();
        paramData = param;
    	setSelectCode();

    	gridResearch();

        resizeContents();
    };

    function resizeContents(){
    	var contentHeight = $("#drawDtlLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

    function initGrid() {
        var mapping =  [{ align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },

        	{/* 국사명	 */ key : 'mtsoNm', align:'left', title : configMsgArray['mobileTelephoneSwitchingOfficeName'], width: '150px' },
        	{/* 건물층값  */ key : 'bldFlorNo', align:'center', title : configMsgArray['buildingFloorValue'], width: '60px' },
        	{/* 장비명	 */ key : 'eqpNm', align:'left', title : '장비명', width: '180px' },
        	//{/* 통합시설코드 */ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '100px', hidden: true },
        	{/* RU건수   */ key : 'ruCount', align:'center', align:'center', title : 'RU건수', width: '70px', },
        	{/* 장비모델명          */ key : 'eqpMdlNm', align:'left', title : '장비모델명', width: '150px' },
        	{/*장비상태          */ key : 'eqpStatNm', align:'center', title : '장비상태', width: '100px' },
        	{/* 장비역할구분          */ key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '100px' },
        	{/* 메인장비IP주소            */ key : 'mainEqpIpAddr', align:'center', title : '메인장비IP주소', width: '100px' },
        	{/* 통합시설코드 */ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '100px' },
        	{/* 바코드 */ key : 'barNo', align:'center', title : '바코드', width: '100px' },
        	{/* 장비시리얼번호값		 */ key : 'eqpSerNoVal', align:'center', title : '장비시리얼번호', width: '100px' },
        	{/* 공사코드		 */ key : 'cstrMgmtNo', align:'center', title : '공사코드', width: '100px' },
        	{/* 상면랙번호		 */ key : 'upsdRackNo', align:'center', title : '상면랙번호', width: '100px' },
        	{/* 상면쉘프번호		 */ key : 'upsdShlfNo', align:'center', title : '상면쉘프번호', width: '100px' },
        	{/* 장비비고		 */ key : 'ca1CellNoFreqVal', align:'center', title : '장비비고', width: '100px' },
        	{/* 장비ID		 */ key : 'eqpId', align:'center', title : '장비ID', width: '100px', hidden :true }];
    	//그리드 생성



        $('#'+gridId).alopexGrid({
			paging: { enabledByPager: true, perPage: rowPerPage, pagerCount: 10, pagerSelect: false, hidePageList: true},
        	cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,

             numberingColumnFromZero : false
    	   ,
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row",message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			columnMapping : mapping
        });

        var mappingSbeqp =  [{ align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },

        	//{/* 통합시설코드 */ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '100px' },
        	//{/* 국사유형	*/ key : 'mtsoTyp', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeType'], width: '100px' },
        	{/* 국사명	*/ key : 'mtsoNm', align:'left', title : configMsgArray['mobileTelephoneSwitchingOfficeName'], width: '150px' },
        	{/* 건물층값  */ key : 'bldFlorNo', align:'center', title : configMsgArray['buildingFloorValue'], width: '60px' },
        	{/* 부대장비명       	 */ key : 'sbeqpNm', align:'left', title : '부대장비명', width: '150px' },
        	{ key : 'sbeqpClNm', align:'center', title : '장비타입', width: '100px' },
        	{/* 부대장비모델명   	 */ key : 'sbeqpMdlNm', align:'left', title : '부대장비모델명', width: '150px' },
        	{/* 부대장비운용상태명		 */ key : 'sbeqpOpStatNm', align:'center', title : '장비상태', width: '100px' },
        	//{/* 부대장비모델ID		 */ key : 'sbeqpMdlId', align:'center', title : '부대장비모델ID', width: '120px' },
        	{/* 제조사		 */ key : 'sbeqpVendNm', align:'center', title : configMsgArray['vend'], width: '100px' },
        	//{/* 국사명		 */ key : 'sbeqpInstlMtsoNm', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeName'], width: '150px' },
        	//{/* 국사ID */ key : 'sbeqpInstlMtsoId', align:'center', title : '국사ID', width: '110px' },

        	//{/* 부대장비ID */ key : 'sbeqpId', align:'center', title : '부대장비ID', width: '110px' },
        	{/* RMS ID		 */ key : 'sbeqpRmsId', align:'center', title : 'RMS ID', width: '140px' },
        	{/* RMS NM		 */ key : 'sbeqpRmsNm', align:'center', title : 'RMS제원명', width: '150px' },
        	{/* 통시코드		 */ key : 'intgFcltsCd', align:'center', title : '통시코드', width: '100px' },
        	{/* 바코드 		 */ key : 'barNo', align:'center', title : configMsgArray['barcode'], width: '100px' },

        	{/* 관리팀		 */ key : 'jrdtTeamOrgNm', align:'center', title : configMsgArray['managementTeam'], width: '130px' },
        	{/* 상면등록여부    */ key: 'rackInAttrYn', align:'center', title : '상면등록여부', width: '120px',
        						render : function(value, data, render, mapping){
									if(data.rackInAttrYn == 'Y') {
										return '등록';
									}
									else{
										return '미등록';
									}
								}}
        	];
    	//그리드 생성
        $('#'+gridIdSbeqp).alopexGrid({
        	paging: { enabledByPager: true, perPage: rowPerPage, pagerCount: 10, pagerSelect: false, hidePageList: true},
        	cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,

             numberingColumnFromZero : false
    	   ,
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row",message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			columnMapping : mappingSbeqp
        });
    };

    function initGridEqpFdf() {
    	//그리드 생성
        $('#'+gridIdEqpFdf).alopexGrid({
        	cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            pager : true,
            numberingColumnFromZero : false
           ,paging: {
        	   pagerTotal:true,
        	   //pagerSelect:false,
        	   //hidePageList:true
           }
           ,rowSelectOption : {
			     clickSelect : true,
			     singleSelect : true,
			     disableSelectByKey : true
		    },
//			headerGroup : [ { fromIndex :  3 , toIndex :  8 , title : "TANGO - I" , id : "TangoI"},
//      			               { fromIndex :  9 , toIndex : 14 , title : "TANGO - O" , id : "TangoO"}],
      		grouping:{ by:['rackNm','shlfNm'],
      					useGrouping:true,
      					useGroupRearrange:true,
      					useGroupRowspan:true},

            columnMapping : [
            	{ key : 'rackNm', align:'left', title : '랙명', width: '100px', rowspan:true },
				{ key : 'shlfNm', align:'left', title : '셀프번호', width: '100px', rowspan:true },
				{ key : 'portNo', align:'center', title : '포트번호', width: '80px' },
				{ key : 'cblUnqMgmtNoI', align:'center', title : '케이블고유관리번호(I)', width: '200px' },
				{ key : 'cblSkMgmtNoI', align:'center', title : 'SK관리번호(I)', width: '150px' },
				{ key : 'cblCoreStI', align:'center', title : '규격(I)', width: '100px' },
				{ key : 'cblMnftNoI', align:'center', title : '제조번호(I)', width: '100px' },
				{ key : 'insCoreNo', align:'center', title : '코어(I)', width: '100px' },
				{ key : 'tBI', align:'center', title : 'T/B(I)', width: '100px' },
				{ key : 'cblUnqMgmtNoO', align:'center', title : '케이블고유관리번호(O)', width: '200px' },
				{ key : 'cblSkMgmtNoO', align:'center', title : 'SK관리번호(O)', width: '150px' },
				{ key : 'cblCoreStO', align:'center', title : '규격(O)', width: '100px' },
				{ key : 'cblMnftNoO', align:'center', title : '제조번호(O)', width: '100px' },
				{ key : 'prtCoreNo', align:'center', title : '코어(O)', width: '100px' },
				{ key : 'tBO', align:'center', title : 'T/B(O)', width: '100px' },
				{ key : 'patchInfo', align:'center', title : '패치정보', width: '100px' },
				{ key : 'useYn', align:'center', title : '사용여부', width: '100px' },
				{ key : 'sprCoreYn', align:'center', title : '주/예비코어여부', width: '130px' },
				{ key : 'svlnNo', align:'center', title : '서비스회선번호', width: '130px' },
				{ key : 'srvcDivNm', align:'center', title : '서비스구분', width: '100px' },
				{ key : 'srvcTypNm', align:'center', title : '서비스타입명', width: '100px' },
				{ key : 'coreSrvcUseCtt', align:'center', title : '서비스사용내역', width: '300px' },
				{ key : 'fedRingMgmtNo', align:'center', title : '휘더링번호', width: '130px' },
				{ key : 'fedRingMgmtNm', align:'center', title : '휘더링명', width: '130px' },
				{ key : 'fedCoreDrcCd', align:'center', title : '휘더코어방향', width: '100px' },
				{ key : 'ringNm', align:'center', title : '링명', width: '100px' },
				{ key : 'eteTrceDistm', align:'center', title : 'ETE코어 추적거리', width: '150px' },
				{ key : 'srvcRegDt', align:'center', title : '서비스 등록일자', width: '120px' },
				{ key : 'cstrCd', align:'center', title : '공사코드', width: '120px' },
				{ key : 'cstrNm', align:'center', title : '공사명', width: '150px' },
				{ key : 'wkrtNo', align:'center', title : '작업지시번호', width: '130px' },
				{ key : 'workNm', align:'center', title : '작업명', width: '200px' },
				{ key : 'workVndrNm', align:'center', title : '작업업체명', width: '200px' },
				{ key : 'mixNetCstrCd', align:'center', title : '혼합망공사번호', width: '120px' },
				{ key : 'lseVndrDivVal', align:'center', title : '임대사업자', width: '100px' },
				{ key : 'lesNo', align:'center', title : '임차관리번호', width: '100px' },
				{ key : 'optlDttnYn', align:'center', title : '광검출여부', width: '100px' },
				{ key : 'grenTyp', align:'center', title : '그린유형', width: '100px' },
				{ key : 'grenCbntFildChkrNm', align:'center', title : '그린확인자명', width: '130px' },
				{ key : 'grenCoreFildCnfDate', align:'center', title : '그린현장확인일자', width: '130px' },
				{ key : 'coreGrenOjcTypCd', align:'center', title : '그린OJC유형', width: '100px' },
				{ key : 'endMtsoNm', align:'center', title : '종료국사명', width: '100px' },
				{ key : 'edgCoreYn', align:'center', title : '말단코어', width: '100px' },
				{ key : 'coreCnntRmk', align:'center', title : '코어접속비고', width: '200px' }]
    	    ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
      		, height: "10row"
        });
    };


    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};

	// 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['intgFcltsCd', 'mtsoTyp', 'mtsoNm', 'bldFlorNo'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList);
	};

	// 컬럼 보이기
    function gridShow() {
    	var showColList = ['intgFcltsCd', 'mtsoTyp', 'mtsoNm', 'bldFlorNo'];
    	$('#'+gridId).alopexGrid("showCol", showColList);
	};

	// 컬럼 숨기기
    function gridSbeqpHide() {
    	var hideColList = ['intgFcltsCd', 'mtsoTyp', 'mtsoNm', 'bldFlorNo'];
    	$('#'+gridIdSbeqp).alopexGrid("hideCol", hideColList);
	};

	// 컬럼 보이기
    function gridSbeqpShow() {
    	var showColList = ['intgFcltsCd', 'mtsoTyp', 'mtsoNm', 'bldFlorNo'];
    	$('#'+gridIdSbeqp).alopexGrid("showCol", showColList);
	};

    function gridResearch() {
        var netDiv = $("#netDiv").getValue();
        var mtsoId = paramData.mtsoId;
        var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";
		var tmpParam =  "netDiv="+netDiv+"&mtsoId="+mtsoId+"&sameOfficeChk="+sameOfficeChk+"&pageNo=1&rowPerPage=100000";

        var eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
		for(var i=0; eqpRoleDivCdList.length > i; i++){
			tmpParam += "&eqpRoleDivCdList=" + eqpRoleDivCdList[i];
		}

		$('#'+gridId).alopexGrid('showProgress');
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/EquipmentList', tmpParam, 'GET', 'equipmentList');

	    $('#'+gridIdSbeqp).alopexGrid('showProgress');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/SbeqpList', tmpParam, 'GET', 'sbeqpList');

        $('#'+gridIdEqpFdf).alopexGrid('showProgress');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/EqpFdfList', tmpParam, 'GET', 'eqpFdfList');

    };

    this.setGrid = function(page, rowPerPage, gubun){

    	var netDiv = $("#netDiv").getValue();
        var mtsoId = paramData.mtsoId;
        var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";

		if (gubun =="E") {
			$('#pageNo').val(page);
			$('#rowPerPage').val(rowPerPage);
			var tmpParam =  "netDiv="+netDiv+"&mtsoId="+mtsoId+"&sameOfficeChk="+sameOfficeChk+"&pageNo="+page+"&rowPerPage="+rowPerPage;

	        var eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
			for(var i=0; eqpRoleDivCdList.length > i; i++){
				tmpParam += "&eqpRoleDivCdList=" + eqpRoleDivCdList[i];
			}

			$('#'+gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/EquipmentList', tmpParam, 'GET', 'equipmentList');
		} else if (gubun == "SE") {
			$('#pageNo2').val(page);
			$('#rowPerPage2').val(rowPerPage);
			var tmpParam =  {netDiv:netDiv, mtsoId:mtsoId, sameOfficeChk:sameOfficeChk, pageNo : page, rowPerPage : rowPerPage};
			$('#'+gridIdSbeqp).alopexGrid('showProgress');
	        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/SbeqpList', tmpParam, 'GET', 'sbeqpList');
		}

	}

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	//장비 역할 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/eqpRoleDiv/C00148/'+ paramData.mgmtGrpNm, null, 'GET', 'eqpRoleDivCd');
    }
    
    function setEventListener() {

    	$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			com.setGrid(eObj.page, eObj.pageinfo.perPage, "E");
		});

		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			com.setGrid(1, eObj.perPage, "E");
		});

		$('#'+gridIdSbeqp).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			com.setGrid(eObj.page, eObj.pageinfo.perPage, "SE");
		});

		$('#'+gridIdSbeqp).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			com.setGrid(1, eObj.perPage, "SE");
		});

    	$('.Radio').on('click', function(e){
    		gridResearch();
 	    });

	   	 $('#eqpRoleDivCdList').multiselect({
			 open: function(e){
				 befEqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
			 },
			 beforeclose: function(e){
				 var codeID =  $("#eqpRoleDivCdList").getData();
	     		 if(befEqpRoleDivCdList+"" != codeID.eqpRoleDivCdList+""){
	     			com.setGrid(1, 100000, "E");
	     		 }
			 }
		 });
    	
    	$('#sameOfficeChk').on('change', function(e) {
    		gridResearch();
    	});

    	$('#'+gridId).on('dblclick', '.bodycell', function(e){
    		var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	dataObj.regYn = "Y";
     	 	if (dataObj.eqpId != undefined && dataObj.eqpId != null && dataObj.eqpId != "") {
     	 		var data = {mtsoEqpGubun : "1", mtsoEqpId : dataObj.eqpId, mtsoEqpNm : dataObj.eqpNm}; // mtsoEqpGubun : 0(국사), 1(장비)
        		parent.top.comMain.popURL(data);
     	 	}
     	});

    	$('#'+gridIdSbeqp).on('dblclick', '.bodycell', function(e){
    		var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
     	 	dataObj.regYn = "Y";
     	 	if (dataObj.sbeqpId != undefined && dataObj.sbeqpId != null && dataObj.sbeqpId != "") {
     	 		var data = {mtsoEqpGubun : "1", mtsoEqpId : dataObj.sbeqpId, mtsoEqpNm : dataObj.sbeqpNm}; // mtsoEqpGubun : 0(국사), 1(장비)
        		parent.top.comMain.popURL(data);
     	 	}
     	});

    	$('#btnEqpReg').on('click', function(e){

 			var param = {"regYn" : "N", "eqpInstlMtsoIdReg": paramData.mtsoId};
 			$a.popup({
 	          	popid: 'itmReg',
 	          	title: "장비등록",
 	            url: "/tango-transmission-web/configmgmt/equipment/EqpRegPop.do",
 	            data: param,
 	            windowpopup : true,
 	            modal: true,
 	            movable:true,
 	            width : 850,
 	            height : window.innerHeight * 0.7,
 	            callback : function(data) { // 팝업창을 닫을 때 실행
 	            	gridResearch();
 	           	}
 			});
    	});

    	$('#btnFdfReg').on('click', function(e){

 			var param = {"regYn" : "N", "eqpInstlMtsoIdReg": paramData.mtsoId};
 			$a.popup({
 	          	popid: 'itmReg',
 	          	title: "FDF등록",
 	            url: "/tango-transmission-web/configmgmt/equipment/EqpFdfReg.do",
 	            data: param,
 	            windowpopup : false,
 	            modal: true,
 	            movable:true,
 	            width : 550,
 	            height : window.innerHeight * 0.55,
 	            callback : function(data) { // 팝업창을 닫을 때 실행
 	            	gridResearch();
 	           	}
 			});
    	});


    	$('#btnSbEqpReg').on('click', function(e){
    		var param = {"regYn" : "N", "eqpInstlMtsoIdReg": paramData.mtsoId};
 			$a.popup({
 	          	popid: 'itmReg',
 	          	title: "부대장비등록",
 	            url: "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do",
 	            data: param,
 	            windowpopup : true,
 	            modal: true,
 	            movable:true,
 	            width : 850,
 	            height : window.innerHeight * 0.7,
 	            callback : function(data) { // 팝업창을 닫을 때 실행
 	            	gridResearch();
 	           	}
 			});
    	});
    };

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'equipmentList'){
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.equipmentList);
    		var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";

    		if(sameOfficeChk == 'Y'){
    			gridShow();
    		}else{
    			gridHide();
    		}
    		$('#'+gridIdEqpFdf).alopexGrid('dataEmpty');

		}

    	if(flag == 'sbeqpList'){
    		$('#'+gridIdSbeqp).alopexGrid('hideProgress');
    		setSPGrid(gridIdSbeqp, response, response.sbeqpList);
    		var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";

    		if(sameOfficeChk == 'Y'){
    			gridSbeqpShow();
    		}else{
    			gridSbeqpHide();
    		}
		}

    	if(flag == 'eqpFdfList'){
    		$('#'+gridIdEqpFdf).alopexGrid('hideProgress');
    		$('#'+gridIdEqpFdf).alopexGrid('dataSet', response.eqpFdfList);

    		var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";
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
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    }

    function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 			//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 		//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
    function dd2dms(v){
		var d, m, sign = '', str;

		d = Math.floor(v);
//		d = v.substring(0,2);
		v = (v - d) * 60;
		m = Math.floor(v);
//		m = v.substring(0,2);
		v = (v - m) * 60;
		x = Math.round(v * Math.pow(10, 2)) / Math.pow(10, 2)
		str = d.toString() + '° ' + m.toString() + "' " + x.toString() + '"';

		return str;
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

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : 550

              });
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
               width : 1200,
               height : window.innerHeight * 0.9

               /*
               	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
               */
               //width: 1000,
               //height: 700

           });
     }
});