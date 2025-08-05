/**
 * EqpStcSmry.js
 *
 * @author 김현민
 * @date 2016. 7. 7. 오전 10:10:00
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

    	$("#radioAll").setSelected();
    };

    function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    //	headerGroup: [{
    	//		fromIndex:2, toIndex:4, title:"장비 구분", id:'u0'
    	//	}, {
    	//		fromIndex:5, toIndex:5, title:"지역", id:'u1'
    	//	}, {
    	//		fromIndex:6, toIndex:7, title:"", id:'u2'
    	//	}],
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
    		columnMapping: [{
    			key : 'clctDt', align:'center',
				title : '기준일자',
				width: '100px'
			}, {
				key : 'ntwkTypNm', align:'center',
				title : '망 구분',
				width: '90px'
			}, {
				key : 'eqpTypNm', align:'center',
				title : '장비명',
				width: '150px'
			}, {
				key : 'vendEnghNm', align:'center',
				title : '제조사',
				width: '110px'
			}, {
				key : 'eqpMdlNm', align:'left',
				title : '모델명',
				width: '110px'
			}, {
				key : 'sudo', align:'right',
				title : '전국',
				width: '90px'
			/*}, {
				key : 'sudo', align:'right',
				title : '수도권',
				width: '90px'
			}, {
				key : 'busan', align:'right',
				title : '동부',
				width: '90px'
			}, {
				key : 'daegu', align:'right',
				title : '대구',
				width: '90px'
			}, {
				key : 'sebu', align:'right',
				title : '서부',
				width: '90px'
			}, {
				key : 'jungbu', align:'right',
				title : '중부',
				width: '90px'*/
			}, {
				key : 'total', align:'right',
				title : '계',
				width: '90px'
			}, {
				key : 'bigo', align:'left',
				title : '비고',
				width: '90px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param = $("#searchForm").getData();

    	param.clctDt = $('#clctDt').val().replace(/-/gi,'');
        param.lineConnYn = $('#radioAll').is(':checked') ? '' : 'Y';

    	httpRequest('tango-transmission-biz/trafficintg/statistics/eqpStcSmry', param, successCallbackSearch, failCallback, 'GET');
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

        	param.clctDt = $('#clctDt').val().replace(/-/gi,'');
            param.lineConnYn = $('#radioAll').is(':checked') ? '' : 'Y';

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.fileName = "장비통계요약";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "eqpStcSmry";

    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateEqpStcSmry', param, successCallbackExcel, failCallback, 'GET');
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
		setSPGrid(gridId,response, response.eqpStcSmry);
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

    //Excel
    function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
	//	param.headerGrpCnt = 1;
	//	var headerGrpCd = "";
	//	var headerGrpNm = "";
	//	var headerGrpPos = "";
	//	for (var i=0; i<gridColmnInfo.length; i++) {
	//		if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id")) {
	//			headerGrpCd += gridColmnInfo[i].id + ";";
	//			headerGrpNm += gridColmnInfo[i].title + ";";
	//			headerGrpPos += gridColmnInfo[i].fromIndex + "," + (gridColmnInfo[i].toIndex - gridColmnInfo[i].fromIndex + 1) + ";";
	//		}
	//	}
	//	param.headerGrpCd = headerGrpCd;
	//	param.headerGrpNm = headerGrpNm;
	//	param.headerGrpPos = headerGrpPos;

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