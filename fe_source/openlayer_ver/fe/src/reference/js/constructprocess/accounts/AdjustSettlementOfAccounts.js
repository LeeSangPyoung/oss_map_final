/**
 * AdjustSettlementOfAccounts.js
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
	var loginDept = $('input[name=loginDept]').val();
	var loginDeptType = $('input[name=loginDeptType]').val();
	var popupFlag = 'notFile';

	//세팅
	var m = {
		grid : {
			gridObject : $('#dataGrid')
		},
		form : {
			formObject : $('form[name=searchForm]')
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
			url : function (number){
				var url = 'tango-transmission-biz/transmission/constructprocess/accounts/';
				switch(number){
				default : break;
				case 1: return url += 'adjustSettlementOfAccounts'; break; //가감정산정보 호출
				case 2: return url += 'adjustSettlementOfAccountsDetail'; break;
				}
			}
		},
		flag : {
			get : function (number) {
				switch(number){
				default : return 'submit'; break;
				case 1: return 'info'; break; //가감정산정보 호출
				case 2: return 'detail'; break;
				case 3: return 'save'; break;
				case 4: return 'delete'; break;
				case 5: return 'cancel'; break;
				}
			}
		},
		button : {
			search : function (number){
				switch(number){
				default : return $('#btnSearch'); break;
				case 1 : return $('#btnCstrSearch'); break;
				case 2 : return $('#btnFileAdd'); break;
				}
			},
			proc : function (number) {
				switch(number){
					default : return $('#btnSave'); break; //저장
					case 1 : return $('#btnDel'); break; //삭제
					case 2 : return $('#btnSubm'); break; //제출
					case 3 : return $('#btnSubmCan'); break; //제출취소
					case 4 : return $('#btnLineAdd'); break; //행추가
					case 5 : return $('#btnLineDel'); break; //행삭제
					case 6 : return $('#btnRefresh'); break; //행삭제
					case 7 : return $('#safeMgmtCostAdjtAmt'); break;
				}
			}
		},
		popup:{
			id : function (number){
				return 0 == number ? 'AdjustSettlementOfAccountsAdd' : 'FileAdd';
			},
			title : function (number){
				return 0 == number ? '정산추가' : '파일업로드';
			},
			url : function (number){
				return 0 == number ? 'AdjustSettlementOfAccountsAdd.do' : 'FileAdd.do';
			},
			width : function (number){
				return 0 == number ? '1000' : '450';
			},
			height : function (number){
				return 0 == number ? '900' : '200';
			}
		},
		validate : function (id,message) {
			var objVal = $('input[name='+id+']').val();
			if (null == objVal || '' == objVal.trim() || 0 == objVal.length) {
				callMsgBox('id','W', message, btnMsgCallback);
				return false;
			}
			return true;
		}
	}

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		init(param);
		initGrid();
        setEventListener();
    }

	var httpReferer = '';		// 승인화면 호출 파라미터

    //초기화면
    var init = function (param) {
    	$('input[name=mgmtOrgNm]').setEnabled(false);       //지사명
    	$('input[name=ctrtBpNm]').setEnabled(false);        //계약업체
    	$('input[name=cnstnBpNm]').setEnabled(false);       //시공업체
    	$('input[name=cstrNm]').setEnabled(false);          //공사명
    	$('input[name=setlCnfDt]').setEnabled(false);       //최종승인일자
    	$('input[name=adjtSetlAccAmt]').setEnabled(false);  //정산금액
    	$('input[name=adjtSetlVatAmt]').setEnabled(false);  //부가세
    	$('input[name=adjtSetlSumrAmt]').setEnabled(false); //합계

    	m.button.proc(0).setEnabled(false) //저장버튼
		m.button.proc(1).setEnabled(false) //삭제버튼
		m.button.proc(2).setEnabled(false) //제출버튼
		m.button.proc(3).setEnabled(false) //제출취소버튼
		m.button.proc(4).setEnabled(false) //행추가버튼
		m.button.proc(5).setEnabled(false) //행삭제버튼
		m.button.search(2).setEnabled(false) //파일검색버튼

		$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});

    	httpReferer = param.httpReferer;

    	dateSetting();
    	$('input[name=mgmtOrgNm]').val($('input[name=pMgmtOrgNm]').val());
    	$('input[name=cstrNm]').focus();

    	if($.TcpUtils.isNotEmpty(param.cstrCd)){
    		$('#cstrCd').val(param.cstrCd);
			setConstruction('cstrCd', 'cstrNm');
			$('header').hide();
			initGrid();
		  	setGrid(1);
		  	if($.TcpUtils.isEmpty(httpReferer)){
		  		$('#popHeadDiv').show();
		  	}
    	}
    }

    //Grid 초기화
    var initGrid = function () {
        //그리드 생성
        m.grid.gridObject.alopexGrid({
        	autoColumnIndex: true,
        	rowSingleSelect: false,
        	rowClickSelect: false,
        	rowInlineEdit : true,
        	autoResize: true,
        	defaultColumnMapping:{
        		sorting: true
        	},
    		columnMapping: [{
    		   align : 'center',
    		   key : 'check',
    		   width : '30px',
    		   selectorColumn : true
    	    } , {
				key : 'adjtSetlCstrCd', align:'center',
				title : msgArray['adjtSetlCstrCd'],
				width: '100',
				hidden:true
			}, {
				key : 'cstrNm', align:'left',
				title : msgArray['cstrNm'],
				width: '100'
			}, {
				key : 'erpCtrtNo', align:'center',
				title : msgArray['erpCtrtNo'],
				width: '100'
			}, {
				key : 'ctrtNm', align:'left',
				title : msgArray['ctrtNm'],
				width: '100'
			}, {
				key : 'setlReqDt', align:'center',
				title : msgArray['setlReqDt'],
				width: '100'
			}, {
				key : 'strtgBuyTeamAprvDt', align:'center',
				title : msgArray['strtgBuyTeamAprvDt'],
				width: '100'
			}, {
				key : 'suplDrctDt', align:'center',
				title : msgArray['suplDrctDt'],
				width: '100'
			}, {
				key : 'suplDrctNo', align:'center',
				title : msgArray['suplDrctNo'],
				width: '100'
			}, {
				key : 'setlAmt', align:'right',
				title : msgArray['setlAmt'],
				width: '100'
			}, {
				key : 'adjtAmt', align:'right',
				title : msgArray['adjtAmt']+'(+,-)',
				width: '100',
				allowEdit: function(value, data, mapping) {
					return true;
				},
				render : {type : 'string', rule : 'comma'},
				editable: {type : 'text', attr : {'data-keyfilter-rule':'decimal','maxlength':'10'}}
			}, {
				key : 'adjtSetlRmk', align:'left',
				title : msgArray['adjtSetlRmk'],
				width: '100',
				allowEdit: function(value, data, mapping) {
					return true;
				},
				editable: true
			}, {
				key : 'cstrCd', align:'center',
				title : msgArray['cstrCd'],
				width: '100',
				hidden:true
			}, {
				key : 'budgNm', align:'center',
				title : msgArray['budgNm'],
				width: '100'
			}, {
				key : 'invtCstDivCd', align:'center',
				title : '',
				width: '100',
				hidden:true
			}, {
				key : 'setlDivCd', align:'center',
				title : '',
				width: '100',
				hidden:true
			}
			],

			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
        });

       //gridHide();
    }

    // 컬럼 숨기기
    var gridHide = function () {
    	var hideColList = ['adjtSetlCstrCd','cstrCd'];
    	m.grid.gridObject.alopexGrid('hideCol', hideColList, 'conceal');
	}

    var setEventListener = function () {
    	var param = {'skAfcoDivCd' : $('input[name=skAfcoDivCd]').val()};
    	m.button.search(1).on('click', function(e) {  // 공사명 조회
        	//var comParamArg = ['mgmtOrgNm','cnstnBpNm','cnstnBpId'];
        	//setConstruction('cstrCd', 'cstrNm', comParamArg); // 공사코드, 공사명 외 EngSheet No등 Argument 전송 타입
    		setConstruction('cstrCd', 'cstrNm'); // 공사코드, 공사명 외 EngSheet No등 Argument 전송 타입
    		/*$a.popup({
		     	popid: 'ConstructionCommon',
		     	title: '공사명 조회',
		        url: '/tango-transmission-web/constructprocess/common/ConstructionCommon.do',
		        iframe: true,
		        movable : true,
		        //modal : false,
		        width: 900,
		        height: 760,
		        data: param,
		        callback: function(data) {
						if(data != null){
							$('input[name=cstrCd]').val(data.cstrCd);
							$('input[name=cstrNm]').val(data.cstrNm);
							$('input[name=cnstnBpNm]').val(data.cnstnBpNm);
							$('input[name=mntcBpId]').val(data.cnstnBpId);
							$('input[name=mgmtOrgNm]').val(data.mgmtOrgNm);
							$('input[name=mgmtOrgId]').val(data.mgmtOrgId);
							setGrid(1);
						}
		        }
			});
*/

        });

    	//메인조회
    	$('#btnMainSearch').on('click',function (){
    		setGrid(1);
    	});

    	//새화면
    	m.button.proc(6).on('click',function (){
    		location.reload();
    	});

    	//저장
    	m.button.proc(0).on('click',function (){
    		callMsgBox('saveConfirm','C', msgArray['save'], btnMsgCallback);
    	});

    	//삭제
    	m.button.proc(1).on('click',function (){
    		$('input[name=fileKey]').val('');
    		$('input[name=atflNm]').val('');
    		callMsgBox('deleteConfirm','C', msgArray['delete'], btnMsgCallback);
    	});

    	//제출
    	m.button.proc(2).on('click',function (){
    		var param = m.form.formObject.getData();
    		var adjtSetlAccAmt = parseInt(param.adjtSetlAccAmt.replace(/,/g,''));
    		var existSetlAmt = parseInt(param.existSetlAmt.replace(/,/g,''));
    		var cmprAmtM = adjtSetlAccAmt + existSetlAmt ;

    		if($.TcpUtils.isEmpty(param.cstrNm) == true){
    			callMsgBox('returnMessage','I', '공사명을 입력해주세요' );
    			return;
    		}

    		if($.TcpUtils.isEmpty(existSetlAmt) == true || existSetlAmt == 0){
    			callMsgBox('returnMessage','I', '기존 정산 내역이 없는 대표 공사('+ param.cstrCd +')로 가감 정산 진행 불가합니다.');
    			return;
    		}

			if(cmprAmtM < 0){
    			callMsgBox('returnMessage','I', '대표 공사 : '+ param.cstrCd +'<br>기존 정산 금액 : '+ existSetlAmt +'<br>가감 금액 : '+ adjtSetlAccAmt +'<br>기존 정산 금액보다 큰 금액은 진행할 수 없습니다.');
    			return;
			}
    		
    		var dataList = m.grid.gridObject.alopexGrid('dataGet');
    		var check =  true;
    		var adjtAmt = '';
			var setlAmt = '';
			var adjtCstrCd = '';
			var row = 0;
			dataList.forEach(function(item, index){
//				console.log('체크-1');
				adjtAmt = parseInt(item.adjtAmt.replace(/,/g,''));
				setlAmt = parseInt(item.setlAmt.replace(/,/g,''));
				cmprAmtD = adjtAmt + setlAmt;
//				console.log('cmprAmtD : ' + cmprAmtD);
				if(cmprAmtD < 0){
//					console.log('체크-2');
					row = index+1;
					check = false;
				}
			})
			
			if(!check){
	  			callMsgBox('btnMsgWarning','W', '가감금액이 정산금액보다 큰 공사가 존재합니다. '+ row +'번째 공사목록 확인바랍니다.', null);
	  			return;		
			}
			
    		callMsgBox('submitConfirm','C', msgArray['submit'], btnMsgCallback);
    	});

    	//제출취소
    	m.button.proc(3).on('click',function (){
    		var param =  m.form.formObject.getData();
    		if($.TcpUtils.isEmpty(param.cstrNm) == true){
    			callMsgBox('returnMessage','I', '공사명을 입력해주세요' );
    			return;
    		}
    		callMsgBox('submitCancelConfirm','C', msgArray['cancel'], btnMsgCallback);
    	});

    	//행추가
    	m.button.proc(4).on('click',function (){
    		param = {
    			'compareCstrCd' : $('input[name=cstrCd]').val(),
    			'pMgmtOrgId'    : $('input[name=mgmtOrgId]').val(),
    			'skAfcoDivCd' : $('input[name=skAfcoDivCd]').val()
    		}

    		param.dataList = [];

    		m.grid.gridObject.alopexGrid('dataGet', function(data){
    			param.dataList[data._index.row] = data.erpCtrtNo + data.adjtSetlCstrCd + data.setlDivCd + data.invtCstDivCd;
    		});

    		popupFlag = 'notFile';

    		openPopup(m.popup.id(0)
					, m.popup.title(0)
					, m.popup.url(0)
					, param
					, m.popup.width(0)
					, m.popup.height(0)
					, setDataCallback);
    	});

    	//행삭제
    	m.button.proc(5).on('click',function (){
    		if (0 == m.grid.gridObject.alopexGrid('pageInfo').pageDataLength) {
    			callMsgBox('noData','I', msgArray['noData'], btnMsgCallback);
    			return;
    		}

    		//선택한 데이터를 Object로 변환
    		var data = m.grid.gridObject.alopexGrid('dataGet', {_state: {selected:true}});

    		if (0 < data.length) {
    			callMsgBox('lineDel','C', msgArray['delete'], btnMsgCallback);
    		} else {
    			callMsgBox('checkLine','I', msgArray['checkLine'], btnMsgCallback);
    			return;
    		}
    	});

    	//파일
    	m.button.search(2).on('click',function (){
    		popupFlag = 'file';

    		param = {
    			'fileKey' : $('input[name=fileKey]').val()
    		};

    		openPopup(m.popup.id(1)
					, m.popup.title(1)
					, m.popup.url(1)
					, param
					, m.popup.width(1)
					, m.popup.height(1)
					, setDataCallback);
    	});

    	$('input[name=atflNm]').on('click', function (){
    		if ('' == this.value) {
    			return;
    		}

    		if ('' != $('input[name=fileKey]').val()) {
    			var fileKey = $('input[name=fileKey]').val();
    			fileAdd.getUploadData(fileKey);
    		}
    	});

    	m.button.proc(7).on('keyup', function (event){
    		reg = /^[0-9]*$/;
    		if (!reg.test(this.value)) {
    			$(this).val(this.value.substring(0,(this.value.length-1)))
    			return;
    		}
    	});

 
    }

	//request 성공시
    var successCallback = function (response,stats,xhr,flag){
    	m.grid.gridObject.alopexGrid('hideProgress');

    	var data;

    	//가감 정산 정보 조회
    	if ('info' == flag) {
    		if (0 != response.data.length) {
    			data = response.data;

    			$('input[name=cnstnBpNm]').val(data.cnstnBpNm);
				$('input[name=mntcBpId]').val(data.cnstnBpId);
				$('input[name=mgmtOrgNm]').val(data.mgmtOrgNm);
				$('input[name=mgmtOrgId]').val(data.mgmtOrgId);
    			$('input[name=ctrtBpNm]').val(data.ctrtBpNm);
    			$('input[name=ctrtBpId]').val(data.ctrtBpId);
    			setGrid(2);
    		}
    	}

    	//가감 상세 정보 조회
    	if ('detail' == flag) {
    		var obj = response.data.adjustSettlementOfAccountsInfoVO;
    		var dataList = response.data.detailList;
    		if (null != obj && undefined != obj) {
    			for (var key in obj) {
    				$('input[name='+key+']').val(obj[key]);
    			}

    			if ('2' == obj.gbc) { //제출 처리 된 경우
    				if (undefined != obj['setlReqDt']) { //제출처리 된 경우
    					m.button.proc(0).setEnabled(false) //저장버튼
		    			m.button.proc(1).setEnabled(false) //삭제버튼
		    			m.button.proc(2).setEnabled(false) //제출버튼
		    			m.button.proc(3).setEnabled(true) //제출취소버튼
		    			m.button.proc(4).setEnabled(false) //행추가버튼
		    			m.button.proc(5).setEnabled(false) //행삭제버튼
		    			$('input[name=setlReqDt]').setEnabled(false)//정산요청일
		    			$('input[name=safeMgmtCostAdjtAmt]').setEnabled(false) //안전관리비
		    			m.button.search(2).setEnabled(false) //파일검색버튼

		    			if (undefined != obj['setlCnfDt']) { //지사 승인처리 된 경우
		    				m.button.proc(3).setEnabled(false) //제출취소버튼
		    			}
    				} else { //제출 미처리 된 경우
    					m.button.proc(0).setEnabled(true); //저장버튼
	    				m.button.proc(1).setEnabled(true); //삭제버튼
	    				m.button.proc(2).setEnabled(true); //제출버튼
						m.button.proc(3).setEnabled(false); //제출취소버튼
						m.button.proc(4).setEnabled(true); //행추가버튼
						m.button.proc(5).setEnabled(true); //행삭제버튼
						$('input[name=setlReqDt]').setEnabled(true);
						$('input[name=safeMgmtCostAdjtAmt]').setEnabled(true);
						m.button.search(2).setEnabled(true); //파일검색버튼
    				}
    				$('input[name=newYn]').val('N'); //제출상태
    			} else { //저장 X
    				m.button.proc(0).setEnabled(true); //저장버튼
	    			m.button.proc(1).setEnabled(false); //삭제버튼
	    			m.button.proc(2).setEnabled(false); //제출버튼
	    			m.button.proc(3).setEnabled(false);//제출취소버튼
	    			m.button.proc(4).setEnabled(true); //행추가버튼
	    			m.button.proc(5).setEnabled(true); //행삭제버튼
	    			$('input[name=setlReqDt]').setEnabled(false); //정산요청일
	    			$('input[name=safeMgmtCostAdjtAmt]').setEnabled(false); //안전관리비
	    			m.button.search(2).setEnabled(true); //파일검색버튼

	    			$('input[name=newYn]').val('Y'); //제출상태
    			}

    			//조회 데이터의 정산요청일이 없으면 현재 날짜를 세팅한다.
    			if (undefined == obj['setlReqDt']) {
					$('input[name=setlReqDt]').val(m.date(0));
				}
    		}

    		if (undefined == dataList) {
    			//Alopex Data Empty
    			dataList = [];
    		}
    		m.grid.gridObject.alopexGrid('dataSet', dataList);
    	}

    	//가감 상세 정보 [저장:수정:삭제]
    	if ('save' == flag) {
    		if (undefined != response.returnMessage) {

				callMsgBox('','I', msgArray[response.returnMessage], function(){
					setGrid(1);
				});
    		}
    	}

    	if ('delete' == flag) {
    		if (undefined != response.returnMessage) {

	    		if(response.returnCode == '200'){
					response.returnMessage = msgArray[response.returnMessage];
				}
				callMsgBox('','I', response.returnMessage, function(){
					setGrid(1);
				});
    		}
    	}

    	if ('submit' == flag) {
    		if (undefined != response.returnMessage) {

    			if(response.returnCode == '200'){
    				response.returnMessage = msgArray[response.returnMessage];
    			}
    			callMsgBox('','I', response.returnMessage, function(){
    				setGrid(2);
    			});
    		}
    	}

    	if ('cancel' == flag) {
    		if (undefined != response.returnMessage) {

	    		if(response.returnCode == '200'){
					response.returnMessage = msgArray[response.returnMessage];
				}
				callMsgBox('','I', response.returnMessage, function(){
					setGrid(1);
				});
    		}
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    	if ('save' == flag || 'cancel' == flag) {
    		callMsgBox('error','I', msgArray[response.returnMessage], btnMsgCallback);
    	}
    }

    //코드 로딩 후
    var setSelectByCodeCallBack = function (response) {
    }

    var btnMsgCallback = function (msgId, msgRst){
    	var param =  {};
    	if ('saveConfirm' == msgId && 'Y' == msgRst || 'submitConfirm' == msgId && 'Y' == msgRst
    			|| 'submitCancelConfirm' == msgId && 'Y' == msgRst) {
    		if (!m.validate('cstrCd',msgArray['requiredCstrCd'])) {
    			return;
    		}
    		if (!m.validate('ctrtBpNm',msgArray['requiredCtrtBpNm'])) {
    			return;
    		}
    		if (!m.validate('cnstnBpNm',msgArray['requiredCnstnBpNm'])) {
    			return;
    		}
    		param = {};
    		m.grid.gridObject.alopexGrid('showProgress');

    		if ('saveConfirm' == msgId) {
    			m.grid.gridObject.alopexGrid('dataFlush', function (addedDataList, editedDataList, deletedDataList){
        			var delList = new Array();

        			for (var keys in deletedDataList) {
        				for (var key in deletedDataList[keys]) {
        					if ('adjtSetlCstrCd' == key) {
        						delList.push(deletedDataList[keys]);
        					}
        				}
        			}

        			param.newYn = null != $('input[name=newYn]').val() && undefined != $('input[name=newYn]').val() ? $('input[name=newYn]').val() : 'N';
        			param.adjustSettlementOfAccountsInfoVO = m.form.formObject.getData();
        			param.addList = addedDataList;
        			param.editList = editedDataList;
        			param.deleteList = delList;
        	    	model.post({url : m.api.url(2), data : param ,flag : m.flag.get(3)}).done(successCallback).fail(failCallback);
        		});
    		}

    		if ('submitConfirm' == msgId) {
    			param.adjustSettlementOfAccountsInfoVO = m.form.formObject.getData();
    			model.put({url : m.api.url(1), data : param ,flag : m.flag.get(0)}).done(successCallback).fail(failCallback);
    		}

    		if ('submitCancelConfirm' == msgId) {
    			param.adjustSettlementOfAccountsInfoVO = m.form.formObject.getData();
    			model['delete']({url : m.api.url(1), data : param ,flag : m.flag.get(5)}).done(successCallback).fail(failCallback);
    		}
    	}

    	if ('deleteConfirm' == msgId && 'Y' == msgRst) {
    		param = m.form.formObject.getData();
    		model['delete']({url : m.api.url(2), data : param ,flag : m.flag.get(4)}).done(successCallback).fail(failCallback);
    	}

    	if ('lineDel'  == msgId && 'Y' == msgRst) {
    		//서버연동 비연동 시
			m.grid.gridObject.alopexGrid('dataDelete', {_state: {selected:true}});
    	}
    }

    //팝업 데이터
    var setDataCallback = function (response) {
    	if ('file' != popupFlag) {
    		m.grid.gridObject.alopexGrid('dataAdd',JSON.parse(response));
    	} else {
    		var newFile = response.newFile;
    		$('input[name=atflNm]').val(newFile.originalName[0]);
    		$('input[name=fileKey]').val(newFile.responseCustomValue[0]);

    		// 파일정보 변경 시 저장을 해서 fileKey를 업데이트 해줌
    		//m.button.proc(0).trigger('click');

    		if (!m.validate('cstrCd',msgArray['requiredCstrCd'])) {
    			return;
    		}
    		if (!m.validate('ctrtBpNm',msgArray['requiredCtrtBpNm'])) {
    			return;
    		}
    		if (!m.validate('cnstnBpNm',msgArray['requiredCnstnBpNm'])) {
    			return;
    		}

    		var param =  {};
    		m.grid.gridObject.alopexGrid('showProgress');

    		m.grid.gridObject.alopexGrid('dataFlush', function (addedDataList, editedDataList, deletedDataList){
    			var delList = new Array();

    			for (var keys in deletedDataList) {
    				for (var key in deletedDataList[keys]) {
    					if ('adjtSetlCstrCd' == key) {
    						delList.push(deletedDataList[keys]);
    					}
    				}
    			}

    			param.newYn = null != $('input[name=newYn]').val() && undefined != $('input[name=newYn]').val() ? $('input[name=newYn]').val() : 'N';
    			param.adjustSettlementOfAccountsInfoVO = m.form.formObject.getData();
    			param.addList = addedDataList;
    			param.editList = editedDataList;
    			param.deleteList = delList;
    	    	model.post({url : m.api.url(2), data : param ,flag : m.flag.get(3)}).done(successCallback).fail(failCallback);
    		});
    	}
    }

    //데이터 조회
    var setGrid = function (number) {
    	console.log('setGrid-1');
    	var param =  m.form.formObject.getData();
    	if(number == 1){
    		console.log('setGrid-2');
    		if($.TcpUtils.isEmpty(param.cstrCd) == true){
    			console.log('setGrid-3');
    			callMsgBox('returnMessage','I', '공사명을 입력해주세요' );
    			return;
    		}
    	}
    	m.grid.gridObject.alopexGrid('showProgress');
    	model.get({
    		url  : 1 == number ? m.api.url(number)+'/'+param.cstrCd : m.api.url(number),
    		data : param,
    		flag : m.flag.get(number)
    	}).done(successCallback).fail(failCallback);
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

    //날짜세팅
    var dateSetting = function () {
    	var setlReqDt = $('input[name=setlReqDt]').val();

    	//날짜가 없으면 오늘 날짜를 입력
    	if ('' == setlReqDt) {
    		setlReqDt = m.date(0);
    	}

    	if (isValidDate(setlReqDt.replace(/\-/g,''))) {
    		$('input[name=setlReqDt]').val(setlReqDt);
    	} else {
    		$('input[name=setlReqDt]').val('');
    		alert('정확한 날짜를 입력해주세요.');
    		$('input[name=setlReqDt]').focus();
    		return;
    	}
    }
});