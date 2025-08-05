/**
 * CableCountDBAnalysisStatistic.js
 * 조수DB통계분석
 *
 * @author 임상우
 * @date 2016. 6. 27. 오후 4:13:00
 * @version 1.0 
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setEventListener();
    	setSelectCode();
    };
    
    //Grid 초기화
    function initGrid() {
    	AlopexGrid.define('defineDataGrid', {
    		
    		defaultColumnMapping:{
    			sorting: true
			},
    		
    		columnMapping: [{
				key : 'kepcbCd', align:'center',
				title : '한전지사코드',
				width: '90px'
			}, {
				key : 'kepcoBoNm', align:'center',
				title : '한전본부',
				width: '90px'
			}, {
				key : 'kepcbNm', align:'center',
				title : '한전지사',
				width: '90px'
			}, {
				key : 'chrDmdYm', align:'center',
				title : '과금청구월',
				width: '90px'
			}, {
				key : 'lmKepcoTlplFqstrDts', align:'right',
				title : '현장조사표 업로드 건수',
				width: '150px'
			}, {
				key : 'lmKepafTlplFeeDts', align:'right',
				title : '요금내역(전주)업로드 건수',
				width: '150px'
			}, {
				key : 'josuEqualRate', align:'right',
				title : '조수DB일치율집계건수',
				width: '150px'				
			}, {
				key : 'kepcoBillDuct', align:'right',
				title : '요금내역(관로)업로드 건수',
				width: '150px'				
			}, {
				key : 'kepcoBillRepeater', align:'right',
				title : '요금내역(중계기)업로드 건수',
				width: '150px'				
			}]
    	});
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	extend : ['defineDataGrid']
        });
    };
    
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/leasemgmt/common/codes/kepcoOffice', null, successCallback, failCallback, 'GET', 'kepcoOffice');
    	httpRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonth', null, successCallback, failCallback, 'GET', 'chargingMonthWithSummaryDate');
    	//httpRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonthWithSummaryDate', null, successCallback, failCallback, 'GET', 'chargingMonthWithSummaryDate');
    }
    
    var branch_office_data = [];
    
	//request 성공시
    function successCallback(serviceId, response, flag){
    	
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
    			setBranchOfficeData($('#kepcoBoCd').getValues()[0]);
    		});
    	}
    	
    	if(flag == 'chargingMonthWithSummaryDate'){
    		$('#sumYm').clear();
    		$('#sumYm').setData({
	             data:response
    		});
    		$('#sumYm').trigger($.Event('change'));
    	}
    	
    	if(flag == 'gisCableCountSummaryDate'){
    		$('#cableCountSummaryDate').val(response.value);
    	}
    	
    	if(flag == 'searchData'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.dbUladCurstList);
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
    	
    	$('#kepcbCd').setData({
            data:option_data
		});
    }

    function setEventListener() {
    	
    	//계열사(SKT/SKB)변경 시 처리
    	$('#skAfcoDivCd').on('change', function(e) {
    		
    	});
    	
    	//과금청구월 변경시 GIS조수집계일 조회
    	$('#sumYm').on('change', function(e) {
    		httpRequest('tango-transmission-biz/leasemgmt/common/gisCableCountSummaryDate/'+$('#sumYm').val(), null, successCallback, failCallback, 'GET', 'gisCableCountSummaryDate');
    	});
    	
        // 검색
        $('#btnSearch').on('click', function(e) {
        	$('#'+gridId).alopexGrid('showProgress');
        	var param =  $("#searchForm").getData();
        	httpRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getKepcoDbUploadCurrentStateList', param, successCallback, failCallback, 'GET', 'searchData');
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
        
        $('#dropdownExportText').addHandler(function(e){
            var selectedId = e.currentTarget.id;
            
            switch(selectedId){
            	case "typeA" :
            		//현장조사표
				    alert('현장조사표 Text 출력');
            		break;
            	case "typeB" :
            		//과금내역서
            		alert('과금내역서 Text 출력');
            		break;
            	case "typeC" :
            		//조수DB일치율
            		alert('조수DB일치율 Text 출력');
            		break;
            }
        });
	};
    
    //request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		alert(response.__rsltMsg__);
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }
});