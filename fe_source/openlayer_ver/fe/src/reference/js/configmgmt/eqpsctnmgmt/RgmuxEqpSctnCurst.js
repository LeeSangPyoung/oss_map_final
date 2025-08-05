/**
 * RgmuxEqpSctnCurst.js
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
			}, {/* 전송실--숨김데이터 		 */
				key : 'tmof', align:'center',
				title : configMsgArray['transmissionOffice'],
				width: '100px'
			}, {/* 국사명--숨김데이터		 */
				key : 'mtsoNm', align:'center',
				title : configMsgArray['mobileTelephoneSwitchingOfficeName'],
				width: '100px'
			}, {/* DU명--숨김데이터       	 */
				key : 'duNm', align:'center',
				title : configMsgArray['digitalUnitName'],
				width: '100px'
			}, {/* DU시설코드--숨김데이터         */
				key : 'duFcltsCode', align:'center',
				title : configMsgArray['digitalUnitFacilitiesCode'],
				width: '120px'
			}, {/* RU명--숨김데이터        	 */
				key : 'ruNm', align:'center',
				title : configMsgArray['radioUnitName'],
				width: '130px'
			}, {/* RU시설코드--숨김데이터      	 */
				key : 'ruFcltsCode', align:'center',
				title : configMsgArray['radioUnitFacilitiesCode'],
				width: '130px'
			}, {/* COT노드--숨김데이터      	 */
				key : 'cotNode', align:'center',
				title : configMsgArray['centerOfficeTerminalNode'],
				width: '130px'
			}, {/* COT TID--숨김데이터   	 */
				key : 'cotTid', align:'center',
				title : configMsgArray['centerOfficeTerminalTargetId'],
				width: '100px'
			}, {/* COT파장--숨김데이터     	 */
				key : 'cotWavl', align:'center',
				title : configMsgArray['centerOfficeTerminalWavelength'],
				width: '100px'
			}, {/* COT좌포트--숨김데이터      	 */
				key : 'cotlftPort', align:'center',
				title : configMsgArray['centerOfficeTerminalLeftPort'],
				width: '100px'
			}, {/* RT노드명--숨김데이터        	 */
				key : 'rtNodeNm', align:'center',
				title : configMsgArray['remoteTerminalNodeName'],
				width: '100px'
			}, {/* RT TID--숨김데이터     	 */
				key : 'rtTid', align:'center',
				title : configMsgArray['remoteTerminalTargetId'],
				width: '100px'
			}, {/* 등록일자		 */
				key : 'frstRegDate', align:'center',
				title : configMsgArray['registrationDate'],
				width: '130px'				
			},{/* 등록자		 */
				key : 'frstRegUserId', align:'center',
				title : configMsgArray['registrant'],
				width: '100px'	
			},{/* 변경일자		 */
				key : 'lastChgDate', align:'center',
				title : configMsgArray['changeDate'],
				width: '130px'				
			},{/* 변경자		 */
				key : 'lastChgUserId', align:'center',
				title : configMsgArray['changer'],
				width: '100px'		
			}],
			message: {/* 데이터가 없습니다.*/
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });
        
        //gridHide();
   };
   
// 컬럼 숨기기
   function gridHide() {
   	
   	var hideColList = ['tmof','mtsoNm','duNm','duFcltsCode','ruNm','ruFcltsCode','cotNode','cotTid','cotWavl','cotlftPort','rtNodeNm','rtTid',];
   	
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
    	//팀 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'fstTeam');
    	//전송실 조회
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
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
     		 main.setGrid(1,perPage);
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
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'fstTeam');
    		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
    			 
         });
    	
    	//본부 선택시 이벤트
    	 $('#org').on('change', function(e) {
    		 
    		 var orgID =  $("#org").getData();
    		 
    		 if(orgID.orgId == ''){
    			 var chrrOrgGrpCd;
    			 if($("#chrrOrgGrpCd").val() == ""){
    				 chrrOrgGrpCd = "SKT";
    			 }else{
    				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
    			 }
    			 
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ chrrOrgGrpCd, null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
    			 
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
     	 		var chrrOrgGrpCd;
				 if($("#chrrOrgGrpCd").val() == ""){
					 chrrOrgGrpCd = "SKT";
				 }else{
					 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
				 }
				 
			     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ chrrOrgGrpCd, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }
    		 
    	 });
    	 
    	//엑셀다운 
    	 $('#btnExportExcelTest').on('click', function(e) {
         	//tango transmission biz 모듈을 호출하여야한다.
         	
    		 var worker = new ExcelWorker({
         		excelFileName : '장비 관리',
         		palette : [{
         			className : 'B_YELLOW',
         			backgroundColor: '255,255,0'
         		},{
         			className : 'F_RED',
         			color: '#FF0000'
         		}],
         		sheetList: [{
         			sheetName: '장비 관리',
         			$grid: $('#'+gridId)
         		}]
         	});
         	worker.export({
         		merge: false,
         		exportHidden: false,
         		filtered  : false,
         		selected: false,
         		useGridColumnWidth : true,
         		border  : true
         	});
         }); 
    	         
    	//첫번째 row를 클릭했을때 alert 이벤트 발생
    	 $('#'+gridId).on('dblclick', '.bodycell', function(e){
    	 	var dataObj = AlopexGrid.parseEvent(e).data;

    	 	popup('EqpSctnDtlLkup', $('#ctx').val()+'/configmgmt/eqpsctnmgmt/EqpSctnDtlLkup.do', configMsgArray['equipmentSectionDetailInf'],dataObj);
    	 
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
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		$('#org').setData({
                 data:option_data
    		});
    	}
    	
    	if(flag == 'org'){
    		$('#org').clear();
    		$('#team').clear();
    		$('#tmof').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];
    		
    		$('#team').setData({
                 data:option_data
    		});
    		
    		$('#tmof').setData({
                data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['all']}]
    		});
    		
    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}
    		
    		$('#org').setData({
                 data:option_data
    		});
    	}
    	
    	if(flag == 'fstTeam'){
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
    		
    		$('#tmof').setData({
                data:[{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['all']}]
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
    
    //function setGrid(page, rowPerPage) {
    this.setGrid = function(page, rowPerPage){

    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	 var param =  $("#searchForm").getData();

    	 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/eqpsctnmgmt/eqpSctnMgmt', param, 'GET', 'search');
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
                  height : window.innerHeight * 0.9
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