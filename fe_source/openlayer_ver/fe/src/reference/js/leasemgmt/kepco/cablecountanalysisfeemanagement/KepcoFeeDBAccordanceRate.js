/**
 * KepcoFeeDBAccordanceRate.js
 *
 * @author 
 * @date 2016. 7. 05. 오전 17:10:00
 * @version 1.0
 */
$a.page(function() {
	
	var sktGridId = 'sktDataGrid';
	var skbGridId = 'skbDataGrid';
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    	selectRemove();
     	 
    	$("#cableCountSummaryDate").attr("disabled",true);
    	//$("#cableCountSummaryDate").val("adsadasdasdasdadad");
    };
    function selectRemove(){
    	//$("#kepcoBoCd option[value='전체']").remove();
    	//$("#kepcbCd option[value='전체']").remove();
    	
    }
    //Grid 초기화
    function initGrid() {
    	    	
    	//그리드 생성
        $('#'+sktGridId).alopexGrid({
        	extend : ['defineSktDataGrid']
        });
        
        //그리드 생성
        $('#'+skbGridId).alopexGrid({
        	extend : ['defineSkbDataGrid']
        });
        
        showGridByCompany();
    };
    
    function showGridByCompany(){
    	var skAfcoDivCd = $('#skAfcoDivCd').val();
		
		if(skAfcoDivCd === 'T'){
			$('#skbDataGridDiv').hide();
			$('#skbDataGridDiv').clear();
			$('#sktDataGridDiv').show();
		}
		
		if(skAfcoDivCd === 'B'){
			$('#sktDataGridDiv').hide();
			$('#sktDataGridDiv').clear();
			$('#skbDataGridDiv').show();
		}
    }

    function tangoRequest(surl,sdata,smethod,sflag)
    {
    	var transaction = Tango.ajax.init({
      		url : surl, 
  			data : sdata,
  			flag : sflag});
    	
    		switch(smethod){
    		case 'GET' : transaction.get().done(successCallback).fail(failCallback);
    			break;
    		case 'POST' : transaction.post().done(successCallback).fail(failCallback);
    			break;
    		case 'PUT' : transaction.put().done(successCallback).fail(failCallback);
    			break;
    		
    		}
		  //.error();
    }
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {  
    	//httpRequest('tango-transmission-biz/leasemgmt/common/codes/kepcoOffice', null, successCallback, failCallback, 'GET', 'kepcoOffice');
    	//httpRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonth', null, successCallback, failCallback, 'GET', 'chargingMonth');
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/kepcoOffice',null,'GET','kepcoOffice');
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonth',null,'GET','chargingMonth');
    } 
    
    var branch_office_data = [];
    
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag === 'kepcoOffice'){
    		
    		var option_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    		$('#kepcoBoCd').clear();
    		$('#kepcbCd').clear();
    		$('#kepcbCd').setData({
	             data:option_data,
	             option_selected:''
    		});
    		$('#divKepcbCd').setEnabled (false);
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			if(resObj.depth == 0){
    				option_data.push(resObj);
    			}else{
    				branch_office_data.push(resObj);
    			}
    		}
    		option_data.splice(0,1);
    		$('#kepcoBoCd').setData({
	             data:option_data,
	             option_selected:''
    		});
    		setBranchOfficeData($('#kepcoBoCd').getValues()[0]);
    		$('#kepcoBoCd').on('change', function(e) {
    			setBranchOfficeData($('#kepcoBoCd').getValues()[0]);
    		});
    	}
    	if(flag === 'feeDBAccordanceRateSummarization'){
    		var skAfcoDivCd = $('#skAfcoDivCd').val();
    		if(skAfcoDivCd === 'T')    			
    			$('#'+sktGridId).alopexGrid('hideProgress');
    		else
    			$('#'+skbGridId).alopexGrid('hideProgress');    			
    		alert(response.feeDBAccordanceRateSummarization);
    	}
    	if(flag === 'chargingMonth'){
    		$('#chrDmdYm').clear();
    		$('#chrDmdYm').setData({
	             data:response
    		});
    		$('#chrDmdYm').trigger($.Event('change'));
    	}
    	
    	if(flag === 'gisCableCountSummaryDate'){    		
    		$('#cableCountSummaryDate').clear();
    		$('#cableCountSummaryDate').val(response.gisCableCountSummaryDate);
    	}
    	
    	if(flag === 'searchData'){
    		var skAfcoDivCd = $('#skAfcoDivCd').val();
    		
    		if(skAfcoDivCd === 'T'){    			
    			$('#'+sktGridId).alopexGrid('hideProgress');
    			$('#'+sktGridId).alopexGrid('dataSet', response);
    		}
    		
    		if(skAfcoDivCd === 'B'){
    			$('#'+skbGridId).alopexGrid('hideProgress');
    			$('#'+skbGridId).alopexGrid('dataSet', response);
    		}
    		
    		
    		
    		
    	}
    }
    
    function setBranchOfficeData(val){
    	
    	var option_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    	
    	$('#kepcbCd').clear();
    	$('#divKepcbCd').setEnabled (false);
    	
    	if(val != ''){
    		for(var i=0; i<branch_office_data.length; i++){
    			var obj = branch_office_data[i];
    			if(obj.upperCodeId == val){
    				option_data.push(obj);
    			}
    		}
    		$('#divKepcbCd').setEnabled (true);
    	}
    	
    	option_data.splice(0,1);
    	$('#kepcbCd').setData({
            data:option_data
		});
    }

    function setEventListener() {
        // 검색
        $('#btnSearch').on('click', function(e) {
        	showGridByCompany();
        	if($('#skAfcoDivCd').val() == 'T')        		
        		$('#'+sktGridId).alopexGrid('showProgress');        	
        	else        		
        		$('#'+skbGridId).alopexGrid('showProgress');        	
        	var param =  $("#searchForm").getData();
        	//httpRequest('tango-transmission-biz/leasemgmt/kepco/cablecountanalysisfeemanagement/KepcoFeeDBAccordanceRateList', param, successCallback, failCallback, 'GET', 'searchData');
        	tangoRequest('tango-transmission-biz/leasemgmt/kepco/cablecountanalysisfeemanagement/KepcoFeeDBAccordanceRateList',param,'GET','searchData');
        });
        $('#btnSum').on('click',function(e){
        	if($('#skAfcoDivCd').val() == 'T')        		
        		$('#'+sktGridId).alopexGrid('showProgress');        	
        	else        		
        		$('#'+skbGridId).alopexGrid('showProgress');      
        	var param =  $("#searchForm").getData();
        	//httpRequest('tango-transmission-biz/leasemgmt/kepco/cablecountanalysisfeemanagement/KepcoFeeDBAccordanceRateSummarization', param, successCallback, failCallback, 'GET', 'feeDBAccordanceRateSummarization');
        	tangoRequest('tango-transmission-biz/leasemgmt/kepco/cablecountanalysisfeemanagement/KepcoFeeDBAccordanceRateSummarization',param,'GET','feeDBAccordanceRateSummarization');
        });
        $('#chrDmdYm').change(function() {

            // 드롭다운리스트에서 선택된 값을 텍스트박스에 출력        	
        	//httpRequest('tango-transmission-biz/leasemgmt/common/gisCableCountSummaryDate/'+$('#chrDmdYm option:selected').val(), null, successCallback, failCallback, 'GET', 'gisCableCountSummaryDate');
        	tangoRequest('tango-transmission-biz/leasemgmt/common/gisCableCountSummaryDate/'+$('#chrDmdYm option:selected').val(),null,'GET','gisCableCountSummaryDate');
        });
        //엑셀다운로드
        $('#btnExportExcel').click(function(){
        	var  exgrid; 
        	if($('#skAfcoDivCd').val() == 'T')        		
        		exgrid = 'sktDataGrid';      	        		
        	else        		
        		exgrid = 'skbDataGrid';      	
        	
        	var worker = new ExcelWorker({
        		excelFileName : '한전요금DB',
        		palette : [{
        			className : 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className : 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '한전요금DB',
        			$grid: $('#'+exgrid)
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
    
    //request 실패시.
	function failCallback(response, status, jqxhr, flag){
    	if(flag == 'searchData'){
    		alert(response.__rsltMsg__);
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }
});