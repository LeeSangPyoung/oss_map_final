/**
 * SmartTakeoverPaperCreationOpticalLanCompletionPhoto.js
 * Smart인수인계광랜_서류생성_준공사진
 * @author P096430
 * @date 2016. 08. 30. 오후 03:52:00
 * @version 1.0
 */


    	/* ********************************************************************* */
    	/*   < 미완료 작업 >                                                     */
    	/*                                                                       */
    	/*   1. Excel 다운로드 poi 방식으로 파일 생성하여 다운                   */
    	/*     - 가이드 없어 미진행                                              */
    	/*                                                                       */
    	/* ********************************************************************* */


/* 초기 셋팅 */




var m = {
			globalVar : {
							userId    	:   "testUser"	,
							cstrCd    	:   ""			,
							tmpCnt    	:   0			,
							skAfcoDivCd	:   "B"			,
							gubun     	:   ""			,
							parentId  	:   null		,
							folderNm  	:   ""			  // 저장 폴더명
						},
			params    : {

			         	},
			ajaxProp  : [
			             {  /* 작업이력정보 조회 */
			             	url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanCompletionPhotoWorkHist',
			             	data:"",
			             	flag:'searchList'
			             },
			             {  /* 함체번호, 설치장소 조회 */
			             	url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanCompletionPhotoNumSite',
			             	data:"",
			             	flag:'searchInfo'
			             },
			             {  /* 사진파일 조회 */
			             	url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanCompletionPhotoFiles',
			             	data:"",
			             	flag:'searchPhotoFile'
			             },
			             {
							url:'tango-transmission-biz/transmission/constructprocess/completion/updateSmartTakeoverPaperCreationOpticalLanDocumentCreate?method=put',
							data:"",
							flag:'' //
			             },
			             {
							url:'tango-common-business-biz/dext/images/40000622',
							data:"",
							flag:'getImage' // 4
			             },
			             {  // 사진 DATA 조회
			            	url:'tango-transmission-biz/transmission/constructprocess/verification/getFileDataList',
			            	data:"",
			            	flag:'getPhotoDataList' // 5
			             },
			             {  // Ondemand Batch 등록 - 엑셀다운로드
			            	url:'tango-transmission-biz/transmisson/constructprocess/common/callOnDemandExcelList',
			            	data:"",
			            	flag:'setBatch' // 6
				         },
			             {  // Ondemand Batch 상태조회 - 엑셀다운로드
			            	url:'tango-transmission-biz/transmisson/constructprocess/common/excelBatchExecuteStatus/', // {jobInstanceId}
			            	data:"",
			            	flag:'getBatchStatus' // 7
				         }
			            ],
		responseData	: {},
		label 			: {},
		message 		: {},
		userInfo 		: {},
		photoImgData 	: [],
		jobInstanceId		: ""

	};



var tangoAjaxModel = Tango.ajax.init({});


$a.page(function(){
	$('#pre').css({'height':'150px','overflow-x':'scroll','overflow-y':'hidden'});
	$('#post').css({'height':'150px','overflow-x':'scroll','overflow-y':'hidden'});
	$('.img_area').css({
		'height':'149px'
		,'overflow':'hidden'
//		,'border' : '1px solid green'
	});

	// 이미지리스트 margin-top 간격 조절하여 높이 맞추기

	$('.table').parent('div').css({
				 'margin-top': 22
		});
	//////////////////////////////////////////////////////













    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param){

//    	console.log("공사코드 : "+param.cstrCd);
//    	console.log("호출한 페이지ID : "+parent.$a.pageId);


    		m.globalVar.parentId = parent.$a.pageId;

//    		console.log("부모창 ID : "+m.globalVar.parentId);
    	// 테스트
//	    	m.globalVar.parentId = "통합승인";
//  	  	m.globalVar.parentId = "인수인계";
//	    	m.globalVar.parentId = "정산";
    	//--------------------------------

    	// param setting
    	if(param.cstrCd != null && param.cstrCd != ""){
    		m.globalVar.cstrCd = param.cstrCd;
    	}else{
//    		console.log("공사코드 파라미터 전달 안됨!!!!")
//    		m.globalVar.cstrCd = 'P001';
    		m.globalVar.cstrCd = 'P20145723401';
//    		m.globalVar.cstrCd = 'P20161893401';
//        	m.globalVar.cstrCd = param.cstrCd;
//    		m.globalVar.cstrCd = parent.$('#cstrCd').val();
    	}

    	if(param.gubun != null && param.gubun != ""){
    		m.globalVar.gubun = param.gubun;
    	}else{
    		m.globalVar.gubun = '1';
    	}

    	m.globalVar.skAfcoDivCd = m.userInfo.skAfcoDivCd;
    	m.globalVar.userId = m.userInfo.userId;

    	m.params.gubun = m.globalVar.gubun;
    	//===================================================

//    	console.log("수정 : 넘겨준 파라미터 : "+m.globalVar.cstrCd);

    	m.params.cstrCd = m.globalVar.cstrCd;
    	m.params.lastChgUserId = m.globalVar.userId;
    	m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
    	m.params.xxx = "ok";
    	setEventListener();

    	initGrid();


		$('#grid').alopexGrid('showProgress');
    	callTangoAjax(0);// 데이터 조회



    };

  //Grid init
    function initGrid(){

    	// Alopex Grid 생성
    	$('#grid').alopexGrid({
    		pager: false,
    		height: 200,
    		rowClickSelect: false,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
		    rowOption:{
		    	defaultHeight:30
		    },

//		    defaultColumnMapping:{
//		    	editable: true
//		    },
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+m.message.noData+"</div>"
			},

    		columnMapping:[
    						{ key : "wkrtNo"                  , title : m.label.workDirectionNumber		},	// 작업지시번호
    						{ key : "ctwkNm"                  , title : m.label.workName				},	// 작업명
    						{ key : "workTime"                , title : m.label.workDate				},	// 작업일자
    						{ key : "wkfhWorkDt"              , title : m.label.workFinishDay			},	// 작업완료일
    						{ key : "lginUserTlnoMask"        , title : m.label.cntac					},	// 연락처
    						{ key : "uprPicWorkTypCdNm"       , title : m.label.workClassification		},	// 작업분류
    						{ key : "picWorkTypCdNm"          , title : m.label.workType				}	// 작업유형
            ]
    	});



    	$('#grid2').alopexGrid({
    		pager: false,
    		height: $('.table').parent('div').height(), // 이미지리스트와 높이 맞추기 위함;;;;
    		rowClickSelect: false,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
		    rowOption:{
		    	defaultHeight:30
		    },

//		    defaultColumnMapping:{
//		    	editable: true
//		    },

    		columnMapping:[
    						{ key : "workInfCtt"                  , title : m.label.cabinetNumber+"&#47"+m.label.installPlace } // 함체번호/설치장소
            ]
    	});

    }// initGrid()

    function validateChk(){
    	return true;
    }



    // EVENT !!!!!!!!!!!!!
    function setEventListener() {

    	// 작업내역 그리드 클릭
    	$('#grid').on('click','.bodycell',function(e){

    		var eObj = AlopexGrid.parseEvent(e).data;
    		var i = eObj._index.row; // 선택 데이터 index
    		var rowData = $('#grid').alopexGrid("dataGetByIndex",{data:i});

//    		console.log(rowData);

    		var selected = eObj._state.selected;
//    		console.log("클릭한 데이터 Index : "+ i +"\n"+"선택여부 : " + selected );

    		$('#grid').alopexGrid('rowSelect',{_index:eObj._index},true);
    		if(selected == true){
    			return;
    		}

    		// 파라미터 셋팅
    		m.params.wkrtNo       = rowData.wkrtNo;
    		m.params.uprPicWorkTypCd    = rowData.uprPicWorkTypCd;
    		m.params.picWorkTypCd  = rowData.picWorkTypCd;
    		m.params.lginUserTlno = rowData.lginUserTlno;

    		$('#grid2').alopexGrid('dataEmpty');
    		$('.img_area > div').remove();
    		$('.img_area').css('width','0px');


    		$('#grid2').alopexGrid('showProgress');

    		callTangoAjax(1);

    	}); // 작업내역 그리드 클릭

    	// 함체번호, 설치장소 그리드 클릭
    	$('#grid2').on('click','.bodycell',function(e){

    		// 사진 삭제
        	$('#pre_img').html("");
        	$('#post_img').html("");

    		var eObj = AlopexGrid.parseEvent(e).data;
    		var i = eObj._index.row; // 선택 데이터 index
    		var rowData = $('#grid2').alopexGrid("dataGetByIndex",{data:i});

//    		console.log(rowData);

    		var selected = eObj._state.selected;
//    		console.log("클릭한 데이터 Index : "+ i +"\n"+"선택여부 : " + selected );
    		// 중복클릭시 선택해제 방지
    		$('#grid2').alopexGrid('rowSelect',{_index:eObj._index},true);
    		if(selected == true){
    			return;
    		}
    		// 파라미터 셋팅

    		if(rowData.workInfCtt == "기본사진"){
    			m.params.workInfCtt = '-';
    		}else{
    			m.params.workInfCtt = rowData.workInfCtt;
    		}

    		$('.img_area > div').remove();
    		$('.img_area').css('width','0px');


    		$('body').progress();

    		callTangoAjax(2);

    	}); // 함체번호, 설치장소 그리드 클릭



    	//엑셀다운
    	 $('.output_excel').on('click', function(e) {

// 			var gridData = $('#grid').alopexGrid('dataGet');
//			if(gridData.length == 0){
//				callMsgBox('','I', "데이터가 존재하지 않습니다.");
//				return;
//			}


			m.params.fileKey = m.globalVar.cstrCd;
			m.params.fileName = m.globalVar.cstrCd+"_PIC";
			m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
			m.params.screenId = "TS0054752"; // 화면ID (스마트인수인계 준공사진 화면ID
			m.params.excelFlag = "excel";    // EXCEL : 준공사진  , ZIP : 준공서류

			$('body').progress();
    		 callTangoAjax(6); // Ondemand Batch 등록 - 엑셀다운로드


         });//엑셀다운 끝



     	// Close Click : 닫기버튼 클릭
     	$('.close_btn').on('click',function(){

    		if($a.parentId != parent.$a.pageId){
    			$a.close('close'); // Close
    		}else{
    			callMsgBox('','W', "팝업이 아닙니다.");
    		}
     	});

	} // setEventListener() - 이벤트



    // SUCCESS...
    function successFn(response, status, jqxhr, flag){
//    	console.log(response);
//    	console.log(status);
//    	console.log(jqxhr);
//    	console.log(flag);



    	switch (flag) {

    	case 'searchList':
    		$('#grid').alopexGrid('hideProgress');
    		if(response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoList != null && response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoList != "" ){
    			$('#grid').alopexGrid('dataSet', response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoList);
    		}

    		break;
    	case 'searchInfo':
    		$('#grid2').alopexGrid('hideProgress');
    		if(response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoNumSiteList != null && response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoNumSiteList != "" ){
    			$('#grid2').alopexGrid('dataSet', response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoNumSiteList);
    		}
    		break;
    	case 'searchPhotoFile':
    		if(response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoFileList != null && response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoFileList != ""){
    			m.responseData.PhotoFileList = response.SmartTakeoverPaperCreationOpticalLanCompletionPhotoFileList;


    			m.photoImgData = [];

				for(var i=0;i<m.responseData.PhotoFileList.length;i++){

					if(m.responseData.PhotoFileList[i].workPicFileUladSrno != null && m.responseData.PhotoFileList[i].workPicFileUladSrno != '' && m.responseData.PhotoFileList[i].workPicFileUladSrno != undefined){

						m.photoImgData.push(m.responseData.PhotoFileList[i].workPicFileUladSrno);
					}else{
						m.photoImgData.push("40000302"); // 테스트용
					}
				}

				callTangoAjax(5); // 사진 데이터 조회




//
    		}else{
    			$('body').progress().remove();
    		}
    		break;
    	case 'getImage':
    		console.log(response);
    		$('body').append(
    					'<div>'
    					+'<img width="100" height="80" style="border:1px solid black" src="data:image/png;base64,'+response.imgBuf+'" />'
    					+'</div>'
    				);


    		break;
    	case 'getPhotoDataList':

    		$('body').progress().remove();

    		if(response.photoDataList != null ){
    			m.photoImgData = response.photoDataList;
    		}

    		setPhotoData();
    		break;

    	case 'setBatch': // 배치등록
    		if(response.returnCode == '200'){
    			m.jobInstanceId = response.resultData.jobInstanceId;

    			var jobInstanceId = m.jobInstanceId;
    			var fileName =  m.globalVar.cstrCd+"_PIC_"+m.jobInstanceId ;

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
   		                	 jobInstanceId : m.jobInstanceId
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
    		break;

    	}
    } // successFn()

    // FAIL...
    function failFn(response, status, flag){

    	switch (flag) {
    	case 'searchList':
    		$('#grid').alopexGrid('hideProgress');
    		break;
    	case 'searchInfo':
    		$('#grid2').alopexGrid('hideProgress');
    		break;
    	case 'searchPhotoFile':
    		$('body').progress().remove();
    		break;
    	case 'getPhotoDataList':
    		$('body').progress().remove();
    		break;
    	case 'setBatch':
    		$('body').progress().remove();
			callMsgBox('btnSearch','I', '<spring:message code="error.t.completion.failCmplPicDown"/>', btnMsgCallback);
    		break;
    	}
    } // failFn()



    // AJAX GET, POST, PUT
    function callTangoAjax(i){
    	var url = m.ajaxProp[i].url;
    	if(i==5){
    		m.ajaxProp[i].url = url + '/'+m.photoImgData
    	}else if(i==6){
    		console.log(m.ajaxProp[i].data);
    	}else if(i==7){
    		m.ajaxProp[i].url = url + m.jobInstanceId
    	}
    	m.ajaxProp[i].data = m.params;

    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } //
    	else if(i == 1){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } //
    	else if(i == 2){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } //
    	else if(i == 3){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } //
    	else if(i == 4){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // image
    	else if(i == 5){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // 사진 DATA 조회
    	else if(i == 6){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn); } // Batch 등록
    	else if(i == 7){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn); } // Batch 상태조회

    m.ajaxProp[i].url = url;

    } // callTangoAjax()



    // 의견 저장
    function saveOpinion(){

		if(paramsValidate()){
			callTangoAjax(2); // 의견 저장
		}
    } // saveOpinion

    function paramsValidate(){


    	return true;
    }// paramsValidate


    // 사진이미지 셋팅
    function setPhotoData(){

      	$('.img_area > div').remove();

    	m.photoData = {};

    	m.photoData.filePath             = "https://www.tangot.co.kr/webdav?mode=get&path=/webdav/SMWORK/";     // 파일URL
    	m.photoData.cnt                  = m.responseData.PhotoFileList.length;                                 // 사진 총 갯수
    	m.photoData.workPicFilePathNm    = "";                                                                  // 사진경로
    	m.photoData.workPicFileNm        = "";                                                                  // 사진파일명
    	m.photoData.picWorkPicClCd          = "";                                                                  // 사진타입
    	m.photoData.picDtlDesc           = "";                                                                  // 사진내용
    	m.photoData.picShotgDtm           = "";                                                                  // 사진찍은일자
    	m.photoData.photoCntI            = 0;                                                                   // 작업 전 사진체크
    	m.photoData.photoCntO            = 0;                                                                   // 작업 후 사진체크
    	m.photoData.oMinYn               = "";
    	m.photoData.iMinYn               = "";

    	m.photoData.goodWoJugCd          = "";
    	m.photoData.workPicSrno          = "";
    	m.photoData.jugUserNm            = "";

//    	console.log(m.photoData.filePath         );
//    	console.log(m.photoData.cnt              );



    	if(m.responseData.PhotoFileList != null && m.responseData.PhotoFileList != "" && m.responseData.PhotoFileList.length != 0){

    	for(i=0;i<m.photoData.cnt;i++){

        	m.photoData.workPicFilePathNm    = m.responseData.PhotoFileList[i].workPicFilePathNm;
        	m.photoData.workPicFileNm        = m.responseData.PhotoFileList[i].workPicFileNm;
        	m.photoData.workPicClCd          = m.responseData.PhotoFileList[i].workPicClCd;
        	m.photoData.picDtlDesc           = m.responseData.PhotoFileList[i].picDtlDesc;
        	
			if(m.responseData.PhotoFileList[i].picShotgDtm == null || m.responseData.PhotoFileList[i].picShotgDtm == "" || m.responseData.PhotoFileList[i].picShotgDtm == undefined){
				m.photoData.picShotgDtm = "-";
			}else{
				m.photoData.picShotgDtm = m.responseData.PhotoFileList[i].picShotgDtm;
			}

        	m.photoData.goodWoJugCd          = m.responseData.PhotoFileList[i].goodWoJugCd;
        	m.photoData.workPicSrno          = m.responseData.PhotoFileList[i].workPicSrno;


			if(m.responseData.PhotoFileList[i].jugUserNm == null || m.responseData.PhotoFileList[i].jugUserNm == "" || m.responseData.PhotoFileList[i].jugUserNm == undefined){
				m.photoData.jugUserNm = "-";
			}else{
				m.photoData.jugUserNm = m.responseData.PhotoFileList[i].jugUserNm;
			}
//    		console.log(m.photoData);

    	//style="width:100%;height:150px;border:1px solid blue

    		if(m.photoData.workPicClCd == "I"){ // I : 작업 전
    			m.photoData.photoCntI ++;



    			$('#pre_area').append(
    					  '<div id="'
    					+'img_box'+i
    					+'" class="img_box"><img class="photo_img" id="'+i+'_photo_img" src="data:image/png;base64,'
    					+ m.photoImgData[i]
//    					+ m.photoData.workPicFilePathNm
//    					+ '/'
//    					+ m.photoData.workPicFileNm
    					+ '" alt="'
    					+ m.photoData.workPicFileNm
    					+ '" />'
    					+ '<div>'
    					+ '<label class="ImageRadio imageRadio2">'
    					+ '<input type="radio" class="Radio" name="imgRadio'+i+'" value="Y" data-bind="checked:goodWoJugCd">'+m.label.good+'</input>' // 양호
    					+ '</label>'
    					+ '<label class="ImageRadio imageRadio2">'
    					+ '<input type="radio" class="Radio" name="imgRadio'+i+'" value="N" data-bind="checked:goodWoJugCd">'+m.label.bad+'</input>'  // 불량
    					+ '</label>'
    					+ '<span style="float:right">'
    					+ m.photoData.jugUserNm
    					+ '</span>'
    					+ '</div>'
    					+ '<div style="text-align:center">'
    					+ m.photoData.picShotgDtm
    					+ '</div>'
    					+ '</div>'
    			);

    		}else if(m.photoData.workPicClCd == "O"){ // O : 작업 후
    			m.photoData.photoCntO ++;

    			$('#post_area').append(
    					  '<div id="'
    					+ 'img_box'+i
    					+ '" class="img_box"><img class="photo_img" id="'+i+'_photo_img" src="data:image/png;base64,'
    					+ m.photoImgData[i]
//    					+ m.photoData.workPicFilePathNm
//    					+ '/'
//    					+ m.photoData.workPicFileNm
    					+ '" alt="'
    					+ m.photoData.workPicFileNm
    					+ '" />'
    					+ '<div>'
    					+ '<label class="ImageRadio imageRadio2">'
    					+ '<input type="radio" class="Radio" name="imgRadio'+i+'" value="Y" data-bind="checked:goodWoJugCd">'+m.label.good+'</input>' // 양호
    					+ '</label>'
    					+ '<label class="ImageRadio imageRadio2">'
    					+ '<input type="radio" class="Radio" name="imgRadio'+i+'" value="N" data-bind="checked:goodWoJugCd">'+m.label.bad+'</input>'  // 불량
    					+ '</label>'
    					+ '<span style="float:right">'
    					+ m.photoData.jugUserNm
    					+ '</span>'
    					+ '</div>'
    					+ '<div style="text-align:center">'
    					+ m.photoData.picShotgDtm
    					+ '</div>'
    					+ '</div>'
    			);
    		}

    		$a.convert($('#img_box'+i));
    		$('.img_area').find('input:radio[name=imgRadio'+i+']').setData(m.photoData);

    	} // for

    	$('.img_box').css({
	         'width'     : '140px'
	        ,'height'    : '90%'
//		    ,'border'    : '1px solid blue'
		    ,'float'     : 'left'
		    ,'margin-top': '0px'
			,'margin-bottom': '0px'
			,'padding-top' : '0px'
			,'padding-bottom' : '0px'

    	});

    	$('#pre_area').css('width', 150 * m.photoData.photoCntI);
    	$('#post_area').css('width', 150 * m.photoData.photoCntO);


    	$('.photo_img').css({
    			'width'    : '100%'
    		   ,'height'   : '100px'
//			   ,'border'   : '1px solid red'
    	});

//    	$a.convert($('#pre_img'));
//       	$a.convert($('#post_img'));
    }else{

    	$('.img_area > div').remove();


    }

    	$('.Radio').setEnabled(false);

    	// 이미지 클릭시 확대 dialog 출력 - 이미지생성 후 이벤트 적용
    	$('.photo_img').on('click',function(e){
    		var i = $(this).attr('id').split("_")[0];
//    		alert("인덱스 : "+i);
    		showPhotoImg(i);
    	});// 이미지 클릭시 확대 dialog 출력

//    	console.log($('.table').parent('div').height());

    }// setPhotoData() : 사진이미지 셋팅

    // 이미지 팝업
    function showPhotoImg(i){


    	//이미지셋팅
    	$('#PhotoDialog').find('img').attr('src',   "data:image/png;base64," + m.photoImgData[i] );
    	// 사진정보
    	$('#PhotoDialog').find('span:eq(2)').text(m.label.judgmentOperator+' : '+m.responseData.PhotoFileList[i].jugUserNm);  // 판정자

    	// 판정
    	$('#PhotoDialog').setData(m.responseData.PhotoFileList[i]);

    	$('#PhotoDialogImgArea > div:eq(0)').css({
    			 'width'  :'100%'
    			,'height' :'95%'
//    			,'border' :'1px solid blue'
    	});
    	$('#PhotoDialogImgArea > div:eq(1)').css({
    			 'padding-bottom':'10px'
//    			,'border'  :'1px solid green'
    	});
	    $('#PhotoDialog').open({
		      title:m.label.picture, // 이미지사진 , 사진
		      width: 800,
		      height: 600
		    });



    }// showPhotoImg() : 이미지팝업


    // messageCallback
	function messageCallback(msgId, msgRst){

		switch (msgId) {
		case '':
			if(msgRst == 'Y'){

			}
			break;
		}
	};




});