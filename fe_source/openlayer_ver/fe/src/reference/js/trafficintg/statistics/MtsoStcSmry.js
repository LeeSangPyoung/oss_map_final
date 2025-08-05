/**
 * MtsoStcSmry.js
 *
 * @author 김현민
 * @date 2016. 7. 5. 오전 10:10:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 1);
	
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();
	
	clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;
	clctDtDay = clctDtDay < 10 ? '0' + clctDtDay : clctDtDay;
	
	var selectInit = [];
	
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
    			key : 'clctDt', align:'center',
				title : '기준일자',
				width: '100px'
			}, {
    			key : 'orgNm', align:'left',
				title : '본부',
				width: '130px'
			}, {
				key : 'teamNm', align:'left',
				title : '팀',
				width: '120px'
			}, {
				key : 'l3EqpCnt', align:'right',
				title : '전송실 수',
				width: '90px'
			}, {
				key : 'cotCnt', align:'right',
				title : '중심국사 수',
				width: '100px'
			}, {
				key : 'repCnt', align:'right',
				title : '기지국사 수(건물기준)',	// (2017-03-14) 필드명 단순변경 : (공대기준) => (건물기준)
				width: '150px'
			}, {
				key : 'fcltsCnt', align:'right',
				title : '기지국사 수(통시기준)',
				width: '150px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
    	
        $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }
    
//    function setSelectCode() {
//    	var chrrOrgGrpCd;
//		 if($("#chrrOrgGrpCd").val() == ""){
//			 chrrOrgGrpCd = "SKT";
//		 }else{
//			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
//		 }
//		 
//		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, successCallbackOrg, failCallback, 'GET');
//		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, successCallbackTeam, failCallback, 'GET');
//
//
//    }
    
    //select에 Bind 할 Code 가져오기
    function setSelectCode() {
    	if($("#chrrOrgGrpCd").val() == ""){
			$("#chrrOrgGrpCd").val("SKT")
		}
		var chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();

        var selectList = [ {el: '#hdofcNm', url: 'orgs/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
                          ,{el: '#teamNm', url: 'teams/'+chrrOrgGrpCd, key: 'orgId', label: 'orgNm'}
	                      ];
	
        for(var i=0; i<selectList.length; i++){
            selectInit[i] = Tango.select.init({
	      		el: selectList[i].el,
	      		model: Tango.ajax.init({
                    url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/' + selectList[i].url,
                    data: param
                    }),
	      		valueField: selectList[i].key,
	      		labelField: selectList[i].label,
	      		selected: 'all'
	      	})
	      	
	      	selectInit[i].model.get();
	      }
    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	var param =  $("#searchForm").getData();
    	
    	var clctDt = $('#clctDt').val().split('-');
        param.clctDtYear = clctDtYear = clctDt[0];
        param.clctDtMon = clctDtMon = clctDt[1];
        param.clctDtDay = clctDtDay = clctDt[2];
        param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
        param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
        

    	httpRequest('tango-transmission-biz/trafficintg/statistics/mtsoStcSmry', param, successCallbackSearch, failCallback, 'GET');
    }
    
    function setEventListener() {
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
        	setGrid(1, eObj.perPage);
        });
        
        // 검색
        $('#btnSearch').on('click', function(e) {
        	setGrid(1, eobjk);
        });
        
        //엑셀다운로드
        $('#btnExportExcel').on('click', function(e) {
    	    //tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();
    		 
    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 100;
    		
        	var clctDt = $('#clctDt').val().split('-');
        	
            param.clctDtYear = clctDtYear = clctDt[0];
            param.clctDtMon = clctDtMon = clctDt[1];
            param.clctDtDay = clctDtDay = clctDt[2];
            param.clctDt = clctDtYear + clctDtMon + clctDtDay; 
            param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
            param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
	        
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;   
    		 
    		param.fileName = "국사통계요약";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "mtsoStcSmry";
    		 
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateMtsoStcSmry', param, successCallbackExcel, failCallback, 'GET');
         });
        
        //본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
        	changeHdofc();
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
		
		for(var i=0; i<response.mtsoStcSmry.length; i++ )
		{
			response.mtsoStcSmry[i].cotCnt = Comma(response.mtsoStcSmry[i].cotCnt );
			response.mtsoStcSmry[i].repCnt = Comma(response.mtsoStcSmry[i].repCnt );
			response.mtsoStcSmry[i].l3EqpCnt = Comma(response.mtsoStcSmry[i].l3EqpCnt );
			response.mtsoStcSmry[i].fcltsCnt = Comma(response.mtsoStcSmry[i].fcltsCnt );
		}
		
		setSPGrid(gridId,response, response.mtsoStcSmry);
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