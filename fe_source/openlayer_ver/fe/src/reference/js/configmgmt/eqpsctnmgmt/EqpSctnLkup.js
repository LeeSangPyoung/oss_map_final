/**
 * EqpSctnLkup.js
 *
 * @author Administrator
 * @date 2016. 6. 21. 오전 17:30:03
 * @version 1.0
 */
$a.page(function() {
    
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
  			headerGroup : [ { fromIndex :  2 , toIndex :  12 , title : configMsgArray['west'] , id : "West"},
                  			{ fromIndex : 13 , toIndex : 23 , title : configMsgArray['east'] , id : "East" }],
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
			}, {/* 장비본부     	 */
				key : 'lftOrgNm', align:'center',
				title : configMsgArray['equipmentHeadOffice'],
				width: '100px'
			}, {/* 장비전송실     	 */
				key : 'lftTmofNm', align:'center',
				title : configMsgArray['equipmentMtso'],
				width: '100px'
			}, {/* 장비국사명     	 */
				key : 'lftMtsoNm', align:'center',
				title : configMsgArray['equipmentMobileTelephoneSwitchingOfficeName'],
				width: '120px'
			}, {/* 장비         	 */
				key : 'lftEqpNm', align:'center',
				title : configMsgArray['equipment'],
				width: '130px'
			}, {/* 좌장비ID--숨김데이터		 */
				key : 'lftEqpId', align:'center',
				title : configMsgArray['leftEquipmentIdentification'],
				width: '130px'
			}, {/* 장비모델명--숨김데이터   	 */
				key : 'lftEqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'
			}, {/* 장비포트명  	 */
				key : 'lftPortNm', align:'center',
				title : configMsgArray['equipmentPortName'],
				width: '100px'
			}, {/* 장비포트ID--숨김데이터	     */
				key : 'lftPortId', align:'center',
				title : configMsgArray['equipmentPortIdentification'],
				width: '100px'
			}, {/* 장비포트IP	     */
				key : 'lftPortIpAddr', align:'center',
				title : configMsgArray['equipmentPortInternetProtocol'],
				width: '100px'
			}, {/* 포트용량 		 */
				key : 'lftPortCapaNm', align:'center',
				title : configMsgArray['portCapacity'],
				width: '100px'
			}, {/* 포트설명 		 */
				key : 'lftPortDesc', align:'center',
				title : configMsgArray['portDescription'],
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
				width: '120px'
			}, {/* 장비         	 */
				key : 'rghtEqpNm', align:'center',
				title : configMsgArray['equipment'],
				width: '130px'
			}, {/* 장비ID--숨김데이터   	 */
				key : 'rghtEqpId', align:'center',
				title : configMsgArray['equipmentIdentification'],
				width: '130px'
			}, {/* 장비모델명--숨김데이터   	 */
				key : 'rghtEqpMdlNm', align:'center',
				title : configMsgArray['equipmentModelName'],
				width: '130px'
			}, {/* 장비포트     	 */
				key : 'rghtPortNm', align:'center',
				title : configMsgArray['equipmentPort'],
				width: '100px'
			}, {/* 장비포트ID--숨김데이터	     */
				key : 'rghtPortId', align:'center',
				title : configMsgArray['equipmentPortIdentification'],
				width: '100px'
			}, {/* 장비포트IP	     */
				key : 'rghtPortIpAddr', align:'center',
				title : configMsgArray['equipmentPortInternetProtocol'],
				width: '100px'
			}, {/* 포트용량 		 */
				key : 'rghtPortCapaNm', align:'center',
				title : configMsgArray['portCapacity'],
				width: '100px'
			}, {/* 포트설명 		 */
				key : 'rghtPortDesc', align:'center',
				title : configMsgArray['portDescription'],
				width: '100px'
			}, {/* 자동/수동   	 */
				key : 'autoClctYn', align:'center',
				title : configMsgArray['autoPassive'],
				width: '100px'
			}, {/* 원천구간ID		 */
				key : 'srcEqpSctnId', align:'center',
				title : configMsgArray['sourceSectionIdentification'],
				width: '100px'
			}, {/* 연결정보유형코드--숨김데이터    */
				key : 'connInfTypCd', align:'center',
				title : configMsgArray['connectionInformationTypeCode'],
				width: '100px'
			}, {/* 연결정보유형--숨김데이터        */
				key : 'connInfTypNm', align:'center',
				title : configMsgArray['connectionInformationType'],
				width: '100px'
			}, {/* 자동수집여부--숨김데이터   	 */
				key : 'sctnStatTypCd', align:'center',
				title : configMsgArray['autoCollectionYesOrNo'],
				width: '100px'
			}, {/* 자동수집여부--숨김데이터   	 */
				key : 'sctnStatTypNm', align:'center',
				title : configMsgArray['autoCollectionYesOrNo'],
				width: '100px'
			}],
			message: {/* 데이터가 없습니다. */
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        gridHide();
   };
   
// 컬럼 숨기기
   function gridHide() {
   	
   	var hideColList = ['lftMtsoId','lftEqpId','lftEqpMdlNm','lftEqpMdlId','lftPortId','rghtMtsoId','rghtEqpId','rghtEqpMdlNm','rghtEqpMdlId','rghtPortId','connInfTypCd','connInfTypNm','sctnStatTypCd','sctnStatTypNm'];
   	
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
		 //본부 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstOrg');
//    	//팀 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
//    	//전송실 조회
//    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
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
    	
    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    		 var dataObj = AlopexGrid.parseEvent(e).data;
    	 	$a.close(dataObj);
    	 });
    	 
    	 $('#btnClose').on('click', function(e) {
           	//tango transmission biz 모듈을 호출하여야한다.
      		 $a.close();
           });
    };
	
	function successCallback(response, status, jqxhr, flag){
    	
    	if(flag == 'search'){
    		
    		$('#'+gridId).alopexGrid('hideProgress');
    		
    		setSPGrid(gridId, response, response.EqpSctnMgmt);
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
	  		
	   		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];
	   		
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
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];
    		
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
  			 
      		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];
      		
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
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];
    		
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
			var option_data =  [{mtsoId: "", mtsoNm: configMsgArray['all'],mgmtGrpCd: ""}];
			
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#tmof').setData({
	             data:option_data
			});
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
    		//조회 실패 하였습니다.
    		callMsgBox('','W', configMsgArray['searchFail'] , function(msgId, msgRst){});
    	}
    }
    
    function setGrid(page, rowPerPage) {

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").getData();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/eqpSctnLkup', param, 'GET', 'search');
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