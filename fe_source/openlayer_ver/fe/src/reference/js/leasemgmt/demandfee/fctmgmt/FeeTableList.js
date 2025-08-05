/**
 * FeeTableList.js
 * 요금테이블 관리
 *
 * @author 정중식
 * @date 2016. 8. 11. 오전 10:45:00
 * @version 1.0
 */
$a.page(function() {
	
	var dataGridId = "dataGrid";
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	setEventListener();//이벤트 리스너 등록
    	initSelectCode();//Select(콤보박스) 초기화
    };
    
    
    //이벤트 리스너 등록
    function setEventListener() {
    	
    	//설비종류 Change Event Listener 등록
    	$('#lesKndCd').on('change', function(e) {
    		lesKndCdChangeEventHandler(e);
		});
    	
    	//조회 버튼 Click Event Listener 등록
    	$('#btnSearch').on('click', function(e) {
    		btnSearchClickEventHandler(e);
		});
    	
    	//요금테이블목록 팝업 버튼 Click Event Listener 등록
    	$('#btnSelectExcel').on('click', function(e) {
    		btnSelectExcelClickEventHandler(e);
		});
    	
    	//요금테이블 추가 팝업 버튼 Click Event Listener 등록
    	$('#btnInsertExcel').on('click', function(e) {
    		btnInsertExcelClickEventHandler(e);
		});
    	
    	//Excel출력 버튼 Click Event Listener 등록
    	$('#btnDownloadExcel').on('click', function(e) {
    		btnDownloadExcelClickEventHandler(e);
		});
    	
	};
    
    //select에 Bind 할 Code 가져오기
    function initSelectCode() {

    	//설비종류
    	lesKndCd_data = [{depth:"0",upperCodeId:"*",codeId:"T1",codeName:"광중계기광코아"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T2",codeName:"기지국회선"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T4",codeName:"Wi-Fi"}];
    	$('#lesKndCd').clear();
    	$('#lesKndCd').setData({
    		data:lesKndCd_data,
    	});
    	$('#lesKndCd').trigger($.Event('change'));//dispatch 설비종류 change event
    	
    }
    
	/**
	 * serviceRequest
	 * 
	 * @param sType,sUrl,sData,sMethod
	 * @return void
	 */
    function serviceRequest(sType,sUrl,sData,sMethod)
    {
    	$('#'+dataGridId).alopexGrid('showProgress');
    	Tango.ajax({
			url : sUrl,
			data : sData,
			method : sMethod
		}).done(function(response){successCallback(response, sType, sData);})
		  .fail(function(response){failCallback(response, sType);})
		  .error();
    }
    
    function btnSearchClickEventHandler(event){
  		serviceRequest(	 'getFeeTableList'
					,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFeeTableList'
					,$("#searchForm").getData(),'GET');
    	
    }
    
	//request 성공시
    function successCallback(response, flag){
    	
    	$('#'+dataGridId).alopexGrid('hideProgress');
    	if(flag === 'getFeeTableList'){
    		$('#'+dataGridId).alopexGrid('dataSet', response);
    		
    	}else
    	if(flag === 'deleteIntgFctLst'){
    		alert("삭제되었습니다");
    		$('#'+dataGridId).alopexGrid('dataDelete',{_state: {selected:true}});
    	}
    	
    }
    
	//request 실패시.
    function failCallback(response, flag){
    	$('#'+dataGridId).alopexGrid('hideProgress');
    	if(flag === 'searchData'){
    		alert(response.__rsltMsg__);
    		
    	}else
    	if(flag === 'deleteIntgFctLst'){
    		alert(response.__rsltMsg__);
    		
    	}
    	
    }
    
    //설비종류 변경 시 처리
    var lesKndCd = {
    	T1 : function(){
    		//광중계기광코아 Grid
    			$('#'+dataGridId).alopexGrid({
    				extend : ['defineOptDataGrid']
    			});
    	},
    	T2 : function(){
    		//기지국회선 Grid
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineBtsDataGrid']
            });
    	},
    	T4 : function(){
    		//Wi-Fi Grid
    		$('#btnInsertExcel').show();
    		$('#bntDeleteRow').show();
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineWifiDataGrid']
            });
    	}
    };
    
    //설비종류 Change Event Listener
    function lesKndCdChangeEventHandler(event){
    	
    	lesKndCd[$('#lesKndCd').val()]();
    	$('#'+dataGridId).alopexGrid('dataEmpty');
    }
    
	/**
	 * feeTableDetailPopup
	 * 
	 * @param sPopId, sGrid, sTitle, sUrl, sData, dWidth, dHeight
	 * @return void
	 */
    function feeTableDetailPopup(sPopId, sGrid, sTitle, sUrl, sData, dWidth, dHeight){
    	
        $a.popup({
        	popid: sPopId,
        	title: sTitle,
            url: sUrl, 
            data : sData,
			modal: true,
			center: true,
			width : dWidth,
			height : dHeight,
			
            callback: function() {
          		serviceRequest(	 'getFeeTableList'
    					,'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/getFeeTableList', $("#searchForm").getData(),'GET');
           	}
        });    	
    	
    }
    
    //요금테이블 목록 팝업 버튼 Click Event 처리
	function btnSelectExcelClickEventHandler(event){
		
		
	}
	
	//요금테이블 추가 버튼 Click Event 처리
	function btnInsertExcelClickEventHandler(event){
		
		var pId = "createFeeTableList";
		
		feeTableDetailPopup(pId, dataGrId, '요금테이블 추가', pId, $('#searchForm').getData(), 800, 500);
	}
	
	
    function getFormatString(num){
    	if(num < 10){
    		return "0"+num;
    	}else{
    		return num;
    	}
    }
    
	//Excel Download 실행
	function btnDownloadExcelClickEventHandler(event){

		dt = new Date();
		
		excelName = "ExcelExport__";
		
		excelName += dt.getFullYear();
		excelName += getFormatString(dt.getMonth() + 1);
		excelName += getFormatString(dt.getDate());
		excelName += getFormatString(dt.getHours());
		excelName += getFormatString(dt.getMinutes());
		excelName += getFormatString(dt.getSeconds());
		
		var worker = new ExcelWorker({
    		excelFileName: excelName,
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: 'ExcelExport',
    			$grid: $('#'+dataGridId)
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
	}
});