/** 
 * Transmissiondemandpool
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */

var gridModel = null;
$a.page(function() {
    
	//그리드 ID
    var gridTrPoolId = 'resultListGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	//console.log(id,param);
        initGrid();
		// 기준AFE구분 구함
		getStdAfeDiv();
    	
    };
    // 수량초기화
    

  	//Grid 초기화
    function initGrid() {
    	var mapping =  [
    		  { key : 'check', 				align:'center', width:'40px',  	selectorColumn : true }
    		, { key : 'trmsDemdMgmtNo', 	align:'center', width:'170px', 	title : demandMsgArray['transmissionDemandManagementNumber']} /*전송수요관리번호*/ 
    		, { key : 'cblnwPrityRnk', 		align:'center', width:'80px', 	title : demandMsgArray['prty'] }/*우선순위*/
    		, { key : 'frstRegDate', 		align:'center', width:'80px', 	title : demandMsgArray['registrationDate'] }/*등록일자*/
    		, { key : 'afeYr', 				align:'center', width:'70px', 	title : demandMsgArray['afeYear'], }/*AFE년도*/
    		, { key : 'afeDemdDgr', 		align:'center', width:'70px', 	title : demandMsgArray['afeDegree'], }/*AFE차수*/
    		, { key : 'erpHdofcCd', 		align:'left', width:'70px', 	title : demandMsgArray['hdofc'], hidden : true }/*본부코드*/
    		, { key : 'erpHdofcNm', 		align:'left', width:'70px', 	title : demandMsgArray['hdofc'], }/*본부명*/
    		, { key : 'demdProgStatCd', 	align:'center', width:'80px', 	title : demandMsgArray['progressStatusCode'], 			hidden : true }/*진행상태코드*/
    		, { key : 'demdProgStatNm', 	align:'left', 	width:'90px',  	title : demandMsgArray['progressStatus'], }/*진행상태*/
    		, { key : 'bizNm', 				align:'left', 	width:'220px', 	title : demandMsgArray['businessName'], }/*사업명*/
    		, { key : 'demdBizDivCd', 		align:'left', 	width:'40px', 	title : demandMsgArray['businessDivisionBig'], 	hidden : true }/*사업구분(대)*/
    		, { key : 'demdBizDivNm', 		align:'left', 	width:'120px', 	title : demandMsgArray['businessDivisionBig'] }/*사업구분(대)*/
    		, { key : 'demdBizDivDetlCd', 	align:'left', 	width:'50px', 	title : demandMsgArray['businessDivisionDetl'], 	hidden : true }/*사업구분(세부)코드*/
    		, { key : 'demdBizDivDetlNm', 	align:'left', 	width:'220px', 	title : demandMsgArray['businessDivisionDetl'] }/*사업구분(세부)*/
    		, { key : 'eqpCnt', 			align:'right', 	width:'70px', 	title : demandMsgArray['equipmentSetCount'] }/*장비식수*/
    		, { key : 'eqpInvestAmt', 		align:'right', 	width:'80px', 	title : demandMsgArray['amount'], 	render: {type:"string", rule : "comma"} }/*금액*/
    		, { key : 'lnLen', 				align:'right', 	width:'70px', 	title : demandMsgArray['lineLength'], render: {type:"string", rule : "comma"} }/*선로길이*/
    		, { key : 'cdlnLen', 			align:'right', 	width:'70px', 	title : demandMsgArray['conductLineLength'], render: {type:"string", rule : "comma"} }/*관로길이*/
    		, { key : 'lnInvestAmt', 		align:'right', 	width:'80px', 	title : demandMsgArray['amount'], 	render: {type:"string", rule : "comma"} }/*금액*/
    		, { key : 'erpHdofcCd', 		align:'center', width:'40px', 	title : demandMsgArray['headOfficeCode'], hidden : true }/*본부코드*/
    		, { key : 'erpHdofcNm', 		align:'center', width:'80px', 	title : demandMsgArray['hdofc'] }/*본부*/
    		, { key : 'hdqtrChrgUserId', 	align:'center', width:'80px', 	title : demandMsgArray['headquartersThePersonInCharge'], hidden : true	 }/*본사담당자*/
    		, { key : 'hdqtrChrgUserNm', 	align:'center', width:'80px', 	title : demandMsgArray['headquartersThePersonInCharge'] }/*본사담당자*/
    		, { key : 'areaChrgUserId', 	align:'center', width:'80px',	title : demandMsgArray['areaThePersonInCharge'],	hidden : true			}/*지역담당자*/
    		, {	key : 'areaChrgUserNm',		align:'center',	width:'80px',	title : demandMsgArray['areaThePersonInCharge'] 	}/*지역담당자*/
    		, {	key : 'detlUsgRmk',			align:'center',	width:'120px',	title : demandMsgArray['remarkDetailUsage']}/*비고(세부용도)*/
    		, {	key : 'frstRegUserNm',		align:'center',	width:'80px',	title : demandMsgArray['registrant']}/*등록자*/
		];

    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/list"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 15,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
    	
        //그리드 생성
        $('#'+gridTrPoolId).alopexGrid({
        	//extend : ['resultListGrid'],
            fitTableWidth : true,
            //rowClickSelect : false,
            rowSingleSelect : false,
            rowInlineEdit : false,
            numberingColumnFromZero : false
            ,cellSelectable : true
        	,headerGroup:
    			[
    				{fromIndex:15, toIndex:16, title:demandMsgArray['equipment']},/*장비*/
    				{fromIndex:17, toIndex:19, title:demandMsgArray['ln'] +"/"+demandMsgArray['conductLine']}/*선로/관로*/
    		    ]
    	   ,columnMapping : mapping
    	   /*,ajax: {
    		    scroll:true
    	   }*/
           ,paging: {
        	   //pagerTotal:true,
        	   pagerSelect:false,
        	   hidePageList:true
           },
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
           ,ajax: {
  	         model: gridModel                  // ajax option에 grid 연결할 model을지정
  		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
  		    }
           //,height : 450
           /*,defaultColumnMapping : {
        	   sorting: true
           }
           ,filteringHeader : true*/
        });
        
    };
    
    var showProgress = function(gridTrPoolId){
    	$('#'+gridTrPoolId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridTrPoolId){
		$('#'+gridTrPoolId).alopexGrid('hideProgress');
	};
    
	//request
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
	
	/*
	 * Function Name : getStdAfeDiv
	 * Description   : 기본afe차수 정보 취득
	 */
	function getStdAfeDiv() {
		
		var requestParam = { 
		};
		
		var sflag = {
				  jobTp : 'getStdAfeDiv'
		};
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/getstdafediv'
				           , requestParam
				           , 'GET'
				           , "getStdAfeDiv");		
	}
    
	function setInitPage() {
		// 수요투자 관리자(ENGDM0002)는 일반콤보
		// 수요투자 사용자(ENGDM0001)는 제약콤보
		/*var adtnAttrVal = $('#adtnAttrVal').val();
		if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0001') > 0 && nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') < 0) {
			getUserErpHdofcInfo('scErpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
		} else if (nullToEmpty(adtnAttrVal).indexOf('ENGDM0002') > 0) {			
			selectComboCode('scErpHdofcCd', 'Y', 'C00623', '');  // 본부 
		} else {
			getUserErpHdofcInfo('scErpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
		}*/
    	//소구분 콤보박스
    	//selectComboCode('scErpHdofcCd', 'Y', 'C00623', '');  // 본부 
		// 로그인 사용자 ERP본부 정보 취득
		//getUserErpHdofcInfo('scErpHdofcCd', 'Y', $('#viewUperOrgId').val(), $('#viewOrgId').val());
		
		selectComboCode('scErpHdofcCd', 'Y', 'C00623', '');  // 본부 
    	selectComboCode('scDemdProgStatCd', 'Y', 'C00640', '');  // 진행상탱 
    	selectYearBizCombo('scDemdBizDivCd', 'Y', $('#baseAfeYr').val(), 'C00618', '', 'T');	// 사업구분 대
    	
    	// 등록일자
    	$("#scFrstRegDateStart").val(getViewDateStr("YYYYMMDD", -30));
		$("#scFrstRegDateEnd").val(getViewDateStr("YYYYMMDD"));
		
   }
	    
    function setEventListener() {

    	$("#pageNo").val(1);
    	$('#rowPerPage').val(15);
        // 검색
        $('#search').on('click', function(e) {
        	/*//tango transmission biz 모듈을 호출하여야한다.
        	
        	demandRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/list', dataParam, 'GET', 'search');*/
        	var dataParam =  $("#searchForm").getData();

        	dataParam.scFrstRegDateStart = $("#scFrstRegDateStart").val().replace(/-/gi, "");
        	dataParam.scFrstRegDateEnd = $("#scFrstRegDateEnd").val().replace(/-/gi, "");
        	dataParam.scDemdBldAddr = $("#scDemdBldAddr").val().replace(/ /gi, "");
        	      		
        	bodyProgress();
        	dataParam.pageNo = '1';
        	dataParam.rowPerPage = '15';
    		gridModel.get({
        		data: dataParam,
    		}).done(function(response,status,xhr,flag){successDemandCallback(response, 'search');})
    	  	  .fail(function(response,status,flag){failDemandCallback(response, 'search');});        	
        });
        
        //조회-AFE 구분 콤보박스
        $('#scAfeYr').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData(); 
    		dataParam.afeYr = $('#scAfeYr').val();
    		selectAfeTsCode('scAfeDemdDgr', 'Y', '', dataParam);
    		selectYearBizCombo('scDemdBizDivCd', 'Y', $("#scAfeYr").val()!="" ?  $('#scAfeYr').val() :  $("#baseAfeYr").val(), 'C00618', '', 'T');	// 사업구분 대
        });

    	//사업 구분(세부) 콤보박스        
    	$('#scDemdBizDivCd').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		if($('#scDemdBizDivCd').val() != ""){
    			selectYearBizCombo('scDemdBizDivDetlCd', 'Y', $("#scAfeYr").val()!="" ?  $('#scAfeYr').val() :  $("#baseAfeYr").val(), $("#scDemdBizDivCd").val(), '', 'T');	// 사업구분 소
    		}else{
    			$('#scDemdBizDivDetlCd').empty();
    			$('#scDemdBizDivDetlCd').append('<option value="">'+demandMsgArray['all']+'</option>');
    			$('#scDemdBizDivDetlCd').setSelected("");
    		}
        });
        
        //계획수요-AFE 구분 콤보박스
        $('#dfAfeYr').on('change',function(e) {
    		var dataParam = {afeYr:$('#dfAfeYr').val()}; 
    		selectAfeTsCode('dfAfeDemdDgr', 'N', '', dataParam);
        });
        
        // 진행상태 변경시

        /*$('#scDemdProgStatCd').on('change',function(e) {
    		if ($(this).val() == '105006') {
        		$("#btn_add_afe").setEnabled(true);
        		$("#btn_remove_afe").setEnabled(false);
    		} else if ($(this).val() == '105001') {
    			$("#btn_add_afe").setEnabled(false);
        		$("#btn_remove_afe").setEnabled(true);
    		} else {
    			$("#btn_add_afe").setEnabled(false);
        		$("#btn_remove_afe").setEnabled(false);
    		}
        });*/
        
        // 유선망 등록화면
        $('#btn_trnspooldetail').click( function() {
         var dataParam = {
        		  baseAfeYr : $('#baseAfeYr').val()
        	    , baseAfeDemdDgr : $('#baseAfeDemdDgr').val()
         };
       	 $a.popup({
            	popid: 'GetTransmissionDemandPoolDetailPopup',
            	title: demandMsgArray['cableNetworkDemandInfo'],/*유선망수요정보*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandPoolDetail.do',
                data: dataParam,
                width : 1600,
                height : 800,//window.innerHeight * 0.95,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {
                	if (data == true) {
                		// 저장 혹은 수정이 있는경우 재검색
                		$('#search').click();
                	}
               	}
            });
       });
        
       //
        $('#btn_Decide_rollback').on('click', function(e) {
        	var dataList = $('#'+gridTrPoolId).alopexGrid("dataGet", {_state : {selected:true}} );
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
        
        
        
       // 엑셀다운로드
        $('#btn_dwn_excel').on('click', function(e) {
       	 $a.popup({
            	popid: 'TransmissionDemandPoolExcelDownPopup',
            	title: demandMsgArray['engExcelDown'],/*'엑셀다운로드'*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandPoolExcelDown.do',
                data: null,
                width : 500,
                height : 200,//window.innerHeight * 0.3,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {
                	if (data == "1" || data == "2" ) {
                		bodyProgress();  	
            	    	var dataParam =  $("#searchForm").getData();
                    	dataParam.baseAfeYr = $('#baseAfeYr').val();
                    	//dataParam.firstRowIndex = 1;
                    	//dataParam.lastRowIndex = 100000;      
                    	        	
                    	dataParam.scFrstRegDateStart = $("#scFrstRegDateStart").val().replace(/-/gi, "");
                    	dataParam.scFrstRegDateEnd = $("#scFrstRegDateEnd").val().replace(/-/gi, "");
            	    		    	
                    	dataParam.fileName = demandMsgArray['cableNetworkDemand'] + "_" + (data == "1" ? demandMsgArray['equipment'] +  demandMsgArray['ln'] : demandMsgArray['building']);/*"유선망수요"*//*"장비선로" : "건물"*/
                    	dataParam.fileDataType = data;  // 1:장비선로;  2:건물
                    	dataParam.fileExtension = "xlsx";
            	    		    	
            	    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpoolexcel/exceldownload'
            			           , dataParam
            			           , 'GET'
            			           , 'excelDownload');
                	} 
               	}
            });
       });
        
       // 엑셀업로드
        $('#btn_add_excel').on('click', function(e) {
       	 $a.popup({
            	popid: 'TransmissionDemandPoolExcelUploadPopup',
            	title: demandMsgArray['engExcelUpload'], /*'유선망수요 엑셀업로드'*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandPoolExcelUpload.do',
                data: null,
                width : 800,
                height : 400 //window.innerHeight * 0.5,
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
        
       // 등록일자 전체 클릭
        $('#dateAll').click( function() {
        	if ($(this).is(":checked")) {
        		$("#scFrstRegDateStart").val("");
        		$("#scFrstRegDateEnd").val("");
        		$("#scFrstRegDateStart").attr("disabled", true);
        		$("#scFrstRegDateEnd").attr("disabled", true);        		
        	} else {
        		$("#scFrstRegDateStart").val(getViewDateStr("YYYYMMDD", -30));
        		$("#scFrstRegDateEnd").val(getViewDateStr("YYYYMMDD"));
        		$("#scFrstRegDateStart").attr("disabled", false);
        		$("#scFrstRegDateEnd").attr("disabled", false);        	
        	}

        });
        

        // 더블클릭시 상세화면
        $('#'+gridTrPoolId).on('dblclick', '.bodycell', function(e) {
        	var object = AlopexGrid.parseEvent(e);       	
        	var dataParam = object.data;
        	dataParam.baseAfeYr = $('#baseAfeYr').val();
        	dataParam.baseAfeDemdDgr = $('#baseAfeDemdDgr').val();
        	
        	$a.popup({
            	popid: 'GetTransmissionDemandPoolDetailPopup',
            	title: demandMsgArray['cableNetworkDemandInfo'],/*'유선망수요정보'*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandPoolDetail.do',
                data: dataParam,
                width : 1600,
                height : 800, //window.innerHeight * 0.95,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {
                	if (data == true) {
                		// 저장 혹은 수정이 있는경우 재검색
                		$('#search').click();
                	}
               	}
            });
        });
                
        // AFE차수지정
        $('#btn_add_afe').click( function() {
        	var dataList = $('#'+gridTrPoolId).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['selectNoDataForAfe']); /*"선택된 데이터가 없습니다.\nAFE차수를 지정할 데이터를 선택해 주세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		if (data.demdProgStatCd != '105006') {
        			alertBox('W', makeArgMsg('onlyDemandPoolUpdatable', data.trmsDemdMgmtNo));  /*"수요POOL인 수요만 AFE차수지정이 가능합니다.\n" + data.trmsDemdMgmtNo + "의 진행상태를 확인해 주세요."*/
        			return;
        		}
        		if (nullToEmpty(data.demdBizDivNm) == '') {
        			//"사업구분(대)가 존재하는 수요만 AFE차수지정이 가능합니다.\n" + data.trmsDemdMgmtNo + "의 사업구분(대)를 확인해 주세요."
        			alertBox('W', makeArgMsg('onlyBizCodeUpdateable', data.trmsDemdMgmtNo));
        			return;
        		}
        		if (nullToEmpty(data.demdBizDivDetlNm) == '') {
        			//"사업구분(세부)가 존재하는 수요만 AFE차수지정이 가능합니다.\n" + data.trmsDemdMgmtNo + "의 사업구분(세부)를 확인해 주세요.";
        			alertBox('W', makeArgMsg('onlyBizDetailCodeUpdateable', data.trmsDemdMgmtNo));
        			return;
        		}
        	}
        	
        	$a.popup({
            	popid: 'DefineAfe',
            	title: demandMsgArray['afeDegreeAppointment'],/*'AFE 차수 지정'*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandPoolDefineAfe.do',
                data: null,
                width : 500,
                height : 200, //window.innerHeight * 0.3,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {
                	/*if (nullToEmpty($('#dfAfeYr').val()) == '' || nullToEmpty($('#dfAfeDemdDgr').val()) == '') {
            		alertBox('W', demandMsgArray['selectAfeDiv']);"AFE구분을 선택해 주세요."
            		return;
	            	}*/
                	if (nullToEmpty(data.afeYr) == '' || nullToEmpty(data.afeDemdDgr) == '') {
                		return false;
                	}
                	$('#dfAfeYr').val(data.afeYr);
                	$('#dfAfeDemdDgr').val(data.afeDemdDgr);
	            	
	            	/*"AFE차수를 지정 하시겠습니까?"*/
	            	callMsgBox('','C', demandMsgArray['definedAFE'], function(msgId, msgRst){  
	
	            		if (msgRst == 'Y') {
	                		bodyProgress();
	                    	var updateData = [];
	            			
	            			$.each(dataList, function(idx, obj){
	            				obj.afeYr = $('#dfAfeYr').val();
	            			    obj.afeDemdDgr = $('#dfAfeDemdDgr').val();
	            				updateData.push(obj);
	            			});
	            			
	                		demandRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/afedgr?method=put'
	                				           , updateData
	                				           , 'POST'
	                				           , 'procAddAfe');
	            		}
	            	});
               	}
            });
       });
        
        
        // 수요 자동생성
        $('#btn_auto_create').click( function() {
        	
        	$a.popup({
            	popid: 'demandAutoCreate',
            	title: demandMsgArray['demandAutoCreate'],/*'AFE 차수 지정'*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/transmissiondemandpool/TransmissionDemandAutoCreatePop.do',
                data: null,
                width : 1500,
                height : 800, //window.innerHeight * 0.3,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {
                	if(data == "OK"){
                		alertBox('C', "정상 처리 되었습니다.");
                	}
               	}
            });
       });
        
        // 수요 자동생성
        $('#btnPopUnitCost').click( function() {
        	
        	var dataParam =  $("#searchForm").getData();
    		dataParam.erpHdofcCd = dataParam.scErpHdofcCd;
    		openCostCalculationPopup(dataParam);
       });
        
        
        // 계획수요 삭제
        $('#btn_remove_afe').click( function() {
        	var dataList = $('#'+gridTrPoolId).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['deleteObjectCheck']);   /*"삭제할 대상을 선택하세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		if (data.demdProgStatCd != '105001') {
        			//"계획수요인 수요만 삭제가 가능합니다.\n" + data.trmsDemdMgmtNo + "의 진행상태를 확인해 주세요.";
        			alertBox('W', makeArgMsg('onlyPlanDemandDeletable', data.trmsDemdMgmtNo));  /*계획수요인 수요만 삭제가 가능합니다.<br>{0}의 진행상태를 확인해 주세요.*/
        			return;
        		}
        	}
        	
        	/*계획수요를 삭제 하시겠습니까?*/
        	callMsgBox('','C', demandMsgArray['deletePlanDemand'], function(msgId, msgRst){  

        		if (msgRst == 'Y') {

            		bodyProgress();
	            	var updateData = [];
	    			
	    			$.each(dataList, function(idx, obj){
	    				updateData.push(obj);
	    			});
	    			               		        		
	        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/afedgr?method=delete'
	        				           , updateData
	        				           , 'POST'
	        				           , 'procRemoveAfe');
        		}
        	});
       });
        
        // 수요POOL 삭제
        $('#btn_remove_demdpool').click( function() {
        	var dataList = $('#'+gridTrPoolId).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alertBox('W', demandMsgArray['deleteObjectCheck']);   /*"삭제할 대상을 선택하세요."*/
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		if (data.demdProgStatCd != '105006') {
        			alertBox('W', "수요POOL인 수요만 삭제가 가능합니다.");
        			return;
        		}
        	}
        	
        	/*계획수요를 삭제 하시겠습니까?*/
        	callMsgBox('','C', "수요POOL을 삭제 하시겠습니까?", function(msgId, msgRst){  

        		if (msgRst == 'Y') {

            		bodyProgress();
	            	var updateData = [];
	    			
	    			$.each(dataList, function(idx, obj){
	    				updateData.push(obj);
	    			});
	    			               		        		
	        		demandRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/deldemdpool?method=delete'
	        				           , updateData
	        				           , 'POST'
	        				           , 'delDemdpool');
        		}
        	});
       });
	};
	
	/*
	 * Function Name : openCostCalculationPopup
	 * Description   : 단가계산 팝업
	 * ----------------------------------------------------------------------------------------------------
	 * grid          : 그리드 id
	 * sisulNm       : 시설명
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 통합시설정보
	 */
	  function openCostCalculationPopup(searchForm) {
		  	
		   	$a.popup({
		       	popid: 'SisulMakePopup',
		       	title: '단가 계산',  /*단가 계산*/
		       	iframe: true,
		       	modal : false,
		       	windowpopup : true,
		       	movable: true,
		           url: '/tango-transmission-web/demandmgmt/common/UnitCostCalculationPopup.do',
		           data: searchForm,
		           width : 1250,
		           height : 650,
		           /*
		       		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
		            */
		           callback: function(data) {
		        	   	
		          	}
		    });
	   }
		
	//request 성공시
    function successDemandCallback(response, flag){
    	    	
    	if (flag == 'getStdAfeDiv') {
        	// 유선망 기본 afe년차
        	 $('#baseAfeYr').val(response[0].afeYr);
        	 $('#baseAfeDemdDgr').val(response[0].afeDemdDgr);
        	//AFE 구분 콤보박스
        	selectAfeYearCode('scAfeYr', 'Y', 'Y');
        	//selectAfeYearCode('dfAfeYr', 'N', '');

	       	 $('#dfAfeYr').val(response[0].afeYr);
	       	 $('#dfAfeDemdDgr').val(response[0].afeDemdDgr);

        	setInitPage();
        	setEventListener();

    		return;
    	}
    	
    	if(flag == 'search'){
    		/*hideProgress(gridTrPoolId);
    		var serverPageinfo;
    		
	    	if(response.pager != null){
	    		serverPageinfo = {
	    	      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
	    	      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	    	      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수	    	      		
	    	      	};
	    	}
    		if(response.list.length == 0){
				//alertBox('I', demandMsgArray['noInquiryData']);//'조회된 데이터가 없습니다.'
			}
    		$('#'+gridTrPoolId).alopexGrid("dataSet", response.list, serverPageinfo);
    		$('#'+gridTrPoolId).alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return demandMsgArray['totalCnt'] + ' : ' + setComma(response.pager.totalCnt);//총 건수 
					}}}
			);*/

    		bodyProgressRemove();
    	}
    	    	
    	if (flag == 'procAddAfe') {
    		if (response.result.code == "OK") {
        		bodyProgressRemove();
    			/*'AFE차수가 지정되었습니다.'*/
    			callMsgBox('', 'I', demandMsgArray['completeDefinedAFE'], function() {
    				$('#search').click();   
    			});
    		}  else {
        		bodyProgressRemove();
    			alertBox('W', response.message);
    		}

    		return;
    	}
    	
    	if (flag == 'procRemoveAfe') {
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
    	
    	// 엑셀다운로드
    	if(flag == 'excelDownload') {  
    		if (response.code == "OK") {
        		bodyProgressRemove();
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
    		} else {
        		bodyProgressRemove();
    			alertBox('W', response.retMsg);
    		}

    		return;
    	}
    	
    	if (flag == 'delDemdpool') {
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
    }
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	/*alert('실패');*/
    	hideProgress(gridTrPoolId);
    	if (flag == 'procAddAfe') {
    		bodyProgressRemove();
    		alertBox('W', response.message+'<br>');
    		return;
    	}

    	if (flag == 'procRemoveAfe') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}

    	// 엑셀다운로드
    	if(flag == 'excelDownload') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}

    	// 스크롤 조회
    	if(flag == 'searchForPageAdd') {
    		alertBox('W', demandMsgArray['searchFail']);
    		return;
    	}
    	
    	if (flag == 'delDemdpool') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}
    }
    
});