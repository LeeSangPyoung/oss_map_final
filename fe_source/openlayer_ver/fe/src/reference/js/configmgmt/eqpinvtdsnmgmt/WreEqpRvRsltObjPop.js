/**
 * WreEqpRvRsltObjPop.js
 *
 * @author P182022
 * @date 2022. 08. 23. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
	var gridModel 		= null;
	var gridData1 		= 'gridData1';
	var gridData2 		= 'gridData2';

	var mRvClickIndex 	= '';
	var mRsltClickIndex	= '';

	var mFrstExt		= true;

	var mPopType		= '';
	var mRunDivCd		= '';

	//BPM 서비스명,장비방식 멀티
	var mDemdSvrNm		= [];
	var mEqpMeans		= [];
	var mBtmShParam		= [];
	var mBizPurpCmb1	= [];
	var mDemdEqpCmb		= [];
	var mEqpDivCmb		= [];

	// 설계로직 정보
	var mGrdLgcData		= [];

	var mGrdDsnDivCmb	= [];
	var mSplyVndrCmb	= [];
	var mBizDivCmb1		= [];
	var mBizDivCmb2		= [];
	var mAfeYrSel		= '';
	var mAfeDemdDgrSel	= '';
	var mHdofcCdSel		= '';
	var mAreaIdSel		= '';

	var mHdofcCmb 		= [];

	var mAreaId_1 		= [{value : 'T11001', text : '수도권'}];
	var mAreaId_2 		= [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var mAreaId_3 		= [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var mAreaId_4 		= [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];

	var mDsnWoYnCmb1	= [{value : 'N', text : 'NO'},{value : 'Y', text : 'YES'}];
	var mDsnRsltYn 		=  [{value: "Y",text: "반영"}, {value: "N",text: "미반영"}];

    this.init = function(id, param) {
		mAfeYrSel		= param.afeYr;
		mAfeDemdDgrSel	= param.afeDemdDgr;
		mHdofcCdSel		= param.hdofcCd;
		mAreaIdSel		= param.areaId;
		mRunDivCd		= param.runDivCd;

    	setRespParamData(param);

    	setEventListener();
    	initGrid();

    	setSelectCode();

    	// 설계로직 조회
    	searchDsnLgcData();

    };

    // 부모로부터 넘어온 값 체크
    function setRespParamData(data) {
    	mPopType 	= data.popType;
    	$("#span_header").text("수요검토 연동 조건");
 		$("#eqpDivCd1").attr("disabled", true);
 		$("#eqpDivCd1").addClass("Disabled");
 		$("#divEqpSelect").css('background','#f2f2f2');

    }

    function setEventListener() {
    	// 취소
		$('#btnPopCncl').on('click', function(e) {
			$a.close();
		});

        // 수요검토 검색
    	$("#btnRsltSerch").on("click", function(e) {
    		searchRsltData();
    	});

    	//국사명 엔터키로 조회
        $('#demdMtsoNm4').on('keydown', function(e){
    		if (e.which == 13  ){
    			searchRsltData();
      		}
    	 });
    	//검토자 엔터키로 조회
        $('#rvUserNm4').on('keydown', function(e){
    		if (e.which == 13  ){
    			searchRsltData();
      		}
    	 });

    	// 적용
    	$("#btnAply").on("click", function(e) {
    		mGrdLgcData = getSelLgcData();

    		// 수요검토 대상 적용
   	   		aplyDemdRvObjData();
    	});

        //AFE 차수
    	$("#afeYr1").on("change", function(e) {
    		var areaYear = $("#afeYr1").val();
        	if(areaYear == ''){
        		$("#afeDemdDgr1").empty();
    			$("#afeDemdDgr1").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr1").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};

	        	selectAfeDemdDgrCode('afeDemdDgr1', dataParam);
        	}

        	initBizDivCode('bizDivCd1');
        	selectBizPurpCode('bizPurpCd1', areaYear);
    	});

        //AFE 년도
    	$("#afeYr4").on("change", function(e) {
    		var areaYear = $("#afeYr4").val();
        	if(areaYear == ''){
        		$("#afeDemdDgr4").empty();
    			$("#afeDemdDgr4").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr4").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};

	        	selectAfeDemdDgrCode('afeDemdDgr4', dataParam);
        	}

        	$("#afeYr1").setSelected(areaYear);
        	initBizDivCode('bizDivCd4');
        	selectBizPurpCode('bizPurpCd4', areaYear);
    	});

        //AFE 차수
    	$("#afeDemdDgr4").on("change", function(e) {
    		var afeDemdDgr = $("#afeDemdDgr4").val();
    		$("#afeDemdDgr1").setSelected(afeDemdDgr);
    	});

    	// 본부코드 선택
    	$("#hdofcCd4").on("change", function(e) {
			var supCd = $("#hdofcCd4").val();
			selectAreaCode("areaId4", supCd);

    	});

    	// 설계대상 선택
    	$("#eqpDivCd4").on("change", function(e) {
    		var option_data =  grdEqpRoleDivCd(this.value);

    		$('#demdEqpCd4').setData({data:option_data});
    		$('#eqpDivCd1').setSelected($("#eqpDivCd4").val());

    		// 설계로직 데이터 조회
    		//searchDsnLgcData();
    	});

    	// 설계대상 조건
    	$("#eqpDivCd1").on("change", function(e) {
    		// 설계로직 데이터 조회
    		searchDsnLgcData();
    	});

    	// 사업목적코드 선택
    	$("#bizPurpCd1").on("change", function(e) {
			selectBizDivCode("bizPurpCd1","bizDivCd1");

    	});
    	// 사업목적코드 선택
    	$("#bizPurpCd4").on("change", function(e) {
			selectBizDivCode("bizPurpCd4","bizDivCd4");

    	});
    	$('#'+gridData2).on('change','.headercell input', function(e) {
    		var checked = $(e.target).is(':checked') ? 'T' : 'F';
    		$("#rsltCheckCd").val(checked);
    	});

    	$('#'+gridData2).on('gridScroll', function(e){
    		var checked = $("#rsltCheckCd").val();
    		if(checked == "T"){
    			var rowData = $('#'+gridData2).alopexGrid('dataGet');
    			$('#'+gridData2).alopexGrid('rowSelect', rowData, true);

 				for(var i = 0 ; i < rowData.length; i++){
					for(var j=0; j < mRsltClickIndex.length ; j++){
						if(rowData[i]._index.row == mRsltClickIndex[j]._index.row){
							$('#'+gridData2).alopexGrid('rowSelect', rowData[i], false);
						}
    				}
 				}
			}
    	});

 	}

    function setSelectCode() {
    	//AFE 연차
    	selectAfeYrCode('afeYr1');
    	selectAfeYrCode('afeYr4');

    	//본부코드
    	selectHdofcCode('hdofcCd1');
    	selectHdofcCode('hdofcCd4');

    	selectSplyVndrCode('splyVndrCd');

    	//사업구분
    	initBizDivCode('bizDivCd1');
    	initBizDivCode('bizDivCd4');

    	//설계대상코드&수요장비&Vendor
    	selectEqpDivCode('eqpDivCd');
    	selectEqpDivCode('eqpDivCd1');
    	selectDemdEqpCode('demdEqpCd4');

		var option_data = [{cd: '', cdNm: '전체'}];
		//지역코드
		$('#areaId1').setData({ data : option_data, option_selected: '' });
		$('#areaId4').setData({ data : option_data, option_selected: '' });

		// 확정여부
		var option_data3 = [{cd: '', cdNm: '선택'},{cd: 'Y', cdNm: '유지'},{cd: 'N', cdNm: '삭제'}];
		$('#dataMntnYn').setData({ data : option_data3, dataMntnYn: 'Y' });

		// 확정여부
		var option_data = [{cd: '', cdNm: '전체'},{cd: 'N', cdNm: '미확정'},{cd: 'Y', cdNm: '확정'}];
		$('#crrtFixYn4').setData({ data : option_data, option_selected: '' });

	}

	//사업구분코드 초기화
    function initBizDivCode(objId) {
		var param = [{cd: '', cdNm: '전체'}];

		if(objId == 'bizDivCd1'){
			param = [{cd: "",cdNm: "선택"}];
		}

    	$("#"+objId).setData({ data : param, option_selected: '' });
    }

    // AFE 년차
    function selectAfeYrCode(objId) {
    	var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', param, 'GET', objId);
	}

    // AFE 수요회차
    function selectAfeDemdDgrCode(objId, param) {

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeDemdDgrlist', param, 'GET', objId);
	}

    // 본부코드
    function selectHdofcCode(objId) {
		var param = {};//C00623

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getHdofcCode', param, 'GET', objId);
	}

    // 지역코드
    function selectAreaCode(objId, supCd) {
		var param = { supCd : supCd };

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAreaCode', param, 'GET', objId);
	}

    // 사업목적코드
    function selectBizPurpCode(objId, afeYr) {
		var param = { afeYr : afeYr };

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getBizPurpCode', param, 'GET', objId);
    }

    // 설계대상코드
    function selectEqpDivCode(objId) {

		var param = {};

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', param, 'GET', objId);
    }

    // 수요장비
    function selectDemdEqpCode(objId) {

		var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnEqpCode', param, 'GET', objId);
    }

    // Vendor
    function selectSplyVndrCode(objId) {

		var param = {};

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getSplyVndrCode', param, 'GET', objId);
    }

    // 사업구분코드
    function selectBizDivCode(objId1, objId2) {
		$('#'+objId2).clear();

		var bizPurpCd = $("#"+objId1).val();
    	var divCdList = [];

    	if(objId2 == 'bizDivCd1'){
    		divCdList = mBizDivCmb1[bizPurpCd];
    	}else{
    		divCdList = mBizDivCmb2[bizPurpCd];
    	}

		var option_data =  [{cd: "", cdNm: "전체"}];
		if(objId2 == 'bizDivCd1'){
			option_data = [{cd: "",cdNm: "선택"}];
		}

		if( divCdList != undefined && divCdList != null ){
			for(var i=0; i<divCdList.length; i++){
				var resObj 		= {cd: divCdList[i].cd, cdNm: divCdList[i].cdNm};

				option_data.push(resObj);
			}
		}

		$('#'+objId2).setData({data:option_data});
    }

    // 설계로직 조회
    function searchDsnLgcData() {
    	var param 			= getTopParamData();

    	$('#'+gridData1).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getDsnDivCdMgmtForPage', param, 'GET', 'topSearch');
    }

    // 수요검토 대상 조회
    function searchRsltData() {
    	var param 		= getExtParamData();

		if($.TcpMsg.isEmpty(param.afeYr)){
			callMsgBox('btnMsgWarning','I', "년도를 선택해 주십시오.");
			return false;
		}
		if($.TcpMsg.isEmpty(param.afeDemdDgr)){
			callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
			return false;
		}
		if($.TcpMsg.isEmpty(param.eqpDivCd)){
			callMsgBox('btnMsgWarning','I', "설계대상을 선택해 주십시오.");
			return false;
		}

  		gridModel.get({
    		data: param,
    	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'extSearch');})
    	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'extSearch');});
    }

    // 조회용 파라메터 셋팅
    function getTopParamData(){
    	var param = {};
    	param.runDivCd			= mRunDivCd;
		param.afeYr				= $("#afeYr1").val();
		param.afeDemdDgr		= $("#afeDemdDgr1").val();
		param.dsnDivCd			= $("#eqpDivCd1").val();
		param.dataMntnYn		= $("#dataMntnYn").val();

    	return param;
    }


    // 설계결과 하단 그리드 조회 파라메터 셋팅
    function getExtParamData(){
    	var param = {
    	    	pageNo 		: 1,
    	    	rowPerPage 	: 50
    	};

    	param.afeYr 			= $("#afeYr4").val();
		param.afeDemdDgr 		= $("#afeDemdDgr4").val();
		param.hdofcCd 			= $("#hdofcCd4").val();
		param.areaId 			= $("#areaId4").val();
		param.demdBizDivCd		= $("#bizPurpCd4").val();
		param.lowDemdBizDivCd	= $("#bizDivCd4").val();
		param.crrtFixYn			= $("#crrtFixYn4").val();
		param.eqpDivCd 			= $("#eqpDivCd4").val();
		param.eqpRoleDivCd 		= $("#demdEqpCd4").val();
		param.demdMtsoNm		= $("#demdMtsoNm4").val();
		param.rvUserNm			= $("#rvUserNm4").val();
		param.delYn				= 'N';

    	return param;
    }

    // 수요검토 대상 적용
    function aplyDemdRvObjData() {
		var gridData = AlopexGrid.trimData($('#'+gridData2).alopexGrid('dataGet', { _state : { selected : true }}));

		if (gridData.length == 0) {// 선택한 데이터가 존재하지 않을 시
			callMsgBox('btnMsgWarning','W', configMsgArray['selectNoData'], btnMsgCallback);
			return;

		}else if(gridData.length > 0) {
			if(aplyLgcSrchWordChk()){
				callMsgBox('aplyReflctConfirm','C', '적용 하시겠습니까?', btnMsgCallback);
			}
		}
    }

    function aplyLgcSrchWordChk(){
    	var param 			= getTopParamData();

		if($.TcpMsg.isEmpty(param.afeYr)){
			callMsgBox('btnMsgWarning','I', "년도를 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.afeDemdDgr)){
			callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.dsnDivCd)){
			callMsgBox('btnMsgWarning','I', "설계대상을 선택해 주십시오.");
			return false;
		}

		if($.TcpMsg.isEmpty(param.dataMntnYn)){
			callMsgBox('btnMsgWarning','I', "자료 유지 여부를 선택해 주십시오.");
			return false;
		}

		return true;
    }

	// 버튼 콜백 funtion
	var btnMsgCallback = function (msgId, msgRst) {
		if ('aplyReflctConfirm' == msgId && 'Y' == msgRst) {

			var gridData = AlopexGrid.trimData($('#'+gridData2).alopexGrid('dataGet', function(data) {
				if (data._state.selected == true && data.dsnWoYn == "N") {
					return data;
				}
			}));

			if(gridData.length < 1){
				callMsgBox('btnMsgWarning','W', '반영할 데이터가 없습니다.', btnMsgCallback);
				return;
			}
			// 그리드 전체선택 여부
			var checked 		= $("#rsltCheckCd").val();
			var aplyParam		= [];
			// 하단로직 조건 데이터
			aplyParam 				= getTopParamData();

			if('F' == checked){
				aplyParam.aplyData	= gridData;
			}

			aplyParam.allInsType 	= checked;
			aplyParam.lgcData		= mGrdLgcData;

			// 상단수요대상 조건 데이터
			var extParam 					= getExtParamData();
	    	aplyParam.srchAfeYr 			= extParam.afeYr;
			aplyParam.srchAfeDemdDgr 		= extParam.afeDemdDgr;
			aplyParam.srchHdofcCd 			= extParam.hdofcCd;
			aplyParam.srchAreaId 			= extParam.areaId;
			aplyParam.srchDemdBizDivCd		= extParam.demdBizDivCd;
			aplyParam.srchLowDemdBizDivCd	= extParam.lowDemdBizDivCd;
			aplyParam.srchCrrtFixYn			= extParam.crrtFixYn;
			aplyParam.srchEqpDivCd 			= extParam.eqpDivCd;
			aplyParam.srchEqpRoleDivCd		= extParam.eqpRoleDivCd;
			aplyParam.srchDemdMtsoNm 		= extParam.demdMtsoNm;
			aplyParam.srchRvUserNm			= extParam.rvUserNm;

			//$('#'+gridData1).alopexGrid('showProgress');
			showProgressBody();
			httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/saveDemdRvMgmtList', aplyParam, 'POST', 'demdRvAply');
		}
	}

	// 선택된 로직그룹정보 가져오기
	function getSelLgcData(){
		var gridData = AlopexGrid.trimData($('#'+gridData1).alopexGrid('dataGet', function(data) {
			if (data._state.selected == true || data.mndtInsYn == "Y") {
				return data;
			}
		}));

		return gridData;
	}

	// 그리드 초기화
    function initGrid() {
		//
		$('#'+gridData1).alopexGrid({
			height : '5row',
	    	pager : false,
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			rowSingleSelect : false,
			rowClickSelect: false,
			rowOption : {
				allowSelect : function(data) {
					return (data.mndtInsYn != "Y")? true : false;
				},
				inlineStyle: function(data,rowOption){
    				if(data.mndtInsYn == 'Y') return {background:'#e2e2e2'}
    			}
			},
	    	columnMapping: [{
	    		key: 'check',
	    		align: 'center',
	    		width: '40px',
	    		selectorColumn : true,
	    	}, {
				key : 'execTurn', align:'center',
				title : '순서',
				width: '50px',
				editable: false
			}, {
				key : 'workGrpNm', align:'center',
				title : '로직 그룹',
				width: '120px',
				editable: false
			}, {
				key : 'condInfCtt', align:'center',
				title : '로직 정보',
				width: '120px',
				editable: false
			}, {
				key : 'optConnDesc', align:'center',
				title : '설계 옵션 설명',
				width: '200px',
				editable: false
			}, {
				key : 'dsnOptVal', align:'center',
				title : '설계 옵션 값',
				width: '120px',
				editable: true
			}, {
				key : 'dsnDivCd', align:'center',
				title : '설계로직구분코드',
				width: '100px',
				hidden : true
			}, {
				key : 'runDivCd', align:'center',
				title : '수행구분코드',
				width: '100px',
				hidden : true
			}, {
				key : 'basItmSeq', align:'center',
				title : '기본항목순번',
				width: '100px',
				hidden : true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

    	//////////////////////////////////////////////////////////////////////////////////////////////
    	// 수요검토 반영 대상
        var gridColumn = [{
    		key: 'check',
    		align: 'center',
    		width: '40px',
    		selectorColumn : true
    	}, {
			align:'center',
			title : '순번',
			width: '50px',
			resizing : false,
			//excludeFitWidth : true,
			numberingColumn: true
		}, {
			key : 'hdofcCd', align:'center', styleclass : 'font-blue', filter : {useRenderToFilter : true},
			title : '본부',
			width: '85px',
	    	render : { type: 'string',
	            rule: function (value, data){
	                var render_data = [{ value : '', text : '선택'}];
    				return render_data = render_data.concat( mHdofcCmb );
				}
			},
         	editable : { type: 'select',
         		rule: function(value, data) {
         			var editing_data = [{ value : '', text : '선택'}];
         			return editing_data = editing_data.concat( mHdofcCmb );
         		},
         		attr : {
	 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
	 			}
				},
			allowEdit : function(value,data,mapping) {
				return false;
			},
			editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
		}, {
			key : 'areaId', align:'center',
			title : '지사',
			width: '85px',
	    	render : { type: 'string',
            	rule: function (value,data){
                	var render_data = [{ value : '', text : '선택'}];
                	var currentData = AlopexGrid.currentData(data);
                	var areaCmb = grdAreaIdCmb(currentData.hdofcCd);

                	if(fnCmdExisTence(value, areaCmb)){
                		return render_data.concat( areaCmb );
                	}else{
                		data.areaId = '';
                		return render_data;
                	}
            	}
	    	},
	    	editable : {type : 'select',
				rule : function(value, data) {
					var editing_data = [{ value : '', text : '선택'}];
					var currentData = AlopexGrid.currentData(data);
                	var areaCmb = grdAreaIdCmb(currentData.hdofcCd);

                	return editing_data.concat( areaCmb );
				},
     			attr : {
     				style : "width: 98%;min-width:98%;padding: 1px 1px;"
     			}
			},
			allowEdit : function(value,data,mapping) {
				return false;
			},
			editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
			refreshBy : 'hdofcCd'
		}, {
			key : 'demdBizDivNm', align:'center',
			title : '사업목적',
			width: '130px',
			editable: false
		}, {
			key : 'lowDemdBizDivNm', align:'center',
			title : '사업구분',
			width: '180px',
			editable: false
		}, {
			key : 'eqpDivCd', align:'center',
			title : '설계대상',
			width: '100px',
	    	render : { type: 'string',
	            rule: function (value, data){
	                var render_data = [{ value : '', text : '선택'}];

                	if(fnCmdExisTence(value, mEqpDivCmb)){
                		return render_data.concat( mEqpDivCmb );
                	}else{
                		data.eqpDivCd = '';
                		return render_data;
                	}
				}
			},
         	editable : { type: 'select',
         		rule: function(value, data) {
         			var editing_data = [{ value : '', text : '선택'}];
         			return editing_data = editing_data.concat( mEqpDivCmb );
         		},
         		attr : {
	 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
	 			}
				},
			allowEdit : function(value,data,mapping) {
				return false;
			},
			editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
		}, {
			key : 'demdMtsoNm', align:'left',
			title : '수요국사',
			width: '180px',
			editable: false,
		}, {
			key : 'eqpRoleDivNm', align:'center',
			title : '장비',
			width: '100px',
			editable: false,
		}, {
			key : 'splyVndrNm', align:'center',
			title : '벤더',
			width: '115px',
			editable: false
		}, {
			key : 'splyVndrCd', align:'center',
			title : 'Vendor',
			width: '100px',
			hidden : true
		}, {
			key : 'demdEqpQuty', align:'center',
			title : '수량',
			width: '90px',
			editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 22}, styleclass : 'num_editing-in-grid'},
			allowEdit : function(value,data,mapping) {
					return false;
			}
		}, {
			key : 'dsnWoYn', align:'center',
			title : '설계제외',
			width: '80px',
			editable : false,
			hidden : true,
	    	render : { type: 'string',
	            rule: function (value, data){
	                var render_data = [{ value : '', text : '선택'}];
    				return render_data = render_data.concat( mDsnWoYnCmb1 );
				}
			},
			editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
		}, {
			key : 'dsnRsltYn', align:'center',
			title : '설계반영',
			width: '90px',
			editable : false,
	    	render : { type: 'string',
	            rule: function (value, data){
	                var render_data = [];
    				return render_data = render_data.concat( mDsnRsltYn );
				}
			},
			editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
		}, {
			key : 'regMeansNm', align:'center',
			title : '등록방식',
			width: '100px',
			editable : false
		}, {
			key : 'demdBizDivCd', align:'center',
			title : '사업목적',
			width: '130px',
			editable: false,
			hidden : true
		}, {
			key : 'lowDemdBizDivCd', align:'center',
			title : '사업구분',
			width: '180px',
			editable: false,
			hidden : true
		}, {
			key : 'eqpRoleDivCd', align:'center',
			title : '장비',
			width: '100px',
			editable: false,
			hidden : true
		}, {
			key : 'frstRegUserNm', align:'center',
			title : '등록자',
			width: '100px',
			editable : false,
			hidden : true
		}, {
			key : 'crrtFixDt', align:'center',
			title : '확정일',
			width: '150px',
			editable : false,
			hidden : true
		}, {
			key : 'mtsoTypCd', align:'center',
			title : '국사유형',
			width: '100px',
			editable : false,
			hidden : true,
	    	render : { type: 'string',
	            rule: function (value, data){
	                var render_data = [];
    				return render_data = render_data.concat( mMtsoType );
				}
			},
			editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
		}, {
			key : 'demdMtsoId', align:'center',
			title : '국사ID',
			width: '130px',
			hidden : true
		}, {
			key : 'lnkgMtsoId', align:'center',
			title : '국사ID',
			width: '130px',
			hidden : true
		}, {
			key : 'afeYr', align:'center',
			title : '년도',
			width: '50px',
			hidden : true
		}, {
			key : 'afeDemdDgr', align:'center',
			title : '차수',
			width: '50px',
			hidden : true
		}, {
			key : 'demdRvSeq', align:'center',
			title : '수요검토순번',
			width: '50px',
			hidden : true
		}, {
			key : 'flag', align:'center',
			title : '상태',
			width: '50px',
			hidden : true
		}];

        var vUrl = "tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getDemdRvObjForPage";
        var rowCnt = "5row";
        var grdColumnMap = gridColumn;
        var headerGroup = [{fromIndex:7, toIndex:14, title:'수요 정보'}];

      	gridModel = Tango.ajax.init({
          	url: vUrl
      		,data: {
      	        pageNo: 1,             // Page Number,
      	        rowPerPage: 500,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
      	    }
        });

      	// 그리드 설정
	    $('#'+gridData2).alopexGrid({
	    	height : rowCnt,
	    	paging: {
		     	   pagerTotal:true,
		     	   pagerSelect:false,
		     	   hidePageList:true
	    	},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			numberingColumnFromZero: false,
			leaveDeleted: true,
			headerGroup: headerGroup,
	    	columnMapping: grdColumnMap,
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			},
			ajax: {
		         model: gridModel                  // ajax option에 grid 연결할 model을지정
			        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
			}
	    });

    }

    // 콤보박스에 데이터 존재여부
    function fnCmdExisTence(value, data){
    	var result = false;

    	if( data == undefined || data == null || data == "") return result;

    	for( var i = 0; i < data.length; i++ ){
    		if(data[i].value == value){
    			result = true;
    		}
    	}

    	return result;
    }

    //request 호출
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    // 그리드 지역콤보 데이터 JSON
    function grdAreaIdCmb(value){
    	var returnDate = [];

    	switch(value){
		case "5100":
			returnDate =  mAreaId_1;
			break;
		case "5300":
			returnDate =  mAreaId_2;
			break;
		case "5500":
			returnDate =  mAreaId_3;
			break;
		case "5600":
			returnDate =  mAreaId_4;
			break;
    	}

    	return returnDate;
    }

	//request 성공시.
	function successCallback(response, status, jqxhr, flag){

		switch(flag){
			case "topSearch":
				$('#'+gridData1).alopexGrid('hideProgress');
				setSpGrid(gridData1, response, response.dataList);
				break;
			case 'demdRvAply':
				hideProgressBody();
				$('#'+gridData1).alopexGrid('hideProgress');
				if (response.returnCode == "200") {

					if (response.reqBasSeq !== "" && response.reqDgr !== "") {
							var paramInfo = {
								reqSeq : response.reqBasSeq,
								reqDgr : response.reqDgr,
								reqSystmClCd : "SKT"
							}
//							httpRequest(GLOBAL_GIS_TRACE_IP +'/tango-route-analysis-api/route/mass' , paramInfo, 'POST', 'massRoute');
							$.ajax({
								url: GLOBAL_GIS_TRACE_IP +'/tango-route-analysis-api/route/mass',
								contentType: 'application/json',
								method: 'POST',
//								async: false,
								data: JSON.stringify(paramInfo),
							}).done(function(response, status, jqxhr, flag) {
								console.log("mass response", response);

							}).fail(function(response, status) {
								callMsgBox('','W', 'Mass Simulation 요청이 실패되었습니다.', btnMsgCallback);
							});
					}

					callMsgBox('','I', '적용 되었습니다.('+response.returnTime+')',function(){
						$a.close("APLY");
					});
				} else {
					callMsgBox('','W', '적용이 실패되었습니다.', btnMsgCallback);
				}
				break;
			case 'afeYr1':
				$('#afeYr1').clear();
				var option_data =  [];
				var stdAfeYr = "";
				var paramAfeYr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeYrSel) {
						paramAfeYr = response[i].cd;
					}
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}
				if (paramAfeYr.length > 0) {
					selectId = paramAfeYr;
				}else {
					selectId = stdAfeYr;
				}
				$('#afeYr1').setData({data:option_data,afeYr:selectId});
				selectAfeDemdDgrCode('afeDemdDgr1', {afeYr:selectId});
				//사업목적코드
		    	selectBizPurpCode('bizPurpCd1',selectId);

				break;
			case 'afeYr4':
				$('#afeYr4').clear();
				var option_data =  [];
				var stdAfeYr = "";
				var paramAfeYr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeYrSel) {
						paramAfeYr = response[i].cd;
					}
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}
				if (paramAfeYr.length > 0) {
					selectId = paramAfeYr;
				}else {
					selectId = stdAfeYr;
				}
				$('#afeYr4').setData({data:option_data,afeYr:selectId});
				selectAfeDemdDgrCode('afeDemdDgr4', {afeYr:selectId});
				//사업목적코드
		    	selectBizPurpCode('bizPurpCd4',selectId);

				break;
			case 'afeDemdDgr1':
			case 'afeDemdDgr4':
				$('#'+flag).clear();

				var option_data =  [];
				var stdDemdDgr = "";
				var paramDemdDgr = "";
				var selectId = null;
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].cd == mAfeDemdDgrSel) {
						paramDemdDgr = response[i].cd;
					}
					if(response[i].stdAfeDivYn == 'Y'){
						stdDemdDgr = response[i].cd;
					}
				}
				if (paramDemdDgr.length > 0) {
					selectId = paramDemdDgr;
				}else {
					selectId = stdDemdDgr;
				}
				$('#'+flag).setData({data:option_data,afeDemdDgr:selectId});
				break;
			case 'bizPurpCd1':
			case 'bizPurpCd4':
				$('#'+flag).clear();
				var option_data =  [{cd: "", cdNm: "전체"}];
				if(flag == 'bizPurpCd1'){
					option_data = [{cd: "",cdNm: "선택"}];
				}

				for(var i=0; i<response.purpList.length; i++){
					var resObj 		= {cd: response.purpList[i].cd, cdNm: response.purpList[i].cdNm,
										value: response.purpList[i].cd, text: response.purpList[i].cdNm
									};

					option_data.push(resObj);
				}

				if(flag == 'bizPurpCd1'){
					mBizPurpCmb1 	= option_data;
					mBizDivCmb1		= response.divList;

				}else if(flag == 'bizPurpCd4'){
					mBizDivCmb2		= response.divList;
				}

				$('#'+flag).setData({data:option_data});
				break;
			case 'eqpDivCd':
				mEqpDivCmb = response.mainLgc;
				var grdSelectData 	=  [];
				var option_data 	=  [{cd: "", cdNm: "전체"}];
				for(var i=0; i<mEqpDivCmb.length; i++){
					option_data.push({cd: mEqpDivCmb[i].cd, cdNm: mEqpDivCmb[i].cdNm});

					var grdObj = {value: mEqpDivCmb[i].value, text: mEqpDivCmb[i].text};
					mGrdDsnDivCmb.push(grdObj);
				}
				$('#eqpDivCd4').setData({data:option_data});
				break;
			case 'eqpDivCd1':
				var dataCmb = response.mainLgc;
				var option_data 	=  [{cd: "", cdNm: "선택"}];

				for(var i=0; i<dataCmb.length; i++){
					option_data.push({cd: dataCmb[i].cd, cdNm: dataCmb[i].cdNm});
				}
				$('#eqpDivCd1').setData({data:option_data});
				break;
			case 'demdEqpCd4':
				mDemdEqpCmb = response.demdEqpList;
				var option_data =  [{cd: "", cdNm: "전체"}];
				$('#demdEqpCd4').setData({data:option_data});
				break;
			case 'splyVndrCd':
				var grdSelectData 	=  [];

				for(var i=0; i<response.length; i++){
					var grdObj 		= {value: response[i].cd, text: response[i].cdNm};

					grdSelectData.push(grdObj);
				}
				mSplyVndrCmb = grdSelectData;
				break;
			case 'hdofcCd1':
				for(var i=0; i<response.length; i++){
					var resObj 		= {value: response[i].cd, text: response[i].cdNm};

					mHdofcCmb.push(resObj);
				}
			case 'hdofcCd4':
			case 'areaId1':
			case 'areaId4':
				setSelectBoxData(flag, response);
				break;
			case 'tesDemdRvAply':
				hideProgressBody();
				$('#'+gridData1).alopexGrid('hideProgress');
				console.log("time:"+response.returnTime);
				console.log("response:"+response.response);

				break;
		}
    }

	// 선택박스 데이터 셋
	function setSelectBoxData(objId, response){
		$('#'+objId).clear();
		var option_data =  [{cd: "", cdNm: "전체"}];

		if(objId == 'hdofcCd1' || objId == 'areaId1'){
			option_data = [{cd: "",cdNm: "선택"}];
		}

		for(var i=0; i<response.length; i++){
			var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
			option_data.push(resObj);
		}

		$('#'+objId).setData({data:option_data});

		switch(objId){
		case 'hdofcCd1':
		case 'hdofcCd4':
			$('#'+objId).setSelected(mHdofcCdSel);
			break;
		case 'areaId1':
		case 'areaId4':
			$('#'+objId).setSelected(mAreaIdSel);
			break;
		}
	}

    //Grid에 Row출력
    function setSpGrid(GridID,Option,Data) {
    	$('#'+GridID).alopexGrid('dataSet', Data, '');

    	if(GridID == 'gridData1'){
    		$('#'+GridID).alopexGrid('rowSelect', {_state:{selected : false}}, true);
    	}
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "eqpSearch":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

    // 수요장비 데이터 JSON
    function grdEqpRoleDivCd(value){
    	var returnDate 	= [{cd: "", cdNm: "전체",value: "", text: "선택"}];
    	var divCdList	= mDemdEqpCmb[value];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj 		= {cd: divCdList[i].cd, cdNm: divCdList[i].cdNm, value: divCdList[i].cd, text: divCdList[i].cdNm};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    // 그리드 사업구분 데이터 JSON
    function grdLowDemdBizDivCd(value, gubun){
    	var returnDate 	= [];
    	var divCdList	= [];

    	divCdList = mBizDivCmb1[value];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj 		= {value: divCdList[i].cd, text: divCdList[i].cdNm};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    function showProgressBody(){
    	$('body').progress();
    };

    function hideProgressBody(){
    	$('body').progress().remove();
    };

});