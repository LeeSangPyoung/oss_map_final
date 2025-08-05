/**
 * 
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var paramData =null;
	var ntwkType = null; 
	var gridUseLine = 'resultListGrid';
	
    this.init = function(id, param) {
    	paramData = param;    	
        var topoLclCd = nullToEmpty(paramData.topoLclCd);
		var topoSclCd = nullToEmpty(paramData.topoSclCd);
		
		if (nullToEmpty(paramData.title) != "" && (topoLclCd == "003" || topoLclCd == "001" || topoLclCd == "002")) {
			document.title= paramData.title;
			$('#detailPopTitle').text(paramData.title);
		} else {
			document.title= cflineMsgArray['trmn'];
			$('#detailPopTitle').text(cflineMsgArray['trmn']);
		}
		
		if(topoLclCd == "001"){
			ntwkType = "링";
		}
		else if(topoLclCd == "002"){
			ntwkType = "트렁크회선";
		}
		else if(topoLclCd == "003" && topoSclCd == "101"){
			ntwkType = "WDM트렁크";
		}
		else if(topoLclCd == "003" && topoSclCd == "102"){
			ntwkType = "기간망트렁크";
		} 
		// 서비스회선에서 호출시 서비스회선 수용목록 체크
		else if(nullToEmpty(paramData.callType) == "UL") {
			param.lineType = "S";
			paramData.lineType = "S";
			ntwkType = "서비스회선";
		}
		
		initGrid();
        setEventListener();
        
        cflineShowProgressBody();
        //console.log(param);
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getlineuselist', param, 'POST', 'lineUseList');
    };
    
  //Grid 초기화
    function initGrid() {
    	var column = [
    	              	  {key : 'ntwkLineNo', align:'center', width:'100px', title : "", hidden : true}
	               		, {key : 'ntwkLineNm', align:'left', width:'150px', title : ntwkType, rowspan:{by:'ntwkLineNo'}, inlineStyle: {'white-space' : 'pre-line'} }
	               		, {key : 'topoLclCd', align:'center', width:'80px', title : cflineMsgArray['type']/*'유형'*/}
	               		, {key : 'manuPath', align:'left', width:'100px', title : cflineMsgArray['menu']/*'메뉴'*/
	               			, value : function(value, data) {
	               				var val = "";
	               				
	               				if(nullToEmpty(data['cdFltrgVal']) == "S"){
	               					val = cflineMsgArray['serviceLine'] + cflineMsgArray['management'] + "->" + data['topoLclCd'] + "->";
	               				}
	               				else if(data['topoLclCd'] == "패킷트렁크"){
	               					val = cflineMsgArray['serviceLine'] + cflineMsgArray['management'] + "->";
	               					val += data['topoSclCd']+cflineMsgArray['line'] + "->";
	               				}
	               				else if(nullToEmpty(data['cdFltrgVal']) == "N") {
	               					val = data['topoSclCd'] + cflineMsgArray['management'] + "->";
	               				}
	               				
	               				val += data['topoSclCd'];
	               				return val;
	               			}
	               		}
	               		, {key : 'useLineNm', align:'left', width:'200px', title : cflineMsgArray['lnNm']}
	               		, {key : 'mgmtGrpCd', align:'center', width:'80px', title : cflineMsgArray['managementGroup']}
	               		, {key : 'ntwkStatCd', align:'center', width:'80px', title :cflineMsgArray['lineStatus']}
	               		, {key : 'useLineNo', align:'center', width:'100px', title : cflineMsgArray['lineNo']}
	               		, {key : 'topoSclCd', align:'left', width:'100px', title :cflineMsgArray['etc']
		               		, value : function(value, data) {
		               			return cflineMsgArray['line'] + cflineMsgArray['type'] + ' : ' + data['topoSclCd']; 
	               			}
	               		}
	               		, {key : 'scrbSrvcMgmtNo', align:'center', width:'100px', title :cflineMsgArray['subscriServiceNumber']/* '가입서비스번호'*/}
	               		, {key : 'srvcMgmtNo', align:'center', width:'100px', title :cflineMsgArray['serviceNumber']/* '서비스번호'*/}
	               		, {key : 'cdFltrgVal', align:'center', title :'구분', hidden : true}
		];
    	
    	
        //그리드 생성
        $('#'+ gridUseLine).alopexGrid({
        	pager : false,
        	columnMapping : column,
        	cellSelectable : false,
            rowClickSelect : false,
            rowInlineEdit : false,
            rowSingleSelect : false,
            grouping : {
    			by : ['ntwkLineNo'],
    			useGrouping:true,
    			useGroupRowspan:true,
    			useDragDropBetweenGroup:false,
    			useGroupRearrange : true
            },
            message: {
    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noInquiryData']+"</div>"
    		},
            numberingColumnFromZero : false,
            height : 450
        });
    };
    
    function setEventListener() {
    	// 엑셀 버튼 
    	$('#btnExcelPop').on('click', function(e) {
    		 var worker = new ExcelWorker({
    			excelFileName :  (nullToEmpty(paramData.callType) == "S" ? ntwkType + "_" + paramData.title : ntwkType + "_" + cflineMsgArray['trmn']),
         		palette : [{
         			className : 'B_YELLOW',
         			backgroundColor: '255,255,0'
         		},{
         			className : 'F_RED',
         			color: '#FF0000'
         		}],
         		sheetList: [{
         			sheetName: ntwkType + "_" + cflineMsgArray['trmn'],
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
		if(flag == "lineUseList"){
			if(response != null && response.length > 0){
				var span = "선택하신 ";
	        	span += ntwkType + "를(을) 사용하는 " + response.length + "건의 회선이 있습니다.";
	        	span += "<br>해당 메뉴에서 처리 후 해지하세요."; 

	        	if (nullToEmpty(paramData.callType) != "S") {
		        	document.getElementById("titleGroupPop").innerHTML = span;
	        	} 
        		$('#'+gridUseLine).alopexGrid('dataSet', response );
			} 
			
			if (nullToEmpty(paramData.callType) == "S") {
				if (response != null) {
					$("#totalCnt").text("총 : " + getNumberFormatDis(response.length) + "건");
				}
			}
		}
	}
	
    function failCallback(response, status,   flag){
    	cflineHideProgressBody();
    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    }
});