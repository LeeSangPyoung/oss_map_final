/**
 * DBUploadCurrentState.js
 * DB업로드현황
 *
 * @author 임상우
 * @date 2016. 6. 23. 오전 10:10:00
 * @version 1.0
 */
$a.page(function() {
	
	var dataGridId = 'dataGrid';
	var branch_office_data = [];
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	initSelectCode();//Select(콤보박스) 초기화
    	setEventListener();
    };
    
    //Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+dataGridId).alopexGrid({
        	extend : ['defineDataGrid']
        });
    };
    
  //select에 Bind 할 Code 가져오기
    function initSelectCode() {

    	//한전본부 & 한전지사 조회
    	searchCode('kepcoOffice');
    	
    	//과금청구월 조회
    	searchCode('chargingMonth');
    }
    
    //select에 Bind 할 Code 가져오기
    function searchCode(codeName) {
    	Tango.ajax({url : 'tango-transmission-biz/leasemgmt/common/codes/' + codeName, 
			data : null,
			method : 'GET'})
			.done(function(response){searchCodeSuccessCallback(response, codeName);})
			.fail(function(response){searchCodeFailCallback(response, codeName);});
    }
    
    function searchCodeSuccessCallback(response, flag){
    	
    	if(flag == 'kepcoOffice'){
    		
    		var option_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    		$('#kephdCd').clear();
    		$('#kepboCd').clear();
    		$('#kepboCd').setData({
	             data:option_data,
	             option_selected:''
    		});
    		$('#divKepboCd').setEnabled (false);
    		
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			if(resObj.depth == 0){
    				option_data.push(resObj);
    			}else{
    				branch_office_data.push(resObj);
    			}
    		}

    		$('#kephdCd').setData({
	             data:option_data,
	             option_selected:''
    		});
    		
    		$('#kephdCd').on('change', function(e) {
    			setBranchOfficeData($('#kephdCd').val());
    		});
    	}
    	
    	if(flag == 'chargingMonth'){
    		$('#chrDmdYm').clear();
    		$('#chrDmdYm').setData({
	             data:response
    		});
    	}
    }
    
    function searchCodeFailCallback(response, flag){
    	//Exception처리
    }
    
    function setBranchOfficeData(val){
    	
    	var option_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    	
    	$('#kepboCd').clear();
    	$('#divKepboCd').setEnabled (false);
    	
    	if(val != ''){
    		for(var i=0; i<branch_office_data.length; i++){
    			var obj = branch_office_data[i];
    			if(obj.upperCodeId == val){
    				option_data.push(obj);
    			}
    		}
    		$('#divKepboCd').setEnabled (true);
    	}
    	
    	$('#kepboCd').setData({
            data:option_data
		});
    }

    function setEventListener() {
        // 검색
        $('#btnSearch').on('click', function(e) {
        	$('#'+dataGridId).alopexGrid('showProgress');
        	
        	var transaction = Tango.ajax.init({
        		url : 'tango-transmission-biz/leasemgmt/kepco/kepcodataupload/dbUploadCurrentStateList', 
    			data : $("#searchForm").getData(),
    			flag : 'searchData'});
        	  
        	transaction.get().done(successCallback).fail(failCallback);
        	
//        	Tango.ajax({url : 'tango-transmission-biz/leasemgmt/kepco/kepcodataupload/dbUploadCurrentStateList', 
//    			data : $("#searchForm").getData(),
//    			method : 'GET'})
//    			.done(function(response){successCallback(response, 'searchData');})
//    			.fail(function(response){failCallback(response, 'searchData');});
        });
        
        //엑셀다운로드
        $('#btnExportExcel').click(function(){
        	var worker = new ExcelWorker({
        		excelFileName: 'DB작업 진행현황',
        		palette : [{
        			className: 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className: 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: 'DB작업 진행현황',
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
        });
        
	};
	
	 //request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag === 'searchData'){
    		$('#'+dataGridId).alopexGrid('hideProgress');
    		$('#'+dataGridId).alopexGrid('dataSet', response);
    	}
    }
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag === 'searchData'){
    		alert(response.__rsltMsg__);
    		$('#'+dataGridId).alopexGrid('hideProgress');
    	}
    }
});