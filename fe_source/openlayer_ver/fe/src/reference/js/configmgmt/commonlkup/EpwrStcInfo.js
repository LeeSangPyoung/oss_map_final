/**
 * EpwrStcMgmtHeltrCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var comHeltr = $a.page(function() {
	var heltrGridId = 'dataGridHeltr';
	var dsbnGridId = 'dataGridDsbn';
	var paramData = null;
	var d = new Date();
	var sDate = d.getFullYear().toString()+"-"+NumberPad(d.getMonth(), 2)+"-01";
	var eDate = d.getFullYear().toString()+"-"+NumberPad(d.getMonth() + 1, 2)+"-01";
	if (d.getMonth().toString() == "12") {
		eDate = (d.getFullYear()+1).toString()+"-01-01";
	}
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setEventListener();
		$('#epwrStcLkupArea').setData(param);

		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqwrstc', param, 'GET', 'search');
		//param.mtsoId = 'MO01012451152';
		param.startDt = sDate;
		param.endDt = sDate;

		$('#divChart').progress();
		param.dsbnChartGubun = "01";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/dsbnchart', param, 'GET', 'dsbnsearch');
		param.rtfChartGubun = "01";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/rtfchart', param, 'GET', 'rtfsearch');
		$('#'+dsbnGridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/dsbncurst', param, 'GET', 'curstsearch');


		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/arcnlist', param, 'GET', 'arcnlist');

		resizeContents();
	}

	function resizeContents(){
    	var contentHeight = $("#epwrStcLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

	function initGrid() {
		var nowYear = new Date().getFullYear();
		var option_data = [];
		for(i = nowYear; i > nowYear - 10; i--) {
			var resObj = {dsbnYearVal : i,dsbnYearNm : i};
			option_data.push(resObj);
		}
		$("#dsbnYear").clear();
		$("#dsbnYear").setData({
			data:option_data
		});
		$("#dsbnYear").val(nowYear);

		$("#rtfYear").clear();
		$("#rtfYear").setData({
			data:option_data
		});
		$("#rtfYear").val(nowYear);

		var option_data = [];
		var yms = new Date();
		var getMonth = yms.getMonth();
		for(i = 12; i > 0; i--) {
			var resObj = {dsbnMonthVal : i, dsbnMonthNm : NumberPad(i, 2)};
			option_data.push(resObj);
		}
		$("#dsbnMonth").clear();
		$("#dsbnMonth").setData({
			data:option_data
		});
		$("#dsbnMonth").val(getMonth);

		$("#rtfMonth").clear();
		$("#rtfMonth").setData({
			data:option_data
		});
		$("#rtfMonth").val(getMonth);

		$("#dsbnChartGubun").clear();
		var option_data =  [{dsbnChartId: "01",dsbnChartNm: "계약전력 부하율"}, {dsbnChartId: "02",dsbnChartNm: "메인 분전반 부하전력"}];
		$("#dsbnChartGubun").setData({
			data:option_data
		});

		$("#rtfChartGubun").clear();
		var option_data =  [{rtfChartId: "01",rtfChartNm: "출력전류"}, {rtfChartId: "02",rtfChartNm: "부하율"}, {rtfChartId: "05",rtfChartNm: "방전시험"}]; // {rtfChartId: "03",rtfChartNm: "모듈 과부족"}, {rtfChartId: "04",rtfChartNm: "전압강하"},
		$("#rtfChartGubun").setData({
			data:option_data
		});



		$('#'+dsbnGridId).alopexGrid({
	    	paging : {
	    		pagerSelect: [100,300,500,1000,5000]
	           ,hidePageList: false  // pager 중앙 삭제
	    	},
	    	cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : false,
            rowSingleSelect : true,
            rowInlineEdit : true,
            pager : false,
	    	height: "5row",
			defaultColumnMapping:{
				sorting : true
			},
			headerGroup : [
			               { fromIndex : 2, toIndex : 4, title:'계약전력'},
			               { fromIndex : 5, toIndex : 24, title:'Main 분전반'},
			               { fromIndex : 27, toIndex : 46, title:'분기 분전반'},
			],
			grouping:{
				by:['mgmtGrpNm','orgNm','teamNm','tmofNm','mtsoTypNm','mtsoNm','florDivVal','gageCustNo','ctrtEpwrVal','ctrtEpwrRoadRate'
				    ,'mainSbeqpNm','mainCapaVal','mainCbplLoadRate','mainCbplUbfVal','mainCblTkns','mainCblTknsLoadRate'
				    ,'mainVoltRsVal','mainVoltStVal','mainVoltTrVal','mainVcurRVal','mainVcurSVal','mainVcurTVal','mainCbplEpwrVal'
				    ,'mainCnptTmprRVal','mainCnptTmprSVal','mainCnptTmprTVal','mainCblTmprRVal','mainCblTmprSVal','mainCblTmprTVal'
				    ,'mainLakgVcurVal','mainTvssInstlStatCd','mainTmnbxInstlStatCd'],
				useGrouping:true,
				useGroupRearrange:true,
				useGroupRowspan:true
			},
			renderMapping : {
				'customTooltip': {
					renderer: function(value, data, render, mapping){
						var val = "";
						if(value == '0'){
							val = '장비선택';
						}else if(value=='1'){
							val = '불필요';
						}else if(value=='2'){
							val = '미설치';
						}
						return '<div id="'+data._index.id+mapping.key+'">'+val+'</div>';
					}
				}
			},
			columnMapping: [{ align:'center', title : 'No', width: '40px', numberingColumn: true, hidden :true },
//				{/* 관리그룹--숨김데이터            	*/ key : 'mgmtGrpNm', align:'center', title : configMsgArray['managementGroup'], width: '70px', rowspan:true
//				},
//				{/* 본부			 		*/ key : 'orgNm', align:'center', title : configMsgArray['hdofc'], width: '100px', rowspan:true },
//				{/* 팀	 				*/ key : 'teamNm', align:'center', title : configMsgArray['team'], width: '100px', rowspan:true },
//				{/* 전송실 		 		*/ key : 'tmofNm', align:'center', title : configMsgArray['transmissionOffice'], width: '150px', rowspan:true },
//				{/* 국사유형		 		*/ key : 'mtsoTypNm', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeType'], width: '100px', rowspan:true },
//				{/* 국사명		 			*/ key : 'mtsoNm', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeName'], width: '150px', rowspan:true },
				{ key : 'florDivVal', align:'center', title : '총 층수', width: '100px', render: function(value){
					if(value == null || value == ''){
						return
					}else{
						for(var i=-6; i<0; i++){
							if(value == i){
								return "B" + -i + "층";
							}
						}
						for(var i=1; i<21; i++){
							if(value == i){
								return i + "층";
							}
						}
					}
				},
				rowspan:true },
				{ key : 'gageCustNo', align:'center', title : '계량기번호', width: '120px', rowspan:true },
				{ key : 'ctrtEpwrVal', align:'center', title : '계약전력(KW)', width: '100px', rowspan:true },
				{ key : 'ctrtEpwrRoadRate',  align:'center', title : '부하율(%)', width: '100px',
					render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				}, rowspan:true },
				{ key : 'mainSbeqpNm',  align:'center', title : '분전반명', width: '150px', rowspan:true },
				{ key : 'mainCapaVal',  align:'center', title : '차단기용량', width: '100px', rowspan:true },
				{ key : 'mainCbplLoadRate',  align:'center', title : '부하율(%)', width: '100px',	render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				}, rowspan:true },
				{ key : 'mainCbplUbfVal',  align:'center', title : '불평형율[%]', width: '100px', render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				}, rowspan:true },
				{ key : 'mainCblTkns',  align:'center', title : '케이블 굵기', width: '100px', rowspan:true },
				{ key : 'mainCblTknsLoadRate',  align:'center', title : '부하율(%)', width: '100px', render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				}, rowspan:true },
				{ key : 'mainVoltRsVal',  align:'center', title : '전압(RS)', width: '100px', rowspan:true },
				{ key : 'mainVoltStVal',  align:'center', title : '전압(ST)', width: '100px', rowspan:true },
				{ key : 'mainVoltTrVal',  align:'center', title : '전압(TR)', width: '100px', rowspan:true },
				{ key : 'mainVcurRVal',  align:'center', title : '전류(R)', width: '100px', rowspan:true },
				{ key : 'mainVcurSVal',  align:'center', title : '전류(S)', width: '100px', rowspan:true },
				{ key : 'mainVcurTVal',  align:'center', title : '전류(T)', width: '100px', rowspan:true },
				{ key : 'mainCbplEpwrVal',  align:'center', title : '전력(KW)', width: '100px', rowspan:true },
				{ key : 'mainCnptTmprRVal',  align:'center', title : '접속점온도R', width: '100px', rowspan:true },
				{ key : 'mainCnptTmprSVal',  align:'center', title : '접속점온도S', width: '100px', rowspan:true },
				{ key : 'mainCnptTmprTVal',  align:'center', title : '접속점온도T', width: '100px', rowspan:true },
				{ key : 'mainCblTmprRVal',  align:'center', title : '케이블온도R', width: '100px', rowspan:true },
				{ key : 'mainCblTmprSVal',  align:'center', title : '케이블온도S', width: '100px', rowspan:true },
				{ key : 'mainCblTmprTVal',  align:'center', title : '케이블온도T', width: '100px', rowspan:true },
				{ key : 'mainLakgVcurVal',  align:'center', title : '누설전류', width: '100px', rowspan:true },
				{ key : 'mainTvssInstlStatCd',  align:'center', title : 'TVSS(SPD)', width: '100px', render: {type: "customTooltip"}, tooltip: false, rowspan:true },
				{ key : 'mainTmnbxInstlStatCd',  align:'center', title : '발전단자함', width: '100px', render: {type: "customTooltip"}, tooltip: false, rowspan:true },
				{ key : 'qrtSbeqpNm',  align:'center', title : '분전반명', width: '150px' },
				{ key : 'qrtCapaVal',  align:'center', title : '차단기용량', width: '100px' },
				{ key : 'qrtCbplLoadRate',  align:'center', title : '부하율(%)', width: '100px', render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				} },
				{ key : 'qrtCbplUbfVal',  align:'center', title : '불평형율[%]', width: '100px', render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				} },
				{ key : 'qrtCblTkns',  align:'center', title : '케이블 굵기', width: '100px' },
				{ key : 'qrtCblTknsLoadRate',  align:'center', title : '부하율(%)', width: '100px', render: function(value){
					if(value == null || value == ''){
						return
					}else{
						return value + '%';
					}
				} },
				{ key : 'qrtVoltRsVal',  align:'center', title : '전압(RS)', width: '100px' },
				{ key : 'qrtVoltStVal',  align:'center', title : '전압(ST)', width: '100px' },
				{ key : 'qrtVoltTrVal',  align:'center', title : '전압(TR)', width: '100px' },
				{ key : 'qrtVcurRVal',  align:'center', title : '전류(R)', width: '100px' },
				{ key : 'qrtVcurSVal',  align:'center', title : '전류(S)', width: '100px' },
				{ key : 'qrtVcurTVal',  align:'center', title : '전류(T)', width: '100px' },
				{ key : 'qrtCbplEpwrVal',  align:'center', title : '전력(KW)', width: '100px' },
				{ key : 'qrtCnptTmprRVal',  align:'center', title : '접속점온도R', width: '100px' },
				{ key : 'qrtCnptTmprSVal',  align:'center', title : '접속점온도S', width: '100px' },
				{ key : 'qrtCnptTmprTVal',  align:'center', title : '접속점온도T', width: '100px' },
				{ key : 'qrtCblTmprRVal',  align:'center', title : '케이블온도R', width: '100px' },
				{ key : 'qrtCblTmprSVal',  align:'center', title : '케이블온도S', width: '100px' },
				{ key : 'qrtCblTmprTVal',  align:'center', title : '케이블온도T', width: '100px' },
				{ key : 'qrtLakgVcurVal',  align:'center', title : '누설전류점검상태', width: '100px' },
				{ key : 'qrtTvssInstlStatCd',  align:'center', title : 'TVSS(SPD)', width: '100px', render: {type: "customTooltip"}, tooltip: false },
				{ key : 'qrtTmnbxInstlStatCd',  align:'center', title : '발전단자함', width: '100px', render: {type: "customTooltip"}, tooltip: false },
				{ key : 'dsbnId', align:'center', title : '수배전ID', width: '150px', hidden :true },
				{ key : 'mainSbeqpId',  align:'center', title : '메인분전반ID', width: '100px', hidden :true },
				{ key : 'qrtSbeqpId',  align:'center', title : '분전반ID', width: '100px', hidden :true
			}],

			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>'+configMsgArray['noData']+'</div>'
			}
	    });


	}

	function setEventListener() {

		$('#btnRegRcvgDsbn').on('click', function(e) {
			var data ={stat: 'add'}
    		 $a.popup({
    	          	popid: 'CnstnBp',
    	          	title: '수배전 등록',
    	            url: '/tango-transmission-web/configmgmt/upsdmgmt/EpwrStcMgmtDsbnReg.do',
    	            data: data,
    	            windowpopup : true,
    	            modal: true,
                    movable:true,
    	            width : 1200,
    	           	height : window.innerHeight * 0.65,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행
    	                $('#cnstnBpIdReg').val(data.bpId);
    	                $('#cnstnBpNmReg').val(data.bpNm);
    	           	}
    	      });
         });



		$('[name^="dsbn_"]').on('change', function(e) {
			var mtsoId = $('#mtsoId').val();
			var dsbnYear = $('#dsbnYear').val();
			var dsbnMonth = $('#dsbnMonth').val();
			var dsbnChartGubun = $('#dsbnChartGubun').val();

			sDate = dsbnYear+"-"+NumberPad(dsbnMonth, 2)+"-01";
			eDate = dsbnYear+"-"+NumberPad(parseInt(dsbnMonth) + 1, 2)+"-01";
			if (dsbnMonth.toString() == "12") {
				eDate = (parseInt(dsbnYear)+1).toString()+"-01-01";
			}
			$('#divChart').progress();
			var paramData = {mtsoId : mtsoId, startDt : sDate, endDt : eDate, dsbnChartGubun : dsbnChartGubun};

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/dsbnchart', paramData, 'GET', 'dsbnsearch');
    	});

		$('[name^="rtf_"]').on('change', function(e) {
			var mtsoId = $('#mtsoId').val();
			var rtfYear = $('#rtfYear').val();
			var rtfMonth = $('#rtfMonth').val();
			var rtfChartGubun = $('#rtfChartGubun').val();

			sDate = rtfYear+"-"+NumberPad(rtfMonth, 2)+"-01";
			eDate = rtfYear+"-"+NumberPad(parseInt(rtfMonth) + 1, 2)+"-01";
			if (rtfMonth.toString() == "12") {
				eDate = (parseInt(rtfYear)+1).toString()+"-01-01";
			}

			$('#divChart').progress();
			var paramData = {mtsoId : mtsoId, startDt : sDate, endDt : eDate, rtfChartGubun : rtfChartGubun};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/rtfchart', paramData, 'GET', 'rtfsearch');
    	});
	};

	//request 성공시
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'curstsearch'){
			$('#'+dsbnGridId).alopexGrid('hideProgress');
			$('#'+dsbnGridId).alopexGrid('dataSet', response.dsbncurst);
		}
		if(flag == 'arcnlist'){
			if (response.arcnlist.length > 0) {
				$('#epwrStcLkupArea').setData(response.arcnlist[0]);
				var value = response.arcnlist[0].htmprSoltnCd;
				if(value == '0'){
					value = '강제배기';
				}else if(value=='1'){
					value = '고정형배풍기';
				}else if(value=='2'){
					value = '이동형배풍기';
				}else if(value=='3'){
					value = '인버터냉방기';
				}else if(value=='4'){
					value = '고정형발전기';
				}
				$('#htmprSoltnCd').val(value);
			}
		}



		if(flag == 'search'){
			var totCnt = 0;
			var optColor = '#DF5353';
			if (response.eqwrstc.length > 0) {
				$('#epwrStcLkupArea').setData(response.eqwrstc[0]);
				if(response.eqwrstc[0].totCnt != undefined && response.eqwrstc[0].totCnt != null) {
					totCnt = parseInt(response.eqwrstc[0].totCnt);
				}

				if (response.eqwrstc[0].HELTR_INF == 'Yellow') {
					optColor = '#DDDF0D';
				} else if (response.eqwrstc[0].HELTR_INF == 'Green') {
					optColor = '#55BF3B';
				}
			}

			var gaugeOptions = {
				  chart: {type: 'solidgauge'},
				  title: null,
				  pane: {
				    center: ['50%', '85%'], size: '170%', startAngle: -90, endAngle: 90,
				    background: {
				      backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
				      innerRadius: '60%',
				      outerRadius: '100%',
				      shape: 'arc'
				    }
				  }, tooltip: { enabled: false },
				  yAxis: {
				    stops: [ [0.0, optColor] ],
				    lineWidth: 0, minorTickInterval: null, tickAmount: 2, title: { y: -70 }, labels: { y: 16 }
				  }, plotOptions: { solidgauge: { dataLabels: { y: 5, borderWidth: 0, useHTML: true } } }
			};
			// The speed gauge
			var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
			  yAxis: {
			    min: 0,
			    max: 100
			  },

			  credits: {
			    enabled: false
			  },

			  series: [{
			    name: 'Speed',
			    data: [totCnt],
			    dataLabels: {
			      format: '<div style="text-align:center"><span style="font-size:25px;color:' +
			        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span></div>'
			    }
			  }]
			}));
		}

		if(flag == 'dsbnsearch'){

			var dsbnMonth = $('#dsbnMonth').val();
			dsbnMonth = NumberPad(dsbnMonth, 2);
			var chartXVal = ['02일','04일','06일','08일','10일','12일','14일','16일','18일','20일','22일','24일','26일','28일','30일'];
			var ctrtEpwrRoadRateList = [];
			//ctrtEpwrRoadRate
			var groupGubun = 0;
			var connGageId1 = null;
			var connGageId2 = null;
			var sbeqpNm = null;
			var JsonArray = new Array();
			var ctrtEpwrRoadRate = null;

			var connGageId = [];
			var dsbnChartGubun = $("#dsbnChartGubun").val();
			if (dsbnChartGubun == "01") {
				if (response.dsbnchart.length == 0) {
					var gageId = "0";
					var gageNm = "조회된 데이터가 없습니다";
					var tmpData = 0;
					var chartData =[];
					for(k = 1; k < 31; k++) {
						if (k%2 == 0) {
							chartData.push(tmpData);
						}
					}
					var arrData = {name : gageNm, data : chartData};
					JsonArray.push(arrData);

				} else {
					$.each(response.dsbnchart, function(i, item){
						if (i == 0) {
							connGageId1 = response.dsbnchart[i].connGageId;
							var conData = {connGageId : response.dsbnchart[i].connGageId, sbeqpNm : response.dsbnchart[i].sbeqpNm};
							connGageId.push(conData);
						}
						connGageId2 = response.dsbnchart[i].connGageId;
						if (connGageId1 != connGageId2) {
							connGageId1 = response.dsbnchart[i].connGageId;
							var conData = {connGageId : response.dsbnchart[i].connGageId, sbeqpNm : response.dsbnchart[i].sbeqpNm};
							connGageId.push(conData);
						}
					});
					var uniqueNames = [];
					$.each(connGageId, function(i, el) {
						if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
					});

					for(j = 0; j < uniqueNames.length; j++) {
						var gageId = uniqueNames[j].connGageId;
						var gageNm = uniqueNames[j].sbeqpNm;
						var tmpData = 0;
						var chartData =[];
						for(k = 1; k < 31; k++) {
							if (k%2 == 0) {
								tmpData = 0;
								$.each(response.dsbnchart, function(i, item) {
									var inDate = response.dsbnchart[i].inspStdDate
									if (gageId == response.dsbnchart[i].sbeqpId && NumberPad(k, 2).toString() == inDate) {
										tmpData = parseFloat(response.dsbnchart[i].ctrtEpwrRoadRate);
									}
								});
								chartData.push(tmpData);
							}
						}
						var arrData = {name : gageNm, data : chartData};
						JsonArray.push(arrData);
					}
				}
			} else {
				if (response.dsbnchart.length == 0) {
					var gageId = "0";
					var gageNm = "조회된 데이터가 없습니다";
					var tmpData = 0;
					var chartData =[];
					for(k = 1; k < 31; k++) {
						if (k%2 == 0) {
							chartData.push(tmpData);
						}
					}
					var arrData = {name : gageNm, data : chartData};
					JsonArray.push(arrData);

				} else {
					$.each(response.dsbnchart, function(i, item){
						if (i == 0) {
							connGageId1 = response.dsbnchart[i].sbeqpId;
							var conData = {connGageId : response.dsbnchart[i].sbeqpId, sbeqpNm : response.dsbnchart[i].sbeqpNm};
							connGageId.push(conData);
						}
						connGageId2 = response.dsbnchart[i].sbeqpId;
						if (connGageId1 != connGageId2) {
							connGageId1 = response.dsbnchart[i].sbeqpId;
							var conData = {connGageId : response.dsbnchart[i].sbeqpId, sbeqpNm : response.dsbnchart[i].sbeqpNm};
							connGageId.push(conData);
						}
					});
					var uniqueNames = [];
					$.each(connGageId, function(i, el) {
						if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
					});

					for(j = 0; j < uniqueNames.length; j++) {
						var gageId = uniqueNames[j].connGageId;
						var gageNm = uniqueNames[j].sbeqpNm;
						var tmpData = 0;
						var chartData =[];
						for(k = 1; k < 31; k++) {
							if (k%2 == 0) {
								tmpData = 0;
								$.each(response.dsbnchart, function(i, item) {
									var inDate = response.dsbnchart[i].inspStdDate
									if (gageId == response.dsbnchart[i].sbeqpId && NumberPad(k, 2).toString() == inDate) {
										tmpData = parseFloat(response.dsbnchart[i].mainCbplLoadRate);
									}
								});
								chartData.push(tmpData);
							}
						}
						var arrData = {name : gageNm, data : chartData};
						JsonArray.push(arrData);
					}
				}
			}
			$('#divChart').progress().remove();
			Highcharts.chart('dsbnContainer', {
				chart : {type : 'line'},
				title:{text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
//				legend:{
//					layout : oLayout,
//					align : oAlign,
//					verticalAlign : oVerticalAlign
//				},
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series: JsonArray,
				navigation:{ buttonOptions: { enabled:false } },
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
		if(flag == 'rtfsearch'){

			var chartXVal = ['02일','04일','06일','08일','10일','12일','14일','16일','18일','20일','22일','24일','26일','28일','30일'];
			var ctrtEpwrRoadRateList = [];
			//ctrtEpwrRoadRate
			var groupGubun = 0;
			var sbeqpId1 = null;
			var sbeqpId2 = null;
			var sbeqpNm = null;
			var JsonArray = new Array();
			var ctrtEpwrRoadRate = null;

			var connId = [];

			if (response.rtfchart.length == 0) {
				var sbeqpId = "0";
				var sbeqpNm = "조회된 데이터가 없습니다";
				var tmpData = 0;
				var chartData =[];
				for(k = 1; k < 31; k++) {
					if (k%2 == 0) {
						chartData.push(tmpData);
					}
				}
				var arrData = {name : sbeqpNm, data : chartData};
				JsonArray.push(arrData);

			} else {
				$.each(response.rtfchart, function(i, item){
					if (i == 0) {
						sbeqpId1 = response.rtfchart[i].sbeqpId;
						var conData = {sbeqpId : response.rtfchart[i].sbeqpId, sbeqpNm : response.rtfchart[i].sbeqpNm};
						connId.push(conData);
					}
					sbeqpId2 = response.rtfchart[i].sbeqpId;
					if (sbeqpId1 != sbeqpId2) {
						sbeqpId1 = response.rtfchart[i].sbeqpId;
						var conData = {sbeqpId : response.rtfchart[i].sbeqpId, sbeqpNm : response.rtfchart[i].sbeqpNm};
						connId.push(conData);
					}
				});
				var uniqueNames = [];
				$.each(connId, function(i, el) {
					if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
				});

				for(j = 0; j < uniqueNames.length; j++) {
					var sbeqpId = uniqueNames[j].sbeqpId;
					var sbeqpNm = uniqueNames[j].sbeqpNm;
					var tmpData = 0;
					var chartData =[];
					for(k = 1; k < 31; k++) {
						if (k%2 == 0) {
							tmpData = 0;
							$.each(response.rtfchart, function(i, item) {
								var inDate = response.rtfchart[i].inspStdDate
								if (sbeqpId == response.rtfchart[i].sbeqpId && NumberPad(k, 2).toString() == inDate) {
									tmpData = Math.round(parseFloat(response.rtfchart[i].rate),2);
								}
							});
							chartData.push(tmpData);
						}
					}
					var arrData = {name : sbeqpNm, data : chartData};
					JsonArray.push(arrData);
				}
			}

			$('#divChart').progress().remove();
			Highcharts.chart('rtfContainer', {
				chart : {type : 'line'},
				title:{text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
//				legend:{
//					layout : oLayout,
//					align : oAlign,
//					verticalAlign : oVerticalAlign
//				},
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series: JsonArray,
				navigation:{ buttonOptions: { enabled:false } },
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



	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}

	function NumberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}






});