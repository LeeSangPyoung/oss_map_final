/**
 * EqpSctnMgmt.js
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
        setEventListener();
    };
    
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
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		headerGroup : [ { fromIndex :  3 , toIndex :  5 , title : configMsgArray['west'] , id : "West", color : "YELLOW"},
                  			{ fromIndex : 6 , toIndex : 8 , title : configMsgArray['east'] , id : "East", color : "BLUE"} ],
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true 
			}, {/* 단계                */
				key : 'pathMax', align:'center',
				title : configMsgArray['step'],
				width: '50px'
			}, {/* 장비구간현황                */
				key : 'sctnEqpNm', align:'left',
				title : configMsgArray['equipmentSectionCurrentState'],
				width: '200px'
			}, {/* 국사명		 */
				key : 'lftMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '120px'
			}, {/* 장비명       	 */
				key : 'lftEqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '130px'
			}, {/* 장비포트명  	 */
				key : 'lftPortNm', align:'center',
				title : configMsgArray['equipmentPortName'],
				width: '100px'
			},  {/* 국사명		 */
				key : 'rghtMtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '120px'
			}, {/* 장비명       	 */
				key : 'rghtEqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '130px'
			}, {/* 장비포트     	 */
				key : 'rghtPortNm', align:'center',
				title : configMsgArray['equipmentPort'],
				width: '100px'
			}, {/* 구간ID--숨김데이터		 */
				key : 'eqpSctnId', align:'center',
				title : configMsgArray['sectionIdentification'],
				width: '100px'
			}, {/* 장비ID--숨김데이터    	 */
				key : 'lftEqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '130px'
			}, {/* 장비포트ID-숨김데이터	     */
				key : 'lftPortId', align:'center',
				title : configMsgArray['equipmentPortIdentification'],
				width: '100px'
			}, {/* 장비ID-숨김데이터    	 */
				key : 'rghtEqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '130px'
			}, {/* 장비포트ID-숨김데이터	     */
				key : 'rghtPortId', align:'center',
				title : configMsgArray['equipmentPortIdentification'],
				width: '100px'
			}],
			message: {/* 데이터가 없습니다.		 */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
   };
   
// 컬럼 숨기기
   function gridHide() {
   	
   	var hideColList = ['eqpSctnId','lftEqpId','lftPortId','rghtEqpId','rghtPortId'];
   	
   	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
   	
	}
   
	// 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	 function setSelectCode() {
		 var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
			 $('#chrrOrgGrpCd').val(chrrOrgGrpCd);
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
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
         
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 if ($('#staEqpId').val() == "") {
 	     		//필수입력 항목입니다. [ 시작장비 ] 
 	     		callMsgBox('','W', makeArgConfigMsg('required',' 시작장비 '), function(msgId, msgRst){});
 	     		return; 	
 	     	 }
    		 
    		 main.setGrid(1,perPage);
         });
    	 
    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid(1,perPage);
       		}
     	 });
         
    	//장비조회
    	 $('#staEqpSearch').on('click', function(e) {
    		 $a.popup({
    	          	popid: 'staEqpSearch',
    	          	title: configMsgArray['findEquipment'],
    	            url: $('#ctx').val()+'/configmgmt/equipment/EqpLkup.do',
    	            width : 950,
    	           	height : window.innerHeight * 0.83,
    	           	data : {"fromE2EEqpSctn": "Y"},
    	           	modal: true,
                    movable:true,
    	           	callback : function(data) { // 팝업창을 닫을 때 실행 
    	                $('#staEqpNm').val(data.eqpNm);
    	                $('#staEqpId').val(data.eqpId);
    	           	}
    	      });
         });
    	 
    	 //토폴로지
    	 $('#btnTopology').on('click', function(e) {
//	    	 dataParam = {"eqpId" : $('#staEqpId').val()};
	    	 if($('#staEqpId').val() == "" || $('#staEqpId').val() == null){
	    		//필수 선택 항목입니다.[ 시작장비 ] 
	     		callMsgBox('','W', makeArgConfigMsg('requiredOption'," 시작장비 "), function(msgId, msgRst){});
	     		return; 	
 	     	 }else{
// 	     		 $a.navigate($('#ctx').val()+'/configmgmt/tnbdgm/TnBdgm.do', dataParam);
 	     		window.open('/tango-transmission-web/configmgmt/tnbdgm/TnBdgm.do?eqpId='+$('#staEqpId').val());
 	     	 }
         });
    	 
    	 $('#btnExportExcel').on('click', function(e) {
     		//tango transmission biz 모듈을 호출하여야한다.
     		 var param =  $("#searchForm").getData();
     		 
     		 param = gridExcelColumn(param, gridId);
     		 param.pageNo = 1;
     		 param.rowPerPage = 10;   
     		 param.firstRowIndex = 1;
     		 param.lastRowIndex = 1000000000;   
     		 
     		 param.fileName = configMsgArray['E2ESectionInfo']; /* E2E구간정보   	 */
     		 param.fileExtension = "xlsx";
     		 param.excelPageDown = "N";
     		 param.excelUpload = "N";
     		 param.method = "getE2EEqpSctnMgmtList";
     		 
     		 $('#'+gridId).alopexGrid('showProgress');
  	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/excelcreate', param, 'GET', 'excelDownload');
          });
    	         
    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = null;
    	 	dataObj = AlopexGrid.parseEvent(e).data;
    	 	dataObj.regYn = "Y";
    	 	popup('E2EEqpSctnDtlLkup', 'E2EEqpSctnDtlLkup.do', configMsgArray['E2ESectionDetailInfo'],dataObj);
    	 
    	 });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
         });
    	 
    	 $('input[name=staEqpId]').on('input propertychange', function () {
     		$('input[name=staEqpNm]').val('');
     	 });
    };
    
    function gridExcelColumn(param, gridId) {
		/*======Grid의 HeaderGroup 내용 가져오기======*/
    	var gridHeaderGroup = $('#'+gridId).alopexGrid("headerGroupGet");
		
    	var excelHeaderGroupFromIndex = ""; /*해더그룹의 Merge할 시작 Column Index*/
		var excelHeaderGroupToIndex = "";   /*해더그룹의 Merge할 끝 Column Index*/
		var excelHeaderGroupTitle = "";     /*해더그룹의 Merge 제목*/
		var excelHeaderGroupColor = "";     /*해더그룹의 Merge 색깔*/
		
		for(var i=0; i<gridHeaderGroup.length; i++) {
			if(gridHeaderGroup[i].title != undefined) {
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
    	
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.E2EEqpSctnMgmt);
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
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
		
	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	       	
	}
    
    //request 실패시.
    function failCallback(response, status, jqxhr, flag){
    	if(flag == 'search'){
    		//조회을 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    
    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").getData();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/e2eEqpSctnMgmt', param, 'GET', 'search');
    }
    
    function popup(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  iframe: false,
                  modal: true,
                  movable:true,
                  width : 865,
                  height : window.innerHeight * 0.75
              });
        }
    
    function popupList(pidData, urlData, titleData, paramData) {
    	
        $a.popup({
              	popid: pidData,
              	title: titleData,
                  url: urlData,
                  data: paramData,
                  modal: true,
                  movable:true,
                  width : 1200,
                  height : window.innerHeight * 0.9
              });
        }
    
    /*var httpRequest = function(Url, Param, Method, Flag ) {
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
    }*/
    
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