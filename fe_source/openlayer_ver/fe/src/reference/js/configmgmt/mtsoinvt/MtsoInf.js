/**
 * MtsoInf.js
 *
 * @author Administrator
 * @date 2020. 03. 03. 오전 17:30:03
 * @version 1.0
 */

var mtsoInf = $a.page(function() {

	var mtsoInfDataGridId = 'mtsoInfDataGrid';
	var paramData = null;

	var step2Cd_0 	= [{value : 'T11001', text : '수도권'}];
	var step2Cd_1 	= [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var step2Cd_2 	= [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var step2Cd_3 	= [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];
	var step1Cd 	= [{value : 'T11000', text : '수도권'},{value : 'T12000', text : '동부'},{value : 'T13000', text : '서부'},{value : 'T14000', text : '중부'}];
	var step1To2 	= {'T11000' : step2Cd_0, 'T12000': step2Cd_1, 'T13000' : step2Cd_2, 'T14000' : step2Cd_3};

	var grUsgTypCd	= [];
	var grLaraCd	= [];
	var grDntnYn	= [];
	var grNewYnCd	= [];

	var mtsoInfScrollOffset = null;

    this.init = function(id, param) {
    	mtosInfSetSelectCode();
    	//mtosInfInitGrid();
    	mtosInfSetEventListener();

    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function mtosInfSetSelectCode() {
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/MTSOUSG', null, 'GET', 'mtsoUsgList');	// 층 용도
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/DNTNYN', null, 'GET', 'dntnYnList');	// 도심/외곽여부
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/LARACD', null, 'GET', 'laraCdList');	// 권역 구분
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/NEWYNCD', null, 'GET', 'newYnList');	// 신규/기존여부

    }


    this.mtosInfInitGrid = function() {
    	AlopexGrid.setup({
			renderMapping : {
				'grUsgTypCds' : {
					renderer:function(value, data, render, mapping, grid) {
						if(data.repMtsoYn == 'N') {
							var strSelectOption = '';
							if (value.length > 0) {
								var usgTypCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');
							} else {
								var usgTypCd = '';
							}

							for(var i=0; i < grUsgTypCd.length; i++) {
								var exist = '';
								if (usgTypCd != undefined && usgTypCd != null && usgTypCd != ""){
									for(j=0; j < usgTypCd.length; j++) {
										if (grUsgTypCd[i].value.toString() == usgTypCd[j].toString()) {
											exist = ' Selected="Selected" ';
										}
									}
								}
								strSelectOption += '<option value='+grUsgTypCd[i].value+' '+exist+'> '+grUsgTypCd[i].text+' </option>';
							}
							return '<select class="Multiselect" multiple="multiple">' + strSelectOption + '</select>';
						} else {
							var strText = '';
							if (value != undefined && value != null && value != ""){
								var usgTypCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

								for(i=0; i < usgTypCd.length; i++) {
									for(var j=0; j < grUsgTypCd.length; j++) {
										if (usgTypCd[i].toString() == grUsgTypCd[j].value.toString()) {
											strText += grUsgTypCd[j].text + ',';
										}
									}
								}
							}
							strText = strText.substr(0,strText.length-1);

							if (strText == undefined) {strText = "";}
							strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="'+strText+'"/></div>';
						}
					},
					editedValue : function(cell, data, render, mapping, grid) {
						if(data.repMtsoYn != 'Y') {
							var objVal = $(cell).find('select').val();
							var dataObj = $('#'+mtsoInfDataGridId).alopexGrid('dataGet',{repMtsoId:data.repMtsoId, repMtsoYn : 'N'});
							for(var i in dataObj) {
								if (data.mtsoId != dataObj[i].mtsoId && dataObj[i].usgTypCd != undefined  && dataObj[i].usgTypCd != null) {
									objVal += dataObj[i].usgTypCd;
								}
							}
							$('#'+mtsoInfDataGridId).alopexGrid('dataEdit',{usgTypCd:objVal},{repMtsoId:data.repMtsoId, repMtsoYn : 'Y'});
						}
						if(data.repMtsoYn != 'Y') {
							return $(cell).find('select').val();
						} else {
							return data.usgTypCd;
						}


					},
					postRender : function(cell, value, data, render, mapping, grid) {
						if(data.repMtsoYn != 'Y') {
							var $multiSelect = $(cell).find('.Multiselect');
							$multiSelect.convert();
							if (grid.$root.alopexGrid('readOption').cellInlineEdit) {
								$multiSelect.open();
							}
						}
					}
				}
			}
		});


    	var headerMappingN =  [
			 {fromIndex:4, toIndex:12, title:"기본정보"},
			 {fromIndex:13, toIndex:23, title:"위치정보"},
			 {fromIndex:24, toIndex:33, title:"기타항목"}
    		];

        //그리드 생성
        $('#'+mtsoInfDataGridId).alopexGrid({
        	paging : {
				pagerSelect: [2000,5000]
				,hidePageList: true  // pager 중앙 삭제
				,pagerSelect: false
			},
			defaultColumnMapping:{
    			sorting : true
    		},
    		fullCompareForEditedState: true,
			autoColumnIndex: true,
			rowInlineEdit: true,
			autoResize: true,
			filteringHeader: true,
			filter: {
				title: true,
				movable: true,
				saveFilterSize: true,
				sorting: true,
				dataFilterInstant: true,
				dataFilterSearch: true,
				closeFilter: {
					applyButton: true,
					removeButton: true
				},
				filterByEnter: true,
				typeListDefault : {
					selectValue : 'contain',
					expandSelectValue : 'contain'
				},
				focus: 'searchInput'
			},

			columnFixUpto : 'floorNm',
			headerGroup : headerMappingN,
    		columnMapping: [

				{ key : 'demdHdofcCd', align:'center', title : '본부', width: '90', styleclass : 'font-blue', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(step1Cd);
								return render_data;
							} else {
								data.demdHdofcCd = '';
							}
						}
					},
					allowEdit : function(value, data, mapping) { if(data.repMtsoYn == 'Y') { return true; } else { return false; }},
					editable : {type : 'select',
						rule : function(value, data) {
							var editing_data = []; //{value:'', text:'선택'}
							editing_data = editing_data.concat(step1Cd);
							return editing_data;
						}
					},
					editedValue : function (cell) {
						return $(cell).find('select option').filter(':selected').val();
					}},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '90', styleclass : 'font-blue', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								var currentData = AlopexGrid.currentData(data);
								if (step1To2[currentData.demdHdofcCd]) {
									render_data = render_data.concat(step1To2[currentData.demdHdofcCd]);
								}
								return render_data;
							} else {
								data.demdAreaCd = '';
							}
						}
					},
					allowEdit : function(value, data, mapping) {if(data.repMtsoYn == 'Y') { return true; } else { return false; } },
					editable : {type : 'select',
						rule : function(value, data) {
							var editing_data = []; //{value:'', text:'선택'}
							var currentData = AlopexGrid.currentData(data);

							if (step1To2[currentData.demdHdofcCd]) {
								editing_data = editing_data.concat(step1To2[currentData.demdHdofcCd]);
							}
							return editing_data;
						}
					},
					editedValue : function (cell) {
						return $(cell).find('select option').filter(':selected').val();
					},
				refreshBy : ['demdHdofcCd'] },
				{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return value;
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<label class="textsearch_1"><input type="text" readonly style="'+strCss+'" value="'+value+'" /><span id="btnMtsoPopup" class="Button search"></span></label>' ;
						} else {
							return '';
						}
					}
				},
				{ key : 'floorNm', align:'center', title : '층명', width: '150px',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'N') {
							return value;
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'N') {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:left;';
							return '<label class="textsearch_1"><input type="text" readonly style="'+strCss+'" value="'+value+'" /><span id="btnMtsoPopup" class="Button search"></span></label>' ;
						} else {
							return '';
						}
					}
				},
				{ key : 'newExstDivCd', align:'center', title : '신규/기존', width: '100px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grNewYnCd);
								return render_data;
							} else {
								data.newExstDivCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grNewYnCd) {
								var exist = '';

								if (value && value.indexOf(grNewYnCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grNewYnCd[i].value+' '+exist+'>'+grNewYnCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'bldFlorNo', align:'center', title : '층 정보', width: '100px' },



    			{ key : 'usgTypCd', align:'center', title : '층용도', width: '200px', styleclass : 'font-orange', filter : {useRenderToFilter : true},
					render : function(value, data, render, mapping){
						var strText = '';
						if (value != undefined && value != null && value != ""){
							var usgTypCd = value.toString().replace(/,/gi, '').replace(/undefined/gi, '');

							var names = [];
							var uniqueNames = [];
							for(i=0; i < usgTypCd.length; i++) {
								names.push(usgTypCd[i]);
							}
							$.each(names, function(i, el){
								if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
							})
							for(i=0; i < uniqueNames.length; i++) {
								for(var j=0; j < grUsgTypCd.length; j++) {
									if (uniqueNames[i].toString() == grUsgTypCd[j].value.toString()) {
										strText += grUsgTypCd[j].text + ',';
									}
								}
							}
						}
						strText = strText.substr(0,strText.length-1);
						return strText;
					},
					editable : {type : 'grUsgTypCds'}
				},
				{ key : 'mtsoTyp', align:'center', title : '국사유형', width: '110px', filter : {useRenderToFilter : true} },
				{ key : 'bldCd', align:'center', title : '건물코드', width: '110px', filter : {useRenderToFilter : true} },
				{ key : 'siteCd', align:'center', title : '사이트키', width: '85px'},
				{ key : 'mtsoId', align:'center', title : '국사ID', width: '115px' },
				{ key : 'repIntgFcltsCd', align:'center', title : '공대코드', width: '90px' },
				{ key : 'bldAddr', align:'left', title : '주소', width: '350px' },
				{ key : 'sidoNm', align:'center', title : '시도', width: '90px' },
				{ key : 'sggNm', align:'center', title : '시군구', width: '100px' },
				{ key : 'emdNm', align:'center', title : '읍면동', width: '80px' },
				{ key : 'riNm', align:'center', title : '리', width: '80px' },
				{ key : 'addrBunjiVal', align:'center', title : '번지', width: '60px' },
				{ key : 'bldNm', align:'center', title : '건물명', width: '150px' },
				{ key : 'dongFloor', align:'center', title : '동/층', width: '100px' },
				{ key : 'laraCd', align:'center', title : '권역', width: '100px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grLaraCd);
								return render_data;
							} else {
								data.laraCd = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grLaraCd) {
								var exist = '';

								if (value && value.indexOf(grLaraCd[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grLaraCd[i].value+' '+exist+'>'+grLaraCd[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
						}
					}
				},
				{ key : 'dntnYn', align:'center', title : '도심/외곽', width: '80px', filter : {useRenderToFilter : true},
					render : {type : 'string',
						rule : function(value, data) {
							if(data.repMtsoYn == 'Y') {
								var render_data = [{ value : ''}];
								render_data = render_data.concat(grDntnYn);
								return render_data;
							} else {
								data.dntnYn = '';
							}
						}
					},
					editable : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var strSelectOption = '<option value="" >선택</option>';
							for(var i in grDntnYn) {
								var exist = '';

								if (value && value.indexOf(grDntnYn[i].value) != -1) {
									exist = ' selected';
								}
								strSelectOption += '<option value='+grDntnYn[i].value+' '+exist+'>'+grDntnYn[i].text+'</option>';
							}
							return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
						} else {
							var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
							return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
						}

					}
				},
				{ key : 'mtsoLatValT', align:'center', title : '위도', width: '110px' },
				{ key : 'mtsoLngValT', align:'center', title : '경도', width: '110px' },

				{ key : 'dsnEtcColVal1', align:'center', title : '기타1', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal2', align:'center', title : '기타2', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal3', align:'center', title : '기타3', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal4', align:'center', title : '기타4', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal5', align:'center', title : '기타5', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal6', align:'center', title : '기타6', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal7', align:'center', title : '기타7', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal8', align:'center', title : '기타8', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal9', align:'center', title : '기타9', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'dsnEtcColVal10', align:'center', title : '기타10', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				},
				{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', hidden : true },
				{ key : 'repMtsoId', align:'center', title : '상위국사ID', hidden : true },
				{ key : 'repMtsoYn', align:'center', title : '상위국사여부', hidden : true }


    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        mtsoInfHideCol();

    };

    function mtsoInfHideCol() {
    	for(var i = 0; i < publicMtsoInfHideCol.length; i++){
			if (publicMtsoInfHideCol[i].mtsoInvtItmHidYn == 'N') {
				$('#'+mtsoInfDataGridId).alopexGrid('updateColumn', {title : publicMtsoInfHideCol[i].mtsoInvtItmNm}, publicMtsoInfHideCol[i].mtsoInvtItmVal);
			} else {
				$('#'+mtsoInfDataGridId).alopexGrid('updateColumn', {hidden : true}, publicMtsoInfHideCol[i].mtsoInvtItmVal);
			}
		}
    }

    function mtosInfSetEventListener() {
    	$('#'+mtsoInfDataGridId).on('rowInlineEditEnd',function(e){
    		var param = AlopexGrid.parseEvent(e).data;
			var userId = $("#userId").val();
			param.userId = userId;

			if (param.usgTypCd != null) {
				var usgTypCd = param.usgTypCd.toString().replace(/,/gi, '').replace(/undefined/gi, '').replace(/0/gi, '');
			} else {
				var usgTypCd = "";
			}

			// return 값은 필요 없음.
			if (usgTypCd == null || usgTypCd == undefined || usgTypCd == "") {
				$('#'+mtsoInfDataGridId).alopexGrid('dataFlush', function(editedDataList){
					var result = $.map(editedDataList, function(el, idx){ return el.mtsoInvtId;})
					if (result.length > 0) {
						httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeMtsoInvtDsnInf', param, 'POST', '');
					}
				});
			} else {
				if (param.repMtsoYn == 'N' && usgTypCd.length > 4) {
					callMsgBox('','W', "저장되지 않았습니다.<br><br>층 용도 항목이 너무 많습니다.(최대 4개 선택 가능)", function(msgId, msgRst){});
				} else {
					if (param.repMtsoYn == 'N') {
						param.usgTypCd = usgTypCd;
					} else {
						param.usgTypCd = '';
					}
					$('#'+mtsoInfDataGridId).alopexGrid('dataFlush', function(editedDataList){
						var result = $.map(editedDataList, function(el, idx){ return el.mtsoInvtId;})
						if (result.length > 0) {
							httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeMtsoInvtDsnInf', param, 'POST', '');
							param.usgTypCd = usgTypCd;
						}
					 });

				}
			}

        });

    	$(document).on('click', "[id='btnMtsoPopup']", function(e){
			var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;
      	 	var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
        	var paramData = {mtsoEqpGubun :'mtso', mtsoEqpId : dataObj.mtsoId, parentWinYn : 'Y'};
    		var popMtsoEqp = $a.popup({
    			popid: tmpPopId,
    			title: '통합 국사/장비 정보',
    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
    			data: paramData,
    			iframe: false,
    			modal: false,
    			movable:false,
    			windowpopup: true,
    			width : 900,
    			height : window.innerHeight,
    			callback : function(data) {
    				var pageNo			= 1;
					var rowPerPage		= 100000;
					mtsoInf.setGrid(pageNo,rowPerPage);
  				}
    		});
		});


    	$('#btnMtsoRegPop').on('click', function(e) {
			var param = {regYn : 'Y'};
			$a.popup({
			  	popid: 'MtsoReg',
			  	title: '국사 등록',
			      url: '/tango-transmission-web/configmgmt/mtsoinvt/MtsoRegPop.do',
			      data: param,
			      windowpopup : true,
			      modal: true,
			      movable:true,
			      width : 965,
			      height : 400,
			      callback : function(data) {
			    	var pageNo			= 1;
					var rowPerPage		= 100000;
					mtsoInf.setGrid(pageNo,rowPerPage);
  				  }
			  });
		});

    	$('#btnS_mtsoRegPop').on('click', function(e) {
			var selectData = $('#'+mtsoInfDataGridId).alopexGrid('dataGet', {_state: {selected: true}})[0];
			if (selectData == null || selectData == undefined) {
				callMsgBox('','W', '국사를 선택하여 주시기 바랍니다.' , function(msgId, msgRst){});
			} else if (selectData.repMtsoYn == 'N') {
				callMsgBox('','W', '상위 국사를 선택하여 주시기 바랍니다.' , function(msgId, msgRst){});
			} else {
				var param = {repMtsoId : selectData.repMtsoId, repMtsoNm : selectData.mtsoNm};
				$a.popup({
				  	popid: 'NewSmtsoReg',
				  	title: '층  등록',
				      url: '/tango-transmission-web/configmgmt/mtsoinvt/SmtsoRegPop.do',
				      data: param,
				      windowpopup : true,
				      modal: true,
				      movable:true,
				      width : 965,
				      height : 650,
				      callback : function(data) {
				    	 var pageNo			= 1;
						var rowPerPage		= 100000;
						mtsoInf.setGrid(pageNo,rowPerPage);
	  				  }
			  });
			}
		});

    	$('#btnMtosDel').on('click', function(e) {
			var selectData = $('#'+mtsoInfDataGridId).alopexGrid('dataGet', {_state: {selected: true}})[0];
			if(selectData == undefined) {
				callMsgBox('','W', '국사를 선택하여 주시기 바랍니다.' , function(msgId, msgRst){});
			} else {
				if (selectData.repMtsoYn == 'Y') {
					var dataObj = $('#'+mtsoInfDataGridId).alopexGrid('dataGet',{repMtsoId : selectData.repMtsoId, repMtsoYn : 'N'});
					if (dataObj.length > 0) {
						callMsgBox('','W', '층 정보가 존재합니다. 층 정보를 먼저 삭제하시기 바랍니다.' , function(msgId, msgRst){});
					} else {
						var userId = $("#userId").val();
						var data = {mtsoInvtId : selectData.mtsoInvtId, userId : userId};
						callMsgBox('','C', "국사 정보를 삭제 하시겠습니까?", function(msgId, msgRst){
			 		        if (msgRst == 'Y') {
			 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMtsoUseYn', data, 'POST', 'mtsoUseYn');
			 		        }
					     });
					}
				} else {
					var userId = $("#userId").val();
					var data = {mtsoInvtId : selectData.mtsoInvtId, userId : userId};
					callMsgBox('','C', "층 정보를 삭제 하시겠습니까?", function(msgId, msgRst){
		 		        if (msgRst == 'Y') {
		 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMtsoUseYn', data, 'POST', 'mtsoUseYn');
		 		        }
				     });
				}
			}
		});

    	 $('#btnMtosInfExportExcel').on('click', function(e) {

    		//필터링 체크 여부
    		 var filtered = false;
    		 if (document.getElementsByClassName('alopexgrid-filter-dropdownbutton filtered').length > 0) {
    			 filtered = true;
    		 }

    		 var dt = new Date();
 			var recentY = dt.getFullYear();
 			var recentM = dt.getMonth() + 1;
 			var recentD = dt.getDate();

 			if(recentM < 10) recentM = "0" + recentM;
 			if(recentD < 10) recentD = "0" + recentD;

 			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

 			var worker = new ExcelWorker({
 				excelFileName : '국사투자기본정보_'+recentYMD,
 				sheetList : [{
 					sheetName : '기본정보',
 					$grid : $("#"+mtsoInfDataGridId)
 				}]
 			});
 			worker.export({
 				merge : true,
 				useCSSParser : true,
 				useGridColumnWidth : true,
// 				exportNumberingColumn : true,
 				border : true,
 				filtered : filtered,
 				callback : {
 					preCallback : function(gridList){
 						for(var i=0; i < gridList.length; i++) {
 							if(i == 0  || i == gridList.length -1)
 								gridList[i].alopexGrid('showProgress');
 						}
 					},
 					postCallback : function(gridList) {
 						for(var i=0; i< gridList.length; i++) {
 							gridList[i].alopexGrid('hideProgress');
 						}
 					}
 				}
 			});

         });

    };



	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	// 층 용도
    	if(flag == 'mtsoUsgList'){
    		grUsgTypCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grUsgTypCd.push(resObj);
			}
    	}
    	// 도심/외곽여부
    	if(flag == 'dntnYnList'){
    		grDntnYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grDntnYn.push(resObj);
			}
    	}
    	// 권역 구분
    	if(flag == 'laraCdList'){
    		grLaraCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grLaraCd.push(resObj);
			}
    	}

    	if(flag == 'newYnList'){
    		grNewYnCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grNewYnCd.push(resObj);
			}
    	}




    	if(flag == 'search'){
    		$('#'+mtsoInfDataGridId).alopexGrid('hideProgress');
    		setSPGrid(mtsoInfDataGridId, response, response.mtsoInvtDsnList);
    	}

    	if(flag == 'mtsoUseYn'){
    		var pageNo			= 1;
			var rowPerPage		= 100000;
			mtsoInf.setGrid(pageNo,rowPerPage);
    	}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	       	// 스크롤 유지시 컬럼 고정이 있는 경우 위치 이동이 안되 컬럼 고정 풀고 스크롤 위치 이동후 다시 고정 설정
	       	$('#'+GridID).alopexGrid('columnUnfix');
	       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : mtsoInfScrollOffset.column}});
	       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});

	}

    this.setGrid = function(page, rowPerPage){ // this 쓰면 permission denied 되서 함수 접근못함.[20171121]

    	mtsoInfScrollOffset = $('#'+mtsoInfDataGridId).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

        	$('#mtsoInfPageNo').val(page);
        	$('#mtsoInfRowPerPage').val(rowPerPage);

        	var param =  $("#searchForm").getData();
        	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
        	if(ckGubun){
        		param.repMtsoYn = "Y";
	       	} else {
	       		param.repMtsoYn = "";
	       	}

        	var subParam =  $("#mtsoInfForm").getData();
        	var page = $('#mtsoInfPageNo').val();
        	var rowPerPage = $('#mtsoInfRowPerPage').val();
        	param.pageNo = page;
        	param.rowPerPage = rowPerPage;
    		$('#'+mtsoInfDataGridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMtsoInvtDsnList', param, 'GET', 'search');
        }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9
              });
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