/**
 * EqpNtwkLineAcptCurst.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
        setGrid(1,100);
    };
    
    function setRegDataSet(data) {
    	
    	$('#contentArea').setData(data);
    }
    
  //Grid 초기화
    function initGrid() {
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true 
    		}, { 	 
				key : 'ntwkLineNo', align:'center',
				title : '네트워크ID',
				width: '80px'
			}, {
				key : 'ntwkLineNm', align:'center',
				title : '네트워크명',
				width: '180px'
			}, {
				key : 'ntwkTypNm', align:'center',
				title : '망구분',
				width: '80px'
			}, {
				key : 'topoSclNm', align:'center',
				title : '망종류',
				width: '80px'
			}, {
				key : 'ringSwchgMeansNm', align:'center',
				title : '절체방식',
				width: '80px'
			}, {
				key : 'ntwkStatNm', align:'center',
				title : '회선상태',
				width: '60px'
			}, {
				key : 'ntwkCapaNm', align:'center',
				title : '용량',
				width: '60px'
			}, {/* WEST국사    	 */
				key : 'lftMtsoNm', align:'center',
				title : configMsgArray['westMtso'],
				width: '150px'
			}, {/* WEST장비    	 */
				key : 'lftEqpNm', align:'center',
				title : configMsgArray['westEqp'],
				width: '150px'
			}, {/* WEST포트    	 */
				key : 'lftPortNm', align:'center',
				title : 'WEST포트',
				width: '150px'
			}, {/* EAST국사    	 */
				key : 'rghtMtsoNm', align:'center',
				title : configMsgArray['eastMtso'],
				width: '150px'
			}, {/* EAST장비    	 */
				key : 'rghtEqpNm', align:'center',
				title : configMsgArray['eastEqp'],
				width: '150px'
			}, {/* EAST포트장비    	 */
				key : 'rghtPortNm', align:'center',
				title : 'EAST포트',
				width: '150px'
			}, {/* 상위국사명          */
				key : 'uprMtsoNm', align:'center',
				title : configMsgArray['upperMtsoName'],
				width: '120px'
			}, {/* 하위국사명     	 */
				key : 'lowMtsoNm', align:'center',
				title : configMsgArray['lowerMtsoName'],
				width: '120px'
			
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
          
    };
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	
    }

    function setEventListener() {
    	
    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(1, eObj.perPage);
         });
    	
    	//엑셀다운 
    	 $('#btnExportExcel').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#searchForm").getData();
    		 
    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 10;   
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;   
    		 
    		 param.fileName = '장비네트워크수용현황';
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getEqpNtwkLineAcptCurstList";
    		 
    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/excelcreate', param, 'GET', 'excelDownload');
         });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
            
	};
	
	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		
		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
		
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}
		
		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		
		return param;
	}
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.eqpNtwkLineAcptCurst);

    		var param =  $("#searchForm").getData();	
    		if (param.eqpRegCheck == 'ExistsNtwkLine') {
       			callMsgBox('','I', configMsgArray['saveFail']+" <br>선택한 장비를 사용하는 네트워크(링/트렁크)가 있습니다.<br>네트워크를 해지하신 후 장비/포트를 철거할 수 있습니다." , function(msgId, msgRst){});
        	}
    	}
    	
    	if(flag == 'excelDownload'){ 
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);
            
            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
         // 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();
        
        }
    	
    }
    
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    
   
    function setGrid(page, rowPerPage) {
    	
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	 var param =  $("#searchForm").getData();
		 
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpNtwkLineAcptCurst', param, 'GET', 'search');
    }
    
    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})
    	
    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;
		
		}
    }*/
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

});