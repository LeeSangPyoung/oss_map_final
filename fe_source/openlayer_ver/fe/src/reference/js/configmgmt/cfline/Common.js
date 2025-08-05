	var vTmofInfo =[];  // 관할전송실 SPAN 데이타

	var mgmtGrpCdData = [];  // 관리그룹 데이터
	var hdofcCdData = [];  // 본부 데이터
	var teamCdData = [];  // 팀 데이터
	var tmofCdData = [];  // 전송실 데이터
	var mtsoCdData = [];  // 국사 데이터
	var userMgmtCd = "";   // 로그인 사용자의 관리그룹
	var viewMgmtCd = "";   // 본부/팀/전송실 등의 response가 오기전에 사용자가 화면에서 관리그룹을 변경한 경우 해당값 기준으로 본부등이 보여져야 하기 때문에
	var mgmtCdSelectBoxId = "";
	var hdofcSelectBoxId = "";	
	var teamCdSelectBoxId = "";	
	var tomfIdSelectBoxId = "";
	
	var tomfHeaderYn = "";
	var selPrePendTmof = {"value":"","text":"전체"};// 메시지 처리 하면 에러가 발생 하는곳이 있을 수도 있음.
	var unshiftCnt = 0;

	// 사용자 정보 설정
	var userJrdtTmofInfo = null;
	
	// 현재는 WDM 트렁크에서만 값을 설정하여 처리하고 있음
	var chkExtractAcceptNtwkLine = "";  // 수용네트워크목록 추출중 SAVE : 저장후호출, CHK_SAVE : [저장을 완료하였습니다/에러메세지] 표시한 후 
	
	var chkAprv = null;		// 회선 승인자 사용권한 설정 : 승인자 확인 후
	
	// 2020-11-11 선번창및 시각화선번편집창 에서 전송실 완료 불가 데이터확인을 위해 추가
	var svlnStatCd = null;
	var topoLclCd = null;
	var ntwkStatCd = null;
	var hdofcOrgId = null;
	var teamOrgId = null;
	
$(document).ready(function() {   
	//console.log("common.js loaded .. [$(document).ready()]");	
	userJrdtTmofInfo = null;
});



/**
 * 
 * TX 포트와 RX 포트를 비교하여 랙, 쉘프, 카드, 포트 중 다른 부분부터 RX 포트를 가로안에 표시한다.
 * 예를 들어, TX 포트가 "01-01-01-01" 이고, RX 포트가 "01-01-01-02" 이면 "01-01-01-01(02)" 로 리턴한다.
 * RX 포트를 출력을 시작할 위치는 TX 와 다른 문자 직전의 구분자("-,/()") 다음부터이다.
 * 만약, RX 포트가 Empty 이거나 TX 포트랑 동일하다면 TX 포트만 리턴한다.
 * 
 * @param txPort
 * @param rxPort
 * @return String
 */
//function makeTxRxPortDescr (txPort, rxPort ) {	
//	var returnValue = "";
//	try {
//		
//		if ( nullToEmpty(rxPort) == "" ) {
//			return txPort;
//		}
//		
//		if ( txPort == rxPort ) {
//		    return txPort;
//		}
//		
//		//	TX 포트와 RX 포트를 비교하여 다른 부분(랙, 쉘프, 카드, 포트)부터 RX 포트를 가로안에 표시한다.
//		var strDescr = new StringBuilder(txPort);
//		var split = "-,/()";
//		
//		var splitIdx = -1;
//		for (var idx=0 ; idx <txPort.length(); idx++ ) {
//			var chPort = txPort.charAt(idx);
//			if ( split.indexOf(chPort) >= 0 ) {
//				splitIdx = idx;
//			}
//			
//			if ( idx < rxPort.length() ) {
//				var chRxPort = rxPort.charAt(idx);
//				if ( chPort != chRxPort ) {
//					break;
//				}
//			}
//			else {
//				break;
//			}
//		}	
//		
//		//	FDF 포트 등 구분자가 아예 없는 경우는 RX 포트 전체를 표시한다.
//		if ( splitIdx >= -1 && rxPort.length() > 0 && splitIdx < rxPort.length() ) {
//			strDescr.append("(");
//			strDescr.append(rxPort.substring(splitIdx+1));
//			strDescr.append(")");
//		}
//		
//		returnValue = strDescr.toString();	
//		return returnValue;	
//	} catch ( err ) {
//        console.log(err);
//    	return txPort;	
//	}	
//}

function makeTxRxPortDescr(txPort, rxPort ) {
	if ( nullToEmpty(rxPort) =="" ) {
		return txPort;
	}
	
	if ( nullToEmpty(txPort) == nullToEmpty(rxPort) ) {
	    return txPort;
	}
	
	var tmpTxPort = nullToEmpty(txPort);
	
	//	TX 포트와 RX 포트를 비교하여 다른 부분(랙, 쉘프, 카드, 포트)부터 RX 포트를 가로안에 표시한다.
	var strDescr = nullToEmpty(txPort);
	var split = "-,/()";
	
	var splitIdx = -1;
	for ( var idx = 0; idx <tmpTxPort.length; idx++ ) {
		var chPort = tmpTxPort.charAt(idx);
		if ( split.indexOf(chPort) >= 0 ) {
			splitIdx = idx;
		}
		
		if ( idx < rxPort.length ) {
			var chRxPort = rxPort.charAt(idx);
			if ( chPort != chRxPort ) {
				break;
			}
		}
		else {
			break;
		}
	}
	
	//	FDF 포트 등 구분자가 아예 없는 경우는 RX 포트 전체를 표시한다.
	if ( splitIdx >= -1 && rxPort.length > 0 && splitIdx < rxPort.length ) {
		strDescr += "(" + rxPort.substring(splitIdx+1) + ")";
	}
	return strDescr;	
}

function nullToEmpty(str) {
    if (str == null || str == "null" || typeof str == "undefined") {
    	str = "";
    }	
	return str;
}

function checkRowData(GridId) {
	$('#'+GridId).alopexGrid('endEdit', {_state: {editing:true}});
	var editingRow = AlopexGrid.trimData($( '#'+GridId).alopexGrid("dataGet", [{_state:{editing:true}}]));
	if (editingRow.length > 0 ){
		return false;
	} else {
		return true;
	}
}

function getNumberFormatDis(value){
	var returnValue = value + "";
	if(nullToEmpty(value) != ""){
		var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
		var arrNumber = returnValue.split('.'); // 소수점 분리
		arrNumber[0] +='.'; // 정수 끝에 소숫점 추가
		do{
			arrNumber[0] = arrNumber[0].replace(rxSplit,'$1,$2');
		} while(rxSplit.test(arrNumber[0]));
		
		if(arrNumber.length >1){
			returnValue = arrNumber.join('');
		}else{

			returnValue = arrNumber[0].split('.')[0];
		}
	}
	return returnValue;
}
/**
 * 
 * @param value
 * @param gubun{1:부호선택, 자리수구분기호선택, 소수점선택, 2:부호 미사용, 자리수구분기호 선택, 소수점 선택, 3:부호 미사용, 자리수구분기호 미사용, 소수점 선택,:only 숫자만}
 * @returns {Boolean}
 */
function isNumeric(value, gubun){
	var returnValue = false;
	var regExpHeader = new RegExp(/^[1-9]/);
	value = String(value).replace(/^\s+$/g,"");//공백제거
	if(gubun =="1"){
		// 부호선택, 자리수구분기호선택, 소수점선택
		var regExp = /^-?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
	}else if(gubun =="2"){
		// 부호 미사용, 자리수구분기호 선택, 소수점 선택
		var regExp = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
	}else if(gubun == "3"){
		// 부호 미사용, 자리수구분기호 미사용, 소수점 선택
		var regExp = /^[0-9]+(\.[0-9]+)?$/g;
	}else{
		// only 숫자만(부호 미사용, 자리수구분기호 미사용, 소수점 미사용)
		var regExp = /^[0-9]$/g;
	}
	if(regExp.test(value)){
		value = value.replace(/,/g,"");		
		returnValue = isNaN(value) ? false : true;
	}	
	return returnValue;
}

/*
 * Function Name : gridExcelColumn
 * Description   : 그리드 편집시 숫자컬럼 우측정렬하는 css class return
 * ----------------------------------------------------------------------------------------------------
 * param    	: 합쳐질 파라메터
 * gridId     	: 그리드ID
 * ----------------------------------------------------------------------------------------------------
 * return        : return param  
 */

function gridExcelColumn(param, gridId) {
	var gridColmnInfo = $('#'+gridId).alopexGrid("headerGroupGet");
	//console.log(gridColmnInfo);
	
	var gridHeader = $('#'+gridId).alopexGrid("columnGet", {hidden:false, numberingColumn:undefined});
	
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

function getHeaderGroupForCfLine(gridId) {
	
	var headerGroup = $('#'+gridId).alopexGrid("headerGroupGet");
	var mergeHdTitle = '';
	var hiddenColYn = false;
	//console.log(headerGroup);
	//if (detailType == '') {
		if (headerGroup.length > 0 && headerGroup[0].fromIndex != undefined) {
			var hederGroupLastIdx = headerGroup.length-1;
			if (headerGroup[0].groupColumnIndexes[0] < headerGroup[hederGroupLastIdx].groupColumnIndexes[0]) {
				for (var i = 0 ;i < headerGroup.length ; i++) {
					if((headerGroup[i].title != undefined )) {
						var groupColCnt = headerGroup[i].groupColumnIndexes.length -1;
						
						mergeHdTitle += headerGroup[i].title + ',' + headerGroup[i].groupMappingList[0].key;						
						mergeHdTitle += ',' + headerGroup[i].groupMappingList[groupColCnt].key;
						
						/*mergeHdTitle += headerGroup[i].title + ',' + headerGroup[i].groupColumnIndexes[0];						
						mergeHdTitle += ',' + headerGroup[i].groupColumnIndexes[groupColCnt];*/
						
						mergeHdTitle += ";";
					}
				}
			} else if (headerGroup[0].groupColumnIndexes[0] > headerGroup[hederGroupLastIdx].groupColumnIndexes[0]) {
				for (var i = headerGroup.length - 1 ;i >= 0 ; i--) {
					if((headerGroup[i].title != undefined )) {
						var groupColCnt = headerGroup[i].groupColumnIndexes.length -1;

						mergeHdTitle += headerGroup[i].title + ',' + headerGroup[i].groupMappingList[0].key;						
						mergeHdTitle += ',' + headerGroup[i].groupMappingList[groupColCnt].key;
						
						mergeHdTitle += ";";
					}
				}
			}
		}
	//}
		
	return mergeHdTitle;
} 


	var httpCommon2Request = function(Url, Param, Method, Flag, Str ) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
		}).done(function(response){commonCallbackSuccess(response, Flag, Str, Param, "N");})
		  .fail(function(response){commonCallbackFail(response, Flag, Str);})
		
		//.done(commonCallbackSuccess)
		 // .fail(commonCallbackFail);
	}
	//selGbn("":전체,"N":안함,"A":전체,"S":선택)	
	var httpCommonRequest = function(Url, Param, Method, Flag, Str, selGbn) {
		Tango.ajax({
			url : Url, //URL 기존 처럼 사용하시면 됩니다.
			data : Param, //data가 존재할 경우 주입
			method : Method, //HTTP Method
		}).done(function(response){commonCallbackSuccess(response, Flag, Str, Param, selGbn);})
		  .fail(function(response){commonCallbackFail(response, Flag, Str);})
		
		//.done(commonCallbackSuccess)
		 // .fail(commonCallbackFail);
	}

	function commonCallbackSuccess(response, flag, str, paramValue, selGbn){
		var selPrePendStr = "";
		if(selGbn == 'S'){
			//selPrePendStr = '<option value="">선택</option>';
			selPrePendStr = cflineCommMsgArray['select'] /* 선택 */;
		}else if(selGbn == 'N'){
			selPrePendStr = "";
		}else{
			//selPrePendStr = '<option value="">전체</option>';
			selPrePendStr = cflineCommMsgArray['all'] /* 전체 */;
		}
	
		if(flag == 'hdofcCmCdData') {
			//console.log("hdofcCmCdData....recive : " );
			var mgmtCdValue = viewMgmtCd;//userMgmtCd; 화면에 있는 관리자 그룹의 값에 따라 설정되어야 하기 때문
			
			var hdofcCd_option_data =  [];
			var hdofcCd_option_data2 =  [];
			for(k=0; k<response.hdofcCdList.length; k++){
				if(k==0 && nullToEmpty(selPrePendStr) != ""){
					var dataHdofcFst = {"value":"","text":selPrePendStr};
					hdofcCd_option_data.push(dataHdofcFst);
					hdofcCd_option_data2.push(dataHdofcFst);
				}
				var dataHdofc = response.hdofcCdList[k];  
				hdofcCd_option_data.push(dataHdofc);
				if(mgmtCdValue =="" || mgmtCdValue == dataHdofc.mgmtGrpCd){
					hdofcCd_option_data2.push(dataHdofc);
				}
			}		
			hdofcCdData = hdofcCd_option_data;
			$('#' + str).clear();
			$('#' + str).setData({data : hdofcCd_option_data2});
			
			setUserInfo(str, null, null);
			
		}
		if(flag == 'teamCmCdData') {
			//console.log("teamCmCdData....recive : " );
			var mgmtCdValue = viewMgmtCd;//userMgmtCd; 화면에 있는 관리자 그룹의 값에 따라 설정되어야 하기 때문
			var teamCd_option_data =  [];
			var teamCd_option_data2 =  [];
			var tempHdofcVal = "";
			// 본부 콤보 값 취득
			if (hdofcSelectBoxId != null && hdofcSelectBoxId != "" && $('#'+hdofcSelectBoxId).val() != undefined && $('#'+hdofcSelectBoxId).val() != "") {
				tempHdofcVal = $('#'+hdofcSelectBoxId).val(); 
				//console.log("tempHdofcVal : " + tempHdofcVal);
			}
			
			for(k=0; k<response.teamCdList.length; k++){
				if(k==0 && nullToEmpty(selPrePendStr) != ""){
					var dataTeamFst = {"value":"","text":selPrePendStr};
					teamCd_option_data.push(dataTeamFst);
					teamCd_option_data2.push(dataTeamFst);
				}
				var dataTeam = response.teamCdList[k];  
				teamCd_option_data.push(dataTeam);
				
				// 본부 정보가 있는경우
				if (tempHdofcVal != "") {
					if (tempHdofcVal == dataTeam.uprOrgId) {
						teamCd_option_data2.push(dataTeam);
					}						
				} else {
					if(mgmtCdValue =="" || mgmtCdValue == dataTeam.mgmtGrpCd){
						teamCd_option_data2.push(dataTeam);
					}
				}
			}		
			teamCdData = teamCd_option_data;
			$('#' + str).clear();
			$('#' + str).setData({data : teamCd_option_data2});
						
			// 전송실 정보가 먼저 온경우
			if (tmofCdData.length > 0) {
				var tempHdofcVal = "";
				var tempTeamCdVal = "";
				var tempTeamCdValList = "";
				
				// 본부 콤보 값 취득
				if (hdofcSelectBoxId != null && hdofcSelectBoxId != "" && $('#'+hdofcSelectBoxId).val() != undefined && $('#'+hdofcSelectBoxId).val() != "") {
					tempHdofcVal = $('#'+hdofcSelectBoxId).val();
					// 본부에 속하는 팀 편집
					if (teamCdData.length >0) {
						for (i=0; i<teamCdData.length; i++) {
							if (tempHdofcVal == teamCdData[i].uprOrgId) {
								tempTeamCdValList = tempTeamCdValList + "," + teamCdData[i].value;
							}
						}
					} else {
						tempHdofcVal = "";
					}
				}
				
				// 팀정보가 있는경우
				if (teamCdSelectBoxId != null && teamCdSelectBoxId != "" && $('#'+teamCdSelectBoxId).val() != undefined && $('#'+teamCdSelectBoxId).val() != "") {
					tempTeamCdVal = $('#'+teamCdSelectBoxId).val();
				}
				
				var tmofCd_option_data =  [];
				if(tomfHeaderYn == "Y"){
					tmofCd_option_data.push(selPrePendTmof);
				}
				// 전송실 정보 목록 편집
				for(k=0; k<tmofCdData.length; k++){
					var dataTmof = tmofCdData[k];  
					
					// 팀이 있는경우
					if (tempTeamCdVal != "") {
						//console.log("tempHdofcVal : " + tempHdofcVal + " tempTeamCdVal : " + tempTeamCdVal);
						if (tempTeamCdVal == dataTmof.teamCd) {
							tmofCd_option_data.push(dataTmof);
						}					
					}
					// 본부만 있는경우
					else if(tempHdofcVal != "" && tempTeamCdVal == "" && tempTeamCdValList.length> 0) {
						//console.log("tempHdofcVal : " + tempHdofcVal + " tempTeamCdVal : " + tempTeamCdVal + " tempTeamCdValList : " + tempTeamCdValList);
						if (tempTeamCdValList.indexOf(dataTmof.teamCd)>0) {
							tmofCd_option_data.push(dataTmof);
						}
					} 
					else if(mgmtCdValue =="" || mgmtCdValue == dataTmof.mgmtGrpCd){
						//tmofCd_option_data.push(dataTmof);
						// 관리그룹이 설정된 경우 그 그룹별로 전송실 편집이 필요한데 정렬 순서가 달라 정리함
						if (mgmtCdValue != "") {
							tmofCd_option_data = editMgmtGrpCdTmof(); 
							break;
						} else {
							tmofCd_option_data.push(dataTmof);
						}
					}
				}
				//console.log(tmofCd_option_data);
				if (tmofCd_option_data.length > 0 && tomfIdSelectBoxId != null && tomfIdSelectBoxId != "") {
					$('#' + tomfIdSelectBoxId).clear();
					$('#' + tomfIdSelectBoxId).setData({data : tmofCd_option_data});
				}

				// 사용자 정보 설정
				setUserInfo(null, str, tomfIdSelectBoxId);
			} else {
				// 사용자 정보 설정
				setUserInfo(null, str, null);
			}
			
		}
		if(flag == 'tmofCmCdData') {			
			var mgmtCdValue = viewMgmtCd;//userMgmtCd; 화면에 있는 관리자 그룹의 값에 따라 설정되어야 하기 때문
			tmofCdData = response.tmofCdList;
			//console.log("tmofCmCdData....recive : " );
			//console.log(tmofCdData);
			var tempHdofcVal = "";
			var tempTeamCdVal = "";
			var tempTeamCdValList = "";
			// 본부 콤보 값 취득
			if (hdofcSelectBoxId != null && hdofcSelectBoxId != "" && $('#'+hdofcSelectBoxId).val() != undefined && $('#'+hdofcSelectBoxId).val() != "") {
				tempHdofcVal = $('#'+hdofcSelectBoxId).val();
				// 본부에 속하는 팀 편집
				if (teamCdData.length >0) {
					for (i=0; i<teamCdData.length; i++) {
						if (tempHdofcVal == teamCdData[i].uprOrgId) {
							tempTeamCdValList = tempTeamCdValList + "," + teamCdData[i].value;
						}
					}
				} else {
					tempHdofcVal = "";
				}
			}
			// 팀정보가 있는경우
			if (teamCdSelectBoxId != null && teamCdSelectBoxId != "" && $('#'+teamCdSelectBoxId).val() != undefined && $('#'+teamCdSelectBoxId).val() != "") {
				tempTeamCdVal = $('#'+teamCdSelectBoxId).val();
			}
			var tmofCd_option_data =  [];
			if(tomfHeaderYn == "Y"){
				tmofCd_option_data.push(selPrePendTmof);
			}
			
			for(k=0; k<response.tmofCdList.length; k++){
				var dataTmof = response.tmofCdList[k];  
				
				// 팀이 있는경우
				if (tempTeamCdVal != "") {
					//console.log("tempHdofcVal : " + tempHdofcVal + " tempTeamCdVal : " + tempTeamCdVal);
					if (tempTeamCdVal == dataTmof.teamCd) {
						tmofCd_option_data.push(dataTmof);
					}					
				}
				// 본부만 있는경우
				else if(tempHdofcVal != "" && tempTeamCdVal == "" && tempTeamCdValList.length> 0) {
					//console.log("tempHdofcVal : " + tempHdofcVal + " tempTeamCdVal : " + tempTeamCdVal + " tempTeamCdValList : " + tempTeamCdValList);
					if (tempTeamCdValList.indexOf(dataTmof.teamCd)>0) {
						tmofCd_option_data.push(dataTmof);
					}
				} 
				else if(mgmtCdValue =="" || mgmtCdValue == dataTmof.mgmtGrpCd){
					//console.log(dataTmof);
					// 관리그룹이 설정된 경우 그 그룹별로 전송실 편집이 필요한데 정렬 순서가 달라 정리함
					if (mgmtCdValue != "") {
						tmofCd_option_data = editMgmtGrpCdTmof(); 
						break;
					} else {
						tmofCd_option_data.push(dataTmof);
					}
				}
			}
			$('#' + str).clear();
			$('#' + str).setData({data : tmofCd_option_data});
			//console.log("tmofCmCdData : " + str);
			setUserInfo(null, null, str);
		}
		// 전송실 선택시 국사 정보 세팅
		if(flag == 'mtsoCode') {
			mtsoCdData = response;
			$('#' + str).clear();
			$('#' + str).setOptions({source : mtsoCdData});
			//$('#mtso' ).setOptions({source: response });
		}
//		if(flag == 'msgFlag'){
//			alert('메시시 창 성공');
//		}
		
		if(flag == 'C00188'){	
			// mgmtGrpCdData
			var mgmtGrpCd_option_data =  [];
			for(k=0; k<response.length; k++){
				if(k==0 && nullToEmpty(selPrePendStr) != ""){
					var dataHdofcFst = {"value":"","text":selPrePendStr};
					mgmtGrpCd_option_data.push(dataHdofcFst);
				}
				var dataMgmtGrp = response[k];  
				mgmtGrpCd_option_data.push(dataMgmtGrp);
			}		
			$('#' + str).clear();
			$('#' + str).setData({data : mgmtGrpCd_option_data});	
			// 세션의 관리그룹이 있는경우
			if (userMgmtCd != null && userMgmtCd != 'null' && userMgmtCd != "") {
				// 소속전송실에 속한 관리그룹이 있는 경우
				if ($('#userJrdtTmofMgmtCd').val() != undefined) {
					var userJrdtTmofMgmtCd = $('#userJrdtTmofMgmtCd').val();
					// 소속전송실에 속한 관리그룹이 있는 경우 소속전송실의 관리그룹으로 설정
				    if ($('#userJrdtTmofMgmtCd').val() != "" && $('#' + str).find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1) {
				    	$('#' + str).setSelected(userJrdtTmofMgmtCd);
				    } else {
				    	// 소속전송실에 속한 관리그룹이 없는 경우
						$('#' + str).setSelected(userMgmtCd);	
				    }			
				} else {
					// 소속전송실에 속한 관리그룹이 없는 경우
					$('#' + str).setSelected(userMgmtCd);	
				}
			} else {
				// 소속전송실에 속한 관리그룹이 있는 경우
				if ($('#userJrdtTmofMgmtCd').val() != undefined) {
					var userJrdtTmofMgmtCd = $('#userJrdtTmofMgmtCd').val();
					// 소속전송실에 속한 관리그룹이 있는 경우 소속전송실의 관리그룹으로 설정
				    if ($('#userJrdtTmofMgmtCd').val() != "" && $('#' + str).find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1) {
				    	//$('#' + str).setSelected(userJrdtTmofMgmtCd);
				    }			
				}
			}
			
			//console.log(mgmtGrpCd_option_data);
		}
		
		if(flag == 'tmofInfoPop'){
			/*********************************************
			 * 네트워크 관할 전송실 
			 * smodifyYn 
			 * 	- Y  수정가능 
			 *    N  수정불가
			 *    AY 상세수정가능 
			 *    AN 상세수정불가 
			*********************************************/
			topoLclCd = response[0].topoLclCd;
			ntwkStatCd = response[0].ntwkStatCd;
			hdofcOrgId = nullToEmpty(response[0].hdofcOrgId);
			teamOrgId = nullToEmpty(response[0].teamOrgId);
			
    		var span = "";
    		var spanLast = "";
    		var spanLaLast = "";
    		var sClass = "";
    		var smodifyYn=str;
    		var sjavascript = "";
    		var tmpLineNo = "";
    		var checkWorkMgmtYnCnt = 0;
    		//document.getElementById("sTmofInfoPop").innerHTML = "";
    		
    		if (response.length > 0){
    			vTmofInfo  = response;
    			   			
    			for( i = 0 ; i < response.length; i++){
    				if(i==0){
    					tmpLineNo = response[i].ntwkLineNo;
    				}
    				// 작업상태에 따라 버튼 클래스 변경 
    				var vStatCd = response[i].mtsoLnoInsProgStatCd; 
    				if(vStatCd == "01") {
    					sClass = "class='Button button2 color_btn_1 text_color_w'";   // 신규 
    				} else if(vStatCd == "02") {
    					sClass = "class='Button button2 color_btn_2 text_color_w'";  // 작업중 
    				} else if(vStatCd == "03") {
    					sClass = "class='Button button2 color_btn_3 text_color_w'";  // 완료 
    				}
    				
    				if(smodifyYn == "Y" || smodifyYn == "AY") {
    					// 수정가능 할때만 작업을 완료로 처리하기  
    					if(vStatCd == "01" || vStatCd == "02") {
    						if(response[i].userMtsoCnt == "0"){
    							sjavascript	= "onClick= \"javascript:tmofMsgView('2');\"";
							}else{
								sjavascript = "onClick= \"javascript:tmofFnsh('"+response[i].ntwkLineNo+"','"+response[i].mtsoId+"','"+response[i].ntwkJrdtMtsoLnoSrno+"','"+smodifyYn+"');\"" ;
							}	
    					} else {
    						 sjavascript = "onClick= \"javascript:tmofMsgView('');\"";
    					}
    				} else{
    					if(vStatCd == "03") {
    						sjavascript = "onClick= \"javascript:tmofMsgView('');\"";	
	   					} else {
	   						sjavascript = "onClick= \"javascript:tmofMsgView('1');\"";
	   					}    					
    				}
    				 
					if(smodifyYn == "AY" || smodifyYn == "AN") {
						//전체보기 
						span += "<div style='padding-bottom:3px;'><button type='button' "+sClass+sjavascript+">"+response[i].statNm+"</button>&nbsp;" + getMtsoNonName(response[i].text) + "</div>";	
					} else {
						//조금만보기
						span += "<button type='button' "+sClass+sjavascript+">"+response[i].statNm+"</button>&nbsp;" + getMtsoNonName(response[i].text)+"&nbsp;&nbsp;&nbsp;"; 
					}
    					
    				if(smodifyYn == "Y" || smodifyYn == "N") {
    					// 조금만보기
	    				if(i == 3) {
	    					var cnt = response.length-4;
	    					if(cnt > 0) {
	    						span += "외 " + (response.length-4) + "개";
	    					}
	    					break;
	    				}
    				}
    				
    				// 사용자 관할 전송실 여부 체크
    				if(response[i].userMtsoCnt != "0" && response[i].userMtsoCnt != null && response[i].userMtsoCnt != '' && response[i].userMtsoCnt !='null') {
    					checkWorkMgmtYnCnt = checkWorkMgmtYnCnt+1;
    				}
    			}
    			
    			// 사용자 관할 전송실이 안니경우 편집불가
    			if (checkWorkMgmtYnCnt == 0) {
    				//console.log("checkWorkMgmtYnCnt : " + checkWorkMgmtYnCnt);
    				if ($('#btnRegEqp').val() != undefined) {
    					$('#btnRegEqp').setEnabled(false);  // 편집
    				}    		
    				
    				if ($('#btnPathDelete').val() != undefined) {
    					$('#btnPathDelete').setEnabled(false);  // 선번삭제
    				}    

    				if ($('#btnReservePathChange').val() != undefined) {
    					$('#btnReservePathChange').setEnabled(false);  // 예비선번
    				}

    				if ($('#btnResendFdfInfoPop').val() != undefined) {
    					$('#btnResendFdfInfoPop').setEnabled(false);  // 편집
    				}  
    				
    				if ($('#btnPahViaualEdit').val() != undefined) {
    					$('#btnPahViaualEdit').setEnabled(false);  // 시각화편집
    				} 
    				
    				if ($('#btnWdmPathEdit').val() != undefined) {
    					$('#btnWdmPathEdit').setEnabled(false);	// WdmTrunk기간망 편집
    				}
    			}
    			sjavascript ="";
    			//sjavascript = "onClick= \"javascript:tmofInfoPopAll("+response.length+",'" + paramValue.ntwkLineNo + "','" + paramValue.sFlag + "');\"" ;
    			sjavascript = "onClick= \"javascript:tmofInfoPopAll("+response.length+", '"+tmpLineNo+"', '"+smodifyYn+"');\"" ;
    			spanLaLast  = "<span class='Float-right'><button type='button' class='Button button2 text_color_b' name='rjsemfwlak' id='rjsemfwlak' "+sjavascript+">상세</button></span>";
 
    			if(smodifyYn == "Y" || smodifyYn == "N") {
    				// 상세버튼 보여주기 
    				span += spanLaLast;	
    			}
    			
    			if(smodifyYn == "Y" || smodifyYn == "N") {
    				//조금만보기
    				document.getElementById("sTmofInfoPop").innerHTML = span;	
    			} else {
    				//전체보기 
    				document.getElementById("sTmofInfoPopALL").innerHTML = span;
    			}
    			 	
			
    		}
		
		}

		// 서비스회선상세정보 팝업에서 관할전송국사정보 
    	if(flag == 'mtsoInfoByPathList'){
    		/*********************************************
			 * 서비스회선 관할 전송실 
			 * smodifyYn 
			 * 	- Y  수정가능 
			 *    N  수정불가
			 *    AY 상세수정가능 
			 *    AN 상세수정불가 
			*********************************************/
    		svlnStatCd = response[0].svlnStatCd;
    		var span = "";
    		var spanLast = "";
    		var spanLaLast = "";
    		var sClass = "";
    		var smodifyYn = str;
    		var sjavascript = "";
    		var tmpLineNo = "";
    		var checkWorkMgmtYnCnt = 0;
    		//document.getElementById("sTmofInfoPop").innerHTML = "";
    		
    		if(response.length > 0) {     
    			vTmofInfo  = response;
    			for(i = 0; i < response.length; i++) {
    				if(i==0){
    					tmpLineNo = response[i].svlnNo;
    				}
    				// 작업상태에 따라 버튼 클래스 변경 
    				var vStatCd = response[i].mtsoLnoInsProgStatCd; 
    				if(vStatCd == "01") {
    					sClass =  "class='Button button2 color_btn_1 text_color_w'";   // 신규 
    				} else if(vStatCd == "02") {
    					sClass =  "class='Button button2 color_btn_2 text_color_w'";  // 작업중 
    				} else if(vStatCd == "03") {
    					sClass =  "class='Button button2 color_btn_3 text_color_w'";  // 완료 
    				}
    				
    				if(smodifyYn == "Y" || smodifyYn == "AY") {
    					// 수정가능 할때만 작업을 완료로 처리하기  
    					if(vStatCd == "01" || vStatCd == "02") {
    						 if(response[i].userMtsoCnt == "0"){
    							 sjavascript	= "onClick= \"javascript:tmofMsgView('2');\"";
    						 }else{
    							 sjavascript	= "onClick= \"javascript:svlnTmofFnsh('"+response[i].svlnNo+"','"+response[i].mtsoId+"','"+response[i].lineJrdtMtsoLnoSrno+"','"+smodifyYn+"');\"" ;
    						 }
    					} else {
    						 sjavascript = "onClick= \"javascript:tmofMsgView('');\"";
    					}
    				} else {
    					if(vStatCd == "03") {
    						sjavascript = "onClick= \"javascript:tmofMsgView('');\"";	
	   					} else {
	   						sjavascript = "onClick= \"javascript:tmofMsgView('1');\"";
	   					}    		
    				}
    				
					if(smodifyYn == "AY" || smodifyYn == "AN") {
						//전체보기 
						span     += "<div style='padding-bottom:3px;'><button type='button' "+sClass+sjavascript+">"+response[i].statNm+"</button>&nbsp;" + getMtsoNonName(response[i].text) + "</div>";	
					} else {
						//조금만보기
						span     += "<button type='button' "+sClass+sjavascript+">"+response[i].statNm+"</button>&nbsp;" + getMtsoNonName(response[i].text)+"&nbsp;&nbsp;&nbsp;"; 
					}
					
    				if(smodifyYn == "Y" || smodifyYn == "N") {
    					// 조금만보기
	    				if(i == 4) {
	    					var cnt = response.length-5;
	    					if(cnt > 0) {
	    						span += "외 " + (response.length-5) + "개";
	    					}
	    					break;
	    				}
    				}
    				
    				// 사용자 관할 전송실 여부 체크
    				if(response[i].userMtsoCnt != "0" && response[i].userMtsoCnt != null && response[i].userMtsoCnt != '' && response[i].userMtsoCnt !='null') {
    					checkWorkMgmtYnCnt = checkWorkMgmtYnCnt+1;
    				}
    			}
    			
    			// 사용자 관할 전송실이 안니경우 편집불가
    			if (checkWorkMgmtYnCnt == 0) {
    				//console.log("checkWorkMgmtYnCnt : " + checkWorkMgmtYnCnt);
    				if ($('#btnRegEqp').val() != undefined) {
    					$('#btnRegEqp').setEnabled(false);  // 편집
    				}    		
    				
    				if ($('#btnPathDelete').val() != undefined) {
    					$('#btnPathDelete').setEnabled(false);  // 선번삭제
    				}    

    				if ($('#btnReservePathChange').val() != undefined) {
    					$('#btnReservePathChange').setEnabled(false);  // 예비선번
    				}

    				if ($('#btnResendFdfInfoPop').val() != undefined) {
    					$('#btnResendFdfInfoPop').setEnabled(false);  // 편집
    					$('#btnResendFdfInfoPop').hide();  // 편집
    				}   
    				
    				if ($('#btnPahViaualEdit').val() != undefined) {
    					$('#btnPahViaualEdit').setEnabled(false);  // 시각화편집
    				} 
    			}
    			
    			sjavascript ="";
    			sjavascript = "onClick= \"javascript:svlnMtsoInfoPopAll("+response.length+", '"+tmpLineNo+"', '"+smodifyYn+"');\"" ;
    			spanLaLast  = "<span class='Float-right'><button type='button' class='Button button2 text_color_b' name='rjsemfwlak' id='rjsemfwlak' "+sjavascript+">상세</button></span>";
    			
    			if(smodifyYn == "Y" || smodifyYn == "N") {
    				// 상세버튼 보여주기 
    				span += spanLaLast;	
    			}
    			
    			if(smodifyYn == "Y" || smodifyYn == "N") {
    				//조금만보기
    				document.getElementById("sTmofInfoPop").innerHTML = span;	
    			} else {
    				//전체보기 
    				document.getElementById("sTmofInfoPopALL").innerHTML = span;
    			}
    		}
    	}		
		
		if(flag == 'commonworkCnvt'){
			if(response.Result == 'Success'){ 
				//alert('처리 되었습니다.');			
				alertBox('I', cflineCommMsgArray['normallyProcessed']); /*"정상적으로 처리되었습니다.;*/
				tmofInfoPop(paramValue[0],str);
				if (str == "AY"){
					tmofInfoPop(paramValue[0],"Y");
				}
			}
		} 		
		
		if(flag == 'serviceCommonWorkCnvt'){
			if(response.Result == 'Success'){ 
				//alert('처리 되었습니다.');			
				alertBox('I', cflineCommMsgArray['normallyProcessed']); /*"정상적으로 처리되었습니다.;*/
				mtsoInfoByPathList(paramValue[0],str);
				if (str == "AY"){
					mtsoInfoByPathList(paramValue[0],"Y");
				}
			}
		} 
		
		// 사용자 관할 전송실(일반)
		if (flag == 'getUserJrdtTmofInfo') {
			userJrdtTmofInfo = response.userJrdtTmofInfo;
			var userTmof = "";
			var userJrdtTmofMgmtCd = "";
			
			// 소속전송실 셋팅
			for (var i = 0 ; i < userJrdtTmofInfo.length; i++) {
				// 조회조건의 관할그룹인지
				//if ($('#mgmtGrpCd').val() == userJrdtTmofInfo[i].mgmtGrpCd) {
					if (userJrdtTmofInfo[i].blgtTmofYn == 'Y') {
						userTmof = userJrdtTmofInfo[i].jrdtTmofId;
						userJrdtTmofMgmtCd = userJrdtTmofInfo[i].mgmtGrpCd;
						// 소속전송실에 속하는 관리그룹이 있는경우
						if ($('#userJrdtTmofMgmtCd').val() != undefined) {
							// 소속전송실의 관리그룹으로 설정
						    if ($('#' + mgmtCdSelectBoxId).find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1 && $('#' + mgmtCdSelectBoxId).val() != userJrdtTmofMgmtCd) {
						    	$('#' + mgmtCdSelectBoxId).setSelected(userJrdtTmofMgmtCd);
						    }			
						}
						break;
					} else if (userJrdtTmofInfo[i].jrdtTmofId == '0') {
						userTmof = userJrdtTmofInfo[i].jrdtTmofId;
						break;
					}				
				//}
				
			}
			//console.log(userTmof);
			// 설정된 소속전송실이 없는경우
			if (userTmof == "0") {
				//$('#topMtsoIdList').setSelected();
				//alert($('#topMtsoIdList option:first').val());
				userTmof = "";
			} 
			if ($('#userJrdtTmof').val() != undefined) {
				$('#userJrdtTmof').val(userTmof);
				$('#userJrdtTmofMgmtCd').val(userJrdtTmofMgmtCd);
			} else if ($('#userJrdtTmofPop').val() != undefined) {
				$('#userJrdtTmofPop').val(userTmof);
			}			
			//console.log("111전송실 : " + $('#userJrdtTmofMgmtCd').val());
			//console.log(userTmof);
			setUserInfo(null, null, str);
		}
		
		// 사용자 관할 전송실(Popup창)
		if (flag == 'getUserJrdtTmofInfoPop') {
			//userJrdtTmofInfo = response.userJrdtTmofInfo;
			var userTmof = "";
			var userJrdtTmofMgmtCd = "";
			
			// 소속전송실 셋팅
			for (var i = 0 ; i < response.userJrdtTmofInfo.length; i++) {
				
				if (response.userJrdtTmofInfo[i].blgtTmofYn == 'Y') {
					userTmof = response.userJrdtTmofInfo[i].jrdtTmofId;
					userJrdtTmofMgmtCd = response.userJrdtTmofInfo[i].mgmtGrpCd;
					// 소속전송실에 속하는 관리그룹이 있는경우
					if ($('#userJrdtTmofMgmtCdPop').val() != undefined) {
						// 소속전송실의 관리그룹으로 설정
					    if ($('#' + str).find("option[value='"+userJrdtTmofMgmtCd+"']").index() > -1 && $('#' + str).val() != userJrdtTmofMgmtCd) {
					    	$('#' + str).setSelected(userJrdtTmofMgmtCd);
					    }			
					}
					break;
				} 
				
			}
			
			if ($('#userJrdtTmofPop').val() != undefined) {
				$('#userJrdtTmofPop').val(userTmof);
			}
			if ($('#userJrdtTmofMgmtCdPop').val() != undefined) {
				$('#userJrdtTmofMgmtCdPop').val(userJrdtTmofMgmtCd);
			}
		}
		
	}

		

	//request 실패시.
	function commonCallbackFail(response, flag, str){
//		if(flag == 'msgFlag'){
//			alert('메시시 창 실패');
//		}
		if(flag == 'mtsoInfoByPathList'){
			
		}
		
	}	

function setSearchCode(hdofcId, teamId, tmofId){

	setSearch2Code(hdofcId, teamId, tmofId, "","");
}

function setSearch2Code(hdofcId, teamId, tmofId, selGbn){
	hdofcSelectBoxId = hdofcId;
	teamCdSelectBoxId = teamId;
	tomfIdSelectBoxId = tmofId;
	if(hdofcId != null && hdofcId != ""){
		httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/01', null, 'GET', 'hdofcCmCdData', hdofcId, selGbn);
	}
	if(teamId != null && teamId != ""){
		httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/02', null, 'GET', 'teamCmCdData', teamId, selGbn);
	}
	if(tmofId != null && tmofId != ""){
		httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode/03', null, 'GET', 'tmofCmCdData', tmofId);
	}
}
/**
 * 본부, 팀, 전송실 조회 (관리그룹 코드로 조회)
 * @param mgmtCd		관리그룹코드
 * @param hdofcId		본부   select box ID
 * @param teamId		팀     select box ID
 * @param tmofId		전송실 select box ID
 */
function setSearchCode2(mgmtCd, hdofcId, teamId, tmofId){
	hdofcSelectBoxId = hdofcId;
	var param = null;
	if(mgmtCd != null && mgmtCd != ""){
		param = {"mgmtGrpCd":mgmtCd};
	}
	
	if(hdofcId != null && hdofcId != ""){
		httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode2', param, 'GET', 'hdofcCmCdData', hdofcId, "");
	}
	if(teamId != null && teamId != ""){
		httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode2', param, 'GET', 'teamCmCdData', teamId, "");
	}
	if(tmofId != null && tmofId != ""){
		httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getcflinesearchcode2', param, 'GET', 'tmofCmCdData', tmofId);
	}
}

/**
 * 관리 그룹 체크 박스 생성
 * @param mgmtGrpCdCheckArea			// 체크 박스 영역 ID
 * @param checkName						// 체크 박스 Name
 */
var createMgmtGrpCheckBox = function (mgmtGrpCdCheckArea, checkName){
	var checkboxMgmtGrp = Tango.component.init({
		parent: '#' + mgmtGrpCdCheckArea,	// element가 들어갈 부모 영역 ID
		model: Tango.ajax.init({
			url: 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188'
		}), 						// 객체에 적용되는 model 지정.,
		type: 'checkbox',			// element type 지정. (checkbox, radio)
		name: checkName,			// input element의 name 지정
		valueField: 'value',		// data에서 input element value에 지정할 field(key)
		labelField: 'text',		// data에서 input element text에 지정할 field(key)
		checked: ['0001','0002']					// 생성시 선택 될 field value 지정 (Array or 단일선택인 경우 value string)
	});	 
	checkboxMgmtGrp.model.get();   

	//$a.convert($('#'+mgmtGrpCdCheckArea));
	//$a.convert($('#mgmtGrpCdLabel'));

	//alert("임시");
}
/**
 * 관리 그룹 SELECT 박스 생성
 * @param mgmtGrpCdCheckArea			// 체크 박스 영역 ID
 * @param checkName						// 체크 박스 Name
 */
function  createMgmtGrpSelectBox (checkName){	
	createMgmtGrpSelectBox (checkName, "");
}
function  createMgmtGrpSelectBox (checkName, selGbn){
	createMgmtGrpSelectBox (checkName, selGbn, "");
}
function  createMgmtGrpSelectBox (checkName, selGbn, selVal){
	this.mgmtCdSelectBoxId = checkName;
	if(selVal=="SKT"){
		userMgmtCd = "0001";		
		viewMgmtCd = userMgmtCd;
	}else if(selVal=="SKB"){
		userMgmtCd = "0002";
		viewMgmtCd = userMgmtCd;
	}
	httpCommonRequest('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/group/C00188', null, 'GET', 'C00188', checkName, selGbn);
}
/**
 * tmofInfoPop("네트워크아이디","YN")
 * @param checkName
 */
function  tmofInfoPop (param,modifyYN){
	//console.log("처리 된후!!! SSSSS");
	//console.log(param);
	//console.log("처리 된후!!! EEEEE");
	httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/tmofInfoPop', param , 'GET', 'tmofInfoPop', modifyYN);
}
/**
 * 서비스회선상세정보 팝업에서 관할전송국사정보
 * @param param
 * @param modifyYN
 */
function  mtsoInfoByPathList (param, modifyYN){
	httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getSelectMtsoLnoInfoByPathList', param , 'GET', 'mtsoInfoByPathList', modifyYN);
}  


var cflineShowProgress = function(gridId){
	$('#'+gridId).progress();
};

var cflineHideProgress = function(gridId){
	$('#'+gridId).progress().remove();
};

var cflineShowProgressBody = function(){
	$('body').progress();
};

var cflineHideProgressBody = function(){
	$('body').progress().remove();
};


/**
 * 관리그룹 체크 시 본부, 팀, 전송실, 국사 select, input box 처리
 * @param mgmtGrpId		관리그룹 check box name
 * @param hdofcId		본부   select box ID
 * @param teamId		팀     select box ID
 * @param tmofId		전송실 select box ID
 * @param mtsoStr		국사   div select box ID(국사id, 국사명 input box ID는 반드시  mtsoStr+Id, mtsoStr+Nm(ex: mtsoStr값이"mtso"이면 국사ID는 mtsoId, 국사명ID mtsoNm)
*/
function changeMgmtGrp(mgmtGrpId, hdofcId, teamId, tmofId, mtsoStr) {
	//console.log("changeMgmtGrp");
	hdofcSelectBoxId = hdofcId;
	//var mgmtGrpCd = $(':checkbox[name="' + mgmtGrpId + '"]').getValues();
	var mgmtGrpCd = $('#' + mgmtGrpId ).val();
	viewMgmtCd = mgmtGrpCd;

	// 본부 select 처리
	var hdofcCd_option_data =  [];
	// 팀 select 처리
	var teamCd_option_data =  [];
	// 전송실 select 처리
	var tmofCd_option_data =  [];

	if(tomfHeaderYn == "Y"){
		tmofCd_option_data.push(selPrePendTmof);
	}
	
	$('#' + hdofcId).clear();
	$('#' + teamId).clear();
	$('#' + tmofId).clear();
	
	//$('#' + mtsoStr).clear();	
	if(nullToEmpty(mtsoStr) != ""){
		$('#' + mtsoStr + 'Nm').val("");	
		$('#' + mtsoStr + 'Id').val("");
	}
	if(nullToEmpty(mgmtGrpCd) != ""){
		//alert(mgmtGrpCd);
		var tmpValue = "";
		// 본부코드정보가 있는경우
		if (hdofcCdData.length > 0) {	
			for(k=0; k<hdofcCdData.length; k++){
				var dataHdofc = hdofcCdData[k];  
				if(k==0){
					hdofcCd_option_data.push(dataHdofc);
				}
				//if(mgmtGrpCd.indexOf(dataHdofc.mgmtGrpCd) >=0){
	    		//console.log(mgmtGrpCd +"="+ dataHdofc.mgmtGrpCd);
				if(mgmtGrpCd == dataHdofc.mgmtGrpCd){
					hdofcCd_option_data.push(dataHdofc);
					// 팀코드값이 있는경우
					if (teamCdData.length > 0) {
						for(i=0; i<teamCdData.length; i++){
							var data = teamCdData[i];  
							if(tmpValue != "Y" && i==0){
								teamCd_option_data.push(data);
								tmpValue = "Y"
							}
							if(dataHdofc.value == data.uprOrgId){
					  			teamCd_option_data.push(data);
					  			for(m=0; m<tmofCdData.length; m++){
					  				var dataTmofCd = tmofCdData[m];  
					  				if(data.value == dataTmofCd.teamCd){
					  					tmofCd_option_data.push(dataTmofCd);
					  				}
					  			}
							}
						}
					} // 팀코드값이 없는 경우 
					else {
						for(m=0; m<tmofCdData.length; m++){
			  				var dataTmofCd = tmofCdData[m];
			  				// 관리그룹에 속하는 전송실인경우
			  				if(mgmtGrpCd == dataTmofCd.mgmtGrpCd){
			  					tmofCd_option_data.push(dataTmofCd);
			  				}
			  			}
					}
				}
			}
		} // 본부코드 정보가 없는 경우
		else {
			// 팀코드값이 있는경우
			if (teamCdData.length > 0) {
				for(i=0; i<teamCdData.length; i++){
					var data = teamCdData[i];  
					if(tmpValue != "Y" && i==0){
						teamCd_option_data.push(data);
						tmpValue = "Y"
					}
					// 관리그룹에 속하는 팀인경우
					if(mgmtGrpCd == data.mgmtGrpCd){
			  			teamCd_option_data.push(data);
			  			for(m=0; m<tmofCdData.length; m++){
			  				var dataTmofCd = tmofCdData[m];  
			  				if(data.value == dataTmofCd.teamCd){
			  					tmofCd_option_data.push(dataTmofCd);
			  				}
			  			}
					}
				}
			} // 팀코드값이 없는 경우
			else {
				for(m=0; m<tmofCdData.length; m++){
	  				var dataTmofCd = tmofCdData[m];
	  				// 관리그룹에 속하는 전송실인경우
	  				if(mgmtGrpCd == dataTmofCd.mgmtGrpCd){
	  					tmofCd_option_data.push(dataTmofCd);
	  				}
	  			}
			}
		}
		//alert(hdofcCd_option_data.length);
		$('#' + hdofcId).setData({data : hdofcCd_option_data});
		$('#' + teamId).setData({data : teamCd_option_data});
		$('#' + tmofId).setData({data : tmofCd_option_data});
	}else{
		$('#' + hdofcId).setData({data : hdofcCdData});
		$('#' + teamId).setData({data : teamCdData});
		

		// 전송실 select 처리
		var tmofCd_option_data =  [];
		if(tomfHeaderYn == "Y"){
			tmofCd_option_data.push(selPrePendTmof);
		}
		for(i=0; i<tmofCdData.length; i++){
			var tmofDataArr = tmofCdData[i];
			tmofCd_option_data.push(tmofDataArr);
		}
		$('#' + tmofId).setData({data : tmofCd_option_data});
	}
	
	setUserInfo(hdofcId, teamId, tmofId);
}
/**
 * 본부 선택시 팀, 전송실, 국사 select, input box 처리
 * @param hdofcId		본부   select box ID
 * @param teamId		팀     select box ID  
 * @param tmofId		전송실 select box ID
 * @param mtsoStr		국사   div select box ID(국사id, 국사명 input box ID는 반드시  mtsoStr+Id, mtsoStr+Nm(ex: mtsoStr값이"mtso"이면 국사ID는 mtsoId, 국사명ID mtsoNm)
 */
function changeHdofc(hdofcId, teamId, tmofId, mtsoStr){	
	
	hdofcSelectBoxId = hdofcId;
	var mgmtCdValue = $('#' + mgmtCdSelectBoxId).val();
	var hdofcCd = $('#' + hdofcId).val();
	// 팀 select 처리
	var teamCd_option_data =  [];
	// 전송실 select 처리
	var tmofCd_option_data =  [];

	if(tomfHeaderYn == "Y"){
		tmofCd_option_data.push(selPrePendTmof);
	}

	
	$('#' + teamId).clear();
	$('#' + tmofId).clear();
	if(nullToEmpty(mtsoStr) != ""){
		$('#' + mtsoStr + 'Nm').val("");	
		$('#' + mtsoStr + 'Id').val("");
	}
	if(hdofcCd != null && hdofcCd != ""){
		for(i=0; i<teamCdData.length; i++){
			var data = teamCdData[i];  
			if(i==0){
				teamCd_option_data.push(data);
			}			
			if(hdofcCd == data.uprOrgId){
	  			teamCd_option_data.push(data);
	  			for(m=0; m<tmofCdData.length; m++){
	  				var dataTmofCd = tmofCdData[m];  
	  				if(data.value == dataTmofCd.teamCd){
	  					tmofCd_option_data.push(dataTmofCd);
	  				}
	  			}
			}
		}
		$('#' + teamId).setData({data : teamCd_option_data});
		$('#' + tmofId).setData({data : tmofCd_option_data});
	}else{
		if(mgmtCdValue != null && mgmtCdValue != ""){
			for(i=0; i<teamCdData.length; i++){
				var data = teamCdData[i];  
				if(i==0){
					teamCd_option_data.push(data);
				}			
				if(mgmtCdValue == data.mgmtGrpCd){
		  			teamCd_option_data.push(data);
		  			for(m=0; m<tmofCdData.length; m++){
		  				var dataTmofCd = tmofCdData[m];  
		  				if(data.value == dataTmofCd.teamCd){
		  					tmofCd_option_data.push(dataTmofCd);
		  				}
		  			}
				}
			}
			$('#' + teamId).setData({data : teamCd_option_data});
			$('#' + tmofId).setData({data : tmofCd_option_data});	
		}else{
			if(tomfHeaderYn == "Y" && unshiftCnt == 0){
				tmofCdData.unshift(selPrePendTmof);
				unshiftCnt = 1;
			}
			$('#' + teamId).setData({data : teamCdData});
			$('#' + tmofId).setData({data : tmofCdData});
		}
	}
	//console.log("changeHdofc");
	setUserInfo(null, teamId, tmofId);
}
/**
 * 팀 선택시 전송실, 국사 select, input box 처리
 * @param teamId		팀     select box ID
 * @param tmofId		전송실 select box ID
 * @param mtsoStr		국사   div select box ID(국사id, 국사명 input box ID는 반드시  mtsoStr+Id, mtsoStr+Nm(ex: mtsoStr값이"mtso"이면 국사ID는 mtsoId, 국사명ID mtsoNm)
 */
function changeTeam(teamId, tmofId, mtsoStr){
	var teamCd = $('#' + teamId).val();
	// 전송실 select 처리
	var tmofCd_option_data =  [];

	if(tomfHeaderYn == "Y"){
		tmofCd_option_data.push(selPrePendTmof);
	}
	
	$('#' + tmofId).clear();
	if(nullToEmpty(mtsoStr) != ""){
		$('#' + mtsoStr + 'Nm').val("");	
		$('#' + mtsoStr + 'Id').val("");
	}
	if(teamCd != null && teamCd != ""){
		for(m=0; m<tmofCdData.length; m++){
			var dataTmofCd = tmofCdData[m];  
			if(teamCd == dataTmofCd.teamCd){
				tmofCd_option_data.push(dataTmofCd);
			}
		}
		$('#' + tmofId).setData({data : tmofCd_option_data});
		
		setUserInfo(null, null, tmofId);
	}else{
		//changeHdofc(hdofcSelectBoxId, teamId, tmofId, mtsoStr);
		// 팀정보를 ""로 변경했을시

		var mgmtCdValue = $('#' + mgmtCdSelectBoxId).val();
		var hdofcCd = $('#' + hdofcSelectBoxId).val();
		
		if(hdofcCd != null && hdofcCd != ""){
			for(i=0; i<teamCdData.length; i++){
				var data = teamCdData[i];  
				// 전송실 편집			
				if(hdofcCd == data.uprOrgId){
		  			for(m=0; m<tmofCdData.length; m++){
		  				var dataTmofCd = tmofCdData[m];  
		  				if(data.value == dataTmofCd.teamCd){
		  					tmofCd_option_data.push(dataTmofCd);
		  				}
		  			}
				}
			}
			$('#' + tmofId).setData({data : tmofCd_option_data});
		}else{
			if(mgmtCdValue != null && mgmtCdValue != ""){
				for(i=0; i<teamCdData.length; i++){
					var data = teamCdData[i];  
					if(mgmtCdValue == data.mgmtGrpCd){
						// 전송실 편집
			  			for(m=0; m<tmofCdData.length; m++){
			  				var dataTmofCd = tmofCdData[m];  
			  				if(data.value == dataTmofCd.teamCd){
			  					tmofCd_option_data.push(dataTmofCd);
			  				}
			  			}
					}
				}
				$('#' + tmofId).setData({data : tmofCd_option_data});	
			}else{
				$('#' + tmofId).setData({data : tmofCdData});
			}
		}
		setUserInfo(null, null, tmofId);
	}
}
/**
 * 전송실 선택시 국사 select, input box 처리
 * @param tmofId		전송실 select box ID
 * @param mtsoStr		국사   div select box ID(국사id, 국사명 input box ID는 반드시  mtsoStr+Id, mtsoStr+Nm(ex: mtsoStr값이"mtso"이면 국사ID는 mtsoId, 국사명ID mtsoNm)
 */
function changeTmof(tmofId, mtsoStr){
	var tmofCd = $('#' + tmofId).val();	
	if(nullToEmpty(mtsoStr) != ""){
		$('#' + mtsoStr + 'Nm').val("");	
		$('#' + mtsoStr + 'Id').val("");
	}
	//httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getMtsoListTwo/'+ tmofCd, null,'GET', 'mtsoCode', mtsoStr);	
}

function changeOnsHdofc(onsHdofcId, onsTeamId, onsTeamData, gubunStr){
	var hdofcCd = $('#' + onsHdofcId).val();
	// Ons팀 select 처리
	var teamCd_option_data =  [];
	var teamCd_option_preData =  [];
	teamCd_option_data.push({"value":"","text":gubunStr});
	teamCd_option_preData.push({"value":"","text":gubunStr});
//	console.log("hdofcCd===========" + hdofcCd);
//	console.log(onsTeamData);
//	console.log("gubunStr===========" + gubunStr);
	$('#' + onsTeamId).clear();
	if(hdofcCd != null && hdofcCd != ""){
		if( onsTeamData != null && onsTeamData.length >0){
			for(i=0; i<onsTeamData.length; i++){
				var data = onsTeamData[i];  
				if(hdofcCd == data.onsHdofcCd){
		  			teamCd_option_data.push(data);
				}
			}
			$('#' + onsTeamId).setData({data : teamCd_option_data});
		}else{
			$('#' + onsTeamId).setData({data : teamCd_option_preData});
		}
	}else{
		$('#' + onsTeamId).setData({data : onsTeamData});
		$('#' + onsTeamId).prepend('<option value="">' + gubunStr + '</option>');
		$('#' + onsTeamId).setSelected("");				
	}
	
}

/**
 * 전송실 선택시 국사 select, input box 처리
 * @param tmofId		전송실 select box ID
 * @param mtsoStr		국사   div select box ID(국사id, 국사명 input box ID는 반드시  mtsoStr+Id, mtsoStr+Nm(ex: mtsoStr값이"mtso"이면 국사ID는 mtsoId, 국사명ID mtsoNm)
 */
function getmtsoCd(tmofId, mtsoStr) {
// 	var tmofCd = $('#' + tmofId).val()
// 	if(tmofCd != null && tmofCd != ""){
// 		
//		var tmpStr = $('#' + mtsoStr +"Nm").val();
//		if(tmpStr != null && tmpStr != ""){
//			if(tmpStr.length >= 2){
//				var mtsoParam = {"mtsoNm": tmpStr };
//				httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/getMtsoListTwo/'+ tmofCd, mtsoParam,'GET', 'mtsoCode', mtsoStr);
//			}else{
//				alert("국사명을 2자리 이상 입력하세요.");
//			}
//		}else{
//			alert("국사명을 입력하세요.");
//		}
// 	}else{
// 		//alert(11);
// 		alert("전송실을 먼저 선택하세요.");
// 	}
	//$('#' + tmofId).focus();
	//$('#' + mtsoStr +"Nm").focus(); 
}

// 서비스회선 대분류 변경
function changeSvlnLclCd(svlnLclId, svlnSclId, svlnCdData, mgmtGrpId, selGbn){
	if(svlnCdData != null){
		var selPrePendStr = "";
		if(selGbn == 'S'){
			//selPrePendStr = '<option value="">선택</option>';
			selPrePendStr = cflineCommMsgArray['select'] /* 선택 */;
		}else if(selGbn == 'N'){
			selPrePendStr = "";
		}else{
			//selPrePendStr = '<option value="">전체</option>';
			selPrePendStr = cflineCommMsgArray['all'] /* 전체 */;
		}		
	 	var tmpMgmtCd = $('#' + mgmtGrpId).val();
	 	var tmpMgmtCdNm = $('#' + mgmtGrpId + ' option:selected').text();

	 	var tmpSvlnLclCd = $('#' + svlnLclId).val();
	 	if(svlnCdData.svlnLclCdList != null){
			var svlnLclCd_option_data =  [];
			for(i=0; i<svlnCdData.svlnLclCdList.length; i++){
				if(i==0 && selPrePendStr != ""){
					var dataFst = {"uprComCd":"","value":"","text":selPrePendStr};
					svlnLclCd_option_data.push(dataFst);
				}
				var dataL = svlnCdData.svlnLclCdList[i]; 
//				if(nullToEmpty(tmpMgmtCd) != "0001" || nullToEmpty(dataL.value) != "004" ){
//					svlnLclCd_option_data.push(dataL);
//				}

				if(nullToEmpty(tmpMgmtCdNm) == "" || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataL.cdFltrgVal) || "ALL" == nullToEmpty(dataL.cdFltrgVal)  ){
					svlnLclCd_option_data.push(dataL);
				}
				
			}
			$('#' + svlnLclId).clear();
			$('#' + svlnLclId).setData({data : svlnLclCd_option_data});

			$('#' + svlnLclId).setSelected(tmpSvlnLclCd);
	 	}

	}
 	//임차회선포함 체크박스 제어
 	leslDisplayProc(svlnLclId, svlnSclId);
}

//서비스회선 소분류 변경
function changeSvlnSclCd(svlnLclId, svlnSclId, svlnSclCdData, mgmtGrpId){

 	var svlnLclCd = $('#' + svlnLclId).val();
 	var tmpSvlnSclCd = $('#' + svlnSclId).val();
 	var mgmtGrpVal = $('#' + mgmtGrpId).val();
 	var tmpMgmtCdNm = $('#' + mgmtGrpId + ' option:selected').text();

	var svlnSclCd_option_data =  [];
 	if(svlnLclCd != null && svlnLclCd != ""){
		for(m=0; m<svlnSclCdData.length; m++){
			var dataS = svlnSclCdData[m];  

			if(dataS.value == "" && (svlnLclCd == "005" || svlnLclCd == "001")){// (B2B회선, 기지국회선)인 경우 전체 는 무조건 포함
				svlnSclCd_option_data.push(dataS);
			}else if(m==0 && dataS.value != "" && (svlnLclCd == "005" || svlnLclCd == "001")){
				var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
				svlnSclCd_option_data.push(dataFst);
			}
/*			
			if(svlnLclCd == dataS.uprComCd){
				if(nullToEmpty(mgmtGrpVal) !="" && nullToEmpty(svlnLclCd) == "005"){
					if(mgmtGrpVal =="0001" && dataS.cdFltrgVal == "SKT"){
						svlnSclCd_option_data.push(dataS);
					}else if(mgmtGrpVal =="0002" && dataS.cdFltrgVal == "SKB"){						
						svlnSclCd_option_data.push(dataS);
					}
				}else{
					if(nullToEmpty(mgmtGrpVal) != "0001" || nullToEmpty(dataS.uprComCd) != "004" ){
						svlnSclCd_option_data.push(dataS);
					}						
				}
			}
*/

			if(nullToEmpty(svlnLclCd) == dataS.uprComCd){
//				if(nullToEmpty(mgmtGrpVal) !="" && nullToEmpty(svlnLclCd) == "005"){
//					if(mgmtGrpVal =="0001" && dataS.cdFltrgVal == "SKT"){
//						svlnSclCd_option_data.push(dataS);
//					}else if(mgmtGrpVal =="0002" && dataS.cdFltrgVal == "SKB"){						
//						svlnSclCd_option_data.push(dataS);
//					}
//				}else{
//					if(nullToEmpty(mgmtGrpVal) != "0001" || nullToEmpty(dataS.uprComCd) != "004" ){
//						svlnSclCd_option_data.push(dataS);
//					}						
//				}
//				console.log("1tmpMgmtCdNm : " + tmpMgmtCdNm + " ==== " + dataS.cdFltrgVal);
				if(nullToEmpty(tmpMgmtCdNm) == "" || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataS.cdFltrgVal) || "ALL" == nullToEmpty(dataS.cdFltrgVal) ){
					svlnSclCd_option_data.push(dataS);
				}
			}			
			
			
		}		
		if(nullToEmpty(mgmtGrpVal)=="0002" && nullToEmpty(svlnLclCd) =="005"){
			tmpSvlnSclCd = "009";
		}
		
		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
		$('#' + svlnSclId).setSelected(tmpSvlnSclCd);
 		
 	}else{
		for(m=0; m<svlnSclCdData.length; m++){
			var dataS = svlnSclCdData[m];  
//			if(nullToEmpty(mgmtGrpVal) != "0001" || nullToEmpty(dataS.uprComCd) != "004" ){
//				svlnSclCd_option_data.push(dataS);
//			}	
			if(dataS.value == ""){ 
				svlnSclCd_option_data.push(dataS);
			}
//			console.log("2tmpMgmtCdNm : " + tmpMgmtCdNm + " ==== " + dataS.cdFltrgVal);
			if(nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataS.cdFltrgVal) || "ALL" == nullToEmpty(dataS.cdFltrgVal) ){
				svlnSclCd_option_data.push(dataS);
			}			
		}		 		
		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
	}
 	 	
 	//임차회선포함 체크박스 제어
 	leslDisplayProc(svlnLclId, svlnSclId);
// 	if(svlnLclCd != null && svlnLclCd != ""){
//		for(m=0; m<svlnSclCdData.length; m++){
//			var dataS = svlnSclCdData[m];  
//			if(svlnLclCd == dataS.uprComCd){
//				if(nullToEmpty(mgmtGrpVal) !=""){
//					if(mgmtGrpVal =="0001" && (dataS.cdFltrgVal == "SKT" || dataS.cdFltrgVal == "ALL")){
//						svlnSclCd_option_data.push(dataS);
//					}else if(mgmtGrpVal =="0002" && (dataS.cdFltrgVal == "SKB" || dataS.cdFltrgVal == "ALL")){						
//						svlnSclCd_option_data.push(dataS);
//					}
//				}else{
//					if(nullToEmpty(mgmtGrpVal) != "0001" || nullToEmpty(dataS.uprComCd) != "004" ){
//						svlnSclCd_option_data.push(dataS);
//					}						
//				}
//			}
//		}		
//		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
//		$('#' + svlnSclId).setSelected(tmpSvlnSclCd);
// 		
// 	}else{
//		for(m=0; m<svlnSclCdData.length; m++){
//			var dataS = svlnSclCdData[m];  
//			if(nullToEmpty(mgmtGrpVal) !=""){
//				if(mgmtGrpVal =="0001" && (dataS.cdFltrgVal == "SKT" || dataS.cdFltrgVal == "ALL" || nullToEmpty(dataS.cdFltrgVal) == "")){
//					svlnSclCd_option_data.push(dataS);
//				}else if(mgmtGrpVal =="0002" && (dataS.cdFltrgVal == "SKB" || dataS.cdFltrgVal == "ALL" || nullToEmpty(dataS.cdFltrgVal) == "")){						
//					svlnSclCd_option_data.push(dataS);
//				}
//			}else{
//				if(nullToEmpty(mgmtGrpVal) != "0001" || nullToEmpty(dataS.uprComCd) != "004" ){
//					svlnSclCd_option_data.push(dataS);
//				}						
//			}			
//		}		 		
//		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
//	}	
	
}

function leslDisplayProc(svlnLclId, svlnSclId){
 	var svlnLclCd = $('#' + svlnLclId).val();
 	var svlnSclCd = $('#' + svlnSclId).val();
 	var chkEnableYn = "N";
 	if(svlnSclCd =="101" || svlnSclCd =="104"){
 		chkEnableYn = "Y";
 	}
// 	console.log("leslSrchYn");
// 	console.log(svlnSclCd);
// 	console.log($("#leslSrchYn"));
	if(chkEnableYn =="Y"){
		$("#leslSrchYn").setChecked(false);
		$("#leslSrchYn").setEnabled(true);
	}else{
		$("#leslSrchYn").setChecked(false);
		$("#leslSrchYn").setEnabled(false);
	}
}

function tmofFnsh(vntwkLineNo, vmtsoId, vntwkJrdtMtsoLnoSrno,smodifyYn){
 
	  var param  =[{
		           "ntwkLineNo":vntwkLineNo
	              ,"mtsoId":vmtsoId
	              ,"ntwkJrdtMtsoLnoSrno":vntwkJrdtMtsoLnoSrno
	              ,"mtsoLnoInsProgStatCd":"03"
	              ,"singleMtsoIdYn":true
	              }];

	  if(ntwkStatCd =='02' || ntwkStatCd =='04'){
		  alertBox('W', '회선상태가 해지 또는 해지요청중인 회선은 완료처리 불가능합니다.');
	  }else if(topoLclCd =='001' && ntwkStatCd == '03' && (hdofcOrgId == '' || teamOrgId == '')){
			 alertBox('W', '관리본부, 관리팀을 현행화 하신후 완료처리 가능합니다.');
	  }else{
		  /*"완료 하시겠습니까?"*/
	    	callMsgBox('','C', cflineCommMsgArray['complete'], function(msgId, msgRst){  
	    		if (msgRst == 'Y') {
	    			httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/trunk/getTmofEstCnvt', param, 'POST', 'commonworkCnvt',smodifyYn);	
	    		} 
	    	});   
	  }
 }

// 서비스 회선 작업 정보 처리
function svlnTmofFnsh(vSvlnNo, vMtsoId, vLineJrdtMtsoLnoSrno, smodifyYn){
	
	var param =	[{
		          "svlnNo":vSvlnNo
		          ,"mtsoId":vMtsoId
		          ,"lineJrdtMtsoLnoSrno":vLineJrdtMtsoLnoSrno
		          ,"mtsoLnoInsProgStatCd":"03"
		          ,"singleMtsoIdYn":true
				}];

//	console.log({
//        "svlnNo":vSvlnNo
//        ,"mtsoId":vMtsoId
//        ,"lineJrdtMtsoLnoSrno":vLineJrdtMtsoLnoSrno
//        ,"mtsoLnoInsProgStatCd":"03"
//        ,"singleMtsoIdYn":true
//		});

		if(svlnStatCd == '008' || svlnStatCd == '300'){
			alertBox('W', '회선상태가 해지 또는 해지요청중인 회선은 완료처리 불가능합니다.');
		}else{
			/*"완료 하시겠습니까?"*/
	    	callMsgBox('','C', cflineCommMsgArray['complete'], function(msgId, msgRst){  
	    		if (msgRst == 'Y') {
	    			httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updatemtsostatcmpl', param, 'POST', 'serviceCommonWorkCnvt',smodifyYn);	
	    		} 
	    	}); 
		}
 }

function tmofInfoPopAll(sHeight, lineNo, sFlag){
	var vHeigth = 110 + ( parseInt(sHeight) * 30 );
	if(vHeigth > 600) {
		vHeigth = 600;
	}
//	if(vHeigth < 230) {
//		vHeigth = 230;
//	}

	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}

    $a.popup({
	  	popid: "ppoTmofInfoPopAll",
	  	title: cflineCommMsgArray['tmofDetailInfo']/*전송실상세정보*/,
	  	url: urlPath + '/configmgmt/cfline/TmofInfoPopAll.do',
	  	data: {"ntwkLineNo":lineNo, "sFlag":sFlag },
		iframe: false,
		modal: true,
		movable:true,
		width : 500,
		height : vHeigth 
		
	}); 
    
     	
}

function svlnMtsoInfoPopAll(sHeight, lineNo, sFlag){
	var vHeigth = 110 + ( parseInt(sHeight) * 30 );
	if(vHeigth > 600) {
		vHeigth = 600;
	}
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
    $a.popup({
	  	popid: "ppoServiceLineTmofAllPop",
	  	title: cflineCommMsgArray['tmofDetailInfo']/*전송실상세정보*/,
	  	url: urlPath + '/configmgmt/cfline/ServiceLineTmofAllPop.do',
	  	data: {"ntwkLineNo":lineNo, "sFlag":sFlag },
		iframe: false,
		modal: true,
		movable:true,
		width : 500,
		height : vHeigth 
		
	}); 
     	
}




// 국사 찾기 팝업
function openMtsoPop(mtsoId, mtsoNm){
	openMtsoDataPop(mtsoId, mtsoNm, null); 
}
function openMtsoDataPop(mtsoId, mtsoNm, paramValue){
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}

	// 2017-04-06 국사 자동검색 기능제거
	/*if(paramValue != null){
		$.extend(paramValue,{"autoSearchYn":"Y"});
	}	*/
	
	$a.popup({
	  	popid: "popMtsoSch",
	  	title: cflineCommMsgArray['findMtso']/* 국사 조회 */,
	  	url: urlPath + '/configmgmt/common/MtsoLkup.do',
		data: paramValue,
		modal: false,
		movable:true,
		windowpopup : true,
		 
		/*iframe: true,
		modal : false,
		movable : true,
		windowpopup:false,
		*/
		width : 950,
		height : 750,
		callback:function(data){
			if(data != null){
				$('#' + mtsoId).val(data.mtsoId);
				$('#' + mtsoNm).val(data.mtsoNm);
			}
		}
	}); 
}
 
// 국사 찾기 팝업  그리드에서 사용함(그리드ID, 국사코드필드, 국사명필드) 
function openMtsoGridPop(GridId, mostCdId, mostNmId){
	openMtsoDataGridPop(GridId, mostCdId, mostNmId, null);	
}
function openMtsoDataGridPop(GridId, mostCdId, mostNmId, paramValue){
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
//	2017.05.08 자동검색기능 제외
//	if(paramValue != null){
//		$.extend(paramValue,{"autoSearchYn":"Y"});
//	}
	$a.popup({
	  	popid: "popMtsoGridSch",
	  	title: cflineCommMsgArray['findMtso']/* 국사 조회 */,
	  	url: urlPath + '/configmgmt/common/MtsoLkup.do',
		data: paramValue,
		modal: true,
		movable:true,
		/*iframe: false,
		modal: false,
		movable:true,
		windowpopup:false,
		*/
		width : 950,
		height : 750,
		callback:function(data){
			if(data != null){
	    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.data;
				//alert(data.mtsoNm);
				//alert(rowIndex);
				$('#'+GridId).alopexGrid( "cellEdit", data.mtsoId, {_index : { row : rowIndex}}, mostCdId);
				$('#'+GridId).alopexGrid( "cellEdit", data.mtsoNm, {_index : { row : rowIndex}}, mostNmId);
			}
		}
	}); 		
}

//장비 찾기 팝업
function openEqpPop(eqpId, eqpNm, searchEqpNm, vTmofInfo, division){
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	var param = new Object();
	$.extend(param,{"neNm":nullToEmpty(searchEqpNm)});
	$.extend(param,{"vTmofInfo":vTmofInfo}); // 최상위 전송실 조회 리스트
	$.extend(param,{"searchDivision":division});
	
	$a.popup({
	  	popid: "popEqpSch",
	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
	  	data: param,
		modal: true,
		movable:true,
		width : 1100,
		height : 600,
		callback:function(data){
			if(data != null){
				$('#' + eqpId).val(data.neId);
				$('#' + eqpNm).val(data.neNm);
			}
		}
	}); 	
}

//장비 찾기 팝업  그리드에서 사용함(그리드ID, 장비코드필드, 장비명필드, 검색할 장비명, 관할전송실리스트, 구분) 
function openEqpGridPop(GridId, eqpId, eqpNm, searchEqpNm, vTmofInfo, division){
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	var param = new Object();
	$.extend(param,{"neNm":nullToEmpty(searchEqpNm)});
	$.extend(param,{"vTmofInfo":vTmofInfo}); // 최상위 전송실 조회 리스트
	$.extend(param,{"searchDivision":division});
	
	$a.popup({
	  	popid: "popEqpGridSch" + eqpId,
	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
//	  	url: urlPath + '/configmgmt/equipment/EqpLkup.do',
	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
	  	data: param,
		modal: true,
		movable:true,
		width : 1100,
		height : 600,
		callback:function(data){
			if(data != null){
	    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.data;
				//alert(data.mtsoNm);
				//alert(rowIndex);
				$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, eqpId);
				$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, eqpNm);	    		
			}
		}
	});		
}

//RM장비 찾기 팝업 사용함(그리드ID, 장비코드필드, 장비명필드, 포트코드필드, 포트명필드, 파라메터 ) 
function openRmEqpPop(GridId, eqpId, eqpNm, portId, portNm, param){
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	$.extend(param,{"bpId":"BP0003809"});  /* Alcatel와 nokia가 합병 BP0004379  -> BP0003809로 변경 2021-05-27 */

	$a.popup({
	  	popid: "popEqpRmSch_" + eqpId,
	  	title: cflineCommMsgArray['findEquipment']/* 장비 조회 */,
//	  	url: urlPath + '/configmgmt/equipment/EqpLkup.do',
	  	url: urlPath + '/configmgmt/cfline/EqpInfPop.do',
	  	data: param,
		modal: true,
		movable:true,
		width : 1200,
		height : 810,
		callback:function(data){
			if(data != null){
				if(GridId != null && GridId != ""){
		    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.data;
					//alert(data.mtsoNm);
					//alert(rowIndex);
					$('#'+GridId).alopexGrid( "cellEdit", data.neId, {_index : { row : rowIndex}}, eqpId);
					$('#'+GridId).alopexGrid( "cellEdit", data.neNm, {_index : { row : rowIndex}}, eqpNm);
					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portId);
					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, portNm);
				}else{	
					$("#" + eqpId).val(data.neNm);
					$("#" + eqpNm).val(data.neId);
					$("#" + eqpNm).attr('style', 'background-color:#e2e2e2');
					$("#" + portId).val(data.neNm);
					$("#" + portNm).val(data.neId);
					$("#" + portNm).attr('style', 'background-color:#ffffff');
				}
			}else{
				if(GridId != null && GridId != ""){
		    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.data;
					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, eqpId);
					$('#'+GridId).alopexGrid( "cellEdit", "", {_index : { row : rowIndex}}, eqpNm);
				}else{	
					$("#" + eqpId).val("");
					$("#" + eqpNm).val("");
					$("#" + eqpNm).attr('style', 'background-color:#ffffff');
				}
			}
		}
	});		
}

//RM포트 찾기 팝업  사용함(그리드ID, 포트코드필드, 포트명필드, 장비ID, 검색할 포트명) 
function openRmPortPop(GridId, portId, portNm, paramEqpId, searchPortNm){
	var param = new Object();
	$.extend(param,{"neId":nullToEmpty(paramEqpId)});
	$.extend(param,{"portNm":nullToEmpty(searchPortNm)});
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: "popPortRmSch_" + portId,
	  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
	  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
	  	data: param,
		modal: true,
		movable:true,
		width : 1100,
		height : 740,
		callback:function(data){
			if(data != null){
				if(GridId != null && GridId != ""){
		    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
		    		var rowIndex = focusData[0]._index.data;
					$('#'+GridId).alopexGrid( "cellEdit", data[0].portId, {_index : { row : rowIndex}}, portId);
					$('#'+GridId).alopexGrid( "cellEdit", data[0].portNm, {_index : { row : rowIndex}}, portNm);
				}else{
					$("#" + portId).val(data[0].portId);
					$("#" + portNm).val(data[0].portNm);
				}
			}
		}
	}); 
}

//포트 찾기 팝업
function openPortPop(portId, portNm, eqpId, searchPortNm){
	var param = new Object();
	$.extend(param,{"eqpId":nullToEmpty(eqpId)});
	$.extend(param,{"searchPortNm":nullToEmpty(searchPortNm)});
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: "popPortSch" + portId,
	  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
	  	url: urlPath + '/configmgmt/portmgmt/PortInfPop.do',
	  	data: param,
		modal: true,
		movable:true,
		width : 1100,
		height : 600,
		callback:function(data){
			if(data != null){
	    		if(nullToEmpty(portId) != ""){
	    			$('#' + portId).val(data.portId);
	    		}
	    		if(nullToEmpty(portNm) != ""){
	    			$('#' + portNm).val(data.portNm);
	    		}
			}
		}
	}); 	
	
}

//포트 찾기 팝업  그리드에서 사용함(그리드ID, 포트코드필드, 포트명필드, 장비ID, 검색할 포트명) 
function openPortGridPop(GridId, portId, portNm, eqpId, searchPortNm){
	var param = new Object();
	$.extend(param,{"eqpId":nullToEmpty(eqpId)});
	$.extend(param,{"searchPortNm":nullToEmpty(searchPortNm)});
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: "popPortGridSch" + portId,
	  	title: cflineCommMsgArray['findPort']/* 포트 조회 */,
	  	url: urlPath +'/configmgmt/cfline/PortInfPop.do',
	  	data: param,
		modal: true,
		movable:true,
		width : 1100,
		height : 600,
		callback:function(data){
			if(data != null){
	    		var focusData = $('#'+GridId).alopexGrid("dataGet", {_state : {focused : true}});
	    		var rowIndex = focusData[0]._index.data;
				$('#'+GridId).alopexGrid( "cellEdit", data.portId, {_index : { row : rowIndex}}, portId);
				$('#'+GridId).alopexGrid( "cellEdit", data.portNm, {_index : { row : rowIndex}}, portNm);
				
			}
		}
	}); 
}
/**
 * 버튼 활성화 비활성화 처리
 * @param GridId
 * @param dupMtsoBtnId
 * @param workCnvtBtnId
 * @param gubun
 */
function btnEnableProc(GridId, dupMtsoBtnId, workCnvtBtnId, gubun){
	if(gubun=="A"){
		$('#'+ dupMtsoBtnId).setEnabled(false);
		var selectedId = $('#'+GridId).alopexGrid('dataGet', {_state:{selected:true}});
		if(selectedId.length > 0 ){
			$('#'+ workCnvtBtnId).setEnabled(true);
		}else{
			$('#'+ workCnvtBtnId).setEnabled(false);
		}  	
	}else if(gubun=="B"){
		$('#'+ workCnvtBtnId).setEnabled(false);
		var selectedId = $('#'+GridId).alopexGrid('dataGet', {_state:{selected:true}});
		if(selectedId.length > 0 ){
			$('#'+ dupMtsoBtnId).setEnabled(true);
		}else{
			$('#'+ dupMtsoBtnId).setEnabled(false);
		}
		
	}
}
function btnEnableProc2(GridId, btnId){
	var selectedId = $('#'+GridId).alopexGrid('dataGet', {_state:{selected:true}});
	if(selectedId.length > 0 ){
		$('#'+ btnId).setEnabled(true);
	}else{
		$('#'+ btnId).setEnabled(false);
	}  
}

/**
 * input text 활성화/비활성화 제어(text type만 적용)
 * @param parentId
 * @param childId
 * @param gubun - parent value가 gubun과 같을때 enable false
 */
function inputEnableProc(parentId, childId, gubun){
	var parentVal = nullToEmpty($('#'+parentId).val());
	gubun = nullToEmpty(gubun);
	var isEnabled = parentVal == gubun? true : false;
	if(isEnabled){
		$('#'+childId).val("");
		$('#'+childId).setEnabled(false);
	} else {
		$('#'+childId).setEnabled(true);
	}
}

function getMtsoNonName(value){
	var returnValue = value;
	if(nullToEmpty(value) == ""){
		returnValue = "미확인국사";
	}
	return returnValue;
}
/**
 * 
 * @param svlnSclCd 소분류id
 * @param svlnTypCd 유형코드id
 * @param svlnTypCdData 유형코드 데이터
 * @param selGbn 구분(S:선택, N:'',A:전체)
 */
function makeSvlnTypCdSelectBox(svlnSclCd, svlnTypCd, svlnTypCdData, selGbn){
	var svlnSclCdVal = $('#'+svlnSclCd).val();
	if(nullToEmpty(svlnSclCdVal) != ""){ 
		var selPrePendStr = "";
		if(selGbn == 'S'){
			selPrePendStr = cflineCommMsgArray['select'] /* 선택 */;
		}else if(selGbn == 'N'){
			selPrePendStr = "";
		}else{
			selPrePendStr = cflineCommMsgArray['all'] /* 전체 */;
		}	
		var svlnTypCd_option_data =  [];
		var dataOne = {"value":"","text":selPrePendStr};
		svlnTypCd_option_data.push(dataOne);
		for(k=0; k<svlnTypCdData.length; k++){
			var data = svlnTypCdData[k]; 
			//console.log(data);
			if(nullToEmpty(data.etcAttrValOne) != "" && data.etcAttrValOne.indexOf(svlnSclCdVal) >=0){ 
				svlnTypCd_option_data.push(data);
			}
		}		
		$('#' + svlnTypCd).clear();
		$('#' + svlnTypCd).setData({data : svlnTypCd_option_data});	
	}
	
}

function getCurrDate() {
	var now = new Date();
	var date = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) + String(now.getHours()) + String(now.getMinutes()); 
	return date;
}


function nvlStr(str1, str2){
	var str1 = nullToEmpty(str1);
	if(str1 == ""){
		return nullToEmpty(str2);
	}
	else {
		return str1;
	}
}

function tmofMsgView(gubun){
	if(gubun=="1"){
		alertBox('W', cflineCommMsgArray['updateModePossible']); /*"편집모드에서만 가능합니다.*/
	}else if(gubun=="2"){
		alertBox('W', cflineCommMsgArray['nonTmofAuth']); /*"권한이 없는 전송실 입니다.*/
	}else{
		alertBox('W', "완료된 전송실 입니다.");
	}
}

// 사용자 정보 설정
function setUserInfo(hdofcId, teamId, tmofId) {
	//console.log("setUserInfo");
	var userHdofcCd = "";
	var userTeamCd = "";
	var userJrdtTmof = "";
	if ($('#userHdofcCd').val() != undefined) {
		//userHdofcCd = $('#userHdofcCd').val();		
	} else if ($('#userHdofcCdPop').val() != undefined) {
		//userHdofcCd = $('#userHdofcCdPop').val();		
	}

	if ($('#userTeamCd').val() != undefined) {
		//userTeamCd = $('#userTeamCd').val();		
	}else if ($('#userTeamCdPop').val() != undefined) {
		//userTeamCd = $('#userTeamCdPop').val();		
	}

	if ($('#userJrdtTmof').val() != undefined) {
		userJrdtTmof = $('#userJrdtTmof').val();
	} else if ($('#userJrdtTmofPop').val() != undefined) {
		//userJrdtTmof = $('#userJrdtTmofPop').val();	
	}
	
	// 관리그룹 설정에서 호출 일경우
	if (hdofcId != null && hdofcId != '') {
		if (userHdofcCd != "" && $('#' + hdofcId).find("option[value='"+userHdofcCd+"']").index() > -1) {
			$('#' + hdofcId).setSelected(userHdofcCd);
		} else if (teamId != null && teamId != '') {
			if (userTeamCd != "" && $('#' + teamId).find("option[value='"+userTeamCd+"']").index() > -1) {
				$('#' + teamId).setSelected(userTeamCd);
			} else if (tmofId != null && tmofId != '') {
				//console.log("tmofId : " + tmofId + " userJrdtTmof : " + userJrdtTmof + " index : " + $('#' + tmofId).find("option[value='"+userJrdtTmof+"']").index());
				editUserJrdtTmofInfo(tmofId, userJrdtTmof);
			}			
		}
	} // 본부 설정에서  호출인경우
	else if (teamId != null && teamId != '') {
		if (userTeamCd != "" && $('#' + teamId).find("option[value='"+userTeamCd+"']").index() > -1) {
			$('#' + teamId).setSelected(userTeamCd);
		} else if (tmofId != null && tmofId != '') {
			//console.log("tmofId : " + tmofId + " userJrdtTmof : " + userJrdtTmof + " index : " + $('#' + tmofId).find("option[value='"+userJrdtTmof+"']").index());
			editUserJrdtTmofInfo(tmofId, userJrdtTmof);
		}
	} // 팀 설정에서 호출인 경우 
	else if (tmofId != null && tmofId != '') {
		//console.log("tmofId : " + tmofId + " userJrdtTmof : " + userJrdtTmof + " index : " + $('#' + tmofId).find("option[value='"+userJrdtTmof+"']").index());
		editUserJrdtTmofInfo(tmofId, userJrdtTmof);
	}
}

// 소속전송실이 전체 혹은 없는 경우 첫번째 전송실을 기본 전송실로 설정하기 위해
function editUserJrdtTmofInfo(tmofId, userJrdtTmof) {
	if (userJrdtTmof != ""  && $('#' + tmofId).find("option[value='"+userJrdtTmof+"']").index() > -1) {
		setUserJrdtTmofId(tmofId, userJrdtTmof);
	} else {
		// 소속 전송실이 전체 혹은 없는경우 전송실의 첫 전송실을 선택
		if (userJrdtTmof == "" && $('#userJrdtTmof').val() != undefined) {			
			if (tomfIdSelectBoxId != null && tomfIdSelectBoxId != "" && $('#'+tomfIdSelectBoxId + ' option:first').val() != undefined) {
				//console.log($('#'+tomfIdSelectBoxId + ' option:first').val());
				userJrdtTmof = $('#'+tomfIdSelectBoxId + ' option:first').val();
				setUserJrdtTmofId(tmofId, userJrdtTmof);
			}
		}
	}
}

// 멀티셀렉트에 설정
function setUserJrdtTmofId(tmofId, userJrdtTmof) {
	if (tmofId == 'topMtsoIdList') {
		$('#' + tmofId).setData({topMtsoIdList:userJrdtTmof});
	} else if (tmofId == 'tmofCd' ) {
		$('#' + tmofId).setData({tmofCd:userJrdtTmof});
	} else if (tmofId == 'topMtsoId') {
		$('#' + tmofId).setData({topMtsoId:userJrdtTmof});
	} else if (tmofId == 'tmofCdPop') {
		$('#' + tmofId).setData({topMtsoId:userJrdtTmof});
	} else if (tmofId == 'topMtsoIdListPop') {
		$('#' + tmofId).setData({topMtsoIdList:userJrdtTmof});
	}		
}
// 사용자 관할 전송실 정보
function searchUserJrdtTmofInfo(topTmofId) {
	//console.log("searchUserJrdtTmofInfo");
	httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'getUserJrdtTmofInfo', topTmofId);
}


//사용자 관할 전송실 정보
function searchUserJrdtTmofInfoPop(popMgmtGrpCd) {
	//console.log("searchUserJrdtTmofInfo");
	httpCommon2Request('tango-transmission-biz/transmisson/configmgmt/cfline/userjrdttmof/selectuserjrdttmofinfo', null, 'GET', 'getUserJrdtTmofInfoPop', popMgmtGrpCd);
}


// 사용자 관리그룹 설정
function setUserMgmtCd(initUserMgmtCd) {
	if(initUserMgmtCd=="SKT"){
		userMgmtCd = "0001";
		viewMgmtCd = userMgmtCd;
	}else if(initUserMgmtCd=="SKB"){
		userMgmtCd = "0002";
		viewMgmtCd = userMgmtCd;
	}
}

function getLocalTimeString(){
	var nowTime = new Date();
	return nowTime.toLocaleString();
}

 /*전송실 콤보값 취득후 관리그룹이 없는 경우 보여지는 순서와
 관리그룹 변경후 보여지는 순서가 달라 
 전송실/팀정보 취득후 관리그룹이 없는경우 정렬을 관리그룹 전체 선택시 정렬과 동일하게 변경*/ 
function editMgmtGrpCdTmof() {
	var mgmtGrpCd = viewMgmtCd;

	// 전송실 select 처리
	var tmofCd_option_data =  [];
	if(tomfHeaderYn == "Y"){
		tmofCd_option_data.push(selPrePendTmof);
	}
	
	if(nullToEmpty(mgmtGrpCd) != ""){
		//alert(mgmtGrpCd);
		var tmpValue = "";
		// 본부코드정보가 있는경우
		if (hdofcCdData.length > 0) {	
			for(k=0; k<hdofcCdData.length; k++){
				var dataHdofc = hdofcCdData[k]; 
				if(mgmtGrpCd == dataHdofc.mgmtGrpCd){
					// 팀코드값이 있는경우
					if (teamCdData.length > 0) {
						for(i=0; i<teamCdData.length; i++){
							var data = teamCdData[i];  
							if(dataHdofc.value == data.uprOrgId){
					  			for(m=0; m<tmofCdData.length; m++){
					  				var dataTmofCd = tmofCdData[m];  
					  				if(data.value == dataTmofCd.teamCd){
					  					tmofCd_option_data.push(dataTmofCd);
					  				}
					  			}
							}
						}
					} // 팀코드값이 없는 경우 
					else {
						for(m=0; m<tmofCdData.length; m++){
			  				var dataTmofCd = tmofCdData[m];
			  				// 관리그룹에 속하는 전송실인경우
			  				if(mgmtGrpCd == dataTmofCd.mgmtGrpCd){
			  					tmofCd_option_data.push(dataTmofCd);
			  				}
			  			}
					}
				}
			}
		} // 본부코드 정보가 없는 경우
		else {
			// 팀코드값이 있는경우
			if (teamCdData.length > 0) {
				for(i=0; i<teamCdData.length; i++){
					var data = teamCdData[i];  
					// 관리그룹에 속하는 팀인경우
					if(mgmtGrpCd == data.mgmtGrpCd){
			  			for(m=0; m<tmofCdData.length; m++){
			  				var dataTmofCd = tmofCdData[m];  
			  				if(data.value == dataTmofCd.teamCd){
			  					tmofCd_option_data.push(dataTmofCd);
			  				}
			  			}
					}
				}
			} // 팀코드값이 없는 경우
			else {
				for(m=0; m<tmofCdData.length; m++){
	  				var dataTmofCd = tmofCdData[m];
	  				// 관리그룹에 속하는 전송실인경우
	  				if(mgmtGrpCd == dataTmofCd.mgmtGrpCd){
	  					tmofCd_option_data.push(dataTmofCd);
	  				}
	  			}
			}
		}
		//$('#' + tmofId).set Data({data : tmofCd_option_data});
		return tmofCd_option_data ;
	}
}

// RU_광코어 광공유 대표 회선번호 목록 팝업
function openOptlShreRepSvlnPop(optlShreRepSvlnNo, svlnNo){
	var param = new Object();
	$.extend(param,{"optlShreRepSvlnNo":nullToEmpty(optlShreRepSvlnNo)});
	$.extend(param,{"svlnNo":nullToEmpty(svlnNo)});
	
	var urlPath = $('#ctx').val();
	if(nullToEmpty(urlPath) ==""){
		urlPath = "/tango-transmission-web";
	}
	
	$a.popup({
	  	popid: "popOptlShreRefSvlnList",
	  	title: "광공유 대표 회선회"/* 광공유 대표 회선 */,
	  	url: urlPath +'/configmgmt/cfline/ServiceLineOptlListPop.do',
	  	data: param,
		modal: false,
		movable:true,
		windowpopup : true,
		width : 1100,
		height : 750,
		callback:function(data){
			if(data != null){
				if(data.msg != null){
					alertBox('I', data.msg);
				}
			}
		}
	}); 
}

/**
 * 날짜 더하기, 빼기
 * @param value(2017-08-11)
 * @param pattern(-)
 * @param num(5 또는 -5)
 */
function getDateAdd(value, pattern,num){
	if(value == null || value ==""){
		value = getTodayStr(pattern);
	}
	var arr = value.split(pattern);
	
	
	var tmpDate = new Date(arr[0], arr[1], arr[2]);
	var tmpDate2 = new Date(arr[0], arr[1], arr[2]);
	
	tmpDate2.setDate(tmpDate.getDate() + num);
	var yyyy = tmpDate2.getFullYear();
	var mm = tmpDate2.getMonth()+"";
	if(mm.length ==1){
		mm = "0" + mm;
	}
	var dd = tmpDate2.getDate()+"";
	if(dd.length ==1){
		dd = "0" + dd;
	}
	return yyyy + "-" + mm + "-" + dd;	
};

/**
 * 오늘 날짜 가져오기
 * @param pattern
 * @returns
 */
function getTodayStr(pattern){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if(("" + month).length ==1){
		month = "0" + month;
	}
	if(("" + day).length ==1){
		day = "0" + day;
	}

	return year + pattern + month + pattern + day;		
};

/*
 * Function Name : setComma
 * Description   : 숫자에 컴마 붙임
 * ----------------------------------------------------------------------------------------------------
 * str    		 : 문자열
 * ----------------------------------------------------------------------------------------------------
 * return        : render string  
 */

function setComma(str) {
	var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
	str += ""; // 숫자를 문자열로 변환
	str = str.replace(/[a-zA-Z]/gi, '');
	while ( reg.test(str) ) {
		str = str.replace(reg, "$1" + "," + "$2");
	}
	
	return str;
};


/*
 * Function Name : changeSvlnSclCdSimul
 * Description   : 서비스회선시뮬레이션용 소분류 콤보박스
 * ----------------------------------------------------------------------------------------------------
 * svlnLclId     : 서비스회선대분류
 * svlnSclId     : 서비스회선소분류
 * svlnSclCdData : 서비스회선소분류 코드값
 * mgmtGrpId     : 서비스회선관리그룹코드
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function changeSvlnSclCdSimul(svlnLclId, svlnSclId, svlnSclCdData, mgmtGrpId){

 	var svlnLclCd = $('#' + svlnLclId).val();
 	var tmpSvlnSclCd = $('#' + svlnSclId).val();
 	var mgmtGrpVal = $('#' + mgmtGrpId).val();
 	var tmpMgmtCdNm = $('#' + mgmtGrpId + ' option:selected').text();

	var svlnSclCd_option_data =  [];
 	if(svlnLclCd != null && svlnLclCd != ""){
		for(m=0; m<svlnSclCdData.length; m++){
			var dataS = svlnSclCdData[m];  

			if(dataS.value == "" && (svlnLclCd == "005")){// B2B회선인 경우 전체 는 무조건 포함
				svlnSclCd_option_data.push(dataS);
			}else if(m==0 && dataS.value != "" && (svlnLclCd == "005")){
				var dataFst = {"uprComCd":"","value":"","text":cflineCommMsgArray['all']};
				svlnSclCd_option_data.push(dataFst);
			}    

			if(nullToEmpty(svlnLclCd) == dataS.uprComCd){
				if(nullToEmpty(tmpMgmtCdNm) == "" || nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataS.cdFltrgVal) || "ALL" == nullToEmpty(dataS.cdFltrgVal) ){
					svlnSclCd_option_data.push(dataS);
				}
			}			
			
			
		}		
		if(nullToEmpty(mgmtGrpVal)=="0002" && nullToEmpty(svlnLclCd) =="005"){
			tmpSvlnSclCd = "009";
		}
		
		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
		
		
		$('#' + svlnSclId).setSelected(tmpSvlnSclCd);
 		
 	}else{
		for(m=0; m<svlnSclCdData.length; m++){
			var dataS = svlnSclCdData[m];  
			if(dataS.value == ""){ 
				svlnSclCd_option_data.push(dataS);
			}
			if(nullToEmpty(tmpMgmtCdNm) == "전체" || nullToEmpty(tmpMgmtCdNm) == nullToEmpty(dataS.cdFltrgVal) || "ALL" == nullToEmpty(dataS.cdFltrgVal) ){
				svlnSclCd_option_data.push(dataS);
			}			
		}		 		
		$('#' + svlnSclId).setData({data : svlnSclCd_option_data});
	}
 	//임차회선포함 체크박스 제어
 	//leslDisplayProc(svlnLclId, svlnSclId);
 	
 	// 시뮬레이션에서 사용하지 않는 회선 소분류 삭제
	if (nullToEmpty(svlnLclCd) =="003") {   // RU회선
		$('#' + svlnSclId).find("option[value='103']").remove();  // RU(CMS수집)
	}
	
	if (nullToEmpty(svlnLclCd) =="006") {   // 기타회선
		$('#' + svlnSclId).find("option[value='105']").remove();  // (구)NITS회선
	}
}




/*
 * Function Name : showServiceLIneInfoPop
 * Description   : 서비스회선 선번 팝업(상세팝업)
 * ----------------------------------------------------------------------------------------------------
 * gridId     : 그리드 ID
 * dataObj    : 그리드 선택 데이터 오브젝트
 * sFlag      : 플래그 
 * ----------------------------------------------------------------------------------------------------
 * return        : 
 */
function showServiceLIneInfoPop( gridId, dataObj, sFlag) {
//	var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoPop.do';
	var url = $('#ctx').val()+'/configmgmt/cfline/ServiceLineInfoDiagramPop.do';
	var width = 1400;
	var height = 940;
	
	var lineLnoGrpSrno = dataObj.lineLnoGrpSrno;
	if (lineLnoGrpSrno == undefined){
		lineLnoGrpSrno =null;
	}
	
	var autoClctYn = dataObj.autoClctYn;
	if (autoClctYn == undefined){
		autoClctYn =null;
	}
	
	// RM 관련 변수 추가 2017-12-04 (tmpRmEqpIdNm, tmpPortIdNm 추가 2017-12-08)
	// WCMA(IPNB) 관련 변수 추가 2019-02-19 (autoClctYn)
	var tmpRmEqpId = nullToEmpty(dataObj.rnmEqpId);
	var tmpRmEqpIdNm = nullToEmpty(dataObj.rnmEqpIdNm);
	var tmpPortId = nullToEmpty(dataObj.rnmPortId);
	var tmpPortIdNm = nullToEmpty(dataObj.rnmPortIdNm);
	var tmpPortChnlVal = nullToEmpty(dataObj.rnmPortChnlVal);
	var paramData = {
						"gridId" : gridId
						,"ntwkLineNo" : dataObj.svlnNo
						,"svlnLclCd" : dataObj.svlnLclCd
						,"svlnSclCd" : dataObj.svlnSclCd
						,"sFlag" : sFlag
						, "ntwkLnoGrpSrno" : lineLnoGrpSrno
						, "mgmtGrpCd" : dataObj.mgmtGrpCd 
						, "rnmEqpId" : tmpRmEqpId 
						, "rnmEqpIdNm" : tmpRmEqpIdNm 
						, "rnmPortId" : tmpPortId 
						, "rnmPortIdNm" : tmpPortIdNm 
						, "rnmPortChnlVal" : tmpPortChnlVal 
						, "autoClctYn" : dataObj.autoClctYn
					};

//	console.log("-------------------------------------");
//	console.log(paramData);
	$a.popup({
		popid: "ServiceLineDiagramPop",
		title: cflineMsgArray['serviceLineDetailInfo'] /*서비스회선상세정보*/,
		url: url,
		//data: {"gridId":gridId,"ntwkLineNo":dataObj.ntwkLineNo,"sFlag":sFlag},
		data: paramData,
		iframe: true,
		modal : false,
		movable:true,
		windowpopup : true,
		width : width,
//		height : window.innerHeight * 0.91
		height : height
		,callback:function(data){
			if(data != null){
				//alert(data);
			}
		}
	});
}


//네트워크 정보 TSDN에 전송
function sendToTsdnNetworkInfo(lineNoStr, ntwkEditLneType, editType) {
						
		var tsdnParam = {
				 lineNoStr : lineNoStr
			   , ntwkEditLneType : ntwkEditLneType  // T : 기간망트렁크, R : PTP RING
			   , editType : editType   // B:기본정보변경, E : 선번정보변경
		}
		
		//console.log(tsdnParam);
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendtotsdnntwkinfo', 
			data : tsdnParam, //data가 존재할 경우 주입
			method : 'GET', //HTTP Method
			flag : 'sendToTsdnNetworkInfo'
		}).done(function(response){
					//console.log(response);
				})
		  .fail(function(response){
			  	//console.log(response);
			  	});
}

/*
 * 서비스회선/네트워크 정보 GIS에 전송
 * 편집후 저장시 및 시각화에서 호출됨
 * 2023-04-10 2. [수정]가입자망인 경우 선번그룹번호 전송 주석처리된 부분 해재
 */ 

function sendFdfUseInfoCommon(lineNoStr, fdfEditLneType, fdfEditType, lineGrpSrno) {

	var fdfParam = {
			 lineNoStr : lineNoStr
		   , fdfEditLneType : fdfEditLneType
		   , fdfEditType : fdfEditType
	}
	
	/* 2. [수정]가입자망인 경우 선번그룹번호 전송*/
	fdfParam.lineGrpSrno = lineGrpSrno;
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/cflinecommon/sendfdfuseinfo', //URL 기존 처럼 사용하시면 됩니다.
		data : fdfParam, //data가 존재할 경우 주입
		method : 'GET', //HTTP Method
		flag : 'sendfdfuseinfo'
	}).done(function(response){
		//console.log(response);
		})
	.fail(function(response){
	  	//console.log(response);
	  	});
}

/**
 * 회선/네트워크 수정시 수용네트워크 추출 및 수정완료 처리
 * extractAcceptNtwkLine(acceptParam)
 * @param    lineNoStr : 회선번호
 *         , topoLclCd : 회선종류
 *         , topoSclCd : 토폴로지 상세코드
 *         , linePathYn : 서비스회선여부
 *         , editType : 편집타입(E : 주선번편집, C : 해지, RS : 주선번변경없이 재저장)
 *         , excelDataYn : excel 처리여부, callMsg : 호출시 작업메시지
 *         , callViewType : 해당기능 호출화면타입(AP : 자동수정목록)
	       , subScrNtwkLnoGrpSrno : 가입자망네트워크선번그룹일련번호
	       , excelFlag : truns, ring 추가
 */

function extractAcceptNtwkLine(acceptParam) {
						
	    if (nullToEmpty(acceptParam.excelDataYn) == '' ) {
	    	acceptParam.excelDataYn = null;
	    }
	    // 주선번만 처리한 건인 경우 예비선번의 수동수정처리로 처리결과를 업데이트 하기 않기 위해
	    // excelDataYn의 경우 주선번 처리건으로 파라메타 설정함
	    else if (nullToEmpty(acceptParam.excelDataYn) == "Y") {
	    	acceptParam.onlyMainOk = "Y";
	    } else if (nullToEmpty(acceptParam.callViewType) == "AP" && nullToEmpty(acceptParam.editType) == "E") {
	    	acceptParam.editType = "RS";
	    }
		/*var acceptParam = {
				 lineNoStr : acceptParam.ntwkLineNo
			   , topoLclCd : acceptParam.topoLclCd     // 001 : 링, 002 : 트렁크, 003 : WDM 트렁크
			   , topoSclCd : acceptParam.topoSclCd     // 035 : SMUX
			   , linePathYn : acceptParam.linePathYn   // Y:서비스회선, N : 네트워크회선
			   , ntwkLineNm : ($("#popNtwkLineNm").val() != undefined ? $("#popNtwkLineNm").val() : ($('#ntwkLineNm').val() != undefined ? $("#ntwkLineNm").val() : ($("#popInfoNtwkLineNm").val() != undefined ? $("#popInfoNtwkLineNm").val() : "" )))
			   , editType : acceptParam.editType // E : 선번편집, C : 해지, RS : 주선번변경없이 재저장(자동수정 대상추출작업 없음)
			   , excelDataYn : acceptParam.excelDataYn
			   , mgmtGrpCd : acceptParam.mgmtGrpCd // 0001 : skt, 0002 : skb
               , callViewType : 해당기능 호출화면타입(AP : 자동수정목록)
	           , subScrNtwkLnoGrpSrno : 가입자망네트워크선번그룹일련번호
		}*/
	    
	    acceptParam.ntwkLineNm = ($("#popNtwkLineNm").val() != undefined ? $("#popNtwkLineNm").val() 
				               : ($('#ntwkLineNm').val() != undefined ? $("#ntwkLineNm").val() 
				               : ($("#popInfoNtwkLineNm").val() != undefined ? $("#popInfoNtwkLineNm").val() 
				               : ($('#popLineNmSpan').text() != undefined ? $('#popLineNmSpan').text()
				               :  "" ))));
		
		
		//if (nullToEmpty(acceptParam.topoLclCd) == "003" && nullToEmpty(acceptParam.editType) == "E") {
		cflineShowProgressBody();
		//}
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/configmgmt/cfline/networkpathautoproc/extractacceptntwkline', 
			data : acceptParam, //data가 존재할 경우 주입
			method : 'GET', //HTTP Method
			flag : 'extractacceptntwkline'
		}).done(function(response){
					//console.log(response);
					cflineHideProgressBody();
					if (nullToEmpty(response.result) == "SUCCESS") {
						// 해당화면이 열려있는경우 
						// WDM트렁크 인경우만 우선처리
						if (nullToEmpty(chkExtractAcceptNtwkLine) !='' && 
								(nullToEmpty(acceptParam.topoLclCd) == "003")) {
							// 팝업으로 띄우지 않고 바로 처리
							autoProcAcceptNtwkListAll(response, acceptParam);
						} else {
							// 수집선번 처리 건수가 있는 경우 팝업 띄우기  - RING엑셀업로드인 경우에도 바로 처리
							showAutoProcTarget(response, acceptParam);
						}
					} else {
						
					}
				})
		  .fail(function(response){
					cflineHideProgressBody();
					chkExtractAcceptNtwkLine = "";
				   
			  	});

}

function excelUploadResult(tmpParam){
	cflineHideProgressBody();
	var data = tmpParam.data;
	var flag = tmpParam.excelFlag;
	var msg = "";
	if(flag == 'trunk' || flag == 'ring') {
		if(data.resultCd == "NG") {
			//resultCode = "NG";
			msg = cflineCommMsgArray['existFailUploadData'];  // 업로드에 실패한 데이터가 있습니다.  
			if (data.errorCd == "DATA_CHECK_ERROR") {
				msg += "<br>(";
				if (nullToEmpty(data.excelOkCount) != ''  && data.excelOkCount !='0') {
					resultCode = "OK";
					msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
				}
				msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
			}
			if (data.errorCd == "UPLOAD_LIMIT_CNT"){
				msg = cflineMsgArray['excelRowOver'];   //엑셀 업로드는 최대 1000건 까지만 가능합니다 
			}
			alertBox('W', msg);
	
			$("#fileName").val(data.fileNames + "." + data.extensionNames);
			$("#extensionName").val(data.extensionNames);
		} else {        		
			msg = cflineCommMsgArray['normallyProcessed'];  //정상적으로 처리되었습니다. 
			msg += "<br>("+cflineCommMsgArray['success'] +" : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ")";
			alertBox('I', msg);    //정상적으로 처리되었습니다. 
			//resultCode = "OK";
		}
		cflineHideProgressBody();
	} else if(flag == 'service') {
		if(data.Result == "Success"){
    		//DB업로드가 100% 완료되면 버튼이 숨겨짐
    		$('#btn_up_DB').hide();
    		msg = cflineCommMsgArray['normallyProcessed']; /* 정상적으로 처리되었습니다. */
    		msg += "<br>("+cflineCommMsgArray['success'] +" : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ")";
			alertBox('I', msg);   /* 정상적으로 처리되었습니다. */
			resultCode = "OK";
    	} else if(data.Result == "Error"){

    		msg = cflineCommMsgArray['existFailUploadData']; /* 업로드에 실패한 데이터가 있습니다. */
			msg += "<br>(";
			if (nullToEmpty(data.excelOkCount) != ''  && data.excelOkCount !='0') {
				//resultCode = "OK";
				msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
			} 
			msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
    		
    		alertBox('W', msg);
    		
			$("#fileName").val(data.fileNames + "." + data.extensionNames);
			$("#extensionName").val(data.extensionNames);
			
			resultCode = "NG";
    	} 
	}  else if(flag == 'e1service') {
		if(data.Result == "Success"){
    		//DB업로드가 100% 완료되면 버튼이 숨겨짐
    		$('#btn_up_DB').hide();
    		msg = cflineCommMsgArray['normallyProcessed']; /* 정상적으로 처리되었습니다. */
    		msg += "<br>("+cflineCommMsgArray['success'] +" : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ")";
			alertBox('I', msg);   /* 정상적으로 처리되었습니다. */
			resultCode = "OK";
    	} else if(data.Result == "Error"){
    		
    		if (nullToEmpty(data.excelOkCount) == '0'  && nullToEmpty(data.excelNgCount) == '0') {
				msg = "선번구성이 되어있지 않습니다.";
			} else {
    		
	    		msg = cflineCommMsgArray['existFailUploadData']; /* 업로드에 실패한 데이터가 있습니다. */
				msg += "<br>(";
				if (nullToEmpty(data.excelOkCount) != ''  && data.excelOkCount !='0') {
					//resultCode = "OK";
					msg += cflineCommMsgArray['success'] + " : " + data.excelOkCount + cflineCommMsgArray['singleCount'] + ", "
				} 
				msg += cflineCommMsgArray['failure'] + " : " + data.excelNgCount + cflineCommMsgArray['singleCount'] + ")"; 
			}
    		
    		alertBox('W', msg);
    		
			/*$("#fileName").val(data.fileNames + "." + data.extensionNames);
			$("#extensionName").val(data.extensionNames);*/
			
			resultCode = "NG";
    	} 
	} else {
		return;
	}
}

// 네트워크 수정시 자동수정할 수용네트워크 대상이 있는경우 팝업으로 제공
function showAutoProcTarget(response, tmpParam) {
	var url = 'NetworkPathAutoProcAcceptListPop.do';
	var automsg = "자동수정대상관리 화면에서 자동 수정 반영 건을 확인해 주세요.";
	if (response.excelDataYn == "Y") {
		// 자동수정대상관리 화면에서 자동 수정 반영 건을 확인해 주세요.
		if (nullToEmpty(chkExtractAcceptNtwkLine) =="SAVE") {
			chkExtractAcceptNtwkLine = "CHK_SAVE"; // 저장 alert를 두번 표시하지 않기 위해
		} else if(nullToEmpty(chkExtractAcceptNtwkLine) != ""){
			chkExtractAcceptNtwkLine = "";
		}
		//console.log(response.acptNtwkLineNoCnt);
		if (response.acptNtwkLineNoCnt > 0) {
			// TRUNK 및 E1 회선의 엑셀업로드의 경우 자동수정확인 메세지이후 에러확인 메세지가 표출되게 변경 2019-07-03
			// RING 엑셀업로드 추가 2020-10-24
			if(tmpParam.excelFlag != undefined 
					&& (tmpParam.excelFlag == "trunk" || tmpParam.excelFlag == "service" ||  tmpParam.excelFlag == "e1service"
						|| tmpParam.excelFlag == "ring")) {

				callMsgBox('','I', automsg, function(msgId, msgRst){  
	        		if (msgRst == 'Y') {	
	        			excelUploadResult(tmpParam);
		 			}
	        	});
			}  else {
				alertBox('I', automsg);
			}
		} else {
			excelUploadResult(tmpParam);
		}
		return;
	}

	var chkExtractMsg = nullToEmpty(tmpParam.callMsg);
	if (nullToEmpty(response.acptNtwkLineNoCnt) == "" ||  response.acptNtwkLineNoCnt == 0) {
		if (nullToEmpty(chkExtractAcceptNtwkLine) =="SAVE") {
			chkExtractAcceptNtwkLine = "CHK_SAVE"; // 저장 alert를 두번 표시하지 않기 위해  		 		
		} else if(nullToEmpty(chkExtractAcceptNtwkLine) != ""){
			chkExtractAcceptNtwkLine = "";
		}
		if (chkExtractMsg != "") {
			alertBox('I', chkExtractMsg);
		}
		return;
	}
	
	var autoProcMsg = "<center>" + chkExtractMsg
    +"<br><br><br>**************  자동수정처리 정보  **************"
    +"<br><br>[ " +tmpParam.ntwkLineNm + " ]의"
    +"<br><br>수용네트워크(링, 트렁크, 서비스회선) <b>" + getNumberFormatDis(response.acptNtwkLineNoCnt) +"</b>건이 존재합니다."
    +"<br><br>자동 수정처리 대상의 수용네트워크 목록 팝업이 열릴니다.</center>";

	// 알림
	callMsgBox('','I', autoProcMsg, function(msgId, msgRst){
   		if (msgRst == 'Y') {

   			if (nullToEmpty(chkExtractAcceptNtwkLine) =="SAVE") {
   				chkExtractAcceptNtwkLine = "CHK_SAVE"; // 저장 alert를 두번 표시하지 않기 위해  		 		
   			} else if(nullToEmpty(chkExtractAcceptNtwkLine) != ""){
   				chkExtractAcceptNtwkLine = "";
   			}
			var acceptParam = {
								"ntwkLineNo":response.ntwkLineNo
							  , "topoLclCd" : response.topoLclCd
							  , "ntwkLineNm" : tmpParam.ntwkLineNm
							  , "linePathYn" : tmpParam.linePathYn
							  , "mgmtGrpCd" : tmpParam.mgmtGrpCd
							  , "detailTitle" : "자동수정대상목록"
							  , "cmuxExtYN" : tmpParam.cmuxExtYN
							  , "subScrNtwkLnoGrpSrno" : tmpParam.subScrNtwkLnoGrpSrno
							}
			
			$a.popup({
		       	popid: "AutoProcTargetListPop",
		       	title: "자동수정대상목록",
		       	iframe: true,
			    modal: true,
			    movable:true,
			    windowpopup : true,		
		        url: url,
		        data: acceptParam,
		        width : 1400,
		        height : 850, 
		        callback: function(data) { 	        	   
			    	 //
			     }
			});
   		}
	});
}


//네트워크 수정시 자동수정할 수용네트워크 대상이 있는경우 팝업으로 제공
function autoProcAcceptNtwkListAll(response, acceptParam) {

	// 엑셀 처리건
	if (response.excelDataYn == "Y") {
		// 자동수정대상관리 화면에서 자동 수정 반영 건을 확인해 주세요.
		if (nullToEmpty(chkExtractAcceptNtwkLine) =="SAVE") {
			chkExtractAcceptNtwkLine = "CHK_SAVE"; // 저장 alert를 두번 표시하지 않기 위해
		} else if(nullToEmpty(chkExtractAcceptNtwkLine) != ""){
			chkExtractAcceptNtwkLine = "";
		}
		return;
	}
	
	var chkExtractMsg = nullToEmpty(acceptParam.callMsg);
	if (nullToEmpty(response.acptNtwkLineNoCnt) == "" ||  response.acptNtwkLineNoCnt == 0) {
		
		if (nullToEmpty(chkExtractAcceptNtwkLine) =="SAVE") {
			chkExtractAcceptNtwkLine = "CHK_SAVE"; // 저장 alert를 두번 표시하지 않기 위해  		 		
		} else if(nullToEmpty(chkExtractAcceptNtwkLine) != ""){
			chkExtractAcceptNtwkLine = "";
		}
		if (chkExtractMsg != "") {
			alertBox('I', chkExtractMsg);
		}
		return;
	}
	
	//var autoProcNtwkLineNm = ($("#popNtwkLineNm").val() != undefined ? $("#popNtwkLineNm").val() : ($('#ntwkLineNm').val() != undefined ? $("#ntwkLineNm").val() : ($("#popInfoNtwkLineNm").val() != undefined ? $("#popInfoNtwkLineNm").val() : "" )));
		
	// 알림
	//callMsgBox('','I', chkExtractMsg, function(msgId, msgRst){
   	//	if (msgRst == 'Y') {
   			if (nullToEmpty(chkExtractAcceptNtwkLine) =="SAVE") {
   				chkExtractAcceptNtwkLine = "CHK_SAVE"; // 저장 alert를 두번 표시하지 않기 위해  		 		
   			} else if(nullToEmpty(chkExtractAcceptNtwkLine) != ""){
   				chkExtractAcceptNtwkLine = "";
   			}
			var autoProcMsg = "<center>" + chkExtractMsg
				              +"<br><br><br>**************  자동수정처리 정보  **************"
				              +"<br><br>[ " + acceptParam.ntwkLineNm + " ]의"
			                  +"<br><br>수용네트워크(링, 트렁크, 서비스회선) <b>" + getNumberFormatDis(response.acptNtwkLineNoCnt) +"</b>건을 자동수정처리합니다."
			                  +"<br><br>처리결과는 구성>네트워크정보>자동수정대상관리 화면에서 확인바랍니다."
			                  +"<br><br><font color='red'><b>자동수정처리에 선번양 및 자동수정처리건수에 따라 일정한 시간이 걸립니다.</b></font>"
			                  +"<br><br>주선번의 수정 후 재저장에 일정한 여유시간을 갖길 바랍니다.</center>";

			alertBox('I', autoProcMsg);
			//return;
			var acceptParam = {
								"ntwkLineNo":response.ntwkLineNo
							  , "topoLclCd" : response.topoLclCd
							}

			Tango.ajax({
				url : 'tango-transmission-biz/transmisson/configmgmt/cfline/networkpathautoproc/autoprocacceptntwklistall', 
				data : acceptParam, //data가 존재할 경우 주입
				method : 'GET', //HTTP Method
				flag : 'autoprocacceptntwklistall'
			}).done(function(response){
						//console.log(response);
					})
			  .fail(function(response){
				  	//console.log(response);
				  	});
	//	}   		
	//});
}


/**
 * 서비스회선중 RU광코어, L9TU(중계기정합장치)회선의 경우 서비스회선을 사용서비스회선으로 사용하는 경우 관련 정보 체크
 * checkUseServiceLine(checkParam)
 * @param editSvlnNo : 수정서비스회선번호, mainPathData : 주회선선번(LINKS)정보, subPathData : 예비회선선번(LINKS)정보, editPathType : 편집화면 타입(OP-구선번창, NP-시각화선번창) 
 * 
 */
function checkUseServiceLine(checkParam) {
	
	var useSvlnInfoParam = {};     
	
	// 주선번에서 사용서비스회선정보가 존재하는지 체크
	if (checkParam.mainPathData != "" && checkParam.mainPathData != null && checkParam.mainPathData.length > 0) {
		var tmpUseSvlnNo = "";
		for (var i = 0 ; i < checkParam.mainPathData.length; i++) {
			if (nullToEmpty(checkParam.mainPathData[i].SERVICE_ID) != "" && nullToEmpty(checkParam.mainPathData[i].SERVICE_ID).indexOf("alopex") < 0) {
				tmpUseSvlnNo = checkParam.mainPathData[i].SERVICE_ID;
				break;
			}
		}
		
		if (tmpUseSvlnNo != "") {
			useSvlnInfoParam.editSvlnNo = checkParam.editSvlnNo;
			useSvlnInfoParam.usedSvlnNo = tmpUseSvlnNo;			
		}
	}
	
	// 주선번에서 사용서비스회선정보가 존재하는지 체크
	if (checkParam.subPathData != "" && checkParam.subPathData != null && checkParam.subPathData.length > 0) {
		var tmpUseSvlnNo = "";
		for (var i = 0 ; i < checkParam.subPathData.length; i++) {
			if (nullToEmpty(checkParam.subPathData[i].SERVICE_ID) != "" && nullToEmpty(checkParam.subPathData[i].SERVICE_ID).indexOf("alopex") < 0) {
				tmpUseSvlnNo = checkParam.subPathData[i].SERVICE_ID;
				break;
			}
		}
		
		if (tmpUseSvlnNo != "") {
			useSvlnInfoParam.editSvlnNo = checkParam.editSvlnNo;
			useSvlnInfoParam.usedSprSvlnNo = tmpUseSvlnNo;			
		}
	}
	
	// 사용서비스회선 정보가 없는 경우
	if (nullToEmpty(useSvlnInfoParam.editSvlnNo) == "") {
		savePath();
		return;
	}
   
	cflineShowProgressBody();
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/getuseservicelineinfo', 
		data : useSvlnInfoParam, //data가 존재할 경우 주입
		method : 'GET', //HTTP Method
		flag : 'getuseservicelineinfo'
	}).done(function(response){
				//console.log(response);
				cflineHideProgressBody();
				if (nullToEmpty(response.useServiceLineInfo) != "" ) {
					if (nullToEmpty(response.useServiceLineInfo.result) == "OK") {

						cflineShowProgressBody();
						savePath();	
					} else {						
						alertBox('W', response.useServiceLineInfo.ngMsg);
						if (nullToEmpty(checkParam.editPathType == "OP")) {
							$("#"+detailGridId).alopexGrid("startEdit");
		    				$("#"+reserveGrid).alopexGrid("startEdit");
						}
						return;
					}				
				} else {
					alertBox('W', "사용 서비스회선 정보 조회에 실패했습니다.");
					return;
				}
			})
	  .fail(function(response){
		  		cflineHideProgressBody();
		  		//console.log(response);
			  	alertBox('W', "사용 서비스회선 정보 조회에 실패했습니다.");
				return;
		  	});
	
}


/**
 * SMUX링의 선번 상태체크후 선번 구조를 만족하는 경우 기설 서비스회선에 해당 링을 사용링으로 선번편집 처리 
 * autoProcSmuxRingToSvlnNo(smuxRingParam)
 * @param ntwkLineNo : 수정링번호, smuxRingAutoProcYn : 기설서비스회선번자동처리, callApiForSmux : 회선화면에서 호출, userId : 편집id자) , useRingNtwkLineNo : 
 * 
 */
function autoProcSmuxRingToSvlnNo(smuxRingParam) {
    //return;  // Smux링 선번체크 로직에 SMUX 장비 체크가 포함되면 주석처리하면됨
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/autoprocuseringofsmuxtosvlnline', 
		data : smuxRingParam, //data가 존재할 경우 주입
		method : 'GET', //HTTP Method
		flag : 'autoProcSmuxRingToSvlnNo'
	}).done(function(response){
				//console.log(response);
				//cflineHideProgressBody();
				if (nullToEmpty(response.appltYn) == "Y" ) {
					if (nullToEmpty(response.oldSvlnNo) != "") {
						//cflineShowProgressBody();
						// 기설서비스회선의 망구성방식코드업데이트
						var ruParam = {
								"lineNoStr" : response.oldSvlnNo
							  , "editType"  : "E"
						}
						setRuNetCfgMeans(ruParam);
					} 			
				} else {
					//alertBox('W', "");
					return;
				}
			})
	  .fail(function(response){
		  		cflineHideProgressBody();
		  		//console.log(response);
			  	//alertBox('W', "");
				return;
		  	});
	
}

// ADD 201811 : 추가
/**
 * 선번정보에서 FDF 사이의 모든 구간 정보 set 해서 return
 * 추가 : smux 장비를 시작과 끝 위치에 set
 * 
 * SMUX링의 경우 청약시 설정한 기설 서비스회선이 존재하고 해당 회선의 선번에 SMUX링을 사용하고 있지 않은 경우
 * 해당 선번을 이용하여 SMUX의 링 선번을 자동 구현한다 
 * SMUX링의 SMUX(COT/RN) 장비가 존재하는경우 1), 4)번은 작업하고 없는경우 1), 4)번은 작업하지 않는다
 * 1) 첫구간 WEST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(COT) 장비
 * 2) 첫구간 EAST 장비 : 기설 서비스회선의 첫 EAST FDF 장비
 * 3) 2)부터~ 마지막 WEST FDF 장비까지의 선번정보 복사
 * 4) 마지막 EAST 장비 : 해당링의 청약에 해당하는 공사코드를 기준으로 SMUX(RN) 장비
 * 
 *
 * 사용가능한 기존 서비스회선번호의 선번 구조는
 * 1) 선번인 1개인 경우 WEST 장비가 FDF이고 EAST장비가 RU인 경우
 * 2) 선번이 2개 이상인 경우 첫 FDF 장비가 반드시 EAST로 시작하고 마지막 FDF 장비가 WEST 인 경우
 */
var setPreLinePath = function(response) {
	
	var linePathData = response.data.LINKS;	// 기존서비스번호의 선번 정보
	var eqpInfoData = response.eqp_data;	// 장비정보
	var rtnLinePathData = [];
	
	var eqp_cot = null;	// 장비 시작 정보 
	var eqp_rt = null;	// 장비 끝 정보
	

	// 1. 선번이 없는 경우
	if (linePathData.length == 0) {
		return rtnLinePathData;
	}
	
	// 장비 시작, 끝 정보 set
	if(eqpInfoData.length <= 2) {
		$.each(eqpInfoData, function(idx, item) {
			if(item.nodeRoleCd == "C" && eqp_cot == null) {
				eqp_cot = item;
			} else if(item.nodeRoleCd == "R" && eqp_rt == null) {
				eqp_rt = item;
			}
		});
	}
	
		
	// FDF의 시작과 끝 정보 get
	var startIdx = -1;
	var endIdx = -1;
	var startSide = "";
	var endSide = "";
	var chkUseRingId = false;

	$.each(linePathData, function(idx, item) {
		// 사용링 정보가 있는지 확인
		if (nullToEmpty(item.RING_ID) != ""  ) {
			chkUseRingId = true;
		}
		if(item.LEFT_NE_ROLE_CD != "" && (item.LEFT_NE_ROLE_CD == "11" || item.LEFT_NE_ROLE_CD == "162"
			 || item.LEFT_NE_ROLE_CD == "177" || item.LEFT_NE_ROLE_CD == "178" || item.LEFT_NE_ROLE_CD == "182")) {
			if(startIdx < 0) {
				startIdx = idx;
				startSide = "LEFT";
			}
			endIdx = idx;
			endSide = "LEFT";
		}
		if(item.RIGHT_NE_ROLE_CD != "" && (item.RIGHT_NE_ROLE_CD == "11" || item.RIGHT_NE_ROLE_CD == "162"
			 || item.RIGHT_NE_ROLE_CD == "177" || item.RIGHT_NE_ROLE_CD == "178" || item.RIGHT_NE_ROLE_CD == "182")) {
			if(startIdx < 0) {
				startIdx = idx;
				startSide = "RIGHT";
			}
			endIdx = idx;
			endSide = "RIGHT";
		}
	});
	
	// 사용링 정보 체크
	if (chkUseRingId == true) {
		return rtnLinePathData;
	}
	
	//console.log(startIdx + "," + endIdx + "," + startSide + "," + endSide);
	
	/**
	 * 1. 선번이 1개 인 경우
	 * 	FDF가 LEFT로 끝나면 상위라인을 추가하고 상위라인 RIGHT에 FDF 정보 set, S-MUX 정보 있으면 set
	 * 2. 선번이 2개 이상인 경우
	 * 	1) 첫 line의 RIGHT FDF, 끝 line의 LEFT 가 FDF 인 경우 set, S-MUX 정보 있으면 set
	 * 	2) FDF가 LEFT 시작일때 set 하지 않음
	 */  
	
	$.each(linePathData, function(idx, item) {
		var addData = {};
		
		// 1.선번이 1개 인 경우
		if(linePathData.length == 1) {
			// FDF가 LEFT 상위라인을 추가하고 상위라인 RIGHT에 FDF 정보 set, S-MUX 정보 있으면 set
			if(startSide == "LEFT"){
				addData = addEqpData(idx, null + 1, eqp_cot, null, item);   // addEqpData : LEFT_ /RIGHT_ 정보만 추출한 정보
				for(var s in item){
					if(s.indexOf('LEFT_') == 0 || s.indexOf('RIGHT_') == -1) {
						var tmpStr = 'RIGHT_' + s.replace('LEFT_', '');
						eval("addData." + tmpStr + " = item." + s);
					}
				}
				rtnLinePathData.push(addData);
				addData = {};
				addData = addEqpData(idx, endIdx, null, eqp_rt, item);
				for(var s in item){
					if(s.indexOf('LEFT_') == 0  || s.indexOf('RIGHT_') == -1) {
						eval("addData." + s + " = item." + s);
					}
				}
			}
			if(Object.keys(addData).length > 0)
				rtnLinePathData.push(addData);
		}
		else {
			// 2-2) FDF가 LEFT 시작일때 set 하지 않음
			if(startSide == "RIGHT" && endSide == "LEFT"){
				
				// 2-1) 첫 line의 RIGHT FDF, 끝 line의 LEFT 가 FDF 인 경우 set, S-MUX 정보 있으면 set
				addData = addEqpData(idx, endIdx, eqp_cot, eqp_rt, item);	// 장비 정보 add
				
				if(idx == 0) {
					if(startIdx == 0){
						if(startSide == "RIGHT") {
							for(var s in item) {
								if(s.indexOf('RIGHT_') == 0) {
									eval("addData." + s + " = item." + s);
								}
							}
						}
					}
					else {
						if(startSide == "RIGHT"){
							for(var s in linePathData[startIdx]) {
								if(s.indexOf('RIGHT_') == 0) {
									eval("addData." + s + " = linePathData[startIdx]." + s);
								}
							}
						}
					}
				}
				else if(idx > 0 && endIdx-startIdx > idx) {
					if(startIdx > idx ) {	//startIdx - idx > 0 && idx > 0 && endIdx-startIdx > idx
						if(startSide == "LEFT"){
							for(var s in linePathData[startIdx+idx]){
								if(s.indexOf('LEFT_') == 0 ) {
									eval("addData." + s + " = linePathData[startIdx+idx]." + s);
								}
							}
						}
						else {
							for(var s in linePathData[startIdx+idx]) {
								if(s.indexOf('RIGHT_') == 0) {
									eval("addData." + s + " = linePathData[startIdx+idx]." + s);
								}
							}
						}
					}
					else if(startIdx < idx){	//idx - startIdx > 0 && idx > 0 && endIdx != idx
						for(var s in item) {
							eval("addData." + s + " = item." + s);
						}
					}
				}
				else if (endIdx == idx) {
					if(endSide == "RIGHT") {
						for(var s in item) {
							eval("addData." + s + " = item." + s);
						}
					}
					else {
						for(var s in item){
							if(s.indexOf('LEFT_') == 0) {
								eval("addData." + s + " = item." + s);
							}
						}
					}
				}
				if(Object.keys(addData).length > 0)
					rtnLinePathData.push(addData);
			}
		}
		
	});
	
	return rtnLinePathData;
}

//SMUX 장비시작, 끝 장비 정보 set
function addEqpData(idx, endIdx, eqp_cot, eqp_rt, neTemplateData) {
	var addData = {};
	/** 확인
	LEFT_VENDOR_NM	// 제조사
	LEFT_NE_ROLE_NM	//장비역할
	LEFT_ORG_NM_L3	// 전송실
	LEFT_PORT_DUMMY // 더미장비*/	
	if(idx == 0 && eqp_cot != null) {
		if (neTemplateData != null) {
			for(var s in neTemplateData){
				if(s.indexOf('LEFT_') == 0) {
					eval("addData." + s + " = "+ '""');
				}
			}
		}
		addData.LEFT_NE_ID = eqp_cot.eqpId;
		addData.LEFT_NE_NM = eqp_cot.eqpNm;
		addData.LEFT_PORT_ID = eqp_cot.portId;
		addData.LEFT_PORT_NM = eqp_cot.portNm;
		//addData.LEFT_NODE_ROLE_CD = eqp_cot.nodeRoleCd;
		//addData.LEFT_NODE_ROLE_NM = eqp_cot.nodeRoleNm;
		addData.LEFT_ORG_NM = eqp_cot.mtsoNm;
		addData.LEFT_PORT_DESCR = eqp_cot.portNm;
		addData.LEFT_MODEL_NM = eqp_cot.eqpMdlNm;
		addData.LEFT_MODEL_LCL_NM = eqp_cot.eqpMdlLclCdNm;
		addData.LEFT_MODEL_MCL_NM = eqp_cot.eqpMdlMclCdNm;
		addData.LEFT_MODEL_SCL_NM = eqp_cot.eqpMdlSclCdNm;
		addData.LEFT_NE_STATUS_NM = eqp_cot.portStatCdNm;

		addData.LEFT_RX_NE_ID = null;
		addData.LEFT_RX_PORT_ID = null;
		
	}
	if(idx == endIdx && eqp_rt != null) {
		if (neTemplateData != null) {
			for(var s in neTemplateData){
				if(s.indexOf('RIGHT_') == 0) {
					eval("addData." + s + " = " + '""');
				}
			}
		}
		addData.RIGHT_NE_ID = eqp_rt.eqpId;
		addData.RIGHT_NE_NM = eqp_rt.eqpNm;
		if(baseInfData[0].topoCfgMeansCd != undefined && baseInfData[0].topoCfgMeansCd == "001"){
			
		}
		else{
			addData.RIGHT_PORT_ID = eqp_rt.portId;
			addData.RIGHT_PORT_NM = eqp_rt.portNm;
			addData.RIGHT_PORT_DESCR = eqp_rt.portNm;
		}
		//addData.RIGHT_NODE_ROLE_CD = eqp_rt.nodeRoleCd;
		//addData.RIGHT_NODE_ROLE_NM = eqp_rt.nodeRoleNm;
		addData.RIGHT_ORG_NM = eqp_rt.mtsoNm;
		addData.RIGHT_MODEL_NM = eqp_rt.eqpMdlNm;
		addData.RIGHT_MODEL_LCL_NM = eqp_rt.eqpMdlLclCdNm;
		addData.RIGHT_MODEL_MCL_NM = eqp_rt.eqpMdlMclCdNm;
		addData.RIGHT_MODEL_SCL_NM = eqp_rt.eqpMdlSclCdNm;
		addData.RIGHT_NE_STATUS_NM = eqp_rt.portStatCdNm;
		
		addData.RIGHT_RX_NE_ID = null;
		addData.RIGHT_RX_PORT_ID = null;
	}
	return addData;
}

// ADD 201811 : 추가
/**
 * 링 정보 setting
 */
var setPathRingData = function (useRing) {
	var originalPath = useRing.data;
	var pathData = originalPath;
	
    // 사용링은 Through 구간만 포함하고, 위, 아래에 Add, Drop 구간을 삽입한다.
    var throughLinks = [];
    for(var i = 0; i < pathData.LINKS.length; i++) {
    	var addData = {};
    	var tmpLink = pathData.LINKS[i];
    	if(i==0){
    		// 링의 첫 구간인 경우 해당 구간의 WEST 장비를 복제하여 서비스회선의 첫구간의 EAST 장비로 설정한다.
    		// 추가된 첫 라인
    		for(var s in tmpLink){
				if(s.indexOf('LEFT_') == 0 ) {
					eval("addData." + s.replace("LEFT_", "RIGHT_") + " = tmpLink." + s);
				}
			}
    		
            // 좌장비 ADD_DROP타입설정
    		addData.LEFT_ADD_DROP_TYPE_CD = "N";
    		addData.LEFT_NODE_ROLE_CD = "NA";
            // 우장비 정보 셋팅
    		addData.RIGHT_PORT_DESCR = "";
    		addData.RIGHT_PORT_NM = "";
    		addData.RIGHT_PORT_ID = null;
    		addData.RIGHT_ADD_DROP_TYPE_CD = "A";
    		addData.RIGHT_NODE_ROLE_CD = "NA";
    		// 서비스회선 첫 구간 삽입
    		throughLinks.push(addData);
    		
    	} 
    	
    	tmpLink.USE_NETWORK_ID = originalPath.NETWORK_ID;
		tmpLink.USE_NETWORK_NM = originalPath.NETWORK_NM;
		tmpLink.USE_NETWORK_PATH_SAME_NO = originalPath.PATH_SAME_NO;
		tmpLink.USE_NETWORK_PATH_DIRECTION = originalPath.PATH_DIRECTION;
		tmpLink.USE_NETWORK_LINK_DIRECTION = originalPath.PATH_DIRECTION;
	    
		tmpLink.RING_ID = originalPath.NETWORK_ID;
		tmpLink.RING_NM = originalPath.NETWORK_NM;
		tmpLink.RING_STATUS_CD = originalPath.NETWORK_STATUS_CD;
		tmpLink.RING_STATUS_NM = originalPath.NETWORK_STATUS_NM;
        tmpLink.RING_PATH_SAME_NO = originalPath.PATH_SAME_NO;
        tmpLink.RING_PATH_GROUP_NO = 1;
        tmpLink.RING_PATH_DIRECTION = originalPath.PATH_DIRECTION;
        tmpLink.RING_TOPOLOGY_LARGE_CD = originalPath.TOPOLOGY_LARGE_CD;
        tmpLink.RING_TOPOLOGY_LARGE_NM = originalPath.TOPOLOGY_LARGE_NM;
        tmpLink.RING_TOPOLOGY_SMALL_CD = originalPath.TOPOLOGY_SMALL_CD;
        tmpLink.RING_TOPOLOGY_SMALL_NM = originalPath.TOPOLOGY_SMALL_NM;
        tmpLink.RING_TOPOLOGY_CFG_MEANS_CD = originalPath.TOPOLOGY_CFG_MEANS_CD;
        tmpLink.RING_TOPOLOGY_CFG_MEANS_NM = originalPath.TOPOLOGY_CFG_MEANS_NM;
		
		tmpLink.LEFT_ADD_DROP_TYPE_CD = "T";
		tmpLink.RIGHT_ADD_DROP_TYPE_CD = "T";

		tmpLink.LEFT_NODE_ROLE_CD = "NA";
		tmpLink.RIGHT_NODE_ROLE_CD = "NA";

		throughLinks.push(tmpLink);
		
		if(i == (pathData.LINKS.length-1)){
			// 링의 마지막 선번의 EAST 장비를 WEST 장비에 복사하여 마지막 구간을 추가해 준다
			for(var s in tmpLink){
				if(s.indexOf('RIGHT_') == 0 ) {
					eval("addData." + s.replace("RIGHT_", "LEFT_") + " = tmpLink." + s);
				}
			}
    		    		
    		// 우장비 ADD_DROP타입설정
			addData.RIGHT_ADD_DROP_TYPE_CD = "N";
			addData.RIGHT_NODE_ROLE_CD = "NA";
            // 좌장비 정보 셋팅
            addData.LEFT_PORT_DESCR = "";
            addData.LEFT_PORT_NM = "";
            addData.LEFT_PORT_ID = null;
            addData.LEFT_ADD_DROP_TYPE_CD = "D";
            addData.LEFT_NODE_ROLE_CD = "NA";
            addData.LEFT_CHANNEL_DESCR = "";
            
    		// 서비스회선 마지막 구간 삽입
    		throughLinks.push(addData);
		}
	}
	return throughLinks;
}


/**
 * SMUX링의 선번에 COT장비가 설정된 경우 해당 정보를 바탕으로 링명에 장비의 시리얼을 링명으로 업데이트 함
 * updateSmuxRingNameByCotNm(smuxRingParam)
 * @param ntwkLineNo : 수정링번호, userId : 편집id자, viewType : O -구선번화면/ N - 시각화화면) 
 * 
 */
function updateSmuxRingNameByCotNm(smuxRingParam) {
    //return;  // 링명 제한규칙 풀리면 return 삭제
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/ring/updateSmuxRingNameByCotNm', 
		data : smuxRingParam, //data가 존재할 경우 주입
		method : 'GET', //HTTP Method
		flag : 'updateSmuxRingNameByCotNm'
	}).done(function(response){
				//console.log(response);
				//cflineHideProgressBody();
				if (nullToEmpty(response.result) == "OK" ) {
					if(nullToEmpty(smuxRingParam.excelDataYn) != "Y" ) {
						//GIS에 FDF정보 전송
						sendFdfUseInfoCommon(smuxRingParam.ntwkLineNo, "R", "B", null);
						// 현재 기본정보 재호출 / 화면 호출화면의 기본정보 재호출
						reGetRingBaseInfo(smuxRingParam);  // RingInfoPop.js에 있음
					}
				} else {
					//alertBox('W', "");
					return;
				}
			})
	  .fail(function(response){
		  		cflineHideProgressBody();
		  		//console.log(response);
			  	//alertBox('W', "");
				return;
		  	});
}

/**
 * 5G-PON링의 선번에 COT장비가 설정된 경우 해당 정보를 바탕으로 링명에 장비의 시리얼을 링명으로 업데이트 함
 * updateFiveGRingNameByCotNm(fiveGponRingParam)
 * @param ntwkLineNo : 수정링번호, userId : 편집id자, viewType : O -구선번화면/ N - 시각화화면) 
 * 
 */
function updateFiveGRingNameByCotNm(fiveGponRingParam) {
    //return;  // 링명 제한규칙 풀리면 return 삭제
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/ring/updateFiveGRingNameByCotNm', 
		data : fiveGponRingParam, //data가 존재할 경우 주입
		method : 'GET', //HTTP Method
		flag : 'updateFiveGRingNameByCotNm'
	}).done(function(response){
				//console.log(response);
				//cflineHideProgressBody();
				if (nullToEmpty(response.result) == "OK" ) {
					//GIS에 FDF정보 전송
					sendFdfUseInfoCommon(fiveGponRingParam.ntwkLineNo, "R", "B", null);
					// 현재 기본정보 재호출 / 화면 호출화면의 기본정보 재호출
					reGetRingBaseInfo(fiveGponRingParam);  // RingInfoPop.js에 있음
				} else {
					//alertBox('W', "");
					return;
				}
			})
	  .fail(function(response){
		  		cflineHideProgressBody();
		  		//console.log(response);
			  	//alertBox('W', "");
				return;
		  	});
}

// 링의 기본정보 재조회
function reGetRingBaseInfo(smuxRingParam) {
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/ring/getOutData', 
		data : smuxRingParam, //data가 존재할 경우 주입
		method : 'GET', //HTTP Method
		flag : 'updateSmuxRingNameByCotNm'
	}).done(function(response){
				//console.log(response);
				//cflineHideProgressBody();
				if (nullToEmpty(response.getOutInfoData) !="") {
					// 각 화면의 링 명 수정
					baseInfData = response.getOutInfoData;
					$("#ntwkLineNm").val(response.getOutInfoData[0].ntwkLineNm);
					// 구선번
					if (nullToEmpty(smuxRingParam.viewType) == "O") {
						$('#'+baseGridId).alopexGrid('dataSet', baseInfData);
					} 
					if (nullToEmpty(opener) != "" &&  $('#lineInfoPop' , opener.document).val() != undefined) {
					    var lineInfoText = cflineMsgArray['networkName'] + " : " + nullToEmpty(response.getOutInfoData[0].ntwkLineNm) + " , " +  cflineMsgArray['networkIdentification'] + " : " +  nullToEmpty(response.getOutInfoData[0].ntwkLineNo) ;
					    $('#lineInfoPop' , opener.document).html(" " + lineInfoText + " "); 
					} 
					
					if (nullToEmpty(opener) != "" && $('#btnSearch' , opener.document).val() != undefined) {
						$('#btnSearch' , opener.document).click();
					}
					if (nullToEmpty(opener) != "" &&  $('#btnOpenerSeach' , opener.document).val() != undefined) {
						$('#btnOpenerSeach' , opener.document).click();
					}
					
				} else {
					//alertBox('W', "");
					return;
				}
			})
	  .fail(function(response){
		  		cflineHideProgressBody();
		  		//console.log(response);
			  	//alertBox('W', "");
				return;
		  	});
}

/**
 * 
 * 20181205 AddApprovalAdmin.js
 * 회선 승인자 사용권한 설정
 * 
 * @param callGubun : service, ring
 * 				 param : userId, svlnLclCd. svlnSclCd, topoSclCd
 * @flag : chkAprv
 * 
 * 서비스회선관리 : RU, B2B, 기타-중계기정합장치
 * 링관리 : 5G-PON링, SMUX링
 * 
 * =============================================
 * 
 * 승인자인 경우만(USE_YN == "Y") 승인버튼이 보인다.
 * 운영자의 경우 CM_LINE_APRV_USER_INF 테이블에 ID를 추가하면 해지승인권한이 주어짐
 * 
 */
function aprvAminChk(callGubun, userId) {
	var aprvParam = { "userId" : userId };

	if ( callGubun == "service" || callGubun == "ring" ) {
		Tango.ajax({
			url: 'tango-transmission-biz/transmisson/configmgmt/cfline/lineaprvuser/checkAuthority',
			data: aprvParam,
			method: 'GET',
			flag: 'checkAuthority'
		}).done( function ( response ) {
			if ( nullToEmpty(response) != "" ) {
				if ( response[0].useYn == "Y" ) {
					chkAprv = "Y";
					$('#chkAprv').val(chkAprv);
				}
				else {
					chkAprv = "N";
					$('#chkAprv').val(chkAprv);
				}
			}
			else {
				chkAprv = "N";
				$('#chkAprv').val(chkAprv);
			}
			
		} )
		.fail( function ( response ) {
			// 권한 체크 실패
			alertBox("W","권한 조회에 실패했습니다.");
		} );
	}
}
/*
########################중요 사항################################
	그리드에 복사로 입력하면 "\n"과 " " 이 추가 되는 현상이 발생함.
	따라서 아래와 같이 해당값을 없애는 기능을 추가함. 
########################중요 사항################################
 */
function replaceToEmpty(value) {
	var result = "";
	if(value != null){
		result = value.split("\n").join("").replace(/^\s+|\s+$/g,"");
		result = result.split("  ").join(" ").replace(/^\s+|\s+$/g,"");
	}
	return result;
}

/* =============================================
 * 20190103 추가 
 * 문자의 byte 계산  
 * ch : char 형식 문자 하나에 대한 byte 계산(UTF-8기준)
 * =============================================
 */

function charByteSize(ch){
	if(ch == null || ch.length == 0){
		return 0;
	}
	
	var charCode = ch.charCodeAt(0);
	if(charCode <= 0x00007F){
		return 1;
	}else if(charCode <= 0x0007FF){
		return 2;
	}else if(charCode <= 0x00FFFF){
		return 3;
	}else{
		return 4;
	}
	
}

/* =============================================
 * 20190103 추가 
 * 문자열의 byte 계산
 * str : char , string 등 문자열 
 * =============================================
 */
function getLengthB(str){
	if(str == null || str.length == 0){
		return 0;
	}
	
	var size = 0;
	
	for(var i = 0; i < str.length; i++){
		size += charByteSize(str.charAt(i));
	}
	
	return size;
}

/* =============================================
 * 20190103 추가 
 * 문자열을 입력한 byte까지만 남기고 substring
 * str : char , string 등 문자열 
 * len : 문자열을 substring할 기준 byte 수 
 * =============================================
 */
function cutLengthB(str, len){
	if(str == null || str.length == 0){
		return 0;
	}
	
	var size = 0;
	var rIndex = str.length;
	
	for(var i = 0; i < str.length; i++){
		size += charByteSize(str.charAt(i));
		
		if(size == len){
			rIndex = i+1;
			break;
		}else if(size > len){
			rIndex = i;
			break;
		}
	}
	
	return str.substring(0,rIndex);
}

/* =============================================
 * 20190103 추가 
 * 문자열을 입력한 byte까지만 남기고 substring
 * =============================================
 */
function chkLineNm(obj){
	var strLineNm = nullToEmpty(obj.value);
	   if(getLengthB(strLineNm) > 200){
		   alertBox('I', "회선명은 200Byte까지만 입력됩니다.<br>(참조 : 한글 3Byte, 영문 및 숫자 1Byte)");
		   obj.value = cutLengthB(strLineNm, 200);
	   }
}

/**
 * setRuNetCfgMeans
 * RU회선_중계기의 경우 선번의 구성을 보고 망구성방식코드를 업데이트 함(선번편집, 대표회선설정, 대표회선 선번복제, 해지, 복원) 등의 작업에서 호출됨
 * @param ruParam = > lineNoStr : 서비스회선번호(xxx,xxx,xxx) , editType : 편집형태(B:기본정보변경, E : 선번정보변경, O:대표회선번호변경)
 * @param editType
 */
function setRuNetCfgMeans(ruParam) {
		//console.log(ruParam);
		// 20190104 망구성방식코드 반영될때 return 주석처리함
		//return;
		Tango.ajax({
			url : 'tango-transmission-biz/transmisson/configmgmt/cfline/serviceline/updaterunetcfgmeans', 
			data : ruParam, //data가 존재할 경우 주입
			method : 'GET', //HTTP Method
			flag : 'setRuNetCfgMeans'
		}).done(function(response){
					//console.log(response);
				})
		  .fail(function(response){
			  	//console.log(response);
			  	});
}


/**
 * 링중 MESH링, Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038)의 경우 링을 사용링으로 사용하는 경우 관련 정보 체크
 * checkUseRingNtwk(checkParam)
 * @param editRingId : 수정링번호, mainPathData : 주선번(LINKS)정보, subPathData : 예비선번(LINKS)정보, editPathType : 편집화면 타입(OP-구선번창, NP-시각화선번창) 
 * 
 */
function checkUseRingNtwk(checkParam) {
	
	var useRingInfoParam = makeParamToCheckUseRing(checkParam);   
	
	// 사용링 정보가 없는 경우
	if (nullToEmpty(useRingInfoParam.editRingId) == "") {
		savePath();
		return;
	}
   
	cflineShowProgressBody();
	
	Tango.ajax({
		url : 'tango-transmission-biz/transmisson/configmgmt/cfline/useringronttrunk/getuseringinfo', 
		data : useRingInfoParam, //data가 존재할 경우 주입
		method : 'GET', //HTTP Method
		flag : 'getuseringinfo'
	}).done(function(response){
				//console.log(response);
				cflineHideProgressBody();
				if (nullToEmpty(response.useRingInfo) != "" ) {
					if (nullToEmpty(response.useRingInfo.result) == "Y") {

						cflineShowProgressBody();
						savePath();	
					} else {						
						alertBox('W', response.useRingInfo.ngMsg);
						if (nullToEmpty(checkParam.editPathType == "OP")) {
							$("#"+detailGridId).alopexGrid("startEdit");
		    				$("#"+reserveGrid).alopexGrid("startEdit");
						}
						return;
					}				
				} else {
					alertBox('W', "사용 링 정보 조회에 실패했습니다.");
					if (nullToEmpty(checkParam.editPathType == "OP")) {
						$("#"+detailGridId).alopexGrid("startEdit");
	    				$("#"+reserveGrid).alopexGrid("startEdit");
					}
					return;
				}
			})
	  .fail(function(response){
		  		cflineHideProgressBody();
		  		//console.log(response);
			  	alertBox('W', "사용 링 정보 조회에 실패했습니다.");
				if (nullToEmpty(checkParam.editPathType == "OP")) {
					$("#"+detailGridId).alopexGrid("startEdit");
    				$("#"+reserveGrid).alopexGrid("startEdit");
				}
				return;
		  	});
}

function makeParamToCheckUseRing(checkParam) {
    var useRingInfoParam = {};     
	
	// 주선번에서 사용링정보가 존재하는지 체크
	if (checkParam.mainPathData != "" && checkParam.mainPathData != null && checkParam.mainPathData.length > 0) {
		var tmpUseRingIdStr = "";
		for (var i = 0 ; i < checkParam.mainPathData.length; i++) {
			if (nullToEmpty(checkParam.mainPathData[i].RING_ID) != "" && nullToEmpty(checkParam.mainPathData[i].RING_ID).indexOf("alopex") < 0) {
				if (tmpUseRingIdStr.indexOf(checkParam.mainPathData[i].RING_ID) < 0) {
					tmpUseRingIdStr += (tmpUseRingIdStr != "" ? "," : "") + checkParam.mainPathData[i].RING_ID;
				}
			}
		}
		
		if (tmpUseRingIdStr != "") {
			useRingInfoParam.editRingId = checkParam.editRingId;
			useRingInfoParam.usedRingId = tmpUseRingIdStr;	
			// 가입자망 링의 경유링 사용으로 선번그룹일련번호를 넘겨주기로 함
			useRingInfoParam.editRingLnoGrpSrno = checkParam.lnoGrpSrno;
		}
	}
	
	// 주선번에서 사용링정보가 존재하는지 체크
	if (checkParam.subPathData != "" && checkParam.subPathData != null && checkParam.subPathData.length > 0) {
		var tmpSprUseRingIdStr = "";
		for (var i = 0 ; i < checkParam.subPathData.length; i++) {
			if (nullToEmpty(checkParam.subPathData[i].RING_ID) != "" && nullToEmpty(checkParam.subPathData[i].RING_ID).indexOf("alopex") < 0) {
				if (tmpSprUseRingIdStr.indexOf(checkParam.subPathData[i].RING_ID) < 0) {
					tmpSprUseRingIdStr += (tmpSprUseRingIdStr != "" ? "," : "") + checkParam.subPathData[i].RING_ID;
				}
			}
		}
		
		if (tmpSprUseRingIdStr != "") {
			useRingInfoParam.editRingId = checkParam.editRingId;
			useRingInfoParam.usedSprRingId = tmpSprUseRingIdStr;			
		}
	}
	
	return useRingInfoParam;   
}

/**
 * 링중  Ring(001), IBS(011), IBRR(015), IVS(037), IVRR(038), MSPP(032), Free(005), PTS링(009), L3_Switch링(012), T2IP링(016)의 경우 링을 사용링으로 사용할 수 있음
 * isAbleViaRing(topoSclCd)
 * 
 * [추가] 2020-05-15 망종류 smux(035) 추가
 * 만약 종류가 늙어나는 경우 RingServiceImpl.java, RingList.js 의 chkCascadRingInfo 에도 추가가 필요함
 * 
 * [추가] 2020-08-03 망종류 가입자망링(031) 추가
 * 
 * @param true / false
 */
function isAbleViaRing(chkTopoSclCd) {
	// 만약 종류가 늙어나는 경우 RingServiceImpl.java 의 chkCascadRingInfo 에도 추가가 필요함
	if (chkTopoSclCd == "001" || chkTopoSclCd == "011" || chkTopoSclCd == "015" || chkTopoSclCd == "037" || chkTopoSclCd == "038"
		|| chkTopoSclCd == "032" || chkTopoSclCd == "005" || chkTopoSclCd == "009" || chkTopoSclCd == "012" || chkTopoSclCd == "016"
			||  chkTopoSclCd == "035" ||  chkTopoSclCd == "031" ) {
		return true;
	}
	return false;
}


/**
 * 링중  MESH링(020)의 경우 PTP링 /MW PTP링을 사용링으로 사용할 수 있음
 * isAbleViaRing(topoSclCd)
 * @param true / false
 */
function isMeshRing(chkTopoSclCd) {
	if (chkTopoSclCd == "020" ) {
		return true;
	}
	return false;
}

/**
 * 선로리스트 팝업에서 선택된 장비리스트의 값을 셋팅한다.
 * 
 */
function addEqpFdfData(eqpData, key) {
	var addData = {};
	
	if(eqpData != null) {
		if(key == "L") {
			
			addData.LEFT_NE_ID = nullToEmpty(eqpData.eqpId);
			addData.LEFT_NE_NM = nullToEmpty(eqpData.eqpNm);
			
			addData.LEFT_PORT_ID = nullToEmpty(eqpData.portId);
			addData.LEFT_PORT_NM = nullToEmpty(eqpData.portNm);
	
			addData.LEFT_ORG_NM = nullToEmpty(eqpData.mtsoNm);
			addData.LEFT_MODEL_NM = nullToEmpty(eqpData.eqpMdlNm);
			addData.LEFT_MODEL_LCL_NM = nullToEmpty(eqpData.eqpMdlLclCdNm);
			addData.LEFT_MODEL_MCL_NM = nullToEmpty(eqpData.eqpMdlMclCdNm);
			addData.LEFT_MODEL_SCL_NM = nullToEmpty(eqpData.eqpMdlSclCdNm);
			addData.LEFT_NE_STATUS_NM = nullToEmpty(eqpData.portStatCdNm);
	
			addData.LEFT_JRDT_TEAM_ORG_ID = nullToEmpty(eqpData.jrdtTeamOrgId);
			addData.LEFT_JRDT_TEAM_ORG_NM = nullToEmpty(eqpData.jrdtTeamOrgNm);
			addData.LEFT_MODEL_ID = nullToEmpty(eqpData.eqpMdlId);
			addData.LEFT_MODEL_LCL_CD = nullToEmpty(eqpData.modelLclCd);
			addData.LEFT_MODEL_LCL_NM = nullToEmpty(eqpData.modelLclNm);
			addData.LEFT_MODEL_MCL_CD = nullToEmpty(eqpData.modelMclCd);
			addData.LEFT_MODEL_MCL_NM = nullToEmpty(eqpData.modelMclNm);
			addData.LEFT_MODEL_NM = nullToEmpty(eqpData.modelNm);
			addData.LEFT_MODEL_SCL_CD = nullToEmpty(eqpData.modelSclCd);
			addData.LEFT_MODEL_SCL_NM = nullToEmpty(eqpData.modelSclNm);
			addData.LEFT_NE_DUMMY = nullToEmpty(eqpData.neDummy);
			addData.LEFT_NE_ID = nullToEmpty(eqpData.neId);
			addData.LEFT_NE_NM = nullToEmpty(eqpData.eqpNm);
			addData.LEFT_NE_ROLE_CD = nullToEmpty(eqpData.neRoleCd);
			addData.LEFT_NE_ROLE_NM = nullToEmpty(eqpData.neRoleNm);
			
			addData.LEFT_NE_STATUS_ID = nullToEmpty(eqpData.neStatusCd);
			addData.LEFT_NE_STATUS_NM = nullToEmpty(eqpData.neStatusNm);
			addData.LEFT_OP_TEAM_ORG_ID = nullToEmpty(eqpData.opTeamOrgId);
			addData.LEFT_ORG_ID = nullToEmpty(eqpData.orgId);
			addData.LEFT_ORG_ID_L3 = nullToEmpty(eqpData.orgIdL3);
			addData.LEFT_ORG_NM = nullToEmpty(eqpData.orgNm);
			addData.LEFT_ORG_NM_L3 = nullToEmpty(eqpData.orgNmL3);
			addData.LEFT_PORT_DESCR = nullToEmpty(eqpData.portDescr);
			addData.LEFT_PORT_DUMMY = nullToEmpty(eqpData.portDummy);
			
			addData.LEFT_PORT_STATUS_CD = nullToEmpty(eqpData.portStatCd);
			addData.LEFT_PORT_STATUS_NM = nullToEmpty(eqpData.portStatNm);
			addData.LEFT_VENDOR_ID = nullToEmpty(eqpData.vendorId);
			addData.LEFT_VENDOR_NM = nullToEmpty(eqpData.vendorNm);

			
			addData.LEFT_CARD_ID = nullToEmpty(eqpData.cardId);
			addData.LEFT_CARD_MODEL_ID = nullToEmpty(eqpData.cardModelId);
			addData.LEFT_CARD_MODEL_NM = nullToEmpty(eqpData.cardModelNm);
			addData.LEFT_CARD_NM = nullToEmpty(eqpData.cardNm);
			addData.LEFT_CARD_STATUS_CD = nullToEmpty(eqpData.cardStatusCd);
			addData.LEFT_CARD_STATUS_NM = nullToEmpty(eqpData.cardStatusNm);
			addData.LEFT_CARD_WAVELENGTH = nullToEmpty(eqpData.cardWavelength);
			addData.LEFT_CHANNEL_DESCR = nullToEmpty(eqpData.channelDescr);
			
			if(nullToEmpty(eqpData.rxPortId) != '') {
				
				addData.LEFT_RX_NE_ID = nullToEmpty(eqpData.eqpId);
				addData.LEFT_RX_NE_NM =  nullToEmpty(eqpData.eqpNm);
				addData.LEFT_RX_PORT_ID = nullToEmpty(eqpData.rxPortId);
				
				addData.LEFT_RX_PORT_DUMMY = nullToEmpty(eqpData.rxPortDummy);
				addData.LEFT_RX_PORT_NM = nullToEmpty(eqpData.rxPortNm);
				addData.LEFT_RX_PORT_STATUS_CD = nullToEmpty(eqpData.rxPortStatusCd);
				addData.LEFT_RX_PORT_STATUS_NM = nullToEmpty(eqpData.rxPortStatusNm);

			}

		}
		
		if(key == "R") {
			
			addData.RIGHT_NE_ID = nullToEmpty(eqpData.eqpId);
			addData.RIGHT_NE_NM = nullToEmpty(eqpData.eqpNm);
	
			addData.RIGHT_PORT_ID = nullToEmpty(eqpData.portId);
			addData.RIGHT_PORT_NM = nullToEmpty(eqpData.portNm);
	
			addData.RIGHT_ORG_NM = nullToEmpty(eqpData.mtsoNm);
			addData.RIGHT_MODEL_NM = nullToEmpty(eqpData.eqpMdlNm);
			addData.RIGHT_MODEL_LCL_NM = nullToEmpty(eqpData.eqpMdlLclCdNm);
			addData.RIGHT_MODEL_MCL_NM = nullToEmpty(eqpData.eqpMdlMclCdNm);
			addData.RIGHT_MODEL_SCL_NM = nullToEmpty(eqpData.eqpMdlSclCdNm);
			addData.RIGHT_NE_STATUS_NM = nullToEmpty(eqpData.portStatCdNm);
			
			addData.RIGHT_JRDT_TEAM_ORG_ID = nullToEmpty(eqpData.jrdtTeamOrgId);
			addData.RIGHT_JRDT_TEAM_ORG_NM = nullToEmpty(eqpData.jrdtTeamOrgNm);
			addData.RIGHT_MODEL_ID = nullToEmpty(eqpData.eqpMdlId);
			addData.RIGHT_MODEL_LCL_CD = nullToEmpty(eqpData.modelLclCd);
			addData.RIGHT_MODEL_LCL_NM = nullToEmpty(eqpData.modelLclNm);
			addData.RIGHT_MODEL_MCL_CD = nullToEmpty(eqpData.modelMclCd);
			addData.RIGHT_MODEL_MCL_NM = nullToEmpty(eqpData.modelMclNm);
			addData.RIGHT_MODEL_NM = nullToEmpty(eqpData.modelNm);
			addData.RIGHT_MODEL_SCL_CD = nullToEmpty(eqpData.modelSclCd);
			addData.RIGHT_MODEL_SCL_NM = nullToEmpty(eqpData.modelSclNm);
			addData.RIGHT_NE_DUMMY = nullToEmpty(eqpData.neDummy);
			addData.RIGHT_NE_ID = nullToEmpty(eqpData.neId);
			addData.RIGHT_NE_NM = nullToEmpty(eqpData.eqpNm);
			addData.RIGHT_NE_ROLE_CD = nullToEmpty(eqpData.neRoleCd);
			addData.RIGHT_NE_ROLE_NM = nullToEmpty(eqpData.neRoleNm);

			
			addData.RIGHT_NE_STATUS_ID = nullToEmpty(eqpData.neStatusCd);
			addData.RIGHT_NE_STATUS_NM = nullToEmpty(eqpData.neStatusNm);
			addData.RIGHT_OP_TEAM_ORG_ID = nullToEmpty(eqpData.opTeamOrgId);
			addData.RIGHT_ORG_ID = nullToEmpty(eqpData.orgId);
			addData.RIGHT_ORG_ID_L3 = nullToEmpty(eqpData.orgIdL3);
			addData.RIGHT_ORG_NM = nullToEmpty(eqpData.orgNm);
			addData.RIGHT_ORG_NM_L3 = nullToEmpty(eqpData.orgNmL3);
			addData.RIGHT_PORT_DESCR = nullToEmpty(eqpData.portDescr);
			addData.RIGHT_PORT_DUMMY = nullToEmpty(eqpData.portDummy);
			
			addData.RIGHT_PORT_STATUS_CD = nullToEmpty(eqpData.portStatCd);
			addData.RIGHT_PORT_STATUS_NM = nullToEmpty(eqpData.portStatNm);
			addData.RIGHT_VENDOR_ID = nullToEmpty(eqpData.vendorId);
			addData.RIGHT_VENDOR_NM = nullToEmpty(eqpData.vendorNm);
			

			addData.RIGHT_CARD_ID = nullToEmpty(eqpData.cardId);
			addData.RIGHT_CARD_MODEL_ID = nullToEmpty(eqpData.cardModelId);
			addData.RIGHT_CARD_MODEL_NM = nullToEmpty(eqpData.cardModelNm);
			addData.RIGHT_CARD_NM = nullToEmpty(eqpData.cardNm);
			addData.RIGHT_CARD_STATUS_CD = nullToEmpty(eqpData.cardStatusCd);
			addData.RIGHT_CARD_STATUS_NM = nullToEmpty(eqpData.cardStatusNm);
			addData.RIGHT_CARD_WAVELENGTH = nullToEmpty(eqpData.cardWavelength);
			addData.RIGHT_CHANNEL_DESCR = nullToEmpty(eqpData.channelDescr);
			
			if(nullToEmpty(eqpData.rxPortId) != '') {

				addData.RIGHT_RX_NE_ID = nullToEmpty(eqpData.eqpId);
				addData.RIGHT_RX_NE_NM =  nullToEmpty(eqpData.eqpNm);
				addData.RIGHT_RX_PORT_ID = nullToEmpty(eqpData.rxPortId);
				
				addData.RIGHT_RX_PORT_DUMMY = nullToEmpty(eqpData.rxPortDummy);
				addData.RIGHT_RX_PORT_NM = nullToEmpty(eqpData.rxPortNm);
				addData.RIGHT_RX_PORT_STATUS_CD = nullToEmpty(eqpData.rxPortStatusCd);
				addData.RIGHT_RX_PORT_STATUS_NM = nullToEmpty(eqpData.rxPortStatusNm);
			}
		}

	}

	return addData;
}

/*
 * 상위OLT장비 설정
 */
function setOltEqpData(eqpData, key) {
	var addData = {};
	
	if(eqpData != null) {
		if(key == "L") {
			
			addData.LEFT_NE_ID = nullToEmpty(eqpData.lftEqpId);	//
			addData.LEFT_NE_NM = nullToEmpty(eqpData.lftEqpNm);	//
			
			addData.LEFT_PORT_ID = nullToEmpty(eqpData.portId);
			addData.LEFT_PORT_NM = nullToEmpty(eqpData.portNm);
	
			addData.LEFT_ORG_NM = nullToEmpty(eqpData.lftTopMtsoId);	//
			addData.LEFT_MODEL_NM = nullToEmpty(eqpData.eqpMdlNm);
			addData.LEFT_MODEL_LCL_NM = nullToEmpty(eqpData.eqpMdlLclCdNm);
			addData.LEFT_MODEL_MCL_NM = nullToEmpty(eqpData.eqpMdlMclCdNm);
			addData.LEFT_MODEL_SCL_NM = nullToEmpty(eqpData.eqpMdlSclCdNm);
			addData.LEFT_NE_STATUS_NM = nullToEmpty(eqpData.portStatCdNm);
	
			addData.LEFT_JRDT_TEAM_ORG_ID = nullToEmpty(eqpData.jrdtTeamOrgId);
			addData.LEFT_JRDT_TEAM_ORG_NM = nullToEmpty(eqpData.jrdtTeamOrgNm);
			addData.LEFT_MODEL_ID = nullToEmpty(eqpData.eqpMdlId);
			addData.LEFT_MODEL_LCL_CD = nullToEmpty(eqpData.modelLclCd);
			addData.LEFT_MODEL_LCL_NM = nullToEmpty(eqpData.modelLclNm);
			addData.LEFT_MODEL_MCL_CD = nullToEmpty(eqpData.modelMclCd);
			addData.LEFT_MODEL_MCL_NM = nullToEmpty(eqpData.modelMclNm);
			addData.LEFT_MODEL_NM = nullToEmpty(eqpData.modelNm);
			addData.LEFT_MODEL_SCL_CD = nullToEmpty(eqpData.modelSclCd);
			addData.LEFT_MODEL_SCL_NM = nullToEmpty(eqpData.modelSclNm);
			addData.LEFT_NE_DUMMY = nullToEmpty(eqpData.neDummy);
			
			addData.LEFT_NE_ROLE_CD = nullToEmpty(eqpData.lftEqpRoleDivCd);	//
			addData.LEFT_NE_ROLE_NM = nullToEmpty(eqpData.neRoleNm);
			
			addData.LEFT_NE_STATUS_ID = nullToEmpty(eqpData.neStatusCd);
			addData.LEFT_NE_STATUS_NM = nullToEmpty(eqpData.neStatusNm);
			addData.LEFT_OP_TEAM_ORG_ID = nullToEmpty(eqpData.opTeamOrgId);
			addData.LEFT_ORG_ID = nullToEmpty(eqpData.lftTopMtsoId);	//
			addData.LEFT_ORG_ID_L3 = nullToEmpty(eqpData.orgIdL3);
			addData.LEFT_ORG_NM = nullToEmpty(eqpData.lftTopMtsoNm);	//
			addData.LEFT_ORG_NM_L3 = nullToEmpty(eqpData.orgNmL3);
			addData.LEFT_PORT_DESCR = nullToEmpty(eqpData.portDescr);
			addData.LEFT_PORT_DUMMY = nullToEmpty(eqpData.portDummy);
			
			addData.LEFT_PORT_STATUS_CD = nullToEmpty(eqpData.portStatCd);
			addData.LEFT_PORT_STATUS_NM = nullToEmpty(eqpData.portStatNm);
			addData.LEFT_VENDOR_ID = nullToEmpty(eqpData.vendorId);
			addData.LEFT_VENDOR_NM = nullToEmpty(eqpData.vendorNm);

			
			addData.LEFT_CARD_ID = nullToEmpty(eqpData.cardId);
			addData.LEFT_CARD_MODEL_ID = nullToEmpty(eqpData.cardModelId);
			addData.LEFT_CARD_MODEL_NM = nullToEmpty(eqpData.cardModelNm);
			addData.LEFT_CARD_NM = nullToEmpty(eqpData.cardNm);
			addData.LEFT_CARD_STATUS_CD = nullToEmpty(eqpData.cardStatusCd);
			addData.LEFT_CARD_STATUS_NM = nullToEmpty(eqpData.cardStatusNm);
			addData.LEFT_CARD_WAVELENGTH = nullToEmpty(eqpData.cardWavelength);
			addData.LEFT_CHANNEL_DESCR = nullToEmpty(eqpData.channelDescr);
		
		}
		
		if(key == "R") {
			
			addData.RIGHT_NE_ID = nullToEmpty(eqpData.rghtEqpId);	//
			addData.RIGHT_NE_NM = nullToEmpty(eqpData.rghtEqpNm);	//
	
			addData.RIGHT_PORT_ID = nullToEmpty(eqpData.portId);
			addData.RIGHT_PORT_NM = nullToEmpty(eqpData.portNm);
	
			addData.RIGHT_ORG_NM = nullToEmpty(eqpData.rghtTopMtsoNm);	//
			addData.RIGHT_MODEL_NM = nullToEmpty(eqpData.eqpMdlNm);
			addData.RIGHT_MODEL_LCL_NM = nullToEmpty(eqpData.eqpMdlLclCdNm);
			addData.RIGHT_MODEL_MCL_NM = nullToEmpty(eqpData.eqpMdlMclCdNm);
			addData.RIGHT_MODEL_SCL_NM = nullToEmpty(eqpData.eqpMdlSclCdNm);
			addData.RIGHT_NE_STATUS_NM = nullToEmpty(eqpData.portStatCdNm);
			
			addData.RIGHT_JRDT_TEAM_ORG_ID = nullToEmpty(eqpData.jrdtTeamOrgId);
			addData.RIGHT_JRDT_TEAM_ORG_NM = nullToEmpty(eqpData.jrdtTeamOrgNm);
			addData.RIGHT_MODEL_ID = nullToEmpty(eqpData.eqpMdlId);
			addData.RIGHT_MODEL_LCL_CD = nullToEmpty(eqpData.modelLclCd);
			addData.RIGHT_MODEL_LCL_NM = nullToEmpty(eqpData.modelLclNm);
			addData.RIGHT_MODEL_MCL_CD = nullToEmpty(eqpData.modelMclCd);
			addData.RIGHT_MODEL_MCL_NM = nullToEmpty(eqpData.modelMclNm);
			addData.RIGHT_MODEL_NM = nullToEmpty(eqpData.modelNm);
			addData.RIGHT_MODEL_SCL_CD = nullToEmpty(eqpData.modelSclCd);
			addData.RIGHT_MODEL_SCL_NM = nullToEmpty(eqpData.modelSclNm);
			addData.RIGHT_NE_DUMMY = nullToEmpty(eqpData.neDummy);
			addData.RIGHT_NE_ROLE_CD = nullToEmpty(eqpData.rghtEqpRoleDivCd);	//
			addData.RIGHT_NE_ROLE_NM = nullToEmpty(eqpData.neRoleNm);

			
			addData.RIGHT_NE_STATUS_ID = nullToEmpty(eqpData.neStatusCd);
			addData.RIGHT_NE_STATUS_NM = nullToEmpty(eqpData.neStatusNm);
			addData.RIGHT_OP_TEAM_ORG_ID = nullToEmpty(eqpData.opTeamOrgId);
			addData.RIGHT_ORG_ID = nullToEmpty(eqpData.rghtTopMtsoId);	//
			addData.RIGHT_ORG_ID_L3 = nullToEmpty(eqpData.orgIdL3);
			addData.RIGHT_ORG_NM = nullToEmpty(eqpData.rghtTopMtsoNm);	//
			addData.RIGHT_ORG_NM_L3 = nullToEmpty(eqpData.orgNmL3);
			addData.RIGHT_PORT_DESCR = nullToEmpty(eqpData.portDescr);
			addData.RIGHT_PORT_DUMMY = nullToEmpty(eqpData.portDummy);
			
			addData.RIGHT_PORT_STATUS_CD = nullToEmpty(eqpData.portStatCd);
			addData.RIGHT_PORT_STATUS_NM = nullToEmpty(eqpData.portStatNm);
			addData.RIGHT_VENDOR_ID = nullToEmpty(eqpData.vendorId);
			addData.RIGHT_VENDOR_NM = nullToEmpty(eqpData.vendorNm);
			

			addData.RIGHT_CARD_ID = nullToEmpty(eqpData.cardId);
			addData.RIGHT_CARD_MODEL_ID = nullToEmpty(eqpData.cardModelId);
			addData.RIGHT_CARD_MODEL_NM = nullToEmpty(eqpData.cardModelNm);
			addData.RIGHT_CARD_NM = nullToEmpty(eqpData.cardNm);
			addData.RIGHT_CARD_STATUS_CD = nullToEmpty(eqpData.cardStatusCd);
			addData.RIGHT_CARD_STATUS_NM = nullToEmpty(eqpData.cardStatusNm);
			addData.RIGHT_CARD_WAVELENGTH = nullToEmpty(eqpData.cardWavelength);
			addData.RIGHT_CHANNEL_DESCR = nullToEmpty(eqpData.channelDescr);

		}

	}

	return addData;
}


/**
문자열의 모든 공백을 제거한 값 반환
*/
function clearOfAllSpace(value) {
	var result = "";
	if(nullToEmpty(value) != ""){
		result = value.replace(/ /gi,"");
	}
	return result;
}
