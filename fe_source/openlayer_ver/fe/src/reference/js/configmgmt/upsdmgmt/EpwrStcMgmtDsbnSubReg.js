/**
 * EpwrStcMgmtDsbnReg.js
 *
 * @author Administrator
 * @date 2018. 02. 06.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
	var mainGridId = 'mainDataGrid';
	var qrtGridId = 'qrtDataGrid';
	var userId = 'testUser';
	
	var arrStat = [{'value':'0','text':'장비선택'},{'value':'1','text':'불필요'},{'value':'2','text':'미설치'}];
	
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param
    	initGrid();
    	setEventListener();
    };

function initGrid() {
	
	AlopexGrid.setup({
		renderMapping : {
			'cities' : {
				renderer:function(value, data, render, mapping, grid) {
					var str = ''
					for (var i in data.cities) {
						var exist = '';
						if (value && value.indexOf(data.cities[i]) != -1) {
							exist = ' selected="selected"';
						}
						str += '<option value="' + data.cities[i] + '"' + exist + '>' + data.cities[i] + '</option>';
					}
					return '<select class="Multiselect" multiple>' + str + '</select>';
				},
				editedValue : function(cell, data, render, mapping, grid) {
					return $(cell).find('select').val();
				},
				postRender : function(cell, value, data, render, mapping, grid) {
					// 렌더링후 실행하는 코드
					var $multiSelect = $(cell).find('.Multiselect');
					$multiSelect.convert();
					
					if (grid.$root.alopexGrid('readOption').cellInlineEdit) {
						// cellInlineEdit 모드이면 select 선택 모드로 변경함
						$multiSelect.open();
					}
				}
			}
		}
	});
  		
        //그리드 생성
        $('#'+mainGridId).alopexGrid({
        	pager : false,
        	height:"5row",
        	rowInlineEdit: true,
    		cellInlineEdit: true,
    		autoColumnIndex: true,
    		cellSelectable : false,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		rowSelectOption: {
    			clickSelect: false
    		},
    		defaultState: {
    			dataAdd: {editing: true},
    			dataSet: {editing: true}
    		},
    		headerGroup: [
    		              {fromIndex:5, toIndex:6, title:"TVSS(SPD)"},
    		              {fromIndex:7, toIndex:8, title:"발전 단자함"},
    		              {hideSubTitle: true}
    		],
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {
				key : '', align:'center',
				title : '계량기함 번호',
				width: '100px'
			}, {
				key : '', align:'center',
				title : '분전반 장비명',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : 'MCCB용량',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : '케이블굵기',
				width: '100px'
			}, {
				key : 'a',  align:'center',
				title : 'TVSS(SPD)',
				width: '100px',
				render : {
      	    		type : 'string',
      	    		rule : function(value, data) {
      	    			var render_data = [];
      	    				return render_data = render_data.concat(arrStat);
      	    		}
      	    	},
      	    	editable:{
      	    		type:"select",
      	    		rule : function(value, data){
      	    			return arrStat;
      	    		}, attr : {
			 				style : "width: 100%;min-width:85px;padding: 2px 2px;"
			 			}
      	    	},
  				editedValue : function(cell) {
  					return $(cell).find('select option').filter(':selected').val();
  				}
			}, {
				key : '',  align:'center',
				title : 'TVSS(SPD)',
				width: '150px'
			}, {
				key : '',  align:'center',
				title : '발전 단자함',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : '발전 단자함',
				width: '150px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        $('#'+qrtGridId).alopexGrid({
        	pager : false,
        	height:"5row",
        	rowClickSelect: true,
    		rowSingleSelect: false,
    		autoColumnIndex: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		headerGroup: [
    		              {fromIndex:4, toIndex:5, title:"TVSS(SPD)"},
    		              {fromIndex:6, toIndex:7, title:"발전 단자함"},
    		              {hideSubTitle: true}
    		],
			columnMapping: [{
				align:'center',
				title : 'No',
				width: '40px',
				numberingColumn: true
			}, {
				key : '', align:'center',
				title : '분전반 장비명',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : 'MCCB용량',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : '케이블굵기',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : 'TVSS(SPD)',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : 'TVSS(SPD)',
				width: '150px'
			}, {
				key : '',  align:'center',
				title : '발전 단자함',
				width: '100px'
			}, {
				key : '',  align:'center',
				title : '발전 단자함',
				width: '150px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
  		
    };

    function setData(param) {
    	$('#EpwrStcMgmtDsbnRegForm').setData(param)

    }

    function setEventListener() {
    	//취소
    	 $('#btnCncl').on('click', function(e) {
    		 $a.close();
         });

    	//저장
    	 $('#btnDsbnReg').on('click', function(e) {
    		 $('#frstRegUserId').val(userId);
    		 $('#lastChgUserId').val(userId);
    		 if($('#mtsoNm').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사명'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 DsbnReg();
    			 }
    		 });
         });

    	 //수정
    	 $('#btnDsbnMod').on('click', function(e) {
    		 $('#lastChgUserId').val(userId);
    		  if($('#mtsoTypCd').val() == ''){
    			 callMsgBox('','I', makeArgConfigMsg('requiredOption','국사구분'), function(msgId, msgRst){});
    			 return;
    		 }
    		 //tango transmission biz 모듈을 호출하여야한다.
    		 callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			 //저장한다고 하였을 경우
    			 if (msgRst == 'Y') {
    				 DsbnReg();
    			 }
    		 });
    	 });

    	 $('#btnUpsdMtsoSearch').on('click',function(e) {
    		 $a.popup({
    			 popid: 'UpsdMtsoLkup',
    			 title: configMsgArray['findMtso'],
    			 url: '/tango-transmission-web/configmgmt/upsdmgmt/UpsdMtsoLkup.do',
    			 modal: true,
    			 movable:true,
    			 windowpopup: true,
    			 width : 850,
    			 height : 600,
    			 callback : function(data) { // 팝업창을 닫을 때 실행
    				 $('#mtsoId').val(data.mtsoId);
    				 $('#mtsoNm').val(data.sisulNm);
    				 $('#mtsoTypNm').val(data.affairNm);
    				 $('#mtsoTypCd').val(data.affairCd);
    				 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getFloorSearch', {sisulCd:data.sisulCd}, 'GET', 'florId');
    			 }
    		 });
    	 })
    	 
    	 $('#btnMainAdd').on('click', function(e) {
    		 var addData = {a:""};
    		 var data = $.extend({},addData);
    		 $('#'+mainGridId).alopexGrid('dataAdd', data, {_index:{row:0}});
         });
    };

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'dsbnReg'){
			if(response.Result == "Success"){
				//저장을 완료 하였습니다.
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					if (msgRst == 'Y') {
						$a.close();
					}
				});
			}
			var pageNo = $("#pageNo", opener.document).val();
			var rowPerPage = $("#rowPerPage", opener.document).val();
			$(opener.location).attr("href","javascript:dsbn.setGrid("+pageNo+","+rowPerPage+");");
		}

    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'dsbnReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function DsbnReg(){
    	var param = $('#EpwrStcMgmtDsbnRegForm').getData();
    	var avgVolt = (parseInt(param.mainCbplRsVoltVal) + parseInt(param.mainCbplStVoltVal) + parseInt(param.mainCbplTrVoltVal))/3;
    	var avgVcur = (parseInt(param.mainCbplRVcurVal) + parseInt(param.mainCbplSVcurVal) + parseInt(param.mainCbplTVcurVal))/3;
    	var maxVcur = Math.max.apply(null,[param.mainCbplRVcurVal, param.mainCbplSVcurVal, param.mainCbplTVcurVal]);
    	var minVcur = Math.min.apply(null,[param.mainCbplRVcurVal, param.mainCbplSVcurVal, param.mainCbplTVcurVal]);
    	var avgCbpl1Vcur = (parseInt(param.cbplARVcurVal) + parseInt(param.cbplASVcurVal) + parseInt(param.cbplATVcurVal))/3;
    	var maxCbpl1Vcur = Math.max.apply(null,[param.cbplARVcurVal, param.cbplASVcurVal, param.cbplATVcurVal]);
    	var minCbpl1Vcur = Math.min.apply(null,[param.cbplARVcurVal, param.cbplASVcurVal, param.cbplATVcurVal]);
    	var avgCbpl2Vcur = (parseInt(param.cbplBRVcurVal) + parseInt(param.cbplBSVcurVal) + parseInt(param.cbplBTVcurVal))/3;
    	var maxCbpl2Vcur = Math.max.apply(null,[param.cbplBRVcurVal, param.cbplBSVcurVal, param.cbplBTVcurVal]);
    	var minCbpl2Vcur = Math.min.apply(null,[param.cbplBRVcurVal, param.cbplBSVcurVal, param.cbplBTVcurVal]);

    	param.mainCbplEpwrVal = Math.round((avgVolt * avgVcur *1.1732)/1000);
    	param.ctrtEpwrRoadRate = Math.round(param.mainCbplEpwrVal/param.ctrtEpwrVal*100);
    	param.kepcoBldRoadRate = Math.round(maxVcur/param.kepcoBldMccbCapa*100);
    	if(param.kepcoBldCblTknsVal){
    		param.kepcoBldCblTknsLoadRate = Math.round(maxVcur/cblPermVcur(param.kepcoBldCblTknsVal)*100);
    	}
    	param.mainCbplLoadRate = Math.round(maxVcur/param.mainCbplMccbCapa);
    	param.mainCbplUbfVal = Math.round((maxVcur - minVcur)*100 /avgVcur);
    	if(param.mainCbplCblTknsVal){
    		param.mainCbplCblTknsLoadRate = Math.round(maxVcur/cblPermVcur(param.mainCbplCblTknsVal)*100);
    	}

    	param.cbplALoadRate = Math.round(maxCbpl1Vcur/param.cbplAMccbCapa*100);
    	param.cbplAUbfVal = Math.round((maxCbpl1Vcur - minCbpl1Vcur)*100 / avgCbpl1Vcur*100);
    	if(param.cbplACblTknsVal){
			param.cbplACblTknsLoadRate = Math.round(maxCbpl1Vcur / cblPermVcur(param.cbplACblTknsVal)*100);
		}
    	param.cbplBLoadRate = Math.round(maxCbpl2Vcur/param.cbplBMccbCapa*100);
    	param.cbplBUbfVal = Math.round((maxCbpl2Vcur - minCbpl2Vcur)*100 / avgCbpl2Vcur*100);
    	if(param.cbplBCblTknsVal){
    		param.cbplBCblTknsLoadRate = Math.round(maxCbpl2Vcur / cblPermVcur(param.cbplBCblTknsVal)*100);
    	}

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveDsbn', param, 'POST', 'dsbnReg');

    }

    function DsbnMod(){
    	var param = $('#EpwrStcMgmtDsbnRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveDsbn', param, 'POST', 'dsbnReg');
    }

    function DsbnDel(){
    	var param = $('#EpwrStcMgmtDsbnRegForm').getData();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/deleteDsbn', param, 'POST', 'dsbnDel');
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