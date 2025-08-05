/**
 * BaseMtsoPop.js
 * 기지국사 등록
 * TCC선번작성, 서비스회선관리(기지국회선(WCDMA(NODEB) - 기지국사(CMS) 항목 더블클릭)에서 호출함
 * @author 
 * @date 2018. 04. 02.
 * @version 1.0
 * 
 */
var gridId = 'gridIdPop';
var userMtsoVal = null;
var mtsoList = [];

$a.page(function() {
	this.init = function(id, param) {
		userMtsoVal = param[0];
		setEventListener();
		setSelectCode();
		initGrid();
		
		$('#btnExportExcelPop').setEnabled(false);
	}
	
	//Grid 초기화
	function initGrid() {
		var mapping = [
		               			{ key: 'btsName', 			align: 'center', 		width: '140px',			title: cflineMsgArray['baseMtsoNm']	/* 기지국사명 */ }
		               			, { key: 'cmsId', 			align: 'center', 		width: '80px',		title: cflineMsgArray['cmsId']	/* CMSID */ }
		               			, { key: 'mscId', 			align: 'center', 		width: '60px',		title: cflineMsgArray['mobileSwitchingCenter']	/* MSC */ }
		               			, { key: 'bscId', 			align: 'center', 		width: '60px',		title: cflineMsgArray['basestationController']	/* BSC */ }
		               			, { key: 'btsId', 			align: 'center', 		width: '60px',		title: cflineMsgArray['baseTransceiverStation']		/* BTS */ }
                     			, { key: 'bldAddr', 			align: 'left', 		width: '300px', 	title: cflineMsgArray['address']		/* 주소 */ }
		               ];
		
		$('#' + gridId).alopexGrid({
			rowInlineEdit : true,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : true,
			rowSingleSelect : true,
			numberingColumnFromZero : false,
            height: 300,
            message : {
            	nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData']		/*'조회된 데이터가 없습니다.'*/,
            	filterNodata: 'No data'
            },
		    columnMapping: mapping
		});
	};
	
	//조회조건 세팅
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getSKTMtsoList', null, 'GET', 'mtsoList');
	}

	
	function setEventListener() {
		 $('#'+gridId).on('dblclick', '.bodycell', function(e){
	      	 	var dataObj = AlopexGrid.parseEvent(e).data;
	      	 	$a.close(dataObj);
	    });
		
		//조회 선택시
		$('#btnSearchPop').on('click', function(e) {
			searchProc();
		});
	}
	
	 function searchProc() {
			cflineShowProgressBody();
			
			var param =  $("#searchForm").getData();

			var paramData = {
					"tmofCdPop" : param.tmofCdPop
					, "mtsoNmPop" : param.mtsoNmPop
					, "cuidPop" : param.cuidPop		
			}	
			
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getbasemtsolist', paramData, 'GET', 'searchList');
	}
	
	//request 성공시
    function successCallback(response, flag) {
    	//전송실 세팅
    	if(flag == 'mtsoList') {
    		setMtsoList(response);
    	}
    	
    	
    	if(flag == 'searchList') {
			if(response.BaseMtsoList.length > 0) {
				$('#' + gridId).alopexGrid('dataSet', response.BaseMtsoList);
				$('#btnExportExcelPop').setEnabled(true);
			}
			cflineHideProgressBody();
		}
		
    }
    
    function setMtsoList(response) {
    	for(m = 0; m < response.SKTMtsoList.length; m++) {
    		mtsoList.push({value: response.SKTMtsoList[m].mtsoId, text: response.SKTMtsoList[m].mtsoNm});
    	}

    	$("#tmofCdPop").clear();
    	$("#tmofCdPop").setData({data : mtsoList});
    	$("#tmofCdPop").setSelected(userMtsoVal);
    }
    
    //request 실패시.
    function failCallback(response, flag) {
    	if(flag == 'searchList') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
    }
    
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(function(response){successCallback(response, Flag);})
		  .fail(function(response){failCallback(response, Flag);})
    }
});