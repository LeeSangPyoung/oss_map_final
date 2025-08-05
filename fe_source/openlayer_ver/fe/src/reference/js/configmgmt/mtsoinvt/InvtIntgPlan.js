/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var InvtIntgPlan = $a.page(function() {

	var invtIntgGridId = 'invtIntgDataGrid';
	var paramData = null;

	var nbdG5AcptDivCd		= [];
	var nbdUpsdShtgRsn		= [];
	var nbdUpsdRmdyDivCd		= [];
	var areaInvtYr		= [];
	var hdqtrInvtYr		= [];
	var closMtsoYn		= [];

	var invtIntgScrollOffset = null;

    this.init = function(id, param) {
    	invtIntgSetSelectCode();
    	//invtIntgInitGrid();
    	invtIntgSetEventListener();
    };


	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function invtIntgSetSelectCode() {

    	// 5G수용계획
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/G5ACPTCD', null, 'GET', 'nbdG5AcptDivList');
		 // 상면부족사유
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/UPSDRSN', null, 'GET', 'nbdUpsdShtgRsnList');
		 // 상면부족해소방안
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/RMDYCD', null, 'GET', 'nbdUpsdRmdyDivList');
//		 //폐국대상여부
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/CLOSYN', null, 'GET', 'closMtsoYnList');

		 var d = new Date();
		 var year = d.getFullYear();
			for(i = year - 50; i < year + 6; i++) {
				var yearObj = {value : i, text : i};
				areaInvtYr.push(yearObj);
				hdqtrInvtYr.push(yearObj);
			}
    }

    this.invtIntgGridCol = function() {
    	var colList = [];

    	colList =  [
			{ key : 'mtsoId', align:'center', title : '국사ID', width: '100px' },		// 숨김
			{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '100px' },		// 숨김
			{ key : 'demdHdofcCd', align:'center', title : '본부', width: '90',
				render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return data.demdHdofcCd ;
						} else {
							return '';
						}
				}
			},
			{ key : 'demdAreaCd', align:'center', title : '지역', width: '90',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						return data.demdAreaCd ;
					} else {
						return '';
					}
			}
			},
			{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '50px' },		// 숨김
			{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '50px' },		// 숨김
			{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						return data.mtsoNm ;
					} else {
						return '';
					}
				}
			},
			{ key : 'floorNm', align:'center', title : '층명', width: '150px',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						return '';
					} else {
						return data.floorNm ;
					}
				}
			},
			{ key : 'nbdG5AcptDivCd', align:'center', title : '5G수용계획', width: '120px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(nbdG5AcptDivCd);
							return render_data;
						} else {
							data.nbdG5AcptDivCd = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in nbdG5AcptDivCd) {
							var exist = '';
							if (value && value.indexOf(nbdG5AcptDivCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+nbdG5AcptDivCd[i].value+' '+exist+'>'+nbdG5AcptDivCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'nbdG5AcptRsn', align:'left', title : '5G 임시수용사유 및 향후계획', width: '250px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.nbdG5AcptRsn = '';
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'nbdUpsdShtgRsn', align:'center', title : '상면부족사유', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(nbdUpsdShtgRsn);
							return render_data;
						} else {
							data.nbdUpsdShtgRsn = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in nbdUpsdShtgRsn) {
							var exist = '';
							if (value && value.indexOf(nbdUpsdShtgRsn[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+nbdUpsdShtgRsn[i].value+' '+exist+'>'+nbdUpsdShtgRsn[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'nbdUpsdRmdyDivCd', align:'center', title : '상면부족해소방안', width: '120px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(nbdUpsdRmdyDivCd);
							return render_data;
						} else {
							data.nbdUpsdRmdyDivCd = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in nbdUpsdRmdyDivCd) {
							var exist = '';
							if (value && value.indexOf(nbdUpsdRmdyDivCd[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+nbdUpsdRmdyDivCd[i].value+' '+exist+'>'+nbdUpsdRmdyDivCd[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'areaInvtYr', align:'center', title : '투자시기(지역)', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(areaInvtYr);
							return render_data;
						} else {
							data.areaInvtYr = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in areaInvtYr) {
							var exist = '';
							if (value && value.indexOf(areaInvtYr[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+areaInvtYr[i].value+' '+exist+'>'+areaInvtYr[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'hdqtrInvtYr', align:'center', title : '투자시기(본사)', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(hdqtrInvtYr);
							return render_data;
						} else {
							data.hdqtrInvtYr = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in hdqtrInvtYr) {
							var exist = '';
							if (value && value.indexOf(hdqtrInvtYr[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+hdqtrInvtYr[i].value+' '+exist+'>'+hdqtrInvtYr[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'newMtsoNm', align:'center', title : '신규통합국명', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.newMtsoNm = '';
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'exstMtsoNm', align:'center', title : '기존통합국명', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.exstMtsoNm = '';
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'closMtsoYn', align:'center', title : '폐국대상여부', width: '100px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							var render_data = [{ value : ''}];
							render_data = render_data.concat(closMtsoYn);
							return render_data;
						} else {
							data.closMtsoYn = '';
						}
					}
				},
				editable : function(value, data) {
					if(data.repMtsoYn == 'Y') {
						var strSelectOption = '<option value="" >선택</option>';
						for(var i in closMtsoYn) {
							var exist = '';
							if (value && value.indexOf(closMtsoYn[i].value) != -1) {
								exist = ' selected';
							}
							strSelectOption += '<option value='+closMtsoYn[i].value+' '+exist+'>'+closMtsoYn[i].text+'</option>';
						}
						return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
					} else {
						var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'diffMtsoNm', align:'center', title : '이설국사명', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						} else {
							data.diffMtsoNm = '';
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'mtsoDiffCost', align:'center', title : '이설비용(백만원)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						if (data.mtsoDiffCost == undefined || data.mtsoDiffCost == null || data.mtsoDiffCost == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'mtsoLesCost', align:'center', title : '현임차료(백만원/월)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					if(data.repMtsoYn == 'Y') {
						var tmpCnt = value;
						if(!isNaN(tmpCnt)) {
							return comMain.setComma(tmpCnt);
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					if(data.repMtsoYn == 'Y') {
						if (data.mtsoLesCost == undefined || data.mtsoLesCost == null || data.mtsoLesCost == ""){strVal = '';}
						return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'diffScdleVal', align:'center', title : '이설시기', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'invtIntgRmk', align:'left', title : '비고', width: '100px',
				render : {type : 'string',
					rule : function(value, data) {
						if(data.repMtsoYn == 'Y') {
							return value;
						}
					}
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					if(data.repMtsoYn == 'Y') {
						return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
					} else {
						strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
						return '<div><input type="text" readonly style="'+strCss+'" value="" "/></div>';
					}
				}
			},
			{ key : 'intgEtcColVal1', align:'center', title : '기타1', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal2', align:'center', title : '기타2', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal3', align:'center', title : '기타3', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal4', align:'center', title : '기타4', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal5', align:'center', title : '기타5', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal6', align:'center', title : '기타6', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal7', align:'center', title : '기타7', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal8', align:'center', title : '기타8', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal9', align:'center', title : '기타9', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			},
			{ key : 'intgEtcColVal10', align:'center', title : '기타10', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		];

    	return colList
    }

    this.invtIntgInitGrid = function() {
    	$('#'+invtIntgGridId).alopexGrid('dataEmpty');
    	var headerMappingN =  [
			 {fromIndex:8, toIndex:21, title:"국사 신규 및 통폐합", id: "Top"} // 최상단 그룹

			 ,{fromIndex:8, toIndex:13, title:"국사 신축 검토"}
    		,{fromIndex:14, toIndex:15, title:"신규/기존 국사명"}
    		,{fromIndex:16, toIndex:21, title:"국사 통폐합"}
    		,{fromIndex:22, toIndex:31, title:"기타항목", id: "Top"}
    		];

        //그리드 생성
        $('#'+invtIntgGridId).alopexGrid({
        	parger : true,
        	paging : {
				pagerSelect: false,
				pagerTotal : true
				,hidePageList: true  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			fullCompareForEditedState: true,
			defaultColumnMapping:{
    			sorting : true
    		},
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
				typeListDefault : {
					selectValue : 'contain',
					expandSelectValue : 'contain'
				},
				filterByEnter: true,
				focus: 'searchInput'
			},

			columnFixUpto : 'floorNm',
			headerGroup : headerMappingN,
    		columnMapping: InvtIntgPlan.invtIntgGridCol(),

//    		data:data,

			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['mtsoInvtId', 'mtsoId', 'repMtsoId', 'repMtsoYn'];

    	$('#'+invtIntgGridId).alopexGrid("hideCol", hideColList, 'conceal');

    	for(var i = 0; i < publicIntgHideCol.length; i++){
			if (publicIntgHideCol[i].mtsoInvtItmHidYn == 'N') {
				$('#'+invtIntgGridId).alopexGrid('updateColumn', {title : publicIntgHideCol[i].mtsoInvtItmNm}, publicIntgHideCol[i].mtsoInvtItmVal);
			} else {
				$('#'+invtIntgGridId).alopexGrid('updateColumn', {hidden : true}, publicIntgHideCol[i].mtsoInvtItmVal);
			}
		}

	}


    function invtIntgSetEventListener() {

    	$('#'+invtIntgGridId).on('rowInlineEditEnd',function(e){
    		var param = AlopexGrid.parseEvent(e).data;

			console.log(param);

			var userId;
			 if($("#userId").val() == ""){
				 userId = "SYSTEM";
			 }else{
				 userId = $("#userId").val();
			 }

			 param.frstRegUserId = userId;
			 param.lastChgUserId = userId;

			 $('#'+invtIntgGridId).alopexGrid('dataFlush', function(editedDataList){

				 var result = $.map(editedDataList, function(el, idx){ return el.mtsoInvtId;})

				if (result.length > 0) {
					if (param.repMtsoYn == 'Y') {
						 httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/mergeInvtIntgPlan', param, 'POST', 'InvtIntgPlan');
					 }
				}
			 });
        });

    	$('#btnInvtIntgImportExcel').on('click', function(e) {
    		$a.popup({
    		  	popid: 'ExcelUpload',
    		  	title: 'Excel Upload',
    		      url: '/tango-transmission-web/configmgmt/mtsoinvt/InvtIntgPlanExcelUpload.do',
    		      windowpopup : true,
    		      modal: true,
    		      movable:true,
    		      width : window.innerWidth * 0.9,
    		      height : 750,
    		      callback : function(data) {
    		    	InvtIntgPlan.setGrid(1,100000);
    		      }
    		});
    	});

    	 $('#btnInvtIntgExportExcel').on('click', function(e) {
    		var userId 		= $('#userId').val();
    		var paramData 	= {downFlag : 'PLAN', userId : userId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setExcelDownLoadHis', paramData, 'POST', '');
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

 			$('#'+invtIntgGridId).alopexGrid("showCol", 'mtsoInvtId');
 			var worker = new ExcelWorker({
 				excelFileName : '통폐합계획_'+recentYMD,
 				sheetList : [{
 					sheetName : '통폐합계획',
 					$grid : $("#"+invtIntgGridId)
 				},{
 					sheetName : '항목별 코드표',
 					$grid : $("#codeTotalDataGrid")
 				}]
 			});
 			worker.export({
 				merge : true,
 				useCSSParser : true,
 				useGridColumnWidth : true,
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

 			$('#'+invtIntgGridId).alopexGrid("hideCol", 'mtsoInvtId', 'conceal');
         });

    };



	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	// 5G수용계획
    	if(flag == 'nbdG5AcptDivList'){

    		nbdG5AcptDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				nbdG5AcptDivCd.push(resObj);
			}
    	}

    	// 상면부족사유
    	if(flag == 'nbdUpsdShtgRsnList'){

    		nbdUpsdShtgRsn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				nbdUpsdShtgRsn.push(resObj);
			}
    	}

    	// 상면부족해소방안
    	if(flag == 'nbdUpsdRmdyDivList'){

    		nbdUpsdRmdyDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				nbdUpsdRmdyDivCd.push(resObj);
			}
    	}

    	//폐국대상여부
    	if(flag == 'closMtsoYnList'){

    		closMtsoYn = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				closMtsoYn.push(resObj);
			}
    	}

    	if(flag == 'search'){

    		$('#'+invtIntgGridId).alopexGrid('hideProgress');

    		setSPGrid(invtIntgGridId, response, response.invtIntgPlanList);
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
	       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : invtIntgScrollOffset.column}});
	       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});
	}

    this.setGrid = function(page, rowPerPage) {

    	invtIntgScrollOffset = $('#'+invtIntgGridId).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#invtIntgPageNo').val(page);
    	$('#invtIntgRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	var subParam =  $("#invtIntgPageNo").getData();
    	var page = $('#invtIntgPageNo').val();
    	var rowPerPage = $('#invtIntgRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+invtIntgGridId).alopexGrid('showProgress')
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getInvtIntgPlanList', param, 'GET', 'search');

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