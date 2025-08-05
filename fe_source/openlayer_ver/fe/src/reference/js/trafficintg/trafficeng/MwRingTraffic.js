/**
 * G5BackhaulTraffic.js
 *
 * @author 이현우
 * @date 2016. 8. 08. 오전 09:44:00
 * @version 1.0
 */
$a.page(function() {

	var selectInit = [];
	var gridId = 'dataGrid';

	//	(2017-03-07 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

    this.init = function(id, param) {

    	initGrid();
        setSelectCode();
    	setEventListener();

    	var currentDate = new Date();
   		currentDate.setDate(currentDate.getDate()-1);
   		var clctDtDay = currentDate.getDate();
   		var clctDtMon = currentDate.getMonth() + 1;
   		var clctDtYear = currentDate.getFullYear();

   		clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
   		clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

   		$('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);

    };

    function initGrid() {
    	//그리드 생성
    	$('#'+gridId).alopexGrid({
    		paging : {
				hidePageList: true,  // pager 중앙 삭제
				pagerSelect: false  // 한 화면에 조회되는 Row SelectBox 삭제
			},
			renderMapping : [{"ntwkLineLkupIcon" :{
									renderer : function(value, data, render, mapping) {
										var currentData = AlopexGrid.currentData(data);
										return "<span class='Icon Search' style='cursor: pointer'></span>";
									}
								}}],
	    	columnMapping: [
	    		{key : 'hdofcNm', align:'center', title : '본부', width: '80px'},
	    		{key : 'teamNm', align:'center', title : '팀', width: '100px'},
	    		{key : 'ntwkLineNm', align:'left', title : '링명', width: '180px'},
	    		{key : 'ntwkLineNo', align:'left', title : '링ID', width: '120px'},
	    		{key : "ntwkLineLkupIcon",	 align : "center",	 title : "E2E보기",	 width: "60px", editable: false,	 resizing: false,
	    			render  : function(value, data, render, mapping){
						if( "" != data.ntwkLineNo){
							return "<span class='Icon Search' style='cursor: pointer'></span>";
						}
                	}
	    		},
	    		{key : 'topoSclNm', align:'center', title : '망종류', width: '120px' },
	    		{key : 'ntwkCapaNm', align:'center', title : '용량', width: '80px'}
	    		],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    }

    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
 	                      ];

        for(var i=0; i<selectList.length; i++){
            selectInit[i] = Tango.select.init({
                                                 el: selectList[i].el
                                                 ,model: Tango.ajax.init({
                                                     url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
                                                     data: param
                                                     })
                                                ,valueField: selectList[i].key
                                                ,labelField: selectList[i].label
                                                ,selected: 'all'
                                                })

            selectInit[i].model.get();
        }


    }


    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var date = $('#clctDt').val().replace(/-/gi,'');


    	param.hdofcCd = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.trmsId = selectInit[2].getValue();


    	param.ntwkLineNm = $('#ntwkLineNm').val();
    	param.ntwkLineNo = $('#ntwkLineNo').val();

    	param.clctDtYear = date.substring(0,4);
        param.clctDtMon = date.substring(4,6);
        param.clctDtDay =  date.substring(6,8);


        $('#'+gridId).alopexGrid('showProgress');

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/mwRingTraffic', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
        });
        //페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(eObj.page, eObj.pageinfo.perPage);
        });



        $('#ringNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

         $('#'+gridId).on('click', '.bodycell', function(e){
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridId).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			var row = dataObj._index.row;

			if(rowData._key == "ntwkLineLkupIcon" ){
				searchId = dataObj.ntwkLineNo;
	    		searchNm = dataObj.ntwkLineNm;
				window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=RING&searchId=' + searchId + '&searchNm=' + searchNm);
			}
        });


        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
	        	var gridData = $('#'+gridId).alopexGrid('dataGet');
	    		if (gridData.length == 0) {
	    			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
	    				return;
	    		}

	    		var param = $("#searchForm").getData();

	    		var now = new Date();
	    		var excelFileName = "MW링 대표 Traffic" + (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
	    		var worker = new ExcelWorker({
	        		excelFileName : excelFileName,
	        		palette : [{
	        			className : 'B_YELLOW',
	        			backgroundColor: '255,255,0'
	        		},{
	        			className : 'F_RED',
	        			color: '#FF0000'
	        		}],
	        		sheetList: [{
	        			sheetName: 'MW링 대표 Traffic',
	        			$grid: $('#dataGrid')
	        		}]
	        	});
	        	worker.export({
	        		merge: false,
	        		exportHidden: false,
	        		useGridColumnWidth : true,
	        		border  : true,
	        		exportNumberingColumn : true,
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
							}
						}
					}
	        	});

         });


        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	var m = date.month < 10 ? '0' + date.month : date.month;
            	var d = date.day < 10 ? '0' + date.day : date.day;

                $("#txtCal").val(date.year + '-' + m + '-' + d);
            });
        });

        //본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
            changeHdofc();
            changeTeam();
        });

        //팀을 선택했을 경우
        $('#teamNm').on('change', function(e){
            changeTeam();
        });

	};

	//hdofc change
	function changeHdofc(){
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var orgID = selectInit[0].getValue(); //$('#hdofcNm').val();
    	orgID = orgID == 'all' ? 'teams/' + chrrOrgGrpCd : 'team/' + orgID;

    	var param = {};
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[1] = Tango.select.init({
    		el: '#teamNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID,
    			data: param
    		}),
    		valueField: 'orgId',
    		labelField: 'orgNm',
    		selected: 'all'
    	})

    	selectInit[1].model.get();
	}

	//team change
	function changeTeam(){
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
    	param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
    	param.eqpOrgDiv = "Y";  // 장비 기준으로 조회시에

    	selectInit[2] = Tango.select.init({
    		el: '#trmsMtsoNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/trmsmtso',
    			data: param
    		}),
    		valueField: 'mtsoId',
    		labelField: 'mtsoNm',
    		selected: 'all'
    	})

    	selectInit[2].model.get({data:param});
	}

	//request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }



    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');

		initGrid();
		$('#'+gridId).alopexGrid('dataEmpty');
		var col = $('#'+gridId).alopexGrid('readOption').columnMapping;

		var maxLine = 0;

		if (response.mwRingTraffic.mwRingTrafficList !== undefined && response.mwRingTraffic.mwRingTrafficList.length > 0) {
			maxLine = response.mwRingTraffic.mwRingTrafficList[0].maxCnt
		}

		var title_list = ["국사#","SW 장비#","S/W 포트#","S/W INBPS(Mb)#","S/W OUTBPS(Mb)#","S/W INBPS 사용률(%)#","S/W OUTBPS 사용률(%)#","M/W 장비#"]
		var key_list = ["mtsoNm","eqpNm","portNm","inBpsVal","outBpsVal","inBpsRate","outBpsRate","mwEqpNm"]
		var align_list = ["left","left","left","right","right","right","right","left"]
		var width_list = ["180px","260px","220px","140px","140px","140px","140px","240px"]


		for(var i=0; i< maxLine; i++) {

			for(var j=0; j< title_list.length; j++) {
				var add = {key: key_list[j]+(i+1) , title : title_list[j]+(i+1), align :  align_list[j], width:  width_list[j]};
				col = $('#'+gridId).alopexGrid('readOption').columnMapping
				$('#'+gridId).alopexGrid('updateOption' ,{columnMapping: col.concat(add)})
			}
		}

		setSPGrid(gridId,response, response.mwRingTraffic.mwRingTrafficList);

	}

	var successCallbackExcel = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate');
		console.log(response);

		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/trafficintg/trafficintgcode/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
		$form.appendTo('body');
		$form.submit().remove();
	}
	// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가
	var successCallbackOnDemandExcel = function(response){

		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate - OnDemand');
		console.log(response);

		var jobInstanceId = response.resultData.jobInstanceId;
		//alert("(HS Kim) fileOnDemandName / jobInstanceId : " + fileOnDemandName + " / " + jobInstanceId);
		// 엑셀다운로드팝업
        $a.popup({
               popid: 'TrafficExcelDownloadPop' + jobInstanceId,
               title: '엑셀다운로드',
               iframe: true,
               modal : false,
               windowpopup : true,
               url: '/tango-transmission-web/trafficintg/TrafficExcelDownloadPop.do',
               data: {
                   jobInstanceId : jobInstanceId,
                   fileName : fileOnDemandName,
                   fileExtension : fileOnDemandExtension
               },
               width : 500,
               height : 300
               ,callback: function(resultCode) {
                   if (resultCode == "OK") {
                       //$('#btnSearch').click();
                   }
               }
           });

	}


	var successCallbackCdList = function(response){
		var option_data =  [];

		for(var i=0; i<response.length; i++){
			var resObj = response[i];
			option_data.push(resObj);
		}

		$('#woRingCdList').setData({
             data:option_data,
		});
﻿
		$('#woRingCdList').multiselect("checkAll");
	}


    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional

    }

    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //Excel
    function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}

    function popupList(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7
              });
        }

    function lpad(value, length) {
		var strValue = '';
		if (value) {
			if (typeof value === 'number') {
				strValue = String(value);
			}
		}

		var result = '';
		for (var i = strValue.length; i < length; i++) {
			result += strValue;
		}

		return result + strValue;
	}
});