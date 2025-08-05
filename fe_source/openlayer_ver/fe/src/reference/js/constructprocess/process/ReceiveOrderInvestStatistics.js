/**
 * ReceiveOrderInvestStatistics.js
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
				return '2013-01-01';
			}
			
			return optionYear;
		},
		api : {
			url : 'tango-transmission-biz/transmission/constructprocess/process/receiveOrderInvestStatistics'
		},
		flag : {
			getList   : 'getList'
		},
		button : {
			btnSearch : function (num){
				return 0 == num ? $('#btnSearch') : $('#btnBpSearch');
			},
			btnExcel : $('#btnExcel')
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
    	
    	//setGrid(0)
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
  	        			{fromIndex:4, toIndex:4, title:"실시설계"}, 
  	        			{fromIndex:5, toIndex:5, title:"작업"},
  	        			{fromIndex:8, toIndex:8, title:"Smart 인수인계"},
  	        			{fromIndex:9, toIndex:11, title:"기본설계(금액)"},
  	        			{fromIndex:12, toIndex:14, title:"실시설계(금액)"}
  	        ],  
    		columnMapping: [{
				key : 'engstNo', align:'center',
				title : 'Eng.sheet No.',
				width: '100'
			}, {
				key : 'cstrCd', align:'center',
				title : '공사코드',
				width: '100'
			}, {
				key : 'cnstnVndrNm', align:'center',
				title : '등록사',
				width: '100'
			}, {
				key : 'dsnDrctDt', align:'center',
				title : '등록업체배정일',
				width: '100'
			}, {
				key : 'efdgAprvDtm', align:'center',
				title : '구축팀승인일',
				width: '100'
			}, {
				key : 'workLastFnshDt', align:'center',
				title : '최종완료일',
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
				key : 'smrtSubmOptrTnovDt', align:'center',
				title : '운용자(ONS 인수일)',
				width: '150'
			}, {
				key : 'engdnMatlCost', align:'center',
				title : '자재비',
				width: '100'
			}, {
				key : 'engdnCstrCost', align:'center',
				title : '공사비',
				width: '100'
			}, {
				key : 'engdnSumrAmt', align:'center',
				title : '계',
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
    }
	
    //엑셀다운로드
    var exportExcel = function () {
    	var worker = new ExcelWorker({
    		excelFileName: '수주투자 통계_'+m.date(0,0),
    		palette : [{
    			className: 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},{
    			className: 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: '수주투자 통계',
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
    			
    			/*if ('2012' == afeYr) {
    				$('select[name=bizPurp]').attr('disabled',true);
    				//2012 콤보박스 재설정 필요함
    				//공통코드 BSTY, 현재 없음
    				//임시
    				setBizDivCd('2012', 'PURP', 'ROOT', setSelectByBizCallBack);
    			} else if ('2013' == afeYr) {
    				//2012 콤보박스 재설정 필요함
    				//공통코드 BSTY, 현재 없음
    				//임시 ASIS에는 BNSC , 스토리보드에는 BNSB로 조회하라고 구분되어짐
    				setBizDivCd('2013', 'BNSC', 'ROOT', setSelectByBizCallBack);
    			} else {
    				$('select[name=bizPurp]').attr('disabled',true);
    				$('select[name=bizNm]').attr('disabled',true);
    				alert('데이터가 존재하지 않는 사업년도 입니다.');
    				return;
    			}*/
    			
    			setBizDivCd($(this).val(), 'BNSB', 'ROOT', setSelectByBizCallBack);
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