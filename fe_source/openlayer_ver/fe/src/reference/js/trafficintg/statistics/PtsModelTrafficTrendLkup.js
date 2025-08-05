/**
 * PtsModelTrafficTrendLkup.js
 *
 * @author 이현우
 * @date 2016. 7. 20. 오후 04:25:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	var currentDate = new Date();
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth();
	var clctDtYear = currentDate.getFullYear();
	var clctDateYear = currentDate.getFullYear() - 1;
	
	clctDtDay = clctDtDay < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;
	
    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };

    function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
				key : 'hdofcNm', align:'left',
				title : '본부',
				width: '150px'
			}, {
				key : 'vendor', align:'center',
				title : '제조사',
				width: '100px'
			}, {
				key : 'eqpMdl', align:'left',
				title : '장비모델',
				width: '150px'
			}, {
				key : 'cardMdl', align:'left',
				title : '카드모델',
				width: '150px'
			}, {
				key : 'm1', align:'right',
				title : 'M1',
				width: '110px'
			}, {
				key : 'm2', align:'right',
				title : 'M2',
				width: '110px'
			}, {
				key : 'm3', align:'right',
				title : 'M3',
				width: '110px'
			}, {
				key : 'm4', align:'right',
				title : 'M4',
				width: '110px'
			}, {
				key : 'm5', align:'right',
				title : 'M5',
				width: '110px'
			}, {
				key : 'm6', align:'right',
				title : 'M6',
				width: '110px'
			}, {
				key : 'm7', align:'right',
				title : 'M7',
				width: '110px'
			}, {
				key : 'm8', align:'right',
				title : 'M8',
				width: '110px'
			}, {
				key : 'm9', align:'right',
				title : 'M9',
				width: '110px'
			}, {
				key : 'm10', align:'right',
				title : 'M10',
				width: '110px'
			}, {
				key : 'm11', align:'right',
				title : 'M11',
				width: '110px'
			}, {
				key : 'm12', align:'right',
				title : 'M12',
				width: '110px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
	    
	    //기준일자 입력
	    $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
        //년도
        $('#year').empty();
        
        if($('#trendMon').is(':checked')){
        	var currentDate = new Date();
        	var clctDtMon = currentDate.getMonth();
        	var clctDtYear = currentDate.getFullYear();
        	for(var i=-3; i<1; i++){
	    		$('#year').append($('<option>', {value: parseInt(clctDtYear) + i, text: parseInt(clctDtYear) + i + '년'}));
	    	}
	    	
	        $('#year').setSelected(clctDtYear + '년');
	        $('#mon').setSelected(parseInt(clctDtMon) + '월');
	        
	        $('#'+gridId).alopexGrid("showCol", ['m11',  'm12']);	// (2017-04-21 : HS Kim) 추가

        }else{
        	var currentDate = new Date();        	
        	var clctDateYear = currentDate.getFullYear() - 1;
        	
	        for(var i=-3; i<2; i++){
	    		$('#year').append($('<option>', {value: parseInt(clctDateYear) + i, text: parseInt(clctDateYear) + i + '년'}));
	    	}
	    	
	        $('#year').setSelected(clctDateYear + '년');
	        
	        $('#'+gridId).alopexGrid("hideCol", [ 'm11','m12' ], 'conceal');	// (2017-04-21 : HS Kim) 추가
	                	
        }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	
        param.clctDtYear = clctDtYear;
        param.clctDtMon = $('#trendMon').is(':checked') ? $('#mon').val() : '00';
        param.clctDtDay = clctDtDay;
        
    	httpRequest('tango-transmission-biz/trafficintg/statistics/ptsModelTrafficTrendLkup', param, successCallbackSearch, failCallback, 'GET');
    }
    
    function drawMenu() {
    	var year = $('#year').val(); //parseInt(clctDtYear);
    	var mon = $('#mon').val(); //parseInt(clctDtMon);
    	
    	if (!$('#trendYear').is(':checked')) {	//월별
	    	var beginYear = year - 1;
	    	var beginMon = mon == 12 ? 1 : parseInt(mon) + 1;
	    	
	    	var i, n;
	    	for (i=beginMon, n=1; i < beginMon + 12; i++, n++) {
	    		var m = i % 12;
	    		if (m == 0) m = 12;
	    		else if (m == 1) beginYear += 1;
	    		
	    		m = m < 10 ? '0' + m : m;
	    		var t = beginYear + '-' + m + ' (Mb)';
	    		var k = 'm' + n;
	    		
	    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, k);
	    	}
    	}
    	else {	//년별
    		var beginYear = year - 9;	// (2017-04-21 : HS Kim) year - 11 => year - 9
	    	
	    	var i, n;
	    	for (i=beginYear, n=1; i < year + 1; i++, n++) {
	    		var t = String(i) + ' (Mb)';
	    		var k = 'm' + n;
	    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, k);
	    	}
    	}
    }

    function setEventListener() {
    	$('#trendMon').on('click', function(e) {
    		setSelectCode();
        	$('#monDiv').show();
        });
        
        $('#trendYear').on('click', function(e) {
        	setSelectCode();
        	$('#monDiv').hide();
        });
        var eobjk=100; // Grid 초기 개수
    	//페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setGrid(eObj.page, eObj.pageinfo.perPage);
        });
        
    	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	eobjk =  eObj.perPage;
        	setGrid(1, eobjk);
        });
        
        // 검색
        $('#btnSearch').on('click', function(e) {
        	drawMenu();
        	setGrid(1, eobjk);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		 
    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;
    		
            param.clctDtYear = clctDtYear;
            param.clctDtMon = $('#trendMon').is(':checked') ? $('#mon').val() : '00';
            param.clctDtDay = clctDtDay;
	        
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;   
    		 
    		param.fileName = "PTS모델별트래픽추이조회";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "ptsModelTrafficTrendLkup";
    		 
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreatePtsModelTrafficTrendLkup', param, successCallbackExcel, failCallback, 'GET');
         });
        
        $('#year').on('change', function(e) {
        	clctDtYear = $('#year').val();
        })
        
        $('#mon').on('change', function(e) {
        	clctDtMon = $('#mon').val();
        })
	};
    
    //request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }
    
    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.ptsModelTrafficTrendLkup);
	}
    
	var successCallbackExcel = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate');
		console.log(response);
		
		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/trafficintg/trafficintgcode/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
		$form.appendTo('body');
		$form.submit().remove();
	}
	
    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional

    }
    
    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}
    
    //Excel
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
});