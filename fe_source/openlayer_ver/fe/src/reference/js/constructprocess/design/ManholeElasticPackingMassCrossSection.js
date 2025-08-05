/**
 * ManholeElasticPackingMassCrossSection.js
 *
 * @author P096293
 * @date 2016. 8. 30. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var v1RowIndex = ''; //DTS_V1 row값
	var dsnSetlDiv = "";
	var obj = null;
	
	var m = {
		gridObj : $('#dataGrid'),
		hVal : function (id){
			return $('#'+id).text();
		},
		form : {
			formObject : $('form[name=searchForm')
		},
		api : {
			url : function (number){
				switch(number){
				default : break;
				case 1 : return 'tango-transmission-biz/transmission/constructprocess/design/mass/getDetail'; break;
				case 2 : return 'tango-transmission-biz/transmission/constructprocess/design/conductlinedetails/commoncodes/'; break;
				case 3 : return 'tango-transmission-biz/transmission/constructprocess/design/mass/codenames/'; break;
				}
			}
		},
		flag : function (number){
			switch(number){
			default : return 'save'; break;
			case 1 : return 'search'; break;
			case 2 : return 'combo'; break;
			case 3 : return 'codenames'; break;
			}
		},
		button : function (number){
			return 0 == number ? $('#btnSave') : $('#btnReload');
		},
		
		setting : function (number){
			switch(number){
			case 0 : return {
				'B1' : 1.3,
				'B2' : 1.7,
				'B3' : 1.8,
				'B4' : 2.5,
				'H1' : 1.7,
				'H2' : 2.15,
				'H3' : 2.55,
				'L1' : 3.2,
				'L2' : 3.6,
				'L3' : 3.7,
				'L4' : 4.4
			}; break;
			case 1 : return {
				'B1' : 1,
				'B2' : 1.4,
				'B3' : 1.5,
				'B4' : 2.2,
				'H1' : 1.7,
				'H2' : 2.15,
				'H3' : 2.55,
				'L1' : 2,
				'L2' : 2.4,
				'L3' : 2.5,
				'L4' : 3.2
			}; break;
			case 2 : return {
				'B1' : 1,
				'B2' : 1.4,
				'B3' : 1.5,
				'B4' : 2.2,
				'H1' : 1.4,
				'H2' : 1.85,
				'H3' : 2.25,
				'L1' : 1.9,
				'L2' : 2.3,
				'L3' : 2.4,
				'L4' : 3.1
			}; break;
			case 3 : return {
				'B1' : 0.8,
				'B2' : 1.2,
				'B3' : 1.3,
				'B4' : 2,
				'H1' : 1.1,
				'H2' : 1.55,
				'H3' : 1.95,
				'L1' : 1.7,
				'L2' : 2.1,
				'L3' : 2.2,
				'L4' : 2.9
			}; break;
			case 4 : return {
				'B1' : 0.7,
				'B2' : 1,
				'B3' : 1.1,
				'B4' : 1.8,
				'H1' : 0.75,
				'H2' : 1.1,
				'H3' : 1.5,
				'L1' : 1.3,
				'L2' : 1.6,
				'L3' : 1.7,
				'L4' : 2.4
			}; break;
			case 5 : return {
				'B1' : 0.45,
				'B2' : 0.75,
				'B3' : 0.85,
				'B4' : 1.55,
				'H1' : 0.7,
				'H2' : 1.05,
				'H3' : 1.3,
				'L1' : 0.95,
				'L2' : 1.25,
				'L3' : 1.35,
				'L4' : 2.05
			}; break;
			}
		}
	}
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		initGrid();
		init(param);
        setEventListener();
    }
    
    //초기화면
    var init = function (param) {
    	//변수명과 파라미터의 값이 동일해함
    	$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});
    	
    	if(0 < param.submDt.length) {
			m.button(0).setEnabled(false);
		}
    	
    	dsnSetlDiv = param.dsnSetlDiv;
    	
    	if('' == param.cstrCd || '' == param.cdlnSctnSrno) {
			$a.close();
		} else {
			obj = param;
			
			model.get({
	    		url: "tango-transmission-biz/transmission/constructprocess/design/mass/getDetail",
	    		data: {"cstrCd":param.cstrCd, "cdlnSctnSrno":param.cdlnSctnSrno, "dsnSetlDiv":dsnSetlDiv},
	    		method: "GET",
	    		flag: "getMass"
			}).done(successCallback).fail(failCallback);
		}
    }
    
    //Grid 초기화
    var initGrid = function () {
    	AlopexGrid.setup({
    		autoColumnIndex: true,
    		autoResize: true,
    		rowSingleSelect: true,
    		rowClickSelect: true,
    		defaultColumnMapping:{
    			sorting: true
			},
			message: {
				nodata: '<div style="text-align:center;">조회된 결과가 없습니다.</div>'
			}
    	});
    	
    	
    	gridHide();
    }
    
    // 컬럼 숨기기
    var gridHide = function () {    	
	}
    
    var setEventListener = function () {
    	//저장
    	m.button(0).on('click', function (){
    		var param = {
				'flag':$("input[name=flag]").val(),
				'dsnSetlDiv':dsnSetlDiv,
			   	'cstrCd':$("input[name=cstrCd]").val(),
			   	'cdlnSctnSrno':$("input[name=cdlnSctnSrno]").val(), 
			   	'skAfcoDivCd':$("input[name=skAfcoDivCd]").val(),
			   	'fcltKndCd':$('input[name=fcltKndCd]').val(), 
			   	'cdlnMhAryDivCd':$('select[name=cdlnMhAryDivCd]').val(),
			   	'aplyMassCd':$('input[name=aplyMassCd]').val(),
			   	'tptnTruckKndCd':$('input[name=tptnTruckKndCd]').val(),
			   	'sufcHght':$('select[name=sufcHght]').val(),
			   	'sufcWdth':$('input[name=sufcWdth]').val(),
			   	'wheResoilAplyYn':$('input[name=wheResoilAplyYn]').val(),
			   	'allHght':$('input[name=allHght]').val(),
			   	'excvTrngAng':$('input[name=excvTrngAng]').val(),
			   	'rockAplyDivCd':$('select[name=rockAplyDivCd]').val(),
			   	'assiBaseHght':$('select[name=assiBaseHght]').val(),
			   	'assiBaseGadtTypCd':$('select[name=assiBaseGadtTypeCd]').val(),
			   	'fsbtPrvntAssiBaseHght':$('input[name=fsbtPrvntAssiBaseHght]').val(),
			   	'assiBaseGadtAplyEyn':$('input[name=assiBaseGadtAplyEyn]').val(),
			   	'asptPavmtCutLenm':$('#asptPavmtCutLenm').text(),
			   	'conCutLenm':$('#conCutLenm').text(),
			   	'asptPavmtStBrkgVlme':$('#asptPavmtStBrkgVlme').text(),
			   	'conPavmtBrkgVlme':$('#conPavmtBrkgVlme').text(),
			   	'sfrokPavmtBrkgVlme':$('#sfrokPavmtBrkgVlme').text(),
			   	'gnrlRckPavmtBrkgVlme':$('#gnrlRckPavmtBrkgVlme').text(),
			   	'hdrokPavmtBrkgVlme':$('#hdrokPavmtBrkgVlme').text(),
			   	'hveqEcvtVlme':$('#hveqEcvtVlme').text(),
			   	'soilHveqEcvtVlme':$('#soilHveqEcvtVlme').text(),
			   	'hrscEcvtDistm1':$('#hrscEcvtDistm1').text(),
			   	'hrscEcvtDistm2':$('#hrscEcvtDistm2').text(),
			   	'hrscEcvtDistm3':$('#hrscEcvtDistm3').text(),
			   	'resoilVlme':$('#resoilVlme').text(),
			   	'soilCpctRate':$('#soilCpctRate').text(),
			   	'resoilCpctVlme':$('#resoilCpctVlme').text(),
			   	'rsnpRate':$('#rsnpRate').text(),
			   	'rprpHveqEcvtVlme':$('#rprpHveqEcvtVlme').text(),
			   	'hveqSsopVlme':$('#hveqSsopVlme').text(),
			   	'pvmtSkimAr':$('#pvmtSkimAr').text(),
			   	'stSufcClenAr':$('#stSufcClenAr').text(),
			   	'rcovBaseWdth':$('#rcovBaseWdth').text(),
			   	'rcovSufcHght1':$('#rcovSufcHght1').text(),
			   	'rcovBaseHght':$('#rcovBaseHght').text(),
			   	'rcovAssiBaseHght1':$('#rcovAssiBaseHght1').text(),
			   	'rcovAssiBaseHght2':$('#rcovAssiBaseHght2').text(),
			   	'strceVlme':$('#strceVlme').text(),
			   	'clotpDivCd':$('input[name=iccrClotpDivCd]').val(),
			   	'clotpDivNm':$('#iccrClotpDivCdNm').text(),
			   	'rcovSufcHght2':$('input[name=rcovSufcHght2]').val(),
			   	'gadtRate':$('select[name=gadtRate]').val(),
			   	'rivrUngrYn':$('input[name=rivrUngrYn]').val(),
			   	'botmDigWdth':$('input[name=botmDigWdth]').val(),
			   	'rfctConRcovAplyYn':$('input[name=rfctConRcovAplyYn]').val(),
			   	'rfctConDigHght':$('input[name=rfctConDigHght]').val(),
			   	'rfctConDigAplyYn':$('input[name=rfctConDigAplyYn]').val(),
			   	'rfctConRcovHght':$('input[name=rfctConRcovHght]').val(),
			   	'rcovRmcnVlme':$('input[name=rcovRmcnVlme]').val(),
			   	'conRcovAr':$('input[name=conRcovAr]').val(),
			   	'estLwstBdwh':$('input[name=estLwstBdwh]').val(),
			   	'frstRegUserId':$('input[name=frstRegUserId]').val(), 
			   	'lastChgUserId':$('input[name=lastChgUserId]').val()
	    	}
    		
    		model.post({
				url : 'tango-transmission-biz/transmission/constructprocess/design/mass',
				data : param,
				flag : m.flag(0)
			}).done(successCallback).fail(failCallback);
    	});
    	
    	m.form.formObject.find('select').on('change', function (){
    		valueChange();
    	});
    }
	
    var valueChange = function (){
    	setHeight();
    }
    
    var setHeight = function (){
    	var fcltKndCd = $('input[name=fcltKndCd]').val();
    	var spanObj = new Object();
    	
    	spanObj.h1 = truncate(parseFloat($('select[name=sufcHght]').val()),3);
    	spanObj.t1 = 'T='+(parseFloat(spanObj.h1)*100)+'cm';
    	spanObj.h2 = '0.100';
    	spanObj.h3 = truncate((0.3 - parseFloat(spanObj.h1) - parseFloat(spanObj.h2)),3);
    	spanObj.h4 = truncate((0.8 - (parseFloat(spanObj.h1) + parseFloat(spanObj.h2) + parseFloat(spanObj.h3))),3);
    	spanObj.h5 = '0.2';
    	
    	if ('61' == fcltKndCd || '62' == fcltKndCd || '63' == fcltKndCd) {
    		spanObj.h6 = '1';
    	} else if ('64' == fcltKndCd) {
    		spanObj.h6 = '0.95';
    	} else if ('65' == fcltKndCd) {
    		spanObj.h6 = '0.3';
    	} else if ('66' == fcltKndCd) {
    		spanObj.h6 = '0.5';
    	} else {
    		spanObj.h6 = '0';
    	}
    	
    	spanObj.h7 = truncate((parseFloat(m.setting(v1RowIndex)['H3']) - parseFloat(spanObj.h1) - parseFloat(spanObj.h2) - parseFloat(spanObj.h3) - parseFloat(spanObj.h4) - parseFloat(spanObj.h5) - parseFloat(spanObj.h6)),3);
    	spanObj.h8 = truncate(parseFloat($('select[name=sufcHght]').val()),3);
    	spanObj.h9 = '0.100';
    	spanObj.h11 = '0.100';
    	spanObj.h10 = truncate(parseFloat(m.setting(v1RowIndex)['H3']) - parseFloat(spanObj.h8) - parseFloat(spanObj.h9) - parseFloat(spanObj.h11),3);
    	
    	for (var key in spanObj) {
			$('#'+key).text(spanObj[key]);
			setVisible(key);
		}
    	
    	setWidth();
    }

    var setWidth = function (){
    	var param =  m.form.formObject.getData();
    	var spanObj = new Object();
    	var obj = m.hVal;
    	var cdlnMhAryDivCd = $('select[name=cdlnMhAryDivCd]').val();
    	
    	//w8
    	if ('11' == cdlnMhAryDivCd) { //PC
    		spanObj.w8 = parseFloat(m.setting(v1RowIndex)['L3']);
    	} else if ('12' == cdlnMhAryDivCd) { //현장타설
    		spanObj.w8 = parseFloat(m.setting(v1RowIndex)['L4']);
    	}
    	
    	//w1,w2,w3,w4,w5,w6,w7
    	if ('1' == param.rockAplyDivCd) { //미적용
    		if ('0.3' == $('select[name=gadtRate]').val()) { //구배율
    			spanObj.w1 = truncate(((parseFloat(obj('h3')) + parseFloat(obj('h4')) + parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.w8)),3);
    			spanObj.w2 = truncate(spanObj.w1,3);
    			spanObj.w3 = truncate(((parseFloat(obj('h4')) + parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.w8)),3);
    			spanObj.w4 = truncate(((parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.w8)),3);
    			spanObj.w5 = truncate(((parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.w8)),3);
    			spanObj.w6 = truncate(((parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.w8)),3);
    			spanObj.w7 = truncate(((parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.w8)),3);
    		} else {
    			spanObj.w1 = spanObj.w8;
        		spanObj.w2 = spanObj.w8;
        		spanObj.w3 = spanObj.w8;
        		spanObj.w4 = spanObj.w8;
        		spanObj.w5 = spanObj.w8;
        		spanObj.w6 = spanObj.w8;
        		spanObj.w7 = spanObj.w8;
    		}
    	} else {
    		spanObj.w1 = spanObj.w8;
    		spanObj.w2 = spanObj.w8;
    		spanObj.w3 = spanObj.w8;
    		spanObj.w4 = spanObj.w8;
    		spanObj.w5 = spanObj.w8;
    		spanObj.w6 = spanObj.w8;
    		spanObj.w7 = spanObj.w8;
    	}
    	
    	for (var key in spanObj) {
			$('#'+key).text(spanObj[key]);
			setVisible(key);
		}
    	
    	massCalc();
    }
    
    var massCalc = function (){
    	var param =  m.form.formObject.getData();
    	var spanObj = new Object();
    	var obj = m.hVal;
    	var cdlnMhAryDivCd = $('select[name=cdlnMhAryDivCd]').val();
    	
    	//d8
    	if ('11' == cdlnMhAryDivCd) { //PC
    		spanObj.d8 = parseFloat(m.setting(v1RowIndex)['B3']);
    	} else if ('12' == cdlnMhAryDivCd) { //현장타설
    		spanObj.d8 = parseFloat(m.setting(v1RowIndex)['B4']);
    	}
    	
    	//d1,d2,d3,d4,d5,d6,d7
    	if ('1' == param.rockAplyDivCd) { //미적용
    		if ('0.3' == $('select[name=gadtRate]').val()) { //구배율
    			spanObj.d1 = truncate(((parseFloat(obj('h3')) + parseFloat(obj('h4')) + parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.d8)),3);
    			spanObj.d2 = truncate(spanObj.d1,3);
    			spanObj.d3 = truncate(((parseFloat(obj('h4')) + parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.d8)),3);
    			spanObj.d4 = truncate(((parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.d8)),3);
    			spanObj.d5 = truncate(((parseFloat(obj('h6')) + parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.d8)),3);
    			spanObj.d6 = truncate(((parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.d8)),3);
    			spanObj.d7 = truncate(((parseFloat(obj('h7')))*0.6 + parseFloat(spanObj.d8)),3);
    		} else {
    			spanObj.d1 = spanObj.d8;
        		spanObj.d2 = spanObj.d8;
        		spanObj.d3 = spanObj.d8;
        		spanObj.d4 = spanObj.d8;
        		spanObj.d5 = spanObj.d8;
        		spanObj.d6 = spanObj.d8;
        		spanObj.d7 = spanObj.d8;
    		}
    	} else {
    		spanObj.d1 = spanObj.d8;
    		spanObj.d2 = spanObj.d8;
    		spanObj.d3 = spanObj.d8;
    		spanObj.d4 = spanObj.d8;
    		spanObj.d5 = spanObj.d8;
    		spanObj.d6 = spanObj.d8;
    		spanObj.d7 = spanObj.d8;
    	}
    	
    	for (var key in spanObj) {
			$('#'+key).text(spanObj[key]);
		}
    	
    	setParam();
    }
    
    var setParam = function (){
    	var obj = m.hVal;
    	var rockAplyDivCd =$('select[name=rockAplyDivCd]').val();
    	var fcltKndCd = $('input[name=fcltKndCd]').val();
    	var assiBaseGadtTypeCd = $('select[name=assiBaseGadtTypeCd]').val();
    	/*var assiBaseGadtAplyEyn = $('select[name=assiBaseGadtAplyEyn]').val();*/
    	var cdlnMhAryDivCd = $('select[name=cdlnMhAryDivCd]').val();
    	
    	//01.포장절단 AS
    	$('#asptPavmtCutLenm').text(0);
    	//02.포장절단 CON
    	$('#conCutLenm').text(truncate((parseFloat(obj('w1')) + parseFloat(obj('d1'))) * 2, 3));
    	//03.포장깨기 AS
    	$('#asptPavmtStBrkgVlme').text(0);
    	//04.포장깨기 COM
    	$('#conPavmtBrkgVlme').text(truncate(parseFloat(obj('w1')) * parseFloat(obj('d1')) * (parseFloat(obj('h1')) + parseFloat(obj('h2'))),3));
    	//05.포장깨기 연암, 06.포장깨기 보통암, 07.포장깨기 경암, 08.중기터파기(사석), 09.중기터파기(토사), 10.인력터파기 0-1M, 11.인력터파기 1-2M, 12.인력터파기 2-3M
    	if ('2' == rockAplyDivCd) { //연암
    		$('#sfrokPavmtBrkgVlme').text(truncate((parseFloat(obj('w2')) * parseFloat(obj('d2')) * (parseFloat(obj('h3')) + parseFloat(obj('h4')) + parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))),2));
    		$('#gnrlRckPavmtBrkgVlme').text(0);
    		$('#hdrokPavmtBrkgVlme').text(0);
    		$('#hveqEcvtVlme').text(truncate(parseFloat($('#conPavmtBrkgVlme').text()) + parseFloat($('#sfrokPavmtBrkgVlme').text()),3));
    		$('#soilHveqEcvtVlme').text(0);
    		$('#hrscEcvtDistm1').text(0);
    		$('#hrscEcvtDistm2').text(0);
    		$('#hrscEcvtDistm3').text(0);
    	} else if  ('3' == rockAplyDivCd) { //보통암
    		$('#sfrokPavmtBrkgVlme').text(0);
    		$('#gnrlRckPavmtBrkgVlme').text(truncate((parseFloat(obj('w2')) * parseFloat(obj('d2')) * (parseFloat(obj('h3')) + parseFloat(obj('h4')) + parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))),3));
    		$('#hdrokPavmtBrkgVlme').text(0);
    		$('#hveqEcvtVlme').text(truncate(parseFloat($('#conPavmtBrkgVlme').text()) + parseFloat($('#gnrlRckPavmtBrkgVlme').text()),3));
    		$('#soilHveqEcvtVlme').text(0);
    		$('#hrscEcvtDistm1').text(0);
    		$('#hrscEcvtDistm2').text(0);
    		$('#hrscEcvtDistm3').text(0);
    	} else if  ('4' == rockAplyDivCd) { //경암
    		$('#sfrokPavmtBrkgVlme').text(0);
    		$('#gnrlRckPavmtBrkgVlme').text(0);
    		$('#hdrokPavmtBrkgVlme').text(truncate((parseFloat(obj('w2')) * parseFloat(obj('d2')) * (parseFloat(obj('h3')) + parseFloat(obj('h4')) + parseFloat(obj('h5')) + parseFloat(obj('h6')) + parseFloat(obj('h7')))),3));
    		$('#hveqEcvtVlme').text(truncate(parseFloat($('#conPavmtBrkgVlme').text()) + parseFloat($('#hdrokPavmtBrkgVlme').text()),3));
    		$('#soilHveqEcvtVlme').text(0);
    		$('#hrscEcvtDistm1').text(0);
    		$('#hrscEcvtDistm2').text(0);
    		$('#hrscEcvtDistm3').text(0);
    	} else {
    		$('#sfrokPavmtBrkgVlme').text(0);
    		$('#gnrlRckPavmtBrkgVlme').text(0);
    		$('#hdrokPavmtBrkgVlme').text(0)
    		$('#hveqEcvtVlme').text($('#conPavmtBrkgVlme').text());
    		$('#soilHveqEcvtVlme').text(truncate(((parseFloat(obj('w2')) + parseFloat(obj('w4'))) / 2) * ((parseFloat(obj('d2')) + parseFloat(obj('d4'))) / 2) * (parseFloat(obj('h3')) + parseFloat(obj('h4'))),3));
    		$('#hrscEcvtDistm1').text(truncate(((parseFloat(obj('w4')) + parseFloat(obj('w5'))) / 2) * ((parseFloat(obj('d4')) + parseFloat(obj('d5'))) / 2) * parseFloat(obj('h5')),3));
    		$('#hrscEcvtDistm2').text(truncate(((parseFloat(obj('w5')) + parseFloat(obj('w7'))) / 2) * ((parseFloat(obj('d5')) + parseFloat(obj('d7'))) / 2) * parseFloat(obj('h6')),3));
    		$('#hrscEcvtDistm3').text(truncate(((parseFloat(obj('w7')) + parseFloat(obj('w8'))) / 2) * ((parseFloat(obj('d7')) + parseFloat(obj('d8'))) / 2) * parseFloat(obj('h7')),3));
    	}
    	
    	//14.토사다짐
    	$('#soilCpctRate').text(0);
    	//15.환토다짐
    	if ('65' == fcltKndCd) {
    		$('#resoilCpctVlme').text(truncate((parseFloat(obj('w3')) + parseFloat(obj('w8'))) / 2 * (parseFloat(obj('d3')) + parseFloat(obj('d8'))) / 2 * parseFloat(obj('h10')) - (parseFloat(m.setting(v1RowIndex)['L2']) * parseFloat(m.setting(v1RowIndex)['B2']) * parseFloat(obj('h10')) - 0.96 * 0.46 * 0), 2));
    	} else {
    		$('#resoilCpctVlme').text(truncate((parseFloat(obj('w3')) + parseFloat(obj('w8'))) / 2 * (parseFloat(obj('d3')) + parseFloat(obj('d8'))) / 2 * parseFloat(obj('h10')) - (parseFloat(m.setting(v1RowIndex)['L2']) * parseFloat(m.setting(v1RowIndex)['B2']) * parseFloat(m.setting(v1RowIndex)['H2'])) - (((1.37/2) * (1.37/2)) * 3.14 * (parseFloat(obj('h10')) - parseFloat(m.setting(v1RowIndex)['H2']))), 2));
    	}
    	//16.환토비다짐(인력)
    	$('#rsnpRate').text(truncate((parseFloat(obj('w8')) + parseFloat(obj('w8'))) / 2 * (parseFloat(obj('d8')) + parseFloat(obj('d8'))) / 2 * parseFloat(obj('h11')),2));
    	//13.환토
    	$('#resoilVlme').text(truncate(parseFloat($('#resoilCpctVlme').text()) + parseFloat($('#rsnpRate').text()),3));
    	//17.중기잔토처리(사석)
    	$('#rprpHveqEcvtVlme').text(truncate(parseFloat($('#hveqEcvtVlme').text()),3));
    	//18.중기잔토처리(토사)
    	$('#hveqSsopVlme').text(truncate(parseFloat($('#soilHveqEcvtVlme').text()) + parseFloat($('#hrscEcvtDistm1').text()) + parseFloat($('#hrscEcvtDistm2').text()) + parseFloat($('#hrscEcvtDistm3').text()),3));
    	//19.보도걷기
    	$('#pvmtSkimAr').text(0);
    	//20.노면청소
    	$('#stSufcClenAr').text(0);
    	//21.복구정보 복구폭
    	if ('65' == fcltKndCd) { //수공1호
    		$('#rcovBaseWdth').text(truncate(parseFloat(obj('w1')) * parseFloat(obj('d1')) - (0.96 * 0.46),2));
    	} else {
    		$('#rcovBaseWdth').text(truncate(parseFloat(obj('w1')) * parseFloat(obj('d1')) - ((1.37/2) * (1.37/2) * 3.14), 2)); 
    	}
    	//22.복구정보 표층
    	$('#rcovSufcHght1').text(truncate($('#sufcHght').text(),2));
    	//23.복구정보 기층
    	$('#rcovBaseHght').text(0);
    	//24.복구정보 보조기층1
    	if (1 == assiBaseGadtTypeCd && '65' == fcltKndCd) {
    		$('#rcovAssiBaseHght1').text(truncate((parseFloat(obj('w1')) + parseFloat(obj('w3'))) / 2 * (parseFloat(obj('d1')) + parseFloat(obj('d3'))) / 2 * 0 - parseFloat(m.setting(v1RowIndex)['L2']) * parseFloat(m.setting(v1RowIndex)['B2']) * 0.1 ,2));
    	} else if (1 == assiBaseGadtTypeCd && '65' != fcltKndCd) {
    		$('#rcovAssiBaseHght1').text(truncate((parseFloat(obj('w1')) + parseFloat(obj('w3'))) / 2 * (parseFloat(obj('d1')) + parseFloat(obj('d3'))) / 2 * 0 - ((1.37/2) * (1.37/2)) * 3.14 * 0 ,2));
    	} else if (1 != assiBaseGadtTypeCd && '65' == fcltKndCd) { 
    		$('#rcovAssiBaseHght1').text(truncate((parseFloat(obj('w1')) + parseFloat(obj('w2'))) / 2 * (parseFloat(obj('d1')) + parseFloat(obj('d2'))) / 2 * 0 - parseFloat(m.setting(v1RowIndex)['L2']) * parseFloat(m.setting(v1RowIndex)['B2']) * 0.1 ,2));
    	} else {
    		$('#rcovAssiBaseHght1').text(truncate((parseFloat(obj('w1')) + parseFloat(obj('w2'))) / 2 * (parseFloat(obj('d1')) + parseFloat(obj('d2'))) / 2 * 0 - ((1.37/2) * (1.37/2)) * 3.14 * 0 ,2));
    	}
    	//25.복구정보 보조기층2
    	$('#rcovAssiBaseHght2').text(0);
    	//26.구조물체적
    	if ('11' == cdlnMhAryDivCd) {
    		$('#strceVlme').text(0);
    	} else {
    		if ('65' == fcltKndCd) {
    			$('#strceVlme').text(truncate((parseFloat(m.setting(v1RowIndex)['L2']) * parseFloat(m.setting(v1RowIndex)['B2']) * parseFloat(m.setting(v1RowIndex)['H2'])) - (parseFloat(m.setting(v1RowIndex)['L1']) * parseFloat(m.setting(v1RowIndex)['B1']) * parseFloat(m.setting(v1RowIndex)['H1'])) - (0.96 * 0.46 * 0.15),3));
    		} else {
    			$('#strceVlme').text(truncate((parseFloat(m.setting(v1RowIndex)['L2']) * parseFloat(m.setting(v1RowIndex)['B2']) * parseFloat(m.setting(v1RowIndex)['H2'])) - (parseFloat(m.setting(v1RowIndex)['L1']) * parseFloat(m.setting(v1RowIndex)['B1']) * parseFloat(m.setting(v1RowIndex)['H1'])) - (((1.37/2) * (1.37/2)) * 3.14 * 0.2),3));
    		}
    	}
    	//27.철개 
    	if ('65' == fcltKndCd) {
    		$('#iccrClotpDivCdNm').text('수공철개');
    		$('input[name=iccrClotpDivCd]').val(1);
    	} else {
    		$('#iccrClotpDivCdNm').text('인공철개');
    		$('input[name=iccrClotpDivCd]').val(2);
    	}
    }
    
	//request 성공시
    var successCallback = function (response,state,xhr,flag){
    	if ('getMass' == flag) {
    		if(response.resultData != null) {
    			responseData = response.resultData.item;
    			if(obj.digRfctFcltKndCd == responseData.fcltKndCd
	    			&& obj.cdlnMhAryDivCd == responseData.cdlnMhAryDivCd
	    			&& obj.aplyMassCd == responseData.aplyMassCd
	    			&& obj.tptnTruckKndCd == responseData.tptnTruckKndCd) {
    				obj.flag = "U";
	    		} 
    		} else {
    			obj.flag = "I";
    		}
    		
    		model.get({
				url : m.api.url(2),
				data : {'grpCdArry':'C00428'},
				flag : m.flag(2)
			}).done(successCallback).fail(failCallback);
    	}
    	
    	if ('combo' == flag) {
    		$("select[name=rockAplyDivCd]").setData({
	             data: response.C00428
			});
    		
    		//암반저장유무
			$('select[name=rockAplyDivCd]  option:eq(0)').attr('selected','selected');
			$('select[name=rockAplyDivCd]').next().text($('select[name=rockAplyDivCd]  option:eq(0)').text());
			
			if('U' == obj.flag) {
				model.get({
					url : m.api.url(1),
					data: {"cstrCd":obj.cstrCd, "cdlnSctnSrno":obj.cdlnSctnSrno, "dsnSetlDiv":obj.dsnSetlDiv},
					flag : m.flag(1)
				}).done(successCallback).fail(failCallback);
			} else {
				$('input[name=flag]').val('A');
				$('input[name=skAfcoDivCd]').val(obj.skAfcoDivCd);
				$('input[name=fcltKndCd]').val(obj.digRfctFcltKndCd);
				$('input[name=cdlnMhAryDivCd]').val(obj.cdlnMhAryDivCd);
				$('input[name=aplyMassCd]').val(obj.aplyMassCd);
				$('input[name=tptnTruckKndCd]').val(obj.tptnTruckKndCd);
				
				//포장층 깊이
				$('select[name=sufcHght]  option:eq(0)').attr('selected','selected');
				$('select[name=sufcHght]').next().text($('select[name=sufcHght]  option:eq(0)').text());
				
				//보조기층높이
				$('select[name=assiBaseHght]  option:eq(0)').attr('selected','selected');
				$('select[name=assiBaseHght]').next().text($('select[name=assiBaseHght]  option:eq(0)').text());
				
				//보조기층구배적용
				$('select[name=assiBaseGadtTypeCd]  option:eq(0)').attr('selected','selected');
				$('select[name=assiBaseGadtTypeCd]').next().text($('select[name=assiBaseGadtTypeCd]  option:eq(0)').text());
				
				//구배율
				$('select[name=gadtRate]  option:eq(1)').attr('selected','selected');
				$('select[name=gadtRate]').next().text($('select[name=gadtRate]  option:eq(1)').text());
				
				var data = {
					'fcltKndCd' : $('input[name=fcltKndCd]').val(),
    				'cdlnMhAryDivCd' : $('input[name=cdlnMhAryDivCd]').val(),
    				'aplyMassCd' : $('input[name=aplyMassCd]').val(),
    				'tptnTruckKndCd' : $('input[name=tptnTruckKndCd]').val()
    			}
				
				model.post({
					url : m.api.url(3),
					data : data,
					flag : m.flag(3)
				}).done(successCallback).fail(failCallback);
			}
			
			conManArray();
    	}
    	
    	if ('search' == flag) {
    		returnData = response.resultData.item;
    		m.form.formObject.setData(returnData);
    		
    		$.each($('select[name=cdlnMhAryDivCd]').children() , function () {
    			if (this.value == returnData.cdlnMhAryDivCd) {
    				$(this).attr('selected','selected');
    				$('select[name=cdlnMhAryDivCd]').next().text($(this).text());
    			}
    		});
    		
    		//delete returnData['cdlnMhAryDivCd'];

    		$.each($('select[name=sufcHght]').children() , function () {
    			if (this.value == parseFloat(returnData.sufcHght).toFixed(3)) {
    				$(this).attr('selected','selected');
    				$('select[name=sufcHght]').next().text($(this).text());
    			}
    		});
    		
    		//delete returnData['sufcHght'];
    		
    		$.each($('select[name=assiBaseHght]').children() , function () {
    			if (this.value == returnData.assiBaseHght) {
    				$(this).attr('selected','selected');
    				$('select[name=assiBaseHght]').next().text($(this).text());
    			}
    		});
    		
    		//delete returnData['assiBaseHght'];
    		
    		$.each($('select[name=assiBaseGadtTypeCd]').children() , function () {
    			if (this.value == returnData.assiBaseGadtTypCd) {
    				$(this).attr('selected','selected');
    				$('select[name=assiBaseGadtTypeCd]').next().text($(this).text());
    			}
    		});
    		
    		//delete returnData['assiBaseGadtTypCd'];
    		
    		$.each($('select[name=gadtRate]').children() , function () {
    			if (this.value == returnData.gadtRate) {
    				$(this).attr('selected','selected');
    				$('select[name=assiBaseGadtTypCd]').next().text($(this).text());
    			}
    		});
    		
    		//delete returnData['gadtRate'];
    		
    		$.each($('select[name=rockAplyDivCd]').children() , function () {
    			if (this.value == returnData.rockAplyDivCd) {
    				$(this).attr('selected','selected');
    				$('select[name=rockAplyDivCd]').next().text($(this).text());
    			}
    		});
    		
    		//delete returnData['rockAplyDivCd'];
    		
        	conManArray();
        	valueChange();
    	}
    	
    	if ('codenames' == flag) {
    		$("input[name=fcltKndCdNm]").val(response.fcltKndCdNm);
			$("input[name=cdlnMhAryDivCdNm]").val(response.cdlnMhAryDivCdNm);
			$("input[name=aplyMassCdNm]").val(response.aplyMassCdNm);
			$("input[name=tptnTruckKndCdNm]").val(response.tptnTruckKndCdNm);
			
			valueChange();
    	}
    	
    	if ('save' == flag) {
    		returnData = response.resultData.item;
			$("form[name=searchForm]").setData(returnData);
			callMsgBox('returnMessage','W', response.returnMessage , btnMsgCallback);
    	}
    }
    
    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }
    
    var btnMsgCallback = function () {
    	valueChange();
    }
    
    //그리드에 추가
    var setDataCallback = function (response) {
    }
    
    var model = Tango.ajax.init({});
    
    //팝업 호출
    var openPopup = function(popupId,title,url,data,widthSize,heightSize,callBack){
		$a.popup({
        	popid: popupId,
        	title: title,
            url: url,
            data: data,
            width:widthSize,
            height:heightSize,
            callback: function(data) {
				callBack(data);
           	}
        });
	}
    
    var conManArray = function (){
    	var fcltKndCd = $('input[name=fcltKndCd]').val();

    	if ('61' == fcltKndCd) {//인공3호
    		v1RowIndex = 0;
    	} else if ('62' == fcltKndCd) {//인공2호
    		v1RowIndex = 1;
    	} else if ('63' == fcltKndCd) {//인공1호
    		v1RowIndex = 2;
    	} else if ('64' == fcltKndCd) {//수동2호
    		v1RowIndex = 3;
    	} else if ('65' == fcltKndCd) {//수공1호
    		v1RowIndex = 5;
    	} else if ('66' == fcltKndCd) {//수공2-1호 2013.6.12 추가 (표준토적 2.01에 기존 수공2와 1사이에 추가되었음.)
    		v1RowIndex = 4;
    	} else {
    		v1RowIndex = 0;
    	}
    }
    
    var truncate = function (num, places){
    	return Math.floor(num * Math.pow(10, places)) / Math.pow(10, places);
    }
    
    var setVisible = function (obj) {
		var target = $("#"+obj);
		
		if(parseFloat(target.text()) == 0) {
			target.hide();
		} else {
			target.show();
		}
	}
});