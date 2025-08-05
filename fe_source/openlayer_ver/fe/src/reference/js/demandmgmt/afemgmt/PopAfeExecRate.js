/**
 * PopAfeExecRate.js
 * @author P095783
 * @date 2023. 7. 05.
 * @version 1.0
 */
var bizCdList;
var demdBizDivCdList = [];
var invtDivCdList = [];
var afeTs = null;
var paramData;

$a.page(function() {
	
	//그리드 ID
    var gridId = 'afeNewGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param
    	if ( (param.afeYr !='' && param.afeYr != null) && ( param.afeDemdDgr !='' && param.afeDemdDgr != null) ){
    		setCombo(param.afeYr);
    		afeTs = param.afeDemdDgr;
    	} else {
    		setCombo();
    		afeTs = "";
    	}
    	initGrid();
    	setEventListener();
    	searchList();
    };
    
  //Grid 초기화
    function initGrid() {
		var mapping = [
    		{
				key : 'afeYr',
				title : demandMsgArray['afeYear'] /*AFE 년도*/,
				sortable : true,
				frozen : true,
				align:'center',
				width:'60px',
			}
    		,{
				key : 'afeDemdDgr',
				title : demandMsgArray['afeDegree'] /*AFE 차수*/,
				align:'center',
				width:'60px',
			}
    		,{
				key : 'erpHdofcNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['hdofc'] /*본부*/
			} 
    		,{
				key : 'demdBizDivNm',
				title : demandMsgArray['businessDivisionBig'] /*사업구분(대)*/,
				align : 'center',
				width : '120px',
			} 
    		,{
				key : 'demdBizDivDetlNm',
				align:'left',
				width:'230px',
				title : demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/,
    		}
    		,{
				key : 'trmsDemdMgmtNo',
				align:'center',
				width:'180px',
				title : demandMsgArray['transmissionDemandManagementNumber'] /*전송수요관리번호*/,
			}
    		,{
				key : 'bizNm',
				align:'left',
				width:'250px',
				title : demandMsgArray['businessName']/*사업명*/
    		}
    		,{
				key : 'tnPrjID',
				align:'center',
				width:'110px',
				title :demandMsgArray['projectCode']/*프로젝트코드*/
			},{
				key : 'appltNm',
				align:'center',
				width:'250px',
				title : '청약명'
	    	},{
				key : 'cstrNm',
				align:'center',
				width:'250px',
				title : '공사명'
	    	} 
    		,{
				key : 'engstNo',
				align:'center',
				width:'120px',
				title : 'Eng.Sheet No'
	    	}
    		,{
				key : 'efdgYn',
				align:'center',
				width:'100px',
				title : '실시설계 여부'
    		}
    		,{
				key : 'setlYn',
				align:'center',
				width:'100px',
				title : '정산완료 여부'
			} 
    		,{
				key : 'bdgtAmt',
				align:'center',
				width:'100px',
				title : '사업배정예산',
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
    		}
    		,{
				key : 'engdnSumrAmt',
				align:'right',
				width:'100px',
				title :'확정금액',
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
			} 
    		,{
				key : 'efdgSumrAmt',
				align:'right',
				width:'100px',
				title : '설계금액',
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
    		}
    		,{
				key : 'setlSumrAmt',
				align:'right',
				width:'100px',
				title : '집행금액',
  				render : function(value, data) {
  					if (value == undefined || value == null || ' ' == value || '0' == value) {
  						return '0.00';
  					}
  					return setComma( number_format( Number( value )/1000000, 2 ) );
  				}
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
			height : 530,
        	columnMapping : mapping,
			message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        });
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
    function searchList(){
		showProgress(gridId);
		$('#'+gridId).alopexGrid('endEdit');
		console.log(paramData);
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectafeexecratedetaillist', paramData, 'GET', 'searchList');
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
		var worker = new ExcelWorker({
     		excelFileName : 'AFE별 집행률 상세',
     		sheetList: [{
     			sheetName: 'AFE별 집행률 상세',
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		bodyProgressRemove()
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
    
    function setEventListener() {
    	//조회
    	$('#btnSearchPopList').on('click', function(e) {
    		searchList();
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
    			//searchList();
    		}
    		
        });
        
        //AFE 차수 변경 이벤트
        $('#scAfeDemdDgr').on('change',function(e) {
        	//수정 내역이 있으면 저장여부 확인
    		var modifyList =  AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet",  [{ _state : {edited : true}}, {_state : {added:true}}, {_state:{added:false, deleted:true}}] ));
			searchList();
        });
    	
        //엑셀
        $('#excelDown').click(function() {
        	bodyProgress();
        	excelDown();
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
    	if(flag == 'searchList') {
    		hideProgress(gridId);
    		
    		$( '#'+gridId).alopexGrid("sortClear"); 
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		
    		if(response!= null) {
        		$( '#'+gridId).alopexGrid("dataSet", response.list);
    		}
    	}
    	hideProgress(gridId);
    }
    
    //request 실패시.
    function failDemandDetailCallback(response, flag){
    	if(flag == 'searchList') {
    		hideProgress(gridId);
    		
    		//$( '#'+gridId).alopexGrid("sortClear");
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		alertBox('W', demandMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    	}
    	hideProgress(gridId);
    }
    
});