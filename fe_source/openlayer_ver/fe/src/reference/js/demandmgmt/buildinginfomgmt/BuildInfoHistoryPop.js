/**
 * BuildInfoList
 *
 * @author P095781
 * @date 2016. 7. 26. 오후 4:04:03
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    var gridHistoryId = 'resultPopHistorySearchGrid';    
    var formId = 'popHistoryForm';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	console.log(id,param);
    	
    	initHistoryGrid();
    	setEventListener(param);
    };	
    
    function initHistoryGrid(){
    	var mapping = [
              
    	   {
    		   key : "fdaisSrno",
    		   align : "center",
    		   width : "150px",
    		   title : "순번"
    	   }, {
    		   key : "lastChgDate",
    		   aling : "center",
    		   width : "300px",
    		   title : "수정일시"
    	   }, {
    		   key : "lastChgUserId",
    		   aling : "center",
    		   width : "300px",
    		   title : "수정자"
    	   }           
                   
    	];
    	
    	$('#'+gridHistoryId).alopexGrid({
    		height : 200,
        	width : 900,
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : true,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping,
            pager : false,
            message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
    	
    	$('#'+gridHistoryId).on('click', function(e) {
    		var object = AlopexGrid.parseEvent(e);
        	var data = object.data;
        	console.log(data);

        	var getDataMap = $('#'+formId).getData();
        	console.log(getDataMap);
        	
        	$.each(getDataMap, function(key, value) {
        		var getKey = key;
        		getDataMap[getKey] = "";
        		
        		$.each(data, function(key, value) {
        			if(getKey == key) {
        				getDataMap[getKey] = data[key];
        			}
        		});
        	});
        	console.log(getDataMap);
        	
        	$('#'+formId).setData(getDataMap);
        });
    }

    
    function setEventListener(param){
    	var dataParam = {
				fdaisNo : param.fdaisNo
		};
		
		bodyProgress();
    	
    	searchHistoryRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/historylist', dataParam, 'GET', 'historylist');  	
    }
    
    function searchHistoryRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successSearchHistoryCallback(response, sflag);})
    	  .fail(function(response){failSearchHistoryCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successSearchHistoryCallback(response, flag){
    	bodyProgressRemove();
    	
    	if(flag == 'historylist'){    		
    		console.log(response);
    		$('#'+gridHistoryId).alopexGrid("dataSet", response.list);
    		
    	}
    }
    
    //request 실패시.
    function failSearchHistoryCallback(serviceId, response, flag){
    	bodyProgressRemove();
    	console.log(response);
    	alertBox('W',buildingInfoMsgArray['abnormallyProcessed']);
    }   
});