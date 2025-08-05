/**
 * <ul>
 * <li>업무 그룹명 : tango-transmission-web</li>
 * <li>서브 업무명 : RingInfLkup.jsp</li>
 * <li>설 명 : 링정보 조회</li>
 * <li>작성일 : 2016. 8. 22.</li>
 * <li>작성자 : P098821</li>
 * </ul>
 */
$a.page(function() {
	var selectInit = [];
	var gridId = 'dataGrid';
	
	// (2017-03-10 : HS Kim) 추가
	var fileOnDemandName = "";
	var fileOnDemandExtension = "";

    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };
 
    function initGrid() {
        //그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'networkType', align:'left',
				title : '망구분',
				width: '110px'
			}, {
    			key : 'topoCd', align:'left',	// (2017-06-09 : HS Kim) 링구분(ringType) => 망종류(topoCd)
				title : '망종류',
				width: '110px'
			}, {
    			key : 'ringName', align:'left',
				title : '링명',
				width: '230px'
			}, {
    			key : 'seq', align:'right',
				title : '순서',
				width: '60px'
			}, {
    			key : 'sknManageNo', align:'left',
				title : 'SKN관리번호',
				width: '150px'
			}, {
    			key : 'startEquipName', align:'left',
				title : '시작시설물명',
				width: '200px'
			}, {
    			key : 'endEquipName', align:'left',
				title : '종단시설물명',
				width: '200px'
			}, {
    			key : 'useYN', align:'center',
				title : '사용구분',
				width: '80px'
			}, {
    			key : 'ownYN', align:'center',
				title : '소유구분',
				width: '100px'
			}, {
    			key : 'operationYN', align:'center',
				title : '운용구분',
				width: '80px'
			}, {
    			key : 'undergroundYN', align:'center',
				title : '매설구분',
				width: '80px'
			}, {
    			key : 'location1', align:'left',
				title : '케이블시설명',
				width: '250px'
			}, {
    			key : 'location2', align:'left',
				title : '케이블SK관리번호',
				width: '250px'
			}, {
    			key : 'cableCompany', align:'left',
				title : '케이블시설업체',
				width: '150px'
			}, {
    			key : 'coreNo', align:'left',
				title : '코아선번',
				width: '80px'
			}, {
    			key : 'cablingLen', align:'right',
				title : '포설거리(m)',
				width: '100px'
			}, {
    			key : 'pathOrgYN', align:'center',
				title : '패치국소여부',
				width: '120px'
			}, {
    			key : 'coreNum', align:'right',
				title : 'CORE수',
				width: '80px'
			}, {
    			key : 'useCoreNum', align:'right',
				title : '사용CORE수',
				width: '100px'
			}, {
    			key : 'connectCoreNum', align:'right',
				title : '연결CORE수',
				width: '100px'
			}, {
    			key : 'neName', align:'right',
				title : '장비명',
				width: '150px'
			}, {
    			key : 'orgName', align:'right',
				title : '국사명',
				width: '150px'
			}]
	    });
    }
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	var selectList = [ {el: '#networkType', url: 'ntwkcds', key: 'comCd', label: 'comCdNm'}
				         ,{el: '#topoCd', url: 'toposcls', key: 'comCd', label: 'comCdNm'} // (2017-06-02 : HS Kim) ringcds => toposcls
				         ];
 	
        for(var i=0; i<selectList.length; i++){
            selectInit[i] = Tango.select.init({
                                                 el: selectList[i].el
                                                ,model: Tango.ajax.init({
                                                                         url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url
                                                                         })
                                                ,valueField: selectList[i].key
                                                ,labelField: selectList[i].label
                                                ,selected: 'all'
                                                })
      	
            selectInit[i].model.get();
        }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	
    	param.networkType = selectInit[0].getValue();
    	param.topoCd = selectInit[1].getValue();
    	param.ringName = $('#ringName').val();
    	
    	httpRequest('tango-transmission-biz/trafficintg/presentstatusmgmt/getRingOfcConnInfLkup', param, successCallbackSearch, failCallback, 'GET');
    }
    
    function setEventListener() {
    	var perPage = 100;
        // 검색
        $('#btnSearch').on('click', function(e) {        	
        	setGrid(1, perPage);
        });
        
        $("#ringName").on('keypress', function(e){
        	if (e.keyCode === 13){
        		setGrid(1, perPage);
                return false;
        	}
        });
        
        //페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(eObj.page, eObj.pageinfo.perPage);
        });
        
        //페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
            var eObj = AlopexGrid.parseEvent(e);
            setGrid(1, eObj.perPage);
            perPage = eObj.perPage;
        });
        
      //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
        	var param =  $("#searchForm").getData();
        	
        	param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;
        	
        	param.networkType = selectInit[0].getValue();
        	param.topoCd = selectInit[1].getValue();
        	param.ringName = $('#ringName').val();
	        
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;
    		
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "getRingOfcConnInfLkupList";	// 필수. TrafficExcelBatchDAO 메소드명과 일치시키기
    		 
    		param.fileExtension = "xlsx";
    		// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가 Start
    		var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
    		param.fileName = "RingOfcConnInfLkup" + "_" + dayTime + "." + param.fileExtension;	
    		param.excelFlag = "RingOfcConnInfLkup";     // 필수 값
    		
    		fileOnDemandName = param.fileName;
    		fileOnDemandExtension = param.fileExtension;	// (2017-03-02 : HS Kim) 추가
    		// (2017-03-10 : HS Kim) End
    		
    		$('#'+gridId).alopexGrid('showProgress');
    		//param.fileName = "링별광케이블연결정보";
 	    	//httpRequest('tango-transmission-biz/trafficintg/presentstatusmgmt/excelcreateRingOfcConnInfLkup', param, successCallbackExcel, failCallback, 'GET');
 	    	// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가
    		httpRequest('tango-transmission-biz/trafficintg/ondemand/execOnDemandExcel', param, successCallbackOnDemandExcel, failCallback, 'POST');
         });        

	};
    
	//request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//alert(response.__rsltMsg__);
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }
    
    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		setSPGrid(gridId,response, response.lists);
	}
	
	var successCallbackExcel = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate');
		console.log(response);
		
		var $form=$('<form></form>');
		$form.attr('name','downloadForm');
		$form.attr('action',"/tango-transmission-biz/transmisson/trafficintg/trafficintgcode/exceldownload");
		$form.attr('method','GET');
		$form.attr('target','downloadIframe');
		// 2016-11-인증관련 추가 file 다운로드시 추가필요 
		$form.append(Tango.getFormRemote());
		$form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
		$form.appendTo('body');
		$form.submit().remove();
	}
	// (2017-03-10 : HS Kim) OnDemand 엑셀배치 추가
	var successCallbackOnDemandExcel = function(response){
		
		$('#'+gridId).alopexGrid('hideProgress');
		console.log('excelCreate - OnDemand');
		console.log(response);
		
		var jobInstanceId = response.resultData.jobInstanceId;
		//alert("(HS Kim) jobInstanceId : " + jobInstanceId);
		// 엑셀다운로드팝업
        $a.popup({
               popid: 'TrafficExcelDownloadPop' + jobInstanceId,
               title: '엑셀다운로드',
               iframe: true,
               modal : false,
               windowpopup : true,
               url: '/tango-transmission-web/trafficintg/TrafficExcelDownloadPop.do',
               data: {
                   jobInstanceId : jobInstanceId,
                   fileName : fileOnDemandName,
                   fileExtension : fileOnDemandExtension
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
    
    //request 호출
    var httpRequest = function(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional

    }
    
    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}
    
  //Excel
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
});