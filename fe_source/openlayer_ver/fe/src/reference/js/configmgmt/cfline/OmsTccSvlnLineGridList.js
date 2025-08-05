/**
 * 
 */
//var gridId = 'dataGrid';
//var gridIdWork = 'dataGridWork';
var gridIdTask = 'dataGridTask';
// 그리드에 셋팅될 칼럼 concat으로 배열에 값을 추가해주어 
// 가변 그리드를 만든다. 조회 한후에는 초기화해준다.
var returnMapping = [];
var returnWrokMapping = [];
var returnTaskMapping = []; // 선번작성 헤더 

var count =0;

var editableVal = true;


var schDivVal = "";  // 조회 구분값 

var tmpJobTypeNm = {key : 'jobTypeNm'		,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '110px'};

//기지국 회선 교환기간
var mapping001001 = function(gridDiv, showAppltNoYn){
	var emClass = '<em class="color_red">*</em> '
	
	if (nullToEmpty($("#tmpEditPsblGbnVal").val()=="L") || schDivVal != ""){
		editableVal = false;
	}else{
		editableVal = true;
	}
	var tmpLineNm = {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: editableVal};
	
	var returnDataAll = [{ selectorColumn : true, width : '50px' }];
		returnDataAll.push(tmpJobTypeNm);
		returnDataAll.push(tmpLineNm);
		var returnData = [{key : 'omsPathNm'	              	,title : "OMS Path Name"                 ,align:'left'  , width: '200px'}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.svlnStatCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : function(value, data, mapping) { 
				return false;
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
		, {key : 'lnkgBizrCdNm'	              	,title : cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */                 ,align:'left'  , width: '160px'}
		, {key : 'lineUsePerdTypCd'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineUsePerdTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineUsePerdTypCdList);
						} else {
							return render_data.concat({value : data.lineUsePerdTypCd,text : data.lineUsePerdTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineUsePerdTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px'}
		, {key : 'ogMscId'	      		,title : "OG_MSC_ID"        		,align:'center', width: '100px'
			, editable : {  type: 'text' , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "10"}, styleclass : 'num_editing-in-grid'}
			, allowEdit : editableVal
		}
		, {key : 'ogMp'	      		,title : "OG_MP"          		,align:'center', width: '80px'}
		, {key : 'ogPp'	      		,title : "OG_PP"          		,align:'center', width: '80px'}
		, {key : 'ogCard'	      		,title : "OG_CARD"         		,align:'center', width: '80px'}
		, {key : 'ogLink'	      		,title : "OG_LINK"         		,align:'center', width: '80px'}
		, {key : 'ogTieOne'	      		,title : "OG_TIE1"         		,align:'center', width: '80px', editable: editableVal}
		, {key : 'ogTieTwo'	      		,title : "OG_TIE2"         		,align:'center', width: '80px', editable: editableVal}
		, {key : 'icMscId'	      		,title : "IC_MSC_ID"         		,align:'center', width: '100px'
			, editable : {  type: 'text' , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "10"}, styleclass : 'num_editing-in-grid'}
			, allowEdit : editableVal
		}
		, {key : 'icMp'	      		,title : "IC_MP"         		,align:'center', width: '80px'}
		, {key : 'icPp'	      		,title : "IC_PP"         		,align:'center', width: '80px'}
		, {key : 'icCard'	      		,title : "IC_CARD"         		,align:'center', width: '80px'}
		, {key : 'icLink'	      		,title : "IC_LINK"         		,align:'center', width: '80px'}
		, {key : 'icTieOne'	      		,title : "IC_TIE1"         		,align:'center', width: '80px', editable: editableVal}
		, {key : 'icTieTwo'	      		,title : "IC_TIE2"         		,align:'center', width: '80px', editable: editableVal}
		
		, {key : 'ogicCd'	        ,title : 'OG/IC'			,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ogicCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ogicCdList);
						} else {
							return render_data.concat({value : data.ogicCd,text : data.ogicCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ogicCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		
		, {key : 'tieMatchYn'	      	,title : cflineMsgArray['tieAccord'] /*  TIE일치 */          ,align:'center', width: '110px'}

		, {key : 'tieOne'	            ,title : "TIE1"			,align:'center', width: '80px'}
		, {key : 'tieTwo'	            ,title : "TIE2"			,align:'center', width: '80px'}
		, {key : 'mscId'	      		,title : "MSC_ID"       ,align:'center', width: '80px'}
		, {key : 'bscId'	      		,title : "BSC_ID"       ,align:'center', width: '80px'}
		, {key : 'bts'	      		,title : "BTS"          		,align:'center', width: '80px'}
		, {key : 'cinu'	      		,title : "CINU(M)"          		,align:'center', width: '80px'}
		, {key : 'aep'	      		,title : "AEP(M)"          		,align:'center', width: '80px'}
		, {key : 'portNo'	      		,title : "PORT_NO"          		,align:'center', width: '80px'}
		, {key : 'bip'	      		,title : "BIP"          		,align:'center', width: '80px'}
		, {key : 'bipP'	      		,title : "BIP_P"          		,align:'center', width: '80px'}
		, {key : 'btsId'	      		,title : "BTS_ID"          		,align:'center', width: '80px'}
		, {key : 'cuid'	      		,title : "CUID"          		,align:'center', width: '80px'}
		, {key : 'btsName'	      		,title : cflineMsgArray['mtsoNameMid']+"(M)" /*기지국명*/          		,align:'center', width: '80px'}
		, {key : 'ima'	      		,title : "IMA"          		,align:'center', width: '80px'}
		, {key : 'status'	      		,title : cflineMsgArray['status'] /*상태*/         		,align:'center', width: '80px'}
		, {key : 'slPath'	      		,title : "SL_PATH"          		,align:'center', width: '80px'}
		, {key : 'onmPath'	      		,title : "ONM_PATH"          		,align:'center', width: '80px'}
		, {key : 'cmsBmtso'	      		,title : cflineMsgArray['btsName']+"(CMS)" /*기지국사*/         		,align:'center', width: '80px'}
		, {key : 'cmsId'	            ,title : cflineMsgArray['cmsId']			,align:'center', width: '80px'}
		, {key : 'cmsMscId'	            ,title : "CMS_MSC_ID"			,align:'center', width: '100px'}
		, {key : 'cmsBscId'	            ,title : "CMS_BSC_ID"			,align:'center', width: '100px'}
		, {key : 'cmsBtsId'	            ,title : "CMS_BTS_ID"			,align:'center', width: '100px'}
		
		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px', editable: editableVal}
		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px', editable: editableVal}
		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px', editable: editableVal}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ynList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/     ,align:'center', width: '130px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '110px'}
		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}	
		, {key : 'lineDistTypCd'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineDistTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineDistTypCdList);
						} else {
							return render_data.concat({value : data.lineDistTypCd,text : data.lineDistTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineDistTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineSctnTypCd'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineSctnTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.chrStatCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
		, {key : 'feePayTrmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
		, {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '130px'}
		, {key : 'lineMgmtGrCd'	        ,title : emClass + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: editableVal}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: editableVal}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: editableVal}
		, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ynList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
	];
	for(i=0; i<returnData.length;i++){
		returnDataAll.push(returnData[i]);
}
	return returnDataAll;
}


//기지국 회선 기지국간
var mapping001002 = function(gridDiv, showAppltNoYn){
	var emClass = '<em class="color_red">*</em> ';
	
	if (nullToEmpty($("#tmpEditPsblGbnVal").val()=="L") || schDivVal != ""){
		editableVal = false;
	}else{
		editableVal = true;
	}
	var tmpLineNm = {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: editableVal};
	
	
	var returnDataAll = [{ selectorColumn : true, width : '50px' }];
		returnDataAll.push(tmpJobTypeNm);
		returnDataAll.push(tmpLineNm);
	
	var returnData =  [{key : 'omsPathNm'	              	,title : "OMS Path Name"                 ,align:'left'  , width: '200px'}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.svlnStatCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : function(value, data, mapping) { 
				return false;
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
		, {key : 'lnkgBizrCdNm'	              	,title : cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */                 ,align:'left'  , width: '160px'}
		, {key : 'lineUsePerdTypCd'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineUsePerdTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineUsePerdTypCdList);
						} else {
							return render_data.concat({value : data.lineUsePerdTypCd,text : data.lineUsePerdTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineUsePerdTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px'}
		
		, {key : 'ogMscId'	      		,title : "OG_MSC_ID"        		,align:'center', width: '100px'}
		, {key : 'ogMp'	      		,title : "OG_MP"          		,align:'center', width: '80px'}
		, {key : 'ogPp'	      		,title : "OG_PP"          		,align:'center', width: '80px'}
		, {key : 'ogCard'	      		,title : "OG_CARD"         		,align:'center', width: '80px'}
		, {key : 'ogLink'	      		,title : "OG_LINK"         		,align:'center', width: '80px'}
		, {key : 'ogTieOne'	      		,title : "OG_TIE1"         		,align:'center', width: '80px'}
		, {key : 'ogTieTwo'	      		,title : "OG_TIE2"         		,align:'center', width: '80px'}
		, {key : 'icMscId'	      		,title : "IC_MSC_ID"         		,align:'center', width: '100px'}
		, {key : 'icMp'	      		,title : "IC_MP"         		,align:'center', width: '80px'}
		, {key : 'icPp'	      		,title : "IC_PP"         		,align:'center', width: '80px'}
		, {key : 'icCard'	      		,title : "IC_CARD"         		,align:'center', width: '80px'}
		, {key : 'icLink'	      		,title : "IC_LINK"         		,align:'center', width: '80px'}
		, {key : 'icTieOne'	      		,title : "IC_TIE1"         		,align:'center', width: '80px'}
		, {key : 'icTieTwo'	      		,title : "IC_TIE2"         		,align:'center', width: '80px'}		
		, {key : 'ogicCd'	        ,title : 'OG/IC'			,align:'center', width: '110px'}		
		
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		
		, {key : 'tieOne'	            ,title : "TIE1"			,align:'center', width: '80px', editable: editableVal}
		, {key : 'tieTwo'	            ,title : "TIE2"			,align:'center', width: '80px', editable: editableVal}
		, {key : 'mscId'	      		,title : "MSC_ID"          		,align:'center', width: '80px'
			, editable : {  type: 'text' , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "10"}, styleclass : 'num_editing-in-grid'}
			, allowEdit : editableVal
		}
		, {key : 'bscId'	      		,title : "BSC_ID"          		,align:'center', width: '80px'
			, editable : {  type: 'text' , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "10"}, styleclass : 'num_editing-in-grid'}
			, allowEdit : editableVal
		}
		, {key : 'bts'	      		,title : "BTS"          		,align:'center', width: '80px', editable: editableVal}
		, {key : 'cinu'	      		,title : "CINU(M)"          		,align:'center', width: '80px'}
		, {key : 'aep'	      		,title : "AEP(M)"          		,align:'center', width: '80px'}
		, {key : 'portNo'	      		,title : "PORT_NO"          		,align:'center', width: '80px'}
		, {key : 'bip'	      		,title : "BIP"          		,align:'center', width: '80px'}
		, {key : 'bipP'	      		,title : "BIP_P"          		,align:'center', width: '80px'}
		, {key : 'btsId'	      		,title : "BTS_ID"          		,align:'center', width: '80px'}
		, {key : 'cuid'	      		,title : "CUID"          		,align:'center', width: '80px'}
		, {key : 'btsName'	      		,title : cflineMsgArray['mtsoNameMid']+"(M)" /*기지국명*/          		,align:'center', width: '80px'}
		, {key : 'ima'	      		,title : "IMA"          		,align:'center', width: '80px'}
		, {key : 'status'	      		,title : cflineMsgArray['status'] /*상태*/         		,align:'center', width: '80px'}
		, {key : 'slPath'	      		,title : "SL_PATH"          		,align:'center', width: '80px'}
		, {key : 'onmPath'	      		,title : "ONM_PATH"          		,align:'center', width: '80px'}
		, {key : 'cmsBmtso'	      		,title : cflineMsgArray['btsName']+"(CMS)" /*기지국사*/         		,align:'center', width: '80px'}
		, {key : 'cmsId'	            ,title : cflineMsgArray['cmsId']			,align:'center', width: '80px'}
		, {key : 'cmsMscId'	            ,title : "CMS_MSC_ID"			,align:'center', width: '100px'}
		, {key : 'cmsBscId'	            ,title : "CMS_BSC_ID"			,align:'center', width: '100px'}
		, {key : 'cmsBtsId'	            ,title : "CMS_BTS_ID"			,align:'center', width: '100px'}
		
		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px', editable: editableVal}
		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px', editable: editableVal}
		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px', editable: editableVal}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ynList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/     ,align:'center', width: '130px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}	
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '110px'}
		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}
		, {key : 'lineDistTypCd'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineDistTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineDistTypCdList);
						} else {
							return render_data.concat({value : data.lineDistTypCd,text : data.lineDistTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineDistTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineSctnTypCd'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineSctnTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.chrStatCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
		, {key : 'feePayTrmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
		, {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '130px'}
		, {key : 'lineMgmtGrCd'	        ,title : emClass + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: editableVal}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: editableVal}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: editableVal}
	 	, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ynList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
	]; 
	for(i=0; i<returnData.length;i++){
		returnDataAll.push(returnData[i]);
	}	
	return returnDataAll;
}

//기지국 회선 상호접속간
var mapping001003 = function(gridDiv, showAppltNoYn){
	var emClass = '<em class="color_red">*</em> ';
	
	if (nullToEmpty($("#tmpEditPsblGbnVal").val()=="L") || schDivVal != ""){
		editableVal = false;
	}else{
		editableVal = true;
	}
	
	var tmpLineNm = {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: editableVal};
	

	var returnDataAll = [{ selectorColumn : true, width : '50px' }];
		returnDataAll.push(tmpJobTypeNm);
		returnDataAll.push(tmpLineNm);
		
	var returnData = [{key : 'omsPathNm'	              	,title : "OMS Path Name"                 ,align:'left'  , width: '200px'}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.svlnStatCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : function(value, data, mapping) { 
				return false;
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
		, {key : 'lnkgBizrCdNm'	              	,title : cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */                 ,align:'left'  , width: '160px'}
		, {key : 'lineUsePerdTypCd'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineUsePerdTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineUsePerdTypCdList);
						} else {
							return render_data.concat({value : data.lineUsePerdTypCd,text : data.lineUsePerdTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineUsePerdTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px'}
		, {key : 'ogMscId'	      		,title : "MSC_ID"        		,align:'center', width: '100px'
			, editable : {  type: 'text' , attr : { "data-keyfilter-rule" : "decimal", "maxlength" : "10"}, styleclass : 'num_editing-in-grid'}
			,allowEdit : editableVal
		}
		, {key : 'ogMp'	      		,title : "MP"          		,align:'center', width: '80px'}
		, {key : 'ogPp'	      		,title : "PP"          		,align:'center', width: '80px'}
		, {key : 'ogCard'	      		,title : "CARD"         		,align:'center', width: '80px'}
		, {key : 'ogLink'	      		,title : "LINK"         		,align:'center', width: '80px'}
		, {key : 'ogTieOne'	      		,title : "TIE1"         		,align:'center', width: '80px', editable: editableVal}
		, {key : 'ogTieTwo'	      		,title : "TIE2"         		,align:'center', width: '80px', editable: editableVal}
		
		, {key : 'icMscId'	      		,title : "IC_MSC_ID"         		,align:'center', width: '100px'}
		, {key : 'icMp'	      		,title : "IC_MP"         		,align:'center', width: '80px'}
		, {key : 'icPp'	      		,title : "IC_PP"         		,align:'center', width: '80px'}
		, {key : 'icCard'	      		,title : "IC_CARD"         		,align:'center', width: '80px'}
		, {key : 'icLink'	      		,title : "IC_LINK"         		,align:'center', width: '80px'}
		, {key : 'icTieOne'	      		,title : "IC_TIE1"         		,align:'center', width: '80px'}
		, {key : 'icTieTwo'	      		,title : "IC_TIE2"         		,align:'center', width: '80px'}		
		, {key : 'ogicCd'	        ,title : 'OG/IC'			,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ogicCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ogicCdList);
						} else {
							return render_data.concat({value : data.ogicCd,text : data.ogicCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ogicCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
				
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		
		, {key : 'tieOne'	            ,title : "TIE1"			,align:'center', width: '80px'}
		, {key : 'tieTwo'	            ,title : "TIE2"			,align:'center', width: '80px'}
		, {key : 'mscId'	      		,title : "MSC_ID"       ,align:'center', width: '80px'}
		, {key : 'bscId'	      		,title : "BSC_ID"       ,align:'center', width: '80px'}
		, {key : 'bts'	      		,title : "BTS"          		,align:'center', width: '80px'}
		, {key : 'cinu'	      		,title : "CINU(M)"          		,align:'center', width: '80px'}
		, {key : 'aep'	      		,title : "AEP(M)"          		,align:'center', width: '80px'}
		, {key : 'portNo'	      		,title : "PORT_NO"          		,align:'center', width: '80px'}
		, {key : 'bip'	      		,title : "BIP"          		,align:'center', width: '80px'}
		, {key : 'bipP'	      		,title : "BIP_P"          		,align:'center', width: '80px'}
		, {key : 'btsId'	      		,title : "BTS_ID"          		,align:'center', width: '80px'}
		, {key : 'cuid'	      		,title : "CUID"          		,align:'center', width: '80px'}
		, {key : 'btsName'	      		,title : cflineMsgArray['mtsoNameMid']+"(M)" /*기지국명*/          		,align:'center', width: '80px'}
		, {key : 'ima'	      		,title : "IMA"          		,align:'center', width: '80px'}
		, {key : 'status'	      		,title : cflineMsgArray['status'] /*상태*/         		,align:'center', width: '80px'}
		, {key : 'slPath'	      		,title : "SL_PATH"          		,align:'center', width: '80px'}
		, {key : 'onmPath'	      		,title : "ONM_PATH"          		,align:'center', width: '80px'}
		, {key : 'cmsBmtso'	      		,title : cflineMsgArray['btsName']+"(CMS)" /*기지국사*/         		,align:'center', width: '80px'}
		, {key : 'cmsId'	            ,title : cflineMsgArray['cmsId']			,align:'center', width: '80px'}
		, {key : 'cmsMscId'	            ,title : "CMS_MSC_ID"			,align:'center', width: '100px'}
		, {key : 'cmsBscId'	            ,title : "CMS_BSC_ID"			,align:'center', width: '100px'}
		, {key : 'cmsBtsId'	            ,title : "CMS_BTS_ID"			,align:'center', width: '100px'}		
		
		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px', editable: editableVal}
		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px', editable: editableVal}
		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px', editable: editableVal}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ynList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/     ,align:'center', width: '130px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}	
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'uprSystmNm'	            ,title : cflineMsgArray['upperSystemName'] /*상위시스템명*/             ,align:'center', width: '110px'}
		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
		, {key : 'mgmtPostCdNm'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px'}
		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : editableVal
		}
		, {key : 'lineDistTypCd'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineDistTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineDistTypCdList);
						} else {
							return render_data.concat({value : data.lineDistTypCd,text : data.lineDistTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineDistTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineSctnTypCd'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineSctnTypCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.chrStatCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
		, {key : 'feePayTrmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
		, {key : 'areaCmtsoNm'	            ,title : cflineMsgArray['areaCenterMobileTelephoneSwitchingOffice'] /*지역중심국*/			,align:'center', width: '130px'}
		, {key : 'lineMgmtGrCd'	        ,title : emClass + cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: editableVal}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: editableVal}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: editableVal}
	 	, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ynList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
					 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
			},
			allowEdit : editableVal,
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
	] ; 
	for(i=0; i<returnData.length;i++){
		returnDataAll.push(returnData[i]);
	}	
	return returnDataAll;
}
