/**
 * WreEqpIcreObjPop.js
 *
 * @author P182022
 * @date 2022. 08. 04. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
   	var perPage 	= 100;
   	var gridId		= "dataGrid";
   	var dataEqpGrid	= "dataEqpGrid";

//   	var mIcreDivNm	= "";

	var mHdofcCmb 	= [{value : '5100', text : '수도권'},{value : '5300', text : '동부'},{value : '5500', text : '서부'},{value : '5600', text : '중부'}];
	var mAreaId_1 	= [{value : 'T11001', text : '수도권'}];
	var mAreaId_2 	= [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var mAreaId_3 	= [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var mAreaId_4 	= [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];

    this.init = function(id, param) {
    	setSelectCode(param);
    	setEventListener();
    	createChart();
    	// 유선장비 증설대상 상세 조회
    	getDtlSearch(param);
    };

    // 선택박스 코드 설정
    function setSelectCode(param) {
    	var option_data = [];

    	//본부
    	$('#hdofcCd').setData({ data : mHdofcCmb, hdofcCd: param.hdofcCd });

    	switch(param.hdofcCd){
		case "5100":
			option_data =  mAreaId_1;
			break;
		case "5300":
			option_data =  mAreaId_2;
			break;
		case "5500":
			option_data =  mAreaId_3;
			break;
		case "5600":
			option_data =  mAreaId_4;
			break;
    	}

    	//지사
    	$('#areaId').setData({ data : option_data, areaId: param.areaId });

//    	switch(param.icreDivCd){
//		case "10":
//			mIcreDivNm =  "트래픽초과";
//			break;
//		case "20":
//			mIcreDivNm =  "";
//			break;
//    	}

    }

    // 이벤트 설정
    function setEventListener() {

    	//닫기
		$('#btnDtlCncl').on('click', function(e) {
			$a.close();
		});
	}

    // 유선장비 증설대상 상세 조회
    function getDtlSearch(param) {
        httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/obj/eqpIcreObjMgmtDtl', param, 'GET', 'detail');
    }

    //request 호출
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		Highcharts.setOptions({
    		lang:{thousandsSep: ','}
    	});

		if(flag == 'detail'){
			$('#detailForm').formReset();
    		var data = response.detailData;
    		$('#detailForm').setData(data);
    		//증설구분
//    		$('#icreDivNm').val(mIcreDivNm);


    		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/obj/eqpIcreChart', data, 'GET', 'eqpIcreChart');

		}

		if(flag == 'eqpIcreChart'){
			var chartXVal = [];
			var JsonArray = new Array();

			if (response.allchart.length == 0) {
				$("#divChart").html("");
				var appendStr = "<table style='width:100%;'>";
					appendStr += "<tbody>";
					appendStr += "<tr><td style='text-align:center;height:200px;'>조회된 데이터가 없습니다</td></tr>";
					appendStr += "</tbody>";
					appendStr += "</table>";
				$("#divChart").append(appendStr);
			} else {
				$("#divChart").html("");
				var appendStr = "<table style='width:100%;'>";
					appendStr += "<tbody>";
					appendStr += "<tr><td style='text-align:center;height:200px;'>";
					appendStr += "<div id='chartContainer' style='min-width: 150px; width:100%; height: 200px; margin: 0 auto;'></div>";
					//appendStr += "<div style='width:100%;text-align:center;'><b>"+tmpText+"</b></div>";
					appendStr += "</td></tr>";
					appendStr += "</tbody>";
					appendStr += "</table>";
				$("#divChart").append(appendStr);
				var chartData1 =[];
				var chartData2 =[];
				var tmpData1 = 0;
				var tmpData2 = 0;
				$.each(response.allchart, function(i, item){
					chartXVal.push(response.allchart[i].clctMm)
//					tmpData1 = Math.round(parseFloat(response.allchart[i].rate),2);
					tmpData1 = parseFloat(response.allchart[i].rate);
					tmpData2 = parseFloat(response.allchart[i].predRate);
					chartData1.push(tmpData1);
					chartData2.push(tmpData2);
				});

				var arrData = {name : "트래픽(Mb)", data : chartData1, color : "orange"}
				JsonArray.push(arrData);
//				arrData = {name : "예측 트래픽(Mb)", data : chartData2, color : "rgba(37, 163, 220)", dashStyle : "dash"};
//				arrData = {name : "예측 트래픽(Mb)", data : chartData2, color : "#acacb1", dashStyle : "dash", colorByPoint: true, dataLabels :{enabled : true}};
//				arrData = {name : "예측 트래픽(Mb)", data : chartData2, dashStyle : "dash",color : "#acacb1", lineWidth : 1};
				arrData = {name : "예측 트래픽(Mb)", data : chartData2, dashStyle : "longdash",color : "#acacb1", lineWidth : 1};

				JsonArray.push(arrData);

			}
			Highcharts.chart('chartContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } }
					  , labels:{ formate: '{value:,.0f}' }
				},
				legend:{ layout: 'horizontal', align:'right', verticalAlign:'middle' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArray,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
			$('#divChart').progress().remove();
		}


//		switch(flag){
//			case "detail":
//
//				break;
//		}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "detail":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

    // 챠트생성
    function createChart() {

    	$("#divChart").html("");
		var appendStr = "<table style='width:100%;'>";
			appendStr += "<tbody>";
			appendStr += "<tr><td style='text-align:center;height:200px;'>조회된 데이터가 없습니다</td></tr>";
			appendStr += "</tbody>";
			appendStr += "</table>";
		$("#divChart").append(appendStr);
//		Highcharts.chart('dataChart',
//				{
//					title : {
//						text : ""
//					},
//					xAxis : {
//						categories : [ "22년 01월", "22년 02월", "22년 03월", "22년 04월", "22년 05월", "22년 06월", "22년 07월" ]
//					},
//					yAxis : {
//						title: {
//							text: ''
//						},
//						plotLines : [{
//							value : 0,
//							width : 1,
//							color : "#808080"
//
//						}]
//					},
//					tooltip : {
//						headerFormat : '<b>{point.x}</b><br/>',
//						pointFormat : '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
//					},
//					legend : {
//						align : 'right',
//						x : -30,						//'-'값 일수록 오른쪽에서 왼쪽으로 이동
//						y : 10,						//'-'값 일수록 하단에서 상단으로 이동
//						verticalAlign : 'top',
//						floating : true,
//									backgroundColor : (Highcharts.theme && Highcharts.theme.background2)|| 'white',
//									borderColor : '#CCC',
//									borderWidth : 1,
//									shadow : false
//					}
//				});
	}

    $.fn.formReset = function() {

    	return this.each(function() {
    		var type = this.type,
    			tag = this.tagName.toLowerCase()
    		if (tag === "form") {
    			return $(":input", this).formReset()
    		}

    		if (type === "text" || type === "password" || type == "hidden" || tag === "textarea") {
    			this.value = ""
    		}
    		else if (type === "checkbox" || type === "radio") {
    			this.checked = false
    		}
    		else if (tag === "select") {
    			this.selectedIndex = -1
    		}
    	})
    }

});