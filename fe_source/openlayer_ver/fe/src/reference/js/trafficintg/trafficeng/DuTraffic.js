/**
 * DuTraffic.js
 *
 * @author 이현우
 * @date 2016. 7. 27. 오후 04:25:00
 * @version 1.0
 */
$a.page(function() {
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 2);
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();

	clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;

	var selectInit = [];
	var gridId = 'dataGrid';

	// (2017-03-08 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };

    function initGrid() {
        //그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'clctDt', align:'center',
				title : '일자',
				width: '100px'
			}, {
    			key : 'srfcCd', align:'center',
				title : '공용대표시설코드',
				width: '120px'
			}, {
    			key : 'intgFcltsCd', align:'center',
				title : '통합시설코드',
				width: '130px'
			}, {
    			key : 'mtsoNm', align:'left',
				title : 'DU명',
				width: '200px'
			}, {
    			key : 'enbId', align:'center',
				title : 'ENB ID',
				width: '90px'
			},  {
    			key : 'orgNm', align:'left',
				title : '본부',
				width: '130px'
			}, {
    			key : 'teamNm', align:'left',
				title : '팀',
				width: '120px'
			}, {
    			key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '120px'
			}, {
    			key : 'vendEnghNm', align:'center',
				title : '제조사',
				width: '100px'
			}, {
    			key : 'freqVal', align:'center',
				title : '주파수',
				width: '90px'
			}, {
    			key : 'div', align:'center',
				title : '방식',
				width: '90px'
			}, {
    			key : 'adstNm', align:'center',
				title : '권역구분',
				width: '90px'
			}, {
    			key : 'std1', align:'center',
				title : '기준1',
				width: '90px'
			},  {
    			key : 'vlan', align:'center',
				title : 'VLAN',
				width: '90px'
			}, {
    			key : 'eNode', align:'left',
				title : 'S/W',
				width: '150px'
			}, {
    			key : 'cellCnt', align:'right',
				title : 'CELL갯수',
				width: '90px'
			}, {
    			key : 'ruCnt', align:'right',
				title : 'RU갯수',
				width: '90px'
			},  {
    			key : 'attcCnt', align:'right',
				title : '시도호수',
				width: '90px'
			}, {
    			key : 'ccurCnntrCnt', align:'right',
				title : '동접자',
				width: '90px'
			}, {
    			key : 'dlData', align:'right',
				title : 'DL데이타시총합(MB)',
				width: '180px'
			}, {
    			key : 'ulData', align:'right',
				title : 'UL데이타시총합(MB)',
				width: '180px'
			}, {
    			key : 'dlTraffic', align:'right',
				title : 'DL트래픽(Mb)',
				width: '150px'
			}, {
    			key : 'ulTraffic', align:'right',
				title : 'UL트래픽(Mb)',
				width: '150px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	   	$('#clctDt').val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
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
 	                      ,{el: '#adstNm', url: 'adsts', key: 'comCd', label: 'comCdNm'}
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
    	$('#'+gridId).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  $("#searchForm").getData();
    	var date = $('#clctDt').val().replace(/-/gi,'');

    	param.orgId = selectInit[0].getValue();
    	param.teamId = selectInit[1].getValue();
    	param.trmsMtsoId = selectInit[2].getValue();
    	param.clctDt = $('#clctDt').val().replace(/-/gi,'');
    	///param.adstNm = $('#adstNm option:selected').text();
//    	param.adstNm = selectInit[3].getValue();

       param.adstNm = selectInit[3].getValue();

    	if(param.adstNm != 'all') {
    		param.adstNm = selectInit[3].getText();
    	}

    	param.svlnNm = $('#duNm').val();
    	param.mtsoNm = $('#mtsoNm').val();

    	httpRequest('tango-transmission-biz/trafficintg/trafficeng/duTraffic', param, successCallbackSearch, failCallback, 'GET');
    }

    function setEventListener() {
    	// Test Code
    	$('#btn').on('click',function(e){
    		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
    		var parameter = $("#searchForm").getData();

    		parameter.search1 = $('#clctDt').val().replace(/-/gi,'');
    		parameter.search2 = '' + $.map(data, function(d, idx){return d.intgFcltsCd});

    		if(parameter.search1 == '' && parameter.search2 == '')
    		    return

    		httpRequest('tango-transmission-biz/trafficintg/trafficchart/duTrafficChart', parameter, successCallbackPopup, failCallback, 'GET');
    	});
    	var eobjk=100; // Grid 초기 개수
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
        });

        $('#mtsoNm').keydown(function(e){
        	if(e.keyCode == 13){
        		setGrid(1,eobjk);
        	}
        })

        //페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(eObj.page, eObj.pageinfo.perPage);
        });

        //페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            eobjk = eObj.perPage;
            setGrid(1, eobjk);
        });

        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;

    	   	var date = $('#clctDt').val().replace(/-/gi,'');

        	param.orgId = selectInit[0].getValue();
        	param.teamId = selectInit[1].getValue();
        	param.trmsMtsoId = selectInit[2].getValue();
        	param.clctDt = $('#clctDt').val().replace(/-/gi,'');
        	param.adstNm = selectInit[3].getValue();

        	if(param.adstNm != 'all') {
        		param.adstNm = selectInit[3].getText();
        	}

        	param.svlnNm = $('#duNm').val();
        	param.mtsoNm = $('#mtsoNm').val();

    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "duTraffic";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기

    		param.fileExtension = "xlsx";
    		// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "DuTraffic" + "_" + dayTime + "." + param.fileExtension;
    		param.excelFlag = "DuTraffic";     // (2017-03-02 : HS Kim) 추가, 필수 값

    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;	// (2017-03-02 : HS Kim) 추가
    		// (2017-03-08 : HS Kim) End

    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "DU대표트래픽";
 	    	//httpRequest('tango-transmission-biz/trafficintg/trafficeng/excelcreateDuTraffic', param, successCallbackExcel, failCallback, 'GET');
    		// (2017-03-08 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
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
        })
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
		setSPGrid(gridId,response, response.duTraffic);
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
		//alert("(HS Kim) jobInstanceId : " + jobInstanceId);
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

    // Test Code
    function popup(pidData, urlData, titleData, paramData) {
    	$a.popup({
    		popid: pidData,
    		title: titleData,
    		url: urlData,
    		data: paramData,
    		windowpopup: true,
    		modal: true,
    		movable:true,
    		width : 960,
    		height : 629
    	});
    }

    // Test Code
	var successCallbackPopup = function(response){
		xCat = [];
		for(var i = 0; i < response.chartPage.length; i++){
			var t = response.chartPage[i].data1;
			xCat.push(t.substring(0,4) + '-' + t.substring(4,6) + '-' + t.substring(6,8));
		}

		yCat = [];
		yDataNm = ['DL데이타시총합(MB)','UL데이타시총합(MB)','DL트래픽(Mb)','UL트래픽(Mb)'];
		for(var i = 0; i < yDataNm.length; i++){
			var yData = [];

			for(var j = 0; j < response.chartPage.length; j++){
				switch (i) {
				    case 0 : yData.push(parseFloat(response.chartPage[j].data7));
				             break;
				    case 1 : yData.push(parseFloat(response.chartPage[j].data8));
				             break;
				    case 2 : yData.push(parseFloat(response.chartPage[j].data9));
				             break;
				    case 3 : yData.push(parseFloat(response.chartPage[j].data10))
				}
			}

			yCat.push({name : yDataNm[i],
				       data : yData});
		}

		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});

		var paraData = {chartType:'spline',
				        xCategori:xCat,
	                    yCategori:yCat,
	                    title:'DuTraffic',
	                    subTitle:'',
	                    valueSuffic:'(Mb)',
	                    yTitle:'Byte',
	                    search1: $('#clctDt').val().replace(/-/gi,''),
	                    search2: '' + $.map(data, function(d, idx){return d.intgFcltsCd}),
	            		search4: '' + $.map(data, function(d, idx){return d.portId}),
	            		orgNm: '' + $.map(data, function(d, idx){return d.orgNm}),
	            		teamNm: '' + $.map(data, function(d, idx){return d.teamNm}),
	            		trmsMtsoNm: '' + $.map(data, function(d, idx){return d.trmsMtsoNm}),
	                    url:'tango-transmission-biz/trafficintg/trafficchart/duTrafficChart'
	                    };

        popup('chart_page', 'chart_page.do', 'Chart', paraData);
	}
});