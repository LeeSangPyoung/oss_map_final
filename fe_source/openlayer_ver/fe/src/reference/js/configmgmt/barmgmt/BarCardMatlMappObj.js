
$a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
        setRegDataSet(param);
    };

    function setRegDataSet(data) {

    	 $('#btnSaveReg').setEnabled(false);

    }


	//Grid 초기화
    function initGrid() {

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
//    		rowClickSelect : false,
        	rowSingleSelect : false,

//    		rowSelectOption: {
//    			clickSelect: true,
//    			singleSelect : false
//    		},
        	headerGroup:  [{fromIndex:1, toIndex:7, title:"TANGO", id:'u0'}
								,{fromIndex:8, toIndex:15, title:"NAMS", id:'u1'}],
    		columnMapping: [{
    			/* 선택 			 */
				align:'center',
//				title : '선택',
				key: 'ck',
				width: '50px',
				selectorColumn : true
			},{/* 협력업체ID	 --숨김데이터*/
				key : 'bpId', align:'center',
				title : '협력업체ID',
				width: '80px'
			},{/* 협력업체명	 */
				key : 'bpNm', align:'center',
				title : '협력업체명',
				width: '80px'
			},{/* 카드모델ID	 */
				key : 'cardMdlId', align:'center',
				title : '카드모델ID',
				width: '120px'
			},{/* 카드모델명	 */
				key : 'cardMdlNm', align:'center',
				title : '카드모델명',
				width: '120px'
			},{/* 대표장비모델명	 */
				key : 'repEqpMdlNm', align:'center',
				title : '대표장비모델명',
				width: '180px'
			},{/* 대표장비모델ID  -- 숨김데이터	 */
				key : 'repEqpMdlId', align:'center',
				title : '대표장비모델ID',
				width: '180px'
			},{/* 카드건수	 */
				key : 'cardCnt', align:'center',
				title : '카드건수',
				width: '80px'
			},{/* 시설구분	 */
				key : 'fcltsDivVal', align:'center',
				title : '시설구분',
				width: '80px'
			},{/* NAMS자재코드	 */
				key : 'namsMatlCd', align:'center',
				title : 'NAMS자재코드',
				width: '100px'
			},{/* NAMS자재명	 */
				key : 'namsMatlNm', align:'center',
				title : 'NAMS자재명',
				width: '280px'
			},{/* 제조사업체코드	 --숨김데이터*/
				key : 'vendVndrCd', align:'center',
				title : '제조사업체코드',
				width: '120px'
			},{/* 제조사명 */
				key : 'vendVndrNm', align:'center',
				title : '제조사명',
				width: '100px'
			},{/* 공급사업체코드	 -- 숨김데이터 */
				key : 'splyVndrCd', align:'center',
				title : '공급사업체코드',
				width: '180px'
			},{/* 공급사명  -- 숨김데이터*/
				key : 'splyVndrNm', align:'center',
				title : '공급사명',
				width: '180px'
			},{/* 자제건수 */
				key : 'matlCnt', align:'center',
				title : '자재건수',
				width: '80px'
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['bpId','repEqpMdlId', 'splyVndrCd','splyVndrNm','vendVndrCd'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}
	function setSelectCode() {

		//시설구분코드
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/FCLTSDIV', null, 'GET', 'fcltsDiv');
	}

    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         	$('#btnSaveReg').setEnabled(false);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	setGrid(1, eObj.perPage);
         	$('#btnSaveReg').setEnabled(false);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 $('#btnSaveReg').setEnabled(false);
    		 setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setGrid(1,perPage);
       		}
     	 });
         //적용
         $('#btnSaveReg').on('click', function(e) {
        	 barCardMatlMappReg();
         });
         $('#'+gridId).on('click', function(e){
//         $('#'+gridId).on('click', '.bodycell', function(e){

        	 // 체크박스에 체크가 되어 있는지 확인
        	 var bCheked = false;
    		 var node_List = document.getElementsByTagName('input');
    		 for (var i=0; i < node_List.length; i++) {
    			 var node = node_List[i];

    			 if (node.getAttribute('type') == 'checkbox') {
    				 	if (node.checked == true) {
    				 		bCheked = true;
    				 		break;
    				 	}

    			 }
    		 }
//    		 var selectData = $('#'+gridId).alopexGrid('dataGet',{_state: {selected:true}});
//    		 var ele = document.getElementsByName('')

//    		 if (selectData[0] != null || selectData[0] != undefined) {
    		 if(bCheked == true) {
    			 $('#btnSaveReg').setEnabled(true);
    		 }
    		 else
    			 $('#btnSaveReg').setEnabled(false);

    	 });

	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.namsMatlObjInf);
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

    	if(flag == 'fcltsDiv'){
    		var option_data =  [{comCd: "", comCdNm: "전체"}];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#fcltsDivCd').setData({
	             data:option_data,
	             fcltsDivCd:"003"
			});


    	}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'BarCardMatlMappReg'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
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

    function setGrid(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/namsMatlObjInf', param, 'GET', 'search');
    }

    function barCardMatlMappReg() {

    	var param =   $('#'+gridId).alopexGrid('dataGet',{_state: {selected:true}});

   		 var userId;
		 if($("#userId").val() == ""){
			 userId = "SYSTEM";
		 }else{
			 userId = $("#userId").val();
		 }

		 for(var i=0; i<param.length; i++){
			 param[i].useYn = "Y";
			 param[i].frstRegUserId = userId;
			 param[i].lastChgUserId = userId;
		}

		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/mergeMultBarCardMatlMappInf', param, 'POST', 'BarCardMatlMappReg');
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