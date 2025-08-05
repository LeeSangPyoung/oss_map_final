
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid('N');
        setEventListener();
        setRegDataSet(param);

        httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/optlMdulInf', param, 'GET', 'optlMdulInf');
    };

    function setRegDataSet(data) {

    	$('#'+gridId).alopexGrid('showProgress');

    }

//
	//Grid 초기화
    function initGrid(strGubun) {

    	if (strGubun == "N") {
    		var mappingN =  [{ align:'center', title : '순번', width: '40px', numberingColumn: true },
    			{ key : 'lastChgDate', align:'center', title : '최종업데이트시간', width: '120px' },
        		{ key : 'barNo', align:'center', title : '바코드번호', width: '80px' },
        		{ key : 'serNo', align:'center', title : '시리얼번호', width: '80px' },
        		{ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '100px' },
        		{ key : 'intgFcltsNm', align:'center', title : '통합시설명', width: '180px' },
        		{ key : 'namsMatlCd', align:'center', title : 'NAMS자재코드', width: '100px' },
        		{ key : 'namsMatlNm', align:'center', title : 'NAMS자재명', width: '180px' },
        		{ key : 'curstLocNm', align:'center', title : 'NAMS위치명', width: '120px' },
        		{ key : 'matlStatDivCd', align:'center', title : '자재상태코드', width: '80px' },
        		{ key : 'matlStatNm', align:'center', title : '자재상태', width: '60px' }];
    	} else {
    		var mappingN =  [{ align:'center', title : '순번', width: '40px', numberingColumn: true },
    			{ key : 'lastChgDate', align:'center', title : '최종업데이트시간', width: '120px' },
    			{ key : 'mtsoNm', align:'center', title : '국사명', width: '120px' },
    			{ key : 'eqpRoleDivNm', align:'center', title : '장비타입', width: '80px' },
        		{ key : 'eqpId', align:'center', title : '장비ID', width: '80px' },
        		{ key : 'eqpNm', align:'center', title : '장비명', width: '100px' },
        		{ key : 'portId', align:'center', title : '포트ID', width: '80px' },
        		{ key : 'portNm', align:'center', title : '포트명', width: '80px' },
        		{ key : 'serNo', align:'center', title : '시리얼번호', width: '80px' },
        		{ key : 'barNo', align:'center', title : '바코드번호', width: '80px' },
        		{ key : 'vendPartsNoVal', align:'center', title : 'Part Number', width: '80px' }];
    	}


        $('#'+gridId).alopexGrid({
//        	 cellSelectable : true,
             autoColumnIndex : true,
//             fitTableWidth : true,
//             rowClickSelect : true,
//             rowSingleSelect : true,
//             rowInlineEdit : true,
             pager : false,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:false
            }, columnMapping : mappingN
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row"
        });

        gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['matlStatDivCd', 'cardStatCd','barNo','serNo','eqpId','portId'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setEventListener() {


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

        $('#hisTabs').on('tabchange', function(e, index, index2){

        	index = index+1;


        	if (index == 1) {
        		$('#'+gridId).alopexGrid('showProgress');
        		initGrid('N');

        		//NAMS 이력
            	httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/namsHisInf', paramData, 'GET', 'namsHisInf');
        	}
        	else {
        		$('#'+gridId).alopexGrid('showProgress');
        		initGrid();
        		//TANGO 이력
            	httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/tangoOptlMdulHisInf', paramData, 'GET', 'tangoOptlMdulHisInf');
        	}

        });


	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){



    	if(flag == 'optlMdulInf'){
    		$('#searchForm').setData(response.optlMdulInf[0]);

    		paramData = response.optlMdulInf[0];
    		//NAMS 이력
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/namsHisInf', paramData, 'GET', 'namsHisInf');
    	}

    	if(flag == 'namsHisInf'){
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.namsHisInf);
    	}

    	if(flag == 'tangoOptlMdulHisInf'){
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.tangoOptlMdulHisInf);
    	}


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
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
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barCardMatlMappMgmt', param, 'GET', 'search');
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