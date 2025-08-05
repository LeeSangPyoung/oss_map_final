/**
 * GisEquipmentDivideDetailsConfirm.js
 *
 * @author P096293
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('input[name=cstrCd]').val(parent.baseInform.hiddenCstrCd.value);
    	initGrid();
    	setGrid();
        setEventListener();
    };
    
  //Grid 초기화
    var initGrid = function () {
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	headerGroup: [{fromIndex:1, toIndex:5, title:msgArray['settlementOfAccountsPoleOrderDts']},
        	              {fromIndex:6, toIndex:13, title:'GIS'+msgArray['poleOrderDts']}],
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},
    		
    		columnMapping: [{
    			key : 'gubun', align:'center',
				title : msgArray['accordYesOrNo'],
				width: '70px'
    		}/*, {
				key : 'svlnNo', align:'center',
				title : msgArray['workDirectionLineNo'],
				width: '100px'
			}*//*, {
				key : 'pcNm', align:'center',
				title : msgArray['pieceSection'],
				width: '70px'
			}*/, {
				key : 'pceSrno', align:'center',
				title : msgArray['sectionNumber'],
				width: '70px'
			}, {
				key : 'kepboNm', align:'center',
				title : msgArray['koreaElectricPowerCorporationBranch'],
				width: '70px'
			}, {
				key : 'drawAddrNm', align:'center',
				title : msgArray['drawingNumber'],
				width: '70px'
			}, {
				key : 'cpznNoNm', align:'center',
				title : msgArray['informationTechnologyNumber'],
				width: '70px'
			}, {
				key : 'fcltIstnFrmCd', align:'center',
				title : msgArray['facility'],
				width: '70px'
			}, {
				key : 'sapnPceSctnNm', align:'center',
				title : 'GIS '+msgArray['pieceSection'],
				width: '80px'
			}, {
				key : 'mPceSrno', align:'center',
				title : msgArray['sectionNumber'],
				width: '70px'
			}, {
				key : 'mKepcbNm', align:'center',
				title : msgArray['koreaElectricPowerCorporationBranch'],
				width: '70px'
			}, {
				key : 'mDrawNoVal', align:'center',
				title : msgArray['drawingNumber'],
				width: '70px'
			}, {
				key : 'mCpznNoNm', align:'center',
				title : msgArray['informationTechnologyNumber'],
				width: '70px'
			}, {
				key : 'mFcltIstnFrmCd', align:'center',
				title : msgArray['facilityDivision'],
				width: '70px'
			}],
			
			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
        });
    };
    
    var setEventListener = function () {
	};
	
	//request 성공시
    var successCallback = function (response, status, xhr,  flag){
    	
    	var data = response.dataList;
    	console.log(data);
    	$('#'+gridId).alopexGrid('hideProgress');
    	$('#dataGrid').alopexGrid('dataSet', data);
    }
    
    //request 실패시.
    var failCallback = function (response, flag){
    	callMsgBox('returnMessage','W', response , btnMsgCallback);
    }
    
    //데이터 조회
    var setGrid = function (page, rowPerPage) {
    	var param =  $("form[name=searchForm]").getData();
    	 
    	// 공동투자-참여사시 cstrCd 대체 2017.08.25 추가
		console.log("subTabs3 : ");
		console.log(param.cstrCd);
		console.log(parent.$('#jintInvtOnrCstrCd').val());
		if($.TcpUtils.isNotEmpty(parent.$('#jintInvtOnrCstrCd').val())){
				param.cstrCd = parent.$('#jintInvtOnrCstrCd').val();
				param.skAfcoDivCd = parent.$('#jintInvtOnrCstrCd').val().substring(0,1);
		} 
		console.log(param.cstrCd);
    	
    	
    	var url = "tango-transmission-biz/transmission/constructprocess/accounts/gisEquipmentDivideDetailsConfirm";
    	
    	$('#'+gridId).alopexGrid('showProgress');
		 
    	Tango.ajax({
    		url : url, //URL 기존 처럼 사용하시면 됩니다.
    		data : param, //data가 존재할 경우 주입
    		method : 'GET' //HTTP Method
    	}).done(successCallback) //success callback function 정의
    		.fail(failCallback); //fail callback function 정의
    }
});