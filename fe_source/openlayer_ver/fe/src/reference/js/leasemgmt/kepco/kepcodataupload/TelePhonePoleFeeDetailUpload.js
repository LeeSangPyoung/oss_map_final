/**
 * TelePhonePoleFeeDetailUpload.js
 * kim ho
 * @author 
 * @date 2016. 7. 25. 오전 09:10:00
 * @version 1.0
 */
$a.page(function() {
	var rowPerPageCnt = 10;
	var excGridId = 'excelDataGrid';
	var errGridId = 'errorDataGrid';
	var tUserid='${userInfo.userId}';
	if(tUserid=='')
		tUserid = 'TANGOT';
	
	/**
	 * Grid Model 정의
	 */
	var gridExcelDataModel = Tango.ajax.init({
	//	url: "tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadList",
		//flag: "getTempTelePhonePoleFeeDetailUploadList"
	})
	var gridExcelErrorModel = Tango.ajax.init({
	//url: "tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadErrList",
	//	flag: "getTempTelePhonePoleFeeDetailUploadErrList"
	})
	
	
	//초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener(); 
    };
    
    function initGrid() {
    	
  
    	// Grid option 정의
    	var excellGridOption = $.extend({}, KepcoGrid.defineExcelDataGrid, {
    		ajax: { model: gridExcelDataModel} // ajax옵션 및 model 추가
    	});
    	var errorGridOption = $.extend({}, KepcoGrid.defineErrorDataGrid, {
    		ajax: { model: gridExcelErrorModel}
    	});
    
    	$('#excelDataGrid').alopexGrid(excellGridOption);
    	$('#excelDataGrid').alopexGrid("pageInfo");
    	$('#errorDataGrid').alopexGrid(errorGridOption);
    	
    	
    	
       
    };
  
    function tangoRequest(surl,sdata,smethod,sflag)
    {
    	
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
    	
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/kepcoOffice',null,'GET','kepcoOffice');
    	tangoRequest('tango-transmission-biz/leasemgmt/common/codes/chargingMonth',null,'GET','chargingMonth');
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
    	if(flag === 'getTempTelePhonePoleFeeDetailUploadList')
    	{
    		//alert(response.pager.totalCnt+"/"+response.pager.rowPerPage+"/"+response.pager.pageNo);
    		var serverPageinfo = {
		      		dataLength  : response.pager.totalCnt, 		//총 데이터 길이
		      		current 	: response.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
		      		perPage 	: response.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		      	};
    		$('#'+excGridId).alopexGrid('dataSet',response.lists);
    	}
    	if(flag === 'chargingMonth'){
    		$('#chrDmdYm').clear();
    		$('#chrDmdYm').setData({
	             data:response
    		});
    		$('#chrDmdYm').trigger($.Event('change'));
    	}
    	if(flag==='filePath'){
    		alert(response.filePath);
    	}
    	if(flag==='telePhonePoleFeeDetailUploadList'){
    		$('#'+excGridId).alopexGrid('hideProgress');
    		$('#'+excGridId).alopexGrid('dataSet', response.lists);
    		
    		/*$('#'+excGridId).alopexGrid('updateOption',
    				{paging : {pagerTotal: function(paging) {
    					return '총결과 : ' + response.pager.totalCnt;
    				}}}
    		);*/
    		
    	}
    	if(flag==='insertTlplfeedts'){
    		 if(response.returnCode == 200){
 				 alert('정상처리 되었습니다.');
 				 tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadList',null,'GET','getTempTelePhonePoleFeeDetailUploadList');
    		 }
    	}
    	
    	if(flag==='getTempTelePhonePoleFeeDetailUploadErrList'){
    		$('#'+errGridId).alopexGrid('hideProgress');
    		$('#'+errGridId).alopexGrid('dataSet', response.lists);
    	}
    	
    	
    }
  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag === 'searchData'){
    		alert(response.__rsltMsg__);
    		$('#'+dataGridId).alopexGrid('hideProgress');
    	}
    }
    function btnMsgCallback(msgId, msgRst){
		//alert("msgId : "+msgId+"\n"+"msgRst : "+msgRst);
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
    function setGrid(page, rowPerPage) {
		//$("#StatusGrid").alopexGrid('showProgress');       	      		
    	//$('#'+gridId2).alopexGrid('dataEmpty');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	//var data =  $("#searchForm").getData();   
    	
    	
    	tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadList',null,'GET','getTempTelePhonePoleFeeDetailUploadList');
		$('body').progress();
    }
    function gridPageSetClickEventHandler(event){  
		
     	var eObj = AlopexGrid.parseEvent(event);
     	setGrid(eObj.page, eObj.pageinfo.perPage);
     	
    }
    function setEventListener() {
    	$('#excelDataGrid').on('pageSet', function(e){
        	gridPageSetClickEventHandler(e);
        });
    	$('#btnSave').on('click', function(e){
    		
    		if($('#'+errGridId).alopexGrid("dataGet").length > 0){
    			callMsgBox('excelFile','I', "오류 정보가 있어 저장할수 없습니다.\n 엑셀을 수정하여 재 업로드 하세요.~!.", btnMsgCallback); 
    			
    		}
			else{
				
				var indexkepcoBoCd = $('#kepcoBoCd option').index($('#kepcoBoCd option:selected'));
				var indexkepcbCd = $('#kepcbCd option').index($('#kepcbCd option:selected'));
				if(indexkepcoBoCd < 1 || indexkepcbCd < 1 ){
					
					callMsgBox('excelFile','I', "한전본부와 한전지사를 선택하세요!.", btnMsgCallback);
				}
				else{
				
					var param =  $("#searchForm").getData();
					
					param.uladUserId = 'testid'; 
					param.kepcoDatUladDivCd = 'B';
					tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/insertTlplfeedts?method=put',param,'POST','insertTlplfeedts');
				}
			}
    	});
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
    		//document.getElementById("file1").click();
    		var exform  = document.getElementById('excelform');
    		exform.reset();
    		$('#excelFile').click();
    		
        });
    	$("#excelFile").change(
    		     function(){    		  
    		    	 $('#'+excGridId).alopexGrid('showProgress');
    		    	// val = $(this).val().split("\\");
    		    	 //f_name = val[val.length-1]; //마지막 화일명
    		    	 //var form = new FormData(document.getElementById('excelform'));	
    		    	 var fileObject=$('[data-id=uploadfile]').get(0).files[0];//파일 찾기 fileObj.name.split(".")[0]
    		    	 var fileName = fileObject.name.split(".")[0];
    		    	 var fileExtension = fileObject.name.split(".")[1];
    		    	 var data = new FormData();
    		    	 data.append('file',$('[data-id=uploadfile]').get(0).files[0]);
    		    	 data.append('fileName',fileName);
    		    	 data.append('fileExtension',fileExtension);
    					
    					
	    		     $.ajax({
	    		    	  url : "/tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getFeeDetailXlsExcelUpload?method=put",
	    		    	  data : data,
	    		    	  dataType:'json',
	    		    	  processData:false,
	    		    	  contentType : false,
	    		    	  type:'POST',
	    		    	  success : function(response){
	    		    		 //alert(response.telePhonePoleFeeDetailUploadList);
	    		    		  $('#'+excGridId).alopexGrid('hideProgress');
	    		    		  if(response.returnCode == 200){
	    		    			  callMsgBox('excelFile','I', "엑셀정보를 확인했습니다.", btnMsgCallback); 
	    		  				  tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadList',null,'GET','getTempTelePhonePoleFeeDetailUploadList');
	    		  				  tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadErrList',null,'GET','getTempTelePhonePoleFeeDetailUploadErrList');
	    		  				
	    		    		  }
	    		    		  else{
	    		    			  
	    		      				alert('전주 요금내역 엑셀 포맷이 아닙니다.! \n 확인하세요.');
	    		    		  }
	    		    		
	    		    	  },
	    		    	  error : function(aa){
	    		    		  alert(aa);
	    		    	  }
	    		     }); 
	    		    
	    		     	    		     
    		     }); */
    }
    function btnExcelUploadClickEventHandler(event){
    	$('#excelFile').val('');
		$('#excelFile').trigger($.Event('click'));
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
		
			//?method=put
			Tango.ajax({
				url: 'tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getFeeDetailXlsExcelUpload?method=put',
				method: 'post',
				data:data,
				flag :'upload',
				processData:false,
				contentType:false
			}).done(uploadSuccessCallback).fail(function(obj) {
			
				callMsgBox('excelFile','I', "파일업로드 실패.", btnMsgCallback); 
			});
			//.fail(function(response){failCallback(response, 'upload');})
						
				
		}
    }
    function uploadSuccessCallback(response, status, jqxhr, flag){
    	 $('#'+excGridId).alopexGrid('hideProgress');
    	 callMsgBox('excelFile','I', "엑셀정보를 확인했습니다.", btnMsgCallback); 
    	 tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadList',null,'GET','getTempTelePhonePoleFeeDetailUploadList');
		 tangoRequest('tango-transmission-biz/leasemgmt/kepco/kepcodataupload/getTempTelePhonePoleFeeDetailUploadErrList',null,'GET','getTempTelePhonePoleFeeDetailUploadErrList');
    } 
    
});


   