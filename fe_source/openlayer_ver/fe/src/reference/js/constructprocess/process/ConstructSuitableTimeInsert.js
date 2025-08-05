/**
 * ConstructSuitableTimeInsert.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var loginDept = $('input[name=loginDept]').val();
	var loginDeptType = $('input[name=loginDeptType]').val();

	var isSkt = true;

	//세팅
	var m = {
		grid : {
			gridObject : $('#dataGrid')
		},
		form : {
			formObject : $('form[name=searchForm]')
		},
		object : {
			reg : function (num){
				return 0 == num ? $('input[name=engdnRegDtFrom]').val(m.date(0,1)) : $('input[name=engdnRegDtTo]').val(m.date(0,0));
			},
			aprv : function (num) {
				return 0 == num ? $('input[name=engdnIsueAprvDtFrom]').val(m.date(0,1)) : $('input[name=engdnIsueAprvDtTo]').val(m.date(0,0));
			},
			efdg : function (num) {
				return 0 == num ? $('input[name=efdgEngdnCoptDtmFrom]').val(m.date(0,1)) : $('input[name=efdgEngdnCoptDtmTo]').val(m.date(0,0));
			}
		},
		date : function (option, num){


//			var vYYYY = getToday(true).substr(0,4);
//
//	    	//일자설정
//	    	var vLastYYYY = getToday(true, 'Y', 0).substr(0,4);
//	    	var vLastMMdd = getToday(true, 'D', 1).substr(4,4);
//	    	var vLastYearDay = vLastYYYY + vLastMMdd;

			var startDate = getToday(true, 'D', -6);
			var endDate = getToday(true);

			if(0==num){ return setDateFormat(endDate); };

			return setDateFormat(startDate);
		},
		api : {
			 url : 'tango-transmission-biz/transmission/constructprocess/process/constructSuitableTimeInsert'
			,url2 : 'tango-transmission-biz/transmission/constructprocess/process/getConstructSuitableTimeInsertGetBizDivCdList'
		},
		flag : {
			getList   : 'getList'
		},
		button : {
			btnSearch : function (num){
				return 0 == num ? $('#btnSearch') : $('#btnBpSearch');
			},
			btnExcel : $('#btnExcel'),
			btnRefresh : $('#btnRefresh')
		},
		input : {
			date : function (num){
				return 0 == num ? $('#engdnRegDtFrom') : $('#engdnIsueAprvDtFrom');
			}
		},
		popup:{
			bpNameList : {
				id:'BpCommon',
				title:'시공업체',
				url:'/tango-transmission-web/constructprocess/common/BpCommon.do',
				width:'639',
				height:'644'
			}
		}
	}

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

		console.log($('#skAfcoDivCd').val());

		if($('#skAfcoDivCd').val() == 'T'){
			isSkt = true;
		}else{
			isSkt = false;
		}


		$('#btnSearch').setEnabled(false);

		init(param);
		initGrid();
        setEventListener();

        /* 시공업체 권한설정 */
        setBpByRole('bpId', 'cnstnVndrNm','btnBpSearch');
    }

    //초기화면
    var init = function (param) {

    	$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});
    	
    	//네트워크 관리지사 코드
    	if($('#skAfcoDivCd').val() == 'B'){
    		setSelectByOrgMulti('dsnrOrgId','all',setSelectByCodeCallBack);    
    	}else{
    		setSelectByOrg('dsnrOrgId','all',setSelectByCodeCallBack);
    	}

    	m.object.reg(0);
    	m.object.reg(1);
    	m.object.aprv(0);
    	m.object.aprv(1);

    	if(!isSkt){
	    	m.object.efdg(0);
	    	m.object.efdg(1);
    	}

    	$('input[name=cnstnVndrNm]').setEnabled(false);
    }

    //Grid 초기화
    var initGrid = function () {


    	if(isSkt){

		    	//그리드 생성
		        m.grid.gridObject.alopexGrid({
		        	autoColumnIndex: true,
		        	grouping : {
		        		useGrouping : true,
		        		by : ['mgmtOrgNm'],
		        		useGroupFooter : ['mgmtOrgNm'],
		        		useGroupRowspan :true,
		        		useGroupRearrange : true,
		        		groupRowspanMode : 2
		        	},
					headerGroup: [
					            {fromIndex:0, toIndex:1, title:msgArray['division'], hideSubTitle: true},
		  	        			{fromIndex:2, toIndex:7, title:msgArray['insert']+msgArray['currentState']},
		  	        			{fromIndex:8, toIndex:9, title:msgArray['suitableTime']+msgArray['InsertRate']},
		  	        			{fromIndex:10, toIndex:11, title:msgArray['workApproval']+" "+msgArray['after']+" "+msgArray['workFinish']+" "+msgArray['untreated']+" "+msgArray['rate']}
		  	        ],
		    		columnMapping: [
					{
						key : 'mgmtOrgNm', align:'right',
						width: '100',
					    rowspan:true
					}, {
						key : 'cnstnVndrNm', align:'right',
						width: '100',
						groupFooter : [msgArray['summarization']],
						groupFooterAlign : 'right'
					}, {
						key : 'workEndCnt', align:'right',
						title : msgArray['work']+' '+msgArray['finish']+msgArray['numberOfCases']+'(A)',
						width: '100',
						groupFooter : ['sum()'],
						groupFooterAlign : 'right'
					}, {
						key : 'workInCnt', align:'right',
						title : msgArray['timeLimit']+' '+msgArray['insert']+'(B)',
						width: '100',
						groupFooter : ['sum()'],
						groupFooterAlign : 'right'
					}, {
						key : 'workOutCnt', align:'right',
						title : msgArray['excess']+msgArray['insert']+'(C)',
						width: '100',
						groupFooter : ['sum()'],
						groupFooterAlign : 'right'
					}, {
						key : 'noInputCnt', align:'right',
						title : msgArray['workFinishTimeLimitNotInput']+'(D)',
						width: '100',
						groupFooter : ['sum()'],
						groupFooterAlign : 'right'
					}, {
						key : 'avg9NoProcCnt', align:'right',
						title : msgArray['averageCountExcessUntreated']+'(E)',
						width: '100',
						groupFooter : ['sum()'],
						groupFooterAlign : 'right'
					}, {
						key : 'noProcCnt', align:'right',
						title : msgArray['workApprovalWorkFinishUntreated']+'(F)',
						width: '100',
						groupFooter : ['sum()'],
						groupFooterAlign : 'right'
					}, {
						key : 'case1', align:'right',
						title : 'Case 1 : '+msgArray['suitableTimeInsertRate']+' (B/A) (%)',
						width: '100',
						groupFooter:[function(range, mapping){
							var B = 0;
							var A = 0;
							for(var i=0; i<range.member.length; i++){
								B = B + parseInt(range.member[i]["workInCnt"].replace(/,/gi,''));
								A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
							}
							return truncate((B/A)*100);
			           }],
						groupFooterAlign : 'right'
					}, {
						key : 'case2', align:'right',
						title : 'Case 2 : '+msgArray['suitableTimeInsertRate']+' [B/(A-D)] '+msgArray['notInsertWithout']+'(%)',
						width: '100',
						groupFooter:[function(range, mapping){
							var B = 0;
							var A = 0;
							var D = 0;
							for(var i=0; i<range.member.length; i++){
								B = B + parseInt(range.member[i]["workInCnt"].replace(/,/gi,''));
								A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
								D = D + parseInt(range.member[i]["noInputCnt"].replace(/,/gi,''));
							}
							return truncate(B/(A-D)*100);
			           }],
						groupFooterAlign : 'right'
					}, {
						key : 'avg9', align:'right',
						title : msgArray['averageExcessRate']+' [E/(A+F)](%)',
						width: '100',
						groupFooter:[function(range, mapping){
							var E = 0;
							var A = 0;
							var F = 0;
							for(var i=0; i<range.member.length; i++){
								E = E + parseInt(range.member[i]["avg9NoProcCnt"].replace(/,/gi,''));
								A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
								F = F + parseInt(range.member[i]["noProcCnt"].replace(/,/gi,''));
							}
							return truncate(E/(A+F)*100);
			           }],
						groupFooterAlign : 'right'
					}, {
						key : 'avgall', align:'right',
						title : msgArray['all']+' [F/(A+F)](%)',
						width: '100',
						groupFooter:[function(range, mapping){
							var F = 0;
							var A = 0;
							for(var i=0; i<range.member.length; i++){
								F = F + parseInt(range.member[i]["noProcCnt"].replace(/,/gi,''));
								A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
							}
							return truncate(F/(A+F)*100);
			           }],
						groupFooterAlign : 'right'
					}],

					footer : {
						position : 'bottom',
						footerMapping : [{
							columnIndex:1, title:msgArray['summarization'], align:'right'
						},{
							columnIndex:2, render : 'sum(workEndCnt)', align:'right'
						},{
							columnIndex:3, render : 'sum(workInCnt)', align:'right'
						},{
							columnIndex:4, render : 'sum(workOutCnt)', align:'right'
						},{
							columnIndex:5, render : 'sum(noInputCnt)', align:'right'
						},{
							columnIndex:6, render : 'sum(avg9NoProcCnt)', align:'right'
						},{
							columnIndex:7, render : 'sum(noProcCnt)', align:'right'
						},{
							columnIndex:8, render : function(range){
								var B = 0;
								var A = 0;
								if(range.length > 0){
									for(var i=0; i<range.length; i++){
										B = B + parseInt(range[i]["workInCnt"].replace(/,/gi,''));
										A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
									}
									return truncate((B/A)*100);
								}else{
									return 0;
								}
				           }, align:'right'
						},{
							columnIndex:9, render : function(range){
								var B = 0;
								var A = 0;
								var D = 0;
								if(range.length > 0){
									for(var i=0; i<range.length; i++){
										B = B + parseInt(range[i]["workInCnt"].replace(/,/gi,''));
										A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
										D = D + parseInt(range[i]["noInputCnt"].replace(/,/gi,''));
									}
									return truncate(B/(A-D)*100);
								}else{
									return 0;
								}
				           }, align:'right'
						},{
							columnIndex:10, render : function(range){
								var E = 0;
								var A = 0;
								var F = 0;
								if(range.length > 0){
									for(var i=0; i<range.length; i++){
										E = E + parseInt(range[i]["avg9NoProcCnt"].replace(/,/gi,''));
										A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
										F = F + parseInt(range[i]["noProcCnt"].replace(/,/gi,''));
									}
									return truncate(E/(A+F)*100);
								}else{
									return 0;
								}
				           }, align:'right'
						},{
							columnIndex:11, render : function(range){
								var F = 0;
								var A = 0;
								if(range.length > 0){
									for(var i=0; i<range.length; i++){
										F = F + parseInt(range[i]["noProcCnt"].replace(/,/gi,''));
										A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
									}
									return truncate(F/(A+F)*100);
								}else{
									return 0;
								}
				           }, align:'right'
						}]
					},

					message: {
						nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
					}
		        });

    	}else{ // SKB

    		//그리드 생성
	        m.grid.gridObject.alopexGrid({
	        	autoColumnIndex: true,
	        	grouping : {
	        		useGrouping : true,
	        		by : ['mgmtOrgNm'],
	        		useGroupFooter : ['mgmtOrgNm'],
	        		useGroupRowspan :true,
	        		useGroupRearrange : true,
	        		groupRowspanMode : 2
	        	},
				headerGroup: [
				            {fromIndex:2, toIndex:9, title:'입력현황'},
	  	        			{fromIndex:8, toIndex:9, title:'작업완료 미처리 건(승인기준)'},
	  	        			{fromIndex:11, toIndex:13, title:'비고'},
//	  	        			{fromIndex:11, toIndex:11, title:'적기입력율',height:10},
//	  	        			{fromIndex:11, toIndex:11, title:'GIS입력 중인 건 포함',height:10},
//	  	        			{fromIndex:11, toIndex:11, title:'(B/A)',height:10},
//	  	        			{fromIndex:11, toIndex:11, title:'(%)', hideSubTitle: true,height:10},
	  	        			{fromIndex:12, toIndex:13, title:'작업완료 미처리율'}

	  	        ],
	    		columnMapping: [
				{
					key : 'mgmtOrgNm', align:'right', width: '100',
				    title : '지역명',
				    rowspan:true

				}, {
					key : 'demdBizDivNm', align:'right', width: '100',
					title : '사업구분',
					groupFooter : ['소계'],
					groupFooterAlign : 'right'
				}, {
					key : 'workCnt', align:'right', width: '100',
					title : '공사건수',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'workInsertCnt', align:'right', width: '100',
					title : '작업등록건수',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'workEndCnt', align:'right',
					title : '작업완료건수'+'(A)',
					width: '100',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'workInCnt', align:'right',
					title : '기한내입력건수'+'(B)',
					width: '100',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'workOutCnt', align:'right',
					title : '초과입력건수'+'(C)',
					width: '100',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'noInputCnt', align:'right',
					title : 'GIS입력중'+'(D)',
					width: '100',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'noProcCnt', align:'right',
					title : '전체'+'(E)',
					width: '100',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'avc7NoProcCnt', align:'right',
					title : '7일초과'+'(F)',
					width: '100',
					groupFooter : ['sum()'],
					groupFooterAlign : 'right'
				}, {
					key : 'case1', align:'right',
					title : msgArray['suitableTimeInsertRate']+' [B/(A-D)](%)',
					width: '100',
					groupFooter:[function(range, mapping){
									var B = 0;
									var A = 0;
									var D = 0;
									for(var i=0; i<range.member.length; i++){
										B = B + parseInt(range.member[i]["workInCnt"].replace(/,/gi,''));
										A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
										D = D + parseInt(range.member[i]["noInputCnt"].replace(/,/gi,''));
									}
									return truncate(B/(A-D)*100);
					           }],
					groupFooterAlign : 'right'
				}, {
					key : 'case2', align:'right',
					title : msgArray['suitableTimeInsertRate']+'(GIS입력 중인 건 포함)(B/A)'+'(%)',
					width: '100',
					groupFooter:[function(range, mapping){
						var B = 0;
						var A = 0;
						for(var i=0; i<range.member.length; i++){
							B = B + parseInt(range.member[i]["workInCnt"].replace(/,/gi,''));
							A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
						}
						return truncate((B/A)*100);
		           }],
					groupFooterAlign : 'right'
				}, {
					key : 'avgall', align:'right',
					title : '전체'+' [E/(A+E)](%)',
					width: '100',
					groupFooter:[function(range, mapping){
						var E = 0;
						var A = 0;
						for(var i=0; i<range.member.length; i++){
							E = E + parseInt(range.member[i]["noProcCnt"].replace(/,/gi,''));
							A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
						}
						return truncate((E/(A+E))*100);
		           }],
					groupFooterAlign : 'right'
				}, {
					key : 'avg7', align:'right',
					title : '7일초과'+' [F/(A+E)](%)',
					width: '100',
					groupFooter:[function(range, mapping){
						var F = 0;
						var A = 0;
						var E = 0;
						for(var i=0; i<range.member.length; i++){
							F = F + parseInt(range.member[i]["avc7NoProcCnt"].replace(/,/gi,''));
							A = A + parseInt(range.member[i]["workEndCnt"].replace(/,/gi,''));
							E = E + parseInt(range.member[i]["noProcCnt"].replace(/,/gi,''));
						}
						return truncate((F/(A+E))*100);
		           }],
					groupFooterAlign : 'right'
				}, {
					key : 'dsnrOrgId', hidden:true
				}, {
					key : 'demdBizDivCd', hidden:true
				}],

				footer : {
					position : 'bottom',
					footerMapping : [{
						columnIndex:1, title:msgArray['summarization'], align:'right'
					},{
						columnIndex:2, render : 'sum(workCnt)', align:'right'
					},{
						columnIndex:3, render : 'sum(workInsertCnt)', align:'right'
					},{
						columnIndex:4, render : 'sum(workEndCnt)', align:'right'
					},{
						columnIndex:5, render : 'sum(workInCnt)', align:'right'
					},{
						columnIndex:6, render : 'sum(workOutCnt)', align:'right'
					},{
						columnIndex:7, render : 'sum(noInputCnt)', align:'right'
					},{
						columnIndex:8, render : 'sum(noProcCnt)', align:'right'
					},{
						columnIndex:9, render : 'sum(avc7NoProcCnt)', align:'right'
					},{
						columnIndex:10, render : function(range){
							var B = 0;
							var A = 0;
							var D = 0;
							if(range.length > 0){
								for(var i=0; i<range.length; i++){
									B = B + parseInt(range[i]["workInCnt"].replace(/,/gi,''));
									A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
									D = D + parseInt(range[i]["noInputCnt"].replace(/,/gi,''));
								}
								return truncate(B/(A-D)*100);
							}else{
								return 0;
							}
			           } , align:'right'
					},{
						columnIndex:11, render : function(range){
							var B = 0;
							var A = 0;
							if(range.length > 0){
								for(var i=0; i<range.length; i++){
									B = B + parseInt(range[i]["workInCnt"].replace(/,/gi,''));
									A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
								}
								return truncate((B/A)*100);
							}else{
								return 0;
							}
			           }, align:'right'
					},{
						columnIndex:12, render : function(range){
							var E = 0;
							var A = 0;
							if(range.length > 0){
								for(var i=0; i<range.length; i++){
									E = E + parseInt(range[i]["noProcCnt"].replace(/,/gi,''));
									A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
								}
								return truncate((E/(A+E))*100);
							}else{
								return 0;
							}
			           }, align:'right'
					},{
						columnIndex:13, render : function(range){
							var F = 0;
							var A = 0;
							var E = 0;
							if(range.length > 0){
								for(var i=0; i<range.length; i++){
									F = F + parseInt(range[i]["avc7NoProcCnt"].replace(/,/gi,''));
									A = A + parseInt(range[i]["workEndCnt"].replace(/,/gi,''));
									E = E + parseInt(range[i]["noProcCnt"].replace(/,/gi,''));
								}
								return truncate((F/(A+E))*100);
							}else{
								return 0;
							}
			           }, align:'right'
					}]
				},

				message: {
					nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
				}
	        });




    	}



       // gridHide();
    }

    // 컬럼 숨기기
    var gridHide = function () {
	}

    var setEventListener = function () {
    	//시공업체 조회
    	m.button.btnSearch(1).on('click', function (){
    		var param =  m.form.formObject.getData();
    		openPopup(m.popup.bpNameList.id
					, m.popup.bpNameList.title
					, m.popup.bpNameList.url
					, null
					, m.popup.bpNameList.width
					, m.popup.bpNameList.height
					, setDataCallback);
    	});

    	//조회
    	m.button.btnSearch(0).on('click', function (){
    		setGrid();
    	});

    	$('form[name=searchForm]').keypress(function (event) {
    		if (13 == event.keyCode){
    			setGrid();
    		}
    	});

    	m.button.btnExcel.on('click', function (){
    		if (0 == m.grid.gridObject.alopexGrid('pageInfo').pageDataLength) {
    			callMsgBox('noData','W', msgArray['noData'] , btnMsgCallback);
    			return;
    		}
    		exportExcel();
    	});

//    	m.input.date(0).on('change', function (){
//    		if ('2013-04-17' > m.input.date(0).val()) {
//    			callMsgBox('noAfterDate','W', '2013-04-18 ' + msgArray['noAfterDate'] , btnMsgCallback);
//    			m.input.date(0).val('2013-04-17');
//    			return;
//    		}
//    	});
//
//    	m.input.date(1).on('change', function (){
//    		if ('2013-04-17' > m.input.date(1).val()) {
//    			callMsgBox('noAfterDate','W', '2013-04-18 ' + msgArray['noAfterDate'] , btnMsgCallback);
//    			m.input.date(1).val('2013-04-17');
//    			return;
//    		}
//    	});

    	m.button.btnRefresh.on('click', function (){
    		location.reload();
    	});

    	$('input[name=bpId]').on('input propertychange', function () {
    		$('input[name=cnstnVndrNm]').val('');
    	});

    	$('input[name=cnstnVndrNm]').on('input propertychange', function () {
    		$('input[name=bpId]').val('');
    	});
    }

    var btnMsgCallback = function () {
    }

    //엑셀다운로드
    var exportExcel = function () {
    	var worker = new ExcelWorker({
    		excelFileName: msgArray['suitableTimeInsertRate']+'_'+m.date(0,0),
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: msgArray['suitableTimeInsertRate'],
    			$grid: m.grid.gridObject
    		}]
    	});
    	worker.export({
    		merge: false,
    		exportHidden: false,
    		useGridColumnWidth: true,
    		exportGroupSummary : true,
    		exportFooter : true
    	});
    }

	//request 성공시
    var successCallback = function (response,stats,xhr,flag){

    	//설계(BP)본부 세팅
    	if ('org' == flag) {
    		var option_data =  [{orgId: "", orgNm: "-- 전체 --",uprOrgId: ""}];
    		for(var i in response){
    			var obj = response[i];
    			option_data.push(obj);
    		}

    		$('select[name=dsnrOrgId]').setData({
    			data:option_data
    		});

        	if ('A' == loginDeptType) {
        		$.each($('select[name=dsnrOrgId] option'), function (){
        			if (loginDept == this.value) {
        				$(this).attr('selected','selected');
        			}
        		});
        		$('select[name=dsnrOrgId]').next().text($('#dsnrOrgId option:selected').text());
        	}
    	}

    	if ('getList' == flag) {
        	m.grid.gridObject.alopexGrid('hideProgress');
        	var data = response.dataList;
        	m.grid.gridObject.alopexGrid('dataSet', data);

        	m.grid.gridObject.alopexGrid('updateOption',
					{paging : {pagerTotal: function(paging) {
						return '총 건수 : ' + data.length;
					}}}
			);
    	}

    	if('getBizDivCdList' == flag){
    		if(response.bizDivCdList.length > 0){
    			var list = response.bizDivCdList;
    			$.each(list, function(index,obj){
  					$('#demdBizDivCd').append($('<option>',{value:obj.demdBizDivCd,text:obj.demdBizDivNm}));
    			});
    			$('#btnSearch').setEnabled(true);
    		}
    	}
    }

    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }

    var setSelectByCodeCallBack = function (){
    	if(isSkt){
    		$('#btnSearch').setEnabled(true);
    	}else{
    		// 사업구분 조회
	    	model.get({url : m.api.url2, data:"", flag : "getBizDivCdList"}).done(successCallback).fail(failCallback);
    	}
    }

    //그리드에 추가
    var setDataCallback = function (response) {
    	var data = response;
    	$('input[name=bpId]').val(data.bpId);
    	$('input[name=cnstnVndrNm]').val(data.bpNm);
    }

    //데이터 조회
    var setGrid = function () {
    	var param =  m.form.formObject.getData();

    	//grid 조회
    	if ('' == param.engdnIsueAprvDtFrom && '' != param.engdnIsueAprvDtTo) {
			callMsgBox('noEngPulblicationStartDt','W', msgArray['noEngPulblicationStartDt'] , btnMsgCallback);
			return;
		}

		if ('' != param.engdnIsueAprvDtFrom && '' == param.engdnIsueAprvDtTo) {
			callMsgBox('noEngPulblicationEndDt','W', msgArray['noEngPulblicationEndDt'] , btnMsgCallback);
			return;
		}

		if (param.engdnIsueAprvDtFrom > param.engdnIsueAprvDtTo) {
			callMsgBox('noFastEngPublicationEndDtStartDt','W', msgArray['noFastEngPublicationEndDtStartDt'] , btnMsgCallback);
			return;
		}

		if ('' == param.suplDrctDtFrom && '' != param.suplDrctDtTo) {
			callMsgBox('noSupplyDirectionFinishStartDt','W', msgArray['noSupplyDirectionFinishStartDt'] , btnMsgCallback);
			return;
		}

		if ('' != param.suplDrctDtFrom && '' == param.suplDrctDtTo) {
			callMsgBox('noSupplyDirectionFinishEndDt','W', msgArray['noSupplyDirectionFinishEndDt'] , btnMsgCallback);
			return;
		}

		if (param.suplDrctDtFrom > param.suplDrctDtTo) {
			callMsgBox('noFastSupplyDirectionFinishEndDtStartDt','W', msgArray['noFastSupplyDirectionFinishEndDtStartDt'] , btnMsgCallback);
			return;
		}

		if ('' == param.engdnRegDtFrom && '' != param.engdnRegDtTo) {
			callMsgBox('noEngRegisterStartDt','W', msgArray['noEngRegisterStartDt'] , btnMsgCallback);
			return;
		}

		if ('' != param.engdnRegDtFrom && '' == param.engdnRegDtTo) {
			callMsgBox('noEngRegisterEndDt','W', msgArray['noEngRegisterEndDt'] , btnMsgCallback);
			return;
		}

		if (param.engdnRegDtFrom > param.engdnRegDtTo) {
			callMsgBox('noFastEngRegisterEndDtStartDt','W', msgArray['noFastEngRegisterEndDtStartDt'] , btnMsgCallback);
			return;
		}

		if ('' == param.efdgEngdnCoptDtmFrom && '' != param.efdgEngdnCoptDtmTo) {
			callMsgBox('noEnforcementDesignFinishStartDt','W', msgArray['noEnforcementDesignFinishStartDt'] , btnMsgCallback);
			return;
		}

		if ('' != param.efdgEngdnCoptDtmFrom && '' == param.efdgEngdnCoptDtmTo) {
			callMsgBox('noEnforcementDesignFinishEndDt','W', msgArray['noEnforcementDesignFinishEndDt'] , btnMsgCallback);
			return;
		}

		if (param.efdgEngdnCoptDtmFrom > param.efdgEngdnCoptDtmTo) {
			callMsgBox('noFastEnforcementDesignEndDtStartDt','W', msgArray['noFastEnforcementDesignEndDtStartDt'] , btnMsgCallback);
			return;
		}

    	var orgList = "";
    	
    	if($('#skAfcoDivCd').val() == 'B'){
    		
			if($.TcpUtils.isNotEmpty(param.dsnrOrgId)){
	    	   	for(i=0; i<param.dsnrOrgId.length; i++){
	    	   		if($.TcpUtils.isNotEmpty( param.dsnrOrgId[i])){
	    	   			orgList += (i==0)?param.dsnrOrgId[i]:","+param.dsnrOrgId[i];
	    	   		}
	    	   	}
	    		param.dsnrOrgId = orgList;
	    
			}else{
				alertBox("I","본부를 선택해 주세요.");
				return;
	    	}
    	}
    	
    	m.grid.gridObject.alopexGrid('showProgress');
    	
    	model.get({url : m.api.url, data : param, flag : m.flag.getList}).done(successCallback).fail(failCallback);
    }

    var model = Tango.ajax.init({});

    //팝업 호출
    var openPopup = function(popupId,title,url,data,widthSize,heightSize,callBack){
		$a.popup({
        	popid: popupId,
        	title: title,
            url: url,
            data: data,
            width:widthSize,
            height:heightSize,
            callback: function(data) {
				callBack(data);
           	}
        });
	}

	function truncate(num) {

		var rexExp = /^-?((\d{1,20})([.]\d{0,1})?)?/;

		return parseFloat((parseFloat(num).toFixed(1)+"").match(rexExp)[0]);
	}


});