var microWaveEqpYn = "N";
$a.page(function() { 
	//처음에 화면 가져올때 리스트와 필요한 정보들을 셋팅
	var params = "";
	this.init = function(id, param) {
		params = param;
		microWaveEqpYn = param.microWaveEqpYn;
		if (microWaveEqpYn == "Y") {
			$("#coupler").hide();
			$("#microWave").show();
			$('#ringCouplerTitle').text("채널");
		}
		var column = [
		              	{ key : 'check', selectorColumn : true, width : '40px' }
		              	, { key : 'wavlVal', title : '파장', align : 'center', width : '75px' , hidden : (microWaveEqpYn == "Y" ? true : false)}
		              	, { key : 'drcVal', title : '방향', align : 'center', width : '75px' , hidden : (microWaveEqpYn == "Y" ? true : false)} 
		              	, { key : 'freqVal', title : '주파수', align : 'center', width : '75px', hidden : true }
	    	         	, { key : 'chnlVal', title : '채널', align : 'center', width : '75px', hidden : (microWaveEqpYn == "Y" ? false : true) }
		  				, { key : 'bdwthVal', title : '밴드', align : 'center', width : '75px', hidden : true }
		  				, { key : 'eqpMdlDtlSrno', title : '일련번호', align : 'center', hidden : true } 
	  			];
		
		$('#couplerList').alopexGrid({
    		fitTableWidth: true,
    		fillUndefinedKey : null,
    		numberingColumnFromZero: false,
    		alwaysShowHorizontalScrollBar : false, 	//하단 스크롤바
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함) 
    		useClassHovering : true,
    		autoResize: true,
//    		rowClickSelect : false,
    		rowSingleSelect : false,
    		height: 380,
    		columnMapping : column,
	    	message: {
	    		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>조회된 데이터가 없습니다</div>"
			}
    	});
    	
    	$('#couplerList').alopexGrid("updateOption", { fitTableWidth: true });
    	
    	
    	// 닫기
		$('#btnClosePop').on('click', function(e) {
			$a.close();
		});

		// 선택
		$('#btnConfirmPop').on('click', function(e) {
			var dataObj = $('#couplerList').alopexGrid("dataGet", {_state : { selected : true }});
			dataObj = AlopexGrid.trimData(dataObj);
			if(dataObj.length < 1) {
				alertBox('W', '선택된 데이터가 없습니다.');
				return;
			}
			$a.close(dataObj);
		});
		
		// 조회
		$('#btnSearchPop').on('click', function(e) {
			$.extend(params,{"wavlVal": $("#wavlVal").val()}); // , "freqVal" : $("#freqVal").val()
			$.extend(params,{"drcVal": $("#drcVal").val()});
			
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/selectCouplerList', params, 'POST', 'search');
		});
		
		// 엔터이벤트
		$('#searchDiv').on('keydown', function(e) {
			if (e.which == 13) {
				$('#btnSearchPop').click();
				return false;
			}
		});
    	
		cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/ring/selectCouplerList', params, 'POST', 'search');
    };
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    
    function successCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
    	if(flag == 'search') {
    		if(response.couplerList != undefined) {
    			$('#couplerList').alopexGrid('dataSet', response.couplerList);
    		}
    		
    		if (microWaveEqpYn == "Y") {
        		//$('#couplerList').alopexGrid("updateOption", { rowSelectOption: {radioColumn : true, singleSelect : true} });
    		}
    	}
    }
    
    function failCallback(status, jqxhr, flag){
    	cflineHideProgressBody();
//    	alertBox('W', cflineMsgArray['searchFail']);  /* 조회 실패 하였습니다. */
    }
});