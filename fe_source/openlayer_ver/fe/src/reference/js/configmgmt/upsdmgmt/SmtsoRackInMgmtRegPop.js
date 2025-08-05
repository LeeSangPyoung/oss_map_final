/**
 * SmtsoMatlMgmtRegPop.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'execlUploadGrid';
	var paramData = null;

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	initGrid();
        setEventListener();

        //console.log('>>> ' + paramData);
    };

  //Grid 초기화
    function initGrid() {
    	//그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 400,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		paging : {
    			//pagerSelect: [15,30,60,100],
    			hidePageList: false  // pager 중앙 삭제
    		},
    		rowSelectOption: {
    			clickSelect: false
    		},
    		rowOption: {
    			styleclass : function(data, rowOption){
    				if((data['systemNm'] == '' || data['systemNm'] == undefined) || (data['sPos'] == undefined || data['sPos'] == '') || (data['rackInId'] == undefined || data['rackInId'] == '')){
    					return 'row-highlight'
    				}
	    		}
    		},
    		columnMapping: [
    		{
				align:'center',
				title : configMsgArray['sequence'],
				width: '30',
				numberingColumn: true,
    		}, {/* 시스템명(*) */
    			align:'center',
				key : 'systemNm',
				title : '시스템명(*)',
				width: '50'
			}, {/* 시작위치(*) */
    			align:'center',
				key : 'sPos',
				title : '시작위치(*)',
				width: '50'
			}, {/* 실장 아이디(*) */
    			align:'center',
				key : 'rackInId',
				title : '실장 아이디(*)',
				width: '150'
			}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['itemType', 'itemId'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setEventListener() {
    	//excel 템플릿 다운로드 이벤트
    	$('#btnDownExcel').on('click', function(e) {
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/upsdmgmt/downloadfile");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요
			// X-Remote-Id와 X-Auth-Token을 parameter로 넘기기 위한 함수(open api를 통하므로 반드시 작성)
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="orgRackIn_default.xlsx" />');
			$form.appendTo('body');
			$form.submit().remove();
		});

    	//excel 불러오기 버튼 Click Event Listener 등록
    	$('#btnUploadExcel').on('click', function(e) {
    		//$('#import_file_input').click();
    		btnExcelUploadClickEventHandler(e);
		});

        // 엑셀 파일 선택 Event Handler 등록
        $("#excelFile").on('change', function(e) {
            excelFileChangeEventHandler(e);
        });

        //저장
        $('#btnSave').on('click', function(e) {
        	var insertParam = $('#'+gridId).alopexGrid('dataGet', { _state : { added:true }});
        	if(insertParam.length > 0) {
        		//체크로직
        		if(valid(insertParam) == false) return false;
        		//console.log('>>> ');
        		callMsgBox('','C', configMsgArray['saveConfirm'], function(msgId, msgRst){
        			//저장한다고 하였을 경우
        			if (msgRst == 'Y') {
        				httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/insertSmtsoRackInMgmtReg', insertParam, 'POST', 'execlUploadReg');
        			}
    		     });
        	} else {
        		callMsgBox('','I', '저장할 실장관리 엑셀정보 목록이 없습니다.', function(msgId, msgRst){});
        	}
        });

        //취소
        $('#btnCncl').on('click', function(e) {
        	$a.close();
        });
	};

	// 밸리데이션
	function valid(insertParam) {
		for(var i=0; i<insertParam.length; i++){
			if(insertParam[i].systemNm == '' || insertParam[i].systemNm == undefined) {
				callMsgBox('','I', '저장할 엑셀정보에 문제가 있습니다.\n필수값 및 시스템명, 시작위치, 실장아이디를 확인 후 다시 엑셀 추출하시기 바랍니다.', function(msgId, msgRst){});
				return false;
			}
			if(insertParam[i].sPos == undefined || insertParam[i].sPos == '') {
				callMsgBox('','I', '저장할 엑셀정보에 문제가 있습니다.\n필수값 및 시스템명, 시작위치, 실장아이디를 확인 후 다시 엑셀 추출하시기 바랍니다.', function(msgId, msgRst){});
				return false;
			}
			if(insertParam[i].rackInId == undefined || insertParam[i].rackInId == '') {
				callMsgBox('','I', '저장할 엑셀정보에 문제가 있습니다.\n필수값 및 시스템명, 시작위치, 실장아이디를 확인 후 다시 엑셀 추출하시기 바랍니다.', function(msgId, msgRst){});
				return false;
			}
		}
		return true;
	}

    //엑셀올리기
    function btnExcelUploadClickEventHandler(event){
        $('#excelFile').val('');
        $('#excelFile').trigger($.Event('click'));
    }
    //엑셀 그리드에 입력
    function excelFileChangeEventHandler(e){
    	var $input = $(this);
        var $grid = $('#'+gridId);
        var files = e.target.files;
        var worker = new ExcelWorker();
        var arr = [];

        //기존내역 삭제
        $('#'+gridId).alopexGrid('dataEmpty');

        worker.import($grid, files, function(dataList){
        	for(var i=0; i<dataList.length; i++){
        		if( (dataList[i].systemNm != '' && dataList[i].systemNm != undefined) ||
        				(dataList[i].sPos != undefined && dataList[i].sPos != '') ||
        				(dataList[i].rackInId != undefined && dataList[i].rackInId != '') ) {
        			//console.log(i + ' ' + paramData.id);
        			dataList[i].rackId = paramData.modelId;
        			arr.push(dataList[i]);
        		}
        	}
        	$('#'+gridId).alopexGrid('dataAdd', arr);
        });
        $input.val('');
    }

	function successCallback(response, status, jqxhr, flag){
		//저장후
		if(flag == 'execlUploadReg') {
			if(response.Result == "Success"){
				callMsgBox('','I', configMsgArray['saveSuccess'] , function(msgId, msgRst){
					$a.close();
				});

				//var pageNo = $("#pageNo", parent.document).val();
	    		//var rowPerPage = $("#rowPerPage", parent.document).val();

	            //$(parent.location).attr("href","javascript:main.setGrid("+pageNo+","+rowPerPage+","+paramData.level+","+paramData.id+");");
			}
		}
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'execlUploadReg'){
    		//저장을 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['saveFail'] , function(msgId, msgRst){});
    	}
    }

    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9

              });
        }

    function popup2(pidData, urlData, titleData, paramData) {
    	$a.popup({
				  	popid: pidData,
				  	title: titleData,
				      url: urlData,
				      data: paramData,
				      iframe: false,
				      modal: true,
				      movable:true,
				      width : 865,
				      height : window.innerHeight * 0.8
				  });
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