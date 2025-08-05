/**
 * SmtsoMatlMgmt.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
 * @version 1.0
 */
var pop = $a.page(function() {

	var paramData = null;
	var gridId = 'dataGrid';

    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
        setEventListener();

        $('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/sbeqpInfStcCurst', param, 'GET', 'sbeqpInfStcCurst');
    };

    //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 550,
        	paging : false,
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [
    			{align:'center', title : '순번', width: '40px', numberingColumn: true},
    			{key : 'mgmtGrpNm', align:'center', title : '관리그룹', width: '60px'},
    			{key : 'orgNm', align:'center', title : '본부', width: '80px'},
    			{key : 'teamNm', align:'center',title : '팀', width: '90px'},
    			{key : 'tmofNm', align:'center', title : '전송실', width: '80px'},
    			{key : 'sbeqpCnt', align:'center', title : '합계', width: '70px'},
    			{key : 'sbeqpCntR', align:'center', title : '정류기', width: '70px'},
    			{key : 'sbeqpCntB', align:'center', title : '축전지', width: '70px'},
    			{key : 'sbeqpCntA', align:'center', title : '냉방기', width: '70px'},
    			{key : 'sbeqpCntF', align:'center', title : '소화설비', width: '80px'},
    			{key : 'sbeqpCntN', align:'center', title : '발전기', width: '70px'},
    			{key : 'sbeqpCntL', align:'center', title : '분전반', width: '70px'},
    			{key : 'sbeqpCntM', align:'center', title : '정류기모듈', width: '80px'},
    			{key : 'sbeqpCntP', align:'center', title : 'IPD', width: '70px'},
    			{key : 'sbeqpCntG', align:'center', title : '계량기함', width: '70px'},
    			{key : 'sbeqpCntS', align:'center', title : '배풍기', width: '70px'},
    			{key : 'sbeqpCntC', align:'center', title : '컨버터', width: '70px'},
    			{key : 'sbeqpCntI', align:'center', title : '인버터', width: '70px'},
    			{key : 'sbeqpCntT', align:'center', title : 'TVSS(SPD)', width: '70px'},
    			{key : 'sbeqpCntO', align:'center', title : '옥외랙', width: '70px'},
    			{key : 'sbeqpCntE', align:'center', title : '기타 장비', width: '70px'}],
        		footer : {
        			position : "bottom",
        			footerMapping : [
        					{columnIndex: 1,title:"합계",align:"center"}
							,{columnIndex: 5,render:"sum(sbeqpCnt )",align:"center"}
							,{columnIndex: 6,render:"sum(sbeqpCntR)",align:"center"}
							,{columnIndex: 7,render:"sum(sbeqpCntB)",align:"center"}
							,{columnIndex: 8,render:"sum(sbeqpCntA)",align:"center"}
							,{columnIndex: 9,render:"sum(sbeqpCntF)",align:"center"}
							,{columnIndex:10,render:"sum(sbeqpCntN)",align:"center"}
							,{columnIndex:11,render:"sum(sbeqpCntL)",align:"center"}
							,{columnIndex:12,render:"sum(sbeqpCntM)",align:"center"}
							,{columnIndex:13,render:"sum(sbeqpCntP)",align:"center"}
							,{columnIndex:14,render:"sum(sbeqpCntG)",align:"center"}
							,{columnIndex:15,render:"sum(sbeqpCntS)",align:"center"}
							,{columnIndex:16,render:"sum(sbeqpCntC)",align:"center"}
							,{columnIndex:17,render:"sum(sbeqpCntI)",align:"center"}
							,{columnIndex:18,render:"sum(sbeqpCntT)",align:"center"}
							,{columnIndex:19,render:"sum(sbeqpCntO)",align:"center"}
							,{columnIndex:20,render:"sum(sbeqpCntE)",align:"center"}
					]
        	},
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = [];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    function setEventListener() {

    	//엑셀다운
        $('#btnExportExcel').on('click', function(e){
			//tango transmission biz 모듈을 호출하여야한다.
    		var param =  $("#searchForm").getData();

    		param = gridExcelColumn(param, gridId);
    		param.pageNo = 1;
    		param.rowPerPage = 10;
    		param.firstRowIndex = 1;
    		param.lastRowIndex = 1000000000;

    		var tmofList_Tmp = "";
			var mtsoTypCdList_Tmp = "";
			if (param.tmofList != "" && param.tmofList != null ){
	   			 for(var i=0; i<param.tmofList.length; i++) {
	   				 if(i == param.tmofList.length - 1){
	   					tmofList_Tmp += param.tmofList[i];
	                    }else{
	                    	tmofList_Tmp += param.tmofList[i] + ",";
	                    }
	    			}
	   			param.tmofList = tmofList_Tmp ;
	   		 }

			if (param.mtsoTypCdList != "" && param.mtsoTypCdList != null ){
	   			 for(var i=0; i<param.mtsoTypCdList.length; i++) {
	   				 if(i == param.mtsoTypCdList.length - 1){
	   					mtsoTypCdList_Tmp += param.mtsoTypCdList[i];
	                    }else{
	                    	mtsoTypCdList_Tmp += param.mtsoTypCdList[i] + ",";
	                    }
	    			}
	   			param.mtsoTypCdList = mtsoTypCdList_Tmp ;
	   		 }

    		param.fileName = '부대장비통계현황_';
    		param.fileExtension = "xlsx";
    		param.excelPageDown = "N";
    		param.excelUpload = "N";
    		param.method = "getSbeqpInfStcCurst";

    		$('#'+gridId).alopexGrid('showProgress');
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/sbeqpmgmt/excelcreate', param, 'GET', 'excelDownload');
		});

	};

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/

	function gridExcelColumn(param, gridId) {

    	/*======Grid의 HeaderGroup 내용 가져오기======*/
    	var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");

    	var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/

		for(var i=0; i<gridHeaderGroup.length; i++) {
			if(gridHeaderGroup[i].title != undefined && gridHeaderGroup[i].id != "u0" && gridHeaderGroup[i].id != "u1" && gridHeaderGroup[i].id != "u7") {
				excelHeaderGroupFromIndex += gridHeaderGroup[i].fromIndex - 1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupFromIndex += ";";
				excelHeaderGroupToIndex += gridHeaderGroup[i].toIndex - 1;/*순번칼럼다운 제외되니까*/
				excelHeaderGroupToIndex += ";";
				excelHeaderGroupTitle += gridHeaderGroup[i].title;
				excelHeaderGroupTitle += ";";
				excelHeaderGroupColor += gridHeaderGroup[i].color;
				excelHeaderGroupColor += ";";
			}
		}

		/*======Grid의 Header 내용 가져오기 ======*/
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

		/*======해더그룹정보======*/
		param.excelHeaderGroupFromIndex = excelHeaderGroupFromIndex;
		param.excelHeaderGroupToIndex = excelHeaderGroupToIndex;
		param.excelHeaderGroupTitle = excelHeaderGroupTitle;
		param.excelHeaderGroupColor = excelHeaderGroupColor;

		/*======해더정보======*/
		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}

	function successCallback(response, status, jqxhr, flag){
		if(flag == "sbeqpInfStcCurst"){

			$('#'+gridId).alopexGrid('hideProgress');
    		$('#'+gridId).alopexGrid('dataSet', response.sbeqpInfStcCurst);
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