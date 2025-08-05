/**
 * ServiceLineWritePop.js
 *
 * @author Administrator
 * @date 2016. 11. 01
 * @version 1.0
 * 
 * 
 ************* 수정이력 ************
 * 2023-11-08  1. [수정] 기타_예비회선 추가 
 */
var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터
var svlnTypCdPopData = [];  // 서비스회선유형코드 데이터
var svlnCommCodePopData = [];  // 서비스회선 공통코드
var svlnLclSclCodePopData = [];  // 서비스회선 대분류 소분류코드
var gridMgmtGrpCdData = [{value: "0001",text: "SKT"},{value: "0002",text: "SKB"}];
var TmofData = [];  // 전송실 데이터 - selectBox
var TmofSktData = [];		/* 전송실 데이터 :	SKT */
var TmofSkbData = [];		/* 전송실 데이터 :	SKB */
var TmofAllData = [];  // 전송실 데이터 - selectBox
var gridId= 'alGrid';
var userJrdtTmofInfoPop = "";
var checkTmofData = false;
var upTmofOrgId = "";
var upTmofTeamId = "";
var lowTmofOrgId = "";
var lowTmofTeamId = "";

var initSvlnLclCd = ""; //조회화면에서 넘어온 서비스회선대분류코드
var initSvlnSclCd = "";	//조회화면에서 넘어온 서비스회선소분류코드
var chkDcnArea = false;

$a.page(function() {

    this.init = function(id, param) {
    	initSvlnLclCd = param.svlnLclCd;
    	initSvlnSclCd = param.svlnSclCd;
    	
    	createMgmtGrpSelectBox("mgmtGrpCdPop", "N");  // 관리 그룹 selectBox
    	userJrdtTmofInfoPop = "";
    	checkTmofData = false;
    	setSelectCode();
        setEventListener();   
        initGrid();
    };
   
    //Grid 초기화
    function initGrid() {
// 
    	var mappingMtso = [
	               		  { selectorColumn : true, width : '40px' }
	            		  , {key : 'mgmtGrpCd', align:'center', width:'150px', title : cflineMsgArray['managementGroup'] /*  관리그룹 */
	            		    	, render : {  type: 'string'
	  				                 , rule: function (value,data){
	  				                	 var render_data = [];				            				    
			            				    if (mgmtGrpCdData.length >1) {	
			            				    	return render_data = render_data.concat( mgmtGrpCdData );	    								
			            				    }else{
			    								return render_data.concat({value : data.mgmtGrpCd, text : data.mgmtGrpNm});	
			    							}
				    			}}
				         		,  editable : { type: 'select', rule: function(value, data) { return mgmtGrpCdData; } 
					         		, attr : {
	  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
	  	      			 			} 
				         		}
				    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
				         	}
		            	  , {key : 'tmofCd', align:'center', width:'280px', title : cflineMsgArray['transmissionOffice'] /*전송실*/

				  			, render : { type:'string',
				  					rule : function(value, data){
				  						var render_data = [];
				  						var currentData = AlopexGrid.currentData(data);
				  						if (TmofData[currentData.mgmtGrpCd]) {
				  							return render_data = render_data.concat(TmofData[currentData.mgmtGrpCd]);
				  						} else {
				  							return render_data.concat({value : data.tmofCd, text : data.tmofNm});
				  						}
				  					}
				  				},
				  				editable : {type : 'select', 
				  					rule : function(value, data){
				  						var render_data = [];
				  						var currentData = AlopexGrid.currentData(data);
				  						if (TmofData[currentData.mgmtGrpCd]) {
				  							return render_data = render_data.concat(TmofData[currentData.mgmtGrpCd]);
				  						} else {
				  							return render_data.concat({value : data.tmofCd, text : data.tmofNm});
				  						}
				  					}
					         		, attr : {
	  	      			 				style : "width: 250px;min-width:250px;padding: 3px 3px;"
	  	      			 			} 
				  				},
				      			editedValue : function (cell) {
				  					return $(cell).find('select option').filter(':selected').val();
				  				},
				  				refreshBy: 'mgmtGrpCd'		
		            		}
	   			          , {key : 'mtsoCd'	, title : cflineMsgArray['mtsoCode'] /*국사코드*/ , align:'center', width: '200px'
		   						, render : function(value, data) {
		   							if(nullToEmpty(value) == ""){
		   								return (nullToEmpty(data.mtsoCd) == "") ? "" : data.mtsoCd;
		   							}else{  
		   								return value;
		   							}
		   						}  			        	  
		   			          }
		   			       , {key : 'mtsoNm'	, title : cflineMsgArray['mtsoName'] /*국사명*/ , align:'left', width: '310px'
		   						, render : function(value, data) {
		   							var celStr = cflineMsgArray['mtsoName'] /*국사명*/;
		   							if(nullToEmpty(value) == ""){
		   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
		   							}else{  
		   								celStr = value;
		   							}
		   							//celStr = '<div class="textsearch_1 Float-left" style="width:310px"><span class="Label label">' + celStr +'</span><button class="Button search" id="btnMtsoGridSch" type="button"></button></div>';
		   							//celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" id="btnMtsoGridSch" type="button"></button><button class="grid_del_icon Valign-md" id="btnMtsoGridDel" type="button"></button></div>';
		   							//celStr = '<div class="textsearch_1 Float-left" style="width:310px">' + celStr +' </div>';
	       				     return celStr;
		   						}			          
		   			            ,editable:  { type: 'text' }
		   			            ,allowEdit : function(value, data, mapping) { return true; }
		   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
		   			          }  				
		   			       ,{key : 'mtsoNmbtn',value : function(value, data) {return null;}, width: '40px',render : {type : 'btnMtsoGridSch'} 
		   			        }	          
	            		
	   			          ];
    	
        //그리드 생성 
        $('#'+gridId).alopexGrid({
        	columnMapping : mappingMtso,
			cellSelectable : false,
			//autoColumnIndex: true,
			//fitTableWidth: true,
			pager : false,
			rowClickSelect : false,
			rowInlineEdit : false,
			rowSingleSelect : false,
			numberingColumnFromZero : false,
			height : 200	
			,
            headerGroup : [
    		               {fromIndex:"mostNm", toIndex:"mtsoNmbtn", title: cflineMsgArray['mtsoName'] , hideSubTitle:true},
    		],
            renderMapping : {
    			"btnMtsoGridSch" : {
    				renderer : function(value, data, render, mapping) {
    				    return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnMtsoGridSch" type="button"></button></div>';
    	            }
    			}
    		}
        });    	
        
        var hideColList = ['mtsoCd'];
        $('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

		
		$('#'+gridId).on('dblclick', '.bodycell', function(e){
				
				var event = AlopexGrid.parseEvent(e);
				var selected = event.data._state.selected;
				
				$('#'+gridId).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true )
				
				var editing_list = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
				
				for(var i = 0; i < editing_list.length; i++){
					$('#'+gridId).alopexGrid('endEdit', {_index: {id: editing_list[i]._index.id}})
				}
				
				if (checkRowData() == true) {
					var ev = AlopexGrid.parseEvent(e);
					$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
				}
		});

		
		$('#'+gridId).on('dataAddEnd', function(e){
			var addRowIndex = $('#'+gridId).alopexGrid('dataGet').length-1; //전체 행 가져오기
			$('#'+gridId).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "tmofCd" );
			//$('#'+gridId).alopexGrid("focusCell", {_index : {data : addRowIndex}}, "tmofId" );
		});
    };
    
    function setSelectCode() {
    	cflineShowProgressBody();
    	setSearchCode("hdofcCdPop", "teamCdPop", "tmofCdPop");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', null, 'GET', 'svlnCommCodePopData');
    	// 관리그룹
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188');
    	//전송실
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');

    	// 팝업용 사용자관할전송실
    	searchUserJrdtTmofInfoPop("mgmtGrpCdPop");
		$('#upMgmtGrpCdPop').clear();
    	$('#upMgmtGrpCdPop').setData({data : gridMgmtGrpCdData});
		$('#lowMgmtGrpCdPop').clear();
    	$('#lowMgmtGrpCdPop').setData({data : gridMgmtGrpCdData});
    }
    
    function validationCheck() {
    	$('#'+gridId).alopexGrid("endEdit",{ _state : { editing : true }});
    	var lineNmPop = $('#lineNmPop'); // 회선명
		var mgmtGrpCdPop = $('#mgmtGrpCdPop'); // 관리그룹
		var upMgmtGrpCdPop = $('#upMgmtGrpCdPop'); // 전송실설정 상위 관리그룹
		var lowMgmtGrpCdPop = $('#lowMgmtGrpCdPop'); // 전송실설정 하위 관리그룹
		var svlnLclCdPop = $('#svlnLclCdPop');  // 서비스회선대분류
		var svlnSclCdPop = $('#svlnSclCdPop'); // 서비스회선 소분류
		var svlnStatCdPop = $('#svlnStatCdPop'); // 서비스회선상태
		var lineCapaCdPop= $('#lineCapaCdPop'); // 회선용량
		var faltMgmtObjYnPop = $('#faltMgmtObjYnPop'); // 고장관리대상여부
		var svlnTypCdPop = $('#svlnTypCdPop'); // 서비스회선유형
		var svlnNoPop = $('#svlnNoPop'); // 서비스회선번호
		var uprSystmNmPop = $('#uprSystmNmPop'); //상위시스템명
		var lowSystmNmPop = $('#lowSystmNmPop'); //하위시스템명
		var srsLineYnPop = $('#srsLineYnPop'); // 중요회선여부
		var lesTypCdPop= $('#lesTypCdPop'); // 임차유형
		var chrStatCdPop = $('#chrStatCdPop'); // 과금상태
		var lineCoreCntPop= $('#lineCoreCntPop'); // 회선코어수
		var dnrSystmNmPop= $('#dnrSystmNmPop'); // 도너시스템명
		var b2bCustNmPop=$('#b2bCustNmPop');//B2B고객명
		var upTmofCd= $('#upTmofCd'); // 상위국사전송실
		var lowTmofCd= $('#lowTmofCd'); // 하위국사전송실
		var lineRmkOne= $('#lineRmkOnePop');	//비고1
		var lineRmkTwo= $('#lineRmkTwoPop');	//비고2
		var lineRmkThree= $('#lineRmkThreePop');	//비고3
		var lineUsePerdTypCdPop= $('#lineUsePerdTypCdPop');	//회선사용기간유형
		
		 
		//회선선택 정보
		if(nullToEmpty(mgmtGrpCdPop.val()) == ""){
			mgmtGrpCdPop.focus();
			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['managementGroup'],"","","")); /*"관리그룹를 선택해 주세요.;*/
			return false;
		}
		if(nullToEmpty(svlnLclCdPop.val()) == ""){
			svlnLclCdPop.focus();
 			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineLcl'],"","","")); /*"서비스 회선 대분류를 선택해 주세요.;*/
 			return false;
 		}
		if(nullToEmpty(svlnSclCdPop.val()) == ""){
			svlnSclCdPop.focus();
 			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineScl'],"","","")); /*"서비스 회선 소분류를 선택해 주세요.;*/
 			return false;
 		}
		
		// ----------------------------------등록정보---------------------------------
		//미지정
		if(svlnLclCdPop.val() == "000"){
			if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
				lineNmPop.focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
				return false;
			}
			if(nullToEmpty(lineNmPop.val()).length >100){
				lineNmPop.focus();
            	var msgArg = cflineMsgArray['lnNm'];
            	var msgArg1 = 100;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
            	return false;
        	}
			if(nullToEmpty(lineCapaCdPop.val()) == ""){
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['lineCapacity'],"","","")); /*"회선용량 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(faltMgmtObjYnPop.val()) == ""){
				faltMgmtObjYnPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['faultManagementObjectYesOrNo'],"","","")); /*"회선용량 선택해 주세요.;*/
				return false;
			}
		}
		//기지국회선
		else if(svlnLclCdPop.val() == "001"){
			if(svlnSclCdPop.val() == "020" ){
				if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
					lineNmPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
					return false;
				}
				if(nullToEmpty(lineNmPop.val()).length >100){
					lineNmPop.focus();
	            	var msgArg = cflineMsgArray['lnNm'];
	            	var msgArg1 = 100;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(lineUsePerdTypCdPop.val()) == ""){	// 필수체크 : 회선사용기간유형을 입력하지 않았을때
					lineUsePerdTypCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['lineUsePeriodType'],"","","")); /*"회선사용기간유형을 선택해 주세요.;*/
					return false;
				}
			}else{
				if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
					lineNmPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
					return false;
				}
				if(nullToEmpty(lineNmPop.val()).length >100){
					lineNmPop.focus();
	            	var msgArg = cflineMsgArray['lnNm'];
	            	var msgArg1 = 100;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(svlnTypCdPop.val()) == ""){
					svlnTypCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineType'],"","","")); /*"서비스회선유형 선택해 주세요.;*/
					return false;
				}
				if(nullToEmpty(faltMgmtObjYnPop.val()) == ""){
					faltMgmtObjYnPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['faultManagementObjectYesOrNo'],"","","")); /*"고장관리대상여부 선택해주세요.;*/
					return false;
				}
				if(nullToEmpty(uprSystmNmPop.val()).length >50){
					uprSystmNmPop.focus();
	            	var msgArg = cflineMsgArray['upperSystemName'];
	            	var msgArg1 = 50;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 상위시스템명 항목은 50자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(lowSystmNmPop.val()).length >50){
					lowSystmNmPop.focus();
	            	var msgArg = cflineMsgArray['lowSystemName'];
	            	var msgArg1 = 50;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 하위시스템명 항목은 50자까지 입력가능합니다. */
	            	return false;
	        	}
			}
		}
		//ru회선
		else if(svlnLclCdPop.val() == "003"){
			if(nullToEmpty(srsLineYnPop.val()) == ""){
				srsLineYnPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['seriousLineYesOrNo'],"","","")); /*"중요회선여부를 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(lesTypCdPop.val()) == ""){
				lesTypCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['networkType'],"","","")); /*"망유형을 선택해주세요.;*/
				return false;
			}
			if(nullToEmpty(svlnStatCdPop.val()) == ""){
				 svlnStatCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineStatus'],"","","")); /*"서비스회선상태를 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(chrStatCdPop.val()) == ""){
				chrStatCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['chargingStatus'],"","","")); /*"과금상태를 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(lineCoreCntPop.val()) == "" || lineCoreCntPop.val().replace(/ /gi,"") == ""){
				lineCoreCntPop.focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['lineCoreCount'],"","","")); /*"회선코어수 필수 입력 항목입니다.;*/
				return false;
			}
			if(nullToEmpty(lineCoreCntPop.val()).length >22){
				lineCoreCntPop.focus();
            	var msgArg = cflineMsgArray['lineCoreCount']
            	var msgArg1 = 22;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선코어수 항목은 150자까지 입력가능합니다. */
            	return false;
        	}
			if(nullToEmpty(dnrSystmNmPop.val()) == "" || dnrSystmNmPop.val().replace(/ /gi,"") == ""){
				dnrSystmNmPop.focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['donorSystemName'],"","","")); /*"도너시스템 필수 입력 항목입니다.;*/
				return false;
			}
			if(nullToEmpty(dnrSystmNmPop .val()).length >150){
				dnrSystmNmPop.focus();
            	var msgArg = cflineMsgArray['donorSystemName']
            	var msgArg1 = 150;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 도너시스템명 항목은 150자까지 입력가능합니다. */
            	return false;
        	}
		}
		//가입자망회선
		else if(svlnLclCdPop.val() == "004"){
			if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
				lineNmPop.focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
				return false;
			}
			if(nullToEmpty(lineNmPop.val()).length >100){
				lineNmPop.focus();
            	var msgArg = cflineMsgArray['lnNm'];
            	var msgArg1 = 100;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
            	return false;
        	}
			if(nullToEmpty(svlnStatCdPop.val()) == ""){
				 svlnStatCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineStatus'],"","","")); /*"서비스회선상태를 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(faltMgmtObjYnPop.val()) == ""){
				faltMgmtObjYnPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['faultManagementObjectYesOrNo'],"","","")); /*"고장관리대상여부 선택해주세요.;*/
				return false;
			}
		}
		//B2B
		else if(svlnLclCdPop.val() == "005"){
			if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
				lineNmPop.focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
				return false;
			}
			if(nullToEmpty(lineNmPop.val()).length >100){
				lineNmPop.focus();
            	var msgArg = cflineMsgArray['lnNm'];
            	var msgArg1 = 100;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
            	return false;
        	}
			if(nullToEmpty(svlnTypCdPop.val()) == ""){
				svlnTypCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineType'],"","","")); /*"서비스회선유형 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(chrStatCdPop.val()) == ""){
				chrStatCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['chargingStatus'],"","","")); /*"과금상태를 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(b2bCustNmPop.val()).length >100){
				svlnLclCdPop.focus();
            	var msgArg = cflineMsgArray['businessToBusinessCustomerName'];
            	var msgArg1 = 100;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* B2B고객명 항목은 100자까지 입력가능합니다. */
            	return false;
        	}
		}else if (svlnLclCdPop.val() == "007"){
			if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
				lineNmPop.focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
				return false;
			}
			if(nullToEmpty(lineNmPop.val()).length >100){
				lineNmPop.focus();
            	var msgArg = cflineMsgArray['lnNm'];
            	var msgArg1 = 100;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
            	return false;
        	}
			if(nullToEmpty(svlnStatCdPop.val()) == ""){
				 svlnStatCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineStatus'],"","","")); /*"서비스회선상태를 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(lineRmkOne.val()).length >2000){
				lineRemark1.focus();
            	var msgArg = cflineMsgArray['lineRemark1'];
            	var msgArg1 = 2000;
            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선비고1 항목은 2000자까지 입력가능합니다. */
            	return false;
        	}
		}
		//기타회선
		else if(svlnLclCdPop.val() == "006"){
			if(svlnSclCdPop.val() == "102" || svlnSclCdPop.val() == "105"){
				if(nullToEmpty(srsLineYnPop.val()) == ""){
					srsLineYnPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['seriousLineYesOrNo'],"","","")); /*"중요회선여부를 선택해 주세요.;*/
					return false;
				}
				if(nullToEmpty(lesTypCdPop.val()) == ""){
					lesTypCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['rentType'],"","","")); /*"임차유형을 선택해주세요.;*/
					return false;
				}
				if(nullToEmpty(svlnStatCdPop.val()) == ""){
					 svlnStatCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineStatus'],"","","")); /*"서비스회선상태를 선택해 주세요.;*/
					return false;
				}
				if(nullToEmpty(chrStatCdPop.val()) == ""){
					chrStatCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['chargingStatus'],"","","")); /*"과금상태를 선택해 주세요.;*/
					return false;
				}
				if(nullToEmpty(lineCoreCntPop.val()) == "" || lineCoreCntPop.val().replace(/ /gi,"") == ""){
					lineCoreCntPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['lineCoreCount'],"","","")); /*"회선코어수 필수 입력 항목입니다.;*/
					return false;
				}
				if(nullToEmpty(lineCoreCntPop.val()).length >22){
					lineCoreCntPop.focus();
	            	var msgArg = cflineMsgArray['lineCoreCount']
	            	var msgArg1 = 22;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선코어수 항목은 150자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(dnrSystmNmPop.val()) == "" || dnrSystmNmPop.val().replace(/ /gi,"") == ""){
					dnrSystmNmPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['donorSystemName'],"","","")); /*"도너시스템 필수 입력 항목입니다.;*/
					return false;
				}
				if(nullToEmpty(dnrSystmNmPop .val()).length >150){
					dnrSystmNmPop.focus();
	            	var msgArg = cflineMsgArray['donorSystemName']
	            	var msgArg1 = 150;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 도너시스템명 항목은 150자까지 입력가능합니다. */
	            	return false;
	        	}
			} else if (svlnSclCdPop.val() == "061") {		// 20181122 중계기정합장치
				if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
					lineNmPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
					return false;
				}
				if(nullToEmpty(lineNmPop.val()).length >100){
					lineNmPop.focus();
	            	var msgArg = cflineMsgArray['lnNm'];
	            	var msgArg1 = 100;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(svlnStatCdPop.val()) == ""){	// 필수체크 : 서비스회선상태를 입력하지 않았을때
					 svlnStatCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineStatus'],"","","")); /*"서비스회선상태를 선택해 주세요.;*/
					return false;
				}
				if(nullToEmpty(svlnStatCdPop.val()) == "300"){
					 svlnStatCdPop.focus();
					 alertBox('W', "해지요청중은 청약을 통해서만 신청이 가능합니다.");
					 return false;
				}
				if(nullToEmpty(chrStatCdPop.val()) == ""){
					chrStatCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['chargingStatus'],"","","")); /*"과금상태를 선택해 주세요.;*/
					return false;
				}
			} else if(svlnSclCdPop.val() == "070" || svlnSclCdPop.val() == "071" || svlnSclCdPop.val() == "072"  || svlnSclCdPop.val() == "106"){		// 2018-12-26 DCN, RMS, IP정류기, 20230918 예비회선
				if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
					lineNmPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
					return false;
				}
				if(nullToEmpty(lineNmPop.val()).length >100){
					lineNmPop.focus();
	            	var msgArg = cflineMsgArray['lnNm'];
	            	var msgArg1 = 100;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
	            	return false;
	        	}
				if(svlnSclCdPop.val() != "106") {	//예비회선이 아닌 경우에만 체크한다.
					if(nullToEmpty(lineUsePerdTypCdPop.val()) == ""){	// 필수체크 : 회선사용기간유형을 입력하지 않았을때
						lineUsePerdTypCdPop.focus();
						alertBox('W', makeArgMsg('selectObject',cflineMsgArray['lineUsePeriodType'],"","","")); /*"회선사용기간유형을 선택해 주세요.;*/
						return false;
					}
				}
				if(nullToEmpty(lineRmkOne.val()).length >2000){
					lineRemark1.focus();
	            	var msgArg = cflineMsgArray['lineRemark1'];
	            	var msgArg1 = 2000;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선비고1 항목은 2000자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(lineRmkTwo.val()).length >2000){
					lineRemark2.focus();
	            	var msgArg = cflineMsgArray['lineRemark2'];
	            	var msgArg1 = 2000;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선비고2 항목은 2000자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(lineRmkThree.val()).length >2000){
					lineRemark3.focus();
	            	var msgArg = cflineMsgArray['lineRemark3'];
	            	var msgArg1 = 2000;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선비고3 항목은 2000자까지 입력가능합니다. */
	            	return false;
	        	}
			} else {
				if(nullToEmpty(lineNmPop.val()) == "" || lineNmPop.val().replace(/ /gi,"") == ""){
					lineNmPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
					return false;
				}
				if(nullToEmpty(lineNmPop.val()).length >100){
					lineNmPop.focus();
	            	var msgArg = cflineMsgArray['lnNm'];
	            	var msgArg1 = 100;
	            	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* 회선명 항목은 100자까지 입력가능합니다. */
	            	return false;
	        	}
				if(nullToEmpty(svlnTypCdPop.val()) == ""){
					svlnTypCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineType'],"","","")); /*서비스회선유형 선택해 주세요.*/
					return false;
				}
				if(nullToEmpty(lineCapaCdPop.val()) == ""){
					lineCapaCdPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['lineCapacity'],"","","")); /*"회선용량 선택해 주세요.;*/
					return false;
				}
				if(nullToEmpty(faltMgmtObjYnPop.val()) == ""){
					faltMgmtObjYnPop.focus();
					alertBox('W', makeArgMsg('selectObject',cflineMsgArray['faultManagementObjectYesOrNo'],"","","")); /*"회선용량 선택해 주세요.;*/
					return false;
				}
			}
		}
		// ----------------------------------등록정보---------------------------------
		
		//전송실 설정
		if(nullToEmpty(upTmofCd.val()) == ""){
			upTmofCd.focus();
			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['upperMtso'] + cflineMsgArray['transmissionOffice'],"","","")); /*" 상위국사전송실 선택해 주세요.;*/
			return false;
		}
		if(nullToEmpty(lowTmofCd.val()) == ""){
			lowTmofCd.focus();
			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['lowerMtso'] + cflineMsgArray['transmissionOffice'],"","","")); /*" 하위국사전송실 선택해 주세요.;*/
			return false;
		}
		
		if(mgmtGrpCdPop.val() != upMgmtGrpCdPop.val() && mgmtGrpCdPop.val() != lowMgmtGrpCdPop.val() && getGridMgmt(mgmtGrpCdPop.val()) == 0){
			var sMgmtGrpNm = mgmtGrpCdPop.val() == "0001"? "SKT":"SKB";
			var msgArg = "상위국사, 하위국사, PATH전송실 리스트 중  관리그룹이 " + sMgmtGrpNm + " 인 국사가 1개이상 존재해야 합니다."; /* 하위국사 */
			alertBox('I', msgArg);
			$('#'+gridId).alopexGrid("startEdit");
				return false;
		}
		
		
		return true;
    }
    
    function setTmofData(){
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');
    }
    
    function setEventListener() { 
    	// 관리그룹 클릭시 	
    	$('#mgmtGrpCdPop').on('change',function(e){
    		//changeMgmtGrp("mgmtGrpCdPop", "hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
     		changeSvlnLclCd('svlnLclCdPop', 'svlnSclCdPop', svlnLclSclCodePopData, "mgmtGrpCdPop", "S"); // 서비스회선소분류 selectbox 제어	
     		changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어	
			makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
			
			// ADAMS 연동 고도화
			if ($('#mgmtGrpCdPop').val() == '0002') {
				$('#svlnLclCdPop').setSelected("004");
				$('#svlnLclCdPop').setEnabled(false);
			 } else {
				 $('#svlnLclCdPop').setEnabled(true);
			 }
			
			var topMgmtGrpCd = $('#mgmtGrpCdPop').val();
			$('#upMgmtGrpCdPop').setSelected(topMgmtGrpCd);
			$('#lowMgmtGrpCdPop').setSelected(topMgmtGrpCd);
			
			//setTmofData(); //전송실 selectbox 제어
      	});    	 
    	// 서비스회선대분류코드 선택시
    	$('#svlnLclCdPop').on('change', function(e){
    		changeSvlnSclCd('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어
			makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
			//makeSvlnTypCdSelectBox("svlnSclCdPop", "svlnTypCdPop", svlnTypCdPopData, "S");  // 서비스회선유형 selectbox 제어
      	});     	 
    	// 서비스회선소분류코드 선택시
    	$('#svlnSclCdPop').on('change', function(e){
    		makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
    		//makeSvlnTypCdSelectBox("svlnSclCdPop", "svlnTypCdPop", svlnTypCdPopData, "S");  // 서비스회선유형 selectbox 제어
      	});  
    	// 본부 선택시
    	$('#hdofcCdPop').on('change',function(e){
    		changeHdofc("hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
      	});    	 
  		// 팀 선택시
    	$('#teamCdPop').on('change',function(e){
    		changeTeam("teamCdPop", "tmofCdPop", "mtsoPop");
      	});
    	
    	// 상위국사 관리그룹
    	$('#upMgmtGrpCdPop').on('change',function(e){
    		gridMgmtGrpCdChange('up')
      	});
    	// 하위국사 관리그룹
    	$('#lowMgmtGrpCdPop').on('change',function(e){
    		gridMgmtGrpCdChange('low')
      	});
    	
    	
    	// 상위국사 전송실
    	$('#upTmofCd').on('change',function(e){
    		var tmofId = $('#upTmofCd').val();
    		var tmpMgmt = "";
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(tmofId == dataS.value){
    					upTmofOrgId = dataS.hdofcCd;
    					upTmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}
    		$('#uprMtsoIdNmPop').val("");
    		$('#uprMtsoIdPop').val("");
    	});
    	// 하위국사 전송실
    	$('#lowTmofCd').on('change',function(e){
    		var tmofId = $('#lowTmofCd').val();
    		var tmpMgmt = "";
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(tmofId == dataS.value){
    					lowTmofOrgId = dataS.hdofcCd;
    					lowTmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}
    		$('#lowMtsoIdNmPop').val("");
    		$('#lowMtsoIdPop').val("");
    	});
    	
		//상위국사찾기
		$('#btnUprMtsoPopSch').on('click', function(e) {
			//openMtsoPop("uprMtsoIdPop", "uprMtsoIdNmPop");

			var paramValue = "";

			paramValue = {"mgmtGrpNm": $('#upMgmtGrpCdPop option:selected').text(), "tmof": $('#upTmofCd option:selected').val()
					,"mtsoNm": $('#uprMtsoIdNmPop').val(), "regYn" : "Y", "mtsoStatCd" : "01", "orgId" : upTmofOrgId, "teamId" : upTmofTeamId }
			//console.log(paramValue);
			openMtsoDataPop("uprMtsoIdPop", "uprMtsoIdNmPop", paramValue);	
		});  
		//하위국사찾기
		$('#btnLowMtsoPopSch').on('click', function(e) {
			//openMtsoPop("lowMtsoIdPop", "lowMtsoIdNmPop");
			var paramValue = "";

			paramValue = {"mgmtGrpNm": $('#lowMgmtGrpCdPop option:selected').text(), "tmof": $('#lowTmofCd option:selected').val()
					,"mtsoNm": $('#lowMtsoIdNmPop').val(), "regYn" : "Y", "mtsoStatCd" : "01", "orgId": lowTmofOrgId, "teamId" : lowTmofTeamId }
			//console.log(paramValue);			
			openMtsoDataPop("lowMtsoIdPop", "lowMtsoIdNmPop", paramValue);	
		});
		//상위시스템국사찾기
		$('#btnUprSystmMtsoSch').on('click', function(e) {
			openMtsoPop("uprSystmMtsoIdPop", "uprSystmMtsoIdNmPop");
		}); 
		//하위시스템국사찾기
		$('#btnLowSystmMtsoSch').on('click', function(e) {
			openMtsoPop("lowSystmMtsoIdPop", "lowSystmMtsoIdNmPop");
		});     	
		
		// 그리드 행추가
		$('#btnAddRow').on('click', function(e) {
			addRow();
        });
        
        // 그리드 행삭제
        $('#btnRemoveRow').on('click', function(e) {
        	removeRow();
        });
        
        //그리드 국사찾기 팝업
		$('#'+gridId).on('click', '#btnMtsoGridSch', function(e){
    		$('#'+gridId).alopexGrid("endEdit", { _state : { editing : true }} );
	 	 	var dataObj = AlopexGrid.parseEvent(e).data;
	 	 	var rowIndex = dataObj._index.row;
	 	 	var mgmtGrpNm = dataObj.mgmtGrpCd == "0001"? "SKT":"SKB";

	 	 	var tmofOrgId = "";
	 	 	var tmofTeamId = "";
	 	 	
    	 	if(TmofAllData != null && TmofAllData.length > 0){
    			for(m=0; m<TmofAllData.length; m++){
    				var dataS = TmofAllData[m];  
    				if(dataObj.tmofCd == dataS.value){
    					tmofOrgId = dataS.hdofcCd;
    					tmofTeamId = dataS.teamCd;
    					break;
    				}
    			}
    	 	}	 	 	
	 	 	
			var paramValue = "";
			paramValue = {"mgmtGrpNm": mgmtGrpNm,"tmof": dataObj.tmofCd,"mtsoNm": nullToEmpty(dataObj.mtsoNm), "regYn" : "Y", "mtsoStatCd" : "01", "orgId" : tmofOrgId, "teamId" : tmofTeamId }
			//console.log(paramValue);
			openMtsoDataGridPop(gridId, "mtsoCd", "mtsoNm", paramValue); // (그리드ID, 국사코드필드, 국사명필드)
		});	
        
		
    	//닫기
   	 	$('#btnPopClose').on('click', function(e) {
   	 		$a.close(null);
        });    	
    	 
    	//확인
    	 $('#btnPopWrite').on('click', function(e) {
    		 if ( validationCheck() == true){
	          	var dataParam =  $("#insertPopForm").getData();
	          	if(dataParam.svlnSclCd == "020"){
		          	dataParam.svlnTypCd = '125';
	          	}
	          	var mtsoLnoInsVO = [];
	     		var params = $('#'+gridId).alopexGrid('dataGet');
	     		mtsoLnoInsVO = {"mtsoLnoList":params,
	     									"upTmofCd" : $('#upTmofCd').val(),
	     									"upMtsoCd" : $('#uprMtsoIdPop').val(),
	     									"lowTmofCd" : $('#lowTmofCd').val(),
	     									"lowMtsoCd": $('#lowMtsoIdPop').val()
	     								 };
	    		$.extend(dataParam,{"mtsoLnoInsVO":mtsoLnoInsVO});
	    		
	          	 console.log(dataParam);
	          	 callMsgBox('','C', cflineMsgArray['save'], function(msgId, msgRst){  
	         		if (msgRst == 'Y') {
	         			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/insertserviceline', dataParam, 'POST', 'insertServiceLine');
	         		}
	         	});
    		 }else {
    			 return;
    		 }
         }); 
	};
	
	//초기 조회 성공시
    function successCallback(response, status, jqxhr, flag){
		// 서비스 회선에서 사용하는 대분류, 소분류, 유형 코드
		if(flag == 'svlnLclSclCodeData') {	
//			$('#svlnLclCdPop').clear();
//			$('#svlnLclCdPop').setData({data : response.svlnLclCdList});
//			$('#svlnLclCdPop').prepend('<option value="">전체</option>');
//			$('#svlnLclCdPop').setSelected("");
//			
//			var svlnSclCd_pop_option_data =  [];
//			for(k=0; k<response.svlnSclCdList.length; k++){
//				if(k==0){
//					var dataFst = {"uprComCd":"","value":"","text":"전체"};
//					svlnSclCd_pop_option_data.push(dataFst);
//				}
//				var dataOption = response.svlnSclCdList[k];  
//				svlnSclCd_pop_option_data.push(dataOption);
//			}		
//			svlnSclCdPopData = svlnSclCd_pop_option_data;	
//			$('#svlnSclCdPop').clear();
//			$('#svlnSclCdPop').setData({data : svlnSclCdPopData});

			var tmpMgmtCd = $('#mgmtGrpCdPop').val();
			svlnLclSclCodePopData = response;
			var svlnLclCd_option_data =  [];
			
			for(i=0; i<response.svlnLclCdList.length; i++){
				if(i==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['select']};
					svlnLclCd_option_data.push(dataFst);
				}
				var dataL = response.svlnLclCdList[i]; 
				if(nullToEmpty(tmpMgmtCd) != "0001" || nullToEmpty(dataL.value) != "004" ){
					svlnLclCd_option_data.push(dataL);
				}
				
			}
			$('#svlnLclCdPop').clear();
			$('#svlnLclCdPop').setData({data : svlnLclCd_option_data});	
			
			var svlnSclCd_option_data =  [];
			var svlnSclCd2_option_data =  [];
			for(k=0; k<response.svlnSclCdList.length; k++){
				if(k==0){
					var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['select']};
					svlnSclCd_option_data.push(dataFst);
					svlnSclCd2_option_data.push(dataFst);
				}
				var dataOption = response.svlnSclCdList[k]; 

				if(nullToEmpty(tmpMgmtCd) != "0001" || nullToEmpty(dataOption.uprComCd) != "004" ){
					svlnSclCd_option_data.push(dataOption);
				}				
				svlnSclCd2_option_data.push(dataOption);
				
			}		
			svlnSclCdPopData = svlnSclCd2_option_data;	
			$('#svlnSclCdPop').clear();
			$('#svlnSclCdPop').setData({data : svlnSclCd_option_data});	

//			console.log("svlnSclCd2_option_data");	
//			console.log(svlnSclCd2_option_data);	
//			console.log("svlnSclCdPopData");	
//			console.log(svlnSclCdPopData);
			
			// SKT에서는 등록버튼이 활성화 되지 않으나 DCN망과 중계기정합장치에서는 활성화가 되기때문에 회선선택부분을 모두 disabled 처리해준다.
			// DCN, RMS, IP정류기 추가 2019-01-08
			// WCDMA (IPND) 추가 2019-03-06
			// 교환기, 상호접속, WCDMA (NODEB) 추가 2020-11-11
			// 유선백본망추가
			// 기타_예비회선 추가 2023-11-08
			if( (initSvlnLclCd == "006" && ( initSvlnSclCd == "060" || initSvlnSclCd == "061" || initSvlnSclCd == "070" || initSvlnSclCd == "071" || initSvlnSclCd == "072" || initSvlnSclCd == "106" ))
				|| ( initSvlnLclCd == "001" && ( initSvlnSclCd == '001' || initSvlnSclCd == '003' || initSvlnSclCd == '012' || initSvlnSclCd == "020"))
				|| ( initSvlnLclCd == "007" && ( initSvlnSclCd == '080'))
			) {
				chkDcnArea = true;
				if(initSvlnLclCd == "006"){
					$('#svlnLclCdPop').setSelected("006");	
					if( initSvlnSclCd == "060" ) {
						$('#svlnSclCdPop').setSelected("060");	
					} else if( initSvlnSclCd == "061" ) {
						$('#svlnSclCdPop').setSelected("061");	
					} else if( initSvlnSclCd == "070" ) {
						$('#svlnSclCdPop').setSelected("070");	
					} else if( initSvlnSclCd == "071" ) {
						$('#svlnSclCdPop').setSelected("071");	
					} else if( initSvlnSclCd == "072" ) {
						$('#svlnSclCdPop').setSelected("072");	
					} else if( initSvlnSclCd == "106" ) {
						$('#svlnSclCdPop').setSelected("106");	
					}
				}else if(initSvlnLclCd == "001"){
					$('#svlnLclCdPop').setSelected("001");	
					if( initSvlnSclCd == "001" ) {
						$('#svlnSclCdPop').setSelected("001");	
					}else if( initSvlnSclCd == "003" ) {
						$('#svlnSclCdPop').setSelected("003");	
					}else if( initSvlnSclCd == "012" ) {
						$('#svlnSclCdPop').setSelected("012");	
					}else if( initSvlnSclCd == "020" ) {
						$('#svlnSclCdPop').setSelected("020");	
					}
				}else if(initSvlnLclCd == "007"){
					$('#svlnLclCdPop').setSelected("007");
					if( initSvlnSclCd == "080" ) {
						$('#svlnSclCdPop').setSelected("080");	
					}
					makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
				}
				
				makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
	        	
	        	$('#mgmtGrpCdPop').attr('disabled', 'true');
	        	$('#svlnLclCdPop').attr('disabled', 'true');
	        	$('#svlnSclCdPop').attr('disabled', 'true');
			}
			
			// 서비스회선유형코드
			setSelectBox("svlnTypCdPop", response.svlnTypCdList, "");
			svlnTypCdPopData = response.svlnTypCdList;
		}    
		// 서비스 회선에서 사용하는 코드
		// 기타_예비회선 추가 2023-11-08
		if(flag == 'svlnCommCodePopData') {	
			svlnCommCodePopData = response;
			if( ( initSvlnLclCd == "006" && ( initSvlnSclCd == "060" || initSvlnSclCd == "061" || initSvlnSclCd == "070" || initSvlnSclCd == "071" || initSvlnSclCd == "072"  || initSvlnSclCd == "106" ) )
					|| (initSvlnLclCd == "001"&& ( initSvlnSclCd == '001' || initSvlnSclCd == '003' || initSvlnSclCd == '012' || initSvlnSclCd == "020")) && chkDcnArea == true
					|| ( initSvlnLclCd == "007" && ( initSvlnSclCd == '080'))
		    ) {
				makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
			}
		}    
		if(flag == "insertServiceLine"){
			if(response.Result == "Success"){
				$a.close(response);
			}else{
				$a.close("Fail");
			}
		}
		// 관리그룹
		if(flag == "C00188"){
			var mgmtGrpCd_option_data =  [];
			for(k=0; k<response.length; k++){
				var dataMgmtGrp = response[k];  
				mgmtGrpCd_option_data.push(dataMgmtGrp);
			}		
			mgmtGrpCdData = mgmtGrpCd_option_data;
	    		    	
	    	// 소속전송실에 속한 관리그룹이 있는 경우
			if ($('#userJrdtTmofMgmtCdPop').val() != undefined) {
				var userJrdtTmofMgmtCd = $('#userJrdtTmofMgmtCdPop').val();
				if( (initSvlnLclCd == "006" && ( initSvlnSclCd == "060" || initSvlnSclCd == "061" || initSvlnSclCd == "070" || initSvlnSclCd == "071" || initSvlnSclCd == "072" || initSvlnSclCd == "106" ))
						|| ( initSvlnLclCd == "001" && ( initSvlnSclCd == '001' || initSvlnSclCd == '003' || initSvlnSclCd == '012' || initSvlnSclCd == "020") )
					) {
			    	// 소속전송실이 있다하더라도 서비스회선 대분류, 소분류 코드가 <기타-DCN망(OTDR) / 중계기정합장치> 이라면 소속전송실의 관리그룹에 상관없이 SKT를 설정
			    	$('#mgmtGrpCdPop').setSelected("0001");
			    	$('#mgmtGrpCdPop').attr('disabled', 'true');
			    }
				
				// 소속전송실에 속한 관리그룹이 있는 경우 소속전송실의 관리그룹으로 설정
			    if (userJrdtTmofMgmtCd != "" && $('#mgmtGrpCdPop').find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1) {
			    	$('#mgmtGrpCdPop').setSelected(userJrdtTmofMgmtCd);
			    } else {
			    	// 소속전송실에 속한 관리그룹이 없는 경우
			    	$('#mgmtGrpCdPop').setSelected($('#userMgmtCdPop').val());
			    }			
			} else {
				// 소속전송실에 속한 관리그룹이 없는 경우
				$('#mgmtGrpCdPop').setSelected($('#userMgmtCdPop').val());
			}
    	}
		
		if(flag == "tmofData"){
			checkTmofData = true;
    		if(response.tmofCdList != null && response.tmofCdList.length>0){
    			// 전송실 select 처리
    			var tmof_option_data =  [];
    			for(m=0; m<response.tmofCdList.length; m++){
    				if(m==0){
    					var dataFst = {"value":"","text":cflineCommMsgArray['select'] /* 선택 */};
    					tmof_option_data.push(dataFst);
    					TmofSktData.push(dataFst);
    					TmofSkbData.push(dataFst);
    				}
    				var dataTmofCd = response.tmofCdList[m]; 		
    				if($('#mgmtGrpCdPop').val()==dataTmofCd.mgmtGrpCd){
        				tmof_option_data.push(dataTmofCd);    					
    				}
    				if(dataTmofCd.mgmtGrpCd =='0001'){
    					TmofSktData.push(dataTmofCd);
    				}else if(dataTmofCd.mgmtGrpCd =='0002'){
    					TmofSkbData.push(dataTmofCd);
    				}
    			}    
    			TmofAllData = response.tmofCdList;
    			$('#upTmofCd').clear();
				$('#upTmofCd').setData({data : tmof_option_data});
    			$('#lowTmofCd').clear(); 
				$('#lowTmofCd').setData({data : tmof_option_data});
    		}else{
    			$('#upTmofCd').clear();
    			$('#lowTmofCd').clear();    			
    		}
    		if(response.tmofListCombo != null){
    			TmofData = response.tmofListCombo;
    		}
    	}
		
		// 각 관리그룹, SKT전송실, SKB전송실이 모두 취득된 후 화면편집이 가능하도록
		if (mgmtGrpCdData.length > 0 &&  checkTmofData == true ) {
			cflineHideProgressBody();
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	cflineHideProgressBody();
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

    function setSelectBox(idName, list, setKeyValue){
		$('#' + idName).clear();
		if(list != null && list.length>0){
			$('#' + idName).setData({data : list});
		}
		$('#' + idName).prepend('<option value="">' + cflineCommMsgArray['select']/* 선택 */ + '</option>');
		$('#' + idName).setSelected(setKeyValue);	
    }
    
    function addRow() {

    	/*var tmofCd = TmofData[mgmtGrpCdData[0].value][0].value;
    	var tmofNm = TmofData[mgmtGrpCdData[0].value][0].text;*/
    	
    	var mgmtGrpCdPopNum = 0;
    	if ($('#mgmtGrpCdPop').val() == '0002') {
    		mgmtGrpCdPopNum = 1;
    	}
    	var tmofCd = TmofData[$('#mgmtGrpCdPop').val()][0].value;
    	var tmofNm = TmofData[$('#mgmtGrpCdPop').val()][0].text;
    	
    	$('#'+gridId).alopexGrid("startEdit");    
    	var initRowData = [
    	    {
	   	    	 "mgmtGrpCd" : mgmtGrpCdData[mgmtGrpCdPopNum].value //mgmtGrpCdData[0].value 
	 	    	, "mgmtGrpNm" : mgmtGrpCdData[mgmtGrpCdPopNum].text //mgmtGrpCdData[0].text
	 	    	, "tmofCd" : tmofCd 
	 	    	, "tmofNm" : tmofNm
	 	    	, "mtsoCd" : ''
	 	    	, "mostNm" : ''
    	    }
    	];
    	$('#'+gridId).alopexGrid("dataAdd", initRowData);
    	$('#'+gridId).alopexGrid("startEdit");
    }
    
    function removeRow() {
    	var dataList = $('#alGrid').alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		alertBox('I', cflineMsgArray['selectNoData']); /* 선택된 데이터가 없습니다.*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];    		
    		var rowIndex = data._index.data;
    		$('#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    	
    }
    
    function gridMgmtGrpCdChange(upLow) {
    	if(upLow == 'up'){
    		$('#upTmofCd').clear(); 
			if($('#upMgmtGrpCdPop').val() == "0001"){
				$('#upTmofCd').setData({data : TmofSktData});
			} else {
				$('#upTmofCd').setData({data : TmofSkbData});
			}
			$('#uprMtsoIdNmPop').val("");
    		$('#uprMtsoIdPop').val("");
    	} else { 
    		$('#lowTmofCd').clear(); 
			if($('#lowMgmtGrpCdPop').val() == "0001"){
				$('#lowTmofCd').setData({data : TmofSktData});
			} else {
				$('#lowTmofCd').setData({data : TmofSkbData});
			}
			$('#lowMtsoIdNmPop').val("");
    		$('#lowMtsoIdPop').val("");
    	}
    }
    
    function getGridMgmt(mgmtTyp){
    	var mgmtData = $('#'+gridId).alopexGrid("dataGet", {"mgmtGrpCd" : mgmtTyp });
    	return mgmtData.length;
    }
    
    
});