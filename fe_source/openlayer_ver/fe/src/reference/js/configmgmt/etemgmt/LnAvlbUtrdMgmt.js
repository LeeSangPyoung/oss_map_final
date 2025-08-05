/**
 * LnAvlbUtrdMgmt
 *
 * @author Administrator
 * @date 2016. 8. 22. 오전 17:30:03
 * @version 1.0
 * 
 * 
 * ************* 수정이력 ************
 * 2025-01-08  1. 조회화면에 멀티체크박스 추가 및 다건 추가후 일괄등록기능 추가
 */

var termList = null;
$a.page(function() {
    
	var gridId = '';
	var excelGridId = '';
	
	gridId = 'dataGridOpen'; 
		
	document.getElementById("gubunValue").value = "01";
	
	var selectedObj = null;
	var selectedUtrdMgmtNo = "";
	var currentPage = 1;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	$('#btnDupMtsoMgmt').setEnabled(false);
    	//이벤트 설정
        setEventListener();
        //조회구분 변경
        changeGubun();
    };
    
    //Grid 초기화
    function initGrid() {
    	//console.log(gridId); 
    	    	
    	if(gridId == 'dataGridOpen'){
            //그리드 생성
            $('#'+gridId).alopexGrid({
            	autoColumnIndex: true,
        		autoResize: true,
        		numberingColumnFromZero: false,
        		defaultColumnMapping:{
        			sorting: true
    			},
        		//컬럼정의
        		columnMapping: [
        		                {align:'center',	title : '순번',	width: '40px',numberingColumn: true}, 
        		                {key : 'workStdDt', align:'center',title : '개통일자',width: '80px'}, 
        		                {key : 'svlnNo', align:'center',title : '서비스회선번호',width: '100px'}, 
        			            {title : "FDF선번정보",	align:'center',	width: '80px'  
        			           		, render : function(value, data, render, mapping) {
        			           			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnFdfPop" type="button"></button></div>';
        			           		}
    			                }, 
        		                {key : 'ukeyMtsoCd', align:'center',title : 'SWING 국사코드',width: '100px'},  
        		                {key : 'mtsoNm', align:'center',title : '국사명',width: '100px'}, 
        		                {key : 'utrdStatNm', align:'center',title : '처리상태',width: '80px'}, 
        		                {key : 'eqpDiv', align:'center',title : '장비구분',width: '80px'}, 
        		                {key : 'eqpUeInf', align:'center',title : '개통장비',width: '120px'}, 
        		                {key : 'addr', align:'center',title : '개통주소',width: '150px'}, 
        		                {key : 'chrgVndr', align:'center',title : '담당업체',width: '100px'}, 
        		                {key : 'vndrRepCntac', align:'center',title : '업체대표연락처',width: '100px'},
        		                {key : 'srvcMgmtNo', align:'center',title : '서비스관리번호',width: '100px'}
                ],
                //메세지정의
    			message: {
    				/* 데이터가 없습니다. */
    				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+"조회된 데이터가 없습니다."+"</div>"
    			}
            });
    	} 

    	else if(gridId == 'dataGridTerm'){    		
	        //그리드 생성
	        $('#'+gridId).alopexGrid({
	        	autoColumnIndex: true,
	    		numberingColumnFromZero: false,
	    		cellInlineEdit : true,
	    		rowSingleSelect:false,
	    		rowClickSelect:true,
	    		disableRowSelectByKey:true,
	    		defaultColumnMapping:{
	    			//editable : false, 
	    			sorting: true
				},
				//행처리정의
				rowOption:{
					allowEdit: function(data){
						return (data.utrdStatNm =='처리완료')? false : true 
					}
				},
				//헤더그룹정의
	    		headerGroup: [
	    		              {fromIndex : 'scrbrNetCstrNeedYn', toIndex :  'ojcRlesYn', title : "철거 대상"}
	    		],
	    		columnMapping: [{ selectorColumn : true, width : '50px' },
	    		                {width: '50px',	selectorColumn : true, hidden: true},/* 선택 			 */
	    		                {align:'center',title : '순번',width: '40px',numberingColumn: true}, 
	    		                {key : 'workStdDt', align:'center',title : '해지일자',width: '80px'}, 
	    		                {key : 'qltSoltnTeam', align:'center',title : '품솔팀',width: '100px'}, 
	    		                {key : 'srvcMgmtNo', align:'center',title : '서비스관리번호',width: '120px'},
	    			            {title : "FDF선번정보",	align:'center',	width: '90px'  
	    			           		, render : function(value, data, render, mapping) {
	    			           			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnFdfPop" type="button"></button></div>';
	    			           		}
	    			            },
	    		                {key : 'ukeyMtsoCd', align:'center',title : 'SWING 국사코드',width: '100px'},
        		                {key : 'mtsoNm', align:'center',title : '국사명',width: '100px'}, 
	    		                {key : 'srvcTechmNm', align:'center',title : '서비스기술방식',width: '120px'},  
	    		                {key : 'eqpUeInf', align:'center',title : '해지장비',width: '120px'}, 
	    		                {key : 'eqpRemvYn', align:'center',title : '해지장비철거여부',width: '120px',
	    		                	render : function(value, data) {
	    		                		//return value + "철거";
	    		                		if(value =="Y"){
	    		                			return "철거";
	    		                		}
	    		                		else if(value =="N"){
	    		                			return "미철거";
	    		                		}else if(value =='E'){
	    		                			return "광랜E";
	    		                		}
	    		                	},
									editable:{
					      	    		type:"select", 
					      	    		rule : [
					      	    		        {text:"",value:""},
					      	    		        {text:"미철거",value:"N" },
					      	    		        {text:"철거"  ,value:"Y"},
					      	    		        {text:"광랜E"  ,value:"E"}
			      	    		        ]
					      	    	}
	    		                },
								{key : 'utrdStatNm', align:'center',title : '처리상태',width: '80px'}, 
								{key : 'scrbrNetCstrNeedYn', align:'center',title : '망OJC',width: '100px', 
									render : function(value, data) {
										//return value + "철거";
					  	    			if(value =="Y"){
					  	    				return "철거";
					  	    			}
					  	    			else if(value =="N"){
					  	    				return "철거안함";
					  	    			}
						  	    	},
									editable :{
							  	    	type : "select", 
							  	    	rule : [ 
					      	    		         {text:"",value:""},
							  	    	         {text:"철거안함",value:"N" },
							  	    		     {text:"철거"  ,value:"Y"}
					  	    	        ]
						  	    	},
							  	    allowEdit : function(value, data, mapping){
							  	    	if(data.scrbrNetCstrAcptYn =='N'){
						  	    			return true;
						  	    		}
						  	    		else
						  	    		{
						  	    			return false;
						  	    		}
						  	    	}
								},  
	    		                {key : 'scrbrNetCstrAcptYn', align:'center',title : '공사접수',width: '80px', hidden:false},
								{key : 'scrbrNetRlesYn', align:'center',title : '해제여부',width: '80px'},
								{key : 'eqpRackCstrNeedYn', align:'center',title : '케이블',width: '100px', 
									render : function(value, data) {
										//return value + "철거";
					  	    			if(value =="Y"){
					  	    				return "철거";
					  	    			}
					  	    			else if(value =="N"){
					  	    				return "철거안함";
					  	    			}
						  	    	},
									editable:{
						  	    		type :"select", 
						  	    		rule : [
					      	    		        {text:"",value:""},
						  	    		        {text:"철거안함",value:"N" },
						  	    		        {text:"철거"  ,value:"Y"}
				  	    		        ]
						  	    	},
							  	    allowEdit : function(value, data, mapping){
							  	    	if(data.eqpRackCstrAcptYn =='N'){
						  	    			return true;
						  	    		}
						  	    		else
						  	    		{
						  	    			return false;
						  	    		}
						  	    	}
								},  
	    		                {key : 'eqpRackCstrAcptYn', align:'center',title : '공사접수',width: '80px', hidden:false},
								{key : 'eqpRackRlesYn', align:'center',title : '해제여부',width: '80px'},
								{key : 'ojcCstrNeedYn', align:'center',title : '가입자망OJC',width: '100px',
									render : function(value, data) {
					  	    			if(value =="Y"){
					  	    				return "철거";
					  	    			}
					  	    			else if(value =="N"){
					  	    				return "철거안함";
					  	    			}
					  	    		},
									editable:{
						  	    		type:"select", 
						  	    		rule : [
					      	    		        {text:"",value:""},
						  	    		        {text:"철거안함",value:"N" },
						  	    		        {text:"철거"  ,value:"Y"}
				  	    		        ]
						  	    	}
								}, 
								{key : 'ojcRlesYn', align:'center',title : '해제여부',width: '80px'},
								{key : 'addr', align:'center',title : '해지주소',width: '150px'},
								{key : 'gisCrrtYn', align:'center', title : 'GIS현행화여부', width: '100px',
									render : function(value, data) {
	    		                		//return value + "완료";
	    		                		if(value =="Y"){
	    		                			return "완료";
	    		                		}
	    		                		else if(value =="N"){
	    		                			return "미완료";
	    		                		}
	    		                	},
									editable:{
					      	    		type:"select", 
					      	    		rule : [
					      	    		        {text:"",value:""},
					      	    		        {text:"미완료",value:"N"},
					      	    		        {text:"완료"  ,value:"Y"}
			      	    		        ]
					      	    	}
	    		                },
								{key : 'lineRotgDelYn', align:'center', title : '회선라우팅삭제여부', width: '130px',
									render : function(value, data) {
	    		                		//return value + "완료";
	    		                		if(value =="Y"){
	    		                			return "완료";
	    		                		}
	    		                		else if(value =="N"){
	    		                			return "미완료";
	    		                		}
	    		                	},
									editable:{
					      	    		type:"select", 
					      	    		rule : [
					      	    		        {text:"",value:""},
					      	    		        {text:"미완료",value:"N"},
					      	    		        {text:"완료"  ,value:"Y"}
			      	    		        ]
					      	    	}
	    		                },
								{key : 'lineMapDelYn', align:'center', title : '회선맵삭제여부', width: '110px',
									render : function(value, data) {
	    		                		//return value + "완료";
	    		                		if(value =="Y"){
	    		                			return "완료";
	    		                		}
	    		                		else if(value =="N"){
	    		                			return "미완료";
	    		                		}
	    		                	},
									editable:{
					      	    		type:"select", 
					      	    		rule : [
					      	    		        {text:"",value:""},
					      	    		        {text:"미완료",value:"N"},
					      	    		        {text:"완료"  ,value:"Y"}
			      	    		        ]
					      	    	}
	    		                },
								{key : 'utrdRmk', align:'center',title : '비고',width: '120px', 
									editable:{type:"text"}				
								},
								{key : 'svlnNo', align:'center',title : '서비스회선번호',width: '120px'} 
				],
				message: {
					/* 데이터가 없습니다. */
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+"조회된 데이터가 없습니다."+"</div>"
				}
	        });
	     	
	        $('#'+gridId+'2').alopexGrid({
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		numberingColumnFromZero: false,
	    		defaultColumnMapping:{
	    			sorting: true
				},
	    		
	    		columnMapping: [
	    		                {align:'center',title : '순번',width: '40px',numberingColumn: true}, 
	    		                {key : 'remvObjDivNm', align:'center',title : '철거대상',width: '70px'}, 
	    		                {key : 'cstrCd', align:'center',title : '공사번호',width: '100px'}, 
	    		                {key : 'cstrNm', align:'center',title : '공사명',width: '160px'}, 
	    		                {key : 'cstrProgStatNm', align:'center',title : '공사상태',width: '80px'}, 
	    		                {key : 'eqpRlesYn', align:'center',title : '장비해제여부',width: '80px'}, 
	    		                {key : 'remvObjRlesYn', align:'center',title : '선번작업완료여부',width: '80px'}
                ],
				message: {/* 데이터가 없습니다. */
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+"조회된 데이터가 없습니다."+"</div>"
				}
	        });
    	} 
    	else if(gridId == 'dataGridCstr'){
	    	//console.log('dataGridCstr'); 
	    	 
	        $('#'+gridId).alopexGrid({
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		numberingColumnFromZero: false,
	    		cellInlineEdit : true,
	    		rowSingleSelect:false,
	    		rowClickSelect:true,
	    		disableRowSelectByKey:true,
	    		defaultColumnMapping:{
	    			editable : false
				},
	    		columnMapping: [
	    		                {align:'center',title : '순번',width: '40px',numberingColumn: true}, 
	    		                {key : 'workStdDt', align:'center',title : '공사등록일자',width: '80px'}, 
	    		                {key : 'utrdStatNm', align:'center',title : '처리상태',width: '80px',
	    		                	editable : {
					      	    		type:"select", 
					      	    		rule : [
					      	    		        {text:"",value:""},
					      	    		        {text:"미처리"	   ,value:"미처리" },
					      	    		        {text:"처리완료"  ,value:"처리완료"}
			      	    		        ]
	    		                	},
					      	    	allowEdit: function(value, data, mapping){
						  	    		if(data.utrdStatNm =='미처리' || data._state.edited  ){
						  	    			return true;
						  	    		}
						  	    		else{
						  	    			return false;
						  	    		}
						  	    	}
    		                	},
    		                	{key : 'cstrProgStatNm', align:'center',title : '공사진행상태',width: '100px'}, 
    		                	{key : 'cstrNm', align:'center',title : '공사명',width: '160px'}, 
    		                	{key : 'workRsltRegDt', align:'center',title : '작업결과등록일자',width: '120px'}, 
    		                	{key : 'mtsoNm', align:'center',title : '국사',width: '100px'}, 
    		                	{key : 'connNum', align:'center',title : '연결건수',width: '80px'}, 
    		                	{key : 'rlesNum', align:'center',title : '해제건수',width: '80px'}
            	],
				message: {/* 데이터가 없습니다. */
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+"조회된 데이터가 없습니다."+"</div>"
				}
	        });
	        
	        $('#'+gridId+'2').alopexGrid({
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		numberingColumnFromZero: false,
	    		columnMapping: [
	    		                {align:'center',title : '순번',width: '40px',numberingColumn: true}, 
	    		                {key : 'svlnNoCstr', align:'center',title : '서비스회선번호',width: '120px'}, 
	    		                {key : 'lineNmCstr', align:'center',title : '서비스관리번호',width: '120px'}, 
	    		                {key : 'chgSrnoCstr', align:'center',title : '변경순번',width: '40px'},
	    		                {key : 'svlnChgDtCstr', align:'center',title : '변경일자',width: '80px'},
	    		                {key : 'lastChgUserId', align:'center',title : '최종변경ID',width: '80px'},
	    		                {key : 'lastChgUserNm', align:'center',title : '최종변경자명',width: '80px'}
                ],
				message: {/* 데이터가 없습니다. */
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+"조회된 데이터가 없습니다."+"</div>"
				}
	        });        
    	}         
    };
    
    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {   	    	
    	//console.log("setSelectCode in");
    	//본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/selectHdofcOrgList', null, 'GET', 'selectHdofcOrgList');
    	
    	//품솔팀 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/selectQltSoltnOrgList', null, 'GET', 'selectQltSoltnOrgList');
    	
    	//기술팀 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/selectTechTeamOrgList', null, 'GET', 'selectTechTeamOrgList');
    	
    	//날짜 기본값 셋팅
    	var currentDate = new Date();
    	document.getElementById("startDT").value = getAgoDateDash(0,-1,0) ;
    	document.getElementById("endDT").value =  getAgoDateDash(0,0,0) ;
    	
    	//console.log(currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + (currentDate.getDate() -1 ));
    	
    	//처리상태, 서비스관리번호 값 초기화
    	$('#utrdStatCd').setSelected("00");
    	//document.getElementById("utrdStatCd").value = "00";
    	document.getElementById("srvcMgmtNo").value = "";  
    }
    
    //selectBox 구분값 변경시 호출
    function changeGubun(){    	
    	
    	if(document.getElementById("gubunValue").value == "01"){
    		document.getElementById("term").style.display = 'none';
    		document.getElementById("cstr").style.display = 'none';
    		document.getElementById("open").style.display = '';
    		
    		$('#nwHdofc').attr("disabled",false);
    		$('#techTeam').attr("disabled",false);
    		$('#srvcMgmtNo').attr("disabled",false);
    		$('#qltSoltnTeam').attr("disabled",false);
    		
    		gridId = 'dataGridOpen';
    		
    	}else if(document.getElementById("gubunValue").value == "02"){
    		document.getElementById("open").style.display = 'none';
    		document.getElementById("cstr").style.display = 'none';
    		document.getElementById("term").style.display = '';
    		
    		$('#nwHdofc').attr("disabled",false);
    		$('#techTeam').attr("disabled",false);
    		$('#srvcMgmtNo').attr("disabled",false);
    		$('#qltSoltnTeam').attr("disabled",false);
    		
    		gridId = 'dataGridTerm';
    		
    	}else if(document.getElementById("gubunValue").value == "03"){
    		document.getElementById("open").style.display = 'none';
    		document.getElementById("term").style.display = 'none';
    		document.getElementById("cstr").style.display = '';
    		
    		$('#nwHdofc').attr("disabled",true);
    		$('#techTeam').attr("disabled",true);
    		$('#srvcMgmtNo').attr("disabled",true);
    		$('#qltSoltnTeam').attr("disabled",true);
    		
    		gridId = 'dataGridCstr';
    	}
    	
    	$('#'+gridId).removeAlopexGrid();
    	
    	if(gridId == 'dataGridTerm' || gridId == 'dataGridCstr'){    		
    		$('#'+gridId + '2').removeAlopexGrid();    		
    	}
    	
    	initGrid();
    	
    	setSelectCode();   
    }
    
    
    function setEventListener() {
    	 
    	 var perPage = 10;
    	 
    	 //조회 
   	 	 $('#btnSearch').on('click', function(e) {
        	//tango transmission biz 모듈을 호출하여야한다.
   	 		setGrid(1,perPage);
         });
   	 	 
   	 	 //페이지 selectbox를 변경했을 시.
   	 	 $('#dataGridOpen').on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			setGrid(1, eObj.perPage);
         });
         
   	 	 // 페이지 번호 클릭시
     	 $('#dataGridOpen').on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	setGrid(eObj.page, eObj.pageinfo.perPage);
          });

		 //페이지 selectbox를 변경했을 시.
		 $('#dataGridTerm').on('perPageChange', function(e){
			 var eObj = AlopexGrid.parseEvent(e);
			 perPage = eObj.perPage;
			 setGrid(1, eObj.perPage);
		 });
          
         // 페이지 번호 클릭시
      	 $('#dataGridTerm').on('pageSet', function(e){
           	var eObj = AlopexGrid.parseEvent(e);
           	setGrid(eObj.page, eObj.pageinfo.perPage);
      	 });
      	 
      	 //페이지 selectbox를 변경했을 시.
         $('#dataGridCstr').on('perPageChange', function(e){
        	 var eObj = AlopexGrid.parseEvent(e);
        	 perPage = eObj.perPage;
        	 setGrid(1, eObj.perPage);
         });
         
        // 페이지 번호 클릭시
     	 $('#dataGridCstr').on('pageSet', function(e){
          	var eObj = AlopexGrid.parseEvent(e);
          	setGrid(eObj.page, eObj.pageinfo.perPage);
          });
   	 	
   	 	 //조회구분 변경시   	 	
	   	 $('#gubunValue').change ( function(e){
			//console.log(document.getElementById("gubunValue").value);
			changeGubun();
	      });
   	 	
	   	 // 본부 select box를 변경시
   	 	 $('#nwHdofc').change (function(e){
   	 		 	//console.log(document.getElementById("nwHdofc").value);
   	 		 	
	   	 		$('#pageNo').val(1);
	   	    	$('#rowPerPage').val(10);
   	    	       	 
	   	 		if(!setInputValue()){
	   	    		//입력값 오류
	   	    		return false;
	   	    	}
	   	 		
	   	 		var param =  $("#searchForm").getData();
   	 		 	
		   	 	$('#techTeam').attr("disabled",false);
		   	 	$('#qltSoltnTeam').attr("disabled",false);
   	 		 	
   	 		 	//품솔팀 조회
   	 		 	httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/selectQltSoltnOrgList', param, 'GET', 'selectQltSoltnOrgList');
   	     	
   	 		 	//기술팀 조회
   	 		 	httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/selectTechTeamOrgList', param, 'GET', 'selectTechTeamOrgList');
         });
   	 	 
   	 	 // 품솔팀 select box를 변경시
   	 	 $('#qltSoltnTeam').change (function(e){
   	 		 	//console.log(document.getElementById("qltSoltnTeam").value);
   	 		 	
   	 		 	if(document.getElementById("qltSoltnTeam").value == ""){
   	 		 		$('#techTeam').attr("disabled",false);	
   	 		 		$('#qltSoltnTeam').attr("disabled",false);
   	 		 	}
   	 		 	else{
   	 		 		$('#techTeam').attr("disabled",true);	
   	 		 	}
	   	 });
   	 	 
   	 	 // 기술팀 select box를 변경시
   	 	 $('#techTeam').change (function(e){
   	 		 	//console.log(document.getElementById("techTeam").value);
	   	 		if(document.getElementById("techTeam").value == ""){
	   	 			$('#qltSoltnTeam').attr("disabled",false);
	   	 			$('#techTeam').attr("disabled",false);	
	   	 		}
	   	 		else{
	   	 			$('#qltSoltnTeam').attr("disabled",true);
	   	 		}
         });
   	 	 
   	 	//해지 저장
   	 	//조회된 리스트에서 바로 수정후 저장
   	    //체크박스가 추가되면서 체크박스 선택여부 추가 필요 
   	 	$('#btnTermSave').on('click', function(e){
			fnUpdateLnAvlbTrmnInf();
		});
  
   	 	//일괄데이터 저장
   	 	//이재락M 요청 추가 2024-12
   	 	$('#btnTrmnBatch').on('click', function(e){
			fnUpdateLnAvlbTrmnBatchInf();
		});
   	 	
   	 	//망작업 저장
   	 	$('#btnCstrSave').on('click', function(e){
			fnUpdateLnAvlbCstrInf();
		});
   	 	
   	 	//개통 회선조회 팝업	
   	 	$('#btnOpenConnChg').on('click',function(e){
   	 		var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
   	 		
   	 		if(data.length < 1){
   	    		callMsgBox('Check','I', '선택된 항목이 없습니다.');
   	    		return;
   	    	}
		
   	 		//console.log($.map(data, function(d, idx){return d.svlnNo}));
		
   	 		var paraData = {
   	 				ntwkLineNo : '' + $.map(data, function(d, idx){return d.svlnNo}),
   	 				//gridId : 'dataGrid',
   	 				sFlag : 'Y',
					svlnLclCd : '004',
					svlnSclCd : '201',					
					utrdMgmtNo : data[0].utrdMgmtNo,
					gubunValue : $('#gubunValue').val(),
					utrdStatNm : data[0].utrdStatNm
   	 		}
		
   	 		//console.log($('#ctx').val());
   	 		//임시 서비스회선정보 팝업 - 개발 완료후 원복 필요	
   	 		popupWdmTrunk('lineSelOpen', $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do', '회선조회', paraData);
   	 	});
   	
   	 	//해지 회선조회 팝업	
   	 	$('#btnTermConnChg').on('click',function(e){
			var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
			
			if(data.length < 1){				
				callMsgBox('Check','I', '선택된 항목이 없습니다.');
	    		return;
	    	}
			else{
				
				var dataSub = $('#'+gridId+'2').alopexGrid('dataGet', {_state: {selected:true}});
				
				if(dataSub.length < 1){
					callMsgBox('Check','I', '선택된 해지공사 항목이 없습니다.');
		    		return;
				}
			}
		
			//console.log( $.map(data, function(d, idx){return d.svlnNo}));
			
			var paraData = {
					ntwkLineNo : '' + $.map(data, function(d, idx){return d.svlnNo}),
					//gridId : 'dataGrid',
					sFlag : 'Y',
					svlnLclCd : '004',
					svlnSclCd : '201',					
					utrdMgmtNo : data[0].utrdMgmtNo,
					gubunValue : $('#gubunValue').val(),
					utrdStatNm : data[0].utrdStatNm,
					remvObjDivCd : dataSub[0].remvObjDivCd,
					cstrCd : dataSub[0].cstrCd,
					eqpRlesYn : dataSub[0].eqpRlesYn,
					remvObjRlesYn : dataSub[0].remvObjRlesYn
			}
			
			//임시 서비스회선정보 팝업 - 개발 완료후 원복 필요  
			popupWdmTrunk('lineSelTerm', $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do', '회선조회', paraData);
   	 	});
   	
   	 	//망작업 회선검색 팝업	
	   	$('#btnCstrConnChg').on('click',function(e){  
			var data = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
			
			if(data.length < 1){				
				callMsgBox('Check','I', '선택된 항목이 없습니다.');
	    		return;
	    	}
			
	   		//console.log("망작업 회선검색 버튼");
	   		
	   		var paraData = {
	   				utrdMgmtNo : data[0].utrdMgmtNo,
					svlnLclCd : '004',
					svlnSclCd : '201',	
					gubunValue : $('#gubunValue').val(),
					utrdStatNm : data[0].utrdStatNm, 
					mtsoNm :  data[0].mtsoNm
			}
	   		
	   		//임시 서비스회선조회 팝업 - 개발 완료후 원복 필요
	   		popup('lineFnd', $('#ctx').val()+'/configmgmt/cfline/ServiceLineListPop.do', '회선검색', paraData);
		});
   	
	   	//개통 클릭시 미처리인 경우 관할전송실 등록버튼 활성화
	   	$('#dataGridOpen').on('click', '.bodycell', function(e){
	   		//console.log("dataGridOpen 더블클릭 이벤트");
			var dataObj = null;
		 	dataObj = AlopexGrid.parseEvent(e).data;
		 	
			//console.log(dataObj.utrdMgmtNo );	
		 	
		 	//popup('EqpDtlLkup', $('#ctx').val()+'/configmgmt/equipment/EqpDtlLkup.do', '장비상세정보',dataObj);
			if(!dataObj._state.selected && dataObj.utrdStatCd == "01"){
				$('#btnDupMtsoMgmt').setEnabled(true);
			}
		 	else{
		 		$('#btnDupMtsoMgmt').setEnabled(false);
		 	}	
		 });
   	
	   	//망작업 클릭시 상세조회
	   	$('#dataGridCstr').on('click', '.bodycell', function(e){
	   		//console.log("dataGridCstr 더블클릭 이벤트");
			var dataObj = null;
		 	dataObj = AlopexGrid.parseEvent(e).data;
		 	
			//console.log(dataObj.utrdMgmtNo );	
		 	
		 	//popup('EqpDtlLkup', $('#ctx').val()+'/configmgmt/equipment/EqpDtlLkup.do', '장비상세정보',dataObj);
			if(!dataObj._state.selected){
				selectedUtrdMgmtNo = dataObj.utrdMgmtNo;
				httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/getLnAvlbUtrdCstrDtlList', dataObj, 'GET', 'getLnAvlbUtrdCstrDtlList');
			}
		 	else{
		 		$('#dataGridCstr2').alopexGrid('dataEmpty');
		 	}	
		 });
   	
   	
	   	//해지 클릭시 상세조회
	   	$('#dataGridTerm').on('click', '.bodycell', function(e){
	   		//console.log("dataGridTerm 더블클릭 이벤트");
			var dataObj = null;
		 	dataObj = AlopexGrid.parseEvent(e).data;
		 	selectedObj = dataObj;
		 	
		 	//console.log(dataObj.utrdMgmtNo );		
		 	
		 	//popup('EqpDtlLkup', $('#ctx').val()+'/configmgmt/equipment/EqpDtlLkup.do', '장비상세정보',dataObj);
		 	if(!dataObj._state.selected){
		 		selectedUtrdMgmtNo = dataObj.utrdMgmtNo;
		 		httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/getLnAvlbUtrdTermDtlList', dataObj, 'GET', 'getLnAvlbUtrdTermDtlList');
		 	}
		 	else{
		 		$('#dataGridTerm2').alopexGrid('dataEmpty');
		 	}
		 });
	   	
	   	// 전송실 등록
		$('#btnDupMtsoMgmt').on('click', function(e) {
			var element =  $('#dataGridOpen').alopexGrid('dataGet', {_state: {selected:true}});
			var selectCnt = element.length;
			
			if(selectCnt <= 0){
    			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
			}else{
				var paramMtso = null;
				var paramList = [element.length];
				var mgmtGrpStr = "";
				var mgmtGrpChk = "N";
				//if(selectCnt==1){
					paramMtso = {"multiYn":"N", "mgmtGrpCd":"0002", "mgmtGrpCdNm":"SKB", "svlnNo":element[0].svlnNo};
//				}else{
//					for(i=0;i<element.length;i++){
//						paramList[i] = element[i].svlnNo;
//						//paramList[i] = {"svlnNoArr":element[i].svlnNo};
//						//paramList.push({"svlnNoArr":element[i].svlnNo};
//						if(i==0){
//							mgmtGrpStr = element[0].mgmtGrpCd;
//						}
//						if(i>0 && mgmtGrpStr != element[i].mgmtGrpCd){
//							mgmtGrpChk = "Y";
//						}
//						
//					}
//					if(mgmtGrpChk == "Y"){
//						//alert("여러 회선에 대한 전송실 등록시는 동일 관리그룹만 가능합니다.");						
//						alertBox('W', cflineMsgArray['multiMtsoRegSameMngrGrpPoss']);/*여러 회선에 대한 전송실 등록시 동일 관리그룹만 가능합니다.*/
//						return;
//					}
//					paramMtso = {"multiYn":"Y", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "svlnNoArr":paramList};
//				}

				//console.log("btnDupMtsoMgmt S" );
	    		//console.log(paramMtso);
	    		//console.log("btnDupMtsoMgmt E" );
				fn_svlnMtsoUpdatePopup( "svlnMtsoUpdatePop", "/configmgmt/cfline/ServiceLineMtsoUpdatePop.do", paramMtso, 1200, -1, cflineMsgArray['serviceLine']/*서비스회선*/ +" "+ cflineMsgArray['mtsoEstablish']/*서비스회선전송실설정*/);
					    		
			}
		});
   	
		$('#dataGridOpen').on('click', '#btnFdfPop', function(e){  
			var rowData = AlopexGrid.parseEvent(e).data; 
			fdfPop(rowData);
		})
		$('#dataGridTerm').on('click', '#btnFdfPop', function(e){  
			var rowData = AlopexGrid.parseEvent(e).data; 
			fdfPop(rowData);
		})
		
		
	   	//엑셀버튼 
	   	$('#btnOpenExportExcel').on('click', function(e) {
			btnExcel("btnOpenExportExcel", "dataGridOpen")
	    });
	   	
	   	$('#btnTermExportExcel').on('click', function(e) {
			btnExcel("btnTermExportExcel", "dataGridTerm")
	    });
	   	
	   	$('#btnTermDtlExportExcel').on('click', function(e) {
			btnExcel("btnTermDtlExportExcel", "dataGridTerm2")
	    });
	   	
	   	$('#btnCstrExportExcel').on('click', function(e) {
			btnExcel("btnCstrExportExcel", "dataGridCstr")
	    });
	   	
	   	$('#btnCstrDtlExportExcel').on('click', function(e) {
			btnExcel("btnCstrDtlExportExcel", "dataGridCstr2")
	    });
	};

	/**
	 * 수정
	 * 수정후 체크박스 체크안하면 알림추가
	 * TODO
	 */
	function fnUpdateLnAvlbTrmnInf(){
		
		var dataList =  $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		
		if(dataList.length < 1){
    		callMsgBox('Check','I', '선택된 항목이 없습니다.');
    		return;
    	}
		
		var updateList = $('#'+gridId).alopexGrid("dataGet", {_state:{edited:true}});
		
		if(updateList.length < 1){
    		callMsgBox('Check','I', '수정된 항목이 없습니다.');
    		return;
    	}
		
		for(var i = 0; i < updateList.length; i++){			
			updateList[i].userId = $('#userId').val();
		}
		
		if(updateList != null && updateList.length > 0) {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/updateLnAvlbTrmnInf', updateList, 'POST', 'updateLnAvlbTrmnInf');
		}
    }
	
	/**
	 * TODO
	 * 일괄등록을 위한 팝업호출
	 */
	function fnUpdateLnAvlbTrmnBatchInf(){

		var dataList =  $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		
		if(dataList.length < 1){
    		callMsgBox('Check','I', '선택된 항목이 없습니다.');
    		return;
    	}
		
		if(dataList != null && dataList.length > 0) {
			var param = {
					dataList : dataList
				   , userId : $('#userId').val()
			}
			
			$a.popup({
	 			popid: "batchSavePop",
	 			title: "일괄등록정보",
	 			url: $('#ctx').val()+'/configmgmt/etemgmt/LnAvlbUtrdTrmnBatchSavePop.do',
				data: param,
	 			iframe: true,
	        	modal : false,
	        	windowpopup : true,
	 			movable:true,
	 			width : 900,
	 			height : 650,
	 			callback:function(data){
	 				if(data != null){
	 					if(data == "200") {
	 		    			callMsgBox('','I', "처리 되었습니다.");
	 		    			setSPGrid(gridId, termList, termList.LnAvlbUtrdTermList); 
	 		    			// 처리후 다시변환이 되게끔처리  	 		    			
	 		        		setGrid($('#pageNo').val(),$('#rowPerPage').val());
	 					} else {
	 						callMsgBox('','I', "저장에 실패하였습니다.");
	 					}
	 				}
	 			}  
			});
		}
	}
	
	/**
	 * 팝업 일괄 수정후 재 조회
	 */
	function fnBatchSelectLnAvlbTrmnInf(){
		alert("fnBatchSelectLnAvlbTrmnInf");
		
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: 'tango-transmission-biz/transmisson/configmgmt/etemgmt/selectLnAvlbCstrInfList',
			data: updateList,
			iframe: true,
			windowpopup: true,
			modal: true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				
			}
		});
    }
	
	/**
	 * 수정후 재 조회
	 */
	function fnSelectLnAvlbTrmnInf(){
		//$('#'+gridId).alopexGrid('endEdit', {_state:{editing:true}});
		
		//var updateList = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
		var updateList = $('#'+gridId).alopexGrid("dataGet", {_state:{edited:true}});
		
		if(updateList.length < 1){
    		callMsgBox('Check','I', '수정된 항목이 없습니다.');
    		return;
    	}
		
		for(var i = 0; i < updateList.length; i++){			
			updateList[i].userId = $('#userId').val();
		}
		
		if(updateList != null && updateList.length > 0) {
			//alert("O 이 아님");
			//httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/updateLnAvlbTrmnInf', updateList, 'POST', 'updateLnAvlbTrmnInf');
			$a.popup({
			  	popid: "",
			  	title: "",
				url: 'tango-transmission-biz/transmisson/configmgmt/etemgmt/selectLnAvlbCstrInfList',
				data: updateList,
				iframe: true,
				windowpopup: true,
				modal: true,
				width : widthVal,
				height : heightValue,
				callback:function(data){
					
				}
			});
		}
    }
	
	function fnUpdateLnAvlbCstrInf(){
		$('#'+gridId).alopexGrid('endEdit', {_state:{editing:true}});
		var updateList = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
				
		for(var i = 0; i < updateList.length; i++){			
			updateList[i].userId = $('#userId').val();
		}
		
		if(updateList != null && updateList.length > 0) {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/updateLnAvlbCstrInf', updateList, 'POST', 'updateLnAvlbCstrInf');
		}else {
//			alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/    		
   		 	setGrid($('#pageNo').val(),$('#rowPerPage').val());
		}
    }
	
	function setInputValue(){
		//input값 셋팅
    	document.getElementById("gubunValueI").value = document.getElementById("gubunValue").value;
    	document.getElementById("gubunValueI").value = document.getElementById("gubunValue").value;
    	
    	var start_dt = document.getElementById("startDT").value;
    	var end_dt = document.getElementById("endDT").value;
    	
    	//console.log(start_dt);
    	//console.log(end_dt);
    	
    	if( parseInt(start_dt.replace(/-/gi,"")) >   parseInt(end_dt.replace(/-/gi,"")))
    	{
    		//alert("시작일은 종료일 이전 입니다.");
    		callMsgBox('Error','I', "시작일은 종료일 이전 입니다.");
    		return false;
    	}
    	
    	
    	document.getElementById("startDTI").value = start_dt.replace(/-/gi,"");
    	document.getElementById("endDTI").value = end_dt.replace(/-/gi,"");
    	
    	//console.log(document.getElementById("nwHdofc").value);
    	
    	document.getElementById("utrdStatCdI").value = document.getElementById("utrdStatCd").value;
    	document.getElementById("srvcMgmtNoI").value = document.getElementById("srvcMgmtNo").value;    	
    	document.getElementById("nwHdofcI").value = document.getElementById("nwHdofc").value;
    	document.getElementById("qltSoltnTeamI").value = document.getElementById("qltSoltnTeam").value;
    	document.getElementById("techTeamI").value = document.getElementById("techTeam").value;
    	
    	return true;
	}
	
	function successCallback(response, status, jqxhr, flag){
		//console.log(response);
		if(flag == 'selectHdofcOrgList'){			
			//console.log("callback : flag == selectHdofcOrgList");
			
			$('#nwHdofc').clear();			
			
			var option_data =  [{jrdtHdofcOrgId: "", jrdtHdofcOrgNm: "전체"}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#nwHdofc').setData({
	             data:option_data
			});
		}
		
		if(flag == 'selectQltSoltnOrgList'){
			$('#qltSoltnTeam').clear();			
			
			var option_data =  [{jrdtQltSoltnTeamOrgId: "", jrdtQltSoltnTeamOrgNm: "전체"}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#qltSoltnTeam').setData({
	             data:option_data
			});
		}
		
		if(flag == 'selectTechTeamOrgList'){
			$('#techTeam').clear();			
			
			var option_data =  [{jrdtTechTeamOrgId: "", jrdtTechTeamOrgNm: "전체"}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			
			$('#techTeam').setData({
	             data:option_data
			});
		}
		
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');    		
    		
    		if(gridId == 'dataGridOpen'){
    			setSPGrid(gridId, response, response.LnAvlbUtrdOpenList); 
    		}else if(gridId == 'dataGridTerm'){
    			console.log(response);
    			setSPGrid(gridId, response, response.LnAvlbUtrdTermList); 
    			termList = response;
    		}else if(gridId == 'dataGridCstr'){
    			setSPGrid(gridId, response, response.LnAvlbUtrdCstrList); 
    		}
    	}
    	
    	if(flag == 'getLnAvlbUtrdCstrDtlList'){    		
    		$('#dataGridCstr2').alopexGrid('hideProgress');
    		
    		setSPGrid('dataGridCstr2', response, response.LnAvlbUtrdCstrList2); 
    	}
    	
    	if(flag == 'getLnAvlbUtrdTermDtlList'){
    		$('#dataGridTerm2').alopexGrid('hideProgress');
    		
    		setSPGrid('dataGridTerm2', response, response.LnAvlbUtrdTermDtlList);
    	}
    	
    	if(flag == 'updateLnAvlbTrmnInf' || flag == 'updateLnAvlbCstrInf'){
    		//console.log("업데이트 완료");	
    		//console.log(response.returnCode);	
    		//console.log(response);
//    		if(response.returnCode == '200'){
//    			callMsgBox('','I', "처리 되었습니다.");
//    			fnSelectLnAvlbTrmnInf();
//    		}
//    		else if(response.returnCode == '202'){
//    			//다른 회선과 연계되어 있을 경우 자동 완료 처리 되며 회선 목록을 표시해준다.
//    			fnSelectLnAvlbTrmnInf();
//    		}
//    		else if(response.returnCode == '500'){
//    			callMsgBox('','I', "실패 되었습니다.");
//    		}
    		

 			setSPGrid(gridId, termList, termList.LnAvlbUtrdTermList); 
    		// 처리후 다시변환이 되게끔처리  
    		setGrid($('#pageNo').val(),$('#rowPerPage').val());
    	}
    	
    	if(flag == 'excelDownload'){ 
    		$('#'+excelGridId).alopexGrid('hideProgress');
    		
            //console.log('excelCreate');
            //console.log(response);
            
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
    	if(flag == 'excelBatchExecute') {
    		
			//cflineHideProgress(gridId);
    		//cflineHideProgress(gridIdWork);
	   		
    		if(response.returnCode == '200'){ 
    				
    			jobInstanceId  = response.resultData.jobInstanceId;
    			//$('#excelFileId').val(response.resultData.jobInstanceId );
    			//cflineHideProgressBody();
    	    	//cflineHideProgress(gridId);
    	    	//cflineHideProgress(gridIdWork);
    			excelCreatePop(jobInstanceId);
    			//funExcelBatchExecuteStatus();
    		}
    		else if(response.returnCode == '500'){ 
    			//cflineHideProgressBody();
    	    	//cflineHideProgress(gridId);
    	    	//cflineHideProgress(gridIdWork);
    	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
    	
    	if(flag == 'excelBatchExecuteStatus') {
    		
   		 	if(response.returnCode == '200'){ 	
    			var jobStatus  = response.resultData.jobStatus ;
    			/*jobStatus ( ok | running | error )*/
    			if (jobStatus =="ok"){
    				//엑셀파일다운로드 활성화
    				//alert("ok");
    				
    				funExcelDownload();
    				
    			}else if (jobStatus =="running"){
    				//10초뒤 다시 조회
    				setTimeout(function(){ funExcelBatchExecuteStatus(); } , 1000*5 );
    				 
    			}else if (jobStatus =="error"){
    				//cflineHideProgressBody();
    		    	//cflineHideProgress(gridId);
    		    	//cflineHideProgress(gridIdWork);
    				//setTimeout(funExcelBatchExecuteStatus() ,50000);
    				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    			}
    		}
    		else if(response.returnCode == '500'){ 
    			//cflineHideProgressBody();
    	    	//cflineHideProgress(gridId);
    	    	//cflineHideProgress(gridIdWork);
    			/*alert('실패 되었습니다.  ');*/
    			alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}

    }
	
	 function getAgoDate(yyyy, mm, dd)
	  {
	   var today = new Date();
	   var year = today.getFullYear();
	   var month = today.getMonth();
	   var day = today.getDate();
	   
	   var resultDate = new Date(yyyy+year, month+mm, day+dd);
	   
	   
	         year = resultDate.getFullYear();
	         month = resultDate.getMonth() + 1;
	         day = resultDate.getDate();

	        if (month < 10)
	             month = "0" + month;
	         if (day < 10)
	             day = "0" + day;

	        return year + "" + month + "" + day;
	  }
	 
	 function getAgoDateDash(yyyy, mm, dd)
	  {
	   var today = new Date();
	   var year = today.getFullYear();
	   var month = today.getMonth();
	   var day = today.getDate();
	   
	   var resultDate = new Date(yyyy+year, month+mm, day+dd);
	   
	   
	         year = resultDate.getFullYear();
	         month = resultDate.getMonth() + 1;
	         day = resultDate.getDate();

	        if (month < 10)
	             month = "0" + month;
	         if (day < 10)
	             day = "0" + day;

	        return year + "-" + month + "-" + day;
	  }


    
    function setSPGrid(GridID,Option,Data) {
    	
    	$('#btnDupMtsoMgmt').setEnabled(false);

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	       	$('#'+GridID+'2').alopexGrid('dataEmpty');
	       	
	       	
	}
    
    function setSPGrid_np(GridID,Option,Data) {
    	
    	

		var serverPageinfo = {
	      		//dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	       	
	       	
	}
    
    //request 실패시
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		callMsgBox('','I', response.message);
    		//alert('실패');
    	}
    	
    	$('#'+gridId).alopexGrid('hideProgress');
    }
    
    function setGrid(page, rowPerPage) {
    	
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	
    	
    	if(!setInputValue()){
    		//입력값 오류
    		return false;
    	}
    	
    	 var param =  $("#searchForm").getData();

    	 $('#'+gridId).alopexGrid('showProgress');
    	 
    	 if(gridId == 'dataGridOpen'){ //개통
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/getLnAvlbUtrdOpenList', param, 'GET', 'search');
    	 }else if(gridId == 'dataGridTerm'){ //해지
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/getLnAvlbUtrdTermList', param, 'GET', 'search');
    	 }else if(gridId == 'dataGridCstr'){ //망작업
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/getLnAvlbUtrdCstrList', param, 'GET', 'search');
    	 }
    }
    
    function btnExcel(btnId, gridId){

		 var param =  $("#searchForm").getData();
	 
		 excelGridId = gridId;
		 
		 param = gridExcelColumn(param, gridId);
		 param.pageNo = 1;
		 param.rowPerPage = 10;   
		 param.firstRowIndex = 1;
		 param.lastRowIndex = 1000000000;   
		 param.fileExtension = "xlsx";
		 param.excelPageDown = "N";
		 param.excelUpload = "N";
		 
		 if(btnId == "btnOpenExportExcel" || btnId == "btnTermExportExcel" || btnId == "btnCstrExportExcel"){
			 //ondemand excel download
			 funExcelBatchExecute();
		 }else if(btnId == "btnTermDtlExportExcel"){ 
			 param.method = "getLnAvlbUtrdTermDtlList";
			 param.fileName = "해지상세리스트";   
			 param.utrdMgmtNo = utrdMgmtNoI;
			
			 $('#'+gridId).alopexGrid('showProgress');
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/excelcreate', param, 'GET', 'excelDownload');
		 }
		 else if(btnId == "btnCstrDtlExportExcel"){
			 param.method = "getLnAvlbUtrdCstrDtlList";
			 param.fileName = "망작업상세리스트";    
			 param.utrdMgmtNo = utrdMgmtNoI;
			 
			 $('#'+gridId).alopexGrid('showProgress');
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/excelcreate', param, 'GET', 'excelDownload');
		 }
    }
    
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
    
  //배치실행
    function funExcelBatchExecute(){
    	var dataParam =  $("#searchForm").getData();
    	
    	dataParam = gridExcelColumn(dataParam, "dataGridOpen");
    	
    	var start_dt = document.getElementById("startDT").value;
    	var end_dt = document.getElementById("endDT").value;
    	
    	//console.log(start_dt);
    	//console.log(end_dt);
    	
    	if( parseInt(start_dt.replace(/-/gi,"")) >   parseInt(end_dt.replace(/-/gi,"")))
    	{
    		callMsgBox('Error','I', "시작일은 종료일 이전 입니다.");
    		return false;
    	}
    	
    	dataParam.startDt = start_dt.replace(/-/gi,"");
    	dataParam.endDt = end_dt.replace(/-/gi,"");
    	
    	dataParam.utrdDivCd = document.getElementById("gubunValue").value;
    	dataParam.utrdStatCd = document.getElementById("utrdStatCd").value;
    	dataParam.srvcMgmtNo = document.getElementById("srvcMgmtNo").value;  
    	dataParam.svlnNo = document.getElementById("svlnNo").value;   	
    	dataParam.nwHdofc = document.getElementById("nwHdofc").value;
    	dataParam.qltSoltnTeam = document.getElementById("qltSoltnTeam").value;
    	dataParam.techTeam = document.getElementById("techTeam").value;
    	
    	dataParam.fileExtension = "xlsx";
    	dataParam.excelPageDown = "N";
    	dataParam.excelUpload = "N";
    	
    	if (dataParam.utrdDivCd =="01"){
    		dataParam.method = "LnAvlbUtrdOpenExcel";
    	}
    	else if (dataParam.utrdDivCd =="02"){
    		dataParam.method = "LnAvlbUtrdTrmnExcel";
    	}
    	else if (dataParam.utrdDivCd =="03"){
    		dataParam.method = "LnAvlbUtrdCstrExcel";
    	}
    	//cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
    
    //배치상태확인
    function funExcelBatchExecuteStatus(){
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchExecuteStatus/'+jobInstanceId,null , 'GET', 'excelBatchExecuteStatus');
    }
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: '../cfline/ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
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
    
    //엑셀다운로드
    function funExcelDownload(){
    	
 		// Excel File Download URL
    	cflineHideProgressBody();
 
    	
    	var excelFileUrl = '/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchDownload';
    	 
    	var $form=$( "<form></form>" );
		$form.attr( "name", "downloadForm" );
		$form.attr( "action", excelFileUrl + "?jobInstanceId=" + jobInstanceId );
		$form.attr( "method", "GET" );
		$form.attr( "target", "downloadIframe" );
		$form.append(Tango.getFormRemote());
		// jobInstanceId를 조회 조건으로 사용
		$form.append( "<input type='hidden' name='jobInstanceId' value='" + jobInstanceId + "' />" );
		$form.appendTo('body')
		$form.submit().remove();
    }
    
    function popupRtf(pidData, urlData, titleData, paramData) {
    	$a.popup({
          	popid: pidData,
          	title: titleData,
              url: urlData,
              data: paramData,
              iframe: false,
              windowpopup:true,
              modal: true,
              movable:true,
              width : 865,
              height : window.innerHeight * 0.9
          });
        }
    
		function popupWdmTrunk(pidData, urlData, titleData, paramData) {
			$a.popup({
				popid: pidData,
				title: titleData,
				url: urlData,
				data: paramData,
				iframe: false,
				windowpopup: true,
				modal: true,
				movable:true,
				width : 1400,
				height : window.innerHeight * 0.91,
				callback: function(data) {
					if(pidData == 'lineSelOpen' || pidData == 'lineSelTerm'){
						/* 저장을 완료 하였습니다.*/    		
						setGrid($('#pageNo').val(),$('#rowPerPage').val());
					}
//					else if(pidData == 'lineSelTerm'){
//						httpRequest('tango-transmission-biz/transmisson/configmgmt/etemgmt/getLnAvlbUtrdTermDtlList', selectedObj, 'GET', 'getLnAvlbUtrdTermDtlList');
//					}
				}
			});
		}
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup:true,
                  //iframe: false,
                  modal: true,
                  movable:false,
                  width : 1400,
                  height : window.innerHeight * 0.9
              });
        } 
	
	function fn_svlnMtsoUpdatePopup( popId, url, paramData, widthVal, heightVal, titleStr){
		var heightValue = window.innerHeight * 0.9;
		
		if(heightVal != null && heightVal>0){
			heightValue = heightVal;
		}
		
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: $('#ctx').val() + url,
			data: paramData,
		    //iframe: false,
			iframe: true,
			windowpopup: true,
			modal: true,
			//movable:true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				if(popId == "svlnMtsoUpdatePop"){
					if(data != null){
			    		if(data == "Success"){
			    			//alert("성공하였습니다.");
			    			alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
			    			//var lastRow02 = $("#lastRow02").val();
			    			//$("#firstRow02").val(1);
			    	     	//$("#lastRow02").val(lastRow02);
			    			//searchWorkProc(1, lastRow02, 'searchWork');
 			    			
			    		}else{
			    			//alert("실패하였습니다.");
			    			alertBox('W', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			    		}
					}
				}
			}
		});
	}
	
    //
    function fdfPop (rowData){
    	
    	console.log(rowData);
    	
		 $a.popup({
 			popid: "fdfPop",
 			title: "FDF선번정보",
 			url: $('#ctx').val()+'/configmgmt/etemgmt/FdfDetailPop.do',
			data: rowData,
 			iframe: true,
        	modal : false,
        	windowpopup : true,
 			movable:true,
 			width : 1200,
 			height : 650,
 			callback:function(data){
 				if(data != null){
 				}
				//다른 팝업에 영향을 주지않기 위해
				$.alopex.popup.result = null;
 			}  
		});
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
});