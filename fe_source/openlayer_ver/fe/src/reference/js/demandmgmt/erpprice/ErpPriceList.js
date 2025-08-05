/**
 * ErpPriceList
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
				width:'50px',
				title : demandMsgArray['sequence'] /*순번*/,
				numberingColumn : true
			}
    		, {
				key : 'afeYr',
				align:'center',
				width:'60px',
				title : demandMsgArray['afeYear'] /*AFE 연도*/
			}
    		, {
				key : 'afeDemdDgr',
				align:'center',
				width:'60px',
				title : demandMsgArray['afeDegree'] /*AFE 차수*/
			}
    		, {
				key : 'erpHdofcNm',
				align:'left',
				width:'80px',
				title : demandMsgArray['hdofc'] /*본부*/
			}
    		, {
    			key : 'erpHdofcCd',
    			align:'center',
    			width:'50px',
    			title : demandMsgArray['headOfficeCode'] /*본부코드*/,
    			hidden : true
    		}
    		, {
				key : 'demdBizDivNm',
				align:'left',
				width:'150px',
				title : demandMsgArray['businessDivision'] /*사업구분*/,
			}
    		, {
    			key : 'demdBizDivCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['businessDivisionCode'] /*사업구분코드*/,
    			hidden : true
    		}
    		, {
				key : 'eqpDivNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['equipmentDivision'] /*장비구분*/,
			}
    		, {
    			key : 'eqpDivCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['equipmentDivisionCode'] /*장비구분코드*/,
    			hidden : true
    		}
    		, {
    			key : 'eqpDtlDivNm',
    			align:'left',
    			width:'100px',
    			title : demandMsgArray['eqpDtlDiv'] /*장비상세구분*/,
    			hidden : true
    		}
    		, {
    			key : 'eqpDtlDivCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['eqpDtlDivCd'] /*장비상세구분코드*/,
    			hidden : true
    		}
    		, {
    			key : 'vendNm',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['vendorName'] /*제조사명*/,
    			hidden : true
    		}
    		, {
    			key : 'vendCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['vendorCode'] /*제조사코드*/,
    			hidden : true
    		}
    		, {
    			key : 'uprcItmCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['unitPriceItemCode'] /*단가항목코드*/,
    			hidden : true
    		}
    		, {
				key : 'sclDivNm',
				align:'left',
				width:'100px',
				title : demandMsgArray['smallDivison'] /*소구분*/,
			}
    		, {
    			key : 'sclDivCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['smallDivisonCode'] /*소구분코드*/,
    			hidden : true
    		}
    		, {
				key : 'eqpTypNm',
				align:'left',
				width:'120px',
				title : demandMsgArray['eqpType'] /*장비유형*/,
			}
    		, {
    			key : 'eqpTypCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['equipmentTypeCode'] /*장비유형코드*/,
    			hidden : true
    		}
    		, {
				key : 'shpTypNm',
				align:'left',
				width:'140px',
				title : demandMsgArray['shapeType'] /*형상Type*/
			}
    		, {
    			key : 'shpTypCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['shapeTypeCd'] /*형상타입코드*/,
    			hidden : true
    		}
    		, {
				key : 'detlCstrDivNm',
				align:'left',
				width:'80px',
				title : demandMsgArray['detailConstructionType'] /*세부공사유형*/
			}
    		, {
    			key : 'detlCstrDivCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['detailConstructionTypeCode'] /*세부공사유형코드*/,
    			hidden : true
    		}
    		, {
				key : 'mtrlCstrNm',
				align:'center',
				width:'80px',
				title : demandMsgArray['materialConstruction'] /*물자/공사*/
			}
    		, {
    			key : 'mtrlCstrCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['materialConstructionCd'] /*물자/공사코드*/,
    			hidden : true
    		}
    		, {
				key : 'stdUprc',
				align:'right',
				width:'100px',
				title : demandMsgArray['standardUnitPriceWon'] /*기준단가(원)*/,
				render: {type:"string", rule : "comma"}
			}
    		, {
				key : 'aplyRate',
				align:'right',
				width:'45px',
				title : demandMsgArray['applyRatePercent'] /*적용비율(%)*/,
				render :  function(value, data){
					var val = value + "%";
					return val;
				}
    		    , hidden:true
			}
    		, {
				key : 'stdUprcAplyRate',
				align:'right',
				width:'45px',
				title : demandMsgArray['applicationRatio'] /*적용율(%)*/,
				render :  function(value, data){
					var val = value + "%";
					return val;
				}
		    	, hidden:true
			}
    		, {
				key : 'aplyUprc',
				align:'right',
				width:'45px',
				title : demandMsgArray['applyUnitPriceWon'] /*적용단가(원)*/,
				render: {type:"string", rule : "comma"},
    			hidden : true
			}
    		, {
    			key : 'frstRegUserId',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['firstRegistrationUserIdentification'] /*최초등록사용자ID*/,
    			hidden : true
    		}
    		, {
    			key : 'frstRegDate',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['firstRegistrationDate'] /*최초등록일자*/,
    			hidden : true
    		}
    		, {
    			key : 'lastChgUserId',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['lastChangeUserIdentification'] /*최종변경사용자ID*/,
				hidden : true
    		}
    		, {
				key : 'erpUprcChgYn',
				align:'center',
				width:'40px',
				title : demandMsgArray['modificationYesOrNo'] /*수정여부*/,
				hidden : true
			}
    		, {
				key : 'lastChgDate',
				align:'center',
				width:'100px',
				title : demandMsgArray['modificationDate'] /*수정일자*/
			}
    		, {
    			key : 'rmk',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['remark'] /*비고*/,
    			hidden : true
    		}
    		, {
    			key : 'rmkCd',
    			align:'center',
    			width:'40px',
    			title : demandMsgArray['remarkCode']  /*비고코드*/,
    			hidden : true
    		}
			];
    	

    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/demandmgmt/erpprice/list"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 15,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false
            ,columnMapping : mapping
            ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        	,paging: {
        	   //pagerTotal:true,
        	   pagerSelect:false,
        	   hidePageList:true
           }
        	,ajax: {
        		model: gridModel                  // ajax option에 grid 연결할 model을지정
 		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
 		    }
            //height : 450
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
    	selectAfeYearCode('afeYr', 'N', '');
    	//소구분 콤보박스
    	//demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/getSclDivCdList/', null, 'GET', 'sclDivCd');
    	selectComboCode('sclDivCd', 'Y', 'C00622', '');
    	//본부 콤보박스
    	selectComboCode('erpHdofcCd', 'BD', 'C00623', '');
    	selectComboCode('detlCstrDivCd', 'Y', 'C00619', '');
    	
    	/*ERP단가테이블에 ERP세부사업코드기준으로 단가를 관리할시*/
    	//selectYearBizCombo('demdBizDivCd', 'Y', '2016', 'C00618', '', 'TA');	// 사업구분 대
    	selectComboCode('demdBizDivCd', 'Y', 'C00618', '');// 사업구분 대
    }
    
    function priceEdit(data){
    	var title;
    	if (data.seq == undefined) {
    		title = demandMsgArray['erpPriceEdit']; /*'장비 단가 수정'*/
    	} else {
    		title = demandMsgArray['erpPriceMgmtExcelUpload']; /*'장비 단가 엑셀 업로드'*/
    	}
    	$a.popup({
    		url : 'PopPriceEdit.do',
    		data : data,
    		iframe : true,
    		modal : true,
    		width : 1280,
    		height : 850,
    		title : title,
    		movable : true,
    		callback : function(data){
    			if ( data == true ) {
    				searchList();
    			}
    		}
    		,xButtonClickCallback : function(el){
   	 			alertBox('W', demandMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
   	 			return false;
   	 		}
    	});
    }
    
    function excelDown() {
    	var dataParam =  $("#searchForm").getData();
    	//dataParam.afeDemdDgr = "";
    	dataParam.firstRowIndex = 1;
    	dataParam.lastRowIndex = 1000000;
    	
    	dataParam.fileName = demandMsgArray['enterpriseResourcePlanningUnitPriceSearch']; /*ERP단가조회*/
    	dataParam.fileDataType = "erppriceExcelDown";
    	dataParam.fileExtension = "xlsx";
    	
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erppriceexcel/exceldownload'
		           , dataParam
		           , 'GET'
		           , 'excelDownload');
    }
    
    function editData() {
    	var dataList = $( '#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		callMsgBox('', 'W', demandMsgArray['selectNoDataForEdit'] ); /*선택된 데이터가 없습니다.<br>수정할 데이터를 선택해 주세요.*/
    		return;
    	}
    	var bonbu = dataList[0].erpHdofcNm;
    	for( var i = 0; i <= dataList.length -1 ; i++){
    		if(bonbu != dataList[i].erpHdofcNm) {
    			callMsgBox('', 'W', demandMsgArray['selectDataOtherHdofc'] ); /*선택된 데이터중 본부가 다른 데이터가 있습니다. <br> 동일한 본부를 선택해 주세요.*/
    			dataList = null;
    			return;
    		}
    	}
    	priceEdit(dataList);
    }
    
    function searchList() {
    	/*var dataParam =  $("#searchForm").getData();
    	dataParam.firstRowIndex = 1;
    	dataParam.lastRowIndex = 20;
    	$("#firstRowIndex").val(1);
    	$("#lastRowIndex").val(20);
    	showProgress(gridId);
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/list', dataParam, 'GET', 'search');*/
    	var dataParam =  $("#searchForm").getData();
    	      		
    	bodyProgress();
    	dataParam.pageNo = '1';
    	dataParam.rowPerPage = '15';
		gridModel.get({
    		data: dataParam,
		}).done(function(response,status,xhr,flag){successDemandCallback(response, 'search');})
	  	  .fail(function(response,status,flag){failDemandCallback(response, 'search');});        
    }
    
    function setEventListener() {
        // 검색
        $('#search').on('click', function(e) {
        	searchList();
        });
        
        //AFE 구분 콤보박스
        $('#afeYr').on('change',function(e) {
    		var dataParam =  $("#searchForm").getData();
    		selectAfeTsCode('afeDemdDgr', 'N', '', dataParam);

        	/*ERP단가테이블에 ERP세부사업코드기준으로 단가를 관리할시*/
    		//selectYearBizCombo('demdBizDivCd', 'Y', $("#afeYr").val(), 'C00618', '', 'TA');	// 사업구분 대
        });
                
        // 사업구분
        $('#demdBizDivCd').on('change',function(e) {
        	
    		$(this).find("option[value='C']").remove(); // 1X 삭제
    		$(this).find("option[value='I']").remove(); // WIBRO 삭제
    		$(this).find("option[value='M']").remove(); // M_ZONE 삭제
    		$(this).find("option[value='O']").remove(); // LORA 삭제
    		$(this).find("option[value='P']").remove(); // PLATFORM 삭제
    		$(this).find("option[value='W']").remove(); // WCDMA 삭제
    		$(this).find("option[value='Z']").remove(); // W_ZONE 삭제

        });
        
        //소구분 구분 콤보박스        
    	$('#sclDivCd').on('change',function(e) {
    		//var dataParam =  $("#searchForm").getData();
    		var dataParam = { 
    				sclDivCd : $('#sclDivCd').val()
    				, comGrpCd : 'C00628'
    				, afeYr : $('#afeYr').val()
    				, afeDemdDgr : $('#afeDemdDgr').val()
    				, demdBizDivCd : $('#demdBizDivCd').val()
    		};
    		if($('#sclDivCd').val() != ""){
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/geteqptypcdlist/', dataParam, 'GET', 'eqpTypCd');
    		}else{
    			$('#eqpTypCd').empty();
    			$('#eqpTypCd').append('<option value="">'+demandMsgArray['all'] /*전체*/+'</option>');
    			$('#eqpTypCd').setSelected("");
    		}
        });
    	
    	//엑셀 다운로드
    	$('#excelDown').on('click', function(e) {
    		bodyProgress();
    		excelDown();
        });
    	
    	//엑셀 업로드
    	$('#excelUp').on('click', function(e) {
        	$a.popup({
        		popid : 'ErpPriceExcelUpload',
        		url : 'ErpPriceExcelUpload.do',
        		iframe : true,
        		modal : true,
        		width : 500,
        		height : 280,
        		title : demandMsgArray['erpPriceMgmtExcelUpload'], /*ERP 단가 관리 엑셀업로드*/
        		movable : true,
        		callback : function(data){
            			priceEdit(data);
        		}
	    		,xButtonClickCallback : function(el){
	   	 			alertBox('W', demandMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
	   	 			return false;
	   	 		}
        	});
        });
    	
    	//수정 팝업
    	$('#edit').on('click', function(e) {
    		editData();
        });
    	

    	// 단가평균
    	$('#execErpUprcAverage').on('click', function(e) {
    		$a.popup({
            	popid: 'DefineAfe',
            	title: demandMsgArray['selectAfe'],/*'AFE선택'*/
            	iframe: true,
            	modal : true,
                url: '/tango-transmission-web/demandmgmt/erpprice/ErpPriceSelectAfe.do',
                data: null,
                width : 600,
                height : 300, //window.innerHeight * 0.3,
                /*
            		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
            	*/
                callback: function(data) {                	
                	if (nullToEmpty(data.afeYr) == '' || nullToEmpty(data.afeDemdDgr) == '') {
                		return false;
                	}
                		            	
	            	/*"AFE차수를 지정 하시겠습니까?"*/
	            	callMsgBox('','C', demandMsgArray['executeAverageOfErpPrice'], function(msgId, msgRst){  
	
	            		if (msgRst == 'Y') {
	                		bodyProgress();
	                    	var averageData = {
	                    			 afeYr : data.afeYr
	                    		   , afeDemdDgr : data.afeDemdDgr
	                    		   , erpHdofcCd : data.erpHdofcCd
	                    	};
	                    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/averageerpprice/', averageData, 'GET', 'averageErpPrice');	
	            		}
	            	});
               	}
    		});
        });
    	        
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
	
	//request 성공시
    function successDemandCallback(response, flag){
    	if(flag == 'sclDivCd'){
    		$('#sclDivCd').setData({
    			data : response//JSON.stringify(response)
    		});
    		$('#sclDivCd').prepend('<option value="">'+demandMsgArray['all'] /*전체*/+'</option>');
    		$('#sclDivCd').setSelected("");
    	}
    	if(flag == 'eqpTypCd'){
    		$('#eqpTypCd').setData({
    			data : response//JSON.stringify(response)
    		});
    		$('#eqpTypCd').prepend('<option value="">'+demandMsgArray['all'] /*전체*/+'</option>');
    		$('#eqpTypCd').setSelected("");
    	}
    	
    	if(flag == 'search'){
        	bodyProgressRemove();    		
    	}
    	
    	// 엑셀다운로드
    	if(flag == 'excelDownload') {
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
    			bodyProgressRemove();
    		} else {
    			callMsgBox('', 'W', response.retMsg);
    		}
    	}

    	// 단가 평균 구하기
    	if(flag == 'averageErpPrice') {
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
    	hideProgress(gridId);
    	bodyProgressRemove();
    	// 단가 평균 구하기
    	/*if (flag == 'averageErpPrice') {
    		alertBox('W', response.message);
    		return;
    	}*/
    	
    	callMsgBox('', 'W', demandMsgArray['failure'] ); /*실패*/
    }
    
});