/**
 * MtsoList.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {

	var gridId = 'dataGrid';
	var paramData = null;

	var intgMtsoYn = 'N';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {

    	if(param.intgMtsoYn == "Y"){
    		paramData = param;
    		intgMtsoYn = 'Y'
    	}

    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();

    };

    function setRegDataSet(data) {

    }

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [{
    			/* 순번 			 */
    			align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true
			}, {/* 국사명			 */
				key : 'mtsoNm', align:'center',
				title : '국사명',
				width: '140px'
			}, {/* 국사유형			 */
				key : 'mtsoTypNm', align:'center',
				title : '국사유형',
				width: '140px'
			}, {/* 본부			 */
				key : 'plntDesc', align:'center',
				title : configMsgArray['hdofc'],
				width: '140px'
			}, {/* 통합시설코드        */
				key : 'intgFcltsCd', align:'center',
				title : configMsgArray['integrationFacilitiesCode'],
				width: '100px'
			}, {/* 숨김데이터 */
				key : 'intgFcltsDivCd', align:'center',
				title : '통합시설구분코드',
				width: '100px'
			}, {/* 통합시설명		 */
				key : 'erpIntgFcltsNm', align:'left',
				title : configMsgArray['integrationFacilitiesName'],
				width: '220px'
			}, {/* 활용구분      	 */
				key : 'praDivNm', align:'center',
				title : configMsgArray['practicalDivision'],
				width: '100px'
			}, {/* 장비타입     	 */
				key : 'erpEqpTypNm', align:'center',
				title : configMsgArray['equipmentType'],
				width: '160px'
			}, {/* 전송로수		 */
				key : 'tmlnCnt', align:'center',
				title : configMsgArray['transmissionLineCount'],
				width: '70px'
			}, {/* 기지국CUID	 */
				key : 'bmtsoCuidVal', align:'center',
				title : configMsgArray['baseMtsoCuid'],
				width: '100px'
			}, {/* 세부사업구분	 */
				key : 'detlBizDivNm', align:'center',
				title : configMsgArray['detailBusinessDivision'],
				width: '100px'
			}, {/* ERPMSCID   	 */
				key : 'erpMscId', align:'center',
				title : configMsgArray['enterpriseResourcePlanningMobileSwitchingCenterIdentification'],
				width: '100px'
			}, {/* BSCID      	 */
				key : 'bscId', align:'center',
				title : configMsgArray['basestationControllerIdentification'],
				width: '100px'
			},{/* BTSID     	 */
				key : 'btsId', align:'center',
				title : configMsgArray['baseTransceiverStationIdentification'],
				width: '100px'
			},{/* 우편번호		 */
				key : 'zpCd', align:'center',
				title : configMsgArray['zipcode'],
				width: '100px'
			},{/* 계획지역명		 */
				key : 'planAreaNm', align:'center',
				title : configMsgArray['planAreaName'],
				width: '100px'
			},{/* 시군구주소		 */
				key : 'sggAddr', align:'center',
				title : configMsgArray['siGunGuAddress'],
				width: '100px'
			},{/* 읍면동주소   	 */
				key : 'emdAddr', align:'center',
				title : configMsgArray['eupMyeonDongAddress'],
				width: '110px'
			},{/* 전체주소1 		 */
				key : 'allAddr1', align:'left',
				title : configMsgArray['allAddress']+'1',
				width: '200px'
			},{/* 번지주소		 */
				key : 'bunjiAddr', align:'left',
				title : configMsgArray['bunjiAddress'],
				width: '250px'
			},{/* 건물주소		 */
				key : 'bldAddr', align:'left',
				title : configMsgArray['buildingAddress'],
				width: '170px'
			},{/* 상세주소            */
				key : 'dtlAddr', align:'left',
				title : configMsgArray['detailAddress'],
				width: '250px'
			},{/* 설치층수		 */
				key : 'instlFlorCnt', align:'center',
				title :  configMsgArray['installFloorCount'],
				width: '100px'
			},{/* 시설총층수		 */
				key : 'fcltsTotFlorCnt', align:'center',
				title : configMsgArray['facilitiesTotalFloorCount'],
				width: '100px'
			},{/* 서비스층수   	 */
				key : 'srvcFlorCnt', align:'center',
				title : configMsgArray['serviceFloorCount'],
				width: '100px'
			},{/* 위도도		 */
				key : 'lttagVal', align:'center',
				title : configMsgArray['latitudeAngle'],
				width: '70px'
			},{/* 위도분		 */
				key : 'lttmnVal', align:'center',
				title : configMsgArray['latitudeMinute'],
				width: '70px'
			},{/* 위도초		 */
				key : 'lttscVal', align:'center',
				title : configMsgArray['latitudeSecond'],
				width: '70px'
			},{/* 위도시		 */
				key : 'ltthrVal', align:'center',
				title : configMsgArray['latitudeHour'],
				width: '70px'
			},{/* 통합시설위도값     */
				key : 'intgFcltsLatVal', align:'center',
				title : configMsgArray['integrationFacilitiesLatitudeValue'],
				width: '120px'
			},{/* 경도도		 */
				key : 'ltdagVal', align:'center',
				title : configMsgArray['longitudeAngle'],
				width: '70px'
			},{/* 경도분		 */
				key : 'ltdmnVal', align:'center',
				title : configMsgArray['longitudeMinute'],
				width: '70px'
			},{/* 경도초		 */
				key : 'ltdscVal', align:'center',
				title : configMsgArray['longitudeSecond'],
				width: '70px'
			},{/* 경도시		 */
				key : 'ltdhrVal', align:'center',
				title : configMsgArray['longitudeHou'],
				width: '70px'
			},{/* 통합시설경도값	 */
				key : 'intgFcltsLngVal', align:'center',
				title : configMsgArray['integrationFacilitiesLongitudeValue'],
				width: '120px'

			},{/* 비용센터설명	 */
				key : 'cstCntrDesc', align:'center',
				title : configMsgArray['costCenterDescription'],
				width: '120px'
			},{/* 파트         	 */
				key : 'ptNm', align:'center',
				title : configMsgArray['pt'],
				width: '230px'
			},{/* 공용대표구분명	 */
				key : 'shrRepDivNm', align:'center',
				title : configMsgArray['shareRepresentationDivisionName'],
				width: '125px'
			},{/* 공용대표구분코드   */
				key : 'shrRepDivCd', align:'center',
				title : configMsgArray['shareRepresentationDivisionCode'],
				width: '125px'
			},{/* 공용대표시설코드   */
				key : 'shrRepFcltsCd', align:'center',
				title : '공용대표시설코드',
				width: '125px'
			},{/* 모기지국코드   */
				key : 'prntBmtsoCd', align:'center',
				title : '모기지국코드',
				width: '125px'
			},{/* 공급사		 */
				key : 'prvdNm', align:'center',
				title : configMsgArray['provider'],
				width: '70px'
			}, {/* 제조사		 */
				key : 'vendNm', align:'center',
				title : configMsgArray['vend'],
				width: '70px'
			}, {/* 공사방식명		 */
				key : 'cstrMeansNm', align:'center',
				title : configMsgArray['constructionMeansName'],
				width: '100px'
			}, {/* 장비구분     	 */
				key : 'eqpDivNm', align:'center',
				title : configMsgArray['equipmentDivision'],
				width: '70px'
			}, {/* 교환실		 */
				key : 'exrmNm', align:'center',
				title : configMsgArray['exchangeRoom'],
				width: '70px'
			}, {/* 시설구분값		 */
				key : 'fcltsDivVal', align:'center',
				title : configMsgArray['facilitiesDivisionValue'],
				width: '100px'
			}, {/* 시설구분명		 */
				key : 'fcltsDivNm', align:'center',
				title : configMsgArray['facilitiesDivisionName'],
				width: '100px'
			}, {/* 국사형태명          */
				key : 'mtsoFrmNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeFormName'],
				width: '100px'
			},{/* 한전고객번호     	 */
				key : 'kepcoCustNo', align:'center',
				title : configMsgArray['koreaElectricPowerCorporationCustomerNumber'],
				width: '110px'
			}, {/* 전송기지국구분명    */
				key : 'trmsBmtsoDivNm', align:'center',
				title : configMsgArray['transmissionBaseMtsoDivisionName'],
				width: '120px'
			}, {/*통합시설서비스시작일자*/
				key : 'intgFcltsSrvcStaDt', align:'center',
				title : configMsgArray['integrationFacilitiesServiceStartDate'],
				width: '150px'
			}, {/*통합시설서비스종료일자*/
				key : 'intgFcltsSrvcEndDt', align:'center',
				title : configMsgArray['integrationFacilitiesServiceEndDate'],
				width: '150px'
			}, {/* 도로명      	 */
				key : 'stNm', align:'center',
				title : configMsgArray['streetName'],
				width: '100px'
			}, {/* 지하여부		 */
				key : 'bsmtYn', align:'center',
				title : configMsgArray['basementYesOrNo'],
				width: '70px'
			}, {/* 메인건물번호  	 */
				key : 'mainBldNo', align:'center',
				title : configMsgArray['mainBuildingNumber'],
				width: '110px'
			},{/* 서브건물번호	 */
				key : 'subBldNo', align:'center',
				title : configMsgArray['subordinationBuildingNumber'],
				width: '110px'
			},{/* 건물명		 */
				key : 'bldNm', align:'center',
				title : configMsgArray['buildingName'],
				width: '150px'
			},{/* 건물동		 */
				key : 'bldblkNm', align:'center',
				title : configMsgArray['buildingBlock'],
				width: '70px'
			},{/* 건물호		 */
				key : 'bldCallVal', align:'center',
				title : configMsgArray['buildingUnit'],
				width: '70px'
			},{/* 건물층		 */
				key : 'bldFlorVal', align:'center',
				title : configMsgArray['buildingFloor'],
				width: '70px'
			},{/* 법정동		 */
				key : 'ldongNm', align:'center',
				title : configMsgArray['legalDong'],
				width: '70px'
			},{/* 법정리		 */
				key : 'lriNm', align:'center',
				title : configMsgArray['legalRi'],
				width: '70px'
			},{/* 도로명주소 1 	 */
				key : 'stNmAddr1', align:'left',
				title : configMsgArray['streetNameAddress']+'1',
				width: '200px'
			},{/* 도로명주소 2 	 */
				key : 'stNmAddr2', align:'left',
				title : configMsgArray['streetNameAddress']+'2',
				width: '250px'

			},{/* 생성일자            */
				key : 'creDt', align:'center',
				title : configMsgArray['createDate'],
				width: '70px'
			},{/* 변경일자		 */
				key : 'chgDt', align:'center',
				title : configMsgArray['changeDate'],
				width: '70px'
			},{/* 판매일자       	 */
				key : 'saleDt', align:'center',
				title : configMsgArray['saleDate'],
				width: '70px'
			}, {/* 전기비용내역번호    */
				key : 'elctyCstDtsNo', align:'center',
				title : configMsgArray['electricityCostDetailsNumber'],
				width: '150px'
			}, {/* 전기시설수전전압값  */
				key : 'elctyFcltsRcvgVoltVal', align:'center',
				title : configMsgArray['electricityFacilitiesReceivingVoltageValue'],
				width: '150px'
			}, {/* 전기시설계량기번호  */
				key : 'elctyFcltsGageNo', align:'center',
				title : configMsgArray['electricityFacilitiesGaugeNumber'],
				width: '150px'
			}, {/*전기시설전기비용내역번호*/
				key : 'elctyFcltsElctyCstDtsNo', align:'center',
				title : configMsgArray['electricityFacilitiesElectricityCostDetailsNumber'],
				width: '150px'
			}, {/* 전기시설계약전력량값*/
				key : 'elctyFcltsCtrtWattVal', align:'center',
				title : configMsgArray['electricityFacilitiesContractWattageValue'],
				width: '120px'
			},{/* 기타번지값    	 */
				key : 'etcBunjiVal', align:'center',
				title : configMsgArray['etcBunjiValue'],
				width: '100px'
			}, {/* 투자유형내용 1     */
				key : 'invtTypCtt1', align:'center',
				title : configMsgArray['investTypeContent']+'1',
				width: '110px'
			}, {/* 투자유형내용 2     */
				key : 'invtTypCtt2', align:'center',
				title : configMsgArray['investTypeContent']+'2',
				width: '110px'
			}, {/* 투자유형내용 3     */
				key : 'invtTypCtt3', align:'center',
				title : configMsgArray['investTypeContent']+'3',
				width: '110px'
			}, {/* 투자유형내용 4     */
				key : 'invtTypCtt4', align:'center',
				title : configMsgArray['investTypeContent']+'4',
				width: '110px'
			}],
			message: {/* 데이터가 없습니다.   */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['intgFcltsDivCd'];

    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');

	}

    function setList(param){

    }

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		 var requestParam = { comGrpCd : 'C00623' };
		httpRequest('tango-transmission-biz/transmisson/demandmgmt/common/selectcomcdlist/', requestParam, 'GET', 'org');

		//통합시설구분코드
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C03080', null, 'GET', 'intgFcltsDivCd');

		//세부사업구분 코드
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C02500', null, 'GET', 'detlBizDivCd');



    }


    function setEventListener() {

    	var perPage = 100;

    	// 페이지 번호 클릭시
    	 $('#'+gridId).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+gridId).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	setGrid(1, eObj.perPage);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			setGrid(1,perPage);
       		}
     	 });


    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
//    	 	alert(JSON.stringify(dataObj));
    	 	$a.close({'intgFcltsCd' : dataObj.intgFcltsCd});

    	 });

    	 $('#btnClose').on('click', function(e) {
            	//tango transmission biz 모듈을 호출하여야한다.
       		 $a.close();
            });


    };

	function successCallback(response, status, jqxhr, flag){

		if(flag == 'org'){
			$('#org').clear();
			var option_data =  [{orgId: "", orgNm: configMsgArray['all']}];

			for(var i=0; i<response.length; i++){

				var resObj =  {orgId: response[i].cd, orgNm: response[i].cdNm};
				option_data.push(resObj);
			}

			$('#org').setData({
	             data:option_data
			});
		}

		if(flag == 'detlBizDivCd'){
    		$('#detlBizDivCd').clear();
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['all'], useYn: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			if(resObj.comCd != '000') { //NULL 제외
    				option_data.push(resObj);
    			}
    		}

    		$('#detlBizDivCd').setData({
                 data:option_data
    		});
    	}

    	if(flag == 'intgFcltsDivCd'){
    		$('#intgFcltsDivCd').clear();
    		var option_data =  [];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];

    			if (intgMtsoYn =='Y') {
//    				if(resObj.comCd == '05' || resObj.comCd == '06') {
    				if( resObj.comCd == '06') {
    					option_data.push(resObj);
    				}
    			} else {
    				if(resObj.comCd != '000') { //NULL 제외
        				option_data.push(resObj);
        			}
    			}

    		}

    		$('#intgFcltsDivCd').setData({
                 data:option_data
    		});
    	}

		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response, response.repIntgFcltsCdLkupList);
    	}

	}

	function setSPGrid(GridID,Option,Data) {

		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	 var param =  $("#searchForm").getData();
//    	 param.repIntgFcltsCdLkupCkeck = 'true'


		 $('#'+gridId).alopexGrid('showProgress');
//		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/intgfcltslkup', param, 'GET', 'search');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/equipment/repIntgFcltsCdLkup', param, 'GET', 'search');


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