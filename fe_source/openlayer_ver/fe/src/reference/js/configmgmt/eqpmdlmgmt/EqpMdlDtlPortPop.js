/**
 * EqpMdlDtlPortPop.js
 *
 * @author Administrator
 * @date 2016. 11. 08. 오전 09:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGrid';
	var paramData = null;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	$a.page.method = 'POST';
    	//if (! jQuery.isEmptyObject(param) ) {
    	//	paramData = param;
    	//}
    	initGrid();
    	setRegDataSet(param);
        setEventListener();
        
        if (! jQuery.isEmptyObject(param) ) {
        	setGrid(1,100);
        }
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
			}, {/* 모델일련번호	 */
				key : 'eqpMdlDtlSrno', align:'center',
				title : configMsgArray['modelSerialNumber'],
				width: '70px'
			}, {/* 채널값		 */
				key : 'chnlVal', align:'center',
				title : configMsgArray['channelValue'],
				width: '70px'
			}, {/* 파장값 		 */
				key : 'wavlVal', align:'center',
				title : configMsgArray['wavelengthValue'],
				width: '70px'
			}, {/* 주파수값		 */
				key : 'freqVal', align:'center',
				title : configMsgArray['frequencyValue'],
				width: '70px'
			}, {/* 밴드값		 */
				key : 'bdwthVal', align:'center',
				title : configMsgArray['bandValue'],
				width: '70px'	
			}, {/* 비고			 */
				key : 'eqpMdlDtlRmk', align:'center',
				title : configMsgArray['remark'],
				width: '70px'
			}, {/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '70px'
			}, {/* 등록자		 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '70px'				
			}, {/* 변경일자		 */ 
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '70px'		
			}, {/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '70px'	
			}],
			message: {/* 데이터가 없습니다.		 */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        //gridHide();
        
    };
    
       
    function setEventListener() {
    	
    	var perPage = 100;
    	
    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	 
    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
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
    		 
    		 param.fileName = configMsgArray['equipmentModelWavelengthPortDetails']; /*장비모델파장포트내역*/
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getEqpMdlDtlPortList";
    		 
    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/excelcreate', param, 'GET', 'excelDownload');
         });

	};
	
	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);
		
		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
		
		//console.log(gridHeader);
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
		//param.excelHeaderInfo = gridColmnInfo;
		
		return param;
	}
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.eqpMdlDtlPortList);
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
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    	
    	if(flag == 'excelDownload'){ 
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }
    
    // 컬럼 숨기기
    function gridHide() {
    	
    	var hideColList = ['eqpMdlId'];
    	
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	
	}
    
    function setGrid(page, rowPerPage) {
    	
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	 var param =  $("#searchForm").getData();
		 
		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/eqpmdldtlport', param, 'GET', 'search');
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