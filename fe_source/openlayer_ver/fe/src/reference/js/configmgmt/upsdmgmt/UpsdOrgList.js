/**
 *  사용안하는 화면
 */
$a.page(function() {

	var rowPerPageCnt = 15;
	var gridId = 'orgGrid';
	this.init = function(id, param) {
		initGrid();
		setEventListener();
		document.onkeypress = enterPress;
    };

    function enterPress(){
    	if(window.event.keyCode == 13){
    		setGrid(1, rowPerPageCnt);
    	}
    }

    // Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	autoColumnIndex: true,
    		rowClickSelect: true,
    		rowSingleSelect: true,
    	    height: 330,
    		//cellSelectable: true,
    		//columnFixUpto: 1,
    		fitTableWidth: true,
    		paging : {
    			hidePageList: true,  // pager 중앙 삭제
    			pagerSelect: false  // 한 화면에 조회되는 Row SelectBox 삭제
    		},

    		columnMapping: [{
				key : 'sisulCd', align : 'center',
				title : '통합시설코드',
				width : '80',
			}, {
				key : 'orgIdNm',  align : 'center',
				title : '본부',
				width : '60',
			}, {
				key : 'sisulNm', align : 'center',
				title : '국사명',
				width : '200'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
    };
  //event 등록
    function setEventListener(param) {
        // 조회
        $('#btnSearch').on('click', function(e) {
			setGrid(1,rowPerPageCnt);
        });

     	// 확인
        $('#btnConfirm').on('click', function(e) {

        	var rowData = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet" , {_state : {selected:true}}));

        	if(rowData.length > 0){
        		var obj = {
        				sisulCd: rowData[0].sisulCd,
        				orgIdL1: rowData[0].orgIdL1,
        				sisulNm: rowData[0].sisulNm
              		};

              		$a.close(obj);
        	}else{
        		alertBox("I","<spring:message code='message.selectNoData'/>");
        		return;
        	}
        });

     	// 닫기
        $('#btnClose').on('click', function(e) {
        	$a.close();
        });

      	//그리드 셀 더블클릭 이벤트 바인딩
      	$('#'+gridId).on('dblclick','.bodycell', function(e){

      		var rowData = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet" , {_state : {focused:true}}));

      		var obj = {
      				sisulCd: rowData[0].sisulCd,
    				orgIdL1: rowData[0].orgIdL1,
    				sisulNm: rowData[0].sisulNm,
    				address: rowData[0].address
          		};
         	$a.close(obj);
		});
	};

    // Grid 조회
    function setGrid(page, rowPerPage) {

    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	var param =  $("#searchFormPopup").getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/upsdOrgList', param, 'GET', 'bps');

    }

    //request 성공시
    function successCallback(response, status, jqxhr, flag){

    	var serverPageinfo;

    	if(response.pager != null){
    		serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    	}
    	if(flag == 'bps'){
    		$('#'+gridId).alopexGrid('hideProgress');
			$('#'+gridId).alopexGrid('dataSet', response.orgList);
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'bps'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		$a.close();
    	}
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