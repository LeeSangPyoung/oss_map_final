/**
 * EqpMdlMgmt.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
var main = $a.page(function() {

	var gridId = 'dataGrid';


    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
    	setRegDataSet(param);
        setEventListener();
    };

    function setRegDataSet(data) {

    	$('#trmsYn').setSelected("");

    	var startDate = new Date().format("yyyy-MM-dd");
		var endDate = new Date().format("yyyy-MM-dd");
		$("#srchStartDt").val(startDate);
		$("#srchEndDt").val(endDate);

    }

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000,5000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	defaultColumnMapping:{
    			sorting : true
    		},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		columnMapping: [{
				key : 'clctDtm', align:'center',
				title : '수집일시',
				width: '120px'
			},{
				key : 'barNo', align:'center',
				title : '바코드번호',
				width: '120px'
			},{
				key : 'prntMatlBarNo', align:'center',
				title : '부모바코드번호',
				width: '120px'
			},{
				key : 'lnkgSrno', align:'center',
				title : '연동일련번호',
				width: '120px'
			},{
				key : 'newIntgFcltsCd', align:'center',
				title : '신규통합시설코드',
				width: '120px'
			},{
				key : 'intgFcltsCd', align:'center',
				title : '이전통합시설코드',
				width: '120px'
			},{/*숨김데이터*/
				key : 'mdulDivCd', align:'center',
				title : '모듈구분코드',
				width: '120px'
			},{
				key : 'mdulDivNm', align:'center',
				title : '모듈구분',
				width: '80px'
			},{
				key : 'serNo', align:'center',
				title : '시리얼번호',
				width: '120px'
			},{
				key : 'cstrCd', align:'center',
				title : '공사코드',
				width: '80px'
			},{
				key : 'wkrtNo', align:'center',
				title : '작업지시번호',
				width: '80px'
			},{
				key : 'eqpId', align:'center',
				title : '장비ID',
				width: '120px'
			},{
				key : 'eqpNm', align:'center',
				title : '장비명',
				width: '120px'
			},{/*숨김데이터*/
				key : 'eqpMdlId', align:'center',
				title : '장비모델ID',
				width: '120px'
			},{
				key : 'eqpMdlNm', align:'center',
				title : '장비모델명',
				width: '120px'
			},{ /*숨김데이터*/
				key : 'bldAddr', align:'center',
				title : '건물주소',
				width: '120px'
			},{/*숨김데이터*/
				key : 'bldNm', align:'center',
				title : '건물명',
				width: '120px'
			},{
				key : 'opDivCd', align:'center',
				title : '운용구분',
				width: '80px'
			},{
				key : 'mntYn', align:'center',
				title : '장착여부',
				width: '80px'
			},{
				key : 'execSussYn', align:'center',
				title : '실행성공여부',
				width: '100px'
			},{
				key : 'lnkgFailRsn', align:'center',
				title : '연동실패사유',
				width: '120px'
			},{
				key : 'lnkgDtm', align:'center',
				title : '연동일시',
				width: '120px'
			},{ /*숨김데이터*/
				key : 'trmsYn', align:'center',
				title : '전송여부',
				width: '120px'
			}],
			message: {/* 데이터가 없습니다.      */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    gridHide();
	};

	//컬럼 숨기기
	function gridHide() {
		var hideColList = ['mdulDivCd', 'eqpMdlId','trmsYn','bldAddr','bldNm','lnkgSrno'];
		$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {


    }

    function setEventListener() {


    	var option_data =  [];
		for(var i=0; i < 24; i++){
			var tmpH =  NumberPad(i, 2);
			var resObj = {cd:tmpH, cdNm : tmpH};
			option_data.push(resObj);
		}
		$('#srchStartHh').setData({ data:option_data });
		$("#srchStartHh").val("00");

		$('#srchEndHh').setData({ data:option_data });
		$("#srchEndHh").val("23");

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

//         $('#btnTest').on('click', function(e) {
//        	 $a.popup({
//        			popid: 'BarCardInfLkup',
//        			title: '카드조회',
//        			url: '/tango-transmission-web/configmgmt/barmgmt/BarCardInfLkup.do',
//        			data: null,
//        			windowpopup : true,
//        			modal: true,
//        			movable:true,
//        			width : 1241,
//        			height : 862
//        		});
//         });





    	 $('#btnExportExcel').on('click', function(e) {
        		//tango transmission biz 모듈을 호출하여야한다.
        		 var param =  $("#searchForm").getData();
        		 var eqpRoleDivCd = "";
        		 var bpId = "";

        		 param = gridExcelColumn(param, gridId);
        		 param.pageNo = 1;
        		 param.rowPerPage = 10;
        		 param.firstRowIndex = 1;
        		 param.lastRowIndex = 1000000000;

        		 if (param.eqpRoleDivCdList != "" && param.eqpRoleDivCdList != null ){
  	   			 for(var i=0; i<param.eqpRoleDivCdList.length; i++) {
  	   				 if(i == param.eqpRoleDivCdList.length - 1){
  	   					 eqpRoleDivCd += param.eqpRoleDivCdList[i];
  	                    }else{
  	                   	 eqpRoleDivCd += param.eqpRoleDivCdList[i] + ",";
  	                    }
  	    			}
  	   			param.eqpRoleDivCd = eqpRoleDivCd ;
  	   			param.eqpRoleDivCdList = [];
  	   		 }

  	   		 if (param.vendIdList != "" && param.vendIdList != null ){
  	   			 for(var i=0; i<param.vendIdList.length; i++) {
  	   				 if(i == param.vendIdList.length - 1){
  	   					 bpId += param.vendIdList[i];
  	                    }else{
  	                   	 bpId += param.vendIdList[i] + ",";
  	                    }
  	    			}
  	   			param.bpId = bpId ;
  	   			param.bpIdList = [];
  	   		 }

        		 param.fileName = '바코드유동내역'
        		 param.fileExtension = "xlsx";
        		 param.excelPageDown = "N";
        		 param.excelUpload = "N";
        		 param.method = "getBarFlowDtsInfList";

        		 $('#'+gridId).alopexGrid('showProgress');
     	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/excelcreate', param, 'GET', 'excelDownload');
             });


	};


	function successCallback(response, status, jqxhr, flag){


		if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');

    		setSPGrid(gridId, response, response.barFlowDtsInf);
    	}



		if(flag == 'excelDownload'){
    		$('#'+gridId).alopexGrid('hideProgress');
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

    function setSPGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

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

			if (i== gridColmnInfo.length-1) {

				excelHeaderGroupFromIndexTemp += gridColmnInfo[i].fromIndex + ";";
				excelHeaderGroupToIndexTemp +=  gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf = gridColmnInfo[i].fromIndex + (gridColmnInfo[i].groupColumnIndexes.length);
			}
			else {
				excelHeaderGroupFromIndexTemp  += toBuf+ ";";
				excelHeaderGroupToIndexTemp +=  toBuf + (gridColmnInfo[i].groupColumnIndexes.length-1)+ ";";
				toBuf =  toBuf + (gridColmnInfo[i].groupColumnIndexes.length)
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

		return param;
	}

    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회 실패 하였습니다.
    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }

    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

    	var startDate = new Date().format("yyyy-MM-dd");
		var endDate = new Date().format("yyyy-MM-dd");

		var srchStartDt = $("#srchStartDt").val();
		var srchEndDt = $("#srchEndDt").val();
		if (srchStartDt == null || srchStartDt == undefined || srchStartDt == "") {
			$("#srchStartDt").val(startDate);
		}
		if (srchEndDt == null || srchEndDt == undefined || srchEndDt == "") {
			$("#srchEndDt").val(endDate);
		}



		$("#srchStartDtm").val(srchStartDt.replace(/-/gi,'') + $("#srchStartHh").val() + "0000");
		$("#srchEndDtm").val(srchEndDt.replace(/-/gi,'') + $("#srchEndHh").val() + "5959");


    	 var param =  $("#searchForm").serialize();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/barmgmt/barFlowDtsInf', param, 'GET', 'search');
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

    Date.prototype.format = function(f) {
	    if (!this.valueOf()) return " ";
	    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var d = this;
	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};

	Number.prototype.zf = function(len){return prependZeor(this, len);};
	function prependZeor(num, len) {
		while(num.toString().length < len) {
			num = "0"+num;
		}
		return num;
	}

    function NumberPad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
});