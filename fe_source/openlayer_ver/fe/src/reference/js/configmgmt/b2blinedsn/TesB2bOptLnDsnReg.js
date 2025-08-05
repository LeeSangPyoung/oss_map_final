/**
 * B2bOptLnDsnList.js
 *
 * @author Administrator
 * @date 2024. 06. 25.
 * @version 1.0
 */

var main = $a.page(function() {
	var excelGrid = 'b2bOptLnDsnRegExcelGridData';

	// 설계 조건 정보
	var mGrdLgcData		= [];

	var selectBoxCtrtDtList = [
								{value: "12", text: "12개월"},
								{value: "24", text: "24개월"},
								{value: "36", text: "36개월"},
								{value: "48", text: "48개월"},
								{value: "60", text: "60개월"},
							  ];

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
	};

	//Grid 초기화
	function initGrid() {
		//그리드 생성
		$('#'+excelGrid).alopexGrid({
			paging : {
				 pagerTotal:true,
		     	 pagerSelect:false,
		     	 hidePageList:true
			},
			height : '10row',
 			numberingColumnFromZero: false,
 			excelWorker :{
				importOption : {
					columnOrderToKey : true
				}
			},
			columnMapping: [
				   {/* 순번				*/
					align:'center',
					title : 'No.',
					width: '30',
					resizing: false,
					numberingColumn: true
					/*inlineStyle : {
						color: function(value, data, mapping){
							if (data.flag == 'Y') {
								return 'red';
							}
						}
					}*/
				}, {/* 엑셀순번			*/
					key : 'excelSeq', align : 'center',
					title : '순번',
					width : '60',
					hidden: true
				}, {/* 고객명				*/
					key : 'custNm', align : 'center',
					title : '고객명',
					width : '60'
				}, {/* 고객주소			*/
					key : 'custAddr', align : 'center',
					title : '고객주소',
					width : '120'
				}, {/* 주소경도값			*/
					key : 'addrLngVal', align : 'center',
					title : '경도',
					width : '60'
				}, {/* 주소위도값			*/
					key : 'addrLatVal', align : 'center',
					title : '위도',
					width : '60'
				}, {/* 입력상위국사건물코드	*/
					key : 'insUmtsoBldCd', align : 'center',
					title : '상위국',
					width : '80'
				}
				/*, { flag
					key : 'flag', align : 'center',
					title : 'flag',
					width : '10',
					hidden: true
				}*/
			],
			message : {
				nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
			}
		});
	};

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		$('#ctrtDtCondVal').clear();
		$('#ctrtDtCondVal').setData({data : selectBoxCtrtDtList, ctrtDtCondVal:'60'});
	}

	function setEventListener() {

		// 취소
		$('#btnPopCncl').on('click', function(e) {
			$a.close();
		});

		// 파일 선택
		$('#uploadfile').on('change', function(e) {
			$('#'+excelGrid).alopexGrid('dataEmpty');
			$('#'+excelGrid).alopexGrid('showProgress');
			var $input = $(this);
			var $grid = $('#'+excelGrid);
			var files = e.target.files;
			var worker = new ExcelWorker();
			worker.import($grid, files, function(dataList){
				dataList.shift();			// 첫번째 배열 삭제

				// 모든 항목이 비어있는경우 리스트에서 제외
				dataList = dataList.filter(item =>
					Object.values(item).some(value => value !== undefined)
				);

//				// 2024-09-05 업로드 수가 1000 라인이 넘으면 업로드 불가 하도록 요청 받음
				//if (dataList.length > 1000) {
				//	$('#'+excelGrid).alopexGrid('hideProgress');
				//	callMsgBox('','W', '최대 1,000 라인까지만 업로드 가능 합니다.', function(){});
				//	return;
				//}

				// 순번만 있고 나머지 항목이 모두 비어있는경우 리스트에서 제외
				dataList = dataList.filter(item =>{
					var keys = Object.keys(item);
					var values = Object.values(item);
					var onlyCustNmDef = item.custNm !== undefined && keys.every(key => key === 'custNm' || item[key] === undefined);

					return !onlyCustNmDef;
				});

				var tmpDataList = dataList.map(col => {
					return {
						excelSeq: col.custNm,
						custNm: col.custAddr,
						custAddr: col.addrLngVal,
						addrLngVal: col.addrLatVal,
						addrLatVal: col.insUmtsoBldCd,
						insUmtsoBldCd: col.undefined
					};
				});

				// 순번  숫자확인 및 중복체크(미구현)
				/*var arrList = []

				for (var i=0; i<dataList.length; i++) {

					dataList[i].flag = "N"

					if (dataList[i].custSeq != undefined && dataList[i].custSeq != 'undefined' && dataList[i].custSeq != '') {
						console.log(dataList[i].custSeq)

						if(isNaNCheck(dataList[i].custSeq) == 1)
							dataList[i].flag = "Y"
						else
							arrList.push(dataList[i].custSeq)
					}
				}

				arrList = arrList.sort();*/

				$grid.alopexGrid('dataAdd', tmpDataList);
			});
			$('#'+excelGrid).alopexGrid('hideProgress');
		});

		// 적용
    	$("#btnAply").on("click", function(e) {
    		mGrdLgcData = $("#b2bOptLnDsnRegArea").getData();

    		if(mGrdLgcData.b2bDsnNm == ""){
    			callMsgBox('','W', '설계명은 필수입력 항목입니다.', function(msgId, msgRst){});
    			return;
    		}

    		aplyDsnCondExcelObjData();
    	});

    	// 샘플(파일 경로 나중에 반영할 때 수정해야함)
    	$('#btn_sample_excel').on('click', function(e) {
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="B2B_Demand_Info_Sample.xlsx" /><input type="hidden" name="fileExtension" value="xlsx" />');
			$form.append('<input type="hidden" name="type" value="excelUploadFile" />');
			$form.append('<input type="hidden" name="sampleFileType" value="A망" />');
			$form.appendTo('body');
			$form.submit().remove();
    	});

    	// 선로 활용, 비용 최적화 목표 비활성화, 계약기간
		var radioGroup1 = document.getElementById('disabledRadio1');
		var radioGroup2 = document.getElementById('disabledRadio2');
		var radios1 = radioGroup1.querySelectorAll('input[type="radio"]');
		var radios2 = radioGroup2.querySelectorAll('select');

		radios1.forEach(function(radio1){
			radio1.disabled = true;
		});

		radios2.forEach(function(radio2){
			radio2.disabled = true;
		});

	};

	// 엑셀 업로드 대상 적용
    function aplyDsnCondExcelObjData() {
		var gridData = AlopexGrid.trimData($('#'+excelGrid).alopexGrid('dataGet'));

		if (gridData.length == 0) {// 데이터가 존재하지 않을 시
			callMsgBox('btnMsgWarning','W', '엑셀 파일을 선택하세요.', function(msgId, msgRst){});
			return;

		} else if(gridData.length > 0) {
			callMsgBox('aplyConfirm','C', '적용 하시겠습니까?', function(msgId, msgRst){
				if ('aplyConfirm' == msgId && 'Y' == msgRst) {
					var gridExcelData = AlopexGrid.trimData($('#'+excelGrid).alopexGrid('dataGet'));

					if(gridExcelData.length > 0) {

						var aplyParam	= {};

						// 설계 조건 데이터
						aplyParam = getDsnCondData();

						// 엑셀 업로드 데이터
						aplyParam.aplyData = gridExcelData;
						$('#'+excelGrid).alopexGrid('showProgress');
						httpRequest('tango-transmission-tes-biz/transmisson/tes/configmgmt/b2blinedsn/insertOptLnDsnReg', aplyParam, 'POST', 'afterAply');
					} else {
						callMsgBox('btnMsgWarning','W', '적용할 데이터가 없습니다.', function(msgId, msgRst){});
					}
				}
			});
		}
    }

	$(function (){
		if($('input[type="radio"][id="cstOtmzCondVal"]:checked').val() === 'D'){
			$('#ctrtDtCondVal').clear();
		}

		if($('input[type="radio"][id="cstOtmzCondVal"]:checked').val() === 'B'){
			$('#selectCstOtmz').css('display', 'inline-block');
		}

		$('input[type="radio"][id="cstOtmzCondVal"]').on('click', function(){
			var checkValue = $('input[type="radio"][id="cstOtmzCondVal"]:checked').val();
			if(checkValue === 'B'){
				$('#selectCstOtmz').css('display', 'inline-block');
			}
			else{
				$('#selectCstOtmz').css('display', 'none');
			}
		});
	});

	function isNaNCheck(str) {
		var reStr = '0';
		if(typeof str != 'undefined' && str != undefined && str != ''){
			str = str.toString().replace(/,/gi, '');
			if (isNaN(str)) {
				reStr = "1";
			}
		}
		return reStr;
	}

	function getDsnCondData(){
    	var param = {};
    	var userId;

		if($("#userId").val() == ""){
			userId = "SYSTEM";
		}else{
			userId = $("#userId").val();
		}

    	param.dsnrId 			= userId;
    	param.frstRegUserId		= userId;
    	param.lastChgUserId		= userId;
    	param.b2bDsnNm			= $("#b2bDsnNm").val();
		param.rmkCtt			= $("#rmkCtt").val();
		param.lnPraCondVal		= $("#lnPraCondVal:checked").val();
		param.cstOtmzCondVal	= $("#cstOtmzCondVal:checked").val();
		param.progStatVal		= '진행중';
		if(param.cstOtmzCondVal == 'D'){
			param.ctrtDtCondVal = '';
		}
		else{
			param.ctrtDtCondVal	= $("#ctrtDtCondVal").val();
		}

    	return param;
    }

	function successCallback(response, status, jqxhr, flag){
		switch(flag){
			case 'afterAply':
				$('#'+excelGrid).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', '광선로설계를 호출하였습니다.',function(){
						$a.close("APLY");
					});
				} else {
					callMsgBox('','W', '광선로설계 호출에 실패하였습니다.', function(msgId, msgRst){});
				}
				break;
		}
	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag){

	}

	var httpRequest = function(Url, Param, Method, Flag ) {
		Tango.ajax({
			url : Url, 			//URL 기존 처럼 사용하시면 됩니다.
			data : Param, 		//data가 존재할 경우 주입
			method : Method, 	//HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
				current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}
});