/**
 * PopAfeNew.js
 *
 * @author P095783
 * @date 2016. 8. 10.
 * @version 1.0
 */
var bizCdList;
var demdBizDivCdList = [];
var invtDivCdList = [];
var afeTs = null;

$a.page(function() {
	
	//그리드 ID
    var gridId = 'afeNewGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	if ( (param.afeYr !='' && param.afeYr != null) && ( param.afeDemdDgr !='' && param.afeDemdDgr != null) ){
    		setCombo(param.afeYr);
    		afeTs = param.afeDemdDgr;
    	} else {
    		setCombo();
    		afeTs = "";
    	}
    	setArray();    	
    	initGrid();
    	setEventListener();
    	//searchAfeNew();
    };
    
  //Grid 초기화
    function initGrid() {
		var mapping = [
			{
				selectorColumn : true,
				key : 'check',
				width:'40px',
			}
    		, {
				key : 'afeYr',
				title : demandMsgArray['afeYear'] /*AFE 년도*/,
				sortable : true,
				frozen : true,
				align:'center',
				width:'60px',
				render : function(value ,data) {
					if (value === null)
						return ' ';
					return value;
				}
			}
    		,{
				key : 'afeDemdDgr',
				title : demandMsgArray['afeDegree'] /*AFE 차수*/,
				align:'center',
				width:'60px',
				render : function(value ,data) {
					if (value === null)
						return ' ';
					return value;
				}
			}
    		,{
				key : 'oldAfeYr',
				hidden : true,
				title : demandMsgArray['byYear'] /*년도*/,
				render : function(value, data) {
					return value;
				}
			}
    		,{
				key : 'oldAfeDemdDgr',
				title : demandMsgArray['degree'] /*차수*/,
				hidden : true,
				render : function(value, data) {
					return value;
				}
			}
    		,{
				key : 'invtDivCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['division'] /*구분*/,
				render : {type : 'string',
					rule : function(value, data) {
						return invtDivCdList;
					}
				},
				editable : {type : 'select', 
					rule : function(value, data) {
						return invtDivCdList;
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
				key : 'bizCd',
				title : demandMsgArray['businessDivisionBig'] /*사업구분(대)*/,
				align : 'left',
				width : '180px',
				render : {type : 'string',
					rule : function(value, data) {
						return bizCdList;
					}
				},
				editable : {type : 'select', 
					rule : function(value, data) {
						return bizCdList;
					}
					, attr : {
		 				style : "width: 170px;min-width:170px;padding: 3px 3px;"
		 			}
				},
				editedValue : function (cell) {
					return $(cell).find('select option').filter(':selected').val();
				}
			} 
    		,{
				key : 'oldPrntBizDivCd',
				hidden : true,
				render : function(value, data) {
					return value;
				}
			}
    		,{
				key : 'oldInvtDivCd',
				hidden : true,
				render : function(value, data) {
					return value;
				}
			}
    		,{
				key : 'demdBizDivNm',
				title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/,
				hidden : true
			}
    		,{
				key : 'demdBizDivCd',
				align:'left',
				width:'300px',
				title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/,
				render : { type:'string',
					rule : function(value, data){
						var render_data = [];
						var currentData = AlopexGrid.currentData(data);
						if (demdBizDivCdList[currentData.bizCd]) {
							return render_data = render_data.concat(demdBizDivCdList[currentData.bizCd]);
						} else {
							return render_data.concat({value : data.demdBizDivCd, text : data.demdBizDivNm});
						}
					}
				}
				,editable : {type : 'select', 
					rule : function(value, data){
						var render_data = [];
						var currentData = AlopexGrid.currentData(data);
						if (demdBizDivCdList[currentData.bizCd]) {
							return render_data = render_data.concat(demdBizDivCdList[currentData.bizCd]);
						} else {
							//alertBox('W', demandMsgArray['afeNewWarning']);
							return render_data = render_data.concat({value : '', text : demandMsgArray['none']});  /*없음*/
						}
					}
					, attr : {
		 				style : "width: 280px;min-width:280px;padding: 3px 3px;"
		 			}
				}
				,editedValue : function (cell) {
					return $(cell).find('select option').filter(':selected').val();
				},
				refreshBy: 'bizCd'
    		}
    		,{
				key : 'hdqtrMtrlCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['materialPrice']/*물자비*/
		    	,  render: function(value, data) {
		    		if(value == undefined)
		    			value = "0";	
		    		return number_format(Number(value), 2)
		    	}
				,  editable : {  type: 'text'
						, attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
	               		, styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'bonsa',
				align:'right',
				width:'100px',
				title :demandMsgArray['constructionCost']/*공사비*/
    		    ,  render: function(value, data) {
    		    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
			} 
    		,{
				key : 'hdqtrLandCnstCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['landConstructCost']/*토지건축비*/
	    		,  render: function(value, data) {
	    			if(value == undefined)
		    			value = "0";	
		    		return number_format(Number(value), 2)
		    	}
				,  editable : {  type: 'text'
						, attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
	               		, styleclass : 'num_editing-in-grid'}
	    	}
    		,{
				key : 'cptMtrlCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['materialPrice']/*물자비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'sudo',
				align:'right',
				width:'100px',
				title :demandMsgArray['constructionCost']/*공사비*/
    		    ,  render: function(value, data) {
    		    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
			} 
    		,{
				key : 'cptLandCnstCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['landConstructCost']/*토지건축비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'busanMtrlCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['materialPrice']/*물자비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'busan',
				align:'right',
				width:'100px',
				title :demandMsgArray['constructionCost']/*공사비*/
    		    ,  render: function(value, data) {
    		    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
			} 
    		,{
				key : 'busanLandCnstCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['landConstructCost']/*토지건축비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		/*,{
				key : 'daeguMtrlCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['materialPrice']물자비
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'daegu',
				align:'right',
				width:'100px',
				title :demandMsgArray['constructionCost']공사비
    		    ,  render: function(value, data) {
    		    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
			} 
    		,{
				key : 'daeguLandCnstCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['landConstructCost']토지건축비
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}*/
    		,{
				key : 'westMtrlCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['materialPrice']/*물자비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'seobu',
				align:'right',
				width:'100px',
				title :demandMsgArray['constructionCost']/*공사비*/
    		    ,  render: function(value, data) {
    		    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
			} 
    		,{
				key : 'westLandCnstCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['landConstructCost']/*토지건축비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'middMtrlCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['materialPrice']/*물자비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'jungbu',
				align:'right',
				width:'100px',
				title :demandMsgArray['constructionCost']/*공사비*/
    		    ,  render: function(value, data) {
    		    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
			} 
    		,{
				key : 'middLandCnstCost',
				align:'right',
				width:'100px',
				title : demandMsgArray['landConstructCost']/*토지건축비*/
			    ,  render: function(value, data) {
			    	if(value == undefined)
		    			value = "0";	
					return number_format(Number(value), 2)
				}
				,  editable : {  type: 'text'
			           , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "7"}
		               , styleclass : 'num_editing-in-grid'}
    		}
    		,{
				key : 'lastChgDate',
				align:'center',
				width:'100px',
				title : demandMsgArray['modificationDate'] /*수정일자*/,
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
        	columnMapping : mapping,
        	headerGroup : [
                           { fromIndex : 11, toIndex : 13, title : demandMsgArray['headquarters'] /*본사*/ },
                           { fromIndex : 14, toIndex : 16, title : demandMsgArray['capitalArea'] /*수도권*/},
                           { fromIndex : 17, toIndex : 19, title : demandMsgArray['easternPart'] /*동부*/ },
                           /*{ fromIndex : 20, toIndex : 22, title : demandMsgArray['daegu'] },*/  /*대구*/
                           { fromIndex : 20, toIndex : 22, title : demandMsgArray['westernPart'] /*서부*/ },
                           { fromIndex : 23, toIndex : 25, title : demandMsgArray['centerPart'] /*중부*/ },
            ],
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
        
        $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		var event = AlopexGrid.parseEvent(e);
    		var selected = event.data._state.selected;
    		
    		$('#'+gridId).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
    		
    		//var editing_list = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
    		
    		//if (checkRowData() == true) {
    			var ev = AlopexGrid.parseEvent(e);
    			$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
    		//}
    	});
    	
    	$('#'+gridId).on('dataAddEnd', function(e){
    		var addRowIndex = $('#'+gridId).alopexGrid('dataGet').length-1; //전체 행 가져오기
    		$('#'+gridId).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "bizCD" );
    	});
    	 // 사업구분(대) 변경시 편집시
        /*$('#'+gridId).on('cellValueChanged', function(e){
        	var ev = AlopexGrid.parseEvent(e);    
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	if ( ev.mapping.key == "bizCd" ) {
        		var bizCd = nullToEmpty(AlopexGrid.currentValue(data,  "bizCd" ));
        		if (!demdBizDivCdList[bizCd]) {
        			alertBox('W', demandMsgArray['afeNewWarning']);
        			return;
        		}
        	}
        });*/
    };
    
    
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
    
	//AFE 연차
    function setCombo(afeYr) {
    	if( afeYr == null || afeYr == ''){
    		selectAfeYearCode('scAfeYr', 'N', '');
    	} else {
    		selectAfeYearCode('scAfeYr', 'N', afeYr);
    	}
    	
    }
    
    //조회
    function searchAfeNew(){
		showProgress(gridId);
		$('#'+gridId).alopexGrid('endEdit');
				
		var dataParam = {
				sAfeYear : $('#scAfeYr').val(),
				sAfeDemdDgr : $('#scAfeDemdDgr').val()
		}
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectafenewlist', dataParam, 'GET', 'searchAfeNew');
	}
    
    function checkRowData() {
		//전체종료
		$('#'+gridId).alopexGrid('endEdit', {_state: {editing:true}});
		var editingRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", [{_state:{editing:true}}]));
		if (editingRow.length > 0 ){
			return false;
		} else {
			return true;
		}
	}
    
    //엑셀
    function excelDown() {
    	var dataParam =  $("#searchForm").getData();
    	dataParam.firstRowIndex = 1;
    	dataParam.lastRowIndex = 1000000;
    	
    	dataParam.fileName = demandMsgArray['createAfeBiz'].replace(/ /g, "") /*AFE 사업 등록*/;
    	dataParam.fileDataType = "afeNewExcelDown";
    	dataParam.fileExtension = "xlsx";
    	
    	bodyProgress();
    	
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmtexcel/afenewexceldownload'
		           , dataParam
		           , 'GET'
		           , 'excelDownload');
    }
    
    // 가져오기
    function getOtherData(){
    	var data = {
    			 afeYr : $('#scAfeYr').val()
    			,afeDemdDgr : $('#scAfeDemdDgr').val()
    	}
    	$a.popup({
        	popid: 'PopAfeSearch',
    		url : 'PopAfeSearch.do',
    		iframe : true,
    		modal : true,
    		data : data,
    		width : 420,
    		height : 200,
    		title : demandMsgArray['bringOtherYearBudget'] /*다른 차수 불러오기*/,
    		movable : true,
    		callback : function (appendData) {
    			if (appendData != null && appendData.length > 0) {
	    			bodyProgress();
	            	var updateData = [];
	    			$.each(appendData, function(idx, obj){   
	    					var initRowData = 
				           	    {
				           	    	"afeYr" : $("#scAfeYr").val()
				           	    	,"afeDemdDgr" : $("#scAfeDemdDgr").val()
				           	    	,"invtDivCd" :  obj.invtDivCd
				           	    	,"bizCd" : obj.bizCd
				           	    	,"demdBizDivCd" : obj.demdBizDivCd
				           	    	,"hdqtrMtrlCost" : obj.hdqtrMtrlCost
				           	    	,"bonsa" : obj.bonsa
				           	    	,"hdqtrLandCnstCost" : obj.hdqtrLandCnstCost
				           	    	,"cptMtrlCost" : obj.cptMtrlCost
				           	    	,"sudo" : obj.sudo
				           	    	,"cptLandCnstCost" : obj.cptLandCnstCost
				           	    	,"busanMtrlCost" : obj.busanMtrlCost
				           	    	,"busan" : obj.busan
				           	    	,"busanLandCnstCost" : obj.busanLandCnstCost
				           	    	/*,"daeguMtrlCost" : obj.daeguMtrlCost
				           	    	,"daegu" : obj.daegu
				           	    	,"daeguLandCnstCost" : obj.daeguLandCnstCost*/
				           	    	,"westMtrlCost" : obj.westMtrlCost
				           	    	,"seobu" : obj.seobu
				           	    	,"westLandCnstCost" : obj.westLandCnstCost
				           	    	,"middMtrlCost" : obj.middMtrlCost
				           	    	,"jungbu" : obj.jungbu
				           	    	,"middLandCnstCost" : obj.middLandCnstCost
				           	    }
				           	;
	    					updateData.push(initRowData);
	    			});
	    			//console.log(updateData);
	    			$( '#'+gridId).alopexGrid('dataAdd',updateData);
	    			bodyProgressRemove();
    			}
    		}
    	});
    }
    
    //행추가
    function addRow() {
    	if(Object.keys(demdBizDivCdList).length == 0){
    		alertBox('W',demandMsgArray['firstRegistrationBusinessDivisionCode']); /* 사업구분코드 등록 부터 해 주시기 바랍니다. */
			return;
    	}    	
    	var demdBizDivCd = demdBizDivCdList[bizCdList[0].value][0].value
    	var initRowData = [
    	    {
    	    	"afeYr" : $("#scAfeYr").val(),
    	    	"afeDemdDgr" : $("#scAfeDemdDgr").val(),
    	    	"invtDivCd" :  invtDivCdList[0].value,
    	    	"bizCd" : bizCdList[0].value,
    	    	"demdBizDivCd" : demdBizDivCd
    	    	,'hdqtrMtrlCost':'0'
        	   	,'bonsa':'0'
            	,'hdqtrLandCnstCost':'0'
    	    	,'cptMtrlCost':'0'
    	    	,'sudo':'0'
    	    	,'cptLandCnstCost':'0'
    	    	,'busanMtrlCost':'0'
    	    	,'busan':'0'
    	    	,'busanLandCnstCost':'0'
    	        /*,'daeguMtrlCost':'0'
    	        ,'daegu':'0'
    	    	,'daeguLandCnstCost':'0'*/
    	    	,'westMtrlCost':'0'
    	    	,'seobu':'0'
    	    	,'westLandCnstCost':'0'
    	    	,'middMtrlCost':'0'
        	    ,'jungbu':'0'
        	    ,'middLandCnstCost':'0'
    	    }
    	];
    	$( '#'+gridId).alopexGrid("dataAdd", initRowData);
    }
    
    //행삭제
    function removeRow() {
    	var dataList = $( '#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('W', demandMsgArray['selectNoDataForDelete'] ); /*"선택된 데이터가 없습니다.\n삭제할 데이터를 선택해 주세요."*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];
    		var rowIndex = data._index.data;
    		$( '#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    	
    }
    
  //구분 셋팅
    function setArray(){
    	var sflag = "selectInvtDivCdList"
    	var dataParam = {
    	}
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectinvtdivcdlist', dataParam, 'GET', sflag);
    }
    
    //사업구분(대)를 list로 셋팅해주는 함수
    function selectBizCdList(afeYr){
    	var sflag = "bizCdList";
    	var dataParam = {
				sAfeYear : afeYr
		}
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectbizcdlist', dataParam, 'GET', sflag);
    }
    
    
    /*
	 * Function Name : selectDemdBizDivCdList
	 * Description   : 그리드내 사업구분(대)별 사업구분(세부) 콤보에 설정할 목록을 array로 리턴
	 */
	function selectDemdBizDivCdList(afeYr) {
		//var dataParam = {afeYr : afeYr};
		var sflag = 'selectDemdBizDivCdList';
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectdemdbizdivcdlist/' + afeYr, null, 'GET', sflag);		
	}
    
	// 저장
	function saveAfeNew(){
		if (checkRowData() == false){
			return;
		}

		var gridList = AlopexGrid.currentData( $('#'+gridId).alopexGrid("dataGet") );
    	var chkResult = true;
    	var chkMsg = "";
    	var chkData;
        for (var i = 0 ; i < gridList.length ; i++ ) {
    		chkData = gridList[i];
    		if (nullToEmpty(chkData.bizCd) == '' ) {
    			chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['businessDivisionBig']); chkResult = false; break;
    			/*(i+1) + "번째줄의  사업구분(대)은 필수입니다.";*/ 
    		}
    		if (nullToEmpty(chkData.demdBizDivCd) == '') {
    			chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['businessDivisionDetl']); chkResult = false; break;
    			/*(i+1) + "번째줄의  사업구분(세부)은 필수입니다.";*/ 
    		}
    		if (nullToEmpty(chkData.bonsa)+'' == '' && nullToEmpty(chkData.sudo)+'' == '' 
    			&& nullToEmpty(chkData.busan)+'' == '' /*&& nullToEmpty(chkData.daegu)+'' == '' */
    			&& nullToEmpty(chkData.seobu)+'' == '' && nullToEmpty(chkData.jungbu)+'' == '' 
    			&& nullToEmpty(chkData.hdqtrMtrlCost)+'' == '' && nullToEmpty(chkData.cptMtrlCost)+'' == '' 
        		&& nullToEmpty(chkData.busanMtrlCost)+'' == '' /*&& nullToEmpty(chkData.daeguMtrlCost)+'' == '' */
            	&& nullToEmpty(chkData.westMtrlCost)+'' == '' && nullToEmpty(chkData.middMtrlCost)+'' == '' 
            	&& nullToEmpty(chkData.hdqtrLandCnstCost)+'' == '' && nullToEmpty(chkData.cptLandCnstCost)+'' == '' 
        		&& nullToEmpty(chkData.busanLandCnstCost)+'' == '' /*&& nullToEmpty(chkData.daeguLandCnstCost)+'' == '' */
            	&& nullToEmpty(chkData.westLandCnstCost)+'' == '' && nullToEmpty(chkData.middLandCnstCost)+'' == '' ) {
    			chkMsg = makeArgMsg('checkMinBudgetData', (i+1)); chkResult = false; break;
    			/*(i+1) + "최소 하나 이상의 본부에 예산을 설정해 주세요.";*/ 
    		}
        }

		if ( chkResult == false ){
			alertBox('W', chkMsg );
			return false;
		}
		
		//중복 체크
		var overlabCheckFlag = true;
		var overlabChekListFirst = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet"));
		var overlabChekListSecond = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet"));
		
		for (var i =0; i < overlabChekListFirst.length; i++) {
			var ocAfeYr = overlabChekListFirst[i].afeYr;
			var ocAfeDemdDgr = overlabChekListFirst[i].AfeDemdDgr;
			var invtDivCd = overlabChekListFirst[i].invtDivCd;
			var bizCd = overlabChekListFirst[i].bizCd;
			var demdBizDivCd = overlabChekListFirst[i].demdBizDivCd;
			for (var j =i+1 ; j < overlabChekListSecond.length; j++){
				if(ocAfeYr == overlabChekListSecond[j].afeYr 
						&& ocAfeDemdDgr == overlabChekListSecond[j].ocAfeDemdDgr 
						&& invtDivCd == overlabChekListSecond[j].invtDivCd
						&& bizCd == overlabChekListSecond[j].bizCd
						&& demdBizDivCd == overlabChekListSecond[j].demdBizDivCd ) {
					overlabCheckFlag = false;
				}
			}
		}
		
		if ( overlabCheckFlag == false ){
			alertBox('W', demandMsgArray['afeDuplicationCheck'] );
			return;
		}
		
		var editRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {added:false, edited : true , deleted : false}}, {_state : {added:true, deleted : false}}] ));
		var deleteRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
		if ( editRow.length == 0 && deleteRow.length == 0 ) {
			alertBox('W', demandMsgArray['noChangedData'] ); /*변경된 내용이 없습니다*/
			return;
		}
		var dataParam = new Object();
		
		//dataParam.changedUserId = 'Hero' /*추후세션으로받을값*/
		dataParam.gridData = {
				editRow : editRow
				, deleteRow : deleteRow
		}
    	/*"저장하시겠습니까?"*/
		callMsgBox('','C', demandMsgArray['save'], function(msgId, msgRst){  
    		if (msgRst == 'Y') {
    			bodyProgress()
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/saveafenew', dataParam, 'POST', 'saveAfeNew');
    		}
		});
	}
	
    function setEventListener() {
    	//조회
    	$('#btnSearchAfeNew').on('click', function(e) {
    		searchAfeNew();
    	});
    	
    	//AFE 년도 변경 이벤트
        $('#scAfeYr').on('change',function(e) {
        	var dataParam = { 
        			AfeYr : this.value
    		};
        	if (afeTs == null) {
        		selectAfeTsCode('scAfeDemdDgr', 'N', '', dataParam);
        	}else {
        		selectAfeTsCode('scAfeDemdDgr', 'N', afeTs, dataParam);
        	}
    		selectBizCdList($('#scAfeYr').val());	// 사업구분 대
    		selectDemdBizDivCdList($('#scAfeYr').val()); // 사업구분 세부
    		
    		//수정 내역이 있으면 저장여부 확인
    		var modifyList =  AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {edited : true}}, {_state : {added:true}}, {_state:{added:false, deleted:true}}] ));
    		if (modifyList.length > 0 ) {
    			
    		} else {
    			//searchAfeNew();
    		}
    		
        });
        
        //AFE 차수 변경 이벤트
        $('#scAfeDemdDgr').on('change',function(e) {
        	//수정 내역이 있으면 저장여부 확인
    		var modifyList =  AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {edited : true}}, {_state : {added:true}}, {_state:{added:false, deleted:true}}] ));
    		//if (modifyList.length > 0 ) {
    		//	saveAfeNew();
    		//} else {
    			searchAfeNew();
    		//}
        });
        
        //가져오기
        $('#getOtherData').click(function() {
        	getOtherData();
    	});
    	
        //엑셀
        $('#excelDown').click(function() {
        	bodyProgress();
        	excelDown();
    	});
        
    	//행추가
    	$('#appendAfe').on('click', function(e) {
        	addRow();
        });
    	
    	//핵삭제
    	$('#deleteAfe').on('click', function(e) {
			removeRow();
        });
    	
    	//저장
    	$('#btnSaveAfeNew').on('click', function(e) {
    		saveAfeNew();
        });
	};
	
	
	//request
	function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandDetailCallback(response, sflag);})
    	  .fail(function(response){failDemandDetailCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successDemandDetailCallback(response, flag){
    	
    	//구분 셋팅
    	if(flag == 'selectInvtDivCdList') {
			invtDivCdList = response.list;
    	}
    	
    	//사업구분대 셋팅
    	if(flag == 'bizCdList') {
			bizCdList = response.list;
    	}
    	
    	//사업구분 세부 셋팅
    	if(flag == 'selectDemdBizDivCdList'){
			demdBizDivCdList = response.bizSebuCombo;
    	}
    	
    	//조회
    	if(flag == 'searchAfeNew') {
    		hideProgress(gridId);
    		
    		$( '#'+gridId).alopexGrid("sortClear");
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		
    		if(response!= null) {
        		$( '#'+gridId).alopexGrid("dataSet", response.list);
    		}
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
        		bodyProgressRemove();
    			callMsgBox('', 'W', demandMsgArray['systemError'] ); /*시스템 오류가 발생하였습니다.*/
    		}
    	}
    	//저장
    	if(flag == 'saveAfeNew') {
    		bodyProgressRemove();
    		callMsgBox('', 'I', demandMsgArray['saveSuccess'] , function() {
        		searchAfeNew();
    		}); /*저장을 완료 하였습니다.*/
    	}
    	hideProgress(gridId);
    }
    
    //request 실패시.
    function failDemandDetailCallback(response, flag){
    	if(flag == 'searchAfeNew') {
    		hideProgress(gridId);
    		
    		//$( '#'+gridId).alopexGrid("sortClear");
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		alertBox('W', demandMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
    	//저장
    	if(flag == 'saveAfeNew') {
    		bodyProgressRemove();
    		callMsgBox('', 'W', demandMsgArray['saveFail'] ); /*저장을 실패 하였습니다.*/
    	}
    	if(flag == 'excelDownload') {
    		bodyProgressRemove();
			callMsgBox('', 'W', demandMsgArray['systemError'] ); /*시스템 오류가 발생하였습니다.*/
    	}
    	hideProgress(gridId);
    }
    
});