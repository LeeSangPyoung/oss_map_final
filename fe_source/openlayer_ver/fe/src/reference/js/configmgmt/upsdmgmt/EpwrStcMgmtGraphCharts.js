/**
 * EpwrStcMgmtGraphCharts.js
 *
 * @author Administrator
 * @date 2018. 01. 29.
 * @version 1.0
 */
$a.page(function() {
    //초기 진입점
	var paramData = null;
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	setSelect(param);
    	setData(param);
    	setDate();
    	setEventListener();



    	var param = {sbeqpId: paramData.sbeqpId, mtsoId:paramData.mtsoId, searchAnalStaPerd : $('#searchAnalStaPerd').val(), searchAnalEndPerd : $('#searchAnalEndPerd').val()}
		if($('#analItm').val() == 'ctrtEpwrRoadRate'){
			param = {dsbnId: paramData.sbeqpId, mtsoId:paramData.mtsoId, searchAnalStaPerd : $('#searchAnalStaPerd').val(), searchAnalEndPerd : $('#searchAnalEndPerd').val(), gageId: paramData.gageId, mainSbeqpId:paramData.mainSbeqpId, qrtSbeqpId:paramData.qrtSbeqpId}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getCtrtEpwrRoadRateList', param, 'GET', 'ctrtEpwrRoadRate');
		}else if($('#analItm').val() == 'mainCbplLoadVcurVal'){
			param = {dsbnId: paramData.sbeqpId, mtsoId:paramData.mtsoId, searchAnalStaPerd : $('#searchAnalStaPerd').val(), searchAnalEndPerd : $('#searchAnalEndPerd').val(), gageId: paramData.gageId, mainSbeqpId:paramData.mainSbeqpId, qrtSbeqpId:paramData.qrtSbeqpId}
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMainCbplLoadVcurValList', param, 'GET', 'mainCbplLoadVcurVal');
		}else if($('#analItm').val() == 'rtfPrtVcurVal'){
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfPrtVcurValList', param, 'GET', 'rtfPrtVcurVal');
		}else if($('#analItm').val() == 'rtfLoadRate'){
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfLoadRateList', param, 'GET', 'rtfLoadRate');
		}else if($('#analItm').val() == 'rtfOvstCnt'){
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfOvstCntList', param, 'GET', 'rtfOvstCnt');
		}else if($('#analItm').val() == 'rtfVoltDrop'){
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfVoltDropValList', param, 'GET', 'rtfVoltDrop');
		}/*else if($('#analItm').val() == 'bkExptTime'){
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/', param, 'GET', 'bkExptTime');
		}*/else if($('#analItm').val() == 'rtfDcgh'){
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfDcghList', param, 'GET', 'rtfDcgh');
		}else if($('#analItm').val() == 'batryRstn'){
			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBatryRstnList', param, 'GET', 'batryRstn');
		}else{
			callMsgBox('','W', '분석항목을 선택해 주세요.', function(msgId, msgRst){});
			return;
		}
    };

    function setData(param){
    	if(param.type=="dsbn"){
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDsbnSearch', param, 'GET', 'dsbnInfo');
    	}else{
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSbeqpSearch', param, 'GET', 'sbeqpInfo');
    	}
    }

    function setSelect(param){

    	if(param.type == 'dsbn'){
    		var option_data = [{analItm: 'ctrtEpwrRoadRate', analItmNm: '계약전력 부하율'}];
    		option_data.push({analItm:'mainCbplLoadVcurVal',analItmNm:'메인분전반 부하전류'});

    		$('#analItm').setData({
    			data : option_data,
    			option_selected: 'ctrtEpwrRoadRate'
    		});
    		$('#systemNm').val(paramData.mtsoNm)

    		$('#systemNmLabel').html("국사명") ;
    		$('#mdlCol').hide();
    		$('#sbeqpCol').hide();
    		$('#jrdtTeamOrgNm').hide();
    		$('#jrdtTeamOrgNmReg').hide();
    	}else if(param.type == 'rtf'){
    		var option_data = [{analItm: 'rtfPrtVcurVal', analItmNm: '출력전류'}];
    		option_data.push({analItm:'rtfLoadRate',analItmNm:'부하율'});
			option_data.push({analItm:'rtfOvstCnt',analItmNm:'모듈 과부족'});
			option_data.push({analItm:'rtfVoltDrop',analItmNm:'전압강하'});
			//option_data.push({analItm:'bkExptTime',analItmNm:'축전지 백업예상'});
			option_data.push({analItm:'rtfDcgh',analItmNm:'방전시험'});

			$('#florDivValNmReg').hide();
			$('#florDivValNm').hide();

			$('#analItm').setData({
				data : option_data,
				option_selected: 'rtfPrtVcurVal'
			});
			$('#systemNm').val(paramData.mtsoNm)

			$('#systemNmLabel').html("국사명") ;
    	}else if(param.type == 'batry'){
    		var option_data = [{analItm: 'batryRstn', analItmNm: '내부저항'}];

    		$('#florDivValNmReg').hide();
			$('#florDivValNm').hide();

			$('#analItm').setData({
				data : option_data,
				option_selected: 'batryRstn'
			});

			$('#systemNm').val(paramData.jarNo)
		}

    	}

    function setDate() {
    	$('#searchAnalEndPerd').val(calculateDate(0));
    	$('#searchAnalStaPerd').val(calculateDate(365));
    }


    function setEventListener() {
    	//분석
    	$('#btnAnal').on('click', function(e) {
    		var param = {sbeqpId: paramData.sbeqpId, mtsoId:paramData.mtsoId, searchAnalStaPerd : $('#searchAnalStaPerd').val(), searchAnalEndPerd : $('#searchAnalEndPerd').val()}
    		if($('#analItm').val() == 'ctrtEpwrRoadRate'){
    			param = {dsbnId: paramData.sbeqpId, mtsoId:paramData.mtsoId, searchAnalStaPerd : $('#searchAnalStaPerd').val(), searchAnalEndPerd : $('#searchAnalEndPerd').val(), gageId: paramData.gageId, mainSbeqpId:paramData.mainSbeqpId, qrtSbeqpId:paramData.qrtSbeqpId}
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getCtrtEpwrRoadRateList', param, 'GET', 'ctrtEpwrRoadRate');
    		}else if($('#analItm').val() == 'mainCbplLoadVcurVal'){
    			param = {dsbnId: paramData.sbeqpId, mtsoId:paramData.mtsoId, searchAnalStaPerd : $('#searchAnalStaPerd').val(), searchAnalEndPerd : $('#searchAnalEndPerd').val(), gageId: paramData.gageId, mainSbeqpId:paramData.mainSbeqpId, qrtSbeqpId:paramData.qrtSbeqpId}
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMainCbplLoadVcurValList', param, 'GET', 'mainCbplLoadVcurVal');
    		}else if($('#analItm').val() == 'rtfPrtVcurVal'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfPrtVcurValList', param, 'GET', 'rtfPrtVcurVal');
    		}else if($('#analItm').val() == 'rtfLoadRate'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfLoadRateList', param, 'GET', 'rtfLoadRate');
    		}else if($('#analItm').val() == 'rtfOvstCnt'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfOvstCntList', param, 'GET', 'rtfOvstCnt');
    		}else if($('#analItm').val() == 'rtfVoltDrop'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfVoltDropValList', param, 'GET', 'rtfVoltDrop');
    		}/*else if($('#analItm').val() == 'bkExptTime'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/', param, 'GET', 'bkExptTime');
    		}*/else if($('#analItm').val() == 'rtfDcgh'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getRtfDcghList', param, 'GET', 'rtfDcgh');
    		}else if($('#analItm').val() == 'batryRstn'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getBatryRstnList', param, 'GET', 'batryRstn');
    		}else{
    			callMsgBox('','W', '분석항목을 선택해 주세요.', function(msgId, msgRst){});
    			return;
    		}
    	});
    	$('#analItm').on('change', function(e) {
    		if($('#analItm').val() == 'ctrtEpwrRoadRate'){
    			$('#systemNm').val(paramData.mtsoNm)
    		}else if($('#analItm').val() == 'mainCbplLoadVcurVal'){
    			$('#systemNm').val(paramData.mtsoNm)
    		}else if($('#analItm').val() == 'rtfPrtVcurVal'){
    			$('#systemNm').val(paramData.mtsoNm)
    		}else if($('#analItm').val() == 'rtfLoadRate'){
    			$('#systemNm').val(paramData.mtsoNm)
    		}else if($('#analItm').val() == 'rtfOvstCnt'){
    			$('#systemNm').val(paramData.mtsoNm)
    		}else if($('#analItm').val() == 'rtfVoltDrop'){
    			$('#systemNm').val(paramData.mtsoNm)
    		}/*else if($('#analItm').val() == 'bkExptTime'){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/', param, 'GET', 'bkExptTime');
    		}*/else if($('#analItm').val() == 'rtfDcgh'){
    			$('#systemNm').val(paramData.systmNm)
    		}else if($('#analItm').val() == 'batryRstn'){
    			$('#systemNm').val(paramData.jarNo)
    		}
    	});
    }
    	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'sbeqpInfo'){
    		$('#epwrStcMgmtGraphChartsArea').setData(response);
    	}

    	if(flag == 'dsbnInfo'){
    		$('#epwrStcMgmtGraphChartsArea').setData(response);
    	}

    	if(flag == 'ctrtEpwrRoadRate'){
    		var ctrtEpwrRoadRateList = [];
    		var dateList = [];
    		for(var i=0;i<response.ctrtEpwrRoadRateList.length; i++){
    			ctrtEpwrRoadRateList.push(parseFloat(response.ctrtEpwrRoadRateList[i].ctrtEpwrRoadRate));
    			dateList.push(response.ctrtEpwrRoadRateList[i].inspStdDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'계약전력 부하율',
					data: ctrtEpwrRoadRateList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'mainCbplLoadVcurVal'){
    		var mainCbplLoadVcurValList = [];
    		var dateList = [];
    		for(var i=0;i<response.mainCbplLoadVcurValList.length; i++){
    			mainCbplLoadVcurValList.push(parseFloat(response.mainCbplLoadVcurValList[i].mainAvgVcur));
    			dateList.push(response.mainCbplLoadVcurValList[i].inspStdDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'메인분전반 부하전류',
					data: mainCbplLoadVcurValList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'rtfPrtVcurVal'){
    		var rtfPrtVcurValList = [];
    		var dateList = [];
    		for(var i=0;i<response.rtfPrtVcurValList.length; i++){
    			rtfPrtVcurValList.push(parseFloat(response.rtfPrtVcurValList[i].prtVcurVal));
    			dateList.push(response.rtfPrtVcurValList[i].inspStdDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'출력전류',
					data: rtfPrtVcurValList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'rtfLoadRate'){
    		var rtfLoadRateList = [];
    		var dateList = [];
    		for(var i=0;i<response.rtfLoadRateList.length; i++){
    			rtfLoadRateList.push(parseFloat(response.rtfLoadRateList[i].loadRate));
    			dateList.push(response.rtfLoadRateList[i].inspStdDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'부하율',
					data: rtfLoadRateList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'rtfOvstCnt'){
    		var rtfOvstCntList = [];
    		var dateList = [];
    		for(var i=0;i<response.rtfOvstCntList.length; i++){
    			rtfOvstCntList.push(parseFloat(response.rtfOvstCntList[i].rtfOvstCnt));
    			dateList.push(response.rtfOvstCntList[i].inspStdDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'모듈 과부족',
					data: rtfOvstCntList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'rtfVoltDrop'){
    		var rtfVoltDropValList = [];
    		var dateList = [];
    		for(var i=0;i<response.rtfVoltDropValList.length; i++){
    			rtfVoltDropValList.push(parseFloat(response.rtfVoltDropValList[i].voltDropVal));
    			dateList.push(response.rtfVoltDropValList[i].inspStdDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'전압강하',
					data: rtfVoltDropValList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'bkExptTime'){
    		var dcghList = [];
    		var dateList = [];
    		for(var i=0;i<response.batryDcghList.length; i++){
    			dcghList.push(parseFloat(response.batryDcghList[i].depthVoltVal));
    			dateList.push(response.batryDcghList[i].dchgTestDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'방전 결과 분석',
					data: dcghList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'batryRstn'){
    		var rstnList = [];
    		var dateList = [];
    		for(var i=0;i<response.batryRstnList.length; i++){
    			rstnList.push(parseFloat(response.batryRstnList[i].intnRstnAvg));
    			dateList.push(response.batryRstnList[i].msmtDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList

				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'내부저항 분석',
					data: rstnList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}else if(flag == 'rtfDcgh'){
    		var rtfDcghList = [];
    		var dateList = [];
    		for(var i=0;i<response.rtfDcghList.length; i++){
    			rtfDcghList.push(parseFloat(response.rtfDcghList[i].depthVoltVal));
    			dateList.push(response.rtfDcghList[i].dchgTestDate);
    		}
    		Highcharts.chart('charts', {
				title:{
					text: ' '
				},
				credits: {
					text: ' ',

				},
				subtitle:{
					text: ' '
				},
				xAxis:{
					categories: dateList
				},
				yAxis:{
					title:{
						text:' '
					}
				},
				legend:{
					layout: 'vertical',
					align:'right',
					verticalAlign:'middle'
				},
				plotOptions:{
					line:{
						dataLabels:{
							enabled: true
						}
					}
				},
				series:[{
					name:'방전 결과 분석',
					data: rtfDcghList
				}],
				navigation:{
					buttonOptions: {
						enabled:false
					}
				},
				responsive: {
					rules:[{
						condition:{
							maxWidth: 500
						},
						chartOptions:{
							legend:{
								layout:'horizontal',
								align:'center',
								verticalAlign:'bottom'
							}
						}
					}]

				},
				minTickInterval : 1

			});
    	}
    }
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){

    }

	var calculateDate = function(option){

		var current_date = new Date();
  		var option_date = new Date(Date.parse(current_date) - option * 1000 * 60 * 60 * 24);

  		var option_Year = option_date.getFullYear();
  		var option_Month = (option_date.getMonth()+1)>9 ? ''+(option_date.getMonth()+1) : '0'+(option_date.getMonth()+1);
  		var option_Day = option_date.getDate() > 9 ? '' + option_date.getDate() : '0' + option_date.getDate();

  		return option_Year + '-' + option_Month + '-' + option_Day;
	};


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