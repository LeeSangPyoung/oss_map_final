/**
 * PopAddBizDiv.js
 *
 * @author P095783
 * @date 2016. 7. 13.
 * @version 1.0
 */
var yearChk = null;		//년도
var prntCdList = [];		//부모코드
var erpBizList = [];		//ERP사업구분
var cdDivChk = null;   //코드구분
var demdDivCdList = []; //수요구분
var demdInvtDivList = []; // 장비/선로 구분
var basDsnYnList = [ {text : demandMsgArray['select'], value : ''}, {text : 'Y', value : 'Y'}, {text : 'N', value : 'N'}]; // 기본설계여부
var bizPurpDivYList = [ {text : demandMsgArray['select'] /*선택*/, value : ''}, {text : 'Y', value : '001'}]; // 통합국사여부
var bizKndList = []; 	//사업종류리스트
var sccpyList = []; 	//도급사리스트
var erpBizTypList = []; 	//erp사업유형리스트
var erpEqpTypCdList = []; // 장비/선로명
var areaCharType = null;

$a.page(function() {
	
	//그리드 ID
    var gridId = 'bizDivGrid';
    
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	selectErpBizList();
    	selectDemdDivCdList();
    	selectBizKndList();
    	selectDemdInvtDivList();
    	selectSccpyList();
    	selectErpBizTypList();
    	setCombo();
    	setEventListener();
    	areaCharType = null; 
    	
    	if (cdDivChk == null || cdDivChk == '') {
			$("#btnSaveBizDiv").setEnabled(false);
    		$("#btnAddRow").setEnabled(false);
    		$("#btnRemoveRow").setEnabled(false);
		}
    };
    
  //Grid 초기화
    function initGrid() {
		var mapping = [
			{
				width:'40px',
				key : 'check',
				selectorColumn : true
			}
			, {
				key : 'check',
				align:'center',
				width:'40x',
				title : demandMsgArray['sequence'] /*순번*/,
				numberingColumn : true
			}
    		, {
				key : 'afeYr',
				align:'center',
				width:'60px',
				title : demandMsgArray['byYear'] /*년도*/,
			}, {
				align:'center',
				width:'100px',
				title : demandMsgArray['codeDivision'] /*코드구분*/,
				render : function(value, data) {
					if ( cdDivChk == '' ){
						if (data.prntBizDivCd == "C00618") {
							return demandMsgArray['businessDivisionBig'] /*사업구분(대)*/;
					    } else{
					    	return demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/;
					    }
					}else if ( cdDivChk == "TB01" ){
						return demandMsgArray['businessDivisionBig'] /*사업구분(대)*/;
					}else {
						return demandMsgArray['businessDivisionDetl'] /*사업구분(세부)*/;
					}
				}
			}
    		, {
				key : 'demdBizDivCd',
				align:'center',
				width:'90px',
				title : demandMsgArray['businessDivisionCode'] /*사업구분코드*/
				//,editable: true
			}
    		, {
				key : 'prntBizDivCd',
				align:'left',
				width:'140px',
				title : demandMsgArray['businessDivisionBig'], /*사업구분(대)*///demandMsgArray['parentCode'] /*부모코드*/,
				/*render : function(value, data){
					if (value == 'C00618'){
						return '';
					} else {
						return {type: 'string', rule: function(value, data){ return [].concat(prntCdList);}};
					}
				},*/
    		    render : {type: 'string', rule: function(value, data){ return [].concat(prntCdList);}},
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				},
				editable : { type: 'select', rule: function(value, data) { return prntCdList; } },
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}
    		, {
				key : 'demdBizDivNm',
				align:'left',
				width:'220px',
				title : '<em class="color_red">*</em>'+ demandMsgArray['businessDivisionName'] /*사업구분명*/
    			, treeColumn:true, treeColumnHeader:false
				,editable : true
			}    		
    		, {
				key : 'move',
				width:'30x',
				dragdropColumn : true
			}
    		, {
				key : 'scrnDispTurnVal',
				align:'right',
				width:'100px',
				title : '<em class="color_red">*</em>'+demandMsgArray['screenDisplayTurn'] /*화면표시순서*/,
				//validate : { rule : { number:true }},    	            		                   
				//editable : { type: "text", styleclass : 'num_editing-in-grid', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "5"}}
			}
    		,{
    			key : 'demdDivCd',
    			align:'left',
    			width:'100px',	
    			title: demandMsgArray['demandDivision'] /*수요구분*/,
				render : {type: 'string', rule: function(value, data){ return [].concat(demdDivCdList);}},
				editable : { type: 'select', rule: function(value, data) { return demdDivCdList; } },
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
    		}
    		, {
				key : 'erpBizDivCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['enterpriseResourcePlanningBusinessDivision'] /*ERP사업구분*/,
				allowEdit : function(){
					if( cdDivChk == 'TB01' ) {
						return true;
					}
					return false;
				},
				render : {type: 'string', rule: function(value, data){ return [].concat(erpBizList);}},
				editable : { type: 'select', rule: function(value, data) { return erpBizList; }, tooltip : 'A-Z or 0-9' },
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
			}
    		, {
    			key : 'erpBizTypCd',
				align:'center',
				width:'100px',
				title :  '<em class="color_red">*</em>' + 'ERP사업유형',
				allowEdit : function(value, data, mapping){
					if( cdDivChk == 'TB02') {
						return true;
					}
					return false;
				},
				render : {type: 'string', rule: function(value, data){
					return [].concat(erpBizTypList);
					}
				},
				editable : { type: 'select', rule: function(value, data) { return erpBizTypList; }},
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
				, hidden : true
    		}
    		, {
				key : 'erpDetlBizDemdDgr',
				align:'left',
				width:'120px',
				title : demandMsgArray['erpDetailBizDegree'] /*ERP세부사업차수*/,
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				}
				, editable : {   type: 'text' , attr : {  "data-keyfilter-rule" : "uppercase", "data-keyfilter":"0-9", "maxlength" : "3"} }
				
			}
    		, {
				key : 'erpBdgtDtlCd',
				align:'right',
				width:'120px',
				title : demandMsgArray['enterpriseResourcePlanningBudgetDetailCode'] /*ERP예산상세코드*/,
				hidden : true,
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				}
				, editable : { type: 'text', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6", "minlength" : "6"} , styleclass : 'num_editing-in-grid'}
			}
    		, {
    			key : 'demdInvtDivCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['eqpLnDivison'] /*장비/선로구분*/,
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				},
				render : {type: 'string'
					    , rule: function(value, data){ 
						    	if( data.prntBizDivCd != "C00618" ) {
						    		if (nullToEmpty(data.demdInvtDivCd) == "" ) {
						    			data.demdInvtDivCd = '' ;
						    		}
						    		return [].concat(demdInvtDivList);						    								    		
								} else {
									if (value != '' ) {
										return [].concat(demdInvtDivList);
									} else {
										return '';										
									}
								}					    	
					    	}
			    },
				editable : { type: 'select', rule: function(value, data) { return demdInvtDivList;}},
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
				//,hidden :true
    		}
    		, {
    			key : 'erpEqpTypVal',  
				align:'left',
				width:'110px',
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				},
				render : {type: 'string', rule: function(value, data){
						return nullToEmpty(value);
					}
				}
				/*,editable : { type: 'text', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6", "minlength" : "6"} , styleclass : 'num_editing-in-grid'}	
				, editedValue : function (cell) {
					return  nullToEmpty($('#erpEqpTypCdList').val()).toString(); 
				}*/
				,hidden :true
    		}
    		, {
    			key : 'erpEqpTypNm',
				align:'left',
				title : demandMsgArray['erpEqp'] /*ERP장비*/,
				width:'110px',
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				}
    		   , editable : function(value, data, render, mapping) {
    		    	var multiSelect ='<button type="button" class="ui-multiselect ui-widget ui-state-defalut ui-corner-all Multiselect " aria-haspopup="true" style="width:100px;">'; 
					multiSelect +='<span class="ui-icon ui-icon-triangle-1-s"></span>'; 					
					multiSelect +='</button>';
					return multiSelect;
    		    }
				, hidden:false
    		}
    		, {
    			key : 'lnsccpyCd',
				align:'left',
				width:'100px',
				title : '선로 도급사',
				allowEdit : function(value, data, mapping){
					if( cdDivChk == 'TB02' && data.demdInvtDivCd != "102001") {
						return true;
					}
					return false;
				},
				render : {type: 'string', rule: function(value, data){
					if(data.demdInvtDivCd == "102001")		return "";
					return [].concat(sccpyList);
					}
				},
				editable : { type: 'select', rule: function(value, data) {
					var returnData = [];
					if(data.demdInvtDivCd == "" || data.demdInvtDivCd == "102002"){
						var cnt = 0;
						for(var i = 0 ; i < sccpyList.length; i++){
							if(i == 0){
								returnData[cnt] = sccpyList[0];
								cnt++;
							}
							if(sccpyList[i].value == "O＆S" || sccpyList[i].value == "SKEC" || sccpyList[i].value == "SKB"){
								returnData[cnt] = sccpyList[i];
								cnt++;
							}
						}
					}
					
					return returnData; 
					} 
				},
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
				//,hidden :true
    		}
    		, {
    			key : 'eqpsccpyCd',
				align:'left',
				width:'100px',
				title : '장비 도급사',
				allowEdit : function(value, data, mapping){
					if( cdDivChk == 'TB02' && data.demdInvtDivCd != "102002") {
						return true;
					}
					return false;
				},
				render : {type: 'string', rule: function(value, data){
					if(data.demdInvtDivCd == "102002")		return "";
					return [].concat(sccpyList);
					}
				},
				editable : { type: 'select', rule: function(value, data) { 
					var returnData = [];
					if(data.demdInvtDivCd == "" || data.demdInvtDivCd == "102001"){
						var cnt = 0;
						for(var i = 0 ; i < sccpyList.length; i++){
							if(i == 0){
								returnData[cnt] = sccpyList[0];
								cnt++;
							}
							if(sccpyList[i].value == "XILIX" || sccpyList[i].value == "SKED" || sccpyList[i].value == "UBINS"){
								returnData[cnt] = sccpyList[i];
								cnt++;
							}
						}
					}
					
					return returnData; 
					} 
				},
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
				//,hidden :true
    		}
    		
    		, {
    			key : 'orgDemdInvtDivCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['eqpLnDivison'] /*장비/선로구분*/
				,hidden :true
    		}
    		, {
    			key : 'bizPurpDivCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['integrationmobileTelephoneSwitchingOfficeYesOrNo'], /*통합국사여부*/
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				},
				render : {type: 'string'
					, rule: function(value, data){ 
						if( cdDivChk == 'TB02' ) {
							return [].concat(bizPurpDivYList);
						} else if( cdDivChk == 'TB01' ) {
							return '';
						} else {
							return [].concat(bizPurpDivYList);
						}
					}
				}
				, editable : { type: 'select', rule: function(value, data) { return bizPurpDivYList; } }
				, editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
    		}
    		/*function (cell, data, render, mapping, grid){
				if(value == '001'){
				return $(cell).find('input').prop('checked', true);
			}else{
				return $(cell).find('input').prop('checked', false);
			} }*/
    		/*if(value == '001'){
				return $(cell).find('input').prop('checked', true);
			}else{
				return $(cell).find('input').prop('checked', false);
			}*/
    		// [{value:'001', checked:true}, {value:'', checked:false}]
    		, {
    			key : 'basDsnYn',
				align:'left',
				width:'100px',
				title : demandMsgArray['baseDesignYesOrNo'] /*기본설계여부*/,
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				},				
				render : {type: 'string'
					, rule: function(value, data){ 
						if( cdDivChk == 'TB02' ) {
							return [].concat(basDsnYnList);
						} else if( cdDivChk == 'TB01' ) {
							return '';
						} else {
							return [].concat(basDsnYnList);
						}
					}
				},
				editable : { type: 'select', rule: function(value, data) { return basDsnYnList; } },
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
    		}
    		, {
    			key : 'bizKndCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['businessKind'] /*사업종류*/,
				allowEdit : function(){
					if( cdDivChk == 'TB02' ) {
						return true;
					}
					return false;
				},
				render : function(value, data){
					if( cdDivChk == 'TB02' ) {
						return {type: 'string', rule: function(value, data){ return [].concat(bizKndList);}};
						//return [].concat(bizKndList);
					} else if( cdDivChk == 'TB01' ) {
						return '';
					} else {
						//return [].concat(bizKndList);
						if (data.prntBizDivCd == 'C00618') {
							return '';	
						} else {							
							return {type: 'string', rule: function(value, data){ return [].concat(bizKndList);}};
						}
							
					}
				},
				editable : { type: 'select', rule: function(value, data) { return bizKndList; } },
				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
    		}
    		, {
				key : 'hdqtrChrrId',
				align:'center',
				width:'100px',
				title : demandMsgArray['headquartersThePersonInCharge'] /*본사담당자*/,
				hidden : true
    		}
    		, {
				key : 'hdqtrChrrNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['headquartersThePersonInCharge'] /*본사담당자*/,
				render : function(value, data) {
					if( cdDivChk ==''){
						/*if(data.prntBizDivCd == 'C00618'){
							return '';
						} else{
							var celStr = "";
							if (nullToEmpty(data.hdqtrChrrId) != "") {
								celStr = value;
							}
       				        //celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
							//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="hdqtrChrrIdBtn"></button></div>';
							return celStr;
						}*/	
						return value;
					} else if(cdDivChk == 'TB01'){
						return '';
					} else {
						var celStr = '';
						if (nullToEmpty(data.hdqtrChrrId) != "") {
							celStr = value;
						}
						celStr = nullToEmpty(celStr) == '' ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : celStr;	
						celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
						
						//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="hdqtrChrrIdBtn"></button></div>';
						return celStr;
					}
				}
			}
    		, {
				key : 'areaSoodoChrgUserId',
				align:'center',
				width:'100px',
				title : demandMsgArray['sudoThePersonInCharge'] /*수도권담당자*/,
				hidden : true
    		}
    		, {
				key : 'areaSoodoChrgUserNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['sudoThePersonInCharge'] /*수도권담당자*/,
				render : function(value, data) {
					if( cdDivChk ==''){
						/*if(data.prntBizDivCd == 'C00618'){
							return '';
						} else{
							var celStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							if (nullToEmpty(data.areaSoodoChrgUserId) != "") {
								celStr = value;
							}
       				        celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
							//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
							return celStr;
						}*/	
						return value;
					} else if(cdDivChk == 'TB01'){
						return '';
					} else {
						var celStr = '';
						if (nullToEmpty(data.areaSoodoChrgUserId) != "") {
							celStr = value;
						}
						celStr = nullToEmpty(celStr) == '' ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : celStr;	
						celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
						//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
						
						return celStr;
					}
				}
			}
    		, {
				key : 'areaBoosanChrgUserId',
				align:'center',
				width:'100px',
				title : demandMsgArray['dongbuThePersonInCharge'] /*동부담당자*/,
				hidden : true
    		}
    		, {
				key : 'areaBoosanChrgUserNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['dongbuThePersonInCharge'] /*동부담당자*/,
				render : function(value, data) {
					if( cdDivChk ==''){
						/*if(data.prntBizDivCd == 'C00618'){
							return '';
						} else{
							var celStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							if (nullToEmpty(data.areaBoosanChrgUserId) != "") {
								celStr = value;
							}
       				        celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
							//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
							return celStr;
						}*/
						return value;
					} else if(cdDivChk == 'TB01'){
						return '';
					} else {						
						var celStr = '';
						if (nullToEmpty(data.areaBoosanChrgUserId) != "") {
							celStr = value;
						}
						celStr = nullToEmpty(celStr) == '' ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : celStr;	
						celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
						//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
						
						return celStr;
					}
				}
			}
    		/*, {
				key : 'areaDaeguChrgUserId',
				align:'center',
				width:'100px',
				title : demandMsgArray['sudoThePersonInCharge'],
				hidden : true
    		}
    		, {
				key : 'areaDaeguChrgUserNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['daeguThePersonInCharge'],
				render : function(value, data) {
					if( cdDivChk ==''){						
						return value;
					} else if(cdDivChk == 'TB01'){
						return '';
					} else {						
						var celStr = '';
						if (nullToEmpty(data.areaDaeguChrgUserId) != "") {
							celStr = value;
						}
						celStr = nullToEmpty(celStr) == '' ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : celStr;	
						celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';						
						return celStr;
					}
				}
			}*/
    		, {
				key : 'areaSeobuChrgUserId',
				align:'center',
				width:'100px',
				title : demandMsgArray['sudoThePersonInCharge'] /*서부담당자*/,
				hidden : true
    		}
    		, {
				key : 'areaSeobuChrgUserNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['seobuThePersonInCharge'] /*서부담당자*/,
				render : function(value, data) {
					if( cdDivChk ==''){
						/*if(data.prntBizDivCd == 'C00618'){
							return '';
						} else{
							var celStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							if (nullToEmpty(data.areaSeobuChrgUserId) != "") {
								celStr = value;
							}
       				        celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
							//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
							return celStr;
						}*/	
						return value;
					} else if(cdDivChk == 'TB01'){
						return '';
					} else {						
						var celStr = '';
						if (nullToEmpty(data.areaSeobuChrgUserId) != "") {
							celStr = value;
						}
						celStr = nullToEmpty(celStr) == '' ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : celStr;	
						celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
						//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
						
						return celStr;
					}
				}
			}
    		, {
				key : 'areaJongbuChrgUserId',
				align:'center',
				width:'100px',
				title : demandMsgArray['jongbuThePersonInCharge'] /*중부담당자*/,
				hidden : true
    		}
    		, {
				key : 'areaJongbuChrgUserNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['jongbuThePersonInCharge'] /*중부담당자*/,
				render : function(value, data) {
					if( cdDivChk ==''){
						/*if(data.prntBizDivCd == 'C00618'){
							return '';
						} else{
							var celStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							if (nullToEmpty(data.areaJongbuChrgUserId) != "") {
								celStr = value;
							}
       				        celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
							//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
							return celStr;
						}*/	
						return value;
					} else if(cdDivChk == 'TB01'){
						return '';
					} else {						
						var celStr = '';
						if (nullToEmpty(data.areaJongbuChrgUserId) != "") {
							celStr = value;
						}
						celStr = nullToEmpty(celStr) == '' ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : celStr;	
						celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
						//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
						
						return celStr;
					}
				}
			}
    		, {
				key : 'areaChrrId',
				align:'center',
				width:'100px',
				title : demandMsgArray['areaThePersonInCharge'] /*지역담당자*/,
				hidden : true
    		}
    		, {
				key : 'areaChrrNm',
				align:'center',
				width:'100px',
				title : demandMsgArray['areaThePersonInCharge'] /*지역담당자*/,
				render : function(value, data) {
					if( cdDivChk ==''){
						/*if(data.prntBizDivCd == 'C00618'){
							return '';
						} else{
							var celStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							if (nullToEmpty(data.areaChrrId) != "") {
								celStr = value;
							}
							celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
							return celStr;
						}*/	
						return value;
					} else if(cdDivChk == 'TB01'){
						return '';
					} else {						
						var celStr = '';
						if (nullToEmpty(data.areaChrrId) != "") {
							celStr = value;
						}
						celStr = nullToEmpty(celStr) == '' ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : celStr;	
						celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
						//celStr = '<div class="textsearch_1 Float-left" style="width:90px">' + celStr +'  <button class="Button search" id="areaChrrIdBtn"></button></div>';
						
						return celStr;
					}
				}
    		    ,hidden : true
			}
    		, {
				key : 'iOCdAfeDgr',
				align:'center',
				width:'100px',
				title : demandMsgArray['iOCodeAfeDgreeNoBr'] /*차수*/
			}
    		, {
				key : 'hdqtrIOCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['headquartersIOCode'] /*본사IO코드*/,
				render : function(value, data){ return value;},
				editable : {type: 'text',
							attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6"},
   			                styleclass : 'num_editing-in-grid'}
			}
    		, {
				key : 'cptIOCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['capitalIOCode'] /*수도권IO코드*/,
				render : function(value, data){ return value;},
				editable : {type: 'text',
							attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6"},
   			                styleclass : 'num_editing-in-grid'}
			}
    		, {
				key : 'busanIOCd',
				align:'left',
				width:'100px',
				title : '동부IO코드' /*동부IO코드*/,
				render : function(value, data){ return value;},
				editable : {type: 'text',
							attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6"},
   			                styleclass : 'num_editing-in-grid'}
			}
    		/*, {
				key : 'daeguIOCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['daeguIOCode'] 대구IO코드,
				render : function(value, data){ return value;},
				editable : {type: 'text',
							attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6"},
   			                styleclass : 'num_editing-in-grid'}
			}*/
    		, {
				key : 'westIOCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['westIOCode'] /*서부IO코드*/,
				render : function(value, data){ return value;},
				editable : {type: 'text',
							attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6"},
   			                styleclass : 'num_editing-in-grid'}
			}
    		, {
				key : 'middIOCd',
				align:'left',
				width:'100px',
				title : demandMsgArray['middIOCode'] /*중부IO코드*/,
				render : function(value, data){ return value;},
				editable : {type: 'text',
							attr : { "data-keyfilter-rule" : "digits", "maxlength" : "6"},
   			                styleclass : 'num_editing-in-grid'}
			}
    		, {
				key : 'cstrCostExcsRate',
				align:'right',
				width:'120px',
				title : "공사비초과율(%)" /*중부IO코드*/,
				render : function(value, data){ return value;},
				editable : {type: 'text',
							attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"},
   			                styleclass : 'num_editing-in-grid'}
			}
    		, {
				key : 'demdBizDivDesc',
				align:'left',
				width:'200px',
				title : demandMsgArray['description'] /*설명*/,
				editable : true
			}
    		, {
				key : 'mgmtGrpCd',
				align:'left',
				width:'80px',
				title : demandMsgArray['managementGroupCode'] /*관리그룹코드*/,
				hidden:true
			}
    		, {
				key : 'lastChgDate',
				align:'center',
				width:'110px',
				title : demandMsgArray['modificationDate'] /*수정일자*/
    		   ,render : function(value, data) {
    			   if (value == undefined || value == null || '' == value) {
    				   return '';
    			   }
    			   return value.substring(0,11);
    		   }
			}
		];
    	
        //그리드 생성
        $('#'+gridId).alopexGrid({
        	columnMapping : mapping,
			cellSelectable : true,
			autoColumnIndex: true,
			fitTableWidth: true,
			rowClickSelect : false,
			rowSingleSelect : true,
			rowInlineEdit : false,
			numberingColumnFromZero : false,
			height : 500
			,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + demandMsgArray['noInquiryData']/*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
        	,tree    : { useTree:true, idKey:'demdBizDivCd', parentIdKey : 'prntBizDivCd' }
        	,filteringHeader : true
		    ,filter : {
		    	useRenderToFilter: true
		    }
        });
		
		$('#'+gridId).on('dblclick', '.bodycell', function(e){
			if (cdDivChk !=null && cdDivChk != '' ){
				
				var event = AlopexGrid.parseEvent(e);
				var selected = event.data._state.selected;
				
				$('#'+gridId).alopexGrid("rowSelect", {_index:{data:event.data._index.row}}, selected ? false:true );
				
				var editing_list = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
				
				for(var i = 0; i < editing_list.length; i++){
					/*if (cdDivChk == 'TB02') {
						// ERP 장비유형 설정
						$('.ui-multiselect-menu').css("display","none");
					}*/
					
					// 편집 종료
					hideErpEqpTypList(event, true);
					$('#'+gridId).alopexGrid('endEdit', {_index: {id: editing_list[i]._index.id}});
				}
				
				if (checkRowData() == true) {
					var ev = AlopexGrid.parseEvent(e);
					$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}})
					if (cdDivChk == 'TB02') {
						// ERP장비유형 설정
						if (chkMultiSelectDisplay() == true) {
							$('.ui-multiselect-menu').css("display","none");
						}
				    	if (event.mapping.key == 'erpEqpTypNm' && ev.data.demdInvtDivCd != '102002') {
				    		showErpEqpTypList(event);
				    	} 
				    	// ERP 장비유형을 클릭한 경우가 아니면 값만 표시
				    	else {
				    		if (nullToEmpty(ev.data.erpEqpTypNm) != "") {
					    		var erpEqpDivId = $('#'+gridId).alopexGrid('cellElementGet',  {_index: {row: ev.data._index.row}}, "erpEqpTypNm").attr('id');
					    		$('#' + erpEqpDivId +' >button > span').after('<span>' + ev.data.erpEqpTypNm + '</span>');
				    		}
				    	}
					}
				}
				
			}
		});
		
		$('#'+gridId).on('dataAddEnd', function(e){
			var addRowIndex = $('#'+gridId).alopexGrid('dataGet').length-1; //전체 행 가져오기
			$('#'+gridId).alopexGrid("focusCell", {_index : {row : addRowIndex}}, "demdBizDivNm" );
			setDisplaySortVal();
		});

		// row 변경후
		$('#'+gridId).on('rowDragDropEnd', function(e){		
			setDisplaySortVal();
		});
		
		// 그리드 값 변경중 ERP세부차수변경시
		$('#'+gridId).on('cellValueEditing', function(e){
			var ev = AlopexGrid.parseEvent(e);        	
        	var result;
        	var data = ev.data;
        	var mapping = ev.mapping;
        	var $cell = ev.$cell;
        	var erpDetlBizDemdDgr = null;
        	var checkType1 = /^[A-Z0-9]{1,3}$/;
        	
        	if ( ev.mapping.key == "erpDetlBizDemdDgr") {        		
        		erpDetlBizDemdDgr = nullToEmpty(AlopexGrid.currentValue(data,  "erpDetlBizDemdDgr" ));
        		//erpDetlBizDemdDgr = erpDetlBizDemdDgr.replace(/ /gi, "");
        		if (erpDetlBizDemdDgr != '') {
        			if (checkType.test(erpDetlBizDemdDgr) == false ) {
        				$('#'+gridId).alopexGrid('cellEdit', '', {_index: {id: ev.data._index.id}}, 'erpDetlBizDemdDgr');   // ERP세부차수
        				//$('#'+gridId).alopexGrid('focusCell', {_index: {id: ev.data._index.id}}, 'erpDetlBizDemdDgr'); 
        			}
        		}
        	}
        	
        	if( ev.mapping.key == "hdqtrIOCd") {
    			var hdqtrIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "hdqtrIOCd" ));
    			if(hdqtrIOCd > 990000){
    				$('#'+gridId).alopexGrid("dataEdit", {"hdqtrIOCd" : ''}, {_state : {selected : true}});	
    				alert(demandMsgArray['ioCodeCanNotInsertover990000']);
    				return;
    			}
    			if(hdqtrIOCd.length == 6){
    				var cptIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "cptIOCd" ));
    				if(cptIOCd == ''){
    					$('#'+gridId).alopexGrid("dataEdit", {"cptIOCd" : Number(hdqtrIOCd) + 1}, {_state : {selected : true}});				
    				}
    				var busanIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "busanIOCd" ));
    				if(busanIOCd == ''){
    					$('#'+gridId).alopexGrid("dataEdit", {"busanIOCd" : Number(hdqtrIOCd) + 2}, {_state : {selected : true}});        					
    				}
    				/*daeguIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "daeguIOCd" ));
    				if(daeguIOCd == ''){
    					$('#'+gridId).alopexGrid("dataEdit", {"daeguIOCd" : Number(hdqtrIOCd) + 3}, {_state : {selected : true}});        					
    				}*/
    				var westIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "westIOCd" ));
    				if(westIOCd == ''){
    					$('#'+gridId).alopexGrid("dataEdit", {"westIOCd" : Number(hdqtrIOCd) + 3}, {_state : {selected : true}});        					
    				}
    				var middIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "middIOCd" ));
    				if(middIOCd == ''){
    					$('#'+gridId).alopexGrid("dataEdit", {"middIOCd" : Number(hdqtrIOCd) + 4}, {_state : {selected : true}});        					
    				}
        		}
        	}
        	
        	if(ev.mapping.key == "cptIOCd" || ev.mapping.key == "busanIOCd" || /*ev.mapping.key == "daeguIOCd" ||*/ ev.mapping.key == "westIOCd" || ev.mapping.key == "middIOCd") {
        		var cptIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "cptIOCd" ));
        		var busanIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "busanIOCd" ));
        		/*var daeguIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "daeguIOCd" ));*/
        		var westIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "westIOCd" ));
        		var middIOCd = nullToEmpty(AlopexGrid.currentValue(data,  "middIOCd" ));
        		
    			if(cptIOCd > 990000){
    				$('#'+gridId).alopexGrid("dataEdit", {"cptIOCd" : ''}, {_state : {selected : true}});
    				alert(demandMsgArray['ioCodeCanNotInsertover990000']);	
    				return;
    			}
    			if(busanIOCd > 990000){
    				$('#'+gridId).alopexGrid("dataEdit", {"busanIOCd" : ''}, {_state : {selected : true}});
    				alert(demandMsgArray['ioCodeCanNotInsertover990000']);	
    				return;
    			}
    			/*if(daeguIOCd > 990000){
    				$('#'+gridId).alopexGrid("dataEdit", {"daeguIOCd" : ''}, {_state : {selected : true}});
    				alert(demandMsgArray['ioCodeCanNotInsertover990000']);	
    				return;
    			}*/
    			if(westIOCd > 990000){
    				$('#'+gridId).alopexGrid("dataEdit", {"westIOCd" : ''}, {_state : {selected : true}});	
    				alert(demandMsgArray['ioCodeCanNotInsertover990000']);
    				return;
    			}
    			if(middIOCd > 990000){
    				$('#'+gridId).alopexGrid("dataEdit", {"middIOCd" : ''}, {_state : {selected : true}});	
    				alert(demandMsgArray['ioCodeCanNotInsertover990000']);
    				return;
    			}
        	}
        	
		});
    };
    
    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};
	
	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};
	
	// 조회조건에 따라 rowDragDrop 설정
	function setColumnViewOption() {
		var op = $('#'+gridId).alopexGrid('readOption');
		if (nullToEmpty(cdDivChk) == '') {
			op.columnMapping[7].dragdropColumn = false;	
			op.columnMapping[6].treeColumn = true;		
			op.tree = { useTree:true, idKey:'demdBizDivCd', parentIdKey : 'prntBizDivCd' };
			$('#'+gridId).alopexGrid('hideCol', 'move');
		} else {
			op.columnMapping[7].dragdropColumn = true;	
			op.columnMapping[6].treeColumn = false;		
			op.tree = { useTree:false, idKey:'demdBizDivCd', parentIdKey : 'prntBizDivCd' };	
			$('#'+gridId).alopexGrid('showCol', 'move');	
		}
		
		//사업구분 (대) 일때 불피료한 컬럼 히든 처리 추가 2019-01-18
		if (nullToEmpty(cdDivChk) == 'TB01') {
			$('#'+gridId).alopexGrid('hideCol', 'erpDetlBizDemdDgr');
			$('#'+gridId).alopexGrid('hideCol', 'demdInvtDivCd');
			$('#'+gridId).alopexGrid('hideCol', 'bizPurpDivCd');
			$('#'+gridId).alopexGrid('hideCol', 'basDsnYn');
			$('#'+gridId).alopexGrid('hideCol', 'bizKndCd');
			$('#'+gridId).alopexGrid('hideCol', 'hdqtrChrrNm');
			$('#'+gridId).alopexGrid('hideCol', 'areaSoodoChrgUserNm');
			$('#'+gridId).alopexGrid('hideCol', 'areaBoosanChrgUserNm');
			$('#'+gridId).alopexGrid('hideCol', 'areaSeobuChrgUserNm');
			$('#'+gridId).alopexGrid('hideCol', 'areaJongbuChrgUserNm');
			$('#'+gridId).alopexGrid('hideCol', 'lnsccpyCd');
			$('#'+gridId).alopexGrid('hideCol', 'eqpsccpyCd');
			$('#'+gridId).alopexGrid('hideCol', 'erpBizTypCd');
			$('#'+gridId).alopexGrid('hideCol', 'erpEqpTypNm');
		}
		else {
			$('#'+gridId).alopexGrid('showCol', 'erpDetlBizDemdDgr');
			$('#'+gridId).alopexGrid('showCol', 'demdInvtDivCd');
			$('#'+gridId).alopexGrid('showCol', 'bizPurpDivCd');
			$('#'+gridId).alopexGrid('showCol', 'basDsnYn');
			$('#'+gridId).alopexGrid('showCol', 'bizKndCd');
			$('#'+gridId).alopexGrid('showCol', 'hdqtrChrrNm');
			$('#'+gridId).alopexGrid('showCol', 'areaSoodoChrgUserNm');
			$('#'+gridId).alopexGrid('showCol', 'areaBoosanChrgUserNm');
			$('#'+gridId).alopexGrid('showCol', 'areaSeobuChrgUserNm');
			$('#'+gridId).alopexGrid('showCol', 'areaJongbuChrgUserNm');
			$('#'+gridId).alopexGrid('showCol', 'lnsccpyCd');
			$('#'+gridId).alopexGrid('showCol', 'eqpsccpyCd');
			$('#'+gridId).alopexGrid('showCol', 'erpBizTypCd');
			$('#'+gridId).alopexGrid('showCol', 'erpEqpTypNm');
		}
		
		if (nullToEmpty(cdDivChk) == 'TB02') {
			$('#'+gridId).alopexGrid('showCol', 'prntBizDivCd');
			$('#'+gridId).alopexGrid('hideCol', 'cstrCostExcsRate');
		} else {
			$('#'+gridId).alopexGrid('hideCol', 'prntBizDivCd');
			$('#'+gridId).alopexGrid('showCol', 'cstrCostExcsRate');
		}
		
		if (nullToEmpty(cdDivChk) == 'TB01' && $('#iOCdAfeDgr').val() != '') {
			$('#'+gridId).alopexGrid('showCol', 'iOCdAfeDgr');
			$('#'+gridId).alopexGrid('showCol', 'hdqtrIOCd');
			$('#'+gridId).alopexGrid('showCol', 'cptIOCd');
			$('#'+gridId).alopexGrid('showCol', 'busanIOCd');
			/*$('#'+gridId).alopexGrid('showCol', 'daeguIOCd');*/
			$('#'+gridId).alopexGrid('showCol', 'westIOCd');
			$('#'+gridId).alopexGrid('showCol', 'middIOCd');
			
		} 
		else {
			$('#'+gridId).alopexGrid('hideCol', 'iOCdAfeDgr');
			$('#'+gridId).alopexGrid('hideCol', 'hdqtrIOCd');
			$('#'+gridId).alopexGrid('hideCol', 'cptIOCd');
			$('#'+gridId).alopexGrid('hideCol', 'busanIOCd');
			/*$('#'+gridId).alopexGrid('hideCol', 'daeguIOCd');*/
			$('#'+gridId).alopexGrid('hideCol', 'westIOCd');
			$('#'+gridId).alopexGrid('hideCol', 'middIOCd');
		}
		
		$('#'+gridId).alopexGrid('updateOption', {
			  columnMapping: op.columnMapping
			, tree : op.tree
		});
	}
    // 화면 표시순서 변경
	function setDisplaySortVal() {
		var dataList = AlopexGrid.currentData( $('#'+gridId).alopexGrid("dataGet") );
		if (dataList.length > 0) {
			$.each(dataList, function(idx, obj){
				if (obj.scrnDispTurnVal != (idx+1)) {
					$('#'+gridId).alopexGrid('cellEdit', idx+1, {_index: {row:obj._index.row}}, 'scrnDispTurnVal');   // 화면표시순서   
	  				$('#'+gridId).alopexGrid('refreshCell', {_index:{row:obj._index.row}}, 'scrnDispTurnVal');
				}
			});
		}
	}
	
    function setCombo() {
    	//AFE 구분 콤보박스
    	//selectAfeYearCode('afeDiv', 'N', '');
    	// 사업구분 년도 + AFE 차수년도
    	var sflag = "afeDiv";
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/bizdivyearlist', null, 'GET', sflag);
		// 사업구분(대)
    	selectComboCode('cdDiv', 'Y', 'C00850', '');
    	
    	
    	// ERP 장비 선로 역할
    	var requestParam = { comGrpCd : 'C00628' , typCd : 'EQP'};
    	demandRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/', requestParam, 'GET', "erpEqpTypCd");
    }
    
	function selectPrntCdList(){
		var sflag = "prnt";
		var dataParam = {
				afeYr : $('#afeDiv').val()
		}
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectprtcdlist', dataParam, 'GET', sflag);
	}
	
	function selectErpBizList(){
		var sflag = "erp";
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selecterpbizlist', '', 'GET', sflag);
	}
	
	function selectDemdDivCdList() {
		var sflag = "demd";
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectdemddivcdlist', '', 'GET', sflag);
	}
	
	function selectDemdInvtDivList() {
		var sflag = "invt"
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectinvtdivcdlist', '', 'GET', sflag);
	}
	
	function selectBizKndList() {
		var sflag = "bizknd";
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectbizkndlist', '', 'GET', sflag);
	}
	
	function selectSccpyList() {
		var sflag = "sccpy"
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectSccpyList', '', 'GET', sflag);
	}
	
	function selectErpBizTypList() {
		var sflag = "erpBizTyp"
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/selectErpBizTypList', '', 'GET', sflag);
	}
	
	function checkRowData() {
		// ERP장비유형 설정
		if (chkMultiSelectDisplay() == true) {
			var editingRow = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
	    	if (editingRow == null || editingRow.length == 0) {
				$('.ui-multiselect-menu').css("display","none");
	    		return false;
	    	}
			setErpEqpNmFromMultiSelect(editingRow[0]._index.row);
			$('.ui-multiselect-menu').css("display","none");
		}
		
		//전체종료
		$('#'+gridId).alopexGrid('endEdit', {_state: {editing:true}});
		var editingRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", [{_state:{editing:true}}]));
		
		if (editingRow.length > 0 ){
			return false;
		} else {
			return true;
		}
	}
	
	function searchBizDiv(){
		showProgress(gridId);
		var dataParam = {
				sAfeYear : $('#afeDiv').val(),
				sCdDiv : $('#cdDiv').val(),
				iOCdAfeDgr : $('#iOCdAfeDgr').val()
		}
		cdDivChk = $('#cdDiv').val();
		yearChk = $('#afeDiv').val();
		
		demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/getbizdivlist', dataParam, 'GET', 'btnSearchBizDiv');
	}
	
	/*
	 * Function Name : checkValidation
	 * Description   : 데이터 체크
	 * ----------------------------------------------------------------------------------------------------
	 * return        :  결과값
	 */
    function checkValidation() {
    	var gridList = AlopexGrid.currentData( $('#'+gridId).alopexGrid("dataGet") );
    	var chkResult = true;
    	var chkMsg = "";
    	var chkData;
    	var bizDivTy = (cdDivChk == 'TB01') ? demandMsgArray['businessDivisionBig'] : demandMsgArray['businessDivisionDetl'];
    	
        for (var i = 0 ; i < gridList.length ; i++ ) {
    		chkData = gridList[i];
    		
    		if (nullToEmpty(chkData.demdBizDivNm)+"" == '' || parseInt(nullToEmpty(chkData.demdBizDivNm)) <= 0) {
    			chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['businessDivisionName']); chkResult = false; break;
    			/*(i+1) + "번째줄의  사업구분명은 필수입니다.";*/ 
    		}
    		if (nullToEmpty(chkData.demdBizDivNm).length > 50) {
    			chkMsg = makeArgMsg('lineValidationMaxLength', (i+1), demandMsgArray['businessDivisionName'], '50'); chkResult = false; break;
    			/*(i+1) + "번째줄의  사업구분명은 50자리 이내로 입력 하셔야 합니다."*/
    		}
        	if (nullToEmpty(chkData.scrnDispTurnVal)+"" == '' || parseInt(nullToEmpty(chkData.scrnDispTurnVal)) <= 0) {
        		chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['screenDisplayTurn']); chkResult = false; break;
        		/*(i+1) + "번째줄의  화면표시순서는 필수입니다.";*/
        	}
        	/*if (nullToEmpty(chkData.scrnDispTurnVal).length > 5) {
        		chkMsg = makeArgMsg('lineValidationDecimalMaxLength', (i+1), demandMsgArray['screenDisplayTurn'], '5'); chkResult = false; break;
        		(i+1) + "화면표시순서는 5자리 이내의 숫자만 입력 가능합니다.";	
    		}*/ 
        	// 수요구분이 있는경우 ERP사업구분이 있는지 체크
        	if (cdDivChk == 'TB01') {
	        	if (nullToEmpty(chkData.demdDivCd) != '' && nullToEmpty(chkData.erpBizDivCd) == '') {
	        		chkMsg = makeArgMsg('checkRelationBetweenItems', (i+1), demandMsgArray['demandDivision'], demandMsgArray['enterpriseResourcePlanningBusinessDivision']); 
	        		chkResult = false; break;	
	        		/* {0} 번째줄의 {수요투자구분}이(가) 선택된 경우 {ERP사업구분}은(는) 필수입니다. */
	        	}
	        	if (nullToEmpty(chkData.demdDivCd) == '' && nullToEmpty(chkData.erpBizDivCd) != '') {
	        		chkMsg = makeArgMsg('checkRelationBetweenItems', (i+1), demandMsgArray['enterpriseResourcePlanningBusinessDivision'], demandMsgArray['demandDivision']); 
	        		chkResult = false; break;	
	        		/* {0} 번째줄의 {ERP사업구분}이(가) 선택된 경우 {수요투자구분}은(는) 필수입니다. */
	        	}
        	}
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.demdDivCd) != '') {
        		if (nullToEmpty(chkData.erpDetlBizDemdDgr) == '') {
        			chkMsg = makeArgMsg('checkRelationBetweenItems', (i+1), demandMsgArray['demandDivision'], demandMsgArray['erpDetailBizDegree']); 
        			chkResult = false; break;	
        			/* {0} 번째줄의 {수요투자구분}이(가) 선택된 경우 { ERP세부사업차수}은(는) 필수입니다. */
        		} else {
        			var numUnicode = chkData.erpDetlBizDemdDgr.charCodeAt(0);
        			if (((65<= numUnicode && numUnicode <= 90) || (48<= numUnicode && numUnicode <= 57)) == false) {
        				chkMsg = makeArgMsg('checkRelationBetweenItems', (i+1), demandMsgArray['demandDivision'], demandMsgArray['erpDetailBizDegree']); 
            			chkResult = false; break;	
        			}
        		} 
        	}
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.erpDetlBizDemdDgr) != '' && nullToEmpty(chkData.demdDivCd) == '') {
        		chkMsg = makeArgMsg('checkRelationBetweenItems', (i+1), demandMsgArray['erpDetailBizDegree'], demandMsgArray['demandDivision']); 
    			chkResult = false; break;	
    			/* {0} 번째줄의 {ERP세부사업차수}이(가) 선택된 경우 { 수요투자구분}은(는) 필수입니다. */
        	}
        	if (cdDivChk == 'TB02' && (nullToEmpty(chkData.erpBdgtDtlCd).length > 0 && nullToEmpty(chkData.erpBdgtDtlCd).length < 6)) {
        		chkMsg = makeArgMsg('lineValidationSixLength', (i+1), demandMsgArray['enterpriseResourcePlanningBudgetDetailCode'], '6'); 
    			chkResult = false; break;	
    			/* {0} 번째줄의 {ERP세부사업차수}이(가) 선택된 경우 { 수요투자구분}은(는) 필수입니다. */
        	}
        	if (nullToEmpty(chkData.demdBizDivDesc).length > 300) {
        		chkMsg = makeArgMsg('lineValidationMaxLength', (i+1), demandMsgArray['description'], '300'); chkResult = false; break;	
        		/*(i+1) + "번째줄의  설명은 300자리 이내로 입력 하셔야 합니다."; */
    		}
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.bizKndCd)+"" == '') {
    			chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['businessKind']); chkResult = false; break;
    			/*(i+1) + "번째줄의  사업종류은 필수입니다."; */
    		}
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.bizKndCd)+"" == '') {
    			chkMsg = makeArgMsg('lineValidation', (i+1), demandMsgArray['businessKind']); chkResult = false; break;
    			/*(i+1) + "번째줄의  사업종류은 필수입니다."; */
    		}
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.erpBizTypCd) == "") {
        		chkMsg = makeArgMsg('lineValidation', (i+1), "ERP사업유형");
        		/*(i+1) + "번째줄의  ERP사업유형은 필수입니다."; */
        		chkResult = false; break;	
        	}
        	
        	
/*        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.demdInvtDivCd) == "") {
        		if(nullToEmpty(chkData.lnsccpyCd) == "" || nullToEmpty(chkData.eqpsccpyCd) == ""){
        			chkMsg = makeArgMsg('checkConditionBetweenItems', (i+1),  demandMsgArray['eqpLnDivison']
        			, demandMsgArray['ln_conducltLine_equipment'], '선로 도급사와 장비 도급사'); chkResult = false; break;
        			 {0} 번째줄의 {1}이(가) {2}일 경우 {3}은(는) 필수입니다. 
        		}
    		}
        	
        	// 장비일 경우
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.demdInvtDivCd) == "102001") {
        		if(nullToEmpty(chkData.eqpsccpyCd) == ""){
        			chkMsg = makeArgMsg('checkConditionBetweenItems', (i+1),  demandMsgArray['eqpLnDivison']
        			, demandMsgArray['eqp'], '장비 도급사'); chkResult = false; break;
        			 {0} 번째줄의 {1}이(가) {2}일 경우 {3}은(는) 필수입니다. 
        		}
    		} 
        	//선로/관로일 경우
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.demdInvtDivCd) == "102002") {
        		if(nullToEmpty(chkData.lnsccpyCd) == ""){
        			chkMsg = makeArgMsg('checkConditionBetweenItems', (i+1),  demandMsgArray['eqpLnDivison']
        			, demandMsgArray['lnCdln'], '선로 도급사'); chkResult = false; break;
        			 {0} 번째줄의 {1}이(가) {2}일 경우 {3}은(는) 필수입니다. 
        		}
    		}
*/
        	if (cdDivChk == 'TB02' && nullToEmpty(chkData.erpEqpTypVal) != "") {
        		var erpEqpTypValStr = chkData.erpEqpTypVal.split(",");
        		if (erpEqpTypValStr.length > 10) {
        			chkMsg = makeArgMsg('checkErpEqpTypCdCnt', (i+1), demandMsgArray['erpEqpLnCon'] /*ERP장비선로관로*/, 10);
        			/* {0} 번째줄의 {1}은(는) {2}개까지 입력해야합니다. */
            		chkResult = false; break;	
        		}
        	}
        	
    	}
    	if (chkResult == false) {
    		callMsgBox('', 'W', chkMsg);
    		return false;
    	}
		    	
		// 중복체크
    	
    	for (var i=0 ; i < gridList.length-1; i++) {
    		for (var j=(i+1); j < gridList.length; j++) { 
    			// 2017년 이후
    			if (parseInt(nullToEmpty(gridList[i].afeYr)) >= 2017) {
    				if (nullToEmpty(gridList[i].afeYr) == nullToEmpty(gridList[j].afeYr)
    						&& nullToEmpty(gridList[i].demdBizDivNm) == nullToEmpty(gridList[j].demdBizDivNm)) {
    					chkMsg = makeArgMsg('duplicationDemandBiz2', (i+1), bizDivTy, (j+1) , bizDivTy);
        				chkResult = false; break;
        				/*{0} 번째줄의 {1}은(는) {2}줄의 {3}와 동일한 정보입니다.<br>(체크항목 : 년도, 사업구분명) */
    				}
    			}
    			if (nullToEmpty(gridList[i].afeYr) == nullToEmpty(gridList[j].afeYr )
    					&& nullToEmpty(gridList[i].demdDivCd) == nullToEmpty(gridList[j].demdDivCd)
    					&& nullToEmpty(gridList[i].demdBizDivNm) == nullToEmpty(gridList[j].demdBizDivNm)
    					&& nullToEmpty(gridList[i].prntBizDivCd) == nullToEmpty(gridList[j].prntBizDivCd)
    					&& nullToEmpty(gridList[i].erpBizDivCd) == nullToEmpty(gridList[j].erpBizDivCd)
    					&& nullToEmpty(gridList[i].demdInvtDivCd) == nullToEmpty(gridList[j].demdInvtDivCd)) {
    				chkMsg = makeArgMsg('duplicationDemandBiz', (i+1), bizDivTy, (j+1) , bizDivTy);/*{0} 번째줄의 {1}은(는) {2}줄의 {3}와 동일한 정보입니다.<br>(체크항목 : 년도, 수요구분, 사업구분명, 부모코드, ERP 사업구분, 장비/선로구분) */
    				chkResult = false; break;	
    			}
    			
    			/*if (nullToEmpty(gridList[i].afeYr) == nullToEmpty(gridList[j].afeYr )
    					&& nullToEmpty(gridList[i].prntBizDivCd) == nullToEmpty(gridList[j].prntBizDivCd)
    					&& nullToEmpty(gridList[i].scrnDispTurnVal) == nullToEmpty(gridList[j].scrnDispTurnVal)) {
    				chkMsg = makeArgMsg('duplicationScrnDisp', (i+1), (j+1));{0} 번째줄과 {1}줄의 화면표시순서가 같습니다.<br>(체크항목 : 년도, 부모코드, 화면표시순서) 
    				chkResult = false; break;	
    			}*/
    		}
    		if (chkResult == false) {
    			break;	
        	}
    	}

    	if (chkResult == false) {
    		callMsgBox('', 'W', chkMsg);
    		return false;
    	}
    	
    	return true;
    }
	
	
	function saveBizDiv(){

		// 그리드 체크
		if (checkRowData() == false) {
			return;
		}
		
		// 데이터 체크
    	if (checkValidation() == false) {
        	return;
    	}
		var insertRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
		var deleteRow = AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));
		var updateRow =  AlopexGrid.trimData($( '#'+gridId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
		
		if ( insertRow.length == 0 && deleteRow.length == 0 && updateRow.length == 0) {
			callMsgBox('', 'W', demandMsgArray['noChangedData'] ); /*변경된 내용이 없습니다*/
			return;
		}
		
		var dataParam = new Object();
	
		dataParam.gridData = {
			  insertRow : insertRow
			, deleteRow : deleteRow
			, updateRow : updateRow
		}
		
		var hiddenGrid = $('#'+gridId).alopexGrid("columnGet", {hidden:false});
		
		for(var i=0; i<hiddenGrid.length; i++) {
			if((hiddenGrid[i].key == "iOCdAfeDgr")) {
				dataParam.iOCodeCheck = "OK";
				dataParam.iOCdAfeDgr = $('#iOCdAfeDgr').val();
			}
		}

		/*"저장하시겠습니까?"*/
		callMsgBox('','C', demandMsgArray['save'], function(msgId, msgRst){  
    		if (msgRst == 'Y') {
    			bodyProgress();
    			demandRequest('tango-transmission-biz/transmisson/demandmgmt/afemgmt/savebizdiv', dataParam, 'POST', 'save');
    		} 
		});
	}
	
	function addRow() {
    	var dataList = AlopexGrid.trimData( $( '#'+gridId).alopexGrid("dataGet") );
    	var prntBizDivCd;
    	var erpBizDivCd;
		var demdInvtDivCd;
		var basDsnYn;
		var bizKndCd;
		var bizPurpDivY;
		
		if (prntCdList == null || prntCdList.length == 0) {
			selectPrntCdList();
		}
		
    	if (cdDivChk == 'TB01'){
    		prntBizDivCd = 'C00618';
    		erpBizDivCd = erpBizList[0].value;
    		demdInvtDivCd = '';
    		basDsnYn = '';
    		bizKndCd = '';
    		bizPurpDivY = '';
    	}else {
    		if (prntCdList.length == 0) {
    			callMsgBox('', 'W', yearChk+demandMsgArray['bizDivBigCheck']);
    			/*yearChk + "년도에 해당하는 사업구분(대)을 먼저 등록해 주세요."*/
    			return;
    		}
    		prntBizDivCd = prntCdList[0].value;
    		erpBizDivCd = '';
    		demdInvtDivCd = demdInvtDivList[0].value;
    		basDsnYn = basDsnYnList[0].value;
    		bizPurpDivY = bizPurpDivYList[0].value;
    		bizKndCd =  bizKndList[0].value;
    	}
    	
    	var addRowIndex = $('#'+gridId).alopexGrid('dataGet').length; //전체 행 가져오기
    	
    	var initRowData = [
    	    {
    	    	"afeYr" : yearChk,
    	    	"demdBizDivCd" : '',
    	    	"demdDivCd" : demdDivCdList[0].value,
    	    	"prntBizDivCd" : prntBizDivCd,
    	    	"erpBizDivCd" : erpBizDivCd,
    	    	"demdInvtDivCd" : demdInvtDivCd,
    	    	"bizPurpDivCd" : bizPurpDivY,
    			"basDsnYn" : basDsnYn,
    			"bizKndCd" : bizKndCd,
    			"mgmtGrpCd" : '0001',
    			"cstrCostExcsRate" : '110'
    			, "erpEqpTypNm" : ""
    	    }               
    	];
    	
    	$( '#'+gridId).alopexGrid("dataAdd", initRowData);
    	$('#'+gridId).alopexGrid('startEdit', {_index : {data : addRowIndex}});
    }
	
	function removeRow() {
    	var dataList = $( '#'+gridId).alopexGrid("dataGet", {_state : {selected:true}} );
    	if (dataList.length <= 0) {
    		callMsgBox('', 'W', demandMsgArray['selectNoDataForDelete'] ); /*"선택된 데이터가 없습니다.\n삭제할 데이터를 선택해 주세요."*/
    		return;
    	}
    	
    	for (var i = dataList.length-1; i >= 0; i--) {
    		var data = dataList[i];
    		var rowIndex = data._index.data;
    		$( '#'+gridId).alopexGrid("dataDelete", {_index : { data:rowIndex }});
    	}    	
    	setDisplaySortVal();
    }
	
	/*
	 * Function Name : searchUser
	 * Description   : 사용자검색 팝업
	 * ----------------------------------------------------------------------------------------------------
	 * objId         : 컴포넌 id트
	 * ----------------------------------------------------------------------------------------------------
	 * return        : 사용자정보
	 */
	function searchUser(objId) {
		if (objId == "areaChrgUser") {
			openUserPopup(areaUserCallback); 
	    } else if (objId == "hdqtrChrgUser") {
	    	openUserPopup(hdqtrUserCallback); 
		} 
	}

	/*
	 * Function Name : areaUserCallback
	 * Description   : 지역담당자 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * data         : 선택한 사용자
	 * ----------------------------------------------------------------------------------------------------
	 */
   function areaUserCallback(data) {
   	
   	   if(data !== null && data != undefined  && data.length > 0) { 
   		 var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
		 var rowIndex = focusData[0]._index.data;
		 var idIndex = focusData[0]._index.id;
   		 var userId = data[0].userId;
   	     var userNm = data[0].userNm;
   	     $('#'+gridId).alopexGrid( "cellEdit", userNm, {_index : { id : idIndex}}, areaCharType+'Nm');
   	     $('#'+gridId).alopexGrid( "cellEdit", userId, {_index : { id : idIndex}}, areaCharType+'Id');

     	 $('#'+gridId).alopexGrid("refreshCell", {_index: { id : idIndex}}, areaCharType+'Nm'); 
   	     areaCharType = null;
   	   }
   }
   
   /*
	 * Function Name : hdqtrUserCallback
	 * Description   : 본부담당자 셋팅
	 * ----------------------------------------------------------------------------------------------------
	 * data         : 선택한 사용자
	 */
  function hdqtrUserCallback(data) {
	   
	   if(data !== null && data != undefined && data.length > 0) { 
   		 var focusData = $('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}});
		 var rowIndex = focusData[0]._index.data;
		 var idIndex = focusData[0]._index.id;
   		 var userId = data[0].userId;
   	     var userNm = data[0].userNm;
   	     $('#'+gridId).alopexGrid( "cellEdit", userNm, {_index : { id : idIndex}}, "hdqtrChrrNm");
   	     //$('#'+gridId).alopexGrid( "cellEdit", userNm, {_index : { row : rowIndex}}, "hdqtrChrrNm");
   	     $('#'+gridId).alopexGrid( "cellEdit", userId, {_index : { id : idIndex}}, "hdqtrChrrId");

     	 $('#'+gridId).alopexGrid("refreshCell", {_index: { id : idIndex}}, "hdqtrChrrNm"); 
	   }
	 }
   
    function setEventListener() {
        
        // 검색 조건에 따른 컬럼 보이기/숨기기 옵션 설정
        setColumnViewOption();
    	
    	//조회
    	$('#btnSearchBizDiv').on('click', function(e) {
    		selectPrntCdList();
    		searchBizDiv();
    	});
    	
    	//행추가
    	$('#btnAddRow').on('click', function(e) {
    		if( cdDivChk ==null || cdDivChk == "" ) {
    			callMsgBox('', 'W', demandMsgArray['requiredCodeDivision'] ); /*코드구분을 선택후 조회해야 수정할수 있습니다.*/
    		} else {
            	addRow();
    		}

        });
    	
        //엑셀다운로드
        $('#btn_dwn_excel').on('click', function(e) {
       	 	excelDownload();
        });
    	
    	//핵삭제
    	$('#btnRemoveRow').on('click', function(e) {
    		if( cdDivChk ==null || cdDivChk == "" ) {
    			callMsgBox('', 'W', demandMsgArray['requiredCodeDivision'] ); /*코드구분을 선택후 조회해야 수정할수 있습니다.*/
    		} else {
    			removeRow();
    		}
        });
    	
    	//저장
    	$('#btnSaveBizDiv').on('click', function(e) {
    		saveBizDiv();
        });
    	
    	//AFE 차수
        $('#afeDiv').on('change',function(e) {

    		$('#cdDiv').setSelected('');
    		
        	var dataParam = { 
        			AfeYr : this.value
    		};
        	selectAfeTsCodeTwo('iOCdAfeDgr', 'ST', '', dataParam);
        });
        

		$('#cdDiv').on('change', function(e) {
	    	if($('#cdDiv').val() == 'TB01') {
	    		$('#iOCdAfeDgr').setEnabled(true);
	    	}
	    	else {
	    		$('#iOCdAfeDgr').setSelected('');
	    		$('#iOCdAfeDgr').setEnabled(false);
	    	}
	    });
		
	};
	
	// 그리드클릭시
    $('#'+gridId).on('click', function(e) {
    	if(cdDivChk == null || cdDivChk == '' || cdDivChk =='TB01'){
    		return false;
    	}
    	var object = AlopexGrid.parseEvent(e);
    	var data = AlopexGrid.currentData(object.data);
    	
    	if (data == null) {
    		return false;
    	}
    	// 본사담당자 셀 클릭시
    	if (object.mapping.key == 'hdqtrChrrNm') {
    		if ( data._state.focused) {
    			searchUser('hdqtrChrgUser');
    		}
    	}
    	//console.log(object.mapping);
    	// 수도권담당자 셀 클릭시
    	if (object.mapping.key == 'areaSoodoChrgUserNm') {
    		if ( data._state.focused) {
    			areaCharType = 'areaSoodoChrgUser';
    			searchUser('areaChrgUser');
    		}
    	}
    	// 부산담당자 셀 클릭시
    	if (object.mapping.key == 'areaBoosanChrgUserNm') {
    		if ( data._state.focused) {
    			areaCharType = 'areaBoosanChrgUser';
    			searchUser('areaChrgUser');
    		}
    	}
    	// 대구담당자 셀 클릭시
    	if (object.mapping.key == 'areaDaeguChrgUserNm') {
    		if ( data._state.focused) {
    			areaCharType = 'areaDaeguChrgUser';
    			searchUser('areaChrgUser');
    		}
    	}
    	// 서부권담당자 셀 클릭시
    	if (object.mapping.key == 'areaSeobuChrgUserNm') {
    		if ( data._state.focused) {
    			areaCharType = 'areaSeobuChrgUser';
    			searchUser('areaChrgUser');
    		}
    	}
    	// 중부권담당자 셀 클릭시
    	if (object.mapping.key == 'areaJongbuChrgUserNm') {
    		if ( data._state.focused) {
    			areaCharType = 'areaJongbuChrgUser';
    			searchUser('areaChrgUser');
    		}
    	}
    	
    	var ev = AlopexGrid.parseEvent(e);   
    	if (ev == undefined || ev.mapping == undefined || ev.mapping.key == undefined) {
    		hideErpEqpTypList(ev, false); 
    		return false;
    	}
    	var editingRow = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
    	if (editingRow == null || editingRow.length == 0) {
    		return false;
    	}
    	if ( ev.mapping.key == "erpEqpTypNm" && ev.data.demdInvtDivCd != '102002'  ) {       
    		showErpEqpTypList(ev);
    		
    	} else {
    		hideErpEqpTypList(ev, false); 
    	}   
    });
        
    $('#'+gridId ).on('blur', function(e) {
    	var ev = AlopexGrid.parseEvent(e);   
    	if ( ev.mapping.key == "erpEqpTypNm"  ) {
    		hideErpEqpTypList(ev, false);   		
    	}        	
    });
    
    $('#'+gridId ).on('cellFocus', function(e) {
    	var ev = AlopexGrid.parseEvent(e); 
    	if (ev == undefined || ev.mapping == undefined || ev.mapping.key == undefined) {
    		return;
    	}
    	var editingRow = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
    	if (editingRow == null || editingRow.length == 0) {
    		return;
    	}
    	if ( ev.mapping.key == "erpEqpTypNm" && ev.data.demdInvtDivCd != '102002' ) { 
    		showErpEqpTypList(ev); 		
    	} else {
    		hideErpEqpTypList(ev, false);  
    	}
    });
    
    $('#erpEqpTypMultiSelect').on('DOMSubtreeModified', function(){
    	var editingRow = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
    	if (editingRow == null || editingRow.length == 0) {
    		return;
    	}
    	var rowIndex = editingRow[0]._index.row;
    	setErpEqpNmFromMultiSelect(rowIndex);
    });
    
    // 스크롤 이동시 멀티 셀렉트 열려 있는경우가 있는경우 닫기
    $(window).on('scroll', function() {
    	if (chkMultiSelectDisplay() == false) {
			return false;
		}	
//    	$('.ui-multiselect-menu').css("display","none");   
		return false;
    });
    
    // 그리드 내의 스크롤 이동시 멀티 셀렉트 열려 있는경우가 있는경우 닫기
    $('#'+gridId).on('gridScroll', function() {
    	if (chkMultiSelectDisplay() == false) {
			return false;
		}	
    	$('.ui-multiselect-menu').css("display","none");   
		return false;
    });
    
    //엑셀다운로드
    function excelDownload() {
   	 	$("#"+gridId).alopexGrid("endEdit");
		var worker = new ExcelWorker({
     		excelFileName : '사업구분 코드등록',
     		sheetList: [{
     			sheetName: '사업구분 코드등록',
     			placement: 'vertical',
     			$grid: $('#'+gridId)
     		}]
     	});
		
		worker.export({
     		merge: true,
     		exportHidden: false,
     		useGridColumnWidth : true,
     		border : true,
     		useCSSParser : true
     	});
		$("#"+gridId).alopexGrid("startEdit");
		bodyProgressRemove();
    }
    
    // 멀티셀렉트 박스 보여지는지 여부
    function chkMultiSelectDisplay() {
    	if (nullToEmpty($('.ui-multiselect-menu').css("display")) == 'block') {
    		return true;
    	} else {
    		return false;
    	}
    }
    
	// ERP 장비유형 설정 멀티 콤보 보이기
	function showErpEqpTypList(ev) {
		if (chkMultiSelectDisplay() == true) {
			return false;
		}
		if ( ev.mapping.key == "erpEqpTypNm"  ) {
			var editingRow = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}});
	    	if (editingRow == null || editingRow.length == 0) {
	    		return false;
	    	}
	    	
			var focusData = AlopexGrid.currentData($('#'+gridId).alopexGrid("dataGet", {_state : {focused : true}})[0]);
			var rowIndex = focusData._index.row;
			
	    	if (editingRow != null && editingRow.length > 0) {
				if (editingRow[0]._index.row != rowIndex ) {
					return false;
				}
	    	}
	    	
			
			var setEqpTypList = [];
						
			if(nullToEmpty(focusData.erpEqpTypVal) != "") {
    			var value = "";
    			var text = "";
    			var index = 0;
    			var tmpErpEqpTypStr = focusData.erpEqpTypVal.split(",");
    			for(i=0; i<tmpErpEqpTypStr.length ;i++) {
    				value = tmpErpEqpTypStr[i];
    				if(nullToEmpty(value) != ""){
    					setEqpTypList[index] = value;
    					index++;
    				}
    			}
    		}

			$('.ui-multiselect-none').click();   // 전체해제
        	$('#erpEqpTypCdList').setData({
        		erpEqpTypList:setEqpTypList
        	});
			    			
			var erpEqpDivId = $('#'+gridId).alopexGrid('cellElementGet',  {_index: {row: rowIndex}}, "erpEqpTypNm").attr('id');
			
			// 각 표시할 위치 취득
			var top = $('#' + erpEqpDivId).offset().top;
			var left = $('#' + erpEqpDivId).offset().left;
			//var width = 110;
			top = (top == "" ? 0 : parseInt(top));
			left = (left == "" ? 0 : parseInt(left));
			
		   	var rowCount = $('#'+gridId).alopexGrid('pageInfo').rowCount;
		   	var rowCount_range = $('#'+gridId).alopexGrid('dataGet', {_state: {editing: true}})[0]._index.row;
		   	if(rowCount - 5 > rowCount_range){
		   		$(".ui-multiselect-menu").css("top",(top+38) +'px');
		   		$(".ui-multiselect-menu").css("left",(left) +'px');
		   		$('.ui-multiselect-checkboxes').css("height","175px");
		   		$('.ui-multiselect-menu').css("display","block");
		   	} else {
		   		$(".ui-multiselect-menu").css("top",(top-238) +'px');
		   		$(".ui-multiselect-menu").css("left",(left) +'px');
		   		$('.ui-multiselect-checkboxes').css("height","175px");
		   		$('.ui-multiselect-menu').css("display","block");
		   	}
			//$(".ui-multiselect-menu").css("width",width +'px');
		}
	}
    
	/* ERP 장비유형 설정 멀티 콤보 숨기기
	 * ev : event
	 * allowEdit : 에디팅 시작 종료 시점에서 호출시
	 */
	function hideErpEqpTypList(ev, allowEdit) {
		if (chkMultiSelectDisplay() == false) {
			return false;
		}	
	    var editingRow = $('#bizDivGrid').alopexGrid('dataGet', {_state: {editing: true}});
		var rowIndex = -1;
		if (ev == undefined || ev.mapping == undefined || ev.mapping.key == undefined) {
			if (editingRow == null || editingRow.length == 0) {
				return false;
			}
			rowIndex = editingRow[0]._index.row;
    	} else {
    		rowIndex = ev.data._index.row;
    	}
		
		if (editingRow != null && editingRow.length > 0) {
			if (editingRow[0]._index.row != rowIndex && allowEdit == false) {
				// 편집중인 행과 다른 행의 ERP장비유형 이외의 셀을 클릭한 경우
				setErpEqpNmFromMultiSelect(editingRow[0]._index.row);   // 현재 정보 저장
				$('.ui-multiselect-menu').css("display","none");    // 멀티셀렉트 숨기기
				return false;
			} else if (allowEdit == true) {
				rowIndex = editingRow[0]._index.row;   // 편집 전환인 경우 지끔까지 작업한것 저장
			}
		}
		
		if (rowIndex == -1) {
			//$('.ui-multiselect-none').click();   // 전체해제
			$('.ui-multiselect-menu').css("display","none");   
			return;
		}
		
		setErpEqpNmFromMultiSelect(rowIndex);   // 데이터 저장
		$('.ui-multiselect-menu').css("display","none");   
	}
	
	// 데이터 셋팅
	function setErpEqpNmFromMultiSelect(rowIndex){
		var multiErpEqpTypCd = nullToEmpty($('#erpEqpTypCdList').val()).toString();
		var multiErpEqpTypText = nullToEmpty($('#erpEqpTypMultiSelect > button').text());	
		if(multiErpEqpTypCd == "") {
			multiErpEqpTypText = "";
		} 

		// 편집 종료
		$('#'+gridId).alopexGrid('cellEdit', multiErpEqpTypText, {_index: {row: rowIndex}}, "erpEqpTypNm");
		$('#'+gridId).alopexGrid('refreshCell', {_index: {row: rowIndex}}, "erpEqpTypNm");
		$('#'+gridId).alopexGrid('cellEdit',  multiErpEqpTypCd, {_index: {row: rowIndex}}, "erpEqpTypVal");
		$('#'+gridId).alopexGrid('refreshCell', {_index: {row: rowIndex}}, "erpEqpTypVal");
		
		var erpEqpDivId = $('#'+gridId).alopexGrid('cellElementGet',  {_index: {row: rowIndex}}, "erpEqpTypNm").attr('id');
		$('#' + erpEqpDivId +' >button > span').after('<span>' + multiErpEqpTypText + '</span>');
	}
	
	//request
	function demandRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successDemandCallback(response, sflag);})
    	  .fail(function(response){failDemandCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successDemandCallback(response, flag){
    	if(flag == 'btnSearchBizDiv'){
    		hideProgress(gridId);
    		//$( '#'+gridId).alopexGrid("sortClear");
    		$( '#'+gridId).alopexGrid("dataEmpty");
    		if(response!= null) {
        		$( '#'+gridId).alopexGrid("dataSet", response.list);
    		}
    		setColumnViewOption();
    		// 전체조회시 각 버튼 비활성
    		if (cdDivChk == null || cdDivChk == '') {
    			$("#btnSaveBizDiv").setEnabled(false);
        		$("#btnAddRow").setEnabled(false);
        		$("#btnRemoveRow").setEnabled(false);
    		}
    		// 전체조회가 아닌경우 버튼 활성
    		else {
    			$("#btnSaveBizDiv").setEnabled(true);
        		$("#btnAddRow").setEnabled(true);
        		$("#btnRemoveRow").setEnabled(true);
    		}    		

			$('#'+gridId).alopexGrid("dataEdit", {"iOCdAfeDgr" : $('#iOCdAfeDgr').val()});
    	}
    	else if(flag == 'prnt'){
			prntCdList = response.list;
    	}
    	else if(flag == 'erp'){
    		var returnArray = [{value:'', text: demandMsgArray['none'] }];
			erpBizList = returnArray.concat(response.list);
    	}
    	else if(flag == 'demd'){
    		var returnArray = [{value:'', text: demandMsgArray['select'] }];
			demdDivCdList = returnArray.concat(response.list);
    	}
    	else if(flag == 'invt') {
    		var returnArray = [{value:'', text: demandMsgArray['ln_conducltLine_equipment'] }];
			demdInvtDivList = returnArray.concat(response.list);
    	}
    	else if(flag == 'bizknd'){
    		var returnArray = [{value:'', text: demandMsgArray['select'] }];
			bizKndList = returnArray.concat(response.list);
    	}
    	else if(flag == 'save'){
    		bodyProgressRemove();
			callMsgBox('', 'I', demandMsgArray['saveSuccess'], function() {
    			searchBizDiv();
			} ); /*저장을 완료 하였습니다.*/
    	} 
    	else if(flag == 'sccpy'){
    		var returnArray = [{value:'', text: demandMsgArray['select'] }];
    		sccpyList = returnArray.concat(response.list);
    	}
    	else if(flag == "erpBizTyp"){
    		var returnArray = [{value:'', text: demandMsgArray['mandatory'] }];
    		erpBizTypList = returnArray.concat(response.list);
    	}
    	else if(flag == 'afeDiv'){
    		if (response.lists != null) {
    			$( '#afeDiv').setData({data : response.lists});
    			
    			var stdAfeDiv = "";
    			for (var i = 0; i < response.lists.length; i++) {
    				if (response.lists[i].stdAfeDivYn == 'Y') {
    					stdAfeDiv = response.lists[i].cd;
    				}
    			}

    			if (stdAfeDiv != "") {
    				$('#afeDiv').setSelected(stdAfeDiv);
    			} 
    		}
    	}
    	else if (flag == 'erpEqpTypCd') {
    		/*var returnArray = [{value:'', text: demandMsgArray['select'] }];
    		erpEqpTypCdList = returnArray.concat(response);
    		$('#erpEqpTypCdList').setData({data : erpEqpTypCdList});*/
    		erpEqpTypCdList = response;
    		$('#erpEqpTypCdList').setData({data : response});
    	}
    }
    
    //request 실패시.
    function failDemandCallback(response, flag){
    	if (flag == 'save') {
    		bodyProgressRemove();
    		alertBox('W', response.message);
    		return;
    	}
    	if(flag == 'btnSearchBizDiv'){
    		hideProgress(gridId);
    		$( '#'+gridId).alopexGrid("dataEmpty");

    		alertBox('W', demandMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		setColumnViewOption();
    	}
    	if(flag == 'afeDiv'){
    		//$( '#afeDiv').setData({data : {cd:demandMsgArray['none'], cdNm:demandMsgArray['none']}});
    	}
    }
    
    
    // 자재그리드 셀값 편집시
    $('#'+gridId).on('cellValueEditing', function(e){
    	var ev = AlopexGrid.parseEvent(e);        	
    	var result;
    	var data = ev.data;
    	var mapping = ev.mapping;
    	var $cell = ev.$cell;
    	var editRow = data._index.row;
    	
    	if(data._key != "demdInvtDivCd")		return true;
    	
    	//장비일 경우
    	if(ev.value == "102001"){
    		$('#'+gridId).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'lnsccpyCd');   // 재고사용수량
        	$('#'+gridId).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'lnsccpyCd'); 
        	$('#'+gridId).alopexGrid('endEdit', {_index: {id: ev.data._index.id}});
        	$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}});
    	}
    	
    	// 선로 관로일 경우
    	else if(ev.value == "102002"){
    		$('#'+gridId).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'eqpsccpyCd');   // 재고사용수량
        	$('#'+gridId).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'eqpsccpyCd'); 
        	
        	$('#'+gridId).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'erpEqpTypVal');   // ERP장비/선로 설정
        	$('#'+gridId).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'erpEqpTypVal'); 

        	$('#'+gridId).alopexGrid('cellEdit', "", {_index: {id: ev.data._index.id}}, 'erpEqpTypNm');   // ERP장비/선로 설정
        	$('#'+gridId).alopexGrid('refreshCell', {_index: {id: ev.data._index.id}}, 'erpEqpTypNm'); 
        	
        	$('#'+gridId).alopexGrid('endEdit', {_index: {id: ev.data._index.id}});
        	$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}});
    	}
    	else{
    		$('#'+gridId).alopexGrid('endEdit', {_index: {id: ev.data._index.id}});
        	$('#'+gridId).alopexGrid('startEdit', {_index: {id: ev.data._index.id}});
    	}
    
    	return true;
    });    
});
