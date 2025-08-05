/**
 * NetworkPathAcceptList.js
 * 자동수집선번 팝업
 * @author 
 * @date 2017. 3. 7. 
 * @version 1.0
 */

var networkPathAcceptGrid = "networkPathAcceptGrid";
 
$a.page(function() {
	this.init = function(id, param) {
		var ntwkLineNo = param.ntwkLineNo;
		var ntwkLnoGrpSrno = param.ntwkLnoGrpSrno;
		
		initGrid();
		$('#'+networkPathAcceptGrid).alopexGrid('dataSet', param.acceptList);
		
		// 자동 엑셀 다운로드
		excelDownload();
		
		// 버튼 클릭시 엑셀 다운로드
		$('#btnExportExcel').on('click', function(e){
			excelDownload();
		});
		
		// 닫기
		$('#btnClose').on('click', function(e) {
   	 		$a.close();
        });    	
		
		$('#'+networkPathAcceptGrid).on('dblclick', '.bodycell', function(e){
			var urlPath = $('#ctx').val();
			if(nullToEmpty(urlPath) ==""){
				urlPath = "/tango-transmission-web";
			}
			// 링, 트렁크, 서비스회선 구분을 가져와서 오픈하는 팝업 바꿀것
			var focusData = AlopexGrid.currentData($('#'+networkPathAcceptGrid).alopexGrid("dataGet", {_state : {focused : true}})[0]);
			var paramData = {};
			var popId = "";
			var title = "";
			var infoPopUrl = "";
			
			if(focusData.linePathYn == 'Y') {
				// 서비스 회선
				paramData = {"ntwkLineNo":focusData.ntwkLineNo
							 , "ntwkLnoGrpSrno": focusData.ntwkLnoGrpSrno
							 , "svlnLclCd":focusData.topoLclCd
							 , "svlnSclCd":focusData.topoSclCd
							};
				popId = "ServiceLIneInfoPopAccept";
				title = "서비스회선상세정보";
				infoPopUrl = urlPath +'/configmgmt/cfline/ServiceLineInfoPop.do';
			} else {
				paramData = {"ntwkLineNo":focusData.ntwkLineNo
							 , "ntwkLnoGrpSrno": focusData.ntwkLnoGrpSrno
							 , "topoLclCd":focusData.topoLclCd
							 , "topoSclCd":focusData.topoSclCd
							};
				if(focusData.topoLclCd == "001") {
					// 링
					popId = "RingInfoPopAccept";
					title = "링 선번조회";
					infoPopUrl = urlPath +'/configmgmt/cfline/RingInfoPop.do';
				} else if(focusData.topoLclCd == "002") {
					// 트렁크
					popId = "TrunkInfoPopAccept";
					title = "트렁크상세정보";
					infoPopUrl = urlPath +'/configmgmt/cfline/TrunkInfoPop.do';
				}
			}
			
			$.extend(paramData,{"sFlag": "Y"});
			$.extend(paramData,{"gridId": "dataGridWork"});
			
			$a.popup({
			  	popid: popId,
			  	title: title,
			  	url: infoPopUrl,
			  	data: paramData,
			  	iframe: true,
				modal : false,
				movable:true,
				windowpopup : true,
				width : 1400,
				height : 780
				,callback:function(data){
					// 그리드 재조회
					cflineShowProgressBody();
					var params = {"ntwkLineNo" : ntwkLineNo, "ntwkLnoGrpSrno" : ntwkLnoGrpSrno};
					httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/networkPath/selectAcceptPathList', params, 'GET', 'selectAcceptPathList');
				}
			});
		});
	}
	
	//Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+networkPathAcceptGrid).alopexGrid({
        	autoColumnIndex: true,
    		autoResize: true,
    		preventScrollPropagation: true,			//그리드 스크롤만 동작(브라우저 스크롤 동작 안함)
    		cellSelectable : false,
    		rowClickSelect : true,
    		rowSingleSelect : true,
    		numberingColumnFromZero: false,
    		fitTableWidth: true,
    		hiddenColumnArea : false,
    		defaultColumnMapping:{
    			sorting: false
			},
			columnMapping: columnMapping()
        }); 
    };
    
    function columnMapping() {
    	var mapping = [
    	               	// 회선번호(네트워크 번호), 회선명, 유형(TOPO_LCL_CD, TOPO_SCL_CD)
			    	    { key : 'ntwkLineNo', title : '수용회선ID', align : 'center', width : '70px' },
			    	    { key : 'ntwkLineNm', title : '회선(네트워크)명', align : 'center', width : '140px' },
			    	    { key : 'topoLclNm', title : '대분류', align : 'center', width : '60px' },
			    	    { key : 'topoSclNm', title : '소분류', align : 'center', width : '60px' },
			    	    { key : 'lastChgDate', title : '최종수정일시', align : 'center', width : '80px' },
			    	    { key : 'lastChgUserId', title : '최종수정자', align : 'center', width : '50px' },
			    	    { key : 'ntwkLnoGrpSrno', title : 'ntwkLnoGrpSrno', align : 'center', width : '80px', hidden : true },
			    	    { key : 'topoSclCd', title : 'topoSclCd', align : 'center', width : '60px', hidden : true },
			    	    { key : 'topoLclCd', title : 'topoLclCd', align : 'center', width : '60px', hidden : true },
			    	    { key : 'linePathYn', title : 'linePathYn', align : 'center', width : '60px', hidden : true }
			    	];
    	
    	return mapping;
    }
    
    var httpRequest = function(Url, Param, Method, Flag) {
    	Tango.ajax({
    		url : Url,			//URL 기존 처럼 사용하시면 됩니다.
    		data : Param,		//data가 존재할 경우 주입
    		method : Method,	//HTTP Method
    		flag : Flag
    	}).done(successCallback)
    	  .fail(failCallback);
    }

    function successCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
    	if(flag == "selectAcceptPathList") {
    		$('#'+networkPathAcceptGrid).alopexGrid('dataSet', response.data);
    	}
    }
    
    function failCallback(response, status, jqxhr, flag) {
    	
    }
    
    function excelDownload() {
    	// 엑셀 다운로드
		var date = getCurrDate();
		var worker = new ExcelWorker({
     		excelFileName : '수용회선',
     		sheetList: [{
     			sheetName: '수용회선',
     			placement: 'vertical',
     			$grid: $('#'+networkPathAcceptGrid)
     		}]
     	});
		
		worker.export({
     		merge: false,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
    }
});