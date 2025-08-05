/**
 * ItaprvProgCurst
 *
 * @author P095411
 * @date 2016. 12. 1. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
	
	var gridTabArray = ["Curren", "Progre", "Comple", "Reject"];
	var selectedGridTab = gridTabArray[0];
	var gMgmtOrgId = "";
	var gActTyp = "";
	var paramProcsClCd;
	var isInit = true;
	
  	$('body').keydown(function(key) {
		if (key.keyCode == 13) {
			$('#search').click();
		}
	});
	
	this.init = function(pageId, param) {
	
		selectProcsClCd.model.get();
		selectSkAfcoDivCd.model.get();
		
		paramProcsClCd = param.procsClCd;
		if (paramProcsClCd != null) {			
			fnSelectActCd();			
		}
		
		if(gActTyp == ""){
			selectActNm.setSelected("");
    		$("#selectActNm option").remove();
    		$("#selectActNm").append("<option value=''>선택</option>");
		}
		
		$("#bizStaDtmtFrom").val(calculateDate(13)); 
		$("#bizStaDtmtTo").val(calculateDate(0));
		
		setCombo();
		
    	initGridCurren();
    	initGridProgre();
    	initGridComple();
    	initGridReject();
    	
    	setEventListener();
	};

    //ajax model Select Component
    var selectSkAfcoDivCd = Tango.select.init({        
        el: '#selectSkAfcoDivCd',
        model: Tango.ajax.init({
            url: 'tango-common-business-biz/common/business/system/codes/C00308'
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
        //allType: true
        allType: ($('#chrrOrgGrpCd').val() == 'T') ? true : ""
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
    var selectProcsClCd = Tango.select.init({        
        el: '#selectProcsClCd',
        model: Tango.ajax.init({
            url: 'tango-common-business-biz/common/business/system/codes/C00216'
        }),
        allType: true
    });    
    /* 지역구분 */
	var selectDsnBpChrgOrgId = Tango.select.init({
		el: '#selectDsnBpChrgOrgId',
   		valueField : 'workAreaDivCd', 	// data에서 option value에 지정할 field(key)
   		labelField : 'workAreaDivCdNm', 	// data에서 option text에 지정할 field(key)
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
    
    var selectActNm = Tango.select.init({
		el: '#selectActNm',
		allType: false
	});
    
	//Grid 초기화
	function initGridCurren() {
    	$('#gridCurren').alopexGrid({
			autoColumnIndex: true,
			rowSingleSelect: false,
    		defaultColumnMapping : {
    			resizing: true
    		},
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
	            {selectorColumn : true, width: '40px'},
     	        {key : 'rownumber',         align:'center', width:'60px',   title : '순번'},    	        
     	        {key : 'skAfcoDivCdNm',     align:'left',   width:'110px',  title : '사업자'},
     	        {key : 'areaCdNm',          align:'left',   width:'130px',  title : '본부구분'},
     	        {key : 'appltKndCdNm',      align:'left',   width:'110px',  title : '청약종류'},     	        
     	        {key : 'appltNo',           align:'left',   width:'110px',  title : '청약번호'},
     	        {key : 'engstNo',           align:'left',   width:'150px',  title : 'EngSheet번호'},     	        
     	        {key : 'procsClCdNm',       align:'left',   width:'120px',  title : '프로세스분류'},
     	        {key : 'bpNm',              align:'left',   width:'150px',  title : '시공업체명'},
     	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
     	        {key : 'appltNm',           align:'left',   width:'250px',  title : '청약명'},
    	        {key : 'cstrNm',            align:'left',   width:'250px',  title : '공사명'},
     	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
     	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
     	        {key : 'actNm',             align:'left',   width:'100px',  title : '승인단계'},    
     	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
     	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
     	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
     	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'},
     	        {key : '',                  align:'center', width:'100px',  title : '승인진행상태', render : {type : 'unitbProcProgStat'}},
    	        {key : 'skAfcoDivCd',       width:'0px',    title : '사업자',                hidden : true},
    	        {key : 'appltAprvTypCd',    width:'0px',    title : '청약승인유형코드',      hidden : true},
    	        {key : 'procsClCd',         width:'0px',    title : '프로세스분류',          hidden : true},
    	        {key : 'userRoleCd',        width:'0px',    title : '사용자역할코드',        hidden : true},
    	        {key : 'menuScrnId',        width:'0px',    title : '메뉴화면ID',            hidden : true},
    	        {key : 'actCd',             width:'0px',    title : '업무코드',              hidden : true},
    	        {key : 'areaCd',            width:'0px',    title : '본부코드',              hidden : true},    	        
    	        {key : 'clsTlmtDay',        width:'0px',    title : '마감기한일',            hidden : true},
     	        {key : 'wndwDiv',           width:'0px',    title : '윈도우구분',            hidden : true},
     	        {key : 'wndwWidhSz',        width:'0px',    title : '윈도우가로사이즈',      hidden : true},
     	        {key : 'wndwHeghSz',        width:'0px',    title : '윈도우세로사이즈',      hidden : true},    	        
    	        {key : 'frstRegDate',       width:'0px',    title : '최초등록일자',          hidden : true},
    	        {key : 'frstRegUserId',     width:'0px',    title : '최초등록사용자ID',      hidden : true},
    	        {key : 'lastChgDate',       width:'0px',    title : '최종변경일자',          hidden : true},
    	        {key : 'lastChgUserId',     width:'0px',    title : '최종변경사용자ID',      hidden : true},
    	        {key : 'bpmsTaskid',     	width:'0px',    title : 'BPMS아이디',      		 hidden : true}
    	    ]
    	});
    	$('#gridCurrenExcel').alopexGrid({
			autoColumnIndex: true,
    		rowClickSelect: true,
        	paging : {
        		hidePageList: true,
        		pagerSelect: false
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
	 	        {key : 'bpNm',              align:'left',   width:'200px',  title : '시공업체명'},
	 	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
	 	        {key : 'appltNm',           align:'left',   width:'300px',  title : '청약명'},
	 	        {key : 'cstrNm',            align:'left',   width:'300px',  title : '공사명'},
	 	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
	 	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
	 	        {key : 'actNm',             align:'left',   width:'100px',  title : '승인단계'},
	 	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
	 	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
	 	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
	 	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'}
    	    ]
    	});    	
    };
    
	function initGridProgre() {
    	$('#gridProgre').alopexGrid({
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
	 	        {key : 'bpNm',              align:'left',   width:'150px',  title : '시공업체명'},
	 	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
	 	        {key : 'appltNm',           align:'left',   width:'250px',  title : '청약명'},
	 	        {key : 'cstrNm',            align:'left',   width:'250px',  title : '공사명'},
	 	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
	 	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
    	        {key : 'bizFnshUserNm',     align:'center', width:'100px',  title : '진행자명'},
    	        {key : 'bizFnshDtmt',       align:'center', width:'130px',  title : '진행일시'},
	 	        {key : 'actNm',             align:'left',   width:'100px',  title : '승인단계'},
	 	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
	 	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
	 	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
	 	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'},
    	        {key : '',                  align:'center', width:'100px',  title : '승인진행상태', render : {type : 'unitbProcProgStat'}},    	        
    	        {key : 'skAfcoDivCd',       width:'0px',    title : '사업자',                hidden : true},
    	        {key : 'appltAprvTypCd',    width:'0px',    title : '청약승인유형코드',      hidden : true},
    	        {key : 'procsClCd',         width:'0px',    title : '프로세스분류',          hidden : true},    	        
    	        {key : 'bpmsTaskid',        width:'0px',    title : 'BPMS TASKID',           hidden : true},
    	        {key : 'userRoleCd',        width:'0px',    title : '사용자역할코드',        hidden : true},
    	        {key : 'menuScrnId',        width:'0px',    title : '메뉴화면ID',            hidden : true},
    	        {key : 'actCd',             width:'0px',    title : '업무코드',              hidden : true},
    	        {key : 'areaCd',            width:'0px',    title : '본부코드',              hidden : true},
    	        {key : 'clsTlmtDay',        width:'0px',    title : '마감기한일',            hidden : true},
    	        {key : 'bizProgStatCd',     width:'0px',    title : '업무진행상태코드',      hidden : true},
    	        {key : 'procsProgStat',     width:'0px',    title : '승인업무진행상태',      hidden : true},    	        
    	        {key : 'actProgStat',       width:'0px',    title : '승인단계진행상태',      hidden : true},
    	        {key : 'bizFnshUserId',     width:'0px',    title : '승인자아이디',          hidden : true},
    	        {key : 'migFlag',           width:'0px',    title : '이관데이터플래그',      hidden : true},    	        
    	        {key : 'preActTyp',         width:'0px',    title : '이전업무구분',          hidden : true},
    	        {key : 'preActCd',          width:'0px',    title : '이전업무코드',          hidden : true},    	    
    	        {key : 'preBizFnshUserId',  width:'0px',    title : '이전업무완료자',        hidden : true},    	        
    	        {key : 'itaprvProgDiv',     width:'0px',    title : '승인반려구분',          hidden : true},
     	        {key : 'wndwDiv',           width:'0px',    title : '윈도우구분',            hidden : true},
     	        {key : 'wndwWidhSz',        width:'0px',    title : '윈도우가로사이즈',      hidden : true},
     	        {key : 'wndwHeghSz',        width:'0px',    title : '윈도우세로사이즈',      hidden : true},    	        
    	        {key : 'frstRegDate',       width:'0px',    title : '최초등록일자',          hidden : true},
    	        {key : 'frstRegUserId',     width:'0px',    title : '최초등록사용자ID',      hidden : true},
    	        {key : 'lastChgDate',       width:'0px',    title : '최종변경일자',          hidden : true},
    	        {key : 'lastChgUserId',     width:'0px',    title : '최종변경사용자ID',      hidden : true},
    	        {key : 'bizPlanNm',    		width:'0px',    title : '사업명',      		     hidden : true}
    	    ]
    	});
       	$('#gridProgreExcel').alopexGrid({
			autoColumnIndex: true,
    		rowClickSelect: true,
        	paging : {
        		hidePageList: true,
        		pagerSelect: false
        	},
    		message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>조회된 데이터가 없습니다.</div>"
			},
	        columnMapping : [
	  	        {key : 'rownumber',         align:'center', width:'60px',   title : '순번'},    	        
	 	        {key : 'skAfcoDivCdNm',     align:'left',   width:'110px',  title : '사업자'},
	 	        {key : 'areaCdNm',          align:'left',   width:'110px',  title : '본부구분'},
	 	        {key : 'appltKndCdNm',      align:'left',   width:'120px',  title : '청약종류'},     	        
	 	        {key : 'appltNo',           align:'left',   width:'110px',  title : '청약번호'},
	 	        {key : 'engstNo',           align:'left',   width:'150px',  title : 'EngSheet번호'},     	        
	 	        {key : 'procsClCdNm',       align:'left',   width:'120px',  title : '프로세스분류'},  
	 	        {key : 'bpNm',              align:'left',   width:'200px',  title : '시공업체명'},
	 	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
	 	        {key : 'appltNm',           align:'left',   width:'300px',  title : '청약명'},
	 	        {key : 'cstrNm',            align:'left',   width:'300px',  title : '공사명'},
	 	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
	 	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
    	        {key : 'bizFnshUserNm',     align:'center', width:'100px',  title : '진행자명'},
    	        {key : 'bizFnshDtmt',       align:'center', width:'130px',  title : '진행일시'},
	 	        {key : 'actNm',             align:'left',   width:'100px',  title : '승인단계'},
	 	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
	 	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
	 	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
	 	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'}
    	    ]
    	});    	
    };
    
	function initGridComple() {
    	$('#gridComple').alopexGrid({
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
	 	        {key : 'bpNm',              align:'left',   width:'150px',  title : '시공업체명'},
	 	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
	 	        {key : 'appltNm',           align:'left',   width:'250px',  title : '청약명'},
	 	        {key : 'cstrNm',            align:'left',   width:'250px',  title : '공사명'},
	 	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
	 	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
    	        {key : 'bizFnshUserNm',     align:'center', width:'100px',  title : '완료자명'},
    	        {key : 'bizFnshDtmt',       align:'center', width:'130px',  title : '완료일시'},
	 	        {key : 'actNm',             align:'left',   width:'100px',  title : '승인단계'},
	 	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
	 	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
	 	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
	 	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'},
    	        {key : '',                  align:'center', width:'100px',  title : '승인진행상태', render : {type : 'unitbProcProgStat'}},    	        
    	        {key : 'skAfcoDivCd',       width:'0px',    title : '사업자',                hidden : true},
    	        {key : 'appltAprvTypCd',    width:'0px',    title : '청약승인유형코드',      hidden : true},
    	        {key : 'procsClCd',         width:'0px',    title : '프로세스분류',          hidden : true},    	        
    	        {key : 'bpmsTaskid',        width:'0px',    title : 'BPMS TASKID',           hidden : true},
    	        {key : 'userRoleCd',        width:'0px',    title : '사용자역할코드',        hidden : true},
    	        {key : 'menuScrnId',        width:'0px',    title : '메뉴화면ID',            hidden : true},
    	        {key : 'actCd',             width:'0px',    title : '업무코드',              hidden : true},
    	        {key : 'areaCd',            width:'0px',    title : '본부코드',              hidden : true},
    	        {key : 'clsTlmtDay',        width:'0px',    title : '마감기한일',            hidden : true},
    	        {key : 'bizProgStatCd',     width:'0px',    title : '업무진행상태코드',      hidden : true},
    	        {key : 'procsProgStat',     width:'0px',    title : '승인업무진행상태',      hidden : true},    	        
    	        {key : 'actProgStat',       width:'0px',    title : '승인단계진행상태',      hidden : true},
    	        {key : 'bizFnshUserId',     width:'0px',    title : '승인자아이디',          hidden : true},
    	        {key : 'migFlag',           width:'0px',    title : '이관데이터플래그',      hidden : true},    	        
    	        {key : 'preActTyp',         width:'0px',    title : '이전업무구분',          hidden : true},
    	        {key : 'preActCd',          width:'0px',    title : '이전업무코드',          hidden : true},    	    
    	        {key : 'preBizFnshUserId',  width:'0px',    title : '이전업무완료자',        hidden : true},    	        
    	        {key : 'itaprvProgDiv',     width:'0px',    title : '승인반려구분',          hidden : true},
     	        {key : 'wndwDiv',           width:'0px',    title : '윈도우구분',            hidden : true},
     	        {key : 'wndwWidhSz',        width:'0px',    title : '윈도우가로사이즈',      hidden : true},
     	        {key : 'wndwHeghSz',        width:'0px',    title : '윈도우세로사이즈',      hidden : true},    	        
    	        {key : 'frstRegDate',       width:'0px',    title : '최초등록일자',          hidden : true},
    	        {key : 'frstRegUserId',     width:'0px',    title : '최초등록사용자ID',      hidden : true},
    	        {key : 'lastChgDate',       width:'0px',    title : '최종변경일자',          hidden : true},
    	        {key : 'lastChgUserId',     width:'0px',    title : '최종변경사용자ID',      hidden : true},
    	        {key : 'bizPlanNm',    		width:'0px',    title : '사업명',      		     hidden : true}
    	    ]
    	});
    	$('#gridCompleExcel').alopexGrid({
			autoColumnIndex: true,
    		rowClickSelect: true,
        	paging : {
        		hidePageList: true,
        		pagerSelect: false
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
	 	        {key : 'bpNm',              align:'left',   width:'200px',  title : '시공업체명'},
	 	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
	 	        {key : 'appltNm',           align:'left',   width:'300px',  title : '청약명'},
	 	        {key : 'cstrNm',            align:'left',   width:'300px',  title : '공사명'},
	 	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
	 	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
    	        {key : 'bizFnshUserNm',     align:'center', width:'100px',  title : '완료자명'},
    	        {key : 'bizFnshDtmt',       align:'center', width:'130px',  title : '완료일시'},
	 	        {key : 'actNm',             align:'left',   width:'100px',  title : '승인단계'},
	 	        {key : 'preActNm',          align:'left',   width:'100px',  title : '이전승인단계'},
	 	        {key : 'preBizFnshDtmt',    align:'center', width:'130px',  title : '이전승인완료일시'},
	 	        {key : 'preBizFnshUserNm',  align:'left',   width:'120px',  title : '이전승인완료자'},
	 	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'}
	 	        
    	    ]
    	});    	
    };
    
	function initGridReject() {
    	$('#gridReject').alopexGrid({
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
	 	        {key : 'bpNm',              align:'left',   width:'150px',  title : '시공업체명'},
	 	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
	 	        {key : 'appltNm',           align:'left',   width:'250px',  title : '청약명'},
	 	        {key : 'cstrNm',            align:'left',   width:'250px',  title : '공사명'},
	 	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
	 	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
    	        {key : 'bizFnshUserNm',     align:'center', width:'100px',  title : '이전승인완료자'},
    	        {key : 'bizFnshDtmt',       align:'center', width:'130px',  title : '이전승인완료일시'},
	 	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'},
    	        {key : '',                  align:'center', width:'100px',  title : '승인진행상태', render : {type : 'unitbProcProgStat'}},    	        
    	        {key : 'skAfcoDivCd',       width:'0px',    title : '사업자',                hidden : true},
    	        {key : 'appltAprvTypCd',    width:'0px',    title : '청약승인유형코드',      hidden : true},
    	        {key : 'procsClCd',         width:'0px',    title : '프로세스분류',          hidden : true},    	        
    	        {key : 'bpmsTaskid',        width:'0px',    title : 'BPMS TASKID',           hidden : true},
    	        {key : 'userRoleCd',        width:'0px',    title : '사용자역할코드',        hidden : true},
    	        {key : 'menuScrnId',        width:'0px',    title : '메뉴화면ID',            hidden : true},
    	        {key : 'actCd',             width:'0px',    title : '업무코드',              hidden : true},
    	        {key : 'areaCd',            width:'0px',    title : '본부코드',              hidden : true},
    	        {key : 'clsTlmtDay',        width:'0px',    title : '마감기한일',            hidden : true},
    	        {key : 'bizProgStatCd',     width:'0px',    title : '업무진행상태코드',      hidden : true},
    	        {key : 'procsProgStat',     width:'0px',    title : '승인업무진행상태',      hidden : true},    	        
    	        {key : 'actProgStat',       width:'0px',    title : '승인단계진행상태',      hidden : true},
    	        {key : 'bizFnshUserId',     width:'0px',    title : '승인자아이디',          hidden : true},
    	        {key : 'migFlag',           width:'0px',    title : '이관데이터플래그',      hidden : true},    	        
    	        {key : 'preActTyp',         width:'0px',    title : '이전업무구분',          hidden : true},
    	        {key : 'preActCd',          width:'0px',    title : '이전업무코드',          hidden : true},    	    
    	        {key : 'preBizFnshUserId',  width:'0px',    title : '이전업무완료자',        hidden : true},    	        
    	        {key : 'itaprvProgDiv',     width:'0px',    title : '승인반려구분',          hidden : true},
     	        {key : 'wndwDiv',           width:'0px',    title : '윈도우구분',            hidden : true},
     	        {key : 'wndwWidhSz',        width:'0px',    title : '윈도우가로사이즈',      hidden : true},
     	        {key : 'wndwHeghSz',        width:'0px',    title : '윈도우세로사이즈',      hidden : true},    	        
    	        {key : 'frstRegDate',       width:'0px',    title : '최초등록일자',          hidden : true},
    	        {key : 'frstRegUserId',     width:'0px',    title : '최초등록사용자ID',      hidden : true},
    	        {key : 'lastChgDate',       width:'0px',    title : '최종변경일자',          hidden : true},
    	        {key : 'lastChgUserId',     width:'0px',    title : '최종변경사용자ID',      hidden : true},
    	        {key : 'bizPlanNm',    		width:'0px',    title : '사업명',      		     hidden : true}
    	    ]
    	});
    	$('#gridRejectExcel').alopexGrid({
			autoColumnIndex: true,
    		rowClickSelect: true,
        	paging : {
        		hidePageList: true,
        		pagerSelect: false
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
	 	        {key : 'workNm',            align:'left',   width:'300px',  title : '승인업무명'},
	 	        {key : 'appltNm',           align:'left',   width:'300px',  title : '청약명'},
	 	        {key : 'cstrNm',            align:'left',   width:'300px',  title : '공사명'},
	 	        {key : 'bpNm',              align:'left',   width:'200px',  title : '시공업체명'},
	 	        {key : 'cstrMgmtOnrCdNm',   align:'left',   width:'150px',  title : '관리주체'},
	 	        {key : 'sumrAmt',   		align:'right',  width:'120px',  title : '투자비합계',sorting : 'number', render: {type: 'string', rule: 'comma'}},
		        {key : 'bizFnshUserNm',     align:'center', width:'100px',  title : '이전승인완료자'},
		        {key : 'bizFnshDtmt',       align:'center', width:'130px',  title : '이전승인완료일시'},
	 	        {key : 'bizUnqId',          align:'left',   width:'150px',  title : '업무고유아이디'}
    	    ]
    	});    	
    };    
    
    var showProgress = function() {
    	$('#grid'+selectedGridTab).alopexGrid('showProgress');
	};
	
	var hideProgress = function() {
		$('#grid'+selectedGridTab).alopexGrid('hideProgress');
	};    
    
  	//Grid Set
    function setGrid(flag) {
    	if (flag == "init") {
        	$("#pageNo").val("1");    		
    	}    	
    	var pageNo = $("#pageNo").val();
    	var rowPerPage = $("#rowPerPage").val();
    	if (flag == "excel") {
    		pageNo = 1;
        	rowPerPage = 10000;    		
    	}
    	
    	if(isInit){
    		isInit = false;
    		return;
    	}
    	
    	var ajaxUrl;
    	if (selectedGridTab == "Curren") {
    		ajaxUrl = "tango-transmission-biz/webportal/itaprv/itaprvCurrent";
    	} else if (selectedGridTab == "Progre") {
    		ajaxUrl = "tango-transmission-biz/webportal/itaprv/itaprvProgress";
    	} else if (selectedGridTab == "Comple") {
    		ajaxUrl = "tango-transmission-biz/webportal/itaprv/itaprvComplete";
    	} else if (selectedGridTab == "Reject") {
    		ajaxUrl = "tango-transmission-biz/webportal/itaprv/itaprvReject";    		
    	}
    	
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
    	$.ajaxSettings.traditional=true;
    	
    	Tango.ajax({
    		url: ajaxUrl,
    		data: {
    			pageNo: pageNo,
    			rowPerPage: rowPerPage,
    			skAfcoDivCd: selectSkAfcoDivCd.getValue(),    		
    			areaCd: orgList,
    			areaCdList: orgList,
    			procsClCd: selectProcsClCd.getValue(),
    			workNm: $("#workNm").val(),    			
    			dsnBpChrgOrgId: selectDsnBpChrgOrgId.getValue(), //작업지역코드
    			cstrMgmtOnrCd: selectCstrMgmtOnrCd.getValue(), //관리주체코드
    			actTyp: $("#selectActTyp").val(), //업무구분
    			actNm: selectActNm.getValue(),
    			bizUnqIdList : getSelValList($("#selectBizUnqIdList")), //업무고유아이디 리스트
    			bizStaDtmtFrom: $("#bizStaDtmtFrom").val(),
    			bizStaDtmtTo: $("#bizStaDtmtTo").val(),
    			actCd : selectActCd.getValue(),
    			appltNo: $("#appltNo").val(),
    			appltNm: $("#appltNm").val(),
    			engstNo: $("#engstNo").val(),
    			bpId: $("#bpId").val(),
    			bizPlanNm: $("#bizPlanNm").val(),
    			appltKndCd: $('#appltKndCd').val(),			// 청약종류
    			afeYr: $('#afeYr').val(),			// 년도
    			uprDemdBizDivCd: $('#uprDemdBizDivCd').val(),			// 상위사업구분
    			lowDemdBizDivCd: $('#lowDemdBizDivCd').val(),			// 하위사업구분
    			searchTarget : $('input[name="searchTarget"]:checked').val()
    		},
    		method : 'get'
		}).done(function(response, status) {
			$.ajaxSettings.traditional=false;
			gridModelSuccessFn(response, status, flag);
		}).fail(function(response, status) {
			$.ajaxSettings.traditional=false;
			gridModelFailFn(response, status, flag);
		});
    }
    function gridModelSuccessFn(response, status, flag) {
		var serverPageinfo;    	
    	if (response.pager != null) {
    		serverPageinfo = {
    				dataLength  : response.pager.totalCnt, 		// 총 데이터 길이
    	      		current 	: response.pager.pageNo, 		// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    	      		perPage 	: response.pager.rowPerPage 	// 한 페이지에 보일 데이터 갯수
    	    };
    	}    	
    	hideProgress();
    	switch (flag) { 
			case 'init':
				$('#grid'+selectedGridTab).alopexGrid('dataSet', $.extend(true, [], response.lists), serverPageinfo);
				break;
			case 'scroll':
				$('#grid'+selectedGridTab).alopexGrid('dataAdd', $.extend(true, [], response.lists), serverPageinfo);
				break;
			case 'excel':
				$('#grid'+selectedGridTab+'Excel').alopexGrid('dataSet', $.extend(true, [], response.lists), serverPageinfo);				
	        	var worker = new ExcelWorker({
	        		excelFileName : '통합승인 진행현황 리스트',
	        		palette : [{
	        			className : 'B_YELLOW',
	        			backgroundColor: '255,255,0'
	        		},
	        		{
	        			className : 'F_RED',
	        			color: '#FF0000'
	        		}],
	        		sheetList: [{
	        			sheetName: '통합승인 진행현황 리스트',
	        			$grid: $('#grid'+selectedGridTab+'Excel')
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
				break;	        	
			default:
    	};
    }    
    function gridModelFailFn(response, status, flag) {
    	hideProgress();
       	callMsgBox('Error', 'W', response == null ? ""+status : response.message, null);
    }
    
    //일괄승인 결과 Grid
    function initGridAllApprvResult() {
    	$('#gridResult').alopexGrid({
			autoColumnIndex: true,
    		rowClickSelect: true,
    		fitTableWidth: true,
        	paging : {
        		hidePageList: true,
        		pagerSelect: false
        	},
    		message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>진행이력이 없습니다.</div>"
			},
            renderMapping : {
            },
            defaultColumnMapping:{
				sorting: true
			},
	        columnMapping : [
  	  	        {key : 'businessId', align:'center', width:'60px',   title : '업무고유아이디'},    	        
	 	        {key : 'msg',     align:'left',   width:'120px',  title : '결과메시지'}
    	    ]
    	});
    };
    
    //일괄승인 결과 엑셀다운
    function initGridAllApprvResultExcel() {
    	$('#gridResultExcel').alopexGrid({
    		autoColumnIndex: true,
    		rowClickSelect: true,
    		fitTableWidth: true,
        	paging : {
        		hidePageList: true,
        		pagerSelect: false
        	},
    		message : {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>진행이력이 없습니다.</div>"
			},
            renderMapping : {
            },
	        columnMapping : [
  	  	        {key : 'businessId', align:'center', width:'150px',   title : '업무고유아이디'},    	        
	 	        {key : 'msg',     align:'left',   width:'420px',  title : '결과메시지'}
    	    ]
    	});
    };
    
    /**
     * progress bar 기능
     * parameter : obj, mode
     * obj 는 {startPercent : 0, endPercent : 0, id : "", totalCnt: 0}
     * mode는 기본으로 'init'으로 Error 로그로 볼수 있고 'debug' 값을 넘기면 alert을 뛰우게 됨.
     */
    function ProgressBar(obj, mode) {
    	var _log = function(msg){
    		if(mode == "debug"){
    			alert(msg);
    		}else{
    			throw new Error(msg);
    		}
    	}
    	
    	if(mode == null || typeof mode === "undefined") {mode = "info"; }
    	if(typeof obj === "undefined") {
    		_log("Object is undefined");
			return false;
    	}
    	if(typeof obj.startPercent === "undefined" || obj.startPercent == null) {
    		_log("startPercent value is undefined or null");
    		return false;
    	}else if(typeof obj.startPercent !== "number"){
			_log("startPercent value is not number");
    		return false;
    	}
    	if(typeof obj.endPercent === "undefined" || obj.endPercent == null) {
			_log("endPercent value is undefined or null"); 
    		return false;
    	}else if(typeof obj.endPercent !== "number"){
			_log("endPercent value is not number");
    		return false;
    	}
    	if(typeof obj.totalCnt === "undefined" || obj.totalCnt == null) {
			_log("totalCnt value is undefined or null"); 
    		return false;
    	}else if(typeof obj.totalCnt !== "number"){
			_log("totalCnt value is not number");
    		return false;
    	}
    	if(typeof obj.id === "undefined" || obj.id == null) {
			_log("id value is undefined or null");
    		return false;
    	}
    	
    	var _properties = {
			updatedPercent : 5,
	    	endPercent : obj.endPercent,
	    	currentCnt : 1,
	    	totalCnt : obj.totalCnt,
	    	elem : $(obj.id)
    	}
    	
    	if(_properties.elem == null){ _log("not found element by id"); return false; };
    	
    	this.run = function(){
	    	var i = _properties.updatedPercent;
	    	var intervalId = setInterval(frame, 5);
	    	_properties.endPercent = ((_properties.currentCnt/_properties.totalCnt)*100).toFixed(0);
	    	
	    	if(_properties.currentCnt < _properties.totalCnt){
	    		_properties.currentCnt += 1;
	    	}
			function frame() {
				if(_properties.updatedPercent >= _properties.endPercent){
					clearInterval(intervalId);
				}else{
					_properties.updatedPercent += 1;
					$(_properties.elem).css("width", _properties.updatedPercent + '%');
	    			$(_properties.elem).html(1 * _properties.updatedPercent + '%');
				}
			}
    	}
    	
    	this.init = function(){
    		$(_properties.elem).css("width", 5 + '%');
    		$(_properties.elem).html(0 + '%');
    	}
    	
    	this.getUpdatePercent = function(){
    		return _properties.updatedPercent;
    	}
    };
    
    //progressBar Dialog 초기 셋팅
    function startProgressBar(){
    	var left = ($(window).scrollLeft() + ($(window).width() - $('#myProgress').width()) / 2);
    	var top = ($(window).scrollTop() + ($(window).height() - $('#myProgress').height()) / 2);
    	$('#myProgress').css({'left':left, 'top':top, 'position':'absolute'});
    	//일괄승인 GRID 셋팅
    	initGridAllApprvResult();
    	//일괄승인엑셀 GRID 셋팅
    	initGridAllApprvResultExcel();
    	//카운트 초기화(성공,실패)
    	$('#successApprCnt').text("0");
    	$('#failApprCnt').text("0");
    	
    	wrapWindowByMask();
    	$('#myProgress').show();
    };
    
    //배경 비활성화
    function wrapWindowByMask(){
    	var maskHeight = $(document).height();
    	var maskWidth = $(window).width();
    	$('#myMask').css({'width':maskWidth, 'height':maskHeight});
    	$('#myMask').show();
    };
    
    //Progressbar 창닫기(X 버튼)
    $('#myDialogBntClose').on('click', function(){
    	setGrid("init");
    	$("#myBar").css("width", 5 + '%');
		$("#myBar").html(0 + '%');
    	$('#myMask').hide();
    	$('#myProgress').hide();
    });
    
  //Progressbar 창닫기(확인 버튼)
    $('#myDialogConfirmBnt').on('click', function(){
    	setGrid("init");
    	$("#myBar").css("width", 5 + '%');
		$("#myBar").html(0 + '%');
    	$('#myMask').hide();
    	$('#myProgress').hide();
    });
    
    $('#btnExcelDownResult').on('click', function(){
    	var worker = new ExcelWorker({
    		excelFileName : '일괄승인 결과 리스트',
    		palette : [{
    			className : 'B_YELLOW',
    			backgroundColor: '255,255,0'
    		},
    		{
    			className : 'F_RED',
    			color: '#FF0000'
    		}],
    		sheetList: [{
    			sheetName: '일괄승인 결과 리스트',
    			$grid: $('#gridResultExcel')
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
    });
    
    //일괄승인 처리
    function setAllApprove(pMaxCnt) {
    	var selectedData = $('#grid'+selectedGridTab).alopexGrid('dataGet', { _state: {selected: true} });
    	
    	if (selectedData.length == 0) {
    		callMsgBox('noTargetData', 'I', "일괄승인 대상을 선택해 주십시오.", null);
    	} else if(selectedData.length > pMaxCnt) {
    		callMsgBox('noTargetData', 'I', "일괄 승인은 "+ pMaxCnt +"개 이상 선택할 수 없습니다.", null);
    	} else {
            callMsgBox('allApproveConfirm', 'C', "일괄승인 하시겠습니까?", function(msgId, msgRst) {
                if (msgRst == "Y") {
                	selectedDataLength = selectedData.length;
                	//Progressbar 셋팅
                	startProgressBar();
                	var setProgressParams = {
	        			startPercent : 0, 
	        			endPercent : 0, 
	        			id : "#myBar", 
	        			totalCnt : selectedData.length
	    			};
	            	var progressBarObj = new ProgressBar(setProgressParams);
	            	//성공여부 CNT
                	var succCnt = 0;
                	var failCnt = 0;
                	//Grid 셋팅
                	var serverPageinfo = {
            				dataLength  : selectedData.length, 		// 총 데이터 길이
            	      		current 	: 1, 						// 현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
            	      		perPage 	: 10 						// 한 페이지에 보일 데이터 갯수
            	    };
                	$('#gridResult').alopexGrid('dataSet', $.extend(true, [], []), serverPageinfo);
                	$('#gridResultExcel').alopexGrid('dataSet', $.extend(true, [], []), serverPageinfo);
                	
                	var aBizUnqId = "";
                	var aProcsClCd = "";
                	var aBpmsTaskId = "";
                	
                	for (var i=0; i < selectedDataLength; i+=1) {
                		aBizUnqId = selectedData[i].bizUnqId;
                		aProcsClCd = selectedData[i].procsClCd;
                		aBpmsTaskId = selectedData[i].bpmsTaskid;
                		
                		setTimeAndCallFunc(aBizUnqId, aProcsClCd, aBpmsTaskId, progressBarObj, serverPageinfo);
                	}
                }
            });
    	}    	
    }
    
    function setTimeAndCallFunc(pBizUnqId, pProcsClCd, pBpmsTaskId, pProgressBarObj, pServerPageinfo){
    	setTimeout(function(){
			callApprove(pBizUnqId, pProcsClCd, pBpmsTaskId, pProgressBarObj, pServerPageinfo);
		}, 200);
    }
    
    //Ajax로 단건의 승인 처리
    function callApprove(pBizUnqId, pProcsClCd, pBpmsTaskId, progressBarObj, pServerPageinfo){
    	 var itaprvApproveModel = Tango.ajax.init({
 	        url: "uengine-web/bpms/itaprv/approveTask/" + pBizUnqId + "/" + pProcsClCd + "/" + pBpmsTaskId
 	    });
 	    itaprvApproveModel.put({
     		data: {
     		}         	    	
 		}).done(function(response, status) {
 			//Adjust a Progressbar Count
 			progressBarObj.run();	
 			
 			//Grid, Excel 데이터 Add
 			$('#gridResult').alopexGrid('dataAdd', $.extend(true, [], [{'businessId':pBizUnqId, 'msg':'승인완료'}]), pServerPageinfo);
 			$('#gridResultExcel').alopexGrid('dataAdd', $.extend(true, [], [{'businessId':pBizUnqId, 'msg':'승인완료'}]), pServerPageinfo);
 			
 			//승인완료 Cnt 적용
 			var successCnt = new Number($('#successApprCnt').text());
 			successCnt += 1;
 			$('#successApprCnt').text(successCnt);
 		}).fail(function(response, status) {
 			//Adjust a Progressbar Count
 			progressBarObj.run();	
 			
 			//Grid, Excel 데이터 Add
 			$('#gridResult').alopexGrid('dataAdd', $.extend(true, [], [{'businessId':pBizUnqId, 'msg':response.message}]), pServerPageinfo);
 			$('#gridResultExcel').alopexGrid('dataAdd', $.extend(true, [], [{'businessId':pBizUnqId, 'msg':response.message}]), pServerPageinfo);
 			
 			//승인실패 Cnt 적용
 			var failCnt = new Number($('#failApprCnt').text());
 			failCnt += 1;
 			$('#failApprCnt').text(failCnt);
 		});
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
		//검색
        $('#search').on('click', function(e) {
        	setGrid("init");
        });
    	//탭변경 이벤트
    	$('#basicTabs').on("tabchange", function(e, index) {
    		selectedGridTab = gridTabArray[index];
    		setGrid("init");
    	});        
    	 $('#selectProcsClCd').on('change', function(e) {        	
         	fnSelectActCd(selectProcsClCd.getValue());
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
        
        for (var i=0; i<gridTabArray.length; i++) {
        	
            $('#btnExcelDown' + gridTabArray[i]).on('click', function(event) {
            	//setGrid("excel");
            	
            	//Ondemend Excel 호출
    			
            	var strFileName = '';
            	var strScreenId = '';
            	if(selectedGridTab == 'Curren'){
            		strfileName = "통합승인진행현황_승인_";
            		strScreenId = "itaprvCurrent";
            	}else if(selectedGridTab == 'Progre'){
            		strfileName = "통합승인진행현황_진행_";
            		strScreenId = "itaprvProgress";
            	}else if(selectedGridTab == 'Comple'){
            		strfileName = "통합승인진행현황_완료_";
            		strScreenId = "itaprvComplete";
            	}else if(selectedGridTab == 'Reject'){
            		strfileName = "통합승인진행현황_반려_";
            		strScreenId = "itaprvReject";
            	}else{
            		strfileName = "통합승인진행현황";
            		strScreenId = "itaprvCurrent";
            	}
            	
            	$('#fileName').val(strfileName); //엑셀 파일이름            	

    			var gridData = $('#grid' + selectedGridTab).alopexGrid('dataGet');
    			if(gridData.length == 0){
    				callMsgBox('failChk','I', "데이터가 존재하지 않습니다.", btnMsgCallback);
    				return;
    			}
    			
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
    	    	
            	var param = $('#searchForm').getData();
            	param.screenId = strScreenId;
            	param.userId  =  $("#userId").val();
            	param.skAfcoDivCd =  selectSkAfcoDivCd.getValue();    		
            	param.areaCd =  orgList;
            	//param.areaCdList =  orgList;
            	param.selectAreaCd = orgList; //엑셀 POST오류로 강제세팅
            	param.procsClCd = selectProcsClCd.getValue();
            	param.workNm =  $("#workNm").val();	
            	param.dsnBpChrgOrgId =  selectDsnBpChrgOrgId.getValue(); //작업지역코드
            	param.cstrMgmtOnrCd = selectCstrMgmtOnrCd.getValue(); //관리주체코드
            	param.actTyp = $("#selectActTyp").val(); //업무구분
            	param.actNm =  selectActNm.getValue();
            	param.bizUnqIdList  =  getSelValList($("#selectBizUnqIdList")).toString(); //업무고유아이디 리스트
            	param.bizStaDtmtFrom = $("#bizStaDtmtFrom").val();
            	param.bizStaDtmtTo = $("#bizStaDtmtTo").val();
            	param.actCd  =  selectActCd.getValue();
            	param.appltNo = $("#appltNo").val();
            	param.appltNm =  $("#appltNm").val();
            	param.engstNo =  $("#engstNo").val();
            	param.bpId =  $("#bpId").val();
            	param.bizPlanNm =  $("#bizPlanNm").val();
            	param.appltKndCd = $('#appltKndCd').val();			// 청약종류
            	param.afeYr =  $('#afeYr').val();			// 년도
            	param.uprDemdBizDivCd =  $('#uprDemdBizDivCd').val();			// 상위사업구분
            	param.lowDemdBizDivCd =  $('#lowDemdBizDivCd').val();			// 하위사업구분
            	param.searchTarget  =  $('input[name="searchTarget"]:checked').val();    			

            	$('body').progress();

            	Tango.ajax({
        			url : 'tango-transmission-biz/transmisson/constructprocess/common/callOnDemandExcelList',
        			data : param,
        			method : 'POST'
        		}).done(function(response){successCallbackPopup(response, 'OnDemandExcel');})
        		  .fail(function(response){failCallbackPopup(response, 'OnDemandExcel');});

    	    });

            
            $('#btnAllApprove' + gridTabArray[i]).on('click', function(event) {
            	//일괄승인 개수 설정
            	setAllApprove(20);
            });            
            
	    	$('#grid' + gridTabArray[i]).on('scrollBottom', function(event) {
	    		var ev = AlopexGrid.parseEvent(event)
	    		var pageInfo = ev.$grid.alopexGrid("pageInfo");
	    		if (pageInfo.dataLength != pageInfo.pageDataLength) {	    		
	    			$('#pageNo').val(parseInt($('#pageNo').val()) + 1);
	    			$('#rowPerPage').val($('#rowPerPage').val());
	    	  		setGrid("scroll");
	    		}    		
	    	});
	        $('#grid' + gridTabArray[i]).on('click', '.bodycell', function(event) {
	        	var ev = AlopexGrid.parseEvent(event);
	        	var data = ev.data;
	        	var gridCtx = data._index;
	        	if ($(this).hasClass('cell-type-unitbProcProgStat')) {
	        		var popupUrl = "/tango-transmission-web/webportal/todomgmt/TodoMgmtToBpms.do"
	        		var view = "UNIT_BIZ_PROC_PROG_STAT";
	        		$a.popup({
	        			popid : "업무진행상태",
	        			title : "업무진행상태",
	                    url : popupUrl,
	                    windowpopup : true,
	                    modal : true,
	                	movable : true,
	                	width : 1600,
	                	height : 800,
	                	data : {
	                		appltNo : data.appltNo,
	                		bizUnqId : data.bizUnqId,
	                		procsClCd : data.procsClCd,
	                		userRoleCd : data.userRoleCd,
	                		menuScrnId : data.menuScrnId,
	                		bpmsTaskid : data.bpmsTaskid,
	                		view : view
	                	},
	                	callback : function(data) {
	                		setGrid("init");
	                	}
	            	});    		
	        	}
	        });
	        $('#grid' + gridTabArray[i]).on('dblclick', '.bodycell', function(event) {        	
	        	var ev = AlopexGrid.parseEvent(event);
	        	var data = ev.data;
	        	var gridCtx = data._index;
	        	var winTitle = data.actNm + "[" + data.workNm + "]";
    			var view = "ITAPRV_TO_DO";
        		var itaprvWindowWidth = 1600 + 120;
        		if (data.wndwWidhSz != null) {
        			itaprvWindowWidth = eval(data.wndwWidhSz) + 120;
        		} 	        	
	    		if (data.migFlag == "MIG") {
	    			popupUrl = "/tango-transmission-web/webportal/itaprv/ItaprvMigDtl.do";
		    		$a.popup({
		    			popid : "ToDo",
		    			title : winTitle,
		                url : popupUrl,
		                windowpopup : true,
		                modal : true,
		            	movable : true,
		            	width : itaprvWindowWidth,
		            	height : 800,
		            	top : 1,
		            	left: 1,
		            	data : {
		            		bizUnqId : data.bizUnqId,
		            		procsClCd : data.procsClCd,
		            		skAfcoDivCd : data.skAfcoDivCd,
		            		bizProgStatCd : data.bizProgStatCd,
		            		bpmsTaskid : data.bpmsTaskid,
		            		userRoleCd : data.userRoleCd,
		            		menuScrnId : data.menuScrnId,
		            		view : view
		            	},            	
		            	callback : function(data) {
		            		setGrid("init");
		            	}
		        	});    			
	    		} else {
	        		var popupUrl = "/tango-transmission-web/webportal/todomgmt/TodoMgmtToBpms.do";
		    		$a.popup({
		    			popid : "ToDo",
		    			title : winTitle,
		                url : popupUrl,
		                windowpopup : true,
		                modal : true,
		            	movable : true,
		            	width : itaprvWindowWidth,
		            	height : 800,
		            	top : 1,
		            	left: 1,
		            	data : {
		            		bizUnqId : data.bizUnqId,
		            		procsClCd : data.procsClCd,
		            		userRoleCd : data.userRoleCd,
		            		menuScrnId : data.menuScrnId,
		            		bpmsTaskid : data.bpmsTaskid,
		            		view : view,
		            		viewStatus : selectedGridTab
		            	},            	
		            	callback : function(data) {
		            		setGrid("init");
		            	}            	
		        	});
	    		}
	        });
        } // end for
        
        
		// ***************************
		// OnDemand Excel Function
		// ***************************
		var successCallbackPopup = function(response, flag){	

			if(response.returnCode == '200'){
    			
    			var jobInstanceId = response.resultData.jobInstanceId;
    			var fileName =  $('#fileName').val()+"_"+jobInstanceId ;
    			
    			$('body').progress().remove();
    			
    			
    			setTimeout(function(){ // progress 제거 후, 엑셀 다운로드 팝업 출력
    				
    				// 엑셀다운로드팝업 변경 
   		         $a.popup({
   		                popid: 'CommonExcelDownlodPop' + jobInstanceId,
   		                title: '엑셀다운로드',
   		                iframe: true,
   		                modal : false,
   		                windowpopup : true,
   		                url: '/tango-transmission-web/constructprocess/common/CommonExcelDownloadPop.do',
   		                data: {
   		                	 jobInstanceId : jobInstanceId
   		                	,fileName : fileName
   		                	,fileType : 'excel'
   		                },
   		                width : 500,
   		                height : 300
   		                ,callback: function(resultCode) {
   		                    if (resultCode == "OK") {
   		                        //$('#btnSearch').click();
   		                    }
   		                }
   		            });
    				
    				
    			},500);

    		}else if(response.returnCode == '500'){
    			$('body').progress().remove();
    			callMsgBox('btnSearch','I', '<spring:message code="error.t.completion.failCmplPicDown"/>', btnMsgCallback);
    		}			
		};
		
		
		// excel 실행 실패
		var failCallbackPopup = function(response, flag){
			$('body').progress().remove();
	    };

		//btn Msg Callback
		function btnMsgCallback(msgId, msgRst){
		};
        
	 	// 공사명 조회
        $('#btnSearchCstr').on('click', function(e) {
	 		setConstruction('engstNo', 'cstrNm');
	    });
        
		// 시공업체 조회
        $('#cnstnBpIdBtn').on('click', function(e) {
			setBp('bpId', 'bpNm');
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
        
        //본부구분
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
        
        var setAreaCdCombo = function(mgmtOrgId){
	    	var taskOrgDivCd = "B";
	    	//지역구분 조회		
	    	setSelectByOrgTeam("selectDsnBpChrgOrgId", "all", mgmtOrgId, taskOrgDivCd, null);
		};
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
		setSelectByCode('selectSkAfcoDivCd','select','C00212', setSkAfcoDivCdCodeCallBack);
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
				$("#appltKndCd").append($("<option></option>").val(value.comCd).html(value.comCdNm));
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
	}	
	
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