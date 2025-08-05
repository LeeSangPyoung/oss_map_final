/**
 * OpenTaskWritePopGridList.js
 *
 * @author Administrator
 * @date 2017. 09. 01
 * @version 1.0
 */

//교환기간 일반
function mappingGrid001001(){
	var returnData = [
		               		  {key : 'jobKind', align:'center', width:'100px', title : cflineMsgArray['workType'] /*  작업유형 */
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (jobTypeData.length >1) {	
				            				    	return render_data = render_data.concat( jobTypeData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return jobTypeData; } 
						         		, attr : {
		  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
		               		 , {key : 'ogic', align:'center', width:'100px', title : 'OG/IC'
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (OgIcData.length >1) {	
				            				    	return render_data = render_data.concat( OgIcData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return OgIcData; } 
						         		, attr : {
		  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
		               		, {key : 'ogTie'	, title : "OG TIE" /*TIE*/ , align:'left', width: '200px'
		   						, render : function(value, data) {
		   							var celStr = "TIE";
		   							if(nullToEmpty(value) == ""){
		   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
		   							}else{  
		   								celStr = value;
		   							}
	       				     return celStr;
		   						}			          
		   			            ,editable:  { type: 'text' }
		   			            ,allowEdit : function(value, data, mapping) { return true; }
		   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
		   			          }
		               		, {key : 'icTie'	, title : "IC TIE" /*TIE*/ , align:'left', width: '200px'
		   						, render : function(value, data) {
		   							var celStr = "TIE";
		   							if(nullToEmpty(value) == ""){
		   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
		   							}else{  
		   								celStr = value;
		   							}
	       				     return celStr;
		   						}			          
		   			            ,editable:  { type: 'text' }
		   			            ,allowEdit : function(value, data, mapping) { return true; }
		   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
		   			          } 
			            	  , {key : 'uprOrgId', align:'center', width:'150px', title : cflineMsgArray['upperTransOffice'] /*상위전송실*/

						  			, render : { type:'string',
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
						  				},
						  				editable : {type : 'select', 
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
							         		, attr : {
			  	      			 				style : "width: 130px;min-width:130px;padding: 3px 3px;"
			  	      			 			} 
						  				},
						      			editedValue : function (cell) {
						  					return $(cell).find('select option').filter(':selected').val();
						  				}	
				            		}
			            	  , {key : 'lowOrgId', align:'center', width:'150px', title : cflineMsgArray['lowerTransOffice'] /*하위전송실*/

					  			, render : { type:'string',
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
					  				},
					  				editable : {type : 'select', 
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
						         		, attr : {
		  	      			 				style : "width: 130px;min-width:130px;padding: 3px 3px;"
		  	      			 			} 
					  				},
					      			editedValue : function (cell) {
					  					return $(cell).find('select option').filter(':selected').val();
					  				}		
			            		}
			            	  , {key : 'state'	              	,title : cflineMsgArray['status'] /* 상태 */                 ,align:'left'  , width: '80px'}      			            	  
			            	  /* OG TIE 정보 시작 	*/
			               	  , {key : 'ogTieOne'			, hidden:true}
							  , {key : 'ogTieTwo'	        , hidden: true}
			            	  , {key : 'ogSysType'	        , hidden: true}
		            		  , {key : 'ogSysName'	        , hidden: true}
							  , {key : 'ogSysId'	        , hidden: true}
							  , {key : 'ogMscId'	        , hidden: true}
							  , {key : 'ogTransroomId'	, hidden: true} 
							  , {key : 'ogCoreroomId'	    , hidden: true}
							  , {key : 'ogSystemId'	        , hidden: true}
							  , {key : 'ogMp'	        , hidden: true}
							  , {key : 'ogPp'	    , hidden: true}
							  , {key : 'ogCard'	        , hidden: true}
							  , {key : 'ogLink'	        , hidden: true}
							  , {key : 'ogRtename'	        , hidden: true}
							  , {key : 'ogRte'	        , hidden: true}
			            	  /* OG TIE 정보 끝 	*/		            	  
			            	  /* IC TIE 정보 시작 	*/
			               	  , {key : 'icTieOne'			, hidden:true}
							  , {key : 'icTieTwo'	        , hidden: true}
			            	  , {key : 'icSysType'	        , hidden: true}
		            		  , {key : 'icSysName'	        , hidden: true}
							  , {key : 'icSysId'	        , hidden: true}
							  , {key : 'icMscId'	        , hidden: true}
							  , {key : 'icTransroomId'	, hidden: true} 
							  , {key : 'icCoreroomId'	    , hidden: true}
							  , {key : 'icSystemId'	        , hidden: true}
							  , {key : 'icMp'	        , hidden: true}
							  , {key : 'icPp'	    , hidden: true}
							  , {key : 'icCard'	        , hidden: true}
							  , {key : 'icLink'	        , hidden: true}
							  , {key : 'icRtename'	        , hidden: true}
							  , {key : 'icRte'	        , hidden: true}
			            	  /* IC TIE 정보 끝 	*/
    ];
	return returnData;
}

//교환기간 수변
function mappingGrid001005(){
	var returnData = [
		               		  {key : 'jobKind', align:'center', width:'90px', title : cflineMsgArray['workType'] /*  작업유형 */
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (jobTypeData.length >1) {	
				            				    	return render_data = render_data.concat( jobTypeData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return jobTypeData; } 
							         		, attr : {
			  	      			 				style : "width: 70px;min-width:70px;padding: 3px 3px; background:#e2e2e2;"  
									         	, disabled : true
			  	      			 			} 
						         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
		              		, {key : 'adTie'	, title : cflineMsgArray['decreaseLine'] /*감설*/+ "TIE" /*TIE*/ , align:'left', width: '170px'
		   						, render : function(value, data) {
		   							var celStr = "TIE";
		   							if(nullToEmpty(value) == ""){
		   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
		   							}else{  
		   								celStr = value;
		   							}
	       				     return celStr;
		   						}			          
		   			            ,editable:  { type: 'text' }
		   			            ,allowEdit : function(value, data, mapping) { return true; }
		   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
		   			          }
		                    , {key : 'adLineNm'	              	,title : cflineMsgArray['decreaseLine'] /*감설*/ + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '130px'}
		               		 , {key : 'ogic', align:'center', width:'90px', title : cflineMsgArray['icre'] /*증설*/ + 'OG/IC'
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (OgIcData.length >1) {	
				            				    	return render_data = render_data.concat( OgIcData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return OgIcData; } 
						         		, attr : {
		  	      			 				style : "width: 70px;min-width:70px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
			               		, {key : 'ogTie'	, title : cflineMsgArray['icre'] /*증설*/ + "OG TIE" /*TIE*/ , align:'left', width: '170px'
			   						, render : function(value, data) {
			   							var celStr = "TIE";
			   							if(nullToEmpty(value) == ""){
			   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
			   							}else{  
			   								celStr = value;
			   							}
		       				     return celStr;
			   						}			          
			   			            ,editable:  { type: 'text' }
			   			            ,allowEdit : function(value, data, mapping) { return true; }
			   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
			   			          }
			               		, {key : 'icTie'	, title : cflineMsgArray['icre'] /*증설*/ + "IC TIE" /*TIE*/ , align:'left', width: '170px'
			   						, render : function(value, data) {
			   							var celStr = "TIE";
			   							if(nullToEmpty(value) == ""){
			   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
			   							}else{  
			   								celStr = value;
			   							}
		       				     return celStr;
			   						}			          
			   			            ,editable:  { type: 'text' }
			   			            ,allowEdit : function(value, data, mapping) { return true; }
			   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
			   			          }
			            	  , {key : 'uprOrgId', align:'center', width:'130px', title : cflineMsgArray['icre'] /*증설*/ + cflineMsgArray['upperTransOffice'] /*상위전송실*/

						  			, render : { type:'string',
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
						  				},
						  				editable : {type : 'select', 
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
							         		, attr : {
			  	      			 				style : "width: 110px;min-width:110px;padding: 3px 3px;"
			  	      			 			} 
						  				},
						      			editedValue : function (cell) {
						  					return $(cell).find('select option').filter(':selected').val();
						  				}	
				            		}
			            	  , {key : 'lowOrgId', align:'center', width:'130px', title : cflineMsgArray['icre'] /*증설*/ + cflineMsgArray['lowerTransOffice'] /*하위전송실*/
					  			, render : { type:'string',
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
					  				},
					  				editable : {type : 'select', 
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
						         		, attr : {
		  	      			 				style : "width: 110px;min-width:110px;padding: 3px 3px;"
		  	      			 			} 
					  				},
					      			editedValue : function (cell) {
					  					return $(cell).find('select option').filter(':selected').val();
					  				}		
			            		}                   
			            	  , {key : 'state'	              	,title : cflineMsgArray['status'] /* 상태 */                 ,align:'left'  , width: '80px'}		            	  
			            	  
			            	  /* 교환기, 상호접속  감설 TIE 정보 시작 	*/
			               	  , {key : 'adLineNo'		, hidden:true}
			               	  , {key : 'adTieOne'		, hidden:true}
			               	  , {key : 'adOgTieOne'		, hidden:true}
			               	  , {key : 'adOgTieTwo'		, hidden:true}
			               	  , {key : 'adOgMscId'		, hidden:true}
			               	  , {key : 'adOgMscName'		, hidden:true}
			               	  , {key : 'adOgMp'		, hidden:true}
			               	  , {key : 'adOgPp'			, hidden:true}
			               	  , {key : 'adOgCard'			, hidden:true}
			               	  , {key : 'adOgLink'		, hidden:true}	

			               	  , {key : 'adIcTieOne'		, hidden:true}
			               	  , {key : 'adIcTieTwo'		, hidden:true}
			               	  , {key : 'adIcMscId'		, hidden:true}
			               	  , {key : 'adIcMscName'		, hidden:true}
			               	  , {key : 'adIcMp'		, hidden:true}
			               	  , {key : 'adIcPp'			, hidden:true}
			               	  , {key : 'adIcCard'			, hidden:true}
			               	  , {key : 'adIcLink'		, hidden:true}	
			            	  /* 교환기, 상호접속 감설 TIE 정보 끝  	*/	  	              			            	  
			            	  /* OG TIE 정보 시작 	*/
			               	  , {key : 'ogTieOne'			, hidden:true}
							  , {key : 'ogTieTwo'	        , hidden: true}
			            	  , {key : 'ogSysType'	        , hidden: true}
		            		  , {key : 'ogSysName'	        , hidden: true}
							  , {key : 'ogSysId'	        , hidden: true}
							  , {key : 'ogMscId'	        , hidden: true}
							  , {key : 'ogTransroomId'	, hidden: true} 
							  , {key : 'ogCoreroomId'	    , hidden: true}
							  , {key : 'ogSystemId'	        , hidden: true}
							  , {key : 'ogMp'	        , hidden: true}
							  , {key : 'ogPp'	    , hidden: true}
							  , {key : 'ogCard'	        , hidden: true}
							  , {key : 'ogLink'	        , hidden: true}
							  , {key : 'ogRtename'	        , hidden: true}
							  , {key : 'ogRte'	        , hidden: true}
			            	  /* OG TIE 정보 끝 	*/		            	  
			            	  /* IC TIE 정보 시작 	*/
			               	  , {key : 'icTieOne'			, hidden:true}
							  , {key : 'icTieTwo'	        , hidden: true}
			            	  , {key : 'icSysType'	        , hidden: true}
		            		  , {key : 'icSysName'	        , hidden: true}
							  , {key : 'icSysId'	        , hidden: true}
							  , {key : 'icMscId'	        , hidden: true}
							  , {key : 'icTransroomId'	, hidden: true} 
							  , {key : 'icCoreroomId'	    , hidden: true}
							  , {key : 'icSystemId'	        , hidden: true}
							  , {key : 'icMp'	        , hidden: true}
							  , {key : 'icPp'	    , hidden: true}
							  , {key : 'icCard'	        , hidden: true}
							  , {key : 'icLink'	        , hidden: true}
							  , {key : 'icRtename'	        , hidden: true}
							  , {key : 'icRte'	        , hidden: true}
			            	  /* IC TIE 정보 끝 	*/
    ];
	return returnData;
}

//기지국간 일반 
function mappingGrid002001(){
	var returnData = [
		               		  {key : 'jobKind', align:'center', width:'100px', title : cflineMsgArray['workType'] /*  작업유형 */
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (jobTypeData.length >1) {	
				            				    	return render_data = render_data.concat( jobTypeData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return jobTypeData; } 
						         		, attr : {
		  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
		               		 , {key : 'ogic', align:'center', width:'100px', title : 'OG/IC'
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (OgIcData.length >1) {	
				            				    	return render_data = render_data.concat( OgIcData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return OgIcData; } 
						         		, attr : {
		  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
			               		, {key : 'tie'	, title : "TIE" /*TIE*/ , align:'left', width: '200px'
			   						, render : function(value, data) {
			   							var celStr = "TIE";
			   							if(nullToEmpty(value) == ""){
			   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
			   							}else{  
			   								celStr = value;
			   							}
		       				     return celStr;
			   						}			          
			   			            ,editable:  { type: 'text' }
			   			            ,allowEdit : function(value, data, mapping) { return true; }
			   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
			   			          }
			            	  , {key : 'uprOrgId', align:'center', width:'150px', title : cflineMsgArray['upperTransOffice'] /*상위전송실*/

						  			, render : { type:'string',
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
						  				},
						  				editable : {type : 'select', 
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
							         		, attr : {
			  	      			 				style : "width: 130px;min-width:130px;padding: 3px 3px;"
			  	      			 			} 
						  				},
						      			editedValue : function (cell) {
						  					return $(cell).find('select option').filter(':selected').val();
						  				}	
				            		}
			            	  , {key : 'lowOrgId', align:'center', width:'150px', title : cflineMsgArray['lowerTransOffice'] /*하위전송실*/
					  			, render : { type:'string',
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
					  				},
					  				editable : {type : 'select', 
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
						         		, attr : {
		  	      			 				style : "width: 130px;min-width:130px;padding: 3px 3px;"
		  	      			 			} 
					  				},
					      			editedValue : function (cell) {
					  					return $(cell).find('select option').filter(':selected').val();
					  				}		
			            		}                   
			            	  , {key : 'mtsoNm'	              	,title : cflineMsgArray['btsName'] /* 기지국사 */                 ,align:'left'  , width: '150px', editable: true}
			            	  , {key : 'mtsoId'	              	,hidden: true} /* 국사ID	*/
			            	  , {key : 'state'	              	,title : cflineMsgArray['status'] /* 상태 */                 ,align:'left'  , width: '80px'}			            	  
			            	  /* TIE 정보 시작 	*/
			               	  , {key : 'tieOne'			, hidden:true}
							  , {key : 'tieTwo'	        , hidden: true}
			            	  , {key : 'aep'	        , hidden: true}
		            		  , {key : 'bip'	        , hidden: true}
							  , {key : 'bipP'	        , hidden: true}
							  , {key : 'bscId'	        , hidden: true}
							  , {key : 'bts'	        , hidden: true}
							  , {key : 'btsId'	        , hidden: true}
							  , {key : 'btsName'	    , hidden: true}
							  , {key : 'cinu'	        , hidden: true}
							  , {key : 'coreroomId'	    , hidden: true}
							  , {key : 'cuid'	        , hidden: true}
							  , {key : 'idx'	        , hidden: true}
							  , {key : 'mscId'	        , hidden: true}
							  , {key : 'mscName'	        , hidden: true}
							  , {key : 'portNo'	        , hidden: true}
							  , {key : 'sysId'	        , hidden: true}
							  , {key : 'sysName'	    , hidden: true}
							  , {key : 'sysType'	    , hidden: true}
							  , {key : 'systemId'	    , hidden: true}
							  , {key : 'transroomId'	, hidden: true} 
			            	  /* TIE 정보 끝 	*/
    ];
	return returnData;
}


//기지국간 수변 
function mappingGrid002005(){
	var returnData = [
		               		  {key : 'jobKind', align:'center', width:'90px', title : cflineMsgArray['workType'] /*  작업유형 */
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (jobTypeData.length >1) {	
				            				    	return render_data = render_data.concat( jobTypeData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return jobTypeData; } 
						         		, attr : {
			  	      			 				style : "width: 70px;min-width:70px;padding: 3px 3px; background:#e2e2e2;"  
									         	, disabled : true
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
		               		, {key : 'adTie'	, title : cflineMsgArray['decreaseLine'] /*감설*/ + "TIE" /*TIE*/ , align:'left', width: '170px'
		   						, render : function(value, data) {
		   							var celStr = "TIE";
		   							if(nullToEmpty(value) == ""){
		   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
		   							}else{  
		   								celStr = value;
		   							}
	       				     return celStr;
		   						}			          
		   			            ,editable:  { type: 'text' }
		   			            ,allowEdit : function(value, data, mapping) { return true; }
		   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
		   			          }
		                    , {key : 'adLineNm'	              	,title : cflineMsgArray['decreaseLine'] /*감설*/ + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '130px'}
		               		, {key : 'ogic', align:'center', width:'90px', title : cflineMsgArray['icre'] /*증설*/ + 'OG/IC'
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (OgIcData.length >1) {	
				            				    	return render_data = render_data.concat( OgIcData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return OgIcData; } 
						         		, attr : {
		  	      			 				style : "width: 70px;min-width:70px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
			               		, {key : 'tie'	, title : cflineMsgArray['icre'] /*증설*/ + "TIE" /*TIE*/ , align:'left', width: '170px'
			   						, render : function(value, data) {
			   							var celStr = "TIE";
			   							if(nullToEmpty(value) == ""){
			   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
			   							}else{  
			   								celStr = value;
			   							}
		       				     return celStr;
			   						}			          
			   			            ,editable:  { type: 'text' }
			   			            ,allowEdit : function(value, data, mapping) { return true; }
			   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
			   			          }  
			            	  , {key : 'uprOrgId', align:'center', width:'130px', title : cflineMsgArray['icre'] /*증설*/ + cflineMsgArray['upperTransOffice'] /*상위전송실*/

						  			, render : { type:'string',
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
						  				},
						  				editable : {type : 'select', 
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
							         		, attr : {
			  	      			 				style : "width: 110px;min-width:110px;padding: 3px 3px;"
			  	      			 			} 
						  				},
						      			editedValue : function (cell) {
						  					return $(cell).find('select option').filter(':selected').val();
						  				}	
				            		}
			            	  , {key : 'lowOrgId', align:'center', width:'130px', title : cflineMsgArray['icre'] /*증설*/ + cflineMsgArray['lowerTransOffice'] /*하위전송실*/

					  			, render : { type:'string',
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
					  				},
					  				editable : {type : 'select', 
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
						         		, attr : {
		  	      			 				style : "width: 110px;min-width:110px;padding: 3px 3px;"
		  	      			 			} 
					  				},
					      			editedValue : function (cell) {
					  					return $(cell).find('select option').filter(':selected').val();
					  				}		
			            		}                   
			            	  , {key : 'mtsoNm',	title : cflineMsgArray['icre'] /*증설*/ + cflineMsgArray['btsName'] /* 기지국사 */,		align:'left'  , width: '130px', editable: true}
			            	  , {key : 'mtsoId'	              	,hidden: true} /* 국사ID	*/
			            	  , {key : 'state'	              	,title : cflineMsgArray['status'] /* 상태 */                 ,align:'left'  , width: '80px'}			            	  
			            	  /* 감설 TIE 정보 시작 	*/
			               	  , {key : 'adLineNo'		, hidden:true}
			               	  , {key : 'adTieOne'		, hidden:true}
			               	  , {key : 'adTieTwo'		, hidden:true}
			               	  , {key : 'adMscId'		, hidden:true}
			               	  , {key : 'adMscName'		, hidden:true}
			               	  , {key : 'adBscId'		, hidden:true}
			               	  , {key : 'adCinu'			, hidden:true}
			               	  , {key : 'adAep'			, hidden:true}
			               	  , {key : 'adPortNo'		, hidden:true}
			               	  , {key : 'adBip'			, hidden:true}
			               	  , {key : 'adBipP'			, hidden:true}
			               	  , {key : 'adBts'			, hidden:true}
			               	  , {key : 'adBtsId'		, hidden:true}
			               	  , {key : 'adUprMtsoId'	, hidden:true}
			               	  , {key : 'adLowMtsoId'	, hidden:true}
			               	  , {key : 'adLowMtsoIdNm'	, hidden:true}					            	  
			            	  /* 감설 TIE 정보 끝  	*/		            	  
			            	  /* 증설 TIE 정보 시작 	*/
			               	  , {key : 'tieOne'			, hidden:true}
							  , {key : 'tieTwo'	        , hidden: true}
			            	  , {key : 'aep'	        , hidden: true}
		            		  , {key : 'bip'	        , hidden: true}
							  , {key : 'bipP'	        , hidden: true}
							  , {key : 'bscId'	        , hidden: true}
							  , {key : 'bts'	        , hidden: true}
							  , {key : 'btsId'	        , hidden: true}
							  , {key : 'btsName'	    , hidden: true}
							  , {key : 'cinu'	        , hidden: true}
							  , {key : 'coreroomId'	    , hidden: true}
							  , {key : 'cuid'	        , hidden: true}
							  , {key : 'idx'	        , hidden: true}
							  , {key : 'mscId'	        , hidden: true}
							  , {key : 'mscName'	        , hidden: true}
							  , {key : 'portNo'	        , hidden: true}
							  , {key : 'sysId'	        , hidden: true}
							  , {key : 'sysName'	    , hidden: true}
							  , {key : 'sysType'	    , hidden: true}
							  , {key : 'systemId'	    , hidden: true}
							  , {key : 'transroomId'	, hidden: true} 
			            	  /* 증설 TIE 정보 끝 	*/
    ];
	return returnData;
}

//상호접속 일반 
function mappingGrid003001(){
	var returnData = [
		               		  {key : 'jobKind', align:'center', width:'100px', title : cflineMsgArray['workType'] /*  작업유형 */
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (jobTypeData.length >1) {	
				            				    	return render_data = render_data.concat( jobTypeData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return jobTypeData; } 
						         		, attr : {
		  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
		               		 , {key : 'ogic', align:'center', width:'100px', title : 'OG/IC'
		            		    	, render : {  type: 'string'
		  				                 , rule: function (value,data){
		  				                	 var render_data = [];				            				    
				            				    if (OgIcData.length >1) {	
				            				    	return render_data = render_data.concat( OgIcData );	    								
				            				    }else{
				    								return render_data.concat({value : data.value, text : data.text});	
				    							}
					    			}}
					         		,  editable : { type: 'select', rule: function(value, data) { return OgIcData; } 
						         		, attr : {
		  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px;"
		  	      			 			} 
					         		}
					    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
					         	}
			               		, {key : 'tie'	, title : "TIE" /*TIE*/ , align:'left', width: '200px'
			   						, render : function(value, data) {
			   							var celStr = "TIE";
			   							if(nullToEmpty(value) == ""){
			   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
			   							}else{  
			   								celStr = value;
			   							}
			   							return celStr;
			   						}			          
			   			            ,editable:  { type: 'text' }
			   			            ,allowEdit : function(value, data, mapping) { return true; }
			   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
			   			          }
			            	  , {key : 'uprOrgId', align:'center', width:'150px', title : cflineMsgArray['upperTransOffice'] /*상위전송실*/

						  			, render : { type:'string',
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
						  				},
						  				editable : {type : 'select', 
						  					rule : function(value, data){
						  						var render_data = [];
						  						var currentData = AlopexGrid.currentData(data);
						  						return render_data = render_data.concat(TmofAllData);
						  					}
							         		, attr : {
			  	      			 				style : "width: 130px;min-width:130px;padding: 3px 3px;"
			  	      			 			} 
						  				},
						      			editedValue : function (cell) {
						  					return $(cell).find('select option').filter(':selected').val();
						  				}	
				            		}
			            	  , {key : 'lowOrgId', align:'center', width:'150px', title : cflineMsgArray['lowerTransOffice'] /*하위전송실*/
					  			, render : { type:'string',
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
					  				},
					  				editable : {type : 'select', 
					  					rule : function(value, data){
					  						var render_data = [];
					  						var currentData = AlopexGrid.currentData(data);
					  						return render_data = render_data.concat(TmofAllData);
					  					}
						         		, attr : {
		  	      			 				style : "width: 130px;min-width:130px;padding: 3px 3px;"
		  	      			 			} 
					  				},
					      			editedValue : function (cell) {
					  					return $(cell).find('select option').filter(':selected').val();
					  				}		
			            		}                   
			            	  , {key : 'systemNm'	              	,title : cflineMsgArray['systemName']  /* 시스템명 */                 ,align:'left'  , width: '150px', editable: true}
			            	  , {key : 'state'	              	,title : cflineMsgArray['status'] /* 상태 */                 ,align:'left'  , width: '80px'}  
 			            	  
			            	  /*  TIE 정보 시작 	*/
			               	  , {key : 'tieOne'			, hidden:true}
							  , {key : 'tieTwo'	        , hidden: true}
			            	  , {key : 'sysType'	        , hidden: true}
		            		  , {key : 'sysName'	        , hidden: true}
							  , {key : 'sysId'	        , hidden: true}
							  , {key : 'mscId'	        , hidden: true}
							  , {key : 'transroomId'	, hidden: true} 
							  , {key : 'coreroomId'	    , hidden: true}
							  , {key : 'systemId'	        , hidden: true}
							  , {key : 'mp'	        , hidden: true}
							  , {key : 'pp'	    , hidden: true}
							  , {key : 'card'	        , hidden: true}
							  , {key : 'link'	        , hidden: true}
							  , {key : 'rtename'	        , hidden: true}
							  , {key : 'rte'	        , hidden: true}
			            	  /* TIE 정보 끝 	*/	
    ];
	return returnData;
}

//	감설
function mappingGrid000003(){
	var returnData = [
               		  {key : 'jobKind', align:'center', width:'100px', title : cflineMsgArray['workType'] /*  작업유형 */
      		    	, render : {  type: 'string'
			                 , rule: function (value,data){
			                	 var render_data = [];				            				    
	            				    if (jobTypeData.length >1) {	
	            				    	return render_data = render_data.concat( jobTypeData );	    								
	            				    }else{
	    								return render_data.concat({value : data.value, text : data.text});	
	    							}
		    			}}
		         		,  editable : { type: 'select', rule: function(value, data) { return jobTypeData; } 
			         		, attr : {
  	      			 				style : "width: 80px;min-width:80px;padding: 3px 3px; background:#e2e2e2;"  
							         	, disabled : true
      			 			} 
		         		}
		    			,  editedValue : function (cell) {  return  $(cell).find('select option').filter(':selected').val(); } 
		         	}, {key : 'tie'	, title : "TIE" /*TIE*/ , align:'left', width: '200px'
   						, render : function(value, data) {
   							var celStr = "TIE";
   							if(nullToEmpty(value) == ""){
   								celStr = (nullToEmpty(data.mtsoNm) == "") ? "" : data.mtsoNm;
   							}else{  
   								celStr = value;
   							}
   				     return celStr;
   						}			          
   			            ,editable:  { type: 'text' }
   			            ,allowEdit : function(value, data, mapping) { return true; }
   			          	//,styleclass : function(value, data, mapping) { return 'link_cell-in-grid'}
   			          } 
		         	, {key : 'lineNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '100px'}
                    , {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '250px'}
                    , {key : 'state'	              	,title : cflineMsgArray['status'] /* 상태 */                 ,align:'left'  , width: '80px'}			            	  
	            	  /* 기지국 감설 TIE 정보 시작 	*/
	               	  , {key : 'tieOne'		, hidden:true}
	               	  , {key : 'tieTwo'		, hidden:true}
	               	  , {key : 'mscId'		, hidden:true}
	               	  , {key : 'mscName'		, hidden:true}
	               	  , {key : 'bscId'		, hidden:true}
	               	  , {key : 'cinu'			, hidden:true}
	               	  , {key : 'aep'			, hidden:true}
	               	  , {key : 'portNo'		, hidden:true}
	               	  , {key : 'bip'			, hidden:true}
	               	  , {key : 'bipP'			, hidden:true}
	               	  , {key : 'bts'			, hidden:true}
	               	  , {key : 'btsId'		, hidden:true}
	               	  , {key : 'uprMtsoId'	, hidden:true}
	               	  , {key : 'lowMtsoId'	, hidden:true}
	               	  , {key : 'lowMtsoIdNm'	, hidden:true}					            	  
	            	  /* 기지국 감설 TIE 정보 끝  	*/		            			            	  
	            	  /* 교환기, 상호접속  감설 TIE 정보 시작 	*/
	               	  , {key : 'ogTieOne'		, hidden:true}
	               	  , {key : 'ogTieTwo'		, hidden:true}
	               	  , {key : 'ogMscId'		, hidden:true}
	               	  , {key : 'ogMscName'		, hidden:true}
	               	  , {key : 'ogMp'		, hidden:true}
	               	  , {key : 'ogPp'			, hidden:true}
	               	  , {key : 'ogCard'			, hidden:true}
	               	  , {key : 'ogLink'		, hidden:true}	

	               	  , {key : 'icTieOne'		, hidden:true}
	               	  , {key : 'icTieTwo'		, hidden:true}
	               	  , {key : 'icMscId'		, hidden:true}
	               	  , {key : 'icMscName'		, hidden:true}
	               	  , {key : 'icMp'		, hidden:true}
	               	  , {key : 'icPp'			, hidden:true}
	               	  , {key : 'icCard'			, hidden:true}
	               	  , {key : 'icLink'		, hidden:true}	
	            	  /* 교환기, 상호접속 감설 TIE 정보 끝  	*/	         	  
	               	  
    ];
	return returnData;
}
