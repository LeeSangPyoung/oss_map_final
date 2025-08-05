/**
 * MblLineStc.js
 *
 * @author 이현우
 * @date 2016. 7. 11. 오후 16:32:00
 * @version 1.0
 */
$a.page(function() {
	
	var gridId = 'dataGrid';
	
	var currentDate = new Date();
	currentDate.setDate(currentDate.getDate() - 1);
	
	var clctDtDay = currentDate.getDate();
	var clctDtMon = currentDate.getMonth() + 1;
	var clctDtYear = currentDate.getFullYear();
	
	clctDtDay = clctDtDay < 10 ? '0' + clctDtDay : clctDtDay;
	clctDtMon = clctDtMon < 10 ? '0' + clctDtMon : clctDtMon;
	
	var selectInit = [];
	
	var userGroupRowspanMode = 1;
	
    this.init = function(id, param) {
    	initGrid();
        setSelectCode();
    	setEventListener();
    };
     
   function initGrid() {
    	//그리드 생성
	    $('#'+gridId).alopexGrid({
//	    	paging : {
//        		pagerSelect: [100,300,500,1000]
//               ,hidePageList: false  // pager 중앙 삭제
//        	},
        	columnMapping: [{
    			key : 'clctDt', align:'center',
				title : '기준일자',
				width: '100px'
			}, {
				key : 'lineKndNm', align:'left',
				title : '회선유형',
				width: '90px'
			}, {
				key : 'orgNm', align:'left',
				title : '본부',
				width: '130px'
			}, {
				key : 'teamNm', align:'left',
				title : '팀',
				width: '120px'
			}, {
				key : 'trmsMtsoNm', align:'left',
				title : '전송실',
				width: '130px',
			}, {
				key : 'bizr', align:'left',
				title : '사업자',
				width: '120px',
			}, {
				key : 'srvcNm', align:'left',
				title : '서비스',
				width: '110px',
			}, {
				key : 'lineKndCnt', align:'right',
				title : '회선수',
				width: '90px',				
			}, {
				key : 'possRate', align:'right',
				title : '점유율(%)',
				width: '90px',
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
	    
	    //기준일자 입력
	    $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
    }
    
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
	                      ,{el: '#trmsMtsoNm', url: 'trmsmtso', key: 'mtsoId', label: 'mtsoNm'}
	                      ,{el: '#bizr', url: 'bizrs', key: 'comCd', label: 'comCdNm'}
	                      ,{el: '#lineTypNm', url: 'linekndcds', key: 'comCd', label: 'comCdNm'}
	                      ,{el: '#srvcCd', url: 'srvdiv', key: 'comCd', label: 'comCdNm'}
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
	      
	    $('#possRate').clear();
	    $('#possRate').append($('<option>', {value: 'all', text: '전체'}));
	    for(var i = 9; i > 0; i--){
            $('#possRate').append($('<option>', {value: i * 10, text: i * 10 + '% 이상'}));
	    }
	    $('#possRate').setSelected('전체');

    }

    function setGrid(page, rowPerPage) {
    	$('#'+gridId).alopexGrid('showProgress');
    	
    	$('#pageNo').val(page);
    	//$('#rowPerPage').val(rowPerPage);
    	$('#rowPerPage').val(10000);
    	
    	var param =  $("#searchForm").getData();
    	
    	var date = $('#clctDt').val().replace(/-/gi,'');
        param.clctDtYear = date.substring(0,4);
        param.clctDtMon = date.substring(4,6);
        param.clctDtDay = date.substring(6,8);
        param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
        param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
        param.trmsMtsoId = selectInit[2].getValue(); //$('#trmsMtsoNm').val();
        param.bizr = selectInit[3].getValue(); //$('#bizr').val();
        param.lineKndCd = selectInit[4].getValue(); //$('#lineTypNm').val();
        param.srvcNm = $('#srvcCd option:selected').text(); //$('#srvcCd').val();
        if ( $('#srvcCd option:selected').text() == "전체"){
        	param.srvcNm = 'all';
        }
        
    	httpRequest('tango-transmission-biz/trafficintg/statistics/mblLineStc', param, successCallbackSearch, failCallback, 'GET');
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
        	setGrid(1, eobjk);
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
    		
        	var date = $('#clctDt').val().replace(/-/gi,'');
            param.clctDtYear = date.substring(0,4);
            param.clctDtMon = date.substring(4,6);
            param.clctDtDay = date.substring(6,8);
            param.clctDt = date.substring(0,4) + date.substring(4,6) + date.substring(6,8); 
            param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
            param.teamId = selectInit[1].getValue(); //$('#teamNm').val();
            param.trmsMtsoId = selectInit[2].getValue(); //$('#trmsMtsoNm').val();
            param.bizr = selectInit[3].getValue(); //$('#bizr').val();
            param.lineKndCd = selectInit[4].getValue(); //$('#lineTypNm').val();
            param.srvcNm = $('#srvcCd option:selected').text(); //$('#srvcCd').val();
            if ( $('#srvcCd option:selected').text() == "전체"){
            	param.srvcNm = 'all';
            }
	        
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;   
    		 
    		param.fileName = "모바일회선통계";
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "mblLineStc";
    		 
    		$('#'+gridId).alopexGrid('showProgress');
 	    	httpRequest('tango-transmission-biz/trafficintg/statistics/excelcreateMblLineStc', param, successCallbackExcel, failCallback, 'GET');
         }); 
        
        $('#btnCal').on('click', function (){
            $('#btnCal').showDatePicker(function(date, dateStr){
            	clctDtYear = date.year;
            	
            	clctDtMon = date.month < 10 ? '0' + date.month : date.month;
            	clctDtDay = date.day < 10 ? '0' + date.day : date.day;
            	
                $("#clctDt").val(clctDtYear + '-' + clctDtMon + '-' + clctDtDay);
            });
        });
        
        //본부를 선택했을 경우
        $('#hdofcNm').on('change', function(e){
        	changeHdofc();
        	changeTeam();
        });
        
        //팀을 선택했을 경우
        $('#teamNm').on('change', function(e){
        	changeTeam();
        })
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
	
	//team change
	function changeTeam(){
		var param = {};
    	param.chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    	param.orgId = selectInit[0].getValue(); //$('#hdofcNm').val();
    	param.teamId = selectInit[1].getValue(); //$('#teamNm').val();

    	selectInit[2] = Tango.select.init({
    		el: '#trmsMtsoNm',
    		model: Tango.ajax.init({
    			url: 'tango-transmission-biz/transmisson/trafficintg/trafficintgcode/trmsmtso',
    			data: param
    		}),
    		valueField: 'mtsoId',
    		labelField: 'mtsoNm',
    		selected: 'all'
    	})

    	selectInit[2].model.get({data:param});
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
		setSPGrid(gridId,response, response.mblLineStc);
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
    
    //Grid에 Row출력
    function setSPGrid(GridID,Option,Data) {
		
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	    $('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	    
//	    var grpData;
//	    
//	    for (var i=0; i<Data.length; i++) {
//	    	grpData[i].본부 = Data[i].orgNm;
//	    	grpData[i].팀 = Data[i].teamNm;
//	    }
       	
//	    var grouper = new AlopexGrid.plugin.Grouper();
//        grouper.setGrid('#' + GridID);
//        grouper.width = "parent";
//        //grouper.row = '1000';
//        //grouper.rowHeight = '25';
//        grouper.verticalSummaryTitle = "합계";
//        
//        grouper.setData(grpData);        
//        
//        grouper.setGroupKeys(['clctDt', 'lineKndNm', '본부', '팀', 'trmsMtsoNm', 'bizr']);
//        grouper.setVerticals(['clctDt', 'lineKndNm', '본부', '팀', 'trmsMtsoNm', 'bizr']);
//        
//        grouper.setFacts(['lineKndCnt', 'possRate']);
//        grouper.enableAllFacts();
//        grouper.render();
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