/**
 * LDongTeamReg.js
 *
 * @author Administrator
 * @date 2018. 1. 10. 오전 09:05:03
 * @version 1.0
 */
$a.page(function() {
	//초기 진입점
	//param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.

	var paramData = null;
	var $ldongTeamRegArea = $('#ldongTeamRegArea');
	var $ldongTeamRegForm = $ldongTeamRegArea.find('#ldongTeamRegForm');
	var $regYn = $ldongTeamRegArea.find('#regYn');
	var $userId = $ldongTeamRegArea.find('#userId');
	var $chrrOrgGrpCd = $ldongTeamRegArea.find('#chrrOrgGrpCd');
	var $sidoCd = $ldongTeamRegArea.find('#sidoCd');
	var $sggCd = $ldongTeamRegArea.find('#sggCd');
	var $ldongCd = $ldongTeamRegArea.find('#ldongCd');
	var $mgmtGrpNm = $ldongTeamRegArea.find('#mgmtGrpNm');
	var $orgId = $ldongTeamRegArea.find('#orgId');
	var $teamId = $ldongTeamRegArea.find('#teamId');
	var $tmofId = $ldongTeamRegArea.find('#tmofId');
	var $opTeamOrgId = $ldongTeamRegArea.find('#opTeamOrgId');
	var $opPostOrgId = $ldongTeamRegArea.find('#opPostOrgId');
	var $btnCncl = $ldongTeamRegArea.find('#btnCncl');
	var $btnSave = $ldongTeamRegArea.find('#btnSave');

	this.init = function(id, param) {
		if (param.regYn == 'Y') {
			paramData = param;
			$regYn.val('Y');
		}
		setEventListener();
		setSelectCode();
		setRegDataSet(param);
	};

	function setRegDataSet(data) {
		if (data.regYn == 'Y') {
			$ldongTeamRegArea.setData(data);
			$sidoCd.setEnabled(false);
			$sggCd.setEnabled(false);
			$ldongCd.setEnabled(false);
		}
	}

	function setSelectCode() {
		// 관리그룹조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
		// 운용팀 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');
		// 운용POST 조회 // 라종식
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/' + ($regYn.getData().regYn != 'Y' ? 'ALL' : paramData.opTeamOrgId) + '/D', null, 'GET', 'opPost');
		// 행정시도 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/sido/' + ($regYn.getData().regYn != 'Y' ? 'N' : 'Y'), null, 'GET', 'sido');
	}

	function setEventListener() {
		// 관리그룹 선택시 이벤트
		$mgmtGrpNm.on('change', function(e) {
			var mgmtGrpNm = $(this).getData().mgmtGrpNm;

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/' + mgmtGrpNm, null, 'GET', 'org');
		});

		// 본부 선택시 이벤트
		$orgId.on('change', function(e) {
			var orgId =  $(this).getData().orgId;

			if (orgId == '') {
				resetTeamId();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgId, null, 'GET', 'team');
			}
		});

		// 팀을 선택했을 경우
		$teamId.on('change', function(e) {
			var orgId = $orgId.getData().orgId;
			var teamId = $(this).getData().teamId;

			if (teamId == '') {
				if (orgId == '') {
					var mgmtGrpNm = $(this).getData().mgmtGrpNm;
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/' + mgmtGrpNm, null, 'GET', 'tmof');
				} else {
					httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgId + '/ALL', null,'GET', 'tmof');
				}
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + teamId, null,'GET', 'tmof');
			}
		});

		// 운용팀을 선택했을 경우 // 라종식
		$opTeamOrgId.on('change', function(e) {
			var opTeamOrgId = $(this).getData().opTeamOrgId;
	   		 if(opTeamOrgId == ''){
	   			 resetOpPostOrgId();
	   		 }else{
	   			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/' + opTeamOrgId+'/D', null, 'GET', 'opPost');
	   		 }
       });
		// 행정시도를 선택했을 경우
		$sidoCd.on('change', function(e) {
			var sidoCd = $(this).getData().sidoCd;

			if (sidoCd == '') {
				resetSggCd();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/sgg/' + sidoCd + '/' + ($regYn.getData().regYn != 'Y' ? 'N' : 'Y'), null, 'GET', 'sgg');
			}
		});

		// 시군구를 선택했을 경우
		$sggCd.on('change', function(e) {
			var sggCd = $(this).getData().sggCd;

			if (sggCd == '') {
				resetLDongCd();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/ldong/' + sggCd + '/' + ($regYn.getData().regYn != 'Y' ? 'N' : 'Y'), null, 'GET', 'ldong');
			}
		});

		// 취소
		$btnCncl.on('click', function(e) {
			// tango transmission biz 모듈을 호출하여야한다.
			$a.close();
		});

		// 저장
		$btnSave.on('click', function(e) {
			var param =  $ldongTeamRegForm.getData();

			if (param.ldongCd == '') {
				//필수 선택 항목입니다.[ 읍면동 ]
				callMsgBox('', 'I', makeArgConfigMsg('requiredOption', '읍면동'), function(msgId, msgRst) { });
				return;
			}

			if (param.orgId == '') {
				//필수 선택 항목입니다.[ 본부 ]
				callMsgBox('', 'I', makeArgConfigMsg('requiredOption', configMsgArray['hdofc']), function(msgId, msgRst) { });
				return;
			}

			if (param.teamId == '') {
				//필수 선택 항목입니다.[ 팀 ]
				callMsgBox('', 'I', makeArgConfigMsg('requiredOption', configMsgArray['team']), function(msgId, msgRst) { });
				return;
			}

			if (param.tmofId == '') {
				//필수 선택 항목입니다.[ 전송실 ]
				callMsgBox('', 'I', makeArgConfigMsg('requiredOption', configMsgArray['transmissionOffice']), function(msgId, msgRst) { });
				return;
			}

			if (param.opTeamOrgId == '') {
				//필수 선택 항목입니다.[ 운용팀 ]
				callMsgBox('', 'I', makeArgConfigMsg('requiredOption', '운용팀'), function(msgId, msgRst) { });
				return;
			}

			if (param.opPostOrgId == '') { // 라종식
				//필수 선택 항목입니다.[ 운용POST ]
				callMsgBox('', 'I', makeArgConfigMsg('requiredOption', '운용POST'), function(msgId, msgRst) { });
				return;
			}
			// tango transmission biz 모듈을 호출하여야한다.
			callMsgBox('', 'C', configMsgArray['saveConfirm'], function(msgId, msgRst) {
				// 저장한다고 하였을 경우
				if (msgRst == 'Y') {
					ldongTeamReg();
				}
			});
		});
	}

	function ldongTeamReg() {
		var param =  $ldongTeamRegForm.getData();

		var userId;
		if ($userId.val() == '') {
			userId = 'SYSTEM';
		} else {
			userId = $userId.val();
		}

		param.frstRegUserId = userId;
		param.lastChgUserId = userId;

		httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/save', param, 'POST', 'LDongTeamReg');
	}

	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url: Url,		// URL 기존 처럼 사용하시면 됩니다.
			data: Param,	// data가 존재할 경우 주입
			method: Method,	// HTTP Method
			flag: Flag
		}).done(successCallback).fail(failCallback);
	};

	// request 성공시
	function successCallback(response, status, jqxhr, flag) {
		if (flag == 'LDongTeamReg') {	// 저장
			if (response.Result == 'Success') {
				// 저장을 완료 하였습니다.
				callMsgBox('', 'I', configMsgArray['saveSuccess'], function(msgId, msgRst) {
	    			if (msgRst == 'Y') {
	    				$a.close();
	    			}
				});

	    		var pageNo = $('#pageNo', parent.document).val();
	    		var rowPerPage = $('#rowPerPage', parent.document).val();

	    		$(parent.location).attr('href', 'javascript:main.setGrid(' + pageNo + ',' + rowPerPage + ');');
			}
		} else if (flag == 'mgmtGrpNm') {	// 관리그룹 콤보박스
			var chrrOrgGrpCd = $chrrOrgGrpCd.val() || 'SKT';

			// 관리그룹을 SKT만 콤보박스에 설정 되도록 하는 로직
			var option_data = [];
			$.each(response, function(index) {
				if (this.comCdNm == 'SKT') {
					option_data.push(this);
				}
			});
			$mgmtGrpNm.setData({
				data: option_data,
				mgmtGrpNm: chrrOrgGrpCd
			});

			// 본부조회
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'org');
		} else if (flag == 'org') {		// 본부 콤보박스
			var option_data = resetOrgId();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (paramData != null && this.orgId == paramData.orgId) {
 					selectId = this.orgId;
 				}
			});

			$orgId.setData({
				data: option_data,
				orgId: selectId
			});

			if (selectId == '') {
				resetTeamId();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + selectId, null, 'GET', 'team');
			}
		} else if (flag == 'team') {	// 팀 콤보박스
			var option_data = resetTeamId();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
 				if (paramData != null && this.orgId == paramData.teamId) {
 					selectId = this.orgId;
 				}
			});

			$teamId.setData({
				data: option_data,
				teamId: selectId
			});

			if (selectId == '') {
				resetTmofId();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + selectId, null,'GET', 'tmof');
			}
		} else if (flag == 'tmof') {	// 전송실 콤보박스
			var option_data = resetTmofId();

			var selectId = '';
			$.each(response, function(index) {
 				option_data.push(this);
 				if (paramData != null && this.mtsoId == paramData.tmofId) {
 					selectId = this.mtsoId;
 				}
			});

			$tmofId.setData({
				data: option_data,
				tmofId: selectId
			});
		} else if (flag == 'opTeam') {	// 운용팀 콤보박스
			var option_data = resetOpTeamOrgId();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (paramData != null && this.orgId == paramData.opTeamOrgId) {
 					selectId = this.orgId;
 				}
			});

			$opTeamOrgId.setData({
				data: option_data,
				opTeamOrgId: selectId
			});
		} else if (flag == 'opPost') {	// 운용POST 콤보박스 // 라종식
			var option_data = resetOpPostOrgId();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (paramData != null && this.orgId == paramData.opPostOrgId) {
					selectId = this.orgId;
				}
			});

			$opPostOrgId.setData({
				data: option_data,
				opPostOrgId: selectId
			});
		} else if (flag == 'sido') {
			var option_data = resetSidoCd();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (paramData != null && this.sidoCd == paramData.sidoCd) {
					selectId = this.sidoCd;
				}
			});

			$sidoCd.setData({
				data: option_data,
				sidoCd: selectId
			});

			if (selectId == '') {
				resetSggCd();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/sgg/' + selectId + '/' + ($regYn.getData().regYn != 'Y' ? 'N' : 'Y'), null, 'GET', 'sgg');
			}
		} else if (flag == 'sgg') {
			var option_data = resetSggCd();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (paramData != null && this.sggCd == paramData.sggCd) {
					selectId = this.sggCd;
				}
			});

			$sggCd.setData({
				data: option_data,
				sggCd: selectId
			});

			if (selectId == '') {
				resetLDongCd();
			} else {
				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/ldongteam/ldong/' + selectId + '/' + ($regYn.getData().regYn != 'Y' ? 'N' : 'Y'), null, 'GET', 'ldong');
			}
		} else if (flag == 'ldong') {
			var option_data = resetLDongCd();

			var selectId = '';
			$.each(response, function(index) {
				option_data.push(this);
				if (paramData != null && this.ldongCd == paramData.ldongCd) {
					selectId = this.ldongCd;
				}
			});

			$ldongCd.setData({
				data: option_data,
				ldongCd: selectId
			});
		}
	}

	// request 실패시.
	function failCallback(response, status, jqxhr, flag) {
		if (flag == 'LDongTeamReg') {
			// 저장을 실패 하였습니다.
			callMsgBox('', 'I', configMsgArray['saveFail'], function(msgId, msgRst) { });
		}
	}

	function resetOrgId() {
		$orgId.clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['select']
		}];

		$orgId.setData({
			data: option_data
		});

		resetTeamId();

		return option_data;
	}

	function resetTeamId() {
		$teamId.clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['select']
		}];

		$teamId.setData({
			data: option_data
		});

		resetTmofId();

		return option_data;
	}

	function resetTmofId() {
		$tmofId.clear();

		var option_data = [{
			mtsoId: '',
			mtsoNm: configMsgArray['select']
		}];

		$tmofId.setData({
			data: option_data
		});

		return option_data;
	}

	function resetOpTeamOrgId() {
		$opTeamOrgId.clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['select']
		}];

		$opTeamOrgId.setData({
			data: option_data
		});

		return option_data;
	}

	function resetOpPostOrgId() { // 라종식
		$opPostOrgId.clear();

		var option_data = [{
			orgId: '',
			orgNm: configMsgArray['select']
		}];

		$opPostOrgId.setData({
			data: option_data
		});
		return option_data;
	}

	function resetSidoCd() {
		$sidoCd.clear();

		var option_data = [{
			sidoCd: '',
			sidoNm: configMsgArray['select']
		}];

		$sidoCd.setData({
			data: option_data
		});

		resetSggCd();

		return option_data;
	}

	function resetSggCd() {
		$sggCd.clear();

		var option_data = [{
			sggCd: '',
			sggNm: configMsgArray['select']
		}];

		$sggCd.setData({
			data: option_data
		});

		resetLDongCd();

		return option_data;
	}

	function resetLDongCd() {
		$ldongCd.clear();

		var option_data = [{
			ldongCd: '',
			ldongNm: configMsgArray['select']
		}];

		$ldongCd.setData({
			data: option_data
		});

		return option_data;
	}
});
