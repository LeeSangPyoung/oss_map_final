/**
 * OpenTaskReltLinePop
 *
 * @author Administrator
 * @date 2017. 8. 02.
 * @version 1.0
 */

var paramData = null;
var selectDataObj = null;
var reltLineGrid = "reltLineGrid";
var reltBizrGrid = "reltBizrGrid";
var chart = null;
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	
    this.init = function(id, param) {
		paramData = param;
		initReltGrid();
    	setSelectCode();
        setEventListener();  

    };
    

    //Grid 초기화
    function initReltGrid() {
    	
        //그리드 생성
        $('#' + reltLineGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false,  
//        	rowInlineEdit : true, //행전체 편집기능 활성화
			width : 560,
    		height : 400,	          
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [ 
				{key : 'svlnNo'					,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/ ,align:'center', width: '120px'}
				, {key : 'lineNm'					,title : cflineMsgArray['lnNm'] /*  회선명 */ ,align:'center', width: '300px'}
		        , {key : 'commBizrNm'	            ,title : cflineMsgArray['businessMan'] /* 사업자 */ ,align:'center', width: '100px'}                                                                                  
			]}); 
    	
        //그리드 생성
        $('#' + reltBizrGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: false,
    		cellSelectable : false,
    		rowClickSelect : false,
    		rowSingleSelect : false,
    		numberingColumnFromZero: false,  
//        	alwaysShowHorizontalScrollBar : false, //하단 스크롤바
//        	rowInlineEdit : true, //행전체 편집기능 활성화
			width : 560,
			height : 250,	          
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
			},
			columnMapping: [ 
				{key : 'commBizrNm'					,title : cflineMsgArray['businessMan'] /*  사업자 */ ,align:'center', width: '380px'}
		        , {key : 'totalCnt'	            ,title : cflineMsgArray['quty'] /* 수량 */ ,align:'center', width: '140px'}                                                                             
			]}); 


      
    };    

    
    function setSelectCode() {
    	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentaskreltlineinfo', paramData, 'GET', 'reltLineInfo');
    }
    
    function setEventListener() { //	 	// 엔터 이벤트 
     	
     	
    	// 탭 선택 이벤트
   	 	$("#basicPopTabs").on("tabchange", function(e, index) {
   	 		if(index == 0) {
   	 			$('#'+reltLineGrid).alopexGrid("viewUpdate");	
   	 		} else if(index == 1) {
   	 			$('#'+reltBizrGrid).alopexGrid("viewUpdate");
   	 		}
   	 	});     		
   	 	
    	//닫기
   	 	$('#btnPopClose').on('click', function(e) {
   	 		$a.close(null);
        });  
	};
	//초기 조회 성공시  
    function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'reltLineInfo'){
    		cflineHideProgressBody();
    		$('#'+reltLineGrid).alopexGrid("dataSet", response.reltLineNmList);
    		$('#'+reltBizrGrid).alopexGrid("dataSet", response.reltBizrNmList);

    		if(response.reltBizrNmList != null && response.reltBizrNmList.length>0){
    			var arr = [];
    			var arrArr = [];
    			for(i=0; i<response.reltBizrNmList.length; i++){
    				arrArr = [response.reltBizrNmList[i].commBizrNm, response.reltBizrNmList[i].totalCnt];
    				arr.push(arrArr);
    			}
    			createChart(arr);
    		}
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'reltLineInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
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
    

	var createChart = function(chartData) {
		chart = new Highcharts.Chart('reltBizrChart', {
			chart: {
				type: 'pie'
				},
			colors: ['#f7a35c', '#3363bb', '#90ed7d', '#f15c80'],		// color 4
			credits: {enabled: false},
			title: {text: null},
//			subtitle: {text: null},
			tooltip: {
				pointFormat: '<span style="color: {point.color}">\u25CF</span> 수량: <b>{point.y}건</b><br/><span style="color: {point.color}">\u25CF</span>  {series.name}: <b>{point.percentage:.2f}%</b>'
			},
			series: [{
				type:'pie',
				name: '비율',
				data:chartData

			}],
		});
//		$('.highcharts-button').attr('style', 'cursor: pointer;');
	}    
  
});