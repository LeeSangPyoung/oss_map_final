/**
 * 
 */
//var gridId = 'dataGrid';
var gridIdWork = 'dataGrid';
// 그리드에 셋팅될 칼럼 concat으로 배열에 값을 추가해주어 
// 가변 그리드를 만든다. 조회 한후에는 초기화해준다.
var returnMapping = [];
var returnWrokMapping = [];

//기지국 회선 교환기간
var mapping001001 = function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ';
	}
	var returnData = [ { selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: true}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}
			/*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
		, {key : 'lineUsePerdTypCd'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineUsePerdTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineUsePerdTypCdList);
						} else {
							return render_data.concat({value : data.lineUsePerdTypCd,text : data.lineUsePerdTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineUsePerdTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px'}
		, {key : 'ogMscId'	      		,title : "OG_MSC_ID"        		,align:'center', width: '100px', editable: true
			// ifLineNo 따라 수정 가능하게 만들어야 할수 있음
			/*function(value, data) {
				var editalbeYn = null
				if (data.ifLineNo != undefined){
					editalbeYn = $('<input value="' + value + '" id="ogMscId" style="width: 100%;">');
				}
				$a.convert(editalbeYn);
				return editalbeYn;
			},
			editedValue : function(cell, data, render, mapping, grid){
				return $(cell).find('input').val();
			}*/
		}
		, {key : 'ogMp'	      		,title : "OG_MP"          		,align:'center', width: '80px'}
		, {key : 'ogPp'	      		,title : "OG_PP"          		,align:'center', width: '80px'}
		, {key : 'ogCard'	      		,title : "OG_CARD"         		,align:'center', width: '80px'}
		, {key : 'ogLink'	      		,title : "OG_LINK"         		,align:'center', width: '80px'}
		, {key : 'ogTieOne'	      		,title : "OG_TIE1"         		,align:'center', width: '80px', editable: true}
		, {key : 'ogTieTwo'	      		,title : "OG_TIE2"         		,align:'center', width: '80px', editable: true}
		, {key : 'icMscId'	      		,title : "IC_MSC_ID"         		,align:'center', width: '100px', editable: true}
		, {key : 'icMp'	      		,title : "IC_MP"         		,align:'center', width: '80px'}
		, {key : 'icPp'	      		,title : "IC_PP"         		,align:'center', width: '80px'}
		, {key : 'icCard'	      		,title : "IC_CARD"         		,align:'center', width: '80px'}
		, {key : 'icLink'	      		,title : "IC_LINK"         		,align:'center', width: '80px'}
		, {key : 'icTieOne'	      		,title : "IC_TIE1"         		,align:'center', width: '80px', editable: true}
		, {key : 'icTieTwo'	      		,title : "IC_TIE2"         		,align:'center', width: '80px', editable: true}
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'ogicCd'	        ,title : 'OG/IC'			,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ogicCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ogicCdList);
						} else {
							return render_data.concat({value : data.ogicCd,text : data.ogicCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ogicCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
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
			,  editable : true
		}	
		, {key : 'lineDistTypCd'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineDistTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineDistTypCdList);
						} else {
							return render_data.concat({value : data.lineDistTypCd,text : data.lineDistTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineDistTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineSctnTypCd'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineSctnTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
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
						if (svlnCommCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: true}
		, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	];
	return returnData;
}


//기지국 회선 기지국간
var mapping001002 = function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var returnData =  [ { selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: true}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			},
			/*editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
		, {key : 'lineUsePerdTypCd'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineUsePerdTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineUsePerdTypCdList);
						} else {
							return render_data.concat({value : data.lineUsePerdTypCd,text : data.lineUsePerdTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineUsePerdTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px'}
		, {key : 'mscId'	      		,title : "MSC_ID"          		,align:'center', width: '80px', editable: true}
		, {key : 'bscId'	      		,title : "BSC_ID"          		,align:'center', width: '80px', editable: true}
		, {key : 'bts'	      		,title : "BTS"          		,align:'center', width: '80px', editable: true}
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
		, {key : 'tieOne'	            ,title : "TIE1"			,align:'center', width: '80px', editable: true}
		, {key : 'tieTwo'	            ,title : "TIE2"			,align:'center', width: '80px', editable: true}
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
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
			,  editable : true
		}
		, {key : 'lineDistTypCd'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineDistTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineDistTypCdList);
						} else {
							return render_data.concat({value : data.lineDistTypCd,text : data.lineDistTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineDistTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineSctnTypCd'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineSctnTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
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
						if (svlnCommCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: true}
	 	, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	]; 
	return returnData;
}

//기지국 회선 상호접속간
var mapping001003 = function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var returnData = [ { selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: true}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}
		   /*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
		, {key : 'lnkgBizrCdNm'	              	,title : cflineMsgArray['communicationBusinessMan'] /* 통신사업자 */                 ,align:'left'  , width: '160px'}
		, {key : 'lineUsePerdTypCd'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineUsePerdTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineUsePerdTypCdList);
						} else {
							return render_data.concat({value : data.lineUsePerdTypCd,text : data.lineUsePerdTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineUsePerdTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px'}
		, {key : 'ogMscId'	      		,title : "MSC_ID"        		,align:'center', width: '100px', editable: true}
		, {key : 'ogMp'	      		,title : "MP"          		,align:'center', width: '80px'}
		, {key : 'ogPp'	      		,title : "PP"          		,align:'center', width: '80px'}
		, {key : 'ogCard'	      		,title : "CARD"         		,align:'center', width: '80px'}
		, {key : 'ogLink'	      		,title : "LINK"         		,align:'center', width: '80px'}
		, {key : 'ogTieOne'	      		,title : "TIE1"         		,align:'center', width: '80px', editable: true}
		, {key : 'ogTieTwo'	      		,title : "TIE2"         		,align:'center', width: '80px', editable: true}
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'ogicCd'	        ,title : 'OG/IC'			,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ogicCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ogicCdList);
						} else {
							return render_data.concat({value : data.ogicCd,text : data.ogicCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ogicCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
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
			,  editable : true
		}
		, {key : 'lineDistTypCd'	        ,title : emClass + cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineDistTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineDistTypCdList);
						} else {
							return render_data.concat({value : data.lineDistTypCd,text : data.lineDistTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineDistTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineSctnTypCd'	        ,title : emClass + cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineSctnTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
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
						if (svlnCommCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: true}
	 	, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	] ; 
	return returnData;
}

// 기지국 회선 DU
var mapping001016 = function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var returnData = [ { selectorColumn : true, width : '50px' }
	, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', treeColumn:true, treeColumnHeader:false} 
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCdNm'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px'}
		, {key : 'svlnNetDivCdNm'	      		,title : cflineMsgArray['networkDivision'] /*  망구분 */       		,align:'center', width: '130px'}
		, {key : 'lineLnoGrpSrno'	            ,title : cflineMsgArray['digitalUnitSerialNumber'] /*  서DU일련번호 */			,align:'center', width: '130px'}
		, {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lineCfgTypCd'	        ,title : cflineMsgArray['lineConfigurationType'] /*회선구성유형*/			,align:'center', width: '160px'}
		, {key : 'mainEqpIpAddr'	        ,title : "MASTER_IP1" ,align:'center', width: '160px'}
		, {key : 'subEqpIpAddr'	        ,title : "MASTER_IP2" ,align:'center', width: '160px'}
		, {key : 'enbId'	        ,title : "RAS/DU_ID"			,align:'center', width: '160px'}
		, {key : 'portMacNo'	        ,title : "MAC"			,align:'center', width: '160px'}
		, {key : 'vlanId'	        ,title : "VLAN"			,align:'center', width: '100px'}
		, {key : 'pktTrkNm'	        ,title : cflineMsgArray['pwEvcName'] /* PW/EVC명 */			,align:'center', width: '160px', editable: true}
		, {key : 'pktTrkNo', hidden: true}
		, {key : 'l2swYn'	        ,title : cflineMsgArray['l2SwitchYesOrNo'] /*L2스위치여부*/			,align:'center', width: '160px'}
		, {key : 'lEqpTid'	        ,title : cflineMsgArray['digitalUnitConcentrationSwitchtargeTId'] /*DU집선스위치(TID)*/			,align:'left', width: '160px'}
		, {key : 'ltwoIp'	        ,title : "L2_IP"			,align:'center', width: '160px'}
		, {key : 'ltwoUpPortNm'	        ,title : "L2_UPLINK_PORT"			,align:'left', width: '160px'}
		, {key : 'ltwoLowPortNm'	        ,title : "L2_DOWNLINK_PORT"			,align:'left', width: '160px'}
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'lowSystmNm'	            ,title : cflineMsgArray['lowSystemName'] /*하위시스템명*/             ,align:'center', width: '110px'}
		, {key : 'lineUsePerdTypCd'	        ,title : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px'}
		, {key : 'mgmtGrpCdNm'	    		,title : cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'lineTrmnDt'	          	,title : cflineMsgArray['lineTerminationDate'] /*회선해지일자*/             ,align:'center', width: '160px'}
		, {key : 'chrStatCdNm'	            ,title : cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px'}
		, {key : 'lesFeeTypCdNm'	            ,title : cflineMsgArray['rentFeeType'] /*임차요금유형*/			,align:'center', width: '130px'}
		, {key : 'feePayTrmsMtsoNm'	            ,title : cflineMsgArray['feePayTransmissionOfficetransmissionOfficetransmissionOffice'] /*요금납부전송실*/			,align:'center', width: '130px'}
		, {key : 'lineMgmtGrCdNm'	        ,title : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px'}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px'}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px'}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px'}
		, {key : 'dirConnYn'	            ,title : cflineMsgArray['directConnectionYesOrNo'] /*  직접연결여부 */				,align:'center', width: '110px'}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	] ; 
	return returnData;
}

//IP전송로(WCDMA)
var mapping001020 = function(gridDiv){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var returnData = [ { selectorColumn : true, width : '50px' }
	, {key : 'svlnTypCd'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px',
		render : {
			type : 'string',
			rule : function(value, data) {
				var render_data = [];
				var currentData = AlopexGrid.currentData(data);
					if (currentData.svlnSclCd) {
						return render_data = render_data.concat(svlnTypCdListCombo[currentData.svlnSclCd]);
					} else {
						return render_data.concat({value : data.svlnTypCd,text : data.svlnTypCdNm });
					}
			}
		},
		editable : {type : 'select',
			rule : function(value, data) {
						var render_data = [];
						var currentData = AlopexGrid.currentData(data); 
						if ( svlnTypCdListCombo[currentData.svlnSclCd] ){
							return  render_data = render_data.concat( svlnTypCdListCombo[currentData.svlnSclCd] );
						} else {
							return render_data = render_data.concat( {value : '', text : cflineCommMsgArray['none']} );
						}
					}
		 	, attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
		},
		editedValue : function(cell) {
			return $(cell).find('select option').filter(':selected').val(); 
		},
		refreshBy : 'svlnSclCd'
	}
	, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable :true} 
	, {key : 'DUIP'	        ,title : "사업자"			,align:'center', width: '160px'}
	, {key : 'lineUsePerdTypCd'	        ,title : emClass + cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px',
		render : {
			type : 'string',
			rule : function(value, data) {
				var render_data = [];
					if (svlnCommCodeData.lineUsePerdTypCdList.length > 1) {
						return render_data = render_data.concat(svlnCommCodeData.lineUsePerdTypCdList);
					} else {
						return render_data.concat({value : data.lineUsePerdTypCd,text : data.lineUsePerdTypCdNm });
					}
			}
		},
		editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineUsePerdTypCdList; }
				 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
		},
		editedValue : function(cell) {
			return $(cell).find('select option').filter(':selected').val(); 
		}
	}
	, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'}
	, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
	, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
	, {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
	, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
	, {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
	, {key : 'portMacNo'	        ,title : "MAC"			,align:'center', width: '160px'}
	, {key : 'DUIP'	        ,title : "DUIP"			,align:'center', width: '160px'}
	, {key : 'vlanId'	        ,title : "VLAN"			,align:'center', width: '100px'}
	, {key : 'pktTrkNm'	        ,title : cflineMsgArray['pwEvcName'] /* PW/EVC명 */			,align:'center', width: '160px', editable: true}
	, {key : 'pktTrkNo', hidden: true}
	, {key : 'ringOneName',		title : 'Ring#1'			,align:'center',		width:'80px' }
	, {key : 'eqpNmOne',	        title : cflineMsgArray['equipmentName']+"#1" /* 장비명 */			 ,align:'center', width:'200px' }
	, {key : 'ringTwoName',		title : 'Ring#2'			,align:'center',		width:'80px' }
	, {key : 'eqpNmTwo',	        title : cflineMsgArray['equipmentName']+"#2" /* 장비명 */			 ,align:'center', width:'200px' }
	, {key : 'eqpPortVal',		title : 'Drop Port'			,align:'center',			width:'80px' }
	, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
	] ; 
	return returnData;
}

//RU회선 RU
var mappingRu003 =  function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var returnData = [ { selectorColumn : true, width : '50px' }
	, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', treeColumn:true, treeColumnHeader:false/*, editable: true*/}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '110px'}
		, {key : 'svlnStatCdNm'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px'}
		, {key : 'duNm'	        ,title : cflineMsgArray['digitalUnitName'] /*DU명*/			,align:'left', width: '160px'}
		, {key : 'onsHdofcCdNm'	      		,title : cflineMsgArray['oneNumberServiceHeadOfficeName'] /*ONS본부명*/         		,align:'center', width: '160px'}
		, {key : 'onsTeamCdNm'	      		,title : cflineMsgArray['oneNumberServiceTeamName'] /*ONS팀명*/         		,align:'center', width: '160px'}
		, {key : 'svlnLclCdNm'	            ,title : cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'tmofNm'	      		,title : cflineMsgArray['transmissionOffice'] /*전송실*/ +"(RU)"   		,align:'center', width: '160px'}
		, {key : 'lowMtsoIdNm'	      		,title : cflineMsgArray['mobileTelephoneSwitchingOffice'] /*국사*/         		,align:'center', width: '160px'}
		, {key : 'mgmtGrpCdNm'	    		,title : cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'uprTmofNm'	      		,title : cflineMsgArray['mgmtTmof'] /*관할전송실*/ +"(DU)"         		,align:'center', width: '160px'}
		, {key : 'serNoVal'	        ,title : cflineMsgArray['serialNumber'] /*시리얼번호*/			,align:'center', width: '110px'}
		, {key : 'duIntgFcltsCd'	        ,title : cflineMsgArray['digitalUnitFacilitiesCode'] /*DU시설코드*/			,align:'center', width: '160px'}
		, {key : 'ruNm'	        ,title : cflineMsgArray['radioUnitName'] /*RU명*/			,align:'left', width: '160px'}
		, {key : 'ruIntgFcltsCd'	        ,title : cflineMsgArray['radioUnitFacilitiesCode'] /*RU시설코드*/			,align:'center', width: '160px'} 
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
	] ;
	return returnData;
}

//RU회선 중계기
var mappingCore003 = function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var leslSrchYn = true;
	if ($("input:checkbox[id='leslSrchYn']").is(":checked") ){
		leslSrchYn = false;
	}
//	console.log("leslSrchYn ======" + leslSrchYn);
	var returnData = [ { selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', treeColumn:true, treeColumnHeader:false}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}		
		   /*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'lesTypCd'	       			 ,title : cflineMsgArray['rentType']  /*임차유형 */			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lesTypeCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lesTypeCdList);
						} else {
							return render_data.concat({value : data.lesTypeCd,text : data.lesTypeCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lesTypeCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
		, {key : 'tmofNm'	      		,title : cflineMsgArray['transmissionOffice'] /*전송실*/         		,align:'center', width: '110px'}
		, {key : 'ovpyObjYn'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsObjectYesOrNo']  /* 과오납대상여부 */       		,align:'center', width: '160px', hidden: leslSrchYn}
		, {key : 'ovpyOccrYm'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsOccuranceYearAndMonth']  /* 과오납발생년월 */     		,align:'center', width: '160px', hidden: leslSrchYn}
		, {key : 'ovpyRmdySchdDt'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsRemedyScheduleDate'] /* 과오납해소예정일자 */      		,align:'center', width: '160px', hidden: leslSrchYn}
		, {key : 'ovpyOccrRsnCd'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsOccuranceReason']  /* 과오납발생사유 */    		,align:'center', width: '160px', hidden: leslSrchYn}
		, {key : 'ovpyRmdyWayCdNm'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsRemedyWay'] /*과오납해소방안*/      		,align:'center', width: '160px', hidden: leslSrchYn}
		, {key : 'skAfcoDivCdNm'	      		,title : cflineMsgArray['offerBusinessMan'] /*제공사업자*/        		,align:'center', width: '110px', hidden: leslSrchYn}
		, {key : 'commBizrNm'	            ,title : cflineMsgArray['rentBusinessMan'] /* 임차사업자 */			,align:'center', width: '110px', hidden: leslSrchYn}		
		, {key : 'leslNo'	            ,title : cflineMsgArray['leaseLineNumber'] /* 임차회선번호 */			,align:'center', width: '110px', hidden: leslSrchYn}		
		, {key : 'lesDistm'	            ,title : cflineMsgArray['rentMeter'] /* 임차거리M */		,align:'right', width: '110px', render: {type:"string", rule : "comma"}, hidden: leslSrchYn}		
		, {key : 'lesUmtsoNm'	            ,title : cflineMsgArray['rentUpperMobileTelephoneSwitchingOffice'] /*임차상위국*/			,align:'center', width: '110px', hidden: leslSrchYn}		
		, {key : 'lesUmtsoAddr'	            ,title : cflineMsgArray['rentUpperMobileTelephoneSwitchingOfficeAddress'] /*임차상위국주소*/			,align:'center', width: '110px', hidden: leslSrchYn}		
		, {key : 'umtsoAddrLnkgDiv'	            ,title : cflineMsgArray['superStationAddressLinkDiv']	 /* 상위국주소연동구분 */ 	,align:'center', width: '160px', hidden: leslSrchYn}		
		, {key : 'lesLmtsoNm'	            ,title : cflineMsgArray['rentLowMobileTelephoneSwitchingOffice']	 /* 임차하위국 */ 	,align:'center', width: '110px', hidden: leslSrchYn}		
		, {key : 'lesLmtsoAddr'	            ,title : cflineMsgArray['rentLowMobileTelephoneSwitchingOfficeAddress'] /*임차하위국주소*/			,align:'center', width: '110px', hidden: leslSrchYn}
		, {key : 'lmtsoAddrLnkgDiv'	            ,title : cflineMsgArray['subStationAddressLinkDiv']	 /* 하위국주소연동구분 */ 	,align:'center', width: '160px', hidden: leslSrchYn}
		, {key : 'lesOpenDtm'	            ,title : cflineMsgArray['lesOpeningDate']  /*임차개통일*/			,align:'center', width: '110px', hidden: leslSrchYn}		
		, {key : 'fcltsDivCdNm'	            ,title : cflineMsgArray['facilitiesDivision']  /*시설구분*/			,align:'center', width: '110px', hidden: leslSrchYn}		
		, {key : 'slfNetLinCtt'	      		,title : cflineMsgArray['slfNetLinCtt'] /*자가인입내용*/      		,align:'center', width: '160px', editable: true}
		, {key : 'dnrSystmNm'	            ,title : cflineMsgArray['donorSystemName'] /*도너시스템명*/				,align:'center', width: '110px', editable: true}
		, {key : 'erpUmtsoAddr'	            ,title : cflineMsgArray['erpSuperStationAddress'] /*ERP상위국주소*/				,align:'center', width: '110px'}
		, {key : 'erpLmtsoAddr'	            ,title : cflineMsgArray['erpSubStationAddress'] /*ERP하위국주소*/				,align:'center', width: '110px'}
		, {key : 'lineDistm'	            ,title : cflineMsgArray['lineMeter'] /*회선거리M*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'roabDistk'	            ,title : cflineMsgArray['roadbedKilometer'] /*도상거리K*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'otdrDistm'	            ,title : cflineMsgArray['otdrDistm'] /*OTDR거리M*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lastChgUserId'	        ,title : cflineMsgArray['lastChangeUserId'] /*수정ID자*/				,align:'center', width: '160px'}
		, {key : 'frstRegDate'	        ,title : cflineMsgArray['firstRegistrationDate'] /*등록일자*/				,align:'center', width: '110px'}
		, {key : 'frstRegUserId'	        ,title : cflineMsgArray['firstRegistrationUserId'] /*등록자ID*/				,align:'center', width: '160px'}
		, {key : 'lineCoreCnt'	        ,title : cflineMsgArray['lineCoreCount'] /*회선코어수*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'uprIntgFcltsCd'	        ,title : cflineMsgArray['bmtsoIntgFcltsCd1'] /*기지국명통합시설코드1*/			,align:'center', width: '160px'}
		, {key : 'uprIntgFcltsCdNm'	        ,title : cflineMsgArray['mtsoNameOne'] /*기지국명1*/			,align:'center', width: '100px'}
		, {key : 'bmtsIontgFcltsCdTwo'	        ,title : cflineMsgArray['bmtsoIntgFcltsCd2'] /*기지국통합시설코드2*/				,align:'center', width: '160px'}
		, {key : 'bmtsIontgFcltsCdNmTwo'	        ,title : cflineMsgArray['mtsoNameTwo'] /*기지국명2*/				,align:'center', width: '100px'}
		, {key : 'lowIntgFcltsCd'	        ,title : cflineMsgArray['fcltsNumber'] /*시설번호*/			,align:'center', width: '110px'} 
		, {key : 'sisulStatNm'	        ,title : cflineMsgArray['fcltsStatus'] /*시설상태*/			,align:'center', width: '110px'} 
		, {key : 'sisulEndDt'	        ,title : cflineMsgArray['serviceEndDate'] /*서비스종료일*/			,align:'center', width: '110px'} 
		, {key : 'sisulLineDivNm'	        ,title : cflineMsgArray['lineDivision'] /*회선구분*/			,align:'center', width: '110px'} 
		, {key : 'sisulTrmnSchdDt'	        ,title : cflineMsgArray['terminationScheduleDate'] /*해지예정일자*/			,align:'center', width: '110px'} 
		, {key : 'rmteSystmNm'	        ,title : cflineMsgArray['remoteSystemName'] /*리모트시스템명*/			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
	] 
	return returnData;
}

//RU회선 Wifi
var mappingWifi003 = function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var returnData = [ { selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', treeColumn:true, treeColumnHeader:false}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}
			/*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'lesTypCd'	       			 ,title : cflineMsgArray['rentType']  /*임차유형 */			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lesTypeCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lesTypeCdList);
						} else {
							return render_data.concat({value : data.lesTypeCd,text : data.lesTypeCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lesTypeCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'wifiL2FcltsYnVal'	      		,title : cflineMsgArray['l2FacilitiesYesOrNo'] /*L2시설여부*/         		,align:'center', width: '160px'}
		, {key : 'trmsSpedNm'	      		,title : cflineMsgArray['transmissionSpeed'] /*전송속도*/         		,align:'center', width: '160px'}
		, {key : 'tmlnTrmnYnNm'	      		,title : cflineMsgArray['transmissionLineTerminationYesOrNo'] /*전송로해지여부*/         		,align:'center', width: '160px'}
		, {key : 'wifiTmlnTypNm'	      		,title : cflineMsgArray['transmissionLineType'] /*전송로유형*/         		,align:'center', width: '160px'}
		, {key : 'tmofNm'	      		,title : cflineMsgArray['transmissionOffice'] /*전송실*/         		,align:'center', width: '110px'}
		, {key : 'skAfcoDivCdNm'	      		,title : cflineMsgArray['offerBusinessMan'] /*제공사업자*/        		,align:'center', width: '110px'}
		, {key : 'commBizrNm'	            ,title : cflineMsgArray['rentBusinessMan'] /* 임차사업자 */			,align:'center', width: '110px'}		
		, {key : 'leslNo'	            ,title : cflineMsgArray['leaseLineNumber'] /* 임차회선번호 */			,align:'center', width: '110px'}		
		, {key : 'lesDistm'	            ,title : cflineMsgArray['rentMeter'] /* 임차거리M */		,align:'right', width: '110px', render: {type:"string", rule : "comma"}}		
		, {key : 'lesUmtsoNm'	            ,title : cflineMsgArray['rentUpperMobileTelephoneSwitchingOffice'] /*임차상위국*/			,align:'center', width: '110px'}		
		, {key : 'lesUmtsoAddr'	            ,title : cflineMsgArray['rentUpperMobileTelephoneSwitchingOfficeAddress'] /*임차상위국주소*/			,align:'center', width: '110px'}
		, {key : 'umtsoAddrLnkgDiv'	            ,title : cflineMsgArray['superStationAddressLinkDiv']	 /* 상위국주소연동구분 */ 	,align:'center', width: '160px'}
		, {key : 'lesLmtsoNm'	            ,title : cflineMsgArray['rentLowMobileTelephoneSwitchingOffice']	 /* 임차하위국 */ 	,align:'center', width: '110px'}		
		, {key : 'lesLmtsoAddr'	            ,title : cflineMsgArray['rentLowMobileTelephoneSwitchingOfficeAddress'] /*임차하위국주소*/			,align:'center', width: '110px'}
		, {key : 'lmtsoAddrLnkgDiv'	            ,title : cflineMsgArray['subStationAddressLinkDiv']	 /* 하위국주소연동구분 */ 	,align:'center', width: '160px'}
		, {key : 'lesOpenDtm'	            ,title : cflineMsgArray['lesOpeningDate']  /*임차개통일*/			,align:'center', width: '110px'}		
		, {key : 'fcltsDivCdNm'	            ,title : cflineMsgArray['facilitiesDivision']  /*시설구분*/			,align:'center', width: '110px'}		
		, {key : 'dnrSystmNm'	            ,title : cflineMsgArray['donorSystemName'] /*도너시스템명*/				,align:'center', width: '110px', editable: true}
		, {key : 'erpUmtsoAddr'	            ,title : cflineMsgArray['erpSuperStationAddress'] /*ERP상위국주소*/				,align:'center', width: '110px'}
		, {key : 'erpLmtsoAddr'	            ,title : cflineMsgArray['erpSubStationAddress'] /*ERP하위국주소*/				,align:'center', width: '110px'}
		, {key : 'lineDistm'	            ,title : cflineMsgArray['lineMeter'] /*회선거리M*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'roabDistk'	            ,title : cflineMsgArray['roadbedKilometer'] /*도상거리K*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'otdrDistm'	            ,title : cflineMsgArray['otdrDistm'] /*OTDR거리M*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lastChgUserId'	        ,title : cflineMsgArray['lastChangeUserId'] /*수정ID자*/				,align:'center', width: '160px'}
		, {key : 'frstRegDate'	        ,title : cflineMsgArray['firstRegistrationDate'] /*등록일자*/				,align:'center', width: '110px'}
		, {key : 'frstRegUserId'	        ,title : cflineMsgArray['firstRegistrationUserId'] /*등록자ID*/				,align:'center', width: '160px'}
		, {key : 'lineCoreCnt'	        ,title : cflineMsgArray['lineCoreCount'] /*회선코어수*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'uprIntgFcltsCd'	        ,title : cflineMsgArray['bmtsoIntgFcltsCd1'] /*기지국명통합시설코드1*/			,align:'center', width: '160px'}
		, {key : 'uprIntgFcltsCdNm'	        ,title : cflineMsgArray['mtsoNameOne'] /*기지국명1*/			,align:'center', width: '100px'}
		, {key : 'bmtsIontgFcltsCdTwo'	        ,title : cflineMsgArray['bmtsoIntgFcltsCd2'] /*기지국통합시설코드2*/				,align:'center', width: '160px'}
		, {key : 'bmtsIontgFcltsCdNmTwo'	        ,title : cflineMsgArray['mtsoNameTwo'] /*기지국명2*/				,align:'center', width: '100px'}
		, {key : 'lowIntgFcltsCd'	        ,title : cflineMsgArray['fcltsNumber'] /*시설번호*/			,align:'center', width: '110px'} 
		, {key : 'sisulStatNm'	        ,title : cflineMsgArray['fcltsStatus'] /*시설상태*/			,align:'center', width: '110px'} 
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
	];
	return returnData;
}



//가입자망 회선
var mapping004= function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}  
	var returnData = [{ selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px'}
		, {key : 'ukeyMtsoCd'	      		,title : "UKEY" + cflineMsgArray['mtsoCode'] /*  국사코드 */       		,align:'center', width: '160px'}
		, {key : 'svlnStatCdNm'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px'}
		, {key : 'srvcMgmtNo'	            ,title : cflineMsgArray['serviceManagementNumber'] /*서비스관리번호*/			,align:'center', width: '160px'}
		, {key : 'mgmtGrpCdNm'	    		,title : cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px'}
		, {key : 'lineUsePerdTypCdNm'	        ,title : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/		,align:'center', width: '160px'}
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'lineMgmtGrCdNm'	        ,title : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px'}
		, {key : 'lineDistTypCdNm'	        ,title : cflineMsgArray['lineDistanceType'] /*회선거리유형*/			,align:'center', width: '160px'}
		, {key : 'lineSctnTypCdNm'	        ,title : cflineMsgArray['lineSectionType'] /*회선구간유형*/			,align:'center', width: '160px'}
		, {key : 'chrStatCdNm'	            ,title : cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'svlnNo'	       			 ,title : emClass + cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	];
	return returnData;
}

//기업 회선 (SKB)
var mapping005 = function(gridDiv, showAppltNoYn){
//	console.log("showAppltNoYn=====2========" + showAppltNoYn)
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}  
	var returnData = [{ selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: true}
		, {key : 'scrbSrvcMgmtNo'	        ,title : cflineMsgArray['subscribeServiceManagementNumber'] /*가입서비스관리번호*/         ,align:'center', width: '160px'}
		, {key : 'srvcMgmtNo'	            ,title : cflineMsgArray['serviceManagementNumber'] /*서비스관리번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}
			/*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'sktLineIdVal'	       			 ,title : cflineMsgArray['sktLineNo']	 /* SKT회선번호 */	,align:'center', width: '160px', editable: true}
		, {key : 'ctrtCustNm'	       			 ,title : cflineMsgArray['ctrtCustNm'] /*계약고객명*/			,align:'center', width: '160px', editable: true}
		, {key : 'b2bCustNm'	            ,title : cflineMsgArray['businessToBusinessCustomerName'] /*B2B고객명*/				,align:'center', width: '160px', editable: true}
		, {key : 'rontNtwkLineNo'	            ,title : cflineMsgArray['networkLineNumber'] /*네트워크회선번호*/				,align:'center', width: '130px'}
		, {key : 'rontTrkNm'	            ,title : cflineMsgArray['backboneNetworkTrunk'] /*기간망트렁크*/				,align:'center', width: '110px'}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['rentBusinessMan'] /* 임차사업자 */                 ,align:'left'  , width: '160px'}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCd'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					return  skBb2bSvlnSclCdData;
				}
			},
			editable : {type : 'select',
				rule : function(value, data) {
							return  skBb2bSvlnSclCdData;
						}
			 	, attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'svlnTypCd'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
					var currentData = AlopexGrid.currentData(data);
						if (currentData.svlnSclCd) {
							return render_data = render_data.concat(svlnTypCdListCombo[currentData.svlnSclCd]);
						} else {
							return render_data.concat({value : data.svlnTypCd,text : data.svlnTypCdNm });
						}
				}
			},
			editable : {type : 'select',
				rule : function(value, data) {
							var render_data = [];
							var currentData = AlopexGrid.currentData(data); 
							if ( svlnTypCdListCombo[currentData.svlnSclCd] ){
								return  render_data = render_data.concat( svlnTypCdListCombo[currentData.svlnSclCd] );
							} else {
								return render_data = render_data.concat( {value : '', text : cflineCommMsgArray['none']} );
							}
						}
			 	, attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			},
			refreshBy : 'svlnSclCd'
		}
		, {key : 'lineCapaCd'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnCapaCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnCapaCdList);
						} else {
							return render_data.concat({value : data.lineCapaCd,text : data.lineCapaCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnCapaCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'umtsoLlcfCd'	            ,title : cflineMsgArray['upMtsoLLCF'] /*상위국사LLCF*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.llcfCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.llcfCdList);
						} else {
							return render_data.concat({value : data.umtsoLlcfCd,text : data.umtsoLlcfCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.llcfCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'umtsoNegoCd'	            ,title : cflineMsgArray['upMtsoNego'] /*상위국사NEGO*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.negoCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.negoCdList);
						} else {
							return render_data.concat({value : data.umtsoNegoCd,text : data.umtsoNegoCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.negoCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}	
		}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'lmtsoLlcfCd'	            ,title : cflineMsgArray['lowMtsoLLCF'] /*하위국사LLCF*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.llcfCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.llcfCdList);
						} else {
							return render_data.concat({value : data.lmtsoLlcfCd,text : data.lmtsoLlcfCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.llcfCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lmtsoNegoCd'	            ,title : cflineMsgArray['lowerMtsoNego'] /*하위국사NEGO*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.negoCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.negoCdList);
						} else {
							return render_data.concat({value : data.lmtsoNegoCd,text : data.lmtsoNegoCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.negoCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}	
		}
		, {key : 'mgmtPostCd'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.mgmtPostCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.mgmtPostCdList);
						} else {
							return render_data.concat({value : data.mgmtPostCd,text : data.mgmtPostCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.mgmtPostCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'cdngMeansTypCd'	        ,title : cflineMsgArray['codingMeansType'] /*코딩방식유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.cdngMeansTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.cdngMeansTypCdList);
						} else {
							return render_data.concat({value : data.cdngMeansTypCd,text : data.cdngMeansTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.cdngMeansTypCdList; }
					 , attr : {style : "width: 120px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineMgmtGrCd'	        ,title : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
			
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: true}
		, {key : 'exchrNm'	                ,title : cflineMsgArray['exchangerName'] /*교환기명*/				,align:'center', width: '80px'}
		, {key : 'exchrPortId'	            ,title : cflineMsgArray['exchangerPortId'] /*교환기포트ID*/				,align:'center', width: '160px'}
		, {key : 'coLineVrfYn'	            ,title : cflineMsgArray['mgmtObj'] /*관리대상*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'coLineCostVrfRsnCd'	    ,title : cflineMsgArray['nonObjectReason'] /*비대상사유*/		,align:'center', width: '180px',
		render : {
			type : 'string',
			rule : function(value, data) {
				var render_data = [];
					if (svlnCommCodeData.coLineCostVrfRsnCdList.length > 1) {
						return render_data = render_data.concat(svlnCommCodeData.coLineCostVrfRsnCdList);
					} else {
						return render_data.concat({value : data.coLineCostVrfRsnCd,text : data.coLineCostVrfRsnCdNm });
					}
			}
		},
		editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.coLineCostVrfRsnCdList; }
				 , attr : {style : "width: 140px;min-width:85px;padding: 2px 2px;"}  
		},
		editedValue : function(cell) {
			return $(cell).find('select option').filter(':selected').val(); 
		}
	}
		, {key : 'svlnWorkYn'	          	,title : cflineMsgArray['workYesOrNo'] /*작업여부*/             ,align:'center', width: '110px'}
	 	, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
	 	, {key : 'svlnNo'	       			 ,title : emClass + cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		, {title : cflineMsgArray['attached'] /*첨부*/					,align:'center', width: '130px'
			, render : function(value, data) {
					var celStr = '<button class="Button button2 add_btn" id="btnUpDownFile" type="button">' + cflineMsgArray["upAndDownlold"]/*업/다운로드*/ + '</button>';
					return celStr;}			     
			, hidden:true}
	];
	return returnData;
}

//기업 회선 (SKT)
var mapping001005 = function(gridDiv, hiddenPartYn, showAppltNoYn){
//	console.log("showAppltNoYn======1=======" + showAppltNoYn)
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}  
	var returnData = [{ selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: true}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['lineNo'] /* 회선번호 */				,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}
			/*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'sktLineIdVal'	       			 ,title : cflineMsgArray['sktLineNo']	 /* SKT회선번호 */	,align:'center', width: '160px', editable: true}
		, {key : 'ctrtCustNm'	       			 ,title : cflineMsgArray['ctrtCustNm'] /*계약고객명*/			,align:'center', width: '160px', editable: true}
		, {key : 'b2bCustNm'	            ,title : cflineMsgArray['businessToBusinessCustomerName'] /*B2B고객명*/				,align:'center', width: '160px', editable: true}
		, {key : 'rontNtwkLineNo'	            ,title : cflineMsgArray['networkLineNumber'] /*네트워크회선번호*/				,align:'center', width: '130px'}
		, {key : 'rontTrkNm'	            ,title : cflineMsgArray['backboneNetworkTrunk'] /*기간망트렁크*/				,align:'center', width: '110px'}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['rentBusinessMan'] /* 임차사업자 */                 ,align:'left'  , width: '160px'}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCd'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					return  skTb2bSvlnSclCdData;
				}
			},
			editable : {type : 'select',
				rule : function(value, data) {
							return  skTb2bSvlnSclCdData;
						}
			 	, attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'svlnTypCd'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
					var currentData = AlopexGrid.currentData(data);
						if (currentData.svlnSclCd) {
							return render_data = render_data.concat(svlnTypCdListCombo[currentData.svlnSclCd]);
						} else {
							return render_data.concat({value : data.svlnTypCd,text : data.svlnTypCdNm });
						}
				}
			},
			editable : {type : 'select',
				rule : function(value, data) {
							var render_data = [];
							var currentData = AlopexGrid.currentData(data); 
							if ( svlnTypCdListCombo[currentData.svlnSclCd] ){
								return  render_data = render_data.concat( svlnTypCdListCombo[currentData.svlnSclCd] );
							} else {
								return render_data = render_data.concat( {value : '', text : cflineCommMsgArray['none']} );
							}
						}
			 	, attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			},
			refreshBy : 'svlnSclCd'
		}
		, {key : 'lineCapaCd'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnCapaCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnCapaCdList);
						} else {
							return render_data.concat({value : data.lineCapaCd,text : data.lineCapaCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnCapaCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'faltMgmtObjYn'	        ,title : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'umtsoLlcfCd'	            ,title : cflineMsgArray['upMtsoLLCF'] /*상위국사LLCF*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.llcfCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.llcfCdList);
						} else {
							return render_data.concat({value : data.umtsoLlcfCd,text : data.umtsoLlcfCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.llcfCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'umtsoNegoCd'	            ,title : cflineMsgArray['upMtsoNego'] /*상위국사NEGO*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.negoCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.negoCdList);
						} else {
							return render_data.concat({value : data.umtsoNegoCd,text : data.umtsoNegoCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.negoCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}	
		}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'lmtsoLlcfCd'	            ,title : cflineMsgArray['lowMtsoLLCF'] /*하위국사LLCF*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.llcfCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.llcfCdList);
						} else {
							return render_data.concat({value : data.lmtsoLlcfCd,text : data.lmtsoLlcfCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.llcfCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lmtsoNegoCd'	            ,title : cflineMsgArray['lowerMtsoNego'] /*하위국사NEGO*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.negoCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.negoCdList);
						} else {
							return render_data.concat({value : data.lmtsoNegoCd,text : data.lmtsoNegoCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.negoCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}	
		}
		, {key : 'mgmtPostCd'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.mgmtPostCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.mgmtPostCdList);
						} else {
							return render_data.concat({value : data.mgmtPostCd,text : data.mgmtPostCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.mgmtPostCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'cdngMeansTypCd'	        ,title : cflineMsgArray['codingMeansType'] /*코딩방식유형*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.cdngMeansTypCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.cdngMeansTypCdList);
						} else {
							return render_data.concat({value : data.cdngMeansTypCd,text : data.cdngMeansTypCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.cdngMeansTypCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineMgmtGrCd'	        ,title : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lineMgmtGrCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
			
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: true}
		, {key : 'exchrNm'	                ,title : cflineMsgArray['exchangerName'] /*교환기명*/				,align:'center', width: '80px'}
		, {key : 'exchrPortId'	            ,title : cflineMsgArray['exchangerPortId'] /*교환기포트ID*/				,align:'center', width: '160px'}
		, {key : 'coLineVrfYn'	            ,title : cflineMsgArray['mgmtObj'] /*관리대상*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'svlnWorkYn'	          	,title : cflineMsgArray['workYesOrNo'] /*작업여부*/             ,align:'center', width: '110px'}
	 	, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
	 	, {key : 'svlnNo'	       			 ,title : emClass + cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'scrbSrvcMgmtNo'	        ,title : cflineMsgArray['subscribeServiceManagementNumber'] /*가입서비스관리번호*/         ,align:'center', width: '160px', hidden: hiddenPartYn}
		, {key : 'srvcMgmtNo'	            ,title : cflineMsgArray['serviceManagementNumber'] /*서비스관리번호*/			,align:'center', width: '160px', hidden: hiddenPartYn}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		, {title : cflineMsgArray['attached'] /*첨부*/					,align:'center', width: '130px'
			, render : function(value, data) {
					var celStr = '<button class="Button button2 add_btn" id="btnUpDownFile" type="button">' + cflineMsgArray["upAndDownlold"]/*업/다운로드*/ + '</button>';
					return celStr;}			     
		    , hidden:true}
	];
	return returnData;
}

//기타 회선
var mapping006 =  function(gridDiv, showAppltNoYn){
	
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
		var returnData = [{ selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', editable: true}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}
			/*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'left'  , width: '160px'}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		, {key : 'svlnTypCd'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
					var currentData = AlopexGrid.currentData(data);
						if (currentData.svlnSclCd) {
							return render_data = render_data.concat(svlnTypCdListCombo[currentData.svlnSclCd]);
						} else {
							return render_data.concat({value : data.svlnTypCd,text : data.svlnTypCdNm });
						}
				}
			},
			editable : {type : 'select',
				rule : function(value, data) {
							var render_data = [];
							var currentData = AlopexGrid.currentData(data); 
							if ( svlnTypCdListCombo[currentData.svlnSclCd] ){
								return  render_data = render_data.concat( svlnTypCdListCombo[currentData.svlnSclCd] );
							} else {
								return render_data = render_data.concat( {value : '', text : cflineCommMsgArray['none']} );
							}
						}
			 	, attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			},
			refreshBy : 'svlnSclCd'
		}
		, {key : 'lineCapaCd'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnCapaCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnCapaCdList);
						} else {
							return render_data.concat({value : data.lineCapaCd,text : data.lineCapaCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnCapaCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'faltMgmtObjYn'	        ,title : emClass + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn,text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'uprTeamNm'	      		,title : cflineMsgArray['upperTeam'] /*상위팀*/         		,align:'center', width: '90px'}
		, {key : 'uprMtsoIdNm'	      		,title : emClass + cflineMsgArray['upperMtso'] /*상위국사*/         		,align:'center', width: '110px'}
		, {key : 'lowTeamNm'	      		,title : cflineMsgArray['lowerTeam'] /*하위팀*/         		,align:'center', width: '90px'}
		, {key : 'lowMtsoIdNm' 				,title : emClass + cflineMsgArray['lowerMtso'] /*하위국사*/ 				,align:'center', width: '110px'}
		, {key : 'mgmtPostCd'	            ,title : cflineMsgArray['managementPost'] /*관리포스트*/			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.mgmtPostCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.mgmtPostCdList);
						} else {
							return render_data.concat({value : data.mgmtPostCd,text : data.mgmtPostCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.mgmtPostCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable:true}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable:true}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
	] ;
	return returnData;
}


//기타회선 (구)NITS회선
var mappingNits = function(gridDiv, showAppltNoYn){
	var emClass = '';
	if (gridDiv =='info'){
		emClass = '';
	}else{
		emClass = '<em class="color_red">*</em> ' ;
	}
	var returnData = [ { selectorColumn : true, width : '50px' }
		, {key : 'lineNm'	              	,title : cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '300px', treeColumn:true, treeColumnHeader:false}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '160px'}
		, {key : 'svlnStatCd'	      		,title : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.svlnStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.svlnStatCdList);
						} else {
							return render_data.concat({value : data.svlnStatCd,text : data.svlnStatCdNm });
						}
				}
			}
			/*,editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.svlnStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}*/
		}
		, {key : 'lesTypCd'	       			 ,title : cflineMsgArray['rentType']  /*임차유형 */			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.lesTypeCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.lesTypeCdList);
						} else {
							return render_data.concat({value : data.lesTypeCd,text : data.lesTypeCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.lesTypeCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'srsLineYn'	          	,title : cflineMsgArray['seriousLineYesOrNo'] /*중요회선여부*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.ynList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.ynList);
						} else {
							return render_data.concat({value : data.srsLineYn,text : data.srsLineYnNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.ynList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
		, {key : 'tmofNm'	      		,title : cflineMsgArray['transmissionOffice'] /*전송실*/         		,align:'center', width: '110px'}
		, {key : 'ovpyObjYn'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsObjectYesOrNo']  /* 과오납대상여부 */       		,align:'center', width: '160px'}
		, {key : 'ovpyOccrYm'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsOccuranceYearAndMonth']  /* 과오납발생년월 */     		,align:'center', width: '160px'}
		, {key : 'ovpyRmdySchdDt'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsRemedyScheduleDate'] /* 과오납해소예정일자 */      		,align:'center', width: '160px'}
		, {key : 'ovpyOccrRsnCd'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsOccuranceReason']  /* 과오납발생사유 */    		,align:'center', width: '160px'}
		, {key : 'ovpyRmdyWayCdNm'	      		,title : cflineMsgArray['opaymentsOrOverpaymentsRemedyWay'] /*과오납해소방안*/      		,align:'center', width: '160px'}
		, {key : 'slfNetLinCtt'	      		,title : cflineMsgArray['slfNetLinCtt'] /*자가인입내용*/      		,align:'center', width: '160px', editable: true}
		, {key : 'skAfcoDivCdNm'	      		,title : cflineMsgArray['offerBusinessMan'] /*제공사업자*/        		,align:'center', width: '110px'}
		, {key : 'commBizrNm'	            ,title : cflineMsgArray['rentBusinessMan'] /* 임차사업자 */			,align:'center', width: '110px'}		
		, {key : 'leslNo'	            ,title : cflineMsgArray['leaseLineNumber'] /* 임차회선번호 */			,align:'center', width: '110px'}		
		, {key : 'lesDistm'	            ,title : cflineMsgArray['rentMeter'] /* 임차거리M */		,align:'right', width: '110px', render: {type:"string", rule : "comma"}}		
		, {key : 'lesUmtsoNm'	            ,title : cflineMsgArray['rentUpperMobileTelephoneSwitchingOffice'] /*임차상위국*/			,align:'center', width: '110px'}		
		, {key : 'lesUmtsoAddr'	            ,title : cflineMsgArray['rentUpperMobileTelephoneSwitchingOfficeAddress'] /*임차상위국주소*/			,align:'center', width: '110px'}		
		, {key : 'umtsoAddrLnkgDiv'	            ,title : cflineMsgArray['superStationAddressLinkDiv']	 /* 상위국주소연동구분 */ 	,align:'center', width: '160px'}		
		, {key : 'lesLmtsoNm'	            ,title : cflineMsgArray['rentLowMobileTelephoneSwitchingOffice']	 /* 임차하위국 */ 	,align:'center', width: '110px'}		
		, {key : 'lesLmtsoAddr'	            ,title : cflineMsgArray['rentLowMobileTelephoneSwitchingOfficeAddress'] /*임차하위국주소*/			,align:'center', width: '110px'}
		, {key : 'lmtsoAddrLnkgDiv'	            ,title : cflineMsgArray['subStationAddressLinkDiv']	 /* 하위국주소연동구분 */ 	,align:'center', width: '160px'}
		, {key : 'lesOpenDtm'	            ,title : cflineMsgArray['lesOpeningDate']  /*임차개통일*/			,align:'center', width: '110px'}		
		, {key : 'fcltsDivCdNm'	            ,title : cflineMsgArray['facilitiesDivision']  /*시설구분*/			,align:'center', width: '110px'}		
		, {key : 'dnrSystmNm'	            ,title : cflineMsgArray['donorSystemName'] /*도너시스템명*/				,align:'center', width: '110px', editable: true}
		, {key : 'erpUmtsoAddr'	            ,title : cflineMsgArray['erpSuperStationAddress'] /*ERP상위국주소*/				,align:'center', width: '110px'}
		, {key : 'erpLmtsoAddr'	            ,title : cflineMsgArray['erpSubStationAddress'] /*ERP하위국주소*/				,align:'center', width: '110px'}
		, {key : 'lineDistm'	            ,title : cflineMsgArray['lineMeter'] /*회선거리M*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'roabDistk'	            ,title : cflineMsgArray['roadbedKilometer'] /*도상거리K*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'otdrDistm'	            ,title : cflineMsgArray['otdrDistm'] /*OTDR거리M*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'chrStatCd'	            ,title : emClass + cflineMsgArray['chargingStatus'] /*과금상태*/             ,align:'center', width: '110px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (svlnCommCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(svlnCommCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : {type : 'select',rule : function(value, data) {return svlnCommCodeData.chrStatCdList; }
					 , attr : {style : "width: 85px;min-width:85px;padding: 2px 2px;"}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px', hidden: showAppltNoYn}
		, {key : 'appltDt'	          		,title : cflineMsgArray['applicationDate'] /*청약일자*/				,align:'center', width: '100px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : true
		}	
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lastChgUserId'	        ,title : cflineMsgArray['lastChangeUserId'] /*수정ID자*/				,align:'center', width: '160px'}
		, {key : 'frstRegDate'	        ,title : cflineMsgArray['firstRegistrationDate'] /*등록일자*/				,align:'center', width: '110px'}
		, {key : 'frstRegUserId'	        ,title : cflineMsgArray['firstRegistrationUserId'] /*등록자ID*/				,align:'center', width: '160px'}
		, {key : 'lineCoreCnt'	        ,title : cflineMsgArray['lineCoreCount'] /*회선코어수*/				,align:'right', width: '100px', editable: true, render: {type:"string", rule : "comma"}}
		, {key : 'uprIntgFcltsCd'	        ,title : cflineMsgArray['bmtsoIntgFcltsCd1'] /*기지국명통합시설코드1*/			,align:'center', width: '160px'}
		, {key : 'uprIntgFcltsCdNm'	        ,title : cflineMsgArray['mtsoNameOne'] /*기지국명1*/			,align:'center', width: '100px'}
		, {key : 'bmtsIontgFcltsCdTwo'	        ,title : cflineMsgArray['bmtsoIntgFcltsCd2'] /*기지국통합시설코드2*/				,align:'center', width: '160px'}
		, {key : 'bmtsIontgFcltsCdNmTwo'	        ,title : cflineMsgArray['mtsoNameTwo'] /*기지국명2*/				,align:'center', width: '100px'}
		, {key : 'lowIntgFcltsCd'	        ,title : cflineMsgArray['fcltsNumber'] /*시설번호*/			,align:'center', width: '110px'} 
		, {key : 'sisulStatNm'	        ,title : cflineMsgArray['fcltsStatus'] /*시설상태*/			,align:'center', width: '110px'} 
		, {key : 'sisulEndDt'	        ,title : cflineMsgArray['serviceEndDate'] /*서비스종료일*/			,align:'center', width: '110px'} 
		, {key : 'sisulLineDivNm'	        ,title : cflineMsgArray['lineDivision'] /*회선구분*/			,align:'center', width: '110px'} 
		, {key : 'sisulTrmnSchdDt'	        ,title : cflineMsgArray['terminationScheduleDate'] /*해지예정일자*/			,align:'center', width: '110px'} 
		, {key : 'rmteSystmNm'	        ,title : cflineMsgArray['remoteSystemName'] /*리모트시스템명*/			,align:'center', width: '160px'}
		, {key : 'svlnTypCdNm'	            ,title : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: true}
	] 
	return returnData;
}

