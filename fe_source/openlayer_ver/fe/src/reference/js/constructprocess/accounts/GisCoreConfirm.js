/**
 * GisCoreConfirm.js
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
        	headerGroup: [{fromIndex:0, toIndex:3, title:msgArray['settlementOfAccountsDetails']}
    		,{fromIndex:4, toIndex:6, title:msgArray['startPiece']+msgArray['section']}
    		,{fromIndex:7, toIndex:9, title:msgArray['endSection']}
    		,{fromIndex:11, toIndex:14, title:'Core '+msgArray['acceptDetails']}],
    		autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting: true
			},

    		columnMapping: [{
    			key : 'compType', align:'center',
				title : msgArray['accordYesOrNo'],
				width: '70px'
    		}, {
				key : 'svlnNo', align:'center',
				title : msgArray['lineNo'],
				width: '100px'
			}, {
				key : 'workDocNo', align:'center',
				title : msgArray['workDirectionNumber'],
				width: '70px'
			}, {
				key : 'wrwlsQuty', align:'center',
				title : msgArray['laborQuantity'],
				width: '70px'
			}, {
				key : 'startPiece', align:'center',
				title : msgArray['startPiece'],
				width: '70px'
			}, {
				key : 'staPceIdntVal', align:'center',
				title : msgArray['direction'],
				width: '70px'
			}, {
				key : 'staPceLnNo', align:'center',
				title : 'Core',
				width: '70px'
			}, {
				key : 'endPiece', align:'center',
				title : msgArray['endPiece'],
				width: '70px'
			}, {
				key : 'endPceIdntVal', align:'center',
				title : msgArray['direction'],
				width: '80px'
			}, {
				key : 'endPceLnNo', align:'center',
				title : 'Core',
				width: '70px'
			}, {
				key : 'grenCoreNm', align:'center',
				title : msgArray['greenCore'],
				width: '70px'
			}, {
				key : 'useTypNM', align:'center',
				title : msgArray['useDivision'],
				width: '70px'
			}, {
				key : 'ringCd', align:'center',
				title : msgArray['ringCode'],
				width: '70px'
			}, {
				key : 'ringNm', align:'center',
				title : msgArray['ringName'],
				width: '70px'
			}, {
				key : 'useCtt', align:'center',
				title : msgArray['use']+msgArray['dts'],
				width: '70px'
			}],

			message: {
				nodata: '<div class="no_data" style="text-align:center;"><i class="fa fa-exclamation-triangle"></i> '+msgArray['noInquiryData']+'</div>'
			}
        });

        //gridHide();

    };

    var setEventListener = function () {
	};

	//request 성공시
    var successCallback = function (response, status, xhr,  flag){
    	var data = response.dataList;
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
		console.log("subTabs4 : ");
		console.log(param.cstrCd);
		console.log(parent.$('#jintInvtOnrCstrCd').val());
		if($.TcpUtils.isNotEmpty(parent.$('#jintInvtOnrCstrCd').val())){
				param.cstrCd = parent.$('#jintInvtOnrCstrCd').val();
				param.skAfcoDivCd = parent.$('#jintInvtOnrCstrCd').val().substring(0,1);
		}
		console.log(param.cstrCd);
    	
    	var url = "tango-transmission-biz/transmission/constructprocess/accounts/gisCoreConfirm";

    	$('#'+gridId).alopexGrid('showProgress');

    	model.get({url : url,data : param}).done(successCallback).fail(failCallback);
    }

    var model = Tango.ajax.init({});
});