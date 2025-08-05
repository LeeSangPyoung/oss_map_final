/**
 * DBUploadCurrentState.js
 *
 * @author 
 * @date 2016. 6. 27. 오전 10:10:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	commonCode = new CommonCode(commonCallback);
		commonCode.getCommonCode();
        setSelectCode();
    	setEventListener();
    };
    
    function  GetJsonData (data,idx) {

    	var parseData = $.parseJSON(data); 

    	$(data).each(function (idx, item) {
    		$(item).each(function (key, value){
    			//alert(key + " : " + value);
    			return value;
    		})
    	})

   }

    //Grid 초기화
    function initGrid() {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	extend : ['defineDataGrid']
        });
    };
    
    function tangoRequest(surl,sdata,smethod,sflag)
    {
    	/*
    	Tango.ajax({
			url : surl,
			data : sdata,
			method : smethod
		}).done(function(response){successCallback(response, sflag);})
		  .fail(function(response){failCallback(response, sflag);})
		  
		 */
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
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/kepcoOffice',null,'GET','kepcoOffice');
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonth',null,'GET','chargingMonth');	
    }
    var branch_office_data = [];
    
	
    
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
    	
    	$('#kepcbCd').setData({
            data:option_data
		});
    	$('#kepcbCd').trigger($.Event('change'));
    }

    function setEventListener() {
        // 검색
        $('#btnSearch').on('click', function(e) {
        	$('#'+gridId).alopexGrid('showProgress');
        	var param =  $("#searchForm").getData();
        	
        	//httpRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/kepcoUtilityFeeList', param, successCallback, failCallback, 'GET', 'searchData');
        	tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/kepcoUtilityFeeList',param,'GET','searchData');
        });
        
        //엑셀다운로드
        $('#btnDownloadExcel').click(function(){
        	var worker = new ExcelWorker({
        		excelFileName : '한전공가이용료',
        		palette : [{
        			className : 'B_YELLOW',
        			backgroundColor: '255,255,0'
        		},{
        			className : 'F_RED',
        			color: '#FF0000'
        		}],
        		sheetList: [{
        			sheetName: '한전공가이용료',
        			$grid: $('#'+gridId)
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
    	
		if(flag == 'kepcoOffice'){
    		
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

    		$('#kepcoBoCd').setData({
	             data:option_data,
	             option_selected:''
    		});
    		
    		$('#kepcoBoCd').on('change', function(e) {
    			setBranchOfficeData($('#kepcoBoCd').val());
    		});
    	}
    	
    	if(flag == 'chargingMonth'){
    		$('#chrDmdYm').clear();
    		$('#chrDmdYm').setData({
	             data:response
    		});
    	}
    	
    	if(flag == 'searchData'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.kepcoUtilityFeeList);
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