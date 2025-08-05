/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var adtnFctInf = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var adtnFctInfDataGrid = 'adtnFctInfDataGrid';
	var paramData = null;
	var gClsDivCd = 'N';

	var grBizDivCd 			=[];
	var grOutdrCbntCdNm = [];
//	var grOutdrCbntBCdNm = [];

	var adtnFctInfScrollOffset = null;

    this.init = function(id, param) {
    	adtnFctInfSetSelectCode();
    	adtnFctInfSetEventListener();

    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function adtnFctInfSetSelectCode() {
    	var param = {matlClNm : '옥외함체'};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtItemInf', param, 'GET', 'outdrCbntCdNm');

//    	var param = {matlClNm : '소화설비',namsMatlCd : '1000053138'};
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtItemInf', param, 'GET', 'outdrCbntCdNm');
//
//    	var param = {matlClNm : '소화설비',namsMatlCd : '1000053134'};
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtItemInf', param, 'GET', 'outdrCbntCdNm');
    }


    this.adtnFctInfGridCol = function() {
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
			{ key : 'newExstDivCd', align:'center', title : '신규/기존', width: '80px'},
			{ key : 'bldFlorNo', align:'center', title : '층', width: '40px'},
			{ key : 'allFlorCnt', align:'center', title : '전체층수', width: '80px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'machFlorCnt', align:'center', title : '기계실층수', width: '80px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsNvrCamRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsNvrCamInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsNvrCamBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsNvrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsNvrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsNvrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsMntrMdulRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsMntrMdulInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsMntrMdulBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsLockRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsLockInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsLockBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsCardrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsCardrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsCardrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsDoorSnsrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDoorSnsrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDoorSnsrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsTmprSnsrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsTmprSnsrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsTmprSnsrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsHaronMntrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsHaronMntrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsHaronMntrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsRtfMntrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRtfMntrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRtfMntrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsArcnMntrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsArcnMntrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsArcnMntrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsGntMntrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsGntMntrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsGntMntrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsOptlSnsrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsOptlSnsrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsOptlSnsrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsFireSeseRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsFireSeseInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsFireSeseBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsUpsMntrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsUpsMntrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsUpsMntrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsNvcurMntrRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsNvcurMntrInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsNvcurMntrBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsCmtsoRcuRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsCmtsoRcuInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsCmtsoRcuBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsDuRcuRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDuRcuInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDuRcuBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsIntgRcuRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsIntgRcuInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsIntgRcuBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsRcuSlveRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRcuSlveInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRcuSlveBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsDiRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDiInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDiBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsDoRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDoInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsDoBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsRs232RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRs232InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRs232BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsRs485RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRs485InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRs485BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsRs422RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRs422InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsRs422BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsWattChnlRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsWattChnlInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'rmsWattChnlBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'rmsMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'rmsCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'rmsTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'rmsRmk', align:'center', title : '비고', width: '180px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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




			{ key : 'outdrCbntACdNm', align:'center', title : 'TYPE', width: '140px', filter : {useRenderToFilter : true}, inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grOutdrCbntCdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grOutdrCbntCdNm) {
						var exist = '';

						if (value && value.indexOf(grOutdrCbntCdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grOutdrCbntCdNm[i].value+' '+exist+'>'+grOutdrCbntCdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'outdrCbntACd', align:'center', title : '코드', width: '90px',
				render : function(value, data, render, mapping){
					return data.outdrCbntACdNm ;
				}
			},
			{ key : 'outdrCbntARqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'outdrCbntAInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'outdrCbntABuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'outdrCbntBCdNm', align:'center', title : 'TYPE', width: '140px', filter : {useRenderToFilter : true}, inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grOutdrCbntCdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grOutdrCbntCdNm) {
						var exist = '';

						if (value && value.indexOf(grOutdrCbntCdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grOutdrCbntCdNm[i].value+' '+exist+'>'+grOutdrCbntCdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'outdrCbntBCd', align:'center', title : '코드', width: '90px',
				render : function(value, data, render, mapping){
					return data.outdrCbntBCd ;
				}
			},
			{ key : 'outdrCbntBRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'outdrCbntBInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'outdrCbntBBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },



			{ key : 'outdrCbntMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'outdrCbntCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'outdrCbntTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'outdrCbntRmk', align:'center', title : '비고', width: '180px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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


			{ key : 'fextnACdNm', align:'center', title : 'TYPE', width: '130px', filter : {useRenderToFilter : true},
				render : function(value, data, render, mapping){
					return data.fextnACdNm ;
				}
			},
			{ key : 'fextnACd', align:'center', title : '코드', width: '90px',
				render : function(value, data, render, mapping){
					return data.fextnACd ;
				}
			},
			{ key : 'fextnARqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'fextnAInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'fextnABuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'fextnBCdNm', align:'center', title : 'TYPE', width: '130px', filter : {useRenderToFilter : true},
				render : function(value, data, render, mapping){
					return data.fextnBCdNm ;
				}
			},
			{ key : 'fextnBCd', align:'center', title : '코드', width: '90px',
				render : function(value, data, render, mapping){
					return data.fextnBCd ;
				}
			},
			{ key : 'fextnBRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'fextnBInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'fextnBBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'fextnMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'fextnCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'fextnTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'fextnRmk', align:'center', title : '비고', width: '180px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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

			{ key : 'spdCdNm', align:'center', title : 'TYPE', width: '130px', filter : {useRenderToFilter : true},
				render : function(value, data, render, mapping){
					return data.spdCdNm ;
				}
			},
			{ key : 'spdCd', align:'center', title : '코드', width: '90px',
				render : function(value, data, render, mapping){
					return data.spdCd ;
				}
			},
			{ key : 'spdRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'spdInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'spdBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'spdMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'spdCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'spdTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'spdRmk', align:'center', title : '비고', width: '180px', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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


			{ key : 'invtAdtnTotCost', align:'center', title : 'RMS+옥외함체+소화설비+SPD', width: '200px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },




			{ key : 'repMtsoId', align:'center', title : '대표국사ID', width: '50px', hidden:true   },		// 숨김
			{ key : 'mtsoId', align:'center', title : '국사ID', width: '100px', hidden:true  		 },		// 숨김
			{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '50px', hidden:true  }		// 숨김


			];

    	return colList;
    }

    this.adtnFctInfGrid = function() {
    	var param =  $("#searchForm").getData();
    	$('#'+adtnFctInfDataGrid).alopexGrid('dataEmpty');
    	var headerMappingN = [
    			 {fromIndex:0, toIndex:2, title:"업로드 기준"} // 최상단 그룹
    			,{fromIndex:7, toIndex:9, title:"층정보"} // 최상단 그룹
	    		,{fromIndex:10, toIndex:88, title:"RMS" , id : "Top"} // 최상단 그룹
	  			,{fromIndex:10, toIndex:12, title:"NVR카메라"}
	  			,{fromIndex:13, toIndex:15, title:"NVR"}
	  			,{fromIndex:16, toIndex:18, title:"전동제어 감시모듈"}
	  			,{fromIndex:19, toIndex:21, title:"Door Lock"}
	  			,{fromIndex:22, toIndex:24, title:"카드리더(RF리더)"}
	  			,{fromIndex:25, toIndex:27, title:"출입문센서"}
	  			,{fromIndex:28, toIndex:30, title:"온습도센서"}
	  			,{fromIndex:31, toIndex:33, title:"하론 감시모듈"}
	  			,{fromIndex:34, toIndex:36, title:"정류기 감시모듈"}
	  			,{fromIndex:37, toIndex:39, title:"냉방기 감시모듈"}
	  			,{fromIndex:40, toIndex:42, title:"발동발전기 감시모듈"}
	  			,{fromIndex:43, toIndex:45, title:"광전센서"}
	  			,{fromIndex:46, toIndex:48, title:"화재감지기"}
	  			,{fromIndex:49, toIndex:51, title:"UPS감시모듈"}
	  			,{fromIndex:52, toIndex:54, title:"상전감시모듈"}
	  			,{fromIndex:55, toIndex:57, title:"중심국사용RCU(2U)"}
	  			//,{fromIndex:54, toIndex:56, title:"소형RCU(대용량리튬폴리머)"}
	  			,{fromIndex:58, toIndex:60, title:"DU용RCU"}
	  			,{fromIndex:61, toIndex:63, title:"통합형RCU 기본형"}
	  			,{fromIndex:64, toIndex:66, title:"통합형RCU Slave"}
	  			,{fromIndex:67, toIndex:69, title:"DI"}
	  			,{fromIndex:70, toIndex:72, title:"DO"}
	  			,{fromIndex:73, toIndex:75, title:"RS-232"}
	  			,{fromIndex:76, toIndex:78, title:"RS-485"}
	  			,{fromIndex:79, toIndex:81, title:"RS-422"}
	  			,{fromIndex:82, toIndex:84, title:"전력량계(12채널)"}
	  			,{fromIndex:85, toIndex:87, title:"투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}

	  			,{fromIndex:89, toIndex:101, title:"옥외함체", id : "Top"} // 최상단 그룹
	  			,{fromIndex:89, toIndex:93, title:"옥외함체A"}
	  			,{fromIndex:94, toIndex:98, title:"옥외함체B"}
	  			,{fromIndex:99, toIndex:101, title:"투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}
//
	  			,{fromIndex:103, toIndex:116, title:"소화설비", id : "Top"} // 최상단 그룹
	  			,{fromIndex:103, toIndex:107, title:"소화설비A"}
	  			,{fromIndex:108, toIndex:112, title:"소화설비B"}
	  			,{fromIndex:113, toIndex:115, title:"투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}
//
	  			,{fromIndex:117, toIndex:125, title:"SPD", id : "Top"} // 최상단 그룹
	  			,{fromIndex:117, toIndex:121, title:"SPD"}
	  			,{fromIndex:122, toIndex:124, title:"투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}

	  			,{fromIndex:126, toIndex:126, title:" ", id : "Top"} // 최상단 그룹
	  			,{fromIndex:127, toIndex:127, title:"투자비 합계(천원)", headerStyleclass : 'headerBackGroundBlueS'}


				   			 ];
        //그리드 생성
        $('#'+adtnFctInfDataGrid).alopexGrid({
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

			columnFixUpto : 'newExstDivCd',
			headerGroup : headerMappingN,
    		columnMapping: adtnFctInf.adtnFctInfGridCol() ,
    		footer : {
    			position : 'buttom',
    			footerMapping : [
    				{columnIndex : 5, align : 'center', title : '합계'},

    				{columnIndex : 8, align : 'center',   render : 'sum(allFlorCnt)'},
    				{columnIndex : 9, align : 'center',   render : 'sum(machFlorCnt)'},
    				{columnIndex : 10, align : 'center',   render : 'sum(rmsNvrCamRqrdCnt)'},
    				{columnIndex : 11, align : 'center',   render : 'sum(rmsNvrCamInveCnt)'},
    				{columnIndex : 12, align : 'center',   render : 'sum(rmsNvrCamBuyCnt)'},
    				{columnIndex : 13, align : 'center',  render : 'sum(rmsNvrRqrdCnt)'},
    				{columnIndex : 14, align : 'center',  render : 'sum(rmsNvrInveCnt)'},
    				{columnIndex : 15, align : 'center',  render : 'sum(rmsNvrBuyCnt)'},
    				{columnIndex : 16, align : 'center',  render : 'sum(rmsMntrMdulRqrdCnt)'},
    				{columnIndex : 17, align : 'center',  render : 'sum(rmsMntrMdulInveCnt)'},
    				{columnIndex : 18, align : 'center',  render : 'sum(rmsMntrMdulBuyCnt)'},
    				{columnIndex : 19, align : 'center',  render : 'sum(rmsLockRqrdCnt)'},
    				{columnIndex : 20, align : 'center',  render : 'sum(rmsLockInveCnt)'},
    				{columnIndex : 21, align : 'center',  render : 'sum(rmsLockBuyCnt)'},
    				{columnIndex : 22, align : 'center',  render : 'sum(rmsCardrRqrdCnt)'},
    				{columnIndex : 23, align : 'center',  render : 'sum(rmsCardrInveCnt)'},
    				{columnIndex : 24, align : 'center',  render : 'sum(rmsCardrBuyCnt)'},
    				{columnIndex : 25, align : 'center',  render : 'sum(rmsDoorSnsrRqrdCnt)'},
    				{columnIndex : 26, align : 'center',  render : 'sum(rmsDoorSnsrInveCnt)'},
    				{columnIndex : 27, align : 'center',  render : 'sum(rmsDoorSnsrBuyCnt)'},
    				{columnIndex : 28, align : 'center',  render : 'sum(rmsTmprSnsrRqrdCnt)'},
    				{columnIndex : 29, align : 'center',  render : 'sum(rmsTmprSnsrInveCnt)'},
    				{columnIndex : 30, align : 'center',  render : 'sum(rmsTmprSnsrBuyCnt)'},
    				{columnIndex : 31, align : 'center',  render : 'sum(rmsHaronMntrRqrdCnt)'},
    				{columnIndex : 32, align : 'center',  render : 'sum(rmsHaronMntrInveCnt)'},
    				{columnIndex : 33, align : 'center',  render : 'sum(rmsHaronMntrBuyCnt)'},
    				{columnIndex : 34, align : 'center',  render : 'sum(rmsRtfMntrRqrdCnt)'},
    				{columnIndex : 35, align : 'center',  render : 'sum(rmsRtfMntrInveCnt)'},
    				{columnIndex : 36, align : 'center',  render : 'sum(rmsRtfMntrBuyCnt)'},
    				{columnIndex : 37, align : 'center',  render : 'sum(rmsArcnMntrRqrdCnt)'},
    				{columnIndex : 38, align : 'center',  render : 'sum(rmsArcnMntrInveCnt)'},
    				{columnIndex : 39, align : 'center',  render : 'sum(rmsArcnMntrBuyCnt)'},
    				{columnIndex : 40, align : 'center',  render : 'sum(rmsGntMntrRqrdCnt)'},
    				{columnIndex : 41, align : 'center',  render : 'sum(rmsGntMntrInveCnt)'},
    				{columnIndex : 42, align : 'center',  render : 'sum(rmsGntMntrBuyCnt)'},
    				{columnIndex : 43, align : 'center',  render : 'sum(rmsOptlSnsrRqrdCnt)'},
    				{columnIndex : 44, align : 'center',  render : 'sum(rmsOptlSnsrInveCnt)'},



    				{columnIndex : 45, align : 'center',  render : 'sum(rmsOptlSnsrBuyCnt)'},
    				{columnIndex : 46, align : 'center',  render : 'sum(rmsFireSeseRqrdCnt)'},
    				{columnIndex : 47, align : 'center',  render : 'sum(rmsFireSeseInveCnt)'},
    				{columnIndex : 48, align : 'center',  render : 'sum(rmsFireSeseBuyCnt)'},
    				{columnIndex : 49, align : 'center',  render : 'sum(rmsUpsMntrRqrdCnt)'},
    				{columnIndex : 50, align : 'center',  render : 'sum(rmsUpsMntrInveCnt)'},
    				{columnIndex : 51, align : 'center',  render : 'sum(rmsUpsMntrBuyCnt)'},
    				{columnIndex : 52, align : 'center',  render : 'sum(rmsNvcurMntrRqrdCnt)'},
    				{columnIndex : 53, align : 'center',  render : 'sum(rmsNvcurMntrInveCnt)'},
    				{columnIndex : 54, align : 'center',  render : 'sum(rmsNvcurMntrBuyCnt)'},
    				{columnIndex : 55, align : 'center',  render : 'sum(rmsCmtsoRcuRqrdCnt)'},
    				{columnIndex : 56, align : 'center',  render : 'sum(rmsCmtsoRcuInveCnt)'},
    				{columnIndex : 57, align : 'center',  render : 'sum(rmsCmtsoRcuBuyCnt)'},

    				{columnIndex : 58, align : 'center',  render : 'sum(rmsDuRcuRqrdCnt)'},
    				{columnIndex : 59, align : 'center',  render : 'sum(rmsDuRcuInveCnt)'},
    				{columnIndex : 60, align : 'center',  render : 'sum(rmsDuRcuBuyCnt)'},
    				{columnIndex : 61, align : 'center',  render : 'sum(rmsIntgRcuRqrdCnt)'},

    				{columnIndex : 62, align : 'center',  render : 'sum(rmsIntgRcuInveCnt)'},
    				{columnIndex : 63, align : 'center',  render : 'sum(rmsIntgRcuBuyCnt)'},
    				{columnIndex : 64, align : 'center',  render : 'sum(rmsRcuSlveRqrdCnt)'},
    				{columnIndex : 65, align : 'center',  render : 'sum(rmsRcuSlveInveCnt)'},
    				{columnIndex : 66, align : 'center',  render : 'sum(rmsRcuSlveBuyCnt)'},
    				{columnIndex : 67, align : 'center',  render : 'sum(rmsDiRqrdCnt)'},
    				{columnIndex : 68, align : 'center',  render : 'sum(rmsDiInveCnt)'},
    				{columnIndex : 69, align : 'center',  render : 'sum(rmsDiBuyCnt)'},
    				{columnIndex : 70, align : 'center',  render : 'sum(rmsDoRqrdCnt)'},
    				{columnIndex : 71, align : 'center',  render : 'sum(rmsDoInveCnt)'},
    				{columnIndex : 72, align : 'center',  render : 'sum(rmsDoBuyCnt)'},
    				{columnIndex : 73, align : 'center',  render : 'sum(rmsRs232RqrdCnt)'},
    				{columnIndex : 74, align : 'center',  render : 'sum(rmsRs232InveCnt)'},
    				{columnIndex : 75, align : 'center',  render : 'sum(rmsRs232BuyCnt)'},
    				{columnIndex : 76, align : 'center',  render : 'sum(rmsRs485RqrdCnt)'},
    				{columnIndex : 77, align : 'center',  render : 'sum(rmsRs485InveCnt)'},
    				{columnIndex : 78, align : 'center',  render : 'sum(rmsRs485BuyCnt)'},
    				{columnIndex : 79, align : 'center',  render : 'sum(rmsRs422RqrdCnt)'},
    				{columnIndex : 80, align : 'center',  render : 'sum(rmsRs422InveCnt)'},
    				{columnIndex : 81, align : 'center',  render : 'sum(rmsRs422BuyCnt)'},

    				{columnIndex : 82, align : 'center',  render : 'sum(rmsWattChnlRqrdCnt)'},
    				{columnIndex : 83, align : 'center',  render : 'sum(rmsWattChnlInveCnt)'},
    				{columnIndex : 84, align : 'center',  render : 'sum(rmsWattChnlBuyCnt)'},
    				{columnIndex : 85, align : 'right',   render : 'sum(rmsMtrlCost)'},
    				{columnIndex : 86, align : 'right',   render : 'sum(rmsCstrCost)'},
    				{columnIndex : 87, align : 'right',   render : 'sum(rmsTotCost)'},

    				{columnIndex : 91, align : 'center',  render : 'sum(outdrCbntARqrdCnt)'},
    				{columnIndex : 92, align : 'center',  render : 'sum(outdrCbntAInveCnt)'},
    				{columnIndex : 93, align : 'center',  render : 'sum(outdrCbntABuyCnt)'},

    				{columnIndex : 96, align : 'center',  render : 'sum(outdrCbntBRqrdCnt)'},
    				{columnIndex : 97, align : 'center',  render : 'sum(outdrCbntBInveCnt)'},
    				{columnIndex : 98, align : 'center',  render : 'sum(outdrCbntBBuyCnt)'},
    				{columnIndex : 99, align : 'right',   render : 'sum(outdrCbntMtrlCost)'},
    				{columnIndex : 10, align : 'right',   render : 'sum(outdrCbntCstrCost)'},
    				{columnIndex : 101, align : 'right',  render : 'sum(outdrCbntTotCost)'},

    				{columnIndex : 105, align : 'center', render : 'sum(fextnARqrdCnt)'},
    				{columnIndex : 106, align : 'center', render : 'sum(fextnAInveCnt)'},
    				{columnIndex : 107, align : 'center', render : 'sum(fextnABuyCnt)'},

    				{columnIndex : 110, align : 'center', render : 'sum(fextnBRqrdCnt)'},
    				{columnIndex : 111, align : 'center', render : 'sum(fextnBInveCnt)'},
    				{columnIndex : 112, align : 'center', render : 'sum(fextnBBuyCnt)'},
    				{columnIndex : 113, align : 'center', render : 'sum(fextnMtrlCost)'},
    				{columnIndex : 114, align : 'center', render : 'sum(fextnCstrCost)'},
    				{columnIndex : 115, align : 'center', render : 'sum(fextnTotCost)'},

    				{columnIndex : 119, align : 'center', render : 'sum(spdRqrdCnt)'},
    				{columnIndex : 120, align : 'center', render : 'sum(spdInveCnt)'},
    				{columnIndex : 121, align : 'center', render : 'sum(spdBuyCnt)'},
    				{columnIndex : 122, align : 'center', render : 'sum(spdMtrlCost)'},
    				{columnIndex : 123, align : 'center', render : 'sum(spdCstrCost)'},
    				{columnIndex : 124, align : 'center', render : 'sum(spdTotCost)'},
    				{columnIndex : 125, align : 'center', render : 'sum(invtAdtnTotCost)'},

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
    	$('#'+adtnFctInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');

	}


    function adtnFctInfSetEventListener() {

    	$('#'+adtnFctInfDataGrid).on('rowInlineEditEnd',function(e){
    		if (gClsDivCd == 'Y') {
    			var param = AlopexGrid.parseEvent(e).data;
    			var userId = $("#userId").val();
    			var afeYr = $("#afeYr").val();
    			var afeDgr = $("#afeDgr").val();
    			if (userId == "") { userId = "SYSTEM"; }
    			param.userId	 	= userId;
    			param.afeYr 		= afeYr;
    			param.afeDgr 		= afeDgr;

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtAdtnFctInf', param, 'POST', 'InvtAdtnFctInf');
    		}


    	});

    	 $('#btnExportAdtnCalc').on('click', function(e) {
    		 if (gClsDivCd == 'Y') {
    			 var userId 	= $("#userId").val();
 				var afeYr 	= $("#afeYr").val();
 				var afeDgr 	= $("#afeDgr").val();
 				if (userId == "") { userId = "SYSTEM"; }
 				var param =  $("#searchForm").getData();
 				param.userId = userId;
// 				var param = {userId : userId, afeYr : afeYr, afeDgr :  afeDgr};
 				$('#'+adtnFctInfDataGrid).alopexGrid('showProgress');
 				httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeAutoInvtAdtnFctInf', param, 'POST', 'search');
	    	 } else {
	 			callMsgBox('','W', '마감된 AFE 차수 입니다. 수정 할수 없습니다.', function(msgId, msgRst){});
				return;
	    	 }
    	 });

    	 $('#btnAdtnFctExcelUpload').on('click', function(e) {
    		 if (gClsDivCd == 'Y') {
    			 var afeYr 	= $("#afeYr").val();
     			var afeDgr 	= $("#afeDgr").val();
     			var data = {afeYr : afeYr, afeDgr :  afeDgr};
    			 $a.popup({
	     		  	popid: 'ExcelUpload',
	     		  	title: 'Excel Upload',
	     		      url: '/tango-transmission-web/configmgmt/fctinvt/InvtAdtnFctExcelUpload.do',
	     		      windowpopup : true,
	     		      data: data,
	     		      modal: true,
	     		      movable:true,
	     		      width : window.innerWidth * 0.9,
	     		      height : 750,
	     		      callback : function(data) {
	     		    	 adtnFctInf.setGrid(1,100000);
	     		      }
	     		});
    		 } else {
     			callMsgBox('','W', '마감된 AFE 차수 입니다. 업로드 할 수 없습니다.', function(msgId, msgRst){});
 			    return;
 			}
     	});

    	 $('#btnAdtnFctExportExcel').on('click', function(e) {

    		//필터링 체크 여부
    		 var filtered = false;
    		 if (document.getElementsByClassName('alopexgrid-filter-dropdownbutton filtered').length > 0) {
    			 filtered = true;
    		 }

    		 $('#'+adtnFctInfDataGrid).alopexGrid("showCol", ['fctInvtId', 'afeYr', 'afeDgr']);

    		 var dt = new Date();
 			var recentY = dt.getFullYear();
 			var recentM = dt.getMonth() + 1;
 			var recentD = dt.getDate();

 			if(recentM < 10) recentM = "0" + recentM;
 			if(recentD < 10) recentD = "0" + recentD;

 			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

 			var worker = new ExcelWorker({
 				excelFileName : '부대설비투자_부가설비_'+recentYMD,
 				sheetList : [{
 					sheetName : '부가설비',
 					$grid : $("#"+adtnFctInfDataGrid)
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
 				    	    $('#'+adtnFctInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');
 						}
 					}
 				}
 			});
         });

    };


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'InvtAdtnFctInf'){
    		var objData = response.InvtAdtnFct[0];
    		$('#'+adtnFctInfDataGrid).alopexGrid('dataEdit', objData, { fctInvtId : objData.fctInvtId});
    		$('#'+adtnFctInfDataGrid).alopexGrid("viewUpdate");
    	}


    	if(flag == 'search'){
    		$('#'+adtnFctInfDataGrid).alopexGrid('hideProgress');
    		setSPGrid(adtnFctInfDataGrid, response, response.InvtAdtnFctInfList);

    		var afeYr = $('#afeYr').val();
    		var afeDgr = $('#afeDgr').val();
    		var param = {afeYr : afeYr, afeDgr : afeDgr};
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getClsDivCd', param, 'GET', 'clsDivCd');
    	}

    	if(flag == 'clsDivCd'){
    		if (response.clsDivCdList.length > 0) {
    			gClsDivCd = 	response.clsDivCdList[0].clsDivCd;
    			if (gClsDivCd !='Y') {
    				$("#gClsDivAdtnInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
    			} else {
    				$("#gClsDivAdtnInfText").html("");
    			}
    		} else {
    			$("#gClsDivAdtnInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
    		}
    	}

    	if(flag == 'outdrCbntCdNm'){
    		grOutdrCbntCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].namsMatlCd, text : response.codeList[i].etcAttrVal1};
				grOutdrCbntCdNm.push(resObj);
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
       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : adtnFctInfScrollOffset.column}});
       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'newExstDivCd'});
	}

    this.setGrid = function(page, rowPerPage) {

    	adtnFctInfScrollOffset = $('#'+adtnFctInfDataGrid).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#InvtAdtnFctInfPageNo').val(page);
    	$('#InvtAdtnFctInfRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	param.afeYr 	= $("#afeYr").val();
    	param.afeDgr 	= $("#afeDgr").val();

    	var subParam =  $("#InvtAdtnFctInfForm").getData();
    	var page = $('#InvtAdtnFctInfPageNo').val();
    	var rowPerPage = $('#InvtAdtnFctInfRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+adtnFctInfDataGrid).alopexGrid('showProgress')
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtAdtnFctInfList', param, 'GET', 'search');

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