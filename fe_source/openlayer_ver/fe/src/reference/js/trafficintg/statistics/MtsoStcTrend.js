/**
 * MtsoStcTrend.js
 *
 * @author 김현민
 * @date 2016. 7. 6. 오전 10:10:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	var currentDate = new Date();
	var clctDtMon = currentDate.getMonth();
	var clctDtYear = currentDate.getFullYear();
	var clctDateYear = currentDate.getFullYear() - 1;
	clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;

	var selectInit = [];
    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    	$("#radioMon").setSelected();
    };
    
    function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
	    	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
	    	columnMapping: [{
    			key : 'orgNm', align:'left',
				title : '본부',
				width: '130px'
			}, {
				key : 'teamNm', align:'left',
				title : '팀',
				width: '120px'
			}, {
				key : 'mtsoTypNm', align:'center',
				title : '구분',
				width: '150px'
			}, {
				key : 'mtsoCnt1', align:'right',
				title : 'M-11',
				width: '60px'
			}, {
				key : 'mtsoCnt2', align:'right',
				title : 'M-10',
				width: '60px'
			}, {
				key : 'mtsoCnt3', align:'right',
				title : 'M-9',
				width: '60px'
			}, {
				key : 'mtsoCnt4', align:'right',
				title : 'M-8',
				width: '60px'
			}, {
				key : 'mtsoCnt5', align:'right',
				title : 'M-7',
				width: '60px'
			}, {
				key : 'mtsoCnt6', align:'right',
				title : 'M-6',
				width: '60px'
			}, {
				key : 'mtsoCnt7', align:'right',
				title : 'M-5',
				width: '60px'
			}, {
				key : 'mtsoCnt8', align:'right',
				title : 'M-4',
				width: '60px'
			}, {
				key : 'mtsoCnt9', align:'right',
				title : 'M-3',
				width: '60px'
			}, {
				key : 'mtsoCnt10', align:'right',
				title : 'M-2',
				width: '60px'
			}, {
				key : 'mtsoCnt11', align:'right',
				title : 'M-1',
				width: '60px'
			}, {
				key : 'mtsoCnt12', align:'right',
				title : 'M-0',
				width: '60px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
    }
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.roleDiv = "all";

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
 	                     ];
        
        for(var i=0; i<selectList.length; i++){
            selectInit[i] = Tango.select.init({
            	 el: selectList[i].el
	      		,model: Tango.ajax.init({
                    url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
                    data: param
                    })
	      		,valueField: selectList[i].key
	      		,labelField: selectList[i].label
	      		,selected: 'all'
	      	})
	      	
	      	selectInit[i].model.get();
        }
        
    	$('#clctDtYear').empty();

        if($('#radioMon').is(':checked')){
        	var currentDate = new Date();
        	var clctDtMon = currentDate.getMonth();
        	var clctDtYear = currentDate.getFullYear();
        	
	        for(var i=-3; i<1; i++){
	    		$('#clctDtYear').append($('<option>', {value: parseInt(clctDtYear) + i, text: parseInt(clctDtYear) + i + '년'}));
	    	}
	    	
	        $('#clctDtYear').setSelected(clctDtYear + '년');
	        $('#clctDtMon').setSelected(clctDtMon + '월');  	
            
        }else{
        	var currentDate = new Date();
        	var clctDateYear = currentDate.getFullYear() - 1;
        	for(var i=-3; i<1; i++){
	    		$('#clctDtYear').append($('<option>', {value: parseInt(clctDateYear) + i, text: parseInt(clctDateYear) + i + '년'}));
	    	}
	    	
            $('#clctDtYear').setSelected(clctDateYear + '년');	        

        }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	
    	param.orgId = selectInit[0].getValue();
        param.teamId = selectInit[1].getValue();
        param.clctDtYear = clctDtYear;
        param.clctDtMon = $('#radioMon').is(':checked') ? clctDtMon = $('#clctDtMon').val() : '00';
        
    	httpRequest('tango-transmission-biz/trafficintg/statistics/mtsoStcTrend', param, successCallbackSearch, failCallback, 'GET');
    }
    
    function drawMenu() {
    	var year = parseInt(clctDtYear);
    	var mon = parseInt(clctDtMon);
    	
    	if ($('#radioMon').is(':checked')) {	//월별
	    	$('#'+gridId).alopexGrid("showCol", ['mtsoCnt11',  'mtsoCnt12']);

	    	var beginYear = year - 1;
	    	var beginMon = mon == 12 ? 1 : mon + 1;
	    	
	    	var i, n;
	    	for (i=beginMon, n=1; i < beginMon + 12; i++, n++) {
	    		var m = i % 12;
	    		if (m == 0) m = 12;
	    		else if (m == 1) beginYear += 1;
	    		
	    		var t = beginYear + '-' + m;
	    		var k = 'mtsoCnt' + n;
	    		
	    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, k);
	    	}
    	}
    	else {	//년별
	    	$('#'+gridId).alopexGrid("hideCol", ['mtsoCnt11',  'mtsoCnt12'], 'conceal');

	    	var beginYear = year - 9;
	    	
	    	var i, n;
	    	for (i=beginYear, n=1; i < year+1; i++, n++) {
	    		var t = String(i);
	    		var k = 'mtsoCnt' + n;
	    		$('#'+gridId).alopexGrid('updateColumn', {title:t}, k);
	    	}
    	}
    }
    
    function setEventListener() {
        $('#radioYear').on('click', function(e) {
        	setSelectCode();
        	$('#tdMon').hide();
        });
        
        $('#radioMon').on('click', function(e) {
        	setSelectCode();
        	$('#tdMon').show();
        });
        
        //본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
        	changeHdofc();
        	
        });
        
        $('#clctDtYear').on('change', function(e) {
        	clctDtYear = $('#clctDtYear').val();
        })
        
        $('#clctDtMon').on('change', function(e) {
        	clctDtMon = $('#clctDtMon').val();
        })
        var eobjk=100; // Grid 초기 개수
    	//페이지 선택 시
        $('#'+gridId).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setGrid(eObj.page, eObj.pageinfo.perPage);
        });
        
    	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	eobjk = eObj.perPage;
        	setGrid(1, eobjk);
        });
        
        // 검색
        $('#btnSearch').on('click', function(e) {
        	drawMenu();
        	setGrid(1, eobjk);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		 
    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;
    		
    		param.orgId = selectInit[0].getValue();
            param.teamId = selectInit[1].getValue();
            param.clctDtYear = clctDtYear;
            param.clctDtMon = $('#radioMon').is(':checked') ? clctDtMon = $('#clctDtMon').val() : '00';
	        
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;   
    		 
    		param.fileName = "국사통계추이";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "mtsoStcTrend";
    		 
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateMtsoStcTrend', param, successCallbackExcel, failCallback, 'GET');
         });
	};
    
	//hdofc change
	function changeHdofc(){
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var orgID = selectInit[0].getValue(); //$('#hdofcNm').val();
    	orgID = orgID == 'all' ? 'teams/' + chrrOrgGrpCd : 'team/' + orgID;
    	
    	selectInit[1] = Tango.select.init({
    		el: '#teamNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + orgID
    		}),
    		valueField: 'orgId',
    		labelField: 'orgNm',
    		selected: 'all'
    	})
    	
    	selectInit[1].model.get();
	}
	
    //request 실패시.
    function failCallback(serviceId, response, flag){
    	if(flag == 'searchData'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    		$('#'+gridId).alopexGrid('hideProgress');
    	}
    }
    
    //request 성공시
	var successCallbackSearch = function(response){
		$('#'+gridId).alopexGrid('hideProgress');
		
		for(var i=0; i<response.mtsoStcTrend.length; i++ )
		{
			response.mtsoStcTrend[i].mtsoCnt1 = Comma(response.mtsoStcTrend[i].mtsoCnt1);
			response.mtsoStcTrend[i].mtsoCnt2 = Comma(response.mtsoStcTrend[i].mtsoCnt2);
			response.mtsoStcTrend[i].mtsoCnt3 = Comma(response.mtsoStcTrend[i].mtsoCnt3);
			response.mtsoStcTrend[i].mtsoCnt4 = Comma(response.mtsoStcTrend[i].mtsoCnt4);
			response.mtsoStcTrend[i].mtsoCnt5 = Comma(response.mtsoStcTrend[i].mtsoCnt5);
			response.mtsoStcTrend[i].mtsoCnt6 = Comma(response.mtsoStcTrend[i].mtsoCnt6);
			response.mtsoStcTrend[i].mtsoCnt7 = Comma(response.mtsoStcTrend[i].mtsoCnt7);
			response.mtsoStcTrend[i].mtsoCnt8 = Comma(response.mtsoStcTrend[i].mtsoCnt8);
			response.mtsoStcTrend[i].mtsoCnt9 = Comma(response.mtsoStcTrend[i].mtsoCnt9);
			response.mtsoStcTrend[i].mtsoCnt10 = Comma(response.mtsoStcTrend[i].mtsoCnt10);
			response.mtsoStcTrend[i].mtsoCnt11 = Comma(response.mtsoStcTrend[i].mtsoCnt11);
			response.mtsoStcTrend[i].mtsoCnt12 = Comma(response.mtsoStcTrend[i].mtsoCnt12);
		}
		
		setSPGrid(gridId,response, response.mtsoStcTrend);
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
    
  //숫자에 콤마 추가
	function Comma(str) {
    	var strReturn ;
		
    	if(str == null)
			strReturn = '0';
		else{
			str = String(str);
			strReturn = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,'); 
		}
    	
    	return strReturn; 
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