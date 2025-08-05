/**
 * FieldQualityInspectionDetails.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
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
		callMsgBox('returnMessage','W', response , btnMsgCallback);
	}
});

$a.page(function() {
	var gridNum = 2;
	var grid = 'list';

	var m = {
		gridObj : function (num){
			return 1 == num ? $('#dataFileGrid') : $('#dataGrid');
		},
		form    : {
			formObject : $('form[name=searchForm]')
		},
		button  : {
			btnCompletion : $('#btnCompletion'), //준공사진
			btnClose      : $('#btnClose')       //닫기
		},
		api : {
			url : function (num){
				var url = 'tango-transmission-biz/transmission/constructprocess/completion/';
				return 1 == num ? url += 'fieldQualityInspectionDetailsFile' : url += 'fieldQualityInspectionDetails';
			}
		},
		flag : function (num){
			return 1 == num ? 'file' : 'list';
		},
		gridColum : function (num){
			switch (num) {
			case 1 : return columnMapping = [{
				align: 'center',
 				key : 'inspImgFileUladSrno',
 				title : msgArray['fileSequence'],
 				width : '50px'
 			}, {
 				align : 'center',
 				key : 'inspByItmImgNm',
 				title : msgArray['fileName'],
 				width : '250px',
 			}];
				break;
			default : return columnMapping = [{
				align: 'center',
 				key : 'inspItmNo',
 				title : msgArray['sequence'],
 				width : '50px'
 			}, {
 				align : 'left',
 				key : 'inspItmNm',
 				title : msgArray['inspectionItem'],
 				render : function ( value, data, render, mapping, grid ) {
 					return value.replace(/\n/g,'<br>');
 					//var checkHtml = [];
 					//checkHtml.push("<div>"+String(value).replace('\n','<br>')+"</div>");
 					//return checkHtml.join("");
				},
 				width : '250px',
 			}, {
 				align : 'center',
 				key : 'inspLclVal',
 				title : msgArray['inspectionValue'],
 				width : '100px'
 			}, {
 				align : 'center',
 				key : 'imptMtrCtt',
 				title : msgArray['specialMatters'],
 				width : '100px'
 			}, {
 				align : 'center',
 				key : 'frstRegDate',
 				title : msgArray['inspectionDay'],
 				render : function ( value, data, render, mapping, grid ) { if(value != null) return setDateFormat(value); },
 				width : '100px'
 			}, {
 				align : 'center',
 				key : 'insId',
 				title : msgArray['inspectionPerson'],
 				width : '100px'
 			}, {
 				align : 'center',
 				key : 'fildInspDivCd',
 				width : '100px',
 				hidden : true
 			}, {
 				align : 'center',
 				key : 'fildQltInspLclCd',
 				width : '100px',
 				hidden : true
 			}];
				break;
			}
		},
		popup:{
			completionPhoto : {
				id:'CmplDocCreatePic',
				title:msgArray['fieldQualityInspectionDeatailsCompletionPicture'],
				url:'/tango-transmission-web/constructprocess/completion/CmplDocCreatePic.do',
				width:'950',
				height:'728'
			}
		},
	}

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		initGrid();
		init(param);
    	setGrid();
        setEventListener();
    }

    //초기화면
    var init = function (param) {
    	//변수명과 파라미터의 값이 동일해함
    	$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});
    }

    //Grid 초기화
    var initGrid = function () {
    	AlopexGrid.setup({
    		autoColumnIndex: true,
    		autoResize: true,
    		rowSingleSelect: true,
    		rowClickSelect: true,
    		rowOption : {defaultHeight : "content"},
    		defaultColumnMapping:{
    			sorting: true
			},
			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
    	});

    	for (var i=0; i<gridNum;i++) {
            //그리드 생성
        	m.gridObj(i).alopexGrid({
        		columnMapping : m.gridColum(i)
            });
        	if(i == 1){
        		m.gridObj(i).alopexGrid('updateOption',{height: '3row'});
        	}else{
        		m.gridObj(i).alopexGrid('updateOption',{height: '6row'});
        	}
    	}

    	gridHide();
    }

    // 컬럼 숨기기
    var gridHide = function () {
	}

    var inlineEdit = function (number) {
    	return 0 == number ? false : true;
    }

    var setEventListener = function () {
    	//준공사진 팝업 호출
    	m.button.btnCompletion.on('click', function (){
    		var param =  m.form.formObject.getData();
    		var paramArry = {}
    		paramArry.cstrCd = param.engstNo;
    		openPopup(m.popup.completionPhoto.id
					, m.popup.completionPhoto.title
					, m.popup.completionPhoto.url
					, paramArry
					, m.popup.completionPhoto.width
					, m.popup.completionPhoto.height
					, null);
    	});

    	//팝업닫기
    	m.button.btnClose.on('click', function (){
    		$a.close();
    	});

    	//파일 조회
    	m.gridObj(0).on('dataSelectEnd', function (e){
    		var event = AlopexGrid.parseEvent(e);
    		var param = event.datalist[0];

    		$.each(m.form.formObject.children(), function (){
        		var name = $(this).attr('name');
        		if (undefined != param[name]) {
        			$(this).val(param[name]);
        		}
        	});
    		setGrid();
    	});

    	//점검항목별 현장사진 조회
    	m.gridObj(1).on('dblclick','.bodycell', function(e){

    		var event = AlopexGrid.parseEvent(e);
    		console.log(event.data);
    		//파일에 키 없음, 나중에 순번을 키로 교체해주어야 함
    		var key = event.data.inspImgFileUladSrno;
    		if($.TcpUtils.isEmpty(key) == true){
      			callMsgBox('failChk','I', "이미지가 존재하지 않습니다.");
      			return;
      		}
    		$a.popup({
 		        popid: 'picbig',
 		        title: '이미지상세',
 		           url: '/tango-transmission-web/constructprocess/completion/FieldPicBig.do',
 		         //이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
 		           data: {'fileUladSrno' : key},
 		           windowpopup : true,
 		           modal: true,
 	               movable:true,
 		           width: 763,
 		           height: 558,
 		           callback: function(data) {
 	              }
 		       });
    		/*if ('' != key) {
    			var fileKey = '297837';
    			fileAdd.getUploadData(fileKey); //나중에 Key로 대체
    		}*/
    	});
    }

	//request 성공시
    var successCallback = function (response,state,xhr,flag){
    	var data = response.dataList;
    	var number = 'list' == grid ? 0 : 1;
    	m.gridObj(number).alopexGrid('hideProgress');

    	m.gridObj(number).alopexGrid('dataSet', data);
		if ('list' == flag) {
			grid = 'file';
			if (1 == data.length) {
				$.each(m.form.formObject.children(), function (){
	        		var name = $(this).attr('name');
	        		if (undefined != data[0][name]) {
	        			$(this).val(data[0][name]);
	        		}
	        	});
    			setGrid();
    		}
		}
    }

    var successFileCallback = function (response,state,xhr,flag){
    }
    //request 실패시.
    var failCallback = function (response, flag){
    }

    //그리드에 추가
    var setDataCallback = function (response) {
    }

    //데이터 조회
    var setGrid = function (page, rowPerPage) {
    	var param =  m.form.formObject.getData();
    	var number = 'list' == grid ? 0 : 1;
    	m.gridObj(number).alopexGrid('showProgress');

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
            windowpopup : true,
            callback: function(data) {
				callBack(data);
           	}
        });
	}
});