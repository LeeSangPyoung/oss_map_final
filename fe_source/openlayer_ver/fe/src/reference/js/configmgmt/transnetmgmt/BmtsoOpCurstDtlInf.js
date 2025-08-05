
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setRegDataSet(param);
        setEventListener();
        setGrid();
    };

    function setRegDataSet(data) {
    	$('#contentArea').setData(data);
    }

	//Grid 초기화
    function initGrid(strGubun) {

		var mappingN =  [
			{ align:'center', title : '순번', width: '40px', numberingColumn: true },
			{ key : 'mtsoTypNm', align:'center', title : '국사유형', width: '80px' },
			{ key : 'mtsoNm', align:'center', title : '국사명', width: '120px' },
    		{ key : 'eqpTypNm', align:'center', title : '장비타입', width: '100px' },
    		{ key : 'eqpNm', align:'center', title : '장비명', width: '120px' },
    		{ key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '100px' },
    		{ key : 'eqpId', align:'center', title : '장비ID', width: '80px' },
    		{ key : 'svlnNo', align:'center', title : '서비스회선ID', width: '100px' },
    		{ key : 'lineNm', align:'center', title : '서비스회선명', width: '140px' }];

        //그리드 생성
        $('#'+gridId).alopexGrid({
//        	pager : false,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
            columnMapping : mappingN,
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row"
        });

	};

    function setEventListener() {

    	//엑셀다운
   	 $('#btnExportExcel').on('click', function(e) {
        	//tango transmission biz 모듈을 호출하여야한다.
   		 var param =  $("#searchForm").getData();

   		 param = gridExcelColumn(param, gridId);
   		 param.pageNo = 1;
   		 param.rowPerPage = 10;
   		 param.firstRowIndex = 1;
   		 param.lastRowIndex = 1000000000;

   		 param.fileName = '기지국장비현황';
   		 param.fileExtension = "xlsx";
   		 param.excelPageDown = "N";
   		 param.excelUpload = "N";
   		 param.method = "getBmtsoOpCurstEqpList";

   		 $('#'+gridId).alopexGrid('showProgress');
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/transnetmgmt/excelbmtsoeqplist', param, 'GET', 'excelDownload');
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

    		setSPGrid(gridId, response, response.bmtsoOpCurstEqpList);
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

    function setGrid(page, rowPerPage){
    	 var param =  $("#searchForm").getData();
    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/transnetmgmt/bmtsoOpCurstEqpList', param, 'GET', 'search');
    }

    function setSPGrid(GridID,Option,Data) {
	       	$('#'+GridID).alopexGrid('dataSet', Data);
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

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