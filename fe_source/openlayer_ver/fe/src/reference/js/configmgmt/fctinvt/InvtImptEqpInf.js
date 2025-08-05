/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var imptEqpInf = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var imptEqpInfDataGrid = 'imptEqpInfDataGrid';
	var paramData = null;
	var gClsDivCd = 'N';

	var bldMgmtTypCd		= [];
	var landOwnDivCd		= [];
	var bldOwnDivCd			= [];
	var screLandYr		    = [];
	var screLandDivCd		= [];
	var screBldYr 			 =[];


	var grBizDivCd			= [];
	var grVndCd				= [];
	var grUpsdCd			= [];
	var imptEqpInfScrollOffset = null;

    this.init = function(id, param) {
    	imptEqpInfSetSelectCode();
    	imptEqpInfSetEventListener();

    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function imptEqpInfSetSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/XBIZTYP', null, 'GET', 'BizDivCd');	// 사업구분
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/XDUHVAL', null, 'GET', 'VndCd');		// 벤더

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/XUPSDTYP', null, 'GET', 'UpsdCd');		// 벤더
    }


    this.imptEqpInfGridCol = function() {
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
			{ key : 'bldFlorNo', align:'center', title : '층', width: '40px'},

			{ key : 'upsdCd', align:'center', title : '상면구분코드', width: '120px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grUpsdCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grUpsdCd) {
						var exist = '';

						if (value && value.indexOf(grUpsdCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grUpsdCd[i].value+' '+exist+'>'+grUpsdCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'invtBizCd', align:'center', title : '사업구분', width: '120px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grBizDivCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grBizDivCd) {
						var exist = '';

						if (value && value.indexOf(grBizDivCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grBizDivCd[i].value+' '+exist+'>'+grBizDivCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'vndCd', align:'center', title : '벤더', width: '80px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grVndCd);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grVndCd) {
						var exist = '';

						if (value && value.indexOf(grVndCd[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grVndCd[i].value+' '+exist+'>'+grVndCd[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},

			{ key : 'wlesExstDuh10Cnt', align:'center', title : 'DUH10', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesExstDuh20Cnt', align:'center', title : 'DUH20', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesExstDuh30Cnt', align:'center', title : 'DUH30', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesExstLteDuCnt', align:'center', title : 'LTE DU', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesSystmDuh10NwCnt', align:'center', title : 'DUH10', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesSystmDuh20NwCnt', align:'center', title : 'DUH20', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesSystmDuh30NwCnt', align:'center', title : 'DUH30', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesSystmLteDuCnt', align:'center', title : 'LTE DU', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'wlesPveDuh10NwCnt', align:'center', title : 'DUH10 수', width: '80px',  exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wlesPveDuh20NwCnt', align:'center', title : 'DUH20 수', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wlesPveDuh30NwCnt', align:'center', title : 'DUH30 수', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wlesPveLteDuCnt', align:'center', title : 'LTE DU 수', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wlesPveSkbEpwrVal', align:'center', title : '기타-SKB(소비전력)', width: '135px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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

			{ key : 'wlesPuiEpwrRackCnt', align:'center', title : 'Rack 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wlesPuiCnsmEpwrVal', align:'center', title : '소비전력(W)', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstCrRtCnt', align:'center', title : 'CORE RT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstBkhlIvcCnt', align:'center', title : '백홀 IVC', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstBkhlIvrCnt', align:'center', title : '백홀 IVR', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstBkhlIvrrCnt', align:'center', title : '백홀 IVRR', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstRotnCotCnt', align:'center', title : 'ROTN COT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstRotnRtCnt', align:'center', title : 'ROTN RT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstRotnRrtCnt', align:'center', title : 'ROTN RRT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExst5gponCotCnt', align:'center', title : '5GPON COT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreExstSumr', align:'center', title : '소계', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmCrRtCnt', align:'center', title : 'CORE RT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmBkhlIvcCnt', align:'center', title : '백홀 IVC', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmBkhlIvrCnt', align:'center', title : '백홀 IVR', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmBkhlIvrrCnt', align:'center', title : '백홀 IVRR', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmRotnCotCnt', align:'center', title : 'ROTN COT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmRotnRtCnt', align:'center', title : 'ROTN RT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmRotnRrtCnt', align:'center', title : 'ROTN RRT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystm5gponCotCnt', align:'center', title : '5GPON COT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreSystmSumr', align:'center', title : '소계', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'wrePveCrRtCnt', align:'center', title : 'CORE RT', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePveBkhlIvcCnt', align:'center', title : '백홀 IVC', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePveBkhlIvrCnt', align:'center', title : '백홀 IVR', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePveBkhlIvrrCnt', align:'center', title : '백홀 IVRR', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePveRotnCotCnt', align:'center', title : 'ROTN COT', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePveRotnRtCnt', align:'center', title : 'ROTN RT', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePveRotnRrtCnt', align:'center', title : 'ROTN RRT', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePve5gponCotCnt', align:'center', title : '5GPON COT', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wrePveSumr', align:'center', title : '소계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'wreNwCrRtEpwrVal', align:'center', title : 'CORE RT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNwBkhlIvcEpwrVal', align:'center', title : '백홀 IVC', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNwBkhlIvrEpwrVal', align:'center', title : '백홀 IVR', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNwBkhlIvrrEpwrVal', align:'center', title : '백홀 IVRR', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNwRotnCotEpwrVal', align:'center', title : 'ROTN COT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNwRotnRtEpwrVal', align:'center', title : 'ROTN RT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNwRotnRrtEpwrVal', align:'center', title : 'ROTN RRT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNw5gponCotEpwrVal', align:'center', title : '5GPON COT', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'wreNwEtcEpwrVal', align:'center', title : '기타', width: '80px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'wreNwTotEpwrVal', align:'center', title : '소계', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'nwTotEpwrVal', align:'center', title : '무선+유선[w]', width: '120px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },



			{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '50px', hidden:true   },		// 숨김
			{ key : 'mtsoId', align:'center', title : '국사ID', width: '100px', hidden:true  		 },		// 숨김
			{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '50px', hidden:true  }		// 숨김



			];

    	return colList;
    }

    this.imptEqpInfGrid = function() {
    	var param =  $("#searchForm").getData();
    	$('#'+imptEqpInfDataGrid).alopexGrid('dataEmpty');
    	var headerMappingN = [
					    		 {fromIndex:0, toIndex:2, title:"업로드 기준"} // 최상단 그룹
					    		,{fromIndex:7, toIndex:9, title:"투자구분"} // 최상단 그룹 , headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:10, toIndex:13, title:"무선망 장비 현황"}
					   			,{fromIndex:14, toIndex:17, title:"무선망 장비 신규(System)"}
					   			,{fromIndex:18, toIndex:22, title:"무선망 장비 신규(수동)", headerStyleclass : 'headerBackGroundGreenS'} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:23, toIndex:24, title:"무선망 순증 전력"}
					   			,{fromIndex:25, toIndex:33, title:"유선망 장비 현황"}
					   			,{fromIndex:34, toIndex:42, title:"유선망 장비 신규(System)"}
					   			,{fromIndex:43, toIndex:51, title:"유선망 장비 신규(수동)", headerStyleclass : 'headerBackGroundGreenS'} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:52, toIndex:61, title:"유선망 신규 전력"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:62, toIndex:62, title:"총 신규 전력", headerStyleclass : 'headerBackGroundBlueS'}
				   			 ];
        //그리드 생성
        $('#'+imptEqpInfDataGrid).alopexGrid({
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
			columnFixUpto : 'bldFlorNo',
			headerGroup : headerMappingN,
    		columnMapping: imptEqpInf.imptEqpInfGridCol() ,
    		footer : {
    			position : 'buttom',
    			footerMapping : [
    				{columnIndex : 5, colspan:true, align : 'center', title : '합계'},
    				{columnIndex : 10, align : 'center', render : 'sum(wlesExstDuh10Cnt)'},
		    		{columnIndex : 11, align : 'center', render : 'sum(wlesExstDuh20Cnt)'},
		    		{columnIndex : 12, align : 'center', render : 'sum(wlesExstDuh30Cnt)'},
		    		{columnIndex : 13, align : 'center', render : 'sum(wlesExstLteDuCnt)'},
		    		{columnIndex : 14, align : 'center', render : 'sum(wlesSystmDuh10NwCnt)'},
		    		{columnIndex : 15, align : 'center', render : 'sum(wlesSystmDuh20NwCnt)'},
		    		{columnIndex : 16, align : 'center', render : 'sum(wlesSystmDuh30NwCnt)'},
		    		{columnIndex : 17, align : 'center', render : 'sum(wlesSystmLteDuCnt)'},
		    		{columnIndex : 18, align : 'center', render : 'sum(wlesPveDuh10NwCnt)'},
		    		{columnIndex : 19, align : 'center', render : 'sum(wlesPveDuh20NwCnt)'},
		    		{columnIndex : 20, align : 'center', render : 'sum(wlesPveDuh30NwCnt)'},
		    		{columnIndex : 21, align : 'center', render : 'sum(wlesPveLteDuCnt)'},
		    		{columnIndex : 22, align : 'center', render : 'sum(wlesPveSkbEpwrVal)'},
		    		{columnIndex : 23, align : 'center', render : 'sum(wlesPuiEpwrRackCnt)'},
		    		{columnIndex : 24, align : 'center', render : 'sum(wlesPuiCnsmEpwrVal)'},
		    		{columnIndex : 25, align : 'center', render : 'sum(wreExstCrRtCnt)'},
		    		{columnIndex : 26, align : 'center', render : 'sum(wreExstBkhlIvcCnt)'},
		    		{columnIndex : 27, align : 'center', render : 'sum(wreExstBkhlIvrCnt)'},
		    		{columnIndex : 28, align : 'center', render : 'sum(wreExstBkhlIvrrCnt)'},
		    		{columnIndex : 29, align : 'center', render : 'sum(wreExstRotnCotCnt)'},
		    		{columnIndex : 30, align : 'center', render : 'sum(wreExstRotnRtCnt)'},
		    		{columnIndex : 31, align : 'center', render : 'sum(wreExstRotnRrtCnt)'},
		    		{columnIndex : 32, align : 'center', render : 'sum(wreExst5gponCotCnt)'},
		    		{columnIndex : 33, align : 'center', render : 'sum(wreExstSumr)'},
		    		{columnIndex : 34, align : 'center', render : 'sum(wreSystmCrRtCnt)'},
		    		{columnIndex : 35, align : 'center', render : 'sum(wreSystmBkhlIvcCnt)'},
		    		{columnIndex : 36, align : 'center', render : 'sum(wreSystmBkhlIvrCnt)'},
		    		{columnIndex : 37, align : 'center', render : 'sum(wreSystmBkhlIvrrCnt)'},
		    		{columnIndex : 38, align : 'center', render : 'sum(wreSystmRotnCotCnt)'},
		    		{columnIndex : 39, align : 'center', render : 'sum(wreSystmRotnRtCnt)'},
		    		{columnIndex : 40, align : 'center', render : 'sum(wreSystmRotnRrtCnt)'},
		    		{columnIndex : 41, align : 'center', render : 'sum(wreSystm5gponCotCnt)'},
		    		{columnIndex : 42, align : 'center', render : 'sum(wreSystmSumr)'},
		    		{columnIndex : 43, align : 'center', render : 'sum(wrePveCrRtCnt)'},
		    		{columnIndex : 44, align : 'center', render : 'sum(wrePveBkhlIvcCnt)'},
		    		{columnIndex : 45, align : 'center', render : 'sum(wrePveBkhlIvrCnt)'},
		    		{columnIndex : 46, align : 'center', render : 'sum(wrePveBkhlIvrrCnt)'},
		    		{columnIndex : 47, align : 'center', render : 'sum(wrePveRotnCotCnt)'},
		    		{columnIndex : 48, align : 'center', render : 'sum(wrePveRotnRtCnt)'},
		    		{columnIndex : 49, align : 'center', render : 'sum(wrePveRotnRrtCnt)'},
		    		{columnIndex : 50, align : 'center', render : 'sum(wrePve5gponCotCnt)'},
		    		{columnIndex : 51, align : 'center', render : 'sum(wrePveSumr)'},
		    		{columnIndex : 52, align : 'center', render : 'sum(wreNwCrRtEpwrVal)'},
		    		{columnIndex : 53, align : 'center', render : 'sum(wreNwBkhlIvcEpwrVal)'},
		    		{columnIndex : 54, align : 'center', render : 'sum(wreNwBkhlIvrEpwrVal)'},
		    		{columnIndex : 55, align : 'center', render : 'sum(wreNwBkhlIvrrEpwrVal)'},
		    		{columnIndex : 56, align : 'center', render : 'sum(wreNwRotnCotEpwrVal)'},
		    		{columnIndex : 57, align : 'center', render : 'sum(wreNwRotnRtEpwrVal)'},
		    		{columnIndex : 58, align : 'center', render : 'sum(wreNwRotnRrtEpwrVal)'},
		    		{columnIndex : 59, align : 'center', render : 'sum(wreNw5gponCotEpwrVal)'},
		    		{columnIndex : 60, align : 'center', render : 'sum(wreNwEtcEpwrVal)'},
		    		{columnIndex : 61, align : 'center', render : 'sum(wreNwTotEpwrVal)'},
		    		{columnIndex : 62, align : 'center', render : 'sum(nwTotEpwrVal)'}

    			]
    		},
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        gridHide();

    };

    function gridHide() {

    	var hideColList = ['fctInvtId', 'afeYr', 'afeDgr'];
    	$('#'+imptEqpInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');

	}


    function imptEqpInfSetEventListener() {

    	$('#'+imptEqpInfDataGrid).on('rowInlineEditEnd',function(e){

    		if (gClsDivCd == 'Y') {
	    		$('#'+imptEqpInfDataGrid).alopexGrid('showProgress');
	    		var param = AlopexGrid.parseEvent(e).data;
				var userId = $("#userId").val();
				var afeYr = $("#afeYr").val();
				var afeDgr = $("#afeDgr").val();
				if (userId == "") { userId = "SYSTEM"; }
				param.userId	 	= userId;
				param.afeYr 		= afeYr;
				param.afeDgr 		= afeDgr;

				httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtImptEqpInf', param, 'POST', 'InvtImptEqpInf');
			}


    	});


    	$('#btnEqpExcelUpload').on('click', function(e) {
    		if (gClsDivCd == 'Y') {
    			var afeYr 	= $("#afeYr").val();
    			var afeDgr 	= $("#afeDgr").val();
    			var data = {afeYr : afeYr, afeDgr :  afeDgr};
    			$a.popup({
        		  	popid: 'ExcelUpload',
        		  	title: 'Excel Upload',
        		      url: '/tango-transmission-web/configmgmt/fctinvt/InvtImptEqpInfExcelUpload.do',
        		      windowpopup : true,
        		      data: data,
        		      modal: true,
        		      movable:true,
        		      width : window.innerWidth * 0.9,
        		      height : 750,
        		      callback : function(data) {
        		    	  imptEqpInf.setGrid(1,100000);
        		      }
        		});
    		} else {
    			callMsgBox('','W', '마감된 AFE 차수 입니다. 업로드 할 수 없습니다.', function(msgId, msgRst){});
			    return;
			}

    	});


    	$('#btnExportImpt').on('click', function(e) {
    		if (gClsDivCd == 'Y') {
    			var userId 	= $("#userId").val();
    			var afeYr 	= $("#afeYr").val();
    			var afeDgr 	= $("#afeDgr").val();
    			if (userId == "") { userId = "SYSTEM"; }
    			var param = {userId : userId, afeYr : afeYr, afeDgr :  afeDgr};
    			$('#'+imptEqpInfDataGrid).alopexGrid('showProgress');
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/setExportImpt', param, 'POST', 'ExportImpt');
    		} else {
    			callMsgBox('','W', '마감된 AFE 차수 입니다. 수정 할수 없습니다.', function(msgId, msgRst){});
			    return;
			}
        });



    	 $('#btnImptEqpExportExcel').on('click', function(e) {

    		var userId 		= $('#userId').val();
    		var paramData 	= {downFlag : 'EQPINF', userId : userId};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setExcelDownLoadHis', paramData, 'POST', '');

    		 $('#'+imptEqpInfDataGrid).alopexGrid("showCol", ['fctInvtId', 'afeYr', 'afeDgr']);
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
 				excelFileName : '부대설비투자_주장비_'+recentYMD,
 				sheetList : [{
 					sheetName : '주장비정보',
 					$grid : $("#"+imptEqpInfDataGrid)
 				}]
 			});
 			worker.export({
 				merge : true,
 				useCSSParser : true,
 				useGridColumnWidth : true,
 				border : true,
// 				exportNumberingColumn : true,
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
 				    	    $('#'+imptEqpInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');
 						}
 					}
 				}
 			});
         });

    };


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'BizDivCd'){
    		grBizDivCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grBizDivCd.push(resObj);
			}
    	}
    	if(flag == 'VndCd'){
    		grVndCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grVndCd.push(resObj);
			}
    	}
    	if(flag == 'UpsdCd'){
    		grUpsdCd = [];
			for(var i=0; i<response.length; i++){
				var resObj = {value : response[i].comCd, text : response[i].comCdNm};
				grUpsdCd.push(resObj);
			}
    	}

    	if(flag == 'ExportImpt'){
    		$('#'+imptEqpInfDataGrid).alopexGrid('hideProgress');
    		imptEqpInf.setGrid(1,100);
    	}
    	if(flag == 'InvtImptEqpInf'){
    		$('#'+imptEqpInfDataGrid).alopexGrid('hideProgress');
    		if (response.InvtImptFqp.length > 0) {
    			var objData = response.InvtImptFqp[0];
        		$('#'+imptEqpInfDataGrid).alopexGrid('dataEdit', objData, { fctInvtId : objData.fctInvtId});
        		$('#'+imptEqpInfDataGrid).alopexGrid("viewUpdate");
    		}
    	}
    	if(flag == 'search'){
    		$('#'+imptEqpInfDataGrid).alopexGrid('hideProgress');
    		setSPGrid(imptEqpInfDataGrid, response, response.InvtImptEqpInfList);

    		var afeYr = $('#afeYr').val();
    		var afeDgr = $('#afeDgr').val();
    		var param = {afeYr : afeYr, afeDgr : afeDgr};
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getClsDivCd', param, 'GET', 'clsDivCd');
    	}

    	if(flag == 'clsDivCd'){
    		if (response.clsDivCdList.length > 0) {
    			gClsDivCd = 	response.clsDivCdList[0].clsDivCd;
    			if (gClsDivCd !='Y') {
    				$("#gClsDivEqpInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
    			} else {
    				$("#gClsDivEqpInfText").html("");
    			}
    		} else {
    			$("#gClsDivEqpInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
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
       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : imptEqpInfScrollOffset.column}});
       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'bldFlorNo'});
	}

    this.setGrid = function(page, rowPerPage) {

    	imptEqpInfScrollOffset = $('#'+imptEqpInfDataGrid).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#InvtImptEqpInfPageNo').val(page);
    	$('#InvtImptEqpInfRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	var subParam =  $("#InvtImptEqpInfForm").getData();
    	var page = $('#InvtImptEqpInfPageNo').val();
    	var rowPerPage = $('#InvtImptEqpInfRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+imptEqpInfDataGrid).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtImptEqpInfList', param, 'GET', 'search');

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