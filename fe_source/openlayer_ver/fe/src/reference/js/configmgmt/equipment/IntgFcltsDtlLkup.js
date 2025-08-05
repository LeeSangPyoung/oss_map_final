/**
 * PortChgHstLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
	var gridId = 'dataGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setRegDataSet(param);
        setEventListener();
        setGrid(1,100);
    };
    
    function setRegDataSet(data) {
    	
    	var intgFcltsDivNm = null;
    	
    	if(data.intgFcltsDivCd == "02"){
    		intgFcltsDivNm = "기지국";
    	}else if(data.intgFcltsDivCd == "03"){
    		intgFcltsDivNm = "광중계기";
    	}else if(data.intgFcltsDivCd == "04"){
    		intgFcltsDivNm = "RF급";
    	}else if(data.intgFcltsDivCd == "05"){
    		intgFcltsDivNm = "전송실";
    	}else if(data.intgFcltsDivCd == "06"){
    		intgFcltsDivNm = "지역중심국";
    	}
    	
    	$('#intgFcltsDivNm').val(intgFcltsDivNm);
    	
    	$('#contentArea').setData(data);
    }
    
    function initGrid() {
  		
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true 
    		}, {/* 전용회선번호        */
				key : 'erpExlineNo', align:'center',
				title : configMsgArray['exclusiveLineNumber'],
				width: '120px'
			},{/* 전송로개통일자      */
				key : 'tmlnOpenDt', align:'center',
				title : configMsgArray['transmissionLineOpeningDate'],
				width: '110px'
			}, {/* 전송속도 		 */
				key : 'trmsSpedNm', align:'center',
				title : configMsgArray['transmissionSpeed'],
				width: '90px'
			}, {/* 전송로번호		 */
				key : 'tmlnNo', align:'center',
				title : configMsgArray['transmissionLineNumber'],
				width: '100px'
    		}, {/* 전송방식명 		 */
				key : 'trmsMeansNm', align:'center',
				title : configMsgArray['transmissionMeansName'],
				width: '100px'
			}, {/* 망사업자명    	 */
				key : 'netBizrNm', align:'center',
				title : configMsgArray['networkBusinessManName'],
				width: '100px'				
			},{/* 과금거리            */
				key : 'chrDistVal', align:'center',
				title : configMsgArray['chargingDistance'],
				width: '70px'		
			},{/* 패치구간명    	 */
				key : 'patchSctnNm', align:'center',
				title : configMsgArray['patchSectionName'],
				width: '100px'		
			},{/* 전송로청약일자      */
				key : 'tmlnAppltDt', align:'center',
				title : configMsgArray['transmissionLineApplicationDate'],
				width: '110px'		
			},{/* 망사업자명1   	 */
				key : 'netBizrNm1', align:'center',
				title : configMsgArray['networkBusinessManName']+'1',
				width: '110px'		
			},{/* 도상거리    	 */
				key : 'roabDistVal', align:'center',
				title : configMsgArray['roadbedDistance'],
				width: '70px'				
			},{/* OTDR거리      	 */
				key : 'otdrDistVal', align:'center',
				title : configMsgArray['opticalTimeDomainReflectometerDistance'],
				width: '70px'
			},{/* 전송로해지여부명    */
				key : 'tmlnTrmnYnNm', align:'center',
				title : configMsgArray['transmissionLineTerminationYesOrNoName'],
				width: '150px'				
			},{/* 전송로해지예정일자  */
				key : 'tmlnTrmnSchdDt', align:'center',
				title : configMsgArray['transmissionLineTerminationScheduleDate'],
				width: '150px'				
			},{/* 팸토유형값    	 */
				key : 'femtoTypVal', align:'center',
				title : configMsgArray['femtoTypeValue'],
				width: '100px'				
			},{/* 설치유형값		 */
				key : 'instlTypVal', align:'center',
				title : configMsgArray['installTypeValue'],
				width: '100px'	
			
			},{/*MACWANWIBRO주소*/
				key : 'macWanWbrAddr', align:'center',
				title : configMsgArray['mediaAccessControlWanWibroAddress'],
				width: '120px'
			}, {/* MAC팸토주소 1      */
				key : 'macFemtoAddr1', align:'center',
				title : configMsgArray['mediaAccessControlFemtoAddress']+'1',
				width: '100px'
			}, {/* MAC팸토주소 2      */
				key : 'macFemtoAddr2', align:'center',
				title : configMsgArray['mediaAccessControlFemtoAddress']+'2',
				width: '100px'
			}, {/* WIFI존유형상세명  */
				key : 'wifiZoneTypDtlNm', align:'center',
				title : configMsgArray['wirelessFidelityZoneTypeDetailName'],
				width: '150px'
			}, {/* 존명     		 */
				key : 'zoneNm', align:'center',
				title : configMsgArray['zoneName'],
				width: '40px'
			}, {/* 사이트명            */
				key : 'siteNm', align:'center',
				title : configMsgArray['siteName'],
				width: '60px'
			},{/* L2시설유형         */
				key : 'l2FcltsTypNm', align:'center',
				title : configMsgArray['layer2FacilitiesTypeName'],
				width: '100px'
			}, {
				key : 'wifiL2FcltsYnVal', align:'center',
				title : 'WIFIL2시설여부',
				width: '120px'			
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
        
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
    	
    	//엑셀다운 
    	 $('#btnExportExcel').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 var param =  $("#searchForm").getData();
    		 
    		 param = gridExcelColumn(param, gridId);
    		 param.pageNo = 1;
    		 param.rowPerPage = 10;   
    		 param.firstRowIndex = 1;
    		 param.lastRowIndex = 1000000000;   
    		 /* 통합시설전송로정보  */
    		 param.fileName = configMsgArray['integrationFacilitiesTransmissionLineInf'];
    		 param.fileExtension = "xlsx";
    		 param.excelPageDown = "N";
    		 param.excelUpload = "N";
    		 param.method = "getIntgFcltsTmlnLkupList";
    		 
    		 $('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/excelcreateintg', param, 'GET', 'excelDownload');
         });
         
    	 $('#btnClose').on('click', function(e) {
 	     	//tango transmission biz 모듈을 호출하여야한다.
 			 $a.close();
 	     });
    	  
	};
	
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
	
	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'search') {
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.intgFcltsTmlnLkupList);
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
    
    // 컬럼 숨기기
    function gridHide() {
    	
    	var hideColList = [];
    	
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
    	
	}
    
    function setGrid(page, rowPerPage) {
    	
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	 var param =  $("#searchForm").getData();
		 
		 $('#'+gridId).alopexGrid('showProgress');
		 
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/intgfcltsTmlnlkup', param, 'GET', 'search');
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

});