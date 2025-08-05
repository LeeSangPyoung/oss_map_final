/**
 * PortInfCopyReg.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var fromGridId = 'fromDataGrid';
	var toGridId = 'toDataCopyGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setRegDataSet(param);
    	setEventListener()
    	setFromGrid(1,100);        
    	setToGrid(1,100);
    };
    
    function setRegDataSet(data) {
    	
    	$('#contentArea').setData(data);
    }
    
  //Grid 초기화
    function initGrid() {
  		
        //그리드 생성
        $('#'+fromGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		columnMapping: [{
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '120px'
			}, {
				key : 'portIdxNo', align:'center',
				title : 'INDEX',
				width: '70px'
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트 IP',
				width: '70px'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '70px'
			},{
				key : 'portDesc', align:'center',
				title : '설명',
				width: '70px'
			}, {
				key : 'portAlsNm', align:'center',
				title : '별명',
				width: '150px'			
			}]
        });
        
        
  		
        //그리드 생성
        $('#'+toGridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	height:"4row",
        	rowClickSelect: true,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		columnMapping: [{
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '120px'
			}, {
				key : 'portIdxNo', align:'center',
				title : 'INDEX',
				width: '70px'
			}, {
				key : 'portIpAddr', align:'center',
				title : '포트 IP',
				width: '70px'
			}, {
				key : 'portNm', align:'center',
				title : '포트명',
				width: '70px'
			},{
				key : 'portDesc', align:'center',
				title : '설명',
				width: '70px'
			}, {
				key : 'portAlsNm', align:'center',
				title : '별명',
				width: '150px'
			}]
        });
        
    };
    
    function setEventListener() {
    	
    	// 페이지 번호 클릭시
    	 $('#'+fromGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setFromGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+fromGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setFromGrid(1, eObj.perPage);
         });
    	
         // 페이지 번호 클릭시
    	 $('#'+toGridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setToGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+toGridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setToGrid(1, eObj.perPage);
         });
	};
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'from') {
    		$('#'+fromGridId).alopexGrid('hideProgress');
    		
    		setSPGrid(fromGridId, response, response.fromLinkInf);
    	}
    	
    	if(flag == 'to') {
    		$('#'+toGridId).alopexGrid('hideProgress');
    		
    		setSPGrid(toGridId, response, response.toLinkInf);
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
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    
    function setFromGrid(page, rowPerPage) {
    	
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	 var param =  $("#searchForm").getData();
		 
		 $('#'+fromGridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/fromLinkInf', param, 'GET', 'from');
    }
    
    function setToGrid(page, rowPerPage) {
    	
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	 var param =  $("#searchForm").getData();
		 
		 $('#'+toGridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/toLinkInf', param, 'GET', 'to');
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