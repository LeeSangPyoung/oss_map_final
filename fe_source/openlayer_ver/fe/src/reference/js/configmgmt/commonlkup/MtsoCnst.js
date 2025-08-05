/**
 * EpwrStcMgmtHeltrCurst.js
 *
 * @author Administrator
 * @date 2018. 02. 12.
 * @version 1.0
 */
var commtsoMain = $a.page(function() {
	var gridIdA 	= 'dataGridA';
	var gridIdYear 	= 'dataGridYear';
	var paramData = null;

	this.init = function(id, param) {
    	initGrid();
		setEventListener();
		paramData = param;
		$('#mtsoCnstLkupArea').setData(param);

		var srchYear =  $("#srchYear").val();
		param.srchYear = srchYear;
		//setRegDataSet(param);

		$('#'+gridIdYear).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsocnstyear', param, 'GET', 'search');



		$('#'+gridIdA).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsocnst', param, 'GET', 'mtsocnst');
		resizeContents();
	}

	function resizeContents(){
    	var contentHeight = $("#mtsoCnstLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

	function initGrid() {
		var d = new Date();
		var maxYear = d.getFullYear() + 1;
		var minYear = d.getFullYear() - 6;
		var option_data = [];
		for(i = maxYear; i > minYear ; i--) {
			var resObj = {cd : i, cdNm : i + "년도"};
			option_data.push(resObj);
		}
		$("#srchYear").clear();
		$("#srchYear").setData({
			data:option_data
		});
		$("#srchYear").val(d.getFullYear().toString());


		var mappingYear =  [
			{ key : 'afeNo', align:'center', title : 'AFE 차수', width: '70px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length == 1){formatval = "00"+formatval.toString();}
					}
					return formatval;
				} },
			{ key : 'totMoney', align:'right', title : '총정산금액', width: '80px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'cstrAmt', align:'right', title : '투자비', width: '80px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'invtCstAmtSum', align:'right', title : '공사비', width: '80px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'invtCstAdtnSum', align:'right', title : '부가세', width: '80px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
    		{ key : 'ayedSetlAmtSum', align:'right', title : '기성비', width: '80px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} }];
		$('#'+gridIdYear).alopexGrid({
			cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : false,
            rowSingleSelect : false,
            rowInlineEdit : true,
            pager : false,
            numberingColumnFromZero : false
           ,paging: { pagerTotal:false },
             columnMapping : mappingYear
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "6row"
        });

		var mappingA =  [
			{ key : 'afeNo', align:'center', title : 'AFE 구분', width: '80px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length == 1){formatval = "00"+formatval.toString();}
					}
					return formatval;
				}  },
			{ key : 'engstNo', align:'center', title : '공사번호(ENG시트번호)', width: '120px' },
    		{ key : 'cstrClNm', align:'center', title : '공사분류', width: '90px' },
    		{ key : 'cstrNm', align:'left', title : '공사명', width: '250px' },
    		{ key : 'lmtsoNm', align:'center', title : '하위국사명', width: '150px' },
    		{ key : 'uprDemdBizDivNm', align:'center', title : '사업목적', width: '100px' },
    		{ key : 'lowDemdBizDivNm', align:'left', title : '사업구분', width: '200px' },
    		{ key : 'workInvtDivNm', align:'center', title : '투자구분', width: '100px' },
    		{ key : 'engstStaNm', align:'center', title : '진행상태', width: '100px' },
    		{ key : 'cnstnBpNm', align:'left', title : '시공업체', width: '130px' },
    		{ key : 'engstIsueReqDt', align:'center', title : 'ENG발행일', width: '90px' },
    		{ key : 'aprvDt', align:'center', title : '구축완료일', width: '90px'},
    		{ key : 'setlAprvDt', align:'center', title : '정산완료일', width: '90px'},

    		{ key : 'cstrAmt', align:'right', title : '투자비', width: '100px',
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				}  },
    		{ key : 'invtCstAmtSum', align:'right', title : '공사비', width: '100px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
			{ key : 'invtCstAdtnSum', align:'right', title : '부가세', width: '100px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} },
			{ key : 'ayedSetlAmtSum', align:'right', title : '기성비', width: '100px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} }	,
			{ key : 'totMoney', align:'right', title : '총정산비', width: '100px' ,
				render:function(value, data, render, mapping){
					var formatval = value;
					if(formatval != undefined){
						if(formatval.length >= 4){formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");}
					}
					return formatval;
				} }
    		];
		gridModelA = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsocnst"
    		,data: {
    	        pageNo: 1,
    	        rowPerPage: 100,
    	    }
        });

    	//그리드 생성
        $('#'+gridIdA).alopexGrid({
        	 cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : false,
             rowSingleSelect : true,
             rowInlineEdit : true,
             pager : true,
             numberingColumnFromZero : false
            ,paging: {
         	   pagerTotal:true
            }, columnMapping : mappingA
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			ajax: {model: gridModelA, scroll: true },
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "15row"
        });



	}

	function setRegDataSet(data) {
    	data.pageNo = '1';
    	data.rowPerPage = '100';

    	gridModelA.get({
    		data: data
    	}).done(function(response,status,xhr,flag){})
    	.fail(function(response,status,xhr,flag){});

		$('#'+gridIdA).alopexGrid('hideProgress');
	}

	function setEventListener() {
		$('#srchYear').on('change', function(e) {
			var mtsoId =  $("#mtsoId").val();
			var srchYear =  $("#srchYear").val();
			var data = {mtsoId : mtsoId, srchYear : srchYear};
			$('#'+gridIdYear).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsocnstyear', data, 'GET', 'search');
			$('#'+gridIdA).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/mtsocnst', data, 'GET', 'mtsocnst');
			setRegDataSet(data);
		 });

	}

	function successCallback(response, status, jqxhr, flag){
		if(flag == 'mtsocnst'){
			$('#'+gridIdA).alopexGrid('hideProgress');
    		$('#'+gridIdA).alopexGrid('dataSet', response.mtsocnst);
		}

		if(flag == 'search'){
			$('#'+gridIdYear).alopexGrid('hideProgress');
    		$('#'+gridIdYear).alopexGrid('dataSet', response.mtsocnstyear);

    		var chartXVal = [];
			var JsonArray = new Array();

			var tmpNm = [];
			$.each(response.mtsocnstyear, function(i, item){
				var nM = response.mtsocnstyear[i].afeNo;
				var conData = {afeDemdDgr : nM};
				tmpNm.push(conData);
			});
			var uniqueNames = [];
			$.each(tmpNm, function(i, el) {
				if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
			});

			for(j = 0; j < uniqueNames.length; j++) {
				var afeDemdDgr = uniqueNames[j].afeDemdDgr;
				if(afeDemdDgr != undefined){
					if(afeDemdDgr.length == 1){afeDemdDgr = "00"+afeDemdDgr.toString();}
				}

				chartXVal.push(afeDemdDgr);
			}
			var tmpData = 0;
			var chartDataA =[];
			var chartDataLn =[];
			var chartDataT =[];
			$.each(response.mtsocnstyear, function(i, item) {
				var tmpT = parseFloat(response.mtsocnstyear[i].cstrAmt);
				chartDataT.push(tmpT);
				var tmpLn = parseFloat(response.mtsocnstyear[i].invtCstAmtSum);
				chartDataLn.push(tmpLn);
				var tmpA = parseFloat(response.mtsocnstyear[i].ayedSetlAmtSum);
				chartDataA.push(tmpA);
			});

			var arrData = {name : "투자비", data : chartDataT};
			JsonArray.push(arrData);
			var arrData = {name : "공사비", data : chartDataLn};
			JsonArray.push(arrData);
			var arrData = {name : "기성비", data : chartDataA};
			JsonArray.push(arrData);

			Highcharts.chart('chartContainer', {
				title:{ text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } } },
				legend:{ layout: 'horizontal', align:'center', verticalAlign:'bottom' },
				plotOptions:{ line:{ dataLabels:{ enabled: true } } },
				series:JsonArray,
				navigation:{ buttonOptions: { enabled:false } },
				//responsive: { rules:[{ condition:{ maxWidth: 500 }, chartOptions:{ legend:{ layout:'horizontal', align:'center', verticalAlign:'bottom' } } }]},
				minTickInterval : 1
			});
    	}

	}

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

});