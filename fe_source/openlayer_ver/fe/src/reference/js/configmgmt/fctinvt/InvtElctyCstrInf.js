/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var elctyCstrInf = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var elctyCstrInfDataGrid = 'elctyCstrInfDataGrid';
	var paramData = null;
	var gClsDivCd = 'N';

	var bldMgmtTypCd		= [];
	var landOwnDivCd		= [];
	var bldOwnDivCd		= [];
	var screLandYr		    = [];
	var screLandDivCd		= [];
	var screBldYr 			 =[];
	var grDistCd			 = [];
	var grMeansCd			 = [{value : '가공', text : '가공'}, {value : '지중', text : '지중'}];
	var elctyCstrInfScrollOffset = null;

    this.init = function(id, param) {
    	elctyCstrInfSetSelectCode();
    	elctyCstrInfSetEventListener();

    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function elctyCstrInfSetSelectCode() {
    	var param = {};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct8', param, 'GET', 'distCd');
    }


    this.elctyCstrInfGridCol = function() {
    	var colList = []

    	colList = [
    		{ key : 'fctInvtId', align:'center', title : '국사투자ID', width: '100px'  },		// 숨김
			{ key : 'afeYr', align:'center', title : 'AFE년도', width: '80px',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(tmp == undefined || tmp == null || tmp == '') {
						var afeYr = $('#afeYr').val();
						return afeYr;
					} else {
						return tmp;
					}
				}
			},				// 숨김
			{ key : 'afeDgr', align:'center', title : 'AFE차수', width: '80px',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(tmp == undefined || tmp == null || tmp == '') {
						var afeDgr = $('#afeDgr').val();
						return afeDgr;
					} else {
						return tmp;
					}
				}
			},			// 숨김
    		{ key : 'demdHdofcCd', align:'center', title : '본부', width: '60',
				render : function(value, data, render, mapping){
					return data.demdHdofcCd ;
				}
			},
			{ key : 'demdAreaCd', align:'center', title : '지역', width: '60',
				render : function(value, data, render, mapping){
					return data.demdAreaCd ;
				}
			},
			{ key : 'mtsoNm', align:'center', title : '국사명', width: '150px'},
			{ key : 'bldFlorNo', align:'center', title : '층', width: '60px', hidden:true},

			{ key : 'epwrCtrtVal', align:'center', title : '계약전력[KW](a)', width: '120px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'epwrLoadVal', align:'center', title : '부하전력[KW](b)', width: '120px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'epwrLoadRate', align:'center', title : '부하율(%)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},
			{ key : 'epwrIcreCommCnt', align:'center', title : '통신', width: '80px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'epwrIcreArcnCnt', align:'center', title : '냉방', width: '80px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'epwrIcreSumr', align:'center', title : '합계', width: '80px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},
			{ key : 'epwrOvstVal', align:'center', title : '과부족[KW]<br>(d=a-b-c)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},
			{ key : 'epwrChgCtrtVal', align:'center', title : '변경계약전력[KW]<br>(e=[a-d]/0.8)', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},
			{ key : 'epwrIcdcVal', align:'center', title : '증감전력[KW]<br>(f=[e-a])', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},

			{ key : 'cstrCtrtMeansCd', align:'center', title : '계약방식[가공/지중]', width: '150px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grMeansCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grMeansCd) {
						var exist = '';

						if (value && value.indexOf(grMeansCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grMeansCd[i].value+' '+exist+'>'+grMeansCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'cstrCtrtIcreCost', align:'center', title : '증설비[한전불입금]', width: '150px', headerStyleclass : 'headerBackGroundBlueB', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},
			{ key : 'cstrLinStrdVal', align:'center', title : '규격[mm2]', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grDistCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grDistCd) {
						var exist = '';

						if (value && value.indexOf(grDistCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grDistCd[i].value+' '+exist+'>'+grDistCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'cstrLinCblCnt', align:'center', title : 'LINE[상당 본수]', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrLinMeansCd', align:'center', title : '인입방식[가공/지중]', width: '150px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grMeansCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grMeansCd) {
						var exist = '';

						if (value && value.indexOf(grMeansCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grMeansCd[i].value+' '+exist+'>'+grMeansCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'cstrLinDistVal', align:'center', title : '거리[m]', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrLinCblVal', align:'center', title : '공사비', width: '100px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},

			{ key : 'cstrCbplGageCnt', align:'center', title : '계량기함', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrMainCbplCnt', align:'center', title : 'Main분전반', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrCrtfShftCost', align:'center', title : 'CT교체비', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrFlorCbplCnt', align:'center', title : '층별분전반', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrIncidFctVal', align:'center', title : '한전인입/통신/냉방/분전반[신설,대개체]', width: '250px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},

			{ key : 'cstrCbrkCapaVal', align:'center', title : '용량[AF]', width: '80px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrCbrkCnt', align:'center', title : '수량[ea]', width: '80px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrCbrkNwRepceVal', align:'center', title : '공사비', width: '100px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},

			{ key : 'cstrMlAStrdVal', align:'center', title : '케이블 A 규격[mm2]', width: '130px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grDistCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grDistCd) {
						var exist = '';

						if (value && value.indexOf(grDistCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grDistCd[i].value+' '+exist+'>'+grDistCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'cstrMlADistVal', align:'center', title : '케이블 A 거리[m]', width: '130px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrMlBStrdVal', align:'center', title : '케이블 B 규격[mm2]', width: '130px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grDistCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grDistCd) {
						var exist = '';

						if (value && value.indexOf(grDistCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grDistCd[i].value+' '+exist+'>'+grDistCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'cstrMlBDistVal', align:'center', title : '케이블 B 거리[m]', width: '130px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrEpwrCblVal', align:'center', title : '공사비', width: '100px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},
			{ key : 'cstrTmpAVal', align:'center', title : '공사내용', width: '100px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrTmpBVal', align:'center', title : '공사비', width: '100px', headerStyleclass : 'headerBackGroundBlueB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:center;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},

			{ key : 'cstrEtcCtt', align:'left', title : '공사 내용', width: '150px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					return tmp;
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrEtcCost', align:'center', title : '공사비', width: '100px', headerStyleclass : 'headerBackGroundBlueB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:right;';
					return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'cstrTotCost', align:'center', title : '공사비 [합계]', width: '150px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB',
				render : function(value, data, render, mapping){
					var tmp = value;
					if(!isNaN(tmp)) { return comMain.setComma(tmp); }
				}
			},
			{ key : 'loadExcsOccrCtt', align:'left', title : '부하율 100%초과 발생 내역', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} }, width: '250px',
				render : function(value, data, render, mapping){
					var tmp = value;
					return tmp;
				},
				editable : function(value, data) {
					var strVal = value;
					var strCss = 'width:100%;height:22px;text-align:left;';
					return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
				}
			},
			{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '50px', hidden:true   },		// 숨김
			{ key : 'mtsoId', align:'center', title : '국사ID', width: '100px', hidden:true  		 },		// 숨김
			{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '50px', hidden:true  }		// 숨김


			];

    	return colList;
    }

    this.elctyCstrInfGrid = function() {
    	var param =  $("#searchForm").getData();
    	$('#'+elctyCstrInfDataGrid).alopexGrid('dataEmpty');
    	var headerMappingN = [
					  			 {fromIndex:7, toIndex:15, title:"전력정보", id : "Top"} // 최상단 그룹
					   			 ,{fromIndex:10, toIndex:12, title:"증설[KW](c)"}
					   			 ,{fromIndex:16, toIndex:41, title:"공사비", id : "Top"}
					   			 ,{fromIndex:16, toIndex:17, title:"계약전력증설"}
					   			 ,{fromIndex:18, toIndex:22, title:"한전인입케이블"}
					   			 ,{fromIndex:23, toIndex:27, title:"한전인입/통신/냉방 분전반(ea)"}
					   			 ,{fromIndex:28, toIndex:30, title:"차단기[A]"}
					   			 ,{fromIndex:31, toIndex:35, title:"전력케이블"}
					   			 ,{fromIndex:36, toIndex:37, title:"임시공사"}
					   			 ,{fromIndex:38, toIndex:39, title:"기타공사"}
				   			 ];
        //그리드 생성
        $('#'+elctyCstrInfDataGrid).alopexGrid({
        	parger : true,
        	paging : {
				pagerSelect: false,
				pagerTotal : true
				,hidePageList: true  // pager 중앙 삭제
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
				typeListDefault : {
					selectValue : 'contain',
					expandSelectValue : 'contain'
				},
				filterByEnter: true,
				focus: 'searchInput'

			},

			columnFixUpto : 'bldFlorNo',
			headerGroup : headerMappingN,
    		columnMapping: elctyCstrInf.elctyCstrInfGridCol() ,
    		footer : {
    			position : 'buttom',
    			footerMapping : [
    				{columnIndex : 5, align : 'center', title : '합계'},
    				{columnIndex : 7, align : 'center', render : 'sum(epwrCtrtVal)'},
    				{columnIndex : 8, align : 'center', render : 'sum(epwrLoadVal)'},
    				{columnIndex : 9, align : 'center', render : 'sum(epwrLoadRate)'},

    				{columnIndex : 10, align : 'center', render : 'sum(epwrIcreCommCnt)'},
    				{columnIndex : 11, align : 'center', render : 'sum(epwrIcreArcnCnt)'},
    				{columnIndex : 12, align : 'center', render : 'sum(epwrIcreSumr)'},
    				{columnIndex : 13, align : 'center', render : 'sum(epwrOvstVal)'},

    				{columnIndex : 14, align : 'center', render : 'sum(epwrChgCtrtVal)'},
    				{columnIndex : 15, align : 'center', render : 'sum(epwrIcdcVal)'},


//    				{columnIndex : 16, align : 'center', render : 'sum(cstrCtrtMeansCd)'},
    				{columnIndex : 17, align : 'center', render : 'sum(cstrCtrtIcreCost)'},


    				{columnIndex : 18, align : 'center', render : 'sum(cstrLinStrdVal)'},

    				{columnIndex : 19, align : 'center', render : 'sum(cstrLinCblCnt)'},

//    				{columnIndex : 20, align : 'center', render : 'sum(cstrLinMeansCd)'},
    				{columnIndex : 21, align : 'center', render : 'sum(cstrLinDistVal)'},

    				{columnIndex : 22, align : 'center', render : 'sum(cstrLinCblVal)'},
    				{columnIndex : 23, align : 'center', render : 'sum(cstrCbplGageCnt)'},
    				{columnIndex : 24, align : 'center', render : 'sum(cstrMainCbplCnt)'},

    				{columnIndex : 25, align : 'center', render : 'sum(cstrCrtfShftCost)'},
    				{columnIndex : 26, align : 'center', render : 'sum(cstrFlorCbplCnt)'},
    				{columnIndex : 27, align : 'center', render : 'sum(cstrIncidFctVal)'},
    				{columnIndex : 28, align : 'center', render : 'sum(cstrCbrkCapaVal)'},
    				{columnIndex : 29, align : 'center', render : 'sum(cstrCbrkCnt)'},
    				{columnIndex : 30, align : 'center', render : 'sum(cstrCbrkNwRepceVal)'},
    				{columnIndex : 31, align : 'center', render : 'sum(cstrMlAStrdVal)'},
    				{columnIndex : 32, align : 'center', render : 'sum(cstrMlADistVal)'},
    				{columnIndex : 33, align : 'center', render : 'sum(cstrMlBStrdVal)'},


    				{columnIndex : 34, align : 'center', render : 'sum(cstrMlBDistVal)'},
    				{columnIndex : 35, align : 'center', render : 'sum(cstrEpwrCblVal)'},
//    				{columnIndex : 36, align : 'center', render : 'sum(cstrTmpAVal)'},
    				{columnIndex : 37, align : 'center', render : 'sum(cstrTmpBVal)'},
//    				{columnIndex : 38, align : 'center', render : 'sum(cstrEtcCtt)'},
    				{columnIndex : 39, align : 'center', render : 'sum(cstrEtcCost)'},
    				{columnIndex : 40, align : 'center', render : 'sum(cstrTotCost)'}

    			]
    		},
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

//        var footerDataObect = {
//
//        };
//
//        $('#'+elctyCstrInfDataGrid).alopexGrid('footerData', footerDataObect);

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['fctInvtId', 'afeYr', 'afeDgr'];

    	$('#'+elctyCstrInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');

	}
    function getTotalSum(values) {
    	var result = 0;
    	for (var i in values) {
    		result += parseFloat(values[i])
    	}
    	return AlopexGrid.renderUtil.addCommas(result);
    }

    function elctyCstrInfSetEventListener() {

    	$('#'+elctyCstrInfDataGrid).on('rowInlineEditEnd',function(e){
    		if (gClsDivCd == 'Y') {
    			$('#'+elctyCstrInfDataGrid).alopexGrid('showProgress');
        		var param = AlopexGrid.parseEvent(e).data;
    			var userId = $("#userId").val();
    			var afeYr = $("#afeYr").val();
    			var afeDgr = $("#afeDgr").val();
    			if (userId == "") { userId = "SYSTEM"; }
    			param.userId	 	= userId;
    			param.afeYr 		= afeYr;
    			param.afeDgr 		= afeDgr;

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtElctyCstrInf', param, 'POST', 'InvtElctyCstrInf');
    		}


    	});

    	$('#btnElctyExcelUpload').on('click', function(e) {
    		if (gClsDivCd == 'Y') {
    			var afeYr 	= $("#afeYr").val();
    			var afeDgr 	= $("#afeDgr").val();
    			var data = {afeYr : afeYr, afeDgr :  afeDgr};
    			$a.popup({
        		  	popid: 'ExcelUpload',
        		  	title: 'Excel Upload',
        		      url: '/tango-transmission-web/configmgmt/fctinvt/InvtElctyCstrInfExcelUpload.do',
        		      windowpopup : true,
        		      data: data,
        		      modal: true,
        		      movable:true,
        		      width : window.innerWidth * 0.9,
        		      height : 750,
        		      callback : function(data) {
        		    	 elctyCstrInf.setGrid(1,100000);
        		      }
        		});
    		} else {
     			callMsgBox('','W', '마감된 AFE 차수 입니다. 업로드 할 수 없습니다.', function(msgId, msgRst){});
 			    return;
 			}

    	});


    	 $('#btnElctyExportExcel').on('click', function(e) {

     		//필터링 체크 여부
     		 var filtered = false;
     		 if (document.getElementsByClassName('alopexgrid-filter-dropdownbutton filtered').length > 0) {
     			 filtered = true;
     		 }
     		$('#'+elctyCstrInfDataGrid).alopexGrid("showCol", ['fctInvtId', 'afeYr', 'afeDgr']);
     		 var dt = new Date();
  			var recentY = dt.getFullYear();
  			var recentM = dt.getMonth() + 1;
  			var recentD = dt.getDate();

  			if(recentM < 10) recentM = "0" + recentM;
  			if(recentD < 10) recentD = "0" + recentD;

  			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

  			var worker = new ExcelWorker({
  				excelFileName : '부대설비투자_전기공사_'+recentYMD,
  				sheetList : [{
  					sheetName : '전기공사',
  					$grid : $("#"+elctyCstrInfDataGrid)
  				}]
  			});
  			worker.export({
  				merge : true,
  				useCSSParser : true,
  				useGridColumnWidth : true,
  				border : true,
//  				exportNumberingColumn : true,
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
  							var hideColList = ['fctInvtId', 'afeYr', 'afeDgr'];
 				    	    $('#'+elctyCstrInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');
  						}
  					}
  				}
  			});
          });

    };


	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'InvtElctyCstrInf'){
    		$('#'+elctyCstrInfDataGrid).alopexGrid('hideProgress');
    		if (response.InvtElctyCstr.length > 0) {
    			var objData = response.InvtElctyCstr[0];
        		$('#'+elctyCstrInfDataGrid).alopexGrid('dataEdit', objData, { fctInvtId : objData.fctInvtId});
        		$('#'+elctyCstrInfDataGrid).alopexGrid("viewUpdate");
    		}

    	}
    	if(flag == 'distCd'){
    		grDistCd = [];
    		for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grDistCd.push(resObj);
			}
    	}
    	if(flag == 'search'){
    		$('#'+elctyCstrInfDataGrid).alopexGrid('hideProgress');
    		setSPGrid(elctyCstrInfDataGrid, response, response.InvtElctyCstrInfList);
    		var afeYr = $('#afeYr').val();
    		var afeDgr = $('#afeDgr').val();
    		var param = {afeYr : afeYr, afeDgr : afeDgr};
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getClsDivCd', param, 'GET', 'clsDivCd');
    	}

    	if(flag == 'clsDivCd'){
    		if (response.clsDivCdList.length > 0) {
    			gClsDivCd = 	response.clsDivCdList[0].clsDivCd;
    			if (gClsDivCd !='Y') {
    				$("#gClsDivClctyInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
    			} else {
    				$("#gClsDivClctyInfText").html("");
    			}
    		} else {
    			$("#gClsDivClctyInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
    		}
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
       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : elctyCstrInfScrollOffset.column}});
       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'bldFlorNo'});
	}

    this.setGrid = function(page, rowPerPage) {

    	elctyCstrInfScrollOffset = $('#'+elctyCstrInfDataGrid).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#InvtElctyCstrInfPageNo').val(page);
    	$('#InvtElctyCstrInfRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	var subParam =  $("#InvtElctyCstrInfForm").getData();
    	var page = $('#InvtElctyCstrInfPageNo').val();
    	var rowPerPage = $('#InvtElctyCstrInfRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+elctyCstrInfDataGrid).alopexGrid('showProgress')
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtElctyCstrInfList', param, 'GET', 'search');

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

    function setIsNaNCheck(strVal) {
		if (isNaN(strVal)) { strVal = 0; }
		return strVal;
	}


});