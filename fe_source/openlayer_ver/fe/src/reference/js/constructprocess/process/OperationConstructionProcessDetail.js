/**
 * OperationConstructionProcessDetail.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	var loginDept = $('input[name=loginDept]').val();
	var loginDeptType = $('input[name=loginDeptType]').val();
	
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
			}
		},
		date : function (option, num){
			var currentDate = new Date();
			var optionDate = new Date(Date.parse(currentDate) - option * 1000 * 60 * 60 * 24);
			var optionYear = optionDate.getFullYear();
			var optionMonth = (optionDate.getMonth()+1)>9 ? ''+(optionDate.getMonth()+1) : '0'+(optionDate.getMonth()+1);
			var optionDay = optionDate.getDate() > 9 ? '' + optionDate.getDate() : '0' + optionDate.getDate();
			if (0 == num) {
				return optionYear + '-' + optionMonth + '-' + optionDay;
			}
			
			if (1 == num) {
				return optionYear + '-01-01';
			}
			
			return optionYear;
		},
		api : {
			url : 'tango-transmission-biz/transmission/constructprocess/process/operationConstructionProcessDetail'
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
		popup:{
			bpNameList : {
				id:'BpCommon',
				title:'시공업체',
				url:'/tango-transmission-web/constructprocess/common/BpCommon.do',
				width:'639',
				height:'802'
			}
		}
	}
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
		init(param);
		initGrid();
        setEventListener();
    }
    
    //초기화면
    var init = function (param) {
    	$.each(m.form.formObject.children(), function (){
    		var name = $(this).attr('name');
    		if (undefined != param[name]) {
    			$(this).val(param[name]);
    		}
    	});
    	
    	setSelectByOrg('dsnBpChrrHdofcOrgId','select',setSelectByCodeCallBack);    //네트워크 관리지사 코드
    	
    	m.object.reg(0);
    	m.object.reg(1);
    	m.object.aprv(0);
    	m.object.aprv(1);
    	
    	//사업년도,목적,구분
    	var bizParamArg = new Array();
    	bizParamArg.push("erpBizDivCd:T");
    	setSelectByBiz('afeYr','uprDemdBizDivCd', 'lowDemdBizDivCd', setSelectByBizCallBack, bizParamArg);
    	
    	//시공업체 콤보박스 제어
    	if ('Z' == loginDeptType) {
    		m.button.btnSearch(1).attr('disabled',true);
    		$('input[name=cnstnVndrNm]').val($('input[name=loginAgentName]').val());
    		$('input[name=cnstnVndrNm]').attr('readonly','readonly');
    	}
    }
    
    //Grid 초기화
    var initGrid = function () {
        //그리드 생성
        m.grid.gridObject.alopexGrid({        
        	autoColumnIndex: true,
			headerGroup: [
  	        			{fromIndex:10, toIndex:14, title:"업무구분"}, 
  	        			{fromIndex:15, toIndex:18, title:"실시결과 접수"},
  	        			{fromIndex:19, toIndex:22, title:"작업"},
  	        			{fromIndex:23, toIndex:24, title:"OTDR등록"},
  	        			{fromIndex:28, toIndex:32, title:"Smart 인수인계"},
  	        			{fromIndex:33, toIndex:36, title:"정산서"},
  	        			{fromIndex:37, toIndex:38, title:"운용팀 인수인계"},
  	        			{fromIndex:39, toIndex:40, title:"실시설계(신설케이블)"},
  	        			{fromIndex:41, toIndex:42, title:"실시설계(신설관로)"},
  	        			{fromIndex:43, toIndex:45, title:"실시설계(금액)"},
  	        			{fromIndex:46, toIndex:48, title:"정산(신설케이블)"},
  	        			{fromIndex:49, toIndex:51, title:"정산(신설관로)"},
  	        			{fromIndex:52, toIndex:55, title:"정산(금액)"},
  	        			{fromIndex:67, toIndex:69, title:"한전공가"},
  	        			{fromIndex:70, toIndex:73, title:"신청본수현황"},
  	        			{fromIndex:75, toIndex:79, title:"가감공사"}
  	        ],  
    		columnMapping: [
			{
				key : 'mgmtTeamOrgNm', align:'center',
				title : '관리팀',
				width: '100'
			}, {
				key : 'afeNo', align:'center',
				title : 'AFE차수',
				width: '70'
			}, {
				key : 'uprDemdbizDivNm', align:'center',
				title : '사업목적',
				width: '70'
			}, {
				key : 'lowDemdBizDivNm', align:'center',
				title : '사업구분',
				width: '200'
			}, {
				key : 'engstNo', align:'center',
				title : '접수번호',
				width: '120'
			}, {
				key : 'cstrCd', align:'center',
				title : '공사코드',
				width: '100'
			}, {
				key : 'cstrNm', align:'center',
				title : '공사명',
				width: '200'
			}, {
				key : 'cstrMgmtOnrNm', align:'center',
				title : '협력사',
				width: '60'				
			}, {
				key : 'cnstnVndrNm', align:'center',
				title : '등록사',
				width: '100'				
			}, {
				key : 'dsnDrctDt', align:'center',
				title : '이설요청일',
				width: '100'				
			}, {
				key : 'type1', align:'center',
				title : '구분1',
				width: '80'				
			}, {
				key : 'type2', align:'center',
				title : '구분2',
				width: '80'				
			}, {
				key : 'type3', align:'center',
				title : '구분3',
				width: '80'
			}, {
				key : 'simplCstrYn', align:'center',
				title : '현장조치유무',
				width: '100'
			}, {
				key : 'opCstrSfbdRateDivCd', align:'center',
				title : '원인자유무',
				width: '100'
			}, {
				key : 'efdgSubmDt', align:'center',
				title : '제출일',
				width: '100'				
			}, {
				key : 'efdgAppvDt', align:'center',
				title : '구축팀승인일',
				width: '100'				
			}, {
				key : 'engdnCoptAprvDt', align:'center',
				title : 'ENG검토일',
				width: '100'				
			}, {
				key : 'engdnCoptRsn', align:'center',
				title : '검토의견',
				width: '100'				
			}, {
				key : 'wkrtDt', align:'center',
				title : '최초등록일',
				width: '100'				
			}, {
				key : 'lastWorkAprvDtm', align:'center',
				title : '최종승인일',
				width: '100'				
			}, {
				key : 'workLastFnshDt', align:'center',
				title : '최종완료일',
				width: '100'				
			}, {
				key : 'engdnWorkNum', align:'center',
				title : '작업등록건수',
				width: '100'				
			}, {
				key : 'otdrOfceRegCnt', align:'center',
				title : 'Office',
				width: '100'				
			}, {
				key : 'otdrMblRegCnt', align:'center',
				title : 'Mobile',
				width: '100'				
			}, {
				key : 'fildOpenDt', align:'center',
				title : '현장개통일',
				width: '100'				
			}, {
				key : 'cmplOpenDt', align:'center',
				title : '준공예정일',
				width: '100'				
			}, {
				key : 'gisSubmDt', align:'center',
				title : 'GIS 최종 제출일',
				width: '100'				
			}, {
				key : 'smrtSubmRgcpyLastDt', align:'center',
				title : '등록사 최종 제출일',
				width: '100'				
			}, {
				key : 'smrtSubmTmotDay09DayCnt', align:'center',
				title : 'TIMER(9일 초과 제출불가) ※ 산식 : 등록사 최종제출일-준공예정일',
				width: '400'				
			}, {
				key : 'smrtSubmOptrTnovDt', align:'center',
				title : '운용자(ONS) 인수일',
				width: '120'				
			}, {
				key : 'smrtSubmOptrRjctDt', align:'center',
				title : '운용자(ONS) 반려일',
				width: '120'				
			}, {
				key : 'smrtSubmAfAprvSmlDowCnt', align:'center',
				title : 'Timer(11일 초과 Bypass) ※ 산식 : 운용자인계일-등록사최종제출일',
				width: '400'				
			}, {
				key : 'gisWoYn', align:'center',
				title : 'GIS SKIP 유무',
				width: '100'				
			}, {
				key : 'setlReqDt', align:'center',
				title : '제출일',
				width: '100'				
			}, {
				key : 'setlRvDt', align:'center',
				title : '검토일',
				width: '100'				
			}, {
				key : 'setlAprvDt', align:'center',
				title : '승인일',
				width: '100'				
			}, {
				key : 'operTeamTnovAprvDt', align:'center',
				title : '승인일',
				width: '100'				
			}, {
				key : 'setlAfOperAprvSmlDowCnt', align:'center',
				title : 'Timer(5일 초과 Bypass) ※ 산식 : 운용팀인수인계 승인일-정산서 승인일',
				width: '400'				
			}, {
				key : 'efdgNwCblApilDistk', align:'center',
				title : '가공(m)',
				width: '100'				
			}, {
				key : 'efdgNwCblGrdDistk', align:'center',
				title : '지중(m)',
				width: '100'				
			}, {
				key : 'efdgNwCdlnDistk', align:'center',
				title : '거리(m)',
				width: '100'				
			}, {
				key : 'efdgNwCdlnTakeMmth', align:'center',
				title : '인,수공 수량',
				width: '100'				
			}, {
				key : 'efdgMatlCost', align:'center',
				title : '자재비',
				width: '100'				
			}, {
				key : 'efdgCstrCost', align:'center',
				title : '공사비',
				width: '100'				
			}, {
				key : 'efdgSumrAmt', align:'center',
				title : '계',
				width: '100'				
			}, {
				key : 'setlNwCblArilDistk', align:'center',
				title : '가공(m)',
				width: '100'				
			}, {
				key : 'setlNwCblGrdDistk', align:'center',
				title : '지중(m)',
				width: '100'				
			}, {
				key : 'gisCblSubmDistm', align:'center',
				title : 'GIS 제출거리(m)',
				width: '100'				
			}, {
				key : 'setlNwCdlnDistk', align:'center',
				title : '거리(m)',
				width: '100'				
			}, {
				key : 'setlNwCdlnTakeMmth', align:'center',
				title : '인,수공 수량(m)',
				width: '100'				
			}, {
				key : 'gisCdlnSubmDistm', align:'center',
				title : 'GIS 제출거리(m)',
				width: '100'				
			}, {
				key : 'setlMatlCost', align:'center',
				title : '자재비',
				width: '100'				
			}, {
				key : 'setlCstrCost', align:'center',
				title : '공사비(투자)',
				width: '100'				
			}, {
				key : 'setlLborCost', align:'center',
				title : '공사비(비용)',
				width: '100'				
			}, {
				key : 'setlSumrAmt', align:'center',
				title : '계',
				width: '100'				
			}, {
				key : 'setlEfdgGapAmt', align:'center',
				title : 'Gap(정산금액-실시설계금액)',
				width: '100'				
			}, {
				key : 'suplDrctDt', align:'center',
				title : '납품지시일-투자',
				width: '100'				
			}, {
				key : 'suplDrctNo', align:'center',
				title : '납품지시일-투자(Nits)',
				width: '100'				
			}, {
				key : 'open2uSuplDrctNo', align:'center',
				title : '납품지시일-투자(Open2U)',
				width: '100'				
			}, {
				key : 'erpBdgtDtlCd', align:'center',
				title : 'I/O-투자(Open2U)',
				width: '100'				
			}, {
				key : 'invtBdgtNm', align:'center',
				title : '투자예산명(Open2U)',
				width: '100'				
			}, {
				key : 'cstSuplDrctDt', align:'center',
				title : '납품지시일-비용',
				width: '100'				
			}, {
				key : 'cstSuplDrctNo', align:'center',
				title : '납품지시번호-비용(Nits)',
				width: '100'				
			}, {
				key : 'cstOpen2uSuplDrctNo', align:'center',
				title : '납품지시번호-비용(Open2U)',
				width: '100'				
			}, {
				key : 'invtBizAprvCd', align:'center',
				title : 'I/O-비용(Open2U)',
				width: '100'				
			}, {
				key : 'cstInvtBdgtNm', align:'center',
				title : '비용예산명(Open2U)',
				width: '100'				
			}, {
				key : 'lesRqsDt', align:'center',
				title : '임차신청일',
				width: '100'				
			}, {
				key : 'bgcscRqsDt', align:'center',
				title : '착공신청일',
				width: '100'				
			}, {
				key : 'cmplRqsDt', align:'center',
				title : '준공신청일',
				width: '100'				
			}, {
				key : 'newAprvRqsNum', align:'center',
				title : '신설본수',
				width: '100'				
			}, {
				key : 'exstAprvRqsNum', align:'center',
				title : '기설본수',
				width: '100'				
			}, {
				key : 'totAprvRqsNum', align:'center',
				title : '승인본수',
				width: '100'				
			}, {
				key : 'napvRqsNum', align:'center',
				title : '불가본수',
				width: '100'				
			}, {
				key : 'kepcoAprvNo', align:'center',
				title : '한전승인번호',
				width: '100'				
			}, {
				key : 'adjtSetlAmt', align:'center',
				title : '금액',
				width: '100'				
			}, {
				key : 'adjtSetlCstrCd', align:'center',
				title : '공사번호',
				width: '100'				
			}, {
				key : 'adjtSetlCstrNm', align:'center',
				title : '공사명',
				width: '100'				
			}, {
				key : 'adjtSetlSuplDrctNo', align:'center',
				title : '납품지시번호',
				width: '100'				
			}, {
				key : 'adjtSetlSuplDrctDt', align:'center',
				title : '납품지시일',
				width: '100'				
			}, {
				key : 'lcenRqsYn', align:'center',
				title : '인허가 신청여부',
				width: '100'				
			}, {
				key : 'lcenAprvYn', align:'center',
				title : '인허가 승인여부',
				width: '100'				
			}, {
				key : 'ipTlplNwQuty', align:'center',
				title : 'IP주 수량',
				width: '100'				
			}, {
				key : 'smrtDsnObjYn', align:'center',
				title : 'SMART 설계 대상',
				width: '100'				
			}],
			
			message: {
				nodata: '<div style="text-align:center;">조회된 결과가 없습니다.</div>'
			}
        });
        
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
    	
    	m.button.btnExcel.on('click', function (){
    		if (0 == m.grid.gridObject.alopexGrid('pageInfo').pageDataLength) {
    			alert('데이터가 존재하지 않습니다.');
    			return;
    		}
    		exportExcel();
    	});
    	
    	m.button.btnRefresh.on('click', function (){
    		location.reload();
    	});
    }
	
    //엑셀다운로드
    var exportExcel = function () {
    	var worker = new ExcelWorker({
    		excelFileName: '운용성공사 공정상세_접수단위_'+m.date(0,0),
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: '운용성공사',
    			$grid: m.grid.gridObject
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
    }
    
	//request 성공시
    var successCallback = function (response,stats,xhr,flag){
    	if ('getList' == flag) {
    		m.grid.gridObject.alopexGrid('hideProgress');
        	var data = response.dataList;
        	m.grid.gridObject.alopexGrid('dataSet', data);
    	}
    }
    
    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }
    
    //코드 로딩 후
    var setSelectByCodeCallBack = function (response) {
    	if ('dsnBpChrrHdofcOrgId' == response) {
    		if ('A' == loginDeptType) {
        		$.each($('select[name=dsnBpChrrHdofcOrgId] option'), function (){
        			if (loginDept == this.value) {
        				$(this).attr('selected','selected');
        			}
        		});
        		
        		$('select[name=dsnBpChrrHdofcOrgId]').next().text($('#dsnBpChrrHdofcOrgId option:selected').text());
        		$('select[name=dsnBpChrrHdofcOrgId]').attr('disabled',true);
        	}
        	
        	var gkmDept = $('input[name=gkmDept]').val();
        	
        	//메인화면에서 화면전환된 경우 설계(BP)본부 세팅
        	if (0 != gkmDept.length) {
        		$.each($('select[name=dsnBpChrrHdofcOrgId] option'), function (){
        			if (gkmDept == this.value) {
        				$(this).attr('selected','selected');
        			}
        		});
        		$('select[name=dsnBpChrrHdofcOrgId]').next().text($('#dsnBpChrrHdofcOrgId option:selected').text());
        		$('select[name=dsnBpChrrHdofcOrgId]').attr('disabled',true);
        		
        		//조회
        		setGrid();
        	}
    	}
    }
    
    //그리드에 추가
    var setDataCallback = function (response) {
    	var data = response;
    	$('input[name=cnstnVndrId]').val(data.bpId);
    	$('input[name=cnstnVndrNm]').val(data.bpNm);
    }
    
    //사업목적, 사업구분 선택
    var setSelectByBizCallBack = function (id){
    	if ('afeYr' == id) {
    		//조건 추가위해 언바인딩 후 재 바인딩
    		$('select[name=afeYr]').unbind('change');
    		$('select[name=afeYr]').bind('change',function() {
    			var afeYr = $('select[name=afeYr] option:selected').val();
    			
    			if ('2012' == afeYr) {
    				$('select[name=uprDemdBizDivCd]').attr('disabled',true);
    				//2012 콤보박스 재설정 필요함
    				//공통코드 BSTY, 현재 없음
    				//임시
    				setBizDivCd('2012', 'PURP', 'ROOT', setSelectByBizCallBack);
    			} else if ('2011' == afeYr || (parseInt(afeYr) > m.date(0,2))) {
    				$('select[name=uprDemdBizDivCd]').attr('disabled',true);
    				$('select[name=lowDemdBizDivCd]').attr('disabled',true);
    				alert('데이터가 존재하지 않는 사업년도 입니다.');
    				return;
    			} else {
    				setBizDivCd($(this).val(), 'PURP', 'ROOT', setSelectByBizCallBack);
    			}
    		});
    	}
    	
    	if ('uprDemdBizDivCd' == id) {
    		if ('' == $('select[name=uprDemdBizDivCd]').val()) {
    			$('select[name=uprDemdBizDivCd] option').eq(1).attr('selected','selected');
    			$('select[name=uprDemdBizDivCd]').next().text($('select[name=uprDemdBizDivCd] option').eq(1).text());
    			$('select[name=uprDemdBizDivCd]').change();
    		}
    	}
    	
    	if ('lowDemdBizDivCd' == id) {
    		$('select[name=lowDemdBizDivCd] option').eq(1).attr('selected','selected');
    		$('select[name=lowDemdBizDivCd]').next().text($('select[name=lowDemdBizDivCd] option').eq(1).text());
    	}
    }
    
    //데이터 조회
    var setGrid = function () {
    	var param =  m.form.formObject.getData();
    	
    	//grid 조회
    	if ('' == param.engdnIsueAprvDtFrom) {
			alert('ENG 발행 시작일이 없습니다.');
			return;
		}
		
		if ('' == param.engdnIsueAprvDtTo) {
			alert('ENG 발행 종료일이 없습니다.');
			return;
		}
		
		if (param.engdnIsueAprvDtFrom > param.engdnIsueAprvDtTo) {
			alert('ENG 발행 종료일이 시작일보다 빠를 수 없습니다.');
			return;
		}
		
		if ('' == param.engdnRegDtFrom) {
			alert('ENG 등록 시작일이 없습니다.');
			return;
		}
		
		if ('' == param.engdnRegDtTo) {
			alert('ENG 등록 종료일이 없습니다.');
			return;
		}
		
		if (param.engdnRegDtFrom > param.engdnRegDtTo) {
			alert('ENG 등록 종료일이 시작일보다 빠를 수 없습니다.');
			return;
		}
		
    	model.get({
    		url  : m.api.url,
    		data : param,
    		flag : m.flag.getList
    	}).done(successCallback)
		.fail(failCallback);
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
});