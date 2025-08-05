/**
 * PopAfeNew.js
 *
 * @author P095783
 * @date 2016. 8. 10.
 * @version 1.0
 */
var wreSrvcTypList = [];
var wreSrvcTypCdList = [];
var wreSrvcTypNmList = [];
var wreSrvcTypList_NM = [];

$a.page(function() {
	
	//그리드 ID
    var gridId = 'wreSrvcTypCdGrid';
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	initGridPop();
    	setArrayPop();
    	setEventListenerPop();
    };
    
  //Grid 초기화
    function initGridPop() {
		var mappingPop = [
//			{
//				selectorColumn : true,
//				key : 'check',
//				width:'40px',
//			},
			{
				key : 'swgTypCd',
				title : demandMsgArray['swgTypCd'] /*스윙유형코드*/,
				sortable : true,
				frozen : true,
				align:'center',
				width:'60px',
				render : function(value ,data) {
//					if (value === null)
//						return ' ';
					return value;
				}
			}
    		,{
				key : 'swgTypNm',
				title : demandMsgArray['wreSrvcTypNm'] /*유선서비스유형명*/,
				align:'center',
				width:'160px',
				render : function(value ,data) {
//					if (value === null)
//						return ' ';
					return value;
				}
			}
    		,{
				key : 'wreSrvcTypCdHid',
				hidden: true,
				title : demandMsgArray['wreSrvcTypCd'] /*유선서비스유형코드*/,
				render : {type : 'string',
					rule : function(value, data) {
						return wreSrvcTypCdList;
					}
				},
				editable : {type : 'select', 
					rule : function(value, data) {
						return wreSrvcTypCdList;
					}
					, attr : {
		 				style : "width: 95px;min-width:95px;padding: 3px 3px;"
		 			}
				},
				editedValue : function (cell) {
					return $(cell).find('select option').filter(':selected').val();
				}
			}
    		,{
    			key : 'wreSrvcTypCd',
    			title : demandMsgArray['media'] /*매체*/,
    			render : {type : 'string',
    				rule : function(value, data) {
    					var render_data = [];
    					
    					render_data = render_data.concat({value : '', text : '선택 안함' /* 선택 안함 */});
    					render_data = render_data.concat(wreSrvcTypNmList);
    					return render_data;
    				}
    			},
    			editable : {type : 'select', 
    				rule : function(value, data) {
    					var render_data = [];
    					console.log(data)
    					render_data = render_data.concat({value : '', text : '선택 안함' /* 선택 안함*/});
    					render_data = render_data.concat(wreSrvcTypNmList);
    					return render_data;
    				}
    			, attr : {
    				style : "width: 95px;min-width:95px;padding: 3px 3px;"
    			}
    			},
    			editedValue : function (cell) {
    				return $(cell).find('select option').filter(':selected').val();
    			},
    		}
//    		,{
//				key : 'wreSrvcTypNm',
//				title : demandMsgArray['wreSrvcTypNm'] /*유선서비스유형코드명*/,
//				render : function(value, data, render, mapping){
//					var data = AlopexGrid.currentData(data);
//					return wreSrvcTypList_NM[data.wreSrvcTypCd];
//				},
//				refreshBy: true
//			}
    		,{
				key : 'useYn',
				align:'center',
				width:'40px',
				title : demandMsgArray['useYesOrNo'] /*사용여부*/,
    			hidden : true
			} 
    		,{
    			key : 'lastChgDate',
    			align:'center',
    			width:'50px',
    			title : demandMsgArray['modificationDate'] /*수정일자*/
	 		   ,render : function(value, data) {
				   if (value == undefined || value == null || '' == value) {
					   return '';
				   }
				   return value.substring(0,11);
			   }
    		} 
    		,{
    			key : 'lastChgUserId',
    			align:'center',
    			width:'60px',
    			title : demandMsgArray['modificationPerson'] /*수정자*/
    		} 
		];
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	defaultState : {
        		dataAdd : {
        			editing : true,
        			selected : true,
        		},
        	},
        	autoColumnIndex : true,
			rowClickSelect : false,
			numberingColumnFromZero : false,
			disableTextSelection : true,
			rowInlinEdit : false,
			rowSingleSelect : false,
			height : 450,
        	columnMapping : mappingPop
//        	,
//        	headerGroup : [
//                           { fromIndex : 11, toIndex : 13, title : demandMsgArray['headquarters'] /*본사*/ },
//                           { fromIndex : 14, toIndex : 16, title : demandMsgArray['capitalArea'] /*수도권*/},
//                           { fromIndex : 17, toIndex : 19, title : demandMsgArray['easternPart'] /*동부*/ },
//                           /*{ fromIndex : 20, toIndex : 22, title : demandMsgArray['daegu'] },*/  /*대구*/
//                           { fromIndex : 20, toIndex : 22, title : demandMsgArray['westernPart'] /*서부*/ },
//                           { fromIndex : 23, toIndex : 25, title : demandMsgArray['centerPart'] /*중부*/ },
//            ]
        	,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
        $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		var selected = event.data._state.selected;
    		
    		$('#'+gridId).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
    		
    			var ev = AlopexGrid.parseEvent(e);
    			$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
    	});
    	
    };
    
    
    
    var showProgressPop = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgressPop = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
    //조회
    function searchwreSrvcTypCd(){
		showProgressPop(gridId);
				
		
		$( '#'+gridId).alopexGrid("sortClear");
		$( '#'+gridId).alopexGrid("dataEmpty");
		
		if(Array.isArray(wreSrvcTypList) != null && wreSrvcTypList.length != 0) {
    		$( '#'+gridId).alopexGrid("dataSet", wreSrvcTypList);
		}
		hideProgressPop(gridId);
	}
    
    function checkRowDataPop() {
		//전체종료
		$('#'+gridId).alopexGrid('endEdit', {_state: {editing:true}});
		var editingRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", [{_state:{editing:true}}]));
		if (editingRow.length > 0 ){
			return false;
		} else {
			return true;
		}
	}
    
    function excelExportPop() {
    	var list = AlopexGrid.trimData( $("#"+gridId).alopexGrid( "dataGet", {} ) );
    	if ( list.length < 1 ) {
    		alertBox('W',demandMsgArray['noData']);
    		return false;
    	}
    	
    	callMsgBox('','C', demandMsgArray['confirmExcelPrinting'], function(msgId, msgRst){ /* 엑셀로 출력 하시겠습니까? */
    		if (msgRst == 'Y') {
    			bodyProgress();
    			var worker = new ExcelWorker({
    				excelFileName : '유선서비스 유형코드 리스트', /*유선서비스 유형코드 리스트*/
    				palette : [{
    					className : 'B_YELLOW',
    					backgroundColor : '255,255,0'
    				},{
    					className : 'F_RED',
    					color : '#FF0000'
    				}],
    				sheetList : [{
    					sheetName : '유선서비스 유형코드 리스트', /*유선서비스 유형코드 리스트*/
    					$grid : $('#'+gridId)
    				}]
    			});
    			worker.export({
    				filterdata : false,
    				selected : false,
    				exportHidden : false,
    				merge : false,
    				useGridColumnWidth : true,
            		border  : true,
            		useCSSParser : true
    			});
            	bodyProgressRemove();
    		}
    	});
    }
    
  //구분 셋팅
    function setArrayPop(){
    	bodyProgress();
    	var sflag = "selectWreSrvcTypCdList"
    	var dataParam = {
    	}
    	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/selectWreSrvcTypCdList', dataParam, 'GET', sflag);
    	
    }
    
	// 저장
	function saveWreSrvcTypCd(){
		if (checkRowDataPop() == false){
			return;
		}

		var gridList = AlopexGrid.currentData( $('#'+gridId).alopexGrid("dataGet") );
    	var chkResult = true;
    	var chkMsg = "";
    	var chkData;
//        for (var i = 0 ; i < gridList.length ; i++ ) {
//    		chkData = gridList[i];
//    		if (nullToEmpty(chkData.wreSrvcTypCd) == '' ) {
//    			chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['wreSrvcTypCd']); chkResult = false; break;
//    			/*(i+1) + "번째줄의 유선서비스유형코드은 필수입니다.";*/ 
//    		}
//        }

		if ( chkResult == false ){
			alertBox('W', chkMsg );
			return false;
		}
		
		
		var editRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {added:false, edited : true , deleted : false}}, {_state : {added:true, deleted : false}}] ));
		
		var dataParam = new Object();
		
		dataParam.gridData = {
				editRow : editRow
		}
		
		var editRowLength = editRow.length;
		
    	/*"저장하시겠습니까?"*/
		callMsgBox('','C', demandMsgArray['save'] + '<br><br>' + editRowLength + '개의 변경된 데이터가있습니다.', function(msgId, msgRst){  
    		if (msgRst == 'Y') {
    			callMsgBox('','C', '※변경된 데이터는 다음날 부터 적용됩니다.', function(msgId_se, msgRst_se){  
    	    		if (msgRst_se == 'Y') {
		    			bodyProgress();
		    			demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/saveWreSrvcTypCd', dataParam, 'POST', 'saveWreSrvcTypCd');
    	    		}
    			})
    		}
		});
	}
	
    function setEventListenerPop() {

    	//저장
    	$('#btnSavedWreSrvcTypCd').on('click', function(e) {
    		saveWreSrvcTypCd();
        });
    	
    	//닫기
    	$('#btnCancel').on('click', function(e) {
    		$a.close();
    	});
    	
    	$('#excelDownload').on('click',function(e){    		
    		excelExportPop();
    	});
	};
	
	
	//request
	function demandRequestPop(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandDetailCallbackPop(response, sflag);})
    	  .fail(function(response){failDemandDetailCallbackPop(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successDemandDetailCallbackPop(response, flag){
    	
    	//구분 셋팅
    	if(flag == 'selectWreSrvcTypCdList') {
    		wreSrvcTypList = response.list;
    		
    		sflag = "selectWreSrvcTypNmList"
            	var dataParam = {
            	}
        	demandRequestPop('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/selectWreSrvcTypNmList', dataParam, 'GET', sflag);
    	}
    	
    	if(flag == 'selectWreSrvcTypNmList') {
    		wreSrvcTypList_NM = response.list;
    		var objectList = [];
    		var objectList_2 = [];
    		var selectWreSrvcList = response.selectWreSrvcList;
			
    		$.each(selectWreSrvcList, function(index, item){
    			var object = new Object();
    			object.value = item.wreSrvcTypCd;
    			object.text = item.wreSrvcTypNm;
    			objectList[index] = object;
    		});
    		wreSrvcTypNmList = objectList
    		
    		$.each(wreSrvcTypList_NM, function(index, item){
    			var object = new Object();
    			object.value = item.wreSrvcTypCd;
    			object.text = item.wreSrvcTypCd;
    			objectList_2[index] = object;
    		});
    		
    		wreSrvcTypCdList = objectList_2
    		
    		var object_2 = new Object();
    		$.each(wreSrvcTypList_NM, function(index, item){
    			object_2[item.wreSrvcTypCd] = item.wreSrvcTypNm;
    		});
    		wreSrvcTypList_NM = object_2;
    		
    		searchwreSrvcTypCd();
    	}
    	
    	//저장
    	if(flag == 'saveWreSrvcTypCd') {
    		callMsgBox('', 'I', demandMsgArray['saveSuccess'] , function() {
        		setArrayPop();
    		}); /*저장을 완료 하였습니다.*/
    	}
    	bodyProgressRemove();
    	hideProgressPop(gridId);
    }
    
    //request 실패시.
    function failDemandDetailCallbackPop(response, flag){

    	if(flag == 'searchwreSrvcTypCd') {
    		bodyProgressRemove();
    		hideProgressPop(gridId);
    		
    		//$( '#'+gridId).alopexGrid("sortClear");
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		alertBox('W', demandMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
    	
    	if(flag == 'selectwreSrvcTypCdList' || flag == 'selectwreSrvcTypNmList') {
    		bodyProgressRemove();
    		//$( '#'+gridId).alopexGrid("sortClear");
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		alertBox('W', demandMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    	}
    	
    	//저장
    	if(flag == 'saveWreSrvcTypCd') {
    		bodyProgressRemove();
    		callMsgBox('', 'W', demandMsgArray['saveFail'] ); /*저장을 실패 하였습니다.*/
    	}
    	hideProgressPop(gridId);
    }
    
});