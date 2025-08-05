/**
 * IntgE2ETopoAcptLineCurst.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setRegDataSet(param);
        setEventListener();
        setGrid(1,100);
    };

    function setRegDataSet(data) {
    	$('#contentArea').setData(data);
    }

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    		sorting : true
    		},
    		columnMapping: [{
				key : 'lineNm', align:'left',
				title : '회선명',
				width: '220px'
			}, {
				key : 'svlnNo', align:'center',
				title : '서비스회선번호',
				width: '120px'
			}, {
				key : 'svlnStatNm', align:'center',
				title : '서비스회선상태',
				width: '120px'
			}, {
				key : 'svlnNetDivNm', align:'center',
				title : '망구분',
				width: '70px'
			},{
				key : 'svlnLclNm', align:'center',
				title : '서비스회선분류',
				width: '100px'
			}, {
				key : 'svlnTypNm', align:'center',
				title : '서비스회선유형',
				width: '120px'
			}, {
				key : 'mgmtGrpNm', align:'center',
				title : '관리그룹',
				width: '100px'
			}, {
				key : 'uprMtsoNm', align:'center',
				title : '상위국사',
				width: '150px'
			}, {
				key : 'lowMtsoNm', align:'center',
				title : '하위국사',
				width: '150px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }


    function setEventListener() {

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');

    		$('#'+gridId).alopexGrid('dataSet', response.acptLineForTrkList);
    	}

    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function setGrid(page, rowPerPage) {

		$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/intge2etopo/acptLineForTrkList', param, 'GET', 'search');
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