/**
 * GisConductLineDetailsConfirm.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

$a.page(function() {
	var gridNum = 2;
	var $gridId = null;
	var m = {
			gridObj : function (num){
				return 0 == num ? $('#grid_conductLine') : $('#grid_manhole');
			},
			gridColum : function (num){
				switch (num) {
				case 0    : return columnMapping = [{
	    			key : 'digStartEnd', align:'center',
					title : msgArray['digStartEnd'],
					width: '70px'
	    		}, {
					key : 'len', align:'center',
					title : msgArray['len'],
					width: '100px'
				}, {
					key : 'skyStartEnd', align:'center',
					title : msgArray['skyStartEnd'],
					width: '70px'
				}, {
					key : 'skymapln', align:'center',
					title : msgArray['skymapln'],
					width: '70px'
				}, {
					key : 'checkYn', align:'center',
					title : msgArray['checkYn'],
					width: '70px'
				}];
					break;
				case 1   : return columnMapping = [{
	    			key : 'mhStd', align:'center',
					title : msgArray['mhStd'],
					width: '70px'
	    		}, {
					key : 'accountsQuantity', align:'center',
					title : msgArray['accountsQuantity'],
					width: '100px'
				}, {
					key : 'sapnQuantity', align:'center',
					title : msgArray['sapnQuantity'],
					width: '70px'
				}, {
					key : 'checkYn', align:'center',
					title : msgArray['checkYn'],
					width: '70px'
				}];
					break;
				}
			},
			searchUrl : function (num){
				var url = 'tango-transmission-biz/transmission/constructprocess/accounts/';
				return 0 == num ? url += 'conductLineDistanceConfirm' : url += 'gisManholeQuantityAccordConfirm';
			},
			falg : function (num) {
				if (0 == num) {
					return 'conductLine';
				} else {
					return 'manhole';
				}
			}
	};
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('input[name=cstrCd]').val(parent.baseInform.hiddenCstrCd.value);
    	$('input[name=skAfcoDivCd]').val(parent.baseInform.hiddenCstrCd.value.substring(0,1));
    	initGrid();
    	setGrid();
        setEventListener();
    };
    
    //Grid 초기화
    var initGrid = function () {
    	AlopexGrid.setup({
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},
			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
    	});
    	
    	for (var i=0; i<gridNum;i++) {
        	m.gridObj(i).alopexGrid({
        		columnMapping : m.gridColum(i)
            });
    	}
    };
    
    var setEventListener = function () {
    	
	};
	
	//request 성공시
    var successCallback = function (response, status, xhr,  flag){
    	var data = response.dataList;
    	
    	if ('success' == status) {
    		if ('conductLine' == flag) {
    			m.gridObj(0).alopexGrid('hideProgress');
    			$('#grid_conductLine').alopexGrid('dataSet', data);
    		} else {
    			m.gridObj(1).alopexGrid('hideProgress');
    			$('#grid_manhole').alopexGrid('dataSet', data);
    		}
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
		console.log("subTabs6 : ");
		console.log(param.cstrCd);
		console.log(param.skAfcoDivCd);
		console.log(parent.$('#jintInvtOnrCstrCd').val());
		if($.TcpUtils.isNotEmpty(parent.$('#jintInvtOnrCstrCd').val())){
				param.cstrCd = parent.$('#jintInvtOnrCstrCd').val();
				param.skAfcoDivCd = parent.$('#jintInvtOnrCstrCd').val().substring(0,1);
		}
		console.log(param.cstrCd);
    	
    	var url = "";
		
    	for (var i=0; i<gridNum;i++) {
    		m.gridObj(i).alopexGrid('showProgress');
    		model.get({url : m.searchUrl(i),data : param, flag: m.falg(i)}).done(successCallback).fail(failCallback);
    	}
    }
    
    var model = Tango.ajax.init({});
});