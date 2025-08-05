/**
 * EngFrontHaulLkup.js
 *
 * @author 이상억
 * @date 2023. 7. 18
 * @version 1.0
 */

$a.page(function() {
   	var perPage1 		= 100;
   	var perPage2 		= 100;
	var perPage3 		= 100;
   	var fileOnDemendName = "";

	var gridTab1 		= 'gridTab1';
	var gridTab2 		= 'gridTab2';
	var gridTab3 		= 'gridTab3';

	var mTagetIdx 		= 1;
	var mTargetGrid 		= gridTab1;

    this.init = function(id, param) {

    	initGrid();
    	setSelectCode();
    	setEventListener();
    };

    function initGrid(){

    	var schDivCdValMux = $('input:radio[name=schDivCdMux]:checked').val();
    	var schDivCdValPon = $('input:radio[name=schDivCdPon]:checked').val();
    	var schDivCdValRgMux = $('input:radio[name=schDivCdRgMux]:checked').val();
    	var headerN, mappingN, renderMappingN, groupingN, headerRowHeightN;

    	renderMappingN =  {
									"bhRingLkupIcon" :{
										renderer : function(value, data, render, mapping) {
											var currentData = AlopexGrid.currentData(data);
											return "<span class='Icon Search' style='cursor: pointer'></span>";
										}
									},
									"bhLineLkupIcon" :{
										renderer : function(value, data, render, mapping) {
											var currentData = AlopexGrid.currentData(data);
											return "<span class='Icon Search' style='cursor: pointer'></span>";
										}
									},
									"fhRingLkupIcon" :{
										renderer : function(value, data, render, mapping) {
											var currentData = AlopexGrid.currentData(data);
											return "<span class='Icon Search' style='cursor: pointer'></span>";
										}
									},
									"fhLineLkupIcon" :{
										renderer : function(value, data, render, mapping) {
											var currentData = AlopexGrid.currentData(data);
											return "<span class='Icon Search' style='cursor: pointer'></span>";
										}
									}
								};

    	if(mTagetIdx == 1
    			&& mTargetGrid == "gridTab1"
    			&& schDivCdValMux == "ETE") {
    		headerN = [
    	               { fromIndex:5, toIndex:12, title:"백홀 정보"},
    	               { fromIndex:13, toIndex:26, title:"프론트홀 정보"}
    	              ];
    		groupingN = {
							useGrouping: true,
							by: ["hdofcOrgNm", "teamOrgNm", "tmofNm", "fhNetDivNm", "cotBpNm"
							     , "bkhlNtwkLineNm", "bkhlNtwkLineNo", "bhRingLkupIcon", "ivcEqpNm", "ivrEqpNm", "bkhlSvlnNm", "bkhlSvlnNo", "bhLineLkupIcon"
							     , "bmtsoEqpNm","bmtsoIntgFcltsCd", "fhNtwkLineNm", "fhNtwkLineNo", "fhRingLkupIcon", "cotEqpNm", "rtEqpNm"
							    ],
							useGroupRowspan: true,
							useGroupRearrange: true,
							groupRowspanMode : 1
						};
    		mappingN = [
    		            //기본정보
						{ key : "hdofcOrgNm", align : "left", title : "본부", width : "70px", rowspan:true},
						{ key : "teamOrgNm", align : "left", title : "팀", width : "90px", rowspan:true},
						{ key : "tmofNm", align : "left", title : "전송실", width : "140px", rowspan:true},
    	                { key : "fhNetDivNm", align:"left", title : "5GMUX 구분", width: "90px", rowspan:true},
    	                { key : "cotBpNm", align : "left", title : "제조사", width : "70px", rowspan:true},
    	                //백홀정보
    	                { key : "bkhlNtwkLineNm", align :"left", title : "링명", width: "170px" , rowspan:true},
    	                { key : "bkhlNtwkLineNo", align :"left", title : "링ID", width: "110px" , rowspan:true},
    	                { key : "bhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
    	                	, render  : function(value, data, render, mapping){
    	                				if( "" != data.bkhlNtwkLineNo && data.bkhlNtwkLineNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
    	                				}
    	                },
    	                { key : "ivcEqpNm", align:"left", title : "IVC/IBC 장비명", width: "170px" , rowspan:true},
    	                { key : "ivrEqpNm", align:"left", title : "IVR/IBR 장비명", width: "170px" , rowspan:true},
    	                { key : "bkhlSvlnNm", align:"left", title : "서비스회선명", width: "170px" , rowspan:true},
    	                { key : "bkhlSvlnNo", align:"left", title : "서비스회선번호", width: "110px" , rowspan:true},
    	                { key : "bhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.bkhlSvlnNo && data.bkhlSvlnNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
    	                },
    	                //프론트홀 정보
    	                { key : "bmtsoEqpNm", align:"left", title : "기지국장비명", width: "200px" , rowspan:true},
    	                { key : "bmtsoIntgFcltsCd", align:"center", title : "기지국 통합시설코드", width: "160px" , rowspan:true},
    	                { key : "fhNtwkLineNm", align:"left", title : "링명", width: "200px" , rowspan:true},
    	                { key : "fhNtwkLineNo", align:"left", title : "링ID", width: "110px" , rowspan:true},
    	                { key : "fhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhNtwkLineNo && data.fhNtwkLineNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },
    	                { key : "cotEqpNm", align:"left", title : "5G-MUX COT 장비명", width: "200px" , rowspan:true},
    	                { key : "rtEqpNm", align:"left", title : "5G-MUX RT 장비명", width: "200px" , rowspan:true},
    	                { key : "rpetrEqpNm", align:"left", title : "중계기 장비명", width: "200px" },
    	                { key : "rpetrIntgFcltsCd", align:"center", title : "중계기 통합시설코드", width: "160px" },
    	                { key : "onsHdofcNm", align:"center", title : "ONS본부", width: "160px" },
    	                { key : "onsTeamNm", align:"center", title : "ONS팀", width: "160px" },
    	                { key : "fhSvlnNm", align:"left", title : "서비스회선명", width: "200px" },
    	                { key : "fhSvlnNo", align:"left", title : "서비스회선번호", width: "110px" },
    	                { key : "fhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhSvlnNo && data.fhSvlnNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },

    	                { key : "creYm", align : "center", title : "생성년월", width : "130px", rowspan:true, hidden: true},
    	                { key : "mthStdWkDgr", align : "center", title : "월기준주차수", width : "130px", rowspan:true, hidden: true},
    	                { key : "hdofcOrgId", align : "center", title : "본부조직ID", width : "130px", rowspan:true, hidden: true},
    	                { key : "teamOrgId", align : "center", title : "팀조직ID", width : "130px", rowspan:true, hidden: true},
    	                { key : "tmofId", align : "center", title : "전송실ID", width : "130px", rowspan:true, hidden: true},
    	                { key : "cotBpId", align:"center", title : "COT협력업체ID", width: "100px", rowspan:true, hidden: true}
    	               ];

    	}else if(mTagetIdx == 1
    			&& mTargetGrid == "gridTab1"
            	&& schDivCdValMux == "DTL") {
    		headerN = [
    	               {fromIndex:0, toIndex:25, title:"5G-MUX E-T-E선번 정보"},
    	               {fromIndex:26, toIndex:30, title:"기지국 정보"},
    	               {fromIndex:31, toIndex:45, title:"프론트홀 COT 정보"},
    	               {fromIndex:46, toIndex:60, title:"프론트홀 RT 정보"},
    	               {fromIndex:61, toIndex:67, title:"중계기 정보"},
    	              ];
    		headerRowHeightN = [32, 60];
    		mappingN = [
    		            //5G-MUX E-T-E 선반 정보[0 - 25]
						{ key : "creYm", title : "생성년월", align : "center", width : "130px", hidden: true},
						{ key : "mthStdWkDgr", title : "월기준주차수", align : "center", width : "130px", hidden: true},
						{ key : "hdofcOrgId", title : "본부조직ID", align : "center", width : "130px", hidden: true},
						{ key : "hdofcOrgNm", title : "본부", align : "center", width : "70px"},
						{ key : "teamOrgId", title : "팀조직ID", align : "center", width : "110px", hidden: true},
						{ key : "teamOrgNm", title : "팀", align : "center", width : "90px"},
						{ key : "tmofId", title : "전송실ID", align : "center", width : "140px", hidden: true},
						{ key : "tmofNm", title : "전송실", align : "center", width : "140px"},
						{ key : "fhNetDivNm", title : "5GMUX 구분", align : "center", width : "90px"},
						{ key : "cotBpNm", title : "제조사", align : "center", width : "90px"},
						{ key : "dplxgDivCd", title : "이중화구분코드", align : "center", width : "100px", hidden: true},
						{ key : "dplxgDivCdNm", title : "이중화 구분", align : "center", width : "90px"},
						{ key : "extsPortUseYn", title : "확장포트사용여부", align : "center", width : "90px", hidden: true},
						{ key : "extsPortUseYnNm", title : "EXT 포트<br>사용여부", align : "center", width : "90px"},
						{ key : "chnlPortOpCnt", title : "Ch 운용현황", align : "right", width : "90px"},
						{ key : "rtPortNm", title : "RT 포트명", align : "center", width : "90px"},
						{ key : "fhSvlnNo", title : "E-T-E 광코어 회선번호<br>(Short Path기준)", align : "center", width : "140px"},
						 { key : "fhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhSvlnNo && data.fhSvlnNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },
						{ key : "fhSvlnNm", title : "회선명", align : "center", width : "230px"},
						{ key : "cotMinLineDistm", title : "회선길이(M)<br>(Short Path기준)", align : "right", width : "130px", render: {type:"string", rule : "comma"}},
						{ key : "optlShreDivVal", title : "광공유 구분", align : "center", width : "90px"},
						{ key : "spsbMtsoSameYn", title : "상하위국사동일여부", align : "center", width : "130px", hidden: true},
						{ key : "spsbMtsoSameSmtsoVal", title : "5G/LTE<br>모자국 동일<br>국소 여부", align : "center", width : "130px", height: "200px"},
						{ key : "fhNtwkLineNm", title : "링명", align : "left", width : "230px"},
						{ key : "fhNtwkLineNo", title : "링ID", align : "center", width : "110px"},
						{ key : "fhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhNtwkLineNo && data.fhNtwkLineNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },
						//기지국 정보[26 - 30]
						{ key : "bmtsoEqpId", title : "기지국장비ID", align : "center", width : "130px", hidden: true},
						{ key : "bmtsoEqpNm", title : "기지국 장비명", align : "center", width : "200px"},
						{ key : "bmtsoIntgFcltsCd", title : "기지국 통합시설코드", align : "center", width : "160px"},
						{ key : "bmtsoMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "bmtsoMtsoId", title : "국사ID", align : "center", width : "110px"},
						//프론트홀 COT 정보[31 - 45]
						{ key : "cotEqpId", title : "COT장비ID", align : "center", width : "130px", hidden: true},
						{ key : "cotEqpNm", title : "5G-MUX COT 장비명", align : "left", width : "200px"},
						{ key : "cotMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "cotBldCd", title : "건물코드", align : "center", width : "110px"},
						{ key : "cotSiteCd", title : "사이트키", align : "center", width : "130px"},
						{ key : "cotSiteNm", title : "COT 사이트명", align : "center", width : "130px", hidden: true},
						{ key : "cotMtsoId", title : "국사ID", align : "center", width : "110px"},
						{ key : "cotBldAddr", title : "건물주소", align : "center", width : "200px"},
						{ key : "cotBldNm", title : "COT 건물명", align : "center", width : "130px", hidden: true},
						{ key : "cotMtsoLatVal", title : "위도", align : "right", width : "80px"},
						{ key : "cotMtsoLngVal", title : "경도", align : "right", width : "80px"},
						{ key : "cotSwingMtsoCd", title : "COT SWING<br>국사코드", align : "center", width : "90px", headerStyleclass: "yellow"},
						{ key : "cotSwingBldCd", title : "COT SWING<br>건물코드", align : "center", width : "110px", headerStyleclass: "yellow"},
						{ key : "cotSwingBldNm", title : "COT SWING<br>건물명", align : "center", width : "130px", headerStyleclass: "yellow"},
						{ key : "cotSwingBldAddr", title : "COT SWING<br>건물주소", align : "center", width : "180px", headerStyleclass: "yellow"},
						//프론트홀 RT 정보[46 - 60]
						{ key : "rtEqpId", title : "RT장비ID", align : "center", width : "130px", hidden: true},
						{ key : "rtEqpNm", title : "5G-MUX RT장비명", align : "center", width : "200px"},
						{ key : "rtMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "rtBldCd", title : "건물코드", align : "center", width : "110px"},
						{ key : "rtBldNm", title : "RT건물명", align : "center", width : "130px", hidden: true},
						{ key : "rtSiteCd", title : "사이트키", align : "center", width : "130px"},
						{ key : "rtSiteNm", title : "RT사이트명", align : "center", width : "130px", hidden: true},
						{ key : "rtMtsoId", title : "국사ID", align : "center", width : "110px"},
						{ key : "rtBldAddr", title : "주소", align : "center", width : "200px"},
						{ key : "rtMtsoLatVal", title : "위도", align : "right", width : "100px"},
						{ key : "rtMtsoLngVal", title : "경도", align : "right", width : "100px"},
						{ key : "rtSwingMtsoCd", title : "RT SWING<br>국사코드", align : "center", width : "90px", headerStyleclass: "yellow"},
						{ key : "rtSwingBldCd", title : "RT SWING<br>건물코드", align : "center", width : "110px", headerStyleclass: "yellow"},
						{ key : "rtSwingBldNm", title : "RT SWING<br>건물명", align : "center", width : "130px", headerStyleclass: "yellow"},
						{ key : "rtSwingBldAddr", title : "RT SWING<br>건물주소", align : "center", width : "180px", headerStyleclass: "yellow"},
						//중계기 정보[61 - 67]
						{ key : "rpetrEqpNm", title : "중계기 장비명", align : "left", width : "200px"},
						{ key : "rpetrIntgFcltsCd", title : "중계기 통합시설코드", align : "center", width : "160px"},
						{ key : "rpetrEqpTypNm", title : "중계기 타입", align : "center", width : "100px"},
						{ key : "rpetrMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "rpetrMtsoId", title : "국사ID", align : "center", width : "110px"},
						{ key : "onsHdofcNm", align:"center", title : "ONS본부", width: "160px" },
    	                { key : "onsTeamNm", align:"center", title : "ONS팀", width: "160px" },

						{ key : "rpetrEqpId", title : "중계기장비ID", align : "center", width : "130px", hidden: true},
						{ key : "cotBpId", title : "COT협력업체ID", align : "center", width : "130px", hidden: true},
						{ key : "bmtsoSiteCd", title : "기지국사이트코드", align : "center", width : "130px", hidden: true},
						{ key : "bmtsoSiteNm", title : "기지국사이트명", align : "center", width : "130px", hidden: true},
						{ key : "bkhlSvlnNo", title : "백홀서비스회선번호", align : "center", width : "130px", hidden: true},
						{ key : "bkhlSvlnNm", title : "백홀서비스회선명", align : "center", width : "130px", hidden: true},
						{ key : "bkhlNtwkLineNo", title : "백홀네트워크회선번호", align : "center", width : "130px", hidden: true},
						{ key : "bkhlNtwkLineNm", title : "백홀네트워크회선명", align : "center", width : "130px", hidden: true},
						{ key : "ivcEqpId", title : "IVC장비ID", align : "center", width : "130px", hidden: true},
						{ key : "ivcEqpNm", title : "IVC장비명", align : "center", width : "130px", hidden: true},
						{ key : "ivrEqpId", title : "IVR장비ID", align : "center", width : "130px", hidden: true},
						{ key : "ivrEqpNm", title : "IVR장비명", align : "center", width : "130px", hidden: true},
						{ key : "rpetrSiteCd", title : "중계기사이트코드", align : "center", width : "130px", hidden: true},
						{ key : "rpetrSiteNm", title : "중계기사이트명", align : "center", width : "130px", hidden: true},
						{ key : "eteTotDistm", title : "ETE총거리M", align : "center", width : "130px", hidden: true, render: {type:"string", rule : "comma"}},
						{ key : "frstRegDate", title : "최초등록일자D", align : "center", width : "130px", hidden : true},
						{ key : "frstRegUserId", title : "최초등록사용자ID", align : "center", width : "130px", hidden : true},
						{ key : "lastChgDate", title : "최종변경일자D", align : "center", width : "130px", hidden : true},
						{ key : "lastChgUserId", title : "최종변경사용자ID", align : "center", width : "130px", hidden : true}
    	               ];
    	}else if(mTagetIdx == 2
    			&& mTargetGrid == "gridTab2"
    			&& schDivCdValPon == "ETE") {
        		headerN = [
        	               {fromIndex:5, toIndex:12, title:"백홀 정보"},
        	               {fromIndex:13, toIndex:27, title:"프론트홀 정보"}
        	              ];
        		groupingN = {
					useGrouping: true,
					by: ["hdofcOrgNm", "teamOrgNm", "tmofNm", "fhNetDivNm", "cotBpNm"
					     , "bkhlNtwkLineNm", "bkhlNtwkLineNo", "bhRingLkupIcon", "ivcEqpNm", "ivrEqpNm", "bkhlSvlnNm", "bkhlSvlnNo", "bhLineLkupIcon"
					     , "bmtsoEqpNm","bmtsoIntgFcltsCd", "fhNtwkLineNm", "fhNtwkLineNo", "fhRingLkupIcon", "cotEqpNm", "mrnEqpNm", "crnEqpNm"
					    ],
					useGroupRowspan: true,
					useGroupRearrange: true,
					groupRowspanMode : 1
				};
        		mappingN = [
        	                { key : "hdofcOrgNm", align : "left", title : "본부", width : "70px", rowspan:true},
    						{ key : "teamOrgNm", align : "left", title : "팀", width : "90px", rowspan:true},
    						{ key : "tmofNm", align : "left", title : "전송실", width : "140px", rowspan:true},
        	                { key : "fhNetDivNm", align:"left", title : "5GMUX 구분", width: "90px", rowspan:true},
        	                { key : "cotBpNm", align : "left", title : "제조사", width : "70px", rowspan:true},
        	                //백홀정보
        	                { key : "bkhlNtwkLineNm", align:"left", title : "링명", width: "170px" ,rowspan:true},
        	                { key : "bkhlNtwkLineNo", align:"left", title : "링ID", width: "110px" ,rowspan:true},
        	                { key : "bhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
        	                	, render  : function(value, data, render, mapping){
        	                					if( "" != data.bkhlNtwkLineNo && data.bkhlNtwkLineNo != undefined){
													return "<span class='Icon Search' style='cursor: pointer'></span>";
												}
				    	                	}
				            },
        	                { key : "ivcEqpNm", align:"left", title : "IVC/IBC 장비명", width: "170px" ,rowspan:true},
        	                { key : "ivrEqpNm", align:"left", title : "IVR/IBR 장비명", width: "170px" ,rowspan:true},
        	                { key : "bkhlSvlnNm", align:"left", title : "서비스회선명", width: "170px" ,rowspan:true},
        	                { key : "bkhlSvlnNo", align:"left", title : "서비스회선번호", width: "110px" ,rowspan:true},
        	                { key : "bhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
        	                	, render  : function(value, data, render, mapping){
        	                					if( "" != data.bkhlSvlnNo && data.bkhlSvlnNo != undefined){
													return "<span class='Icon Search' style='cursor: pointer'></span>";
												}
				    	                	}
				            },
        	                //프론트홀 정보
        	                { key : "bmtsoEqpNm", align:"left", title : "기지국장비명", width: "200px" ,rowspan:true},
        	                { key : "bmtsoIntgFcltsCd", align:"center", title : "기지국 통합시설코드", width: "160px" ,rowspan:true},
        	                { key : "fhNtwkLineNm", align:"left", title : "링명", width: "200px" ,rowspan:true},
        	                { key : "fhNtwkLineNo", align:"left", title : "링ID", width: "110px" ,rowspan:true},
        	                { key : "fhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
        	                	, render  : function(value, data, render, mapping){
        	                					if( "" != data.fhNtwkLineNo && data.fhNtwkLineNo != undefined){
													return "<span class='Icon Search' style='cursor: pointer'></span>";
												}
				    	                	}
				            },
        	                { key : "cotEqpNm", align:"left", title : "5G-PON COT 장비명", width: "200px" ,rowspan:true},
        	                { key : "mrnEqpNm", align:"left", title : "5G-PON MRN 장비명", width: "200px" ,rowspan:true},
        	                { key : "crnEqpNm", align:"left", title : "5G-PON CRN 장비명", width: "200px" ,rowspan:true},
        	                { key : "rpetrEqpNm", align:"left", title : "중계기 장비명", width: "200px"},
        	                { key : "rpetrIntgFcltsCd", align:"center", title : "중계기 통합시설코드", width: "160px"},
        	                { key : "onsHdofcNm", align:"center", title : "ONS본부", width: "160px" },
        	                { key : "onsTeamNm", align:"center", title : "ONS팀", width: "160px" },
        	                { key : "fhSvlnNm", align:"left", title : "서비스회선명", width: "200px"},
        	                { key : "fhSvlnNo", align:"left", title : "서비스회선번호", width: "110px"},
        	                { key : "fhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
        	                	, render  : function(value, data, render, mapping){
        	                					if( "" != data.fhSvlnNo && data.fhSvlnNo != undefined){
													return "<span class='Icon Search' style='cursor: pointer'></span>";
												}
				    	                	}
				            },

        	                { key : "creYm", align : "center", title : "생성년월", width : "130px", rowspan:true, hidden: true},
        	                { key : "mthStdWkDgr", align : "center", title : "월기준주차수", width : "130px", rowspan:true, hidden: true},
        	                { key : "hdofcOrgId", align : "center", title : "본부조직ID", width : "130px", rowspan:true, hidden: true},
        	                { key : "teamOrgId", align : "center", title : "팀조직ID", width : "130px", rowspan:true, hidden: true},
        	                { key : "tmofId", align : "center", title : "전송실ID", width : "130px", rowspan:true, hidden: true},
        	                { key : "cotBpId", align:"center", title : "COT협력업체ID", width: "100px",rowspan:true, hidden: true},
        	               ];

        	}else if(mTagetIdx == 2
        			&& mTargetGrid == "gridTab2"
                	&& schDivCdValPon == "DTL") {
        		headerN = [
							{fromIndex:0, toIndex:19, title:"5G-PON E-T-E 선번 정보"},
							{fromIndex:20, toIndex:24, title:"기지국 정보"},
							{fromIndex:25, toIndex:38, title:"프론트홀 COT 정보"},
							{fromIndex:39, toIndex:52, title:"프론트홀 MRN 정보"},
							{fromIndex:53, toIndex:68, title:"프론트홀 CRN 정보"},
							{fromIndex:69, toIndex:75, title:"중계기 정보"},
        	              ];
        		headerRowHeightN = [32, 90];
        		mappingN = [
        		            //5G-PON E-T-E 선반정보[0-19]
							{ key : "creYm", title : "생성년월", align : "center", width : "130px", hidden: true},
							{ key : "mthStdWkDgr", title : "월기준주차수", align : "center", width : "130px", hidden: true},
							{ key : "hdofcOrgId", title : "본부조직ID", align : "center", width : "90px", hidden: true},
							{ key : "hdofcOrgNm", title : "본부", align : "center", width : "70px"},
							{ key : "teamOrgId", title : "팀조직ID", align : "center", width : "130px", hidden: true},
							{ key : "teamOrgNm", title : "팀", align : "center", width : "110px"},
							{ key : "tmofId", title : "전송실ID", align : "center", width : "130px", hidden: true},
							{ key : "tmofNm", title : "전송실", align : "center", width : "140px"},
							{ key : "fhNetDivNm", title : "5G-PON 구분", align : "center", width : "90px"},
							{ key : "cotBpNm", title : "제조사", align : "center", width : "90px"},
							{ key : "fhNtwkLineNm", title : "링명", align : "center", width : "230px"},
							{ key : "fhNtwkLineNo", title : "링ID", align : "center", width : "110px"},
							{ key : "fhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
	    	                	, render  : function(value, data, render, mapping){
	    	                					if( "" != data.fhNtwkLineNo && data.fhNtwkLineNo != undefined){
													return "<span class='Icon Search' style='cursor: pointer'></span>";
												}
				    	                	}
				            },
							{ key : "fhSvlnNo", title : "E-T-E 광코어 회선번호 <br> (Short Path기준)", align : "center", width : "140px"},
							 { key : "fhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
	    	                	, render  : function(value, data, render, mapping){
	    	                					if( "" != data.fhSvlnNo && data.fhSvlnNo != undefined){
													return "<span class='Icon Search' style='cursor: pointer'></span>";
												}
				    	                	}
				            },
							{ key : "fhSvlnNm", title : "회선명", align : "center", width : "160px"},
							{ key : "cotMinLineDistm", title : "회선길이(M)<br>(Short path기준)<br>COT-MRN(EAST/WEST)", align : "right", width : "150px", render: {type:"string", rule : "comma"}},
							{ key : "cotMaxLineDistm", title : "회선길이(M)<br>(Long path기준)<br>COT-MRN(EAST/WEST)", align : "right", width : "150px", render: {type:"string", rule : "comma"}},
							{ key : "mrnMinLineDistm", title : "회선길이(M)<br>MRN-CRN<br>(EAST/WEST)", align : "right", width : "150px", render: {type:"string", rule : "comma"}},
							{ key : "eteTotDistm", title : "링거리", align : "right", width : "90px", render: {type:"string", rule : "comma"}},
							//기지국정보[20-24]
							{ key : "bmtsoEqpId", title : "기지국장비ID", align : "center", width : "130px", hidden: true},
							{ key : "bmtsoEqpNm", title : "기지국 장비명", align : "center", width : "200px"},
							{ key : "bmtsoIntgFcltsCd", title : "기지국 통합시설코드", align : "center", width : "160px"},
							{ key : "bmtsoMtsoNm", title : "국사명", align : "center", width : "130px"},
							{ key : "bmtsoMtsoId", title : "국사ID", align : "center", width : "110px"},
							//프론트홀 COT정보[25-38]
							{ key : "cotEqpId", title : "COT장비ID", align : "center", width : "130px", hidden: true},
							{ key : "cotEqpNm", title : "5G-PON COT장비명", align : "center", width : "200px"},
							{ key : "cotMtsoNm", title : "국사명", align : "center", width : "130px"},
							{ key : "cotBldCd", title : "건물코드", align : "center", width : "110px"},
							{ key : "cotBldNm", title : "COT건물명", align : "center", width : "130px", hidden: true},
							{ key : "cotSiteCd", title : "사이트키", align : "center", width : "130px"},
							{ key : "cotSiteNm", title : "COT사이트명", align : "center", width : "130px", hidden: true},
							{ key : "cotMtsoId", title : "국사ID", align : "center", width : "110px"},
							{ key : "cotBldAddr", title : "주소", align : "center", width : "180px"},
							{ key : "cotMtsoLatVal", title : "위도", align : "right", width : "80px"},
							{ key : "cotMtsoLngVal", title : "경도", align : "right", width : "80px"},
							{ key : "cotSwingBldCd", title : "COT SWING<br>건물코드", align : "center", width : "110px", headerStyleclass: "yellow"},
							{ key : "cotSwingBldNm", title : "COT SWING<br> 건물명", align : "center", width : "130px", headerStyleclass: "yellow"},
							{ key : "cotSwingBldAddr", title : "COT SWING<br> 건물주소", align : "left", width : "180px", headerStyleclass: "yellow"},
							//프론트홀 MRN 정보[39-52]
							{ key : "mrnEqpId", title : "MRN장비ID", align : "center", width : "130px", hidden: true},
							{ key : "mrnEqpNm", title : "5G-PON MRN장비명", align : "center", width : "200px"},
							{ key : "mrnMtsoNm", title : "국사명", align : "center", width : "130px"},
							{ key : "mrnBldCd", title : "건물코드", align : "center", width : "110px"},
							{ key : "mrnBldNm", title : "MRN건물명", align : "center", width : "130px", hidden: true},
							{ key : "mrnSiteCd", title : "사이트키", align : "center", width : "110px"},
							{ key : "mrnSiteNm", title : "MRN사이트명", align : "center", width : "130px", hidden: true},
							{ key : "mrnMtsoId", title : "국사ID", align : "center", width : "110px"},
							{ key : "mrnBldAddr", title : "주소", align : "center", width : "180px"},
							{ key : "mrnMtsoLatVal", title : "위도", align : "right", width : "80px"},
							{ key : "mrnMtsoLngVal", title : "경도", align : "right", width : "80px"},
							{ key : "mrnSwingBldCd", title : "MRN SWING<br>건물코드", align : "center", width : "110px", headerStyleclass: "yellow"},
							{ key : "mrnSwingBldNm", title : "MRN SWING<br>건물명", align : "center", width : "130px", headerStyleclass: "yellow"},
							{ key : "mrnSwingBldAddr", title : "MRN SWING<br>건물주소", align : "center", width : "180px", headerStyleclass: "yellow"},
							//프론트홀 CRN 정보[53-68]
							{ key : "crnEqpId", title : "CRN장비ID", align : "center", width : "130px", hidden: true},
							{ key : "crnEqpNm", title : "5G-PON CRN장비명", align : "center", width : "200px"},
							{ key : "crnMtsoNm", title : "국사명", align : "center", width : "130px"},
							{ key : "crnBldCd", title : "건물코드", align : "center", width : "110px"},
							{ key : "crnBldNm", title : "CRN건물명", align : "center", width : "130px", hidden: true},
							{ key : "crnSiteCd", title : "사이트키", align : "center", width : "110px"},
							{ key : "crnSiteNm", title : "CRN사이트명", align : "center", width : "130px", hidden: true},
							{ key : "crnMtsoId", title : "국사ID", align : "center", width : "110px"},
							{ key : "crnBldAddr", title : "주소", align : "center", width : "180px"},
							{ key : "crnMtsoLatVal", title : "위도", align : "right", width : "80px"},
							{ key : "crnMtsoLngVal", title : "경도", align : "right", width : "80px"},
							{ key : "crnSwingBldCd", title : "CRN SWING<br>건물코드", align : "center", width : "110px", headerStyleclass: "yellow"},
							{ key : "crnSwingBldNm", title : "CRN SWING<br>건물명", align : "center", width : "130px", headerStyleclass: "yellow"},
							{ key : "crnSwingBldAddr", title : "CRN SWING<br>건물주소", align : "center", width : "180px", headerStyleclass: "yellow"},
							{ key : "crnPortWavlVal", title : "cRN 파장", align : "center", width : "130px"},
							{ key : "chnlPortOpCnt", title : "Ch 운용수<br>(DU_L 수)", align : "right", width : "80px"},
							//중계기 정보[69-75]
							{ key : "rpetrEqpNm", title : "중계기 장비명", align : "left", width : "200px"},
							{ key : "rpetrIntgFcltsCd", title : "중계기 통합시설코드", align : "center", width : "160px"},
							{ key : "rpetrEqpTypNm", title : "중계기 타입", align : "center", width : "100px"},
							{ key : "rpetrMtsoNm", title : "국사명", align : "left", width : "130px"},
							{ key : "rpetrMtsoId", title : "국사ID", align : "center", width : "110px"},
							{ key : "onsHdofcNm", align:"center", title : "ONS본부", width: "160px" },
	    	                { key : "onsTeamNm", align:"center", title : "ONS팀", width: "160px" },

							{ key : "rpetrEqpId", title : "중계기장비ID", align : "center", width : "130px", hidden: true},
							{ key : "bkhlSvlnNo", title : "백홀서비스회선번호", align : "center", width : "130px", hidden: true},
							{ key : "bkhlSvlnNm", title : "백홀서비스회선명", align : "center", width : "130px", hidden: true},
							{ key : "bkhlNtwkLineNo", title : "백홀네트워크회선번호", align : "center", width : "130px", hidden: true},
							{ key : "bkhlNtwkLineNm", title : "백홀네트워크회선명", align : "center", width : "130px", hidden: true},
							{ key : "ivcEqpId", title : "IVC장비ID", align : "center", width : "130px", hidden: true},
							{ key : "ivcEqpNm", title : "IVC장비명", align : "center", width : "130px", hidden: true},
							{ key : "ivrEqpId", title : "IVR장비ID", align : "center", width : "130px", hidden: true},
							{ key : "ivrEqpNm", title : "IVR장비명", align : "center", width : "130px", hidden: true},
							{ key : "bmtsoSiteCd", title : "기지국사이트코드", align : "center", width : "130px", hidden: true},
							{ key : "bmtsoSiteNm", title : "기지국사이트명", align : "center", width : "130px", hidden: true},
							{ key : "cotBpId", title : "COT협력업체ID", align : "center", width : "130px", hidden: true},
							{ key : "cotSwingMtsoCd", title : "COTSWING국사코드", align : "center", width : "130px", hidden: true},
							{ key : "mrnSwingMtsoCd", title : "MRNSWING국사코드", align : "center", width : "130px", hidden: true},
							{ key : "crnSwingMtsoCd", title : "CRNSWING국사코드", align : "center", width : "130px", hidden: true},
							{ key : "rpetrSiteCd", title : "중계기사이트코드", align : "center", width : "130px", hidden: true},
							{ key : "rpetrSiteNm", title : "중계기사이트명", align : "center", width : "130px", hidden: true},
							{ key : "frstRegDate", title : "최초등록일자D", align : "center", width : "130px", hidden : true},
							{ key : "frstRegUserId", title : "최초등록사용자ID", align : "center", width : "130px", hidden : true},
							{ key : "lastChgDate", title : "최종변경일자D", align : "center", width : "130px", hidden : true},
							{ key : "lastChgUserId", title : "최종변경사용자ID", align : "center", width : "130px", hidden : true},
        	               ];
        	}else if(mTagetIdx == 3
    			&& mTargetGrid == "gridTab3"
    			&& schDivCdValRgMux == "ETE") {
    		headerN = [
    	               { fromIndex:5, toIndex:12, title:"백홀 정보"},
    	               { fromIndex:13, toIndex:32, title:"프론트홀 정보"}
    	              ];
    		groupingN = {
							useGrouping: true,
							by: ["hdofcOrgNm", "teamOrgNm", "tmofNm", "fhNetDivNm", "cotBpNm"
							     , "bkhlNtwkLineNm", "bkhlNtwkLineNo", "bhRingLkupIcon", "ibcEqpNm", "ibrEqpNm", "bkhlSvlnNm", "bkhlSvlnNo", "bhLineLkupIcon"
							     , "bmtsoEqpNm","bmtsoIntgFcltsCd", "fhNtwkLineNm", "fhNtwkLineNo", "fhRingLkupIcon", "cotEqpNm", "cotEqpTid", "cotEmsId", "cotAidVal", "rtEqpNm", "rtEqpTid", "rtEmsId", "rtAidVal"
							    ],
							useGroupRowspan: true,
							useGroupRearrange: true,
							groupRowspanMode : 1
						};
    		mappingN = [
    		            //기본정보
						{ key : "hdofcOrgNm", align : "left", title : "본부", width : "70px", rowspan:true},
						{ key : "teamOrgNm", align : "left", title : "팀", width : "90px", rowspan:true},
						{ key : "tmofNm", align : "left", title : "전송실", width : "140px", rowspan:true},
    	                { key : "fhNetDivNm", align:"left", title : "RINGMUX 구분", width: "100px", rowspan:true},
    	                { key : "cotBpNm", align : "left", title : "제조사", width : "90px", rowspan:true},
    	                //백홀정보
    	                { key : "bkhlNtwkLineNm", align :"left", title : "링명", width: "170px" , rowspan:true},
    	                { key : "bkhlNtwkLineNo", align :"left", title : "링ID", width: "110px" , rowspan:true},
    	                { key : "bhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
    	                	, render  : function(value, data, render, mapping){
											if( "" != data.bkhlNtwkLineNo && data.bkhlNtwkLineNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
    	                				}
    	                },
    	                { key : "ibcEqpNm", align:"left", title : "IVC/IBC 장비명", width: "170px" , rowspan:true},
    	                { key : "ibrEqpNm", align:"left", title : "IVR/IBR 장비명", width: "170px" , rowspan:true},
    	                { key : "bkhlSvlnNm", align:"left", title : "서비스회선명", width: "170px" , rowspan:true},
    	                { key : "bkhlSvlnNo", align:"left", title : "서비스회선번호", width: "110px" , rowspan:true},
    	                { key : "bhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.bkhlSvlnNo && data.bkhlSvlnNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
    	                },
    	                //프론트홀 정보
    	                { key : "bmtsoEqpNm", align:"left", title : "기지국장비명", width: "200px" , rowspan:true},
    	                { key : "bmtsoIntgFcltsCd", align:"center", title : "기지국 통합시설코드", width: "160px" , rowspan:true},
    	                { key : "fhNtwkLineNm", align:"left", title : "링명", width: "200px" , rowspan:true},
    	                { key : "fhNtwkLineNo", align:"left", title : "링ID", width: "110px" , rowspan:true},
    	                { key : "fhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false, rowspan:true
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhNtwkLineNo && data.fhNtwkLineNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },
    	                { key : "cotEqpNm", align:"left", title : "RINGMUX COT 장비명", width: "200px" , rowspan:true},
    	                { key : "cotEqpTid", align:"left", title : "RINGMUX COT 장비TID", width: "200px" , rowspan:true},
    	                { key : "cotEmsId", align:"left", title : "RINGMUX COT EMSID", width: "200px" , rowspan:true},
    	                { key : "cotAidVal", align:"left", title : "RINGMUX COT AID", width: "200px" , rowspan:true},
    	                { key : "rtEqpNm", align:"left", title : "RINGMUX RT 장비명", width: "200px" , rowspan:true},
    	                { key : "rtEqpTid", align:"left", title : "RINGMUX RT 장비TID", width: "200px" , rowspan:true},
    	                { key : "rtEmsId", align:"left", title : "RINGMUX RT EMSID", width: "200px" , rowspan:true},
    	                { key : "rtAidVal", align:"left", title : "RINGMUX RT AID", width: "200px" , rowspan:true},
    	                { key : "rpetrEqpNm", align:"left", title : "중계기 장비명", width: "200px" },
    	                { key : "rpetrIntgFcltsCd", align:"center", title : "중계기 통합시설코드", width: "160px" },
    	                { key : "onsHdofcNm", align:"center", title : "ONS본부", width: "160px" },
    	                { key : "onsTeamNm", align:"center", title : "ONS팀", width: "160px" },
    	                { key : "fhSvlnNm", align:"left", title : "서비스회선명", width: "200px" },
    	                { key : "fhSvlnNo", align:"left", title : "서비스회선번호", width: "110px" },
    	                { key : "fhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhSvlnNo && data.fhSvlnNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },

    	                { key : "creYm", align : "center", title : "생성년월", width : "130px", rowspan:true, hidden: true},
    	                { key : "mthStdWkDgr", align : "center", title : "월기준주차수", width : "130px", rowspan:true, hidden: true},
    	                { key : "hdofcOrgId", align : "center", title : "본부조직ID", width : "130px", rowspan:true, hidden: true},
    	                { key : "teamOrgId", align : "center", title : "팀조직ID", width : "130px", rowspan:true, hidden: true},
    	                { key : "tmofId", align : "center", title : "전송실ID", width : "130px", rowspan:true, hidden: true},
    	                { key : "cotBpId", align:"center", title : "COT협력업체ID", width: "100px", rowspan:true, hidden: true}
    	               ];

    	}else if(mTagetIdx == 3
    			&& mTargetGrid == "gridTab3"
            	&& schDivCdValRgMux == "DTL") {
    		headerN = [
    	               {fromIndex:0, toIndex:19, title:"RINGMUX E-T-E선번 정보"},
    	               {fromIndex:20, toIndex:24, title:"기지국 정보"},
    	               {fromIndex:25, toIndex:42, title:"프론트홀 COT 정보"},
    	               {fromIndex:43, toIndex:60, title:"프론트홀 RT 정보"},
    	               {fromIndex:61, toIndex:67, title:"중계기 정보"},
    	              ];
    		headerRowHeightN = [32, 60];
    		mappingN = [
    		            //5G-MUX E-T-E 선반 정보[0 - 19]
						{ key : "creYm", title : "생성년월", align : "center", width : "130px", hidden: true},
						{ key : "mthStdWkDgr", title : "월기준주차수", align : "center", width : "130px", hidden: true},
						{ key : "hdofcOrgId", title : "본부조직ID", align : "center", width : "130px", hidden: true},
						{ key : "hdofcOrgNm", title : "본부", align : "center", width : "70px"},
						{ key : "teamOrgId", title : "팀조직ID", align : "center", width : "110px", hidden: true},
						{ key : "teamOrgNm", title : "팀", align : "center", width : "90px"},
						{ key : "tmofId", title : "전송실ID", align : "center", width : "140px", hidden: true},
						{ key : "tmofNm", title : "전송실", align : "center", width : "140px"},
						{ key : "fhNetDivNm", title : "RINGMUX 구분", align : "center", width : "100px"},
						{ key : "cotBpNm", title : "제조사", align : "center", width : "90px"},
						{ key : "fhSvlnNo", title : "E-T-E 광코어 회선번호<br>(Short Path기준)", align : "center", width : "140px"},
						 { key : "fhLineLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhSvlnNo && data.fhSvlnNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },
						{ key : "fhSvlnNm", title : "회선명", align : "center", width : "230px"},
						{ key : "cotMinLineDistm", title : "회선길이(M)<br>(Short Path기준)", align : "right", width : "130px", render: {type:"string", rule : "comma"}},
						{ key : "optlShreDivVal", title : "광공유 구분", align : "center", width : "90px"},
						{ key : "spsbMtsoSameYn", title : "상하위국사동일여부", align : "center", width : "130px", hidden: true},
						{ key : "spsbMtsoSameSmtsoVal", title : "5G/LTE<br>모자국 동일<br>국소 여부", align : "center", width : "130px", height: "200px"},
						{ key : "fhNtwkLineNm", title : "링명", align : "left", width : "230px"},
						{ key : "fhNtwkLineNo", title : "링ID", align : "center", width : "110px"},
						{ key : "fhRingLkupIcon", align : "center", title : "E2E보기", width: "60px", editable: false, resizing: false
    	                	, render  : function(value, data, render, mapping){
    	                					if( "" != data.fhNtwkLineNo && data.fhNtwkLineNo != undefined){
												return "<span class='Icon Search' style='cursor: pointer'></span>";
											}
			    	                	}
			            },
						//기지국 정보[20 - 24]
						{ key : "bmtsoEqpId", title : "기지국장비ID", align : "center", width : "130px", hidden: true},
						{ key : "bmtsoEqpNm", title : "기지국 장비명", align : "center", width : "200px"},
						{ key : "bmtsoIntgFcltsCd", title : "기지국 통합시설코드", align : "center", width : "160px"},
						{ key : "bmtsoMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "bmtsoMtsoId", title : "국사ID", align : "center", width : "110px"},
						//프론트홀 COT 정보[25 - 42]
						{ key : "cotEqpId", title : "COT장비ID", align : "center", width : "130px", hidden: true},
						{ key : "cotEqpNm", title : "RINGMUX COT 장비명", align : "left", width : "200px"},
						{ key : "cotEqpTid", title : "RINGMUX COT 장비TID", align : "left", width : "200px"},
						{ key : "cotEmsId", title : "RINGMUX COT EMSID", align : "left", width : "200px"},
						{ key : "cotAidVal", title : "RINGMUX COT AID", align : "left", width : "200px"},
						{ key : "cotMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "cotBldCd", title : "건물코드", align : "center", width : "110px"},
						{ key : "cotSiteCd", title : "사이트키", align : "center", width : "130px"},
						{ key : "cotSiteNm", title : "COT 사이트명", align : "center", width : "130px", hidden: true},
						{ key : "cotMtsoId", title : "국사ID", align : "center", width : "110px"},
						{ key : "cotBldAddr", title : "건물주소", align : "center", width : "200px"},
						{ key : "cotBldNm", title : "COT 건물명", align : "center", width : "130px", hidden: true},
						{ key : "cotMtsoLatVal", title : "위도", align : "right", width : "80px"},
						{ key : "cotMtsoLngVal", title : "경도", align : "right", width : "80px"},
						{ key : "cotSwingMtsoCd", title : "COT SWING<br>국사코드", align : "center", width : "90px", headerStyleclass: "yellow"},
						{ key : "cotSwingBldCd", title : "COT SWING<br>건물코드", align : "center", width : "110px", headerStyleclass: "yellow"},
						{ key : "cotSwingBldNm", title : "COT SWING<br>건물명", align : "center", width : "130px", headerStyleclass: "yellow"},
						{ key : "cotSwingBldAddr", title : "COT SWING<br>건물주소", align : "center", width : "180px", headerStyleclass: "yellow"},
						//프론트홀 RT 정보[43 - 60]
						{ key : "rtEqpId", title : "RT장비ID", align : "center", width : "130px", hidden: true},
						{ key : "rtEqpNm", title : "RINGMUX RT장비명", align : "center", width : "200px"},
						{ key : "rtEqpTid", title : "RINGMUX RT장비TID", align : "center", width : "200px"},
						{ key : "rtEmsId", title : "RINGMUX RT EMSID", align : "left", width : "200px"},
						{ key : "rtAidVal", title : "RINGMUX RT AID", align : "left", width : "200px"},
						{ key : "rtMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "rtBldCd", title : "건물코드", align : "center", width : "110px"},
						{ key : "rtBldNm", title : "RT건물명", align : "center", width : "130px", hidden: true},
						{ key : "rtSiteCd", title : "사이트키", align : "center", width : "130px"},
						{ key : "rtSiteNm", title : "RT사이트명", align : "center", width : "130px", hidden: true},
						{ key : "rtMtsoId", title : "국사ID", align : "center", width : "110px"},
						{ key : "rtBldAddr", title : "주소", align : "center", width : "200px"},
						{ key : "rtMtsoLatVal", title : "위도", align : "right", width : "100px"},
						{ key : "rtMtsoLngVal", title : "경도", align : "right", width : "100px"},
						{ key : "rtSwingMtsoCd", title : "RT SWING<br>국사코드", align : "center", width : "90px", headerStyleclass: "yellow"},
						{ key : "rtSwingBldCd", title : "RT SWING<br>건물코드", align : "center", width : "110px", headerStyleclass: "yellow"},
						{ key : "rtSwingBldNm", title : "RT SWING<br>건물명", align : "center", width : "130px", headerStyleclass: "yellow"},
						{ key : "rtSwingBldAddr", title : "RT SWING<br>건물주소", align : "center", width : "180px", headerStyleclass: "yellow"},
						//중계기 정보[61 - 67]
						{ key : "rpetrEqpNm", title : "중계기 장비명", align : "left", width : "200px"},
						{ key : "rpetrIntgFcltsCd", title : "중계기 통합시설코드", align : "center", width : "160px"},
						{ key : "rpetrEqpTypNm", title : "중계기 타입", align : "center", width : "100px"},
						{ key : "rpetrMtsoNm", title : "국사명", align : "center", width : "130px"},
						{ key : "rpetrMtsoId", title : "국사ID", align : "center", width : "110px"},
						{ key : "onsHdofcNm", align:"center", title : "ONS본부", width: "160px" },
    	                { key : "onsTeamNm", align:"center", title : "ONS팀", width: "160px" },

						{ key : "rpetrEqpId", title : "중계기장비ID", align : "center", width : "130px", hidden: true},
						{ key : "cotBpId", title : "COT협력업체ID", align : "center", width : "130px", hidden: true},
						{ key : "bmtsoSiteCd", title : "기지국사이트코드", align : "center", width : "130px", hidden: true},
						{ key : "bmtsoSiteNm", title : "기지국사이트명", align : "center", width : "130px", hidden: true},
						{ key : "bkhlSvlnNo", title : "백홀서비스회선번호", align : "center", width : "130px", hidden: true},
						{ key : "bkhlSvlnNm", title : "백홀서비스회선명", align : "center", width : "130px", hidden: true},
						{ key : "bkhlNtwkLineNo", title : "백홀네트워크회선번호", align : "center", width : "130px", hidden: true},
						{ key : "bkhlNtwkLineNm", title : "백홀네트워크회선명", align : "center", width : "130px", hidden: true},
						{ key : "ivcEqpId", title : "IBC장비ID", align : "center", width : "130px", hidden: true},
						{ key : "ivcEqpNm", title : "IBC장비명", align : "center", width : "130px", hidden: true},
						{ key : "ivrEqpId", title : "IBR장비ID", align : "center", width : "130px", hidden: true},
						{ key : "ivrEqpNm", title : "IBR장비명", align : "center", width : "130px", hidden: true},
						{ key : "rpetrSiteCd", title : "중계기사이트코드", align : "center", width : "130px", hidden: true},
						{ key : "rpetrSiteNm", title : "중계기사이트명", align : "center", width : "130px", hidden: true},
						{ key : "eteTotDistm", title : "ETE총거리M", align : "center", width : "130px", hidden: true, render: {type:"string", rule : "comma"}},
						{ key : "frstRegDate", title : "최초등록일자D", align : "center", width : "130px", hidden : true},
						{ key : "frstRegUserId", title : "최초등록사용자ID", align : "center", width : "130px", hidden : true},
						{ key : "lastChgDate", title : "최종변경일자D", align : "center", width : "130px", hidden : true},
						{ key : "lastChgUserId", title : "최종변경사용자ID", align : "center", width : "130px", hidden : true}
    	               ];
    	}

    	//그리드 생성
        $('#'+gridTab1).alopexGrid({
			headerGroup: headerN,
			renderMapping: renderMappingN,
			grouping: groupingN,
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
				width:'100px',
				align:'center'
        	},
        	fitTableWidth:true,
        	autoColumnIndex: true,
    		autoResize: false,
    		numberingColumnFromZero: false,
    		columnMapping: mappingN,
    		headerRowHeight: headerRowHeightN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

        //그리드 생성
        $('#'+gridTab2).alopexGrid({
			headerGroup: headerN,
			renderMapping: renderMappingN,
			grouping: groupingN,
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
				width:'100px',
				align:'center'
        	},
        	fitTableWidth:true,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: mappingN,
    		headerRowHeight: headerRowHeightN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });


      //그리드 생성
        $('#'+gridTab3).alopexGrid({
			headerGroup: headerN,
			renderMapping: renderMappingN,
			grouping: groupingN,
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
				width:'100px',
				align:'center'
        	},
        	fitTableWidth:true,
        	autoColumnIndex: true,
    		autoResize: false,
    		numberingColumnFromZero: false,
    		columnMapping: mappingN,
    		headerRowHeight: headerRowHeightN,
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });
    }

    function setSelectCode() {
    	var chrrOrgGrpCd;
    	if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }
		 var param = {"mgmtGrpNm": chrrOrgGrpCd};

		 //본부 조회
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrgMux');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrgPon');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrgRgMux');

		 // ONS 본부 조회
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrgGrp/ONS', null, 'GET', 'fstOnsOrgMux');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrgGrp/ONS', null, 'GET', 'fstOnsOrgPon');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrgGrp/ONS', null, 'GET', 'fstOnsOrgRgMux');

		 //제조사 조회
		 var bpParam = 'comGrpCd=FHBP&etcAttrValMlt1=ALL&etcAttrValMlt1=5GMUXPON&etcAttrValMlt1=5GMUX';
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd', bpParam, 'GET', 'bpMux');

		 bpParam = 'comGrpCd=FHBP&etcAttrValMlt1=ALL&etcAttrValMlt1=5GMUXPON';
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd', bpParam, 'GET', 'bpPon');

		 bpParam = 'comGrpCd=FHBP&etcAttrValMlt1=ALL&etcAttrValMlt1=RINGMUX';
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/cfgStd', bpParam, 'GET', 'bpRgMux');


		var cDate = new Date();
    	cDate.setDate(cDate.getDate());
    	clctDtDay = cDate.getDate();
    	clctDtMon = cDate.getMonth() + 1;
    	clctDtYear = cDate.getFullYear();
   		clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;
   		clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;

    	//년도
    	$('#selectYearMux').empty();
    	for(var i = -3; i <= 0; i++){
    	    $('#selectYearMux').append($('<option>', {value: clctDtYear + i, text: clctDtYear + i + '년'}));
    	};

    	//월
    	$('#selectMonMux').empty();
    	for(var i = 1; i <= 12; i++){
    		$('#selectMonMux').append($('<option>', {value: i >= 10 ? i : '0' + i, text: (i >= 10 ? i : '0' + i) + '월'}));
    	};

    	//주차
    	$('#selectWeekMux').empty();
    	for(var i = 1; i <= 5; i++){
    		$('#selectWeekMux').append($('<option>', {value: i, text: i + '주차'}));
    	};

    	//년도
    	$('#selectYearPon').empty();
    	for(var i = -3; i <= 0; i++){
    		$('#selectYearPon').append($('<option>', {value: clctDtYear + i, text: clctDtYear + i + '년'}));
    	};

    	//월
    	$('#selectMonPon').empty();
    	for(var i = 1; i <= 12; i++){
    		$('#selectMonPon').append($('<option>', {value: i >= 10 ? i : '0' + i, text: (i >= 10 ? i : '0' + i) + '월'}));
    	};

    	//주차
    	$('#selectWeekPon').empty();
    	for(var i = 1; i <= 5; i++){
    		$('#selectWeekPon').append($('<option>', {value: i, text: i + '주차'}));
    	};

    	//년도
    	$('#selectYearRgMux').empty();
    	for(var i = -3; i <= 0; i++){
    	    $('#selectYearRgMux').append($('<option>', {value: clctDtYear + i, text: clctDtYear + i + '년'}));
    	};

    	//월
    	$('#selectMonRgMux').empty();
    	for(var i = 1; i <= 12; i++){
    		$('#selectMonRgMux').append($('<option>', {value: i >= 10 ? i : '0' + i, text: (i >= 10 ? i : '0' + i) + '월'}));
    	};

    	//주차
    	$('#selectWeekRgMux').empty();
    	for(var i = 1; i <= 5; i++){
    		$('#selectWeekRgMux').append($('<option>', {value: i, text: i + '주차'}));
    	};

    	var stdDt = clctDtYear + '' + clctDtMon + '' + clctDtDay;
    	//기준 주차
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/stdCalendar/'+ stdDt, null, 'GET', 'stdCalendar');
    }

    function setEventListener() {

    	//본부 선택시 이벤트
    	$('#orgIdMux').on('change', function(e) {
    		var orgId = $('#orgIdMux').val();
    		if (orgId == '') {
 	   			var mgmtGrpNm = $("#mgmtGrpNm").val();
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'fstTeamMux');
 	   		 } else {
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgId, null, 'GET', 'fstTeamMux');
 	   		 }
         });

    	// 팀을 선택했을 경우
    	$('#teamIdListMux').on('change', function(e) {
	   		var mgmtGrpNm = $("#mgmtGrpNm").val();
	   		var orgId = $('#orgIdMux').val();
	   		var teamIdList = $('#teamIdListMux').val();

    	 	if (orgId == '' && (teamIdList == '' || teamIdList == null)){
			    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmofMux');
	   	 	} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
	   	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmofMux');
	   		} else {
	   			$('#pageNo').val(1);
	   			$('#rowPerPage').val(1);
	   			var param =  $("#searchForm").serialize();
	   			var teamIdList = $('#teamIdListMux').val();
	   			if(teamIdList == ''){
	   			}else {
	   				for(var i=0; teamIdList.length > i; i++){
	   					param += "&teamIdList=" + teamIdList[i];
	   				}
	   			}
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multitmofMux');
	   		}
    	});

    	//본부 선택시 이벤트
    	$('#orgIdPon').on('change', function(e) {
    		var orgId = $('#orgIdPon').val();
    		if (orgId == '') {
    			var mgmtGrpNm = $("#mgmtGrpNm").val();
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'fstTeamPon');
    		} else {
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgId, null, 'GET', 'fstTeamPon');
    		}
    	});

    	// 팀을 선택했을 경우
    	$('#teamIdListPon').on('change', function(e) {
    		var mgmtGrpNm = $("#mgmtGrpNm").val();
    		var orgId = $('#orgIdPon').val();
    		var teamIdList = $('#teamIdListPon').val();

    		if (orgId == '' && (teamIdList == '' || teamIdList == null)){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmofMux');
    		} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmofMux');
    		} else {
    			$('#pageNo').val(1);
    			$('#rowPerPage').val(1);
    			var param =  $("#searchForm").serialize();
    			var teamIdList = $('#teamIdListPon').val();
	   			if(teamIdList == ''){
	   			}else {
	   				for(var i=0; teamIdList.length > i; i++){
	   					param += "&teamIdList=" + teamIdList[i];
	   				}
	   			}
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multitmofPon');
    		}
    	});

    	//본부 선택시 이벤트
    	$('#orgIdRgMux').on('change', function(e) {
    		var orgId = $('#orgIdRgMux').val();
    		if (orgId == '') {
 	   			var mgmtGrpNm = $("#mgmtGrpNm").val();
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'fstTeamRgMux');
 	   		 } else {
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgId, null, 'GET', 'fstTeamRgMux');
 	   		 }
         });

    	// 팀을 선택했을 경우
    	$('#teamIdListRgMux').on('change', function(e) {
	   		var mgmtGrpNm = $("#mgmtGrpNm").val();
	   		var orgId = $('#orgIdRgMux').val();
	   		var teamIdList = $('#teamIdListRgMux').val();

    	 	if (orgId == '' && (teamIdList == '' || teamIdList == null)){
			    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmofRgMux');
	   	 	} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
	   	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmofRgMux');
	   		} else {
	   			$('#pageNo').val(1);
	   			$('#rowPerPage').val(1);
	   			var param =  $("#searchForm").serialize();
	   			var teamIdList = $('#teamIdListRgMux').val();
	   			if(teamIdList == ''){
	   			}else {
	   				for(var i=0; teamIdList.length > i; i++){
	   					param += "&teamIdList=" + teamIdList[i];
	   				}
	   			}
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multitmofRgMux');
	   		}
    	});

    	//탭변경 이벤트
    	$('#basicTabs').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				mTagetIdx 	= 1;
				mTargetGrid 	= gridTab1;
				break;
			case 1 :
				mTagetIdx 	= 2;
				mTargetGrid 	= gridTab2;

				break;
			case 2 :
				mTagetIdx 	= 3;
				mTargetGrid 	= gridTab3;

				break;
			default :
				mTagetIdx 	= 1;
				mTargetGrid 	= gridTab1;
				break;
			}

			$('#'+mTargetGrid).alopexGrid("viewUpdate");
			initGrid();
    	});

    	$('input:radio[name=schDivCdMux]').on('change', function(e) {
    		if($(this).val() == "ETE"){
    			$("#schDtlMux").hide();
    			$("#eteMux").show();

    		}else{
    			$("#schDtlMux").show();
    			$("#eteMux").hide();
    		}

    		$('#'+mTargetGrid).alopexGrid("dataEmpty");
    		initGrid();
    	});

    	$('input:radio[name=schDivCdPon]').on('change', function(e) {
    		if($(this).val() == "ETE"){
    			$("#schDtlPon").hide();
    			$("#etePon").show();
    		}else{
    			$("#schDtlPon").show();
    			$("#etePon").hide();
    		}

    		$('#'+mTargetGrid).alopexGrid("dataEmpty");
    		initGrid();
    	});

    	$('input:radio[name=schDivCdRgMux]').on('change', function(e) {
    		if($(this).val() == "ETE"){
    			$("#schDtlRgMux").hide();
    			$("#eteRgMux").show();
    		}else{
    			$("#schDtlRgMux").show();
    			$("#eteRgMux").hide();
    		}

    		$('#'+mTargetGrid).alopexGrid("dataEmpty");
    		initGrid();
    	});

    	$('#btnSearchMux').on('click', function(e) {
        	setGridTab1(1, perPage1);
        });

        $('#btnSearchPon').on('click', function(e) {
        	setGridTab2(1, perPage2);
        });

        $('#btnSearchRgMux').on('click', function(e) {
        	setGridTab3(1, perPage3);
        });

        $('#btnExcelDownMux').on('click', function(e) {
        	btnExportMuxExcelOnDemandClickEventHandler(e);
        });

        $('#btnExcelDownPon').on('click', function(e) {
        	btnExportPonExcelOnDemandClickEventHandler(e);
        });

        $('#btnExcelDownRgMux').on('click', function(e) {
        	btnExportRgMuxExcelOnDemandClickEventHandler(e);
        });

        //엔터조회
        $('#searchForm').on('keydown', function(e){
//        	console.log("e : ", e.which);

        	if (e.which == 13){
        		if(mTagetIdx == 1){
        			setGridTab1(1, perPage1);
        		}else if(mTagetIdx == 2){
        			setGridTab2(1, perPage2);
        		}else if (mTagetIdx == 3){
        			setGridTab3(1, perPage3);
        		}
        	}
        });

        // 페이지 번호 클릭시
   	 	$('#'+gridTab1).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setGridTab1(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab1).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage1 = eObj.perPage;
        	setGridTab1(1, eObj.perPage);
        });

    	// 페이지 번호 클릭시
   	 	$('#'+gridTab2).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setGridTab2(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab2).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage2 = eObj.perPage;
        	setGridTab2(1, eObj.perPage);
        });

        // 페이지 번호 클릭시
   	 	$('#'+gridTab3).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setGridTab3(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab3).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage3 = eObj.perPage;
        	setGridTab3(1, eObj.perPage);
        });

        //ETE보기 클릭 시
        $('#'+gridTab1).on('click', '.bodycell', function(e){
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridTab1).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			var row = dataObj._index.row;

			if(rowData._key == "bhRingLkupIcon" ){
				ringE2ETopo(dataObj, "bh");
			}else if(rowData._key == "bhLineLkupIcon"){
				srvnE2ETopo(dataObj, "bh");
			}else if(rowData._key == "fhRingLkupIcon"){
				ringE2ETopo(dataObj, "fh");
			}else if(rowData._key == "fhLineLkupIcon"){
				srvnE2ETopo(dataObj, "fh");
			}
        });

        $('#'+gridTab2).on('click', '.bodycell', function(e){
        	var ev = AlopexGrid.parseEvent(e);
        	var dataObj = ev.data;
        	var rowData = $('#'+gridTab2).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

        	var row = dataObj._index.row;

        	if(rowData._key == "bhRingLkupIcon" ){
				ringE2ETopo(dataObj, "bh");
			}else if(rowData._key == "bhLineLkupIcon"){
				srvnE2ETopo(dataObj, "bh");
			}else if(rowData._key == "fhRingLkupIcon"){
				ringE2ETopo(dataObj, "fh");
			}else if(rowData._key == "fhLineLkupIcon"){
				srvnE2ETopo(dataObj, "fh");
			}
        });

      //ETE보기 클릭 시
        $('#'+gridTab3).on('click', '.bodycell', function(e){
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridTab3).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			var row = dataObj._index.row;

			if(rowData._key == "bhRingLkupIcon" ){
				ringE2ETopo(dataObj, "bh");
			}else if(rowData._key == "bhLineLkupIcon"){
				srvnE2ETopo(dataObj, "bh");
			}else if(rowData._key == "fhRingLkupIcon"){
				ringE2ETopo(dataObj, "fh");
			}else if(rowData._key == "fhLineLkupIcon"){
				srvnE2ETopo(dataObj, "fh");
			}
        });

        //ONS 조직 이벤트

      //본부 선택시 이벤트
    	$('#onsOrgIdMux').on('change', function(e) {
    		var orgId = $('#onsOrgIdMux').val();
    		if (orgId == '') {

 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsTeamGrp/ONS', null, 'GET', 'fstOnsTeamMux');
 	   		 } else {
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrg/' + orgId, null, 'GET', 'fstOnsTeamMux');
 	   		 }
         });

    	//본부 선택시 이벤트
    	$('#onsOrgIdPon').on('change', function(e) {
    		var orgId = $('#onsOrgIdPon').val();
    		if (orgId == '') {
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsTeamGrp/ONS', null, 'GET', 'fstOnsTeamPon');
    		} else {
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrg/' + orgId, null, 'GET', 'fstOnsTeamPon');
    		}
    	});

    	//본부 선택시 이벤트
    	$('#onsOrgIdRgMux').on('change', function(e) {
    		var orgId = $('#onsOrgIdRgMux').val();
    		if (orgId == '') {
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsTeamGrp/ONS', null, 'GET', 'fstOnsTeamRgMux');
 	   		 } else {
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrg/' + orgId, null, 'GET', 'fstOnsTeamRgMux');
 	   		 }
         });

    }

    //토프로지맵 링크호출
    function ringE2ETopo(dataObj, div) {
    	var searchId, searchNm;
    	if(div == "bh"){
    		searchId = dataObj.bkhlNtwkLineNo;
    		searchNm = dataObj.bkhlNtwkLineNm;
    	}else if(div == "fh"){
    		searchId = dataObj.fhNtwkLineNo;
    		searchNm = dataObj.fhNtwkLineNm;
    	}
    	window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=RING&searchId=' + searchId + '&searchNm=' + searchNm);
    }

    function srvnE2ETopo(dataObj, div) {
    	var searchId, searchNm;
    	if(div == "bh"){
    		searchId = dataObj.bkhlSvlnNo;
    		searchNm = dataObj.bkhlSvlnNm;
    	}else if(div == "fh"){
    		searchId = dataObj.fhSvlnNo;
    		searchNm = dataObj.fhSvlnNm;
    	}
    	window.open('/tango-transmission-web/configmgmt/intge2etopo/IntgE2ETopo.do?searchTarget=SRVN&searchId=' + searchId + '&searchNm=' + searchNm);
    }

    function setGridTab1(page, rowPerPage) {
    	$('#'+gridTab1).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  getParamData();
    	param = convertQueryString(param);
//    	console.log("tab1 search param : ",param);
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/stateOfMux', param, 'GET', 'searchTab1');
    }

    function setGridTab2(page, rowPerPage) {
    	$('#'+gridTab2).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  getParamData();
    	param = convertQueryString(param);
//    	console.log("tab2 search param : ",param);
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/stateOfPon', param, 'GET', 'searchTab2');
    }

    function setGridTab3(page, rowPerPage) {
    	$('#'+gridTab3).alopexGrid('showProgress');

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var param =  getParamData();
    	param = convertQueryString(param);
//    	console.log("tab1 search param : ",param);
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/engmgmt/stateOfRgMux', param, 'GET', 'searchTab3');
    }

    function getParamData(){
    	var param = {
    					tabIdx : mTagetIdx,
    					pageNo : $('#pageNo').val(),
    					rowPerPage : $('#rowPerPage').val()
    				};

    	var schDivCdValMux = $('input:radio[name=schDivCdMux]:checked').val();
    	var schDivCdValPon = $('input:radio[name=schDivCdPon]:checked').val();
    	var schDivCdValRgMux = $('input:radio[name=schDivCdRgMux]:checked').val();

    	switch(mTagetIdx){
    	case 1:	// 5G-MUX
    		param.fhNetDiv			= $("#fhNetDivMux").val();		//망구분명
    		param.orgId 			= $("#orgIdMux").val();			//본부
    		param.teamIdList		= ($("#teamIdListMux").val() == null) ? [] : $("#teamIdListMux").val();		//팀
    		param.tmofList			= ($("#tmofListMux").val() == null) ? [] : $("#tmofListMux").val();		//전송실
    		param.bpIdList			= ($("#bpIdListMux").val() == null) ? [] : $("#bpIdListMux").val();		//제조사
    		param.schDivCd			= $('input:radio[name=schDivCdMux]:checked').val();				//조회구분
    		param.creYm				= $("#selectYearMux").val().concat($("#selectMonMux").val());		//현황년월
    		param.mthStdWkDgr		= $("#selectWeekMux").val();		//현황주차
    		param.dplxgDiv			= $("#dplxgDivMux").val();		//이중화구분
    		param.extsPortUseYn		= $("#extsPortUseYnMux").val();	//EXT 포트 사용
    		param.spsbMtsoSameYn	= $("#spsbMtsoSameYnMux").val();	//모자국동일여부

    		param.fhSvlnNo			= $("#fhSvlnNoMux").val();		//회선ID
    		param.fhNtwkLineNo		= $("#fhNtwkLineNoMux").val();	//링ID

    		param.cotEqpNm			= $("#cotEqpNmMux").val();		//COT장비명
    		param.rtEqpNm			= $("#rtEqpNmMux").val();			//RT장비명

    		param.onsHdofcCdVal 			= $("#onsOrgIdMux").val();			// ONS 본부
    		param.onsTeamCdList		= ($("#onsTeamIdListMux").val() == null) ? [] : $("#onsTeamIdListMux").val();		//ONS 팀

    		if (schDivCdValMux == "ETE") {
	    		param.bkhlNtwkLineNm		= $("#bkhlNtwkLineNmMuxEte").val();		//백홀 링명
	    		param.bkhlSvlnNm		= $("#bkhlSvlnNmMuxEte").val();		//백홀 회선명
	    		param.fhSvlnNm			= $("#fhSvlnNmMuxEte").val();		//회선명
        		param.fhNtwkLineNm		= $("#fhNtwkLineNmMuxEte").val();	//링명
        		param.bmtsoEqpNm		= $("#bmtsoEqpNmMuxEte").val();		//기지국장비명
        		param.rpetrEqpNm		= $("#rpetrEqpNmMuxEte").val();		//중계기장비명
    		}else {
    			param.fhSvlnNm			= $("#fhSvlnNmMux").val();		//회선명
        		param.fhNtwkLineNm		= $("#fhNtwkLineNmMux").val();	//링명
        		param.bmtsoEqpNm		= $("#bmtsoEqpNmMux").val();		//기지국장비명
        		param.rpetrEqpNm		= $("#rpetrEqpNmMux").val();		//중계기장비명
    		}
   		break;
    	case 2:	// 5G-PON
    		param.fhNetDiv			= $("#fhNetDivPon").val();		//망구분명
    		param.orgId 			= $("#orgIdPon").val();			//본부
    		param.teamIdList		= ($("#teamIdListPon").val() == null) ? [] : $("#teamIdListPon").val();		//팀
    		param.tmofList			= ($("#tmofListPon").val() == null) ? [] : $("#tmofListPon").val();		//전송실
    		param.bpIdList			= ($("#bpIdListPon").val() == null) ? [] : $("#bpIdListPon").val();		//제조사
    		param.schDivCd			= $('input:radio[name=schDivCdPon]:checked').val();				//조회구분
    		param.creYm				= $("#selectYearPon").val().concat($("#selectMonPon").val());		//현황년월
    		param.mthStdWkDgr		= $("#selectWeekPon").val();		//현황주차
    		param.fhSvlnNo			= $("#fhSvlnNoPon").val();		//회선ID
    		param.fhNtwkLineNo		= $("#fhNtwkLineNoPon").val();	//링ID

    		param.cotEqpNm			= $("#cotEqpNmPon").val();		//COT장비명
    		param.mrnEqpNm			= $("#mrnEqpNmPon").val();		//MRN장비명
    		param.crnEqpNm			= $("#crnEqpNmPon").val();		//CRN장비명

    		param.onsHdofcCdVal 			= $("#onsOrgIdPon").val();			// ONS 본부
    		param.onsTeamCdList		= ($("#onsTeamIdListPon").val() == null) ? [] : $("#onsTeamIdListPon").val();		//ONS 팀

    		if (schDivCdValPon == "ETE") {
	    		param.bkhlNtwkLineNm		= $("#bkhlNtwkLineNmPonEte").val();		//백홀 링명
	    		param.bkhlSvlnNm		= $("#bkhlSvlnNmPonEte").val();		//백홀 회선명
	    		param.fhSvlnNm			= $("#fhSvlnNmPonEte").val();		//회선명
        		param.fhNtwkLineNm		= $("#fhNtwkLineNmPonEte").val();	//링명
        		param.bmtsoEqpNm		= $("#bmtsoEqpNmPonEte").val();		//기지국장비명
        		param.rpetrEqpNm		= $("#rpetrEqpNmPonEte").val();		//중계기장비명
    		}else {
    			param.fhSvlnNm			= $("#fhSvlnNmPon").val();		//회선명
        		param.fhNtwkLineNm		= $("#fhNtwkLineNmPon").val();	//링명
        		param.bmtsoEqpNm		= $("#bmtsoEqpNmPon").val();		//기지국장비명
        		param.rpetrEqpNm		= $("#rpetrEqpNmPon").val();		//중계기장비명

    		}


    		break;
    	case 3:	// RINGMUX
    		param.fhNetDiv			= $("#fhNetDivRgMux").val();		//망구분명
    		param.orgId 			= $("#orgIdRgMux").val();			//본부
    		param.teamIdList		= ($("#teamIdListRgMux").val() == null) ? [] : $("#teamIdListRgMux").val();		//팀
    		param.tmofList			= ($("#tmofListRgMux").val() == null) ? [] : $("#tmofListRgMux").val();		//전송실
    		param.bpIdList			= ($("#bpIdListRgMux").val() == null) ? [] : $("#bpIdListRgMux").val();		//제조사
    		param.schDivCd			= $('input:radio[name=schDivCdRgMux]:checked').val();				//조회구분
    		param.creYm				= $("#selectYearRgMux").val().concat($("#selectMonRgMux").val());		//현황년월
    		param.mthStdWkDgr		= $("#selectWeekRgMux").val();		//현황주차
    		param.spsbMtsoSameYn	= $("#spsbMtsoSameYnRgMux").val();	//모자국동일여부
    		param.fhSvlnNo			= $("#fhSvlnNoRgMux").val();		//회선ID
    		param.fhNtwkLineNo		= $("#fhNtwkLineNoRgMux").val();	//링ID
    		param.cotEqpNm			= $("#cotEqpNmRgMux").val();		//COT장비명
    		param.cotEqpTid			= $("#cotEqpTidRgMux").val();		//COT장비TID
    		param.cotEmsId			= $("#cotEmsIdRgMux").val();		//COT EMSID
    		param.cotAidVal		= $("#cotAidRgMux").val();		//COTAID
    		param.rtEqpNm			= $("#rtEqpNmRgMux").val();			//RT장비명
    		param.rtEqpTid			= $("#rtEqpTidRgMux").val();			//RT장비TID
    		param.rtEmsId		= $("#rtEmsIdRgMux").val();		//RTEMSID
    		param.rtAidVal		= $("#rtAidRgMux").val();		//RTAID

    		param.onsHdofcCdVal 			= $("#onsOrgIdRgMux").val();			// ONS 본부
    		param.onsTeamCdList		= ($("#onsTeamIdListRgMux").val() == null) ? [] : $("#onsTeamIdListRgMux").val();		//ONS 팀

    		if (schDivCdValRgMux == "ETE") {
	    		param.bkhlNtwkLineNm		= $("#bkhlNtwkLineNmRgMuxEte").val();		//백홀 링명
	    		param.bkhlSvlnNm		= $("#bkhlSvlnNmRgMuxEte").val();		//백홀 회선명
	    		param.fhSvlnNm			= $("#fhSvlnNmRgMuxEte").val();		//회선명
        		param.fhNtwkLineNm		= $("#fhNtwkLineNmRgMuxEte").val();	//링명
        		param.bmtsoEqpNm		= $("#bmtsoEqpNmRgMuxEte").val();		//기지국장비명
        		param.rpetrEqpNm		= $("#rpetrEqpNmRgMuxEte").val();		//중계기장비명
    		}else {
    			param.fhSvlnNm			= $("#fhSvlnNmRgMux").val();		//회선명
        		param.fhNtwkLineNm		= $("#fhNtwkLineNmRgMux").val();	//링명
        		param.bmtsoEqpNm		= $("#bmtsoEqpNmRgMux").val();		//기지국장비명
        		param.rpetrEqpNm		= $("#rpetrEqpNmRgMux").val();		//중계기장비명
    		}
   		break;
		}

    	return param;
    }

    function convertQueryString(obj){
    	return Object.keys(obj).map(function(i){
    		return encodeURIComponent(i) + '=' + encodeURIComponent(obj[i])
    	}).join('&');
    }


    var httpRequest = function(Url, Param, Method, Flag ) {
    	console.log();
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }


    function successCallback(response, status, jqxhr, flag){
    	//본부
    	if(flag == 'fstOrgMux'){
    		var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}

			$('#orgIdMux').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
	   			for(var i=0; i<response.length; i++){
	   				var resObj = response[i];
	   				option_data.push(resObj);
	   				if(resObj.orgId == sUprOrgId) {
	   					selectId = resObj.orgId;
	   				}
	   			}
	   			if(selectId == null){
	   				selectId = response[0].orgId;
	   				sUprOrgId = selectId;
	   			}
	   			$('#orgIdMux').setData({
	   				data:option_data ,
	   				orgIdMux:selectId
	   			});
	   		}

	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeamMux');
    	}

    	if(flag == 'fstOrgPon'){
    		var chrrOrgGrpCd;
    		if($("#chrrOrgGrpCd").val() == ""){
    			chrrOrgGrpCd = "SKT";
    		}else{
    			chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    		}

    		var sUprOrgId = "";
    		if($("#sUprOrgId").val() != ""){
    			sUprOrgId = $("#sUprOrgId").val();
    		}

    		$('#orgIdPon').clear();

    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		var selectId = null;
    		if(response.length > 0){
    			for(var i=0; i<response.length; i++){
    				var resObj = response[i];
    				option_data.push(resObj);
    				if(resObj.orgId == sUprOrgId) {
    					selectId = resObj.orgId;
    				}
    			}
    			if(selectId == null){
    				selectId = response[0].orgId;
    				sUprOrgId = selectId;
    			}
    			$('#orgIdPon').setData({
    				data:option_data ,
    				orgIdPon:selectId
    			});
    		}

    		//본부 세션값이 있을 경우 해당 팀,전송실 조회
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeamPon');
    	}

    	//본부
    	if(flag == 'fstOrgRgMux'){
    		var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}

			$('#orgIdRgMux').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
	   			for(var i=0; i<response.length; i++){
	   				var resObj = response[i];
	   				option_data.push(resObj);
	   				if(resObj.orgId == sUprOrgId) {
	   					selectId = resObj.orgId;
	   				}
	   			}
	   			if(selectId == null){
	   				selectId = response[0].orgId;
	   				sUprOrgId = selectId;
	   			}
	   			$('#orgIdRgMux').setData({
	   				data:option_data ,
	   				orgIdRgMux:selectId
	   			});
	   		}

	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeamRgMux');
    	}

    	//팀
    	if(flag == 'fstTeamMux'){
    		var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamIdListMux').clear();
  			var option_data =  [];
      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#teamIdListMux').setData({ data:option_data});

  	    		var mgmtGrpNm = $("#mgmtGrpNm").val();
  	    		var orgId = $('#orgIdMux').val();
  	    		var teamIdList = $('#teamIdListMux').val();
  	     	 	if (orgId == '' && (teamIdList == '' || teamIdList == null)){
  	     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmofMux');
  	     	 	} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
  	     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmofMux');
  	    		} else {
  	    			$('#pageNo').val(1);
  	    			$('#rowPerPage').val(1);
  	    			var param =  $("#searchForm").serialize();
  	    			param.teamIdList = teamIdList;
  	    			console.log("multiTeamTmofList param : ", param);
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multitmofMux');
  	    		}
      		}
    	}

    	if(flag == 'fstTeamPon'){
    		var chrrOrgGrpCd;
    		if($("#chrrOrgGrpCd").val() == ""){
    			chrrOrgGrpCd = "SKT";
    		}else{
    			chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    		}

    		var sOrgId = "";
    		if($("#sOrgId").val() != ""){
    			sOrgId = $("#sOrgId").val();
    		}

    		$('#teamIdListPon').clear();
    		var option_data =  [];
    		var selectId = null;
    		if(response.length > 0){
    			for(var i=0; i<response.length; i++){
    				var resObj = response[i];
    				option_data.push(resObj);
    				if(resObj.orgId == sOrgId) {
    					selectId = resObj.orgId;
    				}
    			}
    			if(selectId == null){
    				selectId = response[0].orgId;
    			}
    			$('#teamIdListPon').setData({ data:option_data});

    			var mgmtGrpNm = $("#mgmtGrpNm").val();
    			var orgId = $('#orgIdPon').val();
    			var teamIdList = $('#teamIdListPon').val();
    			if (orgId == '' && (teamIdList == '' || teamIdList == null)){
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmofPon');
    			} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmofPon');
    			} else {
    				$('#pageNo').val(1);
    				$('#rowPerPage').val(1);
    				var param =  $("#searchForm").serialize();
    				param.teamIdList = teamIdList;
    				httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multitmofPon');
    			}
    		}
    	}

    	//팀
    	if(flag == 'fstTeamRgMux'){
    		var chrrOrgGrpCd;
			if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			}

    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamIdListRgMux').clear();
  			var option_data =  [];
      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#teamIdListRgMux').setData({ data:option_data});

  	    		var mgmtGrpNm = $("#mgmtGrpNm").val();
  	    		var orgId = $('#orgIdRgMux').val();
  	    		var teamIdList = $('#teamIdListRgMux').val();
  	     	 	if (orgId == '' && (teamIdList == '' || teamIdList == null)){
  	     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmofRgMux');
  	     	 	} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
  	     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmofRgMux');
  	    		} else {
  	    			$('#pageNo').val(1);
  	    			$('#rowPerPage').val(1);
  	    			var param =  $("#searchForm").serialize();
  	    			param.teamIdList = teamIdList;
  	    			console.log("multiTeamTmofList param : ", param);
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multitmofRgMux');
  	    		}
      		}
    	}

    	// 전송실
    	if(flag == 'tmofMux'){
    		$('#tmofListMux').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#tmofListMux').setData({ data:option_data });
    	}

    	if(flag == 'tmofPon'){
    		$('#tmofListPon').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#tmofListPon').setData({ data:option_data });
    	}

    	// 전송실
    	if(flag == 'tmofRgMux'){
    		$('#tmofListRgMux').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#tmofListRgMux').setData({ data:option_data });
    	}

    	// 전송실-팀다중선택시
    	if(flag == 'multitmofMux'){
    		$('#tmofListMux').clear();
    		var option_data = [];
    		for(var i=0; i<response.teamTmofList.length; i++){
    			var resObj = response.teamTmofList[i];
    			option_data.push(resObj);
    		}
    		$('#tmofListMux').setData({ data:option_data });
    	}
    	if(flag == 'multitmofPon'){
    		$('#tmofListPon').clear();
    		var option_data = [];
    		for(var i=0; i<response.teamTmofList.length; i++){
    			var resObj = response.teamTmofList[i];
    			option_data.push(resObj);
    		}
    		$('#tmofListPon').setData({ data:option_data });
    	}

    	// 전송실-팀다중선택시
    	if(flag == 'multitmofRgMux'){
    		$('#tmofListRgMux').clear();
    		var option_data = [];
    		for(var i=0; i<response.teamTmofList.length; i++){
    			var resObj = response.teamTmofList[i];
    			option_data.push(resObj);
    		}
    		$('#tmofListRgMux').setData({ data:option_data });
    	}

    	//제조사
    	if(flag == 'bpMux'){
			$('#bpIdListMux').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpIdListMux').setData({
	             data:option_data
			});
		}

    	if(flag == 'bpPon'){
    		$('#bpIdListPon').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#bpIdListPon').setData({
    			data:option_data
    		});
    	}

    	//제조사
    	if(flag == 'bpRgMux'){
			$('#bpIdListRgMux').clear();
			var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#bpIdListRgMux').setData({
	             data:option_data
			});
		}

    	if(flag == 'searchTab1'){
    		$('#'+gridTab1).alopexGrid('hideProgress');
        	setGrid(gridTab1, response, response.resultList);
    	}

    	if(flag == 'searchTab2'){
    		$('#'+gridTab2).alopexGrid('hideProgress');
        	setGrid(gridTab2, response, response.resultList);
    	}

    	if(flag == 'searchTab3'){
    		$('#'+gridTab3).alopexGrid('hideProgress');
        	setGrid(gridTab3, response, response.resultList);
    	}

    	if(flag == 'stdCalendar'){

    		var weekVal = null;
    		var monVal = null;
    		var yearVal = null;

    		if(response.length > 0){
    			weekVal = response[0].mthStdWkDgr;
    			monVal = response[0].wkStdMthVal;
    			yearVal = response[0].wkStdYr;
    		} else {
    			var cDate = new Date();
    	    	cDate.setDate(cDate.getDate());
    	    	clctDtDay = cDate.getDate();
    	    	clctDtMon = cDate.getMonth() + 1;
    	    	clctDtYear = cDate.getFullYear();
    	   		clctDtMon = parseInt(clctDtMon) < 10 ? '0' + clctDtMon : clctDtMon;
    	   		clctDtDay = parseInt(clctDtDay) < 10 ? '0' + clctDtDay : clctDtDay;

    	   		weekVal = getWeek(clctDtYear + '' + clctDtMon + '' + clctDtDay);
    	   		monVal = clctDtMon;
    	   		yearVal = clctDtYear;
    		}

    		// 기준년 SET
    		$('#selectYearMux').val(yearVal);
    		$('#selectYearPon').val(yearVal);
    		$('#selectYearRgMux').val(yearVal);

    		// 기준월 SET
    		$('#selectMonMux').val(monVal);
    		$('#selectMonPon').val(monVal);
    		$('#selectMonRgMux').val(monVal);

    		// 기준주차 SET
    		$('#selectWeekMux').val(weekVal);
    		$('#selectWeekPon').val(weekVal);
    		$('#selectWeekRgMux').val(weekVal);
    	}

    	//ONS 부분

    	if(flag == 'fstOnsOrgMux'){

			$('#onsOrgIdMux').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
	   			for(var i=0; i<response.length; i++){
	   				var resObj = response[i];
	   				option_data.push(resObj);
	   				if(resObj.orgId == sUprOrgId) {
	   					selectId = resObj.orgId;
	   				}
	   			}
	   			if(selectId == null){
//	   				selectId = response[0].orgId;
	   				sUprOrgId = selectId;
	   			}
	   			$('#onsOrgIdMux').setData({
	   				data:option_data ,
	   				onsOrgIdMux:selectId
	   			});
	   		}

	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
//	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrg/' + sUprOrgId, null, 'GET', 'fstOnsTeamMux');
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsTeamGrp/ONS', null, 'GET', 'fstOnsTeamMux');
    	}

    	if(flag == 'fstOnsOrgPon'){

    		$('#onsOrgIdPon').clear();

    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		var selectId = null;
    		if(response.length > 0){
    			for(var i=0; i<response.length; i++){
    				var resObj = response[i];
    				option_data.push(resObj);
    				if(resObj.orgId == sUprOrgId) {
    					selectId = resObj.orgId;
    				}
    			}
    			if(selectId == null){
    				sUprOrgId = selectId;
    			}
    			$('#onsOrgIdPon').setData({
    				data:option_data ,
    				onsOrgIdPon:selectId
    			});
    		}

    		//본부 세션값이 있을 경우 해당 팀,전송실 조회
//    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrg/' + sUprOrgId, null, 'GET', 'fstOnsTeamPon');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsTeamGrp/ONS', null, 'GET', 'fstOnsTeamPon');
    	}

    	if(flag == 'fstOnsOrgRgMux'){

			$('#onsOrgIdRgMux').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
	   			for(var i=0; i<response.length; i++){
	   				var resObj = response[i];
	   				option_data.push(resObj);
	   				if(resObj.orgId == sUprOrgId) {
	   					selectId = resObj.orgId;
	   				}
	   			}
	   			if(selectId == null){
	   				sUprOrgId = selectId;
	   			}
	   			$('#onsOrgIdRgMux').setData({
	   				data:option_data ,
	   				onsOrgIdRgMux:selectId
	   			});
	   		}

	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
//	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsOrg/' + sUprOrgId, null, 'GET', 'fstOnsTeamRgMux');
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/onsTeamGrp/ONS', null, 'GET', 'fstOnsTeamRgMux');
    	}

    	//ONS 팀
    	if(flag == 'fstOnsTeamMux'){

  			$('#onsTeamIdListMux').clear();
  			var option_data =  [];
      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#onsTeamIdListMux').setData({ data:option_data});

      		}
    	}

    	if(flag == 'fstOnsTeamPon'){

    		$('#onsTeamIdListPon').clear();
    		var option_data =  [];
    		var selectId = null;
    		if(response.length > 0){
    			for(var i=0; i<response.length; i++){
    				var resObj = response[i];
    				option_data.push(resObj);
    				if(resObj.orgId == sOrgId) {
    					selectId = resObj.orgId;
    				}
    			}
    			if(selectId == null){
    				selectId = response[0].orgId;
    			}
    			$('#onsTeamIdListPon').setData({ data:option_data});

    		}
    	}

    	//팀
    	if(flag == 'fstOnsTeamRgMux'){

  			$('#onsTeamIdListRgMux').clear();
  			var option_data =  [];
      		var selectId = null;
      		if(response.length > 0){
  	    		for(var i=0; i<response.length; i++){
  	    			var resObj = response[i];
  	    			option_data.push(resObj);
  	    			if(resObj.orgId == sOrgId) {
  						selectId = resObj.orgId;
  					}
  	    		}
  	    		if(selectId == null){
  	    			selectId = response[0].orgId;
	    		}
  	    		$('#onsTeamIdListRgMux').setData({ data:option_data});

      		}
    	}

    }

    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'searchTab1'){
    		$('#'+gridTab1).alopexGrid('hideProgress');
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'searchTab2'){
    		$('#'+gridTab2).alopexGrid('hideProgress');
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}

    	if(flag == 'searchTab3'){
    		$('#'+gridTab3).alopexGrid('hideProgress');
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function setGrid(GridID, Option, Data) {
    	var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    		};
    	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

    function getWeek(date){

        //주차를 계산하고픈 일 달력 생성
        var wkDtCal = new Date( date.substring(0,4) , date.substring(4,6)-1 , date.substring(6,8) );

        var day = wkDtCal.getDay();

        var currentDate = wkDtCal.getDate();

        var week = (currentDate - day)+1

        prefixes=['1','2','3','4','5'];

        return prefixes[0|week/7];
    }
    /*------------------------*
	* 엑셀 ON-DEMAND 다운로드
	*------------------------*/

	//ondemand request 호출
    function httpRequestOndemand(Url, Param, SuccessCallback, FailCallback, Method ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		      data : Param, //data가 존재할 경우 주입
    		      method : Method //HTTP Method
    		}).done(SuccessCallback) //success callback function 정의
    		  .fail(FailCallback) //fail callback function 정의
    		  //.error(); //error callback function 정의 optional
    }

	function btnExportMuxExcelOnDemandClickEventHandler(event){

		var param =  getParamData();
		param = gridExcelColumn(param, gridTab1);
   		param.pageNo = 1;
   		param.rowPerPage = 60;
   		param.firstRowIndex = 1;
   		param.lastRowIndex = 1000000000;

        var now = new Date();
        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
        var excelFileNm = 'FrontHaul_MUX_'+dayTime;
        param.fileName = excelFileNm;
   		param.fileExtension = "xlsx";
   		param.excelPageDown = "N";
   		param.excelUpload = "N"
   		param.excelMethod = "frontHaulLkupMux";
   		param.excelFlag = "FrontHaul5GMUX";
   		fileOnDemendName = excelFileNm+".xlsx";

//		param = param.replace(/%/g,'%25');
//		param = encodeURI(param);

//		$('#'+gridTab1).alopexGrid('showProgress');
//		console.log("Excel param : ", param);
		httpRequestOndemand('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, successCallbackOnDemandExcel, failCallback, 'POST');


	}

	function btnExportPonExcelOnDemandClickEventHandler(event){

		var param =  getParamData();
		param = gridExcelColumn(param, gridTab2);
		param.pageNo = 1;
		param.rowPerPage = 60;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;

		var now = new Date();
		var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
		var excelFileNm = 'FrontHaul_PON_'+dayTime;
		param.fileName = excelFileNm;
		param.fileExtension = "xlsx";
		param.excelPageDown = "N";
		param.excelUpload = "N"
		param.excelMethod = "frontHaulLkupPon";
		param.excelFlag = "FrontHaul5GPON";
		fileOnDemendName = excelFileNm+".xlsx";

//		param = param.replace(/%/g,'%25');
//		param = encodeURI(param);

//		$('#'+gridTab2).alopexGrid('showProgress');
//		console.log("Excel param : ", param);
		httpRequestOndemand('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, successCallbackOnDemandExcel, failCallback, 'POST');


	}

	function btnExportRgMuxExcelOnDemandClickEventHandler(event){

		var param =  getParamData();
		param = gridExcelColumn(param, gridTab3);
   		param.pageNo = 1;
   		param.rowPerPage = 60;
   		param.firstRowIndex = 1;
   		param.lastRowIndex = 1000000000;

        var now = new Date();
        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
        var excelFileNm = 'FrontHaul_RGMUX_'+dayTime;
        param.fileName = excelFileNm;
   		param.fileExtension = "xlsx";
   		param.excelPageDown = "N";
   		param.excelUpload = "N"
   		param.excelMethod = "frontHaulLkupRgMux";
   		param.excelFlag = "FrontHaulRGMUX";
   		fileOnDemendName = excelFileNm+".xlsx";

//		param = param.replace(/%/g,'%25');
//		param = encodeURI(param);

//		$('#'+gridTab1).alopexGrid('showProgress');
//		console.log("Excel param : ", param);
		httpRequestOndemand('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, successCallbackOnDemandExcel, failCallback, 'POST');


	}

	function successCallbackOnDemandExcel(response){

		$('#'+mTargetGrid).alopexGrid('hideProgress');
		console.log('excelCreate - OnDemand Grid', mTargetGrid);
		console.log("successCallbackOnDemandExcel : ", response);

		var jobInstanceId = response.resultData.jobInstanceId;
		// 엑셀다운로드팝업
		$a.popup({
            popid: 'CommonExcelDownlodPop' + jobInstanceId,
            title: '엑셀다운로드',
            iframe: true,
            modal : false,
            windowpopup : true,
            url: '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
            data: {
                jobInstanceId : jobInstanceId,
                fileName : fileOnDemendName,
                fileExtension : "xlsx"
            },
            width : 500,
            height : 300
            ,callback: function(resultCode) {
                if (resultCode == "OK") {
                }
            }
        });
	}

	//Excel
    function gridExcelColumn(param, gridId) {
    	var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");

		param.headerGrpCnt = 1;
		var excelHeaderGroupTitle = "";
		var excelHeaderGroupColor = "";
		var excelHeaderGroupFromIndex = "";
		var excelHeaderGroupToIndex = "";


		var excelHeaderGroupFromIndexTemp = "";
		var excelHeaderGroupToIndexTemp = "";
		var excelHeaderGroupTitleTemp ="";
		var excelHeaderGroupColorTemp = "";

		var toBuf = "";


		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {
			//이이콘컬럼 제거
			var groupMappingList = gridColmnInfo[i].groupMappingList.filter((el) => (el.key != 'bhRingLkupIcon'
				&& el.key != 'bhLineLkupIcon'
				&& el.key != 'fhRingLkupIcon'
				&& el.key != 'fhLineLkupIcon'));

			if (i== gridColmnInfo.length-1) {
				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (groupMappingList.length-1)+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (groupMappingList.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (groupMappingList.length-1)+ ";";
				toBuf =  toBuf + (groupMappingList.length)
			}

			excelHeaderGroupTitleTemp += gridColmnInfo[i].title + ";";
			excelHeaderGroupColorTemp +='undefined'+ ";";

		}

		for (var i = gridColmnInfo.length-1; i>=0 ; i--) {

			excelHeaderGroupFromIndex += excelHeaderGroupFromIndexTemp.split(";")[i] + ";";
			excelHeaderGroupToIndex += excelHeaderGroupToIndexTemp.split(";")[i] + ";";
			excelHeaderGroupTitle += excelHeaderGroupTitleTemp.split(";")[i] + ";";
			excelHeaderGroupColor += excelHeaderGroupColorTemp.split(";")[i] + ";";

		}

		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined
					&& gridHeader[i].key != "id"
					&& gridHeader[i].key != 'bhRingLkupIcon'
					&& gridHeader[i].key != 'bhLineLkupIcon'
					&& gridHeader[i].key != 'fhRingLkupIcon'
					&& gridHeader[i].key != 'fhLineLkupIcon'

			)) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title.replace(/<br>/gi, " ");
				excelHeaderNm += ";";
				excelHeaderAlign += gridHeader[i].align;
				excelHeaderAlign += ";";
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ";";
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;
		return param;
	}

});