/**
 * OltEqpInfPop.js
 * 
 * 상위 OLT장비 설정 팝업 - 가입자망링 자동검색
 * @author Administrator
 * @date 2021. 03. 08. 
 * @version 1.0
 *  
 */

var gridId = 'dataGrid';
var paramData = null;
var fixNeRoleCd = "";
var mtsoList = [];
var partnerNeId = "";
var schBpId = "";
var wdmYn = ""
var totalCnt = 0;
	
$a.page(function() {

    this.init = function(id, param) {
    	paramData = param;
    			
    	initGrid(paramData);
        setEventListener();
    };

    
    function initGrid(paramData) {
		
    	var column = [
						{ key : 'check', width : '40px', selectorColumn : true}
					, { key : 'lftEqpNm', align:'left', title : cflineMsgArray['equipmentName'] /*장비명*/, width: '210px'}
					, { key : 'lftEqpId', align:'center', title : '장비ID'  /*장비ID*/, width: '110px'}
					, { key : 'lftTopMtsoNm', align: 'left', title : cflineMsgArray['equipmentOrgNm'] /*장비국사*/, width: '210px'}
					
    	];
    	
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	pager : true,
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowSelectOption : {
				clickSelect : true ,
				singleSelect : false ,
				groupSelect : true
			} ,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 300 ,	    
			columnMapping : column,
			rowspanGroupSelect: true,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
			}
        });
        
        dataSet(paramData);
    };

	
	function dataSet(response){
		var data = response.data.otlEqpIdInf;
		var totalCnt = response.data.otlEqpIdInfCnt;
		console.log("totalCnt:: "+totalCnt);
		$('#'+gridId).alopexGrid('dataSet', data);
		$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(totalCnt);}}});

		cflineHideProgressBody();
    }
    
    function setEventListener() {
    	    	 
    	 $('#btnClose').on('click', function(e){
    		 $a.close();
         });

		document.onkeypress = function(e){
			if(window.event.keyCode == 13){
				if(document.getElementById('dialogMsg') == null){
					$('#btnSearchPop').click();
					return false;
				}else{
					$('#dialogMsg').close().remove();
				}
			}
		}
		
    	//닫기
	 	$('#btnPopClose').on('click', function(e) {
	 		$a.close();
    	});  
	 	
	 	//이동
	 	$('#btnDataMove').on('click', function(e){

	 		 var dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}}));
			 if(dataObj == undefined || dataObj.length == 0) {
				alertBox('I', '이동할 OLT장비를 선택해주세요.'); 
			 	return;
			 } else if(dataObj.length > 1) {
				alertBox('I', '이동할 OLT장비를 1개만 선택해주세요.'); 
				return;
			 }
			 
	 		 callMsgBox('','C', "선택하신 정보를 선번편집화면에 적용하시겠습니까?", function(msgId, msgRst){  
	 			if (msgRst == 'Y') {
	 				$a.close(dataObj);
	 			}
	 		 });
         });
    }
});