/**
 * MtsoInf.js
 *
 * @author Administrator
 * @date 2020. 03. 03. 오전 17:30:03
 * @version 1.0
 */

var g5AfeDsn = $a.page(function() {

	var g5AfeDsnGridId 	= 'g5AfeDsnDataGrid';
	var g5InfGrid		= 'g5InfGrid';
	var g5DtlGrid		= 'g5DtlGrid';
	var paramData = null;

	var gridHeadData	= [];
	var gridColData		= [];
    this.init = function(id, param) {
    	g5AfeDsnSetSelectCode();
    	g5AfeDsnSetEventListener();

    };


    this.gridColSetupG5AfeDsn = function() {
    	$('#'+g5AfeDsnGridId).alopexGrid('dataEmpty');

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
		var arrData = {fromIndex:6, toIndex:10, title: tAfe + "년 5G 투자 현황 소계"};
		gridHeadData.push(arrData);
		var arrData = {fromIndex:11, toIndex:15, title: paramData.afeYr + "년 5G 투자 현황 소계"};
		gridHeadData.push(arrData);

		var startI = 16;

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
					}
				}
			gridColData.push(colData);


			var colData = { key : 'd'+afeDgr+'EtcEqp6', align:'center', title : '기타6', width: '70px', exportDataType: 'number',
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
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);

			var colData = { key : 'd'+afeDgr+'EtcEqp7', align:'center', title : '기타7', width: '70px', exportDataType: 'number',
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
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);

			var colData = { key : 'd'+afeDgr+'EtcEqp8', align:'center', title : '기타8', width: '70px', exportDataType: 'number',
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
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);

			var colData = { key : 'd'+afeDgr+'EtcEqp9', align:'center', title : '기타9', width: '70px', exportDataType: 'number',
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
						var strCss = 'width:100%;height:22px;text-align:left;';
						if(data.repMtsoYn == 'Y') {
							return '<div><input type="text" style="'+strCss+'" value="'+strVal+'"/></div>';
						}
					}
				}
			gridColData.push(colData);

			var colData = { key : 'd'+afeDgr+'EtcEqp10', align:'center', title : '기타10', width: '70px', exportDataType: 'number',
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
						var strCss = 'width:100%;height:22px;text-align:left;';
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
		var arrData = {fromIndex:startI, toIndex:startI + 9, title: "기타항목"};
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


		$('#'+g5InfGrid).alopexGrid({
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
				{fromIndex:3, toIndex:6, title: tAfe +'년도'},
				{fromIndex:7, toIndex:16, title: '기타항목'}
			],
    		columnMapping: [
    			{ key : 'lastChgDate', align:'center', title : '저장 일시', width: '150'},
    			{ key : 'lastChgUserId', align:'center', title : '사용자ID', width: '100'},
    			{ key : 'bfDuhCnt', align:'center', title : 'DUH(식수)', width: '100'},
    			{ key : 'bfRotnCnt', align:'center', title : 'ROTN', width: '100'},
    			{ key : 'bfIvcCnt', align:'center', title : 'IVC', width: '100'},
    			{ key : 'bfIvrCnt', align:'center', title : 'IVR', width: '100'},
    			{ key : 'bfIvrrCnt', align:'center', title : 'IVRR', width: '100'},
    			{ key : 'afeG5EtcColVal1', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal2', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal3', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal4', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal5', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal6', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal7', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal8', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal9', align:'left', title : '기타', width: '100'},
    			{ key : 'afeG5EtcColVal10', align:'left', title : '기타', width: '100'}
    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

		$('#'+g5DtlGrid).alopexGrid({
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

    			{ key : 'afeYr', align:'center', title : '년도', width: '60'},
    			{ key : 'afeDgr', align:'center', title : '차수', width: '100'},
    			{ key : 'afeInvtDivCd', align:'center', title : '구분', width: '100'},
    			{ key : 'duhCnt', align:'center', title : 'DUH(식수)', width: '70'},
    			{ key : 'rotnCnt', align:'center', title : 'ROTN', width: '70'},
    			{ key : 'ivcCnt', align:'center', title : 'IVC', width: '70'},
    			{ key : 'ivrCnt', align:'center', title : 'IVR', width: '70'},
    			{ key : 'ivrrCnt', align:'center', title : 'IVRR', width: '70'},
    			{ key : 'rtfCnt', align:'center', title : '정류기', width: '70'},
    			{ key : 'batryCnt', align:'center', title : '축전지', width: '70'},
    			{ key : 'cbplCnt', align:'center', title : '분전반', width: '70'},
    			{ key : 'arcnCnt', align:'center', title : '냉방기', width: '70'},
    			{ key : 'etcEqpFstCnt', align:'center', title : '기타1', width: '70'},
    			{ key : 'etcEqpScndCnt', align:'center', title : '기타2', width: '70'},
    			{ key : 'etcEqpThrdCnt', align:'center', title : '기타3', width: '70'},
    			{ key : 'etcEqpFothCnt', align:'center', title : '기타4', width: '70'},
    			{ key : 'etcEqpFithCnt', align:'center', title : '기타5', width: '70'},
    			{ key : 'etcEqp6', align:'left', title : '기타', width: '100'},
    			{ key : 'etcEqp7', align:'left', title : '기타', width: '100'},
    			{ key : 'etcEqp8', align:'left', title : '기타', width: '100'},
    			{ key : 'etcEqp9', align:'left', title : '기타', width: '100'},
    			{ key : 'etcEqp10', align:'left', title : '기타', width: '100'}
    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });


    	g5AfeDsnHideCol();
    }


    function g5AfeDsnHideCol() {
    	//var ckGubun = $("input:radio[name=g5AfeDsnGubun][value='T']").is(":checked") ? true : false;

    	for(var i = 0; i < publicAfeG5EtcHideCol.length; i++){
			var upWord = publicAfeG5EtcHideCol[i].mtsoInvtItmVal;
	    	//if (ckGubun) {
    			if (publicAfeG5EtcHideCol[i].mtsoInvtItmHidYn == 'N') {
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicAfeG5EtcHideCol[i].mtsoInvtItmNm}, upWord);
    				$('#'+g5InfGrid).alopexGrid('updateColumn', {title : publicAfeG5EtcHideCol[i].mtsoInvtItmNm}, upWord);
    				g5InfGrid
    			} else {
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, upWord);
    				$('#'+g5InfGrid).alopexGrid('updateColumn', {hidden : true}, upWord);
    			}
	    	//}
		}




    	for(var i = 0; i < publicHideCol.length; i++){
			var upWord = publicHideCol[i].mtsoInvtItmVal;
			for(var j = 0; j < publicAfeDgr.length; j++){

    			var afeDgr  = publicAfeDgr[j].afeDgr;
				var colNm1 = 'd' + afeDgr + 'Sys' + upWord;
				var colNm2 = 'd' + afeDgr + upWord;

				var colNm3 = 'sys' + upWord;
				var colNm4 = upWord.replace('Etc','etc');

    			if (publicHideCol[i].mtsoInvtItmHidYn == 'N') {
    				//$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm1);
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm2);

    				//$('#'+g5DtlGrid).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm3);
    				$('#'+g5DtlGrid).alopexGrid('updateColumn', {title : publicHideCol[i].mtsoInvtItmNm}, colNm4);

    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
    				$('#'+g5DtlGrid).alopexGrid('updateColumn', {hidden : true}, colNm3);
    			} else {
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm1);
    				$('#'+g5AfeDsnGridId).alopexGrid('updateColumn', {hidden : true}, colNm2);

    				$('#'+g5DtlGrid).alopexGrid('updateColumn', {hidden : true}, colNm3);
    				$('#'+g5DtlGrid).alopexGrid('updateColumn', {hidden : true}, colNm4);

    			}
    		}
		}



    }


	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function g5AfeDsnSetSelectCode() {

    }



    function g5AfeDsnSetEventListener() {

    	$('#'+g5AfeDsnGridId).on('click', '.bodycell', function(e){
    		$('#'+g5InfGrid).show();
    		$('#'+g5DtlGrid).show();
			var dataObj = AlopexGrid.parseEvent(e).data;

			var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";
			var afeYr	= $("#afeYr").val();
			var data = {mtsoInvtId: dataObj.mtsoInvtId, srchDt : srchDt, afeYr : afeYr};
			subSetGrid(data);
			subSetGrid2(data);
		});

    	$('#btnG5AfeDsnExportExcel').on('click', function(e) {
    		var ckGubun = $("input:radio[name=g5AfeDsnGubun][value='T']").is(":checked") ? true : false;
    		var sheetTitle = '이력_5G투자설계';

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

    function subSetGrid(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getSubHstg5InfList', data, 'GET', 'subSearch1');

    }
    function subSetGrid2(data) {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getSubHstg5DtlList', data, 'GET', 'subSearch2');
    }

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		$('#'+g5AfeDsnGridId).alopexGrid('hideProgress');
    		setSPGrid(g5AfeDsnGridId, response, response.mtsoInvtDsnList);
    	}

    	if(flag == 'subSearch1'){
    		$('#'+g5InfGrid).alopexGrid('hideProgress');
    		$('#'+g5InfGrid).alopexGrid('dataSet', response.mtsoInvtDsnList);
    		//setSPGrid(subMtsoInfDataGrid, response, response.mtsoInvtDsnList);


    	}

    	if(flag == 'subSearch2'){
    		$('#'+g5DtlGrid).alopexGrid('hideProgress');
    		$('#'+g5DtlGrid).alopexGrid('dataSet', response.mtsoInvtDsnList);
    		//setSPGrid(subMtsoInfDataGrid, response, response.mtsoInvtDsnList);
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
    	$('#g5AfeDsnPageNo').val(page);
    	$('#g5AfeDsnRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var repMtsoYn = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(repMtsoYn){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}
    	var srchDt = $("#srchDt").val() + " " + $("#srchHh").val() + ":" + $("#srchMi").val() + ":59";
    	param.srchDt = srchDt;
    	var subParam =  $("#g5AfeDsnForm").getData();
    	var page = $('#g5AfeDsnPageNo').val();
    	var rowPerPage = $('#g5AfeDsnRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;
    	//console.log(param);
    	$('#'+g5AfeDsnGridId).alopexGrid('showProgress')
    	param.bfAfeYr = setIsNaNCheck(parseInt(param.afeYr)) - 1;
		httpRequest('tango-transmission-biz/transmisson/configmgmt/mtsoinvt/getHstMtso5GDsnList', param, 'GET', 'search');
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