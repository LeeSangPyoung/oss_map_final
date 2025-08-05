/**
 * CasusersRecoverySumCheck.js 원인자 회수 금액 확인 - 입금내역
 *
 * @author P096430
 * @date 2016. 09. 05. 오후 02:26:00
 * @version 1.0
 */

var m = {
	   file :{
				upload     : null,
				download   : null,
				fileresult : null,
				nm         : "",
				guid       : "",
				url        : "",
				sno        : "",
				delsno     : ""
			},
	globalVar : {
		userId : $('#userId').val(),
		cstrCd : "",
		engstNo : "",
		tmpCnt : 0,
		skDivCd : "",
		parentId : null,
		folderNm : "", // 저장 폴더명
			amt  : "",  // 금액
	},
	params : {

	},
	ajaxProp : [
			{ // API테스트용
				url : 'tango-transmission-biz/transmission/subscriptionmgmt/registration/CasusersRecoverySumCheckYn',
				data : "",
				flag : 'searchYn' /* 0 */
			},
			{
				url : 'tango-transmission-biz/transmission/subscriptionmgmt/registration/CasusersRecoverySumCheck',
				data : "",
				flag : 'search' /* 1 */
			},
			{// 공통코드 여부 조회
				url : 'tango-transmission-biz/transmission/configmgmt/commoncode/orgs',
				data : "",
				flag : 'codeYn' /* 2 */
			},
			{   // 저장 - update 및 파일 업로드
				url : 'tango-transmission-biz/transmission/subscriptionmgmt/registration/CasusersRecoverySumCheckFileSave',
				data : "",
				flag : 'save' /* 3 */
			},
			{   // 파일 다운로드
				url : '',   //'tango-common-business-biz/dext/files/'+ m.file.sno,
				data : "",
				flag : 'fileDownload' /* 4 */
			},
			{   // 파일 삭제 -- 서버
				url : '', // 'tango-common-business-biz/dext/files'+m.file.sno+'?method=delete',
				data : "",
				flag : 'fileDelete' /* 5 */
			} ],
	responseData : {

	},
	message:{

	},
	// 테스트 데이터
	testData : {
		testHeader : {},
		testGrid : [ {} ],
		testFooter : {}
	}

};

var fileCallBack = {
		CallBack : function(){

			if(m.file.fileresult != "" && m.file.fileresult != null ){

				if(m.file.fileresult.newFile.status == "complete"){

					m.file.nm = m.file.fileresult.newFile.originalName[0];
					m.file.guid = m.file.fileresult.newFile.guid[0];
					m.file.url = m.file.fileresult.newFile.uploadPath[0];
					m.file.delsno = m.file.sno;
					m.file.sno = m.file.fileresult.newFile.responseCustomValue[0];

					m.params.ncltPreCstrFilePathNm = m.file.url;        /* 파일경로명 -  */
					m.params.ncltPreCstrFileNm = m.file.nm;             /* 파일명 -  */
					m.params.ncltPreCstrFileUladSrno = m.file.sno;      /* 파일일련번호 -key */

				}
			}else{
				console.log("비었음");
			}

			console.log(m.params);
			localPage.callTangoAjax(3); // 승인 업로드 !!!

			}
		};

var tangoAjaxModel = Tango.ajax.init({});

var localPage = $a.page(function() {

			// 초기 진입점
			// param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
			this.init = function(id, param) {
				console.log(param);

				if (param.engstNo != null && param.engstNo != "") {
					m.globalVar.engstNo = param.engstNo;
				} else {
					m.globalVar.engstNo = ''; // 테스트 ENG 시트번호
				}

				// 승인일자
				if($.TcpUtils.isNotEmpty(param.aprvDt)){
					m.params.aprvDt = param.aprvDt;
				}else{
					m.params.aprvDt = "";
				}

				m.params.lastChgUserId = m.globalVar.userId;

				// ===================================================

				m.params.lastChgUserId = m.globalVar.userId;
				m.params.engstNo = m.globalVar.engstNo;
				setEventListener();

				initGrid();

				this.callTangoAjax(1);// 조회
//				 this.callTangoAjax(2);// 공통코드 조회

				// SKB 원인자공사, 제출일자가 없는 경우 입금전표매핑버튼 활성화
				if($('#skAfcoDivCd').val() == 'B'){
					$('#btnSlipMapp').show();

					if($.TcpUtils.isNotEmpty(m.params.aprvDt)){
						$('#btnSlipMapp').setEnabled(false);
					}
					//$('#btnSlipMapp').hide();
				}else{
					$('#btnSlipMapp').hide();
				}
			};

			// Grid init
			function initGrid() {

			}// initGrid()

			function validateChk() {
				return true;
			}

			// EVENT !!!!!!!!!!!!!
			function setEventListener() {

				// 닫기클릭
				$('.close_btn').on('click', function(e) {
					// console.log('닫기 클릭!!!!');
					// 테스트 파일 정보 삭제
					$a.close("close");
				});

				// 저장클릭
				$('.save_btn').on('click',function(e){
					if(valiChk()){
						callMsgBox('save_btn','C', m.message.save, messageCallback);
					}

				});

				// 입금전표매핑클릭 (SKB원인자공사)
				$('#btnSlipMapp').on('click',function(e){
					$a.popup({
				     	popid: 'SlipMapping',
				     	title: '입금전표 조회',
				        url: '/tango-transmission-web/constructprocess/common/SlipMapping.do',
				        iframe: false,
				        windowpopup: true,
				        //movable: true,
				        width: 700,
				        height: 620,
				        data : {"engstNo": m.params.engstNo, "oldDpstSlipSrno":$('#dpstSlipSrno').val()},
				        callback: function(data) {
								if(data != null){
									localPage.callTangoAjax(1);
								}
				        }
					});
				});

				// 텍스트
				// 청구금액

				$('#dmdAmtMax').on('focusin',function(e){
					m.globalVar.amt = $(this).val().replace(/\W/g,"");
//					console.log("in : "+m.globalVar.amt);
					$(this).val(m.globalVar.amt);
				});

				$('#dmdAmtMax').on('focusout',function(e){
					m.globalVar.amt = setNumFormat($(this).val());
//					console.log("out : "+m.globalVar.amt);
					$(this).val(m.globalVar.amt);
				});

				// 입금금액
				$('#dpstAmtSum').on('focusin',function(e){
					m.globalVar.amt = $(this).val().replace(/\W/g,"");
//					console.log("in : "+m.globalVar.amt);
					$(this).val(m.globalVar.amt);
				});

				$('#dpstAmtSum').on('focusout',function(e){
					m.globalVar.amt = setNumFormat($(this).val());
//					console.log("out : "+m.globalVar.amt);
					$(this).val(m.globalVar.amt);
				});

				// 미회수 선공사 여부 변경시 체크
//				$('#ncltPreCstrYn').on('change',function(e){
//
////					if(this.val() == 'Y'){
////						$('#uploadContainer').setEnabled(true);
////						$('#dmdAmtMax').setEnabled(false); // 청구금액
////						$('#dpstAmtSum').setEnabled(false); // 입금금액
////					}else if(this.val() == 'N'){
////						$('#uploadContainer').setEnabled(false);
////						$('#dmdAmtMax').setEnabled(true); // 청구금액
////						$('#dpstAmtSum').setEnabled(true); // 입금금액
////					}
//
//				});



			} // setEventListener() - 이벤트


			function valiChk(){
				console.log("valiChk()");
				var result = true;

				var dpstAmtSum = $('#dpstAmtSum').val();

				if($('#prwkRsn').val() == ""){
					callMsgBox('','I', "승인 사유를 입력해 주세요.");
					result = false;
				}else{


					if($('#ncltPreCstrYn').val() == 'Y'){
						if($.TcpUtils.isEmpty($('#fileNm').val())){
							callMsgBox('','I', "첨부서류를 추가해 주세요.");
							result = false;
						}
					}else if($('#ncltPreCstrYn').val() == 'N'){
						if($.TcpUtils.isEmpty(dpstAmtSum) || dpstAmtSum == 0){
							callMsgBox('','I', "입금금액이 없어 저장할 수 없습니다.");
							result = false;
						}
					}else{
						callMsgBox('','I', "미회수 선공사 여부를 선택해 주세요.");
						result = false;
					}

				}

				return result;
			}

			// SUCCESS...
			function successFn(response, status, jqxhr, flag) {
				 console.log(response);
//				 console.log(status);
//				 console.log(jqxhr);
//				 console.log(flag);
				switch (flag) {

				case 'searchYn':
					alert(response);
					break;
				case 'search':
					if (response.CasusersRecoverySumCheckInfo != null
							&& response.CasusersRecoverySumCheckInfo != "") {
						$('#CasusersRecoverySumCheckMain').setData(response.CasusersRecoverySumCheckInfo);

						m.file.sno = response.CasusersRecoverySumCheckInfo.ncltPreCstrFileUladSrno;

						$('#dmdAmtMax').val(setNumFormat($('#dmdAmtMax').val()));

						$('#dpstAmtSum').val(setNumFormat($('#dpstAmtSum').val()));
					}
					break;
				case 'codeYn':
//					this.callTangoAjax(1);
					break;

				case 'save':  // 저장 - 업데이트
					callMsgBox('savesuccess','I', m.message.savesuccess, messageCallback);
					// 서버에 저장된 파일 삭제 (키 필요)
					if(m.file.delsno != null && m.file.delsno != "" && m.file.delsno != undefined){
						this.callTangoAjax(5);
					}

					break;
				case 'fileDownload':

					DEXT5UPLOAD.ResetUpload("dext5download"); // 기존 다운로드 파일 초기화

					// 다운로드 파일 셋팅
					DEXT5UPLOAD.AddUploadedFile(
							  response.fileUladSrno
							 ,response.uladFileNm
							 ,response.uladFilePathNm
							 , response.uladFileSz
							 ,response.fileUladSrno
							 ,"dext5download"
							 );

//					DEXT5UPLOAD.DownloadFile("dext5download"); //개별파일 < ---안 먹힘!@@@@

					DEXT5UPLOAD.DownloadAllFile("dext5download"); //모든파일
					break;
				}
			} // successFn()

			// FAIL...
			function failFn(response, status, flag) {
				console.log(response);
//				 console.log(responseJSON);
//				 console.log(status);
//				 console.log(flag);

				switch (flag) {

				case 'searchYnApi':

					break;
				case 'searchYn':

					break;
				case 'codeYn':

					break;
				case 'save':

					break;
				case 'fileDownload':

					break;

				}
			} // failFn()

			// AJAX GET, POST, PUT
			this.callTangoAjax = function (i) {
				console.log("callTangoAjax!!");

				var obj = {url: "", data: "", flag : "" };

				obj.flag = m.ajaxProp[i].flag;

				if(i==10){

				}else if (i==4){
					obj.url = 'tango-common-business-biz/dext/files/'+ m.file.sno;
				}else if (i==5){
					obj.url = 'tango-common-business-biz/dext/files/'+m.responseData.sno+'?method=delete';
				}else if (i==3){
					obj.url = m.ajaxProp[i].url + '/' + m.globalVar.engstNo;
					obj.data = m.params;
				}else{
					obj.url = m.ajaxProp[i].url + '/' + m.globalVar.engstNo;
					obj.data = m.params;
				}

				     if (i == 0) { tangoAjaxModel.get(obj).done(successFn).fail(failFn);  } //
				else if (i == 1) { tangoAjaxModel.get(obj).done(successFn).fail(failFn);  } //
				else if (i == 2) { tangoAjaxModel.post(obj).done(successFn).fail(failFn);	} //
				else if (i == 3) { tangoAjaxModel.put(obj).done(successFn).fail(failFn);  } // 승인
				else if (i == 4) { tangoAjaxModel.get(obj).done(successFn).fail(failFn);  } // 파일다운로드 조회
				else if (i == 5) { tangoAjaxModel.post(obj).done(successFn).fail(failFn); } // 서버파일삭제
				else if (i == 6) { tangoAjaxModel.post(obj).done(successFn).fail(failFn); } //

			} // callTangoAjax()

			function paramsValidate() {

				return true;
			}// paramsValidate


//			$('.header_box > div').append(
//
//						 '<button id="api_btn" type="button" class="Button button2">(TEST)원인자 회수금액 확인(API)</button>'
//
//            );
//
//			$a.convert($('.header_box'));
//
//
////			$('#api_btn').css({'display':'none'});
//			$('#api_btn').on('click', function(e) {
//				 callMsgBox('api_btn','C', m.message.submit, messageCallback);
//			});
//

			/* ***************************************************************** */
			/* 파일업로드 다운로드                                               */
			/* ***************************************************************** */

			/* 파일 업다운 */

			$('.add_btn').on('click',function(e){
				$("#addFile").trigger('click');
			});

			$('#addFile').on('change',function(e){
				fillAddChange($(this).val());

				// 파일 정보 초기화
				m.file.nm   = "";
				m.file.guid = "";
				m.file.url  = "";
				m.file.sno  = "";

			});

			// 파일추가완료
			function fillAddChange(fileAddNm){
				// text에 파일추가

				var str = fileAddNm.toString();

				var nm = str.split("\\");

				console.log(nm[nm.length-1]);

				$('#fileNm').val(nm[nm.length-1]);

//				console.log(fileAddNm);
				//파일업로드 실행
			}// 파일업로드

			// 로컬에 저장;;
			function fileUpload(){
				// 기존 파일 삭제 (1건만 컨트롤시)
				DEXT5UPLOAD.ResetUpload("dext5upload");

				var uploadFile = document.getElementById("addFile");
//				var uploadFile = $("#addFile"); // 인식 못함!!!!

				m.params.ncltPreCstrYn = $('#ncltPreCstrYn').val();                  /* 미회수사전공사여부 -  */
			    m.params.prwkRsn = $("#prwkRsn").val();                              /* 선공사사유 -  */

				if($('#addFile').val() != null && $('#addFile').val() != ""){

					console.log("파일있음 !!") ;
					DEXT5UPLOAD.AddLocalFileObject(uploadFile, "1", "dext5upload"); // 우선 저장
					DEXT5UPLOAD.Transfer("dext5upload");                            // 키를 받기 위한 파일전송

				}else{
					console.log("파일 없음 !!");
					console.log(m.params);
					localPage.callTangoAjax(3); // 승인 업로드 !!!
				}
			};

		// 파일 다운로드
			$('#fileNm').on('dblclick',function(e){
				// test
					console.log("sno : "+ m.file.sno);

				if(m.file.sno != null && m.file.sno != "" && m.file.sno != undefined ){
					console.log("다운받을 파일 있음");

					localPage.callTangoAjax(4); // 파일 다운로드

				}else{
					if($('#fileNm').val() != null && $('#fileNm').val() != "" && $('#fileNm').val() != undefined ){
						callMsgBox("","W","저장된 파일만 다운받을 수 있습니다.");
					}
				}

			});

			// 숫자 3자리 콤마 찍기
			function setNumFormat(num){
				if(num > 0){
					return num.replace(/\B(?=(\d{3})+(?!\d))/g,",");
				}
				return num;
			}

			function messageCallback(msgId, msgRst){

				console.log("msgId : "+msgId+"\n msgRst : "+msgRst);

				switch (msgId) {

				case 'save_btn':
					if(msgRst == 'Y'){
						fileUpload();
					}
					break;
				case 'api_btn':
					if(msgRst == 'Y'){
						localPage.callTangoAjax(0);
					}
					break;
				case 'savesuccess':
					if(msgRst == 'Y'){
						$a.close("close");
					}
					break;
				}
			};
});