/**
 * OneClickConfig.js
 *
 * @author P123512
 * @date 2018.09.19
 * @version 1.0
 * 
 * ************* 수정이력 ************
 * 2025-02-12  1. [수정] TIE조회후 편집모드 -> 다시 조회모드시 * 가 계속 붙어있어 엑셀업로드시 문제발생 수정
 *                      조회시 전 데이터가 조회되어 표시되기 때문에 스크롤이 필요없음
 */


var whole = cflineCommMsgArray['all'] /* 전체 */;
var currentTabIdx = 0 ;
var currentTab = "dataGridACS" ;

var mtsoIdACS = null;
var mtsoIdSR = null;
var mtsoIdDC = null;
var mtsoIdTM = null;
var mtsoIdRME = null;
var locEqp = null;
var locPort = null;

var dcsConnTypComboList = [];
var dcsConnTypList = [];
var tmofDataList = [];
var tmofCd = $('#tmofCd0').val();
var dataACS = null;
var dataSR = null;
var dataKtE = null;
var dataDC = null;
var dataTM = null;
var dataRME = null;
var paramT = null;
var totalCntDC = 0;
var totalCntACS = 0;
var totalCntSR = 0;
var totalCntKtE = 0;
var totalCntTM = 0;
var totalCntRME = 0 ;

var totalCntTM2 = 0;


var gridIdscrollBottom = true;
var searchYn   = false ;
var pageForCount = 200;
var addData = false;

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var dataGridDC = "dataGridDC";
	var dataGridACS = "dataGridACS";
	var dataGridSR = "dataGridSR";
	var dataGridKtE = "dataGridKtE";
	var dataGridTM = "dataGridTM";
	var dataGridRME = "dataGridRME";
	
	var isEditing = false;
	var updateKtEList = null;   // 영문변환
	var updateSRList = null;    //SNCP_RT
	var updateACSList = null;   //AON/con/SNCP
	var updateDCList = null;    //DCS간연동
	var updateTMList = null;    //TIE관리
	var updateRMEList = null;   //RM관리장비정보
	var columnACS = columnMapping("dataGridACS");
	var columnACSWork = columnMapping("dataGridACSWork");
	var columnSR = columnMapping("dataGridSR");
	var columnSRWork = columnMapping("dataGridSRWork");
	var columnKtE = columnMapping("dataGridKtE");
	var columnKtEWork = columnMapping("dataGridKtEWork");
	var columnDC = columnMapping("dataGridDC");
	var columnDCWork = columnMapping("dataGridDCWork");
	var columnTM = columnMapping("dataGridTM");
	var columnTMWork = columnMapping("dataGridTMWork");
	var columnRME = columnMapping("dataGridRME");
	var columnRMEWork = columnMapping("dataGridRMEWork");
	
    this.init = function(id, param) {
    	btnHide();
    	tabHide();
    	setSelectCode();
    	$('#btnExportExcel').setEnabled(false);
 		getGrid("All");
        setEventListener();
        setComboReadOnly();
        $("#firstRowIndex").val( parseInt("0")  ) ;
		$("#lastRowIndex").val( parseInt("0")    ) ;
     
    };
    
    function tabHide() {
    	$(".SR").hide();
    	$(".KTE").hide();
    	$(".DC").hide();
    	$(".TM").hide();
    	$(".RME").hide();
    }
    
    function btnHide() {
    	$('#btnAddRow').hide();
    	$('#btnSave').hide();
    	$('#btnDelete').hide();
    	$('#btnCancel').hide();
    }
    
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/030001', null, 'GET', 'tmofCmCdData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C01532', null, 'GET', 'C01532Data');
    }
    
    function columnMapping(sType) {
    	var mapping = [];
    	if(sType == "dataGridACS" ||  sType =="dataGridACSWork") {
    		var em = '';
    		if(sType == "dataGridACSWork") {
    			em = '<em class="color_red">*</em>';
    			mapping.push({ selectorColumn : true, width : '50px' } );
    		}
    		var extendMapping = [
    	  			          {key : 'ordRow',			    	align:'center',			width:'70px',		title : cflineMsgArray['sequence']					/* 순번 */ }
    	  			        , {key : 'existData',			    align:'center',			width:'70px',		hidden : true										/* 기존데이터 여부 */ }
    	  			        , {key : 'seq',				align:'right',			width:'90px',		title : "seq"	,   hidden : true	 /*시퀀스*/ }			
    	  			        , {key : 'eqpId',				align:'right',			width:'90px',		title : "eqpId"	,   hidden : true	  }
    	 					, {key : 'eqpNm',					align:'left',		    width:'130px',		title : em+cflineMsgArray['equipment']  ,editable:{type:"text"}				/* 장비 */}
    	 					, {key : 'portId',				align:'right',			width:'90px',		title : "portId"	,   hidden : true	  }
    	 					, {key : 'portNm',						align:'left',			width:'130px',		title : em+cflineMsgArray['portEng'],editable:{type:"text"}					/* Port */}
    	 					, {key : 'eqpPortChnlVal',						align:'left',			width:'110px',		title : cflineMsgArray['channel']	,editable:{type:"text"}					/* Channel */}
    	 					, {key : 'dcsConnTypCd',						align:'center',			width:'100px',		title : em+cflineMsgArray['type']	,editable:{type:"text"}	,					/* Type */
	    	 					render : {
				      	    		type : 'string',
				      	    		rule : function(value, data) {
				      	    			if(sType !=  'dataGridACSWork'){
				      	    				var render_data = [];
					      	    			if(dcsConnTypList.length > 1) {
					      	    				return render_data = render_data.concat(dcsConnTypList);
					      	    			}else {
					      	    				return render_data.concat({value : data.dcsConnTypCd, text : data.dcsConnTypNm });
					      	    			}
				      	    			} else {
				      	    				var render_data = [];
				      	    				render_data = render_data.concat(dcsConnTypList);
				      	    				return render_data;
				      	    			}
				      	    		}	
								},
								editable:{
				      	    		type:"select", 
				      	    		rule : function(value, data){
				      	    			var render_data = [];
			      	    				render_data = render_data.concat(dcsConnTypList);
			      	    				return render_data;
				      	    		}, attr : {
			  			 				style : "width: 115px;min-width:115px;padding: 2px 2px;"
			  			 			}
				      	    	},
				  				editedValue : function(cell) {
				  					return $(cell).find('select option').filter(':selected').val(); 
				  				}
    	 					}
    	 					, {key : 'userLablNm',						align:'left',			width:'220px',		title : em+"User_Name"  		,editable:{type:"text"}						/* User_Name */}
    	 					, {key : 'protLablNm',						align:'left',			width:'210px',		title : "Protection"		,editable:{type:"text"}						/* Protection */}
    				];
    		for(var i = 0 ; i < extendMapping.length; i++ ) {
    			mapping.push(extendMapping[i]);
    		}
    	} else if(sType == "dataGridSR" || sType == "dataGridSRWork") {
    		var em = '';
    		if(sType == "dataGridSRWork") {
    			em = '<em class="color_red">*</em>';
    			mapping.push({ selectorColumn : true, width : '50px' } );
    		}
    		var extendMapping = [
      		                 {key : 'ordRow',			    	align:'center',			width:'70px',		title : cflineMsgArray['sequence']					/* 순번 */ }
      		                , {key : 'existData',			    align:'center',			width:'70px',		hidden : true										/* 기존데이터 여부 */ }
      		                , {key : 'seq',						align:'right',			width:'90px',		title : "seq"	,   hidden : true					 /*시퀀스*/ }
	  						, {key : 'ntwkLineNm',	      		align:'left',		   	width:'130px',		title : em+cflineMsgArray['at622mRingName']/* AT622M링 */, 			editable:{type:"text"}}
	  						, {key : 'eqpTid',					align:'left',			width:'170px',		title : em+"RT_ename"/* RT_ename*/,			editable:{type:"text"}}
	  						, {key : 'eqpNm',					align:'left',			width:'170px',		title : em+"RT_kname"/* RT_kname*/ ,		editable:{type:"text"}}
	  						, {key : 'vtulEqpNm',					align:'left',			width:'170px',		title : "Virtual_Name"/* Virtual_Name*/ ,		editable:{type:"text"}}
	  						, {key : 'portRmk',					align:'left',			width:'170px',		title : "Virtual_Port"/* Virtual_Port*/ ,		editable:{type:"text"}}
	  						, {key : 'protLablNm',					align:'left',			width:'170px',		title : "Protection"/* Protection*/ ,		editable:{type:"text"}}
	  						
      		           ]
    		for(var i = 0 ; i < extendMapping.length; i++ ) {
    			mapping.push(extendMapping[i]);
    		}
    	} else if(sType == "dataGridKtE" || sType == "dataGridKtEWork") {
    		var em = '';
    		if(sType == "dataGridKtEWork") {
    			em = '<em class="color_red">*</em>';
    			mapping.push({ selectorColumn : true, width : '50px' } );
    		}
    		var extendMapping = [
    		                     {key : 'ordRow',			    	align:'center',			width:'70px',		title : cflineMsgArray['sequence']				/* 순번 */ }
    		                     , {key : 'existData',			    align:'center',			width:'70px',		hidden : true										/* 기존데이터 여부 */ }
    	    		  		     , {key : 'hanVal',					align:'left',			width:'90px',		title : em+cflineMsgArray['hangul']	,editable:{type:"text"}		,			/* 한글*/
			    		  		    	allowEdit : function(value, data, mapping){
			      							if(nullToEmpty(data.existData) == "") {
			      								return true;
			      							} else{
			      								return false;
			      							}
				      					}	   
    	    		  		      }
    	    		  		      , {key : 'enghVal',					align:'left',			width:'90px',		title : cflineMsgArray['english']	,editable:{type:"text"}					/* 영문*/ }
      		           ]
    		for(var i = 0 ; i < extendMapping.length; i++ ) {
    			mapping.push(extendMapping[i]);
    		}
    	} else if(sType == "dataGridDC" || sType == "dataGridDCWork") {
    		var em = '';
    		if(sType == "dataGridDCWork") {
    			em = '<em class="color_red">*</em>';
    			mapping.push({ selectorColumn : true, width : '50px' } );
    		}
    		var extendMapping = [
    		                  {key : 'ordRow',			    align:'center',			width:'70px',		title : cflineMsgArray['sequence']					/* 순번 */ }
    		                , {key : 'existData',			    align:'center',			width:'70px',		hidden : true										/* 기존데이터 여부 */ }
    		                , {key : 'seq',				align:'right',			width:'90px',		title : "seq"	,   hidden : true	 /*시퀀스*/ }
    		                , {key : 'eqpId1',				align:'right',			width:'90px',		title : "eqpId1"	,   hidden : true	  }
    						, {key : 'eqpNm1',	      		align:'left',		   	width:'130px',		title : em+cflineMsgArray['equipment']+"1"				,editable:{type:"text"}							/* 장비1 */ }
    						, {key : 'lftPortId1',				align:'right',			width:'90px',		title : "lftPortId1"	,   hidden : true	  }
    						, {key : 'lftPortNm1',					align:'left',			width:'170px',		title : "APORT1"		,editable:{type:"text"}								/* APORT1*/ }
    						, {key : 'lftPortChnlVal1',					align:'left',			width:'120px',		title : "APORT1_CHNL"	,editable:{type:"text"}							/* APORT1_CHNL*/ }
    						, {key : 'rghtPortId1',				align:'right',			width:'90px',		title : "rghtPortId1"	,   hidden : true	  }
    						, {key : 'rghtPortNm1',					align:'left',			width:'170px',		title : "BPORT1"	,editable:{type:"text"}									/* BPORT1*/ }
    						, {key : 'rghtPortChnlVal1',			align:'left',			width:'120px',		title : "BPORT1_CHNL"	,editable:{type:"text"}							/* BPORT1_CHNL*/ }
    						, {key : 'eqpId2',				align:'right',			width:'90px',		title : "eqpId2"	,   hidden : true	  }
    						, {key : 'eqpNm2',	      		align:'left',		   	width:'130px',		title : em+cflineMsgArray['equipment']+"2"				,editable:{type:"text"}							/* 장비2*/ }
    						, {key : 'lftPortId2',				align:'right',			width:'90px',		title : "lftPortId2"	,   hidden : true	  }
    						, {key : 'lftPortNm2',					align:'left',			width:'170px',		title : "APORT2"		,editable:{type:"text"}								/* APORT2*/ }
    						, {key : 'lftPortChnlVal2',			align:'left',			width:'120px',		title : "APORT2_CHNL"	,editable:{type:"text"}							/* APORT2_CHNL*/ }
    						, {key : 'rghtPortId2',				align:'right',			width:'90px',		title : "rghtPortId2"	,   hidden : true	  }
    						, {key : 'rghtPortNm2',					align:'left',			width:'170px',		title : "BPORT2"		,editable:{type:"text"}								/* BPORT2*/ }
    						, {key : 'rghtPortChnlVal2',			align:'left',			width:'120px',		title : "BPORT2_CHNL"	,editable:{type:"text"}							/* BPORT2_CHNL*/ }
      		           ]
    		for(var i = 0 ; i < extendMapping.length; i++ ) {
    			mapping.push(extendMapping[i]);
    		}
    	}  else if(sType == "dataGridTM" || sType == "dataGridTMWork") {
    		var em = '';
    		if(sType == "dataGridTMWork") {
    			em = '<em class="color_red">*</em>';
    			mapping.push({ selectorColumn : true, width : '50px' } );
    		}
    		var extendMapping = [
    		                  {key : 'ordRow',			    	align:'center',			width:'70px',		title : cflineMsgArray['sequence']				/* 순번 */ }
    		                , {key : 'existData',			    align:'center',			width:'70px',		hidden : true									/* 기존데이터 여부 */ }
    		                , {key : 'tieVal',					align:'left',			width:'120px',		title : em+"TIE"	,editable:{type:"text"}	,		/* TIE*/ 
	    		                allowEdit : function(value, data, mapping){
	      							if(nullToEmpty(data.existData) == "") {
	      								return true;
	      							} else{
	      								return false;
	      							}
		      					}
    		                }
    		                , {key : 'ntwkLineNo',				align:'right',			width:'90px',		hidden : true	 								/*네트워크회선번호*/ }
    		                , {key : 'ntwkLineNm',				align:'left',			width:'150px',		title : em+cflineMsgArray['trkName']/*"트렁크명"*/	 , 	editable:{type:"text"},						/* 트렁크명 */
    		                	allowEdit : function(value, data, mapping){
	      							if(nullToEmpty(data.existData) == "") {
	      								return true;
	      							} else{
	      								return false;
	      							}
		      					}		
    		                }
    						, {key : 'eqpId',	      			align:'left',		   	width:'130px',		hidden : true									/* 장비ID */ }
    						, {key : 'eqpNm',					align:'left',			width:'90px',		title : em+cflineMsgArray['equipmentName']/*"장비명"*/	,     	editable:{type:"text"},							/* 장비명 */	  
    							allowEdit : function(value, data, mapping){
	      							if(nullToEmpty(data.existData) == "") {
	      								return true;
	      							} else{
	      								return false;
	      							}
		      					}		
    						}
    						, {key : 'portId',	      			align:'left',		   	width:'130px',		hidden : true									/* 포트ID */ }
    						, {key : 'tmpPortNm',	      		align:'left',		   	width:'130px',		hidden : true									/* tmp포트명값 */ }
    						, {key : 'portChnlVal',	      		align:'left',		   	width:'130px',		hidden : true									/* 포트채널값 */ }
    						, {key : 'portNm',					align:'left',			width:'100px',		title : em+cflineMsgArray['portName']/*"포트명"*/		,	editable:{type:"text"},							/* 포트명*/ 
    							allowEdit : function(value, data, mapping){
	      							if(nullToEmpty(data.existData) == "") {
	      								return true;
	      							} else{
	      								return false;
	      							}
		      					}		
    						}
    						, {key : 'chnlVal',					align:'left',			width:'100px',		title : cflineMsgArray['channel']/*"채널"*/	,		editable:{type:"text"},							/* 채널값*/ 
    							allowEdit : function(value, data, mapping){
	      							if(nullToEmpty(data.existData) == "") {
	      								return true;
	      							} else{
	      								return false;
	      							}
		      					}		
    						}
    						, {key : 'aonEqpId',	      		align:'left',		   	width:'130px',		hidden : true									/* AON장비ID */ }
    						, {key : 'aonEqpNm',				align:'left',			width:'90px',		title : cflineMsgArray['aonEquipmentName']	,   editable:{type:"text"}	/* AON장비명  */ }
    						, {key : 'aonPortId',	      		align:'left',		   	width:'130px',		hidden : true									/* AON포트ID */ }
    						, {key : 'aonPortNm',				align:'left',			width:'90px',		title : cflineMsgArray['aonPortName']	,   editable:{type:"text"}	/* AON포트명  */ }
    						, {key : 'lineRmkOne',				align:'left',			width:'90px',		title : "ETC1"	,   	editable:{type:"text"}	/* etc1 */ }
    						, {key : 'lineRmkTwo',				align:'left',			width:'90px',		title : "ETC2"	,   	editable:{type:"text"}	/* etc2 */ }
    						, {key : 'lineRmkThree',			align:'left',			width:'90px',		title : "ETC3"	,   	editable:{type:"text"}	/* etc3 */ }
      		           ]
    		for(var i = 0 ; i < extendMapping.length; i++ ) {
    			mapping.push(extendMapping[i]);
    		}
    	}  else if(sType == "dataGridRME" || sType == "dataGridRMEWork") {
    		var em = '';
    		if(sType == "dataGridRMEWork") {
    			em = '<em class="color_red">*</em>';
    			mapping.push({ selectorColumn : true, width : '50px' } );
    		}
    		var extendMapping = [
    		                  {key : 'ordRow',			    	align:'center',			width:'70px',		title : cflineMsgArray['sequence']				/* 순번 */ }
    		                , {key : 'existData',			    align:'center',			width:'70px',		hidden : true									/* 기존데이터 여부 */ }
    		                , {key : 'eqpId',				align:'right',			width:'90px',		hidden : true	 								/*장비id*/ }
    		                , {key : 'eqpNm',				align:'left',			width:'150px',		title : em+cflineMsgArray['equipmentName']/*"장비명"*/	 , 	editable:{type:"text"},						/*장비명 */
    		                	allowEdit : function(value, data, mapping){
	      							if(nullToEmpty(data.existData) == "") {
	      								return true;
	      							} else{
	      								return false;
	      							}
		      					}		
    		                }
    						, {key : 'eqpTid',					align:'left',			width:'90px',		title : cflineMsgArray['equipmentTargetId']/* 장비TID */	  }
      		           ]
    		for(var i = 0 ; i < extendMapping.length; i++ ) {
    			mapping.push(extendMapping[i]);
    		}
    	}
		return mapping;
    }
    
    function setEventListener() {
    	// 탭 선택 이벤트
   	 	$("#basicTabs").on('tabchange', function(e, index) {
   	 		tabChange(index);
   	 	});    
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 if(currentTabIdx == 0) {
    			 mtsoIdACS = $('#tmofCd0').val();
        	 }else if(currentTabIdx == 1 ){
        		 mtsoIdSR = $('#tmofCd1').val();
        	 }else if(currentTabIdx == 3 ){
        		 mtsoIdDC = $('#tmofCd3').val();
        	 }else if(currentTabIdx == 4 ){
        		 mtsoIdTM = $('#tmofCd4').val();
        	 }else if(currentTabIdx == 5 ){
        		 mtsoIdRME = $('#tmofCd5').val();
        	 }
    		 searchProc("F");   
         });		

         //tab1 장비명 입력시 (AON/con/SNCP)
     	 $('#acsEqpNm').on('input', function(e) {
     		 if($('#acsEqpNm').val() == '' || $('#acsEqpNm').val() == null ) {
     		  	 $('#acsPortNm').attr("readonly",true);
     			 $('#acsPortNm').css("background-color","silver");
     			 $('#acsPortNm').val(null);
     			 $('#acsChnlNm').attr("readonly",true);
    			 $('#acsChnlNm').css("background-color","silver");
    			 $('#acsChnlNm').val(null);
     		 } else {
     			 $('#acsPortNm').attr("readonly",false);
     			 $('#acsPortNm').css("background-color","white");
     		 }
     	 });
     	 
     	 //tab1 포트명 입력시 (AON/con/SNCP)
     	 $('#acsPortNm').on('input', function(e) {
     		 if($('#acsPortNm').val() == '' || $('#acsPortNm').val() == null ) {
     		  	 $('#acsChnlNm').attr("readonly",true);
     			 $('#acsChnlNm').css("background-color","silver");
     			 $('#acsChnlNm').val(null);
     		 } else {
     			 $('#acsChnlNm').attr("readonly",false);
     			 $('#acsChnlNm').css("background-color","white");
     		 }
     	 });
     	 
     	//tab4 장비명1  입력시 (DCS간연동)
     	 $('#eqp1Nm').on('input', function(e) {
     		 if($('#eqp1Nm').val() == '' || $('#eqp1Nm').val() == null ) {
     		  	 $('#aPortNm1').attr("readonly",true);
     			 $('#aPortNm1').css("background-color","silver");
     			 $('#aPortNm1').val(null);
     			 $('#bPortNm1').attr("readonly",true);
    			 $('#bPortNm1').css("background-color","silver");
    			 $('#bPortNm1').val(null);
    			 $('#aPortChnl1').attr("readonly",true);
    			 $('#aPortChnl1').css("background-color","silver");
    			 $('#aPortChnl1').val(null);
    			 $('#bPortChnl1').attr("readonly",true);
    			 $('#bPortChnl1').css("background-color","silver");
    			 $('#bPortChnl1').val(null);
     		 } else {
     			 $('#aPortNm1').attr("readonly",false);
     			 $('#aPortNm1').css("background-color","white");
     			 $('#bPortNm1').attr("readonly",false);
    			 $('#bPortNm1').css("background-color","white");
     		 }
     	 });
     	 
     	//tab4 장비명2 입력시 (DCS간연동)
     	 $('#eqp2Nm').on('input', function(e) {
     		 if($('#eqp2Nm').val() == '' || $('#eqp2Nm').val() == null ) {
     		  	 $('#aPortNm2').attr("readonly",true);
     			 $('#aPortNm2').css("background-color","silver");
     			 $('#aPortNm2').val(null);
     		  	 $('#bPortNm2').attr("readonly",true);
     			 $('#bPortNm2').css("background-color","silver");
     			 $('#bPortNm2').val(null);
     			 $('#aPortChnl2').attr("readonly",true);
	   			 $('#aPortChnl2').css("background-color","silver");
	   			 $('#aPortChnl2').val(null);
	   			 $('#bPortChnl2').attr("readonly",true);
	   			 $('#bPortChnl2').css("background-color","silver");
	   			 $('#bPortChnl2').val(null);
     		 } else {
     			 $('#aPortNm2').attr("readonly",false);
     			 $('#aPortNm2').css("background-color","white");
     			 $('#bPortNm2').attr("readonly",false);
    			 $('#bPortNm2').css("background-color","white");
     		 }
     	 });
     	 
     	//tab4 A포트명1 입력시 (DCS간연동)
     	 $('#aPortNm1').on('input', function(e) {
     		if($('#aPortNm1').val() == '' || $('#aPortNm1').val() == null ) {
    		  	 $('#aPortChnl1').attr("readonly",true);
    			 $('#aPortChnl1').css("background-color","silver");
    			 $('#aPortChnl1').val(null);
    		 } else {
    			 $('#aPortChnl1').attr("readonly",false);
    			 $('#aPortChnl1').css("background-color","white");
    		 }
     	 });
     	 
     	//tab4 A포트명2 입력시 (DCS간연동)
     	 $('#aPortNm2').on('input', function(e) {
     		if($('#aPortNm2').val() == '' || $('#aPortNm2').val() == null ) {
     			$('#aPortChnl2').attr("readonly",true);
     			$('#aPortChnl2').css("background-color","silver");
     			$('#aPortChnl2').val(null);
     		} else {
     			$('#aPortChnl2').attr("readonly",false);
     			$('#aPortChnl2').css("background-color","white");
     		}
     	 });
     	 
     	//tab4 B포트명1 입력시  (DCS간연동)
     	 $('#bPortNm1').on('input', function(e) {
     		if($('#bPortNm1').val() == '' || $('#bPortNm1').val() == null ) {
     			$('#bPortChnl1').attr("readonly",true);
     			$('#bPortChnl1').css("background-color","silver");
     			$('#bPortChnl1').val(null);
     		} else {
     			$('#bPortChnl1').attr("readonly",false);
     			$('#bPortChnl1').css("background-color","white");
     		}
     	 });
     	 
     	//tab4 B포트명2 입력시   (DCS간연동)
     	 $('#bPortNm2').on('input', function(e) {
     		if($('#bPortNm2').val() == '' || $('#bPortNm2').val() == null ) {
     			$('#bPortChnl2').attr("readonly",true);
     			$('#bPortChnl2').css("background-color","silver");
     			$('#bPortChnl2').val(null);
     		} else {
     			$('#bPortChnl2').attr("readonly",false);
     			$('#bPortChnl2').css("background-color","white");
     		}
     	 });
     	 
     	 //tab5 장비명 입력시 ( TIE관리 )
     	 $('#eqpNm').on('input', function(e) {
     		 if($('#eqpNm').val() == '' || $('#eqpNm').val() == null ) {
     		  	 $('#portNm').attr("readonly",true);
     			 $('#portNm').css("background-color","silver");
     			 $('#portNm').val(null);
    			 $('#chnlVal').attr("readonly",true);
    			 $('#chnlVal').css("background-color","silver");
    			 $('#chnlVal').val(null);
     		 } else {
     			 $('#portNm').attr("readonly",false);
     			 $('#portNm').css("background-color","white");
     		 }
     	 });
     	  
     	//tab5 포트명 입력시 ( TIE관리 )
     	 $('#portNm').on('input', function(e) {
     		 if($('#portNm').val() == '' || $('#portNm').val() == null ) {
     		  	 $('#chnlVal').attr("readonly",true);
     			 $('#chnlVal').css("background-color","silver");
     			 $('#chnlVal').val(null);
     		 } else {
     			 $('#chnlVal').attr("readonly",false);
     			 $('#chnlVal').css("background-color","white");
     		 }
     	 });
     	 
     	//tab5 AON장비명 입력시  ( TIE관리 )
     	 $('#aonEqpNm').on('input', function(e) {
     		 if($('#aonEqpNm').val() == '' || $('#aonEqpNm').val() == null ) {
     		  	 $('#aonPortNm').attr("readonly",true);
     			 $('#aonPortNm').css("background-color","silver");
     			 $('#aonPortNm').val(null);
     		 } else {
     			 $('#aonPortNm').attr("readonly",false);
     			 $('#aonPortNm').css("background-color","white");
     		 }
     	 });
     	 
         
         //편집
         $('#btnRegEqp').on('click', function(e){
			 if(currentTabIdx == 0) {
				 $('#tmofCd0').setSelected(mtsoIdACS);
				 $('#tmofCd0').setEnabled(false);
			 }else if(currentTabIdx == 1 ){
				 $('#tmofCd1').setSelected(mtsoIdSR);
				 $('#tmofCd1').setEnabled(false);
			 }else if(currentTabIdx == 3 ){
				 $('#tmofCd3').setSelected(mtsoIdDC);
				 $('#tmofCd3').setEnabled(false);
			 }else if(currentTabIdx == 4 ){
				 $('#tmofCd4').setSelected(mtsoIdTM);
				 $('#tmofCd4').setEnabled(false);
			 }else if(currentTabIdx == 5 ){
				 $('#tmofCd5').setSelected(mtsoIdRME);
				 $('#tmofCd5').setEnabled(false);
			 }
        	 
			$('#btnExportExcel').setEnabled(false);
			isEditing = true;
			var btnShowArray = ['btnAddRow','btnSave', 'btnDelete','btnCancel']; // 행추가 , 저장 , 삭제 , 취소
			var btnHideArray = ['btnRegEqp'];
			editRow(btnShowArray, btnHideArray);
         });
         
         //엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 cflineShowProgressBody();
        	 excelDownload();
         });
         
         // 엑셀업로드
         $('#btnAddExcel').on('click', function(e) {
        	 //tmofDataList
        	 var paramData = {"tmofList": tmofDataList};
        	 var tmofCd = "";
        	 var uprComCdVal = "";
        	 if(currentTabIdx == 0) {
        		 uprComCdVal = "01";
        		 tmofCd = $('#tmofCd0').val();
        	 }else if(currentTabIdx == 1 ){
        		 uprComCdVal = "02";
        		 tmofCd = $('#tmofCd1').val();
        	 }else if(currentTabIdx == 2 ){
        		 uprComCdVal = "03";
        	 }else if(currentTabIdx == 3 ){
        		 uprComCdVal = "04";
        		 tmofCd = $('#tmofCd3').val();
        	 }else if(currentTabIdx == 4 ){
        		 uprComCdVal = "05";
        		 tmofCd = $('#tmofCd4').val();
        	 }else if(currentTabIdx == 5 ){
        		 uprComCdVal = "06";
        		 tmofCd = $('#tmofCd5').val();
        	 }
        	 paramData.cnfgCtnt = uprComCdVal;
        	 paramData.tmofCd = tmofCd;
        	 
        	 $a.popup({
        		 popid: 'OneClickConfigExcelUploadPop',
        		 title: cflineMsgArray['oneClickEnvmEstlmExcelUpload'], /*'OneClick환경설정 엑셀업로드'*/
        		 iframe: true,
        		 modal : false,
        		 windowpopup : true,
        		 url: $('#ctx').val() +'/configmgmt/oneclickconfig/OneClickConfigExcelUploadPop.do',
        		 data: paramData, 
        		 width : 620,
        		 height : 370 
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
         
       //콤보박스 엔터 이벤트
      	$('#searchForm').on('keydown', function(e){
      		if (e.which == 13  ){
      			/*addData = false;
      			setGrid(1,pageForCount,"All");*/
      			if(currentTabIdx == 4 ) {
      				addData = false;
        		 	setGrid(1,pageForCount);
      			} else {
      				searchProc("F");	
      			}
      			
      		}
      		
      	});
   
         
         //행추가
         $('#btnAddRow').on('click', function(e){
        	 var addData = {};
        	 $("#"+currentTab).alopexGrid('dataAdd', $.extend({_state:{editing:true}}, addData), {_index:{row:0}});
        	 if(currentTabIdx == 0 ) {
        		 totalCntACS = totalCntACS + 1 ;
        		 $('#'+currentTab).alopexGrid( "cellEdit", totalCntACS, {_index : { row : 0}}, "ordRow");	 
        	 } else if(currentTabIdx == 1 ){
        		 totalCntSR = totalCntSR + 1 ;
        		 $('#'+currentTab).alopexGrid( "cellEdit", totalCntSR, {_index : { row : 0}}, "ordRow");
        	 } else if(currentTabIdx == 2 ){
        		 totalCntKtE = totalCntKtE + 1 ;
        		 $('#'+currentTab).alopexGrid( "cellEdit", totalCntKtE, {_index : { row : 0}}, "ordRow");
        	 } else if(currentTabIdx == 3 ){
        		 totalCntDC = totalCntDC + 1 ;
        		 $('#'+currentTab).alopexGrid( "cellEdit", totalCntDC, {_index : { row : 0}}, "ordRow");
        	 } else if(currentTabIdx == 4 ){
        		 totalCntTM = totalCntTM + 1 ;
        		 $('#'+currentTab).alopexGrid( "cellEdit", totalCntTM, {_index : { row : 0}}, "ordRow");
        	 } else if(currentTabIdx == 5 ){
        		 totalCntRME = totalCntRME + 1 ;
        		 $('#'+currentTab).alopexGrid( "cellEdit", totalCntRME, {_index : { row : 0}}, "ordRow");
        	 }
         });
         
         //TODO
//         $('#dataGridTM').on('scrollBottom', function(e){
//        	if(isEditing == false ) {
//        		if (gridIdscrollBottom){
//        			addData = true;
//                 	setGrid(pageForCount,pageForCount);
//             	}
//        	}
//     	});
         
         
         //취소
         $('#btnCancel').on('click', function(e){
        	 isEditing = false;
        	 if($('#'+currentTab).alopexGrid("dataGet").length <= 0){
        		 $("#"+currentTab).alopexGrid("endEdit");
        		 resetGridNoEdit();
        		 return;
        	 }
        	 else { 
        		searchProc('C');
        	 }
         });
         
         //저장
         $('#btnSave').on('click', function(e){
        	 funcSaveData();
         });
         
         //삭제
         $('#btnDelete').on('click', function(e){
        	 if($('#'+currentTab).length == 0) {return;}
     		 var dataList = $('#'+currentTab).alopexGrid('dataGet', {_state:{selected:true}});
         	 dataList = AlopexGrid.currentData(dataList);
         	 
         	 if (dataList.length > 0 ){
	        	 callMsgBox('','C', cflineMsgArray['delete']/*"삭제하시겠습니까?"*/, function(msgId, msgRst){ //'삭제하시겠습니까?'
	         		if (msgRst == 'Y') {    /*  삭제하시겠습니까? */
	         			var dataList = $('#'+currentTab).alopexGrid('dataGet', {_state:{selected:true}});
	                 	dataList = AlopexGrid.currentData(dataList);
	                 	if (dataList.length > 0 ){
	             			var deleteList = $.map(dataList, function(data){
	             				if(nullToEmpty(data.existData) == "") {
	             					$('#'+currentTab).alopexGrid("dataDelete", {_index: {row:data._index.row}});     					
	             				}
	             			});
	                 	}
	                	dataList = $('#'+currentTab).alopexGrid('dataGet', {_state:{selected:true}});
	                	dataList = AlopexGrid.currentData(dataList);
	                	if( dataList.length > 0 ) {
	                		$('#'+currentTab).alopexGrid('endEdit', {_state:{editing:true}});
	                		isEditing = false;
	                		funcDeleteData(dataList);	 
	                	}
	     			}
	     		});
         	 } else {
     			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
    			$('#'+currentTab).alopexGrid("startEdit");
    		 }
         });
         
 		// AON/CON/SNCP 작업정보 그리드 더블클릭시
		$('#'+dataGridACS).on('dblclick', function(e) {
			var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
     		
     		var param = dataObj._state.editing[dataObj._column];
     		
 			if(object.mapping.key == "eqpNm" && isEditing == true) {
 				if ( data._state.focused) {
 					if(nullToEmpty(param)=="") {
						alertBox('I', makeArgMsg("required", cflineMsgArray['equipmentName']/* 장비명*/, null, null, null));/* 필수 입력 항목입니다.[{0}] */
						return false;
 					}
					paramT = { "neNm" : param };
					searchEqpPortNm(paramT,"eqp");
        		}
 			} else if(object.mapping.key == "portNm" && isEditing == true) {
 				if ( data._state.focused) {
 					if(nullToEmpty(dataObj.eqpId)=="") {
 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */
 						return false;
 					}
 					paramT = param;
 					objEqpId = dataObj.eqpId;
 					var searchParam = { "eqpId" : dataObj.eqpId , "portNm" : param};
 					searchEqpPortNm(searchParam , "port");
        		}
 			}
		});
		
		// TIE관리 작업정보 더블클릭 이벤트
		$('#'+dataGridTM).on('dblclick', function(e) {
     		var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
        	
        	var param = dataObj._state.editing[dataObj._column];
        	
 			// 장비명 입력
 			if((object.mapping.key == "eqpNm" || object.mapping.key == "aonEqpNm" ) && isEditing == true) {
 				if ( data._state.focused) {
 					if((currentTabIdx == 4) && ( object.mapping.key == "eqpNm" ) && (dataObj.existData != "Y")){
 						if(nullToEmpty(param)=="") {
 							alertBox('I', makeArgMsg("required", cflineMsgArray['equipmentName']/* 장비명*/, null, null, null));/* 필수 입력 항목입니다.[{0}] */
 							return false;
 						}
 						locEqp = "eqpNm";
 					} else if((currentTabIdx == 4) && ( object.mapping.key == "aonEqpNm" )){
 						if(nullToEmpty(param)=="") {
 							alertBox('I', makeArgMsg("required", cflineMsgArray['aonEquipmentName']/* AON장비명*/	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
 							return false;
 						}
 						locEqp = "aonEqpNm";
 					}
					paramT = { "neNm" : param };
					
					if(object.mapping.key == "aonEqpNm") {
						searchEqpPortNm(paramT,"eqp");	
					} else if(object.mapping.key == "eqpNm" && dataObj.existData != "Y") {
						searchEqpPortNm(paramT,"eqp");
					}
					
        		}
 			} else if((object.mapping.key == "portNm" || object.mapping.key == "aonPortNm")  && isEditing == true) {
 				if ( data._state.focused) {
 					var searchParam = null;
 					if((currentTabIdx == 4) && ( object.mapping.key == "portNm" ) && (dataObj.existData != "Y")){
 						if(nullToEmpty(dataObj.eqpId)=="") {
 	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
 	 						return false;
 	 					}
 						objEqpId = dataObj.eqpId;
 						searchParam = { "eqpId" : dataObj.eqpId , "portNm" : param};
 						locPort = "portNm";
 					} else if((currentTabIdx == 4) && ( object.mapping.key == "aonPortNm" )){
 						if(nullToEmpty(dataObj.aonEqpId)=="") {
 	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['aonEquipment']/* AON장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */
 	 						return false;
 	 					}
 						objEqpId = dataObj.aonEqpId;
 						searchParam = { "eqpId" : dataObj.aonEqpId , "portNm" : param};
 						locPort = "aonPortNm";
 					} 
 					paramT = param;
 					if(object.mapping.key == "aonPortNm") {
 						searchEqpPortNm(searchParam , "port");	
					} else if(object.mapping.key == "portNm" && dataObj.existData != "Y") {
						searchEqpPortNm(searchParam , "port");
					}
        		}
 			} else if(object.mapping.key == "ntwkLineNm"  && isEditing == true  && dataObj.existData != "Y") {
 				var mtsoId = [
 				              {"mtsoId":$('#tmofCd4').val()}
 				              ]
 				
 				var param = {"vTmofInfo" : mtsoId, "ntwkLineNm" : param, "topoLclCd" : '002', "topoSclCd" : '100', "isLink" : false };
 		 		searchTrunkPop(param);
 			}
     	});
		
		
		// DCS CONN 작업정보 그리드 더블클릭시
		$('#'+dataGridDC).on('dblclick', function(e) {
			var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
     		
     		var param = dataObj._state.editing[dataObj._column];
     		
 			if((object.mapping.key == "eqpNm1" || object.mapping.key == "eqpNm2") && isEditing == true) {
 				if ( data._state.focused) {
 					if((currentTabIdx == 3) && ( object.mapping.key == "eqpNm1" )){
 						if(nullToEmpty(param)=="") {
 							alertBox('I', makeArgMsg("required", cflineMsgArray['equipment']+"1"/* 장비*/	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
 							return false;
 						}
 						locEqp = "eqpNm1";
 					} else if((currentTabIdx == 3) && ( object.mapping.key == "eqpNm2" )){
 						if(nullToEmpty(param)=="") {
 							alertBox('I', makeArgMsg("required", cflineMsgArray['equipment']+"2"/* 장비*/	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
 							return false;
 						}
 						locEqp = "eqpNm2";
 					}
					paramT = { "neNm" : param };
					searchEqpPortNm(paramT,"eqp");
        		}
 			} else if((object.mapping.key == "lftPortNm1" || object.mapping.key == "lftPortNm2" || object.mapping.key == "rghtPortNm1" || object.mapping.key == "rghtPortNm2") && isEditing == true) {
 				if ( data._state.focused) {
 					var searchParam = null;
 					if((currentTabIdx == 3) && ( object.mapping.key == "lftPortNm1" )){
 						if(nullToEmpty(dataObj.eqpId1)=="") {
 	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"1"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
 	 						return false;
 	 					}
 						objEqpId = dataObj.eqpId1;
 						searchParam = { "eqpId" : dataObj.eqpId1 , "portNm" : param};
 						locPort = "lftPortNm1";
 					} else if((currentTabIdx == 3) && ( object.mapping.key == "lftPortNm2" )){
 						if(nullToEmpty(dataObj.eqpId2)=="") {
 	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"2"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
 	 						return false;
 	 					}
 						objEqpId = dataObj.eqpId2;
 						searchParam = { "eqpId" : dataObj.eqpId2 , "portNm" : param};
 						locPort = "lftPortNm2";
 					} else if((currentTabIdx == 3) && ( object.mapping.key == "rghtPortNm1" )){
 						if(nullToEmpty(dataObj.eqpId1)=="") {
 	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"3"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
 	 						return false;
 	 					}
 						objEqpId = dataObj.eqpId1;
 						searchParam = { "eqpId" : dataObj.eqpId1 , "portNm" : param};
 						locPort = "rghtPortNm1";
 					} else if((currentTabIdx == 3) && ( object.mapping.key == "rghtPortNm2" )){
 						if(nullToEmpty(dataObj.eqpId2)=="") {
 	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"2"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
 	 						return false;
 	 					}
 						objEqpId = dataObj.eqpId2;
 						searchParam = { "eqpId" : dataObj.eqpId2 , "portNm" : param};
 						locPort = "rghtPortNm2";
 					}
 					paramT = param;
 					searchEqpPortNm(searchParam , "port");
        		}
 			}
		});
		
		
		// OMS관리장비 작업정보 그리드 더블클릭시
		$('#'+dataGridRME).on('dblclick', function(e) {
			var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
     		
     		var param = dataObj._state.editing[dataObj._column];
     		
 			if(object.mapping.key == "eqpNm" && isEditing == true) {
 				if ( data._state.focused) {
 					if(nullToEmpty(param)=="") {
							alertBox('I', makeArgMsg("required", cflineMsgArray['equipmentName']/* 장비명 */	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
						return false;
 					}
					paramT = { "neNm" : param };
					searchEqpPortNm(paramT,"eqp");
        		}
 			} 
		});
		
     	// AON/CON/SNCP 작업정보 엔터 이벤트
     	$('#'+dataGridACS).on('keydown', function(e){
     		var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
        	
        	var param = dataObj._state.editing[dataObj._column];
        	
     		if (e.which == 13  ){
     			// 장비명 입력
     			if(object.mapping.key == "eqpNm" && isEditing == true) {
 					if ( data._state.focused) {
 						if(nullToEmpty(param)=="") {
							alertBox('I', makeArgMsg("required", cflineMsgArray['equipmentName']/* 장비명 */	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
 							return false;
 						}
 						paramT = { "neNm" : param };
 						searchEqpPortNm(paramT,"eqp");
            		}
     			} else if(object.mapping.key == "portNm" && isEditing == true) {
     				if ( data._state.focused) {
     					if(nullToEmpty(dataObj.eqpId)=="") {
 	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
     						return false;
     					}
     					paramT = param;
     					objEqpId = dataObj.eqpId;
     					var searchParam = { "eqpId" : dataObj.eqpId , "portNm" : param};
     					searchEqpPortNm(searchParam , "port");
            		}
     			} 
     		}
     	});
     	
     	
     	// TIE관리 작업정보 엔터 이벤트
     	$('#'+dataGridTM).on('keydown', function(e){
     		var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
        	
        	var param = dataObj._state.editing[dataObj._column];
     		if (e.which == 13  ){
     			// 장비명 입력
     			if((object.mapping.key == "eqpNm" || object.mapping.key == "aonEqpNm") && isEditing == true) {
     				if ( data._state.focused) {
     					if((currentTabIdx == 4) && ( object.mapping.key == "eqpNm" ) && (dataObj.existData != "Y")){
     						if(nullToEmpty(param)=="") {
    							alertBox('I', makeArgMsg("required", cflineMsgArray['equipmentName']/* 장비명 */	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
     							return false;
     						}
     						locEqp = "eqpNm";
     					} else if((currentTabIdx == 4) && ( object.mapping.key == "aonEqpNm" )){
     						if(nullToEmpty(param)=="") {
    							alertBox('I', makeArgMsg("required", cflineMsgArray['aonEquipmentName']/* AON장비명 */	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
     							return false;
     						}
     						locEqp = "aonEqpNm";
     					}
    					paramT = { "neNm" : param };
    					if(object.mapping.key == "aonEqpNm") {
    						searchEqpPortNm(paramT,"eqp");	
    					} else if(object.mapping.key == "eqpNm" && dataObj.existData != "Y") {
    						searchEqpPortNm(paramT,"eqp");
    					}
            		}
     			} else if((object.mapping.key == "portNm" || object.mapping.key == "aonPortNm") && isEditing == true) {
     				if ( data._state.focused) {
     					var searchParam = null;
     					if((currentTabIdx == 4) && ( object.mapping.key == "portNm" ) && (dataObj.existData != "Y")){
     						if(nullToEmpty(dataObj.eqpId)=="") {
     	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
     	 						return false;
     	 					}
     						objEqpId = dataObj.eqpId;
     						searchParam = { "eqpId" : dataObj.eqpId , "portNm" : param};
     						locPort = "portNm";
     					} else if((currentTabIdx == 4) && ( object.mapping.key == "aonPortNm" )){
     						if(nullToEmpty(dataObj.aonEqpId)=="") {
     	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['aonEquipment']+"1"/* AON장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
     	 						return false;
     	 					}
     						objEqpId = dataObj.aonEqpId;
     						searchParam = { "eqpId" : dataObj.aonEqpId , "portNm" : param};
     						locPort = "aonPortNm";
     					} 
     					paramT = param;
     					if(object.mapping.key == "aonPortNm") {
     						searchEqpPortNm(searchParam , "port");	
    					} else if(object.mapping.key == "portNm" && dataObj.existData != "Y") {
    						searchEqpPortNm(searchParam , "port");
    					}
            		}
     			} else if(object.mapping.key == "ntwkLineNm" && isEditing == true  && dataObj.existData != "Y") {
     				var mtsoId = [
     				              {"mtsoId":$('#tmofCd4').val()}
     				              ]
     				
     				var param = {"vTmofInfo" : mtsoId, "ntwkLineNm" : param, "topoLclCd" : '002', "topoSclCd" : '100', "isLink" : false };
     		 		searchTrunkPop(param);
     			}
     		}
     	});
     	
     // DCS CONN 작업정보 엔터 이벤트
     	$('#'+dataGridDC).on('keydown', function(e){
     		var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
        	
        	var param = dataObj._state.editing[dataObj._column];
        	
     		if (e.which == 13  ){
     			// 장비명 입력
     			if((object.mapping.key == "eqpNm1" || object.mapping.key == "eqpNm2") && isEditing == true) {
     				if ( data._state.focused) {
     					if((currentTabIdx == 3) && ( object.mapping.key == "eqpNm1" )){
     						if(nullToEmpty(param)=="") {
    							alertBox('I', makeArgMsg("required", cflineMsgArray['equipment'] +"1"/* 장비1 */	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
     							return false;
     						}
     						locEqp = "eqpNm1";
     					} else if((currentTabIdx == 3) && ( object.mapping.key == "eqpNm2" )){
     						if(nullToEmpty(param)=="") {
     							alertBox('I', "장비명2을 입력해주세요.");/* 장비명2을 입력해주세요.*/	
    							alertBox('I', makeArgMsg("required", cflineMsgArray['equipment'] +"2"/* 장비2 */	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
     							return false;
     						}
     						locEqp = "eqpNm2";
     					}
    					paramT = { "neNm" : param };
    					searchEqpPortNm(paramT,"eqp");
            		}
     			} else if((object.mapping.key == "lftPortNm1" || object.mapping.key == "lftPortNm2" || object.mapping.key == "rghtPortNm1" || object.mapping.key == "rghtPortNm2") && isEditing == true) {
     				if ( data._state.focused) {
     					var searchParam = null;
     					if((currentTabIdx == 3) && ( object.mapping.key == "lftPortNm1" )){
     						if(nullToEmpty(dataObj.eqpId1)=="") {
     	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"1"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
     	 						return false;
     	 					}
     						objEqpId = dataObj.eqpId1;
     						searchParam = { "eqpId" : dataObj.eqpId1 , "portNm" : param};
     						locPort = "lftPortNm1";
     					} else if((currentTabIdx == 3) && ( object.mapping.key == "lftPortNm2" )){
     						if(nullToEmpty(dataObj.eqpId2)=="") {
     	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"2"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
     	 						return false;
     	 					}
     						objEqpId = dataObj.eqpId2;
     						searchParam = { "eqpId" : dataObj.eqpId2 , "portNm" : param};
     						locPort = "lftPortNm2";
     					} else if((currentTabIdx == 3) && ( object.mapping.key == "rghtPortNm1" )){
     						if(nullToEmpty(dataObj.eqpId1)=="") {
     	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"1"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
     	 						return false;
     	 					}
     						objEqpId = dataObj.eqpId1;
     						searchParam = { "eqpId" : dataObj.eqpId1 , "portNm" : param};
     						locPort = "rghtPortNm1";
     					} else if((currentTabIdx == 3) && ( object.mapping.key == "rghtPortNm2" )){
     						if(nullToEmpty(dataObj.eqpId2)=="") {
     	 						alertBox('I', makeArgMsg("demandAfterPleseSearch", cflineMsgArray['equipment']+"2"/* 장비 */, null, null, null)); /* {0} 설정 후 검색하여 주십시오. */	
     	 						return false;
     	 					}
     						objEqpId = dataObj.eqpId2;
     						searchParam = { "eqpId" : dataObj.eqpId2 , "portNm" : param};
     						locPort = "rghtPortNm2";
     					}
     					paramT = param;
     					searchEqpPortNm(searchParam , "port");
            		}
     			}
     		}
     	});
     	

     	// OMS관리장비 작업정보 그리드 엔터시
     	$('#'+dataGridRME).on('keydown', function(e){
     		var object = AlopexGrid.parseEvent(e);
     		var data = AlopexGrid.currentData(object.data);
     		var dataObj = AlopexGrid.parseEvent(e).data;
        	
        	var param = dataObj._state.editing[dataObj._column];
        	
     		if (e.which == 13  ){
     			// 장비명 입력
     			if(object.mapping.key == "eqpNm" && isEditing == true) {
     				if ( data._state.focused) {
     					if(nullToEmpty(param)=="") {
							alertBox('I', makeArgMsg("required", cflineMsgArray['equipmentName']/* 장비명 */	, null, null, null));/* 필수 입력 항목입니다.[{0}] */
    						return false;
     					}
    					paramT = { "neNm" : param };
    					searchEqpPortNm(paramT,"eqp");
            		}
     			} 
     		}
     	});
       
	};

	/**
	 * 탭 변경 이벤트
	 */
	function tabChange(index) {
		if(isEditing == false) {
 			resetGridNoEdit();
 		}
 		if(index == 0) {
 			$(".ACS").show();
	 		$(".SR").hide();
	    	$(".KTE").hide();
	    	$(".DC").hide();
	    	$(".TM").hide();
	    	$(".RME").hide();
 			$('#'+dataGridACS).alopexGrid("viewUpdate");
 			$('#tabIndexValue').val("0");
 			tmofCd = $('#tmofCd0').val();
 			currentTabIdx = 0;
 			currentTab = "dataGridACS";
 		} else if(index == 1) {
 			$(".ACS").hide();
	 		$(".SR").show();
	    	$(".KTE").hide();
	    	$(".DC").hide();
	    	$(".TM").hide();
	    	$(".RME").hide();
 			$('#'+dataGridSR).alopexGrid("viewUpdate");
 			$('#tabIndexValue').val("1");
 			tmofCd = $('#tmofCd1').val();
 			currentTabIdx = 1;
 			currentTab = "dataGridSR";
 		} else if(index == 2) {
 			$(".ACS").hide();
	 		$(".SR").hide();
	    	$(".KTE").show();
	    	$(".DC").hide();
	    	$(".TM").hide();
	    	$(".RME").hide();
 			$('#'+dataGridKtE).alopexGrid("viewUpdate");
			$('#tabIndexValue').val("2");
			currentTabIdx = 2;
			currentTab = "dataGridKtE";
 		} else if(index == 3) {
 			$(".ACS").hide();
	 		$(".SR").hide();
	    	$(".KTE").hide();
	    	$(".DC").show();
	    	$(".TM").hide();
	    	$(".RME").hide();
 			$('#'+dataGridDC).alopexGrid("viewUpdate");
 			$('#tabIndexValue').val("3");
 			tmofCd = $('#tmofCd3').val();
 			currentTabIdx = 3;
 			currentTab = "dataGridDC";
 		}  else if(index == 4) {
 			//TODO
 			$(".ACS").hide();
	 		$(".SR").hide();
	    	$(".KTE").hide();
	    	$(".DC").hide();
	    	$(".TM").show();
	    	$(".RME").hide();
 			$('#'+dataGridTM).alopexGrid("viewUpdate");
 			$('#tabIndexValue').val("4");
 			tmofCd = $('#tmofCd4').val();
 			currentTabIdx = 4;
 			currentTab = "dataGridTM";
    		$('#'+currentTab).alopexGrid({columnMapping: columnTM });	//편집모드 벗어나면 * 미표시로 개선 2025-02-05
 		}  else if(index == 5) {
 			$(".ACS").hide();
	 		$(".SR").hide();
	    	$(".KTE").hide();
	    	$(".DC").hide();
	    	$(".TM").hide();
	    	$(".RME").show();
 			$('#'+dataGridRME).alopexGrid("viewUpdate");
 			$('#tabIndexValue').val("5");
 			tmofCd = $('#tmofCd5').val();
 			currentTabIdx = 5;
 			currentTab = "dataGridRME";
 		}
 		if($('#'+currentTab).alopexGrid("dataGet").length <= 0){
 			$('#btnExportExcel').setEnabled(false);
 		} else {
 			$('#btnExportExcel').setEnabled(true);
 		}
	}
	
	
	/**
	 * Excel 다운로드 
	 */
	function excelDownload() {
		var index = parseInt($('#basicTabs').getCurrentTabIndex());
		var date = getCurrDate();
		
		if(index == 0) {
			sheetNm = "AON_CON_SCNP";
		} else if(index == 1) {
			sheetNm = "SNCP_RT"	;;
		} else if(index == 2) {
			sheetNm = cflineMsgArray['englishConversion']/*"영문변환"*/	;
		} else if(index == 3) {
			sheetNm = cflineMsgArray['dcsLinkage']/*"DCS간연동"*/	;
		} else if(index == 4) {
			sheetNm = cflineMsgArray['tieMgmt']/*"TIE관리"*/	;
		} else if(index == 5) {
			sheetNm = cflineMsgArray['omsMgmtEquipment']/*"OMS관리장비"*/	;
		}
		fileName = sheetNm + "_" + date	;
		
		var worker = new ExcelWorker({
     		excelFileName : fileName,	
     		sheetList: [{
     			sheetName: sheetNm,
     			placement: 'vertical',
     			$grid: $('#'+currentTab)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		cflineHideProgressBody();
	}
	
	
	/**
	 * 삭제
	 */
	function funcDeleteData(dataList) {
    	if (dataList.length > 0 ){
			var deleteList = $.map(dataList, function(data){
				if(currentTabIdx == 0 ) {
					var deleteParam = {
							 "seq" : data.seq
							 , "tmofCd":tmofCd
							 , "tabIdx" : currentTabIdx
							 ,"ordRow" : data.ordRow
					};
				} else if(currentTabIdx == 1 ) {
					var deleteParam = {
							 "seq" : data.seq
							 , "ntwkLineNo":data.ntwkLineNo
							 , "tmofCd":tmofCd
							 , "eqpId":data.eqpId
							 ,"tabIdx" : currentTabIdx
							 ,"ordRow" : data.ordRow
					};
				} else if(currentTabIdx == 2 ) {
					var deleteParam = {
							  "hanVal":data.hanVal
							  ,"tabIdx" : currentTabIdx
							  ,"ordRow" : data.ordRow
					};
				} else if(currentTabIdx == 3 ) {
					var deleteParam = {
							 "tabIdx" : currentTabIdx
							, "tmofCd":tmofCd
							, "seq" : data.seq
							,"ordRow" : data.ordRow
					};
				} else if(currentTabIdx == 4 ) {
					var deleteParam = {
							 "tabIdx" : currentTabIdx
							, "tmofCd":tmofCd
							, "tieVal" : data.tieVal
							, "ntwkLineNo" : data.ntwkLineNo
							, "eqpId" : data.eqpId
							, "portId" : data.portId
							, "portChnlVal" : data.portChnlVal
							,"ordRow" : data.ordRow
					};
				} else if(currentTabIdx == 5 ) {
					var deleteParam = {
							 "tabIdx" : currentTabIdx
							, "tmofCd":tmofCd
							, "eqpId" : data.eqpId
							,"ordRow" : data.ordRow
					};
				}
				return deleteParam;
			});
//			console.log(deleteList);
			cflineShowProgressBody();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/oneclickconfig/oneclickconfig/deleteEditInfo', deleteList, 'POST', 'deleteEditInfo');
		}else {
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
			$('#'+currentTab).alopexGrid("startEdit");
		}
	}
	
	/**
	 * 작업수정내역저장
	 */
	function funcSaveData() {
    	if($('#'+currentTab).length == 0) {return;}
		$('#'+currentTab).alopexGrid('endEdit', {_state:{editing:true}});
		var dataList = $('#'+currentTab).alopexGrid('dataGet', {_state:{selected:true}});
    	dataList = AlopexGrid.currentData(dataList);
    	if (dataList.length > 0 ){
    		if(fnVaildation(dataList)){
           	 	isEditing = false;
    			dataList = $('#'+currentTab).alopexGrid('dataGet', {_state:{selected:true}});
    			dataList = AlopexGrid.currentData(dataList);
				var updateList = $.map(dataList, function(data){
					if(currentTabIdx == 0 ) {
						var saveParam = {
								  "eqpId":data.eqpId
								, "portId":data.portId
								, "eqpPortChnlVal":data.eqpPortChnlVal
								, "dcsConnTypCd":data.dcsConnTypCd
								, "userLablNm":data.userLablNm
								, "protLablNm":data.protLablNm
								, "tabIdx" : currentTabIdx
								, "tmofCd":tmofCd
								, "seq" : data.seq
								, "ordRow" : data.ordRow
								, "existData" : data.existData
						};
					} else if(currentTabIdx == 1 ) {						
						var saveParam = {
								  "ntwkLineNm":data.ntwkLineNm
								, "eqpTid":data.eqpTid
								, "eqpNm":data.eqpNm
								, "vtulEqpNm":data.vtulEqpNm
								, "portRmk":data.portRmk
								, "protLablNm":data.protLablNm
								, "tabIdx" : currentTabIdx
								, "tmofCd":tmofCd
								, "seq" : data.seq
								, "ordRow" : data.ordRow
								, "existData" : data.existData
						};
					} else if(currentTabIdx == 2 ) {
						var saveParam = {
								  "hanVal":data.hanVal
								, "enghVal":data.enghVal
								, "tabIdx" : currentTabIdx
								, "ordRow" : data.ordRow
								, "existData" : data.existData
								
						};
					} else if(currentTabIdx == 3 ) {
						var saveParam = {
								  "eqpId1":data.eqpId1
								, "lftPortId1":data.lftPortId1
								, "lftPortChnlVal1":data.lftPortChnlVal1
								, "rghtPortId1":data.rghtPortId1
								, "rghtPortChnlVal1":data.rghtPortChnlVal1
								, "eqpId2":data.eqpId2
								, "lftPortId2":data.lftPortId2
								, "lftPortChnlVal2":data.lftPortChnlVal2
								, "rghtPortId2":data.rghtPortId2
								, "rghtPortChnlVal2":data.rghtPortChnlVal2
								, "tabIdx" : currentTabIdx
								, "tmofCd":tmofCd
								, "seq" : data.seq
								, "ordRow" : data.ordRow
								, "existData" : data.existData
						};
					} else if(currentTabIdx == 4 ) {
						var saveParam = {
								  "ntwkLineNo":data.ntwkLineNo
								, "eqpId":data.eqpId
								, "portId":data.portId
								, "updPortChnlVal":data.portChnlVal
								, "insPortChnlVal":data.tmpPortNm+data.chnlVal
								, "chnlVal":data.chnlVal
								, "tieVal":data.tieVal
								, "aonEqpId":data.aonEqpId
								, "aonPortId":data.aonPortId
								, "lineRmkOne":data.lineRmkOne
								, "lineRmkTwo":data.lineRmkTwo
								, "lineRmkThree":data.lineRmkThree
								, "tabIdx" : currentTabIdx
								, "tmofCd":tmofCd
								, "ordRow" : data.ordRow
								, "existData" : data.existData
						};
					} else if(currentTabIdx == 5 ) {
						var saveParam = {
								 "eqpId":data.eqpId
								, "tabIdx" : currentTabIdx
								, "tmofCd":tmofCd
								, "ordRow" : data.ordRow
								, "existData" : data.existData
						};
					}
					
					return saveParam;
				});
				cflineShowProgressBody();
				
				// 등록, 수정
				httpRequest('tango-transmission-biz/transmisson/configmgmt/oneclickconfig/oneclickconfig/updateEditInfo', updateList, 'POST', 'updateEditInfo');
    		}
		}else {
			alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다. */
			$('#'+currentTab).alopexGrid("startEdit");
		}
	}
	
	/**
	 * 필수값 체크 함수
	 */
	function fnVaildation(dataList){    	
		var msgStr = "";
    	var validate = true;
    	var requiredColumn = null;
    	
    	if(currentTabIdx == 0 ) {
    		requiredColumn = { eqpId : cflineMsgArray['equipment']
			 , portId : cflineMsgArray['portEng']
    		 , userLablNm : "User_Name"
    	   	 , dcsConnTypCd : cflineMsgArray['type'] 
    		};	
    	} else if(currentTabIdx == 1 ) {
    		requiredColumn = { ntwkLineNm : cflineMsgArray['at622mRingName']/*"AT622M링"*/
			 , eqpTid : "RT_ename", eqpNm : "RT_kname" };	
    	} else if(currentTabIdx == 2 ) {
    		requiredColumn = { hanVal : cflineMsgArray['hangul']};	
    	} else if(currentTabIdx == 3 ) {
    		requiredColumn = { eqpId1 : cflineMsgArray['equipment']+"1"/*"장비1"*/
			 , eqpId2 : cflineMsgArray['equipment']+"2"/*"장비2"*/};	
    	} else if(currentTabIdx == 4 ) {
    		requiredColumn = { tieVal : "TIE", ntwkLineNo : cflineMsgArray['trkName']/*"트렁크명"*/ , eqpId : cflineMsgArray['equipment']/*"장비"*/ , portId : cflineMsgArray['port']/*"포트"*/ };	
       	} else if(currentTabIdx == 5 ) {
    		requiredColumn = { eqpId : cflineMsgArray['equipmentName']/*"장비명"*/ };	
       	}  
    	for(var i=0; i<dataList.length; i++){
    		$.each(requiredColumn, function(key,val){
    			var value = eval("dataList[i]" + "." + key);
    			if(nullToEmpty(value) == ""){
    				if(nullToEmpty(dataList[i].ordRow) != "") {
    					msgStr = dataList[i].ordRow + " : " + val;	
    				} else {
    					msgStr = val;	
    				}
    				validate = false;
    				return validate;
    			}
         	});
    		
    		if(!validate){
        		alertBox('W', makeArgMsg('required',msgStr,"","","")); /* 필수 입력 항목입니다.[{0}] */
        		$('#'+currentTab).alopexGrid("startEdit");
        		return validate;
    		}
    	}
    	if(currentTabIdx == 3 ) {
	    	for( var index = 0 ; index < dataList.length; index++ ) {
	    		if(nullToEmpty(dataList[index].lftPortNm1) == "" ) {
	    			dataList[index].lftPortNm1 = null;
	    			$('#' + currentTab + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "lftPortId1");
	    		}
	    		if(nullToEmpty(dataList[index].rghtPortNm1) == "" ) {
	    			dataList[index].rghtPortNm1 = null;
	    			$('#' + currentTab + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "rghtPortId1");
	    		}
	    		if(nullToEmpty(dataList[index].lftPortNm2) == "" ) {
	    			dataList[index].lftPortNm2 = null;
	    			$('#' + currentTab + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "lftPortId2");
	    		}
	    		if(nullToEmpty(dataList[index].rghtPortNm2) == "" ) {
	    			dataList[index].rghtPortNm2 = null;
	    			$('#' + currentTab + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "rghtPortId2");
	    		}
	    		if( (nullToEmpty(dataList[index].lftPortId1) == "" && nullToEmpty(dataList[index].lftPortNm1) != "" )
	    			|| ( nullToEmpty(dataList[index].rghtPortId1) == "" && nullToEmpty(dataList[index].rghtPortNm1) != "" )   
	    				|| ( nullToEmpty(dataList[index].lftPortId2) == "" && nullToEmpty(dataList[index].lftPortNm2) != "" ) 
	    					|| (nullToEmpty(dataList[index].rghtPortId2) == "" && nullToEmpty(dataList[index].rghtPortNm2) != "" ) )  {
	    			alertBox('W', cflineMsgArray['updatePortSearchAfter']);  /* 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+currentTab).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( (nullToEmpty(dataList[index].lftPortId1) == "" && nullToEmpty(dataList[index].lftPortChnlVal1) != "" )
		    			|| ( nullToEmpty(dataList[index].rghtPortId1) == "" && nullToEmpty(dataList[index].rghtPortChnlVal1) != "" )   
		    				|| ( nullToEmpty(dataList[index].lftPortId2) == "" && nullToEmpty(dataList[index].lftPortChnlVal2) != "" ) 
		    					|| (nullToEmpty(dataList[index].rghtPortId2) == "" && nullToEmpty(dataList[index].rghtPortChnlVal2) != "" ) )  {
		    			alertBox('W', cflineMsgArray['inputPortDemandAfterChannel']);  /* 포트 설정 후 채널을 입력해주십시오. */
		    			$('#'+currentTab).alopexGrid("startEdit");
		    			validate = false;
		    			return validate;
		    	}
	    	}
    	}
    	
    	if(currentTabIdx == 4 ) {
	    	for( var index = 0 ; index < dataList.length; index++ ) {
	    		if(nullToEmpty(dataList[index].aonEqpNm) == "" ) {
	    			dataList[index].aonEqpNm = null;
	    			$('#' + currentTab + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "aonEqpId");
	    		}
	    		if(nullToEmpty(dataList[index].aonPortNm) == "" ) {
	    			dataList[index].aonPortNm = null;
	    			$('#' + currentTab + '').alopexGrid("cellEdit", null, {_index : { row : dataList[index]._index.row }}, "aonPortId");
	    		}
	    		if( (nullToEmpty(dataList[index].aonEqpId) == "" && nullToEmpty(dataList[index].aonEqpNm) != "" ))  {
	    			alertBox('W', cflineMsgArray['demandEqpSearchAfter']);  /* 장비는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+currentTab).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( (nullToEmpty(dataList[index].aonPortId) == "" && nullToEmpty(dataList[index].aonPortNm) != "" ) )  {
		    			alertBox('W', cflineMsgArray['demandPortSearchAfter']);  /* 포트는 검색 후 선택하여 수정해주십시오. */
		    			$('#'+currentTab).alopexGrid("startEdit");
		    			validate = false;
		    			return validate;
		    	}
	    		if( nullToEmpty(dataList[index].chnlVal)  != "" )  {
		    		var commaC = dataList[index].chnlVal.indexOf(",");
		    		if(commaC == -1 || commaC != 0){ 
		    			alertBox('W', cflineMsgArray['startChannelComma']/*"채널은 ,로 시작해야합니다."*/); 
		    			$('#'+currentTab).alopexGrid("startEdit");
		    			validate = false;
		    			return validate;
		    		}
		    		var chkData =nullToEmpty(dataList[index].chnlVal);
		    		if(chkData.length != 6 ){ 
		    			alertBox('W', cflineMsgArray['inputChannelSix']/*"채널은 6자리로 입력해주세요."*/); 
		    			$('#'+currentTab).alopexGrid("startEdit");
		    			validate = false;
		    			return validate;
		    		} 
		    		
		    		for(var idx = 1 ;idx < chkData.length; idx++) {
		    			if(isNaN(chkData[idx]) == true ) {
		    				alertBox('W', cflineMsgArray['inputChannelNumber']/*"채널은 숫자로 입력해주세요."*/); 
			    			$('#'+currentTab).alopexGrid("startEdit");
			    			validate = false;
			    			return validate;
		    			} 
		    		}
	    		}
	    		
	    	}
    	}
    	return validate;
    }
	
	/*화면 초기 포트,채널 비활성화 */
	function setComboReadOnly() {
		$('#acsPortNm').attr("readonly",true);
		$('#acsPortNm').css("background-color","silver");
		$('#acsChnlNm').attr("readonly",true);
		$('#acsChnlNm').css("background-color","silver");
		$('#aPortNm1').attr("readonly",true);
		$('#aPortNm1').css("background-color","silver");
		$('#aPortNm2').attr("readonly",true);
		$('#aPortNm2').css("background-color","silver");
		$('#bPortNm1').attr("readonly",true);
		$('#bPortNm1').css("background-color","silver");
		$('#bPortNm2').attr("readonly",true);
		$('#bPortNm2').css("background-color","silver");
		$('#aPortChnl1').attr("readonly",true);
		$('#aPortChnl1').css("background-color","silver");
		$('#aPortChnl2').attr("readonly",true);
		$('#aPortChnl2').css("background-color","silver");
		$('#bPortChnl1').attr("readonly",true);
		$('#bPortChnl1').css("background-color","silver");
		$('#bPortChnl2').attr("readonly",true);
		$('#bPortChnl2').css("background-color","silver");
		$('#portNm').attr("readonly",true);
		$('#portNm').css("background-color","silver");
		$('#chnlVal').attr("readonly",true);
		$('#chnlVal').css("background-color","silver");
		$('#aonPortNm').attr("readonly",true);
		$('#aonPortNm').css("background-color","silver");
	}
	
	
	/**
	 * 장비명,포트명 검색
	 */
	function searchEqpPortNm(param , div) {
		cflineShowProgressBody();
		if(div == "eqp") {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/oneclickconfig/oneclickconfig/geteqpinfo', param, 'GET', 'getEqpInfo');
		} else if(div == "port") {
			httpRequest('tango-transmission-biz/transmisson/configmgmt/oneclickconfig/oneclickconfig/getportinfo', param, 'GET', 'getPortInfo');
		}
	}
	
	
  	/**
   	 * 장비 검색 팝업
   	 */
	//장비 찾기(그리드ID,파라메터 ) 
   function openEqpPop(GridId,param){
	   cflineHideProgressBody();
	   	var urlPath = $('#ctx').val();
	   	if(nullToEmpty(urlPath) ==""){
	   		urlPath = "/tango-transmission-web";
	   	}
	
	   	$a.popup({
	   	  	popid: "popEqpSch" ,
	   	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
	//	   	  	url: urlPath + '/configmgmt/equipment/EqpLkup.do',
	   	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
	   	  	data: param,
	   		modal: true,
	   		movable:true,
	   		width : 1200,
	   		height : 810,
	   		callback:function(data){
	   			if(data != null){
	   				if(GridId != null && GridId != ""){
	   		    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
	   		    		var rowIndex = focusData[0]._index.data;
	   		    		if(currentTabIdx == 0 ) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, "eqpId");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm");
		   					$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, "eqpNm");
		   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portId");
		   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
		   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpPortChnlVal");
	   		    		} else if(currentTabIdx == 1) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, "eqpId");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpEnm");
		   					$('#'+GridId).alopexGrid( "cellEdit", data.eqpTid, {_index : { row : rowIndex}}, "eqpEnm");
	   		    		} else if((currentTabIdx == 3) && (locEqp == "eqpNm1")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, "eqpId1");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, "eqpNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortId1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortId1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal1");
	   		    		} else if((currentTabIdx == 3) && (locEqp == "eqpNm2")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, "eqpId2");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, "eqpNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortId2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortId2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal2");
	   		    		} else if(currentTabIdx == 4 ) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, "eqpId");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm");
	   						$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, "eqpNm");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portId");
		   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
	   		    		} else if(currentTabIdx == 5 ) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, "eqpId");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm");
	   						$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, "eqpNm");
	   		    		} 
	   					
	   				}
	   			}
	   		}
	   	});		
    }
	
   /**
    * 포트 검색 팝업창
    */
   //포트 찾기 팝업  사용함(그리드ID, 장비ID, 검색할 포트명) 
   function openPortPop(GridId ,paramEqpId, searchPortNm){
	   	cflineHideProgressBody();
	   	var param = new Object();
	   	$.extend(param,{"neId":nullToEmpty(paramEqpId)});
	   	$.extend(param,{"portNm":nullToEmpty(searchPortNm)});
	   	
	   	var urlPath = $('#ctx').val();
	   	if(nullToEmpty(urlPath) ==""){
	   		urlPath = "/tango-transmission-web";
	   	}
	   	
	   	$a.popup({
	   	  	popid: "popPortSch",
	   	  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
	   	  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
	   	  	data: param,
	   		modal: true,
	   		movable:true,
	   		width : 1100,
	   		height : 740,
	   		callback:function(data){
	   			if(data != null){
	   				if(GridId != null && GridId != ""){
	   		    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
	   		    		var rowIndex = focusData[0]._index.data;
	   		    		if(currentTabIdx == 0 ) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, "portId");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
		   					$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "portNm");
		   					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpPortChnlVal");
	   		    		} else if((currentTabIdx == 3) && (locPort == "lftPortNm1")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, "lftPortId1");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "lftPortNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal1");
	   		    		} else if((currentTabIdx == 3) && (locPort == "lftPortNm2")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, "lftPortId2");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "lftPortNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal2");
	   		    		} else if((currentTabIdx == 3) && (locPort == "rghtPortNm1")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, "rghtPortId1");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "rghtPortNm1");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal1");
	   		    		} else if((currentTabIdx == 3) && (locPort == "rghtPortNm2")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, "rghtPortId2");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "rghtPortNm2");
	   						$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal2");
	   		    		} else if((currentTabIdx == 4) && (locPort == "portNm")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, "portId");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "tmpPortNm");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "tmpPortNm");
	   						$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "portNm");
	   		    		} else if((currentTabIdx == 4) && (locPort == "aonPortNm")) {
	   		    			$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, "aonPortId");
	   		    			$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "aonPortNm");
	   						$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, "aonPortNm");
	   		    		}
	   					
	   				}
	   			}
	   		}
   		}); 
    }

	/*
	 * 조회 함수
	 */
	function searchProc(div){
		var urlVal = "";
		var callVal = "";
		if(div == "S"){
			formReset();
		}		
    	var dataParam = $("#searchForm").getData();
		if(currentTabIdx == 0 ) {
			$('#tmofCd0').setEnabled(true);
			urlVal = "getacslist";
			callVal = "getACSList";
			dataParam.tmofCd = dataParam.tmofCd0;
		} else if(currentTabIdx == 1 ) {
			$('#tmofCd1').setEnabled(true);
			urlVal = "getsrlist";
			callVal = "getSRList";
    		dataParam.tmofCd = dataParam.tmofCd1;
		} else if(currentTabIdx == 2 ) {
			urlVal = "getktelist";
			callVal = "getKtEList";
    		dataParam.tmofCd = "";
		} else if(currentTabIdx == 3 ) {
			$('#tmofCd3').setEnabled(true);
			urlVal = "getdclist";
			callVal = "getDCList";	
    		dataParam.tmofCd = dataParam.tmofCd3;
		} else if(currentTabIdx == 4 ) {
			$('#tmofCd4').setEnabled(true);
			searchYn = true ; 
		 	gridIdscrollBottom = true;
		 	gridIdWorkscrollBottom = true;
			setGrid(1,pageForCount);
		 	
		} else if(currentTabIdx == 5 ) {
			$('#tmofCd5').setEnabled(true);
			urlVal = "getrmelist";
			callVal = "getRMEList";	
    		dataParam.tmofCd = dataParam.tmofCd5;
		}
		
		if(currentTabIdx != 4 ) {
			tmofCd = nullToEmpty(dataParam.tmofCd);
			$('#btnExportExcel').setEnabled(false);
			cflineShowProgressBody();	
			httpRequest('tango-transmission-biz/transmisson/configmgmt/oneclickconfig/oneclickconfig/'+urlVal, dataParam, 'GET', callVal);	
		}
			
		
	}
	
    
    /**
     * Function Name : searchTrunkPop
     * Description   : 트렁크
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function searchTrunkPop(param) {
 		var urlPath = $('#ctx').val();
 		if(nullToEmpty(urlPath) == ""){
 			urlPath = "/tango-transmission-web";
 		}
 		
 		//var title = searchDivision == 'wdm' ? 'WDM 트렁크 리스트 조회' : '트렁크 리스트 조회';
 		
 		$a.popup({
 		  	url: urlPath+'/configmgmt/cfline/TrunkListPop.do',
 		    data: param,
 		    windowpopup : true,
//     		    other:'width=1200,height=700,scrollbars=yes,resizable=yes',
//     		  	popid: 'TrunkListPop',
//     		  	title: title,
//     		    iframe: true,
//     		    modal : false,
//     		    movable : true,
 		    width : 1200,
 		    height : 700,
 		    callback:function(data){
//     		    	var ntwkLineNm = "";
 		    	if(data != null){
 		    		if(data.length == 1) {
 		    			ntwkLineNo = data[0].ntwkLineNo;
 		    			ntwkLineNm = data[0].ntwkLineNm;
 		    		} else {
 		    			ntwkLineNo = data.ntwkLineNo;
 		    			ntwkLineNm = data.ntwkLineNm;
 		    		}
 		    		
 		    		var focusData = $('#'+currentTab).alopexGrid("dataGet", {_state : {focused : true}});
 		    		var rowIndex = focusData[0]._index.data;
 					$('#'+currentTab).alopexGrid( "cellEdit", ntwkLineNo, {_index : { row : rowIndex}}, "ntwkLineNo");
 					$('#'+currentTab).alopexGrid( "cellEdit", ntwkLineNm, {_index : { row : rowIndex}}, "ntwkLineNm");
 		    	}
 		    }	  
 		});
    }
    
    
	
    /**
     * Function Name : editRow
     * Description   : 행 편집
     * ----------------------------------------------------------------------------------------------------
     * param    	 : btnShowArray. 편집기능이 활성화 될때 보여줄 버튼 ID 리스트
     *                 btnHideArray. 편집기능이 활성화 될때 숨여야될 버튼 ID 리스트
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function editRow(btnShowArray, btnHideArray) {
    	$('#'+currentTab).alopexGrid({
    		rowSingleSelect : false,
    		rowInlineEdit : true, //행전체 편집기능 활성화
    	});
    	
    	if(nullToEmpty(btnShowArray) != "") {
    		for(var show = 0; show < btnShowArray.length; show++) {
    			$("#"+btnShowArray[show]).show();
    		}
    	}
    	
    	if(nullToEmpty(btnHideArray) != "") {
    		for(var hide = 0; hide < btnHideArray.length; hide++) {
    			$("#"+btnHideArray[hide]).hide();
    		}
    	}
    	 
    	if( currentTabIdx == 0 ) {
    		$('#'+currentTab).alopexGrid({columnMapping: columnACSWork });
        	$('#basicTabs').setEnabled(false,1)
        	$('#basicTabs').setEnabled(false,2)
        	$('#basicTabs').setEnabled(false,3)
        	$('#basicTabs').setEnabled(false,4)
        	$('#basicTabs').setEnabled(false,5)
    	} else if( currentTabIdx == 1 ){
    		$('#'+currentTab).alopexGrid({columnMapping: columnSRWork });
        	$('#basicTabs').setEnabled(false,0)
        	$('#basicTabs').setEnabled(false,2)
        	$('#basicTabs').setEnabled(false,3)
        	$('#basicTabs').setEnabled(false,4)
        	$('#basicTabs').setEnabled(false,5)
    	} else if( currentTabIdx == 2 ){
    		$('#'+currentTab).alopexGrid({columnMapping: columnKtEWork });
        	$('#basicTabs').setEnabled(false,0)
        	$('#basicTabs').setEnabled(false,1)
        	$('#basicTabs').setEnabled(false,3)
        	$('#basicTabs').setEnabled(false,4)
        	$('#basicTabs').setEnabled(false,5)
    	} else if( currentTabIdx == 3 ){
    		$('#'+currentTab).alopexGrid({columnMapping: columnDCWork });
        	$('#basicTabs').setEnabled(false,0)
        	$('#basicTabs').setEnabled(false,1)
        	$('#basicTabs').setEnabled(false,2)
        	$('#basicTabs').setEnabled(false,4)
        	$('#basicTabs').setEnabled(false,5)
    	} else if( currentTabIdx == 4 ){
    		$('#'+currentTab).alopexGrid({columnMapping: columnTMWork });
        	$('#basicTabs').setEnabled(false,0)
        	$('#basicTabs').setEnabled(false,1)
        	$('#basicTabs').setEnabled(false,2)
        	$('#basicTabs').setEnabled(false,3)
        	$('#basicTabs').setEnabled(false,5)
    	} else if( currentTabIdx == 5 ){
    		$('#'+currentTab).alopexGrid({columnMapping: columnRMEWork });
        	$('#basicTabs').setEnabled(false,0)
        	$('#basicTabs').setEnabled(false,1)
        	$('#basicTabs').setEnabled(false,2)
        	$('#basicTabs').setEnabled(false,3)
        	$('#basicTabs').setEnabled(false,4)
    	}
    	$("#"+currentTab).alopexGrid("startEdit");
    	$('#'+currentTab).alopexGrid("viewUpdate");
    }
	
	
	//request 성공시.
	function successCallback(response, status, jqxhr, flag){
		//AON/CON/SNCP 유형 코드
		if(flag == 'C01532Data'){
			var whole = cflineCommMsgArray['all'] /* 전체 */;
			dcsConnTypList = response;
			dcsConnTypComboList.push({"uprComCd":"","value":"","text":whole});
			
			for(var index = 0 ; index < dcsConnTypList.length ; index++) { 
				dcsConnTypComboList.push(dcsConnTypList[index]);
			}
			$('#acsTypeCd').setData({data : dcsConnTypComboList});
		}
		// 전송실 
		if(flag == 'tmofCmCdData'){
			//var whole = cflineCommMsgArray['all'] /* 전체 */;
			tmofDataList = response.tmofCdList;
			//tmofDataList.push({"value":"","text":whole});

//			for(var index = 0 ; index < response.getDcsConnTypList.length ; index++) { 
//				dcsConnTypComboList.push(response.getDcsConnTypList[index]);
//			}
			
			$('#tmofCd0').setData({data : tmofDataList});
			$('#tmofCd1').setData({data : tmofDataList});
			$('#tmofCd3').setData({data : tmofDataList});
			$('#tmofCd4').setData({data : tmofDataList});
			$('#tmofCd5').setData({data : tmofDataList});
	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'SettingUserTmofCd');
		}
		if(flag == 'SettingUserTmofCd'){

			if(response.userJrdtTmofInfo != null){
				var userTmofCd = "";
				// 소속전송실 셋팅
				for (var i = 0 ; i < response.userJrdtTmofInfo.length; i++) {
					if (response.userJrdtTmofInfo[i].blgtTmofYn == 'Y') {
						userTmofCd = response.userJrdtTmofInfo[i].jrdtTmofId;
						break;
					} 					
				}
//				console.log("userTmofCd=" + userTmofCd);
				if(userTmofCd != "" && userTmofCd != "0"){
					$('#tmofCd0').setSelected(userTmofCd);
					$('#tmofCd1').setSelected(userTmofCd);
					$('#tmofCd3').setSelected(userTmofCd);
					$('#tmofCd4').setSelected(userTmofCd);
					$('#tmofCd5').setSelected(userTmofCd);
				}
			}
		
		}
		
		
		
		//AON/CON/SNCP 조회 리스트
		if(flag == 'getACSList'){
			cflineHideProgressBody();
			isEditing = false;
			resetGridNoEdit();
			if(response.getACSListCnt > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}
			$('#'+currentTab).alopexGrid("dataSet", response.getACSList);
			$('#acsTotalCnt').text("("+getNumberFormatDis(response.getACSListCnt)+")");
			totalCntACS = response.getACSListCnt;
			dataACS = response.getACSList;
		}
		//SNCP_RT 조회 리스트
		if(flag == 'getSRList'){
			cflineHideProgressBody();
			isEditing = false;
			resetGridNoEdit();
			if(response.getSRListCnt > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}
			$('#'+currentTab).alopexGrid("dataSet", response.getSRList);
			$('#srTotalCnt').text("("+getNumberFormatDis(response.getSRListCnt)+")");
			totalCntSR = response.getSRListCnt;
			dataSR = response.getSRList;
		}
		//영문변환 조회 리스트
		if(flag == 'getKtEList'){
			cflineHideProgressBody();
			isEditing = false;
			resetGridNoEdit();
			if(response.getKtEListCnt > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}
			$('#'+currentTab).alopexGrid("dataSet", response.getKtEList);
			$('#kteTotalCnt').text("("+getNumberFormatDis(response.getKtEListCnt)+")");
			totalCntKtE = response.getKtEListCnt;
			dataKtE = response.getKtEList;
		}
		//DCS간 연동 조회 리스트
		if(flag == 'getDCList'){
			cflineHideProgressBody();
			isEditing = false;
			resetGridNoEdit();
			if(response.getDCListCnt > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}	
			$('#'+currentTab).alopexGrid("dataSet", response.getDCList);
			$('#dcTotalCnt').text("("+getNumberFormatDis(response.getDCListCnt)+")");
			totalCntDC = response.getDCListCnt;
			dataDC = response.getDCList;
		}
		//TIE관리 조회 리스트
		if(flag == 'getTMList'){
			cflineHideProgressBody();
			isEditing = false;
			resetGridNoEdit();
			if(response.getTMListCnt > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}
			/*if(response.getTMList.length == 0) {
				cflineHideProgressBody();
				addData = false;
				return false;
			}*/
			//renderGrid(currentTab, response.getTMList,null, response.getTMListCnt);
			
			if(!addData){
				$('#'+currentTab).alopexGrid("dataSet", response.getTMList);
			}else{
				$('#'+currentTab).alopexGrid("dataAdd", response.getTMList);
				addData = false;
			}
			
			$('#tmTotalCnt').text("("+getNumberFormatDis(response.getTMListCnt)+")");
			if(response.getTMListCnt > 0 ){
    			$('#'+currentTab).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineMsgArray['totalResult']/*총결과*/+' : ' + getNumberFormatDis(response.getTMListCnt);} } } );
    		}else{
    			$('#'+currentTab).alopexGrid('updateOption',{paging : {pagerTotal: function(paging) { return cflineMsgArray['totalResult']/*총결과*/+' : 0';} } } );
    			
    		}
			totalCntTM = response.getTMListCnt;
			totalCntTM2 = response.getTMListCnt;
			//dataTM = response.getTMList;
			
    
		}
		// OMS관리장비 조회 리스트
		if(flag == 'getRMEList'){
			cflineHideProgressBody();
			isEditing = false;
			resetGridNoEdit();
			if(response.getRMEListCnt > 0){
				$('#btnExportExcel').setEnabled(true);
	    	}
	    	else{
	    		$('#btnExportExcel').setEnabled(false);
	    	}	
			$('#'+currentTab).alopexGrid("dataSet", response.getRMEList);
			$('#rmeTotalCnt').text("("+getNumberFormatDis(response.getRMEListCnt)+")");
			totalCntRME = response.getRMEListCnt;
			dataRME = response.getRMEList;
		}
		//장비 정보 
		if(flag == "getEqpInfo"){
    		var totalCnt = response.getEqpTotalInfo;
    		if(totalCnt == 1){    		
    			cflineHideProgressBody();	
    			var focusData = $('#'+currentTab).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.data;
	    		if(currentTabIdx == 0) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpId, {_index : { row : rowIndex}}, "eqpId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpNm, {_index : { row : rowIndex}}, "eqpNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portId");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpPortChnlVal");
	    		} else if(currentTabIdx == 1) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpId, {_index : { row : rowIndex}}, "eqpId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpEnm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpTid, {_index : { row : rowIndex}}, "eqpEnm");
	    		} else if((currentTabIdx == 3) && (locEqp == "eqpNm1")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpId, {_index : { row : rowIndex}}, "eqpId1");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpNm, {_index : { row : rowIndex}}, "eqpNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortId1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortId1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal1");
	    		} else if((currentTabIdx == 3) && (locEqp == "eqpNm2")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpId, {_index : { row : rowIndex}}, "eqpId2");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpNm, {_index : { row : rowIndex}}, "eqpNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortId2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortId2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal2");
	    		} else if((currentTabIdx == 4 ) && (locEqp == "eqpNm")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpId, {_index : { row : rowIndex}}, "eqpId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpNm, {_index : { row : rowIndex}}, "eqpNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portId");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "chnlVal");
	    		} else if((currentTabIdx == 4 ) && (locEqp == "aonEqpNm")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpId, {_index : { row : rowIndex}}, "aonEqpId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "aonEqpNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpNm, {_index : { row : rowIndex}}, "aonEqpNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "aonPortId");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "aonPortNm");
	    		} else if(currentTabIdx == 5 ) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpId, {_index : { row : rowIndex}}, "eqpId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getEqpInfo[0].eqpNm, {_index : { row : rowIndex}}, "eqpNm");
	    		}
	    		$('#'+currentTab).alopexGrid("viewUpdate");
    		}else{
    			openEqpPop(currentTab,paramT);   	
    		}
    	}
		//포트 정보
		if(flag == "getPortInfo"){
    		var totalCnt = response.getPortTotalInfo;
    		if(totalCnt == 1){    	
    			cflineHideProgressBody();		
    			var focusData = $('#'+currentTab).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.data;
	    		if(currentTabIdx == 0) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portId, {_index : { row : rowIndex}}, "portId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "portNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "eqpPortChnlVal");
	    		} else if((currentTabIdx == 3) && (locPort == "lftPortNm1")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portId, {_index : { row : rowIndex}}, "lftPortId1");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "lftPortNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal1");
	    		} else if((currentTabIdx == 3) && (locPort == "lftPortNm2")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portId, {_index : { row : rowIndex}}, "lftPortId2");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "lftPortNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "lftPortChnlVal2");
	    		} else if((currentTabIdx == 3) && (locPort == "rghtPortNm1")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portId, {_index : { row : rowIndex}}, "rghtPortId1");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "rghtPortNm1");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal1");
	    		} else if((currentTabIdx == 3) && (locPort == "rghtPortNm2")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portId, {_index : { row : rowIndex}}, "rghtPortId2");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "rghtPortNm2");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "rghtPortChnlVal2");
	    		} else if((currentTabIdx == 4) && (locPort == "portNm")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portId, {_index : { row : rowIndex}}, "portId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "portNm");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "tmpPortNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "tmpPortNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "portNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "chnlVal");
	    		} else if((currentTabIdx == 4) && (locPort == "aonPortNm")) {
	    			$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portId, {_index : { row : rowIndex}}, "aonPortId");
	    			$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "aonPortNm");
					$('#'+currentTab).alopexGrid( "cellEdit", response.getPortInfo[0].portNm, {_index : { row : rowIndex}}, "aonPortNm");
					$('#'+currentTab).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "chnlVal");
	    		}
	    		$('#'+currentTab).alopexGrid("viewUpdate");
    		}else{
    			openPortPop(currentTab,objEqpId,paramT);
    		}
    	}
		//작업 정보 수정 및 데이터 생성
		if(flag == "updateEditInfo"){
			if(response.returnCode == '200'){
    			cflineHideProgressBody();
    			var overlapContent = "";
    			if(currentTabIdx == 0 && response.resultData.list.overlapCount > 0) {
    				overlapContent = cflineMsgArray['aonDuplicationCheck']/*"AON/con/SNCP 중복체크사항 <br>(장비 , 포트 , 채널)"*/;
    			} else if(currentTabIdx == 1 && response.resultData.list.overlapCount > 0) {
    				overlapContent = cflineMsgArray['sncpDuplicationCheck']/*"SNCP_RT 중복체크사항 <br>(AT622M , RT_ename , RT_kname)"*/;
    			} else if(currentTabIdx == 2 && response.resultData.list.overlapCount > 0) {
    				overlapContent = cflineMsgArray['engDuplicationCheck']/*"영문변환 중복체크사항 <br>(한글)"*/;
    			} else if(currentTabIdx == 3 && response.resultData.list.overlapCount > 0) {
    				overlapContent = cflineMsgArray['dcsDuplicationCheck']/*"DCS간연동 중복체크사항 <br>(장비1 , APORT1 , APORT1_CHNL)"*/;
    			} else if(currentTabIdx == 4 && response.resultData.list.overlapCount > 0) {
    				overlapContent = cflineMsgArray['tieMgmtDuplicationCheck']/*"TIE관리 중복체크사항 <br>(TIE , 트렁크 , 장비, 포트 , 채널 )"*/;
    			} else if(currentTabIdx == 5 && response.resultData.list.overlapCount > 0) {
    				overlapContent = cflineMsgArray['omsEqpDuplicationCheck']/*"OMS관리장비 중복체크사항 <br>( 장비 )"*/;
    			} 
    			callMsgBox('','I', cflineMsgArray['saveSuccess']/* 저장을 완료 하였습니다.*/+"<br><br>"+cflineMsgArray['success']/*성공*/+" : "+response.resultData.list.succCount+"<br>"+cflineMsgArray['duplication']/*중복*/+" : "+response.resultData.list.overlapCount+"<br>"+cflineMsgArray['totalFailureCount']/*총 실패건수*/+" : "+response.resultData.list.failCount +"<br><br>"+overlapContent, function(msgId, msgRst){  
            		if (msgRst == 'Y') {
            			searchProc('S');
            		}
            	});
    		}else if(response.returnCode == '500'){
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
		//데이터 삭제
		if(flag == "deleteEditInfo"){
			if(response.returnCode == '200'){
    			cflineHideProgressBody();
    			callMsgBox('','I', cflineMsgArray['deleteSuccess'], function(msgId, msgRst){ /* 삭제 하였습니다.*/ 
            		if (msgRst == 'Y') {
            			searchProc('D');
            		}
            	});
    		}else if(response.returnCode == '500'){
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['delFail']); /* 삭제를 실패 하였습니다.*/
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
	
		
	}

	//request 실패시.
    function failCallback(response, status, flag){
    	if(flag == 'getACSList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    		if(isEditing == true) {
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
    	if(flag == 'getSRList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    		if(isEditing == true) {
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
    	if(flag == 'getKtEList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    		if(isEditing == true) {
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
    	if(flag == 'getDCList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    		if(isEditing == true) {
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
    	if(flag == 'getTMList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    		if(isEditing == true) {
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
    	if(flag == 'getRMEList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    		if(isEditing == true) {
    			$('#'+currentTab).alopexGrid("startEdit");
    		}
    	}
    	if(flag == 'getDcsConnTypList'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'getEqpInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
    	if(flag == 'getPortInfo'){
    		cflineHideProgressBody();
    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
		//작업 정보 수정 및 데이터 생성
		if(flag == "updateEditInfo"){
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			$('#'+currentTab).alopexGrid("startEdit");
    	}
		// 삭제
		if(flag == "deleteEditInfo"){
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['delFail']); /* 삭제에 실패 하였습니다.*/
			$('#'+currentTab).alopexGrid("startEdit");
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
 
    /**
	 * 그리드 편집종료와 버튼 재세팅
	 */
	function resetGridNoEdit() {
		if( currentTabIdx == 0 ) {
    		$('#'+dataGridACS).alopexGrid({
    			columnMapping: columnACS ,
    			rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
    		});
    		$('#'+dataGridACS).alopexGrid("dataSet", dataACS);
     		$("#"+dataGridACS).alopexGrid("endEdit");
         	$('#'+dataGridACS).alopexGrid("viewUpdate");
         	$('#basicTabs').setEnabled(true,1);
        	$('#basicTabs').setEnabled(true,2);
        	$('#basicTabs').setEnabled(true,3);
        	$('#basicTabs').setEnabled(true,4);
        	$('#basicTabs').setEnabled(true,5);
        	$('#tmofCd0').setEnabled(true);
        	
     	 } else if( currentTabIdx == 1 ){
     		$('#'+dataGridSR).alopexGrid({
     			columnMapping: columnSR ,
     			rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
     		});
     		$('#'+dataGridSR).alopexGrid("dataSet", dataSR);	
     		$("#"+dataGridSR).alopexGrid("endEdit");
         	$('#'+dataGridSR).alopexGrid("viewUpdate");
         	$('#basicTabs').setEnabled(true,0);
        	$('#basicTabs').setEnabled(true,2);
        	$('#basicTabs').setEnabled(true,3);
        	$('#basicTabs').setEnabled(true,4);
        	$('#basicTabs').setEnabled(true,5);
        	$('#tmofCd1').setEnabled(true);
      	 } else if( currentTabIdx == 2 ){
      		$('#'+dataGridKtE).alopexGrid({
      			columnMapping: columnKtE ,
      			rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
      		});
         	$('#'+dataGridKtE).alopexGrid("dataSet", dataKtE);
     		$("#"+dataGridKtE).alopexGrid("endEdit");
         	$('#'+dataGridKtE).alopexGrid("viewUpdate");
         	$('#basicTabs').setEnabled(true,0);
        	$('#basicTabs').setEnabled(true,1);
        	$('#basicTabs').setEnabled(true,3);
        	$('#basicTabs').setEnabled(true,4);
        	$('#basicTabs').setEnabled(true,5);
         } else if( currentTabIdx == 3 ){
        	$('#'+dataGridDC).alopexGrid({
        		columnMapping: columnDC,
        		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
        	});
         	$('#'+dataGridDC).alopexGrid("dataSet", dataDC);
     		$("#"+dataGridDC).alopexGrid("endEdit");
         	$('#'+dataGridDC).alopexGrid("viewUpdate");
         	$('#basicTabs').setEnabled(true,0);
        	$('#basicTabs').setEnabled(true,1);
        	$('#basicTabs').setEnabled(true,2);
        	$('#basicTabs').setEnabled(true,4);
        	$('#basicTabs').setEnabled(true,5);
        	$('#tmofCd3').setEnabled(true);
     	 } else if( currentTabIdx == 4 ){
     		 //TODO
        	$('#'+dataGridTM).alopexGrid({
        		columnMapping: columnTM,
        		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
        	});
         	$('#'+dataGridTM).alopexGrid("dataSet", dataTM);
     		$("#"+dataGridTM).alopexGrid("endEdit");
         	$('#'+dataGridTM).alopexGrid("viewUpdate");
         	$('#basicTabs').setEnabled(true,0);
        	$('#basicTabs').setEnabled(true,1);
        	$('#basicTabs').setEnabled(true,2);
        	$('#basicTabs').setEnabled(true,3);
        	$('#basicTabs').setEnabled(true,5);
        	$('#tmofCd4').setEnabled(true);
     	 } else if( currentTabIdx == 5 ){
        	$('#'+dataGridRME).alopexGrid({
        		columnMapping: columnRME,
        		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
        	});
         	$('#'+dataGridRME).alopexGrid("dataSet", dataRME);
     		$("#"+dataGridRME).alopexGrid("endEdit");
         	$('#'+dataGridRME).alopexGrid("viewUpdate");
         	$('#basicTabs').setEnabled(true,0);
        	$('#basicTabs').setEnabled(true,1);
        	$('#basicTabs').setEnabled(true,2);
        	$('#basicTabs').setEnabled(true,3);
        	$('#basicTabs').setEnabled(true,4);
        	$('#tmofCd5').setEnabled(true);
     	 } 
		$('#btnAddRow').hide();
    	$('#btnSave').hide();
    	$('#btnDelete').hide();
    	$('#btnCancel').hide();
    	$('#btnRegEqp').show();
    	
	}
    //Grid 초기화
    function getGrid(tabName) {
    	if(tabName == "dataGridACS" || tabName == "All") {
    		$('#'+dataGridACS).alopexGrid({
    			pager : true,
            	autoColumnIndex: true,
        		autoResize: true,
        		cellSelectable : false,
        		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        		rowClickSelect : true,
        		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
        		numberingColumnFromZero: false,
        		defaultColumnMapping:{sorting: true},
    			fillUndefinedKey:null,
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		columnMapping: columnACS
    		 });
    	} 
    	if(tabName == "dataGridSR" || tabName == "All") { 
    		 $('#'+dataGridSR).alopexGrid({
    			 pager : true,
             	autoColumnIndex: true,
         		autoResize: true,
         		cellSelectable : false,
         		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
         		rowClickSelect : true,
         		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
         		numberingColumnFromZero: false,
         		defaultColumnMapping:{sorting: true},
     			fillUndefinedKey:null,
 	    		enableDefaultContextMenu:false,
 	    		enableContextMenu:true,
 	    		message: {
 	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
 	    		},
 	    		columnMapping: columnSR
     		 });
    	} 
    	if(tabName == "dataGridKtE" || tabName == "All") {	 
    		 $('#'+dataGridKtE).alopexGrid({
    			 pager : true,
             	autoColumnIndex: true,
         		autoResize: true,
         		cellSelectable : false,
         		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
         		rowClickSelect : true,
         		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
         		numberingColumnFromZero: false,
         		defaultColumnMapping:{sorting: true},
     			fillUndefinedKey:null,
 	    		enableDefaultContextMenu:false,
 	    		enableContextMenu:true,
 	    		message: {
 	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
 	    		},
 	    		columnMapping: columnKtE
     		 });
    	} 
    	if(tabName == "dataGridDC" || tabName == "All") {	 
    		 $('#'+dataGridDC).alopexGrid({
    			 pager : true,
             	autoColumnIndex: true,
         		autoResize: true,
         		cellSelectable : false,
         		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
         		rowClickSelect : true,
         		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
         		numberingColumnFromZero: false,
         		defaultColumnMapping:{sorting: true},
     			fillUndefinedKey:null,
 	    		enableDefaultContextMenu:false,
 	    		enableContextMenu:true,
 	    		message: {
 	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
 	    		},
 	    		columnMapping: columnDC
     		 });
    	}
    	if(tabName == "dataGridTM" || tabName == "All") {	 
   		 	 $('#'+dataGridTM).alopexGrid({
   			 	pager : true,
            	autoColumnIndex: true,
        		autoResize: true,
        		cellSelectable : false,
        		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
        		rowClickSelect : true,
        		rowSingleSelect : true,
        		rowInlineEdit : false, //행전체 편집기능 활성화
        		numberingColumnFromZero: false,
        		defaultColumnMapping:{sorting: true},
    			fillUndefinedKey:null,
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		columnMapping: columnTM
    		 });
    	}
    	if(tabName == "dataGridRME" || tabName == "All") {	 
  		 	 $('#'+dataGridRME).alopexGrid({
  			 	pager : true,
           	autoColumnIndex: true,
       		autoResize: true,
       		cellSelectable : false,
       		alwaysShowHorizontalScrollBar : true, //하단 스크롤바
       		rowClickSelect : true,
       		rowSingleSelect : true,
       		rowInlineEdit : false, //행전체 편집기능 활성화
       		numberingColumnFromZero: false,
       		defaultColumnMapping:{sorting: true},
   			fillUndefinedKey:null,
	    		enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+ cflineCommMsgArray['noInquiryData'] +"</div>"
	    		},
	    		columnMapping: columnRME
   		 });
    	}
    } 
    
    // 조회 input, selectBox 등 리셋.
    function formReset(){
//		$('#').val("");
    	if(currentTabIdx==0){
    		$('#acsEqpNm').val("");
    		$('#acsPortNm').val("");
    		$('#acsChnlNm').val("");
    		$('#acsTypeCd').val("");
    		$('#acsUserName').val("");
    		$('#acsProtection').val("");
    	}else if(currentTabIdx==1){
    		$('#srRingNm').val("");
    		$('#srEqpTid').val("");
    		$('#srEqpKorNm').val("");
    		$('#srVtulEqpNm').val("");
    		$('#srPortRmk').val("");
    		$('#srPortLablNm').val("");
    	}else if(currentTabIdx==2){
    		$('#kteHanNm').val("");
    		$('#kteEnghNm').val("");
    	}else if(currentTabIdx==3){
    		$('#eqp1Nm').val("");
    		$('#aPortNm1').val("");
    		$('#aPortChnl1').val("");
    		$('#bPortNm1').val("");
    		$('#bPortChnl1').val("");

    		$('#eqp2Nm').val("");
    		$('#aPortNm2').val("");
    		$('#aPortChnl2').val("");
    		$('#bPortNm2').val("");
    		$('#bPortChnl2').val("");    		
    	}else if(currentTabIdx==4){
    		$('#ntwkLineNm').val("");
    		$('#eqpNm').val("");
    		$('#portNm').val("");
    		$('#tieVal').val("");
    		$('#aonEqpNm').val("");
    		$('#aonPortNm').val("");
    	}else if(currentTabIdx==5){
    		$('#mgmtEqpId').val("");
    		$('#mgmtEqpNm').val("");
    		$('#mgmtEqpTid').val("");
    	}
    }
    
    function setGrid(first, last) {
	       
		if( first == "1" && last =="200"){
			
			$("#firstRowIndex").val( parseInt(first) );
			$("#lastRowIndex").val( parseInt(last) );

			$("#firstRow01").val( parseInt(first) );
			$("#lastRow01").val( parseInt(last) );
			 
		}else{
	
			$("#firstRow01").val( parseInt($("#firstRow01").val())  + parseInt(first)  ) ;
			$("#lastRow01").val( parseInt($("#lastRow01").val())  + parseInt(last)  ) ;	
			
			$("#firstRowIndex").val( parseInt($("#firstRow01").val())  ) ;
			$("#lastRowIndex").val( parseInt($("#lastRow01").val())    ) ;						
	
		}
		
    	var dataParam =  $("#searchForm").getData(); 
    	dataParam.tmofCd = dataParam.tmofCd4;
    	cflineShowProgressBody();
    	tmofCd = nullToEmpty(dataParam.tmofCd);
    	
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/oneclickconfig/oneclickconfig/gettmlist', dataParam, 'GET', 'getTMList');	
	
		 
    }	

    
    
});