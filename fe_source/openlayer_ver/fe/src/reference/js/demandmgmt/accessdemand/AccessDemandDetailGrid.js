/**
 * AccessDemandList
 *
 * @author P092781
 * @date 2016. 6. 22. 오전 17:30:03
 * @version 1.0
 */
	
	//그리드 ID
    var gridEqp = 'resultEqpListGrid';
    var gridMtl = 'resultMtlListGrid';
    var gridLn = 'resultLnListGrid';
    
    // 장비 그리드
    function initDetailGrid() {
    	var mappingEqp = [
	               		  { selectorColumn : true, width : '50px' }
	            		, { key : 'check', align:'center', width:'50px', title : demandMsgArray['number']/*'번호'*/, numberingColumn : true }
	            		, { key : 'intgFcltsNm', align:'left', width:'200px', title : '<em class="color_red">*</em>'+demandMsgArray['integrationFacilitiesName']/*통합시설명*/, 
	            			render : function(value, data) { 
		            				 var celStr = demandMsgArray['integrationFacilitiesName']/*"통합시설명"*/;
		           				     if (nullToEmpty(data.intgFcltsCd) != "") {    	            				    	 
		           				    	 celStr = value;
		           				     };                                                            
		           				     celStr = '<div style="width:100%"><span class="Valign-md">' + celStr +'</span><button class="grid_search_icon Valign-md" onclick="return false;"></button></div>';
		           				     return celStr;	            				    
	            		    }
	            		    //,styleclass : function(value, data, mapping) { if (procStFlag == 'E') {return 'link_cell-in-grid'}}
	            		  }	
	            		, { key : 'intgFcltsCd', align:'center', width:'50px', title : demandMsgArray['integrationFacilitiesCode']/*'통합시설코드'*/
            			    , render : function(value, data) { return value;}
            			    , hidden:true}	
	            		, { key : 'intgFcltsBonbu', align:'center', width:'50px', title : demandMsgArray['integrationHdofc']/*'통합시설본부'*/, render : function(value, data) { return value;}, hidden:true}
	            		, {    key : 'sclDivCd', align:'center', width:'110px', title : '<em class="color_red">*</em>'+demandMsgArray['smallClassification']/*소분류*/ 
	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(sclCombo);}}
	            			,  editable : { type: 'select', rule: function(value, data) { return sclCombo; } } 
	        				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
	        			  }
	            		, { key : 'eqpTypCd', align:'center', width:'140px', title : '<em class="color_red">*</em>'+demandMsgArray['equipmentType']/*장비Type*/ ,
	            			render : { type: 'string'
	            					 , rule: function(value, data){ 
            						 			var render_data = [];
				    							var currentData = AlopexGrid.currentData(data);
				    							if (eqpCombo[currentData.sclDivCd]) {
				    								return render_data = render_data.concat(eqpCombo[currentData.sclDivCd]);
				    							} else {
				    							return render_data.concat({value : data.eqpTypCd, text : data.eqpTypNm});
				    						    } 
	            		         		}
	            					},
	            			editable: function (value, data, render, mapping, grid) {
        						var currentData = AlopexGrid.currentData(data);    	            				
	        					if (currentData.sclDivCd != null && currentData.sclDivCd != '' ) {    	        						
	        						var $select = $('<select class="alopexgrid-default-renderer">');
	        						$select.append('<option value="">'+demandMsgArray['mandatory']+'</option>');/*필수*/
	        						if (eqpCombo[currentData.sclDivCd] && eqpCombo[currentData.sclDivCd].length>0) {
	        							var selectYn = "";
	        							for (var i=0,l=eqpCombo[currentData.sclDivCd].length;i<l;i++) {
	        								if (eqpCombo[currentData.sclDivCd][i].value == currentData.eqpTypCd) {
	        									selectYn = "selected";
	        								} else {
	        									selectYn = "";
	        								};
	        								$select.append('<option value="'+eqpCombo[currentData.sclDivCd][i].value+'" ' + selectYn +'>'+eqpCombo[currentData.sclDivCd][i].text+'</option>');
	        							}
	        						}
	        						return $select;
	        				    } else {
	        				    	var $select = $('<select class="alopexgrid-default-renderer">');
	        						$select.append('<option value="">'+demandMsgArray['mandatory']+'</option>');/*필수*/
	        						return $select;
	        				    }
	        				},
	        				editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }, 
	        				refreshBy: 'sclDivCd'
	            		  }
	            		, { key : 'shpTypCd', align:'center', width:'110px', title : demandMsgArray['shapeType'] ,/*형상Type*/
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
	        						//$select.append('<option value="">선택</option>');
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
	            		, { key : 'demdEqpMdlCd', align:'center', width:'140px', title : /*'<em class="color_red">*</em>' + */demandMsgArray['equipmentModel']/*장비모델*/
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
			        						//$select.append('<option value="">'+demandMsgArray['mandatory']+'</option>');/*필수*/
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
	        				refreshBy: 'eqpTypCd'
	            		  }
	            		, { key : 'detlCstrDivCd', align:'center', width:'140px', title : '<em class="color_red">*</em>' + demandMsgArray['cstrTyp']/*공사유형*/ 
	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(cstrDiv);}}
            				,  editable : { type: 'select', rule: function(value, data) { return cstrDiv; } } 
            				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
	            		, { key : 'eqpCnt', align:'right', width:'70px', title : '<em class="color_red">*</em>'+demandMsgArray['equipmentSetCount']/*장비식수*/ 
	            			,  render : {type:"string", rule : "comma"}
	            		    ,  validate : {  allowInvalid : false
	            		    	           , rule : {number:true}}    	            		                   
        					,  editable : { type: "text" 
        						           ,styleclass : 'num_editing-in-grid'
        					 	   		   ,attr : { "data-keyfilter-rule" : "digits", "maxlength" : "5"}}}
	            		, { key : 'mtrlUprc', align:'right', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['materialUnitPrice'] /*물자단가*/   
	            			,  render: {type:"string", rule : "comma"}
    						,  editable : {  type: 'text'
    							           , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
					           			   , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'cstrUprc', align:'right', width:'100px', title : demandMsgArray['constructionUnitPrice']/*'공사단가'*/ ,  render: {type:"string", rule : "comma"}, hidden : true}
	            		, { key : 'cstrCost', align:'right', width:'120px', title : '<em class="color_red">*</em>' + demandMsgArray['constructionCost']/*공사비' */ 
   	            			,  render: {type:"string", rule : "comma"}
       						,  editable : {  type: 'text'
       							           , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
		           			               , styleclass : 'num_editing-in-grid'}}
	        			, {   key : 'mtrlCost', align:'right', width:'120px', title : demandMsgArray['materialPrice'] ,  render: {type:"string", rule : "comma"}/*물자비*/
	            		,  editable : {  type: 'text'
	            			, attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
	            		, styleclass : 'num_editing-in-grid'}}
	            		, { key : 'investAmt', align:'right', width:'140px', title : demandMsgArray['totalInvestCost']/*'총투자비'*/, render: {type:"string", rule : "comma"}}
	            		, { key : 'erpUsgCd', hidden:true, align:'center', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['usage']/*용도' */   
	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(erpUsg);}}
            				,  editable : { type: 'select', rule: function(value, data) { return erpUsg; } } 
            				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
	            		, { key : 'systmNo', align:'center', width:'100px', title : demandMsgArray['systemNumber']/*'시스템번호'*/
	            		    ,  render : function(value, data){ 
	            		    			return value;
	            		    	}
    						,  editable : {  type: 'text'
    							           , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "5"}
		           			               , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'openYm', hidden:true, align:'center', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['openMonth']/*개통월'*/  
			            		,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
		            		    /*,  editable : function (value, data) {  
		            		    				var $x = $('<div class="Dateinput" data-pickertype="monthly" data-format="yyyyMM"><input type="text" value="' + value + '"  ></div>');
		            		    				$a.convert($x);
		            		    				return $x;
		            		    }*/
			            		,  editable : {  type: 'text'}
	            		  }
	            		, { key : 'cstrMeansCd', hidden:true, align:'center', width:'120px', title : '<em class="color_red">*</em>' + demandMsgArray['means']/*방식' */    
	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(cstrMc);}}
            				,  editable : { type: 'select', rule: function(value, data) { return cstrMc; } } 
            				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
	            		, { key : 'fstInvtTypCd', hidden:true, align:'center', width:'140px', title : '<em class="color_red">*</em>'+demandMsgArray['purposeInvestType']+'1'  /*목적별투자유형1*/
	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(fstInvtTypCd);}}
            				,  editable : { type: 'select', rule: function(value, data) { return fstInvtTypCd; } } 
            				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
	            		, { key : 'scndInvtTypCd', hidden:true, align:'center', width:'150px', title : '<em class="color_red">*</em>'+demandMsgArray['purposeInvestType']+'2'/*목적별투자유형2' */ 
	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(scndInvtTypCd);}}
        				    ,  editable : { type: 'select', rule: function(value, data) { return scndInvtTypCd; } } 
        				    ,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
	            		, { key : 'thrdInvtTypCd', hidden:true, align:'center', width:'140px', title : '<em class="color_red">*</em>'+demandMsgArray['purposeInvestType']+'3'/*목적별투자유형3' */
	            			,  render : {type: 'string', rule: function(value, data){ return [].concat(thrdInvtTypCd);}}
        					,  editable : { type: 'select', rule: function(value, data) { return thrdInvtTypCd; } } 
        					,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }}
	            		, { key : 'trmsDemdMgmtNo', align:'center', width:'40px', title : demandMsgArray['transmissionDemandManagementNumber']/*'전송수요관리번호'*/, hidden:true }
	            		, { key : 'trmsDemdEqpSrno', align:'center', width:'40px', title : demandMsgArray['equipmentSerialNumber']/*'장비일련번호'*/, hidden:true }
		];
    	
    	
        //그리드 생성
        $('#'+ gridEqp).alopexGrid({
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
        
    
     // 자재그리드
        var mappingMtl = [
	               		 /* { selectorColumn : true, width : '25px' }
	            		, { key : 'check', align:'center', width:'40px', title : '번호', numberingColumn : true }
	            		, */{ key : 'mtrlKndNm', align:'left', width:'100px', title : demandMsgArray['materialsKind']/*'자재종류'*/, render : function(value, data) { return value;}, hidden:true}
	            		, { key : 'mtrlKndCd', align:'center', width:'50px', title : demandMsgArray['materialKindCode']/*'자재종류코드'*/, render : function(value, data) { return value;}, hidden:true}
	            		, { key : 'namsMatlCd', align:'center', width:'100px', title : demandMsgArray['materialsCode']/*'자재코드'*/, render : function(value, data) { return value;}} 
	            		, { key : 'eqpMatlNm', align:'left', width:'300px', title : demandMsgArray['materialsName']/*'자재명'*/, render : function(value, data) { return value;}}  
	            		, { key : 'vendVndrCd', align:'center', width:'40px', title : demandMsgArray['vendorVendorCode']/*'제조사업체코드'*/, render : function(value, data) { return value;}, hidden:true} 
	            		, { key : 'inveTotCnt', align:'right', width:'100px', title : demandMsgArray['totalInventoryQuantity']/*'총재고수량'*/, render : function(value, data) {return value;}}
	            		, { key : 'demdTotCnt', align:'right', width:'130px', title : demandMsgArray['planDemandInventoryUseQuantity']/*'계획수요재고자재사용수량'*/, render : {type:"string", rule : "comma"}}
	            		, {   key : 'demdCnt', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['needQuantity']/*필요수량*/ , render : {type:"string", rule : "comma"}
	            		    , editable : {  type: 'text'
	            		    	          , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
 			                              , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'inveUseQuty', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['inventoryUseQuantity']/*재고사용*/, render :  {type:"string", rule : "comma"}
	            		   ,  editable : {  type: 'text'
	            			              , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
			                              , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'orgInveUseQuty', align:'right', width:'120px', title : demandMsgArray['orgInventoryUseQuantity']/*'ORG재고사용'*/, render : {type:"string", rule : "comma"}, hidden:true}
	            		, { key : 'newQuty', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['newQuantity']/*신규수량*/, render : {type:"string", rule : "comma"}
	            		   ,  editable : {  type: 'text'
	            			              , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "3"}
	           			                  , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'mtrlUprc', align:'right', width:'120px', title : '<em class="color_red">*</em>'+demandMsgArray['materialUnitPrice']/*물자단가*/, render : {type:"string", rule : "comma"}
	            		   ,  editable : {  type: 'text'
	            			              , attr : { "data-keyfilter-rule" : "digits", "maxlength" : "12"}
	           			                  , styleclass : 'num_editing-in-grid'}}
	            		, { key : 'mtrlAmt', align:'right', width:'120px', title : demandMsgArray['materialPrice']/*'물자비'*/, render : {type:"string", rule : "comma"}}
	            		, { key : 'trmsDemdMgmtNo', align:'center', width:'40px', title : demandMsgArray['transmissionDemandManagementNumber']/*'전송망수요관리번호'*/, render : function(value, data) { return value;}, hidden:true}
	            		, { key : 'trmsDemdEqpSrno', align:'center', width:'40px', title : demandMsgArray['equipmentSerialNumber']/*'전송망장비일련번호'*/, render : function(value, data) { return value;}, hidden:true}
	            		, { key : 'mtrlSerlNo', align:'center', width:'40px', title : demandMsgArray['materialSerialNumber']/*'물자일련번호'*/, render : function(value, data) { return value;}, hidden:true}
	            		, { key : 'eqpTypNm', align:'center', width:'40px', title : demandMsgArray['equipmentType']/*'장비Type명'*/, render : function(value, data) { return value;}, hidden:true}
	            		, { key : 'demdEqpMdlNm', align:'center', width:'40px', title : demandMsgArray['equipmentModel']/*'장비모델명'*/, render : function(value, data) { return value;}, hidden:true}
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
		    height : 200
        });
        
        var mappingLn = [
	   		  { selectorColumn : true, width : '40px' }
			, { key : 'check', align:'center', width:'40px', title : demandMsgArray['number']/*'번호'*/, numberingColumn : true }
			, { key : 'intgFcltsNm', align:'left', width:'200px', title : '<em class="color_red">*</em>'+demandMsgArray['integrationFacilitiesName'], /*통합시설명'*/refreshBy: 'lnTypCd'}
			, { key : 'tmofNm', align:'center', width:'150px', title : '전송실', render : function(value, data) { return value;}, hidden:true}/*'전송실'*/
			, { key : 'intgFcltsCd', align:'center', width:'50px', title : demandMsgArray['integrationFacilitiesCode'], refreshBy: 'lnTypCd', hidden:true}/*'통합시코드'*/
    		, { key : 'intgFcltsBonbu', align:'center', width:'50px', title : demandMsgArray['integrationHdofc'], refreshBy: 'lnTypCd', hidden:true}/*'통합시설본부'*/
			, { key : 'demdLnSctnInfCtt', align:'center', width:'150px'
				, title : '<em class="color_red">*</em>'+demandMsgArray['section']/*구간*/
			    ,  render : function(value, data){ return value;}
			    ,  editable : {   type: 'text'
		              			, attr : {"maxlength" : "100"}}
			}			
			, { key : 'lnTypCd', align:'center', width:'110px', title : '<em class="color_red">*</em>'+demandMsgArray['lineTypeEng'] /*선로Type*/
				,  render : {type: 'string', rule: function(value, data){ return [].concat(lnCombo);}}
				,  allowEdit: function(value, data, mapping){
					if(data.erpAprvResult == "Y" && (data.trmsDemdLnSrno == defaulttrmsDemdLnSrno[0] || data.trmsDemdLnSrno == defaulttrmsDemdLnSrno[1]))
						return false;
					
					if(ProcStatCd == "105003" && (data.trmsDemdLnSrno < defaulttrmsDemdLnSrno[0] || data.trmsDemdLnSrno < defaulttrmsDemdLnSrno[1]))
						return false;
					
					return true;	
			    }
				,  editable : { type: 'select', rule: function(value, data) { return lnCombo; } } 
				,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); }
			  }
			, { key : 'shpTypCd', align:'center', width:'150px', title : '<em class="color_red">*</em>'+demandMsgArray['shapeType'] ,/*형상Type*/
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
						var $select = $('<select class="alopexgrid-default-renderer">');
						$select.append('<option value="">'+demandMsgArray['mandatory']+'</option>');/*필수*/
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
						    $select.append('<option value="">'+demandMsgArray['mandatory']+'</option>');/*필수*/
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
				refreshBy: 'lnTypCd'
			  }
			, { key : 'detlCstrDivCd', align:'center', width:'110px', title : '<em class="color_red">*</em>'+demandMsgArray['cstrTyp'] /*공사유형*/
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
			, {   key : 'sctnLen', hidden:true, align:'right', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['sectionLength']/*구간길이*/ ,  render: {type:"string", rule : "comma"}
			   ,  editable : {  type: 'text'
				              , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "6"}
			                  , styleclass : 'num_editing-in-grid'}}
			, { key : 'cstrUprc', align:'right', width:'40px', title : demandMsgArray['constructionUnitPrice']/*'공사단가'*/ ,  render : function(value, data){ return value;}, hidden : true }
			, {   key : 'cstrCost', align:'right', width:'100px', title : '<em class="color_red">*</em>'+demandMsgArray['constructionCost']/*공사비*/ ,  render: {type:"string", rule : "comma"}
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
    		, { key : 'etpplYn', align:'center', width:'100px', title : demandMsgArray['endTelephonePoleYn'] /*종말주여부*/
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
			, { key : 'trmsDemdMgmtNo', align:'center', width:'40px', title : demandMsgArray['transmissionDemandManagementNumber']/*'전송망수요관리번호'*/, render : function(value, data) { return value;}, hidden:true}
			, { key : 'trmsDemdLnSrno', align:'center', width:'40px', title : demandMsgArray['transmissionDemandLineSerialNumber']/*'전송수요일련번호'*/, hidden:true }
			, { key : 'erpAprvResult', align:'center', width:'40px', title : demandMsgArray['transmissionDemandLineSerialNumber'], hidden:true }/*'승인결과'*/
		]; 
    	
        //그리드 생성
        $('#'+gridLn).alopexGrid({
            cellSelectable : true,
            autoColumnIndex : true,
            columnMapping : mappingLn,
            fitTableWidth : true,
            rowClickSelect : false,
		    rowInlineEdit : false,
            rowSingleSelect : false,
            numberingColumnFromZero : false,
	         pager : false,
            height : 195
        });
        
    };
