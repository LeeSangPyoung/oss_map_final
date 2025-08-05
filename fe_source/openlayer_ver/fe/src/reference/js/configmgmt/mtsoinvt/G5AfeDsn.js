/**
 * MtsoInf.js
 *
 * @author Administrator
 * @date 2020. 03. 03. 오전 17:30:03
 * @version 1.0
 */

var g5AfeDsn = $a.page(function() {

	var g5AfeDsnGridId = 'g5AfeDsnDataGrid';

	var paramData = null;

	var gridHeadData	= [];
	var gridColData		= [];

	var g5AfeDsnScrollOffset = null;

    this.init = function(id, param) {
    	g5AfeDsnSetSelectCode();
    	g5AfeDsnSetEventListener();

    };


    this.gridColSetupG5AfeDsn = function() {
    	var ckGubun = $("input:radio[name=g5AfeDsnGubun][value='T']").is(":checked") ? true : false;
    	$('#'+g5AfeDsnGridId).alopexGrid('dataEmpty');
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

    		var colData = { key : 'bfDuhCnt', align:'center', title : 'DUH(식수)', width: '70px', exportDataType: 'number',
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

    		var colData = { key : 'bfRotnCnt', align:'center', title : 'ROTN', width: '70px', exportDataType: 'number',
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

    		var colData = { key : 'bfIvcCnt', align:'center', title : 'IVC', width: '70px', exportDataType: 'number',
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

    		var colData = { key : 'bfIvrCnt', align:'center', title : 'IVR', width: '70px', exportDataType: 'number',
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

    		var colData = { key : 'bfIvrrCnt', align:'center', title : 'IVRR', width: '70px', exportDataType: 'number',
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

    		var colData = { key : 'totDuhCnt', align:'center', title : 'DUH(식수)', width: '70px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(isNaN(tmpCnt)) {tmpCnt = 0;}
										return comMain.setComma(tmpCnt);
									}
								}
							}
    		gridColData.push(colData);

    		var colData = { key : 'totRotnCnt', align:'center', title : 'ROTN', width: '70px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(isNaN(tmpCnt)) {tmpCnt = 0;}
										return comMain.setComma(tmpCnt);
									}
								}
							}
    		gridColData.push(colData);

    		var colData = { key : 'totIvcCnt', align:'center', title : 'IVC', width: '70px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(isNaN(tmpCnt)) {tmpCnt = 0;}
										return comMain.setComma(tmpCnt);
									}
								}
							}
    		gridColData.push(colData);

    		var colData = { key : 'totIvrCnt', align:'center', title : 'IVR', width: '70px', exportDataType: 'number',
								render : function(value, data, render, mapping){
									var tmpCnt =  value;
									if(data.repMtsoYn == 'Y') {
										if(isNaN(tmpCnt)) {tmpCnt = 0;}
										return comMain.setComma(tmpCnt);
									}
								}
							}
    		gridColData.push(colData);

    		var colData = { key : 'totIvrrCnt', align:'center', title : 'IVRR', width: '70px', exportDataType: 'number',
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
    		//console.log(paramData);
    		var tAfe = parseInt(paramData.afeYr) - 1;
			var arrData = {fromIndex:4, toIndex:8, title: tAfe + "년 5G 투자 현황 소계"};
			gridHeadData.push(arrData);
			var arrData = {fromIndex:9, toIndex:13, title: paramData.afeYr + "년 5G 투자 현황 소계"};
			gridHeadData.push(arrData);

    		var startI = 14;

    		for(i = 0; i < publicAfeDgr.length; i++) {
				var afeYr 	= publicAfeDgr[i].afeYr;
				var afeDgr  = publicAfeDgr[i].afeDgr;
    			/**************************************************
    			 *	차수별 system 산출 타이틀
    			 *************************************************/
    			var arrData = {fromIndex:startI, toIndex:startI + 11, title: afeYr + "년 " + afeDgr + "차 AFE System(산출)", id:"Top"};
    			gridHeadData.push(arrData);
    			var arrData = {fromIndex:startI + 1, toIndex:startI + 2, title: "전송장비"};
    			gridHeadData.push(arrData);
    			var arrData = {fromIndex:startI + 3, toIndex:startI + 11, title: "부대장비"};
    			gridHeadData.push(arrData);
    			/**************************************************
    			 *	차수별 수동 산출 타이틀
    			 *************************************************/
    			var arrData = {fromIndex:startI + 12, toIndex:startI + 37, title: afeYr + "년 " + afeDgr + "차 AFE 수동(산출)", id:"Top"};
    			gridHeadData.push(arrData);
    			var arrData = {fromIndex:startI + 13, toIndex:startI + 16, title: "DUH 수용 국사"};
    			gridHeadData.push(arrData);
    			var arrData = {fromIndex:startI + 17, toIndex:startI + 20, title: "중계노드"};
    			gridHeadData.push(arrData);
    			var arrData = {fromIndex:startI + 21, toIndex:startI + 23, title: "대개체"};
    			gridHeadData.push(arrData);
    			var arrData = {fromIndex:startI + 24, toIndex:startI + 32, title: "부대장비"};
    			gridHeadData.push(arrData);
    			var arrData = {fromIndex:startI + 33, toIndex:startI + 37, title: afeDgr + "차 기타항목"};
    			gridHeadData.push(arrData);
    			startI = startI + 38;


    			var colData = { key : 'd'+afeDgr+'SysDuhCnt', align:'center', title : 'DUH(식수)', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysIvrCnt', align:'center', title : 'IVR', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysIvrrCnt', align:'center', title : 'IVRR', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysRtfCnt', align:'center', title : '정류기', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysBatryCnt', align:'center', title : '축전지', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysCbplCnt', align:'center', title : '분전반', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysArcnCnt', align:'center', title : '냉방기', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysEtcEqpFstCnt', align:'center', title : '기타 장비1', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysEtcEqpScndCnt', align:'center', title : '기타 장비2', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysEtcEqpThrdCnt', align:'center', title : '기타 장비3', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysEtcEqpFothCnt', align:'center', title : '기타 장비4', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'SysEtcEqpFithCnt', align:'center', title : '기타 장비5', width: '70px', exportDataType: 'number',
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




    			var colData = { key : 'd'+afeDgr+'DuhDuhCnt', align:'center', title : 'DUH(식수)', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'DuhRotnCnt', align:'center', title : 'ROTN', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'DuhIvcCnt', align:'center', title : 'IVC', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'DuhIvrCnt', align:'center', title : 'IVR', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'DuhIvrrCnt', align:'center', title : 'IVRR', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'RlyRotnCnt', align:'center', title : 'ROTN', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'RlyIvcCnt', align:'center', title : 'IVC', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'RlyIvrCnt', align:'center', title : 'IVR', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'RlyIvrrCnt', align:'center', title : 'IVRR', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'RepceIvcCnt', align:'center', title : 'IVC', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'RepceIvrCnt', align:'center', title : 'IVR', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'RepceIvrrCnt', align:'center', title : 'IVRR', width: '70px', exportDataType: 'number',
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


    			var colData = { key : 'd'+afeDgr+'RtfCnt', align:'center', title : '정류기', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'BatryCnt', align:'center', title : '축전지', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'CbplCnt', align:'center', title : '분전반', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'ArcnCnt', align:'center', title : '냉방기', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'EtcEqpFstCnt', align:'center', title : '기타1', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'EtcEqpScndCnt', align:'center', title : '기타2', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'EtcEqpThrdCnt', align:'center', title : '기타3', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'EtcEqpFothCnt', align:'center', title : '기타4', width: '70px', exportDataType: 'number',
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

    			var colData = { key : 'd'+afeDgr+'EtcEqpFithCnt', align:'center', title : '기타5', width: '70px', exportDataType: 'number',
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


    			var colData = { key : 'd'+afeDgr+'EtcEqp6', align:'left', title : '기타6', width: '70px',
						render : function(value, data, render, mapping){
							var tmpCnt =  value;
							return tmpCnt;
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

    			var colData = { key : 'd'+afeDgr+'EtcEqp7', align:'left', title : '기타7', width: '70px',
						render : function(value, data, render, mapping){
							var tmpCnt =  value;
							return tmpCnt;
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

    			var colData = { key : 'd'+afeDgr+'EtcEqp8', align:'left', title : '기타8', width: '70px',
						render : function(value, data, render, mapping){
							var tmpCnt =  value;
							return tmpCnt;
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

    			var colData = { key : 'd'+afeDgr+'EtcEqp9', align:'left', title : '기타9', width: '70px',
						render : function(value, data, render, mapping){
							var tmpCnt =  value;
							return tmpCnt;
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

    			var colData = { key : 'd'+afeDgr+'EtcEqp10', align:'left', title : '기타10', width: '70px',
						render : function(value, data, render, mapping){
							var tmpCnt =  value;
							return tmpCnt;
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

    		}
    		//console.log("------"+startI);
    		/**************************************************
			 *	차수별 타이틀 및 항목 추가 End
			 *************************************************/
    		var arrData = {fromIndex:startI, toIndex:startI + 9, title: "기타항목", id: "Top"};
			gridHeadData.push(arrData);

    		var colData = { key : 'afeG5EtcColVal1', align:'center', title : '기타1', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);

    		var colData = { key : 'afeG5EtcColVal2', align:'center', title : '기타2', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal3', align:'center', title : '기타3', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal4', align:'center', title : '기타4', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal5', align:'center', title : '기타5', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal6', align:'center', title : '기타6', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal7', align:'center', title : '기타7', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal8', align:'center', title : '기타8', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal9', align:'center', title : '기타9', width: '100px',
					render : function(value, data, render, mapping){
						return value;
					},
					editable : function(value, data) {
						return '<div><input type="text" style="width:100%;height:22px;text-align:center;" value="'+value+'"/></div>';
					}
				}
    		gridColData.push(colData);
    		var colData = { key : 'afeG5EtcColVal10', align:'center', title : '기타10', width: '100px',
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
    		$('#'+g5AfeDsnGridId).alopexGrid({
            	paging : {
            		pagerSelect: [2000,5000]
					,hidePageList: true  // pager 중앙 삭제
					,pagerSelect: false
    			},
    			fullCompareForEditedState: true,
    			defaultColumnMapping:{
        			sorting : true
        		},
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
    		var colList = []

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

    			{ key : 'sysDuhCnt', align:'center', title : 'DUH(식수)', width: '100px'},
//    			{ key : 'sysRotnCnt', align:'center', title : 'ROTN', width: '100px'},
    			{ key : 'sysIvrCnt', align:'center', title : 'IVR', width: '100px'},
    			{ key : 'sysIvrrCnt', align:'center', title : 'IVRR', width: '100px'},
    			{ key : 'sysRtfCnt', align:'center', title : '정류기', width: '100px'},
    			{ key : 'sysBatryCnt', align:'center', title : '축전지', width: '100px'},
    			{ key : 'sysCbplCnt', align:'center', title : '분전반', width: '100px'},
    			{ key : 'sysArcnCnt', align:'center', title : '냉방기', width: '100px'},
    			{ key : 'sysEtcEqpFstCnt', align:'center', title : '기타1', width: '100px'},
    			{ key : 'sysEtcEqpScndCnt', align:'center', title : '기타2', width: '100px'},
    			{ key : 'sysEtcEqpThrdCnt', align:'center', title : '기타3', width: '100px'},
    			{ key : 'sysEtcEqpFothCnt', align:'center', title : '기타4', width: '100px'},
    			{ key : 'sysEtcEqpFithCnt', align:'center', title : '기타5', width: '100px'},

    			{ key : 'duhDuhCnt', align:'center', title : 'DUH(식수)', width: '100px'},
    			{ key : 'duhRotnCnt', align:'center', title : 'ROTN', width: '100px'},
    			{ key : 'duhIvcCnt', align:'center', title : 'IVC', width: '100px'},
    			{ key : 'duhIvrCnt', align:'center', title : 'IVR', width: '100px'},
    			{ key : 'duhIvrrCnt', align:'center', title : 'IVRR', width: '100px'},

    			{ key : 'rlyRotnCnt', align:'center', title : 'ROTN', width: '100px'},
    			{ key : 'rlyIvcCnt', align:'center', title : 'IVC', width: '100px'},
    			{ key : 'rlyIvrCnt', align:'center', title : 'IVR', width: '100px'},
    			{ key : 'rlyIvrrCnt', align:'center', title : 'IVRR', width: '100px'},

    			{ key : 'repceIvcCnt', align:'center', title : 'IVC', width: '100px'},
    			{ key : 'repceIvrCnt', align:'center', title : 'IVR', width: '100px'},
    			{ key : 'repceIvrrCnt', align:'center', title : 'IVRR', width: '100px'},

    			{ key : 'rtfCnt', align:'center', title : '정류기', width: '100px'},
    			{ key : 'batryCnt', align:'center', title : '축전지', width: '100px'},
    			{ key : 'cbplCnt', align:'center', title : '분전반', width: '100px'},
    			{ key : 'arcnCnt', align:'center', title : '냉방기', width: '100px'},
    			{ key : 'etcEqpFstCnt', align:'center', title : '기타1', width: '100px'},
    			{ key : 'etcEqpScndCnt', align:'center', title : '기타2', width: '100px'},
    			{ key : 'etcEqpThrdCnt', align:'center', title : '기타3', width: '100px'},
    			{ key : 'etcEqpFothCnt', align:'center', title : '기타4', width: '100px'},
    			{ key : 'etcEqpFithCnt', align:'center', title : '기타5', width: '100px'},
    			{ key : 'etcEqp6', align:'left', title : '기타6', width: '100px'},
    			{ key : 'etcEqp7', align:'left', title : '기타7', width: '100px'},
    			{ key : 'etcEqp8', align:'left', title : '기타8', width: '100px'},
    			{ key : 'etcEqp9', align:'left', title : '기타9', width: '100px'},
    			{ key : 'etcEqp10', align:'left', title : '기타10', width: '100px'}
    			];




        	var headerMappingN = [
     			 {fromIndex:5, toIndex:6, title:"AFE 구분"}
      			 ,{fromIndex:7, toIndex:18, title:"System 산출"}
      			 ,{fromIndex:8, toIndex:9, title:"전송장비"}
      			 ,{fromIndex:10, toIndex:18, title:"부대장비"}

      			 ,{fromIndex:19, toIndex:44, title:"수동 산출"}
      			 ,{fromIndex:20, toIndex:23, title:"DUH 수용 국사"}
      			 ,{fromIndex:24, toIndex:27, title:"중계노드"}
      			 ,{fromIndex:28, toIndex:30, title:"대개체"}
      			 ,{fromIndex:31, toIndex:39, title:"부대장비"}
    		   ];
        	//그리드 생성
    		$('#'+g5AfeDsnGridId).alopexGrid({
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
    	g5AfeDsnHideCol();
    }


    function g5AfeDsnHideCol() {
    	var ckGubun = $("input:radio[name=g5AfeDsnGubun][value='T']").is(":checked") ? true : false;

    	for(var i = 0; i < publicAfeG5EtcHideCol.length; i++){
			var upWord = publicAfeG5EtcHideCol[i].mtsoInvtItmVal;
	    	if (ckGubun) {
    			if (publicAfeG5EtcHideCol[i].mtsoInvtItmHidYn == 'N') {
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicAfeG5EtcHideCol[i].mtsoInvtItmNm}, upWord);
    			} else {
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, upWord);
    			}
	    	}
		}

		for(var i = 0; i < publicHideCol.length; i++){
			var upWord = publicHideCol[i].mtsoInvtItmVal;
	    	if (ckGubun) {
	    		for(var j = 0; j < publicAfeDgr.length; j++){

	    			var afeDgr  = publicAfeDgr[j].afeDgr;
    				var colNm1 = 'd' + afeDgr + 'Sys' + upWord;
    				var colNm2 = 'd' + afeDgr + upWord;
        			if (publicHideCol[i].mtsoInvtItmHidYn == 'N') {
        				//$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm1);
        				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm2);

        				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
        			} else {
        				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
        				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm2);
        			}
	    		}
	    	} else {
	    		var colNm1 = 'sys' + upWord;
				var colNm2 = upWord.replace('Etc','etc');
    			if (publicHideCol[i].mtsoInvtItmHidYn == 'N') {
    				//$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm1);
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm2);

    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
    			} else {
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm2);
    			}
	    	}
		}



    }


	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function g5AfeDsnSetSelectCode() {

    }

    function g5AfeDsnSetEventListener() {

    	$('#'+g5AfeDsnGridId).on('rowInlineEditEnd',function(e){
    		var param 	= AlopexGrid.parseEvent(e).data;
			var userId 	= $("#userId").val();
			var afeYr	= $("#afeYr").val();
			param.userId 	= userId;
			param.afeYr 	= afeYr;
			// return 값은 필요 없음.

			$('#'+g5AfeDsnGridId).alopexGrid('dataFlush', function(editedDataList){

				 var result = $.map(editedDataList, function(el, idx){ return el.mtsoInvtId;})

					if (result.length > 0) {



						httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5Inf', param, 'POST', '');

						var g5DtlList = [];

						var totDuhCnt = [];
						var totRotnCnt = [];
						var totIvcCnt = [];
						var totIvrCnt = [];
						var totIvrrCnt = [];


						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d1SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d1SysIvrCnt;
						var tmpIvrrCnt 			= param.d1SysIvrrCnt;
						var tmpRtfCnt 			= param.d1SysRtfCnt;
						var tmpBatryCnt 		= param.d1SysBatryCnt;
						var tmpCbplCnt 			= param.d1SysCbplCnt;
						var tmpArcnCnt 			= param.d1SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d1SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d1SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d1SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d1SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d1SysEtcEqpFithCnt;
						var tmpDtlList1 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '1', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};


						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d2SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d2SysIvrCnt;
						var tmpIvrrCnt 			= param.d2SysIvrrCnt;
						var tmpRtfCnt 			= param.d2SysRtfCnt;
						var tmpBatryCnt 		= param.d2SysBatryCnt;
						var tmpCbplCnt 			= param.d2SysCbplCnt;
						var tmpArcnCnt 			= param.d2SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d2SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d2SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d2SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d2SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d2SysEtcEqpFithCnt;
						var tmpDtlList2 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '2', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};

						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList2, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d3SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d3SysIvrCnt;
						var tmpIvrrCnt 			= param.d3SysIvrrCnt;
						var tmpRtfCnt 			= param.d3SysRtfCnt;
						var tmpBatryCnt 		= param.d3SysBatryCnt;
						var tmpCbplCnt 			= param.d3SysCbplCnt;
						var tmpArcnCnt 			= param.d3SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d3SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d3SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d3SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d3SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d3SysEtcEqpFithCnt;
						var tmpDtlList3 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '3', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList3, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d4SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d4SysIvrCnt;
						var tmpIvrrCnt 			= param.d4SysIvrrCnt;
						var tmpRtfCnt 			= param.d4SysRtfCnt;
						var tmpBatryCnt 		= param.d4SysBatryCnt;
						var tmpCbplCnt 			= param.d4SysCbplCnt;
						var tmpArcnCnt 			= param.d4SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d4SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d4SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d4SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d4SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d4SysEtcEqpFithCnt;
						var tmpDtlList4 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '4', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList4, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d5SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d5SysIvrCnt;
						var tmpIvrrCnt 			= param.d5SysIvrrCnt;
						var tmpRtfCnt 			= param.d5SysRtfCnt;
						var tmpBatryCnt 		= param.d5SysBatryCnt;
						var tmpCbplCnt 			= param.d5SysCbplCnt;
						var tmpArcnCnt 			= param.d5SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d5SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d5SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d5SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d5SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d5SysEtcEqpFithCnt;
						var tmpDtlList5 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '5', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList5, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d6SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d6SysIvrCnt;
						var tmpIvrrCnt 			= param.d6SysIvrrCnt;
						var tmpRtfCnt 			= param.d6SysRtfCnt;
						var tmpBatryCnt 		= param.d6SysBatryCnt;
						var tmpCbplCnt 			= param.d6SysCbplCnt;
						var tmpArcnCnt 			= param.d6SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d6SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d6SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d6SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d6SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d6SysEtcEqpFithCnt;
						var tmpDtlList6 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '6', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList6, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d7SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d7SysIvrCnt;
						var tmpIvrrCnt 			= param.d7SysIvrrCnt;
						var tmpRtfCnt 			= param.d7SysRtfCnt;
						var tmpBatryCnt 		= param.d7SysBatryCnt;
						var tmpCbplCnt 			= param.d7SysCbplCnt;
						var tmpArcnCnt 			= param.d7SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d7SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d7SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d7SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d7SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d7SysEtcEqpFithCnt;
						var tmpDtlList7 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '7', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList7, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d8SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d8SysIvrCnt;
						var tmpIvrrCnt 			= param.d8SysIvrrCnt;
						var tmpRtfCnt 			= param.d8SysRtfCnt;
						var tmpBatryCnt 		= param.d8SysBatryCnt;
						var tmpCbplCnt 			= param.d8SysCbplCnt;
						var tmpArcnCnt 			= param.d8SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d8SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d8SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d8SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d8SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d8SysEtcEqpFithCnt;
						var tmpDtlList8 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '8', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList8, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d9SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d9SysIvrCnt;
						var tmpIvrrCnt 			= param.d9SysIvrrCnt;
						var tmpRtfCnt 			= param.d9SysRtfCnt;
						var tmpBatryCnt 		= param.d9SysBatryCnt;
						var tmpCbplCnt 			= param.d9SysCbplCnt;
						var tmpArcnCnt 			= param.d9SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d9SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d9SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d9SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d9SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d9SysEtcEqpFithCnt;
						var tmpDtlList9 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '9', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList9, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SYS';
						var tmpDuhCnt 			= param.d10SysDuhCnt;
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= param.d10SysIvrCnt;
						var tmpIvrrCnt 			= param.d10SysIvrrCnt;
						var tmpRtfCnt 			= param.d10SysRtfCnt;
						var tmpBatryCnt 		= param.d10SysBatryCnt;
						var tmpCbplCnt 			= param.d10SysCbplCnt;
						var tmpArcnCnt 			= param.d10SysArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d10SysEtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d10SysEtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d10SysEtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d10SysEtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d10SysEtcEqpFithCnt;
						var tmpDtlList10 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '10', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList10, 'POST', '');
						for (var i = 0; i < publicAfeDgr.length; i++) {
							if (publicAfeDgr[i].afeDgr == "1") {
								g5DtlList.push(tmpDtlList1);
								totDuhCnt.push(tmpDtlList1.duhCnt);
								totRotnCnt.push(tmpDtlList1.rotnCnt);
								totIvcCnt.push(tmpDtlList1.ivcCnt);
								totIvrCnt.push(tmpDtlList1.ivrCnt);
								totIvrrCnt.push(tmpDtlList1.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "2") {
								g5DtlList.push(tmpDtlList2);
								totDuhCnt.push(tmpDtlList2.duhCnt);
								totRotnCnt.push(tmpDtlList2.rotnCnt);
								totIvcCnt.push(tmpDtlList2.ivcCnt);
								totIvrCnt.push(tmpDtlList2.ivrCnt);
								totIvrrCnt.push(tmpDtlList2.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "3") {
								g5DtlList.push(tmpDtlList3);

								totDuhCnt.push(tmpDtlList3.duhCnt);
								totRotnCnt.push(tmpDtlList3.rotnCnt);
								totIvcCnt.push(tmpDtlList3.ivcCnt);
								totIvrCnt.push(tmpDtlList3.ivrCnt);
								totIvrrCnt.push(tmpDtlList3.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "4") {
								g5DtlList.push(tmpDtlList4);

								totDuhCnt.push(tmpDtlList4.duhCnt);
								totRotnCnt.push(tmpDtlList4.rotnCnt);
								totIvcCnt.push(tmpDtlList4.ivcCnt);
								totIvrCnt.push(tmpDtlList4.ivrCnt);
								totIvrrCnt.push(tmpDtlList4.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "5") {
								g5DtlList.push(tmpDtlList5);

								totDuhCnt.push(tmpDtlList5.duhCnt);
								totRotnCnt.push(tmpDtlList5.rotnCnt);
								totIvcCnt.push(tmpDtlList5.ivcCnt);
								totIvrCnt.push(tmpDtlList5.ivrCnt);
								totIvrrCnt.push(tmpDtlList5.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "6") {
								g5DtlList.push(tmpDtlList6);

								totDuhCnt.push(tmpDtlList6.duhCnt);
								totRotnCnt.push(tmpDtlList6.rotnCnt);
								totIvcCnt.push(tmpDtlList6.ivcCnt);
								totIvrCnt.push(tmpDtlList6.ivrCnt);
								totIvrrCnt.push(tmpDtlList6.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "7") {
								g5DtlList.push(tmpDtlList7);

								totDuhCnt.push(tmpDtlList7.duhCnt);
								totRotnCnt.push(tmpDtlList7.rotnCnt);
								totIvcCnt.push(tmpDtlList7.ivcCnt);
								totIvrCnt.push(tmpDtlList7.ivrCnt);
								totIvrrCnt.push(tmpDtlList7.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "8") {
								g5DtlList.push(tmpDtlList8);

								totDuhCnt.push(tmpDtlList8.duhCnt);
								totRotnCnt.push(tmpDtlList8.rotnCnt);
								totIvcCnt.push(tmpDtlList8.ivcCnt);
								totIvrCnt.push(tmpDtlList8.ivrCnt);
								totIvrrCnt.push(tmpDtlList8.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "9") {
								g5DtlList.push(tmpDtlList9);

								totDuhCnt.push(tmpDtlList9.duhCnt);
								totRotnCnt.push(tmpDtlList9.rotnCnt);
								totIvcCnt.push(tmpDtlList9.ivcCnt);
								totIvrCnt.push(tmpDtlList9.ivrCnt);
								totIvrrCnt.push(tmpDtlList9.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "10") {
								g5DtlList.push(tmpDtlList10);

								totDuhCnt.push(tmpDtlList10.duhCnt);
								totRotnCnt.push(tmpDtlList10.rotnCnt);
								totIvcCnt.push(tmpDtlList10.ivcCnt);
								totIvrCnt.push(tmpDtlList10.ivrCnt);
								totIvrrCnt.push(tmpDtlList10.ivrrCnt);
							}
						}
			//
			//
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d1DuhDuhCnt;
						var tmpRotnCnt			= param.d1DuhRotnCnt;
						var tmpIvcCnt			= param.d1DuhIvcCnt;
						var tmpIvrCnt 			= param.d1DuhIvrCnt;
						var tmpIvrrCnt 			= param.d1DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList1 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '1', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList1, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d2DuhDuhCnt;
						var tmpRotnCnt			= param.d2DuhRotnCnt;
						var tmpIvcCnt			= param.d2DuhIvcCnt;
						var tmpIvrCnt 			= param.d2DuhIvrCnt;
						var tmpIvrrCnt 			= param.d2DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList2 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '2', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList2, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d3DuhDuhCnt;
						var tmpRotnCnt			= param.d3DuhRotnCnt;
						var tmpIvcCnt			= param.d3DuhIvcCnt;
						var tmpIvrCnt 			= param.d3DuhIvrCnt;
						var tmpIvrrCnt 			= param.d3DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList3 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '3', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList3, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d4DuhDuhCnt;
						var tmpRotnCnt			= param.d4DuhRotnCnt;
						var tmpIvcCnt			= param.d4DuhIvcCnt;
						var tmpIvrCnt 			= param.d4DuhIvrCnt;
						var tmpIvrrCnt 			= param.d4DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList4 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '4', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList4, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d5DuhDuhCnt;
						var tmpRotnCnt			= param.d5DuhRotnCnt;
						var tmpIvcCnt			= param.d5DuhIvcCnt;
						var tmpIvrCnt 			= param.d5DuhIvrCnt;
						var tmpIvrrCnt 			= param.d5DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList5 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '5', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList5, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d6DuhDuhCnt;
						var tmpRotnCnt			= param.d6DuhRotnCnt;
						var tmpIvcCnt			= param.d6DuhIvcCnt;
						var tmpIvrCnt 			= param.d6DuhIvrCnt;
						var tmpIvrrCnt 			= param.d6DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList6 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '6', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList6, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d7DuhDuhCnt;
						var tmpRotnCnt			= param.d7DuhRotnCnt;
						var tmpIvcCnt			= param.d7DuhIvcCnt;
						var tmpIvrCnt 			= param.d7DuhIvrCnt;
						var tmpIvrrCnt 			= param.d7DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList7 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '7', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList7, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d8DuhDuhCnt;
						var tmpRotnCnt			= param.d8DuhRotnCnt;
						var tmpIvcCnt			= param.d8DuhIvcCnt;
						var tmpIvrCnt 			= param.d8DuhIvrCnt;
						var tmpIvrrCnt 			= param.d8DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList8 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '8', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList8, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d9DuhDuhCnt;
						var tmpRotnCnt			= param.d9DuhRotnCnt;
						var tmpIvcCnt			= param.d9DuhIvcCnt;
						var tmpIvrCnt 			= param.d9DuhIvrCnt;
						var tmpIvrrCnt 			= param.d9DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList9 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '9', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList9, 'POST', '');
						var tmpAfeInvtDivCd 	= 'DUH';
						var tmpDuhCnt 			= param.d10DuhDuhCnt;
						var tmpRotnCnt			= param.d10DuhRotnCnt;
						var tmpIvcCnt			= param.d10DuhIvcCnt;
						var tmpIvrCnt 			= param.d10DuhIvrCnt;
						var tmpIvrrCnt 			= param.d10DuhIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList10 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '10', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList10, 'POST', '');

						for (var i = 0; i < publicAfeDgr.length; i++) {
							if (publicAfeDgr[i].afeDgr == "1") {
								g5DtlList.push(tmpDtlList1);
								totDuhCnt.push(tmpDtlList1.duhCnt);
								totRotnCnt.push(tmpDtlList1.rotnCnt);
								totIvcCnt.push(tmpDtlList1.ivcCnt);
								totIvrCnt.push(tmpDtlList1.ivrCnt);
								totIvrrCnt.push(tmpDtlList1.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "2") {
								g5DtlList.push(tmpDtlList2);
								totDuhCnt.push(tmpDtlList2.duhCnt);
								totRotnCnt.push(tmpDtlList2.rotnCnt);
								totIvcCnt.push(tmpDtlList2.ivcCnt);
								totIvrCnt.push(tmpDtlList2.ivrCnt);
								totIvrrCnt.push(tmpDtlList2.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "3") {
								g5DtlList.push(tmpDtlList3);

								totDuhCnt.push(tmpDtlList3.duhCnt);
								totRotnCnt.push(tmpDtlList3.rotnCnt);
								totIvcCnt.push(tmpDtlList3.ivcCnt);
								totIvrCnt.push(tmpDtlList3.ivrCnt);
								totIvrrCnt.push(tmpDtlList3.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "4") {
								g5DtlList.push(tmpDtlList4);

								totDuhCnt.push(tmpDtlList4.duhCnt);
								totRotnCnt.push(tmpDtlList4.rotnCnt);
								totIvcCnt.push(tmpDtlList4.ivcCnt);
								totIvrCnt.push(tmpDtlList4.ivrCnt);
								totIvrrCnt.push(tmpDtlList4.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "5") {
								g5DtlList.push(tmpDtlList5);

								totDuhCnt.push(tmpDtlList5.duhCnt);
								totRotnCnt.push(tmpDtlList5.rotnCnt);
								totIvcCnt.push(tmpDtlList5.ivcCnt);
								totIvrCnt.push(tmpDtlList5.ivrCnt);
								totIvrrCnt.push(tmpDtlList5.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "6") {
								g5DtlList.push(tmpDtlList6);

								totDuhCnt.push(tmpDtlList6.duhCnt);
								totRotnCnt.push(tmpDtlList6.rotnCnt);
								totIvcCnt.push(tmpDtlList6.ivcCnt);
								totIvrCnt.push(tmpDtlList6.ivrCnt);
								totIvrrCnt.push(tmpDtlList6.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "7") {
								g5DtlList.push(tmpDtlList7);

								totDuhCnt.push(tmpDtlList7.duhCnt);
								totRotnCnt.push(tmpDtlList7.rotnCnt);
								totIvcCnt.push(tmpDtlList7.ivcCnt);
								totIvrCnt.push(tmpDtlList7.ivrCnt);
								totIvrrCnt.push(tmpDtlList7.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "8") {
								g5DtlList.push(tmpDtlList8);

								totDuhCnt.push(tmpDtlList8.duhCnt);
								totRotnCnt.push(tmpDtlList8.rotnCnt);
								totIvcCnt.push(tmpDtlList8.ivcCnt);
								totIvrCnt.push(tmpDtlList8.ivrCnt);
								totIvrrCnt.push(tmpDtlList8.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "9") {
								g5DtlList.push(tmpDtlList9);

								totDuhCnt.push(tmpDtlList9.duhCnt);
								totRotnCnt.push(tmpDtlList9.rotnCnt);
								totIvcCnt.push(tmpDtlList9.ivcCnt);
								totIvrCnt.push(tmpDtlList9.ivrCnt);
								totIvrrCnt.push(tmpDtlList9.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "10") {
								g5DtlList.push(tmpDtlList10);

								totDuhCnt.push(tmpDtlList10.duhCnt);
								totRotnCnt.push(tmpDtlList10.rotnCnt);
								totIvcCnt.push(tmpDtlList10.ivcCnt);
								totIvrCnt.push(tmpDtlList10.ivrCnt);
								totIvrrCnt.push(tmpDtlList10.ivrrCnt);
							}
						}





			//			for (var i = 0; i < publicAfeDgr.length; i++) {
			//				if (publicAfeDgr[i].afeDgr == "1") {
			//					g5DtlList.push(tmpDtlList1);
			//				} else if (publicAfeDgr[i].afeDgr == "2") {
			//					g5DtlList.push(tmpDtlList2);
			//				} else if (publicAfeDgr[i].afeDgr == "3") {
			//					g5DtlList.push(tmpDtlList3);
			//				} else if (publicAfeDgr[i].afeDgr == "4") {
			//					g5DtlList.push(tmpDtlList4);
			//				} else if (publicAfeDgr[i].afeDgr == "5") {
			//					g5DtlList.push(tmpDtlList5);
			//				} else if (publicAfeDgr[i].afeDgr == "6") {
			//					g5DtlList.push(tmpDtlList6);
			//				} else if (publicAfeDgr[i].afeDgr == "7") {
			//					g5DtlList.push(tmpDtlList7);
			//				} else if (publicAfeDgr[i].afeDgr == "8") {
			//					g5DtlList.push(tmpDtlList8);
			//				} else if (publicAfeDgr[i].afeDgr == "9") {
			//					g5DtlList.push(tmpDtlList9);
			//				} else if (publicAfeDgr[i].afeDgr == "10") {
			//					g5DtlList.push(tmpDtlList10);
			//				}
			//			}


						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d1RlyRotnCnt;
						var tmpIvcCnt			= param.d1RlyIvcCnt;
						var tmpIvrCnt 			= param.d1RlyIvrCnt;
						var tmpIvrrCnt 			= param.d1RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList1 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '1', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList1, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d2RlyRotnCnt;
						var tmpIvcCnt			= param.d2RlyIvcCnt;
						var tmpIvrCnt 			= param.d2RlyIvrCnt;
						var tmpIvrrCnt 			= param.d2RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList2 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '2', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList2, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d3RlyRotnCnt;
						var tmpIvcCnt			= param.d3RlyIvcCnt;
						var tmpIvrCnt 			= param.d3RlyIvrCnt;
						var tmpIvrrCnt 			= param.d3RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList3 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '3', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList3, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d4RlyRotnCnt;
						var tmpIvcCnt			= param.d4RlyIvcCnt;
						var tmpIvrCnt 			= param.d4RlyIvrCnt;
						var tmpIvrrCnt 			= param.d4RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList4 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '4', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList4, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d5RlyRotnCnt;
						var tmpIvcCnt			= param.d5RlyIvcCnt;
						var tmpIvrCnt 			= param.d5RlyIvrCnt;
						var tmpIvrrCnt 			= param.d5RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList5 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '5', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList5, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d6RlyRotnCnt;
						var tmpIvcCnt			= param.d6RlyIvcCnt;
						var tmpIvrCnt 			= param.d6RlyIvrCnt;
						var tmpIvrrCnt 			= param.d6RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList6 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '6', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList6, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d7RlyRotnCnt;
						var tmpIvcCnt			= param.d7RlyIvcCnt;
						var tmpIvrCnt 			= param.d7RlyIvrCnt;
						var tmpIvrrCnt 			= param.d7RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList7 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '7', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList7, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d8RlyRotnCnt;
						var tmpIvcCnt			= param.d8RlyIvcCnt;
						var tmpIvrCnt 			= param.d8RlyIvrCnt;
						var tmpIvrrCnt 			= param.d8RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList8 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '8', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList8, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d9RlyRotnCnt;
						var tmpIvcCnt			= param.d9RlyIvcCnt;
						var tmpIvrCnt 			= param.d9RlyIvrCnt;
						var tmpIvrrCnt 			= param.d9RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList9 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '9', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList9, 'POST', '');
						var tmpAfeInvtDivCd 	= 'RLY';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= param.d10RlyRotnCnt;
						var tmpIvcCnt			= param.d10RlyIvcCnt;
						var tmpIvrCnt 			= param.d10RlyIvrCnt;
						var tmpIvrrCnt 			= param.d10RlyIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList10 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '10', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList10, 'POST', '');

						for (var i = 0; i < publicAfeDgr.length; i++) {
							if (publicAfeDgr[i].afeDgr == "1") {
								g5DtlList.push(tmpDtlList1);
								totDuhCnt.push(tmpDtlList1.duhCnt);
								totRotnCnt.push(tmpDtlList1.rotnCnt);
								totIvcCnt.push(tmpDtlList1.ivcCnt);
								totIvrCnt.push(tmpDtlList1.ivrCnt);
								totIvrrCnt.push(tmpDtlList1.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "2") {
								g5DtlList.push(tmpDtlList2);
								totDuhCnt.push(tmpDtlList2.duhCnt);
								totRotnCnt.push(tmpDtlList2.rotnCnt);
								totIvcCnt.push(tmpDtlList2.ivcCnt);
								totIvrCnt.push(tmpDtlList2.ivrCnt);
								totIvrrCnt.push(tmpDtlList2.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "3") {
								g5DtlList.push(tmpDtlList3);

								totDuhCnt.push(tmpDtlList3.duhCnt);
								totRotnCnt.push(tmpDtlList3.rotnCnt);
								totIvcCnt.push(tmpDtlList3.ivcCnt);
								totIvrCnt.push(tmpDtlList3.ivrCnt);
								totIvrrCnt.push(tmpDtlList3.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "4") {
								g5DtlList.push(tmpDtlList4);

								totDuhCnt.push(tmpDtlList4.duhCnt);
								totRotnCnt.push(tmpDtlList4.rotnCnt);
								totIvcCnt.push(tmpDtlList4.ivcCnt);
								totIvrCnt.push(tmpDtlList4.ivrCnt);
								totIvrrCnt.push(tmpDtlList4.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "5") {
								g5DtlList.push(tmpDtlList5);

								totDuhCnt.push(tmpDtlList5.duhCnt);
								totRotnCnt.push(tmpDtlList5.rotnCnt);
								totIvcCnt.push(tmpDtlList5.ivcCnt);
								totIvrCnt.push(tmpDtlList5.ivrCnt);
								totIvrrCnt.push(tmpDtlList5.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "6") {
								g5DtlList.push(tmpDtlList6);

								totDuhCnt.push(tmpDtlList6.duhCnt);
								totRotnCnt.push(tmpDtlList6.rotnCnt);
								totIvcCnt.push(tmpDtlList6.ivcCnt);
								totIvrCnt.push(tmpDtlList6.ivrCnt);
								totIvrrCnt.push(tmpDtlList6.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "7") {
								g5DtlList.push(tmpDtlList7);

								totDuhCnt.push(tmpDtlList7.duhCnt);
								totRotnCnt.push(tmpDtlList7.rotnCnt);
								totIvcCnt.push(tmpDtlList7.ivcCnt);
								totIvrCnt.push(tmpDtlList7.ivrCnt);
								totIvrrCnt.push(tmpDtlList7.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "8") {
								g5DtlList.push(tmpDtlList8);

								totDuhCnt.push(tmpDtlList8.duhCnt);
								totRotnCnt.push(tmpDtlList8.rotnCnt);
								totIvcCnt.push(tmpDtlList8.ivcCnt);
								totIvrCnt.push(tmpDtlList8.ivrCnt);
								totIvrrCnt.push(tmpDtlList8.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "9") {
								g5DtlList.push(tmpDtlList9);

								totDuhCnt.push(tmpDtlList9.duhCnt);
								totRotnCnt.push(tmpDtlList9.rotnCnt);
								totIvcCnt.push(tmpDtlList9.ivcCnt);
								totIvrCnt.push(tmpDtlList9.ivrCnt);
								totIvrrCnt.push(tmpDtlList9.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "10") {
								g5DtlList.push(tmpDtlList10);

								totDuhCnt.push(tmpDtlList10.duhCnt);
								totRotnCnt.push(tmpDtlList10.rotnCnt);
								totIvcCnt.push(tmpDtlList10.ivcCnt);
								totIvrCnt.push(tmpDtlList10.ivrCnt);
								totIvrrCnt.push(tmpDtlList10.ivrrCnt);
							}
						}


			//			for (var i = 0; i < publicAfeDgr.length; i++) {
			//				if (publicAfeDgr[i].afeDgr == "1") {
			//					g5DtlList.push(tmpDtlList1);
			//				} else if (publicAfeDgr[i].afeDgr == "2") {
			//					g5DtlList.push(tmpDtlList2);
			//				} else if (publicAfeDgr[i].afeDgr == "3") {
			//					g5DtlList.push(tmpDtlList3);
			//				} else if (publicAfeDgr[i].afeDgr == "4") {
			//					g5DtlList.push(tmpDtlList4);
			//				} else if (publicAfeDgr[i].afeDgr == "5") {
			//					g5DtlList.push(tmpDtlList5);
			//				} else if (publicAfeDgr[i].afeDgr == "6") {
			//					g5DtlList.push(tmpDtlList6);
			//				} else if (publicAfeDgr[i].afeDgr == "7") {
			//					g5DtlList.push(tmpDtlList7);
			//				} else if (publicAfeDgr[i].afeDgr == "8") {
			//					g5DtlList.push(tmpDtlList8);
			//				} else if (publicAfeDgr[i].afeDgr == "9") {
			//					g5DtlList.push(tmpDtlList9);
			//				} else if (publicAfeDgr[i].afeDgr == "10") {
			//					g5DtlList.push(tmpDtlList10);
			//				}
			//			}


						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d1RepceIvcCnt;
						var tmpIvrCnt 			= param.d1RepceIvrCnt;
						var tmpIvrrCnt 			= param.d1RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList1 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '1', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList1, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d2RepceIvcCnt;
						var tmpIvrCnt 			= param.d2RepceIvrCnt;
						var tmpIvrrCnt 			= param.d2RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList2 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '2', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList2, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d3RepceIvcCnt;
						var tmpIvrCnt 			= param.d3RepceIvrCnt;
						var tmpIvrrCnt 			= param.d3RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList3 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '3', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList3, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d4RepceIvcCnt;
						var tmpIvrCnt 			= param.d4RepceIvrCnt;
						var tmpIvrrCnt 			= param.d4RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList4 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '4', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList4, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d5RepceIvcCnt;
						var tmpIvrCnt 			= param.d5RepceIvrCnt;
						var tmpIvrrCnt 			= param.d5RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList5 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '5', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList5, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d6RepceIvcCnt;
						var tmpIvrCnt 			= param.d6RepceIvrCnt;
						var tmpIvrrCnt 			= param.d6RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList6 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '6', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList6, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d7RepceIvcCnt;
						var tmpIvrCnt 			= param.d7RepceIvrCnt;
						var tmpIvrrCnt 			= param.d7RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList7 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '7', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList7, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d8RepceIvcCnt;
						var tmpIvrCnt 			= param.d8RepceIvrCnt;
						var tmpIvrrCnt 			= param.d8RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList8 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '8', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList8, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d9RepceIvcCnt;
						var tmpIvrCnt 			= param.d9RepceIvrCnt;
						var tmpIvrrCnt 			= param.d9RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList9 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '9', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList9, 'POST', '');
						var tmpAfeInvtDivCd 	= 'REPCE';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= param.d10RepceIvcCnt;
						var tmpIvrCnt 			= param.d10RepceIvrCnt;
						var tmpIvrrCnt 			= param.d10RepceIvrrCnt;
						var tmpRtfCnt 			= '';
						var tmpBatryCnt 		= '';
						var tmpCbplCnt 			= '';
						var tmpArcnCnt 			= '';
						var tmpEtcEqpFstCnt 	= '';
						var tmpEtcEqpScndCnt 	= '';
						var tmpEtcEqpThrdCnt 	= '';
						var tmpEtcEqpFothCnt 	= '';
						var tmpEtcEqpFithCnt 	= '';
						var tmpDtlList10 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '10', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList10, 'POST', '');

						for (var i = 0; i < publicAfeDgr.length; i++) {
							if (publicAfeDgr[i].afeDgr == "1") {
								g5DtlList.push(tmpDtlList1);
								totDuhCnt.push(tmpDtlList1.duhCnt);
								totRotnCnt.push(tmpDtlList1.rotnCnt);
								totIvcCnt.push(tmpDtlList1.ivcCnt);
								totIvrCnt.push(tmpDtlList1.ivrCnt);
								totIvrrCnt.push(tmpDtlList1.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "2") {
								g5DtlList.push(tmpDtlList2);
								totDuhCnt.push(tmpDtlList2.duhCnt);
								totRotnCnt.push(tmpDtlList2.rotnCnt);
								totIvcCnt.push(tmpDtlList2.ivcCnt);
								totIvrCnt.push(tmpDtlList2.ivrCnt);
								totIvrrCnt.push(tmpDtlList2.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "3") {
								g5DtlList.push(tmpDtlList3);

								totDuhCnt.push(tmpDtlList3.duhCnt);
								totRotnCnt.push(tmpDtlList3.rotnCnt);
								totIvcCnt.push(tmpDtlList3.ivcCnt);
								totIvrCnt.push(tmpDtlList3.ivrCnt);
								totIvrrCnt.push(tmpDtlList3.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "4") {
								g5DtlList.push(tmpDtlList4);

								totDuhCnt.push(tmpDtlList4.duhCnt);
								totRotnCnt.push(tmpDtlList4.rotnCnt);
								totIvcCnt.push(tmpDtlList4.ivcCnt);
								totIvrCnt.push(tmpDtlList4.ivrCnt);
								totIvrrCnt.push(tmpDtlList4.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "5") {
								g5DtlList.push(tmpDtlList5);

								totDuhCnt.push(tmpDtlList5.duhCnt);
								totRotnCnt.push(tmpDtlList5.rotnCnt);
								totIvcCnt.push(tmpDtlList5.ivcCnt);
								totIvrCnt.push(tmpDtlList5.ivrCnt);
								totIvrrCnt.push(tmpDtlList5.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "6") {
								g5DtlList.push(tmpDtlList6);

								totDuhCnt.push(tmpDtlList6.duhCnt);
								totRotnCnt.push(tmpDtlList6.rotnCnt);
								totIvcCnt.push(tmpDtlList6.ivcCnt);
								totIvrCnt.push(tmpDtlList6.ivrCnt);
								totIvrrCnt.push(tmpDtlList6.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "7") {
								g5DtlList.push(tmpDtlList7);

								totDuhCnt.push(tmpDtlList7.duhCnt);
								totRotnCnt.push(tmpDtlList7.rotnCnt);
								totIvcCnt.push(tmpDtlList7.ivcCnt);
								totIvrCnt.push(tmpDtlList7.ivrCnt);
								totIvrrCnt.push(tmpDtlList7.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "8") {
								g5DtlList.push(tmpDtlList8);

								totDuhCnt.push(tmpDtlList8.duhCnt);
								totRotnCnt.push(tmpDtlList8.rotnCnt);
								totIvcCnt.push(tmpDtlList8.ivcCnt);
								totIvrCnt.push(tmpDtlList8.ivrCnt);
								totIvrrCnt.push(tmpDtlList8.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "9") {
								g5DtlList.push(tmpDtlList9);

								totDuhCnt.push(tmpDtlList9.duhCnt);
								totRotnCnt.push(tmpDtlList9.rotnCnt);
								totIvcCnt.push(tmpDtlList9.ivcCnt);
								totIvrCnt.push(tmpDtlList9.ivrCnt);
								totIvrrCnt.push(tmpDtlList9.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "10") {
								g5DtlList.push(tmpDtlList10);

								totDuhCnt.push(tmpDtlList10.duhCnt);
								totRotnCnt.push(tmpDtlList10.rotnCnt);
								totIvcCnt.push(tmpDtlList10.ivcCnt);
								totIvrCnt.push(tmpDtlList10.ivrCnt);
								totIvrrCnt.push(tmpDtlList10.ivrrCnt);
							}
						}


			//			for (var i = 0; i < publicAfeDgr.length; i++) {
			//				if (publicAfeDgr[i].afeDgr == "1") {
			//					g5DtlList.push(tmpDtlList1);
			//				} else if (publicAfeDgr[i].afeDgr == "2") {
			//					g5DtlList.push(tmpDtlList2);
			//				} else if (publicAfeDgr[i].afeDgr == "3") {
			//					g5DtlList.push(tmpDtlList3);
			//				} else if (publicAfeDgr[i].afeDgr == "4") {
			//					g5DtlList.push(tmpDtlList4);
			//				} else if (publicAfeDgr[i].afeDgr == "5") {
			//					g5DtlList.push(tmpDtlList5);
			//				} else if (publicAfeDgr[i].afeDgr == "6") {
			//					g5DtlList.push(tmpDtlList6);
			//				} else if (publicAfeDgr[i].afeDgr == "7") {
			//					g5DtlList.push(tmpDtlList7);
			//				} else if (publicAfeDgr[i].afeDgr == "8") {
			//					g5DtlList.push(tmpDtlList8);
			//				} else if (publicAfeDgr[i].afeDgr == "9") {
			//					g5DtlList.push(tmpDtlList9);
			//				} else if (publicAfeDgr[i].afeDgr == "10") {
			//					g5DtlList.push(tmpDtlList10);
			//				}
			//			}


						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d1RtfCnt;
						var tmpBatryCnt 		= param.d1BatryCnt;
						var tmpCbplCnt 			= param.d1CbplCnt;
						var tmpArcnCnt 			= param.d1ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d1EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d1EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d1EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d1EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d1EtcEqpFithCnt;
						var tmpEtcEqp6 			= param.d1EtcEqp6;
						var tmpEtcEqp7 			= param.d1EtcEqp7;
						var tmpEtcEqp8 			= param.d1EtcEqp8;
						var tmpEtcEqp9 			= param.d1EtcEqp9;
						var tmpEtcEqp10 		= param.d1EtcEqp10;

						var tmpDtlList1 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '1', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList1, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d2RtfCnt;
						var tmpBatryCnt 		= param.d2BatryCnt;
						var tmpCbplCnt 			= param.d2CbplCnt;
						var tmpArcnCnt 			= param.d2ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d2EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d2EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d2EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d2EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d2EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d2EtcEqp6;
						var tmpEtcEqp7 			= param.d2EtcEqp7;
						var tmpEtcEqp8 			= param.d2EtcEqp8;
						var tmpEtcEqp9 			= param.d2EtcEqp9;
						var tmpEtcEqp10 		= param.d2EtcEqp10;

						var tmpDtlList2 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '2', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList2, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d3RtfCnt;
						var tmpBatryCnt 		= param.d3BatryCnt;
						var tmpCbplCnt 			= param.d3CbplCnt;
						var tmpArcnCnt 			= param.d3ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d3EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d3EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d3EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d3EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d3EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d3EtcEqp6;
						var tmpEtcEqp7 			= param.d3EtcEqp7;
						var tmpEtcEqp8 			= param.d3EtcEqp8;
						var tmpEtcEqp9 			= param.d3EtcEqp9;
						var tmpEtcEqp10 		= param.d3EtcEqp10;

						var tmpDtlList3 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '3', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList3, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d4RtfCnt;
						var tmpBatryCnt 		= param.d4BatryCnt;
						var tmpCbplCnt 			= param.d4CbplCnt;
						var tmpArcnCnt 			= param.d4ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d4EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d4EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d4EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d4EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d4EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d4EtcEqp6;
						var tmpEtcEqp7 			= param.d4EtcEqp7;
						var tmpEtcEqp8 			= param.d4EtcEqp8;
						var tmpEtcEqp9 			= param.d4EtcEqp9;
						var tmpEtcEqp10 		= param.d4EtcEqp10;

						var tmpDtlList4 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '4', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList4, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d5RtfCnt;
						var tmpBatryCnt 		= param.d5BatryCnt;
						var tmpCbplCnt 			= param.d5CbplCnt;
						var tmpArcnCnt 			= param.d5ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d5EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d5EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d5EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d5EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d5EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d5EtcEqp6;
						var tmpEtcEqp7 			= param.d5EtcEqp7;
						var tmpEtcEqp8 			= param.d5EtcEqp8;
						var tmpEtcEqp9 			= param.d5EtcEqp9;
						var tmpEtcEqp10 		= param.d5EtcEqp10;

						var tmpDtlList5 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '5', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList5, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d6RtfCnt;
						var tmpBatryCnt 		= param.d6BatryCnt;
						var tmpCbplCnt 			= param.d6CbplCnt;
						var tmpArcnCnt 			= param.d6ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d6EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d6EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d6EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d6EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d6EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d6EtcEqp6;
						var tmpEtcEqp7 			= param.d6EtcEqp7;
						var tmpEtcEqp8 			= param.d6EtcEqp8;
						var tmpEtcEqp9 			= param.d6EtcEqp9;
						var tmpEtcEqp10 		= param.d6EtcEqp10;

						var tmpDtlList6 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '6', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList6, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d7RtfCnt;
						var tmpBatryCnt 		= param.d7BatryCnt;
						var tmpCbplCnt 			= param.d7CbplCnt;
						var tmpArcnCnt 			= param.d7ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d7EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d7EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d7EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d7EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d7EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d7EtcEqp6;
						var tmpEtcEqp7 			= param.d7EtcEqp7;
						var tmpEtcEqp8 			= param.d7EtcEqp8;
						var tmpEtcEqp9 			= param.d7EtcEqp9;
						var tmpEtcEqp10 		= param.d7EtcEqp10;

						var tmpDtlList7 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '7', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList7, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d8RtfCnt;
						var tmpBatryCnt 		= param.d8BatryCnt;
						var tmpCbplCnt 			= param.d8CbplCnt;
						var tmpArcnCnt 			= param.d8ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d8EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d8EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d8EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d8EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d8EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d8EtcEqp6;
						var tmpEtcEqp7 			= param.d8EtcEqp7;
						var tmpEtcEqp8 			= param.d8EtcEqp8;
						var tmpEtcEqp9 			= param.d8EtcEqp9;
						var tmpEtcEqp10 		= param.d8EtcEqp10;

						var tmpDtlList8 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '8', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList8, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d9RtfCnt;
						var tmpBatryCnt 		= param.d9BatryCnt;
						var tmpCbplCnt 			= param.d9CbplCnt;
						var tmpArcnCnt 			= param.d9ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d9EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d9EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d9EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d9EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d9EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d9EtcEqp6;
						var tmpEtcEqp7 			= param.d9EtcEqp7;
						var tmpEtcEqp8 			= param.d9EtcEqp8;
						var tmpEtcEqp9 			= param.d9EtcEqp9;
						var tmpEtcEqp10 		= param.d9EtcEqp10;

						var tmpDtlList9 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '9', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList9, 'POST', '');
						var tmpAfeInvtDivCd 	= 'SBEQP';
						var tmpDuhCnt 			= '';
						var tmpRotnCnt			= '';
						var tmpIvcCnt			= '';
						var tmpIvrCnt 			= '';
						var tmpIvrrCnt 			= '';
						var tmpRtfCnt 			= param.d10RtfCnt;
						var tmpBatryCnt 		= param.d10BatryCnt;
						var tmpCbplCnt 			= param.d10CbplCnt;
						var tmpArcnCnt 			= param.d10ArcnCnt;
						var tmpEtcEqpFstCnt 	= param.d10EtcEqpFstCnt;
						var tmpEtcEqpScndCnt 	= param.d10EtcEqpScndCnt;
						var tmpEtcEqpThrdCnt 	= param.d10EtcEqpThrdCnt;
						var tmpEtcEqpFothCnt 	= param.d10EtcEqpFothCnt;
						var tmpEtcEqpFithCnt 	= param.d10EtcEqpFithCnt;

						var tmpEtcEqp6 			= param.d10EtcEqp6;
						var tmpEtcEqp7 			= param.d10EtcEqp7;
						var tmpEtcEqp8 			= param.d10EtcEqp8;
						var tmpEtcEqp9 			= param.d10EtcEqp9;
						var tmpEtcEqp10 		= param.d10EtcEqp10;


						var tmpDtlList10 = {
								mtsoInvtId : param.mtsoInvtId, afeYr : afeYr, afeDgr : '10', afeInvtDivCd : tmpAfeInvtDivCd, userId : userId,
								duhCnt : tmpDuhCnt, rotnCnt : tmpRotnCnt, ivcCnt : tmpIvcCnt, ivrCnt : tmpIvrCnt, ivrrCnt : tmpIvrrCnt,
								rtfCnt : tmpRtfCnt, batryCnt : tmpBatryCnt, cbplCnt : tmpCbplCnt, arcnCnt : tmpArcnCnt,
								etcEqpFstCnt : tmpEtcEqpFstCnt, etcEqpScndCnt : tmpEtcEqpScndCnt, etcEqpThrdCnt : tmpEtcEqpThrdCnt, etcEqpFothCnt : tmpEtcEqpFothCnt, etcEqpFithCnt : tmpEtcEqpFithCnt,
								etcEqp6 : tmpEtcEqp6, etcEqp7 : tmpEtcEqp7, etcEqp8 : tmpEtcEqp8, etcEqp9 : tmpEtcEqp9, etcEqp10 : tmpEtcEqp10
						};
						//httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', tmpDtlList10, 'POST', '');
						for (var i = 0; i < publicAfeDgr.length; i++) {
							if (publicAfeDgr[i].afeDgr == "1") {
								g5DtlList.push(tmpDtlList1);
								totDuhCnt.push(tmpDtlList1.duhCnt);
								totRotnCnt.push(tmpDtlList1.rotnCnt);
								totIvcCnt.push(tmpDtlList1.ivcCnt);
								totIvrCnt.push(tmpDtlList1.ivrCnt);
								totIvrrCnt.push(tmpDtlList1.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "2") {
								g5DtlList.push(tmpDtlList2);
								totDuhCnt.push(tmpDtlList2.duhCnt);
								totRotnCnt.push(tmpDtlList2.rotnCnt);
								totIvcCnt.push(tmpDtlList2.ivcCnt);
								totIvrCnt.push(tmpDtlList2.ivrCnt);
								totIvrrCnt.push(tmpDtlList2.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "3") {
								g5DtlList.push(tmpDtlList3);

								totDuhCnt.push(tmpDtlList3.duhCnt);
								totRotnCnt.push(tmpDtlList3.rotnCnt);
								totIvcCnt.push(tmpDtlList3.ivcCnt);
								totIvrCnt.push(tmpDtlList3.ivrCnt);
								totIvrrCnt.push(tmpDtlList3.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "4") {
								g5DtlList.push(tmpDtlList4);

								totDuhCnt.push(tmpDtlList4.duhCnt);
								totRotnCnt.push(tmpDtlList4.rotnCnt);
								totIvcCnt.push(tmpDtlList4.ivcCnt);
								totIvrCnt.push(tmpDtlList4.ivrCnt);
								totIvrrCnt.push(tmpDtlList4.ivrrCnt);
							} else if (publicAfeDgr[i].afeDgr == "5") {
								g5DtlList.push(tmpDtlList5);

								totDuhCnt.push(tmpDtlList5.duhCnt);
								totRotnCnt.push(tmpDtlList5.rotnCnt);
								totIvcCnt.push(tmpDtlList5.ivcCnt);
								totIvrCnt.push(tmpDtlList5.ivrCnt);
								totIvrrCnt.push(tmpDtlList5.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "6") {
								g5DtlList.push(tmpDtlList6);

								totDuhCnt.push(tmpDtlList6.duhCnt);
								totRotnCnt.push(tmpDtlList6.rotnCnt);
								totIvcCnt.push(tmpDtlList6.ivcCnt);
								totIvrCnt.push(tmpDtlList6.ivrCnt);
								totIvrrCnt.push(tmpDtlList6.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "7") {
								g5DtlList.push(tmpDtlList7);

								totDuhCnt.push(tmpDtlList7.duhCnt);
								totRotnCnt.push(tmpDtlList7.rotnCnt);
								totIvcCnt.push(tmpDtlList7.ivcCnt);
								totIvrCnt.push(tmpDtlList7.ivrCnt);
								totIvrrCnt.push(tmpDtlList7.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "8") {
								g5DtlList.push(tmpDtlList8);

								totDuhCnt.push(tmpDtlList8.duhCnt);
								totRotnCnt.push(tmpDtlList8.rotnCnt);
								totIvcCnt.push(tmpDtlList8.ivcCnt);
								totIvrCnt.push(tmpDtlList8.ivrCnt);
								totIvrrCnt.push(tmpDtlList8.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "9") {
								g5DtlList.push(tmpDtlList9);

								totDuhCnt.push(tmpDtlList9.duhCnt);
								totRotnCnt.push(tmpDtlList9.rotnCnt);
								totIvcCnt.push(tmpDtlList9.ivcCnt);
								totIvrCnt.push(tmpDtlList9.ivrCnt);
								totIvrrCnt.push(tmpDtlList9.ivrrCnt);

							} else if (publicAfeDgr[i].afeDgr == "10") {
								g5DtlList.push(tmpDtlList10);

								totDuhCnt.push(tmpDtlList10.duhCnt);
								totRotnCnt.push(tmpDtlList10.rotnCnt);
								totIvcCnt.push(tmpDtlList10.ivcCnt);
								totIvrCnt.push(tmpDtlList10.ivrCnt);
								totIvrrCnt.push(tmpDtlList10.ivrrCnt);
							}
						}

			//			for (var i = 0; i < publicAfeDgr.length; i++) {
			//				if (publicAfeDgr[i].afeDgr == "1") {
			//					g5DtlList.push(tmpDtlList1);
			//				} else if (publicAfeDgr[i].afeDgr == "2") {
			//					g5DtlList.push(tmpDtlList2);
			//				} else if (publicAfeDgr[i].afeDgr == "3") {
			//					g5DtlList.push(tmpDtlList3);
			//				} else if (publicAfeDgr[i].afeDgr == "4") {
			//					g5DtlList.push(tmpDtlList4);
			//				} else if (publicAfeDgr[i].afeDgr == "5") {
			//					g5DtlList.push(tmpDtlList5);
			//				} else if (publicAfeDgr[i].afeDgr == "6") {
			//					g5DtlList.push(tmpDtlList6);
			//				} else if (publicAfeDgr[i].afeDgr == "7") {
			//					g5DtlList.push(tmpDtlList7);
			//				} else if (publicAfeDgr[i].afeDgr == "8") {
			//					g5DtlList.push(tmpDtlList8);
			//				} else if (publicAfeDgr[i].afeDgr == "9") {
			//					g5DtlList.push(tmpDtlList9);
			//				} else if (publicAfeDgr[i].afeDgr == "10") {
			//					g5DtlList.push(tmpDtlList10);
			//				}
			//			}

						if (g5DtlList == null || g5DtlList == undefined || g5DtlList == "") {

						} else {
							var tmpTotDuhCnt = 0;
							var filtered = totDuhCnt.filter(function(el){ return el != ''; });
							for (var i = 0; i < filtered.length; i++) {
								tmpTotDuhCnt += setIsNaNCheck(parseInt(filtered[i]));
							}
			//
							var tmpTotRotnCnt = 0;
							var filtered = totRotnCnt.filter(function(el){ return el != ''; });
							for (var i = 0; i < filtered.length; i++) {
								tmpTotRotnCnt += setIsNaNCheck(parseInt(filtered[i]));
							}
			//
							var tmpTotIvcCnt = 0;
							var filtered = totIvcCnt.filter(function(el){ return el != ''; });
							for (var i = 0; i < filtered.length; i++) {
								tmpTotIvcCnt += setIsNaNCheck(parseInt(filtered[i]));
							}
			//
							var tmpTotIvrCnt = 0;
							var filtered = totIvrCnt.filter(function(el){ return el != ''; });
							for (var i = 0; i < filtered.length; i++) {
								tmpTotIvrCnt += setIsNaNCheck(parseInt(filtered[i]));
							}
			//
							var tmpTotIvrrCnt = 0;
							var filtered = totIvrrCnt.filter(function(el){ return el != ''; });
							for (var i = 0; i < filtered.length; i++) {
								tmpTotIvrrCnt += setIsNaNCheck(parseInt(filtered[i]));
							}

							$('#'+g5AfeDsnGridId).alopexGrid('dataEdit', {totDuhCnt : tmpTotDuhCnt, totRotnCnt : tmpTotRotnCnt, totIvcCnt : tmpTotIvcCnt, totIvrCnt : tmpTotIvrCnt, totIvrrCnt : tmpTotIvrrCnt}, {mtsoInvtId : param.mtsoInvtId});

							httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setMergeG5DtlList', g5DtlList, 'POST', '');
						}
					}
			 });
        });

    	$('#btnG5AfeMgmtPop').on('click', function(e) {
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


    	$(document).on('click', "[id='g5AfeDsnGubun']", function(e){
    		g5AfeDsn.gridColSetupG5AfeDsn();
    	});


    	$('#btnG5AfeDsnImportExcel').on('click', function(e) {
    		$a.popup({
    		  	popid: 'ExcelUpload',
    		  	title: 'Excel Upload',
    		      url: '/tango-transmission-web/configmgmt/mtsoinvt/G5AfeDsnExcelUpload.do',
    		      windowpopup : true,
    		      modal: true,
    		      movable:true,
    		      width : window.innerWidth * 0.9,
    		      height : 750,
    		      callback : function(data) {
    		    	g5AfeDsn.setGrid(1,100000);
    		      }
    		});
    	});


    	$('#btnG5AfeDsnExportExcel').on('click', function(e) {
    		var ckGubun = $("input:radio[name=g5AfeDsnGubun][value='T']").is(":checked") ? true : false;
    		var sheetTitle = '5G투자설계';
    		if (!ckGubun) {
    			//alert('1');
				var userId 		= $('#userId').val();
	    		var paramData 	= {downFlag : 'G5AFE', userId : userId};
				httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/setExcelDownLoadHis', paramData, 'POST', '');

				sheetTitle = '차수별_5G투자설계';
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
 					$grid : $("#"+g5AfeDsnGridId)
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
    };

    this.gridSetG5AfeDsn = function() {
		g5AfeDsnHideCol();
    }

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		$('#'+g5AfeDsnGridId).alopexGrid('hideProgress');
    		setSPGrid(g5AfeDsnGridId, response, response.mtsoInvtDsnList);
    	}

    	if(flag == 'searchG5Dtl'){
    		$('#'+g5AfeDsnGridId).alopexGrid('hideProgress');
    		$('#'+g5AfeDsnGridId).alopexGrid('dataSet', response.g5DtlList);

    		// 스크롤 유지시 컬럼 고정이 있는 경우 위치 이동이 안되 컬럼 고정 풀고 스크롤 위치 이동후 다시 고정 설정
	       	$('#'+g5AfeDsnGridId).alopexGrid('columnUnfix');
	       	$('#'+g5AfeDsnGridId).alopexGrid('dataScroll' ,{_index:{row: 0, column : g5AfeDsnScrollOffset.column}});
	       	$('#'+g5AfeDsnGridId).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});

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
	       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : g5AfeDsnScrollOffset.column}});
	       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'floorNm'});
	}


    this.setGrid = function(page, rowPerPage) {

    	g5AfeDsnScrollOffset = $('#'+g5AfeDsnGridId).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#g5AfeDsnPageNo').val(page);
    	$('#g5AfeDsnRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var repMtsoYn = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(repMtsoYn){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	var subParam =  $("#g5AfeDsnForm").getData();
    	var page = $('#g5AfeDsnPageNo').val();
    	var rowPerPage = $('#g5AfeDsnRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+g5AfeDsnGridId).alopexGrid('showProgress')
    	var ckGubun = $("input:radio[name=g5AfeDsnGubun][value='T']").is(":checked") ? true : false;

    	if (ckGubun) {
    		param.bfAfeYr = setIsNaNCheck(parseInt(param.afeYr)) - 1;
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getMtso5GDsnList', param, 'GET', 'search');
    	} else {

    		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getG5DtlList', param, 'GET', 'searchG5Dtl');
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