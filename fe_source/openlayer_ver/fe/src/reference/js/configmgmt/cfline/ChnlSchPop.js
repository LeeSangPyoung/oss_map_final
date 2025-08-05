/**
 * ChnlSchPop.js
 * MW PTP 채널수사용현황
 * 링관리 조회화면에서 호출함
 * @author p152611
 * @date 2019. 12. 17.
 * @version 1.0
 */
var initParam = null;
var gridChnlCnt = 0;   // 작업정보 그리드에서 가져온 채널수
var savedChnlCnt = 0;  // DB에 저장된 채널수
$a.page(function() {
	var C02511Data = [];  //사용구분 데이터
	
	this.init = function(id, param) {
		initParam = param;  //searchParam = {"ntwkLineNo":schNtwkLineNo, "gridChnlCnt":chnlCnt, "gridId":gridId, "mwFreqCdNm":mwFreqCdNm, "mwBdwhCdNm":mwBdwhCdNm, "avlChnlCnt":avlChnlCnt};
		gridChnlCnt = initParam.gridChnlCnt;
		setSelectCode();
		initGrid();
		setEventListener();
		cflineShowProgressBody();		
    };

    function setSelectCode() {
    	// 채널수 콤보 초기화(20 설정)
    	var selectChnl_data=[];
		for(k=0; k<21; k++){ 
			var list = {"value":k,"text":k};
			selectChnl_data.push(list);
		}		
		$('#selectChnlCnt').clear();
		$('#selectChnlCnt').setData({data : selectChnl_data});
		$('#selectChnlCnt').setSelected("0");
		
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02511', null, 'GET', 'C02511Data'); // 채널 사용구분
    }
    
	//Grid 초기화
    function initGrid() {
    	var column = [
                      { key : 'chnlSeq', title : cflineMsgArray['chnlSeq'], align : 'right', width : '30px', numberingColumn: true }
    	             ,{ key : 'chnlUseDivCd', title : cflineMsgArray['useDivision'], align : 'left', width : '160px',
    	            	    render : {
    		      	    		type : 'string',
    		      	    		rule : function(value, data) {
    		      	    			var render_data = [];
    		      	    			if(C02511Data.length > 1) {
    		      	    				return render_data = render_data.concat(C02511Data);
    		      	    			}else {
    		      	    				return render_data.concat({value : data.chnlUseDivCd, text : data.chnlUseDivCdNm });
    		      	    			} 
    		      	    		}
    		      	    	},
    		      	    	editable:{
    		      	    		type:"select", 
    		      	    		rule : function(value, data){
    		      	    			var render_data = [];
    		      	    			render_data = render_data.concat({value : '', text : cflineCommMsgArray['select'] /* 선택 */});
    		  	    				render_data = render_data.concat(C02511Data);
    		      	    			return render_data;
    		      	    		}, attr : {
    	  			 				style : "width: 150px;min-width:150px;padding: 2px 2px;"
    	  			 			}
    		      	    	},
    		  				editedValue : function(cell) {
    		  					return $(cell).find('select option').filter(':selected').val(); 
    		  				}
    		      	 }
    	             ,{ key : 'rmkCtt', title : cflineMsgArray['rentNote'], align : 'left', width : '150px', editable:{type:"text"} }
    	             ,  { key : 'frstRegDate', title : 'frstRegDate', align : 'right', width : '30px', hidden : true }
    	             ,  { key : 'frstRegUserId', title : 'frstRegUserId', align : 'right', width : '30px', hidden : true }
    	];
    	$('#chnlSchList').alopexGrid({
    		pager : false,
    		columnMapping : column,
        	cellSelectable : false,
            rowClickSelect : false,
            rowInlineEdit : false,
            rowSingleSelect : true,
            numberingColumnFromZero : false,
            height : 500
    	});
    	
    }
    
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, 
    		data : Param,
    		method : Method,
    		flag : Flag
    	}).done(successCallback)
    	.fail(failCallback);
    }

    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'getChnlUseStatList') {
    		cflineHideProgressBody();
    		var data = response.chnlList;
    		var dataYn = nullToEmpty(response.chnlList) == "" ? "N" : "Y";
            savedChnlCnt = response.chnlCnt;
    		
    		if(gridChnlCnt > 0){
    			if (dataYn == "N") {
    				for(var i = 0; i < gridChnlCnt; i++) {
        				var emptyData = {};
        				$('#chnlSchList').alopexGrid('dataAdd', emptyData);
        			} 				
    			} else {
        			$('#chnlSchList').alopexGrid('dataSet', data);  
    			}
    			$('#selectChnlCnt').setSelected(gridChnlCnt);
    		}
    		
    		if(initParam.gridId == "dataGridWork"){
				$('#chnlSchList').alopexGrid("startEdit");
			}else{
				$('#selectChnlCnt').attr('disabled', 'true');
				$('#btnSaveChnl').hide();
			}	
    	}
    	  	
    	if(flag == 'insertChnlUseStatList'){
    		cflineHideProgressBody();
    		// 부모창에 채널수 셋팅
    		if (nullToEmpty(opener) != "" &&  $('#dataGridWork' , opener.document) != undefined) {
    			opener.setChnlCnt($('#selectChnlCnt').val());
    		}
    		
    		callMsgBox('','I', cflineMsgArray['saveSuccess'], function(msgId, msgRst){
           		if (msgRst == 'Y') {
           			$a.close($('#selectChnlCnt').val());
           		}
    		});
  		
    	}
    	
    	if(flag == 'C02511Data'){
			for(var i=0; i<response.length; i++){
    			C02511Data.push({value : response[i].value, text :response[i].text});
    		}
			$('#mwFreqCdNm').val(initParam.mwFreqCdNm);
			$('#mwBdwhCdNm').val(initParam.mwBdwhCdNm);
			$('#avlChnlCnt').val(initParam.avlChnlCnt);
			
			// 채널사용현황정보 취득 (api등록)
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/getChnlUseStatList', initParam, 'GET', 'getChnlUseStatList');
    	}
  
    }
    
    function failCallback(status, jqxhr, flag){
    	if(flag == 'getChnlUseStatList'){
    		cflineHideProgressBody();		
    		alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    	}
    	if(flag == 'insertChnlUseStatList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		$('#chnlSchList').alopexGrid("startEdit");
    	}
    }
    
    function setEventListener() {
    	$('#btnCloseChnl').on('click', function(e){
    		$a.close();
	    });
    	//저장버튼
    	$('#btnSaveChnl').on('click', function(e){
    		callMsgBox('','C', cflineMsgArray['saveData'], function(msgId, msgRst){
           		if (msgRst == 'Y') {
		    		cflineShowProgressBody();
		    		$('#chnlSchList').alopexGrid("endEdit");
		    		var currval = $('#selectChnlCnt').val();
		        	var dataList = $('#chnlSchList').alopexGrid('dataGet');
		        	
		        	var chnlList = [];
		        	$.each(dataList, function(idx, obj){
		        		obj.chnlSeq = idx+1;
		        		obj.ntwkLineNo =initParam.ntwkLineNo;
		        		
		        		chnlList.push(obj);	
		        	});
		        	
		        	var insertParam = {
		        			  "chnlCnt" : currval
		        			, "ringList" : chnlList
		        			, "ntwkLineNo" : initParam.ntwkLineNo
		        	}	
		    		// 채널사용현황정보 저장 (api등록)
		    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/insertChnlUseStatList', insertParam, 'POST', 'insertChnlUseStatList');
           		}
    		});
	    });
    	
    	//selectbox(채널수) 이벤트
    	$('#selectChnlCnt').on('change', function(e){
    		var dataList = $('#chnlSchList').alopexGrid('dataGet');
    		var len = dataList.length;
    		var currval = $('#selectChnlCnt').val();   		
    		var diff = currval - gridChnlCnt;
    		
    		if (gridChnlCnt == $(this).val()) {  //diff == 0 
    			var diffval = len - gridChnlCnt;
    			if(diffval == 0) return;
    			else if(diffval > 0){  //삭제여부no한후 기존채널수 셋팅
    				for(var i = 0; i < diffval; i++) {
        				$('#chnlSchList').alopexGrid('dataDelete', {_index:{data : (len - i) - 1}});
        			}
    			} 
    		}
    		
    		if(diff > 0){
    			var diffval = len - currval;
    			if(diffval < 0){  //gridChnlCnt=5일때 5->8
    				var idx = currval - len;
    				for(var i = 0; i < idx; i++) {
        				var emptyData = {};
        				$('#chnlSchList').alopexGrid('dataAdd', emptyData);
        			}
    			}else{  //gridChnlCnt=5일때 8->6 
    				for(var i = 0; i < diffval; i++) {
        				$('#chnlSchList').alopexGrid('dataDelete', {_index:{data : (len - i) - 1}});
        			}
    			}
    		}  		
    		else if(diff < 0) {
    			var diffval = len - currval;
    			if(savedChnlCnt != 0 && savedChnlCnt != null){
    				// 삭제여부 질문 
        			var idx = savedChnlCnt - currval;
        			callMsgBox('','C', "기존 채널수보다 " + idx + "개 적습니다. 기존 채널을 삭제하시겠습니까?", function(msgId, msgRst){
    	           		if (msgRst == 'Y') {
    	        			for(var i = 0; i < diffval; i++) {
    	        				$('#chnlSchList').alopexGrid('dataDelete', {_index:{data : (len - i) - 1}});
    	        			}
    	    				savedChnlCnt = $(selectChnlCnt).val();
    	    				gridChnlCnt = $(selectChnlCnt).val();
    	           		} else {
    	           			$('#selectChnlCnt').setSelected(savedChnlCnt); // 기존 채널수 셋팅
    	           		}
    	    		});
    			}else{
    				for(var i = 0; i < diffval; i++) {
        				$('#chnlSchList').alopexGrid('dataDelete', {_index:{data : (len - i) - 1}});
        			}
    			}
    		}
    		$('#chnlSchList').alopexGrid("startEdit");
    	});     	
    }
    
});


