/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */

var imptFctInf = $a.page(function() {
	var inlineStyleBackgroundColor = '#fafad2';
	var imptFctInfDataGrid = 'imptFctInfDataGrid';
	var paramData = null;
	var gClsDivCd = 'N';

	var grBizDivCd			= [];


	var grPveRtfV48CdNm		= [];
	var grPveRtfV27CdNm		= [];
	var grSystmLipoCdNm		= [];
	var grSystmBatryCdNm	= [];
	var grPveLipoCdNm		= [];
	var grSystmArcnCdNm		= [];
	var grSystmIpdCdNm		= [];
	var grPveIpdCdNm		= [];

	var imptFctInfScrollOffset = null;

    this.init = function(id, param) {
    	imptFctInfSetSelectCode();
    	imptFctInfSetEventListener();
    };

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function imptFctInfSetSelectCode() {
    	var param = {};
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct1', param, 'GET', 'code1');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct2', param, 'GET', 'code2');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct3', param, 'GET', 'code3');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct4', param, 'GET', 'code4');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct5', param, 'GET', 'code5');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct6', param, 'GET', 'code6');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getCodeFct7', param, 'GET', 'code7');

    }

    this.imptFctInfGridCol = function() {
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
			{ key : 'newExstDivCd', align:'center', title : '신규/기존', width: '80px'},
			{ key : 'mtsoCntrTypNm', align:'center', title : '국사구분', width: '100px'},



			{ key : 'totCnsmEpwrVal', align:'center', title : '무선+유선[W]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMrhSystmCnt', align:'center', title : '시스템 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMrhRtfMdulCnt', align:'center', title : '정류모듈 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMrhUseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMrhMoreCapaVal', align:'center', title : '여유용량[A]', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMr1SystmCnt', align:'center', title : '시스템 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMr1RtfMdulCnt', align:'center', title : '정류모듈 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMr1UseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMr1MoreCapaVal', align:'center', title : '여유용량[A]', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstMr2SystmCnt', align:'center', title : '시스템 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMr2RtfMdulCnt', align:'center', title : '정류모듈 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMr2UseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMr2MoreCapaVal', align:'center', title : '여유용량[A]', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstMrsSystmCnt', align:'center', title : '시스템 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMrsRtfMdulCnt', align:'center', title : '정류모듈 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMrsUseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstMrsMoreCapaVal', align:'center', title : '여유용량[A]', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstCrs1800SystmCnt', align:'center', title : '시스템 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstCrs1800RtfMdulCnt', align:'center', title : '정류모듈 수', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstCrs1800UseLoadVal', align:'center', title : '사용부하량[A]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstCrs1800MoreCapaVal', align:'center', title : '여유용량[A]', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstV48LipoSystmCnt', align:'center', title : '시스템 수', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstV48LipoMdulCnt', align:'center', title : '모듈 수', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstV27LipoSystmCnt', align:'center', title : '시스템 수', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstV27LipoMdulCnt', align:'center', title : '모듈 수', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstBatrySystmNm', align:'center', title : '시스템 명', width: '100px' },
			{ key : 'exstBatryCellCnt', align:'center', title : '셀 수', width: '60px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstArcnFcltsCapaVal', align:'center', title : '시설용량[RT]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'exstArcnCommEpwrVal', align:'center', title : '통신전력[KW]', width: '100px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'exstIpdACnt', align:'center', title : 'IPD-A 수', width: '80px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'exstIpdBCnt', align:'center', title : 'IPD-B 수', width: '80px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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

			{ key : 'calcRtfV48CapaVal', align:'center', title : '48V 기준', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'calcRtfV27CapaVal', align:'center', title : '27V 기준', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'calcBatryV48CapaVal', align:'center', title : '48V 기준', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'calcBatryV27CapaVal', align:'center', title : '27V 기준', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'calcArcnNeedCapaVal', align:'center', title : '필요 용량', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'calcArcnShtgCapaVal', align:'center', title : '부족 용량', width: '80px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmRtfV48CdNm', align:'center', title : 'TYPE', width: '100px'},
			{ key : 'systmRtfV48Cd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmRtfV48RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmRtfV48InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmRtfV48BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmRtfMdulV48Cd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmRtfMdulV48RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmRtfMdulV48InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmRtfMdulV48BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmRtfV27CdNm', align:'center', title : 'TYPE', width: '100px'},
			{ key : 'systmRtfV27Cd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmRtfV27RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmRtfV27InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmRtfV27BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmRtfMdulV27Cd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmRtfMdulV27RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmRtfMdulV27InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmRtfMdulV27BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmCtrlMdulCd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmCtrlMdulRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmCtrlMdulInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmCtrlMdulBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'pveRtfV48CdNm', align:'center', title : 'TYPE', width: '100px', filter : {useRenderToFilter : true}, inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				headerStyleclass : 'headerBackGroundGreenB',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grPveRtfV48CdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grPveRtfV48CdNm) {
						var exist = '';

						if (value && value.indexOf(grPveRtfV48CdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grPveRtfV48CdNm[i].value+' '+exist+'>'+grPveRtfV48CdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'pveRtfV48Cd', align:'center', title : '코드', headerStyleclass : 'headerBackGroundGreenB', width: '100px'},
			{ key : 'pveRtfV48RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				headerStyleclass : 'headerBackGroundGreenB',
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
			{ key : 'pveRtfV48InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
				headerStyleclass : 'headerBackGroundGreenB',
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
			{ key : 'pveRtfV48BuyCnt', align:'center', title : '구매수량', width: '70px', headerStyleclass : 'headerBackGroundGreenB', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveRtfMdulV48Cd', align:'center', title : '코드', headerStyleclass : 'headerBackGroundGreenB', width: '100px'},
			{ key : 'pveRtfMdulV48RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveRtfMdulV48InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveRtfMdulV48BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveRtfV27CdNm', align:'center', title : 'TYPE', width: '120px', filter : {useRenderToFilter : true}, headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grPveRtfV27CdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grPveRtfV27CdNm) {
						var exist = '';

						if (value && value.indexOf(grPveRtfV27CdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grPveRtfV27CdNm[i].value+' '+exist+'>'+grPveRtfV27CdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'pveRtfV27Cd', align:'center', title : '코드', headerStyleclass : 'headerBackGroundGreenB', width: '100px'},
			{ key : 'pveRtfV27RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveRtfV27InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveRtfV27BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveRtfMdulV27Cd', align:'center', title : '코드', headerStyleclass : 'headerBackGroundGreenB', width: '100px'},
			{ key : 'pveRtfMdulV27RqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveRtfMdulV27InveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveRtfMdulV27BuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB',render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveCtrlMdulCd', align:'center', title : '코드', headerStyleclass : 'headerBackGroundGreenB',width: '100px'},
			{ key : 'pveCtrlMdulRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB',inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveCtrlMdulInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB',inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveCtrlMdulBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'invtRtfMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtRtfCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtRtfTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'systmLipoCdNm', align:'center', title : 'TYPE', width: '120px', filter : {useRenderToFilter : true},
//				headerStyleclass : 'headerBackGroundBlueS',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grSystmLipoCdNm);
						return render_data;
					}
				}
//				,
//				editable : function(value, data) {
//					var strSelectOption = '<option value="" >선택</option>';
//					for(var i in grSystmLipoCdNm) {
//						var exist = '';
//
//						if (value && value.indexOf(grSystmLipoCdNm[i].value) != -1) {
//							exist = ' selected';
//						}
//						strSelectOption += '<option value='+grSystmLipoCdNm[i].value+' '+exist+'>'+grSystmLipoCdNm[i].text+'</option>';
//					}
//					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
//				}
			},
			{ key : 'systmLipoCd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmLipoRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmLipoInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmLipoBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'systmLipoMdulCd', align:'center', title : '코드', width: '80px'},
			{ key : 'systmLipoMdulRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmLipoMdulInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmLipoMdulBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmBatryCdNm', align:'center', title : 'TYPE', width: '120px', filter : {useRenderToFilter : true},
//				headerStyleclass : 'headerBackGroundBlueS',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grSystmBatryCdNm);
						return render_data;
					}
				}
//			,
//				editable : function(value, data) {
//					var strSelectOption = '<option value="" >선택</option>';
//					for(var i in grSystmBatryCdNm) {
//						var exist = '';
//
//						if (value && value.indexOf(grSystmBatryCdNm[i].value) != -1) {
//							exist = ' selected';
//						}
//						strSelectOption += '<option value='+grSystmBatryCdNm[i].value+' '+exist+'>'+grSystmBatryCdNm[i].text+'</option>';
//					}
//					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
//				}
			},
			{ key : 'systmBatryCd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmBatryRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmBatryInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmBatryBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveLipoCdNm', align:'center', title : 'TYPE', width: '120px', headerStyleclass : 'headerBackGroundGreenB', filter : {useRenderToFilter : true}, inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grSystmLipoCdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grSystmLipoCdNm) {
						var exist = '';

						if (value && value.indexOf(grSystmLipoCdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grSystmLipoCdNm[i].value+' '+exist+'>'+grSystmLipoCdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'pveLipoCd', align:'center', title : '코드', width: '90px', headerStyleclass : 'headerBackGroundGreenB'},
			{ key : 'pveLipoRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveLipoInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveLipoBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveLipoMdulCd', align:'center', title : '코드', width: '90px', headerStyleclass : 'headerBackGroundGreenB'},
			{ key : 'pveLipoMdulRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveLipoMdulInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveLipoMdulBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'pveBatryCdNm', align:'center', title : 'TYPE', width: '120px', headerStyleclass : 'headerBackGroundGreenB', filter : {useRenderToFilter : true}, inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grSystmBatryCdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grSystmBatryCdNm) {
						var exist = '';

						if (value && value.indexOf(grSystmBatryCdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grSystmBatryCdNm[i].value+' '+exist+'>'+grSystmBatryCdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'pveBatryCd', align:'center', title : '코드', width: '90px', headerStyleclass : 'headerBackGroundGreenB'},
			{ key : 'pveBatryRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveBatryInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveBatryBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'invtBatryMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtBatryCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtBatryTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmArcnCdNm', align:'center', title : 'TYPE', width: '140px', filter : {useRenderToFilter : true},
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grSystmArcnCdNm);
						return render_data;
					}
				},
//				editable : function(value, data) {
//					var strSelectOption = '<option value="" >선택</option>';
//					for(var i in grSystmArcnCdNm) {
//						var exist = '';
//
//						if (value && value.indexOf(grSystmArcnCdNm[i].value) != -1) {
//							exist = ' selected';
//						}
//						strSelectOption += '<option value='+grSystmArcnCdNm[i].value+' '+exist+'>'+grSystmArcnCdNm[i].text+'</option>';
//					}
//					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
//				}
			},
			{ key : 'systmArcnCd', align:'center', title : '코드', width: '90px' },
			{ key : 'systmArcnRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmArcnInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmArcnBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveArcnCdNm', align:'center', title : 'TYPE', width: '180px', headerStyleclass : 'headerBackGroundGreenB', filter : {useRenderToFilter : true}, inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grSystmArcnCdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grSystmArcnCdNm) {
						var exist = '';

						if (value && value.indexOf(grSystmArcnCdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grSystmArcnCdNm[i].value+' '+exist+'>'+grSystmArcnCdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'pveArcnCd', align:'center', title : '코드', width: '90px', headerStyleclass : 'headerBackGroundGreenB'},
			{ key : 'pveArcnRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveArcnInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveArcnBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'invtArcnMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtArcnCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtArcnTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'systmIpdCdNm', align:'center', title : 'TYPE', width: '100px', filter : {useRenderToFilter : true}
			},
			{ key : 'systmIpdCd', align:'center', title : '코드', width: '90px'},
			{ key : 'systmIpdRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'systmIpdInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'systmIpdBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'pveIpdCdNm', align:'center', title : 'TYPE', width: '100px', headerStyleclass : 'headerBackGroundGreenB', filter : {useRenderToFilter : true}, inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
				render : {type : 'string',
					rule : function(value, data) {
						var render_data = [{ value : ''}];
						render_data = render_data.concat(grSystmIpdCdNm);
						return render_data;
					}
				},
				editable : function(value, data) {
					var strSelectOption = '<option value="" >선택</option>';
					for(var i in grSystmIpdCdNm) {
						var exist = '';

						if (value && value.indexOf(grSystmIpdCdNm[i].value) != -1) {
							exist = ' selected';
						}
						strSelectOption += '<option value='+grSystmIpdCdNm[i].value+' '+exist+'>'+grSystmIpdCdNm[i].text+'</option>';
					}
					return '<select class="alopexgrid-default-renderer" >' + strSelectOption + '</select>';
				}
			},
			{ key : 'pveIpdCd', align:'center', title : '코드', width: '90px', headerStyleclass : 'headerBackGroundGreenB'},
			{ key : 'pveIpdRqrdCnt', align:'center', title : '소요수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveIpdInveCnt', align:'center', title : '재고수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
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
			{ key : 'pveIpdBuyCnt', align:'center', title : '구매수량', width: '70px', exportDataType: 'number', headerStyleclass : 'headerBackGroundGreenB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'invtIpdMtrlCost', align:'center', title : '물자비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtIpdCstrCost', align:'center', title : '공사비', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },
			{ key : 'invtIpdTotCost', align:'center', title : '합계', width: '80px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },


			{ key : 'invtTotCost', align:'center', title : '정류기+축전지+냉방기+IPD', width: '200px', exportDataType: 'number', headerStyleclass : 'headerBackGroundBlueB', render : function(value, data, render, mapping){ if(!isNaN(value)) return comMain.setComma(value); } },

			{ key : 'etcInsRsn', align:'center', title : '수기입력사유', width: '200px',  inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'etcRmk', align:'center', title : '비고', width: '200px',  inlineStyle : { background : function(value, data, mapping) { return inlineStyleBackgroundColor;} },
//				headerStyleclass : 'headerBackGroundBlueS',
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
			{ key : 'repMtsoYn', align:'center', title : '대표국사여부', width: '50px', hidden:true  }	// 숨김

			];

    	return colList;
    }

    this.imptFctInfGrid = function() {
    	var param =  $("#searchForm").getData();
    	$('#'+imptFctInfDataGrid).alopexGrid('dataEmpty');
    	var headerMappingN = [
    							 {fromIndex:0, toIndex:2, title:"업로드 기준"} // 최상단 그룹
    							,{fromIndex:7, toIndex:8, title:"기본정보"} // 사용자양식을 위해 추가
    							,{fromIndex:9, toIndex:9, title:"총소비전력"} // 최상단 그룹
					   			,{fromIndex:10, toIndex:13, title:"MR-H 정류기 현황"}
					   			,{fromIndex:14, toIndex:17, title:"MR-1 정류기 현황"}
					   			,{fromIndex:18, toIndex:21, title:"MR-2 정류기 현황"}
					   			,{fromIndex:22, toIndex:25, title:"MR-S 정류기 현황"}
					   			,{fromIndex:26, toIndex:29, title:"CRS-1800 정류기 현황"}
					   			,{fromIndex:30, toIndex:31, title:"48V1600 리튬 축전지 현황"}
					   			,{fromIndex:32, toIndex:33, title:"27V3200 리튬 축전지 현황"}
					   			,{fromIndex:34, toIndex:35, title:"납 축전지 현황"}
					   			,{fromIndex:36, toIndex:37, title:"냉방기(층) 현황"}
					   			,{fromIndex:38, toIndex:39, title:"IPD(기존)"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:40, toIndex:41, title:"정류기 소요용량[A]"}
					   			,{fromIndex:42, toIndex:43, title:"축전지 소요용량[A]"}
					   			,{fromIndex:44, toIndex:45, title:"냉방기 소요용량[RT]"}
					   			,{fromIndex:46, toIndex:50, title:"정류기 48V 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:51, toIndex:54, title:"정류기 모듈 48V 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:55, toIndex:59, title:"정류기 27V 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:60, toIndex:63, title:"정류기 모듈 27V 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:64, toIndex:67, title:"제어모듈 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'

					   			,{fromIndex:68, toIndex:72, title:"정류기 48V 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:73, toIndex:76, title:"정류기 모듈 48V 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:77, toIndex:81, title:"정류기 27V 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:82, toIndex:85, title:"정류기 모듈 27V 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:86, toIndex:89, title:"제어모듈 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:90, toIndex:92, title:"정류기 투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}

					   			,{fromIndex:93, toIndex:97, title:"리튬 축전지 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:98, toIndex:101, title:"리튬 모듈 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'
					   			,{fromIndex:102, toIndex:106, title:"납 축전지 투자(SYSTEM)"} //, headerStyleclass : 'headerBackGroundBlueS'

					   			,{fromIndex:107, toIndex:111, title:"리튬 축전지 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:112, toIndex:115, title:"리튬 모듈 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:116, toIndex:120, title:"납 축전지 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:121, toIndex:123, title:"축전지 투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}

					   			,{fromIndex:124, toIndex:128, title:"냉방기 투자(SYSTEM)"}
					   			,{fromIndex:129, toIndex:133, title:"냉방기 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:134, toIndex:136, title:"냉방기 투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}

					   			,{fromIndex:137, toIndex:141, title:"IPD 투자(SYSTEM)"}
					   			,{fromIndex:142, toIndex:146, title:"IPD 투자(수동)", headerStyleclass : 'headerBackGroundGreenS'}
					   			,{fromIndex:147, toIndex:149, title:"IPD 투자비(천원)", headerStyleclass : 'headerBackGroundBlueS'}
					   			,{fromIndex:150, toIndex:150, title:"투자비 합계(천원)", headerStyleclass : 'headerBackGroundBlueS'}
					   			,{fromIndex:151, toIndex:152, title:"기타"}

				   			 ];
        //그리드 생성
        $('#'+imptFctInfDataGrid).alopexGrid({
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

			columnFixUpto : 'mtsoCntrTypNm',
			headerGroup : headerMappingN,
    		columnMapping: imptFctInf.imptFctInfGridCol() ,
    		footer : {
    			position : 'buttom',
    			footerMapping : [
    				{columnIndex : 5, colspan:true, align : 'center', title : '합계'},
    				{columnIndex : 9, align : 'center', render : 'sum(totCnsmEpwrVal)'},
    				{columnIndex : 10, align : 'center', render : 'sum(exstMrhSystmCnt)'},
    				{columnIndex : 11, align : 'center', render : 'sum(exstMrhRtfMdulCnt)'},
    				{columnIndex : 12, align : 'center', render : 'sum(exstMrhUseLoadVal)'},
    				{columnIndex : 13, align : 'center', render : 'sum(exstMrhMoreCapaVal)'},
    				{columnIndex : 14, align : 'center', render : 'sum(exstMr1SystmCnt)'},
    				{columnIndex : 15, align : 'center', render : 'sum(exstMr1RtfMdulCnt)'},
    				{columnIndex : 16, align : 'center', render : 'sum(exstMr1UseLoadVal)'},
    				{columnIndex : 17, align : 'center', render : 'sum(exstMr1MoreCapaVal)'},
    				{columnIndex : 18, align : 'center', render : 'sum(exstMr2SystmCnt)'},
    				{columnIndex : 19, align : 'center', render : 'sum(exstMr2RtfMdulCnt)'},
    				{columnIndex : 20, align : 'center', render : 'sum(exstMr2UseLoadVal)'},
    				{columnIndex : 21, align : 'center', render : 'sum(exstMr2MoreCapaVal)'},
    				{columnIndex : 22, align : 'center', render : 'sum(exstMrsSystmCnt)'},
    				{columnIndex : 23, align : 'center', render : 'sum(exstMrsRtfMdulCnt)'},
    				{columnIndex : 24, align : 'center', render : 'sum(exstMrsUseLoadVal)'},
    				{columnIndex : 25, align : 'center', render : 'sum(exstMrsMoreCapaVal)'},
    				{columnIndex : 26, align : 'center', render : 'sum(exstCrs1800SystmCnt)'},
    				{columnIndex : 27, align : 'center', render : 'sum(exstCrs1800RtfMdulCnt)'},
    				{columnIndex : 28, align : 'center', render : 'sum(exstCrs1800UseLoadVal)'},
    				{columnIndex : 29, align : 'center', render : 'sum(exstCrs1800MoreCapaVal)'},
    				{columnIndex : 30, align : 'center', render : 'sum(exstV48LipoSystmCnt)'},
    				{columnIndex : 31, align : 'center', render : 'sum(exstV48LipoMdulCnt)'},
    				{columnIndex : 32, align : 'center', render : 'sum(exstV27LipoSystmCnt)'},
    				{columnIndex : 33, align : 'center', render : 'sum(exstV27LipoMdulCnt)'},
//    				{columnIndex : 34, align : 'center', render : 'sum(exstBatrySystmNm)'},
    				{columnIndex : 35, align : 'center', render : 'sum(exstBatryCellCnt)'},
    				{columnIndex : 36, align : 'center', render : 'sum(exstArcnFcltsCapaVal)'},
    				{columnIndex : 37, align : 'center', render : 'sum(exstArcnCommEpwrVal)'},
    				{columnIndex : 38, align : 'center', render : 'sum(exstIpdACnt)'},
    				{columnIndex : 39, align : 'center', render : 'sum(exstIpdBCnt)'},
    				{columnIndex : 40, align : 'center', render : 'sum(calcRtfV48CapaVal)'},
    				{columnIndex : 41, align : 'center', render : 'sum(calcRtfV27CapaVal)'},
    				{columnIndex : 42, align : 'center', render : 'sum(calcBatryV48CapaVal)'},
    				{columnIndex : 43, align : 'center', render : 'sum(calcBatryV27CapaVal)'},
    				{columnIndex : 44, align : 'center', render : 'sum(calcArcnNeedCapaVal)'},
    				{columnIndex : 45, align : 'center', render : 'sum(calcArcnShtgCapaVal)'},
//    				{columnIndex : 46, align : 'center', render : 'sum(systmRtfV48CdNm)'},
//    				{columnIndex : 47, align : 'center', render : 'sum(systmRtfV48Cd)'},
    				{columnIndex : 48, align : 'center', render : 'sum(systmRtfV48RqrdCnt)'},
    				{columnIndex : 49, align : 'center', render : 'sum(systmRtfV48InveCnt)'},
    				{columnIndex : 50, align : 'center', render : 'sum(systmRtfV48BuyCnt)'},
//    				{columnIndex : 51, align : 'center', render : 'sum(systmRtfMdulV48Cd)'},
    				{columnIndex : 52, align : 'center', render : 'sum(systmRtfMdulV48RqrdCnt)'},
    				{columnIndex : 53, align : 'center', render : 'sum(systmRtfMdulV48InveCnt)'},
    				{columnIndex : 54, align : 'center', render : 'sum(systmRtfMdulV48BuyCnt)'},
//    				{columnIndex : 55, align : 'center', render : 'sum(systmRtfV27CdNm)'},
//    				{columnIndex : 56, align : 'center', render : 'sum(systmRtfV27Cd)'},
    				{columnIndex : 57, align : 'center', render : 'sum(systmRtfV27RqrdCnt)'},
    				{columnIndex : 58, align : 'center', render : 'sum(systmRtfV27InveCnt)'},
    				{columnIndex : 59, align : 'center', render : 'sum(systmRtfV27BuyCnt)'},
//    				{columnIndex : 60, align : 'center', render : 'sum(systmRtfMdulV27Cd)'},
    				{columnIndex : 61, align : 'center', render : 'sum(systmRtfMdulV27RqrdCnt)'},
    				{columnIndex : 62, align : 'center', render : 'sum(systmRtfMdulV27InveCnt)'},
    				{columnIndex : 63, align : 'center', render : 'sum(systmRtfMdulV27BuyCnt)'},
//    				{columnIndex : 64, align : 'center', render : 'sum(systmCtrlMdulCd)'},
    				{columnIndex : 65, align : 'center', render : 'sum(systmCtrlMdulRqrdCnt)'},
    				{columnIndex : 66, align : 'center', render : 'sum(systmCtrlMdulInveCnt)'},
    				{columnIndex : 67, align : 'center', render : 'sum(systmCtrlMdulBuyCnt)'},
//    				{columnIndex : 68, align : 'center', render : 'sum(pveRtfV48CdNm)'},
//    				{columnIndex : 69, align : 'center', render : 'sum(pveRtfV48Cd)'},
    				{columnIndex : 70, align : 'center', render : 'sum(pveRtfV48RqrdCnt)'},
    				{columnIndex : 71, align : 'center', render : 'sum(pveRtfV48InveCnt)'},
    				{columnIndex : 72, align : 'center', render : 'sum(pveRtfV48BuyCnt)'},
//    				{columnIndex : 73, align : 'center', render : 'sum(pveRtfMdulV48Cd)'},
    				{columnIndex : 74, align : 'center', render : 'sum(pveRtfMdulV48RqrdCnt)'},
    				{columnIndex : 75, align : 'center', render : 'sum(pveRtfMdulV48InveCnt)'},
    				{columnIndex : 76, align : 'center', render : 'sum(pveRtfMdulV48BuyCnt)'},
//    				{columnIndex : 77, align : 'center', render : 'sum(pveRtfV27CdNm)'},
//    				{columnIndex : 78, align : 'center', render : 'sum(pveRtfV27Cd)'},
    				{columnIndex : 79, align : 'center', render : 'sum(pveRtfV27RqrdCnt)'},
    				{columnIndex : 80, align : 'center', render : 'sum(pveRtfV27InveCnt)'},
    				{columnIndex : 81, align : 'center', render : 'sum(pveRtfV27BuyCnt)'},
//    				{columnIndex : 82, align : 'center', render : 'sum(pveRtfMdulV27Cd)'},
    				{columnIndex : 83, align : 'center', render : 'sum(pveRtfMdulV27RqrdCnt)'},
    				{columnIndex : 84, align : 'center', render : 'sum(pveRtfMdulV27InveCnt)'},
    				{columnIndex : 85, align : 'center', render : 'sum(pveRtfMdulV27BuyCnt)'},
//    				{columnIndex : 86, align : 'center', render : 'sum(pveCtrlMdulCd)'},
    				{columnIndex : 87, align : 'center', render : 'sum(pveCtrlMdulRqrdCnt)'},
    				{columnIndex : 88, align : 'center', render : 'sum(pveCtrlMdulInveCnt)'},
    				{columnIndex : 89, align : 'center', render : 'sum(pveCtrlMdulBuyCnt)'},
    				{columnIndex : 90, align : 'center', render : 'sum(invtRtfMtrlCost)'},
    				{columnIndex : 91, align : 'center', render : 'sum(invtRtfCstrCost)'},
    				{columnIndex : 92, align : 'center', render : 'sum(invtRtfTotCost)'},
//    				{columnIndex : 93, align : 'center', render : 'sum(systmLipoCdNm)'},
//    				{columnIndex : 94, align : 'center', render : 'sum(systmLipoCd)'},
    				{columnIndex : 95, align : 'center', render : 'sum(systmLipoRqrdCnt)'},
    				{columnIndex : 96, align : 'center', render : 'sum(systmLipoInveCnt)'},
    				{columnIndex : 97, align : 'center', render : 'sum(systmLipoBuyCnt)'},
//    				{columnIndex : 98, align : 'center', render : 'sum(systmLipoMdulCd)'},
    				{columnIndex : 99, align : 'center', render : 'sum(systmLipoMdulRqrdCnt)'},
    				{columnIndex : 10, align : 'center', render : 'sum(systmLipoMdulInveCnt)'},
    				{columnIndex : 101, align : 'center', render : 'sum(systmLipoMdulBuyCnt)'},
//    				{columnIndex : 102, align : 'center', render : 'sum(systmBatryCdNm)'},
//    				{columnIndex : 103, align : 'center', render : 'sum(systmBatryCd)'},
    				{columnIndex : 104, align : 'center', render : 'sum(systmBatryRqrdCnt)'},
    				{columnIndex : 105, align : 'center', render : 'sum(systmBatryInveCnt)'},
    				{columnIndex : 106, align : 'center', render : 'sum(systmBatryBuyCnt)'},
//    				{columnIndex : 107, align : 'center', render : 'sum(pveLipoCdNm)'},
//    				{columnIndex : 108, align : 'center', render : 'sum(pveLipoCd)'},
    				{columnIndex : 109, align : 'center', render : 'sum(pveLipoRqrdCnt)'},
    				{columnIndex : 110, align : 'center', render : 'sum(pveLipoInveCnt)'},
    				{columnIndex : 111, align : 'center', render : 'sum(pveLipoBuyCnt)'},
//    				{columnIndex : 112, align : 'center', render : 'sum(pveLipoMdulCd)'},
    				{columnIndex : 113, align : 'center', render : 'sum(pveLipoMdulRqrdCnt)'},
    				{columnIndex : 114, align : 'center', render : 'sum(pveLipoMdulInveCnt)'},
    				{columnIndex : 115, align : 'center', render : 'sum(pveLipoMdulBuyCnt)'},
//    				{columnIndex : 116, align : 'center', render : 'sum(pveBatryCdNm)'},
//    				{columnIndex : 117, align : 'center', render : 'sum(pveBatryCd)'},
    				{columnIndex : 118, align : 'center', render : 'sum(pveBatryRqrdCnt)'},
    				{columnIndex : 119, align : 'center', render : 'sum(pveBatryInveCnt)'},
    				{columnIndex : 120, align : 'center', render : 'sum(pveBatryBuyCnt)'},
    				{columnIndex : 121, align : 'center', render : 'sum(invtBatryMtrlCost)'},
    				{columnIndex : 122, align : 'center', render : 'sum(invtBatryCstrCost)'},
    				{columnIndex : 123, align : 'center', render : 'sum(invtBatryTotCost)'},
//    				{columnIndex : 124, align : 'center', render : 'sum(systmArcnCdNm)'},
//    				{columnIndex : 125, align : 'center', render : 'sum(systmArcnCd)'},
    				{columnIndex : 126, align : 'center', render : 'sum(systmArcnRqrdCnt)'},
    				{columnIndex : 127, align : 'center', render : 'sum(systmArcnInveCnt)'},
    				{columnIndex : 128, align : 'center', render : 'sum(systmArcnBuyCnt)'},
//    				{columnIndex : 129, align : 'center', render : 'sum(pveArcnCdNm)'},
//    				{columnIndex : 130, align : 'center', render : 'sum(pveArcnCd)'},
    				{columnIndex : 131, align : 'center', render : 'sum(pveArcnRqrdCnt)'},
    				{columnIndex : 132, align : 'center', render : 'sum(pveArcnInveCnt)'},
    				{columnIndex : 133, align : 'center', render : 'sum(pveArcnBuyCnt)'},
    				{columnIndex : 134, align : 'center', render : 'sum(invtArcnMtrlCost)'},
    				{columnIndex : 135, align : 'center', render : 'sum(invtArcnCstrCost)'},
    				{columnIndex : 136, align : 'center', render : 'sum(invtArcnTotCost)'},
//    				{columnIndex : 137, align : 'center', render : 'sum(systmIpdCdNm)'},
//    				{columnIndex : 138, align : 'center', render : 'sum(systmIpdCd)'},
    				{columnIndex : 139, align : 'center', render : 'sum(systmIpdRqrdCnt)'},
    				{columnIndex : 140, align : 'center', render : 'sum(systmIpdInveCnt)'},
    				{columnIndex : 141, align : 'center', render : 'sum(systmIpdBuyCnt)'},
//    				{columnIndex : 142, align : 'center', render : 'sum(pveIpdCdNm)'},
//    				{columnIndex : 143, align : 'center', render : 'sum(pveIpdCd)'},
    				{columnIndex : 144, align : 'center', render : 'sum(pveIpdRqrdCnt)'},
    				{columnIndex : 145, align : 'center', render : 'sum(pveIpdInveCnt)'},
    				{columnIndex : 146, align : 'center', render : 'sum(pveIpdBuyCnt)'},
    				{columnIndex : 147, align : 'center', render : 'sum(invtIpdMtrlCost)'},
    				{columnIndex : 148, align : 'center', render : 'sum(invtIpdCstrCost)'},
    				{columnIndex : 149, align : 'center', render : 'sum(invtIpdTotCost)'},
    				{columnIndex : 150, align : 'center', render : 'sum(invtTotCost)'}

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
//        $('#'+imptFctInfDataGrid).alopexGrid('footerData', footerDataObect);

        gridHide();

    };

    function gridHide() {

    	var hideColList = ['fctInvtId', 'afeYr', 'afeDgr'];

    	$('#'+imptFctInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');

	}
    function getTotalSum(values) {
    	var result = 0;
    	for (var i in values) {
    		result += parseFloat(values[i])
    	}
    	return AlopexGrid.renderUtil.addCommas(result);
    }

    function imptFctInfSetEventListener() {
    	$('#'+imptFctInfDataGrid).on('rowInlineEditEnd',function(e){
    		if (gClsDivCd == 'Y') {
    			$('#'+imptFctInfDataGrid).alopexGrid('showProgress');
        		var param = AlopexGrid.parseEvent(e).data;
    			var userId = $("#userId").val();
    			var afeYr = $("#afeYr").val();
    			var afeDgr = $("#afeDgr").val();
    			if (userId == "") { userId = "SYSTEM"; }
    			param.userId	 	= userId;
    			param.afeYr 		= afeYr;
    			param.afeDgr 		= afeDgr;

    			httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/mergeInvtImptFctInf', param, 'POST', 'InvtimptFctInf');
    		}


    	});

    	$('#btnExportFct').on('click', function(e) {
    		if (gClsDivCd == 'Y') {
    			var userId 	= $("#userId").val();
    			var afeYr 	= $("#afeYr").val();
    			var afeDgr 	= $("#afeDgr").val();
    			if (userId == "") { userId = "SYSTEM"; }
    			var param = {userId : userId, afeYr : afeYr, afeDgr :  afeDgr};
    			$('#'+imptFctInfDataGrid).alopexGrid('showProgress');
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/setExportFct', param, 'POST', 'ExportFct');
    		} else {
    			callMsgBox('','W', '마감된 AFE 차수 입니다. 수정 할수 없습니다.', function(msgId, msgRst){});
			    return;
			}


        });

    	$('#btnFctExcelUpload').on('click', function(e) {
    		if (gClsDivCd == 'Y') {
    			var afeYr 	= $("#afeYr").val();
    			var afeDgr 	= $("#afeDgr").val();
    			var data = {afeYr : afeYr, afeDgr :  afeDgr};
    			$a.popup({
	    		  	popid: 'ExcelUpload',
	    		  	title: 'Excel Upload',
	    		      url: '/tango-transmission-web/configmgmt/fctinvt/InvtImptFctInfExcelUpload.do',
	    		      windowpopup : true,
	    		      data: data,
	    		      modal: true,
	    		      movable:true,
	    		      width : window.innerWidth * 0.9,
	    		      height : 750,
	    		      callback : function(data) {
	    		    	 imptFctInf.setGrid(1,100000);
	    		      }
	    		});
    		} else {
    			callMsgBox('','W', '마감된 AFE 차수 입니다. 업로드 할 수 없습니다.', function(msgId, msgRst){});
			    return;
			}
    	});



    	 $('#btnLandBldExportExcel').on('click', function(e) {

    		//필터링 체크 여부
    		 var filtered = false;
    		 if (document.getElementsByClassName('alopexgrid-filter-dropdownbutton filtered').length > 0) {
    			 filtered = true;
    		 }

    		 $('#'+imptFctInfDataGrid).alopexGrid("showCol", ['fctInvtId', 'afeYr', 'afeDgr']);

    		var dt = new Date();
 			var recentY = dt.getFullYear();
 			var recentM = dt.getMonth() + 1;
 			var recentD = dt.getDate();

 			if(recentM < 10) recentM = "0" + recentM;
 			if(recentD < 10) recentD = "0" + recentD;

 			var recentYMD =  recentY +"-"+ recentM +"-"+ recentD;

 			var worker = new ExcelWorker({
 				excelFileName : '부대설비투자_주요설비_'+recentYMD,
 				sheetList : [{
 					sheetName : '주요설비',
 					$grid : $("#"+imptFctInfDataGrid)
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
 				    	    $('#'+imptFctInfDataGrid).alopexGrid("hideCol", hideColList, 'conceal');
 						}
 					}
 				}
 			});
         });

    };


	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'code1'){
    		grPveRtfV48CdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grPveRtfV48CdNm.push(resObj);
			}
    	}
    	if(flag == 'code2'){
    		grPveRtfV27CdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grPveRtfV27CdNm.push(resObj);
			}
    	}
    	if(flag == 'code5'){
    		grSystmLipoCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmLipoCdNm.push(resObj);
			}
    	}
    	if(flag == 'code4'){
    		grSystmBatryCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmBatryCdNm.push(resObj);
			}
    	}
    	if(flag == 'code6'){
    		grSystmArcnCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmArcnCdNm.push(resObj);
			}
    	}

    	if(flag == 'code7'){
    		grSystmIpdCdNm = [];
			for(var i=0; i < response.codeList.length; i++){
				var resObj = {value : response.codeList[i].codeVal, text : response.codeList[i].codeTxt};
				grSystmIpdCdNm.push(resObj);
			}
    	}

    	if(flag == 'ExportFct'){
    		$('#'+imptFctInfDataGrid).alopexGrid('hideProgress');
    		imptFctInf.setGrid(1,100);
    	}

    	if(flag == 'InvtimptFctInf'){
    		$('#'+imptFctInfDataGrid).alopexGrid('hideProgress');
    		if (response.InvtImptFct.length > 0) {
    			var objData = response.InvtImptFct[0];
        		$('#'+imptFctInfDataGrid).alopexGrid('dataEdit', objData, { fctInvtId : objData.fctInvtId});
        		$('#'+imptFctInfDataGrid).alopexGrid("viewUpdate");
    		}
    	}

    	if(flag == 'search'){
    		$('#'+imptFctInfDataGrid).alopexGrid('hideProgress');
    		setSPGrid(imptFctInfDataGrid, response, response.InvtImptFctInfList);

    		var afeYr = $('#afeYr').val();
    		var afeDgr = $('#afeDgr').val();
    		var param = {afeYr : afeYr, afeDgr : afeDgr};
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getClsDivCd', param, 'GET', 'clsDivCd');
    	}

    	if(flag == 'clsDivCd'){
    		if (response.clsDivCdList.length > 0) {
    			gClsDivCd = 	response.clsDivCdList[0].clsDivCd;
    			if (gClsDivCd !='Y') {
    				$("#gClsDivFctInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
    			} else {
    				$("#gClsDivFctInfText").html("");
    			}
    		} else {
    			$("#gClsDivFctInfText").html("<font color=red>※ 현재 차수는 마감된 AFE 차수 입니다.(수정, 엑셀 업로드 불가)</font>");
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
       	$('#'+GridID).alopexGrid('dataScroll' ,{_index:{row: 0, column : imptFctInfScrollOffset.column}});
       	$('#'+GridID).alopexGrid('updateOption',{columnFixUpto : 'mtsoCntrTypNm'});
	}

    this.setGrid = function(page, rowPerPage) {

    	imptFctInfScrollOffset = $('#'+imptFctInfDataGrid).alopexGrid('scrollOffset');	// 스크롤 위치 가져옴

    	$('#InvtimptFctInfPageNo').val(page);
    	$('#InvtimptFctInfRowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var ckGubun = $("input:checkbox[id=repMtsoYn]").is(":checked") ? true : false;
    	if(ckGubun){
    		param.repMtsoYn = "Y";
       	} else {
       		param.repMtsoYn = "";
       	}

    	var subParam =  $("#InvtimptFctInfForm").getData();
    	var page = $('#InvtimptFctInfPageNo').val();
    	var rowPerPage = $('#InvtimptFctInfRowPerPage').val();
    	param.page = page;
    	param.rowPerPage = rowPerPage;

    	$('#'+imptFctInfDataGrid).alopexGrid('showProgress')
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fctinvtmgmt/getInvtImptFctInfList', param, 'GET', 'search');

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