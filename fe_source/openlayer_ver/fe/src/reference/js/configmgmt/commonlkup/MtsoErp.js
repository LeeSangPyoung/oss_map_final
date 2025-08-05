/**
 * Fclt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var cifTakeAprvStatCd = "";
var cifTakeRlesStatCd = "";
var aprvA = ""; //A망 권한
var aprvT = ""; //T망 권한
var adtnAttrVal = "";
var gridModel = null;
var rowPerPage = 100000;		// 한 페이지당 표기할 데이터 수
var curPage = 1;			// 표기할 현재 페이지 번호

var com = $a.page(function() {

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
	var gridId = 'dataGridErpList';

	var paramData = null;

    this.init = function(id, param) {
    	initGrid();
    	setEventListener();
        paramData = param;

//        var netDiv = $("#netDiv").getValue();
        var mtsoId = paramData.mtsoId;
        var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";
		var tmpParam =  { mtsoId:mtsoId, sameOfficeChk:sameOfficeChk, pageNo : curPage, rowPerPage : rowPerPage};

        // ERP현황
        $('#'+gridId).alopexGrid('showProgress');
        httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/IntgFcltsCdList', tmpParam, 'GET', 'intgFcltsCdList');


//        resizeContents();
    };

    function resizeContents(){
    	var contentHeight = $("#drawDtlLkupArea").height();
    	parent.top.comMain.winReSize(contentHeight);
    }

    function initGrid() {
        var mapping =  [{/* 순번 			 */align:'center',title : configMsgArray['sequence'],width: '50px',numberingColumn: true},
        	{/* 본부			 */ key : 'plntDesc', align:'center',title : configMsgArray['hdofc'],width: '140px'},
        	{/* 통합시설코드        */key : 'intgFcltsCd', align:'center',title : configMsgArray['integrationFacilitiesCode'],width: '100px'	},
        	{/* 숨김데이터 */	key : 'intgFcltsDivCd', align:'center',	title : '통합시설구분코드',	width: '100px'},
        	{/* 통합시설명		 */ key : 'erpIntgFcltsNm', align:'left',title : configMsgArray['integrationFacilitiesName'],width: '220px'	},
        	{/* 활용구분      	 */	key : 'praDivNm', align:'center',title : configMsgArray['practicalDivision'],width: '100px'},
        	{/* 장비타입     	 */	key : 'erpEqpTypNm', align:'center',title : configMsgArray['equipmentType'],width: '160px'},
        	{/* 전송로수		 */key : 'tmlnCnt', align:'center',title : configMsgArray['transmissionLineCount'],width: '70px'},
        	{/* 기지국CUID	 */key : 'bmtsoCuidVal', align:'center',title : configMsgArray['baseMtsoCuid'],width: '100px'},
        	{/* 세부사업구분	 */key : 'detlBizDivNm', align:'center',title : configMsgArray['detailBusinessDivision'],width: '100px'},
        	{/* ERPMSCID   	 */key : 'erpMscId', align:'center',title : configMsgArray['enterpriseResourcePlanningMobileSwitchingCenterIdentification'],width: '100px'},
        	{/* BSCID      	 */key : 'bscId', align:'center',title : configMsgArray['basestationControllerIdentification'],width: '100px'},
        	{/* BTSID     	 */key : 'btsId', align:'center',title : configMsgArray['baseTransceiverStationIdentification'],width: '100px'},
        	{/* 우편번호		 */key : 'zpCd', align:'center',title : configMsgArray['zipcode'],width: '100px'},
        	{/* 계획지역명		 */key : 'planAreaNm', align:'center',title : configMsgArray['planAreaName'],width: '100px'},
        	{/* 시군구주소		 */key : 'sggAddr', align:'center',title : configMsgArray['siGunGuAddress'],width: '100px'},
        	{/* 읍면동주소   	 */key : 'emdAddr', align:'center',title : configMsgArray['eupMyeonDongAddress'],width: '110px'},
        	{/* 전체주소1 		 */key : 'allAddr1', align:'left',title : configMsgArray['allAddress']+'1',width: '200px'},
        	{/* 번지주소		 */key : 'bunjiAddr', align:'left',title : configMsgArray['bunjiAddress'],width: '250px'},
        	{/* 건물주소		 */key : 'bldAddr', align:'left',title : configMsgArray['buildingAddress'],width: '170px'},
        	{/* 상세주소            */key : 'dtlAddr', align:'left',title : configMsgArray['detailAddress'],width: '250px'},
        	{/* 설치층수		 */key : 'instlFlorCnt', align:'center',title :  configMsgArray['installFloorCount'],width: '100px'},
        	{/* 시설총층수		 */key : 'fcltsTotFlorCnt', align:'center',title : configMsgArray['facilitiesTotalFloorCount'],width: '100px'},
        	{/* 서비스층수   	 */key : 'srvcFlorCnt', align:'center',title : configMsgArray['serviceFloorCount'],width: '100px'},
        	{/* 위도도		 */key : 'lttagVal', align:'center',title : configMsgArray['latitudeAngle'],width: '70px'},
        	{/* 위도분		 */key : 'lttmnVal', align:'center',title : configMsgArray['latitudeMinute'],width: '70px'},
        	{/* 위도초		 */key : 'lttscVal', align:'center',title : configMsgArray['latitudeSecond'],width: '70px'},
        	{/* 위도시		 */key : 'ltthrVal', align:'center',title : configMsgArray['latitudeHour'],width: '70px'},
        	{/* 통합시설위도값     */key : 'intgFcltsLatVal', align:'center',title : configMsgArray['integrationFacilitiesLatitudeValue'],width: '120px'},
        	{/* 경도도		 */key : 'ltdagVal', align:'center',title : configMsgArray['longitudeAngle'],width: '70px'},
        	{/* 경도분		 */key : 'ltdmnVal', align:'center',title : configMsgArray['longitudeMinute'],width: '70px'},
        	{/* 경도초		 */key : 'ltdscVal', align:'center',title : configMsgArray['longitudeSecond'],width: '70px'},
        	{/* 경도시		 */key : 'ltdhrVal', align:'center',title : configMsgArray['longitudeHou'],width: '70px'},
        	{/* 통합시설경도값	 */key : 'intgFcltsLngVal', align:'center',title : configMsgArray['integrationFacilitiesLongitudeValue'],width: '120px'},
        	{/* 비용센터설명	 */key : 'cstCntrDesc', align:'center',title : configMsgArray['costCenterDescription'],width: '120px'},
        	{/* 파트         	 */key : 'ptNm', align:'center',title : configMsgArray['pt'],width: '230px'},
        	{/* 공용대표구분명	 */key : 'shrRepDivNm', align:'center',title : configMsgArray['shareRepresentationDivisionName'],width: '125px'},
        	{/* 공용대표구분코드   */key : 'shrRepDivCd', align:'center',title : configMsgArray['shareRepresentationDivisionCode'],width: '125px'},
        	{/* 공용대표시설코드   */key : 'shrRepFcltsCd', align:'center',title : '공용대표시설코드',width: '125px'},
        	{/* 모기지국코드   */key : 'prntBmtsoCd', align:'center',title : '모기지국코드',width: '125px'},
        	{/* 공급사		 */key : 'prvdNm', align:'center',title : configMsgArray['provider'],width: '70px'},
        	{/* 제조사		 */key : 'vendNm', align:'center',title : configMsgArray['vend'],width: '70px'},
        	{/* 공사방식명		 */key : 'cstrMeansNm', align:'center',title : configMsgArray['constructionMeansName'],width: '100px'},
        	{/* 장비구분     	 */key : 'eqpDivNm', align:'center',title : configMsgArray['equipmentDivision'],width: '70px'},
        	{/* 교환실		 */key : 'exrmNm', align:'center',title : configMsgArray['exchangeRoom'],width: '70px'},
        	{/* 시설구분값		 */key : 'fcltsDivVal', align:'center',title : configMsgArray['facilitiesDivisionValue'],width: '100px'},
        	{/* 시설구분명		 */key : 'fcltsDivNm', align:'center',title : configMsgArray['facilitiesDivisionName'],width: '100px'},
        	{/* 국사형태명          */key : 'mtsoFrmNm', align:'center',title : configMsgArray['mobileTelephoneSwitchingOfficeFormName'],width: '100px'},
        	{/* 한전고객번호     	 */key : 'kepcoCustNo', align:'center',title : configMsgArray['koreaElectricPowerCorporationCustomerNumber'],width: '110px'},
        	{/* 전송기지국구분명    */key : 'trmsBmtsoDivNm', align:'center',title : configMsgArray['transmissionBaseMtsoDivisionName'],width: '120px'},
        	{/*통합시설서비스시작일자*/key : 'intgFcltsSrvcStaDt', align:'center',title : configMsgArray['integrationFacilitiesServiceStartDate'],width: '150px'},
        	{/*통합시설서비스종료일자*/key : 'intgFcltsSrvcEndDt', align:'center',title : configMsgArray['integrationFacilitiesServiceEndDate'],width: '150px'},
        	{/* 도로명      	 */key : 'stNm', align:'center',title : configMsgArray['streetName'],width: '100px'},
        	{/* 지하여부		 */key : 'bsmtYn', align:'center',title : configMsgArray['basementYesOrNo'],width: '70px'},
        	{/* 메인건물번호  	 */key : 'mainBldNo', align:'center',title : configMsgArray['mainBuildingNumber'],width: '110px'},
        	{/* 서브건물번호	 */key : 'subBldNo', align:'center',title : configMsgArray['subordinationBuildingNumber'],width: '110px'},
        	{/* 건물명		 */key : 'bldNm', align:'center',title : configMsgArray['buildingName'],width: '150px'},
        	{/* 건물동		 */key : 'bldblkNm', align:'center',title : configMsgArray['buildingBlock'],width: '70px'},
        	{/* 건물호		 */key : 'bldCallVal', align:'center',title : configMsgArray['buildingUnit'],width: '70px'},
        	{/* 건물층		 */key : 'bldFlorVal', align:'center',title : configMsgArray['buildingFloor'],width: '70px'},
        	{/* 법정동		 */key : 'ldongNm', align:'center',title : configMsgArray['legalDong'],width: '70px'},
        	{/* 법정리		 */key : 'lriNm', align:'center',title : configMsgArray['legalRi'],width: '70px'},
        	{/* 도로명주소 1 	 */key : 'stNmAddr1', align:'left',title : configMsgArray['streetNameAddress']+'1',width: '200px'},
        	{/* 도로명주소 2 	 */key : 'stNmAddr2', align:'left',title : configMsgArray['streetNameAddress']+'2',width: '250px'},
        	{/* 생성일자            */key : 'creDt', align:'center',title : configMsgArray['createDate'],width: '70px'},
        	{/* 변경일자		 */key : 'chgDt', align:'center',title : configMsgArray['changeDate'],width: '70px'},
        	{/* 판매일자       	 */key : 'saleDt', align:'center',title : configMsgArray['saleDate'],width: '70px'},
        	{/* 전기비용내역번호    */key : 'elctyCstDtsNo', align:'center',title : configMsgArray['electricityCostDetailsNumber'],width: '150px'},
        	{/* 전기시설수전전압값  */key : 'elctyFcltsRcvgVoltVal', align:'center',title : configMsgArray['electricityFacilitiesReceivingVoltageValue'],width: '150px'},
        	{/* 전기시설계량기번호  */key : 'elctyFcltsGageNo', align:'center',title : configMsgArray['electricityFacilitiesGaugeNumber'],width: '150px'},
        	{/*전기시설전기비용내역번호*/key : 'elctyFcltsElctyCstDtsNo', align:'center',title : configMsgArray['electricityFacilitiesElectricityCostDetailsNumber'],width: '150px'},
        	{/* 전기시설계약전력량값*/key : 'elctyFcltsCtrtWattVal', align:'center',title : configMsgArray['electricityFacilitiesContractWattageValue'],width: '120px'},
        	{/* 기타번지값    	 */key : 'etcBunjiVal', align:'center',title : configMsgArray['etcBunjiValue'],width: '100px'},
        	{/* 투자유형내용 1     */key : 'invtTypCtt1', align:'center',title : configMsgArray['investTypeContent']+'1',width: '110px'},
        	{/* 투자유형내용 2     */key : 'invtTypCtt2', align:'center',title : configMsgArray['investTypeContent']+'2',width: '110px'},
        	{/* 투자유형내용 3     */key : 'invtTypCtt3', align:'center',title : configMsgArray['investTypeContent']+'3',width: '110px'},
        	{/* 투자유형내용 4     */key : 'invtTypCtt4', align:'center',title : configMsgArray['investTypeContent']+'4',width: '110px'}];
    	//그리드 생성



        $('#'+gridId).alopexGrid({
			paging: { enabledByPager: true, perPage: rowPerPage, pagerCount: 10, pagerSelect: false, hidePageList: true},
        	cellSelectable : true,
             autoColumnIndex : true,
             fitTableWidth : true,
             rowClickSelect : true,
             rowSingleSelect : true,
             rowInlineEdit : true,

             numberingColumnFromZero : false
    	   ,
            defaultColumnMapping: { resizing : true, sorting: true },
            height: "8row",message: {
				nodata : "<div class='no_data'><i class='fa fa-exclamation-triangle' style='height:30px;'></i>" + '조회된 데이터가 없습니다.'  + "</div>",///*'조회된 데이터가 없습니다.'*/,
				filterNodata : 'No data'
			},
			columnMapping : mapping
        });

    };


    var showProgress = function(gridId){
    	$('#'+gridId).alopexGrid('showProgress');
	};

	var hideProgress = function(gridId){
		$('#'+gridId).alopexGrid('hideProgress');
	};



    function gridResearch() {
        var mtsoId = paramData.mtsoId;
        var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";
		var tmpParam =  {mtsoId:mtsoId, sameOfficeChk:sameOfficeChk, pageNo : 1, rowPerPage : 100000};
		$('#'+gridId).alopexGrid('showProgress');
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/IntgFcltsCdList', tmpParam, 'GET', 'intgFcltsCdList');



    };

    this.setGrid = function(page, rowPerPage){


        var mtsoId = paramData.mtsoId;
        var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";


		$('#pageNo').val(page);
		$('#rowPerPage').val(rowPerPage);
		var tmpParam =  { mtsoId:mtsoId, sameOfficeChk:sameOfficeChk, pageNo : page, rowPerPage : rowPerPage};
		$('#'+gridId).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commonlkup/IntgFcltsCdList', tmpParam, 'GET', 'intgFcltsCdList');


	}

    function setEventListener() {

    	$('#'+gridId).on('pageSet', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			com.setGrid(eObj.page, eObj.pageinfo.perPage);
		});

		$('#'+gridId).on('perPageChange', function(e){
			var eObj = AlopexGrid.parseEvent(e);
			perPage = eObj.perPage;
			com.setGrid(1, eObj.perPage);
		});


    	$('#sameOfficeChk').on('change', function(e) {
    		gridResearch();
    	});


    };

	//request 성공시
    function successCallback(response, status, jqxhr, flag){
    	if(flag == 'intgFcltsCdList'){
    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.intgFcltsCdList);
    		var sameOfficeChk = ($('#sameOfficeChk').is(':checked'))? "Y":"N";

//    		if(sameOfficeChk == 'Y'){
//    			gridShow();
//    		}else{
//    			gridHide();
//    		}
//    		$('#'+gridIdEqpFdf).alopexGrid('dataEmpty');

		}
    }

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    }

    function setSPGrid(GridID, Option, Data) {
		var serverPageinfo = {
				dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
				current 	: Option.pager.pageNo, 			//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
				perPage 	: Option.pager.rowPerPage 		//한 페이지에 보일 데이터 갯수
		};
		$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}
    function dd2dms(v){
		var d, m, sign = '', str;

		d = Math.floor(v);
//		d = v.substring(0,2);
		v = (v - d) * 60;
		m = Math.floor(v);
//		m = v.substring(0,2);
		v = (v - m) * 60;
		x = Math.round(v * Math.pow(10, 2)) / Math.pow(10, 2)
		str = d.toString() + '° ' + m.toString() + "' " + x.toString() + '"';

		return str;
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

    function popupList(pidData, urlData, titleData, paramData) {

        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  windowpopup : true,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : 550

              });
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

               /*
               	이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
               */
               //width: 1000,
               //height: 700

           });
     }
});