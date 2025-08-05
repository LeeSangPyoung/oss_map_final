/**
 * ErpPriceList
 *
 * @author P028750
 * @date 2016. 9. 29. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var notBpmProcsClCd = "61";
	var paramProcsClCd;
	var gMgmtOrgId = "";
	var gActTyp = "";
	
  	$('body').keydown(function(key) {
		if (key.keyCode == 13) {
			$('#search').click();
		}
	});	

	this.init = function(pageId, param) {		
		var gridModel;
		var gridModelExcel;
		
		selectProcsClCd.model.get();		
		
		paramProcsClCd = param.procsClCd;
		if (paramProcsClCd != null) {			
			fnSelectActCd();			
		}
		if(gActTyp == ""){
			selectActNm.setSelected("");
    		$("#selectActNm option").remove();
    		$("#selectActNm").append("<option value=''>선택</option>");
		}
		if (param.bizStaDtmtFrom != null && param.bizStaDtmtTo != null) {
			$("#bizStaDtmtFrom").val(param.bizStaDtmtFrom); 
			$("#bizStaDtmtTo").val(param.bizStaDtmtTo);				
		} else {
			$("#bizStaDtmtFrom").val(calculateDate(13)); 
			$("#bizStaDtmtTo").val(calculateDate(0));			
		}
		
		setCombo();
    	initGrid();
    	setEventListener();
    	
    	/*var bizProgCurstListAjax = Tango.ajax.init({
			url : 'tango-transmission-biz/webportal/itaprv/itaprvProgCurstList'
		});    	
    	bizProgCurstListAjax.get({
    		data: {
        		"bizUnqId" : "C161222000024",	
        		"procsClCd" : "31"
        	}
    	}).done(function(response) {
    		if (response != null) {
    			for (var i=0; i<response.length; i++) {
    				console.log(response[i].actNm);
    				console.log(response[i].actProgStat);
    				if (response[i].actProgStat == "COMPLETED") {
        				console.log(response[i].bizFnshUserNm);
        				console.log(response[i].bizFnshDtmt);    					
    				} else {
        				console.log(response[i].userRoleNm);
        				console.log(response[i].bizStaDtmt);
    				}
    				console.log(response[i].actProgStatNm);
    			}
    		}
    	}).fail(function(response) {
    		console.log(response);
    	}); */   	
    	
    	/*var toDoAjax = Tango.ajax.init({
			url : 'tango-transmission-biz/webportal/todomgmt/list'
		});    	
    	toDoAjax.get({
    		data: {
        		"bizUnqId" : "B082016102600001025",	
        		"procsClCd" : "07",
        		"userId" : ""
        	}
    	}).done(function(response) {
    		if (response != null) {
    			for (var i=0; i<response.length; i++) {
    				console.log(response[i].menuScrnUrl);
    			}
    		}
    	}).fail(function(response) {
    		console.log(response);
    	});*/
	};

    //ajax model Select Component
    var selectProcsClCd = Tango.select.init({        
        el: '#selectProcsClCd',
        model: Tango.ajax.init({
            url: 'tango-common-business-biz/common/business/system/codes/C00216',
            complete: function() {
            	$('#selectProcsClCd').setSelected(paramProcsClCd);
            }
        }),
        allType: true
    });
    var selectAreaCd = Tango.select.init({
        el: '#selectAreaCd',
        model: Tango.ajax.init({
            url: 'tango-transmission-biz/transmisson/constructprocess/common/orgs',
            flag : 'orgs'
        }),
        autoRender : false,
        allType: ($('#chrrOrgGrpCd').val() == 'T') ? true : ""
    });
    var selectSkAfcoDivCd = Tango.select.init({        
        el: '#selectSkAfcoDivCd',
        model: Tango.ajax.init({
            url: 'tango-common-business-biz/common/business/system/codes/C00308'
        }),
        allType: true
    });
    /* 관리주체 */
    var selectCstrMgmtOnrCd = Tango.select.init({        
        el: '#selectCstrMgmtOnrCd',
        model: Tango.ajax.init({
            url: 'tango-common-business-biz/common/business/system/codes/C00332'
        }),
        allType: true
    });
	var selectActCd = Tango.select.init({
        el: '#selectActCd',
        model: Tango.ajax.init({
            url: 'tango-transmission-biz/webportal/todomgmt/procsActList'
        }),
		valueField : "actCd",
		labelField : "actNm",                
        allType: true
    });
	/* 지역구분 */
	var selectDsnBpChrgOrgId = Tango.select.init({
		el: '#selectDsnBpChrgOrgId',
   		valueField : 'workAreaDivCd', 	// data에서 option value에 지정할 field(key)
   		labelField : 'workAreaDivCdNm', 	// data에서 option text에 지정할 field(key)
   		allType: true
	});
	
	var selectActNm = Tango.select.init({
		el: '#selectActNm',
		allType: false
	});
	
	//Grid 초기화
	function initGrid() {
    	$('#resultGrid').alopexGrid({
			autoColumnIndex: true,
    		rowClickSelect: true,
    		fitTableWidth: true,
        	paging : {
        		hidePageList: true,
        		pagerSelect: false
        	},
    		message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>조회된 데이터가 없습니다.</div>"
			},
            renderMapping : {
                'unitbProcProgStat' : {
                    renderer : function(value, data, render, mapping) {
                        return "<a href='#'><i class='fa fa-sitemap unitbProcProgStat'></i></a>";
                    }
                }             
            }, 
            defaultColumnMapping:{
				sorting: true
			},
			columnMapping : [
     	        {key : 'rownumber',         align:'center', width:'60px',   title : '순번'},    	        
     	        {key : 'skAfcoDivCdNm',     align:'left',   width:'110px',  title : '사업자'},
     	        {key : 'areaCdNm',          align:'left',   width:'110px',  title : '본부구분'},
     	        {key : 'appltKndCdNm',      align:'left',   width:'120px',  title : '청약종류'},     	        
     	        {key : 'appltNo',           align:'left',   width:'110px',  title : '청약번호'},
     	        {key : 'engstNo',           align:'left',   width:'150px',  title : 'EngSheet번호'},  
     	        {key : 'procsClCdNm',       align:'left',   width:'120px',  title : '프로세스분류'},
     	        {key : 'actNm',             align:'left',   width:'180px',  title : '업무명'},     
     	        {key : 'bpNm',              align:'left',   width:'150px',  title : '시공업체명'},
     	        {key : 'workNm',            align:'left',   width:'250px',  title : '프로세스분류명'},
     	        {key : 'appltNm',           align:'left',   width:'250px',  title : '청약명'},
     	       	{key : 'cstrNm',            align:'left',   width:'250px',  title : '공사명'},
     	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
     	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계', sorting : 'number', render: {type: 'string', rule: 'comma'}},
     	        {key : 'bizStaDtmt',        align:'center', width:'130px',  title : '업무시작일시'},     	        
     	        {key : 'actTypNm',          align:'center', width:'90px',   title : '업무구분'},
     	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
     	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
     	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
     	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'},
     	        {key : '',                  align:'center', width:'100px',  title : '업무진행상태',          render : {type : 'unitbProcProgStat'}},     	        
     	        {key : 'skAfcoDivCd',       width:'0px',    title : '사업자',                hidden : true},
     	        {key : 'procsClCd',         width:'0px',    title : '프로세스분류',          hidden : true},
     	        {key : 'actTyp',            width:'0px',    title : '업무구분',              hidden : true},    	        
     	        {key : 'menuScrnId',        width:'0px',    title : '메뉴화면ID',            hidden : true},
     	        {key : 'menuScrnUrl',       width:'0px',    title : '메뉴화면URL',           hidden : true},
     	        {key : 'userRoleCd',        width:'0px',    title : '사용자역할코드',        hidden : true},	        
     	        {key : 'actCd',             width:'0px',    title : '업무코드',              hidden : true},
     	        {key : 'areaCd',            width:'0px',    title : '본부코드',              hidden : true},
     	        {key : 'clsTlmtDay',        width:'0px',    title : '마감기한일',            hidden : true},
     	        {key : 'scrnMovParm',       width:'0px',    title : '화면이동파라미터',      hidden : true},
     	        {key : 'bizUnqIdVar',       width:'0px',    title : '업무고유아이디변수명',  hidden : true},
     	        {key : 'bizProgStatCD',     width:'0px',    title : '업무진행상태코드',      hidden : true},    	        
     	        {key : 'preActTyp',         width:'0px',    title : '이전업무구분',          hidden : true},
     	        {key : 'preActCd',          width:'0px',    title : '이전업무코드',          hidden : true},    	    
     	        {key : 'preBizFnshUserId',  width:'0px',    title : '이전업무완료자',        hidden : true},    	        
     	        {key : 'wndwDiv',           width:'0px',    title : '윈도우구분',            hidden : true},
     	        {key : 'wndwWidhSz',        width:'0px',    title : '윈도우가로사이즈',      hidden : true},
     	        {key : 'wndwHeghSz',        width:'0px',    title : '윈도우세로사이즈',      hidden : true},
     	        {key : 'itaprvProgDiv',     width:'0px',    title : '승인반려구분',          hidden : true},    	        
     	        {key : 'frstRegDate',       width:'0px',    title : '최초등록일자',          hidden : true},
     	        {key : 'frstRegUserId',     width:'0px',    title : '최초등록사용자ID',      hidden : true},
     	        {key : 'lastChgDate',       width:'0px',    title : '최종변경일자',          hidden : true},
     	        {key : 'lastChgUserId',     width:'0px',    title : '최종변경사용자ID',      hidden : true},
     	        {key : 'bpId',              width:'0px',    title : '시공업체ID',            hidden : true},
     	        {key : 'appltKndCd',        width:'0px',    title : '청약종류코드',          hidden : true},
     	        {key : 'wkrtAprvSrno',      width:'0px',    title : '작업지시승인일련번호',  hidden : true}
     	    ]
    	});
    	
    	// Excel
    	gridModelExcel = Tango.ajax.init({
    		url: 'tango-transmission-biz/webportal/todomgmt/todoList'
    	});
    	$('#resultGridExcel').alopexGrid({
    		rowSingleSelect : true,
    		defaultColumnMapping : {
    			resizing: false
    		},  		
    		paging : {
    			pagerSelect : false,
    			pagerTotal: function(paging) {
    				if (paging.dataLength != 0) {
    					return '총결과 : ' + AlopexGrid.renderUtil.addCommas(paging.dataLength);
    				} else {
    					return '총결과 : 0';
    				}
    			}
    		},
    		message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>조회된 데이터가 없습니다.</div>"
			},
	        columnMapping : [
     	        {key : 'rownumber',         align:'center', width:'60px',   title : '순번'},    	        
     	        {key : 'skAfcoDivCdNm',     align:'left',   width:'120px',  title : '사업자'},
     	        {key : 'areaCdNm',          align:'left',   width:'130px',  title : '본부구분'},
     	        {key : 'appltKndCdNm',      align:'left',   width:'120px',  title : '청약종류'},     	        
     	        {key : 'appltNo',           align:'left',   width:'130px',  title : '청약번호'},
     	        {key : 'engstNo',           align:'left',   width:'150px',  title : 'EngSheet번호'},     	        
     	        {key : 'procsClCdNm',       align:'left',   width:'120px',  title : '프로세스분류'},
     	        {key : 'actNm',             align:'left',   width:'200px',  title : '업무명'},     	
     	        {key : 'bpNm',              align:'left',   width:'200px',  title : '시공업체명'},
     	        {key : 'workNm',            align:'left',   width:'300px',  title : '프로세스분류명'},
     	        {key : 'appltNm',           align:'left',   width:'300px',  title : '청약명'},
    	        {key : 'cstrNm',            align:'left',   width:'300px',  title : '공사명'},
     	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
     	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계', render: {type: 'string', rule: 'comma'}},
     	        {key : 'bizStaDtmt',        align:'center', width:'130px',  title : '업무시작일시'},     	        
     	        {key : 'actTypNm',          align:'center', width:'90px',   title : '업무구분'},
     	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
     	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
     	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
     	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'}
     	        
     	    ],   
    		ajax : { model : gridModelExcel }
    	});    	
    };
    
    var showProgress = function() {
    	$('#resultGrid').alopexGrid('showProgress');
	};
	
	var hideProgress = function() {
		$('#resultGrid').alopexGrid('hideProgress');
	};    
    
  	//Grid Set
    function setGrid(flag) {
    	    	
    	if (flag == "init") {
        	$("#pageNo").val("1");    		
    	}    	
    	var pageNo = $("#pageNo").val();
    	var rowPerPage = $("#rowPerPage").val();
    	var searchTarget = $('input[name="searchTarget"]:checked').val();
    	$.ajaxSettings.traditional=true;
    	
    	var orgList = "";
    	
    	if(selectSkAfcoDivCd.getValue() == 'B'){
	  		
	   		if ($.TcpUtils.isNotEmpty(selectAreaCd.getValue())){
				for(i=0; i<selectAreaCd.getValue().length; i++){
	    	   		if($.TcpUtils.isNotEmpty( selectAreaCd.getValue()[i])){
	    	   			orgList += (i==0)?selectAreaCd.getValue()[i]:","+selectAreaCd.getValue()[i];
	    	   		}
	    	   	}
				
	    	} else {
	    		alertBox("I", "본부구분을 선택해 주세요");
	    		return;
	    	}
  		} else {
  			orgList = selectAreaCd.getValue();
  		}
    	
    	showProgress();
    	
    	Tango.ajax({
    		url: 'tango-transmission-biz/webportal/todomgmt/todoList',
    		data: {
    			pageNo: pageNo,
    			rowPerPage: rowPerPage,
    			skAfcoDivCd: selectSkAfcoDivCd.getValue(),    		
    			areaCd: orgList,
    			areaCdList: orgList,
    			dsnBpChrgOrgId: selectDsnBpChrgOrgId.getValue(), //작업지역코드
    			cstrMgmtOnrCd: selectCstrMgmtOnrCd.getValue(), //관리주체코드
    			procsClCd: selectProcsClCd.getValue(),
    			bizUnqIdList : getSelValList($("#selectBizUnqIdList")),
    			workNm: $("#workNm").val(),
    			actTyp: $("#selectActTyp").val(),  
    			actNm: selectActNm.getValue(),
    			actCd: selectActCd.getValue(),
    			bizStaDtmtFrom: $("#bizStaDtmtFrom").val(),
    			bizStaDtmtTo: $("#bizStaDtmtTo").val(),
    			appltNo: $("#appltNo").val(),    			
    			appltNm: $("#appltNm").val(),
    			engstNo: $("#engstNo").val(),
    			bpId: $("#bpId").val(),
    			bizPlanNm: $('#bizPlanNm').val(),
    			appltKndCd: $('#appltKndCd').val(),			// 청약종류
    			afeYr: $('#afeYr').val(),			// 년도
    			uprDemdBizDivCd: $('#uprDemdBizDivCd').val(),			// 상위사업구분
    			lowDemdBizDivCd: $('#lowDemdBizDivCd').val(),			// 하위사업구분
    			searchTarget: searchTarget
    		},
    		method : 'get'
		}).done(function(response, status) {
			$.ajaxSettings.traditional=false;
			gridModelSuccessFn(response, status, flag);
		}).fail(function(response, status) {
			$.ajaxSettings.traditional=false;s
			gridModelFailFn(response, status, flag);
		});
    }
 	
  	//ajax seccess
    function gridModelSuccessFn(response, status, flag) {
		var serverPageinfo;    	
    	if (response.pager != null) {
    		serverPageinfo = {
    				dataLength  : response.pager.totalCnt, 		// 총 데이터 길이
    	      		current 	: response.pager.pageNo, 		// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	// 한 페이지에 보일 데이터 갯수
    	    };
    	}
    	switch (flag) { 
			case 'init':
				$('#resultGrid').alopexGrid('dataSet', $.extend(true, [], response.lists), serverPageinfo);
				break;
			case 'scroll':
				$('#resultGrid').alopexGrid('dataAdd', $.extend(true, [], response.lists), serverPageinfo);
				break;	        	
			default:
		};
    	hideProgress();
    }
    
  	// ajax fail
    function gridModelFailFn(response, status, flag) {
    	hideProgress();
       	callMsgBox('Error', 'W', response == null ? ""+status : response.message, null);
    }
    
    function fnSelectActCd(procsClCd) {
    	selectActCd.model.get({
    		data: {
    			"procsClCd" : procsClCd,
    			"useYn" : "Y"
    		}
    	});    	
    }
    
  	//event 등록
	function setEventListener() {		
		// 검색
        $('#search').on('click', function(e) {
        	setGrid("init");
        });       
        // 엑셀
        $('#btnExcelDown').on('click', function(e) {
        	
        	var searchTarget = $('input[name="searchTarget"]:checked').val();
        	$.ajaxSettings.traditional=true;
        	
        	var orgList = "";
        	
        	if(selectSkAfcoDivCd.getValue() == 'B'){
        		if ($.TcpUtils.isNotEmpty(selectAreaCd.getValue())){
					for(i=0; i<selectAreaCd.getValue().length; i++){
		    	   		if($.TcpUtils.isNotEmpty( selectAreaCd.getValue()[i])){
		    	   			orgList += (i==0)?selectAreaCd.getValue()[i]:","+selectAreaCd.getValue()[i];
		    	   		}
		    	   	}
				
		    	} else {
		    		alertBox("I", "본부구분을 선택해 주세요");
		    		return;
		    	}
	  		} else {
	  			orgList = selectAreaCd.getValue();
	  		}
        	
        	showProgress();
        	
        	gridModelExcel.get({
        		data: {
        			pageNo: 1,
        			rowPerPage: 10000,
        			skAfcoDivCd: selectSkAfcoDivCd.getValue(),    		
        			areaCd: orgList,
        			areaCdList: orgList,
        			procsClCd: selectProcsClCd.getValue(),
        			dsnBpChrgOrgId: selectDsnBpChrgOrgId.getValue(), //작업지역코드
        			cstrMgmtOnrCd: selectCstrMgmtOnrCd.getValue(), //관리주체코드
        			workNm: $("#workNm").val(),
        			actTyp: $("#selectActTyp").val(),    			
        			actCd: selectActCd.getValue(),
        			bizUnqIdList : getSelValList($("#selectBizUnqIdList")),
        			bizStaDtmtFrom: $("#bizStaDtmtFrom").val(),
        			bizStaDtmtTo: $("#bizStaDtmtTo").val(),
        			appltNo: $("#appltNo").val(),    			
        			appltNm: $("#appltNm").val(),
        			engstNo: $("#engstNo").val(),
        			bpId: $("#bpId").val(),
        			bizPlanNm: $("#bizPlanNm").val(),
        			appltKndCd: $('#appltKndCd').val(),			// 청약종류
        			afeYr: $('#afeYr').val(),			// 년도
        			uprDemdBizDivCd: $('#uprDemdBizDivCd').val(),			// 상위사업구분
        			lowDemdBizDivCd: $('#lowDemdBizDivCd').val(),			// 하위사업구분
        			searchTarget: searchTarget
        		}
        	}).done(function() {
        		hideProgress();
        		$.ajaxSettings.traditional=false;
            	var worker = new ExcelWorker({
            		excelFileName : 'To-Do 리스트',
            		palette : [{
            			className : 'B_YELLOW',
            			backgroundColor: '255,255,0'
            		},
            		{
            			className : 'F_RED',
            			color: '#FF0000'
            		}],
            		sheetList: [{
            			sheetName: 'To-Do 리스트',
            			$grid: $('#resultGridExcel')
            		}]
            	});
            	worker.export({
            		merge: false,
            		exportHidden: false,
            		filtered: false,
            		selected: false,
            		useGridColumnWidth: true,
            		border: true
            	});        		
        	}).fail(gridModelFailFn);
        });        
        
        //업무고유아이디 리스트로 조회시 사용
        $('#bizUnqId').on("keyup", function(e){
        	if((e.ctrlKey && e.keyCode == 86) || (e.keyCode == 13)){
	    		setMultiInput.textareaId = "bizUnqId";
	        	setMultiInput.selBoxId = "selectBizUnqIdList";
	        	setMultiInput.initButtonId = "initBizUnqIdList";
	        	setMultiInput.Execute();
        	}
        });
        
      //업무고유아이디 리스트로 조회시 사용
        $('#bizUnqId').on("input", function(e){
        	setMultiInput.textareaId = "bizUnqId";
        	setMultiInput.selBoxId = "selectBizUnqIdList";
        	setMultiInput.initButtonId = "initBizUnqIdList";
        	setMultiInput.Execute();
        });
        
      //업무고유아이디 리스트 초기화
        $("#initBizUnqIdList").on("click", function(e){
        	$("#bizUnqId").val("");
        	 
        	$("#selectBizUnqIdList").setData({
        		selectOptionsl:[]
    		});
        	
        	$(this).attr("class","Button button2");
        });
        
        $('#selectProcsClCd').on('change', function(e) {        	
        	fnSelectActCd(selectProcsClCd.getValue());
        });
        
        $("#selectAreaCd").on('change', function(e){
        	gMgmtOrgId = selectAreaCd.getValue();

        	if(selectSkAfcoDivCd.getValue() == 'T'){
        		if (gMgmtOrgId == "") {
            		selectAreaCd.setSelected("");
            		$("#selectDsnBpChrgOrgId option").remove();
            		$("#selectDsnBpChrgOrgId").append("<option value=''><spring:message code='label.all'/></option>");
            	} else {
    	        	setAreaCdCombo(gMgmtOrgId);
            	}
        	}
        });
        
        $("#selectActTyp").on('change', function(e){
        	gActTyp = $(this).val();
        	
        	if(gActTyp == ""){
        		selectActNm.setSelected("");
	    		$("#selectActNm option").remove();
	    		$("#selectActNm").append("<option value='' >선택</option>");
        	}else{
        		
        		if($("#selectActTyp").val() == "approval"){
        			selectActNm.setSelected("");
	        		$("#selectActNm option").remove();
	        		$("#selectActNm").append("<option value=''>선택</option>");
	        		$("#selectActNm").append("<option value='검토'>검토</option>");
	        		$("#selectActNm").append("<option value='승인'>승인</option>");
	        		$("#selectActNm").append("<option value='협조승인'>협조승인</option>");
        		}else{
        			selectActNm.setSelected("");
    	    		$("#selectActNm option").remove();
    	    		$("#selectActNm").append("<option value='' selected='selected'>선택</option>");
        		}
        	}
        });
        
        var setAreaCdCombo = function(mgmtOrgId){
	    	var taskOrgDivCd = "B";

	    	setSelectByOrgTeam("selectDsnBpChrgOrgId", "all", mgmtOrgId, taskOrgDivCd, null);
		};
		
        $('#resultGrid').on('scrollBottom', function(event) {
    		var ev = AlopexGrid.parseEvent(event)
    		var pageInfo = ev.$grid.alopexGrid("pageInfo");
    		if (pageInfo.dataLength != pageInfo.pageDataLength) {	    		
    			$('#pageNo').val(parseInt($('#pageNo').val()) + 1);
    			$('#rowPerPage').val($('#rowPerPage').val());
    	  		setGrid("scroll");    	  		
    		}    		
    	}); 
        
		//그리드 셀 클릭 이벤트 바인딩
        $('#resultGrid').on('click', '.bodycell', function(event) {        	
        	var ev = AlopexGrid.parseEvent(event);
        	var data = ev.data;
        	var gridCtx = data._index;

        	if (data.procsClCd == "61" && gridCtx.column == "20") {
        		callMsgBox("",'W', "조회 불가능한 항목입니다. 합니다.", null);
        		return;
        	}
        	if ($(this).hasClass('cell-type-unitbProcProgStat')) {
        		var popupUrl = "/tango-transmission-web/webportal/todomgmt/TodoMgmtToBpms.do"
        		var view = "UNIT_BIZ_PROC_PROG_STAT";
        		$a.popup({
        			popid : "업무진행상태",
        			title : "업무진행상태",
                    url : popupUrl,
                    windowpopup : true,
                    modal : false,
                	movable : true,
                	width : 1600,
                	height : 800,
                	data : {
                		appltNo : data.appltNo,
                		bizUnqId : data.bizUnqId,
                		procsClCd : data.procsClCd,
                		userRoleCd : data.userRoleCd,
                		menuScrnId : data.menuScrnId,
                		view : view
                	},
                	callback : function(data) {
                	}
            	});    		
        	}
        });
        $('#resultGrid').on('dblclick', '.bodycell', function(event) {        	
        	var ev = AlopexGrid.parseEvent(event);
        	var data = ev.data;
        	var dataO = {};
        	var gridCtx = data._index;
        	var winTitle = data.actNm + "[" + data.workNm + "]";

        	console.log(data.procsClCd.match(eval("/" + notBpmProcsClCd + "/")));
        	// bpms 안타는 항목...
        	if (data.procsClCd.match(eval("/" + notBpmProcsClCd + "/")) != null) {
        		if (data.actTyp == "human") {
	    			var bizUrl = data.menuScrnUrl;

	    			var paramString = "";

	    			if (data.scrnMovParm != null && data.scrnMovParm != "") {
	    				if (data.scrnMovParm.indexOf(",")>0) {
	    					var paramArray = data.scrnMovParm.split(',');
	    					for (var i=0; i<paramArray.length; i++) {
	    						var valName = "data." + paramArray[i];
	    						paramString = paramString + (paramString == "" ? "" : "&") + paramArray[i] + "=" + eval(valName);
	    						if (paramArray[i] == "fdaisSeq") { // 현장실사 번호
	    							var str1 = '/' + data.engstNo + '/gi';
	    							dataO[paramArray[i]] = data.addKey.replace(eval(str1), '');
	    						} else {
		    						dataO[paramArray[i]] = eval(valName);
	    						}
	    					}
	    				} else {
    						var valName = "data." + data.scrnMovParm;
    						paramString = paramString + (paramString == "" ? "" : "&") + data.scrnMovParm + "=" + eval(valName);
    						dataO[data.scrnMovParm] = eval(valName);
	    				}
	    			}

            		$a.popup({
            			popid : "ToDo",
            			title : winTitle,
                        url : bizUrl,
                        data : dataO,
                        windowpopup : true,
                        modal : false,
                    	movable : true,
                    	width : data.wndwWidhSz,
                    	height : data.wndwHeghSz,
                    	callback : function(data) {
                    		setGrid("init");
                    	}
                	});
        		} else {
            		$a.popup({
            			popid : "ToDo",
            			title : winTitle,
                        url : "/tango-transmission-web/webportal/todomgmt/TodoMgmtToNgBpms.do",
                        windowpopup : true,
                        modal : false,
                    	movable : true,
                    	data : data,
                    	width : 1400,
                    	height : 900,
                    	callback : function(data) {
                    		setGrid("init");
                    	}
                	});
        		}
        		return;
        	}

    		if (data.actTyp == "human") {
    			var bizUrl = data.menuScrnUrl;
            	if (bizUrl.indexOf("?") > 0) {
            		bizUrl = bizUrl + "&" + data.bizUnqIdVarNm + "=" + data.bizUnqId;
            	} else {
            		bizUrl = bizUrl + "?" + data.bizUnqIdVarNm + "=" + data.bizUnqId;
            	}
            	if (data.scrnMovParm != null) {
            		bizUrl = bizUrl + "&" + data.scrnMovParm;
            	}
            	
            	/*
            	 * 업무별 하드코딩
            	 */
            	if (data.menuScrnId == "TS0053323") {
            		bizUrl = bizUrl + "&skAfcoDivCd=T&cstrCd=" + data.bizUnqId;
            	} else if (data.menuScrnId == "TS0004527" || data.menuScrnId == "TS0004530") {
            		//bizUrl = bizUrl + "&appltNm=" + escape(encodeURIComponent(data.workNm));
            		dataO.appltNm = data.workNm;
            	}
        		if (data.procsClCd == "21") {
        			bizUrl = bizUrl + "&appltKndCd=" + data.appltKndCd;
        		}
            	if (data.procsClCd == "31" && data.wkrtAprvSrno != 0) {
            		bizUrl = bizUrl + "&wkrtAprvSrno=" + data.wkrtAprvSrno;
            	}
            	/*
            	 * 업무별 하드코딩
            	 */
            	
            	if (data.wndwDiv == "wndwpopup") {
            		$a.popup({
            			popid : "ToDo",
            			title : winTitle,
                        url : bizUrl,
                        data : dataO,
                        windowpopup : true,
                        modal : false,
                    	movable : true,
                    	width : data.wndwWidhSz,
                    	height : data.wndwHeghSz,          	
                    	callback : function(data) {
                    		setGrid("init");
                    	}
                	});
            	} else if (data.wndwDiv == "main") {            
            		var callParam = new Object();            		
            		var splitUrl = data.menuScrnUrl.split("?");
            		bizUrl = splitUrl[0];
            		if (splitUrl.length > 1) {
            			var splitUrlParam = splitUrl[1].split("&");
            			for (var i=0; i<splitUrlParam.length; i++) {
                			var splitParam = splitUrlParam[i].split("=");
                			callParam[splitParam[0]] = splitParam[1];
            			}
            		}
                	if (data.scrnMovParm != null) {
            			var splitMovParam = data.scrnMovParm.split("&");
            			for (var i=0; i<splitMovParam.length; i++) {
                			var splitParam = splitMovParam[i].split("=");
                			callParam[splitParam[0]] = splitParam[1];
            			}
                	}
                	callParam[data.bizUnqIdVarNm] = data.bizUnqId;
                	callParam["fromToDoListYn"] = "Y";
            		$a.popup({
            			popid : "ToDo",
            			title : winTitle,
                        url : bizUrl,
                        windowpopup : true,
                        modal : false,
                    	movable : true,
                    	data : callParam,
                    	width : 1600,
                    	height : 900,          	
                    	callback : function(data) {
                    		setGrid("init");
                    	}
                	});                	
            		//$a.navigate(bizUrl, callParam);
            	} else if (data.wndwDiv == "popup") {
            		$a.popup({
            			popid : "ToDo",
            			title : winTitle,
                        url : bizUrl,
    					windowpopup: true,
    					modal: false,
    					movable: true,
                    	width : data.wndwWidhSz,
                    	height : data.wndwHeghSz,       	
                    	callback : function(data) {
                    		setGrid("init");
                    	}
                	});
            	} else {
            		$a.popup({
            			popid : "ToDo",
            			title : winTitle,
                        url : bizUrl,
    					windowpopup: true,
    					modal: false,
    					movable: true,
                    	width : "1600",
                    	height : "900",       	
                    	callback : function(data) {
                    		setGrid("init");
                    	}
                	});
            	}
    		} else {
        		var popupUrl = "/tango-transmission-web/webportal/todomgmt/TodoMgmtToBpms.do"
            	var view = "ITAPRV_TO_DO";
        		var itaprvWindowWidth = 1600 + 120;
        		if (data.wndwWidhSz != null) {
        			itaprvWindowWidth = eval(data.wndwWidhSz) + 120;
        		}
        		$a.popup({
        			popid : "ToDo",
        			title : winTitle,
                    url : popupUrl,
                    windowpopup : true,
                    modal : false,
                	movable : true,
                	width : itaprvWindowWidth,
                	height : 800,
                	data : {
                		bizUnqId : data.bizUnqId,
                		procsClCd : data.procsClCd,
                		userRoleCd : data.userRoleCd,
                		menuScrnId : data.menuScrnId, 
                		view : view,
                		viewStatus : 'Curren'
                	},            	
                	callback : function(data) {
                		setGrid("init");
                	}
            	});    		
    		}
        });
        
	 	// 공사명 조회
        $('#btnSearchCstr').on('click', function(e) {
	 		setConstruction('engstNo', 'cstrNm');
	    });
        
		// 시공업체 조회
        $('#cnstnBpIdBtn').on('click', function(e) {
			setBp('bpId', 'bpNm');
		});        
	};

	
	//select Box Value 수집
	var getSelValList = function(selObj){
		var selObjVal = "";
		var selObjValList = [];
		var optionEleList = $(selObj).find("option");
		var optionEleListLength = optionEleList.length;
		
		$(optionEleList).each(function(i, el){
			selObjVal = $.trim($(el).val());
			
			if(selObjVal != undefined && selObjVal != "undefined" && selObjVal != "" && selObjVal != "init"){
				selObjValList.push(selObjVal);
			}
		});
		
		return selObjValList;
	};
	
	var calculateDate = function(option) {		
		var current_date = new Date();
  		var option_date = new Date(Date.parse(current_date) - option * 1000 * 60 * 60 * 24);		
  		var option_Year = option_date.getFullYear();
  		var option_Month = (option_date.getMonth()+1)>9 ? ''+(option_date.getMonth()+1) : '0'+(option_date.getMonth()+1);
  		var option_Day = option_date.getDate() > 9 ? '' + option_date.getDate() : '0' + option_date.getDate();  		
  		return option_Year + '-' + option_Month + '-' + option_Day;
	};
	
	// 공통콤보 설정
	var setCombo = function() {
		setSelectByCode('selectSkAfcoDivCd', 'select', 'C00212', setSkAfcoDivCdCodeCallBack);
		setSelectByCode('selectCstrMgmtOnrCd', 'all', 'C00332', null);
		setBpByRole('bpId', 'bpNm', 'cnstnBpIdBtn');
		//사업구분
		var bizParamArg = ["demdInvtDivCd"];
		setSelectByBiz('afeYr','uprDemdBizDivCd', 'lowDemdBizDivCd', null, 'all', bizParamArg);
	};
	
	function setSkAfcoDivCdCodeCallBack(rtnId) {
		var selectSkAfcoDivCd = $('#chrrOrgGrpCd').val();
		$('#selectSkAfcoDivCd option[value=""]').remove();
		if (selectSkAfcoDivCd == "SKT") {
			$('#selectSkAfcoDivCd').setSelected('T');
			$('#bizPlanNm').setEnabled(false);
			setSelectByOrg('selectAreaCd', 'all', setSelectByOrgCallBack);
		} else if(selectSkAfcoDivCd == "SKB") {
			$('#selectSkAfcoDivCd').setSelected('B');
			$('#bizPlanNm').setEnabled(true);
			setSelectByOrgMulti('selectAreaCd', 'all', setSelectByOrgCallBack);
		} 
		$('#selectSkAfcoDivCd').setEnabled(false);
		
		//청약종류
		var appltKndCombo = 'tango-transmission-biz/transmission/subscriptionmgmt/receipt/applicationreceiptList/appltkndcombo/'+selectSkAfcoDivCd;
		httpRequest(appltKndCombo, null,'GET','appltKndCombo');
	}
	
	function httpRequest(uri,data,method,flag){
		Tango.ajax({
			url : uri,
			data : data,
			method : method,
			flag:flag
		}).done(function(response){successCallback(response, flag);})
			.fail(function(response){failCallback(response, flag);});
	};
	
	function successCallback(response, flag){
		if(flag =='appltKndCombo') {
			$("#appltKndCd").html("");
			$("#appltKndCd").append($("<option value=''>전체</option>"));
			$.each(response.appltKndCombo, function(key, value){
				if(value.comCd != '07'){ // 운용성공사청약은 구축 To-Do List에서 제외처리 - 19.03.11 Kim Seung Yu
					$("#appltKndCd").append($("<option></option>").val(value.comCd).html(value.comCdNm));
				}
			});	
			$("#appltKndCd").setSelected($('#appltKndCd option:eq(0)').val()); 
		}
	};
	
	var failCallback = function(response){
		if($.TcpUtils.isEmpty(response.message) == false){
    		callMsgBox('failChk','I', response.message, btnMsgCallback);	
    	}else{
    		callMsgBox('validChk','I', "fail:" + serviceId, btnMsgCallback);
    	}
	};
	
	function setSelectByOrgCallBack(rtnId) {
		setGrid("init");
	};
	
	//리스트 붙여넣는 Input 값을 처리하는 객체
	var setMultiInput = {
	  textareaId : "",
	  selBoxId : "",
	  initButtonId : "",
	  Execute : function(){
		if(setMultiInput._checkOtionVal()){
			return false;
		}
	    var textAreaObj = $("#"+setMultiInput.textareaId);
	    var selBoxObj = $("#"+setMultiInput.selBoxId);
	    var initButtonObj = $("#"+setMultiInput.initButtonId);
	    var i = 0;
	  	var j = 0;
	  	var selValStrListLength = 0;
	  	var selVal = "";
	  	var currSelVal = "";
	  	var selValListStr = $(textAreaObj).val();   
	  	var selValStrList = new Array();
	  	var currSelValList = getSelValList(selBoxObj);
	  	var currSelValListLength = currSelValList.length;
	  	var isOverlap = false;
	  	var vOptionsList = new Array();
	  	
	  	var selValStrList = $.trim(selValListStr).split("\n");
	  	selValStrList = $.unique(selValStrList);
	  	selValStrListLength = selValStrList.length;
	  	
	  	if(currSelValList.length > 0){
	  		for(i = 0 ; i < currSelValListLength; i += 1){
	  			currSelVal = $.trim(currSelValList[i]);
	  			vOptionsList.push({value: currSelVal, text: currSelVal});
	  		}
	  	}
	  	
	  	for(i = 0 ; i < selValStrListLength; i += 1){        		
	  		selVal = $.trim(selValStrList[i]);
	  		
	  		if(selVal !== ""){
	  			//중복 체크(함수로 빼기)
	  			for(j = 0; j < currSelValListLength; j += 1){
	  				currSelVal = $.trim(currSelValList[j]);
	  				
	  				if(currSelVal == selVal){
	  					isOverlap = true;
	  					break;
	  			  }
	  			}
	  			
	  			if(!isOverlap){
	  				vOptionsList.push({value: selVal, text: selVal});
	  			}
	  		}
	  	}
	  	
		$(selBoxObj).setData({
		  selectOptionsl:vOptionsList
		});
		$(initButtonObj).attr("class","Button button2 color_green");
		$(textAreaObj).val("");
	  },
	  _checkOtionVal : function(){
		  if($.trim(setMultiInput.textareaId) == ""){
			  alert("set option for a textareaId");
		  }else if($.trim(setMultiInput.selBoxId) == ""){
			  alert("set option for a selBoxId");
		  }else if($.trim(setMultiInput.initButtonId) == ""){
			  alert("set option for a initButtonId");
		  }
	  }
	}
});