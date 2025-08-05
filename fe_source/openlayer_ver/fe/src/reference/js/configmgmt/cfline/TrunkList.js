/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 * ************* 수정이력 ************
 * 2018-05-30  1. [수정] WDM트렁크 기간망 형식으로 변경
 * 2020-04-16  2. ADAMS관련 관할주체키가 TANGO이면 편집가능, ADAMS이면 편집불가
 */ 
$a.page(function() {
    
	var gridId = 'dataGrid';
	var gridIdWork = 'dataGridWork';
	var searchYn   = false ;  
	
	var C02441Data = []; // 트렁크 역할 구분 코드 
	var C02441DataComboList = []; 
	var C00262Data = []; // 트렁크 회선상태 코드
	var C00188Data = [];  // 관리구분데이타   comCd:comCdNm
	var C00194Data = []; // 용량코드
	var sTdmUseYn  = [{value: "",text: "선택"},{value: "Y",text: "예"},{value: "N",text: "아니오"}];  
	var TmofData   = [];  // 전송실데이타     mtsoId:mtsoNm
	var MtsoData   = [];  // 국소데이타     value:text
	var C00001350  = []; // 본부 리스트   
	var msgVal = "";		// 메시지 내용
	
	var paramUsing = null;
	var maxnumber =0; 
	var mapping     = []; // 컬럼해더부분
	var jobInstanceId = "";
	var rowSeletedIndex = 0 ; 
	var rowSeletedColNm = "" ;
	var rowSeletedGrid  = "" ;
	var emClass     = '' ;
	var gridIdscrollBottom = true;
	var gridIdWorkscrollBottom = true;
	var totalCount = 0;
	var totalCountWork = 0;
	
	var pageForCount = 200;
	

	// 3. [수정] WDM트렁크 기간망 형식으로 변경 = > 해지시 자동 수정 대상 테이블에서 삭제 처리
	var procAcceptTargetList = null;
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	createMgmtGrpSelectBox ("ownCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
    	
    	$('#btnExportExcel').setEnabled(false);
    	$('#btnDupMtsoMgmt').setEnabled(false);
    	$('#btnWorkCnvt').setEnabled(false);
    	
    	$('#btnLineTrmn').setEnabled(false);
		$('#btnTrunkWorkUpdate').setEnabled(false);
		$('#btnAllWorkInfFnsh').setEnabled(false);
		$('#btnWorkInfFnsh').setEnabled(false);
		$('#sWorkGrpWhereUse').setChecked(true);
		
		$('#lPortNm').setEnabled(false);// 좌포트 
		$('#rPortNm').setEnabled(false);// 우포트
		
		// 	ADAMS 연동 고도화
		if( $('#userMgmtCd').val() == 'SKT' || ($('#ownCd').val()=='0001' && $('#ownCd').val() !='')){
			$('#btnTrunkWritePop').setEnabled(true);
 			$('#btnAddExcel').setEnabled(true);
 		}else{
 			$('#btnTrunkWritePop').setEnabled(false);
 			$('#btnAddExcel').setEnabled(false);
 		}
		
		mapping = null;
    	initGrid("A");
    	
    	setSelectCode();
        setEventListener();
        
        procAcceptTargetList= null;
    };
    
    //Grid 초기화
    function initGrid(sType) {
    	createGrid(mapping, sType);
    };
    function columnMapping() {
    	var column = [  { selectorColumn : true, width : '50px' } 
		, {key : 'check',align:'center',			width:'70px',			title :cflineMsgArray['sequence'] /*'번호'*/,			numberingColumn : true		}
		, {key : 'ntwkLineNo'	      ,title : cflineMsgArray['trunkId']/* '트렁크ID'*/         	  ,align:'center', width: '150px'}
  	    , {key : 'mgmtOnrNm',	title : '관리주체'  /*관리주체*/,	hidden : true}
		, {key : 'ntwkStatCdNm'	      ,title : cflineMsgArray['lineStatus']/* '회선상태'*/         	  ,align:'center', width: '100px'}
        , {key : 'ntwkLineNm'	      ,title : emClass + cflineMsgArray['trunkNm']/*'트렁크명'*/             ,align:'left', width: '400px'
        	, allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001') ? true : false); }  // ADAMS 연동 고도화
        	,editable:{type:"text"}	}
        /* TODO */
        , {title : "E2E보기",	align:'center',	width: '65px'  
	   		, render : function(value, data, render, mapping) {
	   			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnE2ePop" type="button"></button></div>';
	   		}}
	    , {title : "시각화 편집",	align:'center',	width: '80px'
	   		, render : function(value, data, render, mapping) {
	   			return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnServiceLIneInfoPop" type="button"></button></div>';
	   		}}
//        , {key : 'ntwkIdleRate'	      ,title : cflineMsgArray['trunk'] + cflineMsgArray['idleRate']/*'유휴율'*/,align:'left', width: '100px'
//        	, value : function(value, data){
//        		if(nullToEmpty(data['ntwkIdleRate']) !== ""){
//        			return data['ntwkIdleRate'] + "%";
//        		}
//        		else {
//        			return null;
//        		}
//        	}
//        }
	    , {key : 'trkRoleDivCd'	      ,title :  "트렁크구분" /*트렁크구분*/, align:'center', width: '100px'
	    	,render : { type : 'string',
		    	rule : function(value, data) {
				var render_data = [];
					if (C02441Data.length > 1) {
						return render_data = render_data.concat(C02441Data);
					} else {
						return render_data.concat({value : data.trkRoleDivCd,text : data.trkRoleDivCdNm });
					}
			    }
	        }
	        , allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001') ? true : false); }  // ADAMS 연동 고도화
		    , editable : { type : 'select',rule : function(value, data) {return C02441Data; }
			          , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			}
		    ,editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}	
	    }
        , {key : 'mgmtGrpCdNm'	      ,title :  emClass + cflineMsgArray['managementGroup'] /*'관리그룹'*/, align:'center', width: '80px'}
        , {key : 'mgmtGrpCd'	          ,title :cflineMsgArray['managementGroup'] /*'관리그룹'*/, align:'center', hidden : true}
        , {key : 'ntwkCapaCd', align:'center', width:'100px', title :emClass + cflineMsgArray['capacity'] /*'용량'*/
          ,render : { type : 'string',
				    	rule : function(value, data) {
						var render_data = [];
							if (C00194Data.length > 1) {
								return render_data = render_data.concat(C00194Data);
							} else {
								return render_data.concat({value : data.ntwkCapaCd,text : data.ntwkCapaCdNm });
							}
					    }
			        }
          , allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001') ? true : false); }  // ADAMS 연동 고도화
          , editable : { type : 'select',rule : function(value, data) {return C00194Data; }
			          , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			}
         ,editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
         } 
       , {key : 'lineOpenDt'	      ,title :cflineMsgArray['openingDate'] /*'개통일'*/               ,align:'center', width: '90px'}
       , {key : 'lastChgDate'	      ,title :cflineMsgArray['modificationDate'] /*'수정일'*/               ,align:'center', width: '90px'}
       , {key : 'uprMtsoIdNm'	      ,title : emClass + cflineMsgArray['upperMtsoName']/* '상위국사'*/             ,align:'center', width: '200px'}
       , {key : 'lowMtsoIdNm'	      ,title : emClass + cflineMsgArray['lowerMtsoName']/* '하위국사' */            ,align:'center', width: '200px'}
       , {key : 'ntwkRmkOne'	          ,title :cflineMsgArray['remark1']/* '비고1'*/                ,align:'left', width: '200px' 
    	   , allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001')? true : false); }  // ADAMS 연동 고도화
    	   , editable:{type:"text"}	}
       , {key : 'ntwkRmkTwo'	          ,title :cflineMsgArray['remark2']/* '비고2' */               ,align:'left', width: '200px'
    	   , allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001') ? true : false); }  // ADAMS 연동 고도화
    	   , editable:{type:"text"}	}
       , {key : 'ntwkRmkThree'	      ,title :cflineMsgArray['remark3']/* '비고3'  */              ,align:'left', width: '200px'
    	   , allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001') ? true : false); }  // ADAMS 연동 고도화
    	   , editable:{type:"text"}	}
       //, {key : 'tdmUseYnNm'	          ,title : 'TMD사용여부'          ,align:'center', width: '200px'}
       , {key : 'tdmUseYn', align:'center', width:'100px', title :cflineMsgArray['tdmUsingYn']/* 'TDM사용여부'*/,
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (sTdmUseYn.length > 1) {
							return render_data = render_data.concat(sTdmUseYn);
						} else {
							return render_data.concat({value : data.tdmUseYn,text : data.tdmUseYnNm });
						}
				}
			}
       , allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001') ? true : false); }  // ADAMS 연동 고도화
			, editable : {type : 'select',rule : function(value, data) {return sTdmUseYn; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
           } 
       , {key : 'tdmRsnCtt'	          ,title :cflineMsgArray['tdmRsnCtt'] /*'이유'*/                 ,align:'left', width: '200px'
    	   , allowEdit : function(value, data){return((data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001') ? true : false); }  // ADAMS 연동 고도화
    	   , editable:{type:"text"}	}
       , {key : 'tdmChgUserNm'	      ,title :cflineMsgArray['TDMCngUserNm']/* 'TDM변경자'*/            ,align:'center', width: '100px'}
/*
       , {key : 'topoNd'	              ,title : '토폴로지코드'                 ,align:'center', width: '70px'}
       , {key : 'ntwkTypCd'	          ,title : '네트워크유형코드'             ,align:'center', width: '70px'}
       , {key : 'ntwkStatCd'	          ,title : '네트워크상태코드'             ,align:'center', width: '70px'}
       , {key : 'ringSwchgMeansCd'	    ,title : '링절체방식코드'               ,align:'center', width: '70px'}
       , {key : 'minNtwkCapaCd'	      ,title : '최소네트워크용량코드'         ,align:'center', width: '70px'}
       , {key : 'ntwkTrmnUserId'	      ,title : '네트워크해지사용자ID'         ,align:'center', width: '70px'}
       , {key : 'ntwkLnoInsProgStatCd' ,title : '네트워크선번입력진행상태코드' ,align:'center', width: '70px'}
       , {key : 'uprMtsoId'	          ,title : '상위국사ID'                   ,align:'center', width: '70px'}
       , {key : 'lowMtsoId'	          ,title : '하위국사ID'                   ,align:'center', width: '70px'}
       , {key : 'tdmChgUserId'	        ,title : 'TDM변경사용자ID'              ,align:'center', width: '70px'}
       , {key : 'wdmBdwthVal'	        ,title : 'WDM밴드값'                    ,align:'center', width: '70px'}
       , {key : 'wdmChnlVal'	          ,title : 'WDM채널값'                    ,align:'center', width: '70px'}
       , {key : 'wdmFreqVal'	          ,title : 'WDM주파수값'                  ,align:'center', width: '70px'}
       , {key : 'wdmDrcVal'	          ,title : 'WDM방향값'                    ,align:'center', width: '70px'}
       , {key : 'frstRegUserId'	      ,title : '최초등록사용자ID'             ,align:'center', width: '70px'}
       , {key : 'lastChgUserId'	      ,title : '최종변경사용자ID'             ,align:'center', width: '70px'}
       , {key : 'vlanVal'	            ,title : 'VLAN값'                       ,align:'center', width: '70px'}
       , {key : 'tlId'	                ,title : '터널ID'                       ,align:'center', width: '70px'}
*/
       , {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px'}
       , {key : 'appltDt'	                ,title : cflineMsgArray['applicationDate'] /*청약일자*/                       ,align:'center', width: '90px'}
       , {key : 'workMgmtYn' , title :"workMgmtYn"/*작업전환*/, hidden: true}
       ];
    	return column;
    };
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	setSearchCode("orgCd", "teamCd", "topMtsoId");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188Data');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getCapaCd/03', null, 'GET', 'C00194Data');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00262', null, 'GET', 'C00262Data');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C02441', null, 'GET', 'C02441Data');
    	
    	// 사용자 소속 전송실
    	searchUserJrdtTmofInfo("topMtsoId");
    }
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
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
    
    function setEventListener() {
    	
    	 
    	// 탭 선택 이벤트
   	 	$("#basicTabs").on("tabchange", function(e, index) {
   	 		if(index == 0) {
   	 			$('#'+gridId).alopexGrid("viewUpdate");
   	 			
	   	 		if( totalCount > 0  ){
					$('#btnExportExcel').setEnabled(true);
		    	}else{
		    		$('#btnExportExcel').setEnabled(false);
		    	}
   	 			
   	 		} else if(index == 1) {
   	 			$('#'+gridIdWork).alopexGrid("viewUpdate");
   	 			
	   	 		if( totalCountWork > 0 ){
					$('#btnExportExcel').setEnabled(true);
		    	}else{
		    		$('#btnExportExcel').setEnabled(false);
		    	}
   	 		}
   	 	});
   	 	
   	 
   	 	// 엔터 이벤트 
     	$('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			
     			// 국사 관련
         		if ( nullToEmpty( $("#mtsoNm").val() )  != "" ){
         		
         		}else if ( nullToEmpty( $("#mtsoNm").val() ) == "" ){
         		
         			$("#mtsoId").val("");
         		}
         		
     			searchYn = true ; 
     			
			 	gridIdscrollBottom = true;
			 	gridIdWorkscrollBottom = true;
			 	
     			setGrid(1,pageForCount,1,pageForCount,"A");
       		}
     	});
     	
     	//배치실행
        $('#btnExcelBatchExecute').on('click', function(e) {
        	funExcelBatchExecute();
        });    
        //배치상태확인
     	$('#btnExcelBatchExecuteStatus').on("click", function(e){
     		funExcelBatchExecuteStatus();
     	});
     	//배치엑셀다운로드
     	$('#btnExcelDownload').on("click", function(e){
     		funExcelDownload();

    	});
     	
     	//엑셀업로드
     	$('#btnAddExcel').on("click", function(e){
     		$a.popup({
              	popid: 'TrunkExcelUplaodPop',
              	title: "트렁크 엑셀업로드", /*'서비스회선 엑셀업로드'*/
              	iframe: true,
              	modal : false,
              	windowpopup : true,
                  url: $('#ctx').val() +'/configmgmt/cfline/TrunkExcelUploadPop.do',
                  data: null, 
                  width : 800,
                  height : 400 //window.innerHeight * 0.5,
                  /*$('#ctx').val() + url
              		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
              	*/                
                  ,callback: function(resultCode) {
	                  	if (resultCode == "OK") {
	                  		//$('#btnSearch').click();
	                  	}
                 	}
         	 	  ,xButtonClickCallback : function(el){
         	 			alertBox('W', cflineMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
         	 			return false;
         	 		}
              });
     		
     	});
     	
     	
     	 
     	
   	  
   	 	$('#tab1Header').on("click", function(e){
   	 		btnEnableProc(gridId, "btnDupMtsoMgmt", "btnWorkCnvt", "A");
   	 	 // ADAMS 연동 고도화
    		if($('#ownCd').val() == '0001') {
    			$('#btnDupMtsoMgmt').setEnabled(true);
    		}else{
    			$('#btnDupMtsoMgmt').setEnabled(false);
    		}
	    });
   	 	$('#tab2Header').on("click", function(e){
   	 		btnEnableProc(gridIdWork, "btnDupMtsoMgmt", "btnWorkCnvt", "B");
    		// ADAMS 연동 고도화 // 탭 클릭시 사용 못함.
    		if($('#ownCd').val() == '0002' || $('#ownCd').val() == ''){
   	 		 $('#'+gridIdWork).alopexGrid('endEdit');
   			}
    		
	    });
   	 	$('#tab1').on("click", function(e){
   	 		var selectedId = $('#'+gridId).alopexGrid('dataGet');
   	 		if(nullToEmpty(selectedId[0].ntwkStatCdNm) == "해지" || nullToEmpty(selectedId[0].ntwkStatCdNm) == "해지요청중") { 
   	 			$('#btnWorkCnvt').setEnabled(false);
   	 		} else {
   	 			btnEnableProc2(gridId, "btnWorkCnvt");
   	 		}
	    });
	 	$("#tab2").on("click", function(e){
	 		var selectedId = $('#'+gridIdWork).alopexGrid('dataGet');
   	 		if(nullToEmpty(selectedId[0].ntwkStatCdNm) == "해지" || nullToEmpty(selectedId[0].ntwkStatCdNm) == "해지요청중") {
	   	 		$('#btnLineTrmn').setEnabled(false);
				$('#btnTrunkWorkUpdate').setEnabled(false);
				$('#btnAllWorkInfFnsh').setEnabled(false);
				$('#btnWorkInfFnsh').setEnabled(false);
				$('#btnDupMtsoMgmt').setEnabled(false);
   	 		} else {
   	 			var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
				btnEnableProc2(gridIdWork, "btnDupMtsoMgmt");
				if(selectedData.length > 0 ){
					 // ADAMS 연동 고도화
					if(nullToEmpty(selectedId[0].mgmtGrpCd) == "0001" && $('#ownCd').val()=="0001" && $('#ownCd').val()!=""){
						$('#btnLineTrmn').setEnabled(true); // 원래 이거만 있었음.
						$('#btnTrunkWorkUpdate').setEnabled(true);
						$('#btnAllWorkInfFnsh').setEnabled(true);
						$('#btnWorkInfFnsh').setEnabled(true);
						$('#btnTrunkWorkUpdate').setEnabled(true);
						$('#btnTrunkWritePop').setEnabled(true);
		    			$('#btnAddExcel').setEnabled(true);
					}else{
						$('#btnLineTrmn').setEnabled(false); // 원래 이거만 있었음.
						$('#btnTrunkWorkUpdate').setEnabled(false);
						$('#btnAllWorkInfFnsh').setEnabled(false);
						$('#btnWorkInfFnsh').setEnabled(false);
						$('#btnTrunkWorkUpdate').setEnabled(false);
						$('#btnTrunkWritePop').setEnabled(false);
		    			$('#btnAddExcel').setEnabled(false);
					}
				
				}else{
					$('#btnLineTrmn').setEnabled(false);
					$('#btnTrunkWorkUpdate').setEnabled(false);
					$('#btnAllWorkInfFnsh').setEnabled(false);
					$('#btnWorkInfFnsh').setEnabled(false);
				}
   	 		}
	 		
	    });
   	 	 
	 	$('#ownCd').on('change',function(e){
	   		changeMgmtGrp("ownCd", "orgCd", "teamCd", "topMtsoId", "mtso");
	   	// ADAMS 연동 고도화
	   		var mgmtGrpCd =$('#ownCd').val();
    		if(mgmtGrpCd == '0001') {
    			$('#btnTrunkWritePop').setEnabled(true);
    			$('#btnAddExcel').setEnabled(true);
    		}else{
    			$('#btnTrunkWritePop').setEnabled(false);
    			$('#btnAddExcel').setEnabled(false);
//    			$('#btnDupMtsoMgmt').setEnabled(false);
    			//$('#btnWorkCnvt').setEnabled(false);
    		}
	   	});  
   	 	
   	// 본부 선택시
    	$('#orgCd').on('change',function(e){
    		changeHdofc("orgCd", "teamCd", "topMtsoId", "mtso");
      	});    	 
  		// 팀 선택시
    	$('#teamCd').on('change',function(e){
    		changeTeam("teamCd", "topMtsoId", "mtso");
      	});
    	
        $('#'+gridId).on('scrollBottom', function(e){
        	
        	if (gridIdscrollBottom){
        		searchYn = false ; 
            	setGrid(pageForCount,pageForCount,0,0,"T");
        	}
        	
    	});
        
        $('#'+gridIdWork).on('scrollBottom', function(e){
        	
        	
        	if (gridIdWorkscrollBottom){
        		searchYn = false ;
	        	setGrid(0,0,pageForCount,pageForCount,"W");
        	}
        	
        });     
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
    		 searchYn = true ; 
    		 
		 	 gridIdscrollBottom = true;
		 	 gridIdWorkscrollBottom = true;
		 	
    		 setGrid(1,pageForCount,1,pageForCount,"A");
    		
    		 // ADAMS 연동 고도화
			$('#btnTrunkWorkUpdate').setEnabled(false);
			$('#btnAllWorkInfFnsh').setEnabled(false);
			$('#btnWorkInfFnsh').setEnabled(false);
			$('#btnLineTrmn').setEnabled(false);
         });
    	 
     
     	$('#mtsoNm').on('keydown', function(e){
     		if (e.which != 13  ){
    			$("#mtsoId").val("");
    		}
     	});
     	
        // 국사  좌포트 우포트 
     	$('#searchForm').on('change', function(e){
     		if ( nullToEmpty( $("#lEqpNM").val() )  != "" ){
     			$('#lPortNm').setEnabled(true);// 좌포트
     		}else if ( nullToEmpty( $("#lEqpNM").val() ) == "" ){
     			$('#lPortNm').setEnabled(false);// 좌포트
     			$("#lPortNm").val("");
     		}
     		
     		if ( nullToEmpty( $("#rEqpNM").val() )  != "" ){
     			$('#rPortNm').setEnabled(true);// 좌포트
     		}else if ( nullToEmpty( $("#rEqpNM").val() ) == "" ){
     			$('#rPortNm').setEnabled(false);// 좌포트
     			$("#rPortNm").val("");
     		}
     		
     		// 국사 관련
     		if ( nullToEmpty( $("#mtsoNm").val() )  != "" ){
     		
     		}else if ( nullToEmpty( $("#mtsoNm").val() ) == "" ){
     		
     			$("#mtsoId").val("");
     		}
     		
     		
     	});
 
     	//좌장비 
     	$('#lEqpNM').on('keydown', function(e){
     		if ( nullToEmpty( $("#lEqpNM").val() )  != "" ){
     			$('#lPortNm').setEnabled(true);// 좌포트
     		}else{
     			$('#lPortNm').setEnabled(false);// 좌포트
     			$("#lPortNm").val("");
     		}
     	});

     	//우장비 
     	$('#rEqpNM').on('keydown', function(e){
     		if ( nullToEmpty( $("#rEqpNM").val() )  != "" ){
     			$('#rPortNm').setEnabled(true);// 좌포트
     		}else{
     			$('#rPortNm').setEnabled(false);// 좌포트
     			$("#rPortNm").val("");
     		}
     	});
     	//좌장비 
     	$('#lEqpNM').on('keyup', function(e){
     		if ( nullToEmpty( $("#lEqpNM").val() )  != "" ){
     			$('#lPortNm').setEnabled(true);// 좌포트
     		}else{
     			$('#lPortNm').setEnabled(false);// 좌포트
     			$("#lPortNm").val("");
     		}
     	});
     	
     	//우장비 
     	$('#rEqpNM').on('keyup', function(e){
     		if ( nullToEmpty( $("#rEqpNM").val() )  != "" ){
     			$('#rPortNm').setEnabled(true);// 좌포트
     		}else{
     			$('#rPortNm').setEnabled(false);// 좌포트
     			$("#rPortNm").val("");
     		}
     	});
     	 
     	
    	 // 관할전송실 설정
    	 $('#btnDupMtsoMgmt').on('click', function(e) {
    		 searchYn = false;
    		 var element =  $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
 			 var selectCnt = element.length;
 			
 			if(selectCnt <= 0){
				/*alert("트렁크 회선을 선택하세요.");*/
 				alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
			}else{
				var paramMtso = null;
				var paramList = [element.length];
				var mgmtGrpStr = "";
				var mgmtGrpChk = "N";
					if(selectCnt==1){
						paramMtso = {"multiYn":"N", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "ntwkLineNoList":[element[0].ntwkLineNo]};
					}else{
						for(i=0;i<element.length;i++){
							paramList[i] = element[i].ntwkLineNo;
							 
							if(i==0){
								mgmtGrpStr = element[0].mgmtGrpCd;
							}
							if(i>0 && mgmtGrpStr != element[i].mgmtGrpCd){
								mgmtGrpChk = "Y";
							}
						}
						if(mgmtGrpChk == "Y"){
							/*alert("여러 회선에 대한 전송실 등록시는 동일 관리그룹만 가능합니다.");*/
							alertBox('I', cflineMsgArray['multiMtsoRegSameMngrGrpPoss']);/*여러 회선에 대한 전송실 등록시 동일 관리그룹만 가능합니다.*/
							return;
						}
						
						paramMtso = {"multiYn":"Y", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "ntwkLineNoList":paramList};
						
					}
		 
		    		$a.popup({
		    		  	popid: "TmofEstPop",
		    		  	title: "관할전송실 설정",
		    			url: $('#ctx').val()+'/configmgmt/cfline/TmofEstPop.do',
		    			data: paramMtso,
		    		    iframe: true,
		    			modal: false,
		    			movable:true,
		    			windowpopup : true,
		    			width : 1000,
		    			//height :window.innerHeight * 0.9,
		    			height :800,
		    			callback:function(data){
		    					if(data != null){
		    						if (data=="Success"){
		    							
		    	 						var first01 = parseInt( $("#firstRow01").val()    );
		    	 						var last01  = parseInt( $("#lastRow01").val()    );
		    	 						var first02 = parseInt( $("#firstRow02").val()    );
		    	 						var last02  = parseInt( $("#lastRow02").val()    );
		    	 						
		    	 						if (first01 > 0 && last01 > 0  ){
		    	 							// 기존에 조회 했었으면.. 그걸로 리스트 
		    	 							setGrid(1,last01,1,last02,"A");    
		    	 						}else{
		    	 							//조회한적이 없으면 그냥 끝
		    	 							setGrid(1,pageForCount,1,pageForCount,"A");
		    	 						}	 
		     						}
		    					}
		    			}
		    		});
		    		 
				
				}
 			
 			 
    		 
    		 
         });
    	  
    	 
    	 /*$('#btnTrunkListPop').on('click', function(e) {
     		 popup('TrunkListPop', $('#ctx').val()+'/configmgmt/cfline/TrunkListPop.do', '트렁크리스트조회팝업');
          });*/
    	 //트렁크등록팝업 
    	 $('#btnTrunkWritePop').on('click', function(e) {
    		 $a.popup({
 	    		popid: "TrunkWritePop",
 			  	title: "트렁크등록팝업",
 			  	url: $('#ctx').val()+'/configmgmt/cfline/TrunkWritePop.do',
 			    iframe: true,
 				modal : false,
 				movable : true,
 				windowpopup : true,
 				//windowpopup:false,
 			    /*width : 900,
 			    height : 780*/
 			    width : 1000,
   			    //height :window.innerHeight * 0.9
   			    height :800
   			
 			    ,callback:function(data){
 					if(data != null){
 						
 						if (data=="Success"){
 							/*alert("등록 완료 되었습니다.");*/
 							alertBox('I', cflineMsgArray['saveSuccess']); /* 저장을 완료 하였습니다.*/
	 						
 							var first01 = parseInt( $("#firstRow01").val()    );
	 						var last01  = parseInt( $("#lastRow01").val()    );
	 						var first02 = parseInt( $("#firstRow02").val()    );
	 						var last02  = parseInt( $("#lastRow02").val()    );
	 						
	 						if (first01 > 0 && last01 > 0  ){
	 							// 기존에 조회 했었으면.. 그걸로 리스트 
	 							setGrid(1,last01,1,last02,"A");    
	 						}else{
	 							//조회한적이 없으면 그냥 끝
	 							setGrid(1,pageForCount,1,pageForCount,"A");
	 						}
 							
 						}else{
			    			//alert("실패하였습니다.");
			    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			    		} 
 					}
 				}
    		 
 	    	});
    		 
    	 });
    	 // 작업정보저장
    	 $('#btnTrunkWorkUpdate').on('click', function(e) {
    		 funTrunkWorkUpdate();
          });

    	//엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 
        	 funExcelBatchExecute();
        	 
        	 /**
        	 var MSG = "배치작업예정";
        	 alertBox('I',  MSG );
        	 return;
        	 
        	 var topMtsoIdList = [];
     		if (nullToEmpty( $("#topMtsoId").val() )  != ""  ){
     			topMtsoIdList =   $("#topMtsoId").val() ;	
     		}else{
     			//topMtsoIdList = [];
     		}
     		
     		var dataParam =  $("#searchForm").getData();
     		
          	$.extend(dataParam,{topMtsoIdList: topMtsoIdList });
          	var sAllPass = false ;
          	if ($("input:checkbox[id='sAllPass']").is(":checked") ){
          		sAllPass = true; 
          	}
          	$.extend(dataParam,{sAllPass: sAllPass });
          	
          	var sWorkGrpWhereUse = false ;
          	if ($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked") ){
          		sWorkGrpWhereUse = true; 
          	}
          	$.extend(dataParam,{sWorkGrpWhereUse: sWorkGrpWhereUse });
          	
          	$.extend(dataParam,{topoLclCd: "002" });
          	$.extend(dataParam,{topoSclCd: "100" });
        	 //var dataParam =  $("#searchForm").getData();
        	 var stabIndex = $('#basicTabs').getCurrentTabIndex();
        	 
          	//var dataParam =  $("#searchForm").serialize(); 
          	 

        	 if (stabIndex =="0"){
        		dataParam = gridExcelColumn(dataParam, gridId);
           	}else if (stabIndex =="1"){
           		dataParam = gridExcelColumn(dataParam, gridIdWork);
           	}
          	
          	
          	var replaceColumn = {"ntwkCapaCd" : "ntwkCapaCdNm"
								};

			$.each(replaceColumn, function(key,val){
				dataParam.excelHeaderCd = dataParam.excelHeaderCd.replace(key, val);         		
			})

          	
          	dataParam.fileExtension = "xlsx";
          	dataParam.excelPageDown = "N";
          	dataParam.excelUpload = "N";
          	
         	
          	
          	if (stabIndex =="0"){
          		dataParam.method = "trunkInfo";
          		dataParam.fileName = "트렁크정보";
          	}else if (stabIndex =="1"){
          		dataParam.method = "trunkWorkInfo";
          		dataParam.fileName = "트렁크작업정보";
          	}
          	//var dataNewParam =  $.param(dataParam, true);	
	   		cflineShowProgress(gridId);
	   		cflineShowProgress(gridIdWork);
          	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getTrunkListExcelDown', dataParam, 'POST', 'excelDownload');
         	**/
         	
         });    	 

         // TODO 
         $('#'+gridId).on('dblclick', '.bodycell', function(e){
        	 var dataObj = AlopexGrid.parseEvent(e).data; 
        	 showTrunkEditPop( gridId, dataObj ,"N");
         });
    	 	
         $('#'+gridIdWork).on('dblclick', '.bodycell', function(e){
        	 var dataObj = AlopexGrid.parseEvent(e).data; 
        	 showTrunkEditPop( gridIdWork, dataObj ,"Y");
        	 
        	 rowSeletedIndex = dataObj._index.row;
        	 rowSeletedColNm = dataObj._key;
        	 rowSeletedGrid  = gridIdWork; 
         });
    	 
         // 해지회선 
    	 $('#btnLineTrmn').on('click', function(e) {
    		 funLineTrmn();
    	 });	
    	 // 작업전환
    	 $('#btnWorkCnvt').on('click', function(e) {
    		 funWorkCnvt();
          });
    	 // 모든작업정보완료
    	 $('#btnAllWorkInfFnsh').on('click', function(e) {
    		 fnWorkInfoFnsh(true);
    	 });
    	 // 작업정보완료 -- 사용자의 권한에 따라 전송실 일부만 업데이트 
    	 $('#btnWorkInfFnsh').on('click', function(e) {
    		 fnWorkInfoFnsh(false);
    	 });
    	 
		//국사 조회
		$('#btnMtsoSch').on('click', function(e) {
			var paramValue = "";
			
			paramValue = {"mgmtGrpNm": $('#ownCd option:selected').text(),"orgId": $('#orgCd').val(),"teamId": $('#teamCd').val(),"mtsoNm": $('#mtsoNm').val(), "regYn" : "Y", "mtsoStatCd" : "01"}
			
			openMtsoDataPop("mtsoId", "mtsoNm", paramValue);
			//openMtsoPop("mtsoId", "mtsoNm");
		});     
		
		/*//장비 조회 "btnMtsoEqpSch"
		$('#btnEqpSch').on('click', function(e) {
			openEqpPop("eqpId", "eqpNm");
		}); 
		
		//포트 조회
		$('#btnPortSch').on('click', function(e) {
			openPortPop("portId", "portNm");
		}); 
    	 */
    	// 20171116 E2E,시각화편집 버튼 클릭 이벤트
    	$('#'+gridId).on('click', '#btnE2ePop', function(e){  
			intgE2ETopo(gridId);
		}).on('click', '#btnServiceLIneInfoPop', function(e){  
			var dataObj = AlopexGrid.parseEvent(e).data;
			showTrunkInfoPop( gridId, dataObj, "N");
		});
    	$('#'+gridIdWork).on('click', '#btnE2ePop', function(e){  
			intgE2ETopo(gridIdWork);
		}).on('click', '#btnServiceLIneInfoPop', function(e){  
			var dataObj = AlopexGrid.parseEvent(e).data;
			showTrunkInfoPop( gridIdWork, dataObj, "Y");
		});
    	 
	};
	
	// E2E 토폴로지 팝업창 오픈
    function intgE2ETopo(gridId) {
    	var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
    	window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=TRK&searchId=' + focusData[0].ntwkLineNo + '&searchNm=' + focusData[0].ntwkLineNm);
    }
    //트렁크 편집팝업
	function showTrunkEditPop( gridId, dataObj ,sFlag) {
		var title = "트렁크상세정보";
		if (sFlag == "Y"){
			title = "트렁크상세정보 - 수정";
		}
		var url = $('#ctx').val()+'/configmgmt/cfline/TrunkInfoPop.do';
		
		$a.popup({
			popid: "TrunkEditPop",
			title: title,
			url: url,
			data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":sFlag, "mgmtGrpCd":dataObj.mgmtGrpCd, "topoLclCd":"002", "mgmtOnrNm":dataObj.mgmtOnrNm},
			iframe: true,
			modal : false,
			movable : true,
			windowpopup : true,
			width : 1400,
//			height : 940
			height : 780
			,callback:function(data){
	
			}
		});
		
    }	
	function showTrunkInfoPop( gridId, dataObj ,sFlag) {
		var title = "트렁크상세정보";
		if (sFlag == "Y"){
			title = "트렁크상세정보 - 수정";
		}
		
//		var url = $('#ctx').val()+'/configmgmt/cfline/TrunkInfoPop.do';
		var url = $('#ctx').val()+'/configmgmt/cfline/TrunkInfoDiagramPop.do';
		
		$a.popup({
			popid: "TrunkInfoDiagramPop",
			title: title,
			url: url,
			data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":sFlag, "mgmtGrpCd":dataObj.mgmtGrpCd, "topoLclCd":"002"},
			iframe: true,
			modal : false,
			movable : true,
			windowpopup : true,
			width : 1400,
			height : 940
			,callback:function(data){
				/*var first01 = parseInt( $("#firstRow01").val()    );
				var last01  = parseInt( $("#lastRow01").val()    );
				var first02 = parseInt( $("#firstRow02").val()    );
				var last02  = parseInt( $("#lastRow02").val()    );
				
				if (first01 > 0 && last01 > 0  ){
					// 기존에 조회 했었으면.. 그걸로 리스트 
					setGrid(1,last01,1,last02,"A");    
				}else{
					//조회한적이 없으면 그냥 끝
					setGrid(1,pageForCount,1,pageForCount,"A");
				}*/
			}
		});
		
    }
	
	
	function successCallback(response, status, jqxhr, flag){
		if(flag == 'terminate') {
			cflineHideProgressBody();
			if(response.returnCode == "SUCCESS"){
				if(response.useNtwkLineNoList != null && response.useNtwkLineNoList.length > 0){
					var msg = "";
					
					if(parseInt(response.cnt) > 0){
						msg = makeArgMsg('processed', response.cnt ,"","",""); /* ({0})건 처리 되었습니다. */
					}
					else {
						msg = cflineMsgArray['noApplyData'];
					}
					
					msg+= "<br><br>" + cflineMsgArray['untreated'] + " : " + response.useNtwkLineNoList.length + "건";
					callMsgBox('','I', msg, function(msgId, msgRst){
			       		if (msgRst == 'Y') {
			       			var param = {"ntwkLineNoList":response.useNtwkLineNoList, "topoLclCd":"002" };
							$a.popup({
				 	 			popid: "UsingInfoPop",
				 	 			title: cflineMsgArray['trunk']+"-"+cflineMsgArray['trmn']/*기간망트렁크 - 해지*/,
				 	 			url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
				 	 			data: param,
				 	 			iframe: true,
				 	 			modal: false,
				 	 		    movable:true,
				 	 		    windowpopup : true,
				 	 			width : 1200,
				 	 			height : 650,
				 	 			callback:function(data){
				 	 				setGrid(1,pageForCount,1,pageForCount,"A");
				 	 		    }
				 	 		});
			       		} else {
			       			setGrid(1,pageForCount,1,pageForCount,"A");
			       		}
					});	
				}
				else {
					var msg = makeArgMsg('processed', response.cnt ,"","",""); /* ({0})건 처리 되었습니다. */
					callMsgBox('','I', msg, function(msgId, msgRst){
			       		if (msgRst == 'Y') {
			       			setGrid(1,pageForCount,1,pageForCount,"A");
			       		}
					});
				}
				
				/* 2018-08-13 해지된 회선 중 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
				var acceptParam = {
						 lineNoStr : procAcceptTargetList
					   , topoLclCd : "002"
					   , linePathYn : "N"
					   , editType : "C"   // 해지
					   , excelDataYn : "N"
				}
				extractAcceptNtwkLine(acceptParam);
			}
			else if(response.returnCode == "NODATA"){
				alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
			}
			else {
				alertBox('I', cflineMsgArray['noData']); /* 데이터가 없습니다. */
			}
		}
		
		if(flag == 'C00194Data') {
			// 용량데이터셋팅
    		var gridC00194Data = [];
    		C00194Data = [{value: "",text: cflineCommMsgArray['all']/*전체*/}];
			for(var i=0; i<response.length; i++){
    			C00194Data.push({value : response[i].value, text :response[i].text});
    			gridC00194Data.push({value : response[i].value, text :response[i].text});
    		}
    		$('#ntwkCapaCd').clear();
    		$('#ntwkCapaCd').setData({data : C00194Data});
    		C00194Data = gridC00194Data;
		}
		
		if(flag == 'C00262Data') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			C00262DataList = response;
			C00262Data.push({"uprComCd":"","value":"","text":whole});
			
			for(var index = 0 ; index < C00262DataList.length ; index++) { 
				C00262Data.push(C00262DataList[index]);
			}
			$('#ntwkStatCd').setData({data : C00262Data});
		}
		
		if(flag == 'C02441Data') {
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			C02441Data = response;
			C02441DataComboList.push({"uprComCd":"","value":"","text":whole});
			
			for(var index = 0 ; index < C02441Data.length ; index++) { 
				C02441DataComboList.push(C02441Data[index]);
			}
			$('#trkRoleDivCd').setData({data : C02441DataComboList});
			
		}
		
		if(flag == 'C00188Data') {
			// 관리그룹
			C00188Data = response;
 
		}
	           
    	if(flag == 'workCnvt'){
    		if(response.Result == 'Success'){ 
    			var msgStr = "";
    			if(response.ussWorkList != null && response.ussWorkList.length>0){

    				for(k=0; k<response.ussWorkList.length; k++){
    					var dataResultList = response.ussWorkList[k];  
    					if(k==0){
    						msgStr = dataResultList.lineNm;
    					}else{
    						msgStr += "," + dataResultList.lineNm;
    					}
    				}
    			}
    			if(msgVal == ""){
    				msgStr = "(" + response.cnt + ")";
    			}else{
    				msgStr = msgVal + "<br>" + "(" + response.cnt + ")";
    			}
    			//alert(msgStr);
    			//alertBox('I', makeArgMsg('processed',msgStr,"","","")); /* ({0})건 처리 되었습니다. */
    			var first01 = parseInt( $("#firstRow01").val()    );
    			var last01  = parseInt( $("#lastRow01").val()    );
    			var first02 = parseInt( $("#firstRow02").val()    );
    			var last02  = parseInt( $("#lastRow02").val()    );
    			
    			callMsgBox('','I', makeArgMsg('processed',msgStr,"","",""), function(msgId, msgRst){ /* ({0})건 처리 되었습니다. */ 
            		if (msgRst == 'Y') {
            			// 처리후 다시변환이 되게끔처리  
            			searchYn = true ; 
            			if (first01 > 0 && last01 > 0  ){
            				// 기존에 조회 했었으면.. 그걸로 리스트 
            				setGrid(1,last01,1,last02,"A");    
            			}else{
            				//조회한적이 없으면 그냥 끝
            				setGrid(1,pageForCount,1,pageForCount,"A");
            			}
            		}
            	});
    		}else if(response.Result == 'NODATA'){ 
    			/*alert('변경할 데이터가 없습니다.'); */
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			/*alert('실패 되었습니다.'); */
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	// new 작업정보완료 , 모든작업정보완료 
    	if(flag == 'workInfoFinish'){
    		cflineHideProgressBody();
    		if(response.Result == 'Success'){ 
    			msgStr = "(" + response.cnt + ")";
    			callMsgBox('','I',makeArgMsg('processed',msgStr,"","",""), function(msgId,msgRst){ /* ({0})건 처리 되었습니다. */
    				if(msgRst == 'Y'){
    					searchYn = true ;
    					setGrid(1,pageForCount,1,pageForCount,"A");
    				}
    			});
    			cflineHideProgressBody();
    		}else if(response.Result == 'NODATA'){ 
    			alertBox('I', cflineMsgArray['noApplyData']); /* 적용할 데이터가 없습니다.*/
    		}else{ 
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    		}
    	}
    	
    	if(flag == 'updateTrunkWorkNtwkBas'){
    		// 작업정보저장 
    		cflineHideProgressBody();
   		 	var first01 = parseInt( $("#firstRow01").val()    );
			var last01  = parseInt( $("#lastRow01").val()    );
			var first02 = parseInt( $("#firstRow02").val()    );
			var last02  = parseInt( $("#lastRow02").val()    );
    		
    		if(response.returnCode == '200'){ 
    			/*alert('처리 되었습니다.'); */
    			callMsgBox('','I', cflineMsgArray['saveSuccess'], function(msgId, msgRst){ /* 저장을 완료 하였습니다.*/ 
            		if (msgRst == 'Y') {
		    			// 처리후 다시변환이 되게끔처리  
		        		searchYn = true ; 
		    			if (last02 >= 0  ){
		    				// 기존에 조회 했었으면.. 그걸로 리스트 
		    				setGrid(1,last01,1,last02,"A");    
		    			}else{
		    				setGrid(1,pageForCount,1,pageForCount,"A");
		    			}
            		}
            	});
    		}
    		else if(response.returnCode == '500'){ 
    			/*alert('실패 되었습니다.  ');*/
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    			// 처리후 다시변환이 되게끔처리  
        		searchYn = true ; 
       		 	
    			if (last02 >= 0  ){
    				// 기존에 조회 했었으면.. 그걸로 리스트 
    				setGrid(1,last01,1,last02,"A");    
    			}else{
    				setGrid(1,pageForCount,1,pageForCount,"A");
    			}
    		}
    	}
    	//국사 조회시
    	if(flag == 'searchA'){
    		maxnumber = 0;
    		// 그리드초기화 
    		emClass     = '' ;
    		mapping = columnMapping();
    		
    		var outTrunkList =  response.outTrunkList;
			if (outTrunkList.length  > 0  && $("input:checkbox[id='sAllPass']").is(":checked") ){
				response.outTrunkList = makeHeader(response.outTrunkList);
			}	
			
			
			
			if(response.outTrunkList.length  > 0 ){
				initGrid("T");
			}
				
			$('#'+gridId).alopexGrid('dataSet', response.outTrunkList );
			
			if(response.totalCount > 0 ){
				totalCount = response.totalCount;
    			$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : ' + getNumberFormatDis(response.totalCount);} } } );
    			$('#sListGroup').text("("+getNumberFormatDis(response.totalCount)+")");
    		}else{
    			totalCount = response.totalCount;
    			$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : 0';} } } );
    			$('#sListGroup').text("(0)");
    			
    		}
			
			// 그리드초기화 
			emClass     = '<em class="color_red">*</em> ' ;
			mapping = columnMapping();
    		
			var outTrunkListWork =  response.outTrunkListWork;
			//if (outTrunkListWork.length  > 0  && $("input:checkbox[id='sAllPass']").is(":checked") && $("input:checkbox[id='sWorkGrpWhereUse']").is(":checked")  ){
			if (outTrunkListWork.length  > 0  && $("input:checkbox[id='sAllPass']").is(":checked")   ){
				response.outTrunkListWork = makeHeader(response.outTrunkListWork);
			}
			
			if(response.outTrunkListWork.length  > 0 ){
				initGrid("W");
			}
			
			$('#'+gridIdWork).alopexGrid('dataSet', response.outTrunkListWork); 
				
			
			if(response.totalCountWork > 0 ){
				
				totalCountWork = response.totalCountWork ;
    			$('#'+gridIdWork).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : ' + getNumberFormatDis(response.totalCountWork);} } } );
    	    	$('#sWorkGroup').text("("+getNumberFormatDis(response.totalCountWork)+")");
    		}else{
    			totalCountWork = response.totalCountWork ;
    			$('#'+gridIdWork).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : 0'  ;} } } );
    	    	$('#sWorkGroup').text("(0)");
    		}
 
    		cflineHideProgressBody();
    		cflineHideProgress(gridId);
    		cflineHideProgress(gridIdWork);
    		
    		$('#'+gridId).alopexGrid("columnFix", 6);
			$('#'+gridIdWork).alopexGrid("columnFix", 6);
			$('#'+gridIdWork).alopexGrid("startEdit");
			
			
			var stabIndex = $('#basicTabs').getCurrentTabIndex();
	      	if (stabIndex =="0"){
				if( totalCount > 0  ){
					$('#btnExportExcel').setEnabled(true);
		    	}else{
		    		$('#btnExportExcel').setEnabled(false);
		    	}
         	}else if (stabIndex =="1"){
         		if( totalCountWork > 0  ){
    				$('#btnExportExcel').setEnabled(true);
    	    	}else{
    	    		$('#btnExportExcel').setEnabled(false);
    	    	}
         	}
	      	
			if(rowSeletedIndex > 0 ){
				focusCell();
			}
			
    	}
    	//국사 조회시
    	if(flag == 'searchT'){
    		// 그리드초기화 
    		emClass     = '' ;
    		mapping = columnMapping();
    		var outTrunkList =  response.outTrunkList;
			if (outTrunkList.length  > 0  && $("input:checkbox[id='sAllPass']").is(":checked") ){
				response.outTrunkList = makeHeader(response.outTrunkList);
			}	
			
 
			
			if(response.outTrunkList.length  > 0 ){
				initGrid("T");	
			}
			
			
			
			if(searchYn){
				$('#'+gridId).alopexGrid("dataSet", response.outTrunkList);
			}else{
				$('#'+gridId).alopexGrid("dataAdd", response.outTrunkList);
			}
			
			
			if(response.totalCount > 0 ){
    			$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : ' + getNumberFormatDis(response.totalCount);} } } );
    			$('#sListGroup').text("("+getNumberFormatDis(response.totalCount)+")");
    		}else{
    			
    			$('#'+gridId).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : 0';} } } );
    			$('#sListGroup').text("(0)");
    			
    		}
			
			cflineHideProgress(gridId);
			
			$('#'+gridId).alopexGrid("columnFix", 6);
    		
    		if(response.outTrunkList.length == 0){
				//alert('데이터가 없습니다');
    			
    			gridIdscrollBottom = false;
    			
				//alertBox('I', cflineMsgArray['noMoreData']); //더 이상 조회될 데이터가 없습니다. 
				return false;
			} 
			  
   
    	}
    	//국사 조회시
    	if(flag == 'searchW'){
    		// 그리드초기화 
    		emClass     = '<em class="color_red">*</em> ' ;
    		columnMapping();
    		
			var outTrunkListWork =  response.outTrunkListWork;
			
			if (outTrunkListWork.length  > 0  && $("input:checkbox[id='sAllPass']").is(":checked")  ){
				response.outTrunkListWork = makeHeader(response.outTrunkListWork);
			}	
			 
			
			if(response.outTrunkListWork.length  > 0 ){
				initGrid("W");	
			}
			
			
			if(searchYn){
				$('#'+gridIdWork).alopexGrid('dataSet', response.outTrunkListWork);
			}else{
				$('#'+gridIdWork).alopexGrid('dataAdd', response.outTrunkListWork);
			}
			
				
			
			if(response.totalCountWork > 0 ){
    			$('#'+gridIdWork).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : ' + getNumberFormatDis(response.totalCountWork);} } } );
    	    	$('#sWorkGroup').text("("+getNumberFormatDis(response.totalCountWork)+")");
    		}else{
    			
    			$('#'+gridIdWork).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return '총결과 : 0'  ;} } } );
    	    	$('#sWorkGroup').text("(0)");
    		}

    		cflineHideProgress(gridIdWork);

	 		 
			if(response.outTrunkListWork.length == 0){
				//alert('데이터가 없습니다');
				
    			gridIdWorkscrollBottom = false;
				//alertBox('I', cflineMsgArray['noMoreData']);  //더 이상 조회될 데이터가 없습니다.
				return false;
			}
    		
			$('#'+gridIdWork).alopexGrid("columnFix", 6);
			$('#'+gridIdWork).alopexGrid("startEdit");
    	 
    		  
    		
    		if(rowSeletedIndex > 0 ){
				focusCell();
			}
    		
    		 
    	}
    	if(flag == 'excelDownload') {
    		 
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			//$form.attr('action',"/tango-transmission-biz/transmisson/demandmgmt/common/exceldownload");
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
			
			cflineHideProgress(gridId);
    		cflineHideProgress(gridIdWork);
    	}
    	if(flag == 'excelBatchExecute') {
    		
			cflineHideProgress(gridId);
    		cflineHideProgress(gridIdWork);
	   		
    		if(response.returnCode == '200'){ 
    				
    			jobInstanceId  = response.resultData.jobInstanceId;
    			//$('#excelFileId').val(response.resultData.jobInstanceId );
    			cflineHideProgressBody();
    	    	cflineHideProgress(gridId);
    	    	cflineHideProgress(gridIdWork);
    			excelCreatePop(jobInstanceId);
    			//funExcelBatchExecuteStatus();
    		}
    		else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    	    	cflineHideProgress(gridId);
    	    	cflineHideProgress(gridIdWork);
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
    				cflineHideProgressBody();
    		    	cflineHideProgress(gridId);
    		    	cflineHideProgress(gridIdWork);
    				//setTimeout(funExcelBatchExecuteStatus() ,50000);
    				alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    			}
    		}
    		else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    	    	cflineHideProgress(gridId);
    	    	cflineHideProgress(gridIdWork);
    			/*alert('실패 되었습니다.  ');*/
    			alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
		
	}
     
	//MAKEHEADER 
    function makeHeader (data){
    	var number =0;
    	for(var i=0; i<data.length; i++){
			var trunkList = data[i].trunkList  ;
				if(trunkList != null && trunkList.length  > 0 ){
					for(var j=0; j<trunkList.length; j++){
						var k = j +1 ; 
						data[i]["useRingNtwkLineNoNm#"+j] = trunkList[j].useRingNtwkLineNoNm;
						data[i]["useWdmTrkNtwkLineNoNm#"+j] = trunkList[j].useWdmTrkNtwkLineNoNm;
						
						/*정방향 역방향 에 따른 채널값 추가 2016-11-18*/
						var tmpSctnDrdCD = "1";
                        var sctnDrcCd  = trunkList[j].sctnDrcCd;
                        var lPortNm    = trunkList[j].lPortNm;
                        var lPortChNm  = trunkList[j].lftPortChnlVal;
                        var rPortNm    = trunkList[j].rPortNm;
                        var rPortChNm  = trunkList[j].rghtPortChnlVal;
                        var useNtwkSctnDrcCd = null;
                        
                        var rxSctnDrcCd  = trunkList[j].rxSctnDrcCd;
                        var rxLftPortNm  = "";
                        var rxRghtPortNm  = "";

                        var lftPortDescr = "";
                        var rghtPortDescr = "";
                        var lftChnlDescr = "";
                        var rghtChnlDescr = "";      

                        //RT구간방향 getRxSctnDrcCd
                        if ("2" == nullToEmpty(rxSctnDrcCd) ){
                            rxLftPortNm = nullToEmpty(trunkList[j].rxRghtPortNm);
                            rxRghtPortNm = nullToEmpty(trunkList[j].rxLftPortNm);
                        }else{
                            rxLftPortNm = nullToEmpty(trunkList[j].rxLftPortNm);
                            rxRghtPortNm = nullToEmpty(trunkList[j].rxRghtPortNm);
                        }                         
                        
                        if(nullToEmpty(trunkList[j].useNtwkSctnDrcCd) == "2"){
                        	useNtwkSctnDrcCd = "2";
                        }else{
                        	useNtwkSctnDrcCd = "1";
                        }
                        
						if((nullToEmpty(sctnDrcCd) == "2" && nullToEmpty(useNtwkSctnDrcCd) == "1") ||  (nullToEmpty(sctnDrcCd) == "1" && nullToEmpty(useNtwkSctnDrcCd) == "2") ){
							tmpSctnDrdCD = "2";
						}
                        
						if (tmpSctnDrdCD == "1"){
							data[i]["lEqpNM#"+j] = trunkList[j].lEqpNM;
//							data[i]["lPortNm#"+j] = lPortNm;
//							data[i]["rPortNm#"+j] = rPortNm;	
							data[i]["rEqpNM#"+j] = trunkList[j].rEqpNM;
							
                            lftChnlDescr = nullToEmpty(lPortChNm);
                            rghtChnlDescr = nullToEmpty(rPortChNm); 
							
	                         // 좌포트(노드 포트)
                           if("" != rxLftPortNm){
                        	   lftPortDescr = makeTxRxPortDescr(lPortNm, rxLftPortNm);
                           }
                           else {
                        	   lftPortDescr = lPortNm;
                           }
                           // 우포트(FDF 포트)
                           if("" != rxRghtPortNm){
                        	   rghtPortDescr = makeTxRxPortDescr(rPortNm, rxRghtPortNm);
                           }
                           else {
                        	   rghtPortDescr = rPortNm;
                           } 	
							
						}else if (tmpSctnDrdCD == "2"){
							data[i]["lEqpNM#"+j] =  trunkList[j].rEqpNM;
//							data[i]["lPortNm#"+j] = rPortNm;
//							data[i]["rPortNm#"+j] = lPortNm;	
							data[i]["rEqpNM#"+j]  = trunkList[j].lEqpNM;
							
                            lftChnlDescr = nullToEmpty(rPortChNm);
                            rghtChnlDescr = nullToEmpty(lPortChNm); 
							
	                         // 좌포트(노드 포트)
                            if("" != rxLftPortNm){
                            	lftPortDescr = makeTxRxPortDescr(rPortNm, rxLftPortNm);
                            }
                            else {
                            	lftPortDescr = rPortNm;
                            }
                            // 우포트(FDF 포트)
                            if("" != rxRghtPortNm){
                            	rghtPortDescr = makeTxRxPortDescr(lPortNm, rxRghtPortNm);
                            }
                            else {
                            	rghtPortDescr = lPortNm;
                            } 	
							
						}


                        
                        if (nullToEmpty(lftChnlDescr) != ""){
                        	data[i]["lPortNm#"+j] = lftPortDescr + lftChnlDescr;
                        }else{
                        	data[i]["lPortNm#"+j] = lftPortDescr;
                        }
                        if (nullToEmpty(rghtChnlDescr) != ""){
                        	data[i]["rPortNm#"+j] = rghtPortDescr + rghtChnlDescr;	
                        }else{
                        	data[i]["rPortNm#"+j] = rghtPortDescr;	
                        }		

						
//                        if (nullToEmpty(lPortChNm) != ""){
//                            lPortNm = lPortNm+","+lPortChNm;
//                        }
//                        if (nullToEmpty(rPortChNm) != ""){
//                            rPortNm = rPortNm+","+rPortChNm;
//                        }						
						
					}
					number  = trunkList.length; 
				}
				
				if (maxnumber < number){
					maxnumber = number;
				}
		}
    	//MAKEHEADER 
    	for(var j=0; j < maxnumber; j++){
    		var k = j +1 ; 
			mapping.push({ key:'useWdmTrkNtwkLineNoNm#'+j    ,title:cflineMsgArray['wdmTrunk']+'#'+k     ,align:'left', width: '200px' });
			mapping.push({ key:'useRingNtwkLineNoNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '200px' });
			//mapping.push({ key:'lEqpMtsoNm#'+k	 , title:'좌장비국사#'+k	,align:'left', width: '200px' });
			mapping.push({ key:'lEqpNM#'+j		 , title:cflineMsgArray['westEqp']+'#'+k	    	,align:'left', width: '200px' });
			mapping.push({ key:'lPortNm#'+j		 , title:cflineMsgArray['westPort']+'#'+k	    	,align:'left', width: '200px' });
			//mapping.push({ key:'rEqpMtsoNm#'+k	 , title:'우장비국사#'+k	,align:'left', width: '200px' });
			mapping.push({ key:'rEqpNM#'+j		 , title:cflineMsgArray['eastEqp'] +'#'+k	    	,align:'left', width: '200px' });
			mapping.push({ key:'rPortNm#'+j		 , title:cflineMsgArray['eastPort'] +'#'+k	    	,align:'left', width: '200px' });

			
			
			
    	}
    	
    	return data;
    }
	//request 실패시.
    function failCallback(response, status,   flag){
    	
    	if(flag == 'searchA'){
    		//alert('실패');
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'workCnvt'){
    		/*alert('실패');*/
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	
    	cflineHideProgressBody();
    	cflineHideProgress(gridId);
		cflineHideProgress(gridIdWork);
    }
    
    function focusCell(){
    	$('#'+rowSeletedGrid ).alopexGrid("focusCell", {_index : {data : rowSeletedIndex    }}, rowSeletedColNm );
    	rowSeletedIndex = 0 ;
    	rowSeletedColNm = "" ;
    	rowSeletedGrid  = "" ;
    	
    }	
    //작업정보저장
    function funTrunkWorkUpdate(){
		 $('#'+gridIdWork).alopexGrid('endEdit', {_state:{editing:true}});
		 //var updateList = AlopexGrid.trimData ( $('#'+gridIdWork).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
		 
		  
		 
		 if( $('#'+gridIdWork).length == 0) return;
		 var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
		 
		 
		 if (dataList.length > 0 ){
			 var dataList2 = AlopexGrid.trimData(dataList);
			 var requiredColumn = { ntwkLineNm : cflineMsgArray['trunkNm'] , ntwkCapaCd : cflineMsgArray['capacity'] };
			 var validate   = true;
			 var msgStr     = "";
			 for(var k=0; k<dataList2.length; k++){
	    			$.each(requiredColumn, function(key,val){
	    				var value = eval("dataList[k]" + "." + key);
	    				if(nullToEmpty(value) == ""){
	    					msgStr += "<br>"+dataList2[k].ntwkLineNo + " : " + val;
	    					validate = false;
	    					//return validate;
	    				}
	             	});
	    			rowSeletedIndex = dataList[k]._index.row;
		        	rowSeletedColNm = "ntwkLineNm";
		        	rowSeletedGrid  = gridIdWork; 
	    			
	    	 }
			 if(!validate){
         		alertBox('W', makeArgMsg('required',msgStr,"","","")); /* 필수 입력 항목입니다.[{0}] */
         		$('#'+gridIdWork).alopexGrid("startEdit");
         		return;
 			 }
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/updateTrunkWorkNtwkBas', dataList, 'POST', 'updateTrunkWorkNtwkBas');
		 }else{
			 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
			 $('#'+gridIdWork).alopexGrid("startEdit");
		 }
		  
    }
    
    //해지 
    function funLineTrmn(){
    	if( $('#'+gridIdWork).length == 0) return;
    	var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
    	
    	var paramList = new Array();
    	
    	procAcceptTargetList = "";
    	
    	if (dataList.length > 0 ){	
    		var msg = makeArgMsg("confirmSelectData",dataList.length,cflineMsgArray['trmn'],"",""); /* {dataList.length}건을 {해지}하시겠습니까? */
    		callMsgBox('','C', msg, function(msgId, msgRst){
           		if (msgRst == 'Y') {
           			cflineShowProgressBody();
           			for(i=0;i<dataList.length;i++){
           				paramList.push(dataList[i].ntwkLineNo);
           				
           			    // 해지시 자동수정대상테이블에서 삭제
        		    	procAcceptTargetList = procAcceptTargetList + dataList[i].ntwkLineNo + ","; 
           			}
           			var param = {"ntwkLineNoList":paramList, "topoLclCd":"002" };
           			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/terminatenetworkline', param, 'POST', 'terminate');
           		}
    		});  
    	}
    	else{
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다 */
    	}
    }
    //작업전환 
    function funWorkCnvt(){
    	 
		 if( $('#'+gridId).length == 0) return;
		 var dataList = $('#'+gridId).alopexGrid('dataGet', {_state: {selected:true}});
		 
		 var paramDataList = [];	
		 msgVal = "";	 
			if (dataList.length > 0 ){
				for(k=0; k<dataList.length; k++){
					if(dataList[k].workUseYn == "N"
						&& dataList[k].workMgmtYn == "Y"   /*사용자관할전송실여부*/
					 ){	
						paramDataList.push({ 
							                 "ntwkLineNo":dataList[k].ntwkLineNo 
							               , "tmpIndex":dataList[k]._index.row
							               , "mtsoLnoInsProgStatCd":"02"
							               , "singleMtsoIdYn":false
							               
							               });
						dataList[k].workUseYn = "Y";
					}else{
						if(msgVal==""){
	   						msgVal = dataList[k].ntwkLineNm;
	   					}else{
	   						msgVal += "," + dataList[k].ntwkLineNm;
	   					}
					}
		        	 rowSeletedIndex = dataList[k]._index.row;
		        	 rowSeletedColNm = "ntwkLineNm";
		        	 rowSeletedGrid  = gridId; 
				}
						httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getWorkCnvt', paramDataList, 'POST', 'workCnvt');
		    			if(msgVal != null && msgVal != ""){
		    				msgVal =  cflineMsgArray['lnNm']/*회선명*/ + makeArgMsg('preRegistration',"[" + [msgVal] + "]","","","")/* {0}는(은) 이미 작업정보로 등록되었습니다. */;
		    			}	
 	 		}else{
 	 			alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
 	 		}
    	
    }
    
    //작업정보완료, 모든작업정보완료
    function fnWorkInfoFnsh(isAll){
    	if( $('#'+gridIdWork).length == 0) return;
    	
    	var dataList = $('#'+gridIdWork).alopexGrid('dataGet', {_state: {selected:true}});
    	dataList = AlopexGrid.currentData(dataList);
    	
    	if (dataList.length > 0 ){
    		if(fnVaildation(dataList)){
    			var setTdmChgUserId = "";
    			var updateList = $.map(dataList, function(data){
    				if (nullToEmpty(data.tdmUseYn) != ""){
    					setTdmChgUserId = data.lastChgUserId;    
    				}
    				var saveParam = {
						  "ntwkLineNo":data.ntwkLineNo
						, "ntwkLineNm":data.ntwkLineNm
						, "lastChgUserId":data.lastChgUserId
						, "trkRoleDivCd":data.trkRoleDivCd
						, "mgmtGrpCd":data.mgmtGrpCd
						, "ntwkCapaCd":data.ntwkCapaCd
						, "ntwkRmkOne":data.ntwkRmkOne
						, "ntwkRmkTwo":data.ntwkRmkTwo
						, "ntwkRmkThree":data.ntwkRmkThree
						, "tdmUseYn":data.tdmUseYn
						, "tdmRsnCtt":data.tdmRsnCtt
						, "tdmChgUserId":setTdmChgUserId
    				};
    				return saveParam;
    			});
    			
    			var param = {"finishAll" : isAll, "updateTrunkList" : updateList };
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/workInfoFinish', param, 'POST', 'workInfoFinish');
    		}
    	}else{
    		alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
    	}
    }
    
    function fnVaildation(dataList){
    	var msgStr = "";
    	var validate = true;
		var requiredColumn = { ntwkLineNm : cflineMsgArray['trunkNm']
							 , ntwkCapaCd : cflineMsgArray['capacity'] };
    	for(var i=0; i<dataList.length; i++){
    		$.each(requiredColumn, function(key,val){
    			var value = eval("dataList[i]" + "." + key);
    			if(nullToEmpty(value) == ""){
    				msgStr = "<br>"+dataList[i].ntwkLineNo + " : " + val;
    				validate = false;
    				return validate;
    			}
         	});
    		
    		if(!validate){
        		alertBox('W', makeArgMsg('required',msgStr,"","","")); /* 필수 입력 항목입니다.[{0}] */
        		$('#'+gridWorkId).alopexGrid("startEdit");
        		return validate;
    		}
    	}
    	return validate;
    }
    
    //배치실행
    function funExcelBatchExecute(){
    	
    	cflineShowProgressBody();
    	cflineShowProgress(gridId);
    	cflineShowProgress(gridIdWork);
    	
      	 var topMtsoIdList = [];
   		if (nullToEmpty( $("#topMtsoId").val() )  != ""  ){
   			topMtsoIdList =   $("#topMtsoId").val() ;	
   		}else{
   			//topMtsoIdList = [];
   		}
   		
   		var dataParam =  $("#searchForm").getData();
   		
        	$.extend(dataParam,{topMtsoIdList: topMtsoIdList });
        	var sAllPass = false ;
        	if ($("input:checkbox[id='sAllPass']").is(":checked") ){
        		sAllPass = true; 
        	}
        	$.extend(dataParam,{sAllPass: sAllPass });
        	
        	var sWorkGrpWhereUse = false ;
        	if ($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked") ){
        		sWorkGrpWhereUse = true; 
        	}
        	$.extend(dataParam,{sWorkGrpWhereUse: sWorkGrpWhereUse });
        	
        	var appltYn = false ;
        	if ($("input:checkbox[id='appltYn']").is(":checked") ){
        		appltYn = true; 
        	}
        	$.extend(dataParam,{appltYn: appltYn });
        	
        	$.extend(dataParam,{topoLclCd: "002" });
        	$.extend(dataParam,{topoSclCd: "100" });
        	var stabIndex = $('#basicTabs').getCurrentTabIndex();
      	 
      	 if (stabIndex =="0"){
      		dataParam = gridExcelColumn(dataParam, gridId);
         	}else if (stabIndex =="1"){
         		dataParam = gridExcelColumn(dataParam, gridIdWork);
         	}
        	
        	var replaceColumn = {"ntwkCapaCd" : "ntwkCapaCdNm"};

			$.each(replaceColumn, function(key,val){
				dataParam.excelHeaderCd = dataParam.excelHeaderCd.replace(key, val);         		
			})

        	
        	dataParam.fileExtension = "xlsx";
        	dataParam.excelPageDown = "N";
        	dataParam.excelUpload = "N";
        	
        	
        	if (stabIndex =="0"){
        		dataParam.method = "trunkInfo";
        		dataParam.fileName = "트렁크정보";
        	}else if (stabIndex =="1"){
        		dataParam.method = "trunkWorkInfo";
        		dataParam.fileName = "트렁크작업정보";
        	}
        	cflineShowProgressBody();
        	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
    //배치상태확인
    function funExcelBatchExecuteStatus(){
 		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/excelBatchExecuteStatus/'+jobInstanceId,null , 'GET', 'excelBatchExecuteStatus');
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
  
    
    function setGrid(first01, last01,first02, last02,sType) {
       
		if( first01 == "1" && last01 =="200" && first02 == "1" && last02 =="200"){
			
			//초기 조회 일시 회선,작업 에 각각 첫번째 마지막 페이지에 값을 넣어준다 
			$("#firstRowIndex").val( parseInt(first01) );
			$("#lastRowIndex").val( parseInt(last01) );
			//회선 조회
			$("#firstRow01").val( parseInt(first01) );
			$("#lastRow01").val( parseInt(last01) );
			//작업조회 
			$("#firstRow02").val( parseInt(first02) );
			$("#lastRow02").val( parseInt(last02) );
			 
		}else{
			 if (sType == "A"){
				 
				 
					$("#firstRowIndex").val( parseInt($("#firstRowIndex").val())  + parseInt(first01)  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRowIndex").val())  + parseInt(last01)  ) ;	
					
					$("#firstRow01").val( 1  ) ;
					$("#lastRow01").val(  parseInt(last01)  ) ;	
					
					$("#firstRow02").val( 1  ) ;
					$("#lastRow02").val(  parseInt(last02)  ) ;	
				 
			 }else if (sType == "T"){
				 	
					$("#firstRow01").val( parseInt($("#firstRow01").val())  + parseInt(first01)  ) ;
					$("#lastRow01").val( parseInt($("#lastRow01").val())  + parseInt(last01)  ) ;	
					
					$("#firstRowIndex").val( parseInt($("#firstRow01").val())  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRow01").val())    ) ;						
				 				 
			 }else if (sType == "W"){
				 	
				    $("#firstRow02").val( parseInt($("#firstRow02").val())  + parseInt(first02)  ) ;
					$("#lastRow02").val( parseInt($("#lastRow02").val())  + parseInt(last02)  ) ;	
					
					$("#firstRowIndex").val( parseInt($("#firstRow02").val())  ) ;
					$("#lastRowIndex").val( parseInt($("#lastRow02").val())    ) ;						
				 			
				 
			 }
		}
		
		var topMtsoIdList = [];
		if (nullToEmpty( $("#topMtsoId").val() )  != ""  ){
			topMtsoIdList =   $("#topMtsoId").val() ;	
		}else{
			//topMtsoIdList = [];
		}
     	var param =  $("#searchForm").getData();
     	$.extend(param,{topMtsoIdList: topMtsoIdList });
     	var sAllPass = false ;
     	if ($("input:checkbox[id='sAllPass']").is(":checked") ){
     		sAllPass = true; 
     	}
     	$.extend(param,{sAllPass: sAllPass });
     	
     	var sWorkGrpWhereUse = false ;
     	if ($("input:checkbox[id='sWorkGrpWhereUse']").is(":checked") ){
     		sWorkGrpWhereUse = true; 
     	}
     	$.extend(param,{sWorkGrpWhereUse: sWorkGrpWhereUse });
     	
     	var appltYn = false ;
     	if ($("input:checkbox[id='appltYn']").is(":checked") ){
     		appltYn = true; 
     	}
     	$.extend(param,{appltYn: appltYn });
     	
     	
     	$.extend(param,{topoLclCd: "002" });
     	$.extend(param,{topoSclCd: "100" });

		  if (sType == "A"){
			 cflineShowProgressBody();
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getselectTrunkListAll', param, 'POST', 'searchA');
		 }else if (sType == "T"){
			 cflineShowProgress(gridId);
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getselectTrunkList', param, 'POST', 'searchT');
		 }else if (sType == "W"){
			 cflineShowProgress(gridIdWork);
			 httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getselectTrunkWorkList', param, 'POST', 'searchW');
		 }
		 
		 
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
 
	
    function setSPGrid(GridID,Option,Data) {
		
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
		
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		
	}
 
    function createGrid(mappingData , sTypes) {
    	var nodata= cflineMsgArray['noInquiryData'];
    	if(sTypes == "A" || sTypes == "T"){
	        //그리드 생성
    		emClass     = '' ;
    		
	        $('#'+gridId).alopexGrid({
	        	autoColumnIndex: true,
	    		autoResize: true,
	    		cellSelectable : false,
	    		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	    		rowClickSelect : true,
	    		rowSingleSelect : false,
	    		numberingColumnFromZero: false,
        		defaultColumnMapping:{sorting: true},
	    		message: {
					nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
				},
				columnMapping:  mappingData == null ? columnMapping() :  mappingData,
				rowOption:{inlineStyle: function(data,rowOption){
		    			if(data['workUseYn'] == 'Y' && data['workMgmtYn'] == 'Y') return {color:'red'} // background:'orange',
		    		}
		    	},
		    	
		    	// contextmenu
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    		            	   title: cflineMsgArray['workConvert'], /*"작업전환"*/
	    		            	   processor: function(data, $cell, grid) {
	    		            		   funWorkCnvt();
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    		            		   //return data._state.selected;
	    						    	var selectedData = $('#'+gridId).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	for(var i in selectedData){
	    						    		if ( nullToEmpty(selectedData[i].workMgmtYn) == "Y" && nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지" 
	    						    															&& nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지요청중"){
	    						    			returnValue = true;
	    						    			break;
	    						    		}
	    						    	}
	    						    	
	    						    	return returnValue;
	    		            	   }
	    		               }
	    		               /*
	    					    * 트렁크 상세정보
	    					    
	    					   {
	    		            	    title: '트렁크 상세정보',
	    						    processor: function(data, $cell, grid) {
	    						    	var rowIndex = data._index.row;
	    						    	var dataObj = AlopexGrid.trimData($('#'+gridId).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    						    	
	    						    	showTrunkInfoPop( gridId, dataObj ,"N");
	    						    }
	    					   }*/
	    		               ,{
		   							title: cflineMsgArray['acceptLine']+cflineMsgArray['list'] /* 수용회선목록*/,
		   						    processor: function(data, $cell, grid) { fnAcceptNtwkList(data); },
		   						    use: function(data, $cell, grid) {
		   						    	return true//data._state.selected;						    	
	   						    }
	   					   }
	    		               ]
			 });
        
    	}
    	if(sTypes == "A" || sTypes == "W"){
    		
    		emClass     = '<em class="color_red">*</em> ' ;
    		
	        //그리드 생성
	        $('#'+gridIdWork).alopexGrid({
	        	autoColumnIndex: true,
	        	autoResize: true,
	        	cellSelectable : false,
	        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	        	rowInlineEdit : true, //행전체 편집기능 활성화
	        	rowClickSelect : true,
	        	rowSingleSelect : false,
	        	numberingColumnFromZero: false,
	        	defaultColumnMapping:{sorting: true},
	        	message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+nodata+"</div>"
	    		},
	        	columnMapping: mappingData == null ? columnMapping() :  mappingData,  
	        	
	    		// contextmenu
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    							title: cflineMsgArray['workInfSave'],  /*작업정보저장*/
	    						    processor: function(data, $cell, grid) {
	    						    	funTrunkWorkUpdate();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	// ADAMS 연동 고도화
	    						    	if(data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001'){
	    						    		for(var i in selectedData){
		    						    		if ( nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지" && nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지요청중" ){
		    						    			returnValue = true;
		    						    			break;
		    						    		}
		    						    	}
	    						    	}else{
	    						    		returnValue = false;
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    	
	    						    }
	    					   },
	    		               { 
	    		            	   title: cflineMsgArray['workInfo'] + cflineMsgArray['finish'],   /*작업 정보 완료*/
	    		            	   processor: function(data, $cell, grid) {
	    		            		   fnWorkInfoFnsh(false);
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	// ADAMS 연동 고도화
	    						    	if(data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001'){
	    						    		for(var i in selectedData){
		    						    		if ( nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지" && nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지요청중" ){
		    						    			returnValue = true;
		    						    			break;
		    						    		}
		    						    	}
	    						    	}else{
	    						    		returnValue = false;
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    	
	    						    }
	    		               },
	    		               {
	    		            	   title: cflineMsgArray['AllWorkInfFnsh'],  /*"모든 작업 정보 완료"*/
	    		            	   processor: function(data, $cell, grid) {
	    		            		   fnWorkInfoFnsh(true);
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	// ADAMS 연동 고도화
	    						    	if(data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001'){
	    						    		for(var i in selectedData){
		    						    		if ( nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지" && nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지요청중" ){
		    						    			returnValue = true;
		    						    			break;
		    						    		}
		    						    	}
	    						    	}else{
	    						    		returnValue = false;
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    	
	    						    }
	    		               },
	    		               {
	    		            	   title: cflineMsgArray['trmn'], /*"해지"*/
	    		            	   processor: function(data, $cell, grid) {
	    		            		   funLineTrmn();
	    		            	   },
	    		            	   use: function(data, $cell, grid) {
	    						    	var selectedData = $('#'+gridIdWork).alopexGrid('dataGet', {_state:{selected:true}});
	    						    	var returnValue = false;
	    						    	// ADAMS 연동 고도화
//	    						    	if($('#ownCd').val()=='0002'){
	    						        if(data.mgmtGrpCd=='0001' && $('#ownCd').val()=='0001'){
	    						    		for(var i in selectedData){
		    						    		if ( nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지" && nullToEmpty(selectedData[i].ntwkStatCdNm) != "해지요청중" ){
		    						    			returnValue = true;
		    						    			break;
		    						    		}
		    						    	}
	    						    	}else{
	    						    		returnValue = false;
	    						    	}
	    						    	
	    						    	return returnValue;
	    						    	
	    						    }
	    		               }
	    		               /*
	    					    * 트렁크 상세정보
	    					    
	    					   {
	    		            	    title: '트렁크 상세정보',
	    						    processor: function(data, $cell, grid) {
	    						    	var rowIndex = data._index.row;
	    						    	var dataObj = AlopexGrid.trimData($('#'+gridIdWork).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    						    	
	    						    	showTrunkInfoPop( gridIdWork, dataObj ,"Y");
	    						    }
	    					   }
	    					   */
	    		               ]
	        }); 
	        
	    
    	}
      
        
    	$('#'+gridIdWork).alopexGrid("viewUpdate");    
      
    }
    
    function onloadMgmtGrpChange(){
    	changeMgmtGrp("ownCd", "orgCd", "teamCd", "topMtsoId", "mtso");
    }
    
  //수용목록
    function fnAcceptNtwkList(selectData){
    	var chkNtwkLine = [];
    	chkNtwkLine.push(selectData.ntwkLineNo);
    	var param = {
    					"ntwkLineNoList":chkNtwkLine
    				  , "topoLclCd":"002"
    				  , "title" : cflineMsgArray['acceptLine']+cflineMsgArray['list']
    				  , "callType":"S"   // S : 수용목록 조회
    	            };
    	$a.popup({
    			popid: "UsingInfoPop",
    			title: cflineMsgArray['acceptLine']+cflineMsgArray['list']  /*수용회선목록*/,
    			url: $('#ctx').val()+'/configmgmt/cfline/TrunkUsingInfoPop.do',
    			data: param,
    			iframe: true,
    			modal: true,
    			movable:true,
    		    windowpopup : true,
    			width : 1200,
    			height : 650,
    			callback:function(data){
    		    	//fnSearch("A", true);
    		    }
    		});
    }
    
});