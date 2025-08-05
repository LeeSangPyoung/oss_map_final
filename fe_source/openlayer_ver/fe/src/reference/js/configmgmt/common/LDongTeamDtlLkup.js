/**
 * LDongTeamDtlLkup.js
 *
 * @author Administrator
 * @date 2018. 1. 15. 오전 13:30:03
 * @version 1.0
 */

$a.page(function() {

	// 초기 진입점
	// param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var paramData = null;

	this.init = function(id, param) {
		setEventListener();
		setRegDataSet(param);
		paramData = param;
	};

	function setRegDataSet(data) {
		$('#ldongTeamDtlLkupArea').setData(data);
	}

	function setEventListener() {
		// 수정
		$('#btnModLkup').on('click', function(e) {
			// tango transmission biz 모듈을 호출하여야한다.
			 var param =  $('#ldongTeamDtlLkupForm').getData();
			 param.regYn = 'Y';
			 param.sidoCd = param.ldongCd.substring(0, 2);
			 param.sggCd = param.ldongCd.substring(0, 5);
			 console.log(param);
			 $a.popup({
				 popid: 'LDongTeamReg',
				 title: '법정동별팀수정',
				 url: $('#ctx').val() + '/configmgmt/common/LDongTeamReg.do',
				 data: param,
				 iframe: false,
				 modal: true,
				 movable: true,
				 width: 865,
				 height: window.innerHeight * 0.4,
				 callback: function(data) { // 팝업창을 닫을 때 실행 
				 }
			 });
			 $a.close();
	     });
		$('#btnClose').on('click', function(e) {
			// tango transmission biz 모듈을 호출하여야한다.
			$a.close();
		});
	}
});
