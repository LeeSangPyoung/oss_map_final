/**
 * WreEqpDsnRsltMgmt.js
 *
 * @author P182022
 * @date 2022. 08. 10. 오전 11:20:03
 * @version 1.0
 */
var main = $a.page(function() {
   	var perPage1 		= 100;
   	var perPage2 		= 100;

	var gridTab1 		= 'gridTab1';
	var gridTab2 		= 'gridTab2';

	var mTagetIdx 		= 1;
	var mTagetGrid 		= gridTab1;

	var mAreaYear1		= '';
	var mAreaYear2		= '';
	var mTabChgDgr		= '';

	var mBizPurpCmb1	= [];
	var mBizPurpCmb2	= [];
	var mBizDivCmb1		= [];
	var mBizDivCmb2		= [];
	var mEqpDivCmb		= [];
	var mDsnEqpCmb		= [];
	var mDemdEqpCmb		= [];
	var mEqpUnitCmb		= [];
	var mEqpVndrCmb		= [];

	var mDsnWoYnCmb1	= [{value : 'N', text : 'NO'},{value : 'Y', text : 'YES'}];
	var mDsnWoYnCmb2	= [{value : 'N', text : 'NO'},{value : 'Y', text : 'YES'}];

	var mHdofcCmb 	= [];

	var mAreaId_1 	= [{value : 'T11001', text : '수도권'}];
	var mAreaId_2 	= [{value : 'T12001', text : '대구'},{value : 'T12002', text : '부산'}];
	var mAreaId_3 	= [{value : 'T13001', text : '서부'},{value : 'T13003', text : '제주'}];
	var mAreaId_4 	= [{value : 'T14001', text : '세종'},{value : 'T14002', text : '강원'},{value : 'T14003', text : '충청'}];

	var mMtsoType 	=  [{value: "1",text: "전송실"}, {value: "2",text: "중심국사"}, {value: "3",text: "기지국사"}, {value: "4",text: "국소"} ];
	var mDsnRsltYn =  [{value: "Y",text: "반영"}, {value: "N",text: "미반영"}];

	var mOrgId		= $("#orgId").val();
	var mOrgNm		= $("#orgNm").val();
	var mOrgCd		= "";

    this.init = function(id, param) {

		if(mOrgNm.indexOf('수도권') > -1){
			mOrgCd = '5100';
		}else if(mOrgNm.indexOf('동부') > -1){
			mOrgCd = '5300';
		}else if(mOrgNm.indexOf('서부') > -1){
			mOrgCd = '5500';
		}else if(mOrgNm.indexOf('중부') > -1){
			mOrgCd = '5600';
		}

		$('#spanTitle').text("유선망 통합설계 수요검토");

    	setEventListener();
    	setSelectCode();

    	initGrid();

//    	setEditData('2', 'cancel');

    };

    function setEventListener() {
    	//탭변경 이벤트
    	$('#basicTabs').on("tabchange", function(e, index) {
			switch (index) {
			case 0 :
				mTagetIdx 	= 1;
				mTagetGrid 	= gridTab1;
				$('#spanTitle').text("유선망 통합설계 수요검토");
				break;
			case 1 :
				mTagetIdx 	= 2;
				mTagetGrid 	= gridTab2;
				$('#spanTitle').text("유선망 통합설계 설계결과");
				break;
			default :
				mTagetIdx 	= 1;
				mTagetGrid 	= gridTab1;
				$('#spanTitle').text("유선망 통합설계 수요검토");
				break;
			}

			$('#'+mTagetGrid).alopexGrid("viewUpdate");
    	});

    	// 페이지 번호 클릭시
   	 	$('#'+gridTab1).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab1).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage1 = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });

    	// 페이지 번호 클릭시
   	 	$('#'+gridTab2).on('pageSet', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	setFormData(eObj.page, eObj.pageinfo.perPage);
        });

   	 	//페이지 selectbox를 변경했을 시.
        $('#'+gridTab2).on('perPageChange', function(e){
        	var eObj = AlopexGrid.parseEvent(e);
        	perPage2 = eObj.perPage;
        	setFormData(1, eObj.perPage);
        });

    	//국사명 엔터키로 조회
        $('#demdMtsoNm1').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1,perPage1);
      		}
    	 });

    	//검토자 엔터키로 조회
        $('#rvUserNm1').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1,perPage1);
      		}
    	 });

    	//제조사 엔터키로 조회
        $('#splyVndrNm2').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1,perPage2);
      		}
    	 });

    	//국사명 엔터키로 조회
        $('#mtsoNm2').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1,perPage2);
      		}
    	 });

    	//설계근거 엔터키로 조회
        $('#reltBsisCtt2').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1,perPage2);
      		}
    	 });

    	//설계방식 엔터키로 조회
        $('#fhOnafMeansNm2').on('keydown', function(e){
    		if (e.which == 13  ){
    			setFormData(1,perPage2);
      		}
    	 });

        // 수요검토/설계결과 검색
    	$("#btnSearch1").on("click", function(e) {
    		setFormData(1, perPage1);
    	});
    	$("#btnSearch2").on("click", function(e) {
    		setFormData(1, perPage2);
    	});

        // 수요검토/설계결과 행복사
        for(var i = 1; i <= 2; i++){
            $("#btnCopyRow"+i).on("click", function(e) {
        		setGridCopyRow();
        	});
        }

        // 수요검토/설계결과 행추가
        for(var i = 1; i <= 2; i++){
        	$("#btnAddRow"+i).on("click", function(e) {
        		setGridAddRow();
        	});
        }

        // 수요검토/설계결과 저장
        for(var i = 1; i <= 2; i++){
        	$("#btnSave"+i).on("click", function(e) {
        		setEqpDsnSaveData();
        	});
        }

        // 설계로직 삭제
        for(var i = 1; i <= 2; i++){
        	$("#btnDeleteRow"+i).on("click", function(e) {
        		setGridRowDel();
        	});
        }

//        $("#btnFixRow").on("click", function(e) {
//        	setEditData('2', 'edit');
//    	});

//        $("#btnCancelRow").on("click", function(e) {
//        	setEditData('2', 'cancel');
//    	});

		// 엑셀 다운로드
        $('#btnExcelDown1').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e,'RV');
		});

		// 엑셀 다운로드
        $('#btnExcelDown2').on('click', function(e) {
        	btnExportExcelOnDemandClickEventHandler(e,'RSLT');
		});

    	// cell editing
        $('#'+gridTab1).on('cellValueEditing', function(e) {
        	setCellValueEditing(e);
    	});

    	// cell editing
        $('#'+gridTab2).on('cellValueEditing', function(e) {
        	setCellValueEditing(e);
    	});

        //AFE 차수
    	$("#afeYr1").on("change", function(e) {
    		mAreaYear1 = $("#afeYr1").val();
        	if(mAreaYear1 == ''){
        		$("#afeDemdDgr1").empty();
    			$("#afeDemdDgr1").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr1").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};

	        	selectAfeDemdDgrCode('afeDemdDgr1', dataParam);
        	}

        	initBizDivCode('bizDivCd1');
        	selectBizPurpCode('bizPurpCd1', mAreaYear1);
    	});

    	$("#afeYr2").on("change", function(e) {
    		mAreaYear2 = $("#afeYr2").val();
        	if(mAreaYear2 == ''){
        		$("#afeDemdDgr2").empty();
    			$("#afeDemdDgr2").append('<option value="">'+demandMsgArray['all']+'</option>'); // 전체
    			$("#afeDemdDgr2").setSelected("");
        	}else{
	        	var dataParam = {
	        			afeYr : this.value
	    		};
	        	selectAfeDemdDgrCode('afeDemdDgr2', dataParam);
        	}

        	initBizDivCode('bizDivCd2');
        	selectBizPurpCode('bizPurpCd2', mAreaYear2);
    	});

    	// 본부코드 선택
    	$("#hdofcCd1").on("change", function(e) {
			var supCd = $("#hdofcCd1").val();
			selectAreaCode("areaId1", supCd);

    	});
    	$("#hdofcCd2").on("change", function(e) {
			var supCd = $("#hdofcCd2").val();
			selectAreaCode("areaId2", supCd);
    	});

    	// 사업목적코드 선택
    	$("#bizPurpCd1").on("change", function(e) {
			selectBizDivCode("bizPurpCd1","bizDivCd1");

    	});
    	$("#bizPurpCd2").on("change", function(e) {
			selectBizDivCode("bizPurpCd2","bizDivCd2");
    	});

    	// 설계대상 선택
    	$("#eqpDivCd1").on("change", function(e) {
    		var option_data =  grdDsnEqpDivCd(this.value);

    		$('#demdEqpCd1').setData({data:option_data});

    	});

    	// BPM 연동 팝업
        $('#btnBpmLnkg1').on('click', function(e) {
        	var dataParam = getPopParamData('BPM');
         	popup('RsltObjBpmPop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpRvRsltObjBpmPop.do', 'BPM 연동', dataParam);
        });

    	// 용량증설 팝업
        $('#btnCapaIcre1').on('click', function(e) {
        	var dataParam = getPopParamData('CAPA');
         	popup('RsltObjIcrePop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpRvRsltObjIcrePop.do', '용량증설', dataParam);
        });

    	// 엑셀 업로드 팝업
        $('#btnExcelUpLoad1').on('click', function(e) {
        	var dataParam = getPopParamData('EXCD');
        	popup('RsltObjExcelPop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpRvRsltObjExcelPop.do', '엑셀 업로드', dataParam);
        });

    	// 수요검토반영 팝업
        $('#btnRvReflct2').on('click', function(e) {
        	var dataParam = getPopParamData('REFLCT');
        	popup('RsltObjPop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpRvRsltObjPop.do', '수요검토반영', dataParam);
        });

    	// 유선수요반영
        $('#btnRsltReflct2').on('click', function(e) {
        	setGridRsltReflct();
        });

        // 본부통계 팝업
        $('#btnHdofcStc').on('click', function(e) {
        	var dataParam = {
        			popType 	: "HDOFC",
        			afeYr		: $('#afeYr2').val(),
        			afeDemdDgr	: $('#afeDemdDgr2').val(),
        	};
        	popup('RsltHdofcStcPop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpRsltHdofcStcPop.do', '본부통계', dataParam);
        });

    	// 사업목적통계 팝업
        $('#btnBizPurpStc').on('click', function(e) {
        	var dataParam = {
        			popType 	: "PURP",
        			afeYr		: $('#afeYr2').val(),
        			afeDemdDgr	: $('#afeDemdDgr2').val(),
        	};
        	popup('RsltBizPurpStcPop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpRsltBizPurpStcPop.do', '사업목적통계', dataParam);
        });

     //  자재통계 팝업
        $('#btnMatlStc').on('click', function(e) {
        	var dataParam = {
        			popType 	: "PURP",
        			afeYr		: $('#afeYr2').val(),
        			afeDemdDgr	: $('#afeDemdDgr2').val(),
        	};
        	popup('RsltBizPurpStcPop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpRsltMatlStcPop.do', '자재통계', dataParam);
        });

        // 2023 유선Eng 고도화 - BPM수요통계 팝업
        $('#btnBpmDemdStc1').on('click', function(e) {
        	var dataParam = {
        			popType 	: "DEMD",
        			afeYr		: $('#afeYr1').val(),
        			afeDemdDgr	: $('#afeDemdDgr1').val(),
        	};
         	popup('BpmDemdStcPop', '/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpBpmDemdStcPop.do', 'BPM수요통계', dataParam);
        });

        //첫번째 row를 클릭했을때 팝업 이벤트 발생
        $('#'+gridTab1).on('click', '.bodycell', function(e){
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridTab1).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			var row = dataObj._index.row;
			if(rowData._key == "mtsoLkupIcon" || rowData._key == "lnkgMtsoLkupIcon"){
				// 국사팝업 호출
				callMtsoLkupPop(gridTab1,dataObj,rowData._key);
			}else if(rowData._key == "splyVndrCdIcon"){
				// 제조사 팝업 호출
				callBpListPopup(gridTab1,dataObj,rowData._key);
			}else if(rowData._key == "cardPortUseListIcon"){ //2023 통합국사 고도화 - 카드/포트 사용현황 조회 추가
				callCardPortUseListPop(gridTab1,dataObj,rowData._key);
			}else if(rowData._key == "reviewListIcon"){ //2024 유선엔지니어링(TES)고도화 - 수요검토 자료 조회 추가
				// 검토내역 팝업 호출
				callReviewListPopup(gridTab1, dataObj, rowData._key);
			}else if(rowData._key == "mapIcon"){ //2024 유선엔지니어링(TES)고도화 - 엔지니어링 맵 호출용
				// 검토내역 팝업 호출
				callEngMapPopup(gridTab1, dataObj, rowData._key);
			}
        });

    	//첫번째 row를 클릭했을때 팝업 이벤트 발생
        $('#'+gridTab2).on('click', '.bodycell', function(e){
	  		var ev = AlopexGrid.parseEvent(e);
			var dataObj = ev.data;
			var rowData = $('#'+gridTab2).alopexGrid("dataGetByIndex" , {data : dataObj._index.row });

			var row = dataObj._index.row;

			if(rowData._key == "mtsoIdIcon"){
				// 국사팝업 호출
				callMtsoLkupPop(gridTab2,dataObj,rowData._key);
			}else if(rowData._key == "splyVndrCdIcon"){
				// 제조사 팝업 호출
				callBpListPopup(gridTab2,dataObj,rowData._key);
			}else if(rowData._key == "cardPortUseListIcon"){ //2023 통합국사 고도화 - 카드/포트 사용현황 조회 추가
				callCardPortUseListPop(gridTab2,dataObj,rowData._key);
			}else if(rowData._key == "reviewListIcon"){ //2024 유선엔지니어링(TES)고도화 - 수요검토결과 자료 조회 추가
				// 검토내역 팝업 호출
				callReviewResultListPopup(gridTab2, dataObj, rowData._key);
			}else if(rowData._key == "lnInvtIcon"){ //2024  경로분석 조회(TES) 추가
				// TES 경로분석 조회
				callTesRouteanListPopup(gridTab2,dataObj,rowData._key);
			}else if(rowData._key == "mapIcon"){ //2024 유선엔지니어링(TES)고도화 - 엔지니어링 맵 호출용
				// 검토내역 팝업 호출
				callEngMapPopup(gridTab2, dataObj, rowData._key);
			}
        });

        $('#btnEngMap1').on('click', function(e) {
        	callEngMapPopup();
        });
	}


    // 통합 국사 시설 탭 팝업
	this.goMtsoPopup = function(mtsoId){

    	var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;
    	var paramData = {mtsoEqpGubun :'mtso', mtsoEqpId : mtsoId, linkTab : 'tab_Fclt', parentWinYn : 'Y'};
		var popMtsoEqp = $a.popup({
			popid: tmpPopId,
			title: '통합 국사/장비 정보',
			url: '/tango-transmission-web/configmgmt/commonlkup/ComLkup.do',
			data: paramData,
			iframe: false,
			modal: false,
			movable:false,
			windowpopup: true,
			width : 900,
			height : window.innerHeight
		});
	}

    // 수요검토 탭 화면 이동
	this.goDemdRvTabGrid = function(afeYr,afeDemdDgr,dsnRsltSeq){

		$('#basicTabs').setTabIndex(0);
		$('#'+gridTab1).alopexGrid("viewUpdate");

		var param	= {
				afeYr		: afeYr,
				afeDemdDgr	: afeDemdDgr,
				dsnRsltSeq	: dsnRsltSeq
		}

    	$('#'+mTagetGrid).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getEqpDemdRvForPage', param, 'GET', 'demdSearch');
	}

    // 국사팝업 호출
    function callMtsoLkupPop(gridId, dataObj, flag){
    	var row = dataObj._index.row;

		$a.popup({
        	popid: "MtsoLkupPop",
        	title: "국사ID 조회",
            url: "/tango-transmission-web/configmgmt/common/MtsoLkup.do",
            windowpopup : false,
            modal: true,
            movable:true,
            width : 950,
            height : 800,
            callback: function(data) {
             	if(flag == "mtsoLkupIcon"){
             		if(gridId == "gridTab1" //수요검토탭
             			&& dataObj.eqpDivCd == "DL06" //백본
             			){
             			//수용국사 선택시 연동국사 정보를 동시에 입력
             			$('#'+gridId).alopexGrid("dataEdit", {
             				demdMtsoId 	: data.mtsoId,
             				demdMtsoNm 	: data.mtsoNm,
             				mtsoTypCd	: data.mtsoTypCd,
             				lowBldAddr	: data.bldAddr,
             				lowSiteCd	: data.siteCd,

             				lnkgMtsoId 	: data.mtsoId,
                    		lnkgMtsoNm 	: data.mtsoNm,
                    		uprBldAddr	: data.bldAddr,
                    		uprSiteCd	: data.siteCd
             			}, {_index:{data : row}});
             		}else{
	            	$('#'+gridId).alopexGrid("dataEdit", {
	            		demdMtsoId 	: data.mtsoId,
	            		demdMtsoNm 	: data.mtsoNm,
	            		mtsoTypCd	: data.mtsoTypCd,
	            		lowBldAddr	: data.bldAddr,
	            		lowSiteCd	: data.siteCd
					}, {_index:{data : row}});
             		}

            	}else if(flag == "lnkgMtsoLkupIcon"){
                	$('#'+gridId).alopexGrid("dataEdit", {
                		lnkgMtsoId 	: data.mtsoId,
                		lnkgMtsoNm 	: data.mtsoNm,
                		uprBldAddr	: data.bldAddr,
                		uprSiteCd	: data.siteCd
    				}, {_index:{data : row}});
            	}else if(flag == "mtsoIdIcon"){
	            	$('#'+gridId).alopexGrid("dataEdit", {
	            		mtsoId 		: data.mtsoId,
	            		mtsoNm 		: data.mtsoNm,
	            		mtsoTypCd	: data.mtsoTypCd,
	            		bldAddr		: data.bldAddr,
	            		siteCd		: data.siteCd
					}, {_index:{data : row}});
            	}

            	if($.TcpMsg.isEmpty(dataObj.flag)) {
	            	$('#'+gridId).alopexGrid('cellEdit', 'MOD', {_index:{row:row}}, 'flag');
	            	$('#'+gridId).alopexGrid('rowSelect',{_index:{row:row}}, true);
            	}
           	}
        });
    }

    // 제조사 팝업 호출
    function callBpListPopup(gridId, dataObj, flag){
    	var row = dataObj._index.row;

		$a.popup({
        	popid: "VendPop",
        	title: "제조사 조회",
        	url: "/tango-common-business-web/business/popup/PopupBpList.do",
        	windowpopup : true,
        	modal: true,
            movable:true,
            width : 950,
            height : window.innerHeight * 0.83,
            callback: function(data) {
            	$('#'+gridId).alopexGrid("dataEdit", {
            		splyVndrCd 	: data.bpId,
            		splyVndrNm 	: data.bpNm
				}, {_index:{data : row}});

            	if($.TcpMsg.isEmpty(dataObj.flag)) {
	            	$('#'+gridId).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
	            	$('#'+gridId).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);
            	}
           	}
        });
    }

    // 2023 통합국사 고도화 - 카드/포트 사용 현황팝업 호출
    function callCardPortUseListPop(gridId, dataObj, flag){
    	var row = dataObj._index.row;

    	if(dataObj.eqpDivCd == "DL01" //백홀(5G)
    		|| dataObj.eqpDivCd == "DL06" //백본
        	|| dataObj.eqpDivCd == "DL02" //프론트홀
    		|| dataObj.dsnDivCd == "DL01" //백홀(5G)
        	|| dataObj.dsnDivCd == "DL02" //프론트홀
    		|| dataObj.dsnDivCd == "DL06" //백본
    		){

    		var paramData = {};
    		if(gridId == "gridTab1"){ //수요검토

    			paramData.mtsoId = dataObj.lnkgMtsoId;
    			paramData.mtsoNm = dataObj.lnkgMtsoNm;
    			paramData.eqpDivCd = dataObj.eqpDivCd;
    			paramData.eqpDivNm = dataObj.eqpDivNm;
    		}else if(gridId == "gridTab2"){ //설계결과

    			paramData.mtsoId = dataObj.mtsoId;
    			paramData.mtsoNm = dataObj.mtsoNm;
    			paramData.eqpDivCd = dataObj.dsnDivCd;
    		}

    		$a.popup({
    			popid: "CardPortUseListPop",
    			title: "카드/포트 사용 현황 조회",
    			url: "/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/MtsoCardPortUsePop.do",
    			data: paramData,
    			windowpopup : true,
    			modal: true,
    			movable:true,
    			width : 1050,
    			height : 650,
    			callback: function(data) {
    				console.log("CardPortUseListPop callback data : ", data);
    			}
    		});
    	} else {
    		callMsgBox('','I', "해당 설계대상은 추후 구현될 예정입니다.", function(msgId, msgRst){});
     		return;
    	}
    }

    // 2024 유선엔지니어링(TES) 고도화 추가
    function callReviewListPopup(gridId, dataObj, flag){
		var paramData = {
				objMgmtNo : dataObj.objMgmtNo,
				demdRvSeq : dataObj.demdRvSeq,
				regMeansNm : dataObj.regMeansNm
		};

		$a.popup({
			popid: "ReviewListPopup",
			title: "수요검토 연동내역",
			url: "/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpDemdRvHstListPop.do",
			data: paramData,
			windowpopup : true,
			modal: true,
			movable:true,
			width : 1050,
			height : 650,
			callback: function(data) {
				console.log("ReviewListPopup callback data : ", data);
			}
		});
    }

	//2024 유선엔지니어링(TES) 고도화 추가 - 유선엔지니어링 맵 호출
    function callEngMapPopup(gridId, dataObj, flag){
    	let paramData = {};
    	let apiUri = "/tango-transmission-web/trafficintg/engineeringmap/EngMap.do";

    	if(gridId == undefined){
    		paramData = getParamData();

    		if (paramData.afeDemdDgr == null || paramData.afeDemdDgr == '' || paramData.afeDemdDgr == undefined) {
    			callMsgBox('','I', "AFE 년도/차수는 필수로 선택하셔야합니다.", function(msgId, msgRst){});
    			return;
    		}

    	}else if(gridId == gridTab1){
    		console.log("gridId 1: ", gridTab1);
    		console.log("dataObj 1: ", dataObj);

    		paramData.objMgmtNo = dataObj.objMgmtNo;
    		paramData.demdRvSeq = dataObj.demdRvSeq;
    		paramData.gridId = gridId;

    	}else if(gridId == gridTab2){
    		console.log("gridId 2: ", gridTab2);
    		console.log("dataObj 2: ", dataObj);

    		paramData.endObjMgmtNo = dataObj.endObjMgmtNo;
    		paramData.dsnRsltSeq = dataObj.dsnRsltSeq;
    		paramData.mtsoId = dataObj.mtsoId;
    		paramData.gridId = "EqpDsnRslt";

    	}

    	var tmpPopId = "M_"+Math.floor(Math.random() * 10) + 1;

    	$a.popup({
    		popid: tmpPopId,
    		title: '유선 엔지니어링 맵',
    		url: apiUri,
    		data: paramData,
    		windowpopup : true,
    		modal: false,
    		movable:false,
    		width : window.innerWidth,
        	height : window.innerHeight,
    		callback: function(data) {
    			console.log("callEngMapPopup callback data : ", data);
    		}
    	});
    }

    // 2024 유선엔지니어링(TES) 고도화 추가
    function callReviewResultListPopup(gridId, dataObj, flag){
    	var paramData = {
    			endObjMgmtNo : dataObj.endObjMgmtNo,
    			dsnRsltSeq : dataObj.dsnRsltSeq
    	};

    	$a.popup({
    		popid: "ReviewResultListPopup",
    		title: "수요검토결과 연동내역",
    		url: "/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/WreEqpDemdRvRsltHstListPop.do",
    		data: paramData,
    		windowpopup : true,
    		modal: true,
    		movable:true,
    		width : 1050,
    		height : 700,
    		callback: function(data) {
    			console.log("ReviewResultListPopup callback data : ", data);
    		}
    	});
    }

    // 2024 선로투자비 경로분석 조회(TES) 고도화 추가
    function callTesRouteanListPopup(gridId, dataObj, flag){
    	var row = dataObj._index.row;

    	if(dataObj.eqpDivCd == "DL01" //백홀(5G)
    		|| dataObj.eqpDivCd == "DL06" //백본
        	|| dataObj.eqpDivCd == "DL02" //프론트홀
    		|| dataObj.dsnDivCd == "DL01" //백홀(5G)
        	|| dataObj.dsnDivCd == "DL02" //프론트홀
    		|| dataObj.dsnDivCd == "DL06" //백본
    		){

    		var paramData = {};
			paramData.lowMtsoId = dataObj.mtsoId;
			paramData.srcReqIdVal = dataObj.endObjMgmtNo;
			paramData.srcReqSeqVal = dataObj.dsnRsltSeq;

    		$a.popup({
    			popid: "TesRouteanListPop",
    			title: "TES 경로 조회",
    			url: "/tango-transmission-web/configmgmt/eqpinvtdsnmgmt/TesRouteanInqPop.do",
    			data: paramData,
    			windowpopup : true,
    			modal: true,
    			movable:true,
    			width : 1200,
    			height : 850,
    			callback: function(data) {
    				console.log("CardPortUseListPop callback data : ", data);
    			}
    		});
    	} else {
    		callMsgBox('','I', "해당 설계대상은 추후 구현될 예정입니다.", function(msgId, msgRst){});
     		return;
    	}
    }

    function setSelectCode() {

    	//AFE 연차
    	selectAfeYrCode('afeYr1');
    	selectAfeYrCode('afeYr2');

    	//본부코드
    	selectHdofcCode('hdofcCd1');
    	selectHdofcCode('hdofcCd2');

    	//설계대상코드&수요장비
    	selectEqpDivCode('eqpDivCd');
    	selectDsnEqpCode('dsnEqpCd');
    	selectDemdEqpCode('demdEqpCd');

    	// 설계장비단위코드
    	selectDsnEqpUnitCode('dsnUnitCd');

    	//사업구분
    	initBizDivCode('bizDivCd1');
    	initBizDivCode('bizDivCd2');

		var option_data = [{cd: '', cdNm: '전체'}];
		//지역코드
		$('#areaId1').setData({ data : option_data, option_selected: '' });
		$('#areaId2').setData({ data : option_data, option_selected: '' });

		// 설계제외
		var option_data2 = [{cd: '', cdNm: '전체'},{cd: 'Y', cdNm: 'YES'},{cd: 'N', cdNm: 'NO'}];
		$('#dsnWoYn1').setData({ data : option_data2, option_selected: '' });

		// 삭제제외
		var option_data3 = [{cd: '', cdNm: '전체'},{cd: 'Y', cdNm: 'YES'},{cd: 'N', cdNm: 'NO'}];
		$('#delYn1').setData({ data : option_data3, option_selected: 'N' });
		$('#delYn1').setSelected('N');

		$('#delYn2').setData({ data : option_data3, option_selected: 'N' });
		$('#delYn2').setSelected('N');



		// 연동구분
		var option_data4 = [{cd: '', cdNm: '전체'},{cd: 'BPM연동', cdNm: 'BPM연동'},{cd: '용량증설', cdNm: '용량증설'},{cd: '엑셀연동', cdNm: '엑셀연동'},{cd: '추가입력', cdNm: '추가입력'}];
		$('#regMeansNm1').setData({ data : option_data4, option_selected: '' });

	}

	//사업구분코드 초기화
    function initBizDivCode(objId) {
		var param = [{cd: '', cdNm: '전체'}];

    	$("#"+objId).setData({ data : param, option_selected: '' });
    }

    // AFE 년차
    function selectAfeYrCode(objId) {
    	var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeyrlist', param, 'GET', objId);
	}

    // AFE 수요회차
    function selectAfeDemdDgrCode(objId, param) {

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAfeDemdDgrlist', param, 'GET', objId);
	}

    // 본부코드
    function selectHdofcCode(objId) {
		var param = {};//C00623

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getHdofcCode', param, 'GET', objId);
	}

    // 지역코드
    function selectAreaCode(objId, supCd) {
		var param = { supCd : supCd };

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getAreaCode', param, 'GET', objId);
	}

    // 사업목적코드
    function selectBizPurpCode(objId, afeYr) {
		var param = { afeYr : afeYr };

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getBizPurpCode', param, 'GET', objId);
    }

    // 사업구분코드
    function selectBizDivCode(objId1, objId2) {
		$('#'+objId2).clear();

		var bizPurpCd = $("#"+objId1).val();
    	var divCdList = [];

    	if(objId2 == 'bizDivCd1'){
    		divCdList = mBizDivCmb1[bizPurpCd];
    	}else{
    		divCdList = mBizDivCmb2[bizPurpCd];
    	}

		var option_data =  [{cd: "", cdNm: "전체"}];
		if(!$.TcpMsg.isEmpty(bizPurpCd)){
			for(var i=0; i<divCdList.length; i++){
				var resObj 		= {cd: divCdList[i].cd, cdNm: divCdList[i].cdNm};

				option_data.push(resObj);
			}
		}

		$('#'+objId2).setData({data:option_data});
    }

    // 설계대상코드
    function selectEqpDivCode(objId) {

		var param = {};

    	//httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getEqpDivCode', param, 'GET', objId);
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnLgcCode', param, 'GET', objId);
    }

    // 수요장비
    function selectDsnEqpCode(objId) {
		var param = {};

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnEqpCode', param, 'GET', objId);
    }

    // 장비구분
    function selectDemdEqpCode(objId) {
		var param = {};

    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDemdEqpCode', param, 'GET', objId);
    }

    // 설계장비단위코드 초회
    function selectDsnEqpUnitCode(objId) {
		var param = {};

		httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/com/getDsnEqpUnitCode', param, 'GET', objId);
    }

    // grid add Row
    function setGridAddRow() {
		var option 		= {_index:{data : 0}};
		var initRowData	= [];

		if(mTagetIdx == 1){
			 var afeYr 	= $("#afeYr1").val();
			 var afeDgr = $("#afeDemdDgr1").val();
			 if($.TcpMsg.isEmpty(afeDgr)){
				 callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
				 return;
			 }

			 initRowData = [{"flag" : "ADD",
				"afeYr" 			: afeYr,
				"afeDemdDgr"		: afeDgr,
				"hdofcCd" 			: $('#hdofcCd1').val(),
				"areaId"			: $('#areaId1').val(),
				"demdBizDivCd"		: $('#bizPurpCd1').val(),
				"lowDemdBizDivCd"	: $('#bizDivCd1').val(),
				"regMeansNm"		: '추가입력',
				"eqpDivCd"			: '',
				"demdMtsoId"		: '',
				"eqpRoleDivCd"		: '',
				"eqpDtlDivNm"		: '',
				"splyVndrCd"		: '',
				"dsnWoYn"			: 'N',
				"demdEqpQuty"		: 0,
				"dsnQuty"			: 1,
				"dsnRsltYn"			: 'N'
			 }];

		}else{
			 var afeYr 	= $("#afeYr2").val();
			 var afeDgr = $("#afeDemdDgr2").val();
			 if($.TcpMsg.isEmpty(afeDgr)){
				 callMsgBox('btnMsgWarning','I', "차수를 선택해 주십시오.");
				 return;
			 }

			 initRowData = [{"flag" : "ADD",
				"afeYr" 			: afeYr,
				"afeDemdDgr"		: afeDgr,
				"hdofcCd" 			: $('#hdofcCd2').val(),
				"areaId"			: $('#areaId2').val(),
				"demdBizDivCd"		: $('#bizPurpCd2').val(),
				"lowDemdBizDivCd"	: $('#bizDivCd2').val(),
				"dsnDivCd"			: '',
				"eqpDtlDivCd"		: '',
				"dsnUnitCd"			: '',
				"demdMtsoId"		: '',
				"eqpRoleDivCd"		: '',
				"splyVndrCd"		: '',
				"dsnWoYn"			: 'N',
				"demdEqpQuty"		: 0,
				"mtrlCost"			: 0,
				"invtCost"			: 0,
				"dsnQuty"			: 1,
				"inveQuty"          : 0,
				"buyQuty"           : 0,
				"invtCost"          : 0,
				"demdEqpQuty"       : 0,
				"dsnRsltYn"			: 'N',
				"reltBsisCtt"		: '',
				"fhOnafMeansNm"		: '추가입력'
			 }];
		}

		// 행추가 및 추가행 선택
		$("#"+mTagetGrid).alopexGrid('dataAdd', initRowData, option);
		$("#"+mTagetGrid).alopexGrid('rowSelect', option, true);
    }

    // 수요검토 행복사
    function setGridCopyRow(){
    	var initRowData	= [];
		var rowData = $('#'+mTagetGrid).alopexGrid('dataGet', {_state: {selected:true}});
		var copyData = AlopexGrid.trimData($('#'+mTagetGrid).alopexGrid('dataGet', { _state : { selected : true }}));

		if (rowData.length == 0) {
			callMsgBox('','I', configMsgArray['selectNoData'], btnMsgCallback);
			return;
		}

		for( var i = 0; i < rowData.length; i++){
			if($.TcpMsg.isEmpty(rowData[i].flag)){
				// 원본 Row 데이터 체크 없애기
		    	$("#"+mTagetGrid).alopexGrid('rowSelect', {_index:{data : rowData[i]._index.row}}, false);
			}

	    	// 행추가 및 추가행 선택
	    	var option 			= {_index:{data : 0}};
			var addData 		= copyData[i];
			addData.flag		= "ADD";
			addData.dsnQuty		= 1;
			addData.dsnQuty		= 1;
			addData.dsnQuty		= 1;
			addData.inveQuty	= 0;
			addData.buyQuty	    = 0;
			addData.invtCost	= 0;
			addData.demdEqpQuty	= 0;

			$("#"+mTagetGrid).alopexGrid('dataAdd', addData, option);
			$("#"+mTagetGrid).alopexGrid('rowSelect', option, true);
		}
    }

    // 조회
    function setFormData(page, rowPerPage) {
    	$('#pageNo').val(page);
    	$('#rowPerPage').val(rowPerPage);
    	//설계장비구분&단위 재 조회
    	selectDsnEqpUnitCode('dsnUnitCd');
    	selectDemdEqpCode('demdEqpCdFrom');

//    	setEditData('2', 'cancel');
    }

    // 검색조회
    function setFormExcData(){
    	var param = getParamData();
    	param.pageNo = $('#pageNo').val();
    	param.rowPerPage = $('#rowPerPage').val();

    	console.log("param : ", param);
    	$('#'+mTagetGrid).alopexGrid('showProgress');
    	httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getEqpRsltMgmtForPage', param, 'GET', 'search');
    }

    // 저장
    function setEqpDsnSaveData() {
    	$('#'+mTagetGrid).alopexGrid('endEdit'); // 편집종료

		var gridData = AlopexGrid.trimData($('#'+mTagetGrid).alopexGrid('dataGet', { _state : { selected : true }}));
		if (gridData.length == 0) {// 선택한 데이터가 존재하지 않을 시
			callMsgBox('btnMsgWarning','W', configMsgArray['selectNoData'], btnMsgCallback);
			return;

		} else if(gridData.length > 0) {

			if(mTagetGrid == gridTab1){

				for (var i=0;i < gridData.length; i++) {
						if($.TcpMsg.isEmpty(gridData[i].hdofcCd)){
							callMsgBox('btnMsgWarning','I', "본부를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].areaId)){
							callMsgBox('btnMsgWarning','I', "지사를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].demdBizDivCd)){
							callMsgBox('btnMsgWarning','I', "사업목적을 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].lowDemdBizDivCd)){
							callMsgBox('btnMsgWarning','I', "사업구분을 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].eqpDivCd)){
							callMsgBox('btnMsgWarning','I', "설계대상을 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].demdMtsoId)){
							callMsgBox('btnMsgWarning','I', "수요국사를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].eqpRoleDivCd)){
							callMsgBox('btnMsgWarning','I', "장비를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].splyVndrNm)){
							callMsgBox('btnMsgWarning','I', "벤더를 선택해 주십시오.");
							return false;
						}

						var demdEqpQuty = gridData[i].demdEqpQuty;
						if( /\D/.test(demdEqpQuty)){
							callMsgBox('btnMsgWarning','I', "수량은 숫자(0~9)만  입력해 주십시오.");
							return false;
						}
						if($.TcpMsg.isEmpty(demdEqpQuty) || demdEqpQuty < 0){
							callMsgBox('btnMsgWarning','I', "수량은 0 이상이어야 합니다.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].dsnWoYn)){
							callMsgBox('btnMsgWarning','I', "설계제외여부를 선택해 주십시오.");
							return false;
						}
				}
			}else if(mTagetGrid == gridTab2){

				for (var i=0;i < gridData.length; i++) {
//						var areaId = $("#areaId2").val();

//						if($.TcpMsg.isEmpty(areaId)){
//							callMsgBox('btnMsgWarning','I', "본부/지사를 선택해 주십시오.");
//							return false;
//						}
						if($.TcpMsg.isEmpty(gridData[i].hdofcCd)){
							callMsgBox('btnMsgWarning','I', "본부를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].areaId)){
							callMsgBox('btnMsgWarning','I', "지사를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].demdBizDivCd)){
							callMsgBox('btnMsgWarning','I', "사업목적을 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].lowDemdBizDivCd)){
							callMsgBox('btnMsgWarning','I', "사업구분을 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].dsnDivCd)){
							callMsgBox('btnMsgWarning','I', "설계대상을 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].eqpDtlDivCd)){
							callMsgBox('btnMsgWarning','I', "설계장비구분을 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].dsnUnitCd)){
							callMsgBox('btnMsgWarning','I', "설계장비단위를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].splyVndrCd)){
							callMsgBox('btnMsgWarning','I', "제조사를 선택해 주십시오.");
							return false;
						}

						if($.TcpMsg.isEmpty(gridData[i].mtsoId)){
							callMsgBox('btnMsgWarning','I', "국사명을 선택해 주십시오.");
							return false;
						}

						var dsnQuty = gridData[i].dsnQuty;
						var inveQuty = gridData[i].inveQuty;
						var buyQuty = gridData[i].buyQuty;
						var invtCost = gridData[i].invtCost;
						var demdEqpQuty = gridData[i].demdEqpQuty;

						if( /\D/.test(dsnQuty)){
							callMsgBox('btnMsgWarning','I', "설계수량은 숫자(0~9)만  입력해 주십시오.");
							return false;
						}
						if( /\D/.test(inveQuty) && inveQuty != null){
							callMsgBox('btnMsgWarning','I', "재고수량은 숫자(0~9)만  입력해 주십시오.");
							return false;
						}
						if( /\D/.test(buyQuty) && buyQuty != null){
							callMsgBox('btnMsgWarning','I', "구매수량은 숫자(0~9)만  입력해 주십시오.");
							return false;
						}
						if( /\D/.test(invtCost) && invtCost != null){
							callMsgBox('btnMsgWarning','I', "투자비는 숫자(0~9)만  입력해 주십시오.");
							return false;
						}
						if( /\D/.test(demdEqpQuty) && demdEqpQuty != null){
							callMsgBox('btnMsgWarning','I', "수요수량은 숫자(0~9)만  입력해 주십시오.");
							return false;
						}


						if($.TcpMsg.isEmpty(dsnQuty) || dsnQuty < 1){
							callMsgBox('btnMsgWarning','I', "설계수량은 1 이상이어야 합니다.");
							return false;
						}
				}
			}

			callMsgBox('saveConfirm','C', configMsgArray['saveConfirm'], btnMsgCallback);
		}
    }

	// 버튼 콜백 funtion
	var btnMsgCallback = function (msgId, msgRst) {
		if ('saveConfirm' == msgId && 'Y' == msgRst) {
			var gridData = AlopexGrid.trimData($('#'+mTagetGrid).alopexGrid('dataGet', function(data) {
				if ((data.flag == 'ADD' || data.flag == 'DEL' ||data.flag == 'MOD') && (data._state.selected == true)) {
					data.tabIdx = mTagetIdx;
					return data;
				}
			}));

			if(gridData.length > 0) {
				$('#'+mTagetGrid).alopexGrid('showProgress');
				httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/saveDsnRsltMgmtList', gridData, 'POST', 'afterSave');
			}else{
				callMsgBox('btnMsgWarning','W', '반영할 데이터가 없습니다.', btnMsgCallback);
			}
		}else if ('deleteConfirm' == msgId && 'Y' == msgRst){
			var rowData = $('#'+mTagetGrid).alopexGrid('dataGet', {_state: {selected:true}});
			for(var i=0; i < rowData.length; i++){
				if (rowData[i].flag == 'ADD') {
					$('#'+mTagetGrid).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });
				}
			}
			var gridData = AlopexGrid.trimData($('#'+mTagetGrid).alopexGrid('dataGet', function(data) {
				if (data.flag != 'ADD' && data._state.selected == true) {
					data.tabIdx = mTagetIdx;
					data.flag = 'DEL';
					return data;
				}
			}));

			if(gridData.length > 0) {
				$('#'+mTagetGrid).alopexGrid('showProgress');
				httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/saveDsnRsltMgmtList', gridData, 'POST', 'afterDelete');
			}else{
				callMsgBox('btnMsgWarning','W', '반영할 데이터가 없습니다.', btnMsgCallback);
			}
		}else if ('updateRsltReflct' == msgId && 'Y' == msgRst){
			// 유선수요반영
        	var afeYr = $('#afeYr2').val();
        	var afeDemdDgr = $('#afeDemdDgr2').val();

        	var dataParam = [];
        	var gridData = AlopexGrid.trimData($('#'+gridTab2).alopexGrid('dataGet', function(data) {
				if ((data.flag != 'ADD') && (data._state.selected == true)) {
					let mtrlCostVal = "0";
					let cstrCostVal = "0";

					if(parseInt(data.mtrlCost) > 0){
						mtrlCostVal = parseInt(data.mtrlCost);
					}
					if(parseInt(data.cstrCost) > 0 ){
						cstrCostVal = parseInt(data.cstrCost);
					}
					var param = {
							afeYr 				: data.afeYr,
							afeDemdDgr 			: data.afeDemdDgr,
							erpHdofcCd 			: data.hdofcCd,
							demdBizDivCd		: data.demdBizDivCd,
							demdBizDivDetlCd	: data.lowDemdBizDivCd,
							dsnQuty				: parseInt(data.dsnQuty),
							reltBsisCtt			: data.reltBsisCtt,
							mtsoId				: data.mtsoId,
							eqpDivCd			: data.eqpDivCd,
							areaId 				: data.areaId,
							mtrlCost			: mtrlCostVal,
							cstrCost			: cstrCostVal
					}

					dataParam.push(param);
				}
			}));

        	if(dataParam.length > 0) {
				$('#'+mTagetGrid).alopexGrid('showProgress');
				httpRequest('tango-transmission-biz/transmisson/demandmgmt/transmissiondemandpool/createEqpLnkgDemd', dataParam, 'POST', 'rsltCreate');
				//httpRequest('tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/createEqpLnkgDemd', dataParam, 'POST', 'rsltCreate');
			}else{
				callMsgBox('btnMsgWarning','W', '반영할 데이터가 없습니다.', btnMsgCallback);
			}
		}
	}
    // 조회용 파라메터 셋팅
    function getParamData(){
    	var param = {tabIdx : mTagetIdx};

    	switch(mTagetIdx){
    	case 1:	// 수요검토
    		param.afeYr 			= $("#afeYr1").val();
    		param.afeDemdDgr 		= $("#afeDemdDgr1").val();
    		param.hdofcCd 			= $("#hdofcCd1").val();
    		param.areaId 			= $("#areaId1").val();
    		param.demdBizDivCd		= $("#bizPurpCd1").val();
    		param.lowDemdBizDivCd	= $("#bizDivCd1").val();
    		param.dsnWoYn			= $("#dsnWoYn1").val();
    		param.eqpDivCd 			= $("#eqpDivCd1").val();
//    		param.eqpRoleDivCd 		= $("#demdEqpCd1").val();
    		param.demdMtsoNm		= $("#demdMtsoNm1").val();
    		param.rvUserNm			= $("#rvUserNm1").val();
    		//2024 고도화 추가 필드
    		param.fcltsCd			= $("#demdFcltsCd1").val();	//수요통시
    		param.delYn				= $("#delYn1").val();	//삭제여부
    		param.regMeansNm		= $("#regMeansNm1").val();	//연동구분
    		param.lnkgMtsoNm		= $("#lnkgMtsoNm1").val();	//연동국사
    		param.frstRegStartDate	= $("#frstRegStartDate1").val();	//작업시작일자
    		param.frstRegEndDate	= $("#frstRegEndDate1").val();	//작업종료일자
   		break;
    	case 2:	// 설계결과
    		param.afeYr 			= $("#afeYr2").val();
    		param.afeDemdDgr 		= $("#afeDemdDgr2").val();
    		param.hdofcCd 			= $("#hdofcCd2").val();
    		param.areaId 			= $("#areaId2").val();
    		param.demdBizDivCd		= $("#bizPurpCd2").val();
    		param.lowDemdBizDivCd	= $("#bizDivCd2").val();
    		param.eqpDivCd 			= $("#eqpDivCd2").val();
     		param.splyVndrNm		= $("#splyVndrNm2").val();
    		param.mtsoNm			= $("#mtsoNm2").val();
    		param.fhOnafMeansNm		= $("#fhOnafMeansNm2").val();
    		//2024 고도화 추가 필드
    		param.delYn				= $("#delYn2").val();	//삭제여부
    		param.namsMatlCd		= $("#namsMatlCd2").val();	//자재코드
    		param.namsMatlNm		= $("#namsMatlNm2").val();	//자재명
    		param.lastChgStartDate	= $("#lastChgStartDate2").val();	//작업시작일자
    		param.lastChgEndDate	= $("#lastChgEndDate2").val();	//작업종료일자
    		param.lastChgUserNm		= $("#lastChgUserNm2").val();	//작업자
    		break;
		}

    	return param;
    }

    // 팝업 파라메터 셋팅
    function getPopParamData(type){
    	var param = {tabIdx : mTagetIdx, popType : type};

    	switch(mTagetIdx){
    	case 1:	// 수요검토
    		param.afeYr 			= $("#afeYr1").val();
    		param.afeDemdDgr 		= $("#afeDemdDgr1").val();
    		param.hdofcCd 			= $("#hdofcCd1").val();
    		param.areaId 			= $("#areaId1").val();
   		break;
    	case 2:	// 설계결과
    		param.afeYr 			= $("#afeYr2").val();
    		param.afeDemdDgr 		= $("#afeDemdDgr2").val();
    		param.hdofcCd 			= $("#hdofcCd2").val();
    		param.areaId 			= $("#areaId2").val();
    		break;
		}

    	if(type == "REFLCT"){
    		param.runDivCd			= '01';
    	}else if(type == "BPM" || type == "EXCD"){
    		param.runDivCd			= '02';
    	}else if(type == "CAPA"){
    		param.runDivCd			= '03';
    	}

    	return param;
    }

    // 편집 이벤트 시 호출
	function setCellValueEditing(e){
		var ev = AlopexGrid.parseEvent(e);
		var dataObj = ev.data;
		var mapping = ev.mapping;

		if( mapping.key != "check" ){
			if($.TcpMsg.isEmpty(dataObj.flag)) {
				$('#'+mTagetGrid).alopexGrid('cellEdit', 'MOD', {_index:{row:dataObj._index.row}}, 'flag');
			}

			$('#'+mTagetGrid).alopexGrid('rowSelect',{_index:{row:dataObj._index.row}}, true);

			// 설계장비 구분 변경
			if( mTagetGrid == gridTab2 && (mapping.key == "dsnUnitCd" || mapping.key == "mtsoId")){
				var dsnUnitCd = dataObj._state.editing[dataObj._column];

				if($.TcpMsg.isEmpty(dsnUnitCd)){
					$('#'+mTagetGrid).alopexGrid("dataEdit", {
						splyVndrCd 	: '',
						splyVndrNm 	: '',
						mtrlCost	: '',
						cstrCost	: ''
					}, {_index:{data : dataObj._index.row}});
				}else{
					Tango.ajax({
						url : "tango-transmission-tes-biz/transmission/tes/configmgmt/eqpinvtdsnmgmt/rslt/getDsnUnitCode",
						data : {eqpDivCd:dsnUnitCd,mtsoId:dataObj.mtsoId}, //data가 존재할 경우 주입
						method : 'GET', //HTTP Method
						flag : ""
					}).done(function(result) {
						var data = result.returnData;

						if($.TcpMsg.isEmpty(data)){
							$('#'+mTagetGrid).alopexGrid("dataEdit", {
								splyVndrCd 	: '',
								splyVndrNm 	: '',
								mtrlCost	: '',
								cstrCost	: ''
							}, {_index:{data : dataObj._index.row}});
						}else{
							$('#'+mTagetGrid).alopexGrid("dataEdit", {
								splyVndrCd 	: data.splyVndrCd,
								splyVndrNm 	: data.splyVndrNm,
								mtrlCost	: data.mtrlCost,
								cstrCost	: data.cstrCost
							}, {_index:{data : dataObj._index.row}});
						}
					}).fail(failCallback);
				}
			}
		}
    }

	// 유선망설계 ROW 삭제
	function setGridRowDel(){
		var rowData = $('#'+mTagetGrid).alopexGrid('dataGet', {_state: {selected:true}});

		if (rowData.length == 0) {
			callMsgBox('','I', configMsgArray['selectNoData'], btnMsgCallback);
			return;
		}

		callMsgBox('deleteConfirm','C', configMsgArray['deleteConfirm'], btnMsgCallback);
    }

	// 유선수요반영
	function setGridRsltReflct(){
		var rowData = AlopexGrid.trimData($('#'+gridTab2).alopexGrid('dataGet', function(data) {
			if ((data.flag != 'ADD') && (data._state.selected == true)) {
				return data;
			}
		}));

		if (rowData.length == 0) {
			callMsgBox('','I', configMsgArray['selectNoData'], btnMsgCallback);
			return;
		}

		callMsgBox('updateRsltReflct','C', '반영하시겠습니까?', btnMsgCallback);
    }

	function initGrid() {
	    // 수요검토 그리드 생성
	    $('#'+gridTab1).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
			cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			rowInlineEdit: true,
			numberingColumnFromZero: false,
			leaveDeleted: true,
			headerGroup: [
      	        			{fromIndex:'demdMtsoNm', toIndex:'delYn', title:'수요 정보'},
      	        			{fromIndex:'lowBldAddr', toIndex:'demdEqpId', title:'수요국사 정보'},
      	        			{fromIndex:'uprBldAddr', toIndex:'umtsoJugCd', title:'연동국사 정보'},
							{fromIndex:'demdMtsoNm', toIndex:'mtsoLkupIcon', title:"<em class='color_red'>*</em>수요국사", hideSubTitle:true},
							{fromIndex:'splyVndrNm', toIndex:'splyVndrCdIcon', title:"<em class='color_red'>*</em>벤더", hideSubTitle:true},
							{fromIndex:'demdEqpQuty', toIndex:'reviewListIcon', title:"<em class='color_red'>*</em>수량", hideSubTitle:true},
							{fromIndex:'lnkgMtsoNm', toIndex:'mapIcon', title:"연동국사", hideSubTitle:true}
			],
			renderMapping:{
				"mtsoLkupIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				},
				"splyVndrCdIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				},
				"lnkgMtsoLkupIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				},
				"cardPortUseListIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Signal' style='cursor: pointer'></span>";
					}
				},
				"reviewListIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Random' style='cursor: pointer'></span>";
					}
				},
				"mapIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Globe' style='cursor: pointer'></span>";
					}
				}
			},
	    	columnMapping: [{
	    		key: 'check',
	    		align: 'center',
	    		width: '40px',
	    		selectorColumn : true
	    	}, {
    			align:'center',
				title : '순번',
				width: '50px',
				resizing : false,
				//excludeFitWidth : true,
				numberingColumn: true
			}, {
				key : 'afeYr', align:'center',
				title : '년도',
				width: '70px',
				editable: false
			}, {
				key : 'afeDemdDgr', align:'center',
				title : '차수',
				width: '70px',
				editable: false
			}, {
				key : 'hdofcCd', align:'center', styleclass : 'font-blue', filter : {useRenderToFilter : true},
				title : '<em class="color_red">*</em>본부',
				width: '90px',
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];
        				return render_data = render_data.concat( mHdofcCmb );
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mHdofcCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'areaId', align:'center',
				title : '<em class="color_red">*</em>지사',
				width: '90px',
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [{ value : '', text : '선택'}];
	                	var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdAreaIdCmb(currentData.hdofcCd);

	                	if(fnCmdExisTence(value, areaCmb)){
	                		return render_data.concat( areaCmb );
	                	}else{
	                		data.areaId = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [{ value : '', text : '선택'}];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdAreaIdCmb(currentData.hdofcCd);

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'hdofcCd'
			}, {
					key : 'demdBizDivCd', align:'center',
					title : '<em class="color_red">*</em>사업목적',
					width: '130px',
			    	render : { type: 'string',
			            rule: function (value, data){
			                var render_data = [{ value : '', text : '선택'}];

		                	if(fnCmdExisTence(value, mBizPurpCmb1)){
		                		return render_data.concat( mBizPurpCmb1 );
		                	}else{
		                		data.demdBizDivCd = '';
		                		return render_data;
		                	}
	    				}
					},
		         	editable : { type: 'select',
		         		rule: function(value, data) {
		         			var editing_data = [{ value : '', text : '선택'}];
		         			return editing_data = editing_data.concat( mBizPurpCmb1 );
		         		},
		         		attr : {
			 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
			 			}
	 				},
					allowEdit : function(value,data,mapping) {
						return true;
					},
					editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'lowDemdBizDivCd', align:'center',
				title : '<em class="color_red">*</em>사업구분',
				width: '180px',
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [{ value : '', text : '선택'}];
	                	var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdLowDemdBizDivCd(currentData.demdBizDivCd, 'TAB1');

	                	if(fnCmdExisTence(value, areaCmb)){
	                		return render_data.concat( areaCmb );
	                	}else{
	                		data.lowDemdBizDivCd = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [{ value : '', text : '선택'}];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdLowDemdBizDivCd(currentData.demdBizDivCd, 'TAB1');

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'demdBizDivCd'
			}, {
				key : 'eqpDivCd', align:'center',
				title : '<em class="color_red">*</em>설계대상',
				width: '100px',
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];

	                	if(fnCmdExisTence(value, mEqpDivCmb)){
	                		return render_data.concat( mEqpDivCmb );
	                	}else{
	                		data.eqpDivCd = '';
	                		return render_data;
	                	}
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mEqpDivCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'demdMtsoNm', align:'left',
				title : '수요국사',
				width: '180px',
				editable: false,
				render : function(value, data, render, mapping, grid){
					var href = value;
					var currentData = AlopexGrid.currentData(data);
					if(value != "" && value != undefined && currentData.flag != "ADD"){
						var mtsoId 		= currentData.demdMtsoId;
						href = "<a href=\"javascript:main.goMtsoPopup('"+mtsoId+"');\" style='text-decoration-line:underline'>"+value+"</a>";
					}
					return href;
				}
			}, {
				key     : 'mtsoLkupIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'mtsoLkupIcon'},
				resizing: false,
			}, {
				key : 'demdMtsoTypNm', align:'center',
				title : '국사유형',
				width: '90px',
				editable: false
			}, {
				key : 'areaDivNm', align:'center',
				title : '도심/외곽',
				width: '70px',
				editable: false
			}, {
				key : 'eqpRoleDivCd', align:'center',
				title : '<em class="color_red">*</em>장비',
				width: '100px',
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [];
	                	var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdDsnEqpDivCd(currentData.eqpDivCd);

	                	if(fnCmdExisTence(value, areaCmb)){
	                		return render_data.concat( areaCmb );
	                	}else{
	                		data.eqpRoleDivCd = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdDsnEqpDivCd(currentData.eqpDivCd);

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'eqpDivCd'
			}, {
				key : 'splyVndrNm', align:'center',
				title : '벤더',
				width: '115px',
				editable: false
			}, {
				key : 'splyVndrCd', align:'center',
				title : 'Vendor',
				width: '100px',
				hidden : true
			}, {
				key     : 'splyVndrCdIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'splyVndrCdIcon'},
				resizing: false,
			}, {
				key : 'demdEqpQuty', align:'center',
				title : '<em class="color_red">*</em>수량',
				width: '90px',
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 22}, styleclass : 'num_editing-in-grid'},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				render: {type:"string", rule : "comma"}
			}, {
				key     : 'reviewListIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'reviewListIcon'},
				resizing: false,
			}, {
				key : 'lnkgMtsoNm', align:'left',
				title : '연동국사',
				width: '150px',
				editable : false,
				render : function(value, data, render, mapping, grid){
					var href = value;
					var currentData = AlopexGrid.currentData(data);
					if(value != "" && value != undefined && currentData.flag != "ADD"){
						var mtsoId 		= currentData.lnkgMtsoId;
						href = "<a href=\"javascript:main.goMtsoPopup('"+mtsoId+"');\" style='text-decoration-line:underline'>"+value+"</a>";
					}
					return href;
				}
			}, {
				key     : 'lnkgMtsoLkupIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'lnkgMtsoLkupIcon'},
				resizing: false,
			}, {
				key     : 'cardPortUseListIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'cardPortUseListIcon'},
				resizing: false,
			}, {
				key     : 'mapIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'mapIcon'},
				resizing: false,
			}, {
				key : 'dsnWoYn', align:'center',
				title : '<em class="color_red">*</em>설계제외',
				width: '90px',
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];
        				return render_data = render_data.concat( mDsnWoYnCmb1 );
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mDsnWoYnCmb2 );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'dsnRsltYn', align:'center',
				title : '설계반영',
				width: '90px',
				editable : false,
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [];
        				return render_data = render_data.concat( mDsnRsltYn );
    				}
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'regMeansNm', align:'center',
				title : '등록방식',
				width: '100px',
				editable : false
			}, {
				key : 'delYn', align:'center',
				title : '삭제여부',
				width: '100px',
				editable : false
			}, {
				key : 'rmkCtt', align:'left',
				title : '비고',
				width: '150px',
				editable : true
			}, {
				key : 'lowBldAddr', align:'left',
				title : '주소',
				width: '180px',
				editable : false
			}, {
				key : 'lowSiteCd', align:'center',
				title : '사이트키',
				width: '130px',
				editable : false
			}, {
				key : 'demdMtsoId', align:'center',
				title : '국사ID',
				width: '130px'
			}, {
				key : 'lmtsoJugCd', align:'center',
				title : '판단근거',
				width: '100px'
			}, {
				key : 'demdEqpId', align:'center',
				title : '수요장비',
				width: '100px'
			}, {
				key : 'uprBldAddr', align:'left',
				title : '주소',
				width: '180px',
				editable : false
			}, {
				key : 'uprSiteCd', align:'center',
				title : '사이트키',
				width: '130px',
				editable : false
			}, {
				key : 'lnkgMtsoId', align:'center',
				title : '국사ID',
				width: '130px',
				editable : false
			}, {
				key : 'umtsoJugCd', align:'center',
				title : '판단근거',
				width: '100px'
			}, {
				key : 'rvUserNm', align:'center',
				title : '작업자',
				width: '100px',
				editable : false
			}, {
				key : 'frstRegDate', align:'center',
				title : '작업일자',
				width: '150px',
				editable : false
			}, {
				key : 'frstRegUserNm', align:'center',
				title : '등록자',
				width: '100px',
				editable : false,
				hidden : true
			}, {
				key : 'crrtFixDt', align:'center',
				title : '확정일',
				width: '150px',
				editable : false,
				hidden : true
			}, {
				key : 'mtsoTypCd', align:'center',
				title : '국사유형',
				width: '100px',
				editable : false,
				hidden : true,
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [];
        				return render_data = render_data.concat( mMtsoType );
    				}
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'afeYr', align:'center',
				title : '년도',
				width: '50px',
				hidden : true
			}, {
				key : 'afeDemdDgr', align:'center',
				title : '차수',
				width: '50px',
				hidden : true
			}, {
				key : 'demdRvSeq', align:'center',
				title : '수요검토순번',
				width: '50px',
				hidden : true
			}, {
				key : 'flag', align:'center',
				title : '상태',
				width: '50px',
				hidden : true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

	    // 설계결과 그리드 생성
	    $('#'+gridTab2).alopexGrid({
        	paging : {
        		pagerSelect: [100,300,500,1000]
               ,hidePageList: false  // pager 중앙 삭제
        	},
//			cellInlineEdit : false,
        	cellInlineEdit : true,
			cellInlineEditOption : {startEvent:'click'},
			cellSelectable : true,
			rowSingleSelect : false,
			rowClickSelect: false,
			numberingColumnFromZero: false,
			leaveDeleted: true,
//			grouping :  {
//				useGrouping: true,
//				by: [ "ord","hdofcCd", "areaId", "demdBizDivCd", "lowDemdBizDivCd", "dsnDivCd", "eqpDtlDivCd", "dsnUnitCd", "splyVndrNm", "splyVndrCd", "splyVndrCdIcon", "mtsoId"
//				    ],
//				useGroupRowspan: true,
//				useGroupRearrange: true,
//				groupRowspanMode : 1,
//			},
			headerGroup: [
			            {fromIndex:'mtsoNm', toIndex:'mtsoId', title:'설계국사'},
			            {fromIndex:'fhOnafMeansNm', toIndex:'delYn', title:'자동 설계 정보'},
			            {fromIndex:'splyVndrNm', toIndex:'splyVndrCdIcon', title:"<em class='color_red'>*</em>제조사", hideSubTitle:true},
			            {fromIndex:'lnInvtCost', toIndex:'lnInvtIcon', title:"<em class='color_red'></em>선로비", hideSubTitle:true},
						{fromIndex:'mtsoNm', toIndex:'mapIcon', title:"<em class='color_red'>*</em>국사명", hideSubTitle:true},
			            {fromIndex:'demdEqpQuty', toIndex:'reviewListIcon', title:"수요수량", hideSubTitle:true}
			],
			renderMapping:{
				"splyVndrCdIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				},
				"mtsoIdIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Search' style='cursor: pointer'></span>";
					}
				},
				"cardPortUseListIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Signal' style='cursor: pointer'></span>";
					}
				},
				"reviewListIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Random' style='cursor: pointer'></span>";
					}
				},
				"lnInvtIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Th-list' style='cursor: pointer'></span>";
					}
				},
				"mapIcon" :{
					renderer : function(value, data, render, mapping) {
						var currentData = AlopexGrid.currentData(data);
						return "<span class='Icon Globe' style='cursor: pointer'></span>";
					}
				}
			},
	    	columnMapping: [{
	    		key: 'check',
	    		align: 'center',
	    		width: '40px',
	    		selectorColumn : true,
//	    		rowspan:true
	    	}, {
	    		key: 'ord',
    			align:'center',
				title : '순번',
				width: '50px',
				resizing : false,
				numberingColumn: true,
				rowspan:true
			}, {
				key : 'afeYr', align:'center',
				title : '년도',
				width: '70px',
				editable: false
			}, {
				key : 'afeDemdDgr', align:'center',
				title : '차수',
				width: '70px',
				editable: false
			}, {
				key : 'hdofcCd', align:'center', styleclass : 'font-blue', filter : {useRenderToFilter : true},
				title : '<em class="color_red">*</em>본부',
				width: '80px',
				rowspan:true,
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];
        				return render_data = render_data.concat( mHdofcCmb );
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mHdofcCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'areaId', align:'center',
				title : '<em class="color_red">*</em>지사',
				width: '80px',
				rowspan:true,
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [{ value : '', text : '선택'}];
	                	var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdAreaIdCmb(currentData.hdofcCd);

	                	if(fnCmdExisTence(value, areaCmb)){
	                		return render_data.concat( areaCmb );
	                	}else{
	                		data.areaId = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [{ value : '', text : '선택'}];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdAreaIdCmb(currentData.hdofcCd);

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'hdofcCd'
			}, {
				key : 'demdBizDivCd', align:'center',
				title : '<em class="color_red">*</em>사업목적',
				width: '100px',
				rowspan:true,
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];

	                	if(fnCmdExisTence(value, mBizPurpCmb2)){
	                		return render_data.concat( mBizPurpCmb2 );
	                	}else{
	                		data.demdBizDivCd = '';
	                		return render_data;
	                	}
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mBizPurpCmb2 );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'lowDemdBizDivCd', align:'center',
				title : '<em class="color_red">*</em>사업구분',
				width: '130px',
				rowspan:true,
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [{ value : '', text : '선택'}];
	                	var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdLowDemdBizDivCd(currentData.demdBizDivCd, 'TAB2');

	                	if(fnCmdExisTence(value, areaCmb)){
	                		return render_data.concat( areaCmb );
	                	}else{
	                		data.lowDemdBizDivCd = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [{ value : '', text : '선택'}];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdLowDemdBizDivCd(currentData.demdBizDivCd, 'TAB2');

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'demdBizDivCd'
			}, {
				key : 'dsnDivCd', align:'center',
				title : '<em class="color_red">*</em>설계대상',
				width: '100px',
				rowspan:true,
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [{ value : '', text : '선택'}];

	                	if(fnCmdExisTence(value, mEqpDivCmb)){
	                		return render_data.concat( mEqpDivCmb );
	                	}else{
	                		data.dsnDivCd = '';
	                		return render_data;
	                	}
    				}
				},
	         	editable : { type: 'select',
	         		rule: function(value, data) {
	         			var editing_data = [{ value : '', text : '선택'}];
	         			return editing_data = editing_data.concat( mEqpDivCmb );
	         		},
	         		attr : {
		 				style : "width: 98%;min-width:98%;padding: 1px 1px;"
		 			}
 				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'eqpDtlDivCd', align:'center',
				title : '<em class="color_red">*</em>설계장비구분',
				width: '100px',
				rowspan:true,
		    	render : { type: 'string',
	            	rule: function (value,data){
	                	var render_data = [];
	                	var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdEqpRoleDivCd(currentData.dsnDivCd);

	                	if(fnCmdExisTence(value, eqpCmb)){
	                		return render_data.concat( eqpCmb );
	                	}else{
	                		data.eqpDtlDivCd = '';
	                		return render_data;
	                	}
	            	}
		    	},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [];
						var currentData = AlopexGrid.currentData(data);
	                	var areaCmb = grdEqpRoleDivCd(currentData.dsnDivCd);

	                	return editing_data.concat( areaCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : 'dsnDivCd'
			}, {
				key : 'dsnUnitCd', align:'center',
				title : '<em class="color_red">*</em>설계장비단위',
				width: '120px',
				rowspan:true,
		    	render : { type: 'string',
		            rule: function (value, data){
	                	var render_data = [];
	                	var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdDsnEqpUnitCd(currentData.dsnDivCd, currentData.eqpDtlDivCd);

	                	if(fnCmdExisTence(value, eqpCmb)){
	                		//if(eqpCmb.length == 2){ data.dsnUnitCd = eqpCmb[1].value; }
	                		return render_data.concat( eqpCmb );
	                	}else{
	                		data.dsnUnitCd = '';
	                		return render_data;
	                	}
    				}
				},
		    	editable : {type : 'select',
					rule : function(value, data) {
						var editing_data = [];
						var currentData = AlopexGrid.currentData(data);
	                	var eqpCmb = grdDsnEqpUnitCd(currentData.dsnDivCd, currentData.eqpDtlDivCd);

	                	return editing_data.concat( eqpCmb );
					},
         			attr : {
         				style : "width: 98%;min-width:98%;padding: 1px 1px;"
         			}
				},
				allowEdit : function(value,data,mapping) {
					return true;
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); },
				refreshBy : ['dsnDivCd','eqpDtlDivCd']
			}, {
				key : 'splyVndrNm', align:'center',
				title : '제조사',
				width: '100px',
				editable: false,
				rowspan:true,
			}, {
				key : 'splyVndrCd', align:'center',
				title : '제조사',
				width: '90px',
				rowspan:true,
				hidden : true
			}, {
				key     : 'splyVndrCdIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'splyVndrCdIcon'},
				resizing: false,
				rowspan:true,
			}, {
				key : 'mtsoId', align:'center',
				title : '국사ID',
				width: '90px',
				rowspan:true,
				hidden : true
			}, {
				key : 'dsnQuty', align:'center',
				title : '설계수량',
				width: '70px',
				render: {type:"string", rule : "comma"},
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 10}, styleclass : 'num_editing-in-grid'}
			}, {
				key : 'inveQuty', align:'center',
				title : '재고수량',
				width: '70px',
				render: {type:"string", rule : "comma"},
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 10}, styleclass : 'num_editing-in-grid'}
			}, {
				key : 'buyQuty', align:'center',
				title : '구매수량',
				width: '70px',
				render: {type:"string", rule : "comma"},
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 10}, styleclass : 'num_editing-in-grid'}
			}, {
				key : 'namsMatlCd', align:'center',
				title : '자재코드',
				width: '100px',
				editable : false
			}, {
				key : 'namsMatlNm', align:'center',
				title : '자재명',
				width: '120px',
				editable : false
			}, {
				key : 'reltBsisCtt', align:'center',
				title : '설계근거',
				width: '90px',
				editable : true
			}, {
				key : 'mtrlCost', align:'right',
				title : '물자비 단가',
				width: '100px',
				editable: false,
				render: {type:"string", rule : "comma"}
			}, {
				key : 'cstrCost', align:'right',
				title : '공사비 단가',
				width: '100px',
				editable: false,
				render: {type:"string", rule : "comma"}
			}, {
				key : 'lnInvtCost', align:'right',
				title : '선로비',
				width: '70px',
				editable: false,
				render: {type:"string", rule : "comma"}
			}, {
				key     : 'lnInvtIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'lnInvtIcon'},
				resizing: false,
				rowspan:true,
			}, {
				key : 'invtCost', align:'right',
				title : '투자비',
				width: '70px',
				render: {type:"string", rule : "comma"},
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 18}, styleclass : 'num_editing-in-grid'}
			}, {
				key : 'mtsoNm', align:'left',
				title : '국사명',
				width: '150px',
				editable: false,
				render : function(value, data, render, mapping, grid){
					var href = value;
					var currentData = AlopexGrid.currentData(data);
					if(value != "" && value != undefined && currentData.flag != "ADD"){
						var mtsoId 		= currentData.mtsoId;
						href = "<a href=\"javascript:main.goMtsoPopup('"+mtsoId+"');\" style='text-decoration-line:underline'>"+value+"</a>";
					}
					return href;
				}
			}, {
				key     : 'mtsoIdIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'mtsoIdIcon'},
				resizing: false,
			}, {
				key     : 'cardPortUseListIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'cardPortUseListIcon'},
				resizing: false,
			}, {
				key     : 'mapIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'mapIcon'},
				resizing: false,
			}, {
				key : 'bldAddr', align:'left',
				title : '주소',
				width: '200px',
				editable : false
			}, {
				key : 'siteCd', align:'center',
				title : '사이트키',
				width: '130px',
				editable : false
			}, {
				key : 'mtsoId', align:'center',
				title : '국사ID',
				width: '130px',
				editable : false,
			}, {
				key : 'rmkCtt', align:'left',
				title : '비고',
				width: '150px',
				editable : true
			}, {
				key : 'fhOnafMeansNm', align:'center',
				title : '설계방식',
				width: '150px',
				editable : true
			}, {
				key : 'apmtRsn', align:'center',
				title : '지정사유',
				width: '150px',
				editable : true
			}, {
				key : 'demdEqpQuty', align:'center',
				title : '수요수량',
				width : '100px',
				editable : {type : "text", attr : {"data-keyfilter-rule" : "decimal" ,"maxlength" : 18}, styleclass : 'num_editing-in-grid'}
			}, {
				key     : 'reviewListIcon',
				width   : '30px',
				align   : 'center',
				editable: false,
				render  : {type:'reviewListIcon'},
				resizing: false,
			}, {
				key : 'delYn', align:'center',
				title : '삭제여부',
				width: '100px',
				editable : false
			}, {
				key : 'lastChgUserNm', align:'center',
				title : '작업자',
				width: '100px',
				editable : false
			}, {
				key : 'lastChgDate', align:'center',
				title : '작업일자',
				width: '150px',
				editable : false
			}, {
				key : 'mtsoTypCd', align:'center',
				title : '국사유형',
				width: '100px',
				editable : false,
				hidden : true,
		    	render : { type: 'string',
		            rule: function (value, data){
		                var render_data = [];
        				return render_data = render_data.concat( mMtsoType );
    				}
				},
				editedValue : function (cell) { return  $(cell).find('select option').filter(':selected').val(); }
			}, {
				key : 'afeYr', align:'center',
				title : '년도',
				width: '50px',
				hidden : true
			}, {
				key : 'afeDemdDgr', align:'center',
				title : '차수',
				width: '50px',
				hidden : true
			}, {
				key : 'dsnRsltSeq', align:'center',
				title : '설계순서',
				width: '50px',
				hidden : true
			}, {
				key : 'fhYr', align:'center',
				title : '프론트홀년도',
				width: '50px',
				hidden : true
			}, {
				key : 'fhDgr', align:'center',
				title : '프론트홀차수',
				width: '50px',
				hidden : true
			}, {
				key : 'flag', align:'center',
				title : '상태',
				width: '50px',
				hidden : true
			}, {
				key : 'endObjMgmtNo', align:'center',
				title : '종료대상관리번호',
				width: '50px',
				hidden : true
			}],
			message: {
				nodata: "<div class='no_data'><i class='fa fa-exclamation-triangle'></i>"+configMsgArray['noData']+"</div>"
			}
	    });

//	    gridHide();

    }

	 // 컬럼 숨기기
    function gridHide() {

    	var hideColList = ['check'];

    	$('#'+gridTab2).alopexGrid("hideCol", hideColList, 'conceal');
	}


	// 편집가능여부 체크 추가된 행만 수정 가능
	var editableChk = function (data){
		var currentData = AlopexGrid.currentData(data);
		return (currentData.flag == "ADD"? true: false);
	};

    // 그리드 지역콤보 데이터 JSON
    function grdAreaIdCmb(value){
    	var returnDate = [];

    	switch(value){
		case "5100":
			returnDate =  mAreaId_1;
			break;
		case "5300":
			returnDate =  mAreaId_2;
			break;
		case "5500":
			returnDate =  mAreaId_3;
			break;
		case "5600":
			returnDate =  mAreaId_4;
			break;
    	}

    	return returnDate;
    }

    // 그리드 사업구분 데이터 JSON
    function grdLowDemdBizDivCd(value, gubun){
    	var returnDate 	= [];
    	var divCdList	= [];

    	if(gubun == 'TAB1'){
    		divCdList = mBizDivCmb1[value];
    	}else{
    		divCdList = mBizDivCmb2[value];
    	}

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj 		= {value: divCdList[i].cd, text: divCdList[i].cdNm};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    // 그리드 수요장비 데이터 JSON
    function grdDsnEqpDivCd(value){
    	var returnDate 	= [{cd: "", cdNm: "전체",value: "", text: "선택"}];
    	var divCdList	= mDsnEqpCmb[value];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj 		= {cd: divCdList[i].cd, cdNm: divCdList[i].cdNm, value: divCdList[i].cd, text: divCdList[i].cdNm};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    // 그리드 장비구분 데이터 JSON
    function grdEqpRoleDivCd(value){
    	var returnDate 	= [{cd: "", cdNm: "전체",value: "", text: "선택"}];
    	var divCdList	= mDemdEqpCmb[value];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

		for(var i=0; i<divCdList.length; i++){
			var resObj	= {
					cd: divCdList[i].cd,
					cdNm: divCdList[i].cdNm,
					value: divCdList[i].cd,
					text: divCdList[i].cdNm
				};

			returnDate.push(resObj);
		}

    	return returnDate;
    }

    // 장비설계단위명 get
    function grdEqpDsnUnitNm(value1, value2){
    	var result = {};
    	var divCdList	= mDemdEqpCmb[value1];

    	if(divCdList == undefined || divCdList == null || divCdList == "") return '';

    	for(var i = 0; i < divCdList.length; i++){
    		if(divCdList[i].cd == value2){
    			result = divCdList[i];
    		}
    	}

    	return result;
    }

    // 콤보박스에 데이터 존재여부
    function fnCmdExisTence(value, data){
    	var result = false;

    	if( data == undefined || data == null || data == "") return result;

    	for( var i = 0; i < data.length; i++ ){
    		if(data[i].value == value){
    			result = true;
    		}
    	}

    	return result;
    }

    //request 호출
    var httpRequest = function(Url, Param, Method, Flag ) {
    	Tango.ajax({
    		url : Url, //URL 기존 처럼 사용하시면 됩니다.
    		data : Param, //data가 존재할 경우 주입
    		method : Method, //HTTP Method
    		flag : Flag
    	}).done(successCallback)
		  .fail(failCallback);
    }

    //request 성공시.
	function successCallback(response, status, jqxhr, flag){
		switch(flag){
			case 'search':
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				setSpGrid(mTagetGrid, response, response.dataList);
				break;
			case 'demdSearch':
				var demdData = response.priKey;
				mTabChgDgr	= demdData.afeDemdDgr;
				$('#afeYr1').setSelected(demdData.afeYr);

				$('#'+mTagetGrid).alopexGrid('hideProgress');
				setSpGrid(mTagetGrid, response, response.dataList);
				break;
			case 'afterSave':
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', configMsgArray[response.returnMessage],function(){
						if(mTagetIdx == 1){
							setFormData(1, perPage1);
						}else if(mTagetIdx == 2){
							setFormData(1, perPage2);
						}
					});
				} else {
					callMsgBox('','W', configMsgArray[response.returnMessage], btnMsgCallback);
				}
				break;
			case 'afterCopyRow':
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', '복사를 완료 하였습니다',function(){
						if(mTagetIdx == 1){
							setFormData(1, perPage1);
						}else if(mTagetIdx == 2){
							setFormData(1, perPage2);
						}
					});
				} else {
					callMsgBox('','W', '복사를 실패 하였습니다.', btnMsgCallback);
				}
				break;
			case 'afterDelete':
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				if (response.returnCode == "200") {
					callMsgBox('','I', configMsgArray['delSuccess'],function(){
						if(mTagetIdx == 1){
							setFormData(1, perPage1);
						}else if(mTagetIdx == 2){
							setFormData(1, perPage2);
						}
					});
				} else {
					callMsgBox('','W', configMsgArray['delFail'], btnMsgCallback);
				}
				break;
			case "rsltCreate":
				// 유선수요반영 콜백처리
				$('#'+mTagetGrid).alopexGrid('hideProgress');
				if (response.code == "OK") {
					callMsgBox('','I', '유선수요 반영되었습니다.',function(){
						setFormData(1, perPage2);
					});
				}
				break;
			case 'afeYr1':
				$('#afeYr1').clear();
				var option_data =  [];
				var stdAfeYr = "";
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}

				$('#afeYr1').setData({data:option_data,afeYr:stdAfeYr});
				selectAfeDemdDgrCode('afeDemdDgr1', {afeYr:stdAfeYr});
		    	//사업목적코드
		    	selectBizPurpCode('bizPurpCd1',stdAfeYr);

				break;
			case 'afeYr2':
				$('#afeYr2').clear();
				var option_data =  [];
				var stdAfeYr = "";
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}

				$('#afeYr2').setData({data:option_data,afeYr:stdAfeYr});
				selectAfeDemdDgrCode('afeDemdDgr2', {afeYr:stdAfeYr});
		    	selectBizPurpCode('bizPurpCd2',stdAfeYr);
				break;
			case 'afeDemdDgr1':
			case 'afeDemdDgr2':
				$('#'+flag).clear();
				var option_data =  [{cd: '', cdNm: '전체'}];
				var stdAfeYr = "";
				for(var i=0; i<response.length; i++){
					var resObj =  {cd: response[i].cd, cdNm: response[i].cdNm};
					option_data.push(resObj);
					if(response[i].stdAfeDivYn == 'Y'){
						stdAfeYr = response[i].cd;
					}
				}
				$('#'+flag).setData({data:option_data,afeDemdDgr:stdAfeYr});

	        	// 설계결과 탭화면에서 넘어온 차수일때
	        	if(!$.TcpMsg.isEmpty(mTabChgDgr)){
	        		$('#afeDemdDgr1').setSelected(mTabChgDgr);
	        		mTabChgDgr = '';
	        	}
				break;
			case 'bizPurpCd1':
			case 'bizPurpCd2':
				$('#'+flag).clear();
				var option_data =  [{cd: "", cdNm: "전체"}];
				var grdPurdData =  [];

				for(var i=0; i<response.purpList.length; i++){
					var resObj 		= {cd: response.purpList[i].cd, cdNm: response.purpList[i].cdNm};
					var grdPurdObj 	= {value: response.purpList[i].cd, text: response.purpList[i].cdNm};

					option_data.push(resObj);
					grdPurdData.push(grdPurdObj);

				}

				if(flag == 'bizPurpCd1'){
					mBizPurpCmb1 	= grdPurdData;
					mBizDivCmb1		= response.divList

				}else if(flag == 'bizPurpCd2'){
					mBizPurpCmb2 	= grdPurdData;
					mBizDivCmb2		= response.divList
				}

				$('#'+flag).setData({data:option_data});

				break;
			case 'eqpDivCd':
				mEqpDivCmb = response.mainLgc

				var option_data =  [{cd: "", cdNm: "전체"}];
				for(var i=0; i<mEqpDivCmb.length; i++){
					option_data.push({cd: mEqpDivCmb[i].cd, cdNm: mEqpDivCmb[i].cdNm});
				}

				$('#eqpDivCd1').setData({data:option_data});
				$('#eqpDivCd2').setData({data:option_data});
				break;
			case 'dsnEqpCd':
				mDsnEqpCmb = response.demdEqpList;
				var option_data =  [{cd: "", cdNm: "전체"}];
				$('#demdEqpCd1').setData({data:option_data});
				break;
			case 'demdEqpCd':
				mDemdEqpCmb = response.demdEqpList;
				break;
			case 'demdEqpCdFrom':
				mDemdEqpCmb = response.demdEqpList;
				//검색어 조회
				if(mTagetIdx == 1){
					setFormExcData(1, perPage1);
				}else if(mTagetIdx == 2){
					setFormExcData(1, perPage2);
				}
				break;
			case 'hdofcCd1':
				for(var i=0; i<response.length; i++){
					var resObj 		= {value: response[i].cd, text: response[i].cdNm};

					mHdofcCmb.push(resObj);
				}
			case 'hdofcCd2':
			case 'areaId1':
			case 'areaId2':
				setSelectBoxData(flag, response);

				break;
			case "excelDownloadOnDemand":
				$('#'+mTagetGrid).alopexGrid('hideProgress');
	    		downloadFileOnDemand(response.resultData.jobInstanceId, fileNameOnDemand);
				break;
			case 'dsnUnitCd':
				mEqpUnitCmb = response.unitList;
				break;
		}
    }

    //request 실패시.
    function failCallback(response, status, flag, jqxhr ){
		switch(flag){
			case "search":
	    		//조회 실패 하였습니다.
	    		callMsgBox('','I', configMsgArray['searchFail'] , function(msgId, msgRst){});
				break;
			case "rsltCreate":
				$('#'+gridTab2).alopexGrid('hideProgress');
				if (status == "404") {
					callMsgBox('','I', 'API를 찾을 수 없습니다.' , function(msgId, msgRst){});
				} else {
					callMsgBox('','I', '유선수요반영을 실패 하였습니다.' , function(msgId, msgRst){});
				}

				break;
		}
    }

	// 선택박스 데이터 셋
	function setSelectBoxData(objId, response ){
		$('#'+objId).clear();
		var option_data =  [{cd: "", cdNm: "전체"}];
		var grdSelectData =  [];

		for(var i=0; i<response.length; i++){
			var resObj 		= {cd: response[i].cd, cdNm: response[i].cdNm};
			var grdObj 		= {value: response[i].cd, text: response[i].cdNm};

			option_data.push(resObj);
			grdSelectData.push(grdObj);
		}

		if(objId == "hdofcCd1" || objId == "hdofcCd2"){
			$('#'+objId).setData({ data : option_data});
			$('#'+objId).setSelected(mOrgCd);
		}else{
			$('#'+objId).setData({data:option_data});
		}

		if(objId == "areaId1" || objId == "areaId2"){
			if(response.length == 1){
				$('#'+objId).setSelected(response[0].cd);
			}
		}
	}

    // 설계장비단위 get
    function grdDsnEqpUnitCd(value1, value2){
    	var unitCmb = [{value: "", text: "선택"}];
    	var divCdList	= mDemdEqpCmb[value1];

    	if( divCdList == undefined || divCdList == null || divCdList == ""){
    		divCdList	= [];
    	}

    	for(var i = 0; i < divCdList.length; i++){
    		if(divCdList[i].cd == value2){
        		var unitCd = divCdList[i].unitCd;

        		if(!$.TcpMsg.isEmpty(unitCd)){
        			var unitList = unitCd.split(",");

        			for(var j = 0; j < unitList.length; j++){
        				var eqpCd = value1 + unitList[j];

        				for(var k = 0; k < mEqpUnitCmb.length; k++){
        					if(mEqpUnitCmb[k].cd == eqpCd){
        						unitCmb.push({value: mEqpUnitCmb[k].cd, text: mEqpUnitCmb[k].cdNm});
        					}
        				}// k for문
        			} // j for문
        			break;
        		}
    		}
    	} // i for문

    	return unitCmb;
    }

    function setEditData(gridDiv, value) {

    	if (gridDiv == '2') {
    		if (value == "edit") {

    			$('#'+gridTab2).alopexGrid('showCol', 'check');
    			$('#'+gridTab2).alopexGrid('dataScroll', 'left');
    			$('#'+gridTab2).alopexGrid('updateOption', {
            		grouping : {
            			useGrouping : false
            		},
            		cellInlineEdit : true
            	});

            	$('#btnCancelRow').show();
            	$('#btnFixRow').hide();

            	$('#btnSave2').setEnabled(true);
            	$('#btnAddRow2').setEnabled(true);
            	$('#btnCopyRow2').setEnabled(true);
            	$('#btnDeleteRow2').setEnabled(true);

    		} else if (value == "cancel") {

    			var rowData = $('#'+gridTab2).alopexGrid('dataGet', {_state: {selected:true}});

    	    	for(var i=0; i < rowData.length; i++){

    	    		if (rowData[i].flag == 'ADD') {
						$('#'+gridTab2).alopexGrid('dataDelete', { _index : { data : rowData[i]._index.row } });

					} else  {

						$('#'+gridTab2).alopexGrid("cancelCellEdit", { _index : { data : rowData[i]._index.row } });
						rowData[i].hdofcCd          = (rowData[i]._original.hdofcCd == undefined)          ? "" : rowData[i]._original.hdofcCd;
						rowData[i].areaId           = (rowData[i]._original.areaId == undefined)           ? "" : rowData[i]._original.areaId;
						rowData[i].demdBizDivCd     = (rowData[i]._original.demdBizDivCd == undefined)     ? "" : rowData[i]._original.demdBizDivCd;
						rowData[i].lowDemdBizDivCd  = (rowData[i]._original.lowDemdBizDivCd == undefined)  ? "" : rowData[i]._original.lowDemdBizDivCd;
						rowData[i].dsnDivCd         = (rowData[i]._original.dsnDivCd == undefined)         ? "" : rowData[i]._original.dsnDivCd;
						rowData[i].eqpDtlDivCd      = (rowData[i]._original.eqpDtlDivCd == undefined)      ? "" : rowData[i]._original.eqpDtlDivCd;
						rowData[i].dsnUnitCd        = (rowData[i]._original.dsnUnitCd == undefined)        ? "" : rowData[i]._original.dsnUnitCd;
						rowData[i].splyVndrNm       = (rowData[i]._original.splyVndrNm == undefined)       ? "" : rowData[i]._original.splyVndrNm;
						rowData[i].splyVndrCd       = (rowData[i]._original.splyVndrCd == undefined)       ? "" : rowData[i]._original.splyVndrCd;
						rowData[i].mtsoId           = (rowData[i]._original.mtsoId == undefined)           ? "" : rowData[i]._original.mtsoId;
						rowData[i].dsnQuty          = (rowData[i]._original.dsnQuty == undefined)          ? "" : rowData[i]._original.dsnQuty;
						rowData[i].inveQuty         = (rowData[i]._original.inveQuty == undefined)         ? "" : rowData[i]._original.inveQuty;
						rowData[i].buyQuty          = (rowData[i]._original.buyQuty == undefined)          ? "" : rowData[i]._original.buyQuty;
						rowData[i].namsMatlCd       = (rowData[i]._original.namsMatlCd == undefined)       ? "" : rowData[i]._original.namsMatlCd;
						rowData[i].namsMatlNm       = (rowData[i]._original.namsMatlNm == undefined)       ? "" : rowData[i]._original.namsMatlNm;
						rowData[i].reltBsisCtt      = (rowData[i]._original.reltBsisCtt == undefined)      ? "" : rowData[i]._original.reltBsisCtt;
						rowData[i].mtrlCost         = (rowData[i]._original.mtrlCost == undefined)         ? "" : rowData[i]._original.mtrlCost;
						rowData[i].cstrCost         = (rowData[i]._original.cstrCost == undefined)         ? "" : rowData[i]._original.cstrCost;
						rowData[i].lnInvtCost       = (rowData[i]._original.lnInvtCost == undefined)       ? "" : rowData[i]._original.lnInvtCost;
						rowData[i].invtCost         = (rowData[i]._original.invtCost == undefined)         ? "" : rowData[i]._original.invtCost;
						rowData[i].mtsoNm           = (rowData[i]._original.mtsoNm == undefined)           ? "" : rowData[i]._original.mtsoNm;
						rowData[i].bldAddr          = (rowData[i]._original.bldAddr == undefined)          ? "" : rowData[i]._original.bldAddr;
						rowData[i].siteCd           = (rowData[i]._original.siteCd == undefined)           ? "" : rowData[i]._original.siteCd;
						rowData[i].mtsoId           = (rowData[i]._original.mtsoId == undefined)           ? "" : rowData[i]._original.mtsoId;
						rowData[i].rmkCtt           = (rowData[i]._original.rmkCtt == undefined)           ? "" : rowData[i]._original.rmkCtt;
						rowData[i].fhOnafMeansNm    = (rowData[i]._original.fhOnafMeansNm == undefined)    ? "" : rowData[i]._original.fhOnafMeansNm;
						rowData[i].apmtRsn          = (rowData[i]._original.apmtRsn == undefined)          ? "" : rowData[i]._original.apmtRsn;
						rowData[i].demdEqpQuty      = (rowData[i]._original.demdEqpQuty == undefined)      ? "" : rowData[i]._original.demdEqpQuty;
						rowData[i].mtsoTypCd        = (rowData[i]._original.mtsoTypCd == undefined)        ? "" : rowData[i]._original.mtsoTypCd;
						rowData[i].afeYr            = (rowData[i]._original.afeYr == undefined)            ? "" : rowData[i]._original.afeYr;
						rowData[i].afeDemdDgr       = (rowData[i]._original.afeDemdDgr == undefined)       ? "" : rowData[i]._original.afeDemdDgr;
						rowData[i].dsnRsltSeq       = (rowData[i]._original.dsnRsltSeq == undefined)       ? "" : rowData[i]._original.dsnRsltSeq;
						rowData[i].fhYr             = (rowData[i]._original.fhYr == undefined)             ? "" : rowData[i]._original.fhYr;
						rowData[i].fhDgr            = (rowData[i]._original.fhDgr == undefined)            ? "" : rowData[i]._original.fhDgr;


					}
    	    	}

    	    	 $('#'+gridTab2).alopexGrid('rowSelect', {_state: {selected:true}}, false);




    			$('#'+gridTab2).alopexGrid('updateOption', {
    	    		grouping : {
    	    			useGrouping : true
    	    		},
    	    		cellInlineEdit : false
    	    	});

    			$('#'+gridTab2).alopexGrid('endEdit'); // 편집종료
    			$('#'+gridTab2).alopexGrid('hideCol', 'check');
    			$('#'+gridTab2).alopexGrid('dataScroll', 'left');
    	    	$('#btnCancelRow').hide();
    	    	$('#btnFixRow').show();

    	    	$('#btnSave2').setEnabled(false);
    	    	$('#btnAddRow2').setEnabled(false);
    	    	$('#btnCopyRow2').setEnabled(false);
    	    	$('#btnDeleteRow2').setEnabled(false);



    		}
    	}

    }

    //Grid에 Row출력
    function setSpGrid(GridID,Option,Data) {
		var serverPageinfo = {
	      		dataLength  : Option.pager.totalCnt, 	//총 데이터 길이
	      		current 	: Option.pager.pageNo, 		//현재 페이지 번호. 서버에서 받아온 현재 페이지 번호를 사용한다.
	      		perPage 	: Option.pager.rowPerPage 	//한 페이지에 보일 데이터 갯수
	      	};

	       	$('#'+GridID).alopexGrid('dataSet', Data, serverPageinfo);

	}

    /*------------------------*
	  * 엑셀 ON-DEMAND 다운로드
	  *------------------------*/
	function btnExportExcelOnDemandClickEventHandler(event,target){
		var gridData = $('#'+mTagetGrid).alopexGrid('dataGet');
		if (gridData.length == 0) {
			callMsgBox('','I', "데이터가 존재하지 않습니다." , function(msgId, msgRst){});
				return;
		}

		var excelMethod = '';
		var excelFlag = '';
		var excelFileNm = '';

		if( target == 'RV' ){
			excelFileNm = '유선망통합설계[수요검토]';
			excelMethod	= 'getTesEqpDsnRvMgmtList';
			excelFlag	= 'EqpDsnRvMgmtList';
		}else if( target == 'RSLT' ){
			excelFileNm = '유선망통합설계[설계결과]';
			excelMethod	= 'getTesEqpDsnRsltMgmtList';
			excelFlag	= 'EqpDsnRsltMgmtList';
		}

		var param	= getParamData(mTagetIdx);

		param = gridExcelColumn(param, $('#'+mTagetGrid));
		param.pageNo = 1;
		param.rowPerPage = 10;
		param.firstRowIndex = 1;
		param.lastRowIndex = 1000000000;
		param.inUserId = $('#sessionUserId').val();

		var now = new Date();
		var fileName = excelFileNm +'_'+ (lpad(now.getFullYear(), 4) + lpad(now.getMonth() + 1, 2) + lpad(now.getDate(), 2) + lpad(now.getHours(), 2) + lpad(now.getMinutes(), 2) + lpad(now.getSeconds(), 2));
		param.fileName = fileName;
		param.fileExtension = 'xlsx';
		param.excelPageDown = 'N';
		param.excelUpload = 'N';
		param.excelMethod = excelMethod;
		param.excelFlag = excelFlag;
		fileNameOnDemand = fileName + '.xlsx';

		console.log("excel param : ", param);

		$('#'+mTagetGrid).alopexGrid('showProgress');
		httpRequest('tango-transmission-biz/transmisson/configmgmt/commoncode/getTesExcelDownloadOnDemandBatchCall', param, 'POST', 'excelDownloadOnDemand');
	}

	function gridExcelColumn(param, $grid) {
		var gridColmnInfo = $grid.alopexGrid('headerGroupGet');

		var gridHeader = $grid.alopexGrid('columnGet', {
			hidden: false
		});

		var excelHeaderCd = '';
		var excelHeaderNm = '';
		var excelHeaderAlign = '';
		var excelHeaderWidth = '';
		for (var i = 0; i < gridHeader.length; i++) {
			if ((gridHeader[i].key != undefined && gridHeader[i].key != 'id' && gridHeader[i].key != 'ord'
				&& gridHeader[i].key != 'check' && gridHeader[i].key != 'mtsoLkupIcon' && gridHeader[i].key != 'mtsoIdIcon'
					&& gridHeader[i].key != 'splyVndrCdIcon' && gridHeader[i].key != 'lnkgMtsoLkupIcon'
						&& gridHeader[i].key != 'cardPortUseListIcon' && gridHeader[i].key != 'reviewListIcon'
							&& gridHeader[i].key != 'mapIcon' && gridHeader[i].key != 'lnInvtIcon' )) {
				var title = gridHeader[i].title.replace('<em class="color_red">*</em>','');
				excelHeaderCd += gridHeader[i].key;
				excelHeaderCd += ';';
				excelHeaderNm += title;
				excelHeaderNm += ';';
				excelHeaderAlign += gridHeader[i].align.replace('right','str_right');
				excelHeaderAlign += ';';
				excelHeaderWidth += gridHeader[i].width;
				excelHeaderWidth += ';';
			}
		}

		param.excelHeaderCd = excelHeaderCd;
		param.excelHeaderNm = excelHeaderNm;
		param.excelHeaderAlign = excelHeaderAlign;
		param.excelHeaderWidth = excelHeaderWidth;

		return param;
	}

	// 파일다운로드 실행
	function downloadFileOnDemand(jobInstanceId, fileName) {
		$a.popup({
			popid : 'CommonExcelDownlodPop' + jobInstanceId,
			title : '엑셀다운로드',
			iframe : true,
			modal : false,
			windowpopup : true,
			url : '/tango-transmission-web/configmgmt/commoncode/OnDemandExcelDownloadPop.do',
			data : {
				jobInstanceId : jobInstanceId,
				fileName : fileName,
				fileExtension : "xlsx"
			},
			width : 500,
			height : 300,
			callback : function(resultCode) {
				if (resultCode == "OK") {
					// $('#btnSearch').click();
				}
			}
		});
	}

	function lpad(value, length) {
		var strValue = '';
		if (value) {
			if (typeof value === 'number') {
				strValue = String(value);
			}
		}

		var result = '';
		for (var i = strValue.length; i < length; i++) {
			result += strValue;
		}

		return result + strValue;
	}

    //팝업 호출
    function popup(pidData, urlData, titleData, paramData) {
    	var width = 1500;
    	var height = 950;

    	if( paramData.popType == 'REFLCT' ){		// 설계결과
    		width = 1500;
    		height = 880;
    	}else if( paramData.popType == 'CAPA' ){	// 용량증설
    		width = 1500;
    		height = 900;
    	}else if( paramData.popType == 'HDOFC' ){	// 본부통계
    		width = 1000;
    		height = 710;
    	}else if( paramData.popType == 'PURP' ){	// 사업목적통계
    		width = 1270;
    		height = 740;
    	}else if( paramData.popType == 'DEMD' ){	// BPM수요통계
    		width = 1180;
    		height = 680;
    	}

        $a.popup({
        	popid: pidData,
        	title: titleData,
        	url: urlData,
        	data: paramData,
        	windowpopup : true,
        	modal: true,
        	movable:true,
        	width : width,
        	height : height,
        	callback: function(data) {
        		if(data == "APLY"){
					if(mTagetIdx == 1){
						setFormData(1, perPage1);
					}else if(mTagetIdx == 2){
						setFormData(1, perPage2);
					}
        		}
        	}
        });
	}

});