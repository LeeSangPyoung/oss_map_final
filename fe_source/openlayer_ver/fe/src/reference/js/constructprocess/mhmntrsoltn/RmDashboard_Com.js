
var rmServerUrl = "tango-transmission-biz/transmission/constructprocess/manholemgmt";

//var rmServerUrl2 = "tango-transmission-gis-biz/transmission/gis/rm/dashboard";

/*var maxClctDtModel = Tango.ajax.init({url : rmServerUrl2 + "/getMaxClctDt"}); // 수집일 model
var eteRateModel = Tango.ajax.init({url : rmServerUrl + "/getEteRateData"}); // 유선망 ETE 연결율 model
var cblBubbleChartModel = Tango.ajax.init({url : rmServerUrl + "/getCblBubbleChartList"}); // 유선망 위험도/영향도 버블차트 model
var cblCntChartModel = Tango.ajax.init({url : rmServerUrl + "/getCblCntChartList"}); // 케이블건수 차트 model
var cblDblLineChartModel = Tango.ajax.init({url : rmServerUrl + "/getCblDblLineChartList"}); // 케이블 영향도/위험도 더블라인차트 모델
var cblGridModel = Tango.ajax.init({url : rmServerUrl + "/getCblGridList"}); // 유선망 영향도/위험도 그리드 모델
var kpiModel = Tango.ajax.init({url : rmServerUrl + "/getKpi"}); // RM안정성지표

var rmIndiModel = Tango.ajax.init({url : rmServerUrl + "/getRmIndiData"}); // RM안정성지표
*/
		
var manholeStcModel = Tango.ajax.init({url : rmServerUrl + "/getManholeStc"}); // 맨홀통계

var	cblDongNmModel = Tango.ajax.init({url : rmServerUrl + "/getCblDongNm"}); // 동명조회
var	rmSidoModel = Tango.ajax.init({url : rmServerUrl + "/getRmSidoList"});
var	rmSggModel = Tango.ajax.init({url : rmServerUrl + "/getRmSggList"});
var	rmEmdModel = Tango.ajax.init({url : rmServerUrl + "/getRmEmdList"});

var getMaxClctDt = null; //수집일 조회 function
var getEteRateData = null; // 유선망 ETE 연결율 function
var getCblBubbleChartList = null; // 유선망 위험도/영향도 버블차트 function
var getCblCntChartList = null; // 케이블건수 차트 function
var getCblDblLineChartList = null; // 케이블 영향도/위험도 더블라인차트 funtion
var getCblGridList = null; // 영향도/위험도 그리드  funtion
var getKpiData = null; // RM안정성지표 funtion
var getCblDongNm = null; // 동명 funtion

var rmIndiDataObj = {};

var chartColors = ['#2b908f', '#90ee7e', '#f45b5b', '#ff9f71', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'];

var selectRmSido = Tango.select.init({
	el : "#rmSidoCd", 
	model : rmSidoModel,
    allType : {ldongCd : "", ldongNm : "전체"},
    valueField : "ldongCd",
    labelField : "ldongNm"
});

var selectRmSgg = Tango.select.init({
	el : "#rmSggCd", 
	model : rmSggModel,
    allType : {ldongCd : "", ldongNm : "전체"},
    valueField : "ldongCd",
    labelField : "ldongNm"
});

var selectRmEmd = Tango.select.init({
	el : "#rmEmdCd", 
	model : rmEmdModel,
    allType : {ldongCd : "", ldongNm : "전체"},
    valueField : "ldongCd",
    labelField : "ldongNm"
});

$a.page(function() {
	var chrrOrgGrpCd = $("#skAfcoDivCd").val();
	
    this.init = function(id, param) {
        if (chrrOrgGrpCd == "T") {
        	$("#sktBtn").removeClass("on");
        	$("#skbBtn").addClass("on");
        } else if (chrrOrgGrpCd == "B") {
        	$("#skbBtn").removeClass("on");
			$("#sktBtn").addClass("on");
        }
        
        getSelectRmSido();
        
        // 수집일 조회
    	getMaxClctDt();
    	setEventListener();
    	
    	clock();
    	
    	//코드매핑
    	setSelectByCode('mhAlmErrCd', 'all', 'C03226', null,'');
    	
    };
    
	// 현재 시간 표시
	function clock() {
		var time = new Date();
		
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var date = time.getDate();
		var day = time.getDay();
		
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var seconds = time.getSeconds();
		
		month = (month < 10  ? ('0' + month) : month);
		date = (date < 10 ? ('0' + date) : date);
		
		hours = (hours < 10 ? ('0' + hours) : hours);
		minutes = (minutes < 10 ? ('0' + minutes) : minutes);
		seconds = (seconds < 10 ? ('0' + seconds) : seconds);
		
		var sysdate = ": " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
		$('#clock').text(sysdate);
		
		setTimeout(clock, 1000);	// clearTimeout( );		일정시간마다 반복 실행 	, 실행중 다른 sertimeout 로 인해 함수가 호출되도 기존에 실행되던 함수에 영향 x

	}
    
    // 맵초기화
    getMaxClctDt = function () {
    	var orgGrpCd = getOrgGrpCd();    	
    		
    		$("#dongCd").val("0000000000");
	    	$("#dongNm").html("전국");
	    	$("#dongNm2").html("전국");
	    	$("#dongNm3").html("전국");
	    	
    		if (window.mgMap_rm == undefined) {
        		T_a.Map.init("0000000000"); // 지역별 케이블정보 지도 초기화
    		} else {
    			T_a.Map.setGotoResionMap("0000000000"); // 지역별 케이블정보 조회
    		}
    }
    
    getCblDongNm = function(ldongCd, mapLv) {
    	cblDongNmModel.get({
    		data : {
    			ldongCd : ldongCd,
    			mapLv : mapLv
    		}
    	}).done(function(response, status, jqxhr, flag){
    		$("#dongNm").html(response.ldongNm);
    		$("#dongNm2").html(response.ldongNm);
    		$("#dongNm3").html(response.ldongNm);
    	}).fail(function(response, status, jqxhr, flag) {
    		console.log("동명 조회 실패", response);
    	});
    }
	
	function changeSelectBox() {
		var dongCd = "";
		if ($("#rmEmdCd").val() != "") {
			dongCd = $("#rmEmdCd").val();
			dongNm = $("#rmEmdCd option:selected").text();
		} else if ($("#rmSggCd").val() != "") {
			dongCd = $("#rmSggCd").val();
			dongNm = $("#rmSggCd option:selected").text();
		} else if ($("#rmSidoCd").val() != "") {
			dongCd = $("#rmSidoCd").val();
			dongNm = $("#rmSidoCd option:selected").text();
		} else {
			dongCd = "0000000000";
			dongNm = "전국";
		}
		
		$("#dongCd").val(dongCd);
		$("#dongNm").html(dongNm);
		$("#dongNm2").html(dongNm);
		$("#dongNm3").html(dongNm);
		
		T_a.Map.setGotoResionMap(dongCd);
		
		var lv = getMapLv(dongCd);
		
		// 시도 변경시 맨홀상태 업데이트
		getManholeStc(dongCd);
		
		//getCblBubbleChartList(dongCd);
		
		/*if (lv == "depth4") {
			getCblDblLineChartList(dongCd);
		} else {
			getCblCntChartList(dongCd);
		}*/		
		
	}
	
    // 맨홀 지역별 통계
	getManholeStc = function(dongCd) {
    	
    	var orgGrpCd = getOrgGrpCd();  
    	
    	
    	manholeStcModel.get({
    		data : {
    			orgGrpCd : orgGrpCd,
    			ldongCd : dongCd,
    			mhAlmErrCd : $('#mhAlmErrCd').val(),
    			skAfcoDivCd : $('#skAfcoDivCd').val()
    		
    		}
    	}).done(function(response){
    		
    		//맨홀데이터
    		$('#mhTotCnt').html(response.mhStatStc.mhTotCnt);
    		$('#mhSwchCloseCnt').html(response.mhStatStc.mhSwchCloseCnt);
    		$('#mhSwchOpenCnt').html(response.mhStatStc.mhSwchOpenCnt);
    		
    		$('#mhNonShckCnt').html(response.mhStatStc.mhNonShckCnt);
    		$('#mhShckCnt').html(response.mhStatStc.mhShckCnt);
    		
    		$('#commCnt').html(response.mhStatStc.commCnt);
    		$('#errCommCnt').html(response.mhStatStc.errCommCnt);
    		
    		$('#battCnt').html(response.mhStatStc.battCnt);
    		$('#errBattCnt').html(response.mhStatStc.errBattCnt);
    		
    		$('#tmprCnt').html(response.mhStatStc.tmprCnt);
    		$('#errTmprCnt').html(response.mhStatStc.errTmprCnt);
    		
    		$('#hmdtCnt').html(response.mhStatStc.hmdtCnt);
    		$('#errHmdtCnt').html(response.mhStatStc.errHmdtCnt);
    		
    		//센서데이터
    		$('#snsrCnt').html(response.mhStatStc.snsrCnt);    		
    		
    		$('#snsrCommCnt').html(response.mhStatStc.snsrCommCnt);
    		$('#errSnsrCommCnt').html(response.mhStatStc.errSnsrCommCnt);
    		
    		$('#snsrBattCnt').html(response.mhStatStc.snsrBattCnt);
    		$('#errSnsrBattCnt').html(response.mhStatStc.errSnsrBattCnt);
    		
    		$('#snsrFlodCnt').html(response.mhStatStc.snsrFlodCnt);
    		$('#errSnsrFlodCnt').html(response.mhStatStc.errSnsrFlodCnt);
    		
    		$('#snsrMsmtCnt').html(response.mhStatStc.snsrMsmtCnt);
    		$('#errSnsrMsmtCnt').html(response.mhStatStc.errSnsrMsmtCnt);    		
    		
    		console.log("맨홀지역별 통계조회 성공", response);
    	}).fail(function(response, status, flag) {

    		
    		
    		console.log("맨홀지역별 통계조회 실패", response);
		});
    }
	
	
	function setEventListener() {
		
		$('#btnRemaks').on('click',function(e){

			$('#modalDialog3').open({
				title: '유해가스농도기준',
				width: 500,
				height: 250,
			    resizable: true,
			    movable: true
			  });
		});		
		
		//////////////////////////////////////////
		
		$("#mapBtn").on("click", function() {
			$("#infoBtn").addClass("on");
			$("#mapBtn").removeClass("on");
			
			$("#chartDiv").hide();
			$("#mapDiv").show();
			
			if (window.mgMap == undefined) {
				var dongCd = "";
				var mapLv = "";
				if ($("#rmEmdCd").val() != "") {
					
					L.MG.Api.getHJEmdByCode($("#rmEmdCd").val(), {
						geometry : true
					}).then(function(result) {
						T_g.Map.init([result[0].COORD_Y, result[0].COORD_X], 8);
					});
				} else if ($("#rmSggCd").val() != "") {
					
					L.MG.Api.getHJEmdByCode($("#rmSggCd").val(), {
						geometry : true
					}).then(function(result) {
						T_g.Map.init([result[0].COORD_Y, result[0].COORD_X], 7);
					});
					
				} else if ($("#rmSidoCd").val() != "") {
					
					L.MG.Api.getSggByCode($("#rmSidoCd").val(), {
						geometry : true
					}).then(function(result) {
						T_g.Map.init([result[0].COORD_Y, result[0].COORD_X], 5);
					});
					
				} else {
					T_g.Map.init(nationMapConfig.center, nationMapConfig.zoom);
				}
			}
		});
		
		$('#mhAlmErrCd').on('change', function(e) {
			
			var	dongCd = "0000000000";
			var	dongNm = "전국";			
			
			$("#dongCd").val(dongCd);
			$("#dongNm").html(dongNm);
			$("#dongNm2").html(dongNm);
			$("#dongNm3").html(dongNm);
			
			T_a.Map.setGotoResionMap(dongCd);			
			var lv = getMapLv(dongCd);
			
			getManholeStc();
			//getCblMapDataList();
			
		});
		
		$("#rmSidoCd").on("change", function() {
			initSelectRmEmd();
			initSelectRmSgg();
			
			if (this.value != "") {
				getSelectRmSgg(this.value);
			}
			
			changeSelectBox();
		});
		
		$("#rmSggCd").on("change", function() {
			initSelectRmEmd();
			
			if (this.value != "") {
				getSelectRmEmd(this.value);
			}
			
			changeSelectBox();
		});
		
		$("#rmEmdCd").on("change", function() {
			changeSelectBox();
		});
		
		// 지도이동
		$("#cblMapBtn").on("click", function() {
			$("#infoBtn").addClass("on");
			$("#mapBtn").removeClass("on");
			
			$("#chartDiv").hide();
			$("#mapDiv").show();
			
			$("#gisCblMgmtNo").val($("#cblMgmtNo").val());
			
			if (window.mgMap == undefined) {
				var center = window.mgMap_rm.getCenter();
				T_g.Map.init(center, 2, $("#cblMgmtNo").val());
			} else {
				T_g.Map.selectFeature("line", $("#cblMgmtNo").val(), true);
				T_g.Map.getGisCblInfoData($("#cblMgmtNo").val());
			}
		});
		

		
		
	}
});


//맨홀통계 클릭시 이벤트
//맨홀갯수
//$("manhole_stat").click(function(flag) {
	
function manhole_stat(flag){
	
	//전국일때
	var data;
	
	//본부가선택되어 있을때(LDONG)
	var ldong = $("#dongCd").val();
	if(ldong == "0000000000"){ //전국
		data = {"ldong": 'ALL'};
	}else{
		data = {"ldong": $("#dongCd").val()};
	}
	data.skAfcoDivCd = $('#skAfcoDivCd').val();	
	
	if("mhTotCnt" == flag.id){
		
	}else if("mhSwchCloseCnt" == flag.id){ //개폐여부:정상
		data.mhSwchStatCd = '0';	
	}else if("mhSwchOpenCnt" == flag.id){ //개폐여부:열림
		data.mhSwchStatCd = '1';	
	}else if("mhSwchCloseCnt" == flag.id){ //충격여부:미감지
		data.mhShckStatCd = '0';	
	}else if("mhShckCnt" == flag.id){ //충격여부:감지
		data.mhShckStatCd = '1';	
	}else if("commCnt" == flag.id){ //통신상태:정상
		data.mhCommStatCd = '0';	
	}else if("errCommCnt" == flag.id){ //통신상태:장애
		data.mhCommStatCd = '99';	
	}else if("battCnt" == flag.id){ //배터리:정상
		data.mhBattStatCd = '0';	
	}else if("errBattCnt" == flag.id){ //배터리:장애
		data.mhBattStatCd = '99';	
	}else if("tmprCnt" == flag.id){ //온도:정상
		data.mhTmprStatCd = '0';	
	}else if("errTmprCnt" == flag.id){ //온도:장애
		data.mhTmprStatCd = '99';	
	}else if("hmdtCnt" == flag.id){ //습도:정상
		data.mhHmdtStatCd = '0';	
	}else if("errHmdtCnt" == flag.id){ //습도:장애
		data.mhHmdtStatCd = '99';	
	}
	
	linkManhole(data);
};
	

//$("#snsr_stat").click(function(flag) {
	
function snsr_stat(flag){
	
	//전국일때
	var data;
	
	//본부가선택되어 있을때(LDONG)
	var ldong = $("#dongCd").val();
	if(ldong == "0000000000"){ //전국
		data = {"ldong": 'ALL'};
		
	}else{
		data = {"ldong": $("#dongCd").val()};
	}
	
	data.skAfcoDivCd = $('#skAfcoDivCd').val();

	if("snsrCnt" == flag){ //센서 총 갯수
		
	}else if("snsrCommCnt" == flag.id){ //통신상태:정상
		data.snsrCommStatCd = '0';	
	}else if("errSnsrCommCnt" == flag.id){ //통신상태:장애
		data.snsrCommStatCd = '99';	
	}else if("snsrBattCnt" == flag.id){ //배터리상태:정상
		data.snsrBattStatCd = '0';	
	}else if("errSnsrBattCnt" == flag.id){ //배터리상태:장애
		data.snsrBattStatCd = '99';	
	}else if("snsrFlodCnt" == flag.id){ //침수여부:정상
		data.flodStatCd = '0';	
	}else if("errSnsrFlodCnt" == flag.id){ //침수여부:침수
		data.flodStatCd = '1';	
	}else if("snsrMsmtCnt" == flag.id){ //계측여부:정상
		data.snsrMsmtStatCd = '0';	
	}else if("errSnsrMsmtCnt" == flag.id){ //계측여부:장애
		data.snsrMsmtStatCd = '99';	
	}
	
	linkManholeSnsr(data);
};		



function linkManhole(data) {
	
	parent.$a.navigate('/tango-transmission-web/constructprocess/mhmntrsoltn/MhStatCurstLst.do', data);
}

function linkManholeSnsr(data) {
	
	parent.$a.navigate('/tango-transmission-web/constructprocess/mhmntrsoltn/MhSnsrStatCurstLst.do', data);
}



function rmExcelDown() {
	
	$("body").progress();
	
	Tango.ajax({
		url: 'tango-transmission-gis-biz/transmission/gis/rm/dashboard/createExcelFile',
		method: 'POST',
		data: rmIndiDataObj
	}).done(function(response, status, jqxhr, flag) {
		
		$("body").progress().remove();
		
		var $form=$( "<form></form>" );
	    $form.attr( "name", "downloadForm" );
	    $form.attr( "action", "/tango-transmission-gis-biz/transmission/gis/rm/dashboard/downloadExcel");
	    $form.attr( "method", "get" );
	    $form.attr( "target", "_self" );
	    $form.append(Tango.getFormRemote());
	    $form.append( "<input type='hidden' name='fileName' value='" + response.returnMessage + "' />" );
	    $form.appendTo('body');	    
	    $form.submit().remove();
		
		/*var $form=$('<form action="/tango-transmission-gis-biz/transmission/gis/rm/dashboard/downloadExcel"></form>');
		$form.attr('method', 'get');
		$form.attr('target', '_self');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="fileName" value="' + response.returnMessage + '" />');
		$form.appendTo('body');
	    $form.submit().remove();*/
		
		
	}).fail(function(response, status) {
		alert('엑셀 다운로드를 실패하였습니다.');
		$("body").progress().remove();
	});
	
}

var noDataHtml = [];
noDataHtml.push('<div class="rm_no_data">');
noDataHtml.push('	<span>No Data to display</span>');
noDataHtml.push('</div>');

var getOrgGrpCd = function () {
	var orgGrpCd = "";
	
	if ($("#sktBtn").hasClass("on")) {
		orgGrpCd = "SKB";
	} else if ($("#skbBtn").hasClass("on")) {
		orgGrpCd = "SKT";
	} else {
		
	}
	return orgGrpCd; 
};

var setClctDt = function (clctDt) {
	return clctDt.substring(0, 4) + "-" + clctDt.substring(4, 6) + "-" + clctDt.substring(6, 8);
};

var getClctDt = function () {
	var clctDt = $("#clctDt").val();
	return clctDt.replace(/-/gi, "");
};

function chkLenDate(d) {
	if (d < 10) {
		return "0" + d;
	} else {
		return d;
	}		    				
}

function isLeapYear(year) {
	year = Number(year);
	
	if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
		return true;
	} else {
		return false;
	}
}

function getYearArr() {
	var yearArr = [];
	var year = ($("#clctDt").val()).substr(0 ,4);
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var lastDay = 0;
	var date = "";
	var month = "";
	var day = "";
	
	for (var i = 0; i < 12; i++) {
		month = chkLenDate(i+1);
		lastDay = monthDays[i];
		// 2월달 윤달 체크
		if (i == 1) {
			if (isLeapYear(year)) {
				lastDay = 29;
			}
		}
		for (var j = 1; j <= lastDay; j++) {
			day = chkLenDate(j);
			yearArr.push(year + month + day);
		}
	}
	return yearArr;
}

function getSelectRmSido(ldongCd) {
	selectRmSido.model.get().done(function(response, status, jqxhr, flag) {
//		if (ldongCd != undefined) {
//			$("#rmSidoCd").val(ldongCd).attr("selected", "selected");
//			$("#rmSidoCd").refresh();
//		}
	}).fail(function(response, status, flag) {
		
	});
}

function getSelectRmSgg(ldongCd) {
	selectRmSgg.model.get({
		data : {
			ldongCd : ldongCd
		}
	}).done(function(response, status, jqxhr, flag) {
		
	}).fail(function(response, status, flag) {
		
	});
	
}

function getSelectRmEmd(ldongCd) {
	selectRmEmd.model.get({
		data : {
			ldongCd : ldongCd
		}
	}).done(function(response, status, jqxhr, flag) {
//		$("#rmSggCd").val(ldongCd).attr("selected", "selected");
//		$("#rmSidoCd").val(ldongCd).attr("selected", "selected");
	}).fail(function(response, status, flag) {
		
	});
}

function initSelectRmSgg() {
	$("#rmSggCd").html('<option value="">전체</option>');
	$("#rmSggCd").refresh();
}

function initSelectRmEmd() {
	$("#rmEmdCd").html('<option value="">전체</option>');
	$("#rmEmdCd").refresh();
}

function setSelectBoxByAdongCd(dongCd, mapLv) {
	if ("depth1" == mapLv) {
		initSelectRmEmd();
		initSelectRmSgg();
		
		$("#rmSidoCd").val("").attr("seleted", "seleted");
		$("#rmSidoCd").refresh();
	} else if ("depth2" == mapLv) {
		initSelectRmEmd();
		
		getSelectRmSgg(dongCd);
		
		$("#rmSidoCd").val(dongCd).attr("seleted", "seleted");
		$("#rmSidoCd").refresh();
	} else if ("depth3" == mapLv) {
		getSelectRmEmd(dongCd);
		
		$("#rmSggCd").val(dongCd).attr("seleted", "seleted");
		$("#rmSggCd").refresh();
	} else if ("depth4" == mapLv) {
		$("#rmEmdCd").val(dongCd).attr("seleted", "seleted");
		$("#rmEmdCd").refresh();
	}
}



var setComma = function(str) {
	var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
	str += ""; // 숫자를 문자열로 변환
	str = str.replace(/[a-zA-Z]/gi, '');
	while ( reg.test(str) ) {
		str = str.replace(reg, "$1" + "," + "$2");
	}
	
	return str;
};



