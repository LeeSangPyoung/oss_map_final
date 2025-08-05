/**
 * <ul>
 * <li>업무 그룹명 : tango-transmission-web</li>
 * <li>서브 업무명 : RingInfLkup.jsp</li>
 * <li>설 명 : 링정보 조회</li>
 * <li>작성일 : 2016. 8. 22.</li>
 * <li>작성자 : P098821</li>
 * </ul>
 */
$a.page(function() {
	var selectInit = [];
	var gridId = 'dataGrid';

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };
 
    function initGrid() {
        //그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'networkType', align:'left',
				title : '망구분',
				width: '150px'
			}, {
    			key : 'ringType', align:'left',
				title : '링구분',
				width: '150px'
			}, {
    			key : 'ringName', align:'left',
				title : '링명',
				width: '200px'
			}, {
    			key : 'node1', align:'left',
				title : '노드#1',
				width: '200px'
			}, {
    			key : 'node1Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node2', align:'left',
				title : '노드#2',
				width: '200px'
			}, {
    			key : 'node2Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node3', align:'left',
				title : '노드#3',
				width: '200px'
			}, {
    			key : 'node3Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node4', align:'left',
				title : '노드#4',
				width: '200px'
			}, {
    			key : 'node4Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node5', align:'left',
				title : '노드#1',
				width: '200px'
			}, {
    			key : 'node5Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node6', align:'left',
				title : '노드#6',
				width: '200px'
			}, {
    			key : 'node6Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node7', align:'left',
				title : '노드#7',
				width: '200px'
			}, {
    			key : 'node7Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node8', align:'left',
				title : '노드#8',
				width: '200px'
			}, {
    			key : 'node8Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node9', align:'left',
				title : '노드#9',
				width: '200px'
			}, {
    			key : 'node9Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node10', align:'left',
				title : '노드#10',
				width: '200px'
			}, {
    			key : 'node10Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node11', align:'left',
				title : '노드#11',
				width: '200px'
			}, {
    			key : 'node11Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node12', align:'left',
				title : '노드#12',
				width: '200px'
			}, {
    			key : 'node12Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node13', align:'left',
				title : '노드#13',
				width: '200px'
			}, {
    			key : 'node13Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node14', align:'left',
				title : '노드#14',
				width: '200px'
			}, {
    			key : 'node14Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node15', align:'left',
				title : '노드#15',
				width: '200px'
			}, {
    			key : 'node15Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node16', align:'left',
				title : '노드#16',
				width: '200px'
			}, {
    			key : 'node16Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node17', align:'left',
				title : '노드#17',
				width: '200px'
			}, {
    			key : 'node17Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node18', align:'left',
				title : '노드#18',
				width: '200px'
			}, {
    			key : 'node18Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node19', align:'left',
				title : '노드#19',
				width: '200px'
			}, {
    			key : 'node19Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node20', align:'left',
				title : '노드#20',
				width: '200px'
			}, {
    			key : 'node20Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node21', align:'left',
				title : '노드#21',
				width: '200px'
			}, {
    			key : 'node21Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node22', align:'left',
				title : '노드#22',
				width: '200px'
			}, {
    			key : 'node22Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}, {
    			key : 'node23', align:'left',
				title : '노드#23',
				width: '200px'
			}, {
    			key : 'node23Len', align:'right',
				title : '거리(m)',
				width: '90px'
			}]
	    });
    }
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
        var selectList = [ {el: '#networkType', url: 'ntwkcds', key: 'comCd', label: 'comCdNm'}
 	                      ,{el: '#ringType', url: 'ringcds', key: 'comCd', label: 'comCdNm'} 	                      
 	                      ];
 	
        for(var i=0; i<selectList.length; i++){
            selectInit[i] = Tango.select.init({
                                                 el: selectList[i].el
                                                ,model: Tango.ajax.init({
                                                                         url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url
                                                                         })
                                                ,valueField: selectList[i].key
                                                ,labelField: selectList[i].label
                                                ,selected: 'all'
                                                })
      	
            selectInit[i].model.get();
        }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	
    	param.networkType = selectInit[0].getValue();
    	param.ringType = selectInit[1].getValue();
    	param.ringName = $('#ringName').val();
    	
    	httpRequest('tango-transmission-biz/trafficintg/presentstatusmgmt/getRingInfLkup', param, successCallbackSearch, failCallback, 'GET');
    }
    
    function setEventListener() {
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, 10);
        });
        
        $("#ringName").on('keypress', function(e){
        	if (e.keyCode === 13){
        		$('#btnSearch').trigger('click');
        	}
        });
        
        //페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(eObj.page, eObj.pageinfo.perPage);
        });
        
        //페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(1, eObj.perPage);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').click(function(){
        	var worker = new ExcelWorker({
        		excelFileName : '링정보',
        		palette : [{
        			className : 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className : 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '링정보',
        			$grid: $('#'+gridId)
        		}]
        	});
        	worker.export({
        		merge: false,
        		exportHidden: false,
        		filtered  : false,
        		selected: false,
        		useGridColumnWidth : true,
        		border  : true
        	});
        });
	};
    
	//request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//alert(response.__rsltMsg__);
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }
    
    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.lists);
	}
    
    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional

    }
    
    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}
});