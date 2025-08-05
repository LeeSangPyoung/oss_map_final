/**
 * ServiceLineWritePop.js
 *
 * @author Administrator
 * @date 2016. 11. 01
 * @version 1.0
 */
var svlnSclCdPopData = [];  // 서비스회선소분류코드 데이터
var svlnTypCdPopData = [];  // 서비스회선유형코드 데이터
var svlnCommCodePopData = [];  // 서비스회선 공통코드
var svlnLclSclCodePopData = [];  // 서비스회선 대분류 소분류코드
var TmofData = [];  // 전송실 데이터 - selectBox
var TmofAllData = [];  // 전송실 데이터 - selectBox
var gridId= 'alGrid';
var userJrdtTmofInfoPop = "";
var checkTmofData = false;
var upTmofOrgId = "";
var upTmofTeamId = "";
var lowTmofOrgId = "";
var lowTmofTeamId = "";
var enabledYn = false;

$a.page(function() {

    this.init = function(id, param) {
    	createMgmtGrpSelectBox("mgmtGrpCdPop", "N", $('#userMgmtCd').val());  // 관리 그룹 selectBox
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
    	//setSearchCode("hdofcCdPop", "teamCdPop", "tmofCdPop");
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', null, 'GET', 'svlnCommCodePopData');
    	// 관리그룹
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188');
    	//전송실
    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');

    	// 팝업용 사용자관할전송실
    	searchUserJrdtTmofInfoPop("mgmtGrpCdPop");
    }
    
    function validationCheck() {
    	var lineNmPop = $('#lineNmPop'); // 회선명
		var mgmtGrpCdPop = $('#mgmtGrpCdPop'); // 관리그룹
		var svlnLclCdPop = $('#svlnLclCdPop');  // 서비스회선대분류
		var svlnSclCdPop = $('#svlnSclCdPop'); // 서비스회선 소분류
		var svlnStatCdPop = $('#svlnStatCdPop'); // 서비스회선상태
		var lineCapaCdPop= $('#lineCapaCdPop'); // 회선용량
		var b2bCustNmPop=$('#b2bCustNmPop');//B2B고객명
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
		var upTmofCd= $('#upTmofCd'); // 상위국사전송실
		var lowTmofCd= $('#lowTmofCd'); // 하위국사전송실
		
		 
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
		/*if(nullToEmpty(svlnSclCdPop.val()) == ""){
			svlnSclCdPop.focus();
 			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineScl'],"","","")); "서비스 회선 소분류를 선택해 주세요.;
 			return false;
 		}*/
		
		// START-시뮬레이션용 체크 
		// 회선명
		if(nullToEmpty(lineNmPop.val()) == ""){
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

		// B2B고객명
		if(nullToEmpty(b2bCustNmPop.val()) == ""){
			alertBox('W', makeArgMsg('required',cflineMsgArray['businessToBusinessCustomerName'],"","","")); /*"회선용량 선택해 주세요.;*/
			return false;
		}
		if(nullToEmpty(b2bCustNmPop.val()).length >100){
			svlnLclCdPop.focus();
        	var msgArg = cflineMsgArray['businessToBusinessCustomerName'];
        	var msgArg1 = 100;
        	alertBox('W', makeArgMsg('maxLengthPossible',msgArg,msgArg1,"",""));	/* B2B고객명 항목은 100자까지 입력가능합니다. */
        	return false;
    	}
		// 용량
		if(nullToEmpty(lineCapaCdPop.val()) == ""){
			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['lineCapacity'],"","","")); /*"회선용량 선택해 주세요.;*/
			return false;
		}
		return true;
		// END -시뮬레이션용 체크
		
		
		// ----------------------------------등록정보---------------------------------
		//미지정
		if(svlnLclCdPop.val() == "000"){
			if(nullToEmpty(lineNmPop.val()) == ""){
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
			if(nullToEmpty(lineNmPop.val()) == ""){
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
		//ru회선
		else if(svlnLclCdPop.val() == "003"){
			if(nullToEmpty(lineNmPop.val()) == ""){
				lineNmPop.focus();
				alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
				return false;
			}
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
			/*if(nullToEmpty(svlnStatCdPop.val()) == ""){
				svlnStatCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineStatus'],"","","")); "서비스회선상태를 선택해 주세요.;
				return false;
			}*/
			if(nullToEmpty(chrStatCdPop.val()) == ""){
				chrStatCdPop.focus();
				alertBox('W', makeArgMsg('selectObject',cflineMsgArray['chargingStatus'],"","","")); /*"과금상태를 선택해 주세요.;*/
				return false;
			}
			if(nullToEmpty(lineCoreCntPop.val()) == ""){
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
			if(nullToEmpty(dnrSystmNmPop.val()) == ""){
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
			if(nullToEmpty(lineNmPop.val()) == ""){
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
			if(nullToEmpty(lineNmPop.val()) == ""){
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
		}
		//기타회선
		else if(svlnLclCdPop.val() == "006"){
			if(svlnSclCdPop.val() == "102" || svlnSclCdPop.val() == "105"){
				if(nullToEmpty(lineNmPop.val()) == ""){
					lineNmPop.focus();
					alertBox('W', makeArgMsg('required',cflineMsgArray['lnNm'],"","","")); /*"회선명 필수 입력 항목입니다.;*/
					return false;
				}
				if (svlnSclCdPop.val() != "102") {
					if(nullToEmpty(srsLineYnPop.val()) == ""){
						srsLineYnPop.focus();
						alertBox('W', makeArgMsg('selectObject',cflineMsgArray['seriousLineYesOrNo'],"","","")); /*"중요회선여부를 선택해 주세요.;*/
						return false;
					}
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
				if(nullToEmpty(lineCoreCntPop.val()) == ""){
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
				if(nullToEmpty(dnrSystmNmPop.val()) == ""){
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
			}else{
				if(nullToEmpty(lineNmPop.val()) == ""){
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
		
		//전송실 설정(전송실설정은 필수가 아님)
		/*if(nullToEmpty(upTmofCd.val()) == ""){
			upTmofCd.focus();
			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['upperMtso'] + cflineMsgArray['transmissionOffice'],"","","")); " 상위국사전송실 선택해 주세요.;
			return false;
		}
		if(nullToEmpty(lowTmofCd.val()) == ""){
			lowTmofCd.focus();
			alertBox('W', makeArgMsg('selectObject',cflineMsgArray['lowerMtso'] + cflineMsgArray['transmissionOffice'],"","","")); " 하위국사전송실 선택해 주세요.;
			return false;
		}*/
		return true;
    }
    
    function setTmofData(){
    	//httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofData');
    }
    
    function setEventListener() { 
    	// 관리그룹 클릭시 	
    	$('#mgmtGrpCdPop').on('change',function(e){
    		//changeMgmtGrp("mgmtGrpCdPop", "hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
     		changeSvlnLclCd('svlnLclCdPop', 'svlnSclCdPop', svlnLclSclCodePopData, "mgmtGrpCdPop", "S"); // 서비스회선소분류 selectbox 제어	
     		changeSvlnSclCdSimul('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어	
			//makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");

			//setTmofData(); //전송실 selectbox 제어
      	});    	 
    	// 서비스회선대분류코드 선택시
    	$('#svlnLclCdPop').on('change', function(e){
    		changeSvlnSclCdSimul('svlnLclCdPop', 'svlnSclCdPop', svlnSclCdPopData, "mgmtGrpCdPop"); // 서비스회선소분류 selectbox 제어
			//makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
			//makeSvlnTypCdSelectBox("svlnSclCdPop", "svlnTypCdPop", svlnTypCdPopData, "S");  // 서비스회선유형 selectbox 제어
      	});     	 
    	// 서비스회선소분류코드 선택시
    	$('#svlnSclCdPop').on('change', function(e){
    		//makeChangeAarea("svlnLclCdPop", "svlnSclCdPop");
    		//makeSvlnTypCdSelectBox("svlnSclCdPop", "svlnTypCdPop", svlnTypCdPopData, "S");  // 서비스회선유형 selectbox 제어
      	});  
    	// 본부 선택시
    	$('#hdofcCdPop').on('change',function(e){
    		//changeHdofc("hdofcCdPop", "teamCdPop", "tmofCdPop", "mtsoPop");
      	});    	 
  		// 팀 선택시
    	$('#teamCdPop').on('change',function(e){
    		//changeTeam("teamCdPop", "tmofCdPop", "mtsoPop");
      	});
    	//  
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
    	});
    	
		//상위국사찾기
		$('#btnUprMtsoPopSch').on('click', function(e) {
			//openMtsoPop("uprMtsoIdPop", "uprMtsoIdNmPop");

			var paramValue = "";

			paramValue = {"mgmtGrpNm": $('#mgmtGrpCdPop option:selected').text(), "tmof": $('#upTmofCd option:selected').val()
					,"mtsoNm": $('#uprMtsoIdNmPop').val(), "regYn" : "Y", "mtsoStatCd" : "01", "orgId" : upTmofOrgId, "teamId" : upTmofTeamId }
			//console.log(paramValue);
			openMtsoDataPop("uprMtsoIdPop", "uprMtsoIdNmPop", paramValue);	
		}); 
		//하위국사찾기
		$('#btnLowMtsoPopSch').on('click', function(e) {
			//openMtsoPop("lowMtsoIdPop", "lowMtsoIdNmPop");
			var paramValue = "";

			paramValue = {"mgmtGrpNm": $('#mgmtGrpCdPop option:selected').text(), "tmof": $('#lowTmofCd option:selected').val()
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
			console.log(paramValue);
			openMtsoDataGridPop(gridId, "mtsoCd", "mtsoNm", paramValue); // (그리드ID, 국사코드필드, 국사명필드)
		});	
        
		
    	//닫기
   	 	$('#btnPopClose').on('click', function(e) {
   	 		$a.close(null);
   	 	    /*var testParam = {};
   	 	    testParam.Result = "OK_REG";
   	 	    testParam.serviceLineVO = " ";
   	 		$a.close(testParam);*/
        });    	
    	 
    	//확인
    	 $('#btnPopWrite').on('click', function(e) {
    		 if ( validationCheck() == true){
	          	 var dataParam =  $("#insertPopForm").getData();
	          	 //회선상태:예비
	          	 dataParam.svlnStatCd = '001';
	          	 var mtsoLnoInsVO = [];
	     		 var params = $('#'+gridId).alopexGrid('dataGet');
	          	 
	     		mtsoLnoInsVO = {"mtsoLnoList"	:params,
								"upTmofCd" 		: $('#upTmofCd').val(),
								"upMtsoCd" 	: $('#uprMtsoIdPop').val(),
								"lowTmofCd" 	: $('#lowTmofCd').val(),
								"lowMtsoCd"	: $('#lowMtsoIdPop').val()
							 };
	     		
	    		$.extend(dataParam,{"mtsoLnoInsVO":mtsoLnoInsVO});
	    		
	          	 //console.log(dataParam);
	          	 callMsgBox('','C', cflineMsgArray['save'], function(msgId, msgRst){  
	         		if (msgRst == 'Y') {
	         			cflineShowProgressBody();
	         			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelinesimul/insertvtulserviceline', dataParam, 'POST', 'insertVtulServiceLine');
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
					
					if (nullToEmpty(dataOption.uprComCd) =="003" && nullToEmpty(dataOption.value) == '103') {   // RU회선
						//$('#' + svlnSclId).find("option[value='103']").remove();  // RU(CMS수집)
					    continue;
					}
					
					if (nullToEmpty(dataOption.uprComCd) =="006" && nullToEmpty(dataOption.value) == '105') {   // 기타회선
						//$('#' + svlnSclId).find("option[value='105']").remove();  // (구)NITS회선
						continue;
					}					
					
					svlnSclCd_option_data.push(dataOption);
				}				
				svlnSclCd2_option_data.push(dataOption);
				
			}		
			svlnSclCdPopData = svlnSclCd2_option_data;	
			$('#svlnSclCdPop').clear();
			$('#svlnSclCdPop').setData({data : svlnSclCd_option_data});		
			// 서비스회선유형코드
			//setSelectBox("svlnTypCdPop", response.svlnTypCdList, "");
			
			svlnTypCdPopData = response.svlnTypCdList;
		}    
		// 서비스 회선에서 사용하는 코드
		if(flag == 'svlnCommCodePopData') {	
			svlnCommCodePopData = response;
			// 회선 용량
			setSelectBox("lineCapaCdPop", svlnCommCodePopData.svlnCapaCdList, "");
		}    
		if(flag == "insertVtulServiceLine"){
			cflineHideProgressBody();
			if(response.Result == "Success"){
				response.Result = "OK_REG";
				// 용량명 설정
				var lineCapaCdNm = $('#lineCapaCdPop').getTexts();
				response.serviceLineVO.lineCapaCdNm = lineCapaCdNm.length > 0 ? lineCapaCdNm[0] : "";
				$a.close(response);
			}else{
				alertBox("W", cflineMsgArray['saveFail']);
				return;
				//$a.close("Fail");
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
			
			changeSvlnLclCd('svlnLclCdPop', 'svlnSclCdPop', svlnLclSclCodePopData, "mgmtGrpCdPop", "S");
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
    				}
    				var dataTmofCd = response.tmofCdList[m]; 		
    				if($('#mgmtGrpCdPop').val()==dataTmofCd.mgmtGrpCd){
        				tmof_option_data.push(dataTmofCd);    					
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
		if (mgmtGrpCdData.length > 0 /*&&  checkTmofData == true*/ ) {
			cflineHideProgressBody();
		}
    }
    
    //request 실패시.
    function failCallback(response, status, flag){
    	cflineHideProgressBody();
    	if(flag == "insertVtulServiceLine"){
			alertBox("W", cflineMsgArray['saveFail']);
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
});