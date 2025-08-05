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
	var tmpCstrGubun = "0";
	var tmpCstrCd = null;
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	initGrid();
    	setSelectCode();
        setEventListener();

        paramData = param;

        $('#workGubun').setData({
        	workGubun: param.workGubun
		});

        $('#searchForm').setData(param);

        tmpCstrGubun = param.cstrGubun;
        tmpCstrCd = param.cstrCd;

        setCstrCdFlag(param);
    }

    function setCstrCdFlag(param) {
    	var paramData = [{'cstrCd' : param.cstrCd}];
    	if (param.cstrCd != null && param.cstrCd != undefined) {
    		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getCstrCdYn?cstrCd='+param.cstrCd, '', 'GET', 'cstrCdYn');
    	}

	}


  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	height: 578,
        	paging : {
        		pagerSelect: [15,30,60,100]
               ,hidePageList: false  // pager 중앙 삭제
        	},
        	autoColumnIndex: true,
    		autoResize: true,
    		numberingColumnFromZero: false,
    		defaultColumnMapping:{
    			sorting : true
    		},
    		columnMapping: [
    		{
				align:'center',
				title : configMsgArray['sequence'],
				width: '50',
				numberingColumn: true
    		}, {
    			align:'center',
				key : 'workGubun',
				title : '관리그룹',
				width: '70'
			}, {
    			align:'center',
				key : 'orgNm',
				title : '본부',
				width: '100'
			},{/* 팀	 */
				key : 'teamNm', align:'center',
				title : '팀',
				width: '100px'
			}, {/* 전송실 		 */
				key : 'tmofNm', align:'center',
				title : '전송실',
				width: '150px'
			},  {
				key : 'mtsoTyp', align : 'center',
				title : '국사유형',
				width : '90' //MTSO_TYP
			},  {
				key : 'sisulCd', align : 'center',
				title : '통시코드',
				width : '90' //MTSO_TYP
			}, {
    			align:'center',
				key : 'sisulNm',
				title : '국사명',
				width: '200'
			}, {
    			align:'center',
				key : 'floorName',
				title : '층구분',
				width: '70'
			}, {
    			align:'center',
				key : 'floorId',
				title : '층ID',
				width: '70'
			}, {
    			align:'center',
				key : 'floorLabel',
				title : '층-국사명',
				width: '200'
			}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        gridHide();

    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = ['modelId', 'status', 'csType'];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    // 처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
		var searchInspectCd = {supCd : '007000'};
		var searchGubun = {supCd : '008000'};
		var searchWorkGubun = "SKT";
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ searchWorkGubun, null, 'GET', 'fstOrg');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchInspectCd, 'GET', 'searchInspectCd');
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/comcode', searchGubun, 'GET', 'searchGubun');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C01974', null, 'GET', 'mtsoCntrTypCdList');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/opTeamPost/ALL/C', null, 'GET', 'opTeam');
    };

    function setEventListener() {
    	var perPage = 100;

    	// 페이지 번호 클릭시
	   	 $('#'+gridId).on('pageSet', function(e){
	   		 var eObj = AlopexGrid.parseEvent(e);
	   		pop.setGrid(eObj.page, eObj.pageinfo.perPage);
	   	 });

	   	//페이지 selectbox를 변경했을 시.
        $('#'+gridId).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage = eObj.perPage;
        	pop.setGrid(1, eObj.perPage);
        });

    	//조회
    	 $('#btnSearch').on('click', function(e) {
    		 pop.setGrid(1,perPage);
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			pop.setGrid(1,perPage);
       		}
     	 });

         //도면 팝업
         $('#'+gridId).on('dblclick', '.bodycell', function(e){
 			var dataObj = AlopexGrid.parseEvent(e).data;
 			var data = {sisulCd: dataObj.sisulCd, floorId: dataObj.floorId, version: dataObj.version, cstrGubun : tmpCstrGubun, cstrCd : tmpCstrCd};
 			$a.popup({
 				title: '드로잉 툴',
 				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do',
 				data: data,
 				iframe: false,
 				windowpopup: true,
 				movable:false,
 				width : screen.availWidth,
 				height : screen.availHeight,
 				callback: function(data) {
 				}
 			});
 			//self.close();
 		});

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
			var mtsoCntrTypCdList_Tmp = "";
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


			if (param.mtsoCntrTypCdList != "" && param.mtsoCntrTypCdList != null ){
	   			 for(var i=0; i<param.mtsoCntrTypCdList.length; i++) {
	   				 if(i == param.mtsoCntrTypCdList.length - 1){
	   					mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i];
	                    }else{
	                    	mtsoCntrTypCdList_Tmp += param.mtsoCntrTypCdList[i] + ",";
	                    }
	    			}
	   			param.mtsoCntrTypCdList = mtsoCntrTypCdList_Tmp ;
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

     		param.fileName = '국소별통계_';
     		param.fileExtension = "xlsx";
     		param.excelPageDown = "N";
     		param.excelUpload = "N";
     		param.method = "getSmtsoStcList";

     		$('#'+gridId).alopexGrid('showProgress');
     		httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/mtsoOpCurstExcelcreate', param, 'GET', 'excelDownload');
 		});


         $('#searchWorkGubun').on('change', function(e) {

       		 var mgmtGrpNm = $("#searchWorkGubun").val();

       		 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ mgmtGrpNm, null, 'GET', 'fstOrg');

       		 var option_data =  null;
    			if($('#searchWorkGubun').val() == "SKT"){
    				option_data =  [{comCd: "1",comCdNm: "전송실"},
    								{comCd: "2",comCdNm: "중심국사"},
    								{comCd: "3",comCdNm: "기지국사"},
    								{comCd: "4",comCdNm: "국소"}
    								];
    			}else{
    				option_data =  [{comCd: "1",comCdNm: "정보센터"},
    								{comCd: "2",comCdNm: "국사"},
    								{comCd: "4",comCdNm: "국소"}
    								];
    			}
    			$('#mtsoTypCdList').setData({
                    data:option_data
    			});

            });

       	//본부 선택시 이벤트
       	 $('#orgId').on('change', function(e) {

       		 var orgID =  $("#orgId").getData();

       		 if(orgID.orgId == ''){
       			 var mgmtGrpNm = $("#searchWorkGubun").val();

       			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ mgmtGrpNm, null, 'GET', 'team');
       		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');

       		 }else{
       			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
       			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
       		 }
            });
      // 	팀을 선택했을 경우
    	 $('#teamId').on('change', function(e) {

    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#teamId").getData();

     	 	 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		 var mgmtGrpNm = $("#searchWorkGubun").val();

    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ mgmtGrpNm, null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.teamId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }

    	 });


    		/*    	//국사층 구분 팝업
        	 $('#'+gridId).on('click', '#floorBtn', function(e){
        		 var dataObj = AlopexGrid.parseEvent(e).data;
        		 var data = {sisulCd: dataObj.sisulCd};
        		 $a.popup({
        			 title: '국사 층 구분',
        			 url: $('#ctx').val()+'/configmgmt/upsdmgmt/UpsdMtsoFloorList.do',
        			 data: data,
        			 iframe: false,
        			 windowpopup: true,
        			 modal: false,
        			 width : window.innerWidth * 0.9,
        			 height : window.innerHeight * 0.8,
        		 });
     		});*/

    	 var option_data =  null;
			if($('#searchWorkGubun').val() == "SKT"){
				option_data =  [{comCd: "1",comCdNm: "전송실"},
								{comCd: "2",comCdNm: "중심국사"},
								{comCd: "3",comCdNm: "기지국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}else{
				option_data =  [{comCd: "1",comCdNm: "정보센터"},
								{comCd: "2",comCdNm: "국사"},
								{comCd: "4",comCdNm: "국소"}
								];
			}
			$('#mtsoTypCdList').setData({
           data:option_data
			});


	};

	this.setGrid = function(page, rowPerPage){

   	 $('#pageNo').val(page);
   	 $('#rowPerPage').val(rowPerPage);
   	 var param =  $("#searchForm").serialize();

   	 $('#'+gridId).alopexGrid('showProgress');
   	 // MtsoOpCurstController.java
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getCstrCdMtsoList', param, 'GET', 'search');
   }



	this.setSPGrid = function(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : 10000, 		//총 데이터 길이
	      		current 	: 1, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: 100 	//한 페이지에 보일 데이터 갯수
	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
	}

	function successCallback(response, status, jqxhr, flag){
		//본부 콤보박스
		if(flag == 'searchInspectCd'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

		if(flag == 'cstrCdYn'){
			var itemId = null;
			if(response.CstrCdYn.length > 0){
	    			itemId = response.CstrCdYn[0].itemId;
			}
			if (itemId != null && itemId != undefined ) {
				var data = {itemId : itemId};
	 			var drawTool = $a.popup({
	 				title: '드로잉 툴',
	 				url: '/tango-transmission-web/configmgmt/upsdmgmt/DrawTool.do?itemId='+itemId+'&cstrGubun='+tmpCstrGubun+'&cstrCd='+tmpCstrCd,
	 				data: '',
	 				iframe: false,
	 				windowpopup: true,
	 				movable:false,
	 				width : screen.availWidth,
	 				height : screen.availHeight,
	 				callback: function(data) {
	 				}
	 			});
	 			self.close();
			}
		}


		if(flag == 'fstOrg'){
			var sUprOrgId = "";
			if($("#sUprOrgId").val() != ""){
				 sUprOrgId = $("#sUprOrgId").val();
			}
			$('#orgId').clear();

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
		    		$('#orgId').setData({
						data:option_data ,
						orgId:selectId
					});
	   		}
	   		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + sUprOrgId, null, 'GET', 'fstTeam');
	   	}

		if(flag == 'fstTeam'){
    		var sOrgId = "";
  			if($("#sOrgId").val() != ""){
  				sOrgId = $("#sOrgId").val();
  			}

  			$('#teamId').clear();

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
  	    		$('#teamId').setData({
  					data:option_data ,
  					teamId:selectId
  				});
  	    		if($('#teamId').val() != ""){
  	    			sOrgId = selectId;
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/' + sOrgId, null, 'GET', 'tmof');
  	    		}else{
  	    			$('#teamId').setData({
  	  					teamId:""
  	  				});
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
  	    		}
      		}
    	}
		if(flag == 'team'){
    		$('#teamId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#teamId').setData({
                 data:option_data
    		});
    	}
		if(flag == 'tmof'){
    		$('#tmofList').clear();

    		var option_data = [{mtsoId: "",mgmtGrpCd: "",mtsoNm: configMsgArray['all']}];

    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);

    		}

    		$('#tmofList').setData({
                 data:option_data
    		});
    	}


		if(flag == 'mtsoCntrTypCdList') {
    		$('#mtsoCntrTypCdList').clear();

    		var option_data =  [];

			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}

			$('#mtsoCntrTypCdList').setData({
	             data:option_data
			});
    	}

		if(flag == 'opTeam'){
    		$('#opTeamOrgId').clear();
    		var option_data =  [{orgId: "", orgNm: configMsgArray['all'],uprOrgId: ""}];


    		for(var i=0; i<response.length; i++){
    			var resObj = response[i];
    			option_data.push(resObj);
    		}

    		$('#opTeamOrgId').setData({
                 data:option_data
    		});
    	}

		//용도구분
		if(flag == 'searchGubun'){
			var option_data = [{cd: '', cdNm: '선택하세요'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#'+flag).setData({
				data : option_data,
				option_selected: ''
			});
		}

	 	// 국사 트리 조회
    	if(flag == 'search'){

    		$('#'+gridId).alopexGrid('hideProgress');
			$('#'+gridId).alopexGrid('dataSet', response.CstrCdMtsoList);


    	}


		if(flag == 'searchAssetCd'){
			var option_data = [{cd: '', cdNm: '선택'}];
			for(var i=0; i<response.length; i++){
				var resObj = response[i];
				option_data.push(resObj);
			}
			$('#assetCd').setData({
				data : option_data,
				assetCd: paramData.assetCd
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


    function popup(pidData, urlData, titleData, paramData) {
        $a.popup({
        		popid: pidData,
              	title: titleData,
              	url: urlData,
              	data: paramData,
				iframe: false,
				modal: true,
				movable:true,
				width : 800,
				height : window.innerHeight * 0.61
              });
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
    	$('#'+gridId).alopexGrid('updateOption', {paging : {hidePageList: false}});

    	var serverPageinfo = {
    			dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
    			current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
    			perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
    	};
    	$('#'+gridId).alopexGrid('dataSet', Data, serverPageinfo);
    }

});