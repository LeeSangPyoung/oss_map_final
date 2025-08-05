/**
 * OmsTccSvlnLineList.js
 *
 * @author park. i. h.
 * @date 2016.09.08
 * @version 1.0
 * 
 */
var svlnTypCdListCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnTypCombo = [];  // 콤보용 서비스회선유형코드 데이터
var svlnCommCodeData = [];  // 서비스회선 공통코드
var cmCodeData =[];  // 서비스회선 공통코드
var svlnLclSclCodeData = [];  // 서비스회선 대분류 소분류코드
var bizrCdCodeData = [];
var msgVal = "";		// 메시지 내용

var returnTaskMapping = []; // 선번작성 헤더

var taskMaxnumber = 0;

var svlnLclCd = null;
var svlnSclCd = null;

var jobInstanceId = "";

var pageForCount = 100;

var showAppltNoYn = false;

var schScrollBottom = false;

var fdfUsingInoLineNo = null;

var preSchParam = null;
var preSchDataCnt = 0;


var contextMenudataKey = "";

var editPsblGbnSelectVal = "I";  // 기본정보, 선번정보 라디오 선택값

$a.page(function() {
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
        
    	fdfUsingInoLineNo = null;
    	
    	$('#btnExportExcel').setEnabled(false);
		
//    	createMgmtGrpSelectBox ("mgmtGrpCd", "A", $('#userMgmtCd').val());  // 관리 그룹 selectBox
    	
    	setSelectCode();
    	 
        setEventListener();      
    	getGrid();
    	$('.arrow_more').click();
    	var sDay = getTodayStr("-");
    	var eDay = getDateAdd(sDay, "-",7);
    	$('#jobReqDtStart').val(sDay);
    	$('#jobReqDtEnd').val(eDay);
    	$('#jobReqDtDis').setEnabled(false);
    };

    
    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofCmCdData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlnlclsclcode', null, 'GET', 'svlnLclSclCodeData');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getsvlncommcode', null, 'GET', 'svlnCommCodeData');
    	    	
    	 // 사용자 소속 전송실
//    	searchUserJrdtTmofInfo("tmofCd");
    	
    	//schFieldNm
    	var schFieldNmData = [
    	                      {value:"jobTitle", text:cflineMsgArray['workName']/*"작업명"*/}
    	                      ,{value:"LINE_NM", text:cflineMsgArray['lnNm']/*"회선명"*/}
    	                      ,{value:"SVLN_NO", text:cflineMsgArray['serviceLineNumber']/*"서비스회선번호"*/}
    	                      ,{value:"UPR_SYSTM_NM", text:cflineMsgArray['upperSystemName']/*"상위시스템명"*/}
    	                      ,{value:"LOW_SYSTM_NM", text:cflineMsgArray['lowSystemName']/*"하위시스템명"*/}
    	                      ,{value:"LINE_APPLT_NO", text:cflineMsgArray['applicationNumber']/*"청약번호"*/}
    	                      ,{value:"trkNm", text:cflineMsgArray['trunkNm']/*"트렁크명"*/}
    	                      ,{value:"TIE", text:"TIE"}
    	                      ];
		$('#schFieldNm').setData({data : schFieldNmData});
    	 
    }
    
    function excelCreatePop ( jobInstanceId ){
    	// 엑셀다운로드팝업
       	 $a.popup({
            	popid: 'ExcelDownlodPop' + jobInstanceId,
            	iframe: true,
            	modal : false,
            	windowpopup : true,
                url: 'ExcelDownloadPop.do',
                data: {
                	jobInstanceId : jobInstanceId
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
    // 기지국사 등록
    function baseMtsoPop() {
    	var data = $('#searchForm').getData();
    	var mtsoVal = data.tmofCd;
    	    	
    	$a.popup({
    		popid: "BaseMtsoPop",
    		title: cflineMsgArray['btsNameRegistration']/*"기지국사 등록"*/,
    		url: "BaseMtsoPop.do",
    		data: mtsoVal,
    		iframe: true,
    		modal: true,
    		movable: true,
    		width: 1000,
    		height: 500,
    		callback: function(data) {
    			if(data != null) {
    				var focusData = $('#'+gridIdWork).alopexGrid("dataGet", {_state : {focused : true}});
  		    		var rowIndex = focusData[0]._index.data;
  		    		
    				$('#'+gridIdWork).alopexGrid("cellEdit", data.cuid, {_index: {row: rowIndex}}, "cuid");
   					$('#'+gridIdWork).alopexGrid("cellEdit", data.btsName, {_index: {row: rowIndex}}, "btsName");
    			}
    		}
    	});
    }
    
    function setEventListener() {
	 	// 엔터 이벤트   #searchForm
     	$('.condition_box').on('keydown', function(e){
     		if (e.which == 13  ){
    			$('#btnSearch').click();
    			return false;
    		}
     	});	      	
		// 작업요청일 체크 박스 클릭시 
	    $('#jobReqDtYn').on('click', function(e) {
	    	if($('#jobReqDtYn').getValues()=="Y"){
	    		$('#jobReqDtDis').setEnabled(true);
	    	}else{
	    		$('#jobReqDtDis').setEnabled(false);
	    	};
	   	});
	    
	    //
     	$('#schFieldNm').on('change',function(e){
    		$("#jobReqDtYn").setChecked(false);
    		$('#jobReqDtDis').setEnabled(false);
     	});
	    
    	//조회 
    	 $('#btnSearch').on('click', function(e) {
    		 svlnLclCd = $('#svlnLclCd').val();
    		 svlnSclCd = $('#svlnSclCd').val();
    		 if(nullToEmpty(svlnLclCd) == ""){
    			 alertBox('W', makeArgMsg('selectObject',cflineMsgArray['serviceLineLcl'],"","","")); /*"서비스 회선 대분류를 선택해 주세요.;*/
         		return;
    		 }
    		 $('#jobId').val("");

     		$('#'+gridIdTask).alopexGrid("dataEmpty");
    		 getGrid(svlnLclCd, svlnSclCd, null, gridIdTask);
    		 searchProc();    		 
         });
    	 
    	   
         // 스크롤 조회 
         $('#'+gridIdTask).on('scrollBottom', function(e){
        	 
        	 var nFirstRowIndex =parseInt($("#firstRow01").val()) + pageForCount;  // 페이징개수
        	 var nLastRowIndex =parseInt($("#lastRow01").val()) + pageForCount; // 페이징개수
        	 searchForPageAdd(nFirstRowIndex, nLastRowIndex, 'searchForPageAdd');
        	 
     	});     	 

    	 
         
         // 엑셀업로드
          $('#btnAddExcel').on('click', function(e) {
        	var titleVal = cflineMsgArray['svlnExcelUpload'] /*'서비스회선 엑셀업로드'*/;
        	var popidVal = "OpenTaskLineExcelUplaodPop";
        	var urlVal = "OpenTaskLineExcelUploadPop.do";

         	 $a.popup({
              	popid: popidVal,
              	title: titleVal, 
              	iframe: true,
              	modal : false,
              	windowpopup : true,
                url: $('#ctx').val() +'/configmgmt/cfline/' + urlVal,
                  data: null, 
                  width : 800,
                  height : 410 //window.innerHeight * 0.5,
                  /*$('#ctx').val() + url
              		이 페이지 에서만 사용하는 넓이 높이 modal 속성등이 있을 경우에만 추가 해서 사용.
              	*/                
                  ,callback: function(resultCode) {
	                  	if (resultCode == "OK") {
	                  		//$('#btnSearch').click();
	                  	}
                 	}
         	 	  ,xButtonClickCallback : function(el){
         	 			alertBox('W', cflineMsgArray['infoClose'] );/*'닫기버튼을 이용해 종료하십시오.'*/
         	 			return false;
         	 		}
              });
         });    	 
    	 
         //엑셀다운로드
         $('#btnExportExcel').on('click', function(e) {
        	 funExcelBatchExecute();
         });  

     	
    	// 서비스회선 대분류 선택 
    	$('#svlnLclCd').on('change', function(e){
      	});        	 
    	// 서비스회선소분류코드 선택시
    	$('#svlnSclCd').on('change', function(e){     		
      	}); 
    	

        // 라디오 버튼 클릭시
        $('input:radio[name=editPsblGbnVal]').on('change', function(e) {
        	editPsblGbnSelectVal = $(this).val();
        });	
    	
		// 작업정보저장
	    $('#btnWorkUpdate').on('click', function(e) {
	    	workUpdate();
	   	});
		
		// 전송실 등록
		$('#btnDupMtsoMgmt').on('click', function(e) {
			var gridVal = gridIdTask;
			var element =  $('#'+gridVal).alopexGrid('dataGet', {_state: {selected:true}});
			var selectCnt = element.length;
			
			if(selectCnt <= 0){
    			alertBox('W', cflineMsgArray['selectNoData']/* 선택된 데이터가 없습니다. */); 
			}else{
				var paramMtso = null;
				var paramList = [element.length];
				var mgmtGrpStr = "";
				var mgmtGrpChk = "N";
				if(selectCnt==1){
					paramMtso = {"multiYn":"N", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "svlnNo":element[0].svlnNo};
				}else{
					for(i=0;i<element.length;i++){
						paramList[i] = element[i].svlnNo;
						//paramList[i] = {"svlnNoArr":element[i].svlnNo};
						//paramList.push({"svlnNoArr":element[i].svlnNo};
						if(i==0){
							mgmtGrpStr = element[0].mgmtGrpCd;
						}
						if(i>0 && mgmtGrpStr != element[i].mgmtGrpCd){
							mgmtGrpChk = "Y";
						}
						
					}
					if(mgmtGrpChk == "Y"){
						//alert("여러 회선에 대한 전송실 등록시는 동일 관리그룹만 가능합니다.");						
						alertBox('W', cflineMsgArray['multiMtsoRegSameMngrGrpPoss']);/*여러 회선에 대한 전송실 등록시 동일 관리그룹만 가능합니다.*/
						return;
					}
					paramMtso = {"multiYn":"Y", "mgmtGrpCd":element[0].mgmtGrpCd, "mgmtGrpCdNm":element[0].mgmtGrpCdNm, "svlnNoArr":paramList};
				}

				srvcPopup2( "svlnMtsoUpdatePop", "/configmgmt/cfline/ServiceLineMtsoUpdatePop.do", paramMtso, 1200, -1, cflineMsgArray['serviceLine']/*서비스회선*/ +" "+ cflineMsgArray['mtsoEstablish']/*서비스회선전송실설정*/);
					    		
			}
		});
		// 서비스회선등록
		$('#btnServiceWritePop').on('click', function(e) {
			var svlnBtsTtl = nullToEmpty($('#svlnLclCd').getTexts()[0]);
			var paramArr = {"svlnSclCd":$('#svlnSclCd').val()}
			srvcPopup( "popServcieLineBtsWrite", "/configmgmt/cfline/ServiceLineBtsWritePop.do", paramArr, 1200, 700, cflineMsgArray['btsLineRegistration']/*기지국회선 등록*/);
		});
          	
		   		
    	// 선번작성 (Task) 그리드  더블클릭
		$('#'+gridIdTask).on('dblclick', '.bodycell', function(e){	
				fnGridDbclick(gridIdTask, e);
		});	
		// 선번작성 (Task) 그리드 엔터시 
		$('#'+gridIdTask).on('keydown', function(e){	
			if (e.which == 13){
				fnGridKeydown(gridIdTask, e);
				return false;
			}
     	});	      
     				

		// 선번작성 (Task) 그리드 클릭시
		$('#'+gridIdTask).on('click', function(e) {
			fnGridClick(gridIdTask, e);
        });

		// 전송실 등록
		$('#btnRepeaterMgmt').on('click', function(e) {
			openRepeaterMgmt();
		});

	};		
	// 그리드 클릭시 제어 함수
	function fnGridClick(gridVal, e){
		if( $("#tmpEditPsblGbnVal").val()=="L" ){
			return false;
		}
    	var object = AlopexGrid.parseEvent(e);
    	if(!object.bodycell){
    		return false;
    	}
    	var data = AlopexGrid.currentData(object.data);
   	
    	if (data == null) {
    		return false;
    	}
    	// 회선개통일자
    	if (object.mapping.key == "lineOpenDt" && object.mapping.editable == true) {
    		if ( data._state.focused) {
    			var keyValue = object.mapping.key;
    			datePicker(gridVal, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
    		}
    	}
    	// 회선해지일자
    	if (object.mapping.key == "lineTrmnDt" && object.mapping.editable == true) {
    		if ( data._state.focused) {
    			var keyValue = object.mapping.key;
    			datePicker(gridVal, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
    		}
    	}
    	// 회선해지예정일자
    	if (object.mapping.key == "lineTrmnSchdDt" && object.mapping.editable == true) {
    		if ( data._state.focused) {
    			var keyValue = object.mapping.key;
    			datePicker(gridVal, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
    		}
    	}
    	// 청약일자
    	if (object.mapping.key == "appltDt" && object.mapping.editable == true) {
    		if ( data._state.focused) {
    			var keyValue = object.mapping.key;
    			datePicker(gridVal, data._index.grid + "-" + data._index.row + "-" + data._index.column, data._index.row, keyValue);
    		}
    	}
	};

	// 그리드 더블 클릭시 제어 함수
	function fnGridDbclick(gridVal, e){		 	
		var dataObj = AlopexGrid.parseEvent(e).data;
	 	var dataKey = dataObj._key;	 
	 	if (dataKey == "rnmEqpIdNm" || dataKey == "rnmPortIdNm" || dataKey == "rnmPortChnlVal" ) {  // RM장비찾기, RM포트찾기 팝업
	 		openRmEqpPortPop(gridVal, e);
	 	} else if(dataKey == "cuid" || dataKey == "btsName") {
	 		if(dataObj.svlnLclCdNm == cflineMsgArray['btsLine']/*"기지국회선"*/ && (dataObj.svlnSclCdNm == "1X" || dataObj.svlnSclCdNm == "2G" || dataObj.svlnSclCdNm == "WCDMA" || dataObj.svlnSclCdNm == "Wibro" || dataObj.svlnSclCdNm == "EV-DO")) {
	 			baseMtsoPop();
	 		}
	 	}else if(dataKey == "svlnNo") {
	 		showServiceLineEditPop( gridVal, dataObj ,"Y");  // 구 선번 편집창 
	 		//showServiceLIneInfoPop( gridVal, dataObj, "Y");  // 시각화 선번 편집창 
 		}
	};
	
	// 그리드 엔터시 제어 함수
	function fnGridKeydown(gridVal, e){	
			var object = AlopexGrid.parseEvent(e);
			var data = AlopexGrid.currentData(object.data);
			var dataObj = AlopexGrid.parseEvent(e).data;
			if( $("#tmpEditPsblGbnVal").val()=="L"){
				var focusData = $('#'+gridVal).alopexGrid("focusInfo").inputFocus.mapping;
				//var focusDataObj = AlopexGrid.parseEvent(e).data;
			 	var dataKey = focusData.key;	
		 		if(dataKey.indexOf("useTrkNtwkLineNm#") > -1){	 // 트렁크 명
			 		var trkNtwkNmVal = dataObj._state.editing[dataObj._column];
					$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
					var vTmofInfoArr = [];
					var vTmofInfoUpr = {mtsoId: data.uprMtsoId, mtsoNm: data.uprMtsoIdNm}
					vTmofInfoArr.push(vTmofInfoUpr);
					var vTmofInfoLow = {mtsoId: data.lowMtsoId, mtsoNm: data.lowMtsoIdNm}
					vTmofInfoArr.push(vTmofInfoLow);
		 			var param = {vTmofInfo : vTmofInfoArr, isLink : false, ntwkLineNm : trkNtwkNmVal, mgmtGrpCd : data.mgmtGrpCd, topoLclCd : "002"};

		 			searchTrunkByLnoPop(param, gridVal, dataKey);
		 		}else if(dataKey.indexOf("useRingNtwkLineNm#") > -1){	// 링명 
			 		var ringNtwkNmVal = dataObj._state.editing[dataObj._column];
					$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
					var vTmofInfoArr = [];
					if(nullToEmpty(data.uprMtsoId) != ""){
						var vTmofInfoUpr = {mtsoId: data.uprMtsoId, mtsoNm: data.uprMtsoIdNm}
						vTmofInfoArr.push(vTmofInfoUpr);
					}
					if(data.uprMtsoId != data.lowMtsoId && nullToEmpty(data.lowMtsoId) != ""){
						var vTmofInfoLow = {mtsoId: data.lowMtsoId, mtsoNm: data.lowMtsoIdNm}
						vTmofInfoArr.push(vTmofInfoLow);
					}
		 			var param = {vTmofInfo : vTmofInfoArr, ntwkLineNm : ringNtwkNmVal, mgmtGrpCd : data.mgmtGrpCd, topoLclCd : "001", topoSclCd: ""};
		 			searchRingByLnoPop(param, gridVal, dataKey);
		 		}else if(dataKey.indexOf("eqpNm#") > -1){	// 장비명 
			 		var eqpNmVal = dataObj._state.editing[dataObj._column];
					$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
					var vTmofInfoArr = [];
					if(nullToEmpty(data.uprMtsoId) != ""){
						var vTmofInfoUpr = {mtsoId: data.uprMtsoId, mtsoNm: data.uprMtsoIdNm}
						vTmofInfoArr.push(vTmofInfoUpr);
					}
					if(data.uprMtsoId != data.lowMtsoId && nullToEmpty(data.lowMtsoId) != ""){
						var vTmofInfoLow = {mtsoId: data.lowMtsoId, mtsoNm: data.lowMtsoIdNm}
						vTmofInfoArr.push(vTmofInfoLow);
					}
		 			var param = {vTmofInfo : vTmofInfoArr, neNm : eqpNmVal, fdfAddVisible : false};

			 		searchEqpByLnoPop(param, gridVal, dataKey);		    		

		 		}else if(dataKey.indexOf("portNm#") > -1){	// 포트명(aportNm, bportNm) 
			 		var portNmVal = dataObj._state.editing[dataObj._column];
					$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
					var fieldNumVal = 0;
					if(dataKey.indexOf("aportNm#") > -1){
						fieldNumVal = dataKey.replace("aportNm#","");
					}else{
						fieldNumVal = dataKey.replace("bportNm#","");
					}
			 		var eqpIdVal = nullToEmpty(data["eqpId#"+fieldNumVal]);
			 		if(eqpIdVal==""){
		    			 alertBox('W', makeArgMsg('selectObject',cflineMsgArray['equipment'],"","","")); /*"장비(을)를 선택해 주세요.;*/
			 			return false;
			 		}
					
					var vTmofInfoArr = [];
					if(nullToEmpty(data.uprMtsoId) != ""){
						var vTmofInfoUpr = {mtsoId: data.uprMtsoId, mtsoNm: data.uprMtsoIdNm}
						vTmofInfoArr.push(vTmofInfoUpr);
					}
					if(data.uprMtsoId != data.lowMtsoId && nullToEmpty(data.lowMtsoId) != ""){
						var vTmofInfoLow = {mtsoId: data.lowMtsoId, mtsoNm: data.lowMtsoIdNm}
						vTmofInfoArr.push(vTmofInfoLow);
					}
		 			var param = {vTmofInfo : vTmofInfoArr, neId : eqpIdVal, portNm : portNmVal};

	    			$.extend(param,{"isService":true});
	    			$.extend(param,{"svlnNo": data.svlnNo});
	    			$.extend(param,{"svlnLclCd": data.svlnLclCd});
	    			$.extend(param,{"svlnSclCd": data.svlnSclCd});
		 			
			 		searchPortByLnoPop(param, gridVal, dataKey);
			 		
		 		}
		 		return false;
			}	
	 		if( $("#tmpEditPsblGbnVal").val()=="I") {
	 			if (object.mapping.key == "rnmPortIdNm" || object.mapping.key == "rnmEqpIdNm") {
	 				openRmEqpPortPop(gridVal, e);   
	 			}
	 		}
	};
	
	// RM 장비 포트 찾기 팝업 호출, RM 선번에 전달 함수   
	function openRmEqpPortPop(gridVal, e){
		if( $("#tmpEditPsblGbnVal").val()=="L" ){
			return false;
		}
		var dataObj = AlopexGrid.parseEvent(e).data;
	 	var dataKey = dataObj._key;

	 	if (dataKey == "rnmEqpIdNm" || dataKey == "cotEqpNm" ) {  // RM장비찾기 팝업
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
	 		var tmpRmEqpIdNm = null;
	 		if(dataKey == "rnmEqpIdNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	 		} else if(dataKey == "cotEqpNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.cotEqpNm);
	 		}
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == ""){
	   			if(dataKey == "rnmEqpIdNm") {
	   				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/	
	   			} else if(dataKey == "cotEqpNm" && dataObj.svlnNetDivCd == '002' ) {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['equipmentName'],"","","")); /*" COT장비명은필수 입력 항목입니다.;*/
	   			}
	 			return false;
	 		}    	 		
	 		var param = {"neNm" : tmpRmEqpIdNm};
	 		if(dataKey == "rnmEqpIdNm") {
	 			openRmEqpPop(gridVal, "rnmEqpId", "rnmEqpIdNm", "rnmPortId", "rnmPortIdNm", param);	
	 		} else if(dataKey == "cotEqpNm" && dataObj.svlnNetDivCd == '002') {
	 			openCotEqpPop(gridVal, "cotEqpId", "cotEqpNm","cotEqpMatchNm", "cotUlnkLftPortId", "cotUlnkLftPortNm","cotUlnkLftPortMatchNm","cotUlnkRghtPortId" ,"cotUlnkRghtPortNm" , "cotUlnkRghtPortMatchNm",param);
	 		}
	 	} else if (dataKey == "rnmPortIdNm" || dataKey == "cotUlnkLftPortNm" || dataKey == "cotUlnkRghtPortNm") {  // RM포트찾기 팝업
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
	 		var tmpRmEqpIdNm = null;
	 		var tmpRmEqpId = null;
	 		var searchPortNm = null;
	 		if(dataKey == "rnmPortIdNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
		 		tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
		 		searchPortNm = nullToEmpty(dataObj.rnmPortIdNm);	
	 		} else if(dataKey == "cotUlnkLftPortNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.cotEqpNm);
		 		tmpRmEqpId = nullToEmpty(dataObj.cotEqpId);
		 		searchPortNm = nullToEmpty(dataObj.cotUlnkLftPortNm);
	 		} else if(dataKey == "cotUlnkRghtPortNm") {
	 			tmpRmEqpIdNm = nullToEmpty(dataObj.cotEqpNm);
		 		tmpRmEqpId = nullToEmpty(dataObj.cotEqpId);
		 		searchPortNm = nullToEmpty(dataObj.cotUlnkRghtPortNm);
	 		}
	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == "" || tmpRmEqpId == ""){
	   			if(dataKey == "rnmPortIdNm") {
	   				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/	
	   			} else if( (dataKey == "cotUlnkLftPortNm" || dataKey == "cotUlnkRghtPortNm") && dataObj.svlnNetDivCd == '002') {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['equipmentName'],"","","")); /*" COT장비명은필수 입력 항목입니다.;*/
	   			}
	 			return false;
	 		}    	 		
	   		if(searchPortNm == ""){
	   			if(dataKey == "rnmPortIdNm") {
	   				alertBox('W', makeArgMsg('required',cflineMsgArray['rmPortNm'],"","","")); /*" RM포트명은필수 입력 항목입니다.;*/	
	   			} else if(dataKey == "cotUlnkLftPortNm" && dataObj.svlnNetDivCd == '002') {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['portName']+"#1","","","")); /*" COT포트명#1은필수 입력 항목입니다.;*/
	   			} else if(dataKey == "cotUlnkRghtPortNm" && dataObj.svlnNetDivCd == '002') {
	   				alertBox('W', makeArgMsg('required',"COT"+cflineMsgArray['portName']+"#2","","","")); /*" COT포트명#2은필수 입력 항목입니다.;*/
	   			}
	 			return false;
	 		}    	 		
	 		$("#"+gridVal).alopexGrid("startEdit");
	 		if(dataKey == "rnmPortIdNm") {
	 			openRmPortPop(gridVal, "rnmPortId", "rnmPortIdNm", tmpRmEqpId, searchPortNm)
	 		} else if(dataKey == "cotUlnkLftPortNm" && dataObj.svlnNetDivCd == '002' ) {
	 			openCotPortPop(gridVal, "cotUlnkLftPortId", "cotUlnkLftPortNm", "cotUlnkLftPortMatchNm", tmpRmEqpId, searchPortNm)
	 		} else if(dataKey == "cotUlnkRghtPortNm" && dataObj.svlnNetDivCd == '002' ) {
	 			openCotPortPop(gridVal, "cotUlnkRghtPortId", "cotUlnkRghtPortNm","cotUlnkRghtPortMatchNm", tmpRmEqpId, searchPortNm)
	 		}
	 	} else if (dataKey == "rnmPortChnlVal") {  // RM 채널 
	 		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
	 		var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	 		var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
	 		var tmpPortNm = nullToEmpty(dataObj.rnmPortIdNm);
	 		var tmpPortId = nullToEmpty(dataObj.rnmPortId);
	 		var tmpPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);

	 		$("#"+gridVal).alopexGrid("startEdit"); 
	   		if(tmpRmEqpIdNm == "" || tmpRmEqpId == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmEquipmentNm'],"","","")); /*" RM장비명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
	   		if(tmpPortNm == "" || tmpPortId == ""){
				alertBox('W', makeArgMsg('required',cflineMsgArray['rmPortNm'],"","","")); /*" RM포트명은필수 입력 항목입니다.;*/  
	 			return false;
	 		}    	 		
//	   		if(tmpPortChnlVal == ""){
//				alertBox('W', makeArgMsg('required',cflineMsgArray['rmChannelName'],"","","")); /*" RM채널명은필수 입력 항목입니다.;*/  
//	 			return false;
//	 		}    	
	   		showServiceLIneInfoPop( gridVal, dataObj, "Y");
	 	}
	}
	function srvcPopup( popId, url, paramData, widthVal, heightVal, titleStr){
		var heightValue = window.innerHeight * 0.9;
		if(heightVal != null && heightVal>0){
			heightValue = heightVal;
		}
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: $('#ctx').val() + url,
			data: paramData,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				if(popId == "popServcieLineBtsWrite"){

					if(data != null){
						if(data.Result == "Success"){
							if(data.openTaskVO != null){
					    		cflineHideProgressBody();
								var resultMsg = cflineMsgArray['saveSuccess']; /* 저장을 완료 하였습니다. */
					    		if(data.useTieList != null && data.useTieList.length > 0){
					    			resultMsg += "<br>" + cflineMsgArray['existLineTieUse']/*"다른 회선에서 사용중인 TIE 정보가 존재합니다."*/;
					    		}
					    		callMsgBox('', 'I', resultMsg, function() {
						    		$("#schFieldNm").setSelected("jobTitle");
						    		$("#schFieldVal").val(data.openTaskVO.jobTitle);
						    		//data.useTieList
						    		if(data.useTieList != null && data.useTieList.length > 0){
										// TODO 팝업창 띄울것 	
						    			var popUseTieList = $a.popup({
						        		  	title: cflineMsgArray['usedTieInfo']/*"사용중인 TIE 정보"*/,
						        			url: $('#ctx').val() + "/configmgmt/cfline/OpenTaskTieUseInfoPop.do",
						        			data: data,
						        			iframe: true,
						        			modal: true,
						        			movable:false,
						        			windowpopup : false,
						        			width : 900,
						        			height : 500,
						        			callback:function(data){
						        				searchProc();
						        			}						        			
						        		});	
						    			
						    		}else{
				        				searchProc();
						    		}						    		
					    		}); 								
							}
						} else if (data.Result == "Fail") {
				    		cflineHideProgressBody();
							alertBox('I', cflineMsgArray['saveFail'] /* 저장을 실패 하였습니다. */); 
						}
					}
				}
				// 다른 팝업에 영향을 주지않기 위해
				//$.alopex.popup.result = null;				
			}
		}); 		

	} 
	
	function srvcPopup2( popId, url, paramData, widthVal, heightVal, titleStr){
		var heightValue = window.innerHeight * 0.9;
		if(heightVal != null && heightVal>0){
			heightValue = heightVal;
		}
		$a.popup({
		  	popid: popId,
		  	title: titleStr,
			url: $('#ctx').val() + url,
			data: paramData,
		    //iframe: false,
			iframe: true,
			modal: false,
			movable:true,
			windowpopup : true,
			width : widthVal,
			height : heightValue,
			callback:function(data){
				if(popId == "svlnMtsoUpdatePop"){
					if(data != null){
			    		if(data == "Success"){
			    			callMsgBox('', 'I', cflineMsgArray['saveSuccess'], function() { /* 저장을 완료 하였습니다.*/
				    	     	searchProc();
			    			});
 			    			
			    		} else if (data == "Fail") {
			    			alertBox('W', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			    		}			    		
			    		else{
			    			
			    		}
					}
				}

				// 다른 팝업에 영향을 주지않기 위해
				//$.alopex.popup.result = null;
			}
		});
	}
	
	/*
	 * 조회 함수
	 */
	function searchProc(){
		totalCnt = 0;
		taskMaxnumber = 0;
		preSchParam = null;
		preSchDataCnt = 0;
		schScrollBottom = true;
		$("#firstRow01").val(1);
     	$("#lastRow01").val(pageForCount); // 페이징개수
		$("#firstRowIndex").val(1);
     	$("#lastRowIndex").val(pageForCount); // 페이징개수
//
//    	var param =  $("#searchForm").serialize();

		
		// 선번작업 탭에서 기본정보, 선번정보 Radio 버튼 checked 처리를 위한 값 세팅 
		fnSetEditPsblCheckedVal();
		var params =  $("#searchForm").getData(); 
   		if(nullToEmpty(params.schFieldNm) == ""){
   			alertBox('W', makeArgMsg("required", cflineMsgArray['searchItem']/*"검색항목"*/, null, null, null)); /* [{0}] 필수 입력 항목입니다.*/
        	return;
   		}			

   		if(nullToEmpty(params.schFieldNm) == "jobTitle"){
   			schDivVal = "";
   			params.tmofCd = "";
   			params.cmplFieldSchYnVal = "Y";
   			params.jobTitle = params.schFieldVal;   

   	    	// 작업요청일 체크 박스에 체크가 아닌경우 빈값 세팅
   	    	if($('#jobReqDtYn').getValues() != "Y"){
   	   			params.jobReqDtStart = "";
   	   			params.jobReqDtEnd = "";
   	    	};
//   			console.log(params);
   	   		cflineShowProgressBody();
   			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentaskreqlist', params, 'GET', 'searchAllTask');
   		}else{
//   	   		if(nullToEmpty(params.schFieldNm) != "jobTitle" && params.schFieldVal.length < 4){
//   	   			alertBox('W', makeArgMsg("minLenStrPossible", "4", null, null, null)); /*{0}자 이상 입력하세요. */
//   	        	return;
//   	   		}			
   			var tmpTmofCdStr = "";
   			schDivVal = "S";
   			params.jobTitle = "";
   			params.schDivVal = schDivVal;
   			params.jobReqDtStart = "";
   			params.jobReqDtEnd = "";
   			if(nullToEmpty(params.tmofCd) != ""){
   				for(var i=0; i<params.tmofCd.length; i++){
   					if(tmpTmofCdStr == ""){
   						tmpTmofCdStr = params.tmofCd[i];
   					}else{
   						tmpTmofCdStr += (","+params.tmofCd[i]);
   					}
   				}
   			}
   			params.tmofCd = tmpTmofCdStr;
   	   		cflineShowProgressBody();
//   			console.log(params);
    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentasksvlnlist', params, 'GET', 'searchLineTask');
   		}
//	   		console.log(params);
    	
	}
	

	/*
	 * 스크롤 페이지 데이터 조회  
	 */
	function searchForPageAdd(nFirstRowIndex, nLastRowIndex, searchGubun){
		if(schDivVal == "S"){
			$("#firstRow01").val(nFirstRowIndex);
			$("#lastRow01").val(nLastRowIndex); 
			$("#firstRowIndex").val(nFirstRowIndex);
			$("#lastRowIndex").val(nLastRowIndex);   		
			var dataParams = preSchParam;
			dataParams.firstRowIndex = nFirstRowIndex;
			dataParams.lastRowIndex = nLastRowIndex;
	    	if(schScrollBottom){
	        	cflineShowProgress(gridIdTask);
	    		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentasksvlnlist', dataParams, 'GET', searchGubun);
	    	}
		}
	}	
	
	function successCallback(response, status, jqxhr, flag){
    	if(flag == 'searchAllTask'){    		
    		if(response.reqList != null && response.reqList.length == 1 ){
    			// 회선조회 
    			//var param = {svlnSclCd: response.reqList[0].svlnSclCd, tmofCd: response.openTaskSrchVO.tmofCd, jobId:response.reqList[0].jobId};
    			var param = response.openTaskSrchVO;
    			param.jobId = response.reqList[0].jobId;
    			param.tmofCd = "";
    			$('#jobId').val(param.jobId);
	    		$("#schFieldVal").val(response.reqList[0].jobTitle);
        		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentasksvlnlist', param, 'GET', 'searchLineTask');
    		}else if(response.reqList != null && response.reqList.length > 1 ){
				//cflineHideProgressBody();
    			var param = response.openTaskSrchVO;
    			var popServcieLineBtsJobList = $a.popup({
        		  	//popid: "popServcieLineBtsJobList",
        		  	title: cflineMsgArray['btsLineJobList']/*"기지국회선 작업 목록"*/,
        			url: $('#ctx').val() + "/configmgmt/cfline/ServiceLineBtsJobListPop.do",
        			data: response,
        			iframe: true,
        			modal: true,
        			movable:false,
        			windowpopup : false,
        			width : 800,
        			height : 500,
        			callback:function(data){
    					if(data != null){
				    		$("#schFieldNm").setSelected("jobTitle");
				    		$("#schFieldVal").val(data.jobTitle);
    		    			param.jobId = data.jobId;	
    		    			$('#jobId').val(param.jobId);		
    		    			cflineShowProgressBody();
    		        		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/getopentasksvlnlist', param, 'GET', 'searchLineTask');
    					}
        			},errorCallback:function(data){
        			}
        			
        		});
    		}else{
    			cflineHideProgressBody();
    			alertBox('I', cflineMsgArray['noInquiryData'] /* 조회된 데이터가 없습니다. */); 
    		}	
    	}  
    	if(flag == 'searchLineTask'){	
    		getGrid(svlnLclCd, svlnSclCd, response, gridIdTask);
    		cflineHideProgressBody();
			preSchParam = response.schParam;
//			console.log(preSchParam);
    		if(response.totalCnt > 0 ){
    			$('#btnExportExcel').setEnabled(true);
    	    	$('#taskTotalCntSpan').text("("+getNumberFormatDis(response.totalCnt)+")");
    	    	preSchDataCnt = response.totalCnt;
    		}else{
    			$('#taskTotalCntSpan').text("");
    			schScrollBottom = false;
				preSchDataCnt = 0;
    			alertBox('I', cflineMsgArray['noInquiryData']); /* 조회된 데이터가 없습니다.*/
    		}   	
    		setSPGrid(gridIdTask, response.ServiceLineTaskList, response.totalCnt);
    	}  	

    	if(flag == 'searchForPageAdd'){
    		cflineHideProgress(gridIdTask);
			if(response.ServiceLineTaskList.length == 0){
				schScrollBottom = false;
				return false;
			}else{
        		getGrid(svlnLclCd, svlnSclCd, response, gridIdTask);
	    		$('#'+gridIdTask).alopexGrid("dataAdd", response.ServiceLineTaskList);
			}
    	}    	
    	
    	
    	// 전송실 
		if(flag == 'tmofCmCdData') {			
			var mgmtCdValue = "0001";
			var tmofCd_option_data =  [];
			var tmpTmofCd = "";
//			if(tomfHeaderYn == "Y"){
//				tmofCd_option_data.push(selPrePendTmof);
//			}
			
			for(k=0; k<response.tmofCdList.length; k++){
				var dataTmof = response.tmofCdList[k];  
				if(mgmtCdValue == dataTmof.mgmtGrpCd){
					if(tmpTmofCd ==""){
						tmpTmofCd = dataTmof.value;
					}
					tmofCd_option_data.push(dataTmof);
				}
			}
			$('#tmofCd').clear();
			$('#tmofCd').setData({data : tmofCd_option_data});
//			console.log("tmpTmofCd="+tmpTmofCd);
			$('#tmofCd').setData({tmofCd:tmpTmofCd});
	    	 // 사용자 소속 전송실
	    	searchUserJrdtTmofInfo("tmofCd");			
		}    	
    	
		// 서비스 회선에서 사용하는 대분류, 소분류, 회선유형 코드
		if(flag == 'svlnLclSclCodeData') {	
			svlnLclSclCodeData = response;
			var svlnLclCd_option_data =  [];
			var tmpFirstSclCd = "";
			for(i=0; i<response.svlnLclCdList.length; i++){
				var dataL = response.svlnLclCdList[i]; 
				if(i==0){
					tmpFirstSclCd = dataL.value;
				}
				if("001" == nullToEmpty(dataL.value) ){
					svlnLclCd_option_data.push(dataL);
				}
				
			}
			$('#svlnLclCd').clear();
			$('#svlnLclCd').setData({data : svlnLclCd_option_data});
			

			var svlnSclCd_option_data =  [];
			
			
			var svlnLclCdStr = "001,003,010,011,012,013,014";
			for(k=0; k<response.svlnSclCdList.length; k++){
				var dataOption = response.svlnSclCdList[k]; 
				if(svlnLclCdStr.indexOf(nullToEmpty(dataOption.value)) > -1){
					svlnSclCd_option_data.push(dataOption);
				}				
			}		
			$('#svlnSclCd').clear();
			$('#svlnSclCd').setData({data : svlnSclCd_option_data});
			
			// 서비스회선유형코드 셋팅
			svlnTypCdListCombo = response.svlnTypCdListCombo;
		} 
		// 서비스 회선에서 사용하는 코드
		if(flag == 'svlnCommCodeData') {
			
			var tmpCmCodeData =  JSON.parse(JSON.stringify(response));

			var dataFst = {"value":"","text":cflineCommMsgArray['select']};
//			var dataMandatory = {"value":"","text":cflineCommMsgArray['mandatory']};
			var option_data =  [];
			option_data = tmpCmCodeData.svlnStatCdList;
			option_data.unshift(dataFst);

//			cmCodeData = {"svlnStatCdList":option_data};  // 서비스회선상태
			$.extend(cmCodeData,{"svlnStatCdList":option_data});		 // 서비스회선상태
			option_data =  [];
			option_data = tmpCmCodeData.lineUsePerdTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineUsePerdTypCdList":option_data});		 // 회선사용기간유형	
			option_data =  [];
			option_data = tmpCmCodeData.svlnCapaCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"svlnCapaCdList":option_data});		 // 회선용량	
			option_data =  [];
			option_data = tmpCmCodeData.ynList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"ynList":option_data});		 // 예,아니오
			option_data =  [];
			option_data = tmpCmCodeData.lineDistTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineDistTypCdList":option_data});		 // 회선거리유형
			option_data =  [];
			option_data = tmpCmCodeData.lineSctnTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineSctnTypCdList":option_data});		 // 회선구간유형
			option_data =  [];
			option_data = tmpCmCodeData.chrStatCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"chrStatCdList":option_data});		 // 과금상태
			option_data =  [];
			option_data = tmpCmCodeData.lineMgmtGrCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lineMgmtGrCdList":option_data});		 // 회선관리등급
			option_data =  [];
			option_data = tmpCmCodeData.ogicCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"ogicCdList":option_data});		 // OG/IC
			

			option_data =  [];
			option_data = tmpCmCodeData.lesTypeCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"lesTypeCdList":option_data});		 // 임차유형
			option_data =  [];
			option_data = tmpCmCodeData.svlnB2bCapaCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"svlnB2bCapaCdList":option_data});		 // B2B 서비스회선 용량
			option_data =  [];
			option_data = tmpCmCodeData.llcfCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"llcfCdList":option_data});		 // 국사LLCF
			option_data =  [];
			option_data = tmpCmCodeData.negoCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"negoCdList":option_data});		 // 국사NEGO
			option_data =  [];
			option_data = tmpCmCodeData.mgmtPostCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"mgmtPostCdList":option_data});		 // 관리포스트
			option_data =  [];
			option_data = tmpCmCodeData.cdngMeansTypCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"cdngMeansTypCdList":option_data});		 // 코딩방식유형
			option_data =  [];
			option_data = tmpCmCodeData.coLineCostVrfRsnCdList;
			option_data.unshift(dataFst);			
			$.extend(cmCodeData,{"coLineCostVrfRsnCdList":option_data});		 // 비대상사유
//			cmCodeData.push(tmpCmCodeData);
			svlnCommCodeData = response;
		} 		
		
		if(flag == 'excelDownload') {
			cflineHideProgressBody();
    		
    		var $form=$('<form></form>');
			$form.attr('name','downloadForm');
			$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/exceldownload");
			$form.attr('method','GET');
			$form.attr('target','downloadIframe');
			// 2016-11-인증관련 추가 file 다운로드시 추가필요 
			$form.append(Tango.getFormRemote());
			$form.append('<input type="hidden" name="fileName" value="'+response.fileName+'" /><input type="hidden" name="fileExtension" value="'+response.fileExtension+'" />');
			$form.appendTo('body');
			$form.submit().remove();
    	}
		if(flag == 'excelBatchExecute') {
//			console.log(response);
    		if(response.returnCode == '200'){ 
    				
    			jobInstanceId  = response.resultData.jobInstanceId;
    			cflineHideProgressBody();
    			$('#excelFileId').val(response.resultData.jobInstanceId );
    			excelCreatePop(jobInstanceId);
    		}
    		else if(response.returnCode == '500'){ 
    			cflineHideProgressBody();
    	    	alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다. */
    		}
    	}
		//작업정보저장
		if(flag == 'workUpdate' ){
			if (response.Result == "Success") {
				
				// FDF사용정보 전송
				sendFdfUseInfo("B");
				
				callMsgBox('', 'I', makeArgMsg('processed', response.upCount ,"","",""), function() { /* ({0})건 처리 되었습니다. */
					searchProc();
				});
			} else {
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			}
			
		}
		// 선번 저장 
    	if(flag == 'saveTaskLno'){
    		cflineHideProgressBody();
			if (nullToEmpty(response.Result) == "Success") {
	        	// 선번정보 변경에 대한 GIS FDF 호출
				if(nullToEmpty(response.fdfPathLineNoStr) != ""){
					var fdfUsingInoPathLineNo = nullToEmpty(response.fdfPathLineNoStr);
					sendFdfUseInfoCommon(fdfUsingInoPathLineNo, "S", "E", null);
					
					/* 2018-08-13 엑셀업로드로 선번정보가 수정된건 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
					var acceptParam = {
							 lineNoStr : fdfUsingInoPathLineNo
						   , topoLclCd : ""
						   , linePathYn : "Y"
						   , editType : "E"   // 편집
						   , excelDataYn : "Y"
					}
					extractAcceptNtwkLine(acceptParam);
				}	
				
				if (nullToEmpty(response.resultCd) == "OK") {
	        		msg = cflineCommMsgArray['normallyProcessed']; /* 정상적으로 처리되었습니다. */
					msg += "<br>("+cflineCommMsgArray['success'] +" : " + response.excelOkCount + cflineCommMsgArray['singleCount'] + ")";					
					callMsgBox('', 'I', msg, function() { /* 정상적으로 처리되었습니다. */
						searchProc();
					});
				}else if (nullToEmpty(response.resultCd) == "NG") {
					msg = cflineCommMsgArray['existFailUploadData']; /* 업로드에 실패한 데이터가 있습니다. */
					if (response.errorCd == "DATA_CHECK_ERROR") {
						msg += "<br>(";
						if (nullToEmpty(response.excelOkCount) != ''  && response.excelOkCount !='0') {
							msg += cflineCommMsgArray['success'] + " : " + response.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
						}
						msg += cflineCommMsgArray['failure'] + " : " + response.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
					}					
					callMsgBox('', 'I', msg, function() { 
						var $form=$('<form></form>');
						$form.attr('name','downloadForm');
						$form.attr('action',"/tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/exceldownload");
						$form.attr('method','GET');
						$form.attr('target','downloadIframe');
						// 2016-11-인증관련 추가 file 다운로드시 추가필요 
						$form.append(Tango.getFormRemote());
						$form.append('<input type="hidden" name="fileName" value="' + (response.fileNames + "." + response.extensionNames) + '" />');
						$form.append('<input type="hidden" name="fileExtension" value="' + response.extensionNames + '" />');
						$form.append('<input type="hidden" name="type" value="excelUploadFailFile" />');
						$form.appendTo('body');
						$form.submit().remove();	
					});	
				}
			}else{
				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/
			}
    	}
		
    	//TASK 완료 
    	if(flag == 'saveTaskComplete'){
    		cflineHideProgressBody();
    		if (response.Result == "Success") {
				fdfUsingInoLineNo = "";
				if(nullToEmpty(response.fdfSvlnNoStr) != ""){
					fdfUsingInoLineNo = nullToEmpty(response.fdfSvlnNoStr);
					sendFdfUseInfo("B");
				}
				
				// 해지 회선 선번
				if(nullToEmpty(response.fdfTrmntSvlnNoStr) != ""){
					var fdfTrmntSvlnNo = nullToEmpty(response.fdfTrmntSvlnNoStr);
					/* 2018-08-13 해지된 회선 중 자동수정 대상에 속한 네트워크는 대상 테이블에서 삭제*/
					var acceptParam = {
							 lineNoStr : fdfTrmntSvlnNo
						   , topoLclCd : ""
						   , linePathYn : "Y"
						   , editType : "C"   // 해지
						   , excelDataYn : "N"
					}
					extractAcceptNtwkLine(acceptParam);
				}				
				
				callMsgBox('', 'I', cflineMsgArray['normallyProcessed'], function() {  /* 정상적으로 처리되었습니다. */
					searchProc();  // TASK 완료 후 조회 함수 호출
				});	
    		}else if (response.Result == "Error") {
	  			if(response.errGb == "PATH") { // 선번 
	  				if(response.pathList != null && response.pathList.length > 0){
	  		    		var paramPathData = {"pathList":response.pathList,"selectedJobTitle":selectedJobTitle};
	  		    		$a.popup({
	  		    		  	popid: "popOpenTaskCmplPathError",
	  		    		  	title: cflineMsgArray['lnoErrorLine'] /* 선번 오류 회선 */,
	  		    			url: $('#ctx').val() + "/configmgmt/cfline/OpenTaskCmplPathErrorPop.do",
	  		    			data: paramPathData,
	  		    			iframe: true,
	  		    			modal: false,
	  		    			movable:true,
	  		    			windowpopup : true,
	  		    			width : 1000,
	  		    			height : 500,
	  		    			callback:function(data){
	  							if(data != null){
	  							}
	  		    			}
	  		    		});  	  					
	  				}else{
		  				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
	  				}
	  			}else if(response.errGb == "LINE") {
	  				var resultLineNm = "";
	  				if(response.nameList != null && response.nameList.length > 0){
	  					for(var i=0; i<response.nameList.length; i++){
	  							resultLineNm = resultLineNm + "<br>" + response.nameList[i].lineNm
	  					}
	  				}
	  				alertBox('I', cflineMsgArray['duplLineNmInLineNm'] + resultLineNm); /* 중복된 회선명이 존재합니다. 다른 회선명을 입력해 주세요. */
	  			}else{
	  				alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
	  			}
    		}else{
    			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		}

    		if(nullToEmpty($("#tmpEditPsblGbnVal").val())=="I"){
    			$("#"+gridIdTask).alopexGrid("startEdit");
    		}
    	}
	}
    
	//request 실패시.
    function failCallback(response, status, flag){
		if(flag == 'excelDownload') {
			cflineHideProgressBody();
		}
    	if(flag == 'searchAllTask'){
    		cflineHideProgressBody();
    		//alert('조회 실패하였습니다.');
    		alertBox('I', cflineMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
    	}
		//작업정보저장
		if(flag == 'workUpdate' ){
			alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다.*/			
		}   
		// 선번 저장 
    	if(flag == 'saveTaskLno'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    	}
    	//TASK 완료 
    	if(flag == 'saveTaskComplete'){
    		cflineHideProgressBody();
    		alertBox('I', cflineMsgArray['saveFail']); /* 저장을 실패 하였습니다. */
    		if(nullToEmpty($("#tmpEditPsblGbnVal").val())=="I"){
    			$("#"+gridIdTask).alopexGrid("startEdit");
    		}
    	}
		
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
    
    function setSPGrid(GridID , Data, totalCnt, prntCnt) {
		$('#'+GridID).alopexGrid("dataSet", Data);
		$('#'+GridID).alopexGrid('updateOption',
				{paging : {pagerTotal: function(paging) {
					if(totalCnt > 0){
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(totalCnt);
					}else{
						return cflineCommMsgArray['totalCnt']/*총 건수*/ + ' : ' + getNumberFormatDis(totalCnt);
					}
				}}}
		); 
		if(editPsblGbnSelectVal == "I"){
			// 선번작성(Task) 그리드 편집모드 활성화 
			// 기본정보
			$("#"+gridIdTask).alopexGrid("startEdit");
		}else{
			// 선번정보
			$("#"+gridIdTask).alopexGrid("endEdit");
		}    				
	}
    //구선번 편집 팝업
    function showServiceLineEditPop(gridId, dataObj, sFlag){
		var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do';
		var width = 1400;
//		var height = 940;
		var height = 780;
		
		if(dataObj.svlnLclCd =="001" && dataObj.svlnSclCd == "020"){
			url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineIpTransLineInfoPop.do';
			width = 1000;
			height = 300;
		}
		
		var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
		if (lineLnoGrpSrno == undefined){
			lineLnoGrpSrno =null;
		}
		

		var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
		var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
		var tmpPortId = nullToEmpty(dataObj.rnmPortId);
		var tmpPortIdNm = nullToEmpty(dataObj.rnmPortIdNm);
		var tmpPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
		var paramData = {
							"gridId" : gridId
							, "ntwkLineNo" : dataObj.svlnNo
							, "svlnLclCd" : dataObj.svlnLclCd
							, "svlnSclCd" : dataObj.svlnSclCd
							, "sFlag" : sFlag
							, "ntwkLnoGrpSrno" : lineLnoGrpSrno
							, "mgmtGrpCd" : dataObj.mgmtGrpCd 
							, "rnmEqpId" : tmpRmEqpId 
							, "rnmEqpIdNm" : tmpRmEqpIdNm 
							, "rnmPortId" : tmpPortId 
							, "rnmPortIdNm" : tmpPortIdNm 
							, "rnmPortChnlVal" : tmpPortChnlVal 
						};
		
		$a.popup({
			popid: "ServiceLineEditPop",
//			popid: "ServiceLIneInfoPop",
			title: cflineMsgArray['serviceLineDetailInfo'] /*서비스회선상세정보*/,
			url: url,
			//data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":sFlag},
			data: paramData,
			iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
//			height : window.innerHeight * 0.91
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
    }
    
    // 1. [수정] RM선번편집 창 자동열기
    function openRmLinePop(dataObj) {
		url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPopNew.do';
		width = 1400;
		height = 940;
		
		var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
		if (lineLnoGrpSrno == undefined){
			lineLnoGrpSrno =null;
		}
				
		var rnmEqpId = nullToEmpty(dataObj.rnmEqpId);
		var rnmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
		var rnmPortId = nullToEmpty(dataObj.rnmPortId);
		var rnmPortIdNm = nullToEmpty(dataObj.rnmPortIdNm);
		var rnmPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
				
		var paramData = {
							"gridId" : gridIdWork
							, "ntwkLineNo" : dataObj.svlnNo
							, "svlnLclCd" : dataObj.svlnLclCd
							, "svlnSclCd" : dataObj.svlnSclCd
							, "sFlag" : "Y"
							, "ntwkLnoGrpSrno" : lineLnoGrpSrno
							, "mgmtGrpCd" : dataObj.mgmtGrpCd 
							, "rnmEqpId" : rnmEqpId 
							, "rnmEqpIdNm" : rnmEqpIdNm 
							, "rnmPortId" : rnmPortId 
							, "rnmPortIdNm" : rnmPortIdNm 
							, "rnmPortChnlVal" : rnmPortChnlVal 
						};
		// RM선번편집 직접호출여부
		paramData.rmEditYn = "Y";
		
		
		$a.popup({
			popid: "ServiceLineInfoPopNew",
			title: cflineMsgArray['serviceLineGrf'] /*서비스회선 시각화*/,
			url: url,
			data: paramData,
			iframe: true,
			modal : false,
			movable:true,
			windowpopup : true,
			width : width,
//			height : window.innerHeight * 0.91
			height : height
			,callback:function(data){
				if(data != null){
					//alert(data);
				}
			}
		});
    }
    
	// 그리드 편집모드시 달력
    function datePicker(gridId, cellId, rowIndex, keyValue){
    	$('#' + cellId + '').showDatePicker( function (date, dateStr ) {
    		var insertDate = dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
    		$('#' + gridId + '').alopexGrid("cellEdit", insertDate, {_index : { row : rowIndex }}, keyValue);
		}
    	);
    }
    
    
  //작업정보저장
    function workUpdate(){
    	var gridVal = gridIdTask;
    	
    	$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
		if( $('#'+gridVal).length == 0) return;
		var dataList = $('#'+gridVal).alopexGrid('dataGet', {_state: {selected:true}});
		var paramUsing = null;
		var paramList = [];
		var requiredColumn = rtnRequiredColumn(svlnLclCd, svlnSclCd);
		var validate = true;
		var msgStr ="";
		
		if (dataList.length > 0 ){

	    	// FDF 사용정보 
	    	fdfUsingInoLineNo = "";
	    	
			for(i=0;i<dataList.length;i++){
				$.each(requiredColumn, function(key, val){
					var value = eval("dataList[i]" + "." + key);
					if(nullToEmpty(value) == ""){
						msgStr = "<br>"+dataList[i].svlnNo + " : " + val;
						validate = false;
						return validate;
					}
				});
				
				if(!validate){
					alertBox('W', makeArgMsg('required', msgStr, "","",""));  /*필수 입력 항목입니다.[{0}]*/ 
					$('#'+gridVal).alopexGrid("startEdit");
					return;
				}
				
				if(nullToEmpty(dataList[i].pktTrkNm) == "" ) {
	    			dataList[i].pktTrkNm = null;
	    			$('#' + gridVal).alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "pktTrkNo");
					dataList[i].pktTrkMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].pktTrkNm) != "" && nullToEmpty(dataList[i].pktTrkNo) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckPwEvcNm']);  /*  PW/EVC명은 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].pktTrkNm != dataList[i].pktTrkMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckPwEvcNm']);  /*  PW/EVC명은 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotEqpNm) == "" ) {
	    			dataList[i].cotEqpNm = null;
	    			$('#' + gridVal).alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotEqpId");
					dataList[i].cotEqpMatchNm = null;
					
					dataList[i].cotUlnkLftPortNm = null;
	    			$('#' + gridVal).alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkLftPortId");
					dataList[i].cotUlnkLftPortMatchNm = null;
					
					dataList[i].cotUlnkRghtPortNm = null;
	    			$('#' + gridVal).alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkRghtPortId");
					dataList[i].cotUlnkRghtPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotEqpNm) != "" && nullToEmpty(dataList[i].cotEqpId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotEqpNm']);  /*  COT장비는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotEqpNm != dataList[i].cotEqpMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotEqpNm']);  /*  COT장비는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotUlnkLftPortNm) == "" ) {
	    			dataList[i].cotUlnkLftPortNm = null;
	    			$('#' + gridVal + '').alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkLftPortId");
					dataList[i].cotUlnkLftPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotUlnkLftPortNm) != "" && nullToEmpty(dataList[i].cotUlnkLftPortId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);   /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotUlnkLftPortNm != dataList[i].cotUlnkLftPortMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);  /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		
	    		if(nullToEmpty(dataList[i].cotUlnkRghtPortNm) == "" ) {
	    			dataList[i].cotUlnkRghtPortNm = null;
	    			$('#' + gridVal).alopexGrid("cellEdit", null, {_index : { row : dataList[i]._index.row }}, "cotUlnkRghtPortId");
					dataList[i].cotUlnkRghtPortMatchNm = null;
	    		}
				if( nullToEmpty(dataList[i].cotUlnkRghtPortNm) != "" && nullToEmpty(dataList[i].cotUlnkRghtPortId) == "" ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);  /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
	    		if( dataList[i].cotUlnkRghtPortNm != dataList[i].cotUlnkRghtPortMatchNm ) {
	    			alertBox('W', cflineMsgArray['CheckCotPortNm']);   /*   COT장비의 포트는 검색 후 선택하여 수정해주십시오. */
	    			$('#'+gridVal).alopexGrid("startEdit");
	    			validate = false;
	    			return validate;
	    		}
				
				paramList[i] = dataList[i];
				
				// FDF 사용정보 
		    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].svlnNo + ",";
			}
			
			paramUsing = {"serviceLineList":paramList};
			httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updateserviceline', paramUsing, 'POST', 'workUpdate');
		 }else{
			 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
			 $("#"+gridVal).alopexGrid("startEdit");
		 }
    }
    
    // 선번 저장 
    function saveTaskSvlnLno(){
    	// TODO
    	$('#'+gridIdTask).alopexGrid('endEdit', {_state:{editing:true}});
		
    	if( $('#'+gridIdTask).length == 0) {
			return false;
		}
    	
		var dataList = $('#'+gridIdTask).alopexGrid('dataGet', {_state: {selected:true}});
		var paramUsing = null;
		var lnoList = [];
		var jobIdVal = "";
		var svlnSclCdVal = "";
		var maxLnoNumVal = 0;
		if (dataList.length == 0 ){
			 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */
			return false;
		}

    	// FDF 사용정보 
    	fdfUsingInoLineNo = "";

		var ntwkLineNmVal = "";
		var ringLineNmVal = "";
		var eqpNmVal = "";
		var aportNmVal = "";
		var bportNmVal = "";
		var lnoData = null;
		for(i=0;i<dataList.length;i++){
			var lnoNumVal = 0;
			if(i==0){
				jobIdVal = dataList[i].jobId;
				svlnSclCdVal = dataList[i].svlnSclCd;
			}
			
			//선번 개수 만큼 작업
			lnoData = {"svlnNo": dataList[i].svlnNo };
			
			for(j=0; j<taskMaxnumber; j++){
				var ntwkLineNmVal = nullToEmpty(dataList[i]["useTrkNtwkLineNm#" + j]);
				var ringLineNmVal = nullToEmpty(dataList[i]["useRingNtwkLineNm#" + j]);
				var eqpNmVal = nullToEmpty(dataList[i]["eqpNm#" + j]);
				var aportNmVal = nullToEmpty(dataList[i]["aportNm#" + j]);
				var bportNmVal = nullToEmpty(dataList[i]["bportNm#" + j]);				
				if(ntwkLineNmVal != "" || ringLineNmVal != "" || eqpNmVal != "" || aportNmVal != "" || bportNmVal != ""){
					lnoNumVal = j+1;
					
					/*
					########################중요 사항################################
						그리드에 복사로 입력하면 "\n"과 " " 이 추가 되는 현상이 발생함.
						따라서 아래와 같이 해당값을 없애는 기능을 추가함. 
					########################중요 사항################################
					 */
					lnoData["useTrkNtwkLineNm#" + j] = replaceToEmpty(ntwkLineNmVal);
					lnoData["useRingNtwkLineNm#" + j] = replaceToEmpty(ringLineNmVal);
					
					lnoData["eqpNm#" + j] = replaceToEmpty(eqpNmVal);
					lnoData["aportNm#" + j] = replaceToEmpty(aportNmVal);
					lnoData["bportNm#" + j] = replaceToEmpty(bportNmVal);
				}else{
					break;
				}				
			}
			if(lnoNumVal == 0){
				alertBox('I', cflineMsgArray['noInsertLno']);/* 입력된 선번이 없습니다. */
				return false;
			}
			// 최대 선번값 세팅
			if(maxLnoNumVal < lnoNumVal){
				maxLnoNumVal = lnoNumVal;
			}
			lnoList.push(lnoData);

//	    	fdfUsingInoLineNo = fdfUsingInoLineNo + dataList[i].svlnNo + ",";
		}			
		paramUsing = {"openTaskYn": "Y", "lnoChkYn": "Y", "lineSctnLnoYn": "Y", "lnoGubunVal": "N", "jobId": jobIdVal
						, "svlnLclCd": "001", "svlnSclCd": svlnSclCdVal, "maxLnoNum": maxLnoNumVal, "nodeLnoList": lnoList};
		cflineShowProgressBody();
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/servicelineexcel/savetasklno', paramUsing, 'POST', 'saveTaskLno');

    }
        
    // 필수컬럼을 회선구분에 따라 리턴해주는 함수
    function rtnRequiredColumn(svlnLclCd, svlnSclCd){
    	var requiredColumn = null
    	//여기서부터 대분류 코드, 소분류코드에 따른 필수컬럼을 체크해준다.
    	//미지정
    	if(svlnLclCd == '000') {
			requiredColumn = 
			{ 
	    		lineNm : cflineMsgArray['lnNm'] /*  회선명 */
				, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode']
				, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
				, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
				, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
				, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
				, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
				, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
				, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
				, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
				, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
				,lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
			};
    	}
    	//기지국회선
    	if(svlnLclCd == '001') {
    		if(svlnSclCd == '001'){
				requiredColumn = 
    				{ 
    		    		lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
    					, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
    					, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
    					, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
    					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
    					, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
    					, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
    					, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
    					, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
    					, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
    					, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    					, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
    				};
    		}else if (svlnSclCd == '016'){
	    			requiredColumn = 
	    			{ 
	    					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
	    					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
		    			 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
	    					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
		    			 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
		    			 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
		    			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
		    			 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
	    			};
    		}else if (svlnSclCd == '003'){
    			requiredColumn = 
    			{ 
    					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
	    			 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
	    			 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */ 
	    			 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
    					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
	    			 	, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
	    			 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
	    			 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
	    			 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
	    			 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
	    			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
	    			 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
    			};
    		}else if (svlnSclCd == '020') {
    			requiredColumn = 
    			{ 
    					lineUsePerdTypCd : cflineMsgArray['lineUsePeriodType'] /*회선사용기간유형*/
    			};
    		}else{
    			requiredColumn = 
    			{ 
    					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
						, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
					 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
					 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */ 
					 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
						, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
					 	, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
					 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
					 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
					 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
					 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
					 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
					 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
    			};
    		}
    	}
    	//RU회선
    	if(svlnLclCd == '003') {
    		if(svlnSclCd == '101'){
        		requiredColumn =
        		{ 
						svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
        			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
        		};
    		}
    	}
    	//가입자망회선
    	if(svlnLclCd == '004') {
			requiredColumn = 
			{ 
					lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    			 	, lineUsePerdTypCd : cflineMsgArray['lineUsePeriodTypeCode'] /*회선사용기간유형코드*/
    			 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */ 
    			 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
					, svlnTypCdNm : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */
    			 	, lineCapaCdNm : cflineMsgArray['lineCapacity'] /*회선용량*/
    			 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
    			 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
    			 	, lineDistTypCd : cflineMsgArray['lineDistanceType'] /*회선거리유형*/
    			 	, lineSctnTypCd : cflineMsgArray['lineSectionType'] /*회선구간유형*/
    			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    			 	, lineMgmtGrCd : cflineMsgArray['lineManagementGrade'] /*회선관리등급*/
			};
    	}
    	//B2B
    	if(svlnLclCd == '005') {
    		if ( $('#mgmtGrpCd').val() == '0002' || svlnSclCd =="009" || svlnSclCd =="021" ) {
        		requiredColumn = 
    			{ 
    				lineNm : cflineMsgArray['lnNm'] /*  회선명 */
        			, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
				 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
				 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
	 				, svlnTypCd : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */	
		 			, lineCapaCd : cflineMsgArray['lineCapacity'] /*회선용량*/
				 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
				 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
			 		, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    			};
    		}else {
        		requiredColumn = 
    			{ 
        			lineNm : cflineMsgArray['lnNm'] /*  회선명 */
    				, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
				 	, svlnNo : cflineMsgArray['serviceLineNumber']  /*서비스회선번호*/
				 	, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */	
				 	, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
		 			, svlnTypCd : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */	
				 	, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
				 	, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
		 			, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
    			};
    		}
    	}
    	//기타회선
    	if(svlnLclCd == '006') {
    		if(svlnSclCd != '102' && svlnSclCd != '105' ){
    			if(svlnSclCd == '061'){			// 중계기 정합장치 회선
        			requiredColumn =
            		{ 
    						svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
            			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
            		};
        		} else {
        			requiredColumn = 
    				{ 
    	    				lineNm : cflineMsgArray['lnNm'] /*  회선명 */
        					, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
    	    		 		, mgmtGrpCdNm : cflineMsgArray['managementGroup'] /*  관리그룹 */
    	    				, svlnSclCdNm : cflineMsgArray['serviceLineScl'] /*  서비스회선 소분류 */
    	    		 		, svlnTypCd : cflineMsgArray['serviceLineType'] /*  서비스회선유형 */	
    	    		 		, lineCapaCd : cflineMsgArray['lineCapacity'] /*회선용량*/
    	    		 		, svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */
    	    		 		, faltMgmtObjYn : cflineMsgArray['faultManagementObjectYesOrNo'] /*고장관리대상여부*/
    	    		 		, uprMtsoIdNm : cflineMsgArray['upperMtso'] /*상위국사*/
    	    		 		, lowMtsoIdNm : cflineMsgArray['lowerMtso'] /*하위국사*/
    				};
        		}
    		}else{
        		requiredColumn =
        		{ 
    					svlnStatCd : cflineMsgArray['serviceLineStatus'] /*  서비스회선상태 */ 
        			 	, chrStatCd : cflineMsgArray['chargingStatus'] /*과금상태*/
        		};    			
    		}
    	}
    	
    	if(requiredColumn == null) {
    		requiredColumn =
    		{ 
    		};
    	}    	
    	return requiredColumn
    }

    // 선번작성(TASK) 탭의 선번해더 
    function makeHeaderTask (data, pathData){ 
    	var mapping = '';
    	var number = 0;
//    	if(pathData == null){  // 선번 데이터 가 없는 경우 
//        	return data;
//    	}

    	for(var i=0; i<data.length; i++){
			var pointPath =  null;
			if(pathData != null && pathData.length>0){
				for(var h=0; h<pathData.length; h++){
					if(data[i].svlnNo == pathData[h].svlnNo){
//						pointPath =  pathData[h].pointPath;
						pointPath =  pathData[h].nodePathList;
						break;
					}
				}
			}
			var editVal = true;
			if(nullToEmpty($('#schFieldNm').val()) != "jobTitle"){
				editVal = false;
			}
			
			if(pointPath != null && pointPath.length  > 0 ){
				for(var j=0; j<pointPath.length; j++){
					//channelDesc, portDescr
//					data[i]["useTrkNtwkLineNm#"+j] = pointPath[j].trunkName;
//					data[i]["useRingNtwkLineNm#"+j] = pointPath[j].ringName;
//					data[i]["eqpId#"+j] = pointPath[j].ne.neId;
//					data[i]["eqpNm#"+j] = pointPath[j].ne.neName;
//					data[i]["aportNm#"+j] = nullToEmpty(pointPath[j].aportDescr.portChannelDesc);
//					data[i]["bportNm#"+j] = nullToEmpty(pointPath[j].bportDescr.portChannelDesc);
					data[i]["useTrkNtwkLineNm#"+j] = nullToEmpty(pointPath[j].ntwkLineNm);
					data[i]["useRingNtwkLineNm#"+j] = nullToEmpty(pointPath[j].ringNm);
					data[i]["eqpId#"+j] = nullToEmpty(pointPath[j].eqpId);
					data[i]["eqpNm#"+j] = nullToEmpty(pointPath[j].eqpNm);
					data[i]["aportNm#"+j] = nullToEmpty(pointPath[j].lftPortChnlVal);
					data[i]["bportNm#"+j] = nullToEmpty(pointPath[j].rghtPortChnlVal);
				}
				data[i]["svlnLnoHiddenCnt"] = nullToEmpty(pointPath.length);
				number  = pointPath.length;
			}
			if (taskMaxnumber < number){
				taskMaxnumber = number;
			}
		}
    	if(taskMaxnumber<50){
    		taskMaxnumber = 50;
    	}
		mapping = returnTaskMapping;

    	for(var j=0; j < taskMaxnumber; j++){
    		var k = j +1 ; 
    		mapping.push({ key:'useRingNtwkLineNm#'+j    ,title:cflineMsgArray['ring']+'#'+k     ,align:'left', width: '180px', editable: editVal });
    		mapping.push({ key:'useTrkNtwkLineNm#'+j    ,title:cflineMsgArray['trunk']+'#'+k     ,align:'left', width: '180px', editable: editVal });
    		mapping.push({ key:'eqpId#'+j		 , title:cflineMsgArray['eqpId']+'#'+k	    	,align:'left', width: '180px', hidden: true });
    		mapping.push({ key:'eqpNm#'+j		 , title:cflineMsgArray['equipment']+'#'+k	    	,align:'left', width: '180px', editable: editVal });
    		mapping.push({ key:'aportNm#'+j		 , title:cflineMsgArray['aport']+'#'+k	    	,align:'left', width: '120px', editable: editVal });
    		mapping.push({ key:'bportNm#'+j		 , title:cflineMsgArray['bport'] +'#'+k	    	,align:'left', width: '120px', editable: editVal });
    	}
    	
    	return data;
    }       
    
    
    //배치실행 
    function funExcelBatchExecute() {
    	var dataList = $('#'+gridIdTask).alopexGrid('dataGet');
    	if(preSchParam == null || dataList ==null || dataList.length<=0){
			 alertBox('I', cflineMsgArray['noInquiryData']);/* 조회된 데이터가 없습니다. */ 
    		return;
    	}
//    	if(preSchParam.editPsblGbnVal =="L" && preSchDataCnt > 1000){
//			 alertBox('I', makeArgMsg("canotSpecialCount", cflineMsgArray['lnoInfoExcelDown']/*"선번정보 엑셀 다운로드"*/, "1000", null, null)); /* {0}은 {1}을 초과할 수 없습니다. */ 
//	   		return;
//	   	}
    	var tmofCdList = "";
    	var lenList = 0;
    	if (nullToEmpty( $("#tmofCd").val() )  != ""  ){
   			lenList = $("#tmofCd").val().length;
   			for(i=0; i<lenList; i++){
   				if(tmofCdList==""){
   					tmofCdList = nullToEmpty($("#tmofCd").val()[i]);
   				}else{
   					tmofCdList = tmofCdList + "," + nullToEmpty($("#tmofCd").val()[i]);   					
   				}

   			}
   		}else {
   			tmofCdList = "";
   		}
   		
    	var dataParamMethod = "T";   // serviceLineOmsTccExcelDownloadJob 호출을 위해 T를 세팅;

    	var dataParam = {"editPsblGbnVal":nullToEmpty(preSchParam.editPsblGbnVal),"schDivVal":nullToEmpty(preSchParam.schDivVal)
    			,"schFieldNm":nullToEmpty(preSchParam.schFieldNm),"schFieldVal":nullToEmpty(preSchParam.schFieldVal)
    			, "svlnLclCd": nullToEmpty(preSchParam.svlnLclCd)
    			, "svlnSclCd": nullToEmpty(preSchParam.svlnSclCd)
    			, "jobId": nullToEmpty(preSchParam.jobId)
    			, "firstRowIndex": nullToEmpty(preSchParam.firstRowIndex)
    			, "lastRowIndex": nullToEmpty(preSchParam.lastRowIndex)
    			};

    	$.extend(dataParam,{tmofCdStr: tmofCdList });
    	dataParam.fileExtension = "xlsx";
    	dataParam.method = dataParamMethod;
    	
     	dataParam = gridExcelColumn(dataParam, gridIdTask);
    	
//    	console.log(dataParam);
//    	console.log(preSchParam);
     	cflineShowProgressBody();
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/excelBatchExecute', dataParam, 'POST', 'excelBatchExecute');
    }
    
    // 트렁크팝업
    function searchTrunkByLnoPop(param, gridVal, dataKeyVal){
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		var TrunkListBySvlnPop = $a.popup({
		  	popid: "TrunkListBySvlnPop",  
		  	title: cflineMsgArray['trkListSearch']/*"트렁크 리스트 조회"*/,
			url: urlPath + '/configmgmt/cfline/TrunkListBySvlnPop.do',
			data: param,
    	    iframe: true,
    	    modal : true,
    	    movable : false,
 		    windowpopup : false,
 		    width : 1200,
 		    height : 720,
			callback:function(data){

				if(data != null){
		   
		    		var lnoData = getTrunkLnoFirstNode(data.lnoList, dataKeyVal);
		        	
		        	if(lnoData != null){  
	   		    		var focusData = $('#'+gridVal).alopexGrid("dataGet", {_state : {focused : true}});
	   		    		var rowIndex = focusData[0]._index.data;
			    		$('#'+gridVal).alopexGrid( "cellEdit", data.useTrnkNm, {_index : { row : rowIndex}}, "useTrkNtwkLineNm#" + lnoData.fieldNum);
			    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData.ntwkRingNm, {_index : { row : rowIndex}}, "useRingNtwkLineNm#" + lnoData.fieldNum);
			    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData.ntwkEqpId, {_index : { row : rowIndex}}, "eqpId#" + lnoData.fieldNum);
			    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData.ntwkEqpNm, {_index : { row : rowIndex}}, "eqpNm#" + lnoData.fieldNum);
			    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData.ntwkAportNm, {_index : { row : rowIndex}}, "aportNm#" + lnoData.fieldNum);
			    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData.ntwkBportNm, {_index : { row : rowIndex}}, "bportNm#" + lnoData.fieldNum);
    		        	
		        	}			    		
				}else{					
				}
			}
		});
    }
    

    // 링팝업
    function searchRingByLnoPop(param, gridVal, dataKeyVal){
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		var RingListBySvlnPop = $a.popup({
		  	popid: "RingListBySvlnPop",  
		  	title: cflineMsgArray['ringListSearch']/*"링 리스트 조회"*/,
			url: urlPath + '/configmgmt/cfline/RingListBySvlnPop.do',
			data: param,
    	    iframe: true,
    	    modal : true,
    	    movable : false,
 		    windowpopup : false,
//    	    iframe: true,
//    	    modal : false,
//    	    movable : false,
// 		    windowpopup : true,
 		    width : 1200,
 		    height : 720,
			callback:function(data){
				if(data != null){   
		    		var lnoData = getRingAddDropLnoNode(data.lnoList, dataKeyVal);
		        	if(lnoData != null){  
	   		    		var focusData = $('#'+gridVal).alopexGrid("dataGet", {_state : {focused : true}});
	   		    		var rowIndex = focusData[0]._index.data;
	   		    		for(var i=0; i<lnoData.length; i++){
//	   		    			var fieldNum = parseInt(lnoData[i].fieldNum) + i;
				    		$('#'+gridVal).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, "useTrkNtwkLineNm#" + lnoData[i].fieldNum);
				    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData[i].useRingNm, {_index : { row : rowIndex}}, "useRingNtwkLineNm#" + lnoData[i].fieldNum);
				    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData[i].ntwkEqpId, {_index : { row : rowIndex}}, "eqpId#" + lnoData[i].fieldNum);
				    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData[i].ntwkEqpNm, {_index : { row : rowIndex}}, "eqpNm#" + lnoData[i].fieldNum);
				    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData[i].ntwkAportNm, {_index : { row : rowIndex}}, "aportNm#" + lnoData[i].fieldNum);
				    		$('#'+gridVal).alopexGrid( "cellEdit", lnoData[i].ntwkBportNm, {_index : { row : rowIndex}}, "bportNm#" + lnoData[i].fieldNum);		   		    			
	   		    		}	    		        	
		        	}			    		
				}else{					
				}
			}
		});
    }
    


    /**
    * Function Name : searchEqpByLnoPop
    * Description   : 장비 검색
    * ----------------------------------------------------------------------------------------------------
    * param    	 	: 
    * ----------------------------------------------------------------------------------------------------
    * return        : return param  
    */ 
    function searchEqpByLnoPop(param, gridVal, dataKey){
    	// gridVal
		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		var EqpListBySvlnPop = $a.popup({
		  	popid: "EqpListBySvlnPop",
		  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
		  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
		  	data: param,
			modal: true,
			movable:true,
    		windowpopup : false,
			width : 1200,
			height : 730,
			callback:function(data){
				if(data != null){
   		    		var focusData = $('#'+gridVal).alopexGrid("dataGet", {_state : {focused : true}});
   		    		var rowIndex = focusData[0]._index.data;
					var fieldNumVal = dataKey.replace("eqpNm#","");
		    		$('#'+gridVal).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, "eqpId#" + fieldNumVal);
		    		$('#'+gridVal).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, "eqpNm#" + fieldNumVal);
				}
			}
		});
    	
    }    
    

    /**
     * Function Name : searchPortByLnoPop
     * Description   : 포트 검색
     * ----------------------------------------------------------------------------------------------------
     * param    	 : 파라메터
     * gridVal  	 : 그리드 ID 
     * dataKey  	 : 그리드 CELL Key 
     * ----------------------------------------------------------------------------------------------------
     * return        : return param  
     */
    function searchPortByLnoPop(param, gridVal, dataKey){

		var urlPath = $('#ctx').val();
		if(nullToEmpty(urlPath) ==""){
			urlPath = "/tango-transmission-web";
		}
		
		var PortListBySvlnPop = $a.popup({
		  	popid: "PortListBySvlnPop",
		  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
		  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
		  	data: param,
		  	iframe:true,
			modal: true,
			movable:true,
    		//windowpopup : false,
			width : 1100,
			height : 740,
			callback:function(data){
				if(data != null && data.length > 0) {
   		    		var focusData = $('#'+gridVal).alopexGrid("dataGet", {_state : {focused : true}});
   		    		var rowIndex = focusData[0]._index.data;
		    		$('#'+gridVal).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, dataKey);
				}
			}
		}); 
    }   
    // OMS 유휴회선 팝업 창 호출
    function openRmFreeChnlPop(gridDataVal, rowIndexVal, gridVal, dataKeyVal){
		var fieldNumVal = "";
	   	var aportNmVal = ""; 
		if(dataKeyVal.indexOf("aportNm")>-1){
			fieldNumVal = dataKeyVal.replace("aportNm#","");
			aportNmVal = nullToEmpty(gridDataVal["aportNm#" + fieldNumVal]);
		}else{
			fieldNumVal = dataKeyVal.replace("bportNm#","");
			aportNmVal = nullToEmpty(gridDataVal["bportNm#" + fieldNumVal]);
		}
		if(aportNmVal == ""){
			alertBox('I', makeArgMsg('required', 'PORT', '', '', ''));
			return false;
		}
	   	var urlPath = $('#ctx').val();
	   	if(nullToEmpty(urlPath) ==""){
	   		urlPath = "/tango-transmission-web";
	   	}

	   	var dataParam = {
	   			"eqpNm" : gridDataVal["eqpNm#" + fieldNumVal]
	   			,"portChnl" : aportNmVal
	   			,"trunkNm" : gridDataVal["useTrkNtwkLineNm#" + fieldNumVal]
	   	}
	   	var RmIdlenessListPop = $a.popup({
			popid: "RmIdlenessListPop",
		  	title: cflineMsgArray['omsIdleLineList']/* OMS유휴회선 목록 */,
			url: $('#ctx').val()+'/configmgmt/cfline/RmIdlenessListPop.do',
			data : dataParam,
		  	iframe:true,
			modal: true,
			movable:true,
    		//windowpopup : false,
			movable:true,
			width : 1500,
			height : 750,
			callback:function(data){
				if(data != null) {
					if(data == "searchError"){
			    		alertBox('I', cflineCommMsgArray['searchFail']); /* 조회 실패 하였습니다.*/
					}else{
						$('#'+gridVal).alopexGrid( "cellEdit", data.portChnlAll, {_index : { row : rowIndexVal}}, dataKeyVal);
					}
				}
//				//다른 팝업에 영향을 주지않기 위해
//				$.alopex.popup.result = null;
			}  
		});
    	
    	
    }
    // TASK 완료 처리 
    function taskFnshProc(gridVal){
		$('#'+gridVal).alopexGrid('endEdit', {_state:{editing:true}});
		if( $('#'+gridVal).length == 0) return false;
		var dataList = $('#'+gridVal).alopexGrid('dataGet', {_state: {selected:true}});
		if (dataList.length <= 0 ){
			 alertBox('I', cflineMsgArray['selectNoData']);/* 선택된 데이터가 없습니다. */ 
			 $("#"+gridVal).alopexGrid("startEdit");
			 return false;
		}
		var paramUsing = null;
		var paramList = [];
		var requiredColumn = rtnRequiredColumn(svlnLclCd, svlnSclCd);
		var validate = true;
		var msgStr ="";

		for(i=0;i<dataList.length;i++){
			$.each(requiredColumn, function(key, val){
				var value = eval("dataList[i]" + "." + key);
				if(nullToEmpty(value) == ""){
					msgStr += "<br>"+dataList[i].svlnNo + " : " + val;
					validate = false;
					return validate;
				}
			});
			
			if(!validate){
				alertBox('W', makeArgMsg('required', msgStr, "","",""));  /*필수 입력 항목입니다.[{0}]*/ 
				$('#'+gridVal).alopexGrid("startEdit");
				return validate;
			}
			
			paramList[i] = dataList[i];
			
		}
		cflineShowProgressBody();
		paramUsing = {"serviceLineList":paramList};
		httpRequest('tango-transmission-biz/transmisson/configmgmt/cfline/opentask/saveopentaskcomplete', paramUsing, 'POST', 'saveTaskComplete');	
    }
    
    //Grid 초기화
    var getGrid = function(svlnLclCd, svlnSclCd, response, gridDiv) {
    	
		returnTaskMapping = [];
		
    		if(svlnSclCd == "001"){
    			returnTaskMapping = mapping001001('task', showAppltNoYn);
    		// 상호접속간
    		}else if(svlnSclCd == "003"){
    			returnTaskMapping = mapping001003('task', showAppltNoYn);
    		}else {
    			returnTaskMapping = mapping001002('task', showAppltNoYn);
			}
    		// 선번정보 추가 시작 
	    	if (response != undefined && editPsblGbnSelectVal == "L"){
//	    		console.log(response.pathList);
	    		response.ServiceLineTaskList = makeHeaderTask(response.ServiceLineTaskList, response.pathList);
	    	}
	    	// 선번정보 추가 끝 
    	
			//그리드 생성
	        $('#'+gridIdTask).alopexGrid({
	        	autoColumnIndex: true,
	        	//autoResize: true,
	        	alwaysShowHorizontalScrollBar : true, //하단 스크롤바
	        	rowInlineEdit : false, //행전체 편집기능 활성화
	        	cellInlineEdit : true,
	        	cellSelectable : true,
	    		rowClickSelect : false,
	        	rowSingleSelect : false,
	        	numberingColumnFromZero: false,
	        	defaultColumnMapping:{sorting: true},
	        	enableDefaultContextMenu:false,
	    		enableContextMenu:true,
	    		contextMenu : [
	    		               {
	    							title: cflineMsgArray['jobInfoSave']/*"작업 정보 저장"*/,
	    						    processor: function(data, $cell, grid) {
	    						    	workUpdate();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	 if(schDivVal == "" && nullToEmpty($("#tmpEditPsblGbnVal").val())=="I" && data._state.selected){
	    						    		 return true;
	    						    	 }else{
	    						    		 return false;
	    						    	 }	    						    	
	    						    }
	    					   },
	    		               {
	    							title: cflineMsgArray['lnoSave']/*"선번 저장"*/,
	    						    processor: function(data, $cell, grid) {
	    						    	saveTaskSvlnLno();
	    						    },
	    						    use: function(data, $cell, grid) {
	    						    	 if(schDivVal == "" && nullToEmpty($("#tmpEditPsblGbnVal").val())=="L" && data._state.selected){
	    						    		 return true;
	    						    	 }else{
	    						    		 return false;
	    						    	 }	    						    	
	    						    }
	    					   },
	    		               {
	    		            	   title: "OMSDB"   //"RMDB"
	    		            	   , processor: function(data, $cell, grid) {	
	    		            			$('#'+gridIdTask).alopexGrid('endEdit', {_state:{editing:true}});    		            		   
	    		            		   var rowIndex = data._index.row;
	    						       var dataObj = AlopexGrid.trimData($('#'+gridIdTask).alopexGrid("dataGet", {_index : { data:rowIndex }})[0]);
	    						       openRmFreeChnlPop(dataObj, rowIndex, gridIdTask, contextMenudataKey); // OMS 유휴회선 팝업 창 호출
	    		            	   }
		    		               , use: function(data, $cell, grid) {
		    		            	   var dataList = $('#'+gridIdTask).alopexGrid('dataGet');
		    		            	   contextMenudataKey = "";
		    		            	   if(nullToEmpty($("#tmpEditPsblGbnVal").val())=="L" && dataList.length > 0){
			    		            	   var dataObj = AlopexGrid.parseEvent(event).data;
			    		            	   var dataKey = dataObj._key;
			    		            	   if(dataKey.indexOf("aportNm")>-1 || dataKey.indexOf("bportNm")>-1){
			    		            		   contextMenudataKey = dataKey;
			    		            		   return true;
			    		            	   }else{
			    		            		   return false;
			    		            	   }
		    		            	   }else{
		    		            		   return false;
		    		            	   }
	    		            	   }
	    		               },
	    		               {
	    		            	   title: cflineMsgArray['taskFinish']   //"Task 완료"
	    		            	   , processor: function(data, $cell, grid) {	    
	    		            		   taskFnshProc(gridIdTask); // RM 유휴회선 팝업 창 호출
	    		            	   }
		    		               , use: function(data, $cell, grid) {
	    						    	 if(schDivVal == "" && data._state.selected){
	    						    		 return true;
	    						    	 }else{
	    						    		 return false;
	    						    	 }	    						
	    		            	   }
	    		               }	    		               
	    		         ],	    		               
	    		               //
	        	message: {
	    			nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+cflineCommMsgArray['noInquiryData']+"</div>"
	    		},
	        	columnMapping: returnTaskMapping
	        });
	    	$('#'+gridIdTask).alopexGrid("columnFix", 3);
    } 
    
    // FDF사용정보 전송(서비스회선/링편집시만 호출됨)
      function sendFdfUseInfo(flag ) {	
         sendFdfUseInfoCommon(fdfUsingInoLineNo, "S", "B", null);   
      }
    
    function onloadMgmtGrpChange(){
    	changeMgmtGrp("mgmtGrpCd", "hdofcCd", "teamCd", "tmofCd", "mtso");
    }
   		
	//선번작업 탭에서 기본정보, 선번정보 Radio 버튼 checked 처리를 위한 값 세팅 
	function fnSetEditPsblCheckedVal(){
		if ( editPsblGbnSelectVal == "I" ){
			$('#tmpEditPsblGbnVal').val("I");
		}else if ( editPsblGbnSelectVal == "L" ){
			$('#tmpEditPsblGbnVal').val("L");
		};	   	 		
	}
	
	// 트렁크 선번 첫번째 node 가져오기
	function getTrunkLnoFirstNode(lnoData, trunkFieldNm){
		var neId = "";
		var neNm = "";
		var aportNm = "";
		var channelNm = "";
		var fieldNumVal = trunkFieldNm.replace("useTrkNtwkLineNm#","");
		var ringNm = "";
		var returnData = null;
		if(lnoData != null && lnoData.length>0){
			if(nullToEmpty(lnoData[0].LEFT_NE_ID) !="" && nullToEmpty(lnoData[0].LEFT_NE_ID) !="DV00000000000"){
				// 좌장비가 있는경우
				neId = nullToEmpty(lnoData[0].LEFT_NE_ID);
				neNm = nullToEmpty(lnoData[0].LEFT_NE_NM);
				aportNm = nullToEmpty(lnoData[0].LEFT_PORT_NM);
				channelNm = nullToEmpty(lnoData[0].LEFT_CHANNEL_DESCR);
				if(channelNm != ""){
					aportNm += channelNm;
				}
			}else if(nullToEmpty(lnoData[0].RIGHT_NE_ID) !="" && nullToEmpty(lnoData[0].RIGHT_NE_ID) !="DV00000000000"){
				neId = nullToEmpty(lnoData[0].RIGHT_NE_ID);
				neNm = nullToEmpty(lnoData[0].RIGHT_NE_NM);
				aportNm = nullToEmpty(lnoData[0].RIGHT_PORT_NM);
				channelNm = nullToEmpty(lnoData[0].RIGHT_CHANNEL_DESCR);
				if(channelNm != ""){
					aportNm += channelNm;
				}
			}else{  // 첫번째 구간의 우측 장비가 빈 장비 인 경우는 2번째 구간의 좌측 장비를 반환 한다.
				neId = nullToEmpty(lnoData[1].LEFT_NE_ID);
				neNm = nullToEmpty(lnoData[1].LEFT_NE_NM);
				aportNm = nullToEmpty(lnoData[1].LEFT_PORT_NM);
				channelNm = nullToEmpty(lnoData[1].LEFT_CHANNEL_DESCR);
				if(channelNm != ""){
					aportNm += channelNm;
				}
			}
		}
		if(neNm != ""){
			ringNm = nullToEmpty(lnoData[0].RING_NM);
			returnData = {ntwkEqpId: neId, ntwkEqpNm: neNm, ntwkAportNm: aportNm, ntwkBportNm: "", fieldNum: fieldNumVal, ntwkRingNm: ringNm};
		}
		return returnData;
	}
	
	// 링 선번 ADD, DROP node 가져오기
	function getRingAddDropLnoNode(lnoData, ringFieldNm){
		var fieldNumVal = ringFieldNm.replace("useRingNtwkLineNm#","");
		var fieldNumNextVal = (parseInt(fieldNumVal) + 1) + "";
		var neNm = "";
		var neId = "";
		var aportNm = "";
		var bportNm = "";
		var achannelNm = "";
		var bchannelNm = "";
		var useNtwkRingNm = "";
		var usePathDrct = "";  // 방향 
		var tmpAddData = null;
		var tmpDropData = null;
		var returnList = [];
		var lnoLength = 0;
		if(lnoData != null && lnoData.length > 0){
			lnoLength = lnoData.length;
			neId = nullToEmpty(lnoData[0].RIGHT_NE_ID);
			neNm = nullToEmpty(lnoData[0].RIGHT_NE_NM);
			aportNm = nullToEmpty(lnoData[0].RIGHT_PORT_NM);
			achannelNm = nullToEmpty(lnoData[0].RIGHT_CHANNEL_DESCR);
			if(achannelNm != ""){
				aportNm += achannelNm;
			}
		}
		if(lnoLength > 1){
			useNtwkRingNm = nullToEmpty(lnoData[1].USE_NETWORK_NM);
			bportNm = nullToEmpty(lnoData[1].LEFT_PORT_NM);
			bchannelNm = nullToEmpty(lnoData[1].LEFT_CHANNEL_DESCR);
			usePathDrct = nullToEmpty(lnoData[1].USE_NETWORK_PATH_DIRECTION);
			if(bchannelNm != ""){
				bportNm += bchannelNm;
			}
		}

		var neIdDrop = "";
		var neNmDrop = "";
		var aportNmDrop = "";
		var bportNmDrop = "";
		var achannelNmDrop = "";
		var bchannelNmDrop = "";
		
		if(lnoLength > 1){
			neIdDrop = nullToEmpty(lnoData[lnoLength-1].LEFT_NE_ID);
			neNmDrop = nullToEmpty(lnoData[lnoLength-1].LEFT_NE_NM);
			bportNmDrop = nullToEmpty(lnoData[lnoLength-1].LEFT_PORT_NM);
			bchannelNmDrop = nullToEmpty(lnoData[lnoLength-1].LEFT_CHANNEL_DESCR);
			if(bchannelNmDrop != ""){
				bportNmDrop += bchannelNmDrop;
			}
		}
		if(lnoLength > 2 ){
			aportNmDrop = nullToEmpty(lnoData[lnoLength-2].RIGHT_PORT_NM);
			achannelNmDrop = nullToEmpty(lnoData[lnoLength-2].RIGHT_CHANNEL_DESCR);
			if(achannelNmDrop != ""){
				aportNmDrop += achannelNmDrop;
			}
		}
//		if(usePathDrct=="LEFT"){ // 역방향 인 경우 (add, drop 바꾸고 ,aport, bport 바꾼다)
//			tmpAddData = {ntwkEqpNm: neNmDrop, ntwkAportNm: bportNmDrop, ntwkBportNm: aportNmDrop, fieldNum: fieldNumVal};
//			tmpDropData = {ntwkEqpNm: neNm, ntwkAportNm: bportNm, ntwkBportNm: aportNm, fieldNum: fieldNumNextVal};
//		}else{
//			tmpAddData = {ntwkEqpNm: neNm, ntwkAportNm: aportNm, ntwkBportNm: bportNm, fieldNum: fieldNumVal};
//			tmpDropData = {ntwkEqpNm: neNmDrop, ntwkAportNm: aportNmDrop, ntwkBportNm: bportNmDrop, fieldNum: fieldNumNextVal};
//		}

		tmpAddData = {useRingNm: useNtwkRingNm, ntwkEqpId: neId, ntwkEqpNm: neNm, ntwkAportNm: aportNm, ntwkBportNm: bportNm, fieldNum: fieldNumVal};
		tmpDropData = {useRingNm: useNtwkRingNm, ntwkEqpId: neIdDrop, ntwkEqpNm: neNmDrop, ntwkAportNm: aportNmDrop, ntwkBportNm: bportNmDrop, fieldNum: fieldNumNextVal};		
		returnList.push(tmpAddData);
		returnList.push(tmpDropData);
		return returnList;
	}
	
	   
});
