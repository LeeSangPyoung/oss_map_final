
var manholeServerUrl = "tango-transmission-biz/transmission/constructprocess/manholeStat";
		
var manholeInfoModel = Tango.ajax.init({url : manholeServerUrl + "/getManholeChartInfo"}); // 맨홀정보 조회
var manholeChartModel = Tango.ajax.init({url : manholeServerUrl + "/getManholeChartGraph"}); // 맨홀차트정보 조회

$a.page(function() {
	var chrrOrgGrpCd = "${userInfo.orgGrpCd}";
	var paramAlmErrCd = "";
	var paramLdong = "";
	var paramLdongNm = "";
	
	var rtnVal = false;
	
	Highcharts.theme = {
			colors: ['#2b908f','#90ee7e','#f45b5b','#7798BF','#aaeeee','#ff0066','#eeaaee','#55BF3B','#DF5353',	'#7798BF','#aaeeee',],

			chart: {
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
				stops: [[0, '#2a2a2b'], [1, '#3e3e40']],
			},
			style: {
				fontFamily: "'Unica One', sans-serif",
			},
				plotBorderColor: '#606063',
			},
			title: {
			style: {
				color: '#E0E0E3',
				textTransform: 'uppercase',
				fontSize: '20px',
			},

			},

			subtitle: {
			style: {
			color: '#E0E0E3',
			textTransform: 'uppercase',
			},
			},
			xAxis: {
			gridLineColor: '#707073',
			labels: {
			style: {
			color: '#E0E0E3',
			},
			},
			lineColor: '#707073',
			minorGridLineColor: '#505053',
			tickColor: '#707073',
			title: {
			style: {
			color: '#A0A0A3',
			},
			},
			},
			yAxis: {
			gridLineColor: '#707073',
			labels: {
			style: {
			color: '#E0E0E3',
			},
			},
			lineColor: '#707073',
			minorGridLineColor: '#505053',
			tickColor: '#707073',
			tickWidth: 1,
			title: {
			style: {
			color: '#A0A0A3',
			},
			},
			},

			tooltip: {
			backgroundColor: 'rgba(0, 0, 0, 0.85)',
			style: {
			color: '#F0F0F0',
			},
			},
			plotOptions: {
			series: {
			dataLabels: {
			color: '#B0B0B3',
			},
			marker: {
			lineColor: '#333',
			},
			},
			boxplot: {
			fillColor: '#505053',
			},
			candlestick: {
			lineColor: 'white',
			},
			errorbar: {
			color: 'white',
			},
			},
			legend: {

			itemStyle: {

			color: '#E0E0E3',

			},

			itemHoverStyle: {

			color: '#FFF',

			},

			itemHiddenStyle: {

			color: '#606063',

			},

			},

			credits: {

			style: {

			color: '#FFFFFF',

			},

			},

			labels: {

			style: {

			color: '#707073',

			},

			},



			drilldown: {

			activeAxisLabelStyle: {

			color: '#F0F0F3',

			},

			activeDataLabelStyle: {

			color: '#F0F0F3',

			},

			},



			navigation: {

			buttonOptions: {

			symbolStroke: '#DDDDDD',

			theme: {

			fill: '#505053',

			},

			},

			},



			// scroll charts

			rangeSelector: {

			buttonTheme: {

			fill: '#505053',

			stroke: '#000000',

			style: {

			color: '#CCC',

			},

			states: {

			hover: {

			fill: '#707073',

			stroke: '#000000',

			style: {

			color: 'white',

			},

			},

			select: {

			fill: '#000003',

			stroke: '#000000',

			style: {

			color: 'white',

			},

			},

			},

			},

			inputBoxBorderColor: '#505053',

			inputStyle: {

			backgroundColor: '#333',

			color: 'silver',

			},

			labelStyle: {

			color: 'silver',

			},

			},



			navigator: {

			handles: {

			backgroundColor: '#666',

			borderColor: '#AAA',

			},

			outlineColor: '#CCC',

			maskFill: 'rgba(255,255,255,0.1)',

			series: {

			color: '#7798BF',

			lineColor: '#A6C7ED',

			},

			xAxis: {

			gridLineColor: '#505053',

			},

			},



			scrollbar: {

			barBackgroundColor: '#808083',

			barBorderColor: '#808083',

			buttonArrowColor: '#CCC',

			buttonBackgroundColor: '#606063',

			buttonBorderColor: '#606063',

			rifleColor: '#FFF',

			trackBackgroundColor: '#404043',

			trackBorderColor: '#404043',

			},



			// special colors for some of the

			legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',

			background2: '#505053',

			dataLabelsColor: '#B0B0B3',

			textColor: '#C0C0C0',

			contrastTextColor: '#F0F0F3',

			maskColor: 'rgba(255,255,255,0.3)',

			};
	
	
	var paramVal = {};
    this.init = function(id, param) {
    	
    	$(document.body).setData({
			stTimeVal: setDateFormat(getToday(true,'D',-5)),
			edTimeVal: setDateFormat(getToday(true))
        });
		
		setTimeMinuteSelect('t', '', '');
    	
		//맨홀ID 고정
		paramVal.mhDvceIdntId = '702c1ffffe4f34a7'
		paramVal.skAfcoDivCd = $('#skAfcoDivCd').val();
    	getManholeInfo(paramVal);// 맨홀정보 조회
    	
    	//호출
		getManholeChart(paramVal);
    	
		//sessionTime 연장
		javascript:void(setInterval(function(){$('#sessionExpiredTime').click()},10000));
    	
    };
    
    /* 검색조건. 시,분 셋팅*/
    var setTimeMinuteSelect = function(t, m, n) {
    	if (t != '') {                 // 시
    		for (var i=0; i<24; i++) {
    			var time = '';
    			if (i < 10) {
    				time = '0' + new String(i);
    			} else {
    				time = new String(i);
    			}

				$("<option value='"+time+"'>" + time + "</option>").appendTo("#evtTimeStaHour");
				$("<option value='"+time+"'>" + time + "</option>").appendTo("#evtTimeEndHour");
    		}
    	}

    	if (m != '') {                 // 분
    		for (var i=0; i<60; i++) {
    			var minute = '';
    			if (i < 10) {
    				minute = '0' + new String(i);
    			} else {
    				minute = new String(i);
    			}
    		}
    	}
    
    	$('#evtTimeStaHour').setSelected('00');
    	$('#evtTimeEndHour').setSelected('23');
    };
    
    
	
	  // 맨홀차트 정보
	getManholeChart = function(param) {
		
		param.stTimeVal = $('#stTimeVal').val() + $('#evtTimeStaHour').val();		// 작업시간 시작
		param.edTimeVal = $('#edTimeVal').val() + $('#evtTimeEndHour').val();		// 작업시간 종료
		
		manholeChartModel.get({
    		data : param
    	}).done(function(response){
    		
    		console.log("맨홀그래프 조회 성공", response);
    		
    		//chart 그리기
    		drawSpChart("mhSpChart", response);    		
    		
    	}).fail(function(response, status, flag) {
    		
    		console.log("맨홀그래프 조회 실패", response);
		});
    }
	
	
	
    // 맨홀정보 조회
	getManholeInfo = function(param) {    	
		
    	manholeInfoModel.get({
    		data : param
    	}).done(function(response){
    		
    		//맨홀데이터
    		$('#mhDvceIdntId').html(response.chartInfo[0].mhDvceIdntId);
    		$('#mhCommStatNm').html(response.chartInfo[0].mhCommStatNm);
    		$('#mhSwchStatNm').html(response.chartInfo[0].mhSwchStatNm);    		
    		$('#mhShckStatNm').html(response.chartInfo[0].mhShckStatNm);
    		$('#mhBattStatNm').html(response.chartInfo[0].mhBattStatNm);    		
    		$('#mhTmprStatNm').html(response.chartInfo[0].mhTmprStatNm);
    		$('#mhHmdtStatNm').html(response.chartInfo[0].mhHmdtStatNm);    		
    		$('#mhDvceTimeVal').html(response.chartInfo[0].mhDvceTimeVal);

    		//화재
    		$('#coMhDvceIdntId').html(response.chartInfo[0].coMhDvceIdntId);    		
    		$('#coSulStatNm').html(response.chartInfo[0].coStatNm);
    		$('#coFlodStatNm').html(response.chartInfo[0].coFlodStatNm);    		
    		$('#coSnsrBattStatNm').html(response.chartInfo[0].coSnsrBattStatNm);
    		$('#coSnsrTmprStatNm').html(response.chartInfo[0].coSnsrTmprStatNm);
    		$('#coSnsrHmdtStatNm').html(response.chartInfo[0].coSnsrHmdtStatNm); 
    		$('#coDvceTimeVal').html(response.chartInfo[0].coDvceTimeVal);
    		$('#coSnsrCommStatNm').html(response.chartInfo[0].coSnsrCommStatNm);
    		
    		
    		//황화수소    		
    		$('#hyMhDvceIdntId').html(response.chartInfo[0].hyMhDvceIdntId);    		
    		$('#hySulStatNm').html(response.chartInfo[0].hySulStatNm);
    		$('#hyFlodStatNm').html(response.chartInfo[0].hyFlodStatNm);    		
    		$('#hySnsrBattStatNm').html(response.chartInfo[0].hySnsrBattStatNm);
    		$('#hySnsrTmprStatNm').html(response.chartInfo[0].hySnsrTmprStatNm);    		
    		$('#hySnsrHmdtStatNm').html(response.chartInfo[0].hySnsrHmdtStatNm);
    		$('#hyDvceTimeVal').html(response.chartInfo[0].hyDvceTimeVal);    		
    		$('#hySnsrCommStatNm').html(response.chartInfo[0].hySnsrCommStatNm);
    		
    		
    		if(response.chartInfo[0].mhShckStatCd != '0'){
    			$('#mhShckStatNm').addClass('err_text');
    		}
    		if(response.chartInfo[0].mhSwchStatCd != '0'){
    			$('#mhSwchStatNm').addClass('err_text');
    		}
    		if(response.chartInfo[0].coFlodStatCd != '0'){
    			$('#coFlodStatNm').addClass('err_text');
    		}
    		if(response.chartInfo[0].hyFlodStatCd != '0'){
    			$('#hyFlodStatNm').addClass('err_text');
    		}
    		if(response.chartInfo[0].coSnsrCommStatCd != '0'){
    			$('#coSnsrCommStatNm').addClass('err_text');
    		}
    		if(response.chartInfo[0].hySnsrCommStatCd != '0'){
    			$('#hySnsrCommStatNm').addClass('err_text');
    		}
    		if(response.chartInfo[0].mhCommStatCd != '0'){
    			$('#mhCommStatNm').addClass('err_text');
    		} 
    		
    		if(response.chartInfo[0].hySulStatCd != '0'){
    			$('#hySulStatNm').addClass('err_text');
    		} 
    		
    		if(response.chartInfo[0].coStatCd != '0'){
    			$('#coSulStatNm').addClass('err_text');
    		} 
    		
    		console.log("맨홀 상세조회 성공", response);
    	}).fail(function(response, status, flag) {
    		
    		console.log("맨홀 상세조회 실패", response);
		});
    }
		
	$("#btnSearch").on("click", function() {
		getManholeChart(paramVal);
	});

});



var setComma = function(str) {
	var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
	str += ""; // 숫자를 문자열로 변환
	str = str.replace(/[a-zA-Z]/gi, '');
	while ( reg.test(str) ) {
		str = str.replace(reg, "$1" + "," + "$2");
	}
	
	return str;
};

// 맨홀 그래프
function drawSpChart(chartId, param) {
	
	Highcharts.setOptions(Highcharts.theme);
	Highcharts.setOptions({

		time: {	timezoneOffset: -540}});
	
	var chartOptions = {

			chart: {
			type: 'spline',
			zoomType: 'x'
			},

			boost: {
			useGPUTranslations: true
			},

			legend: {
			align: 'right',
			verticalAlign: 'top',
			enabled: true
			},

			title: {
			text: ''
			},

			xAxis: {

			type: 'datetime',

			dateTimeLabelFormats: {

			second: '%m-%d<br/>%H:%M:%S',

			minute: '%m-%d<br/>%H:%M',

			hour: '%m-%d<br/>%H:%M',

			day: '%Y<br/>%m-%d',

			week: '%Y<br/>%m-%d',

			month: '%Y-%m',

			year: '%Y'

			},

			},

			yAxis: { // left y axis

			title: {

			text: null

			}

			},

			plotOptions: {

			spline: {

			lineWidth: 2,

			states: {

			hover: {

			lineWidth: 3

			}

			},

			marker: {

			enabled: false

			}

			},

			series: {



			}

			},

			tooltip: {

			valueDecimals: 1.00,
			xDateFormat: '%Y/%m/%d %H:%M'

			},

			exporting: {

			enabled: false,

			sourceWidth: 687,

			sourceHeight: 210,

			scale: 2

			},

			rangeSelector : { enabled: false },

			credits: { enabled: false }

			};
	
	var srsArray = new Array();
	
	
	srsArray.push({name:"열림" , data: param.dh, turboThreshold:0});
	srsArray.push({name:"충격" , data: param.dg, turboThreshold:0});
	srsArray.push({name:"배터리" , data: param.dba, turboThreshold:0});
	srsArray.push({name:"온도" , data: param.dte, turboThreshold:0});
	srsArray.push({name:"습도" , data: param.dhu, turboThreshold:0});
	srsArray.push({name:"침수" , data: param.sw, turboThreshold:0});
	srsArray.push({name:"일산화탄소" , data: param.sf, turboThreshold:0});
	srsArray.push({name:"황화수소" , data: param.sh, turboThreshold:0});
	
	chartOptions.series = srsArray;
	
	Highcharts.chart(chartId, chartOptions);
	
}

Highcharts.theme = {
    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    chart: {backgroundColor: {linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 }, 
    						  stops: [[0, '#2a2a2b'], [1, '#3e3e40']]
    },
    style: {fontFamily: '\'Unica One\', sans-serif'}, plotBorderColor: '#606063'},
    title: {style: {color: '#E0E0E3', fontSize: '12px'}},
    subtitle: {style: {color: '#E0E0E3', textTransform: 'uppercase'}},
    xAxis: {
        gridLineColor: '#707073',
        labels: {style: {color: '#E0E0E3'}},
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {style: {color: '#A0A0A3'}}
    },
    yAxis: {
        gridLineColor: '#707073',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    lang: {
		thousandsSep: ','
	},
    plotOptions: {
        series: {
            dataLabels: {
                //color: '#B0B0B3'
            	color: '#E0E0E3'
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#CCC'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },

    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    },

    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);