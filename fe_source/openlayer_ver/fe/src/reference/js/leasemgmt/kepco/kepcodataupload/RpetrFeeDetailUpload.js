/**
 * 
 */

$a.page(function() {
	
	var excGridId = 'excelDataGrid';
	//$('#sht_Dialog').dialog({
	//	autoOpen: false,
	//	resizable:false,
	//});
	
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener(); 
    };
   
    function initGrid() {
    	
    	var excelGridOption = $.extend({}, KepcoGrid.defineExcelDataGrid, {
    		//ajax: { model: gridBusinessPartnerModel, scroll: true } // ajax옵션 및 model 추가
    	});
    	var excelErrGridOption = $.extend({}, KepcoGrid.defineErrDataGrid, {
    		//ajax: { model: gridBuildChargerModel, scroll: true }
    	});
    	
    	$('#'+excGridId).alopexGrid(excelGridOption);
    	$('#'+excGridId).alopexGrid('hideCol','skAfcoDivCd');
    	
    	
    };
    
    function tangoRequest(surl,sdata,smethod,sflag)
    {
    	/*
    	Tango.ajax({
			url : surl,
			data : sdata,
			method : smethod
		}).done(function(response){successCallback(response, sflag);})
		  .fail(function(response){failCallback(response, sflag);})
		  
		 */
		  var transaction = Tango.ajax.init({
      		url : surl, 
  			data : sdata,
  			flag : sflag});
    	
    		switch(smethod){
    		case 'GET' : transaction.get().done(successCallback).fail(failCallback);
    			break;
    		case 'POST' : transaction.post().done(successCallback).fail(failCallback);
    			break;
    		case 'PUT' : transaction.put().done(successCallback).fail(failCallback);
    			break;
    		
    		}
      	
      	
		  //.error();
    }
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {  
    	//httpRequest('tango-transmission-biz/leasemgmt/common/codes/kepcoOffice', null, successCallback, failCallback, 'GET', 'kepcoOffice');
    	//httpRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonth', null, successCallback, failCallback, 'GET', 'chargingMonth');
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/kepcoOffice',null,'GET','kepcoOffice');
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonth',null,'GET','chargingMonth');
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/LesBizrId',null,'GET','LesBizrId');
    	
    } 
    var branch_office_data = [];
    
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag === 'kepcoOffice'){
    		
    		var option_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    		$('#kepcoBoCd').clear();
    		$('#kepcbCd').clear();
    		$('#kepcbCd').setData({
	             data:option_data,
	             option_selected:''
    		});
    		$('#divKepcbCd').setEnabled (false);
    		
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			if(resObj.depth == 0){
    				option_data.push(resObj);
    			}else{
    				branch_office_data.push(resObj);
    			}
    		}
    			
    		$('#kepcoBoCd').setData({
	             data:option_data,
	             option_selected:''
    		});
    		
    		$('#kepcoBoCd').on('change', function(e) {
    			setBranchOfficeData($('#kepcoBoCd').val());
    		});
    	}
    	if(flag === 'LesBizrId'){
    		
    		var option_data = [{codeId:"",codeName:"선택"}];
			for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
			
    		$('#lesBizrId').setData({
    			 data:option_data,
    	         option_selected:''
    		});
    		
    	}
    	if(flag === 'chargingMonth'){
    		$('#chrDmdYm').clear();
    		$('#chrDmdYm').setData({
	             data:response
    		});
    		$('#chrDmdYm').trigger($.Event('change'));
    	}
    	if(flag==='filePath'){
    		callMsgBox('lesBizrId','I', response.filePath, btnMsgCallback);
    	}
    	if(flag==='getTempRpetrFeeDetailUploadList'){
    		$('#'+excGridId).alopexGrid('hideProgress');
    		//alert(response.lists);
    		$('#'+excGridId).alopexGrid('dataSet', response.lists);
    		
    	}
    	if(flag==='createRpetrFeeDetail'){
    		if(response.returnCode == 200){
    			callMsgBox('lesBizrId','I', "정상처리 되었습니다", btnMsgCallback);
    		}
    	}
    	if(flag==='deleteTempFile'){
    		if(response.returnCode == 200)
    			callMsgBox('lesBizrId','I', "취소되었습니다", btnMsgCallback);
    	}
    	if(flag==='createTempRpetrFeeDetail'){
    		if(response.returnCode == 200){
    			callMsgBox('lesBizrId','I', "정상처리 되었습니다.", btnMsgCallback); 
				 tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempRpetrFeeDetailUploadList',null,'GET','getTempRpetrFeeDetailUploadList');
   		 	}	
    		else{
    			$('#'+excGridId).alopexGrid('hideProgress');
    			//callMsgBox('lesBizrId','I', "중계기 엑셀 포맷이 아닙니다.! \n 확인하세요.", btnMsgCallback);  
    			callMsgBox('lesBizrId','I', "선택한 엑셀파일은 표준양식이 아닙니다. 표준양식으로 작성해 주십시오.", btnMsgCallback);  
    		}
    	}
    	
    	
    }
  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag === 'searchData'){
    		callMsgBox('lesBizrId','I',response.__rsltMsg__, btnMsgCallback);
    		$('#'+dataGridId).alopexGrid('hideProgress');
    	}
    }
    function setBranchOfficeData(val){
    	
    	var option_data = [{depth:"0",upperCodeId:"*",codeId:"",codeName:"전체"}];
    	
    	$('#kepcbCd').clear();
    	$('#divKepcbCd').setEnabled (false);
    	
    	if(val != ''){
    		for(var i=0; i<branch_office_data.length; i++){
    			var obj = branch_office_data[i];
    			if(obj.upperCodeId == val){
    				option_data.push(obj);
    			}
    		}
    		$('#divKepcbCd').setEnabled (true);
    	}
    	
    	$('#kepcbCd').setData({
            data:option_data
		});
    }
    
    function setEventListener() {
    	// 엑셀 파일 선택 Event Handler 등록
    	$("#excelFile").on('change', function(e) {
    		//var exform  = document.getElementById('excelform');
    		//exform.reset();
    		excelFileChangeEventHandler(e);
        });
    	$('#btnExcelUpload').on('click', function(e) {
        	btnExcelUploadClickEventHandler(e);
        });
    	/*
    	$('#btnExcelUpload').on('click', function(e) {
    		var exform  = document.getElementById('excelform');
    		exform.reset();
    		$('#excelFile').click();
        });
        */
    	 $('#btnSave').on('click', function(e) {
    		 var addData = $("#"+excGridId).alopexGrid('dataGet', {_state:{selected:true}});
    		 
    		 if(addData.length > 0){
    			 for(i=0;i<addData.length;i++){
    				 if(addData[i].errorYN=="Y"){
    					 callMsgBox('skAfcoDivCd','I', "오류가 있는 데이타는 저장할수 없습니다.", btnMsgCallback);
    					 return;
    				 }	
    				 
    			 }
    			 if($('#skAfcoDivCd option:selected').text()=="선택"){
 					callMsgBox('skAfcoDivCd','I', "계열사를 선택하세요", btnMsgCallback);
 					return;
 				}
    			 if($('#lesBizrId option:selected').text()=="선택"){
  					callMsgBox('lesBizrId','I', "임대사업자를 선택하세요", btnMsgCallback);
  					return;
  				}
    			 
    			callMsgBox('saveconfirm','I', "기존자료가 있을경우 덮어쓰기 됩니다", btnMsgCallback);
    			
    			 /*var rtnConfirm = confirm("기존자료가 있을경우 덮어쓰기 됩니다. \n 저장하시겠습니까?");
    	    		if (rtnConfirm == false) {
    	    		    return false;
    	    		}
    	    		else{    	    			
    	    			tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/createRpetrFeeDetail?method=put',addData,'POST','createRpetrFeeDetail');    	    			
    	    		}*/
    	    		
    		 }
    		 else
    			 callMsgBox('skAfcoDivCd','I', "저장할 데이타를 선택하세요.!", btnMsgCallback);  		 
         });
		$('.confirm_btn').click(function() {
			$('#'+excGridId).alopexGrid('showProgress');
			$('input[name=shtNm]').val($('#shtNm option:selected').val());
			$('input[name=kepcoDatUladDivCd]').val("C");
			var param =  $("#searchForm").getData();
			tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/createTempRpetrFeeDetail?method=put',param,'POST','createTempRpetrFeeDetail');
			$('#sht_Dialog').close();
		});

		$('.cancel_btn').click(function() {
			var param =  $("#searchForm").getData();
			tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/deleteTempFile',param,'POST','deleteTempFile');
		    $('#sht_Dialog').close();
		});
    	
    }
    
    function btnExcelUploadClickEventHandler(event){
    	 if($('#lesBizrId option:selected').text()=="선택"){
				callMsgBox('lesBizrId','I', "임대사업자를 선택하세요", btnMsgCallback);
				return;
			}
    	$('#excelFile').val('');
		$('#excelFile').trigger($.Event('click'));
    }
    function btnMsgCallback(msgId, msgRst){
    	if(msgId === 'saveconfirm'){
    		var addData = $("#"+excGridId).alopexGrid('dataGet', {_state:{selected:true}});
    		for(i=0;i<addData.length;i++){
    			addData[i].skAfcoDivCd = $('#skAfcoDivCd').val();
    			//addData[i].chrDmdYm = $('#chrDmdYm').val();
				 //addData[i].skAfcoDivCd = $('#skAfcoDivCd').val();
    			//alert(addData[i].skAfcoDivCd);
    		}
    		//addData.skAfcoDivCd = $('#skAfcoDivCd').val();
    		tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/createRpetrFeeDetail?method=put',addData,'POST','createRpetrFeeDetail');
    	}
	}
    function excelFileChangeEventHandler(event){
	    var fileObject=$('[data-id=uploadfile]').get(0).files[0];//파일 찾기 fileObj.name.split(".")[0]
		
		if(fileObject != null){
			$('#'+excGridId).alopexGrid('showProgress');
			var fileName = fileObject.name.split(".")[0];
			var fileExtension = fileObject.name.split(".")[1];
			var data = new FormData();
			data.append('file',$('[data-id=uploadfile]').get(0).files[0]);
			data.append('fileName',fileName);
			data.append('fileExtension',fileExtension);
			
			Tango.ajax({
				url: 'tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getRptSheetList',
				method: 'post',
				data:data,
				flag :'upload',
				processData:false,
				contentType:false
			}).done(uploadSuccessCallback).fail(function(obj) {
				callMsgBox('skAfcoDivCd','I', "파일업로드 실패.!", btnMsgCallback); 
			});
			//.fail(function(response){failCallback(response, 'upload');})
						
				
		}
    }
    function uploadSuccessCallback(response, status, jqxhr, flag){
    	 $('#'+excGridId).alopexGrid('hideProgress');
    	 $('input[name=rptUrl]').val(response.rpetrFeeUrl);
		  
		 $('#sht_Dialog').open({
				title:"Sheet를 선택하세요",
				width:270,
				height:150
			  });
		 $('#shtNm').clear();
 		 $('#shtNm').setData({
	             data:response.sheetList
 		 });
    } 
    function gridBtnClickEventHandler(event){
    	gridBtnClickObj[event.target.id]();
    }
    
});
