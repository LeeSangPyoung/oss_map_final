/**
 * DemandFeeGrid.js
 * 청구요금 DataGrid정의
 *
 * @author 임상우
 * @date 2016. 8. 25. 오후 1:00:00
 * @version 1.0
 */
var DemandFeeGrid = (function($, Tango, _){
	
	var options = {} ;
	
	//통신설비 Grid
	options.defineRentDataGrid = {
			lesKndCd : 'T3',
			autoColumnIndex : true,
			rowindexColumnFromZero: false,
			defaultColumnMapping : {
				align : 'center',
				width : '90px',
				sorting : false
			},
			rowSingleSelect : false,
			rowClickSelect : false,
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
            rowOption:{
            	inlineStyle : function(data, rowOption){
                    if(data['datErrYn'] == "Y"){
                        return {color:'red'}
                    }
                }
            },
			columnMapping: [
			                {selectorColumn : true, resizing : false, 	headerDragDrop : false, width : '39px', hidden : false}, 
			                {key: 'lesKndCd', hidden : true},
							{key: 'dmdYm', title:'청구년월'},
							{key: 'lesUsgCtt', title:'용도'},
							{key: 'hdofcOrgNm', title:'본부', width : '180px'},
							{key: 'teamOrgNm', title:'팀', width : '180px'},
							{key: 'hdofcOrgId', hidden : true},
							{key: 'teamOrgId', hidden : true},
							{key: 'trmsMtsoNm', title:'전송실', width : '180px'},
							{key: 'leslNo', title:'회선번호'},
							{key: 'dnrSystmNm', title:'상위국', width : '180px'},
							{key: 'rmteSystmNm', title:'하위국', width : '180px'},
							{key: 'leslStatVal', title:'회선상태'},	
							{key: 'lesDistm', title:'거리', align : 'right'},
							{key: 'coreCnt', title:'수량'},
							{key: 'lineAppltDtm', title:'청약일'},
							{key: 'openDtm', title:'개통일'},
							{key: 'trmnDtm', title:'해지일'},
							{key: 'lastChgDate', title:'변경일'},
							{key: 'basUprc', title:'기본단가', align : 'right'},
							{key: 'mthUtilChag', title:'월이용료', align : 'right'},
							{key: 'tlplChag', title:'전주이용료', align : 'right'},
							{key: 'etcCost', title:'기타', align : 'right'},
							{key: 'feeSumrAmt', title:'요금계', align : 'right'},
							{key: 'drtCalcAplyDayCnt', title:'일할계산적용일'},
							{key: 'drtCalcAmt', title:'일할계산요금', align : 'right'},
							{key: 'rfndAmt', title:'환급불금액', align : 'right'},
							{key: 'tmthSumrAmt', title:'당월계', align : 'right'},
							{key: 'atrnfYn', title:'자동이체여부'},
							{key: 'atrnfDiscAmt', title:'자동이체할인액', align : 'right'},
							{key: 'splyAmt', title:'공급가액', align : 'right'},
							{key: 'splyVat', title:'부가세', align : 'right'},
							{key: 'dmdAmt', title:'요금계', align : 'right'},
							{key: 'lesCommBizrNm', title:'사업자'},
							{key: 'umtsoAddr', title:'상위국주소', width : '180px'},
							{key: 'umtsoGuAddr', title:'상위국시구군', width : '180px'},
							{key: 'umtsoDongAddr', title:'상위국면동리', width : '180px'},
							{key: 'lmtsoAddr', title:'하위국주소', width : '180px'},
							{key: 'lmtsoGuAddr', title:'하위국시구군', width : '180px'},
							{key: 'lmtsoDongAddr', title:'하위국면동리', width : '180px'},
							{key: 'etcRmk', title:'비고'},
							{key: 'frstRegDate', title:'등록일자', width:140},
							{key: 'frstRegUserId', title:'등록자명', width:110},
							{key: 'datErrYn', hidden : true}
							,]
	};
	
	//BTS
	options.defineBtsDataGrid = {
		lesKndCd : 'T2',
		autoColumnIndex : true,
		rowindexColumnFromZero: false,
		defaultColumnMapping : {
			align : 'center',
			width : '90px',
			sorting : false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
        rowOption:{
        	inlineStyle : function(data, rowOption){
                if(data['datErrYn'] == "Y"){
                    return {color:'red'}
                }
            }
        },
		columnMapping: [
		                {selectorColumn : true, resizing : false, 	headerDragDrop : false, width : '39px', hidden : false}, 
		                {key: 'lesKndCd', hidden : true},
						{key: 'dmdYm', title:'청구년월'},
						{key: 'fcltsDivNm', title:'시설구분'},
						{key: 'hdofcOrgNm',title:'본부', width : '180px'},
						{key: 'teamOrgNm',title:'팀', width : '180px'},
						{key: 'hdofcOrgId', hidden : true},
						{key: 'teamOrgId', hidden : true},
						{key: 'trmsMtsoNm',title:'전송실', width : '180px'},
						{key: 'srvcClVal',title:'사업구분'},
						{key: 'shrYn', title:'공용여부',width:100},				 
						{key: 'formDivVal', title:'형태',width:100},						 
						{key: 'bmtsoMtsoNm', title:'기지국명'},					 
						{key: 'leslNm', title:'회선명'},					 
						{key: 'leslStatVal',title:'회선상태'},					 
						{key: 'leslNo', title:'회선번호'},					 
						{key: 'lineAppltDtm', title:'청약일'}, 
						{key: 'openDtm', title:'개통일'}, 
						{key: 'trmnDtm', title:'해지일'}, 
						{key: 'lastChgDate', title:'변경일'}, 
						{key: 'lesCommBizrNm', title:'사업자'},
						{key: 'lesCommBizrId', hidden : true},
						{key: 'areaCmtsoNm', title:'지역중심국명', width:100},
						{key: 'areaCmtsoAcptYn', title:'지역중심국수용여부', width:120},
						{key: 'selfNetObjYn', title:'자체망대상여부', width:120},
						{key: 'selfNetCnstDtm', title:'구축시기', width:120},
						{key: 'selfNetAcptYn', title:'자체망수용여부', width:120},
						{key: 'umtsoNm', title:'상위국', width : '180px'},
						{key: 'lmtsoNm', title:'하위국', width : '180px'},
						{key: 'lesDistFeeDivNm', title:'구분'},
						{key: 'lesDistm', title:'거리'},
						{key: 'basUprc', title:'기본단가', align : 'right'},
						{key: 'mthUtilChag', title:'월이용료', align : 'right'},
						{key: 'devCost', title:'장치비', align : 'right'},
						{key: 'etcCost', title:'기타', align : 'right'},
						{key: 'feeSumrAmt', title:'요금계', align : 'right'},
						{key: 'drtCalcAplyDayCnt', title:'일할계산적용일수'},
						{key: 'drtCalcAmt', title:'일할계산액', align : 'right'},
						{key: 'rfndAmt', title:'환급', align : 'right'},	
						{key: 'tmthSumrAmt', title:'당월계', align : 'right'},
						{key: 'atrnfYn', title:'자동이체여부'},
						{key: 'atrnfDiscAmt', title:'자동이체할인', align : 'right'},
						{key: 'splyAmt', title:'공급가액', align : 'right'},
						{key: 'splyVat', title:'부가세', align : 'right'},
						{key: 'dmdAmt', title:'청구금액', align : 'right'},	
						{key: 'leslCapaCd', title:'회선종류'},
						//{key: 'chrYn', title:'과금여부'},
						{key: 'minUseDayCnt', title:'최소사용적용기간'},
						{key: 'minUseExprnDtm', title:'최소사용만료일'},
						{key: 'trmnPsblYn', title:'해지가능'},
						{key: 'lmtsoAddr', title:'하위국소재지', width : '180px'},	
						//{key: 'lmtsoGuAddr', title:'시구군', width : '180px'},
						//{key: 'lmtsoDongAddr', title:'면동리', width : '180px'},
						{key: 'etcRmk', title:'비고'},
						{key: 'frstRegDate', title:'등록일자', width:140},
						{key: 'frstRegUserId', title:'등록자명', width:110},
						{key: 'datErrYn', hidden : true}]
	};
	
	
	//WiFi Grid
	options.defineWIFIDataGrid = {
			lesKndCd : 'T4',
			autoColumnIndex : true,
			rowindexColumnFromZero: false,
			defaultColumnMapping : {
				align : 'center',
				width : '90px',
				sorting : false
			},
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
            rowOption:{
            	inlineStyle : function(data, rowOption){
                    if(data['datErrYn'] == "Y"){
                        return {color:'red'}
                    }
                }
            },
			columnMapping: [
			                {selectorColumn : true, resizing : false, 	headerDragDrop : false, width : '39px', hidden : false}, 
			                {key: 'lesKndCd', hidden : true},
							{key: 'dmdYm', title:'청구년월'},
							{key: 'fcltsDivNm', title:'시설구분'},
							{key: 'hdofcOrgNm',title:'본부', width : '180px'},
							{key: 'teamOrgNm',title:'팀', width : '180px'},
							{key: 'hdofcOrgId', hidden : true},
							{key: 'teamOrgId', hidden : true},
							{key: 'trmsMtsoNm',title:'전송실', width : '180px'},
							{key: 'srvcClVal',title:'사업구분'},
							{key: 'afcpyNm',title:'제휴사명'},
							{key: 'fnchNm',title:'가맹점명'},
							{key: 'leslStatVal',title:'회선상태'},
							{key: 'leslNo',title:'회선번호'},
							{key: 'lineAppltDtm', title:'청약일'},
							{key: 'openDtm', title:'개통일'},
							{key: 'trmnDtm', title:'해지일'},
							{key: 'lastChgDate', title:'변경일'},
							{key: 'lesCommBizrNm', title:'사업자'},
							{key: 'lesCommBizrId', hidden : true},
							{key: 'areaCmtsoNm', title:'지역중심국명', width : '180px'},
							{key: 'umtsoNm', title:'관할국(상위국)', width : '180px'},
							{key: 'lmtsoNm', title:'관할국(하위국)', width : '180px'},
							{key: 'lesDistFeeDivNm', title:'구분'},
							{key: 'lesDistm', title:'거리'},
							{key: 'basUprc', title:'기본단가', align : 'right'},
							{key: 'mthUtilChag', title:'월이용료', align : 'right'},
							{key: 'devCost', title:'장치비', align : 'right'},
							{key: 'etcCost', title:'기타', align : 'right'},
							{key: 'feeSumrAmt', title:'요금계', align : 'right'},
							{key: 'drtCalcAplyDayCnt', title:'일할계산적용일수'},
							{key: 'drtCalcAmt', title:'일할계산액', align : 'right'},
							{key: 'rfndAmt', title:'환급금액', align : 'right'},	
							{key: 'tmthSumrAmt', title:'당월계', align : 'right'},
							{key: 'atrnfYn', title:'자동이체여부'},
							{key: 'atrnfDiscAmt', title:'자동이체할인액', align : 'right'},
							{key: 'splyAmt', title:'공급가액', align : 'right'},
							{key: 'splyVat', title:'부가세', align : 'right'},
							{key: 'dmdAmt', title:'청구금액', align : 'right'},	
							{key: 'leslCapaCd', title:'회선종류'},
							{key: 'apQuty', title:'AP수량'},
							{key: 'lmtsoAddr', title:'하위국소재지', width : '180px'},
							//{key: 'lmtsoGuAddr', title:'시구군', width : '180px'},
							//{key: 'lmtsoDongAddr', title:'면동리', width : '180px'},
							{key: 'etcRmk', title:'비고'},
							{key: 'termlEqpNm', title:'종단장치'},
							{key: 'frstRegDate', title:'등록일자'},
							{key: 'frstRegUserId', title:'등록자명', width:110},
							{key: 'datErrYn', hidden : true}]
	};
	
	//B2B Grid
	options.defineB2BDataGrid = {
			lesKndCd : 'T5',
			autoColumnIndex : true,
			rowindexColumnFromZero: false,
			defaultColumnMapping : {
				align : 'center',
				width : '90px',
				sorting : false
			},
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
            rowOption:{
            	inlineStyle : function(data, rowOption){
                    if(data['datErrYn'] == "Y"){
                        return {color:'red'}
                    }
                }
            },
			columnMapping: [
			                {selectorColumn : true, resizing : false, 	headerDragDrop : false, width : '39px', hidden : false}, 
			                {key: 'lesKndCd', hidden : true},
							{key: 'dmdYm', title:'청구년월'},
							{key: 'hdofcOrgNm',title:'본부'},
							{key: 'teamOrgNm',title:'팀'},
							{key: 'hdofcOrgId', hidden : true},
							{key: 'teamOrgId', hidden : true},
							{key: 'lesCommBizrId', title:'사업자'},
							{key: 'leslNo',title:'회선번호'},				
							{key: 'umtsoNm', title:'상위국명', width : '180px'},
							{key: 'lmtsoNm', title:'하위국명', width : '180px'},
							{key: 'umtsoAddr', title:'상위국주소', width:200},
							{key: 'lmtsoAddr', title:'하위국주소', width:200},
							{key: 'leslCapaCd', title:'회선종류'},
							{key: 'leslStatVal',title:'회선상태'},
							{key: 'openDtm', title:'과금개시일'},				                           
							{key: 'trmnDtm', title:'해지일'},
							{key: 'splyAmt', title:'공급가액', align : 'right'},
							{key: 'skt2LineId', title:'SKT2 회선번호', width:120},
							{key: 'custNm', title:'고객명', width:120},
							{key: 'frstRegDate', title:'등록일자'},
							{key: 'frstRegUserId', title:'등록자명'},
							{key: 'datErrYn', hidden : true}]
	};
	
	//OPT
	options.defineOPTDataGrid = {
			lesKndCd : 'T1',
			
			filteringHeader: false,//필터 로우 visible
			hideSortingHandle : true,//Sorting 표시 visible
			rowClickSelect : true,
			rowSingleSelect : true,
			rowSingleSelectAllowUnselect : true,
			autoColumnIndex : true,
			rowindexColumnFromZero : false,
			
			
			defaultColumnMapping : {
				align : 'center',
				width : '90px',
				sorting : true
			},
			rowSingleSelect : false,
			rowClickSelect : false,
/*			message: {
				nodata : '조회된 데이터가 없습니다.',
				filterNodata : 'No data'
			},*/
            rowOption:{
            	inlineStyle : function(data, rowOption){
                    if(data['datErrYn'] == "Y"){
                        return {color:'red'}
                    }
                }
            },
			columnMapping: [
			                {selectorColumn : true, resizing : false, 	headerDragDrop : false, width : '39px', hidden : false}, 
			                {key: 'lesKndCd', hidden : true},
							{key: 'dmdYm', title:'청구년월'},
			                {key: 'fcltsDivNm', title: '시설구분'},
			                {key: 'hdofcOrgNm', title: '본부', width : '180px'},
			                {key: 'teamOrgNm', title: '팀', width : '180px'},
			                {key: 'hdofcOrgId', hidden : true},
							{key: 'teamOrgId', hidden : true},
			                {key: 'trmsMtsoNm', title: '전송실', width : '180px'},
			                {key: 'leslNo', title: '회선번호'},
			                {key: 'dnrSystmNm', title: 'DONOR시스템명', width : '180px'},
			                {key: 'rmteSystmNm', title: 'REMOTE시스템명', width : '180px'},
			                {key: 'leslStatVal', title: '회선상태'},
			                {key: 'lesDistm', title: '거리', align : 'right'},
			                {key: 'coreCnt', title: '코아수'},
			                {key: 'lineAppltDtm', title: '청약일'},
			                {key: 'openDtm', title: '개통일'},
			                {key: 'trmnDtm', title: '해지일'},
			                {key: 'lastChgDate', title: '변경일'},
			                {key: 'basUprc', title: '기본단가', align : 'right'},
			                {key: 'mthUtilChag', title: '월이용료', align : 'right'},
			                {key: 'tlplChag', title: '전주료', align : 'right'},
			                {key: 'etcCost', title: '기타', align : 'right'},
			                {key: 'feeSumrAmt', title: '요금계', align : 'right'},
			                {key: 'drtCalcAplyDayCnt', title: '일할계산적용일'},
			                {key: 'drtCalcAmt', title: '일할계산액', align : 'right'},
			                {key: 'rfndAmt', title: '환급', align : 'right'},
			                {key: 'tmthSumrAmt', title: '당월계', align : 'right'},
			                {key: 'atrnfYn', title: '자동이체여부'},
			                {key: 'atrnfDiscAmt', title: '자동이체금액', align : 'right'},
			                {key: 'splyAmt', title: '공급가액', align : 'right'},
			                {key: 'splyVat', title: '부가세', align : 'right'},
			                {key: 'dmdAmt', title: '청구금액', align : 'right'},
							{key: 'lesCommBizrNm', title:'제공사업자명'},
							{key: 'lesCommBizrId', hidden : true},
			                //{key: 'chrYn', title: '과금여부'},
			                {key: 'minUseDayCnt', title: '최소사용기간'},
			                {key: 'minUseExprnDtm', title: '최소사용만료일'},
			                {key: 'trmnPsblYn', title: '해지가능여부'},
			                {key: 'umtsoAddr', title: '상위국주소', width : '180px'},
			                //{key: 'umtsoGuAddr', title: '상위국시구군', width : '180px'},
			                //{key: 'umtsoDongAddr', title: '상위국면동리', width : '180px'},
			                {key: 'lmtsoAddr', title: '하위국주소', width : '180px'},
			                //{key: 'lmtsoGuAddr', title: '하위국시구군', width : '180px'},
			                //{key: 'lmtsoDongAddr', title: '하위국면동리', width : '180px'},
			                {key: 'etcRmk', title: '비고'},
			                {key: 'frstRegDate', title: '등록일자', width: '140px'},
			                {key: 'frstRegUserId', title: '등록자ID', width: '110px'},
							{key: 'datErrYn', hidden : true}]
	};
	
	
	//HFC중계기 Grid
	options.defineHFCDataGrid = {
		lesKndCd : 'T6',
		autoColumnIndex : true,
		rowindexColumnFromZero: false,
		defaultColumnMapping : {
			align : 'center',
			width : '90px',
			sorting : false
		},
/*		message: {
			nodata : '조회된 데이터가 없습니다.',
			filterNodata : 'No data'
		},*/
        rowOption:{
        	inlineStyle : function(data, rowOption){
                if(data['datErrYn'] == "Y"){
                    return {color:'red'}
                }
            }
        },
		columnMapping: [
		                {selectorColumn : true, resizing : false, 	headerDragDrop : false, width : '39px', hidden : false}, 
		                {key: 'lesKndCd', hidden : true},
						{key: 'dmdYm', title:'청구년월'},
		                {key: 'fcltsDivNm', title: '시설구분'},
		                {key: 'hdofcOrgNm', title: '본부', width : '180px'},
		                {key: 'teamOrgNm', title: '팀', width : '180px'},
		                {key: 'hdofcOrgId', hidden : true},
						{key: 'teamOrgId', hidden : true},
		                {key: 'trmsMtsoNm', title: '전송실', width : '180px'},
		                {key: 'leslNo', title: '회선번호'},
		                {key: 'dnrSystmNm', title: 'DONOR시스템명', width : '180px'},
		                {key: 'rmteSystmNm', title: 'REMOTE시스템명', width : '180px'},
		                {key: 'leslStatVal', title: '회선상태'},
		                {key: 'lesDistm', title: '거리', align : 'right'},
		                {key: 'coreCnt', title: '코아수'},
		                {key: 'lineAppltDtm', title: '청약일'},
		                {key: 'openDtm', title: '개통일'},
		                {key: 'trmnDtm', title: '해지일'},
		                {key: 'lastChgDate', title: '변경일'},
		                {key: 'basUprc', title: '기본단가', align : 'right'},
		                {key: 'mthUtilChag', title: '월이용료', align : 'right'},
		                {key: 'tlplChag', title: '전주료', align : 'right'},
		                {key: 'etcCost', title: '기타', align : 'right'},
		                {key: 'feeSumrAmt', title: '요금계', align : 'right'},
		                {key: 'drtCalcAplyDayCnt', title: '일할계산적용일'},
		                {key: 'drtCalcAmt', title: '일할계산액', align : 'right'},
		                {key: 'rfndAmt', title: '환급', align : 'right'},
		                {key: 'tmthSumrAmt', title: '당월계', align : 'right'},
		                {key: 'atrnfYn', title: '자동이체여부'},
		                {key: 'atrnfDiscAmt', title: '자동이체금액', align : 'right'},
		                {key: 'splyAmt', title: '공급가액', align : 'right'},
		                {key: 'splyVat', title: '부가세', align : 'right'},
		                {key: 'dmdAmt', title: '청구금액', align : 'right'},
		                {key: 'lesCommBizrId', hidden : true },
		                {key: 'lesCommBizrNm', title: '사업자'},
		                //{key: 'chrYn', title: '과금여부'},
		                {key: 'minUseDayCnt', title: '최소사용기간'},
		                {key: 'minUse_exprnDtm', title: '최소사용만료일'},
		                {key: 'trmnPsblYn', title: '해지가능여부'},
		                {key: 'umtsoAddr', title: '상위국주소', width : '180px'},
		                //{key: 'umtsoGuAddr', title: '상위국시구군', width : '180px'},
		                //{key: 'umtsoDongAddr', title: '상위국면동리', width : '180px'},
		                {key: 'lmtsoAddr', title: '하위국주소', width : '180px'},
		                //{key: 'lmtsoGuAddr', title: '하위국시구군', width : '180px'},
		                //{key: 'lmtsoDongAddr', title: '하위국면동리', width : '180px'},
		                {key: 'etcRmk', title: '비고'},
		                {key: 'frstRegDate', title: '등록일자', width: '140px'},
		                {key: 'frstRegUserId', title: '등록자명', width: '110px'},
						{key: 'datErrYn', hidden : true}]
	};
	
	//ErrorGrid ----------------------------------------------------------------------------------------------------------------------
	options.defineDemandFeeErrorDataGrid = {
			autoColumnIndex : true,
			rowindexColumnFromZero: false,
			rowSingleSelect: true,
			rowSingleSelectAllowUnselect: true,
			disableRowSelectByKey: true,
			defaultColumnMapping : {
				sorting : true
			},
			renderMapping: {
				"errorRow": {
					renderer: function(value, data, render, mapping){
						return value+'행';
					}
				}
			},
			columnMapping: [{key: 'errorRow', title: '오류행', width: '100%', render: {type: "errorRow"}},
			                {key: 'errorComment', title: '내역', align : 'left', width: '800px'}]
			                
		};
	
	options.defineHFCErrorDataGrid = {
		autoColumnIndex : true,
		rowindexColumnFromZero: false,
		rowSingleSelect: true,
		rowSingleSelectAllowUnselect: true,
		disableRowSelectByKey: true,
		defaultColumnMapping : {
			sorting : true
		},
		renderMapping: {
			"errorRow": {
				renderer: function(value, data, render, mapping){
					return value+'행';
				}
			}
		},
		columnMapping: [{key: 'errorRow', title: '오류행', width: '100%', render: {type: "errorRow"}},
		                {key: 'errorComment', title: '내역', align : 'left', width: '800px'}]
		                
	};

	return options;
	
}(jQuery, Tango, _));





