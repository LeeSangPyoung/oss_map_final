/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var cardMdlGridId = 'CardMdlGrid';
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

    	cardMdlGrid();
    	namsMatlGrid();
	};

	function cardMdlGrid() {
		 $('#'+cardMdlGridId).alopexGrid({
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
	    		columnMapping: [{/* 카드모델ID	 */
					key : 'cardMdlId', align:'center',
					title : '카드모델ID',
					width: '100px'
				},{/* 카드카달로그ID	 */
					key : 'cardCtlgId', align:'center',
					title : '카드카달로그ID',
					width: '100px'
				},{/* 카드모델명	 */
					key : 'cardMdlNm', align:'center',
					title : '카드모델명',
					width: '100px'
				},{/* 대표장비모델ID	 -- 숨김데이터*/
					key : 'eqpMdlId', align:'center',
					title : '대표장비모델ID',
					width: '100px'
				},{/* 대표장비모델명	 */
					key : 'eqpMdlNm', align:'center',
					title : '대표장비모델명',
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
		 gridHide(cardMdlGridId);
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
		var hideColList = ['bpId', 'eqpMdlId','vendVndrCd','splyVndrCd','cardCtlgId'];
		$('#'+GridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }

    function setEventListener() {

    	var perPage = 100;

    	// 카드모델 페이지 번호 클릭시
    	 $('#'+cardMdlGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setCardMdlGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//카드모델  페이지 selectbox를 변경했을 시.
         $('#'+cardMdlGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setCardMdlGrid(1, eObj.perPage);
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

    	//카드모델 조회
    	 $('#searchCardMdlButton').on('click', function(e) {
    		 main.setCardMdlGrid(1,perPage);
         });

    	 // NAMS 자재코드 조회
    	 $('#searchNamsMatlButton').on('click', function(e) {
    		 main.setNamsMatlGrid(1,perPage);
         });

    	 $('#btnCnclReg').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });

    	 $('#btnBarCardMatlMappReg').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 barCardMatlMappReg();
         });

    	 //카드모델 그리드 선택시
    	 $('#'+cardMdlGridId).on('click', function(e){
    		 var dataObj = null;
    		 dataObj = AlopexGrid.parseEvent(e).data;

    		 if (dataObj._state.selected == true) {
	    		 $('#cardMdlIdVal').val(dataObj.cardMdlId);
	    		 $('#cardMdlNmVal').val(dataObj.cardMdlNm);
	    		 $('#bpNmVal').val(dataObj.bpNm);
	    		 $('#bpIdVal').val(dataObj.bpId);
    		 }
    		 else {
    			 $('#cardMdlIdVal').val("");
	    		 $('#cardMdlNmVal').val("");
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


		if(flag == 'searchCardMdl'){

    		$('#'+cardMdlGridId).alopexGrid('hideProgress');

    		setSPGrid(cardMdlGridId, response, response.cardMdlInf);
    	}

		if(flag == 'searchNamsMatl'){

    		$('#'+namsMatlGridId).alopexGrid('hideProgress');

    		setSPGrid(namsMatlGridId, response, response.namsMatlInf);
    	}

		if(flag == 'BarCardMatlMappReg'){
    		if(response.Result == "Success"){

        		//저장을 완료 하였습니다.
        		callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
        			if (msgRst == 'Y') {
        				$a.close(response.resultList);
        			}
        		});
    		}
    		else if (response.Result == "dupBarCardMatlMappInf") {
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
    	if(flag == 'searchCardMdl'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'searchNamsMatl'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'BarCardMatlMappReg'){
    		//저장 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }


    function barCardMatlMappReg() {

    	var param =  {}

		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 param.cardMdlId = $("#cardMdlIdVal").val();
		 param.cardMdlNm = $("#cardMdlNmVal").val();
		 param.bpNm = $("#bpNmVal").val();
		 param.bpId = $("#bpIdVal").val();
		 param.namsMatlCd = $("#namsMatlCdVal").val();
		 param.namsMatlNm = $("#namsMatlNmVal").val();
		 param.vendVndrNm = $("#vendVndrNmVal").val();
		 param.vendVndrCd = $("#vendVndrCdVal").val();
		 param.cardRmk = $("#cardRmk").val();
		 param.useYn = 'Y'


		 // 필수값 체크 확인
		 if (param.cardMdlId == "") {
			 callMsgBox('','W', 'TANGO 카드 모델을 선택 해주세요', function(msgId, msgRst){});
			 return;
		 }

		 if (param.namsMatlCd == "") {
			 callMsgBox('','W', 'NAMS 자재를 선택 해주세요', function(msgId, msgRst){});
			 return;
		 }

		 param.frstRegUserId = userId;
		 param.lastChgUserId = userId;

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/mergeBarCardMatlMappInf', param, 'GET', 'BarCardMatlMappReg');
    }

    this.setCardMdlGrid = function(page, rowPerPage){

//    	$('#cardMdlPageNo').val(page);
//    	$('#cardMdlRowPerPage').val(rowPerPage);

    	var param =  $("#tangoCardMdlSearchForm").serialize();
    	param = param + "&pageNo=" + page;
    	param = param + "&rowPerPage=" + rowPerPage;
    	 $('#'+cardMdlGridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/cardMdlInf', param, 'GET', 'searchCardMdl');
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