/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';

	var eqpRoleDivCdList =[];
	var eqpMdlIdList =[];

	var hdofcCdList = [];
	var eqpRoleDivCdGridList =[];
	var eqpMdlIdGridList =[];



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


    		var mappingN =  [{	align:'center',	 title : configMsgArray['sequence'], width: '50px', numberingColumn: true},
    			{key : 'matlSetCd', align:'center', title : '자재SET', width: '70px'},
    			{key : 'matlSetNm', align:'center', title : '자재SET명', width: '120px'},
    			{key : 'hdofcNm', align:'center', title : '본부', width: '60px'},
    			{key : 'eqpGunNm', align:'center', title : '장비군', width: '60px'},
    			{key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '60px'},
    			{key : 'eqpMdlNm', align:'center', title : '장비모델', width: '80px'},
    			{key : 'splyVndrNm', align:'center', title : '공급사', width: '60px'},
    			{key : 'namsMatlCd', align:'center', title : '자재코드', width: '70px'},
    			{key : 'barMatlNm', align:'center', title : '자재명', width: '140px'},
    			{key : 'mstEqpRoleDivNm', align:'center', title : '장비타입', width: '60px'},
    			{key : 'eqpGunClVal', align:'center', title : '자재분류', width: '60px'},
    			{
    				key : 'repYn',
    				align:'center',
    				title : '대표여부',
    				width: '60px',
    				render : function(value, data, render, mapping){
						if (value == "Y") {
							return '<font style="color:green">대표</>';
						} else {
							return '';
						}
					},
    			},
    			{key : 'mtrlBasQuty', align:'center', title : '수량', width: '60px'},

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


		 // 본부 코드
		 httpRequest('tango-transmission-biz/transmission/configmgmt/eqpinvtdsnmgmt/com/getHdofcCode', param, 'GET', 'hdofcCode');
		 // 장비타입
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/EQPGUN', null, 'GET', 'eqpRoleDivCd');
		 //장비 모델
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMdl', null,'GET', 'mdl');
		// 자재분류
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/INVECL', null, 'GET', 'eqpGunClVal');

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

         $('#eqpRoleDivCdList').multiselect({
        	 open: function(e){
        		 eqpRoleDivCdList = $("#eqpRoleDivCdList").getData().eqpRoleDivCdList;
        	 },
        	 beforeclose: function(e){
        		 var codeID =  $("#eqpRoleDivCdList").getData();
        		 var param = ""


        		 if(eqpRoleDivCdList+"" != codeID.eqpRoleDivCdList+""){

        			 for(var i=0; codeID.eqpRoleDivCdList.length > i; i++){
        				 param += "&eqpRoleDivCdList=" + codeID.eqpRoleDivCdList[i];
        			 }
        			 httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlMdl', param,'GET', 'mdl');
        		 }
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

	  	   	if ($("#eqpRoleDivCdList").val() != "" && $("#eqpRoleDivCdList").val() != null ){
		   			param.eqpRoleDivCdList = $("#eqpRoleDivCdList").val() ;
		   		} else{
		   			param.eqpRoleDivCdList = [];
		   		}

		   	if ($("#eqpMdlIdList").val() != "" && $("#eqpMdlIdList").val() != null ){
	   			param.eqpMdlIdList = $("#eqpMdlIdList").val() ;
	   		} else{
	   			param.eqpMdlIdList = [];
	   		}


  	   		var now = new Date();
  	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
  	        var excelFileNm = '전송자재SET현황_'+dayTime;
  	   		param.fileName = excelFileNm;
  	   		param.fileExtension = "xlsx";
  	   		param.excelPageDown = "N";
  	   		param.excelUpload = "N";
  	   		param.excelMethod = "getTrmsMatlSetCurstList";
  	   		param.excelFlag = "TrmsMatlSetCurstList";
  	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
  	        fileOnDemendName = excelFileNm+".xlsx";
    		 	$('#'+gridId).alopexGrid('showProgress');
    		 	console.log("Excel param : ", param);
    		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
         });






	};

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



	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.matlSetCurstList);

    	}

		if(flag == 'hdofcCode') {
			$('#hdofcCd').clear();

			var option_data =  [{comGrpCd: "", cd: "",cdNm: configMsgArray['all'], useYn: ""}];
			hdofcCdList.push({"text":"선택","value":""});


			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				hdofcCdList.push({"text":resObj.cdNm,"value":resObj.cd});
			}

			$('#hdofcCd').setData({
				data:option_data
			});

		}

		if(flag == 'eqpRoleDivCd'){

			$('#eqpRoleDivCdList').clear();

			var option_data =  [];
			eqpRoleDivCdList.push({"text":"선택","value":""});
//			eqpRoleDivCdGridList.push({"text":"선택","value":""});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				eqpRoleDivCdList.push({"text":resObj.comCdNm,"value":resObj.comCd});
//				eqpRoleDivCdGridList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#eqpRoleDivCdList').setData({
				data:option_data
			});

		}

		if(flag == 'mdl'){

			$('#eqpMdlIdList').clear();

			var option_data =  [];
			eqpMdlIdList.push({"text":"선택","value":""});

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
				eqpMdlIdList.push({"text":resObj.comCdNm,"value":resObj.comCd});
			}

			$('#eqpMdlIdList').setData({
				data:option_data
			});

		}

		if(flag == 'eqpGunClVal'){

			$('#eqpGunClVal').clear();

			var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

			var selectId = null;
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);

			}

			$('#eqpGunClVal').setData({
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

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id" && gridHeader[i].key != "check" && gridHeader[i].key != "eqpMatlSrnoIcon")) {
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

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/matlmgmt/trmsMatlSetCurst', param, 'GET', 'search');




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

    function lpad(value, length) {
		var strValue = '';
		if (value) {
			if (typeof value === 'number') {
				strValue = String(value);
			}
		}

		var result = '';
		for (var i = strValue.length; i < length; i++) {
			result += strValue;
		}

		return result + strValue;
	}




});