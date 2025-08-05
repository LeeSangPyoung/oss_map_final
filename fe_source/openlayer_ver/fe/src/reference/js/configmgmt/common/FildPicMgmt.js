/**
 * FildPicMgmt.js
 *
 * @author Administrator
 * @date 2018. 1. 17.
 * @version 1.0
 */
	var pmtsoId = $("#mtsoId", opener.document).val();
	//, 'engstNo':'0'
	var params = {'mtsoId':pmtsoId};
//	console.log("mtsoId ---> "+pmtsoId); {'mtsoId':pmtsoId}
	var m = {
				ajaxProp : [
					             {  // 사진 DATA 조회
					            	url:'tango-transmission-biz/transmission/configmgmt/common/getFildPhotoInfoList',
					            	data:'',
					            	flag:'getPhotoDataList' // 1
					             }
				            ],
				message        : {},
				label          : {},
				error          : {},
			    userInfo       : {},
			    photoImgData   : []
		};

	var tangoAjaxModel = Tango.ajax.init({});
//	var userId = parent.m.userInfo.userId;
	var userId = $("#userId", opener.document).val()
//	var skAfcoDivCd = parent.m.userInfo.skAfcoDivCd;
//	var bpId = parent.m.userInfo.bpId;

//	var cstrCd = "";
	var jsonData = "";

	// 카테고리 데이터
	var data = [];
	// 사진리스트 데이터
	var photoInfoData = [];
	// 테스트=====================================================
	var filePath = 'http://localhost:8080/tango-transmission-web/resources/images';
	//var filePath = "https://www.nits.skline.co.kr/nits/webdav?mode=get&path=/webdav/SMWORK/";	//파일 URL
	var photoTotalCnt = 0; 			//사진총갯수
	var presentPhotoIndex = 0;       // 현재 사진 인덱스 정보;
	var pw = 0; // 확대사진 가로
	var ph = 0; // 확대사진 세로
	var c = 0; //카운트 초기화
	var fildPicTotalCnt = 0;			// 등록된 현장 사진 총개수

	$a.page(function() {
		var paramData = '';
		var gridId = 'gridData';

//		$('#GisCategoryArea').css({
//			 'width':'200px'
//		    ,'height':'390px'
//		    ,'overflow-y':'scroll'
////		    	,'background-color':'blue'
//		});
		$('#GisPhotoArea').css({
			'width':$("#VerificationRegistrationLineGisMain").width()-$('#GisCategoryArea').width()-20
			,'height':'440px'
//			,'height':'390px'
//				,'background-color':'green'
		});
		$('#PhotoArea').css({
			 'width':'80%'
			 ,'height':'440px'
//			,'height':'390px'
		//	,'background-color':'yellow'
		});
		$('#photoList').css({
			'width':$('#GisPhotoArea').width()-$('#PhotoArea').width()-20
			,'height':'440px'
//			,'height':'390px'
		});


		this.init = function(id, param) {
			paramData = param;
			// 상단 5개파일 preview
			setPhotoInfo(paramData);

			// 하단 5개 그리드 + preview
			initGrid();
			setGrid(paramData);
			setEventListener();
//			console.log("paramData.mtsoId  ===> "+paramData.mtsoId);
	    };

	    // Grid 초기화
	    function initGrid() {

	    	//그리드 생성
	        $('#'+gridId).alopexGrid({
	        	height: 200,
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		paging : {
					pagerTotal: false,
				},
	    		columnMapping: [{
					key : 'orglFileNm', align:'center',
					title : '원본파일명',
					width: '150'
				}, {
					key : 'uladFileNm', align:'center',
					title : '저장파일명',
					width: '150'
				}, {
					key : 'frstRegDate', align : 'center',
					title : '등록일',
					width : '50'
				}, {
					key : 'frstRegUserId', align : 'center',
					title : '등록자',
					width : '50'
				}, {/* 숨김데이터	 */
					key : 'mtsoId', align:'center',
					title : '국사ID',
					width: '120px'
				}, {/* 숨김데이터	 */
					key : 'atflNo', align:'center',
					title : '첨부파일번호',
					width: '50px'
				}],
				message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
	        });

	        gridHide();

	        $('.alopexgrid-pager').remove();

	        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	        // 그리드 데이터 삭제
		    $('#PhotoList').alopexGrid('dataEmpty');

		    // 그리드 생성
			AlopexGrid.define('defineDataGridFild', {
				autoColumnIndex: true,
				autoResize: false,
				width: 200,
				height: 500,
				filteringHeader: false,
				defaultColumnMapping:{
					sorting: false
				},
			    rowOption:{
			    	defaultHeight:100
			    },
				columnMapping : [
				                 { key : 'imgInfo',
				                   render : function(value, data, render, mapping){
				                	   	return '<button type="button" id="'+value+'" width="80" height="50" class="Float-left gisPhotoBigSizeBtn" >'+m.label.expansion+'</button><img class="Float-right miniPhotoGis" id="'+value+'" width="100" height="80" src="'+value+'" ></img>'
				                	   }
				                 }
				],
				data:photoInfoData

			});

		    //그리드 생성
		    $('#PhotoList').alopexGrid({
		    	extend : ['defineDataGridFild']
		    });

		    $('#PhotoList').convert($('button'));
		    $('#PhotoList > button').css('z-index','-1');

			$('#PhotoList').alopexGrid('updateOption',
				{header:false, paging:'', width: "150px"}
			);

			// 사진리스트 출력후 메인사진 출력
			presentPhotoIndex = 0;

			$('.gisPhotoBigSizeBtn').css('top','30px');
	    };

	    // request 성공시
	    function successCallback(response, status, jqxhr, flag, responseJSON){
	    	if(flag == 'search'){
	    		$('#'+gridId).alopexGrid('hideProgress');
	    		$('#'+gridId).alopexGrid('dataSet', response.fildPicList);
	    		fildPicTotalCnt = response.fildPicList.length;
//	    		console.log("search ==> "+response.fildPicList.length);

	    	} else if(flag == 'uploadFile'){
	    		if(response.Result == "Success"){
	    			//저장을 완료 하였습니다.
	    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
	    				if(msgRst == 'Y'){
	    					$('#fildPicImg').attr("src", '');
	    					a.close(response);
	    				}
	    			});
	    		} else if( response.Result == "Fail"){
	    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
	    		}

	    		setGrid(paramData);
	    		$('#picName').val('');
	        	$('#uploadFile').val('');

	        	// 상단 5개파일 preview
				setPhotoInfo(paramData);

	    	} else if(flag == 'deleteFile'){
	    		if(response.Result == "Success"){
	    			//삭제를 완료 하였습니다.
	    			callMsgBox('','I', configMsgArray['delSuccess'] , function(msgId, msgRst){
	    				if(msgRst == 'Y'){
//	    					$('#'+gridId).alopexGrid("rowSelect",{_index:{data:0}},true);
        					$('#fildPicImg').attr("src", '');
	    					if(msgRst == 'Y'){
	        					a.close(response);
	        				}
	    				}
	    			});
	    		} else if( response.Result == "Fail"){
	    			callMsgBox('','I', configMsgArray['delFail'] , function(msgId, msgRst){});
	    		}

	    		setGrid(paramData);
	    		$('#picName').val('');
	        	$('#uploadFile').val('');

	        	// 상단 5개파일 preview
				setPhotoInfo(paramData);

	    	} else if(flag == 'getPhotoDataList'){
		   		parent.parent.$('body').progress().remove();
	    		if(response.FildPhotoInfoList != undefined && response.FildPhotoInfoList != null ){
	    			console.log("response.FildPhotoInfoList.img ===> "+response.FildPhotoInfoList.img);
	    			m.photoImgData = response.FildPhotoInfoList.fileData;
	        		createPhoto();
	    		}

	    	} else if(flag == 'photoInfo'){
				if (response.FildPhotoInfoList != null && response.FildPhotoInfoList != "" ) {
					photoInfoData = response.FildPhotoInfoList;
					photoTotalCnt = photoInfoData.length;
					console.log("photoTotalCnt ===> "+photoTotalCnt);
					m.photoImgData = [];

					for(var i=0;i<photoInfoData.length;i++){
	//					console.log("atflNo "+i+" : "+photoInfoData[i].atflNo);
						if (photoInfoData[i].atflNo != null && photoInfoData[i].atflNo != '' && photoInfoData[i].atflNo != undefined){
//							m.photoImgData.push(photoInfoData[i].atflNo);
//							console.log("photoInfoData[i].fileData ===> "+photoInfoData[i].fileData);
							m.photoImgData.push(photoInfoData[i].fileData);
						} else {
							m.photoImgData.push("40000302"); // 테스트용
						}
					}

//					callTangoAjax(1); // 사진 데이터 조회
					createPhoto();
				}else{
					$('#PhotoArea').empty();
					$('#PhotoList').empty();
				}
	    	}

	    }

	    // request 실패시.
	    function failCallback(response, flag){
	    	if(flag == 'search'){
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});

	    	} else if (flag == 'uploadFile') {
	    		alertBox('W', "파일 업로드에 실패했습니다.");
				return false;

	    	} else if (flag == 'getPhotoDataList'){
	    		console.log(response);
	        	parent.parent.callMsgBox('','W', "사진이 존재하지 않습니다.");

	    	} else if (flag == 'photoInfo') {
	    		callMsgBox('','I', '조회 실패 하였습니다.');

	    	} else {
	    		console.log("flag ===> "+flag);
	        	parent.parent.callMsgBox('','W', response.message);
	    	}

	    }

	    // 컬럼 숨기기
	    function gridHide() {

	    	var hideColList = ['mtsoId', 'atflNo'];
	    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
		}


	    // event 등록
	    function setEventListener() {

	    	// 닫기
	        $('#cnclBtn').on('click', function(e) {
	        	$a.close();
	        });

	        $('#btnUpload').on('click', function(e) {
	    		//등록한 파일이 5개 이하인 경우만 작업
		    	if (fildPicTotalCnt < 5) {
		    		var uploadForm  = $('#uploadForm')[0];
		    		uploadForm.reset();
		    		$('#uploadFile').click();
		    	} else {
		    		callMsgBox('','W', "현장사진은 5개까지만 등록 가능합니다.");
		    	}
	        });

	        $('#uploadFile').on('change',function(e) {

	        	var file = e.target;
	        	var fileList = file.files;

	    		var reader = new FileReader();
	    		reader.readAsDataURL(fileList[0]);

	    		reader.onload = function(){
	    			$('#fildPicImg').prop('src',reader.result);
	    		}
	    		$('#picName').val(fileList[0].name);
	    		//img.css({top: '2px', width: '155px', height: '129px'});
	        	//showRealPic(e);
	        });
	        
	        $('#'+gridId).on('dataSelect', function(e) {
	        	var data = AlopexGrid.parseEvent(e).datalist[0];
	        	$('#fildPicImg').prop('src','/tango-transmission-biz/transmission/configmgmt/common/viewFildImage?img='+data.uladFileNm+'&url='+data.mtsoId);
	        	$('#picName').val(data.orglFileNm);
	        	$('#uploadFile').val('');
	        	//img.css({top: '2px', width: '155px', height: '129px'});
	        });

	        $('#regBtn').on('click', function(e) {
	        	var fileChk = $("#uploadFile").val();
	    		if (fileChk == null || fileChk == "") {
					alertBox('W', "업로드할 파일을 선택해 주세요");
					return;
				}
	    		/*
	    		var fileExtensionChk = fileChk.toLowerCase();
				if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
					alertBox('W', "확장자가 xlsx혹은 xls만 가능합니다.");
					return;
				}
				*/
	    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
	    			//저장한다고 하였을 경우
	 		        if (msgRst == 'Y') {
	 		        	$('#mtsoId').val(paramData.mtsoId);

	 		        	var form = $('#uploadForm')[0];
	 		        	var data = new FormData(form);

	 		        	httpRequestUpload('tango-transmission-biz/transmission/configmgmt/common/fildPicFileUpload', data, 'post', 'uploadFile');
	 		        }
			     });
	        });

	        //삭제
	        $('#delBtn').on('click', function(e) {
	        	var data = $('#'+gridId).alopexGrid("dataGet", {_state: { selected: true}})[0]
	        	var param = JSON.stringify(AlopexGrid.trimData(data));
	        	if(data == null || data == ""){
	        		alertBox('W', "삭제할 파일을 선택해 주세요");
					return;
	        	}
	        	callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
	        		//삭제한다고 하였을 경우
	        		if (msgRst == 'Y') {
	        			httpRequest('tango-transmission-biz/transmission/configmgmt/common/deleteFildPicFile', param, 'post', 'deleteFile');
	        		}
	        	});
	        });


	        // 그리드-사진리스트에서 사진 클릭시 메인사진 변경
	 	  	$('#PhotoList').on('click', '.img_box', function(e,node){
	 	  		// 메인사진 변경
		  		$('.Carousel').setIndex($('#PhotoList').find(this).index());
	 		});

	     	// 그리드-사진리스트에서 '확대'클릭시 팝업 출력
	 	  	$('#PhotoList').on('click','.photoBigSizeBtn', function(e,node){

		    	parent.$a.popup({
		    		popid: 'LargePic' // 중복클릭방지 id 필요
		            ,title : m.label.expansionPicture // '확대사진'
		            ,url : '/tango-transmission-web/configmgmt/common/FildPicMgmtLargePic.do'
			        ,iframe: false
			        ,windowpopup: true
		            ,width : 800
		            ,height : 600
		            ,data : {'picUrl':this.id}
	    			,other: 'location=1'
		            ,callback : function(x){
		            				if(x=="ok"){
		            					location.reload(true);
		            				}
		            			}
		        });
	 		});

		};

		// 작업사진 생성
	    function createPhoto(){
	    	// Carousel 슬라이드쇼
	    	setCarousel();

	    	// Photo Info List
	    	setPhotoList();
	    }

	    // 슬라이드쇼 셋팅
	    function setCarousel(){

	    	$('#PhotoArea > div').remove();

	    	$('#PhotoArea').append(
	    			 '<div id="GisMainPhotoArea" class="Carousel" data-autoSlidemode="false">'
	    			+'<div id="GisMainPhotoScroller" class="Scroller">'
	    			+'</div>'
	    			+'<a class="Prev"></a>'
	    			+'<a class="Next"></a>'
	    			+'<div id="GisMainPhotoPaging" class="Paging Mobile">'
	    			+'</div>'
	    			+'</div>'
	    	);

	    	for(i=0 ; i<photoInfoData.length; i++ ){
	        	$('#GisMainPhotoScroller').append(
					 '<div class="Page">'
					+'<img style="width:100%; height:100%;" src="data:image/png;base64,'
					+m.photoImgData[i]
					+'"/>'
					+'</div>'
	        	);
	    	}

	    	for(i=1 ; i<=photoInfoData.length; i++ ){
	        	$('#GisMainPhotoPaging').append(
					 '<a class="Link" >'
					+i
					+'</a>'
	        	);
	    	}

	    	$('.Carousel').css({'margin':'auto','width':'600px','height':$('#PhotoArea').height()});
	    	$a.convert($('#PhotoArea')); // 'Carousel' 부모 컨버트~~~

	    }

	    function setPhotoList(){

	    	$('#PhotoList > div').remove();

	    	for(i=0;i<photoInfoData.length;i++){

	    		$('#PhotoList').append(
	   				 '<div id="'
						+ 'img_box'+i
						+ '" class="img_box" style="background-image:url(data:image/png;base64,'+m.photoImgData[i]+');background-repeat:no repeat;background-size:100% 100%">'
	   				+'<button type="button" id="'
	   				+m.photoImgData[i]
	   				+'" width="80" height="50" class="Button button2 Float-left photoBigSizeBtn" >'+parent.m.label.expansion+'</button>'
	   				+'</div>'
	   		);

	    		$a.convert($('#img_box'+i));
	    	}

	    	$('#photoList').css({
		   		 'height'    : '100%'
		   		,'overflow-x':'hidden'
		   		,'overflow-y':'scroll'
	    	});

	    	$('.img_box').css({
		         'width'     : '150px'
		        ,'height'    : '100px'
			    ,'margin-top': '0px'
				,'margin-bottom': '0px'
				,'padding-top' : '0px'
				,'padding-bottom' : '0px'
	    	});

	    	$('.photo_img').css({
	    		'width'     : '100%'
	    	   ,'height'    : '100%'
	    	});

	    	$('.photoBigSizeBtn').css({
	    	});
	    }

	    // 상단 5개 사진정보 조회
	    function setPhotoInfo(param){
	    	var Flag = 'photoInfo';
	        Tango.ajax({ url : 'tango-transmission-biz/transmission/configmgmt/common/getFildPhotoInfoList'
	                   , data : param
	                   , method : 'GET'
	     	           , flag: Flag
	    	 }).done(successCallback)
			  .fail(failCallback);
//	        .done(function(response){successCallback(response, Flag);})
//	    	 .fail(function(response){failCallback(response, Flag);});

//	        httpRequest('tango-transmission-biz/transmisson/configmgmt/common/getFildPhotoInfoList', param, 'GET', flag)
	    }


		function setGrid(param){
			$('#'+gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmission/configmgmt/common/getFildPic', param, 'GET', 'search')
		}

	    // AJAX GET, POST, PUT
	    function callTangoAjax(i){
//	    	console.log(params.cstrCd);

	    	var url = m.ajaxProp[i].url;
	    	if (i==0) {
//	    		m.ajaxProp[i].url = url+'/'+params.cstrCd;
	    	} else if (i==1) {
	    		m.ajaxProp[i].url = url+'/'+m.photoImgData;
	    	}
	    	m.ajaxProp[i].data = params;

	    	console.log(m.ajaxProp[i].url);

	    		if (i == 0) { tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); }  // Search Cbnt Grid
	    		else if (i == 1) { tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // getPhotoData
	    	m.ajaxProp[i].url = url;

	    }

		var httpRequest = function(Url, Param, Method, Flag) {
	    	Tango.ajax({
	    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
	    		data : Param, //data가 존재할 경우 주입
	    		method : Method, //HTTP Method
	    		flag : Flag
	    	}).done(successCallback)
			  .fail(failCallback);
	    }

		var httpRequestUpload = function(url,data,method,flag) {
	    	Tango.ajax({
	    		url : url,
	    		data : data,
	    		method : method,
		    	dataType:'json',
		    	cache: false,
		    	contentType:false,
	            processData:false,
	            flag : flag
	    	}).done(successCallback)
	  	  .fail(failCallback)
		}

	});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//$a.page(function() {
//
//	var paramData = null;
//
//    //초기 진입점
//    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
//    this.init = function(id, param) {
//    	paramData = param;
//    	setEventListener();
////    	parent.parent.$('body').progress();
//    };
//
//	//Grid 초기화
//	function initGrid() {
//	};
//
//	// 이벤트
//    function setEventListener() {
//
//	    $('#fileSelect').on('click', function(e) {
//	    	//등록한 파일이 5개 이하인 경우만 작업
//	    	uploadFildPicCount = 1;
//	    	if (uploadFildPicCount < 5) {
//	    		var uploadForm  = $('#uploadForm')[0];
//	    		uploadForm.reset();
//	    		$('#uploadFile').click();
//	    	}
//
//        });
//
//    	$('#uploadFile').on('change', function(e) {
//    		$("#textFileNm").text(this.value);
//    	});
//
//    	$('#btnSave').on('click', function(e) {
//
//    		var fileChk = $("#uploadFile").val();
//    		if (fileChk == null || fileChk == "") {
//				alertBox('W', "업로드할 파일을 선택해 주세요");
//				return;
//			}
//    		/*
//    		var fileExtensionChk = fileChk.toLowerCase();
//			if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
//				alertBox('W', "확장자가 xlsx혹은 xls만 가능합니다.");
//				return;
//			}
//			*/
//    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
//    			//저장한다고 하였을 경우
// 		        if (msgRst == 'Y') {
// 		        	$('#mtsoId').val(paramData.mtsoId);
//
// 		        	var form = $('#uploadForm')[0];
// 		        	var data = new FormData(form);
//
// 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/fildPicFileUpload', data, 'post', 'uploadFile');
// 		        }
//		     });
//
//    	});
//
//    	$('#btnCncl').on('click', function(e) {
//    		$a.close();
//    	});
//
//
//	  	var main_photo_cnt = 0;
//
//	  	$('.gisTextinput').setEnabled(true);  // true
//
//    	 // 저장버튼 클릭시
//     	 $('#FildSaveBtn').on('click',function(){
//
//     		if(cstrCd == null || cstrCd == ""){
//     			return false;
//     		}
//
//     		if($('.Radio').getValue() == null){
//     			parent.parent.callMsgBox('','I', parent.m.message.choiceVerificationResult); // 검증결과를 선택해주세요
//     		}else{
//     			callTangoAjax(0);
//     		}
//     	 });
//
//
//
//    }
//
//	//request 성공시
//    function successCallback(response, flag){
//
//		switch (flag) {
//		case 'uploadFile':
//			$a.close();
//			break;
//		case 'opinionMerge':
//			parent.parent.callMsgBox('','I', m.message.savesuccess);
//			break;
//		case 'photoInfo':
//			if (response.FildPhotoInfoList != null &&
//               response.FildPhotoInfoList != "" ) {
//				photoInfoData = response.FildPhotoInfoList;
//				photoTotalCnt = photoInfoData.length;
//
//				m.photoImgData = [];
//
//				for(var i=0;i<photoInfoData.length;i++){
////					console.log("workPicFileUladSrno "+i+" : "+photoInfoData[i].workPicFileUladSrno);
//					if (photoInfoData[i].workPicFileUladSrno != null && photoInfoData[i].workPicFileUladSrno != '' && photoInfoData[i].workPicFileUladSrno != undefined){
//						m.photoImgData.push(photoInfoData[i].workPicFileUladSrno);
//					} else {
//						m.photoImgData.push("40000302"); // 테스트용
//					}
//				}
//
////				console.log("사진 키 길이 : "+ m.photoImgData.length);
////				console.log(m.photoImgData);
//
//				callTangoAjax(1); // 사진 데이터 조회
//			}
//			break;
//		}
//
//	}
//
    //request 성공시
	function successFn(response, status, jqxhr, flag){
		console.log("flag : "+ flag);
		switch (flag) {
    	case 'getPhotoDataList':

	   		parent.parent.$('body').progress().remove();

    		if(response.FildPhotoInfoList != undefined && response.FildPhotoInfoList != null ){
    			m.photoImgData = response.FildPhotoInfoList.fileData;
        		createPhoto();
    		}

    		break;
		}
    }

//	//request 실패시.
//    var failCallback = function (response, flag){
//
//    	parent.parent.$('body').progress().remove();
//    	if (flag == 'uploadFile') {
//    		alertBox('W', "파일 업로드에 실패했습니다.");
//			return false;
//    	} else if (flag == 'getPhotoDataList'){
//    		console.log(response);
//        	parent.parent.callMsgBox('','W', "사진이 존재하지 않습니다.");
//    	} else {
//        	parent.parent.callMsgBox('','W', response.message);
//    	}
//    }
//
    function failFn(response, status, jqxhr, flag){
    	switch (flag) {
		case 'BpCommentChk':
			parent.parent.callMsgBox('','W', parent.m.message.searchFail);
    		break;
		}
    }
//
//
//
//
//    function messageCallback(id,result){
//
//    	switch (id) {
//		case "save":
//			if(result == "Y"){
//				var flag = 'opinionMerge';
//				// 검증등록-ETE 검증의견 저장,수정
//	        	Tango.ajax({ url : 'tango-transmission-biz/transmission/constructprocess/verification/insertVerificationRegistrationLineGisOpinion/'+params.cstrCd+'/'+params.lnVrfClCd+'?method=put'
//	  	                   , data : params
//	                       , method : 'POST'
//	            	       , flag: flag
//	  			 })
//	  			 .done(function(response){successCallback(response, flag);})
//				 .fail(function(response){failCallback(response, flag);});
//			}
//			break;
//		case "BpCommentChk":
//			if(result == "Y"){
//				parent.location.reload(true);
//			}
//			break;
//		}
//    };
//
//	var httpRequest = function(surl, sdata, smethod, sflag) {
//    	Tango.ajax({
//    		url : surl,
//    		data : sdata,
//    		method : smethod,
//	    	dataType:'json',
//	    	cache: false,
//	    	contentType:false,
//            processData:false
//    	}).done(function(response){successCallback(response, sflag);})
//    	  .fail(function(response){failCallback(response, sflag);})
//	}
//
//});