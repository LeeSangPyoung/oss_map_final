/**
 * CableCountDBAccordanceRate.js
 * 조수DB일치율
 *
 * @author 임상우
 * @date 2016. 6. 27. 오후 4:13:00
 * @version 1.0
 */
$a.page(function() {
	
	var dataGridId = 'dataGrid';
	var branch_office_data = [];//지사코드가 담길 배열
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setEventListener();//이벤트 리스너 등록
    	initSelectCode();//Select(콤보박스) 초기화
    	commonCode = new CommonCode(commonCallback);
    	commonCode.getCommonCode();
    };
    
    //공통코드 Callback
    var commonCallback = function (){
    	initGrid();
    };
    
    //이벤트 리스너 등록
    function setEventListener() {
    	
    	//계열사 Change Event Listener 등록 
    	$('#skAfcoDivCd').on('change', function(e) {
    		skAfcoDivCdChangeEventHandler(e);
		});
    	
    	//한전본부 Change Event Listener 등록 
    	$('#kephdNm').on('change', function(e) {
    		kephdNmChangeEventHandler(e);
		});
    	
    	//과금청구월 Change Event Listener 등록 
    	$('#sumYm').on('change', function(e) {
    		sumYmChangeEventHandler(e);
    	});
    	
    	//데이터출처 Change Event Listener 등록 
    	$('#dataOrigin').on('change', function(e) {
    		dataOriginChangeEventHandler(e);
    	});
    	
        //조회 버튼 Click Event Listener 등록
        $('#btnSearch').on('click', function(e) {
        	btnSearchClickEventHandler(e);
        });
        
        //엑셀다운로드 버튼 Click Event Listener 등록
        $('#btnExportExcel').click(function(e){
        	btnDownloadExcelClickEventHandler(e);
        });
        
        
        //집계 버튼 Click Event Listener 등록
        $('#btnSummarization').click(function(e){
        	btnSummarizationClickEventHandler(e);
        });
        
        
	};
    
    //Grid생성 및 초기화
    function initGrid() {
        skAfcoDivCdChangeEventHandler();//계열사에 따라 보여지는 그리드 변경
    };
    
    //select에 Bind 할 Code 가져오기
    function initSelectCode() {
 
    	//한전본부 & 한전지사 조회
    	searchCode('kepcoOffice');
    	
    	//과금청구월 조회(chargingMonthWithSummaryDate에 데이터가 없으므로 임시로 chargingMonth 사용)
    	searchCode('chargingMonth');
    	
    	//선종 조회
    	searchCode('lineType');
    	//추가함 호가 
    	
    	$("#gisCbcntSumDt").attr("disabled",true);
    }
    
    //코드 조회
    function searchCode (codeName){
    	Tango.ajax({url : 'tango-transmission-biz/leasemgmt/common/codes/' + codeName, 
					data : null,
					method : 'GET'})
					.done(function(response){searchCodeSuccessCallback(response, codeName);})
					.fail(function(response){searchCodeFailCallback(response, codeName);});
    }
    
    //코드 조회 성공시 처리
    function searchCodeSuccessCallback(response, flag){
    	
    	//한전본부/지사코드 조회 후 처리
    	if(flag === 'kepcoOffice'){
    		setKepcoOfficeSelect(response);
    	}
    	
    	//과금청구월코드 조회 후 처리
    	if(flag === 'chargingMonth'){//chargingMonthWithSummaryDate에 데이터가 없으므로 임시로 chargingMonth 사용
    		setChargingMonthSelect(response);
    	}
    	
    	//선종코드 조회 후 처리
    	if(flag === 'lineType'){
    		setLineTypeSelect(response);
    	}
    }
    
    //searchCode request 실패시 처리
    function searchCodeFailCallback(response, flag){
    	//Exception처리
    }
    
    //한전본부/한전지사코드 조회 후 처리
    function setKepcoOfficeSelect(response){
    	kephdNm_data = [];
		
		$('#kephdNm').clear();
		$('#kepboCd').clear();
		
		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			if(resObj.depth == 0){
				kephdNm_data.push(resObj);
			}else{
				branch_office_data.push(resObj);
			}
		}
		
		$('#kephdNm').setData({
             data:kephdNm_data,
		});
		
		$('#kephdNm').setSelected('');
		
		$('#kephdNm').trigger($.Event('change'));//한전지사코드
    }
    
    //한전본부 변경 이벤트 핸들러
    function kephdNmChangeEventHandler(event){
    	
    	kepboCd_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    	
    	$('#kepboCd').clear();
    	
    	if($('#kephdNm').val() !== ''){
    		for(var i=0; i<branch_office_data.length; i++){
    			var obj = branch_office_data[i];
    			if(obj.upperCodeId === $('#kephdNm').val()){
    				kepboCd_data.push(obj);
    			}
    		}
    	}
    	
    	$('#kepboCd').setData({
            data:kepboCd_data
		});
    	
    	$('#kepboCd').setSelected('');
    }
    
    //과금청구월코드 조회 후 처리
    function setChargingMonthSelect(response){
    	$('#sumYm').clear();
		$('#sumYm').setData({data:response});
		$('#sumYm').trigger($.Event('change'));//GIS조수집계일
    }
    
	//과금청구월 변경 이벤트 핸들러
    function sumYmChangeEventHandler(event){
    	Tango.ajax({url : 'tango-transmission-biz/leasemgmt/common/gisCableCountSummaryDate/'+$('#sumYm').val(), 
			data : null,
			method : 'GET'})
			.done(function(response){successCallback(response, 'gisCableCountSummaryDate');})
			.fail(function(response){failCallback(response, 'gisCableCountSummaryDate');});
    }
    
    //선종코드 조회 후 처리
    function setLineTypeSelect(response){
    	
    	aswyp_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    	
		for(var i=0; i<response.length; i++){
			var obj = response[i];
			aswyp_data.push(obj);
		}
    	
		$('#aswyp').setData({
             data:aswyp_data
		});
		
		$('#aswyp').setSelected('');
    }
    
    //데이터출처 Change Event Listener 등록 
    function dataOriginChangeEventHandler(event){
    	
    	dataOrigin = $('#dataOrigin').val();
		
		if(dataOrigin !== ''){
			$('#divCbcntScop').setEnabled (true);
		}else{
			$('#cbcntScop').setSelected('');
			$('#divCbcntScop').setEnabled (false);
		}
    }
    
    //조회버튼 클릭 시 처리
    function btnSearchClickEventHandler(event){
    	var param =  $("#searchForm").getData();
    	param.kephdNm = $('#kephdNm option:selected').text();
    	Tango.ajax({url : 'tango-transmission-biz/leasemgmt/kepco/cablecountanalysisfeemanagement/getCableCountDBAccordanceRateList', 
			data : param,
			method : 'GET'})
			.done(function(response){successCallback(response, 'searchData');})
			.fail(function(response){failCallback(response, 'searchData');});
    	$('#'+dataGridId).alopexGrid('showProgress');
    }
    
	//request 성공시
    function successCallback(response, flag){
    	
    	//GIS 조수집계일 조회 후 처리
    	if(flag === 'gisCableCountSummaryDate'){
    		$('#gisCbcntSumDt').val(response.gisCableCountSummaryDate);
    	}
    	
    	//리스트 조회 후 처리
    	if(flag === 'searchData'){
    		skAfcoDivCdChangeEventHandler();
    		$('#'+dataGridId).alopexGrid('hideProgress');
    		$('#'+dataGridId).alopexGrid('dataSet', response.cableCountDBAccordanceRateList);
    	}
    }
    
	//request 실패시
    function failCallback(response, flag){
    	if(flag === 'searchData'){
    		alert(response.__rsltMsg__);
    		$('#'+dataGridId).alopexGrid('hideProgress');
    	}
    }
	
	//계열사에 따른 화면 설정
	function skAfcoDivCdChangeEventHandler(event){
		
		skAfcoDivCd = $('#skAfcoDivCd').val();
		
		if(skAfcoDivCd === 'B'){
			$('#divAswyp').setEnabled (true);
		}else{
			$('#aswyp').setSelected('');
			$('#divAswyp').setEnabled (false);
		}
		
		if(event == undefined){
			
			if(skAfcoDivCd === 'T'){
				$('#'+dataGridId).alopexGrid({extend:['defineSktDataGrid']});
			}
			
			if(skAfcoDivCd === 'B'){
				$('#'+dataGridId).alopexGrid({extend:['defineSkbDataGrid']});
			}
		}
	}
	
	//Excel Download 실행
	function btnDownloadExcelClickEventHandler(event){
		var worker = new ExcelWorker({
    		excelFileName: '조수DB일치율분석',
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: '조수DB일치율분석',
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
	}
	
	
	//집계 버튼 클릭 시 실행
	function btnSummarizationClickEventHandler(event){
		
	}
	
	
	
	
});