/**
 * LDongTeamList.js
 *
 * @author Administrator
 * @date 2018. 1. 3. 오전 12:30:03
 * @version 1.0
 */
var main = $a.page(function() {
	var gridId = 'dataGrid';

	// 초기 진입점
	// param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	this.init = function(id, param) {
		initGrid();
		setSelectCode();
		setEventListener();
		if (param.fromOther == 'Y') {
			MtsoFromOtherReg(param);
		}
	};

	// Grid 초기화
	function initGrid() {
		// 그리드 생성
		$('#' + gridId).alopexGrid({
			paging: {
				pagerSelect: [100, 300, 500, 1000, 5000],
				hidePageList: false  // pager 중앙 삭제
			},
			autoColumnIndex: true,
			autoResize: true,
			numberingColumnFromZero: false,
			defaultColumnMapping: {
				sorting: true
			},
			columnMapping: [{
				align:'center',
				title: configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			}, {/* 법정동코드 -- 숨김데이터 */
				key: 'ldongCd', align: 'center',
				title: '법정동코드',
				width: '100px'
			}, {/* 법정동주소 */
				key: 'ldongAddr', align: 'center',
				title: configMsgArray['legalDong'],
				width: '150px'
			}, {/* 본부ID -- 숨김데이터 */
				key: 'orgId', align: 'center',
				title: configMsgArray['headOfficeIdentification'],
				width: '100px'
			}, {/* 본부명 */
				key: 'orgNm', align: 'center',
				title: configMsgArray['hdofc'],
				width: '150px'
			}, {/* 팀ID -- 숨김데이터 */
				key: 'teamId', align: 'center',
				title: configMsgArray['teamIdentification'],
				width: '100px'
			}, {/* 팀 */
				key: 'teamNm', align: 'center',
				title: configMsgArray['team'],
				width: '150px'
			}, {/* 운용팀ID -- 숨김데이터 */
				key: 'opTeamOrgId', align: 'center',
				title: '운용팀ID',
				width: '100px'
			}, {/* 운용팀	*/
				key: 'opTeamOrgNm', align: 'center',
				title: '운용팀',
				width: '150px'
			}, {/* 운용포스트ID -- 숨김데이터 */ // 라종식
				key: 'opPostOrgId', align: 'center',
				title: '운용POSTID',
				width: '100px'
			}, {/* 운용포스트	*/ // 라종식
				key: 'opPostOrgNm', align: 'center',
				title: '운용POST',
				width: '150px'
			}, {/* 전송실ID -- 숨김데이터 */
				key: 'tmofId', align: 'center',
				title: '전송실ID',
				width: '100px'
			}, {/* 전송실 */
				key: 'tmofNm', align: 'center',
				title: configMsgArray['transmissionOffice'],
				width: '150px'
			}, {/* 등록일자 */
				key: 'frstRegDate', align: 'center',
				title: configMsgArray['registrationDate'],
				width: '100px'
			}, {/* 등록자 */
				key: 'frstRegUserId', align: 'center',
				title: configMsgArray['registrant'],
				width: '100px'
			}, {/* 변경일자 */
				key: 'lastChgDate', align: 'center',
				title: configMsgArray['changeDate'],
				width: '100px'
			}, {/* 변경자 */
				key: 'lastChgUserId', align: 'center',
				title: configMsgArray['changer'],
				width: '100px'
			}],
			message: {
				nodata: '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>' + configMsgArray['noData'] + '</div>'
			}
		});

		gridHide();
	}

	// 컬럼 숨기기
	function gridHide() {
		var hideColList = ['ldongCd', 'orgId', 'teamId', 'opTeamOrgId', 'opPostOrgId','tmofId']; // 라종식
		$('#' + gridId).alopexGrid('hideCol', hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	function setSelectCode() {
		var chrrOrgGrpCd;
		if ($('#chrrOrgGrpCd').val() == '') {
			chrrOrgGrpCd = 'SKT';
		} else {
			chrrOrgGrpCd = $('#chrrOrgGrpCd').val();
		}

		// 관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		// 본부 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/' + chrrOrgGrpCd, null, 'GET', 'fstOrg');
		// 운용팀 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');
		// 운용POST 조회 // 라종식
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPost');
		// 행정시도 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/sido/Y', null, 'GET', 'sido');
	}

	function setEventListener() {
		var perPage = 100;

		// 페이지 번호 클릭시
		$('#' + gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			main.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		// 페이지 selectbox를 변경했을 시.
		$('#' + gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			main.setGrid(1, eObj.perPage);
		});

		// 관리그룹 선택시 이벤트
		$('#mgmtGrpNm').on('change', function(e) {
			var mgmtGrpNm = $(this).getData().mgmtGrpNm;

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/' + mgmtGrpNm, null, 'GET', 'fstOrg');

			var op = $('#' + gridId).alopexGrid('readOption');
			$('#' + gridId).alopexGrid('updateOption', {
				columnMapping: op.columnMapping
			});
		});

		// 본부 선택시 이벤트
		$('#orgId').on('change', function(e) {
			var orgId =  $(this).getData().orgId;

			if (orgId == '') {
				var mgmtGrpNm = $('#mgmtGrpNm').getData().mgmtGrpNm;

				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/' + mgmtGrpNm, null, 'GET', 'team');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/' + mgmtGrpNm, null, 'GET', 'tmof');
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgId, null, 'GET', 'team');
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgId + '/ALL', null, 'GET', 'tmof');
			}
		});

		// 팀을 선택했을 경우
		$('#teamId').on('change', function(e) {
			var orgId = $('#orgId').getData().orgId;
			var teamId = $(this).getData().teamId;

			if (teamId == '') {
				if (orgId == '') {
					var mgmtGrpNm = $('#mgmtGrpNm').getData().mgmtGrpNm;
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/' + mgmtGrpNm, null, 'GET', 'tmof');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgId + '/ALL', null,'GET', 'tmof');
				}
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + teamId, null,'GET', 'tmof');
			}
		});

		// 행정시도를 선택했을 경우
		$('#sidoCd').on('change', function(e) {
			var sidoCd = $(this).getData().sidoCd;

			if (sidoCd == '') {
				resetSggCd();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/sgg/' + sidoCd + '/Y', null, 'GET', 'sgg');
			}
		});

		// 시군구를 선택했을 경우
		$('#sggCd').on('change', function(e) {
			var sggCd = $(this).getData().sggCd;

			if (sggCd == '') {
				resetLDongCd();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/ldong/' + sggCd + '/Y', null, 'GET', 'ldong');
			}
		});

		// 운용팀을 선택했을 경우 // 라종식
	   	$('#opTeamOrgId').on('change', function(e) {

	   		 var orgID =  $("#opTeamOrgId").getData();
	   		 if(orgID.opTeamOrgId == ''){
	   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPost');

	   		 }else{
	   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/' + orgID.opTeamOrgId+'/D', null, 'GET', 'opPost');
	   		 }
       });
		// 조회
		$('#btnSearch').on('click', function(e) {
			main.setGrid(1, perPage);
		});

		// 엔터키로 조회
		$('#searchForm').on('keydown', function(e){
			if (e.which == 13) {
				main.setGrid(1, perPage);
			}
		});

		// 법정동별 팀매핑정보 등록
		$('#btnReg').on('click', function(e) {
			var param = { 'regYn': 'N', 'ldongCd': '' };
			popupLDongTeamReg('LDongTeamReg', '법정동별팀등록', $('#ctx').val() + '/configmgmt/common/LDongTeamReg.do', param);
		});

		// 법정동별 팀매핑 상세정보 조회
		$('#' + gridId).on('dblclick', '.bodycell', function(e) {
			var param = AlopexGrid.parseEvent(e).data;
			param.regYn = 'Y';
			popupLDongTeamDetail('LDongTeamDtlLkup', '법정동별팀 상세정보', $('#ctx').val() + '/configmgmt/common/LDongTeamDtlLkup.do', param)
		});
	}

	function successCallback(response, status, jqxhr, flag) {
		if (flag == 'fstOrg') {	// 첫번째 본부 콤보박스
			var mgmtGrpNm = $('#mgmtGrpNm').getData().mgmtGrpNm;

			var chrrOrgGrpCd;
			if (mgmtGrpNm == '' || mgmtGrpNm == null) {
				if ($('#chrrOrgGrpCd').val() == '') {
					chrrOrgGrpCd = 'SKT';
				} else {
					chrrOrgGrpCd = $('#chrrOrgGrpCd').val();
				}
			} else {
				chrrOrgGrpCd = mgmtGrpNm;
			}


			var sUprOrgId = '';
			if ($('#sUprOrgId').val() != '') {
				sUprOrgId = $('#sUprOrgId').val();
			}

			var option_data = resetOrgId();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (this.orgId == sUprOrgId) {
					selectId = this.orgId;
				}
			});

			if (response.length > 0 && selectId == '') {
				selectId = response[0].orgId;
				sUprOrgId = selectId;
			}

			$('#orgId').setData({
				data: option_data,
				orgId: selectId
			});

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
		} else if (flag == 'org') {	// 본부 콤보박스
			var option_data = resetOrgId();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#orgId').setData({
				data: option_data
			});
		} else if (flag == 'fstTeam') {	// 첫번째 팀 콤보박스
			var mgmtGrpNm = $('#mgmtGrpNm').getData().mgmtGrpNm;

			var chrrOrgGrpCd;
			if (mgmtGrpNm == '' || mgmtGrpNm == null) {
				if ($('#chrrOrgGrpCd').val() == '') {
					chrrOrgGrpCd = 'SKT';
				} else {
					chrrOrgGrpCd = $('#chrrOrgGrpCd').val();
				}
			} else {
				chrrOrgGrpCd = mgmtGrpNm;
			}

			var sOrgId = '';
			if ($('#sOrgId').val() != '') {
				sOrgId = $('#sOrgId').val();
			}

			var option_data = resetTeamId();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (this.orgId == sOrgId) {
					selectId = this.orgId;
				}
			});

			if (response.length > 0 && selectId == '') {
				selectId = response[0].orgId;
			}

			$('#teamId').setData({
				data: option_data,
				teamId: selectId
			});

			if ($('#teamId').getData().teamId != '') {
				sOrgId = selectId;
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
			} else {
				$('#teamId').setData({
					teamId: ''
				});
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#orgId').val() + '/ALL', null, 'GET', 'tmof');
			}
		} else if (flag == 'team') {	// 팀 콤보박스
			var option_data = resetTeamId();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#teamId').setData({
				data: option_data
			});
		} else if (flag == 'tmof') {	// 전송실 콤보박스
			var option_data = resetTmofId();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#tmofId').setData({
				data: option_data
			});
		} else if (flag == 'mgmtGrpNm') {	// 관리그룹 콤보박스
			var chrrOrgGrpCd;
			if ($('#chrrOrgGrpCd').val() == '') {
				chrrOrgGrpCd = 'SKT';
			} else {
				chrrOrgGrpCd = $('#chrrOrgGrpCd').val();
			}

			$('#mgmtGrpNm').clear();

			var selectId = '';
			$.each(response, function(index) {
				if (this.comCdNm == chrrOrgGrpCd) {
					selectId = this.comCdNm;
					return false;
				}
			});

			// 관리그룹을 SKT만 콤보박스에 설정 되도록 하는 로직
			var responseData = [];
			$.each(response, function(index) {
				if (this.comCdNm == 'SKT') {
					responseData.push(this);
				}
			});

			$('#mgmtGrpNm').setData({
				data: responseData,
				mgmtGrpNm: selectId
			});
		} else if (flag == 'opTeam') {	// 운용팀 콤보박스
			var option_data = resetOpTeamId();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#opTeamOrgId').setData({
				data: option_data
			});
		} else if (flag == 'opPost') {	// 운용POST 콤보박스 // 라종식
			var option_data = resetOpPostId();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#opPostOrgId').setData({
				data: option_data
			});
		} else if (flag == 'sido') {
			var option_data = resetSidoCd();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#sidoCd').setData({
				data: option_data
			});
		} else if (flag == 'sgg') {
			var option_data = resetSggCd();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#sggCd').setData({
				data: option_data
			});
		} else if (flag == 'ldong') {
			var option_data = resetLDongCd();

			$.each(response, function(index) {
				option_data.push(this);
			});

			$('#ldongCd').setData({
				data: option_data
			});
		} else if (flag == 'search') {	// 조회 시
			$('#' + gridId).alopexGrid('hideProgress');
			setSPGrid(gridId, response, response.ldongTeamMgmtList);
		}
	}

	// request 실패시.
	function failCallback(response, status, jqxhr, flag) {
		if (flag == 'search') {
			// 조회 실패 하였습니다.
			callMsgBox('', 'I', configMsgArray['searchFail'], function(msgId, msgRst) {});
		}
	}

	this.setGrid = function(page, rowPerPage) {
		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);

		var param = $("#searchForm").serialize();

		$('#' + gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam', param, 'GET', 'search');
	}

	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url: Url,		// URL 기존 처럼 사용하시면 됩니다.
			data: Param,	// data가 존재할 경우 주입
			method: Method,	// HTTP Method
			flag: Flag
		}).done(successCallback).fail(failCallback);
	};

	function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
			dataLength: Option.pager.totalCnt,	// 총 데이터 길이
			current: Option.pager.pageNo,		// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
			perPage: Option.pager.rowPerPage	// 한 페이지에 보일 데이터 갯수
		};
		$('#' + GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

	function resetOrgId() {
		$('#orgId').clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['all']
		}];

		$('#orgId').setData({
			data: option_data
		});

		return option_data;
	}

	function resetTeamId() {
		$('#teamId').clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['all']
		}];

		$('#teamId').setData({
			data: option_data
		});

		return option_data;
	}

	function resetTmofId() {
		$('#tmofId').clear();

		var option_data = [{
			mtsoId: '',
			mtsoNm: configMsgArray['all']
		}];

		$('#tmofId').setData({
			data: option_data
		});

		return option_data;
	}

	function resetOpTeamId() {
		$('#opTeamOrgId').clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['all']
		}];

		$('#opTeamOrgId').setData({
			data: option_data
		});

		return option_data;
	}

	function resetOpPostId() { // 라종식
		$('#opPostOrgId').clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['all']
		}];

		$('#opPostOrgId').setData({
			data: option_data
		});
		return option_data;
	}

	function resetSidoCd() {
		$('#sidoCd').clear();

		var option_data = [{
			sidoCd: '',
			sidoNm: configMsgArray['all']
		}];

		$('#sidoCd').setData({
			data: option_data
		});

		resetSggCd();

		return option_data;
	}

	function resetSggCd() {
		$('#sggCd').clear();

		var option_data = [{
			sggCd: '',
			sggNm: configMsgArray['all']
		}];

		$('#sggCd').setData({
			data: option_data
		});

		resetLDongCd();

		return option_data;
	}

	function resetLDongCd() {
		$('#ldongCd').clear();

		var option_data = [{
			ldongCd: '',
			ldongNm: configMsgArray['all']
		}];

		$('#ldongCd').setData({
			data: option_data
		});

		return option_data;
	}

	function popupLDongTeamReg(id, title, url, param) {
		$a.popup({
			popid: id,
			title: title,
			url: url,
			data: param,
			iframe: false,
			modal: true,
			movable: true,
			width: 865,
			height: window.innerHeight * 0.4
		});
	}

	function popupLDongTeamDetail(id, title, url, param) {
		$a.popup({
			popid: id,
			title: title,
			url: url,
			data: param,
			iframe: false,
			modal: true,
			movable: true,
			width: 865,
			height: window.innerHeight * 0.4
		});
	}
});
