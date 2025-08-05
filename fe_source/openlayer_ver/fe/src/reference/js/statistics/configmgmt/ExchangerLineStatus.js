/**
 * ExchangeLineStatus.js
 *
 * @author Yang Jae
 * @date 2018.03.09
 * @version 1.0
 */
$a.page(function() {
	//그리드 ID
    var gridId = 'resultGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnExportExcel').setEnabled(false);
        initGrid();
        setSelectCode();
        setEventListener();
    };
  	//Grid 초기화
    function initGrid() {
    	
    	var mapping = [
    	               {
    	            	   key : 'bonbuNm',
    	            	   align: 'left',
    	            	   width: '80px',
    	            	   rowspan : true,
    	            	   title : exchangerLineStatusMsgArray['bizHead'],
    	            	   headerStyleclass : 'back_blue'
    	               }
    	               ,{
    	            	   key : 'teamNm',
    	            	   align : 'left',
    	            	   width : '75px',
    	            	   rowspan : true,
    	            	   title : exchangerLineStatusMsgArray['bizTeam'],
    	            	   headerStyleclass : 'back_blue',
	  	   					inlineStyle : {
		 	            		   background : function(value, data, mapping) {
		 	            			  if ( data.teamNm == '본부계') {
		 	            				  return 'lightblue';
		 	            			   }
		 	            		   }
		 	            	   }
    	               }
    	               ,{
    	            	   key : 'tmofNm',
    	            	   align : 'left',
    	            	   width : '105px',
    	            	   rowspan : true ,
    	            	   title : exchangerLineStatusMsgArray['bizToffice'],
    	            	   headerStyleclass : 'back_blue',
	  	   					inlineStyle : {
		 	            		   background : function(value, data, mapping) {
		 	            			  if ( data.teamNm == '본부계'  || data.tmofNm == '팀계') {
		 	            				 return 'lightblue';
		 	            			  }
		 	            		   }
		 	            	   }
    	               }
    	               ,{
    	            	   key : 'ttmofNm',
    	            	   align : 'left',
    	            	   width : '105px',
    	            	   title : exchangerLineStatusMsgArray['bizSwiOffice'],
    	            	   headerStyleclass : 'back_blue',
	   	   					inlineStyle : {
		 	            		   background : function(value, data, mapping) {
		 	            			  if ( data.teamNm == '본부계' || data.tmofNm == '팀계' || data.ttmofNm =='소계' || data.exchangerNm =='소계') {
		 	            				 return 'lightblue';
		 	            			   }
		 	            		   }
		 	            	   }
    	               }
    	               ,{
    	            	   key : 'exchangerNm',
    	            	   align : 'left',
    	            	   width : '80px',
    	            	   title : exchangerLineStatusMsgArray['swicherIncluding'],
    	            	   headerStyleclass : 'back_blue',
    	            	   hidden : true,
	  	   					inlineStyle : {
	 	            		   background : function(value, data, mapping) {
	 	            			  if ( data.exchangerNm == '소계'|| data.ttmofNm =='소계' || data.teamNm == '본부계' || data.tmofNm == '팀계') {
	 	            				 return 'lightblue';
	 	            			   }
	 	            		   }
	 	            	   }
  	   						
    	               }
    	               ,{
    	            	   key : 'sum',
    	            	   align : 'right',
    	            	   width : '50px',
    	            	   title : exchangerLineStatusMsgArray['sum'] ,
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'st',
    	            	   align : 'right',
    	            	   width : '45px',
    	            	   title : exchangerLineStatusMsgArray['st'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'mcinu',
    	            	   align : 'right',
    	            	   width : '50px',
    	            	   title : exchangerLineStatusMsgArray['mcinu'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'wcdma',
    	            	   align : 'right',
    	            	   width : '50px',
    	            	   title : exchangerLineStatusMsgArray['wcdma'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'etc',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['etc'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'cdma',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['cdma'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'crbt',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['crbt'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'flexedPhone',
    	            	   align : 'right',
    	            	   width : '70px',
    	            	   title : exchangerLineStatusMsgArray['flexedPhone'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'hlr',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['hlr'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'iwf',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['iwf'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'omd',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['omd'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'omp',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['omp'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'pager',
    	            	   align : 'right',
    	            	   width : '50px',
    	            	   title : exchangerLineStatusMsgArray['pager'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'stp',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['stp'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'sg',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['sg'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'cdma2001x',
    	            	   align : 'right',
    	            	   width : '80px',
    	            	   title : exchangerLineStatusMsgArray['cdma2001x'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               ,{
    	            	   key : 'smsc',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['smsc'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	               
    	               ,{
    	            	   key : 'tan',
    	            	   align : 'right',
    	            	   width : '40px',
    	            	   title : exchangerLineStatusMsgArray['tan'],
    	            	   render: {type:"string", rule : "comma"},
    	            	   headerStyleclass : 'back_blue',
    	            	   inlineStyle : {
    	            		   background : function(value, data, mapping) {
    	            			   if ( data.ttmofNm == '소계' || data.tmofNm == '팀계' || data.teamNm == '본부계' || data.exchangerNm == '소계') {
    	            				   return 'lightblue';
    	            			   }
    	            		   }
    	            	   }
    	               }
    	];
    	// 그룹 지정
    	var groupColumn = groupingColumnNetworkPath();
        //그리드 생성
        $('#'+gridId).alopexGrid({
            cellSelectable : true,
            fitTableWidth : true,
            columnMapping : mapping,
            grouping: groupColumn,            
            message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + confimgmtMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });        
    };
    
    function groupingColumnNetworkPath() {
    	var grouping = {
    			by : ['bonbuNm', 'teamNm', 'tmofNm'], 
    			useGrouping:true,
    			useGroupRowspan:true,
    			useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
    			useGroupRearrange : false 					// 그룹핑 대상 칼럼의 모든 데이터를 재정렬하여 셀 병합할지 여부
    	};
    	return grouping;
    }
    
      // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
      function setSelectCode() {
      	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ 'SKT', null, 'GET', 'Org'); // SKT의 전체 본부 검색
      	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ 'SKT', null, 'GET', 'team');// SKT의 전체 팀 검색
      }

      function setEventListener() {
      	//본부 선택시 이벤트
      	$('#org').on('change', function(e) {
      		var orgID =  $("#org").getData();
      		if(orgID.orgId == ''){
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ 'SKT', null, 'GET', 'team');// SKT의 전체 팀 검색
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ 'SKT', null, 'GET', 'tmof'); // SKT의 전체 전송실 검색
      		}else{
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
      		}
      	});

      	// 팀을 선택했을 경우
      	$('#team').on('change', function(e) {
      		var orgID =  $("#org").getData();
      		var teamID =  $("#team").getData();
      		if(orgID.orgId == '' && teamID.teamId == ''){
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ 'SKT', null, 'GET', 'tmof');
      		}else if(orgID.orgId == '' && teamID.teamId != ''){
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
      		}else if(orgID.orgId != '' && teamID.teamId == ''){
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
      		}else {
      			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
      		}
      	});

      	//조회
      	$('#btnSearch').on('click', function(e) {
      		
      		$('#btnExportExcel').setEnabled(true);
      		// 교환기포함 체크 여부.
      		var checkEx = $('#includeEx').is(':checked'); // true 와 false로 값 구분
      		var dataParam =  $("#searchForm").getData();
      		cflineShowProgressBody();
      		// 교환기 포함 유무
      		if ( checkEx != true ){
      			$('#'+gridId).alopexGrid("hideCol","exchangerNm");
          		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/exchangerLineStatus/exchangerLineStatusList', dataParam ,'GET','list');
      		} else if ( checkEx == true ) {
      			$('#'+gridId).alopexGrid("showCol","exchangerNm");
          		httpRequest('tango-transmission-biz/transmisson/statistics/configmgmt/exchangerLineStatus/exchangerLineStatusWithExList', dataParam ,'GET','listwith');
      		}
      	});
      	
      	// 엑셀 다운로드
        $('#btnExportExcel').on('click', function(e) {
        	cflineShowProgressBody();
        	excelDownload();
            });
      };
      
      // 현재 시간 구하기
      function getCurrDate() {
    		var now = new Date();
    		var date = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()); 
    		return date;
    	}
      
      //엑셀다운로드
      function excelDownload() {
  		var date = getCurrDate();
  		var worker = new ExcelWorker({
       		excelFileName : exchangerLineStatusMsgArray['title'] + "_" + date,
       		sheetList: [{
       			sheetName: exchangerLineStatusMsgArray['title'] + "_" + date,
       			placement: 'vertical',
       			$grid: $('#'+gridId)
       		}],
       		palette : [
       		{
       			className : 'back_blue', 
       			backgroundColor : '#003EFF',
       			color : '255,255,255',
       			fontbold : true
       		}]
       	});
  		worker.export({
       		merge: true,
       		exportHidden: false,
       		useGridColumnWidth : true,
       		border : true,
       		useCSSParser : true
       	});
  		cflineHideProgressBody();
      }

  	function successCallback(response, status, jqxhr, flag){
  		if (flag == 'list' ){
  			cflineHideProgressBody();
    		$('#'+gridId).alopexGrid("dataSet", response.list);
  		}
  		if (flag == 'listwith'){
  			cflineHideProgressBody();
    		$('#'+gridId).alopexGrid("dataSet", response.list);
  		}
  		//본부 콤보박스
  		if(flag == 'Org'){
  			$('#org').clear();
  	   		var option_data =  [];
  	   		if(response.length > 0){
  		    		for(var i=0; i<response.length; i++){
  		    			var resObj = response[i];
  		    			option_data.push(resObj);
  		    		}
  		    		$('#org').setData({
  						data:option_data
  					});
  	   		}
  	   	}

      	// 팀 콤보 박스
      	if(flag == 'team'){
      		$('#team').clear();
      		var option_data =  [];
      		for(var i=0; i<response.length; i++){
      			var resObj = response[i];
      			option_data.push(resObj);
      		}
      		$('#team').setData({
                   data:option_data
      		});
      		var orgID =  $("#org").getData();
      		var teamID =  $("#team").getData();
      		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
      	}

      	// 전송실 콤보 박스
      	if(flag == 'tmof'){
      		$('#tmof').clear();
      		var option_data = [{mtsoId: "",mgmtGrpCd: "",mtsoNm: confimgmtMsgArray['all'] }];      		
      		for(var i=0; i<response.length; i++){
      			var resObj = response[i];
      			option_data.push(resObj);
      		}
      		$('#tmof').setData({
                   data:option_data
      		});
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
      
  	//request 실패시.
      function failCallback(response, status, jqxhr, flag){
      	if(flag == 'search'){
      		//조회 실패 하였습니다.
      		callMsgBox('','I', exchangerLineStatusMsgArray['abnormallyProcessed'] , function(msgId, msgRst){});
      	}
      }
      

});