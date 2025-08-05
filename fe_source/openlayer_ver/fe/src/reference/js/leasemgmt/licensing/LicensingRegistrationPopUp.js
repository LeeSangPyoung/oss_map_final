/**
 * LicensingRegistrationPopUp.js
 *
 * @author 정현석
 * @date 2016. 9. 21
 * @version 1.0
 */
$a.page(function() {
    
	//그리드 ID
    //var gridDetailId = 'resultPopGrid';
	
    //초기 진입점
    //param에 이전 페이지에서 넘겨준 파라미터가 json형태로 저장 되어 있음.
    this.init = function(id, param) {
    	
    	//initGrid();
    	initDisabled();
    	setCombo(param);
    	setEventListener(param);
    };
    
    function initDisabled(){
    	if($('#lcenRqsProcStatCd option:selected').val() == '2'){
    		$("input:text").attr("disabled", "true");
    		$("input:radio").attr("disabled", "true");
    		$("input:checkbox").attr("disabled", "true");
    		$("textarea").attr("disabled", "true");
    	}
    }
    
    
    //Grid 초기화
    function initGrid() {
    	
    	var mapping = [
			//공통
			{
				selectorColumn : true,
				width : "25px" 
			}
			, { 
				key : "bldBlkNo",
				align : "right",
				width : "55px",
				title : "동 번호",
				hidden : true
			}, {
				key : 'bldBlkNm',
				align:'left',
				width:'100px',
				title : '동 이름',
				editable : {type : "text"}
			}, {
				key : 'bldRmk',
				align:'left',
				width:'100px',
				title : '비고',
				editable : {type : "text"}
			}
			, {
				key : 'utmkXcrdVal',
				align:'right',
				width:'90px',
				title : 'UTMK X값'
			}
			, {
				key : 'utmkYcrdVal',
				align:'right',
				width:'90px',
				title : 'UTMK Y값'
			}
			, {
				key : 'lastChgUserId',
				align:'left',
				width:'90px',
				title : '최종변경자'
			}
			, {
				key : 'lastChgDate',
				align:'center',
				width:'90px',
				title : '최종변경일자'
			}
			, {
				key : 'gisUtm',
				align:'center',
				width:'50px',
				title : 'GIS UTM'
			}
    	];
  		
        //그리드 생성
        $('#'+gridDetailId).alopexGrid({
        	//extend : ['resultPopGrid'],
        	height : 200,
            cellSelectable : true,
            autoColumnIndex : true,
            fitTableWidth : true,
            rowClickSelect : true,
            rowSingleSelect : false,
            rowInlineEdit : true,
            numberingColumnFromZero : false,
            columnMapping : mapping
        });
    };
    
    function setCombo(param) {
    	
    /*	if(param.viewFlag == "UPDATE") {
    		
    		var bldMainUsgCd = "";
    		var grudFlorCntCd = "";
    		var bldCnstDivCd = "";
    		var bldCstrTypCd = "";
    		var bldBizTypCd = "";
    		var bldCnstTypCd = "";
    		
    		if(param.hasOwnProperty('fdaisLdongCd')) {
    			bldMainUsgCd = param.fdaisBldMainUsgNm;
    			grudFlorCntCd = param.fdaisGrudFlorCntCd;
    			bldCnstDivCd = param.fdaisBldCnstDivCd;
    			bldCstrTypCd = param.fdaisBldCstrTypCd;
    			bldBizTypCd = param.fdaisBldBizTypCd;
    			bldCnstTypCd = param.fdaisBldPrcsCd;
    		}
    		else {
    			
    			bldMainUsgCd = param.lcenBldMainUsgCd;
    			bldCnstDivCd = param.lcenBldCnstDivCd;
    			
    			var grudFlorCnt = param.lcenGrudFlorCnt; //지상(층)
    			if(grudFlorCnt >= 3) {
    				grudFlorCntCd = "320003";
    			}
    			else if(grudFlorCnt == 2) {
    				grudFlorCntCd = "320002";
    			}
    			else if(grudFlorCnt == 1) {
    				grudFlorCntCd = "320001";
    			}
    			else {
    				grudFlorCntCd = "320004";
    			}
    		}
    		
    		selectComboCode('popBldMainUsgCd', 'NS', 'C00648', bldMainUsgCd); //주용도 코드
        	selectComboCode('popGrudFlorCntCd', 'NS', 'C00653', grudFlorCntCd); //지상층 코드
        	selectComboCode('popBldCnstDivCd', 'NS', 'C00647', bldCnstDivCd); //건축구분 코드
        	selectComboCode('popBldCstrTypCd', 'S', 'C00652', bldCstrTypCd); //공사유형 코드
        	selectComboCode('popBldBizTypCd', 'S', 'C00651', bldBizTypCd); //사업유형 코드
        	selectComboCode('popBldPrcsCd', 'NS', 'C00650', bldCnstTypCd); //건물공정 코드
    	}
    	else {*/
    		//$("#lcenReqMgmtNo").attr("disabled", true);
    		selectComboCode('skAfcoDivCd', 'NS', 'C00308', ''); //관리구분
    		selectComboCode('lcenRqsProcStatCd', 'N', 'C00442', ''); //인허가신청처리상태코드
    		//$('#lcenRqsProcStatCd').prop("disabled", true);	//인허가신청처리상태코드 disabled
    		selectComboCode('stWdthDivCd', 'N', 'C00368', ''); //도로너비구분코드
    		selectComboCode('landTypCd', 'N', 'C00550', ''); //토지유형코드
    		selectComboCode('landKndCd', 'N', 'C00551', ''); //토지종류코드
    		selectComboCode('lcenTypCd', 'N', 'C00443', ''); //인허가유형코드
    		selectComboCode('ftlcnDivCd', 'N', 'C00419', ''); //인허가구분코드
    		selectComboCode('payTypCd', 'N', 'C00525', ''); //허가자료지급구분
    		
    		
    		
    		
    	//}
    	
    }
    
    function setEventListener(param) {
        
    	$('#insDivCd').val(param.viewFlag);
    	
    	if(param.viewFlag == "I") {
    		//등록
    		console.log("INSERT Start");
    	}else{
    		//수정
    		console.log("UPDATE Start");
    		buildingDetailRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/selectbuildingdonglist', dataParam, 'GET', 'selectBuildingDongList');
    		
    	}
    	
    	
    	
    	/*else {
    		//수정
    		console.log("UPDATE Start");
    		
    		// 현장실사 데이터가 있는지 없는지 체크 하여 있다면, 현장실사 데이터로
    		// 없다면 세움터 데이터로 표시
    		
    		$('#pnuLtnoCd').val(param.pnuLtnoCd); // PNU
    		
    		if(param.hasOwnProperty('fdaisLdongCd')) {
    			$('#ldongCd').val(param.fdaisLdongCd.substring(0,10)); //법정동코드
    			$('#popAllAddr').val(param.fdaisAllAddr); //주소
    			$('#popAllAddrDetail').val(param.fdaisAllAddrDetail); //상세주소
    			$('#popAddrBunjiVal').val(param.fdaisAddrBunjiVal); //번지
    			$('#popHmstZnNm').val(param.fdaisHmstZnNm); //택지지구명
    			$('#popBldNm').val(param.fdaisBldNm); //건물명
    			$('#popBsmtFlorCnt').val(param.fdaisBsmtFlorCnt); //지하(층)
    			$('#popBldCnstAr').val(param.fdaisBldCnstAr); //건축면적
    			$('#popBldGenCnt').val(param.fdaisBldGenCnt); //세대수
    			$('#popBldHoushCnt').val(param.fdaisBldHoushCnt); //가구수
    			
    			$('#popCnstnCompNm').val(param.fdaisCnstnCompNm); //시공사
    			$('#popCstrChrgTlno').val(param.fdaisCstrChrgTlno); //연락처
    			$('#popFildTlplNo').val(param.fdaisFildTlplNo); //전주번호
    			$('#popFdaisMgmtNo').val(param.fdaisFdaisMgmtNo); //관로번호
    			$('#popFdaisDistVal').val(param.fdaisFdaisDistVal); //거리
    			
    			if( param.hasOwnProperty('fdaisCmplSchdDt') ) {
    				$('#popCmplSchdDt').val(param.fdaisCmplSchdDt.replaceAll("/","-")); //준공예정일
    			}

    			if( param.hasOwnProperty('fdaisCmplSchdDt') ) {
    				$('#popUseAprvDt').val(param.fdaisUseAprvDt.replaceAll("/","-")); //사용승인일
    			}
    			
    			$('#popFdaisRmk').val(param.fdaisFdaisRmk); //비고 
    			$('#popfdaisFdaisNo').val(param.fdaisNo); //FDAIS_NO

    			var bldCd = param.fdaisNo;
    			bldCd = bldCd.substring(2, 16);
    			console.log("bldCd : "+ bldCd);
    			var dataParam = {
        				bldCd : bldCd
        		};
        		
        		buildingDetailRequest('tango-transmission-biz/transmisson/demandmgmt/buildinginfomgmt/selectbuildingdonglist', dataParam, 'GET', 'selectBuildingDongList');
    		}
    		else if(param.hasOwnProperty('lcenLdongCd')) {
    			
    			if( param.hasOwnProperty('lcenLdongCd') ) {
    				$('#ldongCd').val(param.lcenLdongCd.substring(0,10)); //법정동코드
    			}

    			$('#popAllAddr').val(param.lcenLndLoc); //주소
    			$('#popAddrBunjiVal').val(param.addrBunjiVal); //번지
    			//$('#popHmstZnNm').val(param.lcenBldZnNm); //택지지구명
    			$('#popBldNm').val(param.lcenBldNm); //건물명
    			$('#popBsmtFlorCnt').val(param.lcenBsmtFlorCnt); //지하(층)
    			$('#popBldCnstAr').val(param.lcenBldCnstAr); //건축면적
    			$('#popBldGenCnt').val(param.lcenBldGenCnt); //세대수
    			$('#popBldHoushCnt').val(param.lcenBldHoushCnt); //가구수
    			$('#popUseAprvDt').val(param.lcenUseAprvDt); //사용승인일
    		}
    		else {
    			
    			$('#ldongCd').val(param.ldongCd);
    			
    			var addr = param.sidoNm + " " + param.sggNm + " " + param.emdNm;
    			
    			if(param.hasOwnProperty('riNm')) {
    				addr += " " + param.riNm;
    			}
    			console.log("addr1 : " + addr);
    			$('#popAllAddr').val(addr); //주소
    			$('#popAddrBunjiVal').val(param.addrBunjiVal); //번지
    			//$('#popHmstZnNm').val(param.lcenBldZnNm); //택지지구명
    			$('#popBldNm').val(param.bldNm); //건물명
    			$('#popBsmtFlorCnt').val(param.lcenBsmtFlorCnt); //지하(층)
    			$('#popBldCnstAr').val(param.lcenBldCnstAr); //건축면적
    			$('#popBldGenCnt').val(param.lcenBldGenCnt); //세대수
    			$('#popBldHoushCnt').val(param.lcenBldHoushCnt); //가구수
    			$('#popUseAprvDt').val(param.lcenUseAprvDt); //사용승인일
    		}
    	}*/
    	
    	$('#lcenRqsProcStatCd').change(function() {
    		if($('#lcenRqsProcStatCd option:selected').val() == '1'){
    			//인허가신청처리상태코드가 신청처리중이면 인허가결과내용 disabled
    			$("#lcenRsltCttTextArea").css("display","none"); //인허가결과내용
    		}else{
    			$("#lcenRsltCttTextArea").css("display","table-row");
    		}
    	});
    	
    	
    	$('#ftlcnDivCd').change(function() {
    		if($('#ftlcnDivCd option:selected').val() != '3'){
    			//인허가구분값이 미완료외에 값을 선택시 미허가사유 빈값 처리
    			$('#lcenImpsRsn').val(''); //미허가사유 빈값 처리
    		}
    	});
    	
    	//공사정보조회
        $('#btnCstrCdSearch').on('click', function(e){
        	btnCstrCdSearchClickEventHandler(e);
        });
    	
    	
    	
    	//$('#popAllAddr').on('click', function(e) {
    		//if($('#flag').val() == "INSERT") {
    			//주소검색창 호출 함수
        		//searchAddress();
    		//}
    	//});
    	
    	/*$('#addrow').on('click', function(e) {
    		var rowData = {
    				bldBlkNm : "필수입력"
    				, utmkXcrdVal : "0"
    				, utmkYcrdVal : "0"
    				, frstRegUserId : ""
    				, gisUtm : ""
    		};
    		
    		$('#resultPopGrid').alopexGrid("dataAdd", rowData);
    	});
    	
    	$('#deleterow').on('click', function(e) {
        	var dataList = $('#'+gridDetailId).alopexGrid("dataGet", {_state : {selected:true}} );
        	if (dataList.length <= 0) {
        		alert("선택된 데이터가 없습니다.\n삭제할 데이터를 선택해 주세요.");
        		return;
        	}
        	
        	for (var i = dataList.length-1; i >= 0; i--) {
        		var data = dataList[i];    		
        		var rowIndex = data._index.data;
        		$('#'+gridDetailId).alopexGrid("dataDelete", {_index : { data:rowIndex }});

        	}  
        });*/
    	
    	// 저장
        $('#btnSave').on('click', function(e) {
        	
        	/*//건물 동 정보 데이터 셋팅   
        	//$('#'+gridDetailId).alopexGrid('endEdit', {_state:{editing:true}});
        	
        	var dongInfoInsertList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : true, deleted : false }} ));
        	var dongInfoUpdateList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : false, edited : true, deleted : false }} ));
        	var dongInfoDeleteList = AlopexGrid.trimData ( $('#'+gridDetailId).alopexGrid("dataGet", { _state : {added : false, deleted : true }} ));    	
        	
        	// 유효성 체크
        	if( !checkValidation(dongInfoInsertList, dongInfoUpdateList) ) {
        		return false;
        	}*/

        	var dataParam =  $("#detailForm").getData();
        	/*
        	$.each(dataParam, function(key, value) {
        		
        		if(key != "pnuLtnoCd") {
        			var replaceKey = key.replace("pop", "fdais");
        			
        			if(value != null || value != "") {
        				dataParam[replaceKey] = value;
        			}
        		}
        	});

        	dataParam.gridData = { 
        			dongInfoInsertList : dongInfoInsertList
        			, dongInfoUpdateList : dongInfoUpdateList
        			, dongInfoDeleteList : dongInfoDeleteList
        	};*/
        	
        	//console.log("replace Param");
        	console.log(dataParam);
        	
        	licensingRegRequest('tango-transmission-biz/leasemgmt/licensingmgmt/licensingMerge', dataParam, 'POST', 'licensingMerge')
        });
        
     	// 취소
        $('#btnCancel').on('click', function(e) {
        	$a.close();
        });
	};

	
	
	//공사정보조회
    function btnCstrCdSearchClickEventHandler(event){  
    	if($('#cstrCd').val() == ''){
    		$('#cstrNm').val('');
    	}
    	setConstruction('cstrCd', 'cstrNm');
    }
	
	
	
	
	//request
	function licensingRegRequest(surl,sdata,smethod,sflag)
    {
    	Tango.ajax({
    		url : surl,
    		data : sdata,
    		method : smethod
    	}).done(function(response){successBuildingInfoMergeCallback(response, sflag);})
    	  .fail(function(response){failBuildingInfoMergeCallback(response, sflag);})
    	  //.error();
    }
	
	//request 성공시
    function successBuildingInfoMergeCallback(response, flag){
    	console.log("response="+response);
    	console.log("flag="+flag);
    	if(flag == 'licensingMerge'){
    		alert("저장 되었습니다.");
    		
    		var param = {
    			flag : 'search'	
    		};
    		
    		$a.close(param);
    	}
    	if(flag == 'selectBuildingDongList') {
    		console.log(response);
    		$('#'+gridDetailId).alopexGrid("dataSet", response.list);
    	}
    }
    
    //request 실패시.
    function failBuildingInfoMergeCallback(serviceId, response, flag){
    	console.log(response);
    	alert('실패');
    }
    
    /*function searchAddress() {
    	$a.popup({
    		popid: 'LmAddrPopup',
    		url : 'SearchAddress.do',
    		iframe : false,
    		modal : true,
    		width : 830,
    		height : 630,
    		title : '주소 검색',
    		movable : true,
    		callback : function(data){
    			
    			console.log("data"+data);
    			
    			var bunji = "";
    			
    			if(data.selectSmlBunjiVal != "") {
    				bunji = data.selectBigBunjiVal + "-" + data.selectSmlBunjiVal;
    			}
    			else {
    				bunji = data.selectBigBunjiVal;
    			}
    			
    			$('#popAllAddr').val(data.selectAllAddr);
    			//$('#popAddrBunjiVal').val(bunji);
    			$('#ldongCd').val(data.selectLdongCd);
    			$('#pnuLtnoCd').val(data.selectPnuLtnoCd);
    		}
    	});
    }
    */
    function checkValidation(dongInfoInsertList, dongInfoUpdateList) {
    	if($('#popAllAddr1').val() == "") {
    		alert("주소는 필수 입력 값 입니다.");
    		return false;
    	}
    	
    	if($('#popBldNm').val() == "") {
    		alert("주소는 필수 입력 값 입니다.");
    		return false;
    	}
    	
    	if($('#popBldMainUsgCd').val() == "") {
    		alert("주용도는 필수 입력 값 입니다.");
    		return false;
    	}
    	
    	if($('#popBldCnstDivCd').val() == "") {
    		alert("건축구분은 필수 입력 값 입니다.");
    		return false;
    	}
    	
    	if($('#popBldPrcsCd').val() == "") {
    		alert("건물공정은 필수 입력 값 입니다.");
    		return false;
    	}
    	
    	if($('#popGrudFlorCntCd').val() == "") {
    		alert("지상(층)은 필수 입력 값 입니다.");
    		return false;
    	}
    	
    	if($('#popCstrChrgTlno').val() == "") {
    		alert("연락처는 필수 입력 값 입니다.");
    		return false;
    	}

    	var regNumber = /[^0-9]/g;
    	var regNumberPoint = /[^\.0-9]/g;

    	if( regNumber.test($('#popBsmtFlorCnt').val()) ) {
    		alert("층 입력은 숫자만 입력 가능합니다.");
    		return false;
    	}
    	
    	if( regNumberPoint.test($('#popBldCnstAr').val()) ) {
    		alert("건축면적 입력은 숫자만 입력 가능합니다.");
    		return false;
    	}
    	
    	if( regNumber.test($('#popBldGenCnt').val()) ) {
    		alert("세대수 입력은 숫자만 입력 가능합니다.");
    		return false;
    	}
    	
    	if( regNumber.test($('#popBldHoushCnt').val()) ) {
    		alert("가구수 입력은 숫자만 입력 가능합니다.");
    		return false;
    	}
    	
    	
    	for(var i=0; i<dongInfoInsertList.length; i++) {
    		if( dongInfoInsertList[i].bldBlkNm == "필수입력" || dongInfoInsertList[i].bldBlkNm == "" ) {
    			alert("건물 동 이름은 필수 입력 입니다.");
        		return false;
    		}
    	}
    	
    	for(var i=0; i<dongInfoUpdateList.length; i++) {
    		if( dongInfoUpdateList[i].bldBlkNm == "필수입력" || dongInfoUpdateList[i].bldBlkNm == "" ) {
    			alert("건물 동 이름은 필수 입력 입니다.");
        		return false;
    		}
    	}
    	
    	return true;
    }
});