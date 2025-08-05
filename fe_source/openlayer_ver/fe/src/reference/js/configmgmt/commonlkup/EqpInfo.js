/**
 * EqpDtlLkup.js



 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */



var comEqp = $a.page(function() {
	var d = new Date();
	var sDate = d.getFullYear().toString()+"-"+NumberPad(d.getMonth(), 2)+"-01";
	var eDate = d.getFullYear().toString()+"-"+NumberPad(d.getMonth() + 1, 2)+"-01";
	if (d.getMonth().toString() == "12") {
		eDate = (d.getFullYear()+1).toString()+"-01-01";
	}
	var ParamEqpId = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	ParamEqpId = param.eqpId;
    	var tmpEqp = param.eqpId.substring(0,2);
		if (tmpEqp == "SE") {
			$("#eqpfrm").css("display","none");
			$("#sbEqpfrm").css("display","block");
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', param, 'GET', 'sbeqpinfo');
			var tmpGubun = param.eqpId.substr(2,1);
			if (tmpGubun == "O" || tmpGubun == "E") {
				$("#dtl_ETC").css("display","");
			} else {
				$("#dtl_"+tmpGubun).css("display","");
			}
		} else {
			$("#eqpfrm").css("display","block");
			$("#sbEqpfrm").css("display","none");
			httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfo');
		}
        setEventListener();
        setRegDataSet(param);
        resizeContents();
    };

    function resizeContents(){
    	var contentHeight = $("#eqpDtlLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

    function setRegDataSet(data) {

    	var nowYear = new Date().getFullYear();
		var option_data = [];
		for(i = nowYear; i > nowYear - 10; i--) {
			var resObj = {dsbnYearVal : i,dsbnYearNm : i};
			option_data.push(resObj);
		}
		$("#rtfYear").clear();
		$("#rtfYear").setData({
			data:option_data
		});
		$("#rtfYear").val(nowYear);


		$("#batryYear").clear();
		$("#batryYear").setData({
			data:option_data
		});
		$("#batryYear").val(nowYear);



		var option_data = [];
		var yms = new Date();
		var getMonth = yms.getMonth() + 1;
		for(i = 12; i > 0; i--) {
			var resObj = {dsbnMonthVal : i, dsbnMonthNm : NumberPad(i, 2)};
			option_data.push(resObj);
		}

		$("#rtfMonth").clear();
		$("#rtfMonth").setData({
			data:option_data
		});
		$("#rtfMonth").val(getMonth);


		$("#batryMonth").clear();
		$("#batryMonth").setData({
			data:option_data
		});
		$("#batryMonth").val(getMonth);


		$("#rtfChartGubun").clear();
		var option_data =  [{rtfChartId: "01",rtfChartNm: "출력전류"}, {rtfChartId: "02",rtfChartNm: "부하율"}, {rtfChartId: "05",rtfChartNm: "방전시험"}]; //{rtfChartId: "03",rtfChartNm: "모듈 과부족"}, {rtfChartId: "04",rtfChartNm: "전압강하"},
		$("#rtfChartGubun").setData({
			data:option_data
		});


		$("#batryChartGubun").clear();
		var option_data =  [{batryChartId: "01",batryChartNm: "내부저항"}];
		$("#batryChartGubun").setData({
			data:option_data
		});
    }

    function setEventListener() {

    	$('#btnModLkup2').on('click', function(e) {
    		var sbeqpId = $("#sbeqpId").val();
    		var sbeqpNmReg = $("#sbeqpNmReg").val();
    		var sbeqpClCd = sbeqpId.substr(2,1);
			var param = {sbeqpId : sbeqpId, regYn : "Y", epwrFlag : "Y", sbeqpClCd : sbeqpClCd, sbeqpNm : sbeqpNmReg};
			$a.popup({
	          	popid: 'itmReg',
	          	title: "장비수정",
	            url: "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do",
	            data: param,
	            windowpopup : true,
	            modal: true,
	            movable:true,
	            width : 800,
	            height : window.innerHeight * 0.7,
	            callback : function(data) { // 팝업창을 닫을 때 실행
	           		var param = {eqpId : ParamEqpId};
	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpinfo', param, 'GET', 'sbeqpinfo');
	           		parent.top.comMain.eqpMod(param);
	           	}
			});
//
//
//    		var param =  $("#sbeqpMgmtArcnDtlLkupArea").getData();
//			param.regYn = "Y";
//			$a.navigate('/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpReg.do',param);
        });
    	//점검항목
   	 	$('[id^="btnInspItm"]').on('click', function(e) {
   	 		var val = $(this).val();
   	 		var tmpURL = "";
   	 		if (val == "R") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfInspItmReg.do";
   	 		} else if (val == "B") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryInspItmReg.do";
   	 		} else if (val == "A") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtArcnInspItmReg.do";
   	 		} else if (val == "F") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnInspItmReg.do";
   	 		} else if (val == "N") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtGntInspItmReg.do";
   	 		} else if (val == "L") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtCbplInspItmReg.do";
   	 		} else if (val == "M") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfMdulInspItmReg.do";
   	 		} else if (val == "P") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIpdInspItmReg.do";
   	 		} else if (val == "G") {
   	 			//tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnInspItmReg.do";
   	 		} else if (val == "S") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtExstrInspItmReg.do";
   	 		} else if (val == "C") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtContrInspItmReg.do";
   	 		} else if (val == "I") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtIvtrInspItmReg.do";
   	 		} else if (val == "T") {
   	 			tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtTvssInspItmReg.do";
   	 		} else if (val == "O") {
   	 			//tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnInspItmReg.do";
   	 		} else if (val == "E") {
   	 			//tmpURL = "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtFextnInspItmReg.do";
   	 		}


			var sbeqpId = $("#sbeqpId").val();
			var param = {sbeqpId : sbeqpId, regYn : "Y", epwrFlag : "Y"};
			$a.popup({
	          	popid: 'inspItmReg',
	          	title: "점검항목",
	            url: tmpURL,
	            data: param,
	            windowpopup : true,
	            modal: true,
	            movable:true,
	            width : 800,
	            height : window.innerHeight * 0.7
			});

        });

   	 	//방전시험
   	 	$('#btnDchgTest').on('click', function(e) {
	   	 	var sbeqpId = $("#sbeqpId").val();
			var param = {sbeqpId : sbeqpId, regYn : "Y", epwrFlag : "Y"};
			$a.popup({
	          	popid: 'inspItmReg',
	          	title: "방전시험",
	            url: "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtRtfDchgTestReg.do",
	            data: param,
	            windowpopup : true,
	            modal: true,
	            movable:true,
	            width : 800,
	            height : window.innerHeight * 0.7
			});
   	 	});

	   	 $('#btnIntnRstn').on('click', function(e) {
		   		var sbeqpId = $("#sbeqpId").val();
				var param = {sbeqpId : sbeqpId, regYn : "Y", epwrFlag : "Y"};
				$a.popup({
		          	popid: 'inspItmReg',
		          	title: "내부저항",
		            url: "/tango-transmission-web/configmgmt/sbeqpmgmt/SbeqpMgmtBatryIntnRstnRsltReg.do",
		            data: param,
		            windowpopup : true,
		            modal: true,
		            movable:true,
		            width : 800,
		            height : window.innerHeight * 0.7
				});
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

			var paramData = {eqpId : ParamEqpId, startDt : sDate, endDt : eDate, rtfChartGubun : rtfChartGubun};
			//console.log(paramData);
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqprtfchart', paramData, 'GET', 'rtfsearch');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/rtfeqptot', paramData, 'GET', 'rtfeqptot');
    	});


    	$('[name^="batry_"]').on('change', function(e) {
			var mtsoId = $('#mtsoId').val();
			var batryYear = $('#batryYear').val();
			var batryMonth = $('#batryMonth').val();
			var batryChartGubun = $('#batryChartGubun').val();

			sDate = batryYear+"-"+NumberPad(batryMonth, 2)+"-01";
			eDate = batryYear+"-"+NumberPad(parseInt(batryMonth) + 1, 2)+"-01";
			if (batryMonth.toString() == "12") {
				eDate = (parseInt(batryYear)+1).toString()+"-01-01";
			}

			var paramData = {eqpId : ParamEqpId, startDt : sDate, endDt : eDate, batryChartGubun : batryChartGubun};
			//
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/batryeqpchart', paramData, 'GET', 'batryChart');
    	});


    	 $('#btnMtso1').on('click', function(e) {
    		 var mtsoId = $('#eqpInstlMtsoId').val();
    		 var mtsoNm = $('#eqpInstlMtsoNm').val();
	 	 	var data = {mtsoEqpGubun : "0", mtsoEqpId : mtsoId, mtsoEqpNm : mtsoNm, mtsoGubun: "mtso", linkTab : "tab_Mtso"}; // mtsoEqpGubun : 0(국사), 1(장비)
			parent.top.comMain.popURL(data);
          });

    	 $('#btnMtso2').on('click', function(e) {
    		 var mtsoId = $('#sbeqpInstlMtsoIdReg').val();
    		 var mtsoNm = $('#sbeqpInstlMtsoNmReg').val();
	 	 	var data = {mtsoEqpGubun : "0", mtsoEqpId : mtsoId, mtsoEqpNm : mtsoNm, mtsoGubun: "mtso", linkTab :  "tab_Mtso"}; // mtsoEqpGubun : 0(국사), 1(장비)
			parent.top.comMain.popURL(data);
          });
	    	//목록
	   	 $('#btnPrevLkup').on('click', function(e) {
	   		$a.close();
         });

	   //토폴로지
//    	 $('#btnTopologyLkup').on('click', function(e) {
//	    	 dataParam = {"eqpId" : $('#eqpId').val()};
//	    	 $a.navigate($('#ctx').val()+'/configmgmt/tnbdgm/TnBdgm.do', dataParam);
//         });

	 	//포트관리
//	   	 $('#btnPortInfMgmt').on('click', function(e) {
//	   		var param =  $("#eqpDtlLkupForm").getData();
//	   		param.dumyPortYn = "N";
////    	 popupList('PortInfMgmtPop', $('#ctx').val()+'/configmgmt/portmgmt/PortInfMgmtPop.do', '포트 현황', param);
//	    	 $a.popup({
//		          	popid: 'PortInfMgmtPop',
//		          	/* 포트현황		 */
//		          	title: configMsgArray['portCurrentState'],
//		            url: $('#ctx').val()+'/configmgmt/portmgmt/PortInfMgmtPop.do',
//		            data: param,
//		            iframe: false,
//		            modal: true,
//		            movable:true,
//		            width : 1200,
//		            height : window.innerHeight * 0.7
//		   	});
//         });

	   //포트정보복사
//	   	$('#btnPortInfCopy').on('click', function(e) {
//	   		var param =  $("#eqpDtlLkupForm").getData();
//
//	   		$a.popup({
//	          	popid: 'PortInfCopyReg',
//	          	title: '포트정보복사',
//	              url: '/tango-transmission-web/configmgmt/portmgmt/PortInfCopyReg.do',
//	              data: param,
//	              windowpopup : true,
//	              modal: true,
//	              movable:true,
//	              width : 1265,
//	              height : 800
//	          });
//
//
//	     });


	    $('#btnChgHstLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
	   		$a.popup({
	          	popid: 'EqpChgHstLkup',
	          	title: '변경이력',
	              url: '/tango-transmission-web/configmgmt/equipment/EqpChgHstLkup.do',
	              data: param,
	              windowpopup : true,
	              modal: true,
	              movable:true,
	              width : 1265,
	              height : 800
	          });
        });


	   	//장비연동정보
	   	$('#btnEqpLnkgInfLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
//   		 popup('EqpLnkgInfReg', '/tango-transmission-web/configmgmt/equipment/EqpLnkgInfReg.do', '장비 연동 정보 등록', param);
	   		$a.popup({
	          	popid: 'EqpLnkgInf',
	          	title: 'DCN정보 조회/수정',
	              url: '/tango-transmission-web/configmgmt/equipment/EqpLnkgInfRegWinPop.do',
	              data: param,
	              windowpopup : true,
	              modal: true,
	              movable:true,
	              width : 865,
	              height : 800
	          });
        });


	    $('#btnEqpRnInfLkup').on('click', function(e) {
	   		var param =  $("#eqpDtlLkupForm").getData();
	   		$a.popup({
	          	popid: 'EqpRnInfLkup',
	          	title: 'RN장비정보',
	              url: '/tango-transmission-web/configmgmt/equipment/EqpRnInfLkup.do',
	              data: param,
	              windowpopup : true,
	              modal: true,
	              movable:true,
	              width : 1204,
	              height : 600
	          });
        });

//
//	   	//장비관리정보--사용안함
//	   	 $('#btnEqpMgmtInfLkup').on('click', function(e) {
//	   		var param =  $("#eqpDtlLkupForm").getData();
//   		 popup('EqpMgmtInfReg', $('#ctx').val()+'/configmgmt/equipment/EqpMgmtInfReg.do', '장비 관리 정보 등록', param);
//        });
//
//	   	 //장비구간현황
//	   	 $('#btnEqpSctnCurstLkup').on('click', function(e) {
//	   		var param =  $("#eqpDtlLkupForm").getData();
//   		 popupList('EqpSctnAcptCurst', $('#ctx').val()+'/configmgmt/equipment/EqpSctnAcptCurst.do',configMsgArray['equipmentSectionCurrentState'], param);
//        });
//
//		   	//네트워크현황
//	   	 $('#btnNtwkLineCurstLkup').on('click', function(e) {
//	   		var param =  $("#eqpDtlLkupForm").getData();
//   		 popupList('EqpNtwkLineAcptCurst', $('#ctx').val()+'/configmgmt/equipment/EqpNtwkLineAcptCurst.do', '네트워크현황', param);
//        });
//
//		   	//서비스회선현황
//	   	 $('#btnSrvcLineCurstLkup').on('click', function(e) {
//	   		var param =  $("#eqpDtlLkupForm").getData();
//   		 popupList('EqpSrvcLineAcptCurst', $('#ctx').val()+'/configmgmt/equipment/EqpSrvcLineAcptCurst.do', configMsgArray['serviceLineCurrentState'], param);
//        });
//
//	   	//변경이력
//
//
//	   //형상관리정보
//	   	 $('#btnShpInfMgmt').on('click', function(e) {
//	   		var param =  $("#eqpDtlLkupForm").getData();
////   		 popupList('ShpInfLkup', $('#ctx').val()+'/configmgmt/shpmgmt/ShpInfLkup.do', '형상 정보 조회', param);
//	   		$a.popup({
//	          	popid: 'ShpInfLkup',
//	          	title: configMsgArray['shapeMgmtInf'],
//	            url: $('#ctx').val()+'/configmgmt/shpmgmt/ShpInfLkup.do',
//	            data: param,
//	            iframe: false,
//	            modal: true,
//                movable:true,
//	            width : 1200,
//                height : window.innerHeight * 0.9
//	   		});
//        });

	   	 //FDF간편등록
	   	$('#btnEqpFdfReg').on('click', function(e) {
	      	var param =  $("#eqpDtlLkupForm").getData();
	      	param.regYn = "Y";
	      	param.portCnt = "";
	      	$a.popup({
		          	popid: 'EqpFdfReg',
		          	title: 'FDF간편등록',
		            url: '/tango-transmission-web/configmgmt/commonlkup/FdfRegPop.do',
		            iframe: false,
		            modal: true,
		            movable:true,
		            data:param,
		            windowpopup: true,
		            width : 550,
		           	height : 500,
		           	callback : function(data) { // 팝업창을 닫을 때 실행
		           		var param = {eqpId : ParamEqpId};
		           		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfo');
		           	}
		      });
         });

    	//삭제
    	 $('#btnDelLkup').on('click', function(e) {
  			callMsgBox('','C', configMsgArray['deleteConfirm'], function(msgId, msgRst){
  		       //삭제한다고 하였을 경우
  		        if (msgRst == 'Y') {
  		        	eqpDel();
  		        }
  		    });
         });

    	//장비수정
    	 $('#btnModLkup').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#eqpDtlLkupForm").getData();
    		param.regYn = "Y";

    		if (param.mgmtGrpNm == "SKT") {
    			param.intgFcltsCd = param.ukeyEqpMgmtNo;
    		}

//    		param.intgFcltsCd = param.ukeyEqpMgmtNo;
    		$a.popup({
	          	popid: 'inspItmReg',
	          	title: configMsgArray['equipmentUpdate'],
	            url: '/tango-transmission-web/configmgmt/equipment/EqpRegPop.do',
	            data: param,
	            windowpopup : true,
	            modal: true,
	            movable:true,
	            width : 865,
	            height : 780,
	           	callback : function(data) { // 팝업창을 닫을 때 실행
	           		var param = {eqpId : ParamEqpId};
	           		httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/eqpMgmt', param, 'GET', 'eqpinfo');
	           		parent.top.comMain.eqpMod(param);
	           	}
			});


         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
	};

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	Highcharts.setOptions({
    		lang:{thousandsSep: ','}
    	});

    	if(flag == 'batryChart'){
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

			if (response.batryeqpchart.length == 0) {
				var sbeqpId = "0";
				var sbeqpNm = "조회된 데이터가 없습니다";
				var tmpData = null;
				var chartData =[];
				for(k = 1; k < 31; k++) {
					if (k%2 == 0) {
						chartData.push(tmpData);
					}
				}
				var arrData = {name : "내부저항", data : chartData};
				JsonArray.push(arrData);

			} else {
				var tmpData = 0;
				var chartData =[];
				for(k = 1; k < 31; k++) {
					if (k%2 == 0) {
						tmpData = null;
						$.each(response.batryeqpchart, function(i, item) {
							var inDate = response.batryeqpchart[i].msmtDate.split("-");
							inDate = inDate[2];
							//console.log(inDate);
							if (NumberPad(k, 2).toString() == NumberPad(inDate,2)) {
								tmpData = Math.round(parseFloat(response.batryeqpchart[i].intnRstnAvg),2);
							}
						});
						chartData.push(tmpData);
					}
				}
				var arrData = {name : "내부저항", data : chartData};
				JsonArray.push(arrData);
			}


			Highcharts.chart('batryContainer', {
				chart : {type : 'line'},
				title:{text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } }
				  	  , labels:{ formate: '{value:,.0f}' }
				},
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
				var tmpData = null;
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
							tmpData = null;
							$.each(response.rtfchart, function(i, item) {
								var inDate = response.rtfchart[i].inspStdDate
								if (sbeqpId == response.rtfchart[i].sbeqpId && NumberPad(k, 2).toString() == inDate) {
									console.log(i, "] : ",response.rtfchart[i].rate);
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


			Highcharts.chart('rtfContainer', {
				chart : {type : 'line'},
				title:{text: ' ', style : { display : 'none' } },
				credits: { text: ' ', style : { display : 'none' } },
				subtitle:{ text: ' ', style : { display : 'none' } },
				xAxis:{ categories: chartXVal },
				yAxis:{ title:{ text:' ', style : { display : 'none' } }
					  , labels:{ formate: '{value:,.0f}' }
				},
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


    	if(flag == 'eqpinfo'){
    		$('#eqpfrm').find(':input').each(function(){
				switch(this.type) {
				case 'text' :
					$(this).val('');
				break;
				}
			});
    		$('#eqpfrm').setData(response.eqpMgmtList[0]);

    		if(response.eqpMgmtList[0].mgmtGrpNm != 'SKB'){

    			$('#ukeyEqpDtl1').html("장비시설코드") ;

//    			$("#ukeyEqpDtl1").hide();
//        		$("#ukeyEqpMgmtNo").hide();
    			$("#ukeyEqpMgmtNo").val(response.eqpMgmtList[0].intgFcltsCd);		//SKT일 경우에는 통시코드 넣도록
    			$("#btnModLkup").show();

			}else	{
				$('#ukeyEqpDtl1').html("SWING장비관리번호") ;
				httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpmdlmgmt/adamsMdl/' + response.eqpMgmtList[0].eqpMdlId, null, 'GET', 'adamsEqpMdlYn');	// ADAMS 연동 모델인지 확인
//        		$("#btnModLkup").hide();
			}

        	if(response.eqpMgmtList[0].eqpRoleDivCd == '11' || response.eqpMgmtList[0].eqpRoleDivCd == '177' || response.eqpMgmtList[0].eqpRoleDivCd == '178' || response.eqpMgmtList[0].eqpRoleDivCd == '182'){
        		$("#upsdDtl").show();
        		$("#btnEqpFdfReg").show();
        	}else{
        		$("#upsdDtl").hide();
        		$("#btnEqpFdfReg").hide();
        	}

        	if(response.eqpMgmtList[0].eqpRoleDivCd == '10') {

        		//M/W 일 경우
        		$('#eqpHanNmLabel').html("GIS Layer명") ;
        		$('#swVerValLabel').html("라이선스") ;
        		$('#eqpRmkLabel').html("철탑정보") ;

        	}

        	// SKB RN 타입일 경우
        	if(response.eqpMgmtList[0].mgmtGrpNm == 'SKB' && response.eqpMgmtList[0].eqpRoleDivCd == '175') {
        		$("#uprEqpId").show();
        		$("#verValId").hide();
        	}else {
        		$("#verValId").show();
        		$("#uprEqpId").hide();
        	}

        	// SKB 집선스위친인 경우
        	if(response.eqpMgmtList[0].mgmtGrpNm == 'SKB' && response.eqpMgmtList[0].eqpRoleDivCd == '114') {
        		$("#btnEqpRnInfLkup").show();
        	}else {
        		$("#btnEqpRnInfLkup").hide();
        	}



    	}
    	if(flag == 'sbeqpinfo'){
    		$('#sbEqpfrm').find(':input').each(function(){
				switch(this.type) {
				case 'text' :
					$(this).val('');
				break;
				}
			});
    		$('#sbEqpfrm').setData(response.eqpMgmtList[0]);
    		var paramData = {eqpId : response.eqpMgmtList[0].sbeqpId}
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/sbeqpdtl', paramData, 'GET', 'sbeqpdtl');


    		var mtsoId = $('#mtsoId').val();
			var rtfYear = $('#rtfYear').val();
			var rtfMonth = $('#rtfMonth').val();
			var rtfChartGubun = $('#rtfChartGubun').val();

			sDate = rtfYear+"-"+NumberPad(rtfMonth, 2)+"-01";
			eDate = rtfYear+"-"+NumberPad(parseInt(rtfMonth) + 1, 2)+"-01";
			if (rtfMonth.toString() == "12") {
				eDate = (parseInt(rtfYear)+1).toString()+"-01-01";
			}
			//console.log(response.eqpMgmtList[0]);
			var paramData = {eqpId : response.eqpMgmtList[0].sbeqpId, startDt : sDate, endDt : eDate, rtfChartGubun : rtfChartGubun};

			var tmpGubun = response.eqpMgmtList[0].sbeqpId.substr(2,1);
			if (tmpGubun == "R") {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/eqprtfchart', paramData, 'GET', 'rtfsearch');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/rtfeqptot', paramData, 'GET', 'rtfeqptot');
			} else if (tmpGubun == "B") {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/batryeqpchart', paramData, 'GET', 'batryChart');
			}
    	}
    	if(flag == 'sbeqpdtl'){
    		$('#sbEqpfrm').setData(response.ItemsList[0]);
    	}
    	if(flag == 'rtfeqptot'){
    		$('#sbEqpfrm').setData(response.rtftot[0]);
    		switch(response.rtftot[0].engStdDivVal){
			case '1':
				$('#engStdDivNoReg').val('중심국(3H)')
				break;
			case '2':
				$('#engStdDivNoReg').val('중심국(4H)')
				break;
			case '3':
				$('#engStdDivNoReg').val('DU집중국(3H)')
				break;
			case '4':
				$('#engStdDivNoReg').val('DU집중국(4H)')
				break;
			case '5':
				$('#engStdDivNoReg').val('3G집중국')
				break;
			case '6':
				$('#engStdDivNoReg').val('기지국')
				break;
			case '7':
				$('#engStdDivNoReg').val('교환사옥')
				break;
			default:
				break;
			}

    		$('#ipdCapaStatYn').val('불량')
    		if (response.rtftot[0].ipdCapaStatYn == "Y") {$('#ipdCapaStatYn').val('양호')};
    	}

    	if(flag == 'adamsEqpMdlYn'){
    		if (response.length > 0 ) {			// ADAMS 수집 모델인 경우에는 수정버튼 비활성
    			$("#btnModLkup").hide();
    		}
    	}



      /* 선택한 장비에 해당하는 수동등록여부 처리_E_[20171019] */


    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'eqpDel'){
    		//삭제를 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['delFail'] , function(msgId, msgRst){});
    	}
    }

    function eqpDel() {
   	 	var eqpId =  $("#eqpId").val();

   	 	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/deleteEqpInf/'+eqpId, null, 'GET', 'eqpDel');

   }
    function NumberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  //iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.9

              });
        }

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7

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
});