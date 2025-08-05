/**
 * FacilitiesRegPopup.js
 * 설비관리등록Popup
 *
 * @author Jeong,JungSig
 * @date 2016. 7. 21. 오전 10:45:00
 * @version 1.0
 */
$a.page(function() {
	
	var dataGridId = "dataGrid";
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
   	  	
    	setEventListener();//이벤트 리스너 등록
    	initSelectCode();//Select(콤보박스) 초기화
    	initGridProc(param);//그리드셀 초기화
    	
    };
    
    //그리드셀 초기화
    function initGridProc(param) {
    	var type = param.lesKndCd;
    	
    	$('#lesKndCd').setData({option_selected:type});
		$('#divLesKndCd').setEnabled (false);
    	lesKndCd[type]();
    	$('#'+dataGridId).alopexGrid('dataEmpty');
    }
    
    //이벤트 리스너 등록
    function setEventListener() {
    	
    	//설비종류 Change Event Listener 등록
    	$('#lesKndCd').on('change', function(e) {
    		lesKndCdChangeEventHandler(e);
		});
    	
    	//파일 Import를 위한 input을 동적으로 생성
    	$('#bntOpenExcel').after('<input id="import_file_input" class="input-file-import" type="file" value="import" style="display:none" name="file"/>');

    	//EXCEL 불러오기 버튼 Click Event Listener 등록
    	$('#bntOpenExcel').on('click', function(e) {
    		$('#import_file_input').click();
		});
    	
        // 파일이 선택됐을때 로직 
        $('#import_file_input').change( function(e){
        	
        	var $input = $(this);
        	var $grid = $('#'+dataGridId);
        	var files = e.target.files;
        	var worker = new ExcelWorker();

        	worker.import($grid, files, function(dataList){
        		$grid.alopexGrid('dataAdd', dataList);
        	});
        	$input.val('');
        });
    	
    	//저장 버튼 Click Event Listener 등록
    	$('#bntSave').on('click', function(e) {
    		bntSaveClickEventHandler(e);
		});
    	
    	//종료 버튼 Click Event Listener 등록
    	$('#btnClose').on('click', function(e) {
    		bntCloseClickEventHandler(e);
		});
    	
    	
	};
	
	//종료 버튼 Click Handler
	function bntCloseClickEventHandler(event){
		
		$a.close();
	}

    
	//저장 버튼 Click Handler
	function bntSaveClickEventHandler(event){
		
		var insertParam = $('#'+dataGridId).alopexGrid('dataGet', { _state : { added:true }});
		if(insertParam.length < 1){
			alert('저장할 회선 데이터가 없습니다.');
			return;
		}		
		
		for(i=0; i < insertParam.length; i++){
			insertParam[i].lesKndCd = $('#lesKndCd').val();
			insertParam[i].lastChgUserId = insertParam[i].frstRegUserId = "admin";
		}
		
		if (window.confirm("업로드된 회선번호 " + insertParam.length + " 건(을) 등록 하시겠습니까?")) {
			$('#'+dataGridId).alopexGrid('showProgress');
			
	    	Tango.ajax({
	          url : 'tango-transmission-biz/leasemgmt/demandfee/fctmgmt/createIntgFctLst', 
	  	      data : insertParam, 
	  	      method : 'POST' 
			}).done(function(response){successCallback(response, 'inertIntgFctLst');})
			  .fail(function(response){failCallback(response, 'inertIntgFctLst');})
			  .error();
	    	
	    	
		}
		
	}
	
	//request 성공시
    function successCallback(response, flag){
    	
    	$('#'+dataGridId).alopexGrid('hideProgress');
    	if(flag === 'inertIntgFctLst'){
    		alert("저장 되었습니다.");
    		$a.close();
    	}
    	
    }
    
	//request 실패시.
    function failCallback(response, flag){
    	$('#'+dataGridId).alopexGrid('hideProgress');
    	if(flag === 'inertIntgFctLst'){
    		alert("error : " + response.__rsltMsg__);
    		$a.close();
    	}
    	
    }
	
    //select에 Bind 할 Code 가져오기
    function initSelectCode() {

    	//설비종류
    	lesKndCd_data = [{depth:"0",upperCodeId:"*",codeId:"T1",codeName:"광중계기광코아"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T2",codeName:"기지국회선"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T3",codeName:"통신설비"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T4",codeName:"Wi-Fi"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T5",codeName:"B2B"},
    	                       {depth:"0",upperCodeId:"*",codeId:"T6",codeName:"HFC중계기"}];
    	$('#lesKndCd').clear();
    	$('#lesKndCd').setData({
    		data:lesKndCd_data,
    	});
    	$('#lesKndCd').trigger($.Event('change'));//dispatch 설비종류 change event
    	
    	
    }
    
    //설비종류 변경 시 처리
    var lesKndCd = {
    	T1 : function(){
    		//광중계기광코아 Grid
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineOptDataGrid']
            });
    	},
    	T2 : function(){
    		//기지국회선 Grid
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineBtsDataGrid']
            });
    	},
    	T3 : function(){
    		//통신설비 Grid
    		$('#bntAddRow').show();
    		$('#bntDeleteRow').show();
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineRentDataGrid']
            });
    	},
    	T4 : function(){
    		//Wi-Fi Grid
    		$('#bntAddRow').show();
    		$('#bntDeleteRow').show();
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineWifiDataGrid']
            });
    	},
    	T5 : function(){
    		//B2B Grid
    		$('#bntAddRow').show();
    		$('#bntDeleteRow').show();
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineB2bDataGrid']
            });
    	},
    	T6 : function(){
    		//HFC중계기 Grid
    		$('#bntAddRow').show();
    		$('#bntDeleteRow').show();
    		$('#'+dataGridId).alopexGrid({
            	extend : ['defineHfcDataGrid']
            });
    	}
    };
    
    //설비종류 Change Event Listener
    function lesKndCdChangeEventHandler(event){
    	$('#bntAddRow').hide();
    	$('#bntDeleteRow').hide();
    	lesKndCd[$('#lesKndCd').val()]();
    	$('#'+dataGridId).alopexGrid('dataEmpty');
    }
    
    //검색기준 변경시 처리
    function searchStandardChangeEventHandler(event){
    	 searchStandard = ('#searchStandard').val();
    	 
    	 if(searchStandard !== ''){
    		 
    	 }
    }
    
    team_data = [{depth:"1",upperCodeId:"H01",codeId:"T001",codeName:"통합전송솔루션팀"},
                 {depth:"1",upperCodeId:"H02",codeId:"T002",codeName:"수도권전송망운용팀"},
                 {depth:"1",upperCodeId:"H03",codeId:"T003",codeName:"부산전송망운용팀"},
                 {depth:"1",upperCodeId:"H04",codeId:"T004",codeName:"대구전송망운용팀"},
                 {depth:"1",upperCodeId:"H05",codeId:"T005",codeName:"중부전송망운용팀"},
                 {depth:"1",upperCodeId:"H06",codeId:"T006",codeName:"서부전송망운용팀"},
                 {depth:"1",upperCodeId:"H06",codeId:"T007",codeName:"제주품질관리팀"}];
    
	

});