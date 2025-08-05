/**
 * 
 */

$a.page(function() {
	
	var m = {
			form: {
				searchFormObject:$('#searchForm')
			},
			select:{
				ordoDivCd: $('#ordoDivCd'),				// 발주처
				hdofcOrgId: $('#hdofcOrgId'),			// 본부
				appltKndCd: $('#appltKndCd'),			// 청약종류
				divAppltKndCd: $('#divAppltKndCd'),		// 청약종류 DIV
				cancelYn:$('#cancelYn')					// 취소여부
			},
			date:{
				frstRegStartDate:$('#frstRegStartDate'),// 청약일 시작일자
				frstRegEndDate:$('#frstRegEndDate')		// 시작일 종료일자
			},
			button:{
				yesterday:$('#btnYesterday'),			// 어제
				today:$('#btnToday'),					// 오늘
				aWeek:$('#btnAWeek'),					// 1주일
				aMonth:$('#btnAMonth'),					// 1개월
				currentMonth:$('#btnCurrentMonth'),		// 당월
				preMonth:$('#btnPreMonth'),				// 전월
				search:$('#btnSearch'),					// 조회
				excel:$('#btnExcelDown'),				// 엑셀 다운로드
				bpId:$('#btnSearchBp')					// 시공업체 검색 버튼
			},
			textBox:{
				acsnwAppltReqNo:$('#acsnwAppltReqNo'),	// 청약요청번호
//				engstNo:$('#engstNo'),					// ENG.NO
//				lstUp:$('#lstUp'),						// 상위국 주소
//				lstDown:$('#lstDown')					// 하위국 주소
			},
			page:{
				firstRowIndex:1,
				lastRowIndex:20
			},
			grid :$('#grid'),
			api:{
				searchForPage:'tango-transmission-biz/transmission/webportal/intgprcsmgmt/intgPrcsList	'						// 통합공정리스트조회				
			},
//			popup:{
//				grid:{
//					id:'ANetworkApplicationReceiptRequestDetail',
//					title:'A청약요청상세',
//					url:'ANetworkApplicationReceiptRequestDetail.do',
//					width:'1600',
//					height:'900'
//				}
//			},
			hidden:{
				firstRowIndex:$('#firstRowIndex'),
				lastRowIndex:$('#lastRowIndex')
			}
		};
	
	m.button.bpId.on('click', function(e) {  // 시공업체 조회
    	setBp('bpId', 'bpNm');
    });
	// 공통콤보 설정
	var setCombo = function(){
		setSelectByCode('skAfcoDivCd','select','C00212', setSkAfcoDivCdCodeCallBack);   // 발주처
		//setSelectByCode('appltKndCd','select','C00534', setSelectByCodeCallBack);    청약종류
	};
	 
	function setSelectByCodeCallBack(rtnId){
		//alert('공통코드 세팅 callback \n ID : '+rtnId);
	}
	function setSkAfcoDivCdCodeCallBack(rtnId){
		$('#skAfcoDivCd').setSelected('T');
	}
	
	var setComponentByCodeCallBack = function(){};
	
	var httpRequest = function(uri,data,method,flag){
		
		Tango.ajax({
			url : uri,
			data : data,
			method : method,
			flag:flag
		}).done(function(response){successCallback(response, flag);})
			.fail(function(response){failCallback(response, flag);});
		
	};
	
	var intgPrcsGridHeader = {
			autoColumnIndex: true,
    		rowClickSelect: true,
			columnMapping: [
			            {
							key : 'skAfcoDivNm', 
							title : '계열사구분'
						},{
							key : 'appltKndNm',
							title : '청약종류',
							width: '90px'
//						},{
//							key : 'mgmtOrgNm',
//							title : '본부',
//							width: '190px'
						},{
							key : 'appltNo',
							title : '청약번호',
							width: '190px'
						},{
							key : 'appltNm',
							title : '청약명',
							width: '300px'								
						},{
							key : 'appltReqNo',
							title : '청약요청번호',
							width: '190px'
						},{
							key : 'appltStatNm',
							title : '청약상태',
							width: '80px'
						},{
							key : 'appltAcepDtm',
							title : '청약접수일',
							width: '100px'
						}
			]
	};
	

	$('#skAfcoDivCd').on('change',function(){
		comParamArg = [];
		var orgParamArg = new Array();
		if($(this).val() == "T"){
			comParamArg.push("comCd:01^02^06^07");
			setSelectByCode('appltKndCd','select', 'C00534', setSelectByCodeCallBack, comParamArg);
			
	        orgParamArg.push("orgGrpCd:SKB");
	        setSelectByOrg('hdofcOrgId','all','local', null, orgParamArg);		//설계(BP)본부콤보 조회
		}else{
			comParamArg.push("comCd:03^04^05^08^09");
			setSelectByCode('appltKndCd','select', 'C00534', setSelectByCodeCallBack, comParamArg);
			
			orgParamArg.push("orgGrpCd:SKT");
	        setSelectByOrg('hdofcOrgId','all','local', null, orgParamArg);		//설계(BP)본부콤보 조회
		}
		
	});
	
	var initGrid = function () {
		
		//그리드 생성
        m.grid.alopexGrid(intgPrcsGridHeader);
        
	};
	
	// Grid의 마지막 Scroll 이 될때 발생하는 Event
	m.grid.on('scrollBottom', function(e){
		
		var nFirstRowIndex =parseInt(m.hidden.firstRowIndex.val()) + 20; 
		
		showProgress(m.grid);
		var nFirstRowIndex =parseInt(m.hidden.firstRowIndex.val()) + 20; 
		m.hidden.firstRowIndex.val(nFirstRowIndex);
		var nLastRowIndex =parseInt(m.hidden.lastRowIndex.val()) + 20;
		m.hidden.lastRowIndex.val(nLastRowIndex);
  		
  		httpRequest(m.api.searchForPage, m.form.searchFormObject.getData(),'GET','searchForPageAdd');		
	});
  	
	
	
	var showProgress = function(gridId){
		gridId.alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		gridId.alopexGrid('hideProgress');
	};

	var successCallback = function(response, flag){
		
		
		switch (flag) { 
		
		case 'searchForPage': 				//통합공정리스트조회
			
			hideProgress(m.grid);
			if(response.lists.length == 0){
				m.grid.alopexGrid('dataSet', $.extend(true, [], response.lists));
				alert('조회된 데이터가 없습니다.');
			}else{
				m.grid.alopexGrid('dataSet', $.extend(true, [], response.lists));
			}
			break;
		case 'searchForPageAdd': 				// 청약접수리스트조회
			
			hideProgress(m.grid);
	   		
			if(response.lists.length == 0){
				alert('더 이상 조회될 데이터가 없습니다');
				return false;
			}else{
				
				m.grid.alopexGrid('dataAdd', response.lists);
			}
			break;
		default:
			
		}
		
	};
	
	
	var failCallback = function(response){
		
		alert("fail:" + response);
	};
	
	
	// 검색버튼 클릭시
  	m.button.search.click(function(e){
  		if($.TcpUtils.isEmpty($('#appltKndCd').val()) == true){
  			alert("청약종류를 입력해주세요");
  			
  			return;
  		}
  		var selected = m.select.divAppltKndCd.getValues();
		
  		showProgress(m.grid);
		m.hidden.firstRowIndex.val(m.page.firstRowIndex);
    	m.hidden.lastRowIndex.val(m.page.lastRowIndex);
    	
  		var test = m.form.searchFormObject.getData();
  		httpRequest(m.api.searchForPage, m.form.searchFormObject.getData(),'GET','searchForPage');
  	});
	
	// "어제" button
  	m.button.yesterday.click(function(e){
  		m.date.frstRegStartDate.val(calculateDate(1));
  		m.date.frstRegEndDate.val(calculateDate(0));
  		
  	});
	
	// "오늘" button
	m.button.today.click(function(e){
		m.date.frstRegStartDate.val(calculateDate(0));
  		m.date.frstRegEndDate.val(calculateDate(0));
	});
	
	// "1주일" button
	m.button.aWeek.click(function(e){
		m.date.frstRegStartDate.val(calculateDate(7));
  		m.date.frstRegEndDate.val(calculateDate(0));
	});
	
	// "1개월" button
	m.button.aMonth.click(function(e){
  		m.date.frstRegStartDate.val(calculateDate(30));
  		m.date.frstRegEndDate.val(calculateDate(0));
	});
	
	// "당월" button
	m.button.currentMonth.click(function(e){
		
		var today = new Date();
		var today_year = today.getFullYear();
		var today_month = (today.getMonth()+1)>9 ? ''+(today.getMonth()+1) : '0'+(today.getMonth()+1);
		var last_day = (new Date( today_year, today_month, 0) ).getDate();
		
		var start_date = today_year + '-' + today_month + '-01';
		var end_date = today_year + '-' + today_month + '-' + last_day;
		
		
		m.date.frstRegStartDate.val(start_date);
  		m.date.frstRegEndDate.val(end_date);
	});
	
	// "전월" button
	m.button.preMonth.click(function(e){
		
		var today = new Date();
		var firstDayOfMonth = new Date( today.getFullYear(), today.getMonth() , 1 );
		var lastMonth_date = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
		
		var lastMonth_year = lastMonth_date.getFullYear();
		var lastMonth_month = (lastMonth_date.getMonth()+1)>9 ? ''+(lastMonth_date.getMonth()+1) : '0'+(lastMonth_date.getMonth()+1);
		var lastMonth_day = (new Date( lastMonth_year, lastMonth_month, 0) ).getDate();
		
		var start_date = lastMonth_year + '-' + lastMonth_month + '-01';
		var end_date = lastMonth_year + '-' + lastMonth_month + '-' + lastMonth_day;
		
		m.date.frstRegStartDate.val(start_date);
  		m.date.frstRegEndDate.val(end_date);
	});
	
	m.button.excel.click(function(e){
		 var worker = new ExcelWorker({
     		excelFileName : '사업명',
     		palette : [{
     			className : 'B_YELLOW',
     			backgroundColor: '255,255,0'
     		},{
     			className : 'F_RED',
     			color: '#FF0000'
     		}],
     		sheetList: [{
     			sheetName: '사업명',
     			$grid:  m.grid
     		}]
     	});
     	worker.export({
     		merge: false,
     		exportHidden: false,
     		filtered  : false,
     		selected: false,
     		useGridColumnWidth : true,
     		border  : true
     	});
			/* $('#searchForm').attr({
									method:"get",
									action:"/tango-transmission-biz/transmisson/subscriptionmgmt/registration/webfaxexceldown",
									target:"downloadIframe",
								   }
								 );
			$('#searchForm').submit();
			$('#searchForm').removeAttr("method");
			$('#searchForm').removeAttr("action");
			$('#searchForm').removeAttr("target"); */
	  });
	
	
	var calculateDate = function(option){
		
		var current_date = new Date();
  		var option_date = new Date(Date.parse(current_date) - option * 1000 * 60 * 60 * 24);
		
  		var option_Year = option_date.getFullYear();
  		var option_Month = (option_date.getMonth()+1)>9 ? ''+(option_date.getMonth()+1) : '0'+(option_date.getMonth()+1);
  		var option_Day = option_date.getDate() > 9 ? '' + option_date.getDate() : '0' + option_date.getDate();
  		
  		return option_Year + '-' + option_Month + '-' + option_Day;
	};
	
	
	//그리드 셀 클릭 이벤트 바인딩
  	m.grid.on('dblclick','.bodycell', function(e){
  		var ev = AlopexGrid.parseEvent(e);
		var data = ev.data;
		var mapping = ev.mapping;
        var popupUrl = "";
        var popid = "";
        var title = "";
        var dataArray = {};
        
		var ev = AlopexGrid.parseEvent(e);
		var data = ev.data;

		var pageInfo = m.grid.alopexGrid('pageInfo');

		data.pageNo = pageInfo.current;
		$a.navigate('/tango-transmission-web/webportal/intgprcsmgmt/IntgPrcsMgmt.do', data);

	});
  	
	this.init = function(id, param) {
		setCombo();
		initGrid();
		m.button.aMonth.click();
    };    
});