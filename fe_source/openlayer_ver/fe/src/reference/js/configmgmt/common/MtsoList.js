/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var gisMap = null;
var mgMap;
var L;
var circleRange = 0;//반경거리

var main = $a.page(function() {

	var gridId = 'dataGrid';
	var gridIdDistance = 'dataGridDistance';
	var fileOnDemendName = "";

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();
        if(param.fromOther == "Y"){
        	MtsoFromOtherReg(param);
        }

        //통합국현황을 비활성화
        $("input:checkbox[id=srchGrGubun][value='I']").setEnabled(false);
    };

  //Grid 초기화
    function initGrid() {
    	/*부서정보 [1-6]*/
    	/*통합국정보  [7-8]*/
    	/*기본정보 [9-12]*/
    	/*위치정보 [13-19]*/
    	/*관리정보  [20-22]*/
    	/*GIS연계정보 [23-28]*/
    	/*코드정보 [29-35]*/
    	/*사이트키 [36-37]*/
    	/*변경관리 [38-41]*/
    	/*통합국-층현황  [42-45]*/
    	/*통합국-일반현황 [46-50]*/
    	/*통합국-주장비(Acc분야) [51-55]*/
    	/*통합국-주장비(전송분야) [56-67]*/
    	/*통합국-부대시설 [68-82]*/
    	/*통합국-환경정보(전력, 전송) [83-90]*/
    	/*통합국변경관리 [91-92]*/
    	var headerMappingN =  [
			 {fromIndex:1, toIndex:6, title:"부서정보"},
  	                      		{fromIndex:7, toIndex:8, title:"통합국정보"},
								{fromIndex:9, toIndex:12, title:"기본정보"},
								{fromIndex:13, toIndex:19, title:"위치정보"},
								{fromIndex:20, toIndex:22, title:"관리정보"},
								{fromIndex:23, toIndex:28, title:"GIS연계정보"},
								{fromIndex:29, toIndex:37, title:"코드정보"},
								{fromIndex:38, toIndex:41, title:"변경관리"},
								{fromIndex:42, toIndex:45, title:"통합국-층현황"},
								{fromIndex:46, toIndex:50, title:"통합국-일반현황"},
								{fromIndex:51, toIndex:55, title:"통합국-주장비[Acc분야]"},
								{fromIndex:56, toIndex:67, title:"통합국-주장비[전송분야]"},
								{fromIndex:68, toIndex:82, title:"통합국-부대시설"},
								{fromIndex:83, toIndex:90, title:"통합국-환경정보(전력,전송)"},
								{fromIndex:91, toIndex:92, title:"통합국변경관리"}
   		];

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		headerGroup : headerMappingN,
    		columnMapping: [
    		    /*부서정보 [1-6]*/
    		    { align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true, hidden : true },
    			{key : 'mgmtGrpNm', align:'center', title : '관리그룹', width: '90px' },
				{key : 'orgNm', align:'center', title : '본부', width: '100px' },
				{key : 'teamNm', align:'center', title : '팀', width: '100px' },
				{key : 'tmofNm', align:'center', title : '전송실', width: '150px' },
				{key : 'opTeamOrgNm', align:'center', title : '운용팀', width: '100px' },
				{key : 'opPostOrgNm', align:'center', title : '운용POST', width: '120px' },

				/*통합국정보  [7-8]*/
				{key : 'intgMtsoId', align:'center', title : '통합국ID', width: '120px'},
				{key : 'intgMtsoNm', align:'center', title : '통합국명', width: '150px'},

				/*기본정보 [9-12]*/
				{key : 'mtsoNm', align:'center', title : '국사명', width: '150px' },
				{key : 'mtsoGrNm', align:'center', title : '국사등급(KT DR)', width: '130px' },
				{key : 'mtsoTyp', align:'center', title : '국사유형', width: '100px' },
				{key : 'mtsoStat', align:'center', title : '국사상태', width: '100px'},

				/*위치정보 [13-19]*/
				{key : 'bldAddr', align:'center', title : '건물주소', width: '200px' },
				{key : 'bldNm', align:'center', title : '건물명', width: '130px' },
				{key : 'bldblkNm', align:'center', title : '건물동', width: '100px' },
				{key : 'bldFlorCnt', align:'center', title : '건물층값', width: '100px' },
				{key : 'eqpMgmtUmtsoNm', align:'center', title : '건물기준국사', width: '200px' },
				{key : 'mtsoLatValT', align:'center', title : '국사위도값', width: '100px' },
				{key : 'mtsoLngValT', align:'center', title : '국사경도값', width: '100px' },

				/*관리정보  [20-22]*/
				{key : 'mtsoAbbrNm', align:'center', title : '국사약어명', width: '150px' },
				{key : 'cnstnBpNm', align:'center', title : '시공업체', width: '100px' },
				{key : 'rcuIpVal', align:'center', title : 'RCU IP', width: '100px' },

				/*GIS연계정보 [23-28]*/
				{key : 'mtsoDetlTypNm', align:'center', title : '국사세부유형', width: '120px' },
				{key : 'linTypNm', align:'center', title : '인입유형', width: '100px' },
				{key : 'linDplxgTypNm', align:'center', title : '인입이중화', width: '120px' },
				{key : 'mtsoMapInsYn', align:'center', title : 'GIS입력여부', width: '100px' },
				{key : 'instlLocNm', align:'center', title : 'GIS설치위치', width: '100px' },
				{key : 'fildTlplItNo', align:'center', title : '한전전산번호', width: '100px' },

				/*코드정보 [29-35]*/
				{key : 'mtsoId', align:'center', title : '국사ID', width: '120px' },
				{key : 'bldCd', align:'center', title : '건물코드', width: '120px' },
				{key : 'repIntgFcltsCd', align:'center', title : '대표통시코드', width: '120px' },
				{key : 'ukeyMtsoId', align:'center', title : 'SWING국사코드', width: '120px' },
				{key : 'repIntgFcltsNm', align:'center', title : '대표통시명', width: '200px' },
				{key : 'shrRepFcltsCd', align:'center', title : '공대코드', width: '100px' },
				{key : 'shrRepFcltsNm', align:'center', title : 'ERP통시명', width: '200px'},

				/*사이트키 [36-37]*/
				{key : 'siteCd', align:'center', title : '사이트키', width: '100px' },
				{key : 'siteNm', align:'center', title : '사이트명', width: '100px' },

				/*변경관리 [38-41]*/
				{key : 'frstRegDate', align:'center', title : '등록일자', width: '100px' },
				{key : 'frstRegUserId', align:'center', title : '등록자', width: '100px' },
				{key : 'lastChgDate', align:'center', title : '변경일자', width: '100px' },
				{key : 'lastChgUserId', align:'center', title : '변경자', width: '100px' },

				/*통합국-층현황  [42-45]*/
				{key : 'mtsoNmVal', align:'center', title : '국사(층)명', width: '150px' },
				{key : 'florVal', align:'center', title : '층정보', width: '150px' },
				{key : 'florDivVal', align:'center', title : '층구분', width: '150px' },
				{key : 'intgMtsoScrePrcsNm', align:'center', title : '공정구분', width: '70px' },

				/*통합국-일반현황 [46-50]*/
				{key : 'cifSlfLesNm', align:'center', title : '국사소유', width: '100px' },
				{key : 'ptNm', align:'center', title : '운용파트', width: '150px' },
				{key : 'mtsoCntrTypNm', align:'center', title : '국사구분', width: '100px', hidden:true},
				{key : 'compNm', align:'center', title : '상주운협사', width: '150px' },
				{key : 'compHrscVal', align:'center', title : '상주인력', width: '70px' },

				/*통합국-주장비(Acc분야) [51-55]*/
				{key : 'accLteDuhVal', align:'center', title : 'DU-H', width: '100px' },
				{key : 'accLteDulVal', align:'center', title : 'DU-L', width: '100px' },
				{key : 'accLteDuVal', align:'center', title : 'DU', width: '100px' },
				{key : 'accLteRruVal', align:'center', title : 'RRU', width: '100px' },
				{key : 'accWcdmaBtsVal', align:'center', title : 'WCDMA', width: '100px' },

				/*통합국-주장비(전송분야) [56-67]*/
				{key : 'trmsG5BkhlVal', align:'center', title : '5G백홀', width: '100px' },
				{key : 'trmsLteIpBkhlVal', align:'center', title : 'LTE백홀', width: '100px' }, /* IP백홀    */
				{key : 'trmsComRoadmVal', align:'center', title : 'ROADM', width: '100px' },
				{key : 'trmsOtnVal', align:'center', title : 'OTN', width: '100px' },
				{key : 'trmsLtePtsVal', align:'center', title : 'PTS', width: '100px' },
				{key : 'trmsLteL2Val', align:'center', title : 'L2/L3', width: '100px' }, /* L2스위치  */
				{key : 'trms5GponVal', align:'center', title : '5G-PON', width: '100px' },
				{key : 'trmsG5SmuxVal', align:'center', title : '5G-SMUX', width: '100px' },
				{key : 'trmsG5CmuxVal', align:'center', title : '5G-CMUX', width: '100px' },
				{key : 'trmsLteRgmuxVal', align:'center', title : '링MUX', width: '100px' },
				{key : 'trmsFdfVal', align:'center', title : 'FDF', width: '100px' },
				{key : 'trmsEtcVal', align:'center', title : '기타', width: '100px' },

				/*통합국-부대시설 [68-82]*/
				{key : 'trmsRtfMdlNm', align:'center', title : '정류기모델', width: '120px' },
				{key : 'trmsRtfQutyVal', align:'center', title : '정류기수량(식)', width: '120px' },
				{key : 'trmsRtfMdulVal', align:'center', title : '정류기모듈(EA)', width: '120px' },
				{key : 'trmsRtfFcltsCapaVal', align:'center', title : '정류기용량(A)', width: '120px' },
				{key : 'trmsRtfUseLoadVal', align:'center', title : '정류기현재부하(A)', width: '120px' },
				{key : 'trmsBatryQutyVal', align:'center', title : '축전지수량(조)', width: '120px' },
				{key : 'trmsBatryCapaVal', align:'center', title : '축전지용량(AH)', width: '120px'},
				{key : 'trmsBatryBkTimeVal', align:'center', title : '축전지백업시간(분)', width: '120px' },
				{key : 'trmsBatryBkTimeUscreRsn', align:'center', title : '축전지 미확보사유', width: '120px' },
				{key : 'comUseYn', align:'center', title : '정류기,축전지 ACC/전송', width: '150px' },
				{key : 'accArcnQutyVal', align:'center', title : '냉방기수량(대)', width: '120px' },
				{key : 'accArcnCapaVal', align:'center', title : '냉방기용량(RT)', width: '120px' },
				{key : 'trmsGoutTimeVal', align:'center', title : '출동시간(분)', width: '120px' },
				{key : 'trmsGoutDistVal', align:'center', title : '출동거리(Km)', width: '120px' },
				{key : 'trmsGoutPostVal', align:'center', title : '출동포스트', width: '120px' },

				/*통합국-환경정보(전력, 전송) [83-90]*/
				{key : 'epwrFixdGntEyn', align:'center', title : '고정발전기 유무', width: '120px' },
				{key : 'epwrMovGntEyn', align:'center', title : '이동발전차량/전원투입단자유무', width: '120px' },
				{key : 'epwrDlstYn', align:'center', title : '전원 인입 이원화여부', width: '120px' },
				{key : 'trmsOptlLnDlstYn', align:'center', title : '광선로 인입 이원화여부', width: '120px' },
				{key : 'envIntnCctvEyn', align:'center', title : '내부CCTV 유무', width: '120px' },
				{key : 'envFlodSnsrEyn', align:'center', title : '침수센서 유무', width: '120px' },
				{key : 'flodSnsrNeedYn', align:'center', title : '침수센서 필요 여부', width: '150px'},
				{key : 'etcMtrVal', align:'center', title : '운용상 내재된 Risk/문제', width: '200px'},

				/*통합국변경관리 [91-92]*/
				{key : 'tLastChgDate', align:'center', title : '변경일자', width: '120px' },
				{key : 'tLastChgUserId', align:'center', title : '변경자', width: '120px'},






				/***************************************
				 * 통합국관련 삭제 컬럼들
				 ***************************************/
//				{key : 'accGoutTimeVal', align:'center', title : '출동시간(분)', width: '120px' },
//				{key : 'accGoutDistVal', align:'center', title : '출동거리(Km)', width: '120px' },
//				{key : 'accGoutPostVal', align:'center', title : '출동포스트', width: '120px' },
//
//				{key : 'plntDesc', align:'center', title : '본부', width: '150px' },
//				{key : 'cstCntrDesc', align:'center', title : '운용팀', width: '150px' },
//				{key : 'repIntgFcltsNm', align:'center', title : '대표통합시설명', width: '200px' },
//				{key : 'cellCnt', align:'center', title : '운용CELL수', width: '100px' },
//				{key : 'bldAddr', align:'center', title : '주소', width: '300px' },
//				{key : 'mtsoLatVal', align:'center', title : '위도', width: '100px' },
//				{key : 'mtsoLngVal', align:'center', title : '경도', width: '100px' },
//				{key : 'bldFlopList', align:'center', title : '층', width: '90px' },
//				{key : 'accLteRruF800mVal', align:'center', title : 'RRU(800MHz)', width: '120px' },
//				{key : 'accLteRruF18gVal', align:'center', title : 'RRU(1.8GHz)', width: '120px' },
//				{key : 'accLteRruF21gVal', align:'center', title : 'RRU(2.1GHz)', width: '120px' },
//				{key : 'accLteRruF26gVal', align:'center', title : 'RRU(2.6GHz)', width: '120px' },
//				{key : 'acc1xBtsVal', align:'center', title : 'BTS', width: '120px' },
//				{key : 'accG2BtsVal', align:'center', title : 'BTS', width: '120px' },
//				{key : 'accWbrRasVal', align:'center', title : 'RAS', width: '120px' },
//				{key : 'accRtfMdlNm', align:'center', title : '모델', width: '120px' },
//				{key : 'accRtfQutyVal', align:'center', title : '수량(식)', width: '120px' },
//				{key : 'accRtfMdulVal', align:'center', title : '모듈(EA)', width: '120px' },
//				{key : 'accRtfFcltsCapaVal', align:'center', title : '시설용량(A)', width: '120px' },
//				{key : 'accRtfUseLoadVal', align:'center', title : '현사용부하(A)', width: '120px' },
//				{key : 'accBatryQutyVal', align:'center', title : '수량(조)', width: '120px' },
//				{key : 'accBatryCapaVal', align:'center', title : '용량(AH)', width: '120px' },
//				{key : 'accBatryBkTimeVal', align:'center', title : '백업시간(분)', width: '120px' },
//				{key : 'accBatryBkTimeUscreRsn', align:'center', title : '백업시간 미확보사유', width: '120px' },
//				{key : 'trmsMsppVal', align:'center', title : 'MSPP', width: '120px' },
//				{key : 'trmsSkt2Val', align:'center', title : 'SKT2', width: '120px' },



				/***************************************
				 * 기본 hidden 컬럼 - 삭제시 상세페이지 오류남
				 ***************************************/
				{/* 건물지도  */
				key : 'buildingMap', title : '건물지도', align:'center', width: '65px', render : function(value, data, render, mapping){
  	    			          return '<div style="width:100%"><span class="Valign-md"></span><button class="grid_search_icon Valign-md" id="btnBuildingMap" type="button"></button></div>';
  	    		}},

				{/* 후보대상 현재상태		 */
				key : 'cifTakeAprvStatNm', align:'center', title : '후보대상상태', width: '100px' },
				{/* 해제대상 현재상태		 */
				key : 'cifTakeRlesStatNm', align:'center', title : '해제대상상태', width: '100px' },
				{/* 건물동--숨김데이터		 */
				key : 'bldblkNo', align:'center', title : configMsgArray['buildingBlock'], width: '100px' },
				{/* 건물층값--숨김데이터		 */
				key : 'bldFlorNo', align:'center', title : configMsgArray['buildingFloorValue'], width: '100px' },
				{/* 관리그룹코드--숨김데이터        */
				key : 'mgmtGrpCd', align:'center', title : configMsgArray['managementGroupCode'], width: '100px' },

				{/* 국사위도값          */
				key : 'mtsoLatVal', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeLatitudeValue'], width: '100px' },
				{/* 국사경도값          */
				key : 'mtsoLngVal', align:'center', title : configMsgArray['mobileTelephoneSwitchingOfficeLongitudeValue'], width: '100px' },
				{/* 운용Cell수	 */
				key : 'cellCnt', align:'center', title : '운용Cell수', width: '100px' },

				{/* SKTSKB 통합국사여부    */
				key : 'sktSkbIntgMtsoYn', align:'center', title : 'SKTSKB 통합국사여부', width: '120px' },
				{/* GIS설치위치    */
				key : 'instlLocCd', align:'center', title : 'GIS설치위치코드', width: '100px' },
				{/* 국사등급코드 */
				key : 'mtsoGrCd', align:'center', title : '국사등급(KT DR)', width: '100px' },
				{/* 전송실 	--숨김데이터	 */
				key : 'tmof', align:'center', title : configMsgArray['transmissionOffice'], width: '150px' },
				{/* 본부ID	--숨김데이터	 */
				key : 'orgId', align:'center', title : configMsgArray['headOfficeIdentification'], width: '100px' },
				{/* 팀ID--숨김데이터			 */
				key : 'teamId', align:'center', title : configMsgArray['teamIdentification'], width: '100px' }

			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });



      //그리드 생성, 국사별 기지국 상세 정보
        $('#'+gridIdDistance).alopexGrid({
        	height:"5row",
        	autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		numberingColumnFromZero: false,
    		columnMapping: [{
				align:'center', title : configMsgArray['sequence'], width: '50px', numberingColumn: true },
				{/* 장비명		 */
				key : 'eqpNm', align:'center', title : '장비명', width: '180px' },
				{/* 통합시설코드		 */
				key : 'intgFcltsCd', align:'center', title : '통합시설코드', width: '100px' },
				{/* RU건수          */
				key : 'ruCount', align:'center', align:'center', title : 'RU건수', width: '70px',
				render : function(value, data, render, mapping){
					if(data.ruCount != "0"){
						return "<div style='width:100%'><u><a href='javascript:main.CifMtsoDtlRuList("+data.bmtsoCuidVal+")'>"+data.ruCount+"</a></u></div>";
					}else{
						return "<div style='width:100%'>"+data.ruCount+"</div>";
					}
		        } },
		        {/* 장비모델명          */
				key : 'eqpMdlNm', align:'center', title : '장비모델명', width: '150px' },
				{/*장비상태          */
				key : 'eqpStatNm', align:'center', title : '장비상태', width: '100px' },
				{/* 장비역할구분          */
				key : 'eqpRoleDivNm', align:'center', title : '장비역할구분', width: '100px' },
				{/* 메인장비IP주소            */
				key : 'mainEqpIpAddr', align:'center', title : '메인장비IP주소', width: '100px' },
				{/* 장비통시		 */
				key : 'intgFcltsCd', align:'center', title : '장비통시', width: '100px' },
				{/* 장비바코드		 */
				key : 'barNo', align:'center', title : '바코드', width: '100px' },
				{/* 장비시리얼번호값		 */
				key : 'eqpSerNoVal', align:'center', title : '장비시리얼번호', width: '100px' },
				{/* 공사코드		 */
				key : 'cstrMgmtNo', align:'center', title : '공사코드', width: '100px' },
				{/* 상면랙번호		 */
				key : 'upsdRackNo', align:'center', title : '상면랙번호', width: '100px' },
				{/* 상면쉘프번호		 */
				key : 'upsdShlfNo', align:'center', title : '상면쉘프번호', width: '100px' },
				{/* 장비비고		 */
					key : 'eqpRmk', align:'center', title : '장비비고', width: '100px' },
				{/* 장비ID		 */
				key : 'eqpId', align:'center', title : '장비ID', width: '100px' }
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = [
	                   	  	/*부서정보*/
							  'mgmtGrpNm', 'orgNm', 'teamNm', 'tmofNm', 'opPostOrgNm'
							  	/*통합국정보*/
							, 'intgMtsoId', 'intgMtsoNm'
								/*기본정보*/
    		, 'mtsoGrNm', 'mtsoStat'
								/*위치정보*/
    		, 'bldblkNm', 'bldFlorCnt', 'eqpMgmtUmtsoNm', 'mtsoLatValT', 'mtsoLngValT'
								/*관리정보*/
    		, 'mtsoAbbrNm', 'cnstnBpNm', 'rcuIpVal'
								/*GIS연계정보*/
    		, 'mtsoDetlTypNm', 'linTypNm', 'linDplxgTypNm', 'mtsoMapInsYn', 'instlLocNm', 'fildTlplItNo'
								/*코드정보*/
    		, 'repIntgFcltsCd', 'repIntgFcltsNm'
								/*사이트키*/
    		, 'siteNm'
								/*변경관리*/
    		, 'frstRegDate', 'frstRegUserId', 'lastChgDate', 'lastChgUserId'
								/*통합국-층현황*/
							, 'mtsoNmVal', 'florVal', 'florDivVal'
								/*통합국-일반현황*/
							, 'intgMtsoScrePrcsNm', 'ptNm', 'mtsoCntrTypNm', 'cifSlfLesNm', 'compNm', 'compHrscVal'
								/*통합국-주장비(Acc분야)*/
							, 'accLteDuhVal', 'accLteDulVal', 'accLteDuVal', 'accLteRruVal', 'accWcdmaBtsVal'
								/*통합국-주장비(전송분야)*/
							, 'trmsG5BkhlVal', 'trmsLteIpBkhlVal', 'trmsComRoadmVal', 'trmsOtnVal', 'trmsLtePtsVal', 'trmsLteL2Val', 'trms5GponVal', 'trmsG5SmuxVal', 'trmsG5CmuxVal', 'trmsLteRgmuxVal', 'trmsFdfVal', 'trmsEtcVal'
								/*통합국-부대시설(전송분야)*/
							, 'trmsRtfMdlNm', 'trmsRtfQutyVal', 'trmsRtfMdulVal', 'trmsRtfFcltsCapaVal', 'trmsRtfUseLoadVal', 'trmsBatryQutyVal', 'trmsBatryCapaVal'
							, 'trmsBatryBkTimeVal', 'trmsBatryBkTimeUscreRsn', 'comUseYn', 'accArcnQutyVal', 'accArcnCapaVal', 'trmsGoutTimeVal', 'trmsGoutDistVal', 'trmsGoutPostVal'
								/*통합국-환경정보(전력, 전송)*/
							, 'epwrFixdGntEyn', 'epwrMovGntEyn', 'epwrDlstYn', 'trmsOptlLnDlstYn', 'envIntnCctvEyn', 'envFlodSnsrEyn', 'flodSnsrNeedYn', 'etcMtrVal'
								/*통합국-변경관리 */
							, 'tLastChgDate', 'tLastChgUserId'

			, 'shrRepFcltsCd', 'shrRepFcltsNm', 'cifTakeAprvStatNm', 'cifTakeRlesStatNm', 'bldblkNo', 'bldFlorNo', 'mgmtGrpCd', 'repIntgFcltsCd', 'ukeyMtsoId', 'mtsoLatVal', 'mtsoLngVal', 'buildingMap','cellCnt', 'sktSkbIntgMtsoYn', 'instlLocCd', 'mtsoGrCd', 'tmof', 'orgId', 'teamId'
    		];

    	var mgmtGrpNm = $("#mgmtGrpNm").val();
    	//alert(mgmtGrpNm)
    	if(mgmtGrpNm == "SKT" || mgmtGrpNm == null){
    		hideColList.splice(hideColList.indexOf('repIntgFcltsCd'),1);
    	} else {
    		hideColList.splice(hideColList.indexOf('ukeyMtsoId'),1);
    	}

    	var mtsoStatCd	= $("#mtsoStatCd").val();
    	//console.log("------------"+mtsoStatCd);
    	if (mtsoStatCd == "02" || mtsoStatCd == "03" || mtsoStatCd == "" ) {
    		hideColList.splice(hideColList.indexOf('mtsoStat'),1);
    	}

    	if($("input:checkbox[id='mtsoChk']").is(":checked")) {
    		hideColList.splice(hideColList.indexOf('shrRepFcltsCd'),1);
    		hideColList.splice(hideColList.indexOf('shrRepFcltsNm'),1);
   		}

    	//2023 구축고도화 phase2
    	if($("input:checkbox[id='intgMtsoChk']").is(":checked")) {
    		hideColList.splice(hideColList.indexOf('mtsoNmVal'),1);
			hideColList.splice(hideColList.indexOf('florVal'),1);
			hideColList.splice(hideColList.indexOf('florDivVal'),1);
   		}

    	$("input[id=srchGrGubun]:checked").each(function() {
    		var srchGrGubun = $(this).val();
    		if (srchGrGubun == 'A') { //부서정보
    			hideColList.splice(hideColList.indexOf('mgmtGrpNm'),1);
				hideColList.splice(hideColList.indexOf('orgNm'),1);
				hideColList.splice(hideColList.indexOf('teamNm'),1);
				hideColList.splice(hideColList.indexOf('tmofNm'),1);
				hideColList.splice(hideColList.indexOf('opPostOrgNm'),1);
    		} else if (srchGrGubun == 'B') { //기본정보
    			hideColList.splice(hideColList.indexOf('mtsoGrNm'),1);
    		} else if (srchGrGubun == 'C') { //위치정보
    			hideColList.splice(hideColList.indexOf('bldblkNm'),1);
				hideColList.splice(hideColList.indexOf('bldFlorCnt'),1);
				hideColList.splice(hideColList.indexOf('eqpMgmtUmtsoNm'),1);
				hideColList.splice(hideColList.indexOf('mtsoLatValT'),1);
				hideColList.splice(hideColList.indexOf('mtsoLngValT'),1);
    		} else if (srchGrGubun == 'D') { //관리정보
    			hideColList.splice(hideColList.indexOf('mtsoAbbrNm'),1);
				hideColList.splice(hideColList.indexOf('cnstnBpNm'),1);
				hideColList.splice(hideColList.indexOf('rcuIpVal'),1);
    		} else if (srchGrGubun == 'E') { //GIS연계정보
    			hideColList.splice(hideColList.indexOf('mtsoDetlTypNm'),1);
				hideColList.splice(hideColList.indexOf('linTypNm'),1);
				hideColList.splice(hideColList.indexOf('linDplxgTypNm'),1);
				hideColList.splice(hideColList.indexOf('mtsoMapInsYn'),1);
				hideColList.splice(hideColList.indexOf('instlLocNm'),1);
				hideColList.splice(hideColList.indexOf('fildTlplItNo'),1);
    		} else if (srchGrGubun == 'F') { //코드정보
    			hideColList.splice(hideColList.indexOf('repIntgFcltsCd'),1);
				hideColList.splice(hideColList.indexOf('repIntgFcltsNm'),1);
    		} else if (srchGrGubun == 'G') { //사이트키
    			hideColList.splice(hideColList.indexOf('siteNm'),1);
    		} else if (srchGrGubun == 'H') { //변경관리
    			hideColList.splice(hideColList.indexOf('frstRegDate'),1);
				hideColList.splice(hideColList.indexOf('frstRegUserId'),1);
				hideColList.splice(hideColList.indexOf('lastChgDate'),1);
				hideColList.splice(hideColList.indexOf('lastChgUserId'),1);
    		} else if (srchGrGubun == 'I') { //2023 구축고도화 phase2 - 통합국정보(통합국조회시 선택가능)
    			hideColList.splice(hideColList.indexOf('intgMtsoScrePrcsNm'),1);
    			hideColList.splice(hideColList.indexOf('ptNm'),1);
				hideColList.splice(hideColList.indexOf('mtsoCntrTypNm'),1);
				hideColList.splice(hideColList.indexOf('cifSlfLesNm'),1);
				hideColList.splice(hideColList.indexOf('compNm'),1);
				hideColList.splice(hideColList.indexOf('compHrscVal'),1);
    			/*통합국-주장비(Acc분야)*/
				hideColList.splice(hideColList.indexOf('accLteDuhVal'),1);
				hideColList.splice(hideColList.indexOf('accLteDulVal'),1);
				hideColList.splice(hideColList.indexOf('accLteDuVal'),1);
				hideColList.splice(hideColList.indexOf('accLteRruVal'),1);
				hideColList.splice(hideColList.indexOf('accWcdmaBtsVal'),1);
    			/*통합국-주장비(전송분야)*/
				hideColList.splice(hideColList.indexOf('trmsG5BkhlVal'),1);
				hideColList.splice(hideColList.indexOf('trmsLteIpBkhlVal'),1);
				hideColList.splice(hideColList.indexOf('trmsComRoadmVal'),1);
				hideColList.splice(hideColList.indexOf('trmsOtnVal'),1);
				hideColList.splice(hideColList.indexOf('trmsLtePtsVal'),1);
				hideColList.splice(hideColList.indexOf('trmsLteL2Val'),1);
				hideColList.splice(hideColList.indexOf('trms5GponVal'),1);
				hideColList.splice(hideColList.indexOf('trmsG5SmuxVal'),1);
				hideColList.splice(hideColList.indexOf('trmsG5CmuxVal'),1);
				hideColList.splice(hideColList.indexOf('trmsLteRgmuxVal'),1);
				hideColList.splice(hideColList.indexOf('trmsFdfVal'),1);
				hideColList.splice(hideColList.indexOf('trmsEtcVal'),1);
    			/*통합국-부대시설*/
				hideColList.splice(hideColList.indexOf('trmsRtfMdlNm'),1);
				hideColList.splice(hideColList.indexOf('trmsRtfQutyVal'),1);
				hideColList.splice(hideColList.indexOf('trmsRtfMdulVal'),1);
				hideColList.splice(hideColList.indexOf('trmsRtfFcltsCapaVal'),1);
				hideColList.splice(hideColList.indexOf('trmsRtfUseLoadVal'),1);
				hideColList.splice(hideColList.indexOf('trmsBatryQutyVal'),1);
				hideColList.splice(hideColList.indexOf('trmsBatryCapaVal'),1);
				hideColList.splice(hideColList.indexOf('trmsBatryBkTimeVal'),1);
				hideColList.splice(hideColList.indexOf('trmsBatryBkTimeUscreRsn'),1);
				hideColList.splice(hideColList.indexOf('comUseYn'),1);
				hideColList.splice(hideColList.indexOf('accArcnQutyVal'),1);
				hideColList.splice(hideColList.indexOf('accArcnCapaVal'),1);
				hideColList.splice(hideColList.indexOf('trmsGoutTimeVal'),1);
				hideColList.splice(hideColList.indexOf('trmsGoutDistVal'),1);
				hideColList.splice(hideColList.indexOf('trmsGoutPostVal'),1);
    			/*통합국-환경정보(전력, 전송)*/
				hideColList.splice(hideColList.indexOf('epwrFixdGntEyn'),1);
				hideColList.splice(hideColList.indexOf('epwrMovGntEyn'),1);
				hideColList.splice(hideColList.indexOf('epwrDlstYn'),1);
				hideColList.splice(hideColList.indexOf('trmsOptlLnDlstYn'),1);
				hideColList.splice(hideColList.indexOf('envIntnCctvEyn'),1);
				hideColList.splice(hideColList.indexOf('envFlodSnsrEyn'),1);
				hideColList.splice(hideColList.indexOf('flodSnsrNeedYn'),1);
				hideColList.splice(hideColList.indexOf('etcMtrVal'),1);
    			/*통합국변경관리*/
				hideColList.splice(hideColList.indexOf('tLastChgDate'),1);
				hideColList.splice(hideColList.indexOf('tLastChgUserId'),1);

    		}else if(srchGrGubun == 'J'){ //2023 구축고도화 phase2 - 통합국정보
    			hideColList.splice(hideColList.indexOf('intgMtsoId'),1);
        		hideColList.splice(hideColList.indexOf('intgMtsoNm'),1);
    		}
    	});
//    	console.log("hideColList : " , hideColList);
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

    	var distanceHideColList = ['mtsoId'];
    	$('#'+gridIdDistance).alopexGrid("hideCol", distanceHideColList, 'conceal');

	}
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {

    	//버튼을 비활성화 시킬때 버튼 색상이 이상하게 변경되어 삽입
    	$('#btnAdtnCurst').css({'background-color': '#fff !important', 'color': '#383fae !important'});
		$('#btnAprvAdd').css({'background-color': '#fff !important', 'color': '#383fae !important'});
    	$('#btnAprvObj').css({'background-color': '#fff !important', 'color': '#383fae !important'});
		$('#btnRlesObj').css({'background-color': '#fff !important', 'color': '#383fae !important'});

		var chrrOrgGrpCd;
		if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		}else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		}


		 var op = $('#'+gridId).alopexGrid('readOption');

		 if(chrrOrgGrpCd == "SKT"){
			 $("#sktMtso").show();
			 $("#skbMtso").hide();
			 $('#btnAprvObj').setEnabled(true);
			 $('#btnRlesObj').setEnabled(true);
			 $('#btnAprvAdd').setEnabled(true);
		 }else{
			 $("#sktMtso").hide();
			 $("#skbMtso").show();
			 $('#btnAprvObj').setEnabled(false);
			 $('#btnRlesObj').setEnabled(false);
			 $('#btnAprvAdd').setEnabled(false);
		 }

		//관리그룹 조회
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');		// 관리 그룹

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02016', null, 'GET', 'mtsoDetlTyp');		// 국사 세부유형
    	 //httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
    	 //httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00293', null, 'GET', 'mtsoTyp');
    	 //운용팀 조회
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');		// 운용팀 전체
    	 //httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPost');		// 운용 Post 전체

    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00186', null, 'GET', 'mtsoStat');			// 국사 상태
    	 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00761', null, 'GET', 'gisInstlLocCd');	//GIS설치위치

    	 //2023 통합국사 고도화 - 통합국사 관리권한 소유자만  등록/수정 가능
    	 if($("#adtnAttrVal").val().indexOf('CIF_MTSO_APRV_A') > 0){
    		 $("#btnIntgMtsoReg").show();
 		}
    }


    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage);
         });

         $(document).on('click', 'input[id=srchAllCk]', function (e) {
          	var bldChkGubun = $("input:checkbox[id=srchAllCk]").is(":checked") ? true : false;
  			if (bldChkGubun) {
  				var bldChk = $("input:checkbox[id=bldChk]").is(":checked") ? true : false;
  				if (bldChk){
  					$("input:checkbox[id=srchGrGubun][value='I']").setChecked(true);
  				}
  				$("#srchGrGubun").setValues(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J']);
  			} else {
  				$("#srchGrGubun").setValues([]);
  				$("input:checkbox[id=srchGrGubun][value='I']").setChecked(false);
  			}
  			initGrid();
   		});

         $(document).on('click', 'input[id=bldChk]', function (e) {
         	var bldChkGubun = $("input:checkbox[id=bldChk]").is(":checked") ? true : false;
 			if (!bldChkGubun) {
 				$("input:checkbox[id=srchGrGubun][value='I']").setChecked(false);
 			}
 			initGrid();
  		});

        $(document).on('click', 'input[id=srchGrGubun]', function (e) {
        	initGrid();
//        	var tYn = false;
//        	var bldChkGubun = $("input:checkbox[id=bldChk]").is(":checked") ? true : false;
//			if (!bldChkGubun) {
//	        	$("input[id=srchGrGubun]:checked").each(function() {
//	        		var srchGrGubun = $(this).val();
//	        		if (srchGrGubun == 'I') {
//	        			tYn = true;
//	        		}
//	        	});
//			}
//        	if (tYn && !bldChkGubun) {
//        		callMsgBox('','I', '조회 항목 중 "건물통합조회"에 자동 체크되며, 목록은 "재 조회" 하여 주시기 바랍니다.', function(msgId, msgRst){});
//        		$("input:checkbox[id=bldChk]").setChecked(true);
//	        	//$('#btnSearch').click();
//        	}

 		});

        //2023 고도화 phase2 - 통합국조회
        $(document).on('click', 'input[id=intgMtsoChk]', function (e) {
        	var intgChk = $("input:checkbox[id='intgMtsoChk']").is(":checked");
        	if(intgChk){
        		if($('#mgmtGrpNm').val() == "SKT") {
        			//국사유형 -중심국사로 변경
    				$("#mtsoTypCdList").setData({mtsoTypCdList:2});

    				//통합국정보 체크
    				$("input[id=srchGrGubun]").each(function() {
	        		var srchGrGubun = $(this).val();
    		    		if (srchGrGubun == 'J') {
    		    			$("input:checkbox[id=srchGrGubun][value='J']").setChecked(true);
	        		}
	        	});

    				//통합국현황을 활성화
//    				$("#srchGrGubunIntg").setEnabled(true);
    				$("input:checkbox[id=srchGrGubun][value='I']").setEnabled(true);
    				$("input:checkbox[id=srchGrGubun][value='I']").setChecked(true);
       			}
        	}else{
        		//통합국현황을 비활성화
        		$("input:checkbox[id=srchGrGubun][value='I']").setEnabled(false);
        		$("input:checkbox[id=srchGrGubun][value='I']").setChecked(false);
        		$("input:checkbox[id=srchGrGubun][value='J']").setChecked(false);

        		var mtsoTypCdVal = $('#mtsoTypCdList').val();
        		if(mtsoTypCdVal != null){
        			var hasCd = mtsoTypCdVal.includes("2"); //중심국사를 선택할 경우
        			if(hasCd){
            			$("input:checkbox[id=srchGrGubun][value='J']").setChecked(true);
            		}else{
            			$("input:checkbox[id=srchGrGubun][value='J']").setChecked(false);
            		}
			}
        	}

        	initGrid();
  		});

        $('#mtsoTypCdList').on('change', function(e) {
        	var mtsoTypCdVal = $(this).val();
        	console.log("mtsoTypCdVal : ", mtsoTypCdVal);
        	if(mtsoTypCdVal != null){
        		var hasCd = mtsoTypCdVal.includes("2"); //중심국사를 선택할 경우
        		if(hasCd){
        			$("input:checkbox[id=srchGrGubun][value='J']").setChecked(true);
        		}else{
        			$("input:checkbox[id=srchGrGubun][value='J']").setChecked(false);
        		}
        	}else{
        		$("input:checkbox[id=srchGrGubun][value='J']").setChecked(false);
        	}

        	initGrid();
 		});

    	//조회
     	$('#btnSearch').on('click', function(e) {
     		$('#aprvRlesVal').val('');
 			$('#btnAprvObj').css({'background-color': '#fff !important', 'color': '#383fae !important'});
 			$('#btnRlesObj').css({'background-color': '#fff !important', 'color': '#383fae !important'});
     		 main.setGrid(1,perPage);
          });
     	//후보대상
     	$('#btnAprvObj').on('click', function(e) {
     		$('#aprvRlesVal').val('01');
     		$('#btnAprvObj').css({'background-color': '#383fae !important', 'color': '#fff !important'});
     		$('#btnRlesObj').css({'background-color': '#fff !important', 'color': '#383fae !important'});
     		 main.setGrid(1,perPage);
          });
     	//제외대상
     	$('#btnRlesObj').on('click', function(e) {
     		$('#aprvRlesVal').val('02');
     		$('#btnAprvObj').css({'background-color': '#fff !important', 'color': '#383fae !important'});
     		$('#btnRlesObj').css({'background-color': '#383fae !important', 'color': '#fff !important'});
     		 main.setGrid(1,perPage);
          });

     	//중통집 후보추가
     	$('#btnAprvAdd').on('click', function(e) {
	   		 var param = {fromCifMtsoYn : "Y"};
	   		 $a.popup({
	   	          	popid: 'MtsoLkup',
	   	          	title: configMsgArray['findMtso'],
	   	            url: '/tango-transmission-web/configmgmt/common/MtsoLkup.do',
	   	            data: param,
	   	            windowpopup : true,
	   	            modal: true,
	                movable:true,
	   	            width : 950,
	   	           	height : 785
	   	      });
        });

     	//중통집 추가 현황
     	$('#btnAdtnCurst').on('click', function(e) {
	   		 $a.popup({
	   	          	popid: 'MtsoLkup',
	   	          	title: '중통집 추가 현황',
	   	            url: '/tango-transmission-web/configmgmt/common/CifMtsoAdtnCurst.do',
	   	            windowpopup : true,
	   	            modal: true,
	                movable:true,
	   	            width : window.innerWidth * 0.9,
	   	           	height : 700
	   	      });
        });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage);
       		}
     	 });

       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {
    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
    		 var option_data =  null;
    		 if($('#mgmtGrpNm').val() == "SKT") {
    			 option_data =  [{comCd: "1",comCdNm: "전송실"}, {comCd: "2",comCdNm: "중심국사"}, {comCd: "3",comCdNm: "기지국사"}, {comCd: "4",comCdNm: "국소"} ];
  			 } else {
  				option_data =  [{comCd: "1",comCdNm: "정보센터"}, {comCd: "2",comCdNm: "국사"}, {comCd: "4",comCdNm: "국소"} ];
  			 }
    		 $('#mtsoTypCdList').setData({data:option_data});
    		 var op = $('#'+gridId).alopexGrid('readOption');
    		 if(mgmtGrpNm == "SKT"){
    			//통합국조회 조건 비활성화 - only SKT
    			 $("#intgMtsoChk").setEnabled(true);

    			 $("#sktMtso").show();
    			 $("#skbMtso").hide();
    			 op.columnMapping[19].title = "국사약어명" ;
    			 $('#btnAprvObj').setEnabled(true);
    			 $('#btnRlesObj').setEnabled(true);
    			 $('#btnAprvAdd').setEnabled(true);
    		 }else{
    			//통합국조회 조건 비활성화 - only SKT
    			 $("#intgMtsoChk").setEnabled(false);
    			 $("#intgMtsoChk").setChecked(false);
    			 $("input:checkbox[id=srchGrGubun][value='J']").setEnabled(false);
    			 $("input:checkbox[id=srchGrGubun][value='J']").setChecked(false);
    			 $("input:checkbox[id=srchGrGubun][value='I']").setEnabled(false);
    			 $("input:checkbox[id=srchGrGubun][value='I']").setChecked(false);

    			 $("#sktMtso").hide();
    			 $("#skbMtso").show();
    			 op.columnMapping[19].title = "GIS국사명" ;
    			 $('#btnAprvObj').setEnabled(false);
    			 $('#btnRlesObj').setEnabled(false);
    			 $('#btnAprvAdd').setEnabled(false);
    		 }

//    		 console.log("op.columnMapping : ", op.columnMapping);
//
//
    		 var intgChk = $("input:checkbox[id='intgMtsoChk']").is(":checked");
    		 if(intgChk){
    			 $('#'+gridId).alopexGrid('showCol',['intgMtsoId','intgMtsoNm']);
    			 $('#'+gridId).alopexGrid('hideCol',['mtsoNm','mtsoTyp'], true);
    		 }else{
    			 $('#'+gridId).alopexGrid('showCol',['mtsoNm','mtsoTyp']);
    			 $('#'+gridId).alopexGrid('hideCol',['intgMtsoId','intgMtsoNm'], true);

    		 }

    		 initGrid();
         });

    	//본부 선택시 이벤트
    	$('#orgId').on('change', function(e) {
    		var orgId = $('#orgId').val();
    		if (orgId == '') {
 	   			var mgmtGrpNm = $("#mgmtGrpNm").val();
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'fstTeam');
 	   		 } else {
 	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgId, null, 'GET', 'fstTeam');
 	   		 }
         });

    	 // 팀을 선택했을 경우
    	 $('#teamIdList').on('change', function(e) {
    		//멀티 셀렉트로 인한 변경(20200814)
    		var mgmtGrpNm = $("#mgmtGrpNm").val();
    		var orgId = $('#orgId').val();
    		var teamIdList = $('#teamIdList').val();

     	 	if (orgId == '' && (teamIdList == '' || teamIdList == null)){
			    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    	 	} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
    	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmof');
    		} else {
    			$('#pageNo').val(1);
    			$('#rowPerPage').val(1);
    			var param =  $("#searchForm").serialize();
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multiTmof');
    		}


    	 });

    	 $('#opTeamOrgIdList').on('change', function(e) {

    		 var orgID =  $("#opTeamOrgIdList").val();
    		 if(orgID == '' || orgID == null){
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPost');
    		 } else {
    			$('#pageNo').val(1);
     			$('#rowPerPage').val(1);
     			var param =  $("#searchForm").serialize();
    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiOpTeamPostList', param,'GET', 'multiOpTeamPost');
    		 }
         });

    	//중복국사관리
    	 $('#btnDupMtsoMgmt').on('click', function(e) {
    		 $a.popup({
		          	popid: 'DupMtsoMgmt',
		          	title: configMsgArray['findEquipment'],
		            url: '/tango-transmission-web/configmgmt/common/DupMtsoMgmt.do',
		            modal: true,
			        windowpopup : true,
		            movable:true,
		            width : 1200,
		           	height : window.innerHeight * 0.83,
  			 });

         });

    	 $('#mtsoStatCd').on('change', function(e) {
    		 initGrid();
         });

    	//국사등록
    	 $('#btnReg').on('click', function(e) {
    		 MtsoReg();
         });

    	 $('#btnAddrSearch').on('click', function(e) {
    		 $a.popup({
    				popid : 'SearchAddress',
    				url: '/tango-transmission-web/demandmgmt/buildinginfomgmt/SearchAddress.do',
    				modal : true,
    				width : 830,
    				height : 630,
    				title : '주소 검색',
    				movable : true,
    				callback : function(data){
//    					console.log(data);

    					var bunji = "";

    					if(data.selectSmlBunjiVal != "") {
//    						if(data.selectSmlBunjiVal != "0") {
    							bunji = data.selectBigBunjiVal + "-" + data.selectSmlBunjiVal;
//    						}
//    						else {
//    							bunji = data.selectBigBunjiVal;
//    							console.log(" data.selectSmlBunjiVal : " + data.selectSmlBunjiVal );
//    						}
    					}
    					else {
    						bunji = data.selectBigBunjiVal;
    					}

//    					console.log("bunji : " + bunji);

    					var lndDivCd = "";

    					if(data.selectLndDivCd == "2") {
    						lndDivCd = "산 ";
    					}
    					else if(data.selectLndDivCd == "3") {
    						lndDivCd = "블록 ";
    					}

    					var finalBunji = "";

    					if(data.selectLndDivCd == "3" && bunji == "") {
    						finalBunji = "블록";
    					}
    					else {
    						finalBunji = lndDivCd + bunji;
    					}


    					$('#bldAddrSearch').val(data.selectAllAddr + " " + finalBunji);
    					$('#bunjiVal').val(bunji);
    					$('#ldongCd').val(data.selectLdongCd);
    				}
    			});
		 });

    	 $('#btnAddrDel').on('click', function(e) {
    		 $('#bldAddrSearch').val("");
    		 $('#bunjiVal').val("");
    		 $('#ldongCd').val("");
    	 });

    	 $('#btnCifMtsoMgmt').on('click', function(e) {
    		 window.open('/tango-transmission-web/configmgmt/common/CifMtsoList.do');
    	 });

    	//엑셀다운
//    	 $('#btnExportExcel').on('click', function(e) {
//       		//tango transmission biz 모듈을 호출하여야한다.
//
//       		 var param =  $("#searchForm").getData();
//       		 param = gridExcelColumn(param, gridId);
//       		 param.pageNo = 1;
//       		 param.rowPerPage = 10;
//       		 param.firstRowIndex = 1;
//       		 param.lastRowIndex = 1000000000;
//       		 if ($("#mtsoTypCdList").val() != "" && $("#mtsoTypCdList").val() != null ){
//       			param.mtsoTypCdList = $("#mtsoTypCdList").val();
//       		 }else{
//       			param.mtsoTypCdList = [];
//       		 }
//
//       		 param.fileName = configMsgArray['mobileTelephoneSwitchingMgmt']; /* 국사관리 */
//       		 param.fileExtension = "xlsx";
//       		 param.excelPageDown = "N";
//       		 param.excelUpload = "N";
//       		 if($("input:checkbox[id='mtsoChk']").is(":checked")) {
//       			 param.method = "getMtsoMgmtRepChkList";
//       		 }
//       		 else {
//       			param.method = "getMtsoMgmtList";
//       		 }
//
//       		 $('#'+gridId).alopexGrid('showProgress');
//    	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/common/excelcreate', param, 'POST', 'excelDownload');
//         });

    	 $('#btnExportExcelOnDemand').on('click', function(e){
	            btnExportExcelOnDemandClickEventHandler(e);
	        });

    	//첫번째 row를 클릭했을때 이벤트 발생
    	 $('#'+gridId).on('click', '.bodycell', function(e){
    		 var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;

      	 	var netDiv = $("#netDiv").getValue();
      	 	dataObj.netDiv = netDiv;

      	 	$('#'+gridIdDistance).alopexGrid('showProgress');
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoDistance', dataObj, 'GET', 'searchDistance');

    	 });

//    	 $('.Radio').on('click', function(e){
//    		var selectData = $('#'+gridId).alopexGrid('dataGet', {_state: {selected: true}})[0];
// 			if(selectData != undefined) {
// 				var netDiv = $("#netDiv").getValue();
// 				selectData.netDiv = netDiv;
//
// 	      	 	$('#'+gridIdDistance).alopexGrid('showProgress');
// 	    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/common/cifMtsoDistance', selectData, 'GET', 'searchDistance');
// 			}else{
// 				alertBox('W', "검색 할 대상 국사를 선택해주세요");
// 			}
//    	 });

    	//첫번째 row를 더블클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = null;
      	 	dataObj = AlopexGrid.parseEvent(e).data;
      	 	dataObj.regYn = "Y";
      	 	if(dataObj.ukeyMtsoId == "수동등록"){
      	 		dataObj.ukeyMtsoId = "";
      	 	}
      	 	dataObj.aprvRlesVal = $('#aprvRlesVal').val();
      	 	/* 국사 상세정보 */
      	 	/****************************************************************************
        	*	New Popup Start
        	*****************************************************************************/
      	 	var mtsoGubun = "mtso";

      	 	//2023 통합국사 고도화 추가 - 통합국사 선택시 통합국 탭으로 이동시키기 위해서
      	 	var linkTab = ($("input:checkbox[id='intgMtsoChk']").is(":checked")) ? "tab_IntgMtso" : "tab_Mtso";
      	 	//국사상세 페이지에 통합국사 탭의 활성화를 위해서
      	 	if(dataObj.intgMtsoId != undefined){
      	 		if(dataObj.mgmtGrpCd == "0001" //SKT only
      	 			&& dataObj.mtsoTypCd == "2" //중심국사
      	 				&& dataObj.intgMtsoId != "" //통합국사ID가 존재하는
      	 		){
      	 			mtsoGubun = "intgmtso";
      	 		}
      	 	}

        	var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
        	var paramData = {
        					mtsoEqpGubun :mtsoGubun,
        					mtsoEqpId : dataObj.mtsoId,
        					parentWinYn : 'Y',
        					/*2023 통합국사 고도화 추가 필드*/
        					intgMtsoId : dataObj.intgMtsoId,	//통합국사ID
        					mtsoTypCd : dataObj.mtsoTypCd,		//국사유형
        					linkTab : linkTab					//국사상세 탭선택 옵션
        					};

//        	console.log("paramData : ", paramData);
    		var popMtsoEqp = $a.popup({
    			popid: tmpPopId,
    			title: '통합 국사/장비 정보',
    			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
    			data: paramData,
    			iframe: false,
    			modal: false,
    			movable:false,
    			windowpopup: true,
    			width : 1300,
    			height : window.innerHeight * 0.83
    		});
    		//setTimeout(window.close(), 7000);
    		/****************************************************************************
        	*	New Popup End
        	*****************************************************************************/
    	 });

    	 //건물지도 클릭시 팝업
    	 $('#'+gridId).on('click', '#btnBuildingMap', function(e){

    		 if(gisMap == null || gisMap.opener == null){
    			 gisMap = window.open('/tango-transmission-gis-web/tgis/Main.do');
    		 }else{
    			 gisMap.focus();
    			 gisMap.$('body').progress();
    		 }

    		var dataObj = AlopexGrid.parseEvent(e).data;
    		//GIS 국사관리번호 조회 지도에 표시
     		dataObj.moveMap = true;//지도이동 안하겠다.

     		setTimeout(function(){
     			gisM(dataObj);
			}, 5000);

 		});


    	$('#mtsoChk').on('change', function(e) {

//    		if($('#mtsoChk').is(':checked')){
//	     		$('#'+gridId).alopexGrid('showCol',['shrRepFcltsCd','shrRepFcltsNm']);
//	     	}else{
//	     		$('#'+gridId).alopexGrid('hideCol',['shrRepFcltsCd','shrRepFcltsNm'], 'conceal');
//	     	}
    		initGrid();
    	});

    	//2023 고도화 phase2 추가
    	//통합국등록
    	$('#btnIntgMtsoReg').on('click', function(e) {
    		IntgMtsoReg();
        });

	};

	this.CifMtsoDtlRuList = function(bmtsoCuidVal){
		var param = {bmtsoCuidVal: bmtsoCuidVal};
		 $a.popup({
			  	popid: 'CifMtsoDtlRuList',
			  	title: '국사 상세 RU 리스트',
			      url: '/tango-transmission-web/configmgmt/common/CifMtsoRu.do',
			      data: param,
			      windowpopup : true,
			      modal: true,
			      movable:true,
			      width : 1220,
			      height : 520,
			      callback: function(data){
			      }
			  });
	}

	function gisM(dataObj){
		gisMap.$('body').progress();
		httpRequest('tango-transmission-biz/transmisson/trafficintg/topology/getGisMtsoInf', dataObj, 'GET', 'searchGisMtsoInf');
	}

	function MtsoReg(){
		var param = {"regYn" : "N", "intgFcltsCd" : ""};
//		 popup2('MtsoReg', $('#ctx').val()+'/configmgmt/common/MtsoReg.do', configMsgArray['mobileTelephoneSwitchingOfficeReg'], param);
		 $a.popup({
			  	popid: 'NewMtsoReg',
			  	title: configMsgArray['mobileTelephoneSwitchingOfficeReg'],
			      url: '/tango-transmission-web/configmgmt/common/MtsoRegPop.do',
			      data: param,
			      windowpopup : true,
			      modal: true,
			      movable:true,
			      width : 865,
			      height : 845
			  });
	}

	function MtsoFromOtherReg(param){
		 var param = {"regYn" : "N", "intgFcltsCd" : param.intgFcltsCd};
		 $a.popup({
			  	popid: 'OtherMtsoReg',
			  	title: configMsgArray['mobileTelephoneSwitchingOfficeReg'],
			      url: '/tango-transmission-web/configmgmt/common/MtsoRegPop.do',
			      data: param,
			      windowpopup : true,
			      modal: true,
			      movable:true,
			      width : 865,
			      height : 830
			  });
	}

	//2023 고도화 phase2 추가
	//통합국사등록
	function IntgMtsoReg(){
		var param = {"regYn" : "N", "intgFcltsCd" : ""};
//		 popup2('MtsoReg', $('#ctx').val()+'/configmgmt/common/MtsoReg.do', configMsgArray['mobileTelephoneSwitchingOfficeReg'], param);
		 $a.popup({
			  	popid: 'IntgMtsoReg',
			  	title: configMsgArray['intgMtsoReg'],
			      url: '/tango-transmission-web/configmgmt/common/IntgMtsoRegPop.do',
			      data: param,
			      windowpopup : true,
			      modal: true,
			      movable:true,
			      width : 950,
			      height : 897
			  });
	}

	/*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){

	        var param =  $("#searchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;
	   		param.inUserId = $('#sessionUserId').val();
	   		if ($("#mtsoTypCdList").val() != "" && $("#mtsoTypCdList").val() != null ){
       			param.mtsoTypCdList = $("#mtsoTypCdList").val() ;
       		 }else{
       			param.mtsoTypCdList = [];
       		 }

	   		if ($("#mtsoCntrTypCdList").val() != "" && $("#mtsoCntrTypCdList").val() != null ){
       			param.mtsoCntrTypCdList = $("#mtsoCntrTypCdList").val() ;
       		 }else{
       			param.mtsoCntrTypCdList = [];
       		 }

	   		if ($("#tmofList").val() != "" && $("#tmofList").val() != null ){
       			param.tmofList = $("#tmofList").val() ;
       		 }else{
       			param.tmofList = [];
       		 }

	   		 var bldChk = "" ;
	       	 if ($("input:checkbox[id='bldChk']").is(":checked") ){
	       		bldChk = "Y";
	       	 }

	       	 param.bldChk = bldChk;

	       	 var mtsoChk = "" ;
        	 if ($("input:checkbox[id='mtsoChk']").is(":checked") ){
        		 mtsoChk = "Y";
        	 }
        	 param.mtsoChk = mtsoChk;

        	 //2023 통합국사 고도화 - 통합국사 조회조건 추가
        	 var intgMtsoChk = "";
        	 var mtsoChk = "" ;
        	 if ($("input:checkbox[id='intgMtsoChk']").is(":checked") ){
        		 intgMtsoChk = "Y";
        	 }
        	 param.intgMtsoChk = intgMtsoChk;



        	 param.teamId = "";
        	 param.opTeamOrgId = "";
        	 param.opPostOrgId = "";
        	 param.mtsoDetlTypCd = "";

    		if ($("#teamIdList").val() != "" && $("#teamIdList").val() != null ){
       			param.teamIdList = $("#teamIdList").val() ;
       		 }else{
       			param.teamIdList = [];
       		 }


    		if ($("#opTeamOrgIdList").val() != "" && $("#opTeamOrgIdList").val() != null ){
       			param.opTeamOrgIdList = $("#opTeamOrgIdList").val() ;
       		 }else{
       			param.opTeamOrgIdList = [];
       		 }
    		if ($("#opPostOrgIdList").val() != "" && $("#opPostOrgIdList").val() != null ){
       			param.opPostOrgIdList = $("#opPostOrgIdList").val() ;
       		 }else{
       			param.opPostOrgIdList = [];
       		 }
    		if ($("#mtsoDetlTypCdList").val() != "" && $("#mtsoDetlTypCdList").val() != null ){
       			param.mtsoDetlTypCdList = $("#mtsoDetlTypCdList").val() ;
       		 }else{
       			param.mtsoDetlTypCdList = [];
       		 }

	   		/* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds());
	        var excelFileNm = 'Mobile_Telecom_Switching_Office_Information_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
      		 if($("input:checkbox[id='mtsoChk']").is(":checked")) {
      			param.excelMethod = "getMtsoMgmtRepChkList";
       		 } else if($("input:checkbox[id='intgMtsoChk']").is(":checked")) {
      			param.excelMethod = "getIntgMtsoMgmtList";
       		 } else {
       			param.excelMethod = "getMtsoMgmtList";
       		 }
	   		param.excelFlag = "MtsoList";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
  		 	$('#'+gridId).alopexGrid('showProgress');
  		 	console.log("Excel param : ", param);
  		    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	    }

	function gridExcelColumn(param, gridId) {
		var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false});

		//console.log(gridHeader);
		var excelHeaderCd = "";
		var excelHeaderNm = "";
		var excelHeaderAlign = "";
		var excelHeaderWidth = "";
		for(var i=0; i<gridHeader.length; i++) {
			if((gridHeader[i].key != undefined && gridHeader[i].key != "id")) {
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ";";
				excelHeaderNm += gridHeader[i].title;
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
		//param.excelHeaderInfo = gridColmnInfo;
		return param;
	}

	function successCallback(response, status, jqxhr, flag){
		//ON-DEMANT엑셀다운로드
		if(flag == "excelDownloadOnDemand"){
			$('#'+gridId).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }
    	//관리그룹
    	if(flag == 'mgmtGrpNm'){

    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }

    		$('#mgmtGrpNm').clear();

    		var selectId = null;
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var resObj = response[i];
					if(resObj.comCdNm == chrrOrgGrpCd) {
						selectId = resObj.comCdNm;
						break;
					}
				}
				$('#mgmtGrpNm').setData({
					data:response ,
					mgmtGrpNm:selectId
				});
			}

			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');	// 본부

			var option_data =  null;
			if($('#mgmtGrpNm').val() == "SKT"){
				option_data =  [{comCd: "1",comCdNm: "전송실"}, {comCd: "2",comCdNm: "중심국사"}, {comCd: "3",comCdNm: "기지국사"}, {comCd: "4",comCdNm: "국소"}];
			}else{
				option_data =  [{comCd: "1",comCdNm: "정보센터"}, {comCd: "2",comCdNm: "국사"}, {comCd: "4",comCdNm: "국소"}];
			}
			$('#mtsoTypCdList').setData({data:option_data});
    	}

    	//본부 초기
		if(flag == 'fstOrg'){
			var chrrOrgGrpCd;
			if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}

			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){ sUprOrgId = $("#sUprOrgId").val();}

			$('#orgId').clear();

	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

	   		var selectId = null;
	   		if(response.length > 0){
	    		for(var i=0; i<response.length; i++){
	    			var resObj = response[i];
	    			option_data.push(resObj);
	    		}
	    		$('#orgId').setData({ data:option_data , orgId:sUprOrgId });
	   		}
	   		var orgId = $('#orgId').val();
	   		if (orgId == '') {
	   			var mgmtGrpNm = $("#mgmtGrpNm").val();
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'fstTeam');
	   		 } else {
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgId, null, 'GET', 'fstTeam');
	   		 }
	   	}
		// 팀 초기
		if(flag == 'fstTeam'){
    		var chrrOrgGrpCd;
    		if($("#mgmtGrpNm").val() == "" || $("#mgmtGrpNm").val() == null){
				if($("#chrrOrgGrpCd").val() == ""){
					chrrOrgGrpCd = "SKT";
				}else{
					chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				}
			}else{
				chrrOrgGrpCd = $("#mgmtGrpNm").val();
			}

    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamIdList').clear();
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
  	    		$('#teamIdList').setData({ data:option_data});

  	    		var mgmtGrpNm = $("#mgmtGrpNm").val();
  	    		var orgId = $('#orgId').val();
  	    		var teamIdList = $('#teamIdList').val();
  	     	 	if (orgId == '' && (teamIdList == '' || teamIdList == null)){
  	     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
  	     	 	} else if (orgId != '' && (teamIdList == '' || teamIdList == null)){
  	     	 		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgId+'/ALL', null,'GET', 'tmof');
  	    		} else {
  	    			$('#pageNo').val(1);
  	    			$('#rowPerPage').val(1);
  	    			var param =  $("#searchForm").serialize();
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/multiTeamTmofList', param,'GET', 'multiTmof');
  	    		}
      		}
    	}

    	// 전송실
    	if(flag == 'tmof'){
    		$('#tmofList').clear();

    		var option_data = [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#tmofList').setData({ data:option_data });
    	}
    	// 전송실-팀다중선택시
    	if(flag == 'multiTmof'){
    		$('#tmofList').clear();
    		var option_data = [];
    		for(var i=0; i<response.teamTmofList.length; i++){
    			var resObj = response.teamTmofList[i];
    			option_data.push(resObj);
    		}
    		$('#tmofList').setData({ data:option_data });
    	}

    	//국사유형 콤보 박스
    	if(flag == 'mtsoTyp'){
    		$('#mtsoTypCdList').clear();
    		var option_data =  [];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#mtsoTypCdList').setData({data:option_data});
    	}


    	//국사상태 콤보 박스
    	if(flag == 'mtsoStat'){
    		$('#mtsoStatCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#mtsoStatCd').setData({data:option_data,mtsoStatCd:"01"});
    	}

    	//국사세부유형 콤보 박스
    	if(flag == 'mtsoDetlTyp'){
    		$('#mtsoDetlTypCdList').clear();
    		var option_data =  [];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#mtsoDetlTypCdList').setData({ data:option_data });
    	}

//    	if(flag == 'mtsoCntrTypCdList') {
//    		$('#mtsoCntrTypCdList').clear();
//    		var option_data =  [];
//			for(var i=0; i<response.length; i++){
//				var resObj = response[i];
//				option_data.push(resObj);
//			}
//			$('#mtsoCntrTypCdList').setData({ data:option_data });
//    	}

    	if(flag == 'opTeam'){
    		$('#opTeamOrgIdList').clear();
    		var option_data =  [];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#opTeamOrgIdList').setData({ data:option_data });
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/D', null, 'GET', 'opPost');		// 운용 Post 전체
    	}

    	if(flag == 'opPost'){
    		$('#opPostOrgIdList').clear();
    		var option_data =  [];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#opPostOrgIdList').setData({ data:option_data });
    	}
    	if(flag == 'multiOpTeamPost'){
    		$('#opPostOrgIdList').clear();
    		var option_data =  [];
    		for(var i=0; i<response.opTeamPostList.length; i++){
    			var resObj = response.opTeamPostList[i];
    			option_data.push(resObj);
    		}
    		$('#opPostOrgIdList').setData({ data:option_data });
    	}
    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		 if($("input:checkbox[id='mtsoChk']").is(":checked")) {
    			 setSPGrid(gridId,response, response.mtsoMgmtRepChkList);
	 		 }
	 		 else {
	 			 var resultList = response.mtsoMgmtList;
	 			 var resultCnt = response.mtsoMgmtList.length;
//	 			 console.log('search result : ', JSON.stringify(resultList[resultCnt-1]));
	 			setSPGrid(gridId,response, response.mtsoMgmtList);
	 		 }

    		var aprvRlesVal = $('#aprvRlesVal').val();
//        	console.log(aprvRlesVal);
        	if (aprvRlesVal == "01") {
        		$('#'+gridId).alopexGrid("showCol", 'cifTakeAprvStatNm');
    			$('#'+gridId).alopexGrid("hideCol", 'cifTakeRlesStatNm', 'conceal');
        	} else if (aprvRlesVal == "02") {
        		$('#'+gridId).alopexGrid("hideCol", 'cifTakeAprvStatNm', 'conceal');
    			$('#'+gridId).alopexGrid("showCol", 'cifTakeRlesStatNm');
        	} else {
    			$('#'+gridId).alopexGrid("hideCol", 'cifTakeAprvStatNm', 'conceal');
    			$('#'+gridId).alopexGrid("hideCol", 'cifTakeRlesStatNm', 'conceal');
        	}
    	}

    	if(flag == 'searchDistance'){
    		$('#'+gridIdDistance).alopexGrid('hideProgress');
    		$('#'+gridIdDistance).alopexGrid('dataSet', response.mtsoDistanceList);
    	}

    	/*...........................*
        국사관리번호 받아서 지도에 표시
		 *...........................*/
		if(flag =='searchGisMtsoInf'){
			//레이어초기화

			mgMap = gisMap.window.mgMap;
			L = gisMap.window.L;

			var mtsoInfLayer = mgMap.addCustomLayerByName('MTSO_INF_LAYER');//국사표시를 위한 레이어
			mtsoInfLayer.closePopup();
	        mtsoInfLayer.clearLayers();

	        //GIS국사정보
			var gisMtsoInf = null; gisMtsoInf = response.gisMtsoInf;

	       //팝업할 국사정보 세팅
			    var html =
		            '<b>국 사 명&nbsp;:</b><%pop_mtsoNm%><br>'+
		            '<b>시설코드:</b><%pop_mtsoMgmtNo%><br>'+
		            '<b>국사번호:</b><%pop_mtsoId%><br>' +
		            '<b>국사유형:</b><%pop_mtsoTyp%><br>'+
		            '<b>국사상태:</b><%pop_mtsoStat%><br>'+
		            '<b>건물주소:</b><%pop_bldAddr%>';

	        html = html.replace('<%pop_mtsoNm%>',response.mtsoNm);
	        html = html.replace('<%pop_mtsoId%>',response.mtsoId);
	        html = html.replace('<%pop_mtsoTyp%>',response.mtsoTyp);
	        html = html.replace('<%pop_mtsoStat%>',response.mtsoStat);
	        html = html.replace('<%pop_bldAddr%>',response.bldAddr);

			//GIS 국사정보가 없을 경우
			if (gisMtsoInf == null || gisMtsoInf == "") {
					//구성팀 국사 위경도 있으면
				    if (response.mtsoLatVal != null && response.mtsoLatVal != "" &&
				    	response.mtsoLngVal != null && response.mtsoLngVal != ""	)
				    {
				    	//GIS 국사관리번호가 없습니다. 국사의 위경도 위치를 표시합니다.
		 				callMsgBox('','W', configMsgArray['noGisMtsoMgmtNo'] , function(msgId, msgRst){});
				    	if(response.moveMap){
				    		//해당 좌표로 이동
				    		gisMap.window.mgMap.setView([response.mtsoLatVal, response.mtsoLngVal], 13);
		 	 			    //반경거리 표시해주고
		 			        if (circleRange != 0){
		 			        	var distance_circle_layer = window.distanceCircleLayer;
		 	 			        distance_circle_layer.clearLayers();
		 					    var distance_circle = L.circle([response.mtsoLatVal, response.mtsoLngVal], parseInt(circleRange));
		 					    distance_circle_layer.addLayer(distance_circle);
		 			        }
				    	}

		 			    //국사포인트 표시하고 정보팝업
				        var marker = L.marker([response.mtsoLatVal, response.mtsoLngVal]);
				        mtsoInfLayer.addLayer(marker);
				        html = html.replace('<%pop_mtsoMgmtNo%>','**********');
				        marker.bindPopup(html).openPopup();

				    //GIS국사정보도 구성팀 국사 위경도도 없으면
				    }else{
				    	//국사의 위도,경도 정보가 없습니다.
				    	callMsgBox('','W', configMsgArray['noMtsoLatLng'] , function(msgId, msgRst){});
				    }
				//GIS국사정보가 있으면
				}else{
				     var latlng = L.MG.Util.wktToGeometry(gisMtsoInf.geoWkt).getLatLng();//국사 위치정보
				     if(response.moveMap){//지도이동여부 예 이면
				    	//해당 좌표로 이동
				    	 gisMap.window.mgMap.setView([latlng.lat, latlng.lng], 13);
		 			    //반경거리 표시해주고
				        if (circleRange != 0){
				        	var distance_circle_layer = gisMap.window.distanceCircleLayer;
		 			        distance_circle_layer.clearLayers();
						    var distance_circle = L.circle([latlng.lat, latlng.lng], parseInt(circleRange));
						    distance_circle_layer.addLayer(distance_circle);
				        }
				   }
				    //국사포인트 표시하고 정보팝업
		        var marker = L.marker([latlng.lat, latlng.lng]);
		        mtsoInfLayer.addLayer(marker);
		        html = html.replace('<%pop_mtsoMgmtNo%>',gisMtsoInf.mtsoMgmtNo);
		        marker.bindPopup(html).openPopup();
				}
		}

    	if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
//            console.log('excelDownload', response);

            var $form=$('<form></form>');
            $form.attr('name','downloadForm');
            $form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/commoncode/exceldownload");
            $form.attr('method','GET');
            $form.attr('target','downloadIframe');
            // 2016-11-인증관련 추가 file 다운로드시 추가필요
			$form.append(Tango.getFormRemote());
            $form.append('<input type="hidden" name="subPath" value="'+response.subPath+'" /><input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
            $form.appendTo('body');
            $form.submit().remove();

        }

    	if(flag == 'gisInstlLocCd'){
    		$('#instlLocCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#instlLocCd').setData({
                 data:option_data
    		});
    	}


	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }



    function nullToEmpty(str) {
        if (str == null || str == "null" || typeof str === "undefined") {
        	str = "";
        }
    	return str;
    }

    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	$('#'+gridIdDistance).alopexGrid('dataEmpty');

    	 var param =  $("#searchForm").serialize();

 		 $.each($('form input[type=checkbox]')
        		.filter(function(idx){
        			return $(this).prop('checked') === false
        		}),
        		function(idx, el){
        	var emptyVal = "";
        	param += '&' + $(el).attr('name') + '=' + emptyVal;
	   	 });

 		 $('#'+gridId).alopexGrid('showProgress');
 		 if($("input:checkbox[id='mtsoChk']").is(":checked")) {
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsosRepChk', param, 'GET', 'search');
 		 }
 		 else {
 			httpRequest('tango-transmission-biz/transmisson/configmgmt/common/mtsos', param, 'GET', 'search');
 		 }
    }

    function popup(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9

              });
        }



    function popup2(pidData, urlData, titleData, paramData) {

    	$a.popup({
				  	popid: pidData,
				  	title: titleData,
				      url: urlData,
				      data: paramData,
				      iframe: false,
				      modal: true,
				      movable:true,
				      width : 865,
				      height : window.innerHeight * 0.8
				  });
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

    /*
    var httpRequest = function(Url, Param, Method, Flag ) {
    	var grid = Tango.ajax.init({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		flag : Flag
    	})

    	switch(Method){
		case 'GET' : grid.get().done(successCallback).fail(failCallback);
			break;
		case 'POST' : grid.post().done(successCallback).fail(failCallback);
			break;
		case 'PUT' : grid.put().done(successCallback).fail(failCallback);
			break;

		}
    }
    */
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    this.aa = function(page, rowPerPage){
    	alert("chrrOrgGrpCd="+$("#chrrOrgGrpCd").val()+", UprOrgId="+$("#sUprOrgId").val()+", OrgId="+$("#sOrgId").val()+", chrrOrgId="+$("#chrrOrgId").val()+", "+$("#userInfo").val());
    }
});
