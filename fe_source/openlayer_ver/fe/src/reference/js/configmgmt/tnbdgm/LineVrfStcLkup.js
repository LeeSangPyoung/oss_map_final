/**
 * LineVrfStcLkup.js
 *
 * @author Administrator
 * @date 2017. 10. 28.
 * @version 1.0
 */
var Lkup = $a.page(function() {

	var gridId = 'lineGrid';
	var paramData = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	paramData = param;
    	initGrid();
    	setBlgt();
    	setEventListener();
        Lkup.setGrid();
    };

	//Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 400,
        	autoColumnIndex: true,
        	autoResize: true,
        	numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
				key : 'custName', align:'center',
				title : '회선명/고객명',
				width: '150px'
			}, {
				key : 'svlnCustNo', align : 'center',
				title : '고객번호',
				width : '100px'
			},{
				key : 'svlnNo', align : 'center',
				title : '회선번호',
				width : '110px'
			}, {
				key : 'srvcMgmtNo', align : 'center',
				title : '가입자서비스번호',
				width : '110px'
			}, {
				key : 'uprMtsoNm', align : 'center',
				title : '상위국',
				width : '100px'
			}, {
				key : 'lowMtsoNm', align : 'center',
				title : '하위국',
				width : '100px'
			}, {
				key : 'lineStatDesc', align : 'center',
				title : '상태',
				width : '300px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

    };

    function setEventListener() {

    	//조회
    	$('#btnSearch').on('click', function(e) {
    		Lkup.setGrid();
    	});

    	//엔터키로 조회
        $('#lineVrfStcLkupForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			Lkup.setGrid();
      		}
    	 });

    	//row 더블클릭시
    	$('#'+gridId).on('dblclick','.bodycell', function(e) {
    		var evObj = AlopexGrid.parseEvent(e).data;
    		$a.popup({
        		popid: 'LineVrfStcLkupPop',
        		title: '상세내역',
        		url: '/tango-transmission-web/configmgmt/tnbdgm/LineVrfStcLkupPop.do',
        		data: evObj,
        		iframe: false,
    			modal : false,
    			windowpopup : true,
        		width : 1000,
        		height : window.innerHeight * 0.8
        	});
    	});

    	//닫기
    	$('#btnCncl').on('click', function(e) {
    		$a.close();
    	});

    	//엑셀다운
		$('#btnExportExcel').on('click', function(e){
			//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#lineVrfStcLkupForm").getData();

    		param = gridExcelColumn(param, gridId);

    		param.fileName = 'LineVrfStcListLkup_';
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "getLineDtlList";

    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/excelcreate', param, 'GET', 'excelDownload');
		});
    };

    /*------------------------*
	  * 엑셀 다운로드
	  *------------------------*/

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		//console.log(gridHeader);
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		//param.excelHeaderInfo = gridColmnInfo;

		return param;
	}

    function setBlgt() {
    	//소속
    	if(paramData.mngGrpNm == "합계"){
    		$('#blgt').val(paramData.mngGrpNm);
    	}else if(paramData.orgNm=="소계"){
    		$('#blgt').val(paramData.mngGrpNm+' - '+paramData.orgNm);
    	}else if(paramData.teamNm=="소계"){
    		$('#blgt').val(paramData.mngGrpNm+' - '+paramData.orgNm+' - '+paramData.teamNm);
    	}else{
    		$('#blgt').val(paramData.mngGrpNm+' - '+paramData.orgNm+' - '+paramData.teamNm+' - '+paramData.tmofNm);
    	}
		$('#mngGrpNm').val('SKB');
    	$('#orgId').val(paramData.orgId);
		$('#teamId').val(paramData.teamId);
		$('#tmofId').val(paramData.tmofId);
		$('#svlnLclCd').val(paramData.svlnLclCd);
		$('#svlnSclCd').val(paramData.svlnSclCd);
		$('#mtsoVrfRsltVal').val(paramData.mtsoVrfRsltVal);
    };

	function onDemandExcelCreatePop ( jobInstanceId ){
        // 엑셀다운로드팝업
         $a.popup({
                popid: 'CommonExcelDownlodPop' + jobInstanceId,
                title: '엑셀다운로드',
                iframe: true,
                modal : false,
                windowpopup : true,
                url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
                data: {
                    jobInstanceId : jobInstanceId,
                    fileName : fileOnDemendName,
                    fileExtension : "xlsx"
                },
                width : 500,
                height : 300
                ,callback: function(resultCode) {
                    if (resultCode == "OK") {
                        //$('#btnSearch').click();
                    }
                }
            });
	}
	function successCallback(response, status, jqxhr, flag){
    	//조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId,response.lineDtlList);
    	}

    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
            // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();
        }
	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }


    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    this.setGrid = function(){
		 var param =  $("#lineVrfStcLkupForm").serialize();
 		 $('#'+gridId).alopexGrid('showProgress');
 		 httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/getLineDtlList', param, 'GET', 'search');
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

    function setSPGrid(GridID,Data) {
	       	$('#'+GridID).alopexGrid('dataSet', Data);
	}
});