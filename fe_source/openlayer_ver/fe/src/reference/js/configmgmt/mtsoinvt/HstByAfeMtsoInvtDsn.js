/**
 * MtsoInf.js
 *
 * @author Administrator
 * @date 2020. 03. 03. 오전 17:30:03
 * @version 1.0
 */

var byAfeMtso = $a.page(function() {

	var byAfeMtsoDataGridId = 'byAfeMtsoDataGrid';
	var byAfeInfGridId = 'byAfeInfGridId';
	var byAfeDtlGridId = 'byAfeDtlGridId';

	var paramData = null;

	var gridHeadData	= [];
	var gridColData		= [];
	var grInvtCd	= [];

    this.init = function(id, param) {
    	byAfeMtsoSetSelectCode();
    	byAfeMtsoSetEventListener();

    };
    this.gridColSetupByAfeMtsoInvtDsn = function() {
    	$('#'+byAfeMtsoDataGridId).alopexGrid('dataEmpty');
    	gridHeadData	= [];
		gridColData		= [];


		var colData = { key : 'lastChgDate', align:'center', title : '저장 일시', width: '150', styleclass : 'font-blue'};
		gridColData.push(colData);
		var colData = { key : 'lastChgUserId', align:'center', title : '사용자ID', width: '100', styleclass : 'font-blue'};
		gridColData.push(colData);
		var colData = { key : 'demdHdofcCd', align:'center', title : '본부', width: '90', styleclass : 'font-blue',
			    				render : function(value, data, render, mapping){
									if(data.repMtsoYn == 'Y') {
										return data.demdHdofcCd ;
									} else {
										return '';
									}
							}
						};
		gridColData.push(colData);

		var colData = { key : 'demdAreaCd', align:'center', title : '지역', width: '90', styleclass : 'font-blue',
			    				render : function(value, data, render, mapping){
									if(data.repMtsoYn == 'Y') {
										return data.demdAreaCd ;
									} else {
										return '';
									}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'mtsoNm', align:'center', title : '국사명', width: '150px',
							render : function(value, data, render, mapping){
		    					if(data.repMtsoYn == 'Y') {
		    						return data.mtsoNm ;
		    					} else {
		    						return '';
		    					}
		    				}
						}
		gridColData.push(colData);
		var colData = { key : 'floorNm', align:'center', title : '층명', width: '150px',
							render : function(value, data, render, mapping){
		    					if(data.repMtsoYn == 'Y') {
		    						return '';
		    					} else {
		    						return data.floorNm ;
		    					}
		    				}
						}
		gridColData.push(colData);
		var colData = { key : 'bfTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								var tmpCnt =  setIsNaNCheck(parseInt(data.bfLandCost))
											+ setIsNaNCheck(parseInt(data.bfNbdCost))
											+ setIsNaNCheck(parseInt(data.bfLinCdlnCost))
											+ setIsNaNCheck(parseInt(data.bfRprCost))
											+ setIsNaNCheck(parseInt(data.bfBascEnvCost));
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'bfLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'bfNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'bfLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'bfRprCost', align:'center', title : '인테리어', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'bfBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'bfRmk', align:'left', title : '비고', width: '100px',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									return tmpCnt;
								}
							},
							editable : function(value, data) {
								var strVal = value;
								var strCss = 'width:100%;height:22px;text-align:left;';
								if(data.repMtsoYn == 'Y') {
									return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'invtTypCd', align:'center', title : '투자유형', width: '110px', filter : {useRenderToFilter : true},
							render : {type : 'string',
								rule : function(value, data) {
									if(data.repMtsoYn == 'Y') {
										var render_data = [{ value : ''}];
										render_data = render_data.concat(grInvtCd);
										return render_data;
									} else {
										data.invtTypCd = '';
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'invtTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								var tmpCnt =  setIsNaNCheck(parseInt(data.invtLandCost))
											+ setIsNaNCheck(parseInt(data.invtNbdCost))
											+ setIsNaNCheck(parseInt(data.invtLinCdlnCost))
											+ setIsNaNCheck(parseInt(data.invtRprCapexCost))
											+ setIsNaNCheck(parseInt(data.invtRprOperCost))
											+ setIsNaNCheck(parseInt(data.invtBascEnvCost));
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'invtLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'invtNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'invtLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'invtRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'invtRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'invtBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'totAfeDgrCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'totAfeDgrLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'totAfeDgrNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'totAfeDgrLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'totAfeDgrRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'totAfeDgrRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'totAfeDgrBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(isNaN(tmpCnt)) {tmpCnt = 0;}
									return comMain.setComma(tmpCnt);
								}
							}
						}
		gridColData.push(colData);


		/**************************************************
		 *	차수별 타이틀 및 항목 추가 Start
		 *************************************************/
		var paramData =  $("#searchForm").getData();	// 상위 값을 기준으로 타이틀을 정의 한다.
		var tAfe = parseInt(paramData.afeYr) - 1;
		var arrData = {fromIndex:6, toIndex:12, title: tAfe + "년  투자비"};
		gridHeadData.push(arrData);
		var arrData = {fromIndex:13, toIndex:20, title: paramData.afeYr + "년 연간 투자 계획"};
		gridHeadData.push(arrData);

		var arrData = {fromIndex:21, toIndex:27, title: paramData.afeYr + "년 AFE 소계"};
		gridHeadData.push(arrData);

		var startI = 28;

		for(i = 0; i < publicAfeDgr.length; i++) {

			var afeYr 	= publicAfeDgr[i].afeYr;
			var afeDgr  = publicAfeDgr[i].afeDgr;

			/**************************************************
			 *	차수별 산출 타이틀
			 *************************************************/
			var arrData = {fromIndex:startI, toIndex:startI + 16, title: afeYr + "년 " + afeDgr + "차 AFE"};
			gridHeadData.push(arrData);
			startI = startI + 17;
			var colData = { key : 'm'+afeDgr+'AfeDgrTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						if(data.repMtsoYn == 'Y') {
							if(isNaN(tmpCnt)) {tmpCnt = 0;}
							return comMain.setComma(tmpCnt);
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(!isNaN(tmpCnt)) {
											return comMain.setComma(tmpCnt);
										}
									}
								}
							}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(!isNaN(tmpCnt)) {
											return comMain.setComma(tmpCnt);
										}
									}
								}
							}
			gridColData.push(colData);

			var colData = { key : 'm'+afeDgr+'AfeDgrLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(!isNaN(tmpCnt)) {
											return comMain.setComma(tmpCnt);
										}
									}
								}
							}
			gridColData.push(colData);

			var colData = { key : 'm'+afeDgr+'AfeDgrRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(!isNaN(tmpCnt)) {
											return comMain.setComma(tmpCnt);
										}
									}
								}
							}
			gridColData.push(colData);

			var colData = { key : 'm'+afeDgr+'AfeDgrRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(!isNaN(tmpCnt)) {
											return comMain.setComma(tmpCnt);
										}
									}
								}
							}
			gridColData.push(colData);

			var colData = { key : 'm'+afeDgr+'AfeDgrBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(!isNaN(tmpCnt)) {
											return comMain.setComma(tmpCnt);
										}
									}
								}
							}
			gridColData.push(colData);

			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal1', align:'center', title : '기타1', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal2', align:'center', title : '기타2', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal3', align:'center', title : '기타3', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal4', align:'center', title : '기타4', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal5', align:'center', title : '기타5', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal6', align:'center', title : '기타6', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal7', align:'center', title : '기타7', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal8', align:'center', title : '기타8', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal9', align:'center', title : '기타9', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);
			var colData = { key : 'm'+afeDgr+'AfeDgrEtcColVal10', align:'center', title : '기타10', width: '100px',
					render : function(value, data, render, mapping){
						var tmpCnt =  value;
						return tmpCnt;
					},
					editable : function(value, data) {
						var strVal = value;
						var strCss = 'width:100%;height:22px;text-align:center;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);


		}
		/**************************************************
		 *	차수별 타이틀 및 항목 추가 End
		 *************************************************/

		startI = startI;
		var tAfe = parseInt(paramData.afeYr);
		var arrData = {fromIndex:startI, toIndex:startI + 6, title: tAfe + "년  연말 정산 예정 금액"};
		gridHeadData.push(arrData);
		var colData = { key : 'setlTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  value;
					var tmpCnt =  setIsNaNCheck(parseInt(data.setlLandCost))
								+ setIsNaNCheck(parseInt(data.setlNbdCost))
								+ setIsNaNCheck(parseInt(data.setlLinCdlnCost))
								+ setIsNaNCheck(parseInt(data.setlRprCapexCost))
								+ setIsNaNCheck(parseInt(data.setlRprOperCost))
								+ setIsNaNCheck(parseInt(data.setlBascEnvCost));
					if(data.repMtsoYn == 'Y') {
						if(isNaN(tmpCnt)) {tmpCnt = 0;}
						return comMain.setComma(tmpCnt);
					}
				}
			}
		gridColData.push(colData);

		var colData = { key : 'setlLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'setlNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'setlLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'setlRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'setlRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'setlBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);


		startI = startI + 7;
		var tAfe = parseInt(paramData.afeYr);
		var arrData = {fromIndex:startI, toIndex:startI + 6, title: tAfe + "년  과부족 금액"};
		gridHeadData.push(arrData);



		var colData = { key : 'ovstTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  value;
					var tmpCnt =  setIsNaNCheck(parseInt(data.ovstLandCost))
								+ setIsNaNCheck(parseInt(data.ovstNbdCost))
								+ setIsNaNCheck(parseInt(data.ovstLinCdlnCost))
								+ setIsNaNCheck(parseInt(data.ovstRprCapexCost))
								+ setIsNaNCheck(parseInt(data.ovstRprOperCost))
								+ setIsNaNCheck(parseInt(data.ovstBascEnvCost));
					if(data.repMtsoYn == 'Y') {
						if(isNaN(tmpCnt)) {tmpCnt = 0;}
						return comMain.setComma(tmpCnt);
					}
				}
			}
		gridColData.push(colData);

		var colData = { key : 'ovstLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'ovstNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'ovstLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'ovstRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'ovstRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'ovstBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);



		startI = startI + 7;
		var tAfe = parseInt(paramData.afeYr) + 1;
		var arrData = {fromIndex:startI, toIndex:startI + 6, title: tAfe + "년  이후 투자비(지역)"};
		gridHeadData.push(arrData);



		var colData = { key : 'nxtBoTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  value;
					var tmpCnt =  setIsNaNCheck(parseInt(data.nxtBoLandCost))
								+ setIsNaNCheck(parseInt(data.nxtBoNbdCost))
								+ setIsNaNCheck(parseInt(data.nxtBoLinCdlnCost))
								+ setIsNaNCheck(parseInt(data.nxtBoRprCapexCost))
								+ setIsNaNCheck(parseInt(data.nxtBoRprOperCost))
								+ setIsNaNCheck(parseInt(data.nxtBoBascEnvCost));
					if(data.repMtsoYn == 'Y') {
						if(isNaN(tmpCnt)) {tmpCnt = 0;}
						return comMain.setComma(tmpCnt);
					}
				}
			}
		gridColData.push(colData);

		var colData = { key : 'nxtBoLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'nxtBoNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtBoLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtBoRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtBoRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtBoBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);



		startI = startI + 7;
		var tAfe = parseInt(paramData.afeYr) + 1;
		var arrData = {fromIndex:startI, toIndex:startI + 6, title: tAfe + "년  이후 투자비(본사)"};
		gridHeadData.push(arrData);



		var colData = { key : 'nxtHdqtrTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  value;
					var tmpCnt =  setIsNaNCheck(parseInt(data.nxtHdqtrLandCost))
								+ setIsNaNCheck(parseInt(data.nxtHdqtrNbdCost))
								+ setIsNaNCheck(parseInt(data.nxtHdqtrLinCdlnCost))
								+ setIsNaNCheck(parseInt(data.nxtHdqtrRprCapexCost))
								+ setIsNaNCheck(parseInt(data.nxtHdqtrRprOperCost))
								+ setIsNaNCheck(parseInt(data.nxtHdqtrBascEnvCost));
					if(data.repMtsoYn == 'Y') {
						if(isNaN(tmpCnt)) {tmpCnt = 0;}
						return comMain.setComma(tmpCnt);
					}
				}
			}
		gridColData.push(colData);

		var colData = { key : 'nxtHdqtrLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'nxtHdqtrNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtHdqtrLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtHdqtrRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtHdqtrRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'nxtHdqtrBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);



		startI = startI + 7;

		var arrData = {fromIndex:startI, toIndex:startI + 6, title: "18년 이후  투입된 전체 투자비"};
		gridHeadData.push(arrData);



		var colData = { key : 'allInvtTotCost', align:'center', title : '소계', width: '100px', exportDataType: 'number',
				render : function(value, data, render, mapping){
					var tmpCnt =  value;
					if(data.repMtsoYn == 'Y') {
						if(isNaN(tmpCnt)) {tmpCnt = 0;}
						return comMain.setComma(tmpCnt);
					}
				}
			}
		gridColData.push(colData);

		var colData = { key : 'allInvtLandCost', align:'center', title : '토지', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);
		var colData = { key : 'allInvtNbdCost', align:'center', title : '건축', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'allInvtLinCdlnCost', align:'center', title : '인입관로', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'allInvtRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'allInvtRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

		var colData = { key : 'allInvtBascEnvCost', align:'center', title : '트레이', width: '100px', exportDataType: 'number',
							render : function(value, data, render, mapping){
								var tmpCnt =  value;
								if(data.repMtsoYn == 'Y') {
									if(!isNaN(tmpCnt)) {
										return comMain.setComma(tmpCnt);
									}
								}
							}
						}
		gridColData.push(colData);

//
		var arrData = {fromIndex:startI + 7, toIndex:startI + 16, title: "기타항목"};
		gridHeadData.push(arrData);

		var colData = { key : 'afeDsnEtcColVal1', align:'center', title : '기타1', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);

		var colData = { key : 'afeDsnEtcColVal2', align:'center', title : '기타2', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal3', align:'center', title : '기타3', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal4', align:'center', title : '기타4', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal5', align:'center', title : '기타5', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal6', align:'center', title : '기타6', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal7', align:'center', title : '기타7', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal8', align:'center', title : '기타8', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal9', align:'center', title : '기타9', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);
		var colData = { key : 'afeDsnEtcColVal10', align:'center', title : '기타10', width: '100px',
				render : function(value, data, render, mapping){
					return value;
				},
				editable : function(value, data) {
					return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
				}
			}
		gridColData.push(colData);



		var colData = { key : 'mtsoInvtId', align:'center', title : '국사투자ID', hidden : true }
		gridColData.push(colData);

		/**************************************************
		 *	그리드 설정
		 *************************************************/
		$('#'+byAfeMtsoDataGridId).alopexGrid({
        	paging : {
        		pagerSelect: [2000,5000]
				,hidePageList: true  // pager 중앙 삭제
				,pagerSelect: false
			},
			defaultColumnMapping:{
    			sorting : true
    		},
    		fullCompareForEditedState: true,
			autoColumnIndex: true, rowInlineEdit: false, autoResize: true, filteringHeader: true,
			filter: {
				title: true, movable: true, saveFilterSize: true, sorting: true, dataFilterInstant: true, dataFilterSearch: true,
				closeFilter: { applyButton: true, removeButton: true },typeListDefault : {selectValue : 'contain',expandSelectValue : 'contain'},
				filterByEnter: true, focus: 'searchInput'
			},
			height : '5row',
			columnFixUpto 	: 'lastChgUserId',
			headerGroup 	: gridHeadData,
    		columnMapping	: gridColData,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
		var afeYr	= $("#afeYr").val();
		var tAfe = parseInt(afeYr) - 1;
		var nAfe = parseInt(afeYr) + 1;

		$('#'+byAfeInfGridId).alopexGrid({
        	parger : false,
			defaultColumnMapping:{
    			sorting : true
    		},
    		//fullCompareForEditedState: true,
			autoColumnIndex: true,
			rowInlineEdit: false,
			autoResize: true,
			height : '3row',
			headerGroup: [
				{fromIndex:3, toIndex:8, title: tAfe +'년 투자비'},
				{fromIndex:9, toIndex:15, title: afeYr +'년 연간 투자 계획'},
				{fromIndex:16, toIndex:21, title: afeYr +'년 연말 정산 예정 금액'},
				{fromIndex:22, toIndex:27, title: afeYr +'년 과부족 금액'},
				{fromIndex:28, toIndex:33, title: nAfe +'년 이후 투자비(지역)'},
				{fromIndex:34, toIndex:39, title: nAfe +'년 이후 투자비(본사)'},
				{fromIndex:40, toIndex:49, title: nAfe +'년 이후 투자비(본사)'}
			],

    		columnMapping: [
    			{ key : 'lastChgDate', align:'center', title : '저장 일시', width: '150'},
    			{ key : 'lastChgUserId', align:'center', title : '사용자ID', width: '100'},
    			{ key : 'afeYr', align:'center', title : 'AFE년도', width: '100'},

    			{ key : 'bfLandCost', align:'center', title : '토지비', width: '100'},
    			{ key : 'bfNbdCost', align:'center', title : '신축비', width: '100'},
    			{ key : 'bfLinCdlnCost', align:'center', title : '인입관로비', width: '100'},
    			{ key : 'bfRprCost', align:'center', title : '수리비', width: '100'},
    			{ key : 'bfBascEnvCost', align:'center', title : '트레이', width: '100'},
    			{ key : 'bfRmk', align:'center', title : '비고', width: '100'},
    			{ key : 'invtTypCd', align:'center', title : '투자유형', width: '100'},
    			{ key : 'invtLandCost', align:'center', title : '토지비', width: '100'},
    			{ key : 'invtNbdCost', align:'center', title : '신축비', width: '100'},
    			{ key : 'invtLinCdlnCost', align:'center', title : '인입관로비', width: '100'},
    			{ key : 'invtRprCapexCost', align:'center', title : '인테리어(CAPEX)', width: '100'},
    			{ key : 'invtRprOperCost', align:'center', title : '인테리어(OPEX)', width: '100'},
    			{ key : 'invtBascEnvCost', align:'center', title : '트레이', width: '100'},

    			{ key : 'setlLandCost', align:'center', title : '토지비', width: '100'},
    			{ key : 'setlNbdCost', align:'center', title : '신축비', width: '100'},
    			{ key : 'setlLinCdlnCost', align:'center', title : '인입관로비', width: '100'},
    			{ key : 'setlRprCapexCost', align:'center', title : '인테리어(CAPEX)', width: '100'},
    			{ key : 'setlRprOperCost', align:'center', title : '인테리어(OPEX)', width: '100'},
    			{ key : 'setlBascEnvCost', align:'center', title : '트레이', width: '100'},


    			{ key : 'ovstLandCost', align:'center', title : '토지비', width: '100'},
    			{ key : 'ovstNbdCost', align:'center', title : '신축비', width: '100'},
    			{ key : 'ovstLinCdlnCost', align:'center', title : '인입관로비', width: '100'},
    			{ key : 'ovstRprCapexCost', align:'center', title : '인테리어(CAPEX)', width: '100'},
    			{ key : 'ovstRprOperCost', align:'center', title : '인테리어(OPEX)', width: '100'},
    			{ key : 'ovstBascEnvCost', align:'center', title : '트레이', width: '100'},

    			{ key : 'nxtBoLandCost', align:'center', title : '토지비', width: '100'},
    			{ key : 'nxtBoNbdCost', align:'center', title : '신축비', width: '100'},
    			{ key : 'nxtBoLinCdlnCost', align:'center', title : '인입관로비', width: '100'},
    			{ key : 'nxtBoRprCapexCost', align:'center', title : '인테리어(CAPEX)', width: '100'},
    			{ key : 'nxtBoRprOperCost', align:'center', title : '인테리어(OPEX)', width: '100'},
    			{ key : 'nxtBoBascEnvCost', align:'center', title : '트레이', width: '100'},

    			{ key : 'nxtHdqtrLandCost', align:'center', title : '토지비', width: '100'},
    			{ key : 'nxtHdqtrNbdCost', align:'center', title : '신축비', width: '100'},
    			{ key : 'nxtHdqtrLinCdlnCost', align:'center', title : '인입관로비', width: '100'},
    			{ key : 'nxtHdqtrRprCapexCost', align:'center', title : '인테리어(CAPEX)', width: '100'},
    			{ key : 'nxtHdqtrRprOperCost', align:'center', title : '인테리어(OPEX)', width: '100'},
    			{ key : 'nxtHdqtrBascEnvCost', align:'center', title : '트레이', width: '100'},
    			{ key : 'afeDsnEtcColVal1', align:'left', title : '기타1', width: '100px'},
				{ key : 'afeDsnEtcColVal2', align:'left', title : '기타2', width: '100px'},
				{ key : 'afeDsnEtcColVal3', align:'left', title : '기타3', width: '100px'},
				{ key : 'afeDsnEtcColVal4', align:'left', title : '기타4', width: '100px'},
				{ key : 'afeDsnEtcColVal5', align:'left', title : '기타5', width: '100px'},
				{ key : 'afeDsnEtcColVal6', align:'left', title : '기타6', width: '100px'},
				{ key : 'afeDsnEtcColVal7', align:'left', title : '기타7', width: '100px'},
				{ key : 'afeDsnEtcColVal8', align:'left', title : '기타8', width: '100px'},
				{ key : 'afeDsnEtcColVal9', align:'left', title : '기타9', width: '100px'},
				{ key : 'afeDsnEtcColVal10', align:'left', title : '기타10', width: '100px'}

    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

		$('#'+byAfeDtlGridId).alopexGrid({
        	parger : false,
			defaultColumnMapping:{
    			sorting : true
    		},
    		//fullCompareForEditedState: true,
			autoColumnIndex: true,
			rowInlineEdit: false,
			autoResize: true,
			height : '3row',
    		columnMapping: [
    			{ key : 'lastChgDate', align:'center', title : '저장 일시', width: '150'},
    			{ key : 'lastChgUserId', align:'center', title : '사용자ID', width: '100'},
    			{ key : 'lastChgUserId', align:'center', title : '사용자ID', width: '100', hidden : true},
    			{ key : 'afeYr', align:'center', title : '년도', width: '70px'},
				{ key : 'afeDgr', align:'center', title : '차수', width: '70px'},
				{ key : 'afeDgrLandCost', align:'center', title : '토지비', width: '100px'},
				{ key : 'afeDgrNbdCost', align:'center', title : '신축비', width: '100px'},
				{ key : 'afeDgrLinCdlnCost', align:'center', title : '인입관로비', width: '100px'},
				{ key : 'afeDgrRprCapexCost', align:'center', title : '인테리어(CAPEX)', width: '100px'},
				{ key : 'afeDgrRprOperCost', align:'center', title : '인테리어(OPEX)', width: '100px'},
				{ key : 'afeDgrBascEnvCost', align:'center', title : '트레이', width: '100px'},
				{ key : 'afeDgrEtcColVal1', align:'left', title : '기타1', width: '100px'},
				{ key : 'afeDgrEtcColVal2', align:'left', title : '기타2', width: '100px'},
				{ key : 'afeDgrEtcColVal3', align:'left', title : '기타3', width: '100px'},
				{ key : 'afeDgrEtcColVal4', align:'left', title : '기타4', width: '100px'},
				{ key : 'afeDgrEtcColVal5', align:'left', title : '기타5', width: '100px'},
				{ key : 'afeDgrEtcColVal6', align:'left', title : '기타6', width: '100px'},
				{ key : 'afeDgrEtcColVal7', align:'left', title : '기타7', width: '100px'},
				{ key : 'afeDgrEtcColVal8', align:'left', title : '기타8', width: '100px'},
				{ key : 'afeDgrEtcColVal9', align:'left', title : '기타9', width: '100px'},
				{ key : 'afeDgrEtcColVal10', align:'left', title : '기타10', width: '100px'}




    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

		byAfeDsnHideCol();
    };

    this.byAfeDsnHideCol = function() {
    	byAfeDsnHideCol();
    }

    function byAfeDsnHideCol() {

    	for(var i = 0; i < publicEtcAfeDsnHideCol.length; i++){
			var upWord = publicEtcAfeDsnHideCol[i].mtsoInvtItmVal;
	    	//if (ckGubun) {
    			if (publicEtcAfeDsnHideCol[i].mtsoInvtItmHidYn == 'N') {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {title : publicEtcAfeDsnHideCol[i].mtsoInvtItmNm}, upWord);
    				$('#'+byAfeInfGridId).alopexGrid('updateColumn', {title : publicEtcAfeDsnHideCol[i].mtsoInvtItmNm}, upWord);

    			} else {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {hidden : true}, upWord);
    				$('#'+byAfeInfGridId).alopexGrid('updateColumn', {hidden : true}, upWord);
    			}
	    	//}
		}



    	for(var i = 0; i < publicEtcDsnHideCol.length; i++){
			var upWord = publicEtcDsnHideCol[i].mtsoInvtItmVal;
    		for(var j = 0; j < publicAfeDgr.length; j++){

    			var afeDgr  = publicAfeDgr[j].afeDgr;
				var colNm1 = 'm' + afeDgr + upWord.replace('afe','Afe');
    			if (publicEtcDsnHideCol[i].mtsoInvtItmHidYn == 'N') {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {title : publicEtcAfeDsnHideCol[i].mtsoInvtItmNm}, colNm1);
    				$('#'+byAfeDtlGridId).alopexGrid('updateColumn', {title : publicEtcDsnHideCol[i].mtsoInvtItmNm}, upWord);
    			} else {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
    				$('#'+byAfeDtlGridId).alopexGrid('updateColumn', {hidden : true}, upWord);
    			}
    		}
		}
    }

    function byAfeMtsoSetSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/INVTCD', null, 'GET', 'invtCdList');	// 투자유형
    }



    function byAfeMtsoSetEventListener() {

    	$('#'+byAfeMtsoDataGridId).on('click', '.bodycell', function(e){
    		$('#'+byAfeInfGridId).show();
    		$('#'+byAfeDtlGridId).show();
			var dataObj = AlopexGrid.parseEvent(e).data;

			var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";
			var afeYr	= $("#afeYr").val();
			var data = {mtsoInvtId: dataObj.mtsoInvtId, srchDt : srchDt, afeYr : afeYr};
			subSetGrid(data);
			subSetGrid2(data);
		});

    	$('#btnByAfeMtsoExportExcel').on('click', function(e) {
    		var sheetTitle = '국사투자설계';
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
 				excelFileName : sheetTitle+'_'+recentYMD,
 				sheetList : [{
 					sheetName : sheetTitle,
 					$grid : $("#"+byAfeMtsoDataGridId)
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
         });

    };

    function subSetGrid(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getSubHstByInfList', data, 'GET', 'subSearch1');

    }
    function subSetGrid2(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getSubHstByDtlList', data, 'GET', 'subSearch2');
    }


	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'invtCdList'){
    		grInvtCd = [];
    		for(var i=0; i<response.length; i++){
    			var resObj = {value : response[i].comCd, text : response[i].comCdNm};
    			grInvtCd.push(resObj);
    		}
    	}


    	if(flag == 'search'){
    		$('#'+byAfeMtsoDataGridId).alopexGrid('hideProgress');
    		setSPGrid(byAfeMtsoDataGridId, response, response.byMtsoDsnList);
    	}

    	if(flag == 'subSearch1'){
    		$('#'+byAfeInfGridId).alopexGrid('hideProgress');
    		$('#'+byAfeInfGridId).alopexGrid('dataSet', response.mtsoInvtDsnList);
    	}

    	if(flag == 'subSearch2'){
    		$('#'+byAfeDtlGridId).alopexGrid('hideProgress');
    		$('#'+byAfeDtlGridId).alopexGrid('dataSet', response.mtsoInvtDsnList);
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
	}


    this.setGrid = function(page, rowPerPage) {
    	$('#byAfeMtsoPageNo').val(page);
    	$('#byAfeMtsoRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}
    	param.page = 1;
    	param.rowPerPage = 100000;
    	var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";
    	param.srchDt = srchDt;

    	$('#'+byAfeMtsoDataGridId).alopexGrid('showProgress')
    	param.bfAfeYr = setIsNaNCheck(parseInt(param.afeYr)) - 1;
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getHstByMtsoDsnList', param, 'GET', 'search');
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