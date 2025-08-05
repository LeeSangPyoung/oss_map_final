/**
 * TrafficStcSmry.js
 *
 * @author 이현우
 * @date 2016. 7. 19. 오전 09:47:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 1);
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();
	
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
    			key : 'clctDt', align:'center',
				title : '일자',
				width: '100px'
			}, {
				key : 'hdofcNm', align:'left',
				title : '본부',
				width: '130px'
			}, {
				key : 'eqpCl', align:'center',
				title : '장비분류',
				width: '90px'
			}, {
				key : 'vendor', align:'center',
				title : '제조사',
				width: '90px'
			}, {
				key : 'eqpMdl', align:'left',
				title : '장비모델',
				width: '110px'
			}, {
				key : 'trfSumr', align:'right',
				title : '트래픽합(Mb)',
				width: '100px'
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
    }
    
	//request 성공시
    function successCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.MtsoStcSmry);
    	}
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	
    	var date = $('#clctDt').val().replace(/-/gi,'');
    	param.clctDt = date;
        param.clctDtYear = date.substring(0,4);
        param.clctDtMon = date.substring(4,6);
        param.clctDtDay = date.substring(6,8);
        
    	httpRequest('tango-transmission-biz/trafficintg/statistics/trafficStcSmry', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
    	//페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setGrid(eObj.page, eObj.pageinfo.perPage);
        });
        
    	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	eobjk = eObj.perPage;
        	setGrid(1, eobjk);
        });
        
        // 검색
        $('#btnSearch').on('click', function(e) {
    
        	setGrid(1, eobjk);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		
    		param = gridExcelColumn(param, gridId);
    		 
    		param.pageNo = 1;
    		param.rowPerPage = 100;
    		
        	var date = $('#clctDt').val().replace(/-/gi,'');
        	param.clctDt = date;
            param.clctDtYear = date.substring(0,4);
            param.clctDtMon = date.substring(4,6);
            param.clctDtDay = date.substring(6,8);
	        
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;   
    		 
    		param.fileName = "트래픽통계요약";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "trafficStcSmry";
    		 
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateTrafficStcSmry', param, successCallbackExcel, failCallback, 'GET');
         });
        
        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	clctDtYear = date.year;
            	
            	clctDtMon = date.month < 10 ? '0' + date.month : date.month;
            	clctDtDay = date.day < 10 ? '0' + date.day : date.day;
            	
                $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
            });
        });
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
		
		for(var i=0; i<response.trafficStcSmry.length; i++ )
		{
		   var strComma = Comma(response.trafficStcSmry[i].trfSumr);
		   response.trafficStcSmry[i].trfSumr = strComma;
		}
		setSPGrid(gridId,response, response.trafficStcSmry);
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
		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
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
    
    function Comma(str) {
    	str = String(str);
    	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,'); 
    	
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