/**
 * BmtsoLineCurst.js
 *
 * @author 이현우
 * @date 2016. 7. 13. 오전 09:58:00
 * @version 1.0
 */
$a.page(function() {
    var gridId = 'dataGrid';
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    var clctDtDay = currentDate.getDate();
    var clctDtMon = currentDate.getMonth() + 1;
    var clctDtYear = currentDate.getFullYear();
	
    var gridModel_param = Tango.ajax.init({
		url: 'tango-transmission-biz/trafficintg/statistics/bmtsoLineCurst',
		data: {
			pageNo: 1,
			rowPerPage: 100,
			clctDtYear: '2016',
			clctDtMon: '07',
			clctDtDay: '04'
		}
	});
    
    clctDtDay = clctDtDay < 10 ? '0' + clctDtDay : clctDtDay;
    clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;
	
    var selectInit = [];
    var selectList = [];
    var selectedId_orgId = "";
    
    this.init = function(id, param) {
        initGrid();
        setSelectCode();
        setEventListener();
    };

    function initGrid() {
        $('#'+gridId).alopexGrid({
            headerGroup: [
                           {fromIndex:7, toIndex:15, title:"2G", id:'u0'}
                          ,{fromIndex:16, toIndex:24, title:"1X", id:'u1'}
                          ,{fromIndex:25, toIndex:33, title:"1X_MZONE", id:'u2'}
                          ,{fromIndex:34, toIndex:42, title:"EVDO", id:'u3'}
                          ,{fromIndex:43, toIndex:51, title:"EVDO_MZONE", id:'u4'}
                          ,{fromIndex:52, toIndex:60, title:"WCDMA", id:'u5'}
                          ,{fromIndex:61, toIndex:69, title:"WIBRO", id:'u6'}
                          ],
            paging : {
            		pagerSelect: [100,300,500,1000]
                   ,hidePageList: false  // pager 중앙 삭제
            },
            columnMapping: [{
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
				width: '130px'
			}, {
				key : 'repIntgFcltsCd', align:'center',
				title : '공용대표시설코드',
				width: '150px'
			}, {
				key : 'repNm', align:'left',
				title : '공용대표시설코드명',
				width: '160px'
			}, {
				key : 'dplxgYn', align:'center',
				title : '이원화',
				width: '60px'
			}, {
				key : 'lineTotSumrCnt', align:'right',
				title : '합계',
				width: '90px'
			}, {
				key : 'cdmaSktCnt', align:'right',
				title : 'SKT',
				width: '90px'
			}, {
				key : 'cdmaSkt2Cnt', align:'right',
				title : 'SKT2',
				width: '90px'
			}, {
				key : 'cdmaSkbCnt', align:'right',
				title : 'SKB',
				width: '90px'
			}, {
				key : 'cdmaLguCnt', align:'right',
				title : 'LGU',
				width: '90px'
			}, {
				key : 'cdmaDrmlnCnt', align:'right',
				title : 'DL',
				width: '90px'
			}, {
				key : 'cdmaSjCnt', align:'right',
				title : 'SJ',
				width: '90px'
			}, {
				key : 'cdmaKtCnt', align:'right',
				title : 'KT',
				width: '90px'
			}, {
				key : 'cdmaEtcCnt', align:'right',
				title : '기타',
				width: '90px'
			}, {
				key : 'cdmaTotSumrCnt', align:'right',
				title : '소계',
				width: '90px'
			}, {
				key : 'cdma1xSktCnt', align:'right',
				title : 'SKT',
				width: '90px'
			}, {
				key : 'cdma1xSkt2Cnt', align:'right',
				title : 'SKT2',
				width: '90px'
			}, {
				key : 'cdma1xSkbCnt', align:'right',
				title : 'SKB',
				width: '90px'
			}, {
				key : 'cdma1xLguCnt', align:'right',
				title : 'LGU',
				width: '90px'
			}, {
				key : 'cdma1xDrmlnCnt', align:'right',
				title : 'DL',
				width: '90px'
			}, {
				key : 'cdma1xSjCnt', align:'right',
				title : 'SJ',
				width: '90px'
			}, {
				key : 'cdma1xKtCnt', align:'right',
				title : 'KT',
				width: '90px'
			}, {
				key : 'cdma1xEtcCnt', align:'right',
				title : '기타',
				width: '90px'
			}, {
				key : 'cdma1xTotSumrCnt', align:'right',
				title : '소계',
				width: '90px'
			}, {
				key : 'mzon1xSktCnt', align:'right',
				title : 'SKT',
				width: '90px'
			}, {
				key : 'mzon1xSkt2Cnt', align:'right',
				title : 'SKT2',
				width: '90px'
			}, {
				key : 'mzon1xSkbCnt', align:'right',
				title : 'SKB',
				width: '90px'
			}, {
				key : 'mzon1xLguCnt', align:'right',
				title : 'LGU',
				width: '90px'
			}, {
				key : 'mzon1xDrmlnCnt', align:'right',
				title : 'DL',
				width: '90px'
			}, {
				key : 'mzon1xSjCnt', align:'right',
				title : 'SJ',
				width: '90px'
			}, {
				key : 'mzon1xKtCnt', align:'right',
				title : 'KT',
				width: '90px'
			}, {
				key : 'mzon1xEtcCnt', align:'right',
				title : '기타',
				width: '90px'
			}, {
				key : 'mzon1xTotSumrCnt', align:'right',
				title : '소계',
				width: '90px'
			}, {
				key : 'evdoSktCnt', align:'right',
				title : 'SKT',
				width: '90px'
			}, {
				key : 'evdoSkt2Cnt', align:'right',
				title : 'SKT2',
				width: '90px'
			}, {
				key : 'evdoSkbCnt', align:'right',
				title : 'SKB',
				width: '90px'
			}, {
				key : 'evdoLguCnt', align:'right',
				title : 'LGU',
				width: '90px'
			}, {
				key : 'evdoDrmlnCnt', align:'right',
				title : 'DL',
				width: '90px'
			}, {
				key : 'evdoSjCnt', align:'right',
				title : 'SJ',
				width: '90px'
			}, {
				key : 'evdoKtCnt', align:'right',
				title : 'KT',
				width: '90px'
			}, {
				key : 'evdoEtcCnt', align:'right',
				title : '기타',
				width: '90px'
			}, {
				key : 'evdoTotSumrCnt', align:'right',
				title : '소계',
				width: '90px'
			}, {
				key : 'evdoMzonSktCnt', align:'right',
				title : 'SKT',
				width: '90px'
			}, {
				key : 'evdoMzonSkt2Cnt', align:'right',
				title : 'SKT2',
				width: '90px'
			}, {
				key : 'evdoMzonSkbCnt', align:'right',
				title : 'SKB',
				width: '90px'
			}, {
				key : 'evdoMzonLguCnt', align:'right',
				title : 'LGU',
				width: '90px'
			}, {
				key : 'evdoMzonDrmlnCnt', align:'right',
				title : 'DL',
				width: '90px'
			}, {
				key : 'evdoMzonSjCnt', align:'right',
				title : 'SJ',
				width: '90px'
			}, {
				key : 'evdoMzonKtCnt', align:'right',
				title : 'KT',
				width: '90px'
			}, {
				key : 'evdoMzonEtcCnt', align:'right',
				title : '기타',
				width: '90px'
			}, {
				key : 'evdoMzonTotSumrCnt', align:'right',
				title : '소계',
				width: '90px'
			}, {
				key : 'wcdmaSktCnt', align:'right',
				title : 'SKT',
				width: '90px'
			}, {
				key : 'wcdmaSkt2Cnt', align:'right',
				title : 'SKT2',
				width: '90px'
			}, {
				key : 'wcdmaSkbCnt', align:'right',
				title : 'SKB',
				width: '90px'
			}, {
				key : 'wcdmaLguCnt', align:'right',
				title : 'LGU',
				width: '90px'
			}, {
				key : 'wcdmaDrmlnCnt', align:'right',
				title : 'DL',
				width: '90px'
			}, {
				key : 'wcdmaSjCnt', align:'right',
				title : 'SJ',
				width: '90px'
			}, {
				key : 'wcdmaKtCnt', align:'right',
				title : 'KT',
				width: '90px'
			}, {
				key : 'wcdmaEtcCnt', align:'right',
				title : '기타',
				width: '90px'
			}, {
				key : 'wcdmaTotSumrCnt', align:'right',
				title : '소계',
				width: '90px'
			}, {
				key : 'wbrSktCnt', align:'right',
				title : 'SKT',
				width: '90px'
			}, {
				key : 'wbrSkt2Cnt', align:'right',
				title : 'SKT2',
				width: '90px'
			}, {
				key : 'wbrSkbCnt', align:'right',
				title : 'SKB',
				width: '90px'
			}, {
				key : 'wbrLguCnt', align:'right',
				title : 'LGU',
				width: '90px'
			}, {
				key : 'wbrDrmlnCnt', align:'right',
				title : 'DL',
				width: '90px'
			}, {
				key : 'wbrSjCnt', align:'right',
				title : 'SJ',
				width: '90px'
			}, {
				key : 'wbrKtCnt', align:'right',
				title : 'KT',
				width: '90px'
			}, {
				key : 'wbrEtcCnt', align:'right',
				title : '기타',
				width: '90px'
			}, {
				key : 'wbrTotSumrCnt', align:'right',
				title : '소계',
				width: '90px'
			}],
			ajax: { model: gridModel_param },
    	})
    	
	    //기준일자 입력
	    $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	
        selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}             //본부
  	                      ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}             //팀
  	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}   //전송실
  	                      ];
        
        for(var i=0; i<selectList.length; i++){
        	if (selectList[i].el == '#hdofcNm') {//(2017-04-26 : HS Kim) 본부 초기 설정
        		httpRequest('tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + 'orgs/'+chrrOrgGrpCd, param, successCallbackOrgs, failCallback, 'GET');
        	}else if (selectList[i].el == '#teamNm'){
        		// 팀 설정은 본부 초기설정 직후에 연결 처리
        	}else {
	            selectInit[i] = Tango.select.init({
	                                                 el: selectList[i].el
	                                                 ,model: Tango.ajax.init({
	                                                     url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
	                                                     data: param
	                                                     })
	                                                ,valueField: selectList[i].key
	                                                ,labelField: selectList[i].label
	                                                ,selected: 'all'
	                                                });
	            selectInit[i].model.get();
        	}
        }
    }
    
    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	var date = $('#clctDt').val().replace(/-/gi,'');
    	/*
    	var queryParam = {
        		q: JSON.stringify({
        			pageNo: page,
        			rowPerPage: rowPerPage,
        			clctDtYear: date.substring(0,4),
        			clctDtMon: date.substring(4,6),
        			clctDtDay: date.substring(6,8),
        			orgId: selectInit[0].getValue(),
        			teamId: selectInit[1].getValue(),
        			trmsMtsoId: selectInit[2].getValue(),
        			checkExclusion: $('#checkExclusion').is(':checked') ? 'Y' : ''
        		})
        }
    	*/
    	
    	var param = {};
    	param.pageNo = page;
    	param.rowPerPage = rowPerPage;
    	param.clctDtYear =  date.substring(0,4);
		param.clctDtMon = date.substring(4,6);
		param.clctDtDay = date.substring(6,8);
		param.orgId = selectInit[0].getValue();
		param.teamId = selectInit[1].getValue();
		param.trmsMtsoId = selectInit[2].getValue();
		param.checkExclusion = $('#checkExclusion').is(':checked') ? 'Y' : '';
    	
    	var queryParam = {
    			q: JSON.stringify({
    				pageNo:1,
    				rowPerPage:10,
    				clctDtYear: "2016",
    				clctDtMon: "07",
    				clctDtDay: "04",
    				pageSize: 10
    			})
    		};
    	
    	//gridModel_param.get({ data: queryParam });
    	//gridModel_param.get();
    	//gridModel.get();
        httpRequest('tango-transmission-biz/trafficintg/statistics/bmtsoLineCurst', param, successCallbackSearch, failCallback, 'GET');
    	//$('#'+gridId).alopexGrid('hideProgress');
    }

    function popup(pidData, urlData, titleData, paramData) {
    	$a.popup({
    		popid: pidData,
    		title: titleData,
    		url: urlData,
    		data: paramData,
    		modal: true,
    		movable:true,
    		width : 877,
    		height : 629
    	});
    }
    
    function setEventListener() {
    	$('#btn').on('click',function(e){
    		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
    		alert($.map(data, function(d, idx){ return d.repIntgFcltsCd }));
    		popup('chart_page', 'chart_page.do', 'Chart');
    	});
    	var eobjk=100; // Grid 초기 개수
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
        
        // 검색
        $('#btnSearch').on('click', function(e) {
        	if( $('#hdofcNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 본부를 선택하세요
        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 본부 "), function(msgId, msgRst){});
        		return;
        	};
        	
        	setGrid(1, eobjk);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
        	if( $('#hdofcNm').val() == 'all' ){	// (2017-04-26 : HS Kim) 본부를 선택하세요
        		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 본부 "), function(msgId, msgRst){});
        		return;
        	};
        	
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		 
    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;
        	
    		var date = $('#clctDt').val().replace(/-/gi,'');
        	param.clctDtYear =  date.substring(0,4);
    		param.clctDtMon = date.substring(4,6);
    		param.clctDtDay = date.substring(6,8);
    		param.orgId = selectInit[0].getValue();
    		param.teamId = selectInit[1].getValue();
    		param.trmsMtsoId = selectInit[2].getValue();
    		param.checkExclusion = $('#checkExclusion').is(':checked') ? 'Y' : '';
        	
        	var queryParam = {
        			q: JSON.stringify({
        				pageNo:1,
        				rowPerPage:100,
        				clctDtYear: "2016",
        				clctDtMon: "07",
        				clctDtDay: "04",
        				pageSize: 10
        			})
        		};
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;   
    		 
    		param.fileName = "기지국회선현황";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "bmtsoLineCurst";
    		 
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateBmtsoLineCurst', param, successCallbackExcel, failCallback, 'GET');
         });
        
        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
                clctDtYear = date.year;
            	
                clctDtMon = date.month < 10 ? '0' + date.month : date.month;
                clctDtDay = date.day < 10 ? '0' + date.day : date.day;
            	
                $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
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
    	
    	selectInit[1] = Tango.select.init({
    		el: '#teamNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID
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
	
    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.bmtsoLineCurst);
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
	
	var failCallback = function(response){
		//조회 실패 하였습니다.
		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
	}
    
    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method, Flag ) {
		Tango.ajax({
	    	  url : Url,
		      data : Param,
		      method : Method,
		      flag : Flag
		}).done(SuccessCallback)
		  .fail(FailCallback)
    }
    
    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt,
	      		current 	: Option.pager.pageNo,
	      		perPage 	: Option.pager.rowPerPage
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}
    
    //Excel
    function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		param.headerGrpCnt = 1;
		var headerGrpCd = "";
		var headerGrpNm = "";
		var headerGrpPos = "";
		
		for (var i=0; i<gridColmnInfo.length; i++) {
			if((gridColmnInfo[i].id != undefined && gridColmnInfo[i].id != "id")) {
				headerGrpCd += gridColmnInfo[i].id + ";";
				headerGrpNm += gridColmnInfo[i].title + ";";
				headerGrpPos += gridColmnInfo[i].fromIndex + "," + (gridColmnInfo[i].toIndex - gridColmnInfo[i].fromIndex + 1) + ";";
			}
		}
		param.headerGrpCd = headerGrpCd;
		param.headerGrpNm = headerGrpNm;
		param.headerGrpPos = headerGrpPos;
		
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
    
    //(2017-04-26 : HS Kim) 본부 초기 설정
    var successCallbackOrgs = function(response){
    	var selectedId = null;
    	var sUprOrgId = "";
		if($("#sUprOrgId").val() != ""){
			 sUprOrgId = $("#sUprOrgId").val();
		}//		sUprOrgId = 'B111960000';
		
		if(response.length > 0){	// 사용자 본부ID 설정
    		for(var i=0; i<response.length; i++){
    			if (sUprOrgId == response[i].orgId) {
    				selectedId = response[i].orgId;
    			}
    		}
		}
		if(selectedId == null){
			selectedId = response[1].orgId;
		}
    	
    	selectInit[0] = Tango.select.init({
								            el: selectList[0].el
								            ,model: Tango.ajax.init({
								                url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[0].url,
								                data: $("#chrrOrgGrpCd").val()
								                })
								           ,valueField: selectList[0].key
								           ,labelField: selectList[0].label
								           ,selected: selectedId
        });
    	selectInit[0].model.get();
    	selectedId_orgId = selectedId;	// 전역변수 : successCallbackTeam에서 사용하기 위한 초기 설정된 본부ID
    	// 팀 정보 초기 설정
    	httpRequest('tango-transmission-biz/transmisson/trafficintg/trafficintgcode/team/' + selectedId, $("#chrrOrgGrpCd").val(), successCallbackTeam, failCallback, 'GET');

    }
    // (2017-04-27 : HS Kim) 팀 초기 설정
    var successCallbackTeam = function(response) {
    	var selectedId = null;
    	var sOrgId = "";
		if($("#sOrgId").val() != ""){
			sOrgId = $("#sOrgId").val();
		} //sOrgId = '1000196803';
		
		if(response.length > 0){	// 사용자 팀ID 설정
    		for(var i=0; i<response.length; i++){
    			if (sOrgId == response[i].orgId) {
    				selectedId = response[i].orgId;
    			}
    		}
		}
		if(selectedId == null){
			selectedId = response[1].orgId;
		}

    	selectInit[1] = Tango.select.init({
								            el: selectList[1].el
								            ,model: Tango.ajax.init({
								                url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/team/' + selectedId_orgId,
								                data: $("#chrrOrgGrpCd").val()
								                })
								           ,valueField: selectList[1].key
								           ,labelField: selectList[1].label
								           ,selected: selectedId
        });
    	selectInit[1].model.get();
    }
    
});