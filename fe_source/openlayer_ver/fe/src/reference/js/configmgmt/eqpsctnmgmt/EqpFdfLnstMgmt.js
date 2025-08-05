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
    		columnMapping: [{
    			/* 순번 			 */
				align:'center',
				title : configMsgArray['sequence'],
				width: '50px',
				numberingColumn: true 
			}, {/* 구간ID		 */
				key : 'eqpSctnId', align:'center',
				title : configMsgArray['sectionIdentification'],
				width: '100px'
			}, {/* FDF본부      	 */
				key : 'lftOrgNm', align:'center',
				title : configMsgArray['fiberDistributionFrameHeadOffice'],
				width: '100px'
			}, {/* FDF전송실    	 */
				key : 'lftTmofNm', align:'center',
				title : configMsgArray['fiberDistributionFrameTransmissionOffice'],
				width: '100px'
			}, {/* FDF국사명    	 */
				key : 'lftMtsoNm', align:'center',
				title : configMsgArray['fiberDistributionFrameMtsoName'],
				width: '120px'
			}, {/* FDF장비명    	 */
				key : 'lftEqpNm', align:'center',
				title : configMsgArray['fiberDistributionFrameEquipmentName'],
				width: '130px'
			}, {/* FDF장비ID--숨김데이터    	 */
				key : 'lftEqpId', align:'center',
				title : configMsgArray['fiberDistributionFrameEquipmentIdentification'],
				width: '130px'
			}, {/* FDF포트명    	 */
				key : 'lftPortNm', align:'center',
				title : configMsgArray['fiberDistributionFramePortName'],
				width: '100px'
			}, {/* 장비본부     	 */
				key : 'rghtOrgNm', align:'center',
				title : configMsgArray['equipmentHeadOffice'],
				width: '100px'
			}, {/* 장비전송실     	 */
				key : 'rghtTmofNm', align:'center',
				title : configMsgArray['equipmentMtso'],
				width: '100px'
			}, {/* 장비국사명     	 */
				key : 'rghtMtsoNm', align:'center',
				title : configMsgArray['equipmentMobileTelephoneSwitchingOfficeName'],
				width: '100px'	
			}, {/* 장비명         	 */
				key : 'rghtEqpNm', align:'center',
				title : configMsgArray['equipmentName'],
				width: '120px'
			}, {/* 장비ID--숨김데이터    	 */
				key : 'rghtEqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '120px'
			}, {/* 장비포트명     	 */
				key : 'rghtPortNm', align:'center',
				title : configMsgArray['equipmentPortName'],
				width: '130px'
			}, {/* 숨김데이터   	 */
				key : 'rghtEqpRoleDivCd', align:'center',
				title : '우장비역할구분코드',
				width: '130px'
			}, {/* 본부ID--숨김데이터   	 */
				key : 'rghtOrgId', align:'center',
				title : '본부ID',
				width: '100px'
			}, {/* 팀ID--숨김데이터   	 */
				key : 'rghtTeamId', align:'center',
				title : '팀ID',
				width: '100px'
			}, {/* 전송실ID--숨김데이터   	 */
				key : 'rghtTmof', align:'center',
				title : '전송실ID',
				width: '100px'
			}],
			message: {/* 데이터가 없습니다.*/
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
   };
   
   function gridHide() {
	   	
	   	var hideColList = ['lftEqpId','rghtEqpId','rghtEqpRoleDivCd', 'rghtOrgId', 'rghtTeamId' ,'rghtTmof'];
	   	
	   	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	   	
		}
   
   // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
	 function setSelectCode() {
		 var chrrOrgGrpCd;
		 if($("#chrrOrgGrpCd").val() == ""){
			 chrrOrgGrpCd = "SKT";
		 }else{
			 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		 }

		//관리그룹 조회
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
    	//본부 세션 값이 없을 경우 팀,전송실 전체 조회
//    	if($("#sUprOrgId").val() == ""){
//	    	//팀 조회
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//	    	//전송실 조회
//	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
//    	}
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
    		 var param =  $("#searchForm").getData();
	    	 
    		 if (param.orgId == "") {
 		     	//필수 선택 항목입니다.[ 본부 ] 
 			    callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['hdofc']), function(msgId, msgRst){});
 		     	return; 	
 		     }
 	    	 
 	    	 if (param.teamId == "") {
 	    		//필수 선택 항목입니다.[ 팀 ] 
 				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['team']), function(msgId, msgRst){});
 			    return; 	
 		     }
 	    	 
 	    	 if (param.tmof == "") {
 	    		//필수 선택 항목입니다.[ 전송실 ] 
 				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['transmissionOffice']), function(msgId, msgRst){});
 			    return; 	
 		     }
 	    	 
    		 main.setGrid(1,perPage);
         });
    	 
    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			var param =  $("#searchForm").getData();
   	    	 
     			if (param.orgId == "") {
    		     	//필수 선택 항목입니다.[ 본부 ] 
    			    callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['hdofc']), function(msgId, msgRst){});
    		     	return; 	
    		     }
    	    	 
    	    	 if (param.teamId == "") {
    	    		//필수 선택 항목입니다.[ 팀 ] 
    				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['team']), function(msgId, msgRst){});
    			    return; 	
    		     }
    	    	 
    	    	 if (param.tmof == "") {
    	    		//필수 선택 항목입니다.[ 전송실 ] 
    				callMsgBox('','I', makeArgConfigMsg('requiredOption',configMsgArray['transmissionOffice']), function(msgId, msgRst){});
    			    return; 	
    		     }
    	    	 
     			main.setGrid(1,perPage);
       		}
     	 });
         
       //관리그룹 선택시 이벤트
    	 $('#mgmtGrpNm').on('change', function(e) {
    		 
    		 var mgmtGrpNm = $("#mgmtGrpNm").val();

    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
//    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    			 
         });
    	
    	//본부 선택시 이벤트
    	 $('#org').on('change', function(e) {
    		 
    		 var orgID =  $("#org").getData();
    		 
    		 if(orgID.orgId == ''){
    			 var mgmtGrpNm = $("#mgmtGrpNm").val();
    			 
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    			 
    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
    		 }
         });
    	 
    	 // 팀을 선택했을 경우
    	 $('#team').on('change', function(e) {
    		
    		 var orgID =  $("#org").getData();
    		 var teamID =  $("#team").getData();

     	 	 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		 var mgmtGrpNm = $("#mgmtGrpNm").val();
				 
			     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }
    		 
    	 });
    	
     	//등록 
    	 $('#btnReg').on('click', function(e) {
	    	 dataParam = {"regYn" : "N"};
	    	 /* FDF선번장등록 */
    		 popup('EqpFdfLnstReg', 'EqpFdfLnstReg.do', configMsgArray['fiberDistributionFrameLineNumberSheetReg'], dataParam);
         });

    	 //엑셀다운 
    	 $('#btnExportExcel').on('click', function(e) {
      		//tango transmission biz 모듈을 호출하여야한다.
      		 var param =  $("#searchForm").getData();
      		 
      		 param = gridExcelColumn(param, gridId);
      		 param.pageNo = 1;
      		 param.rowPerPage = 10;   
      		 param.firstRowIndex = 1;
      		 param.lastRowIndex = 1000000000;   
      		 
      		 param.fileName = configMsgArray['fiberDistributionFrameLineNumberSheetMgmt']; /* FDF선번장관리   	 */
      		 param.fileExtension = "xlsx";
      		 param.excelPageDown = "N";
      		 param.excelUpload = "N";
      		 param.method = "getEqpFdfLnstMgmtList";
      		 
      		 $('#'+gridId).alopexGrid('showProgress');
   	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/excelcreate', param, 'GET', 'excelDownload');
           });
    	 
    	 
    	 $('#btnExportExcelOnDemand').on('click', function(e){   
	            btnExportExcelOnDemandClickEventHandler(e);
	     });
    	 
    	         
    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;
    	 	 //$a.navigate($('#ctx').val()+'/configmgmt/equipment/EqpSctnDtlLkup.do',dataObj);
    	 	dataObj.mgmtGrpNm = $('#mgmtGrpNm').val();
    	 	/* FDF선번장등록 */
    	 	popup('EqpFdfLnstReg', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpFdfLnstReg.do', configMsgArray['fiberDistributionFrameLineNumberSheetReg'],dataObj);
    	 
    	 });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
    };
    
    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	 function btnExportExcelOnDemandClickEventHandler(event){
	        
	        //장비구간조회조건세팅
	        var param =  $("#searchForm").getData();
	   		param = gridExcelColumn(param, gridId);
	   		param.pageNo = 1;
	   		param.rowPerPage = 60;   
	   		param.firstRowIndex = 1;
	   		param.lastRowIndex = 1000000000;   
	   		param.inUserId = $('#sessionUserId').val();
	   		
	   		/* 엑셀정보     	 */
	   	    var now = new Date();
	        var dayTime = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds()); 
	        var excelFileNm = 'FDF_LineNumberSheet_Management_'+dayTime;
	   		param.fileName = excelFileNm;
	   		param.fileExtension = "xlsx";
	   		param.excelPageDown = "N";
	   		param.excelUpload = "N";
	   		param.excelMethod = "getEqpFdfLnstMgmtList";
	   		param.excelFlag = "EqpFdfLnstMgmt";
	   		//필수 파일명을 지정하자...아니면..이상한 이름이라서.....
	        fileOnDemendName = excelFileNm+".xlsx";
 		    console.log("aaa");
 		 	$('#'+gridId).alopexGrid('showProgress');
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
		
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.eqpFdfLnstMgmt);
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
    		
    		var option_data =  [{comGrpCd: "", comCd: "",comCdNm: configMsgArray['select']}];
    		
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
    	}
    	
    	//본부 콤보박스
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
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}
  		
			$('#org').clear();
	  		
	   		var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];
	   		
	   		var selectId = null;
	   		if(response.length > 0){
		    		for(var i=0; i<response.length; i++){
		    			var resObj = response[i];
		    			option_data.push(resObj);
		    			if(resObj.orgId == sUprOrgId) {
							selectId = resObj.orgId;
						}
		    		}
		    		if(selectId == null){
		    			selectId = response[0].orgId;
		    			sUprOrgId = selectId;
		    		}
		    		$('#org').setData({
						data:option_data ,
						orgId:selectId
					});
	   		}
	   		//본부 세션값이 있을 경우 해당 팀,전송실 조회
	   			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   	}
    	
    	
    	if(flag == 'org'){
    		$('#org').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#org').setData({
                 data:option_data
    		});
    	}
    	
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
  			
  			$('#team').clear();
  			 
      		var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];
      		
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
  	    		$('#team').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#team').val() != ""){
  	    			sOrgId = selectId;
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#team').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#org').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
    	}
    	
    	if(flag == 'team'){
    		$('#team').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['select'],uprOrgId: ""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#team').setData({
                 data:option_data
    		});
    	}
		
		if(flag == 'tmof'){
			$('#tmof').clear();
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['select'],mgmtGrpCd: ""}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
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
    		//조회를 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    
    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").getData();
         
    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/eqpFdfLnstMgmt', param, 'GET', 'search');
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