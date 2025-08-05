/**
 * BigDataRequest.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var btnExcel = $a.page(function() {

	this.popup = function (pgmId) {
		var data = {
			'pgmId' : pgmId,
			'skAfcoDivCd' : $('input[name=skAfcoDivCd]').val().substring($('input[name=skAfcoDivCd]').val().length-1, $('input[name=skAfcoDivCd]').val().length)
		}

		openPopup('BigDataRequestPop'
				, msgArray['RequestBigDataPop']
				, 'BigDataRequestPop.do'
				, data
				, '1000'
				, '250'
				, setDataCallback);
	}

	var openPopup = function (popupId,title,url,data,widthSize,heightSize,callBack) {
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

	var setDataCallback = function (response) {
		if ('200' == response) {
			setGrid();
		}
	}

	 //데이터 조회
    var setGrid = function () {
    	var param =  $('form[name=searchForm]').getData();
    	$('#detailGrid').alopexGrid('showProgress');

    	param.skAfcoDivCd = param.skAfcoDivCd.substring(param.skAfcoDivCd.length-1, param.skAfcoDivCd.length);

    	//ajax 호출
    	model.get({
    		url  : 'tango-transmission-biz/transmission/constructprocess/process/bigDataRequestDetail',
    		data : param,
    		flag : 'getListDetail'
    	}).done(successCallback)
		.fail(failCallback);
    }

    var model = Tango.ajax.init({});

  //request 성공시
    var successCallback = function (response,stats,xhr,flag){
    	if ('getListDetail' == flag) {
    		var dataList = response.dataList;
    		$('#detailGrid').alopexGrid('hideProgress');
    		$('#detailGrid').alopexGrid('dataSet', dataList);
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }

});

var fileAdd = $a.page(function() {
	this.DEXT5UPLOAD_OnCreationComplete = function (uploadID) {
		//console.log('업로드 생성');
	}

	this.getUploadData = function (fileKey) {
		var model = Tango.ajax.init({
		    url : 'tango-common-business-biz/dext/files/'+fileKey, // url
		});
		model.get().done(successCallBack).fail(failCallBack);
	}

	var successCallBack = function (response, status, jqxhr, flag) {
		DEXT5UPLOAD.ResetUpload("dext5download");

		// 다운로드 파일 셋팅
		DEXT5UPLOAD.AddUploadedFile(
				  response.fileUladSrno
				 ,response.uladFileNm
				 ,response.uladFilePathNm
				 , response.uladFileSz
				 ,response.fileUladSrno
				 ,"dext5download"
				 );

//		DEXT5UPLOAD.DownloadFile("dext5download"); //개별파일 < ---안 먹힘!@@@@

		DEXT5UPLOAD.DownloadAllFile("dext5download"); //모든파일
	}

	var failCallBack = function (response, flag) {
		console.log(response);
	}
});

$a.page(function() {
	var gridNum = 2;

	//세팅
	var m = {
		gridObj : function (num){
			return 0 == num ? $('#dataGrid') : $('#detailGrid');
		},
		form : {
			formObject : $('form[name=searchForm]')
		},
		object : function (num){
			return 0 == num ? $('input[name=pprtDtFrom]').val(m.date(0)) : $('input[name=pprtDtTo]').val(m.date(0));
		},
		date : function (option){
			var currentDate = new Date();
			var optionDate = new Date(Date.parse(currentDate) - option * 1000 * 60 * 60 * 24);
			var optionYear = optionDate.getFullYear();
			var optionMonth = (optionDate.getMonth()+1)>9 ? ''+(optionDate.getMonth()+1) : '0'+(optionDate.getMonth()+1);
			var optionDay = optionDate.getDate() > 9 ? '' + optionDate.getDate() : '0' + optionDate.getDate();
			return optionYear + '-' + optionMonth + '-' + optionDay;
		},
		gridColum : function (num){
			switch (num) {
			default    : return columnMapping = [{
    			key : 'rnum', align:'center',
				title : msgArray['sequence'],
				width: '70px'
    		}, {
				key : 'bigCapaBatPgmNm', align:'left',
				title : msgArray['requestDivisionName'],
				width: '100px'
			}, {
				key : 'bigCapaBatPgmDesc', align:'left',
				title : msgArray['remark'],
				width: '300px'
			}, {
				key : 'bigCapaBatPgmId', align:'center',
				title : msgArray['excelDownload'],
				width: '70px',
				editable : false,
				render : function (value, data, render, mapping, grid) {
					var html = "<button type='button' onclick=\"btnExcel.popup('"+value+"');\" class='Button button2 color_green'><span class='ico ico_down_green'></span>EXCEL</button>";
					return html;
				}
			}];
				break;
			case 1   : return columnMapping = [{
    			key : 'bigCapaBatReqDtm', align:'center',
				title : msgArray['requestDateTime'],
				width: '70px'
    		}, {
				key : 'batProcStatCdNm', align:'center',
				title : msgArray['processStatus'],
				width: '100px'
			}, {
				key : 'bigCapaBatProcFnshDtm', align:'center',
				title : msgArray['processFinishDateTime'],
				width: '70px'
			}, {
				key : 'bigCapaBatPgmNm', align:'center',
				title : msgArray['requestDivision'],
				width: '70px'
			},{
    			key : 'bigCapaBatRsltFileNm', align:'center',
				title : msgArray['fileName'],
				width: '70px'
    		}, {
				key : 'bigCapaBatProcNum', align:'center',
				title : msgArray['dataNumberOfCases'],
				width: '100px'
			}, {
				key : 'bigCapaBatRsltFileDwldYn', align:'center',
				title : msgArray['download'],
				width: '70px'
			}, {
				key : 'bigCapaBatRsltFileDelYn', align:'center',
				title : msgArray['fileDelete'],
				width: '70px'
			}];
				break;
			}
		},
		api : {
			url : function (num){
				var url = 'tango-transmission-biz/transmission/constructprocess/process/';
				switch(num) {
				case 1  : return url+'bigDataRequestDetail'; break;
				default : return url+'bigDataRequest'; break;
				}
			}
		},
		flag : function (num) {
			switch(num) {
			case 1 : return 'getListDetail'; break;
			case 2 : return 'editListDetail'; break;
			default : return 'getList'; break;
			}
		},
		status : 'getList',
		popup:{
			id:'BigDataRequestPopup',
			title:msgArray['RequestBigDataPop'],
			url:'BigDataRequestPopup.do',
			width:'639',
			height:'802'
		}
	}

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		init(param);
		initGrid();
    	setGrid(0);
        setEventListener();
    }

    //초기화면
    var init = function (param) {

    	$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});

    	m.object(0);
    	m.object(1);

    }

    //Grid 초기화
    var initGrid = function () {
    	AlopexGrid.setup({
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},
			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
    	});

    	for (var i=0; i<gridNum;i++) {
        	m.gridObj(i).alopexGrid({
        		columnMapping : m.gridColum(i)
            });

        	m.gridObj(i).alopexGrid('updateOption',{height: '5row'});
    	}
    }

    var putData = {};

    var setEventListener = function () {
    	$('#btnSearch').on('click', function () {
    		$('input[name=bigCapaBatPgmId]').val('');
    		setGrid(0);
    	});

    	$('form[name=searchForm]').keypress(function (event) {
    		if (13 == event.keyCode){
    			$('input[name=bigCapaBatPgmId]').val('');
        		setGrid(0);
    		}
    	});

    	m.gridObj(0).on('click','.bodycell', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		$('input[name=bigCapaBatPgmId]').val(event.data.bigCapaBatPgmId);
    		setGrid(1);
    	});

    	m.gridObj(1).on('dblclick','.bodycell', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		if ('4' == event.data._column) {
    			if (undefined != event.data.bigCapaBatRsltFileDelYn) {
    				if ('Y' == event.data.bigCapaBatRsltFileDelYn) {
    					callMsgBox('notFound','W', msgArray['deletedFile'], btnMsgCallback);
    					return;
    				}
    			}

    			//완료
    			if ('E' == event.data.batProcStatCd) {
    				putData = event.data;
    				callMsgBox('fileDownload','C', msgArray['selectedFile']+'('+event.data.bigCapaBatRsltFileNm+')'+msgArray['atDownload'], btnMsgCallback);
    			} else {
    				callMsgBox('statusCheck','W', msgArray['statusFinishedDownload'], btnMsgCallback);
					return;
    			}
    		}
    	});
    }

    //엑셀다운로드
    var exportExcel = function () {
    	var worker = new ExcelWorker({
    		excelFileName: '',
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
    	if ('getList' == flag) {
    		var dataList = response.dataList;
    		m.gridObj(0).alopexGrid('hideProgress');
    		m.gridObj(0).alopexGrid('dataSet', dataList);
    		setGrid(1);
    	}

    	if ('getListDetail' == flag) {
    		var dataList = response.dataList;
    		m.gridObj(1).alopexGrid('hideProgress');
    		m.gridObj(1).alopexGrid('dataSet', dataList);
    	}

    	if ('editListDetail' == flag) {
    		var fileKey = '298389';
			fileAdd.getUploadData(fileKey);
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    }

    //그리드에 추가
    var setDataCallback = function (response) {
    }

    var btnMsgCallback = function (msgId, msgRst) {
    	if ('Y' == msgRst) {
    		if ('fileDownload' == msgId) {
    			var data = putData;
    			putData = {};

    			var param = {
    				'bigCapaBatReqSrno' : data.bigCapaBatReqSrno
    			};

    			model.put({
    	    		url  : m.api.url(1),
    	    		data : param,
    	    		flag : m.flag(2)
    	    	}).done(successCallback)
    			.fail(failCallback);
    		}
    	} else {
    		if ('fileDownload' == msgId) {
    			putData = {};
    		}
    	}
    }

    //데이터 조회
    var setGrid = function (number) {
    	var param =  m.form.formObject.getData();
    	m.gridObj(number).alopexGrid('showProgress');

    	param.skAfcoDivCd = param.skAfcoDivCd.substring(param.skAfcoDivCd.length-1, param.skAfcoDivCd.length);

    	//ajax 호출
    	model.get({
    		url  : m.api.url(number),
    		data : param,
    		flag : m.flag(number)
    	}).done(successCallback)
		.fail(failCallback);
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