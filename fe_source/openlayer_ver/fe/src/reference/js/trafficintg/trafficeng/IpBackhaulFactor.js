/**
 * IpBackhaulFactor.js
 *
 * @author P094831
 * @date 2016. 9. 12. 오후 03:21:00
 * @version 1.0
 */
var main = $a.page(function() {
	var gridIdTraffic = 'gridTraffic';
	var gridIdPreTraffic = 'gridPreTraffic';

    this.init = function(id, param) {
    	initGrid();
    	setEventListener();
    	$('#btnSearchPreTraffic').click();        
        $('#btnSearchTraffic').click();
    };
 
    function initGrid() {   		    
    	//그리드 생성
	    $('#'+gridIdTraffic).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'fctorNm', align:'left',
				title : 'Factor명',
				width: '130px'
			}, {
				key : 'fctorEndVal', align:'center',
				title : '시작값',
				width: '90px'
			}, {
				key : 'fctorStaVal', align:'center',
				title : '끝값',
				width: '90px'
			}, {
				key : 'fctorDesc', align:'left',
				title : '설명',
				width: '250px'
			}, {
				key : 'lastChgUserId', align:'left',
				title : '최종변경자',
				width: '90px'
			}, {
				key : 'lastChgDate', align:'center',
				title : '최종변경일자',
				width: '90px'
			}, {
				key : 'fctorDivCd', align:'center',
				title : 'fctorDivCd',
				width: '90px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
	    
	    $('#'+gridIdTraffic).alopexGrid("hideCol", ['fctorDivCd'], 'conceal');
	    
	    //그리드 생성
	    $('#'+gridIdPreTraffic).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'fctorNm', align:'left',
				title : 'Factor명',
				width: '130px'
			}, {
				key : 'fctorEndVal', align:'center',
				title : 'Factor값',
				width: '90px'
			}, {
				key : 'fctorDesc', align:'left',
				title : '설명',
				width: '250px'
			}, {
				key : 'lastChgUserId', align:'left',
				title : '최종변경자',
				width: '90px'
			}, {
				key : 'lastChgDate', align:'center',
				title : '최종변경일자',
				width: '90px'
			}, {
				key : 'fctorDivCd', align:'center',
				title : 'fctorDivCd',
				width: '90px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
	    
	    $('#'+gridIdPreTraffic).alopexGrid("hideCol", ['fctorDivCd'], 'conceal');
    }
    
    this.setGridTraffic = function(page, rowPerPage) {
    	$('#'+gridIdTraffic).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	param.stcEqpTypCd = '06'
    	param.fctorNm = $('#traffic').val();
        
    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/factorTraffic', param, successCallbackSearchTraffic, failCallback, 'GET');
    }
    
    this.setGridPreTraffic = function(page, rowPerPage) {
    	$('#'+gridIdPreTraffic).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	param.stcEqpTypCd = '09'
        param.fctorNm = $('#preTraffic').val();
        
    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/factorTraffic', param, successCallbackSearchPreTraffic, failCallback, 'GET');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	$a.popup({
    		popid: pidData,
    		title: titleData,
    		url: urlData,
    		data: paramData,
    		windowpopup: false,
    		modal: true,
    		movable:true,
    		width : 500,
    		height : 230
    	});
    }
    
    function setEventListener() {
    	//탭변경 이벤트
   	 	$('#basicTabs').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				$('#'+gridIdTraffic).alopexGrid("viewUpdate"); 
				break;
			case 1 :
				$('#'+gridIdPreTraffic).alopexGrid("viewUpdate");
				break;
			default :
				break;
			}
    	});
  	 	//탭더블클릭 이벤트
   	 	$('#'+gridIdTraffic).on("dblclick", function(e) {
 		
	 		var dataObj = null;
     	 	dataObj = AlopexGrid.parseEvent(e).data;
	 		dataObj.fctor = "traffic";

	 		popup('FactorUpdate', 'FactorUpdate.do', '대표트래픽Factor수정', dataObj);
   	    });
	   	
   	 	$('#btnUpTraffic').on('click',function(e){
	 		var data = $('#'+gridIdTraffic).alopexGrid('dataGet', {_state: {selected:true}});
	 		if(data.length > 0){
	 			data[0].fctor = "traffic";
	 			
	 			popup('FactorUpdate', 'FactorUpdate.do', '대표트래픽Factor수정', data[0]);
	 		}else{
	 			//변경할 대상을 선택하세요.
				callMsgBox('','W', configMsgArray['selectChangeObject'], function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
	 		}
	 			 		
	 	});
   	 	//탭더블클릭 이벤트
   	 	$('#'+gridIdPreTraffic).on("dblclick", function(e) {
	   	 	var dataObj = null;
	 	 	dataObj = AlopexGrid.parseEvent(e).data;
	 	 	dataObj.fctor = "preTraffic";
	 		
	 		popup('FactorUpdate', 'FactorUpdate.do', '예측트래픽Factor수정', dataObj);
   	    });
	 	$('#btnUpPreTraffic').on('click',function(e){
	 		var data = $('#'+gridIdPreTraffic).alopexGrid('dataGet', {_state: {selected:true}});
	 		if(data.length > 0){
	 			data[0].fctor = "PreTraffic";
	 		
	 			popup('FactorUpdate', 'FactorUpdate.do', '예측트래픽Factor수정', data[0]);
	 		}else{
	 			//변경할 대상을 선택하세요.
				callMsgBox('','W', configMsgArray['selectChangeObject'], function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
	 		}
	 		    		
	 	});
	 	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearchTraffic').on('click', function(e) {
        	main.setGridTraffic(1, eobjk);
        });
        
        $('#btnSearchPreTraffic').on('click', function(e) {
        	main.setGridPreTraffic(1, eobjk);
        })
        
        $('#traffic').keydown(function(e){
        	if(e.keyCode == 13){
        		main.setGridTraffic(1,eobjk);
        	}
        })
        
        $('#preTraffic').keydown(function(e){
        	if(e.keyCode == 13){
        		main.setGridPreTraffic(1,eobjk);
        	}
        })
        
        //페이지 선택 시
        $('#'+gridIdTraffic).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            main.setGridTraffic(eObj.page, eObj.pageinfo.perPage);
        });
        
        //페이지 selectbox를 변경했을 시.
        $('#'+gridIdTraffic).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            eobjk = eObj.perPage;
            main.setGridTraffic(1, eobjk);
        });
        
        //페이지 선택 시
        $('#'+gridIdPreTraffic).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            main.setGridPreTraffic(eObj.page, eObj.pageinfo.perPage);
        });
        
        //페이지 selectbox를 변경했을 시.
        $('#'+gridIdPreTraffic).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            eobjk = eObj.perPage;
            main.setGridPreTraffic(1, eobjk);
        });
	};
	
	//request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }
    
    //request 성공시
	var successCallbackSearchTraffic = function(response){
		$('#'+gridIdTraffic).alopexGrid('hideProgress');
		setSPGridTraffic(gridIdTraffic,response, response.factorTraffic);
	}
    
	//request 성공시
	var successCallbackSearchPreTraffic = function(response){
		$('#'+gridIdPreTraffic).alopexGrid('hideProgress');
		setSPGridPreTraffic(gridIdPreTraffic,response, response.factorTraffic);
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
    function setSPGridTraffic(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}
    
    //Grid에 Row출력
    function setSPGridPreTraffic(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}
});