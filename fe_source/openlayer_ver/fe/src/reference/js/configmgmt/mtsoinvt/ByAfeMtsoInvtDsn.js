/**
 * MtsoInf.js
 *
 * @author Administrator
 * @date 2020. 03. 03. 오전 17:30:03
 * @version 1.0
 */

var byAfeMtso = $a.page(function() {

	var byAfeMtsoDataGridId = 'byAfeMtsoDataGrid';
	var paramData = null;

	var gridHeadData	= [];
	var gridColData		= [];
	var grInvtCd	= [];

	var byAfeMtsoScrollOffset = null;

    this.init = function(id, param) {
    	byAfeMtsoSetSelectCode();
    	byAfeMtsoSetEventListener();

    };
    this.gridColSetupByAfeMtsoInvtDsn = function() {
    	var ckGubun = $("input:radio[name=afeDsnGubun][value='T']").is(":checked") ? true : false;
    	$('#'+byAfeMtsoDataGridId).alopexGrid('dataEmpty');
    	if (ckGubun) {
			gridHeadData	= [];
			gridColData		= [];
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
								},
								editable : function(value, data) {
									if(data.repMtsoYn == 'Y') {
										var strSelectOption = '<option value="" >선택</option>';
										for(var i in grInvtCd) {
											var exist = '';

											if (value && value.indexOf(grInvtCd[i].value) != -1) {
												exist = ' selected';
											}
											strSelectOption += '<option value='+grInvtCd[i].value+' '+exist+'>'+grInvtCd[i].text+'</option>';
										}
										return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
									} else {
										var strCss = 'width:100%;background-color:transparent;border:0 solid black;text-align:center;';
										return '<div><input type="text" readonly style="'+strCss+'" value="" /></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
			var arrData = {fromIndex:4, toIndex:10, title: tAfe + "년  투자비"};
			gridHeadData.push(arrData);
			var arrData = {fromIndex:11, toIndex:18, title: paramData.afeYr + "년 연간 투자 계획"};
			gridHeadData.push(arrData);

			var arrData = {fromIndex:19, toIndex:25, title: paramData.afeYr + "년 AFE 소계"};
			gridHeadData.push(arrData);

			var startI = 26;

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
									},
									editable : function(value, data) {
										var strVal = value;
										var strCss = 'width:100%;height:22px;text-align:center;';
										if(data.repMtsoYn == 'Y') {
											return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
									},
									editable : function(value, data) {
										var strVal = value;
										var strCss = 'width:100%;height:22px;text-align:center;';
										if(data.repMtsoYn == 'Y') {
											return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
									},
									editable : function(value, data) {
										var strVal = value;
										var strCss = 'width:100%;height:22px;text-align:center;';
										if(data.repMtsoYn == 'Y') {
											return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
									},
									editable : function(value, data) {
										var strVal = value;
										var strCss = 'width:100%;height:22px;text-align:center;';
										if(data.repMtsoYn == 'Y') {
											return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
									},
									editable : function(value, data) {
										var strVal = value;
										var strCss = 'width:100%;height:22px;text-align:center;';
										if(data.repMtsoYn == 'Y') {
											return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
									},
									editable : function(value, data) {
										var strVal = value;
										var strCss = 'width:100%;height:22px;text-align:center;';
										if(data.repMtsoYn == 'Y') {
											return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
								},
								editable : function(value, data) {
									var strVal = value;
									var strCss = 'width:100%;height:22px;text-align:center;';
									if(data.repMtsoYn == 'Y') {
										return '<div><input type="text" class="numberOnly" style="'+strCss+'" value="'+strVal+'"/></div>';
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
				autoColumnIndex: true, rowInlineEdit: true, autoResize: true, filteringHeader: true,
				filter: {
					title: true, movable: true, saveFilterSize: true, sorting: true, dataFilterInstant: true, dataFilterSearch: true,
					closeFilter: { applyButton: true, removeButton: true },typeListDefault : {selectValue : 'contain',expandSelectValue : 'contain'},
					filterByEnter: true, focus: 'searchInput'
				},
				columnFixUpto 	: 'floorNm',
				headerGroup 	: gridHeadData,
	    		columnMapping	: gridColData,
				message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
	        });
		} else {

			var colList = [];
	    	colList = [
				{ key : 'mtsoInvtId', align:'center', title : '국사투자ID', width: '120px' },		// 숨김
				{ key : 'demdHdofcCd', align:'center', title : '본부', width: '100px',
					render : function(value, data, render, mapping){
							if(data.repMtsoYn == 'Y') {
								return data.demdHdofcCd ;
							} else {
								return '';
							}
					}
				},
				{ key : 'demdAreaCd', align:'center', title : '지역', width: '100',
					render : function(value, data, render, mapping){
						if(data.repMtsoYn == 'Y') {
							return data.demdAreaCd ;
						} else {
							return '';
						}
					}
				},
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
				{ key : 'afeYr', align:'center', title : '년도', width: '70px'},
				{ key : 'afeDgr', align:'center', title : '차수', width: '70px'},
				{ key : 'afeDgrTotCost', align:'center', title : '소계', width: '100px'},
				{ key : 'afeDgrLandCost', align:'center', title : '토지', width: '100px'},
				{ key : 'afeDgrNbdCost', align:'center', title : '건축', width: '100px'},
				{ key : 'afeDgrLinCdlnCost', align:'center', title : '인입관로', width: '100px'},
				{ key : 'afeDgrRprCapexCost', align:'center', title : '인테리어(CapEx)', width: '100px'},
				{ key : 'afeDgrRprOperCost', align:'center', title : '인테리어(OpEx)', width: '100px'},
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
				];
	    	var headerMappingN = [
	 			 {fromIndex:5, toIndex:6, title:"AFE 구분"},
				 {fromIndex:7, toIndex:23, title:"AFE 항목"}
			   ];
	    	//그리드 생성
			$('#'+byAfeMtsoDataGridId).alopexGrid({
				parger : false,
				paging : {pagerSelect: false, pagerTotal : true ,hidePageList: true},
				defaultColumnMapping:{sorting : true},
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
					closeFilter: {applyButton: true,removeButton: true},
					filterByEnter: true,
					typeListDefault : {
						selectValue : 'contain',
						expandSelectValue : 'contain'
					},
					focus: 'searchInput'},

				columnFixUpto : 'floorNm',
				headerGroup : headerMappingN,
				columnMapping: colList,
				message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
				}
			});
		}

    	byAfeDsnHideCol();
    };

    this.byAfeDsnHideCol = function() {
    	byAfeDsnHideCol();
    }
//
    function byAfeDsnHideCol() {
    	var ckGubun = $("input:radio[name=afeDsnGubun][value='T']").is(":checked") ? true : false;


    	for(var i = 0; i < publicEtcAfeDsnHideCol.length; i++){
			var upWord = publicEtcAfeDsnHideCol[i].mtsoInvtItmVal;
	    	if (ckGubun) {
	    		//console.log(upWord+'------------'+'afeDsnEtcColVal1'); //afeDsnEtcColVal1
    			if (publicEtcAfeDsnHideCol[i].mtsoInvtItmHidYn == 'N') {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {title : publicEtcAfeDsnHideCol[i].mtsoInvtItmNm}, upWord);
    			} else {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {hidden : true}, upWord);
    			}
	    	}
		}


    	for(var i = 0; i < publicEtcDsnHideCol.length; i++){
			var upWord = publicEtcDsnHideCol[i].mtsoInvtItmVal;
	    	if (ckGubun) {
	    		for(var j = 0; j < publicAfeDgr.length; j++){

	    			var afeDgr  = publicAfeDgr[j].afeDgr;
    				var colNm1 = 'm' + afeDgr + upWord.replace('afe','Afe');;
        			if (publicEtcDsnHideCol[i].mtsoInvtItmHidYn == 'N') {
        				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {title : publicEtcDsnHideCol[i].mtsoInvtItmNm}, colNm1);
        			} else {
        				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
        			}
	    		}
	    	} else {
				var colNm1 = upWord.replace('Afe','afe');

    			if (publicEtcDsnHideCol[i].mtsoInvtItmHidYn == 'N') {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {title : publicEtcDsnHideCol[i].mtsoInvtItmNm}, colNm1);
    			} else {
    				$('#'+byAfeMtsoDataGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
    			}
	    	}
		}




    }


    function byAfeMtsoSetSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd/INVTCD', null, 'GET', 'invtCdList');	// 투자유형
    }

    function byAfeMtsoSetEventListener() {
    	$('#btnByAfeMgmtPop').on('click', function(e) {
			$a.popup({
				popid: 'AfeLkup',
				title: 'AFE별 차수 관리',
				url: '/tango-transmission-web/configmgmt/mtsoinvt/AfeMgmtPop.do',
				modal: true,
				movable:true,
				windowpopup : true,
				width : 370,
				height : 550,
				callback : function(data) {
					comMain.getAfeYrPop();
				}
			});
		});

    	$(document).on('click', "[id='afeDsnGubun']", function(e){
    		byAfeMtso.gridColSetupByAfeMtsoInvtDsn();
    	});


    	$('#btnByAfeMtsoImportExcel').on('click', function(e) {
    		$a.popup({
    		  	popid: 'ExcelUpload',
    		  	title: 'Excel Upload',
    		      url: '/tango-transmission-web/configmgmt/mtsoinvt/ByAfeMtsoInvtDsnExcelUpload.do',
    		      windowpopup : true,
    		      modal: true,
    		      movable:true,
    		      width : window.innerWidth * 0.9,
    		      height : 750,
    		      callback : function(data) {
    		    	  byAfeMtso.setGrid(1,100000);
    		      }
    		});
    	});


    	$('#btnByAfeMtsoExportExcel').on('click', function(e) {
    		var ckGubun = $("input:radio[name=afeDsnGubun][value='T']").is(":checked") ? true : false;
    		var sheetTitle = '국사투자설계';
			if (!ckGubun) {
				var userId 		= $('#userId').val();
	    		var paramData 	= {downFlag : 'MTSOINVT', userId : userId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setExcelDownLoadHis', paramData, 'POST', '');

				sheetTitle = '차수별_국사투자설계';
			}

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
         });


    	$('#'+byAfeMtsoDataGridId).on('rowInlineEditEnd',function(e){
    		var param 	= AlopexGrid.parseEvent(e).data;
			var userId 	= $("#userId").val();
			var afeYr	= $("#afeYr").val();
			param.userId 	= userId;
			param.afeYr 	= afeYr;
			// return 값은 필요 없음.


			 $('#'+byAfeMtsoDataGridId).alopexGrid('dataFlush', function(editedDataList){

				 var result = $.map(editedDataList, function(el, idx){ return el.mtsoInvtId;})

				 if (result.length > 0) {

					httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeByMtsoInf', param, 'POST', '');

					var byDtlList = [];

					var tmpAfeDgrLandCost 			= param.m1AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m1AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m1AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m1AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m1AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m1AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m1AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m1AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m1AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m1AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m1AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m1AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m1AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m1AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m1AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m1AfeDgrEtcColVal10;


					var tmpDtlList1 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '1', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10

					};

					var tmpAfeDgrLandCost 			= param.m2AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m2AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m2AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m2AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m2AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m2AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m2AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m2AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m2AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m2AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m2AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m2AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m2AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m2AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m2AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m2AfeDgrEtcColVal10;



					var tmpDtlList2 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '2', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m3AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m3AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m3AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m3AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m3AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m3AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m3AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m3AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m3AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m3AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m3AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m3AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m3AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m3AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m3AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m3AfeDgrEtcColVal10;

					var tmpDtlList3 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '3', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m4AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m4AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m4AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m4AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m4AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m4AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m4AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m4AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m4AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m4AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m4AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m4AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m4AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m4AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m4AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m4AfeDgrEtcColVal10;

					var tmpDtlList4 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '4', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m5AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m5AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m5AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m5AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m5AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m5AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m5AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m5AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m5AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m5AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m5AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m5AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m5AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m5AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m5AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m5AfeDgrEtcColVal10;

					var tmpDtlList5 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '5', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m6AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m6AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m6AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m6AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m6AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m6AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m6AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m6AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m6AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m6AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m6AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m6AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m6AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m6AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m6AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m6AfeDgrEtcColVal10;

					var tmpDtlList6 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '6', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m7AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m7AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m7AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m7AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m7AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m7AfeDgrBascEnvCost;


					var tmpAfeDgrEtcColVal1			= param.m7AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m7AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m7AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m7AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m7AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m7AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m7AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m7AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m7AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m7AfeDgrEtcColVal10;

					var tmpDtlList7 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '7', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m8AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m8AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m8AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m8AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m8AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m8AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m8AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m8AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m8AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m8AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m8AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m8AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m8AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m8AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m8AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m8AfeDgrEtcColVal10;

					var tmpDtlList8 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '8', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m9AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m9AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m9AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m9AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m9AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m9AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m9AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m9AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m9AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m9AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m9AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m9AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m9AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m9AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m9AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m9AfeDgrEtcColVal10;

					var tmpDtlList9 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '9', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};

					var tmpAfeDgrLandCost 			= param.m10AfeDgrLandCost;
					var tmpAfeDgrNbdCost 			= param.m10AfeDgrNbdCost;
					var tmpAfeDgrLinCdlnCost 		= param.m10AfeDgrLinCdlnCost;
					var tmpAfeDgrRprCapexCost 		= param.m10AfeDgrRprCapexCost;
					var tmpAfeDgrRprOperCost 		= param.m10AfeDgrRprOperCost;
					var tmpAfeDgrBascEnvCost 		= param.m10AfeDgrBascEnvCost;

					var tmpAfeDgrEtcColVal1			= param.m10AfeDgrEtcColVal1;
					var tmpAfeDgrEtcColVal2			= param.m10AfeDgrEtcColVal2;
					var tmpAfeDgrEtcColVal3			= param.m10AfeDgrEtcColVal3;
					var tmpAfeDgrEtcColVal4			= param.m10AfeDgrEtcColVal4;
					var tmpAfeDgrEtcColVal5			= param.m10AfeDgrEtcColVal5;
					var tmpAfeDgrEtcColVal6			= param.m10AfeDgrEtcColVal6;
					var tmpAfeDgrEtcColVal7			= param.m10AfeDgrEtcColVal7;
					var tmpAfeDgrEtcColVal8			= param.m10AfeDgrEtcColVal8;
					var tmpAfeDgrEtcColVal9			= param.m10AfeDgrEtcColVal9;
					var tmpAfeDgrEtcColVal10		= param.m10AfeDgrEtcColVal10;

					var tmpDtlList10 = {
							mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '10', userId : userId,
							afeDgrLandCost : tmpAfeDgrLandCost, afeDgrNbdCost : tmpAfeDgrNbdCost, afeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost,
							afeDgrRprCapexCost : tmpAfeDgrRprCapexCost, afeDgrRprOperCost : tmpAfeDgrRprOperCost, afeDgrBascEnvCost : tmpAfeDgrBascEnvCost,
							afeDgrEtcColVal1 : tmpAfeDgrEtcColVal1, afeDgrEtcColVal2 : tmpAfeDgrEtcColVal2, afeDgrEtcColVal3 : tmpAfeDgrEtcColVal3,
							afeDgrEtcColVal4 : tmpAfeDgrEtcColVal4, afeDgrEtcColVal5 : tmpAfeDgrEtcColVal5, afeDgrEtcColVal6 : tmpAfeDgrEtcColVal6,
							afeDgrEtcColVal7 : tmpAfeDgrEtcColVal7, afeDgrEtcColVal8 : tmpAfeDgrEtcColVal8, afeDgrEtcColVal9 : tmpAfeDgrEtcColVal9,
							afeDgrEtcColVal10 : tmpAfeDgrEtcColVal10
					};


					var tAfeDgrLandCost 		= [];
					var tAfeDgrNbdCost 			= [];
					var tAfeDgrLinCdlnCost 		= [];
					var tAfeDgrRprCapexCost 	= [];
					var tAfeDgrRprOperCost 		= [];
					var tAfeDgrBascEnvCost 		= [];

					for (var i = 0; i < publicAfeDgr.length; i++) {
						if (publicAfeDgr[i].afeDgr == "1") {
							byDtlList.push(tmpDtlList1);

							tAfeDgrLandCost.push(tmpDtlList1.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList1.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList1.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList1.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList1.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList1.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList1.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList1.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList1.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList1.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList1.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList1.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m1AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});



						} else if (publicAfeDgr[i].afeDgr == "2") {
							byDtlList.push(tmpDtlList2);

							tAfeDgrLandCost.push(tmpDtlList2.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList2.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList2.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList2.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList2.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList2.afeDgrBascEnvCost);


							var totSum = setIsNaNCheck(parseInt(tmpDtlList2.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList2.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList2.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList2.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList2.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList2.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m2AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});


						} else if (publicAfeDgr[i].afeDgr == "3") {
							byDtlList.push(tmpDtlList3);

							tAfeDgrLandCost.push(tmpDtlList3.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList3.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList3.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList3.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList3.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList3.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList3.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList3.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList3.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList3.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList3.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList3.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m3AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});

						} else if (publicAfeDgr[i].afeDgr == "4") {
							byDtlList.push(tmpDtlList4);

							tAfeDgrLandCost.push(tmpDtlList4.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList4.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList4.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList4.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList4.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList4.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList4.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList4.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList4.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList4.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList4.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList4.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m4AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});

						} else if (publicAfeDgr[i].afeDgr == "5") {
							byDtlList.push(tmpDtlList5);

							tAfeDgrLandCost.push(tmpDtlList5.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList5.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList5.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList5.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList5.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList5.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList5.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList5.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList5.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList5.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList5.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList5.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m5AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});

						} else if (publicAfeDgr[i].afeDgr == "6") {
							byDtlList.push(tmpDtlList6);

							tAfeDgrLandCost.push(tmpDtlList6.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList6.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList6.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList6.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList6.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList6.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList6.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList6.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList6.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList6.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList6.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList6.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m6AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});

						} else if (publicAfeDgr[i].afeDgr == "7") {
							byDtlList.push(tmpDtlList7);

							tAfeDgrLandCost.push(tmpDtlList7.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList7.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList7.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList7.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList7.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList7.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList7.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList7.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList7.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList7.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList7.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList7.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m7AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});


						} else if (publicAfeDgr[i].afeDgr == "8") {
							byDtlList.push(tmpDtlList8);

							tAfeDgrLandCost.push(tmpDtlList8.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList8.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList8.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList8.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList8.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList8.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList8.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList8.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList8.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList8.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList8.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList8.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m8AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});
						} else if (publicAfeDgr[i].afeDgr == "9") {
							byDtlList.push(tmpDtlList9);

							tAfeDgrLandCost.push(tmpDtlList9.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList9.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList9.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList9.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList9.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList9.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList9.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList9.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList9.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList9.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList9.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList9.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m9AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});
						} else if (publicAfeDgr[i].afeDgr == "10") {
							byDtlList.push(tmpDtlList10);

							tAfeDgrLandCost.push(tmpDtlList10.afeDgrLandCost);
							tAfeDgrNbdCost.push(tmpDtlList10.afeDgrNbdCost);
							tAfeDgrLinCdlnCost.push(tmpDtlList10.afeDgrLinCdlnCost);
							tAfeDgrRprCapexCost.push(tmpDtlList10.afeDgrRprCapexCost);
							tAfeDgrRprOperCost.push(tmpDtlList10.afeDgrRprOperCost);
							tAfeDgrBascEnvCost.push(tmpDtlList10.afeDgrBascEnvCost);

							var totSum = setIsNaNCheck(parseInt(tmpDtlList10.afeDgrLandCost))
										+setIsNaNCheck(parseInt(tmpDtlList10.afeDgrNbdCost))
										+setIsNaNCheck(parseInt(tmpDtlList10.afeDgrLinCdlnCost))
										+setIsNaNCheck(parseInt(tmpDtlList10.afeDgrRprCapexCost))
										+setIsNaNCheck(parseInt(tmpDtlList10.afeDgrRprOperCost))
										+setIsNaNCheck(parseInt(tmpDtlList10.afeDgrBascEnvCost))
							$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {m10AfeDgrTotCost : totSum}, {mtsoInvtId : param.mtsoInvtId});
						}
					}

					if (byDtlList == null || byDtlList == undefined || byDtlList == "") {

					} else {

						var tmpAfeDgrLandCost = 0;
						var filtered = tAfeDgrLandCost.filter(function(el){ return el != ''; });
						for (var i = 0; i < filtered.length; i++) {
							tmpAfeDgrLandCost += setIsNaNCheck(parseInt(filtered[i]));
						}

						var tmpAfeDgrNbdCost = 0;
						var filtered = tAfeDgrNbdCost.filter(function(el){ return el != ''; });
						for (var i = 0; i < filtered.length; i++) {
							tmpAfeDgrNbdCost += setIsNaNCheck(parseInt(filtered[i]));
						}

						var tmpAfeDgrLinCdlnCost = 0;
						var filtered = tAfeDgrLinCdlnCost.filter(function(el){ return el != ''; });
						for (var i = 0; i < filtered.length; i++) {
							tmpAfeDgrLinCdlnCost += setIsNaNCheck(parseInt(filtered[i]));
						}

						var tmpAfeDgrRprCapexCost = 0;
						var filtered = tAfeDgrRprCapexCost.filter(function(el){ return el != ''; });
						for (var i = 0; i < filtered.length; i++) {
							tmpAfeDgrRprCapexCost += setIsNaNCheck(parseInt(filtered[i]));
						}

						var tmpAfeDgrRprOperCost = 0;
						var filtered = tAfeDgrRprOperCost.filter(function(el){ return el != ''; });
						for (var i = 0; i < filtered.length; i++) {
							tmpAfeDgrRprOperCost += setIsNaNCheck(parseInt(filtered[i]));
						}

						var tmpAfeDgrBascEnvCost = 0;
						var filtered = tAfeDgrBascEnvCost.filter(function(el){ return el != ''; });
						for (var i = 0; i < filtered.length; i++) {
							tmpAfeDgrBascEnvCost += setIsNaNCheck(parseInt(filtered[i]));
						}


		//				'm'+afeDgr+'AfeDgrTotCost'

						var tot = tmpAfeDgrLandCost + tmpAfeDgrNbdCost + tmpAfeDgrLinCdlnCost + tmpAfeDgrRprCapexCost + tmpAfeDgrRprOperCost + tmpAfeDgrBascEnvCost;
						$('#'+byAfeMtsoDataGridId).alopexGrid('dataEdit', {totAfeDgrCost : tot, totAfeDgrLandCost : tmpAfeDgrLandCost, totAfeDgrNbdCost : tmpAfeDgrNbdCost, totAfeDgrLinCdlnCost : tmpAfeDgrLinCdlnCost, totAfeDgrRprCapexCost : tmpAfeDgrRprCapexCost, totAfeDgrRprOperCost : tmpAfeDgrRprOperCost, totAfeDgrBascEnvCost : tmpAfeDgrBascEnvCost}, {mtsoInvtId : param.mtsoInvtId});

						httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeByMtsoDtlList', byDtlList, 'POST', '');
					}
				 }

			 });
        });
    };

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
    	if(flag == 'searchAfeDgrDtl'){
    		$('#'+byAfeMtsoDataGridId).alopexGrid('hideProgress');
    		$('#'+byAfeMtsoDataGridId).alopexGrid('dataSet', response.afeDsnDtlList);

    		// 스크롤 유지시 컬럼 고정이 있는 경우 위치 이동이 안되 컬럼 고정 풀고 스크롤 위치 이동후 다시 고정 설정
	       	$('#'+byAfeMtsoDataGridId).alopexGrid('columnUnfix');
	       	$('#'+byAfeMtsoDataGridId).alopexGrid('dataScroll' ,{_index:{row: 0, column : byAfeMtsoScrollOffset.column}});
	       	$('#'+byAfeMtsoDataGridId).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});

//    		var serverPageinfo = {dataLength : response.afeDsnDtlList.length,current : 1, perPage : 100};
//    		$('#'+byAfeMtsoDataGridId).alopexGrid('dataSet', response.afeDsnDtlList, serverPageinfo);
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
	       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : byAfeMtsoScrollOffset.column}});
	       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});
	}


    this.setGrid = function(page, rowPerPage) {

    	byAfeMtsoScrollOffset = $('#'+byAfeMtsoDataGridId).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

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


    	$('#'+byAfeMtsoDataGridId).alopexGrid('showProgress')
    	var ckGubun = $("input:radio[name=afeDsnGubun][value='T']").is(":checked") ? true : false;
    	if (ckGubun) {
    		param.bfAfeYr = setIsNaNCheck(parseInt(param.afeYr)) - 1;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getByMtsoDsnList', param, 'GET', 'search');
    	} else {
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getAfeDsnDtlList', param, 'GET', 'searchAfeDgrDtl');
    	}
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