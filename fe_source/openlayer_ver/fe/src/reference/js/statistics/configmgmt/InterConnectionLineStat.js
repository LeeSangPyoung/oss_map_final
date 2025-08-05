$a.page( function() {
	var gridId = 'dataGrid';
	
	var bonbuDataSkt = [];		// SKT 본부데이터
	var teamDataSkt = [];		// SKT 팀데이터
	var mtsoDataSkt = [];		// SKT 전송실데이터

	this.init = function(id, param) {
		$('#btnExportExcel').setEnabled(false);
		
		tomfHeaderYn = "Y";

		initGrid();
    	setSelectCode();
        setEventListener();
	};
	
	//Grid 초기화
	function initGrid(flag) {
		if(flag == 'search') {
			var mapping = [
           				{ key: 'lnkgBizrCdNm', 		align: 'center', 		width: '110px', 	title: cflineMsgArray['communicationBusinessMan'],		rowspan: true		/* 통신사업자 */ }
           				, { key: 'bonbuNm', 		align: 'left', 		width: '150px', 	title: cflineMsgArray['hdofc'],		rowspan: true		/* 본부 */ }
           				, { key: 'mtsoNm', 		align: 'center', 		width: '150px', 	title: cflineMsgArray['transmissionOffice']	/* 전송실 */ }
           				
           				//SKT
           				, { key: 'sktBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}		/* BOTH */ }
           				, { key: 'sktIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'sktOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSkt', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//SKT2
           				, { key: 'sktTwoBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'sktTwoIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'sktTwoOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSktTwo', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//SKT, SKT2 ALL
           				, { key: 'sktAllBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"},		hidden: true	/* BOTH */ }
           				, { key: 'sktAllIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"},		hidden: true	/* IC */ }
           				, { key: 'sktAllOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"},		hidden: true	/* OG */ }
           				, { key: 'subSktAll', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"},		hidden: true	/* 소계 */ }
           				
           				//KT
           				, { key: 'ktBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'ktIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'ktOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subKt', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//드림라인
           				, { key: 'dlBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'dlIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'dlOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subDl', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//SJ
           				, { key: 'sjBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'sjIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'sjOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSj', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//데이콤
           				, { key: 'dcBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'dcIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'dcOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subDc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//LGU
           				, { key: 'lguBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'lguIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'lguOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subLgu', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//SKB
           				, { key: 'skbBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'skbIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'skbOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSkb', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//CJ헬로비전
           				, { key: 'cjBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'cjIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'cjOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subCj', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//씨엔엠
           				, { key: 'cnmBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'cnmIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'cnmOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subCnm', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//SKTelink
           				, { key: 'sktLkBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'sktLkIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'sktLkOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSktLk', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//온세텔레콤
           				, { key: 'otBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'otIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'otOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subOt', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//기타
           				, { key: 'etcBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'etcIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'etcOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subEtc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//합계
           				, { key: 'subTot', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['summarization'],		render: {type:"string", rule : "comma"}			/* 합계 */ }
              ]
			
			var headerMapping = [
												{ fromIndex: 'bonbuNm', toIndex: 'mtsoNm', title: cflineMsgArray['offerSection']		/* 제공구간 */}
												, { fromIndex: 'sktBoth', toIndex: 'subTot', title: cflineMsgArray['facilitiesOfferBusinessMan']		/* 설비제공사업자 */}
												, { fromIndex: 'sktBoth', toIndex: 'subSkt', title: cflineMsgArray['skTelecom']		/* SKT */}
												, { fromIndex: 'sktTwoBoth', toIndex: 'subSktTwo', title: cflineMsgArray['skt2']		/* SKT2 */}
												, { fromIndex: 'sktAllBoth', toIndex: 'subSktAll', title: "ALL"		/* ALL */}
												, { fromIndex: 'ktBoth', toIndex: 'subKt', title: cflineMsgArray['koreaTelecom']		/* KT */}
												, { fromIndex: 'dlBoth', toIndex: 'subDl', title: cflineMsgArray['dreamLine']		/* 드림라인 */}
												, { fromIndex: 'sjBoth', toIndex: 'subSj', title: cflineMsgArray['sj']		/* sj */}
												, { fromIndex: 'dcBoth', toIndex: 'subDc', title: cflineMsgArray['dacom']		/*  데이콤 */}
												, { fromIndex: 'lguBoth', toIndex: 'subLgu', title: cflineMsgArray['lgUplus']		/* LGU */}
												, { fromIndex: 'skbBoth', toIndex: 'subSkb', title: cflineMsgArray['skBroadBand']		/* SKB */}
												, { fromIndex: 'cjBoth', toIndex: 'subCj', title: cflineMsgArray['cjHello']		/* CJ헬로비전 */}
												, { fromIndex: 'cnmBoth', toIndex: 'subCnm', title: cflineMsgArray['cnm']		/* 씨엔엠 */}
												, { fromIndex: 'sktLkBoth', toIndex: 'subSktLk', title: cflineMsgArray['sktelink']		/* SKTelink */}
												, { fromIndex: 'otBoth', toIndex: 'subOt', title: cflineMsgArray['onseTelecom']		/* 온세텔레콤 */}
												, { fromIndex: 'etcBoth', toIndex: 'subEtc', title: cflineMsgArray['etc']		/* 기타 */}
				                         ]
		} else {
			var mapping = [
           				{ key: 'lnkgBizrCdNm', 		align: 'center', 		width: '110px', 	title: cflineMsgArray['communicationBusinessMan'],		rowspan: true		/* 통신사업자 */ }
           				, { key: 'offerSection', 		align: 'left', 		width: '180px', 	title: cflineMsgArray['offerSection']	/* 제공구간 */ }
           				
           				//SKT
           				, { key: 'sktBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'sktIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'sktOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSkt', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//KT
           				, { key: 'ktBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'ktIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'ktOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subKt', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//SKT2
           				, { key: 'sktTwoBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'sktTwoIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'sktTwoOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSktTwo', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//드림라인
           				, { key: 'dlBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'dlIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'dlOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subDl', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				///SJ
           				, { key: 'sjBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'sjIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'sjOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subSj', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
           				
           				//데이콤
           				, { key: 'dcBoth', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['both'],		render: {type:"string", rule : "comma"}			/* BOTH */ }
           				, { key: 'dcIc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['ic'],		render: {type:"string", rule : "comma"}			/* IC */ }
           				, { key: 'dcOg', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['og'],		render: {type:"string", rule : "comma"}			/* OG */ }
           				, { key: 'subDc', 		align: 'right', 		width: '90px', 	title: cflineMsgArray['subTotal'],		render: {type:"string", rule : "comma"}			/* 소계 */ }
              ]
			
			var headerMapping = [
												{ fromIndex: 'sktBoth', toIndex: 'subSkt', title: cflineMsgArray['skTelecom']		/* SKT */}
												, { fromIndex: 'ktBoth', toIndex: 'subKt', title: cflineMsgArray['koreaTelecom']		/* KT */}
												, { fromIndex: 'sktTwoBoth', toIndex: 'subSktTwo', title: cflineMsgArray['skt2']		/* SKT2 */}
												, { fromIndex: 'dlBoth', toIndex: 'subDl', title: cflineMsgArray['dreamLine']		/* 드림라인 */}
												, { fromIndex: 'sjBoth', toIndex: 'subSj', title: cflineMsgArray['sj']		/* sj */}
												, { fromIndex: 'dcBoth', toIndex: 'subDc', title: cflineMsgArray['dacom']		/*  데이콤 */}
				                         ]
		}
		
		$('#'+gridId).alopexGrid('updateOption', {headerGroup: headerMapping});
		$('#'+gridId).alopexGrid('updateOption', {columnMapping: mapping});

		//Grid 생성
		$('#' + gridId).alopexGrid({
			autoColumnIndex: true,
			fitTableWidth: true,
			disableTextSelection: true,
			cellSelectable : true,
			rowInlineEdit : false,
			numberingColumnFromZero : false,
			height : 550,
			message : {
	    	   nodata : "<div class = 'no_data'><i class = 'fa fa-exclamation-triangle'></i>" + cflineCommMsgArray['noInquiryData'],	/* '조회된 데이터가 없습니다.' */
			   filterNodata : 'No data'
			},
			columnMapping : mapping,
			hearderGroup : headerMapping,
			grouping: {
						  by: ['lnkgBizrCdNm', 'bonbuNm'],
						  useGrouping: true,
						  useGroupRowspan: true
			}
		});
	}
	
	//조회조건 세팅
	function setSelectCode() {
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/interconnectionlinestat/getSelectBonbuList', null, 'GET', 'bonbuDataSkt');
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/interconnectionlinestat/getSelectTeamList', null, 'GET', 'teamDataSkt');
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/interconnectionlinestat/getSelectMtsoList', null, 'GET', 'mtsoDataSkt');
	}
	
	function setEventListener() {
		//조회 선택시
		$('#btnSearch').on('click', function(e) {
			searchProc();
			initGrid('search');
		});
		
		//Excel 이벤트
		$('#btnExportExcel').on('click', function(e) {
			excelDownload();
		});
		
		//본부 선택시
		$('#bonbuId').on('change', function(e) {
			changeBonbu();
		});
		
		//팀 선택시
    	$('#teamId').on('change',function(e){
    		changeTeam();
    	});
	}
	
	//조회 함수
	function searchProc() {
		cflineShowProgressBody();
		
		var param = $("#searchForm").getData();
		
		httpRequest('tango-transmission-biz/transmission/statistics/configmgmt/interconnectionlinestat/getInterConnectionList', param, 'GET', 'searchList');
	}

	//request 성공시
	function successCallback(response, status, jqxhr, flag) {
    	//조회
		if(flag == 'searchList') {
			if(response.result.length > 0) {
	    		$('#btnExportExcel').setEnabled(true);
			}
			$('#'+gridId).alopexGrid('dataSet', response.result);
    		cflineHideProgressBody();
		}
		
		//SKT 본부 리스트 조회
		if(flag == 'bonbuDataSkt') {
			setSearchDataBySKT(response, 'bonbuDataSkt');
		}
		
		//SKT 팀 리스트 조회
		if(flag == 'teamDataSkt') {
			setSearchDataBySKT(response, 'teamDataSkt');
		}
		
		//SKT 전송실 리스트 조회
		if(flag == 'mtsoDataSkt') {
			setSearchDataBySKT(response, 'mtsoDataSkt');
		}
	}

	//request 실패시
	function failCallback(response, status, flag) {
		if(flag == 'searchList') {
			cflineHideProgressBody();
			alertBox('I', cflineMsgArray['searchFail']);		/* 조회 실패 하였습니다. */
		}
	}
	
	//SKT 조회조건 세팅
	function setSearchDataBySKT(response, flag) {
		if(flag == 'bonbuDataSkt') {
			bonbuDataSkt.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});
			
			for(b = 0; b < response.bonbuList.length; b++) {
    			var bonbuList = response.bonbuList[b];
    			bonbuDataSkt.push(bonbuList);
    		}
    		
    		$('#bonbuId').clear();
    		$('#bonbuId').setData({data: bonbuDataSkt});
		} else if (flag == 'teamDataSkt') {
			teamDataSkt.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});
    		
    		for(t = 0; t < response.teamList.length; t++) {
    			var teamList = response.teamList[t];
    			teamDataSkt.push(teamList);
    		}
    		
    		$('#teamId').clear();
    		$('#teamId').setData({data: teamDataSkt});
		} else {
			mtsoDataSkt.push({value: "",text: cflineCommMsgArray['all'] /*전체*/});

    		for(m = 0; m < response.mtsoList.length; m++) {
    			var mtsoList = response.mtsoList[m];
    			mtsoDataSkt.push(mtsoList);
    		}
    		
    		$('#mtsoId').clear();
    		$('#mtsoId').setData({data: mtsoDataSkt});
		}
	}
	
	//본부 선택시
	function changeBonbu() {
		var teamList = [];
		var mtsoList = [];
		
		if($('#bonbuId').val() == '' || $('#bonbuId').val() == null) {
			$('#teamId').setData({data: teamDataSkt});
			$('#mtsoId').setData({data: mtsoDataSkt});
		} else {
			teamList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			
			for(t = 0; t < teamDataSkt.length; t++){
				if($('#bonbuId').val() == teamDataSkt[t].bonbuId) {
					teamList.push(teamDataSkt[t]);
				}
				$('#teamId').clear();
				$('#teamId').setData({data: teamList});
			}
			
			for(m = 0; m < mtsoDataSkt.length; m++){
				if($('#bonbuId').val() == mtsoDataSkt[m].bonbuId) {
					mtsoList.push(mtsoDataSkt[m]);
				}
				$('#mtsoId').clear();
				$('#mtsoId').setData({data: mtsoList});
			}
		}
	}
	
	//팀 선택시
	function changeTeam() {
		var mtsoList = [];
		
		if($('#teamId').val() == '' || $('#teamId').val() == null) {
			if($('#bonbuId').val() == '' || $('#bonbuId').val() == null) {
				$('#mtsoId').setData({data: mtsoDataSkt});
			} else {
				mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
				
				for(m = 0; m < mtsoDataSkt.length; m++ ){
					if($('#bonbuId').val() == mtsoDataSkt[m].bonbuId) {
						mtsoList.push(mtsoDataSkt[m]);
					}
					$('#mtsoId').clear();
					$('#mtsoId').setData({data: mtsoList});
				}
			}
		} else {
			mtsoList.push({value: "",text: cflineCommMsgArray['all']	/*전체*/});
			
			for(m = 0 ; m < mtsoDataSkt.length; m++){
				if($('#teamId').val() == mtsoDataSkt[m].teamId) {
					mtsoList.push(mtsoDataSkt[m]);
				}
				$('#mtsoId').clear();
				$('#mtsoId').setData({data: mtsoList});
			}
		}
	}
	
	var httpRequest = function(Url, Param, Method, Flag) {
		Tango.ajax({
			url : Url,		//URL기존처럼 사용
			data : Param,		//data가 존재할 경우 주입
			method : Method, 		//HTTP Method
			flag : Flag
		}).done(successCallback)
			.fail(failCallback);
	}
	
	//엑셀다운로드
	function excelDownload() {
		cflineShowProgressBody();
		
		var date = getCurrDate();
		var worker = new ExcelWorker({
			excelFileName : cflineMsgArray['interConnectionLineStat'] + "_" + date,
			sheetList : [{
				sheetName : cflineMsgArray['interConnectionLineStat'],
				placement : 'vertical',
				$grid : $('#' + gridId)
			}]
		});
		
		worker.export({
			merge : true,
			exportHidden : false,
			useGridColumnWidth : true,
			border : true,
			useCSSParser : true
		});
		cflineHideProgressBody();
	}
});