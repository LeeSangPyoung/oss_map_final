/**
 * LineVrfDtlRpt.js
 *
 * @author Administrator
 * @date 2017. 9. 13.
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
        //main.setGrid();
    };

  //Grid 초기화
    function initGrid() {

        //그리드 생성
        $('#'+gridId).alopexGrid({
        	paging : {
        		//pagerSelect: [100,300,500,1000,5000],
               hidePageList: true  // pager 중앙 삭제
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
				width: '30px',
				numberingColumn: true
    		}, {/* 고객번호 */
    			align:'center',
				key : 'svlnCustNo',
				title : '고객번호',
				width: '70px'
			}, {/* 회선명 */
    			align:'center',
				key : 'custName',
				title : '회선명',
				width: '100px'
			}, {/* 회선번호 */
    			align:'center',
				key : 'svlnNo',
				title : '회선번호',
				width: '75px'
			}, {/* 가입자서비스번호 */
    			align:'center',
				key : 'scrbSrvcMgmtNo',
				title : '가입자서비스번호',
				width: '75px'
			}, {/* 상위국 */
    			align:'center',
				key : 'uprMtsoId',
				title : '상위국ID',
				width: '70px',
				hidden : true
			}, {/* 상위국 */
    			align:'center',
				key : 'uprMtsoNm',
				title : '상위국',
				width: '70px'
			}, {/* 하위국 */
    			align:'center',
				key : 'lowMtsoId',
				title : '하위국ID',
				width: '70px',
				hidden : true
			}, {/* 하위국 */
    			align:'center',
				key : 'lowMtsoNm',
				title : '하위국',
				width: '70px'
			}, {/* 회선 검증 상태 */
    			align:'center',
				key : 'lineStatDesc',
				title : '회선 검증 상태',
				width: '150px'
			}, {/* 선번별 검증여부*/
    			align:'center',
				key : 'vrfCnclCnt',
				title : '선번별 검증 여부',
				width: '75px'
			}, {/* 선번별 검증 상태 */
    			align:'center',
				key : 'eqpStatVal',
				title : '선번별 검증 상태',
				width: '75px'
			}, {/* 장비명 */
    			align:'center',
				key : 'eqpNm',
				title : '장비명',
				width: '70px'
			}, {/* 실장 국사 */
    			align:'center',
				key : 'mtsoNm',
				title : '실장국사',
				width: '70px'
			}, {/* 선번 검증 내역 */
    			align:'center',
				key : 'eqpStatDesc',
				title : '선번 검증 내역',
				width: '100px',
				render: function(value, data, render, mapping){
					if(value == 'NONE'){
						return '검증 안한 상태'
					}
					if(value == 'FAIL_NOT_EQUAL_PREV_EQP_MTSO'){
						return '이전 장비 국사와 불일치'
					}
					if(value == 'FAIL_NOT_EQUAL_NEXT_EQP_MTSO'){
						return '다음 장비 국사와 불일치'
					}
					if(value == 'FAIL_NOT_EQUAL_UPPER_MTSO'){
						return '첫번째 또는 마지막 장비 국사가 상위국과 불일치'
					}
					if(value == 'FAIL_NOT_EQUAL_LOWER_MTSO'){
						return '첫번째 또는 마지막 장비 국사가 하위국과 불일치'
					}
					if(value == 'MAIL_PORT_NULL'){
						return 'A, B 포트 모두 입력 안한 경우'
					}
					if(value == 'EXCEPT_VERIFY_PATH_NODE'){
						return '검증 대상에서 제외된 선번 노드'
					}
					if(value == 'EXCEPT_VERIFY_LINE'){
						return '검증 대상에서 제외된 회선 선번'
					}
					if(value == 'NOTHING_PATH'){
						return '선번이 없는 경우'
					}
					if(value == 'FAIL_UNKNOWN_ERROR'){
						return '시스템 오류로 검증 실패'
					}
				}
			}
			],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
        });

        //gridHide();
    };

    // 컬럼 숨기기
    function gridHide() {
    	var hideColList = [''];
    	$('#'+gridId).alopexGrid("hideCol", hideColList, 'conceal');
	}

    //처음 로딩시 콤보박스에 출력한 데이터를 가져온다.
    function setSelectCode() {
		var chrrOrgGrpCd;
		if($("#chrrOrgGrpCd").val() == ""){
			chrrOrgGrpCd = "SKT";
		} else {
			chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
		}

	    //본부 조회
		//httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/group/C00188', null, 'GET', 'mgmtGrpNm');
	    httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+'SKB', null, 'GET', 'fstOrg');
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
    		 main.setGrid();
         });

    	//엔터키로 조회
         $('#searchForm').on('keydown', function(e){
     		if (e.which == 13  ){
     			main.setGrid();
       		}
     	 });

    	 //검증 상태 설명
    	 $('#btnInfo').on('click', function(e) {
    		 popup('LineVrfDtlRptPopUp', $('#ctx').val()+'/configmgmt/tnbdgm/LineVrfDtlRptPopUp.do', '검증 상태 설명', '');
    	 });

    	$('#mgmtGrpNm').on('change', function(e) {
			//var mgmtGrpNm = $("#mgmtGrpNm").val();
			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/orgGrp/'+ 'SKB', null, 'GET', 'fstOrg');
		});

         //본부 선택시 이벤트
    	 $('#orgId').on('change', function(e) {
    		 var orgID =  $("#orgId").getData();

    		 if(orgID.orgId == ''){
    			// var mgmtGrpNm = $("#mgmtGrpNm").val();
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/teamGrp/'+ 'SKB', null, 'GET', 'team');
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ 'SKB', null, 'GET', 'tmof');

    		 }else{
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/org/' + orgID.orgId, null, 'GET', 'team');
    			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + orgID.orgId+'/ALL', null, 'GET', 'tmof');
    		 }
         });

    	// 팀을 선택했을 경우
    	 $('#team').on('change', function(e) {
    		 var orgID =  $("#orgId").getData();
    		 var teamID =  $("#team").getData();

    		 if(orgID.orgId == '' && teamID.teamId == ''){
     	 		// var mgmtGrpNm = $("#mgmtGrpNm").val();
    		     httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmofs/'+ 'SKB', null, 'GET', 'tmof');
     	 	 }else if(orgID.orgId == '' && teamID.teamId != ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/ALL/'+teamID.orgId, null,'GET', 'tmof');
     		 }else if(orgID.orgId != '' && teamID.teamId == ''){
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/ALL', null,'GET', 'tmof');
     		 }else {
     			 httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/'+orgID.orgId+'/'+teamID.teamId, null,'GET', 'tmof');
     		 }
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


        		 param.fileName = '회선 검증 오류 세부 현황';
        		 param.fileExtension = "xlsx";
        		 param.excelPageDown = "N";
        		 param.excelUpload = "N";
        		 param.method = "getLineVrfDtlRptList";

        		 $('#'+gridId).alopexGrid('showProgress');
     	    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/lineVrfDtlRptListExcelcreate', param, 'GET', 'excelDownload');
             });
	};

	/*------------------------*
	 * 엑셀 ON-DEMAND 다운로드
	 *------------------------*/

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
		//관리그룹
    	if(flag == 'mgmtGrpNm'){

    		var chrrOrgGrpCd;
			 if($("#chrrOrgGrpCd").val() == ""){
				 chrrOrgGrpCd = "SKT";
			 }else{
				 chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
			 }

    		$('#mgmtGrpNm').clear();

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

    		var chrrOrgGrpCd;
    		if($("#chrrOrgGrpCd").val() == ""){
				chrrOrgGrpCd = "SKT";
			}else{
				chrrOrgGrpCd = $("#chrrOrgGrpCd").val();
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
  	    			httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/tmof/' + $('#orgId').val() +'/ALL', null, 'GET', 'tmof');
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

	 	// 조회
    	if(flag == 'search'){
    		$('#'+gridId).alopexGrid('hideProgress');
    		setSPGrid(gridId, response.lineVrfDtlRptList);
    	}

    	//엑셀다운로드
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
/*
    this.setGrid = function(page, rowPerPage){
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);

 		 var param =  $("#searchForm").serialize();

 		 $('#'+gridId).alopexGrid('showProgress');
		 httpRequest('tango-transmission-biz/transmisson/configmgmt/upsdmgmt/getUpsdEqpMgmtList', param, 'GET', 'search');
    }
*/

    this.setGrid = function(){
    	var param =  $("#searchForm").serialize();
    	$('#'+gridId).alopexGrid('showProgress');
    	httpRequest('tango-transmission-biz/transmisson/configmgmt/tnbdgm/getLineVrfDtlRptList', param, 'GET', 'search');
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
				height : window.innerHeight * 0.45
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

    //function setSPGrid(GridID,Option,Data) {
    function setSPGrid(GridID,Data) {
    	/*
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 		//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};
		*/
		//$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);
		$('#'+GridID).alopexGrid('dataSet', Data);
	}

});