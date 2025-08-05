/**
 * EqpSrvcLineAcptCurst.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGridEqpLkup';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
        setGrid(1,100);
    };

    function setRegDataSet(data) {

    	$('#contentAreaEqpLkup').setData(data);
    }

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		rowOption:{inlineStyle: function(data,rowOption){
	    			if(data['eqpNm'] == $('#eqpNm1EqpLkup').val() || data['eqpNm'] == $('#eqpNm2EqpLkup').val())
	    				return {color:'red'} // background:'orange',
	    		}
	    	},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
    		}, {
    			key : 'maxBpsDt', align:'left',
				title : 'maxBpsDt',
				width: '70px'
    		}, {
    			key : 'eqpId', align:'left',
				title : '장비ID',
				width: '150px'
    		}, {
    			key : 'clctDt', align:'left',
				title : '일자',
				width: '150px'
    		}, {
    			key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '150px'
    		}, {
    			key : 'repIntgFcltsCd', align:'left',
				title : '공용대표시설코드',
				width: '100px'
    		}, { // (2017-05-29 : HS Kim) 추가 : 건물코드, 건물명
				key : 'bldCd', align:'left',
				title : '건물코드',
				width: '130px'
			}, {
    			key : 'intgFcltsCd', align:'left',
				title : '주소',	// addr
				width: '180px'
			}, {
    			key : 'bldNm', align:'left',
				title : '건물명',
				width: '130px'
			}, {
				key : 'eqpNm', align:'left',
				title : '장비명',
				width: '200px'
			}, {
				key : 'aportIdChnlVal', align:'left',
				title : 'A Port',
				width: '100px'
			}, {
				key : 'aportInBpsVal', align:'right',
				title : 'A INBPS(Mb)',
				width: '110px'
			}, {
				key : 'aportOutBpsVal', align:'right',
				title : 'A OUTBPS(Mb)',
				width: '110px'
			}, {
				key : 'bportIdChnlVal', align:'left',
				title : 'B Port',
				width: '100px'
			}, {
				key : 'bportInBpsVal', align:'right',
				title : 'B INBPS(Mb)',
				width: '110px'
			}, {
				key : 'bportOutBpsVal', align:'right',
				title : 'B OUTBPS(Mb)',
				width: '110px'
			}, {
				key : 'portSpedVal', align:'right',
				title : '속도(Mb)',
				width: '90px'
			}, {
				key : 'mainEqpIpAddr', align:'left',
				title : 'IP',
				width: '120px'
			}, {
				key : 'eqpMdlNm', align:'left',
				title : '장비모델명',
				width: '120px'
			}, {
				key : 'ringCotRtDivVal', align:'left',
				title : 'RT/COT설정',
				width: '100px'
			}, {
				key : 'maxBpsVal', align:'right',
				title : 'MAX(1분,Mb)',
				width: '110px'
			}, {
				key : 'avgBpsVal', align:'right',
				title : 'MAX(5분,Mb)',
				width: '110px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        $('#'+gridId).alopexGrid("hideCol", ['eqpId','maxBpsDt','clctDt'], 'conceal');

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    }


    function setEventListener() {

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });
    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(1, eObj.perPage);
         });

         $('#'+gridId).on('dblclick', '.bodycell', function(e){

       		 var dataObj = null;
        	 	dataObj = AlopexGrid.parseEvent(e).data;

        	 	/* 5G백홀 링 대표트래픽 포트 정보    	 */
        	 	popupList('G5BackhaulRingTrafficPortLkup', $('#ctx').val()+'/trafficintg/trafficeng/G5BackhaulRingTrafficPortLkup.do', '5G백홀 링 대표트래픽 포트 정보',dataObj);

       	 	});

    	//엑셀다운
    	 $('#btnExportExcel').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#searchFormEqpLkup").getData();

    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 10;
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;

    		 param.fileName = configMsgArray['equipmentServiceLineAcceptCurrentState'];
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getEqpSrvcLineAcptCurstList";

    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/excelcreate', param, 'GET', 'excelDownload');
         });

    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });

	};

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

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

		return param;
	}

	//request 성공시
    function successCallback(response, status, jqxhr, flag){

    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.lists);
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

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }


    function setGrid(page, rowPerPage) {


    	$('#pageNoEqpLkup').val(page);
    	$('#rowPerPageEqpLkup').val(rowPerPage);

    	 var param =  $("#searchFormEqpLkup").getData();

		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/trafficintg/trafficeng/g5BackhaulRingTrafficEqpLkup', param, 'GET', 'search');
    }

    /*var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }*/

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    function popupList(pidData, urlData, titleData, paramData) {
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.7
              });
        }

});