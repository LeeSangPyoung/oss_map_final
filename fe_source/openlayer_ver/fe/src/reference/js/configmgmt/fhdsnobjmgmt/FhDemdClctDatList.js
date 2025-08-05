/**
 * FhDsnObjMgmt.js
 *
 * @author P135551
 * @date 2019. 1. 29. 오전 13:30:03
 * @version 1.0
 */
var gridModel = null;
$a.page(function() {
    var gridId = 'demdGrid';
    var eqpMeansNm = [];
    var srvcNm= [];
    var allSelectFlag = 'F';
    var clickIndex = '';
    var lastSelectedFromIndex , lastSeletedToIndex;
    this.init = function(id, param) {
        initGrid();
    	setCombo();
    	setEventListener();
    };

	function setCombo() {
		var userId = $("#userId").val();
		var param = {storgDivCd : "0", userId : userId};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/ComCdAfeYrList', null, 'GET', 'afeYrList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/storgMgmtList', param, 'GET', 'gridSearch');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getErpHdofcId', null, 'GET', 'getErpHdofcId');


		$("#srvcNm").clear();
//		$("#srvcNm").setEnabled(false);
		var option_data =  [];
		option_data.push({cd: "5G", cdNm: "5G"});
		option_data.push({cd: "LTE", cdNm: "LTE"});
		option_data.push({cd: "WCDMA", cdNm: "WCDMA"});
		option_data.push({cd: "2G", cdNm: "2G"});
		option_data.push({cd: "1X", cdNm: "1X"});
		option_data.push({cd: "LORA", cdNm: "LORA"});
		option_data.push({cd: "WIBRO", cdNm: "WIBRO"});
		$("#srvcNm").setData({
			data:option_data
//			srvcNm:"5G"
		});

		$("#cstrTypNm").clear();
		var option_data =  [{cd: "",cdNm: "선택하세요"}];
		option_data.push({cd: "순수신설", cdNm: "순수신설"});
		option_data.push({cd: "대개체신설", cdNm: "대개체신설"});
		option_data.push({cd: "대개체구매", cdNm: "대개체구매"});
		option_data.push({cd: "대개체", cdNm: "대개체"});
		option_data.push({cd: "증설", cdNm: "증설"});
		option_data.push({cd: "이설", cdNm: "이설"});
		option_data.push({cd: "RE-ENG", cdNm: "RE-ENG"});
		option_data.push({cd: "부가장치증설", cdNm: "부가장치증설"});
		$("#cstrTypNm").setData({
			data:option_data
		});

		$("#eqpMeansNm").clear();
//		$("#eqpMeansNm").setEnabled(false);
		var option_data =  [];
		option_data.push({cd: "기지국", cdNm: "기지국"});
		option_data.push({cd: "지하철", cdNm: "지하철"});
		option_data.push({cd: "인빌딩", cdNm: "인빌딩"});
		option_data.push({cd: "광중계기", cdNm: "광중계기"});
		option_data.push({cd: "터널", cdNm: "터널"});
		$("#eqpMeansNm").setData({
			data:option_data
//			eqpMeansNm: "광중계기"
		});

//		$("#hdofcNm").clear();
//		var option_data =  [{cd: "",cdNm: "선택하세요"}];
//		option_data.push({cd: "수도권", cdNm: "수도권"});
//		option_data.push({cd: "부산", cdNm: "부산"});
//		option_data.push({cd: "중부", cdNm: "중부"});
//		option_data.push({cd: "대구", cdNm: "대구"});
//		option_data.push({cd: "서부", cdNm: "서부"});
//		$("#hdofcNm").setData({
//			data:option_data
//		});

		$("#opTeamNm").clear();
		var option_data =  [{cd: "",cdNm: "선택하세요"}];
		option_data.push({cd: "강남 Access Infra팀", cdNm: "강남 Access Infra팀"});
//		option_data.push({cd: "강남 Access N/W팀", cdNm: "강남 Access N/W팀"});
		option_data.push({cd: "강북 Access Infra팀", cdNm: "강북 Access Infra팀"});
//		option_data.push({cd: "강북 Access N/W팀", cdNm: "강북 Access N/W팀"});
		option_data.push({cd: "강서 Access Infra팀", cdNm: "강서 Access Infra팀"});
//		option_data.push({cd: "강서 Access N/W팀", cdNm: "강서 Access N/W팀"});
		option_data.push({cd: "경인 Access Infra팀", cdNm: "경인 Access Infra팀"});
		option_data.push({cd: "광주 Access Infra팀", cdNm: "광주 Access Infra팀"});
//		option_data.push({cd: "광주 Access N/W팀", cdNm: "광주 Access N/W팀"});
		option_data.push({cd: "대구 Access Infra팀", cdNm: "대구 Access Infra팀"});
//		option_data.push({cd: "대구 Access N/W팀", cdNm: "대구 Access N/W팀"});
		option_data.push({cd: "대전 Access Infra팀", cdNm: "대전 Access Infra팀"});
//		option_data.push({cd: "대전 Access N/W팀", cdNm: "대전 Access N/W팀"});
		option_data.push({cd: "부산 Access Infra팀", cdNm: "부산 Access Infra팀"});
//		option_data.push({cd: "부산 Access N/W팀", cdNm: "부산 Access N/W팀"});
//		option_data.push({cd: "수도권N/W품질팀", cdNm: "수도권N/W품질팀"});
		option_data.push({cd: "원주 Access Infra팀", cdNm: "원주 Access Infra팀"});
//		option_data.push({cd: "원주 Access N/W팀", cdNm: "원주 Access N/W팀"});
		option_data.push({cd: "전주 Access Infra팀", cdNm: "전주 Access Infra팀"});
//		option_data.push({cd: "전주 Access N/W팀", cdNm: "전주 Access N/W팀"});
		option_data.push({cd: "제주 Access Infra팀", cdNm: "제주 Access Infra팀"});
//		option_data.push({cd: "제주 Access N/W팀", cdNm: "제주 Access N/W팀"});
		option_data.push({cd: "청주 Access Infra팀", cdNm: "청주 Access Infra팀"});
//		option_data.push({cd: "청주 Access N/W팀", cdNm: "청주 Access N/W팀"});
		$("#opTeamNm").setData({
			data:option_data
		});
		$("#cnstTeamNm").clear();
//		--중부구축팀
//		--수도권구축팀
//		--동부구축팀
//		--서부구축팀
		var option_data =  [{cd: "",cdNm: "선택하세요"}];
		option_data.push({cd: "중부구축팀", cdNm: "중부구축팀"});
		option_data.push({cd: "수도권구축팀", cdNm: "수도권구축팀"});
		option_data.push({cd: "동부구축팀", cdNm: "동부구축팀"});
		option_data.push({cd: "서부구축팀", cdNm: "서부구축팀"});

		$("#cnstTeamNm").setData({
			data:option_data
		});
    }

    function initGrid() {
    	var mapping =  [
    		 {key : 'check',width:'40px',selectorColumn : true}
     		, {key : 'check', align:'center', width:'50px', title : '순번', numberingColumn : true}
     		, {key : 'fhNetDivNm' 		 , align:'center', width:'90px', title : '망구분명'}
     		, {key : 'acsnwDemdMgmtSrno', align:'center', width:'120px', title : 'A망일련번호', hidden:true}
     		, {key : 'fhHdofcNm' 	 	 , align:'center', width:'80px', title : '본부'}
     		, {key : 'fhAreaNm'          , align:'center', width:'80px', title : '지역'}
     		, {key : 'fhYr'              , align:'center', width:'50px', title : '년도'}
     		, {key : 'fhDgr'             , align:'center', width:'50px', title : '차수'}
//     		, {key : 'fhDetlDgr'         , align:'center', width:'90px', title : '세부차수'}
     		, {key : 'fhWbSid'           , align:'center', width:'90px', title : 'WBS'}
     		, {key : 'fhPrjId'           , align:'center', width:'90px', title : 'Project ID'}
     		, {key : 'fhWorkDt'          , align:'center', width:'90px', title : '작업월'}
//     		, {key : 'fhCoverageMgmtNo'  , align:'center', width:'90px', title : '커버리지관리번호'}
     		, {key : 'fhKeyIdSeq'        , align:'center', width:'80px', title : 'KEYID SQ'}
     		, {key : 'fhSiteKeyId'       , align:'left', width:'180px', title : '*사이트키(2)'}
//     		, {key : 'fhAtnId'           , align:'center', width:'90px', title : '안테나ID'}
     		, {key : 'fhClustId'         , align:'center', width:'90px', title : '클러스터ID'}
     		, {key : 'fhCstrTypNm'       , align:'center', width:'90px', title : '공사유형'}
     		, {key : 'fhDetlCstrTypNm'   , align:'center', width:'95px', title : '세부공사유형'}
     		, {key : 'fhCigkTypNm'       , align:'center', width:'90px', title : '치국유형'}
     		, {key : 'fhAfeDetlclNm'     , align:'center', width:'100px', title : 'AFE세부분류'}
     		, {key : 'fhFocsMtsoSiteId'  , align:'left', width:'180px', title : '*사이트키(2)'}
     		, {key : 'fhFocsMtsoFcltsCd' , align:'center', width:'90px', title : '*시설코드(1)'}
     		, {key : 'fhFocsMtsoSmtsoNm' , align:'left', width:'230px', title : '국소명'}
     		, {key : 'fhFocsMtsoWaraNm'  , align:'center', width:'90px', title : '광역시도'}
     		, {key : 'fhFocsMtsoSggNm'   , align:'center', width:'90px', title : '시군구'}
     		, {key : 'fhFocsMtsoEmdNm'   , align:'center', width:'90px', title : '읍면동'}
     		, {key : 'fhFocsMtsoDetlAddr', align:'left', width:'90px', title : '세부주소'}
     		, {key : 'fhFocsMtsoXcrdVal' , align:'center', width:'90px', title : '위도'}
     		, {key : 'fhFocsMtsoYcrdVal' , align:'center', width:'90px', title : '경도'}
//     		, {key : 'fhBfFcltsCd'       , align:'center', width:'90px', title : '시설코드'}
//     		, {key : 'fhBfSmtsoNm'       , align:'center', width:'90px', title : '국소명'}
//     		, {key : 'fhBfWaraNm'        , align:'center', width:'90px', title : '광역시도'}
//     		, {key : 'fhBfSggNm'         , align:'center', width:'90px', title : '시군구'}
//     		, {key : 'fhBfEmdNm'         , align:'center', width:'90px', title : '읍면동'}
//     		, {key : 'fhBfDetlAddr'      , align:'center', width:'90px', title : '세부주소'}
//     		, {key : 'fhBfXcrdVal'       , align:'center', width:'90px', title : '위도'}
//     		, {key : 'fhBfYcrdVal'       , align:'center', width:'90px', title : '경도'}
//     		, {key : 'fhBfVendNm'        , align:'center', width:'90px', title : '제조사'}
//     		, {key : 'fhBfMeansNm'       , align:'center', width:'90px', title : '방식'}
//     		, {key : 'fhBfDetlMeansNm'   , align:'center', width:'90px', title : '세부방식'}
//     		, {key : 'fhBfEqpId'         , align:'center', width:'90px', title : '장비'}
//     		, {key : 'fhBfShpNm'         , align:'center', width:'90px', title : '형상'}
//     		, {key : 'fhBfFaNm'          , align:'center', width:'90px', title : 'F명'}
//     		, {key : 'fhBfChnlCardNm'    , align:'center', width:'90px', title : '채널카드'}
     		, {key : 'fhOnafFcltsCd'     , align:'center', width:'90px', title : '*시설코드(1)'}
     		, {key : 'fhOnafSmtsoNm'     , align:'left', width:'230px', title : '국소명'}
     		, {key : 'fhOnafWaraNm'      , align:'center', width:'80px', title : '광역시도'}
     		, {key : 'fhOnafSggNm'       , align:'center', width:'100px', title : '시군구'}
     		, {key : 'fhOnafEmdNm'       , align:'center', width:'100px', title : '읍면동'}
     		, {key : 'fhOnafDetlAddr'    , align:'left', width:'150px', title : '세부주소'}
     		, {key : 'fhOnafXcrdVal'     , align:'center', width:'90px', title : '*위도(3)'}
     		, {key : 'fhOnafYcrdVal'     , align:'center', width:'90px', title : '*경도(3)'}
     		, {key : 'fhOnafVendNm'      , align:'center', width:'80px', title : '제조사'}
     		, {key : 'fhOnafMeansNm'     , align:'center', width:'80px', title : '방식'}
     		, {key : 'fhOnafDetlMeansNm' , align:'center', width:'80px', title : '세부방식'}
     		, {key : 'fhOnafEqpId'       , align:'center', width:'120px', title : '장비'}
     		, {key : 'fhOnafFreqNm'      , align:'center', width:'90px', title : '주파수'}
     		, {key : 'fhOnafConnNm'      , align:'center', width:'90px', title : '연결/종단'}
     		, {key : 'fhOnafIndpIntgNm'  , align:'center', width:'90px', title : '단독/통합'}
     		, {key : 'fhOnafWrwlsNm'     , align:'center', width:'90px', title : '유선/무선'}
     		, {key : 'fhOnafShpNm'       , align:'center', width:'90px', title : '형상'}
     		, {key : 'fhOnafFaNm'        , align:'center', width:'90px', title : 'FA'}
     		, {key : 'fhOnafChnlCardNm'  , align:'center', width:'90px', title : '채널카드'}
     		, {key : 'fhOnafChnlCardCnt' , align:'center', width:'90px', title : 'CC'}
     		, {key : 'fhOpTeamNm'        , align:'left', width:'120px', title : '운용CC'}
     		, {key : 'fhCnstTeamNm'      , align:'left', width:'120px', title : '구축CC'}
     		, {key : 'fhWeakZnNm'        , align:'center', width:'90px', title : '취약지구'}
     		, {key : 'fhRefcFcltsCd'     , align:'center', width:'130px', title : '(DE/CP:CDMA,W Only:WCDMA)'}
     		, {key : 'fhInvtLclNm'       , align:'center', width:'110px', title : '대분류'}
     		, {key : 'fhInvtMclNm'       , align:'center', width:'110px', title : '중분류'}
     		, {key : 'fhInvtSclNm1'      , align:'center', width:'110px', title : '소분류1'}
     		, {key : 'fhInvtSclNm2'      , align:'center', width:'110px', title : '소분류2'}
     		, {key : 'fhAreaInfNm'       , align:'center', width:'90px', title : '지역정보'}
     		, {key : 'fhLaraInfNm'       , align:'center', width:'90px', title : '권역정보'}
     		, {key : 'fhLtef800mFcltsCd' , align:'center', width:'90px', title : '시설코드'}
     		, {key : 'fhLtef800mSmtsoNm' , align:'left', width:'230px', title : '국소명'}
     		, {key : 'fhLtef800mDistVal' , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
     		}
     		, {key : 'fhLtef18gFcltsCd'  , align:'center', width:'90px', title : '시설코드'}
     		, {key : 'fhLtef18gSmtsoNm'  , align:'left', width:'230px', title : '국소명'}
     		, {key : 'fhLtef18gDistVal'  , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
     		}
     		, {key : 'fhLtef21gFcltsCd'  , align:'center', width:'90px', title : '시설코드'}
     		, {key : 'fhLtef21gSmtsoNm'  , align:'left', width:'230px', title : '국소명'}
     		, {key : 'fhLtef21gDistVal'  , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}
     		}
     		, {key : 'fhLtef26gFcltsCd'  , align:'center', width:'90px', title : '시설코드'}
     		, {key : 'fhLtef26gSmtsoNm'  , align:'left', width:'230px', title : '국소명'}
     		, {key : 'fhLtef26gDistBal'  , align:'center', width:'90px', title : '이격거리(M)',
    			render:function(value, data, render, mapping){
    				var formatval = value;
    				if(formatval != undefined){
    					if(formatval.length >= 4){
		    				 formatval = formatval.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
		    				}
    				}
    				return formatval;
    			}}
     		, {key : 'frstRegDate'       , align:'center', width:'110px', title : '등록일'}
     		, {key : 'frstRegUserId'     , align:'center', width:'90px', title : '등록자'}
     		, {key : 'lastChgDate'       , align:'center', width:'110px', title : '수정일'}
     		, {key : 'lastChgUserId' 	, align:'center', width:'90px', title : '수정자'}

//    		, {key : 'afeYr', align:'center', width:'80px', title : 'AFE년도'}
//    		, {key : 'acsnwAfeDgr', align:'center', width:'80px', title : 'AFE차수'}
//    		, {key : 'srvcNm', align:'center', width:'80px', title : '서비스명'}
//    		, {key : 'acsnwDemdMgmtSrno', align:'center', width:'120px', title : 'A망일련번호'}
//    		, {key : 'acsnwMgmtNo', align:'center', width:'130px', title : 'A망관리번호'}
//
//    		, {key : 'siteKeyVal', align:'center', width:'140px', title : '사이트키'}
//    		, {key : 'intgFcltsCd', align:'center', width:'100px', title : '통합시설코드'}
//    		, {key : 'intgFcltsNm', align:'center', width:'100px', title : '통합시설코드명'} //통합시설명 추가 (2019-07-01 수지)
//    		, {key : 'acsnwSmtsoNm', align:'center', width:'230px', title : 'A망국소명'}
//    		, {key : 'detlAddrAll', align:'left', width:'300px', title : '주소'}
//    		, {key : 'lttagVal', align:'center', width:'40px', title : '도'}
//    		, {key : 'lttmnVal', align:'center', width:'40px', title : '분'}
//    		, {key : 'lttscVal', align:'center', width:'40px', title : '초'}
//    		, {key : 'ltdagVal', align:'center', width:'40px', title : '도'}
//    		, {key : 'ltdmnVal', align:'center', width:'40px', title : '분'}
//    		, {key : 'ltdscVal', align:'center', width:'40px', title : '초'}

//    		, {key : 'ltv', align:'center', width:'130px', title : '위도'}
//    		, {key : 'ldv', align:'center', width:'130px', title : '경도'}
//    		, {key : 'duSiteKeyVal', align:'center', width:'140px', title : '사이트키'}
//    		, {key : 'duFcltsCd', align:'center', width:'100px', title : '시설코드'}
//    		, {key : 'duSmtsoNm', align:'center', width:'230px', title : '국소명'}
//    		, {key : 'lteF800mRuFcltsCd', align:'center', width:'100px', title : 'LTE800M 코드'}
//    		, {key : 'lteF800mRuSmtsoNm', align:'center', width:'230px', title : 'LTE800M 시설'}
//    		, {key : 'lteF18gRuFcltsCd', align:'center', width:'100px', title : 'LTE1.8G 코드'}
//    		, {key : 'lteF18gRuSmtsoNm', align:'center', width:'230px', title : 'LTE1.8G 시설'}
//    		, {key : 'lteF21gRuFcltsCd', align:'center', width:'100px', title : 'LTE2.1G 코드'}
//    		, {key : 'lteF21gRuSmtsoNm', align:'center', width:'230px', title : 'LTE2.1G 시설'}
//    		, {key : 'acsnwKeyNo', align:'center', width:'100px', title : 'A망키번호'}
//    		, {key : 'acsnwMtrlCostAmt', align:'right', width:'150px', title : 'A망물자비금액',
//    			render : function(value, data) {
//    				if (value == undefined || value == null || ' ' == value || '0' == value) {
//    					return '0';
//    				}
//    				return setComma( number_format( Number( value ) * 1000000, 0 ) );
//    			}}
//    		, {key : 'acsnwIncidMtrlCostAmt', align:'right', width:'150px', title : 'A망부대물자비금액',
//    			render : function(value, data) {
//    				if (value == undefined || value == null || ' ' == value || '0' == value) {
//    					return '0';
//    				}
//    				return setComma( number_format( Number( value ) * 1000000, 0 ) );
//    			}}
//    		, {key : 'acsnwInvtCostAmt', align:'right', width:'150px', title : 'A망투자비금액',
//    			render : function(value, data) {
//    				if (value == undefined || value == null || ' ' == value || '0' == value) {
//    					return '0';
//    				}
//    				return setComma( number_format( Number( value ) * 1000000, 0 ) );
//    			}}

//    		, {key : 'hdofcNm', align:'center', width:'80px', title : '본부'}
//    		, {key : 'opTeamNm', align:'center', width:'110px', title : '운용팀'}
//    		, {key : 'cnstTeamNm', align:'center', width:'110px', title : '구축팀'}
//
//    		, {key : 'frstRegDate', align:'center', width:'100px', title : '등록일'}
//    		, {key : 'frstRegUserId', align:'center', width:'100px', title : '등록자'}
//    		, {key : 'lastChgDate', align:'center', width:'100px', title : '수정일'}
//    		, {key : 'lastChgUserId', align:'center', width:'100px', title : '수정자'}

    	];

    	var userId = $("#userId").val();
    	gridModel = Tango.ajax.init({
        	url: "tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/fhDemdMgmtList"
    		,data: {
    	        pageNo: 1,             // Page Number,
    	        rowPerPage: 500,        // Page당보여질 row 갯수 (스크롤형태이므로한페이지의길이가 10보다많아야함. default옵션은 30)
    	    }
        });

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	//cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false
           ,paging: {
        	   pagerTotal:true,
        	   pagerSelect:false,
        	   hidePageList:true
           }
        	,headerGroup: [
        		{fromIndex:2, toIndex:12, title:'기본 정보'},
        		{fromIndex:13, toIndex:13, title:'5G Planning'},
        		{fromIndex:14, toIndex:17, title:'기본 정보'},
        		{fromIndex:18, toIndex:26, title:'관련 집중국 정보'},
        		{fromIndex:27, toIndex:46, title:'이후정보'},
        		{fromIndex:47, toIndex:48, title:'팀구분'},
        		{fromIndex:50, toIndex:50, title:'서비스 커버리지'},
        		{fromIndex:51, toIndex:54, title:'투자목적'},
        		{fromIndex:57, toIndex:68, title:'CO-LOC or 인접 대표 시설 RU 정보'},

        		{fromIndex:50, toIndex:50, title:'참조 시설코드'},
        		{fromIndex:57, toIndex:59, title:'LTE800'},
        		{fromIndex:60, toIndex:62, title:'LTE1.8'},
        		{fromIndex:63, toIndex:66, title:'LTE2.1'},
        		{fromIndex:67, toIndex:68, title:'LTE2.6'},
			]
    	   ,columnMapping : mapping
    	   ,message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			}
            ,ajax: {
   	         model: gridModel                  // ajax option에 grid 연결할 model을지정
   		        ,scroll: true                      // Scroll 옵션을 true로설정하면 scroll grid형태가된다.
   		    }
            ,defaultColumnMapping: {
            	sorting: true
            }
            ,height : 500
        });

    }

    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};


    function setEventListener() {

    	$('#'+gridId).on('change','.headercell input', function(e) {
    		var checked = $(e.target).is(':checked') ? 'T' : 'F';
    		$("#checkCd").val(checked);
    		allSelectFlag = checked;
    	});

    	$('#'+gridId).on('gridScroll', function(e){
    		if(allSelectFlag == "T"){
    			var rowData = $('#'+gridId).alopexGrid('dataGet');
    			$('#'+gridId).alopexGrid('rowSelect', rowData, true);

 				for(var i = 0 ; i < rowData.length; i++){
					for(var j=0; j < clickIndex.length ; j++){
						if(rowData[i]._index.row == clickIndex[j]._index.row){
							$('#'+gridId).alopexGrid('rowSelect', rowData[i], false);
						}
    				}
 				}
			}
    	});

    	$('#'+gridId).on('click', function(e){
    		clickIndex = 	$('#'+gridId).alopexGrid('dataGet', {_state:{selected:false}});
    	});


//    	$("#pageNo").val(1);
//    	$('#rowPerPage').val(15);
    	$('#search').on('click', function(e) {
//    		 var dataParam =  $("#searchForm").serialize();

        	var dataParam =  $("#searchForm").getData();
        	bodyProgress();
        	dataParam.pageNo = '1';
        	dataParam.rowPerPage = '500';
	   		var hdofc = $("#hdofcNm").getTexts();
	   		if(dataParam.hdofcNm == "" || dataParam.hdofcNm  == null ){
	        	dataParam.hdofcNm = "";
	   		}else{
	        	dataParam.hdofcNm = hdofc[0];
	   		}
	   		if ($("#srvcNm").val() != "" && $("#srvcNm").val() != null ){
	   			dataParam.srvcNm =srvcNm

	   		}else{
	   			dataParam.srvcNm = [];
	   		}
	   		if ($("#eqpMeansNm").val() != "" && $("#eqpMeansNm").val() != null ){
	   			dataParam.eqpMeansNm =eqpMeansNm

	   		}else{
	   			dataParam.eqpMeansNm = [];
	   		}
//	   			 $('#'+gridId).alopexGrid('showProgress');
//	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/fhDemdMgmtList', dataParam, 'GET', 'search');

    		gridModel.get({
        		data: dataParam,
	    	}).done(function(response,status,xhr,flag){successCallback(response,status,xhr,'search');})
	    	.fail(function(response,status,xhr,flag){failCallback(response,status,xhr,'search');});
        });


    	$('#btnFhTmpList').on('click', function(e) {
    		var storgId = $("#storgId").val();
    		var param = {storgDivCd : "0", storgId : storgId};
    		$a.popup({
	        	popid: 'FhTmpPop',
	        	title: 'F/H ',
	        	//iframe: true,
	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnPopup.do',
	            data: param,
	            width: 1350,
	            height : 930,
	            windowpopup : true
	            //modal: false,
	            //movable:true
	            ,callback: function(resultCode) {

               	}
	       });
        });
    	$('#btnFhTmpInsert').on('click', function(e) {

    		var dataParam =  $("#searchForm").getData();

    		var checkCd = $("#checkCd").val();
    		var storgId = $("#storgId").val();
    		var userId = $("#userId").val();
			if(storgId == '' || storgId == null) {
				callMsgBox("","I", "설계그룹을 선택하세요.");
			} else {
				var idTmp = [];
		    	var deleteList = AlopexGrid.trimData ( $('#'+gridId).alopexGrid("dataGet", { _state : {selected:true }} ));
		    	if (deleteList.length <= 0) {
		    		alertBox('W', '등록할 대상을 선택하세요.');   /*"삭제할 대상을 선택하세요."*/
		    		return;
		    	}
		    	for(var i = 0;i<deleteList.length;i++){
		    		if(deleteList[i].acsnwDemdMgmtSrno != '' && deleteList[i].acsnwDemdMgmtSrno != null){
		    			var tmp = deleteList[i].acsnwDemdMgmtSrno.replace("null","");
		    			if(i == deleteList.length - 1){
		    				idTmp.push(tmp);
		                }else{
		                	idTmp.push(tmp);
		                }
		    		}
		    	}
		    	/* 전송망 수요를 삭제하시겠습니까? */
		    	callMsgBox('','C', '정말 등록하시겠습니까?', function(msgId, msgRst){
		    		if (msgRst == 'Y') {
		    			bodyProgress();
		    			if (checkCd == "F") {
		    				dataParam.acsnwDemdMgmtSrnoList = idTmp;
		    			}
		    			dataParam.frstRegUserId = userId;
		    			dataParam.lastChgUserId = userId;
		    			var hdofc = $("#hdofcNm").getTexts();
		    	   		if(dataParam.hdofcNm == "" || dataParam.hdofcNm  == null ){
		    	        	dataParam.hdofcNm = "";
		    	   		}else{
		    	        	dataParam.hdofcNm = hdofc[0];
		    	   		}
		    	   		if ($("#srvcNm").val()== "" || $("#srvcNm").val() == null ){
		    	   			dataParam.srvcNm = [];
		    	   		}
		    	   		if ($("#eqpMeansNm").val() == "" || $("#eqpMeansNm").val() == null ){
		    	   			dataParam.eqpMeansNm = [];
		    	   		}

		        		var sflag = {
		      				  jobTp : 'insertList'   // 작업종류
		        		};
		        		if (checkCd == "F") {
		        			httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/insertTmpDemd', dataParam, 'POST', 'insertlist');
		    			} else {
		    				httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/insertTmpDemdAll', dataParam, 'POST', 'insertlist');
		    			}
		    		}
		    	});
			}
        });
    	$('#btnFhTmpMaster').on('click', function(e) {
    		var dataParam =  $("#searchForm").getData();
    		var hdofc = $("#hdofcNm").getTexts();
	   		if(dataParam.hdofcNm == "" || dataParam.hdofcNm  == null ){
	        	dataParam.hdofcNm = "";
	   		}else{
	        	dataParam.hdofcNm = hdofc[0];
	   		}
	   			dataParam.srvcNm = [];
	   			dataParam.eqpMeansNm = [];
    		$a.popup({
	        	popid: 'FhTmpLockerMgmtPop',
	        	title: 'F/H 설계그룹 관리',
	        	//iframe: true,
	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhTmpLockerMgmt.do',
	            data: dataParam,
	            width: 600,
	            height : 400,
	            //windowpopup : true,
	            //modal: false,
	            movable:true
	            ,callback: function(resultCode) {
	            	var userId = $("#userId").val();
	            	var param = {storgDivCd : "0", userId : userId};
	            	httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/storgMgmtList', param, 'GET', 'gridSearch');

               	}
	       });
        });
    	//FhTmpLockerMgmt
    	//엔터키로 조회
        $('#searchForm').on('keydown', function(e){
    		if (e.which == 13  ){
    			$('#search').click();
      		}
    	 });

    	$("#afeYr").on('change',function(e) {
    		var param = $("#afeYr").getData();
    		//httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/getAfeDgrList', param, 'GET', 'afeDgrList');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/ComCdAfeDgrList', param, 'GET', 'afeDgrList');
    	});

	    $('#btn_AccessPopup').on('click', function(e) {
	    	var param = $("#searchForm").getData();


	   	 $a.popup({
	        	popid: 'FhDsnObjAccessPopup',
	        	title: '수요 프론트홀 설계',
//	        	iframe: true,
//	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhAccessDsnPopup.do',
	            data: param,
	            width: (screen.width==900) ? 450 : eval(screen.width * 0.9),
	            height : (screen.height==900) ? 450 : eval(screen.height * 0.8),
	            windowpopup : true,
	            modal: false,
	            movable:true
	            /*
	        		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
	        	*/
	            ,callback: function(resultCode) {
                	if (resultCode == "OK") {
                		$('#search').click();
                	}
               	}
//		 		,xButtonClickCallback : function(el){
//	   	 			alertBox('W', demandMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
//	   	 			return false;
//	   	 		}
	       });
       });


	    $('#btnExportExcelOnDemand').on('click', function(e){
            btnExportExcelOnDemandClickEventHandler(e);
        });


	 	$('#srvcNm').multiselect({
	 		 open: function(e){
	 			srvcNm = $("#srvcNm").getData().srvcNm;
	 		 },
	 		 beforeclose: function(e){
	 			 var codeID =  $("#srvcNm").getData();
	      		 var param = "";
	      		 if(srvcNm+"" != codeID.srvcNm+""){
		         		 if(codeID.srvcNm == ''){
		         		 }else {
		         			for(var i=0; codeID.srvcNm.length > i; i++){
		         				param += codeID.srvcNm[i] + ",";
		         			}
		         			param = param.substring(0,param.length-1);
		         			srvcNm = param;
		         		 }
	      		 }

	 		 }
	 	 });
//
		$('#eqpMeansNm').multiselect({
	 		 open: function(e){
	 			eqpMeansNm = $("#eqpMeansNm").getData().eqpMeansNm;
	 		 },
	 		 beforeclose: function(e){
	 			 var codeID =  $("#eqpMeansNm").getData();
	      		 var param = "";
	      		 if(eqpMeansNm+"" != codeID.eqpMeansNm+""){
		         		 if(codeID.eqpMeansNm == ''){
		         		 }else {
		         			for(var i=0; codeID.eqpMeansNm.length > i; i++){
		         				param += codeID.eqpMeansNm[i] + ",";
		         			}
		         			param = param.substring(0,param.length-1);
		         			eqpMeansNm = param;
		         		 }
	      		 }
	 		 }
	 	 });

    };

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){}
	 function gridExcelColumn(param, gridId) {}
	 function setComma(str) {
			var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
			str += ""; // 숫자를 문자열로 변환
			str = str.replace(/[a-zA-Z]/gi, '');
			while ( reg.test(str) ) {
				str = str.replace(reg, "$1" + "," + "$2");
			}

			return str;
		};
		function number_format(number, digits, dec_point, thousands_sep){
			// *		example 1: number_format(1234.5678, 2);
			// *		returns	1: 1234.57
			number = number.toString();
			if (!number) return;

			var parts = number.split('.');
			parts[0] = parts[0].replace(/\B(?=(d\{3})+(?!\d))/g, ',');

			//decimals : 소수점 이하
			var dec = parts[1] || '';

			if(digits) {
				var d = parseInt(digits);
				dec = dec.length >= parseInt(d) ? parseFloat('0.'+dec).toFixed(d).split('.')[1] : dec + new Array(d - dec.length + 1).join('0');
			}

			if(dec && digits>0){
				return parts[0] + '.' + dec;
			}else {
				return parts[0];
			}
		}
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		$("#checkCd").val("F");
        	bodyProgressRemove();
    		// 검색
    	}
    	if(flag == 'insertlist'){
        	bodyProgressRemove();

        	var dataParam =  $("#searchForm").getData();
        	dataParam.storgId = $("#storgId").val();
        	var hdofc = $("#hdofcNm").getTexts();
	   		if(dataParam.hdofcNm == "" || dataParam.hdofcNm  == null ){
	        	dataParam.hdofcNm = "";
	   		}else{
	        	dataParam.hdofcNm = hdofc[0];
	   		}
	   			dataParam.srvcNm = [];
	   			dataParam.eqpMeansNm = [];
    		$a.popup({
	        	popid: 'FhTmpPop',
	        	title: 'F/H ',
	        	//iframe: true,
	        	modal : true,
	            url: '/tango-transmission-web/configmgmt/fhdsnobjmgmt/FhDsnPopup.do',
	            data: dataParam,
	            width: 1350,
	            height : 930,
	            windowpopup : true
	            //modal: false,
	            //movable:true
	            ,callback: function(resultCode) {

               	}
	       });

    		// 검색
    	}

    	if(flag == 'getErpHdofcId'){
        	var erpHdofCdId = "";
    		if(response.length >= 1 ){
    			erpHdofCdId = response[0].erpHdofcCd;
    		}

    		$("#hdofcNm").clear();
    		var option_data =  [{cd: "",cdNm: "선택하세요"}];
    		option_data.push({cd: "5100", cdNm: "수도권"});
    		option_data.push({cd: "5300", cdNm: "부산"});
    		option_data.push({cd: "5600", cdNm: "중부"});
    		option_data.push({cd: "5400", cdNm: "대구"});
    		option_data.push({cd: "5500", cdNm: "서부"});
    		$("#hdofcNm").setData({
    			data:option_data,
    			hdofcNm: erpHdofCdId
    		});

//    		$("#hdofcNm").setEnabled(false);
    	}



    	if(flag == 'gridSearch'){	// 등록
			$("#storgId").clear();
    		var option_data =  [{cd: "",cdNm: "선택하세요"}];
    		for(var i=0; i<response.storgMgmtList.length; i++){
    			var resObj = response.storgMgmtList[i];
    			option_data.push({cd: resObj.storgId, cdNm: resObj.storgTitlVal});
    		}
    		$("#storgId").setData({
    			data:option_data
    		});
    	}
    	if(flag == 'afeYrList'){
    		$("#afeYr").clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push({cd: resObj.afeYr, cdNm: resObj.afeYr});
			}

    		$("#afeYr").setData({
    			data:option_data
    		});

    		var param = $("#afeYr").getData();
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/fhdsnobjmgmt/ComCdAfeDgrList', param, 'GET', 'afeDgrList');
    	}

    	if(flag == 'afeDgrList'){
    		$("#acsnwAfeDgr").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.acsnwAfeDgr, cdNm: resObj.acsnwAfeDgr});
    		}

    		$("#acsnwAfeDgr").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'hdofcNmList'){
    		$("#hdofcNm").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.hdofcCd, cdNm: resObj.hdofcNm});
    		}

    		$("#hdofcNm").setData({
    			data:option_data
    		});
    	}

    	if(flag == 'srvcNmList'){
    		$("#srvcNm").clear();
    		var option_data =  [{cd: "",cdNm: "전체"}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push({cd: resObj.srvcNm, cdNm: resObj.srvcNm});
    		}

    		$("#srvcNm").setData({
    			data:option_data
    		});
    	}

    	//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }
    }
  //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function bodyProgress() {
    	$('body').progress();
    }

    function bodyProgressRemove() {
    	$('body').progress().remove();
    }

    function onDemandExcelCreatePop ( jobInstanceId ){
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
                        //$('#btnSearch').click();
                    }
                }
            });
	}

    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }


});