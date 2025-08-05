/**
 * 
 */
var gridLineId = 'lineGrid';
// 그리드에 셋팅될 칼럼 concat으로 배열에 값을 추가해주어 
// 가변 그리드를 만든다. 조회 한후에는 초기화해준다.

//기지국 회선 교환기간  
var mappingLine001 = function(){
	var emClass = '<em class="color_red">*</em> ';
	var returnData = [ { selectorColumn : true, width : '50px' }
	    , {key : 'jobTypeNm'		,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '110px'}
	    , {key : 'jobRequestDt'		,title : cflineMsgArray['lineRequestDay'] /*  회선요청일 */       		,align:'center', width: '110px'
	    	,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
	    	, editable: function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}
			}}
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '250px'
			, editable: function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineNm;
					} else {
						return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}
			}}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '140px'}
		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '140px'}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineUsePerdTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineUsePerdTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
						};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		
//		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}

		, {key : 'svlnTypCd'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
					var currentData = AlopexGrid.currentData(data);
						if (svlnTypCdListCombo[currentData.svlnSclCd]) {
							return render_data = render_data.concat(svlnTypCdListCombo[currentData.svlnSclCd]);
						} else {
							return render_data.concat({value : '', text : cflineCommMsgArray['none']});
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.svlnTypCdNm;
					} else {
						return {type : 'select',
							rule : function(value, data) {
								var render_data = [];
								var currentData = AlopexGrid.currentData(data); 
								if ( svlnTypCdListCombo[currentData.svlnSclCd] ){
									return  render_data = render_data.concat( svlnTypCdListCombo[currentData.svlnSclCd] );
								} else {
									return render_data = render_data.concat( {value : data.svlnTypCd,text : data.svlnTypCdNm } );
								}
							}
				 	, attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
						};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			},
			refreshBy : 'svlnSclCd'
		}
//		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px'}

		, {key : 'lineCapaCd'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.svlnCapaCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.svlnCapaCdList);
						} else {
							return render_data.concat({value : data.lineCapaCd,text : data.lineCapaCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineCapaCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.svlnCapaCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
						};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}				
		, {key : 'ogMscId'	      		,title : "OG_MSC_ID"        		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.ogMscId;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'ogMp'	      		,title : "OG_MP"          		,align:'center', width: '80px'}
		, {key : 'ogPp'	      		,title : "OG_PP"          		,align:'center', width: '80px'}
		, {key : 'ogCard'	      		,title : "OG_CARD"         		,align:'center', width: '80px'}
		, {key : 'ogLink'	      		,title : "OG_LINK"         		,align:'center', width: '80px'}
		, {key : 'ogTieOne'	      		,title : "OG_TIE1"         		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.ogTieOne;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'ogTieTwo'	      		,title : "OG_TIE2"         		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.ogTieTwo;
				} else {
					true;
				}}}
		, {key : 'icMscId'	      		,title : "IC_MSC_ID"         		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.icMscId;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'icMp'	      		,title : "IC_MP"         		,align:'center', width: '80px'}
		, {key : 'icPp'	      		,title : "IC_PP"         		,align:'center', width: '80px'}
		, {key : 'icCard'	      		,title : "IC_CARD"         		,align:'center', width: '80px'}
		, {key : 'icLink'	      		,title : "IC_LINK"         		,align:'center', width: '80px'}
		, {key : 'icTieOne'	      		,title : "IC_TIE1"         		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.icTieOne;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'icTieTwo'	      		,title : "IC_TIE2"         		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.icTieTwo;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmEqpIdNm;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmPortIdNm;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmPortChnlVal;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'faltMgmtObjYn'	        ,title : emClass + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.faltMgmtObjYnNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"} 
						};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
						return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}
		}	
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.ogicCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ogicCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
						};
					}  
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
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineDistTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineDistTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}   
						};
					} 
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
						if (cmCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineSctnTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineSctnTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}    
						};
					}
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
						if (cmCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.chrStatCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.chrStatCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
						};
					} 
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
						if (cmCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineMgmtGrCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineMgmtGrCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
						};
					}
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'rtLnoCtt'	            ,title : cflineMsgArray['rtLnoContent'] /*RT선번내용1*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rtLnoCtt;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px'
			, editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineRmkOne;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px'
			, editable: function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineRmkTwo;
					} else {
						return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px'
			, editable: function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineRmkThree;
					} else {
						return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.srsLineYnNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}  
						};
					}
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
var mappingLine002 = function( ){
	var emClass = '<em class="color_red">*</em> ';
	var returnData =  [ { selectorColumn : true, width : '50px' }
	    , {key : 'jobTypeNm'		,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '110px'}
	    , {key : 'jobRequestDt'		,title : cflineMsgArray['lineRequestDay'] /*  회선요청일 */       		,align:'center', width: '110px'
	    	,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
	    	, editable: function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}}
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '250px'
			, editable: function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineNm;
					} else {
						return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '140px'}
		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '140px'}
		, {key : 'leslNo'	              	,title : cflineMsgArray['leaseLineNumber'] /*  임차회선번호 */                 ,align:'left'  , width: '160px'}
		, {key : 'commBizrNm'	              	,title : cflineMsgArray['businessMan'] /* 사업자 */                 ,align:'center'  , width: '160px'}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineUsePerdTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineUsePerdTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		
//		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}
//		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px'}

		, {key : 'svlnTypCd'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
					var currentData = AlopexGrid.currentData(data);
						if (svlnTypCombo[currentData.svlnSclCd]) {
							return render_data = render_data.concat(svlnTypCombo[currentData.svlnSclCd]);
						} else {
							return render_data.concat({value : '', text : cflineCommMsgArray['none']});
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.svlnTypCdNm;
					} else {
						return {type : 'select',
							rule : function(value, data) {
								var render_data = [];
								var currentData = AlopexGrid.currentData(data); 
								if ( svlnTypCombo[currentData.svlnSclCd] ){
									return  render_data = render_data.concat( svlnTypCombo[currentData.svlnSclCd] );
								} else {
									return render_data = render_data.concat( {value : data.svlnTypCd,text : data.svlnTypCdNm } );
								}
							}
				 	, attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			},
			refreshBy : 'svlnSclCd'
		}
		, {key : 'lineCapaCd'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.svlnCapaCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.svlnCapaCdList);
						} else {
							return render_data.concat({value : data.lineCapaCd,text : data.lineCapaCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineCapaCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.svlnCapaCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}		
		, {key : 'mscId'	      		,title : "MSC_ID"          		,align:'center', width: '80px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.mscId;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'bscId'	      		,title : "BSC_ID"          		,align:'center', width: '80px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.bscId;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'bts'	      		,title : "BTS"          		,align:'center', width: '80px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.bts;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'cinu'	      		,title : "CINU(M)"          		,align:'center', width: '80px'}
		, {key : 'aep'	      		,title : "AEP(M)"          		,align:'center', width: '80px'}
		, {key : 'portNo'	      		,title : "PORT_NO"          		,align:'center', width: '80px'}
		, {key : 'bip'	      		,title : "BIP"          		,align:'center', width: '80px'}
		, {key : 'bipP'	      		,title : "BIP_P"          		,align:'center', width: '80px'}
		, {key : 'btsId'	      		,title : "BTS_ID"          		,align:'center', width: '80px'}
		, {key : 'cuid'	      		,title : "CUID(M)"          		,align:'center', width: '80px'}
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
		, {key : 'tieOne'	            ,title : "TIE1"			,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.tieOne;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'tieTwo'	            ,title : "TIE2"			,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.tieTwo;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmEqpIdNm;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmPortIdNm;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmPortChnlVal;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'faltMgmtObjYn'	        ,title : emClass + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.ynList.length > 1) {
							return render_data = render_data.concat(cmCodeData.ynList);
						} else {
							return render_data.concat({value : data.faltMgmtObjYn, text : data.faltMgmtObjYnNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return data.faltMgmtObjYnNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
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
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineDistTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineDistTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
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
						if (cmCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineSctnTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineSctnTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
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
						if (cmCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.chrStatCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.chrStatCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
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
						if (cmCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineMgmtGrCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineMgmtGrCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'rtLnoCtt'	            ,title : cflineMsgArray['rtLnoContent'] /*RT선번내용1*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rtLnoCtt;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineRmkOne;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineRmkTwo;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineRmkThree;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.srsLineYnNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
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
var mappingLine003 = function(){
	var emClass = '<em class="color_red">*</em> ';
	var returnData = [ { selectorColumn : true, width : '50px' }
	    , {key : 'jobTypeNm'		,title : cflineMsgArray['workType'] /*  작업유형 */       		,align:'center', width: '110px'}
	    , {key : 'jobRequestDt'		,title : cflineMsgArray['lineRequestDay'] /*  회선요청일 */       		,align:'center', width: '110px'
	    	,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
	    	, editable: function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}}
		, {key : 'lineNm'	              	,title : emClass + cflineMsgArray['lnNm'] /*  회선명 */                 ,align:'left'  , width: '250px'
			, editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineNm;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'svlnNo'	       			 ,title : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/			,align:'center', width: '140px'}
		, {key : 'svlnStatCdNm'	      		,title : emClass + cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */       		,align:'center', width: '140px'}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineUsePerdTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineUsePerdTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'mgmtGrpCdNm'	    		,title : emClass + cflineMsgArray['managementGroup'] /*  관리그룹 */               	,align:'center', width: '90px'}	
		, {key : 'svlnLclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineLcl'] /*  서비스회선 대분류 */			,align:'center', width: '160px'}
		, {key : 'svlnSclCdNm'	            ,title : emClass + cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */			,align:'center', width: '160px'}
		
//		, {key : 'svlnTypCdNm'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px'}


		, {key : 'svlnTypCd'	            ,title : emClass + cflineMsgArray['serviceLineType'] /*  서비스회선유형 */			,align:'center', width: '130px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
					var currentData = AlopexGrid.currentData(data);
						if (svlnTypCdListCombo[currentData.svlnSclCd]) {
							return render_data = render_data.concat(svlnTypCdListCombo[currentData.svlnSclCd]);
						} else {
							return render_data.concat({value : '', text : cflineCommMsgArray['none']});
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.svlnTypCdNm;
					} else {
						return {type : 'select',
							rule : function(value, data) {
								var render_data = [];
								var currentData = AlopexGrid.currentData(data); 
								if ( svlnTypCdListCombo[currentData.svlnSclCd] ){
									return  render_data = render_data.concat( svlnTypCdListCombo[currentData.svlnSclCd] );
								} else {
									return render_data = render_data.concat( {value : data.svlnTypCd,text : data.svlnTypCdNm } );
								}
							}
				 	, attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"} };
					} 
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			},
			refreshBy : 'svlnSclCd'
		}
//		, {key : 'lineCapaCdNm'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '90px'}

		, {key : 'lineCapaCd'	      		,title : emClass + cflineMsgArray['lineCapacity'] /*회선용량*/         		,align:'center', width: '100px',
			render : {
				type : 'string',
				rule : function(value, data) {
					var render_data = [];
						if (cmCodeData.svlnCapaCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.svlnCapaCdList);
						} else {
							return render_data.concat({value : data.lineCapaCd,text : data.lineCapaCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineCapaCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.svlnCapaCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}				
		, {key : 'ogMscId'	      		,title : "MSC_ID"        		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.ogMscId;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'ogMp'	      		,title : "MP"          		,align:'center', width: '80px'}
		, {key : 'ogPp'	      		,title : "PP"          		,align:'center', width: '80px'}
		, {key : 'ogCard'	      		,title : "CARD"         		,align:'center', width: '80px'}
		, {key : 'ogLink'	      		,title : "LINK"         		,align:'center', width: '80px'}
		, {key : 'ogTieOne'	      		,title : "TIE1"         		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.ogTieOne;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'ogTieTwo'	      		,title : "TIE2"         		,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.ogTieTwo;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'tieMatchYn'	      		,title : cflineMsgArray['tieAccord'] /*  TIE일치 */         		,align:'center', width: '110px'}
		, {key : 'rnmEqpId'	      		,title : cflineMsgArray['rmEquipmentId']  /*  RM장비ID */    ,align:'center', width: '80px', hidden: true}
		, {key : 'rnmEqpIdNm'	      	,title : cflineMsgArray['rmEquipmentNm']  /*  RM장비명 */     ,align:'center', width: '120px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmEqpIdNm;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'rnmPortId'	      	,title : cflineMsgArray['rmPortId']  /*  RM포트ID */        	,align:'center', width: '80px', hidden: true}
		, {key : 'rnmPortIdNm'	      	,title : cflineMsgArray['rmPortNm']  /*  RM포트명 */        	,align:'center', width: '100px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmPortIdNm;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'rnmPortChnlVal'	    ,title : cflineMsgArray['rmChannelName']  /*  RM채널명 */     	,align:'center', width: '80px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rnmPortChnlVal;
				} else {
					return { type: 'text' , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'faltMgmtObjYn'	        ,title : emClass + cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/			,align:'center', width: '160px',
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.faltMgmtObjYnNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
		}
		, {key : 'lineOpenDt'	        	,title : cflineMsgArray['lineOpeningDate'] /*회선개통일자*/             ,align:'center', width: '110px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}
		}
		, {key : 'lastChgDate'	        ,title : cflineMsgArray['lastChangeDate'] /*수정일자*/				,align:'center', width: '110px'}
		, {key : 'lineAppltNo'	            ,title : cflineMsgArray['applicationNumber']  /*청약번호*/                       ,align:'center', width: '130px'}
		, {key : 'lineTrmnSchdDt'	          	,title : cflineMsgArray['lineTerminationScheduleDate'] /*회선해지예정일자*/             ,align:'center', width: '160px'
			,  render : function(value, data) { return (value == "" ? "YYYYMM" : value); }
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}
		}	
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.ogicCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ogicCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
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
			,  editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return value;
					} else {
						return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineDistTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineDistTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
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
						if (cmCodeData.lineSctnTypCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineSctnTypCdList);
						} else {
							return render_data.concat({value : data.lineSctnTypCd,text : data.lineSctnTypCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineSctnTypCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineSctnTypCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					} 
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
						if (cmCodeData.chrStatCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.chrStatCdList);
						} else {
							return render_data.concat({value : data.chrStatCd,text : data.chrStatCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.chrStatCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.chrStatCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
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
						if (cmCodeData.lineMgmtGrCdList.length > 1) {
							return render_data = render_data.concat(cmCodeData.lineMgmtGrCdList);
						} else {
							return render_data.concat({value : data.lineMgmtGrCd,text : data.lineMgmtGrCdNm });
						}
				}
			},
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.lineMgmtGrCdNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.lineMgmtGrCdList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val(); 
			}
		}
		, {key : 'rtLnoCtt'	            ,title : cflineMsgArray['rtLnoContent'] /*RT선번내용1*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.rtLnoCtt;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkOne'	            ,title : cflineMsgArray['lineRemark1'] /*회선비고1*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineRmkOne;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkTwo'	            ,title : cflineMsgArray['lineRemark2'] /*회선비고2*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineRmkTwo;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
		, {key : 'lineRmkThree'	            ,title : cflineMsgArray['lineRemark3'] /*회선비고3*/				,align:'center', width: '200px', editable: function(value, data) {
		      var currentData = AlopexGrid.currentData(data);
				if (currentData.jobType=="3") {
					return currentData.lineRmkThree;
				} else {
					return {type : 'text', attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
				}}}
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
			editable : function(value, data) {
			      var currentData = AlopexGrid.currentData(data);
					if (currentData.jobType=="3") {
						return currentData.srsLineYnNm;
					} else {
						return {type : 'select',rule : function(value, data) {return cmCodeData.ynList; }
						 , attr : {style : "width: 90%;min-width:90%;padding: 2px 2px;"}};
					}  
			},
			editedValue : function(cell) {
				return $(cell).find('select option').filter(':selected').val();
			}
	 	}
		, {key : 'lnkgLineIdVal'	            ,title : cflineMsgArray['teamsLineNo'] /*TEAMS 회선번호*/				,align:'center', width: '160px'}
	] ; 
	return returnData;
}

