/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var eqpMdlGridId = 'EqpMdlGrid';
	var namsMatlGridId = 'NamsMatlGrid';



    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {

//    	$('#useYn').setSelected("Y");

    }

  //Grid 초기화
    function initGrid() {

    	eqpMdlGrid();
    	namsMatlGrid();
	};

	function eqpMdlGrid() {
		 $('#'+eqpMdlGridId).alopexGrid({
	        	paging : {
	        		pagerSelect: [100,300,500,1000,5000]
	               ,hidePageList: false  // pager 중앙 삭제
	        	},
	        	defaultColumnMapping:{
	    			sorting : true
	    		},
	        	height : 300,
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		numberingColumnFromZero: false,
	    		columnMapping: [{
					key : 'eqpMdlId', align:'center',
					title : '장비모델ID',
					width: '100px'
				},{
					key : 'eqpCtlgId', align:'center',
					title : '장비카달로그ID',
					width: '100px'
				},{
					key : 'eqpMdlNm', align:'center',
					title : '장비모델명',
					width: '100px'
				},{/* 협력업체ID	 -- 숨김데이터*/
					key : 'bpId', align:'center',
					title : '협력업체ID',
					width: '80px'
				},{/* 협력업체명	 */
					key : 'bpNm', align:'center',
					title : '협력업체명',
					width: '100px'
				}],
				message: {/* 데이터가 없습니다.      */
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
		    });
		 gridHide(eqpMdlGridId);
	}

	function namsMatlGrid() {
		 $('#'+namsMatlGridId).alopexGrid({
	        	paging : {
	        		pagerSelect: [100,300,500,1000,5000]
	               ,hidePageList: false  // pager 중앙 삭제
	        	},
	        	defaultColumnMapping:{
	    			sorting : true
	    		},
	        	height : 300,
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		numberingColumnFromZero: false,
	    		columnMapping: [{/* NAMS자재코드	 */
					key : 'namsMatlCd', align:'center',
					title : 'NAMS자재코드',
					width: '100px'
				},{/*NAMS자재명	 */
					key : 'namsMatlNm', align:'center',
					title : 'NAMS자재명',
					width: '200px'
				},{/* 제조사업체코드	 */
					key : 'vendVndrCd', align:'center',
					title : '제조사업체코드',
					width: '100px'
				},{/* 제조사업체명*/
					key : 'vendVndrNm', align:'center',
					title : '제조사업체명',
					width: '100px'
				},{/* 공급사업체코드	 */
					key : 'splyVndrCd', align:'center',
					title : '공사업체코드',
					width: '100px'
				},{/* 공급사업체명	 */
					key : 'splyVndrNm', align:'center',
					title : '공사업체명',
					width: '100px'
				}],
				message: {/* 데이터가 없습니다.      */
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
		    });
		 gridHide(namsMatlGridId);
	}

	//컬럼 숨기기
	function gridHide(GridId) {
		var hideColList = ['bpId','vendVndrCd','splyVndrCd','eqpCtlgId'];
		$('#'+GridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }

    function setEventListener() {

    	var perPage = 100;

    	// 장비모델 페이지 번호 클릭시
    	 $('#'+eqpMdlGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setEqpMdlGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//장비모델  페이지 selectbox를 변경했을 시.
         $('#'+eqpMdlGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setEqpMdlGrid(1, eObj.perPage);
         });

         //NAMS 자재 페이지 번호 클릭시
    	 $('#'+namsMatlGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setNamsMatlGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//NAMS 자재 페이지 selectbox를 변경했을 시.
         $('#'+namsMatlGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setNamsMatlGrid(1, eObj.perPage);
         });

    	//장비모델 조회
    	 $('#searchEqpMdlButton').on('click', function(e) {
    		 main.setEqpMdlGrid(1,perPage);
         });

    	 // NAMS 자재코드 조회
    	 $('#searchNamsMatlButton').on('click', function(e) {
    		 main.setNamsMatlGrid(1,perPage);
         });

    	 $('#btnCnclReg').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });

    	 $('#btnBarEqpMatlMappReg').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 barEqpMatlMappReg();
         });

    	 //장비모델 그리드 선택시
    	 $('#'+eqpMdlGridId).on('click', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;

    		 if (dataObj._state.selected == true) {
	    		 $('#eqpMdlIdVal').val(dataObj.eqpMdlId);
	    		 $('#eqpMdlNmVal').val(dataObj.eqpMdlNm);
	    		 $('#bpNmVal').val(dataObj.bpNm);
	    		 $('#bpIdVal').val(dataObj.bpId);
    		 }
    		 else {
    			 $('#eqpMdlIdVal').val("");
	    		 $('#eqpMdlNmVal').val("");
	    		 $('#bpNmVal').val("");
	    		 $('#bpIdVal').val("");
    		 }

    	 });

    	 //NAMS 자재 그리드 선택시
    	 $('#'+namsMatlGridId).on('click', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;
    		 if (dataObj._state.selected == true) {
	    		 $('#namsMatlCdVal').val(dataObj.namsMatlCd);
	    		 $('#namsMatlNmVal').val(dataObj.namsMatlNm);
	    		 $('#vendVndrNmVal').val(dataObj.vendVndrNm);
	    		 $('#vendVndrCdVal').val(dataObj.vendVndrCd);
    		 }
    		 else {
    			 $('#namsMatlCdVal').val("");
	    		 $('#namsMatlNmVal').val("");
	    		 $('#vendVndrNmVal').val("");
	    		 $('#vendVndrCdVal').val("");
    		 }
    	 });
	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'searchEqpMdl'){

    		$('#'+eqpMdlGridId).alopexGrid('hideProgress');

    		setSPGrid(eqpMdlGridId, response, response.eqpMdlInf);
    	}

		if(flag == 'searchNamsMatl'){

    		$('#'+namsMatlGridId).alopexGrid('hideProgress');

    		setSPGrid(namsMatlGridId, response, response.namsMatlInf);
    	}

		if(flag == 'BarEqpMatlMappReg'){
    		if(response.Result == "Success"){

        		//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
        			if (msgRst == 'Y') {
        				$a.close(response.resultList);
        			}
        		});
    		}
    		else if (response.Result == "dupBarEqpMatlMappInf") {
    			callMsgBox('','I', response.ResultMessage , function(msgId, msgRst){});
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
    	if(flag == 'searchEqpMdl'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'searchNamsMatl'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'BarEqpMatlMappReg'){
    		//저장 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }


    function barEqpMatlMappReg() {

    	var param =  {}

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.eqpMdlId = $("#eqpMdlIdVal").val();
		 param.eqpMdlNm = $("#eqpMdlNmVal").val();
		 param.bpNm = $("#bpNmVal").val();
		 param.bpId = $("#bpIdVal").val();
		 param.namsMatlCd = $("#namsMatlCdVal").val();
		 param.namsMatlNm = $("#namsMatlNmVal").val();
		 param.vendVndrNm = $("#vendVndrNmVal").val();
		 param.vendVndrCd = $("#vendVndrCdVal").val();
		 param.eqpRmk = $("#eqpRmk").val();
		 param.useYn = 'Y'


		 // 필수값 체크 확인
		 if (param.eqpMdlId == "") {
			 callMsgBox('','W', 'TANGO 장비 모델을 선택 해주세요', function(msgId, msgRst){});
			 return;
		 }

		 if (param.namsMatlCd == "") {
			 callMsgBox('','W', 'NAMS 자재를 선택 해주세요', function(msgId, msgRst){});
			 return;
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/mergeBarEqpMatlMappInf', param, 'GET', 'BarEqpMatlMappReg');
    }

    this.setEqpMdlGrid = function(page, rowPerPage){

//    	$('#cardMdlPageNo').val(page);
//    	$('#cardMdlRowPerPage').val(rowPerPage);

    	var param =  $("#tangoEqpMdlSearchForm").serialize();
    	param = param + "&pageNo=" + page;
    	param = param + "&rowPerPage=" + rowPerPage;
    	 $('#'+eqpMdlGridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/eqpMdlInf', param, 'GET', 'searchEqpMdl');
    }

    this.setNamsMatlGrid = function(page, rowPerPage){

//    	$('#namsMatlPageNo').val(page);
//    	$('#namsMatlRowPerPage').val(rowPerPage);

    	var param =  $("#tangoNamsMatlSearchForm").serialize();
    	param = param + "&pageNo=" + page;
    	param = param + "&rowPerPage=" + rowPerPage;


    	 $('#'+namsMatlGridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/namsMatlInf', param, 'GET', 'searchNamsMatl');
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