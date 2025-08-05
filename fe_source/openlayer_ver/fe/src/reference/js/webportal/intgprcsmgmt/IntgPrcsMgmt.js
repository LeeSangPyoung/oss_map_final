/**
 * ErpPriceList
 *
 * @author P028750
 * @date 2016. 9. 29. 오전 17:30:03
 * @version 1.0
 */

$a.page(function() {
    
	var m = {
			form: {
				intgPrcsFormObject:$('#intgPrcsForm')
			},
			
			grid :{
				engSheetGrid :$('#engSheetGrid'),
				constructionGrid :$('#constructionGrid'),
				workGrid :$('#workGrid')
			},	
			api:{
				detail:'tango-transmission-biz/transmission/webportal/intgprcsmgmt/appltReceipt'						// 통합공정리스트조회				
			}		
		};
	
	// ajax model
    var selectComponentModel = Tango.ajax.init({
    });
	
	this.init = function(id, param) {
		initGrid();
		
		var appltNo = "";
		if($.TcpUtils.isEmpty(param.appltNo) == false){
			appltNo = param.appltNo;
		}
		
		//var appltNo = param.appltNo;
		//var engstNo = param.engstNo;
	//	var appltNo = 'B082016083000000082';		
    	
		getDetailData(appltNo);		
    };	

	var initGrid = function () {
		
		//그리드 생성
        m.grid.engSheetGrid.alopexGrid({ 
        	height : 300,
        	columnMapping: [{
				key : 'engstNo', 
				title : "ENG시트번호",
				width : '100px'					
			}, 
			{
				key : 'afeYr',
				title : 'AFE년도',
				width: '120px'				
			},					
			{
				key : 'uprDemdBizDivNm',
				title : '상위수요사업구분코드명',
				width: '120px'				
			},
			{
				key : 'lowDemdBizDivNm',
				title : '하위수요사업구분코드명',
				width: '120px'				
			},				{
				key : 'engSheetSta',
				title : '진행상태',
				width: '120px'				
			},				
			{
				key : 'afeNo',
				title : 'AFE번호',
				width: '120px'				
			}			
			]
        	
        });

        
	};
	
	var httpRequest = function(uri,data,method,flag){
		
		Tango.ajax({
			url : uri,
			data : data,
			method : method,
			flag:flag
		}).done(function(response){successCallback(response, flag);})
			.fail(function(response){failCallback(response, flag);});
		
	};
	
	var getDetailData = function(appltNo){
		$('body').progress();
		var paramArray = {}
		$.extend(paramArray, {"appltNo": appltNo});
  		httpRequest(m.api.detail, paramArray, 'GET','detail');
	};
	
	var successCallback = function(response, flag){
		
		
		switch (flag) { 
		case 'detail':  
			$('body').progress().remove();
			
			//
			m.form.formObject.setData(response.returnVo);
			
			detailSearchDataSet = response.returnVo;
			break;
		default:
			
		}
		
	};
	
	var failCallback = function(response,flag){
		
		alert("fail:" + response);
	};
	

    
});
