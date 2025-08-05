/**
 * FieldQualityInspectionCurrentState.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var loginDept = $('input[name=loginDept]').val();
	var loginDeptType = $('input[name=loginDeptType]').val();
	var rowPerPageCount = 15;
	//세팅
	var m = {
		gridObj : $('#dataGrid'),
		form : {
			formObject : $('form[name=searchForm]')
		},
		button : {
			btnSearch : function (num){
				return 1 == num ? $('#btnBpSearch') : $('#btnSearch');
			},
			btnExcel : $('#btnExcel')
		},
		object : function (num){
			return 1 == num ? $('input[name=pprtDtFrom]').val(m.date(7)) : $('input[name=pprtDtTo]').val(m.date(0));
		},
		date : function (option){
			var currentDate = new Date();
			var optionDate = new Date(Date.parse(currentDate) - option * 1000 * 60 * 60 * 24);
			var optionYear = optionDate.getFullYear();
			var optionMonth = (optionDate.getMonth()+1)>9 ? ''+(optionDate.getMonth()+1) : '0'+(optionDate.getMonth()+1);
			var optionDay = optionDate.getDate() > 9 ? '' + optionDate.getDate() : '0' + optionDate.getDate();
			return optionYear + '-' + optionMonth + '-' + optionDay;
		},
		api : {
			url : 'tango-transmission-biz/transmission/constructprocess/completion/FieldQualityInspectionCurrentState'
		},
		popup:{
			bpNameList : {
				id:'BpCommon',
				title:'시공업체',
				url:'/tango-transmission-web/constructprocess/common/BpCommon.do',
				width:'639',
				height:'802'
			}
		},
		flag : 'list'
	}



    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		initGrid();
		init(param);
        setEventListener();

        /* 시공업체 권한설정 */
        setBpByRole('cnstnBpId', 'cnstnBpNm','btnBpSearch');
    }

    //초기화면
    var init = function (param) {
    	$('input[name=cnstnBpNm]').setEnabled(false);
    	$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});

    	//시공업체 세팅
    	if (undefined != param['cnstnBpNm']) {
    		$('input[name=cnstnBpNm]').val(param['cnstnBpNm']);
    	}

    	setSelectByOrg('dsnBpChrrOrgId', 'select', setSelectByCodeCallBack); //본부

    	//임시코드임
    	var comParamArg = new Array();
    	setSelectByCode('fildInspDivCd','select','C01489', setSelectByCodeCallBack, comParamArg);		//장비구분 코드
    	m.object(0);
    	m.object(1);

    }

    //Grid 초기화
    var initGrid = function () {

        //그리드 생성
        m.gridObj.alopexGrid({
        	autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},
			paging : {
    			hidePageList: true,  // pager 중앙 삭제
    			pagerSelect: false  // 한 화면에 조회되는 Row SelectBox 삭제
    		},
    		columnMapping: [{
    			key : 'engstNo', align:'center',
				title : 'ENG'+msgArray['number'],
				width: '100px'
    		}, {
				key : 'uprDemdBizDivCdNm', align:'center',
				title : msgArray['businessPurpose'],
				width: '100px'
			}, {
				key : 'lowDemdBizDivCd', align:'left',
				title : msgArray['businessDivision'],
				width: '150px'
			}, {
				key : 'cstrNm', align:'left',
				title : msgArray['constructionName'],
				width: '250px'
			}, {
				key : 'cnstnBpNm', align:'center',
				title : msgArray['constructionVendorName'],
				width: '120px'
			}, {
				key : 'inspDivCdNm', align:'center',
				title : msgArray['equipmentDivision'],
				width: '60px'
			}, {
				key : 'frstRegDate', align:'center',
				title : msgArray['inspectionDay'],
				width: '80px'
			}],

			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
        });

    	gridHide();
    }

    // 컬럼 숨기기
    var gridHide = function () {
	}

    var setEventListener = function () {
    	//조회
    	m.button.btnSearch(0).on('click', function (e){
    		if ('' == $('select[name=dsnBpChrrOrgId]').val()) {
    			callMsgBox('btnMsgWarning','W', msgArray['dsnBpChrrOrgId'], btnMsgCallback);
    			return;
    		}

    		if ('' == $('select[name=fildInspDivCd]').val()) {
    			callMsgBox('btnMsgWarning','W', msgArray['inspDivCd'], btnMsgCallback);
    			return;
    		}

    		if ('' == $('input[name=pprtDtFrom]').val()) {
    			callMsgBox('btnMsgWarning','W', msgArray['pprtDtFrom'], btnMsgCallback);
    			return;
    		}

    		if ('' == $('input[name=pprtDtTo]').val()) {
    			callMsgBox('btnMsgWarning','W', msgArray['pprtDtFrom'], btnMsgCallback);
    			return;
    		}

    		if (getPeriod($('input[name=pprtDtFrom]').val(),$('input[name=pprtDtTo]').val(),365)) {
				setGrid(1,rowPerPageCount,'set');
			} else {
				callMsgBox('btnMsgWarning','W', msgArray['engstRegdtm'], btnMsgCallback);
				return;
			}
    	});

    	$('form[name=searchForm]').keypress(function (event) {
    		if (13 == event.keyCode){
    			if ('' == $('select[name=dsnBpChrrOrgId]').val()) {
        			callMsgBox('btnMsgWarning','W', msgArray['dsnBpChrrOrgId'], btnMsgCallback);
        			return;
        		}

        		if ('' == $('select[name=fildInspDivCd]').val()) {
        			callMsgBox('btnMsgWarning','W', msgArray['inspDivCd'], btnMsgCallback);
        			return;
        		}

        		if ('' == $('input[name=pprtDtFrom]').val()) {
        			callMsgBox('btnMsgWarning','W', msgArray['pprtDtFrom'], btnMsgCallback);
        			return;
        		}

        		if ('' == $('input[name=pprtDtTo]').val()) {
        			callMsgBox('btnMsgWarning','W', msgArray['pprtDtFrom'], btnMsgCallback);
        			return;
        		}

        		if (getPeriod($('input[name=pprtDtFrom]').val(),$('input[name=pprtDtTo]').val(),365)) {
    				setGrid(1,rowPerPageCount,'set');
    			} else {
    				callMsgBox('btnMsgWarning','W', msgArray['engstRegdtm'], btnMsgCallback);
    				return;
    			}
    		}
    	});

    	m.gridObj.on('scrollBottom', function(e){
        	var pageInfo = m.gridObj.alopexGrid("pageInfo");

        	// 총건수와 현재 페이지건수가 동일하면 조회 종료
        	if(pageInfo.dataLength != pageInfo.pageDataLength){
        		var rowPerPage = pageInfo.perPage;
        		setGrid(parseInt($('#pageNo').val()) + 1, rowPerPage, 'add');
        	}
    	});

    	//시공업체 조회
    	m.button.btnSearch(1).on('click', function (){
    		var param =  m.form.formObject.getData();
    		openPopup(m.popup.bpNameList.id
					, m.popup.bpNameList.title
					, m.popup.bpNameList.url
					, param.engstNo
					, m.popup.bpNameList.width
					, m.popup.bpNameList.height
					, setDataCallback);
    	});

    	m.button.btnExcel.on('click', function (){


    		$('input[name=fileName]').val("현장품질검사현황"); //엑셀 파일이름
			var param = $('form[name=searchForm]').getData();

			var gridData = $('#dataGrid').alopexGrid('dataGet');
			if(gridData.length == 0){
				callMsgBox('failChk','I', "데이터가 존재하지 않습니다.", btnMsgCallback);
				return;
			}

			param.screenId = "TS0056800";

        	$('body').progress();

        	Tango.ajax({
    			url : 'tango-transmission-biz/transmisson/constructprocess/common/callOnDemandExcelList',
    			data : param,
    			method : 'POST'
    		}).done(function(response){successCallbackPopup(response, 'eqpopenOnDemandExcel');})
    		  .fail(function(response){failCallbackPopup(response, 'eqpopenOnDemandExcel');});





    		/*if (0 == m.gridObj.alopexGrid('pageInfo').pageDataLength) {
    			callMsgBox('btnMsgWarning','W', msgArray['noData'], btnMsgCallback);
    			return;
    		}
    		exportExcel();*/
    	});



		// ***************************
		// OnDemand Excel Function
		// ***************************
		var successCallbackPopup = function(response, flag){

			if(response.returnCode == '200'){

    			var jobInstanceId = response.resultData.jobInstanceId;
    			var fileName =  $('#fileName').val()+"_"+jobInstanceId ;

    			$('body').progress().remove();


    			setTimeout(function(){ // progress 제거 후, 엑셀 다운로드 팝업 출력

    				// 엑셀다운로드팝업 변경
   		         $a.popup({
   		                popid: 'CommonExcelDownlodPop' + jobInstanceId,
   		                title: '엑셀다운로드',
   		                iframe: true,
   		                modal : false,
   		                windowpopup : true,
   		                url: '/tango-transmission-web/constructprocess/common/CommonExcelDownloadPop.do',
   		                data: {
   		                	 jobInstanceId : jobInstanceId
   		                	,fileName : fileName
   		                	,fileType : 'excel'
   		                },
   		                width : 500,
   		                height : 300
   		                ,callback: function(resultCode) {
   		                    if (resultCode == "OK") {
   		                        //$('#btnSearch').click();
   		                    }
   		                }
   		            });


    			},500);

    		}else if(response.returnCode == '500'){
    			$('body').progress().remove();
    			callMsgBox('btnSearch','I', '<spring:message code="error.t.completion.failCmplPicDown"/>', btnMsgCallback);
    		}
		}


		// excel 실행 실패
		var failCallbackPopup = function(response, flag){
			$('body').progress().remove();
	    }





    	$('input[name=cnstnBpId]').on('input propertychange', function () {
    		$('input[name=cnstnBpNm]').val('');
    	});

    	$('input[name=cnstnBpNm]').on('input propertychange', function () {
    		$('input[name=cnstnBpId]').val('');
    	});
    }

    var btnMsgCallback = function (msgId, msgRs) {

    }

    //엑셀다운로드
    var exportExcel = function () {

    	var worker = new ExcelWorker({
    		excelFileName: '현장품질검사현황',
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: 'ExcelExport',
    			$grid: m.gridObj
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

	//request 성공시
    var successCallback = function (response,stats,xhr,flag){
    	var serverPageinfo;

    	if(response.pager != null){
    		serverPageinfo = {
    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	      	};
    	}

    	var data = response.dataList;

    	if(flag == 'set'){
    		m.gridObj.alopexGrid('hideProgress');
    		m.gridObj.alopexGrid('dataSet', $.extend(true, [], data), serverPageinfo);
    	}

    	if(flag == 'add'){
    		m.gridObj.alopexGrid('hideProgress');
    		m.gridObj.alopexGrid('dataAdd', data, serverPageinfo);
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }

    //공통코드 정의
    var setSelectByCodeCallBack = function (response) {
    	if ('dsnBpChrrOrgId' == response) {
    		if ('Z' == loginDeptType) {
        		$('input[name=cnstnBpNm]').attr('disabled',true);
        		$('#btnBpSearch').attr('disabled',true);

        		$.each($('select[name=dsnBpChrrOrgId] option'), function (){
        			if (loginDept == this.value) {
        				$(this).attr('selected','selected');
        			}
        		});

        		$('select[name=dsnBpChrrOrgId]').next().text($('#dsnBpChrrOrgId option:selected').text());
        	}
    	}

    	if ('fildInspDivCd' == response) {
    		$.each($('select[name=fildInspDivCd] option'), function (index){
    			if (1 == index) {
    				$(this).attr('selected','selected');
    			}
    		});

    		$('select[name=fildInspDivCd]').next().text($('#fildInspDivCd option:selected').text());
    	}
    }

    var setDataCallback = function (response) {
    	var data = response;
    	$('input[name=cnstnBpId]').val(data.bpId);
    	$('input[name=cnstnBpNm]').val(data.bpNm);
    }

    //데이터 조회
    var setGrid = function (pageNo, rowPerPage, flag) {
    	$('#pageNo').val(pageNo);
    	var param =  m.form.formObject.getData();
    	param.rowPerPageCnt = rowPerPage;

    	m.gridObj.alopexGrid('showProgress');
    	//ajax 호출

    	if ('' == param.cnstnBpNm) {
    		param.cnstnBpId = '';
    	}

    	model.get({url : m.api.url,data : param,flag : flag}).done(successCallback).fail(failCallback);
    }

    var model = Tango.ajax.init({});

    //팝업 호출
    var openPopup = function(popupId,title,url,data,widthSize,heightSize,callBack){
		$a.popup({
        	popid: popupId,
        	title: title,
            url: url,
            data: data,
            width:widthSize,
            height:heightSize,
            callback: function(data) {
				callBack(data);
           	}
        });
	}
});