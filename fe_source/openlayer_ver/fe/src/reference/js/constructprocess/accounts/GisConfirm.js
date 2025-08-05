/**
 * GisConfirm.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('input[name=cstrCd]').val(parent.baseInform.hiddenCstrCd.value);
    	initGrid();
    	setGrid();
        setEventListener();
    };
    
  //Grid 초기화
    var initGrid = function () {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},
    		
    		columnMapping: [{
    			key : 'wkrtNo', align:'center',
				title : msgArray['wkrtNo'],
				width: '70px'
    		}, {
				key : 'workNm', align:'center',
				title : msgArray['workNm'],
				width: '200px'
			}, {
				key : 'docTruDt', align:'center',
				title : msgArray['docTruDt'],
				width: '70px'
			}, {
				key : 'docMap', align:'center',
				title : msgArray['docMap'],
				width: '70px'
			}, {
				key : 'docSkyMapYn', align:'center',
				title : msgArray['docSkyMapYn'],
				width: '70px'
			}, {
				key : 'docStatus', align:'center',
				title : msgArray['docStatus'],
				width: '70px'
			}],
			
			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
        });
        
        //gridHide();
        
    };
    
    var setEventListener = function () {
	};
	
	//request 성공시
    var successCallback = function (response, status, xhr,  flag){
    	var data = response.dataList;
    	$('#'+gridId).alopexGrid('hideProgress');
    	
    	if (0 == data.length) {
			return false;
    	} else {
    		$('#dataGrid').alopexGrid('dataSet', data);
    	}
    }
    
    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }
    
    //데이터 조회
    var setGrid = function (page, rowPerPage) {
    	var param =  $("form[name=searchForm]").getData();
    	
    	// 공동투자-참여사시 cstrCd 대체 2017.08.25 추가
		console.log("subTabs5 : ");
		console.log(param.cstrCd);
		console.log(parent.$('#jintInvtOnrCstrCd').val());
		if($.TcpUtils.isNotEmpty(parent.$('#jintInvtOnrCstrCd').val())){
				param.cstrCd = parent.$('#jintInvtOnrCstrCd').val();
		}
		console.log(param.cstrCd);
    	
    	var url = "tango-transmission-biz/transmission/constructprocess/accounts/gisConfirm";
		 
    	$('#'+gridId).alopexGrid('showProgress');
		 
    	model.get({url : url,data : param}).done(successCallback).fail(failCallback);
    }
    
    var model = Tango.ajax.init({});
});