/**
 * WreEqpRvRsltObjPop.js
 *
 * @author P182022
 * @date 2022. 08. 23. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
	var gridModel 		= null;

	var excelGrid 		= 'wreEqpRvRsltExcelGridData';
	var gridData 		= 'wreEqpRvRsltGridData';

	var mTagetGrid		= '';
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
//
	var mHdofcCmb 		= [];
//
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

    	setEventListener();
    	initGrid();

    	setSelectCode();

    	// 설계로직 조회
    	searchDsnLgcData();

    };


    function setEventListener() {
    	// 취소
		$('#btnPopCncl').on('click', function(e) {
			$a.close();
		});

//    	$("#btnUlad").click(function() {
//    		var fileObject = $('[data-id=uploadfile]').get(0).files;
//
//    		$('#'+excelGrid).alopexGrid('dataEmpty');
//			$('#'+excelGrid).alopexGrid('showProgress');
//			var $input = $(this);
//			var $grid = $('#'+excelGrid);
//			var files = fileObject;
//			var worker = new ExcelWorker();
//			worker.import($grid, files, function(dataList){
//				for(var i = 0; i < dataList.length; i++){
//
//					if((dataList[i].fcltsCd == '' || dataList[i].fcltsCd == undefined)) {
//						dataList.splice(i,1);
//					}
////					if(typeof dataList[i].fcltsCd == 'undefined' || dataList[i].fcltsCd == undefined || dataList[i].fcltsCd == ''){
////						continue;
////					}
////
////					dataList[i].afeYr                  	= dataList[i].afeYr;
////					dataList[i].afeDemdDgr                  	= dataList[i].afeDemdDgr;
////					dataList[i].hdofcCd                  	= dataList[i].hdofcCd;
////					dataList[i].areaNm                  	= dataList[i].areaNm;
////					dataList[i].areaId                  	= dataList[i].areaId;
////					dataList[i].siteCd                  	= dataList[i].siteCd;
////					dataList[i].fcltsCd                  	= dataList[i].fcltsCd;
////					dataList[i].cstrTyp                  	= dataList[i].cstrTyp;
////					dataList[i].dtlCstrTyp                  	= dataList[i].dtlCstrTyp;
////					dataList[i].sggNm                  	= dataList[i].sggNm;
////					dataList[i].emdNm                  	= dataList[i].emdNm;
////					dataList[i].xcrdVal                  	= dataList[i].xcrdVal;
////					dataList[i].ycrdVal                  	= dataList[i].ycrdVal;
//
//				}
//				$grid.alopexGrid('dataAdd', dataList);
//			});
//			//$input.val('');
//			$('#'+excelGrid).alopexGrid('hideProgress');
//    	});
		$('#uploadfile').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('dataEmpty');
			$('#'+excelGrid).alopexGrid('showProgress');
			var $input = $(this);
			var $grid = $('#'+excelGrid);
			var files = e.target.files;
			var worker = new ExcelWorker();
			worker.import($grid, files, function(dataList){
				for(var i = 0; i < dataList.length; i++){
					if((dataList[i].fcltsCd == '' || dataList[i].fcltsCd == undefined)) {

						dataList.splice(i,1);
					}
				}
				$grid.alopexGrid('dataAdd', dataList);
			});
			//$input.val('');
			$('#'+excelGrid).alopexGrid('hideProgress');
		});

		// 본부코드 선택
    	$("#hdofcCd").on("change", function(e) {
			var supCd = $("#hdofcCd").val();
			selectAreaCode("areaId", supCd);
    	});

    	// 설계대상 조건
    	$("#eqpDivCd").on("change", function(e) {
    		// 설계로직 데이터 조회
    		searchDsnLgcData();
    	});

    	// 사업목적코드 선택
    	$("#bizPurpCd").on("change", function(e) {
			selectBizDivCode("bizPurpCd","bizDivCd");

    	});

    	// 적용
    	$("#btnAply").on("click", function(e) {
    		mGrdLgcData = getSelLgcData();
    		// 엑셀업로드 대상 적용
   	   		aplyExcelEqpObjData();

    	});

        //AFE 차수
    	$("#afeYr").on("change", function(e) {
    		var areaYear = $("#afeYr").val();
        	if(areaYear == ''){
        		$("#afeDemdDgr").empty();
    			$("#afeDemdDgr").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};

	        	selectAfeDemdDgrCode('afeDemdDgr', dataParam);
        	}

        	initBizDivCode('bizDivCd');
        	selectBizPurpCode('bizPurpCd', areaYear);
    	});

    	$('#btn_sample_excel').on('click', function(e) {

    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="WreEqpDsn_Sample.xlsx" /><input type="hidden" name="fileExtension" value="xlsx" />');
			$form.append('<input type="hidden" name="type" value="excelUploadFile" />');
			$form.append('<input type="hidden" name="sampleFileType" value="A망" />');
			$form.appendTo('body');
			$form.submit().remove();
    	});


 	}

    function setSelectCode() {

    	//AFE 연차
    	selectAfeYrCode('afeYr');

    	//본부코드
    	selectHdofcCode('hdofcCd');
    	//설계대상코드
    	//selectEqpDivCode('eqpDivCd');
    	selectDsnObjLgcCode('eqpDivCd');

    	var option_data = [{cd: '', cdNm: '선택'}];
		//지역코드
		$('#areaId').setData({ data : option_data, option_selected: '' });

		//사업구분
    	initBizDivCode('bizDivCd');

    	// 확정여부
		var option_data3 = [{cd: '', cdNm: '선택'},{cd: 'Y', cdNm: '유지'},{cd: 'N', cdNm: '삭제'}];
		$('#dataMntnYn').setData({ data : option_data3, dataMntnYn: 'Y' });
	}

	// 그리드 초기화
    function initGrid() {

    	 $('#'+excelGrid).alopexGrid({
 	    	paging: {
 		     	   pagerTotal:true,
 		     	   pagerSelect:false,
 		     	   hidePageList:true
 	    	},
 	    	height : "8row",
 			cellInlineEdit : true,
 			cellInlineEditOption : {startEvent:'click'},
 			cellSelectable : true,
 			rowSingleSelect : false,
 			rowClickSelect: false,
 			numberingColumnFromZero: false,
 			leaveDeleted: true,
 	    	columnMapping:  [{
 	    		key: 'check',
 	    		align: 'center',
 	    		width: '40px',
 	    		selectorColumn : true
 	    	}, {
 				align:'center',
 				title : '순번',
 				width: '50px',
 				resizing : false,
 				numberingColumn: true
 			}, {
 				key : 'afeYr', align:'center',
 				title : '년도',
 				width: '80px',
 				editable: false,
 			}, {
 				key : 'afeDemdDgr', align:'center',
 				title : '차수',
 				width: '80px',
 				editable: false,
 			}, {
 				key : 'hdofcCd', align:'center',
 				title : '본부',
 				width: '80px',
 				editable: false,
 		    	render : { type: 'string',
 		            rule: function (value, data){
 		                var render_data = [{ value : '', text : ''}];
                		data.hdofcCd = getHdofcCdVal(value);
                		return render_data.concat( mHdofcCmb );
 					}
 				},
 				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
 			}, {
 				key : 'areaNm', align:'center',
 				title : '지사',
 				width: '80px',
 				editable: false,
 		    	render : { type: 'string',
 	            	rule: function (value,data){
 	                	var render_data = [{ value : '', text : ''}];
 	                	var currentData = AlopexGrid.currentData(data);
 	                	var areaCmb = grdAreaIdCmb(currentData.hdofcCd);

	                	data.areaId = getAreaIdVal(value);
 	                	return render_data.concat( areaCmb );
 	            	}
 		    	},
 				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
 			}, {
 				key : 'areaId', align:'center',
 				title : '지사ID',
 				width: '150px',
 				hidden : true
 			}, {
 				key : 'siteCd', align:'center',
 				title : '사이트키',
 				width: '150px',
 				editable: false,
 			}, {
 				key : 'fcltsCd', align:'center',
 				title : '*시설코드',
 				width: '150px',
 				editable: false
 			}, {
 				key : 'demdMtsoNm', align:'left',
 				title : 'DHU 국소명',
 				width: '100px',
 				editable: false,
 				hidden : true
 			}, {
 				key : 'srvcLclNm', align:'center',
 				title : '서비스대분류',
 				width: '120px',
 				editable: false
 			}, {
 				key : 'srvcMclNm', align:'center',
 				title : '서비스중분류',
 				width: '120px',
 				editable: false,
 			}, {
 				key : 'mcpNm', align:'center',
 				title : '광역시도',
 				width: '100px',
 				editable : false,
 				hidden : true
 			}, {
 				key : 'sggNm', align:'center',
 				title : '시군구',
 				width: '120px',
 				editable : false
 			}, {
 				key : 'emdNm', align:'center',
 				title : '읍면동',
 				width: '120px',
 				editable : false
 			}, {
 				key : 'xcrdVal', align:'center',
 				title : '위도',
 				width: '100px',
 				editable : false
 			}, {
 				key : 'ycrdVal', align:'center',
 				title : '경도',
 				width: '130px',
 				editable : true
 			}
 			],
 			message: {
 				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
 			},
 			ajax: {
 		         model: gridModel                  // ajax option에 grid 연결할 model을지정
 			        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
 			}
 	    });


    	// 엑셀 업로드 연동 조건
    	 $('#'+gridData).alopexGrid({
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

    function failCallback(response, status, jqxhr, flag){
		switch(flag){
			case "eqpSearch":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
		}
    }

	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		switch(flag){
			case "topSearch":
				$('#'+gridData).alopexGrid('hideProgress');
				setSpGrid(gridData, response, response.dataList);
				break;
			case 'afterAply':
				hideProgressBody();
				$('#'+gridData).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', '적용 되었습니다.('+response.returnTime+')',function(){
						$a.close("APLY");
					});
				} else {
					callMsgBox('','W', '적용이 실패되었습니다.', btnMsgCallback);
				}
				break;
			case 'afeYr':
				$('#afeYr').clear();
				var option_data =  [];
				var stdAfeYr = "";
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}

				$('#afeYr').setData({data:option_data,afeYr:stdAfeYr});
				selectAfeDemdDgrCode('afeDemdDgr', {afeYr:stdAfeYr});
				//사업목적코드
		    	selectBizPurpCode('bizPurpCd',stdAfeYr);

				break;
			case 'afeDemdDgr':
				$('#'+flag).clear();
				var option_data =  [];
				var stdAfeYr = "";
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}
				$('#'+flag).setData({data:option_data,afeDemdDgr:stdAfeYr});
				break;

			case 'bizPurpCd':
				$('#'+flag).clear();
				var option_data =  [{cd: "", cdNm: "선택"}];

				for(var i=0; i<response.purpList.length; i++){
					var resObj 		= {cd: response.purpList[i].cd, cdNm: response.purpList[i].cdNm,
										value: response.purpList[i].cd, text: response.purpList[i].cdNm
									};

					option_data.push(resObj);
				}

				if(flag == 'bizPurpCd'){
					mBizPurpCmb1 	= option_data;
					mBizDivCmb1		= response.divList;

				}
				$('#'+flag).setData({data:option_data});
				break;

			case 'hdofcCd':
				for(var i=0; i<response.length; i++){
					var resObj 		= {value: response[i].cd, text: response[i].cdNm};

					mHdofcCmb.push(resObj);
				}
			case 'areaId':
				setSelectBoxData(flag, response);
				break;
			case 'eqpDivCd':
				var dataCmb = response.mainLgc;
				var option_data 	=  [{cd: "", cdNm: "선택"}];

				for(var i=0; i<dataCmb.length; i++){
					option_data.push({cd: dataCmb[i].cd, cdNm: dataCmb[i].cdNm});
				}
				$('#eqpDivCd').setData({data:option_data});
				break;
		}
    }

	 // AFE 년차
    function selectAfeYrCode(objId) {
    	var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', param, 'GET', objId);
	}

    // 본부코드
    function selectHdofcCode(objId) {
		var param = {};//C00623

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getHdofcCode', param, 'GET', objId);
	}

    // 설계대상코드
    function selectEqpDivCode(objId) {

		var param = {};

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', param, 'GET', objId);
    }

    // 설계대상콤보코드(로직데이터 존재하는 설계대상만 조회)
    function selectDsnObjLgcCode(objId) {

		var param = {runDivCd : mRunDivCd};

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnObjLgcCode', param, 'GET', objId);
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

    // AFE 수요회차
    function selectAfeDemdDgrCode(objId, param) {

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeDemdDgrlist', param, 'GET', objId);
	}

  //사업구분코드 초기화
    function initBizDivCode(objId) {
		var param = [{cd: '', cdNm: '선택'}];

    	$("#"+objId).setData({ data : param, option_selected: '' });
    }

    function setSelectBoxData(objId, response){
		$('#'+objId).clear();
		var option_data =  [{cd: "", cdNm: "선택"}];

		for(var i=0; i<response.length; i++){
			var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
			option_data.push(resObj);
		}

		$('#'+objId).setData({data:option_data});

		switch(objId){
		case 'hdofcCd':
			$('#'+objId).setSelected(mHdofcCdSel);
			break;
		case 'areaId':
			$('#'+objId).setSelected(mAreaIdSel);
			break;
		}
	}

    // 사업구분코드
    function selectBizDivCode(objId1, objId2) {
		$('#'+objId2).clear();

		var bizPurpCd = $("#"+objId1).val();
    	var divCdList = [];

    	if(objId2 == 'bizDivCd'){
    		divCdList = mBizDivCmb1[bizPurpCd];
    	}

		var option_data =  [{cd: "", cdNm: "선택"}];
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

    	$('#'+gridData).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getDsnDivCdMgmtForPage', param, 'GET', 'topSearch');
    }

  //Grid에 Row출력
    function setSpGrid(GridID,Option,Data) {
    	$('#'+GridID).alopexGrid('dataSet', Data, '');

    	$('#'+GridID).alopexGrid('rowSelect', {_state:{selected : false}}, true);

	}

 // 조회용 파라메터 셋팅
    function getTopParamData(){
    	var param = {};
    	param.runDivCd			= '02';
		param.afeYr				= $("#afeYr").val();
		param.afeDemdDgr		= $("#afeDemdDgr").val();
		param.dsnDivCd			= $("#eqpDivCd").val();
		param.dataMntnYn		= $("#dataMntnYn").val();
		//param.hdofcCd			= $("#hdofcCd").val();
		//param.areaId			= $("#areaId").val();
		param.demdBizDivCd		= $("#bizPurpCd").val();
		param.lowDemdBizDivCd	= $("#bizDivCd").val();

    	return param;
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

    // 본사코드 체크
    function getHdofcCdVal(value){
    	if($.TcpMsg.isEmpty(value)) return '';
    	var result = '';

    	switch(value){
		case "5100":
		case "5300":
		case "5500":
		case "5600":
			result =  value;
			break;
    	}

    	if(result == ''){
       		var sValue = value.trim();

        	switch(sValue){
    		case "수도권":
    			result = "5100";
    			break;
    		case "동부":
    			result = "5300";
    			break;
    		case "서부":
    			result = "5500";
    			break;
    		case "중부":
    			result = "5600";
    			break;
        	}
    	}

    	return result;
    }

    // 지사코드 체크
    function getAreaIdVal(value){
    	if($.TcpMsg.isEmpty(value)) return '';
    	var result = '';

    	switch(value){
		case "T11001":
		case "T12001":
		case "T12002":
		case "T13001":
		case "T13003":
		case "T14001":
		case "T14002":
		case "T14003":
			result =  value;
			break;
    	}

    	if(result == ''){
       		var sValue = value.trim();

        	switch(sValue){
    		case "수도권":
    			result = "T11001";
    			break;
    		case "대구":
    			result = "T12001";
    			break;
    		case "부산":
    			result = "T12002";
    			break;
    		case "서부":
    			result = "T13001";
    			break;
    		case "제주":
    			result = "T13003";
    			break;
    		case "세종":
    			result = "T14001";
    			break;
    		case "강원":
    			result = "T14002";
    			break;
    		case "충청":
    			result = "T14003";
    			break;
        	}
    	}

    	return result;
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

 // 선택된 로직그룹정보 가져오기
	function getSelLgcData(){
		var grdData = AlopexGrid.trimData($('#'+gridData).alopexGrid('dataGet', function(data) {
			if (data._state.selected == true || data.mndtInsYn == "Y") {
				return data;
			}
		}));

		return grdData;
	}

	// 엑셀업로드 대상 적용
    function aplyExcelEqpObjData() {

//	    $('#'+excelGrid).alopexGrid('endEdit'); // 편집종료

		var gridData = AlopexGrid.trimData($('#'+excelGrid).alopexGrid('dataGet', { _state : { selected : true }}));

		if (gridData.length == 0) {// 선택한 데이터가 존재하지 않을 시
			callMsgBox('btnMsgWarning','W', '적용할 대상을 선택하세요.', btnMsgCallback);
			return;

		} else if(gridData.length > 0) {

			var afeYr			= $("#afeYr").val();
			var afeDemdDgr		= $("#afeDemdDgr").val();
			var hdofcCd			= $("#hdofcCd").val();
			var areaId			= $("#areaId").val();
			var demdBizDivCd	= $("#bizPurpCd").val();
			var lowDemdBizDivCd	= $("#bizDivCd").val();
			var eqpDivCd		= $("#eqpDivCd").val();
			var dataMntnYn		= $("#dataMntnYn").val();

			if($.TcpMsg.isEmpty(afeYr)){
				callMsgBox('btnMsgWarning','I', "년도를 선택해 주십시오.");
				return false;
			}

			if($.TcpMsg.isEmpty(afeDemdDgr)){
				callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
				return false;
			}

			if($.TcpMsg.isEmpty(eqpDivCd)){
				callMsgBox('btnMsgWarning','I', "설계대상을 선택해 주십시오.");
				return false;
			}

			if($.TcpMsg.isEmpty(dataMntnYn)){
				callMsgBox('btnMsgWarning','I', "자료 유지 여부를 선택해 주십시오.");
				return false;
			}

			if($.TcpMsg.isEmpty(demdBizDivCd)){
				callMsgBox('btnMsgWarning','I', "사업목적을 선택해 주십시오.");
				return false;
			}

			if($.TcpMsg.isEmpty(lowDemdBizDivCd)){
				callMsgBox('btnMsgWarning','I', "사업구분을 선택해 주십시오.");
				return false;
			}

			callMsgBox('aplyConfirm','C', '적용 하시겠습니까?', btnMsgCallback);
		}
    }

 // 버튼 콜백 funtion
	var btnMsgCallback = function (msgId, msgRst) {
		if ('aplyConfirm' == msgId && 'Y' == msgRst) {
			var gridExcelData = AlopexGrid.trimData($('#'+excelGrid).alopexGrid('dataGet', function(data) {
				if (data._state.selected == true) {
					return data;
				}
			}));

			if(gridExcelData.length > 0) {
				var regMeansNm 	= '엑셀연동';

				// 그리드 전체선택 여부
				var checked 	= 'F';

				var aplyParam	= [];
				// 하단로직 조건 데이터
				aplyParam = getTopParamData();

				if('F' == checked){
					for (var i = 0; i < gridExcelData.length; i++) {
						if(!$.TcpMsg.isEmpty(gridExcelData[i].hdofcCd)) gridExcelData[i].hdofcCd = gridExcelData[i].hdofcCd.trim();
						if(!$.TcpMsg.isEmpty(gridExcelData[i].areaNm)) gridExcelData[i].areaNm = gridExcelData[i].areaNm.trim();
						if(!$.TcpMsg.isEmpty(gridExcelData[i].siteCd)) gridExcelData[i].fhSiteKeyId = gridExcelData[i].siteCd.trim();
						if(!$.TcpMsg.isEmpty(gridExcelData[i].fcltsCd)) gridExcelData[i].fcltsCd = gridExcelData[i].fcltsCd.trim();

						gridExcelData[i].hdofcCd = getHdofcCdVal(gridExcelData[i].hdofcCd);
						gridExcelData[i].areaId = getAreaIdVal(gridExcelData[i].areaNm);
					}
					aplyParam.aplyData		= gridExcelData;
				}

				aplyParam.allInsType 	= checked;
				aplyParam.regMeansNm	= regMeansNm;
				aplyParam.lgcData		= mGrdLgcData;

				showProgressBody();
				httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/saveBPMDemdList', aplyParam, 'POST', 'afterAply');
			}else{
				callMsgBox('btnMsgWarning','W', '적용할 데이터가 없습니다.', btnMsgCallback);
			}
		}
	}

	 function showProgressBody(){
	    	$('body').progress();
	    };

	    function hideProgressBody(){
	    	$('body').progress().remove();
	    };


});