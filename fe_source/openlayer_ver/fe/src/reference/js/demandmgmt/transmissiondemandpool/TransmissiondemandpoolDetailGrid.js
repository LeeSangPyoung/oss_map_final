/**
 * ErpPriceList
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */

//그리드 ID
var gridEqp = 'resultEqpListGrid';
// var gridMtl = 'resultMtlListGrid';
var gridBld = 'resultBldListGrid';
var gridLn = 'resultLnListGrid';
var gridFile = 'resultFileListGrid';
var gridLand = 'resultLandListGrid';

  	//Grid 초기화
    function initDetailGrid() {
    	
    	// 장비 그리드
    	var mappingEqp = [
    	               		  { selectorColumn : true, width : '50px' }
    	            		, { key : 'check', align:'center', width:'50px', title : demandMsgArray['number'], numberingColumn : true } /*'번호'*/
    	            		, { key : 'detlCstrDivCd', align:'center', width:'146px', title : '<em class="color_red">*</em>' + demandMsgArray['cstrTyp'], /*공사유형*/ 
		            			render : {type: 'string', rule: function(value, data){ return [].concat(cstrDiv);}},
	            				editable : { type: 'select', rule: function(value, data) { return cstrDiv; } }, 
	            				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
    	            		, { key : 'bfIntgFcltsNm', align:'left', width:'200px', title : '<em class="color_red">*</em>'+'이설(전)명', /*통합시설명*/
    	            			render : function(value, data) { 
		            				 var currentData = AlopexGrid.currentData(data); 
	            				     var celStr = '이설(전)명'/*"통합시설명"*/ ;
	            				     
	            				     if(currentData.detlCstrDivCd != '6'){
	            				    	 celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
		            				     return celStr;
	            				     }
	            				     
	            				     if (nullToEmpty(data.bfIntgFcltsCd) != "") {    	            				    	 
	            				    	 celStr = value;
	            				     }
	            				     //celStr = '<div class="textsearch_1 Float-left" style="width:160px">' + celStr +'  <button class="Button search" id="intgFcltsNmBtn"></button></div>';
	            				     celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
	            				     return celStr;
    	            		    }, refreshBy: 'detlCstrDivCd'
    	            		    //,styleclass : function(value, data, mapping) { if (procStFlag == 'E') {return 'link_cell-in-grid'}}
    	            		  }
		            		, { key : 'bfIntgFcltsCd', align:'center', width:'50px', title : '이설(전)명'
		            			, render : function(value, data) { 
		            				var currentData = AlopexGrid.currentData(data); 
		            				
		            				if(currentData.detlCstrDivCd != '6'){
	            				    	return "";
	            				    }
		            				
		            				return value;
		            			}, refreshBy: 'detlCstrDivCd', hidden:true} /*'통합시설코드'*/
    	            		, { key : 'intgFcltsNm', align:'left', width:'200px', title : '<em class="color_red">*</em>'+demandMsgArray['integrationFacilitiesName'], /*통합시설명*/
    	            			render : function(value, data) { 
    	            				     var celStr = demandMsgArray['integrationFacilitiesName']/*"통합시설명"*/;
    	            				     var currentData = AlopexGrid.currentData(data); 
    	            				     
    	            				     if (nullToEmpty(data.intgFcltsNm) != "") {    	            				    	 
    	            				    	 celStr = value;
    	            				     }
    	            				     //celStr = '<div class="textsearch_1 Float-left" style="width:160px">' + celStr +'  <button class="Button search" id="intgFcltsNmBtn"></button></div>';
    	            				     celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
    	            				     return celStr;
    	            		    }, refreshBy: 'detlCstrDivCd'
    	            		    //,styleclass : function(value, data, mapping) { if (procStFlag == 'E') {return 'link_cell-in-grid'}}
    	            		  }
		            		, { key : 'intgFcltsCd', align:'center', width:'50px', title : demandMsgArray['integrationFacilitiesCode'] 
		            			, render : function(value, data) {
		            				return value;
		            			}, hidden:true, refreshBy: 'detlCstrDivCd'} /*'통합시설코드'*/
		            		, { key : 'intgFcltsBonbu', align:'center', width:'50px', title : demandMsgArray['integrationHdofc'] 
		            			, render : function(value, data) {
		            				return value;
		            			}, hidden:true, refreshBy: 'detlCstrDivCd'} /*'통합시설본부'*/
    	            		, {    key : 'sclDivCd', align:'center', width:'146px', title : '<em class="color_red">*</em>'+demandMsgArray['smallClassification'] /*소분류*/
    	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(sclCombo);}}
    	            			,  editable : { type: 'select', rule: function(value, data) { return sclCombo; } } 
    	        				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val()}
    	        				,  hidden: true
    	        			  }
    	            		, { key : 'eqpTypCd', align:'center', width:'120px', title : '장비Type'
    		        			,  render : {type: 'string', rule: function(value, data){ return [].concat(eqpCombo);}}
    		        			,  editable : { type: 'select', rule: function(value, data) { return eqpCombo; } } 
    		    				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
    		        		  }
    	            		, { key : 'shpTypCd', align:'left', width:'146px', title : demandMsgArray['shapeType'] ,/*형상Type*//*'<em class="color_red">*</em>'+*/
    	            			render : { type: 'string'
	            					 , rule: function(value, data){ 
	            						 var render_data = [];
			    							var currentData = AlopexGrid.currentData(data);
			    							if (shpTypCombo[currentData.eqpTypCd]) {
			    								return render_data = render_data.concat(shpTypCombo[currentData.eqpTypCd]);
			    							} else {
			    							return render_data.concat({value : data.shpTypCd, text : data.shpTypNm});
			    						    }
	            					 }
        		         		},
    	            			editable: function (value, data, render, mapping, grid) {
    	            				var currentData = AlopexGrid.currentData(data);    	            				
    	        					if (currentData.eqpTypCd != null && currentData.eqpTypCd != '' ) {  
    	        						var $select = $('<select class="alopexgrid-default-renderer">');
    	        						if (shpTypCombo[currentData.eqpTypCd] && shpTypCombo[currentData.eqpTypCd].length>0) {
    	        							var selectYn = "";
    	        							for (var i=0,l=shpTypCombo[currentData.eqpTypCd].length;i<l;i++) {
    	        								if (shpTypCombo[currentData.eqpTypCd][i].value == currentData.shpTypCd) {
    	        									selectYn = "selected";
    	        								} else {
    	        									selectYn = "";
    	        								};
    	        								$select.append('<option value="'+shpTypCombo[currentData.eqpTypCd][i].value+'" ' + selectYn +'>'+shpTypCombo[currentData.eqpTypCd][i].text+'</option>');
    	        							}
    	        						} else {
    	        							var $select = $('<select class="alopexgrid-default-renderer">');
        	        						$select.append('<option value="">'+demandMsgArray['none']+'</option>');/*없음*/
        	        						return $select;
    	        						}
    	        						return $select;
    	        				    } else {
    	        				    	var $select = $('<select class="alopexgrid-default-renderer">');
    	        						$select.append('<option value="">'+demandMsgArray['none']+'</option>');/*없음*/
    	        						return $select;
    	        				    }
    	        				},
    	        				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }, 
    	        				refreshBy: 'eqpTypCd'
    	        			  }
    	            		, { key : 'demdEqpMdlCd', align:'left', width:'146px', title : /*'<em class="color_red">*</em>' +*/ demandMsgArray['equipmentModel']/* 장비모델*/ 
    	            		         , render : { type: 'string'
	            					 , rule: function(value, data){ 
           						 			var render_data = [];
				    							var currentData = AlopexGrid.currentData(data);
				    							if (eqpMdlCombo[currentData.eqpTypCd]) {
				    								return render_data = render_data.concat(eqpMdlCombo[currentData.eqpTypCd]);
				    							} else {
				    							return render_data.concat({value : data.demdEqpMdlCd, text : data.demdEqpMdlNm});
				    						    } 
	            		         		}
	            					}
    	            		   , editable: function (value, data, render, mapping, grid) {
		       						var currentData = AlopexGrid.currentData(data);    	            				
			        					if (currentData.eqpTypCd != null && currentData.eqpTypCd != '' ) {    	        						
			        						var $select = $('<select class="alopexgrid-default-renderer">');
			        						if (eqpMdlCombo[currentData.eqpTypCd] && eqpMdlCombo[currentData.eqpTypCd].length>0) {
				        						//$select.append('<option value="">'+demandMsgArray['mandatory']+'</option>'); /*필수*/
			        							var selectYn = "";
			        							for (var i=0,l=eqpMdlCombo[currentData.eqpTypCd].length;i<l;i++) {
			        								if (eqpMdlCombo[currentData.eqpTypCd][i].value == currentData.demdEqpMdlCd) {
			        									selectYn = "selected";
			        								} else {
			        									selectYn = "";
			        								};
			        								$select.append('<option value="'+eqpMdlCombo[currentData.eqpTypCd][i].value+'" ' + selectYn +'>'+eqpMdlCombo[currentData.eqpTypCd][i].text+'</option>');
			        							}
			        						} else {
				        						$select.append('<option value="">'+demandMsgArray['none']+'</option>');/*없음*/
			        						}
			        						return $select;
			        				    } else {
			        				    	var $select = $('<select class="alopexgrid-default-renderer">');
			        						$select.append('<option value="">'+demandMsgArray['none']+'</option>');/*없음*/
			        						return $select;
			        				    }
		        				},
		        				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }, 
		        				refreshBy: 'eqpTypCd',
		        				hidden: true
    	            		  }
    	            		
    	            		, { key : 'eqpCnt', align:'right', width:'70px', title : '<em class="color_red">*</em>'+demandMsgArray['equipmentSetCount'] /*장비식수*/ 
    	            			,  render : {type:"string", rule : "comma"}
    	            		    ,  validate : {  allowInvalid : false
    	            		    	           , rule : { number:true}}    	            		                   
            					,  editable : { type: "text" 
            						           ,styleclass : 'num_editing-in-grid'
            					 	   		   ,attr : { "data-keyfilter-rule" : "digits", "maxlength" : "5"}}, hidden: true}
    	            		, { key : 'mtrlUprc', align:'right', width:'100px', title : demandMsgArray['materialUnitPrice'] + '(원)' /*물자단가*/    	            			
    	            		    ,  render: {type:"string", rule : "comma"}
        						,  editable : {  type: 'text'
        							           , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
						           			   , styleclass : 'num_editing-in-grid'}, hidden: true}
    	            		, { key : 'cstrUprc', align:'right', width:'100px', title : demandMsgArray['constructionUnitPrice'] + '(원)' 
    	            			,  render: {type:"string", rule : "comma"}/*공사비*/
            		   			,  editable : {  type: 'text'
		            		   					, attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
		            		   					, styleclass : 'num_editing-in-grid'}, hidden: true} /*'공사단가'*/
    	            		, { key : 'cstrCost', align:'right', width:'120px', title : demandMsgArray['constructionCost']/*공사비' */,  render: {type:"string", rule : "comma"}
	       						,  editable : {  type: 'text'
	       							           , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
			           			               , styleclass : 'num_editing-in-grid'}}
    	            		, {   key : 'mtrlCost', align:'right', width:'120px', title : demandMsgArray['materialPrice'] ,  render: {type:"string", rule : "comma"}/*물자비*/
		            		,  editable : {  type: 'text'
		            			, attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
		            		, styleclass : 'num_editing-in-grid'}}
    	            		, { key : 'investAmt', hidden: true, align:'right', width:'140px', title : demandMsgArray['totalInvestCost'], render: {type:"string", rule : "comma"}}/*'총투자비'*/
    	            		, { key : 'erpUsgCd', hidden:true, align:'center', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['usage']/*용도' */    	            			
    	            		    ,  render : {type: 'string', rule: function(value, data){ return [].concat(erpUsg);}}
	            				,  editable : { type: 'select', rule: function(value, data) { return erpUsg; } } 
	            				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
    	            		, { key : 'systmNo', hidden: true, align:'center', width:'100px', title : demandMsgArray['systemNumber'],  render : function(value, data){ return value;} /*'시스템번호'*/
        						,  editable : {  type: 'text'
        							           , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "5"}
			           			               , styleclass : 'num_editing-in-grid'}}
    	            		, { key : 'openYm', align:'center', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['openMonth']/*개통월'*/    	            			
    	            		    ,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
    	            		    ,  editable : function (value, data) {  
    	            		    				var $x = $('<div class="Dateinput" data-pickertype="monthly" data-format="yyyyMM"><input type="text" value="' + value + '"  ></div>');
    	            		    				$a.convert($x);
    	            		    				return $x;
    	            		    }
	    	            		,  editable : {  type: 'text'}
	    	            	}
    	            		, { key : 'cstrMeansCd', hidden:true, align:'center', width:'120px', title : '<em class="color_red">*</em>' + demandMsgArray['means']/*방식' */    	            			
    	            		    ,  render : {type: 'string', rule: function(value, data){ return [].concat(cstrMc);}}
	            				,  editable : { type: 'select', rule: function(value, data) { return cstrMc; } } 
	            				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
    	            		, { key : 'fstInvtTypCd', align:'center', width:'140px', title : '<em class="color_red">*</em>'+demandMsgArray['purposeInvestType']+'1'  /*목적별투자유형1*/
    	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(fstInvtTypCd);}}
	            				,  editable : { type: 'select', rule: function(value, data) { return fstInvtTypCd; } } 
	            				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
    	            		, { key : 'scndInvtTypCd', align:'center', width:'150px', title : '<em class="color_red">*</em>'+demandMsgArray['purposeInvestType']+'2'/*목적별투자유형2' */    	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(scndInvtTypCd);}}
            				    ,  editable : { type: 'select', rule: function(value, data) { return scndInvtTypCd; } } 
            				    ,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
    	            		, { key : 'thrdInvtTypCd', align:'center', width:'140px', title : '<em class="color_red">*</em>'+demandMsgArray['purposeInvestType']+'3'/*목적별투자유형3' */    	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(thrdInvtTypCd);}}
            					,  editable : { type: 'select', rule: function(value, data) { return thrdInvtTypCd; } } 
            					,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
    	            		, { key : 'trmsDemdMgmtNo', align:'center', width:'40px', title : demandMsgArray['transmissionDemandManagementNumber'], hidden:true }/*'전송수요관리번호'*/
    	            		, { key : 'trmsDemdEqpSrno', align:'center', width:'40px', title : demandMsgArray['equipmentSerialNumber'], hidden:true }/*'장비일련번호'*/
    	            		, { key : 'sidoNm', align:'center', width:'40px', title : demandMsgArray['equipmentSerialNumber'], hidden:true }/*'시도명'*/
    	            		, { key : 'sggNm', align:'center', width:'40px', title : demandMsgArray['equipmentSerialNumber'], hidden:true }/*'시군구명'*/
    	            		, { key : 'emdNm', align:'center', width:'40px', title : demandMsgArray['equipmentSerialNumber'], hidden:true }/*'읍면동명'*/
			];  
  		
        //그리드 생성
        $('#'+gridEqp).alopexGrid({
        	//autoColumnIndex : true,
        	pager : false,
        	columnMapping : mappingEqp,
        	//disableTextSelection : true,
            cellSelectable : true,
            rowClickSelect : false,
            rowInlineEdit : false,
            rowSingleSelect : false,
            numberingColumnFromZero : false,
            height : 152
        });
        
     /*                  
        // 자재그리드
        var mappingMtl = [
	               		  { selectorColumn : true, width : '25px' }
	            		, { key : 'check', align:'center', width:'40px', title : '번호', numberingColumn : true }
	            		, { key : 'mtrlKndNm', align:'left', width:'100px', title : demandMsgArray['materialsKind'], render : function(value, data) { return value;}, hidden:true}'자재종류'
	            		, { key : 'mtrlKndCd', align:'left', width:'50px', title : demandMsgArray['materialKindCode'], render : function(value, data) { return value;}, hidden:true}물자종류
	            		, { key : 'namsMatlCd', align:'center', width:'100px', title : demandMsgArray['materialsCode'], render : function(value, data) { return value;}} '자재코드'
	            		, { key : 'eqpMatlNm', align:'left', width:'300px', title : demandMsgArray['materialsName'], render : function(value, data) { return value;}} '자재명'
	            		, { key : 'vendVndrCd', align:'center', width:'40px', title : demandMsgArray['vendorVendorCode'], render : function(value, data) { return value;}, hidden:true} '제조사업체코드'
	            		, { key : 'inveTotCnt', align:'right', width:'100px', title : demandMsgArray['totalInventoryQuantity'], render : function(value, data) {return value;}}'총재고수량'
	            		, { key : 'demdTotCnt', align:'right', width:'130px', title : demandMsgArray['planDemandInventoryUseQuantity'], render : {type:"string", rule : "comma"}} '계획수요재고사용수량'
	            		, { key : 'demdCnt', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['needQuantity'] , render : {type:"string", rule : "comma"}필요수량'
	            		    , editable : {  type: 'text'
	            		    	          , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
 			                              , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'inveUseQuty', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['inventoryUseQuantity'], render :  {type:"string", rule : "comma"}재고사용수량'
	            		    ,  editable : {  type: 'text'
	            			              , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
			                              , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'orgInveUseQuty', align:'right', width:'120px', title : demandMsgArray['orgInventoryUseQuantity'], render : {type:"string", rule : "comma"}, hidden:true}'ORG재고사용수량'
	            		, { key : 'newQuty', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['newQuantity'], render : {type:"string", rule : "comma"}신규수량'
	            		    ,  editable : {  type: 'text'
	            			              , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
	           			                  , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'mtrlUprc', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['materialUnitPrice'], render : {type:"string", rule : "comma"}물자단가'
	            		   ,  editable : {  type: 'text'
	            			              , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
	           			                  , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'mtrlAmt', align:'right', width:'120px', title : demandMsgArray['materialPrice'], render : {type:"string", rule : "comma"}}'물자비'
	            		, { key : 'trmsDemdMgmtNo', align:'center', width:'40px', title : demandMsgArray['transmissionDemandManagementNumber'], render : function(value, data) { return value;}, hidden:true}'전송망수요관리번호'
	            		, { key : 'trmsDemdEqpSrno', align:'center', width:'40px', title : demandMsgArray['equipmentSerialNumber'], render : function(value, data) { return value;}, hidden:true}'전송망장비일련번호'
	            		, { key : 'mtrlSerlNo', align:'center', width:'40px', title : demandMsgArray['materialSerialNumber'], render : function(value, data) { return value;}, hidden:true}'물자일련번호'
	            		, { key : 'eqpTypNm', align:'center', width:'40px', title : demandMsgArray['equipmentType'], render : function(value, data) { return value;}, hidden:true}'장비Type'
	            		, { key : 'demdEqpMdlNm', align:'center', width:'40px', title : demandMsgArray['equipmentModel'], render : function(value, data) { return value;}, hidden:true}'장비모델'
	    ];  
	
		 //그리드 생성
		 $('#'+gridMtl).alopexGrid({
		 	autoColumnIndex : true,
		 	columnMapping : mappingMtl,
		 	disableTextSelection : true,
		    cellSelectable : true,
		    rowClickSelect : false,
		    rowInlineEdit : false,
            rowSingleSelect : false,
		    numberingColumnFromZero : false,
        	pager : false,
		    height : 180
		 });
		 	*/	 	        
        // 건물정보그리드
        var mappingBld = [
	               		  { selectorColumn : true, width :'40px' }
	            		, { key : 'check', align:'center', width:'50px', title : demandMsgArray['number'], numberingColumn : true }/*'번호'*/
	            		, { key : 'bldNm', align:'left', width:'200px', title : demandMsgArray['buildingName'], render : function(value, data) { return nullToEmpty(value);}}/*'건물명'*/
	            		, { key : 'cnstrDivCdNm', align:'center', width:'90px', title : demandMsgArray['cnstrDivisionName'], render : function(value, data) { return nullToEmpty(value);} }/*'건축구분명'*/
	            		, { key : 'mainCnstrCnt', align:'center', width:'90px', title : demandMsgArray['mainCnstrCount'] , render : {type:"string", rule : "comma"} }/*'주건축물수'*/
	            		, { key : 'anxCnstrDongCnt', align:'center', width:'120px', title : demandMsgArray['annexConstructionDongCount'] , render : {type:"string", rule : "comma"}}/*'부속건축물동수'*/ 
	            		, { key : 'demdBldAddr', align:'left', width:'250px', title : demandMsgArray['address'] }/*'주소'*/
	            		, { key : 'mainUsgCdNm', align:'center', width:'120px', title : demandMsgArray['weekUsageCodeName'] }/*'주용도코드명'*/
	            		, { key : 'genCnt', align:'center', width:'80px', title : demandMsgArray['generationCount'] , render : {type:"string", rule : "comma"}}/*'세대수'*/
	            		, { key : 'houshCnt', align:'center', width:'80px', title : demandMsgArray['householdCount'] , render : {type:"string", rule : "comma"}}/*'가구수'*/
	            		, { key : 'florCntGrudVal', align:'center', width:'80px', title : demandMsgArray['totalFloorCountGrount'] }/*총수(지상)*/
	            		, { key : 'bsmtFlorCnt', align:'center', width:'80px', title : demandMsgArray['totalFloorCountUnderGrount'] , render : {type:"string", rule : "comma"}}/*'총수(지하)'*/
	            		, { key : 'bgcscSchdDt', align:'center', width:'120px', title : demandMsgArray['beginConstructionScheduleDate'] }/*'착공예정일자'*/
	            		, { key : 'cmplSchdDt', align:'center', width:'120px', title : demandMsgArray['completionScheduleDate'] }/*'준공예정일자'*/
	            		, { key : 'trmsDemdMgmtNo', align:'center', width:'80px', title : demandMsgArray['transmissionDemandManagementNumber'], hidden:true }/*'전송망수요관리번호'*/
	            		, { key : 'demdBldSrno', align:'center', width:'80px', title : demandMsgArray['demandBuildingSerialNumber'], hidden:true }/*'수요건물일련번호'*/
	            		, { key : 'lcenMgmtNo', align:'center', width:'80px', title : demandMsgArray['licensingManagementNumber'], hidden:true }/*'인허가관리번호'*/
	            		, { key : 'pnuLtnoCd', align:'center', width:'80px', title : demandMsgArray['pnuLotNumberCode'], hidden:true }/*'PNU지번코드'*/
	            		, { key : 'bldCd', align:'center', width:'100px', title : demandMsgArray['buildingCode'], hidden:true }/*'건물코드'*/
	            		, { key : 'fdaisBldCd', align:'center', width:'100px', title : demandMsgArray['fieldActualInspectionBuildingCode'], hidden:true }/*'현장실사빌딩코드'*/
		];  
	
		 //그리드 생성
		 $('#'+gridBld).alopexGrid({
		 	 autoColumnIndex : true,
		 	 columnMapping : mappingBld,
		 	 disableTextSelection : true,
		     cellSelectable : true,
		     rowClickSelect : false,
	         rowSingleSelect : false,
		     rowInlineEdit : false,
		     numberingColumnFromZero : false,
	         pager : false,
		     height : 150
		 });		 
		 
		// 선로정보그리드
	        var mappingLn = [
		               		  { selectorColumn : true, width : '50px' }
		            		, { key : 'check', align:'center', width:'40px', title : demandMsgArray['number'], numberingColumn : true }/*'번호'*/
    	            		, { key : 'intgFcltsNm', align:'left', width:'200px', title : '<em class="color_red">*</em>'+demandMsgArray['integrationFacilitiesName'], /*통합시설명'*/
    	            			    render : function(value, data) { 
	    	            				 var celStr = demandMsgArray['integrationFacilitiesName'];
		            				     if (nullToEmpty(data.intgFcltsCd) != "") {    	            				    	 
		            				    	 celStr = value;
		            				     }
		            				     //celStr = '<div class="textsearch_1 Float-left" style="width:160px">' + celStr +'         <button class="Button search" id="intgFcltsNmBtn"></button></div>';
		            				     //celStr = '<div style="width:100%"><button class="grid_search_icon Valign-md" id="intgFcltsNmBtn"></button><span class="Valign-md">' + celStr +'</span></div>';
		            				     
		            				     var currentData = AlopexGrid.currentData(data);
		            				     /*
		            				     if(currentData.lnTypCd == lnDefaultIdx1.lnTypCd && lnDefaultIdx1.intgFcltsNm != "")		celStr = lnDefaultIdx1.intgFcltsNm;
				            			 if(currentData.lnTypCd == lnDefaultIdx2.lnTypCd && lnDefaultIdx2.intgFcltsNm != "")		celStr = lnDefaultIdx2.intgFcltsNm;
				            			 */
				            			 celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
				            			 
		            				     return celStr;
    	            				//return (nullToEmpty(data.intgFcltsCd) == "") ? demandMsgArray['integrationFacilitiesName']: value; /*"통합시설명"*/ 
    	            			}, 
    	            			editedValue : function (cell, data){
		            				var currentData = AlopexGrid.currentData(data);
		            				var val = "";
		            				/*
		            				if(currentData.lnTypCd == lnDefaultIdx1.lnTypCd)		val = lnDefaultIdx1.intgFcltsNm;
			            			if(currentData.lnTypCd == lnDefaultIdx2.lnTypCd)		val = lnDefaultIdx2.intgFcltsNm;
		            				*/
		            				return val; 
		            			},
		        				refreshBy: 'lnTypCd'
    	            		    //, styleclass : function(value, data, mapping) { if (procStFlag == 'E') {return 'link_cell-in-grid'}}
    	            		  }
    	            		, { key : 'tmofNm', align:'center', width:'150px', title : '전송실', render : function(value, data) { return value;}, hidden:true}/*'전송실'*/
		            		, { key : 'intgFcltsCd', align:'center', width:'50px', title : demandMsgArray['integrationFacilitiesCode'], 
		            			render : function(value, data){
		            				var currentData = AlopexGrid.currentData(data);
	            				    /* 
	            				    if(currentData.lnTypCd == lnDefaultIdx1.lnTypCd)		value = lnDefaultIdx1.intgFcltsCd;
			            			if(currentData.lnTypCd == lnDefaultIdx2.lnTypCd)		value = lnDefaultIdx2.intgFcltsCd;
			            			 */
		            				return value;
		            			},
			            		editedValue : function (cell, data){
		            				var currentData = AlopexGrid.currentData(data);
		            				var val = data.intgFcltsCd;
		            				/*
		            				if(currentData.lnTypCd == lnDefaultIdx1.lnTypCd)		val = lnDefaultIdx1.intgFcltsCd;
			            			if(currentData.lnTypCd == lnDefaultIdx2.lnTypCd)		val = lnDefaultIdx2.intgFcltsCd;
		            				*/
		            				return val; 
		            			},
		            			refreshBy: 'lnTypCd',
		            			hidden:true}/*'통합시코드'*/
		            		, { key : 'intgFcltsBonbu', align:'center', width:'50px', title : demandMsgArray['integrationHdofc'],
		            			render : function(value, data){
		            				var currentData = AlopexGrid.currentData(data);
	            				    /* 
	            				    if(currentData.lnTypCd == lnDefaultIdx1.lnTypCd)		value = lnDefaultIdx1.intgFcltsBonbu;
			            			if(currentData.lnTypCd == lnDefaultIdx2.lnTypCd)		value = lnDefaultIdx2.intgFcltsBonbu;
			            			*/
		            				return value;
		            			},
		            			editedValue : function (cell, data){
		            				var currentData = AlopexGrid.currentData(data);
		            				var val = data.intgFcltsBonbu;
		            				/*
		            				if(currentData.lnTypCd == lnDefaultIdx1.lnTypCd)		val = lnDefaultIdx1.intgFcltsBonbu;
			            			if(currentData.lnTypCd == lnDefaultIdx2.lnTypCd)		val = lnDefaultIdx2.intgFcltsBonbu;
		            				*/
		            				return  val; 
		            			},
		            			refreshBy: 'lnTypCd',
		            			hidden:true}/*'통합시설본부'*/
		            		, {   key : 'demdLnSctnInfCtt', align:'center', width:'150px', title : '<em class="color_red">*</em>'+demandMsgArray['section']   /*구간*/		
		            		   ,  render : function(value, data){ return value;}
		            		   ,  editable :  {   type: 'text'
			              			, attr : {"maxlength" : "100"}}
		            		}
		            		, { key : 'lnTypCd', align:'center', width:'146px', title : '<em class="color_red">*</em>'+demandMsgArray['lineTypeEng'] /*선로Type*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(lnCombo);}}
		            			,  allowEdit: function(value, data, mapping){
		            					if(data.erpAprvResult == "Y" && (data.trmsDemdLnSrno == defaulttrmsDemdLnSrno[0] || data.trmsDemdLnSrno == defaulttrmsDemdLnSrno[1]))
		            						return false;
		            					
		            					if(ProcStatCd == "105003" && (data.trmsDemdLnSrno < defaulttrmsDemdLnSrno[0] || data.trmsDemdLnSrno < defaulttrmsDemdLnSrno[1]))
		            						return false;
		            					
		            				/*	if(data._index.row == lnDefaultIdx1.idx || data._index.row == lnDefaultIdx2.idx)
		            						return false;*/
		            						
		            					return true;	
		            			   }
		            			,  editable : { type: 'select', rule: function(value, data) { return lnCombo; } } 
		        				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
		        			  }
		            		, { key : 'shpTypCd', align:'center', width:'156px', title : '<em class="color_red">*</em>'+demandMsgArray['shapeType'] ,/*형상Type*/
		            			render : { type: 'string'
		            				, rule: function(value, data){ 
	            						 	var render_data = [];
			    							var currentData = AlopexGrid.currentData(data);
			    							if (shpTypCombo[currentData.lnTypCd]) {
			    								return render_data = render_data.concat(shpTypCombo[currentData.lnTypCd]);
			    							} else {
			    								return render_data.concat({value : data.shpTypCd, text : data.shpTypNm});
			    						    }
	            					 }
		            			},
		            			editable: function (value, data, render, mapping, grid) {
		            				var currentData = AlopexGrid.currentData(data);    	            				
		        					if (currentData.lnTypCd != null && currentData.lnTypCd != '' ) {  
		        						var $select = $('<select  class="alopexgrid-default-renderer">');
		        						$select.append('<option value="">'+demandMsgArray['mandatory']+'</option>'); /*필수*/
		        						if (shpTypCombo[currentData.lnTypCd] && shpTypCombo[currentData.lnTypCd].length>0) {
		        							var selectYn = "";
		        							for (var i=0,l=shpTypCombo[currentData.lnTypCd].length;i<l;i++) {
		        								if (shpTypCombo[currentData.lnTypCd][i].value == currentData.shpTypCd) {
		        									selectYn = "selected";
		        								} else {
		        									selectYn = "";
		        								};
		        								$select.append('<option value="'+shpTypCombo[currentData.lnTypCd][i].value+'" ' + selectYn +'>'+shpTypCombo[currentData.lnTypCd][i].text+'</option>');
		        							}
		        						} else {
		        							var $select = $('<select class="alopexgrid-default-renderer">');
	 	        						    $select.append('<option value="">'+demandMsgArray['mandatory']+'</option>'); /*필수*/
	 	        						    return $select;
		        						}
		        						return $select;
		        				    } else {
		        				    	var $select = $('<select  class="alopexgrid-default-renderer">');
		        						$select.append('<option value="">'+demandMsgArray['none']+'</option>');/*없음*/
		        						return $select;
		        				    }
		        				},
		        				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }, 
		        				refreshBy: 'lnTypCd'
		        			  }
		            		, { key : 'detlCstrDivCd', align:'center', width:'146px', title : '<em class="color_red">*</em>'+demandMsgArray['cstrTyp'] /*공사유형*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(cstrDiv);}}
		         				//,  editable : { type: 'select', rule: function(value, data) { return cstrDiv; } }
			            		, editable: function (value, data, render, mapping, grid) {
		            				var currentData = AlopexGrid.currentData(data);    	
	        						var $select = $('<select class="alopexgrid-default-renderer">');
        							var selectYn = "";
        							for (var i=0,l=cstrDiv.length;i<l;i++) {
        								if (cstrDiv[i].value == currentData.lnTypCd) {
        									selectYn = "selected";
        								} else {
        									selectYn = "";
        								};
        								if (cstrDiv[i].value == "1") {
            								$select.append('<option value="'+cstrDiv[i].value+'" ' + selectYn +'>'+cstrDiv[i].text+'</option>');
        								}
        							}
	        						return $select;
		        				}
		         				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
		         			  }
		            		, {   key : 'sctnLen', hidden:true, align:'right', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['sectionLength'] ,  render: {type:"string", rule : "comma"}/*구간길이*/
		            		   ,  editable : {  type: 'text'
		            			              , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "6"}
		           			                  , styleclass : 'num_editing-in-grid'}}
		            		, { key : 'cstrUprc', align:'right', width:'40px', title : demandMsgArray['constructionUnitPrice'],  render : function(value, data){ return value;}, hidden : true }/*'공사단가' */
		            		, {   key : 'cstrCost', align:'right', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['constructionCost'] ,  render: {type:"string", rule : "comma"}/*공사비*/
		            		   ,  editable : {  type: 'text'
		            			              , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
		           			                  , styleclass : 'num_editing-in-grid'}}
		            		, { key : 'erpUsgCd', hidden:true, align:'center', width:'120px', title : '<em class="color_red">*</em>' +demandMsgArray['usage']/*용도*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(erpUsg);}}
		         				,  editable : { type: 'select', rule: function(value, data) { return erpUsg; } } 
		         				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
		            		, { key : 'openYm', hidden:true, align:'center', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['openMonth']/*개통월*/
		            			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
		            		    /*,  editable : function (value, data) {
		            		    				var $x = $('<div class="Dateinput" data-pickertype="monthly" data-format="yyyyMM"><input value="' + value + '"></div>');
		            		    				$a.convert($x);
		            		    				return $x;
		            		    }*/
		            			,  editable : {  type: 'text'}
		            		  }
		            		, { key : 'lcenReqDt', align:'center', width:'120px', title : demandMsgArray['lcenRequestDate'] /*인허가요청일자*/
		            			,  render : function(value, data) { return (value == "" ? "YYYYMMDD" : value); }
		            		    /*,  editable : function (value, data) {
		            		    				var $x = $('<div class="Dateinput" data-default-date="false" data-pickertype="daily" data-format="yyyyMMDD"><input value="' + value + '"></div>');
		            		    				$a.convert($x);
		            		    				return $x;
		            		    }*/
		            			,  editable : {  type: 'text'}
		            		  }
		            		, { key : 'lcenObjCtt', align:'center', width:'150px', title : demandMsgArray['lcenObjectCtt'] /*인허가대상내용*/
		            			,  editable : { type: 'text', attr : { "data-keyfilter-rule" : "string", "maxlength" : "15"}}
		            		  }
		            		, { key : 'ipTlplQuty', align:'right', width:'100px', title : demandMsgArray['ipTelephonePoleCount'] /*IP전주수량*/
		            			,  editable : { type: 'text', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "10"} , styleclass : 'num_editing-in-grid'}
		            		  }
		            		, { key : 'etpplYn', align:'center', width:'146px', title : demandMsgArray['endTelephonePoleYn'] /*종말주여부*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(etpplYn);}}
	         					,  editable : { type: 'select', rule: function(value, data) { return etpplYn; } } 
	         					,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
		            		  }
		            		, { key : 'cstrMeansCd', hidden:true, align:'center', width:'120px', title : '<em class="color_red">*</em>' +demandMsgArray['means'] /*방식*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(cstrMc);}}
		         				,  editable : { type: 'select', rule: function(value, data) { return cstrMc; } } 
		         				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
		            		, { key : 'fstInvtTypCd', hidden:true, align:'center', width:'150px', title : '<em class="color_red">*</em>'+demandMsgArray['purposeInvestType'] +'1' /*목적별투자유형1*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(fstInvtTypCd);}}
		         				,  editable : { type: 'select', rule: function(value, data) { return fstInvtTypCd; } } 
		         				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
		            		, { key : 'scndInvtTypCd', hidden:true, align:'center', width:'170px', title : '<em class="color_red">*</em>' +demandMsgArray['purposeInvestType']+'2'/*목적별투자유형2*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(scndInvtTypCd);}}
		     				    ,  editable : { type: 'select', rule: function(value, data) { return scndInvtTypCd; } } 
		     				    ,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
		            		, { key : 'thrdInvtTypCd', hidden:true, align:'center', width:'170px', title : '<em class="color_red">*</em>' +demandMsgArray['purposeInvestType']+'3'/*목적별투자유형3*/
		            			,  render : {type: 'string', rule: function(value, data){ return [].concat(thrdInvtTypCd);}}
		     					,  editable : { type: 'select', rule: function(value, data) { return thrdInvtTypCd; } } 
		     					,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
		            		, { key : 'trmsDemdMgmtNo', align:'center', width:'40px', title : demandMsgArray['transmissionDemandManagementNumber'], render : function(value, data) { return value;}, hidden:true}/*'전송망수요관리번호'*/
		            		, { key : 'trmsDemdLnSrno', align:'center', width:'40px', title : demandMsgArray['transmissionDemandLineSerialNumber'], hidden:true }/*'전송수요선로일련번호'*/
		            		, { key : 'existLnLen', align:'right', width:'100px', title : demandMsgArray['existLineLength'] ,  render: {type:"string", rule : "comma"}/*'기설선로길이'*/
		            		 ,  editable : { type: 'text'
		            			           , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
		            		 			   , styleclass : 'num_editing-in-grid'}}
		            		, { key : 'nwLnLen', align:'right', width:'100px', title : demandMsgArray['newLineLength'],  render: {type:"string", rule : "comma"}/*'신설선로길이'*/
		            		 ,  editable : { type: 'text', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
      		 			   					, styleclass : 'num_editing-in-grid'}}
		            		, { key : 'nwCdlnLen', align:'right', width:'100px', title : demandMsgArray['newConductLineLength'] ,  render: {type:"string", rule : "comma"}/*'신설관로길이'*/
		            		 ,  editable : { type: 'text', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
      		 			   					, styleclass : 'num_editing-in-grid'}}
		            		, { key : 'lnInvtCost', align:'right', width:'100px', title : demandMsgArray['lineInvestCost'] ,  render: {type:"string", rule : "comma"}/*'선로투자비'*/
		            		 ,  editable : { type: 'text', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
		            		 				, styleclass : 'num_editing-in-grid'}}
		            		, { key : 'cdlnInvtCost', align:'right', width:'100px', title : demandMsgArray['conductLineInvestCost'] ,  render: {type:"string", rule : "comma"}/*'관로투자비'*/
		            		 ,  editable : { type: 'text', attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
      		 			   					, styleclass : 'num_editing-in-grid'}}	
		            		, { key : 'cstrAmt', align:'right', width:'120px', title : demandMsgArray['totalInvestCost'] ,  render: {type:"string", rule : "comma"}}/*'총투자비'*/
		            		, { key : 'erpAprvResult', align:'center', width:'40px', title : demandMsgArray['transmissionDemandLineSerialNumber'], hidden:true }/*'승인결과'*/ 
			];  
		
			 //그리드 생성
			 $('#'+gridLn).alopexGrid({
			 	autoColumnIndex : true,
			 	columnMapping : mappingLn,
			 	disableTextSelection : true,
			     cellSelectable : true,
			     rowClickSelect : false,
			     rowSingleSelect : false,
			     rowInlineEdit : false,
			     numberingColumnFromZero : false,
		         pager : false,
			     height : 195
			 });
			 
			 var mappingFile = [
			                    { selectorColumn : true, width : '50px' }
			                  , { key : 'check', align:'center', width:'40px', title : demandMsgArray['number'], numberingColumn : true  }/*'번호'*/
			                  , { key : 'atflId', title : demandMsgArray['attachedFileIdentification'], width : '80px' , hidden: true}/*'첨부파일ID'*/
			                  , { key : 'atflNm', title : demandMsgArray['fileName'], align : 'left', width: '1000px'}/*'파일명'*/
			                  , { key : 'tempFileNo', title : demandMsgArray['tempFileId'], width : '80px' , hidden: true}/*'임시파일'*/
			                  , { Key : 'trmsDemdMgmtNo', title : demandMsgArray['transmissionDemandManagementNumber'], 	align : 'left', hidden: true}/*'전송망수요관리번호'*/
			                  ];
			 
			 //그리드 생성
	        $('#'+gridFile).alopexGrid({
			 	autoColumnIndex : true,
			 	columnMapping : mappingFile,
			 	disableTextSelection : true,
			     cellSelectable : true,
			     rowClickSelect : true,
			     rowSingleSelect : false,
			     rowInlineEdit : false,
			     numberingColumnFromZero : false,
		         pager : false,
			     height : 130
			 });
	        
	    	// 토지건축정보그리드
	        var mappingLand = [
	                           	{ selectorColumn : true, width : '50px' }
	                           	, { key : 'check', title : demandMsgArray['number'], numberingColumn : true , align:'center', width:'40px'}
								, { key : 'hdofcNm', width:'100px', title :demandMsgArray['headOffice']}/*본부*/
								, { key : 'hdofcCd', width:'100px', title : demandMsgArray['headOfficeCode'], hidden:true}/*본부코드*/
								, { key : 'mtsoNm', align:'left', width:'200px', title : demandMsgArray['mobileTelephoneSwitchingOfficeName'], /*국사명*/
	    	            			render : function(value, data) { 
	    	            				     var celStr = demandMsgArray['mobileTelephoneSwitchingOfficeName']/*국사명*/;
	    	            				     if (nullToEmpty(data.mtsoCd) != "") {    	            				    	 
	    	            				    	 celStr = value;
	    	            				     }
	    	            				     //celStr = '<div class="textsearch_1 Float-left" style="width:160px">' + celStr +'  <button class="Button search" id="intgFcltsNmBtn"></button></div>';
	    	            				     celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
	    	            				     return celStr;
	    	            		    }
	    	            		    //,styleclass : function(value, data, mapping) { if (procStFlag == 'E') {return 'link_cell-in-grid'}}
	    	            		  }
								, { key : 'mtsoCd', align:'center', width:'50px', title : demandMsgArray['mobileTelephoneSwitchingOfficeCode'] , render : function(value, data) { return value;}, hidden:true} /*국사코드*/
								, { key : 'landPrchTotSumr', width:'100px', title : demandMsgArray['tot'], render : {type:"string", rule : "comma"}}/*계*/
								, { key : 'landPrchCtrtAmt', width:'100px', title : demandMsgArray['contractAmt'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*계약금*/
								/*, { key : 'landPrchCtrtAmtAtchdNm', width:'100px', title : demandMsgArray['attached'], align:'center',
									render : function(value, data) {
										var celStr = '<button class="Button button2 add_btn" id="attached01" type="button">' + demandMsgArray['attached']첨부 +'</button>&nbsp;<input type="text" style="width:15px; text-align:right;" value='+value+' readonly>';
										return celStr;}}*/
								, { key : 'landPrchMiddlPayAmt', width:'100px', title : demandMsgArray['middlePaymentAmount'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*중도금*/
								, { key : 'landPrchAcqtTaxAmt', width:'100px', title : demandMsgArray['acqtTaxAmount'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*취득세*/
								, { key : 'landPrchJugApprCmms', width:'100px', title : demandMsgArray['judgmentAppraisalCommission'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*감정평가수수료*/
								, { key : 'landPrchEtcAmt', width:'100px', title : demandMsgArray['etc'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*기타*/
								, { key : 'bldCnstCstrRealCstrCst', width:'100px', title : demandMsgArray['realConstructionCost'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*실공사비*/
								, { key : 'bldCnstCstrSfbdRate', width:'100px', title : demandMsgArray['successfulBidRate']
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "data-keyfilter" : ".", "maxlength" : "5"} , styleclass : 'num_editing-in-grid'}}/*낙찰율*/
								, { key : 'dsnServRealCstrCst', width:'100px', title : demandMsgArray['realConstructionCost'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*실공사비*/
								, { key : 'dsnServSfbdRate', width:'100px', title : demandMsgArray['successfulBidRate']
								   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "data-keyfilter" : ".", "maxlength" : "5"} , styleclass : 'num_editing-in-grid'}}/*낙찰율*/
								, { key : 'iptnServCst', width:'100px', title : demandMsgArray['inspectionServieCost'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*감리용역비*/
								, { key : 'acqtTaxAmt', width:'100px', title : demandMsgArray['acqtTaxAmount'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*취득세*/
								, { key : 'msrCst', width:'100px', title : demandMsgArray['measureCost'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*측량비*/
								, { key : 'kepcoRcvgCst', width:'100px', title : demandMsgArray['koreaElectricPowerCorporationReceivingCost'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*한전수전비*/
								, { key : 'pubcAmt', width:'100px', title : demandMsgArray['publicCharges'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*공과금*/
								, { key : 'etcAmt', width:'100px', title : demandMsgArray['etc'], render : {type:"string", rule : "comma"}
			            		   ,  editable : { type: 'text' , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"} , styleclass : 'num_editing-in-grid'}}/*기타*/
								, { key : 'trmsDemdMgmtNo', align:'center', width:'40px', title : demandMsgArray['transmissionDemandManagementNumber'], hidden:true }/*'전송수요관리번호'*/
	    	            		, { key : 'trmsDemdMtsoSrno', align:'center', width:'40px', title : demandMsgArray['landConstructSerialNumber'], hidden:true }/*'토지건축일련번호'*/
			];  
		
			 //그리드 생성
			 $('#'+gridLand).alopexGrid({	
				    autoColumnIndex : true,
		        	pager : false,
		        	columnMapping : mappingLand,
		        	//disableTextSelection : true,
		            cellSelectable : true,
		            rowClickSelect : false,
		            rowInlineEdit : false,
		            rowSingleSelect : false,
		            numberingColumnFromZero : false,
		            height : 150,
				    headerGroup:
			    			[
			    				{fromIndex:5, toIndex:11, title:demandMsgArray['landPurchaseAmount']},/*토지매입금*/
			    				{fromIndex:12, toIndex:13, title:demandMsgArray['buildingConstructConstructionCost']},/*건축공사비*/
			    				{fromIndex:14, toIndex:15, title:demandMsgArray['designServieCost']},/*설계용역비*/
			    				/*{fromIndex:22, toIndex:23, title:demandMsgArray['inspectionServieCost']},감리용역비
			    				{fromIndex:24, toIndex:25, title:demandMsgArray['acqtTaxAmount']},취득세
			    				{fromIndex:26, toIndex:27, title:demandMsgArray['measureCost']},측량비
			    				{fromIndex:28, toIndex:29, title:demandMsgArray['koreaElectricPowerCorporationReceivingCost']},한전수전비
			    				{fromIndex:30, toIndex:31, title:demandMsgArray['publicCharges']},공과금
			    				{fromIndex:32, toIndex:33, title:demandMsgArray['etc']}기타*/
			    			]
			 });	
			 
    };