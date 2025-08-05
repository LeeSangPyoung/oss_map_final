
/**
 * 작업계획서다운로드 
 */
$('#workPlanDocDown').on('click',function(e){	
	console.log('작업계획서출력 클릭!!!');
	
	if($.TcpUtils.isEmpty($('#wkrtNo').val())){
		callMsgBox('','I', '작업등록 후 출력 가능합니다.');
		return false;
	}

	$('body').append(
			'<div id="workPlanDocDialog" data-classinit="true" style="background-color:white; border: 1px solid black;  position: fixed; z-index: 1001; opacity: 1; overflow: hidden; display: none; height: 160px; width: 120px; top: 0px; left: 0px;" data-converted="true">'
		   +'<div><button id="workPlanDocX" class="Button button2" style="float:right;">X</button></div>'
		   +'<div style="margin-top:20px;">'
		   +'<div><label class="ImageCheckbox Margin-right-10"><input class="Checkbox" id="workPlanDocLstVal" type="checkbox" name="workPlanDocLstVal" value="0" data-bind="checked: workPlanDocLstVal" />체크리스트</label></div>'
		   +'<div><label class="ImageCheckbox Margin-right-10"><input class="Checkbox" id="workPlanDocLstVal2" type="checkbox" name="workPlanDocLstVal" value="1" data-bind="checked: workPlanDocLstVal" />접속도(전)</label></div>'
		   +'<div><label class="ImageCheckbox Margin-right-10"><input class="Checkbox" id="workPlanDocLstVal3" type="checkbox" name="workPlanDocLstVal" value="2" data-bind="checked: workPlanDocLstVal" />접속도(후)</label></div>'
		   +'<div><label class="ImageCheckbox Margin-right-10"><input class="Checkbox" id="workPlanDocLstVal4" type="checkbox" name="workPlanDocLstVal" value="3" data-bind="checked: workPlanDocLstVal" />선번장</label></div>'						
		   +'<div><label class="ImageCheckbox Margin-right-10"><input class="Checkbox" id="workPlanDocLstVal5" type="checkbox" name="workPlanDocLstVal" value="4" data-bind="checked: workPlanDocLstVal" />행정도</label></div>'
		   +'</div>'
		   	
		   +'<button id="workPlanDocExcelDown" class="Button button2 color_green" style="margin-top:10px; margin-left:15px;"><span class="ico  ico_down_green"></span>Excel출력</button>'
		   
		   +'</div>'
		);
	
	$a.convert($('body'));
	
	var left = e.clientX;
	var top = e.clientY;
	var width = parseInt($('#workPlanDocDialog').css('width').replace('px',''));
	
	$('#workPlanDocDialog').css({'left':(left - width), 'top': top, 'position':'absolute'});
	
	$('#workPlanDocDialog').show();
	
	// 데이터 셋팅
	console.log("목록값 : "+$('#workPlanDocLst').val());
	
	if($.TcpUtils.isNotEmpty($('#workPlanDocLst').val())){
		var workPlanDocLstVal = $('#workPlanDocLst').val().split(',');
		$('#workPlanDocLstVal').setValues(workPlanDocLstVal);
	}
	
	$('#workPlanDocX').on('click',function(e){
		$('#workPlanDocDialog').hide();
	});
	
	var workExcelFileNm = "";
	
	// 작업계획서 엑셀다운로드
	$('#workPlanDocExcelDown').on('click',function(e){
		
		var workPlanDocLstVal = $('input:checkbox[name=workPlanDocLstVal]').getData().workPlanDocLstVal.toString();
		// 엑셀다운로드 로직 추가
		console.log(workPlanDocLstVal);
		$('#workPlanDocLst').val(workPlanDocLstVal);
		
		if($.TcpUtils.isNotEmpty(workPlanDocLstVal)){	
			
			// 접속도, 행정도 여부 체크
			if(		workPlanDocLstVal.indexOf('1') > -1 ||
					workPlanDocLstVal.indexOf('2') > -1 ||
					workPlanDocLstVal.indexOf('4') > -1
		      ){ 
			
	        	var param = 
	        	{
	        		 screenId			: screenId
	        		,wkrtNo 			: $('#wkrtNo').val() 
	    			,intgDsnGrpNo		: $('#cnstIntgDsnGrpNo').val()
	        		,intgDsnGrpTypCd	: 'C'
	        		,skAfcoDivCd : $('#skAfcoDivCd').val()
	        	}
				
				param.workPlanDocLstVal = workPlanDocLstVal;
	        	
	        	$.TcpUtils.startBodyProgress();
	    		
	    		Tango.ajax({
	    			url : 'tango-transmission-biz/transmission/constructprocess/workmgmt/subtab/chkWorkPlanDocExist',
	    			data : param,
	    			method : 'GET'
	    			
	    		}).done(function(response){successCallbackPopup(response, 'chkWorkPlanDocExist');})
	    			.fail(function(response){failCallbackPopup(response, 'chkWorkPlanDocExist');});

			}else{
				
				var screenId = "workPlanDoc"; // 작업계획서
		    	
				workExcelFileNm = "작업계획서";

	        	var param = 
	        	{
	        		 screenId			: screenId
	        		,wkrtNo 			: $('#wkrtNo').val() 
	    			,userId				: $('#userId').val() // 사용자 ID
	    			,fileName			: workExcelFileNm // 파일명
	    			,workPlanDocLstVal	: workPlanDocLstVal
	        		,intgDsnGrpNo		: $('#cnstIntgDsnGrpNo').val()
	        		,intgDsnGrpTypCd	: 'C'
	        		,skAfcoDivCd : $('#skAfcoDivCd').val()
	        	}
				
				param.workPlanDocLstVal = workPlanDocLstVal;
				
				workCommonCallOndemandExcel(screenId,param);
			}
    		
		}
		
	});
	
	
	var workCommonCallOndemandExcel = function(screenId,param){
		
		var fileName = param.fileName;
		
		$.TcpUtils.startBodyProgress();
		
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/constructprocess/common/callOnDemandExcelList',
			data : param,
			method : 'POST'
			
		}).done(function(response){successCallbackPopup(response, 'onDemandExcel');})
			.fail(function(response){failCallbackPopup(response, 'onDemandExcel');});
				
	};

	
	// **************************************************
	// OnDemand Excel Function Start
	// **************************************************
	var successCallbackPopup = function(response, flag) {
		// 엑셀배치실행(OnDemand)
		if(flag == 'onDemandExcel') {
			if(response.returnCode == '200') {
				var jobInstanceId = response.resultData.jobInstanceId;
				var fileName =  workExcelFileNm+"_"+jobInstanceId ;

				$.TcpUtils.hideBodyProgress();
				setTimeout(function() { // progress 제거 후, 엑셀 다운로드 팝업 출력
					// 엑셀다운로드팝업 변경
					$a.popup({
						popid: 'CommonExcelDownlodPop' + jobInstanceId,
						title: '엑셀다운로드',
						iframe: true,
						modal : false,
						windowpopup : true,
						url: '/tango-transmission-web/constructprocess/common/CommonExcelDownloadPop.do',
						data: {
							jobInstanceId :jobInstanceId,
							fileName : fileName,
							fileType : 'excel'
						},
						width : 500,
						height : 300,
						callback: function(resultCode) {
							if (resultCode == "OK") {
								$('#btnSearch').click();
							}
						}
					});
				},500);
			} else if(response.returnCode == '500') {
				$.TcpUtils.hideBodyProgress();
				callMsgBox('btnSearch','I', '<spring:message code="error.t.completion.failCmplPicDown"/>', btnMsgCallback);
			}
		}else if(flag == 'chkWorkPlanDocExist'){
			
			$('body').progress().remove();
			
			var workPlanDocLstVal = $('input:checkbox[name=workPlanDocLstVal]').getData().workPlanDocLstVal.toString();
			
			var screenId = "workPlanDoc"; // 작업계획서
	    	
			workExcelFileNm = "작업계획서";

        	var param = 
        	{
        		 screenId			: screenId
        		,wkrtNo 			: $('#wkrtNo').val() 
    			,userId				: $('#userId').val() // 사용자 ID
    			,fileName			: workExcelFileNm // 파일명
    			,workPlanDocLstVal	: workPlanDocLstVal
        		,intgDsnGrpNo		: $('#cnstIntgDsnGrpNo').val()
        		,intgDsnGrpTypCd	: 'C'
        		,skAfcoDivCd : $('#skAfcoDivCd').val()
        	}
			
			param.workPlanDocLstVal = workPlanDocLstVal;
			
			workCommonCallOndemandExcel(screenId,param);
		}
	}
	

	// excel 실행 실패
	var failCallbackPopup = function(response, flag){
		$('body').progress().remove();
		
		callMsgBox('','I',response.message);		
    }
	

	// **************************************************
	// OnDemand Excel Function End
	// **************************************************
	
});

//작업계획서저장
$('#workPlanPicDown').on('click', function(e){

	var intgDsnGrpNo = $('#cnstIntgDsnGrpNo').val();
	var intgDsnGrpTypCd = "C";
	
	if($.TcpUtils.isEmpty(intgDsnGrpNo)){
		callMsgBox('','I', '구축그룹공사가 아닙니다.');
		return false;
	}

	$a.popup({
        title: '작업계획서저장',
        windowpopup: true,
        modal: false,
        url: '/tango-transmission-gis-web/efdg/Efdg.do?intgDsnGrpNo=' + intgDsnGrpNo + '&intgDsnGrpTypCd=' + intgDsnGrpTypCd,
        width : screen.availWidth,
        height : screen.availHeight
	});
});