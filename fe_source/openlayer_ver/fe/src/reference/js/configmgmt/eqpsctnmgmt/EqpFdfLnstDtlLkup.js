/**
 * EqpFdfLnstDtlLkup.js
 *
 * @author Administrator
 * @date 2016. 11. 08. 오전 09:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGrid';
	var paramData = null;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	$a.page.method = 'POST';
    	//if (! jQuery.isEmptyObject(param) ) {
    	//	paramData = param;
    	//}
    	initGrid();
    	setRegDataSet(param);
        setEventListener();
        
        if (! jQuery.isEmptyObject(param) ) {
        	setGrid(1,300);
        }
    };
    
    function setRegDataSet(data) {
    	
    	$('#contentArea').setData(data);
    }
    
  //Grid 초기화
    function initGrid() {
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
//     			pagerSelect: true,		// perPageCount 표
                pagerSelect: [100,300]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		headerGroup : [ { fromIndex : 0 , toIndex : 2 , title : configMsgArray['front'] , id : "Front"},
                  			{ fromIndex : 4 , toIndex : 6 , title : configMsgArray['back'] , id : "Back" }],
    		columnMapping: [{
    			/* 수용회선	 */
				key : 'lftLineNm', align:'center',
				title : configMsgArray['acceptLine'],
				width: '150px'
			}, {/* 장비	 */
				key : 'lftEqpNm', align:'center',
				title : configMsgArray['equipment'],
				width: '150px'
			}, {/* 포트		 */
				key : 'lftPortNm', align:'center',
				title : configMsgArray['port'],
				width: '70px'
			}, {/* 포트번호 		 */
				key : 'portNm', align:'center',
				title : configMsgArray['portNumber'],
				width: '70px'
			},  {/* 포트		 */
				key : 'rghtPortNm', align:'center',
				title : configMsgArray['port'],
				width: '70px'	
			},	{/* 장비		 */
				key : 'rghtEqpNm', align:'center',
				title : configMsgArray['equipment'],
				width: '150px'
			},{/* 수용회선	 */
				key : 'rghtLineNm', align:'center',
				title : configMsgArray['acceptLine'],
				width: '150px'				
			}],
			message: {/* 데이터가 없습니다.		 */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        //gridHide();
        
    };
    
       
    function setEventListener() {
    	
    	var perPage = 300;
    	
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
    	    	 
	};
		
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.eqpFdfLnstDtlLkup);
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
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    
    // 컬럼 숨기기
    function gridHide() {
    	
    	var hideColList = '';
    	
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	
	}
    
    function setGrid(page, rowPerPage) {
    	
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	 var param =  $("#eqpFdfLnstDtlLkupForm").getData();
		 
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/eqpFdfLnstDtlLkup', param, 'GET', 'search');
    }
    
       
    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})
    	
    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;
		
		}
    }*/
    
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