/**
 * SmtsoRackInMgmtDetail.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataDetailGrid';
	var paramData = null;

    this.init = function(id, param) {
    	paramData = param;
    	initGrid();
    	setEventListener();

    	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getSmtsoRackInMgmtDetailList', {modelId : param.modelId}, 'GET', '')
    };

    function initGrid() {
		$('#'+gridId).alopexGrid({
							width : 'parent',
							height : 600,
							fitTableWidth : true,
							autoColumnIndex : true,
							numberingColumnFromZero : false,
							pager : false,
				    		paging : {
				    			pagerTotal: false,
				        	},
							defaultColumnMapping : {
								resizing : true,
							},
							columnMapping : [
								{
									align : 'center',
									width : 20,
									numberingColumn : true
								}, {
									align : 'center',
									width : 50,
									key : 'lv1Nm',
									title : '대분류'
								}, {
									align : 'center',
									width : 50,
									key : 'lv2Nm',
									title : '중분류'
								}, {
									align : 'center',
									width : 50,
									key : 'modelNm',
									title : '모델명'
								}, {
									align : 'center',
									width : 50,
									key : 'vendor',
									title : '제조사'
								}, {
									align : 'center',
									width : 50,
									key : 'unitSize',
									title : 'UNIT_Size'
								}, {
									align : 'center',
									width : 150,
									key : 'systemNm',
									title : '시스템명'
								}, {
									align : 'center',
									width : 50,
									key : 'sPos',
									title : '시작위치'
								}, {
									align : 'center',
									width : 50,
									key : 'ePos',
									title : '종료위치'
								}, {
									align : 'center',
									width : 50,
									key : 'affairCd',
									title : '소유구분'
								}, {
									align : 'center',
									width : 50,
									key : 'manager',
									title : '관리자'
								}
							],
							message : {
								nodata : '<div class="no_data"><i class="fa fa-exclamation-triangle"></i>선택된 데이터가 없습니다.</div>'
							}
		});
	}

    function setEventListener() {
    	$('#btnClose').on('click', function(e) {
    		$a.close();
    	});
    }

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	$('#'+gridId).alopexGrid('hideProgress');
    	$('#'+gridId).alopexGrid('dataSet', response.smtsoRackInMgmtDetailList);
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    }

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

});