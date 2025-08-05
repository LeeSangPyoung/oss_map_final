/**
 * UpsdMtsoInf.js
 *
 * @author Administrator
 * @date 2017. 10. 20.
 * @version 1.0
 */
var main = $a.page(function() {

	var mtsoGrid = 'mtsoGrid';
	var floorGrid = 'floorGrid';
	var fileOnDemendName = "";

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	setSelectCode();
    	initGrid();
        setEventListener();
        main.setGrid(1,10);
    };

	//Grid 초기화
    function initGrid() {

        //국사 리스트 그리드 생성
        $('#'+mtsoGrid).alopexGrid({
        	paging : {
        		pagerSelect: [5,8,10,15,20]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [{
				align:'center',
				width: '50px',
				numberingColumn: true
    		}, {
				key : 'sisulCd', align:'center',
				title : '국사코드',
				width: '100px'
			}, {
				key : 'orgNameL1', align : 'center',
				title : '본부',
				width : '80px'
			},{
				key : 'sisulNm', align : 'center',
				title : '국사명',
				width : '200px'
			}, {
				key : 'address', align : 'center',
				title : '주소',
				width : '300px'
			}, {
				key : 'practicalNm', align : 'center',
				title : '활용코드',
				width : '80px'
			}, {
				key : 'detailSaupgubunNm', align : 'center',
				title : '사업구분',
				width : '100px'
			}, {
				key : 'costCenterDesc', align : 'center',
				title : 'COST_CENTER',
				width : '150px'

			}, {
				key : 'partNm', align : 'center',
				title : '담당파트명',
				width : '150px'
			}, {
				key : 'coworkerNm', align : 'center',
				title : '현장운용팀명',
				width : '150px'
			}, {
				key : 'allFloor', align : 'center',
				title : '총층수',
				width : '60px'
			}, {
				key : 'setFloor', align : 'center',
				title : '설치층수',
				width : '60px'
			}, {
				key : 'lat', align : 'center',
				title : '위도',
				width : '100px'
			}, {
				key : 'lng', align : 'center',
				title : '경도',
				width : '100px'
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        //층정보 그리드 생성
        $('#'+floorGrid).alopexGrid({
        	hieght : 150,
        	autoColumnIndex: true,
        	autoResize: true,
        	numberingColumnFromZero: false,
        	columnMapping: [{
        		align:'center',
        		width: '50px',
        		numberingColumn: true
        	}, {
        		key : 'floorId', align:'center',
        		title : '층ID',
        		width: '80px'
        	}, {
        		key : 'childSisulCd', align : 'center',
        		title : '통합시설코드(자)',
        		width : '150px'
        	},{
        		key : 'floorNameNm', align : 'center',
        		title : '층구분',
        		width : '130px'
        	}, {
        		key : 'floorLabel', align : 'center',
        		title : '라벨명',
        		width : '200px'
        	}, {
        		key : 'affairNm', align : 'center',
        		title : '용도구분',
        		width : '130px'
        	}, {
        		key : 'assetNm', align : 'center',
        		title : '자산구분',
        		width : '130px'
        	}, {
        		key : 'neFloorWidth', align : 'center',
        		title : '가로(mm)',
        		width : '130px'
        	}, {
        		key : 'neFloorLength', align : 'center',
        		title : '세로(mm)',
        		width : '130px'
        	}, {
        		key : 'neFloorWidth', align : 'center',
        		title : '층고(mm)',
        		width : '130px'
        	}, {
        		key : 'celluse', align : 'center',
        		title : '상면사용률',
        		width : '80px'
        	}, {
        		key : 'neFloorArea', align : 'center',
        		title : '장비실면적',
        		width : '130px'
        	}, {
        		key : 'batteryFloorArea', align : 'center',
        		title : '축전기실면적',
        		width : '130px'
        	}],
        	message: {
        		nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
        	}
        });

    };

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	var searchInspectCd = {supCd : '007000'};
    	var searchGubun = {supCd : '008000'};

		//관리그룹 조회
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchInspectCd, 'GET', 'searchInspectCd');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchGubun, 'GET', 'searchGubun');

    }


    function setEventListener() {

    	var perPage = 10;

    	// 페이지 번호 클릭시
    	 $('#'+mtsoGrid).on('pageSet', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	main.setGrid(eObj.page, eObj.pageinfo.perPage);
         });

    	//페이지 selectbox를 변경했을 시.
         $('#'+mtsoGrid).on('perPageChange', function(e){
         	var eObj = AlopexGrid.parseEvent(e);
         	perPage = eObj.perPage;
         	main.setGrid(1, eObj.perPage);
         });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 main.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage);
       		}
     	 });

         //국사 클릭시 층정보 조회
         $('#'+mtsoGrid).on('dataSelectEnd', function(e){
        	 var sisulCd = AlopexGrid.parseEvent(e).datalist[0].sisulCd
        	 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoFloorList', {sisulCd: sisulCd}, 'GET', 'floorSearch')
         });

       //엑셀다운
 		$('#btnExportExcel').on('click', function(e){
 			//tango transmission biz 모듈을 호출하여야한다.
     		var param =  $("#searchForm").getData();
     		param.searchInspectCd = $("#searchInspectCd").val();
     		param.searchFloorYn = $("#searchFloorYn").val();

     		param = gridExcelColumn(param, mtsoGrid);


     		param.pageNo = 1;
     		param.rowPerPage = 10;
     		param.firstRowIndex = 1;
     		param.lastRowIndex = 1000000000;


     		param.fileName = '국사정보';
     		param.fileExtension = "xlsx";
     		param.excelPageDown = "N";
     		param.excelUpload = "N";
     		param.method = "getMtsoInf";

     		$('#'+mtsoGrid).alopexGrid('showProgress');
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/mtsoInfExcelcreate', param, 'GET', 'excelDownload');
 		});
	};

	function MtsoReg(){
		var param = {"regYn" : "N", "intgFcltsCd" : ""};
		 popup2('MtsoReg', $('#ctx').val()+'/configmgmt/common/MtsoReg.do', configMsgArray['mobileTelephoneSwitchingOfficeReg'], param);
	}


	/*------------------------*
	  * 엑셀 다운로드
	  *------------------------*/
	function gridExcelColumn(param, mtsoGrid) {
		var gridColmnInfo = $('#'+mtsoGrid).alopexGrid("headerGroupGet");
		//console.log(gridColmnInfo);

		var gridHeader = $('#'+mtsoGrid).alopexGrid("columnGet", {hidden:false});

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
			$('#'+mtsoGrid).alopexGrid('hideProgress');
            var jobInstanceId = response.resultData.jobInstanceId;
            onDemandExcelCreatePop ( jobInstanceId );
        }

		//본부 콤보박스
		if(flag == 'searchInspectCd'){
			var option_data = [{cd: '', cdNm: '선택'}];
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
	   	}

    	//국사 조회시
    	if(flag == 'search'){
    		$('#'+mtsoGrid).alopexGrid('hideProgress');
    		setSPGrid(mtsoGrid,response, response.mtsoInf);
    	}
    	//국사 조회시
    	if(flag == 'floorSearch'){
    		$('#'+floorGrid).alopexGrid('hideProgress');
    		$('#'+floorGrid).alopexGrid('dataSet', response.floorList);



    	}

    	if(flag == 'excelDownload'){
    		$('#'+mtsoGrid).alopexGrid('hideProgress');
            console.log('excelCreate');
            console.log(response);

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

	}

	//request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

 		 var param =  $("#searchForm").serialize();

 		 $('#'+mtsoGrid).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getMtsoInf', param, 'GET', 'search');
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

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

});