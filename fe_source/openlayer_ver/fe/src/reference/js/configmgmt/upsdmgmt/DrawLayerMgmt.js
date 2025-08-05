/**
 * DrawLayerMgmt.js
 *
 * @author Administrator
 * @date 2017. 11. 22.
 * @version 1.0
 */
$a.page(function() {
	var gridId = 'gridData';
	this.init = function(id, param) {

		initGrid();
		setGrid();
		setEventListener();
    };
 // Grid 초기화
    function initGrid() {

    	//그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 450,
        	rowInlineEdit: true,
        	autoColumnIndex: true,
    		autoResize: true,
    		paging : {
				pagerTotal: false,
			},
    		columnMapping: [{
				key : 'layerName', align:'center',
				title : '레이어명',
				width: '50',
				editable: true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('.alopexgrid-pager').remove();
    };
    // request 성공시
    function successCallback(response, status, jqxhr, flag, responseJSON){
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.drawLayerList);
    	}

    	if(flag == 'saveDrawLayers'){
    		if(response.Result == "Success"){
    			//저장을 완료 하였습니다.
    			callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
    				if(msgRst == 'Y'){
    					a.close(response);
    				}
    			});
    		} else if( response.Result == "Fail"){
    			callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    		}
    		setGrid();
    	}


    }

    // request 실패시.
    function failCallback(response, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }


    // event 등록
    function setEventListener() {

    	// 닫기
        $('#btnCncl').on('click', function(e) {
        	$a.close();
        });

        //저장
        $('#btnSave').on('click', function(e) {
        	data = $('#'+gridId).alopexGrid("dataGet", {_state: { added: true}},{_state: {edited: true}},{_state: {deleted: true}});
    		if (data == null || data == "") {
				alertBox('W', "변경된 데이터가 없습니다.");
				return;
			}
    		for(var i=0; i<data.length; i++){
    			if(data[i]._state.deleted){
    				data[i].status = 'D';
    			}else if(data[i]._state.added){
    				data[i].status = 'I';
    			}else{
    				data[i].status = 'U';
    			}
    		}
    		/*
    		var fileExtensionChk = fileChk.toLowerCase();
			if (fileExtensionChk.indexOf(".xls") < 0 && fileExtensionChk.indexOf(".xlsx") < 0) {
				alertBox('W', "확장자가 xlsx혹은 xls만 가능합니다.");
				return;
			}
			*/
    		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
    			//저장한다고 하였을 경우
 		        if (msgRst == 'Y') {
 		        	httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/saveDrawLayers', JSON.stringify(data), 'post', 'saveDrawLayers');
 		        }
		     });
        });

        //추가
        $('#btnAdd').on('click', function(e) {
        	var length = $('#'+gridId).alopexGrid("pageInfo").dataLength;
        	$('#'+gridId).alopexGrid("dataAdd", $.extend({},{layerName:'레이어명 입력',status:'I',sortOrder:length+1}),{_index:{data:length}});
        });
        //삭제
        $('#btnDel').on('click', function(e) {
        	var data = $('#'+gridId).alopexGrid("dataGet", {_state: { selected: true}});
        	$('#'+gridId).alopexGrid("dataDelete", {_state: { selected: true}});
        });
	};



	function setGrid(){
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getDrawLayers', '', 'GET', 'search')
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