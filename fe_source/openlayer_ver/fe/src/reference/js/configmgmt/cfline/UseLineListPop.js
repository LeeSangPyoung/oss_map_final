$a.page(function() {
    
	var paramData =null;
	var ntwkType = null; 
	var gridUseLine = 'listGrid';
	
    this.init = function(id, param) {
    	paramData = param;    	
    	
//    	var param = { "ntwkLineNo": ntwkLineNo
//				, "svlnNo": svlnNo
//				, "topoLclCd": topoLclCd
//				, "topoSclCd": topoSclCd
//				, "serviceLineYn":serviceLineYn
//				, "eqpId" : eqpId
//				, "portId" : dataObj.portId 
//			};
//    	
        
		initGrid();
        setEventListener();
        
        cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/portInf/getportuselist', param, 'POST', 'portUseList');
    };
    
  //Grid 초기화
    function initGrid() {
    	var column = [
	               		  {key : 'lclCd', align:'center', width:'80px', title : cflineMsgArray['type']/*'유형'*/}
	               		, {key : 'lineNm', align:'left', width:'190px', title : cflineMsgArray['lnNm']}
	               		, {key : 'mgmtGrpNm', align:'center', width:'65px', title : cflineMsgArray['managementGroup'] }
	               		, {key : 'lineState', align:'center', width:'65px', title :cflineMsgArray['lineStatus']}
	               		, {key : 'lineNo', align:'center', width:'100px', title : cflineMsgArray['lineNo']}
	               		, {key : 'sclCd', align:'left', width:'110px', title :cflineMsgArray['etc']
	               			, render : function(value, data){ return cflineMsgArray['line'] + cflineMsgArray['type'] + ' : ' + data['sclCd'];}
	               		}
	               		, {key : 'mgmtGrpCd', align:'center', title :'관리그룹코드', hidden : true}
		];
    	
    	
        //그리드 생성
        $('#'+ gridUseLine).alopexGrid({
        	pager : false,
        	columnMapping : column,
        	cellSelectable : false,
            rowClickSelect : false,
            rowInlineEdit : false,
            rowSingleSelect : false,
            numberingColumnFromZero : false,
            height : 450
        });
    };
    
    function setEventListener() {
    	// 엑셀 버튼 
    	$('#btnExcelPop').on('click', function(e) {
    		 var worker = new ExcelWorker({
    			excelFileName : cflineMsgArray['acceptLine'],
         		palette : [{
         			className : 'B_YELLOW',
         			backgroundColor: '255,255,0'
         		},{
         			className : 'F_RED',
         			color: '#FF0000'
         		}],
         		sheetList: [{
         			sheetName: cflineMsgArray['acceptLine'],
         			$grid: $('#'+gridUseLine)
         		}]
         	});
         	worker.export({
         		merge: true,
         		exportHidden: false,
         		filtered  : false,
         		useGridColumnWidth : true,
         		border  : true
         	});
         });
    	
    	// 닫기
    	$('#btnPopClose').on('click', function(e) {
    		 $a.close();
        });
    	
	};
	
    var httpRequest = function(Url, Param, Method, Flag ) {
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
		if(flag == "portUseList"){
			if(response != null && response.length > 0){
				var span = "포트를 사용하는 " + response.length + "건의 회선이 있습니다.";
	        	document.getElementById("titleGroupPop").innerHTML = span;
        		$('#'+gridUseLine).alopexGrid('dataSet', response );
			}
		}
	}
	
    function failCallback(response, status,   flag){
    	cflineHideProgressBody();
    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    }
});