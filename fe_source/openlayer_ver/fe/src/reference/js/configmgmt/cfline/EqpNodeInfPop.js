/**
 * EqpNodeInfPop.js
 * 
 * 선로정보팝업 - 회선, 링, 트렁크, SKT관리그룹인 경우에만 버튼 표시되어 실행됨
 * 
 * 구축 > 개통 > 선로개통화면에서 선번장 상하위국입력후 ETE연결여부를 마친 회선의 경우 따로 정보가 저장되면서
 * 선번편집화면에서 해당 정보를 자동으로 등록할수 있다.
 * ETE연결을 하지 않은 회선은 정보가 검색되지 않은다.
 * @author Administrator
 * @date 2020. 08. 03. 
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
    			
    	initGrid();
        setEventListener();

        searchInit(paramData);
    };

    
    function initGrid() {

		var groupColumn = groupingColumnPath();
		
    	var column = [
						{ key : 'check', width : '40px', selectorColumn : true, rowspan : {by : 'ORG_MERGE'} }
					, { key : 'ORG_MERGE', hidden: true, value : function(value, data) {
							return data.noRow;
						}
					}
					, { key : 'title', align:'center', title : ''  /*장비국사*/, width: '80px', 
						rowspan : {by : 'ORG_MERGE'} , value : function(value, data) {
							return "선번장";
						}
					
					}
					, { key : 'eqpOrgNm', align:'center', title : '국사'  /*장비국사*/, width: '110px'}
					, { key : 'neNm', align:'left', title : cflineMsgArray['equipmentName'] /*장비명*/, width: '210px'}
					, { key : 'portDescr', align : 'center', title : cflineMsgArray['portName'] /* 포트명 */, width : '100px' }
					, { key : 'orgNm', align: 'left', title : cflineMsgArray['equipmentOrgNm'] /*장비국사*/, width: '210px'}
					, { key : 'orgId', align:'center', title : cflineMsgArray['upperMtso'] /*장비국사ID*/, width: '210px', hidden: true   }
					
					
					/* 장비 데이터 hidden 값 */
					, { key : 'eqpTid', align:'center', title : cflineMsgArray['equipmentTargetId'] /*장비 TID*/, width: '210px', hidden: true  }
					, { key : 'neId', align:'center', title : cflineMsgArray['equipmentIdentification'] /*장비ID*/, width: '112px', hidden: true  }
					, { key : 'neRoleCd', align:'center', title : cflineMsgArray['equipmentRoleDivisionCode'] /*장비역할코드*/, width: '65px', hidden: true }
					, { key : 'jrdtTeamOrgNm', align:'center', title : cflineMsgArray['managementTeamName'] /*관리팀명*/, width: '65px' , hidden: true }
					, { key : 'opTeamOrgId', align:'center', title : cflineMsgArray['operationTeamOrganizationIdentification'] /*운용팀조직ID*/, width: '65px' , hidden: true }
					, { key : 'opTeamOrgNm', align:'center', title : cflineMsgArray['operationTeam']+cflineMsgArray['organizationName'] /*운용팀조직명*/, width: '65px' , hidden: true }
					, { key : 'orgIdL3', align:'center', title : cflineMsgArray['transmissionOfficeIdentification'] /*전송실ID*/, width: '65px' , hidden: true }
					, { key : 'orgId', align:'center', title : cflineMsgArray['installMobileTelephoneSwitchingOfficeIdentification'] /*설치국사ID*/, width: '65px' , hidden: true }
					, { key : 'modelLclCd', align:'center', title : cflineMsgArray['equipmentModelLargeClassificationCode'] /*장비모델대분류코드*/, width: '65px' , hidden: true }
					, { key : 'modelLclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['largeClassificationName'] /*장비모델대분류명*/, width: '65px' , hidden: true }
					, { key : 'modelMclCd', align:'center', title : cflineMsgArray['equipmentModelMiddleClassificationCode'] /*장비모델중분류코드*/, width: '65px' , hidden: true }
					, { key : 'modelMclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['middleClassificationName'] /*장비모델중분류명*/, width: '65px' , hidden: true }
					, { key : 'modelSclCd', align:'center', title : cflineMsgArray['equipmentModelSmallClassificationCode'] /*장비모델소분류코드*/, width: '65px' , hidden: true}
					, { key : 'modelSclNm', align:'center', title : cflineMsgArray['model']+cflineMsgArray['smallClassificationName'] /*장비모델소분류명*/, width: '65px' , hidden: true }
					, { key : 'modelId', align:'center', title : cflineMsgArray['equipmentModelIdentification'] /*장비모델ID*/, width: '65px' , hidden: true }
					, { key : 'vendorId', align:'center', title : cflineMsgArray['vendorIdentification'] /*제조사ID*/, width: '65px' , hidden: true }
					, { key : 'vendorNm', align:'center', title : cflineMsgArray['vendorName'] /*제조사명*/, width: '65px' , hidden: true }
					, { key : 'neStatusCd', align:'center', title : cflineMsgArray['equipmentStatusCode'] /*장비상태코드*/, width: '65px' , hidden: true }
					, { key : 'neStatusNm', align:'center', title : cflineMsgArray['equipmentStatus']+cflineMsgArray['name'] /*장비상태명*/, width: '65px' , hidden: true }
					, { key : 'neDummy', align:'center', title : cflineMsgArray['dummy']+cflineMsgArray['equipment']+cflineMsgArray['yesOrNo'] /*더미장비여부*/, width: '65px', hidden: true}
					, { key : 'bldCd', align:'center', title : '건물아이디', width: '65px' , hidden: true } 
					
					
					/* 포트 데이터 hidden 값 */
					,{ key : 'portChnlNm', align : 'center', title : cflineMsgArray['port'] + cflineMsgArray['channelValue'] /*포트 채널값 */ , width : '80px', hidden : true}
					,{ key : 'portWaveNm', align : 'center', title : cflineMsgArray['port']  + cflineMsgArray['wavelength'] /*포트 파장 */ , width : '80px', hidden : true }
					,{ key : 'physPortNm', align : 'center', title : cflineMsgArray['physical']+cflineMsgArray['portName'] /* 물리포트명 */, width : '95px', hidden : true }
					,{ key : 'cardNm', align : 'center', title : cflineMsgArray['cardName'] /* 카드명 */, width : '76px', hidden : true  }
					,{ key : 'cardModelNm', align : 'center', title : cflineMsgArray['cardModelName'] /* 카드모델명 */, width : '100px', hidden : true }
					,{ key : 'rackNm', align : 'center', title : cflineMsgArray['rackName'] /* 렉명 */, width : '60px', hidden : true  }
					,{ key : 'shelfNm', align : 'center', title : cflineMsgArray['shelfName'] /* 쉘프명 */, width : '60px', hidden : true  }
					,{ key : 'slotNo', align : 'center', title : cflineMsgArray['slotNumber'] /* 슬롯번호 */, width : '65px', hidden : true  }
					,{ key : 'portStatNm', align : 'center', title : cflineMsgArray['port'] + cflineMsgArray['statusName'] /* 포트상태명 */, width : '80px', hidden : true }
					,{ key : 'coreCnntRmk', align : 'left', title : cflineMsgArray['coreConnectionRemark'] /* 코어접속비고 */, width : '800px', hidden : true }
					,{ key : 'portId', align : 'center', title : cflineMsgArray['portIdentification'] /* 포트ID */, width : '100px', hidden : true }
					,{ key : 'portDescr', align : 'center', title : cflineMsgArray['portDescription'] /* 포트설명 */, width : '160px', hidden : true }
					,{ key : 'rackNo', align : 'center', title : cflineMsgArray['rackNumber'] /* 렉번호 */, width : '150px', hidden : true}
					,{ key : 'shelfNo', align : 'center', title : cflineMsgArray['shelfNumber'] /* 쉘프번호 */, width : '150px', hidden : true}
					,{ key : 'cardId', align : 'center', title : cflineMsgArray['cardIdentification'] /* 카드ID */, width : '150px', hidden : true }
					,{ key : 'cardStatusCd', align : 'center', title : cflineMsgArray['cardStatusCode'] /* 카드상태코드 */, width : '150px', hidden : true }
					,{ key : 'cardStatusNm', align : 'center', title : cflineMsgArray['cardStatusName'] /* 카드상태명 */, width : '150px', hidden : true }
					,{ key : 'portDummy', align : 'center', title : cflineMsgArray['dummy'] + cflineMsgArray['port'] + cflineMsgArray['yesOrNo'] /* 더미포트여부 */, width : '150px', hidden : true}
					,{ key : 'channelDescr', align : 'center', title : cflineMsgArray['channelValue'] /* 채널값 */, width : '150px', hidden : true }
					,{ key : 'cardModelId', align : 'center', title : cflineMsgArray['cardModelIdentification'] /* 카드모델ID */, width : '150px', hidden : true }
					,{ key : 'cardWavelength', align : 'center', title : cflineMsgArray['card']+ cflineMsgArray['wavelength'] /* 카드파장 */, width : '150px', hidden : true}
					,{ key : 'portUseTypeCd', align : 'center', title : cflineMsgArray['portUseTypeCd'] /* 포트사용용도코드 */, width : '150px', hidden : true }
					,{ key : 'portUseTypeNm', align : 'center', title : cflineMsgArray['portUseTypeNm'] /* 포트사용용도명 */, width : '150px', hidden : true }
					,{ key : 'portStatCd', align : 'center', title : cflineMsgArray['portStatusCode'] /* 포트상태코드 */, width : '150px', hidden : true }
					,{ key : 'physPortId', align : 'center', title : '물리포트ID', hidden : true }
					,{ key : 'grenTypCd', align : 'center', title : 'grenTypCd', hidden : true }
					
					
					/* rx 포트값 */
					,{ key : 'rxPortId', align : 'center',  width : '100px', hidden : true }
					,{ key : 'rxPortDescr', align : 'center', width : '160px', hidden : true }
					,{ key : 'rxPortDummy', align : 'center', width : '150px', hidden : true}
					,{ key : 'rxPortStatusCd', align : 'center', width : '150px', hidden : true }
					,{ key : 'rxPortStatusNm', align : 'center', width : '150px', hidden : true }
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
			height : 250 ,	    
			columnMapping : column,
			grouping : groupColumn,
			rowspanGroupSelect: true,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineMsgArray['noData']+"</div>"
			}
        });
    };

    
    function setEventListener() {
    	
    	 // 스크롤
    	 $('#'+gridId).on('scrollBottom', function(e){
    		searchData("scroll", "");
    	 });
    	 
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
				alertBox('I', '이동할 장비 및 선번정보를 선택해주세요.'); 
			 	return;
			 }
			 
	 		 callMsgBox('','C', "선택하신 정보를 선번편집화면에 적용하시겠습니까?", function(msgId, msgRst){  
	 			if (msgRst == 'Y') {
	 				$a.close(dataObj);
	 			}
	 		 });
         });
    }
    
    function searchInit(param) {

    	cflineShowProgressBody();
    	var dataParam = param;
    	httpRequest('tango-transmission-biz/transmission/configmgmt/cfline/eqpPortInf/getEqpNodeInfList', dataParam, 'GET', 'search');
    	
    }

	function groupingColumnPath() {
		var grouping = {
				by : ['ORG_MERGE'], 
				useGrouping:true,
				useGroupRowspan:true,
				useDragDropBetweenGroup:false,			// 그룹핑 컬럼간의 드래그앤드랍 불허용
				useGroupRearrange : false
		};
		
		return grouping;
	}
	
	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		var data = response.eqpNodeInfList;
    		
    		totalCnt = response.totalCnt;
    		$('#'+gridId).alopexGrid('dataSet', data);
    		$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineCommMsgArray['totalCnt']/*총 건수*/+ ' : ' + getNumberFormatDis(response.totalCnt);}}});

			cflineHideProgressBody();
			if(totalCnt > 0) {
				$('#btnDataMove').show();
			}
    	} 
    }
	
	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	cflineHideProgressBody();
		//조회 실패 하였습니다.
	    callMsgBox('','W', cflineMsgArray['searchFail'] , function(msgId, msgRst){});
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }
    

});