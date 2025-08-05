/**
 * SmartTakeoverPaperCreationOpticalLan.js
 * Smart인수인계광랜_서류생성
 * @author P096430
 * @date 2016. 08. 25. 오전 10:18:00
 * @version 1.0
 */

/*
 * http://localhost:8080/tango-transmission-web/constructprocess/completion/SmartTakeoverPaperCreationOpticalLan.do?cstrCd=P20145723401&gubun=1
 */

/* 초기 셋팅 */
for(i=0;i<14;i++){

$('.HeaderInfo:eq('+i+')').css({
	'width':$('.HeaderInfo:eq('+i+')').parents('td').width()
	,'border':'0px'
		});
}

$('.HeaderInfo:eq(0)').css({'width':'450px'});

var m = {
			globalVar : {
							userId    :     "testUser"     ,
							cstrCd    :     ""             ,
							engstNo   :     ""             ,
							tmpCnt    :     0              ,
							ajaxGubun :     "N"            ,
							skAfcoDivCd :     "B"             ,
							gubun     :     ""             ,  //0: 통합승인  1: Smart인수인계 광랜부대    2: 광랜부대공사 정산
							todoYn    :     "N"            ,
							parentId  :     null           ,
							folderNm  :     ""             ,  // 저장 폴더명
						    uprcAplyDt :    ""             ,   // 단가 적용일자
						    httpReferer : "",
						    btnYn 		: ""   // 첨부파일 화면 호출시 버튼 활성화 여부 값
						},
            file      : {
            	fileDivCd : "",
            	fileSno   : "",
            	fileNm    : "",
            	filePath  : ""
            	},
            files     : null,
			params    : {},
			ajaxProp  : [
			             {
			             	url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLan',
			             	data:"",
			             	flag:'searchList'
			             },
			             {
							url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanDocCreate',
							data:"",
							flag:'docCreate' // 파일 생성
			             },
			             {
							url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanSubmit',
							data:"",
							flag:'docSubmit' // 제출
			             },
			             {
							url:'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanCancel',
							data:"",
							flag:'docSubmitCancel' // 제출취소
			             },
			 			 {   // 파일 다운로드 전 파일 저장 경로 받아오기
							url : '',   //'tango-common-business-biz/dext/files/'+ m.file.sno,
							data : "",
							flag : 'searchFileInfo' /* 4 */
						 },
						 {   // 단가적용일자 받아오기 ( 공사코드, sk구분 필요 )
							url : 'tango-transmission-biz/transmission/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanUprcAplyDtInfo',
							data : "",
							flag : 'searchUprcAplyDtInfo' /* 5 */
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
		responseData   : {},
	    message        : {},
	    error          : {},
	    label          : {},
	    userInfo       : {},
	    jobInstanceId  : ""

	};



var tangoAjaxModel = Tango.ajax.init({});


$a.page(function(){

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param){

//    	console.log("서류제출일자 : "+ param.docmtSubmDt);
//    	console.log("공사코드 : "+param.cstrCd);
//    	console.log("호출화면구분(1:인수인계, 2:정산)\n : "+param.gubun);
//    	console.log("호출한 페이지ID : "+parent.$a.pageId);

    	$('#popHeadDiv').show();
    	// window popup인 경우 팝업헤드에 타이틀 설정 추가
		if( $.TcpUtils.isNotEmpty(param.httpReferer) && param.httpReferer == 'ITAPRV' ){			
			m.globalVar.httpReferer = param.httpReferer;
		}
    	
    	
		var x = Tango.getFormRemote();
		$('body').append(x);
 		console.log(x);
 		console.log("X-Remote-Id : " + $('input[name=X-Remote-Id]').val());
 		console.log("X-Auth-Token : " + $('input[name=X-Auth-Token]').val());

    	m.globalVar.parentId = parent.$a.pageId;

    	m.globalVar.skAfcoDivCd = m.userInfo.skAfcoDivCd;
    	m.globalVar.userId = m.userInfo.userId;


			if(m.globalVar.parentId == $a.pageId){
				if(param.parentId != null && param.parentId != ""){
					m.globalVar.parentId = param.parentId;
				}else{
					if(param.gubun != null && param.gubun != ""){
						switch(param.gubun){
						case '1':
							m.globalVar.parentId = "B";
							$('#iptn_act').remove();
							break;
						case '2':
							m.globalVar.parentId = "C";
							$('#btnInspection').remove();
							break;
						}
					}else{
						m.globalVar.parentId = "B";
						$('#iptn_act').remove();
					}
				}
    		}else{
    			if(param.gubun != null && param.gubun != ""){

					switch(param.gubun){
					case '1':
						m.globalVar.parentId = "B";
						$('#iptn_act').remove();
						break;
					case '2':
						m.globalVar.parentId = "C";
						$('#btnInspection').remove();
						break;
					}
				}else{
					m.globalVar.parentId = "B";
					$('#iptn_act').remove();
				}
    		}

    	// param setting
    	if(param.cstrCd != null && param.cstrCd != ""){
    		m.globalVar.cstrCd = param.cstrCd;
    	}else{
    		callMsgBox("param_error","W","공사코드가 없습니다.관리자에게 문의하세요",messageCallback);
    	}

    	if(m.globalVar.httpReferer == 'ITAPRV'){
    		m.globalVar.todoYn = "Y";
    	}
    	
    	
    	if(param.gubun != null && param.gubun != ""){
    		m.globalVar.gubun = param.gubun;
    	}else{
    		m.globalVar.gubun = "1";
    	}

    	m.params.gubun = m.globalVar.gubun;
    	m.params.lastChgUserId = m.globalVar.userId;


    	// 부모창 아이디로 초기 셋팅
    	if(m.globalVar.parentId == "A" || param.gubun == '0'){
    		m.globalVar.gubun = '0';
    		$('.reg_btn').css('display','none');    // 제출버튼
    		$('.cancel_btn').css('display','none'); // 제출취소버튼
//    		$('.close_btn').css('display','none');  // 닫기버튼

    		$('#atchd_docmt').removeAttr('href');

    		$('title').html(m.label.title1); // Smart인수인계제출(광랜부대) &lt; 준공 &lt; 구축공정관리
    		$('.header_box').find('b').text(m.label.header1); // Smart인수인계제출(광랜부대) 서류생성


    	}else if(m.globalVar.parentId == "B" || param.gubun == '1'){
    		$('#pcst_dts_doc').css('display','none');  // 원가계산서
    		$('#setl_dts_doc').css('display','none');  // 정산내역서

    		$('title').html(m.label.title1); // Smart인수인계제출(광랜부대) &lt; 준공 &lt; 구축공정관리
    		$('.header_box').find('b').text(m.label.header1); // Smart인수인계제출(광랜부대) 서류생성


    	}else if(m.globalVar.parentId == "C" || param.gubun == '2'){
    		m.globalVar.gubun = '2';

    		$('.reg_btn').css('display','none');    // 제출버튼
    		$('.cancel_btn').css('display','none'); // 제출취소버튼

    		$('title').html(m.label.title2); // 정산서류생성(광랜부대) &lt; 정산 &lt; 구축공정관리
    		$('.header_box').find('b').text(m.label.header2); // 정산서류생성(광랜부대)
    	}else{


    	}

    	m.params.cstrCd = m.globalVar.cstrCd;
    	m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
    	m.params.lastChgUserId = m.globalVar.userId;

    	setEventListener();
    	initGrid();
    	callTangoAjax(0);// 데이터 조회

    	if(m.globalVar.gubun == "2"){ // 정산시

    		$('#field_docmt_cre').text(m.label.createSetlDocm);

    		callTangoAjax(5);// 단가적용일자 조회
    	}






    };

  //Grid init
    function initGrid(){

    	// Alopex Grid 생성
    	$('#grid').alopexGrid({
    		pager: false,
    		height: 200,
    		rowClickSelect: true,
    		rowSingleSelect: true,
    		autoColumnIndex: true,
    		columnFixUpto: 1,
		    rowOption:{
		    	defaultHeight:30
		    },
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+m.message.noData+"</div>"
			},

    		columnMapping:[
    						{ key : "wkfhWorkDt"          			, title : m.label.workDay, width: '90px'										},	// 작업일
    						{ key : "wkrtNo"                  	, title : m.label.workNumber, width: '120px'									},	// 작업번호
    						{ key : "ctwkNm"                  	, title : ""                    ,hidden:true 									},  // 작업명
    						{ key : "photoDt"             		, title : m.label.fieldPictureAttached, width: '90px'							},	// 현장사진첨부
    						{ key : "smapVndrSubmDt"            , title : m.label.geographicInformationSystemRegistrationDate, width: '90px'	},	// GIS등록일자
//    						{ key : "workNetDivCd"            	, title : ""                    ,hidden:true 									},  // (삭제)
//    						{ key : "workNetDivCdNm"          	, title : m.label.workNetwork													},  // 작업망 (삭제)
    						{ key : "workAprvStatCd"          	, title : ""                    ,hidden:true 									},
    						{ key : "workAprvStatCdNm"        	, title : m.label.workStatus, width: '90px'										},	// 작업상태
    						{ key : "workUrgCd"               	, title : ""                    ,hidden:true 									},
    						{ key : "workUrgCdNm"             	, title : m.label.workUrgent, width: '90px'										},	// 작업시급성
    						{ key : "workUrgOponCtt"          	, title : m.label.workUrgentReason, width: '100px'								},	// 작업시급성사유
    						{ key : "workAreaNm"              	, title : m.label.workArea, width: '90px'										},	// 작업지역
    						{ key : "workDtlDivCd"           	, title : ""                    ,hidden:true 									},
//    						{ key : "workDtlDivCdNm"         	, title : m.label.workDivision													},	// 작업구분 (임시주석)
    						{ key : "exstCblWorkWorkQutyCd"   	, title : m.label.cableWorkInformation+"-"+m.label.existing, width: '130px'		},	// 케이블작업정보-기존
    						{ key : "chgCblWorkWorkQutyCd"    	, title : m.label.cableWorkInformation+"-"+m.label.change, width: '130px'		},	// 케이블작업정보-변경
    						{ key : "existCbntWorkQutyCd"     	, title : m.label.cabinetWorkInformation+"-"+m.label.exist, width: '120px'		},	// 함체작업정보-기설
    						{ key : "cbntWorkQutyCd"          	, title : m.label.cabinetWorkInformation+"-"+m.label.nw, width: '120px'			},	// 함체작업정보-신설
//    						{ key : "workProcCtt"             	, title : m.label.workProcessContent											},	// 작업처리내용
//    						{ key : "rontWorkDivVal"            , title : m.label.workInfluence													},	// 작업영향도
//    						{ key : "mtmtOrgIdOneNm"            , title : m.label.actionDepartment												},	// 시행부서
    						{ key : "cnstnBpId"               	, title : ""                    ,hidden:true 									},
    						{ key : "cnstnBpNm"               	, title : m.label.constructionVendor, width: '90px'								},	// 시공업체
//    						{ key : "insDhm"             		, title : m.label.workRegistrationDay											},	// 작업등록일
//    						{ key : "skConfDt"                	, title : m.label.buildApprovalDay												},	// 건설승인일
//    						{ key : "fnshAprvDtm"             	, title : m.label.lastApprovalDay												},	// 최종승인일
//    						{ key : "wkfhWorkDt"           			, title : m.label.workFinishDay													},	// 작업완료일
//    						{ key : "sknMgmtOrgId"            	, title : ""                    ,hidden:true 									},
//    						{ key : "sknMgmtOrgNm"            	, title : m.label.managementTeam												},	// 관리팀
//    						{ key : "dstbCntrCd"            	, title : ""                    ,hidden:true 									},
//    						{ key : "dstbCntrCdNm"            	, title : m.label.mobileTelephoneSwitchingOffice+"/"+m.label.information		},	// 국사/정보
//    						{ key : "progStat"                	, title : m.label.progressStatus												},  // 진행상태
//    						{ key : "workTypNm"           		, title : m.label.workType														},	// 작업유형
    						{ key : "sessnEyn"                	, title : m.label.oneTimeExistenceAndNonexistence, width: '90px'				},	// 입회유무
    						{ key : "sessnSvsrLstVal"           , title : m.label.workSupervision+"("+m.label.fullName+")", width: '100px'		},	// 작업감독(이름)
    						{ key : "sessnSpvnCntacCtt"       	, title : m.label.workSupervision+"("+m.label.cntac+")", width: '110px'			},	// 작업감독(연락처)
    						{ key : "cnstnBpChrrNm"           	, title : m.label.oprr+"("+m.label.fullName+")", width: '90px'					},	// 작업자(이름)
    						{ key : "cnstnBpChrgInfNm"        	, title : m.label.oprr+"("+m.label.cntac+")", width: '100px'					},	// 작업자(연락처)
//    						{ key : "cttMod"                  	, title : m.label.contentModification											},	// 내용수정
//    						{ key : "conlDivCdNm"             	, title : m.label.workProcessDivision											},	// 작업처리구분
//    						{ key : "csltRjctDt"              	, title : m.label.workProcessDate												},	// 작업처리일자
//    						{ key : "workProcRsn"             	, title : m.label.workProcessReason												}	// 작업처리사유
    						{ key : "" , hidden:true} // 콤마위한 더미 컬럼
            ]
    	});

    }// initGrid()

    function validateChk(){
    	return true;
    }

    // EVENT !!!!!!!!!!!!!
    function setEventListener() {

		/* 준공단계 버튼 클릭 이벤트 */
		$('#btnInspection').on('click', function(e) {
			
			var url = '/tango-transmission-web/constructprocess/inspection/ConstructInspectionPopup.do';
			var winTitle = "준공단계";
			
			$a.popup({
				popid: "",
	         	title: winTitle,
		        url: url,
		        windowpopup : true,
				modal : false,
	            data: {cstrCd : m.globalVar.cstrCd,
	            	   iptnStepCd : "C"
	            },
	            width: 850,
	            height: 650,
	        });
		});
		
		// 감리 활동 버튼 클릭 이벤트 
     	$('#iptn_act').on('click', function(e) {
			
			var url = '/tango-transmission-web/constructprocess/inspection/ConstructInspectionPopup.do';
			var winTitle = "감리 활동";
			
			$a.popup({
				popid: "",
	         	title: winTitle,
		        url: url,
	            data: {cstrCd : m.globalVar.cstrCd,
	            	   iptnStat : 'total' // 감리활동
	            },
	            width: 850,
	            height: 650,
	            windowpopup : true,
	            modal: false,
	        });
		});
    	
    	// Attached Document Button Click : 첨부서류 클릭
    	$('#atchd_docmt').on('click',function(){


        	$a.popup({
        		popid     : 'SmartTakingOverOpticalLanAttachedDocument' // 중복클릭방지 id 필요
                ,title    : m.label.opticalLan+" "+m.label.attachedDocument // 광랜 첨부서류
                ,url      : '/tango-transmission-web/constructprocess/completion/SmartTakingOverOpticalLanAttachedDocument.do'
//                ,iframe   : true // default
                ,windowpopup:true
                ,width    : 1100
                ,height   : 750
                ,modal    : false
                ,data     : {'cstrCd':m.globalVar.cstrCd,'engstNo':m.globalVar.cstrCd, 'btnYn':m.globalVar.btnYn }
                ,callback : function(x){
                	if(m.globalVar.httpReferer == "ITAPRV"){
                		parent.location.reload(true);
                	}else{
                		location.reload(true);
                	}
//                				if(x=="ok"){
//                					location.reload(true);
//                				}

                			}
            });
    	});

    	// Completion Photo Button Click : 준공사진 클릭
    	$('#compl_pic').on('click',function(){
        	$a.popup({
        		popid     : 'SmartTakeoverPaperCreationOpticalLanCompletionPhoto' // 중복클릭방지 id 필요
                ,title    : m.label.opticalLan+" "+m.label.completionPicture // 광랜 준공사진
                ,url      : '/tango-transmission-web/constructprocess/completion/SmartTakeoverPaperCreationOpticalLanCompletionPhoto.do'
//                ,iframe   : true // default
                ,windowpopup:true
                ,width    : 1100
                ,height   : 800
                ,modal    : false
                ,data     : {'cstrCd':m.globalVar.cstrCd }
                ,callback : function(x){
                	if(m.globalVar.httpReferer == "ITAPRV"){
                		parent.location.reload(true);
                	}else{
                		location.reload(true);
                	}
//                				if(x=="ok"){
//                					location.reload(true);
//                				}
                			}
            });
    	});

    	// Cost Statement Button Click : 원가내역서 클릭
    	$('#pcst_dts_doc').on('click',function(){
           	$a.popup({
        		popid     : 'OpticalLanPrimeCostBill' // 중복클릭방지 id 필요
//                ,title    : m.label.opticalLan+" "+m.label.primeCostStatement // 광랜 원가내역서
                ,title    : m.label.opticalLan+" "+m.label.primeCostBill // 광랜 원가계산서
                ,url      : '/tango-transmission-web/constructprocess/accounts/OpticalLanPrimeCostBill.do'
//                ,iframe   : true // default
                ,width    : 1100
                ,height   : 750
                ,windowpopup: true
                ,modal    : false
                ,data     : {'cstrCd':m.globalVar.cstrCd, 'cstrNm':m.responseData.SmartTakeoverPaperCreationOpticalLanInfo.cstrNm, 'setlDsnGbn':'J' }
                ,callback : function(x){
                	if(m.globalVar.httpReferer == "ITAPRV"){
                		parent.location.reload(true);
                	}else{
                		location.reload(true);
                	}
//                				if(x=="ok"){
//                					location.reload(true);
//                				}
                			}
            });
    	});

    	// Settlement Statement Button Click : 정산내역서 클릭
    	$('#setl_dts_doc').on('click',function(){
//    		console.log('정산내역서클릭!!!!');/tango-transmission-web/constructprocess/accounts/SettlementOfAccountsDetail.do
    		$a.popup({
        		popid     : 'SettlementOfAccountsDetail' // 중복클릭방지 id 필요
                ,title    : m.label.settlementOfAccountsStatement // 정산내역서
                ,url      : '/tango-transmission-web/constructprocess/accounts/SettlementOfAccountsDetail.do'
//                ,iframe   : true // default
//                ,iframe: false
                ,windowpopup: true
                ,width    : 1100
                ,height   : 750
                ,modal    : false
                ,data     : {
                		'cstrCd':m.globalVar.cstrCd,
	                	"cstrNm": m.responseData.SmartTakeoverPaperCreationOpticalLanInfo.cstrNm,
	                	"uprcAplyDt": m.globalVar.uprcAplyDt,
	                	"skAfcoDivCd": m.globalVar.skAfcoDivCd,
	                	"opticalLan":"Y"

                		}
                ,callback : function(x){
                	if(m.globalVar.httpReferer == "ITAPRV"){
                		parent.location.reload(true);
                	}else{
                		location.reload(true);
                	}
//                				if(x=="ok"){
//                					location.reload(true);
//                				}
                			}
            });
    	});

    	// Scene Document Create Button Click : 현장서류생성버튼 클릭
    	$('#field_docmt_cre').on('click',function(){
    		callMsgBox('field_docmt_cre','C', m.message.confirmFieldDocmtCreate, messageCallback); // 현장서류를 생성하시겠습니까?
    	});

    	// Document Down Button Click : 서류다운버튼 클릭
    	$('#docmt_down').on('click',function(){
    		if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton != "" ){
//    			if(m.globalVar.gubun == '1'){
    				if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != "" ){
    			        		callMsgBox('docmt_down','C', m.message.confirmDocmtDown, messageCallback);
    				    	}else{
    				    		callMsgBox('','I', "서류 생성 후  다운가능합니다.");
    				    	}
//    			}else if(m.globalVar.gubun == '2'){
//    				if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.setlDocmtCreDt != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton.setlDocmtCreDt != ""){
//    			        		callMsgBox('docmt_down','C', "정산서류를 다운로드하시겠습니까?", messageCallback);
//    				    	}else{
//    				    		callMsgBox('','I', "서류 생성 후  다운가능합니다.");
//    				    	}
//    			}
    		}else{
    			callMsgBox('','I', "생성할 서류가 존재하지 않습니다.");
    		}
    	});

    	// Submit Button Click : 제출버튼 클릭
    	$('.reg_btn').on('click',function(){
    		callMsgBox('reg_btn','C', m.message.submit, messageCallback);
    	});

    	// Submit Cancel Button Click : 제출취소버튼 클릭
    	$('.cancel_btn').on('click',function(){
    		callMsgBox('cancel_btn','C', m.message.submitCancel, messageCallback);
    	});


    	// Close Click : 닫기버튼 클릭
    	$('.close_btn').on('click',function(){
    		$a.close('close'); // Close
    	});


	} // setEventListener() - 이벤트

    // SUCCESS...
    function successFn(response, status, jqxhr, flag){

    	$('#grid').alopexGrid('hideProgress');

    	switch (flag) {

    	case 'searchList':
    		if(response.SmartTakeoverPaperCreationOpticalLanInfo != null && response.SmartTakeoverPaperCreationOpticalLanInfo != ""){
    			m.responseData.SmartTakeoverPaperCreationOpticalLanInfo = response.SmartTakeoverPaperCreationOpticalLanInfo;
    			$('.HeaderInfo').setData(m.responseData.SmartTakeoverPaperCreationOpticalLanInfo);
    		}

    		if(response.SmartTakeoverPaperCreationOpticalLanList != null && response.SmartTakeoverPaperCreationOpticalLanList != ""){
    			m.responseData.SmartTakeoverPaperCreationOpticalLanList = response.SmartTakeoverPaperCreationOpticalLanList;
    			$('#grid').alopexGrid('dataSet', m.responseData.SmartTakeoverPaperCreationOpticalLanList);
    		}

    		if(response.SmartTakeoverPaperCreationOpticalLanButton != null && response.SmartTakeoverPaperCreationOpticalLanButton != "" ){
    			m.responseData.SmartTakeoverPaperCreationOpticalLanButton = response.SmartTakeoverPaperCreationOpticalLanButton;
    		}


    		if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton != "" ){
				if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.lcbmCreDt != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton.lcbmCreDt != ""){
					$('#atchd_docmt').css('display','');
				}else{$('#atchd_docmt').css('display','none');}

				if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.cmplPicCreDt != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton.cmplPicCreDt != ""){
					$('#compl_pic').css('display','');
				}else{$('#compl_pic').css('display','none');}





				if(m.globalVar.gubun == '1'){ // Smart 인수인계
		    		if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtSubmDt != null &&
		    		   m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtSubmDt != "" ){
			    		$('.reg_btn').setEnabled(false);
			    		
			    		if(m.globalVar.todoYn == "Y"){ // 통합승인일 경우
			    			$('.cancel_btn').setEnabled(false);
			    			$('.close_btn').remove();
			    		}else{
			    			$('.cancel_btn').setEnabled(true);
			    		}
			    		
			    		
			    		$('#field_docmt_cre').setEnabled(false);

			    		if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != "" && m.globalVar.todoYn == "N" ){
			    			$('#docmt_down').setEnabled(true);
				    	}else{
				    		$('#docmt_down').setEnabled(false);
				    	}

			    		m.globalVar.btnYn = "N";
		    		}else{
		    			$('.reg_btn').setEnabled(true);
		    			$('.cancel_btn').setEnabled(false);
						$('#field_docmt_cre').setEnabled(true);

						m.globalVar.btnYn = "Y";
		    		}
				}else if(m.globalVar.gubun == '2'){ // 정산
					if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.setlReqDt != null &&
		    		   m.responseData.SmartTakeoverPaperCreationOpticalLanButton.setlReqDt != "" ){
			    		$('.reg_btn').setEnabled(false);
			    		$('.cancel_btn').setEnabled(false);
			    		$('#field_docmt_cre').setEnabled(false);

		    			if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != null && m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != ""){
		    				$('#docmt_down').setEnabled(true);
				    	}else{
				    		$('#docmt_down').setEnabled(false);
				    	}
		    			m.globalVar.btnYn = "N";
		    		}else{
		    			$('.reg_btn').setEnabled(false);
		    			$('.cancel_btn').setEnabled(false);
						$('#field_docmt_cre').setEnabled(true);

						m.globalVar.btnYn = "Y";
		    		}
				}else{
					$('.reg_btn').setEnabled(false);
		    		$('.cancel_btn').setEnabled(false);
		    		$('#field_docmt_cre').setEnabled(false);
				}
    		}else{
    			
    			if(m.globalVar.todoYn == "Y"){ // 통합승인일 경우
    				$('.reg_btn').remove();
        			$('.cancel_btn').remove();
    				$('#field_docmt_cre').remove();
    				$('#atchd_docmt').remove();
    				$('#compl_pic').remove();
	    		}else{
	    			$('.reg_btn').setEnabled(false);
	    			$('.cancel_btn').setEnabled(false);
					$('#field_docmt_cre').setEnabled(false);
					$('#atchd_docmt').css('display','none');
					$('#compl_pic').css('display','none');
	    		}
    		}

    		break;
    	case 'docSubmit':
    		if(response.returnCode == "200"){
    			callMsgBox('success','I', m.message.successSubmit, messageCallback);
    		}else if(response.returnCode == "500"){
    			callMsgBox('','W', response.returnMessage);
    		}
    		break;
    	case 'docSubmitCancel':
    		if(response.returnCode == "200"){
    			callMsgBox('success','I', m.message.successSubmitCancel, messageCallback);
    		}else if(response.returnCode == "500"){
    			callMsgBox('','W', response.returnMessage);
    		}
    		break;
    	case 'docCreate':
    		if(response.returnCode == "200"){
    			callMsgBox('success','I', m.message.successFieldDocmtCreate, messageCallback);    	//message.successFieldDocmtCreate"현장서류를 생성하였습니다."
    		}else if(response.returnCode == "500"){
    			callMsgBox('','W', response.returnMessage);
    		}
    		break;
    	case 'searchFileInfo' :
			for(i=0;i<m.files.length;i++){
				if(m.files[i].fileSno == response.fileUladSrno){
					m.files[i].fileNm = response.uladFileNm;
					m.files[i].filePath = response.uladFilePathNm;
				}
			}
			m.globalVar.tmpCnt ++;
    		break;// case 'searchFileInfo'
    	case 'searchUprcAplyDtInfo' :
    		if(response.uprcAplyDtInfo != null && response.uprcAplyDtInfo != ""){
    			m.globalVar.uprcAplyDt = response.uprcAplyDtInfo.uprcAplyDt;
    		}
    		break;// case 'searchUprcAplyDtInfo'
    		


    	case 'setBatch': // 배치등록
    		if(response.returnCode == '200'){
    			m.jobInstanceId = response.resultData.jobInstanceId;
    			
    			var jobInstanceId = m.jobInstanceId;
    			var fileName =  m.globalVar.cstrCd+"_Files_"+jobInstanceId ;
    			
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
   		                	,fileType : 'zip'
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
    			callMsgBox('btnSearch','I', '준공서류 다운로드 실패하였습니다.', btnMsgCallback);
    		}
    		break;
    	
    		
    	}
    } // successFn()

    // FAIL...
    function failFn(response){

      	$('#grid').alopexGrid('hideProgress');

		callMsgBox('','W', response.message);

    } // failFn()

    // AJAX GET, POST, PUT
    function callTangoAjax(i){
//    	console.log("method : callTangoAjax("+i+")");

      	$('#grid').alopexGrid('showProgress');

    	var url = m.ajaxProp[i].url;

    	m.ajaxProp[i].data = m.params;
    	
    	if(i==1 || i==2 || i==3){
    		m.ajaxProp[i].url = url+'/'+m.globalVar.cstrCd;
    	}else if( i == 4 ){
    		m.ajaxProp[i].url = 'tango-common-business-biz/dext/files/'+ m.file.fileSno; // searchFileInfo
    	}else if(i==6){
    		console.log(m.ajaxProp[i].data);
    	}else if(i==7){
    		m.ajaxProp[i].url = url + m.jobInstanceId
    	}

    	
    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  //
    	else if(i == 1){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn);  }  //
    	else if(i == 2){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn);  }  //
    	else if(i == 3){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn);  }  //
    	else if(i == 4){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // searchFileInfo
    	else if(i == 5){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // 단가적용일자 조회
    	else if(i == 6){ tangoAjaxModel.post(m.ajaxProp[i]).done(successFn).fail(failFn); } // Batch 등록
    	else if(i == 7){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  } // Batch 상태조회

    	m.ajaxProp[i].url = url;

    } // callTangoAjax()

    // Scene Document Create : 현장서류 생성
    function createFildDocmt(){
    	if(m.responseData.SmartTakeoverPaperCreationOpticalLanInfo.engstNo == null || m.responseData.SmartTakeoverPaperCreationOpticalLanInfo.engstNo == ""){
    		callMsgBox('','W', "공사코드가 없는 서류는 생성불가능합니다.");
    		return;
    	}

    	/*
    		1. 준공사진 수 체크

    		2. 개황도 카운트 1로 무조건 입력

    	 */

    	callTangoAjax(1); // 서류생성
    }

    // Submit : 제출
    function submitAction(){

    	var txt = "";
    	var submitFlag = true;

//    	console.log(m.responseData.SmartTakeoverPaperCreationOpticalLanButton);
    	if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.unitCnt != 0){

    		if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.unitCntA == 0){
    			submitFlag = false;
    			if( txt.length != 0){ txt += ","; }
    			txt += m.label.completionDrawing; // 준공도면
    		}
    		if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.unitCntD == 0){
    			submitFlag = false;
    			if( txt.length != 0){ txt += ","; }
    			txt += m.label.testCertification+"("+m.label.optical+","+ m.label.unshieldedTwistedPairWire+")"; // "시험성적서(광,UTP)"
    		}

    	}else{
    		if( txt.length != 0){ txt += ","; }
    		txt += m.label.attachedDocument; // 첨부서류
    	}

    	if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.cmplPicCreDt != null &&
    	   m.responseData.SmartTakeoverPaperCreationOpticalLanButton.cmplPicCreDt != ""){
    		txt += "";
    	}else{
    		if( txt.length != 0){ txt += ", "; }
    		txt += m.label.completionPicture; // 준공사진
    	}

//    	if( txt.length != 0){ callMsgBox('','W', txt+" 자료가 없습니다."); return false;}


    	if(m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != null &&
    	   m.responseData.SmartTakeoverPaperCreationOpticalLanButton.docmtCreDt != ""){
    		if(submitFlag){
    			m.params.progStatCd = "L"; // Progress Status Code : 상태코드
    			callTangoAjax(2);// 제출
    		}else{
    			callMsgBox('','W', "준공도면, 시험성적서(광,UTP)가 없을시 제출이 불가능합니다.");
    			return false;
    		}
    	}else{
    		callMsgBox('','W', m.error.notCreatedFieldDocmt);
    		return false;
    	}

    }// submitAction()


    // Submit Cancel : 제출 취소
    function cancelAction(){

    	m.params.progStatCd = "J"; // Progress Status Code : 상태코드
		callTangoAjax(3);// 제출 취소

    }// cancelAction()


	function messageCallback(msgId, msgRst){
		switch (msgId) {
		case 'field_docmt_cre':	// Scene Document Create Button Click : 현장서류생성버튼 클릭
			if(msgRst == "Y"){
				createFildDocmt();
			}

			break;
		case 'docmt_down': 		// Document Down Button Click : 서류다운버튼 클릭
			if(msgRst == "Y"){

				m.params.fileKey = m.globalVar.cstrCd;
				m.params.fileName = m.globalVar.cstrCd+"_PIC";
				m.params.zipFileName = m.globalVar.cstrCd+"_Files";
				m.params.skAfcoDivCd = m.globalVar.skAfcoDivCd;
				m.params.screenId = "TS0054752"; // 화면ID (스마트인수인계 준공사진 화면ID 
				m.params.excelFlag = "zip"; // EXCEL : 준공사진  , ZIP : 준공서류
				m.params.uprcAplyDt = m.globalVar.uprcAplyDt;
				
				
				$('body').progress();
	    		 callTangoAjax(6); // Ondemand Batch 등록 - 엑셀다운로드
			}
			break;
		case 'reg_btn':			// Submit Button Click : 제출버튼 클릭
			if(msgRst == "Y"){
				submitAction();
			}
			break;
		case 'cancel_btn':		// Submit Cancel Button Click : 제출취소버튼 클릭
			if(msgRst == "Y"){
				cancelAction();
			}
			break;
		case 'success':
			if(msgRst == "Y"){
    			callTangoAjax(0);// 데이터 조회
			}
			break;
		case "param_error" :
			$a.close();
			break;
		}
	}; // messageCallback()

});