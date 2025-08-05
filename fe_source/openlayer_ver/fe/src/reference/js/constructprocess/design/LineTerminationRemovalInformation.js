/**
 * LineTerminationRemovalInformation.js
 *
 * @author P096430
 * @date 2016. 10. 06. 오전 10:37:00
 * @version 1.0
 */

var m = {
			globalVar 	: {
							userId          :     "testUser"     ,
							cstrCd          :     ""             ,
							flag            :     ""             , // 설계 : S, 정산 : J
							prj_kind        :     ""               // 공사구분 코드
						   },
            page        : {
							pageNo1         :      1             ,
							rowPerPage1     :      30            ,
			                totalPageCnt1   :      0             ,
			                nextPageNo1     :      0
            			   },
			params    	: {},
			ajaxProp  	: [
				             {  // Search Grid
				            	url:'tango-transmission-biz/transmission/constructprocess/design/getLineTerminationRemovalInformationList',
				            	data:"",
				            	flag:'searchGrid' // 0
				             },
				             {  // Save Grid
				            	url:'tango-transmission-biz/transmission/constructprocess/design/updateLineTerminationRemovalInformationList',
				            	data:"",
				            	flag:'saveGrid' // 1
				             }
			              ],
		responseData   : {},
	    message        : {},
	    userInfo       : {},
	    popup          : null

	};

var tangoAjaxModel = Tango.ajax.init({});




var localPage = $a.page(function() {
//	console.log(m);

//	console.log(JSON.stringify(parent.m.userInfo));

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

//    	m.globalVar.cstrCd = param.cstrCd;

    	console.log("부모공사코드 : "+parent.baseInform.hiddenCstrCd.value);
    	console.log("FLAG : " + parent.baseInform.hiddenProcFlag.value); // S: 설계, J: 정산
    	console.log("사업구분 : "+parent.baseInform.hiddenLowDemdBizDivCd.value);

    	if(parent.baseInform.hiddenCstrCd.value != null && parent.baseInform.hiddenCstrCd.value != "" &&
    	   parent.baseInform.hiddenProcFlag.value != null && parent.baseInform.hiddenProcFlag.value != "" &&
    	   parent.baseInform.hiddenLowDemdBizDivCd.value != null && parent.baseInform.hiddenLowDemdBizDivCd.value != ""
    	){
	    	param.cstrCd = parent.baseInform.hiddenCstrCd.value;
	    	param.flag = parent.baseInform.hiddenProcFlag.value;
	    	param.prj_kind = parent.baseInform.hiddenLowDemdBizDivCd.value;
    	}

    	if(param.cstrCd != null && param.cstrCd != ""){
    		m.globalVar.cstrCd = param.cstrCd;
    	}else{
//    		m.globalVar.cstrCd = "P20138565901";
//        	m.globalVar.cstrCd = parent.$('#cstrCd').val();

    	}
    	m.params.cstrCd = m.globalVar.cstrCd;
    	console.log("넘어온 파라미터 : " + param)
    	console.log("넘겨준 파라미터1 : "+param.cstrCd);
    	console.log("넘겨준 파라미터2 : "+m.globalVar.cstrCd);

    	$('.add_btn').css('display','none');
		$('.del_btn').css('display','none');

    	if(param.flag != null && param.flag != ""){
    		m.globalVar.flag = param.flag;
    	}else{
    		m.globalVar.flag = "S";
    	}

    	if(param.prj_kind != null && param.prj_kind != ""){
    		m.globalVar.prj_kind = param.prj_kind;
    	}else{
    		m.globalVar.prj_kind = "E10"; /* 테스트용  코드 변경 예정 - 한병곤*/
    	}

    	initGrid();

		setEventListener();

		callTangoAjax(0) // Search Grid
    };

  //Grid 초기화
    function initGrid() {
    	 $('#grid').alopexGrid({
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting: false
			},
		    rowOption:{
		    	defaultHeight:30
		    },
		    message : {
		    	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>조회된 데이터가 없습니다.</div>",
        		filterNodata: 'No data'
		    },
			columnMapping : [
								{ key : 'cstrCd'            ,title : '공사코드'            ,defaultValue : m.globalVar.cstrCd ,hidden:true  },
			                 	{ key : 'lastChgUserId'     ,title : '사용자'             ,defaultValue : m.userInfo.userId ,hidden:true },
			                 	{ key : 'reqAcepDtm'			,title : '요청접수일자',
			                 	  render : function ( value, data, render, mapping, grid ) {
						    					return setDateFormatCustom(value.substr(0, 12),'','');
						    				}
			                    },
								{ key : 'srvcMgmtNo'			,title : '서비스관리번호'		},
								{ key : 'tmrvTypCd'			,title : '' ,hidden:true	},
								{ key : 'tmrvTypNm'			,title : '해지철거유형'			},
								{ key : 'trmnStatDivCd'			,title : '해지상태구분코드'		},
								{ key : 'trmnStatDivCdNm'		,title : '해지상태구분코드명'		},
								{ key : 'eqpTidVal'				,title : '장비TID'			},
								{ key : 'mtsoId'				,title : '국사코드'			},
								{ key : 'mtsoNm'				,title : '국사명'				},
								{ key : 'ldongCd'				,title : '법정동코드'			},
								{ key : 'addrId'				,title : '주소ID'				},
								{ key : 'bldNm'					,title : '건물명'				},
								{ key : 'tmrvAddrNm'			,title : '' ,hidden:true	},
								{ key : 'srvcTechmNm'			,title : '' ,hidden:true	},
								{ key : 'eqpScrbrAcptYn'		,title : '' ,hidden:true	},
								{ key : 'trmnMgmtNo'			,title : '해지관리번호'			},
								{ key : 'coreMgmtNo'			,title : '코어관리번호'			}
			]
    	});

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    }

    function setEventListener() {

    	// Grid Scroll Event
    	$('#grid').on('scrollBottom', function(e) {
    		if(m.page.nextPageNo1 > m.page.totalPageCnt1){
    			return false;
    		}else{
    			m.page.pageNo1 = m.page.nextPageNo1;
    			callTangoAjax(0) // Search Grid
    		}
    	});

    	// ADD_BTN CLICK
    	$('.add_btn').on('click',function(e){

		  $a.popup({
			  		popid: 'LineTerminationRemovalInformationLookup' // 중복클릭방지 id 필요
		            ,title : '선로해지철거 정보 추가'
		            ,url : '/tango-transmission-web/constructprocess/design/LineTerminationRemovalInformationLookup.do'
		            ,iframe: true
//		            ,iframe: false
//		            ,windowpopup: true
		            ,width : 900
		            ,height : 600
		            ,data : {'cstrCd':m.globalVar.cstrCd,'flag':m.globalVar.flag,'prj_kind':m.globalVar.prj_kind}
		            ,callback : function(data){
			            			console.log(data);
			            			if(data != null && data != "" && data != "close"){
			            				$('#grid').alopexGrid('dataSet', data);
			            			}
		            			}
		        });

    	});

    	// DEL_BTN CLICK
    	$('.del_btn').on('click',function(e){

    		var data = $('#grid').alopexGrid('dataGet');

    		if(data != null && data != ""){
    			data = $('#grid').alopexGrid('dataGet',{_state:{selected:true}});
    			if(data != null && data != ""){
    			callMsgBox('deleteRow','C', m.message.confirmDeleteRow, messageCallback); // 행삭제 하시겠습니까?
    			}else{
    				callMsgBox('','I', m.message.selectDeleteRow); // 선택된 데이터가 없습니다.
    			}
    		}else{
    			callMsgBox('','I', m.message.noData); // 데이터가 없습니다.
    		}
    	});
	};

	//request 성공시
	function successFn(response, status, jqxhr, flag){
		console.log(response);
		switch (flag) {

		case 'searchGrid':
//			$('body').progress().remove();
			if(response.LineTerminationRemovalInformationList != null && response.LineTerminationRemovalInformationList != ""){

				if(response.pager != null && response.pager != ""){
	    			//===================
	    			m.page.totalPageCnt1 = Math.ceil(response.pager.totalCnt / response.pager.rowPerPage);
	    			m.page.nextPageNo1 = response.pager.pageNo + 1;

	    			$('#grid').alopexGrid('updateOption',
							{paging : {pagerTotal: function(paging) {
								return '총 건수 : ' + response.pager.totalCnt;
							}}}
					);

	    		}
	    		if(m.page.pageNo1 == 1){
	    			$('#grid').alopexGrid('dataSet', response.LineTerminationRemovalInformationList);
	    		}else{
	    			$('#grid').alopexGrid('dataAdd', response.LineTerminationRemovalInformationList);
	    		}
			}
			break;
		case 'saveGrid':
			callMsgBox('','I', m.message.savesuccess);
			break;

		}
    }

    //request 실패시.
	function failFn(response, status, jqxhr, flag){

    	switch (flag) {
		case 'searchGrid':
			$('body').progress().remove();
			break;
		case 'saveGrid':
			callMsgBox('','W', m.message.savefail);
			break;
		}
    }

    // AJAX GET, POST, PUT
    function callTangoAjax(i){

//    	$('body').progress();

    	var url = m.ajaxProp[i].url;

    	if(i==0){
    		m.params.pageNo = m.page.pageNo1;
    		m.params.rowPerPage = m.page.rowPerPage1;
    		
	    	// 공동투자-참여사시 cstrCd 대체 2017.08.25 추가
			console.log("efdg_subTabs4 : ");
			console.log(m.param.cstrCd);
			console.log(parent.m.hidden.jintInvtOnrCstrCd.value);
			if($.TcpUtils.isNotEmpty(parent.m.hidden.jintInvtOnrCstrCd.value)){
					m.param.cstrCd = parent.m.hidden.jintInvtOnrCstrCd.value;
					param.skAfcoDivCd = parent.m.hidden.jintInvtOnrCstrCd.value.substring(0,1);
			}
			console.log(m.param.cstrCd);
    		
    		
    		
    	}else if(i==1){
    		m.ajaxProp[i].url = url+"/"+m.globalVar.cstrCd
    		m.params = $('#grid').alopexGrid('dataGet');
    		console.log(m.params);
    	}
    	m.ajaxProp[i].data = m.params;
    	
    	     if(i == 0){ tangoAjaxModel.get(m.ajaxProp[i]).done(successFn).fail(failFn);  }  // Search Grid
    	else if(i == 1){ tangoAjaxModel.put(m.ajaxProp[i]).done(successFn).fail(failFn);  }  //

    	m.ajaxProp[i].url = url;

    } // callTangoAjax()

	function messageCallback(msgId, msgRst){

		console.log("msgId : "+msgId+"\n msgRst : "+msgRst);
		switch (msgId) {
		case 'save_btn':
			if(msgRst == 'Y'){
				callTangoAjax(1);
			}
			break;
		case 'deleteRow':
			if(msgRst == 'Y'){
				$('#grid').alopexGrid('dataEmpty');
			}
			break;
		}
	};

	//document.getElementById('iframe2').contentWindow.localPage.save();
	this.save = function(){
		callMsgBox('save_btn','C', m.message.save,messageCallback);
	}

	// =======< TEST SAVE >====================
	$('.header_box > div').append(
			//'<button class="Button button2 save_btn" >(test)저장</button>'
	);

	$('.save_btn').convert();

	$('.save_btn').on('click',function(e){
		localPage.save();
	});
	// =======< TEST SAVE END >====================
});