/**
 * FacilitiesListGrid.js
 * 설비목록 DataGrid정의
 *
 * @author Jeong,JungSig
 * @date 2016. 8. 31. 오후 3:50:00
 * @version 1.0
 */

var FacilitiesListGrid = (function($, Tango, _){
	var options = {};
	
	//광중계기광코아 Grid option
	options.defineOptDataGrid = {
		filteringHeader: false,//필터 로우 visible
		hideSortingHandle : true,//Sorting 표시 visible
		rowClickSelect : true,
		rowSingleSelect : true,
		rowSingleSelectAllowUnselect : true,
		autoColumnIndex : true,
		rowindexColumnFromZero : false,
		defaultColumnMapping:{
			align : 'center',
			sorting: false
		},
		columnMapping: [{key : 'check', selectorColumn : true, width : '36px', hidden : true},	               
	                {key : 'fcltsDivCd', hidden : true},
	                {key : 'hdofcOrgNm', title : '본부', width : '120px'},
	                {key : 'teamOrgNm', title : '팀', width : '120px'},
	                {key : 'trmsMtsoId', hidden : true},
	                {key : 'trmsMtsoNm', title : '전송실', width : '140px'},
	                {key : 'leslNo', title : '임차회선번호', width : '100px'},
	                {key : 'leslStatNm', title : '임차회선상태', width : '100px'},
	                {key : 'svlnNo', title : '서비스회선번호', width : '120px'},
	                {key : 'svlnStatNm', title : '서비스회선상태', width : '120px'},
	                {key : 'trmnPsblFlag',  align:'center', title : '해지가능여부', width : '90px'},
	                {key : 'subSvntCnt', title : '광공유모듈건수', width : '120px'},
    			    {key : 'uprIntgFcltsCd', 	align:'center',	title : '상위통합시설코드',	hidden : true}, 
    			    {key : 'uprIntgFcltsNm', 	align:'center',	title : '상위통합시설명',	hidden : true}, 
    			    {key : 'uprPraDivNm', 		align:'center',	title : '상위통합시설활용구분',	hidden : true}, 
    			    {key : 'lowIntgFcltsCd', 	align:'center',	title : '하위통합시설코드',	width: '120px'}, 
    			    {key : 'lowIntgFcltsNm', 	align:'center',	title : '하위통합시설명',	width: '180px'}, 
    			    {key : 'lowPraDivNm', 		align:'center',	title : '하위통합시설활용구분',	width: '160px'}, 
	                {key : 'umtsoNm', title : '기지국', width : '120px'},
	                {key : 'leslStatCd', hidden : true},
	                {key : 'lesDistm', title : '과금거리', width : '90px'},
	                {key : 'otdrDistm', title : 'OTDR거리', width : '90px'},
	                {key : 'roabDistm', title : '도상거리', width : '90px'},
	                {key : 'coreCnt', title : '코아수', width : '90px'},
	                {key : 'leslAppltDtm', title : '청약일', width : '90px'},
	                {key : 'leslOpenDtm', title : '개통일', width : '90px'},
	                {key : 'leslTrmnDtm', title : '해지일', width : '90px'},
	                {key : 'lastChgDate', title : '변경일', width : '90px'},
	                {key : 'lesCommBizrId', hidden : true},
	                {key : 'lesCommBizrNm', title : '사업자', width : '90px'},
	                {key : 'chrYn', title : '과금여부', width : '90px'},
	                {key : 'umtsoNm', title : '상위국', width : '120px'},
	                {key : 'umtsoAddr', title : '상위국주소', width : '180px'},
	                {key : 'lmtsoNm', title : '하위국', width : '120px'},
	                {key : 'lmtsoAddr', title : '하위국주소', width : '180px'},
	                {key : 'lesRqsRmk', title : '비고', width : '180px'},
                    {key : 'ovpyObjYn',         align:'center', title : '과오납대상여부',  width: '120px'},
                    {key : 'ovpyOccrYm',        align:'center', title : '과오납발생년월',  width: '120px'},
                    {key : 'ovpyRmdySchdDt',    align:'center', title : '과오납해소예정일자',  width: '140px'},
                    {key : 'ovpyOccrRsnNm',     align:'center', title : '과오납발생사유',  width: '120px'},
                    {key : 'ovpyRmdyWayNm',     align:'center', title : '과오납해소방안',  width: '120px'},
                    {key : 'engstNo', 			align:'center',	title : 'Eng. Sheet No',			width: '120px'}, 
                    {key : 'lnkgLineIdVal',  align:'left', title : 'TEAMS회선번호',   width: '200px'}, 
                    {key : 'lineRmk1',  align:'left', title : '비고1',   width: '400px'}, 
                    {key : 'lowMtsoId2',    align:'center', title : '하위통합시설코드2', width: '140px'}, 
                    {key : 'lowMtsoNm2',    align:'center', title : '하위통합시설명2',   width: '140px'}, 
                    {key : 'lowPraDivNm2',  align:'center', title : '하위통합시설활용구분2',   width: '160px'}, 
                    {key : 'lowMtsoId3',    align:'center', title : '하위통합시설코드3', width: '140px'}, 
                    {key : 'lowMtsoNm3',    align:'center', title : '하위통합시설명3',   width: '140px'}, 
                    {key : 'lowPraDivNm3',  align:'center', title : '하위통합시설활용구분3',   width: '160px'}, 
                    {key : 'lowMtsoId4',    align:'center', title : '하위통합시설코드4', width: '140px'}, 
                    {key : 'lowMtsoNm4',    align:'center', title : '하위통합시설명4',   width: '140px'}, 
                    {key : 'lowPraDivNm4',  align:'center', title : '하위통합시설활용구분4',   width: '160px'}, 
                    {key : 'lowMtsoId5',    align:'center', title : '하위통합시설코드5', width: '140px'}, 
                    {key : 'lowMtsoNm5',    align:'center', title : '하위통합시설명5',   width: '140px'}, 
                    {key : 'lowPraDivNm5',  align:'center', title : '하위통합시설활용구분5',   width: '160px'}, 
                    {key : 'lowMtsoId6',    align:'center', title : '하위통합시설코드6', width: '140px'}, 
                    {key : 'lowMtsoNm6',    align:'center', title : '하위통합시설명6',   width: '140px'}, 
                    {key : 'lowPraDivNm6',  align:'center', title : '하위통합시설활용구분6',   width: '160px'}, 
                    {key : 'lowMtsoId7',    align:'center', title : '하위통합시설코드7', width: '140px'}, 
                    {key : 'lowMtsoNm7',    align:'center', title : '하위통합시설명7',   width: '140px'}, 
                    {key : 'lowPraDivNm7',  align:'center', title : '하위통합시설활용구분7',   width: '160px'}, 
                    {key : 'lowMtsoId8',    align:'center', title : '하위통합시설코드8', width: '140px'}, 
                    {key : 'lowMtsoNm8',    align:'center', title : '하위통합시설명8',   width: '140px'}, 
                    {key : 'lowPraDivNm8',  align:'center', title : '하위통합시설활용구분8',   width: '160px'}, 
                    {key : 'lowMtsoId9',    align:'center', title : '하위통합시설코드9', width: '140px'}, 
                    {key : 'lowMtsoNm9',    align:'center', title : '하위통합시설명9',   width: '140px'}, 
                    {key : 'lowPraDivNm9',  align:'center', title : '하위통합시설활용구분9',   width: '160px'}, 
                    {key : 'lowMtsoId10',    align:'center', title : '하위통합시설코드10', width: '140px'}, 
                    {key : 'lowMtsoNm10',    align:'center', title : '하위통합시설명10',   width: '140px'}, 
                    {key : 'lowPraDivNm10',  align:'center', title : '하위통합시설활용구분10',   width: '160px'}, 
                    {key : 'lowMtsoId11',    align:'center', title : '하위통합시설코드11', width: '140px'}, 
                    {key : 'lowMtsoNm11',    align:'center', title : '하위통합시설명11',   width: '140px'}, 
                    {key : 'lowPraDivNm11',  align:'center', title : '하위통합시설활용구분11',   width: '160px'}, 
                    {key : 'lowMtsoId12',    align:'center', title : '하위통합시설코드12', width: '140px'}, 
                    {key : 'lowMtsoNm12',    align:'center', title : '하위통합시설명12',   width: '140px'}, 
                    {key : 'lowPraDivNm12',  align:'center', title : '하위통합시설활용구분12',   width: '160px'}, 
                    {key : 'lowMtsoId13',    align:'center', title : '하위통합시설코드13', width: '140px'}, 
                    {key : 'lowMtsoNm13',    align:'center', title : '하위통합시설명13',   width: '140px'}, 
                    {key : 'lowPraDivNm13',  align:'center', title : '하위통합시설활용구분13',   width: '160px'}, 
                    {key : 'lowMtsoId14',    align:'center', title : '하위통합시설코드14', width: '140px'}, 
                    {key : 'lowMtsoNm14',    align:'center', title : '하위통합시설명14',   width: '140px'}, 
                    {key : 'lowPraDivNm14',  align:'center', title : '하위통합시설활용구분14',   width: '160px'}, 
                    {key : 'lowMtsoId15',    align:'center', title : '하위통합시설코드15', width: '140px'}, 
                    {key : 'lowMtsoNm15',    align:'center', title : '하위통합시설명15',   width: '140px'}, 
                    {key : 'lowPraDivNm15',  align:'center', title : '하위통합시설활용구분15',   width: '160px'}, 
                    {key : 'lowMtsoId16',    align:'center', title : '하위통합시설코드16', width: '140px'}, 
                    {key : 'lowMtsoNm16',    align:'center', title : '하위통합시설명16',   width: '140px'}, 
                    {key : 'lowPraDivNm16',  align:'center', title : '하위통합시설활용구분16',   width: '160px'}, 
                    {key : 'lowMtsoId17',    align:'center', title : '하위통합시설코드17', width: '140px'}, 
                    {key : 'lowMtsoNm17',    align:'center', title : '하위통합시설명17',   width: '140px'}, 
                    {key : 'lowPraDivNm17',  align:'center', title : '하위통합시설활용구분17',   width: '160px'}, 
                    {key : 'lowMtsoId18',    align:'center', title : '하위통합시설코드18', width: '140px'}, 
                    {key : 'lowMtsoNm18',    align:'center', title : '하위통합시설명18',   width: '140px'}, 
                    {key : 'lowPraDivNm18',  align:'center', title : '하위통합시설활용구분18',   width: '160px'}, 
                    {key : 'lowMtsoId19',    align:'center', title : '하위통합시설코드19', width: '140px'}, 
                    {key : 'lowMtsoNm19',    align:'center', title : '하위통합시설명19',   width: '140px'}, 
                    {key : 'lowPraDivNm19',  align:'center', title : '하위통합시설활용구분19',   width: '160px'}, 
                    {key : 'lowMtsoId20',    align:'center', title : '하위통합시설코드20', width: '140px'}, 
                    {key : 'lowMtsoNm20',    align:'center', title : '하위통합시설명20',   width: '140px'},
                    {key : 'lowPraDivNm20',  align:'center', title : '하위통합시설활용구분20',   width: '160px'},
	                {key : 'lastChgDate', title : '최종수정일', width : '100px'},
	                {key : 'lastChgUserId', title : '입력자Id', width : '100px'},
	    	        {key : 'umtsoDtlAddr', hidden : true},
	    	        {key : 'lmtsoDtlAddr', hidden : true},
	    	        {key : 'dnrSystmNm', hidden : true},
	    	        {key : 'rmteSystmNm', hidden : true},
	                {key : 'lesKndCd', hidden : true}
	    ],
		paging:{
			pagerSelect:true
		}
	};

	//기지국회선 Grid
	options.defineBtsDataGrid = {
			filteringHeader: false,//필터 로우 visible
			hideSortingHandle : true,//Sorting 표시 visible
			rowClickSelect : true,
			rowSingleSelect : true,
			rowSingleSelectAllowUnselect : true,
			autoColumnIndex : true,
			rowindexColumnFromZero : false,
			defaultColumnMapping:{
				resizing: true,
				align : 'center',
				sorting: true
			},
	columnMapping: [{key : 'check', selectorColumn : true, hidden : true},	               
	    	        {key : 'lesKndCd', hidden : true},
	    	        {key : 'lastChgUserId', hidden : true},
	    	        {key : 'frstRegUserId', hidden : true},					
	                {key : 'fcltsDivCd', hidden : true},
	    	        {key : 'hdofcOrgNm', title : '본부', width : '120px'},
	    	        {key : 'teamOrgNm', title : '팀', width : '120px'},
	    	        {key : 'trmsMtsoId', hidden : true},
	    	        {key : 'trmsMtsoNm', title : '전송실', width : '140px'},
	    	      //  {key : 'lineSrvcCd', hidden : true},
	    	      //  {key : 'lineSrvcNm', title : '사업구분', width : '90px'},
	    	        {key : 'umtsoNm', title : '기지국', width : '120px'},
	    	        {key : 'leslNm', title:'회선명', width : '100px'},
	    	        {key : 'leslStatCd', hidden : true},
	                {key : 'leslNo', title : '임차회선번호', width : '100px'},
	                {key : 'leslStatNm', title : '임차회선상태', width : '100px'},
	                {key : 'svlnNo', title : '서비스회선번호', width : '120px'},
	                {key : 'svlnStatNm', title : '서비스회선상태', width : '120px'},
    			    {key : 'uprIntgFcltsCd', 	align:'center',	title : '상위통합시설코드',	hidden : true}, 
    			    {key : 'uprIntgFcltsNm', 	align:'center',	title : '상위통합시설명',	hidden : true}, 
    			    {key : 'uprPraDivNm', 		align:'center',	title : '상위통합시설활용구분',	hidden : true}, 
    			    {key : 'lowIntgFcltsCd', 	align:'center',	title : '하위통합시설코드',	width: '140px'}, 
    			    {key : 'lowIntgFcltsNm', 	align:'center',	title : '하위통합시설명',	width: '180px'}, 
    			    {key : 'lowPraDivNm', 		align:'center',	title : '하위통합시설활용구분',	width: '180px'}, 
	    			{key : 'lineAppltDtm', title:'청약일', width : '90px'}, 
	    			{key : 'leslOpenDtm', title:'개통일', width : '90px'}, 
	    			{key : 'leslTrmnDtm', title:'해지일', width : '90px'}, 
	    			{key : 'lastChgDate', title:'변경일', width : '90px'},
	    			{key : 'lesCommBizrId', hidden : true},
	    			{key : 'lesCommBizrNm', title:'사업자', width : '90px'},
	    			{key : 'areaCmtsoNm', title:'지역중심국', width:'120px'},
	    			{key : 'areaCmtsoAcptYn', title:'지역중심국수용여부', width:'160px'},
	    			{key : 'lineSctnTypCd', hidden : true},
	    			{key : 'lineSctnTypNm', title:'구분', width : '90px'},
	    			{key : 'lesDistm', title:'거리', width : '90px'},	    			
	    	        {key : 'leslCapaNm', title : '회선용량', width : '90px'}, 	    	        
	    	        {key : 'chrYn', title : '과금여부', width : '90px'},
	    	        {key : 'umtsoNm', title : '상위국', width : '120px'},
	                {key : 'umtsoAddr', title : '상위국주소', width : '180px'},
	                {key : 'lmtsoNm', title : '하위국', width : '120px'},
	                {key : 'lmtsoAddr', title : '하위국주소', width : '180px'},
                    {key : 'ovpyObjYn',         align:'center', title : '과오납대상여부',  width: '120px'},
                    {key : 'ovpyOccrYm',        align:'center', title : '과오납발생년월',  width: '120px'},
                    {key : 'ovpyRmdySchdDt',    align:'center', title : '과오납해소예정일자',  width: '140px'},
                    {key : 'ovpyOccrRsnNm',     align:'center', title : '과오납발생사유',  width: '120px'},
                    {key : 'ovpyRmdyWayNm',     align:'center', title : '과오납해소방안',  width: '120px'},
                    {key : 'engstNo', 			align:'center',	title : 'Eng. Sheet No',			width: '120px'}, 
                    {key : 'lnkgLineIdVal',  align:'left', title : 'TEAMS회선번호',   width: '200px'}, 
                    {key : 'lineRmk1',  align:'left', title : '비고1',   width: '400px'}, 
	    	        {key : 'lastChgDate', title : '최종수정일', width : '90px'},
	    	        {key : 'lastChgUserId', title : '입력자Id', width : '90px'},
	    	        {key : 'umtsoDtlAddr', hidden : true},
	    	        {key : 'lmtsoDtlAddr', hidden : true},
	    	        {key : 'dnrSystmNm', hidden : true},
	    	        {key : 'rmteSystmNm', hidden : true},
	    	        {key : 'leslCapaCd', hidden : true}
					],
					paging:{
						pagerSelect:true
					}
	};
	                
	//통신설비 Grid
	options.defineRentDataGrid = {
			filteringHeader: false,//필터 로우 visible
			hideSortingHandle : true,//Sorting 표시 visible
			rowClickSelect : true,
			rowSingleSelect : true,
			rowSingleSelectAllowUnselect : true,
			autoColumnIndex : true,
			rowindexColumnFromZero : false,
			defaultColumnMapping:{
				align : 'center',
				sorting: true
			},
            rowOption:{
                inlineStyle: function(data,rowOption){
                    if(data['datErrYn'] == "Y"){
                        return {color:'red'}
                    }
                }
            },
			columnMapping: [{key : 'check', title : "", selectorColumn : true, width : '36px', hidden : true},
	   
	                {key : 'fcltsDivCd', hidden : true},
	                {key : 'fcltsDivNm', title : '시설구분', width : '100px'},
	                {key : 'lesFctKndNm', title : '설비종류', width : '100px'},
	                {key : 'lesCommBizrId', title : 'ID', width : '50px', hidden:true},
	                {key : 'lesCommBizrNm', title : '사업자(대)', width : '120px'},
	                {key : 'systmMgmtBizrNm', title : '사업자(소)', width : '120px'},
	                {key : 'lesUsgCtt', title : '용도', width : '90px'},
	                {key : 'hdofcOrgId', hidden:true},
	                {key : 'teamOrgId', hidden:true},
	                {key : 'hdofcOrgNm', title : '본부', width : '120px'},
	                {key : 'teamOrgNm', title : '팀', width : '120px'},
	                {key : 'trmsMtsoId', hidden : true},
	                {key : 'trmsMtsoNm', title : '전송실', width : '140px'},
	                {key : 'leslNo', title : '임차회선번호', width : '100px'},
	                {key : 'leslStatNm', title : '임차회선상태', width : '100px'},
	                {key : 'svlnNo', title : '서비스회선번호', width : '120px'},
	                {key : 'svlnStatNm', title : '서비스회선상태', width : '120px'},
    			    {key : 'uprIntgFcltsCd', 	align:'center',	title : '상위통합시설코드',	hidden : true}, 
    			    {key : 'uprIntgFcltsNm', 	align:'center',	title : '상위통합시설명',	hidden : true}, 
    			    {key : 'uprPraDivNm', 		align:'center',	title : '상위통합시설활용구분',	hidden : true}, 
    			    {key : 'lowIntgFcltsCd', 	align:'center',	title : '하위통합시설코드',	width: '120px'}, 
    			    {key : 'lowIntgFcltsNm', 	align:'center',	title : '하위통합시설명',	width: '180px'}, 
    			    {key : 'lowPraDivNm', 		align:'center',	title : '하위통합시설활용구분',	width: '160px'}, 
                    {key : 'engstNo', 			align:'center',	title : 'Eng. Sheet No',			width: '120px'}, 
                    {key : 'lnkgLineIdVal',  align:'left', title : 'TEAMS회선번호',   width: '200px'}, 
                    {key : 'lineRmk1',  align:'left', title : '비고1',   width: '400px'}, 
                    {key : 'umtsoNm', title : '상위국', width : '120px'},
	                {key : 'umtsoAddr', title : '상위국주소', width : '180px'},
	                {key : 'lmtsoNm', title : '하위국', width : '120px'},
	                {key : 'lmtsoAddr', title : '하위국주소', width : '180px'},
	                {key : 'lesDistm', title : '과금거리', width : '90px'},
	                {key : 'coreCnt', title : '수량', width : '90px'},
	               // {key : 'agmtUprc', title : '단위', width : '90px'},
	                {key : 'leslAppltDtm', title : '청약일', width : '90px'},
	                {key : 'leslOpenDtm', title : '개통일', width : '90px'},
	                {key : 'leslTrmnDtm', title : '해지일', width : '90px'},
	                {key : 'lastChgDate', title : '변경일', width : '90px'},
	                {key : 'basUprc', title : '기본단가', width : '90px', align : 'right'},
	                {key : 'janUseAmt', title : '1월', width : '90px', align : 'right'},
	                {key : 'febUseAmt', title : '2월', width : '90px', align : 'right'},
	                {key : 'mayUseAmt', title : '3월', width : '90px', align : 'right'},
	                {key : 'aprUseAmt', title : '4월', width : '90px', align : 'right'},
	                {key : 'marUseAmt', title : '5월', width : '90px', align : 'right'},
	                {key : 'junUseAmt', title : '6월', width : '90px', align : 'right'},
	                {key : 'julUseAmt', title : '7월', width : '90px', align : 'right'},
	                {key : 'augUseAmt', title : '8월', width : '90px', align : 'right'},
	                {key : 'septUseAmt', title : '9월', width : '90px', align : 'right'},
	                {key : 'octUseAmt', title : '10월', width : '90px', align : 'right'},
	                {key : 'novUseAmt', title : '11월', width : '90px', align : 'right'},
	                {key : 'decUseAmt', title : '12월', width : '90px', align : 'right'},
	                {key : 'mthUtilChag', title : '월이용료', width : '90px', align : 'right'},
	                {key : 'tlplFeeAmt', title : '전주이용료', width : '90px', align : 'right'},
	                {key : 'etcCost', title : '기타', width : '90px', align : 'right'},
	                {key : 'tmthSumrAmt', title : '월청구금액', width : '90px', align : 'right'},
	                {key : 'byyrTotAmt', title : '년청구금액', width : '90px', align : 'right'},
	                {key : 'dnrSystmNm', hidden : true},
	                {key : 'rmteSystmNm', hidden : true},
	                {key : 'mthPerdVal', title : '납부주기', width : '90px'},
	                {key : 'selMthDivVal', title : '납부월', width : '90px'},
	                {key : 'lesKndCd', hidden : true},
	                {key : 'lastChgUserId', hidden : true},
	                {key : 'frstRegUserId', hidden : true},
	                {key : 'leslCapaCd', hidden : true},
	                {key : 'lesRqsRmk', title : '비고', width : '90px'},
	    	        {key : 'umtsoDtlAddr', hidden : true},
	    	        {key : 'lmtsoDtlAddr', hidden : true},
	                {key : 'leslStatCd', hidden : true},
	                {key : 'datErrYn', hidden : true}
	                ],
	    			paging:{
	    				pagerSelect:true
	    			}
	};
	
	//Wi-Fi Grid
	options.defineWifiDataGrid = {
			filteringHeader: false,//필터 로우 visible
			hideSortingHandle : true,//Sorting 표시 visible
			rowClickSelect : true,
			rowSingleSelect : true,
			rowSingleSelectAllowUnselect : true,
			autoColumnIndex : true,
			rowindexColumnFromZero : false,
			defaultColumnMapping:{
				align : 'center',
				sorting: true
			},
            rowOption:{
                inlineStyle: function(data,rowOption){
                    if(data['datErrYn'] == "Y"){
                        return {color:'red'}
                    }
                }
            },
			
	columnMapping: [{key : 'check', title : "", selectorColumn : true, width : '36px', hidden : true},
				
	                {key : 'fcltsDivCd', hidden : true},
					{key : 'hdofcOrgNm', title : '본부', width : '120px'},
					{key : 'teamOrgNm', title : '팀', width : '120px'},
					{key : 'trmsMtsoId', hidden : true},
					{key : 'trmsMtsoNm', title : '전송실', width : '140px'},
					{key : 'wifiLineDivVal', title : '분류', width : '90px'},
					{key : 'lineSrvcCd', hidden : true},
					{key : 'lesCommBizrNm', title : '사업구분', width : '90px'},
					{key : 'wifiAfcpyNm', title : '제휴사', width : '120px'},
					{key : 'wifiFnchNm', title : '가맹점', width : '120px'},
					{key : 'leslStatCd', hidden : true},
	                {key : 'leslNo', title : '임차회선번호', width : '100px'},
	                {key : 'leslStatNm', title : '임차회선상태', width : '100px'},
	                {key : 'svlnNo', title : '서비스회선번호', width : '120px'},
	                {key : 'svlnStatNm', title : '서비스회선상태', width : '120px'},
    			    {key : 'uprIntgFcltsCd', 	align:'center',	title : '상위통합시설코드',	hidden : true}, 
    			    {key : 'uprIntgFcltsNm', 	align:'center',	title : '상위통합시설명',	hidden : true}, 
    			    {key : 'uprPraDivNm', 		align:'center',	title : '상위통합시설활용구분',	hidden : true}, 
    			    {key : 'lowIntgFcltsCd', 	align:'center',	title : '하위통합시설코드',	width: '120px'}, 
    			    {key : 'lowIntgFcltsNm', 	align:'center',	title : '하위통합시설명',	width: '180px'}, 
    			    {key : 'lowPraDivNm', 		align:'center',	title : '하위통합시설활용구분',	width: '160px'}, 
					{key : 'leslAppltDtm', title : '청약일', width : '90px'},
					{key : 'leslOpenDtm', title : '개통일', width : '90px'},
					{key : 'leslTrmnDtm', title : '해지일', width : '90px'},
					{key : 'lastChgDate', title : '변경일', width : '90px'},
					{key : 'lesCommBizrId', hidden : true},
					{key : 'lesCommBizrNm', title : '사업자', width : '90px'},
					{key : 'areaCmtsoNm', title : '지역중심국', width : '90px'},
					{key : 'umtsoNm', title : '상위국', width : '120px'},
	                {key : 'umtsoAddr', title : '상위국주소', width : '180px'},
	                {key : 'lmtsoNm', title : '하위국', width : '120px'},
	                {key : 'lmtsoAddr', title : '하위국주소', width : '180px'},
					{key : 'stdLesDistRmk', title : '구분', width : '90px'},
					{key : 'lesDistRmk', title : '거리', width : '90px'},
					{key : 'leslCapaDivVal', title : '회선용량', width : '90px'},
					{key : 'leslCapaCd', hidden : true},
					{key : 'wifiApQuty', title : 'AP수량', width : '90px'},
	    	        {key : 'umtsoDtlAddr', hidden : true},
	    	        {key : 'lmtsoDtlAddr', hidden : true},
	                {key : 'lesKndCd', hidden : true},
	                {key : 'lastChgUserId', hidden : true},
	                {key : 'frstRegUserId', hidden : true},					
                    {key : 'ovpyObjYn',         align:'center', title : '과오납대상여부',  width: '120px'},
                    {key : 'ovpyOccrYm',        align:'center', title : '과오납발생년월',  width: '120px'},
                    {key : 'ovpyRmdySchdDt',    align:'center', title : '과오납해소예정일자',  width: '140px'},
                    {key : 'ovpyOccrRsnNm',     align:'center', title : '과오납발생사유',  width: '120px'},
                    {key : 'ovpyRmdyWayNm',     align:'center', title : '과오납해소방안',  width: '120px'},
                    {key : 'engstNo', 			align:'center',	title : 'Eng. Sheet No',			width: '120px'}, 
                    {key : 'lnkgLineIdVal',  align:'left', title : 'TEAMS회선번호',   width: '200px'}, 
                    {key : 'lineRmk1',  align:'left', title : '비고1',   width: '400px'}, 
					{key : 'wifiTermlEqpNm', title : '종단장비', width : '100px'},
					{key : 'wifiEtcRmk', title : '비고', width : '90px'},
	                {key : 'datErrYn', hidden : true}
				    ],
					paging:{
						pagerSelect:true
					}
	};

	//B2B Grid	
	options.defineB2bDataGrid = {
			filteringHeader: false,//필터 로우 visible
			hideSortingHandle : true,//Sorting 표시 visible
			rowClickSelect : true,
			rowSingleSelect : true,
			rowSingleSelectAllowUnselect : false,
			autoColumnIndex : true,
			rowindexColumnFromZero : false,
			defaultColumnMapping:{
				align : 'center',
				sorting: true
			},
			
	columnMapping: [{key : 'check', title : "", selectorColumn : true, width : '36px', hidden : true},
                 
	                {key : 'fcltsDivCd', hidden : true},
	                {key : 'fcltsDivNm', title : '시설구분', width : '100px'},
	                {key : 'hdofcOrgId', hidden : true},
	                {key : 'teamOrgId', hidden : true},
	                {key : 'hdofcOrgNm', title : '본부', width : '120px'},
	                {key : 'teamOrgNm', title : '팀', width : '120px'},
	                {key : 'trmsMtsoId', hidden : true},
	                {key : 'trmsMtsoNm', title : '전송실', width : '140px'},  
	                {key : 'lesCommBizrId', hidden : true},
	                {key : 'lesCommBizrNm', title : '사업자', width : '100px'},
	                {key : 'leslNo', title : '임차회선번호', width : '100px'},
	                {key : 'leslStatNm', title : '임차회선상태', width : '100px'},
	                {key : 'svlnNo', title : '서비스회선번호', width : '120px'},
	                {key : 'svlnStatNm', title : '서비스회선상태', width : '120px'},
	                {key : 'umtsoNm', title : '상위국', width : '120px'},
	                {key : 'umtsoAddr', title : '상위국주소', width : '180px'},
	                {key : 'lmtsoNm', title : '하위국', width : '120px'},
	                {key : 'lmtsoAddr', title : '하위국주소', width : '180px'},
    			    {key : 'uprIntgFcltsCd', 	align:'center',	title : '상위통합시설코드',	hidden : true}, 
    			    {key : 'uprIntgFcltsNm', 	align:'center',	title : '상위통합시설명',	hidden : true}, 
    			    {key : 'uprPraDivNm', 		align:'center',	title : '상위통합시설활용구분',	hidden : true}, 
    			    {key : 'lowIntgFcltsCd', 	align:'center',	title : '하위통합시설코드',	width: '120px'}, 
    			    {key : 'lowIntgFcltsNm', 	align:'center',	title : '하위통합시설명',	width: '180px'}, 
    			    {key : 'lowPraDivNm', 		align:'center',	title : '하위통합시설활용구분',	width: '160px'}, 
	                {key : 'leslCapaCd', hidden : true},
	                {key : 'leslCapaCd', title : '회선용량', width : '100px'},
	                {key : 'leslStatCd', hidden : true},
	                {key : 'leslOpenDtm', title : '개통일', width : '100px'},
	                {key : 'leslTrmnDtm', title : '해지일', width : '100px'},
	                {key : 'b2bSkt2LineId', title : 'SKT2회선번호', width : '120px'},
	                {key : 'b2bCustNm', title : '고객사', width : '100px'},
                    {key : 'engstNo', 			align:'center',	title : 'Eng. Sheet No',			width: '120px'}, 
                    {key : 'lnkgLineIdVal',  align:'left', title : 'TEAMS회선번호',   width: '200px'}, 
                    {key : 'lineRmk1',  align:'left', title : '비고1',   width: '400px'}, 
	    	        {key : 'umtsoDtlAddr', hidden : true},
	    	        {key : 'lmtsoDtlAddr', hidden : true},
	                {key : 'lesKndCd', hidden : true},
	                {key : 'lastChgUserId', hidden : true},          
	                {key : 'svlnNo', hidden : true},          
	                {key : 'frstRegDate', title : '등록일자', width : '100px'},
	                {key : 'frstRegUserId', title : '입력자Id', width : '100px'}
	                ],
	        		paging:{
	        			pagerSelect:true
	        		}
	};
	
	//HFC중계기 Grid	
	options.defineHfcDataGrid = {
			filteringHeader: false,//필터 로우 visible
			hideSortingHandle : true,//Sorting 표시 visible
			rowClickSelect : true,
			rowSingleSelect : true,
			rowSingleSelectAllowUnselect : true,
			autoColumnIndex : true,
			rowindexColumnFromZero : false,
			defaultColumnMapping:{
				align : 'center',
				sorting: true
			},
	columnMapping: [{key : 'check', title : "", selectorColumn : true, width : '36px', hidden : true},
	              
	                {key : 'fcltsDivCd', hidden : true},
	                {key : 'hdofcOrgNm', title : '본부', width : '120px'},
	                {key : 'teamOrgNm', title : '팀', width : '120px'},
	                {key : 'trmsMtsoNm', title : '전송실', width : '130px'},
	                {key : 'leslNo', title : '임차회선번호', width : '100px'},
	                {key : 'leslStatNm', title : '임차회선상태', width : '100px'},
	                {key : 'svlnNo', title : '서비스회선번호', width : '120px'},
	                {key : 'svlnStatNm', title : '서비스회선상태', width : '120px'},
    			    {key : 'uprIntgFcltsCd', 	align:'center',	title : '상위통합시설코드',	hidden : true}, 
    			    {key : 'uprIntgFcltsNm', 	align:'center',	title : '상위통합시설명',	hidden : true}, 
    			    {key : 'uprPraDivNm', 		align:'center',	title : '상위통합시설활용구분',	hidden : true}, 
    			    {key : 'lowIntgFcltsCd', 	align:'center',	title : '하위통합시설코드',	width: '120px'}, 
    			    {key : 'lowIntgFcltsNm', 	align:'center',	title : '하위통합시설명',	width: '180px'}, 
    			    {key : 'lowPraDivNm', 		align:'center',	title : '하위통합시설활용구분',	width: '160px'}, 
	                {key : 'lesDistm', title : '과금거리', width : '90px'},
	                {key : 'coreCnt', title : '코아수', width : '90px'},
	                {key : 'leslAppltDtm', title : '청약일', width : '90px'},
	                {key : 'leslOpenDtm', title : '개통일', width : '90px'},
	                {key : 'leslTrmnDtm', title : '해지일', width : '90px'},
	                {key : 'lastChgDate', title : '변경일', width : '90px'},
	                {key : 'lesCommBizrId', hidden : true},
	                {key : 'lesCommBizrNm', title : '사업자', width : '90px'},
	                {key : 'chrYn', title : '과금여부', width : '90px'},
	                {key : 'umtsoNm', title : '상위국', width : '120px'},
	                {key : 'umtsoAddr', title : '상위국주소', width : '180px'},
	                {key : 'lmtsoNm', title : '하위국', width : '120px'},
	                {key : 'lmtsoAddr', title : '하위국주소', width : '180px'},
                    {key : 'engstNo', 			align:'center',	title : 'Eng. Sheet No',			width: '120px'}, 
                    {key : 'lnkgLineIdVal',  align:'left', title : 'TEAMS회선번호',   width: '200px'}, 
                    {key : 'lineRmk1',  align:'left', title : '비고1',   width: '400px'}, 
	    	        {key : 'umtsoDtlAddr', hidden : true},
	    	        {key : 'lmtsoDtlAddr', hidden : true},
	                {key : 'lesKndCd', hidden : true},	                
	                {key : 'lastChgUserId', hidden : true},
	                {key : 'frstRegDate', title : '최종수정일', width : '90px'},
	                {key : 'frstRegUserId', title : '입력자Id', width : '90px'}
	                ],
	        		paging:{
	        			pagerSelect:true
	        		}
	};

	return options;
	
}(jQuery, Tango, _));
