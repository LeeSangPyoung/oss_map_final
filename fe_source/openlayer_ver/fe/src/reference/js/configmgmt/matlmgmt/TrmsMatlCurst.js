/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';
	var eqpGunList = [];



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
    function initGrid(strGubun) {

//    	$('#'+gridId).removeAlopexGrid();

    	var headerMappingN =  [
    		{fromIndex:0, toIndex:14, title:"NAMS정보", id:'u0'},
    		{fromIndex:15, toIndex:21, title:"TANGO정보", id:'u1'}
		];

    		var mappingN =  [
    			{key : 'hdofcNm', align:'center', title : '본부', width: '120px'},
    			{key : 'eqpGunNm', align:'center', title : '장비군', width: '120px'},
    			{key : 'eqpTypNm', align:'center', title : '장비타입', width: '120px'},
    			{key : 'namsMatlCd', align:'center', title : 'NAMS자재코드', width: '120px'},
    			{key : 'namsMatlNm', align:'center', title : 'NAMS자재명', width: '300px'},
    			{key : 'matlBarNo', align:'center', title : '바코드번호', width: '120px'},
    			{key : 'prntMatlBarNo', align:'center', title : '부모바코드', width: '120px'},
    			{key : 'vendSerNo', align:'center', title : '시리얼번호', width: '120px'},
    			{key : 'vendNm', align:'center', title : '제조사명', width: '100px'},
    			{key : 'prvdNm', align:'center', title : '공급사명', width: '80px'},
    			{key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '100px'},
    			{key : 'intgFcltsNm', align:'center', title : '통합시설명', width: '140px'},
    			{key : 'mnftDt', align:'center', title : '제조일자', width: '80px'},
    			{key : 'curstLocNm', align:'center', title : 'NAMS위치명', width: '200px'},
    			{key : 'matlStatNm', align:'center', title : '자재상태', width: '80px'},
    			{key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '80px'},
    			{key : 'bpNm', align:'center', title : '협력업체명', width: '80px'},
    			{key : 'eqpMdlNm', align:'center', title : '장비모델명', width: '120px'},
    			{key : 'mtsoNm', align:'center', title : '국사명', width: '140px'},
    			{key : 'eqpNm', align:'center', title : '장비명', width: '140px'},
    			{key : 'cardMdlNm', align:'center', title : '카드모델명', width: '120px'},
    			{key : 'cardNm', align:'center', title : '카드명', width: '120px'},
    			];



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
    		headerGroup: headerMappingN,
			columnMapping : mappingN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

//	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['eqpMdlId', 'splyVndrCd','splyVndrNm','vendVndrCd'];
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


		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/NAMSHDOF', null, 'GET', 'hdofcCd');

		// 장비군
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03085', null, 'GET', 'eqpGunCd');

		// 장비타입
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/EQPGUN', null, 'GET', 'eqpTypCd');

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

      // 엑셀 다운로드
 		$("#btnExportExcel").on("click", function(e) {
 			var gridData = $('#'+gridId).alopexGrid('dataGet');
 			if (gridData.length == 0) {
 				callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
 					return;
 			}

 			var param =  $("#searchForm").getData();
 	   		param = gridExcelColumn(param, gridId);
 	   		param.pageNo = 1;
 	   		param.rowPerPage = 60;
 	   		param.firstRowIndex = 1;
 	   		param.lastRowIndex = 1000000000;
 	   		param.inUserId = $('#sessionUserId').val();


 	   		var now = new Date();
 	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
 	        var excelFileNm = '전송자재현황_'+dayTime;
 	   		param.fileName = excelFileNm;
 	   		param.fileExtension = "xlsx";
 	   		param.excelPageDown = "N";
 	   		param.excelUpload = "N";
 	   		param.excelMethod = "getTrmsMatlCurstList";
 	   		param.excelFlag = "TrmsMatlCurstList";
 	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
 	        fileOnDemendName = excelFileNm+".xlsx";
   		 	$('#'+gridId).alopexGrid('showProgress');
   		 	console.log("Excel param : ", param);
   		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
 		});

 		// 장비비군 멀티 Select
		$('#eqpGunCdList').multiselect({
			open: function(e){
				eqpGunCdList = $("#eqpGunCdList").getData().eqpGunCdList;
			},
			beforeclose: function(e){
				var codeID =  $("#eqpGunCdList").getData();
				var param = "comGrpCd=EQPGUN";

				if(eqpGunCdList+"" != codeID.eqpGunCdList+""){

					for(var i=0; codeID.eqpGunCdList.length > i; i++){
						param += "&etcAttrValMlt1=" + codeID.eqpGunCdList[i];
					}
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd', param,'GET', 'eqpTypCd');

				}
			}
		});







	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.matlCurstList);

    	}

		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

		// 장비군
		if(flag == 'eqpGunCd'){

			$('#eqpGunCdList').clear();

			var option_data =  [];
			eqpGunList.push({"text":"선택","value":""});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
//				eqpGunList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#eqpGunCdList').setData({
				data:option_data
			});
		}

		// 장비 타입
		if(flag == 'eqpTypCd'){

			$('#eqpTypCd').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}


			$('#eqpTypCd').setData({
				data:option_data
			});
		}

		if(flag == 'hdofcCd'){
			$('#hdofcCd').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}


			$('#hdofcCd').setData({
				data:option_data
			});
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

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlCurst', param, 'GET', 'search');




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




});