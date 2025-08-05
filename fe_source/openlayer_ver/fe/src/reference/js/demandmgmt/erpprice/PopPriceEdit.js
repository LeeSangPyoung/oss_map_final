/**
 * PopPriceEdit
 *
 * @author P095783
 * @date 2016. 8. 30.
 * @version 1.0
 */

var flagSeq = null;
var afeYrPop = null;
var afeDemdDgrPop = null;
var erpHdofcCdPop = null;

$a.page(function() {
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	afeYrPop = null;
    	afeDemdDgrPop = null;
    	erpHdofcCdPop = null;
    	
    	simulGrid();
    	simulQuater(param);
    	applyGrid();
    	setEventListener();
    };
    
  	//simulGrid 초기화
    function simulGrid() {
    	var mapping =  [
    	        		{
    	    				width:'20px',
    	    				key : 'check',
    	    				selectorColumn : true
    	    			}
    	        		, {
    	    				key : 'check',
    	    				align:'center',
    	    				width:'30px',
    	    				title : demandMsgArray['sequence'] /*순번*/,
    	    				numberingColumn : true
    	    			}
    	        		, {
    	    				key : 'afeYr',
    	    				align:'center',
    	    				width:'45px',
    	    				title : demandMsgArray['afeYear'] /*AFE 연도*/
    	    			}
    	        		, {
    	    				key : 'afeDemdDgr',
    	    				align:'center',
    	    				width:'45px',
    	    				title : demandMsgArray['afeDegree'] /*AFE 차수*/
    	    			}
    	        		, {
    	    				key : 'erpHdofcNm',
    	    				align:'center',
    	    				width:'40px',
    	    				title : demandMsgArray['hdofc'] /*본부*/
    	    			}
    	        		, {
    	        			key : 'erpHdofcCd',
    	        			align:'center',
    	        			title : demandMsgArray['headOfficeCode'] /*본부코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'demdBizDivNm',
    	    				align:'left',
    	    				width:'60px',
    	    				title : demandMsgArray['businessDivisionBig']//demandMsgArray['businessDivision'] /*사업구분*/,
    	    			}
    	        		, {
    	        			key : 'demdBizDivCd',
    	        			align:'center',
    	        			title : demandMsgArray['businessDivisionCode'] /*사업구분코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'eqpDivNm',
    	    				align:'center',
    	    				width:'45px',
    	    				title : demandMsgArray['equipmentDivision'] /*장비구분*/,
    	    			}
    	        		, {
    	        			key : 'eqpDivCd',
    	        			align:'center',
    	        			title : demandMsgArray['equipmentDivisionCode'] /*장비구분코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'eqpDtlDivNm',
    	        			align:'center',
    	        			title : demandMsgArray['eqpDtlDiv'] /*장비상세구분*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'eqpDtlDivCd',
    	        			align:'center',
    	        			title : demandMsgArray['eqpDtlDivCd'] /*장비상세구분코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'vendNm',
    	        			align:'center',
    	        			title : demandMsgArray['vendorName'] /*제조사명*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'vendCd',
    	        			align:'center',
    	        			title : demandMsgArray['vendorCode'] /*제조사코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'uprcItmCd',
    	        			align:'center',
    	        			title : demandMsgArray['unitPriceItemCode'] /*단가항목코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'sclDivNm',
    	    				align:'left',
    	    				width:'80px',
    	    				title : demandMsgArray['smallDivison'] /*소구분*/,
    	    			}
    	        		, {
    	        			key : 'sclDivCd',
    	        			align:'center',
    	        			title : demandMsgArray['smallDivisonCode'] /*소구분코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'eqpTypNm',
    	    				align:'left',
    	    				width:'80px',
    	    				title : demandMsgArray['eqpType'] /*장비유형*/,
    	    			}
    	        		, {
    	        			key : 'eqpTypCd',
    	        			align:'center',
    	        			title : demandMsgArray['equipmentTypeCode'] /*장비유형코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'shpTypNm',
    	    				align:'left',
    	    				width:'80px',
    	    				title : demandMsgArray['shapeType'] /*형상Type*/
    	    			}
    	        		, {
    	        			key : 'shpTypCd',
    	        			align:'center',
    	        			title : demandMsgArray['shapeTypeCd'] /*형상타입코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'detlCstrDivNm',
    	    				align:'center',
    	    				width:'55px',
    	    				title : demandMsgArray['detailConstructionType'] /*세부공사유형*/
    	    			}
    	        		, {
    	        			key : 'detlCstrDivCd',
    	        			align:'center',
    	        			title : demandMsgArray['detailConstructionTypeCode'] /*세부공사유형코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'mtrlCstrNm',
    	    				align:'center',
    	    				width:'60px',
    	    				title : demandMsgArray['materialConstruction'] /*물자/공사*/
    	    			}
    	        		, {
    	        			key : 'mtrlCstrCd',
    	        			align:'center',
    	        			title : demandMsgArray['materialConstructionCd'] /*물자/공사코드*/,
    	        			hidden : true
    	        		}
    	        		, {
    	    				key : 'stdUprc',
    	    				align:'right',
    	    				width:'60px',
    	    				title : /*'<em class="color_red">*</em>' + */demandMsgArray['standardUnitPriceWon'] /*기준단가(원)*/,
    	    				render: {type:"string", rule : "comma"},
    	        			editable : false
    	        			/*,  editable : { type: "text" 
						           ,styleclass : 'num_editing-in-grid'
					 	   		   ,attr : { "data-keyfilter-rule" : "digits", "maxlength" : "15"}}*/
    	    			}
    	        		, {
    	    				key : 'changeUprc',
    	    				align:'right',
    	    				width:'60px',
    	    				title : '<em class="color_red">*</em>' + demandMsgArray['changeUnitPriceWon'] /*변경단가(원)*/,
    	    				render: {type:"string", rule : "comma"}
    	    				,  editable : { type: "text" 
						           ,styleclass : 'num_editing-in-grid'
					 	   		   ,attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}}
    	    			}
    	        		, {
    	    				key : 'aplyRate',
    	    				align:'right',
    	    				width:'60px',
    	    				title : '<em class="color_red">*</em>' +demandMsgArray['applyRatePercent'] /*적용비율(%)*/,
    	    				render :  function(value, data){
    	    					var val = value + "%";
    	    					return val;
    	    				},
    	    				editable : true
    	    				/*,  editable : { type: "text" 
						           ,styleclass : 'num_editing-in-grid'
					 	   		   ,attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "6"}}*/
    	        			,hidden : true
    	    			}
    	        		, {
    	    				key : 'stdUprcAplyRate',
    	    				align:'right',
    	    				width:'50px',
    	    				title : '<em class="color_red">*</em>' +  demandMsgArray['applicationRatio'] /*적용율(%)*/,
    	    				render :  function(value, data){
    	    					var val = value + "%";
    	    					return val;
    	    				},
    	    				editable : true
    	    				/*,  editable : { type: "text" 
					           ,styleclass : 'num_editing-in-grid'
				 	   		   ,attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "6"}}*/
    	        			,hidden : true
    	    			}
    	        		, {
    	    				key : 'aplyUprc',
    	    				align:'right',
    	    				width:'55px',
    	    				title : demandMsgArray['applyUnitPriceWon'] /*적용단가(원)*/,
    	    				render : function(value, data){
    	    					rowIndex = data._index.data;
    	    					var currData = AlopexGrid.currentData($('#simulGrid').alopexGrid('dataGet' , {_index : {row : rowIndex}}));
    	    					
    	    					if ( typeof currData[0] == "undefined") {
    	    						return setComma( number_format ( (data.stdUprc * (data.aplyRate/100)), 0) );
    	    					} else {
    	    						if(currData[0]._state.editing == false){
    	    							if (value == "undefined" || value == null){
    	    								return 0;
    	    							}
    	    							return setComma( number_format ( (data.stdUprc * (data.aplyRate/100)), 0) );
    	    						} else {
    	    							currData = AlopexGrid.trimData(currData);
        	    						return setComma( number_format((currData[0].stdUprc * (currData[0].aplyRate/100)), 0) );
    	    						}
    	    					}
    	    				},
    	    				refreshBy : ['stdUprc', 'aplyRate'],
    	        			hidden : true
    	    			}
    	        		, {
    	        			key : 'frstRegUserId',
    	        			align:'right',
    	        			title : demandMsgArray['firstRegistrationUserIdentification'] /*최초등록사용자ID*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'frstRegDate',
    	        			align:'center',
    	        			title : demandMsgArray['firstRegistrationDate'] /*최초등록일자*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'lastChgUserId',
    	        			align:'center',
    	        			title : demandMsgArray['lastChangeUserIdentification'] /*최종변경사용자ID*/,
    	    				hidden : true
    	        		}
    	        		, {
    	    				key : 'lastChgDate',
    	    				align:'center',
    	    				width:'50px',
    	    				title : demandMsgArray['modificationDate'] /*수정일자*/
    	    			}
    	        		, {
    	        			key : 'rmk',
    	        			align:'center',
    	        			title : demandMsgArray['remark'] /*비고*/,
    	        			hidden : true
    	        		}
    	        		, {
    	        			key : 'rmkCd',
    	        			align:'center',
    	        			title : demandMsgArray['remarkCode']  /*비고코드*/,
    	        			hidden : true
    	        		}
    	    			];
  		
        //그리드 생성
        $('#simulGrid').alopexGrid({
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : false,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping,
            height : 230
            ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
    };
    
  //applyGrid 초기화
    function applyGrid() {
    	var mapping =  [
    		{
				key : 'afeYr',
				align:'center',
				width:'30px',
				title : demandMsgArray['afeYear'] /*AFE 연도*/
			}
    		, {
    			key : 'afeDemdDgr',
    			align:'center',
    			width:'30px',
    			title : demandMsgArray['afeDegree'] /*AFE 차수*/
    		}
    		, {
    			key : 'erpHdofcNm',
    			align:'center',
    			width:'30px',
    			title : demandMsgArray['hdofc'] /*본부*/
    		}
    		, {
    			key : 'eqpLnDiv',
    			align:'center',
    			width:'30px',
    			title : demandMsgArray['division'] /*구분*/
    		}
    		, {
    			key : 'demdBizDivNm',
    			align:'left',
    			width:'150px',
    			title :  demandMsgArray['businessDivisionBig'] /*사업구분(대)*/
    		}
    		, {
    			key : 'demdBizDivDetlNm',
    			align:'left',
    			width:'250px',
    			title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/
    		}
    		, {
				key : 'bfAplInvestCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['beforeApply'] /*적용 전*/,
				render: {type:"string", rule : "comma"}
					
			}
    		, {
				key : 'afAplInvestCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['afeterApply'] /*적용 후*/,
				render: {type:"string", rule : "comma"}
			}
			];
  		
        //그리드 생성
        $('#applyGrid').alopexGrid({
        	pager : false,
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : false,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping,
            height : 400
            ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
	        , footer : {
		    	   footerMapping : [
		    	                       {columnIndex: 1	, render:demandMsgArray['summarization']/*"합계"*/		, align:"center"	}
		    	                     , {columnIndex: 6	, render:"sum(bfAplInvestCost)"		, align:"right"		, key : "bfAplInvestCost"}
		    	                     , {columnIndex: 7	, render:"sum(afAplInvestCost)"	, align:"right"		, key : "afAplInvestCost"}
		    	                    ]
		       }
        });
    };
     
    function simulQuater(data){
    	if (data.seq == undefined) {
    		// 화면에서 수정을 클릭하여 팝업을 연경우
    		simulGridSetting(data);
    	} else {
    		// 엑셀 업로드로 연경우
    		var dataParam = {
    				 seq : data.seq
    				,afeYr : data.afeYr
    				,afeDemdDgr : data.afeDemdDgr
    				,erpHdofcCd : data.erpHdofcCd
    				,diErpUprcTmpSq : data.seq
    		};
    		flagSeq = data.seq;
    		demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/excelupsetting', dataParam, 'GET', 'excelUp');
    		$("#year").html(data.afeYr);
        	$("#ts").html(data.afeDemdDgr);
        	$("#bonbu").html(data.bonbu); /*+ demandMsgArray['hdofc']*/

        	afeYrPop = data.afeYr;
        	afeDemdDgrPop = data.afeDemdDgr;
        	erpHdofcCdPop = data.erpHdofcCd;
    	}
    }
    
    // 단가목록에서 수정 버튼을 클릭한 경우
    function simulGridSetting(data){
    	var count = Object.keys(data).length
    	$("#year").html(data[0].afeYr);
    	$("#ts").html(data[0].afeDemdDgr);
    	$("#bonbu").html(data[0].erpHdofcNm /*+ demandMsgArray['hdofc']*/);

    	afeYrPop = data[0].afeYr;
    	afeDemdDgrPop = data[0].afeDemdDgr;
    	erpHdofcCdPop = data[0].erpHdofcCd;

    	var updateData = [];
    	$.each(data, function(idx, obj){
    		obj.changeUprc = obj.stdUprc;
    		updateData.push(obj);
    	});
    	//for (var i = 0; i <= count; i++){
        	$('#simulGrid').alopexGrid('dataAdd', updateData);
    	//}
    	$('#simulGrid').alopexGrid('startEdit');
    }
    
    function simulStart(){
    	
    	$('#simulGrid').alopexGrid('endEdit');
    	
    	var insertRow =  $('#simulGrid').alopexGrid("dataGet");
    	var dataParam = new Object();

    	bodyProgress();
    	dataParam.diErpUprcTmpSq = flagSeq;
    	dataParam.afeYr = afeYrPop;
    	dataParam.afeDemdDgr = afeDemdDgrPop;
    	dataParam.erpHdofcCd = erpHdofcCdPop;
    	//console.log(dataParam);
    	dataParam.gridData = {
    			insertRow : insertRow 
    	};
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/simulstart', dataParam, 'POST', 'simulStart');
    }
    
    function priceApply() {
    	
    	$('#simulGrid').alopexGrid('endEdit');
    	
    	if (flagSeq ==null || flagSeq ==' '){
    		alertBox('W', demandMsgArray['noUpdateErpUnitPrice']);/*"수정할 단가가 존재 하지 않습니다.<br>시뮬레이션후 적용 해주세요."*/
    		return;
    	}
    	
    	callMsgBox('','C', demandMsgArray['applyChangedErpUnitPrice'], function(msgId, msgRst){  /*'수정한 단가를 적용하시겠습니까?'*/

    		if (msgRst == 'Y') {
            	bodyProgress();
		    	var dataParam= {
		    			diErpUprcTmpSq : flagSeq 
		    	};
		    	
		    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/priceapply', dataParam, 'POST', 'priceApply');
    		}
    	});
    }
    
    function deleteTemp(seq){
    	dataParam = {
    			diErpUprcTmpSq : seq
    	}
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/erpprice/deletetemp', dataParam, 'POST', 'deleteTemp');
    }
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
	
	function checkData(){

		var gridList = AlopexGrid.currentData( $('#simulGrid').alopexGrid("dataGet") );
    	var chkResult = true;
    	var chkMsg = "";
    	var chkData;
        for (var i = 0 ; i < gridList.length ; i++ ) {
        	chkData = gridList[i];
        	
    		if (nullToEmpty(chkData.changeUprc).toString() == '' ) {
    			chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['changeUnitPrice']); 
    			chkResult = false; 
    			break;
    			/* {0} 번째줄의 {1}은(는) 필수입니다";*/ 
    		}
        }
        if (chkResult == false) {
        	alertBox('W', chkMsg);
    		return chkResult;
        }
        return chkResult;
	}
    
    function setEventListener() {
        // 시뮬레이션
        $('#simulStBtn').on('click', function(e) {
        	if (checkData() == false) {
        		return false;
        	}
        	simulStart();
        });
        
        // 적용 
        $('#applyBtn').on('click', function(e) {
        	priceApply();
        });

        // 닫기 
        $('#closeBtn').on('click', function(e) {
        	deleteTemp(flagSeq);
			$a.close(false);
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
    	
    	if(flag == 'simulStart'){
        	bodyProgressRemove();
    		flagSeq = response.result.simulSeq;
    		var simulData = response.result.simulList;
    		$( '#applyGrid').alopexGrid("sortClear");
    		$( '#applyGrid').alopexGrid("dataEmpty");
    		if(response!= null) {
        		$( '#applyGrid').alopexGrid("dataSet", simulData);
    		}
    	}
    	if(flag == 'priceApply'){
        	bodyProgressRemove();
    		callMsgBox('', 'I', demandMsgArray['applied'], function() {  /*"적용 했습니다."*/
    			deleteTemp(flagSeq);
    			$a.close(true);
    		})
    	}
    	if(flag == 'excelUp'){
    		$( '#simulGrid').alopexGrid("dataEmpty");
    		if (response.excelData != null && response.excelData.length > 0) {
    			$( '#simulGrid').alopexGrid("dataSet", response.excelData);
    		}

    		$( '#applyGrid').alopexGrid("dataEmpty");
    		if (response.simulData != null && response.simulData.length > 0) {
        		//flagSeq = response.simulData.simulSeq;
    			$( '#applyGrid').alopexGrid("dataSet", response.simulData);
    		}
    	}
    }
    
    //request 실패시.
    function failDemandCallback( response, flag){
    	bodyProgressRemove();
    	if(flag == 'simulStart'){
    		alertBox('W', response.message);	
    	}
    	else if(flag == 'priceApply'){
    		bodyProgressRemove();
    		alertBox('W', response.message);	
    	} else if (flag == 'excelUp') {
    		bodyProgressRemove();
    		$( '#simulGrid').alopexGrid("dataEmpty");
    		$( '#applyGrid').alopexGrid("dataEmpty");
    		alertBox('W', demandMsgArray['searchFail'] );	
    	}
    }
    
});
