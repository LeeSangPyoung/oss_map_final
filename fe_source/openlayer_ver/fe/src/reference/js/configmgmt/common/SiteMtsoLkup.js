/**
 * SiteMtsoLkup.js
 *
 * @author Administrator
 * @date 2017. 12. 12. 오전 13:46:03
 * @version 1.0
 */
$a.page(function() {

	var formId = 'siteMtsoSearchForm';
	var gridId = 'siteMtsoDataGrid';
	var paramData = null;
	var intgFcltsCdParam = "";

	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		if (param.mgmtGrpNm == null || param.mgmtGrpNm == '') {
			param.mgmtGrpNm = 'SKT';
		}
		if (param.regYn == "Y") {
			paramData = param;
		}
		initGrid();
		setSelectCode();
		setRegDataSet(param);
		setEventListener();

		if (param.autoSearchYn == "Y") {
			setList(param);
		}
	};

	function setRegDataSet(data) {
		$('#' + formId).find('#mgmtGrpNm').val(data.mgmtGrpNm);
		$('#' + formId).find('#siteCd').val(data.siteCd);
		$('#' + formId).find('#siteNm').val(decodeURIComponent(data.siteNm));
	}

//Grid 초기화
	function initGrid() {

		//그리드 생성
		$('#' + gridId).alopexGrid({
			paging : {
				pagerSelect: [100, 300, 500, 1000, 5000],
				hidePageList: false// pager 중앙 삭제
			},
			autoColumnIndex: true,
			autoResize: true,
			defaultColumnMapping: {
				sorting : true
			},
			columnMapping: [{
				/* 관리그룹			*/
				key : 'mgmtGrpNm', align:'center',
				title : configMsgArray['managementGroup'],
				width: '70px'
			}, {/* 본부			 */
				key : 'orgNm', align:'center',
				title : configMsgArray['hdofc'],
				width: '100px'
			}, {/* 팀ID 			 */
				key : 'teamId', align:'center',
				title : configMsgArray['team'],
				width: '100px'
			}, {/* 팀 			 */
				key : 'teamNm', align:'center',
				title : configMsgArray['team'],
				width: '100px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			}, {/* 국사명		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '150px'
			}, {/* 국사약어명		 */
				key : 'mtsoAbbrNm', align:'center',
				title : '국사약어명',
				width: '150px'
			}, {/* 국사유형		 */
				key : 'mtsoTyp', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeType'],
				width: '100px'
			}, {/* 국사상태		 */
				key : 'mtsoStat', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeStatus'],
				width: '100px'
			}, {/* 국사세부유형	*/
				key : 'mtsoDetlTypNm', align:'center',
				title : '국사세부유형',
				width: '120px'
			}, {/* 지도입력여부	*/
				key : 'mtsoMapInsYn', align:'center',
				title : '지도입력여부',
				width: '100px'
			}, {/* 대표통시코드	*/
				key : 'repIntgFcltsCd', align:'center',
				title : '대표통시코드',
				width: '120px'
			}, {/* UKEY국사코드	*/
				key : 'ukeyMtsoId', align:'center',
				title : 'SWING국사코드',
				width: '120px'
			}, {/* 건물주소		 */
				key : 'bldAddr', align:'center',
				title : configMsgArray['buildingAddress'],
				width: '200px'
			}, {/* 건물명		 */
				key : 'bldNm', align:'center',
				title : '건물명',
				width: '130px'
			}, {/* 건물동--숨김데이터		 */
				key : 'bldblkNo', align:'center',
				title : configMsgArray['buildingBlock'],
				width: '100px'
			}, {/* 건물동		 */
				key : 'bldblkNm', align:'center',
				title : configMsgArray['buildingBlock'],
				width: '100px'
			}, {/* 건물층값--숨김데이터		 */
				key : 'bldFlorNo', align:'center',
				title : configMsgArray['buildingFloorValue'],
				width: '100px'
			}, {/* 건물층값		 */
				key : 'bldFlorCnt', align:'center',
				title : configMsgArray['buildingFloorValue'],
				width: '100px'
			}, {/* UKEY동코드--숨김데이터	 */
				key : 'ldongCd', align:'center',
				title : configMsgArray['ukeyDongCode'],
				width: '100px'
			}, {/* UKEY구분코드--숨김데이터	 */
				key : 'bunjiTypCd', align:'center',
				title : configMsgArray['ukeyDivisionCode'],
				width: '100px'
			}, {/* UKEY대번지주소--숨김데이터 */
				key : 'mainBunjiCtt', align:'center',
				title : configMsgArray['ukeyBigBunjiAddress'],
				width: '100px'
			}, {/* UKEY소번지주소--숨김데이터 */
				key : 'subBunjiCtt', align:'center',
				title : configMsgArray['ukeySmallBunjiAddress'],
				width: '100px'
			}, {/* 국사ID	 */
				key : 'mtsoId', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeIdentification'],
				width: '120px'
			}, {/* 건물코드	 */
				key : 'bldCd', align:'center',
				title : configMsgArray['buildingCode'],
				width: '120px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
			}
		});

		gridHide();
	};

	// 컬럼 숨기기
	function gridHide() {
		var hideColList = ['teamId', 'bldblkNo', 'bldFlorNo', 'ldongCd', 'bunjiTypCd', 'mainBunjiCtt', 'subBunjiCtt'];
		$('#' + gridId).alopexGrid('hideCol', hideColList, 'conceal');
	}

	function setList(param) {
		if (JSON.stringify(param).length > 2) {
			$('#' + formId).find('#pageNo').val(1);
			$('#' + formId).find('#rowPerPage').val(100);

			param = $('#' + formId).getData();
			// 초기 그리드 데이터 조회시 mgmtGrpNm SELECT Box 값이 설정되지 않아 강제 설정
			if (param.mgmtGrpNm == null || param.mgmtGrpNm == '') {
				param.mgmtGrpNm = 'SKT';
			}

			$('#' + gridId).alopexGrid('showProgress');
			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/siteMtsoLkup', param, 'GET', 'search');
		}
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var chrrOrgGrpCd;
		if($('#' + formId).find("#chrrOrgGrpCd").val() == "") {
			chrrOrgGrpCd = "SKT";
		} else {
			chrrOrgGrpCd = $('#' + formId).find("#chrrOrgGrpCd").val();
		}

		var mgmtGrpCd;
		if (paramData == '' || paramData == null) {
			mgmtGrpCd = chrrOrgGrpCd;
		} else {
			mgmtGrpCd = paramData.mgmtGrpNm;
		}

		var op = $('#'+gridId).alopexGrid('readOption');
		if (mgmtGrpCd == "SKT") {
			$('#' + formId).find('#intgFcltsCdLabel').html("국사통시코드") ;
			$('#' + formId).find('#mtsoAbbrNmLkupLabel').html("국사약어명") ;
			$('#' + gridId).alopexGrid("showCol", 'repIntgFcltsCd');
			$('#' + gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
			op.columnMapping[7].title = "국사약어명" ;
		} else {
			$('#' + formId).find('#intgFcltsCdLabel').html("SWING국사코드") ;
			$('#' + formId).find('#mtsoAbbrNmLkupLabel').html("GIS국사명") ;
			$('#' + gridId).alopexGrid("hideCol", 'repIntgFcltsCd', 'conceal');
			$('#' + gridId).alopexGrid("showCol", 'ukeyMtsoId');
			op.columnMapping[7].title = "GIS국사명" ;
		}

		$('#' + gridId).alopexGrid('updateOption', {
			columnMapping: op.columnMapping
		});

		// 관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
	}

	function setEventListener() {
		var perPage = 100;

		// 페이지 번호 클릭시
		$('#' + gridId).on('pageSet', function(e) {
			var eObj = AlopexGrid.parseEvent(e);
			setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#' + gridId).on('perPageChange', function(e) {
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			setGrid(1, eObj.perPage);
		});

		//조회
		$('#' + formId).find('#siteMtsoBtnSearch').on('click', function(e) {
			setGrid(1, perPage);
		});

		//관리그룹 선택시 이벤트
		$('#' + formId).find('#mgmtGrpNm').on('change', function(e) {
			var mgmtGrpNm = $('#' + formId).find("#mgmtGrpNm").val();
			var op = $('#' + gridId).alopexGrid('readOption');

			if (mgmtGrpNm == "SKT") {
				$('#' + formId).find('#intgFcltsCdLabel').html("국사통시코드") ;
				$('#' + formId).find('#mtsoAbbrNmLkupLabel').html("국사약어명") ;
				$('#' + gridId).alopexGrid("showCol", 'repIntgFcltsCd');
				$('#' + gridId).alopexGrid("hideCol", 'ukeyMtsoId', 'conceal');
				op.columnMapping[7].title = "국사약어명" ;
				$('#' + formId).find('#intgFcltsCd').val(intgFcltsCdParam);
			} else {
				$('#' + formId).find('#intgFcltsCdLabel').html("SWING국사코드") ;
				$('#' + formId).find('#mtsoAbbrNmLkupLabel').html("GIS국사명") ;
				$('#' + gridId).alopexGrid("hideCol", 'repIntgFcltsCd', 'conceal');
				$('#' + gridId).alopexGrid("showCol", 'ukeyMtsoId');
				op.columnMapping[7].title = "GIS국사명" ;
				intgFcltsCdParam = $('#intgFcltsCd').val();
				$('#' + formId).find('#intgFcltsCd').val("");
			}

			$('#' + gridId).alopexGrid('updateOption', {
				columnMapping: op.columnMapping
			});
		});

		$('#' + formId).find('#btnClose').on('click', function(e) {
			// tango transmission biz 모듈을 호출하여야한다.
			$a.close();
		});
	};

	function successCallback(response, status, jqxhr, flag) {
		if (flag == 'mgmtGrpNm') {
			var chrrOrgGrpCd;
			if ($('#' + formId).find("#chrrOrgGrpCd").val() == "") {
				chrrOrgGrpCd = "SKT";
			} else {
				chrrOrgGrpCd = $('#' + formId).find("#chrrOrgGrpCd").val();
			}

			$('#' + formId).find('#mgmtGrpNm').clear();

			var selectId = null;
			if (response.length > 0) {
				for (var i = 0; i < response.length; i++) {
					var resObj = response[i];
					if (resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCdNm;
						break;
					}
				}
				if (paramData == '' || paramData == null) {
					$('#' + formId).find('#mgmtGrpNm').setData({
						data: response ,
						mgmtGrpNm: selectId
					});
				} else {
					$('#' + formId).find('#mgmtGrpNm').setData({
						 data: response,
						 mgmtGrpNm: paramData.mgmtGrpNm
					});
				}
			}
			console.log($('#' + formId).find('#mgmtGrpNm').val());
		} else if (flag == 'search') {	// 국사 조회시
			$('#' + gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.lists);
		}
	}

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength: Option.pager.totalCnt,	//총 데이터 길이
				current: Option.pager.pageNo,		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage: Option.pager.rowPerPage	//한 페이지에 보일 데이터 갯수
		};
		$('#' + GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

	//request 실패시.
	function failCallback(response, status, jqxhr, flag) {
		if (flag == 'search') {
			//조회 실패 하였습니다.
			callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst) {});
		}
	}

	function setGrid(page, rowPerPage) {
		$('#' + formId).find('#pageNo').val(page);
		$('#' + formId).find('#rowPerPage').val(rowPerPage);

		var param = $('#' + formId).getData();

		$('#' + gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/siteMtsoLkup', param, 'GET', 'search');
	}
	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
			flag : Flag
		}).done(successCallback)
		.fail(failCallback);
	}
});