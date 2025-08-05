/**
 * EqpSctnAcptCurst.js
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
    		                /* 자국 */
    		headerGroup : [ { fromIndex :  1 , toIndex :  4 , title : configMsgArray['childBaseStation'] , id : "ChildBaseStation", color : "YELLOW"},
    		                /* 대국 */
                  			{ fromIndex : 5 , toIndex : 7 , title : configMsgArray['situation'] , id : "Situation", color : "BLUE" }],
    		columnMapping: [{
    			/* 순번 			 */
    			align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true 
			}, {/* 포트인덱스값	 */
				key : 'portIdxNo', align:'center',
				title : configMsgArray['portIndexValue'],
				width: '70px'
			}, {/* 포트명		 */
				key : 'portNm', align:'center',
				title : configMsgArray['portName'],
				width: '70px'
			}, {/* 포트IP    	 */
				key : 'portIpAddr', align:'center',
				title : configMsgArray['portInternetProtocol'],
				width: '70px'
			}, {/* 포트비고 		 */
				key : 'portRmk', align:'center',
				title : '포트비고',
				width: '70px'
			}, {/* 대국장비명            */
				key : 'sttEqpNm', align:'center',
				title : configMsgArray['situationEquipmentName'],
				width: '70px'
			},{/* 대국포트인덱스      */
				key : 'sttPortIdxNo', align:'center',
				title : configMsgArray['situationPortIndex'],
				width: '70px'
			}, {/* 대국포트명          */
				key : 'sttPortNm', align:'center',
				title : configMsgArray['situationPortName'],
				width: '70px'
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
    		 
    		 param.fileName = configMsgArray['equipmentSectionAcceptCurrentState'];
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getEqpSctnAcptCurstList";
    		 
    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/excelcreate', param, 'GET', 'excelDownload');
         });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
            
	};
	
	function gridExcelColumn(param, gridId) {

		/*======Grid의 HeaderGroup 내용 가져오기======*/
    	var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");
		
    	var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/
		
		for(var i=0; i<gridHeaderGroup.length; i++) {
			if(gridHeaderGroup[i].title != undefined) {
				excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex - 1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupFromIndex += ";";
				excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex - 1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupToIndex += ";";
				excelHeaderGroupTitle += gridHeaderGroup[i].title;
				excelHeaderGroupTitle += ";";
				excelHeaderGroupColor += gridHeaderGroup[i].color;
				excelHeaderGroupColor += ";";
			}
		}
		
		/*======Grid의 Header 내용 가져오기 ======*/		
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
		
		/*======해더그룹정보======*/
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupColor = excelHeaderGroupColor;
		
		/*======해더정보======*/
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
    		
    		setSPGrid(gridId, response, response.eqpSctnAcptCurst);
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
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpSctnAcptCurst', param, 'GET', 'search');
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