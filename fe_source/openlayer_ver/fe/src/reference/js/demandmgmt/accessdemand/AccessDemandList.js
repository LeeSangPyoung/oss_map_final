/**
 * AccessDemandList
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */

var gridModel = null;
$a.page(function() {
    
	//그리드 ID
    var gridId = 'resultGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	//console.log(id,param);
        initGrid();
    	setCombo();
    	setEventListener();
    	
    };
    

  	//Grid 초기화
    function initGrid() {
    	var mapping =  [
    		{
				width:'40px',
				key : 'check',
				selectorColumn : true
			}
    		, {
				key : 'check',
				align:'center',
				width:'40px',
				title : demandMsgArray['number']/*'번호'*/,
				numberingColumn : true
			}
    		, {
				key : 'acsnwPrjId',
				align:'center',
				width:'120px',
				title : demandMsgArray['projectIdentification']/*'프로젝트ID'*/
			}
    		, {
				key : 'intgFcltsCd',
				align:'center',
				width:'90px',
				title : demandMsgArray['integrationFacilitiesCode']/*'통시코드'*/
			}
    		, {
				key : 'erpIntgFcltsNm',
				align:'left',
				width:'220px',
				title : demandMsgArray['integrationFacilitiesName']/*'통합시설명'*/
			}
    		, {
				key : 'afeYr',
				align:'center',
				width:'60px',
				title : demandMsgArray['afeYear']/*'AFE 연도'*/
			}
    		, {
				key : 'acsnwAfeDgr',
				align:'center',
				width:'60px',
				title : demandMsgArray['afeDegree']/*'AFE 차수'*/
			}
    		, {
				key : 'hdofcNm',
				align:'center',
				width:'70px',
				title : demandMsgArray['hdofc']/*'본부'*/
			}
    		, {
				key : 'erpHdofcCd',
				align:'center',
				width:'25px',
				title : '본부',
				hidden : true
			}
    		, {
				key : 'srvcNm',
				align:'center',
				width:'70px',
				title : demandMsgArray['service']/*'서비스'*/
			}
    		, {
				key : 'acsnwSmtsoNm',
				align:'left',
				width:'220px',
				title : demandMsgArray['smallMtsoName']/*'국소명'*/
			}
    		, {
				key : 'bizNm',
				align:'left',
				width:'200px',
				title : demandMsgArray['businessName']/*'사업명'*/
			}
    		, {
				key : 'demdProgStatNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['progressStatus']/*'진행상태'*/
			}
    		, {
				key : 'trmsDemdMgmtNo',
				align:'center',
				width:'170px',
				title : demandMsgArray['transmissionDemandManagementNumber']/*'전송수요관리번호'*/
			}
    		, {
				key : 'demdBizDivNm',
				align:'left',
				width:'130px',
				title : demandMsgArray['businessDivisionBig']/*'사업구분(대)'*/
			}
    		, {
				key : 'demdBizDivDetlNm',
				align:'left',
				width:'130px',
				title : demandMsgArray['businessDivisionDetl']/*'사업구분(세부)'*/
			}
    		, {
				key : 'acsnwMtrlCostAmt',
				align:'right',
				width:'160px',
				title : 'A망 연동 전송 주물자비',/* A망 연동 전송 주물자비  */
				hidden : true,
				render : {type:"string", rule : "comma"}
			}
    		, {
				key : 'acsnwIncidMtrlCostAmt',
				align:'right',
				width:'160px',
				title : 'A망 연동 전송 부대물자비',/* A망 연동 전송 부대물자비  */
				hidden : true,
			    render : {type:"string", rule : "comma"}
			}
    		, {
				key : 'acsnwInvtCostAmt',
				align:'right',
				width:'160px',
				title : 'A망 연동 전송 공사비',/* A망 연동 전송 공사비 */
				hidden : true,
				render : {type:"string", rule : "comma"}
			}
    		, {
				key : 'eqpCntTotal',
				align:'right',
				width:'60px',
				title : demandMsgArray['equipmentSetCount']/*'장비식수'*/,
				render: function(value, data) { 
					if(nullToEmpty(data.trmsDemdMgmtNo) != "") { 
						return {type:"string", rule : "comma"};
					} else {
						return '';
					}
				}
			}
    		, {
				key : 'eqpInvest',
				align:'right',
				width:'80px',
				title : demandMsgArray['summarizationAmount']/*'합계금액'*/,
				render: function(value, data) { 
					if(nullToEmpty(data.trmsDemdMgmtNo) != "") { 
						return {type:"string", rule : "comma"};
					} else {
						return '';
					}
				}
			}
    		, {
				key : 'lnLenTotal',
				align:'right',
				width:'60px',
				title : demandMsgArray['lineLength']/*'선로길이(km)'*/,
				render: function(value, data) { 
					if(nullToEmpty(data.trmsDemdMgmtNo) != "") { 
						return {type:"string", rule : "comma"};
					} else {
						return '';
					}
				}
			}
    		, {
				key : 'cdlnLenTotal',
				align:'right',
				width:'60px',
				title : demandMsgArray['conductLineLength']/*'관로길이(km)'*/,
				render: function(value, data) { 
					if(nullToEmpty(data.trmsDemdMgmtNo) != "") { 
						return {type:"string", rule : "comma"};
					} else {
						return '';
					}
				}
			}
    		, {
				key : 'sctnLenInvest',
				align:'right',
				width:'80px',
				title : demandMsgArray['amountSummarization']/*'금액합계'*/,
				render: function(value, data) { 
					if(nullToEmpty(data.trmsDemdMgmtNo) != "") { 
						return {type:"string", rule : "comma"};
					} else {
						return '';
					}
				}
				
			}
    		, {
				key : 'bizUsgNm',
				align:'center',
				width:'80px',
				title : demandMsgArray['businessUsage']/*'사업용도'*/
			}
    		, {
				key : 'acsnwMgmtNo',
				align:'center',
				width:'40px',
				title : demandMsgArray['acsnwMgmtNo']/*'관리번호'*/
    		    ,hidden: true
			}
    		, {
				key : 'acsnwDemdMgmtSrno',
				align:'center',
				width:'40px',
				title : demandMsgArray['acsnwDemdMgmtSrno']/*'A망수요관리일련번호'*/
    		    ,hidden: true
			}
    	];    	

    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/demandmgmt/accessdemand/list"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 50,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
        
        //그리드 생성
        $('#'+gridId).alopexGrid({
            cellSelectable : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : false,
            numberingColumnFromZero : false
            ,paging: {
         	   //pagerTotal:true,
         	   pagerSelect:false,
         	   hidePageList:true
            }
            ,headerGroup:
    			[
    				{fromIndex:19, toIndex:20, title:demandMsgArray['equipment']/*"장비"*/},
    				{fromIndex:21, toIndex:23, title:demandMsgArray['ln']+"/" + demandMsgArray['conductLine'] /*"선로/관로"*/}
    		    ]
    	   ,columnMapping : mapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,ajax: {
	         model: gridModel                  // ajax option에 grid 연결할 model을지정
		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
		    }
            ,defaultColumnMapping: {
            	sorting: true
            }
            ,height : (screen.height==900) ? 450 : eval(screen.height * 0.8)
            ,filteringHeader : true
        });
                
        $("#"+gridId).on( 'dblclick', '.bodycell' , function(e){
		    var rowData = AlopexGrid.trimData( AlopexGrid.parseEvent(e).data );
		    rowData.RM = 'DM';
		    $a.popup({
            	popid: 'GetAccessDemandDetailPopup',
            	title: demandMsgArray['accessNetworkDemandInfo'],/*'Access망 수요 전송망 상세정보',*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/accessdemand/AccessDemandDetailPopup.do',
                data: rowData,
                width : 1550,
                height : 800, //window.innerHeight * 0.9,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {
                	if (data == true) {
                		$('#search').click();
                	}
                	
               	}
            });
		});
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
	
    function setCombo() {
    	//AFE 구분 콤보박스
    	selectAfeYearCode('afeYr', 'Y', '');
    	// 사업구분 대
    	selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'A');
    	//본부 콤보박스
    	//selectComboCode('erpHdofcCd', 'Y', 'C00623', '');
		// 로그인 사용자 ERP본부 정보 취득
		//getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
    	
    	// 수요투자 관리자(ENGDM0002)는 일반콤보
		// 수요투자 사용자(ENGDM0001)는 제약콤보
    	/*var adtnAttrVal = $('#adtnAttrVal').val();
		if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0001') > 0 && nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') < 0) {
			getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
		} else if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') > 0) {			
			selectComboCode('erpHdofcCd', 'Y', 'C00623', '');  // 본부 
		} else {
			getUserErpHdofcInfo('erpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
		}*/

    	selectComboCode('erpHdofcCd', 'Y', 'C00623', '');  // 본부 
    	selectComboCode('scDemdProgStatCd', 'Y', 'C00640', '');  // 진행상태105006 
    	//서비스
//    	var requestParam = { afeYr : '2016' };
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/srvcnmlist/'+$("#afeYr").val(), null, 'GET', 'srvcnmlist');
    }
    
    function setEventListener() {


    	$("#pageNo").val(1);
    	$('#rowPerPage').val(15);
        // 검색
        $('#search').on('click', function(e) {

        	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/list', dataParam, 'GET', 'search');
        	var dataParam =  $("#searchForm").getData();
        	bodyProgress();
        	dataParam.pageNo = '1';
        	dataParam.rowPerPage = '50';
    		gridModel.get({
        		data: dataParam,
    		}).done(function(response,status,xhr,flag){successDemandCallback(response, 'search');})
    	  	  .fail(function(response,status,flag){failDemandCallback(response, 'search');});        	
        });
        
        //AFE 구분 콤보박스
        $('#afeYr').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		selectAfeTsCode('afeDemdDgr', 'Y', '', dataParam);
    		selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'A');	// 사업구분 대
    		
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/srvcnmlist/'+$("#afeYr").val(), null, 'GET', 'srvcnmlist');
        });
        
    	//사업 구분(세부) 콤보박스        
    	$('#demdBizDivCd').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		if($('#demdBizDivCd').val() != ""){
    			selectYearBizCombo('demdBizDivDeltCd', 'Y', $("#afeYr").val(), $("#demdBizDivCd").val(), '', 'A');	// 사업구분 소
    		}else{
    			$('#demdBizDivDeltCd').empty();
    			$('#demdBizDivDeltCd').append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$('#demdBizDivDeltCd').setSelected("");
    		}
        });
    	
    	// 진행상태 코드가 셋팅되는 경우
    	$('#scDemdProgStatCd').on('change', function(e) {
    		/*if ($(this).val() == '105006') {
        		$(this).find('option:selected').remove();
    		}*/
    		
    		$(this).find("option[value='105006']").remove(); 
    	});
    	
    	// 본사 코드가 셋팅되는 경우
    	$('#erpHdofcCd').on('change', function(e) {
    		/*if ($(this).val() == '105006') {
        		$(this).find('option:selected').remove();
    		}*/
    		
    		$(this).find("option[value='1000']").remove(); 
    	});
    	
    	// 수요삭제
        $('#btn_delete').on('click', function(e) {
        	removeAccessDemandRow();
        });
        
        // A망속성등록
        $('#btn_add_acsnw_attr').on('click', function(e) {
        	addAcsnwAttr();
        });
        
        $('#btn_Decide_rollback').on('click', function(e) {
        	var dataList = $('#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['selectChangeObject']);   /*변경할 대상을 선택하세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		if (data.demdProgStatCd != '105005') {
        			//"수요확정인수요인 수요만 삭제가 가능합니다.\n" + data.trmsDemdMgmtNo + "의 진행상태를 확인해 주세요.";
        			alertBox('W', makeArgMsg('onlyFixDemandChange', data.trmsDemdMgmtNo));  /*수요확정인수요인 수요만 삭제가 가능합니다.<br>{0}의 진행상태를 확인해 주세요.*/
        			return;
        		}
        	}
        	
        	/*변경하시겠습니까?*/
        	callMsgBox('','C', demandMsgArray['confirmChange'], function(msgId, msgRst){  

        		if (msgRst == 'Y') {

            		bodyProgress();
	            	var updateData = [];
	    			
	    			$.each(dataList, function(idx, obj){
	    				updateData.push(obj);
	    			});
	    			               		        		
	        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/changefixdemdafedgr?method=put'
	        				           , updateData
	        				           , 'POST'
	        				           , 'fixDemdRollbak');
        		}
        	});
        });
        
        //엑셀 다운로드
        $('#btn_dwn_excel').on('click', function(e) {
        	
        	$a.popup({
            	popid: 'TransmissionDemandPoolExcelDownPopup',
            	title: demandMsgArray['engExcelDown'],/*'엑셀다운로드'*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/accessdemand/AccessDemandExcelDown.do',
                data: null,
                width : 500,
                height : 200 , //window.innerHeight * 0.3,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {
                	if (data == "Y" || data == "N" ) {
                    	bodyProgress();
                		var dataParam =  $("#searchForm").getData();
                    	dataParam.firstRowIndex = 1;
                    	dataParam.lastRowIndex = 100000;      
                    	        	
                    	dataParam.fileName = demandMsgArray['accessNetworkDemand'];/*"Access망수요정보";*/
                    	dataParam.fileDataType = "1";  // 1:장비선로;  2:건물
                    	dataParam.erpTranInclude = data;
                    	dataParam.fileExtension = "xlsx";
            	    		    	
            	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemandexcel/exceldownload'
            			           , dataParam
            			           , 'GET'
            			           , 'excelDownload');
                	} 
               	}
            });
        	
	    });
        
        
	    // 엑셀업로드
	    $('#btn_popup').on('click', function(e) {
	   	 $a.popup({
	        	popid: 'AccessDemandExcelUploadPopup',
	        	title: demandMsgArray['engExcelUpload'],/*'Access망수요 엑셀업로드',*/
	        	iframe: true,
	        	modal : true,
	            url: '/tango-transmission-web/demandmgmt/accessdemand/AccessDemandExcelUpload.do',
	            data: null,
	            width : 700,
	            height : 300 //window.innerHeight * 0.4,
	            /*
	        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	        	*/
	            ,callback: function(resultCode) {
                	if (resultCode == "OK") {
                		$('#search').click();
                	}
               	}
		 		,xButtonClickCallback : function(el){
	   	 			alertBox('W', demandMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
	   	 			return false;
	   	 		}
	       });
       });
	    
	    // on-demand excel download
	    $('#excelDownloadByBatch').on('click', function(e) {
	    	var popupCheck = false;
	    	if ($a.popup.names.length > 0 ) {
	    		//$(excelPopup).close();
	    		for (var i=0; i < $a.popup.names.length; i++) {
	    			if ($a.popup.names[i] == "Alopex_Popup_AccessDemandExcelDownPopup") {
	    				popupCheck = true;
	    				break;
	    			}
	    		}
	    		if (popupCheck == true) {
	    			return;
	    		}
	    	}
	    	var dataParam =  $("#searchForm").getData();
	    	excelPopup = $a.popup({
            	popid: 'AccessDemandExcelDownPopup',
            	title: demandMsgArray['engExcelDown'],/*'엑셀다운로드'*/
            	iframe: true,
                modal: false,
		        windowpopup: true,
                //movable: true,
                url: '/tango-transmission-web/demandmgmt/accessdemand/AccessDemandExcelDown.do',
                data: dataParam,
                width : 500,
                height : 250  //window.innerHeight * 0.3
                /*,xButtonClickCallback : function(el){
	   	 			alertBox('W', demandMsgArray['infoClose'] );'닫기버튼을 이용해 종료하십시오.'
	   	 			return false;
	   	 		}*/
		    	,callback: function(resultCode) {
		    		excelPopup = null;
	           	}
            });
        });
	};
	
	function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successDemandCallback( response, flag){

    	if(flag == 'srvcnmlist'){
    		$('#srvcNm').setData({
    			data : response//JSON.stringify(response)
    		});
    		$('#srvcNm').prepend('<option value="">'+demandMsgArray['all']+'</option>');/*전체*/
    		$('#srvcNm').setSelected("");
    	}
    	
    	if(flag == 'search'){
        	bodyProgressRemove();
    		// 검색
    	}
    	if(flag == "deletelist"){
    		bodyProgressRemove();
    		if(response.result.resultMsg.pro == 'OK'){
    			callMsgBox('', 'I', demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    			});
    		} else {
    			callMsgBox('', 'I', demandMsgArray['delFail'], function() {
    				$('#search').click();   
    			});
    		}
    	}
    	
    	if (flag == 'fixDemdRollbak') {
    		if (response.result.code == "OK") {
    			bodyProgressRemove();
    			/*정상적으로 처리되었습니다.*/
    			callMsgBox('', 'I', demandMsgArray['normallyProcessed'], function() {
    				$('#search').click();   
    			});
    		}  else {
    			bodyProgressRemove();
    			alertBox('W', response.errorMsg);
    		}
    		
    		return;
    	}
    	
    	if(flag == 'excelDownload') {    
    		bodyProgressRemove();
    		if (response.code == "OK") {
	    		var $form=$('<form></form>');
				$form.attr('name','downloadForm');
				$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
				$form.attr('method','GET');
				$form.attr('target','downloadIframe');
				// 2016-11-인증관련 추가 file 다운로드시 추가필요 
				$form.append(Tango.getFormRemote());
				$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
				$form.appendTo('body');
				$form.submit().remove();
    		}else {
    			alertBox('W', response.retMsg);
    		}
    	}
    }
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	hideProgress(gridId);
    	bodyProgressRemove();
    	// 엑셀다운로드
    	if(flag == 'excelDownload') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	} 
    	if(flag == 'deletelist') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	} 
    	if(flag == 'search' || flag == 'searchForPageAdd') {
    		alertBox('W', demandMsgArray['searchFail']);
    		return;
    	} 
    	
		//var returnMsg = nullToEmpty(response.message);
		//if (returnMsg == 'undefined' || returnMsg == '') {
			returnMsg = demandMsgArray['systemError'];
		//}
		alertBox('W',  returnMsg);
		return;
    }
    
    /*
	 * Function Name : removeEqpRow
	 * Description   : Access망 행 삭제
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 
	 */
    function removeAccessDemandRow() {
    	var deleteList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {selected:true }} ));
    	
    	if (deleteList.length <= 0) {
    		alertBox('W', demandMsgArray['deleteObjectCheck']);   /*"삭제할 대상을 선택하세요."*/
    		return;
    	}
    	
    	var chkTrnsDmndMngNo = 0;
    	
    	for(var i = 0;i<deleteList.length;i++){
    		if(deleteList[i].trmsDemdMgmtNo == '' || deleteList[i].trmsDemdMgmtNo == null){
    			alertBox('W', demandMsgArray['selectNoDataForRemoveAccessTransmissionDemand']); /*전송망 수요가 등록된 수요를 선택해 주세요."*/
        		return;
    		}
    		if(deleteList[i].demdProgStatCd !="105001"){
    			alertBox('W', demandMsgArray['onlyPlanDemandRemovable']); /*진행상태가 계획수요 이외의 정보는 삭제 불가능 합니다."*/
    			return;
    		}
    	}
    	
    	var dataParam = $("#searchForm").getData();
    	
    	/* 전송망 수요를 삭제하시겠습니까? */ 
    	callMsgBox('','C', demandMsgArray['removeTransmissionDemand'], function(msgId, msgRst){  

    		if (msgRst == 'Y') {
    			bodyProgress();
    			dataParam.gridData = { 
        				deleteList : deleteList
        		};
        		var sflag = {
      				  jobTp : 'deleteList'   // 작업종류
        		};
        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/accessdemand/deletelist', dataParam, 'POST', 'deletelist');
    		}
    	});    	
    }
    
    //A망 속성등록 팝업
    function addAcsnwAttr(){
    	$a.popup({
    		url : 'PopAddAccessAttr.do',
    		iframe : true,
    		modal : false,
    		windowpopup : true,
    		movable : true,
    		width : 1000,
    		height :650,
    		title : demandMsgArray['addAcsnwAttr'], /* A망속성등록 */
    		callback : function(data){
    			if(data == true){
    			}
    		}
    	});
    }
    
});